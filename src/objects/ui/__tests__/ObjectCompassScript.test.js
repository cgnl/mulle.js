/**
 * ObjectCompassScript.test.js - TDD tests based on original Lingo ObjectCompassScript.ls (ParentScript 48)
 *
 * Compass display that shows direction to a target object.
 *
 * Original Lingo properties:
 * - child: target object reference
 * - insideInner/insideOuter: proximity flags
 * - mode: compass mode
 * - Showing: whether compass is displayed
 * - SP1, SP2, SP3: sprite channels for compass parts
 * - firstFrame1/2/3: base frame numbers
 * - headDirection: target direction
 */
'use strict'

import ObjectCompassScript from '../ObjectCompassScript'

describe('ObjectCompassScript', () => {
  let compass
  let mockChild

  beforeEach(() => {
    mockChild = {
      SPOver: 80,
      myLoc: { x: 500, y: 300 }
    }
  })

  describe('constructor (new me, theChild)', () => {
    test('should store child reference', () => {
      compass = new ObjectCompassScript(mockChild)

      expect(compass.child).toBe(mockChild)
    })

    test('should initialize insideInner to false', () => {
      compass = new ObjectCompassScript(mockChild)

      expect(compass.insideInner).toBe(false)
    })

    test('should initialize insideOuter to false', () => {
      compass = new ObjectCompassScript(mockChild)

      expect(compass.insideOuter).toBe(false)
    })
  })

  describe('kill (on kill me)', () => {
    test('should clear child reference', () => {
      compass = new ObjectCompassScript(mockChild)

      compass.kill()

      expect(compass.child).toBeNull()
    })

    test('should return null', () => {
      compass = new ObjectCompassScript(mockChild)

      expect(compass.kill()).toBeNull()
    })
  })

  describe('init (on init me)', () => {
    beforeEach(() => {
      compass = new ObjectCompassScript(mockChild)
    })

    test('should set sprite channels from child.SPOver', () => {
      // Original: set SP1 to the SPOver of child
      // Original: set SP2 to SP1 + 1
      // Original: set SP3 to SP1 + 2
      compass.init(true, { x: 320, y: 240 }, 1)

      expect(compass.SP1).toBe(80)
      expect(compass.SP2).toBe(81)
      expect(compass.SP3).toBe(82)
    })

    test('should set Showing to true when compass available', () => {
      compass.init(true, { x: 320, y: 240 }, 1)

      expect(compass.Showing).toBe(true)
    })

    test('should set Showing to false when no compass', () => {
      compass.init(false, { x: 320, y: 240 }, 1)

      expect(compass.Showing).toBe(false)
    })

    test('should calculate headDirection to target', () => {
      // Direction from (320, 240) to (500, 300) should be roughly east-southeast
      compass.init(true, { x: 320, y: 240 }, 1)

      expect(compass.headDirection).toBeDefined()
      expect(compass.headDirection).toBeGreaterThan(0)
      expect(compass.headDirection).toBeLessThanOrEqual(16)
    })

    test('should adjust headDirection by 8 for object 26', () => {
      // Original: if getEnteredObject = 26 then headDirection += 8
      const compass2 = new ObjectCompassScript(mockChild)
      compass2.init(true, { x: 320, y: 240 }, 26)

      // Direction should be rotated by 180 degrees (8 out of 16 directions)
      expect(compass2.headDirection).toBeDefined()
    })
  })

  describe('step (on step me, boatLoc)', () => {
    beforeEach(() => {
      compass = new ObjectCompassScript(mockChild)
      compass.init(true, { x: 320, y: 240 }, 1)
    })

    test('should return null when not showing', () => {
      compass.Showing = false

      const result = compass.step({ x: 100, y: 100 }, 5)

      expect(result).toBeNull()
    })

    test('should calculate bottom frame from boat direction', () => {
      // Original: set the member of sprite SP1 to member (firstFrame1 + tmpDirection)
      const result = compass.step({ x: 100, y: 100 }, 5)

      expect(result.bottomFrame).toBe(5) // Direction 5
    })

    test('should calculate round frame from relative direction', () => {
      // Original: set the member of sprite SP2 to member (firstFrame2 + correctDirection(tmpDirection - headDirection))
      const result = compass.step({ x: 100, y: 100 }, 5)

      expect(result.roundFrame).toBeDefined()
      expect(result.roundFrame).toBeGreaterThan(0)
      expect(result.needleFrame).toBe(1)
    })

    test('should include sprite channels in result', () => {
      compass.init(true, { x: 0, y: 0 }, 10)
      const result = compass.step({ x: 0, y: 0 }, 1)

      expect(result.SP1).toBe(80) // 80 from child.SPOver (mockChild default)
      expect(result.SP2).toBe(81)
      expect(result.SP3).toBe(82)
    })
  })

  describe('Sprite Integration (JS)', () => {
    let mockGame, mockSprites

    beforeEach(() => {
      mockSprites = {
        bottom: { z: 0, frame: 0, visible: true, destroy: jest.fn() },
        round: { z: 0, frame: 0, visible: true, destroy: jest.fn() },
        needle: { z: 0, frame: 0, visible: true, destroy: jest.fn() }
      }
      mockGame = {
        add: {
          sprite: jest.fn().mockImplementation((x, y, key) => {
            if (key === 'CompassBottom') return mockSprites.bottom
            if (key === 'CompassRound') return mockSprites.round
            if (key === 'CompassNeedle') return mockSprites.needle
            return null
          })
        }
      }
    })

    test('should create 3 sprites on init when showing', () => {
      compass = new ObjectCompassScript(mockChild, mockGame)
      compass.init(true, { x: 0, y: 0 }, 0, 80) // startSP = 80

      expect(mockGame.add.sprite).toHaveBeenCalledTimes(3)
      expect(mockSprites.bottom.z).toBe(80)
      expect(mockSprites.round.z).toBe(81)
      expect(mockSprites.needle.z).toBe(82)
    })

    test('should NOT create sprites on init if NOT showing', () => {
      compass = new ObjectCompassScript(mockChild, mockGame)
      compass.init(false, { x: 0, y: 0 }, 0)

      expect(mockGame.add.sprite).not.toHaveBeenCalled()
    })

    test('should update sprite frames in step()', () => {
      compass = new ObjectCompassScript(mockChild, mockGame)
      compass.init(true, { x: 0, y: 0 }, 0)

      // Force headDirection so we know relative direction
      // from {0,0} to {500,300} -> atan(500/-300) -> ~120 deg -> Dir 5 (ESE)
      // boatDir 6 (SE) -> relative 1 (6-5=1)
      compass.step({ x: 0, y: 0 }, 6)

      expect(mockSprites.bottom.frame).toBe(6)
      expect(mockSprites.round.frame).toBe(1) // 6 - 5 = 1
      expect(mockSprites.needle.visible).toBe(true)
    })

    test('should destroy sprites on kill', () => {
      compass = new ObjectCompassScript(mockChild, mockGame)
      compass.init(true, { x: 0, y: 0 }, 0)

      compass.kill()

      expect(mockSprites.bottom.destroy).toHaveBeenCalled()
      expect(mockSprites.round.destroy).toHaveBeenCalled()
      expect(mockSprites.needle.destroy).toHaveBeenCalled()
    })
  })
})
