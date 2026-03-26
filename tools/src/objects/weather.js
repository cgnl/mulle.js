/**
 * MulleWeather - Weather System for Sea World
 * @module objects/weather
 * 
 * Implements complete weather system from original Lingo files:
 * - Weather.ls (4 weather types, dynamic changes, forecasts)
 * - Wind.ls (wind velocity point calculation, visual stroot/windvane)
 * - Waves.ls (wave spawn lines, wave sprites, collision detection)
 * 
 * Features implemented (missing.md #125-136):
 * #125 - 4 weather types with properties
 * #126 - Level-based weather restrictions (possibleWeatherInLevel)
 * #127 - Dynamic weather changes (3000-6000 ticks)
 * #128 - Weather forecasts via radio
 * #129 - Wind speed per weather type
 * #130 - Wind direction per weather type
 * #131 - Weather report to objects
 * #132 - Sky sprite per weather type
 * #133 - Wind velocity point calculation
 * #134 - Wave spawn lines (16 directions)
 * #135 - Visual wave sprites (6 sprites)
 * #136 - Wave collision detection (hitWave when bigWaveTot > 7000)
 */

import MulleSprite from './sprite'
import Precipitation from './weather/Precipitation'

/**
 * Weather type definitions
 * Type 1 = Calm (light wind from N)
 * Type 2 = Variable (light winds from multiple directions)
 * Type 3 = Moderate (moderate winds from multiple directions)
 * Type 4 = Storm (strong winds from many directions)
 */
const WEATHER_TYPES = {
  CALM: 1,
  VARIABLE: 2,
  MODERATE: 3,
  STORM: 4
}

/**
 * Wind information per weather type
 * From Weather.ls line 7:
 * windInfo = [[#Speeds: [1], #Directions: [12]], 
 *             [#Speeds: [0, 1, 2], #Directions: [16, 2, 6, 8, 10]], 
 *             [#Speeds: [0, 1, 2, 3], #Directions: [16, 2, 6, 8, 10]], 
 *             [#Speeds: [0, 2, 3], #Directions: [2, 4, 4, 6, 8, 10, 12, 12, 14, 16]]]
 */
const WIND_INFO = [
  // Type 1: Calm - light wind from north (direction 12)
  {
    speeds: [1],
    directions: [12]
  },
  // Type 2: Variable - light winds from multiple directions
  {
    speeds: [0, 1, 2],
    directions: [16, 2, 6, 8, 10]
  },
  // Type 3: Moderate - moderate winds
  {
    speeds: [0, 1, 2, 3],
    directions: [16, 2, 6, 8, 10]
  },
  // Type 4: Storm - strong winds from many directions
  {
    speeds: [0, 2, 3],
    directions: [2, 4, 4, 6, 8, 10, 12, 12, 14, 16]
  }
]

/**
 * Possible weather types per level
 * From Weather.ls line 6:
 * possibleWeatherInLevel = [[1], [1], [1,2], [3,4], [1,2,3,4], [1,2,3,4]]
 */
const POSSIBLE_WEATHER_IN_LEVEL = [
  [1],           // Level 1: Only calm
  [1],           // Level 2: Only calm
  [1, 2],        // Level 3: Calm or variable
  [3, 4],        // Level 4: Moderate or storm
  [1, 2, 3, 4],  // Level 5: All weather types
  [1, 2, 3, 4]   // Level 6: All weather types
]

/**
 * Wave spawn lines - 16 direction-based spawn positions
 * From Waves.ls: spawnLines = value(the text of member "spawnLines")
 * Each spawn line has a midpoint and a limit vector for randomization
 * 
 * Structure: [midPoint, limitVector]
 * - midPoint: Base spawn position
 * - limitVector: Direction vector for randomization
 */
const SPAWN_LINES = [
  // Direction 1 (SSW) - bottom left
  [{ x: 71, y: 441 }, { x: 1, y: 0 }],
  // Direction 2 (SW)
  [{ x: 40, y: 404 }, { x: 1, y: 1 }],
  // Direction 3 (WSW)
  [{ x: 40, y: 346 }, { x: 0, y: 1 }],
  // Direction 4 (W) - left center
  [{ x: 40, y: 240 }, { x: 0, y: 1 }],
  // Direction 5 (WNW)
  [{ x: 40, y: 134 }, { x: 0, y: 1 }],
  // Direction 6 (NW)
  [{ x: 40, y: 76 }, { x: 1, y: 1 }],
  // Direction 7 (NNW)
  [{ x: 71, y: 39 }, { x: 1, y: 0 }],
  // Direction 8 (N) - top center
  [{ x: 320, y: 39 }, { x: 1, y: 0 }],
  // Direction 9 (NNE)
  [{ x: 569, y: 39 }, { x: 1, y: 0 }],
  // Direction 10 (NE)
  [{ x: 600, y: 76 }, { x: 1, y: 1 }],
  // Direction 11 (ENE)
  [{ x: 600, y: 134 }, { x: 0, y: 1 }],
  // Direction 12 (E) - right center
  [{ x: 600, y: 240 }, { x: 0, y: 1 }],
  // Direction 13 (ESE)
  [{ x: 600, y: 346 }, { x: 0, y: 1 }],
  // Direction 14 (SE)
  [{ x: 600, y: 404 }, { x: 1, y: 1 }],
  // Direction 15 (SSE)
  [{ x: 569, y: 441 }, { x: 1, y: 0 }],
  // Direction 16 (S) - bottom center
  [{ x: 320, y: 441 }, { x: 1, y: 0 }]
]

/**
 * Amplitude list for wave calculations
 * From Waves.ls: amplitudeList = value(the text of member "AmplitudeList")
 * 100 values defining wave height at different positions in the wave period
 */
const AMPLITUDE_LIST = [
  0, 10, 20, 29, 39, 48, 57, 65, 73, 80,
  87, 93, 98, 102, 105, 108, 110, 111, 111, 110,
  108, 105, 102, 98, 93, 87, 80, 73, 65, 57,
  48, 39, 29, 20, 10, 0, -10, -20, -29, -39,
  -48, -57, -65, -73, -80, -87, -93, -98, -102, -105,
  -108, -110, -111, -111, -110, -108, -105, -102, -98, -93,
  -87, -80, -73, -65, -57, -48, -39, -29, -20, -10,
  0, 10, 20, 29, 39, 48, 57, 65, 73, 80,
  87, 93, 98, 102, 105, 108, 110, 111, 111, 110,
  108, 105, 102, 98, 93, 87, 80, 73, 65, 57
]

