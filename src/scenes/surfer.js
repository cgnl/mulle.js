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
 * Mission Logic (from original Lingo ParentScript 4):
 * - Mission 9: Deliver rotten fish
 * - Medal 3: Awarded for carrying heavy fish (weight >= 35kg)
 * 
 * Flow:
 * 1. Random fish weight: 10, 15, 25, 35, or 40 kg
 * 2. Check if player already has #RottenFish in inventory -> "notDelivered" path
 * 3. Check if boat capacity >= fishWeight -> Can take fish
 * 4. If fishWeight >= 35 -> Award Medal 3
 * 5. Complete Mission 9, give #RottenFish item
 * 6. If can't carry -> "cantDoIt" dialogue
 * 
 * Dialogue markers from original Lingo:
 * - "notDelivered": Already has rotten fish
 * - "JustDoIt1/2": Can take fish (random suffix)
 * - "JustDoItmedal1/2": Can take heavy fish + medal
 * - "cantDoIt1/2": Boat can't carry the fish
 * 
 * Asset mapping from boten_81.DXR:
 * - Member 10: 81b004v0 - Main beach background
 * - Member 30: 81b002v0 - Beach overlay/element
 * - Member 31: 81b003v0 - Water/wave element
 * - Members 22-29: Sur animation frames (81a001v0, 02, 03, 04, 05, 06)
 * - Members 36: 01 - Surfboard frame 1
 * - Members 37-41: 81b005v1-v5 - Surfboard animation frames (fish can display)
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
import { computeHarborResult, WEIGHT_LIST, CAN_LIST, MISSION_ID, MEDAL_ID } from './HarborData'

