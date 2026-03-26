/**
 * DrivingHandlers.js - Direction calculation and radius checking utilities
 * Based on original Lingo: ParentScript 3 - DrivingHandlers.ls
 *
 * Handles:
 * - Direction vector lookup for 16 compass directions
 * - Direction normalization/wrapping
 * - Calculating direction from two points
 * - Radius-based proximity detection
 *
 * Original Lingo properties:
 * - directionList: lookup table of velocity vectors for 16 directions
 * - nrOfDirections: number of directions (16)
 */
'use strict'

export default class DrivingHandlers {
  /**
   * Create driving handlers
   * Original: on new me
   */
  constructor(options = {}) {
    // Original: set nrOfDirections to count(directionList)
    this.nrOfDirections = 16

    if (Array.isArray(options.directionList) && options.directionList.length > 0) {
      this.directionList = options.directionList.map((p) => ({ x: p.x, y: p.y }))
      return
    }

    if (options.mode === 'car') {
      // Lingo (MovieScript 9): DirectionList built at runtime:
      // point(sin(2*N*PI/16) * 100, -cos(2*N*PI/16) * 100)
      this.directionList = DrivingHandlers.buildDirectionList(this.nrOfDirections, 100)
      return
    }

    // Default: boat DirectionList (boten_05.DXR/Internal/10.txt)
    // 16 velocity vectors scaled by 100, direction 1 = NNE going clockwise
    // Note: these are NOT unit vectors - they are game-tuned integer values
    this.directionList = [
      { x: 38, y: -92 },   // 1: NNE
      { x: 70, y: -70 },   // 2: NE
      { x: 92, y: -38 },   // 3: ENE
      { x: 100, y: 0 },    // 4: E
      { x: 92, y: 38 },    // 5: ESE
      { x: 70, y: 70 },    // 6: SE
      { x: 38, y: 92 },    // 7: SSE
      { x: 0, y: 100 },    // 8: S
      { x: -38, y: 92 },   // 9: SSW
      { x: -70, y: 70 },   // 10: SW
      { x: -92, y: 38 },   // 11: WSW
      { x: -100, y: 0 },   // 12: W
      { x: -92, y: -38 },  // 13: WNW
      { x: -70, y: -70 },  // 14: NW
      { x: -38, y: -92 },  // 15: NNW
      { x: 0, y: -100 }    // 16: N
    ]
  }

  /**
   * Build DirectionList using Lingo math (MovieScript 9)
   * @param {number} nrOfDirs
   * @param {number} decimalPrec
   * @returns {{x:number,y:number}[]}
   */
  static buildDirectionList(nrOfDirs = 16, decimalPrec = 100) {
    const list = []
    for (let n = 1; n <= nrOfDirs; n++) {
      const tmp = Math.PI * 2 * n / nrOfDirs
      const x = Math.sin(tmp) * decimalPrec
      const y = -Math.cos(tmp) * decimalPrec
      list.push({ x, y })
    }
    return list
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    return null
  }

  /**
   * Normalize direction to 1-16 range
   * Original: on correctDirection me, theDir
   *
   * @param {number} theDir - Direction value (can be any integer)
   * @returns {number} Direction in range 1-16
   */
  correctDirection(theDir) {
    // Original: set theDir to theDir mod nrOfDirections
    // In JavaScript, % can return negative values, so we handle that
    let dir = theDir % this.nrOfDirections

    // Original: if theDir <= 0 then return theDir + 16
    if (dir <= 0) {
      return dir + 16
    }

    return dir
  }

  /**
   * Get velocity vector for a direction
   * Original: on getVelPoint me, theDir
   *
   * @param {number} theDir - Direction (1-16)
   * @returns {{x: number, y: number}} Velocity vector
   */
  getVelPoint(theDir) {
    // Original: return getAt(directionList, theDir)
    // Lingo is 1-indexed, JS is 0-indexed
    return this.directionList[theDir - 1]
  }

