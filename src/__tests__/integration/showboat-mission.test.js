/**
 * Integration test: ShowBoat scene + computeShowBoatResult
 *
 * Verifies that the ShowBoat scene correctly maps FunnyFactor values to
 * markers, ratings, and medals using the nested-if structure from Lingo.
 *
 * Logic from scene 76 (decompiled Lingo):
 *   funnyFactor > 25 -> 'five',  medal=4
 *   funnyFactor > 20 -> 'four',  medal=null
 *   funnyFactor > 10 -> 'three', medal=null
 *   funnyFactor > 4  -> 'two',   medal=null
 *   funnyFactor <= 4 -> 'one',   medal=null
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const ShowBoatData = require('../../scenes/ShowBoatData')
const { computeShowBoatResult } = ShowBoatData

// ---------------------------------------------------------------------------
// Spy on computeShowBoatResult
// ---------------------------------------------------------------------------
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(ShowBoatData, 'computeShowBoatResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeShowBoatResult with FunnyFactor values
// ===========================================================================

describe('ShowBoat mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. funnyFactor=0 -> 'one', rating=1, medal=null
  // -----------------------------------------------------------------------
  describe('funnyFactor=0 (lowest)', () => {
    test('marker is "one"', () => {
      const result = computeShowBoatResult(0)
      expect(result.marker).toBe('one')
    })

    test('rating is 1', () => {
      const result = computeShowBoatResult(0)
      expect(result.rating).toBe(1)
    })

    test('medal is null', () => {
      const result = computeShowBoatResult(0)
      expect(result.medal).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 2. funnyFactor=4 -> 'one' (not > 4)
  // -----------------------------------------------------------------------
  describe('funnyFactor=4 (boundary, not > 4)', () => {
    test('marker is "one"', () => {
      const result = computeShowBoatResult(4)
      expect(result.marker).toBe('one')
    })

    test('rating is 1', () => {
      const result = computeShowBoatResult(4)
      expect(result.rating).toBe(1)
    })

    test('medal is null', () => {
      const result = computeShowBoatResult(4)
      expect(result.medal).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 3. funnyFactor=5 -> 'two', rating=2
  // -----------------------------------------------------------------------
  describe('funnyFactor=5 (just above 4)', () => {
    test('marker is "two"', () => {
      const result = computeShowBoatResult(5)
      expect(result.marker).toBe('two')
    })

    test('rating is 2', () => {
      const result = computeShowBoatResult(5)
      expect(result.rating).toBe(2)
    })

    test('medal is null', () => {
      const result = computeShowBoatResult(5)
      expect(result.medal).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 4. funnyFactor=10 -> 'two' (not > 10)
  // -----------------------------------------------------------------------
  describe('funnyFactor=10 (boundary, not > 10)', () => {
    test('marker is "two"', () => {
      const result = computeShowBoatResult(10)
      expect(result.marker).toBe('two')
    })

    test('rating is 2', () => {
      const result = computeShowBoatResult(10)
      expect(result.rating).toBe(2)
    })
  })

  // -----------------------------------------------------------------------
  // 5. funnyFactor=11 -> 'three', rating=3
  // -----------------------------------------------------------------------
  describe('funnyFactor=11 (just above 10)', () => {
    test('marker is "three"', () => {
      const result = computeShowBoatResult(11)
      expect(result.marker).toBe('three')
    })

    test('rating is 3', () => {
      const result = computeShowBoatResult(11)
      expect(result.rating).toBe(3)
    })

    test('medal is null', () => {
      const result = computeShowBoatResult(11)
      expect(result.medal).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 6. funnyFactor=20 -> 'three' (not > 20)
  // -----------------------------------------------------------------------
  describe('funnyFactor=20 (boundary, not > 20)', () => {
    test('marker is "three"', () => {
      const result = computeShowBoatResult(20)
      expect(result.marker).toBe('three')
    })

    test('rating is 3', () => {
      const result = computeShowBoatResult(20)
      expect(result.rating).toBe(3)
    })
  })

  // -----------------------------------------------------------------------
  // 7. funnyFactor=21 -> 'four', rating=4
  // -----------------------------------------------------------------------
  describe('funnyFactor=21 (just above 20)', () => {
    test('marker is "four"', () => {
      const result = computeShowBoatResult(21)
      expect(result.marker).toBe('four')
    })

    test('rating is 4', () => {
      const result = computeShowBoatResult(21)
      expect(result.rating).toBe(4)
    })

    test('medal is null', () => {
      const result = computeShowBoatResult(21)
      expect(result.medal).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 8. funnyFactor=25 -> 'four' (not > 25)
  // -----------------------------------------------------------------------
  describe('funnyFactor=25 (boundary, not > 25)', () => {
    test('marker is "four"', () => {
      const result = computeShowBoatResult(25)
      expect(result.marker).toBe('four')
    })

    test('rating is 4', () => {
      const result = computeShowBoatResult(25)
      expect(result.rating).toBe(4)
    })

    test('medal is null', () => {
      const result = computeShowBoatResult(25)
      expect(result.medal).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 9. funnyFactor=26 -> 'five', rating=5, medal=4
  // -----------------------------------------------------------------------
  describe('funnyFactor=26 (just above 25)', () => {
    test('marker is "five"', () => {
      const result = computeShowBoatResult(26)
      expect(result.marker).toBe('five')
    })

    test('rating is 5', () => {
      const result = computeShowBoatResult(26)
      expect(result.rating).toBe(5)
    })

    test('medal is 4', () => {
      const result = computeShowBoatResult(26)
      expect(result.medal).toBe(4)
    })
  })

  // -----------------------------------------------------------------------
  // 10. funnyFactor=100 -> 'five', medal=4
  // -----------------------------------------------------------------------
  describe('funnyFactor=100 (very high)', () => {
    test('marker is "five"', () => {
      const result = computeShowBoatResult(100)
      expect(result.marker).toBe('five')
    })

    test('medal is 4', () => {
      const result = computeShowBoatResult(100)
      expect(result.medal).toBe(4)
    })
  })

  // -----------------------------------------------------------------------
  // 11. Boundary: exactly at each threshold (strict >)
  // -----------------------------------------------------------------------
  describe('Boundary: strict greater-than at each threshold', () => {
    test('exactly 4 -> "one" (not "two")', () => {
      expect(computeShowBoatResult(4).marker).toBe('one')
    })

    test('exactly 10 -> "two" (not "three")', () => {
      expect(computeShowBoatResult(10).marker).toBe('two')
    })

    test('exactly 20 -> "three" (not "four")', () => {
      expect(computeShowBoatResult(20).marker).toBe('three')
    })

    test('exactly 25 -> "four" (not "five")', () => {
      expect(computeShowBoatResult(25).marker).toBe('four')
    })

    test('medal only awarded above 25', () => {
      expect(computeShowBoatResult(25).medal).toBeNull()
      expect(computeShowBoatResult(26).medal).toBe(4)
    })
  })

  // -----------------------------------------------------------------------
  // 12. Export verification
  // -----------------------------------------------------------------------
  describe('ShowBoatData exports', () => {
    test('MISSION_ID is 6', () => {
      expect(ShowBoatData.MISSION_ID).toBe(6)
    })

    test('exports computeShowBoatResult as a function', () => {
      expect(typeof ShowBoatData.computeShowBoatResult).toBe('function')
    })
  })
})
