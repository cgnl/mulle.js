/**
 * Vicky Vitamijn scene (Vitamin Island)
 * @module scenes/vicky_island
 * 
 * Scene for Vicky Vitamijn quest chain
 * 
 * Quest Flow:
 * 1. Bij Peggy PC - Ondertussen: nieuwe motor + benzinetank (check in boatyard)
 * 2. Naar Vitamine eiland varen (new destination in seaworld)
 * 3. Bij Vicky: haar kweek ophalen
 * 4. Vraagt: kweek op Algeneiland water kunnen geven
 * 5. Miel zal antwoorden dat hij geen watertank heeft (algae_island.js)
 * 6. Beloning: nieuw groot zeil
 * 
 * Features:
 * - Island background
 * - Vicky NPC with dialogue
 * - Quest tracking
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'

class VickyIslandState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_80.DXR'

    this.game.mulle.addAudio('seaworld')

    if (!this.game.mulle.missionManager) {
      const { MissionManager } = require('./showboat')
      this.game.mulle.missionManager = new MissionManager(this.game)
    }
    this.missionManager = this.game.mulle.missionManager

    if (!this.game.mulle.user.Boat.hasCache('#VisitedVicky')) {
      this.game.mulle.user.Boat.addCache('#VisitedVicky')
    }

    var background = new MulleSprite(this.game, 320, 240)
    // 80b001v1 (member 17) appears to be the full-scene background in boten_80.DXR
    if (!background.setDirectorMember(this.DirResource, 17)) {
      console.warn('[VickyIsland] Missing background (boten_80.DXR:17), hiding (Dummy)')
      background.setDirectorMember('Dummy')
    }
    this.game.add.existing(background)

    this.createVicky()

    this.createIslandElements()

    this.createExitButton()

    this.routeFrame()

    this.playAmbientSounds()

    this.dialogueIndex = 0

    console.log('[VickyIsland] Scene created - Vitamin Island with Vicky')
  }

  createVicky () {
    this.vickyBody = new MulleSprite(this.game, 320, 240)
    if (!this.vickyBody.setDirectorMember(this.DirResource, 116)) {
      console.warn('[VickyIsland] Missing Vicky body sprite (boten_80.DXR:116), hiding (Dummy)')
      this.vickyBody.setDirectorMember('Dummy')
    }
    this.game.add.existing(this.vickyBody)

    this.vickyHead = new MulleSprite(this.game, 320, 240)
    if (!this.vickyHead.setDirectorMember(this.DirResource, 122)) {
      console.warn('[VickyIsland] Missing Vicky head sprite (boten_80.DXR:122), hiding (Dummy)')
      this.vickyHead.setDirectorMember('Dummy')
    }
    this.game.add.existing(this.vickyHead)

    this.vickyHead.inputEnabled = true
    this.vickyHead.input.useHandCursor = true
    this.vickyHead.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.vickyHead.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.vickyHead.events.onInputUp.add(() => {
      this.onVickyClick()
    })
  }

  createIslandElements () {
    this.plant = new MulleSprite(this.game, 450, 300)
    console.warn('[VickyIsland] Plant sprite not found in original assets, hiding (Dummy)')
    this.plant.setDirectorMember('Dummy')
    this.game.add.existing(this.plant)
  }

  createExitButton () {
    this.exitButton = this.game.add.graphics(580, 440)

    var btn = this.exitButton
    btn.beginFill(0xcc0000, 0.8)
    btn.drawCircle(0, 0, 25)
    btn.endFill()

    btn.beginFill(0xffffff, 0.9)
    btn.lineStyle(2, 0xcc0000, 1)
    btn.moveTo(-10, -10)
    btn.lineTo(10, 10)
    btn.moveTo(10, -10)
    btn.lineTo(-10, 10)
    btn.endFill()

    btn.inputEnabled = true
    btn.input.useHandCursor = true
    btn.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
      btn.scale.setTo(1.1, 1.1)
    })
    btn.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
      btn.scale.setTo(1, 1)
    })
    btn.events.onInputUp.add(() => {
      console.log('[VickyIsland] Returning to seaworld')
      this.game.mulle.playAudio('boten_04.DXR/04d004v0')
      this.game.state.start('seaworld')
    })
  }

  routeFrame () {
    if (this.game.mulle.user.Boat.hasCache('#VickyQuestReceived')) {
      this.checkQuestProgress()
    }
  }

  onVickyClick () {
    console.log('[VickyIsland] Vicky clicked')

    if (!this.game.mulle.user.Boat.hasCache('#VickyQuestReceived')) {
      this.giveVickyQuest()
    } else if (this.game.mulle.user.Boat.hasCache('#VickyKweekDelivered') && !this.game.mulle.user.Boat.hasCache('#VickyQuestCompleted')) {
      this.completeVickyQuest()
    } else {
      this.showRandomDialogue()
    }
  }

  giveVickyQuest () {
    this.game.mulle.playAudio('boten_80.DXR/80d001v0')

    this.game.time.events.add(2000, () => {
      this.showMessage('Hallo! Ik heb een kweek die water nodig heeft op Algeneiland!')
      this.game.mulle.user.Boat.addCache('#VickyQuestReceived')
      console.log('[VickyIsland] Quest given - Vicky needs water for kweek')
    })
  }

  checkQuestProgress () {
    if (this.game.mulle.user.Boat.hasCache('#KweekOnAlgaeWatered') && !this.game.mulle.user.Boat.hasCache('#VickyQuestCompleted')) {
      this.completeVickyQuest()
    }
  }

  completeVickyQuest () {
    this.game.mulle.playAudio('boten_80.DXR/80d002v0')

    this.game.time.events.add(2000, () => {
      this.showMessage('Bedankt! Hier is een groot zeil als beloning!')

      this.game.mulle.user.Boat.addCache('#VickyQuestCompleted')

      this.giveLargeSail()

      this.missionManager.completeSeaMission(23)

      console.log('[VickyIsland] Quest completed - Large sail awarded')
    })
  }

  giveLargeSail () {
    // BUG FIX #7: Vicky Island - Large sail part ID
    // Hardcoded to 706 - verified from original Lingo code
    // This is the correct ID for the large sail part reward
    const sailPartId = 706

    this.game.mulle.user.addPart(sailPartId)

    const notification = this.game.add.group()
    notification.x = 320
    notification.y = 240

    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x0066AA, 0.9)
    bg.drawRoundedRect(-200, -60, 400, 120, 10)
    bg.endFill()
    notification.add(bg)

    const title = this.game.add.text(0, -30, 'Nieuw Part: Groot Zeil!', {
      font: 'bold 20px Arial',
      fill: '#ffd700'
    })
    title.anchor.setTo(0.5, 0.5)
    notification.add(title)

    const sailIcon = new MulleSprite(this.game, 0, 10)
    if (!sailIcon.setDirectorMember('boten_CDDATA.CXT', '20b706v0')) {
      if (!sailIcon.setDirectorMember('boten_CDDATA.CXT', '20b706v1')) {
        console.warn('[VickyIsland] Missing sail icon (20b706v0/20b706v1), hiding (Dummy)')
        sailIcon.setDirectorMember('Dummy')
      }
    }
    sailIcon.scale.setTo(0.8, 0.8)
    notification.add(sailIcon)

    notification.alpha = 0
    this.game.add.tween(notification)
      .to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true)

    this.game.time.events.add(4000, () => {
      this.game.add.tween(notification)
        .to({ alpha: 0 }, 500, Phaser.Easing.Back.In, true)
        .onComplete.add(() => {
          notification.destroy()
        })
    })
  }

  showRandomDialogue () {
    const dialogues = [
      'Heb je mijn kweek water kunnen geven?',
      'De kweek groeit zo goed op Algeneiland!',
      'Dankjewel voor je hulp!'
    ]

    const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)]

    this.showMessage(dialogue)
  }

  playAmbientSounds () {
    this.game.mulle.playAudio('seaworld', true)
  }

  showMessage (text) {
    console.log('[VickyIsland]', text)

    const msg = this.game.add.text(320, 420, text, {
      font: '16px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    })
    msg.anchor.setTo(0.5, 0.5)
    msg.alpha = 0

    this.game.add.tween(msg)
      .to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true)

    this.game.time.events.add(3000, () => {
      this.game.add.tween(msg)
        .to({ alpha: 0 }, 300, Phaser.Easing.Cubic.In, true)
        .onComplete.add(() => {
          msg.destroy()
        })
    })
  }

  update () {
  }

  shutdown () {
    super.shutdown()

    this.game.sound.stopAll()
    console.log('[VickyIsland] Scene shutdown')
  }
}

export default VickyIslandState
