/**
 * Erson Smuggler Encounter Scene
 * @module scenes/erson
 *
 * Scene from boten_70.DXR - Smuggler encounter on Smokkeleiland (MapId 66, ObjectId 10)
 *
 * Features:
 * - Background: 70b001v0 (member 42, 640x480)
 * - Erson NPC with animations (70a001v0 series, member 6)
 * - Dialogue: 70d001v0, 70d002v0, 70d003v0
 *
 * Mission 15 Logic (from original Lingo boat_70 ParentScript 1):
 * - Check: isInInventory(#helmet) AND isInInventory(#Suit)
 * - If both present:
 *   - Complete Mission 15
 *   - Get random part from externalParts
 *   - If no part available: "shit out of luck" message
 *   - Else: add the part
 *   - Marker: "JustDoit"
 * - If missing items:
 *   - Marker: "cantDoit"
 *
 * Dialogue Messages:
 * - Success: "Bedankt! Hier is een onderdeel voor je boot."
 * - Failure (no items): "Je hebt niet de juiste uitrusting! (helm + duikerpak nodig)"
 * - Failure (no part): "Helaas, geen onderdelen meer over."
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

// Pure data module — Lingo-faithful diving logic (tested)
const { computeDivingResult, MISSION_ID: DIVING_MISSION_ID } = require('./DivingData')

class ErsonState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_70.DXR'

    this.game.mulle.addAudio('seaworld')

    // Track mission state
    this.mission15Completed = this.getMissionCompletionCount(DIVING_MISSION_ID)
    console.log('[Erson] Mission 15 - Completed:', this.mission15Completed)

    // Mark visit if first time
    if (!this.game.mulle.user.Boat.hasCache('#VisitedErson')) {
      this.game.mulle.user.Boat.addCache('#VisitedErson')
    }

    // === BACKGROUND ===
    // 70b001v0 (member 42) = Main background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 42)) {
      console.warn('[Erson] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x87CEEB) // Light blue water color
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // === ERSON NPC ===
    // Erson is the smuggler/diver character
    // Sprite member 6 (70a001v0)
    this.erson = new MulleSprite(this.game, 320, 240)
    this.erson.setDirectorMember(this.DirResource, 6)
    this.game.add.existing(this.erson)

    this.setupErsonAnimations()

    // Make Erson clickable for dialogue
    this.erson.inputEnabled = true
    this.erson.input.useHandCursor = true
    this.erson.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.erson.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.erson.events.onInputUp.add(() => {
      this.onErsonClick()
    })

    // === EXIT BUTTON ===
    this.createExitButton()

    // === DIALOGUE STATE ===
    this.isTalking = false
    this.dialogueIndex = 0

    // Play ambient sounds
    this.playAmbientSounds()

    // === INITIAL ROUTE CHECK ===
    // Original Lingo uses "routeFrame" pattern with myMarker
    this.checkMission15()

    console.log('[Erson] Smuggler encounter scene created')
  }

  /**
   * Setup Erson's animations based on ErsonAnimChart
   * Tutorial variant removed; this is the canonical mission flow
   */
  setupErsonAnimations () {
    var b = this.DirResource

    // Still animation (frame 1)
    var stillFrames = []
    stillFrames.push([b, 6])
    this.erson.addAnimation('still', stillFrames, 5, true)

    // Point animation (frames 1-8)
    var pointFrames = []
    pointFrames.push([b, 6])  // 1
    pointFrames.push([b, 7])  // 2
    pointFrames.push([b, 8])  // 3
    pointFrames.push([b, 9])  // 4
    pointFrames.push([b, 10]) // 5
    pointFrames.push([b, 11]) // 6
    pointFrames.push([b, 12]) // 7
    pointFrames.push([b, 13]) // 8
    this.erson.addAnimation('point', pointFrames, 8, false)

    // Talk animation (frames with mouth movement)
    var talkFrames = []
    talkFrames.push([b, 14]) // 9
    talkFrames.push([b, 13]) // 8
    talkFrames.push([b, 15]) // 10
    talkFrames.push([b, 14]) // 9
    talkFrames.push([b, 15]) // 10
    talkFrames.push([b, 13]) // 8
    this.erson.addAnimation('talk', talkFrames, 10, true)

    // Happy talk (for success)
    var happyTalkFrames = []
    happyTalkFrames.push([b, 17]) // 12 (70a001v1)
    happyTalkFrames.push([b, 18]) // 13
    happyTalkFrames.push([b, 17]) // 12
    happyTalkFrames.push([b, 18]) // 13
    this.erson.addAnimation('happyTalk', happyTalkFrames, 8, true)

    // Start with still
    this.erson.animations.play('still')
  }

  /**
   * Create exit button to return to seaworld
   */
  createExitButton () {
    this.exitButton = this.game.add.text(50, 430, 'Terug naar zee', {
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
      this.exitToSeaworld()
    })

    var exitZone = this.game.add.graphics(0, 450)
    exitZone.beginFill(0x000000, 0.01)
    exitZone.drawRect(0, 0, 640, 30)
    exitZone.endFill()
    exitZone.inputEnabled = true
    exitZone.events.onInputUp.add(() => {
      this.exitToSeaworld()
    })
  }

  /**
   * Check Mission 15 requirements
   * Original Lingo: isInInventory(#helmet) AND isInInventory(#Suit)
   */
  checkMission15 () {
    const hasHelmet = this.hasInventoryItem('#helmet')
    const hasSuit = this.hasInventoryItem('#Suit')
    const randomPart = this.getRandomPart()

    // Lingo-faithful pure computation
    const divingResult = computeDivingResult({ hasHelmet, hasSuit, randomPart })
    console.log('[Erson] Lingo result:', divingResult.marker)

    console.log('[Erson] Mission 15 check - Helmet:', hasHelmet, 'Suit:', hasSuit)

    // Wait before showing dialogue
    this.game.time.events.add(1000, () => {
      if (divingResult.marker === 'JustDoit') {
        this.completeMission15(divingResult)
      } else {
        this.showMissingEquipment()
      }
    })
  }

  /**
   * Complete Mission 15 - Smuggler's Reward
   * Original Lingo logic:
   * - addCompletedMission(15)
   * - givePart = getRandomPart(externalParts)
   * - if givePart = #NoPart: "shit out of luck"
   * - else: addNewPart(givePart)
   * - myMarker = "JustDoit"
   */
  completeMission15 (divingResult) {
    console.log('[Erson] Completing Mission 15!')

    // Lingo order: addCompletedMission FIRST, then handle part
    const completionCount = this.completeMission(DIVING_MISSION_ID)
    console.log('[Erson] Mission 15 completed! Count:', completionCount)

    const givePart = divingResult.actions.givePart

    // Play success dialogue and give reward
    this.erson.animations.play('happyTalk')

    if (givePart === null) {
      // No parts available - "shit out of luck"
      console.log('[Erson] No parts available - "shit out of luck"')
      this.playDialogue('70d003v0', () => {
        this.showNotification('Helaas, geen onderdelen meer over.', '#ff9900')
        this.ersonIdleMode()
      })
    } else {
      // Give the part
      console.log('[Erson] Giving part:', givePart)
      this.givePart(givePart)
      this.playDialogue('70d001v0', () => {
        this.showNotification('Bedankt! Hier is een onderdeel voor je boot.', '#00ff00')
        this.showPartReward(givePart)
        this.ersonIdleMode()
      })
    }
  }

  /**
   * Show missing equipment message
   * Original Lingo: myMarker = "cantDoit"
   */
  showMissingEquipment () {
    console.log('[Erson] Missing required equipment')

    this.erson.animations.play('talk')
    this.playDialogue('70d002v0', () => {
      this.showNotification('Je hebt niet de juiste uitrusting! (helm + duikerpak nodig)', '#ff6666')
      this.ersonIdleMode()
    })
  }

  /**
   * Get a random part from externalParts
   * Original Lingo: getRandomPart(the externalParts of gMulleGlobals)
   * Returns null if no parts available (#NoPart)
   */
  getRandomPart () {
    const user = this.game.mulle.user
    if (!user || !user.externalParts || user.externalParts.length === 0) {
      console.warn('[Erson] No externalParts available')
      return null
    }

    const randomIndex = Math.floor(Math.random() * user.externalParts.length)
    return user.externalParts[randomIndex]
  }

  /**
   * Give part to player
   * Original Lingo: addNewPart(the user of gMulleGlobals, givePart)
   */
  givePart (partId) {
    const user = this.game.mulle.user

    // Add to shop floor (player can pick it up later)
    user.addBoatPart('Quay', partId)
    console.log('[Erson] Awarded Part', partId)

    user.save()
  }

  /**
   * Handle Erson click for additional dialogue
   */
  onErsonClick () {
    if (this.isTalking) return

    // Play random dialogue from available clips
    const dialogues = ['70d001v0', '70d002v0', '70d003v0']
    const randomDialogue = dialogues[Math.floor(Math.random() * dialogues.length)]

    this.playDialogue(randomDialogue, () => {
      this.ersonIdleMode()
    })
  }

  /**
   * Play dialogue with animation
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    this.erson.animations.play('talk')

    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Erson] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Return Erson to idle mode with random gestures
   */
  ersonIdleMode () {
    this.erson.animations.play('still')

    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }
    this.gestureTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking && Math.random() > 0.6) {
          this.erson.animations.play('point').onComplete.addOnce(() => {
            this.game.time.events.add(1000, () => {
              if (!this.isTalking) {
                this.erson.animations.play('still')
              }
            })
          })
        }
      }
    )
  }

  /**
   * Play ambient sounds
   */
  playAmbientSounds () {
    try {
      this.ambientSound = this.game.mulle.playAudio('70e002v0', null, true)
    } catch (e) {
      console.warn('[Erson] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      if (this.ambientSound) {
        this.ambientSound.stop()
        this.ambientSound = null
      }
      this.game.mulle.stopAudio('70e002v0')
    } catch (e) {
    }
  }

  /**
   * Show notification message
   */
  showNotification (message, color = '#ffffff') {
    const notifBg = this.game.add.graphics(320, 350)
    notifBg.beginFill(0x000000, 0.8)
    notifBg.drawRoundedRect(-200, -30, 400, 60, 10)
    notifBg.endFill()

    const notifText = this.game.add.text(320, 350, message, {
      font: 'bold 18px Arial',
      fill: color,
      align: 'center',
      stroke: '#000000',
      strokeThickness: 2
    })
    notifText.anchor.setTo(0.5, 0.5)

    this.game.add.tween(notifText.scale)
      .to({ x: 1.1, y: 1.1 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    this.game.time.events.add(3000, () => {
      this.game.add.tween(notifBg).to({ alpha: 0 }, 500, null, true)
      this.game.add.tween(notifText).to({ alpha: 0 }, 500, null, true)
        .onComplete.add(() => {
          notifBg.destroy()
          notifText.destroy()
        })
    })
  }

  /**
   * Show part reward notification
   */
  showPartReward (partId) {
    const rewardText = this.game.add.text(320, 200, 'Onderdeel ' + partId + ' ontvangen!', {
      font: 'bold 24px Arial',
      fill: '#00ff00',
      stroke: '#006600',
      strokeThickness: 3,
      align: 'center'
    })
    rewardText.anchor.setTo(0.5, 0.5)

    this.game.add.tween(rewardText.scale)
      .to({ x: 1.3, y: 1.3 }, 400, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    this.game.time.events.add(3000, () => {
      this.game.add.tween(rewardText)
        .to({ alpha: 0 }, 500, null, true)
        .onComplete.add(() => {
          rewardText.destroy()
        })
    })
  }

  /**
   * Check if inventory has item
   */
  hasInventoryItem (itemId) {
    if (this.game.mulle.seaInventory) {
      return this.game.mulle.seaInventory.hasItem(itemId.replace('#', ''))
    }

    const user = this.game.mulle.user
    if (user && user.Boat && user.Boat.hasCache(itemId)) {
      return true
    }

    return false
  }

  /**
   * Get mission completion count
   */
  getMissionCompletionCount (missionId) {
    const user = this.game.mulle.user
    if (!user) return 0

    if (user.Missions && user.Missions.CompletedMissions) {
      const completed = user.Missions.CompletedMissions.find(m => m.id === missionId)
      return completed ? completed.count || 1 : 0
    }

    return 0
  }

  /**
   * Complete a mission
   */
  completeMission (missionId) {
    const user = this.game.mulle.user
    if (!user) return 0

    if (user.completeSeaMission) {
      user.completeSeaMission(missionId)
    } else {
      console.warn('[Erson] completeSeaMission not available on user')
    }

    return this.getMissionCompletionCount(missionId)
  }

  /**
   * Return to seaworld
   */
  /**
   * Exit scene — Lingo: BehaviorScript 2.ls go("leave")
   */
  exitToSeaworld () {
    // Lingo parity: transition marker "leave"
    console.log('[Erson] leave → Returning to seaworld')

    if (this.isTalking) {
      this.isTalking = false
    }

    this.stopAmbientSounds()

    this.game.state.start('seaworld')
  }

  update () {
    super.update()
  }

  shutdown () {
    this.stopAmbientSounds()

    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }

    this.erson = null

    super.shutdown()
    console.log('[Erson] Scene shutdown')
  }
}

export default ErsonState
