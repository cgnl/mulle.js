/**
 * @fileoverview PreacherData - Pure data module for the Preacher scene (scene 78)
 * Based on: decompiled_lingo/78/78/casts/Internal/ParentScript 4 - Dir.ls
 *
 * The Preacher (Prästen) scene handles mission 1 (Bible delivery) and
 * mission 20 (first-visit introduction). The player brings items to the
 * preacher and receives boat parts or snacks as rewards.
 *
 * Key Lingo behavior:
 * - Mission 20 check at the END overrides all earlier marker assignments.
 *   If M20 is not yet completed, marker becomes "cantDoit2" regardless.
 * - Completion count is checked AFTER addCompletedMission (already incremented).
 * - On exactly the 2nd completion, givePart is forced to 19.
 * - If completions > 5 or randomPart is null (#NoPart), give Belly snack instead.
 * - random(2) in Lingo returns 1 or 2 (suffix for marker variation).
 */

'use strict'

// ============================================================================
// CONSTANTS
// ============================================================================

/** Object ID for the preacher's location (default when world not available) */
const DEFAULT_OBJ_ID = 18

/** Dummy part ID stored but not used in logic */
const DUMMY_PART = 72

/** Part ID forced on 2nd completion */
const SECOND_COMPLETION_PART = 19

/** Maximum completion count that still awards a part (inclusive) */
const MAX_PART_COMPLETIONS = 5

/** Belly item value given as snack reward */
const BELLY_NR = 1000

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Compute the result of visiting the Preacher scene.
 *
 * Replicates the Lingo startMovie handler exactly, including the
 * mission 20 override at the end.
 *
 * @param {object} state
 * @param {boolean} state.isMission1Given - Whether mission 1 has been given
 * @param {boolean} state.isMission20Completed - Whether mission 20 is already completed
 * @param {boolean} state.hasRequiredItem - Whether the player has the Bible
 * @param {number} state.completionCount - Current M1 completion count BEFORE this visit
 * @param {number|null} state.randomPart - Result of getRandomPart (null = #NoPart)
 * @param {number} state.suffix - 1 or 2 (pre-rolled random suffix)
 * @returns {{ marker: string, actions: object }}
 */
function computePreacherResult (state) {
  const {
    isMission1Given,
    isMission20Completed,
    hasRequiredItem,
    completionCount,
    randomPart,
    suffix
  } = state

  // Initialize actions — all default to no-op
  const actions = {
    completeMission1: false,
    completeMission20: false,
    giveMission1: false,
    deleteItem: false,
    givePart: null,
    giveBelly: false
  }

  let marker
  let givePart = randomPart

  // ---- Main mission 1 logic ----
  if (isMission1Given) {
    if (hasRequiredItem) {
      marker = 'JustdoIt' + suffix

      // Delete the required item and complete mission 1
      actions.deleteItem = true
      actions.completeMission1 = true

      // Count is checked AFTER increment in Lingo
      const newCount = completionCount + 1

      if (newCount <= MAX_PART_COMPLETIONS) {
        // On exactly the 2nd completion, force part 19
        if (newCount === 2) {
          givePart = SECOND_COMPLETION_PART
        }

        if (givePart === null) {
          // #NoPart — give snack instead
          actions.giveBelly = true
          marker = 'JustdoItSnack' + suffix
        } else {
          actions.givePart = givePart
          marker = 'JustdoIt' + suffix
        }
      } else {
        // More than 5 completions — always give snack
        actions.giveBelly = true
        marker = 'JustdoItSnack' + suffix
      }
    } else {
      marker = 'cantDoIt' + suffix
    }
  } else {
    marker = 'NoMission'
  }

  // ---- Mission 20 override (runs AFTER everything above) ----
  if (!isMission20Completed) {
    actions.completeMission20 = true
    if (!isMission1Given) {
      actions.giveMission1 = true
    }
    marker = 'cantDoit2'
  }

  return { marker, actions }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Constants
  DEFAULT_OBJ_ID,
  DUMMY_PART,
  SECOND_COMPLETION_PART,
  MAX_PART_COMPLETIONS,
  BELLY_NR,

  // Functions
  computePreacherResult
}
