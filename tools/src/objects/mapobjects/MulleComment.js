/**
 * MulleComment Map Object - ObjectMulleCommentScript.ls (ParentScript)
 *
 * Lingo-faithful port van CDdata comment trigger object.
 * One-shot trigger: plays Mulle comment sound when car enters inner radius
 * of ANY checkpoint. Multi-checkpoint support via standard checkRadius.
 *
 * Originele properties:
 *   child, hasEntered, insideInner, insideOuter, sound, checkPoints
 *
 * @module objects/mapobjects/MulleComment
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-8) + `init me` (lines 14-24)
 *
 * new: sets child, hasEntered=0, insideInner=0, insideOuter=0
 * init: reads sound, optional radius override, checkPoints
 */
MapObject.onCreate = function () {
  // ── new (lines 4-8) ──
  this.hasEntered = 0
  this.insideInner = 0
  this.insideOuter = 0

  // ── init ──
  // Read optionalData.sound
  this.sound = null
  if (this.optionalData && typeof this.optionalData === 'object') {
    this.sound = this.optionalData.sound || null
  }

  // Read optionalData.radius → if truthy, override InnerRadius
  if (this.optionalData && typeof this.optionalData === 'object') {
    var radius = this.optionalData.radius
    if (radius) {
      this.InnerRadius = radius
    }
  }

  // Read optionalData.checkPoints, default to [myLoc]
  var checkPoints = null
  if (this.optionalData && typeof this.optionalData === 'object') {
    checkPoints = this.optionalData.checkPoints || null
  }
  if (!checkPoints || !Array.isArray(checkPoints) || checkPoints.length === 0) {
    checkPoints = [this.myLoc || { x: this.x, y: this.y }]
  }
  this.checkPoints = checkPoints
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
 * step → Lingo `step me, carLoc` (lines 26-34)
 *
 * For each checkpoint: checkRadius with #both
 * If EnterInnerRadius at ANY checkpoint → call EnterInnerRadius, exit loop
 */
MapObject.step = function (carLoc) {
  if (!this.state || !this.state.drivingHandlers || !this.state.drivingHandlers.checkRadius) return

  for (var i = 0; i < this.checkPoints.length; i++) {
    var temp = this.state.drivingHandlers.checkRadius(this, carLoc, this.checkPoints[i], 'both')

    if (temp === 'EnterInnerRadius' || temp === 'EnterBoth') {
      MapObject.onEnterInner.call(this)
      break
    }
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 36-44)
 *
 * One-shot trigger: if hasEntered=0, set hasEntered=1, say(mulleTalkObject, sound, 5)
 */
MapObject.onEnterInner = function () {
  if (this.hasEntered === 0) {
    this.hasEntered = 1
    if (this.sound && this.state && this.state.mulleTalkObject && typeof this.state.mulleTalkObject.say === 'function') {
      this.state.mulleTalkObject.say(this.sound, 5)
    }
  }
}

export default MapObject
