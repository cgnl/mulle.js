/**
 * MeterScript.test.js - TDD tests based on original Lingo MeterScript.ls (ParentScript 181)
 * 
 * Original Lingo properties:
 * - nrOfFrames: number of animation frames
 * - firstFrame: base frame number
 * - SP: sprite channel
 * - speedPerFrame: value per frame step
 * - meter: current meter value (frame number)
 * - counter: fill animation counter
 */
'use strict'

import MeterScript from '../MeterScript'

describe('MeterScript', () => {
  let meter

  describe('constructor (new me)', () => {
    test('should initialize with provided values', () => {
      // Original: new(script "MeterScript", argSP, argMaxVal, argFirstFrame, argNrOfFrames)
      meter = new MeterScript(70, 700, 'fuel_meter', 25)

      expect(meter.SP).toBe(70)
      expect(meter.nrOfFrames).toBe(25)
      expect(meter.meter).toBe(0)
      expect(meter.counter).toBe(0)
    })

    test('should default nrOfFrames to 17', () => {
      // Original: if voidp(nrOfFrames) then set nrOfFrames to 17
      meter = new MeterScript(70, 700, 'fuel_meter')

      expect(meter.nrOfFrames).toBe(17)
    })

    test('should calculate speedPerFrame from maxVal', () => {
      // Original: set speedPerFrame to tmpMaxSpeed / nrOfFrames
      meter = new MeterScript(70, 700, 'fuel_meter', 25)

      expect(meter.speedPerFrame).toBe(700 / 25) // 28
    })

    test('should handle speedPerFrame of 0', () => {
      // Original: if speedPerFrame = 0 then set speedPerFrame to 1
      meter = new MeterScript(70, 0, 'fuel_meter', 25)

      expect(meter.speedPerFrame).toBe(1)
    })
  })

  describe('setMax (on setMax me, argMaxVal)', () => {
    beforeEach(() => {
      meter = new MeterScript(70, 700, 'fuel_meter', 25)
    })

    test('should update speedPerFrame', () => {
      meter.setMax(1000)

      expect(meter.speedPerFrame).toBe(1000 / 25) // 40
    })

    test('should handle zero max', () => {
      meter.setMax(0)

      expect(meter.speedPerFrame).toBe(1)
    })
  })

  describe('show (on show me, argSpeed)', () => {
    beforeEach(() => {
      meter = new MeterScript(70, 700, 'fuel_meter', 25)
    })

    test('should calculate meter value from input', () => {
      // Original: set meter to argSpeed / speedPerFrame
      meter.show(280) // 280 / 28 = 10

      expect(meter.meter).toBe(10)
    })

    test('should clamp meter to nrOfFrames', () => {
      // Original: if meter > nrOfFrames then set meter to nrOfFrames
      meter.show(10000) // Would be > 25

      expect(meter.meter).toBe(25)
    })

    test('should handle fractional values', () => {
      meter.show(100) // 100 / 28 = 3.57...

      expect(meter.meter).toBe(Math.floor(100 / 28))
    })
  })

  describe('fill (on fill me)', () => {
    beforeEach(() => {
      meter = new MeterScript(70, 700, 'fuel_meter', 25)
    })

    test('should reset counter to 0', () => {
      meter.counter = 10
      meter.fill()

      expect(meter.counter).toBe(0)
    })
  })

  describe('loop (on loop me)', () => {
    beforeEach(() => {
      meter = new MeterScript(70, 700, 'fuel_meter', 25)
    })

    test('should increment meter every other tick', () => {
      // Original: if (counter mod 2) = 0 then if meter < nrOfFrames then meter++
      meter.meter = 5
      meter.counter = 0

      meter.loop()

      expect(meter.meter).toBe(6)
      expect(meter.counter).toBe(1)
    })

    test('should not increment on odd ticks', () => {
      meter.meter = 5
      meter.counter = 1

      meter.loop()

      expect(meter.meter).toBe(5)
      expect(meter.counter).toBe(2)
    })

    test('should not exceed nrOfFrames', () => {
      meter.meter = 25 // At max
      meter.counter = 0

      meter.loop()

      expect(meter.meter).toBe(25) // Unchanged
    })
  })

  describe('getFrame (for sprite rendering)', () => {
    beforeEach(() => {
      meter = new MeterScript(70, 700, 'fuel_meter', 25)
    })

    test('should return frame index based on meter value', () => {
      meter.meter = 10

      // Frame = firstFrame + meter
      expect(meter.getFrame()).toBe(10)
    })
  })

  describe('kill (on kill me)', () => {
    test('should return null', () => {
      meter = new MeterScript(70, 700, 'fuel_meter', 25)

      const result = meter.kill()

      expect(result).toBeNull()
    })

    test('should destroy sprite if it exists', () => {
      const mockSprite = { destroy: jest.fn(), z: 0 }
      const mockGame = {
        add: {
          sprite: jest.fn().mockReturnValue(mockSprite)
        }
      }
      meter = new MeterScript(70, 700, 'fuel_meter', 25, mockGame)
      meter.kill()
      expect(mockSprite.destroy).toHaveBeenCalled()
      expect(meter.sprite).toBeNull()
    })
  })

  describe('Sprite Integration (JS)', () => {
    let mockGame, mockSprite

    beforeEach(() => {
      mockSprite = {
        z: 0,
        frame: 0,
        destroy: jest.fn()
      }
      mockGame = {
        add: {
          sprite: jest.fn().mockReturnValue(mockSprite)
        }
      }
    })

    test('should create sprite with correct channel/Z', () => {
      meter = new MeterScript(76, 120, 'speed_meter', 17, mockGame)

      expect(mockGame.add.sprite).toHaveBeenCalledWith(0, 0, 'speed_meter', 0)
      expect(mockSprite.z).toBe(76)
      expect(meter.sprite).toBe(mockSprite)
    })

    test('should update sprite frame in show()', () => {
      meter = new MeterScript(76, 120, 'speed_meter', 17, mockGame)
      meter.show(60) // 50%

      expect(mockSprite.frame).toBeGreaterThan(0)
    })

    test('should update sprite frame in loop()', () => {
      meter = new MeterScript(76, 120, 'speed_meter', 17, mockGame)
      meter.meter = 0
      meter.counter = 0

      meter.loop() // counter 0 -> meter 1 -> frame 1

      expect(mockSprite.frame).toBe(1)
    })
  })
})
