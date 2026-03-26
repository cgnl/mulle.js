/**
 * RecalcBoatProps.js - Calculate derived boat properties
 * Based on original Lingo: MovieScript 30 - RecalcBoatProps.ls
 *
 * Calculates:
 * - RealDepth: Actual water depth based on load
 * - RealResistance: Water resistance based on load
 * - Acceleration/Retardation: Movement physics
 * - Stabilities: Pitch and roll stability
 * - SpeedList: Speed lookup table
 * - CornerPoints: Collision detection points
 */
'use strict'

// Real speed lists from original game (extracted from member "SpeedLists" in boten_05.DXR/Internal/138.txt)
// 250 entries each, already extended by the original Lingo import script (MovieScript 137)
// These are game-tuned speed curves - NOT linear placeholders
const BASE_SPEED_LISTS = {
  Small: [
    1, 2, 4, 5, 6, 13, 16, 17, 17, 17, 19, 22, 25, 26, 27, 27, 28, 28, 29, 30, 30, 30, 31, 31, 32,
    32, 32, 32, 32, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 35, 35, 35, 35, 35, 36, 36, 36, 36, 36, 37,
    37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39,
    39, 39, 39, 39, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 41, 41, 41, 41, 41, 41, 41, 41, 41, 41, 42,
    42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
    42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 43,
    43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
    43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 44,
    44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44,
    44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 45
  ],
  Medium: [
    1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 11, 13, 16, 16, 17, 18, 19, 20, 20, 20, 21, 21, 22,
    22, 22, 23, 23, 24, 24, 24, 25, 25, 26, 26, 26, 27, 27, 28, 28, 28, 29, 29, 30, 30, 30, 31, 31, 32,
    32, 32, 33, 33, 34, 34, 34, 35, 35, 36, 36, 36, 37, 37, 38, 38, 38, 39, 39, 40, 40, 41, 41, 42, 42,
    43, 43, 44, 44, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 47,
    47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47,
    47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 48,
    48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
    48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49,
    49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49,
    49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 50
  ],
  Large: [
    1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 9, 10, 10, 10, 11, 11, 12,
    12, 12, 13, 13, 14, 14, 14, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17,
    17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
    18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
    20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20
  ]
}

export default class RecalcBoatProps {
  /**
   * Recalculate all derived boat properties
   * Original: on recalculateBoatProps argType, argProps
   *
   * @param {string} argType - 'Motor' or 'Sail'
   * @param {object} argProps - Boat properties to modify
   * @param {number} hullWeight - Weight of the hull
   * @returns {object} Modified properties
   */
  static recalculateBoatProps(argType, argProps, hullWeight) {
    const decimalPrec = 100

    // Original: if tmpWeight <= tmpHullWeight then set tmpWeight to tmpHullWeight + 50
    let tmpWeight = argProps.weight
    if (tmpWeight <= hullWeight) {
      tmpWeight = hullWeight + 50
      argProps.weight = tmpWeight
    }

    // Calculate load percentage
    // Original: set tmpLoadPercent to 100 * (tmpWeight - tmpHullWeight) / LoadCapacity
    const tmpLoadPercent = 100 * (tmpWeight - hullWeight) / argProps.LoadCapacity

    // Calculate real depth based on load
    // Original: set tmpRealDepth to tmpMinDepth + (tmpLoadPercent * (MaxDepth - tmpMinDepth) / 100)
    const tmpMinDepth = argProps.depth
    const tmpRealDepth = tmpMinDepth + (tmpLoadPercent * (argProps.MaxDepth - tmpMinDepth) / 100)
    argProps.RealDepth = tmpRealDepth

    // Calculate real resistance based on load
    // Original: set tmpRealResistance to tmpMinResistance + (tmpLoadPercent * (MaxWaterResistance - tmpMinResistance) / 100)
    const tmpMinResistance = argProps.WaterResistance
    const tmpRealResistance = tmpMinResistance + (tmpLoadPercent * (argProps.MaxWaterResistance - tmpMinResistance) / 100)
    argProps.RealResistance = tmpRealResistance

    // For sail boats, calculate power from sail size
    // Original: if argType = #Sail then set tmpPower to SailSize * 60 / 100
    if (argType === 'Sail') {
      const tmpPower = argProps.SailSize * 60 / 100
      argProps.power = tmpPower
    }

    const tmpPower = argProps.power

    // Calculate retardation (deceleration)
    // Original: set retardation to decimalPrec * 200 / (400 + (2 * weight))
    argProps.retardation = decimalPrec * 200 / (400 + (2 * argProps.weight))

    // Calculate acceleration
    // Original: set tmpAcc to (tmpPower + 50) * decimalPrec * 20 / (400 + (2 * weight)) / 11
    let tmpAcc = (tmpPower + 50) * decimalPrec * 20 / (400 + (2 * argProps.weight)) / 11

    // Clamp acceleration
    // Original: if tmpAcc > 100 then set tmpAcc to 100 else if tmpAcc < 30 then set tmpAcc to 30
    if (tmpAcc > 100) {
      tmpAcc = 100
    } else if (tmpAcc < 30) {
      tmpAcc = 30
    }
    argProps.acceleration = tmpAcc

    // Calculate stabilities
    // Original: set tmpStab to 100 - ((tmpWeight - 18) / 20)
    const tmpStab = 100 - ((argProps.weight - 18) / 20)
    let tmpSideStab = tmpStab - argProps.Stability

    // Original: if tmpSideStab < 0 then set tmpSideStab to 0
    if (tmpSideStab < 0) {
      tmpSideStab = 0
    }
    argProps.stabilities = [tmpStab, tmpSideStab]

    // Scale durability
    // Original: set Durability to 1000 * Durability
    argProps.Durability = 1000 * argProps.Durability

    // Double maneuverability
    // Original: set ManoeuverAbility to ManoeuverAbility * 2
    argProps.ManoeuverAbility = argProps.ManoeuverAbility * 2

    return argProps
  }

