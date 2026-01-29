/**
 * Preacher/Church scene (Dominee's Island)
 * @module scenes/preacher
 * 
 * Scene 78 from the original game (boten_78.DXR)
 * Church island destination in the boat game
 * 
 * Features:
 * - Church island background (78b001v1, 78b002v0)
 * - Dominee (Preacher) NPC with Bible animation
 * - 19 dialogue clips (78d001v0 - 78d019v0)
 * - Clickable interaction with Dominee
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * 
 * Asset members from boten_78.DXR:
 * - 11: 78b001v1 - Main background (640x480)
 * - 10: 78b002v0 - Foreground/water overlay (501x243)
 * - 47: 78a000v0 - Preacher body base sprite
 * - 48-54: 78a001v0 + animation frames 02-12 - Preacher head/talk animation
 * - 55-59: 78a003v0 + frames 06-09 - Preacher arm/Bible animation
 * - 60: 78a004v0 - Preacher with Bible raised
 * - 35: 78e001v0 - Ambient/background sound (looped)
 * - 67-85: 78d001v0 - 78d019v0 - Dialogue clips
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

class PreacherState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets (contains boten_78 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '78.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedPreacher')) {
      this.game.mulle.user.Boat.addCache('#VisitedPreacher')
    }

    // === BACKGROUND ===
    // 78b001v1 (member 11) = Main church island background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 11)
    this.game.add.existing(background)

    // 78b002v0 (member 10) = Foreground water/overlay
    // This is positioned at the bottom part of the screen
    this.foreground = new MulleSprite(this.game, 320, 358) // y = 237 + 243/2 - offset
    this.foreground.setDirectorMember(this.DirResource, 10)
    this.game.add.existing(this.foreground)

    // === DOMINEE (PREACHER) NPC ===
    // Create Preacher sprite using boten_78.DXR sprites
    // Member 47 (78a000v0) is the Preacher's body base sprite
    // Position from metadata: imagePosY: 226, imagePosX: 398, regY: 14, regX: -78
    this.preacher = new MulleSprite(this.game, 320, 240)
    this.preacher.setDirectorMember(this.DirResource, 47)
    this.game.add.existing(this.preacher)

    // Setup Preacher animations
    this.setupPreacherAnimations()

    // Make Preacher clickable
    this.preacher.inputEnabled = true
    this.preacher.input.useHandCursor = true
    this.preacher.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.preacher.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.preacher.events.onInputUp.add(() => {
      this.onPreacherClick()
    })

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#PreacherIntroPlayed')) {
      // Play intro dialogue (78d001v0 - Preacher's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('78d001v0', () => {
          this.game.mulle.user.Boat.addCache('#PreacherIntroPlayed')
          this.preacherIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('78d002v0', () => {
          this.preacherIdleMode()
        })
      })
    }

    // Play ambient sounds
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    // Dialogue sequence: 78d003v0 through 78d019v0
    this.dialogueSequence = [
      '78d003v0', '78d004v0', '78d005v0', '78d006v0', '78d007v0',
      '78d008v0', '78d009v0', '78d010v0', '78d011v0', '78d012v0',
      '78d013v0', '78d014v0', '78d015v0', '78d016v0', '78d017v0',
      '78d018v0', '78d019v0'
    ]

    console.log('[Preacher] Scene created - Church Island (Dominee)')
  }

  /**
   * Setup Preacher's animations
   * Based on animation chart in boten_78.DXR (member 5: preacherAnimChart)
   * 
   * Animation frames from metadata:
   * - 47: 78a000v0 - Body base
   * - 48: 78a001v0 - Head frame 01
   * - 49-54: Frames 02-12 - Head/mouth positions for talking
   * - 55: 78a003v0 - Arm position 05
   * - 56-59: Frames 06-09 - Arm/Bible movement
   * - 60: 78a004v0 - Full pose with Bible raised
   */
  setupPreacherAnimations () {
    var b = this.DirResource

    // Idle/Still animation - just the base body
    var idleFrames = []
    idleFrames.push([b, 47])
    this.preacher.addAnimation('idle', idleFrames, 5, true)

    // Talk animation - uses head/mouth frames
    // Members 48-54 are head animation frames (78a001v0 and frames 02-12)
    var talkFrames = []
    talkFrames.push([b, 47]) // base
    talkFrames.push([b, 48]) // 78a001v0
    talkFrames.push([b, 49]) // 02
    talkFrames.push([b, 50]) // 03
    talkFrames.push([b, 51]) // 04
    talkFrames.push([b, 52]) // 10
    talkFrames.push([b, 53]) // 11
    talkFrames.push([b, 54]) // 12
    this.preacher.addAnimation('talk', talkFrames, 10, true)

    // Bible raise animation - arm/Bible movement
    // Members 55-59 are arm frames (78a003v0 and frames 06-09)
    var bibleFrames = []
    bibleFrames.push([b, 55]) // 78a003v0
    bibleFrames.push([b, 56]) // 06
    bibleFrames.push([b, 57]) // 07
    bibleFrames.push([b, 58]) // 08
    bibleFrames.push([b, 59]) // 09
    bibleFrames.push([b, 60]) // 78a004v0 - Bible raised
    this.preacher.addAnimation('raiseBible', bibleFrames, 8, false)

    // Bible lower animation (reverse)
    var bibleLowerFrames = []
    bibleLowerFrames.push([b, 60])
    bibleLowerFrames.push([b, 59])
    bibleLowerFrames.push([b, 58])
    bibleLowerFrames.push([b, 57])
    bibleLowerFrames.push([b, 56])
    bibleLowerFrames.push([b, 55])
    bibleLowerFrames.push([b, 47])
    this.preacher.addAnimation('lowerBible', bibleLowerFrames, 8, false)

    // Preaching animation - talk with Bible raised
    var preachFrames = []
    preachFrames.push([b, 60]) // Bible raised pose
    preachFrames.push([b, 48])
    preachFrames.push([b, 49])
    preachFrames.push([b, 50])
    preachFrames.push([b, 60])
    preachFrames.push([b, 51])
    preachFrames.push([b, 52])
    preachFrames.push([b, 53])
    this.preacher.addAnimation('preach', preachFrames, 10, true)

    // Start with idle
    this.preacher.animations.play('idle')
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
   * Handle click on Preacher
   */
  onPreacherClick () {
    if (this.isTalking) return

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      // Occasionally do Bible animation for more dramatic dialogues
      if (this.dialogueIndex % 4 === 0) {
        // Raise Bible before speaking
        this.preacher.animations.play('raiseBible').onComplete.addOnce(() => {
          this.playDialogue(dialogueId, () => {
            this.preacher.animations.play('lowerBible').onComplete.addOnce(() => {
              this.preacherIdleMode()
            })
          }, 'preach')
        })
      } else {
        this.playDialogue(dialogueId, () => {
          this.preacherIdleMode()
        })
      }
    } else {
      // Loop back to start of additional dialogues
      this.dialogueIndex = 0
      this.playDialogue('78d003v0', () => {
        this.preacherIdleMode()
      })
    }
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '78d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   * @param {string} talkAnim - Animation to play while talking (default: 'talk')
   */
  playDialogue (dialogueId, onComplete, talkAnim = 'talk') {
    this.isTalking = true

    // Play talk animation
    this.preacher.animations.play(talkAnim)

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Preacher] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Put Preacher in idle mode
   */
  preacherIdleMode () {
    this.preacher.animations.play('idle')

    // Occasional Bible gesture
    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }
    this.gestureTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking && Math.random() > 0.7) {
          // Occasionally raise and lower Bible
          this.preacher.animations.play('raiseBible').onComplete.addOnce(() => {
            this.game.time.events.add(1000, () => {
              if (!this.isTalking) {
                this.preacher.animations.play('lowerBible').onComplete.addOnce(() => {
                  this.preacher.animations.play('idle')
                })
              }
            })
          })
        }
      }
    )
  }

  /**
   * Play ambient sounds
   * 78e001v0 is the looped ambient/background sound
   */
  playAmbientSounds () {
    try {
      // Church/island ambient (birds, water, wind)
      this.ambientSound = this.game.mulle.playAudio('78e001v0', null, true)
    } catch (e) {
      console.warn('[Preacher] Ambient sound not available')
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
      this.game.mulle.stopAudio('78e001v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Preacher] Returning to seaworld')

    // Stop any talking
    if (this.isTalking) {
      this.isTalking = false
    }

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#PreacherVisited')) {
      this.game.mulle.user.Boat.addCache('#PreacherVisited')
    }

    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Any per-frame updates (water animation, etc.)
  }

  /**
   * Cleanup on scene exit
   */
  shutdown () {
    // Stop all sounds
    this.stopAmbientSounds()

    // Clear timers
    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }

    // Clear actors
    this.preacher = null
    this.foreground = null

    super.shutdown()
    console.log('[Preacher] Scene shutdown')
  }
}

export default PreacherState
