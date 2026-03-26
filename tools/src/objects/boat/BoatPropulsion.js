/**
 * BoatPropulsion - Motor, sail, and oar propulsion systems
 * @module objects/boat/BoatPropulsion
 * 
 * Extracted from driveboat.js
 * Handles engine sounds, sail physics, and oar rowing mechanics
 * 
 * Original Lingo references:
 * - MotorBoatAncestor.ls for engine sounds
 * - SailBoatAncestor.ls for sail physics
 * - RowBoatAncestor.ls for oar mechanics
 */
'use strict'

import { PropulsionType, DEFAULT_BOAT_PROPS } from './BoatConstants'

/**
 * #112: Initialize Sail object with direction display
 * @param {Object} boat - Boat instance
 */
export function initSail (boat) {
  boat.Sail = {
    direction: 1,
    force: 0,
    inclination: [0, 0],
    
    // Calculate wind force on sail
    getForce: (windDir, windSpeed, boatDir) => {
      // Wind direction relative to boat
      const relativeWind = correctDirection(boat, windDir - boatDir)
      
      // Sail works best at 45-90 degrees from wind
      // Dead downwind (0 deg) or directly into wind (180 deg) = low force
      let efficiency = 0
      
      if (relativeWind >= -4 && relativeWind <= 4) {
        // Wind from behind - running
        efficiency = 0.4 + (4 - Math.abs(relativeWind)) * 0.1
      } else if (relativeWind >= -8 && relativeWind <= -5) {
        // Wind from side-rear - broad reach (best point of sail)
        efficiency = 0.8 + (Math.abs(relativeWind) - 5) * 0.05
      } else if (relativeWind >= 5 && relativeWind <= 8) {
        // Wind from side-rear - broad reach (best point of sail)
        efficiency = 0.8 + (Math.abs(relativeWind) - 5) * 0.05
      } else {
        // Other angles - beam reach to close hauled
        efficiency = 0.6
      }
      
      // BUG FIX #4.2: Wind speed 100x too weak - multiply by 3 before scaling
      // Original Lingo: tmpWindEffect = getWindSpeed() * 3; tmpWindStrength = tmpWindEffect / 100
      return ((windSpeed * 3) / 100) * efficiency * 100
    },
    
    // Update sail direction based on wind
    calcDirection: (windDir) => {
      boat.Sail.direction = windDir
    }
  }
}

/**
 * #113: Wind force calculation - getForce(Sail)
 * @param {Object} boat - Boat instance
 * @returns {number} Force from wind on sail (0-100)
 */
export function getWindForce (boat) {
  if (!boat.Sail) return 0
  
  // Get wind from weather system (if available)
  const weather = boat.game.mulle.weather
  if (!weather) return 50 // Default moderate wind
  
  const windDir = weather.windDirection || 8
  const windSpeed = weather.windSpeed || 50
  
  return boat.Sail.getForce(windDir, windSpeed, boat.direction)
}

/**
 * #115, #116, #117: Apply oar force curve with hunger and sound effects
 * BUG FIX #4 (CRITICAL): Use proper calcSpeedNDir like original Lingo
 * Original: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
 * @param {Object} boat - Boat instance
 * @param {number} throttle - Throttle input (-1 to 1)
 */
