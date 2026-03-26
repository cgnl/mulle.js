/**
 * SailBoatAncestor.js - Sail boat propulsion controller
 * Based on original Lingo: ParentScript 37 - SailBoatAncestor.ls (121 lines)
 *
 * Handles:
 * - Sail force from Sail object's getForce() (.ls line 51)
 * - calcSpeedNDir(child, force*14, Steering*10) (.ls line 56)
 * - Sail direction via Sail.calcDirection (.ls line 57)
 * - Side force calculation for boat inclination (.ls lines 58-87)
 * - Mouse steering mode (.ls lines 49-53)
 * - Sail sounds (.ls lines 41-47)
 */
'use strict'

import Sail from '../weather/Sail'

export default class SailBoatAncestor {
  /**
   * Create sail boat ancestor
   * Original: on new me, argChild — .ls lines 4-12
   *
   * @param {object} child - Parent boat object
   * @param {object} [drivingHandlers] - DrivingHandlers for direction calc
   * @param {object} [weatherRenderer] - WeatherRenderer with wind
   */
  constructor(child, drivingHandlers, weatherRenderer) {
    // .ls line 5: set child to argChild
    this.child = child

    // .ls line 8: set type to #Sail
    this.type = 'Sail'

    // .ls line 7: set scooting to 0
    this.scooting = 0

    // .ls line 6: set Steering to (implicit 0)
    this.Steering = 0

    // .ls line 9: set soundMode to the mode of gSound
    this.soundMode = 'xtra'

    // .ls line 10: set SailSize to getaProp(quickProps, #SailSize)
    this.SailSize = child.quickProps?.SailSize || 100

    // .ls line 6: set Sail to new(script "Sail", me)
    // Use injected deps or child's deps
    const dh = drivingHandlers || child.deps?.drivingHandlers
    const wr = weatherRenderer || child.deps?.weatherRenderer
    this.Sail = new Sail(this, dh, wr)

    // Sound management
    this.waitSoundCounter = 0
    this.sailSoundIDs = []
  }

  /**
   * Initialize
   * Original: on init me — .ls lines 14-32
   */
  init() {
    // .ls line 31: set SailSize to getaProp(quickProps, #SailSize)
    this.SailSize = this.child.quickProps?.SailSize || 100

    // .ls lines 15-28: preload sail sounds
    if (this.soundMode === 'xtra') {
      this.sailSoundIDs = ['05e044v0', '05e044v1']
      if (this.sailSoundIDs.length) {
        this.waitSoundCounter = 0
      } else {
        this.waitSoundCounter = 10
      }
    }
  }

  /**
   * Clean up
   * Original: on kill me — .ls lines 34-37
   *
   * @returns {number} 0
   */
  kill() {
    // .ls line 35: set Sail to kill(Sail)
    if (this.Sail && this.Sail.kill) {
      this.Sail = this.Sail.kill()
    }
    // .ls line 36: return 0
    return 0
  }

  /**
   * Handle steering input
   * Original: on steer me, toWhere, argScoot — .ls lines 39-58
   *
   * @param {string} toWhere - Direction ('left', 'right')
   * @param {string} argScoot - Scoot control ('up', 'down')
   */
  steer(toWhere, argScoot) {
    // .ls lines 40-48
    if (toWhere === 'left') {
      this.Steering = -1
    } else if (toWhere === 'right') {
      this.Steering = 1
    } else {
      this.Steering = 0
    }

    // .ls lines 49-57
    if (argScoot === 'up') {
      this.scooting = -1
    } else if (argScoot === 'down') {
      this.scooting = 1
    } else {
      this.scooting = 0
    }
  }

