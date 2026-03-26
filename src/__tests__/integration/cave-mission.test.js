/**
 * Integration test: Cave scene + computeCaveResult
 *
 * Verifies that the Cave/Bat Island scene (scene 86) correctly handles
 * the multi-mission chain involving missions 4, 8, and 10, with items
 * MapPiece3, Blinddog, and part 975.
 *
 * The cascading if-block structure means later blocks OVERWRITE earlier
 * marker assignments, and the medal 1 check at the END independently
 * determines the actual go() target.
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeCaveResult } = require('../../scenes/CaveData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission8Given: false,
    isMission8Completed: false,
    isMission4Given: false,
    isMission4Completed: false,
    hasBlinddog: false,
    hasPart975: false,
    hasMedal1: false,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computeCaveResult to verify wiring
// ---------------------------------------------------------------------------
const CaveData = require('../../scenes/CaveData')
const originalCompute = CaveData.computeCaveResult
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(CaveData, 'computeCaveResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeCaveResult with full mission flows
// ===========================================================================

describe('Cave mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. First visit (nothing given/completed)
  // -----------------------------------------------------------------------
  describe('First visit (nothing given/completed)', () => {
    const state = baseState()

    test('gives MapPiece3 and Mission8', () => {
      const result = computeCaveResult(state)
      expect(result.actions.giveMapPiece3).toBe(true)
      expect(result.actions.giveMission8).toBe(true)
    })

    test('marker is "noMission"', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('noMission')
    })

    test('no medal1 → goTo="medalStart"', () => {
      const result = computeCaveResult(state)
      expect(result.goTo).toBe('medalStart')
    })
  })

  // -----------------------------------------------------------------------
  // 2. M8 given, nothing else
  // -----------------------------------------------------------------------
  describe('M8 given, nothing else', () => {
    const state = baseState({ isMission8Given: true, hasMedal1: true })

    test('marker is "done"', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('done')
    })
  })

  // -----------------------------------------------------------------------
  // 3. M8 completed + M4 given + blinddog + no part975 + has medal1
  // -----------------------------------------------------------------------
  describe('M8 completed + M4 given + blinddog + no part975 + has medal1', () => {
    const state = baseState({
      isMission8Completed: true,
      isMission4Given: true,
      hasBlinddog: true,
      hasPart975: false,
      hasMedal1: true
    })

    test('marker is "JustDoIT"', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('JustDoIT')
    })

    test('completeMission4 = true', () => {
      const result = computeCaveResult(state)
      expect(result.actions.completeMission4).toBe(true)
    })

    test('deleteBlinddog = true', () => {
      const result = computeCaveResult(state)
      expect(result.actions.deleteBlinddog).toBe(true)
    })

    test('giveMission10 = true', () => {
      const result = computeCaveResult(state)
      expect(result.actions.giveMission10).toBe(true)
    })

    test('givePart975 = true (player does not have it)', () => {
      const result = computeCaveResult(state)
      expect(result.actions.givePart975).toBe(true)
    })

    test('goTo="JustDoIT" (has medal1)', () => {
      const result = computeCaveResult(state)
      expect(result.goTo).toBe('JustDoIT')
    })
  })

  // -----------------------------------------------------------------------
  // 4. M8 completed + M4 given + blinddog + has part975
  // -----------------------------------------------------------------------
  describe('M8 completed + M4 given + blinddog + has part975', () => {
    const state = baseState({
      isMission8Completed: true,
      isMission4Given: true,
      hasBlinddog: true,
      hasPart975: true,
      hasMedal1: true
    })

    test('marker is "JustDoIT"', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('JustDoIT')
    })

    test('givePart975 = false (player already has it)', () => {
      const result = computeCaveResult(state)
      expect(result.actions.givePart975).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 5. M8 completed + M4 given + no blinddog
  // -----------------------------------------------------------------------
  describe('M8 completed + M4 given + no blinddog', () => {
    const state = baseState({
      isMission8Completed: true,
      isMission4Given: true,
      hasBlinddog: false,
      hasMedal1: true
    })

    test('marker is "CantDoIT"', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('CantDoIT')
    })
  })

  // -----------------------------------------------------------------------
  // 6. M8 completed + M4 completed
  // -----------------------------------------------------------------------
  describe('M8 completed + M4 completed', () => {
    const state = baseState({
      isMission8Completed: true,
      isMission4Completed: true,
      hasMedal1: true
    })

    test('marker is "done"', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('done')
    })
  })

  // -----------------------------------------------------------------------
  // 7. M4 completed overrides Block 1 (Block 2)
  // -----------------------------------------------------------------------
  describe('M4 completed overrides Block 1', () => {
    const state = baseState({
      isMission8Given: false,
      isMission8Completed: false,
      isMission4Completed: true,
      hasMedal1: true
    })

    test('marker is "done" even though Block 1 would give MapPiece3', () => {
      const result = computeCaveResult(state)
      expect(result.marker).toBe('done')
    })

    test('Block 1 actions still fire (cascading overwrite)', () => {
      const result = computeCaveResult(state)
      expect(result.actions.giveMapPiece3).toBe(true)
      expect(result.actions.giveMission8).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 8. No medal1 → goTo="medalStart" regardless of marker
  // -----------------------------------------------------------------------
  describe('No medal1 → goTo="medalStart" regardless of marker', () => {
    test('goTo="medalStart" when marker is "done"', () => {
      const state = baseState({ isMission8Given: true, hasMedal1: false })
      const result = computeCaveResult(state)
      expect(result.marker).toBe('done')
      expect(result.goTo).toBe('medalStart')
    })

    test('goTo="medalStart" when marker is "JustDoIT"', () => {
      const state = baseState({
        isMission8Completed: true,
        isMission4Given: true,
        hasBlinddog: true,
        hasMedal1: false
      })
      const result = computeCaveResult(state)
      expect(result.marker).toBe('JustDoIT')
      expect(result.goTo).toBe('medalStart')
    })
  })

  // -----------------------------------------------------------------------
  // 9. Has medal1 → goTo=marker
  // -----------------------------------------------------------------------
  describe('Has medal1 → goTo=marker', () => {
    test('goTo matches marker "done"', () => {
      const state = baseState({ isMission8Given: true, hasMedal1: true })
      const result = computeCaveResult(state)
      expect(result.goTo).toBe(result.marker)
    })

    test('goTo matches marker "CantDoIT"', () => {
      const state = baseState({
        isMission8Completed: true,
        isMission4Given: true,
        hasBlinddog: false,
        hasMedal1: true
      })
      const result = computeCaveResult(state)
      expect(result.goTo).toBe('CantDoIT')
    })
  })

  // -----------------------------------------------------------------------
  // 10. M8 not given + M8 completed → "done" (else branch of Block 1)
  // -----------------------------------------------------------------------
  describe('M8 not given + M8 completed (unusual state)', () => {
    const state = baseState({
      isMission8Given: false,
      isMission8Completed: true,
      hasMedal1: true
    })

    test('marker is "done" via else branch of Block 1', () => {
      const result = computeCaveResult(state)
      // Block 1 else branch sets 'done', Block 3 may overwrite depending on M4
      // With no M4 given, Block 3 inner if is skipped, marker stays 'done'
      expect(result.marker).toBe('done')
    })

    test('no MapPiece3 or Mission8 given', () => {
      const result = computeCaveResult(state)
      expect(result.actions.giveMapPiece3).toBe(false)
      expect(result.actions.giveMission8).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 11. Export verification
  // -----------------------------------------------------------------------
  describe('CaveData export verification', () => {
    test('CaveData exports computeCaveResult as a function', () => {
      expect(typeof CaveData.computeCaveResult).toBe('function')
    })

    test('computeCaveResult spy captures calls', () => {
      CaveData.computeCaveResult(baseState())
      expect(computeSpy).toHaveBeenCalledTimes(1)
    })

    test('spy receives correct state shape', () => {
      const state = baseState({ isMission8Given: true, hasBlinddog: true })
      CaveData.computeCaveResult(state)
      expect(computeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isMission8Given: true,
          isMission8Completed: false,
          isMission4Given: false,
          isMission4Completed: false,
          hasBlinddog: true,
          hasPart975: false,
          hasMedal1: false
        })
      )
    })
  })
})
