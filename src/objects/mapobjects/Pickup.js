/**
 * Pickup Map Object - ObjectPickupScript.ls (ParentScript 1956)
 *
 * Lingo-faithful port van CDdata pickup objecten (Bible, Swimring, DoctorBag).
 * Alle handlers volgen exact de originele Lingo flow:
 *   new → init → step (per frame) → EnterInnerRadius → mulleFinished
 *
 * Originele properties:
 *   child, insideInner, insideOuter, SP, mode, Showing, listLen,
 *   allFrameLists, counter, setWhat, frameList, sndId, bobList
 *
 * @module objects/mapobjects/Pickup
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` + `init me`
 *
 * new (lines 4-9): sets child, insideInner=0, insideOuter=0
 * init (lines 16-43): level-gate Showing, bobList, frameList, sprite, counter=0
 */
MapObject.onCreate = function () {
  // ── new (lines 5-8) ──
  // child is already set by the map-object system
  this.insideInner = 0
  this.insideOuter = 0

  // ── init (line 18) ──
  this.Showing = 1

  // Level requirement check (lines 19-32)
  // First try optionalData.level, then fall back to def.CheckFor.Level
  var tmpReqLevel = null

  if (this.optionalData && typeof this.optionalData === 'object') {
    tmpReqLevel = this.optionalData.level || null
  }

  if (tmpReqLevel == null && this.def && this.def.CheckFor) {
    tmpReqLevel = this.def.CheckFor.Level || null
  }

  // If level list exists, check if current level is in it (lines 29-32)
  if (Array.isArray(tmpReqLevel)) {
    var currentLevel = this.game.mulle.levelHandler.getLevel()
    if (tmpReqLevel.indexOf(currentLevel) === -1) {
      this.Showing = 0
    }
  }

  // If Showing, set up visuals (lines 33-41)
  if (this.Showing) {
    this.bobList = [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0]

    // frameList from FrameList.normal (line 35)
    this.frameList = (this.def.FrameList && this.def.FrameList.normal)
      ? this.def.FrameList.normal
      : []

    this.listLen = this.frameList.length

    // SP from SPUnder (line 37)
    this.SP = this.SPUnder || this.SP || 0

    // Set sprite to first frame (line 38)
    if (this.frameList.length > 0) {
      this.setDirectorMember(this.frameList[0])
    }

    // Set sprite loc to myLoc (line 39) — handled by map-object system
  }

  // Always reset counter (line 42)
  this.counter = 0
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
 * step → Lingo `step me, carLoc` (lines 45-57)
 *
 * - Guard: exit if not Showing
 * - Increment counter
 * - Apply bobbing Y offset from bobList
 * - Check radius; on EnterInnerRadius → trigger pickup
 */
MapObject.step = function (carLoc) {
  // Line 46-47: guard
  if (!this.Showing) {
    return
  }

  // Line 48-49: sndId check (no-op in Lingo, just "if sndId then end if")

  // Line 51: increment counter
  this.counter = this.counter + 1

  // Line 52: bobbing offset
  // Lingo: point(0, getAt(bobList, (counter mod count(bobList)) + 1))
  // Lingo is 1-indexed, JS is 0-indexed
  var bobIndex = this.counter % this.bobList.length
  var bobOffset = this.bobList[bobIndex]

  // Set sprite loc with bob offset
  if (this.setSpriteLoc) {
    this.setSpriteLoc(this.SP, {
      x: this.myLoc.x,
      y: this.myLoc.y + bobOffset
    })
  }

  // Line 53: checkRadius with #both
  if (this.state && this.state.drivingHandlers && this.state.drivingHandlers.checkRadius) {
    var temp = this.state.drivingHandlers.checkRadius(this, carLoc, this.myLoc, 'both')

    // Line 54-56: EnterInnerRadius trigger
    if (temp === 'EnterInnerRadius') {
      MapObject.onEnterInner.call(this)
    }
  }
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me` (lines 59-85)
 *
 * 1. Showing=0, hide sprite (Dummy)
 * 2. SetWhenDone → Inventory loop → setInInventory
 * 3. Play sound via say(mulleTalkObject)
 * 4. If sound plays: stop boat, stop motor, pause, show TRANS sprite
 */
MapObject.onEnterInner = function () {
  // Line 60
  this.Showing = 0

  // Line 61: hide sprite
  this.setDirectorMember('Dummy')

  // Lines 62-69: SetWhenDone → Inventory
  var setWhenDone = this.def.SetWhenDone
  if (setWhenDone && typeof setWhenDone === 'object') {
    var inventory = setWhenDone.Inventory
    if (Array.isArray(inventory)) {
      for (var i = 0; i < inventory.length; i++) {
        // Lingo: setInInventory(the user of gMulleGlobals, tmpStuff, [:])
        if (this.game.mulle.user.setInInventory) {
          this.game.mulle.user.setInInventory(inventory[i], {})
        } else if (this.game.mulle.seaInventory && this.game.mulle.seaInventory.addItem) {
          this.game.mulle.seaInventory.addItem(inventory[i])
        }
      }
    }
  }

  // Lines 71-84: sound + boat stop + pause + TRANS
  var sounds = this.def.Sounds || this.sounds || []
  if (sounds.length > 0) {
    // Line 72: say(mulleTalkObject, sounds[0], 2, me, #Q)
    // Lingo 1-indexed: getAt(sounds, 1) = first sound
    this.sndId = this.game.mulle.playAudio(sounds[0])

    if (this.sndId) {
      // Line 74: stop boat
      this.state.driveBoat.speed = 0
      // Line 75: stopMotor
      this.state.driveBoat.stopMotor()
      // Line 76: pause(gDir, 1)
      this.game.pause(1)

      // Lines 77-82: TRANS sprite
      var tmpPic = this.def.FrameList ? this.def.FrameList.TRANS : null
      if (typeof tmpPic === 'string') {
        var tmpSP = this.state.spriteList ? this.state.spriteList.TRANS : 75
        this.setSpriteMember(tmpSP, tmpPic)
        this.setSpriteLoc(tmpSP, { x: 320, y: 200 })
      }
    }
  }
}

/**
 * setFrames → Lingo `setFrames me, theMode` (lines 87-93)
 *
 * Switches animation mode (normal, TRANS, etc.)
 */
MapObject.setFrames = function (theMode) {
  this.mode = theMode
  this.frameList = this.def.FrameList[theMode]
  this.listLen = this.frameList.length
  this.setDirectorMember(this.frameList[0])
  this.counter = 1
}

/**
 * mulleFinished → Lingo `mulleFinished me` (lines 95-98)
 *
 * Called when Mulle finishes speaking. Unpauses and clears TRANS sprite.
 */
MapObject.mulleFinished = function () {
  // Line 96: pause(gDir, 0)
  this.game.pause(0)
  // Line 97: set the member of sprite 75 to member "Dummy"
  this.setSpriteMember(75, 'Dummy')
}

export default MapObject
