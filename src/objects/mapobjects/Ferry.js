'use strict'

var MapObject = {}

function calcDirection16 (from, to) {
  const dx = (to.x || 0) - (from.x || 0)
  const dy = (to.y || 0) - (from.y || 0)
  const angle = Math.atan2(dy, dx)
  const norm = ((angle + (2 * Math.PI)) % (2 * Math.PI))
  const dir = Math.round((norm / (2 * Math.PI)) * 16)
  return ((dir + 3) % 16) + 1
}

function calcDirectionForCtx (ctx, from, to) {
  const handlers = ctx && ctx.state ? ctx.state.drivingHandlers : null
  if (handlers && typeof handlers.calcDirection === 'function') {
    return handlers.calcDirection([from.x, from.y], [to.x, to.y])
  }
  return calcDirection16(from, to)
}

function isSoundFinished (ctx, sndId) {
  const sound = ctx && ctx.game && ctx.game.mulle ? ctx.game.mulle.sound : null
  if (sound && typeof sound.finished === 'function') {
    return !!sound.finished(sndId)
  }

  if (sndId && sndId.isPlaying === false) {
    return true
  }

  return false
}

MapObject.onCreate = function () {
  if (this.def && this.def.FrameList && this.def.FrameList.normal && this.def.FrameList.normal[0]) {
    this.setDirectorMember(this.def.FrameList.normal[0])
  }

  this.insideInner = false
  this.carOnBoard = 0
  this.carCounter = 0
  this.carLeaving = 0
  this.waitCounter = 0
  this.decimalPrec = 100
  this.counter = 0
  this.sndId = 0
  this._deniedSoundPlaying = false

  const endLocOpt = (this.optionalData && (this.optionalData.EndLoc || this.optionalData.endLoc)) || { x: 0, y: 0 }
  this.endLocs = [
    { x: this.x, y: this.y },
    { x: endLocOpt.x || 0, y: endLocOpt.y || 0 }
  ]

  this.myLoc = {
    x: this.endLocs[0].x * this.decimalPrec,
    y: this.endLocs[0].y * this.decimalPrec
  }

  const tempSpeed = 5
  const diff = {
    x: this.endLocs[1].x - this.endLocs[0].x,
    y: this.endLocs[1].y - this.endLocs[0].y
  }
  const hypo = Math.sqrt((diff.x * diff.x) + (diff.y * diff.y))
  const fact = hypo > 0 ? (hypo / tempSpeed) : 1

  this.stepVec = {
    x: Math.trunc(this.decimalPrec * diff.x / fact),
    y: Math.trunc(this.decimalPrec * diff.y / fact)
  }

  this.maxCounter = Math.max(1, Math.trunc(fact))
  this.counter = Math.max(1, Math.min(this.maxCounter - 1, Math.trunc(Math.random() * this.maxCounter)))
  this.Back = Math.random() < 0.5 ? -1 : 1

  this.myLoc.x += this.counter * this.stepVec.x
  this.myLoc.y += this.counter * this.stepVec.y
  this.position.x = this.myLoc.x / this.decimalPrec
  this.position.y = this.myLoc.y / this.decimalPrec

  if (this.Back === 1) {
    this.atStart = -1
    this.endLoc = this.endLocs[1]
  } else {
    this.atStart = 1
    this.endLoc = this.endLocs[0]
  }
  this.myDirections = [
    calcDirectionForCtx(this, this.endLocs[0], this.endLocs[1]),
    calcDirectionForCtx(this, this.endLocs[1], this.endLocs[0])
  ]

  this.active = true
  const needs = this.def && this.def.CheckFor ? this.def.CheckFor : null
  const userStuff = needs && needs.UserStuff
  if (Array.isArray(userStuff) && userStuff.length > 0 && this.game && this.game.mulle && this.game.mulle.user && typeof this.game.mulle.user.getUserProp === 'function') {
    const propVal = this.game.mulle.user.getUserProp(userStuff[0])
    if (propVal === '#NoProp' || propVal === 'NoProp') {
      this.active = false
    }
  }

  this.carWasntOnBoard = 1
}