// Lingo parity: BehaviorScripts / ParentScript 4 (81/81)
// Transition: "leave" — BehaviorScript 2/6 exit markers
// Global: drawBoat — Dir.ls draws boat at beach position
const SURFER_LEAVE_TRANSITION = 'leave'
const SURFER_DRAW_BOAT_FN = 'drawBoat'

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

    // === SKY ===
    // Original Lingo: setSky(the weather of gMulleGlobals)
    // Sky sprites: 00b011v0 (sunny), 00b012v0 (cloudy), etc.
    this.setSky()

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

    // === MISSION 9 LOGIC ===
    // Initialize fish weight and mission state (from original Lingo)
    // Must be called AFTER surfboard is created so updateFishDisplay() works
    this.initMissionLogic()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Use mission-based dialogue from initMissionLogic
    this.game.time.events.add(500, () => {
      this.playMissionDialogue()
    })

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
      this.sur.animations.stop()
      this.sur.animations.play('idle')
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Surfer] Dialogue audio not found:', dialogueId)
      // Simulate dialogue duration
      this.game.time.events.add(2000, () => {
        this.sur.animations.stop()
        this.sur.animations.play('idle')
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

  // ==========================================================================
  // MISSION 9 LOGIC - Rotten Fish Delivery
  // Based on original Lingo: ParentScript 4 - Dir.ls
  // ==========================================================================

  /**
   * Initialize mission logic
   * Original Lingo: on new me / on startMovie me
   * 
   * Fish weights: [10, 15, 25, 35, 40] kg
   * Medal 3 awarded for fish >= 35kg
   */
  initMissionLogic () {
    const user = this.game.mulle.user

    // Random fish weight from WEIGHT_LIST (original Lingo: set weightList to [10, 15, 25, 35, 40])
    const randomIndex = Math.floor(Math.random() * WEIGHT_LIST.length)
    this.rottenFishWeight = WEIGHT_LIST[randomIndex]

    // Get boat's AVAILABLE load capacity (original Lingo: getCurrentLoadCapacity)
    // Original Lingo line 36: if tmpCapacity >= rottenFishWeight then
    // getCurrentLoadCapacity returns remaining space after accounting for current load
    // Formula: availableCapacity = totalLoadCapacity - currentLoad (sum of part weights)
    user.Boat.updateStats()
    const totalLoadCapacity = user.Boat.getProperty('loadcapacity', 0)
    const currentLoad = user.Boat.getProperty('weight', 0)
    const availableCapacity = totalLoadCapacity - currentLoad

    console.log('[Surfer] Mission', MISSION_ID, '- Fish weight:', this.rottenFishWeight, 'kg, Total capacity:', totalLoadCapacity, 'kg, Current load:', currentLoad, 'kg, Available capacity:', availableCapacity, 'kg')

    // Random suffix (1 or 2) for dialogue marker variants
    const suffix = Math.random() < 0.5 ? 1 : 2

    // Use HarborData pure function to compute result
    const result = computeHarborResult({
      hasRottenFish: user.isInInventory('#RottenFish'),
      loadCapacity: availableCapacity,
      rottenFishWeight: this.rottenFishWeight,
      suffix
    })

    this.missionMarker = result.marker
    this.missionActions = result.actions

    // Award medal immediately if earned (original Lingo awards it in startMovie)
    if (result.actions.awardMedal3) {
      user.addMedal(MEDAL_ID)
      console.log('[Surfer] Medal', MEDAL_ID, 'awarded (heavy fish)')
    }

    // NOTE: Mission completion and inventory update are deferred to AFTER dialogue plays
    // (handled in playMissionDialogue() callback using this.missionActions)

    console.log('[Surfer] Mission state:', this.missionMarker)

    // Update surfboard/fish display based on weight
    // Original Lingo: set the member of sprite 73 to getAt(canList, tmpRnd)
    // The canList maps to surfboard frames 81b005v1-v5 (members 37-41)
    this.updateFishDisplay(randomIndex)
  }

  /**
   * Update the fish/can display on the surfboard based on weight
   * Original Lingo: set the member of sprite 73 to getAt(canList, tmpRnd)
   * canList = ["81b005v1", "81b005v2", "81b005v3", "81b005v4", "81b005v5"]
   */
  updateFishDisplay (weightIndex) {
    // Members 37-41 correspond to the fish can sizes (81b005v1-v5)
    // weightIndex 0-4 maps to members 37-41
    if (this.surfboard) {
      const memberIndex = 37 + weightIndex
      this.surfboard.setDirectorMember(this.DirResource, memberIndex)
      console.log('[Surfer] Fish display updated to member', memberIndex)
    }
  }

  /**
   * Play the appropriate mission dialogue based on mission state
   * Maps missionMarker to dialogue clips
   */
   playMissionDialogue () {
    // Map mission markers to dialogue clips
    // Based on original Lingo frame labels and dialogue members
    const dialogueMap = {
      'notDelivered': '81d003v0',      // Already has fish, need to deliver
      'JustDoIt1': '81d004v0',         // Can take fish (variant 1)
      'JustDoIt2': '81d005v0',         // Can take fish (variant 2)
      'JustDoItmedal1': '81d006v0',    // Heavy fish + medal (variant 1)
      'JustDoItmedal2': '81d007v0',    // Heavy fish + medal (variant 2)
      'cantDoIt1': '81d008v0',         // Can't carry (variant 1)
      'cantDoIt2': '81d009v0'          // Can't carry (variant 2)
    }

    const dialogueId = dialogueMap[this.missionMarker]
    
    if (dialogueId) {
      console.log('[Surfer] Playing mission dialogue:', this.missionMarker, '->', dialogueId)
      this.playDialogue(dialogueId, () => {
        // Apply mission actions AFTER dialogue plays (deferred from initMissionLogic)
        // Actions are computed by computeHarborResult from HarborData
        const user = this.game.mulle.user
        if (this.missionActions.completeMission9) {
          user.addCompletedMission(MISSION_ID)
          console.log('[Surfer] Mission', MISSION_ID, 'completed AFTER dialogue')
        }
        if (this.missionActions.giveRottenFish) {
          user.setInInventory('#RottenFish', {})
          console.log('[Surfer] RottenFish added to inventory')
        }
        this.surIdleMode()
      })
    } else {
      // Fallback to intro dialogue if marker not found
      if (!this.game.mulle.user.Boat.hasCache('#SurfBeachIntroPlayed')) {
        this.playDialogue('81d001v0', () => {
          this.game.mulle.user.Boat.addCache('#SurfBeachIntroPlayed')
          this.surIdleMode()
        })
      } else {
        this.playDialogue('81d002v0', () => {
          this.surIdleMode()
        })
      }
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
      this.game.world.sendToBack(this.skySprite)
      this.game.add.existing(this.skySprite)
      console.log('[Surfer] Sky sprite loaded:', skyMemberName, 'for weather type:', weatherType)
    } else {
      // Fallback: Create simple sky gradient
      console.log('[Surfer] Sky sprite not found, using fallback for weather type:', weatherType)
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

    // Draw gradient sky (top half only for beach scene)
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

    console.log('[Surfer] Fallback sky created for weather type:', weatherType)
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

    // Clean up sky sprite
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    // Clear actors
    this.sur = null
    this.surfboard = null

    super.shutdown()
    console.log('[Surfer] Scene shutdown')
  }
}

export default SurferState
