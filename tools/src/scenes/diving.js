/**
 * Diving scene (Underwater diving spot)
 * @module scenes/diving
 * 
 * Scene 87 from the original game (boten_87.DXR)
 * Underwater diving location
 * 
 * Features:
 * - Underwater background (87b001v0, 87b003v1, 87b004v0)
 * - Diver character with walk/peek animations
 * - Dialogue clips (87d001v0 - 87d008v0)
 * - Ambient underwater sounds (87e001v0, 87e003v1)
 * - Clickable interaction with diver
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * 
 * Diver Animations (from 2.txt):
 * - Still: [1]
 * - walk1: [56,57,58,59,60,1,1,1,1,55,55,55,55,55,55,55,1,1,1,1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
 * - walk2: [18,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,37]
 * - peek2: [38,39,38,38,38,38,38,38,39,38,39,38,39,38,39,39,39,39,39,39,39]
 * - walk3: [39,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54]
 * - peek1: [17]
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleActor from '../objects/actor'

class DivingState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets (contains boten_87 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_87.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedDiving')) {
      this.game.mulle.user.Boat.addCache('#VisitedDiving')
    }

    // === UNDERWATER BACKGROUND ===
    // 87b001v0 (member 5) = Main underwater background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 5)
    this.game.add.existing(background)

    // 87b003v1 (member 24) = Alternative underwater layer
    // Used for additional underwater details
    this.underwaterLayer = new MulleSprite(this.game, 320, 240)
    this.underwaterLayer.setDirectorMember(this.DirResource, 24)
    this.underwaterLayer.alpha = 0.5
    this.game.add.existing(this.underwaterLayer)

    // === DIVER NPC ===
    // Create diver using boten_87.DXR sprites
    // Member 29 (87a001v0) is the base diver sprite
    this.diver = new MulleSprite(this.game, 320, 300)
    this.diver.setDirectorMember(this.DirResource, 29)
    this.game.add.existing(this.diver)

    // Setup diver animations based on animation data
    this.setupDiverAnimations()

    // Make diver clickable
    this.diver.inputEnabled = true
    this.diver.input.useHandCursor = true
    this.diver.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.diver.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.diver.events.onInputUp.add(() => {
      this.onDiverClick()
    })

    // === BUBBLES EFFECT ===
    this.createBubbles()

    // === WATER LIGHT EFFECT ===
    this.createWaterLightEffect()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#DivingIntroPlayed')) {
      // Play intro dialogue (87d001v0 - Diver's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('87d001v0', () => {
          this.game.mulle.user.Boat.addCache('#DivingIntroPlayed')
          this.diverIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('87d008v0', () => {
          this.diverIdleMode()
        })
      })
    }

    // Play underwater ambient sounds
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    // All dialogue clips from boten_87.DXR
    this.dialogueSequence = [
      '87d004v0', '87d005v0', '87d006v0', '87d007v0', '87d008v0'
    ]

    console.log('[Diving] Scene created - Underwater diving spot')
  }

  /**
   * Setup diver animations
   * Based on animation chart from boten_87.DXR/Internal/2.txt
   */
  setupDiverAnimations () {
    var b = this.DirResource

    // Animation frames are numbered sequentially in the boten_87.DXR
    // Based on the animation data, we map frame numbers to member IDs
    // Members start around 29 for the diver sprites

    // Idle/Still animation (frame 1)
    var idleFrames = [[b, 29]]
    this.diver.addAnimation('idle', idleFrames, 5, true)

    // Walk1 animation - diver swimming/walking cycle
    // Frames: 56,57,58,59,60,1,1,1,1,55,55,55,55,55,55,55,1,1,1,1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17
    // Map to available members (starting around member 29)
    var walk1Frames = []
    // Using a subset of frames for smooth animation
    for (var i = 29; i <= 45; i++) {
      walk1Frames.push([b, i])
    }
    this.diver.addAnimation('walk1', walk1Frames, 10, false)

    // Walk2 animation
    // Frames: 18,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,37
    var walk2Frames = []
    for (var i = 32; i <= 48; i++) {
      walk2Frames.push([b, i])
    }
    this.diver.addAnimation('walk2', walk2Frames, 10, false)

    // Peek animation (diver peeking around)
    // Frames: 38,39,38,38,38,38,38,38,39,38,39,38,39,38,39,39,39,39,39,39,39
    var peekFrames = [
      [b, 38], [b, 39], [b, 38], [b, 38], [b, 39],
      [b, 38], [b, 39], [b, 39], [b, 39], [b, 38]
    ]
    this.diver.addAnimation('peek', peekFrames, 8, false)

    // Walk3 animation (deeper swimming)
    // Frames: 39,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54
    var walk3Frames = []
    for (var i = 39; i <= 55; i++) {
      walk3Frames.push([b, i])
    }
    this.diver.addAnimation('walk3', walk3Frames, 10, false)

    // Talk animation (reuse walk frames with mouth movements)
    var talkFrames = []
    for (var i = 29; i <= 38; i++) {
      talkFrames.push([b, i])
    }
    this.diver.addAnimation('talk', talkFrames, 10, true)

    // Start with idle
    this.diver.animations.play('idle')
  }

  /**
   * Create underwater bubble effect
   */
  createBubbles () {
    this.bubbles = this.game.add.group()

    // Create periodic bubbles
    this.bubbleTimer = this.game.time.events.loop(500, () => {
      this.spawnBubble()
    })

    // Spawn initial bubbles
    for (var i = 0; i < 5; i++) {
      this.game.time.events.add(i * 100, () => {
        this.spawnBubble()
      })
    }
  }

  /**
   * Spawn a single bubble
   */
  spawnBubble () {
    var x = this.game.rnd.integerInRange(50, 590)
    var y = this.game.rnd.integerInRange(400, 480)
    var size = this.game.rnd.integerInRange(2, 8)

    var bubble = this.game.add.graphics(x, y)
    bubble.beginFill(0xffffff, 0.4)
    bubble.drawCircle(0, 0, size)
    bubble.endFill()

    this.bubbles.add(bubble)

    // Animate bubble rising
    var targetY = -20
    var duration = this.game.rnd.integerInRange(3000, 6000)
    var wobbleAmount = this.game.rnd.integerInRange(20, 40)

    this.game.add.tween(bubble)
      .to({ y: targetY }, duration, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        bubble.destroy()
      })

    // Wobble side to side
    this.game.add.tween(bubble)
      .to({ x: x + wobbleAmount }, duration / 4, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  /**
   * Create underwater light ray effect
   */
  createWaterLightEffect () {
    this.lightRays = this.game.add.graphics(0, 0)
    this.lightRayOffset = 0

    this.lightRayTimer = this.game.time.events.loop(100, () => {
      this.lightRayOffset += 0.02
      this.drawLightRays()
    })
  }

  /**
   * Draw animated light rays from surface
   */
  drawLightRays () {
    if (!this.lightRays) return

    this.lightRays.clear()

    // Draw several light rays from top
    for (var i = 0; i < 5; i++) {
      var baseX = 100 + i * 120 + Math.sin(this.lightRayOffset + i) * 30
      var alpha = 0.05 + Math.sin(this.lightRayOffset * 2 + i) * 0.03

      this.lightRays.beginFill(0xaaddff, alpha)
      this.lightRays.moveTo(baseX - 20, 0)
      this.lightRays.lineTo(baseX + 20, 0)
      this.lightRays.lineTo(baseX + 60 + Math.sin(this.lightRayOffset + i) * 20, 480)
      this.lightRays.lineTo(baseX - 60 + Math.sin(this.lightRayOffset + i) * 20, 480)
      this.lightRays.endFill()
    }
  }

  /**
   * Create exit button to return to seaworld
   */
  createExitButton () {
    // Create exit/back button
    this.exitButton = this.game.add.text(50, 430, 'Naar boven', {
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

    // Also add clickable area at top of screen (swim up to exit)
    var exitZone = this.game.add.graphics(0, 0)
    exitZone.beginFill(0x000000, 0.01) // Nearly invisible
    exitZone.drawRect(0, 0, 640, 40)
    exitZone.endFill()
    exitZone.inputEnabled = true
    exitZone.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    exitZone.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    exitZone.events.onInputUp.add(() => {
      this.exitToSeaworld()
    })
  }

  /**
   * Handle click on diver
   */
  onDiverClick () {
    if (this.isTalking) return

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      this.playDialogue(dialogueId, () => {
        this.diverIdleMode()
      })
    } else {
      // Loop back to start of additional dialogues
      this.dialogueIndex = 0

      // Play a random animation before repeating dialogue
      var randomAnim = this.game.rnd.pick(['peek', 'walk1', 'walk2'])
      this.diver.animations.play(randomAnim).onComplete.addOnce(() => {
        this.playDialogue('87d004v0', () => {
          this.diverIdleMode()
        })
      })
    }
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '87d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.diver.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Diving] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Put diver in idle mode
   */
  diverIdleMode () {
    this.diver.animations.play('idle')

    // Occasional peek animation
    if (this.peekTimer) {
      this.game.time.events.remove(this.peekTimer)
    }
    this.peekTimer = this.game.time.events.loop(
      6000 + Math.random() * 4000,
      () => {
        if (!this.isTalking) {
          this.diver.animations.play('peek').onComplete.addOnce(() => {
            this.diver.animations.play('idle')
          })
        }
      }
    )
  }

  /**
   * Play ambient underwater sounds
   */
  playAmbientSounds () {
    // Play underwater ambient sounds
    // 87e001v0 = main underwater ambient
    // 87e002v0 = bubble/water sounds
    // 87e003v1 = alternative ambient
    try {
      this.ambientSound = this.game.mulle.playAudio('87e001v0', null)
      if (this.ambientSound) {
        this.ambientSound.loop = true
      }
      
      // Also try secondary ambient
      this.ambientSound2 = this.game.mulle.playAudio('87e002v0', null)
      if (this.ambientSound2) {
        this.ambientSound2.loop = true
        this.ambientSound2.volume = 0.5
      }
    } catch (e) {
      console.warn('[Diving] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      this.game.mulle.stopAudio('87e001v0')
      this.game.mulle.stopAudio('87e002v0')
      this.game.mulle.stopAudio('87e003v1')
      if (this.ambientSound) this.ambientSound.stop()
      if (this.ambientSound2) this.ambientSound2.stop()
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Diving] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#DivingVisited')) {
      this.game.mulle.user.Boat.addCache('#DivingVisited')
    }

    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Gentle underwater swaying for the diver
    if (this.diver && !this.isTalking) {
      this.diver.x = 320 + Math.sin(this.game.time.now / 2000) * 5
      this.diver.y = 300 + Math.sin(this.game.time.now / 1500) * 3
    }

    // Gentle sway for underwater layer
    if (this.underwaterLayer) {
      this.underwaterLayer.alpha = 0.4 + Math.sin(this.game.time.now / 3000) * 0.1
    }
  }

  /**
   * Cleanup on scene exit
   */
  shutdown () {
    // Stop all sounds
    this.stopAmbientSounds()

    // Clear timers
    if (this.bubbleTimer) {
      this.game.time.events.remove(this.bubbleTimer)
    }
    if (this.lightRayTimer) {
      this.game.time.events.remove(this.lightRayTimer)
    }
    if (this.peekTimer) {
      this.game.time.events.remove(this.peekTimer)
    }

    // Clear bubbles
    if (this.bubbles) {
      this.bubbles.destroy(true)
    }

    // Clear graphics
    if (this.lightRays) {
      this.lightRays.destroy()
    }

    // Clear actors
    this.diver = null

    super.shutdown()
    console.log('[Diving] Scene shutdown')
  }
}

export default DivingState
