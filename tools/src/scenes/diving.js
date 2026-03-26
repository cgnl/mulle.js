/**
 * Diving scene (Underwater diving spot - Wrakbaai)
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
 * Mission Logic (from ParentScript 1 - Dir.ls):
 * - Mission 23: Completed on every visit
 * - Mission 12: Requires both #helmet AND #Suit items
 * - Medal 5: "Duik-medaille" for successful diving
 * - Part 979: Reward for diving (or random part if already owned)
 * 
 * Flow:
 * 1. Always complete mission 23
 * 2. Check for diving equipment:
 *    - If has #helmet AND #Suit: complete mission 12, award Medal 5, give part 979
 *    - If missing equipment: "cantDoit" dialogue
 * 3. First 2 visits (mission 23 count < 2): show "start" intro dialogue
 * 
 * Diver Animations (from original Lingo animation chart):
 * Frame-to-member mapping: Frame 1 = Member 27, Frame N (N>=2) = Member (28+N)
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
import MulleBuildBoat from '../objects/buildboat'

const { computeVickyIslandResult, MISSION_23, MISSION_12, PART_979, MEDAL_5 } = require('./VickyIslandData')

// Lingo parity: ParentScript 1 - Dir.ls (87/87)
// State: externalParts — used to determine random reward parts
const DIVING_EXTERNAL_PARTS_STATE = 'externalParts'

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

    // === SKY SPRITE (Channel 1) ===
    // Original Lingo: set spriteList to [#BoatStart: 5, #Sky: 1]
    // setSky(the weather of gMulleGlobals)
    this.setSky()

    // === UNDERWATER BACKGROUND ===
    // 87b001v0 (member 5) = Main underwater background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 5)
    this.game.add.existing(background)

    // === PLAYER'S BOAT (Channel 5) ===
    // Original Lingo: drawBoat(point(355, 150), VOID, VOID, 0)
    this.boat = new MulleBuildBoat(this.game, 355, 150, this.game.mulle.user.Boat.Parts, true, false)
    this.game.add.existing(this.boat)

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
    // Dialogue is now handled by processMissionLogic() based on mission 23 count
    // First 2 visits: "start" intro (87d001v0)
    // Later visits: go directly to mission marker dialogue (JustDoit/cantDoit)

    // Play underwater ambient sounds
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    // All dialogue clips from boten_87.DXR
    this.dialogueSequence = [
      '87d004v0', '87d005v0', '87d006v0', '87d007v0', '87d008v0'
    ]

    // === MISSION LOGIC ===
    // Process mission logic based on original Lingo (ParentScript 1 - Dir.ls)
    this.processMissionLogic()

    console.log('[Diving] Scene created - Underwater diving spot')
  }

  /**
   * Process mission logic for this scene.
   * Delegates to the pure-function computeVickyIslandResult() and then
   * applies side-effects (mission completion, inventory, medal) based on
   * the returned action flags.
   *
   * Based on original Lingo from ParentScript 1 - Dir.ls:
   * - Mission 23: Always completed on visit
   * - Mission 12: Requires #helmet AND #Suit
   * - Medal 5: "Duik-medaille" for successful diving
   * - Part 979: Reward (or random if already owned)
   */
  processMissionLogic () {
    const user = this.game.mulle.user

    // --- gather state ---
    const hasHelmet = user.isInInventory('#helmet') || user.isInInventory('helmet')
    const hasSuit = user.isInInventory('#Suit') || user.isInInventory('Suit')
    const hasPart979 = !!user.hasBoatPart(PART_979)
    const randomPart = user.getRandomRewardPart() || null
    const completionCount23 = user.getCompletedMissionInfo(MISSION_23, 'count') || 0

    // --- pure computation (VickyIslandData) ---
    const result = computeVickyIslandResult({
      hasHelmet,
      hasSuit,
      hasPart979,
      randomPart,
      completionCount23
    })

    // Store full result for debugging / other methods
    this.vickyIslandResult = result
    console.log('[Diving] computeVickyIslandResult:', JSON.stringify(result))

    // --- apply side-effects based on action flags ---

    // M23 is always completed
    if (result.actions.completeMission23) {
      user.addCompletedMission(MISSION_23)
      console.log('[Diving] Mission', MISSION_23, 'completed')
    }

    // M12 completed on successful dive (helmet + suit)
    if (result.actions.completeMission12) {
      user.addCompletedMission(MISSION_12)
      console.log('[Diving] Mission', MISSION_12, 'completed - has diving equipment')
    }

    // Award Medal 5 - "Duik-medaille"
    if (result.actions.awardMedal5) {
      user.addMedal(MEDAL_5)
      console.log('[Diving] Medal', MEDAL_5, '(Duik-medaille) awarded!')
      this.showMedalNotification('Duik-medaille')
    }

    // Give part (979 or random)
    if (result.actions.givePart != null) {
      user.addNewPart(result.actions.givePart)
      this.rewardPart = result.actions.givePart
      console.log('[Diving] Reward part given:', result.actions.givePart)
    }

    // Set marker from result
    this.missionMarker = result.marker

    // --- dialogue routing based on goTo ---
    if (result.goTo !== 'start') {
      // Not first visit - go directly to appropriate marker dialogue
      this.playMarkerDialogue()
    } else {
      // First visit - play "start" intro dialogue first, then marker dialogue
      this.game.time.events.add(500, () => {
        this.playDialogue('87d001v0', () => {
          // After intro, play the marker dialogue
          this.playMarkerDialogue()
        })
      })
    }
  }

  /**
   * Play dialogue based on mission marker
   */
  playMarkerDialogue () {
    if (this.missionMarker === 'JustDoit') {
      // Success dialogue - player can dive
      // Play diving success dialogue after a short delay
      this.game.time.events.add(800, () => {
        this.playDialogue('87d002v0', () => {
          this.diverIdleMode()
        })
      })
    } else if (this.missionMarker === 'cantDoit') {
      // Can't dive - missing equipment dialogue
      this.game.time.events.add(800, () => {
        this.playDialogue('87d003v0', () => {
          this.diverIdleMode()
        })
      })
    }
  }

  /**
   * Convert animation frame number to member ID
   * Based on 87.DXR internal structure:
   * - Frame 1 → Member 27
   * - Frame 2 → Member 30
   * - Frame N (where N >= 2) → Member (28 + N)
   * @param {number} frame - Animation frame number (1-60)
   * @returns {number} Member ID
   */
  frameToMember (frame) {
    if (frame === 1) return 27
    return 28 + frame // Frame 2 = 30, Frame 3 = 31, etc.
  }

  /**
   * Setup diver animations
   * Based on animation chart from boten_87.DXR
   * Frame-to-member mapping verified against original Director files:
   * - Member 27 = Frame "01"
   * - Member 30 = Frame "02"
   * - Member 31 = Frame "03"
   * - etc. (Member = 28 + Frame for frames >= 2)
   */
  setupDiverAnimations () {
    var b = this.DirResource

    // Helper to create frame array
    const toFrames = (frameNumbers) => {
      return frameNumbers.map(f => [b, this.frameToMember(f)])
    }

    // Idle/Still animation (frame 1)
    // Original: #Still:[1]
    var idleFrames = toFrames([1])
    this.diver.addAnimation('idle', idleFrames, 5, true)

    // Walk1 animation - diver swimming/walking cycle
    // Original: #walk1:[56,57,58,59,60,1,1,1,1,55,55,55,55,55,55,55,1,1,1,1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17]
    var walk1Frames = toFrames([56, 57, 58, 59, 60, 1, 1, 1, 1, 55, 55, 55, 55, 55, 55, 55, 1, 1, 1, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17])
    this.diver.addAnimation('walk1', walk1Frames, 10, false)

    // Walk2 animation
    // Original: #walk2:[18,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,34,35,36,37]
    var walk2Frames = toFrames([18, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 34, 35, 36, 37])
    this.diver.addAnimation('walk2', walk2Frames, 10, false)

    // Peek2 animation (diver peeking around)
    // Original: #peek2:[38,39,38,38,38,38,38,38,39,38,39,38,39,38,39,39,39,39,39,39,39]
    var peekFrames = toFrames([38, 39, 38, 38, 38, 38, 38, 38, 39, 38, 39, 38, 39, 38, 39, 39, 39, 39, 39, 39, 39])
    this.diver.addAnimation('peek', peekFrames, 8, false)

    // Walk3 animation (deeper swimming)
    // Original: #walk3:[39,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54]
    var walk3Frames = toFrames([39, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54])
    this.diver.addAnimation('walk3', walk3Frames, 10, false)

    // Peek1 animation
    // Original: #peek1:[17]
    var peek1Frames = toFrames([17])
    this.diver.addAnimation('peek1', peek1Frames, 8, false)

    // Talk animation (use walk frames with varied frames for lip sync effect)
    var talkFrames = toFrames([1, 2, 3, 4, 3, 2, 1, 2, 3, 4])
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

    // Mark as visited in cache
    if (!this.game.mulle.user.Boat.hasCache('#DivingVisited')) {
      this.game.mulle.user.Boat.addCache('#DivingVisited')
    }

    // Note: Medal 5 (Duik-medaille) is now awarded in processMissionLogic()
    // when player has diving equipment (#helmet AND #Suit)

    this.game.state.start('seaworld')
  }

  /**
   * Show medal notification
   * @param {string} medalName - Name of the awarded medal
   * @param {function} onComplete - Callback when done
   */
  showMedalNotification (medalName, onComplete) {
    const medalText = this.game.add.text(320, 200, 'Medaille verdiend!\n' + medalName, {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#8b6914',
      strokeThickness: 3,
      align: 'center'
    })
    medalText.anchor.setTo(0.5, 0.5)

    // Animate
    this.game.add.tween(medalText.scale)
      .to({ x: 1.3, y: 1.3 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    // Fade out and call callback
    this.game.time.events.add(2500, () => {
      this.game.add.tween(medalText)
        .to({ alpha: 0 }, 500, null, true)
        .onComplete.add(() => {
          medalText.destroy()
          if (onComplete) onComplete()
        })
    })
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
   */
  setSky () {
    const weatherType = this.getWeatherType()

    this.skySprite = new MulleSprite(this.game, 320, 240)

    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`

    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)

    if (!loaded) {
      loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
    }

    if (loaded) {
      this.game.world.sendToBack(this.skySprite)
      this.game.add.existing(this.skySprite)
      console.log('[Diving] Sky sprite loaded:', skyMemberName)
    } else {
      console.log('[Diving] Sky sprite not found, using fallback')
      this.skySprite.destroy()
      this.skySprite = null
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Create a fallback sky using Phaser graphics
   */
  createFallbackSky (weatherType) {
    const skyColors = {
      1: { top: 0x87CEEB, bottom: 0xB0E0E6 },
      2: { top: 0x6B8BA4, bottom: 0x9DB8C8 },
      3: { top: 0x5A6973, bottom: 0x8899A6 },
      4: { top: 0x3D4852, bottom: 0x5C6B7A }
    }

    const colors = skyColors[weatherType] || skyColors[1]
    this.skyGraphics = this.game.add.graphics(0, 0)

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

    this.game.world.sendToBack(this.skyGraphics)
  }

  /**
   * Interpolate between two colors
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

    // Clear sky
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    // Clear boat
    if (this.boat) {
      this.boat.destroy()
      this.boat = null
    }

    // Clear actors
    this.diver = null

    super.shutdown()
    console.log('[Diving] Scene shutdown')
  }
}

export default DivingState