export function applyOarForce (boat, throttle) {
  let tmpPlaySound = false
  
  if (throttle > 0) {
    // Forward rowing
    if (boat.Oar === 0) {
      boat.Oar = boat.forceCount
    }
    
    if (boat.Oar > 1) {
      const tmpForce = boat.oarForce[boat.Oar - 1]
      boat.Oar--
      
      if (tmpForce === 0) {
        tmpPlaySound = true
      }
      
      // BUG FIX #4 (CRITICAL): Use proper calcSpeedNDir with steering multiplier
      // Original: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
      calcSpeedNDir(boat, tmpForce * 13, boat.Steering * 5)
    }
  } else if (throttle < 0) {
    // Backward rowing
    if (boat.Oar === 0) {
      boat.Oar = -boat.forceCount
    }
    
    if (boat.Oar < -1) {
      const tmpForce = -boat.oarForce[-boat.Oar - 1]
      boat.Oar++
      
      // BUG FIX #4 (CRITICAL): Use proper calcSpeedNDir with steering multiplier
      calcSpeedNDir(boat, tmpForce * 13, boat.Steering * 5)
    }
  } else {
    boat.Oar = 0
  }
  
  // #116: Double hunger when rowing
  if (boat.Oar !== 0 && boat.game.mulle.user) {
    // Increase hunger rate while rowing (handled by hunger system)
    // This would be: mulleHungerSpeed = 2 * orgMulleHungerSpeed
  }
  
  // #117: Alternating oar sounds (left/right)
  // BUG FIX #9: Stop previous oar sound before playing new one to prevent overlapping
  if (tmpPlaySound) {
    const snd = boat.oarSounds[boat.soundCount - 1]
    
    // Stop previous oar sound if playing
    if (boat.currentOarSound) {
      boat.currentOarSound.stop()
    }
    
    // Play new oar sound
    boat.currentOarSound = boat.game.mulle.playAudio(snd)
    boat.soundCount = 3 - boat.soundCount // Toggle between 1 and 2
  }
}

/**
 * BUG FIX #4: calcSpeedNDir - proper speed and direction calculation for oar rowing
 * Original: calcSpeedNDir(child, force, steer)
 * @param {Object} boat - Boat instance
 * @param {number} force - Rowing force (0-100)
 * @param {number} steer - Steering adjustment
 */
export function calcSpeedNDir (boat, force, steer) {
  const decimalPrec = boat.decimalPrec || DEFAULT_BOAT_PROPS.decimalPrec
  const nrOfDirections = boat.nrOfDirections || DEFAULT_BOAT_PROPS.nrOfDirections
  
  // Apply force to speed (scaled properly)
  const speedDelta = (force / 100)
  boat.speed += speedDelta
  
  // Apply steering to direction
  if (steer !== 0) {
    boat.internalDirection += steer
    
    // Correct internalDirection to stay in range
    const nrOfDirectionsScaled = nrOfDirections * decimalPrec
    while (boat.internalDirection > nrOfDirectionsScaled) {
      boat.internalDirection -= nrOfDirectionsScaled
    }
    while (boat.internalDirection < decimalPrec) {
      boat.internalDirection += nrOfDirectionsScaled
    }
    
    // Update discrete direction from internal direction
    const newDir = Math.round(boat.internalDirection / decimalPrec)
    if (newDir !== boat.direction) {
      if (boat.setDirection) {
        boat.setDirection(newDir)
      } else {
        boat.direction = newDir
      }
    }
  }
}

/**
 * ITEM #109: Start engine sound with proper sound selection
 * Original: MotorBoatAncestor.ls uses 8 different engine sounds
 * @param {Object} boat - Boat instance
 */
export function startEngine (boat) {
  if (boat.engineRunning) return
  boat.engineRunning = true

  if (boat.hasEngine) {
    // Get engine sound type from boat properties
    const boatObj = boat.game.mulle.user.Boat
    const engineSound = boatObj && boatObj.properties ? boatObj.properties.enginesound || 1 : 1
    boat.currentEngineType = Math.min(8, Math.max(1, engineSound))
    
    // Get pitch percent and volume for this engine type
    boat.pitchPercent = boat.pitchPercents[boat.currentEngineType - 1]
    
    // BUG FIX #13: Convert Director volume (0-255) to Web Audio (0-1)
    const volume = boat.motorVolumes[boat.currentEngineType - 1] / 255
    
    // Select engine sound (use third sound from the array as base)
    const soundName = boat.motorSounds[boat.currentEngineType - 1][2]
    
    // Play looping engine sound
    boat.currentMotorSound = boat.game.mulle.playAudio(soundName, true)
    if (boat.currentMotorSound) {
      boat.currentMotorSound.volume = volume
    }
    
    console.log('[DriveBoat] Started engine type', boat.currentEngineType, 'sound:', soundName)
  }
}

