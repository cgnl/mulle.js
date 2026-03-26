/**
 * @fileoverview SurferData - Pure data module for Surfer scene (scene 71)
 * Based on: decompiled Lingo startMovie handler for scene 71
 *
 * Scene 71 is the "surfer" mission in "Bygg båtar med Mulle Meck".
 * The player's boat must have power >= 200 to succeed. On success,
 * mission 14 is completed and a random external part is given (if available).
 *
 * Lingo logic:
 *   if power >= 200 then
 *     if givePart = #NoPart then
 *       myMarker = "JustDoit"
 *       addCompletedMission(user, 14)
 *     else
 *       addNewPart(user, givePart)
 *       addCompletedMission(user, 14)
 *       myMarker = "JustDoit"
 *     end if
 *   else
 *     myMarker = "cantDoIt"
 *   end if
 */

'use strict'

// Mission 14 is completed on success (power >= 200)
const MISSION_ID = 14

// Power threshold — Lingo uses >= (greater-than-or-equal)
const POWER_THRESHOLD = 200

/**
 * Compute the Surfer scene result from boat power and random part.
 * Follows the EXACT logic from the original Lingo.
 *
 * @param {{ power: number, randomPart: string|null }} state
 * @param {number} state.power - The boat's #power property
 * @param {string|null} state.randomPart - Random external part, or 'NoPart'/null
 * @returns {{ marker: string, actions: { completeMission14: boolean, givePart: string|null } }}
 */
function computeSurferResult (state) {
  const { power, randomPart } = state

  if (power >= POWER_THRESHOLD) {
    // Success path — mission 14 always completed regardless of part availability
    const givePart = (randomPart && randomPart !== 'NoPart') ? randomPart : null
    return {
      marker: 'JustDoit',
      actions: {
        completeMission14: true,
        givePart
      }
    }
  }

  // Failure path — boat not powerful enough
  return {
    marker: 'cantDoIt',
    actions: {
      completeMission14: false,
      givePart: null
    }
  }
}

// --- RottenFish delivery logic (scene 81 / boat_81) ---

// Mission 9 is completed on successful RottenFish delivery
const ROTTEN_FISH_MISSION_ID = 9

// Medal 3 is awarded when rottenFishWeight >= 35
const ROTTEN_FISH_MEDAL_ID = 3

// Weight threshold for medal award
const ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD = 35

/**
 * Compute the RottenFish delivery result.
 * Follows the EXACT logic from the original Lingo Dir.ls startMovie handler
 * for scene 81 (boat_81).
 *
 * Lingo logic:
 *   if isInInventory(user, #RottenFish) then
 *     myMarker = "notDelivered"
 *   else
 *     if tmpCapacity >= rottenFishWeight then
 *       myMarker = "JustDoIt" & tmpSuffix
 *       if rottenFishWeight >= 35 then
 *         addMedal(boat, 3)
 *         myMarker = "JustDoIt" & "medal" & tmpSuffix
 *       end if
 *       addCompletedMission(user, 9)
 *       setInInventory(user, #RottenFish, [])
 *     else
 *       myMarker = "cantDoIt" & tmpSuffix
 *     end if
 *   end if
 *
 * @param {{ hasRottenFish: boolean, capacity: number, rottenFishWeight: number, suffix: string }} state
 * @returns {{ marker: string, actions: { completeMission9: boolean, awardMedal3: boolean, giveRottenFish: boolean } }}
 */
function computeRottenFishDeliveryResult (state) {
  const { hasRottenFish, capacity, rottenFishWeight, suffix } = state

  if (hasRottenFish) {
    return {
      marker: 'notDelivered',
      actions: {
        completeMission9: false,
        awardMedal3: false,
        giveRottenFish: false
      }
    }
  }

  if (capacity >= rottenFishWeight) {
    const hasMedal = rottenFishWeight >= ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD
    const marker = hasMedal
      ? ('JustDoIt' + 'medal' + suffix)
      : ('JustDoIt' + suffix)
    return {
      marker,
      actions: {
        completeMission9: true,
        awardMedal3: hasMedal,
        giveRottenFish: true
      }
    }
  }

  return {
    marker: 'cantDoIt' + suffix,
    actions: {
      completeMission9: false,
      awardMedal3: false,
      giveRottenFish: false
    }
  }
}

module.exports = {
  MISSION_ID,
  POWER_THRESHOLD,
  computeSurferResult,
  ROTTEN_FISH_MISSION_ID,
  ROTTEN_FISH_MEDAL_ID,
  ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD,
  computeRottenFishDeliveryResult
}
