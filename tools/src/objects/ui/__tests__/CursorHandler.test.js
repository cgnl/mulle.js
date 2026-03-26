/**
 * CursorHandler.test.js - TDD tests based on original Lingo
 * ParentScript 23 - CursorHandler.ls
 *
 * Custom cursor management.
 */
'use strict'

import CursorHandler from '../CursorHandler'

describe('CursorHandler', () => {
  let cursor

  beforeEach(() => {
    cursor = new CursorHandler()
  })

  describe('constructor (new me)', () => {
    test('should initialize loopMe to false', () => {
      expect(cursor.loopMe).toBe(false)
    })

    test('should initialize SP to 0', () => {
      expect(cursor.SP).toBe(0)
    })

    test('should initialize currentType to undefined', () => {
      expect(cursor.currentType).toBeUndefined()
    })
  })

  describe('init', () => {
    test('should set sprite channel', () => {
      cursor.init(120, 'Standard')

      expect(cursor.SP).toBe(120)
    })

    test('should use default sprite 115 if not provided', () => {
      cursor.init(undefined, 'Standard')

      expect(cursor.SP).toBe(115)
    })

    test('should set cursor type', () => {
      cursor.init(115, 'Clickable')

      expect(cursor.currentType).toBe('Clickable')
    })

    test('should use Standard type if not provided', () => {
      cursor.init(115)

      expect(cursor.currentType).toBe('Standard')
    })

    test('should enable loopMe', () => {
      cursor.init(115, 'Standard')

      expect(cursor.loopMe).toBe(true)
    })
  })

  describe('kill', () => {
    test('should clear SP', () => {
      cursor.SP = 115
      cursor.kill()

      expect(cursor.SP).toBe(0)
    })

    test('should clear currentType', () => {
      cursor.currentType = 'Clickable'
      cursor.kill()

      expect(cursor.currentType).toBe(0)
    })

    test('should return 0', () => {
      expect(cursor.kill()).toBe(0)
    })
  })

  describe('setCursor', () => {
    test('should set Standard cursor', () => {
      cursor.setCursor('Standard')

      expect(cursor.currentType).toBe('Standard')
      expect(cursor.cursorPic).toBe('00b001v0')
    })

    test('should set Clickable cursor', () => {
      cursor.setCursor('Clickable')

      expect(cursor.currentType).toBe('Clickable')
      expect(cursor.cursorPic).toBe('00b010v0')
    })

    test('should set GoLeft cursor', () => {
      cursor.setCursor('GoLeft')

      expect(cursor.currentType).toBe('GoLeft')
      expect(cursor.cursorPic).toBe('00b004v0')
    })

    test('should set GoForward cursor', () => {
      cursor.setCursor('GoForward')

      expect(cursor.currentType).toBe('GoForward')
      expect(cursor.cursorPic).toBe('00b002v0')
    })

    test('should set GoRight cursor', () => {
      cursor.setCursor('GoRight')

      expect(cursor.currentType).toBe('GoRight')
      expect(cursor.cursorPic).toBe('00b003v0')
    })

    test('should set Grabable cursor', () => {
      cursor.setCursor('Grabable')

      expect(cursor.currentType).toBe('Grabable')
      expect(cursor.cursorPic).toBe('00b005v0')
    })

    test('should set Grabbed cursor', () => {
      cursor.setCursor('Grabbed')

      expect(cursor.currentType).toBe('Grabbed')
      expect(cursor.cursorPic).toBe('00b006v0')
    })

    test('should set DropLeft cursor', () => {
      cursor.setCursor('DropLeft')

      expect(cursor.currentType).toBe('DropLeft')
      expect(cursor.cursorPic).toBe('00b009v0')
    })

    test('should set DropForward cursor', () => {
      cursor.setCursor('DropForward')

      expect(cursor.currentType).toBe('DropForward')
      expect(cursor.cursorPic).toBe('00b007v0')
    })

    test('should set DropRight cursor', () => {
      cursor.setCursor('DropRight')

      expect(cursor.currentType).toBe('DropRight')
      expect(cursor.cursorPic).toBe('00b008v0')
    })

    test('should fall back to Standard for unknown type', () => {
      cursor.setCursor('Unknown')

      expect(cursor.currentType).toBe('Standard')
      expect(cursor.cursorPic).toBe('00b001v0')
    })

    test('should not change if same type', () => {
      cursor.setCursor('Clickable')
      const firstPic = cursor.cursorPic

      cursor.setCursor('Clickable')

      expect(cursor.cursorPic).toBe(firstPic)
    })

    test('should ignore NoChange type', () => {
      cursor.setCursor('Clickable')
      const type = cursor.currentType

      cursor.setCursor('NoChange')

      expect(cursor.currentType).toBe(type)
    })
  })

  describe('getCursor', () => {
    test('should return current type', () => {
      cursor.currentType = 'Grabbed'

      expect(cursor.getCursor()).toBe('Grabbed')
    })
  })

  describe('setCursorSP/getCursorSP', () => {
    test('should set sprite channel', () => {
      cursor.setCursorSP(100)

      expect(cursor.SP).toBe(100)
    })

    test('should get sprite channel', () => {
      cursor.SP = 120

      expect(cursor.getCursorSP()).toBe(120)
    })
  })

  describe('setCursorLoc/getCursorLoc', () => {
    test('should set cursor location', () => {
      cursor.setCursorLoc({ x: 100, y: 200 })

      expect(cursor.loc).toEqual({ x: 100, y: 200 })
    })

    test('should get cursor location', () => {
      cursor.loc = { x: 150, y: 250 }

      expect(cursor.getCursorLoc()).toEqual({ x: 150, y: 250 })
    })
  })

  describe('loop', () => {
    beforeEach(() => {
      cursor.loopMe = true
      cursor.loc = { x: 100, y: 100 }
    })

    test('should update location to mouse position', () => {
      cursor.loop({ x: 200, y: 300 })

      expect(cursor.loc).toEqual({ x: 200, y: 300 })
    })

    test('should not update if loopMe is false', () => {
      cursor.loopMe = false

      cursor.loop({ x: 200, y: 300 })

      expect(cursor.loc).toEqual({ x: 100, y: 100 })
    })

    test('should not update if location unchanged', () => {
      const spy = jest.spyOn(cursor, 'setCursorLoc')

      cursor.loop({ x: 100, y: 100 })

      expect(spy).not.toHaveBeenCalled()
    })
  })
})