  /**
   * Calculate direction from one point to another
   * Original: on calcDirection me, theStart, theEnd, argOption
   *
   * @param {number[]} theStart - Start point [x, y]
   * @param {number[]} theEnd - End point [x, y]
   * @param {string} [argOption] - 'WithHypo' to also return distance
   * @returns {number|number[]} Direction (1-16) or [direction, distance] if WithHypo
   */
  calcDirection(theStart, theEnd, argOption) {
    const start = Array.isArray(theStart)
      ? { x: theStart[0], y: theStart[1] }
      : theStart
    const end = Array.isArray(theEnd)
      ? { x: theEnd[0], y: theEnd[1] }
      : theEnd

    // Original: set diffX to getAt(theEnd, 1) - getAt(theStart, 1)
    // Original: set diffY to getAt(theStart, 2) - getAt(theEnd, 2)
    // Note: diffY is inverted because screen Y increases downward
    const diffX = end.x - start.x
    const diffY = start.y - end.y

    // Original: set hypo to sqrt((diffX * diffX) + (diffY * diffY))
    const hypo = Math.sqrt((diffX * diffX) + (diffY * diffY))

    // Original: if diffY = 0 then set diffY to 0.1
    // Avoid division by zero
    const safeY = diffY === 0 ? 0.1 : diffY

    // Original: set tempDirection to atan(diffX / float(diffY))
    let tempDirection = Math.atan(diffX / safeY)

    // Adjust angle based on quadrant
    // Original Lingo logic:
    // if diffX > 0:
    //   if diffY > 0: nothing (Q1, already correct)
    //   else: add PI (Q4 -> adjust)
    // else:
    //   if diffY > 0: add 2*PI (Q2 -> wrap around)
    //   else: add PI (Q3 -> adjust)
    if (diffX > 0) {
      if (diffY <= 0) {
        tempDirection = tempDirection + Math.PI
      }
    } else {
      if (diffY > 0) {
        tempDirection = tempDirection + (2 * Math.PI)
      } else {
        tempDirection = tempDirection + Math.PI
      }
    }

    // Original: set tempDirection to tempDirection / PI
    // Original: set tempDirection to integer(tempDirection * nrOfDirections / 2)
    tempDirection = tempDirection / Math.PI
    tempDirection = Math.round(tempDirection * this.nrOfDirections / 2)

    // Original: if tempDirection = 0 then set tempDirection to nrOfDirections
    if (tempDirection === 0) {
      tempDirection = this.nrOfDirections
    }

    // Original: if argOption = #WithHypo then return [tempDirection, hypo]
    if (argOption === 'WithHypo') {
      return [tempDirection, hypo]
    }

    return tempDirection
  }

  /**
   * Check if boat is within inner/outer radius of a target
   * Original: on checkRadius me, argReportObject, argBoatLoc, argLoc, argOption
   *
   * @param {object} argReportObject - Object with radius info and state
   * @param {number[]} argBoatLoc - Boat position [x, y]
   * @param {number[]} argLoc - Target position [x, y]
   * @param {string} [argOption] - 'Inner', 'Outer', or 'both' (default)
   * @returns {string|number} Event name or 0 if no state change
   */
  checkRadius(argReportObject, argBoatLoc, argLoc, argOption) {
    const boatLoc = Array.isArray(argBoatLoc)
      ? { x: argBoatLoc[0], y: argBoatLoc[1] }
      : argBoatLoc
    const objLoc = Array.isArray(argLoc)
      ? { x: argLoc[0], y: argLoc[1] }
      : argLoc

    // Original: set tempDiff to argBoatLoc - argLoc
    // Original: set hypo to sqrt((tempH * tempH) + (tempV * tempV))
    const tempH = boatLoc.x - objLoc.x
    const tempV = boatLoc.y - objLoc.y
    const hypo = Math.sqrt((tempH * tempH) + (tempV * tempV))

    // Original: if voidp(argOption) or (argOption = #both) then
    if (argOption === undefined || argOption === 'both') {
      return this._checkBothRadii(argReportObject, hypo)
    } else if (argOption === 'Inner') {
      return this._checkInnerRadius(argReportObject, hypo)
    } else if (argOption === 'Outer') {
      return this._checkOuterRadius(argReportObject, hypo)
    }

    return 0
  }

  /**
   * Check both inner and outer radii
   * @private
   */
  _checkBothRadii(obj, hypo) {
    if (hypo <= obj.OuterRadius) {
      if (hypo <= obj.InnerRadius) {
        // Inside inner radius
        if (!obj.insideInner) {
          obj.insideInner = true
          if (obj.insideOuter) {
            return 'EnterInnerRadius'
          } else {
            obj.insideOuter = true
            return 'EnterBoth'
          }
        }
      } else {
        // Inside outer but outside inner
        if (!obj.insideOuter) {
          obj.insideOuter = true
          return 'enterOuterRadius'
        }
        if (obj.insideInner) {
          obj.insideInner = false
          return 'ExitInnerRadius'
        }
      }
    } else {
      // Outside outer radius
      if (obj.insideOuter) {
        obj.insideOuter = false
        if (obj.insideInner) {
          obj.insideInner = false
          return 'ExitBoth'
        } else {
          return 'ExitOuterRadius'
        }
      }
    }

    return 0
  }

  /**
   * Check only inner radius
   * @private
   */
  _checkInnerRadius(obj, hypo) {
    if (hypo <= obj.InnerRadius) {
      if (!obj.insideInner) {
        obj.insideInner = true
        return 'EnterInnerRadius'
      }
    } else {
      if (obj.insideInner) {
        obj.insideInner = false
        return 'ExitInnerRadius'
      }
    }
    return 0
  }

  /**
   * Check only outer radius
   * @private
   */
  _checkOuterRadius(obj, hypo) {
    if (hypo <= obj.OuterRadius) {
      if (!obj.insideOuter) {
        obj.insideOuter = true
        return 'enterOuterRadius'
      }
    } else {
      if (obj.insideOuter) {
        obj.insideOuter = false
        return 'ExitOuterRadius'
      }
    }
    return 0
  }
}
