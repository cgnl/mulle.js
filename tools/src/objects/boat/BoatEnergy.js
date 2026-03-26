/**
 * BoatEnergy - Fuel, stamina, hunger (Belly), and seasickness (Pills) systems
 * @module objects/boat/BoatEnergy
 * 
 * Extracted from driveboat.js lines 1898-2427
 * These are mixin functions that operate on a boat instance
 * 
 * Original Lingo references:
 * - lines 555-588 of ParentScript 34 - BoatBase.ls (energy consumption)
 * - lines 250-262 of BoatBase.ls (save method)
 * - lines 215-220 of BoatBase.ls (calculateMyProps - DrivenTimes)
 */
'use strict'

import { PropulsionType } from './BoatConstants'

/**
 * Consume energy based on current propulsion type and speed
 * Also handles Pills (buffaSick) and Belly (mulleHunger) consumption
 * BUG FIX #6: FUEL CONSUMPTION 30X TOO FAST - Add missing /30
 * @param {Object} boat - Boat instance
 * @param {number} [frontBack] - Current front/back inclination (optional, for seasickness)
 */
export function consumeEnergy(boat, frontBack) {
  const absSpeed = Math.abs(boat.speed)

  // Standard energy consumption per propulsion type
  switch (boat.currentPropulsion) {
    case PropulsionType.MOTOR:
      // Motor boats consume fuel proportional to THROTTLE, not interpolated speed.
      // Original MotorBoatAncestor.ls line 124:
      //   tmpFuel = tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
      // motorSpeed is the throttle position (0-100), NOT the derived boat speed.
      const motorThrottle = Math.min(boat.motorSpeed || 0, 100)
      const fuelUsed = (motorThrottle * boat.fuelConsumptionRate) / 30
      boat.fuelCurrent = Math.max(0, boat.fuelCurrent - fuelUsed)

      // Check for low fuel warning
      if (!boat.fuelWarningShown && boat.fuelCurrent / boat.fuelMax <= boat.fuelWarningThreshold) {
        boat.fuelWarningShown = true
        onLowFuel(boat)
      }
      break

    case PropulsionType.OAR:
      // Rowing consumes stamina
      const staminaUsed = absSpeed * boat.staminaConsumptionRate
      boat.staminaCurrent = Math.max(0, boat.staminaCurrent - staminaUsed)

      // Check for low stamina warning
      if (!boat.staminaWarningShown && boat.staminaCurrent / boat.staminaMax <= boat.staminaWarningThreshold) {
        boat.staminaWarningShown = true
        onLowStamina(boat)
      }
      break

    case PropulsionType.SAIL:
      // Sailboats don't consume energy (wind power is free!)
      break

    case PropulsionType.NONE:
    default:
      // No propulsion, no consumption
      break
  }

  // ==========================================
  // PILLS CONSUMPTION (buffaSick system)
  // Original: lines 555-566 of BoatBase.ls
  // Only active at level >= 4, decreases based on wave motion
  // ==========================================
  if (boat.seaLevel >= 4 && boat.buffaSick > 0) {
    // buffaSick decreases based on wave motion (frontBack sway)
    // Original: set buffaSick to buffaSick - (tmpDiff / 13)
    let diff = 13 // Default fallback if no history/frontBack

    if (typeof frontBack === 'number' && boat.swayHistory && boat.swayHistory.length > 0) {
      const lastSway = boat.swayHistory[boat.swayHistory.length - 1] || 0
      diff = Math.abs(frontBack - lastSway)
    }

    boat.buffaSick -= diff / 13

    if (boat.buffaSick <= 0) {
      // Out of pills! Mulle vomits and has to go home
      console.log('[DriveBoat] buffaSick <= 0: Vomit! Must return to shore')
      handleVomit(boat)
    }
  }

  // ==========================================
  // BELLY CONSUMPTION (mulleHunger system)
  // Original: lines 568-588 of BoatBase.ls
  // Decreases constantly during sailing
  // ==========================================
  if (boat.mulleHunger > 0) {
    // Decrease hunger at configured speed
    // Original: set mulleHunger to mulleHunger - mulleHungerSpeed
    boat.mulleHunger -= boat.mulleHungerSpeed

    if (boat.mulleHunger <= 0) {
      // Hungry! Check if has fishing rod
      handleHunger(boat)
    }
  }
}