/**
 * Main Weather System
 */
class MulleWeather {
  /**
   * Create weather system
   * @param {Phaser.Game} game - Game instance
   * @param {Object} state - Current scene state
   */
  constructor(game, state) {
    this.game = game
    this.state = state

    // Weather state
    this.weatherType = WEATHER_TYPES.CALM
    this.windSpeed = 0
    this.windDirection = 1

    // Next weather forecast
    this.nextWeather = {}
    this.forecastCounter = 0
    this.changeWaitCounter = 0
    this.reportTime = 0
    this.realChange = 0

    // Radio reporting
    this.reportObject = null

    // Wind system
    this.wind = null

    // Wave system
    this.waves = null

    // Sky sprite
    this.skySprite = null

    // Precipitation system
    this.precipitation = new Precipitation(game)

    // Initialize weather
    this.initialize()
  }

  /**
   * Initialize weather system
   */
  initialize() {
    console.log('[MulleWeather] Initializing weather system')

    // Create wind system
    this.wind = new MulleWind(this.game, this.state)

    // Create wave system
    this.waves = new MulleWaves(this.game, this.state)

    // BUG FIX #4.4: Randomize initial weather based on level
    // Original Lingo (Weather.ls:4-5) sets weatherType in new() based on interpretList logic
    // Instead of always starting at CALM, select random weather for current level
    if (this.game.mulle.user && this.game.mulle.user.level) {
      const level = this.game.mulle.user.getSeaLevel ? this.game.mulle.user.getSeaLevel() : 1
      const levelIndex = Math.min(level - 1, POSSIBLE_WEATHER_IN_LEVEL.length - 1)
      const possibleWeather = POSSIBLE_WEATHER_IN_LEVEL[levelIndex]

      // Pick random weather type from allowed types for this level
      const randomType = possibleWeather[Math.floor(Math.random() * possibleWeather.length)]
      this.weatherType = randomType

      // Set initial wind speed and direction based on random type
      const windInfo = WIND_INFO[randomType - 1]
      this.windSpeed = windInfo.speeds[Math.floor(Math.random() * windInfo.speeds.length)]
      this.windDirection = windInfo.directions[Math.floor(Math.random() * windInfo.directions.length)]

      console.log('[MulleWeather] Initial weather randomized:', {
        level: level,
        type: this.weatherType,
        speed: this.windSpeed,
        direction: this.windDirection
      })
    }

    // Set initial weather
    // BUG FIX #4.1: Weather timing 60x too fast - multiply by 60 to convert seconds to frames
    this.setNextWeather(null, (3000 + Math.floor(Math.random() * 3000)) * 60)  // 50-100 minutes in frames

    // Sky sprite will be created when scene is ready (via ensureSpritesInWorld)
    // Don't create it here because game.world may not exist yet during LoadState
  }

  /**
   * Create sky sprite based on weather type
   * From Weather.ls setSky():
   * tmpSky = "00b0" & string(10 + weatherType) & "v0"
   * Sky sprites: 00b011v0 (type 1), 00b012v0 (type 2), 00b013v0 (type 3), 00b014v0 (type 4)
   */
  createSkySprite() {
    if (!this.state) return

    // CRITICAL: Check if game.world exists BEFORE creating sprite
    // Phaser.Sprite constructor requires game.world to be initialized
    if (!this.game.world) {
      console.warn('[MulleWeather] Cannot create sky sprite - game.world not ready')
      return
    }

    // Try to create sky sprite
    // Member names: 00b011v0, 00b012v0, 00b013v0, 00b014v0
    const skyMember = `00b0${10 + this.weatherType}v0`

    // Create sprite at back layer
    this.skySprite = new MulleSprite(this.game, 320, 240)

    // Try to load from shared atlas
    let loaded = false
    if (this.game.cache.checkImageKey('shared-sprites-0')) {
      try {
        // Sky sprites should be in shared atlas
        this.skySprite.loadTexture('shared-sprites-0', skyMember)
        loaded = true
      } catch (e) {
        console.warn('[MulleWeather] Could not load sky from atlas:', e)
      }
    }

    if (!loaded) {
      // Try director member
      loaded = this.skySprite.setDirectorMember('shared_00.DXR', skyMember)
    }

    if (loaded) {
      // Only add to game world if it exists (scene is ready)
      if (this.game.add && this.game.world) {
        this.game.add.existing(this.skySprite)
        this.game.world.sendToBack(this.skySprite)
        console.log('[MulleWeather] Created sky sprite:', skyMember)
      } else {
        console.log('[MulleWeather] Sky sprite created but not added to world yet (scene not ready)')
      }
    } else {
      console.warn('[MulleWeather] Could not create sky sprite, using default')
      this.skySprite.destroy()
      this.skySprite = null
    }
  }

  /**
   * Update sky sprite for current weather type
   */
  updateSkySprite() {
    if (!this.skySprite) {
      this.createSkySprite()
      return
    }

    const skyMember = `00b0${10 + this.weatherType}v0`

    // Try to update texture using boten_shared atlases
    // These members are split between -0 and -1
    // setDirectorMember searches all atlases, but needs the correct dirFile
    const dirFile = 'boten_00.CXT'

    if (!this.skySprite.setDirectorMember(dirFile, skyMember)) {
      // Fallback: try without dirFile to search all atlases for the member
      this.skySprite.setDirectorMember(skyMember)
    }

    console.log('[MulleWeather] Updated sky sprite:', skyMember)
  }

  /**
   * Update precipitation (rain/snow) visuals
   * Called from update() loop
   */
  updatePrecipitation() {
    if (this.precipitation) {
      this.precipitation.update(this.weatherType)
    }
  }

  /**
   * Destroy weather system and cleanup sprites
   */
  destroy() {
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }

    if (this.precipitation) {
      this.precipitation.kill()
      this.precipitation = null
    }

