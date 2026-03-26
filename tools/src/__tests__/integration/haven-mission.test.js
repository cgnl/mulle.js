/**
 * Integration test: Harbor scene + computeHarborResult
 *
 * Verifies that the Harbor/RottenFish scene correctly computes markers and
 * side-effects based on inventory state, boat capacity, and fish weight.
 *
 * Logic from scene 81 (decompiled Lingo):
 *   - hasRottenFish             -> 'notDelivered'
 *   - capacity >= weight        -> 'JustDoIt'+suffix, completeMission9, giveRottenFish
 *     - weight >= 35            -> also medal3, marker='JustDoItmedal'+suffix
 *   - capacity < weight         -> 'cantDoIt'+suffix
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const HarborData = require('../../scenes/HarborData')
const { computeHarborResult } = HarborData

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    hasRottenFish: false,
    loadCapacity: 40,
    rottenFishWeight: 25,
    suffix: 1,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computeHarborResult
// ---------------------------------------------------------------------------
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(HarborData, 'computeHarborResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeHarborResult with full mission flows
// ===========================================================================

describe('Harbor mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. Already has rotten fish -> 'notDelivered', no actions
  // -----------------------------------------------------------------------
  describe('Already has rotten fish', () => {
    const state = baseState({ hasRottenFish: true })

    test('marker is "notDelivered"', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('notDelivered')
    })

    test('no mission completion', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(false)
    })

    test('no rotten fish given', () => {
      const result = computeHarborResult(state)
      expect(result.actions.giveRottenFish).toBe(false)
    })

    test('no medal awarded', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 2. Capacity=40, weight=25, suffix=1 -> success without medal
  // -----------------------------------------------------------------------
  describe('Capacity >= weight, no medal (weight < 35)', () => {
    const state = baseState({ loadCapacity: 40, rottenFishWeight: 25, suffix: 1 })

    test('marker is "JustDoIt1"', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('JustDoIt1')
    })

    test('completeMission9 = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })

    test('giveRottenFish = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.giveRottenFish).toBe(true)
    })

    test('no medal (weight 25 < 35)', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 3. Capacity=40, weight=35, suffix=1 -> success with medal
  // -----------------------------------------------------------------------
  describe('Capacity >= weight, with medal (weight=35)', () => {
    const state = baseState({ loadCapacity: 40, rottenFishWeight: 35, suffix: 1 })

    test('marker is "JustDoItmedal1"', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('JustDoItmedal1')
    })

    test('completeMission9 = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })

    test('giveRottenFish = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.giveRottenFish).toBe(true)
    })

    test('awardMedal3 = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 4. Capacity=40, weight=40, suffix=2 -> success with medal
  // -----------------------------------------------------------------------
  describe('Capacity >= weight, with medal (weight=40, suffix=2)', () => {
    const state = baseState({ loadCapacity: 40, rottenFishWeight: 40, suffix: 2 })

    test('marker is "JustDoItmedal2"', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('JustDoItmedal2')
    })

    test('completeMission9 = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })

    test('awardMedal3 = true (weight 40 >= 35)', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 5. Capacity=10, weight=25 -> failure
  // -----------------------------------------------------------------------
  describe('Capacity < weight (failure)', () => {
    const state = baseState({ loadCapacity: 10, rottenFishWeight: 25, suffix: 1 })

    test('marker is "cantDoIt1"', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('cantDoIt1')
    })

    test('no mission completion', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(false)
    })

    test('no rotten fish given', () => {
      const result = computeHarborResult(state)
      expect(result.actions.giveRottenFish).toBe(false)
    })

    test('no medal awarded', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 6. Exact threshold: capacity=35, weight=35 -> success + medal
  // -----------------------------------------------------------------------
  describe('Exact threshold: capacity=35, weight=35', () => {
    const state = baseState({ loadCapacity: 35, rottenFishWeight: 35, suffix: 1 })

    test('marker is "JustDoItmedal1" (capacity >= weight)', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('JustDoItmedal1')
    })

    test('completeMission9 = true', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })

    test('awardMedal3 = true (weight >= 35)', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 7. Just below threshold: capacity=34, weight=35 -> failure
  // -----------------------------------------------------------------------
  describe('Just below threshold: capacity=34, weight=35', () => {
    const state = baseState({ loadCapacity: 34, rottenFishWeight: 35, suffix: 1 })

    test('marker is "cantDoIt1" (capacity < weight)', () => {
      const result = computeHarborResult(state)
      expect(result.marker).toBe('cantDoIt1')
    })

    test('no mission completion', () => {
      const result = computeHarborResult(state)
      expect(result.actions.completeMission9).toBe(false)
    })

    test('no rotten fish given', () => {
      const result = computeHarborResult(state)
      expect(result.actions.giveRottenFish).toBe(false)
    })

    test('no medal awarded', () => {
      const result = computeHarborResult(state)
      expect(result.actions.awardMedal3).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 8. Export verification
  // -----------------------------------------------------------------------
  describe('HarborData exports', () => {
    test('exports WEIGHT_LIST as an array of numbers', () => {
      expect(Array.isArray(HarborData.WEIGHT_LIST)).toBe(true)
      expect(HarborData.WEIGHT_LIST.length).toBeGreaterThan(0)
      HarborData.WEIGHT_LIST.forEach(w => expect(typeof w).toBe('number'))
    })

    test('exports CAN_LIST as an array of strings', () => {
      expect(Array.isArray(HarborData.CAN_LIST)).toBe(true)
      expect(HarborData.CAN_LIST.length).toBeGreaterThan(0)
      HarborData.CAN_LIST.forEach(c => expect(typeof c).toBe('string'))
    })

    test('MISSION_ID is 9', () => {
      expect(HarborData.MISSION_ID).toBe(9)
    })

    test('MEDAL_ID is 3', () => {
      expect(HarborData.MEDAL_ID).toBe(3)
    })

    test('exports computeHarborResult as a function', () => {
      expect(typeof HarborData.computeHarborResult).toBe('function')
    })
  })
})
