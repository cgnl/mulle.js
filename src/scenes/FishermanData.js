/**
 * @fileoverview FishermanData - Pure data module for Fisherman scene (scene 79)
 * Based on: decompiled_lingo/79/79/casts/Internal/ParentScript 4 - Dir.ls
 *
 * The Fisherman scene is the simplest destination scene in the game.
 * Binary check: does the player have the required fuel item in inventory?
 *
 * On success (has item):
 *   - Complete mission 17
 *   - Delete the fuel item from inventory
 *   - Refuel boat to #Full
 *   - Give Belly item (nr: 1000)
 *   - Go to marker "JustdoIt"
 *
 * On failure (no item):
 *   - Go to marker "cantdoIT"
 *
 * Note the exact marker casing from the original Lingo:
 *   "JustdoIt" (capital J, capital I, lowercase t)
 *   "cantdoIT" (lowercase c, capital I, capital T)
 */

'use strict'

// Marker strings - exact casing from original Lingo
const MARKER_SUCCESS = 'JustdoIt'
const MARKER_FAILURE = 'cantdoIT'

// Mission number completed on success
const MISSION_ID = 17

// Belly item amount given on success
const BELLY_AMOUNT = 1000

// Fuel level set on success
const FUEL_LEVEL = 'Full'

/**
 * Compute the result of the Fisherman scene based on player state.
 *
 * @param {{ hasRequiredItem: boolean }} state - Player state entering the scene
 * @returns {{
 *   marker: string,
 *   actions: {
 *     completeMission17: boolean,
 *     deleteItem: boolean,
 *     refuelToFull: boolean,
 *     giveBelly: boolean
 *   }
 * }}
 */
function computeFishermanResult (state) {
  if (state.hasRequiredItem) {
    return {
      marker: MARKER_SUCCESS,
      actions: {
        completeMission17: true,
        deleteItem: true,
        refuelToFull: true,
        giveBelly: true
      }
    }
  }

  return {
    marker: MARKER_FAILURE,
    actions: {
      completeMission17: false,
      deleteItem: false,
      refuelToFull: false,
      giveBelly: false
    }
  }
}

module.exports = {
  computeFishermanResult,
  MARKER_SUCCESS,
  MARKER_FAILURE,
  MISSION_ID,
  BELLY_AMOUNT,
  FUEL_LEVEL
}
