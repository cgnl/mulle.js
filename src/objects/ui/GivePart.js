/**
 * @fileoverview GivePart - Give part behavior
 * Based on: BehaviorScript 33 - givePart.ls
 * 
 * GivePart handles displaying a part that is being given to the player,
 * showing its shelf view sprite in the designated sprite slot.
 */

/**
 * GivePart class - handles part giving display
 * 
 * This behavior script shows the shelf view of a part being given
 * to the player in the designated dummy part sprite slot.
 */
class GivePart {
  /**
   * Create a new GivePart behavior
   * 
   * @param {Object} dir - Director reference (gDir)
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(dir, globals) {
    this.dir = dir;
    this.globals = globals;
  }

  /**
   * Begin sprite handler - initialize part display
   * Lingo: on beginSprite
   * 
   * If there's a part to give, displays its shelf view in the
   * dummy part sprite slot.
   */
  beginSprite() {
    // Check if there's a part to give
    // Lingo: if the givePart of gDir <> #NoPart then
    if (!this.hasPartToGive()) {
      return;
    }
    
    // Get the part object
    // Lingo: set tmpPart to getPart(the parts of gMulleGlobals, the givePart of gDir)
    const partId = this.dir.givePart;
    const part = this.globals.parts.getPart(partId);
    
    // Set the sprite member to the shelf view
    // Lingo: set the member of sprite the myDummyPart of gDir to getShelfView(tmpPart)
    const shelfView = part.getShelfView();
    const sprite = this.dir.getSprite(this.dir.myDummyPart);
    sprite.member = shelfView;
  }

  /**
   * Exit frame handler - loop on current frame
   * Lingo: on exitFrame
   *   go(the frame)
   */
  exitFrame() {
    const currentFrame = this.dir.getCurrentFrame();
    this.dir.goToFrame(currentFrame);
  }

  /**
   * Check if there's a part to give
   * Lingo: the givePart of gDir <> #NoPart
   * 
   * @returns {boolean} True if there's a part to give
   */
  hasPartToGive() {
    const givePart = this.dir.givePart;
    return givePart !== 'NoPart' && givePart !== null && givePart !== 0;
  }

  /**
   * Get the current part to give
   * 
   * @returns {*} Part ID or 'NoPart'
   */
  getGivePart() {
    return this.dir.givePart;
  }
}

module.exports = GivePart;
