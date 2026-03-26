'use strict'

const MapObject = {}

// End of the world/closed road
MapObject.onCreate = function () {
    this.animationHelper.static('normal', this.opt.Direction)
    console.log(this.def.FrameList);
}

MapObject.onEnterInner = function (car) {
    car.speed = 0;
    car.stepback(2);

}

export default MapObject
