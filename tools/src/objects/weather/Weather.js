/**
 * Weather.js - Weather controller for boat game
 * @module objects/weather/Weather
 * 
 * Direct port of ParentScript 142 - Weather.ls from original Lingo (shared_00)
 * 
 * Properties from original:
 * - weatherType: current weather type (1-4)
 *   1 = Calm, 2 = Light breeze, 3 = Moderate wind, 4 = Storm
 * - windspeed: current wind speed (0-3)
 * - windDirection: current wind direction (1-16)
 * - foreCastCounter, changeWaitCounter: timing for weather changes
 * - nextWeather: upcoming weather settings {type, speed, direction}
 * - reportObject, reportTime: for weather forecast reports
 * - windInfo: wind settings per weather type
 * - possibleWeatherInLevel: allowed weather types per game level
 * - realChange: counter for actual changes (for reporting)
 */
'use strict'

class Weather {
  /**
   * Create Weather instance
   * @param {Object} levelHandler - Level handler with getLevel method
   */
  constructor (levelHandler) {
    this.levelHandler = levelHandler

    // Original: set weatherType to 1
    this.weatherType = 1

    // Original: set possibleWeatherInLevel to [[1], [1], [1, 2], [3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]
    this.possibleWeatherInLevel = [
      [1],           // Level 1: only calm
      [1],           // Level 2: only calm
      [1, 2],        // Level 3: calm or light breeze
      [3, 4],        // Level 4: moderate or storm
      [1, 2, 3, 4],  // Level 5: all weather
      [1, 2, 3, 4]   // Level 6: all weather
    ]

    // Original: set windInfo to [[#Speeds: [1], #Directions: [12]], ...]
    this.windInfo = [
      { Speeds: [1], Directions: [12] },                                    // Type 1: calm
      { Speeds: [0, 1, 2], Directions: [16, 2, 6, 8, 10] },                 // Type 2: light breeze
      { Speeds: [0, 1, 2, 3], Directions: [16, 2, 6, 8, 10] },              // Type 3: moderate
      { Speeds: [0, 2, 3], Directions: [2, 4, 4, 6, 8, 10, 12, 12, 14, 16] } // Type 4: storm
    ]

    // Original: set foreCastCounter to 0
    this.foreCastCounter = 0

    // Original: set changeWaitCounter to 0
    this.changeWaitCounter = 0

    // Original: set nextWeather to []
    this.nextWeather = {}

    // Original: set windspeed to 0
    this.windspeed = 0

    // Original: set windDirection to 1
    this.windDirection = 1

    // Original: set reportObject to 0
    this.reportObject = null

    // Original: set reportTime to 0
    this.reportTime = 0

    // Original: set realChange to 0
    this.realChange = 0

    // Set initial weather
    this.setNextWeather()
  }

  /**
   * Kill weather system
   * Original: on kill me
   */
  kill () {
    return null
  }

  /**
   * Main loop - update weather each tick
   * Original: on loop me
   */
  loop () {
    if (this.changeWaitCounter === 0) {
      // Apply next weather
      // Original: set weatherType to getProp(nextWeather, #type)
      //           set windDirection to getProp(nextWeather, #direction)
      //           set windspeed to getProp(nextWeather, #speed)
      this.weatherType = this.nextWeather.type || this.weatherType
      this.windDirection = this.nextWeather.direction || this.windDirection
      this.windspeed = this.nextWeather.speed !== undefined ? this.nextWeather.speed : this.windspeed

      // Report to listener
      if (this.reportObject && this.reportObject.weatherReport) {
        const tmpList = { ...this.nextWeather, TimeLeft: this.changeWaitCounter }
        this.reportObject.weatherReport(tmpList)
      }

      // Schedule next change
      // Original: setNextWeather(me, VOID, 3000 + random(3000))
      this.setNextWeather(undefined, 3000 + Math.floor(Math.random() * 3000))
    } else {
      // Check if it's time to send forecast report
      if (this.changeWaitCounter === this.reportTime) {
        if (this.reportObject && this.reportObject.weatherReport && this.realChange) {
          const tmpList = { ...this.nextWeather, TimeLeft: this.changeWaitCounter }
          this.reportObject.weatherReport(tmpList)
        }
      }
    }

    // Original: set changeWaitCounter to changeWaitCounter - 1
    this.changeWaitCounter = this.changeWaitCounter - 1
  }

  /**
   * Get upcoming weather (or current if not close to change)
   * Original: on getComingWeather me
   * @returns {Object} Weather settings {type, direction, speed}
   */
  getComingWeather () {
    // Original: if changeWaitCounter < reportTime then return nextWeather
    if (this.changeWaitCounter < this.reportTime) {
      return this.nextWeather
    } else {
      return {
        type: this.weatherType,
        direction: this.windDirection,
        speed: this.windspeed
      }
    }
  }

  /**
   * Get current weather type
   * Original: on getType me
   * @returns {number} Weather type (1-4)
   */
  getType () {
    return this.weatherType
  }

  /**
   * Get current wind speed
   * Original: on getWindspeed me
   * @returns {number} Wind speed (0-3)
   */
  getWindspeed () {
    return this.windspeed
  }

  /**
   * Get current wind direction
   * Original: on getWindDirection me
   * @returns {number} Wind direction (1-16)
   */
  getWindDirection () {
    return this.windDirection
  }

