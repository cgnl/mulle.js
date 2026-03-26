/**
 * DSoundStuff.test.js - TDD tests based on original Lingo
 * MovieScript 4 - DSoundStuff.ls
 *
 * DirectSound initialization and management.
 */
'use strict'

import DSoundStuff from '../DSoundStuff'

describe('DSoundStuff', () => {
  let dsound
  let mockSound

  beforeEach(() => {
    mockSound = {
      mode: 'normal',
      stopAll: jest.fn(),
      kill: jest.fn().mockReturnValue(null)
    }
    dsound = new DSoundStuff(mockSound)
  })

  describe('constructor', () => {
    test('should store sound reference', () => {
      expect(dsound.sound).toBe(mockSound)
    })

    test('should initialize useDirectSound to true', () => {
      expect(dsound.useDirectSound).toBe(true)
    })
  })

  describe('tryToUseDSound', () => {
    test('should check if DirectSound should be used', () => {
      const result = dsound.tryToUseDSound()

      // Returns sound object or null
      expect(result !== undefined).toBe(true)
    })

    test('should return null if useDirectSound is false', () => {
      dsound.useDirectSound = false

      const result = dsound.tryToUseDSound()

      expect(result).toBeNull()
    })

    test('should return null if not on Windows', () => {
      dsound.machineType = 'Mac'

      const result = dsound.tryToUseDSound()

      expect(result).toBeNull()
    })

    test('should keep normal sound if DirectSound not available', () => {
      dsound.availableXtras = ''

      const result = dsound.tryToUseDSound()

      expect(result).toBe(mockSound)
    })
  })

  describe('useNormalSound', () => {
    test('should kill xtra sound and create normal sound', () => {
      mockSound.mode = 'xtra'

      dsound.useNormalSound()

      expect(mockSound.kill).toHaveBeenCalled()
    })

    test('should stop all sounds if already normal', () => {
      mockSound.mode = 'normal'

      dsound.useNormalSound()

      expect(mockSound.stopAll).toHaveBeenCalled()
    })
  })

  describe('isDirectSoundEnabled', () => {
    test('should return useDirectSound state', () => {
      dsound.useDirectSound = true
      expect(dsound.isDirectSoundEnabled()).toBe(true)

      dsound.useDirectSound = false
      expect(dsound.isDirectSoundEnabled()).toBe(false)
    })
  })

  describe('setDirectSoundEnabled', () => {
    test('should set useDirectSound state', () => {
      dsound.setDirectSoundEnabled(false)
      expect(dsound.useDirectSound).toBe(false)

      dsound.setDirectSoundEnabled(true)
      expect(dsound.useDirectSound).toBe(true)
    })
  })
})
