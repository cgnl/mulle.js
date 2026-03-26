/**
 * BoatSpawn - Static spawn helpers for boat positioning
 * @module objects/boat/BoatSpawn
 */
'use strict'

import { SPAWN_LINES, DIRECTION_LIST } from './BoatConstants'

/**
 * Get spawn line data for a given direction index
 * Used when entering seaworld from a specific edge/direction
 * @param {number} index - Direction index (0-15)
 * @returns {Object} Spawn data with pos {x,y} and dir {x,y}
 */
export function getSpawnLine (index) {
  if (index < 0 || index >= SPAWN_LINES.length) {
    index = 0
  }
  return SPAWN_LINES[index]
}

/**
 * Get spawn line for entering from a map edge
 * @param {string} edge - 'north', 'south', 'east', 'west'
 * @returns {Object} Best spawn line for that edge
 */
export function getSpawnLineForEdge (edge) {
  // Map edges to spawn line indices (16 directions around the screen)
  // Spawn lines are arranged clockwise starting from South-Southwest
  // Index 0: bottom-left area, Index 4: top-left, Index 8: top-right, Index 12: bottom-right
  const edgeMap = {
    'south': 0,   // Enter from south - spawn at bottom, face north
    'southwest': 1,
    'west': 3,    // Enter from west - spawn at left, face east
    'northwest': 5,
    'north': 7,   // Enter from north - spawn at top, face south
    'northeast': 9,
    'east': 11,   // Enter from east - spawn at right, face west
    'southeast': 13
  }
  
  const index = edgeMap[edge.toLowerCase()] || 0
  return SPAWN_LINES[index]
}

/**
 * Get the direction index (1-16) that corresponds to a spawn line's direction vector
 * @param {Object} spawnLine - Spawn line with dir {x,y}
 * @returns {number} Direction index (1-16) for setDirection()
 */
export function getDirectionFromSpawnLine (spawnLine) {
  // Find the closest match in DIRECTION_LIST
  const dirX = spawnLine.dir.x
  const dirY = spawnLine.dir.y
  
  let bestMatch = 1
  let bestDist = Infinity
  
  for (let i = 0; i < DIRECTION_LIST.length; i++) {
    const dx = DIRECTION_LIST[i].x - dirX
    const dy = DIRECTION_LIST[i].y - dirY
    const dist = dx * dx + dy * dy
    
    if (dist < bestDist) {
      bestDist = dist
      bestMatch = i + 1 // Directions are 1-indexed
    }
  }
  
  return bestMatch
}

/**
 * Get all spawn lines (for debugging/visualization)
 * @returns {Array} Array of all 16 spawn lines
 */
export function getAllSpawnLines () {
  return SPAWN_LINES
}

export default {
  getSpawnLine,
  getSpawnLineForEdge,
  getDirectionFromSpawnLine,
  getAllSpawnLines
}
