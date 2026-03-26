/**
 * @fileoverview Tests for SurferData - Surfer scene result logic (scene 71)
 * Based on: decompiled Lingo startMovie handler for scene 71
 *
 * The original Lingo checks boat #power >= 200 (greater-than-or-equal).
 * On success, mission 14 is ALWAYS completed and a random part is given
 * if one is available (silent fail on #NoPart).
 *
 * Power thresholds (>= from Lingo):
 *   < 200  → "cantDoIt"  (no mission, no part)
 *   >= 200 → "JustDoit"  (mission 14, part if available)
 *
 * Note the marker casing: "JustDoit" (success) vs "cantDoIt" (failure).
 */

const { computeSurferResult, MISSION_ID, POWER_THRESHOLD } = require('../SurferData')

describe('SurferData', () => {
  // ===========================================================================
  // Constants
  // ===========================================================================

  describe('constants', () => {
    test('MISSION_ID should be 14', () => {
      expect(MISSION_ID).toBe(14)
    })

    test('POWER_THRESHOLD should be 200', () => {
      expect(POWER_THRESHOLD).toBe(200)
    })
  })

  // ===========================================================================
  // Failure path — power < 200 → "cantDoIt"
  // ===========================================================================

  describe('failure path (power < 200)', () => {
    test('power 0 → marker "cantDoIt"', () => {
      const result = computeSurferResult({ power: 0, randomPart: 'Sail' })
      expect(result.marker).toBe('cantDoIt')
    })

    test('power 199 → marker "cantDoIt" (boundary, NOT >= 200)', () => {
      const result = computeSurferResult({ power: 199, randomPart: 'Sail' })
      expect(result.marker).toBe('cantDoIt')
    })

    test('power 199 → mission 14 NOT completed', () => {
      const result = computeSurferResult({ power: 199, randomPart: 'Sail' })
      expect(result.actions.completeMission14).toBe(false)
    })

    test('power 199 → no part given even if available', () => {
      const result = computeSurferResult({ power: 199, randomPart: 'Sail' })
      expect(result.actions.givePart).toBeNull()
    })

    test('power 100 → no actions at all', () => {
      const result = computeSurferResult({ power: 100, randomPart: 'Motor' })
      expect(result.actions.completeMission14).toBe(false)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // ===========================================================================
  // Success path — power >= 200 → "JustDoit"
  // ===========================================================================

  describe('success path (power >= 200)', () => {
    test('power 200 → marker "JustDoit" (boundary, >= 200)', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'Sail' })
      expect(result.marker).toBe('JustDoit')
    })

    test('power 201 → marker "JustDoit"', () => {
      const result = computeSurferResult({ power: 201, randomPart: 'Sail' })
      expect(result.marker).toBe('JustDoit')
    })

    test('power 500 → marker "JustDoit"', () => {
      const result = computeSurferResult({ power: 500, randomPart: 'Sail' })
      expect(result.marker).toBe('JustDoit')
    })

    test('power 200 → mission 14 completed', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'Sail' })
      expect(result.actions.completeMission14).toBe(true)
    })

    test('power 201 → mission 14 completed', () => {
      const result = computeSurferResult({ power: 201, randomPart: 'Sail' })
      expect(result.actions.completeMission14).toBe(true)
    })

    test('power 200 → part given when available', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'Sail' })
      expect(result.actions.givePart).toBe('Sail')
    })
  })

  // ===========================================================================
  // NoPart case — mission still completed, no part given
  // ===========================================================================

  describe('NoPart case (power >= 200, no part available)', () => {
    test('NoPart → marker still "JustDoit"', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'NoPart' })
      expect(result.marker).toBe('JustDoit')
    })

    test('NoPart → mission 14 still completed', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'NoPart' })
      expect(result.actions.completeMission14).toBe(true)
    })

    test('NoPart → givePart is null (silent fail)', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'NoPart' })
      expect(result.actions.givePart).toBeNull()
    })

    test('null randomPart → givePart is null', () => {
      const result = computeSurferResult({ power: 300, randomPart: null })
      expect(result.actions.givePart).toBeNull()
    })

    test('null randomPart → mission 14 still completed', () => {
      const result = computeSurferResult({ power: 300, randomPart: null })
      expect(result.actions.completeMission14).toBe(true)
    })
  })

  // ===========================================================================
  // Marker casing — critical to match Lingo exactly
  // ===========================================================================

  describe('marker casing (must match Lingo exactly)', () => {
    test('success marker is "JustDoit" (capital J, capital D)', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'Sail' })
      expect(result.marker).toBe('JustDoit')
      expect(result.marker).not.toBe('justDoit')
      expect(result.marker).not.toBe('JustDoIt')
      expect(result.marker).not.toBe('JUSTDOIT')
    })

    test('failure marker is "cantDoIt" (lowercase c, capital D, capital I)', () => {
      const result = computeSurferResult({ power: 199, randomPart: 'Sail' })
      expect(result.marker).toBe('cantDoIt')
      expect(result.marker).not.toBe('CantDoIt')
      expect(result.marker).not.toBe('cantdoit')
      expect(result.marker).not.toBe('CANTDOIT')
    })
  })

  // ===========================================================================
  // Power boundary values (complete table)
  // ===========================================================================

  describe('power boundary values (complete table)', () => {
    test.each([
      [199, 'Sail', 'cantDoIt', false, null],
      [200, 'Sail', 'JustDoit', true, 'Sail'],
      [201, 'Sail', 'JustDoit', true, 'Sail'],
      [200, 'NoPart', 'JustDoit', true, null],
      [201, 'NoPart', 'JustDoit', true, null],
      [199, 'NoPart', 'cantDoIt', false, null],
      [0, 'Motor', 'cantDoIt', false, null],
      [500, 'Motor', 'JustDoit', true, 'Motor']
    ])(
      'power %d, part "%s" → marker "%s", M14=%s, givePart=%s',
      (power, randomPart, expectedMarker, expectedM14, expectedPart) => {
        const result = computeSurferResult({ power, randomPart })
        expect(result.marker).toBe(expectedMarker)
        expect(result.actions.completeMission14).toBe(expectedM14)
        expect(result.actions.givePart).toBe(expectedPart)
      }
    )
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return an object with marker and actions', () => {
      const result = computeSurferResult({ power: 200, randomPart: 'Sail' })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(result.actions).toHaveProperty('completeMission14')
      expect(result.actions).toHaveProperty('givePart')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.actions.completeMission14).toBe('boolean')
    })
  })
})
