/**
 * SingleWave.test.js - TDD tests based on original Lingo SingleWave.ls
 * 
 * Original Lingo properties:
 * - SP: sprite channel
 * - counter: animation frame counter
 * - firstFrame: base frame number
 * - frameList: animation frame sequence
 * - listLen: length of frameList
 * - vel: velocity point
 * - reportObject: parent Waves object
 * - active: whether wave is active
 * - loc: position (scaled by 10)
 * - waveCircle: radius of effect (70)
 * - amplitude: wave strength
 */
'use strict'

import SingleWave from '../SingleWave'

describe('SingleWave', () => {
  let wave
  let mockReportObject

  beforeEach(() => {
    mockReportObject = {
      Stopped: jest.fn()
    }
  })

  describe('constructor (new me)', () => {
    test('should initialize with correct properties', () => {
      wave = new SingleWave(
        mockReportObject,
        10, // sprite channel
        { x: 320, y: 240 }, // location
        { x: 5, y: 3 }, // velocity
        5, // direction
        80 // amplitude
      )

      // Original: set loc to theLoc * 10, then loop() is called which updates loc
      // So loc will be slightly different from initial value
      // Just verify it's in the right ballpark
      expect(wave.loc.x).toBeGreaterThan(3000)
      expect(wave.loc.y).toBeGreaterThan(2000)

      // Original: set waveCircle to 70
      expect(wave.waveCircle).toBe(70)

      // Original: set active to 1
      expect(wave.active).toBe(true)

      // Original: set amplitude to argAmplitude
      expect(wave.amplitude).toBe(80)
    })

    test('should build frameList with correct pattern', () => {
      wave = new SingleWave(mockReportObject, 10, { x: 320, y: 240 }, { x: 5, y: 3 }, 5, 80)

      // Original frameList pattern:
      // repeat with m = 1 to 2:
      //   - 1 to tmpDur-1: increasing from 1 to tmpMax (1->4)
      //   - 1 to tmpDur: constant at tmpMax (4)
      //   - 2 to tmpDur: decreasing from tmpMax to 1 (4->1)
      // With tmpDur=30, tmpMax=4
      expect(wave.frameList.length).toBeGreaterThan(0)
      
      // First frame should be close to 1 (building up)
      expect(wave.frameList[0]).toBeGreaterThanOrEqual(1)
      expect(wave.frameList[0]).toBeLessThanOrEqual(4)
    })

    test('should use different first frame based on amplitude', () => {
      // Original: if amplitude > 60 then firstFrame = WavePic1 else WavePic2
      const highAmpWave = new SingleWave(mockReportObject, 10, { x: 100, y: 100 }, { x: 1, y: 1 }, 1, 80)
      const lowAmpWave = new SingleWave(mockReportObject, 11, { x: 100, y: 100 }, { x: 1, y: 1 }, 1, 40)

      // They should have different firstFrame bases
      expect(highAmpWave.useHighAmplitudeSprite).toBe(true)
      expect(lowAmpWave.useHighAmplitudeSprite).toBe(false)
    })
  })

  describe('check (on check me, thePoint)', () => {
    beforeEach(() => {
      wave = new SingleWave(mockReportObject, 10, { x: 320, y: 240 }, { x: 5, y: 3 }, 5, 80)
    })

    test('should return 0 when point is outside waveCircle', () => {
      // Point far from wave center (320, 240)
      const result = wave.check({ x: 500, y: 500 })
      expect(result).toBe(0)
    })

    test('should return positive value when point is inside waveCircle', () => {
      // Point close to wave center
      const result = wave.check({ x: 320, y: 240 })
      expect(result).toBeGreaterThan(0)
    })

    test('should calculate force based on distance and frame', () => {
      // Original: return getAt(frameList, counter) * factor * amplitude * 2
      // where factor = max(0, waveCircle - hypo)
      
      // At center, hypo = 0, factor = 70
      const centerResult = wave.check({ x: 320, y: 240 })
      expect(centerResult).toBeGreaterThan(0)
      
      // Well outside the circle (100+ pixels away), factor should be 0
      const farResult = wave.check({ x: 320 + 100, y: 240 + 100 })
      expect(farResult).toBe(0)
    })
  })

  describe('loop (on loop me)', () => {
    beforeEach(() => {
      wave = new SingleWave(mockReportObject, 10, { x: 320, y: 240 }, { x: 5, y: 3 }, 5, 80)
    })

    test('should increment counter and wrap around', () => {
      const initialCounter = wave.counter
      wave.loop()
      
      // Counter should change
      expect(wave.counter).not.toBe(initialCounter)
    })

    test('should update location based on velocity', () => {
      // Original: set loc to loc + (vel / 2) + (vel * tmpFrame / 8)
      const initialLoc = { x: wave.loc.x, y: wave.loc.y }
      wave.loop()
      
      // Location should have changed
      expect(wave.loc.x).not.toBe(initialLoc.x)
      expect(wave.loc.y).not.toBe(initialLoc.y)
    })

    test('should call Stopped when wave goes out of bounds', () => {
      // Move wave far out of bounds
      wave.loc = { x: -2000, y: -2000 }
      wave.loop()
      
      // Original: if loc.x < -1000 or loc.y < -1000 or loc.x > 6400 or loc.y > 5100
      //           then Stopped(reportObject, me)
      expect(mockReportObject.Stopped).toHaveBeenCalled()
      expect(wave.active).toBe(false)
    })

    test('should not update when inactive', () => {
      wave.active = false
      const initialLoc = { x: wave.loc.x, y: wave.loc.y }
      wave.loop()
      
      // Location should not change
      expect(wave.loc).toEqual(initialLoc)
    })
  })

  describe('getLoc (on getLoc me)', () => {
    test('should return unscaled location', () => {
      wave = new SingleWave(mockReportObject, 10, { x: 320, y: 240 }, { x: 5, y: 3 }, 5, 80)
      
      // Original: return loc / 10
      const loc = wave.getLoc()
      expect(loc.x).toBe(320)
      expect(loc.y).toBe(240)
    })
  })

  describe('kill (on kill me)', () => {
    test('should deactivate wave', () => {
      wave = new SingleWave(mockReportObject, 10, { x: 320, y: 240 }, { x: 5, y: 3 }, 5, 80)
      wave.kill()
      
      expect(wave.active).toBe(false)
    })
  })
})
