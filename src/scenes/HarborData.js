/**
 * @fileoverview HarborData - Pure data module for Harbor/RottenFish scene (scene 81)
 * Based on: decompiled Lingo for scene 81 (RottenFish pickup at harbor)
 *
 * Scene 81 is the harbor where the player can pick up a barrel of rotten fish.
 * A random weight is chosen from WEIGHT_LIST at construction time. During
 * startMovie the scene checks:
 *
 *   1. If the player already has RottenFish in inventory → "notDelivered"
 *   2. If the boat's load capacity >= rottenFishWeight → success:
 *      - Complete mission 9, give RottenFish to inventory
 *      - If weight >= 35 → also award medal 3, marker = "JustDoItmedal" + suffix
 *      - Otherwise → marker = "JustDoIt" + suffix
 *   3. If capacity < weight → "cantDoIt" + suffix
 *
 * suffix is random(2) = 1 or 2.
 *
 * Lingo markers:
 *   "notDelivered"
 *   "JustDoIt1" / "JustDoIt2"
 *   "JustDoItmedal1" / "JustDoItmedal2"
 *   "cantDoIt1" / "cantDoIt2"
 */

'use strict'

/** Possible rotten-fish barrel weights (index chosen by random(5) in Lingo) */
const WEIGHT_LIST = [10, 15, 25, 35, 40]

/** Can member names corresponding to each weight index */
const CAN_LIST = ['81b005v1', '81b005v2', '81b005v3', '81b005v4', '81b005v5']

/** Mission completed on successful fish pickup */
const MISSION_ID = 9

/** Medal awarded when the fish barrel is heavy (weight >= 35) */
const MEDAL_ID = 3

/**
 * Compute the harbor/rotten-fish scene result.
 * Follows the EXACT logic from the original Lingo startMovie handler.
 *
 * @param {object} state
 * @param {boolean} state.hasRottenFish  - Whether RottenFish is already in inventory
 * @param {number}  state.loadCapacity   - Current boat load capacity
 * @param {number}  state.rottenFishWeight - Weight of the rotten fish barrel (from WEIGHT_LIST)
 * @param {number}  state.suffix         - 1 or 2 (random suffix for marker)
 * @returns {{ marker: string, actions: { completeMission9: boolean, giveRottenFish: boolean, awardMedal3: boolean } }}
 */
function computeHarborResult (state) {
  const { hasRottenFish, loadCapacity, rottenFishWeight, suffix } = state

  let marker
  const actions = {
    completeMission9: false,
    giveRottenFish: false,
    awardMedal3: false
  }

  if (hasRottenFish) {
    marker = 'notDelivered'
  } else if (loadCapacity >= rottenFishWeight) {
    marker = 'JustDoIt' + suffix
    if (rottenFishWeight >= 35) {
      actions.awardMedal3 = true
      marker = 'JustDoIt' + 'medal' + suffix
    }
    actions.completeMission9 = true
    actions.giveRottenFish = true
  } else {
    marker = 'cantDoIt' + suffix
  }

  return { marker, actions }
}

module.exports = {
  WEIGHT_LIST,
  CAN_LIST,
  MISSION_ID,
  MEDAL_ID,
  computeHarborResult
}
