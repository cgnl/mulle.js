/**
 * RiverEnter Map Object - ObjectRiverEnterScript.ls (ParentScript)
 *
 * Lingo-faithful port van CDdata rivier-ingang object.
 * Blocks boats whose RealDepth exceeds 8 from entering the river.
 * When blocked, the boat is pushed back to its stepback location.
 *
 * Originele properties:
 *   child, insideInner, insideOuter, lastCommentCounter, enterOK, enterLoc
 *
 * @module objects/mapobjects/RiverEnter
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-8) + `init me` (lines 15-20)
 *
 * new: sets child, insideInner=0, insideOuter=0, lastCommentCounter=0
 * init: checks boat RealDepth > 8 → enterOK=0, else enterOK=1
 */
MapObject.onCreate = function () {
  // ── new (lines 4-8) ──
  this.insideInner = 0
  this.insideOuter = 0
  this.lastCommentCounter = 0
  this.enterLoc = null

  // ── init ──
  var boat = this.state && this.state.driveBoat
  var tmp = boat ? boat.quickProps : null

  if (tmp && typeof tmp === 'object' && typeof tmp.RealDepth === 'number') {
    if (tmp.RealDepth > 8) {
      this.enterOK = 0
    } else {
      this.enterOK = 1
    }
  } else {
    // No depth info → allowed by default
    this.enterOK = 1
  }
}

/**
 * onDestroy → Lingo `kill me` (lines 10-13)
 * Kill contract: child=0, return 0
 */
MapObject.onDestroy = function () {
  this.child = 0
  return 0
}

/**
 * step → Lingo `step me, carLoc` (lines 22-38)
 *
 * - Decrement lastCommentCounter if >0
 * - checkRadius with #both
 * - If EnterInnerRadius → call onEnterInner
 * - If insideInner AND !enterOK → force boat loc to enterLoc, speed=0
 */
MapObject.step = function (carLoc) {
  // Decrement lastCommentCounter if >0
  if (this.lastCommentCounter > 0) {
    this.lastCommentCounter = this.lastCommentCounter - 1
  }

  // checkRadius with #both
  var handlers = this.state && this.state.drivingHandlers
  if (handlers && typeof handlers.checkRadius === 'function' && carLoc) {
    var myLoc = {
      x: (this.position && typeof this.position.x === 'number') ? this.position.x : this.x,
      y: (this.position && typeof this.position.y === 'number') ? this.position.y : this.y
    }
    var event = handlers.checkRadius(this, [carLoc.x, carLoc.y], [myLoc.x, myLoc.y], 'both')

    if (event === 'EnterInnerRadius' || event === 'EnterBoth') {
      MapObject.onEnterInner.call(this)
    }
  }

  // If insideInner AND !enterOK → force boat loc to enterLoc, speed=0
  if (this.insideInner && !this.enterOK) {
    var boat = this.state && this.state.driveBoat
    if (boat) {
      if (this.enterLoc && boat.loc) {
        boat.loc.x = this.enterLoc.x
        boat.loc.y = this.enterLoc.y
      }
      boat.speed = 0
    }
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 40-50)
 *
 * If !enterOK: if lastCommentCounter=0 → say(sounds[0], 2)
 *              stepback(2) → enterLoc, speed=0, lastCommentCounter=100
 */
MapObject.onEnterInner = function () {
  this.insideInner = 1

  if (!this.enterOK) {
    var boat = this.state && this.state.driveBoat
    if (!boat) return

    if (this.lastCommentCounter === 0) {
      var sounds = this.def.Sounds || this.sounds || []
      var snd = sounds[0]
      if (snd && this.state && this.state.mulleTalkObject && typeof this.state.mulleTalkObject.say === 'function') {
        this.state.mulleTalkObject.say(snd, 2)
      }
    }

    // stepback(2) → enterLoc
    var stepbackLoc = (typeof boat.stepback === 'function') ? boat.stepback(2) : null
    this.enterLoc = stepbackLoc || (boat.loc ? { x: boat.loc.x, y: boat.loc.y } : null)
    boat.speed = 0
    this.lastCommentCounter = 100
  }
}

export default MapObject
