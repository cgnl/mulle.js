/**
 * Cave scene (Sven's Cave)
 * @module scenes/cave
 * 
 * Scene 86 from the original game (boten_86.DXR)
 * A sea cave exploration destination
 * 
 * Features:
 * - Cave background (member 25 - 640x480 background)
 * - Sven NPC (members 26-30, animation: Still, lift, Down, hey)
 * - Bat animation (vleermuis) - members 69-73, 82-86 with BatflyLoop
 * - Firefly/lantern glow effect (member 23 - 144x146 sprite)
 * - 13 dialogue clips (86d001v0 - 86d018v0)
 * - Cave ambient sound (86e001v0 - looped)
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

class CaveState extends MulleState {
  preload () {
    super.preload()

    // Load cave/seaworld assets
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_86.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedCave')) {
      this.game.mulle.user.Boat.addCache('#VisitedCave')
    }

    // === BACKGROUND ===
    // Member 25 = Cave background (640x480, pivotX: 320, pivotY: 240)
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 25)
    this.game.add.existing(background)

    // === LANTERN/GLOW EFFECT ===
    // Member 23 = Lantern/firefly glow (144x146, pivotX: 72, pivotY: 73)
    this.lantern = new MulleSprite(this.game, 450, 180)
    this.lantern.setDirectorMember(this.DirResource, 23)
    this.game.add.existing(this.lantern)

    // Setup lantern glow animation
    this.setupLanternAnimation()

    // === SVEN NPC ===
    // Sven uses members 26-30 (86a001v0, 03, 04, 05, 06)
    // Position based on imagePosX: 51, imagePosY: 241, imageRegX: 269, imageRegY: -1
    // So Sven is at roughly x=51+269=320, y=241 (bottom half of screen)
    this.sven = new MulleSprite(this.game, 320, 360)
    this.sven.setDirectorMember(this.DirResource, 26) // 86a001v0 - base frame
    this.game.add.existing(this.sven)

    // Setup Sven animations based on SvenAnimChart:
    // Still: [1], lift: [2,2,3,3,4,4,5,5,6,6], Down: [6,6,5,5,4,4,3,3,2,2,1], hey: [2,2,3,3,4,4,5,5...4,4,3,3,2,2,1]
    this.setupSvenAnimations()

    // Make Sven clickable
    this.sven.inputEnabled = true
    this.sven.input.useHandCursor = true
    this.sven.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.sven.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.sven.events.onInputUp.add(() => {
      this.onSvenClick()
    })

    // === BAT ANIMATION (VLEERMUIS) ===
    // Bat uses members 69-73 (86a002v00-v04) for one direction
    // and members 82-86 (86a002v10-v14) for another direction
    this.bat = new MulleSprite(this.game, 500, 120)
    this.bat.setDirectorMember(this.DirResource, 69) // Start frame
    this.game.add.existing(this.bat)

    // Setup bat flying animation
    this.setupBatAnimation()

    // Start bat flying
    this.startBatFlight()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#CaveIntroPlayed')) {
      // Play intro dialogue (86d001v0 - Sven's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('86d001v0', () => {
          this.game.mulle.user.Boat.addCache('#CaveIntroPlayed')
          this.svenIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('86d002v0', () => {
          this.svenIdleMode()
        })
      })
    }

    // Play ambient cave sounds (86e001v0 - looped)
    this.playAmbientSounds()

    // Track dialogue state
    // Dialogue clips available: 86d001v0-86d004v0, 86d009v0-86d013v0, 86d015v0-86d018v0
    this.dialogueIndex = 0
    this.dialogueSequence = [
      '86d003v0', '86d004v0', '86d009v0', '86d010v0', '86d011v0',
      '86d012v0', '86d013v0', '86d015v0', '86d016v0', '86d017v0', '86d018v0'
    ]

    console.log('[Cave] Scene created - Sven\'s cave')
  }

  /**
   * Setup Sven's animations
   * Based on SvenAnimChart: Still:[1], lift:[2,2,3,3,4,4,5,5,6,6], Down:[6,6,5,5,4,4,3,3,2,2,1], hey:[...]
   * Members: 26=frame1(86a001v0), 27=frame3, 28=frame4, 29=frame5, 30=frame6
   */
  setupSvenAnimations () {
    var b = this.DirResource

    // Map animation frames to members
    // Frame 1 = member 26, frames 3-6 = members 27-30
    // (Frame 2 seems to be same as frame 1 based on file list)

    // Idle/Still animation - just frame 1
    var idleFrames = []
    idleFrames.push([b, 26])
    this.sven.addAnimation('idle', idleFrames, 5, true)

    // Lift animation - Sven lifts something (arm raising)
    // [2,2,3,3,4,4,5,5,6,6] -> using members 26,27,28,29,30
    var liftFrames = []
    liftFrames.push([b, 26]) // frame 2 (same as 1)
    liftFrames.push([b, 26])
    liftFrames.push([b, 27]) // frame 3
    liftFrames.push([b, 27])
    liftFrames.push([b, 28]) // frame 4
    liftFrames.push([b, 28])
    liftFrames.push([b, 29]) // frame 5
    liftFrames.push([b, 29])
    liftFrames.push([b, 30]) // frame 6
    liftFrames.push([b, 30])
    this.sven.addAnimation('lift', liftFrames, 10, false)

    // Down animation - Sven lowers (arm going down)
    // [6,6,5,5,4,4,3,3,2,2,1]
    var downFrames = []
    downFrames.push([b, 30]) // frame 6
    downFrames.push([b, 30])
    downFrames.push([b, 29]) // frame 5
    downFrames.push([b, 29])
    downFrames.push([b, 28]) // frame 4
    downFrames.push([b, 28])
    downFrames.push([b, 27]) // frame 3
    downFrames.push([b, 27])
    downFrames.push([b, 26]) // frame 2
    downFrames.push([b, 26])
    downFrames.push([b, 26]) // frame 1
    this.sven.addAnimation('down', downFrames, 10, false)

    // Hey animation - wave/greeting gesture (lift and hold, then down)
    // [2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5,4,4,3,3,2,2,1]
    var heyFrames = []
    heyFrames.push([b, 26]) // frame 2
    heyFrames.push([b, 26])
    heyFrames.push([b, 27]) // frame 3
    heyFrames.push([b, 27])
    heyFrames.push([b, 28]) // frame 4
    heyFrames.push([b, 28])
    // Hold at frame 5 for a while
    for (var i = 0; i < 12; i++) {
      heyFrames.push([b, 29]) // frame 5
    }
    heyFrames.push([b, 28]) // frame 4
    heyFrames.push([b, 28])
    heyFrames.push([b, 27]) // frame 3
    heyFrames.push([b, 27])
    heyFrames.push([b, 26]) // frame 2
    heyFrames.push([b, 26])
    heyFrames.push([b, 26]) // frame 1
    this.sven.addAnimation('hey', heyFrames, 10, false)

    // Talk animation - use hey animation for talking
    this.sven.addAnimation('talk', heyFrames, 12, true)

    // Start with idle
    this.sven.animations.play('idle')
  }

  /**
   * Setup bat flying animation
   * Uses BatAnimChart with BatflyLoop action
   * Two sets of frames: 69-73 (direction 0) and 82-86 (direction 1)
   */
  setupBatAnimation () {
    var b = this.DirResource

    // Direction 0 frames: 86a002v00-v04 (members 69-73)
    var flyRightFrames = []
    flyRightFrames.push([b, 69]) // v00
    flyRightFrames.push([b, 70]) // v01
    flyRightFrames.push([b, 71]) // v02
    flyRightFrames.push([b, 72]) // v03
    flyRightFrames.push([b, 73]) // v04
    flyRightFrames.push([b, 72]) // v03
    flyRightFrames.push([b, 71]) // v02
    flyRightFrames.push([b, 70]) // v01
    this.bat.addAnimation('flyRight', flyRightFrames, 12, true)

    // Direction 1 frames: 86a002v10-v14 (members 82-86)
    var flyLeftFrames = []
    flyLeftFrames.push([b, 82]) // v10
    flyLeftFrames.push([b, 83]) // v11
    flyLeftFrames.push([b, 84]) // v12
    flyLeftFrames.push([b, 85]) // v13
    flyLeftFrames.push([b, 86]) // v14
    flyLeftFrames.push([b, 85]) // v13
    flyLeftFrames.push([b, 84]) // v12
    flyLeftFrames.push([b, 83]) // v11
    this.bat.addAnimation('flyLeft', flyLeftFrames, 12, true)

    // Start with one direction
    this.bat.animations.play('flyRight')
    this.batDirection = 1 // 1 = right, -1 = left
  }

  /**
   * Start bat flight path
   * Bat flies back and forth across the cave ceiling
   */
  startBatFlight () {
    this.batFlying = true

    // Define flight bounds
    this.batMinX = 80
    this.batMaxX = 560
    this.batBaseY = 100
    this.batSpeed = 1.5

    // Random starting position
    this.bat.x = this.game.rnd.integerInRange(this.batMinX + 50, this.batMaxX - 50)
    this.bat.y = this.batBaseY + this.game.rnd.integerInRange(-20, 20)
  }

  /**
   * Update bat flight (called from update loop)
   */
  updateBatFlight () {
    if (!this.batFlying || !this.bat) return

    // Move bat
    this.bat.x += this.batSpeed * this.batDirection

    // Add vertical oscillation (bat flying motion)
    this.bat.y = this.batBaseY + Math.sin(this.game.time.now / 300) * 15

    // Check bounds and reverse direction
    if (this.bat.x >= this.batMaxX) {
      this.batDirection = -1
      this.bat.animations.play('flyLeft')
    } else if (this.bat.x <= this.batMinX) {
      this.batDirection = 1
      this.bat.animations.play('flyRight')
    }
  }

  /**
   * Setup lantern/glow animation
   * Creates a flickering glow effect
   */
  setupLanternAnimation () {
    // Create flickering effect using alpha tweens
    this.lanternFlicker = this.game.add.tween(this.lantern)
      .to({ alpha: 0.6 }, 200 + Math.random() * 100, Phaser.Easing.Linear.None, true, 0, -1, true)

    // Also add subtle scale pulse
    this.game.add.tween(this.lantern.scale)
      .to({ x: 1.05, y: 1.05 }, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  /**
   * Create exit button to return to seaworld
   */
  createExitButton () {
    // Create exit/back button at bottom
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
   * Handle click on Sven
   */
  onSvenClick () {
    if (this.isTalking) return

    // Play hey animation first, then dialogue
    this.sven.animations.play('hey').onComplete.addOnce(() => {
      // Get next dialogue in sequence
      if (this.dialogueIndex < this.dialogueSequence.length) {
        var dialogueId = this.dialogueSequence[this.dialogueIndex]
        this.dialogueIndex++

        this.playDialogue(dialogueId, () => {
          this.svenIdleMode()
        })
      } else {
        // Loop back to start of additional dialogues
        this.dialogueIndex = 0
        this.playDialogue('86d003v0', () => {
          this.svenIdleMode()
        })
      }
    })
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '86d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.sven.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Cave] Dialogue audio not found:', dialogueId)
      // Fallback: wait a bit then complete
      this.game.time.events.add(2000, () => {
        this.isTalking = false
        if (onComplete) onComplete()
      })
    }
  }

  /**
   * Put Sven in idle mode
   */
  svenIdleMode () {
    this.sven.animations.play('idle')

    // Occasional random gesture
    if (this.idleTimer) {
      this.game.time.events.remove(this.idleTimer)
    }
    this.idleTimer = this.game.time.events.loop(
      5000 + Math.random() * 5000,
      () => {
        if (!this.isTalking) {
          // Random chance to do lift or hey animation
          if (Math.random() < 0.3) {
            var anim = Math.random() < 0.5 ? 'lift' : 'hey'
            this.sven.animations.play(anim).onComplete.addOnce(() => {
              if (anim === 'lift') {
                // If we lifted, play down
                this.sven.animations.play('down').onComplete.addOnce(() => {
                  this.sven.animations.play('idle')
                })
              } else {
                this.sven.animations.play('idle')
              }
            })
          }
        }
      }
    )
  }

  /**
   * Play ambient cave sounds
   * Uses 86e001v0 (looped ambient sound from metadata)
   */
  playAmbientSounds () {
    try {
      // 86e001v0 is marked as looped in metadata (soundLooped: true)
      this.ambientSound = this.game.mulle.playAudio('86e001v0', null)
      if (this.ambientSound && this.ambientSound.loop !== undefined) {
        this.ambientSound.loop = true
      }
    } catch (e) {
      console.warn('[Cave] Ambient sound not available:', e)
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
      this.game.mulle.stopAudio('86e001v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Cave] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#CaveVisited')) {
      this.game.mulle.user.Boat.addCache('#CaveVisited')
    }

    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Update bat flight
    this.updateBatFlight()
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

    // Stop bat
    this.batFlying = false

    // Clear actors
    this.sven = null
    this.bat = null
    this.lantern = null

    super.shutdown()
    console.log('[Cave] Scene shutdown')
  }
}

export default CaveState
