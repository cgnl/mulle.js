/**
 * BoatDamage - Collision damage, capsize, and survival systems
 * @module objects/boat/BoatDamage
 * 
 * Extracted from driveboat.js lines 2520-2685
 * Handles crash sounds, durability, capsize detection, and lurch warnings
 * 
 * Original Lingo references:
 * - BoatBase.ls crashed() method (lines 350-377)
 * - BoatBase.ls lines 414-427 (capsize/lurch)
 */
'use strict'

// Lingo audio: BoatBase.ls capsize / lurch
// 05d125v0 — boat capsizes (played during GoHomeCapsize transition)
const SOUND_CAPSIZE = '05d125v0'

/**
 * #106, #189: Collision damage and crash sounds
 * Original: BoatBase.ls crashed() method (lines 350-377)
 * 
 * Sound lookup table (line 354):
 * [1: [#Heavy: [1, 2, 3], #Light: [4, 5, 6]], 2: [#Heavy: [7, 8, 9], #Light: [10, 11, 12]]]
 * 
 * Material: 1 = wood, 2 = metal
 * Weight: < 100 = Heavy, >= 100 = Light
 * Damage: > 300 = index 3 (vol 90), > 100 = index 2 (vol 75), else index 1 (vol 60)
 * 
 * @param {Object} boat - Boat instance
 * @param {number} speed - Impact speed
 */
export function crashed (boat, speed) {
  const now = boat.game.time.now
  
  // Line 351: set tmpReceivedDamage to abs(speed)
  const tmpReceivedDamage = Math.abs(speed)
  
  // Line 352: Check cooldown before playing sound
  if (now - boat.lastCrashTime > boat.crashCooldown) {
    // Line 354: Build crash sound lookup table
    // [1: [#Heavy: [1, 2, 3], #Light: [4, 5, 6]], 2: [#Heavy: [7, 8, 9], #Light: [10, 11, 12]]]
    const crashSounds = {
      1: { Heavy: [1, 2, 3], Light: [4, 5, 6] },
      2: { Heavy: [7, 8, 9], Light: [10, 11, 12] }
    }
    
    // Line 355: Get material (1 = wood, 2 = metal)
    const material = (boat.quickProps && boat.quickProps.Material) ? boat.quickProps.Material : 1
    
    // Line 356-360: Get weight class (< 100 = Heavy, >= 100 = Light)
    const weight = (boat.quickProps && boat.quickProps.weight) ? boat.quickProps.weight : 50
    const weightClass = weight < 100 ? 'Heavy' : 'Light'
    
    // Line 361-366: Select sound index based on damage
    let soundIndex
    let tmpVol
    if (tmpReceivedDamage > 300) {
      soundIndex = 2  // Third sound (index 2 in 0-based array)
      tmpVol = 90
    } else if (tmpReceivedDamage > 100) {
      soundIndex = 1  // Second sound
      tmpVol = 75
    } else {
      soundIndex = 0  // First sound
      tmpVol = 60
    }
    
    // Line 367: Format sound ID: "05e" + padded3(sndNum) + "v0"
    const soundList = crashSounds[material]?.[weightClass] || crashSounds[1].Heavy
    const sndNum = soundList[soundIndex]
    // eslint-disable-next-line no-unused-vars
    let tmpSnd = '05e' + String(sndNum).padStart(3, '0') + 'v0'
    
    // Line 368: HARDCODE OVERRIDE! The original Lingo immediately overwrites:
    // set tmpSnd to "05e008v1"
    tmpSnd = '05e008v1'
    
    // Line 369-370: Play audio and set volume
    const sndId = boat.game.mulle.playAudio(tmpSnd)
    if (boat.game.mulle.setVol) {
      boat.game.mulle.setVol(sndId, tmpVol)
    }
    
    // Update cooldown
    boat.lastCrashTime = now
  }
  
  // Line 373: Only reduce durability when NOT in freeZone
  if (!boat.inFreeZone) {
    // Line 374: set Durability to Durability - tmpReceivedDamage
    boat.Durability -= tmpReceivedDamage
    
    // Lines 375-377: Check if boat broke
    if (boat.Durability <= 0) {
      // say(the mulleTalkObject of gDir, #crash, 1, me, #Q, #GoHomeTow)
      boat.game.mulle.say({ type: 'crash' }, { queue: 'Q', callback: 'GoHomeTow' })
      // waitToGoHome(me)
      boat.waitToGoHome()
    }
  }
}

