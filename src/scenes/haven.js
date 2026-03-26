/**
 * Peggy PC Part Giving Scene (Haven)
 * @module scenes/haven
 *
 * Scene 71 from the original game (boten_71.DXR) - Peggy PC encounter
 * The quay/haven scene where Peggy PC gives boat parts
 *
 * Features:
 * - Background: 71b001v0 (member 14, 640x480)
 * - Foreground: 71b002v0 (member 15, 402x245)
 * - Peggy PC character with animations
 * - Mission 14: Part reward system
 * - Power requirement: >= 200
 * - External parts system for rewards
 * - Returns to boatyard after interaction
 *
 * Lingo Logic from boten_71 ParentScript 1:
 * - givePart = getRandomPart(externalParts)
 * - If boat.power >= 200:
 *   - If givePart == #NoPart: Complete mission 14, "shit out of luck"
 *   - Else: addNewPart(givePart), Complete mission 14
 * - Else: myMarker = "cantDoIt" (not enough power)
 *
 * Dialogue Messages:
 * - Power < 200: "Je boot is nog niet sterk genoeg! Je hebt minimaal 200 vermogen nodig."
 * - No part available: "Helaas, ik heb geen onderdelen meer om te geven. Maar goed gedaan!"
 * - Success: "Hier is een nieuw onderdeel voor je boot! Veel plezier ermee."
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

// Pure data module for scene 71 mission logic (tested)
const { computeSurferResult } = require('./SurferData')

class HavenState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_71.DXR'

    this.game.mulle.addAudio('seaworld')

    // === BACKGROUND ===
    // 71b001v0 (member 14) = Main haven background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 14)) {
      console.warn('[Haven] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x6699CC) // Haven blue
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // 71b002v0 (member 15) = Foreground layer (402x245)
    // Position from metadata: imagePosX(145) + imageRegX(175) = 320, imagePosY(89) + imageRegY(151) = 240
    this.foreground = new MulleSprite(this.game, 320, 240)
    if (this.foreground.setDirectorMember(this.DirResource, 15)) {
      this.game.add.existing(this.foreground)
    }

    // === PEGGY PC NPC ===
    // Peggy PC appears here to give parts
    this.peggy = new MulleSprite(this.game, 320, 240)
    // Peggy uses member 16 as base (70a001v0 reused from boten_70)
    // Verify sprite exists before adding
    if (this.peggy.setDirectorMember(this.DirResource, 16)) {
      this.game.add.existing(this.peggy)
      this.setupPeggyAnimations()
    } else {
      console.warn('[Haven] Peggy sprite member 16 not found')
      this.peggy.destroy()
      this.peggy = null
    }

    if (this.peggy) {
      this.peggy.inputEnabled = true
      this.peggy.input.useHandCursor = true
      this.peggy.events.onInputOver.add(() => {
        this.game.mulle.cursor.current = 'Point'
      })
      this.peggy.events.onInputOut.add(() => {
        this.game.mulle.cursor.current = null
      })
      this.peggy.events.onInputUp.add(() => {
        this.onPeggyClick()
      })
    }

    // === STATE TRACKING ===
    this.isTalking = false
    this.partGiven = false

    // === EXIT BUTTON ===
    this.createExitButton()

    // === START SEQUENCE ===
    this.game.time.events.add(1000, () => {
      this.startHavenScene()
    })

    console.log('[Haven] Peggy PC scene created')
  }

  /**
   * Setup Peggy PC's animations
   * Uses the same animation frames as Erson (members 16-21)
   */
  setupPeggyAnimations () {
    var b = this.DirResource

    // Still/idle animation (frame 1 - member 16)
    var idleFrames = []
    idleFrames.push([b, 16])
    this.peggy.addAnimation('idle', idleFrames, 5, true)

    // Point animation (frames 1-6, members 16-21)
    var pointFrames = []
    pointFrames.push([b, 16]) // 1
    pointFrames.push([b, 17]) // 2
    pointFrames.push([b, 18]) // 3
    pointFrames.push([b, 19]) // 4
    pointFrames.push([b, 20]) // 5
    pointFrames.push([b, 21]) // 6
    this.peggy.addAnimation('point', pointFrames, 8, false)

    // Talk animation (using available frames)
    var talkFrames = []
    talkFrames.push([b, 21]) // 6
    talkFrames.push([b, 20]) // 5
    talkFrames.push([b, 19]) // 4
    talkFrames.push([b, 20]) // 5
    talkFrames.push([b, 19]) // 4
    this.peggy.addAnimation('talk', talkFrames, 10, true)

    // Happy/celebrate animation
    var happyFrames = []
    happyFrames.push([b, 16])
    happyFrames.push([b, 21])
    happyFrames.push([b, 16])
    happyFrames.push([b, 21])
    this.peggy.addAnimation('happy', happyFrames, 10, true)

    // Start with idle
    this.peggy.animations.play('idle')
  }

  /**
   * Create exit button to return to boatyard
   */
  createExitButton () {
    this.exitButton = this.game.add.text(50, 430, 'Terug', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 3
    })
    this.exitButton.inputEnabled = true
    this.exitButton.events.onInputOver.add(() => {
      this.exitButton.fill = '#ffff00'
      this.game.mulle.cursor.current = 'Point'
    })
    this.exitButton.events.onInputOut.add(() => {
      this.exitButton.fill = '#ffffff'
      this.game.mulle.cursor.current = null
    })
    this.exitButton.events.onInputUp.add(() => {
      this.exitToBoatyard()
    })
  }

  /**
   * Start the haven scene sequence
   * Uses computeSurferResult() from SurferData for Lingo-faithful logic.
   *
   * NOTE: Lingo has NO "mission already completed" guard — it always processes
   * the power check and M14 completion. The previous "BUG FIX #8" was incorrect
   * because Lingo's addCompletedMission is idempotent.
   */
  startHavenScene () {
    console.log('[Haven] Starting Peggy PC encounter')

    const boatPower = this.getBoatPower()
    const randomPart = this.getRandomPart()
    console.log('[Haven] Boat power:', boatPower, 'Random part:', randomPart)

    // Compute result via pure Data module (Lingo-faithful)
    const result = computeSurferResult({
      power: boatPower,
      randomPart: randomPart !== null ? String(randomPart) : null
    })

    console.log('[Haven] Result:', result.marker, result.actions)

    // Apply side-effects based on computed result
    if (result.marker === 'cantDoIt') {
      this.handleNotEnoughPower()
    } else {
      // JustDoit path
      if (result.actions.givePart) {
        this.handleGivePart(result.actions.givePart)
      } else {
        this.handleNoPartAvailable()
      }
      if (result.actions.completeMission14) {
        this.completeMission14()
      }
    }
  }

  /**
   * Handle case when boat doesn't have enough power
   * myMarker = "cantDoIt"
   */
  handleNotEnoughPower () {
    console.log('[Haven] Not enough power - cannot give part')

    if (this.peggy) this.peggy.animations.play('talk')
    this.isTalking = true

    this.showMessage('Je boot is nog niet sterk genoeg! Je hebt minimaal 200 vermogen nodig.', () => {
      this.isTalking = false
      if (this.peggy) this.peggy.animations.play('idle')
    })
  }

  /**
   * Handle no part available (#NoPart case)
   */
  handleNoPartAvailable () {
    console.log('[Haven] No parts available - completing mission anyway')

    this.peggy.animations.play('talk')
    this.isTalking = true

    this.showMessage('Helaas, ik heb geen onderdelen meer om te geven. Maar goed gedaan!', () => {
      this.isTalking = false
      this.peggy.animations.play('idle')
    })
  }

  /**
   * Give a part to the player
   * @param {number} partId - The part ID to give
   */
  handleGivePart (partId) {
    console.log('[Haven] Giving part:', partId)

    // Add the part to player's inventory
    this.addNewPart(partId)

    this.partGiven = true

    // Peggy celebrates and gives the part
    this.peggy.animations.play('happy')
    this.isTalking = true

    // Try to play dialogue
    const audio = this.game.mulle.playAudio('71d004v0', () => {
      this.isTalking = false
      this.peggy.animations.play('idle')
    })

    if (!audio) {
      // No audio available, continue anyway
      this.isTalking = false
      this.game.time.events.add(2000, () => {
        this.peggy.animations.play('idle')
      })
    }

    // Show success message
    this.showMessage('Hier is een nieuw onderdeel voor je boot! Veel plezier ermee!', () => {
      this.showRewardNotification('Onderdeel ' + partId + ' ontvangen!')
    })
  }

  /**
   * Get random part from externalParts
   * Original Lingo: getRandomPart(the externalParts of gMulleGlobals)
   * Returns null if no parts available (#NoPart)
   */
  getRandomPart () {
    const user = this.game.mulle.user
    if (!user) {
      console.warn('[Haven] No user available')
      return null  // #NoPart in original Lingo
    }

    // Use user.getRandomRewardPart() which implements the original Lingo logic:
    // - Gets parts from #random category of externalParts
    // - Filters out parts player already has
    // - Returns random part or null (#NoPart)
    const part = user.getRandomRewardPart()
    
    if (part === null) {
      console.log('[Haven] No external parts available (#NoPart)')
    } else {
      console.log('[Haven] Selected part:', part)
    }

    return part
  }

  /**
   * Add a new part to the player's inventory
   * Original Lingo: addNewPart(the user of gMulleGlobals, givePart)
   */
  addNewPart (partId) {
    const user = this.game.mulle.user
    if (!user) return

    // Add part to shop floor (player can pick it up later)
    if (user.addBoatPart) {
      user.addBoatPart('Quay', partId)
      console.log('[Haven] Added part', partId, 'to Quay')
    } else {
      console.warn('[Haven] addBoatPart not available')
    }

    user.save()
  }

  /**
   * Get the current boat's power
   * Original Lingo: getProperty(getBoat(the user), #power)
   * 
   * BUG FIX #1: Haven Scene Power Requirement Check - Verified Correct
   * The getProperty('power') correctly sums all engine/motor power values
   * from boat parts in boatdata.js updateStats() line 205
   */
  getBoatPower () {
    const user = this.game.mulle.user
    if (!user || !user.Boat) {
      console.warn('[Haven] No boat found')
      return 0
    }

    // This correctly returns the summed power from all engine parts
    return user.Boat.getProperty('power', 0)
  }

  /**
   * Complete Mission 14
   * Original Lingo: addCompletedMission(the user of gMulleGlobals, 14)
   */
  completeMission14 () {
    const user = this.game.mulle.user
    if (!user) return

    console.log('[Haven] Completing Mission 14')

    if (user.addCompletedMission) {
      user.addCompletedMission(14)
    } else if (user.completeSeaMission) {
      user.completeSeaMission(14)
    } else {
      console.warn('[Haven] No mission completion method available')
    }

    user.save()
  }

  /**
   * Handle Peggy click (for additional dialogue)
   */
  onPeggyClick () {
    if (this.isTalking || this.partGiven) return

    const boatPower = this.getBoatPower()

    if (boatPower < 200) {
      this.showMessage('Je boot is nog niet sterk genoeg! Je hebt minimaal 200 vermogen nodig.', () => {
        this.peggy.animations.play('idle')
      })
    } else {
      // Player already got their part, just say goodbye
      this.showMessage('Kom later terug voor meer onderdelen!', () => {
        this.peggy.animations.play('idle')
      })
    }
  }

  /**
   * Show a message on screen
   * @param {string} text - Message text
   * @param {function} onComplete - Callback when done
   */
  showMessage (text, onComplete) {
    var msgBg = this.game.add.graphics(320, 240)
    msgBg.beginFill(0x000000, 0.8)
    msgBg.drawRoundedRect(-250, -50, 500, 100, 15)
    msgBg.endFill()

    var msgText = this.game.add.text(320, 240, text, {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 480
    })
    msgText.anchor.setTo(0.5, 0.5)

    this.game.time.events.add(4000, () => {
      msgBg.destroy()
      msgText.destroy()
      if (onComplete) onComplete()
    })
  }

  /**
   * Show reward notification
   * @param {string} message - Reward message
   */
  showRewardNotification (message) {
    const rewardText = this.game.add.text(320, 150, message, {
      font: 'bold 24px Arial',
      fill: '#00ff00',
      stroke: '#006600',
      strokeThickness: 3,
      align: 'center'
    })
    rewardText.anchor.setTo(0.5, 0.5)

    // Bounce animation
    this.game.add.tween(rewardText.scale)
      .to({ x: 1.2, y: 1.2 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    this.game.time.events.add(2500, () => {
      this.game.add.tween(rewardText)
        .to({ alpha: 0 }, 500, null, true)
        .onComplete.add(() => {
          rewardText.destroy()
        })
    })
  }

  /**
   * Exit to boatyard
   */
  exitToBoatyard () {
    console.log('[Haven] Returning to boatyard')

    if (this.isTalking) {
      this.isTalking = false
    }

    this.game.state.start('boatyard')
  }

  update () {
    super.update()
  }

  shutdown () {
    this.game.sound.stopAll()

    this.peggy = null
    this.foreground = null

    super.shutdown()
    console.log('[Haven] Scene shutdown')
  }
}

export default HavenState
