/**
 * Racing Map Object - ObjectRacingScript.ls (ParentScript 1990)
 *
 * Lingo-faithful port van CDdata race object.
 * Volledige state machine: mission gate → init → race start → lap counting → finish → medal/hiscore → blink
 *
 * Originele properties:
 *   child, counter, insideInner, hiscores, saveName, FieldName, racing,
 *   delayCounter, fps, mustEnterFrom, nrOfTimesPassed, enteredFrom,
 *   thisTime, nrOfLetters, displaying
 *
 * @module objects/mapobjects/Racing
 */
'use strict'

var MapObject = {}

/**
 * onCreate → Lingo `new me, theChild` (lines 4-8)
 */
MapObject.onCreate = function () {
  this.insideInner = 0
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
 * init → Lingo `init me` (lines 15-73)
 *
 * Mission gate → state setup → hiscores → sprites → showTime
 */
MapObject.init = function () {
  // Lines 16-20: Mission gate
  var missions = this.def.SetWhenDone && this.def.SetWhenDone.missions
  var tmpMission = missions ? missions[0] : null

  var user = this.game.mulle.user
  if (tmpMission != null) {
    var completed = user.isMissionCompleted(tmpMission)
    var given = user.isMissionGiven(tmpMission)
    if (!completed && !given) {
      this.displaying = 0
      return
    }
  }

  // Line 21
  this.displaying = 1

  // Lines 22-30: basic state
  this.nrOfLetters = 6
  this.racing = 0
  this.delayCounter = 0
  this.fps = this.game.mulle.frameTempo || 15
  this.nrOfTimesPassed = 0

  // Lines 27-30: mustEnterFrom
  var enterDir = this.optionalData ? this.optionalData.EnterDir : undefined
  this.mustEnterFrom = (enterDir != null) ? enterDir : 1

  // Lines 31-32
  this.saveName = 'CustomRacingDB'
  this.FieldName = 'CustomRacingField'

  // Lines 33-57: hiscores (we always create defaults if not existing)
  // In Lingo this persists to a cast member; we use a simple array
  if (!this.hiscores) {
    this.hiscores = [
      { time: 186, name: 'PIA P' },
      { time: 232, name: 'STAF S' }
    ]
  }
  // Line 58: sort ascending by time
  this.hiscores.sort(function (a, b) { return a.time - b.time })

  // Lines 59-67: sprite setup
  var tempSp = this.SPUnder || 0

  // Board sprite at tempSp
  var boardFrames = this.def.FrameList && this.def.FrameList.Board
  if (boardFrames && boardFrames.length > 0) {
    this.setSpriteMember(tempSp, boardFrames[0])
  }

  var boardLoc = this.optionalData ? this.optionalData.Board : null
  if (!boardLoc) {
    boardLoc = { x: 0, y: 0 }
  }
  this.setSpriteLoc(tempSp, boardLoc)

  // Goal sprite at tempSp+1
  var goalFrames = this.def.FrameList && this.def.FrameList.Goal
  if (goalFrames && goalFrames.length > 0) {
    this.setSpriteMember(tempSp + 1, goalFrames[0])
  }
  this.setSpriteLoc(tempSp + 1, this.myLoc)

  // Line 68: showTime
  MapObject.showTime.call(this)

  // Lines 69-72: field sprites at tempSp+2 and tempSp+3
  for (var N = 1; N <= 2; N++) {
    this.setSpriteMember(tempSp + N + 1, this.FieldName + N)
    this.setSpriteLoc(tempSp + N + 1, {
      x: boardLoc.x + (-75) + 0 * (N - 1),
      y: boardLoc.y + (-25) + 30 * (N - 1)
    })
  }
}

/**
 * showTime → Lingo `showTime me` (lines 107-112)
 *
 * Displays top 2 hiscores in field members.
 */
MapObject.showTime = function () {
  for (var N = 0; N < 2; N++) {
    var entry = this.hiscores[N]
    if (!entry) continue

    // Lingo: string(time / 10) & ":" & string(time mod 10) & "0"
    var seconds = Math.floor(entry.time / 10)
    var tenths = entry.time % 10
    var tempTime = seconds + ':' + tenths + '0'

    // Lingo: char 1 to nrOfLetters of name
    var name = entry.name.substring(0, this.nrOfLetters)

    this.setFieldText(this.FieldName + (N + 1), tempTime + ' ' + name)
  }
}

/**
 * step → Lingo `step me, carLoc` (lines 75-105)
 */
MapObject.step = function (carLoc) {
  // Line 76: guard
  if (!this.displaying) return

  // Lines 79-86: radius check with #Inner only
  if (this.state && this.state.drivingHandlers) {
    var temp = this.state.drivingHandlers.checkRadius(this, carLoc, this.myLoc, 'Inner')
    if (temp === 'EnterInnerRadius') {
      MapObject.onEnterInner.call(this, carLoc)
    } else if (temp === 'ExitInnerRadius') {
      MapObject.onExitInner.call(this, carLoc)
    }
  }

  // Lines 87-104: timer display
  if (this.racing) {
    // Line 88
    this.counter = this.counter + 1

    // Line 89: Lingo integer division for timer
    // string(counter / fps) & ":" & string(10 * (counter mod fps) / fps) & "0"
    var secs = Math.floor(this.counter / this.fps)
    var frac = Math.floor(10 * (this.counter % this.fps) / this.fps)
    this.setFieldText(this.FieldName + '1', secs + ':' + frac + '0')
  } else if (this.delayCounter) {
    // Lines 91-103: blink mode
    this.delayCounter = this.delayCounter - 1

    if ((this.delayCounter % 6) === 5) {
      this.setFieldText(this.FieldName + '1', this.thisTime)
    } else if ((this.delayCounter % 6) === 0) {
      this.setFieldText(this.FieldName + '1', ' ')
    }

    if (this.delayCounter === 0) {
      MapObject.showTime.call(this)
    }
  }
}

/**
 * Helper: calculate direction diff with 16-wrap
 */
function dirDiff (mustEnterFrom, calcDir) {
  var diff = Math.abs(mustEnterFrom - calcDir)
  if (diff > 8) diff = 16 - diff
  return diff
}

/**
 * onEnterInner → Lingo `EnterInnerRadius me, carLoc` (lines 120-167)
 */
MapObject.onEnterInner = function (carLoc) {
  var user = this.game.mulle.user
  var missions = this.def.SetWhenDone && this.def.SetWhenDone.missions

  // Lines 121-123: complete mission on first entry
  if (missions && missions.length > 0) {
    if (!user.isMissionCompleted(missions[0])) {
      user.addCompletedMission(missions[0])
    }
  }

  // Lines 124-128: direction check
  var tempEnterAngl = this.state.drivingHandlers.calcDirection(carLoc, this.myLoc)
  var tempDiff = dirDiff(this.mustEnterFrom, tempEnterAngl)

  if (tempDiff <= 3) {
    // Correct direction
    this.enteredFrom = 1

    if (this.racing) {
      if (this.nrOfTimesPassed === 1) {
        // Lines 133-152: FINISH RACE
        this.racing = 0
        this.delayCounter = 60

        // Line 135: tempTime in tenths of seconds (Lingo integer division)
        var tempTime = Math.floor(10 * this.counter / this.fps)

        // Lines 136-139: user name
        var tempName = user.getUserName ? user.getUserName() : ''
        if (tempName == null) tempName = ''

        // Line 140: format thisTime
        var timeSecs = Math.floor(tempTime / 10)
        var timeTenths = tempTime % 10
        var nameStr = tempName.substring(0, this.nrOfLetters)
        this.thisTime = timeSecs + ':' + timeTenths + '0 ' + nameStr

        // Lines 141-147: medal or sound
        if (tempTime < 150) {
          var medalId = (this.def.SetWhenDone && this.def.SetWhenDone.medals)
            ? this.def.SetWhenDone.medals[0]
            : null
          var medalSound = this.def.Sounds ? this.def.Sounds[2] : null
          if (this.game.mulle.createMedal) {
            this.game.mulle.createMedal(medalId, medalSound)
          }
        } else {
          // Play finish sound (sounds[1], Lingo 1-indexed: sounds[2])
          var finishSound = this.def.Sounds ? this.def.Sounds[1] : null
          if (finishSound) {
            if (this.game.mulle.sound && this.game.mulle.sound.play) {
              this.game.mulle.sound.play(finishSound, 'EFFECT')
            } else if (this.game.mulle.playAudio) {
              this.game.mulle.playAudio(finishSound)
            }
          }
        }

        // Lines 148-152: hiscore update
        var lastIdx = this.hiscores.length - 1
        if (lastIdx >= 0 && this.hiscores[lastIdx].time >= tempTime) {
          // Remove worst score
          this.hiscores.splice(lastIdx, 1)
          // Add new score
          this.hiscores.push({ time: tempTime, name: nameStr })
          // Sort ascending
          this.hiscores.sort(function (a, b) { return a.time - b.time })
        }
      }
      // If nrOfTimesPassed != 1, do nothing (race continues)
    } else {
      // Lines 154-162: START RACE
      var startSound = this.def.Sounds ? this.def.Sounds[0] : null
      if (startSound) {
        if (this.game.mulle.sound && this.game.mulle.sound.play) {
          this.game.mulle.sound.play(startSound, 'EFFECT')
        } else if (this.game.mulle.playAudio) {
          this.game.mulle.playAudio(startSound)
        }
      }

      this.nrOfTimesPassed = 0
      this.racing = 1
      this.counter = 0

      // Lines 160-162: clear field texts
      this.setFieldText(this.FieldName + '1', ' ')
      this.setFieldText(this.FieldName + '2', ' ')
    }
  } else {
    // Line 165: wrong direction
    this.enteredFrom = -1
  }
}

/**
 * onExitInner → Lingo `ExitInnerRadius me, carLoc` (lines 169-186)
 */
MapObject.onExitInner = function (carLoc) {
  // Line 170: guard
  if (!this.racing) return

  // Lines 171-175: direction check
  var tempEnterAngl = this.state.drivingHandlers.calcDirection(carLoc, this.myLoc)
  var tempDiff = dirDiff(this.mustEnterFrom, tempEnterAngl)

  if (tempDiff <= 3) {
    // Same direction as mustEnterFrom
    if (this.enteredFrom === -1) {
      // Line 178
      this.nrOfTimesPassed = this.nrOfTimesPassed - 1
    }
  } else {
    // Different direction
    if (this.enteredFrom === 1) {
      // Line 182
      this.nrOfTimesPassed = this.nrOfTimesPassed + 1
    }
  }
}

/**
 * onEnterOuter → Lingo `enterOuterRadius me` (line 114-115)
 * Empty no-op.
 */
MapObject.onEnterOuter = function () {
}

/**
 * onExitOuter → Lingo `ExitOuterRadius me` (line 117-118)
 * Empty no-op.
 */
MapObject.onExitOuter = function () {
}

export default MapObject
