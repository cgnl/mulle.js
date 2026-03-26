/**
 * @fileoverview AlgaeIslandData - Pure data module for AlgaeIsland scene (scene 84)
 * Based on: decompiled Lingo startMovie for scene 84
 *
 * Scene 84 is the algae island in "Bygg båtar med Mulle Meck".
 * The Lingo logic uses three sequential if-blocks with cascading overwrites:
 *
 *   1. M11 check: if M11 not completed → Watertank? complete M11 + "JustDoItTank" : "cantDoit"
 *   2. M21 check: if M21 not completed → OVERWRITES marker.
 *      Watertank? also complete M11 + "noMissionTank" : "nomission".
 *      ALWAYS: complete M21, give part 30, give mission 11.
 *   3. CombineHarvester: if has CombineHarvester → OVERWRITES everything.
 *      M10 not completed? complete M10, give helmet, "JustDoItWeed".
 *      M10 already completed? "Done" + random(1-5).
 *   4. Fallback: if marker still undefined → "Done" + random(1-5).
 *
 * Key Lingo quirk: the M21 block's side-effects (complete M21, give part 30,
 * give M11) ALWAYS execute when M21 is not completed, even though the
 * CombineHarvester block may overwrite the marker afterwards.
 *
 * Dir-level constants (ParentScript 3 - Dir.ls):
 *   myDummyPart = 86
 *   givePart    = 30
 *   spriteList  = [#BoatStart: 14, #Sky: 1]
 *
 * NPC idle audio — Lingo-only clips used by BehaviorScript 91 & 92:
 *   84e007v0  — primary idle clip (weighted heavily in both behaviors)
 *   05d109v0  — shared dialogue clip (only in BehaviorScript 92's list)
 *   04d029v0  — shared boatyard dialogue
 *   04d027v0  — shared boatyard dialogue
 *   83d019v0  — Mia dialogue reused as idle filler
 */

'use strict'

// ---------------------------------------------------------------------------
// Dir-level constants — Lingo: ParentScript 3 - Dir.ls
// ---------------------------------------------------------------------------
const DUMMY_PART = 86
const GIVE_PART = 30
const SPRITE_MAP = { BoatStart: 14, Sky: 1 }

// ---------------------------------------------------------------------------
// Boat hull positions — Lingo: BehaviorScript 9.ls
// ---------------------------------------------------------------------------
const HULL_POSITIONS = {
  large: { x: 280, y: 171 },
  medium: { x: 280, y: 179 },
  small: { x: 200, y: 196 }
}

// ---------------------------------------------------------------------------
// NPC idle-speech clip lists — Lingo: BehaviorScript 91 & 92 (mulleLogBH)
//
// 84e007v0 and 05d109v0 are Lingo-only audio assets not referenced elsewhere
// in the JS codebase. They must be present in the seaworld audio pack.
// ---------------------------------------------------------------------------
const NPC_SOUNDS_A = ['04d029v0', '84e007v0', '04d027v0']
const NPC_SOUNDS_B = ['04d029v0', '05d109v0', '83d019v0', '84e007v0', '04d027v0']

/**
 * Compute the AlgaeIsland result from the player's current state.
 * Follows the EXACT cascading-overwrite structure from the original Lingo.
 *
 * @param {Object} state
 * @param {boolean} state.isMission11Completed
 * @param {boolean} state.isMission21Completed
 * @param {boolean} state.isMission10Completed
 * @param {boolean} state.hasWatertank
 * @param {boolean} state.hasCombineHarvester
 * @param {number}  state.randomDoneSuffix - 1-5, pre-rolled random value
 * @returns {{ marker: string, actions: { completeMission11: boolean, completeMission21: boolean, completeMission10: boolean, giveMission11: boolean, givePart30: boolean, giveHelmet: boolean } }}
 */
function computeAlgaeIslandResult (state) {
  const {
    isMission11Completed,
    isMission21Completed,
    isMission10Completed,
    hasWatertank,
    hasCombineHarvester,
    randomDoneSuffix
  } = state

  let marker
  const actions = {
    completeMission11: false,
    completeMission21: false,
    completeMission10: false,
    giveMission11: false,
    givePart30: false,
    giveHelmet: false
  }

  // --- Block 1: M11 check (lines 12-18 in Lingo) ---
  if (!isMission11Completed) {
    if (hasWatertank) {
      actions.completeMission11 = true
      marker = 'JustDoItTank'
    } else {
      marker = 'cantDoit'
    }
  }

  // --- Block 2: M21 check (lines 19-28 in Lingo) — overwrites marker ---
  if (!isMission21Completed) {
    if (hasWatertank) {
      actions.completeMission11 = true
      marker = 'noMissionTank'
    } else {
      marker = 'nomission'
    }
    actions.completeMission21 = true
    actions.givePart30 = true
    actions.giveMission11 = true
  }

  // --- Block 3: CombineHarvester check (lines 29-36 in Lingo) — overwrites everything ---
  if (hasCombineHarvester) {
    if (!isMission10Completed) {
      actions.completeMission10 = true
      actions.giveHelmet = true
      marker = 'JustDoItWeed'
    } else {
      marker = 'Done' + randomDoneSuffix
    }
  }

  // --- Block 4: VOID fallback (lines 37-39 in Lingo) ---
  if (marker === undefined) {
    marker = 'Done' + randomDoneSuffix
  }

  return { marker, actions }
}

module.exports = {
  computeAlgaeIslandResult,
  DUMMY_PART,
  GIVE_PART,
  SPRITE_MAP,
  HULL_POSITIONS,
  NPC_SOUNDS_A,
  NPC_SOUNDS_B
}
