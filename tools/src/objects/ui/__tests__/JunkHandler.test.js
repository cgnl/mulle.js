/**
 * JunkHandler.test.js - TDD tests based on original Lingo
 * ParentScript 13 - JunkHandler.ls
 *
 * Junk yard parts display and drag handling.
 */
'use strict'

import JunkHandler from '../JunkHandler'

describe('JunkHandler', () => {
  let handler
  let mockGlobals

  beforeEach(() => {
    mockGlobals = {
      user: {
        getJunk: jest.fn().mockReturnValue({
          part1: { x: 10, y: 20 },
          part2: { x: 30, y: 40 }
        }),
        removeJunkPart: jest.fn(),
        addJunkPart: jest.fn().mockReturnValue(true)
      },
      junkViewHandler: {
        getMaxNoOfParts: jest.fn().mockReturnValue(10)
      },
      mouseMaster: {
        getToWhere: jest.fn().mockReturnValue('NoWhere')
      },
      parts: {
        getPart: jest.fn()
      }
    }
    handler = new JunkHandler('Yard', mockGlobals)
  })

  describe('constructor (new me)', () => {
    test('should initialize empty junkObjects', () => {
      expect(handler.junkObjects).toEqual([])
    })

    test('should store junkWhere', () => {
      expect(handler.junkWhere).toBe('Yard')
    })

    test('should initialize dragObject to 0', () => {
      expect(handler.dragObject).toBe(0)
    })
  })

  describe('cleanUp', () => {
    test('should kill all junk objects', () => {
      const obj1 = { kill: jest.fn() }
      const obj2 = { kill: jest.fn() }
      handler.junkObjects = [obj1, obj2]

      handler.cleanUp()

      expect(obj1.kill).toHaveBeenCalled()
      expect(obj2.kill).toHaveBeenCalled()
    })

    test('should clear junkObjects array', () => {
      handler.junkObjects = [{ kill: jest.fn() }]

      handler.cleanUp()

      expect(handler.junkObjects).toEqual([])
    })
  })

  describe('kill', () => {
    test('should call cleanUp', () => {
      handler.cleanUp = jest.fn()

      handler.kill()

      expect(handler.cleanUp).toHaveBeenCalled()
    })

    test('should return 0', () => {
      expect(handler.kill()).toBe(0)
    })
  })

  describe('getWhere', () => {
    test('should return junkWhere', () => {
      expect(handler.getWhere()).toBe('Yard')
    })
  })

  describe('drawParts', () => {
    beforeEach(() => {
      handler.spriteList = { JunkStart: 50 }
    })

    test('should clean up existing objects first', () => {
      handler.cleanUp = jest.fn()

      handler.drawParts()

      expect(handler.cleanUp).toHaveBeenCalled()
    })

    test('should get junk for location', () => {
      handler.drawParts()

      expect(mockGlobals.user.getJunk).toHaveBeenCalledWith('Yard')
    })
  })

  describe('pickedUp', () => {
    test('should remove part from user junk', () => {
      handler.pickedUp('part1', 'member1')

      expect(mockGlobals.user.removeJunkPart).toHaveBeenCalledWith('Yard', 'part1')
    })

    test('should create drag object', () => {
      handler.pickedUp('part1', 'member1')

      expect(handler.dragObject).toBeDefined()
    })
  })

  describe('dropped', () => {
    test('should kill drag object', () => {
      const mockDragObj = { kill: jest.fn().mockReturnValue(null) }
      handler.dragObject = mockDragObj

      handler.dropped('part1', { x: 100, y: 100 })

      expect(mockDragObj.kill).toHaveBeenCalled()
    })

    test('should add part back to original location if NoWhere', () => {
      mockGlobals.mouseMaster.getToWhere = jest.fn().mockReturnValue('NoWhere')

      handler.dropped('part1', { x: 100, y: 100 })

      expect(mockGlobals.user.addJunkPart).toHaveBeenCalledWith('Yard', 'part1', { x: 100, y: 100 })
    })

    test('should add part to new location', () => {
      mockGlobals.mouseMaster.getToWhere = jest.fn().mockReturnValue('Shelf1')

      handler.dropped('part1', { x: 100, y: 100 })

      expect(mockGlobals.user.addJunkPart).toHaveBeenCalledWith('Shelf1', 'part1')
    })

    test('should add part back to original if new location fails', () => {
      mockGlobals.mouseMaster.getToWhere = jest.fn().mockReturnValue('Shelf1')
      mockGlobals.user.addJunkPart = jest.fn()
        .mockReturnValueOnce(false)  // First call fails
        .mockReturnValueOnce(true)   // Fallback succeeds

      handler.dropped('part1', { x: 100, y: 100 })

      expect(mockGlobals.user.addJunkPart).toHaveBeenLastCalledWith('Yard', 'part1', { x: 100, y: 100 })
    })

    test('should call drawParts after drop', () => {
      handler.drawParts = jest.fn()

      handler.dropped('part1', { x: 100, y: 100 })

      expect(handler.drawParts).toHaveBeenCalled()
    })

    test('should delegate to boatHandler for Boat drops', () => {
      mockGlobals.mouseMaster.getToWhere = jest.fn().mockReturnValue('BoatDeck')
      const mockBoatHandler = { dropped: jest.fn() }
      handler.boatHandler = mockBoatHandler

      handler.dropped('part1', { x: 100, y: 100 })

      expect(mockBoatHandler.dropped).toHaveBeenCalledWith('part1', { x: 100, y: 100 })
    })
  })
})
