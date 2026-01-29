import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import blinkThing from '../util/blinkThing'

/**
 * OceanState - The ocean/beach scene
 * 
 * This scene also serves as the UNLOCK TRIGGER for the Scheepswerf (boat yard).
 * When visiting the ocean for the first time, Miel dreams about building boats,
 * which unlocks the Scheepswerf world option.
 */
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

    // Check if we should trigger the Scheepswerf unlock cutscene
    const user = this.game.mulle.user
    if (!user.scheepswerfUnlocked && !user.seenBoatDream) {
      // First visit to ocean without having unlocked boats - trigger the dream!
      this.game.time.events.add(2000, () => {
        this.triggerBoatDreamCutscene()
      })
    } else {
      // Normal flow - wait then show the wooden steering wheel
      this.game.time.events.add(3000, () => {
        this.showWoodenWheel()
      })
    }
  }

  /**
   * SCHEEPSWERF UNLOCK TRIGGER
   * 
   * This cutscene plays when Miel visits the ocean and dreams about building boats.
   * The dream sequence shows: vlot (raft) → kano (canoe) → boot (boat)
   * After the dream, the Scheepswerf world becomes unlocked!
   */
  triggerBoatDreamCutscene () {
    console.log('[Ocean] Triggering boat dream cutscene - SCHEEPSWERF UNLOCK!')
    
    const user = this.game.mulle.user
    user.seenBoatDream = true
    
    // Fade to dreamy overlay
    const dreamOverlay = this.game.add.graphics(0, 0)
    dreamOverlay.beginFill(0x000066, 0.6)
    dreamOverlay.drawRect(0, 0, 640, 480)
    dreamOverlay.endFill()
    dreamOverlay.alpha = 0
    
    // Fade in dream overlay
    this.game.add.tween(dreamOverlay)
      .to({ alpha: 1 }, 1000, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        this.showBoatDreamSequence(dreamOverlay)
      })
  }

  showBoatDreamSequence (dreamOverlay) {
    // Dream title
    const dreamTitle = this.game.add.text(320, 60, '💭 Miel droomt...', {
      font: 'italic 28px Arial',
      fill: '#ffffff'
    })
    dreamTitle.anchor.setTo(0.5, 0.5)
    dreamTitle.alpha = 0
    this.game.add.tween(dreamTitle).to({ alpha: 1 }, 500, null, true)

    // Boat evolution sequence: raft → canoe → boat
    const boatPhases = [
      { emoji: '🪵', name: 'vlot', description: 'Een simpel vlot...' },
      { emoji: '🛶', name: 'kano', description: 'Een kleine kano...' },
      { emoji: '⛵', name: 'boot', description: 'Een echte boot!' }
    ]

    let phaseIndex = 0
    
    const phaseText = this.game.add.text(320, 200, '', {
      font: '64px Arial'
    })
    phaseText.anchor.setTo(0.5, 0.5)

    const descText = this.game.add.text(320, 280, '', {
      font: '24px Arial',
      fill: '#ffffff'
    })
    descText.anchor.setTo(0.5, 0.5)

    const showNextPhase = () => {
      if (phaseIndex >= boatPhases.length) {
        // Dream sequence complete - show unlock message
        this.showUnlockMessage(dreamOverlay, dreamTitle, phaseText, descText)
        return
      }

      const phase = boatPhases[phaseIndex]
      
      // Fade out current
      this.game.add.tween(phaseText).to({ alpha: 0 }, 200, null, true)
        .onComplete.add(() => {
          phaseText.text = phase.emoji
          descText.text = phase.description
          
          // Fade in new
          phaseText.alpha = 0
          descText.alpha = 0
          this.game.add.tween(phaseText).to({ alpha: 1 }, 500, null, true)
          this.game.add.tween(descText).to({ alpha: 1 }, 500, null, true)
          
          phaseIndex++
          this.game.time.events.add(2000, showNextPhase)
        })
    }

    // Start sequence
    this.game.time.events.add(500, showNextPhase)
  }

  showUnlockMessage (dreamOverlay, dreamTitle, phaseText, descText) {
    // Clear dream elements
    this.game.add.tween(phaseText).to({ alpha: 0 }, 300, null, true)
    this.game.add.tween(descText).to({ alpha: 0 }, 300, null, true)

    // Show unlock message
    dreamTitle.text = '🎉 ONTGRENDELD!'
    
    const unlockText = this.game.add.text(320, 200, '⛵ Scheepswerf ⛵', {
      font: 'bold 48px Arial',
      fill: '#ffff00',
      stroke: '#333333',
      strokeThickness: 4
    })
    unlockText.anchor.setTo(0.5, 0.5)
    unlockText.alpha = 0

    const subText = this.game.add.text(320, 280, 
      'Je kunt nu boten bouwen bij Christina Colombus!\n\nGa naar het Wereldselectie menu om te beginnen.', {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    subText.anchor.setTo(0.5, 0.5)
    subText.alpha = 0

    // Animate unlock message
    this.game.add.tween(unlockText).to({ alpha: 1 }, 500, null, true)
    this.game.add.tween(subText).to({ alpha: 1 }, 500, null, true, 300)

    // Play unlock sound
    this.game.mulle.playAudio('00d035v0') // Success DING

    // ACTUALLY UNLOCK THE SCHEEPSWERF
    const user = this.game.mulle.user
    user.scheepswerfUnlocked = true
    this.game.mulle.saveData()
    console.log('[Ocean] SCHEEPSWERF UNLOCKED! user.scheepswerfUnlocked =', user.scheepswerfUnlocked)

    // Continue to normal ocean flow after delay
    const continueBtn = this.game.add.text(320, 380, '▶ Doorgaan', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 3
    })
    continueBtn.anchor.setTo(0.5, 0.5)
    continueBtn.inputEnabled = true
    continueBtn.alpha = 0

    this.game.add.tween(continueBtn).to({ alpha: 1 }, 300, null, true, 1000)

    continueBtn.events.onInputOver.add(() => {
      continueBtn.fill = '#ffff00'
      this.game.canvas.className = 'cursor-point'
    })
    continueBtn.events.onInputOut.add(() => {
      continueBtn.fill = '#ffffff'
      this.game.canvas.className = ''
    })
    continueBtn.events.onInputUp.add(() => {
      // Fade out dream and continue
      this.game.add.tween(dreamOverlay).to({ alpha: 0 }, 500, null, true)
      this.game.add.tween(unlockText).to({ alpha: 0 }, 300, null, true)
      this.game.add.tween(subText).to({ alpha: 0 }, 300, null, true)
      this.game.add.tween(continueBtn).to({ alpha: 0 }, 300, null, true)
      this.game.add.tween(dreamTitle).to({ alpha: 0 }, 300, null, true)
        .onComplete.add(() => {
          // Now show the wooden wheel as normal
          this.showWoodenWheel()
        })
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
