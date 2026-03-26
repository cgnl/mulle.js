/**
 * Tests for BoatSpawn module
 *
 * IMPORTANT: This is a JS-ONLY convenience module, NOT from original Lingo.
 *
 * The SpawnLines data (from Director member 12 in boten_05.DXR) is used by
 * Waves.ls for WAVE spawning, not boat spawning.
 *
 * Original boat positioning in BoatBase.ls:
 * - Constructor (line ~15): set loc to point(320, 240) * decimalPrec
 * - on load (line ~45): set loc to getaProp(argList, #loc) * decimalPrec
 * - checkBorders handles screen edge transitions, not spawning
 *
 * This module provides JS helper functions to work with the SpawnLines data
 * for potential use cases like entering from different map edges.
 */
import {
  getSpawnLine,
  getSpawnLineForEdge,
  getDirectionFromSpawnLine,
  getAllSpawnLines
} from '../BoatSpawn'
import { SPAWN_LINES, DIRECTION_LIST } from '../BoatConstants'

describe('BoatSpawn (JS-only convenience module)', () => {
  /**
   * Tests that SPAWN_LINES contains the exact data from Director member 12.
   * This data is originally used by Waves.ls for wave spawning.
   * Source: boten_05.DXR member 12 "SpawnLines"
   */
  describe('SPAWN_LINES data from Director member 12', () => {
    it('should contain exactly 16 spawn lines', () => {
      expect(SPAWN_LINES).toHaveLength(16)
    })

    it('should have correct first spawn line (index 0) from member 12', () => {
      // Director member 12: [point(206, 478), point(-92, -38)]
      expect(SPAWN_LINES[0]).toEqual({
        pos: { x: 206, y: 478 },
        dir: { x: -92, y: -38 }
      })
    })

    it('should have correct spawn line at index 3 (west side) from member 12', () => {
      // Director member 12: [point(20, 202), point(0, -100)]
      expect(SPAWN_LINES[3]).toEqual({
        pos: { x: 20, y: 202 },
        dir: { x: 0, y: -100 }
      })
    })

    it('should have correct spawn line at index 7 (north center) from member 12', () => {
      // Director member 12: [point(320, -98), point(100, 0)]
      expect(SPAWN_LINES[7]).toEqual({
        pos: { x: 320, y: -98 },
        dir: { x: 100, y: 0 }
      })
    })

    it('should have correct spawn line at index 11 (east side) from member 12', () => {
      // Director member 12: [point(620, 202), point(0, 100)]
      expect(SPAWN_LINES[11]).toEqual({
        pos: { x: 620, y: 202 },
        dir: { x: 0, y: 100 }
      })
    })

    it('should have correct last spawn line (index 15) from member 12', () => {
      // Director member 12: [point(320, 502), point(-100, 0)]
      expect(SPAWN_LINES[15]).toEqual({
        pos: { x: 320, y: 502 },
        dir: { x: -100, y: 0 }
      })
    })
  })

  /**
   * Tests for getSpawnLine - JS helper to retrieve spawn line by index.
   * This is a convenience wrapper, not from original Lingo.
   */
  describe('getSpawnLine (JS helper)', () => {
    it('should return spawn line for valid index 0', () => {
      const spawn = getSpawnLine(0)
      expect(spawn).toBe(SPAWN_LINES[0])
    })

    it('should return spawn line for valid index 8', () => {
      const spawn = getSpawnLine(8)
      expect(spawn).toBe(SPAWN_LINES[8])
    })

    it('should return first spawn line for negative index (boundary handling)', () => {
      const spawn = getSpawnLine(-1)
      expect(spawn).toBe(SPAWN_LINES[0])
    })

    it('should return first spawn line for out-of-range index (boundary handling)', () => {
      const spawn = getSpawnLine(100)
      expect(spawn).toBe(SPAWN_LINES[0])
    })
  })

  /**
   * Tests for getSpawnLineForEdge - JS helper to get spawn line for map edges.
   * This is entirely invented for JS convenience, not from original Lingo.
   * Original boat positioning uses checkBorders in BoatBase.ls which handles
   * screen edge transitions differently.
   */
  describe('getSpawnLineForEdge (JS helper - invented)', () => {
    it('should return spawn line for south edge', () => {
      const spawn = getSpawnLineForEdge('south')
      // Index 0 is mapped to south in the JS implementation
      expect(spawn).toBe(SPAWN_LINES[0])
    })

    it('should return spawn line for west edge', () => {
      const spawn = getSpawnLineForEdge('west')
      // Index 3 is mapped to west in the JS implementation
      expect(spawn).toBe(SPAWN_LINES[3])
    })

    it('should return spawn line for north edge', () => {
      const spawn = getSpawnLineForEdge('north')
      // Index 7 is mapped to north in the JS implementation
      expect(spawn).toBe(SPAWN_LINES[7])
    })

    it('should return spawn line for east edge', () => {
      const spawn = getSpawnLineForEdge('east')
      // Index 11 is mapped to east in the JS implementation
      expect(spawn).toBe(SPAWN_LINES[11])
    })

    it('should be case-insensitive', () => {
      expect(getSpawnLineForEdge('SOUTH')).toBe(getSpawnLineForEdge('south'))
      expect(getSpawnLineForEdge('North')).toBe(getSpawnLineForEdge('north'))
    })

    it('should return default (index 0) for unknown edge', () => {
      const spawn = getSpawnLineForEdge('unknown')
      expect(spawn).toBe(SPAWN_LINES[0])
    })
  })

  /**
   * Tests for getDirectionFromSpawnLine - JS helper to find closest direction.
   * This matches spawn line direction vectors against DIRECTION_LIST from member 10.
   */
  describe('getDirectionFromSpawnLine (JS helper)', () => {
    it('should return direction 4 (East) for dir {x: 100, y: 0}', () => {
      // DIRECTION_LIST[3] = { x: 100, y: 0 } which is direction 4 (1-indexed)
      const spawn = { pos: { x: 0, y: 0 }, dir: { x: 100, y: 0 } }
      expect(getDirectionFromSpawnLine(spawn)).toBe(4)
    })

    it('should return direction 8 (South) for dir {x: 0, y: 100}', () => {
      // DIRECTION_LIST[7] = { x: 0, y: 100 } which is direction 8 (1-indexed)
      const spawn = { pos: { x: 0, y: 0 }, dir: { x: 0, y: 100 } }
      expect(getDirectionFromSpawnLine(spawn)).toBe(8)
    })

    it('should return direction 12 (West) for dir {x: -100, y: 0}', () => {
      // DIRECTION_LIST[11] = { x: -100, y: 0 } which is direction 12 (1-indexed)
      const spawn = { pos: { x: 0, y: 0 }, dir: { x: -100, y: 0 } }
      expect(getDirectionFromSpawnLine(spawn)).toBe(12)
    })

    it('should return direction 16 (North) for dir {x: 0, y: -100}', () => {
      // DIRECTION_LIST[15] = { x: 0, y: -100 } which is direction 16 (1-indexed)
      const spawn = { pos: { x: 0, y: 0 }, dir: { x: 0, y: -100 } }
      expect(getDirectionFromSpawnLine(spawn)).toBe(16)
    })

    it('should match spawn line 0 direction to closest DIRECTION_LIST entry', () => {
      // SPAWN_LINES[0].dir = { x: -92, y: -38 } matches DIRECTION_LIST[12] = { x: -92, y: -38 }
      const dir = getDirectionFromSpawnLine(SPAWN_LINES[0])
      expect(dir).toBe(13) // Direction 13 (WNW)
    })
  })

  /**
   * Tests for getAllSpawnLines - JS helper to retrieve all spawn lines.
   */
  describe('getAllSpawnLines (JS helper)', () => {
    it('should return the SPAWN_LINES array', () => {
      const all = getAllSpawnLines()
      expect(all).toBe(SPAWN_LINES)
    })

    it('should return array with 16 entries', () => {
      expect(getAllSpawnLines()).toHaveLength(16)
    })
  })
})
