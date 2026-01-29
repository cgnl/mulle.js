/**
 * Whale Scene
 * @module scenes/whale
 * 
 * Scene 88 from the original game (boten_88.DXR)
 * A whale watching scene where a whale emerges from the water
 * 
 * Features:
 * - Background: 88b001v1 (640x480), 88b002v0 (534x130 water overlay)
 * - Whale animation: 88a001v0 (members 15-22, 8 frames) - whale surfacing
 * - Water spray: 88a002v0 (members 23-26, 4 frames) - whale blowhole
 * - 4 dialogue clips (88d001v0 - 88d005v0)
 * - Ambient sounds (88e001v0, 88e002v0)
 * 
 * Original game animation chart (waterAnimChart, member 2):
 * Same as scene 85 - used for water spray effects
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

class WhaleState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_88.DXR'
    this.game.mulle.addAudio('seaworld')

    // Track visit
    if (!this.game.mulle.user.Boat.hasCache('#WhaleVisited')) {
      this.game.mulle.user.Boat.addCache('#WhaleVisited')
    }

    // === BACKGROUND ===
    // 88b001v1 (member 13) = Main ocean background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 13)) {
      console.warn('[Whale] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x1a5276)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // === WHALE ===
    // Whale sprites: members 15-22 (88a001v0 series, 8 frames)
    // Frames go from small (15) to large (22) as whale surfaces
    this.whale = new MulleSprite(this.game, 320, 300)
    this.whale.setDirectorMember(this.DirResource, 15) // Start small/hidden
    this.whale.visible = false // Hidden initially
    this.game.add.existing(this.whale)
    this.setupWhaleAnimations()

    // === WATER SPRAY (Blowhole) ===
    // Spray sprites: members 23-26 (88a002v0 series, 4 frames)
    this.spray = new MulleSprite(this.game, 320, 200)
    this.spray.setDirectorMember(this.DirResource, 23)
    this.spray.visible = false
    this.game.add.existing(this.spray)
    this.setupSprayAnimations()

    // === WATER OVERLAY ===
    // 88b002v0 (member 14) = Water surface overlay (534x130)
    this.waterOverlay = new MulleSprite(this.game, 320, 400)
    if (this.waterOverlay.setDirectorMember(this.DirResource, 14)) {
      this.game.add.existing(this.waterOverlay)
    }

    // Make water clickable to trigger whale
    var clickZone = this.game.add.graphics(320, 300)
    clickZone.beginFill(0x000000, 0.01)
    clickZone.drawRect(-200, -100, 400, 200)
    clickZone.endFill()
    clickZone.inputEnabled = true
    clickZone.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    clickZone.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    clickZone.events.onInputUp.add(() => {
      this.onWaterClick()
    })

    // === STATE ===
    this.whaleVisible = false
    this.whaleAnimating = false
    this.whaleAppearances = 0

    // === EXIT BUTTON ===
    this.createExitButton()

    // === DIALOGUE ===
    this.dialogueSequence = ['88d001v0', '88d003v0', '88d004v0', '88d005v0']
    this.dialogueIndex = 0

    // === AMBIENT SOUNDS ===
    this.playAmbientSounds()

    // === INTRO ===
    this.game.time.events.add(1000, () => {
      this.playIntroDialogue()
    })

    // Random whale appearances
    this.startRandomWhaleTimer()

    console.log('[Whale] Scene created - watch for the whale!')
  }

  /**
   * Setup whale animations
   * Frames 1-8 show whale rising from water (small to large)
   */
  setupWhaleAnimations () {
    var b = this.DirResource

    // Hidden state (frame 1 = member 15, smallest)
    var hiddenFrames = []
    hiddenFrames.push([b, 15])
    this.whale.addAnimation('hidden', hiddenFrames, 5, true)

    // Surface animation (frames 1-8, whale emerges)
    var surfaceFrames = []
    for (var i = 15; i <= 22; i++) {
      surfaceFrames.push([b, i])
    }
    this.whale.addAnimation('surface', surfaceFrames, 6, false)

    // Visible state (frame 8 = member 22, fully surfaced)
    var visibleFrames = []
    visibleFrames.push([b, 22])
    this.whale.addAnimation('visible', visibleFrames, 5, true)

    // Dive animation (frames 8-1, whale submerges)
    var diveFrames = []
    for (var i = 22; i >= 15; i--) {
      diveFrames.push([b, i])
    }
    this.whale.addAnimation('dive', diveFrames, 6, false)

    // Breach animation (quick surface and dive)
    var breachFrames = []
    // Up
    for (var i = 15; i <= 22; i++) {
      breachFrames.push([b, i])
    }
    // Hold at top
    breachFrames.push([b, 22])
    breachFrames.push([b, 22])
    breachFrames.push([b, 22])
    // Down
    for (var i = 22; i >= 15; i--) {
      breachFrames.push([b, i])
    }
    this.whale.addAnimation('breach', breachFrames, 8, false)
  }

  /**
   * Setup spray/blowhole animations
   */
  setupSprayAnimations () {
    var b = this.DirResource

    // Spray animation (frames 1-4)
    var sprayFrames = []
    sprayFrames.push([b, 23]) // 1
    sprayFrames.push([b, 24]) // 2
    sprayFrames.push([b, 25]) // 3
    sprayFrames.push([b, 26]) // 4
    sprayFrames.push([b, 25]) // 3
    sprayFrames.push([b, 24]) // 2
    this.spray.addAnimation('spray', sprayFrames, 10, false)
  }

  /**
   * Start random whale appearance timer
   */
  startRandomWhaleTimer () {
    this.whaleTimer = this.game.time.events.loop(
      10000 + Math.random() * 15000,
      () => {
        if (!this.whaleAnimating && Math.random() > 0.5) {
          this.triggerWhaleAppearance()
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
   * Play ambient ocean sounds
   */
  playAmbientSounds () {
    try {
      this.ambientSound = this.game.mulle.playAudio('88e001v0')
      if (this.ambientSound) {
        this.ambientSound.loop = true
      }
    } catch (e) {
      console.warn('[Whale] Ambient sound not available')
    }
  }

  /**
   * Play intro dialogue
   */
  playIntroDialogue () {
    this.playDialogue('88d001v0', () => {
      this.showHint('Wacht op de walvis...')
    })
  }

  /**
   * Handle water click
   */
  onWaterClick () {
    if (this.whaleAnimating) return

    // Clicking water can trigger whale appearance
    if (!this.whaleVisible && Math.random() > 0.3) {
      this.triggerWhaleAppearance()
    } else if (this.whaleVisible) {
      // Clicking when whale visible plays dialogue
      var dialogue = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogueSequence.length
      this.playDialogue(dialogue)
    }
  }

  /**
   * Trigger whale appearance
   */
  triggerWhaleAppearance () {
    if (this.whaleAnimating) return

    this.whaleAnimating = true
    this.whaleAppearances++

    // Hide hint
    if (this.hintText) {
      this.hintText.destroy()
      this.hintText = null
    }

    // Show whale
    this.whale.visible = true

    // Play whale sound
    try {
      this.game.mulle.playAudio('88e002v0')
    } catch (e) {
      console.warn('[Whale] Whale sound not available')
    }

    // Play breach animation
    var breachAnim = this.whale.animations.play('breach')
    
    if (breachAnim) {
      // Show spray at peak of breach
      this.game.time.events.add(800, () => {
        this.showSpray()
      })

      breachAnim.onComplete.addOnce(() => {
        this.whale.visible = false
        this.whaleAnimating = false
        this.whaleVisible = false

        // Play reaction dialogue on first appearance
        if (this.whaleAppearances === 1) {
          this.playDialogue('88d003v0')
        }
      })
    } else {
      this.whaleAnimating = false
    }
  }

  /**
   * Show whale spray/blowhole effect
   */
  showSpray () {
    this.spray.visible = true
    this.spray.position.set(this.whale.x, this.whale.y - 50)

    var sprayAnim = this.spray.animations.play('spray')
    if (sprayAnim) {
      sprayAnim.onComplete.addOnce(() => {
        this.spray.visible = false
      })
    } else {
      this.game.time.events.add(600, () => {
        this.spray.visible = false
      })
    }
  }

  /**
   * Play dialogue
   */
  playDialogue (dialogueId, onComplete) {
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      if (onComplete) onComplete()
    })

    if (!audio && onComplete) {
      this.game.time.events.add(2000, onComplete)
    }
  }

  /**
   * Show hint text
   */
  showHint (text) {
    if (this.hintText) this.hintText.destroy()

    this.hintText = this.game.add.text(320, 420, text, {
      font: 'bold 16px Arial',
      fill: '#aaddff',
      stroke: '#000000',
      strokeThickness: 2
    })
    this.hintText.anchor.setTo(0.5, 0.5)
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Whale] Returning to seaworld')

    // Stop ambient sounds
    if (this.ambientSound) {
      this.ambientSound.stop()
    }

    this.game.state.start('seaworld')
  }

  /**
   * Cleanup
   */
  shutdown () {
    if (this.whaleTimer) this.game.time.events.remove(this.whaleTimer)
    if (this.ambientSound) this.ambientSound.stop()

    this.whale = null
    this.spray = null
    this.waterOverlay = null
    if (this.hintText) this.hintText.destroy()

    super.shutdown()
    console.log('[Whale] Scene shutdown')
  }
}

export default WhaleState
