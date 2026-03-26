/**
 * BoatPhysics - Movement, waves, and stability calculations
 * @module objects/boat/BoatPhysics
 * 
 * Extracted from BoatBase.ls
 * Handles speed calculation, steering, position updates, and stability
 * 
 * Original Lingo references:
 * - BoatBase.ls calcSpeedNDir (lines 270-310)
 * - BoatBase.ls stepback (lines 230-245)
 * - BoatBase.ls loop position update (lines 330-340)
 * - BoatBase.ls wave/stability (lines 400-440)
 */
'use strict'

import { AMPLITUDE_LIST, PropulsionType, DEFAULT_BOAT_PROPS, DIRECTION_LIST } from './BoatConstants'

/**
 * Correct direction to wrap within 1-16 range
 * BoatBase.ls uses this from drivingHandlers
 * @param {number} dir - Raw direction value
 * @returns {number} Direction wrapped to 1-16
 */
export function correctDirection(dir) {
  // Handle direction wrapping: 0 -> 16, 17 -> 1
  let corrected = dir
  while (corrected <= 0) {
    corrected += 16
  }
  while (corrected > 16) {
    corrected -= 16
  }
  return corrected
}

/**
 * Get velocity point from direction and speed
 * BoatBase.ls line ~310: velPoint = getVelPoint(direction) * speed / 100
 * @param {number} direction - Direction 1-16
 * @param {number} speed - Current speed
 * @returns {Object} { x, y } velocity point
 */
export function getVelPoint(direction, speed) {
  const correctedDir = correctDirection(direction)
  const dirVec = DIRECTION_LIST[correctedDir - 1]
  return {
    x: dirVec.x * speed / 100,
    y: dirVec.y * speed / 100
  }
}

/**
 * Calculate speed and direction based on force and steering inputs
 * BoatBase.ls lines 270-310
 * 
 * Key formulas:
 * - tmpPowerIn = abs(argForce * quickProps.power / 100)
 * - tmpPower = floor(tmpPowerIn / 100) gives speedList index
 * - tmpDec = tmpPowerIn % 100 gives interpolation factor
 * - Lookup speedList with interpolation
 * - acceleration/retardation clamping
 * - Steering: tmpSteer = argSteering * ManoeuverAbility / 10
 * 
 * @param {Object} boat - Boat instance
 * @param {number} argForce - Input force (-100 to 100, negative for reverse)
 * @param {number} argSteering - Steering input
 */
