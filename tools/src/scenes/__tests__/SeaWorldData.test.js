/**
 * @fileoverview Tests for SeaWorldData - Sea world grid & tile navigation
 * Based on: Original Lingo sea world from boten_80.DXR / boten_30.DXR
 *
 * The original game has a 10x11 grid of map tiles. Each tile has a background
 * image (30bNNNv0), topology bitmap (30tNNNv0), objects, and special properties.
 * The boat sails in real-time and transitions between tiles at screen edges.
 *
 * Key data:
 * - MapId 52 = boatyard (row 5, col 2) - where you start
 * - MapId 0 = top-left corner (border/land)
 * - "Dummy" MapImage = open water with no unique background
 * - Topology 30t999v0 = default open water (no collision)
 */

const SeaWorldData = require('../SeaWorldData')

describe('SeaWorldData', () => {
  // =========================================================================
  // GRID DIMENSIONS
  // =========================================================================

  describe('GRID', () => {
    test('should be 10 columns wide', () => {
      expect(SeaWorldData.GRID_WIDTH).toBe(10)
    })

    test('should be 11 rows tall', () => {
      expect(SeaWorldData.GRID_HEIGHT).toBe(11)
    })

    test('should have 110 total cells (10x11)', () => {
      expect(SeaWorldData.GRID_WIDTH * SeaWorldData.GRID_HEIGHT).toBe(110)
    })
  })

  // =========================================================================
  // GRID LAYOUT - MapId to grid position mapping
  // =========================================================================

  describe('getGridPosition', () => {
    test('MapId 0 should be at row 0, col 0 (top-left)', () => {
      expect(SeaWorldData.getGridPosition(0)).toEqual({ row: 0, col: 0 })
    })

    test('MapId 9 should be at row 0, col 9 (top-right)', () => {
      expect(SeaWorldData.getGridPosition(9)).toEqual({ row: 0, col: 9 })
    })

    test('MapId 10 should be at row 1, col 0 (second row start)', () => {
      expect(SeaWorldData.getGridPosition(10)).toEqual({ row: 1, col: 0 })
    })

    test('MapId 52 (boatyard) should be at row 5, col 2', () => {
      expect(SeaWorldData.getGridPosition(52)).toEqual({ row: 5, col: 2 })
    })

    test('MapId 109 should be at row 10, col 9 (bottom-right)', () => {
      expect(SeaWorldData.getGridPosition(109)).toEqual({ row: 10, col: 9 })
    })
  })

  describe('getMapId', () => {
    test('row 0, col 0 should give MapId 0', () => {
      expect(SeaWorldData.getMapId(0, 0)).toBe(0)
    })

    test('row 5, col 2 should give MapId 52 (boatyard)', () => {
      expect(SeaWorldData.getMapId(5, 2)).toBe(52)
    })

    test('row 10, col 9 should give MapId 109', () => {
      expect(SeaWorldData.getMapId(10, 9)).toBe(109)
    })

    test('should be inverse of getGridPosition', () => {
      for (let mid = 0; mid < 110; mid++) {
        const pos = SeaWorldData.getGridPosition(mid)
        expect(SeaWorldData.getMapId(pos.row, pos.col)).toBe(mid)
      }
    })
  })

  // =========================================================================
  // START POSITION
  // =========================================================================

  describe('START', () => {
    test('should start at MapId 52 (boatyard)', () => {
      expect(SeaWorldData.START_MAP_ID).toBe(52)
    })

    test('start grid position should be row 5, col 2', () => {
      const pos = SeaWorldData.getGridPosition(SeaWorldData.START_MAP_ID)
      expect(pos).toEqual({ row: 5, col: 2 })
    })

    test('start coordinate should match world definition (boatyard dock)', () => {
      expect(SeaWorldData.START_COORDINATE).toEqual({ x: 520, y: 190 })
    })

    test('start direction should be valid (1-16)', () => {
      expect(SeaWorldData.START_DIRECTION).toBeGreaterThanOrEqual(1)
      expect(SeaWorldData.START_DIRECTION).toBeLessThanOrEqual(16)
    })
  })

  // =========================================================================
  // TILE DATA
  // =========================================================================

  describe('getTile', () => {
    test('should return tile data for MapId 52 (boatyard)', () => {
      const tile = SeaWorldData.getTile(52)
      expect(tile).toBeDefined()
      expect(tile.MapId).toBe(52)
      expect(tile.MapImage).toBe('30b029v0')
      expect(tile.Topology).toBe('30t029v0')
    })

    test('should return tile data for MapId 0 (top-left border)', () => {
      const tile = SeaWorldData.getTile(0)
      expect(tile).toBeDefined()
      expect(tile.MapImage).toBe('Dummy')
    })

    test('should return null for non-existent MapId (1, 4, 41, 71)', () => {
      expect(SeaWorldData.getTile(1)).toBeNull()
      expect(SeaWorldData.getTile(4)).toBeNull()
      expect(SeaWorldData.getTile(41)).toBeNull()
      expect(SeaWorldData.getTile(71)).toBeNull()
    })

    test('should return null for out-of-range MapId', () => {
      expect(SeaWorldData.getTile(-1)).toBeNull()
      expect(SeaWorldData.getTile(111)).toBeNull()
    })

    test('boatyard tile should have object 3 (boatyard entrance)', () => {
      const tile = SeaWorldData.getTile(52)
      const boatyardObj = tile.objects.find(o => o[0] === 3)
      expect(boatyardObj).toBeDefined()
    })
  })

  // =========================================================================
  // TILE BACKGROUNDS
  // =========================================================================

  describe('tile backgrounds', () => {
    test('non-Dummy tiles should have 30bNNNv0 MapImage format', () => {
      for (let mid = 0; mid < 110; mid++) {
        const tile = SeaWorldData.getTile(mid)
        if (!tile) continue
        if (tile.MapImage !== 'Dummy') {
          expect(tile.MapImage).toMatch(/^30b\d{3}v0$/)
        }
      }
    })

    test('non-Dummy tiles should have matching Topology 30tNNNv0', () => {
      for (let mid = 0; mid < 110; mid++) {
        const tile = SeaWorldData.getTile(mid)
        if (!tile) continue
        if (tile.MapImage !== 'Dummy' && tile.Topology !== '30t999v0') {
          // Extract number from MapImage and Topology, they should match
          const imgNum = tile.MapImage.match(/30b(\d{3})v0/)
          const topoNum = tile.Topology.match(/30t(\d{3})v0/)
          if (imgNum && topoNum) {
            expect(topoNum[1]).toBe(imgNum[1])
          }
        }
      }
    })

    test('Dummy tiles should exist (open water)', () => {
      const dummyTiles = []
      for (let mid = 0; mid < 110; mid++) {
        const tile = SeaWorldData.getTile(mid)
        if (tile && tile.MapImage === 'Dummy') {
          dummyTiles.push(mid)
        }
      }
      expect(dummyTiles.length).toBeGreaterThan(20)
    })
  })

  // =========================================================================
  // NEIGHBOR / NAVIGATION
  // =========================================================================

  describe('getNeighbor', () => {
    test('north of MapId 52 should be MapId 42', () => {
      expect(SeaWorldData.getNeighbor(52, 'north')).toBe(42)
    })

    test('south of MapId 52 should be MapId 62', () => {
      expect(SeaWorldData.getNeighbor(52, 'south')).toBe(62)
    })

    test('east of MapId 52 should be MapId 53', () => {
      expect(SeaWorldData.getNeighbor(52, 'east')).toBe(53)
    })

    test('west of MapId 52 should be MapId 51', () => {
      expect(SeaWorldData.getNeighbor(52, 'west')).toBe(51)
    })

    test('north of row 0 tiles should return null (grid edge)', () => {
      expect(SeaWorldData.getNeighbor(0, 'north')).toBeNull()
      expect(SeaWorldData.getNeighbor(5, 'north')).toBeNull()
    })

    test('south of row 10 tiles should return null (grid edge)', () => {
      expect(SeaWorldData.getNeighbor(100, 'south')).toBeNull()
      expect(SeaWorldData.getNeighbor(109, 'south')).toBeNull()
    })

    test('west of col 0 tiles should return null (grid edge)', () => {
      expect(SeaWorldData.getNeighbor(0, 'west')).toBeNull()
      expect(SeaWorldData.getNeighbor(50, 'west')).toBeNull()
    })

    test('east of col 9 tiles should return null (grid edge)', () => {
      expect(SeaWorldData.getNeighbor(9, 'east')).toBeNull()
      expect(SeaWorldData.getNeighbor(59, 'east')).toBeNull()
    })

    test('should handle missing tiles (MapId 1 neighbor)', () => {
      // MapId 1 doesn't exist, but getNeighbor(0, 'east') should still return 1
      // (the MapId exists conceptually even if the tile data is missing)
      expect(SeaWorldData.getNeighbor(0, 'east')).toBe(1)
    })
  })

  // =========================================================================
  // WIND SPEED per tile
  // =========================================================================

  describe('getWindSpeed', () => {
    test('boatyard area (MapId 52) should be calm (wind 0 or null)', () => {
      const wind = SeaWorldData.getWindSpeed(52)
      expect(wind).toBeFalsy()
    })

    test('open sea tiles should have wind', () => {
      // MapId 47 has #Full wind
      expect(SeaWorldData.getWindSpeed(47)).toBe('#Full')
    })

    test('coastal tiles should have moderate wind', () => {
      // MapId 14 has #1 wind
      expect(SeaWorldData.getWindSpeed(14)).toBe('#1')
    })
  })

  // =========================================================================
  // SPECIAL PROPERTIES
  // =========================================================================

  describe('getSpecial', () => {
    test('MapId 19 should have Fog', () => {
      const special = SeaWorldData.getSpecial(19)
      expect(special).toBeDefined()
      expect(special['#Fog']).toBe(true)
    })

    test('MapId 19 should have FreeZone', () => {
      const special = SeaWorldData.getSpecial(19)
      expect(special['#FreeZone']).toBe(true)
    })
  })

  // =========================================================================
  // GRID ROW/COL LAYOUT (the full 10x11 grid)
  // =========================================================================

  describe('GRID_LAYOUT', () => {
    test('should have 11 rows', () => {
      expect(SeaWorldData.GRID_LAYOUT).toHaveLength(11)
    })

    test('each row should have 10 columns', () => {
      for (const row of SeaWorldData.GRID_LAYOUT) {
        expect(row).toHaveLength(10)
      }
    })

    test('row 0 should start with MapId 0', () => {
      expect(SeaWorldData.GRID_LAYOUT[0][0]).toBe(0)
    })

    test('row 5, col 2 should be MapId 52 (boatyard)', () => {
      expect(SeaWorldData.GRID_LAYOUT[5][2]).toBe(52)
    })

    test('missing tiles should still have their MapId in the grid', () => {
      // MapId 1 is missing from sea_maps.hash.json but should still be in the grid
      expect(SeaWorldData.GRID_LAYOUT[0][1]).toBe(1)
    })
  })

  // =========================================================================
  // SPAWN POSITIONS (when transitioning between tiles)
  // =========================================================================

  describe('getSpawnPosition', () => {
    test('entering from south should spawn at top of screen', () => {
      const pos = SeaWorldData.getSpawnPosition('north')
      expect(pos.y).toBeLessThan(50)
      expect(pos.x).toBeGreaterThan(100)
      expect(pos.x).toBeLessThan(540)
    })

    test('entering from north should spawn at bottom of screen', () => {
      const pos = SeaWorldData.getSpawnPosition('south')
      expect(pos.y).toBeGreaterThan(430)
    })

    test('entering from east should spawn at left of screen', () => {
      const pos = SeaWorldData.getSpawnPosition('west')
      expect(pos.x).toBeLessThan(50)
    })

    test('entering from west should spawn at right of screen', () => {
      const pos = SeaWorldData.getSpawnPosition('east')
      expect(pos.x).toBeGreaterThan(590)
    })
  })

  // =========================================================================
  // BORDER DETECTION
  // =========================================================================

  describe('checkBorder', () => {
    test('position at top edge should return north', () => {
      expect(SeaWorldData.checkBorder(320, 2)).toBe('north')
    })

    test('position at bottom edge should return south', () => {
      expect(SeaWorldData.checkBorder(320, 478)).toBe('south')
    })

    test('position at left edge should return west', () => {
      expect(SeaWorldData.checkBorder(2, 240)).toBe('west')
    })

    test('position at right edge should return east', () => {
      expect(SeaWorldData.checkBorder(638, 240)).toBe('east')
    })

    test('position in center should return null', () => {
      expect(SeaWorldData.checkBorder(320, 240)).toBeNull()
    })

    test('border threshold should be ~4 pixels', () => {
      expect(SeaWorldData.checkBorder(320, 5)).toBeNull() // just inside
      expect(SeaWorldData.checkBorder(320, 3)).toBe('north') // at border
    })
  })

  // =========================================================================
  // TOTAL TILE COUNT
  // =========================================================================

  describe('tile statistics', () => {
    test('should have ~85 defined tiles', () => {
      let count = 0
      for (let mid = 0; mid < 110; mid++) {
        if (SeaWorldData.getTile(mid)) count++
      }
      // From the data: 106 tiles exist (4 missing: 1, 4, 41, 71)
      expect(count).toBeGreaterThanOrEqual(105)
      expect(count).toBeLessThanOrEqual(107)
    })
  })
})