/**
 * Recover stamina when not actively rowing
 * @param {Object} boat - Boat instance
 */
export function recoverStamina(boat) {
  if (boat.hasOars && boat.staminaCurrent < boat.staminaMax) {
    boat.staminaCurrent = Math.min(boat.staminaMax, boat.staminaCurrent + boat.staminaRecoveryRate)

    // Reset warning if stamina recovers above threshold
    if (boat.staminaWarningShown && boat.staminaCurrent / boat.staminaMax > boat.staminaWarningThreshold + 0.1) {
      boat.staminaWarningShown = false
    }
  }
}

/**
 * Called when fuel runs out
 * @param {Object} boat - Boat instance
 */
export function handleOutOfFuel(boat) {
  if (!boat.outOfFuel) {
    // Try to consume a Belly snack first
    if (hasBelly(boat)) {
      const consumed = consumeBelly(boat)
      if (consumed) {
        return
      }
    }

    boat.outOfFuel = true
    boat.enabled = false

    // Stop engine sound
    if (boat.stopEngine) {
      boat.stopEngine()
    }

    console.log('[DriveBoat] Out of fuel!')

    // Play out of fuel sound
    const sound = boat.game.mulle.playAudio('05d011v0')

    if (sound) {
      sound.onStop.addOnce(() => {
        fallbackPropulsion(boat)
      })
    } else {
      fallbackPropulsion(boat)
    }
  }
}

/**
 * Called when stamina runs out
 * @param {Object} boat - Boat instance
 */
export function handleOutOfStamina(boat) {
  if (!boat.outOfStamina) {
    boat.outOfStamina = true
    console.log('[DriveBoat] Out of stamina! Resting...')

    // Try to consume a Belly snack first
    if (hasBelly(boat)) {
      const consumed = consumeBelly(boat)
      if (consumed) {
        return
      }
    }

    // Can't row anymore, switch to drift or sail if available
    fallbackPropulsion(boat)
  }

  // Continue recovering stamina even when out
  recoverStamina(boat)

  // If stamina recovered enough, allow rowing again
  if (boat.staminaCurrent > boat.staminaMax * 0.3) {
    boat.outOfStamina = false
    if (boat.currentPropulsion === PropulsionType.NONE && boat.hasOars) {
      boat.currentPropulsion = PropulsionType.OAR
      console.log('[DriveBoat] Stamina recovered, can row again')
    }
  }
}

/**
 * Fall back to alternative propulsion when primary fails
 * @param {Object} boat - Boat instance
 */
export function fallbackPropulsion(boat) {
  const previousPropulsion = boat.currentPropulsion

  // Try alternative propulsion methods
  if (boat.hasSail) {
    boat.currentPropulsion = PropulsionType.SAIL
    console.log('[DriveBoat] Falling back to sail')
  } else if (boat.hasOars && boat.staminaCurrent > 0) {
    boat.currentPropulsion = PropulsionType.OAR
    console.log('[DriveBoat] Falling back to oars')
  } else {
    boat.currentPropulsion = PropulsionType.NONE
    console.log('[DriveBoat] No propulsion available, drifting')
  }

  // Re-enable boat if we found alternative propulsion
  if (boat.currentPropulsion !== PropulsionType.NONE) {
    boat.enabled = true
    boat.outOfFuel = false
  }

  // Recalculate max speed for new propulsion
  updateMaxSpeedForPropulsion(boat)

  // Notify state (seaworld) about propulsion change
  if (boat.state && boat.state.onPropulsionChange) {
    boat.state.onPropulsionChange(previousPropulsion, boat.currentPropulsion)
  }
}

/**
 * Update max speed when propulsion changes
 * @param {Object} boat - Boat instance
 */
export function updateMaxSpeedForPropulsion(boat) {
  switch (boat.currentPropulsion) {
    case PropulsionType.MOTOR:
      boat.maxSpeed = 6
      break
    case PropulsionType.SAIL:
      boat.maxSpeed = 4
      break
    case PropulsionType.OAR:
      boat.maxSpeed = 2
      break
    case PropulsionType.NONE:
    default:
      boat.maxSpeed = 0.5 // Drift only
      break
  }
}

