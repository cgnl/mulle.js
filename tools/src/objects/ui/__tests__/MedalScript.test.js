/**
 * MedalScript.test.js - TDD tests based on original Lingo MedalScript.ls (ParentScript 66)
 *
 * Handles medal award display and animation.
 *
 * Original Lingo properties:
 * - SP: base sprite channel
 * - sndId: sound effect ID
 */
'use strict'

import MedalScript from '../MedalScript'

describe('MedalScript', () => {
  let medal
  let mockUserBoat

  beforeEach(() => {
    mockUserBoat = {
      medals: []
    }
  })

  describe('constructor (new me, argMedalID, argSound)', () => {
    test('should return null if medal already earned', () => {
      // Original: if getMedal(boat, argMedalID) then return 0
      mockUserBoat.medals = [1]

      medal = new MedalScript(1, null, mockUserBoat, 50)

      expect(medal.active).toBe(false)
    })

    test('should add medal to user boat', () => {
      medal = new MedalScript(1, null, mockUserBoat, 50)

      expect(mockUserBoat.medals).toContain(1)
    })

    test('should store sprite channel', () => {
      medal = new MedalScript(1, null, mockUserBoat, 50)

      expect(medal.SP).toBe(50)
    })

    test('should use default sound if none provided', () => {
      // Original: if voidp(argSound) then set argSound to "00e101v0"
      medal = new MedalScript(1, null, mockUserBoat, 50)

      expect(medal.sound).toBe('00e101v0')
    })

    test('should use provided sound', () => {
      medal = new MedalScript(1, 'custom_sound', mockUserBoat, 50)

      expect(medal.sound).toBe('custom_sound')
    })

    test('should store medal ID', () => {
      medal = new MedalScript(3, null, mockUserBoat, 50)

      expect(medal.medalID).toBe(3)
    })

    test('should be active when new medal', () => {
      medal = new MedalScript(1, null, mockUserBoat, 50)

      expect(medal.active).toBe(true)
    })
  })

  describe('getMedalMember (static)', () => {
    test('should return medal member name for ID', () => {
      // Original: set tmpMedals to ["00n003v0-1", ...]
      const member = MedalScript.getMedalMember(1)

      expect(member).toBe('00n003v0-1')
    })

    test('should return member for all 7 medals', () => {
      for (let i = 1; i <= 7; i++) {
        const member = MedalScript.getMedalMember(i)
        expect(member).toBeDefined()
      }
    })
  })

  describe('getDisplayInfo', () => {
    beforeEach(() => {
      medal = new MedalScript(2, null, mockUserBoat, 50)
    })

    test('should return sprite info for 3 layers', () => {
      const info = medal.getDisplayInfo()

      expect(info.sprites.length).toBe(3)
    })

    test('should position sprites at center', () => {
      // Original: set the loc to point(320, 202)
      const info = medal.getDisplayInfo()

      info.sprites.forEach(sprite => {
        expect(sprite.loc.x).toBe(320)
        expect(sprite.loc.y).toBe(202)
      })
    })

    test('should include background member', () => {
      const info = medal.getDisplayInfo()

      expect(info.sprites[0].member).toBe('33b019v0')
    })

    test('should include medal member', () => {
      const info = medal.getDisplayInfo()

      expect(info.sprites[1].member).toBe('00n003v0-1')
    })

    test('should include foreground member', () => {
      const info = medal.getDisplayInfo()

      expect(info.sprites[2].member).toBe('33b020v0')
    })

    test('should return null when not active', () => {
      medal.active = false

      const info = medal.getDisplayInfo()

      expect(info).toBeNull()
    })
  })

  describe('kill (on kill me)', () => {
    beforeEach(() => {
      medal = new MedalScript(1, null, mockUserBoat, 50)
    })

    test('should set active to false', () => {
      medal.kill()

      expect(medal.active).toBe(false)
    })

    test('should return null', () => {
      expect(medal.kill()).toBeNull()
    })
  })

  describe('loop (on loop me)', () => {
    beforeEach(() => {
      medal = new MedalScript(1, null, mockUserBoat, 50)
    })

    test('should return true while sound playing', () => {
      // Original: if finished(gSound, sndId) then kill(me)
      const result = medal.loop(false) // Sound not finished

      expect(result).toBe(true)
      expect(medal.active).toBe(true)
    })

    test('should kill and return false when sound finished', () => {
      const result = medal.loop(true) // Sound finished

      expect(result).toBe(false)
      expect(medal.active).toBe(false)
    })
  })

  describe('mulleFinished (on mulleFinished me)', () => {
    test('should kill medal', () => {
      medal = new MedalScript(1, null, mockUserBoat, 50)

      medal.mulleFinished()

      expect(medal.active).toBe(false)
    })
  })
})
