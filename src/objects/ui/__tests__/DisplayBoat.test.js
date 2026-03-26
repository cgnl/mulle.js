/**
 * DisplayBoat.test.js - TDD tests based on original Lingo DisplayBoat.ls (ParentScript 36)
 *
 * Original Lingo properties:
 * - lastSpeed: previous speed value for sound transitions
 * - limitList: speed thresholds [10, 20, 40, 70]
 * - SP: sprite channel
 * - firstFrame: base frame number ("Boat0000")
 * - soundOn: whether sound is enabled
 * - visible: visibility flag
 * - masterObject: reference to boat controller
 * - frontBackList: pitch inclination mapping [2, 1, 0, 4, 3]
 * - sideList: roll inclination mapping [2, 1, 0, 3, 4]
 * - decimalPrec: position precision (100)
 * - maxSpeed: maximum speed (600)
 */
'use strict'

import DisplayBoat from '../DisplayBoat'

describe('DisplayBoat', () => {
  let displayBoat
  let mockMaster

  beforeEach(() => {
    mockMaster = {
      loc: { x: 10000, y: 20000 }, // In hundredths
      direction: 0
    }
  })

  describe('constructor (new me)', () => {
    test('should initialize limitList sorted', () => {
      // Original: set limitList to [10, 20, 40, 70]
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.limitList).toEqual([10, 20, 40, 70])
    })

    test('should initialize lastSpeed to 0', () => {
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.lastSpeed).toBe(0)
    })

    test('should store masterObject reference', () => {
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.masterObject).toBe(mockMaster)
    })

    test('should initialize decimalPrec to 100', () => {
      // Original: set decimalPrec to 100
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.decimalPrec).toBe(100)
    })

    test('should initialize frontBackList', () => {
      // Original: set frontBackList to [2, 1, 0, 4, 3]
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.frontBackList).toEqual([2, 1, 0, 4, 3])
    })

    test('should initialize sideList', () => {
      // Original: set sideList to [2, 1, 0, 3, 4]
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.sideList).toEqual([2, 1, 0, 3, 4])
    })

    test('should initialize maxSpeed to 600', () => {
      // Original: set maxSpeed to 600
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.maxSpeed).toBe(600)
    })

    test('should start visible', () => {
      // Original: set visible to 1
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.visible).toBe(true)
    })

    test('should initialize soundOn to false', () => {
      // Original: set soundOn to 0 (final line overrides xtra check)
      displayBoat = new DisplayBoat(mockMaster)

      expect(displayBoat.soundOn).toBe(false)
    })
  })

  describe('kill (on kill me)', () => {
    test('should return null', () => {
      // Original: return 0
      displayBoat = new DisplayBoat(mockMaster)

      const result = displayBoat.kill()

      expect(result).toBeNull()
    })
  })

  describe('show (on show me, YesNo)', () => {
    beforeEach(() => {
      displayBoat = new DisplayBoat(mockMaster)
    })

    test('should set visible to true when YesNo is 1', () => {
      displayBoat.visible = false
      displayBoat.show(1)

      expect(displayBoat.visible).toBe(true)
    })

    test('should set visible to false when YesNo is 0', () => {
      displayBoat.visible = true
      displayBoat.show(0)

      expect(displayBoat.visible).toBe(false)
    })
  })

  describe('calcPicToShow (on calcPicToShow me, argDirection, argInclinationList)', () => {
    beforeEach(() => {
      displayBoat = new DisplayBoat(mockMaster)
    })

    test('should calculate frame for direction 0, no inclination', () => {
      // Original: set tmpDir to 1 + (argDirection mod 16)
      // set xx to tmpDir + (80 * getAt(sideList, side + 3)) + (16 * getAt(frontBackList, frontBack + 3))
      // side=0, frontBack=0: sideList[3]=0, frontBackList[3]=0
      // xx = 1 + (80 * 0) + (16 * 0) = 1
      const frame = displayBoat.calcPicToShow(0, [0, 0])

      expect(frame).toBe(1)
    })

    test('should calculate frame for direction 8, no inclination', () => {
      // tmpDir = 1 + (8 mod 16) = 9
      // xx = 9 + 0 + 0 = 9
      const frame = displayBoat.calcPicToShow(8, [0, 0])

      expect(frame).toBe(9)
    })

    test('should wrap direction at 16', () => {
      // tmpDir = 1 + (16 mod 16) = 1
      const frame = displayBoat.calcPicToShow(16, [0, 0])

      expect(frame).toBe(1)
    })

    test('should account for side inclination -2', () => {
      // side=-2: sideList[side + 3] = sideList[1] = 2
      // xx = 1 + (80 * 2) + 0 = 161
      const frame = displayBoat.calcPicToShow(0, [-2, 0])

      expect(frame).toBe(161)
    })

    test('should account for side inclination +2', () => {
      // side=2: sideList[side + 3] = sideList[5] = 4
      // xx = 1 + (80 * 4) + 0 = 321
      const frame = displayBoat.calcPicToShow(0, [2, 0])

      expect(frame).toBe(321)
    })

    test('should account for frontBack inclination -2', () => {
      // frontBack=-2: frontBackList[frontBack + 3] = frontBackList[1] = 2
      // xx = 1 + 0 + (16 * 2) = 33
      const frame = displayBoat.calcPicToShow(0, [0, -2])

      expect(frame).toBe(33)
    })

    test('should combine direction, side, and frontBack', () => {
      // direction=4: tmpDir = 5
      // side=1: sideList[4] = 3, contribution = 80 * 3 = 240
      // frontBack=-1: frontBackList[2] = 1, contribution = 16 * 1 = 16
      // xx = 5 + 240 + 16 = 261
      const frame = displayBoat.calcPicToShow(4, [1, -1])

      expect(frame).toBe(261)
    })
  })

  describe('display (on display me, argInclinationList)', () => {
    beforeEach(() => {
      displayBoat = new DisplayBoat(mockMaster)
    })

    test('should calculate display position from master loc', () => {
      // Original: set the loc of sprite SP to point(0, -tmpAlt / 10) + (loc / decimalPrec)
      // loc = {x: 10000, y: 20000}, decimalPrec = 100
      // result = {x: 100, y: 200} + altitude adjustment
      const result = displayBoat.display([0, 0, 0])

      expect(result.position.x).toBe(100)
      expect(result.position.y).toBe(200)
    })

    test('should adjust y position for altitude', () => {
      // Original: point(0, -tmpAlt / 10)
      // tmpAlt from argInclinationList[1] (index 0 in 0-based)
      // With altitude 50: y adjustment = -50/10 = -5
      const result = displayBoat.display([50, 0, 0])

      expect(result.position.y).toBe(200 - 5)
    })

    test('should calculate frame index', () => {
      mockMaster.direction = 4
      const result = displayBoat.display([0, 1, -1]) // [alt, side, frontBack]

      // direction=4: tmpDir = 5
      // side=1: sideList[4] = 3, contribution = 80 * 3 = 240
      // frontBack=-1: frontBackList[2] = 1, contribution = 16 * 1 = 16
      // xx = 5 + 240 + 16 = 261
      expect(result.frame).toBe(261)
    })

    test('should return null when not visible', () => {
      displayBoat.visible = false

      const result = displayBoat.display([0, 0, 0])

      expect(result).toBeNull()
    })
  })

  describe('loop (on loop me)', () => {
    beforeEach(() => {
      displayBoat = new DisplayBoat(mockMaster)
    })

    test('should call display', () => {
      // Original: display(me)
      // Loop just delegates to display with default inclination
      const result = displayBoat.loop([0, 0, 0])

      expect(result).not.toBeNull()
      expect(result.position).toBeDefined()
    })
  })
})
