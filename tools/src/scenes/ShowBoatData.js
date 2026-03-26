/**
 * @fileoverview ShowBoatData - Pure data module for ShowBoat scene (scene 76)
 * Based on: decompiled_lingo/76/76/casts/Internal/ParentScript 4 - Dir.ls
 *
 * Scene 76 is the "show boat" result screen in "Bygg båtar med Mulle Meck".
 * When the player visits this scene, the boat's FunnyFactor determines which
 * animation/marker is shown (one through five) and whether a medal is awarded.
 * Mission 6 is always marked as completed upon visiting this scene.
 *
 * Lingo logic (nested if):
 *   if tmpFun > 4 then
 *     myMarker = "two"
 *     if tmpFun > 10 then
 *       myMarker = "three"
 *       if tmpFun > 20 then
 *         myMarker = "four"
 *         if tmpFun > 25 then
 *           myMarker = "five"
 *           addMedal(boat, 4)
 *         end if
 *       end if
 *     end if
 *   else
 *     myMarker = "one"
 *   end if
 */

'use strict'

// Mission 6 is always completed when visiting this scene
const MISSION_ID = 6

// Marker names mapped to numeric ratings
const MARKER_TO_RATING = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5
}

/**
 * Compute the ShowBoat result from the boat's FunnyFactor.
 * Follows the EXACT nested-if structure from the original Lingo.
 *
 * @param {number} funnyFactor - The boat's FunnyFactor property
 * @returns {{ marker: string, rating: number, medal: number|null }}
 */
function computeShowBoatResult (funnyFactor) {
  let marker
  let medal = null

  if (funnyFactor > 4) {
    marker = 'two'
    if (funnyFactor > 10) {
      marker = 'three'
      if (funnyFactor > 20) {
        marker = 'four'
        if (funnyFactor > 25) {
          marker = 'five'
          medal = 4
        }
      }
    }
  } else {
    marker = 'one'
  }

  return {
    marker,
    rating: MARKER_TO_RATING[marker],
    medal
  }
}

module.exports = {
  MISSION_ID,
  computeShowBoatResult
}
