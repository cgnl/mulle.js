/**
 * WeatherRenderer.js - Weather rendering manager
 * @module objects/weather/WeatherRenderer
 * 
 * Direct port of ParentScript 18 - WeatherRenderer.ls from original Lingo
 * 
 * Manages Wind and Waves objects, handles weather changes and map transitions.
 * 
 * Properties from original:
 * - wind: Wind object for wind simulation
 * - waves: Waves object for wave simulation
 * - speedFactor: wind speed multiplier (100 = normal, 200 = double)
 * - allowingRadio: whether radio weather reports are allowed
 */
'use strict'

import Wind from './Wind'
import Waves from './Waves'
import Precipitation from './Precipitation'

class WeatherRenderer {
  /**
   * Create WeatherRenderer instance
   * @param {Object} drivingHandlers - DrivingHandlers for direction calculations
   * @param {Object} weather - Weather controller
   * @param {Object} [game] - Phaser game instance
   */
  constructor(drivingHandlers, weather, game) {
    this.drivingHandlers = drivingHandlers
    this.weather = weather

    // Store game ref if needed (though mainly for children)
    this.game = game

    // Lingo: startreportRadioToMe(the radioHandler of gMulleGlobals, me, 1)
    this.radioHandler = null
    const radioHandler =
      this.game?.mulle?.gMulleGlobals?.radioHandler ||
      this.game?.mulle?.radioHandler ||
      null
    if (radioHandler && typeof radioHandler.startReportRadioToMe === 'function') {
      radioHandler.startReportRadioToMe(this, true)
      this.radioHandler = radioHandler
    }

    // Original: set wind to new(script "Wind")
    this.wind = new Wind(drivingHandlers)

    // Original: set waves to new(script "Waves")
    this.waves = new Waves(drivingHandlers, game)

    // Add Precipitation support (not in original Lingo but needed for parity)
    this.precipitation = new Precipitation(game)

    // Original: set speedFactor to 100
    this.speedFactor = 100

    // Original: set allowingRadio to 1
    this.allowingRadio = true
  }

  /**
   * Initialize weather renderer
   * Original: on init me
   */
  init() {
    // Original: Change(wind, getWindspeed(weather), getWindDirection(weather))
    if (this.weather) {
      this.wind.Change(this.weather.getWindspeed(), this.weather.getWindDirection())
    }

    // Original: init(wind)
    this.wind.init()

    // Original: init(waves)
    this.waves.init()
  }

  /**
   * Kill weather renderer
   * Original: on kill me
   */
  kill() {
    // Original: set wind to kill(wind)
    this.wind = this.wind.kill()

    // Original: set waves to kill(waves)
    this.waves = this.waves.kill()

    return null
  }

  /**
   * Enable/disable radio weather reports
   * Original: on allowRadio me, argYesNo
   * @param {boolean} argYesNo - Whether to allow radio
   */
  allowRadio(argYesNo) {
    this.allowingRadio = argYesNo
  }

  /**
   * Handle radio report (weather broadcast audio)
   * Original: on radioReport me, argSoundList
   * @param {string|Array} argSoundList - Sound ID or list
   * @returns {number} 1 if spoken, 0 otherwise
   */
  radioReport(argSoundList) {
    if (!this.allowingRadio) {
      return 0
    }

    const talker =
      this.game?.mulle?.mulleTalkObject ||
      this.game?.mulle?.dir?.mulleTalkObject ||
      null

    if (talker && typeof talker.isQuiet === 'function') {
      if (talker.isQuiet()) {
        const tmp = talker.say ? talker.say(argSoundList, 2) : null
        if (tmp) return 1
      }
      return 0
    }

    if (talker && typeof talker.say === 'function') {
      const tmp = talker.say(argSoundList, 2)
      return tmp ? 1 : 0
    }

    return 0
  }

