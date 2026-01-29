/**
 * Lighthouse scene (Sam's place)
 * @module scenes/lighthouse
 * 
 * Scene 80 from the original game (boten_80.DXR)
 * The largest boat destination at 9.7 MB
 * 
 * Features:
 * - Lighthouse background (80b001v1, 80b002v0)
 * - Sam NPC with idle/talk animations
 * - Lamp animation with blinking effect
 * - 18 dialogue clips (80d001v0 - 80d018v0)
 * - Clickable interaction with Sam
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

class LighthouseState extends MulleState {
  preload () {
    super.preload()

    // Load lighthouse assets (seaworld pack contains boten_80 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_80.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedLighthouse')) {
      this.game.mulle.user.Boat.addCache('#VisitedLighthouse')
    }

    // === BACKGROUND ===
    // 80b001v1 (member 17) = Main lighthouse background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 17)
    this.game.add.existing(background)

    // 80b002v0 (member 22) = Alternative/overlay background (if needed)
    // Can be used for different states or weather conditions

    // === SAM NPC ===
    // Create Sam actor using boten_80.DXR sprites
    // Based on the animation data, member 24 (80a000v0) is Sam's base sprite
    this.sam = new MulleSprite(this.game, 162, 240)
    this.sam.setDirectorMember(this.DirResource, 24)
    this.game.add.existing(this.sam)

    // Setup Sam animations based on seaworld-animations.json
    // The animation chart shows frames for: Still, turntalk, thumbs, Wait, TalkStill, talk, EyetoEyeTalk, eyeloop
    this.setupSamAnimations()

    // Make Sam clickable
    this.sam.inputEnabled = true
    this.sam.input.useHandCursor = true
    this.sam.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.sam.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.sam.events.onInputUp.add(() => {
      this.onSamClick()
    })

    // === LAMP ANIMATION ===
    // The animation data shows 'lampa' (lamp) animations with frames 1,2,3 and 'blinkloop'
    this.lamp = new MulleSprite(this.game, 320, 100)
    this.lamp.setDirectorMember(this.DirResource, 23) // 80b003v0 - lamp/light element
    this.game.add.existing(this.lamp)

    // Setup lamp blinking animation
    this.setupLampAnimation()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#LighthouseIntroPlayed')) {
      // Play intro dialogue (80d001v0 - Sam's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('80d001v0', () => {
          this.game.mulle.user.Boat.addCache('#LighthouseIntroPlayed')
          this.samIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('80d002v0', () => {
          this.samIdleMode()
        })
      })
    }

    // Play ambient sounds (waves, seagulls, etc.)
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    this.dialogueSequence = [
      '80d003v0', '80d004v0', '80d005v0', '80d006v0', '80d007v0',
      '80d008v0', '80d009v0', '80d010v0', '80d011v0', '80d012v0',
      '80d013v0', '80d014v0', '80d015v0', '80d016v0', '80d017v0', '80d018v0'
    ]

    console.log('[Lighthouse] Scene created - Sam\'s lighthouse')
  }

  /**
   * Setup Sam's animations
   * Based on animation chart in seaworld-animations.json
   */
  setupSamAnimations () {
    var b = this.DirResource

    // Sam uses members 24-33 for various animation frames
    // 80a000v0 (24), 80a000v1 (25), 80a002v0 (26), etc.

    // Idle/Still animation
    var idleFrames = []
    idleFrames.push([b, 24])
    this.sam.addAnimation('idle', idleFrames, 5, true)

    // Talk animation - uses frames with mouth positions
    var talkFrames = []
    for (var i = 24; i <= 33; i++) {
      talkFrames.push([b, i])
    }
    this.sam.addAnimation('talk', talkFrames, 10, true)

    // Eye blink/loop animation
    var blinkFrames = []
    blinkFrames.push([b, 24])
    blinkFrames.push([b, 25])
    blinkFrames.push([b, 24])
    this.sam.addAnimation('blink', blinkFrames, 8, false)

    // Thumbs up animation
    var thumbsFrames = []
    for (var i = 26; i <= 33; i++) {
      thumbsFrames.push([b, i])
    }
    this.sam.addAnimation('thumbs', thumbsFrames, 8, false)

    // Start with idle
    this.sam.animations.play('idle')
  }

  /**
   * Setup lamp blinking animation
   */
  setupLampAnimation () {
    var b = this.DirResource

    // Lamp frames based on animation data
    // 'lampa' uses frames 1, 2, 3 and 'blinkloop'
    var lampOnFrames = [[b, 23]]
    var lampBlinkFrames = []
    lampBlinkFrames.push([b, 23])
    // Add slight variations for blinking effect

    this.lamp.addAnimation('on', lampOnFrames, 1, true)
    this.lamp.addAnimation('blink', lampBlinkFrames, 2, true)

    // Create periodic lamp blinking
    this.lampBlinkTimer = this.game.time.events.loop(3000, () => {
      this.lamp.alpha = 0.3
      this.game.time.events.add(200, () => {
        this.lamp.alpha = 1
        this.game.time.events.add(200, () => {
          this.lamp.alpha = 0.3
          this.game.time.events.add(200, () => {
            this.lamp.alpha = 1
          })
        })
      })
    })
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
   * Handle click on Sam
   */
  onSamClick () {
    if (this.isTalking) return

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      this.playDialogue(dialogueId, () => {
        this.samIdleMode()
      })
    } else {
      // Loop back to start of additional dialogues
      this.dialogueIndex = 0
      this.playDialogue('80d003v0', () => {
        this.samIdleMode()
      })
    }
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '80d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.sam.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Lighthouse] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Put Sam in idle mode
   */
  samIdleMode () {
    this.sam.animations.play('idle')

    // Occasional blink
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
    this.blinkTimer = this.game.time.events.loop(
      4000 + Math.random() * 3000,
      () => {
        if (!this.isTalking) {
          this.sam.animations.play('blink').onComplete.addOnce(() => {
            this.sam.animations.play('idle')
          })
        }
      }
    )
  }

  /**
   * Play ambient sounds
   */
  playAmbientSounds () {
    // Try to play ambient ocean/lighthouse sounds
    // The audio file may contain ambient tracks
    try {
      // Ocean waves ambient (if available)
      this.ambientSound = this.game.mulle.playAudio('80e001v0', null)
    } catch (e) {
      console.warn('[Lighthouse] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      this.game.mulle.stopAudio('80e001v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Lighthouse] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#LighthouseVisited')) {
      this.game.mulle.user.Boat.addCache('#LighthouseVisited')
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
    if (this.lampBlinkTimer) {
      this.game.time.events.remove(this.lampBlinkTimer)
    }
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }

    // Clear actors
    this.sam = null

    super.shutdown()
    console.log('[Lighthouse] Scene shutdown')
  }
}

export default LighthouseState