    if (this.wind && typeof this.wind.destroy === 'function') {
      this.wind.destroy()
    }

    if (this.waves && typeof this.waves.destroy === 'function') {
      this.waves.destroy()
    }
  }

  /**
   * Ensure all sprites are added to game world
   * Called when scene is ready
   */
  ensureSpritesInWorld() {
    // Create sky sprite if it doesn't exist yet
    if (!this.skySprite && this.game.add && this.game.world) {
      this.createSkySprite()
    }

    // Ensure sky sprite is in world
    if (this.skySprite && this.game.add && this.game.world && !this.skySprite.parent) {
      this.game.add.existing(this.skySprite)
      this.game.world.sendToBack(this.skySprite)
      console.log('[MulleWeather] Added sky sprite to world')
    }

    // Ensure wind sprites are in world
    if (this.wind) {
      this.wind.ensureSpriteInWorld()
    }

    // Ensure wave sprites are in world
    if (this.waves) {
      this.waves.ensureSpritesInWorld()
    }
  }

  /**
   * Update weather system (call every tick/frame)
   * From Weather.ls loop()
   */
  update() {
    // Weather change countdown (Weather.ls:27-46)
    if (this.changeWaitCounter === 0) {
      // Apply next weather
      this.weatherType = this.nextWeather.type
      this.windDirection = this.nextWeather.direction
      this.windSpeed = this.nextWeather.speed

      // Report to radio handler
      if (this.reportObject) {
        const report = Object.assign({}, this.nextWeather, {
          timeLeft: this.changeWaitCounter
        })
        this.reportObject.weatherReport(report)
      }

      // Update sky sprite
      this.updateSkySprite()

      // Update wind and waves with speedFactor applied (WeatherRenderer.ls:47)
      const adjustedSpeed = this.waves.speedFactor * this.windSpeed / 100
      this.wind.slowChange(adjustedSpeed, this.windDirection, 30)
      this.waves.setDirection(this.windDirection, adjustedSpeed)

      // Schedule next weather change
      // BUG FIX #4.1: Weather timing 60x too fast - multiply by 60 to convert seconds to frames
      this.setNextWeather(null, (3000 + Math.floor(Math.random() * 3000)) * 60)  // 50-100 minutes in frames

      console.log('[MulleWeather] Weather changed:', {
        type: this.weatherType,
        speed: this.windSpeed,
        adjustedSpeed: adjustedSpeed,
        speedFactor: this.waves.speedFactor,
        direction: this.windDirection
      })
    } else if (this.changeWaitCounter === this.reportTime) {
      // Forecast report
      if (this.reportObject && this.realChange) {
        const report = Object.assign({}, this.nextWeather, {
          timeLeft: this.changeWaitCounter
        })
        this.reportObject.weatherReport(report)
      }
    }

    this.changeWaitCounter = Math.max(0, this.changeWaitCounter - 1)

    // Update wind and waves
    if (this.wind) {
      this.wind.update()
    }
    if (this.waves) {
      this.waves.update()
    }

    // Update precipitation (rain/snow)
    this.updatePrecipitation()
  }

  /**
   * Set next weather forecast
   * @param {Object} argWeather - Weather definition or null for random
   * @param {number} argRandomWait - Ticks until change
   */
  setNextWeather(argWeather, argRandomWait) {
    this.interpretList(argWeather)

    if (argRandomWait) {
      // BUG FIX #4.5: Forecast timing off by 1
      // Original Lingo uses 1-based random(): random(n) returns 1 to n inclusive
      // JavaScript Math.random() * n returns 0 to n-1, so add 1 to match Lingo
      this.reportTime = Math.floor(argRandomWait / 4) + Math.floor(Math.random() * (argRandomWait / 4)) + 1
      this.changeWaitCounter = argRandomWait
    } else {
      this.changeWaitCounter = 0
      // Apply immediately - call update() to trigger immediate application
      this.update()
    }
  }

  /**
   * Interpret weather list to determine next weather
   * From Weather.ls interpretList()
   * @param {Object} argWeather - Weather definition
   */
  interpretList(argWeather) {
    this.realChange = 0

    // Default: all new
    if (!argWeather) {
      argWeather = {
        type: 'new',
        speed: 'new',
        direction: 'new'
      }
    }

    // Determine weather type
    let tmpType = argWeather.type
    if (!tmpType) {
      tmpType = this.weatherType
    } else if (tmpType === 'new') {
      // Get level
      const level = this.game.mulle.user ? this.game.mulle.user.getSeaLevel() : 1
      const levelIndex = Math.min(level - 1, POSSIBLE_WEATHER_IN_LEVEL.length - 1)
      let tmpPossibleWeather = POSSIBLE_WEATHER_IN_LEVEL[levelIndex].slice()
      const tmpSafeRemember = tmpPossibleWeather[0]

      // Remove current weather type
      const index = tmpPossibleWeather.indexOf(this.weatherType)
      if (index !== -1) {
        tmpPossibleWeather.splice(index, 1)
      }

      // If empty, use safe default
      if (tmpPossibleWeather.length === 0) {
        tmpPossibleWeather = [tmpSafeRemember]
      } else {
        this.realChange++
      }

      // Pick random
      tmpType = tmpPossibleWeather[Math.floor(Math.random() * tmpPossibleWeather.length)]
    }

    // Get wind info for this type
    const windInfo = WIND_INFO[tmpType - 1]

    // Determine wind speed
    let tmpWindSpeed = argWeather.speed
    if (tmpWindSpeed === 'new') {
      let tmpSpeeds = windInfo.speeds.slice()
      const tmpSafeRemember = tmpSpeeds[0]

      // Remove current speed
      const index = tmpSpeeds.indexOf(this.windSpeed)
      if (index !== -1) {
        tmpSpeeds.splice(index, 1)
      }

      if (tmpSpeeds.length === 0) {
        tmpSpeeds = [tmpSafeRemember]
      } else {
        this.realChange++
      }

      tmpWindSpeed = tmpSpeeds[Math.floor(Math.random() * tmpSpeeds.length)]
    } else if (!tmpWindSpeed) {
      tmpWindSpeed = this.windSpeed
    }

    // Determine wind direction
    let tmpWindDirection = argWeather.direction
    if (tmpWindDirection === 'new') {
      let tmpDirs = windInfo.directions.slice()
      const tmpSafeRemember = tmpDirs[0]

      // Remove current direction
      const index = tmpDirs.indexOf(this.windDirection)
      if (index !== -1) {
        tmpDirs.splice(index, 1)
      }

      if (tmpDirs.length === 0) {
        tmpDirs = [tmpSafeRemember]
      } else {
        this.realChange++
      }

      tmpWindDirection = tmpDirs[Math.floor(Math.random() * tmpDirs.length)]
    } else if (!tmpWindDirection) {
      tmpWindDirection = this.windDirection
    }

    // Store next weather
    this.nextWeather = {
      type: tmpType,
      speed: tmpWindSpeed,
      direction: tmpWindDirection
    }
  }

  /**
   * Get current weather type
   * @returns {number} Weather type (1-4)
   */
  getType() {
    return this.weatherType
  }

  /**
   * Get current wind speed
   * @returns {number} Wind speed (0-3)
   */
  getWindSpeed() {
    return this.windSpeed
  }

  /**
   * Get current wind direction
   * @returns {number} Wind direction (1-16)
   */
  getWindDirection() {
    return this.windDirection
  }

  /**
   * Get coming weather (forecast)
   * @returns {Object} Next weather
   */
  getComingWeather() {
    if (this.changeWaitCounter < this.reportTime) {
      return this.nextWeather
    } else {
      return {
        type: this.weatherType,
        direction: this.windDirection,
        speed: this.windSpeed
      }
    }
  }

  /**
   * Register object for weather reports
   * @param {Object} argObj - Object to receive reports
   */
  reportWeatherToMe(argObj) {
    this.reportObject = argObj
  }

  /**
   * Get wind velocity point for drift calculations
   * @returns {Phaser.Point} Velocity vector
   */
  getWindVelPoint() {
    if (!this.wind) {
      return new Phaser.Point(0, 0)
    }
    return this.wind.getVelPoint()
  }

  /**
   * Get wave information for boat collision
   * @param {Phaser.Point} center - Boat center
   * @param {number} direction - Boat direction
   * @param {Array} corners - Boat corner points
   * @returns {Array} [avgAlt, frontBackInclination, sideInclination]
   */
  getWaveInfo(center, direction, corners) {
    if (!this.waves) {
      return [0, 0, 0]
    }
    return this.waves.getTopoInfo(center, direction, corners)
  }

  /**
   * Set corner points for wave collision
   * @param {Array} corners - Corner points array
   */
  setCornerPoints(corners) {
    if (this.waves) {
      this.waves.setCornerPoints(corners)
    }
  }

  /**
   * Change map settings (pass through to waves)
   * @param {string} argHide - Hide water sprite
   * @param {number} argWindSpeedFactor - Speed factor multiplier
   */
  changeMap(argHide, argWindSpeedFactor) {
    if (this.waves) {
      if (typeof this.waves.changeMap === 'function') {
        this.waves.changeMap(argHide, argWindSpeedFactor)
      }

      // Re-apply current weather with new speed factor
      const adjustedSpeed = this.waves.speedFactor * this.windSpeed / 100
      this.wind.change(adjustedSpeed, this.windDirection)
      this.waves.setDirection(this.windDirection, adjustedSpeed)

      console.log('[MulleWeather] Map changed - speedFactor:', this.waves.speedFactor)
    }
  }

  /**
   * Destroy weather system
   */
  destroy() {
    if (this.wind) {
      this.wind.destroy()
      this.wind = null
    }

    if (this.waves) {
      this.waves.destroy()
      this.waves = null
    }

    if (this.precipitation) {
      this.precipitation.kill()
      this.precipitation = null
    }

    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }

    this.reportObject = null
    this.state = null
  }
}

