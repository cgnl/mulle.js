/**
 * RandomAnim Map Object - ObjectRandomAnimScript.ls (ParentScript)
 *
 * Lingo-faithful port van CDdata random animation object.
 * State machine: WAITING (counter=0, waitCounter>0) → ANIMATING (counter>=1) → WAITING
 * No radius checks, no insideInner/insideOuter. Pure decorative animation
 * with random wait intervals between animation cycles.
 *
 * Originele properties:
 *   child, frameList, listLen, counter, rateCounter, waitCounter, waitTime, rate, SP
 *
 * @module objects/mapobjects/RandomAnim
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-6) + `init me` (lines 13-33)
 *
 * new: sets child
 * init: loads frameList, waitTime, rate, SP, positions sprite, starts WAITING state
 */
MapObject.onCreate = function () {
  // ── init (lines 14-16): frameList source ──
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

  // ── init (line 17): Wait → waitTime (default 400) ──
  var waitTime = 400
  if (this.optionalData && typeof this.optionalData === 'object') {
    if (typeof this.optionalData.Wait === 'number') {
      waitTime = this.optionalData.Wait
    }
  }
  this.waitTime = waitTime

  // ── init (line 18): rate (default 1) ──
  var rate = 1
  if (this.optionalData && typeof this.optionalData === 'object') {
    if (typeof this.optionalData.rate === 'number') {
      rate = this.optionalData.rate
    }
  }
  this.rate = rate

  // ── init (lines 19-21): SP preference ──
  // Lingo: SP = the SPOver of child; if not (SP > 0) then SP = the SPUnder of child
  this.SP = this.SPOver
  if (!(this.SP > 0)) {
    this.SP = this.SPUnder || 0
  }

  // ── init (line 22): sprite loc ──
  if (typeof this.setSpriteLoc === 'function') {
    this.setSpriteLoc(this.SP, this.myLoc)
  } else if (typeof this.setSpriteLocation === 'function') {
    this.setSpriteLocation(this.SP, this.myLoc)
  }

  // ── init (lines 23-24): listLen and counter ──
  this.listLen = this.frameList.length
  this.counter = 0 // 0 = idle/waiting state; 1..listLen = animating (Lingo 1-indexed)

  // ── init (line 25): rateCounter ──
  this.rateCounter = 0

  // ── init (line 26): waitCounter = waitTime + random(waitTime) ──
  // Lingo random(n) returns 1..n, so total = waitTime + (1..waitTime) = waitTime+1..2*waitTime
  this.waitCounter = this.waitTime + Math.floor(Math.random() * this.waitTime) + 1
}

/**
 * onDestroy → Lingo `kill me` (lines 8-11)
 * Kill contract: child=0, return 0
 */
MapObject.onDestroy = function () {
  this.child = 0
  return 0
}

/**
 * step → Lingo `step me, carLoc` (lines 35-56)
 *
 * State machine:
 * - WAITING: waitCounter > 0 → decrement, exit
 * - ANIMATING: increment rateCounter, if rateCounter = rate → advance frame
 *   - If counter > listLen: reset to WAITING, set sprite to "Dummy"
 *   - Else: set sprite to frameList[counter] (Lingo 1-indexed)
 */
MapObject.step = function () {
  // ── WAITING state: decrement waitCounter, exit ──
  if (this.waitCounter > 0) {
    this.waitCounter = this.waitCounter - 1
    return
  }

  // ── ANIMATING state ──
  this.rateCounter = this.rateCounter + 1

  if (this.rateCounter === this.rate) {
    this.rateCounter = 0

    // Advance frame counter (Lingo 1-indexed)
    this.counter = this.counter + 1

    if (this.counter > this.listLen) {
      // Animation cycle complete → back to WAITING
      this.waitCounter = this.waitTime + Math.floor(Math.random() * this.waitTime) + 1
      this.counter = 0
      this.setDirectorMember('Dummy')
    } else {
      // Display current frame (Lingo 1-indexed → JS 0-indexed: counter-1)
      this.setDirectorMember(this.frameList[this.counter - 1])
    }
  }
}

export default MapObject
