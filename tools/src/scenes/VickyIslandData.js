/**
 * @fileoverview VickyIslandData - Pure data module for VickyIsland scene (scene 87)
 * Based on: decompiled Lingo startMovie handler for scene 87
 *
 * Scene 87 is Vicky's Island in "Bygg båtar med Mulle Meck".
 * The player needs BOTH a helmet AND a suit to succeed (dive).
 * On success: mission 12 is completed, part 979 is given (or a random part
 * if 979 is already owned), and medal 5 is awarded to the boat.
 * Mission 23 is ALWAYS completed on every visit (unconditional).
 *
 * goTo routing (after M23 is incremented):
 *   completionCount23 (before visit) + 1 >= 2  →  go(myMarker)
 *   otherwise                                   →  go("start")
 *
 * So: first visit (count was 0, becomes 1) → "start"
 *     second+ visit (count was >=1, becomes >=2) → myMarker
 */

'use strict'

// Mission 23 is always completed when visiting this scene
const MISSION_23 = 23

// Mission 12 is completed on successful dive (helmet + suit)
const MISSION_12 = 12

// Part 979 is given on first successful dive
const PART_979 = 979

// Medal 5 is awarded to the boat on successful dive
const MEDAL_5 = 5

/**
 * Compute the VickyIsland scene result.
 * Follows the EXACT logic from the original Lingo startMovie handler.
 *
 * @param {object} state
 * @param {boolean} state.hasHelmet - Whether the player has the helmet in inventory
 * @param {boolean} state.hasSuit - Whether the player has the suit in inventory
 * @param {boolean} state.hasPart979 - Whether the player already owns part 979
 * @param {number|null} state.randomPart - A random part from externalParts (used if 979 already owned)
 * @param {number} state.completionCount23 - M23 completion count BEFORE this visit
 * @returns {{
 *   marker: string,
 *   goTo: string,
 *   actions: {
 *     completeMission23: boolean,
 *     completeMission12: boolean,
 *     givePart: number|null,
 *     awardMedal5: boolean
 *   }
 * }}
 */
function computeVickyIslandResult (state) {
  const { hasHelmet, hasSuit, hasPart979, randomPart, completionCount23 } = state

  // M23 is ALWAYS completed (unconditional)
  const completeMission23 = true

  let marker
  let completeMission12 = false
  let givePart = null
  let awardMedal5 = false

  if (hasHelmet) {
    if (hasSuit) {
      // Success path: both helmet and suit
      completeMission12 = true

      if (!hasPart979) {
        givePart = PART_979
      } else {
        givePart = randomPart
      }

      marker = 'JustDoit'
      awardMedal5 = true
    } else {
      marker = 'cantDoit'
    }
  } else {
    marker = 'cantDoit'
  }

  // goTo routing: count AFTER this visit's addCompletedMission
  const countAfter = completionCount23 + 1
  const goTo = countAfter >= 2 ? marker : 'start'

  return {
    marker,
    goTo,
    actions: {
      completeMission23,
      completeMission12,
      givePart,
      awardMedal5
    }
  }
}

module.exports = {
  MISSION_23,
  MISSION_12,
  PART_979,
  MEDAL_5,
  computeVickyIslandResult
}