/**
 * Wind System
 * From Wind.ls
 */
class MulleWind {
  constructor(game, state) {
    this.game = game
    this.state = state

    // Wind state
    this.speed = 0
    this.direction = 15 * 100  // Direction * 100 for precision
    this.vel = new Phaser.Point(0, 0)

    // Slow change animation
    this.changeTime = 0
    this.speedStep = 0
    this.directionStep = 0
    this.toSpeed = 0
    this.toDirection = 0

    // Visual stroot sprite (windvane)
    this.strootSprite = null
    this.firstFrame = -1
    this.smallChange = 0
    this.smallChangeWait = 0

    // Stroot sprite will be created when scene is ready (via ensureSpriteInWorld)
    // Don't create it here because game.world may not exist yet during LoadState

    // Register with loopMaster (from Wind.ls:13)
    // Original: addObject(the loopMaster of gMulleGlobals, me)
    if (this.game.mulle && this.game.mulle.loopMaster) {
      this.game.mulle.loopMaster.addObject(this)
      console.log('[MulleWind] Registered with loopMaster')
    } else {
      console.warn('[MulleWind] loopMaster not available during initialization')
    }
  }

  /**
   * Create stroot (windvane) sprite
   * From Wind.ls: firstFrame = -1 + the number of member "strut0000"
   * Sprite frames: strut0000-strut0127 (128 frames = 4 speeds * 32 directions)
   */
  createStrootSprite() {
    // The stroot sprite shows wind direction and speed
    // It's a windvane that rotates based on wind

    // CRITICAL: Check if game.world exists BEFORE creating sprite
    // Phaser.Sprite constructor requires game.world to be initialized
    if (!this.game.world) {
      console.warn('[MulleWind] Cannot create stroot sprite - game.world not ready')
      return
    }

    // Try to create sprite
    this.strootSprite = new MulleSprite(this.game, 320, 100)

    // Determine first frame number
    // In original: member "strut0000" is member #509 in boten_05.DXR
    // Frame 0 corresponds to strut0000
    this.firstFrame = 0

    // Try to load strut0000 sprite (member 509)
    let loaded = false
    if (this.game.cache.checkImageKey('strut0000')) {
      try {
        this.strootSprite.loadTexture('strut0000')
        loaded = true
        console.log('[MulleWind] Loaded strut0000 sprite')
      } catch (e) {
        console.warn('[MulleWind] Could not load strut0000:', e.message)
      }
    }

    if (loaded) {
      // Only add to game world if it exists (scene is ready)
      if (this.game.add && this.game.world) {
        this.game.add.existing(this.strootSprite)
        console.log('[MulleWind] Created stroot sprite')
      } else {
        // Scene not ready yet - sprite will be added later when needed
        console.log('[MulleWind] Sprite created but not added to world yet (scene not ready)')
      }
    } else {
      // Stroot (windvane) sprite not available - create simple placeholder
      this.strootSprite.destroy()
      this.strootSprite = null

      // Create simple wind direction indicator using graphics
      this.createSimpleWindIndicator()
    }
  }

