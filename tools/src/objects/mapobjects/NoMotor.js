'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  this.insideInner = false
  this.insideOuter = false
  this.lastCommentCounter = 0
  this.enterLoc = null
}

MapObject.onEnterInner = function () {
  this.insideInner = true

  const boat = this.state && this.state.driveBoat
  if (!boat) return

  boat.notAllowedTypes = ['Motor']

  const isMotor = boat.currentPropulsion === 'motor'
  if (isMotor) {
    if (this.lastCommentCounter === 0) {
      const sounds = (this.def && this.def.Sounds) ? this.def.Sounds : []
      const idx = Math.random() < 0.5 ? 1 : 2
      const snd = sounds[idx]
      if (snd && this.game && this.game.mulle && this.game.mulle.playAudio) {
        this.game.mulle.playAudio(snd)
      }
    }

    const stepbackLoc = (typeof boat.stepback === 'function') ? boat.stepback(2) : null
    this.enterLoc = stepbackLoc || (boat.position ? { x: boat.position.x, y: boat.position.y } : null)
    boat.speed = 0
    this.lastCommentCounter = 100
  } else if (this.lastCommentCounter === 0) {
    const snd = this.def && this.def.Sounds ? this.def.Sounds[0] : null
    if (snd && this.game && this.game.mulle && this.game.mulle.playAudio) {
      this.game.mulle.playAudio(snd)
    }
  }
}

MapObject.onExitInner = function () {
  this.insideInner = false
}

MapObject.step = function (carLoc) {
  if (this.lastCommentCounter > 0) {
    this.lastCommentCounter -= 1
  }

  const handlers = this.state && this.state.drivingHandlers
  if (handlers && typeof handlers.checkRadius === 'function' && carLoc) {
    const myLoc = {
      x: (this.position && typeof this.position.x === 'number') ? this.position.x : this.x,
      y: (this.position && typeof this.position.y === 'number') ? this.position.y : this.y
    }
    const event = handlers.checkRadius(this, [carLoc.x, carLoc.y], [myLoc.x, myLoc.y], 'both')
    if (event === 'EnterInnerRadius' || event === 'EnterBoth') {
      MapObject.onEnterInner.call(this)
    }
  }

  const boat = this.state && this.state.driveBoat
  if (!boat) return

  const isMotor = boat.currentPropulsion === 'motor'
  if (this.insideInner && isMotor) {
    if (boat.position) {
      if (this.enterLoc) {
        boat.position.x = this.enterLoc.x
        boat.position.y = this.enterLoc.y
      }
    }
    boat.speed = 0
  }
}

MapObject.onDestroy = function () {
  const boat = this.state && this.state.driveBoat
  if (boat) {
    boat.notAllowedTypes = []
  }
  this.enterLoc = null
  this.child = 0
  return 0
}

export default MapObject
