/**
 * @fileoverview Tests for GeorgeData - George/Erson scene logic (scene 80)
 * Based on: decompiled Lingo startMovie for scene 80
 *
 * The original Lingo uses sequential if-blocks where each block can OVERWRITE
 * the marker set by a previous block (cascading overwrites). The last block
 * to execute wins the marker.
 *
 * Execution order:
 *   Block A: M19 completed        → "story"  (lowercase s!)
 *   Block B: M7 given             → "CantDoiT", or "JustDoitDiary" if has Diary
 *   Block C: M19 given            → "Story" if has MapPiece2, else "JustDoitMap"
 *   Block D: M18 NOT completed    → "nomission" (OVERRIDES everything before it!)
 *   Block E: marker still VOID    → "Story"
 *
 * CRITICAL: Casing matters! "story" !== "Story"
 */

const { computeGeorgeResult } = require('../GeorgeData')

// Default state: everything completed/given is false, no items
const DEFAULT_STATE = {
  isMission19Completed: false,
  isMission7Given: false,
  hasDiary: false,
  isMission19Given: false,
  hasMapPiece2: false,
  isMission18Completed: false
}

/**
 * Helper to create state with overrides
 */
function state (overrides) {
  return { ...DEFAULT_STATE, ...overrides }
}

describe('GeorgeData', () => {
  // ===========================================================================
  // Block D: M18 NOT completed → "nomission" (OVERRIDES EVERYTHING)
  // ===========================================================================

  describe('Block D: M18 not completed overrides everything', () => {
    test('fresh state (nothing completed/given) → "nomission"', () => {
      const result = computeGeorgeResult(DEFAULT_STATE)
      expect(result.marker).toBe('nomission')
      expect(result.goTo).toBe('nomission')
    })

    test('M18 not completed → completeMission18 + giveMission7 actions', () => {
      const result = computeGeorgeResult(DEFAULT_STATE)
      expect(result.actions.completeMission18).toBe(true)
      expect(result.actions.giveMission7).toBe(true)
    })

    test('M18 not completed overrides M19 completed ("story")', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission18Completed: false
      }))
      expect(result.marker).toBe('nomission')
    })

    test('M18 not completed overrides M7 given ("CantDoiT")', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        isMission18Completed: false
      }))
      expect(result.marker).toBe('nomission')
    })

    test('M18 not completed overrides M7 diary delivery ("JustDoitDiary")', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: true,
        isMission18Completed: false
      }))
      expect(result.marker).toBe('nomission')
      // But diary actions still fire (cascading side effects)
      expect(result.actions.deleteDiary).toBe(true)
      expect(result.actions.completeMission7).toBe(true)
    })

    test('M18 not completed overrides M19 map delivery ("JustDoitMap")', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: false
      }))
      expect(result.marker).toBe('nomission')
      // But map actions still fire (cascading side effects)
      expect(result.actions.giveMapPiece2).toBe(true)
      expect(result.actions.completeMission19).toBe(true)
    })

    test('M18 not completed overrides M19 given + has MapPiece2 ("Story")', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: true,
        isMission18Completed: false
      }))
      expect(result.marker).toBe('nomission')
    })

    test('M18 not completed overrides ALL blocks combined', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission7Given: true,
        hasDiary: true,
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: false
      }))
      expect(result.marker).toBe('nomission')
      // All earlier side effects still accumulated
      expect(result.actions.deleteDiary).toBe(true)
      expect(result.actions.completeMission7).toBe(true)
      expect(result.actions.giveMapPiece2).toBe(true)
      expect(result.actions.completeMission19).toBe(true)
      expect(result.actions.completeMission18).toBe(true)
      expect(result.actions.giveMission7).toBe(true)
    })
  })

  // ===========================================================================
  // Block A: M19 completed → "story" (lowercase s)
  // ===========================================================================

  describe('Block A: M19 completed → "story"', () => {
    test('M19 completed, M18 completed, nothing else → "story" (lowercase)', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission18Completed: true
      }))
      expect(result.marker).toBe('story')
      expect(result.goTo).toBe('story')
    })

    test('"story" has lowercase s (not "Story")', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission18Completed: true
      }))
      expect(result.marker).not.toBe('Story')
      expect(result.marker).toBe('story')
    })
  })

  // ===========================================================================
  // Block B: M7 given → "CantDoiT" or "JustDoitDiary"
  // ===========================================================================

  describe('Block B: M7 given', () => {
    test('M7 given, no Diary → "CantDoiT"', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: false,
        isMission18Completed: true
      }))
      expect(result.marker).toBe('CantDoiT')
      expect(result.goTo).toBe('CantDoiT')
    })

    test('"CantDoiT" exact casing', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: false,
        isMission18Completed: true
      }))
      expect(result.marker).toBe('CantDoiT')
    })

    test('M7 given + has Diary → "JustDoitDiary"', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: true,
        isMission18Completed: true
      }))
      expect(result.marker).toBe('JustDoitDiary')
      expect(result.goTo).toBe('JustDoitDiary')
    })

    test('M7 given + has Diary → deleteDiary + completeMission7 actions', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: true,
        isMission18Completed: true
      }))
      expect(result.actions.deleteDiary).toBe(true)
      expect(result.actions.completeMission7).toBe(true)
    })

    test('M7 given, no Diary → no diary/mission7 actions', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: false,
        isMission18Completed: true
      }))
      expect(result.actions.deleteDiary).toBe(false)
      expect(result.actions.completeMission7).toBe(false)
    })

    test('M7 given overwrites M19 completed marker', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission7Given: true,
        hasDiary: false,
        isMission18Completed: true
      }))
      // Block B runs after Block A, overwrites "story" with "CantDoiT"
      expect(result.marker).toBe('CantDoiT')
    })
  })

  // ===========================================================================
  // Block C: M19 given
  // ===========================================================================

  describe('Block C: M19 given', () => {
    test('M19 given + has MapPiece2 → "Story" (capital S)', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: true,
        isMission18Completed: true
      }))
      expect(result.marker).toBe('Story')
      expect(result.goTo).toBe('Story')
    })

    test('"Story" has capital S (not "story")', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: true,
        isMission18Completed: true
      }))
      expect(result.marker).not.toBe('story')
      expect(result.marker).toBe('Story')
    })

    test('M19 given + no MapPiece2 → "JustDoitMap"', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: true
      }))
      expect(result.marker).toBe('JustDoitMap')
      expect(result.goTo).toBe('JustDoitMap')
    })

    test('M19 given + no MapPiece2 → giveMapPiece2 + completeMission19 actions', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: true
      }))
      expect(result.actions.giveMapPiece2).toBe(true)
      expect(result.actions.completeMission19).toBe(true)
    })

    test('M19 given + has MapPiece2 → no map/mission19 actions', () => {
      const result = computeGeorgeResult(state({
        isMission19Given: true,
        hasMapPiece2: true,
        isMission18Completed: true
      }))
      expect(result.actions.giveMapPiece2).toBe(false)
      expect(result.actions.completeMission19).toBe(false)
    })

    test('M19 given overwrites M7 given marker', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: false,
        isMission19Given: true,
        hasMapPiece2: true,
        isMission18Completed: true
      }))
      // Block C runs after Block B, overwrites "CantDoiT" with "Story"
      expect(result.marker).toBe('Story')
    })
  })

  // ===========================================================================
  // Block E: VOID fallback → "Story"
  // ===========================================================================

  describe('Block E: VOID fallback → "Story"', () => {
    test('no blocks triggered (M18 completed, nothing else) → "Story"', () => {
      const result = computeGeorgeResult(state({
        isMission18Completed: true
      }))
      expect(result.marker).toBe('Story')
      expect(result.goTo).toBe('Story')
    })

    test('fallback "Story" has capital S', () => {
      const result = computeGeorgeResult(state({
        isMission18Completed: true
      }))
      expect(result.marker).toBe('Story')
      expect(result.marker).not.toBe('story')
    })
  })

  // ===========================================================================
  // Cascading overwrite scenarios
  // ===========================================================================

  describe('cascading overwrite scenarios', () => {
    test('Block A set, then Block B overwrites: M19 completed + M7 given', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission7Given: true,
        hasDiary: true,
        isMission18Completed: true
      }))
      // Block A: "story" → Block B: "JustDoitDiary"
      expect(result.marker).toBe('JustDoitDiary')
    })

    test('Block B + Block C: M7 diary + M19 map delivery', () => {
      const result = computeGeorgeResult(state({
        isMission7Given: true,
        hasDiary: true,
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: true
      }))
      // Block B: "JustDoitDiary" → Block C: "JustDoitMap"
      expect(result.marker).toBe('JustDoitMap')
      // Both sets of actions fire
      expect(result.actions.deleteDiary).toBe(true)
      expect(result.actions.completeMission7).toBe(true)
      expect(result.actions.giveMapPiece2).toBe(true)
      expect(result.actions.completeMission19).toBe(true)
    })

    test('All blocks: A + B + C + D all trigger, D wins marker', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission7Given: true,
        hasDiary: true,
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: false
      }))
      // Block D overwrites everything → "nomission"
      expect(result.marker).toBe('nomission')
    })

    test('Block A + Block C (M19 completed + M19 given + has map)', () => {
      const result = computeGeorgeResult(state({
        isMission19Completed: true,
        isMission19Given: true,
        hasMapPiece2: true,
        isMission18Completed: true
      }))
      // Block A: "story" → Block C: "Story" (capital S overwrites lowercase)
      expect(result.marker).toBe('Story')
    })
  })

  // ===========================================================================
  // Exact casing verification
  // ===========================================================================

  describe('exact casing of all markers', () => {
    test.each([
      [
        'story (lowercase)',
        { isMission19Completed: true, isMission18Completed: true },
        'story'
      ],
      [
        'CantDoiT',
        { isMission7Given: true, isMission18Completed: true },
        'CantDoiT'
      ],
      [
        'JustDoitDiary',
        { isMission7Given: true, hasDiary: true, isMission18Completed: true },
        'JustDoitDiary'
      ],
      [
        'Story (capital S, from M19 given + has map)',
        { isMission19Given: true, hasMapPiece2: true, isMission18Completed: true },
        'Story'
      ],
      [
        'JustDoitMap',
        { isMission19Given: true, hasMapPiece2: false, isMission18Completed: true },
        'JustDoitMap'
      ],
      [
        'nomission',
        { isMission18Completed: false },
        'nomission'
      ],
      [
        'Story (capital S, VOID fallback)',
        { isMission18Completed: true },
        'Story'
      ]
    ])('%s → marker is exactly "%s"', (_label, overrides, expected) => {
      const result = computeGeorgeResult(state(overrides))
      expect(result.marker).toBe(expected)
    })
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return marker, goTo, and actions object', () => {
      const result = computeGeorgeResult(DEFAULT_STATE)
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('goTo')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.goTo).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('goTo always equals marker', () => {
      const scenarios = [
        DEFAULT_STATE,
        state({ isMission19Completed: true, isMission18Completed: true }),
        state({ isMission7Given: true, isMission18Completed: true }),
        state({ isMission19Given: true, hasMapPiece2: true, isMission18Completed: true }),
        state({ isMission18Completed: true })
      ]
      for (const s of scenarios) {
        const result = computeGeorgeResult(s)
        expect(result.goTo).toBe(result.marker)
      }
    })

    test('actions has all expected boolean keys', () => {
      const result = computeGeorgeResult(DEFAULT_STATE)
      const expectedKeys = [
        'completeMission7',
        'completeMission18',
        'completeMission19',
        'giveMission7',
        'deleteDiary',
        'giveMapPiece2'
      ]
      for (const key of expectedKeys) {
        expect(result.actions).toHaveProperty(key)
        expect(typeof result.actions[key]).toBe('boolean')
      }
    })
  })

  // ===========================================================================
  // Actions: default state (no actions unless triggered)
  // ===========================================================================

  describe('actions default to false when not triggered', () => {
    test('M18 completed, nothing else → all actions false', () => {
      const result = computeGeorgeResult(state({ isMission18Completed: true }))
      expect(result.actions.completeMission7).toBe(false)
      expect(result.actions.completeMission18).toBe(false)
      expect(result.actions.completeMission19).toBe(false)
      expect(result.actions.giveMission7).toBe(false)
      expect(result.actions.deleteDiary).toBe(false)
      expect(result.actions.giveMapPiece2).toBe(false)
    })
  })
})
