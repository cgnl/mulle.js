/**
 * LoopHandler.test.js - TDD tests based on original Lingo
 * ParentScript 18 - LoopHandler.ls
 *
 * Game loop manager that handles adding/removing objects and calling their loop methods.
 */
'use strict'

import LoopHandler from '../LoopHandler'

describe('LoopHandler', () => {
  let handler

  beforeEach(() => {
    handler = new LoopHandler()
  })

  describe('constructor (new me)', () => {
    test('should initialize empty addList', () => {
      expect(handler.addList).toEqual([])
    })

    test('should initialize empty deleteList', () => {
      expect(handler.deleteList).toEqual([])
    })

    test('should initialize empty objectList', () => {
      expect(handler.objectList).toEqual([])
    })
  })

  describe('kill', () => {
    test('should clear addList', () => {
      handler.addList = [{ loop: jest.fn() }]

      handler.kill()

      expect(handler.addList).toBe(0)
    })

    test('should clear deleteList', () => {
      handler.deleteList = [{ loop: jest.fn() }]

      handler.kill()

      expect(handler.deleteList).toBe(0)
    })

    test('should clear objectList', () => {
      handler.objectList = [{ loop: jest.fn() }]

      handler.kill()

      expect(handler.objectList).toBe(0)
    })

    test('should return 0', () => {
      expect(handler.kill()).toBe(0)
    })
  })

  describe('addObject', () => {
    test('should add object to addList', () => {
      const obj = { loopMe: false }

      handler.addObject(obj)

      expect(handler.addList).toContain(obj)
    })

    test('should set loopMe property to true', () => {
      const obj = { loopMe: false }

      handler.addObject(obj)

      expect(obj.loopMe).toBe(true)
    })

    test('should handle multiple objects', () => {
      const obj1 = { loopMe: false }
      const obj2 = { loopMe: false }

      handler.addObject(obj1)
      handler.addObject(obj2)

      expect(handler.addList).toHaveLength(2)
      expect(handler.addList).toContain(obj1)
      expect(handler.addList).toContain(obj2)
    })

    test('should accept layer argument (ignored)', () => {
      const obj = { loopMe: false }

      handler.addObject(obj, 1)

      expect(handler.addList).toContain(obj)
    })
  })

  describe('deleteObject', () => {
    test('should add object to deleteList', () => {
      const obj = { loopMe: true }

      handler.deleteObject(obj)

      expect(handler.deleteList).toContain(obj)
    })

    test('should set loopMe property to false', () => {
      const obj = { loopMe: true }

      handler.deleteObject(obj)

      expect(obj.loopMe).toBe(false)
    })

    test('should handle multiple deletions', () => {
      const obj1 = { loopMe: true }
      const obj2 = { loopMe: true }

      handler.deleteObject(obj1)
      handler.deleteObject(obj2)

      expect(handler.deleteList).toHaveLength(2)
    })
  })

  describe('loop', () => {
    test('should process deleteList first', () => {
      const obj = { loopMe: true, loop: jest.fn() }
      handler.objectList = [obj]
      handler.deleteList = [obj]

      handler.loop()

      expect(handler.objectList).not.toContain(obj)
    })

    test('should clear deleteList after processing', () => {
      const obj = { loopMe: false }
      handler.deleteList = [obj]

      handler.loop()

      expect(handler.deleteList).toEqual([])
    })

    test('should add objects from addList to objectList', () => {
      const obj = { loopMe: true, loop: jest.fn() }
      handler.addList = [obj]

      handler.loop()

      expect(handler.objectList).toContain(obj)
    })

    test('should clear addList after processing', () => {
      const obj = { loopMe: true }
      handler.addList = [obj]

      handler.loop()

      expect(handler.addList).toEqual([])
    })

    test('should call loop on objects with loopMe = true', () => {
      const obj = { loopMe: true, loop: jest.fn() }
      handler.objectList = [obj]

      handler.loop()

      expect(obj.loop).toHaveBeenCalled()
    })

    test('should not call loop on objects with loopMe = false', () => {
      const obj = { loopMe: false, loop: jest.fn() }
      handler.objectList = [obj]

      handler.loop()

      expect(obj.loop).not.toHaveBeenCalled()
    })

    test('should handle mixed loopMe states', () => {
      const obj1 = { loopMe: true, loop: jest.fn() }
      const obj2 = { loopMe: false, loop: jest.fn() }
      const obj3 = { loopMe: true, loop: jest.fn() }
      handler.objectList = [obj1, obj2, obj3]

      handler.loop()

      expect(obj1.loop).toHaveBeenCalled()
      expect(obj2.loop).not.toHaveBeenCalled()
      expect(obj3.loop).toHaveBeenCalled()
    })

    test('should process add then loop in same frame', () => {
      const obj = { loopMe: true, loop: jest.fn() }
      handler.addObject(obj)

      handler.loop()

      expect(handler.objectList).toContain(obj)
      expect(obj.loop).toHaveBeenCalled()
    })

    test('should remove deleted objects before looping', () => {
      const obj = { loopMe: true, loop: jest.fn() }
      handler.objectList = [obj]
      handler.deleteObject(obj)

      handler.loop()

      // loopMe is set to false by deleteObject
      expect(obj.loopMe).toBe(false)
      expect(obj.loop).not.toHaveBeenCalled()
    })

    test('should handle objects without loop method', () => {
      const obj = { loopMe: true }
      handler.objectList = [obj]

      // Should not throw
      expect(() => handler.loop()).not.toThrow()
    })
  })

  describe('integration', () => {
    test('should handle full lifecycle', () => {
      const obj = { loopMe: false, loop: jest.fn() }

      // Add object
      handler.addObject(obj)
      expect(obj.loopMe).toBe(true)

      // First loop - object gets added and looped
      handler.loop()
      expect(obj.loop).toHaveBeenCalledTimes(1)

      // Second loop - object loops again
      handler.loop()
      expect(obj.loop).toHaveBeenCalledTimes(2)

      // Delete object
      handler.deleteObject(obj)
      expect(obj.loopMe).toBe(false)

      // Third loop - object removed, no more loops
      handler.loop()
      expect(obj.loop).toHaveBeenCalledTimes(2)
    })

    test('should handle rapid add/delete', () => {
      const obj = { loopMe: false, loop: jest.fn() }

      handler.addObject(obj)
      handler.deleteObject(obj)

      handler.loop()

      // Object is in objectList (added after delete processed)
      // but loopMe=false, so loop not called
      expect(handler.objectList).toContain(obj)
      expect(obj.loopMe).toBe(false)
      expect(obj.loop).not.toHaveBeenCalled()

      // To fully remove, must delete again
      handler.deleteObject(obj)
      handler.loop()
      expect(handler.objectList).not.toContain(obj)
    })
  })
})
