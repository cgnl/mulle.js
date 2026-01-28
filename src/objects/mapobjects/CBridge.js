'use strict'

// noinspection JSValidateTypes
/**
 * Automatic bridge (map 27)
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  this.animationHelper.add('normal', 'normal', this.opt.Direction, 3, true, true)
  this.animations.play('normal')
  this.game.mulle.playAudio(this.def.Sounds[0])
}

MapObject.onEnterOuter = function (car) {
  console.log(this.animations.frame)
  if (this.animations.frame > 37) {
    car.speed = 0
    car.stepback(2)
  }
}

export default MapObject
