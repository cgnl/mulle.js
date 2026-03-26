/**
 * BoatyardState - The boat building workshop (Quay/Scheepswerf)
 * 
 * Equivalent of GarageState/YardState but for boats
 * NPC: Mulle (same character as car game, NOT "Christina Colombus")
 * 
 * Scene 04.DXR from boten ISO
 * Original Lingo: ParentScript 22 - Dir.ls
 * 
 * Delivery System (from original Lingo):
 * - Doris delivers blueprints/parts via radio at boats 2, 4, 8, 12, 16...
 * - Formula: (NrOfBuiltBoats == 2) OR (NrOfBuiltBoats mod 4 == 0)
 * - deliveryMade flag prevents duplicate deliveries
 * 
 * ==============================================================================
 * BUG FIXES - ALL 22 BOATYARD SCENE BUGS FIXED
 * ==============================================================================
 * 
 * MAJOR BUGS (8 High Priority):
 * #1  ✓ Loop counter timing 60x too slow - Changed from 1 Hz to 60 FPS (16.67ms)
 * #2  ✓ Radio report first speaker logic wrong - Fixed Mulle vs Radio speaker selection
 * #3  ✓ Animation chart switching not implemented - Implemented setAnimChart() calls
 * #4  ✓ Mulle NormalTalk animation logic - Matched original buggy behavior
 * #5  ✓ Radio BigRadio mode incomplete - Implemented animation chart switching
 * #6  ✓ Buffa sleep animation continuation - Added Stopped handler restart logic
 * #7  ✓ Windmeter click bypasses loop system - Set flag instead of direct call
 * #8  ✓ GoPee animation frame reset - Fixed member location to after tween
 * 
 * MEDIUM PRIORITY (4 bugs):
 * #9  ✓ processBoatyardLoop conditions - Already correctly implemented
 * #10 ✓ First-time dialogue random selection - Fixed 1-based Lingo random() conversion
 * #11 ✓ Delivery index calculation - Integer division now explicit with Math.floor
 * #12 ✓ Weather report sound selection - Added sound validation before playback
 * 
 * LOW PRIORITY (10 bugs):
 * #13 ✓ OKToTalk state management - Ensured reset on error paths
 * #14 ✓ RadioCount reset timing - Resets with loopCounter after all dialogues
 * #15 ✓ LoopCounter random range - Fixed to 360+random(720) for general dialogues
 * #16 ✓ Mulle PrioTalk mode check - Correctly allows both Wait and Talk modes
 * #17 ✓ Buffa random timing - Fixed to 1/100 per frame at 60 FPS (was 6x too slow)
 * #18 ✓ Figge animation sound handling - Improved OPEFFECT vs EFFECT logic
 * #19 ✓ DialogClosed flag - Already correctly managed (set to 1 at init)
 * #20 ✓ MakeDelivery flag - Now resets OKToTalk on error paths
 * #21 ✓ WindReport flag - Cleared immediately, lost if Mulle busy (original behavior)
 * #22 ✓ Sky sprite z-order - Fixed ordering: stageBackground < sky < background
 * 
 * All fixes match original Lingo behavior from:
 * - ParentScript 22 - Dir.ls (main scene loop)
 * - BehaviorScript 31 - MulleQuayBH.ls (Mulle NPC behavior)
 * - BehaviorScript 87 - BuffaQuayBH.ls (Buffa dog behavior)
 * 
 * ==============================================================================
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleActor from '../objects/actor'
import MulleBuildBoat from '../objects/buildboat'
import MulleBoatPart from '../objects/boatpart'
import SubtitleLoader from '../objects/SubtitleLoader'
import LingoSceneRuntime from '../objects/LingoSceneRuntime'
import boatyardSpec from '../lingo/scenes/boatyard_04'
const QuayData = require('./QuayData')

// Quay floor drop zone (Lingo: rect(4,475,544,476))
// Expand to full floor area so parts dropped anywhere on the quay floor stay put
const QUAY_DROP_RECTS = [new Phaser.Rectangle(4, 380, 540, 100)]


/**
 * BoatyardState - Build boats at Mulle's shipyard (Quay)
 * @extends MulleState
 */
// Lingo parity: ParentScript 22 - Dir.ls (04/04)
// State: loopMaster — controls the main idle/dialogue loop counter
const BOATYARD_LOOP_MASTER_STATE = 'loopMaster'

class BoatyardState extends MulleState {
  preload () {
    // Scene 04.DXR in boten is the shipyard (equivalent to yard/garage)
    this.DirResource = '04.DXR'
    this.assetPrefix = 'boten/'
    
    // Lazy load boat assets (prevents sprite conflicts with car game)
    this.game.mulle.loadBoatAssets(this.game.load)
    
    super.preload()
    
    // Subtitles for boat scenes
    this.subtitles = new SubtitleLoader(this.game, 'boatyard', ['dutch', 'english'])
    this.subtitles.preload()
  }

  create () {
    super.create()
    
    // Register boat audio after assets are loaded
    this.game.mulle.registerBoatAudio()
    
    this.subtitles.load()

    // Container for junk parts
    this.junkParts = this.game.add.group()
    
    // Track initial boat state for change detection
    this.enterParts = [...(this.game.mulle.user.Boat?.Parts || [])]

    // === ITEM #70: Mission system at scene init ===
    // Original Lingo (Dir.ls lines 33-42):
    // setInInventory(#Belly, [#nr: 1000])
    // if isMissionCompleted(20) then addGivenMission(1)
    // if isMissionCompleted(2) then addGivenMission(2)
    // if isMissionCompleted(13) then addGivenMission(13)
    this.initMissionSystem()

    // === ITEM #73: Belly inventory init (1000) ===
    // Original Lingo (Dir.ls line 33): setInInventory(user, #Belly, [#nr: 1000])
    this.initBellyInventory()

    // === ITEM #92: Sound preloading ===
    // Original Lingo (Dir.ls lines 43-47): safePreload for scene sounds
    this.preloadSceneSounds()

    // === BACKGROUND ===
    this.createBackground()

    // === ITEM #90: Water sprite - MUST be added BEFORE boat for correct z-order ===
    // Original Lingo: #Water: 63 in spriteList (behind boat/hull)
    // Water sits behind the boat on the slipway, not in front
    this.createWaterSprite()

    // === BOAT BUILD AREA ===
    this.createBoatBuildArea()

    // === NAVIGATION ===
    this.createNavigation()

    // === MULLE NPC ===
    this.createMulleActor()

    // === BUFFA DOG ===
    // Original Lingo: #Buffa: 5 in spriteList, BuffaQuayBH behavior
    this.createBuffaDog()

    // === FIGGE'S BOAT ===
    // Original Lingo: #Figge: 3 in spriteList, FiggeBH behavior
    this.createFigge()

    // === ITEM #77: ToolBox sprite ===
    // Original Lingo: #ToolBox: 67 in spriteList
    this.createToolBoxSprite()

    // === FOREGROUND OVERLAY (member 2, channel 64) ===
    // This is the dock/quay ground that overlaps the bottom of the boat
    // Must be added AFTER the boat so it renders ON TOP
    this.createForegroundOverlay()

    // === RADIO (includes BigRadio #72) ===
    // Original Lingo: #Radio: 8, #BigRadio: 109, RadioBH behavior
    this.createRadio()

    // Lingo parity: Quay has floor junk area; shelves are in Yard/Shelf1-6.

    // === LOAD JUNK PARTS ===
    // Bring junkParts group to top so parts render above the foreground overlay
    this.game.world.bringToTop(this.junkParts)
    this.loadJunkParts()

    // === FIRST VISIT / INTRO DIALOGUE ===
    this.handleFirstVisit()

    this.checkPeggyQuest()

    // === WEATHER-BASED BACKGROUND SOUNDS ===
    // Original Lingo: Dir.ls lines 65-79
    this.playWeatherAmbience()

    // === ITEM #94: dialogClosed flag management ===
    // Original Lingo (Dir.ls line 5): set dialogClosed to 1
    this.dialogClosed = true

    // Initialize loop counter for random dialogue timing
    // Original Lingo (Dir.ls line 19): set loopCounter to random(360)
    this.loopCounter = Math.floor(Math.random() * 360)

    // Initialize first-time dialogue list
    // Original Lingo (Dir.ls line 14): set firstDialogList to [...]
    this.firstDialogList = [...QuayData.FIRST_DIALOG_LIST]
    this.FirstTime = false  // Will be set in handleFirstVisit if needed

    // === ITEM #75: Radio handler registration ===
    // Original Lingo (Dir.ls line 85): startreportRadioToMe(radioHandler, me)
    this.registerRadioHandler()

    console.debug('[Boatyard] Scene created with', Object.keys(this.game.mulle.BoatPartsDB || {}).length, 'boat parts in database')

    // === CHEATS SECTION ===
    this.setupCheats()

    // Flag to ensure weather sprites on first update
    this.weatherSpritesInitialized = false
  }

  /**
   * Enter frame hook - called every frame from base.update()
   * Used to initialize weather sprites and timers after all loading is complete
   */
  enterFrame () {
    // Initialize weather sprites and timers on first frame only
    // This ensures WebGL context and all assets are fully loaded
    if (!this.weatherSpritesInitialized) {
      if (this.game.mulle.weather && this.game.world && this.game.add) {
        // CRITICAL: Don't create sprites if loader is still active
        // This happens during jsonLoadComplete callbacks
        if (this.game.load && this.game.load.isLoading) {
           console.debug('[Boatyard] Waiting for loader to finish before initializing')
          return
        }
        
        // Initialize weather sprites
        this.game.mulle.weather.ensureSpritesInWorld()
        console.debug('[Boatyard] Weather sprites initialized on first frame')
        
        this.weatherSpritesInitialized = true
      }
    }
  }

  /**
   * ITEM #70: Initialize mission system at scene init
   * Original Lingo (Dir.ls lines 34-42):
   * - if isMissionCompleted(20) then addGivenMission(1)
   * - if isMissionCompleted(2) then addGivenMission(2)
   * - if isMissionCompleted(13) then addGivenMission(13)
   */
  initMissionSystem () {
    const user = this.game.mulle.user
    
    // Gather state
    const result = QuayData.computeMissionInit({
      m20: !!(user.isMissionCompleted && user.isMissionCompleted(20)),
      m2: !!(user.isMissionCompleted && user.isMissionCompleted(2)),
      m13: !!(user.isMissionCompleted && user.isMissionCompleted(13))
    })
    
    // Apply: set Belly inventory
    if (!user.SeaInventory) user.SeaInventory = { items: {} }
    if (!user.SeaInventory.items) user.SeaInventory.items = {}
    user.SeaInventory.items.Belly = { nr: result.setBelly }
    
    // Apply: give missions
    for (const m of result.giveMissions) {
      if (user.addGivenMission) {
        user.addGivenMission(m)
        console.debug('[Boatyard] Mission', m, 'given via QuayData')
      }
    }
    
    console.debug('[Boatyard] Belly inventory initialized to', result.setBelly)
  }

  /**
   * ITEM #73: Initialize Belly inventory to 1000 (hunger system)
   * Original Lingo (Dir.ls line 33): setInInventory(the user, #Belly, [#nr: 1000])
   */
  initBellyInventory () {
    // Merged into initMissionSystem() via QuayData.computeMissionInit
  }

  /**
   * ITEM #92: Preload scene-specific sounds
   * Original Lingo (Dir.ls lines 43-47):
   * safePreload("04e005v0"), safePreload("04e006v0"), etc.
   */
  preloadSceneSounds () {
    const soundsToPreload = [
      '04e005v0',  // Pole/sail sound
      '04e006v0',  // Scene sound
      '04e999v0',  // Scene sound
      '04e1000v0', // Boat hover sound
      '00e110v0'   // GoPee sound
    ]
    
    // BUG FIX #8: Actually preload sounds, not just check if they exist
    soundsToPreload.forEach(sound => {
      try {
        // Try to play and immediately stop to ensure sound is loaded
        const preloadSound = this.game.mulle.playAudio(sound)
        if (preloadSound) {
          preloadSound.volume = 0
          preloadSound.stop()
        }
      } catch (e) {
        console.warn('[Boatyard] Could not preload sound:', sound)
      }
    })
    
    console.debug('[Boatyard] Preloaded', soundsToPreload.length, 'scene sounds')
  }

  /**
   * ITEM #90: Create Water sprite
   * Original Lingo: #Water: 63 in spriteList
   * Used to show/hide water visibility when interacting with hull interior
   */
  createWaterSprite () {
    // Water sprite at bottom of scene (member "04b003v0" or "Dummy")
    // Position estimated from sprite channel 63
    const waterY = 440
    
    try {
      this.waterSprite = new MulleSprite(this.game, 320, waterY)
      // Try to set water member (04b003v0)
      if (this.waterSprite.setDirectorMember('boten_04.DXR', '04b003v0')) {
        this.game.add.existing(this.waterSprite)
        console.debug('[Boatyard] Water sprite created')
      } else {
        this.waterSprite.destroy()
        this.waterSprite = null
      }
    } catch (e) {
      console.warn('[Boatyard] Could not create water sprite:', e)
      this.waterSprite = null
    }
  }

  /**
   * ITEM #77: Create ToolBox sprite
   * Original Lingo: #ToolBox: 67 in spriteList
   * Visual element showing tools/equipment on the quay
   */
   createToolBoxSprite () {
    this.toolBoxSprite = null
    console.debug('[Boatyard] ToolBox sprite: part of background (no separate sprite)')
  }

  /**
   * Create the foreground overlay (member 2, 04b002v0, 640x172)
   * Original Lingo: sprite channel 64 in spriteList
   * This is the dock/quay ground that overlaps the bottom of the scene,
   * rendering ON TOP of the boat to give the illusion the boat sits behind the dock.
   */
  createForegroundOverlay () {
    try {
      this.foregroundOverlay = new MulleSprite(this.game, 320, 240)
      if (this.foregroundOverlay.setDirectorMember('boten_04.DXR', 2)) {
        this.game.add.existing(this.foregroundOverlay)
        // Connect foreground overlay to boat so hull click can toggle it
        if (this.boat) {
          this.boat.setForegroundOverlay(this.foregroundOverlay)
        }
        console.debug('[Boatyard] Foreground overlay created')
      } else {
        this.foregroundOverlay.destroy()
        this.foregroundOverlay = null
        console.warn('[Boatyard] Foreground overlay not found')
      }
    } catch (e) {
      console.warn('[Boatyard] Could not create foreground overlay:', e)
      this.foregroundOverlay = null
    }
  }

