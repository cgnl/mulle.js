/**
 * Tests for BoatConstants module
 *
 * These tests validate EXACT values from the original Lingo sources:
 * - DirectionList: boten_05.DXR member 10
 * - AmplitudeList: boten_05.DXR member 11
 * - SpawnLines: boten_05.DXR member 12
 * - decimalPrec: BoatBase.ls constructor (set decimalPrec to 100)
 * - Topology dimensions: DepthChecker.ls
 *
 * NOTE: SEA_TERRAIN and PropulsionType.NONE are INVENTED concepts not in the original Lingo.
 * The original uses symbols #Motor, #Sail, #Oar directly without a NONE type.
 */
import {
  DIRECTION_LIST,
  AMPLITUDE_LIST,
  SPAWN_LINES,
  TOPOLOGY
} from '../BoatConstants'

/**
 * Exact DirectionList from boten_05.DXR member 10
 * Original Lingo: [point(38, -92), point(70, -70), ...]
 */
const EXPECTED_DIRECTION_LIST = [
  { x: 38, y: -92 },
  { x: 70, y: -70 },
  { x: 92, y: -38 },
  { x: 100, y: 0 },
  { x: 92, y: 38 },
  { x: 70, y: 70 },
  { x: 38, y: 92 },
  { x: 0, y: 100 },
  { x: -38, y: 92 },
  { x: -70, y: 70 },
  { x: -92, y: 38 },
  { x: -100, y: 0 },
  { x: -92, y: -38 },
  { x: -70, y: -70 },
  { x: -38, y: -92 },
  { x: 0, y: -100 }
]

/**
 * Exact AmplitudeList from boten_05.DXR member 11
 * 100 sine wave values from the original Director member
 */
const EXPECTED_AMPLITUDE_LIST = [
  6, 13, 19, 25, 31, 37, 43, 48, 54, 59, 64, 68, 73, 77, 81, 84, 88, 90, 93, 95,
  97, 98, 99, 100, 100, 100, 99, 98, 97, 95, 93, 90, 88, 84, 81, 77, 73, 68, 64, 59,
  54, 48, 43, 37, 31, 25, 19, 13, 6, 0, -6, -13, -19, -25, -31, -37, -43, -48, -54, -59,
  -64, -68, -73, -77, -81, -84, -88, -90, -93, -95, -97, -98, -99, -100, -100, -100, -99, -98, -97, -95,
  -93, -90, -88, -84, -81, -77, -73, -68, -64, -59, -54, -48, -43, -37, -31, -25, -19, -13, -6, 0
]

/**
 * Exact SpawnLines from boten_05.DXR member 12
 * 16 spawn positions with direction vectors
 */
const EXPECTED_SPAWN_LINES = [
  { pos: { x: 206, y: 478 }, dir: { x: -92, y: -38 } },
  { pos: { x: 110, y: 412 }, dir: { x: -70, y: -70 } },
  { pos: { x: 44, y: 316 }, dir: { x: -38, y: -92 } },
  { pos: { x: 20, y: 202 }, dir: { x: 0, y: -100 } },
  { pos: { x: 44, y: 88 }, dir: { x: 38, y: -92 } },
  { pos: { x: 110, y: -8 }, dir: { x: 70, y: -70 } },
  { pos: { x: 206, y: -74 }, dir: { x: 92, y: -38 } },
  { pos: { x: 320, y: -98 }, dir: { x: 100, y: 0 } },
  { pos: { x: 434, y: -74 }, dir: { x: 92, y: 38 } },
  { pos: { x: 530, y: -8 }, dir: { x: 70, y: 70 } },
  { pos: { x: 596, y: 88 }, dir: { x: 38, y: 92 } },
  { pos: { x: 620, y: 202 }, dir: { x: 0, y: 100 } },
  { pos: { x: 596, y: 316 }, dir: { x: -38, y: 92 } },
  { pos: { x: 530, y: 412 }, dir: { x: -70, y: 70 } },
  { pos: { x: 434, y: 478 }, dir: { x: -92, y: 38 } },
  { pos: { x: 320, y: 502 }, dir: { x: -100, y: 0 } }
]

