/**
 * MouseHandler.test.js - TDD tests based on original Lingo
 * ParentScript 20 - MouseHandler.ls
 *
 * Mouse input handler that manages clickable objects and drag/drop.
 */
'use strict'

import MouseHandler from '../MouseHandler'

describe('MouseHandler', () => {
  let handler
  let mockCursor

  beforeEach(() => {
    mockCursor = {
      setCursor: jest.fn()
    }
    handler = new MouseHandler(mockCursor)
  })

  describe('constructor (new me)', () => {
    test('should initialize empty addList as object', () => {
      expect(handler.addList).toEqual({})
    })

    test('should initialize empty deleteList', () => {
      expect(handler.deleteList).toEqual([])
    })

    test('should initialize empty objectList as sorted array', () => {
      expect(handler.objectList).toEqual([])
    })

    test('should initialize dragMode to false', () => {
      expect(handler.dragMode).toBe(false)
    })

    test('should initialize currentToWhere to NoWhere', () => {
      expect(handler.currentToWhere).toBe('NoWhere')
    })

    test('should initialize mouseStatus based on mouse state', () => {
      // Default to up in test environment
      expect(['up', 'down']).toContain(handler.mouseStatus)
    })
  })

  describe('kill', () => {
    test('should clear addList', () => {
      handler.addList = { 1: {} }

      handler.kill()

      expect(handler.addList).toBe(0)
    })

    test('should clear deleteList', () => {
      handler.deleteList = [{}]

      handler.kill()

      expect(handler.deleteList).toBe(0)
    })

    test('should clear objectList', () => {
      handler.objectList = [{}]

      handler.kill()

      expect(handler.objectList).toBe(0)
    })

    test('should return 0', () => {
      expect(handler.kill()).toBe(0)
    })
  })

  describe('addObject', () => {
    test('should add object with layer to addList', () => {
      const obj = { check: jest.fn() }

      handler.addObject(obj, 10)

      expect(handler.addList[10]).toBe(obj)
    })

    test('should handle multiple objects with different layers', () => {
      const obj1 = { check: jest.fn() }
      const obj2 = { check: jest.fn() }

      handler.addObject(obj1, 5)
      handler.addObject(obj2, 10)

      expect(handler.addList[5]).toBe(obj1)
      expect(handler.addList[10]).toBe(obj2)
    })
  })

  describe('deleteObject', () => {
    test('should add object to deleteList', () => {
      const obj = { active: true }

      handler.deleteObject(obj)

      expect(handler.deleteList).toContain(obj)
    })

    test('should set object active to false', () => {
      const obj = { active: true }

      handler.deleteObject(obj)

      expect(obj.active).toBe(false)
    })
  })

  describe('updateObjectList', () => {
    test('should move objects from addList to objectList', () => {
      const obj = { check: jest.fn() }
      handler.addList = { 10: obj }

      handler.updateObjectList()

      expect(handler.objectList).toContainEqual({ layer: 10, obj: obj })
    })

    test('should clear addList after update', () => {
      handler.addList = { 10: {} }

      handler.updateObjectList()

      expect(handler.addList).toEqual({})
    })

    test('should remove objects in deleteList from objectList', () => {
      const obj = { check: jest.fn() }
      handler.objectList = [{ layer: 10, obj: obj }]
      handler.deleteList = [obj]

      handler.updateObjectList()

      expect(handler.objectList).toHaveLength(0)
    })

    test('should clear deleteList after update', () => {
      handler.deleteList = [{}]

      handler.updateObjectList()

      expect(handler.deleteList).toEqual([])
    })

    test('should sort objectList by layer', () => {
      handler.addList = { 20: { id: 'high' }, 5: { id: 'low' }, 10: { id: 'mid' } }

      handler.updateObjectList()

      expect(handler.objectList[0].layer).toBe(5)
      expect(handler.objectList[1].layer).toBe(10)
      expect(handler.objectList[2].layer).toBe(20)
    })
  })

  describe('loop', () => {
    test('should call updateObjectList', () => {
      handler.updateObjectList = jest.fn()

      handler.loop({ x: 100, y: 100 })

      expect(handler.updateObjectList).toHaveBeenCalled()
    })

    test('should check each object for mouse position', () => {
      const obj = {
        check: jest.fn().mockReturnValue(false),
        rolloverCursor: 'pointer'
      }
      handler.objectList = [{ layer: 10, obj: obj }]

      handler.loop({ x: 100, y: 100 })

      expect(obj.check).toHaveBeenCalledWith({ x: 100, y: 100 })
    })

    test('should set cursor for object under mouse', () => {
      const obj = {
        check: jest.fn().mockReturnValue(true),
        rolloverCursor: 'pointer'
      }
      handler.objectList = [{ layer: 10, obj: obj }]

      handler.loop({ x: 100, y: 100 })

      expect(mockCursor.setCursor).toHaveBeenCalledWith('pointer')
    })

    test('should set standard cursor when no object under mouse', () => {
      const obj = {
        check: jest.fn().mockReturnValue(false)
      }
      handler.objectList = [{ layer: 10, obj: obj }]

      handler.loop({ x: 100, y: 100 })

      expect(mockCursor.setCursor).toHaveBeenCalledWith('Standard')
    })

    test('should check objects in reverse layer order (top first)', () => {
      const order = []
      const obj1 = { check: jest.fn(() => { order.push(1); return false }) }
      const obj2 = { check: jest.fn(() => { order.push(2); return false }) }
      handler.objectList = [
        { layer: 5, obj: obj1 },
        { layer: 10, obj: obj2 }
      ]

      handler.loop({ x: 100, y: 100 })

      expect(order).toEqual([2, 1])
    })

    test('should use dragRolloverCursor in drag mode', () => {
      const obj = {
        check: jest.fn().mockReturnValue(true),
        dragRolloverCursor: 'grabbing',
        dragToWhere: 'Trash'
      }
      handler.objectList = [{ layer: 10, obj: obj }]
      handler.dragMode = true

      handler.loop({ x: 100, y: 100 })

      expect(mockCursor.setCursor).toHaveBeenCalledWith('grabbing')
    })

    test('should update currentToWhere in drag mode', () => {
      const obj = {
        check: jest.fn().mockReturnValue(true),
        dragRolloverCursor: 'grabbing',
        dragToWhere: 'Inventory'
      }
      handler.objectList = [{ layer: 10, obj: obj }]
      handler.dragMode = true

      handler.loop({ x: 100, y: 100 })

      expect(handler.currentToWhere).toBe('Inventory')
    })
  })

  describe('mouseDown', () => {
    beforeEach(() => {
      handler.mouseStatus = 'up'
    })

    test('should ignore if mouse already down', () => {
      handler.mouseStatus = 'down'
      handler.updateObjectList = jest.fn()

      handler.mouseDown({ x: 100, y: 100 })

      expect(handler.updateObjectList).not.toHaveBeenCalled()
    })

    test('should update object list', () => {
      handler.updateObjectList = jest.fn()

      handler.mouseDown({ x: 100, y: 100 })

      expect(handler.updateObjectList).toHaveBeenCalled()
    })

    test('should set mouseStatus to down', () => {
      handler.mouseDown({ x: 100, y: 100 })

      expect(handler.mouseStatus).toBe('down')
    })

    test('should call mouseDown on objects in reverse order', () => {
      const order = []
      const obj1 = { mouseDown: jest.fn(() => { order.push(1); return false }) }
      const obj2 = { mouseDown: jest.fn(() => { order.push(2); return true }) }
      handler.objectList = [
        { layer: 5, obj: obj1 },
        { layer: 10, obj: obj2 }
      ]

      handler.mouseDown({ x: 100, y: 100 })

      expect(order).toEqual([2])  // Stops after obj2 returns true
    })

    test('should enable dragMode if object is draggable', () => {
      const obj = {
        mouseDown: jest.fn().mockReturnValue(true),
        isDragObject: true,
        dragCursor: 'grabbing'
      }
      handler.objectList = [{ layer: 10, obj: obj }]

      handler.mouseDown({ x: 100, y: 100 })

      expect(handler.dragMode).toBe(true)
    })

    test('should set drag cursor', () => {
      const obj = {
        mouseDown: jest.fn().mockReturnValue(true),
        isDragObject: true,
        dragCursor: 'move'
      }
      handler.objectList = [{ layer: 10, obj: obj }]

      handler.mouseDown({ x: 100, y: 100 })

      expect(mockCursor.setCursor).toHaveBeenCalledWith('move')
    })
  })

  describe('mouseUp', () => {
    beforeEach(() => {
      handler.mouseStatus = 'down'
    })

    test('should ignore if mouse already up', () => {
      handler.mouseStatus = 'up'
      handler.updateObjectList = jest.fn()

      handler.mouseUp({ x: 100, y: 100 })

      expect(handler.updateObjectList).not.toHaveBeenCalled()
    })

    test('should update object list', () => {
      handler.updateObjectList = jest.fn()

      handler.mouseUp({ x: 100, y: 100 })

      expect(handler.updateObjectList).toHaveBeenCalled()
    })

    test('should disable dragMode', () => {
      handler.dragMode = true

      handler.mouseUp({ x: 100, y: 100 })

      expect(handler.dragMode).toBe(false)
    })

    test('should set mouseStatus to up', () => {
      handler.mouseUp({ x: 100, y: 100 })

      expect(handler.mouseStatus).toBe('up')
    })

    test('should call mouseUp on all objects', () => {
      const obj1 = { mouseUp: jest.fn() }
      const obj2 = { mouseUp: jest.fn() }
      handler.objectList = [
        { layer: 5, obj: obj1 },
        { layer: 10, obj: obj2 }
      ]

      handler.mouseUp({ x: 100, y: 100 })

      expect(obj1.mouseUp).toHaveBeenCalled()
      expect(obj2.mouseUp).toHaveBeenCalled()
    })
  })

  describe('setActivePauseAll', () => {
    test('should set activePause on all objects', () => {
      const obj1 = { activePause: false }
      const obj2 = { activePause: false }
      handler.objectList = [
        { layer: 5, obj: obj1 },
        { layer: 10, obj: obj2 }
      ]

      handler.setActivePauseAll(true)

      expect(obj1.activePause).toBe(true)
      expect(obj2.activePause).toBe(true)
    })

    test('should disable activePause', () => {
      const obj = { activePause: true }
      handler.objectList = [{ layer: 10, obj: obj }]

      handler.setActivePauseAll(false)

      expect(obj.activePause).toBe(false)
    })
  })

  describe('getToWhere', () => {
    test('should return currentToWhere', () => {
      handler.currentToWhere = 'Inventory'

      expect(handler.getToWhere()).toBe('Inventory')
    })

    test('should return NoWhere by default', () => {
      expect(handler.getToWhere()).toBe('NoWhere')
    })
  })
})
