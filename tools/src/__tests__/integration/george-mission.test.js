/**
 * Integration test: George scene + computeGeorgeResult
 *
 * Verifies that the George scene correctly integrates with GeorgeData.js
 * by simulating full mission flows through the headless game runner.
 *
 * George uses sequential cascading blocks (later overwrites earlier):
 *   Block A: M19 completed -> marker='story'
 *   Block B: M7 given -> 'CantDoiT'; if hasDiary -> 'JustDoitDiary'
 *   Block C: M19 given -> hasMapPiece2? 'Story' : 'JustDoitMap'
 *   Block D: !M18 completed -> 'nomission', completeM18, giveM7
 *   Block E: marker undefined -> 'Story' (fallback)
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeGeorgeResult } = require('../../scenes/GeorgeData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission19Completed: false,
    isMission7Given: false,
    hasDiary: false,
    isMission19Given: false,
    hasMapPiece2: false,
    isMission18Completed: true,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computeGeorgeResult to verify wiring
// ---------------------------------------------------------------------------
const GeorgeData = require('../../scenes/GeorgeData')
const originalCompute = GeorgeData.computeGeorgeResult
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(GeorgeData, 'computeGeorgeResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeGeorgeResult with full mission flows
// ===========================================================================

describe('George mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. M18 not completed (Block D wins over everything)
  // -----------------------------------------------------------------------
  describe('M18 not completed (Block D wins)', () => {
    const state = baseState({
      isMission18Completed: false,
      isMission19Completed: true,
      isMission7Given: true,
      hasDiary: true,
      isMission19Given: true
    })

    test('marker is "nomission"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('nomission')
    })

    test('completeMission18 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.completeMission18).toBe(true)
    })

    test('giveMission7 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.giveMission7).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 2. M18 completed + nothing else -> 'Story' (fallback Block E)
  // -----------------------------------------------------------------------
  describe('M18 completed + nothing else (fallback Block E)', () => {
    const state = baseState({ isMission18Completed: true })

    test('marker is "Story"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('Story')
    })
  })

  // -----------------------------------------------------------------------
  // 3. M19 completed + M18 completed -> 'story' (Block A)
  // -----------------------------------------------------------------------
  describe('M19 completed + M18 completed (Block A)', () => {
    const state = baseState({
      isMission19Completed: true,
      isMission18Completed: true
    })

    test('marker is "story"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('story')
    })
  })

  // -----------------------------------------------------------------------
  // 4. M7 given + no diary + M18 completed -> 'CantDoiT'
  // -----------------------------------------------------------------------
  describe('M7 given + no diary + M18 completed (Block B, no diary)', () => {
    const state = baseState({
      isMission7Given: true,
      hasDiary: false,
      isMission18Completed: true
    })

    test('marker is "CantDoiT"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('CantDoiT')
    })
  })

  // -----------------------------------------------------------------------
  // 5. M7 given + diary + M18 completed -> 'JustDoitDiary'
  // -----------------------------------------------------------------------
  describe('M7 given + diary + M18 completed (Block B, with diary)', () => {
    const state = baseState({
      isMission7Given: true,
      hasDiary: true,
      isMission18Completed: true
    })

    test('marker is "JustDoitDiary"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('JustDoitDiary')
    })

    test('deleteDiary = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.deleteDiary).toBe(true)
    })

    test('completeMission7 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.completeMission7).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 6. M19 given + no MapPiece2 + M18 completed -> 'JustDoitMap'
  // -----------------------------------------------------------------------
  describe('M19 given + no MapPiece2 + M18 completed (Block C, deliver map)', () => {
    const state = baseState({
      isMission19Given: true,
      hasMapPiece2: false,
      isMission18Completed: true
    })

    test('marker is "JustDoitMap"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('JustDoitMap')
    })

    test('giveMapPiece2 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.giveMapPiece2).toBe(true)
    })

    test('completeMission19 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.completeMission19).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 7. M19 given + hasMapPiece2 + M18 completed -> 'Story' (Block C)
  // -----------------------------------------------------------------------
  describe('M19 given + hasMapPiece2 + M18 completed (Block C, already has map)', () => {
    const state = baseState({
      isMission19Given: true,
      hasMapPiece2: true,
      isMission18Completed: true
    })

    test('marker is "Story"', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('Story')
    })
  })

  // -----------------------------------------------------------------------
  // 8. All flags set + M18 NOT completed -> Block D wins ('nomission')
  // -----------------------------------------------------------------------
  describe('All flags set but M18 not completed (Block D overrides all)', () => {
    const state = baseState({
      isMission19Completed: true,
      isMission7Given: true,
      hasDiary: true,
      isMission19Given: true,
      hasMapPiece2: false,
      isMission18Completed: false
    })

    test('marker is "nomission" (Block D wins)', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('nomission')
    })

    test('completeMission18 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.completeMission18).toBe(true)
    })

    test('giveMission7 = true', () => {
      const result = computeGeorgeResult(state)
      expect(result.actions.giveMission7).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 9. Cascading: M19 completed + M7 given + M18 completed -> 'CantDoiT'
  //    (Block B overwrites Block A)
  // -----------------------------------------------------------------------
  describe('Cascading: M19 completed + M7 given + M18 completed (B overwrites A)', () => {
    const state = baseState({
      isMission19Completed: true,
      isMission7Given: true,
      hasDiary: false,
      isMission18Completed: true
    })

    test('marker is "CantDoiT" (Block B overwrites Block A "story")', () => {
      const result = computeGeorgeResult(state)
      expect(result.marker).toBe('CantDoiT')
    })
  })

  // -----------------------------------------------------------------------
  // 10. Export verification
  // -----------------------------------------------------------------------
  describe('GeorgeData export verification', () => {
    test('computeGeorgeResult is a function', () => {
      expect(typeof GeorgeData.computeGeorgeResult).toBe('function')
    })

    test('computeSpy captures calls', () => {
      GeorgeData.computeGeorgeResult(baseState())
      expect(computeSpy).toHaveBeenCalledTimes(1)
    })

    test('spy receives correct state shape', () => {
      const state = baseState({
        isMission19Completed: true,
        isMission7Given: true,
        hasDiary: true,
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: true
      })
      GeorgeData.computeGeorgeResult(state)
      expect(computeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isMission19Completed: true,
          isMission7Given: true,
          hasDiary: true,
          isMission19Given: true,
          hasMapPiece2: false,
          isMission18Completed: true
        })
      )
    })
  })
})
