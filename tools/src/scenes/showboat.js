'use strict'

/**
 * ShowBoat scene - Boat show/exhibition
 * @module scenes/showboat
 * 
 * Equivalent of CarShowState (carshow.js) for boats
 * 
 * Assets from boten_SHOWBOAT.DXR:
 * - Cast 103: Water background (640x607) - "Vatten"
 * - Cast 104: Bottom bar (640x80) - "01b003v0"
 * - Cast 68-75: Wind direction indicator (strut0001-strut0020)
 * - Cast 92: Dummy background
 * - Cast 93: Wind animation "Vindstrut.00015"
 * - Cast 113-114: Large background frames
 * 
 * Audio clips:
 * - ShowBOAT_01 (cast 120): Short intro jingle
 * - ShowBOAT_02 (cast 121): Welcome speech
 * - ShowBOAT_03 (cast 122): Rating 5 (best)
 * - ShowBOAT_04 (cast 123): Rating 4
 * - ShowBOAT_05 (cast 124): Rating 3
 * - ShowBOAT_06 (cast 125): Rating 2
 * - ShowBOAT_07 (cast 126): Rating 1 (worst)
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

/**
 * Boat show scene - showcase your boat and get rated
 * @extends MulleState
 */
class ShowBoatState extends MulleState {
  preload () {
    super.preload()

    // Load showboat assets
    this.game.load.pack('showboat', 'assets/showboat.json', null, this)
  }

  create () {
    super.create()

    this.boat = null

    // Add showboat audio
    this.game.mulle.addAudio('showboat')

    // Create water background (cast 103 - "Vatten")
    var waterBackground = new MulleSprite(this.game, 320, 240)
    if (!waterBackground.setDirectorMember('boten_SHOWBOAT.DXR', 103)) {
      // Fallback: create blue water gradient
      console.warn('[ShowBoat] Could not load water background, using fallback')
      var graphics = this.game.add.graphics(0, 0)
      for (let y = 0; y < 480; y++) {
        const depth = y / 480
        const r = Math.floor(30 + depth * 20)
        const g = Math.floor(80 + depth * 40)
        const b = Math.floor(150 + depth * 50)
        graphics.beginFill(Phaser.Color.getColor(r, g, b))
        graphics.drawRect(0, y, 640, 1)
        graphics.endFill()
      }
    } else {
      this.game.add.existing(waterBackground)
    }

    // Create bottom bar (cast 104 - "01b003v0")
    var bottomBar = new MulleSprite(this.game, 320, 440)
    if (bottomBar.setDirectorMember('boten_SHOWBOAT.DXR', 104)) {
      this.game.add.existing(bottomBar)
    }

    // Create judge/announcer actor
    // Using a boat-specific judge or falling back to generic
    this.createJudge()

    // Create score display (hidden initially)
    this.scoreSprite = new MulleSprite(this.game, 320, 100)
    this.scoreSprite.visible = false
    this.game.add.existing(this.scoreSprite)

    // Create Mulle actor (watching from the side)
    var mulle = new MulleActor(this.game, 89, 337, 'mulleDefault')
    mulle.talkAnimation = 'talkRegular'
    mulle.silenceAnimation = 'idle'
    this.game.add.existing(mulle)
    this.game.mulle.actors.mulle = mulle
    mulle.animations.play('lookLeft')

    // Create the boat being showcased (centered, locked, with driver)
    this.boat = new MulleBuildBoat(this.game, 321, 280, null, true, false)
    this.game.add.existing(this.boat)

    // Create wind direction indicator (animated)
    this.createWindIndicator()

    // Play ambient/intro sound
    this.game.mulle.playAudio('ShowBOAT_01')

    // Calculate boat score
    this.calculateScore()

    // Start the show sequence
    this.startShowSequence()

    console.log('[ShowBoat] Boat show scene created')
  }

