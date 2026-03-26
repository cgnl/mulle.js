/**
 * @fileoverview Tests for AlgaeIslandData - AlgaeIsland scene logic (scene 84)
 * Based on: decompiled Lingo startMovie for scene 84
 *
 * The original Lingo uses cascading overwrites — three sequential if-blocks
 * that can each overwrite the marker set by the previous block. The M21
 * block always runs its side-effects (complete M21, give part 30, give M11)
 * even when the CombineHarvester block later overwrites the marker.
 *
 * Flow:
 *   1. M11 check: if M11 not completed → Watertank? "JustDoItTank" : "cantDoit"
 *   2. M21 check: if M21 not completed → OVERWRITES marker from M11.
 *      Watertank? complete M11 + "noMissionTank" : "nomission".
 *      ALWAYS: complete M21, give part 30, give M11.
 *   3. CombineHarvester: if has CombineHarvester → OVERWRITES everything.
 *      M10 not completed? complete M10, give helmet, "JustDoItWeed"
 *      M10 completed? "Done" + random(1-5)
 *   4. Fallback: if marker still undefined → "Done" + random(1-5)
 */

const { computeAlgaeIslandResult } = require('../AlgaeIslandData')

// Helper to build state with defaults
function makeState (overrides = {}) {
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

describe('AlgaeIslandData', () => {
  // ===========================================================================
  // First visit: M21 not completed (fresh player)
  // ===========================================================================

  describe('first visit — M21 not completed', () => {
    test('no watertank, no harvester → marker "nomission"', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: false,
        hasWatertank: false,
        hasCombineHarvester: false
      }))
      expect(result.marker).toBe('nomission')
    })

    test('with watertank, no harvester → marker "noMissionTank", complete M11', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: false,
        hasWatertank: true,
        hasCombineHarvester: false
      }))
      expect(result.marker).toBe('noMissionTank')
      expect(result.actions.completeMission11).toBe(true)
    })

    test('M21 block always: complete M21, give part 30, give M11', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: false,
        hasWatertank: false,
        hasCombineHarvester: false
      }))
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
    })

    test('no watertank → M11 not completed by M21 block', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: false,
        hasWatertank: false
      }))
      // M21 block only completes M11 if hasWatertank
      expect(result.actions.completeMission11).toBe(false)
    })
  })

  // ===========================================================================
  // M11 check (only runs when M21 is already completed)
  // ===========================================================================

  describe('M11 check — M21 already completed, M11 not completed', () => {
    test('with watertank → marker "JustDoItTank", complete M11', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: false,
        isMission21Completed: true,
        hasWatertank: true,
        hasCombineHarvester: false
      }))
      expect(result.marker).toBe('JustDoItTank')
      expect(result.actions.completeMission11).toBe(true)
    })

    test('without watertank → marker "cantDoit"', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: false,
        isMission21Completed: true,
        hasWatertank: false,
        hasCombineHarvester: false
      }))
      expect(result.marker).toBe('cantDoit')
      expect(result.actions.completeMission11).toBe(false)
    })

    test('M21 actions NOT triggered when M21 already completed', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: true,
        hasCombineHarvester: false
      }))
      expect(result.actions.completeMission21).toBe(false)
      expect(result.actions.givePart30).toBe(false)
      expect(result.actions.giveMission11).toBe(false)
    })
  })

  // ===========================================================================
  // CombineHarvester override
  // ===========================================================================

  describe('CombineHarvester override', () => {
    test('has CombineHarvester, M10 not completed → "JustDoItWeed"', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: true,
        isMission21Completed: true,
        isMission10Completed: false,
        hasCombineHarvester: true
      }))
      expect(result.marker).toBe('JustDoItWeed')
      expect(result.actions.completeMission10).toBe(true)
      expect(result.actions.giveHelmet).toBe(true)
    })

    test('has CombineHarvester, M10 already completed → "Done" + suffix', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: true,
        isMission21Completed: true,
        isMission10Completed: true,
        hasCombineHarvester: true,
        randomDoneSuffix: 4
      }))
      expect(result.marker).toBe('Done4')
      expect(result.actions.completeMission10).toBe(false)
      expect(result.actions.giveHelmet).toBe(false)
    })

    test('CombineHarvester overrides M11 marker', () => {
      // M21 completed, M11 not completed, has watertank → M11 sets "JustDoItTank"
      // But CombineHarvester overrides to "JustDoItWeed"
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: false,
        isMission21Completed: true,
        isMission10Completed: false,
        hasWatertank: true,
        hasCombineHarvester: true
      }))
      expect(result.marker).toBe('JustDoItWeed')
      // M11 is still completed (from M11 block)
      expect(result.actions.completeMission11).toBe(true)
    })
  })

  // ===========================================================================
  // Cascading overwrite: M21 + CombineHarvester both apply
  // ===========================================================================

  describe('cascading overwrite — M21 fresh + CombineHarvester', () => {
    test('M21 actions happen even when CombineHarvester overwrites marker', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: false,
        isMission21Completed: false,
        isMission10Completed: false,
        hasWatertank: true,
        hasCombineHarvester: true
      }))
      // CombineHarvester overwrites marker
      expect(result.marker).toBe('JustDoItWeed')
      // But M21 side-effects still happened
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
      // M11 completed by M21 block (watertank present)
      expect(result.actions.completeMission11).toBe(true)
      // M10 completed by CombineHarvester block
      expect(result.actions.completeMission10).toBe(true)
      expect(result.actions.giveHelmet).toBe(true)
    })

    test('M21 fresh + CombineHarvester + no watertank', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: false,
        isMission10Completed: false,
        hasWatertank: false,
        hasCombineHarvester: true
      }))
      // CombineHarvester overwrites M21's "nomission" marker
      expect(result.marker).toBe('JustDoItWeed')
      // M21 actions still fire
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
      // No watertank → M11 not completed
      expect(result.actions.completeMission11).toBe(false)
    })

    test('M21 fresh + CombineHarvester + M10 already done → "Done" + suffix', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission21Completed: false,
        isMission10Completed: true,
        hasWatertank: false,
        hasCombineHarvester: true,
        randomDoneSuffix: 2
      }))
      expect(result.marker).toBe('Done2')
      // M21 actions still fire
      expect(result.actions.completeMission21).toBe(true)
      expect(result.actions.givePart30).toBe(true)
      expect(result.actions.giveMission11).toBe(true)
    })
  })

  // ===========================================================================
  // Done fallback (marker still undefined)
  // ===========================================================================

  describe('Done fallback', () => {
    test('all missions completed, no harvester → "Done" + suffix', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: true,
        isMission21Completed: true,
        isMission10Completed: true,
        hasCombineHarvester: false,
        randomDoneSuffix: 1
      }))
      expect(result.marker).toBe('Done1')
    })

    test('Done suffix varies with randomDoneSuffix', () => {
      for (let i = 1; i <= 5; i++) {
        const result = computeAlgaeIslandResult(makeState({
          isMission11Completed: true,
          isMission21Completed: true,
          isMission10Completed: true,
          hasCombineHarvester: false,
          randomDoneSuffix: i
        }))
        expect(result.marker).toBe('Done' + i)
      }
    })

    test('fallback triggers no side-effect actions', () => {
      const result = computeAlgaeIslandResult(makeState({
        isMission11Completed: true,
        isMission21Completed: true,
        isMission10Completed: true,
        hasCombineHarvester: false
      }))
      expect(result.actions.completeMission11).toBe(false)
      expect(result.actions.completeMission21).toBe(false)
      expect(result.actions.completeMission10).toBe(false)
      expect(result.actions.giveMission11).toBe(false)
      expect(result.actions.givePart30).toBe(false)
      expect(result.actions.giveHelmet).toBe(false)
    })
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return marker and actions object', () => {
      const result = computeAlgaeIslandResult(makeState())
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('actions object has all expected keys', () => {
      const result = computeAlgaeIslandResult(makeState())
      expect(result.actions).toHaveProperty('completeMission11')
      expect(result.actions).toHaveProperty('completeMission21')
      expect(result.actions).toHaveProperty('completeMission10')
      expect(result.actions).toHaveProperty('giveMission11')
      expect(result.actions).toHaveProperty('givePart30')
      expect(result.actions).toHaveProperty('giveHelmet')
    })
  })
})
