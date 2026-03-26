/**
 * Wind.js - Wind system for boat game
 * @module objects/weather/Wind
 * 
 * Direct port of ParentScript 21 - Wind.ls from original Lingo
 * 
 * Properties from original:
 * - speed: wind speed (scaled by 100)
 * - direction: wind direction (scaled by 100)
 * - vel: velocity point {x, y}
 * - randSpeed, randDirection: randomization factors
 * - changeTime, speedStep, directionStep: for gradual changes
 * - toSpeed, toDirection: target values
 * - smallChange, smallChangeWait: visual wobble
 */
'use strict'

class Wind {
  /**
   * Create Wind instance
   * @param {Object} drivingHandlers - DrivingHandlers with correctDirection and getVelPoint
   */
  constructor (drivingHandlers) {
    this.drivingHandlers = drivingHandlers
    
    // Original: set randSpeed to 3
    this.randSpeed = 3
    // Original: set speed to 0
    this.speed = 0
    // Original: set randDirection to 2
    this.randDirection = 2
    // Original: set direction to 15 * 100
    this.direction = 15 * 100
    
    // Original: set changeTime to 0
    this.changeTime = 0
    // Original: set counter to 0
    this.counter = 0
    
    // Original: set smallChange to 0
    this.smallChange = 0
    // Original: set smallChangeWait to 0
    this.smallChangeWait = 0
    
    // Transition values
    this.toSpeed = 0
    this.toDirection = 0
    this.speedStep = 0
    this.directionStep = 0
    
    // Velocity point
    this.vel = { x: 0, y: 0 }
  }

  /**
   * Initialize wind (called after construction)
   * Original: on init me
   */
  init () {
    this.loop()
  }

  /**
   * Clean up
   * Original: on kill me
   */
  kill () {
    return null
  }

  /**
   * Main loop - update wind state each tick
   * Original: on loop me
   */
  loop () {
    // Handle gradual change
    if (this.changeTime > 0) {
      // Original: set speed to speed + speedStep
      //           set direction to direction + directionStep
      this.speed = this.speed + this.speedStep
      this.direction = this.direction + this.directionStep
      this.changeTime = this.changeTime - 1
      
      // Original: if changeTime = 0 then
      //             set speed to toSpeed
      //             set direction to toDirection
      if (this.changeTime === 0) {
        this.speed = this.toSpeed
        this.direction = this.toDirection
      }
    }
    
    // Calculate velocity point
    // Original: set tmpDirection to correctDirection(direction / 100 + 8)
    //           set vel to speed * getVelPoint(tmpDirection) / 100
    const tmpDirection = this._correctDirection(Math.floor(this.direction / 100) + 8)
    const velPoint = this._getVelPoint(tmpDirection)
    
    this.vel = {
      x: Math.floor(this.speed * velPoint.x / 100),
      y: Math.floor(this.speed * velPoint.y / 100)
    }
    
    // Calculate picture offset for wind indicator
    // Original Lingo line 40-51: speed is already scaled *100 internally,
    // thresholds compare against 300, 200, 100 (not 300*100)
    let tmpPicOffset
    if (this.speed >= 300) {
      tmpPicOffset = 0
    } else if (this.speed >= 200) {
      tmpPicOffset = 1
    } else if (this.speed >= 100) {
      tmpPicOffset = 2
    } else {
      tmpPicOffset = 3
    }
    this._picOffset = tmpPicOffset
    
    // Update small change wobble
    // Original: if smallChangeWait <= 0 then
    //             set smallChangeWait to random(6)
    //             set smallChange to random(2) - 1
    if (this.smallChangeWait <= 0) {
      this.smallChangeWait = Math.floor(Math.random() * 6) + 1 // 1-6
      this.smallChange = Math.floor(Math.random() * 2) // 0 or 1
    } else {
      this.smallChangeWait = this.smallChangeWait - 1
    }
  }

  /**
   * Get current velocity point
   * Original: on getVelPoint me
   * @returns {Object} {x, y} velocity
   */
  getVelPoint () {
    return this.vel
  }

