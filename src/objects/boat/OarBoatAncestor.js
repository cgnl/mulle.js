/**
 * OarBoatAncestor.js - Oar/rowing boat propulsion controller
 * Based on original Lingo: ParentScript 40 - OarBoatAncestor.ls
 *
 * Handles:
 * - Rowing stroke force curve
 * - Forward and backward rowing
 * - Hunger speed increase when rowing
 * - Rowing sounds
 */
'use strict'

// Original: set oarForce to [20, 20, 20, 20, 40, 40, 40, 60, 60, 80, 100, 80, 80, 80, 60, 60, 60, 60, 40, 40, 40, 40, 20, 20, 0]
const OAR_FORCE = [20, 20, 20, 20, 40, 40, 40, 60, 60, 80, 100, 80, 80, 80, 60, 60, 60, 60, 40, 40, 40, 40, 20, 20, 0]

// Original: set sounds to ["05d127v0", "05d126v0"]
const ROWING_SOUNDS = ['05d127v0', '05d126v0']

export default class OarBoatAncestor {
  /**
   * Create oar boat ancestor
   * Original: on new me, argChild
   *
   * @param {object} child - Parent boat object
   */
  constructor(child) {
    this.child = child
    this.type = 'Oar'

    // Original: set Steering to 0
    this.Steering = 0

    // Original: set Oars to [0, 0]
    this.Oars = [0, 0]

    // Original: set Oar to 0
    this.Oar = 0

    // Original: set oarForce to [...]
    this.oarForce = [...OAR_FORCE]

    // Original: set forceCount to count(oarForce)
    this.forceCount = this.oarForce.length

    // Original: set mouseForceCount to forceCount
    this.mouseForceCount = this.forceCount

    // Original: set sounds to ["05d127v0", "05d126v0"]
    this.sounds = [...ROWING_SOUNDS]

    // Original: set soundCount to 1
    this.soundCount = 1

    // Sound ID
    this.sndId = null
  }

  /**
   * Initialize
   * Original: on init me
   */
  init() {
    // Empty in original
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {number} 0 (Lingo: on kill me → return 0)
   */
  kill() {
    return 0
  }

  /**
   * Handle steering and rowing input
   * Original: on steer me, toWhere, argSpeed
   *
   * @param {string} toWhere - Direction ('left', 'right')
   * @param {string|number} argSpeed - Row control ('up', 'down')
   */
  steer(toWhere, argSpeed) {
    // Original: if toWhere = #left then set Steering to -1
    if (toWhere === 'left') {
      this.Steering = -1
    } else if (toWhere === 'right') {
      this.Steering = 1
    } else {
      this.Steering = 0
    }

    // Original: if symbolp(argSpeed) then
    if (typeof argSpeed === 'string') {
      // Only start new stroke if idle
      // Original: if Oar = 0 then
      if (this.Oar === 0) {
        if (argSpeed === 'down') {
          // Original: set Oar to -forceCount
          this.Oar = -this.forceCount
        } else if (argSpeed === 'up') {
          // Original: set Oar to forceCount
          this.Oar = this.forceCount
        }
      }
    } else {
      // Original: else set Oar to 0
      this.Oar = 0
    }
  }

  /**
   * Animation loop - update rowing state
   * Original: on loop me
   * Lingo calls calcSpeedNDir(child, tmpForce * 13, 5 * Steering) directly.
   * Does NOT return a value.
   */
  loop() {
    let tmpForce = 0
    let tmpPlaySound = false

    // Process rowing stroke
    if (this.Oar > 1) {
      // .ls line 56-58: Rowing forward
      tmpForce = this.oarForce[this.Oar - 1] // -1 for 0-index (Lingo 1-indexed)
      this.Oar--

      // .ls line 59: if tmpForce = 0 then set tmpPlaySound to 1
      if (tmpForce === 0) {
        tmpPlaySound = true
      }
    } else if (this.Oar < -1) {
      // .ls line 62-64: Rowing backward
      tmpForce = -this.oarForce[-this.Oar - 1]
      this.Oar++
    } else {
      // .ls line 65: else set tmpForce to 0
      tmpForce = 0
    }

    // .ls line 75-78: Adjust hunger speed based on rowing
    if (tmpForce !== 0) {
      this.child.mulleHungerSpeed = 2 * this.child.orgMulleHungerSpeed
    } else {
      this.child.mulleHungerSpeed = this.child.orgMulleHungerSpeed
    }

    // .ls line 80: if tmpPlaySound then set soundCount to 3 - soundCount
    if (tmpPlaySound) {
      this.soundCount = 3 - this.soundCount
    }

    // .ls line 82: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
    // Call directly on child — no return value
    if (this.child.calcSpeedNDir) {
      this.child.calcSpeedNDir(tmpForce * 13, 5 * this.Steering)
    }
  }

  /**
   * Set speed directly
   * Original: on setSpeed me, argSpeed
   *
   * @param {number} argSpeed - Speed value
   */
  setSpeed(argSpeed) {
    // Original: set Oars to [1, 1]
    this.Oars = [1, 1]
  }

  /**
   * Display update
   * Original: on display me
   */
  display() {
    // Empty in original
  }

  /**
   * Enable/disable sounds
   * Original: on playSounds me, argYesNo
   *
   * @param {boolean} argYesNo - Sound state
   */
  playSounds(argYesNo) {
    // Empty in original
  }
}
