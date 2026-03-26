/**
 * Sail.js - Sail object for sailboats
 * @module objects/weather/Sail
 * 
 * Direct port of ParentScript 38 - Sail.ls from original Lingo
 * 
 * Properties from original:
 * - direction: sail direction (1-16)
 * - SP: sprite channel
 * - firstFrame: base frame for sail sprite
 * - tightness: how tight the sail is pulled (0-4)
 * - reportObject: parent SailBoatAncestor
 * - forceList: force values for each angle [0, 20, 70, 80, 100]
 * - oldDiff: previous direction difference (for smoothing)
 */
'use strict'

class Sail {
  /**
   * Create Sail instance
   * @param {Object} reportObject - Parent SailBoatAncestor
   * @param {Object} drivingHandlers - DrivingHandlers for direction calculations
   * @param {Object} weatherRenderer - WeatherRenderer with wind object
   */
  constructor(reportObject, drivingHandlers, weatherRenderer) {
    this.reportObject = reportObject
    this.drivingHandlers = drivingHandlers
    this.weatherRenderer = weatherRenderer

    // Original: set direction to 1
    this.direction = 1

    // Original: set SP to getProp(the spriteList of gDir, #Sail)
    this.SP = null // Set by renderer

    // Original: set firstFrame to -1 + the number of member "Segel0000"
    this.firstFrame = 0 // Will be set by renderer

    // Original: set tightness to 2
    this.tightness = 2

    // Original: set forceList to [0, 20, 70, 80, 100]
    // Index 0 = 4 directions from wind (perpendicular) = 0 force
    // Index 4 = 0 directions from wind (aligned) = 100 force
    this.forceList = [0, 20, 70, 80, 100]

    // Original: set oldDiff to 0
    this.oldDiff = 0

    // Picture offset for sprite
    this.picOffset = 0

    // Visuals: Create Sail Sprite
    if (this.reportObject && this.reportObject.child && this.reportObject.child.game) {
      const game = this.reportObject.child.game
      try {
        // "Segel" is typical Lingo name for Sail
        // Lingo: "set firstFrame to -1 + the number of member "Segel0000"
        // We'll use 'Segel' as the key and frames 0..N
        this.sprite = game.add.sprite(0, 0, 'Segel', 0)
        this.sprite.anchor.set(0.5)
        // Z-order: Sail should be above Hull (which is Z=100)
        this.sprite.z = 101
        this.sprite.visible = true
      } catch (e) {
        console.warn('Sail: Failed to create sprite', e)
      }
    }
  }

  /**
   * Kill sail
   * Original: on kill me
   */
  kill() {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
    // .ls line 17: return 0
    return 0
  }

  /**
   * Set sail direction
   * Original: on setDirection me, theDir
   * @param {number} theDir - Direction (1-16)
   */
  setDirection(theDir) {
    this.direction = theDir
  }

  /**
   * Adjust sail tightness
   * Original: on setTightness me, how
   * @param {number} how - Amount to adjust (+/-)
   */
  setTightness(how) {
    // Original: set tightness to tightness + how
    this.tightness = this.tightness + how

    // Clamp to 0-4
    // Original: if tightness < 0 then set tightness to 0
    //           if tightness > 4 then set tightness to 4
    if (this.tightness < 0) {
      this.tightness = 0
    } else if (this.tightness > 4) {
      this.tightness = 4
    }
  }

