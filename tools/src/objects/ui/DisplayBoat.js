/**
 * DisplayBoat.js - Boat sprite display and animation controller
 * Based on original Lingo: ParentScript 36 - DisplayBoat.ls
 *
 * Handles:
 * - Selecting correct boat frame based on direction and inclination
 * - Positioning boat sprite on screen
 * - Visibility toggling
 *
 * Original Lingo properties:
 * - lastSpeed: previous speed value for sound transitions
 * - limitList: speed thresholds [10, 20, 40, 70]
 * - SP: sprite channel
 * - firstFrame: base frame number ("Boat0000")
 * - soundOn: whether sound is enabled
 * - visible: visibility flag
 * - masterObject: reference to boat controller
 * - frontBackList: pitch inclination mapping [2, 1, 0, 4, 3]
 * - sideList: roll inclination mapping [2, 1, 0, 3, 4]
 * - decimalPrec: position precision (100)
 * - maxSpeed: maximum speed (600)
 */
'use strict'

export default class DisplayBoat {
  /**
   * Create display controller
   * Original: on new me, theMaster, isShow
   *
   * @param {object} masterObject - Reference to boat controller
   * @param {boolean} [isShow=true] - Initial visibility
   */
  constructor(masterObject, isShow = true) {
    // Original: set limitList to [10, 20, 40, 70]
    // Original: sort(limitList)
    this.limitList = [10, 20, 40, 70]

    // Original: set masterObject to theMaster
    this.masterObject = masterObject

    // Original: set lastSpeed to 0
    this.lastSpeed = 0

    // Original: set decimalPrec to 100
    this.decimalPrec = 100

    // Original: set frontBackList to [2, 1, 0, 4, 3]
    // Maps pitch inclination (-2 to +2) to frame offset multiplier
    this.frontBackList = [2, 1, 0, 4, 3]

    // Original: set sideList to [2, 1, 0, 3, 4]
    // Maps roll inclination (-2 to +2) to frame offset multiplier
    this.sideList = [2, 1, 0, 3, 4]

    // Original: set maxSpeed to 600
    this.maxSpeed = 600

    // Original: set soundOn to 0 (overridden at end of constructor)
    this.soundOn = false

    // Original: set visible to 1
    this.visible = true

    // Sprite channel (would be set from gDir.spriteList.boat)
    this.SP = null

    // First frame member number (would be "Boat0000" - 1)
    this.firstFrame = 0

    // Visuals: Create Sprite
    if (this.masterObject && this.masterObject.game) {
      const game = this.masterObject.game

      // Get Hull Asset Key
      let assetKey = 'Boat_Wood_Large' // Default fallback

      // Try to resolve via BoatViewHandler
      // Assuming masterObject has deps.boatViewHandler or similar access
      // Pattern: master -> deps -> boatViewHandler
      const viewHandler = this.masterObject.deps && this.masterObject.deps.boatViewHandler

      if (viewHandler && viewHandler.getCurrentHull && viewHandler.getHullSpriteKey) {
        const hullId = viewHandler.getCurrentHull()
        assetKey = viewHandler.getHullSpriteKey(hullId)
      } else {
        // Fallback or try to get from user inventory manually?
        // For now, rely on ViewHandler being present in deps
      }

      try {
        this.sprite = game.add.sprite(0, 0, assetKey, 0)
        this.sprite.anchor.set(0.5) // Center anchor for rotation/positioning
        // Z-order? Boat should be above water but below HUD
        // Assuming Z=100 or similar. Lingo handled this via channels.
        // Let's set a reasonable default or let Phaser handle it order-based.
        this.sprite.z = 100
      } catch (e) {
        console.warn('DisplayBoat: Failed to create sprite', assetKey, e)
      }
    }
  }

