/**
 * Reef Map Object - ObjectReefScript.ls (ParentScript)
 *
 * Lingo-faithful port van CDdata reef/ondiepte object.
 * Blocks boats whose RealDepth exceeds the reef's OKDepth threshold.
 * When blocked, the boat is pushed back to its stepback location.
 *
 * Originele properties:
 *   child, insideInner, insideOuter, OKDepth, enterOK, enterLoc
 *
 * @module objects/mapobjects/Reef
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-8) + `init me` (lines 15-28)
 *
 * new: sets child, insideInner=0, insideOuter=0
 * init: reads optionalData.depth → OKDepth (default 4), checks boat RealDepth
 */
MapObject.onCreate = function () {
  // ── new (lines 5-7) ──
  this.insideInner = 0
  this.insideOuter = 0

  // ── init ──
  MapObject.init.call(this)
}

/**
 * init → Lingo `init me` (lines 15-28)
 *
 * - Read optionalData.depth → OKDepth (default 4)
 * - Check boat quickProps.RealDepth > OKDepth → enterOK=0 (blocked) or enterOK=1
 */
MapObject.init = function () {
  // Lines 16-17: read OKDepth from optionalData.depth, default 4
  var opt = this.optionalData || this.opt || {}
  this.OKDepth = (typeof opt.depth === 'number') ? opt.depth : 4

  // Lines 19-27: check boat RealDepth against OKDepth
  var boat = this.state && this.state.driveBoat
  var tmp = boat ? boat.quickProps : null

  if (tmp && typeof tmp === 'object' && typeof tmp.RealDepth === 'number') {
    if (tmp.RealDepth > this.OKDepth) {
      // Boat is too deep for this reef → blocked
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
 * step → Lingo `step me, carLoc` (lines 30-45)
 *
 * - checkRadius with #both
 * - If EnterInnerRadius/EnterBoth → call onEnterInner
 * - If insideInner AND !enterOK → force boat loc to enterLoc, speed=0
 */
MapObject.step = function (carLoc) {
  // Lines 31-38: checkRadius
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

  // Lines 39-44: if insideInner and not enterOK, force boat back
  if (this.insideInner && !this.enterOK) {
    var boat = this.state && this.state.driveBoat
    if (boat) {
      if (this.enterLoc && boat.position) {
        boat.position.x = this.enterLoc.x
        boat.position.y = this.enterLoc.y
      }
      boat.speed = 0
    }
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 47-56)
 *
 * If not enterOK: compute stepback loc 2 units behind boat, save as enterLoc, speed=0
 */
MapObject.onEnterInner = function () {
  this.insideInner = 1

  if (!this.enterOK) {
    var boat = this.state && this.state.driveBoat
    if (!boat) return

    // Lingo: stepback(boat, 2) → returns a point 2 units behind the boat
    var stepbackLoc = (typeof boat.stepback === 'function') ? boat.stepback(2) : null
    this.enterLoc = stepbackLoc || (boat.position ? { x: boat.position.x, y: boat.position.y } : null)
    boat.speed = 0
  }
}

export default MapObject
