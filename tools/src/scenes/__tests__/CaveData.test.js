/**
 * @fileoverview Tests for CaveData - Cave/Bat Island scene logic (scene 86)
 * Based on: decompiled_lingo/86/86/casts/Internal/ParentScript 1 - Dir.ls
 *
 * This scene handles missions 4, 8, 10 and items MapPiece3, Blinddog, part 975.
 *
 * The Lingo uses cascading if-blocks where later blocks OVERWRITE earlier marker
 * assignments. The medal 1 check at the END independently determines the go() target.
 *
 * State flow (cascading overwrites):
 *   Default: "noMission"
 *   M8 given → "done"
 *   M8 not given, not completed → give MapPiece3 + M8, marker stays "noMission"
 *   M8 not given, completed → "done"
 *   M4 completed → "done" (overrides)
 *   M8 completed, M4 given, has Blinddog → "JustDoIT" + side effects
 *   M8 completed, M4 given, no Blinddog → "CantDoIT"
 *   M8 completed, M4 not given → marker unchanged from earlier
 *   Finally: no medal 1 → go("medalStart"), else go(myMarker)
 */

const { computeCaveResult } = require('../CaveData')

// Default state helper — all flags false (brand new player)
function makeState (overrides = {}) {
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

// All-false actions for comparison
const NO_ACTIONS = {
  giveMapPiece3: false,
  giveMission8: false,
  completeMission4: false,
  deleteBlinddog: false,
  giveMission10: false,
  givePart975: false,
  awardMedal1: false
}

describe('CaveData', () => {
  // ===========================================================================
  // First ever visit (no medal 1, M8 not given/completed)
  // ===========================================================================

  describe('first ever visit (no medal 1, M8 not given, M8 not completed)', () => {
    const result = computeCaveResult(makeState())

    test('marker is "noMission" (M8 not given, first discovery)', () => {
      expect(result.marker).toBe('noMission')
    })

    test('goTo is "medalStart" (no medal 1 override)', () => {
      expect(result.goTo).toBe('medalStart')
    })

    test('gives MapPiece3', () => {
      expect(result.actions.giveMapPiece3).toBe(true)
    })

    test('gives mission 8', () => {
      expect(result.actions.giveMission8).toBe(true)
    })

    test('awards medal 1', () => {
      expect(result.actions.awardMedal1).toBe(true)
    })

    test('does not complete mission 4', () => {
      expect(result.actions.completeMission4).toBe(false)
    })

    test('does not delete Blinddog', () => {
      expect(result.actions.deleteBlinddog).toBe(false)
    })

    test('does not give mission 10', () => {
      expect(result.actions.giveMission10).toBe(false)
    })

    test('does not give part 975', () => {
      expect(result.actions.givePart975).toBe(false)
    })
  })

  // ===========================================================================
  // First visit but already has medal 1 (e.g. earned in another scene)
  // ===========================================================================

  describe('first visit with medal 1 already earned', () => {
    const result = computeCaveResult(makeState({ hasMedal1: true }))

    test('marker is "noMission"', () => {
      expect(result.marker).toBe('noMission')
    })

    test('goTo is "noMission" (has medal, so goTo = marker)', () => {
      expect(result.goTo).toBe('noMission')
    })

    test('gives MapPiece3', () => {
      expect(result.actions.giveMapPiece3).toBe(true)
    })

    test('gives mission 8', () => {
      expect(result.actions.giveMission8).toBe(true)
    })

    test('does NOT award medal 1 (already has it)', () => {
      expect(result.actions.awardMedal1).toBe(false)
    })
  })

  // ===========================================================================
  // M8 given, not completed
  // ===========================================================================

  describe('M8 given, not completed', () => {
    const result = computeCaveResult(makeState({
      isMission8Given: true,
      hasMedal1: true
    }))

    test('marker is "done"', () => {
      expect(result.marker).toBe('done')
    })

    test('goTo is "done"', () => {
      expect(result.goTo).toBe('done')
    })

    test('does NOT give MapPiece3 (M8 already given)', () => {
      expect(result.actions.giveMapPiece3).toBe(false)
    })

    test('does NOT give mission 8 again', () => {
      expect(result.actions.giveMission8).toBe(false)
    })
  })

  // ===========================================================================
  // M8 not given, M8 completed (unusual state)
  // ===========================================================================

  describe('M8 not given but M8 completed (unusual state)', () => {
    const result = computeCaveResult(makeState({
      isMission8Completed: true,
      hasMedal1: true
    }))

    test('marker is "done" (from else branch)', () => {
      expect(result.marker).toBe('done')
    })

    test('goTo is "done"', () => {
      expect(result.goTo).toBe('done')
    })

    test('does NOT give MapPiece3', () => {
      expect(result.actions.giveMapPiece3).toBe(false)
    })

    test('does NOT give mission 8', () => {
      expect(result.actions.giveMission8).toBe(false)
    })
  })

  // ===========================================================================
  // M4 already completed (overrides everything to "done")
  // ===========================================================================

  describe('M4 already completed overrides to "done"', () => {
    test('M4 completed with M8 not given → "done"', () => {
      const result = computeCaveResult(makeState({
        isMission4Completed: true,
        hasMedal1: true
      }))
      expect(result.marker).toBe('done')
      expect(result.goTo).toBe('done')
    })

    test('M4 completed with M8 given → "done"', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        isMission4Completed: true,
        hasMedal1: true
      }))
      expect(result.marker).toBe('done')
      expect(result.goTo).toBe('done')
    })

    test('M4 completed with M8 completed → "done" (block 3 also sets "done")', () => {
      const result = computeCaveResult(makeState({
        isMission8Completed: true,
        isMission4Completed: true,
        hasMedal1: true
      }))
      expect(result.marker).toBe('done')
      expect(result.goTo).toBe('done')
    })

    test('M4 completed does NOT trigger Blinddog delivery actions', () => {
      const result = computeCaveResult(makeState({
        isMission8Completed: true,
        isMission4Completed: true,
        isMission4Given: true,
        hasBlinddog: true,
        hasMedal1: true
      }))
      // Block 3: M8 completed → M4 completed → "done", never enters Blinddog branch
      expect(result.actions.completeMission4).toBe(false)
      expect(result.actions.deleteBlinddog).toBe(false)
      expect(result.actions.giveMission10).toBe(false)
      expect(result.actions.givePart975).toBe(false)
    })
  })

  // ===========================================================================
  // Blinddog delivery: M8 completed, M4 given, has Blinddog, no part 975
  // ===========================================================================

  describe('Blinddog delivery (M8 completed, M4 given, has Blinddog, no part 975)', () => {
    const result = computeCaveResult(makeState({
      isMission8Given: true,
      isMission8Completed: true,
      isMission4Given: true,
      hasBlinddog: true,
      hasPart975: false,
      hasMedal1: true
    }))

    test('marker is "JustDoIT"', () => {
      expect(result.marker).toBe('JustDoIT')
    })

    test('goTo is "JustDoIT"', () => {
      expect(result.goTo).toBe('JustDoIT')
    })

    test('completes mission 4', () => {
      expect(result.actions.completeMission4).toBe(true)
    })

    test('deletes Blinddog from inventory', () => {
      expect(result.actions.deleteBlinddog).toBe(true)
    })

    test('gives mission 10', () => {
      expect(result.actions.giveMission10).toBe(true)
    })

    test('gives part 975 (player does not have it)', () => {
      expect(result.actions.givePart975).toBe(true)
    })

    test('does NOT award medal 1 (already has it)', () => {
      expect(result.actions.awardMedal1).toBe(false)
    })
  })

  // ===========================================================================
  // Blinddog delivery: already has part 975 → does NOT give part 975 again
  // ===========================================================================

  describe('Blinddog delivery with part 975 already owned', () => {
    const result = computeCaveResult(makeState({
      isMission8Given: true,
      isMission8Completed: true,
      isMission4Given: true,
      hasBlinddog: true,
      hasPart975: true,
      hasMedal1: true
    }))

    test('marker is "JustDoIT"', () => {
      expect(result.marker).toBe('JustDoIT')
    })

    test('goTo is "JustDoIT"', () => {
      expect(result.goTo).toBe('JustDoIT')
    })

    test('completes mission 4', () => {
      expect(result.actions.completeMission4).toBe(true)
    })

    test('deletes Blinddog', () => {
      expect(result.actions.deleteBlinddog).toBe(true)
    })

    test('gives mission 10', () => {
      expect(result.actions.giveMission10).toBe(true)
    })

    test('does NOT give part 975 (already has it)', () => {
      expect(result.actions.givePart975).toBe(false)
    })
  })

  // ===========================================================================
  // M8 completed, M4 given, no Blinddog → "CantDoIT"
  // ===========================================================================

  describe('M8 completed, M4 given, no Blinddog', () => {
    const result = computeCaveResult(makeState({
      isMission8Given: true,
      isMission8Completed: true,
      isMission4Given: true,
      hasBlinddog: false,
      hasMedal1: true
    }))

    test('marker is "CantDoIT"', () => {
      expect(result.marker).toBe('CantDoIT')
    })

    test('goTo is "CantDoIT"', () => {
      expect(result.goTo).toBe('CantDoIT')
    })

    test('no delivery actions triggered', () => {
      expect(result.actions.completeMission4).toBe(false)
      expect(result.actions.deleteBlinddog).toBe(false)
      expect(result.actions.giveMission10).toBe(false)
      expect(result.actions.givePart975).toBe(false)
    })
  })

  // ===========================================================================
  // M8 completed, M4 not given → marker unchanged from block 1 ("done" from M8 given)
  // ===========================================================================

  describe('M8 completed, M4 not given (marker unchanged from block 1)', () => {
    const result = computeCaveResult(makeState({
      isMission8Given: true,
      isMission8Completed: true,
      isMission4Given: false,
      hasMedal1: true
    }))

    test('marker is "done" (from M8 given in block 1, unchanged by block 3)', () => {
      expect(result.marker).toBe('done')
    })

    test('goTo is "done"', () => {
      expect(result.goTo).toBe('done')
    })

    test('no Blinddog delivery actions', () => {
      expect(result.actions.completeMission4).toBe(false)
      expect(result.actions.deleteBlinddog).toBe(false)
      expect(result.actions.giveMission10).toBe(false)
    })
  })

  // ===========================================================================
  // Medal 1 override: no medal → always "medalStart" regardless of marker
  // ===========================================================================

  describe('medal 1 override (no medal → always "medalStart")', () => {
    test('marker "done" but goTo "medalStart" when no medal 1', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        hasMedal1: false
      }))
      expect(result.marker).toBe('done')
      expect(result.goTo).toBe('medalStart')
      expect(result.actions.awardMedal1).toBe(true)
    })

    test('marker "JustDoIT" but goTo "medalStart" when no medal 1', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        isMission8Completed: true,
        isMission4Given: true,
        hasBlinddog: true,
        hasMedal1: false
      }))
      expect(result.marker).toBe('JustDoIT')
      expect(result.goTo).toBe('medalStart')
      expect(result.actions.awardMedal1).toBe(true)
    })

    test('marker "CantDoIT" but goTo "medalStart" when no medal 1', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        isMission8Completed: true,
        isMission4Given: true,
        hasBlinddog: false,
        hasMedal1: false
      }))
      expect(result.marker).toBe('CantDoIT')
      expect(result.goTo).toBe('medalStart')
      expect(result.actions.awardMedal1).toBe(true)
    })

    test('marker "noMission" but goTo "medalStart" when no medal 1', () => {
      const result = computeCaveResult(makeState({
        hasMedal1: false
      }))
      expect(result.marker).toBe('noMission')
      expect(result.goTo).toBe('medalStart')
      expect(result.actions.awardMedal1).toBe(true)
    })
  })

  // ===========================================================================
  // Medal 1 already had: goTo = marker (no override)
  // ===========================================================================

  describe('medal 1 already earned (goTo = marker)', () => {
    test('goTo equals marker when medal 1 already earned', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        hasMedal1: true
      }))
      expect(result.goTo).toBe(result.marker)
      expect(result.actions.awardMedal1).toBe(false)
    })

    test('goTo "noMission" when hasMedal1 and first discovery', () => {
      const result = computeCaveResult(makeState({
        hasMedal1: true
      }))
      expect(result.goTo).toBe('noMission')
      expect(result.actions.awardMedal1).toBe(false)
    })
  })

  // ===========================================================================
  // Action accumulation: multiple actions in a single visit
  // ===========================================================================

  describe('action accumulation', () => {
    test('first ever visit accumulates giveMapPiece3 + giveMission8 + awardMedal1', () => {
      const result = computeCaveResult(makeState())
      expect(result.actions.giveMapPiece3).toBe(true)
      expect(result.actions.giveMission8).toBe(true)
      expect(result.actions.awardMedal1).toBe(true)
      // No other actions
      expect(result.actions.completeMission4).toBe(false)
      expect(result.actions.deleteBlinddog).toBe(false)
      expect(result.actions.giveMission10).toBe(false)
      expect(result.actions.givePart975).toBe(false)
    })

    test('Blinddog delivery accumulates completeMission4 + deleteBlinddog + giveMission10 + givePart975', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        isMission8Completed: true,
        isMission4Given: true,
        hasBlinddog: true,
        hasPart975: false,
        hasMedal1: true
      }))
      expect(result.actions.completeMission4).toBe(true)
      expect(result.actions.deleteBlinddog).toBe(true)
      expect(result.actions.giveMission10).toBe(true)
      expect(result.actions.givePart975).toBe(true)
      // No discovery or medal actions
      expect(result.actions.giveMapPiece3).toBe(false)
      expect(result.actions.giveMission8).toBe(false)
      expect(result.actions.awardMedal1).toBe(false)
    })

    test('"done" state triggers no actions at all', () => {
      const result = computeCaveResult(makeState({
        isMission8Given: true,
        hasMedal1: true
      }))
      expect(result.actions).toEqual(NO_ACTIONS)
    })
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('returns object with marker, goTo, and actions', () => {
      const result = computeCaveResult(makeState())
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('goTo')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.goTo).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('actions has exactly the expected keys', () => {
      const result = computeCaveResult(makeState())
      const expectedKeys = [
        'giveMapPiece3',
        'giveMission8',
        'completeMission4',
        'deleteBlinddog',
        'giveMission10',
        'givePart975',
        'awardMedal1'
      ]
      expect(Object.keys(result.actions).sort()).toEqual(expectedKeys.sort())
    })
  })
})
