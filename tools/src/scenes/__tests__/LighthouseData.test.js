/**
 * @fileoverview Tests for LighthouseData - Lighthouse scene logic (scene 85)
 * Based on: decompiled Lingo startMovie handler for scene 85
 *
 * Branch summary (from Lingo):
 *   M7 completed + M8 given     → "suit"  (give Suit, complete M8)  → go("suit")
 *   M7 completed + M8 NOT given → "leave" (lowercase)               → go("Start")
 *   M7 NOT completed + M7 given + no Diary  → "Diary" (give Diary)  → go("StartDiary")
 *   M7 NOT completed + M7 given + has Diary → "Leave" (uppercase L) → go("Start")
 *   M7 NOT completed + M7 NOT given         → "Leave" (uppercase L) → go("Start")
 *   VOID fallback                           → "Leave"               → go("Start")
 */

const { computeLighthouseResult, MARKER_GOTO } = require('../LighthouseData')

/** Helper to build state objects with defaults */
function makeState (overrides = {}) {
  return {
    isMission7Completed: false,
    isMission8Given: false,
    isMission7Given: false,
    hasDiary: false,
    ...overrides
  }
}

describe('LighthouseData', () => {
  // ===========================================================================
  // MARKER_GOTO mapping
  // ===========================================================================

  describe('MARKER_GOTO', () => {
    test('"Diary" maps to "StartDiary"', () => {
      expect(MARKER_GOTO.Diary).toBe('StartDiary')
    })

    test('"Leave" (uppercase) maps to "Start"', () => {
      expect(MARKER_GOTO.Leave).toBe('Start')
    })

    test('"leave" (lowercase) maps to "Start"', () => {
      expect(MARKER_GOTO.leave).toBe('Start')
    })

    test('"suit" maps to "suit"', () => {
      expect(MARKER_GOTO.suit).toBe('suit')
    })
  })

  // ===========================================================================
  // Branch 1: M7 completed + M8 given → "suit"
  // ===========================================================================

  describe('M7 completed + M8 given → "suit"', () => {
    const state = makeState({ isMission7Completed: true, isMission8Given: true })
    const result = computeLighthouseResult(state)

    test('marker is "suit" (lowercase)', () => {
      expect(result.marker).toBe('suit')
    })

    test('goTo is "suit"', () => {
      expect(result.goTo).toBe('suit')
    })

    test('action: giveSuit is true', () => {
      expect(result.actions.giveSuit).toBe(true)
    })

    test('action: completeMission8 is true', () => {
      expect(result.actions.completeMission8).toBe(true)
    })

    test('action: giveDiary is false', () => {
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // ===========================================================================
  // Branch 2: M7 completed + M8 NOT given → "leave"
  // ===========================================================================

  describe('M7 completed + M8 NOT given → "leave"', () => {
    const state = makeState({ isMission7Completed: true, isMission8Given: false })
    const result = computeLighthouseResult(state)

    test('marker is "leave" (lowercase)', () => {
      expect(result.marker).toBe('leave')
    })

    test('marker is NOT "Leave" (uppercase)', () => {
      expect(result.marker).not.toBe('Leave')
    })

    test('goTo is "Start"', () => {
      expect(result.goTo).toBe('Start')
    })

    test('no actions triggered', () => {
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // ===========================================================================
  // Branch 3: M7 NOT completed + M7 given + no Diary → "Diary"
  // ===========================================================================

  describe('M7 NOT completed + M7 given + no Diary → "Diary"', () => {
    const state = makeState({ isMission7Given: true, hasDiary: false })
    const result = computeLighthouseResult(state)

    test('marker is "Diary" (capital D)', () => {
      expect(result.marker).toBe('Diary')
    })

    test('goTo is "StartDiary"', () => {
      expect(result.goTo).toBe('StartDiary')
    })

    test('action: giveDiary is true', () => {
      expect(result.actions.giveDiary).toBe(true)
    })

    test('action: giveSuit is false', () => {
      expect(result.actions.giveSuit).toBe(false)
    })

    test('action: completeMission8 is false', () => {
      expect(result.actions.completeMission8).toBe(false)
    })
  })

  // ===========================================================================
  // Branch 4: M7 NOT completed + M7 given + has Diary → "Leave"
  // ===========================================================================

  describe('M7 NOT completed + M7 given + has Diary → "Leave"', () => {
    const state = makeState({ isMission7Given: true, hasDiary: true })
    const result = computeLighthouseResult(state)

    test('marker is "Leave" (uppercase L)', () => {
      expect(result.marker).toBe('Leave')
    })

    test('marker is NOT "leave" (lowercase)', () => {
      expect(result.marker).not.toBe('leave')
    })

    test('goTo is "Start"', () => {
      expect(result.goTo).toBe('Start')
    })

    test('no actions triggered', () => {
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // ===========================================================================
  // Branch 5: M7 NOT completed + M7 NOT given → "Leave"
  // ===========================================================================

  describe('M7 NOT completed + M7 NOT given → "Leave"', () => {
    const state = makeState({ isMission7Given: false })
    const result = computeLighthouseResult(state)

    test('marker is "Leave" (uppercase L)', () => {
      expect(result.marker).toBe('Leave')
    })

    test('goTo is "Start"', () => {
      expect(result.goTo).toBe('Start')
    })

    test('no actions triggered', () => {
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // ===========================================================================
  // VOID fallback → "Leave"
  // ===========================================================================

  describe('VOID fallback', () => {
    test('default state (all false) results in "Leave"', () => {
      const result = computeLighthouseResult(makeState())
      expect(result.marker).toBe('Leave')
      expect(result.goTo).toBe('Start')
    })

    test('all false → no actions triggered', () => {
      const result = computeLighthouseResult(makeState())
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // ===========================================================================
  // Exact casing verification (cross-branch)
  // ===========================================================================

  describe('exact marker casing across branches', () => {
    test.each([
      [{ isMission7Completed: true, isMission8Given: true }, 'suit'],
      [{ isMission7Completed: true, isMission8Given: false }, 'leave'],
      [{ isMission7Given: true, hasDiary: false }, 'Diary'],
      [{ isMission7Given: true, hasDiary: true }, 'Leave'],
      [{ isMission7Given: false }, 'Leave']
    ])('state %j → marker "%s"', (overrides, expectedMarker) => {
      const result = computeLighthouseResult(makeState(overrides))
      expect(result.marker).toBe(expectedMarker)
    })
  })

  // ===========================================================================
  // goTo routing verification (cross-branch)
  // ===========================================================================

  describe('goTo routing across branches', () => {
    test.each([
      [{ isMission7Completed: true, isMission8Given: true }, 'suit'],
      [{ isMission7Completed: true, isMission8Given: false }, 'Start'],
      [{ isMission7Given: true, hasDiary: false }, 'StartDiary'],
      [{ isMission7Given: true, hasDiary: true }, 'Start'],
      [{ isMission7Given: false }, 'Start']
    ])('state %j → goTo "%s"', (overrides, expectedGoTo) => {
      const result = computeLighthouseResult(makeState(overrides))
      expect(result.goTo).toBe(expectedGoTo)
    })
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return an object with marker, goTo, and actions', () => {
      const result = computeLighthouseResult(makeState())
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('goTo')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.goTo).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('actions has exactly three boolean properties', () => {
      const result = computeLighthouseResult(makeState())
      expect(result.actions).toHaveProperty('completeMission8')
      expect(result.actions).toHaveProperty('giveSuit')
      expect(result.actions).toHaveProperty('giveDiary')
      expect(typeof result.actions.completeMission8).toBe('boolean')
      expect(typeof result.actions.giveSuit).toBe('boolean')
      expect(typeof result.actions.giveDiary).toBe('boolean')
    })
  })
})