  /**
   * Calculate sail direction based on wind and boat heading
   * Original: on calcDirection me, theDir
   * @param {number} theDir - Boat direction (1-16)
   */
  calcDirection(theDir) {
    // Get scoot input from report object
    let tmpScoot = this.reportObject ? this.reportObject.scooting : 0

    // Original: if the shiftDown then set tmpScoot to -1
    //           else if the controlDown then set tmpScoot to 1
    // (handled by input system, passed via reportObject.scooting)

    // Adjust tightness based on scoot
    this.setTightness(tmpScoot)

    // Get wind direction
    // Original: set windDir to getToDirection(the wind of the weatherRenderer of gDir)
    let windDir = 8 // Default
    if (this.weatherRenderer && this.weatherRenderer.wind) {
      // getToDirection returns direction + 8 (wind arrow points where wind comes FROM)
      windDir = this._correctDirection(this.weatherRenderer.wind.getDirection() + 8)
    }

    // Correct boat direction
    // Original: set theDir to correctDirection(theDir - 8)
    theDir = this._correctDirection(theDir - 8)

    // Calculate difference between wind and boat direction
    // Original: set tmpDiff to windDir - theDir
    let tmpDiff = windDir - theDir

    // Handle wrap-around
    // Original: if tmpDiff > 8 then set tmpDiff to tmpDiff - 16
    //           if tmpDiff < -8 then set tmpDiff to tmpDiff + 16
    if (tmpDiff > 8) {
      tmpDiff = tmpDiff - 16
    } else if (tmpDiff < -8) {
      tmpDiff = tmpDiff + 16
    }

    // Clamp to tightness
    // Original: if abs(tmpDiff) > tightness then
    //             set tmpDiff to tmpDiff / abs(tmpDiff) * tightness
    //             set direction to theDir + tmpDiff
    //           else
    //             set direction to windDir
    if (Math.abs(tmpDiff) > this.tightness) {
      tmpDiff = Math.sign(tmpDiff) * this.tightness
      this.oldDiff = tmpDiff
      this.direction = theDir + tmpDiff
    } else {
      this.oldDiff = tmpDiff
      this.direction = windDir
    }

    // Correct direction
    this.direction = this._correctDirection(this.direction)
  }

  /**
   * Set inclinations for sail sprite rendering
   * Original: on setinclinations me, theList
   * @param {Array} theList - [frontBack, side] inclination values
   */
  setInclinations(theList) {
    // Original just updates sprite member
    // set the member of sprite SP to member (firstFrame + direction)
    this.inclinations = theList
  }

  /**
   * Lingo alias: on setinclinations me, theList
   * Preserve original casing for parity.
   */
  setinclinations(theList) {
    return this.setInclinations(theList)
  }

  /**
   * Set picture offset for sprite
   * Original: on setPic me, argOffset
   * @param {number} argOffset - Frame offset
   */
  setPic(argOffset) {
    // Original: set the member of sprite SP to member (firstFrame + argOffset)
    this.picOffset = argOffset

    if (this.sprite) {
      this.sprite.frame = this.firstFrame + argOffset
    }
  }

  /**
   * Get force from sail based on wind angle
   * Original: on getForce me
   * @returns {number} Force value
   */
  getForce() {
    // Get wind direction from weather renderer
    let windDir = 8
    let windSpeed = 200 * 100 // Default

    if (this.weatherRenderer && this.weatherRenderer.wind) {
      windDir = this.weatherRenderer.wind.getDirection()
      windSpeed = this.weatherRenderer.wind.getSpeed()
    }

    // Calculate force based on angle to wind
    // Original: set Force to abs(direction - getDirection(wind))
    let Force = Math.abs(this.direction - windDir)

    // Original: if Force >= 8 then set Force to Force - 8
    if (Force >= 8) {
      Force = Force - 8
    }

    // Original: if Force > 4 then set Force to 8 - Force
    if (Force > 4) {
      Force = 8 - Force
    }

    // Lookup force from list and scale by wind speed
    // Original: return getAt(forceList, Force + 1) * getSpeed(wind) / 1000
    const forceValue = this.forceList[Force] || 0
    return forceValue * windSpeed / 1000
  }

  /**
   * Loop (placeholder for animation)
   * Original: on loop me (empty in original)
   */
  loop() {
    // Empty in original
  }

  /**
   * Correct direction to valid range (1-16)
   * @private
   */
  _correctDirection(dir) {
    if (this.drivingHandlers && this.drivingHandlers.correctDirection) {
      return this.drivingHandlers.correctDirection(dir)
    }
    dir = dir % 16
    if (dir <= 0) return dir + 16
    return dir
  }
}

export default Sail
