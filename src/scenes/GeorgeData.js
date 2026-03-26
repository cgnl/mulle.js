/**
 * @fileoverview GeorgeData - Pure data module for George/Erson scene (scene 80)
 * Based on: decompiled Lingo startMovie for scene 80
 *
 * Scene 80 is George (Erson) in "Bygg båtar med Mulle Meck".
 * The Lingo uses sequential if-blocks where each block can OVERWRITE
 * the marker set by a previous block (cascading overwrites).
 *
 * Execution order (each block runs independently, last write wins):
 *   Block A: if M19 completed       → myMarker = "story"
 *   Block B: if M7 given            → myMarker = "CantDoiT"
 *            if also has Diary       → delete Diary, complete M7, myMarker = "JustDoitDiary"
 *   Block C: if M19 given           → if has MapPiece2 → myMarker = "Story"
 *                                      else → give MapPiece2, complete M19, myMarker = "JustDoitMap"
 *   Block D: if M18 NOT completed   → complete M18, give M7, myMarker = "nomission"
 *   Block E: if myMarker == VOID    → myMarker = "Story"
 *
 * IMPORTANT: Casing matters! "story" vs "Story" vs "CantDoiT" etc.
 */

'use strict'

/**
 * Compute the George scene result from the current game state.
 * Follows the EXACT sequential if-block structure from the original Lingo,
 * where later blocks can overwrite markers set by earlier blocks.
 *
 * @param {object} state
 * @param {boolean} state.isMission19Completed
 * @param {boolean} state.isMission7Given
 * @param {boolean} state.hasDiary
 * @param {boolean} state.isMission19Given
 * @param {boolean} state.hasMapPiece2
 * @param {boolean} state.isMission18Completed
 * @returns {{
 *   marker: string,
 *   goTo: string,
 *   actions: {
 *     completeMission7: boolean,
 *     completeMission18: boolean,
 *     completeMission19: boolean,
 *     giveMission7: boolean,
 *     deleteDiary: boolean,
 *     giveMapPiece2: boolean
 *   }
 * }}
 */
function computeGeorgeResult (state) {
  const {
    isMission19Completed,
    isMission7Given,
    hasDiary,
    isMission19Given,
    hasMapPiece2,
    isMission18Completed
  } = state

  let marker
  const actions = {
    completeMission7: false,
    completeMission18: false,
    completeMission19: false,
    giveMission7: false,
    deleteDiary: false,
    giveMapPiece2: false
  }

  // Block A: if isMissionCompleted(user, 19)
  if (isMission19Completed) {
    marker = 'story'
  }

  // Block B: if isMissionGiven(user, 7)
  if (isMission7Given) {
    marker = 'CantDoiT'
    if (hasDiary) {
      actions.deleteDiary = true
      actions.completeMission7 = true
      marker = 'JustDoitDiary'
    }
  }

  // Block C: if isMissionGiven(user, 19)
  if (isMission19Given) {
    if (hasMapPiece2) {
      marker = 'Story'
    } else {
      actions.giveMapPiece2 = true
      actions.completeMission19 = true
      marker = 'JustDoitMap'
    }
  }

  // Block D: if isMissionCompleted(user, 18) == 0  (NOT completed)
  if (!isMission18Completed) {
    actions.completeMission18 = true
    actions.giveMission7 = true
    marker = 'nomission'
  }

  // Block E: if myMarker = VOID
  if (marker === undefined) {
    marker = 'Story'
  }

  return {
    marker,
    goTo: marker,
    actions
  }
}

module.exports = {
  computeGeorgeResult
}
