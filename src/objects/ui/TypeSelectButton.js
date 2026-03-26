/**
 * TypeSelectButton.js - Boat type selection button
 * Based on original Lingo: ParentScript 170 - TypeSelectButton.ls
 *
 * Button for selecting boat propulsion type (Motor, Sail, Oar).
 *
 * Original Lingo properties:
 * - type: button type (#Motor, #Sail, #Oar)
 * - firstFrame: base frame number
 * - SP: sprite channel
 * - reportObject: parent SelectorMaster
 * - sound: rollover sound
 * - selected: whether button is selected
 * - active: whether button is interactive
 */
'use strict'

import MulleSprite from '../sprite'
import MouseObject from '../input/MouseObject'

const OK_TYPES = ['Motor', 'Sail', 'Oar']

function rectFromMemberAtLoc(frame, loc) {
  if (!frame || !loc) return null
  const reg = frame.regpoint || { x: 0, y: 0 }
  const left = loc.x - reg.x
  const top = loc.y - reg.y
  return {
    left,
    top,
    right: left + frame.width,
    bottom: top + frame.height
  }
}

export default class TypeSelectButton {
  /**
   * Create type select button
   * Original: on new me, argReportObject, argSP, argType, argSound
   *
   * @param {object} reportObject - Parent SelectorMaster to report clicks
   * @param {number} SP - Sprite channel
   * @param {string} type - Button type ('Motor', 'Sail', 'Oar')
   * @param {string} sound - Rollover sound ID
   * @param {Object} [game] - Phaser game instance
   * @param {Object} [globals] - gMulleGlobals (for MouseObject)
   * @param {Object} [dir] - Director/scene (gDir)
   */
  constructor(reportObject, SP, type, sound, game = null, globals = null, dir = null) {
    this.reportObject = reportObject
    this.SP = SP
    this.type = type
    this.sound = sound

    this.selected = false
    this.active = true

    this.game = game || (reportObject && reportObject.game) || null
    this.globals = globals || (reportObject && reportObject.globals) || (this.game && this.game.mulle && this.game.mulle.gMulleGlobals) || null
    this.dir = dir || (reportObject && reportObject.dir) || (this.game && this.game.mulle && this.game.mulle.dir) || null

    this.firstFrame = 0
    this.sprite = null
    this.mouseObject = null
    this.button = null

    this._initVisuals()
  }

  _initVisuals() {
    if (!this.game) return

    // Full Director pipeline
    if (this.game.mulle && typeof this.game.mulle.getDirectorImage === 'function') {
      const keyName = `TypePic${this.type}`
      const img = this.game.mulle.getDirectorImage('boten_05.DXR', keyName)
      if (!img || !img.frame) return

      this.firstFrame = img.frame.dirNum || 0

      this.sprite = new MulleSprite(this.game, 320, 240)
      if (this.firstFrame) {
        this.sprite.setDirectorMember('boten_05.DXR', this.firstFrame + 1)
      } else {
        this.sprite.setDirectorMember('boten_05.DXR', keyName)
      }
      this.sprite.fixedToCamera = true
      this.sprite.directorChannel = this.SP
      if (typeof this.sprite.z !== 'undefined') this.sprite.z = this.SP
      this.game.add.existing(this.sprite)

      const rect = rectFromMemberAtLoc(img.frame, { x: 320, y: 240 })
      if (rect) {
        this.mouseObject = new MouseObject(this, [rect], 200, { report: 1 }, this.globals)
      }
      return
    }

    // Fallback: Phaser button creation (for simpler game instances)
    if (this.game.add && typeof this.game.add.button === 'function') {
      const keyName = `TypePic${this.type}`
      this.button = this.game.add.button(
        0, 0, keyName,
        () => { this.mouse(null, 'click') },
        this,
        2, 1, 0, 1
      )
      this.button.z = this.SP
      return
    }
  }

  _getBoat() {
    if (this.dir && this.dir.boat) return this.dir.boat
    if (this.reportObject && this.reportObject.boat) return this.reportObject.boat
    return null
  }

  _say(soundId, priority) {
    const talk = (this.dir && this.dir.mulleTalkObject) ||
      (this.game && this.game.mulle && this.game.mulle.mulleTalkObject)
    if (talk && typeof talk.say === 'function') {
      talk.say(soundId, priority)
      return true
    }
    if (this.game && this.game.mulle && typeof this.game.mulle.playAudio === 'function') {
      this.game.mulle.playAudio(soundId)
      return true
    }
    return false
  }

  /**
   * Handle mouse events
   * Original: on mouse me, argObj, argWhat
   *
   * @param {object} argObj - Mouse object
   * @param {string} argWhat - Event type ('click', 'enter', 'Leave')
   */
  mouse(argObj, argWhat) {
    if (!this.active) return null

    if (argWhat === 'click') {
      const boat = this._getBoat()
      if (boat && typeof boat.changeType === 'function') {
        const tmp = boat.changeType(this.type)
        if (OK_TYPES.includes(tmp)) {
          if (this.reportObject && this.reportObject.clickedOne) {
            this.reportObject.clickedOne(this)
          }
        } else if (typeof tmp === 'string') {
          this._say(tmp, 4)
        }
      } else if (this.reportObject && this.reportObject.clickedOne) {
        this.reportObject.clickedOne(this)
      }
      return { action: 'click', type: this.type }
    }

    if (argWhat === 'enter') {
      if (!this.selected) {
        const levelHandler = this.globals && this.globals.levelHandler
        const level = levelHandler && typeof levelHandler.getLevel === 'function'
          ? levelHandler.getLevel()
          : 0
        if (level === 1) {
          this._say(this.sound, 6)
        }
        if (this.sprite && this.firstFrame) {
          this.sprite.setDirectorMember('boten_05.DXR', this.firstFrame + 2)
        }
        return { frame: 2 }
      }
      return null
    }

    if (argWhat === 'Leave') {
      if (!this.selected) {
        if (this.sprite && this.firstFrame) {
          this.sprite.setDirectorMember('boten_05.DXR', this.firstFrame + 1)
        }
        return { frame: 1 }
      }
      return null
    }

    return null
  }

  /**
   * Select this button
   * Original: on select me
   */
  select() {
    if (!this.active) return null
    this.selected = true
    if (this.sprite && this.firstFrame) {
      this.sprite.setDirectorMember('boten_05.DXR', this.firstFrame)
    }
    if (this.button && typeof this.button.setFrames === 'function') {
      this.button.setFrames(0, 0, 0, 0)
    }
    return 0
  }

  /**
   * Deselect this button
   * Original: on deselect me
   */
  deselect() {
    if (!this.active) return null
    this.selected = false
    if (this.sprite && this.firstFrame) {
      this.sprite.setDirectorMember('boten_05.DXR', this.firstFrame + 1)
    }
    if (this.button && typeof this.button.setFrames === 'function') {
      this.button.setFrames(2, 1, 0, 1)
    }
    return 1
  }

  /**
   * Set active state
   * Original: on activate me, argYesNo
   *
   * @param {boolean} yesNo - Active state
   */
  activate(yesNo) {
    this.active = !!yesNo
    if (this.mouseObject && typeof this.mouseObject.setActive === 'function') {
      this.mouseObject.setActive(this.active)
    }
    if (this.sprite) {
      this.sprite.visible = this.active
    }
    if (this.button) {
      this.button.inputEnabled = this.active
    }
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    if (this.mouseObject) {
      this.mouseObject.kill()
      this.mouseObject = null
    }
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
    if (this.button) {
      if (typeof this.button.destroy === 'function') {
        this.button.destroy()
      }
      this.button = null
    }
    return null
  }
}
