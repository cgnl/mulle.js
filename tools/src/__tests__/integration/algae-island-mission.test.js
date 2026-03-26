/**
 * Integration test: AlgaeIsland scene + computeAlgaeIslandResult
 *
 * Verifies that AlgaeIslandData.js correctly computes mission outcomes using
 * the cascading-overwrite structure from the original Lingo (M11 → M21 →
 * CombineHarvester → fallback).
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeAlgaeIslandResult } = require('../../scenes/AlgaeIslandData')
const AlgaeIslandData = require('../../scenes/AlgaeIslandData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission11Completed: false,
    isMission21Completed: false,
    isMission10Completed: false,
    hasWatertank: false,
    hasCombineHarvester: false,
    randomDoneSuffix: 3,
    ...overrides
  }
}

// ===========================================================================
// Integration: computeAlgaeIslandResult
// ===========================================================================

describe('AlgaeIsland mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. First visit (M21 not completed) no watertank
  // -----------------------------------------------------------------------
  describe('first visit without watertank', () => {
    const state = baseState()

    test('marker is nomission', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('nomission')
    })

    test('completeMission21 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission21).toBe(true)
    })

    test('givePart30 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.givePart30).toBe(true)
    })

    test('giveMission11 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.giveMission11).toBe(true)
    })

    test('completeMission11 = false', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission11).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 2. First visit with watertank
  // -----------------------------------------------------------------------
  describe('first visit with watertank', () => {
    const state = baseState({ hasWatertank: true })

    test('marker is noMissionTank', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('noMissionTank')
    })

    test('completeMission11 = true (M21 block also completes M11)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission11).toBe(true)
    })

    test('completeMission21 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission21).toBe(true)
    })

    test('givePart30 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.givePart30).toBe(true)
    })

    test('giveMission11 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.giveMission11).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 3. CombineHarvester overrides first visit
  // -----------------------------------------------------------------------
  describe('CombineHarvester overrides first visit (M21 not completed)', () => {
    const state = baseState({ hasCombineHarvester: true })

    test('marker is JustDoItWeed (harvester overwrites M21 marker)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('JustDoItWeed')
    })

    test('completeMission10 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission10).toBe(true)
    })

    test('giveHelmet = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.giveHelmet).toBe(true)
    })

    test('completeMission21 = true (M21 side-effects still fire)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission21).toBe(true)
    })

    test('givePart30 = true (M21 side-effects still fire)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.givePart30).toBe(true)
    })

    test('giveMission11 = true (M21 side-effects still fire)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.giveMission11).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 4. M21 completed + M11 not completed + watertank
  // -----------------------------------------------------------------------
  describe('M21 completed, M11 not completed, with watertank', () => {
    const state = baseState({ isMission21Completed: true, hasWatertank: true })

    test('marker is JustDoItTank', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('JustDoItTank')
    })

    test('completeMission11 = true', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission11).toBe(true)
    })

    test('completeMission21 = false (already completed)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission21).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 5. M21 completed + M11 not completed + no watertank
  // -----------------------------------------------------------------------
  describe('M21 completed, M11 not completed, no watertank', () => {
    const state = baseState({ isMission21Completed: true })

    test('marker is cantDoit', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('completeMission11 = false', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission11).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 6. All missions completed + harvester + M10 completed
  // -----------------------------------------------------------------------
  describe('all missions completed with harvester and M10 done', () => {
    const state = baseState({
      isMission11Completed: true,
      isMission21Completed: true,
      isMission10Completed: true,
      hasCombineHarvester: true,
      randomDoneSuffix: 4
    })

    test('marker is Done + suffix', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('Done4')
    })

    test('no missions completed', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission10).toBe(false)
      expect(result.actions.completeMission11).toBe(false)
      expect(result.actions.completeMission21).toBe(false)
    })

    test('giveHelmet = false', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.giveHelmet).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 7. All missions completed + no harvester (fallback)
  // -----------------------------------------------------------------------
  describe('all missions completed no harvester (fallback)', () => {
    const state = baseState({
      isMission11Completed: true,
      isMission21Completed: true,
      isMission10Completed: true,
      randomDoneSuffix: 2
    })

    test('marker is Done + suffix via fallback', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('Done2')
    })

    test('all actions false', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission10).toBe(false)
      expect(result.actions.completeMission11).toBe(false)
      expect(result.actions.completeMission21).toBe(false)
      expect(result.actions.giveMission11).toBe(false)
      expect(result.actions.givePart30).toBe(false)
      expect(result.actions.giveHelmet).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 8. CombineHarvester + M10 already completed
  // -----------------------------------------------------------------------
  describe('CombineHarvester with M10 already completed', () => {
    const state = baseState({
      isMission11Completed: true,
      isMission21Completed: true,
      isMission10Completed: true,
      hasCombineHarvester: true,
      randomDoneSuffix: 5
    })

    test('marker is Done + suffix', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.marker).toBe('Done5')
    })

    test('completeMission10 = false (already completed)', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.completeMission10).toBe(false)
    })

    test('giveHelmet = false', () => {
      const result = computeAlgaeIslandResult(state)
      expect(result.actions.giveHelmet).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 9. Side effects: M21 block always fires when M21 not completed
  // -----------------------------------------------------------------------
  describe('M21 side-effects always fire when M21 not completed', () => {
    test('without harvester: M21 side-effects present', () => {
      const result = computeAlgaeIslandResult(baseState())
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
    })

    test('with harvester overwriting marker: M21 side-effects still present', () => {
      const result = computeAlgaeIslandResult(baseState({ hasCombineHarvester: true }))
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
    })

    test('with watertank + harvester: M21 side-effects still present', () => {
      const result = computeAlgaeIslandResult(baseState({ hasWatertank: true, hasCombineHarvester: true }))
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
    })
  })
})

// ===========================================================================
// Export verification
// ===========================================================================

describe('AlgaeIslandData exports', () => {
  test('exports computeAlgaeIslandResult as a function', () => {
    expect(typeof AlgaeIslandData.computeAlgaeIslandResult).toBe('function')
  })

  test('exports DUMMY_PART constant', () => {
    expect(AlgaeIslandData.DUMMY_PART).toBe(86)
  })

  test('exports GIVE_PART constant', () => {
    expect(AlgaeIslandData.GIVE_PART).toBe(30)
  })

  test('exports HULL_POSITIONS object', () => {
    expect(AlgaeIslandData.HULL_POSITIONS).toBeDefined()
    expect(typeof AlgaeIslandData.HULL_POSITIONS).toBe('object')
    expect(AlgaeIslandData.HULL_POSITIONS.large).toBeDefined()
    expect(AlgaeIslandData.HULL_POSITIONS.medium).toBeDefined()
    expect(AlgaeIslandData.HULL_POSITIONS.small).toBeDefined()
  })

  test('exports NPC_SOUNDS_A as an array', () => {
    expect(Array.isArray(AlgaeIslandData.NPC_SOUNDS_A)).toBe(true)
    expect(AlgaeIslandData.NPC_SOUNDS_A.length).toBeGreaterThan(0)
  })

  test('exports NPC_SOUNDS_B as an array', () => {
    expect(Array.isArray(AlgaeIslandData.NPC_SOUNDS_B)).toBe(true)
    expect(AlgaeIslandData.NPC_SOUNDS_B.length).toBeGreaterThan(0)
  })
})
