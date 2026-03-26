/**
 * @fileoverview WhaleData - Pure data module for the Whale scene (scene 88)
 * Based on: decompiled Lingo startMovie handler for scene 88
 *
 * The Whale scene handles mission 24 (watertank delivery / fishing rod reward).
 *
 * Logic:
 * - M24 already completed → marker "Done"
 * - M24 not completed:
 *   - M11 completed + has Watertank → marker "JustDoit", complete M24,
 *     give Fishingrod (empty prop list)
 *   - Otherwise → marker "cantDoIt"
 *
 * goTo routing (Lingo case-insensitive comparison quirk):
 *   The Lingo checks `if myMarker <> "cantDoiT"` (lowercase i, capital T)
 *   but the assignment uses `"cantDoIt"` (capital I, lowercase t).
 *   Lingo string comparison is case-insensitive, so they match.
 *   Result: "cantDoIt" → go("start"), anything else → go(myMarker).
 *
 * Marker casing from original Lingo:
 *   "Done"       - done path
 *   "JustDoit"   - success path (capital J, capital D, lowercase o-i-t)
 *   "cantDoIt"   - failure path (lowercase c, capital D, capital I, lowercase t)
 */

'use strict'

// Marker strings - exact casing from original Lingo
const MARKER_DONE = 'Done'
const MARKER_SUCCESS = 'JustDoit'
const MARKER_FAILURE = 'cantDoIt'

// Mission IDs referenced in this scene
const MISSION_ID = 24
const PREREQUISITE_MISSION_ID = 11

/**
 * Compute the result of visiting the Whale scene.
 *
 * Replicates the Lingo startMovie handler exactly, including the
 * case-insensitive "cantDoIt"/"cantDoiT" goTo routing quirk.
 *
 * @param {object} state
 * @param {boolean} state.isMission24Completed - Whether M24 is already completed
 * @param {boolean} state.isMission11Completed - Whether M11 is completed
 * @param {boolean} state.hasWatertank - Whether the boat has a Watertank property
 * @returns {{
 *   marker: string,
 *   goTo: string,
 *   actions: {
 *     completeMission24: boolean,
 *     giveFishingrod: boolean
 *   }
 * }}
 */
function computeWhaleResult (state) {
  const {
    isMission24Completed,
    isMission11Completed,
    hasWatertank
  } = state

  let marker
  const actions = {
    completeMission24: false,
    giveFishingrod: false
  }

  if (isMission24Completed) {
    marker = MARKER_DONE
  } else {
    if (isMission11Completed) {
      if (hasWatertank) {
        marker = MARKER_SUCCESS
        actions.completeMission24 = true
        actions.giveFishingrod = true
      } else {
        marker = MARKER_FAILURE
      }
    } else {
      marker = MARKER_FAILURE
    }
  }

  // goTo routing: Lingo uses case-insensitive comparison
  // `if myMarker <> "cantDoiT"` — matches "cantDoIt" case-insensitively
  const goTo = marker.toLowerCase() === MARKER_FAILURE.toLowerCase()
    ? 'start'
    : marker

  return { marker, goTo, actions }
}

module.exports = {
  computeWhaleResult,
  MARKER_DONE,
  MARKER_SUCCESS,
  MARKER_FAILURE,
  MISSION_ID,
  PREREQUISITE_MISSION_ID
}
