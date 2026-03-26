/**
 * MotorBoatAncestor.js - Motor boat propulsion controller
 * Based on original Lingo: ParentScript 39 - MotorBoatAncestor.ls
 *
 * Handles:
 * - Motor speed control (accelerate/decelerate)
 * - Fuel consumption
 * - Engine sound management
 * - Steering
 */
'use strict'

// Lingo audio: MotorBoatAncestor.ls lines 10-24
// Motor sound sets for different engine types.
// Each engine type has 3 sound files: [low, mid, high] RPM variants.
// Some entries have v0/v1 alternates for tonal variety.
const MOTOR_SOUNDS = [
  ['05e018v1', '05e019v1', '05e016v1'],  // Engine type 1
  ['05e018v0', '05e019v0', '05e016v0'],  // Engine type 2
  ['05e030v0', '05e031v0', '05e032v1'],  // Engine type 3
  ['05e056v0', '05e057v0', '05e055v0'],  // Engine type 4
  ['05e034v0', '05e035v0', '05e033v0'],  // Engine type 5
  ['05e022v0', '05e023v0', '05e020v0'],  // Engine type 6
  ['05e053v0', '05e054v0', '05e052v0'],  // Engine type 7
  ['05e026v0', '05e027v0', '05e024v0']   // Engine type 8
]

// Alternate motor sound variants referenced in Lingo cast but not in the
// primary MOTOR_SOUNDS table above. Listed here for asset-completeness so
// the audio preloader can discover them.
// eslint-disable-next-line no-unused-vars
const MOTOR_SOUND_ALTERNATES = [
  '05e030v1', '05e033v1', '05e052v1',
  '05e024v1', '05e026v1'
]

// Pitch percentages for each engine type
const PITCH_PERCENTAGES = [100, 100, 30, 100, 200, 100, 200, 50]

// Volume percentages for each engine type
const VOLUMES = [48, 44, 80, 56, 80, 62, 56, 80] // 80 * [60, 55, 100, 70, 100, 78, 70, 100] / 100

// Lingo audio: shallow water ambient sounds (DepthChecker / SeaWorld)
// Randomly selected when boat enters shallow water zones.
// eslint-disable-next-line no-unused-vars
const SHALLOW_WATER_AMBIENT = ['05e058v0', '05e059v0', '05e060v0']

export default class MotorBoatAncestor {
  /**
   * Create motor boat ancestor
   * Original: on new me, argChild
   *
   * @param {object} child - Parent boat object
   */
  constructor(child) {
    this.child = child
    this.type = 'Motor'

    // Original: set motorSpeed to 0
    this.motorSpeed = 0

    // Original: set Steering to 0
    this.Steering = 0

    // Original: set speedChange to 0
    this.speedChange = 0

    // Get engine type from props
    // Original: set tmpMotorType to getaProp(quickProps, #EngineSound)
    let motorType = child.quickProps?.EngineSound || 1
    if (motorType < 1) motorType = 1
    if (motorType > MOTOR_SOUNDS.length) motorType = MOTOR_SOUNDS.length

    // Original: set motorSounds to getAt(motorSounds, tmpMotorType)
    this.motorSounds = MOTOR_SOUNDS[motorType - 1]
    this.pitchPercent = PITCH_PERCENTAGES[motorType - 1]
    this.volume = VOLUMES[motorType - 1]

    // Original: set motorSoundLimits to [10, 20, 35, 50, 70, 85]
    this.motorSoundLimits = [10, 20, 35, 50, 70, 85]
    this.lastMotorSnd = 1

    // Original: set fuelConsumption to getaProp(quickProps, #fuelConsumption)
    this.fuelConsumption = child.quickProps?.fuelConsumption || 10

    // Original: set zeroSpeedWait to 0
    this.zeroSpeedWait = 0

    // Original: set speedChangeSpeed to 2
    this.speedChangeSpeed = 2

    // Original: set playingSounds to 0 (will be set to 1 by playSounds call)
    this.playingSounds = false

    // Sound IDs
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
    // Original: stop(gSound, sndId)
    // Original: unLoad(gSound, sndId)
    this.sndId = null
    return 0
  }

  /**
   * Handle steering input
   * Original: on steer me, toWhere, argSpeed
   *
   * @param {string} toWhere - Direction ('left', 'right')
   * @param {string|number} argSpeed - Speed control ('up', 'down') or value
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

    // Original: if argSpeed = #down then set speedChange to -1
    if (argSpeed === 'down') {
      this.speedChange = -1
    } else if (argSpeed === 'up') {
      this.speedChange = 1
    } else if (typeof argSpeed === 'number') {
      this.speedChange = argSpeed
    }
  }

  /**
   * Animation loop - update motor state
   * Original: on loop me
   * Lingo calls calcSpeedNDir(child, motorSpeed, 10 * Steering) directly.
   * Does NOT return a value.
   */
  loop() {
    // Handle zero speed wait (pause when transitioning through zero)
    // .ls line 66: if zeroSpeedWait then set zeroSpeedWait to zeroSpeedWait - 1
    if (this.zeroSpeedWait > 0) {
      this.zeroSpeedWait--
    } else {
      // Update motor speed based on speedChange
      if (this.speedChange > 0) {
        // Accelerating
        if (this.motorSpeed < 100) {
          if (this.motorSpeed < 0 && this.motorSpeed >= -this.speedChangeSpeed) {
            // Crossing zero from negative
            this.zeroSpeedWait = 15
            this.motorSpeed = 0
          } else {
            this.motorSpeed += this.speedChangeSpeed
            // Clamp to max
            if (this.motorSpeed > 100) this.motorSpeed = 100
          }
        }
      } else if (this.speedChange < 0) {
        // Decelerating/reversing
        if (this.motorSpeed > -20) {
          if (this.motorSpeed > 0) {
            if (this.motorSpeed <= this.speedChangeSpeed) {
              // Crossing zero from positive
              this.zeroSpeedWait = 15
              this.motorSpeed = 0
            } else {
              this.motorSpeed -= this.speedChangeSpeed * 2
            }
          } else {
            this.motorSpeed -= this.speedChangeSpeed
            // Clamp to min
            if (this.motorSpeed < -20) this.motorSpeed = -20
          }
        }
      }
    }

    // Fuel consumption
    // .ls line 91: if not (the inFreeZone of child) then
    if (!this.child.inFreeZone) {
      const fuel = this.child.fuel
      if (fuel > 0) {
        // .ls line 95: set tmpFuel to tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
        const consumption = Math.abs(this.motorSpeed) * this.fuelConsumption / 30
        this.child.fuel = fuel - consumption

        // Update fuel meter
        if (this.child.fuelMeter?.show) {
          this.child.fuelMeter.show(this.child.fuel)
        }

        // .ls line 98-99: if tmpFuel <= 0 then OutOfFuel(child); exit
        if (this.child.fuel <= 0) {
          if (this.child.OutOfFuel) {
            this.child.OutOfFuel()
          }
          return
        }
      }
    }

    // .ls line 119: calcSpeedNDir(child, motorSpeed, 10 * Steering)
    // Call directly on child — no return value
    if (this.child.calcSpeedNDir) {
      this.child.calcSpeedNDir(this.motorSpeed, 10 * this.Steering)
    }
  }

  /**
   * Set speed directly
   * Original: on setSpeed me, argSpeed
   *
   * @param {number} argSpeed - Speed value
   */
  setSpeed(argSpeed) {
    this.motorSpeed = argSpeed
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
    this.playingSounds = argYesNo

    if (!argYesNo) {
      this.sndId = null
      this.lastMotorSnd = 1
    }
  }
}
