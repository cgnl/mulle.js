/**
 * Fisherman Scene
 * @module scenes/fisherman
 * 
 * Scene 79 from the original game (boten_79.DXR)
 * A fisherman on a pier/dock with his fishing rod
 * 
 * Features:
 * - Background: 79b001v1 (640x480), 79b002v0, 79b003v0, 79b004v0
 * - Fisherman NPC with body animations (move, point, Startmove)
 * - Fisherman head with talk, blink animations
 * - Fishing rod/fish elements (79a004v0)
 * - 7 dialogue clips (79d002v0 - 79d008v0)
 * 
 * Original game animation charts:
 * - headAnimChart (member 6):
 *   Still:[2], talk:[3,5,rndFrame], Wait:[2,TalkStill], TalkStill:[2],
 *   Blinkloop:[2 with occasional 4], Up:[1,2,2], Down:[2,2,1]
 * - bodyAnimChart (member 7):
 *   Still:[1], move:[1-16 cycling], Down:[9-16,1-9], 
 *   point:[1,2,3,2,1...], point2:[...], Startmove:[1-16,1]
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

class FishermanState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_79.DXR'
    this.game.mulle.addAudio('seaworld')

    // Track visit
    if (!this.game.mulle.user.Boat.hasCache('#FishermanVisited')) {
      this.game.mulle.user.Boat.addCache('#FishermanVisited')
    }

    // === BACKGROUND ===
    // 79b001v1 (member 16) = Main background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 16)) {
      console.warn('[Fisherman] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x87CEEB)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // 79b002v0 (member 12) = Pier/dock overlay (503x250)
    var pier = new MulleSprite(this.game, 320, 240)
    if (pier.setDirectorMember(this.DirResource, 12)) {
      this.game.add.existing(pier)
    }

    // 79b003v0 (member 13) = Additional element
    var element1 = new MulleSprite(this.game, 320, 240)
    if (element1.setDirectorMember(this.DirResource, 13)) {
      this.game.add.existing(element1)
    }

    // === FISHERMAN BODY ===
    // Body sprites are members 29-60 (79a002v0 and 79a003v0 series)
    // Two sets: frames 1-16 and 17-32
    this.fishermanBody = new MulleSprite(this.game, 320, 240)
    this.fishermanBody.setDirectorMember(this.DirResource, 29) // First body frame
    this.game.add.existing(this.fishermanBody)
    this.setupBodyAnimations()

    // === FISHERMAN HEAD ===
    // Head sprites are members 61-65 (79a001v0 series)
    this.fishermanHead = new MulleSprite(this.game, 320, 240)
    this.fishermanHead.setDirectorMember(this.DirResource, 61) // First head frame
    this.game.add.existing(this.fishermanHead)
    this.setupHeadAnimations()

    // Make fisherman clickable
    this.fishermanHead.inputEnabled = true
    this.fishermanHead.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.fishermanHead.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.fishermanHead.events.onInputUp.add(() => {
      this.onFishermanClick()
    })

    // === FISHING ROD/FISH ===
    // 79a004v0 (members 76-81)
    this.fishingRod = new MulleSprite(this.game, 320, 240)
    if (this.fishingRod.setDirectorMember(this.DirResource, 76)) {
      this.game.add.existing(this.fishingRod)
      this.setupFishingRodAnimations()
    }

    // === EXIT BUTTON ===
    this.createExitButton()

    // === DIALOGUE ===
    this.isTalking = false
    this.dialogueIndex = 0
    this.dialogueSequence = [
      '79d002v0', '79d003v0', '79d004v0', '79d005v0',
      '79d006v0', '79d007v0', '79d008v0'
    ]

    // === AMBIENT SOUNDS ===
    this.playAmbientSounds()

    // === INTRO ===
    this.game.time.events.add(500, () => {
      this.playIntroDialogue()
    })

    // Start idle animations
    this.startIdleAnimations()

    console.log('[Fisherman] Scene created')
  }

  /**
   * Play ambient pier/water sounds
   */
  playAmbientSounds () {
    try {
      // 79e002v0 = water/fishing ambient sound
      this.ambientSound = this.game.mulle.playAudio('79e002v0', null)
      if (this.ambientSound) {
        this.ambientSound.loop = true
        this.ambientSound.volume = 0.4
      }
    } catch (e) {
      console.warn('[Fisherman] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      if (this.ambientSound) this.ambientSound.stop()
      this.game.mulle.stopAudio('79e002v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Setup body animations based on bodyAnimChart
   */
  setupBodyAnimations () {
    var b = this.DirResource

    // Still (frame 1 = member 29)
    var stillFrames = []
    stillFrames.push([b, 29])
    this.fishermanBody.addAnimation('still', stillFrames, 5, true)

    // Move animation (frames 1-16 cycling)
    var moveFrames = []
    for (var i = 0; i < 16; i++) {
      moveFrames.push([b, 29 + i])
    }
    this.fishermanBody.addAnimation('move', moveFrames, 8, true)

    // Point animation
    var pointFrames = []
    pointFrames.push([b, 29]) // 1
    pointFrames.push([b, 29]) // 1
    pointFrames.push([b, 30]) // 2
    pointFrames.push([b, 30]) // 2
    pointFrames.push([b, 31]) // 3
    pointFrames.push([b, 31]) // 3
    pointFrames.push([b, 30]) // 2
    pointFrames.push([b, 30]) // 2
    pointFrames.push([b, 29]) // 1
    this.fishermanBody.addAnimation('point', pointFrames, 10, false)

    // Startmove animation
    var startmoveFrames = []
    for (var i = 0; i < 17; i++) {
      startmoveFrames.push([b, 29 + (i % 16)])
    }
    this.fishermanBody.addAnimation('startmove', startmoveFrames, 8, false)

    this.fishermanBody.animations.play('still')
  }

  /**
   * Setup head animations based on headAnimChart
   */
  setupHeadAnimations () {
    var b = this.DirResource

    // Still (frame 2 = member 62)
    var stillFrames = []
    stillFrames.push([b, 62])
    this.fishermanHead.addAnimation('still', stillFrames, 5, true)

    // Talk animation (frames 3,5,random)
    var talkFrames = []
    talkFrames.push([b, 63]) // 3
    talkFrames.push([b, 65]) // 5
    talkFrames.push([b, 63]) // 3
    talkFrames.push([b, 65]) // 5
    talkFrames.push([b, 62]) // 2
    talkFrames.push([b, 62]) // 2
    this.fishermanHead.addAnimation('talk', talkFrames, 8, true)

    // Blink animation
    var blinkFrames = []
    blinkFrames.push([b, 62]) // 2
    blinkFrames.push([b, 64]) // 4 (blink)
    blinkFrames.push([b, 64]) // 4
    blinkFrames.push([b, 62]) // 2
    this.fishermanHead.addAnimation('blink', blinkFrames, 10, false)

    // Up animation
    var upFrames = []
    upFrames.push([b, 61]) // 1
    upFrames.push([b, 62]) // 2
    upFrames.push([b, 62]) // 2
    this.fishermanHead.addAnimation('up', upFrames, 8, false)

    // Down animation
    var downFrames = []
    downFrames.push([b, 62]) // 2
    downFrames.push([b, 62]) // 2
    downFrames.push([b, 61]) // 1
    this.fishermanHead.addAnimation('down', downFrames, 8, false)

    this.fishermanHead.animations.play('still')
  }

  /**
   * Setup fishing rod animations
   */
  setupFishingRodAnimations () {
    var b = this.DirResource

    // Still
    var stillFrames = []
    stillFrames.push([b, 76])
    this.fishingRod.addAnimation('still', stillFrames, 5, true)

    // Cast animation (members 76-81)
    var castFrames = []
    for (var i = 76; i <= 81; i++) {
      castFrames.push([b, i])
    }
    this.fishingRod.addAnimation('cast', castFrames, 10, false)

    this.fishingRod.animations.play('still')
  }

  /**
   * Start idle animation timers
   */
  startIdleAnimations () {
    // Random blink
    this.blinkTimer = this.game.time.events.loop(
      3000 + Math.random() * 4000,
      () => {
        if (!this.isTalking) {
          this.fishermanHead.animations.play('blink').onComplete.addOnce(() => {
            this.fishermanHead.animations.play('still')
          })
        }
      }
    )

    // Random body movement
    this.moveTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking) {
          this.fishermanBody.animations.play('point').onComplete.addOnce(() => {
            this.fishermanBody.animations.play('still')
          })
        }
      }
    )
  }

  /**
   * Create exit button
   */
  createExitButton () {
    this.exitButton = this.game.add.text(50, 430, 'Terug naar zee', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 3
    })
    this.exitButton.inputEnabled = true
    this.exitButton.events.onInputOver.add(() => {
      this.exitButton.fill = '#ffff00'
      this.game.mulle.cursor.current = 'Point'
    })
    this.exitButton.events.onInputOut.add(() => {
      this.exitButton.fill = '#ffffff'
      this.game.mulle.cursor.current = null
    })
    this.exitButton.events.onInputUp.add(() => {
      this.exitToSeaworld()
    })
  }

  /**
   * Play intro dialogue
   */
  playIntroDialogue () {
    if (!this.game.mulle.user.Boat.hasCache('#FishermanIntroPlayed')) {
      this.playDialogue('79d002v0', () => {
        this.game.mulle.user.Boat.addCache('#FishermanIntroPlayed')
        this.returnToIdle()
      })
    } else {
      this.playDialogue('79d003v0', () => {
        this.returnToIdle()
      })
    }
  }

  /**
   * Handle fisherman click
   */
  onFishermanClick () {
    if (this.isTalking) return

    var dialogue = this.dialogueSequence[this.dialogueIndex]
    this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogueSequence.length

    this.playDialogue(dialogue, () => {
      this.returnToIdle()
    })
  }

  /**
   * Play dialogue with animations
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    this.fishermanHead.animations.play('talk')
    this.fishermanBody.animations.play('point')

    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Fisherman] Audio not found:', dialogueId)
      this.game.time.events.add(2000, () => {
        this.isTalking = false
        if (onComplete) onComplete()
      })
    }
  }

  /**
   * Return to idle state
   */
  returnToIdle () {
    this.fishermanHead.animations.play('still')
    this.fishermanBody.animations.play('still')
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Fisherman] Returning to seaworld')
    this.stopAmbientSounds()
    this.game.state.start('seaworld')
  }

  /**
   * Cleanup
   */
  shutdown () {
    this.stopAmbientSounds()
    
    if (this.blinkTimer) this.game.time.events.remove(this.blinkTimer)
    if (this.moveTimer) this.game.time.events.remove(this.moveTimer)

    this.fishermanBody = null
    this.fishermanHead = null
    this.fishingRod = null

    super.shutdown()
    console.log('[Fisherman] Scene shutdown')
  }
}

export default FishermanState
