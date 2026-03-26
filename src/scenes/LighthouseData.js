/**
 * @fileoverview LighthouseData - Pure data module for Lighthouse scene (scene 85)
 * Based on: decompiled Lingo startMovie handler for scene 85
 *
 * Scene 85 is the lighthouse in "Bygg båtar med Mulle Meck".
 * The scene checks mission 7/8 status and diary inventory to decide which
 * marker/animation to show and what items to give the player.
 *
 * Lingo logic (abbreviated):
 *   if isMissionCompleted(user, 7) then
 *     if isMissionGiven(user, 8) then
 *       myMarker = "suit"          -- give Suit, complete M8
 *     else
 *       myMarker = "leave"         -- lowercase
 *     end if
 *   else
 *     if isMissionGiven(user, 7) then
 *       if isInInventory(user, #Diary) = 0 then
 *         myMarker = "Diary"       -- give Diary
 *       else
 *         myMarker = "Leave"       -- uppercase L
 *       end if
 *     else
 *       myMarker = "Leave"         -- uppercase L
 *     end if
 *   end if
 *
 *   VOID fallback → "Leave"
 *
 * goTo mapping:
 *   "Diary"           → go("StartDiary")
 *   "Leave" / "leave" → go("Start")
 *   "suit"            → go("suit")
 */

'use strict'

/** @type {Record<string, string>} Maps marker values to their goTo frame labels */
const MARKER_GOTO = {
  Diary: 'StartDiary',
  Leave: 'Start',
  leave: 'Start',
  suit: 'suit'
}

/**
 * Compute the Lighthouse scene result from the current game state.
 * Follows the EXACT nested-if structure from the original Lingo,
 * preserving the exact marker casing from each branch.
 *
 * @param {{ isMission7Completed: boolean, isMission8Given: boolean, isMission7Given: boolean, hasDiary: boolean }} state
 * @returns {{ marker: string, goTo: string, actions: { completeMission8: boolean, giveSuit: boolean, giveDiary: boolean } }}
 */
function computeLighthouseResult (state) {
  const { isMission7Completed, isMission8Given, isMission7Given, hasDiary } = state

  let marker
  const actions = {
    completeMission8: false,
    giveSuit: false,
    giveDiary: false
  }

  if (isMission7Completed) {
    if (isMission8Given) {
      marker = 'suit'
      actions.giveSuit = true
      actions.completeMission8 = true
    } else {
      marker = 'leave'
    }
  } else {
    if (isMission7Given) {
      if (!hasDiary) {
        actions.giveDiary = true
        marker = 'Diary'
      } else {
        marker = 'Leave'
      }
    } else {
      marker = 'Leave'
    }
  }

  // VOID fallback (should never happen with the above logic, but matches Lingo)
  if (marker === undefined) {
    marker = 'Leave'
  }

  const goTo = MARKER_GOTO[marker]

  return { marker, goTo, actions }
}

module.exports = {
  computeLighthouseResult,
  MARKER_GOTO
}