  /**
   * Gradually change wind speed and direction over time
   * Original: on slowChange me, argSpeed, argDirection, argTime
   * @param {number} argSpeed - Target speed (0-400)
   * @param {number} argDirection - Target direction (1-16)
   * @param {number} argTime - Number of ticks for transition
   */
  slowChange (argSpeed, argDirection, argTime) {
    // Original: set toSpeed to argSpeed * 100
    this.toSpeed = argSpeed * 100
    // Original: set toDirection to argDirection (then * 100 later)
    this.toDirection = argDirection
    // Original: set changeTime to argTime
    this.changeTime = argTime
    
    // Calculate speed step
    // Original: set speedStep to (toSpeed - speed) / changeTime
    this.speedStep = (this.toSpeed - this.speed) / this.changeTime
    
    // Calculate direction change with wrap-around handling
    // Original: set tmpDirChange to toDirection - (direction / 100)
    let tmpDirChange = this.toDirection - Math.floor(this.direction / 100)
    
    // Original: if tmpDirChange > 8 then set tmpDirChange to tmpDirChange - 16
    if (tmpDirChange > 8) {
      tmpDirChange = tmpDirChange - 16
    } else if (tmpDirChange < -8) {
      // Original: if tmpDirChange < -8 then set tmpDirChange to -16 - tmpDirChange
      tmpDirChange = -16 - tmpDirChange
    }
    
    // Original: set toDirection to toDirection * 100
    this.toDirection = this.toDirection * 100
    // Original: set directionStep to tmpDirChange * 100 / changeTime
    this.directionStep = tmpDirChange * 100 / this.changeTime
  }

  /**
   * Get current direction (1-16)
   * Original: on getDirection me
   * @returns {number} Direction 1-16
   */
  getDirection () {
    // Original: return correctDirection(direction / 100)
    return this._correctDirection(Math.floor(this.direction / 100))
  }

  /**
   * Get direction for wind arrow (direction + 8)
   * Original: on getToDirection me
   * @returns {number} Direction 1-16
   */
  getToDirection () {
    // Original: return correctDirection((direction / 100) + 8)
    return this._correctDirection(Math.floor(this.direction / 100) + 8)
  }

  /**
   * Get current speed (internal scaled value)
   * Original: on getSpeed me
   * @returns {number} Speed (scaled by 100)
   */
  getSpeed () {
    return this.speed
  }

  /**
   * Immediately set wind speed and/or direction
   * Original: on Change me, argSpeed, argDirection
   * @param {number} argSpeed - Speed (0-400) or undefined to keep current
   * @param {number} argDirection - Direction (1-16) or undefined to keep current
   */
  Change (argSpeed, argDirection) {
    // Original: if not voidp(argSpeed) then set speed to integer(argSpeed * 100)
    if (argSpeed !== undefined && argSpeed !== null) {
      this.speed = Math.floor(argSpeed * 100)
    }
    // Original: if not voidp(argDirection) then set direction to argDirection * 100
    if (argDirection !== undefined && argDirection !== null) {
      this.direction = argDirection * 100
    }
  }

  /**
   * Get picture offset for wind indicator sprite
   * Based on speed level (0=strong, 3=light)
   * @returns {number} Picture offset 0-3
   */
  getPicOffset () {
    // Original Lingo line 40-51: speed is already scaled *100,
    // thresholds are 300, 200, 100 (raw values, not *100 again)
    if (this.speed >= 300) {
      return 0
    } else if (this.speed >= 200) {
      return 1
    } else if (this.speed >= 100) {
      return 2
    } else {
      return 3
    }
  }

  /**
   * Correct direction to valid range (1-16)
   * @private
   */
  _correctDirection (dir) {
    if (this.drivingHandlers && this.drivingHandlers.correctDirection) {
      return this.drivingHandlers.correctDirection(dir)
    }
    // Fallback implementation
    dir = dir % 16
    if (dir <= 0) return dir + 16
    return dir
  }

  /**
   * Get velocity point for direction
   * @private
   */
  _getVelPoint (dir) {
    if (this.drivingHandlers && this.drivingHandlers.getVelPoint) {
      return this.drivingHandlers.getVelPoint(dir)
    }
    // Fallback - return zero velocity
    return { x: 0, y: 0 }
  }
}

export default Wind