/**
 * ITEM #110: Update engine sound with dynamic pitch
 * Original: MotorBoatAncestor.ls:137
 * freq = 22050 + (pitchPercent * speed * 20000 / 100 / 100)
 * @param {Object} boat - Boat instance
 */
export function updateEngineSound (boat) {
  if (!boat.engineRunning || !boat.currentMotorSound) return
  
  // Calculate dynamic pitch based on speed
  const absSpeed = Math.abs(boat.speed)
  boat.dynamicPitch = 22050 + (boat.pitchPercent * absSpeed * 20000 / 100 / 100)
  
  // Apply pitch to sound (if Phaser sound supports playbackRate)
  if (boat.currentMotorSound.playbackRate !== undefined) {
    boat.currentMotorSound.playbackRate = boat.dynamicPitch / 22050
  }
}

/**
 * Stop engine sound
 * @param {Object} boat - Boat instance
 */
export function stopEngine (boat) {
  if (!boat.engineRunning) return
  boat.engineRunning = false

  if (boat.currentMotorSound) {
    boat.currentMotorSound.stop()
    boat.currentMotorSound = null
  }
}

/**
 * #107: Apply weather drift from wind
 * Original: BoatBase.ls lines 361-370
 * drift = 90 * Drift * windVelPoint / 100 / 100
 * @param {Object} boat - Boat instance
 */
export function applyWeatherDrift (boat) {
  // Get wind from weather system (if available)
  const weather = boat.game.mulle.weather
  if (!weather || !weather.windVelocity) return
  
  const windVelPoint = weather.windVelocity || { x: 0, y: 0 }
  const driftFactor = boat.driftFactor || 0
  
  // Calculate drift: 90 * Drift * windVelPoint / 100 / 100
  const driftX = 90 * driftFactor * windVelPoint.x / 100 / 100
  const driftY = 90 * driftFactor * windVelPoint.y / 100 / 100
  
  // Apply drift to position
  boat.x += driftX
  boat.y += driftY
}

/**
 * Correct direction to valid range (1-16)
 * @param {Object} boat - Boat instance
 * @param {number} i - Direction value to correct
 * @returns {number} Corrected direction
 */
export function correctDirection (boat, i) {
  const nrOfDirections = boat.nrOfDirections || DEFAULT_BOAT_PROPS.nrOfDirections
  if (i > nrOfDirections) return i - nrOfDirections
  if (i < 1) return i + nrOfDirections
  return i
}

/**
 * Set boat direction (1-16)
 * BUG FIX #3: Update internalDirection with decimalPrec scaling
 * @param {Object} boat - Boat instance
 * @param {number} dir - Direction (1-16)
 */
export function setDirection (boat, dir) {
  const decimalPrec = boat.decimalPrec || DEFAULT_BOAT_PROPS.decimalPrec
  const nrOfDirections = boat.nrOfDirections || DEFAULT_BOAT_PROPS.nrOfDirections
  
  if (dir > nrOfDirections) dir = 1
  if (dir < 1) dir = nrOfDirections
  
  boat.direction = dir

  // BUG FIX #3: internalDirection uses decimalPrec for sub-degree precision
  // Original: set internalDirection to direction * decimalPrec
  boat.internalDirection = dir * decimalPrec

  // Update sprite frame
  if (boat.updateSprite) {
    boat.updateSprite()
  }
}

export default {
  initSail,
  getWindForce,
  applyOarForce,
  calcSpeedNDir,
  startEngine,
  updateEngineSound,
  stopEngine,
  applyWeatherDrift,
  correctDirection,
  setDirection
}
