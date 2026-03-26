/**
 * BoatTerrain - Terrain detection and depth checking for boats
 * @module objects/boat/BoatTerrain
 * 
 * Extracted from driveboat.js lines 1251-1831
 * These are mixin functions that operate on a boat instance (this)
 */
'use strict'

import { SEA_TERRAIN, TOPOLOGY, DEFAULT_BOAT_PROPS } from './BoatConstants'

/**
 * Get topology coordinate from world position
 * #124: Uses decimalPrec scaling (position / 100 for lookup)
 * Original: argLoc = (argLoc - point(4, 4)) / 2
 * @param {Phaser.Point} worldPos - World position
 * @param {Object} mapOffset - Map offset {x, y}
 * @returns {Phaser.Point} - Topology bitmap coordinate
 */
export function getTopologyCoord (worldPos, mapOffset) {
  mapOffset = mapOffset || DEFAULT_BOAT_PROPS.mapOffset
  const tryX = Math.floor((worldPos.x - mapOffset.x) / 2)
  const tryY = Math.floor((worldPos.y - mapOffset.y) / 2)
  return new Phaser.Point(tryX, tryY)
}

/**
 * Check pixel value at coordinate (terrain type)
 * Similar to MulleDriveCar.pixelCheck
 * @param {Object} topology - Topology bitmap with getPixel method
 * @param {Phaser.Point} coord - World coordinate to check
 * @param {Object} mapOffset - Map offset {x, y}
 * @returns {number} - Red channel value (terrain type)
 */
export function pixelCheck (topology, coord, mapOffset) {
  if (!topology) {
    // No topology loaded - assume deep water
    return 25
  }

  mapOffset = mapOffset || DEFAULT_BOAT_PROPS.mapOffset
  // Lingo: tmpH = integer((x - 4) / 2) + 1 (1-based)
  // JS 0-based: tryX = floor((x - 4) / 2)
  const tryX = Math.floor((coord.x - mapOffset.x) / 2)
  const tryY = Math.floor((coord.y - mapOffset.y) / 2)

  // Bounds check (0-based: valid range is 0..WIDTH-1, 0..HEIGHT-1)
  if (tryX < 0 || tryY < 0 || tryX >= TOPOLOGY.WIDTH || tryY >= TOPOLOGY.HEIGHT) {
    // Out of topology bounds - treat as shore
    return 240
  }

  const topoBytes = topology.byteArray
  const expectedLen = TOPOLOGY.WIDTH * TOPOLOGY.HEIGHT
  const hasTextBytes = topoBytes && typeof topoBytes.length === 'number' && topoBytes.length >= expectedLen

  // Prefer Lingo text topology bytes when available, regardless of flag.
  if (hasTextBytes) {
    const idx = (tryY * TOPOLOGY.WIDTH) + tryX
    const v = topoBytes[idx]
    // Lingo depth topology: 0 = land, 1-3 = shallow, >=4 = deep water.
    if (v === 0) return 240
    if (v < 4) return 120
    return 25
  }

  const pix = topology.getPixel(tryX, tryY)
  if (topology.isTextTopology === true) {
    const v = pix.r
    // Lingo depth topology: 0 = land, 1-3 = shallow, >=4 = deep water.
    if (v === 0) return 240
    if (v < 4) return 120
    return 25
  }
  return pix.r
}

/**
 * Check if terrain is passable based on boat capabilities
 * @param {Object} boat - Boat instance with properties:
 *   - game: Phaser game instance
 *   - engineSounds: {shore, reef, shallow} sound keys
 *   - reefResistance: boolean
 *   - boatSize: 'small'|'medium'|'large'
 *   - shallowDraft: boolean
 *   - currentTerrain: current terrain type
 *   - terrainSpeedModifier: current speed modifier
 *   - SoundShore, SoundReef, SoundShallow: sound flags
 * @param {number} terrainValue - Red channel value from topology
 * @returns {boolean} - Whether boat can pass
 */