  /**
   * ITEM #75: Register radio handler for weather reports
   * Original Lingo (Dir.ls line 85): startreportRadioToMe(the radioHandler, me)
   * Also line 94: stopReportRadioToMe(the radioHandler, me) on kill
   */
  registerRadioHandler () {
    // Register this scene to receive radio reports from weather system
    // RadioHandler lives on gMulleGlobals, not directly on game.mulle
    const radioHandler = this.game.mulle.gMulleGlobals?.radioHandler
    if (radioHandler) {
      radioHandler.startReportRadioToMe(this)
      console.debug('[Boatyard] Registered for radio reports')
    } else {
      console.warn('[Boatyard] No radioHandler available')
    }
  }

  /**
   * ITEM #74: Weather report handler
   * Original Lingo (Dir.ls lines 111-116):
   * on weatherReport me, argWeather
   *   if getaProp(argWeather, #TimeLeft) = 0 then
   *     setSky(the weather)
   *     setWindMeter(me, getaProp(argWeather, #speed))
   */
  weatherReport (argWeather) {
    if (!argWeather) return
    
    // TimeLeft = 0 means weather is changing now
    const timeLeft = argWeather.TimeLeft || argWeather.timeLeft || 0
    
    if (timeLeft === 0) {
      console.debug('[Boatyard] Weather report - changing to:', argWeather)
      
      // Update sky based on new weather
      this.setSky()
      
      // Update windmeter animation
      const windSpeed = argWeather.speed || this.getWindSpeed()
      this.updateWindmeterAnimation()
      
      console.debug('[Boatyard] Weather updated - speed:', windSpeed)
    }
  }

  /**
   * Play ambient background sounds based on weather type
   * Original Lingo (Dir.ls lines 65-79):
   *   case getType(the weather of gMulleGlobals) of
   *     1: play(gSound, "00e108v0", #BG)  -- Calm, volume 200
   *     2: play(gSound, "00e109v0", #BG)  -- Windy, volume 200
   *     3: play(gSound, "00e104v0", #BG)  -- Rainy, volume 150
   *     4: play(gSound, "00e107v0", #BG)  -- Stormy, volume 150
   */
  playWeatherAmbience () {
    const weatherType = this.getWeatherType()
    const ambient = QuayData.getWeatherAmbient(weatherType)
    
    if (!ambient) {
      console.warn('[Boatyard] Unknown weather type:', weatherType)
      return
    }
    
    try {
      this.weatherSound = this.game.mulle.playAudio(ambient.sound)
      if (this.weatherSound) {
        this.weatherSound.loop = true
        this.weatherSound.volume = ambient.volume / 255
        console.debug('[Boatyard] Playing weather ambience:', ambient.sound, 'type:', weatherType)
      }
    } catch (e) {
      console.warn('[Boatyard] Could not play weather sound:', e)
    }
  }

  /**
   * Get weather type (1-4) from global weather state
   * Original Lingo: getType(the weather of gMulleGlobals)
   * 1 = Calm, 2 = Windy, 3 = Rainy, 4 = Stormy
   */
  getWeatherType () {
    // Get weather from MulleWeather object
    const weatherObj = this.game.mulle.weather
    
    // If weather object exists and has weatherType property, use it
    if (weatherObj && typeof weatherObj.weatherType === 'number') {
      return Math.max(1, Math.min(4, weatherObj.weatherType))
    }
    
    // Fallback: check if weather is stored as number in user data
    const weatherData = this.game.mulle.user?.weather || 
                        this.game.mulle.SeaMap?.weather
    
    if (typeof weatherData === 'number') {
      return Math.max(1, Math.min(4, weatherData))
    }
    
    // Map string weather to numeric type (fallback for old saves)
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
    
    // If weather is a string, map it
    if (typeof weatherData === 'string') {
      return weatherMap[weatherData.toLowerCase()] || 1
    }
    
    // Default to calm weather
    return 1
  }

  /**
   * Get current wind speed (0-3) based on weather
   * Original Lingo: getWindspeed(the weather of gMulleGlobals)
   */
  getWindSpeed () {
    // Map weather type to wind speed
    // Type 1 (calm) = speed 0-1
    // Type 2 (windy) = speed 2
    // Type 3 (rainy) = speed 1-2
    // Type 4 (stormy) = speed 3
    const weatherType = this.getWeatherType()
    
    switch (weatherType) {
      case 1: return this.game.rnd.integerInRange(0, 1)  // Calm: no wind or light
      case 2: return 2  // Windy: moderate
      case 3: return this.game.rnd.integerInRange(1, 2)  // Rainy: light to moderate
      case 4: return 3  // Stormy: strong
      default: return 0
    }
  }

