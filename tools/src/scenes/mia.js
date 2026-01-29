/**
 * Mia scene (Mia's Island)
 * @module scenes/mia
 * 
 * Scene 83 from the original game (boten_83.DXR)
 * Mia's island destination in the sea world
 * 
 * Features:
 * - Island background (83b001v1, 83b002v0, 83b003v0)
 * - Mia NPC with MiaAnimChart animations
 * - 19 dialogue clips (83d001v0 - 83d019v0)
 * - Clickable interaction with Mia
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * 
 * MiaAnimChart animations:
 * - Still: [1]
 * - Wait: [1, #TalkStill]
 * - TalkStill: [1]
 * - turntalk: [4,6,5,4,5,6]
 * - turn: [1,2,2,3,3,4]
 * - turnBack: [4,4,3,3,2,1]
 * - talk: [8,9,1,[rndframe,[1,8,1,9]]]
 * - blinkloop: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,1,1,1]
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleActor from '../objects/actor'

class MiaState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets (contains boten_83 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_83.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedMia')) {
      this.game.mulle.user.Boat.addCache('#VisitedMia')
    }

    // === BACKGROUND ===
    // 83b001v1 (member 26) = Main island background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 26)
    this.game.add.existing(background)

    // 83b002v0 (member 27) = Alternative/overlay background (can be used for different states)
    // 83b003v0 (member 29) = Additional background element (pier/dock area)

    // === MIA NPC ===
    // Create Mia using boten_83.DXR sprites
    // Member 12 (83a001v0) is Mia's base sprite (frame 1)
    // Mia position based on pivot point: imagePosX: 264, imagePosY: 169
    this.mia = new MulleSprite(this.game, 264, 169)
    this.mia.setDirectorMember(this.DirResource, 12)
    this.game.add.existing(this.mia)

    // Setup Mia animations based on MiaAnimChart
    this.setupMiaAnimations()

    // Make Mia clickable
    this.mia.inputEnabled = true
    this.mia.input.useHandCursor = true
    this.mia.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.mia.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.mia.events.onInputUp.add(() => {
      this.onMiaClick()
    })

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#MiaIntroPlayed')) {
      // Play intro dialogue (83d001v0 - Mia's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('83d001v0', () => {
          this.game.mulle.user.Boat.addCache('#MiaIntroPlayed')
          this.miaIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('83d002v0', () => {
          this.miaIdleMode()
        })
      })
    }

    // Play ambient sounds (birds, waves, etc.)
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    // Available dialogue clips: 83d001v0 - 83d015v0, 83d018v0, 83d019v0, plus 00d038v0
    this.dialogueSequence = [
      '83d003v0', '83d004v0', '83d005v0', '83d006v0', '83d007v0',
      '83d008v0', '83d009v0', '83d010v0', '83d011v0', '83d012v0',
      '83d013v0', '83d014v0', '83d015v0', '83d018v0', '83d019v0'
    ]

    console.log('[Mia] Scene created - Mia\'s Island')
  }

  /**
   * Setup Mia's animations based on MiaAnimChart from member 2
   * Animation chart: 
   * #Actions:[
   *   #Wait:[1,#TalkStill],
   *   #TalkStill:[1],
   *   #Still:[1],
   *   #turntalk:[4,6,5,4,5,6],
   *   #turn:[1,2,2,3,3,4],
   *   #turnBack:[4,4,3,3,2,1],
   *   #talk:[8,9,1,[rndframe,[1,8,1,9]]],
   *   #blinkloop:[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,1,1,1]
   * ]
   * 
   * Frame mapping (based on member numbers):
   * Frame 1 = member 12 (83a001v0)
   * Frame 2 = member 13 (02)
   * Frame 3 = member 14 (03)
   * Frame 4 = member 15 (04)
   * Frame 5 = member 16 (05)
   * Frame 6 = member 17 (06)
   * Frame 7 = member 18 (07)
   * Frame 8 = member 19 (08)
   * Frame 9 = member 20 (09)
   * Frame 10 = member 21 (10)
   */
  setupMiaAnimations () {
    var b = this.DirResource

    // Frame mapping: animation frame number -> member number
    // Frame 1 = member 12, Frame 2 = member 13, ..., Frame 10 = member 21
    const frameToMember = (frame) => 11 + frame  // frame 1 -> member 12

    // Idle/Still animation - just frame 1
    var idleFrames = []
    idleFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('idle', idleFrames, 5, true)

    // TalkStill - frame 1 (same as idle, for when talking but minimal movement)
    var talkStillFrames = []
    talkStillFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('talkStill', talkStillFrames, 5, true)

    // Turn animation - [1,2,2,3,3,4] - Mia turning to face different direction
    var turnFrames = []
    turnFrames.push([b, frameToMember(1)])
    turnFrames.push([b, frameToMember(2)])
    turnFrames.push([b, frameToMember(2)])
    turnFrames.push([b, frameToMember(3)])
    turnFrames.push([b, frameToMember(3)])
    turnFrames.push([b, frameToMember(4)])
    this.mia.addAnimation('turn', turnFrames, 8, false)

    // TurnBack animation - [4,4,3,3,2,1] - Mia turning back
    var turnBackFrames = []
    turnBackFrames.push([b, frameToMember(4)])
    turnBackFrames.push([b, frameToMember(4)])
    turnBackFrames.push([b, frameToMember(3)])
    turnBackFrames.push([b, frameToMember(3)])
    turnBackFrames.push([b, frameToMember(2)])
    turnBackFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('turnBack', turnBackFrames, 8, false)

    // TurnTalk animation - [4,6,5,4,5,6] - Mia talking while turned
    var turnTalkFrames = []
    turnTalkFrames.push([b, frameToMember(4)])
    turnTalkFrames.push([b, frameToMember(6)])
    turnTalkFrames.push([b, frameToMember(5)])
    turnTalkFrames.push([b, frameToMember(4)])
    turnTalkFrames.push([b, frameToMember(5)])
    turnTalkFrames.push([b, frameToMember(6)])
    this.mia.addAnimation('turnTalk', turnTalkFrames, 10, true)

    // Talk animation - [8,9,1,[rndframe,[1,8,1,9]]] - main talking
    // Simplified: frames 8, 9, 1, 8, 1, 9 cycling
    var talkFrames = []
    talkFrames.push([b, frameToMember(8)])
    talkFrames.push([b, frameToMember(9)])
    talkFrames.push([b, frameToMember(1)])
    talkFrames.push([b, frameToMember(8)])
    talkFrames.push([b, frameToMember(1)])
    talkFrames.push([b, frameToMember(9)])
    this.mia.addAnimation('talk', talkFrames, 10, true)

    // Blink loop animation - mostly frame 1 with occasional frame 10 (eyes closed)
    // Original: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,1,1,1]
    var blinkFrames = []
    // 22 frames of 1, then 2 frames of 10 (blink), then 13 frames of 1
    for (var i = 0; i < 22; i++) blinkFrames.push([b, frameToMember(1)])
    blinkFrames.push([b, frameToMember(10)])
    blinkFrames.push([b, frameToMember(10)])
    for (var i = 0; i < 13; i++) blinkFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('blink', blinkFrames, 15, false)

    // Start with idle
    this.mia.animations.play('idle')
  }

  /**
   * Create exit button to return to seaworld
   */
  createExitButton () {
    // Create exit/back button
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

    // Also add clickable area at bottom of screen
    var exitZone = this.game.add.graphics(0, 450)
    exitZone.beginFill(0x000000, 0.01) // Nearly invisible
    exitZone.drawRect(0, 0, 640, 30)
    exitZone.endFill()
    exitZone.inputEnabled = true
    exitZone.events.onInputUp.add(() => {
      this.exitToSeaworld()
    })
  }

  /**
   * Handle click on Mia
   */
  onMiaClick () {
    if (this.isTalking) return

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      this.playDialogue(dialogueId, () => {
        this.miaIdleMode()
      })
    } else {
      // Loop back to start of additional dialogues
      this.dialogueIndex = 0
      this.playDialogue('83d003v0', () => {
        this.miaIdleMode()
      })
    }
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '83d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.mia.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Mia] Dialogue audio not found:', dialogueId)
      // Fallback: simulate dialogue duration
      this.game.time.events.add(2000, () => {
        this.isTalking = false
        if (onComplete) onComplete()
      })
    }
  }

  /**
   * Put Mia in idle mode with occasional blink
   */
  miaIdleMode () {
    this.mia.animations.play('idle')

    // Occasional blink
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
    this.blinkTimer = this.game.time.events.loop(
      4000 + Math.random() * 3000,
      () => {
        if (!this.isTalking) {
          this.mia.animations.play('blink').onComplete.addOnce(() => {
            this.mia.animations.play('idle')
          })
        }
      }
    )
  }

  /**
   * Play ambient sounds (island ambience)
   */
  playAmbientSounds () {
    // Try to play ambient island sounds
    // 83e001v0 (member 30) is the ambient sound
    try {
      this.ambientSound = this.game.mulle.playAudio('83e001v0', null)
      if (this.ambientSound) {
        this.ambientSound.loop = true
      }
    } catch (e) {
      console.warn('[Mia] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      if (this.ambientSound) {
        this.ambientSound.stop()
        this.ambientSound = null
      }
      this.game.mulle.stopAudio('83e001v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Mia] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#MiaVisited')) {
      this.game.mulle.user.Boat.addCache('#MiaVisited')
    }

    this.stopAmbientSounds()
    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Any per-frame updates can go here
  }

  /**
   * Cleanup on scene exit
   */
  shutdown () {
    // Stop all sounds
    this.stopAmbientSounds()

    // Clear timers
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }

    // Clear actor reference
    this.mia = null

    super.shutdown()
    console.log('[Mia] Scene shutdown')
  }
}

export default MiaState
