/**
 * @fileoverview Tests for WhaleData - Whale scene (scene 88)
 * Based on: decompiled Lingo startMovie handler for scene 88
 *
 * Original Lingo (startMovie):
 *   if isMissionCompleted(user, 24) then
 *     myMarker = "Done"
 *   else
 *     if isMissionCompleted(user, 11) then
 *       if getProperty(tmpBoat, #Watertank) then
 *         myMarker = "JustDoit"
 *         addCompletedMission(user, 24)
 *         setInInventory(user, #Fishingrod, [:])
 *       else
 *         myMarker = "cantDoIt"
 *       end if
 *     else
 *       myMarker = "cantDoIt"
 *     end if
 *   end if
 *   if myMarker <> "cantDoiT" then   -- note casing quirk
 *     go(myMarker)
 *   else
 *     go("start")
 *   end if
 */

const {
  computeWhaleResult,
  MARKER_DONE,
  MARKER_SUCCESS,
  MARKER_FAILURE,
  MISSION_ID,
  PREREQUISITE_MISSION_ID
} = require('../WhaleData')

describe('WhaleData', () => {
  // =========================================================================
  // DONE PATH - M24 already completed
  // =========================================================================

  describe('when M24 is already completed', () => {
    const result = computeWhaleResult({
      isMission24Completed: true,
      isMission11Completed: false,
      hasWatertank: false
    })

    test('marker should be "Done"', () => {
      expect(result.marker).toBe('Done')
    })

    test('goTo should be "Done" (not "start")', () => {
      expect(result.goTo).toBe('Done')
    })

    test('should NOT complete mission 24 again', () => {
      expect(result.actions.completeMission24).toBe(false)
    })

    test('should NOT give Fishingrod again', () => {
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  describe('when M24 is already completed (regardless of other flags)', () => {
    test('M24 done + M11 done + watertank still returns "Done"', () => {
      const result = computeWhaleResult({
        isMission24Completed: true,
        isMission11Completed: true,
        hasWatertank: true
      })
      expect(result.marker).toBe('Done')
      expect(result.goTo).toBe('Done')
      expect(result.actions.completeMission24).toBe(false)
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  // =========================================================================
  // SUCCESS PATH - M24 not done, M11 done, has Watertank
  // =========================================================================

  describe('when M24 not done, M11 done, and has Watertank', () => {
    const result = computeWhaleResult({
      isMission24Completed: false,
      isMission11Completed: true,
      hasWatertank: true
    })

    test('marker should be "JustDoit"', () => {
      expect(result.marker).toBe('JustDoit')
    })

    test('goTo should be "JustDoit" (not "start")', () => {
      expect(result.goTo).toBe('JustDoit')
    })

    test('should complete mission 24', () => {
      expect(result.actions.completeMission24).toBe(true)
    })

    test('should give Fishingrod', () => {
      expect(result.actions.giveFishingrod).toBe(true)
    })
  })

  // =========================================================================
  // FAILURE PATH - missing M11
  // =========================================================================

  describe('when M11 is NOT completed (no Watertank)', () => {
    const result = computeWhaleResult({
      isMission24Completed: false,
      isMission11Completed: false,
      hasWatertank: false
    })

    test('marker should be "cantDoIt"', () => {
      expect(result.marker).toBe('cantDoIt')
    })

    test('goTo should be "start"', () => {
      expect(result.goTo).toBe('start')
    })

    test('should NOT complete mission 24', () => {
      expect(result.actions.completeMission24).toBe(false)
    })

    test('should NOT give Fishingrod', () => {
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  describe('when M11 is NOT completed (even with Watertank)', () => {
    const result = computeWhaleResult({
      isMission24Completed: false,
      isMission11Completed: false,
      hasWatertank: true
    })

    test('marker should be "cantDoIt" — M11 is checked before Watertank', () => {
      expect(result.marker).toBe('cantDoIt')
    })

    test('goTo should be "start"', () => {
      expect(result.goTo).toBe('start')
    })

    test('should NOT complete mission 24', () => {
      expect(result.actions.completeMission24).toBe(false)
    })

    test('should NOT give Fishingrod', () => {
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  // =========================================================================
  // FAILURE PATH - M11 done but missing Watertank
  // =========================================================================

  describe('when M11 is completed but NO Watertank', () => {
    const result = computeWhaleResult({
      isMission24Completed: false,
      isMission11Completed: true,
      hasWatertank: false
    })

    test('marker should be "cantDoIt"', () => {
      expect(result.marker).toBe('cantDoIt')
    })

    test('goTo should be "start"', () => {
      expect(result.goTo).toBe('start')
    })

    test('should NOT complete mission 24', () => {
      expect(result.actions.completeMission24).toBe(false)
    })

    test('should NOT give Fishingrod', () => {
      expect(result.actions.giveFishingrod).toBe(false)
    })
  })

  // =========================================================================
  // goTo ROUTING - Lingo case-insensitive comparison quirk
  // =========================================================================

  describe('goTo routing (Lingo case-insensitive quirk)', () => {
    test('"cantDoIt" routes to "start" (case-insensitive match with "cantDoiT")', () => {
      const result = computeWhaleResult({
        isMission24Completed: false,
        isMission11Completed: false,
        hasWatertank: false
      })
      // Lingo: if myMarker <> "cantDoiT" then go(myMarker) else go("start")
      // "cantDoIt" == "cantDoiT" case-insensitively → goes to "start"
      expect(result.goTo).toBe('start')
    })

    test('"Done" does NOT match "cantDoiT" → goTo is "Done"', () => {
      const result = computeWhaleResult({
        isMission24Completed: true,
        isMission11Completed: false,
        hasWatertank: false
      })
      expect(result.goTo).toBe('Done')
    })

    test('"JustDoit" does NOT match "cantDoiT" → goTo is "JustDoit"', () => {
      const result = computeWhaleResult({
        isMission24Completed: false,
        isMission11Completed: true,
        hasWatertank: true
      })
      expect(result.goTo).toBe('JustDoit')
    })
  })

  // =========================================================================
  // MARKER CASING - exact match to original Lingo
  // =========================================================================

  describe('marker casing matches original Lingo exactly', () => {
    test('done marker is "Done" (capital D)', () => {
      const result = computeWhaleResult({
        isMission24Completed: true,
        isMission11Completed: false,
        hasWatertank: false
      })
      expect(result.marker).toBe('Done')
      expect(result.marker).not.toBe('done')
      expect(result.marker).not.toBe('DONE')
    })

    test('success marker is "JustDoit" (capital J, capital D, lowercase o-i-t)', () => {
      const result = computeWhaleResult({
        isMission24Completed: false,
        isMission11Completed: true,
        hasWatertank: true
      })
      expect(result.marker).toBe('JustDoit')
      expect(result.marker).not.toBe('JustDoIt')
      expect(result.marker).not.toBe('justdoit')
      expect(result.marker).not.toBe('JUSTDOIT')
    })

    test('failure marker is "cantDoIt" (lowercase c, capital D, capital I, lowercase t)', () => {
      const result = computeWhaleResult({
        isMission24Completed: false,
        isMission11Completed: false,
        hasWatertank: false
      })
      expect(result.marker).toBe('cantDoIt')
      expect(result.marker).not.toBe('cantdoit')
      expect(result.marker).not.toBe('CantDoIt')
      expect(result.marker).not.toBe('cantDoiT')
    })

    test('exported MARKER_DONE is "Done"', () => {
      expect(MARKER_DONE).toBe('Done')
    })

    test('exported MARKER_SUCCESS is "JustDoit"', () => {
      expect(MARKER_SUCCESS).toBe('JustDoit')
    })

    test('exported MARKER_FAILURE is "cantDoIt"', () => {
      expect(MARKER_FAILURE).toBe('cantDoIt')
    })
  })

  // =========================================================================
  // CONSTANTS - mission IDs
  // =========================================================================

  describe('constants match Lingo source', () => {
    test('mission ID is 24 (addCompletedMission 24)', () => {
      expect(MISSION_ID).toBe(24)
    })

    test('prerequisite mission ID is 11 (isMissionCompleted 11)', () => {
      expect(PREREQUISITE_MISSION_ID).toBe(11)
    })
  })

  // =========================================================================
  // RETURN OBJECT SHAPE - consistent structure in all paths
  // =========================================================================

  describe('return object shape is always consistent', () => {
    const allCombinations = [
      { isMission24Completed: true, isMission11Completed: false, hasWatertank: false },
      { isMission24Completed: false, isMission11Completed: true, hasWatertank: true },
      { isMission24Completed: false, isMission11Completed: false, hasWatertank: false },
      { isMission24Completed: false, isMission11Completed: true, hasWatertank: false },
      { isMission24Completed: false, isMission11Completed: false, hasWatertank: true }
    ]

    test.each(allCombinations)(
      'result has marker, goTo, and actions for state %j',
      (state) => {
        const result = computeWhaleResult(state)
        expect(result).toHaveProperty('marker')
        expect(result).toHaveProperty('goTo')
        expect(result).toHaveProperty('actions')
        expect(result.actions).toHaveProperty('completeMission24')
        expect(result.actions).toHaveProperty('giveFishingrod')
      }
    )

    test('all results have exactly the same top-level and action keys', () => {
      const results = allCombinations.map(s => computeWhaleResult(s))
      const firstKeys = Object.keys(results[0]).sort()
      const firstActionKeys = Object.keys(results[0].actions).sort()
      for (const result of results) {
        expect(Object.keys(result).sort()).toEqual(firstKeys)
        expect(Object.keys(result.actions).sort()).toEqual(firstActionKeys)
      }
    })

    test('marker and goTo are always strings', () => {
      for (const state of allCombinations) {
        const result = computeWhaleResult(state)
        expect(typeof result.marker).toBe('string')
        expect(typeof result.goTo).toBe('string')
      }
    })

    test('all action values are always booleans', () => {
      for (const state of allCombinations) {
        const result = computeWhaleResult(state)
        for (const [, value] of Object.entries(result.actions)) {
          expect(typeof value).toBe('boolean')
        }
      }
    })
  })
})