  /**
   * Create simple wind indicator when stroot sprite is not available
   * Shows wind direction with a simple arrow graphic
   */
  createSimpleWindIndicator() {
    // Only create if game.add is available
    if (!this.game.add || !this.game.world) {
      console.log('[MulleWind] Cannot create wind indicator - scene not ready')
      return
    }

    // Create graphics object for wind arrow
    const graphics = this.game.add.graphics(320, 100)

    // Draw simple arrow pointing in wind direction
    graphics.lineStyle(2, 0x0000FF, 1)
    graphics.beginFill(0x0000FF, 0.8)

    // Arrow shaft
    graphics.moveTo(0, 0)
    graphics.lineTo(0, -30)

    // Arrow head
    graphics.lineTo(-5, -25)
    graphics.moveTo(0, -30)
    graphics.lineTo(5, -25)

    graphics.endFill()

    this.windIndicator = graphics
    console.log('[MulleWind] Created simple wind indicator placeholder')
  }

  /**
   * Ensure sprite is added to game world
   * Called when scene is ready
   */
  ensureSpriteInWorld() {
    // Create sprite if it doesn't exist yet
    if (!this.strootSprite && this.game.add && this.game.world) {
      this.createStrootSprite()
    }

    if (this.strootSprite && this.game.add && this.game.world) {
      // Check if sprite is already in world
      if (!this.strootSprite.parent) {
        this.game.add.existing(this.strootSprite)
        console.log('[MulleWind] Added stroot sprite to world')
      }
    }
  }

  /**
   * Update wind system
   */
  update() {
    // Slow change animation
    if (this.changeTime) {
      this.speed = this.speed + this.speedStep
      this.direction = this.direction + this.directionStep
      this.changeTime--

      if (this.changeTime === 0) {
        this.speed = this.toSpeed
        this.direction = this.toDirection
      }
    }

    // Calculate velocity point
    const tmpDirection = this.correctDirection((this.direction / 100) + 8)
    this.vel = this.getVelPointForDirection(tmpDirection).multiply(this.speed, this.speed).divide(100, 100)

    // Update stroot sprite
    this.updateStrootSprite()
  }

  /**
   * Update stroot sprite based on current wind
   */
  updateStrootSprite() {
    // Update simple indicator if no sprite available
    if (!this.strootSprite && this.windIndicator) {
      // Rotate arrow based on wind direction (direction is in hundredths of degrees)
      const angle = (this.direction / 100) * (Math.PI / 180)
      this.windIndicator.rotation = angle
      return
    }

    if (!this.strootSprite) return

    // Determine picture offset based on speed
    let tmpPicOffset = 0
    if (this.speed >= 300) {
      tmpPicOffset = 0
    } else if (this.speed >= 200) {
      tmpPicOffset = 1
    } else if (this.speed >= 100) {
      tmpPicOffset = 2
    } else {
      tmpPicOffset = 3
    }

    // Small random variation
    if (this.smallChangeWait <= 0) {
      this.smallChangeWait = Math.floor(Math.random() * 6)
      this.smallChange = Math.floor(Math.random() * 2)
    } else {
      this.smallChangeWait--
    }

    // Calculate frame
    // Original: member (firstFrame + (tmpPicOffset * 32) + (correctDirection(tmpDirection + 9) * 2) + smallChange)
    // firstFrame = 509-1 = 508 in original (member numbers are 1-based)
    // We use 0-based frame numbers: strut0000 = frame 0
    const tmpDirection = this.correctDirection((this.direction / 100) + 8)
    const correctedDir = this.correctDirection(tmpDirection + 9)
    const frameOffset = (tmpPicOffset * 32) + (correctedDir * 2) + this.smallChange
    const frameKey = `strut${String(frameOffset).padStart(4, '0')}`

    // Load the texture for this frame
    if (this.game.cache.checkImageKey(frameKey)) {
      try {
        this.strootSprite.loadTexture(frameKey)
      } catch (e) {
        console.warn('[MulleWind] Could not load frame:', frameKey)
      }
    }
  }

  /**
   * Slow change to new wind speed/direction
   * @param {number} argSpeed - Target speed
   * @param {number} argDirection - Target direction
   * @param {number} argTime - Time in ticks
   */
  slowChange(argSpeed, argDirection, argTime) {
    this.toSpeed = argSpeed * 100
    this.toDirection = argDirection
    this.changeTime = argTime
    this.speedStep = (this.toSpeed - this.speed) / argTime

    // Handle direction wrapping
    let tmpDirChange = this.toDirection - (this.direction / 100)
    if (tmpDirChange > 8) {
      tmpDirChange = tmpDirChange - 16
    } else if (tmpDirChange < -8) {
      tmpDirChange = -16 - tmpDirChange
    }

    this.toDirection = this.toDirection * 100
    this.directionStep = tmpDirChange * 100 / argTime
  }

  /**
   * Immediately change wind
   * @param {number} argSpeed - Speed
   * @param {number} argDirection - Direction
   */
  change(argSpeed, argDirection) {
    if (argSpeed !== undefined) {
      this.speed = Math.floor(argSpeed * 100)
    }
    if (argDirection !== undefined) {
      this.direction = argDirection * 100
    }
  }

  /**
   * Get wind velocity point
   * @returns {Phaser.Point} Velocity vector
   */
  getVelPoint() {
    return this.vel.clone()
  }

  /**
   * Get current wind direction
   * @returns {number} Direction (1-16)
   */
  getDirection() {
    return this.correctDirection(this.direction / 100)
  }

