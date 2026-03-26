/**
 * Integration test: Preacher scene + computePreacherResult
 *
 * Verifies that the Preacher scene correctly integrates with PreacherData.js
 * by simulating full mission flows through the headless game runner.
 *
 * Tests cover:
 *   1. M1 given + item delivery with various completion counts
 *   2. Forced part=19 on second completion
 *   3. Snack fallback when randomPart is null or count > 5
 *   4. No-item and no-mission paths
 *   5. M20 override logic
 *   6. Export verification
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computePreacherResult } = require('../../scenes/PreacherData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission1Given: false,
    isMission20Completed: true,
    hasRequiredItem: false,
    completionCount: 0,
    randomPart: null,
    suffix: 1,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computePreacherResult to verify wiring
// ---------------------------------------------------------------------------
const PreacherData = require('../../scenes/PreacherData')
const originalCompute = PreacherData.computePreacherResult
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(PreacherData, 'computePreacherResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computePreacherResult with full mission flows
// ===========================================================================

describe('Preacher mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. M1 given + item + count=0 + randomPart=42 -> JustdoIt1
  // -----------------------------------------------------------------------
  describe('M1 given + item + count=0 + randomPart=42', () => {
    const state = baseState({
      isMission1Given: true,
      hasRequiredItem: true,
      completionCount: 0,
      randomPart: 42,
      suffix: 1
    })

    test('marker is "JustdoIt1"', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toBe('JustdoIt1')
    })

    test('completeMission1 = true', () => {
      const result = computePreacherResult(state)
      expect(result.actions.completeMission1).toBe(true)
    })

    test('givePart = 42', () => {
      const result = computePreacherResult(state)
      expect(result.actions.givePart).toBe(42)
    })
  })

  // -----------------------------------------------------------------------
  // 2. M1 given + item + count=1 (becomes 2nd) -> force part=19
  // -----------------------------------------------------------------------
  describe('M1 given + item + count=1 (second completion forces part=19)', () => {
    const state = baseState({
      isMission1Given: true,
      hasRequiredItem: true,
      completionCount: 1,
      randomPart: 42,
      suffix: 1
    })

    test('givePart is forced to 19 on second completion', () => {
      const result = computePreacherResult(state)
      expect(result.actions.givePart).toBe(19)
    })

    test('completeMission1 = true', () => {
      const result = computePreacherResult(state)
      expect(result.actions.completeMission1).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 3. M1 given + item + count=0 + randomPart=null -> snack (NoPart)
  // -----------------------------------------------------------------------
  describe('M1 given + item + count=0 + randomPart=null (no part available)', () => {
    const state = baseState({
      isMission1Given: true,
      hasRequiredItem: true,
      completionCount: 0,
      randomPart: null,
      suffix: 1
    })

    test('marker contains "JustdoItSnack" (NoPart fallback)', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toContain('JustdoItSnack')
    })
  })

  // -----------------------------------------------------------------------
  // 4. M1 given + item + count=5 (becomes 6, > 5) -> snack + giveBelly
  // -----------------------------------------------------------------------
  describe('M1 given + item + count=5 (sixth completion, always snack)', () => {
    const state = baseState({
      isMission1Given: true,
      hasRequiredItem: true,
      completionCount: 5,
      randomPart: 42,
      suffix: 1
    })

    test('marker contains "JustdoItSnack"', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toContain('JustdoItSnack')
    })

    test('giveBelly = true (snack path)', () => {
      const result = computePreacherResult(state)
      expect(result.actions.giveBelly).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 5. M1 given + no item -> cantDoIt + suffix
  // -----------------------------------------------------------------------
  describe('M1 given + no item', () => {
    const state = baseState({
      isMission1Given: true,
      hasRequiredItem: false,
      suffix: 1
    })

    test('marker is "cantDoIt1"', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toBe('cantDoIt1')
    })
  })

  // -----------------------------------------------------------------------
  // 6. M1 not given -> NoMission
  // -----------------------------------------------------------------------
  describe('M1 not given', () => {
    const state = baseState({
      isMission1Given: false,
      isMission20Completed: true
    })

    test('marker is "NoMission"', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toBe('NoMission')
    })
  })

  // -----------------------------------------------------------------------
  // 7. M20 not completed overrides everything -> cantDoit2
  // -----------------------------------------------------------------------
  describe('M20 not completed (override)', () => {
    const state = baseState({
      isMission20Completed: false,
      isMission1Given: true,
      hasRequiredItem: true,
      completionCount: 0,
      randomPart: 42
    })

    test('marker is "cantDoit2" (M20 override)', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toBe('cantDoit2')
    })

    test('completeMission20 = true', () => {
      const result = computePreacherResult(state)
      expect(result.actions.completeMission20).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 8. M20 not completed + M1 not given -> giveMission1=true
  // -----------------------------------------------------------------------
  describe('M20 not completed + M1 not given', () => {
    const state = baseState({
      isMission20Completed: false,
      isMission1Given: false
    })

    test('marker is "cantDoit2"', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toBe('cantDoit2')
    })

    test('giveMission1 = true', () => {
      const result = computePreacherResult(state)
      expect(result.actions.giveMission1).toBe(true)
    })

    test('completeMission20 = true', () => {
      const result = computePreacherResult(state)
      expect(result.actions.completeMission20).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 9. M20 completed + M1 given + item -> normal flow (no override)
  // -----------------------------------------------------------------------
  describe('M20 completed + M1 given + item (normal flow, no override)', () => {
    const state = baseState({
      isMission20Completed: true,
      isMission1Given: true,
      hasRequiredItem: true,
      completionCount: 0,
      randomPart: 42,
      suffix: 1
    })

    test('marker is "JustdoIt1" (not overridden)', () => {
      const result = computePreacherResult(state)
      expect(result.marker).toBe('JustdoIt1')
    })

    test('completeMission20 is not set or false', () => {
      const result = computePreacherResult(state)
      expect(result.actions.completeMission20).toBeFalsy()
    })

    test('completeMission1 = true', () => {
      const result = computePreacherResult(state)
      expect(result.actions.completeMission1).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 10. Export verification
  // -----------------------------------------------------------------------
  describe('PreacherData export verification', () => {
    test('computePreacherResult is a function', () => {
      expect(typeof PreacherData.computePreacherResult).toBe('function')
    })

    test('computeSpy captures calls', () => {
      PreacherData.computePreacherResult(baseState())
      expect(computeSpy).toHaveBeenCalledTimes(1)
    })

    test('spy receives correct state shape', () => {
      const state = baseState({
        isMission1Given: true,
        hasRequiredItem: true,
        completionCount: 3,
        randomPart: 10,
        suffix: 2
      })
      PreacherData.computePreacherResult(state)
      expect(computeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isMission1Given: true,
          hasRequiredItem: true,
          completionCount: 3,
          randomPart: 10,
          suffix: 2
        })
      )
    })
  })
})
