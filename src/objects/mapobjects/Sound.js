'use strict'

/**
 * Sound trigger object
 * Plays audio when car enters the trigger zone
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  this.renderable = false
  this.triggerSound = this.opt?.Sound || null
  this.hasPlayed = false
  
  console.debug('[Sound] Created at', this.position, 'sound:', this.triggerSound)
}

MapObject.onEnterInner = function (car) {
  if (!this.hasPlayed && this.triggerSound) {
    console.log('[Sound] Playing:', this.triggerSound)
    this.game.mulle.playAudio(this.triggerSound)
    this.hasPlayed = true
  }
}

export default MapObject