  /**
   * Get current wind speed
   * @returns {number} Speed
   */
  getSpeed() {
    return this.speed
  }

  /**
   * Correct direction to 1-16 range
   * @param {number} dir - Direction
   * @returns {number} Corrected direction
   */
  correctDirection(dir) {
    dir = Math.floor(dir)
    while (dir < 1) dir += 16
    while (dir > 16) dir -= 16
    return dir
  }

  /**
   * Get velocity point for a direction
   * @param {number} direction - Direction (1-16)
   * @returns {Phaser.Point} Unit velocity vector
   */
  getVelPointForDirection(direction) {
    // Convert direction to angle (direction 1 = south, clockwise)
    // Direction 1 = 180°, 5 = 270°, 9 = 0°, 13 = 90°
    // 
    // BUG #4.7: Wind direction coordinate system difference
    // NOTE: There is a 22.5° offset between original Lingo coordinate system and this implementation.
    // Original Lingo uses direction 1 = SSW (202.5°), but this uses direction 1 = S (180°).
    // This affects wind/wave direction precision but is consistent throughout the codebase.
    // To match original exactly, would need: angle = ((direction - 9) * Math.PI) / 8 + (Math.PI / 16)
    const angle = ((direction - 9) * Math.PI) / 8

    return new Phaser.Point(
      Math.sin(angle) * 100,
      -Math.cos(angle) * 100
    )
  }

  /**
   * Destroy wind system
   */
  destroy() {
    if (this.strootSprite) {
      this.strootSprite.destroy()
      this.strootSprite = null
    }
  }

  /**
   * Loop method called by loopMaster
   * Calls update() to handle wind animation
   */
  loop() {
    this.update()
  }
}

/**
 * MulleWaves - Wave system
 * From Waves.ls
 */
class MulleWaves {
  constructor(game, state) {
    this.game = game
    this.state = state

    // Wave state
    this.speed = 0
    this.waveAngle = 0
    this.amplitude = 0
    this.period = 30
    this.phase = 0
    this.direction = 1

    // Wave velocity
    this.waveVelPoint = new Phaser.Point(0, 0)

    // Spawn lines
    this.spawnLines = SPAWN_LINES
    this.currentSpawnLine = null

    // Corner points for collision
    this.corners = []

    // Wave objects
    this.waveObjs = []
    this.waveSprites = []
    this.deleteList = []

    // Speed factor for map-specific wind strength
    this.speedFactor = 100

    // Wave sprites will be created when scene is ready (via ensureSpritesInWorld)
    // Don't create them here because game.world may not exist yet during LoadState
  }

  /**
   * Create wave sprite pool (6 sprites)
   */
  createWaveSprites() {
    // CRITICAL: Check if game.world exists BEFORE creating sprites
    // Phaser.Sprite constructor requires game.world to be initialized
    if (!this.game.world) {
      console.warn('[MulleWaves] Cannot create wave sprites - game.world not ready')
      return
    }

    // Create 6 wave sprites
    for (let i = 0; i < 6; i++) {
      const sprite = new MulleSprite(this.game, -100, -100)

      // Try to load wave sprite
      let loaded = false
      if (this.game.cache.checkImageKey('boat-sprites-0')) {
        try {
          sprite.loadTexture('boat-sprites-0', 'wave0')
          loaded = true
        } catch (e) {
          // Wave sprite not available
        }
      }

      if (loaded) {
        // Only add to game world if it exists (scene is ready)
        if (this.game.add && this.game.world) {
          this.game.add.existing(sprite)
        }
        sprite.visible = false
        this.waveSprites.push(sprite)
      } else {
        sprite.destroy()
      }
    }

    console.log('[MulleWaves] Created', this.waveSprites.length, 'wave sprites')
  }

  /**
   * Ensure wave sprites are added to game world
   * Called when scene is ready
   */
  ensureSpritesInWorld() {
    // Create sprites if they don't exist yet
    if (this.waveSprites.length === 0 && this.game.add && this.game.world) {
      this.createWaveSprites()
    }

    if (this.game.add && this.game.world) {
      for (const sprite of this.waveSprites) {
        // Check if sprite is already in world
        if (!sprite.parent) {
          this.game.add.existing(sprite)
        }
      }
      if (this.waveSprites.length > 0) {
        console.log('[MulleWaves] Added wave sprites to world')
      }
    }
  }

  /**
   * Set corner points for collision detection
   * @param {Array} theList - Corner points
   */
  setCornerPoints(theList) {
    if (!theList || theList.length === 0) {
      this.corners = []
      return
    }
    this.corners = theList.map(p => new Phaser.Point(p.x, p.y))
  }

  /**
   * Apply map-specific wave settings.
   * Matches WeatherRenderer speedFactor behavior.
   * @param {string} argHide - 'hide' to disable wave visuals
   * @param {number|string} argWindSpeedFactor - 0-5, absolute factor, or 'Full'
   */
  changeMap(argHide, argWindSpeedFactor) {
    let speedFactor = argWindSpeedFactor

    if (speedFactor === undefined || speedFactor === null) {
      speedFactor = 100
    } else if (typeof speedFactor === 'number' && speedFactor <= 5) {
      const factorMap = { 0: 0, 1: 100, 2: 125, 3: 150, 4: 175, 5: 200 }
      speedFactor = factorMap[speedFactor] !== undefined ? factorMap[speedFactor] : speedFactor
    } else if (speedFactor === 'Full') {
      speedFactor = 200
    }

    if (!Number.isInteger(speedFactor)) {
      speedFactor = 100
    }

    this.speedFactor = speedFactor

    const hideWaves = argHide === 'hide'
    for (let i = 0; i < this.waveSprites.length; i++) {
      this.waveSprites[i].visible = false
    }

    if (hideWaves && this.waveObjs.length > 0) {
      for (let i = this.waveObjs.length - 1; i >= 0; i--) {
        this.waveObjs[i].destroy()
      }
      this.waveObjs = []
    }
  }

