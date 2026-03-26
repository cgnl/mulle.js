/**
 * Keys.js - Keyboard and mouse input handler
 * Based on original Lingo: MovieScript 5 - Keys.ls
 *
 * Translates keyboard and mouse events to boat steering commands.
 * Supports:
 * - Arrow keys for steering (left/right)
 * - Arrow keys for throttle (up/down via KeyPoll)
 * - Special keys: minus (throttle up), period (throttle down)
 * - Special keys: < (sail up), z (sail down)
 * - Mouse click for mouse steering mode
 *
 * Key codes:
 * - 123/37: Left arrow
 * - 124/39: Right arrow
 * - 126/38: Up arrow
 * - 125/40: Down arrow
 */
'use strict'

// Key code mappings (Mac and Windows)
const KEY_CODES = {
  LEFT: [123, 37],      // Mac: 123, Windows: 37
  RIGHT: [124, 39],     // Mac: 124, Windows: 39
  UP: [126, 38],        // Mac: 126, Windows: 38
  DOWN: [125, 40]       // Mac: 125, Windows: 40
}

export default class Keys {
  /**
   * Create input handler
   * @param {Object} dir - Director reference (gDir)
   */
  constructor(dir) {
    this.dir = dir || null
  }

  /**
   * Handle key down event
   * Original: on keyDown
   * @param {Object} event - Key event with keyCode and key properties
   */
  keyDown(event) {
    // Original: if objectp(gDir) then
    if (!this.dir) {
      return
    }

    // Original: if the gotKeyPoll of gDir then exit
    if (this.dir.gotKeyPoll) {
      return
    }

    const keyCode = event.keyCode
    const key = event.key

    // Original: if tmpCode = 123 then key(gDir, #left, #NA)
    if (KEY_CODES.LEFT.includes(keyCode) || key === 'ArrowLeft') {
      this.dir.key('left', 'NA')
      return
    }

    // Original: if tmpCode = 124 then key(gDir, #right, #NA)
    if (KEY_CODES.RIGHT.includes(keyCode) || key === 'ArrowRight') {
      this.dir.key('right', 'NA')
      return
    }

    // Original: if tmpKey = "-" then key(gDir, 2, 1)
    if (key === '-') {
      this.dir.key(2, 1)
      return
    }

    // Original: if tmpKey = "." then key(gDir, 2, -1)
    if (key === '.') {
      this.dir.key(2, -1)
      return
    }

    // Original: if tmpKey = "<" then key(gDir, 1, 1)
    if (key === '<') {
      this.dir.key(1, 1)
      return
    }

    // Original: if tmpKey = "z" then key(gDir, 1, -1)
    if (key === 'z') {
      this.dir.key(1, -1)
      return
    }

    // Original: if tmpKey = "f" then (empty handler - fuel toggle?)
    if (key === 'f') {
      // Empty handler in original
      return
    }

    // Unrecognized key - ignore
  }

  /**
   * Handle key up event
   * Original: on keyUp
   * @param {Object} event - Key event
   */
  keyUp(event) {
    // Original: if objectp(gDir) then key(gDir, 0, #Release)
    if (!this.dir) {
      return
    }

    this.dir.key(0, 'Release')
  }

  /**
   * Poll all currently pressed keys (KeyPoll Xtra simulation)
   * Original: on KeyPoll
   * @param {Array<number>} pressedKeys - List of currently pressed key codes
   */
  keyPoll(pressedKeys) {
    if (!this.dir) {
      return
    }

    // Original: set tmpLeftRight to 0
    let tmpLeftRight = 0

    // Original: set tmpUpDown to 0
    let tmpUpDown = 0

    // Original: if getPos(tmp, 37) or getPos(tmp, 123) then set tmpLeftRight to #left
    if (this._hasKey(pressedKeys, KEY_CODES.LEFT)) {
      tmpLeftRight = 'left'
    }
    // Original: else if getPos(tmp, 39) or getPos(tmp, 124) then set tmpLeftRight to #right
    else if (this._hasKey(pressedKeys, KEY_CODES.RIGHT)) {
      tmpLeftRight = 'right'
    }

    // Original: if getPos(tmp, 38) or getPos(tmp, 126) then set tmpUpDown to #up
    if (this._hasKey(pressedKeys, KEY_CODES.UP)) {
      tmpUpDown = 'up'
    }
    // Original: else if getPos(tmp, 40) or getPos(tmp, 125) then set tmpUpDown to #down
    else if (this._hasKey(pressedKeys, KEY_CODES.DOWN)) {
      tmpUpDown = 'down'
    }

    // Original: key(gDir, tmpLeftRight, tmpUpDown)
    this.dir.key(tmpLeftRight, tmpUpDown)
  }

  /**
   * Handle mouse down event
   * Original: on mouseDown
   * @param {Object} event - Mouse event
   */
  mouseDown(event) {
    // Original: if objectp(gDir) then mouse(gDir, 0, #down)
    if (!this.dir) {
      return
    }

    this.dir.mouse(0, 'down')
  }

  /**
   * Set or update the director reference
   * @param {Object} dir - Director reference
   */
  setDirector(dir) {
    this.dir = dir
  }

  /**
   * Check if any of the key codes are in the pressed keys list
   * @param {Array<number>} pressedKeys - List of pressed key codes
   * @param {Array<number>} targetCodes - Key codes to check for
   * @returns {boolean}
   * @private
   */
  _hasKey(pressedKeys, targetCodes) {
    return targetCodes.some(code => pressedKeys.includes(code))
  }
}
