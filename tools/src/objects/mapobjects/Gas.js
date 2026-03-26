/**
 * Gas Map Object - ObjectGasScript.ls (ParentScript 2012)
 *
 * Lingo-faithful port van CDdata tankstation object.
 * State machine: idle (sndId=0) → refueling (sndId truthy) → idle
 *
 * Originele properties:
 *   child, counter, insideInner, insideOuter, sndId, OKToEnter, alreadyTold
 *
 * @module objects/mapobjects/Gas
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-10) + `init me` (lines 17-31)
 */
MapObject.onCreate = function () {
  // ── new (lines 5-9) ──
  this.insideInner = 0
  this.insideOuter = 0
  this.alreadyTold = 0

  // ── init ──
  MapObject.init.call(this)
}

/**
 * init → Lingo `init me` (lines 17-31)
 *
 * - sndId = 0
 * - OKToEnter based on boat quickProps.fuelConsumption
 * - Optional show sprite from optionalData.show
 */
MapObject.init = function () {
  // Line 18
  this.sndId = 0

  // Lines 19-30: OKToEnter check
  var tmp = this.state && this.state.driveBoat ? this.state.driveBoat.quickProps : null
  if (tmp && typeof tmp === 'object') {
    tmp = tmp.fuelConsumption
  } else {
    tmp = null
  }

  if (typeof tmp === 'number' && Number.isInteger(tmp)) {
    if (tmp > 0) {
      this.OKToEnter = 1
    } else {
      this.OKToEnter = 0
    }
  } else {
    this.OKToEnter = 0
  }

  // Lines 24-30: optional display sprite
  var optData = this.optionalData
  if (optData && typeof optData === 'object') {
    var show = optData.show
    if (typeof show === 'string') {
      this.setDirectorMember(show)
      // Lingo: set the loc of sprite (the SPUnder of child) to the myLoc of child
      // Handled by map-object system
    }
  }
}

/**
 * onDestroy → Lingo `kill me` (lines 12-15)
 * Kill contract: child=0, return 0
 */
MapObject.onDestroy = function () {
  this.child = 0
  return 0
}

/**
 * step → Lingo `step me, carLoc` (lines 33-49)
 *
 * State machine:
 * - sndId truthy: check if sound finished → clear sndId, programControl(0) → EXIT
 * - sndId falsy: checkRadius with #both, dispatch handlers
 */
MapObject.step = function (carLoc) {
  // Lines 34-38: refueling state (sndId active)
  if (this.sndId) {
    if (this.game.mulle.sound.finished(this.sndId)) {
      this.sndId = 0
      this.state.driveBoat.programControl(0)
    }
    // Line 38: exit (skip radius check whether finished or not)
    return
  }

  // Lines 39-48: idle state, check radius
  if (!this.state || !this.state.drivingHandlers) return

  var temp = this.state.drivingHandlers.checkRadius(this, carLoc, this.myLoc, 'both')

  // Lines 40-41
  if (temp === 'EnterInnerRadius' || temp === 'EnterBoth') {
    MapObject.onEnterInner.call(this)
  }
  // Lines 42-43
  if (temp === 'enterOuterRadius') {
    MapObject.onEnterOuter.call(this)
  }
}

/**
 * onEnterOuter → Lingo `enterOuterRadius me` (lines 51-60)
 *
 * Plays random comment sound (once per map visit via alreadyTold guard).
 * Picks from sounds[1..n] (Lingo: sounds[random(count-1)+1])
 */
MapObject.onEnterOuter = function () {
  // Line 52: guard
  if (this.alreadyTold) return

  // Line 53
  this.alreadyTold = 1

  // Lines 54-59: pick random comment sound
  var sounds = this.def.Sounds || this.sounds || []
  var tmpCnt = sounds.length - 1 // Lingo: count(sounds) - 1

  if (tmpCnt > 0) {
    // Lingo: random(tmpCnt) + 1 → picks from index 2..end (1-indexed)
    // JS: Math.floor(Math.random() * tmpCnt) + 1 → picks from index 1..end (0-indexed)
    var idx = Math.floor(Math.random() * tmpCnt) + 1
    var tmpSnd = sounds[idx]

    // Lingo: say(the mulleTalkObject of gDir, tmpSnd, 3)
    if (this.state && this.state.mulleTalkObject && this.state.mulleTalkObject.say) {
      this.state.mulleTalkObject.say(tmpSnd, 3)
    } else if (this.game.mulle.playAudio) {
      this.game.mulle.playAudio(tmpSnd)
    }
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 62-72)
 *
 * Refueling sequence:
 * 1. Guard: OKToEnter
 * 2. Play pump sound → sndId
 * 3. programControl(boat, 1) if sound started
 * 4. Stop boat speed + motor
 * 5. fillErUp(boat)
 */
MapObject.onEnterInner = function () {
  // Line 63: guard
  if (!this.OKToEnter) return

  // Line 64: play pump sound (first sound, Lingo 1-indexed)
  var sounds = this.def.Sounds || this.sounds || []
  if (sounds.length > 0) {
    this.sndId = this.game.mulle.playAudio(sounds[0])
  }

  // Lines 65-66: programControl(boat, 1) if sound started
  if (this.sndId) {
    this.state.driveBoat.programControl(1)
  }

  // Line 68: stop boat speed
  this.state.driveBoat.speed = 0

  // Line 69: stop motor
  this.state.driveBoat.stopMotor()

  // Line 70: fill fuel tank
  this.state.driveBoat.fillErUp()
}

/**
 * onExitInner → Lingo `ExitInnerRadius me` (line 74-75)
 * Empty no-op.
 */
MapObject.onExitInner = function () {
}

export default MapObject