export function checkTerrainPassable (boat, terrainValue) {
  // Shore/Land - always impassable
  if (terrainValue >= 240) {
    console.log('[DriveBoat] Shore collision')
    if (!boat.SoundShore) {
      const s = boat.game.mulle.playAudio(boat.engineSounds.shore)
      if (s) {
        s.onStop.addOnce(() => { boat.SoundShore = null })
      }
      boat.SoundShore = true
    }
    return false
  }

  // Reef/Rocks - requires durability
  if (terrainValue >= 160 && terrainValue <= 200) {
    if (!boat.reefResistance) {
      console.log('[DriveBoat] Reef collision - need more durability')
      if (!boat.SoundReef) {
        const s = boat.game.mulle.playAudio(boat.engineSounds.reef)
        if (s) {
          s.onStop.addOnce(() => { boat.SoundReef = null })
        }
        boat.SoundReef = true
      }
      boat.terrainSpeedModifier = 0.1
      return false
    }
    // Can pass reef but slowly
    boat.currentTerrain = SEA_TERRAIN.REEF
    boat.terrainSpeedModifier = SEA_TERRAIN.REEF.speedMod
    return true
  }

  // Shallow water - requires small boat or shallow draft
  if (terrainValue >= 101 && terrainValue <= 150) {
    if (boat.boatSize === 'large' && !boat.shallowDraft) {
      console.log('[DriveBoat] Shallow water - boat too large')
      if (!boat.SoundShallow) {
        const s = boat.game.mulle.playAudio(boat.engineSounds.shallow)
        if (s) {
          s.onStop.addOnce(() => { boat.SoundShallow = null })
        }
        boat.SoundShallow = true
      }
      boat.terrainSpeedModifier = 0.2
      return false
    }
    // Small/medium boats can pass, but slowly
    // Lingo audio: play shallow water ambient sound (05e058v0/05e059v0/05e060v0)
    if (!boat.SoundShallowAmbient && boat.shallowWaterAmbient && boat.shallowWaterAmbient.length) {
      const idx = Math.floor(Math.random() * boat.shallowWaterAmbient.length)
      const s = boat.game.mulle.playAudio(boat.shallowWaterAmbient[idx])
      if (s) {
        s.onStop.addOnce(() => { boat.SoundShallowAmbient = null })
      }
      boat.SoundShallowAmbient = true
    }
    boat.currentTerrain = SEA_TERRAIN.SHALLOW_WATER
    boat.terrainSpeedModifier = SEA_TERRAIN.SHALLOW_WATER.speedMod
    return true
  }

  // Strong current area
  if (terrainValue >= 201 && terrainValue <= 220) {
    boat.currentTerrain = SEA_TERRAIN.CURRENT_STRONG
    boat.terrainSpeedModifier = SEA_TERRAIN.CURRENT_STRONG.speedMod
    return true
  }

  // Medium depth water
  if (terrainValue >= 51 && terrainValue <= 100) {
    boat.currentTerrain = SEA_TERRAIN.MEDIUM_WATER
    boat.terrainSpeedModifier = SEA_TERRAIN.MEDIUM_WATER.speedMod
    return true
  }

  // Deep water - normal sailing
  boat.currentTerrain = SEA_TERRAIN.DEEP_WATER
  boat.terrainSpeedModifier = SEA_TERRAIN.DEEP_WATER.speedMod
  return true
}

/**
 * Apply current/wave effects based on terrain
 * @param {Object} boat - Boat instance with topology and position
 * @param {number} terrainValue - Red channel value from topology
 */
export function applyCurrentEffects (boat, terrainValue) {
  // Lingo parity: topology currents/waves do not directly move the boat.
  // Movement is fully determined by calcSpeedNDir/velPoint.
  // Keep this hook for future effects, but do not change boat position here.
  void terrainValue
  void boat
}

/**
 * Border detection (DepthChecker.ls checkBorders)
 * #119: Border detection - uses (loc - mapOffset) / 2 with topo bounds
 * Note: Position adjustment happens in SeaWorld.checkMapBoundaries (BoatBase.ls).
 * @param {Object} boat - Boat instance with position
 * @param {Phaser.Point} loc - World position
 * @returns {Phaser.Point|number} - Direction point or 0 if not at border
 */
export function checkBorders (boat, loc) {
  const mapOffset = boat.mapOffset || DEFAULT_BOAT_PROPS.mapOffset
  const tmpH = (loc.x - mapOffset.x) / 2
  const tmpV = (loc.y - mapOffset.y) / 2
  const tmpBorderWidth = DEFAULT_BOAT_PROPS.borderWidth

  if (tmpH < tmpBorderWidth) {
    return new Phaser.Point(-1, 0) // West
  } else if (tmpH > (TOPOLOGY.WIDTH - 1 - tmpBorderWidth)) {
    return new Phaser.Point(1, 0) // East
  } else if (tmpV < tmpBorderWidth) {
    return new Phaser.Point(0, -1) // North
  } else if (tmpV > (TOPOLOGY.HEIGHT - 1 - tmpBorderWidth)) {
    return new Phaser.Point(0, 1) // South
  }

  return 0
}

