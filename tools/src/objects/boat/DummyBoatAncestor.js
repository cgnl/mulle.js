/**
 * DummyBoatAncestor.js - Base/dummy boat ancestor
 * Based on original Lingo: ParentScript 44 - DummyBoatAncestor.ls
 *
 * Provides empty interface for boat propulsion.
 * Used as placeholder when no propulsion type is active.
 */
'use strict'

export default class DummyBoatAncestor {
  /**
   * Create dummy ancestor
   * Original: on new me, argChild
   *
   * @param {object} child - Parent boat object
   */
  constructor(child) {
    // Original: set type to #none
    this.type = 'none'
    this.child = child
  }

  /**
   * Initialize
   * Original: on init me
   */
  init() {
    // Empty
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {number} 0 (Lingo convention: on kill me → return 0)
   */
  kill() {
    return 0
  }

  /**
   * Handle steering input
   * Original: on steer me, toWhere, argSpeed
   *
   * @param {string} toWhere - Direction ('left', 'right')
   * @param {string} argSpeed - Speed control ('up', 'down')
   */
  steer(toWhere, argSpeed) {
    // Empty
  }

  /**
   * Animation loop
   * Original: on loop me
   */
  loop() {
    // Empty
  }

  /**
   * Set speed directly
   * Original: on setSpeed me, argSpeed
   *
   * @param {number} argSpeed - Speed value
   */
  setSpeed(argSpeed) {
    // Empty
  }

  /**
   * Display update
   * Original: on display me
   */
  display() {
    // Empty
  }

  /**
   * Enable/disable sounds
   * Original: on playSounds me, argYesNo
   *
   * @param {boolean} argYesNo - Sound state
   */
  playSounds(argYesNo) {
    // Empty
  }
}