  /**
   * Create the judge/announcer actor
   * Uses boat show specific animations if available, otherwise falls back
   */
  createJudge () {
    // Try to create a boat-specific judge actor
    // The showboat assets have judge sprites around cast 68-75
    
    // Create a placeholder judge using existing actor system
    // Note: A proper implementation would add a 'boatJudge' actor type
    this.judge = new MulleActor(this.game, 155, 210, 'judge', true)
    
    if (!this.judge.key) {
      // Fallback: create a simple animated judge sprite
      console.warn('[ShowBoat] Judge actor not found, using placeholder')
      this.judge = new MulleSprite(this.game, 155, 210)
      this.judge.setDirectorMember('boten_SHOWBOAT.DXR', 68)
      
      // Add simple animation capability
      this.judge.talk = (audioId, callback) => {
        this.game.mulle.playAudio(audioId, callback)
      }
      this.judge.displayScore = null
    } else {
      this.judge.talkAnimation = 'talk'
      this.judge.silenceAnimation = 'idle'
    }
    
    this.game.add.existing(this.judge)
    this.game.mulle.actors.judge = this.judge
  }

  /**
   * Create animated wind direction indicator
   */
  createWindIndicator () {
    this.windIndicator = new MulleSprite(this.game, 580, 100)
    
    // Try to load wind indicator sprites (cast 68-91)
    if (!this.windIndicator.setDirectorMember('boten_SHOWBOAT.DXR', 68)) {
      // Fallback: create simple compass arrow
      var graphics = this.game.add.graphics(580, 100)
      graphics.beginFill(0xffffff)
      graphics.moveTo(0, -20)
      graphics.lineTo(10, 10)
      graphics.lineTo(-10, 10)
      graphics.endFill()
      this.windIndicator = graphics
    } else {
      this.game.add.existing(this.windIndicator)
    }

    // Animate wind indicator rotation
    this.windAngle = 0
    this.windTimer = this.game.time.events.loop(100, () => {
      this.windAngle += 0.05
      if (this.windIndicator.rotation !== undefined) {
        this.windIndicator.rotation = Math.sin(this.windAngle) * 0.3
      }
    })
  }

  /**
   * Calculate boat score based on funnyfactor + luxuryfactor
   */
  calculateScore () {
    const boat = this.game.mulle.user.Boat
    
    if (!boat) {
      console.error('[ShowBoat] No boat data found!')
      this.funnyFactor = 0
      this.luxuryFactor = 0
      this.totalScore = 0
      this.rating = 1
      return
    }

    // Get boat properties
    this.funnyFactor = boat.getProperty('funnyfactor', 0)
    this.luxuryFactor = boat.getProperty('luxuryfactor', 0)
    
    // Calculate total score (combine funny and luxury)
    this.totalScore = this.funnyFactor + this.luxuryFactor

    // Determine rating (1-5) based on total score
    // Rating thresholds (adapted for boats)
    if (this.totalScore < 3) {
      this.rating = 1
    } else if (this.totalScore < 5) {
      this.rating = 2
    } else if (this.totalScore < 8) {
      this.rating = 3
    } else if (this.totalScore < 12) {
      this.rating = 4
    } else {
      this.rating = 5
    }

    console.log('[ShowBoat] Score calculated:', {
      funnyFactor: this.funnyFactor,
      luxuryFactor: this.luxuryFactor,
      totalScore: this.totalScore,
      rating: this.rating
    })
  }

  /**
   * Start the boat show sequence
   */
  startShowSequence () {
    // Audio mapping for ratings
    // ShowBOAT_03 = rating 5 (best)
    // ShowBOAT_04 = rating 4
    // ShowBOAT_05 = rating 3
    // ShowBOAT_06 = rating 2
    // ShowBOAT_07 = rating 1 (worst)
    this.scoreTalk = {
      1: 'ShowBOAT_07',
      2: 'ShowBOAT_06',
      3: 'ShowBOAT_05',
      4: 'ShowBOAT_04',
      5: 'ShowBOAT_03'
    }

    // Setup displayScore callback for judge
    if (this.judge.displayScore !== null) {
      this.judge.displayScore = () => {
        this.displayScore()
      }
    }

    // Start with welcome speech (ShowBOAT_02)
    this.game.time.events.add(1000, () => {
      this.judge.talk('ShowBOAT_02', () => {
        // After welcome, show the score
        this.game.time.events.add(500, () => {
          this.displayScore()
        })
      })
    })
  }