  /**
   * Clean up display
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
    return null
  }

  /**
   * Toggle visibility
   * Original: on show me, YesNo
   *
   * @param {number} yesNo - 1 to show, 0 to hide
   */
  show(yesNo) {
    // Original: set visible to YesNo
    this.visible = yesNo === 1

    // Original: if YesNo = 0 then set the member of sprite SP to member "Dummy"
    // else display(me)
    // In JS version, actual sprite update handled by renderer
  }

  /**
   * Calculate which picture frame to show based on direction and inclination
   * Original: on calcPicToShow me, argDirection, argInclinationList
   *
   * The boat has 16 directions × 5 side inclinations × 5 front/back inclinations = 400 frames
   *
   * @param {number} argDirection - Current direction (0-15, wraps at 16)
   * @param {number[]} argInclinationList - [side, frontBack] inclinations (-2 to +2)
   * @returns {number} Frame index (1-based)
   */
  calcPicToShow(argDirection, argInclinationList) {
    // Original: set side to getAt(argInclinationList, 1)
    // Original: set frontBack to getAt(argInclinationList, 2)
    const side = argInclinationList[0]
    const frontBack = argInclinationList[1]

    // Original: set tmpDir to 1 + (argDirection mod 16)
    // Direction is 1-based in frame calculation
    const tmpDir = 1 + (argDirection % 16)

    // Original: set xx to tmpDir + (80 * getAt(sideList, side + 3)) + (16 * getAt(frontBackList, frontBack + 3))
    // sideList and frontBackList are 1-indexed in Lingo, so side + 3 maps -2..+2 to indices 1..5
    // In JS 0-indexed arrays: side + 2 maps -2..+2 to indices 0..4
    const sideMultiplier = this.sideList[side + 2]
    const frontBackMultiplier = this.frontBackList[frontBack + 2]

    const xx = tmpDir + (80 * sideMultiplier) + (16 * frontBackMultiplier)

    return xx
  }

  /**
   * Update display with current state
   * Original: on display me, argInclinationList
   *
   * @param {number[]} argInclinationList - [altitude, side, frontBack]
   * @returns {object|null} Display info {position, frame} or null if not visible
   */
  display(argInclinationList) {
    // Original: if visible then ...
    if (!this.visible) {
      return null
    }

    // Original: set loc to the loc of masterObject
    // Original: set direction to the direction of masterObject
    const loc = this.masterObject.loc
    const direction = this.masterObject.direction

    // Original: set side to getAt(argInclinationList, 2)
    // Original: set frontBack to getAt(argInclinationList, 3)
    // Original: set tmpAlt to getAt(argInclinationList, 1)
    // Note: Lingo 1-indexed vs JS 0-indexed
    const tmpAlt = argInclinationList[0]
    const side = argInclinationList[1]
    const frontBack = argInclinationList[2]

    // Original: set tmpDir to 1 + (direction mod 16)
    const tmpDir = 1 + (direction % 16)

    // Original: set xx to tmpDir + (80 * getAt(sideList, side + 3)) + (16 * getAt(frontBackList, frontBack + 3))
    const sideMultiplier = this.sideList[side + 2]
    const frontBackMultiplier = this.frontBackList[frontBack + 2]
    const frame = tmpDir + (80 * sideMultiplier) + (16 * frontBackMultiplier)

    // Original: set the loc of sprite SP to point(0, -tmpAlt / 10) + (loc / decimalPrec)
    const position = {
      x: loc.x / this.decimalPrec,
      y: (loc.y / this.decimalPrec) - (tmpAlt / 10)
    }

    // Update Sprite
    if (this.sprite) {
      this.sprite.x = position.x
      this.sprite.y = position.y
      this.sprite.frame = frame
      this.sprite.visible = this.visible
    }

    return {
      position,
      frame
    }
  }

  /**
   * Animation loop
   * Original: on loop me
   *
   * @param {number[]} argInclinationList - [altitude, side, frontBack]
   * @returns {object|null} Display info from display()
   */
  loop(argInclinationList) {
    // Original: display(me)
    return this.display(argInclinationList)
  }
}
