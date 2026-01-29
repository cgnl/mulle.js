/**
 * Water Pump Scene
 * @module scenes/waterpump
 * 
 * Scene 85 from the original game (boten_85.DXR)
 * A water pump/fountain scene with animated water
 * 
 * Features:
 * - Background: 85b001v0, 85b002v0, 85b003v0 (640x480 each), 85b004v0 (71x55)
 * - Animated water spray (members 41-53, 13 frames)
 * - Pump interaction with pump, StartSpreading, Spreading animations
 * - 3 dialogue clips (85d001v0 - 85d003v0)
 * 
 * Original game animation chart (waterAnimChart, member 2):
 * [#Actions:[#Still:[1], #pump:[2,2,3,3,4,4,...repeated], 
 *  #StartSpreading:[1,2,2,3,3,4,4,5,5,6,6,7,7], #Spreading:[7,7,8,8]]]
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

class WaterPumpState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_85.DXR'
    this.game.mulle.addAudio('seaworld')

    // Track visit
    if (!this.game.mulle.user.Boat.hasCache('#WaterPumpVisited')) {
      this.game.mulle.user.Boat.addCache('#WaterPumpVisited')
    }

    // === BACKGROUND ===
    // 85b001v0 (member 8) = Main background
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 8)) {
      console.warn('[WaterPump] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x4488AA)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // 85b002v0 (member 9) = Second layer
    var layer2 = new MulleSprite(this.game, 320, 240)
    if (layer2.setDirectorMember(this.DirResource, 9)) {
      this.game.add.existing(layer2)
    }

    // 85b003v0 (member 11) = Third layer
    var layer3 = new MulleSprite(this.game, 320, 240)
    if (layer3.setDirectorMember(this.DirResource, 11)) {
      this.game.add.existing(layer3)
    }

    // === WATER ANIMATION ===
    // Water sprites are members 41-53 (13 frames)
    this.water = new MulleSprite(this.game, 320, 240)
    this.water.setDirectorMember(this.DirResource, 41) // First water frame
    this.game.add.existing(this.water)
    this.setupWaterAnimations()

    // Make water/pump area clickable
    this.water.inputEnabled = true
    this.water.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.water.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.water.events.onInputUp.add(() => {
      this.onPumpClick()
    })

    // === PUMP ELEMENT ===
    // 85b004v0 (member 13) = Small pump element (71x55)
    this.pumpHandle = new MulleSprite(this.game, 320, 240)
    if (this.pumpHandle.setDirectorMember(this.DirResource, 13)) {
      this.game.add.existing(this.pumpHandle)
      this.pumpHandle.inputEnabled = true
      this.pumpHandle.events.onInputUp.add(() => {
        this.onPumpClick()
      })
    }

    // === STATE ===
    this.isPumping = false
    this.isSpreading = false
    this.pumpCount = 0

    // === EXIT BUTTON ===
    this.createExitButton()

    // === DIALOGUE ===
    this.dialogueSequence = ['85d001v0', '85d002v0', '85d003v0']
    this.dialogueIndex = 0

    // === INTRO ===
    this.game.time.events.add(500, () => {
      this.playIntroDialogue()
    })

    console.log('[WaterPump] Scene created')
  }

  /**
   * Setup water animations based on waterAnimChart
   */
  setupWaterAnimations () {
    var b = this.DirResource

    // Still (frame 1 = member 41)
    var stillFrames = []
    stillFrames.push([b, 41])
    this.water.addAnimation('still', stillFrames, 5, true)

    // Pump animation (frames 2,2,3,3,4,4 repeated)
    var pumpFrames = []
    for (var cycle = 0; cycle < 5; cycle++) {
      pumpFrames.push([b, 42]) // 2
      pumpFrames.push([b, 42]) // 2
      pumpFrames.push([b, 43]) // 3
      pumpFrames.push([b, 43]) // 3
      pumpFrames.push([b, 44]) // 4
      pumpFrames.push([b, 44]) // 4
    }
    this.water.addAnimation('pump', pumpFrames, 12, false)

    // StartSpreading animation (frames 1-7 with doubles)
    var startSpreadingFrames = []
    startSpreadingFrames.push([b, 41]) // 1
    startSpreadingFrames.push([b, 42]) // 2
    startSpreadingFrames.push([b, 42]) // 2
    startSpreadingFrames.push([b, 43]) // 3
    startSpreadingFrames.push([b, 43]) // 3
    startSpreadingFrames.push([b, 44]) // 4
    startSpreadingFrames.push([b, 44]) // 4
    startSpreadingFrames.push([b, 45]) // 5
    startSpreadingFrames.push([b, 45]) // 5
    startSpreadingFrames.push([b, 46]) // 6
    startSpreadingFrames.push([b, 46]) // 6
    startSpreadingFrames.push([b, 47]) // 7
    startSpreadingFrames.push([b, 47]) // 7
    this.water.addAnimation('startSpreading', startSpreadingFrames, 10, false)

    // Spreading animation (frames 7,7,8,8 looping)
    var spreadingFrames = []
    spreadingFrames.push([b, 47]) // 7
    spreadingFrames.push([b, 47]) // 7
    spreadingFrames.push([b, 48]) // 8
    spreadingFrames.push([b, 48]) // 8
    this.water.addAnimation('spreading', spreadingFrames, 8, true)

    // Full spray (frames 8-13 for max water)
    var fullSprayFrames = []
    for (var i = 48; i <= 53; i++) {
      fullSprayFrames.push([b, i])
    }
    this.water.addAnimation('fullSpray', fullSprayFrames, 10, true)

    this.water.animations.play('still')
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
    this.playDialogue('85d001v0', () => {
      // Show hint
      this.showHint('Klik op de pomp!')
    })
  }

  /**
   * Handle pump click
   */
  onPumpClick () {
    if (this.isPumping) return

    this.isPumping = true
    this.pumpCount++

    // Play pump sound
    try {
      this.game.mulle.playAudio('85e002v0')
    } catch (e) {
      console.warn('[WaterPump] Pump sound not found')
    }

    // Play pump animation
    var pumpAnim = this.water.animations.play('pump')
    
    if (pumpAnim) {
      pumpAnim.onComplete.addOnce(() => {
        this.isPumping = false

        // After 3 pumps, start spreading water
        if (this.pumpCount >= 3 && !this.isSpreading) {
          this.startSpreading()
        }
      })
    } else {
      this.isPumping = false
    }

    // Play dialogue on first few pumps
    if (this.pumpCount === 1) {
      this.playDialogue('85d002v0')
    } else if (this.pumpCount === 3) {
      this.playDialogue('85d003v0')
    }
  }

  /**
   * Start the water spreading
   */
  startSpreading () {
    this.isSpreading = true

    // Hide hint
    if (this.hintText) {
      this.hintText.destroy()
      this.hintText = null
    }

    // Play start spreading animation
    var startAnim = this.water.animations.play('startSpreading')
    
    if (startAnim) {
      startAnim.onComplete.addOnce(() => {
        // Continue with spreading loop
        this.water.animations.play('spreading')

        // After a while, go to full spray
        this.game.time.events.add(3000, () => {
          this.water.animations.play('fullSpray')
        })
      })
    }

    // Show success message
    this.showMessage('De fontein werkt!')
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

    this.hintText = this.game.add.text(320, 400, text, {
      font: 'bold 18px Arial',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3
    })
    this.hintText.anchor.setTo(0.5, 0.5)

    // Pulse effect
    this.game.add.tween(this.hintText.scale)
      .to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sine.InOut, true, 0, -1, true)
  }

  /**
   * Show message
   */
  showMessage (text) {
    var msgBg = this.game.add.graphics(320, 240)
    msgBg.beginFill(0x000000, 0.7)
    msgBg.drawRoundedRect(-150, -30, 300, 60, 10)
    msgBg.endFill()

    var msgText = this.game.add.text(320, 240, text, {
      font: 'bold 20px Arial',
      fill: '#00ff00'
    })
    msgText.anchor.setTo(0.5, 0.5)

    // Fade out after delay
    this.game.time.events.add(3000, () => {
      this.game.add.tween(msgBg).to({ alpha: 0 }, 500, null, true)
      this.game.add.tween(msgText).to({ alpha: 0 }, 500, null, true)
        .onComplete.add(() => {
          msgBg.destroy()
          msgText.destroy()
        })
    })
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[WaterPump] Returning to seaworld')
    this.game.state.start('seaworld')
  }

  /**
   * Cleanup
   */
  shutdown () {
    this.water = null
    this.pumpHandle = null
    if (this.hintText) this.hintText.destroy()

    super.shutdown()
    console.log('[WaterPump] Scene shutdown')
  }
}

export default WaterPumpState
