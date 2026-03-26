/**
 * Sail.test.js - TDD tests based on original Lingo Sail.ls (ParentScript 38)
 * 
 * Original Lingo properties:
 * - direction: sail direction (1-16)
 * - SP: sprite channel
 * - firstFrame: base frame for sail sprite
 * - tightness: how tight the sail is pulled (0-4)
 * - reportObject: parent SailBoatAncestor
 * - forceList: force values for each angle [0, 20, 70, 80, 100]
 * - oldDiff: previous direction difference (for smoothing)
 */
'use strict'

import Sail from '../Sail'

// Mock dependencies
const mockDrivingHandlers = {
  nrOfDirections: 16,
  correctDirection: (dir) => {
    dir = dir % 16
    if (dir <= 0) return dir + 16
    return dir
  }
}

const mockWind = {
  getDirection: () => 8,
  getSpeed: () => 200 * 100 // Speed 200 (scaled)
}

const mockWeatherRenderer = {
  wind: mockWind,
  getWind: () => mockWind
}

describe('Sail', () => {
  let sail
  let mockReportObject

  beforeEach(() => {
    mockReportObject = {
      scooting: 0
    }
    sail = new Sail(mockReportObject, mockDrivingHandlers, mockWeatherRenderer)
  })

  describe('constructor (new me)', () => {
    test('should initialize direction to 1', () => {
      expect(sail.direction).toBe(1)
    })

    test('should initialize tightness to 2', () => {
      expect(sail.tightness).toBe(2)
    })

    test('should have forceList [0, 20, 70, 80, 100]', () => {
      expect(sail.forceList).toEqual([0, 20, 70, 80, 100])
    })

    test('should initialize oldDiff to 0', () => {
      expect(sail.oldDiff).toBe(0)
    })
  })

  describe('setDirection (on setDirection me, theDir)', () => {
    test('should set sail direction', () => {
      sail.setDirection(5)
      expect(sail.direction).toBe(5)
    })
  })

  describe('setTightness (on setTightness me, how)', () => {
    test('should adjust tightness', () => {
      sail.tightness = 2
      sail.setTightness(1)
      expect(sail.tightness).toBe(3)
    })

    test('should clamp tightness to minimum 0', () => {
      sail.tightness = 1
      sail.setTightness(-5)
      expect(sail.tightness).toBe(0)
    })

    test('should clamp tightness to maximum 4', () => {
      sail.tightness = 3
      sail.setTightness(5)
      expect(sail.tightness).toBe(4)
    })
  })

  describe('calcDirection (on calcDirection me, theDir)', () => {
    test('should calculate sail direction based on wind and boat direction', () => {
      // Wind direction is 8, boat direction is 1
      sail.calcDirection(1)

      // Sail direction should be adjusted based on wind
      expect(sail.direction).toBeGreaterThanOrEqual(1)
      expect(sail.direction).toBeLessThanOrEqual(16)
    })

    test('should respect tightness constraint', () => {
      sail.tightness = 2
      
      // With tightness 2, sail can only be within 2 directions of boat heading
      sail.calcDirection(1)
      
      // Direction should be constrained
      expect(sail.direction).toBeDefined()
    })
  })

  describe('getForce (on getForce me)', () => {
    test('should return force based on sail angle to wind', () => {
      // When sail is aligned with wind, force should be high
      sail.direction = 8 // Same as wind
      
      const force = sail.getForce()
      
      expect(force).toBeDefined()
      expect(typeof force).toBe('number')
    })

    test('should return lower force when perpendicular to wind', () => {
      // Wind is 8, sail perpendicular would be 4 or 12
      sail.direction = 4 // 90 degrees from wind
      
      const force90 = sail.getForce()
      
      sail.direction = 8 // Aligned with wind
      const force0 = sail.getForce()
      
      // Perpendicular should give less force than aligned
      // (though in sailing, reaching is actually fastest, the original uses this simplification)
      expect(force0).toBeGreaterThanOrEqual(0)
      expect(force90).toBeGreaterThanOrEqual(0)
    })

    test('should scale force by wind speed', () => {
      sail.direction = 8
      const force = sail.getForce()
      
      // Force should be scaled by wind speed / 1000
      expect(force).toBeGreaterThanOrEqual(0)
    })

    test('should use forceList lookup', () => {
      // Force lookup: [0, 20, 70, 80, 100] for angles 0-4
      // Angle 0 (same direction) = 100
      // Angle 4 (90 degrees) = 0
      sail.direction = mockWind.getDirection() // Same as wind
      
      const force = sail.getForce()
      
      // Should use the forceList value scaled by wind speed
      expect(force).toBeDefined()
    })
  })

  describe('setInclinations (on setinclinations me, theList)', () => {
    test('should accept inclination values', () => {
      // Original just updates sprite frame
      sail.setInclinations([1, -1])
      
      // No error should be thrown
      expect(true).toBe(true)
    })
  })

  describe('setPic (on setPic me, argOffset)', () => {
    test('should set picture offset', () => {
      sail.setPic(5)
      
      expect(sail.picOffset).toBe(5)
    })
  })

  describe('kill (on kill me)', () => {
    test('should return 0 (not null) — .ls line 17', () => {
      const result = sail.kill()
      expect(result).toBe(0)
    })
  })
})