export function calcSpeedNDir(boat, argForce, argSteering) {
  const decimalPrec = boat.decimalPrec || DEFAULT_BOAT_PROPS.decimalPrec
  const power = boat.quickProps?.power || 100
  const manoeuverAbility = boat.quickProps?.ManoeuverAbility || 50
  const acceleration = boat.acceleration || 5
  const retardation = boat.retardation || 10

  // Store initial speed for velPoint calculation (needed per test expectations)
  // boat.speed is used directly in Lingo logic


  // BoatBase.ls line ~275-290:
  // tmpPowerIn = abs(argForce * power / 100)
  const tmpPowerIn = Math.abs(argForce * power / 100)

  // tmpPower = floor(tmpPowerIn / 100) gives speedList index
  // tmpDec = tmpPowerIn % 100 gives interpolation factor
  const tmpPower = Math.floor(tmpPowerIn / 100)
  const tmpDec = tmpPowerIn - tmpPower * 100

  // Lookup from speedList with interpolation
  const speedList = boat.speedList || [0, 2, 4, 6, 8, 10]
  const maxIndex = speedList.length - 1

  // Clamp index to valid range
  const lowerIndex = Math.min(tmpPower, maxIndex)
  const higherIndex = Math.min(tmpPower + 1, maxIndex)

  const tmpLower = speedList[lowerIndex] || 0
  const tmpHigher = speedList[higherIndex] || tmpLower

  // Interpolate: tmpWanted = tmpLower + (tmpDec * (tmpHigher - tmpLower) / 100)
  let tmpWanted = tmpLower + (tmpDec * (tmpHigher - tmpLower) / 100)

  // BoatBase.ls line ~292: if argForce < 0: set tmpWanted to -tmpWanted
  if (argForce < 0) {
    tmpWanted = -tmpWanted
  }

  // Calculate speed change with acceleration/retardation
  // BoatBase.ls line ~295-305
  const speedDiff = tmpWanted - boat.speed
  let tmpRealSpeedChange

  if (speedDiff > 0) {
    // Accelerating: tmpRealSpeedChange = acceleration * (tmpWanted - speed) / decimalPrec
    tmpRealSpeedChange = acceleration * speedDiff / decimalPrec

    // Clamp to max acceleration, but also don't overshoot target
    if (tmpRealSpeedChange > acceleration) {
      tmpRealSpeedChange = acceleration
    }
    // Don't overshoot the target speed
    if (tmpRealSpeedChange > speedDiff) {
      tmpRealSpeedChange = speedDiff
    }
  } else {
    // Decelerating: tmpRealSpeedChange = retardation * (tmpWanted - speed) / decimalPrec
    tmpRealSpeedChange = retardation * speedDiff / decimalPrec

    // Clamp to max retardation (negative direction), but don't overshoot
    if (tmpRealSpeedChange < -retardation) {
      tmpRealSpeedChange = -retardation
    }
    // Don't overshoot the target speed (speedDiff is negative here)
    if (tmpRealSpeedChange < speedDiff) {
      tmpRealSpeedChange = speedDiff
    }
  }

  boat.speed += tmpRealSpeedChange

  // BoatBase.ls line ~306-308: Steering
  // tmpSteer = argSteering * ManoeuverAbility / 10
  // internalDirection = internalDirection + tmpSteer
  const tmpSteer = argSteering * manoeuverAbility / 10
  const currentInternalDir = boat.internalDirection !== undefined ? boat.internalDirection : decimalPrec
  boat.internalDirection = currentInternalDir + tmpSteer

  // BoatBase.ls line ~308: direction = correctDirection(internalDirection / decimalPrec)
  boat.direction = correctDirection(Math.floor(boat.internalDirection / decimalPrec))

  // BoatBase.ls line ~310: velPoint = getVelPoint(direction) * speed / 100
  // Fix: Use updated speed, not initial speed (Lingo uses current state)
  boat.velPoint = getVelPoint(boat.direction, boat.speed)

  // Update currentCorners from cornerPoints if available
  if (boat.cornerPoints && boat.cornerPoints[boat.direction]) {
    boat.currentCorners = boat.cornerPoints[boat.direction]
  }
}

/**
 * Step back boat position after collision
 * BoatBase.ls lines 230-245
 * 
 * Sets speed to 0 and rolls back position using locHistory
 * 
 * @param {Object} boat - Boat instance
 * @param {number} argNrOfSteps - Number of history steps to roll back
 * @returns {Object} The new location { x, y }
 */
export function stepback(boat, argNrOfSteps) {
  // BoatBase.ls line ~232: set speed to 0
  boat.speed = 0

  // BoatBase.ls line ~233-234: if argNrOfSteps < 1 then exit
  if (argNrOfSteps < 1) {
    return boat.loc
  }

  const locHistory = boat.locHistory || []
  const historyCount = locHistory.length

  if (historyCount === 0) {
    return boat.loc
  }

  // BoatBase.ls line ~235-238:
  // tmp = count(locHistory) - argNrOfSteps + 1
  // In Lingo this is 1-indexed, so we adjust for JS 0-indexing
  let tmp = historyCount - argNrOfSteps

  // BoatBase.ls line ~236-237: if tmp < 1 then tmp = 1
  // In JS 0-indexed: if tmp < 0 then tmp = 0
  if (tmp < 0) {
    tmp = 0
  }

  // BoatBase.ls: loc = getAt(locHistory, tmp)
  const rolledBackLoc = locHistory[tmp]
  boat.loc = { x: rolledBackLoc.x, y: rolledBackLoc.y }

  // BoatBase.ls line ~239-241:
  // repeat with N = tmp + 1 to count(locHistory)
  //   setAt(locHistory, N, loc)
  // Fill remaining history entries with the rolled-back location
  for (let i = tmp + 1; i < historyCount; i++) {
    locHistory[i] = { x: boat.loc.x, y: boat.loc.y }
  }

  // BoatBase.ls line ~242: return loc
  return boat.loc
}

