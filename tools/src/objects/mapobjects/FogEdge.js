/**
 * FogEdge Map Object - ObjectFogEdgeScript.ls (ParentScript)
 *
 * Lingo-faithful port van CDdata fog edge object.
 * Uses rectangular hit testing (sprite rect) instead of radius checks.
 * Plays a voice line when the boat enters the fog zone, depending on
 * whether the boat has a compass or not.
 *
 * Originele properties:
 *   child, insideInner, insideOuter, alreadyTold, gotCompass, SP, Pic
 *
 * @module objects/mapobjects/FogEdge
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-9) + `init me` (lines 16-28)
 *
 * new: sets child, insideInner=0, insideOuter=0, alreadyTold=0
 * init: checks boat compass, reads Pic, sets sprite
 */
MapObject.onCreate = function () {
  // ── new (lines 5-8) ──
  this.insideInner = 0
  this.insideOuter = 0
  this.alreadyTold = 0

  // ── init ──
  MapObject.init.call(this)
}

/**
 * init → Lingo `init me` (lines 16-28)
 *
 * - Check boat quickProps.Compass → gotCompass 0/1
 * - Read optionalData.Pic
 * - SP = SPOver
 * - Set sprite loc to (320, 240), member to Pic
 */
MapObject.init = function () {
  // Lines 17-20: check for compass
  var boat = this.state && this.state.driveBoat
  var tmp = boat ? boat.quickProps : null

  if (tmp && typeof tmp === 'object' && tmp.Compass) {
    this.gotCompass = 1
  } else {
    this.gotCompass = 0
  }

  // Lines 22-27: read Pic from optionalData
  var opt = this.optionalData || this.opt || {}
  this.Pic = opt.Pic || null

  // Line 23: SP = SPOver of child
  this.SP = this.SPOver || 0

  // Line 25: set sprite loc to point(320, 240)
  if (typeof this.setSpriteLocation === 'function' && this.SP) {
    this.setSpriteLocation(this.SP, { x: 320, y: 240 })
  }

  // Line 26: set sprite member to Pic
  if (this.Pic && typeof this.setDirectorMember === 'function') {
    this.setDirectorMember(this.Pic)
  }
}

/**
 * onDestroy → Lingo `kill me` (lines 11-14)
 * Kill contract: child=0, return 0
 */
MapObject.onDestroy = function () {
  this.child = 0
  return 0
}

/**
 * step → Lingo `step me, carLoc` (lines 30-45)
 *
 * No radius checks. Uses rectangular hit test instead.
 * - If alreadyTold, exit
 * - Check if carLoc inside sprite rect
 * - If inside: pick voice line depending on compass, say it, alreadyTold=1
 */
MapObject.step = function (carLoc) {
  // Line 31: guard
  if (this.alreadyTold) return

  if (!carLoc) return

  // Lines 32-38: check if carLoc inside sprite rect
  var rect = this.spriteRect
  if (!rect) return

  var inside = (carLoc.x >= rect.left && carLoc.x <= rect.right &&
                carLoc.y >= rect.top && carLoc.y <= rect.bottom)

  if (!inside) return

  // Lines 39-43: pick voice line and say it
  var sound
  if (this.gotCompass) {
    // Line 40: with compass
    sound = '05d006v0'
  } else {
    // Line 41: without compass
    sound = '05d005v0'
  }

  // Line 42: say(the mulleTalkObject of gDir, tmpSnd, 4)
  if (this.state && this.state.mulleTalkObject && typeof this.state.mulleTalkObject.say === 'function') {
    this.state.mulleTalkObject.say(sound, 4)
  }

  // Line 43: alreadyTold = 1
  this.alreadyTold = 1
}

export default MapObject
