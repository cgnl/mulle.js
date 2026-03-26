/**
 * JunkHandler.js - Junk yard parts display and drag handling
 * Based on original Lingo: ParentScript 13 - JunkHandler.ls
 *
 * Manages junk yard display:
 * - Draws parts in junk locations
 * - Handles pick up and drop
 * - Manages drag objects
 *
 * Original Lingo properties:
 * - junkObjects: List of displayed junk part objects
 * - junkWhere: Location identifier (Yard, Shelf1, etc.)
 * - dragObject: Currently dragged object
 */
'use strict'

export default class JunkHandler {
  /**
   * Create junk handler
   * Original: on new me, argWhere
   * @param {string} where - Junk location identifier
   * @param {Object} globals - Game globals
   */
  constructor(where, globals) {
    this.globals = globals

    // Original: set junkObjects to []
    this.junkObjects = []

    // Original: set junkWhere to argWhere
    this.junkWhere = where

    // Original: set dragObject to 0
    this.dragObject = 0

    // Sprite list reference (set by Dir)
    this.spriteList = {}

    // Boat handler reference (set by Dir)
    this.boatHandler = null
  }

  /**
   * Clean up displayed objects
   * Original: on cleanUp me
   */
  cleanUp() {
    // Original: repeat with tmpObject in junkObjects; kill(tmpObject); end repeat
    for (const obj of this.junkObjects) {
      if (obj && typeof obj.kill === 'function') {
        obj.kill()
      }
    }

    // Original: set junkObjects to []
    this.junkObjects = []
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    this.cleanUp()
    return 0
  }

  /**
   * Draw parts in junk location
   * Original: on drawParts me
   */
  drawParts() {
    // Original: cleanUp(me)
    this.cleanUp()

    // Original: set tmpStartSP to getaProp(the spriteList of gDir, #JunkStart) - 1
    const startSP = (this.spriteList.JunkStart || 50) - 1

    // Original: set tmpList to getJunk(the user of gMulleGlobals, junkWhere)
    const partsList = this.globals.user.getJunk(this.junkWhere)
    if (!partsList) return

    const partIds = Object.keys(partsList)

    // Original: repeat with tmpRkn = 1 to tmpNoOfParts
    for (let i = 0; i < partIds.length; i++) {
      const partId = partIds[i]
      const partLoc = partsList[partId]

      // Original: set tmpObj to new(script "JunkPart", ...)
      // Create junk part object (simplified)
      const junkPart = {
        SP: startSP + i + 1,
        partId: partId,
        loc: partLoc,
        handler: this,
        kill: () => {}
      }

      this.junkObjects.push(junkPart)
    }

    // Original: hide extra sprites
    // (Handled by renderer)
  }

  /**
   * Get junk location
   * Original: on getWhere me
   */
  getWhere() {
    return this.junkWhere
  }

  /**
   * Handle part pick up
   * Original: on pickedUp me, argPartID, argMember
   * @param {string} partId - Part identifier
   * @param {string} member - Member/image name
   */
  pickedUp(partId, member) {
    // Original: removeJunkPart(the user of gMulleGlobals, junkWhere, argPartID)
    this.globals.user.removeJunkPart(this.junkWhere, partId)

    // Original: set dragObject to new(script "DragScript", me, argPartID, argMember, junkWhere)
    this.dragObject = {
      partId: partId,
      member: member,
      fromWhere: this.junkWhere,
      handler: this,
      kill: () => null
    }
  }

  /**
   * Handle part drop
   * Original: on dropped me, argPartID, argLoc
   * @param {string} partId - Part identifier
   * @param {Object} loc - Drop location {x, y}
   */
  dropped(partId, loc) {
    // Original: if objectp(dragObject) then set dragObject to kill(dragObject)
    if (this.dragObject && typeof this.dragObject.kill === 'function') {
      this.dragObject = this.dragObject.kill()
    }

    // Original: set tmpToWhere to getToWhere(the mouseMaster of gMulleGlobals)
    const toWhere = this.globals.mouseMaster.getToWhere()

    // Original: if not (char 1 to 4 of string(tmpToWhere) = "Boat") then
    if (typeof toWhere === 'string' && toWhere.substring(0, 4) === 'Boat') {
      // Drop on boat
      if (this.boatHandler && typeof this.boatHandler.dropped === 'function') {
        this.boatHandler.dropped(partId, loc)
      }
    } else {
      // Original: if tmpToWhere = #NoWhere then
      if (toWhere === 'NoWhere') {
        // Add back to original location
        this.globals.user.addJunkPart(this.junkWhere, partId, loc)
      } else {
        // Try to add to new location
        if (!this.globals.user.addJunkPart(toWhere, partId)) {
          // Failed, add back to original
          this.globals.user.addJunkPart(this.junkWhere, partId, loc)
        }
      }

      // Original: drawParts(me)
      this.drawParts()
    }
  }
}
