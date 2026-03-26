/**
 * @fileoverview VirtualMouseHandler - Virtual mouse event handler
 * Based on: MovieScript 19 - virtualMouseHandler.ls
 * 
 * VirtualMouseHandler provides virtual mouse events that forward
 * to the mouseMaster for processing. Used for programmatic mouse
 * event simulation.
 */

/**
 * VirtualMouseHandler class - handles virtual mouse events
 * 
 * Forwards virtual mouse events to the mouseMaster, allowing
 * programmatic simulation of mouse input.
 */
class VirtualMouseHandler {
  /**
   * Create a new VirtualMouseHandler
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals;
    
    // Virtual mouse position
    // Lingo: the mouseH, the mouseV
    this.mouseH = 0;
    this.mouseV = 0;
  }

  /**
   * Handle virtual mouse down
   * Lingo: on virtualMouseDown
   *   mouseDown(the mouseMaster of gMulleGlobals, point(the mouseH, the mouseV))
   * 
   * @param {number|Object} x - X position or point object
   * @param {number} [y] - Y position (if x is number)
   */
  virtualMouseDown(x, y) {
    if (!this.isGlobalsValid()) {
      return;
    }

    const point = this._normalizePoint(x, y);
    this.globals.mouseMaster.mouseDown(point);
  }

  /**
   * Handle virtual mouse up
   * Lingo: on virtualMouseUp
   *   mouseUp(the mouseMaster of gMulleGlobals, point(the mouseH, the mouseV))
   * 
   * @param {number|Object} x - X position or point object
   * @param {number} [y] - Y position (if x is number)
   */
  virtualMouseUp(x, y) {
    if (!this.isGlobalsValid()) {
      return;
    }

    const point = this._normalizePoint(x, y);
    this.globals.mouseMaster.mouseUp(point);
  }

  /**
   * Get current mouse position
   * 
   * @returns {Object} Mouse position {x, y}
   */
  getMousePosition() {
    return { x: this.mouseH, y: this.mouseV };
  }

  /**
   * Set mouse position
   * 
   * @param {number|Object} x - X position or point object
   * @param {number} [y] - Y position (if x is number)
   */
  setMousePosition(x, y) {
    if (typeof x === 'object') {
      this.mouseH = x.x;
      this.mouseV = x.y;
    } else {
      this.mouseH = x;
      this.mouseV = y;
    }
  }

  /**
   * Check if globals and mouseMaster are valid
   * Lingo: if objectp(gMulleGlobals) then
   * 
   * @returns {boolean} True if valid
   */
  isGlobalsValid() {
    return !!(this.globals && this.globals.mouseMaster);
  }

  /**
   * Normalize input to point object
   * @private
   * 
   * @param {number|Object} x - X position or point object
   * @param {number} [y] - Y position
   * @returns {Object} Point {x, y}
   */
  _normalizePoint(x, y) {
    if (typeof x === 'object') {
      return { x: x.x, y: x.y };
    }
    return { x: x, y: y };
  }
}

module.exports = VirtualMouseHandler;