  /**
   * Display the score and announce rating
   */
  displayScore () {
    console.log('[ShowBoat] Displaying score:', this.rating)

    // Show score sprite based on rating
    // The original assets may have score indicators at specific cast numbers
    // For now, create a text-based score display
    if (!this.scoreText) {
      this.scoreText = this.game.add.text(320, 80, '', {
        font: 'bold 48px Arial',
        fill: '#ffff00',
        stroke: '#333333',
        strokeThickness: 4
      })
      this.scoreText.anchor.setTo(0.5, 0.5)
    }

    // Display star rating
    const stars = '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating)
    this.scoreText.text = stars

    // Animate score appearance
    this.scoreText.alpha = 0
    this.game.add.tween(this.scoreText)
      .to({ alpha: 1 }, 500, Phaser.Easing.Bounce.Out, true)

    // Play rating audio
    this.judge.talk(this.scoreTalk[this.rating], () => {
      this.onShowComplete()
    })
  }

  /**
   * Called when the show is complete
   */
  onShowComplete () {
    console.log('[ShowBoat] Show complete')

    // Award medal for high scores (rating 5 with high total score)
    if (this.totalScore >= 15 && this.rating === 5) {
      this.awardMedal()
    }

    // Mark boat show mission as completed (if missions system exists)
    if (this.game.mulle.missions) {
      // Boat show could be mission 12 (example)
      this.game.mulle.missions.markAsCompleted(12)
    }

    // Show "continue" prompt after a delay
    this.game.time.events.add(2000, () => {
      this.showContinuePrompt()
    })
  }

  /**
   * Award medal for excellent boat
   */
  awardMedal () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    // Check if boat show medal exists and hasn't been awarded
    const medalId = this.game.mulle.SetWhenDone && this.game.mulle.SetWhenDone.BoatMedals 
      ? this.game.mulle.SetWhenDone.BoatMedals[0] 
      : 'boatshow_medal'

    if (!boat.hasMedal(medalId)) {
      boat.addMedal(medalId)
      console.log('[ShowBoat] Medal awarded:', medalId)

      // Show medal notification
      const medalText = this.game.add.text(320, 200, 'Medaille verdiend!', {
        font: 'bold 24px Arial',
        fill: '#ffd700',
        stroke: '#8b6914',
        strokeThickness: 3
      })
      medalText.anchor.setTo(0.5, 0.5)

      // Animate medal text
      this.game.add.tween(medalText.scale)
        .to({ x: 1.2, y: 1.2 }, 300, Phaser.Easing.Bounce.Out, true, 0, 2, true)
    }
  }

  /**
   * Show continue prompt to return to sea world or boatyard
   */
  showContinuePrompt () {
    // Create semi-transparent overlay
    const overlay = this.game.add.graphics(0, 0)
    overlay.beginFill(0x000000, 0.5)
    overlay.drawRect(0, 380, 640, 100)
    overlay.endFill()

    // Continue text
    const continueText = this.game.add.text(320, 420, 'Klik om door te gaan', {
      font: 'bold 20px Arial',
      fill: '#ffffff'
    })
    continueText.anchor.setTo(0.5, 0.5)

    // Blink effect
    this.game.add.tween(continueText)
      .to({ alpha: 0.5 }, 500, null, true, 0, -1, true)

    // Click anywhere to continue
    this.game.input.onDown.addOnce(() => {
      this.returnToNavigation()
    })
  }

  /**
   * Return to sea world or boatyard
   */
  returnToNavigation () {
    console.log('[ShowBoat] Returning to navigation')

    // If came from seaworld, return there; otherwise go to boatyard
    if (this.game.mulle.lastSeaSession) {
      this.game.state.start('seaworld')
    } else {
      this.game.state.start('boatyard')
    }
  }

  /**
   * Clean up when leaving scene
   */
  shutdown () {
    // Stop any playing audio
    try {
      this.game.mulle.stopAudio('ShowBOAT_01')
      this.game.mulle.stopAudio('ShowBOAT_02')
    } catch (e) {
      // Ignore
    }

    // Clean up wind timer
    if (this.windTimer) {
      this.game.time.events.remove(this.windTimer)
    }

    // Clear actor references
    this.game.mulle.actors.mulle = null
    this.game.mulle.actors.judge = null

    console.log('[ShowBoat] Scene shutdown')
  }
}

export default ShowBoatState