describe('BoatConstants', () => {
  describe('DIRECTION_LIST (boten_05.DXR member 10)', () => {
    it('should have exactly 16 directions', () => {
      expect(DIRECTION_LIST).toHaveLength(16)
    })

    it('should match EXACT values from Director member 10', () => {
      expect(DIRECTION_LIST).toEqual(EXPECTED_DIRECTION_LIST)
    })

    it('should have direction 1 (index 0) = point(38, -92) for NNE', () => {
      expect(DIRECTION_LIST[0]).toEqual({ x: 38, y: -92 })
    })

    it('should have direction 4 (index 3) = point(100, 0) for East', () => {
      expect(DIRECTION_LIST[3]).toEqual({ x: 100, y: 0 })
    })

    it('should have direction 8 (index 7) = point(0, 100) for South', () => {
      expect(DIRECTION_LIST[7]).toEqual({ x: 0, y: 100 })
    })

    it('should have direction 12 (index 11) = point(-100, 0) for West', () => {
      expect(DIRECTION_LIST[11]).toEqual({ x: -100, y: 0 })
    })

    it('should have direction 16 (index 15) = point(0, -100) for North', () => {
      expect(DIRECTION_LIST[15]).toEqual({ x: 0, y: -100 })
    })
  })

  describe('AMPLITUDE_LIST (boten_05.DXR member 11)', () => {
    it('should have exactly 100 values', () => {
      expect(AMPLITUDE_LIST).toHaveLength(100)
    })

    it('should match EXACT values from Director member 11', () => {
      expect(AMPLITUDE_LIST).toEqual(EXPECTED_AMPLITUDE_LIST)
    })

    it('should start with value 6 at index 0', () => {
      expect(AMPLITUDE_LIST[0]).toBe(6)
    })

    it('should have value 0 at index 49 (midpoint)', () => {
      expect(AMPLITUDE_LIST[49]).toBe(0)
    })

    it('should end with value 0 at index 99', () => {
      expect(AMPLITUDE_LIST[99]).toBe(0)
    })

    it('should have peak value 100 at indices 23, 24, 25', () => {
      expect(AMPLITUDE_LIST[23]).toBe(100)
      expect(AMPLITUDE_LIST[24]).toBe(100)
      expect(AMPLITUDE_LIST[25]).toBe(100)
    })

    it('should have trough value -100 at indices 73, 74, 75', () => {
      expect(AMPLITUDE_LIST[73]).toBe(-100)
      expect(AMPLITUDE_LIST[74]).toBe(-100)
      expect(AMPLITUDE_LIST[75]).toBe(-100)
    })
  })

  describe('SPAWN_LINES (boten_05.DXR member 12)', () => {
    it('should have exactly 16 spawn lines', () => {
      expect(SPAWN_LINES).toHaveLength(16)
    })

    it('should match EXACT values from Director member 12', () => {
      expect(SPAWN_LINES).toEqual(EXPECTED_SPAWN_LINES)
    })

    it('should have spawn line 1 at pos(206, 478) with dir(-92, -38)', () => {
      expect(SPAWN_LINES[0]).toEqual({
        pos: { x: 206, y: 478 },
        dir: { x: -92, y: -38 }
      })
    })

    it('should have spawn line 8 at pos(320, -98) with dir(100, 0)', () => {
      expect(SPAWN_LINES[7]).toEqual({
        pos: { x: 320, y: -98 },
        dir: { x: 100, y: 0 }
      })
    })

    it('should have spawn line 16 at pos(320, 502) with dir(-100, 0)', () => {
      expect(SPAWN_LINES[15]).toEqual({
        pos: { x: 320, y: 502 },
        dir: { x: -100, y: 0 }
      })
    })
  })

  describe('TOPOLOGY (from DepthChecker.ls)', () => {
    it('should have WIDTH of 316', () => {
      expect(TOPOLOGY.WIDTH).toBe(316)
    })

    it('should have HEIGHT of 198', () => {
      expect(TOPOLOGY.HEIGHT).toBe(198)
    })
  })
})
