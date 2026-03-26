/**
 * @fileoverview Tests for VickyIslandData - VickyIsland scene logic (scene 87)
 * Based on: decompiled Lingo startMovie handler for scene 87
 *
 * Lingo logic summary:
 *   - M23 is ALWAYS completed (unconditional)
 *   - Needs BOTH helmet AND suit for success ("JustDoit")
 *   - On success: complete M12, give part 979 (or random if 979 owned), medal 5
 *   - Without both items: "cantDoit"
 *   - goTo: first visit → "start", second+ visit → myMarker
 */

const {
  computeVickyIslandResult,
  MISSION_23,
  MISSION_12,
  PART_979,
  MEDAL_5
} = require('../VickyIslandData')

// ---------------------------------------------------------------------------
// Helper: build state with defaults
// ---------------------------------------------------------------------------
function makeState (overrides = {}) {
  return {
    hasHelmet: false,
    hasSuit: false,
    hasPart979: false,
    randomPart: 42,
    completionCount23: 0,
    ...overrides
  }
}

describe('VickyIslandData', () => {
  // =========================================================================
  // Constants
  // =========================================================================

  describe('constants', () => {
    test('MISSION_23 is 23', () => {
      expect(MISSION_23).toBe(23)
    })

    test('MISSION_12 is 12', () => {
      expect(MISSION_12).toBe(12)
    })

    test('PART_979 is 979', () => {
      expect(PART_979).toBe(979)
    })

    test('MEDAL_5 is 5', () => {
      expect(MEDAL_5).toBe(5)
    })
  })

  // =========================================================================
  // M23 is ALWAYS completed (unconditional)
  // =========================================================================

  describe('mission 23 always completed', () => {
    test('completed when no helmet, no suit', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result.actions.completeMission23).toBe(true)
    })

    test('completed when helmet only', () => {
      const result = computeVickyIslandResult(makeState({ hasHelmet: true }))
      expect(result.actions.completeMission23).toBe(true)
    })

    test('completed when suit only', () => {
      const result = computeVickyIslandResult(makeState({ hasSuit: true }))
      expect(result.actions.completeMission23).toBe(true)
    })

    test('completed when both helmet and suit', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true })
      )
      expect(result.actions.completeMission23).toBe(true)
    })
  })

  // =========================================================================
  // Failure path: missing helmet or suit → "cantDoit"
  // =========================================================================

  describe('failure: missing items → "cantDoit"', () => {
    test('no helmet, no suit → marker "cantDoit"', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result.marker).toBe('cantDoit')
    })

    test('helmet only (no suit) → marker "cantDoit"', () => {
      const result = computeVickyIslandResult(makeState({ hasHelmet: true }))
      expect(result.marker).toBe('cantDoit')
    })

    test('suit only (no helmet) → marker "cantDoit"', () => {
      const result = computeVickyIslandResult(makeState({ hasSuit: true }))
      expect(result.marker).toBe('cantDoit')
    })

    test('no helmet, no suit → M12 NOT completed', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result.actions.completeMission12).toBe(false)
    })

    test('helmet only → M12 NOT completed', () => {
      const result = computeVickyIslandResult(makeState({ hasHelmet: true }))
      expect(result.actions.completeMission12).toBe(false)
    })

    test('suit only → M12 NOT completed', () => {
      const result = computeVickyIslandResult(makeState({ hasSuit: true }))
      expect(result.actions.completeMission12).toBe(false)
    })

    test('no helmet → no part given', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result.actions.givePart).toBeNull()
    })

    test('helmet only → no part given', () => {
      const result = computeVickyIslandResult(makeState({ hasHelmet: true }))
      expect(result.actions.givePart).toBeNull()
    })

    test('suit only → no part given', () => {
      const result = computeVickyIslandResult(makeState({ hasSuit: true }))
      expect(result.actions.givePart).toBeNull()
    })

    test('no helmet → no medal', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result.actions.awardMedal5).toBe(false)
    })

    test('helmet only → no medal', () => {
      const result = computeVickyIslandResult(makeState({ hasHelmet: true }))
      expect(result.actions.awardMedal5).toBe(false)
    })

    test('suit only → no medal', () => {
      const result = computeVickyIslandResult(makeState({ hasSuit: true }))
      expect(result.actions.awardMedal5).toBe(false)
    })
  })

  // =========================================================================
  // Success path: helmet + suit → "JustDoit"
  // =========================================================================

  describe('success: helmet + suit → "JustDoit"', () => {
    test('marker is "JustDoit"', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true })
      )
      expect(result.marker).toBe('JustDoit')
    })

    test('M12 is completed', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true })
      )
      expect(result.actions.completeMission12).toBe(true)
    })

    test('medal 5 is ALWAYS awarded on success', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true })
      )
      expect(result.actions.awardMedal5).toBe(true)
    })
  })

  // =========================================================================
  // Part logic: 979 if not owned, random part if already owned
  // =========================================================================

  describe('part giving logic', () => {
    test('gives part 979 when player does not have it', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true, hasPart979: false })
      )
      expect(result.actions.givePart).toBe(979)
    })

    test('gives random part when player already has 979', () => {
      const result = computeVickyIslandResult(
        makeState({
          hasHelmet: true,
          hasSuit: true,
          hasPart979: true,
          randomPart: 555
        })
      )
      expect(result.actions.givePart).toBe(555)
    })

    test('random part can be any number', () => {
      const result = computeVickyIslandResult(
        makeState({
          hasHelmet: true,
          hasSuit: true,
          hasPart979: true,
          randomPart: 1001
        })
      )
      expect(result.actions.givePart).toBe(1001)
    })

    test('no part given on failure (missing suit)', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: false })
      )
      expect(result.actions.givePart).toBeNull()
    })
  })

  // =========================================================================
  // goTo routing: first visit → "start", second+ → myMarker
  // =========================================================================

  describe('goTo routing (completionCount23 boundary)', () => {
    test('first visit (count before = 0): after increment count=1 < 2 → "start"', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true, completionCount23: 0 })
      )
      expect(result.goTo).toBe('start')
    })

    test('second visit (count before = 1): after increment count=2 >= 2 → myMarker', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true, completionCount23: 1 })
      )
      expect(result.goTo).toBe('JustDoit')
    })

    test('third visit (count before = 2): after increment count=3 >= 2 → myMarker', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true, completionCount23: 2 })
      )
      expect(result.goTo).toBe('JustDoit')
    })

    test('first visit failure → "start" (not "cantDoit")', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: false, completionCount23: 0 })
      )
      expect(result.goTo).toBe('start')
    })

    test('second visit failure → "cantDoit"', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: false, completionCount23: 1 })
      )
      expect(result.goTo).toBe('cantDoit')
    })

    test('second visit with helmet only → "cantDoit"', () => {
      const result = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: false, completionCount23: 1 })
      )
      expect(result.goTo).toBe('cantDoit')
    })

    test('second visit with suit only → "cantDoit"', () => {
      const result = computeVickyIslandResult(
        makeState({ hasSuit: true, hasHelmet: false, completionCount23: 1 })
      )
      expect(result.goTo).toBe('cantDoit')
    })

    test('exact boundary: count before = 0 → go("start") regardless of marker', () => {
      // Success path but first visit
      const success = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true, completionCount23: 0 })
      )
      expect(success.marker).toBe('JustDoit')
      expect(success.goTo).toBe('start')

      // Failure path, first visit
      const failure = computeVickyIslandResult(
        makeState({ hasHelmet: false, completionCount23: 0 })
      )
      expect(failure.marker).toBe('cantDoit')
      expect(failure.goTo).toBe('start')
    })

    test('exact boundary: count before = 1 → go(myMarker)', () => {
      const success = computeVickyIslandResult(
        makeState({ hasHelmet: true, hasSuit: true, completionCount23: 1 })
      )
      expect(success.goTo).toBe('JustDoit')

      const failure = computeVickyIslandResult(
        makeState({ hasHelmet: false, completionCount23: 1 })
      )
      expect(failure.goTo).toBe('cantDoit')
    })
  })

  // =========================================================================
  // Complete scenario table
  // =========================================================================

  describe('complete scenario table', () => {
    test.each([
      // [hasHelmet, hasSuit, hasPart979, randomPart, count23, expectedMarker, expectedGoTo, expectedM12, expectedPart, expectedMedal]
      [false, false, false, 42, 0, 'cantDoit', 'start', false, null, false],
      [true, false, false, 42, 0, 'cantDoit', 'start', false, null, false],
      [false, true, false, 42, 0, 'cantDoit', 'start', false, null, false],
      [true, true, false, 42, 0, 'JustDoit', 'start', true, 979, true],
      [true, true, true, 42, 0, 'JustDoit', 'start', true, 42, true],
      [false, false, false, 42, 1, 'cantDoit', 'cantDoit', false, null, false],
      [true, false, false, 42, 1, 'cantDoit', 'cantDoit', false, null, false],
      [false, true, false, 42, 1, 'cantDoit', 'cantDoit', false, null, false],
      [true, true, false, 42, 1, 'JustDoit', 'JustDoit', true, 979, true],
      [true, true, true, 42, 1, 'JustDoit', 'JustDoit', true, 42, true],
      [true, true, true, 777, 5, 'JustDoit', 'JustDoit', true, 777, true]
    ])(
      'helmet=%s suit=%s has979=%s rnd=%d count23=%d → marker=%s goTo=%s M12=%s part=%s medal=%s',
      (
        hasHelmet, hasSuit, hasPart979, randomPart, completionCount23,
        expectedMarker, expectedGoTo, expectedM12, expectedPart, expectedMedal
      ) => {
        const result = computeVickyIslandResult({
          hasHelmet,
          hasSuit,
          hasPart979,
          randomPart,
          completionCount23
        })
        expect(result.marker).toBe(expectedMarker)
        expect(result.goTo).toBe(expectedGoTo)
        expect(result.actions.completeMission12).toBe(expectedM12)
        expect(result.actions.givePart).toBe(expectedPart)
        expect(result.actions.awardMedal5).toBe(expectedMedal)
        // M23 always completed
        expect(result.actions.completeMission23).toBe(true)
      }
    )
  })

  // =========================================================================
  // Return value shape
  // =========================================================================

  describe('return value shape', () => {
    test('should return object with marker, goTo, and actions', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('goTo')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.goTo).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('actions should have all expected properties', () => {
      const result = computeVickyIslandResult(makeState())
      expect(result.actions).toHaveProperty('completeMission23')
      expect(result.actions).toHaveProperty('completeMission12')
      expect(result.actions).toHaveProperty('givePart')
      expect(result.actions).toHaveProperty('awardMedal5')
    })
  })
})
