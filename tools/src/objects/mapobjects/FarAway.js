'use strict'

// noinspection JSValidateTypes
/**
 * Far away achievement (Doris Digital, map 17)
 * Awards "Ver Bort" medal on first visit
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  // Check if player already has the medal
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  
  if (hasMedal) {
    // If medal already awarded, disable this object
    this.enabled = false
    this.renderable = false
    console.debug('[FarAway] Medal already earned, object disabled')
  } else {
    console.debug('[FarAway] Medal available, waiting for car')
  }
}

MapObject.onEnterInner = function (car) {
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  
  if (!hasMedal) {
    // Disable car movement during cutscene
    car.enabled = false
    
    console.log('[FarAway] Awarding "Ver Bort" medal!')
    
    // Play achievement audio
    this.game.mulle.playAudio('05d010v0', () => {
      // Award medal after audio completes
      this.game.mulle.user.Car.addMedal(2)
      console.log('[FarAway] Medal "Ver Bort" unlocked!')
      
      // Disable this trigger permanently
      this.enabled = false
      this.renderable = false
      
      // Re-enable car
      car.enabled = true
    })
  }
}

export default MapObject