MapObject.step = function (carLoc) {
  const loc = carLoc || (this.state && this.state.driveBoat && this.state.driveBoat.position)

  if (this.counter > this.maxCounter) {
    this.counter = this.maxCounter
    this.waitCounter = 15
    this.Back = -1
    if (this.carOnBoard) {
      MapObject.carBoardInit.call(this, 1)
    } else if (loc && MapObject.carClose.call(this, loc)) {
      MapObject.carBoardInit.call(this, -1)
    }
  } else if (this.counter < 0) {
    this.counter = 0
    this.waitCounter = 15
    this.Back = 1
    if (this.carOnBoard) {
      MapObject.carBoardInit.call(this, 1)
    } else if (loc && MapObject.carClose.call(this, loc)) {
      MapObject.carBoardInit.call(this, -1)
    }
  } else if (this.counter === (this.maxCounter / 2)) {
    if (this.Back === 1) {
      this.endLoc = this.endLocs[1]
      this.atStart = -1
    } else {
      this.endLoc = this.endLocs[0]
      this.atStart = 1
    }
  }

  if (this.waitCounter) {
    this.waitCounter -= 1
    if (this.carOnBoard) {
      MapObject.carBoarding.call(this)
    } else if (this.carWasntOnBoard && loc && MapObject.carClose.call(this, loc)) {
      MapObject.carBoardInit.call(this, -1)
      this.waitCounter = 15
    }

    if (this.waitCounter === 0 && !this.carOnBoard) {
      this.carWasntOnBoard = 1
    }
  } else {
    this.counter += this.Back
    this.myLoc.x += this.stepVec.x * this.Back
    this.myLoc.y += this.stepVec.y * this.Back
    this.position.x = this.myLoc.x / this.decimalPrec
    this.position.y = this.myLoc.y / this.decimalPrec

    if (this.carOnBoard) {
      const boat = this.state && this.state.driveBoat
      if (boat && boat.position) {
        boat.position.x = this.position.x
        boat.position.y = this.position.y
      }
    }
  }
}

MapObject.carClose = function (carLoc) {
  const ferryLoc = {
    x: this.myLoc.x / this.decimalPrec,
    y: this.myLoc.y / this.decimalPrec
  }
  const dx = (carLoc.x || 0) - ferryLoc.x
  const dy = (carLoc.y || 0) - ferryLoc.y
  const hypo = Math.sqrt((dx * dx) + (dy * dy))

  if (this.active) {
    return hypo < this.InnerRadius ? 1 : 0
  }

  if (this._deniedSoundPlaying && this.sndId && isSoundFinished(this, this.sndId)) {
    this._deniedSoundPlaying = false
  }

  if (hypo < this.InnerRadius && !this._deniedSoundPlaying) {
    const snd = this.def && this.def.Sounds ? this.def.Sounds[0] : null
    if (snd && this.game && this.game.mulle && this.game.mulle.playAudio) {
      this.sndId = this.game.mulle.playAudio(snd)
      this._deniedSoundPlaying = true
    }
  }
  return 0
}

MapObject.carBoardInit = function (theLeave) {
  if (!this.active) return
  const boat = this.state && this.state.driveBoat
  if (!boat || !boat.position) return

  this.carLeaving = theLeave
  this.carOrgLoc = { x: boat.position.x, y: boat.position.y }

  if (this.carLeaving === -1) {
    this.carWasntOnBoard = 0
    this.carOnBoard = 1
    boat.direction = calcDirectionForCtx(this, this.carOrgLoc, this.endLoc)
    this.carStep = {
      x: ((this.endLoc.x - this.carOrgLoc.x) * this.decimalPrec) / 10,
      y: ((this.endLoc.y - this.carOrgLoc.y) * this.decimalPrec) / 10
    }
  } else {
    this.carStep = {
      x: -this.stepVec.x / 2 * this.atStart,
      y: -this.stepVec.y / 2 * this.atStart
    }
  }
}

MapObject.carBoarding = function () {
  if (!this.carLeaving) return
  const boat = this.state && this.state.driveBoat
  if (!boat || !boat.position) return

  this.carCounter += 1
  boat.position.x = this.carOrgLoc.x + (this.carStep.x * this.carCounter / this.decimalPrec)
  boat.position.y = this.carOrgLoc.y + (this.carStep.y * this.carCounter / this.decimalPrec)

  if (this.carCounter > 10) {
    if (this.carLeaving === 1) {
      if (this.sndId && typeof this.sndId.stop === 'function') {
        this.sndId.stop()
      }
      if (typeof boat.programControl === 'function') {
        boat.programControl(0)
      }
      this.carOnBoard = 0
      boat.enabled = true
    } else {
      const sounds = this.def && this.def.Sounds ? this.def.Sounds : []
      if (sounds[1] && this.game && this.game.mulle && this.game.mulle.playAudio) {
        this.game.mulle.playAudio(sounds[1])
      }
      if (sounds[2] && this.game && this.game.mulle && this.game.mulle.playAudio) {
        this.sndId = this.game.mulle.playAudio(sounds[2])
      }
      const idx = Math.trunc((-this.atStart + 2) / 1.5) - 1
      if (this.myDirections && this.myDirections[idx]) {
        boat.direction = this.myDirections[idx]
      }
      if (typeof boat.programControl === 'function') {
        boat.programControl(1, 'NoCheck')
      }
      boat.enabled = false
    }

    this.carCounter = 0
    this.carLeaving = 0
  }
}

MapObject.onDestroy = function () {
  this._deniedSoundPlaying = false
  this.sndId = 0
  this.child = 0
  return 0
}

export default MapObject