  /**
   * Setup cheat buttons for development/testing
   */
  setupCheats () {
    if (!this.game.mulle.cheats) return
    
    const cheatsDiv = document.getElementById('cheats')
    if (!cheatsDiv) return
    
    cheatsDiv.innerHTML = ''
    
    // Force delivery button (trigger doDelivery)
    const b_delivery = document.createElement('button')
    b_delivery.innerHTML = 'Force Delivery'
    b_delivery.className = 'button'
    b_delivery.addEventListener('click', () => {
      this.game.mulle.user.deliveryMade = false
      this.game.mulle.user.NrOfBuiltBoats = 2 // Set to trigger delivery
      this.doDelivery()
    })
    cheatsDiv.appendChild(b_delivery)
    
    // Add some test parts button
    const b_addParts = document.createElement('button')
    b_addParts.innerHTML = 'Add Test Parts'
    b_addParts.className = 'button'
    b_addParts.addEventListener('click', () => {
      // Add some basic parts from delivery lists
      const testParts = [21, 22, 6, 7, 96]
      testParts.forEach((partId, i) => {
        if (!this.game.mulle.user.hasBoatPart(partId)) {
          const x = 80 + (i * 80)
          const y = 420
          this.game.mulle.user.addBoatPart('Quay', partId, new Phaser.Point(x, y), true)
          this.createJunkPart(partId, x, y)
        }
      })
      this.game.mulle.user.save()
    })
    cheatsDiv.appendChild(b_addParts)
    
    // Reset boat progress button
    const b_reset = document.createElement('button')
    b_reset.innerHTML = 'Reset Progress'
    b_reset.className = 'button'
    b_reset.addEventListener('click', () => {
      this.game.mulle.user.NrOfBuiltBoats = 0
      this.game.mulle.user.deliveryMade = false
      this.game.mulle.user.firstTimeList = {}
      this.game.mulle.user.save()
      console.debug('[Boatyard] Progress reset')
    })
    cheatsDiv.appendChild(b_reset)

    // === HOTKEYS ===

    // Hotkey W for world select (switch between car/boat worlds)
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      console.debug('[Boatyard] Hotkey W - going to world select')
      this.game.state.start('worldselect')
    })

    // Hotkey C for credits
    const cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C)
    cKey.onDown.add(() => {
      this.game.state.start('credits')
    })

  }

  /**
   * Create background
   */
  createBackground () {
    // BUG FIX #22: Sky sprite z-order - should be behind background
    // Original Lingo sprite channel order: #Sky: 1 (back), then background sprites on top
    // Z-order should be: stageBackground (furthest) -> sky -> background (front)
    
    // === STAGE BACKGROUND COLOR ===
    // Director stageColor is palette index 255, but since that's outside the 255-color palette,
    // it renders as the default stage color. In the original game this was typically white or
    // a color that blends with the sky. Using a light cyan that matches the sky/horizon area.
    // This fills any gaps where both sky sprite and boatyard background are transparent.
    this.stageBackground = this.game.add.graphics(0, 0)
    this.stageBackground.beginFill(0x99CCCC) // Light cyan matching sky/water horizon
    this.stageBackground.drawRect(0, 0, 640, 480)
    this.stageBackground.endFill()
    
    // === SKY SPRITE (Channel 1) ===
    // Original Lingo: spriteList includes #Sky: 1 (channel 1)
    // Sky is rendered on top of stage background but BEHIND the main background
    this.createSky()

    // Member 1 = 04b001v0 = main shipyard background (640x480)
    // The background has transparent sky area (palette index 255 and 0) so sky shows through
    const background = new MulleSprite(this.game, 320, 240)
    // Use boten_04.DXR (note: underscore, matching the asset pack dirFile)
    if (!background.setDirectorMember('boten_04.DXR', 1)) {
      console.warn('[Boatyard] Background sprite not found, using fallback')
      background.destroy()
      const fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x99CCCC)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }
    
    // BUG FIX #22: Ensure correct z-ordering (back to front): stageBackground -> sky -> background
    // Send background to back first (so it's above sky), then sky, then stageBackground
    // This ensures: stageBackground (bottom) < sky (middle) < background (top)
    this.game.world.sendToBack(background) // Background goes back
    if (this.skySprite) {
      this.game.world.sendToBack(this.skySprite) // Sky goes further back
    } else if (this.skyGraphics) {
      this.game.world.sendToBack(this.skyGraphics)
    }
    this.game.world.sendToBack(this.stageBackground) // Stage goes to very back
  }

  /**
   * Create the Sky sprite (channel 1) with weather-dependent visuals
   * 
   * Original Lingo (Weather.ls - setSky function):
   *   set tmpSP to getaProp(tmp, #Sky)
   *   set tmpSky to "00b0" & string(10 + weatherType) & "v0"
   *   set the member of sprite tmpSP to member tmpSky
   * 
   * Sky members based on weather type:
   * - Type 1 (calm):   00b011v0
   * - Type 2 (windy):  00b012v0
   * - Type 3 (rainy):  00b013v0
   * - Type 4 (stormy): 00b014v0
   */
  createSky () {
    const weatherType = this.getWeatherType()
    
    // Calculate sky member name: "00b0" + (10 + weatherType) + "v0"
    // Type 1 -> 00b011v0, Type 2 -> 00b012v0, etc.
    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`
    
    // Try boten_00.CXT first (boat game shared assets - 640px wide sky)
    this.skySprite = new MulleSprite(this.game, 320, 240)
    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)
    
    if (loaded) {
      this.game.add.existing(this.skySprite)
      // Ensure sky is at the very back of the display list
      this.game.world.sendToBack(this.skySprite)
      console.debug('[Boatyard] Sky sprite loaded:', skyMemberName)
    } else {
      // Note: Don't use 00.CXT (car game) - those sky sprites are only 320px wide
      // and positioned incorrectly for the boat game's 640px layout
      
      // Use gradient sky which covers the full 640px width
      console.debug('[Boatyard] Using gradient sky for weather type:', weatherType)
      this.skySprite.destroy()
      this.skySprite = null
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Create a fallback sky using Phaser graphics
   * Draws a gradient sky with weather-appropriate colors
   * 
   * @param {number} weatherType - 1=calm, 2=windy, 3=rainy, 4=stormy
   */
  createFallbackSky (weatherType) {
    // Sky color definitions based on weather
    // Each has [top color, bottom color] for gradient effect
    const skyColors = {
      1: { // Calm - Light blue, clear sky
        top: 0x87CEEB,    // Sky blue
        bottom: 0xB0E0E6, // Powder blue (horizon)
        name: 'Calm'
      },
      2: { // Windy - Gray-blue, some clouds
        top: 0x6B8BA4,    // Grayish blue
        bottom: 0x9FB3C4, // Light gray-blue
        name: 'Windy'
      },
      3: { // Rainy - Dark gray, overcast
        top: 0x4A5568,    // Dark gray
        bottom: 0x718096, // Medium gray
        name: 'Rainy'
      },
      4: { // Stormy - Very dark gray, threatening
        top: 0x2D3748,    // Very dark gray/charcoal
        bottom: 0x4A5568, // Dark gray
        name: 'Stormy'
      }
    }
    
    const colors = skyColors[weatherType] || skyColors[1]
    
    // Create sky graphics at back of display (z-order)
    this.skyGraphics = this.game.add.graphics(0, 0)
    
    // Draw vertical gradient by drawing multiple horizontal lines
    const skyHeight = 240 // Only top half of screen (sky portion)
    const steps = 60 // Number of gradient steps
    const stepHeight = skyHeight / steps
    
    for (let i = 0; i < steps; i++) {
      // Interpolate color between top and bottom
      const t = i / steps
      const color = this.interpolateColor(colors.top, colors.bottom, t)
      
      this.skyGraphics.beginFill(color)
      this.skyGraphics.drawRect(0, i * stepHeight, 640, stepHeight + 1)
      this.skyGraphics.endFill()
    }
    
    // Ensure sky graphics is at the very back of the display list
    this.game.world.sendToBack(this.skyGraphics)
    
    // Store reference for potential updates
    this.fallbackSkyWeatherType = weatherType
    
    console.debug('[Boatyard] Fallback sky created:', colors.name)
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
   * Update sky based on current weather
   * Called when weather changes during gameplay
   * 
   * Original Lingo: setSky(the weather of gMulleGlobals)
   */
  setSky () {
    const weatherType = this.getWeatherType()
    
    // BUG FIX #4.8: Sky sprite recreation bug - add null check before recreating
    // If sky sprite doesn't exist, create it first
    if (!this.skySprite && !this.skyGraphics) {
      this.createSky()
      return
    }
    
    // If using Director sprite, try to update it
    if (this.skySprite && this.skySprite.alive) {
      const skyMemberNum = 10 + weatherType
      const skyMemberName = `00b0${skyMemberNum}v0`
      
      let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)
      if (!loaded) {
        loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
      }
      
      if (loaded) {
        console.debug('[Boatyard] Sky updated to:', skyMemberName)
        return
      }
    }
    
    // If using fallback graphics, recreate with new weather
    if (this.skyGraphics && this.fallbackSkyWeatherType !== weatherType) {
      this.skyGraphics.destroy()
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Create the boat building area with MulleBuildBoat
   */
   createBoatBuildArea () {
    // Position where the boat is built - on the slipway (helling)
    // Original Director: boat sits on the wooden ramp in center of scene
    // Base position at center (320, 240) - regpoints handle visual offset
    // Then apply hull-type offset from BoatViewHandler.getDrawOffset('Quay')
    const baseX = 320
    const baseY = 240
    
    // Calculate hull-type draw offset (original Lingo: BoatViewHandler.getDrawOffset('Quay'))
    const offset = this.getBoatDrawOffset()
    const boatX = baseX + offset.x
    const boatY = baseY + offset.y

    // Create the buildable boat
    this.boat = new MulleBuildBoat(this.game, boatX, boatY, null, false, false)
    this.boat.junkParts = this.junkParts
    this.game.add.existing(this.boat)
    
    // Connect water sprite to boat for hull click inside view toggle
    if (this.waterSprite) {
      this.boat.setWaterSprite(this.waterSprite)
    }

    // Listen for attach/detach events
    this.boat.onAttach.add((partId) => {
      console.debug('[Boatyard] Part attached:', partId)
      // Remove attached part from Quay junk pile so it doesn't reappear on reload
      const quayJunk = this.game.mulle.user.BoatJunk?.Quay
      if (quayJunk && quayJunk[partId] !== undefined) {
        delete quayJunk[partId]
      }
      this.game.mulle.saveData()
      this.updateSeaworthyStatus()
    })

    this.boat.onDetach.add((partId, newId, pos) => {
      console.debug('[Boatyard] Part detached:', partId, '-> create part', newId)
      const junkPart = this.createJunkPart(newId, pos.x, pos.y)

      // Lingo parity: immediately start dragging the detached part
      // Original: BoatHandler.pickedUp creates DragScript that follows mouse
      if (junkPart && junkPart.input && this.game.input.activePointer) {
        junkPart.justDetached = true
        // Position at mouse cursor so drag feels natural
        junkPart.x = this.game.input.activePointer.x
        junkPart.y = this.game.input.activePointer.y
        junkPart.input.startDrag(this.game.input.activePointer)
      }

      this.game.mulle.saveData()
      this.updateSeaworthyStatus()
    })

    // Create status display
    this.createStatusDisplay(boatX, boatY + 120)
  }

  /**
   * Calculate boat draw offset based on hull type and load
   * Original Lingo: BoatViewHandler.getDrawOffset('Quay', partList)
   * 
   * Large hull:  {x: 0, y: 45 * (1 - loadRatio)}
   * Medium hull: {x: -25, y: 5 + 35 * (1 - loadRatio)}
   * Small hull:  {x: -55, y: 25 + 20 * (1 - loadRatio)}
   * 
   * loadRatio = currentLoadCapacity / totalLoadCapacity (how much capacity remains)
   * When empty (loadRatio=1): minimal y offset (boat rides high)
   * When full (loadRatio~0): max y offset (boat sits low / sinks into water)
   * 
   * @returns {{x: number, y: number}}
   */
  getBoatDrawOffset () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return { x: 0, y: 0 }
    
    // Get ship size from hull properties
    const shipSize = boat.getShipSize ? boat.getShipSize() : 'unknown'
    
    // Calculate load ratio (0 = overloaded, 1 = empty)
    const loadCapacity = boat.getProperty('loadcapacity', 0)
    const currentLoad = boat.getCurrentLoadCapacity ? boat.getCurrentLoadCapacity() : loadCapacity
    const loadRatio = loadCapacity > 0 ? Math.max(0, Math.min(1, currentLoad / loadCapacity)) : 1
    
    switch (shipSize) {
      case 'large':
        return { x: 0, y: Math.round(45 * (1 - loadRatio)) }
      case 'medium':
        return { x: -25, y: Math.round(5 + 35 * (1 - loadRatio)) }
      case 'small':
        return { x: -55, y: Math.round(25 + 20 * (1 - loadRatio)) }
      default:
        // Unknown hull type - use large hull defaults
        return { x: 0, y: 0 }
    }
  }

  /**
   * Create status display showing boat seaworthiness
   */
  createStatusDisplay (x, y) {
    this.statusText = this.game.add.text(x, y, '', {
      font: 'bold 12px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2,
      align: 'center'
    })
    this.statusText.anchor.setTo(0.5, 0)

    this.updateSeaworthyStatus()
  }

  /**
   * Update the seaworthy status display
   * ORIGINELE LINGO: Alleen check op aandrijving (engine/sailwithpole/oar)
   */
  updateSeaworthyStatus () {
    if (!this.statusText) return

    const boat = this.game.mulle.user.Boat
    if (!boat) {
      this.statusText.text = 'Geen boot'
      return
    }

    // ORIGINELE LINGO: Alleen propulsion check
    // if getProperty(tmpBoat, #engine) or getProperty(tmpBoat, #SailWithPole) or getProperty(tmpBoat, #Oar)
    const hasPropulsion = boat.getProperty('engine') > 0 || 
                          boat.getProperty('sailwithpole') > 0 || 
                          boat.getProperty('oar') > 0

    if (hasPropulsion) {
      this.statusText.text = 'Zeewaardig!'
      this.statusText.fill = '#00ff00'
    } else {
      this.statusText.text = 'Aandrijving nodig\n(motor/zeil/roeispanen)'
      this.statusText.fill = '#ff6666'
    }
    
  }

  /**
   * Create navigation elements - ALL click regions match original Lingo (scene 04 Quay)
   * Original Lingo mouseObject rects:
   * - rect(0, 0, 508, 155)      → #world / #GoForward (naar varen)
   * - rect(602, 97, 1640, 302)   → #Yard / #GoRight (naar yard)
   * - rect(4, 322, 56, 433)      → #Shipyard / #GoLeft (naar boten-opslag)
   * - rect(477, 331, 509, 379)   → #Pole (paal/boom voor varen)
   * - rect(554, 115, 592, 157)   → #PhotoBook (fotoboek)
   * - rect(550, 184, 587, 230)   → #Camera (camera)
   * - rect(479, 18, 536, 70)     → #Windmeter (windmeter)
   *
   * IMPORTANT: In Phaser, later added objects are drawn ON TOP of earlier ones.
   * So large areas must be added FIRST, then smaller specific buttons on top.
   */
  createNavigation () {
    // Highlight sprites for enter/leave actions
    this.poleSprite = new MulleSprite(this.game, 493, 355)
    this.poleSprite.setDirectorMember('Dummy')
    this.game.add.existing(this.poleSprite)

    this.photoBookSprite = new MulleSprite(this.game, 573, 136)
    this.photoBookSprite.setDirectorMember('Dummy')
    this.game.add.existing(this.photoBookSprite)

    this.cameraSprite = new MulleSprite(this.game, 569, 207)
    this.cameraSprite.setDirectorMember('Dummy')
    this.game.add.existing(this.cameraSprite)

    // Windmeter display sprite
    this.createWindmeter()

    // Lingo-lite mouseObjects
    this.lingoRuntime = new LingoSceneRuntime(this, boatyardSpec)
    this.lingoRuntime.registerSprite('Pole', this.poleSprite)
    this.lingoRuntime.registerSprite('PhotoBook', this.photoBookSprite)
    this.lingoRuntime.registerSprite('Camera', this.cameraSprite)
    this.lingoRuntime.build()
    this.lingoRuntime.startLoop()

    // Cache references for drop targets and interactions
    this.area_forward = this.lingoRuntime.getById(0)
    this.door_yard = this.lingoRuntime.getById(301)
    this.door_junk = this.lingoRuntime.getById(200)
    this.door_sail = this.lingoRuntime.getById(201)
    this.sailDoorEnabled = true

    // Disable direct windmeter input; runtime handles clicks
    if (this.windmeterSprite) {
      this.windmeterSprite.inputEnabled = false
    }

  }

  /**
   * Lingo runtime click handler
   * @param {object} obj Lingo mouseObject spec
   */
  onLingoClick (obj) {
    if (!obj) return

    if (obj.dragToWhere === 'world') {
      this.trySailing()
      return
    }

    if (obj.dragToWhere === 'Windmeter') {
      this.windReport = true
      return
    }

    if (obj.click && obj.click.frame === 'Yard') {
      this.game.mulle.whereFrom = 'boatyard'
      this.game.state.start('boat_yard')
      return
    }

    if (obj.click && obj.click.frame === 'Shipyard') {
      this.game.mulle.whereFrom = 'boatyard'
      if (!this.game.mulle.user.lastBoatShelf) {
        this.game.mulle.user.lastBoatShelf = 1
      }
      this.game.state.start('boat_junk')
      return
    }

    if (obj.click && obj.click.frame === 'PhotoBook') {
      this.game.mulle.whereFrom = 'boatyard'
      this.game.state.start('album', true, false, 'load')
      return
    }

    if (obj.click && obj.click.frame === 'Camera') {
      this.game.mulle.whereFrom = 'boatyard'
      this.game.state.start('album', true, false, 'save')
      return
    }

    if (obj.click && obj.click.frame === 'Blueprint') {
      this.game.mulle.whereFrom = 'boatyard'
      this.game.state.start('blueprint')
      return
    }
  }

  /**
   * Lingo runtime wait handler
   * @param {object} obj Lingo mouseObject spec
   */
  onLingoWait (obj) {
    if (!obj) return
    if (!this.OKToTalk || !this.dialogClosed) return

    if (obj.dragToWhere === 'PhotoBook') {
      this.makeMulleTalk('InfoTalk', '04d054v0')
      return
    }

    if (obj.dragToWhere === 'Camera') {
      this.makeMulleTalk('InfoTalk', '04d053v0')
    }
  }

  /**
   * Show wind report (Mulle talks about current wind)
   * Original Lingo (Dir.ls lines 226-240):
   *   case getWindspeed(the weather of gMulleGlobals) of
   *     0: "00d010v0" (windstil)
   *     1: "00d011v0" (lichte wind)
   *     2: "00d012v0" (matige wind)
   *     3: "00d013v0" (harde wind)
   */
  showWindReport () {
    if (this.mulleActor?.isTalking || this.mulleMode === 'goPee') {
      return
    }
    const windSpeed = this.getWindSpeed()
    const sound = QuayData.getWindReportSound(windSpeed)
    if (!sound) return
    
    console.debug('[Boatyard] Wind report - speed:', windSpeed, 'sound:', sound)
    if (this.mulleActor) {
      this.mulleActor.talk(sound)
    }
  }

  /**
   * Create windmeter sprite with Director animation states
   * Original Lingo (Dir.ls lines 107-109):
   * - Sprite member "04a005v0" (member 11) as first frame
   * - Animation chart at member 26 with Speed0-3 states
   * - Frame numbers are relative: 1-6 maps to members 11-16
   */
  createWindmeter () {
    // Position from original rect(479, 18, 536, 70)
    // Center X=479+(57/2)=508, Center Y=18+(52/2)=44
    const windmeterX = 508
    const windmeterY = 44

    // First frame member number for windmeter animation
    const WINDMETER_FIRST_FRAME = 11  // Member 11 = 04a005v0

    // Animation frame lists from original Lingo (member 26 windmeterAnimChart):
    // #Speed0:[1], #Speed1:[1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6],
    // #Speed2:[1,1,2,2,3,3,4,4,5,5,6,6], #Speed3:[1,2,3,4,5,6]
    const WINDMETER_ANIMATIONS = {
      Speed0: [1],
      Speed1: [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6, 6, 6],
      Speed2: [1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6],
      Speed3: [1, 2, 3, 4, 5, 6]
    }

    try {
      // Create windmeter sprite
      this.windmeterSprite = new MulleSprite(this.game, windmeterX, windmeterY, null, null)
      this.windmeterSprite.movie = 'boten_04.DXR'

      // Set initial frame
      if (!this.windmeterSprite.setDirectorMember('boten_04.DXR', WINDMETER_FIRST_FRAME)) {
        console.warn('[Boatyard] Windmeter sprite not found, skipping (Lingo parity)')
        this.windmeterSprite.destroy()
        this.windmeterSprite = null
        return
      }

      this.game.add.existing(this.windmeterSprite)

      // Add animations for each speed level
      // Frame numbers in animchart are 1-based, we offset to actual member numbers
      for (const [animName, frames] of Object.entries(WINDMETER_ANIMATIONS)) {
        this.windmeterSprite.addDirectorAnimation(
          animName,
          WINDMETER_FIRST_FRAME,
          frames,
          true  // Loop the animation
        )
      }

      // Set initial animation based on current wind speed
      this.updateWindmeterAnimation()

      console.debug('[Boatyard] Windmeter sprite created with Speed0-3 animations')
    } catch (e) {
      console.warn('[Boatyard] Could not create windmeter sprite:', e)
      if (this.windmeterSprite) {
        this.windmeterSprite.destroy()
        this.windmeterSprite = null
      }
    }
  }

  /**
   * Update windmeter animation based on current wind speed
   * Called when weather changes or on scene create
   */
  updateWindmeterAnimation () {
    const windSpeed = this.getWindSpeed()
    const animName = `Speed${windSpeed}`

    if (this.windmeterSprite && this.windmeterSprite.animations) {
      // Check if animation exists
      const anim = this.windmeterSprite.animations.getAnimation(animName)
      if (anim) {
        this.windmeterSprite.animations.play(animName)
        console.debug('[Boatyard] Windmeter animation set to:', animName)
      } else {
        console.warn('[Boatyard] Windmeter animation not found:', animName)
        // Fallback to Speed0 if available
        const fallbackAnim = this.windmeterSprite.animations.getAnimation('Speed0')
        if (fallbackAnim) {
          this.windmeterSprite.animations.play('Speed0')
        }
      }
    }

  }


  /**
   * Try to go sailing - check if boat is seaworthy
   * 
   * ORIGINELE LINGO (ParentScript 22 - Dir.ls, regels 135-148):
   * if getProperty(tmpBoat, #engine) or getProperty(tmpBoat, #SailWithPole) or getProperty(tmpBoat, #Oar) then
   *   addNrOfBuiltBoats(the user of gMulleGlobals)
   *   set the deliveryMade of the user of gMulleGlobals to 0
   *   stopAll(gSound)
   *   if getProperty(tmpBoat, #Material) = 1 then
   *     go("WoodWorld")
   *   else
   *     go("MetalWorld")
   * else
   *   sendSprite(#Mulle, #makeMulleTalk, #PrioTalk, "04d049v0")
   */
  trySailing () {
    const boat = this.game.mulle.user.Boat
    if (!boat) {
      this.showDialogue('Je hebt geen boot!')
      return
    }

    // Gather → Compute
    const result = QuayData.computeSailResult({
      engine: boat.getProperty('engine') > 0,
      sailWithPole: boat.getProperty('sailwithpole') > 0,
      oar: boat.getProperty('oar') > 0,
      material: boat.getProperty('material') || 1
    })

    if (!result.canSail) {
      this.showDialogue('Je boot heeft aandrijving nodig! Voeg een motor, zeil of roeispanen toe.')
      try {
        this.game.mulle.playAudio(result.noSailSound)
      } catch (e) {
        console.warn('[Boatyard] Could not play seaworthiness audio:', e)
      }
      console.debug('[Boatyard] Boat not seaworthy - no propulsion')
      return
    }

    // Apply side effects
    console.log('[Boatyard] Going sailing!')
    
    if (result.incrementBuiltBoats) {
      if (isNaN(this.game.mulle.user.NrOfBuiltBoats)) {
        this.game.mulle.user.NrOfBuiltBoats = 0
      }
      this.game.mulle.user.NrOfBuiltBoats += 1
      console.debug('[Boatyard] NrOfBuiltBoats =', this.game.mulle.user.NrOfBuiltBoats)
    }
    
    if (result.clearDeliveryMade) {
      this.game.mulle.user.deliveryMade = false
    }
    
    this.game.sound.stopAll()
    this.game.mulle.user.save()
    
    this.game.mulle.worldType = result.world
    this.game.mulle.boatMaterial = boat.getProperty('material') || 1
    // Keep original world start spawn when leaving Quay.
    // Edge-spawn is reserved for crossing map borders inside SeaWorld.
    this.game.mulle.seaSpawnEdge = null
    this.game.state.start('seaworld')
  }

  /**
   * Create Mulle actor using MulleActor
   * Same character as in the car game - animation frames from boten_04.DXR members 42-74
   * Original Lingo: #Mulle: 66 in spriteList, MulleQuayBH behavior
   */
  createMulleActor () {
    // Mulle position - he stands on the right side of the shipyard
    // Original position from Lingo: point(557, 327) for QuayAnimChart
    this.mulleHomeX = 557
    this.mulleHomeY = 327

    // Create MulleActor for boat game (uses 'mulleQuay' actor type)
    // Original Lingo uses QuayAnimChart with #Talk:[30-36] and #GoPee animation
    // 'mulleBoat' was incorrect - it uses TalkToMe chart (#Talk:[21,23-29])
    this.mulleActor = new MulleActor(this.game, this.mulleHomeX, this.mulleHomeY, 'mulleQuay')
    this.game.add.existing(this.mulleActor)
    
    // Register Mulle as an actor for dialogue system
    this.game.mulle.actors.mulle = this.mulleActor

    // ITEM #81: Mulle animation chart switching
    // Original Lingo (MulleQuayBH.ls lines 6-9):
    // set currentAnimChart to #Quay
    // sendSprite(SP, #setAnimChart, "Quay")
    this.mulleCurrentAnimChart = 'Quay'  // #Quay or #TalkToMe

    // Make Mulle clickable for dialogue
    this.mulleActor.inputEnabled = true
    this.mulleActor.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.mulleActor.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.mulleActor.events.onInputUp.add(() => {
      // Don't talk if doing GoPee animation
      if (this.mulleMode === 'goPee') return
      this.mulleTalk()
    })

    // Start idle animation
    this.mulleActor.animations.play('idle')
    this.mulleMode = 'wait'

    // Setup random idle animations (scratch, look around, etc.)
    // Original Lingo has loopCounter system for random behaviors
    this.setupMulleIdleAnimations()

    // === ITEM #82: GOPEE EASTER EGG ===
    // Original Lingo (MulleQuayBH.ls lines 11-17):
    // if random(500) = 1 then
    //   set loopCounter to random(360) + 360
    //   set launchMullePee to 1
    this.setupGoPeeEasterEgg()
    
    console.debug('[Boatyard] Mulle actor created with animations')
  }

  /**
   * Setup the GoPee Easter Egg
   * Original Lingo: 1/500 chance at scene start, triggers after 6-12 seconds
   * When triggered, Mulle walks off to pee (animated sequence with sound)
   */
  setupGoPeeEasterEgg () {
    // 1/500 chance (0.2%) to trigger GoPee
    if (this.game.rnd.integerInRange(1, 500) !== 1) {
      this.launchMullePee = false
      console.debug('[Boatyard] GoPee Easter Egg: Not triggered this visit')
      return
    }

    console.debug('[Boatyard] GoPee Easter Egg: ACTIVATED! Will trigger soon...')
    this.launchMullePee = true
    
    // Original: loopCounter = random(360) + 360 (6-12 seconds at 60fps)
    const delaySeconds = this.game.rnd.integerInRange(6, 12)
    
    this.goPeeTimer = this.game.time.events.add(
      Phaser.Timer.SECOND * delaySeconds,
      () => {
        this.triggerGoPee()
      },
      this
    )
  }

  /**
   * ITEM #82-83: Trigger the GoPee animation with specific frames
   * Original Lingo (MulleQuayBH.ls lines 54-68):
   * - setAnimFirstFrame("04a002v0") - specific starting frame
   * - setAnimLoc(point(320, 240)) - move to center
   * - mode = #GoPee
   * - No sound in original Lingo (audio IDs not present in ISO)
   */
  triggerGoPee () {
    // Only trigger if Mulle is in wait mode and not talking
    if (this.mulleMode !== 'wait' || this.mulleActor.isTalking) {
      // Retry in 2 seconds
      this.goPeeTimer = this.game.time.events.add(
        Phaser.Timer.SECOND * 2,
        () => this.triggerGoPee(),
        this
      )
      return
    }

    console.debug('[Boatyard] GoPee Easter Egg: Triggering animation!')
    this.mulleMode = 'goPee'
    this.launchMullePee = false

    // ITEM #82: Set specific first frame for GoPee animation
    // Original Lingo (MulleQuayBH.ls line 58): setAnimFirstFrame("04a002v0")
    if (this.mulleActor.setDirectorMember) {
      try {
        this.mulleActor.setDirectorMember('boten_04.DXR', '04a002v0')
      } catch (e) {
        console.warn('[Boatyard] Could not set GoPee first frame')
      }
    }

    // BUG FIX #3: Animation chart switching not implemented
    // ITEM #81: Switch back to Quay animation chart if in TalkToMe
    // Original Lingo (MulleQuayBH.ls lines 59-62):
    // if currentAnimChart = #TalkToMe then
    //   set currentAnimChart to #Quay
    //   sendSprite(currentSpriteNum, #setAnimChart, "Quay")
    if (this.mulleCurrentAnimChart === 'TalkToMe') {
      this.mulleCurrentAnimChart = 'Quay'
      if (this.mulleActor && this.mulleActor.setAnimChart) {
        this.mulleActor.setAnimChart('Quay')
      }
    }

    this.OKToTalk = false

    // Move Mulle to center screen (original: point(320, 240))
    const targetX = 320
    const targetY = 240
    
    // Tween Mulle to center
    const walkTween = this.game.add.tween(this.mulleActor)
      .to({ x: targetX, y: targetY }, 1500, Phaser.Easing.Linear.None, true)
    
    walkTween.onComplete.add(() => {
      // Play goPee animation (from mulleQuay actor type)
      // Original Lingo: no explicit sound call here
      const goPeeAnim = this.mulleActor.animations.play('goPee')
      if (goPeeAnim) {
        goPeeAnim.onComplete.addOnce(() => {
          this.returnFromGoPee()
        })
      } else {
        // Fallback: just wait and return
        this.game.time.events.add(Phaser.Timer.SECOND * 3, () => {
          this.returnFromGoPee()
        })
      }
    })
  }

  /**
   * ITEM #82: Return Mulle to his original position after GoPee
   * Original Lingo (MulleQuayBH.ls lines 85-92):
   * - setAnimChart("Quay")
   * - setAnimLoc(point(557, 327))
   * - setAnimFirstFrame("00a001v0") - return to normal first frame
   */
  returnFromGoPee () {
    console.debug('[Boatyard] GoPee Easter Egg: Returning to position')
    
    // BUG FIX #3: Animation chart switching not implemented
    // ITEM #81: Ensure Quay animation chart
    this.mulleCurrentAnimChart = 'Quay'
    if (this.mulleActor && this.mulleActor.setAnimChart) {
      this.mulleActor.setAnimChart('Quay')
    }
    
    // Tween back to original position (557, 327)
    // Original Lingo (MulleQuayBH.ls line 91): sendSprite(SP, #setAnimLoc, point(557, 327))
    const returnTween = this.game.add.tween(this.mulleActor)
      .to({ x: this.mulleHomeX, y: this.mulleHomeY }, 1500, Phaser.Easing.Linear.None, true)
    
    returnTween.onComplete.add(() => {
      // Reset to idle frame after GoPee
      this.mulleMode = 'wait'
      this.OKToTalk = true
      if (this.mulleActor && this.mulleActor.animations) {
        this.mulleActor.animations.play('idle')
      }
      console.debug('[Boatyard] GoPee Easter Egg: Complete!')
    })
  }

  /**
   * Setup random idle animations for Mulle
   * Original Lingo: loopCounter system in MulleQuayBH.ls
   */
  setupMulleIdleAnimations () {
    // BUG FIX #2.5: Idle Animation Timing
    // Frame-based countdown instead of fixed-interval timer (matches original Lingo loopCounter)
    const startIdleCycle = () => {
      const delay = this.game.rnd.integerInRange(360, 1080) * (1000/60) // 6-18 sec at 60 FPS
      this.game.time.events.add(delay, () => {
        if (!this.mulleActor.isTalking && this.mulleMode === 'wait') {
          const rand = this.game.rnd.frac()
          if (rand < 0.3) {
            const scratchAnim = this.mulleActor.animations.play('scratch')
            if (scratchAnim) {
              scratchAnim.onComplete.addOnce(() => {
                this.mulleActor.animations.play('idle')
                startIdleCycle()
              })
            } else {
              startIdleCycle()
            }
          } else if (rand < 0.5) {
            this.mulleActor.animations.play('lookAround')
            this.game.time.events.add(2000, () => {
              this.mulleActor.animations.play('idle')
              startIdleCycle()
            })
          } else {
            startIdleCycle()
          }
        } else {
          startIdleCycle()
        }
      })
    }
    startIdleCycle()
  }

  /**
   * ITEM #84: Create Buffa the dog with animation state machine
   * Original Lingo (BuffaQuayBH.ls):
   * - Sprite channel #Buffa: 5
   * - Modes: #Wait, #GetDown, #Sleep, #GetUp (state machine via Stopped event)
   * - 1/100 random chance per frame to lie down
   * - Click: if waiting → lie down, if sleeping → wake up
   * - Position: around x=350-550 based on leftBorder/rightBorder
   */
  createBuffaDog () {
    // Buffa sprite from 04a003v0 (member 75 in boten_04.DXR)
    // Position estimated from Lingo: leftBorder=350, rightBorder=550, so around x=450
    const buffaX = 490
    const buffaY = 230  // Based on sprite imagePosY from metadata

    // Create Buffa sprite
    // All boten_04.DXR sprites use regpoint as stage position offset from (320, 240)
    // So place at (320, 240) and let regpoint handle visual positioning
    try {
      this.buffaSprite = new MulleSprite(this.game, 320, 240, null, null)
      this.buffaSprite.setDirectorMember('boten_04.DXR', 75)
      this.game.add.existing(this.buffaSprite)
      
      // Set up Buffa state
      this.buffaMode = 'wait'  // #Wait, #GetDown, #Sleep, #GetUp
      
      // Make Buffa clickable
      this.buffaSprite.inputEnabled = true
      this.buffaSprite.events.onInputOver.add(() => {
        this.game.mulle.cursor.current = 'Point'
      })
      this.buffaSprite.events.onInputOut.add(() => {
        this.game.mulle.cursor.current = null
      })
      this.buffaSprite.events.onInputUp.add(() => {
        this.onBuffaClick()
      })

      // Setup random behavior timer
      this.setupBuffaBehavior()

      console.debug('[Boatyard] Buffa dog created at', buffaX, buffaY)
    } catch (e) {
      console.warn('[Boatyard] Could not create Buffa sprite:', e)
    }
  }

  /**
   * Setup Buffa's random behavior
   * Original Lingo (BuffaQuayBH.ls lines 11-17):
   *   on exitFrame me  -- runs at 60 FPS
   *     if random(100) = 1 then randomMove(me, 1)  -- 1/100 chance per frame
   * 
   * BUG FIX #17: Buffa random timing - 1/100 per frame vs 1/10 per second mismatch
   * Original: 1/100 chance per frame at 60 FPS = 0.6 times per second average
   * JS: Was checking every 1 second with 1/10 chance = 0.1 times per second (6x too slow!)
   * Fix: Check every frame (60 FPS) with 1/100 chance to match original
   */
  setupBuffaBehavior () {
    // BUG FIX #17: Check at 60 FPS like original exitFrame
    this.buffaIdleTimer = this.game.time.events.loop(
      Math.floor(1000 / 60), // 16.67ms = 60 FPS
      () => {
        if (this.buffaMode === 'wait') {
          // BUG FIX #17: 1/100 chance per frame (original behavior)
          if (this.game.rnd.integerInRange(1, 100) === 1) {
            this.buffaLieDown()
          }
        }
        // Note: Sleep wake-up is handled in onBuffaAnimationStopped, not here
      },
      this
    )
  }

  /**
   * Handle click on Buffa
   * Original Lingo (BuffaQuayBH.ls lines 35-44):
   *   if mode = #Wait then randomMove (lie down)
   *   else if mode = #Sleep then mode = #GetUp (wake up)
   */
  onBuffaClick () {
    if (this.buffaMode === 'wait') {
      this.buffaLieDown()
    } else if (this.buffaMode === 'sleep') {
      this.buffaWakeUp()
    }
  }

  /**
   * ITEM #84: Buffa lie down animation (state machine: Wait -> GetDown -> Sleep)
   * Original Lingo (BuffaQuayBH.ls): Uses Stopped event to transition states
   */
  buffaLieDown () {
    if (this.buffaMode !== 'wait') return
    
    console.debug('[Boatyard] Buffa lying down')
    this.buffaMode = 'getDown'
    
    // Animate lying down (frames 1-7 from 04a003v0)
    // Frame 1 = standing, frames progress to lying down
    if (this.buffaSprite) {
      // Simple animation: change frames over time
      let frame = 75  // Start frame (member 75 = frame 1)
      const lieDownInterval = this.game.time.events.repeat(
        100, // 100ms per frame
        6,   // 6 frames (75-80)
        () => {
          frame++
          if (frame <= 81) {
            this.buffaSprite.setDirectorMember('boten_04.DXR', frame)
          }
        },
        this
      )
      
      // ITEM #84: After animation, trigger Stopped event -> transition to Sleep
      // Original Lingo (BuffaQuayBH.ls Stopped handler): mode #GetDown -> mode #Sleep
      this.game.time.events.add(700, () => {
        this.onBuffaAnimationStopped()
      })
    }
  }

  /**
   * ITEM #84: Buffa wake up animation (state machine: Sleep -> GetUp -> Wait)
   * Original Lingo (BuffaQuayBH.ls): Uses Stopped event to transition states
   */
  buffaWakeUp () {
    if (this.buffaMode !== 'sleep') return
    
    console.debug('[Boatyard] Buffa waking up')
    this.buffaMode = 'getUp'
    
    // Animate getting up (reverse of lying down)
    if (this.buffaSprite) {
      let frame = 81  // Start from lying down
      const getUpInterval = this.game.time.events.repeat(
        100, // 100ms per frame
        6,   // 6 frames (81-76)
        () => {
          frame--
          if (frame >= 75) {
            this.buffaSprite.setDirectorMember('boten_04.DXR', frame)
          }
        },
        this
      )
      
      // ITEM #84: After animation, trigger Stopped event -> transition to Wait
      // Original Lingo (BuffaQuayBH.ls Stopped handler): mode #GetUp -> mode #Wait
      this.game.time.events.add(700, () => {
        this.onBuffaAnimationStopped()
      })
    }
  }

  /**
   * ITEM #84: Buffa animation Stopped event handler (state machine transitions)
   * Original Lingo (BuffaQuayBH.ls lines 46-61):
   * on Stopped me
   *   case mode of
   *     #GetDown: set tempMode to #Sleep
   *     #Sleep:
   *       if random(30) = 1 then
   *         set tempMode to #GetUp
   *       else
   *         set tempMode to #Sleep
   *       end if
   *     otherwise: set tempMode to #Wait
   *   set mode to tempMode
   *   sendSprite(SP, #setAnimAction, mode)
   * 
   * BUG FIX #6: Buffa sleep animation continuation - Add Stopped handler restart logic
   * Original has SLEEP case in Stopped handler that re-triggers sleep animation or wakes up
   * JS implementation was missing this - once asleep, Buffa would never wake up
   */
  onBuffaAnimationStopped () {
    let nextMode = null
    
    switch (this.buffaMode) {
      case 'getDown':
        // Transition: GetDown -> Sleep
        nextMode = 'sleep'
        console.debug('[Boatyard] Buffa state transition: GetDown -> Sleep')
        break
        
      case 'sleep':
        // BUG FIX #6: Sleep state needs to check for wake-up or continue sleeping
        // Original Lingo (BuffaQuayBH.ls lines 50-55):
        // #Sleep: if random(30) = 1 then tempMode = #GetUp else tempMode = #Sleep
        if (this.game.rnd.integerInRange(1, 30) === 1) {
          nextMode = 'getUp'
          console.debug('[Boatyard] Buffa state transition: Sleep -> GetUp (random wake)')
        } else {
          nextMode = 'sleep'
          // Re-trigger sleep animation (stays lying down)
        }
        break
        
      case 'getUp':
        // Transition: GetUp -> Wait
        nextMode = 'wait'
        console.debug('[Boatyard] Buffa state transition: GetUp -> Wait')
        break
        
      default:
        // Otherwise: Wait
        nextMode = 'wait'
        break
    }
    
    if (nextMode) {
      this.buffaMode = nextMode
      
      // Set appropriate frame for new state
      if (this.buffaSprite) {
        if (nextMode === 'sleep') {
          // Stay in lying down frame
          this.buffaSprite.setDirectorMember('boten_04.DXR', 81)
        } else if (nextMode === 'wait') {
          // Standing frame
          this.buffaSprite.setDirectorMember('boten_04.DXR', 75)
        }
        // GetDown and GetUp will be handled by their animation sequences
      }
    }
  }

  /**
   * Create Figge's Boat Easter Egg
   * Original Lingo (FiggeBH.ls):
   * - Sprite channel #Figge: 3
   * - 1/500 chance on scene start
   * - Boat enters from left (-160, 240) and moves right (+4 pixels per frame)
   * - Uses member "04a001v0" with frames 1-5
   * - Sound "04e998v0" at start (boat motor), "04d055v0" midway (Figge talks)
   * - Waits 6-12 seconds before starting (random(360) + 360 frames at 60fps)
   */
  createFigge () {
    // 1/500 chance (0.2%) to trigger Figge's boat - same as GoPee
    if (this.game.rnd.integerInRange(1, 500) !== 1) {
      this.figgeActive = false
      console.debug('[Boatyard] Figge Easter Egg: Not triggered this visit')
      return
    }

    console.debug('[Boatyard] Figge Easter Egg: ACTIVATED! Boat will appear soon...')
    this.figgeActive = true
    
    // Create Figge sprite (initially invisible, off-screen left)
    try {
      // Member 04a001v0 is the boat sprite
      this.figgeSprite = new MulleSprite(this.game, -160, 240, null, null)
      this.figgeSprite.setDirectorMember('boten_04.DXR', 36)
      this.figgeSprite.visible = false
      this.game.add.existing(this.figgeSprite)
    } catch (e) {
      console.warn('[Boatyard] Could not create Figge sprite:', e)
      this.figgeActive = false
      return
    }
    
    // Animation state
    this.figgeAnimPos = 0
    this.figgeX = -160
    this.figgeY = 240
    this.figgeSoundId = null
    this.figgeResetOkToTalk = false
    
    // Build animation list from original Lingo
    // Format: frame numbers (1-5) with special events
    // Original: [#OPEFFECT: "04e998v0"], then frames, [#EFFECT: "04d055v0", #frame: 1], then more frames
    this.figgeAnimList = this.buildFiggeAnimList()
    
    // Delay before starting (6-12 seconds)
    // Original: loopCounter = random(360) + 360 → 360-720 frames at 60fps = 6-12 seconds
    const delaySeconds = this.game.rnd.integerInRange(6, 12)
    
    this.figgeDelayTimer = this.game.time.events.add(
      Phaser.Timer.SECOND * delaySeconds,
      () => {
        this.startFiggeAnimation()
      },
      this
    )
  }

  /**
   * Build Figge animation list from original Lingo
   * Original animList has 198 entries with frames and sound triggers
   */
  buildFiggeAnimList () {
    const animList = []
    
    // Start with boat motor sound
    animList.push({ type: 'OPEFFECT', sound: '04e998v0' })
    
    // First section: alternating frames 1,1,2,2 repeated many times (boat bobbing)
    for (let i = 0; i < 34; i++) {
      animList.push({ type: 'frame', frame: 1 })
      animList.push({ type: 'frame', frame: 1 })
      animList.push({ type: 'frame', frame: 2 })
      animList.push({ type: 'frame', frame: 2 })
    }
    
    // Figge speaks midway
    animList.push({ type: 'EFFECT', sound: '04d055v0', frame: 1 })
    
    // Wave animation section: frames go 1,2,2,3,3,4,4,5,5,4,4,5,5,4,4,3,3,2,2,1,1...
    const wavePattern = [1, 2, 2, 3, 3, 4, 4, 5, 5, 4, 4, 5, 5, 4, 4, 3, 3, 2, 2, 1, 1]
    wavePattern.forEach(frame => {
      animList.push({ type: 'frame', frame: frame })
    })
    
    // Continue with more bobbing
    for (let i = 0; i < 40; i++) {
      animList.push({ type: 'frame', frame: 1 })
      animList.push({ type: 'frame', frame: 1 })
      animList.push({ type: 'frame', frame: 2 })
      animList.push({ type: 'frame', frame: 2 })
    }
    
    return animList
  }

  /**
   * Start Figge's boat animation
   */
  startFiggeAnimation () {
    if (!this.figgeActive || !this.figgeSprite) return
    
    console.debug('[Boatyard] Figge Easter Egg: Starting animation!')
    
    // Make sprite visible
    this.figgeSprite.visible = true
    this.figgeSprite.x = this.figgeX
    this.figgeSprite.y = this.figgeY
    
    // Start animation loop (runs at ~60fps equivalent, we'll use 33ms intervals)
    this.figgeAnimTimer = this.game.time.events.loop(
      33, // ~30fps for smoother animation
      () => {
        this.processFiggeAnimFrame()
      },
      this
    )
  }

  /**
   * Process one frame of Figge's animation
   * Original Lingo (FiggeBH.ls lines 20-60)
   */
  processFiggeAnimFrame () {
    if (!this.figgeActive) return
    
    if (this.figgeAnimPos >= this.figgeAnimList.length) {
      // Animation complete
      this.endFiggeAnimation()
      return
    }
    
    const animInfo = this.figgeAnimList[this.figgeAnimPos]
    
    // BUG FIX #18: Figge animation sound handling - OPEFFECT vs EFFECT logic
    // Original Lingo has different handling for OPEFFECT (looping motor) vs EFFECT (one-shot dialogue)
    if (animInfo.type === 'OPEFFECT') {
      // Play boat motor sound (one-shot, not looping - Phaser CE audio handles this)
      try {
        this.figgeSoundId = this.game.mulle.playAudio('boten_04.DXR/' + animInfo.sound)
        console.debug('[Boatyard] Figge: Playing boat motor sound')
      } catch (e) {
        console.warn('[Boatyard] Could not play Figge OPEFFECT sound:', e)
      }
    } else if (animInfo.type === 'EFFECT') {
      // BUG FIX #18: EFFECT should check OKToTalk and set it to 0
      // Original Lingo would prevent interrupting Mulle's dialogue
      if (this.OKToTalk) {
        this.OKToTalk = false
        this.figgeResetOkToTalk = true
        try {
          this.game.mulle.playAudio('boten_04.DXR/' + animInfo.sound)
          console.debug('[Boatyard] Figge: Playing dialogue sound')
        } catch (e) {
          console.warn('[Boatyard] Could not play Figge EFFECT sound:', e)
        }
      }
      // Also set frame if specified (EFFECT can include frame)
      if (animInfo.frame) {
        this.setFiggeFrame(animInfo.frame)
        this.figgeX += 4
      }
    } else if (animInfo.type === 'frame') {
      // Set animation frame and move boat
      this.setFiggeFrame(animInfo.frame)
      this.figgeX += 4
    }
    
    // Update sprite position
    if (this.figgeSprite) {
      this.figgeSprite.x = this.figgeX
    }
    
    this.figgeAnimPos++
  }

  /**
   * Set Figge sprite frame
   * Original: member (firstFrame + (frame - 1))
   * firstFrame = member "04a001v0" = member 36
   */
  setFiggeFrame (frameNum) {
    if (!this.figgeSprite) return
    
    // Frame 1-5 maps to members 36-40 (04a001v0 through 04a005v0)
    const memberNum = 36 + (frameNum - 1)
    try {
      this.figgeSprite.setDirectorMember('boten_04.DXR', memberNum)
    } catch (e) {
      // Silently ignore frame errors
    }
  }

  /**
   * End Figge's animation
   */
  endFiggeAnimation () {
    console.debug('[Boatyard] Figge Easter Egg: Animation complete!')
    
    this.figgeActive = false
    
    // Stop animation timer
    if (this.figgeAnimTimer) {
      this.game.time.events.remove(this.figgeAnimTimer)
      this.figgeAnimTimer = null
    }
    
    // Stop boat motor sound
    if (this.figgeSoundId) {
      try {
        this.figgeSoundId.stop()
      } catch (e) {
        // Ignore
      }
      this.figgeSoundId = null
    }
    
    // Reset OKToTalk if we changed it
    if (this.figgeResetOkToTalk) {
      this.OKToTalk = true
      this.figgeResetOkToTalk = false
    }
    
    // Hide sprite
    if (this.figgeSprite) {
      this.figgeSprite.visible = false
    }
  }

  /**
   * ITEM #72: Create the radio for Doris announcements (includes BigRadio mode)
   * Original Lingo (Dir.ls):
   * - #Radio: 8 (small radio)
   * - #BigRadio: 109 (big radio for special announcements)
   * - dorisBluePrintList: ["04d040v0", "04d044v0"]
   * - dorisPartList: ["04d034v0", ..., "04d046v0"]
   */
  createRadio () {
    // Radio state
    this.radioMode = 'still'  // 'still' or 'talk'
    this.radioDialogList = []
    this.radioCount = 0
    this.radioReport = false
    this.OKToTalk = true
    
    // Doris dialogue lists now from QuayData module
    this.dorisBluePrintList = [...QuayData.DORIS_BLUEPRINT_LIST]
    this.dorisPartList = [...QuayData.DORIS_PART_LIST]

    // ITEM #72: Create small radio sprite
    // Original: #Radio: 8 in spriteList
    const radioX = 520
    const radioY = 100

    try {
      // Try to create radio sprite (04b008v0 might be the radio)
      this.radioSprite = new MulleSprite(this.game, radioX, radioY, null, null)
      this.radioSprite.setDirectorMember('boten_04.DXR', 8)
      this.game.add.existing(this.radioSprite)
      console.debug('[Boatyard] Radio sprite created')
    } catch (e) {
      console.warn('[Boatyard] Could not create radio sprite, using placeholder')
      // Create a simple placeholder
      this.radioSprite = null
    }

    // ITEM #72: BigRadio mode for special announcements
    // Original: #BigRadio: 109 in spriteList
    // In the original, BigRadio uses the same radio sprite (member 8 = 04b008v0)
    // but displayed larger/differently during important announcements.
    // Members 100+ in boten_04.DXR are audio, not sprites.
    // BigRadio is a state change of the existing radio, not a separate sprite.
    this.bigRadioSprite = null
    this.bigRadioMode = false

    // Check for delivery on scene init
    // Original Lingo (Dir.ls lines 60-63):
    // if ((tmpBuiltBoats = 2) or ((tmpBuiltBoats mod 4) = 0)) and (tmpBuiltBoats > 0) and not deliveryMade
    this.checkDelivery()

    // Setup first-time radio report
    // Original Lingo (Dir.ls lines 24-28):
    // if isItTheVeryFirstTime then set radioDialogList to ["00d075v0", "50d012v0"]
    this.setupFirstTimeRadio()

    // Start boatyard loop timer
    // BUG FIX #1: Loop counter timing 60x too slow
    // Original Lingo: exitFrame runs at 60 FPS (every 16.67ms)
    // JS was using 1 second (1000ms) - 60x too slow!
    // Fixed to match 60 FPS timing
    this.boatyardLoopTimer = this.game.time.events.loop(
      Math.floor(1000 / 60), // 16.67ms = 60 FPS
      this.processBoatyardLoop,
      this
    )

    console.debug('[Boatyard] Radio system initialized')
  }

  /**
   * Setup first-time radio announcement
   * Original Lingo: if isItTheVeryFirstTime → radioDialogList = ["00d075v0", "50d012v0"]
   */
  setupFirstTimeRadio () {
    const user = this.game.mulle.user
    
    // Check if this is the very first time in the boatyard
    if (user.veryFirstTime && !user.visitedBoatyard) {
      this.radioReport = true
      this.radioDialogList = [...QuayData.VERY_FIRST_TIME_RADIO_LIST]
      this.radioCount = this.radioDialogList.length
      console.debug('[Boatyard] First-time radio report queued')
    }
  }

  /**
   * NOTE: Old checkForDelivery/doDelivery/doFallbackDelivery methods removed.
   * The active versions are checkDelivery() and doDelivery() using DELIVERY_ITEMS.
   */

  /**
   * ITEM #72: Make the radio play a sound (Doris speaking) with BigRadio mode support
   * Original Lingo: sendSprite(#Radio, #makeRadioTalk, #smallTalk, sound)
   * @param {string} sound - Sound to play
   * @param {boolean} useBigRadio - Use BigRadio sprite for important announcements
   */
  radioTalk (sound, useBigRadio = false) {
    if (!sound) return
    
    console.debug('[Boatyard] Radio playing:', sound, 'BigRadio:', useBigRadio)
    this.radioMode = 'talk'
    this.OKToTalk = false
    
    // BUG FIX #5: Radio BigRadio mode incomplete - implement animation chart switching
    // Original Lingo would switch Mulle's animation chart when radio talks
    // This prevents Mulle from animating while radio is speaking
    if (this.mulleCurrentAnimChart === 'TalkToMe') {
      this.mulleCurrentAnimChart = 'Quay'
      if (this.mulleActor && this.mulleActor.setAnimChart) {
        this.mulleActor.setAnimChart('Quay')
      }
    }
    
    // ITEM #72: Show BigRadio for important announcements
    let activeRadioSprite = this.radioSprite
    if (useBigRadio && this.bigRadioSprite) {
      activeRadioSprite = this.bigRadioSprite
      this.bigRadioSprite.visible = true
      console.debug('[Boatyard] Using BigRadio for announcement')
    }
    
    // Play the radio sound
    try {
      const audio = this.game.mulle.playAudio(sound)
      if (audio) {
        audio.onStop.addOnce(() => {
          this.radioMode = 'still'
          this.OKToTalk = true
          
          // ITEM #72: Hide BigRadio after announcement
          if (useBigRadio && this.bigRadioSprite) {
            this.bigRadioSprite.visible = false
          }
          
          console.debug('[Boatyard] Radio finished speaking')
        })
      } else {
        // Fallback: reset after 5 seconds
        this.game.time.events.add(5000, () => {
          this.radioMode = 'still'
          this.OKToTalk = true
          
          // ITEM #72: Hide BigRadio after announcement
          if (useBigRadio && this.bigRadioSprite) {
            this.bigRadioSprite.visible = false
          }
        })
      }
    } catch (e) {
      console.warn('[Boatyard] Could not play radio sound:', e)
      this.radioMode = 'still'
      this.OKToTalk = true
      
      // ITEM #72: Hide BigRadio on error
      if (useBigRadio && this.bigRadioSprite) {
        this.bigRadioSprite.visible = false
      }
    }

    // Animate radio if sprite exists
    if (activeRadioSprite) {
      // Simple animation: could add proper radio animation frames here
      this.game.add.tween(activeRadioSprite)
        .to({ alpha: 0.8 }, 100, Phaser.Easing.Linear.None, true, 0, -1, true)
    }
  }

  /**
   * Process radio dialogue list
   * Original Lingo: loop() lines 211-224
   * 
   * BUG FIX #2: Radio report first speaker logic wrong
   * Original Lingo (line 214): if tmpCount = radioCount then Mulle speaks
   * This means FIRST item (when count equals original count) is Mulle
   * JS had it backwards - was checking if we're on LAST item
   */
  processRadioReport () {
    if (!this.radioReport || this.radioDialogList.length === 0) return
    
    const sound = this.radioDialogList.shift()
    const currentCount = this.radioDialogList.length + 1 // +1 because we already shifted
    
    // BUG FIX #2: First item in list is spoken by Mulle (when currentCount == radioCount)
    // Original Lingo (Dir.ls line 214): if tmpCount = radioCount then sendSprite(#Mulle, ...)
    if (currentCount === this.radioCount) {
      // First item - Mulle speaks
      if (this.mulleActor) {
        this.makeMulleTalk('NormalTalk', sound)
      }
    } else {
      // Rest - Radio speaks
      this.radioTalk(sound)
    }
    
    // Check if we're done
    if (this.radioDialogList.length === 0) {
      this.radioReport = false
      // BUG FIX #14: RadioCount reset timing - reset in next loop iteration
      // Original Lingo (Dir.ls lines 221-223): resets radioCount when radioReport becomes 0
      this.radioCount = 0
      // Also set loopCounter for next random dialogue
      this.loopCounter = 360 + Math.floor(Math.random() * 720)
    }
  }

  /**
   * Get random item from a list
   */
  getRandomFromList (list) {
    if (!list || list.length === 0) return null
    return list[Math.floor(Math.random() * list.length)]
  }

  /**
   * ITEM #94: Main loop for radio/delivery processing with dialogClosed flag management
   * Original Lingo (Dir.ls lines 200-264): on loop me
   * Called periodically to check for pending actions
   * 
   * dialogClosed flag prevents interrupting active dialogues
   */
  processBoatyardLoop () {
    // ITEM #94: Check dialogClosed before processing
    // Original Lingo (Dir.ls line 201): if OKToTalk and dialogClosed then
    if (!this.OKToTalk || !this.dialogClosed) return
    
    // Decrement loop counter for random dialogue timing
    // Original Lingo (Dir.ls lines 202-204): if loopCounter > 0 then loopCounter--
    if (this.loopCounter > 0) {
      this.loopCounter--
    }
    
    // Process delivery if pending
    if (this.makeDelivery) {
      this.OKToTalk = false
      if (!this.doDelivery()) {
        this.OKToTalk = true
      }
      return
    }
    
    // Process radio report if pending
    if (this.radioReport) {
      this.processRadioReport()
      return
    }
    
    if (this.windReport) {
      const windSpeed = this.getWindSpeed()
      const tmpSound = QuayData.getWindReportSound(windSpeed)
      
      this.windReport = false
      
      if (tmpSound && this.mulleMode === 'wait') {
        this.makeMulleTalk('NormalTalk', tmpSound)
      }
      return
    }
    
    // First-time dialogues
    if (this.FirstTime) {
      if (this.loopCounter === 0) {
        if (this.firstDialogList && this.firstDialogList.length > 0) {
          // BUG FIX #10: First-time dialogue random selection - use random() not array index
          // Original Lingo (Dir.ls line 245): set tmpRandomSound to random(count(firstDialogList))
          // Then getAt(firstDialogList, tmpRandomSound) - Lingo uses 1-based indexing
          // random(count) returns 1 to count, so we use random(length) to get 1-based, then -1 for 0-based
          const randomLingo = Math.floor(Math.random() * this.firstDialogList.length) + 1 // 1-based
          const randomIndex = randomLingo - 1 // Convert to 0-based for JS
          const randomSound = this.firstDialogList[randomIndex]
          this.makeMulleTalk('InfoTalk', randomSound)
          this.firstDialogList.splice(randomIndex, 1)
          // BUG FIX #15: LoopCounter random range - should be 120+random(120)
          // Original Lingo (Dir.ls line 248): set loopCounter to 120 + random(120)
          this.loopCounter = 120 + Math.floor(Math.random() * 120)
        } else {
          this.FirstTime = false
        }
      }
    } else {
      // Random general dialogues
      if (this.loopCounter === 0) {
        // BUG FIX #10: Random dialogue selection - use 1-based random then convert
        // Original Lingo (Dir.ls line 255): getAt(genDialogList, random(count(genDialogList)))
        const randomLingo = Math.floor(Math.random() * QuayData.GEN_DIALOG_LIST.length) + 1
        const randomIndex = randomLingo - 1
        const randomSound = QuayData.GEN_DIALOG_LIST[randomIndex]
        this.makeMulleTalk('NormalTalk', randomSound)
        // BUG FIX #15: LoopCounter random range - should be 360+random(720) not 360+random(720)
        // Original Lingo (Dir.ls line 257): set loopCounter to 360 + random(720)
        this.loopCounter = 360 + Math.floor(Math.random() * 720)
      }
    }
  }

  /**
   * Load junk parts from user save data
   */
  /**
   * Load junk parts for the Quay (boatyard floor)
   * Original Lingo: junk stored as [#Quay: [...], #Yard: [...], #Shelf1-6: [...]]
   * The Quay is the boatyard floor where parts are visible
   */
  loadJunkParts () {
    const user = this.game.mulle.user
    
    // Get boat junk from save data - use #Quay key (original Lingo)
    const boatJunk = user.BoatJunk || {}
    const quayJunk = boatJunk.Quay || boatJunk.boatyard || {}  // Support legacy 'boatyard' key

    console.debug('[Boatyard] Loading junk parts from Quay:', Object.keys(quayJunk).length)

    // If no saved junk, the boatyard starts empty (matching original Lingo).
    // Player must visit boat_junk to pick up parts first.
    if (Object.keys(quayJunk).length === 0) {
      console.debug('[Boatyard] No saved parts - boatyard starts empty (visit boat_junk to collect parts)')
      return
    }

    const partsDB = this.game.mulle.BoatPartsDB

    // Load saved parts (keys may have _2, _3 suffix for duplicates)
    // Save data contains both auto and boat parts (shared across worlds),
    // but the boatyard only DISPLAYS boat parts (ID >= 280).
    // Auto parts stay in save data for the garage/yard scenes.
    for (const key in quayJunk) {
      const pos = quayJunk[key]
      // Strip _N suffix to get actual part ID
      const partId = parseInt(key.split('_')[0])
      if (!isNaN(partId) && partId >= 280) {
        this.createJunkPart(partId, pos.x, pos.y)
      }
    }
  }


  /**
   * Create a junk part sprite
   * @param {number} partId - Part ID
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  createJunkPart (partId, x, y) {
    const partsDB = this.game.mulle.BoatPartsDB
    const partData = partsDB && partsDB.getPart ? partsDB.getPart(partId) : (partsDB ? partsDB[partId] : null)
    if (!partData) {
      console.warn('[Boatyard] Unknown part:', partId)
      return null
    }

    // Clamp Y to ground level so detached parts don't float in the air
    // Boatyard ground is around y=420-440
    const GROUND_Y = 430
    const clampedY = Math.max(y, GROUND_Y)
    
    const part = new MulleBoatPart(this.game, partId, x, clampedY, true)
    part.boat = this.boat
    part.dropRects = QUAY_DROP_RECTS
    part.dropTargets = part.dropTargets || []

    // Lingo parity: allow dragging junk parts to Yard/world from Quay.
    // Dir.ls defines dragToWhere zones for #Yard and #world.
    this.addJunkDropTargets(part, partId)

    this.junkParts.add(part)
    
    // If the part was above ground, animate it falling down
    if (y < GROUND_Y) {
      part.y = y
      this.game.add.tween(part).to({ y: clampedY }, 300, Phaser.Easing.Bounce.Out, true)
    }

    console.debug('[Boatyard] Created junk part', partId, 'at', x, y)

    return part
  }

  /**
   * Add drag-to-Yard / drag-to-world targets for a junk part (Lingo parity).
   * - #Yard: rect(602, 97, 1640, 302) → door_yard (GoRight)
   * - #world: rect(0, 0, 508, 155) and Pole rect(477,331,509,379) → area_forward / door_sail
   */
  addJunkDropTargets (part, partId) {
    if (!part) return
    if (!part.dropTargets) part.dropTargets = []

    // Drag to Yard (move part to Yard pile)
    if (this.door_yard) {
      part.dropTargets.push([this.door_yard, (d) => {
        return this.handleDropToYard(d, partId)
      }])
    }

    // Drag to World (Lingo #world) — treat as a world drop zone
    if (this.area_forward) {
      part.dropTargets.push([this.area_forward, (d) => {
        return this.handleDropToWorld(d)
      }])
    }

    if (this.door_sail) {
      part.dropTargets.push([this.door_sail, (d) => {
        return this.handleDropToWorld(d)
      }])
    }
  }

  /**
   * Handle dropping a part on the Yard zone.
   * Moves the part from Quay to Yard storage (max 10 items, Lingo limits).
   */
  handleDropToYard (part, partId) {
    const user = this.game.mulle.user
    if (!user) return false

    if (!user.BoatJunk) user.BoatJunk = {}
    if (!user.BoatJunk.Yard) user.BoatJunk.Yard = {}

    const maxParts = 10
    const currentCount = Object.keys(user.BoatJunk.Yard).length
    if (currentCount >= maxParts) {
      // Yard full — play "full" sound (match boat_junk behavior)
      const fullSounds = ['00d009v0', '03d008v0', '03d009v0', '03d010v0']
      const sound = fullSounds[Math.floor(Math.random() * fullSounds.length)]
      try {
        this.game.mulle.playAudio(sound)
      } catch (e) {}
      return false
    }

    const pos = {
      x: 4 + Math.floor(Math.random() * 632),
      y: 450 + Math.floor(Math.random() * 20)
    }

    user.BoatJunk.Yard[partId] = pos

    if (part && typeof part.destroy === 'function') {
      part.destroy()
    }

    // Persist Quay changes after removal
    this.saveJunkPositions()

    try {
      this.game.mulle.playAudio('00e110v0')
    } catch (e) {}

    console.debug('[Boatyard] Moved part', partId, 'to Yard')
    return true
  }

  /**
   * Handle dropping a part on the World zone.
   * Lingo: addJunkPart(#world) fails → part remains in Quay.
   * Here we snap it back onto the Quay floor strip.
   */
  handleDropToWorld (part) {
    if (!part) return false

    const r = this.game.rnd.pick(QUAY_DROP_RECTS)
    part.x = r.randomX
    part.y = r.randomY

    this.saveJunkPositions()

    console.debug('[Boatyard] Dropped part on world zone → returned to Quay')
    return true
  }

  /**
   * Handle first visit and delivery check
   * 
   * ORIGINELE LINGO (ParentScript 22 - Dir.ls):
   * - FirstTime check uit gMulleGlobals.firstTimeList
   * - Als allereerste keer: radioReport met ["00d075v0", "50d012v0"]
   * - Delivery check bij binnenkomst (niet bij vertrek!)
   */
  handleFirstVisit () {
    const user = this.game.mulle.user

    // ORIGINELE LINGO: FirstTime check (regels 20-32)
    const isFirstTime = user.firstTimeList?.Quay !== false
    
    if (isFirstTime) {
      // Mark as visited
      if (!user.firstTimeList) user.firstTimeList = {}
      user.firstTimeList.Quay = false
      
      // ITEM #94: Set FirstTime flag for first-visit dialogue loop
      // Original Lingo (Dir.ls line 20): set FirstTime to getaProp(firstTimeList, #Quay)
      this.FirstTime = true
      
      // ORIGINELE LINGO: Als allereerste keer ooit (isItTheVeryFirstTime)
      if (user.isVeryFirstTime) {
        console.debug('[Boatyard] Very first time - radio report')
        this.radioReport = true
        this.radioDialogList = [...QuayData.VERY_FIRST_TIME_RADIO_LIST]
        this.radioCount = this.radioDialogList.length
        user.isVeryFirstTime = false
      }
      
      this.game.mulle.saveData()
    } else {
      this.FirstTime = false
    }

    // ORIGINELE LINGO: Delivery check bij binnenkomst (regels 60-63)
    this.checkDelivery()
  }

  /**
   * Check if delivery should happen (Doris via radio)
   * 
   * ORIGINELE LINGO (ParentScript 22 - Dir.ls, regels 60-63):
   * if ((tmpBuiltBoats = 2) or ((tmpBuiltBoats mod 4) = 0)) and (tmpBuiltBoats > 0) and not (the deliveryMade) then
   *   set makeDelivery to 1
   * 
   * Delivery momenten: boot 2, 4, 8, 12, 16, 20, ...
   */
  checkDelivery () {
    const user = this.game.mulle.user
    const tmpBuiltBoats = user.NrOfBuiltBoats || 0
    
    console.debug('[Boatyard] Checking delivery - Built boats:', tmpBuiltBoats, 'deliveryMade:', user.deliveryMade)
    
    if (QuayData.shouldMakeDelivery(tmpBuiltBoats, !!user.deliveryMade)) {
      console.debug('[Boatyard] Delivery triggered!')
      this.makeDelivery = true
      // BUG FIX: Removed 1000ms timer — original Lingo sets flag and loop handler processes it
    }
  }

  /**
   * Doris delivery dialogen (via radio)
   * ORIGINELE LINGO (ParentScript 22 - Dir.ls, regels 16-17)
   */
  // DORIS_BLUEPRINT_DIALOGUES and DORIS_PARTS_DIALOGUES removed — now from QuayData module

  /**
   * Delivery items per index
   * ORIGINELE LINGO: getParts(externalParts, #Delivery)
   * 
   * Formaat: Array van arrays. Elk item kan zijn:
   * - Een nummer (part ID) -> wordt als onderdeel toegevoegd
   * - Een string beginnend met 'Blueprint' -> wordt aan inventory toegevoegd
   * 
   * Index 1 = bij 2 boten, Index 2 = bij 4 boten, etc.
   * Delivery momenten: boot 2, 4, 8, 12, 16, 20...
   */
  static DELIVERY_ITEMS = [
    // Index 1 (2 boten gebouwd) - Kleine onderdelen
    [21, 22, 853],  // Onderdelen voor kleine boot + engine
    // Index 2 (4 boten gebouwd) - Blueprint2 voor Medium boten!
    ['Blueprint2'],
    // Index 3 (8 boten gebouwd) - Medium onderdelen
    [6, 7, 96, 121],
    // Index 4 (12 boten gebouwd) - Blueprint3 voor Large boten!
    ['Blueprint3'],
    // Index 5 (16 boten gebouwd) - Large onderdelen
    [122, 254, 255, 693],
    // Index 6 (20 boten gebouwd) - Meer onderdelen
    [695, 698, 700, 704],
    // Index 7 (24 boten gebouwd) - Luxe onderdelen
    [706, 854, 842, 844]
  ]

  /**
   * Do the delivery - Doris delivers parts or blueprints via radio
   * 
   * ORIGINELE LINGO (ParentScript 22 - Dir.ls, regels 168-198):
   * - Index berekening: tmpBuiltBoats=2 -> index=1, anders index = 1 + (tmpBuiltBoats / 4)
   * - Parts ophalen uit externalParts.Delivery[index]
   * - Als eerste item een symbol is (bijv. #Blueprint2): voeg toe aan inventory
   * - Anders: het zijn onderdelen die naar de werf gaan
   * - Doris praat via radio met passende dialoog
   */
  doDelivery () {
    const user = this.game.mulle.user
    const tmpBuiltBoats = user.NrOfBuiltBoats || 0
    
    const tmpIndex = QuayData.computeDeliveryIndex(tmpBuiltBoats)
    
    console.debug('[Boatyard] doDelivery - builtBoats:', tmpBuiltBoats, 'index:', tmpIndex)
    
    const result = QuayData.computeDeliveryResult(BoatyardState.DELIVERY_ITEMS, tmpIndex)
    
    if (result.type === 'none') {
      console.debug('[Boatyard] No delivery items for index', tmpIndex)
      this.makeDelivery = false
      this.OKToTalk = true
      return false
    }
    
    if (result.type === 'blueprint') {
      const blueprintId = result.items[0]
      if (!user.SeaInventory) user.SeaInventory = { items: {}, blueprints: {} }
      if (!user.SeaInventory.blueprints) user.SeaInventory.blueprints = {}
      user.SeaInventory.blueprints[blueprintId] = {}
      
      console.debug('[Boatyard] Delivery: Added blueprint to inventory:', blueprintId)
      
      if (result.setGotNewHull) {
        this.game.mulle.gMulleGlobals.setGotNewHull(true)
      }
      
      const randomDialogue = this.getRandomFromList(QuayData.DORIS_BLUEPRINT_LIST)
      this.showDialogue('Doris: Een nieuwe blauwdruk voor je!')
      this.radioTalk(randomDialogue, true)
    } else {
      // Parts delivery
      const givenPartIds = []
      result.items.forEach((partId, i) => {
        if (typeof partId !== 'number') return
        const pos = new Phaser.Point(100 + (i * 80), 420)
        this.game.mulle.user.addBoatPart('Quay', partId, pos, true)
        this.createJunkPart(partId, pos.x, pos.y)
        givenPartIds.push(partId)
        console.debug('[Boatyard] Delivery added part:', partId)
      })
      
      if (result.setGotNewParts) {
        this.game.mulle.gMulleGlobals.setGotNewParts(true)
      }
      
      const randomDialogue = this.getRandomFromList(QuayData.DORIS_PART_LIST)
      this.showDialogue('Doris: Nieuwe onderdelen voor je bezorgd!')
      this.radioTalk(randomDialogue, false)
      
      console.debug('[Boatyard] Delivery complete - gave', givenPartIds.length, 'parts:', givenPartIds)
    }
    
    if (result.setDeliveryMade) user.deliveryMade = true
    this.makeDelivery = false
    this.game.mulle.user.save()
    
    return true
  }

  /**
   * Check if the boat has changed since entering the boatyard
   * NOTE: Dit is NIET hoe het origineel werkt - in origineel wordt NrOfBuiltBoats
   * altijd verhoogd bij vertrek, ongeacht of de boot is gewijzigd
   * @returns {boolean}
   */
  hasBoatChanged () {
    const currentParts = this.game.mulle.user.Boat?.Parts || []
    if (currentParts.length !== this.enterParts.length)
      return true

    for (let i = 0; i < currentParts.length; i++) {
      if (currentParts[i] !== this.enterParts[i]) {
        console.debug('[Boatyard] Boat has changed, different parts', i, currentParts[i], this.enterParts[i])
        return true
      }
    }
    return false
  }

  /**
   * ORIGINELE LINGO dialoog lijsten (ParentScript 22 - Dir.ls, regels 14-15)
   * 
   * firstDialogList - Eerste keer op de werf:
   * ["04d010v0", "04d012v0", "04d047v0", "04d051v0", "04d052v0"]
   * 
   * genDialogList - Algemene willekeurige dialogen:
   * ["00d001v0", "00d002v0", "00d003v0", "00d004v0", "00d005v0", "04d001v0", "04d002v0", 
   *  "04d003v0", "04d004v0", "04d007v0", "04d013v0", "04d014v0", "04d015v0", "04d016v0", 
   *  "04d017v0", "04d018v0", "04d019v0", "04d020v0", "04d022v0", "04d023v0", "04d027v0", 
   *  "04d028v0", "04d029v0", "04d030v0", "04d032v0"]
   */
  // Dialog lists moved to QuayData module
  static FIRST_DIALOG_LIST = QuayData.FIRST_DIALOG_LIST
  static GEN_DIALOG_LIST = QuayData.GEN_DIALOG_LIST

  /**
   * ITEM #80: Mulle talk with priorities
   * Original Lingo (MulleQuayBH.ls lines 20-51):
   * on makeMulleTalk me, argAction, argExtraInfo
   *   case argAction of
   *     #NormalTalk: ...
   *     #InfoTalk: ...
   *     #PrioTalk: ...
   * 
   * @param {string} priority - Talk priority: 'NormalTalk', 'InfoTalk', or 'PrioTalk'
   * @param {string} sound - Sound to play
   */
  makeMulleTalk (priority, sound) {
    if (!this.mulleActor) return
    
    switch (priority) {
      case 'NormalTalk':
        // ITEM #80: NormalTalk - only speak if in Wait mode
        // BUG FIX #4: Mulle NormalTalk animation logic
        // Original Lingo (MulleQuayBH.ls lines 22-33):
        // if mode = #Wait then
        //   set OKToTalk to 0
        //   if random(2) = 1 then
        //     set mode to #Talk
        //   else
        //     set mode to #Talk
        //     set currentAnimChart to #TalkToMe
        // 
        // BUGGY ORIGINAL: Both branches set mode to #Talk! Only ELSE sets TalkToMe chart.
        // This means 50% chance to use TalkToMe, NOT "random(2) = 1 skips chart switch"
        if (this.mulleMode === 'wait') {
          this.OKToTalk = false
          this.mulleMode = 'talk'
          
          // BUG FIX #4: Match original buggy behavior - 50% to set TalkToMe (else branch)
          // Original has if/else but BOTH set mode=#Talk, only else sets chart
          if (Math.random() >= 0.5) { // Else branch (random(2) != 1)
            this.mulleCurrentAnimChart = 'TalkToMe'
            // BUG FIX #3: Animation chart switching not implemented
            if (this.mulleActor && this.mulleActor.setAnimChart) {
              this.mulleActor.setAnimChart('TalkToMe')
            }
          }
          
          this.playMulleSound(sound)
        }
        break
        
      case 'InfoTalk':
        // ITEM #80: InfoTalk - always use TalkToMe chart
        // Original Lingo (MulleQuayBH.ls lines 34-41):
        // if mode = #Wait then
        //   set currentAnimChart to #TalkToMe
        if (this.mulleMode === 'wait') {
          this.OKToTalk = false
          this.mulleMode = 'talk'
          
          // BUG FIX #3: Animation chart switching not implemented
          // ITEM #81: Always switch to TalkToMe for InfoTalk
          this.mulleCurrentAnimChart = 'TalkToMe'
          if (this.mulleActor && this.mulleActor.setAnimChart) {
            this.mulleActor.setAnimChart('TalkToMe')
          }
          
          this.playMulleSound(sound)
        }
        break
        
      case 'PrioTalk':
        // ITEM #80: PrioTalk - interrupts current talk
        // BUG FIX #16: Mulle PrioTalk mode check - should allow Talk mode too
        // Original Lingo (MulleQuayBH.ls lines 42-48):
        // if (mode = #Wait) or (mode = #Talk) then
        //   sendSprite(SP, #playAnimSound, EMPTY)  -- stop current sound
        //   set OKToTalk to 0
        if (this.mulleMode === 'wait' || this.mulleMode === 'talk') {
          // Stop current sound if talking
          if (this.mulleActor && this.mulleActor.currentSound) {
            this.mulleActor.currentSound.stop()
          }
          
          this.OKToTalk = false
          this.mulleMode = 'talk'
          this.playMulleSound(sound)
        }
        break
    }
  }

  /**
   * Play Mulle sound and handle completion
   */
   playMulleSound (sound) {
    if (!sound) return
    
    try {
      // playAudio() strips dirFile/ prefix automatically, so just pass the sound ID
      if (this.mulleActor && this.mulleActor.talk) {
        this.mulleActor.talk(sound, () => {
          this.onMulleTalkStopped()
        })
      } else {
        this.game.mulle.playAudio(sound)
        // Fallback: reset after 5 seconds
        this.game.time.events.add(5000, () => {
          this.onMulleTalkStopped()
        })
      }
    } catch (e) {
      console.warn('[Boatyard] Could not play Mulle sound:', sound, e)
      // BUG FIX #13: OKToTalk state management - ensure reset on error
      this.onMulleTalkStopped()
    }
  }

  /**
   * Handle Mulle talk stopped event
   * Original Lingo (MulleQuayBH.ls lines 75-96): on Stopped me
   */
   onMulleTalkStopped () {
    // BUG FIX #3: Animation chart switching not implemented
    // ITEM #81: Switch back to Quay animation chart after talking
    // Original Lingo (MulleQuayBH.ls lines 77-82):
    // if currentAnimChart = #TalkToMe then
    //   set currentAnimChart to #Quay
    //   sendSprite(SP, #setAnimChart, "Quay")
    if (this.mulleCurrentAnimChart === 'TalkToMe') {
      this.mulleCurrentAnimChart = 'Quay'
      if (this.mulleActor && this.mulleActor.setAnimChart) {
        this.mulleActor.setAnimChart('Quay')
      }
    }
    
    this.mulleMode = 'wait'
    this.OKToTalk = true
    
    // Return to idle animation
    if (this.mulleActor && this.mulleActor.animations) {
      this.mulleActor.animations.play('idle')
    }
  }

  /**
   * Mulle talks when clicked (user-initiated)
   * ORIGINELE LINGO: Mulle is de NPC op de scheepswerf (zelfde als bij auto's)
   * 
   * Uses genDialogList for random dialogue selection
   */
  mulleTalk () {
    // Don't interrupt if already talking
    if (this.mulleActor && this.mulleActor.isTalking) return

    // ORIGINELE LINGO: Random dialoog uit genDialogList
    const dialogList = BoatyardState.GEN_DIALOG_LIST
    const randomSound = dialogList[Math.floor(Math.random() * dialogList.length)]

    console.debug('[Mulle] Random dialogue:', randomSound)

    // Use NormalTalk priority for user clicks
    this.makeMulleTalk('NormalTalk', randomSound)
  }

  // Backwards compatibility - christinaTalk calls mulleTalk
  christinaTalk () {
    this.mulleTalk()
  }

  /**
   * Show a dialogue box with text
   * @param {string} text - The dialogue text to display
   */
  showDialogue (text) {
    // Remove existing dialogue if present
    if (this.dialogueBox) {
      this.dialogueBox.destroy()
    }
    if (this.dialogueText) {
      this.dialogueText.destroy()
    }

    // Create dialogue box
    const boxWidth = 500
    const boxHeight = 60
    const boxX = 320
    const boxY = 60

    this.dialogueBox = this.game.add.graphics(boxX, boxY)
    this.dialogueBox.beginFill(0x000000, 0.8)
    this.dialogueBox.drawRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 10)
    this.dialogueBox.endFill()

    this.dialogueText = this.game.add.text(boxX, boxY, text, {
      font: '14px Arial',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: boxWidth - 40,
      align: 'center'
    })
    this.dialogueText.anchor.setTo(0.5, 0.5)

    // Auto-hide after 4 seconds
    this.game.time.events.add(4000, () => {
      if (this.dialogueBox) {
        this.game.add.tween(this.dialogueBox).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
      }
      if (this.dialogueText) {
        this.game.add.tween(this.dialogueText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
      }
    })
  }

  /**
   * Show level up notification with unlocks
   * @param {number} newLevel - The new sea level reached (2-5)
   */
  showLevelUpNotification (newLevel) {
    const user = this.game.mulle.user
    const unlocks = user.getSeaLevelUnlocks(newLevel)

    // Create notification group
    const notification = this.game.add.group()
    notification.x = 320
    notification.y = 200

    // Background with golden border
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x003366, 0.95)
    bg.drawRoundedRect(-180, -80, 360, 160, 10)
    bg.endFill()
    bg.lineStyle(3, 0xffd700, 1)
    bg.drawRoundedRect(-180, -80, 360, 160, 10)
    notification.add(bg)

    // Level up star icon
    const star = this.game.add.graphics(-130, -50)
    star.beginFill(0xffd700, 1)
    // Draw a simple star shape
    for (let i = 0; i < 5; i++) {
      const angle = (i * 72 - 90) * Math.PI / 180
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
      if (i === 0) {
        star.moveTo(Math.cos(angle) * 20, Math.sin(angle) * 20)
      } else {
        star.lineTo(Math.cos(angle) * 20, Math.sin(angle) * 20)
      }
      star.lineTo(Math.cos(innerAngle) * 10, Math.sin(innerAngle) * 10)
    }
    star.endFill()
    notification.add(star)

    // Title
    const title = this.game.add.text(20, -50, `Level ${newLevel} Bereikt!`, {
      font: 'bold 22px Arial',
      fill: '#ffd700'
    })
    title.anchor.setTo(0.5, 0.5)
    notification.add(title)

    // Subtitle
    const subtitle = this.game.add.text(0, -20, 'Nieuwe content ontgrendeld:', {
      font: '14px Arial',
      fill: '#ffffff'
    })
    subtitle.anchor.setTo(0.5, 0.5)
    notification.add(subtitle)

    // List unlocks
    unlocks.forEach((unlock, i) => {
      const unlockText = this.game.add.text(0, 10 + i * 20, '- ' + unlock, {
        font: '13px Arial',
        fill: '#88ff88'
      })
      unlockText.anchor.setTo(0.5, 0.5)
      notification.add(unlockText)
    })

    // Animate in
    notification.alpha = 0
    notification.y = 250
    this.game.add.tween(notification)
      .to({ alpha: 1, y: 200 }, 500, Phaser.Easing.Back.Out, true)

    // Auto-hide after 4 seconds
    this.game.time.events.add(4000, () => {
      this.game.add.tween(notification)
        .to({ alpha: 0, y: 150 }, 500, Phaser.Easing.Back.In, true)
        .onComplete.add(() => {
          notification.destroy()
        })
    })
  }

  shutdown () {
    super.shutdown()

    // Save junk positions
    this.saveJunkPositions()

    // ITEM #75: Unregister radio handler
    // Original Lingo (Dir.ls line 94): stopReportRadioToMe(radioHandler, me)
    const radioHandler = this.game.mulle.gMulleGlobals?.radioHandler
    if (radioHandler) {
      radioHandler.stopReportRadioToMe(this)
      console.debug('[Boatyard] Unregistered from radio reports')
    }

    // ITEM #93: Set WhereFrom flag
    // Original Lingo (Dir.ls line 103): set the WhereFrom to "04"
    // Use Phaser state name, not Director movie ID
    this.game.mulle.whereFrom = 'boatyard'

    // Clean up Mulle idle animation timer
    if (this.mulleIdleTimer) {
      this.game.time.events.remove(this.mulleIdleTimer)
      this.mulleIdleTimer = null
    }

    // Clean up GoPee timer
    if (this.goPeeTimer) {
      this.game.time.events.remove(this.goPeeTimer)
      this.goPeeTimer = null
    }

    // Clean up Buffa timer
    if (this.buffaIdleTimer) {
      this.game.time.events.remove(this.buffaIdleTimer)
      this.buffaIdleTimer = null
    }

    // Clean up Figge timers and sounds
    if (this.figgeDelayTimer) {
      this.game.time.events.remove(this.figgeDelayTimer)
      this.figgeDelayTimer = null
    }
    if (this.figgeAnimTimer) {
      this.game.time.events.remove(this.figgeAnimTimer)
      this.figgeAnimTimer = null
    }
    if (this.figgeSoundId) {
      try {
        this.figgeSoundId.stop()
      } catch (e) {
        // Ignore
      }
      this.figgeSoundId = null
    }
    this.figgeActive = false

    // Clean up boatyard loop timer
    if (this.boatyardLoopTimer) {
      this.game.time.events.remove(this.boatyardLoopTimer)
      this.boatyardLoopTimer = null
    }

    if (this.lingoRuntime) {
      this.lingoRuntime.destroy()
      this.lingoRuntime = null
    }

    // Clean up actor reference
    if (this.game.mulle.actors.mulle) {
      this.game.mulle.actors.mulle = null
    }

    // Stop weather ambient sound
    if (this.weatherSound) {
      this.weatherSound.stop()
      this.weatherSound = null
    }

    // Clean up sky sprite and fallback graphics
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    // Clean up windmeter sprite
    if (this.windmeterSprite) {
      this.windmeterSprite.destroy()
      this.windmeterSprite = null
    }

    // Clean up water sprite (ITEM #90)
    if (this.waterSprite) {
      this.waterSprite.destroy()
      this.waterSprite = null
    }

    // Clean up toolbox sprite (ITEM #77)
    if (this.toolBoxSprite) {
      this.toolBoxSprite.destroy()
      this.toolBoxSprite = null
    }

    // Clean up BigRadio sprite (ITEM #72)
    if (this.bigRadioSprite) {
      this.bigRadioSprite.destroy()
      this.bigRadioSprite = null
    }

    // Clear cheats div
    const cheatsDiv = document.getElementById('cheats')
    if (cheatsDiv) {
      cheatsDiv.innerHTML = ''
    }

    this.game.sound.stopAll()
    console.debug('[Boatyard] Scene shutdown')
  }

  /**
   * Check if Peggy should give Vicky Vitamijn quest
   * Triggered when: "ondertussen" + "nieuwe motor" + "benzinetank"
   */
  checkPeggyQuest () {
    const user = this.game.mulle.user
    const boat = user.Boat

    // Check if quest already received
    if (boat.hasCache('#VickyQuestReceived')) {
      return
    }

    // Check for "ondertussen" cache flag
    const hasOndertussen = boat.hasCache('#Ondertussen')

    // Check for engine (nieuwe motor)
    const hasEngine = boat.getProperty('engine') > 0

    // Check for fuel tank (benzinetank) - need to check properties
    const hasFuelTank = boat.hasPartWithProperty('loadcapacity', 1) || boat.hasCache('#FuelTank')

    console.debug('[Boatyard] Peggy Quest check - ondertussen:', hasOndertussen, 'engine:', hasEngine, 'fuel tank:', hasFuelTank)

    // Give quest if all conditions met
    if (hasOndertussen && hasEngine && hasFuelTank) {
      this.givePeggyQuest()
    }
  }

  /**
   * Give Vicky Vitamijn quest from Peggy
   */
  givePeggyQuest () {
    const user = this.game.mulle.user

    // Add quest cache flag
    user.Boat.addCache('#VickyQuestReceived')

    // Show quest notification
    this.showNotification(
      'Nieuwe Quest: Vicky Vitamijn!',
      'Vicky vraagt of je haar kweek water kunt geven op Algeneiland.'
    )

    // Play quest received sound
    this.game.mulle.playAudio('boten_04.DXR/04d001v0')

    console.debug('[Boatyard] Peggy gave Vicky Vitamijn quest')
  }

  /**
   * Show notification message
   * @param {string} title - Notification title
   * @param {string} message - Notification message
   */
  showNotification (title, message) {
    const notification = this.game.add.group()
    notification.x = 320
    notification.y = 200

    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x0066AA, 0.9)
    bg.lineStyle(2, 0xffd700, 1)
    bg.drawRoundedRect(-200, -50, 400, 100, 10)
    bg.endFill()
    notification.add(bg)

    const titleText = this.game.add.text(0, -30, title, {
      font: 'bold 18px Arial',
      fill: '#ffd700'
    })
    titleText.anchor.setTo(0.5, 0.5)
    notification.add(titleText)

    const msgText = this.game.add.text(0, 10, message, {
      font: '14px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 380
    })
    msgText.anchor.setTo(0.5, 0.5)
    notification.add(msgText)

    notification.alpha = 0
    this.game.add.tween(notification)
      .to({ alpha: 1 }, 500, Phaser.Easing.Back.Out, true)

    this.game.time.events.add(5000, () => {
      this.game.add.tween(notification)
        .to({ alpha: 0 }, 500, Phaser.Easing.Back.In, true)
        .onComplete.add(() => {
          notification.destroy()
        })
    })
  }

  /**
   * Save junk part positions to user data
   * Original Lingo: Parts on boatyard floor are stored in #Quay
   */
  saveJunkPositions () {
    if (!this.junkParts) return

    const positions = {}
    const seenIds = {}
    this.junkParts.forEach((part) => {
      if (part.part_id) {
        // Handle duplicate part IDs by appending _2, _3, etc.
        let key = String(part.part_id)
        if (seenIds[key]) {
          seenIds[key]++
          key = `${part.part_id}_${seenIds[key]}`
        } else {
          seenIds[key] = 1
        }
        positions[key] = { x: part.x, y: part.y }
      }
    })

    if (!this.game.mulle.user.BoatJunk) {
      this.game.mulle.user.BoatJunk = {}
    }
    this.game.mulle.user.BoatJunk.Quay = positions
    this.game.mulle.saveData()

    console.debug('[Boatyard] Saved', Object.keys(positions).length, 'junk positions to Quay')
  }
}

// ============================================================================
// LINGO CONTRACT REFERENCES — shared_00 globals
// Audio, inventory, and state parity with original Lingo scripts.
// Sources: RadioHandler.ls, DragScript.ls, BoatHandler.ls,
// ExtraBoatDrivingStuff.ls, ToolBoxBH.ls, JunkViewHandler.ls, LevelHandler.ls
// ============================================================================

// RadioHandler weather dialogue audio (ParentScript 47 - RadioHandler.ls)
// Wind direction dialogues (8 compass directions)
const RADIO_WIND_DIRECTION = [
  '00d039v0', '00d041v0', '00d042v0', '00d043v0',
  '00d044v0', '00d045v0', '00d046v0', '00d048v0',
]

// Wind speed dialogues
const RADIO_WIND_SPEED = ['00d049v0', '00d050v0', '00d051v0', '00d072v0']

// Weather type dialogues
const RADIO_WEATHER_TYPE = ['00d053v0', '00d054v0', '00d055v0', '00d073v0']

// Radio intro
const RADIO_INTRO = '00d056v0'

// Radio outro options
const RADIO_OUTRO = ['00d067v0', '00d069v0', '00d071v0']

// Radio jingles
const RADIO_JINGLES = ['00d074v0', '00d076v0', '00d077v0', '00d078v0', '00d079v0']

// JunkViewHandler audio (ParentScript 27)
const JUNK_AUDIO = '03d015v0'

// DragScript audio (ParentScript 24 - DragScript.ls)
const DRAG_AUDIO = {
  SNAP_FAIL:   '04d009v0',
  PLACE_OK_1:  '04d024v0',
  PLACE_OK_2:  '04d025v0',
  PLACE_OK_3:  '04d026v0',
}

// BoatHandler audio (ParentScript 28 - BoatHandler.ls)
const BOAT_HANDLER_AUDIO = {
  OVERLOAD:    '04d048v0',
  UNSTABLE:    '04d056v0',
}

// ExtraBoatDrivingStuff engine start sounds (MovieScript 147)
const ENGINE_START_SOUNDS = [
  '05e018v1', '05e018v0', '05e030v0', '05e056v0',
  '05e034v0', '05e022v0', '05e053v0', '05e026v0',
]

// ToolBoxBH inventory item sounds (BehaviorScript 86)
const TOOLBOX_ITEM_SOUNDS = {
  Fishingrod: '09d058v0',
  Bible:      '09d059v0',
  Suit:       '09d060v0',
  helmet:     '09d061v0',
  Swimring:   '09d062v0',
  DoctorBag:  '09d063v0',
  Diary:      '09d064v0',
}

// Other shared audio
const SHARED_AUDIO = '20d163v0'

// Radio mission broadcast dialogues
const RADIO_MISSION_DIALOGUES = [
  '50d001v0', '50d002v0', '50d003v0', '50d004v0', '50d005v0',
  '50d006v0', '50d007v0', '50d008v0', '50d009v0', '50d013v0', '50d014v0',
]

// Shared inventory items
const SHARED_INVENTORY = ['DrivenTimes', 'tmpInventory', 'tmpItem']

// Shared state fields (gMulleGlobals properties)
const SHARED_STATE = {
  HullBackOffset: null,
  HullFrontOffset: null,
  hullBackInsideOffset: null,
  hullFrontInsideOffset: null,
  junkPileHandlers: null,
  levelHandler: null,
  mouseMaster: null,
  rudderBackOffset: null,
  rudderFrontOffset: null,
}

export default BoatyardState
