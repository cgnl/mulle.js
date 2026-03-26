/**
 * Integration test: Surfer scene + computeSurferResult / computeRottenFishDeliveryResult
 *
 * Verifies that SurferData.js correctly computes mission outcomes for both
 * the surfer power check (mission 14) and the rotten fish delivery (mission 9).
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeSurferResult, computeRottenFishDeliveryResult } = require('../../scenes/SurferData')
const SurferData = require('../../scenes/SurferData')

// ---------------------------------------------------------------------------
// Helper: base state factories
// ---------------------------------------------------------------------------
function baseSurferState (overrides = {}) {
  return {
    power: 0,
    randomPart: null,
    ...overrides
  }
}

function baseRottenFishState (overrides = {}) {
  return {
    hasRottenFish: false,
    capacity: 0,
    rottenFishWeight: 0,
    suffix: '1',
    ...overrides
  }
}

// ===========================================================================
// Integration: computeSurferResult
// ===========================================================================

describe('Surfer mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. power=200 (exact threshold) with a part
  // -----------------------------------------------------------------------
  describe('power=200 exact threshold with part', () => {
    const state = baseSurferState({ power: 200, randomPart: 'Sail42' })

    test('marker is JustDoit', () => {
      const result = computeSurferResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission14 = true', () => {
      const result = computeSurferResult(state)
      expect(result.actions.completeMission14).toBe(true)
    })

    test('givePart = randomPart', () => {
      const result = computeSurferResult(state)
      expect(result.actions.givePart).toBe('Sail42')
    })
  })

  // -----------------------------------------------------------------------
  // 2. power=300 with null part
  // -----------------------------------------------------------------------
  describe('power=300 with null part', () => {
    const state = baseSurferState({ power: 300, randomPart: null })

    test('marker is JustDoit', () => {
      const result = computeSurferResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission14 = true', () => {
      const result = computeSurferResult(state)
      expect(result.actions.completeMission14).toBe(true)
    })

    test('givePart = null', () => {
      const result = computeSurferResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 3. power=199 (below threshold)
  // -----------------------------------------------------------------------
  describe('power=199 below threshold', () => {
    const state = baseSurferState({ power: 199 })

    test('marker is cantDoIt', () => {
      const result = computeSurferResult(state)
      expect(result.marker).toBe('cantDoIt')
    })

    test('completeMission14 = false', () => {
      const result = computeSurferResult(state)
      expect(result.actions.completeMission14).toBe(false)
    })

    test('givePart = null', () => {
      const result = computeSurferResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 4. power=200 with NoPart string
  // -----------------------------------------------------------------------
  describe('power=200 with NoPart string', () => {
    const state = baseSurferState({ power: 200, randomPart: 'NoPart' })

    test('marker is JustDoit', () => {
      const result = computeSurferResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('givePart = null (NoPart treated as no part)', () => {
      const result = computeSurferResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })
})

// ===========================================================================
// Integration: computeRottenFishDeliveryResult
// ===========================================================================

describe('RottenFish delivery integration', () => {
  // -----------------------------------------------------------------------
  // 5. Already has rotten fish
  // -----------------------------------------------------------------------
  describe('already has rotten fish', () => {
    const state = baseRottenFishState({ hasRottenFish: true, capacity: 100, rottenFishWeight: 10, suffix: '1' })

    test('marker is notDelivered', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.marker).toBe('notDelivered')
    })

    test('all actions false', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.completeMission9).toBe(false)
      expect(result.actions.awardMedal3).toBe(false)
      expect(result.actions.giveRottenFish).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 6. capacity=40, weight=35 → medal path
  // -----------------------------------------------------------------------
  describe('capacity >= weight with medal (weight=35)', () => {
    const state = baseRottenFishState({ capacity: 40, rottenFishWeight: 35, suffix: '1' })

    test('marker is JustDoItmedal1', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.marker).toBe('JustDoItmedal1')
    })

    test('awardMedal3 = true', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.awardMedal3).toBe(true)
    })

    test('completeMission9 = true', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })

    test('giveRottenFish = true', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.giveRottenFish).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 7. capacity=30, weight=25 → no medal
  // -----------------------------------------------------------------------
  describe('capacity >= weight without medal (weight=25)', () => {
    const state = baseRottenFishState({ capacity: 30, rottenFishWeight: 25, suffix: '1' })

    test('marker is JustDoIt1 (no medal)', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.marker).toBe('JustDoIt1')
    })

    test('awardMedal3 = false', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.awardMedal3).toBe(false)
    })

    test('completeMission9 = true', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 8. capacity < weight → cantDoIt
  // -----------------------------------------------------------------------
  describe('capacity < weight', () => {
    const state = baseRottenFishState({ capacity: 10, rottenFishWeight: 25, suffix: '1' })

    test('marker is cantDoIt1', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.marker).toBe('cantDoIt1')
    })

    test('all actions false', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.completeMission9).toBe(false)
      expect(result.actions.awardMedal3).toBe(false)
      expect(result.actions.giveRottenFish).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 9. capacity=35, weight=35 (exact threshold) → success + medal
  // -----------------------------------------------------------------------
  describe('capacity equals weight at medal threshold', () => {
    const state = baseRottenFishState({ capacity: 35, rottenFishWeight: 35, suffix: '1' })

    test('marker is JustDoItmedal1', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.marker).toBe('JustDoItmedal1')
    })

    test('awardMedal3 = true', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.awardMedal3).toBe(true)
    })

    test('completeMission9 = true', () => {
      const result = computeRottenFishDeliveryResult(state)
      expect(result.actions.completeMission9).toBe(true)
    })
  })
})

// ===========================================================================
// Export verification
// ===========================================================================

describe('SurferData exports', () => {
  test('exports computeSurferResult as a function', () => {
    expect(typeof SurferData.computeSurferResult).toBe('function')
  })

  test('exports computeRottenFishDeliveryResult as a function', () => {
    expect(typeof SurferData.computeRottenFishDeliveryResult).toBe('function')
  })

  test('exports MISSION_ID constant', () => {
    expect(SurferData.MISSION_ID).toBe(14)
  })

  test('exports POWER_THRESHOLD constant', () => {
    expect(SurferData.POWER_THRESHOLD).toBe(200)
  })

  test('exports ROTTEN_FISH_MISSION_ID constant', () => {
    expect(SurferData.ROTTEN_FISH_MISSION_ID).toBe(9)
  })

  test('exports ROTTEN_FISH_MEDAL_ID constant', () => {
    expect(SurferData.ROTTEN_FISH_MEDAL_ID).toBe(3)
  })

  test('exports ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD constant', () => {
    expect(SurferData.ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD).toBe(35)
  })
})