/**
 * BUG FIX #4: DEPTH CHECK USING WRONG DATA FORMAT
 * BUG FIX #5: CORNER POINT SCALE OVERRIDE FOR DEPTH CHECK
 * BUG FIX #8: WAVE TOPOLOGY INTEGRATION (only affects tilt, not depth)
 * #118, #120, #122, #123: Topology binary format with corner point depth check
 * @param {Object} boat - Boat instance with topology and properties
 * @param {Phaser.Point} loc - World position
 * @param {Array} cornerPoints - Optional array of corner offset points
 * @returns {string|number} - 'Hit' for collision, 'Shallow' for too shallow, 1 for passable but slow, 0 for OK
 */
export function checkDepthAtCorners (boat, loc, cornerPoints) {
  if (!boat.topology) return 0

  const coord = getTopologyCoord(loc, boat.mapOffset)
  const decimalPrec = boat.decimalPrec || DEFAULT_BOAT_PROPS.decimalPrec
  const nrOfDirections = boat.nrOfDirections || DEFAULT_BOAT_PROPS.nrOfDirections

  // If no corner points provided, use current direction's corners
  if (!cornerPoints) {
    const directionIndex = Math.floor(boat.internalDirection / decimalPrec) - 1
    const correctedIndex = (directionIndex < 0) ? nrOfDirections - 1 : 
                           (directionIndex >= nrOfDirections) ? 0 : directionIndex
    cornerPoints = boat.cornerPoints[correctedIndex] || [new Phaser.Point(0, 0)]
  }

  // BUG FIX #8: Get wave topology info from weather renderer
  // Wave topology ONLY affects visual tilt (sideAngle), NOT depth checking
  let waveAltitude = 0
  let waveFrontBack = 0
  let waveSideAngle = 0

  if (boat.game.mulle && boat.game.mulle.weather && boat.game.mulle.weather.getTopoInfo) {
    const waveInfo = boat.game.mulle.weather.getTopoInfo(loc, boat.direction, cornerPoints)
    if (waveInfo) {
      waveAltitude = waveInfo[0] || 0
      waveFrontBack = waveInfo[1] || 0
      waveSideAngle = waveInfo[2] || 0
    }
  }

  // Store wave info for tilt calculation (not depth)
  boat.waveAltitude = waveAltitude
  boat.waveFrontBack = waveFrontBack
  boat.waveSideAngle = waveSideAngle

  // #123: Passability check - all 3 corners must pass
  for (let i = 0; i < cornerPoints.length; i++) {
    const tmpPoint = cornerPoints[i]

    // Corner points are in topology units in Lingo (DepthChecker adds them directly).
    // Allow scaling override for legacy data.
    const cornerScale = (boat.cornerPointsScale === undefined ? 1 : boat.cornerPointsScale)
    const tmpH = coord.x + Math.round(tmpPoint.x * cornerScale)
    const tmpV = coord.y + Math.round(tmpPoint.y * cornerScale)
    
    // Bounds check (0-based: valid range is 0..WIDTH-1, 0..HEIGHT-1)
    if (tmpH < 0 || tmpV < 0 || tmpH >= TOPOLOGY.WIDTH || tmpV >= TOPOLOGY.HEIGHT) {
      return 'Hit'
    }

    const topoBytes = boat.topology && boat.topology.byteArray
    const expectedLen = TOPOLOGY.WIDTH * TOPOLOGY.HEIGHT
    const hasTextBytes = topoBytes && typeof topoBytes.length === 'number' && topoBytes.length >= expectedLen
    const isTextTopology = boat.topology && boat.topology.isTextTopology === true

    if (hasTextBytes) {
      const idx = (tmpV * TOPOLOGY.WIDTH) + tmpH
      if (idx < 0 || idx >= topoBytes.length) {
        return 'Hit'
      }
      const tmpInfo = topoBytes[idx]
      // Lingo DepthChecker rules (text/binary topology):
      // 0 = Hit, 1-3 = shallow/depth levels, >=4 = passable.
      if (tmpInfo === 0) {
        return 'Hit'
      }

      if (tmpInfo < 4) {
        const requiredDepth = getRequiredDepth(boat)
        if (tmpInfo < requiredDepth) {
          return 1
        }
        if (tmpInfo === requiredDepth) {
          return 'Shallow'
        }
      }

      // Passable for this corner.
      continue
    }

    // BUG FIX #4: Topology data format detection
    const pix = boat.topology.getPixel(tmpH, tmpV)
    const tmpInfo = pix.r

    if (isTextTopology) {
      // Lingo DepthChecker rules (text/binary topology):
      // 0 = Hit, 1-3 = shallow/depth levels, >=4 = passable.
      if (tmpInfo === 0) {
        return 'Hit'
      }

      if (tmpInfo < 4) {
        const requiredDepth = getRequiredDepth(boat)
        if (tmpInfo < requiredDepth) {
          return 1
        }
        if (tmpInfo === requiredDepth) {
          return 'Shallow'
        }
      }

      // Passable for this corner.
      continue
    }

    // RGB terrain format (derived or procedural topology)
    // Detect format: binary string data vs RGB pixel data
    const isRGBFormat = (Math.abs(pix.r - pix.g) < 5 && Math.abs(pix.r - pix.b) < 5) || 
                        (pix.r === 0 || pix.r === 25 || pix.r === 50 || pix.r === 240)

    // #122: Hit detection - value === 0 or >= 200 = collision
    if (tmpInfo === 0 || tmpInfo >= 200) {
      return 'Hit'
    }

    // Depth level detection for RGB format
    let depthValue = 0

    if (isRGBFormat && tmpInfo > 20) {
      // RGB terrain format - map terrain types to depth values
      if (tmpInfo >= 160) {
        depthValue = 0  // Reef - very shallow
      } else if (tmpInfo >= 101) {
        depthValue = 1  // Shallow water
      } else if (tmpInfo >= 51) {
        depthValue = 3  // Medium water
      } else {
        depthValue = 4  // Deep water
      }
    } else {
      // Fallback: treat anything else as deep water.
      depthValue = 4
    }

    // Compare with boat's required depth
    const requiredDepth = getRequiredDepth(boat)

    if (depthValue < requiredDepth) {
      return 1 // Too shallow, reduce speed
    }

    if (depthValue === requiredDepth) {
      return 'Shallow' // Borderline shallow
    }
  }

  return 0 // All clear
}