  /**
   * Register object for weather reports
   * Original: on reportWeatherToMe me, argObj
   * @param {Object} argObj - Object with weatherReport method
   */
  reportWeatherToMe (argObj) {
    this.reportObject = argObj
  }

  /**
   * Set next weather change
   * Original: on setNextWeather me, argWeather, argRandomWait
   * @param {Object} argWeather - Weather settings or undefined for random
   * @param {number} argRandomWait - Ticks to wait before change
   */
  setNextWeather (argWeather, argRandomWait) {
    this.interpretList(argWeather)

    // Original: set reportTime to (argRandomWait / 4) + random(argRandomWait / 4)
    if (argRandomWait) {
      this.reportTime = Math.floor(argRandomWait / 4) + Math.floor(Math.random() * argRandomWait / 4)
      this.changeWaitCounter = argRandomWait
    } else {
      this.changeWaitCounter = 0
      this.loop()
    }
  }

  /**
   * Interpret weather settings and generate random values where needed
   * Original: on interpretList me, argWeather
   * @param {Object|string} argWeather - Weather settings or 'SomethingNew'
   */
  interpretList (argWeather) {
    this.realChange = 0

    // Handle undefined or SomethingNew
    // Original: if voidp(argWeather) then set argWeather to [#type: #new, #speed: #new, #direction: #new]
    if (!argWeather) {
      argWeather = { type: 'new', speed: 'new', direction: 'new' }
    } else if (argWeather === 'SomethingNew') {
      // Randomly pick one aspect to change
      // Original: set tmpRnd to random(3)
      argWeather = {}
      const tmpRnd = Math.floor(Math.random() * 3) + 1
      if (tmpRnd === 1) {
        argWeather.type = 'new'
      } else if (tmpRnd === 2) {
        argWeather.speed = 'new'
      } else {
        argWeather.direction = 'new'
      }
    }

    // Process weather type
    let tmpType = argWeather.type
    if (tmpType === undefined) {
      tmpType = this.weatherType
      argWeather.type = tmpType
    } else if (tmpType === 'new') {
      // Get possible weather for current level
      const tmpLevel = this.levelHandler ? this.levelHandler.getLevel() : 1
      const levelIndex = Math.min(tmpLevel - 1, this.possibleWeatherInLevel.length - 1)
      let tmpPossibleWeather = [...this.possibleWeatherInLevel[levelIndex]]
      const tmpSafeRemember = tmpPossibleWeather[0]

      // Remove current weather type to force change
      while (true) {
        const tmpPos = tmpPossibleWeather.indexOf(this.weatherType)
        if (tmpPos !== -1) {
          tmpPossibleWeather.splice(tmpPos, 1)
        } else {
          break
        }
      }

      if (tmpPossibleWeather.length === 0) {
        tmpPossibleWeather = [tmpSafeRemember]
      } else {
        this.realChange++
      }

      tmpType = tmpPossibleWeather[Math.floor(Math.random() * tmpPossibleWeather.length)]
      argWeather.type = tmpType
    }

    // Get wind info for this weather type
    const tmpWindInfo = this.windInfo[tmpType - 1] || this.windInfo[0]

    // Process wind speed
    let tmpWindspeed = argWeather.speed
    if (tmpWindspeed === 'new') {
      let tmpSpeeds = [...tmpWindInfo.Speeds]
      const tmpSafeRemember = tmpSpeeds[0]

      // Remove current speed to force change
      while (true) {
        const tmpPos = tmpSpeeds.indexOf(this.windspeed)
        if (tmpPos !== -1) {
          tmpSpeeds.splice(tmpPos, 1)
        } else {
          break
        }
      }

      if (tmpSpeeds.length === 0) {
        tmpSpeeds = [tmpSafeRemember]
      } else {
        this.realChange++
      }

      tmpWindspeed = tmpSpeeds[Math.floor(Math.random() * tmpSpeeds.length)]
      argWeather.speed = tmpWindspeed
    } else if (tmpWindspeed === undefined) {
      argWeather.speed = this.windspeed
    }

    // Process wind direction
    let tmpWindDirection = argWeather.direction
    if (tmpWindDirection === 'new') {
      let tmpDirs = [...tmpWindInfo.Directions]
      const tmpSafeRemember = tmpDirs[0]

      // Remove current direction to force change
      while (true) {
        const tmpPos = tmpDirs.indexOf(this.windDirection)
        if (tmpPos !== -1) {
          tmpDirs.splice(tmpPos, 1)
        } else {
          break
        }
      }

      if (tmpDirs.length === 0) {
        tmpDirs = [tmpSafeRemember]
      } else {
        this.realChange++
      }

      tmpWindDirection = tmpDirs[Math.floor(Math.random() * tmpDirs.length)]
      argWeather.direction = tmpWindDirection
    } else if (tmpWindDirection === undefined) {
      argWeather.direction = this.windDirection
    }

    this.nextWeather = argWeather
  }

  /**
   * Set sky background based on weather type
   * Original: on setSky me (not fully implemented - requires sprites)
   */
  setSky () {
    // Original sets sprite member to "00b0" & string(10 + weatherType) & "v0"
    // e.g., weather type 1 = "00b011v0"
    this.skyMember = '00b0' + (10 + this.weatherType) + 'v0'
  }
}

export default Weather
