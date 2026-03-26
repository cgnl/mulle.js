/**
 * Integration test: VickyIsland scene + computeVickyIslandResult
 *
 * Verifies that VickyIsland correctly integrates with VickyIslandData.js by
 * simulating full mission flows through the headless game runner.
 *
 * Scene 87: The player needs BOTH a helmet AND a suit to succeed (dive).
 * Mission 23 is ALWAYS completed on every visit (unconditional).
 * On success: mission 12 completed, part 979 given (or random), medal 5 awarded.
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeVickyIslandResult } = require('../../scenes/VickyIslandData')
const VickyIslandData = require('../../scenes/VickyIslandData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    hasHelmet: false,
    hasSuit: false,
    hasPart979: false,
    randomPart: null,
    completionCount23: 0,
    ...overrides
  }
}

// ===========================================================================
// Integration: computeVickyIslandResult with full mission flows
// ===========================================================================

describe('VickyIsland mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. Helmet + suit + no part979 + count=0
  // -----------------------------------------------------------------------
  describe('Helmet + suit + no part979 + count=0', () => {
    const state = baseState({ hasHelmet: true, hasSuit: true, hasPart979: false, completionCount23: 0 })

    test('marker is JustDoit', () => {
      const result = computeVickyIslandResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('goTo is start (first visit)', () => {
      const result = computeVickyIslandResult(state)
      expect(result.goTo).toBe('start')
    })

    test('completeMission12 = true', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.completeMission12).toBe(true)
    })

    test('completeMission23 = true', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.completeMission23).toBe(true)
    })

    test('givePart = 979', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.givePart).toBe(979)
    })

    test('awardMedal5 = true', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.awardMedal5).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 2. Helmet + suit + no part979 + count=1 (second visit)
  // -----------------------------------------------------------------------
  describe('Helmet + suit + no part979 + count=1 (second visit)', () => {
    const state = baseState({ hasHelmet: true, hasSuit: true, hasPart979: false, completionCount23: 1 })

    test('marker is JustDoit', () => {
      const result = computeVickyIslandResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('goTo is JustDoit (2nd visit, count+1 >= 2)', () => {
      const result = computeVickyIslandResult(state)
      expect(result.goTo).toBe('JustDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 3. Helmet + suit + has part979 + randomPart=42
  // -----------------------------------------------------------------------
  describe('Helmet + suit + has part979 + randomPart=42', () => {
    const state = baseState({ hasHelmet: true, hasSuit: true, hasPart979: true, randomPart: 42 })

    test('givePart = 42 (random part instead of 979)', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.givePart).toBe(42)
    })
  })

  // -----------------------------------------------------------------------
  // 4. No helmet
  // -----------------------------------------------------------------------
  describe('No helmet', () => {
    test('marker is cantDoit when count=0', () => {
      const result = computeVickyIslandResult(baseState({ hasHelmet: false, hasSuit: true, completionCount23: 0 }))
      expect(result.marker).toBe('cantDoit')
    })

    test('goTo is start when count=0', () => {
      const result = computeVickyIslandResult(baseState({ hasHelmet: false, completionCount23: 0 }))
      expect(result.goTo).toBe('start')
    })

    test('goTo is cantDoit when count=1 (2nd visit)', () => {
      const result = computeVickyIslandResult(baseState({ hasHelmet: false, completionCount23: 1 }))
      expect(result.goTo).toBe('cantDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 5. Helmet no suit
  // -----------------------------------------------------------------------
  describe('Helmet no suit', () => {
    const state = baseState({ hasHelmet: true, hasSuit: false })

    test('marker is cantDoit', () => {
      const result = computeVickyIslandResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('completeMission12 = false', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.completeMission12).toBe(false)
    })

    test('awardMedal5 = false', () => {
      const result = computeVickyIslandResult(state)
      expect(result.actions.awardMedal5).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 6. No items + count=0
  // -----------------------------------------------------------------------
  describe('No items + count=0', () => {
    const state = baseState({ hasHelmet: false, hasSuit: false, completionCount23: 0 })

    test('marker is cantDoit', () => {
      const result = computeVickyIslandResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('goTo is start (first visit)', () => {
      const result = computeVickyIslandResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 7. No items + count=2
  // -----------------------------------------------------------------------
  describe('No items + count=2', () => {
    const state = baseState({ hasHelmet: false, hasSuit: false, completionCount23: 2 })

    test('marker is cantDoit', () => {
      const result = computeVickyIslandResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('goTo is cantDoit (count+1 >= 2)', () => {
      const result = computeVickyIslandResult(state)
      expect(result.goTo).toBe('cantDoit')
    })
  })

  // -----------------------------------------------------------------------
  // 8. Always completeMission23=true regardless of outcome
  // -----------------------------------------------------------------------
  describe('completeMission23 always true', () => {
    test('true when helmet + suit', () => {
      const result = computeVickyIslandResult(baseState({ hasHelmet: true, hasSuit: true }))
      expect(result.actions.completeMission23).toBe(true)
    })

    test('true when helmet only', () => {
      const result = computeVickyIslandResult(baseState({ hasHelmet: true, hasSuit: false }))
      expect(result.actions.completeMission23).toBe(true)
    })

    test('true when no items', () => {
      const result = computeVickyIslandResult(baseState())
      expect(result.actions.completeMission23).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 9. Export verification
  // -----------------------------------------------------------------------
  describe('VickyIslandData export verification', () => {
    test('exports MISSION_23 = 23', () => {
      expect(VickyIslandData.MISSION_23).toBe(23)
    })

    test('exports MISSION_12 = 12', () => {
      expect(VickyIslandData.MISSION_12).toBe(12)
    })

    test('exports PART_979 = 979', () => {
      expect(VickyIslandData.PART_979).toBe(979)
    })

    test('exports MEDAL_5 = 5', () => {
      expect(VickyIslandData.MEDAL_5).toBe(5)
    })

    test('exports computeVickyIslandResult as a function', () => {
      expect(typeof VickyIslandData.computeVickyIslandResult).toBe('function')
    })
  })
})
