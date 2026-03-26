/**
 * RecalcBoatProps.test.js - TDD tests based on original Lingo RecalcBoatProps.ls (MovieScript 30)
 *
 * Calculates derived boat properties based on parts and configuration.
 *
 * Key calculations:
 * - RealDepth: Based on load percentage
 * - RealResistance: Based on load percentage
 * - Acceleration: Based on power and weight
 * - Retardation: Based on weight
 * - Stabilities: Based on weight and stability rating
 * - SpeedList: Lookup table scaled by resistance
 * - CornerPoints: Collision detection points for each direction
 */
'use strict'

import RecalcBoatProps from '../RecalcBoatProps'

describe('RecalcBoatProps', () => {
  describe('recalculateBoatProps', () => {
    let baseProps

    beforeEach(() => {
      // Typical boat properties before calculation
      baseProps = {
        weight: 200,
        LoadCapacity: 500,
        depth: 10,
        MaxDepth: 30,
        WaterResistance: 20,
        MaxWaterResistance: 60,
        power: 100,
        Stability: 10,
        Durability: 5,
        ManoeuverAbility: 10,
        SteerPart: 1,
        Rudder: 1,
        Drift: 5,
        FunnyFactor: 0,
        SmallShip: false,
        LargeShip: false
      }
    })

    test('should calculate RealDepth based on load percentage', () => {
      // hullWeight = 100, weight = 200
      // loadPercent = 100 * (200 - 100) / 500 = 20%
      // realDepth = 10 + (20 * (30 - 10) / 100) = 10 + 4 = 14
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.RealDepth).toBe(14)
    })

    test('should calculate RealResistance based on load percentage', () => {
      // loadPercent = 20%
      // realResistance = 20 + (20 * (60 - 20) / 100) = 20 + 8 = 28
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.RealResistance).toBe(28)
    })

    test('should calculate power from SailSize for sail boats', () => {
      // SailSize * 60 / 100
      baseProps.SailSize = 200
      const result = RecalcBoatProps.recalculateBoatProps('Sail', baseProps, 100)

      expect(result.power).toBe(120) // 200 * 60 / 100
    })

    test('should calculate retardation based on weight', () => {
      // retardation = 100 * 200 / (400 + 2 * weight)
      // = 100 * 200 / (400 + 400) = 20000 / 800 = 25
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.retardation).toBe(25)
    })

    test('should calculate acceleration based on power and weight', () => {
      // acc = (power + 50) * 100 * 20 / (400 + 2 * weight) / 11
      // = (100 + 50) * 100 * 20 / 800 / 11
      // = 150 * 2000 / 800 / 11 = 300000 / 8800 = 34.09
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.acceleration).toBeCloseTo(34, 0)
    })

    test('should clamp acceleration to max 100', () => {
      baseProps.power = 1000 // Very high power
      baseProps.weight = 50 // Low weight
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 50)

      expect(result.acceleration).toBeLessThanOrEqual(100)
    })

    test('should clamp acceleration to min 30', () => {
      baseProps.power = 1 // Very low power
      baseProps.weight = 2000 // Very high weight
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.acceleration).toBeGreaterThanOrEqual(30)
    })

    test('should calculate stabilities based on weight', () => {
      // tmpStab = 100 - ((weight - 18) / 20) = 100 - (182/20) = 100 - 9.1 = 90.9
      // sideStab = tmpStab - Stability = 90.9 - 10 = 80.9
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.stabilities).toBeDefined()
      expect(result.stabilities.length).toBe(2)
      expect(result.stabilities[0]).toBeCloseTo(91, 0) // Main stability
      expect(result.stabilities[1]).toBeCloseTo(81, 0) // Side stability
    })

    test('should clamp sideStab to minimum 0', () => {
      baseProps.Stability = 200 // Very high stability modifier
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.stabilities[1]).toBeGreaterThanOrEqual(0)
    })

    test('should scale Durability by 1000', () => {
      // Original: set Durability to 1000 * Durability
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.Durability).toBe(5000)
    })

    test('should double ManoeuverAbility', () => {
      // Original: set ManoeuverAbility to ManoeuverAbility * 2
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      expect(result.ManoeuverAbility).toBe(20)
    })

    test('should enforce minimum weight above hull weight', () => {
      // If weight <= hullWeight, set weight = hullWeight + 50
      baseProps.weight = 50 // Less than hull weight of 100
      const result = RecalcBoatProps.recalculateBoatProps('Motor', baseProps, 100)

      // Should use adjusted weight for calculations
      expect(result.weight).toBeGreaterThan(100)
    })
  })

  describe('calcCornersList', () => {
    test('should generate corner points for 16 directions', () => {
      const corners = RecalcBoatProps.calcCornersList([
        { x: 0, y: -10 },
        { x: -5, y: 5 },
        { x: 5, y: 5 }
      ])

      expect(corners.length).toBe(16)
    })

    test('should have 3 points per direction', () => {
      const corners = RecalcBoatProps.calcCornersList([
        { x: 0, y: -10 },
        { x: -5, y: 5 },
        { x: 5, y: 5 }
      ])

      corners.forEach(directionPoints => {
        expect(directionPoints.length).toBe(3)
      })
    })

    test('should rotate points for each direction', () => {
      const corners = RecalcBoatProps.calcCornersList([
        { x: 0, y: -10 },
        { x: -5, y: 5 },
        { x: 5, y: 5 }
      ])

      // Direction 1 and direction 9 should be opposite
      // Front point at dir 1: (0, -10) -> at dir 9: (0, 10)
      const dir1Front = corners[0][0]
      const dir9Front = corners[8][0]

      // Should be approximately opposite
      expect(Math.abs(dir1Front.x + dir9Front.x)).toBeLessThan(1)
      expect(Math.abs(dir1Front.y + dir9Front.y)).toBeLessThan(1)
    })

    test('should preserve distance from origin', () => {
      const corners = RecalcBoatProps.calcCornersList([
        { x: 0, y: -10 },
        { x: -5, y: 5 },
        { x: 5, y: 5 }
      ])

      // Front point distance should be 10 for all directions
      corners.forEach(directionPoints => {
        const front = directionPoints[0]
        const distance = Math.sqrt(front.x * front.x + front.y * front.y)
        expect(distance).toBeCloseTo(10, 1)
      })
    })
  })

  describe('getSpeedList', () => {
    test('should return speed list for small ship', () => {
      const speedList = RecalcBoatProps.getSpeedList('Small', 28)

      expect(speedList.length).toBe(250)
    })

    test('should return speed list for medium ship', () => {
      const speedList = RecalcBoatProps.getSpeedList('Medium', 28)

      expect(speedList.length).toBe(250)
    })

    test('should return speed list for large ship', () => {
      const speedList = RecalcBoatProps.getSpeedList('Large', 28)

      expect(speedList.length).toBe(250)
    })

    test('should scale speed list by resistance', () => {
      // speedList = (100 - resistance) * speedList / 10
      const listLowRes = RecalcBoatProps.getSpeedList('Medium', 20)
      const listHighRes = RecalcBoatProps.getSpeedList('Medium', 60)

      // Low resistance should give higher speeds
      expect(listLowRes[100]).toBeGreaterThan(listHighRes[100])
    })
  })

  describe('getCornerPoints', () => {
    test('should return small ship corner points', () => {
      const points = RecalcBoatProps.getCornerPoints(true, false)

      expect(points.length).toBe(3)
      // Small ship: [point(0, -10), point(-4, 10), point(4, 10)]
      expect(points[0].y).toBe(-10)
    })

    test('should return large ship corner points', () => {
      const points = RecalcBoatProps.getCornerPoints(false, true)

      expect(points.length).toBe(3)
      // Large ship: [point(0, -20), point(-5, 20), point(5, 20)]
      expect(points[0].y).toBe(-20)
    })

    test('should return medium ship corner points by default', () => {
      const points = RecalcBoatProps.getCornerPoints(false, false)

      expect(points.length).toBe(3)
      // Medium ship: [point(0, -15), point(-5, 15), point(5, 15)]
      expect(points[0].y).toBe(-15)
    })
  })
})
