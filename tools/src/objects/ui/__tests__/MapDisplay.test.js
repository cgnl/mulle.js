/**
 * MapDisplay.test.js - TDD tests based on original Lingo
 * BehaviorScript 78 - MapDisplay.ls
 *
 * Map overview display behavior.
 */
'use strict'

import MapDisplay from '../MapDisplay'

describe('MapDisplay', () => {
  let display
  let mockDir

  beforeEach(() => {
    mockDir = {
      mapCoordinate: { x: 1, y: 1 },
      boat: {
        getShowCoordinate: () => ({ x: 320, y: 240 })
      },
      mulleTalkObject: {
        say: jest.fn(),
        deleteSound: jest.fn()
      },
      pause: jest.fn(),
      mode: 'Driving'
    }
    display = new MapDisplay(mockDir)
  })

  describe('constructor / beginSprite', () => {
    test('should initialize displaying to false', () => {
      expect(display.displaying).toBe(false)
    })

    test('should initialize sounds mapping', () => {
      expect(display.sounds[2]).toBe('19d001v0')
      expect(display.sounds[17]).toBe('05d066v0')
    })

    test('should initialize pics mapping', () => {
      expect(display.pics[2]).toBe(6)
      expect(display.pics[17]).toBe(21)
    })

    test('should initialize rollOvers regions', () => {
      expect(display.rollOvers).toBeDefined()
      expect(display.rollOvers.length).toBe(4)
    })

    test('should initialize sound to empty', () => {
      expect(display.sound).toBe('')
    })

    test('should initialize active to true', () => {
      expect(display.active).toBe(true)
    })

    test('should initialize nowOver to 0', () => {
      expect(display.nowOver).toBe(0)
    })

    test('should initialize picMember as Dummy and marker offscreen', () => {
      expect(display.picMember).toBe('Dummy')
      expect(display.markerLoc).toEqual({ x: -100, y: -100 })
    })
  })

  describe('kill', () => {
    test('should reset displaying', () => {
      display.displaying = true

      display.kill()

      expect(display.displaying).toBe(false)
    })

    test('should unpause game', () => {
      display.displaying = true

      display.kill()

      expect(mockDir.pause).toHaveBeenCalledWith(false)
    })

    test('should set mode to Driving', () => {
      display.displaying = true

      display.kill()

      expect(mockDir.mode).toBe('Driving')
    })

    test('should kill mouse objects', () => {
      const mockObj = { kill: jest.fn() }
      display.displaying = true
      display.mouseObjects = [mockObj]

      display.kill()

      expect(mockObj.kill).toHaveBeenCalled()
      expect(display.mouseObjects).toEqual([])
      expect(display.markerLoc).toEqual({ x: -100, y: -100 })
    })

    test('should delete sound', () => {
      display.displaying = true
      display.sound = 'test.wav'

      display.kill()

      expect(mockDir.mulleTalkObject.deleteSound).toHaveBeenCalledWith('test.wav')
    })
  })

  describe('mouseEnter', () => {
    test('should do nothing if not active', () => {
      display.active = false
      display.member = 'litenkarta'

      display.mouseEnter()

      expect(display.member).toBe('litenkarta')
    })

    test('should do nothing if displaying', () => {
      display.displaying = true
      display.member = 'litenkarta'

      display.mouseEnter()

      expect(display.member).toBe('litenkarta')
    })

    test('should set highlight member when active', () => {
      display.active = true
      display.displaying = false

      display.mouseEnter()

      expect(display.member).toBe('litenkarta-hi')
    })
  })

  describe('mouseLeave', () => {
    test('should reset member if active', () => {
      display.active = true
      display.member = 'litenkarta-hi'

      display.mouseLeave()

      expect(display.member).toBe('litenkarta')
    })

    test('should do nothing if not active', () => {
      display.active = false
      display.member = 'litenkarta-hi'

      display.mouseLeave()

      expect(display.member).toBe('litenkarta-hi')
    })
  })

  describe('mouseUp', () => {
    let mockGlobals

    beforeEach(() => {
      mockGlobals = {
        world: {
          getId: () => 'Da hood',
          getWorldSize: () => ({ x: 6, y: 4 })
        },
        user: {
          isInInventory: jest.fn().mockReturnValue(false)
        },
        levelHandler: {
          getLevel: () => 1
        }
      }
      display.globals = mockGlobals
    })

    test('should kill if already displaying', () => {
      display.displaying = true
      display.kill = jest.fn()

      display.mouseUp()

      expect(display.kill).toHaveBeenCalled()
    })

    test('should do nothing if not active', () => {
      display.active = false

      display.mouseUp()

      expect(display.displaying).toBe(false)
    })

    test('should show map if active and not displaying', () => {
      display.active = true
      display.displaying = false

      display.mouseUp()

      expect(display.displaying).toBe(true)
    })

    test('should create 9 region mouse objects at map level 0', () => {
      mockGlobals.user.isInInventory = jest.fn().mockReturnValue(false)

      display.mouseUp()

      expect(display.mouseObjects.length).toBe(9)
    })

    test('should create 13 region mouse objects at map level 1', () => {
      mockGlobals.user.isInInventory = jest.fn((item) => item === 'MapPiece1')

      display.mouseUp()

      expect(display.mouseObjects.length).toBe(13)
    })

    test('should create 16 region mouse objects at map level 2', () => {
      mockGlobals.user.isInInventory = jest.fn((item) => item === 'MapPiece2')

      display.mouseUp()

      expect(display.mouseObjects.length).toBe(16)
    })

    test('should pause game when showing map', () => {
      display.active = true

      display.mouseUp()

      expect(mockDir.pause).toHaveBeenCalledWith(true)
    })

    test('should set mode to Waiting', () => {
      display.active = true

      display.mouseUp()

      expect(mockDir.mode).toBe('Waiting')
    })

    test('should determine map level from inventory', () => {
      mockGlobals.user.isInInventory = jest.fn()
        .mockImplementation(item => item === 'MapPiece1')

      display.mouseUp()

      expect(display.mapLevel).toBe(1)
    })

    test('should show all regions with all map pieces', () => {
      mockGlobals.user.isInInventory = jest.fn().mockReturnValue(true)

      display.mouseUp()

      expect(display.mapLevel).toBe(4)
    })

    test('should set mapMember to lingo map member based on map level', () => {
      mockGlobals.user.isInInventory = jest.fn().mockReturnValue(false)

      display.mouseUp()

      // tmpFirst("30n001v0") + tmpMapMemb(0)
      expect(display.mapMember).toBe('30n001v0')
    })

    test('should compute marker position when opening map', () => {
      display.mouseUp()

      expect(display.markerLoc.x).toBeCloseTo(69.8860759494)
      expect(display.markerLoc.y).toBeCloseTo(77.6666666667)
    })
  })

  describe('mouse', () => {
    test('should handle enter event', () => {
      const mockObj = { dragToWhere: 5 }

      display.mouse(mockObj, 'enter')

      expect(display.nowOver).toBe(5)
    })

    test('should play sound on enter', () => {
      const mockObj = { dragToWhere: 5 }

      display.mouse(mockObj, 'enter')

      expect(display.sound).toBe('19d004v0')
    })

    test('should call mulleTalkObject.say with region sound on enter', () => {
      const mockObj = { dragToWhere: 5 }

      display.mouse(mockObj, 'enter')

      expect(mockDir.mulleTalkObject.say).toHaveBeenCalledWith('19d004v0', 6)
    })

    test('should set picture member using lingo 30n-series member names', () => {
      const mockObj = { dragToWhere: 5 }

      display.mouse(mockObj, 'enter')

      expect(display.picMember).toBe('30n009v0')
    })

    test('should handle leave event', () => {
      display.nowOver = 5
      const mockObj = { dragToWhere: 5 }

      display.mouse(mockObj, 'Leave')

      // Pic should be reset (member set to Dummy)
      expect(display.picMember).toBe('Dummy')
    })

    test('should not reset on leave if different region', () => {
      display.nowOver = 5
      const mockObj = { dragToWhere: 3 }

      display.mouse(mockObj, 'Leave')

      // Should not change because dragToWhere != nowOver
      expect(display.picMember).toBe('Dummy')
    })
  })

  describe('activate', () => {
    test('should set active state', () => {
      display.activate(false)
      expect(display.active).toBe(false)

      display.activate(true)
      expect(display.active).toBe(true)
    })
  })

  describe('getBoatPosition', () => {
    test('should calculate boat position on map', () => {
      const pos = display.getBoatPosition()

      expect(pos).toBeDefined()
      expect(pos.x).toBeDefined()
      expect(pos.y).toBeDefined()
    })
  })
})
