/**
 * @fileoverview Tests for DivingData - Diving scene logic (scene 70)
 * Based on: decompiled_lingo/70/70 startMovie
 *
 * The original Lingo requires BOTH #helmet AND #Suit in inventory to dive.
 * The nested-if structure means:
 *   - No helmet              → "cantDoit" (never checks suit)
 *   - Helmet but no suit     → "cantDoit"
 *   - Helmet AND suit        → "JustDoit", complete M15, give random part
 *
 * When the random part is #NoPart (null), the success path still runs but
 * no part is awarded (silent fail, just "shit out Of luck" in Lingo).
 *
 * Mission 15 is completed ONLY on the success path.
 */

const { computeDivingResult, MISSION_ID } = require('../DivingData')

describe('DivingData', () => {
  // ===========================================================================
  // MISSION_ID constant
  // ===========================================================================

  describe('MISSION_ID', () => {
    test('should be 15', () => {
      expect(MISSION_ID).toBe(15)
    })
  })

  // ===========================================================================
  // No helmet → "cantDoit" (helmet check fails, suit never evaluated)
  // ===========================================================================

  describe('no helmet (cantDoit)', () => {
    test('no helmet, no suit → cantDoit', () => {
      const result = computeDivingResult({ hasHelmet: false, hasSuit: false, randomPart: 42 })
      expect(result.marker).toBe('cantDoit')
    })

    test('no helmet, has suit → cantDoit (helmet gate comes first)', () => {
      const result = computeDivingResult({ hasHelmet: false, hasSuit: true, randomPart: 42 })
      expect(result.marker).toBe('cantDoit')
    })

    test('no helmet → mission 15 NOT completed', () => {
      const result = computeDivingResult({ hasHelmet: false, hasSuit: false, randomPart: 42 })
      expect(result.actions.completeMission15).toBe(false)
    })

    test('no helmet → no part given', () => {
      const result = computeDivingResult({ hasHelmet: false, hasSuit: true, randomPart: 42 })
      expect(result.actions.givePart).toBeNull()
    })
  })

  // ===========================================================================
  // Has helmet, no suit → "cantDoit"
  // ===========================================================================

  describe('helmet but no suit (cantDoit)', () => {
    test('has helmet, no suit → cantDoit', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: false, randomPart: 42 })
      expect(result.marker).toBe('cantDoit')
    })

    test('helmet but no suit → mission 15 NOT completed', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: false, randomPart: 42 })
      expect(result.actions.completeMission15).toBe(false)
    })

    test('helmet but no suit → no part given', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: false, randomPart: 42 })
      expect(result.actions.givePart).toBeNull()
    })
  })

  // ===========================================================================
  // Has BOTH helmet and suit → "JustDoit" (success path)
  // ===========================================================================

  describe('helmet AND suit (JustDoit)', () => {
    test('both items → JustDoit', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 42 })
      expect(result.marker).toBe('JustDoit')
    })

    test('both items → mission 15 completed', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 42 })
      expect(result.actions.completeMission15).toBe(true)
    })

    test('both items with part 42 → givePart is 42', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 42 })
      expect(result.actions.givePart).toBe(42)
    })

    test('both items with part 1 → givePart is 1', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 1 })
      expect(result.actions.givePart).toBe(1)
    })

    test('both items with part 999 → givePart is 999', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 999 })
      expect(result.actions.givePart).toBe(999)
    })
  })

  // ===========================================================================
  // #NoPart case — success path but no part available
  // ===========================================================================

  describe('NoPart (randomPart = null)', () => {
    test('both items, NoPart → still JustDoit', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: null })
      expect(result.marker).toBe('JustDoit')
    })

    test('both items, NoPart → mission 15 still completed', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: null })
      expect(result.actions.completeMission15).toBe(true)
    })

    test('both items, NoPart → givePart is null (silent fail)', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: null })
      expect(result.actions.givePart).toBeNull()
    })
  })

  // ===========================================================================
  // All 4 helmet/suit combinations (truth table)
  // ===========================================================================

  describe('all helmet/suit combinations', () => {
    test.each([
      [false, false, 'cantDoit'],
      [false, true, 'cantDoit'],
      [true, false, 'cantDoit'],
      [true, true, 'JustDoit']
    ])(
      'helmet=%s, suit=%s → marker "%s"',
      (hasHelmet, hasSuit, expectedMarker) => {
        const result = computeDivingResult({ hasHelmet, hasSuit, randomPart: 42 })
        expect(result.marker).toBe(expectedMarker)
      }
    )
  })

  // ===========================================================================
  // Actions are only triggered on the success path
  // ===========================================================================

  describe('actions gating', () => {
    test('completeMission15 is true ONLY when both items present', () => {
      const combos = [
        { hasHelmet: false, hasSuit: false },
        { hasHelmet: false, hasSuit: true },
        { hasHelmet: true, hasSuit: false }
      ]
      for (const combo of combos) {
        const result = computeDivingResult({ ...combo, randomPart: 42 })
        expect(result.actions.completeMission15).toBe(false)
      }
      const success = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 42 })
      expect(success.actions.completeMission15).toBe(true)
    })

    test('givePart is null for all failure paths regardless of randomPart', () => {
      const combos = [
        { hasHelmet: false, hasSuit: false },
        { hasHelmet: false, hasSuit: true },
        { hasHelmet: true, hasSuit: false }
      ]
      for (const combo of combos) {
        const result = computeDivingResult({ ...combo, randomPart: 42 })
        expect(result.actions.givePart).toBeNull()
      }
    })
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return object with marker and actions', () => {
      const result = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 42 })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(result.actions).toHaveProperty('completeMission15')
      expect(result.actions).toHaveProperty('givePart')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.actions.completeMission15).toBe('boolean')
    })

    test('givePart is number when part available, null when NoPart', () => {
      const withPart = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: 42 })
      expect(typeof withPart.actions.givePart).toBe('number')

      const noPart = computeDivingResult({ hasHelmet: true, hasSuit: true, randomPart: null })
      expect(noPart.actions.givePart).toBeNull()
    })
  })
})
