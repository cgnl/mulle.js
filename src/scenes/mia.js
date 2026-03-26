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
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

// Pure data module — Lingo-faithful Mia mission logic (tested)
const { computeMiaResult } = require('./MiaData')

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

    // === SKY ===
    // Original Lingo: spriteList to [#BoatStart: 6, #Sky: 1]
    // setSky(the weather of gMulleGlobals) - displays weather-based sky from 00b0XXv0
    // Sky sprites: 00b011v0 (sunny), 00b012v0 (cloudy), etc.
    this.setSky()

    // === BACKGROUND ===
    // 83b001v1 (member 26) = Main island background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 26)
    this.game.add.existing(background)

    // 83b002v0 (member 27) = Alternative/overlay background (can be used for different states)
    // 83b003v0 (member 29) = Additional background element (pier/dock area)

    // === PLAYER'S BOAT ===
    // Original Lingo: drawBoat(point(310, 150))
    // Draws the player's boat at the dock/shore
    this.boat = new MulleBuildBoat(this.game, 310, 150, null, true, false)
    this.game.add.existing(this.boat)

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

    // === LINGO PARITY: Process missions on scene entry ===
    // Original Lingo: startMovie runs mission logic BEFORE dialogue routing.
    // The marker determines which dialogue sequence plays.
    this.missionMarker = this.processMissions()

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

    // BUG FIX #2.9: Scene Animation Frame Rates - Standardized to 12 FPS (Director default)
    // Idle animations use lower rate (5 FPS) for minimal movement
    // Action animations use 12 FPS for Director-standard playback
    // Blink uses 15 FPS for special effect (natural eye movement)

    // Frame mapping: animation frame number -> member number
    // Frame 1 = member 12, Frame 2 = member 13, ..., Frame 10 = member 21
    const frameToMember = (frame) => 11 + frame  // frame 1 -> member 12

    // Idle/Still animation - just frame 1 - 5 FPS for idle state
    var idleFrames = []
    idleFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('idle', idleFrames, 5, true)

    // TalkStill - frame 1 (same as idle, for when talking but minimal movement) - 5 FPS
    var talkStillFrames = []
    talkStillFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('talkStill', talkStillFrames, 5, true)

    // Turn animation - [1,2,2,3,3,4] - Mia turning to face different direction - 12 FPS standard
    var turnFrames = []
    turnFrames.push([b, frameToMember(1)])
    turnFrames.push([b, frameToMember(2)])
    turnFrames.push([b, frameToMember(2)])
    turnFrames.push([b, frameToMember(3)])
    turnFrames.push([b, frameToMember(3)])
    turnFrames.push([b, frameToMember(4)])
    this.mia.addAnimation('turn', turnFrames, 12, false)

    // TurnBack animation - [4,4,3,3,2,1] - Mia turning back - 12 FPS standard
    var turnBackFrames = []
    turnBackFrames.push([b, frameToMember(4)])
    turnBackFrames.push([b, frameToMember(4)])
    turnBackFrames.push([b, frameToMember(3)])
    turnBackFrames.push([b, frameToMember(3)])
    turnBackFrames.push([b, frameToMember(2)])
    turnBackFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('turnBack', turnBackFrames, 12, false)

    // TurnTalk animation - [4,6,5,4,5,6] - Mia talking while turned - 12 FPS standard
    var turnTalkFrames = []
    turnTalkFrames.push([b, frameToMember(4)])
    turnTalkFrames.push([b, frameToMember(6)])
    turnTalkFrames.push([b, frameToMember(5)])
    turnTalkFrames.push([b, frameToMember(4)])
    turnTalkFrames.push([b, frameToMember(5)])
    turnTalkFrames.push([b, frameToMember(6)])
    this.mia.addAnimation('turnTalk', turnTalkFrames, 12, true)

    // Talk animation - [8,9,1,[rndframe,[1,8,1,9]]] - main talking - 12 FPS standard
    // Simplified: frames 8, 9, 1, 8, 1, 9 cycling
    var talkFrames = []
    talkFrames.push([b, frameToMember(8)])
    talkFrames.push([b, frameToMember(9)])
    talkFrames.push([b, frameToMember(1)])
    talkFrames.push([b, frameToMember(8)])
    talkFrames.push([b, frameToMember(1)])
    talkFrames.push([b, frameToMember(9)])
    this.mia.addAnimation('talk', talkFrames, 12, true)

    // Blink loop animation - mostly frame 1 with occasional frame 10 (eyes closed)
    // 15 FPS = intentional special effect for natural eye blink
    // Original: [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,10,10,1,1,1,1,1,1,1,1,1,1,1,1,1]
    var blinkFrames = []
    // 22 frames of 1, then 2 frames of 10 (blink), then 13 frames of 1
    for (var i = 0; i < 22; i++) blinkFrames.push([b, frameToMember(1)])
    blinkFrames.push([b, frameToMember(10)])
    blinkFrames.push([b, frameToMember(10)])
    for (var i = 0; i < 13; i++) blinkFrames.push([b, frameToMember(1)])
    this.mia.addAnimation('blink', blinkFrames, 15, false)  // 15 FPS = intentional special effect

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
   * Check if boat has a specific property
   * @param {string} propertyName - Property name (e.g., 'Bench', 'Watertank')
   * @returns {boolean}
   */
  boatHasProperty (propertyName) {
    const boat = this.game.mulle.user.Boat
    if (!boat) return false
    
    // Use getProperty() which returns the property value
    const value = boat.getProperty(propertyName, 0)
    return value > 0
  }

  /**
   * Process missions according to original Lingo flow via MiaData.
   *
   * Lingo tmpGiveParts for scene 83: [17, 46]
   *   objectParts[0] = 17 (first-visit gift)
   *   objectParts[1] = 46 (M13 completion reward — Compass)
   *
   * @returns {string} Dialogue marker
   */
  processMissions () {
    const user = this.game.mulle.user

    // --- Gather state ---
    const isMission25Completed = !!user.isMissionCompleted(25)
    const isMission13Given = !!user.isMissionGiven(13)
    const isMission13Completed = !!user.isMissionCompleted(13)
    const hasBench = this.boatHasProperty('bench')
    const randomPart = user.getRandomPart ? user.getRandomPart() : null
    const objectParts = [17, 46]

    console.log('[Mia] Processing missions...')
    console.log('[Mia] Mission 25 completed:', isMission25Completed)
    console.log('[Mia] Mission 13 given:', isMission13Given)
    console.log('[Mia] Mission 13 completed:', isMission13Completed)
    console.log('[Mia] Boat has Bench:', hasBench)

    // --- Compute (pure) ---
    const result = computeMiaResult({
      isMission25Completed,
      isMission13Given,
      isMission13Completed,
      hasBench,
      randomPart,
      objectParts
    })
    console.log('[Mia] Lingo result:', result.marker, '→', result.goTo)

    // --- Apply side-effects based on computed actions ---
    if (result.actions.completeMission25) {
      user.addCompletedMission(25)
      console.log('[Mia] Completed mission 25')
    }

    if (result.actions.giveMission13) {
      user.addGivenMission(13)
      console.log('[Mia] Gave mission 13')
    }

    if (result.actions.completeMission13) {
      user.addCompletedMission(13)
      console.log('[Mia] Completed mission 13')
    }

    // Lingo: addNewPart(user, givePart) — guard against null/undefined
    if (result.actions.givePart != null) {
      user.addBoatPart('Quay', result.actions.givePart)
      console.log('[Mia] Awarded part', result.actions.givePart)
    }

    // Lingo: "nomission" path always goes to "start", others go to marker
    console.log('[Mia] Mission marker:', result.marker, '→ goTo:', result.goTo)
    return result.marker
  }



  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Mia] Returning to seaworld')

    // Lingo parity: missions are processed on scene ENTRY (startMovie),
    // not on exit. No need to re-process here.
    this.stopAmbientSounds()
    this.game.state.start('seaworld')
  }

  /**
   * Show reward notification
   * @param {string} message - Reward message
   */
  showRewardNotification (message) {
    const rewardText = this.game.add.text(320, 200, message, {
      font: 'bold 18px Arial',
      fill: '#00ff00',
      stroke: '#006600',
      strokeThickness: 3,
      align: 'center'
    })
    rewardText.anchor.setTo(0.5, 0.5)

    // Animate
    this.game.add.tween(rewardText.scale)
      .to({ x: 1.2, y: 1.2 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    // Fade out after delay (don't block exit)
    this.game.time.events.add(2000, () => {
      this.game.add.tween(rewardText)
        .to({ alpha: 0 }, 400, null, true)
        .onComplete.add(() => {
          rewardText.destroy()
        })
    })
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Any per-frame updates can go here
  }

  /**
   * Get weather type (1-4) from global weather state
   * Original Lingo: getType(the weather of gMulleGlobals)
   * 1 = Calm, 2 = Windy, 3 = Rainy, 4 = Stormy
   */
  getWeatherType () {
    const weather = this.game.mulle.weather ||
                    this.game.mulle.user?.weather ||
                    this.game.mulle.SeaMap?.weather ||
                    'clear'

    const weatherMap = {
      'clear': 1,
      'calm': 1,
      'sunny': 1,
      'windy': 2,
      'breezy': 2,
      'rainy': 3,
      'rain': 3,
      'stormy': 4,
      'storm': 4
    }

    if (typeof weather === 'number') {
      return Math.max(1, Math.min(4, weather))
    }

    if (!weather || typeof weather !== 'string') {
      return 1
    }

    return weatherMap[weather.toLowerCase()] || 1
  }

  /**
   * Create sky sprite based on current weather
   * Original Lingo: setSky(the weather of gMulleGlobals)
   * 
   * Sky member names: 00b0XXv0 where XX = 10 + weatherType
   * - Type 1 (calm): 00b011v0
   * - Type 2 (windy): 00b012v0
   * - Type 3 (rainy): 00b013v0
   * - Type 4 (stormy): 00b014v0
   */
  setSky () {
    const weatherType = this.getWeatherType()

    // Try to load Director sky sprite
    this.skySprite = new MulleSprite(this.game, 320, 240)

    // Calculate sky member name
    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`

    // Try boten_00.CXT first
    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)

    // Fallback to 00.CXT
    if (!loaded) {
      loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
    }

    if (loaded) {
      this.game.add.existing(this.skySprite)
      console.log('[Mia] Sky sprite loaded:', skyMemberName, 'for weather type:', weatherType)
    } else {
      // Fallback: Create simple sky gradient
      console.log('[Mia] Sky sprite not found, using fallback for weather type:', weatherType)
      this.skySprite.destroy()
      this.skySprite = null
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Create a fallback sky using Phaser graphics
   * @param {number} weatherType - 1=calm, 2=windy, 3=rainy, 4=stormy
   */
  createFallbackSky (weatherType) {
    const skyColors = {
      1: { top: 0x87CEEB, bottom: 0xB0E0E6 },  // Calm - Light blue
      2: { top: 0x6B8BA4, bottom: 0x9DB8C8 },  // Windy - Gray-blue
      3: { top: 0x5A6973, bottom: 0x8899A6 },  // Rainy - Dark gray
      4: { top: 0x3D4852, bottom: 0x5C6B7A }   // Stormy - Dark
    }

    const colors = skyColors[weatherType] || skyColors[1]

    this.skyGraphics = this.game.add.graphics(0, 0)

    // Draw gradient sky (top half only for island scene)
    const steps = 20
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const color = this.interpolateColor(colors.top, colors.bottom, t)
      const y = i * (240 / steps)
      const h = 240 / steps + 1
      this.skyGraphics.beginFill(color, 1)
      this.skyGraphics.drawRect(0, y, 640, h)
      this.skyGraphics.endFill()
    }

    // Send to back
    this.game.world.sendToBack(this.skyGraphics)

    console.log('[Mia] Fallback sky created for weather type:', weatherType)
  }

  /**
   * Interpolate between two colors
   * @param {number} color1 - Start color (hex)
   * @param {number} color2 - End color (hex)
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated color
   */
  interpolateColor (color1, color2, t) {
    const r1 = (color1 >> 16) & 0xFF
    const g1 = (color1 >> 8) & 0xFF
    const b1 = color1 & 0xFF

    const r2 = (color2 >> 16) & 0xFF
    const g2 = (color2 >> 8) & 0xFF
    const b2 = color2 & 0xFF

    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)

    return (r << 16) | (g << 8) | b
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

    // Clean up sky sprite
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    // Clean up boat
    if (this.boat) {
      this.boat.destroy()
      this.boat = null
    }

    // Clear actor reference
    this.mia = null

    super.shutdown()
    console.log('[Mia] Scene shutdown')
  }
}

export default MiaState
