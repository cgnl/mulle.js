/**
 * DrawBoat.js - Boat drawing/rendering utilities
 * Based on original Lingo: MovieScript 16 - DrawBoat.ls
 *
 * Handles boat rendering:
 * - Calculates sprite positions for all parts
 * - Handles snap point offsets
 * - Supports percentage scaling
 * - Manages layer ordering
 *
 * Original Lingo handlers:
 * - drawBoat: Main rendering entry point
 * - setSpriteThings: Individual sprite setup
 */
'use strict'

export default class DrawBoat {
  /**
   * Create boat drawer
   * @param {Object} globals - Game globals
   */
  constructor(globals) {
    this.globals = globals

    // Sprite list reference (set by Dir)
    this.spriteList = { BoatStart: 1 }
  }

  /**
   * Draw the boat
   * Original: on drawBoat theOffset, thePercentage, theParts, weightCheck
   * @param {Object} offset - Base offset {x, y}
   * @param {number} percentage - Scale percentage (0-1)
   * @param {Array} parts - Part IDs to draw (optional)
   * @param {boolean} weightCheck - Whether to apply weight check offset
   * @returns {Array} Sprite data array
   */
  drawBoat(offset, percentage, parts, weightCheck) {
    const sprites = []

    // Original: set theStartSP to getaProp(the spriteList of gDir, #BoatStart) - 1
    const startSP = (this.spriteList.BoatStart || 1) - 1

    // Original: if voidp(theOffset) then set theOffset to point(320, 240)
    if (!offset) {
      offset = { x: 320, y: 240 }
    }

    // Original: if voidp(weightCheck) then get draw offset
    if (weightCheck === undefined && this.globals.boatViewHandler) {
      const drawOffset = this.globals.boatViewHandler.getDrawOffset('world')
      if (drawOffset) {
        offset = {
          x: offset.x + drawOffset.x,
          y: offset.y + drawOffset.y
        }
      }
    }

    // Get parts list
    let boat = null
    if (!parts) {
      // Original: set tempBoat to the boat of the user of gMulleGlobals
      boat = this.globals.user.boat
      parts = boat.getParts()
    } else {
      // Create temporary boat for custom parts
      boat = {
        getSnapInfo: (point, what) => {
          // Simplified - return default
          if (what === 'layers') return [1, 2]
          if (what === 'offset') return { x: 0, y: 0 }
          return [[1, 2], { x: 0, y: 0 }]
        }
      }
    }

    // Original: repeat with partsIndex = 1 to count(parts)
    for (const partId of parts) {
      // Original: set partToMount to getPart(the parts of gMulleGlobals, tmpPart)
      const partObj = this.globals.parts.getPart(partId)
      if (!partObj) continue

      let useLayers, snapOffset

      const isHull = this.globals.boatViewHandler.isHull(partId)
      const isRudder = this.globals.boatViewHandler.isRudder(partId)

      if (!isHull && !isRudder) {
        // Original: get snap info from boat
        const tempSnaps = partObj.getRequiredPoints()
        if (tempSnaps && tempSnaps.length > 0) {
          const firstSnapPoint = tempSnaps[0]
          useLayers = boat.getSnapInfo(firstSnapPoint, 'layers')
          snapOffset = boat.getSnapInfo(firstSnapPoint, 'offset')
        } else {
          useLayers = [1, -1]
          snapOffset = { x: 0, y: 0 }
        }
      } else if (isHull) {
        // Original: use hull offsets
        useLayers = [this.globals.HullFrontOffset, this.globals.HullBackOffset]
        snapOffset = { x: 0, y: 0 }
      } else {
        // Rudder
        const hasView2 = partObj.getUseView2 && partObj.getUseView2().length > 0
        if (hasView2) {
          useLayers = [this.globals.rudderFrontOffset, this.globals.rudderBackOffset]
        } else {
          useLayers = [this.globals.rudderBackOffset, -1]
        }
        snapOffset = { x: 0, y: 0 }
      }

      // Draw first layer
      const sp1 = startSP + useLayers[0]
      const sprite1 = this.setSpriteThings(
        sp1,
        partObj,
        offset,
        { ...snapOffset },
        percentage,
        1
      )
      if (sprite1) sprites.push(sprite1)

      // Draw second layer if exists
      if (useLayers.length > 1 && useLayers[1] > -1) {
        const sp2 = startSP + useLayers[1]
        const sprite2 = this.setSpriteThings(
          sp2,
          partObj,
          offset,
          { ...snapOffset },
          percentage,
          2
        )
        if (sprite2) sprites.push(sprite2)
      }
    }

    return sprites
  }

  /**
   * Set sprite properties
   * Original: on setSpriteThings theSP, partToMount, theOffset, theSnapOffset, thePercentage, theNr
   * @param {number} sp - Sprite channel
   * @param {Object} partObj - Part object
   * @param {Object} offset - Base offset
   * @param {Object} snapOffset - Snap point offset
   * @param {number} percentage - Scale percentage
   * @param {number} layerNr - Layer number (1 or 2)
   * @returns {Object|null} Sprite data or null
   */
  setSpriteThings(sp, partObj, offset, snapOffset, percentage, layerNr) {
    // Original: if theNr = 1 then getUseView else getUseView2
    let member
    if (layerNr === 1) {
      member = partObj.getUseView()
    } else {
      member = partObj.getUseView2()
      // Original: if length(tempMember) = 0 then exit
      if (!member || member.length === 0) {
        return null
      }
    }

    // Original: set partOffset to duplicate(getOffset(partToMount))
    let partOffset = { ...partObj.getOffset() }

    // Apply percentage scaling
    if (percentage !== undefined && percentage !== 1) {
      partOffset = {
        x: Math.floor(partOffset.x * percentage),
        y: Math.floor(partOffset.y * percentage)
      }
      snapOffset = {
        x: Math.floor(snapOffset.x * percentage),
        y: Math.floor(snapOffset.y * percentage)
      }
    }

    // Original: set the loc of sprite theSP to theOffset + partOffset + theSnapOffset
    const loc = {
      x: offset.x + partOffset.x + snapOffset.x,
      y: offset.y + partOffset.y + snapOffset.y
    }

    return {
      sp: sp,
      member: member,
      loc: loc,
      percentage: percentage
    }
  }
}
