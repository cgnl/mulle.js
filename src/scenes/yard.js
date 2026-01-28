'use strict'

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleButton from '../objects/button'
import MulleCarPart from '../objects/carpart'
import MulleActor from '../objects/actor'
import SubtitleLoader from '../objects/SubtitleLoader'
import MulleMissions from '../struct/missions'

class YardState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('yard', 'assets/yard.json', null, this)
    this.game.load.pack('garage', 'assets/garage.json', null, this)
    this.subtitles = new SubtitleLoader(this.game, 'yard', ['dutch', 'english'])
    this.subtitles.preload()
  }

  create () {
    super.create()
    this.game.mulle.addAudio('yard')
    this.game.mulle.addAudio('garage')
    this.subtitles.load()

    this.car = null
    this.junkParts = null
    this.door_side = null
    this.door_garage = null

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 800

    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('04.DXR', 37)
    this.game.add.existing(background)

    // Mission system
    this.missionSystem = new MulleMissions(this.game)
    const mailMission = this.missionSystem.getPendingMailMission()
    const phoneMission = this.missionSystem.getPendingTelephoneMission()

    // Mailbox (EXACT Lingo implementation from MailBH)
    let mailbox
    if (mailMission) {
      // Mail has arrived - show full mailbox (02b005v0)
      mailbox = new MulleButton(this.game, 320, 240, {
        imageDefault: ['CDDATA.CXT', 906], // 02b005v0 from Lingo
        click: () => {
          this.kickMail(mailMission)
        }
      })
    } else {
      // Empty mailbox (04n001v0)
      mailbox = new MulleButton(this.game, 320, 240, {
        imageDefault: ['04.DXR', 42],
        imageHover: ['04.DXR', 43],
        soundDefault: '04e009v0',
        soundHover: '04e010v0',
        click: () => {
          if (this.mulleActor) {
            this.mulleActor.talk('04d001v0') // No mail
          }
        }
      })
    }
    this.game.add.existing(mailbox)
    this.mailbox = mailbox

    // Telephone system (checking for missions)
    if (phoneMission) {
      // Trigger phone ringing
      this.kickTelephone(phoneMission)
    }

    if (this.game.mulle.user.toYardThroughDoor) {
      // without car

      this.door_side = new MulleButton(this.game, 320, 240, {
        imageDefault: ['04.DXR', 13],
        imageHover: ['04.DXR', 14],
        soundDefault: '02e015v0',
        soundHover: '02e016v0',
        click: (a) => {
          this.game.mulle.activeCutscene = '00b011v0'
          this.game.state.start('garage')
        }
      })
      this.game.add.existing(this.door_side)

      this.door_garage = new MulleButton(this.game, 320, 240, {
        imageDefault: ['04.DXR', 40],
        imageHover: ['04.DXR', 41],
        soundDefault: '02e015v0',
        soundHover: '02e016v0',
        click: (a) => {
          this.game.mulle.activeCutscene = '00b016v0'
          this.game.state.start('garage')
        }
      })
      this.game.add.existing(this.door_garage)

      this.door_side.cursor = 'Right'
      this.door_side.cursorHover = 'Right'
      this.door_side.cursorDrag = 'MoveRight'

      this.mulleActor = new MulleActor(this.game, 67, 173, 'mulleDefault')
      this.game.add.existing(this.mulleActor)
      this.buffaActor = new MulleActor(this.game, 320, 350, 'buffa')
      this.buffaActor.animations.play('idle')
      this.game.add.existing(this.buffaActor)
      this.game.mulle.actors.buffa = this.buffaActor
      
      // Random animations
      this.game.time.events.loop(6000, () => {
        var rand = Math.random()
        if (rand > 0.7) {
          this.buffaActor.animations.play('bark')
        } else if (rand > 0.4) {
          this.buffaActor.animations.play('scratch1')
        }
      })

      if(this.game.mulle.user.figgeBeenHere === 1) {
        this.game.mulle.user.figgeBeenHere = 0
        this.mulleActor.talk('04d021v0')
      }
      if(this.game.mulle.user.mail === 1) {
        this.mulleActor.talk('04d020v0')
      }

    } else {
      // with car

      var go_road = new MulleButton(this.game, 320, 240, {
        imageDefault: ['04.DXR', 16],
        click: (a) => {
          this.game.mulle.activeCutscene = '00b008v0'
          this.game.mulle.lastSession = null
          this.game.mulle.user.Car.resetCache()
          this.game.state.start('world')
        }
      })
      this.game.add.existing(go_road)
      go_road.cursor = 'Click'

      this.door_side = new MulleSprite(this.game, 320, 240)
      this.door_side.setDirectorMember('04.DXR', 13)
      this.game.add.existing(this.door_side)

      this.door_garage = new MulleButton(this.game, 320, 240, {
        imageDefault: ['04.DXR', 41],
        imageHover: ['04.DXR', 41],
        click: (a) => {
          this.game.mulle.activeCutscene = '00b015v0'
          this.game.state.start('garage')
        }
      })
      this.door_garage.hitArea = new Phaser.Rectangle(220, -190, 100, 240)
      this.game.add.existing(this.door_garage)

      this.car = new MulleBuildCar(this.game, 368, 240, null, true, true)
      this.game.add.existing(this.car)
    }

    this.door_garage.cursor = 'Right'
    this.door_garage.cursorHover = 'Right'
    this.door_garage.cursorDrag = 'MoveRight'

    this.junkParts = this.game.add.group()
    this.junkParts.pileName = 'yard'

    for (let partId in this.game.mulle.user.Junk.yard) {
      let pos = this.game.mulle.user.Junk.yard[partId]
      let cPart = new MulleCarPart(this.game, partId, pos.x, pos.y)
      cPart.junkParts = this.junkParts

      cPart.dropTargets.push([this.door_side, (d) => {
        d.destroy()
        this.game.mulle.user.Junk.shopFloor[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 }
        this.game.mulle.playAudio('00e004v0')
        return true
      }])

      cPart.dropTargets.push([this.door_garage, (d) => {
        d.destroy()
        this.game.mulle.user.Junk.shopFloor[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 }
        this.game.mulle.playAudio('00e004v0')
        return true
      }])

      this.junkParts.addChild(cPart)
    }

    this.game.mulle.playAudio('02e010v0')

    if (this.game.mulle.cheats) {
      document.getElementById('cheats').innerHTML = ''
      for (const scene of Object.values(this.game.mulle.scenes)) {
        const b = document.createElement('button')
        b.innerHTML = scene
        b.className = 'button'
        b.addEventListener('click', (e) => {
          this.game.state.start(scene, true, false, this.key)
        })
        document.getElementById('cheats').appendChild(b)
      }

      const b_mail = document.createElement('button')
      b_mail.innerHTML = 'Mail'
      b_mail.className = 'button'
      b_mail.addEventListener('click', () => {
        this.game.mulle.user.mail = 1
        console.log('Set mail to 1')
      })
      document.getElementById('cheats').appendChild(b_mail)
    }

    console.log('Yard', 'through door')
  }

  /**
   * kickTelephone - EXACT Lingo implementation from Missions.ls
   */
  kickTelephone (mission) {
    console.log('kickTelephone:', mission)
    
    // Create small phone sprite (TeleSmall)
    this.phoneSmall = new MulleSprite(this.game, 50, 50)
    this.phoneSmall.setDirectorMember('03.DXR', 20) // TeleSmall sprite
    this.game.add.existing(this.phoneSmall)
    
    this.tmpLoc = { x: 50, y: 50 }
    
    // Play ringtone (03e001v0)
    this.currentSound = this.game.mulle.playAudio('03e001v0')
    
    this.frameCount = 0
    this.currentMission = mission
    
    // Start shake animation loop
    this.shakeTimer = this.game.time.events.loop(100, () => {
      this.frameCount++
      if (this.currentSound && !this.currentSound.isPlaying) {
        this.finishPhone()
      } else {
        // Shake 2px left/right
        if ((this.frameCount % 2) === 0) {
          this.phoneSmall.x = this.tmpLoc.x - 2
        } else {
          this.phoneSmall.x = this.tmpLoc.x + 2
        }
      }
    })
  }

  /**
   * finishPhone - EXACT Lingo implementation from Missions.ls
   */
  finishPhone () {
    console.log('finishPhone')
    
    // Stop shake
    if (this.shakeTimer) {
      this.game.time.events.remove(this.shakeTimer)
    }
    
    // Reset small phone position
    if (this.phoneSmall) {
      this.phoneSmall.x = this.tmpLoc.x
      this.phoneSmall.destroy()
    }
    
    // Show big phone overlay (03b002v0)
    this.phoneBig = new MulleSprite(this.game, 320, 240)
    this.phoneBig.setDirectorMember('03.DXR', 73) // 03b002v0
    this.game.add.existing(this.phoneBig)
    
    // Play mission audio
    if (this.currentMission && this.currentMission.sound) {
      this.currentSound = this.game.mulle.playAudio(this.currentMission.sound, () => {
        this.hangUp()
      })
    }
  }

  /**
   * hangUp - EXACT Lingo implementation from Missions.ls
   */
  hangUp () {
    console.log('hangUp')
    
    // Hide big phone
    if (this.phoneBig) {
      this.phoneBig.destroy()
    }
    
    // Mark mission as given
    this.missionSystem.markAsGiven(this.currentMission.id)
    this.game.mulle.user.missionIsComing = 0
    
    this.currentMission = null
  }

  /**
   * kickMail - EXACT Lingo implementation from Missions.ls
   */
  kickMail (mission) {
    console.log('kickMail:', mission)
    
    // Mark mission as given
    this.missionSystem.markAsGiven(mission.id)
    this.game.mulle.user.missionIsComing = 0
    
    // Mission image mapping (from mission.image name to CDDATA.CXT member ID)
    // Based on assets.py: Letters are in CDDATA.CXT 19-22
    const imageMapping = {
      '50b001v0': 19,  // Mission 2: Car show
      '50b002v0': 20,  // Mission 3: Lemonade party
      '50b003v0': 21,  // Mission 7: Viola's accordion
      '50b004v0': 22   // Mission 8: Racing
    }
    
    // Show mail image overlay (centered)
    if (mission.image) {
      const memberId = imageMapping[mission.image]
      if (memberId) {
        this.mailOverlay = new MulleSprite(this.game, 320, 240)
        this.mailOverlay.setDirectorMember('CDDATA.CXT', memberId)
        this.game.add.existing(this.mailOverlay)
      } else {
        console.warn('Unknown mission image:', mission.image)
      }
    }
    
    // Play mission audio
    if (mission.sound) {
      this.currentSound = this.game.mulle.playAudio(mission.sound, () => {
        this.finishMail()
      })
    }
    
    // Also allow click to finish
    this.mailClickFinish = this.game.input.onDown.add(() => {
      if (this.currentSound && !this.currentSound.isPlaying) {
        this.finishMail()
      }
    })
  }

  /**
   * finishMail - EXACT Lingo implementation from Missions.ls
   */
  finishMail () {
    console.log('finishMail')
    
    // Hide mail overlay
    if (this.mailOverlay) {
      this.mailOverlay.destroy()
      this.mailOverlay = null
    }
    
    // Reset mailbox to empty (04n001v0)
    if (this.mailbox) {
      this.mailbox.setDirectorMember('04.DXR', 42)
    }
    
    // Remove click listener
    if (this.mailClickFinish) {
      this.game.input.onDown.remove(this.mailClickFinish)
      this.mailClickFinish = null
    }
  }

  shutdown () {
    this.game.mulle.stopAudio('02e010v0')

    console.log('shutdown yard')

    this.game.mulle.user.Junk.yard = {}

    this.junkParts.forEach((p) => {
      this.game.mulle.user.Junk.yard[ p.part_id ] = { x: p.x, y: p.y }
    })

    this.game.mulle.user.save()

    super.shutdown()
  }
}

export default YardState
