/**
 * @fileoverview SeaWorldData - Pure data module for sea world grid & tile navigation
 * Based on: Original Lingo sea world from boten_80.DXR / boten_30.DXR
 *
 * The original game "Bygg båtar med Mulle Meck" uses a 10x11 grid of map tiles
 * for the sea navigation. Each tile is 640x480 pixels. The boat sails in real-time
 * and transitions between tiles when reaching the screen edge.
 *
 * Data source: tools/data/sea_maps.hash.json (extracted from Director binary)
 *
 * Grid layout: row-major, MapId = row * 10 + col
 * - Row 0 = northernmost row (mostly border/land)
 * - Row 10 = southernmost row
 * - Col 0 = westernmost column
 * - Col 9 = easternmost column
 *
 * MapId 52 (row 5, col 2) = boatyard - where the player starts
 */

'use strict'

// Load the extracted sea maps data
const SEA_MAPS = require('../../data/sea_maps.hash.json')

// ============================================================================
// GRID CONSTANTS
// ============================================================================

const GRID_WIDTH = 10
const GRID_HEIGHT = 11

// Border detection threshold (pixels from screen edge)
const BORDER_THRESHOLD = 4

// Screen dimensions
const SCREEN_WIDTH = 640
const SCREEN_HEIGHT = 480

// Start position (boatyard)
const START_MAP_ID = 52
// Start coordinate/direction from boten_CDDATA.CXT world definition (1942.txt)
// StartMap: point(2, 6) => MapId 52 (boatyard/scheepswerf)
// StartCoordinate: point(520, 190), StartDirection: 4
const START_COORDINATE = { x: 520, y: 190 }
const START_DIRECTION = 4 // East (towards open water from boatyard)

// ============================================================================
// GRID LAYOUT - 10x11 array of MapIds
// ============================================================================

// Build the full 10x11 grid. Every cell has a MapId even if that tile
// is not defined in sea_maps.hash.json (those are impassable border cells).
const GRID_LAYOUT = []
for (let row = 0; row < GRID_HEIGHT; row++) {
  const rowData = []
  for (let col = 0; col < GRID_WIDTH; col++) {
    rowData.push(row * GRID_WIDTH + col)
  }
  GRID_LAYOUT.push(rowData)
}

// ============================================================================
// SPAWN POSITIONS - where the boat appears when entering a tile
// ============================================================================

// When you sail off the north edge, you appear at the south edge of the tile above.
// The "direction" parameter is the edge you're entering FROM (opposite of travel direction).
const SPAWN_POSITIONS = {
  // Entering from north edge (boat sailed south into this tile, spawns at top)
  north: { x: 320, y: 12 },
  // Entering from south edge (boat sailed north, spawns at bottom)
  south: { x: 320, y: 468 },
  // Entering from west edge (boat sailed east, spawns at left)
  west: { x: 12, y: 240 },
  // Entering from east edge (boat sailed west, spawns at right)
  east: { x: 628, y: 240 }
}

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Convert MapId to grid position (row, col)
 * @param {number} mapId - MapId (0-109)
 * @returns {{ row: number, col: number }}
 */
function getGridPosition (mapId) {
  return {
    row: Math.floor(mapId / GRID_WIDTH),
    col: mapId % GRID_WIDTH
  }
}

/**
 * Convert grid position to MapId
 * @param {number} row - Grid row (0-10)
 * @param {number} col - Grid column (0-9)
 * @returns {number} MapId
 */
function getMapId (row, col) {
  return row * GRID_WIDTH + col
}

/**
 * Convert MapId to sea-world grid point (1-based, used by MulleSeaWorld)
 * @param {number} mapId - MapId (0-109)
 * @returns {{ x: number, y: number }}
 */
function getWorldPoint (mapId) {
  const pos = getGridPosition(mapId)
  return { x: pos.col + 1, y: pos.row + 1 }
}

/**
 * Get tile data for a MapId from sea_maps.hash.json
 * @param {number} mapId - MapId
 * @returns {object|null} Tile data or null if not defined
 */
function getTile (mapId) {
  if (mapId < 0 || mapId >= GRID_WIDTH * GRID_HEIGHT) return null
  const data = SEA_MAPS[String(mapId)]
  return data || null
}

/**
 * Get neighbor MapId in a given direction
 * @param {number} mapId - Current MapId
 * @param {string} direction - 'north', 'south', 'east', 'west'
 * @returns {number|null} Neighbor MapId or null if at grid edge
 */
