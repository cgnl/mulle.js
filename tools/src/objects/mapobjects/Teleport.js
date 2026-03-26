'use strict'

/**
 * Teleport object - transports car to another location
 * Supports same-map and cross-map teleportation
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  this.renderable = false
  
  this.targetX = this.opt?.TargetX || null
  this.targetY = this.opt?.TargetY || null
  this.targetMap = this.opt?.TargetMap || null
  this.targetDirection = this.opt?.Direction || null
  
  if (!this.targetX || !this.targetY) {
    console.error('[Teleport] Missing target position!', this.opt)
  }
  
  console.debug('[Teleport] Created at', this.position, '→', {x: this.targetX, y: this.targetY, map: this.targetMap})
}

MapObject.onEnterInner = function (car) {
  // Prevent re-triggering during teleport
  if (this.teleporting) {
    return
  }
  
  this.teleporting = true
  car.enabled = false
  
  // Fade to black
  const fade = this.game.add.graphics(0, 0)
  fade.beginFill(0x000000, 0)
  fade.drawRect(0, 0, 640, 480)
  fade.fixedToCamera = true
  
  this.game.add.tween(fade)
    .to({alpha: 1}, 200, Phaser.Easing.Linear.None, true)
    .onComplete.addOnce(() => {
      
      // Cross-map teleport
      if (this.targetMap) {
        const worldState = this.game.state.states['world']
        if (worldState && worldState.changeMap) {
          worldState.changeMap(this.targetMap, true)
        } else {
          console.error('[Teleport] World state or changeMap not available')
        }
      }
      
      // Move car to target position
      car.position.set(this.targetX, this.targetY)
      
      // Change direction if specified
      if (this.targetDirection !== null) {
        car.direction = this.targetDirection
      }
      
      // Fade in
      this.game.add.tween(fade)
        .to({alpha: 0}, 200, Phaser.Easing.Linear.None, true)
        .onComplete.addOnce(() => {
          fade.destroy()
          car.enabled = true
          
          // Reset teleport flag after delay to prevent immediate re-trigger
          this.game.time.events.add(500, () => {
            this.teleporting = false
          })
        })
    })
}

export default MapObject
