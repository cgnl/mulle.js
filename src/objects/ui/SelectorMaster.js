/**
 * SelectorMaster.js - Boat type selection manager
 * Based on original Lingo: ParentScript 171 - SelectorMaster.ls
 *
 * Manages the boat type selection buttons (Motor, Sail, Oar).
 * Only one type can be selected at a time.
 *
 * Original Lingo properties:
 * - buttons: list of TypeSelectButton objects
 */
'use strict'

import TypeSelectButton from './TypeSelectButton'

// Sound IDs for each boat type
const ROLL_SOUNDS = {
  Motor: '05d130v0',
  Sail: '05d131v0',
  Oar: '05d129v0'
}

export default class SelectorMaster {
  /**
   * Create selector master
   * Original: on new me, argOKTypes
   *
   * @param {string[]} argOKTypes - Available boat types
   * @param {number|Object} [baseSP=0] - Base sprite channel for buttons or options object
   * @param {Object} [game] - Phaser game instance (legacy)
   */
  constructor(argOKTypes, baseSP, game) {
    // Original: set buttons to []
    this.buttons = []

    let options = null
    if (baseSP && typeof baseSP === 'object' && !baseSP.add) {
      options = baseSP
      baseSP = options.baseSP
      game = options.game || game
      this.globals = options.globals || null
      this.dir = options.dir || null
    }

    if (baseSP && baseSP.add) {
      game = baseSP
      baseSP = 0
    }

    this.game = game || null

    if (!this.globals && this.game && this.game.mulle) {
      this.globals = this.game.mulle.gMulleGlobals || null
    }

    if (!this.dir && this.game && this.game.mulle) {
      this.dir = this.game.mulle.dir || null
    }

    if (!baseSP && this.dir && this.dir.spriteList && this.dir.spriteList.BoatTypes) {
      baseSP = this.dir.spriteList.BoatTypes
    }

    if (!baseSP) baseSP = 0

    // Original: if listp(argOKTypes) then
    if (Array.isArray(argOKTypes)) {
      // Original: repeat with N = 1 to count(argOKTypes)
      argOKTypes.forEach((type, index) => {
        // Original: set tmpSound to getaProp(tmpRollSounds, tmpType)
        const sound = ROLL_SOUNDS[type]

        // Original: set tmpObj to new(script "TypeSelectButton", me, tmpSP + N - 1, tmpType, tmpSound)
        const button = new TypeSelectButton(this, baseSP + index, type, sound, this.game, this.globals, this.dir)

        // Original: add(buttons, tmpObj)
        this.buttons.push(button)
      })
    }
  }

  /**
   * Clean up all buttons
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    // Original: repeat with tmpObj in buttons - kill(tmpObj)
    if (this.buttons) {
      this.buttons.forEach(button => button.kill())
    }

    // Original: set buttons to 0
    this.buttons = null

    return null
  }

  /**
   * Handle button click - select one, deselect others
   * Original: on clickedOne me, argObj
   *
   * @param {TypeSelectButton|string} argObj - Button object or type string
   */
  clickedOne(argObj) {
    let targetButton = argObj

    // Original: if symbolp(argObj) then find matching button
    if (typeof argObj === 'string') {
      targetButton = this.buttons.find(btn => btn.type === argObj)
      if (!targetButton) return
    }

    // Original: select(argObj)
    targetButton.select()

    // Original: repeat with tmpObj in buttons - if tmpObj <> argObj then deselect(tmpObj)
    this.buttons.forEach(button => {
      if (button !== targetButton) {
        button.deselect()
      }
    })
  }

  /**
   * Activate or deactivate all buttons
   * Original: on activate me, argYesNo
   *
   * @param {boolean} yesNo - Active state
   */
  activate(yesNo) {
    // Original: repeat with tmpObj in buttons - activate(tmpObj, argYesNo)
    this.buttons.forEach(button => button.activate(yesNo))
  }
}
