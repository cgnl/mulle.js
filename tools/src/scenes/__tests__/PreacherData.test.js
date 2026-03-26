/**
 * @fileoverview Tests for PreacherData - Preacher scene logic (scene 78)
 * Based on: decompiled_lingo/78/78/casts/Internal/ParentScript 4 - Dir.ls
 *
 * The Preacher scene has two missions:
 * - Mission 20: First-visit introduction (one-time, overrides everything)
 * - Mission 1: Bible delivery (repeatable, awards parts or snacks)
 *
 * CRITICAL Lingo behavior: The mission 20 check at the END of startMovie
 * overwrites myMarker to "cantDoit2" regardless of what was set above.
 */

const { computePreacherResult } = require('../PreacherData')

// Helper: create a default state with overrides
function makeState (overrides = {}) {
  return {
    isMission1Given: true,
    isMission20Completed: true,
    hasRequiredItem: true,
    completionCount: 0,
    randomPart: 42,
    suffix: 1,
    ...overrides
  }
}

describe('PreacherData', () => {
  // =========================================================================
  // NO MISSION GIVEN
  // =========================================================================

  describe('no mission given (M20 already completed)', () => {
    test('marker should be "NoMission"', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: true
      }))
      expect(result.marker).toBe('NoMission')
    })

    test('no actions should be taken', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: true
      }))
      expect(result.actions.completeMission1).toBe(false)
      expect(result.actions.completeMission20).toBe(false)
      expect(result.actions.giveMission1).toBe(false)
      expect(result.actions.deleteItem).toBe(false)
      expect(result.actions.givePart).toBeNull()
      expect(result.actions.giveBelly).toBe(false)
    })
  })

  // =========================================================================
  // MISSION GIVEN, NO ITEM
  // =========================================================================

  describe('mission given, no required item', () => {
    test('marker should be "cantDoIt1" with suffix 1', () => {
      const result = computePreacherResult(makeState({
        hasRequiredItem: false,
        suffix: 1
      }))
      expect(result.marker).toBe('cantDoIt1')
    })

    test('marker should be "cantDoIt2" with suffix 2', () => {
      const result = computePreacherResult(makeState({
        hasRequiredItem: false,
        suffix: 2
      }))
      expect(result.marker).toBe('cantDoIt2')
    })

    test('no completion or reward actions', () => {
      const result = computePreacherResult(makeState({
        hasRequiredItem: false,
        suffix: 1
      }))
      expect(result.actions.completeMission1).toBe(false)
      expect(result.actions.deleteItem).toBe(false)
      expect(result.actions.givePart).toBeNull()
      expect(result.actions.giveBelly).toBe(false)
    })
  })

  // =========================================================================
  // MISSION GIVEN, HAS ITEM — COMPLETIONS 1-5
  // =========================================================================

  describe('mission given, has item, 1st completion (count=0 → newCount=1)', () => {
    test('marker should be "JustdoIt" + suffix', () => {
      const result = computePreacherResult(makeState({
        completionCount: 0,
        randomPart: 42,
        suffix: 1
      }))
      expect(result.marker).toBe('JustdoIt1')
    })

    test('should complete mission 1 and delete item', () => {
      const result = computePreacherResult(makeState({
        completionCount: 0,
        randomPart: 42
      }))
      expect(result.actions.completeMission1).toBe(true)
      expect(result.actions.deleteItem).toBe(true)
    })

    test('should give the random part', () => {
      const result = computePreacherResult(makeState({
        completionCount: 0,
        randomPart: 42
      }))
      expect(result.actions.givePart).toBe(42)
      expect(result.actions.giveBelly).toBe(false)
    })
  })

  describe('mission given, has item, 2nd completion (count=1 → newCount=2)', () => {
    test('should force givePart to 19 regardless of randomPart', () => {
      const result = computePreacherResult(makeState({
        completionCount: 1,
        randomPart: 99
      }))
      expect(result.actions.givePart).toBe(19)
    })

    test('should force givePart to 19 even if randomPart is null', () => {
      const result = computePreacherResult(makeState({
        completionCount: 1,
        randomPart: null
      }))
      // Part 19 overrides #NoPart since the override happens before the null check
      expect(result.actions.givePart).toBe(19)
      expect(result.actions.giveBelly).toBe(false)
    })

    test('marker should be "JustdoIt" + suffix', () => {
      const result = computePreacherResult(makeState({
        completionCount: 1,
        randomPart: 99,
        suffix: 2
      }))
      expect(result.marker).toBe('JustdoIt2')
    })
  })

  describe('mission given, has item, 3rd-5th completion', () => {
    test('3rd completion (count=2 → newCount=3) gives randomPart', () => {
      const result = computePreacherResult(makeState({
        completionCount: 2,
        randomPart: 55
      }))
      expect(result.actions.givePart).toBe(55)
      expect(result.actions.giveBelly).toBe(false)
    })

    test('4th completion (count=3 → newCount=4) gives randomPart', () => {
      const result = computePreacherResult(makeState({
        completionCount: 3,
        randomPart: 77
      }))
      expect(result.actions.givePart).toBe(77)
    })

    test('5th completion (count=4 → newCount=5) still gives part (boundary)', () => {
      const result = computePreacherResult(makeState({
        completionCount: 4,
        randomPart: 33,
        suffix: 1
      }))
      expect(result.actions.givePart).toBe(33)
      expect(result.actions.giveBelly).toBe(false)
      expect(result.marker).toBe('JustdoIt1')
    })
  })

  // =========================================================================
  // #NoPart (randomPart=null) — SNACK INSTEAD
  // =========================================================================

  describe('mission given, has item, randomPart=null (#NoPart)', () => {
    test('should give Belly snack instead of part', () => {
      const result = computePreacherResult(makeState({
        completionCount: 0,
        randomPart: null
      }))
      expect(result.actions.givePart).toBeNull()
      expect(result.actions.giveBelly).toBe(true)
    })

    test('marker should be "JustdoItSnack" + suffix', () => {
      const result = computePreacherResult(makeState({
        completionCount: 0,
        randomPart: null,
        suffix: 2
      }))
      expect(result.marker).toBe('JustdoItSnack2')
    })

    test('should still complete mission and delete item', () => {
      const result = computePreacherResult(makeState({
        completionCount: 0,
        randomPart: null
      }))
      expect(result.actions.completeMission1).toBe(true)
      expect(result.actions.deleteItem).toBe(true)
    })
  })

  // =========================================================================
  // 6TH+ COMPLETION — ALWAYS SNACK
  // =========================================================================

  describe('mission given, has item, 6th+ completion (count>=5)', () => {
    test('6th completion (count=5 → newCount=6) gives snack even with valid part', () => {
      const result = computePreacherResult(makeState({
        completionCount: 5,
        randomPart: 42,
        suffix: 1
      }))
      expect(result.actions.givePart).toBeNull()
      expect(result.actions.giveBelly).toBe(true)
      expect(result.marker).toBe('JustdoItSnack1')
    })

    test('10th completion (count=9 → newCount=10) gives snack', () => {
      const result = computePreacherResult(makeState({
        completionCount: 9,
        randomPart: 42,
        suffix: 2
      }))
      expect(result.actions.givePart).toBeNull()
      expect(result.actions.giveBelly).toBe(true)
      expect(result.marker).toBe('JustdoItSnack2')
    })

    test('should still complete mission and delete item', () => {
      const result = computePreacherResult(makeState({
        completionCount: 5,
        randomPart: 42
      }))
      expect(result.actions.completeMission1).toBe(true)
      expect(result.actions.deleteItem).toBe(true)
    })
  })

  // =========================================================================
  // BOUNDARY: count=4 vs count=5
  // =========================================================================

  describe('boundary: count=4 (newCount=5) vs count=5 (newCount=6)', () => {
    test('count=4 (newCount=5, <= 5) should give part', () => {
      const result = computePreacherResult(makeState({
        completionCount: 4,
        randomPart: 50
      }))
      expect(result.actions.givePart).toBe(50)
      expect(result.actions.giveBelly).toBe(false)
    })

    test('count=5 (newCount=6, > 5) should give snack', () => {
      const result = computePreacherResult(makeState({
        completionCount: 5,
        randomPart: 50
      }))
      expect(result.actions.givePart).toBeNull()
      expect(result.actions.giveBelly).toBe(true)
    })
  })

  // =========================================================================
  // MISSION 20 OVERRIDE — CRITICAL LINGO BEHAVIOR
  // =========================================================================

  describe('mission 20 NOT completed (first visit override)', () => {
    test('should override marker to "cantDoit2" even when no mission given', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: false
      }))
      expect(result.marker).toBe('cantDoit2')
    })

    test('should override marker to "cantDoit2" even when mission given with item', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: true,
        isMission20Completed: false,
        hasRequiredItem: true,
        completionCount: 0,
        randomPart: 42
      }))
      expect(result.marker).toBe('cantDoit2')
    })

    test('should override marker to "cantDoit2" even when "cantDoIt" would be set', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: true,
        isMission20Completed: false,
        hasRequiredItem: false,
        suffix: 1
      }))
      // Would normally be "cantDoIt1" but M20 overrides
      expect(result.marker).toBe('cantDoit2')
    })

    test('should complete mission 20', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: false
      }))
      expect(result.actions.completeMission20).toBe(true)
    })

    test('should give mission 1 if not already given', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: false
      }))
      expect(result.actions.giveMission1).toBe(true)
    })

    test('should NOT give mission 1 if already given', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: true,
        isMission20Completed: false
      }))
      expect(result.actions.giveMission1).toBe(false)
    })

    test('M20 override still allows M1 completion actions when item is present', () => {
      // The M1 logic runs BEFORE the M20 override, so completion actions still happen
      const result = computePreacherResult(makeState({
        isMission1Given: true,
        isMission20Completed: false,
        hasRequiredItem: true,
        completionCount: 0,
        randomPart: 42
      }))
      expect(result.marker).toBe('cantDoit2') // overridden
      expect(result.actions.completeMission1).toBe(true) // still happens
      expect(result.actions.deleteItem).toBe(true) // still happens
      expect(result.actions.givePart).toBe(42) // still happens
    })
  })

  // =========================================================================
  // MISSION 20 ALREADY COMPLETED — NORMAL FLOW
  // =========================================================================

  describe('mission 20 already completed', () => {
    test('should NOT override marker — normal flow applies', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: true,
        isMission20Completed: true,
        hasRequiredItem: true,
        completionCount: 0,
        randomPart: 42,
        suffix: 1
      }))
      expect(result.marker).toBe('JustdoIt1')
      expect(result.actions.completeMission20).toBe(false)
    })

    test('should NOT complete mission 20 again', () => {
      const result = computePreacherResult(makeState({
        isMission20Completed: true
      }))
      expect(result.actions.completeMission20).toBe(false)
    })

    test('should NOT give mission 1 via M20 path', () => {
      const result = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: true
      }))
      expect(result.actions.giveMission1).toBe(false)
    })
  })

  // =========================================================================
  // SUFFIX RESPECTED IN ALL MARKERS
  // =========================================================================

  describe('suffix is respected in all marker strings', () => {
    test('JustdoIt uses suffix', () => {
      const r1 = computePreacherResult(makeState({ suffix: 1 }))
      const r2 = computePreacherResult(makeState({ suffix: 2 }))
      expect(r1.marker).toBe('JustdoIt1')
      expect(r2.marker).toBe('JustdoIt2')
    })

    test('JustdoItSnack uses suffix', () => {
      const r1 = computePreacherResult(makeState({ randomPart: null, suffix: 1 }))
      const r2 = computePreacherResult(makeState({ randomPart: null, suffix: 2 }))
      expect(r1.marker).toBe('JustdoItSnack1')
      expect(r2.marker).toBe('JustdoItSnack2')
    })

    test('cantDoIt uses suffix', () => {
      const r1 = computePreacherResult(makeState({ hasRequiredItem: false, suffix: 1 }))
      const r2 = computePreacherResult(makeState({ hasRequiredItem: false, suffix: 2 }))
      expect(r1.marker).toBe('cantDoIt1')
      expect(r2.marker).toBe('cantDoIt2')
    })

    test('NoMission does NOT use suffix', () => {
      const r1 = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: true,
        suffix: 1
      }))
      const r2 = computePreacherResult(makeState({
        isMission1Given: false,
        isMission20Completed: true,
        suffix: 2
      }))
      expect(r1.marker).toBe('NoMission')
      expect(r2.marker).toBe('NoMission')
    })

    test('cantDoit2 (M20 override) does NOT use suffix', () => {
      const r1 = computePreacherResult(makeState({
        isMission20Completed: false,
        suffix: 1
      }))
      const r2 = computePreacherResult(makeState({
        isMission20Completed: false,
        suffix: 2
      }))
      expect(r1.marker).toBe('cantDoit2')
      expect(r2.marker).toBe('cantDoit2')
    })
  })
})
