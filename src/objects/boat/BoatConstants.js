/**
 * BoatConstants - Shared constants for boat navigation
 * @module objects/boat/BoatConstants
 */
'use strict'

/**
 * Sea terrain types based on topology pixel values
 */
export const SEA_TERRAIN = {
  DEEP_WATER: { min: 0, max: 50, name: 'deep', speedMod: 1.0 },
  MEDIUM_WATER: { min: 51, max: 100, name: 'medium', speedMod: 0.9 },
  SHALLOW_WATER: { min: 101, max: 150, name: 'shallow', speedMod: 0.5 },
  REEF: { min: 160, max: 200, name: 'reef', speedMod: 0.3 },
  CURRENT_STRONG: { min: 201, max: 220, name: 'current', speedMod: 0.7 },
  SHORE: { min: 240, max: 255, name: 'shore', speedMod: 0 }
}

/**
 * Propulsion types for boats
 * Different propulsion types have different energy consumption characteristics
 */
export const PropulsionType = {
  NONE: 'none',     // No propulsion - drifting only (no energy consumption)
  MOTOR: 'motor',   // Engine-powered - consumes fuel
  SAIL: 'sail',     // Wind-powered - free energy (no consumption)
  OAR: 'oar'        // Human-powered - consumes stamina
}

/**
 * Original Lingo DirectionList from boten_05.DXR member 10
 * 16 direction vectors for boat navigation (scaled to 100)
 */
export const DIRECTION_LIST = [
  { x: 38, y: -92 },   // Direction 1: NNE
  { x: 70, y: -70 },   // Direction 2: NE
  { x: 92, y: -38 },   // Direction 3: ENE
  { x: 100, y: 0 },    // Direction 4: E
  { x: 92, y: 38 },    // Direction 5: ESE
  { x: 70, y: 70 },    // Direction 6: SE
  { x: 38, y: 92 },    // Direction 7: SSE
  { x: 0, y: 100 },    // Direction 8: S
  { x: -38, y: 92 },   // Direction 9: SSW
  { x: -70, y: 70 },   // Direction 10: SW
  { x: -92, y: 38 },   // Direction 11: WSW
  { x: -100, y: 0 },   // Direction 12: W
  { x: -92, y: -38 },  // Direction 13: WNW
  { x: -70, y: -70 },  // Direction 14: NW
  { x: -38, y: -92 },  // Direction 15: NNW
  { x: 0, y: -100 }    // Direction 16: N
]

/**
 * Original Lingo AmplitudeList from boten_05.DXR member 11
 * 100 values for wave/amplitude calculations - sine wave pattern
 */
export const AMPLITUDE_LIST = [
  6, 13, 19, 25, 31, 37, 43, 48, 54, 59, 64, 68, 73, 77, 81, 84, 88, 90, 93, 95,
  97, 98, 99, 100, 100, 100, 99, 98, 97, 95, 93, 90, 88, 84, 81, 77, 73, 68, 64, 59,
  54, 48, 43, 37, 31, 25, 19, 13, 6, 0, -6, -13, -19, -25, -31, -37, -43, -48, -54, -59,
  -64, -68, -73, -77, -81, -84, -88, -90, -93, -95, -97, -98, -99, -100, -100, -100, -99, -98, -97, -95,
  -93, -90, -88, -84, -81, -77, -73, -68, -64, -59, -54, -48, -43, -37, -31, -25, -19, -13, -6, 0
]

/**
 * Original Lingo SpawnLines from boten_05.DXR member 12
 * 16 spawn positions with direction vectors
 */