function getNeighbor (mapId, direction) {
  const pos = getGridPosition(mapId)

  switch (direction) {
    case 'north':
      if (pos.row <= 0) return null
      return getMapId(pos.row - 1, pos.col)
    case 'south':
      if (pos.row >= GRID_HEIGHT - 1) return null
      return getMapId(pos.row + 1, pos.col)
    case 'west':
      if (pos.col <= 0) return null
      return getMapId(pos.row, pos.col - 1)
    case 'east':
      if (pos.col >= GRID_WIDTH - 1) return null
      return getMapId(pos.row, pos.col + 1)
    default:
      return null
  }
}

/**
 * Get wind speed for a tile
 * @param {number} mapId - MapId
 * @returns {string|number|null} Wind speed value (#1-#5, #Full, 0, or null)
 */
function getWindSpeed (mapId) {
  const tile = getTile(mapId)
  if (!tile || !tile.Special) return null
  return tile.Special['#WindSpeed'] || null
}

/**
 * Get special properties for a tile
 * @param {number} mapId - MapId
 * @returns {object|null} Special properties or null
 */
function getSpecial (mapId) {
  const tile = getTile(mapId)
  if (!tile) return null
  return tile.Special || null
}

/**
 * Get spawn position when entering a tile from a given direction
 * @param {string} fromEdge - The edge the boat enters from ('north', 'south', 'east', 'west')
 * @returns {{ x: number, y: number }}
 */
function getSpawnPosition (fromEdge) {
  return SPAWN_POSITIONS[fromEdge] || { x: 320, y: 240 }
}

/**
 * Check if a position is at the screen border
 * @param {number} x - X position
 * @param {number} y - Y position
 * @returns {string|null} Direction ('north', 'south', 'east', 'west') or null
 */
function checkBorder (x, y) {
  if (y <= BORDER_THRESHOLD) return 'north'
  if (y >= SCREEN_HEIGHT - BORDER_THRESHOLD) return 'south'
  if (x <= BORDER_THRESHOLD) return 'west'
  if (x >= SCREEN_WIDTH - BORDER_THRESHOLD) return 'east'
  return null
}

// ============================================================================
// LINGO CONTRACT REFERENCES - SeaWorld (scene 05)
// Audio, inventory, state, and global call parity with original Lingo scripts.
// Sources: BoatBase.ls, MotorBoatAncestor.ls, SailBoatAncestor.ls,
// OarBoatAncestor.ls, ObjectCompassScript.ls, MapDisplay.ls, SelectorMaster.ls,
// AmbienceSound.ls, ZZToolBoxBH.ls, MedalScript.ls, Dir.ls
// ============================================================================

// Boat power constraint errors (BoatBase.changeType)
const AUDIO_BOAT_ERRORS = {
  TYPE_CHANGE_ERROR:    '05d001v0',
  SAIL_HARD_WIND:       '05d018v0',
  MOTOR_NO_TANK:        '05d023v0',
  MOTOR_SAIL_NO_RUDDER: '05d055v0',
  MOTOR_NO_STEERING:    '05d056v0',
  SAIL_NO_WIND_A:       '05d135v0',
  SAIL_NO_WIND_B:       '05d136v0',
  MOTOR_NO_FUEL:        '05d137v0',
}

// Navigation and compass (ObjectCompassScript.ls, BoatBase.ls)
const AUDIO_NAVIGATION = {
  NO_COMPASS:         '05d005v0',
  SEA_BOUNDARY:       '05d051v0',
  COMPASS_ACTIVATED:  '05d057v0',
  CAPSIZE:            '05d125v0',
}

// Hunger / fishing (BoatBase.ls)
const AUDIO_HUNGER = {
  CATCHES_FISH:       '05d045v0',
  ALREADY_HAS_FOOD:   '05d120v0',
}

// Oar rowing (OarBoatAncestor.ls)
const AUDIO_OAR = {
  OAR_ROW_LEFT:  '05d126v0',
  OAR_ROW_RIGHT: '05d127v0',
}

// Map hover (MapDisplay.ls)
const AUDIO_MAP = {
  MAP_HOVER_TUTORIAL: '05d128v0',
  MAP_REGION_3:  '19d003v0',
  MAP_REGION_10: '19d010v0',
  MAP_REGION_11: '19d011v0',
  MAP_REGION_12: '19d012v0',
  MAP_REGION_15: '19d015v0',
}