  /**
   * Get corner points for ship size
   * Original Lingo logic for determining corner points
   *
   * @param {boolean} smallShip - Is small ship
   * @param {boolean} largeShip - Is large ship
   * @returns {Array<{x: number, y: number}>} Three corner points
   */
  static getCornerPoints(smallShip, largeShip) {
    // Original:
    // if SmallShip then set tmpCornerPoints to [point(0, -10), point(-4, 10), point(4, 10)]
    // else if LargeShip then set tmpCornerPoints to [point(0, -20), point(-5, 20), point(5, 20)]
    // else set tmpCornerPoints to [point(0, -15), point(-5, 15), point(5, 15)]
    if (smallShip) {
      return [
        { x: 0, y: -10 },
        { x: -4, y: 10 },
        { x: 4, y: 10 }
      ]
    } else if (largeShip) {
      return [
        { x: 0, y: -20 },
        { x: -5, y: 20 },
        { x: 5, y: 20 }
      ]
    } else {
      // Medium ship
      return [
        { x: 0, y: -15 },
        { x: -5, y: 15 },
        { x: 5, y: 15 }
      ]
    }
  }

  /**
   * Generate speed lookup list for a ship size
   * Original: from recalculateBoatProps
   *
   * @param {string} size - 'Small', 'Medium', or 'Large'
   * @param {number} realResistance - Calculated water resistance
   * @returns {number[]} Speed values for indices 0-249
   */
  static getSpeedList(size, realResistance) {
    // BASE_SPEED_LISTS already contains full 250-entry lists extracted from
    // original Director member "SpeedLists" (boten_05.DXR/Internal/138.txt)
    // No extension needed - data is pre-computed by original Lingo import script
    const baseList = [...BASE_SPEED_LISTS[size]]

    // Scale by resistance
    // Original Lingo line 84: set speedList to (100 - tmpRealResistance) * speedList / 10
    const scaleFactor = (100 - realResistance) / 10
    return baseList.map(v => v * scaleFactor)
  }

  /**
   * Calculate rotated corner points for all 16 directions
   * Original: on calcCornersList argList
   *
   * @param {Array<{x: number, y: number}>} argList - Base corner points
   * @returns {Array<Array<{x: number, y: number}>>} Corner points for each of 16 directions
   */
  static calcCornersList(argList) {
    // Calculate hypotenuse and angle for each point
    const hypos = []
    const orgAngles = []

    for (const point of argList) {
      const tmpX = point.x
      const tmpY = point.y

      // Original: set hypo to sqrt((tmpX * tmpX) + (tmpY * tmpY))
      const hypo = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY))
      hypos.push(hypo)

      // Calculate angle
      let angle
      if (tmpY === 0) {
        // Original: set angle to abs(tmpX) / tmpX * PI / 2
        angle = (Math.abs(tmpX) / tmpX) * Math.PI / 2
      } else {
        // Original: set angle to atan(tmpX / float(tmpY))
        angle = Math.atan(tmpX / tmpY)
      }

      // Adjust angle based on quadrant (same logic as in DrivingHandlers)
      if (tmpX > 0) {
        if (tmpY <= 0) {
          angle = angle + Math.PI
        }
      } else {
        if (tmpY > 0) {
          angle = angle + (2 * Math.PI)
        } else {
          angle = angle + Math.PI
        }
      }

      orgAngles.push(angle)
    }

    // Generate rotated points for each direction
    const corners = []
    const tmpDirs = 16

    for (let n = 1; n <= tmpDirs; n++) {
      const tmpList = []
      const addAngle = 2 * Math.PI * n / tmpDirs

      for (let m = 0; m < argList.length; m++) {
        const angle = orgAngles[m] + addAngle
        const hypo = hypos[m]

        // Original: set newPoint to point(-hypo * sin(angle), hypo * cos(angle))
        const newPoint = {
          x: -hypo * Math.sin(angle),
          y: hypo * Math.cos(angle)
        }
        tmpList.push(newPoint)
      }

      corners.push([...tmpList])
    }

    return corners
  }
}
