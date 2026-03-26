/**
 * @fileoverview MiaData - Pure data module for the Mia scene (scene 83)
 * Based on: decompiled Lingo startMovie handler for scene 83
 *
 * Mia's scene handles two missions:
 * - Mission 25: First-visit introduction (one-time)
 * - Mission 13: Bench delivery (repeatable after first completion)
 *
 * Key Lingo behavior:
 * - M25 NOT completed (first visit): complete M25, give objectParts[0],
 *   give M13. If player already has Bench → "justDoITluck" + complete M13.
 *   ALWAYS navigates to "start" (not the marker).
 * - M25 completed (return visits): check M13 given → check Bench →
 *   check if M13 already completed.
 *   - M13 given + Bench + M13 already completed → "infiniteJustDoit"
 *     (repeatable, random part, no addNewPart)
 *   - M13 given + Bench + M13 NOT yet completed → "JustdoIt"
 *     (first M13 completion, gives objectParts[1])
 *   - M13 given + no Bench → "cantdoIT"
 *   - M13 not given → "Done"
 * - goTo differs: "nomission" path always goes to "start", others go to marker.
 * - Marker casing matters: "infiniteJustDoit", "JustdoIt", "cantdoIT",
 *   "Done", "nomission", "justDoITluck"
 */

'use strict'

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Compute the result of visiting the Mia scene.
 *
 * Replicates the Lingo startMovie handler exactly, including the
 * special "nomission" → "start" goTo routing.
 *
 * @param {object} state
 * @param {boolean} state.isMission25Completed - Whether M25 is already completed
 * @param {boolean} state.isMission13Given - Whether M13 has been given
 * @param {boolean} state.isMission13Completed - Whether M13 has been completed at least once
 * @param {boolean} state.hasBench - Whether the boat has a Bench property
 * @param {number|null} state.randomPart - Result of getRandomPart (for infinite path)
 * @param {number[]} state.objectParts - [part1, part2] from object definition
 * @returns {{ marker: string, goTo: string, actions: object }}
 */
function computeMiaResult (state) {
  const {
    isMission25Completed,
    isMission13Given,
    isMission13Completed,
    hasBench,
    randomPart,
    objectParts
  } = state

  // Initialize actions — all default to no-op
  const actions = {
    completeMission25: false,
    completeMission13: false,
    giveMission13: false,
    givePart: null
  }

  let marker

  // ---- M25 completed path (return visits) ----
  if (isMission25Completed) {
    if (isMission13Given) {
      if (hasBench) {
        if (isMission13Completed) {
          // Infinite/repeatable path — M13 already completed before
          actions.completeMission13 = true
          actions.givePart = randomPart
          marker = 'infiniteJustDoit'
        } else {
          // First M13 completion
          marker = 'JustdoIt'
          actions.completeMission13 = true
          actions.givePart = objectParts[1]
        }
      } else {
        marker = 'cantdoIT'
      }
    } else {
      marker = 'Done'
    }
  }

  // ---- M25 NOT completed path (first visit) ----
  if (!isMission25Completed) {
    actions.completeMission25 = true
    marker = 'nomission'
  }

  // ---- Special "nomission" flow ----
  if (marker === 'nomission') {
    actions.givePart = objectParts[0]
    actions.giveMission13 = true
    if (hasBench) {
      marker = 'justDoITluck'
      actions.completeMission13 = true
    }
  }

  // ---- goTo routing ----
  // "nomission" (or "justDoITluck" which replaced it) always goes to "start"
  // In the Lingo: the nomission block always calls go("start")
  // Other markers use go(myMarker)
  const goTo = (!isMission25Completed) ? 'start' : marker

  return { marker, goTo, actions }
}

// ============================================================================
// LINGO CONTRACT REFERENCES — Mia scene (scene 83)
// Frame labels and state fields from boten_83.DXR behavior scripts.
// Sources: BehaviorScript 3/4/6/7/9/10/23/24/31/32, ParentScript 1 - Dir.ls
// ============================================================================

// Frame labels / transitions in boten_83.DXR score
const FRAME_LABELS = [
  'start',              // First visit entry (ParentScript 1)
  'boatride',           // Boat ride animation (BehaviorScript 6)
  'boatride2',          // Second ride segment (BehaviorScript 24)
  'boatride3',          // Third ride segment (BehaviorScript 7, 31)
  'justdoit2',          // JustdoIT continuation (BehaviorScript 9)
  'justDoITluck2',      // Lucky variant continuation (BehaviorScript 32)
  'infiniteJustDoIt2',  // Infinite/repeat continuation (BehaviorScript 23)
  'leave',              // Exit scene (BehaviorScript 3)
  'story1',             // Story intro sequence
  'nomission',          // No mission path
  'JustdoIt',           // First M13 completion
  'cantdoIT',           // No bench for mission
  'Done',               // M13 not given path
  'infiniteJustDoit',   // Repeat visitor
  'justDoITluck',       // Lucky first visit
]

// State: available external parts for random part selection (Dir.ls)
// Used by getRandomPart() to give the player a random boat part
const externalParts = []

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  computeMiaResult,
  FRAME_LABELS,
  externalParts
}
