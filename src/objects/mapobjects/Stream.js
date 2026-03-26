'use strict'

var MapObject = {}

function resolveVelPoint (ctx, dir) {
  const boat = ctx && ctx.state ? ctx.state.driveBoat : null
  const list = boat && Array.isArray(boat.directionList) ? boat.directionList : null

  if (list && list.length > 0) {
    const idx = Math.max(1, Math.min(list.length, dir)) - 1
    const p = list[idx]
    if (p && typeof p.x === 'number' && typeof p.y === 'number') {
      return { x: p.x, y: p.y }
    }
  }

  return { x: 0, y: 0 }
}

MapObject.onCreate = function () {
  this.insideInner = false
  this.insideOuter = false

  const opt = this.opt || this.optionalData || {}
  this.sound = opt.sound

  const tmpDir = (typeof opt.Dir === 'number') ? opt.Dir : 8
  const tmpSpeed = (typeof opt.speed === 'number') ? opt.speed : 2

  const vel = resolveVelPoint(this, tmpDir)
  this.driftPoint = {
    x: (tmpSpeed * vel.x) / 100,
    y: (tmpSpeed * vel.y) / 100
  }

  this.SP = opt.UnderSP

  if (typeof this.setSpriteLocation === 'function' && this.SP) {
    this.setSpriteLocation(this.SP, { x: this.x, y: this.y })
  }
}

MapObject.onEnterOuter = function () {
  this.insideOuter = true
}

MapObject.onExitOuter = function () {
  this.insideOuter = false
}

MapObject.step = function (carLoc) {
  const handlers = this.state && this.state.drivingHandlers
  if (handlers && typeof handlers.checkRadius === 'function' && carLoc) {
    const myLoc = {
      x: (this.position && typeof this.position.x === 'number') ? this.position.x : this.x,
      y: (this.position && typeof this.position.y === 'number') ? this.position.y : this.y
    }
    const event = handlers.checkRadius(this, [carLoc.x, carLoc.y], [myLoc.x, myLoc.y], 'both')

    if (event === 'EnterBoth' || event === 'enterOuterRadius' || event === 'EnterOuterRadius') {
      MapObject.onEnterOuter.call(this)
    } else if (event === 'ExitBoth' || event === 'ExitOuterRadius' || event === 'exitOuterRadius') {
      MapObject.onExitOuter.call(this)
    }
  }

  if (!this.insideOuter || !this.driftPoint) return

  const boat = this.state && this.state.driveBoat
  if (!boat || !boat.position) return

  if (typeof boat.getShowCoordinate === 'function' && typeof boat.setShowCoordinate === 'function') {
    const show = boat.getShowCoordinate()
    boat.setShowCoordinate({
      x: show.x + this.driftPoint.x,
      y: show.y + this.driftPoint.y
    })
    return
  }

  boat.position.x += this.driftPoint.x
  boat.position.y += this.driftPoint.y

  if (this.state.boatSprite && this.state.boatSprite.position) {
    this.state.boatSprite.position.x = boat.position.x
    this.state.boatSprite.position.y = boat.position.y
  }
}

MapObject.onDestroy = function () {
  this.insideOuter = false
  this.driftPoint = null
  return 0
}

export default MapObject
