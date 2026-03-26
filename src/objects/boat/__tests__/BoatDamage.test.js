/**
 * Tests for BoatDamage module
 * 
 * These tests verify the damage system matches BoatBase.ls behavior.
 * Reference: BoatBase.ls lines 350-427 (collision and capsize handling)
 * 
 * Key facts from BoatBase.ls:
 * - Crash sounds use prefix "05e", NOT "05d" (lines 363-368)
 * - Sound is actually hardcoded to "05e008v1" (line 368)
 * - Material: 1 = wood, 2 = metal (line 355)
 * - Weight < 100 = Heavy sounds, >= 100 = Light sounds (line 356-360)
 * - Damage > 300 = sound index 3 (vol 90), > 100 = index 2 (vol 75), else index 1 (vol 60)
 * - Durability only decreases when NOT in freeZone (line 373)
 * - At Durability <= 0, says #crash and triggers #GoHomeTow (lines 374-377)
 * - Capsize at abs(sideAngle) > 30 (line 414)
 * - LurchHard at > 27, LurchEasy at > 23 (lines 418-425)
 */
import {
  crashed,
  checkCapsize
} from '../BoatDamage'

describe('BoatDamage', () => {
  describe('crashed - collision handling', () => {
    /**
     * BoatBase.ls lines 350-377: Collision damage in loop()
     * 
     * The original Lingo calculates crash sounds based on:
     * - Material property (1 = wood, 2 = metal)
     * - Weight property (< 100 = Heavy, >= 100 = Light)
     * - Damage amount (> 300, > 100, or less)
     * 
     * Sound lookup table (line 354):
     * [1: [#Heavy: [1, 2, 3], #Light: [4, 5, 6]], 2: [#Heavy: [7, 8, 9], #Light: [10, 11, 12]]]
     * 
     * Final sound format (line 367): "05e" & convItoS(tmpSnd, 3) & "v0"
     * But line 368 hardcodes it to: "05e008v1"
     */
    
    describe('crash sound selection', () => {
      let mockBoat

      beforeEach(() => {
        mockBoat = {
          Durability: 1000,
          maxDurability: 1000,
          speed: 0,
          inFreeZone: false,
          quickProps: {
            Material: 1,  // 1 = wood, 2 = metal (BoatBase.ls line 355)
            weight: 50    // < 100 = Heavy (BoatBase.ls line 356)
          },
          lastCrashTime: 0,
          crashCooldown: 500,
          game: {
            mulle: {
              playAudio: jest.fn()
            },
            time: { now: 1000 }
          }
        }
      })

      it('should use sound prefix 05e, not 05d (BoatBase.ls line 367)', () => {
        // BoatBase.ls line 367: set tmpSnd to "05e" & convItoS(tmpSnd, 3) & "v0"
        // The current JS implementation incorrectly uses "05d"
        crashed(mockBoat, 150)
        
        const playAudioCall = mockBoat.game.mulle.playAudio.mock.calls[0]
        expect(playAudioCall).toBeDefined()
        expect(playAudioCall[0]).toMatch(/^05e/)  // Should start with 05e, not 05d
      })

      it('should actually use hardcoded sound 05e008v1 (BoatBase.ls line 368)', () => {
        // BoatBase.ls line 368: set tmpSnd to "05e008v1"
        // The sound calculation is immediately overwritten with this hardcoded value!
        crashed(mockBoat, 150)
        
        const playAudioCall = mockBoat.game.mulle.playAudio.mock.calls[0]
        expect(playAudioCall).toBeDefined()
        expect(playAudioCall[0]).toBe('05e008v1')
      })

      it('should select wood/heavy sound index 1-3 for Material=1, weight<100 (BoatBase.ls lines 354-366)', () => {
        // Material 1 (wood) + weight < 100 (Heavy) = indices [1, 2, 3]
        // Damage <= 100 = index 1 (sound 05e001v0 before override)
        mockBoat.quickProps.Material = 1
        mockBoat.quickProps.weight = 50
        
        crashed(mockBoat, 50)  // Low damage <= 100
        
        // Before the hardcode override, this would be 05e001v0
        // But due to line 368, it's always 05e008v1
        const playAudioCall = mockBoat.game.mulle.playAudio.mock.calls[0]
        expect(playAudioCall[0]).toBe('05e008v1')
      })

      it('should select metal/light sound index 10-12 for Material=2, weight>=100 (BoatBase.ls lines 354-366)', () => {
        // Material 2 (metal) + weight >= 100 (Light) = indices [10, 11, 12]
        mockBoat.quickProps.Material = 2
        mockBoat.quickProps.weight = 150
        
        crashed(mockBoat, 350)  // High damage > 300 = index 3 in sublist = sound 12
        
        // Before the hardcode override, this would be 05e012v0
        // But due to line 368, it's always 05e008v1
        const playAudioCall = mockBoat.game.mulle.playAudio.mock.calls[0]
        expect(playAudioCall[0]).toBe('05e008v1')
      })
    })

    describe('damage thresholds for sound intensity (BoatBase.ls lines 361-366)', () => {
      let mockBoat

      beforeEach(() => {
        mockBoat = {
          Durability: 1000,
          maxDurability: 1000,
          inFreeZone: false,
          quickProps: { Material: 1, weight: 50 },
          lastCrashTime: 0,
          crashCooldown: 500,
          game: {
            mulle: {
              playAudio: jest.fn().mockReturnValue(42),  // Lingo play() returns sndId
              setVol: jest.fn()
            },
            time: { now: 1000 }
          }
        }
      })

      it('should use volume 90 for damage > 300 (BoatBase.ls lines 361-363)', () => {
        // BoatBase.ls: if tmpReceivedDamage > 300 then set tmpVol to 90
        crashed(mockBoat, 350)
        
        // The volume should be set to 90 for heavy impacts
        // This tests the volume selection logic
        expect(mockBoat.game.mulle.setVol).toHaveBeenCalledWith(
          expect.anything(),
          90
        )
      })

      it('should use volume 75 for damage > 100 but <= 300 (BoatBase.ls lines 364-366)', () => {
        // BoatBase.ls: if tmpReceivedDamage > 100 then set tmpVol to 75
        crashed(mockBoat, 200)
        
        expect(mockBoat.game.mulle.setVol).toHaveBeenCalledWith(
          expect.anything(),
          75
        )
      })

      it('should use volume 60 for damage <= 100 (BoatBase.ls line 366)', () => {
        // BoatBase.ls: else set tmpVol to 60
        crashed(mockBoat, 50)
        
        expect(mockBoat.game.mulle.setVol).toHaveBeenCalledWith(
          expect.anything(),
          60
        )
      })
    })

    describe('durability reduction (BoatBase.ls lines 373-377)', () => {
      let mockBoat

      beforeEach(() => {
        mockBoat = {
          Durability: 1000,
          maxDurability: 1000,
          inFreeZone: false,
          quickProps: { Material: 1, weight: 50 },
          lastCrashTime: 0,
          crashCooldown: 500,
          enabled: true,
          game: {
            mulle: {
              playAudio: jest.fn(),
              say: jest.fn()
            },
            time: { now: 1000 }
          },
          waitToGoHome: jest.fn()
        }
      })

      it('should reduce durability by abs(speed) (BoatBase.ls line 374)', () => {
        // BoatBase.ls: set Durability to Durability - tmpReceivedDamage
        // where tmpReceivedDamage = abs(speed)
        const initialDurability = mockBoat.Durability
        crashed(mockBoat, 150)
        
        expect(mockBoat.Durability).toBe(initialDurability - 150)
      })

      it('should NOT reduce durability when inFreeZone is true (BoatBase.ls line 373)', () => {
        // BoatBase.ls: if not inFreeZone then set Durability to...
        mockBoat.inFreeZone = true
        const initialDurability = mockBoat.Durability
        
        crashed(mockBoat, 150)
        
        expect(mockBoat.Durability).toBe(initialDurability)  // No change
      })

      it('should trigger #crash and #GoHomeTow when Durability <= 0 (BoatBase.ls lines 375-377)', () => {
        // BoatBase.ls: 
        //   if Durability <= 0 then
        //     say(the mulleTalkObject of gDir, #crash, 1, me, #Q, #GoHomeTow)
        //     waitToGoHome(me)
        mockBoat.Durability = 50
        
        crashed(mockBoat, 100)  // Damage exceeds remaining durability
        
        expect(mockBoat.Durability).toBeLessThanOrEqual(0)
        expect(mockBoat.game.mulle.say).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'crash' }),
          expect.objectContaining({ queue: 'Q', callback: 'GoHomeTow' })
        )
        expect(mockBoat.waitToGoHome).toHaveBeenCalled()
      })

      it('should handle negative speeds (abs value) (BoatBase.ls line 351)', () => {
        // BoatBase.ls: set tmpReceivedDamage to abs(speed)
        const initialDurability = mockBoat.Durability
        
        crashed(mockBoat, -200)
        
        expect(mockBoat.Durability).toBe(initialDurability - 200)
      })
    })
  })

  describe('checkCapsize - tilt angle handling', () => {
    /**
     * BoatBase.ls lines 414-427: Capsize and lurch detection in loop()
     * 
     * Thresholds:
     * - abs(tmpSideAngle) > 30 → Capsize, triggers #GoHomeCapsize
     * - abs(tmpSideAngle) > 27 → LurchHard warning
     * - abs(tmpSideAngle) > 23 → LurchEasy warning
     */
    let mockBoat

    beforeEach(() => {
      mockBoat = {
        inFreeZone: false,
        enabled: true,
        lastLurchWarning: 0,
        game: {
          mulle: {
            say: jest.fn()
          },
          time: { now: 10000 }
        },
        waitToGoHome: jest.fn()
      }
    })

    describe('capsize at angle > 30 (BoatBase.ls lines 414-417)', () => {
      it('should capsize and trigger #GoHomeCapsize at angle > 30', () => {
        // BoatBase.ls lines 414-417:
        //   if abs(tmpSideAngle) > 30 then
        //     if not inFreeZone then
        //       say(the mulleTalkObject of gDir, #Capsize, 1, me, #Q, #GoHomeCapsize)
        //       waitToGoHome(me)
        const result = checkCapsize(mockBoat, 35)
        
        expect(result).toBe(true)
        expect(mockBoat.enabled).toBe(false)
        expect(mockBoat.game.mulle.say).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'Capsize' }),
          expect.objectContaining({ queue: 'Q', callback: 'GoHomeCapsize' })
        )
        expect(mockBoat.waitToGoHome).toHaveBeenCalled()
      })

      it('should capsize at negative angle < -30 (absolute value check)', () => {
        // BoatBase.ls: if abs(tmpSideAngle) > 30
        const result = checkCapsize(mockBoat, -35)
        
        expect(result).toBe(true)
        expect(mockBoat.enabled).toBe(false)
      })

      it('should NOT capsize at exactly 30 degrees (> not >=)', () => {
        // BoatBase.ls: if abs(tmpSideAngle) > 30 (strictly greater than)
        const result = checkCapsize(mockBoat, 30)
        
        expect(result).toBe(false)
        expect(mockBoat.enabled).toBe(true)
      })

      it('should NOT capsize when inFreeZone is true (BoatBase.ls line 415)', () => {
        // BoatBase.ls: if not inFreeZone then
        mockBoat.inFreeZone = true
        
        const result = checkCapsize(mockBoat, 35)
        
        expect(result).toBe(false)
        expect(mockBoat.enabled).toBe(true)
        expect(mockBoat.waitToGoHome).not.toHaveBeenCalled()
      })
    })

    describe('lurch warnings (BoatBase.ls lines 418-425)', () => {
      it('should trigger #LurchHard at angle > 27 (BoatBase.ls lines 418-419)', () => {
        // BoatBase.ls: if abs(tmpSideAngle) > 27 then
        //   say(the mulleTalkObject of gDir, #LurchHard, 4, me, 0, 0, 100)
        checkCapsize(mockBoat, 28)
        
        expect(mockBoat.game.mulle.say).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'LurchHard' }),
          expect.objectContaining({ priority: 4, volume: 100 })
        )
      })

      it('should NOT trigger #LurchHard at exactly 27 degrees (> not >=)', () => {
        checkCapsize(mockBoat, 27)
        
        expect(mockBoat.game.mulle.say).not.toHaveBeenCalledWith(
          expect.objectContaining({ type: 'LurchHard' }),
          expect.anything()
        )
      })

      it('should trigger #LurchEasy at angle > 23 but <= 27 (BoatBase.ls lines 421-423)', () => {
        // BoatBase.ls: if abs(tmpSideAngle) > 23 then
        //   say(the mulleTalkObject of gDir, #LurchEasy, 4, me, 0, 0, 100)
        checkCapsize(mockBoat, 25)
        
        expect(mockBoat.game.mulle.say).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'LurchEasy' }),
          expect.objectContaining({ priority: 4, volume: 100 })
        )
      })

      it('should NOT trigger #LurchEasy at exactly 23 degrees (> not >=)', () => {
        checkCapsize(mockBoat, 23)
        
        expect(mockBoat.game.mulle.say).not.toHaveBeenCalled()
      })

      it('should handle negative angles with absolute value', () => {
        // BoatBase.ls: abs(tmpSideAngle)
        checkCapsize(mockBoat, -28)
        
        expect(mockBoat.game.mulle.say).toHaveBeenCalledWith(
          expect.objectContaining({ type: 'LurchHard' }),
          expect.anything()
        )
      })
    })

    describe('safe angle range', () => {
      it('should not trigger any warnings at angle <= 23', () => {
        const result = checkCapsize(mockBoat, 20)
        
        expect(result).toBe(false)
        expect(mockBoat.enabled).toBe(true)
        expect(mockBoat.game.mulle.say).not.toHaveBeenCalled()
        expect(mockBoat.waitToGoHome).not.toHaveBeenCalled()
      })

      it('should not trigger any warnings at angle = 0', () => {
        const result = checkCapsize(mockBoat, 0)
        
        expect(result).toBe(false)
        expect(mockBoat.game.mulle.say).not.toHaveBeenCalled()
      })
    })
  })
})

/**
 * NOTE: The following functions do NOT exist in BoatBase.ls and should NOT be tested:
 * - repair() - no repair mechanism in the driving code
 * - isDamaged() - no such helper function
 * - isCriticallyDamaged() - no such helper function  
 * - handleBoatBreak() - the .ls just calls say() and waitToGoHome() inline
 * - handleLowDurability() - no low durability warning in .ls
 * - getDurabilityPercentage() - no such helper function
 * 
 * These were invented functions that don't match the Lingo source.
 */
