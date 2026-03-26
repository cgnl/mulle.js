/**
 * @fileoverview Tests for FishermanData - Fisherman scene (scene 79)
 * Based on: decompiled_lingo/79/79/casts/Internal/ParentScript 4 - Dir.ls
 *
 * The Fisherman is the simplest destination scene. Binary check:
 * has fuel item -> success path, doesn't have -> failure path.
 *
 * Original Lingo (startMovie):
 *   if isInInventory(the user of gMulleGlobals, tmpStuffNeeded) then
 *     addCompletedMission(the user of gMulleGlobals, 17)
 *     deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
 *     set myMarker to "JustdoIt"
 *     set tmp to getDrivingInfo(the user of gMulleGlobals)
 *     setaProp(tmp, #fuel, #Full)
 *     setDrivingInfo(the user of gMulleGlobals, tmp)
 *     setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
 *   else
 *     set myMarker to "cantdoIT"
 *   end if
 */

const {
  computeFishermanResult,
  MARKER_SUCCESS,
  MARKER_FAILURE,
  MISSION_ID,
  BELLY_AMOUNT,
  FUEL_LEVEL
} = require('../FishermanData')

describe('FishermanData', () => {
  // =========================================================================
  // SUCCESS PATH - has required fuel item
  // =========================================================================

  describe('when player has the required item', () => {
    const result = computeFishermanResult({ hasRequiredItem: true })

    test('marker should be "JustdoIt"', () => {
      expect(result.marker).toBe('JustdoIt')
    })

    test('should complete mission 17', () => {
      expect(result.actions.completeMission17).toBe(true)
    })

    test('should delete the fuel item from inventory', () => {
      expect(result.actions.deleteItem).toBe(true)
    })

    test('should refuel boat to Full', () => {
      expect(result.actions.refuelToFull).toBe(true)
    })

    test('should give Belly item', () => {
      expect(result.actions.giveBelly).toBe(true)
    })
  })

  // =========================================================================
  // FAILURE PATH - does not have required fuel item
  // =========================================================================

  describe('when player does NOT have the required item', () => {
    const result = computeFishermanResult({ hasRequiredItem: false })

    test('marker should be "cantdoIT"', () => {
      expect(result.marker).toBe('cantdoIT')
    })

    test('should NOT complete mission 17', () => {
      expect(result.actions.completeMission17).toBe(false)
    })

    test('should NOT delete any item', () => {
      expect(result.actions.deleteItem).toBe(false)
    })

    test('should NOT refuel boat', () => {
      expect(result.actions.refuelToFull).toBe(false)
    })

    test('should NOT give Belly', () => {
      expect(result.actions.giveBelly).toBe(false)
    })
  })

  // =========================================================================
  // MARKER CASING - exact match to original Lingo
  // =========================================================================

  describe('marker casing matches original Lingo exactly', () => {
    test('success marker "JustdoIt" has capital J, lowercase d-o, capital I, lowercase t', () => {
      const result = computeFishermanResult({ hasRequiredItem: true })
      expect(result.marker).toBe('JustdoIt')
      // Verify it's NOT any other casing
      expect(result.marker).not.toBe('JustDoIt')
      expect(result.marker).not.toBe('justdoit')
      expect(result.marker).not.toBe('JUSTDOIT')
    })

    test('failure marker "cantdoIT" has lowercase c-a-n-t-d-o, capital I-T', () => {
      const result = computeFishermanResult({ hasRequiredItem: false })
      expect(result.marker).toBe('cantdoIT')
      // Verify it's NOT any other casing
      expect(result.marker).not.toBe('CantDoIt')
      expect(result.marker).not.toBe('cantdoit')
      expect(result.marker).not.toBe('CANTDOIT')
    })

    test('exported MARKER_SUCCESS constant is "JustdoIt"', () => {
      expect(MARKER_SUCCESS).toBe('JustdoIt')
    })

    test('exported MARKER_FAILURE constant is "cantdoIT"', () => {
      expect(MARKER_FAILURE).toBe('cantdoIT')
    })
  })

  // =========================================================================
  // CONSTANTS - mission, belly, fuel
  // =========================================================================

  describe('constants match Lingo source', () => {
    test('mission ID is 17 (addCompletedMission 17)', () => {
      expect(MISSION_ID).toBe(17)
    })

    test('Belly amount is 1000 ([#nr: 1000])', () => {
      expect(BELLY_AMOUNT).toBe(1000)
    })

    test('fuel level is "Full" (Lingo #Full symbol)', () => {
      expect(FUEL_LEVEL).toBe('Full')
    })
  })

  // =========================================================================
  // MISSION 17 - always completed on success (no gate on mission-given)
  // =========================================================================

  describe('mission 17 completion', () => {
    test('mission 17 is completed on success with no prerequisite check', () => {
      // The Lingo does NOT check if mission 17 was "given" first.
      // It unconditionally calls addCompletedMission(17) on success.
      const result = computeFishermanResult({ hasRequiredItem: true })
      expect(result.actions.completeMission17).toBe(true)
    })

    test('mission 17 is NOT completed on failure', () => {
      const result = computeFishermanResult({ hasRequiredItem: false })
      expect(result.actions.completeMission17).toBe(false)
    })
  })

  // =========================================================================
  // RETURN OBJECT SHAPE - consistent structure in both paths
  // =========================================================================

  describe('return object shape is always consistent', () => {
    test('success result has all required keys', () => {
      const result = computeFishermanResult({ hasRequiredItem: true })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(result.actions).toHaveProperty('completeMission17')
      expect(result.actions).toHaveProperty('deleteItem')
      expect(result.actions).toHaveProperty('refuelToFull')
      expect(result.actions).toHaveProperty('giveBelly')
    })

    test('failure result has all required keys', () => {
      const result = computeFishermanResult({ hasRequiredItem: false })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(result.actions).toHaveProperty('completeMission17')
      expect(result.actions).toHaveProperty('deleteItem')
      expect(result.actions).toHaveProperty('refuelToFull')
      expect(result.actions).toHaveProperty('giveBelly')
    })

    test('both results have exactly the same keys', () => {
      const success = computeFishermanResult({ hasRequiredItem: true })
      const failure = computeFishermanResult({ hasRequiredItem: false })
      expect(Object.keys(success)).toEqual(Object.keys(failure))
      expect(Object.keys(success.actions).sort()).toEqual(Object.keys(failure.actions).sort())
    })

    test('marker is always a string', () => {
      expect(typeof computeFishermanResult({ hasRequiredItem: true }).marker).toBe('string')
      expect(typeof computeFishermanResult({ hasRequiredItem: false }).marker).toBe('string')
    })

    test('all action values are always booleans', () => {
      for (const hasItem of [true, false]) {
        const result = computeFishermanResult({ hasRequiredItem: hasItem })
        for (const [key, value] of Object.entries(result.actions)) {
          expect(typeof value).toBe('boolean')
        }
      }
    })
  })
})