/**
 * Update position with drift from wind
 * BoatBase.ls lines 330-340
 * 
 * Formula:
 * tmpDrift = 90 * Drift * windVelPoint / 100 / 100
 * loc = loc + ((velPoint + tmpDrift) / speedDivider)
 * 
 * @param {Object} boat - Boat instance
 * @param {Object} windVelPoint - Optional wind velocity override { x, y }
 */
export function updatePositionWithDrift(boat, windVelPoint) {
  const drift = boat.quickProps?.Drift || 0
  const speedDivider = boat.speedDivider || 10
  const wind = windVelPoint || boat.wind || { x: 0, y: 0 }
  const velPoint = boat.velPoint || { x: 0, y: 0 }

  // BoatBase.ls line ~330:
  // tmpDrift = 90 * getProp(quickProps, #Drift) * getVelPoint(wind) / 100 / 100
  const tmpDrift = {
    x: 90 * drift * wind.x / 100 / 100,
    y: 90 * drift * wind.y / 100 / 100
  }

  // BoatBase.ls line ~335:
  // loc = loc + ((velPoint + tmpDrift) / speedDivider)
  boat.loc.x += (velPoint.x + tmpDrift.x) / speedDivider
  boat.loc.y += (velPoint.y + tmpDrift.y) / speedDivider
}

/**
 * Calculate inclinations from wave info and stabilities
 * BoatBase.ls lines 400-440
 * 
 * Formulas:
 * frontBack = stabilities[0] * waveInfo.pitch / 17
 * side = stabilities[1] * waveInfo.roll / 100
 * 
 * With additional side force for sail boats:
 * side = stabilities[1] * ((waveInfo.roll / 4) - (additionalSideForce / 100)) / 100
 * 
 * @param {Object} boat - Boat instance
 * @param {Object} waveInfo - Wave info { altitude, pitch, roll }
 * @param {number} additionalSideForce - Additional side force (for sails)
 * @returns {Object} { side, frontBack }
 */
export function calculateInclinations(boat, waveInfo, additionalSideForce) {
  const stabilities = boat.stabilities || [85, 55]

  // BoatBase.ls line ~405:
  // frontBack = getAt(stabilities, 1) * getAt(tmp, 2) / 17
  // In Lingo: stabilities[1] = lateral stability, waveInfo[2] = pitch
  const frontBack = stabilities[0] * waveInfo.pitch / 17

  // BoatBase.ls line ~412-416:
  let side
  if (additionalSideForce) {
    // For sail boats with wind force:
    // side = stabilities[1] * ((waveInfo.roll / 4) - (additionalSideForce / 100)) / 100
    side = stabilities[1] * ((waveInfo.roll / 4) - (additionalSideForce / 100)) / 100
  } else {
    // Normal case:
    // side = stabilities[1] * waveInfo.roll / 100
    side = stabilities[1] * waveInfo.roll / 100
  }

  return { side, frontBack }
}

/**
 * Clamp inclinations to valid ranges
 * BoatBase.ls lines 420-430
 * 
 * Formulas:
 * side = tmpSideAngle / 5
 * if abs(side) > 2: side = sign(side) * 2
 * if abs(frontBack) > 2: frontBack = sign(frontBack) * 2
 * inclinations = [side, frontBack]
 * 
 * @param {number} sideAngle - Raw side angle (before /5)
 * @param {number} frontBack - Raw frontBack value
 * @returns {Object} { side, frontBack, inclinations }
 */
export function clampInclinations(sideAngle, frontBack) {
  // BoatBase.ls line ~420: side = tmpSideAngle / 5
  let side = sideAngle / 5

  // BoatBase.ls line ~421-422: clamp side to [-2, 2]
  if (Math.abs(side) > 2) {
    side = side > 0 ? 2 : -2
  }

  // BoatBase.ls line ~423-424: clamp frontBack to [-2, 2]
  let clampedFrontBack = frontBack
  if (Math.abs(clampedFrontBack) > 2) {
    clampedFrontBack = clampedFrontBack > 0 ? 2 : -2
  }

  // BoatBase.ls line ~425: inclinations = [side, frontBack]
  return {
    side,
    frontBack: clampedFrontBack,
    inclinations: [side, clampedFrontBack]
  }
}