/**
 * Called when fuel is low - for UI notifications
 * @param {Object} boat - Boat instance
 */
export function onLowFuel(boat) {
  console.log('[DriveBoat] Low fuel warning!')
  if (boat.state && boat.state.onLowFuel) {
    boat.state.onLowFuel(boat.fuelCurrent, boat.fuelMax)
  }
}

/**
 * Called when stamina is low - for UI notifications
 * @param {Object} boat - Boat instance
 */
export function onLowStamina(boat) {
  console.log('[DriveBoat] Low stamina warning!')
  if (boat.state && boat.state.onLowStamina) {
    boat.state.onLowStamina(boat.staminaCurrent, boat.staminaMax)
  }
}

/**
 * Refuel the boat (called from fuel station or boatyard)
 * @param {Object} boat - Boat instance
 * @param {number} amount - Amount of fuel to add
 */
export function refuel(boat, amount) {
  if (boat.fuelMax > 0) {
    const wasEmpty = boat.fuelCurrent === 0
    boat.fuelCurrent = Math.min(boat.fuelMax, boat.fuelCurrent + amount)
    boat.outOfFuel = false
    boat.fuelWarningShown = false

    // Re-enable boat if it was empty and is now refueled
    if (wasEmpty && boat.fuelCurrent > 0) {
      boat.enabled = true
    }

    // If we were drifting due to no fuel, restore motor propulsion
    if (boat.hasEngine && boat.currentPropulsion !== PropulsionType.MOTOR) {
      boat.currentPropulsion = PropulsionType.MOTOR
      boat.enabled = true
      updateMaxSpeedForPropulsion(boat)
    }

    console.log('[DriveBoat] Refueled to', boat.fuelCurrent + '/' + boat.fuelMax)
  }
}

/**
 * Get fuel percentage (0-1)
 * @param {Object} boat - Boat instance
 * @returns {number}
 */
export function getFuelPercentage(boat) {
  if (boat.fuelMax <= 0) return 1 // Non-motor boats are always "full"
  return boat.fuelCurrent / boat.fuelMax
}

/**
 * Get stamina percentage (0-1)
 * @param {Object} boat - Boat instance
 * @returns {number}
 */
export function getStaminaPercentage(boat) {
  if (boat.staminaMax <= 0) return 1 // Non-rowing boats are always "full"
  return boat.staminaCurrent / boat.staminaMax
}

/**
 * Handle vomit event when buffaSick reaches 0
 * Original: lines 560-565 of BoatBase.ls
 * @param {Object} boat - Boat instance
 */
export function handleVomit(boat) {
  boat.enabled = false

  // Original: if isMissionCompleted(the user of gMulleGlobals, 3) then addGivenMission(3)
  const user = boat.game.mulle.user
  if (user && user.isMissionCompleted(3) > 0) {
    user.addGivenMission(3)
  }

  console.log('[DriveBoat] VOMIT! Mulle is seasick, must return to shore')

  // TODO: Play vomit sound/dialogue
  // TODO: Play vomit sound/dialogue
  if (boat.state && boat.state.returnToShore) {
    boat.state.returnToShore('vomit')
  } else if (boat.waitToGoHome) {
    boat.waitToGoHome()
  }
}

/**
 * Handle hunger event when mulleHunger reaches 0
 * Original: lines 571-587 of BoatBase.ls
 * @param {Object} boat - Boat instance
 */
export function handleHunger(boat) {
  const user = boat.game.mulle.user
  if (!user) return

  // Check if has fishing rod (auto-use to catch fish)
  if (user.isInInventory('Fishingrod')) {
    const hasFished = user.isInInventory('Fished')
    const fishSound = hasFished ? '05d120v0' : '05d045v0'

    if (!hasFished) {
      // First time fishing
      user.setInInventory('Fished', {})
    }

    // Restore hunger to full
    boat.mulleHunger = 10000

    console.log('[DriveBoat] Used fishing rod! Hunger restored. Sound:', fishSound)
    boat.game.mulle.playAudio(fishSound)
  } else {
    // No fishing rod! Must return to shore hungry
    boat.enabled = false
    console.log('[DriveBoat] HUNGRY! No fishing rod, must return to shore')

    if (boat.state && boat.state.returnToShore) {
      boat.state.returnToShore('hungry')
    } else if (boat.waitToGoHome) {
      boat.waitToGoHome()
    }
  }
}

