/**
 * DrawBoat.test.js - TDD tests based on original Lingo
 * MovieScript 16 - DrawBoat.ls
 *
 * Boat drawing/rendering utilities.
 */
'use strict'

import DrawBoat from '../DrawBoat'

describe('DrawBoat', () => {
  let drawer
  let mockGlobals

  beforeEach(() => {
    mockGlobals = {
      user: {
        boat: {
          getParts: () => [101, 102, 103],
          getSnapInfo: jest.fn().mockReturnValue([[1, 2], { x: 10, y: 20 }])
        }
      },
      parts: {
        getPart: jest.fn().mockReturnValue({
          getRequiredPoints: () => [1],
          getUseView: () => 'part_view',
          getUseView2: () => '',
          getOffset: () => ({ x: 5, y: 10 })
        })
      },
      boatViewHandler: {
        isHull: jest.fn().mockReturnValue(false),
        isRudder: jest.fn().mockReturnValue(false),
        getDrawOffset: jest.fn().mockReturnValue({ x: 0, y: 0 })
      },
      HullFrontOffset: 1,
      HullBackOffset: 20,
      rudderFrontOffset: 15,
      rudderBackOffset: 16
    }
    drawer = new DrawBoat(mockGlobals)
  })

  describe('constructor', () => {
    test('should store globals reference', () => {
      expect(drawer.globals).toBe(mockGlobals)
    })
  })

  describe('drawBoat', () => {
    test('should use default offset if not provided', () => {
      const sprites = drawer.drawBoat()

      expect(sprites).toBeDefined()
    })

    test('should accept custom offset', () => {
      const sprites = drawer.drawBoat({ x: 100, y: 150 })

      expect(sprites).toBeDefined()
    })

    test('should accept custom percentage', () => {
      const sprites = drawer.drawBoat({ x: 320, y: 240 }, 0.5)

      expect(sprites).toBeDefined()
    })

    test('should accept custom parts list', () => {
      const sprites = drawer.drawBoat({ x: 320, y: 240 }, 1, [201, 202])

      expect(sprites).toBeDefined()
    })

    test('should use boat parts if none provided', () => {
      drawer.drawBoat()

      // Parts should come from user.boat.getParts()
      expect(mockGlobals.parts.getPart).toHaveBeenCalled()
    })

    test('should get snap info for non-hull parts', () => {
      mockGlobals.boatViewHandler.isHull = jest.fn().mockReturnValue(false)
      mockGlobals.boatViewHandler.isRudder = jest.fn().mockReturnValue(false)

      drawer.drawBoat()

      expect(mockGlobals.user.boat.getSnapInfo).toHaveBeenCalled()
    })

    test('should use hull offsets for hull parts', () => {
      mockGlobals.boatViewHandler.isHull = jest.fn().mockReturnValue(true)

      const sprites = drawer.drawBoat()

      expect(sprites).toBeDefined()
    })

    test('should use rudder offsets for rudder parts', () => {
      mockGlobals.boatViewHandler.isHull = jest.fn().mockReturnValue(false)
      mockGlobals.boatViewHandler.isRudder = jest.fn().mockReturnValue(true)

      const sprites = drawer.drawBoat()

      expect(sprites).toBeDefined()
    })
  })

  describe('setSpriteThings', () => {
    test('should calculate sprite properties', () => {
      const partObj = {
        getUseView: () => 'view1',
        getUseView2: () => '',
        getOffset: () => ({ x: 10, y: 20 })
      }

      const result = drawer.setSpriteThings(
        42,
        partObj,
        { x: 320, y: 240 },
        { x: 5, y: 10 },
        1,
        1
      )

      expect(result).toBeDefined()
      expect(result.sp).toBe(42)
      expect(result.member).toBe('view1')
    })

    test('should use view2 for second layer', () => {
      const partObj = {
        getUseView: () => 'view1',
        getUseView2: () => 'view2',
        getOffset: () => ({ x: 10, y: 20 })
      }

      const result = drawer.setSpriteThings(
        42,
        partObj,
        { x: 320, y: 240 },
        { x: 5, y: 10 },
        1,
        2
      )

      expect(result.member).toBe('view2')
    })

    test('should return null if view2 empty for second layer', () => {
      const partObj = {
        getUseView: () => 'view1',
        getUseView2: () => '',
        getOffset: () => ({ x: 10, y: 20 })
      }

      const result = drawer.setSpriteThings(
        42,
        partObj,
        { x: 320, y: 240 },
        { x: 5, y: 10 },
        1,
        2
      )

      expect(result).toBeNull()
    })

    test('should apply percentage scaling', () => {
      const partObj = {
        getUseView: () => 'view1',
        getUseView2: () => '',
        getOffset: () => ({ x: 100, y: 200 })
      }

      const result = drawer.setSpriteThings(
        42,
        partObj,
        { x: 0, y: 0 },
        { x: 50, y: 100 },
        0.5,
        1
      )

      // Offset should be scaled: 100*0.5 = 50, 200*0.5 = 100
      // Snap offset: 50*0.5 = 25, 100*0.5 = 50
      // Total: 50+25 = 75, 100+50 = 150
      expect(result.loc.x).toBe(75)
      expect(result.loc.y).toBe(150)
    })
  })
})