  /**
   * Set wave direction and speed
   * @param {number} argWaveAngle - Wave direction (1-16)
   * @param {number} argSpeed - Wave speed
   */
  setDirection(argWaveAngle, argSpeed) {
    this.waveAngle = argWaveAngle
    this.speed = argSpeed
    this.direction = (argWaveAngle < 9) ? -1 : 1

    // Get spawn line for this direction
    const dirIndex = Math.floor(argWaveAngle) - 1
    if (dirIndex >= 0 && dirIndex < this.spawnLines.length) {
      this.currentSpawnLine = this.spawnLines[dirIndex]
    }

    // Calculate wave velocity
    this.waveVelPoint = this.getVelPointForDirection(argWaveAngle).multiply(argSpeed, argSpeed).divide(100, 100)

    // Set amplitude based on speed
    const speedIndex = Math.floor(argSpeed / 25)
    this.amplitude = AMPLITUDE_LIST[Math.min(speedIndex, AMPLITUDE_LIST.length - 1)]
  }

  /**
   * Get velocity point for direction
   * @param {number} direction - Direction (1-16)
   * @returns {Phaser.Point} Velocity vector
   */
  getVelPointForDirection(direction) {
    const angle = ((direction - 9) * Math.PI) / 8
    return new Phaser.Point(
      Math.sin(angle) * 100,
      -Math.cos(angle) * 100
    )
  }

  /**
   * Update weather system (call every tick/frame)
   * From Weather.ls loop()
   */
  update() {
    // Spawn new waves randomly (Waves.ls:111 - random(30) = 1)
    if (Math.random() < 0.033 && this.speed > 0) {  // 1/30 chance per tick
      // Find available sprite
      const availableSprite = this.waveSprites.find(s => !s.visible)

      if (availableSprite && this.currentSpawnLine) {
        // Calculate spawn position with retry logic (Waves.ls:119-138)
        const tmpMid = this.currentSpawnLine[0]
        const tmpLim = this.currentSpawnLine[1]
        let tmpX, tmpY, itsBad = false

        // Try up to 30 times to find a clear spawn position
        for (let attempt = 0; attempt < 30; attempt++) {
          const tmpRnd = Math.random() * 400 - 200
          const tmpOO = {
            x: tmpMid.x + (tmpLim.x * tmpRnd / 100),
            y: tmpMid.y + (tmpLim.y * tmpRnd / 100)
          }
          tmpX = tmpOO.x
          tmpY = tmpOO.y

          // Check if position is clear (AND both conditions - Waves.ls:126-133)
          itsBad = false
          for (let i = 0; i < this.waveObjs.length; i++) {
            const aLoc = this.waveObjs[i].getLoc()
            if (Math.abs(tmpX - aLoc.x) < 100 && Math.abs(tmpY - aLoc.y) < 100) {
              itsBad = true
              break
            }
          }

          if (!itsBad) {
            break
          }
        }

        if (!itsBad) {
          const pos = new Phaser.Point(tmpX, tmpY)
          const wave = new SingleWave(this.game, this, availableSprite, pos, this.waveVelPoint, this.direction, this.amplitude)
          this.waveObjs.push(wave)
        }
      }
    }

    // Update phase
    this.phase = (this.phase + this.speed) % this.period

    // Update all waves
    for (let i = this.waveObjs.length - 1; i >= 0; i--) {
      const wave = this.waveObjs[i]
      wave.update()

      // Remove if off-screen
      if (wave.isOffScreen()) {
        wave.destroy()
        this.waveObjs.splice(i, 1)
      }
    }
  }

  /**
   * Get wave topology info for boat collision
   * @param {Phaser.Point} theCenter - Boat center
   * @param {number} theDir - Boat direction
   * @param {Array} argCorners - Corner points
   * @returns {Array} [avgAlt, frontBackInclination, sideInclination]
   */
  getTopoInfo(theCenter, theDir, argCorners) {
    let totAlt = 0
    const alts = []

    for (let n = 0; n < 3; n++) {
      const tmpAlt = this.getAltitude(theCenter.clone().add(argCorners[n].x, argCorners[n].y))
      alts.push(tmpAlt)
      totAlt += tmpAlt
    }

    const frontBackInclination = alts[0] - ((alts[1] + alts[2]) / 2)
    const sideInclination = alts[1] - alts[2]
    const avgAlt = totAlt / 3

    return [avgAlt, frontBackInclination, sideInclination]
  }

  /**
   * Get wave altitude at a point
   * @param {Phaser.Point} aPoint - Point to check
   * @returns {number} Altitude
   */
  getAltitude(aPoint) {
    // Check big waves from wave objects
    let bigWaveTot = 0
    for (let i = 0; i < this.waveObjs.length; i++) {
      bigWaveTot += this.waveObjs[i].check(aPoint)
    }

    // Trigger wave hit if total is high
    if (bigWaveTot > 7000) {
      this.hitWave()
    }

    // Calculate base wave altitude
    const tmpX = aPoint.x + 100
    const tmpY = aPoint.y + 100
    const tmpAngle = Math.atan(tmpX / tmpY)
    const hypo = Math.sqrt(tmpX * tmpX + tmpY * tmpY)
    const totalAngle = tmpAngle + this.waveAngle
    const fromZero = Math.floor(hypo * Math.cos(totalAngle))

    let whereInPeriod = (fromZero + this.phase) % this.period
    if (whereInPeriod < 0) {
      whereInPeriod += this.period
    }

    const periodIndex = Math.floor(100 * whereInPeriod / this.period) % 100
    const amplitude = this.amplitude * AMPLITUDE_LIST[periodIndex]
    const altitude = (amplitude + bigWaveTot) / 200

    return altitude
  }

  /**
   * Hit wave callback
   * From Waves.ls: if bigWaveTot > 7000 then hitWave(the ambience of gDir)
   */
  hitWave() {
    // Play wave hit sound
    if (this.state && this.state.playSound) {
      this.state.playSound('wave_hit')
    }

    console.log('[MulleWaves] Hit big wave!')
  }

  /**
   * Correct direction to 1-16 range
   * @param {number} dir - Direction
   * @returns {number} Corrected direction
   */
  correctDirection(dir) {
    dir = Math.floor(dir)
    while (dir < 1) dir += 16
    while (dir > 16) dir -= 16
    return dir
  }

