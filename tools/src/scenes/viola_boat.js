/**
 * Viola Boat scene (Musician's House - Boat version)
 * @module scenes/viola_boat
 * 
 * Scene 84 from the boat game (boten_84.DXR)
 * 
 * Features:
 * - Viola's house background (84b001v1, 84b002v0)
 * - Viola NPC with Head and Arm animations
 * - Accordion playing animation
 * - 18 dialogue clips (84d003v0 - 84d020v0)
 * - Music puzzle interaction
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * 
 * Animation Charts from Lingo:
 * - ViolaHeadAnimChart: Wait, TalkStill, Still, talk, blinkloop, muddrar
 * - ViolaArmAnimChart: Still, ArmUp, ArmDown
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

class ViolaBoatState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets (contains boten_84.DXR assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_84.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedViola')) {
      this.game.mulle.user.Boat.addCache('#VisitedViola')
    }

    // === BACKGROUND ===
    // 84b001v1 (member 8) = Main background - Viola's house exterior
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 8)
    this.game.add.existing(background)

    // 84b002v0 (member 12) = Alternative/indoor background
    // 84b003v0 (member 27) = Overlay element
    // 84b004v0 (member 28) = Another overlay

    // === VIOLA NPC ===
    // Create Viola using boten_84.DXR sprites
    // Member 15 (84a000v0) = Viola's main body with accordion
    this.viola = new MulleSprite(this.game, 320, 240)
    this.viola.setDirectorMember(this.DirResource, 15)
    this.game.add.existing(this.viola)

    // Create separate head sprite for animation
    // Members 16-19 are head animation frames (84a001v0, 02, 03, 04)
    this.violaHead = new MulleSprite(this.game, 320, 240)
    this.violaHead.setDirectorMember(this.DirResource, 16)
    this.game.add.existing(this.violaHead)

    // Create arm sprite for accordion animation
    // Members 20-25 are arm animation frames (84a002v0, 06-10)
    this.violaArm = new MulleSprite(this.game, 320, 240)
    this.violaArm.setDirectorMember(this.DirResource, 20)
    this.game.add.existing(this.violaArm)

    // Setup animations
    this.setupViolaAnimations()

    // Make Viola clickable
    this.viola.inputEnabled = true
    this.viola.input.useHandCursor = true
    this.viola.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.viola.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.viola.events.onInputUp.add(() => {
      this.onViolaClick()
    })

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#ViolaIntroPlayed')) {
      // Play intro dialogue
      this.game.time.events.add(500, () => {
        this.playDialogue('84d003v0', () => {
          this.game.mulle.user.Boat.addCache('#ViolaIntroPlayed')
          this.violaIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('84d004v0', () => {
          this.violaIdleMode()
        })
      })
    }

    // Play ambient/music sound
    this.playAmbientSounds()

    // Track dialogue state - available dialogues from boten_84.DXR
    this.dialogueIndex = 0
    this.dialogueSequence = [
      '84d005v0', '84d006v0', '84d006v1', '84d007v0', '84d008v0', '84d009v0',
      '84d012v0', '84d013v0', '84d014v0', '84d015v0', '84d016v0',
      '84d017v0', '84d018v0', '84d019v0', '84d020v0'
    ]

    // Music puzzle state
    this.musicPuzzleCompleted = this.game.mulle.user.Boat.hasCache('#ViolaMusicPuzzle')

    console.log('[ViolaBoat] Scene created - Viola\'s house (boat version)')
  }

  /**
   * Setup Viola's animations based on animation charts
   * ViolaHeadAnimChart: Wait, TalkStill, Still, talk, blinkloop, muddrar
   * ViolaArmAnimChart: Still, ArmUp, ArmDown
   */
  setupViolaAnimations () {
    var b = this.DirResource

    // === HEAD ANIMATIONS ===
    // Members 16-19 for head (84a001v0 = 16, then 02, 03, 04 at 17, 18, 19)
    // Members 47-55 for full head with body (84a003v0 series)

    // Still/Idle - single frame
    var headIdleFrames = [[b, 16]]
    this.violaHead.addAnimation('idle', headIdleFrames, 5, true)

    // Talk animation - frames cycle through mouth positions
    // Based on chart: [1,2,3,3,2,1,3]
    var headTalkFrames = [
      [b, 16], [b, 17], [b, 18], [b, 18], [b, 17], [b, 16], [b, 18]
    ]
    this.violaHead.addAnimation('talk', headTalkFrames, 10, true)

    // TalkStill - single frame for pauses
    var headTalkStillFrames = [[b, 16]]
    this.violaHead.addAnimation('talkStill', headTalkStillFrames, 5, true)

    // Blink loop animation
    // Based on chart: many 1s with occasional 4 (blink frame at 19)
    var blinkFrames = []
    for (var i = 0; i < 22; i++) {
      blinkFrames.push([b, 16])
    }
    blinkFrames.push([b, 19]) // blink
    blinkFrames.push([b, 19])
    blinkFrames.push([b, 16])
    this.violaHead.addAnimation('blink', blinkFrames, 8, false)

    // Muddrar (mumbling/grumbling) animation
    // Based on chart: [1,2,3,4,5,6,7,8,9]
    var muddrarFrames = []
    for (var i = 47; i <= 55; i++) {
      muddrarFrames.push([b, i])
    }
    this.violaHead.addAnimation('muddrar', muddrarFrames, 10, true)

    // === ARM ANIMATIONS ===
    // Members 20-25 for arm (84a002v0 = 20, then 06-10 at 21-25)

    // Still - single frame
    var armIdleFrames = [[b, 20]]
    this.violaArm.addAnimation('idle', armIdleFrames, 5, true)

    // Arm Up - raising the accordion arm
    // Based on chart: [1,2,3,4,5]
    var armUpFrames = [
      [b, 20], [b, 21], [b, 22], [b, 23], [b, 24]
    ]
    this.violaArm.addAnimation('armUp', armUpFrames, 8, false)

    // Arm Down - lowering the accordion arm
    // Based on chart: [5,4,3,2,1]
    var armDownFrames = [
      [b, 24], [b, 23], [b, 22], [b, 21], [b, 20]
    ]
    this.violaArm.addAnimation('armDown', armDownFrames, 8, false)

    // Full arm playing cycle for accordion
    var armPlayFrames = [
      [b, 20], [b, 21], [b, 22], [b, 23], [b, 24], [b, 25],
      [b, 24], [b, 23], [b, 22], [b, 21]
    ]
    this.violaArm.addAnimation('play', armPlayFrames, 6, true)

    // Start with idle
    this.violaHead.animations.play('idle')
    this.violaArm.animations.play('idle')
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
   * Handle click on Viola
   */
  onViolaClick () {
    if (this.isTalking) return

    // Check for music puzzle interaction
    if (!this.musicPuzzleCompleted) {
      this.startMusicPuzzle()
      return
    }

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      this.playDialogue(dialogueId, () => {
        this.violaIdleMode()
      })
    } else {
      // Loop back to start of dialogues
      this.dialogueIndex = 0
      this.playDialogue('84d005v0', () => {
        this.violaIdleMode()
      })
    }
  }

  /**
   * Start the music puzzle interaction
   */
  startMusicPuzzle () {
    this.isTalking = true

    // Viola plays accordion
    this.violaArm.animations.play('play')
    this.violaHead.animations.play('talk')

    // Play music dialogue (84d006v0 often relates to music in game)
    this.game.mulle.playAudio('84d006v0', () => {
      // After explanation, play music clip
      this.game.mulle.playAudio('84e005v2', () => {
        // Mark puzzle as complete
        this.musicPuzzleCompleted = true
        this.game.mulle.user.Boat.addCache('#ViolaMusicPuzzle')

        this.violaArm.animations.play('armDown')
        this.violaHead.animations.play('idle')
        this.isTalking = false

        // Give reward dialogue
        this.playDialogue('84d007v0', () => {
          this.violaIdleMode()
        })
      })
    })
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '84d003v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.violaHead.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[ViolaBoat] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Put Viola in idle mode
   */
  violaIdleMode () {
    this.violaHead.animations.play('idle')
    this.violaArm.animations.play('idle')

    // Occasional blink
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
    this.blinkTimer = this.game.time.events.loop(
      4000 + Math.random() * 3000,
      () => {
        if (!this.isTalking) {
          this.violaHead.animations.play('blink').onComplete.addOnce(() => {
            this.violaHead.animations.play('idle')
          })
        }
      }
    )

    // Occasional accordion arm movement
    if (this.armTimer) {
      this.game.time.events.remove(this.armTimer)
    }
    this.armTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking) {
          this.violaArm.animations.play('armUp').onComplete.addOnce(() => {
            this.game.time.events.add(500, () => {
              this.violaArm.animations.play('armDown').onComplete.addOnce(() => {
                this.violaArm.animations.play('idle')
              })
            })
          })
        }
      }
    )
  }

  /**
   * Play ambient sounds
   */
  playAmbientSounds () {
    // Try to play ambient accordion music
    // 84e004v1 = looped background music
    // 84e006v0 = another ambient loop
    try {
      this.ambientSound = this.game.mulle.playAudio('84e004v1', null)
    } catch (e) {
      console.warn('[ViolaBoat] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      this.game.mulle.stopAudio('84e004v1')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[ViolaBoat] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#ViolaVisited')) {
      this.game.mulle.user.Boat.addCache('#ViolaVisited')
    }

    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Any per-frame updates
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
    if (this.armTimer) {
      this.game.time.events.remove(this.armTimer)
    }

    // Clear sprites
    this.viola = null
    this.violaHead = null
    this.violaArm = null

    super.shutdown()
    console.log('[ViolaBoat] Scene shutdown')
  }
}

export default ViolaBoatState
