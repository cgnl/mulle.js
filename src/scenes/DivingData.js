/**
 * @fileoverview DivingData - Pure data module for Diving scene (scene 70)
 * Based on: decompiled_lingo/70/70 startMovie
 *
 * Scene 70 is the diving scene in "Bygg båtar med Mulle Meck".
 * The player needs BOTH a helmet (#helmet) AND a diving suit (#Suit) in
 * inventory to successfully dive. On success, mission 15 is completed
 * and a random external part is awarded (if available).
 *
 * Lingo logic:
 *   if isInInventory(user, #helmet) then
 *     if isInInventory(user, #Suit) then
 *       addCompletedMission(user, 15)
 *       if givePart ≠ #NoPart then addNewPart(user, givePart)
 *       myMarker = "JustDoit"
 *     else
 *       myMarker = "cantDoit"
 *     end if
 *   else
 *     myMarker = "cantDoit"
 *   end if
 */

'use strict'

// Mission 15 is completed when the player successfully dives
const MISSION_ID = 15

/**
 * Compute the Diving scene result from inventory state and available part.
 * Follows the EXACT nested-if structure from the original Lingo.
 *
 * @param {{ hasHelmet: boolean, hasSuit: boolean, randomPart: number|null }} state
 *   - hasHelmet: whether #helmet is in the user's inventory
 *   - hasSuit: whether #Suit is in the user's inventory
 *   - randomPart: the random external part id, or null for #NoPart
 * @returns {{ marker: string, actions: { completeMission15: boolean, givePart: number|null } }}
 */
function computeDivingResult (state) {
  const { hasHelmet, hasSuit, randomPart } = state

  let marker
  let completeMission15 = false
  let givePart = null

  if (hasHelmet) {
    if (hasSuit) {
      completeMission15 = true
      if (randomPart !== null) {
        givePart = randomPart
      }
      marker = 'JustDoit'
    } else {
      marker = 'cantDoit'
    }
  } else {
    marker = 'cantDoit'
  }

  return {
    marker,
    actions: {
      completeMission15,
      givePart
    }
  }
}

/**
 * Compute the boat_87 diving scene result (Dir.ls startMovie).
 * This is the extended version used by scene 87 which has additional
 * mission/medal logic compared to the simpler scene 70.
 *
 * Lingo logic (boat_87):
 *   addCompletedMission(user, 23)   -- always
 *   if isInInventory(user, #helmet) AND isInInventory(user, #Suit) then
 *     addCompletedMission(user, 12)
 *     myMarker = "JustDoit"
 *     addMedal(boat, 5)
 *   else
 *     myMarker = "cantDoit"
 *   end if
 *   -- routing:
 *   if getCompletedMissionInfo(user, 23, #count) >= 2 then
 *     go(myMarker)
 *   else
 *     go("start")
 *   end if
 *
 * @param {{ hasHelmet: boolean, hasSuit: boolean, missionCount23: number }} state
 * @returns {{ marker: string, goTo: string, actions: { completeMission23: boolean, completeMission12: boolean, awardMedal5: boolean } }}
 */
function computeDivingSceneResult (state) {
  const { hasHelmet, hasSuit, missionCount23 } = state

  const actions = {
    completeMission23: true,
    completeMission12: false,
    awardMedal5: false
  }

  let marker

  if (hasHelmet && hasSuit) {
    actions.completeMission12 = true
    actions.awardMedal5 = true
    marker = 'JustDoit'
  } else {
    marker = 'cantDoit'
  }

  const goTo = (missionCount23 >= 2) ? marker : 'start'

  return { marker, goTo, actions }
}

module.exports = {
  MISSION_ID,
  computeDivingResult,
  computeDivingSceneResult
}