/**
 * Consume 1 Belly snack unit to restore fuel/stamina
 * @param {Object} boat - Boat instance
 * @returns {boolean} True if Belly was consumed
 */
export function consumeBelly(boat) {
  const user = boat.game.mulle.user
  if (!user || !user.SeaInventory || !user.SeaInventory.items || !user.SeaInventory.items.Belly) {
    console.log('[DriveBoat] No Belly snacks available')
    return false
  }

  const belly = user.SeaInventory.items.Belly
  if (!belly.nr || belly.nr <= 0) {
    console.log('[DriveBoat] Belly snacks depleted!')
    return false
  }

  belly.nr--
  console.log('[DriveBoat] Consumed 1 Belly snack. Remaining:', belly.nr)

  if (belly.nr <= 0) {
    delete user.SeaInventory.items.Belly
    console.log('[DriveBoat] Belly snacks exhausted - item removed from inventory')
  }

  user.save()

  // Restore ~25% of max fuel (Lingo scale: fuelMax is thousands, e.g. 4500)
  const bellyFuelRestore = Math.max(25, Math.floor(boat.fuelMax * 0.25))
  const bellyStaminaRestore = 30

  if (boat.hasEngine && boat.fuelMax > 0) {
    const fuelNeeded = boat.fuelMax - boat.fuelCurrent
    const fuelToRestore = Math.min(bellyFuelRestore, fuelNeeded)
    boat.fuelCurrent = Math.min(boat.fuelMax, boat.fuelCurrent + fuelToRestore)
    console.log('[DriveBoat] Belly restored fuel:', fuelToRestore, '→', boat.fuelCurrent + '/' + boat.fuelMax)
    boat.outOfFuel = false
    boat.fuelWarningShown = false

    if (boat.currentPropulsion === PropulsionType.NONE || boat.currentPropulsion !== PropulsionType.MOTOR) {
      const oldPropulsion = boat.currentPropulsion
      boat.currentPropulsion = PropulsionType.MOTOR
      boat.enabled = true
      updateMaxSpeedForPropulsion(boat)
      if (boat.state && boat.state.onPropulsionChange) {
        boat.state.onPropulsionChange(oldPropulsion, boat.currentPropulsion)
      }
    }
  }

  if (boat.hasOars && boat.staminaMax > 0) {
    const staminaNeeded = boat.staminaMax - boat.staminaCurrent
    const staminaToRestore = Math.min(bellyStaminaRestore, staminaNeeded)
    boat.staminaCurrent = Math.min(boat.staminaMax, boat.staminaCurrent + staminaToRestore)
    console.log('[DriveBoat] Belly restored stamina:', staminaToRestore, '→', boat.staminaCurrent + '/' + boat.staminaMax)
    boat.outOfStamina = false
    boat.staminaWarningShown = false
  }

  return true
}

/**
 * Get current Belly snack count
 * @param {Object} boat - Boat instance
 * @returns {number}
 */
export function getBellyCount(boat) {
  const user = boat.game.mulle.user
  if (!user || !user.SeaInventory || !user.SeaInventory.items || !user.SeaInventory.items.Belly) {
    return 0
  }
  return user.SeaInventory.items.Belly.nr || 0
}

/**
 * Check if player has Belly snacks
 * @param {Object} boat - Boat instance
 * @returns {boolean}
 */
export function hasBelly(boat) {
  return getBellyCount(boat) > 0
}

/**
 * Check if boat can still move
 * @param {Object} boat - Boat instance
 * @returns {boolean}
 */
