import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import blinkThing from '../util/blinkThing'

class OceanState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('ocean', 'assets/ocean.json', null, this)
  }

  create () {
    super.create()

    this.game.mulle.addAudio('ocean')

    // Play ocean sounds (waves, seagulls)
    this.game.mulle.playAudio('93e001v0')

    // Background - ocean view
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('93.DXR', 1)
    this.game.add.existing(background)

    // The car parked by the ocean
    this.car = new MulleBuildCar(this.game, 445, 370, null, false, false)
    this.game.add.existing(this.car)

    // Miel sitting on the beach
    var mulle = new MulleSprite(this.game, 200, 300)
    mulle.setDirectorMember('93.DXR', 5) // Miel sitting sprite
    this.game.add.existing(mulle)

    // Rifka (Buffa) sitting next to Miel
    var buffa = new MulleSprite(this.game, 250, 320)
    buffa.setDirectorMember('00.CXT', 214) // Buffa idle
    this.game.add.existing(buffa)

    // Seagulls flying animation (if sprites exist)
    var seagull = new MulleSprite(this.game, 400, 120)
    seagull.setDirectorMember('93.DXR', 10) // Seagull sprite
    this.game.add.existing(seagull)

    // Animate seagull
    let frame = 10
    this.game.time.events.loop(200, () => {
      frame++
      if (frame > 12) frame = 10
      seagull.setDirectorMember('93.DXR', frame)
    })

    // Wait a moment for the peaceful scene, then show the wooden steering wheel
    this.game.time.events.add(3000, () => {
      this.showWoodenWheel()
    })
  }

  showWoodenWheel () {
    // Find the wooden steering wheel part ID (need to look up exact ID)
    // For now using a typical wheel part - should be around ID 150-160 for special wheels
    var wheelPartId = 157 // Wooden steering wheel (houten stuurwiel)
    
    // Check if already visited - only works once!
    if (this.game.mulle.user.Car.hasCache('#OceanVisited')) {
      // Already got the wheel, just go back
      this.game.mulle.stopAudio('93e001v0')
      this.game.state.start('world')
      return
    }
    
    var wheelData = this.game.mulle.PartsDB[wheelPartId]
    
    // Create the wooden steering wheel sprite
    var wheelPart = new MulleSprite(this.game, 320, 280)
    wheelPart.setDirectorMember('CDDATA.CXT', wheelData.junkView)
    wheelPart.partId = wheelPartId
    this.game.add.existing(wheelPart)

    // Play success DING sound
    this.game.mulle.playAudio('00d035v0') // Success "DING" sound

    new blinkThing(this.game, wheelPart, () => {
      // Add wooden steering wheel to junk yard
      this.game.mulle.user.Junk.yard[wheelPartId] = {
        x: this.game.rnd.integerInRange(290, 580),
        y: 440
      }

      // Mark as visited - only works once!
      this.game.mulle.user.Car.addCache('#OceanVisited')

      // Mission 8 completed: Racing (wooden wheel = racing wheel?)
      // Note: This might not be the correct scene for mission 8
      if (this.game.mulle.missions) {
        this.game.mulle.missions.markAsCompleted(8)
      }

      // Stop ocean sounds
      this.game.mulle.stopAudio('93e001v0')

      // Back to world
      this.game.state.start('world')
    }, this)
  }

  shutdown () {
    this.game.mulle.stopAudio('93e001v0')
    super.shutdown()
  }
}

export default OceanState
