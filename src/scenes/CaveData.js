/**
 * @fileoverview CaveData - Pure data module for Cave/Bat Island scene (scene 86)
 * Based on: decompiled_lingo/86/86/casts/Internal/ParentScript 1 - Dir.ls
 *
 * Scene 86 is the Cave / Bat Island in "Bygg båtar med Mulle Meck".
 * This scene handles a multi-mission chain involving missions 4, 8, and 10,
 * with items MapPiece3, Blinddog, and part 975.
 *
 * Key Lingo observations:
 * - myMarker is set through cascading if-blocks where later blocks OVERWRITE earlier assignments.
 * - The medal 1 check at the END determines the actual go() target independently of myMarker.
 * - If the player has no medal 1, go() always targets "medalStart" regardless of myMarker.
 *
 * Constants from Lingo:
 *   myDummyPart = 13
 *   givePart = 975
 *   testing = 0
 */

'use strict'

/**
 * Compute the Cave scene result from the player's current state.
 * Follows the EXACT cascading if-block structure from the original Lingo.
 *
 * @param {object} state
 * @param {boolean} state.isMission8Given
 * @param {boolean} state.isMission8Completed
 * @param {boolean} state.isMission4Given
 * @param {boolean} state.isMission4Completed
 * @param {boolean} state.hasBlinddog
 * @param {boolean} state.hasPart975
 * @param {boolean} state.hasMedal1
 * @returns {{
 *   marker: string,
 *   goTo: string,
 *   actions: {
 *     giveMapPiece3: boolean,
 *     giveMission8: boolean,
 *     completeMission4: boolean,
 *     deleteBlinddog: boolean,
 *     giveMission10: boolean,
 *     givePart975: boolean,
 *     awardMedal1: boolean
 *   }
 * }}
 */
function computeCaveResult (state) {
  const {
    isMission8Given,
    isMission8Completed,
    isMission4Given,
    isMission4Completed,
    hasBlinddog,
    hasPart975,
    hasMedal1
  } = state

  // Accumulated side-effect actions
  const actions = {
    giveMapPiece3: false,
    giveMission8: false,
    completeMission4: false,
    deleteBlinddog: false,
    giveMission10: false,
    givePart975: false,
    awardMedal1: false
  }

  // -- Lingo: set myMarker to "noMission" --
  let myMarker = 'noMission'

  // -- Block 1: Mission 8 check --
  // if isMissionGiven(user, 8) then
  //   set myMarker to "done"
  // else
  //   if isMissionCompleted(user, 8) = 0 then
  //     setInInventory(user, #MapPiece3, [])
  //     addGivenMission(user, 8)
  //   else
  //     set myMarker to "done"
  //   end if
  // end if
  if (isMission8Given) {
    myMarker = 'done'
  } else {
    if (!isMission8Completed) {
      // First visit: M8 not given and not completed
      actions.giveMapPiece3 = true
      actions.giveMission8 = true
    } else {
      // M8 not given but completed (unusual state)
      myMarker = 'done'
    }
  }

  // -- Block 2: M4 completed override --
  // if isMissionCompleted(user, 4) then
  //   set myMarker to "done"
  // end if
  if (isMission4Completed) {
    myMarker = 'done'
  }

  // -- Block 3: Blinddog delivery --
  // if isMissionCompleted(user, 8) then
  //   if isMissionCompleted(user, 4) then
  //     set myMarker to "done"
  //   else
  //     if isMissionGiven(user, 4) then
  //       if isInInventory(user, #Blinddog) then
  //         addCompletedMission(user, 4)
  //         deleteFromInventory(user, #Blinddog)
  //         addGivenMission(user, 10)
  //         if gotPart(user, 975) = 0 then
  //           addNewPart(user, 975)
  //         end if
  //         set myMarker to "JustDoIT"
  //       else
  //         set myMarker to "CantDoIT"
  //       end if
  //     end if
  //   end if
  // end if
  if (isMission8Completed) {
    if (isMission4Completed) {
      myMarker = 'done'
    } else {
      if (isMission4Given) {
        if (hasBlinddog) {
          actions.completeMission4 = true
          actions.deleteBlinddog = true
          actions.giveMission10 = true
          if (!hasPart975) {
            actions.givePart975 = true
          }
          myMarker = 'JustDoIT'
        } else {
          myMarker = 'CantDoIT'
        }
      }
    }
  }

  // -- Medal 1 check (determines actual go() target) --
  // if getMedal(boat, 1) = 0 then
  //   addMedal(boat, 1)
  //   go("medalStart")
  // else
  //   go(myMarker)
  // end if
  let goTo
  if (!hasMedal1) {
    actions.awardMedal1 = true
    goTo = 'medalStart'
  } else {
    goTo = myMarker
  }

  return {
    marker: myMarker,
    goTo,
    actions
  }
}

module.exports = {
  computeCaveResult
}