  /**
   * Animation loop - update sail state
   * Original: on loop me — .ls lines 60-110
   *
   * RETURNS: tmpForce * tmpDiff * SailSize (side force number)
   *
   * @returns {number} Side force for boat inclination
   */
  loop() {
    // .ls lines 61-67: sail sound management
    if (this.soundMode === 'xtra' && this.sailSoundIDs.length > 0) {
      if (this.waitSoundCounter === 0) {
        // Play random sail sound
        this.waitSoundCounter = 100 + Math.floor(Math.random() * 100)
      } else {
        this.waitSoundCounter--
      }
    }

    let tmpForce

    // .ls lines 69-75: mouse vs keyboard
    if (this.child.steerMethod === 'mouse') {
      // .ls line 70: set Steering to calcMouseDir(child)
      if (this.child.calcMouseDir) {
        this.Steering = this.child.calcMouseDir()
      }
      // .ls line 71: set tmpForce to getForce(Sail)
      tmpForce = this.Sail.getForce()
      // .ls line 72: set tmpForce to (tmpForce > 0) * (tmpForce + 10) / 2
      tmpForce = (tmpForce > 0 ? 1 : 0) * (tmpForce + 10) / 2
    } else {
      // .ls line 74: set tmpForce to getForce(Sail)
      tmpForce = this.Sail.getForce()
    }

    // .ls line 76: calcSpeedNDir(child, tmpForce * 14, Steering * 10)
    if (this.child.calcSpeedNDir) {
      this.child.calcSpeedNDir(tmpForce * 14, this.Steering * 10)
    }

    // .ls line 77: calcDirection(Sail, the direction of child)
    if (this.Sail.calcDirection) {
      this.Sail.calcDirection(this.child.direction || 1)
    }

    // .ls line 78: tmpDiff = correctDirection(windDir - boatDir - 8)
    const windDir = this._getWindDirection()
    const boatDir = this.child.direction || 1
    let tmpDiff = this._correctDirection(windDir - boatDir - 8)

    // .ls lines 79-88: normalize tmpDiff
    if (tmpDiff > 8) {
      tmpDiff = 8 - tmpDiff
    } else if (tmpDiff > 4) {
      tmpDiff = 8 - tmpDiff
    }
    if (tmpDiff < -4) {
      tmpDiff = -8 - tmpDiff
    }

    // .ls lines 89-108: sail inclination and sprite offset
    // (Visual only — calculate for display but physics uses the return value)
    if (this.child.inclinations && this.child.displayObject?.calcPicToShow) {
      const tmpInclination = [...this.child.inclinations]
      const sailDir = this.Sail.direction || 1
      const tmpAngleDiff = this._correctDirection(boatDir - sailDir) - 8
      const tmpRadiansDiff = tmpAngleDiff * Math.PI / 8.0

      // calcRadians: convert [side, frontBack] to [angle, hypotenuse]
      const side = tmpInclination[0] || 0
      const fb = tmpInclination[1] || 0
      const tmpHypo = Math.sqrt(side * side + fb * fb)
      let tmpInclAngle = 0
      if (tmpHypo > 0) {
        tmpInclAngle = Math.atan2(side, -fb)
      }

      const tmpNewAngle = tmpInclAngle - tmpRadiansDiff
      const tmpSailIncl = [
        Math.trunc(tmpHypo * Math.sin(tmpNewAngle)),
        -Math.trunc(tmpHypo * Math.cos(tmpNewAngle))
      ]

      // Clamp to [-2, 2]
      if (Math.abs(tmpSailIncl[0]) > 2) {
        tmpSailIncl[0] = Math.sign(tmpSailIncl[0]) * 2
      }
      if (Math.abs(tmpSailIncl[1]) > 2) {
        tmpSailIncl[1] = Math.sign(tmpSailIncl[1]) * 2
      }

      const tmpPicOffset = this.child.displayObject.calcPicToShow(
        this._correctDirection(sailDir + 8),
        tmpSailIncl
      )
      if (this.Sail.setPic) {
        this.Sail.setPic(tmpPicOffset)
      }
    }

    // .ls line 109: return tmpForce * tmpDiff * SailSize
    return tmpForce * tmpDiff * this.SailSize
  }

  /**
   * Set speed directly (not used for sail)
   * Original: on setSpeed me, argSpeed — .ls lines 112-113
   */
  setSpeed(argSpeed) {
    // Empty in original
  }

  /**
   * Display update - position sail sprite at boat location
   * Original: on display me — .ls lines 115-117
   */
  display() {
    // .ls line 116: set the loc of sprite the SP of Sail to the loc of sprite the SP of the displayObject of child
    if (this.Sail && this.Sail.sprite && this.child && this.child.displayObject) {
      const displayObj = this.child.displayObject
      if (displayObj.sprite) {
        this.Sail.sprite.x = displayObj.sprite.x
        this.Sail.sprite.y = displayObj.sprite.y
        this.Sail.sprite.visible = displayObj.sprite.visible
      }
    }
  }

  /**
   * Enable/disable sounds
   * Original: on playSounds me, argYesNo — .ls lines 119-120
   */
  playSounds(argYesNo) {
    // Empty in original
  }

  /**
   * Get wind direction from weather renderer
   * @private
   */
  _getWindDirection() {
    if (this.child.deps?.weatherRenderer?.wind?.getDirection) {
      return this.child.deps.weatherRenderer.wind.getDirection()
    }
    return 1
  }

  /**
   * Normalize direction to 1-16 range
   * @private
   */
  _correctDirection(dir) {
    if (this.child.deps?.drivingHandlers?.correctDirection) {
      return this.child.deps.drivingHandlers.correctDirection(dir)
    }
    let d = dir % 16
    if (d <= 0) d += 16
    return d
  }
}
