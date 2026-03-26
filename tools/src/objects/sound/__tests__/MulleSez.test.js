/**
 * MulleSez.test.js - TDD tests based on original Lingo MulleSez.ls (ParentScript 42)
 *
 * Mulle's speech/comment system with priority queue.
 *
 * Original Lingo properties:
 * - commentList: Mapping of comment types to sound numbers
 * - soundsInQ: Queue of pending sounds
 * - currentPriority: Priority of currently playing sound
 * - lastPlayed: Track last played sounds to avoid repetition
 */
'use strict'

import MulleSez from '../MulleSez'

describe('MulleSez', () => {
  let mulleSez

  beforeEach(() => {
    mulleSez = new MulleSez()
  })

  describe('constructor (new me)', () => {
    test('should initialize commentList with comment types', () => {
      // Original: set commentList to [#Vomit: [...], #Hungry: [...], ...]
      expect(mulleSez.commentList).toBeDefined()
      expect(mulleSez.commentList.Vomit).toBeDefined()
      expect(mulleSez.commentList.Hungry).toBeDefined()
      expect(mulleSez.commentList.crash).toBeDefined()
    })

    test('should initialize lastPlayed tracking', () => {
      expect(mulleSez.lastPlayed).toBeDefined()
    })

    test('should initialize currentPriority to 0', () => {
      expect(mulleSez.currentPriority).toBe(0)
    })

    test('should initialize empty soundsInQ', () => {
      expect(mulleSez.soundsInQ).toEqual([])
    })

    test('should initialize sndId to null', () => {
      expect(mulleSez.sndId).toBeNull()
    })

    test('should initialize counter to 0', () => {
      expect(mulleSez.counter).toBe(0)
    })

    test('should initialize nowPlaying to empty', () => {
      expect(mulleSez.nowPlaying).toBe('')
    })
  })

  describe('kill (on kill me)', () => {
    test('should return null', () => {
      expect(mulleSez.kill()).toBeNull()
    })

    test('should clear soundsInQ', () => {
      mulleSez.soundsInQ = [{ priority: 1, sound: 'test' }]

      mulleSez.kill()

      expect(mulleSez.soundsInQ).toEqual([])
    })

    test('should clear reportObject', () => {
      mulleSez.reportObject = { some: 'object' }

      mulleSez.kill()

      expect(mulleSez.reportObject).toBeNull()
    })
  })

  describe('isQuiet (on isQuiet me)', () => {
    test('should return true when no sound playing', () => {
      mulleSez.sndId = null

      expect(mulleSez.isQuiet()).toBe(true)
    })

    test('should return false when sound is playing', () => {
      mulleSez.sndId = 'sound123'
      mulleSez.soundFinished = false

      expect(mulleSez.isQuiet()).toBe(false)
    })
  })

  describe('say (on say me, argWhat, argPriority, argReportObject, argPutInQ, argID, argMinWait)', () => {
    test('should return null if same sound already playing', () => {
      // Original: if argWhat = nowPlaying then return 0
      mulleSez.nowPlaying = '05d052v0'

      const result = mulleSez.say('05d052v0', 5)

      expect(result).toBeNull()
    })

    test('should convert symbol to sound file name', () => {
      // Original: set argWhat to "05d" & convItoS(tmpSndNr, 3) & "v0"
      const result = mulleSez.say('Vomit', 5)

      expect(result.sound).toMatch(/^05d\d{3}v0$/)
    })

    test('should play sound with no previous sound', () => {
      const result = mulleSez.say('05d100v0', 5)

      expect(result).toBeDefined()
      expect(mulleSez.sndId).toBeDefined()
      expect(mulleSez.nowPlaying).toBe('05d100v0')
    })

    test('should stop lower priority sound', () => {
      // Play low priority sound
      mulleSez.say('05d100v0', 3)
      expect(mulleSez.currentPriority).toBe(3)

      // Play higher priority (lower number = higher priority)
      const result = mulleSez.say('05d200v0', 1)

      expect(result).toBeDefined()
      expect(mulleSez.nowPlaying).toBe('05d200v0')
    })

    test('should queue higher priority sound', () => {
      // Play high priority sound
      mulleSez.say('05d100v0', 1)

      // Queue lower priority sound
      mulleSez.say('05d200v0', 5, null, 'Q')

      expect(mulleSez.soundsInQ.length).toBe(1)
      expect(mulleSez.soundsInQ[0].sound).toBe('05d200v0')
    })

    test('should not queue if argPutInQ is not Q', () => {
      mulleSez.say('05d100v0', 1)

      const result = mulleSez.say('05d200v0', 5)

      expect(result).toBeNull()
      expect(mulleSez.soundsInQ.length).toBe(0)
    })

    test('should store reportObject', () => {
      const reportObj = { callback: jest.fn() }

      mulleSez.say('05d100v0', 5, reportObj)

      expect(mulleSez.reportObject).toBe(reportObj)
    })

    test('should store currentIdentifier', () => {
      mulleSez.say('05d100v0', 5, null, null, 'GoHome')

      expect(mulleSez.currentIdentifier).toBe('GoHome')
    })

    test('should track lastPlayed to avoid repetition', () => {
      mulleSez.say('Vomit', 5)
      const firstSound = mulleSez.nowPlaying

      // Reset to allow another play
      mulleSez.sndId = null
      mulleSez.nowPlaying = ''
      mulleSez.counter = 1000 // Enough time passed

      mulleSez.say('Vomit', 5)
      // Should pick a different sound if available
      expect(mulleSez.lastPlayed.Vomit.nr).toBeDefined()
    })

    test('should respect minWait before replaying', () => {
      mulleSez.say('Vomit', 5, null, null, null, 100)

      // Try to play again immediately
      mulleSez.sndId = null
      mulleSez.nowPlaying = ''

      const result = mulleSez.say('Vomit', 5)

      expect(result).toBeNull() // Should not play - min wait not passed
    })
  })

  describe('loop (on loop me)', () => {
    test('should increment counter', () => {
      mulleSez.loop(true)

      expect(mulleSez.counter).toBe(1)
    })

    test('should call reportObject.mulleFinished when sound ends', () => {
      const reportObj = { mulleFinished: jest.fn() }
      mulleSez.say('05d100v0', 5, reportObj, null, 'TestID')

      // Simulate sound finished
      mulleSez.loop(true)

      expect(reportObj.mulleFinished).toHaveBeenCalledWith('TestID')
    })

    test('should reset state when sound ends', () => {
      mulleSez.say('05d100v0', 5)

      mulleSez.loop(true)

      expect(mulleSez.sndId).toBeNull()
      expect(mulleSez.currentPriority).toBe(0)
      expect(mulleSez.nowPlaying).toBe('')
    })

    test('should play next queued sound', () => {
      mulleSez.say('05d100v0', 1)
      mulleSez.say('05d200v0', 5, null, 'Q')

      // Finish first sound
      mulleSez.loop(true)

      expect(mulleSez.nowPlaying).toBe('05d200v0')
      expect(mulleSez.soundsInQ.length).toBe(0)
    })

    test('should play sound list sequentially', () => {
      mulleSez.playStringOrList(['05d001v0', '05d002v0', '05d003v0'])

      // First sound
      expect(mulleSez.soundCounter).toBe(1)

      // Finish first, play second
      mulleSez.loop(true)
      expect(mulleSez.soundCounter).toBe(2)

      // Finish second, play third
      mulleSez.loop(true)
      expect(mulleSez.soundCounter).toBe(3)
    })
  })

  describe('stop (on stop me)', () => {
    test('should clear nowPlaying', () => {
      mulleSez.say('05d100v0', 5)

      mulleSez.stop()

      expect(mulleSez.nowPlaying).toBe('')
    })

    test('should clear sndId', () => {
      mulleSez.say('05d100v0', 5)

      mulleSez.stop()

      expect(mulleSez.sndId).toBeNull()
    })

    test('should clear reportObject', () => {
      mulleSez.say('05d100v0', 5, { some: 'object' })

      mulleSez.stop()

      expect(mulleSez.reportObject).toBeNull()
    })
  })

  describe('deleteSound (on deleteSound me, argSoundOrReportObject)', () => {
    test('should remove sound from queue by name', () => {
      mulleSez.say('05d100v0', 1)
      mulleSez.say('05d200v0', 5, null, 'Q')
      mulleSez.say('05d300v0', 6, null, 'Q')

      mulleSez.deleteSound('05d200v0')

      expect(mulleSez.soundsInQ.length).toBe(1)
      expect(mulleSez.soundsInQ[0].sound).toBe('05d300v0')
    })

    test('should stop currently playing sound if matching', () => {
      mulleSez.say('05d100v0', 5)

      mulleSez.deleteSound('05d100v0')

      expect(mulleSez.nowPlaying).toBe('')
    })

    test('should remove sounds from queue by reportObject', () => {
      const reportObj = { id: 1 }
      mulleSez.say('05d100v0', 1)
      mulleSez.say('05d200v0', 5, reportObj, 'Q')

      mulleSez.deleteSound(reportObj)

      expect(mulleSez.soundsInQ.length).toBe(0)
    })
  })

  describe('deleteReference (on deleteReference me, argObj)', () => {
    test('should clear reportObject if matching', () => {
      const reportObj = { id: 1 }
      mulleSez.say('05d100v0', 5, reportObj)

      mulleSez.deleteReference(reportObj)

      expect(mulleSez.reportObject).toBeNull()
    })

    test('should delete sounds for that object', () => {
      const reportObj = { id: 1 }
      mulleSez.say('05d100v0', 1)
      mulleSez.say('05d200v0', 5, reportObj, 'Q')

      mulleSez.deleteReference(reportObj)

      expect(mulleSez.soundsInQ.length).toBe(0)
    })
  })
})