  /**
   * Handle weather report (for gradual wind changes)
   * Original: on weatherReport me, argList
   * @param {Object} argList - Weather report {TimeLeft, direction, speed}
   */
  weatherReport(argList) {
    const tmpTime = argList.TimeLeft

    if (tmpTime > 0) {
      const tmpWindDir = argList.direction
      const tmpWindspeed = this.speedFactor * argList.speed / 100

      // Original: slowChange(wind, tmpWindspeed, tmpWindDir, tmpTime)
      this.wind.slowChange(tmpWindspeed, tmpWindDir, tmpTime)
    }
  }

  /**
   * Handle map change (update wind/waves for new area)
   * Original: on changeMap me, argHide, argWindSpeedFactor
   * @param {string} argHide - 'hide' to hide water sprite
   * @param {number|string} argWindSpeedFactor - Speed factor (0-5 or 'Full')
   */
  changeMap(argHide, argWindSpeedFactor) {
    // Get current weather
    const tmpWeather = this.weather ? this.weather.getComingWeather() : { speed: 1, direction: 8 }

    // Process speed factor
    // Original: case speedFactor of 0-5 maps to specific values
    let speedFactor = argWindSpeedFactor

    if (speedFactor === undefined || speedFactor === null) {
      speedFactor = 100
    } else if (typeof speedFactor === 'number' && speedFactor <= 5) {
      // Map 0-5 to specific values
      const factorMap = { 0: 0, 1: 100, 2: 125, 3: 150, 4: 175, 5: 200 }
      speedFactor = factorMap[speedFactor] !== undefined ? factorMap[speedFactor] : speedFactor
    } else if (speedFactor === 'Full') {
      speedFactor = 200
    }

    if (!Number.isInteger(speedFactor)) {
      speedFactor = 100
    }

    this.speedFactor = speedFactor

    // Calculate actual wind speed
    let tmpSpeed
    if (argWindSpeedFactor === 'Full') {
      tmpSpeed = 4
    } else {
      tmpSpeed = this.speedFactor * (tmpWeather.speed || 1) / 100
    }

    const tmpDir = tmpWeather.direction || 8

    // Update waves
    // Original: setDirection(waves, tmpDir, tmpSpeed)
    this.waves.setDirection(tmpDir, tmpSpeed)

    // Update wind
    // Original: Change(wind, tmpSpeed, tmpDir)
    this.wind.Change(tmpSpeed, tmpDir)
  }

  /**
   * Update precipitation visuals
   * @param {number} weatherType - Current weather type
   */
  updatePrecipitation(weatherType) {
    if (this.precipitation) {
      this.precipitation.update(weatherType)
    }
  }

  /**
   * Get Wind object
   * @returns {Wind} Wind instance
   */
  getWind() {
    return this.wind
  }

  /**
   * Get Waves object
   * @returns {Waves} Waves instance
   */
  getWaves() {
    return this.waves
  }

  /**
   * Get topology info for boat tilt calculation
   * Delegates to Waves
   * @param {Object} loc - Location {x, y}
   * @param {number} direction - Boat direction (1-16)
   * @param {Array} cornerPoints - Corner points for boat
   * @returns {Array} [avgAlt, frontBackInclination, sideInclination]
   */
  getTopoInfo(loc, direction, cornerPoints) {
    if (this.waves && this.waves.getTopoInfo) {
      return this.waves.getTopoInfo(loc, direction, cornerPoints)
    }
    return [0, 0, 0]
  }

  /**
   * Kill weather renderer
   * Original: on kill me
   */
  kill() {
    // Original: set wind to kill(wind)
    if (this.wind) this.wind = this.wind.kill()

    // Original: set waves to kill(waves)
    if (this.waves) this.waves = this.waves.kill()

    // Lingo: stopReportRadioToMe(the radioHandler of gMulleGlobals, me)
    if (this.radioHandler && typeof this.radioHandler.stopReportRadioToMe === 'function') {
      this.radioHandler.stopReportRadioToMe(this)
    }
    this.radioHandler = null

    // Kill precipitation
    if (this.precipitation) {
      this.precipitation.kill()
      this.precipitation = null
    }

    return null
  }
}

export default WeatherRenderer
