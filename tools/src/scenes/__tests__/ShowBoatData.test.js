/**
 * @fileoverview Tests for ShowBoatData - ShowBoat scene result logic (scene 76)
 * Based on: decompiled_lingo/76/76/casts/Internal/ParentScript 4 - Dir.ls
 *
 * The original Lingo uses nested if-statements with strict > comparisons
 * to determine the marker (animation level) and whether medal 4 is awarded.
 *
 * FunnyFactor thresholds (strict greater-than, from Lingo):
 *   <= 4   → "one"   (rating 1, no medal)
 *   > 4    → "two"   (rating 2, no medal)
 *   > 10   → "three" (rating 3, no medal)
 *   > 20   → "four"  (rating 4, no medal)
 *   > 25   → "five"  (rating 5, medal 4)
 *
 * Mission 6 is ALWAYS completed when visiting this scene (no conditions).
 */

const { computeShowBoatResult, MISSION_ID } = require('../ShowBoatData')

describe('ShowBoatData', () => {
  // ===========================================================================
  // MISSION_ID constant
  // ===========================================================================

  describe('MISSION_ID', () => {
    test('should be 6', () => {
      expect(MISSION_ID).toBe(6)
    })

    test('mission 6 is always completed (no conditions in Lingo)', () => {
      // The Lingo calls addCompletedMission(user, 6) unconditionally
      // after the if/else block. This test documents that the mission
      // completion is not gated by any FunnyFactor threshold.
      expect(MISSION_ID).toBe(6)
    })
  })

  // ===========================================================================
  // Marker: "one" — FunnyFactor <= 4
  // ===========================================================================

  describe('marker "one" (FunnyFactor <= 4)', () => {
    test.each([0, 3, 4])('funnyFactor %d → marker "one"', (ff) => {
      const result = computeShowBoatResult(ff)
      expect(result.marker).toBe('one')
    })

    test('funnyFactor 0 → rating 1', () => {
      expect(computeShowBoatResult(0).rating).toBe(1)
    })

    test('funnyFactor 4 → rating 1 (boundary, NOT > 4)', () => {
      expect(computeShowBoatResult(4).rating).toBe(1)
    })

    test('funnyFactor 4 → no medal', () => {
      expect(computeShowBoatResult(4).medal).toBeNull()
    })
  })

  // ===========================================================================
  // Marker: "two" — FunnyFactor > 4 and <= 10
  // ===========================================================================

  describe('marker "two" (FunnyFactor > 4 and <= 10)', () => {
    test.each([5, 10])('funnyFactor %d → marker "two"', (ff) => {
      const result = computeShowBoatResult(ff)
      expect(result.marker).toBe('two')
    })

    test('funnyFactor 5 → rating 2', () => {
      expect(computeShowBoatResult(5).rating).toBe(2)
    })

    test('funnyFactor 10 → rating 2 (boundary, NOT > 10)', () => {
      expect(computeShowBoatResult(10).rating).toBe(2)
    })

    test('funnyFactor 5 → no medal', () => {
      expect(computeShowBoatResult(5).medal).toBeNull()
    })

    test('funnyFactor 10 → no medal', () => {
      expect(computeShowBoatResult(10).medal).toBeNull()
    })
  })

  // ===========================================================================
  // Marker: "three" — FunnyFactor > 10 and <= 20
  // ===========================================================================

  describe('marker "three" (FunnyFactor > 10 and <= 20)', () => {
    test.each([11, 20])('funnyFactor %d → marker "three"', (ff) => {
      const result = computeShowBoatResult(ff)
      expect(result.marker).toBe('three')
    })

    test('funnyFactor 11 → rating 3', () => {
      expect(computeShowBoatResult(11).rating).toBe(3)
    })

    test('funnyFactor 20 → rating 3 (boundary, NOT > 20)', () => {
      expect(computeShowBoatResult(20).rating).toBe(3)
    })

    test('funnyFactor 11 → no medal', () => {
      expect(computeShowBoatResult(11).medal).toBeNull()
    })
  })

  // ===========================================================================
  // Marker: "four" — FunnyFactor > 20 and <= 25
  // ===========================================================================

  describe('marker "four" (FunnyFactor > 20 and <= 25)', () => {
    test.each([21, 25])('funnyFactor %d → marker "four"', (ff) => {
      const result = computeShowBoatResult(ff)
      expect(result.marker).toBe('four')
    })

    test('funnyFactor 21 → rating 4', () => {
      expect(computeShowBoatResult(21).rating).toBe(4)
    })

    test('funnyFactor 25 → rating 4 (boundary, NOT > 25)', () => {
      expect(computeShowBoatResult(25).rating).toBe(4)
    })

    test('funnyFactor 21 → no medal', () => {
      expect(computeShowBoatResult(21).medal).toBeNull()
    })

    test('funnyFactor 25 → no medal (boundary, NOT > 25)', () => {
      expect(computeShowBoatResult(25).medal).toBeNull()
    })
  })

  // ===========================================================================
  // Marker: "five" — FunnyFactor > 25 (medal 4 awarded)
  // ===========================================================================

  describe('marker "five" (FunnyFactor > 25, medal 4)', () => {
    test.each([26, 30, 100])('funnyFactor %d → marker "five"', (ff) => {
      const result = computeShowBoatResult(ff)
      expect(result.marker).toBe('five')
    })

    test('funnyFactor 26 → rating 5', () => {
      expect(computeShowBoatResult(26).rating).toBe(5)
    })

    test('funnyFactor 100 → rating 5', () => {
      expect(computeShowBoatResult(100).rating).toBe(5)
    })

    test('funnyFactor 26 → medal 4', () => {
      expect(computeShowBoatResult(26).medal).toBe(4)
    })

    test('funnyFactor 30 → medal 4', () => {
      expect(computeShowBoatResult(30).medal).toBe(4)
    })

    test('funnyFactor 100 → medal 4', () => {
      expect(computeShowBoatResult(100).medal).toBe(4)
    })
  })

  // ===========================================================================
  // Boundary value summary (all requested values in one table)
  // ===========================================================================

  describe('boundary values (complete table)', () => {
    test.each([
      [0, 'one', 1, null],
      [3, 'one', 1, null],
      [4, 'one', 1, null],
      [5, 'two', 2, null],
      [10, 'two', 2, null],
      [11, 'three', 3, null],
      [20, 'three', 3, null],
      [21, 'four', 4, null],
      [25, 'four', 4, null],
      [26, 'five', 5, 4],
      [30, 'five', 5, 4],
      [100, 'five', 5, 4]
    ])(
      'funnyFactor %d → marker "%s", rating %d, medal %s',
      (ff, expectedMarker, expectedRating, expectedMedal) => {
        const result = computeShowBoatResult(ff)
        expect(result.marker).toBe(expectedMarker)
        expect(result.rating).toBe(expectedRating)
        expect(result.medal).toBe(expectedMedal)
      }
    )
  })

  // ===========================================================================
  // Medal is ONLY awarded at FunnyFactor > 25
  // ===========================================================================

  describe('medal logic', () => {
    test('medal is null for all FunnyFactor values <= 25', () => {
      for (const ff of [0, 1, 4, 5, 10, 11, 20, 21, 25]) {
        expect(computeShowBoatResult(ff).medal).toBeNull()
      }
    })

    test('medal is 4 for all FunnyFactor values > 25', () => {
      for (const ff of [26, 27, 30, 50, 100]) {
        expect(computeShowBoatResult(ff).medal).toBe(4)
      }
    })
  })

  // ===========================================================================
  // Return shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return an object with marker, rating, and medal', () => {
      const result = computeShowBoatResult(10)
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('rating')
      expect(result).toHaveProperty('medal')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.rating).toBe('number')
    })
  })
})
