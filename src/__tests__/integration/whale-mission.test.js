/**
 * Integration test: Whale scene + computeWhaleResult
 *
 * Verifies the Whale scene (scene 88) mission 24 logic: watertank delivery
 * and fishing rod reward, with the Lingo case-insensitive goTo routing quirk
 * where "cantDoIt" always routes to "start".
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeWhaleResult } = require('../../scenes/WhaleData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission24Completed: false,
    isMission11Completed: false,
    hasWatertank: false,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computeWhaleResult to verify wiring
// ---------------------------------------------------------------------------
const WhaleData = require('../../scenes/WhaleData')
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(WhaleData, 'computeWhaleResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeWhaleResult with full mission flows
// ===========================================================================

describe('Whale mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. M24 already completed
  // -----------------------------------------------------------------------
  describe('M24 already completed', () => {
    const state = baseState({ isMission24Completed: true })

    test('marker is "Done"', () => {
      const result = computeWhaleResult(state)
      expect(result.marker).toBe('Done')
    })

    test('goTo="Done"', () => {
      const result = computeWhaleResult(state)
      expect(result.goTo).toBe('Done')
    })

    test('no actions fire', () => {
      const result = computeWhaleResult(state)
      expect(result.actions.completeMission24).toBe(false)
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 2. M11 completed + watertank
  // -----------------------------------------------------------------------
  describe('M11 completed + watertank', () => {
    const state = baseState({ isMission11Completed: true, hasWatertank: true })

    test('marker is "JustDoit"', () => {
      const result = computeWhaleResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission24 = true', () => {
      const result = computeWhaleResult(state)
      expect(result.actions.completeMission24).toBe(true)
    })

    test('giveFishingrod = true', () => {
      const result = computeWhaleResult(state)
      expect(result.actions.giveFishingrod).toBe(true)
    })

    test('goTo="JustDoit"', () => {
      const result = computeWhaleResult(state)
      expect(result.goTo).toBe('JustDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 3. M11 completed + no watertank
  // -----------------------------------------------------------------------
  describe('M11 completed + no watertank', () => {
    const state = baseState({ isMission11Completed: true, hasWatertank: false })

    test('marker is "cantDoIt"', () => {
      const result = computeWhaleResult(state)
      expect(result.marker).toBe('cantDoIt')
    })

    test('goTo="start"', () => {
      const result = computeWhaleResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 4. M11 not completed
  // -----------------------------------------------------------------------
  describe('M11 not completed', () => {
    const state = baseState({ isMission11Completed: false })

    test('marker is "cantDoIt"', () => {
      const result = computeWhaleResult(state)
      expect(result.marker).toBe('cantDoIt')
    })

    test('goTo="start"', () => {
      const result = computeWhaleResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 5. M11 not completed + watertank → still cantDoIt (need M11)
  // -----------------------------------------------------------------------
  describe('M11 not completed + watertank (need M11 first)', () => {
    const state = baseState({ isMission11Completed: false, hasWatertank: true })

    test('marker is "cantDoIt" (watertank alone is not enough)', () => {
      const result = computeWhaleResult(state)
      expect(result.marker).toBe('cantDoIt')
    })

    test('no actions fire', () => {
      const result = computeWhaleResult(state)
      expect(result.actions.completeMission24).toBe(false)
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 6. goTo routing: cantDoIt always goes to "start"
  // -----------------------------------------------------------------------
  describe('goTo routing: cantDoIt always goes to "start"', () => {
    test('cantDoIt from no M11 → goTo="start"', () => {
      const result = computeWhaleResult(baseState())
      expect(result.marker).toBe('cantDoIt')
      expect(result.goTo).toBe('start')
    })

    test('cantDoIt from M11 + no watertank → goTo="start"', () => {
      const result = computeWhaleResult(baseState({ isMission11Completed: true }))
      expect(result.marker).toBe('cantDoIt')
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 7. goTo routing: Done goes to "Done"
  // -----------------------------------------------------------------------
  describe('goTo routing: Done goes to "Done"', () => {
    test('Done marker routes to "Done"', () => {
      const result = computeWhaleResult(baseState({ isMission24Completed: true }))
      expect(result.goTo).toBe('Done')
    })
  })

  // -----------------------------------------------------------------------
  // 8. goTo routing: JustDoit goes to "JustDoit"
  // -----------------------------------------------------------------------
  describe('goTo routing: JustDoit goes to "JustDoit"', () => {
    test('JustDoit marker routes to "JustDoit"', () => {
      const result = computeWhaleResult(baseState({
        isMission11Completed: true,
        hasWatertank: true
      }))
      expect(result.goTo).toBe('JustDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 9. Export verification
  // -----------------------------------------------------------------------
  describe('WhaleData export verification', () => {
    test('WhaleData exports computeWhaleResult as a function', () => {
      expect(typeof WhaleData.computeWhaleResult).toBe('function')
    })

    test('WhaleData exports MARKER_DONE', () => {
      expect(WhaleData.MARKER_DONE).toBe('Done')
    })

    test('WhaleData exports MARKER_SUCCESS', () => {
      expect(WhaleData.MARKER_SUCCESS).toBe('JustDoit')
    })

    test('WhaleData exports MARKER_FAILURE', () => {
      expect(WhaleData.MARKER_FAILURE).toBe('cantDoIt')
    })

    test('WhaleData exports MISSION_ID', () => {
      expect(WhaleData.MISSION_ID).toBe(24)
    })

    test('WhaleData exports PREREQUISITE_MISSION_ID', () => {
      expect(WhaleData.PREREQUISITE_MISSION_ID).toBe(11)
    })

    test('computeWhaleResult spy captures calls', () => {
      WhaleData.computeWhaleResult(baseState())
      expect(computeSpy).toHaveBeenCalledTimes(1)
    })

    test('spy receives correct state shape', () => {
      const state = baseState({ isMission11Completed: true, hasWatertank: true })
      WhaleData.computeWhaleResult(state)
      expect(computeSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          isMission24Completed: false,
          isMission11Completed: true,
          hasWatertank: true
        })
      )
    })
  })
})
