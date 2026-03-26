/**
 * Integration test: Diving scenes + computeDivingResult / computeDivingSceneResult
 *
 * Verifies BOTH diving functions from DivingData.js:
 * - computeDivingResult (scene 70): helmet + suit check, mission 15 completion
 * - computeDivingSceneResult (scene 87): extended version with mission 23,
 *   mission 12, medal 5, and visit-count routing
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeDivingResult, computeDivingSceneResult } = require('../../scenes/DivingData')

// ---------------------------------------------------------------------------
// Helper: base state factories
// ---------------------------------------------------------------------------
function baseDivingState (overrides = {}) {
  return {
    hasHelmet: false,
    hasSuit: false,
    randomPart: null,
    ...overrides
  }
}

function baseSceneState (overrides = {}) {
  return {
    hasHelmet: false,
    hasSuit: false,
    missionCount23: 0,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on DivingData exports to verify wiring
// ---------------------------------------------------------------------------
const DivingData = require('../../scenes/DivingData')
let divingSpy
let sceneSpy

beforeEach(() => {
  divingSpy = jest.spyOn(DivingData, 'computeDivingResult')
  sceneSpy = jest.spyOn(DivingData, 'computeDivingSceneResult')
})

afterEach(() => {
  divingSpy.mockRestore()
  sceneSpy.mockRestore()
})

// ===========================================================================
// Integration: computeDivingResult (scene 70)
// ===========================================================================

describe('Diving mission integration (computeDivingResult)', () => {
  // -----------------------------------------------------------------------
  // 1. Helmet + suit + part=42
  // -----------------------------------------------------------------------
  describe('Helmet + suit + randomPart=42', () => {
    const state = baseDivingState({ hasHelmet: true, hasSuit: true, randomPart: 42 })

    test('marker is "JustDoit"', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission15 = true', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(true)
    })

    test('givePart = 42', () => {
      const result = computeDivingResult(state)
      expect(result.actions.givePart).toBe(42)
    })
  })

  // -----------------------------------------------------------------------
  // 2. Helmet + suit + null part
  // -----------------------------------------------------------------------
  describe('Helmet + suit + null randomPart', () => {
    const state = baseDivingState({ hasHelmet: true, hasSuit: true, randomPart: null })

    test('marker is "JustDoit"', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission15 = true', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(true)
    })

    test('givePart = null (no part available)', () => {
      const result = computeDivingResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 3. Helmet + no suit
  // -----------------------------------------------------------------------
  describe('Helmet + no suit', () => {
    const state = baseDivingState({ hasHelmet: true, hasSuit: false })

    test('marker is "cantDoit"', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('completeMission15 = false', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 4. No helmet + suit
  // -----------------------------------------------------------------------
  describe('No helmet + suit', () => {
    const state = baseDivingState({ hasHelmet: false, hasSuit: true })

    test('marker is "cantDoit"', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('cantDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 5. No helmet + no suit
  // -----------------------------------------------------------------------
  describe('No helmet + no suit', () => {
    const state = baseDivingState({ hasHelmet: false, hasSuit: false })

    test('marker is "cantDoit"', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('no actions fire', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(false)
      expect(result.actions.givePart).toBeNull()
    })
  })
})

// ===========================================================================
// Integration: computeDivingSceneResult (scene 87)
// ===========================================================================

describe('Diving scene integration (computeDivingSceneResult)', () => {
  // -----------------------------------------------------------------------
  // 6. Helmet + suit + count=0 (first visit)
  // -----------------------------------------------------------------------
  describe('Helmet + suit + count=0 (first visit)', () => {
    const state = baseSceneState({ hasHelmet: true, hasSuit: true, missionCount23: 0 })

    test('marker is "JustDoit"', () => {
      const result = computeDivingSceneResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('goTo="start" (first visit, count < 2)', () => {
      const result = computeDivingSceneResult(state)
      expect(result.goTo).toBe('start')
    })

    test('completeMission12 = true', () => {
      const result = computeDivingSceneResult(state)
      expect(result.actions.completeMission12).toBe(true)
    })

    test('awardMedal5 = true', () => {
      const result = computeDivingSceneResult(state)
      expect(result.actions.awardMedal5).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 7. Helmet + suit + count=1 (second visit, count < 2)
  // -----------------------------------------------------------------------
  describe('Helmet + suit + count=1', () => {
    const state = baseSceneState({ hasHelmet: true, hasSuit: true, missionCount23: 1 })

    test('goTo="start" (count < 2)', () => {
      const result = computeDivingSceneResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 7b. Helmet + suit + count=2 (third visit, count >= 2)
  // -----------------------------------------------------------------------
  describe('Helmet + suit + count=2', () => {
    const state = baseSceneState({ hasHelmet: true, hasSuit: true, missionCount23: 2 })

    test('goTo="JustDoit" (count >= 2)', () => {
      const result = computeDivingSceneResult(state)
      expect(result.goTo).toBe('JustDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 8. No items + count=5
  // -----------------------------------------------------------------------
  describe('No items + count=5', () => {
    const state = baseSceneState({ hasHelmet: false, hasSuit: false, missionCount23: 5 })

    test('marker is "cantDoit"', () => {
      const result = computeDivingSceneResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('goTo="cantDoit" (count >= 2, goes to marker)', () => {
      const result = computeDivingSceneResult(state)
      expect(result.goTo).toBe('cantDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 9. No items + count=0
  // -----------------------------------------------------------------------
  describe('No items + count=0', () => {
    const state = baseSceneState({ hasHelmet: false, hasSuit: false, missionCount23: 0 })

    test('marker is "cantDoit"', () => {
      const result = computeDivingSceneResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('goTo="start" (count < 2)', () => {
      const result = computeDivingSceneResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 10. Always completeMission23=true
  // -----------------------------------------------------------------------
  describe('completeMission23 is always true', () => {
    test('completeMission23=true with full equipment', () => {
      const result = computeDivingSceneResult(baseSceneState({ hasHelmet: true, hasSuit: true }))
      expect(result.actions.completeMission23).toBe(true)
    })

    test('completeMission23=true with no equipment', () => {
      const result = computeDivingSceneResult(baseSceneState())
      expect(result.actions.completeMission23).toBe(true)
    })

    test('completeMission23=true with partial equipment', () => {
      const result = computeDivingSceneResult(baseSceneState({ hasHelmet: true }))
      expect(result.actions.completeMission23).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 11. Export verification
  // -----------------------------------------------------------------------
  describe('DivingData export verification', () => {
    test('DivingData exports computeDivingResult as a function', () => {
      expect(typeof DivingData.computeDivingResult).toBe('function')
    })

    test('DivingData exports computeDivingSceneResult as a function', () => {
      expect(typeof DivingData.computeDivingSceneResult).toBe('function')
    })

    test('DivingData exports MISSION_ID', () => {
      expect(DivingData.MISSION_ID).toBeDefined()
      expect(DivingData.MISSION_ID).toBe(15)
    })

    test('computeDivingResult spy captures calls', () => {
      DivingData.computeDivingResult(baseDivingState())
      expect(divingSpy).toHaveBeenCalledTimes(1)
    })

    test('computeDivingSceneResult spy captures calls', () => {
      DivingData.computeDivingSceneResult(baseSceneState())
      expect(sceneSpy).toHaveBeenCalledTimes(1)
    })
  })
})
