/**
 * Keys.test.js - TDD tests based on original Lingo Keys.ls (MovieScript 5)
 *
 * Keyboard and mouse input handler for the driving scene.
 * Translates key events to boat steering commands.
 */
'use strict'

import Keys from '../Keys'

describe('Keys', () => {
  let keys
  let mockDir

  beforeEach(() => {
    mockDir = {
      gotKeyPoll: false,
      key: jest.fn(),
      mouse: jest.fn()
    }
    keys = new Keys(mockDir)
  })

  describe('constructor', () => {
    test('should store director reference', () => {
      expect(keys.dir).toBe(mockDir)
    })

    test('should work without director', () => {
      const keysNoDir = new Keys(null)
      expect(keysNoDir.dir).toBeNull()
    })
  })

  describe('keyDown', () => {
    test('should ignore if no director', () => {
      keys.dir = null

      keys.keyDown({ keyCode: 123, key: '' })

      expect(mockDir.key).not.toHaveBeenCalled()
    })

    test('should ignore if gotKeyPoll is true', () => {
      mockDir.gotKeyPoll = true

      keys.keyDown({ keyCode: 123, key: '' })

      expect(mockDir.key).not.toHaveBeenCalled()
    })

    test('should send left on keyCode 123 (left arrow)', () => {
      keys.keyDown({ keyCode: 123, key: '' })

      expect(mockDir.key).toHaveBeenCalledWith('left', 'NA')
    })

    test('should send right on keyCode 124 (right arrow)', () => {
      keys.keyDown({ keyCode: 124, key: '' })

      expect(mockDir.key).toHaveBeenCalledWith('right', 'NA')
    })

    test('should send throttle up on minus key', () => {
      // Original: key(gDir, 2, 1) - arg 2 = throttle, 1 = increase
      keys.keyDown({ keyCode: 0, key: '-' })

      expect(mockDir.key).toHaveBeenCalledWith(2, 1)
    })

    test('should send throttle down on period key', () => {
      // Original: key(gDir, 2, -1) - arg 2 = throttle, -1 = decrease
      keys.keyDown({ keyCode: 0, key: '.' })

      expect(mockDir.key).toHaveBeenCalledWith(2, -1)
    })

    test('should send sail adjust up on less-than key', () => {
      // Original: key(gDir, 1, 1) - arg 1 = sail, 1 = increase
      keys.keyDown({ keyCode: 0, key: '<' })

      expect(mockDir.key).toHaveBeenCalledWith(1, 1)
    })

    test('should send sail adjust down on z key', () => {
      // Original: key(gDir, 1, -1) - arg 1 = sail, -1 = decrease
      keys.keyDown({ keyCode: 0, key: 'z' })

      expect(mockDir.key).toHaveBeenCalledWith(1, -1)
    })

    test('should ignore f key (fuel toggle - empty handler)', () => {
      keys.keyDown({ keyCode: 0, key: 'f' })

      // Original has empty handler for 'f'
      expect(mockDir.key).not.toHaveBeenCalled()
    })

    test('should ignore unrecognized keys', () => {
      keys.keyDown({ keyCode: 0, key: 'x' })

      expect(mockDir.key).not.toHaveBeenCalled()
    })

    // Browser-style key events (ArrowLeft, ArrowRight)
    test('should handle ArrowLeft key name', () => {
      keys.keyDown({ keyCode: 37, key: 'ArrowLeft' })

      expect(mockDir.key).toHaveBeenCalledWith('left', 'NA')
    })

    test('should handle ArrowRight key name', () => {
      keys.keyDown({ keyCode: 39, key: 'ArrowRight' })

      expect(mockDir.key).toHaveBeenCalledWith('right', 'NA')
    })
  })

  describe('keyUp', () => {
    test('should ignore if no director', () => {
      keys.dir = null

      keys.keyUp({})

      expect(mockDir.key).not.toHaveBeenCalled()
    })

    test('should send release signal', () => {
      // Original: key(gDir, 0, #Release)
      keys.keyUp({})

      expect(mockDir.key).toHaveBeenCalledWith(0, 'Release')
    })
  })

  describe('keyPoll (for KeyPoll Xtra simulation)', () => {
    test('should detect left arrow from key list', () => {
      // Original: if getPos(tmp, 37) or getPos(tmp, 123)
      keys.keyPoll([37])

      expect(mockDir.key).toHaveBeenCalledWith('left', 0)
    })

    test('should detect right arrow from key list', () => {
      // Original: if getPos(tmp, 39) or getPos(tmp, 124)
      keys.keyPoll([39])

      expect(mockDir.key).toHaveBeenCalledWith('right', 0)
    })

    test('should detect up arrow from key list', () => {
      // Original: if getPos(tmp, 38) or getPos(tmp, 126)
      keys.keyPoll([38])

      expect(mockDir.key).toHaveBeenCalledWith(0, 'up')
    })

    test('should detect down arrow from key list', () => {
      // Original: if getPos(tmp, 40) or getPos(tmp, 125)
      keys.keyPoll([40])

      expect(mockDir.key).toHaveBeenCalledWith(0, 'down')
    })

    test('should detect both left and up', () => {
      keys.keyPoll([37, 38])

      expect(mockDir.key).toHaveBeenCalledWith('left', 'up')
    })

    test('should detect both right and down', () => {
      keys.keyPoll([39, 40])

      expect(mockDir.key).toHaveBeenCalledWith('right', 'down')
    })

    test('should send zeros when no arrows pressed', () => {
      keys.keyPoll([])

      expect(mockDir.key).toHaveBeenCalledWith(0, 0)
    })

    test('should ignore if no director', () => {
      keys.dir = null

      keys.keyPoll([37])

      expect(mockDir.key).not.toHaveBeenCalled()
    })

    test('should handle Mac keyCode 123 for left', () => {
      keys.keyPoll([123])

      expect(mockDir.key).toHaveBeenCalledWith('left', 0)
    })

    test('should handle Mac keyCode 124 for right', () => {
      keys.keyPoll([124])

      expect(mockDir.key).toHaveBeenCalledWith('right', 0)
    })

    test('should handle Mac keyCode 126 for up', () => {
      keys.keyPoll([126])

      expect(mockDir.key).toHaveBeenCalledWith(0, 'up')
    })

    test('should handle Mac keyCode 125 for down', () => {
      keys.keyPoll([125])

      expect(mockDir.key).toHaveBeenCalledWith(0, 'down')
    })
  })

  describe('mouseDown', () => {
    test('should ignore if no director', () => {
      keys.dir = null

      keys.mouseDown({})

      expect(mockDir.mouse).not.toHaveBeenCalled()
    })

    test('should send mouse down event to director', () => {
      // Original: mouse(gDir, 0, #down)
      keys.mouseDown({})

      expect(mockDir.mouse).toHaveBeenCalledWith(0, 'down')
    })
  })

  describe('setDirector', () => {
    test('should update director reference', () => {
      const newDir = { key: jest.fn(), mouse: jest.fn() }

      keys.setDirector(newDir)

      expect(keys.dir).toBe(newDir)
    })

    test('should allow clearing director', () => {
      keys.setDirector(null)

      expect(keys.dir).toBeNull()
    })
  })
})
