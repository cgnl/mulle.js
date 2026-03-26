/**
 * Boat Modules - Modular boat systems for Mulle Meck Boten
 * @module objects/boat
 * 
 * This index re-exports all boat modules for easy importing.
 * 
 * Usage:
 *   import { SEA_TERRAIN, PropulsionType } from './boat'
 *   import * as BoatEnergy from './boat/BoatEnergy'
 *   import BoatPhysics from './boat/BoatPhysics'
 */
'use strict'

// Constants
export * from './BoatConstants'

// Static spawn utilities
export * from './BoatSpawn'

// Terrain detection
export * from './BoatTerrain'

// Energy systems (fuel, stamina, hunger, pills)
export * from './BoatEnergy'

// Propulsion systems (motor, sail, oar)
export * from './BoatPropulsion'

// Damage systems (crash, capsize, durability)
export * from './BoatDamage'

// Physics systems (waves, movement, stability)
export * from './BoatPhysics'

// Default exports for convenience
import BoatConstants from './BoatConstants'
import BoatSpawn from './BoatSpawn'
import BoatTerrain from './BoatTerrain'
import BoatEnergy from './BoatEnergy'
import BoatPropulsion from './BoatPropulsion'
import BoatDamage from './BoatDamage'
import BoatPhysics from './BoatPhysics'

export {
  BoatConstants,
  BoatSpawn,
  BoatTerrain,
  BoatEnergy,
  BoatPropulsion,
  BoatDamage,
  BoatPhysics
}

export default {
  Constants: BoatConstants,
  Spawn: BoatSpawn,
  Terrain: BoatTerrain,
  Energy: BoatEnergy,
  Propulsion: BoatPropulsion,
  Damage: BoatDamage,
  Physics: BoatPhysics
}