/**
 * Get required water depth for boat based on size and draft
 * @param {Object} boat - Boat instance with boatSize and shallowDraft
 * @returns {number} Depth level (0-4)
 */
export function getRequiredDepth (boat) {
  if (boat.shallowDraft) return 0 // Shallow draft boats can go anywhere

  // Lingo DepthChecker uses RealDepth thresholds (not boat size).
  const realDepth = boat && boat.quickProps ? boat.quickProps.RealDepth : undefined
  if (typeof realDepth === 'number') {
    if (realDepth < 2) return 0
    if (realDepth < 4) return 1
    if (realDepth < 10) return 2
    if (realDepth < 16) return 3
    return 4
  }
  
  switch (boat.boatSize) {
    case 'small': return 1
    case 'medium': return 2
    case 'large': return 3
    default: return 2
  }
}

/**
 * Get current water depth info
 * @param {Object} boat - Boat instance with currentTerrain and terrainSpeedModifier
 * @returns {object} - Terrain info object
 */
export function getWaterDepth (boat) {
  return {
    terrain: boat.currentTerrain,
    speedModifier: boat.terrainSpeedModifier,
    canPass: boat.terrainSpeedModifier > 0
  }
}

/**
 * BUG FIX #4: Get show coordinate - position for map display
 * Returns boat position in screen coordinates for minimap display
 * @param {Object} boat - Boat instance with position
 * @returns {Phaser.Point} - Screen coordinate position
 */
export function getShowCoordinate (boat) {
  return new Phaser.Point(
    boat.position.x,
    boat.position.y
  )
}

export default {
  getTopologyCoord,
  pixelCheck,
  checkTerrainPassable,
  applyCurrentEffects,
  checkBorders,
  checkDepthAtCorners,
  getRequiredDepth,
  getWaterDepth,
  getShowCoordinate
}
