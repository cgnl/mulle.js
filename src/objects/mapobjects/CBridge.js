'use strict'

// noinspection JSValidateTypes
/**
 * Automatic bridge with open/close animations (map 27)
 * Opens when car approaches, closes after car passes
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  this.bridgeOpen = false
  this.animating = false
  
  // Setup animations: opening and closing
  this.animationHelper.add('opening', 'normal', this.opt.Direction, 3, false, true)
  this.animationHelper.add('closing', 'normal', this.opt.Direction, 3, false, false)
  
  // Start in closed state (frame 0)
  this.setFrameList('normal', this.opt.Direction)
  this.animations.frame = 0
  
  console.debug('[CBridge] Created at', this.position, 'direction:', this.opt.Direction)
}

MapObject.onEnterOuter = function (car) {
  // Don't trigger if already animating or already open
  if (this.animating || this.bridgeOpen) {
    return
  }
  
  console.log('[CBridge] Opening bridge')
  this.animating = true
  
  // Play bridge opening sound
  if (this.def.Sounds && this.def.Sounds[0]) {
    this.game.mulle.playAudio(this.def.Sounds[0])
  }
  
  // Play opening animation
  this.animations.play('opening').onComplete.addOnce(() => {
    this.bridgeOpen = true
    this.animating = false
    console.log('[CBridge] Bridge fully open')
  })
}

MapObject.onEnterInner = function (car) {
  // Block car if bridge is not fully open
  if (!this.bridgeOpen || this.animations.frame < 37) {
    console.log('[CBridge] Blocking car, bridge not ready. Frame:', this.animations.frame)
    car.speed = 0
    car.stepback(2)
  }
}

MapObject.onExitOuter = function (car) {
  // Don't close if not open or still animating
  if (!this.bridgeOpen || this.animating) {
    return
  }
  
  console.log('[CBridge] Closing bridge')
  this.animating = true
  
  // Play closing animation
  this.animations.play('closing').onComplete.addOnce(() => {
    this.bridgeOpen = false
    this.animating = false
    console.log('[CBridge] Bridge fully closed')
  })
}

export default MapObject