export function canMove(boat) {
  switch (boat.currentPropulsion) {
    case PropulsionType.MOTOR:
      return boat.fuelCurrent > 0
    case PropulsionType.OAR:
      return boat.staminaCurrent > 0
    case PropulsionType.SAIL:
      return true // Wind is always available
    case PropulsionType.NONE:
    default:
      return true // Can always drift
  }
}

/**
 * Save inventory state (Pills and Belly) back to user data
 * Original: lines 250-262 of BoatBase.ls (save method)
 * @param {Object} boat - Boat instance
 */
export function saveInventoryState(boat) {
  const user = boat.game.mulle.user
  if (!user) return

  // Save Pills (buffaSick converted back to pills count)
  const pillsLeft = Math.floor((boat.buffaSick - 1000) / 25)
  if (pillsLeft > 0) {
    user.setInInventory('Pills', { nr: pillsLeft }, true)
  } else {
    user.removeFromInventory('Pills')
  }

  // Save Belly (mulleHunger converted back to belly nr)
  const bellyNr = Math.floor(boat.mulleHunger / 10)
  user.setInInventory('Belly', { nr: bellyNr }, true)

  console.log('[DriveBoat] Saved inventory - Pills:', pillsLeft, 'Belly:', bellyNr)
}

/**
 * Track DrivenTimes for current propulsion type
 * Original: lines 215-220 of BoatBase.ls (calculateMyProps)
 * @param {Object} boat - Boat instance
 */
export function trackDrivenTimes(boat) {
  const user = boat.game.mulle.user
  if (!user) return

  // Only track once per session/propulsion type change
  if (boat.drivenTimesTracked && boat.currentDrivenType === boat.currentPropulsion) {
    return
  }

  // Get propulsion type name
  let typeName = null
  switch (boat.currentPropulsion) {
    case PropulsionType.MOTOR:
      typeName = 'Motor'
      break
    case PropulsionType.SAIL:
      typeName = 'Sail'
      break
    case PropulsionType.OAR:
      typeName = 'Oar'
      break
    default:
      return // Don't track NONE
  }

  // Get current DrivenTimes from inventory
  let drivenTimes = user.lookUpInventory('DrivenTimes')
  if (!drivenTimes || typeof drivenTimes !== 'object') {
    drivenTimes = { Motor: 0, Sail: 0, Oar: 0 }
  }

  // Increment count for this propulsion type
  drivenTimes[typeName] = (drivenTimes[typeName] || 0) + 1

  // Save back to inventory
  user.setInInventory('DrivenTimes', drivenTimes)

  boat.drivenTimesTracked = true
  boat.currentDrivenType = boat.currentPropulsion

  console.log('[DriveBoat] Tracked DrivenTimes:', typeName, '=', drivenTimes[typeName])
}

/**
 * Get effective max speed based on propulsion type
 * @param {Object} boat - Boat instance
 * @returns {number} Current max speed
 */
export function getEffectiveMaxSpeed(boat) {
  switch (boat.currentPropulsion) {
    case PropulsionType.MOTOR:
      // Motor: full speed with fuel
      return boat.maxSpeed

    case PropulsionType.SAIL:
      // Sail: speed varies with wind
      const windFactor = 0.8 + Math.sin(boat.game.time.now / 5000) * 0.2
      return boat.maxSpeed * windFactor

    case PropulsionType.OAR:
      // Oar: speed decreases as stamina depletes
      const staminaFactor = boat.staminaCurrent / boat.staminaMax
      const speedMod = staminaFactor > 0.5 ? 0.5 + (staminaFactor * 0.5) : staminaFactor * 2.5
      return boat.maxSpeed * Math.max(0.2, speedMod)

    case PropulsionType.NONE:
    default:
      // No propulsion: drift only
      return 0.5
  }
}

export default {
  consumeEnergy,
  recoverStamina,
  handleOutOfFuel,
  handleOutOfStamina,
  fallbackPropulsion,
  updateMaxSpeedForPropulsion,
  onLowFuel,
  onLowStamina,
  refuel,
  getFuelPercentage,
  getStaminaPercentage,
  handleVomit,
  handleHunger,
  consumeBelly,
  getBellyCount,
  hasBelly,
  canMove,
  saveInventoryState,
  trackDrivenTimes,
  getEffectiveMaxSpeed
}