export const SPAWN_LINES = [
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

/**
 * Topology dimensions
 */
export const TOPOLOGY = {
  WIDTH: 316,
  HEIGHT: 198
}

/**
 * Default boat properties
 */
export const DEFAULT_BOAT_PROPS = {
  decimalPrec: 100,
  nrOfDirections: 16,
  // DepthChecker.ls uses (argLoc - point(4, 4)) / 2
  // Align boat topology sampling with original Lingo offset.
  mapOffset: { x: 4, y: 4 },
  borderWidth: 4,
  borderAdjustment: 12
}

/**
 * HUD Sprite Channels (Z-index compatible with Dir.js SPRITE_LIST)
 */
export const HUD_LAYERS = {
  FUEL: 72,   // Matches Dir.js 'fuel'
  HUNGER: 74, // BoatBase.ls hunger meter channel
  SPEED: 70,  // BoatBase.ls speed meter channel
  COMPASS: 80, // Free slot (after MapOverview:79)
  BUTTONS: 65 // Matches Dir.js 'BoatTypes'
}

/**
 * HUD Asset Names (Assumed from typical Lingo naming)
 */
export const HUD_ASSETS = {
  FUEL: '01a001v0',
  HUNGER: '34n003v0',
  SPEED: '34n002v0',
  COMPASS_BOTTOM: 'CompassBottom',
  COMPASS_ROUND: 'CompassRound',
  COMPASS_NEEDLE: 'CompassNeedle',
  BUTTON_MOTOR: 'TypePicMotor',
  BUTTON_SAIL: 'TypePicSail',
  BUTTON_OAR: 'TypePicOar'
}

/**
 * HUD sprite locations (Lingo score loc for meter channels)
 * From boten_05.dxr score.json: channel 70/72/74 locs.
 */
export const HUD_POSITIONS = {
  SPEED: { x: 165, y: 244 },  // channel 70 (34n002v0) from boten_05 VWSC
  FUEL: { x: 250, y: 445 },   // channel 72 (01a001v0) from boten_05 VWSC
  HUNGER: { x: 320, y: 240 }  // channel 74 (34n003v0) from boten_05 VWSC
}

/**
 * Lingo audio references for SeaWorld (scene 05).
 * Collected from BoatBase.ls, MotorBoatAncestor.ls, SailBoatAncestor.ls,
 * OarBoatAncestor.ls, DepthChecker.ls, ObjectCompassScript.ls, MapDisplay.ls,
 * MedalScript.ls, and the various propulsion ancestors.
 */
export const SCENE05_AUDIO = {
  // ---- Boat power constraint errors (BoatBase.changeType) ----
  TYPE_CHANGE_ERROR:    '05d001v0', // Generic type change error
  SAIL_HARD_WIND:       '05d018v0', // Sail + hard wind
  MOTOR_NO_TANK:        '05d023v0', // Motor + no fuel tank
  MOTOR_SAIL_NO_RUDDER: '05d055v0', // Motor/Sail + no rudder
  MOTOR_NO_STEERING:    '05d056v0', // Motor + no steering
  SAIL_NO_WIND_A:       '05d135v0', // Sail + no wind (variant A)
  SAIL_NO_WIND_B:       '05d136v0', // Sail + no wind (variant B)
  MOTOR_NO_FUEL:        '05d137v0', // Motor + no fuel

  // ---- Navigation ----
  NO_COMPASS:           '05d005v0', // No compass equipped
  SEA_BOUNDARY:         '05d051v0', // Sea boundary collision (world edge)
  COMPASS_ACTIVATED:    '05d057v0', // Object compass activated
  CAPSIZE:              '05d125v0', // Boat capsizes

  // ---- Hunger / fishing ----
  CATCHES_FISH:         '05d045v0', // Catches fish with rod
  ALREADY_HAS_FOOD:     '05d120v0', // Already has food (fished before)

  // ---- Oar rowing ----
  OAR_ROW_A:            '05d126v0', // Oar rowing sound (left)
  OAR_ROW_B:            '05d127v0', // Oar rowing sound (right)

  // ---- Map hover ----
  MAP_HOVER_TUTORIAL:   '05d128v0', // Map location hover in tutorial mode

  // ---- Crash ----
  CRASH:                '05e008v1', // Hardcoded crash sound (BoatBase.crashed)

  // ---- Motor engine sounds (MotorBoatAncestor.ls) ----
  MOTOR_ENGINE: [
    ['05e018v1', '05e019v1', '05e016v1'],
    ['05e018v0', '05e019v0', '05e016v0'],
    ['05e030v0', '05e031v0', '05e032v1'],
    ['05e056v0', '05e057v0', '05e055v0'],
    ['05e034v0', '05e035v0', '05e033v0'],
    ['05e022v0', '05e023v0', '05e020v0'],
    ['05e053v0', '05e054v0', '05e052v0'],
    ['05e026v0', '05e027v0', '05e024v0']
  ],
  // Alternate motor sound variants found in Director cast
  MOTOR_ENGINE_ALTERNATES: [
    '05e030v1', '05e033v1', '05e052v1',
    '05e024v1', '05e026v1'
  ],

  // ---- Sail ambient (SailBoatAncestor.ls) ----
  SAIL_AMBIENT:         ['05e044v0', '05e044v1'],

  // ---- Shallow water ambient (DepthChecker / SeaWorld) ----
  SHALLOW_WATER_AMBIENT: ['05e058v0', '05e059v0', '05e060v0'],

  // ---- Medal award ----
  MEDAL_FANFARE:        '00e101v0'  // Medal/award fanfare (MedalScript.ls)
}

export default {
  SEA_TERRAIN,
  PropulsionType,
  DIRECTION_LIST,
  AMPLITUDE_LIST,
  SPAWN_LINES,
  TOPOLOGY,
  DEFAULT_BOAT_PROPS,
  HUD_LAYERS,
  HUD_ASSETS,
  HUD_POSITIONS,
  SCENE05_AUDIO
}
