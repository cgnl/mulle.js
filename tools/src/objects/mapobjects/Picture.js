/**
 * Picture Map Object - ObjectPictureScript.ls (ParentScript 1998)
 *
 * Lingo-faithful port van CDdata animatie object.
 * Eenvoudigste CDdata script: puur frame-cycling animatie.
 * Geen radius checks, geen geluid, geen inventory.
 *
 * Originele properties:
 *   child, frameList, listLen, counter, SP
 *
 * @module objects/mapobjects/Picture
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-7) + `init me` (lines 14-27)
 *
 * new: sets child
 * init: loads frameList, picks SP, positions sprite, starts animation
 */
MapObject.onCreate = function () {
  // ── init (lines 15-18): frameList source ──
  // First try optionalData.frameList, fall back to FrameList.normal
  var frameList = null
  if (this.optionalData && typeof this.optionalData === 'object') {
    frameList = this.optionalData.frameList || null
  }
  if (!frameList) {
    frameList = (this.def && this.def.FrameList && this.def.FrameList.normal)
      ? this.def.FrameList.normal
      : []
  }
  this.frameList = frameList

  // ── init (lines 19-21): SP preference ──
  // Lingo: SP = the SPOver of child; if not (SP > 0) then SP = the SPUnder of child
  this.SP = this.SPOver
  if (!(this.SP > 0)) {
    this.SP = this.SPUnder || 0
  }

  // ── init (line 22): sprite loc ──
  if (this.setSpriteLoc) {
    this.setSpriteLoc(this.SP, this.myLoc)
  } else if (this.setSpriteLocation) {
    this.setSpriteLocation(this.SP, this.myLoc)
  }

  // ── init (lines 23-24): listLen and counter ──
  this.listLen = this.frameList.length
  this.counter = 0 // Lingo uses 1-indexed counter=1; we use 0-indexed

  // ── bringToTop for SPOver sprites ──
  if (this.SPOver > 0 || (this.SpriteInfo && this.SpriteInfo.Over)) {
    if (this.bringToTop) {
      this.bringToTop()
    }
  }

  // ── init (line 25): call step immediately to display first frame ──
  MapObject.step.call(this)
}

/**
 * onDestroy → Lingo `kill me` (lines 9-12)
 * Kill contract: child=0, return 0
 */
MapObject.onDestroy = function () {
  this.child = 0
  return 0
}

/**
 * step → Lingo `step me, carLoc` (lines 29-35)
 *
 * Pure animation cycling. Ignores carLoc entirely.
 * Sets sprite to frameList[counter], increments, wraps.
 */
MapObject.step = function () {
  // Line 30: set sprite member to current frame
  // Lingo: set the member of sprite SP to member getAt(frameList, counter)
  if (this.frameList && this.frameList.length > 0) {
    this.setDirectorMember(this.frameList[this.counter])
  }

  // Line 31: increment counter
  this.counter = this.counter + 1

  // Lines 32-33: wrap
  // Lingo: if counter > listLen then set counter to 1
  // JS 0-indexed: if counter >= listLen then counter = 0
  if (this.counter >= this.listLen) {
    this.counter = 0
  }
}

/**
 * onEnterInner - Not present in Lingo, kept as harmless no-op
 * for compatibility with map-object dispatch system.
 */
MapObject.onEnterInner = function () {
}

export default MapObject