  /**
   * Destroy wave system
   */
  destroy() {
    // Fix #54: clearWaves was never defined - destroy waveObjs directly
    if (this.waveObjs) {
      for (let i = this.waveObjs.length - 1; i >= 0; i--) {
        const wave = this.waveObjs[i]
        if (wave && wave.destroy) wave.destroy()
      }
      this.waveObjs = []
    }

    if (this.waveSprites) {
      this.waveSprites.forEach(sprite => {
        if (sprite && sprite.destroy) sprite.destroy()
      })
      this.waveSprites = []
    }
  }
}

/**
 * Single Wave object
 * Represents one visual wave sprite moving across the screen
 * From SingleWave.ls
 */
class SingleWave {
  constructor(game, reportObject, sprite, pos, vel, direction, amplitude) {
    this.game = game
    this.reportObject = reportObject
    this.sprite = sprite
    this.amplitude = amplitude
    this.direction = direction

    // Select first frame based on amplitude (SingleWave.ls:7-11)
    // If amplitude > 60, use WavePic1, else WavePic2
    this.firstFrame = 0  // Will be set when we have the member
    if (amplitude > 60) {
      // WavePic1 + (4 * (direction - 1))
      this.wavePicBase = 1
    } else {
      // WavePic2 + (4 * (direction - 1))
      this.wavePicBase = 2
    }

    // Generate frameList (SingleWave.ls:12-26)
    // This is the 180+ frame animation system
    const tmpDur = 30
    const tmpMax = 4
    this.frameList = []

    // Repeat twice (m = 1 to 2)
    for (let m = 0; m < 2; m++) {
      // Ramp up: 1 to tmpDur-1
      for (let n = 1; n < tmpDur; n++) {
        this.frameList.push(1 + ((tmpMax - 1) * n / tmpDur))
      }
      // Hold at max: tmpDur times
      for (let n = 0; n < tmpDur; n++) {
        this.frameList.push(tmpMax)
      }
      // Ramp down: 2 to tmpDur
      for (let n = 2; n <= tmpDur; n++) {
        this.frameList.push(1 + ((tmpMax - 1) * (tmpDur - n) / tmpDur))
      }
    }

    this.listLen = this.frameList.length
    this.counter = Math.floor(Math.random() * (this.listLen - 1))

    // Store velocity
    this.vel = vel.clone()

    // Location is scaled by 10 for precision (SingleWave.ls:29)
    this.loc = pos.clone().multiply(10, 10)

    // Wave collision circle
    this.waveCircle = 70

    // Show sprite
    this.sprite.position.set(this.loc.x / 10, this.loc.y / 10)
    this.sprite.visible = true
    this.sprite.alpha = 0.7

    this.active = true

    // Initial loop to set first frame
    this.updateFrame()
  }

  /**
   * Update wave position and animation
   * From SingleWave.ls loop()
   */
  update() {
    if (!this.active) return

    // Advance frame counter
    this.counter = this.counter + 1
    if (this.counter >= this.listLen) {
      this.counter = 1
    }

    // Check if off-screen (SingleWave.ls:59-62)
    const locX = this.loc.x
    const locY = this.loc.y
    if (locX < -1000 || locY < -1000 || locX > 6400 || locY > 5100) {
      if (this.reportObject && this.reportObject.stopped) {
        this.reportObject.stopped(this)
      }
      this.active = false
      return
    }

    // Get current frame value
    const tmpFrame = this.frameList[this.counter]

    // Update position using frame-based velocity (SingleWave.ls:65)
    // loc = loc + (vel / 2) + (vel * tmpFrame / 8)
    this.loc.x += (this.vel.x / 2) + (this.vel.x * tmpFrame / 8)
    this.loc.y += (this.vel.y / 2) + (this.vel.y * tmpFrame / 8)

    // Update sprite position (divide by 10 for display)
    this.sprite.position.set(this.loc.x / 10, this.loc.y / 10)

    // Update sprite frame
    this.updateFrame()
  }

  /**
   * Update sprite frame based on animation counter
   */
  updateFrame() {
    const tmpFrame = this.frameList[this.counter]
    const frameOffset = Math.floor(tmpFrame)

    // Try to set wave frame
    try {
      const frameName = `wave${frameOffset}`
      if (this.sprite.frameName !== frameName) {
        this.sprite.frameName = frameName
      }
    } catch (e) {
      // Frame not available
    }
  }

  /**
   * Get wave location (scaled back from internal precision)
   * From SingleWave.ls getLoc()
   * @returns {Phaser.Point} Location
   */
  getLoc() {
    return new Phaser.Point(this.loc.x / 10, this.loc.y / 10)
  }

  /**
   * Check wave influence at a point (for collision detection)
   * From SingleWave.ls check()
   * @param {Phaser.Point} thePoint - Point to check
   * @returns {number} Wave influence value
   */
  check(thePoint) {
    // Get difference from wave center (loc is scaled by 10)
    const tmpDiff = {
      x: thePoint.x - (this.loc.x / 10),
      y: thePoint.y - (this.loc.y / 10)
    }

    // Calculate distance
    const hypo = Math.sqrt((tmpDiff.x * tmpDiff.x) + (tmpDiff.y * tmpDiff.y))

    // Calculate influence factor
    let factor = this.waveCircle - hypo
    if (factor < 0) {
      factor = 0
    }

    // Return wave influence (SingleWave.ls:50)
    // frameList[counter] * factor * amplitude * 2
    const tmpFrame = this.frameList[this.counter]
    return tmpFrame * factor * this.amplitude * 2
  }

  /**
   * Check if wave is off-screen
   * @returns {boolean} True if off-screen
   */
  isOffScreen() {
    const locX = this.loc.x
    const locY = this.loc.y
    return locX < -1000 || locY < -1000 || locX > 6400 || locY > 5100
  }

  /**
   * Destroy wave
   */
  destroy() {
    this.active = false
    this.sprite.visible = false
    this.sprite.position.set(-100, -100)
  }

  /**
   * Called by wave manager when stopped
   */
  stopped() {
    this.destroy()
  }
}

// Export
export default MulleWeather
export { WEATHER_TYPES, WIND_INFO, POSSIBLE_WEATHER_IN_LEVEL, SPAWN_LINES, AMPLITUDE_LIST }
