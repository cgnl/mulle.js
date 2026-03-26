/**
 * CursorHandler.js - Custom cursor management
 * Based on original Lingo: ParentScript 23 - CursorHandler.ls
 *
 * Manages custom cursor display:
 * - Sprite-based cursor
 * - Multiple cursor types
 * - Follows mouse position
 *
 * Original Lingo properties:
 * - SP: Sprite channel for cursor
 * - loopMe: Whether to update position
 * - currentType: Current cursor type
 *
 * Cursor types and images:
 * - Standard: 00b001v0
 * - Clickable: 00b010v0
 * - GoLeft: 00b004v0
 * - GoForward: 00b002v0
 * - GoRight: 00b003v0
 * - Grabable: 00b005v0
 * - Grabbed: 00b006v0
 * - DropLeft: 00b009v0
 * - DropForward: 00b007v0
 * - DropRight: 00b008v0
 */
'use strict'

// Cursor type to image mapping
const CURSOR_IMAGES = {
  Standard: '00b001v0',
  Clickable: '00b010v0',
  GoLeft: '00b004v0',
  GoForward: '00b002v0',
  GoRight: '00b003v0',
  Grabable: '00b005v0',
  Grabbed: '00b006v0',
  DropLeft: '00b009v0',
  DropForward: '00b007v0',
  DropRight: '00b008v0'
}

export default class CursorHandler {
  /**
   * Create cursor handler
   * Original: on new me
   */
  constructor() {
    // Original: set loopMe to 0
    this.loopMe = false

    // Sprite channel
    this.SP = 0

    // Current cursor type
    this.currentType = undefined

    // Current cursor image
    this.cursorPic = undefined

    // Cursor location
    this.loc = { x: 0, y: 0 }

    // Store game instance if passed (or we need to inject it)
    this.game = null
  }

  /**
   * Set game instance
   * @param {Phaser.Game} game
   */
  setGame(game) {
    this.game = game
  }

  /**
   * Initialize cursor
   * Original: on init me, argSP, argType
   * @param {number} sp - Sprite channel
   * @param {string} type - Initial cursor type
   */
  init(sp, type) {
    // Original: if not voidp(argSP) then setCursorSP(me, argSP) else setCursorSP(me, 115)
    this.setCursorSP(sp !== undefined ? sp : 115)

    // Original: if not voidp(argType) then setCursor(me, argType) else setCursor(me, #Standard)
    this.setCursor(type || 'Standard')

    // Original: setCursorLoc(me, point(the mouseH, the mouseV))
    // (Mouse position set externally)

    // Original: cursor(200) - hide system cursor
    // (Handled by renderer)

    // Original: set loopMe to 1
    this.loopMe = true
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    // Original: set SP to 0
    this.SP = 0

    // Original: set currentType to 0
    this.currentType = 0

    // Original: deleteObject(the loopMaster of gMulleGlobals, me)
    // Original: cursor(-1) - show system cursor
    // (Handled externally)

    return 0
  }

  /**
   * Set cursor type
   * Original: on setCursor me, argType
   * @param {string} type - Cursor type
   */
  setCursor(type) {
    // Original: if not ((argType = currentType) or (argType = #NoChange)) then
    if (type === this.currentType || type === 'NoChange') {
      return
    }

    // Original: case argType of ...
    if (CURSOR_IMAGES[type]) {
      this.currentType = type
      this.cursorPic = CURSOR_IMAGES[type]
    } else {
      // Original: otherwise set currentType to #Standard
      this.currentType = 'Standard'
      this.cursorPic = CURSOR_IMAGES.Standard
    }

    // Original: set the member of sprite SP to cursorPic
    // (Sprite update handled by renderer)
  }

  /**
   * Get current cursor type
   * Original: on getCursor me
   */
  getCursor() {
    return this.currentType
  }

  /**
   * Set cursor sprite channel
   * Original: on setCursorSP me, argSP
   */
  setCursorSP(sp) {
    this.SP = sp
  }

  /**
   * Get cursor sprite channel
   * Original: on getCursorSP me
   */
  getCursorSP() {
    return this.SP
  }

  /**
   * Set cursor location
   * Original: on setCursorLoc me, argPoint
   */
  setCursorLoc(point) {
    this.loc = point
    // Original: set the loc of sprite SP to argPoint
    // (Sprite update handled by renderer)
  }

  /**
   * Get cursor location
   * Original: on getCursorLoc me
   */
  getCursorLoc() {
    return this.loc
  }

  /**
   * Update cursor position
   * Original: on loop me
   * @param {Object} mousePos - Mouse position {x, y}
   */
  loop(mousePos) {
    // Original: if not (the loc of sprite SP = point(the mouseH, the mouseV)) and loopMe then
    // Use Phaser input if mousePos not provided
    const x = mousePos ? mousePos.x : (this.game && this.game.input ? this.game.input.activePointer.x : 0)
    const y = mousePos ? mousePos.y : (this.game && this.game.input ? this.game.input.activePointer.y : 0)

    if (this.loopMe) {
      if (this.loc.x !== x || this.loc.y !== y) {
        this.setCursorLoc({ x, y })
      }

      // Update sprite if it exists (assuming it's managed externally or we add it here)
      // If we want CursorHandler to MANAGE the sprite, we should add it.
      // But for now, let's just make sure it delegates valid coords.
    }
  }
}