/**
 * Check if boat is within sea bounds and clamp if necessary
 * Uses decimalPrec-scaled coordinates
 * 
 * Screen bounds: 10-630 for x, 10-386 for y (in screen coords)
 * With margin of 50 pixels, bounds become: 50-590 for x, 50-430 for y
 * 
 * @param {Object} boat - Boat instance
 */
export function checkBounds(boat) {
  const decimalPrec = boat.decimalPrec || DEFAULT_BOAT_PROPS.decimalPrec

  // Margins in screen coordinates (Match Lingo ParentScript 34 lines 453-466)
  // Lingo limits: x 10-630, y 10-386
  const leftMargin = 10
  const rightMargin = 630
  const topMargin = 10
  const bottomMargin = 386

  // Convert to decimalPrec scale
  const leftBound = leftMargin * decimalPrec
  const rightBound = rightMargin * decimalPrec
  const topBound = topMargin * decimalPrec
  const bottomBound = bottomMargin * decimalPrec

  // Reset OutOfBounds
  boat.OutOfBounds = 0

  // Clamp X
  if (boat.loc.x < leftBound) {
    boat.loc.x = leftBound
    boat.OutOfBounds = -1
  } else if (boat.loc.x > rightBound) {
    boat.loc.x = rightBound
    boat.OutOfBounds = 1
  }

  // Clamp Y
  if (boat.loc.y < topBound) {
    boat.loc.y = topBound
    boat.OutOfBounds = -2
  } else if (boat.loc.y > bottomBound) {
    boat.loc.y = bottomBound
    boat.OutOfBounds = 2
  }
}

// ============================================================================
// Legacy functions preserved for backwards compatibility
// ============================================================================

/**
 * Apply wave motion using original Lingo AmplitudeList
 * This creates realistic bobbing motion for the boat
 * Uses all three stability values: lateral, longitudinal, and Z
 * @param {Object} boat - Boat instance
 */
export function applyWaveMotion(boat) {
  // Progress through wave cycle
  boat.wavePhase = (boat.wavePhase + boat.waveSpeed) % AMPLITUDE_LIST.length

  // Get current amplitude from original Lingo data (-100 to 100)
  const amplitude = AMPLITUDE_LIST[Math.floor(boat.wavePhase)]

  // Apply wave effects based on boat properties
  const driftFactor = boat.driftFactor || 1

  // Get all three stability factors (original: Stab: [85, 55], Stabz: 30)
  let lateralStability = getStabilityFactor(boat)           // Side-to-side stability
  const longitudinalStability = getLongitudinalStabilityFactor(boat)  // Front-to-back stability
  const zStability = getZStabilityFactor(boat)                // Vertical stability

  // #114: Sail inclination affects stability
  if (boat.Sail && boat.currentPropulsion === PropulsionType.SAIL) {
    const windForce = boat.getWindForce ? boat.getWindForce() : 50
    const sailTilt = (windForce / 100) * 0.15

    // Sail tilt reduces lateral stability
    lateralStability = Math.max(0, lateralStability - sailTilt)

    // Store sail inclination for visual effects
    boat.Sail.inclination = [sailTilt * 2, 0]
  }

  // Lingo parity: waves affect display inclination, not actual boat position.
  // Keep computed values for potential rendering, but do NOT move the boat.
  const pitchPhase = (boat.wavePhase + 25) % AMPLITUDE_LIST.length
  const pitchAmplitude = AMPLITUDE_LIST[Math.floor(pitchPhase)]

  const heavePhase = (boat.wavePhase + 50) % AMPLITUDE_LIST.length
  const heaveAmplitude = AMPLITUDE_LIST[Math.floor(heavePhase)]

  // Store hints for renderer (if used)
  boat.waveAlt = (heaveAmplitude / 100) * driftFactor * 0.05 * (1 - zStability)

  // Roll rotation hint for visual (not affecting actual direction)
  // This could be used by the sprite renderer for tilt effect
  boat.waveRoll = (amplitude / 100) * 0.05 * (1 - lateralStability)

  // Pitch rotation hint
  boat.wavePitch = (pitchAmplitude / 100) * 0.03 * (1 - longitudinalStability)
}

/**
 * Get stability factor (0-1) based on boat properties
 * Higher stability = less wave effect
 * Uses original Lingo format: Stab: [lateral, longitudinal], Stabz
 * @param {Object} boat - Boat instance
 * @returns {number} Lateral stability factor (0-1)
 */
