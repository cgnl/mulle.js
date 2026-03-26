/**
 * Maelstrom Map Object - ObjectMaelstromScript.ls (ParentScript)
 *
 * Lingo-faithful port van CDdata draaikolk object.
 * Applies a 2D rotation around the maelstrom center to the boat,
 * pulling it in a swirling pattern. The closer the boat, the stronger
 * the rotational effect (angle = 2.0 / distance).
 *
 * Originele properties:
 *   child, insideInner, insideOuter, SP
 *
 * @module objects/mapobjects/Maelstrom
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-8) + `init me` (lines 15-22)
 *
 * new: sets child, insideInner=0, insideOuter=0
 * init: reads optionalData.sound, SP=SPUnder, sets sprite member + loc
 */
MapObject.onCreate = function () {
  // ── new (lines 5-7) ──
  this.insideInner = 0
  this.insideOuter = 0

  // ── init ──
  MapObject.init.call(this)
}

/**
 * init → Lingo `init me` (lines 15-22)
 *
 * - Read optionalData.sound
 * - SP = SPUnder
 * - Set sprite member to "MaelstromPic", loc to myLoc
 */
MapObject.init = function () {
  // Line 16: read sound from optionalData
  var opt = this.optionalData || this.opt || {}
  this.sound = opt.sound

  // Line 18: SP = SPUnder of child
  this.SP = this.SPUnder || 0

  // Line 19: set the member of sprite SP to member "MaelstromPic"
  if (typeof this.setDirectorMember === 'function') {
    this.setDirectorMember('MaelstromPic')
  }

  // Line 20: set the loc of sprite SP to the myLoc of child
  if (typeof this.setSpriteLocation === 'function' && this.SP) {
    var loc = this.myLoc || { x: this.x, y: this.y }
    this.setSpriteLocation(this.SP, loc)
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
 * step → Lingo `step me, carLoc` (lines 24-45)
 *
 * - checkRadius with #both
 * - If insideOuter: compute diff vector from myLoc to carLoc, distance
 * - If distance=0 exit
 * - angle = 2.0 / distance
 * - Apply 2D rotation: newX = Y*sin(a) + X*cos(a), newY = Y*cos(a) - X*sin(a)
 * - Set boat showCoordinate to myLoc + rotated offset
 */
MapObject.step = function (carLoc) {
  // Lines 25-32: checkRadius
  var handlers = this.state && this.state.drivingHandlers
  if (handlers && typeof handlers.checkRadius === 'function' && carLoc) {
    var myLoc = this.myLoc || {
      x: (this.position && typeof this.position.x === 'number') ? this.position.x : this.x,
      y: (this.position && typeof this.position.y === 'number') ? this.position.y : this.y
    }
    var event = handlers.checkRadius(this, [carLoc.x, carLoc.y], [myLoc.x, myLoc.y], 'both')

    if (event === 'EnterBoth' || event === 'enterOuterRadius' || event === 'EnterOuterRadius') {
      this.insideOuter = 1
    } else if (event === 'ExitBoth' || event === 'ExitOuterRadius' || event === 'exitOuterRadius') {
      this.insideOuter = 0
    }
    if (event === 'EnterInnerRadius' || event === 'EnterBoth') {
      MapObject.onEnterInner.call(this)
    }
  }

  // Lines 33-44: rotation effect while insideOuter
  if (!this.insideOuter) return

  var center = this.myLoc || {
    x: (this.position && typeof this.position.x === 'number') ? this.position.x : this.x,
    y: (this.position && typeof this.position.y === 'number') ? this.position.y : this.y
  }

  // Lingo: diff = myLoc - carLoc (vector from car to center)
  // But rotation applied to offset from center, so: X = carLoc.x - myLoc.x, Y = carLoc.y - myLoc.y
  var X = carLoc.x - center.x
  var Y = carLoc.y - center.y

  var distance = Math.sqrt(X * X + Y * Y)
  if (distance === 0) return

  // Lingo: angle = 2.0 / distance
  var a = 2.0 / distance

  // Lingo rotation formula:
  // newX = Y * sin(angle) + X * cos(angle)
  // newY = Y * cos(angle) - X * sin(angle)
  var sinA = Math.sin(a)
  var cosA = Math.cos(a)
  var newX = Y * sinA + X * cosA
  var newY = Y * cosA - X * sinA

  // Set boat position to myLoc + rotated offset
  var boat = this.state && this.state.driveBoat
  if (boat && typeof boat.setShowCoordinate === 'function') {
    boat.setShowCoordinate({
      x: center.x + newX,
      y: center.y + newY
    })
  } else if (boat && boat.position) {
    boat.position.x = center.x + newX
    boat.position.y = center.y + newY
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 47-48)
 * Empty no-op in Lingo.
 */
MapObject.onEnterInner = function () {
  // no-op
}

export default MapObject
