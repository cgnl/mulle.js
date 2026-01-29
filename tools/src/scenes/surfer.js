/**
 * Surfer scene (Sur's surf beach)
 * @module scenes/surfer
 * 
 * Scene 81 from the original game (boten_81.DXR)
 * Surf beach destination in the seaworld
 * 
 * Features:
 * - Beach background (81b004v0, 81b002v0, 81b003v0)
 * - Sur NPC with surfer animations (arm movements, talking)
 * - Surfboard animation sprites (81b005v1-v5)
 * - 9 dialogue clips (81d001v0 - 81d009v0)
 * - Ambient beach sounds (81e001v0)
 * - Clickable interaction with Sur
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * 
 * Asset mapping from boten_81.DXR:
 * - Member 10: 81b004v0 - Main beach background
 * - Member 30: 81b002v0 - Beach overlay/element
 * - Member 31: 81b003v0 - Water/wave element
 * - Members 22-29: Sur animation frames (81a001v0, 02, 03, 04, 05, 06)
 * - Members 36: 01 - Surfboard frame 1
 * - Members 37-41: 81b005v1-v5 - Surfboard animation frames
 * - Member 47: 81e001v0 - Ambient sound
 * - Member 49: 81d001v0 - Dialogue 1
 * - Members 50-56: 81d002v0-81d008v0 - Dialogues 2-8
 * - Member 12: 81d009v0 - Dialogue 9
 * 
 * Animation chart (SurAnimChart - member 5):
 * - Wait: [4, #TalkStill]
 * - TalkStill: [4]
 * - Still: [4]
 * - ArmOut: [1, 2, 3, 4]
 * - ArmDown: [4, 3, 2, 1]
 * - Talk: [4, 6, 5, rndFrame[4, 5, 6]]
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

class SurferState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets (contains boten_81 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_81.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedSurfBeach')) {
      this.game.mulle.user.Boat.addCache('#VisitedSurfBeach')
    }

    // === BACKGROUND ===
    // 81b004v0 (member 10) = Main beach background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 10)
    this.game.add.existing(background)

    // 81b002v0 (member 30) = Beach overlay element (positioned at -210, 120)
    var beachOverlay = new MulleSprite(this.game, 320, 240)
    if (beachOverlay.setDirectorMember(this.DirResource, 30)) {
      this.game.add.existing(beachOverlay)
    }

    // 81b003v0 (member 31) = Water/wave element (positioned at -1, 79)
    var waterElement = new MulleSprite(this.game, 320, 240)
    if (waterElement.setDirectorMember(this.DirResource, 31)) {
      this.game.add.existing(waterElement)
    }

    // === SUR NPC ===
    // Create Sur actor using boten_81.DXR sprites
    // Member 22 (81a001v0) is Sur's base sprite, positioned at (320, 240) with reg point (39, 83)
    this.sur = new MulleSprite(this.game, 320, 240)
    this.sur.setDirectorMember(this.DirResource, 22)
    this.game.add.existing(this.sur)

    // Setup Sur animations based on SurAnimChart
    this.setupSurAnimations()

    // Make Sur clickable
    this.sur.inputEnabled = true
    this.sur.input.useHandCursor = true
    this.sur.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.sur.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.sur.events.onInputUp.add(() => {
      this.onSurClick()
    })

    // === SURFBOARD ===
    // Create surfboard with animation (members 36-41)
    this.surfboard = new MulleSprite(this.game, 180, 280)
    this.surfboard.setDirectorMember(this.DirResource, 36)
    this.game.add.existing(this.surfboard)

    // Setup surfboard animation
    this.setupSurfboardAnimation()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#SurfBeachIntroPlayed')) {
      // Play intro dialogue (81d001v0 - Sur's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('81d001v0', () => {
          this.game.mulle.user.Boat.addCache('#SurfBeachIntroPlayed')
          this.surIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting (81d002v0)
      this.game.time.events.add(500, () => {
        this.playDialogue('81d002v0', () => {
          this.surIdleMode()
        })
      })
    }

    // Play ambient beach sounds
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    // 9 dialogue clips available: 81d001v0 - 81d009v0
    this.dialogueSequence = [
      '81d003v0', '81d004v0', '81d005v0', '81d006v0',
      '81d007v0', '81d008v0', '81d009v0'
    ]

    console.log('[Surfer] Scene created - Sur\'s surf beach')
  }

  /**
   * Setup Sur's animations
   * Based on animation chart (SurAnimChart):
   * - Wait: [4, #TalkStill]
   * - TalkStill: [4]
   * - Still: [4]
   * - ArmOut: [1, 2, 3, 4]
   * - ArmDown: [4, 3, 2, 1]
   * - Talk: [4, 6, 5, rndFrame[4, 5, 6]]
   */
  setupSurAnimations () {
    var b = this.DirResource

    // Sur animation frames are members 22-29
    // 22 = 81a001v0 (frame 1), 23 = 02 (frame 2), 24 = 03 (frame 3), etc.
    
    // Idle/Still animation - frame 4 (member 25)
    var idleFrames = []
    idleFrames.push([b, 25])
    this.sur.addAnimation('idle', idleFrames, 5, true)

    // Wait animation - frame 4 then TalkStill
    var waitFrames = []
    waitFrames.push([b, 25])
    this.sur.addAnimation('wait', waitFrames, 5, true)

    // TalkStill animation - frame 4
    var talkStillFrames = []
    talkStillFrames.push([b, 25])
    this.sur.addAnimation('talkstill', talkStillFrames, 5, true)

    // Talk animation - frames 4, 6, 5 with random variation
    var talkFrames = []
    talkFrames.push([b, 25]) // frame 4
    talkFrames.push([b, 27]) // frame 6
    talkFrames.push([b, 26]) // frame 5
    talkFrames.push([b, 25]) // frame 4
    talkFrames.push([b, 26]) // frame 5
    talkFrames.push([b, 27]) // frame 6
    this.sur.addAnimation('talk', talkFrames, 10, true)

    // ArmOut animation - frames 1, 2, 3, 4
    var armOutFrames = []
    armOutFrames.push([b, 22]) // frame 1
    armOutFrames.push([b, 23]) // frame 2
    armOutFrames.push([b, 24]) // frame 3
    armOutFrames.push([b, 25]) // frame 4
    this.sur.addAnimation('armout', armOutFrames, 8, false)

    // ArmDown animation - frames 4, 3, 2, 1
    var armDownFrames = []
    armDownFrames.push([b, 25]) // frame 4
    armDownFrames.push([b, 24]) // frame 3
    armDownFrames.push([b, 23]) // frame 2
    armDownFrames.push([b, 22]) // frame 1
    this.sur.addAnimation('armdown', armDownFrames, 8, false)

    // Start with idle
    this.sur.animations.play('idle')
  }

  /**
   * Setup surfboard animation
   * Surfboard frames are members 36-41 (81b005v1-v5)
   */
  setupSurfboardAnimation () {
    var b = this.DirResource

    // Surfboard bobbing/wave animation
    var surfboardFrames = []
    surfboardFrames.push([b, 36]) // 01 (base position)
    surfboardFrames.push([b, 37]) // 81b005v1
    surfboardFrames.push([b, 38]) // 81b005v2
    surfboardFrames.push([b, 39]) // 81b005v3
    surfboardFrames.push([b, 40]) // 81b005v4
    surfboardFrames.push([b, 41]) // 81b005v5

    this.surfboard.addAnimation('bob', surfboardFrames, 4, true)
    this.surfboard.addAnimation('idle', [[b, 36]], 1, true)

    // Start with subtle bobbing animation
    this.surfboard.animations.play('bob')
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

    // Also add clickable area at bottom of screen for exit
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
   * Handle click on Sur
   */
  onSurClick () {
    if (this.isTalking) return

    // Play arm out animation first, then dialogue
    this.sur.animations.play('armout')
    this.sur.animations.currentAnim.onComplete.addOnce(() => {
      // Get next dialogue in sequence
      if (this.dialogueIndex < this.dialogueSequence.length) {
        var dialogueId = this.dialogueSequence[this.dialogueIndex]
        this.dialogueIndex++

        this.playDialogue(dialogueId, () => {
          // Play arm down animation after talking
          this.sur.animations.play('armdown')
          this.sur.animations.currentAnim.onComplete.addOnce(() => {
            this.surIdleMode()
          })
        })
      } else {
        // Loop back to start of additional dialogues
        this.dialogueIndex = 0
        this.playDialogue('81d003v0', () => {
          this.sur.animations.play('armdown')
          this.sur.animations.currentAnim.onComplete.addOnce(() => {
            this.surIdleMode()
          })
        })
      }
    })
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '81d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.sur.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Surfer] Dialogue audio not found:', dialogueId)
      // Simulate dialogue duration
      this.game.time.events.add(2000, () => {
        this.isTalking = false
        if (onComplete) onComplete()
      })
    }
  }

  /**
   * Put Sur in idle mode
   */
  surIdleMode () {
    this.sur.animations.play('idle')

    // Occasional animation variations
    if (this.idleTimer) {
      this.game.time.events.remove(this.idleTimer)
    }
    this.idleTimer = this.game.time.events.loop(
      5000 + Math.random() * 4000,
      () => {
        if (!this.isTalking) {
          // Occasionally do arm out/down sequence
          if (Math.random() < 0.3) {
            this.sur.animations.play('armout')
            this.sur.animations.currentAnim.onComplete.addOnce(() => {
              this.game.time.events.add(1000, () => {
                if (!this.isTalking) {
                  this.sur.animations.play('armdown')
                  this.sur.animations.currentAnim.onComplete.addOnce(() => {
                    this.sur.animations.play('idle')
                  })
                }
              })
            })
          }
        }
      }
    )
  }

  /**
   * Play ambient beach sounds
   * 81e001v0 (member 47) is the ambient beach/wave sound
   */
  playAmbientSounds () {
    try {
      // Play ambient beach sounds (waves, seagulls, etc.)
      this.ambientSound = this.game.mulle.playAudio('81e001v0', null, true)
      if (!this.ambientSound) {
        // Try alternate audio key format
        this.ambientSound = this.game.mulle.playAudio('boten_81.DXR/81e001v0', null, true)
      }
    } catch (e) {
      console.warn('[Surfer] Ambient sound not available:', e)
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
      this.game.mulle.stopAudio('81e001v0')
      this.game.mulle.stopAudio('boten_81.DXR/81e001v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Surfer] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#SurfBeachVisited')) {
      this.game.mulle.user.Boat.addCache('#SurfBeachVisited')
    }

    // Stop sounds before transitioning
    this.stopAmbientSounds()

    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Any per-frame updates for wave effects, etc.
  }

  /**
   * Cleanup on scene exit
   */
  shutdown () {
    // Stop all sounds
    this.stopAmbientSounds()

    // Clear timers
    if (this.idleTimer) {
      this.game.time.events.remove(this.idleTimer)
    }

    // Clear actors
    this.sur = null
    this.surfboard = null

    super.shutdown()
    console.log('[Surfer] Scene shutdown')
  }
}

export default SurferState