export function getStabilityFactor(boat) {
  if (!boat.stabilityValues) {
    const boatObj = boat.game?.mulle?.user?.Boat
    if (!boatObj || !boatObj.properties) return 0.5

    boat.stabilityValues = boatObj.getStabilityValues ? boatObj.getStabilityValues() : {
      lateral: boatObj.properties.stability || 50,
      longitudinal: boatObj.properties.stability || 50,
      z: 0,
      combined: boatObj.properties.stability || 50
    }
  }

  // Use lateral stability for side-to-side wave resistance
  // Original values were around 85, 55 so we normalize to that range
  const lateralStability = boat.stabilityValues.lateral || 50

  // Normalize to 0-1 range (85 = very stable = 0.85 factor)
  return Math.min(1, lateralStability / 100)
}

/**
 * Get longitudinal stability factor for front-to-back motion
 * @param {Object} boat - Boat instance
 * @returns {number} 0-1 factor
 */
export function getLongitudinalStabilityFactor(boat) {
  if (!boat.stabilityValues) return 0.5

  const longStability = boat.stabilityValues.longitudinal || 50
  return Math.min(1, longStability / 100)
}

/**
 * Get Z-axis stability for vertical bobbing
 * @param {Object} boat - Boat instance
 * @returns {number} 0-1 factor
 */
export function getZStabilityFactor(boat) {
  if (!boat.stabilityValues) return 0.3

  const zStability = boat.stabilityValues.z || 30
  return Math.min(1, zStability / 100)
}

/**
 * Apply friction/drag to slow down boat
 * @param {Object} boat - Boat instance
 * @param {number} friction - Friction coefficient (0-1)
 */
export function applyFriction(boat, friction) {
  friction = friction || 0.98
  boat.speed *= friction

  // Stop completely if very slow
  if (Math.abs(boat.speed) < 0.01) {
    boat.speed = 0
  }
}

/**
 * Calculate new position based on current speed and direction
 * @param {Object} boat - Boat instance
 */
export function updatePosition(boat) {
  if (Math.abs(boat.speed) < 0.001) return

  const decimalPrec = boat.decimalPrec || DEFAULT_BOAT_PROPS.decimalPrec
  const dirIndex = Math.floor(boat.internalDirection / decimalPrec) - 1
  const correctedIndex = dirIndex < 0 ? 15 : (dirIndex >= 16 ? 0 : dirIndex)

  const dirVec = boat.directionList ? boat.directionList[correctedIndex] : null

  if (dirVec) {
    // Apply terrain speed modifier
    const speedMod = boat.terrainSpeedModifier || 1
    const effectiveSpeed = boat.speed * speedMod

    boat.x += (dirVec.x / 100) * effectiveSpeed
    boat.y += (dirVec.y / 100) * effectiveSpeed
  }
}

/**
 * Get current speed info
 * @param {Object} boat - Boat instance
 * @returns {Object} Speed info
 */
export function getSpeedInfo(boat) {
  return {
    speed: boat.speed,
    maxSpeed: boat.maxSpeed,
    percentage: boat.maxSpeed > 0 ? Math.abs(boat.speed) / boat.maxSpeed : 0,
    direction: boat.speed >= 0 ? 'forward' : 'reverse',
    terrainModifier: boat.terrainSpeedModifier || 1
  }
}

/**
 * Clamp speed to max limits
 * @param {Object} boat - Boat instance
 */
export function clampSpeed(boat) {
  const maxSpeed = boat.maxSpeed || 6
  if (boat.speed > maxSpeed) boat.speed = maxSpeed
  if (boat.speed < -maxSpeed * 0.5) boat.speed = -maxSpeed * 0.5 // Reverse is slower
}

export default {
  // New BoatBase.ls accurate functions
  calcSpeedNDir,
  stepback,
  updatePositionWithDrift,
  calculateInclinations,
  clampInclinations,
  checkBounds,
  correctDirection,
  getVelPoint,
  // Legacy functions for backwards compatibility
  applyWaveMotion,
  getStabilityFactor,
  getLongitudinalStabilityFactor,
  getZStabilityFactor,
  applyFriction,
  updatePosition,
  getSpeedInfo,
  clampSpeed
}
