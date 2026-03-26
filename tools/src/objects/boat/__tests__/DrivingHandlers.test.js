/**
 * DrivingHandlers.test.js - TDD tests based on original Lingo DrivingHandlers.ls (ParentScript 3)
 *
 * Utility class for direction calculations and radius checking.
 *
 * Original Lingo properties:
 * - directionList: lookup table of velocity vectors for 16 directions
 * - nrOfDirections: number of directions (16)
 */
'use strict'

import DrivingHandlers from '../DrivingHandlers'

describe('DrivingHandlers', () => {
  let handlers

  beforeEach(() => {
    handlers = new DrivingHandlers()
  })

  describe('constructor (new me)', () => {
    test('should initialize nrOfDirections to 16', () => {
      // Original: set nrOfDirections to count(directionList)
      expect(handlers.nrOfDirections).toBe(16)
    })

    test('should initialize directionList with 16 entries', () => {
      // Original: set directionList to value(the text of member "DirectionList")
      expect(handlers.directionList.length).toBe(16)
    })

    test('should have valid velocity vectors', () => {
      // Each direction should have {x, y} velocity components
      handlers.directionList.forEach((vel, i) => {
        expect(vel).toHaveProperty('x')
        expect(vel).toHaveProperty('y')
      })
    })
  })

  describe('kill (on kill me)', () => {
    test('should return null', () => {
      // Original: return 0
      expect(handlers.kill()).toBeNull()
    })
  })

  describe('correctDirection (on correctDirection me, theDir)', () => {
    test('should keep direction within 1-16 range', () => {
      // Original: set theDir to theDir mod nrOfDirections
      expect(handlers.correctDirection(5)).toBe(5)
    })

    test('should wrap direction above 16', () => {
      // 17 mod 16 = 1
      expect(handlers.correctDirection(17)).toBe(1)
    })

    test('should wrap direction of 32', () => {
      // 32 mod 16 = 0, then + 16 = 16
      expect(handlers.correctDirection(32)).toBe(16)
    })

    test('should handle 0 direction', () => {
      // Original: if theDir <= 0 then return theDir + 16
      // 0 mod 16 = 0, 0 <= 0, so return 0 + 16 = 16
      expect(handlers.correctDirection(0)).toBe(16)
    })

    test('should handle negative direction', () => {
      // -1 mod 16 in Lingo = -1, -1 <= 0, so return -1 + 16 = 15
      expect(handlers.correctDirection(-1)).toBe(15)
    })

    test('should handle direction exactly at 16', () => {
      // 16 mod 16 = 0, 0 <= 0, so return 16
      expect(handlers.correctDirection(16)).toBe(16)
    })
  })

  describe('getVelPoint (on getVelPoint me, theDir)', () => {
    test('should return velocity vector for direction 1 (NNE)', () => {
      // Direction 1 = NNE from original DirectionList member
      const vel = handlers.getVelPoint(1)
      expect(vel).toEqual({ x: 38, y: -92 })
    })

    test('should return velocity vector for direction 4 (E)', () => {
      // Direction 4 = East
      const vel = handlers.getVelPoint(4)
      expect(vel).toEqual({ x: 100, y: 0 })
    })

    test('should return velocity vector for direction 8 (S)', () => {
      // Direction 8 = South
      const vel = handlers.getVelPoint(8)
      expect(vel).toEqual({ x: 0, y: 100 })
    })

    test('should return velocity vector for direction 12 (W)', () => {
      // Direction 12 = West
      const vel = handlers.getVelPoint(12)
      expect(vel).toEqual({ x: -100, y: 0 })
    })

    test('should return velocity vector for direction 16 (N)', () => {
      // Direction 16 = North
      const vel = handlers.getVelPoint(16)
      expect(vel).toEqual({ x: 0, y: -100 })
    })
  })

  describe('calcDirection (on calcDirection me, theStart, theEnd, argOption)', () => {
    // The original Lingo calcDirection maps angles to 16 directions
    // Direction 1 = North (0°), going clockwise:
    // The calculation: angle / PI, then * 8, gives the direction
    // Due to the specific atan logic, the mapping may differ slightly

    test('should calculate direction for north movement', () => {
      // Moving from (100, 100) to (100, 50) is north
      // diffX = 0, diffY = 50 (positive = north in inverted coords)
      // atan(0/50) = 0, diffX <= 0 && diffY > 0 -> +2*PI = 2*PI
      // 2*PI / PI = 2, 2 * 8 = 16
      const dir = handlers.calcDirection([100, 100], [100, 50])
      expect(dir).toBe(16) // Maps to 16 (which is also "north" position)
    })

    test('should calculate direction for south movement', () => {
      // Moving from (100, 100) to (100, 200) is south
      // diffX = 0, diffY = -100 (negative = south)
      // atan(0/-100) = 0, diffX <= 0 && diffY <= 0 -> +PI
      // PI / PI = 1, 1 * 8 = 8
      const dir = handlers.calcDirection([100, 100], [100, 200])
      expect(dir).toBe(8) // South
    })

    test('should calculate direction for east movement', () => {
      // Moving from (100, 100) to (200, 100) is east
      // diffX = 100, diffY = 0 -> safeY = 0.1
      // atan(100/0.1) ~ PI/2, diffX > 0 && diffY <= 0 -> +PI
      // ~3*PI/2 / PI = 1.5, 1.5 * 8 = 12
      const dir = handlers.calcDirection([100, 100], [200, 100])
      expect(dir).toBe(12) // East maps to 12 in this system
    })

    test('should calculate direction for west movement', () => {
      // Moving from (100, 100) to (0, 100) is west
      // diffX = -100, diffY = 0 -> safeY = 0.1
      // atan(-100/0.1) ~ -PI/2, diffX <= 0 && diffY <= 0 -> +PI
      // ~PI/2 / PI = 0.5, 0.5 * 8 = 4
      const dir = handlers.calcDirection([100, 100], [0, 100])
      expect(dir).toBe(4) // West maps to 4 in this system
    })

    test('should calculate direction for northeast movement', () => {
      // Moving from (100, 100) to (200, 0) is northeast
      // diffX = 100, diffY = 100
      // atan(100/100) = PI/4, diffX > 0 && diffY > 0 -> no adjustment
      // (PI/4) / PI = 0.25, 0.25 * 8 = 2
      const dir = handlers.calcDirection([100, 100], [200, 0])
      expect(dir).toBe(2) // Northeast maps to 2
    })

    test('should return direction with hypo when option is #WithHypo', () => {
      // Moving 30 units east, 40 units north (3-4-5 triangle scaled by 10)
      const result = handlers.calcDirection([100, 140], [130, 100], 'WithHypo')

      expect(Array.isArray(result)).toBe(true)
      expect(result.length).toBe(2)
      expect(result[1]).toBeCloseTo(50, 1) // Hypotenuse = sqrt(30^2 + 40^2) = 50
    })
  })

  describe('checkRadius (on checkRadius me, argReportObject, argBoatLoc, argLoc, argOption)', () => {
    let reportObject

    beforeEach(() => {
      reportObject = {
        OuterRadius: 100,
        InnerRadius: 50,
        insideOuter: false,
        insideInner: false
      }
    })

    test('should return EnterBoth when entering both radii at once', () => {
      // Boat at (0, 0), target at (0, 25) = distance 25, inside both radii
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 25])

      expect(result).toBe('EnterBoth')
      expect(reportObject.insideOuter).toBe(true)
      expect(reportObject.insideInner).toBe(true)
    })

    test('should return enterOuterRadius when entering outer only', () => {
      // Boat at (0, 0), target at (0, 75) = distance 75, inside outer only
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 75])

      expect(result).toBe('enterOuterRadius')
      expect(reportObject.insideOuter).toBe(true)
      expect(reportObject.insideInner).toBe(false)
    })

    test('should return EnterInnerRadius when entering inner while already in outer', () => {
      reportObject.insideOuter = true
      // Already in outer, now entering inner (distance 25)
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 25])

      expect(result).toBe('EnterInnerRadius')
      expect(reportObject.insideInner).toBe(true)
    })

    test('should return ExitInnerRadius when leaving inner but staying in outer', () => {
      reportObject.insideOuter = true
      reportObject.insideInner = true
      // Distance 75, inside outer but outside inner
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 75])

      expect(result).toBe('ExitInnerRadius')
      expect(reportObject.insideOuter).toBe(true)
      expect(reportObject.insideInner).toBe(false)
    })

    test('should return ExitOuterRadius when leaving outer', () => {
      reportObject.insideOuter = true
      // Distance 150, outside both radii
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 150])

      expect(result).toBe('ExitOuterRadius')
      expect(reportObject.insideOuter).toBe(false)
    })

    test('should return ExitBoth when leaving both radii at once', () => {
      reportObject.insideOuter = true
      reportObject.insideInner = true
      // Distance 150, outside both radii
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 150])

      expect(result).toBe('ExitBoth')
      expect(reportObject.insideOuter).toBe(false)
      expect(reportObject.insideInner).toBe(false)
    })

    test('should return 0 when no state change', () => {
      // Distance 150, already outside
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 150])

      expect(result).toBe(0)
    })

    test('should check only Inner radius when argOption is Inner', () => {
      // Distance 25, checking only inner
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 25], 'Inner')

      expect(result).toBe('EnterInnerRadius')
      expect(reportObject.insideInner).toBe(true)
      // Outer should not be set
      expect(reportObject.insideOuter).toBe(false)
    })

    test('should check only Outer radius when argOption is Outer', () => {
      // Distance 75, checking only outer
      const result = handlers.checkRadius(reportObject, [0, 0], [0, 75], 'Outer')

      expect(result).toBe('enterOuterRadius')
      expect(reportObject.insideOuter).toBe(true)
    })
  })
})