/**
 * #98-99: Check for capsize and lurch warnings
 * Original: BoatBase.ls lines 414-427
 * 
 * Thresholds:
 * - abs(sideAngle) > 30 → Capsize, triggers #GoHomeCapsize
 * - abs(sideAngle) > 27 → LurchHard warning (priority 4, volume 100)
 * - abs(sideAngle) > 23 → LurchEasy warning (priority 4, volume 100)
 * 
 * @param {Object} boat - Boat instance
 * @param {number} sideAngle - Current boat tilt angle
 * @returns {boolean} True if capsized
 */
export function checkCapsize (boat, sideAngle) {
  const absSideAngle = Math.abs(sideAngle)
  
  // Line 414: if abs(tmpSideAngle) > 30 then
  if (absSideAngle > 30) {
    // Line 415: if not inFreeZone then
    if (!boat.inFreeZone) {
      // Disable boat
      boat.enabled = false

      // Lingo: play capsize sound effect
      if (typeof boat.game.mulle.playAudio === 'function') {
        boat.game.mulle.playAudio(SOUND_CAPSIZE)
      }

      // Line 416: say(the mulleTalkObject of gDir, #Capsize, 1, me, #Q, #GoHomeCapsize)
      boat.game.mulle.say({ type: 'Capsize' }, { queue: 'Q', callback: 'GoHomeCapsize' })
      
      // Line 417: waitToGoHome(me)
      boat.waitToGoHome()
      
      return true
    }
    // In freeZone, capsize angle exceeded but no consequences
    return false
  }
  
  // Line 418-419: if abs(tmpSideAngle) > 27 then
  //   say(the mulleTalkObject of gDir, #LurchHard, 4, me, 0, 0, 100)
  if (absSideAngle > 27) {
    boat.game.mulle.say({ type: 'LurchHard' }, { priority: 4, volume: 100 })
    return false
  }
  
  // Line 421-423: if abs(tmpSideAngle) > 23 then
  //   say(the mulleTalkObject of gDir, #LurchEasy, 4, me, 0, 0, 100)
  if (absSideAngle > 23) {
    boat.game.mulle.say({ type: 'LurchEasy' }, { priority: 4, volume: 100 })
    return false
  }
  
  return false
}

/**
 * Handle boat breaking due to zero durability
 * @param {Object} boat - Boat instance
 */
export function handleBoatBreak (boat) {
  console.log('[DriveBoat] BOAT BROKE! Durability reached 0')
  boat.enabled = false
  
  // Play boat breaking sound/dialogue
  // Original would trigger sink sequence: go("Sink")
  if (boat.state && boat.state.onBoatBreak) {
    boat.state.onBoatBreak()
  }
}

/**
 * Handle low durability warning
 * @param {Object} boat - Boat instance
 */
export function handleLowDurability (boat) {
  console.log('[DriveBoat] Low durability warning!')
  
  if (boat.state && boat.state.onLowDurability) {
    boat.state.onLowDurability(boat.Durability, boat.maxDurability)
  }
}

/**
 * Get durability percentage (0-1)
 * @param {Object} boat - Boat instance
 * @returns {number}
 */
export function getDurabilityPercentage (boat) {
  if (!boat.maxDurability || boat.maxDurability <= 0) return 1
  return Math.max(0, boat.Durability / boat.maxDurability)
}

/**
 * Repair boat durability
 * @param {Object} boat - Boat instance
 * @param {number} amount - Amount to repair
 */
export function repair (boat, amount) {
  if (boat.maxDurability && boat.maxDurability > 0) {
    boat.Durability = Math.min(boat.maxDurability, boat.Durability + amount)
    console.log('[DriveBoat] Repaired to', boat.Durability, '/', boat.maxDurability)
  }
}

/**
 * Check if boat is damaged (below 50% durability)
 * @param {Object} boat - Boat instance
 * @returns {boolean}
 */
export function isDamaged (boat) {
  return getDurabilityPercentage(boat) < 0.5
}

/**
 * Check if boat is critically damaged (below 20% durability)
 * @param {Object} boat - Boat instance
 * @returns {boolean}
 */
export function isCriticallyDamaged (boat) {
  return getDurabilityPercentage(boat) < 0.2
}

export default {
  crashed,
  handleBoatBreak,
  handleLowDurability,
  checkCapsize,
  getDurabilityPercentage,
  repair,
  isDamaged,
  isCriticallyDamaged
}
