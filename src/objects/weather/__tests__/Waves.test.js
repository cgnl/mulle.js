/**
 * Waves.test.js - TDD tests based on original Lingo Waves.ls
 * 
 * Original Lingo properties:
 * - speed: wave speed
 * - waveAngle: wave direction in radians
 * - amplitude: wave height
 * - period: wave period (30 + speed * 30)
 * - phase: current phase position
 * - amplitudeList: 100-entry sine wave lookup table
 * - corners: corner points for each direction (16 directions)
 * - waveObjs: array of SingleWave objects
 * - waveSPs: available sprite channels
 * - deleteList: waves to remove
 * - waveVelPoint: wave velocity
 * - spawnLines: spawn positions for each direction
 * - currentSpawnLine: current spawn line
 * - direction: wave direction (1-16)
 */
'use strict'

import Waves from '../Waves'

// Mock DrivingHandlers
const mockDrivingHandlers = {
  nrOfDirections: 16,
  correctDirection: (dir) => {
    dir = dir % 16
    if (dir <= 0) return dir + 16
    return dir
  }
}

describe('Waves', () => {
  let waves

  beforeEach(() => {
    waves = new Waves(mockDrivingHandlers)
  })

  describe('constructor (new me)', () => {
    test('should initialize with default values', () => {
      expect(waves.phase).toBe(0)
      expect(waves.waveObjs).toEqual([])
      expect(waves.corners).toEqual([])
      expect(waves.deleteList).toEqual([])
    })

    test('should have amplitudeList with 100 entries', () => {
      // Original: set amplitudeList to value(the text of member "AmplitudeList")
      // This is a 100-entry sine wave table
      expect(waves.amplitudeList).toBeDefined()
      expect(waves.amplitudeList.length).toBe(100)
    })

    test('should have spawnLines for 16 directions', () => {
      // Original: set spawnLines to value(the text of member "spawnLines")
      expect(waves.spawnLines).toBeDefined()
      expect(Object.keys(waves.spawnLines).length).toBe(16)
    })
  })

  // .ls line 21-22: on init me (empty handler)
  describe('init (.ls line 21)', () => {
    test('should exist as a callable method', () => {
      expect(typeof waves.init).toBe('function')
      // Original is empty — just needs to exist so loopMaster can call it
      expect(waves.init()).toBeUndefined()
    })
  })

  // .ls line 24-27: on kill me
  //   deleteObject(the loopMaster of gMulleGlobals, me)
  //   return 0
  describe('kill (.ls line 24)', () => {
    test('should return 0 (.ls line 26)', () => {
      expect(waves.kill()).toBe(0)
    })

    test('should call loopMaster.deleteObject if available (.ls line 25)', () => {
      const mockLoopMaster = { deleteObject: jest.fn() }
      waves.loopMaster = mockLoopMaster
      waves.kill()
      expect(mockLoopMaster.deleteObject).toHaveBeenCalledWith(waves)
    })

    test('should not crash if no loopMaster', () => {
      waves.loopMaster = null
      expect(() => waves.kill()).not.toThrow()
    })
  })

  // .ls line 153-158: on deleteObjects me
  describe('deleteObjects (.ls line 153)', () => {
    test('should remove waves in deleteList from waveObjs', () => {
      const mockWave = { loop: jest.fn() }
      waves.waveObjs = [mockWave]
      waves.deleteList = [mockWave]

      waves.deleteObjects()

      expect(waves.waveObjs).not.toContain(mockWave)
      expect(waves.deleteList.length).toBe(0)
    })

    test('should clear deleteList after processing', () => {
      waves.deleteList = [{ loop: jest.fn() }]
      waves.waveObjs = []
      waves.deleteObjects()
      expect(waves.deleteList).toEqual([])
    })
  })

  // .ls line 197-198: on getVelPoint me (empty handler)
  describe('getVelPoint (.ls line 197)', () => {
    test('should exist as a callable method', () => {
      expect(typeof waves.getVelPoint).toBe('function')
      // Original is empty — return undefined
      expect(waves.getVelPoint()).toBeUndefined()
    })
  })

  describe('setCornerPoints (on setCornerPoints me, theList)', () => {
    test('should calculate corner points for all 16 directions', () => {
      // Original: calculates rotated corner points for each direction
      waves.setCornerPoints([
        { x: 0, y: -10 },
        { x: -5, y: 5 },
        { x: 5, y: 5 }
      ])

      expect(waves.corners.length).toBe(16)
      
      // Each direction should have 3 corner points
      expect(waves.corners[0].length).toBe(3)
      expect(waves.corners[15].length).toBe(3)
    })

    test('should use default corner points if none provided', () => {
      waves.setCornerPoints()

      expect(waves.corners.length).toBe(16)
      // Default is [point(0, -10), point(-5, 5), point(5, 5)]
      expect(waves.corners[0].length).toBe(3)
    })
  })

  describe('setDirection (on setDirection me, argDir, argSpeed)', () => {
    test('should set wave direction and speed', () => {
      waves.setDirection(5, 2)

      // Original: set direction to correctDirection(argDir + 8)
      expect(waves.direction).toBe(13) // 5 + 8 = 13

      // Original: set speed to integer(argSpeed)
      expect(waves.speed).toBe(2)
    })

    test('should calculate wave angle', () => {
      waves.setDirection(1, 2)

      // Original: set waveAngle to direction * PI / 8.0
      // direction = 9 (1 + 8), waveAngle = 9 * PI / 8
      expect(waves.waveAngle).toBeCloseTo(9 * Math.PI / 8, 5)
    })

    test('should calculate wave velocity point', () => {
      waves.setDirection(1, 2)

      // Original: set waveVelPoint to point(10 * speed * sin(waveAngle), -10 * speed * cos(waveAngle))
      const expectedX = 10 * 2 * Math.sin(9 * Math.PI / 8)
      const expectedY = -10 * 2 * Math.cos(9 * Math.PI / 8)
      
      expect(waves.waveVelPoint.x).toBeCloseTo(expectedX, 1)
      expect(waves.waveVelPoint.y).toBeCloseTo(expectedY, 1)
    })

    test('should calculate amplitude based on speed', () => {
      waves.setDirection(1, 3)

      // Original: set amplitude to speed * 30
      expect(waves.amplitude).toBe(3 * 30) // 90
    })

    test('should calculate period based on speed', () => {
      waves.setDirection(1, 2)

      // Original: set period to 30 + (speed * 30)
      expect(waves.period).toBe(30 + 2 * 30) // 90
    })

    test('should not create waves when speed is 0', () => {
      waves.setDirection(1, 0)

      expect(waves.speed).toBe(0)
      expect(waves.waveObjs.length).toBe(0)
    })
  })

  describe('getTopoInfo (on getTopoInfo me, theCenter, theDir, argCorners)', () => {
    beforeEach(() => {
      waves.setDirection(5, 2)
      waves.setCornerPoints()
    })

    test('should return [avgAlt, frontBackInclination, sideInclination]', () => {
      const result = waves.getTopoInfo({ x: 320, y: 240 }, 5, waves.corners[4])

      expect(result).toBeDefined()
      expect(result.length).toBe(3)
      
      // [avgAlt, frontBackInclination, sideInclination]
      expect(typeof result[0]).toBe('number') // avgAlt
      expect(typeof result[1]).toBe('number') // frontBack
      expect(typeof result[2]).toBe('number') // side
    })

    test('should calculate inclinations from corner altitudes', () => {
      // Original:
      // frontBackInclination = alts[1] - ((alts[2] + alts[3]) / 2)
      // sideInclination = alts[2] - alts[3]
      const result = waves.getTopoInfo({ x: 320, y: 240 }, 5, waves.corners[4])

      // Values should be reasonable (not NaN, not infinity)
      expect(isFinite(result[0])).toBe(true)
      expect(isFinite(result[1])).toBe(true)
      expect(isFinite(result[2])).toBe(true)
    })
  })

  describe('getAltitude (on getAltitude me, aPoint)', () => {
    beforeEach(() => {
      waves.setDirection(5, 2)
    })

    test('should calculate altitude based on position and phase', () => {
      const alt1 = waves.getAltitude({ x: 100, y: 100 })
      const alt2 = waves.getAltitude({ x: 200, y: 200 })

      // Different positions should give different altitudes (usually)
      expect(typeof alt1).toBe('number')
      expect(typeof alt2).toBe('number')
    })

    test('should use amplitudeList lookup table', () => {
      // Original uses sine wave lookup: getAt(amplitudeList, whereInPeriod)
      // Remove big-wave contributions to isolate amplitudeList scaling
      waves.waveObjs = []
      const alt = waves.getAltitude({ x: 100, y: 100 })
      
      // Should return a value scaled by amplitude
      expect(Math.abs(alt)).toBeLessThanOrEqual((waves.amplitude / 2) + 0.001)
    })
  })

  describe('loop (on loop me)', () => {
    beforeEach(() => {
      waves.setDirection(5, 2)
    })

    test('should update phase', () => {
      const initialPhase = waves.phase
      waves.loop()

      // Original: set phase to (phase + speed) mod period
      expect(waves.phase).toBe((initialPhase + waves.speed) % waves.period)
    })

    test('should process wave objects', () => {
      // Add a mock wave
      const mockWave = {
        loop: jest.fn(),
        active: true
      }
      waves.waveObjs.push(mockWave)

      waves.loop()

      expect(mockWave.loop).toHaveBeenCalled()
    })

    test('should remove waves in deleteList', () => {
      const mockWave = { loop: jest.fn(), active: true }
      waves.waveObjs.push(mockWave)
      waves.deleteList.push(mockWave)

      waves.loop()

      expect(waves.waveObjs).not.toContain(mockWave)
      expect(waves.deleteList.length).toBe(0)
    })
  })

  describe('Stopped (on Stopped me, theObj)', () => {
    test('should add wave to deleteList', () => {
      const mockWave = { SP: 10, kill: jest.fn() }
      waves.waveObjs.push(mockWave)

      waves.Stopped(mockWave)

      expect(waves.deleteList).toContain(mockWave)
    })

    test('should return sprite to available pool', () => {
      const mockWave = { SP: 10, kill: jest.fn() }
      waves.waveSPs = [11, 12]
      waves.waveObjs.push(mockWave)

      waves.Stopped(mockWave)

      expect(waves.waveSPs).toContain(10)
    })
  })
})