// Selector master (SelectorMaster.ls)
const AUDIO_SELECTOR = {
  SELECT_OAR:   '05d129v0',
  SELECT_MOTOR: '05d130v0',
  SELECT_SAIL:  '05d131v0',
}

// Motor engine sounds (MotorBoatAncestor.ls) — 8 engines x 3 RPM levels
const MOTOR_ENGINE_SOUNDS = [
  ['05e018v1', '05e019v1', '05e016v1'],
  ['05e018v0', '05e019v0', '05e016v0'],
  ['05e030v0', '05e031v0', '05e032v1'],
  ['05e056v0', '05e057v0', '05e055v0'],
  ['05e034v0', '05e035v0', '05e033v0'],
  ['05e022v0', '05e023v0', '05e020v0'],
  ['05e053v0', '05e054v0', '05e052v0'],
  ['05e026v0', '05e027v0', '05e024v0'],
]

// Motor engine alternate variants
const MOTOR_ENGINE_ALTERNATES = ['05e033v1', '05e052v1', '05e024v1']

// Crash sound (BoatBase.crashed)
const AUDIO_CRASH = '05e008v1'

// Sail ambient (SailBoatAncestor.ls)
const AUDIO_SAIL = ['05e044v0', '05e044v1']

// Ambience wind (AmbienceSound.ls)
const AUDIO_AMBIENCE_WIND = '05e043v0'

// Shallow water ambient (DepthChecker)
const AUDIO_SHALLOW_WATER = ['05e058v0', '05e059v0', '05e060v0']

// Medal fanfare (MedalScript.ls)
const AUDIO_MEDAL = {
  FANFARE: '00e101v0',
  AWARD:   '33e011v0',
}

// ToolBox menu sounds (ZZToolBoxBH.ls)
const AUDIO_TOOLBOX = {
  MENU_OPEN:     '09d001v0',
  FISHINGROD:    '09d058v0',
  BIBLE:         '09d059v0',
  SUIT:          '09d060v0',
  HELMET:        '09d061v0',
  SWIMRING:      '09d062v0',
  DOCTORBAG:     '09d063v0',
  DIARY:         '09d064v0',
}

// General audio (shared)
const AUDIO_GENERAL = '00e110v0'

// Inventory items tracked in sea world
const SEA_INVENTORY_ITEMS = [
  'DrivenTimes',   // Track distance driven by Motor/Sail/Oar
  'Fished',        // Flag: has fished with rod
  'Fishingrod',    // Fishing rod item
  'MapPiece1',     // Map unlock piece 1
  'MapPiece2',     // Map unlock piece 2
  'MapPiece3',     // Map unlock piece 3
  'Pills',         // Seasickness pills
  'tmpItem',       // Temporary item during inventory operations
]

// State fields used by sea world globals
const SEA_STATE_FIELDS = {
  availableXtras: null,  // Available extra parts
  levelHandler: null,    // Level/progression handler
  loopMaster: null,      // Loop update master
  mouseMaster: null,     // Mouse input manager
  parts: null,           // Boat parts registry
  radioHandler: null,    // Radio broadcast handler
}

// Global function calls
function MulleSez (dialogId) {
  // Dir.ls global call — plays Mulle dialogue
  return dialogId
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Constants
  GRID_WIDTH,
  GRID_HEIGHT,
  GRID_LAYOUT,
  BORDER_THRESHOLD,
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
  START_MAP_ID,
  START_COORDINATE,
  START_DIRECTION,

  // Lingo parity - audio
  AUDIO_BOAT_ERRORS,
  AUDIO_NAVIGATION,
  AUDIO_HUNGER,
  AUDIO_OAR,
  AUDIO_MAP,
  AUDIO_SELECTOR,
  MOTOR_ENGINE_SOUNDS,
  MOTOR_ENGINE_ALTERNATES,
  AUDIO_CRASH,
  AUDIO_SAIL,
  AUDIO_AMBIENCE_WIND,
  AUDIO_SHALLOW_WATER,
  AUDIO_MEDAL,
  AUDIO_TOOLBOX,
  AUDIO_GENERAL,

  // Lingo parity - inventory, state, globals
  SEA_INVENTORY_ITEMS,
  SEA_STATE_FIELDS,
  MulleSez,

  // Functions
  getGridPosition,
  getMapId,
  getWorldPoint,
  getTile,
  getNeighbor,
  getWindSpeed,
  getSpecial,
  getSpawnPosition,
  checkBorder
}
