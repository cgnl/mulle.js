/**
 * Bridge Map Object - ObjectBridgeScript.ls (ParentScript 1998)
 *
 * Lingo-faithful port van CDdata brug object.
 * Complex bridge with custom multi-checkpoint radius check (NOT checkRadius!),
 * animation frame cycling, and sail-based blocking behavior.
 *
 * When a boat with a sail enters the inner radius of any checkpoint,
 * the bridge blocks passage: forces the boat back to enterLoc and stops it.
 *
 * Originele properties:
 *   child, insideInner, insideOuter, gotSail, frameList, listLen, counter,
 *   SP, checkPoints, lastCommentCounter, enterLoc
 *
 * @module objects/mapobjects/Bridge
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-7) + `init me` (lines 14-27)
 *
 * new: sets child, insideInner=0, insideOuter=0
 * init: checks sail, loads frameList, checkPoints, SP, starts animation
 */
MapObject.onCreate = function () {
  // ── new (lines 4-7) ──
  this.insideInner = 0
  this.insideOuter = 0

  // ── init ──
  // Line: check boat quickProps.SailWithPole → gotSail 0/1
  var boat = this.state && this.state.driveBoat
  var tmp = boat ? boat.quickProps : null
  if (tmp && typeof tmp === 'object' && tmp.SailWithPole) {
    this.gotSail = 0
  } else {
    this.gotSail = 1
  }

  // Lines: read optionalData.frameList, fallback to FrameList.normal
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

  // Lines: read optionalData.checkPoints, default to [myLoc]
  var checkPoints = null
  if (this.optionalData && typeof this.optionalData === 'object') {
    checkPoints = this.optionalData.checkPoints || null
  }
  if (!checkPoints || !Array.isArray(checkPoints) || checkPoints.length === 0) {
    checkPoints = [this.myLoc || { x: this.x, y: this.y }]
  }
  this.checkPoints = checkPoints

  // Lines: SP = SPOver, fallback to SPUnder
  this.SP = this.SPOver
  if (!(this.SP > 0)) {
    this.SP = this.SPUnder || 0
  }

  // Line: set sprite loc to myLoc
  if (typeof this.setSpriteLoc === 'function') {
    this.setSpriteLoc(this.SP, this.myLoc)
  } else if (typeof this.setSpriteLocation === 'function') {
    this.setSpriteLocation(this.SP, this.myLoc)
  }

  // Lines: listLen = count(frameList), counter = 0 (JS 0-indexed), lastCommentCounter = 0
  this.listLen = this.frameList.length
  this.counter = 0
  this.lastCommentCounter = 0
  this.enterLoc = null
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
 * step → Lingo `step me, carLoc` (lines 29-65)
 *
 * Custom multi-checkpoint radius check (NOT checkRadius!):
 * For each checkpoint: compute distance sqrt(dx^2+dy^2)
 * If distance < InnerRadius: tmpInsideOne=1, if insideInner was 0 → enter
 *
 * If insideInner AND gotSail: force boat to enterLoc, speed=0
 * Decrement lastCommentCounter if >0
 * Animation: set sprite to frameList[counter], counter++, wrap
 */
MapObject.step = function (carLoc) {
  // ── Custom multi-checkpoint radius check ──
  if (carLoc && this.checkPoints && this.InnerRadius) {
    var tmpInsideOne = 0
    for (var i = 0; i < this.checkPoints.length; i++) {
      var cp = this.checkPoints[i]
      var dx = carLoc.x - cp.x
      var dy = carLoc.y - cp.y
      var dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < this.InnerRadius) {
        tmpInsideOne = 1
        if (!this.insideInner) {
          // Just entered inner radius
          this.insideInner = 1
          MapObject.onEnterInner.call(this)
        }
        break
      }
    }
    if (!tmpInsideOne) {
      this.insideInner = 0
    }
  }

  // ── If insideInner AND gotSail: force boat to enterLoc, speed=0 ──
  if (this.insideInner && this.gotSail) {
    var boat = this.state && this.state.driveBoat
    if (boat) {
      if (this.enterLoc && boat.loc) {
        boat.loc.x = this.enterLoc.x
        boat.loc.y = this.enterLoc.y
      }
      boat.speed = 0
    }
  }

  // ── Decrement lastCommentCounter if >0 ──
  if (this.lastCommentCounter > 0) {
    this.lastCommentCounter = this.lastCommentCounter - 1
  }

  // ── Animation: set sprite to frameList[counter], counter++, wrap ──
  if (this.frameList && this.frameList.length > 0) {
    this.setDirectorMember(this.frameList[this.counter])
  }

  this.counter = this.counter + 1
  if (this.counter >= this.listLen) {
    this.counter = 0
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 67-80)
 *
 * If gotSail: if lastCommentCounter=0 → say(sounds[0], 2)
 *             stepback(2) → enterLoc, speed=0, lastCommentCounter=100
 * Else: empty (no sail = free passage)
 */
MapObject.onEnterInner = function () {
  if (this.gotSail) {
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
