/**
 * Preacher/Church scene (Dominee's Island)
 * @module scenes/preacher
 * 
 * Scene 78 from the original game (boten_78.DXR)
 * Church island destination in the boat game
 * 
 * Features:
 * - Church island background (78b001v1, 78b002v0)
 * - Dominee (Preacher) NPC with Bible animation
 * - 19 dialogue clips (78d001v0 - 78d019v0)
 * - Clickable interaction with Dominee
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * - Mission 1: Bible Delivery (MissionType: #Telephone)
 * - Mission 20: First Visit Auto-Complete
 * - Mission 3: Part 172 Delivery (via Object 18)
 * - Cache item tracking (#Lemonade)
 * 
 * Mission 1 System (Bible Delivery):
 * - Required item: #Bible in inventory
 * - Reward logic (from original Lingo boat_78):
 *   - Completion 1-5: Random part from externalParts
 *   - Completion 2: ALWAYS Part 19 (church pews/kerkbanken)
 *   - Completion 6+: 1000 Belly (snacks)
 *   - If no parts available during 1-5: 1000 Belly instead
 * 
 * Mission 20 System (First Visit):
 * - Trigger: First time entering boat_78
 * - Auto-complete: Yes (gives Mission 1 reward automatically)
 * - Logic: Complete Mission 20 → If Mission 1 not given, give it → Player finds Bible → Deliver to complete Mission 1
 * 
 * Mission 3 System (Part 172 Delivery):
 * - Required item: Part 172 in boat parts
 * - Check: Object 19 in neighborhood (nearby)
 * - Reward: Cache item #Lemonade added
 * 
 * Asset members from boten_78.DXR:
 * - 11: 78b001v1 - Main background (640x480)
 * - 10: 78b002v0 - Foreground/water overlay (501x243)
 * - 47: 78a000v0 - Preacher body base sprite
 * - 48-54: 78a001v0 + animation frames 02-12 - Preacher head/talk animation
 * - 55-59: 78a003v0 + frames 06-09 - Preacher arm/Bible animation
 * - 60: 78a004v0 - Preacher with Bible raised
 * - 35: 78e001v0 - Ambient/background sound (looped)
 * - 67-85: 78d001v0 - 78d019v0 - Dialogue clips
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

const { computePreacherResult, BELLY_NR } = require('./PreacherData')

// Lingo parity: ParentScript 4 / BehaviorScripts (78/78)
// Inventory: tmpStuffNeeded — Dir.ls mission prerequisite check
// Transitions: "BibleLeave" (BehaviorScript 3), "leave" (BehaviorScript 2)
const PREACHER_STUFF_NEEDED_ITEM = 'tmpStuffNeeded'
const PREACHER_BIBLE_LEAVE_TRANSITION = 'BibleLeave'
const PREACHER_LEAVE_TRANSITION = 'leave'

class PreacherState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_78.DXR'

    this.game.mulle.addAudio('seaworld')

    // === SKY SPRITE (Channel 1) ===
    // Original Lingo: setSky(the weather of gMulleGlobals)
    this.setSky()

    this.mission3Completed = this.getMissionCompletionCount(3)

    if (!this.game.mulle.user.Boat.hasCache('#VisitedPreacher')) {
      this.game.mulle.user.Boat.addCache('#VisitedPreacher')
    }

    // Defer mission computation to first update() — allows E2E state injection
    this._needsCompute = true
  }

  _runMissionCompute () {
    // E2E pre-create hook: apply injected state before reading inventory/missions
    if (typeof window !== 'undefined' && window.__e2eStateOverride) {
      const ov = window.__e2eStateOverride
      delete window.__e2eStateOverride
      const user = this.game.mulle.user
      if (ov.userProps) Object.assign(user, ov.userProps)
      if (ov.missions && user.Boat) {
        if (!user.Boat.Missions) user.Boat.Missions = {}
        Object.assign(user.Boat.Missions, ov.missions)
      }
      if (ov.inventory) {
        if (!user.SeaInventory) user.SeaInventory = { items: {}, blueprints: {} }
        if (!user.SeaInventory.items) user.SeaInventory.items = {}
        for (const [k, v] of Object.entries(ov.inventory)) {
          user.SeaInventory.items[k.replace(/^#/, '')] = v
        }
      }
    }

    // --- Gather state and compute result via PreacherData ---
    const isMission1Given = this.hasMissionGiven(1)
    const isMission20Completed = this.getMissionCompletionCount(20) > 0
    const hasRequiredItem = this.hasInventoryItem('#Bible')
    const completionCount = this.getMissionCompletionCount(1)
    const randomPart = this.getRandomPart()
    const suffix = Math.random() < 0.5 ? 1 : 2

    console.log('[Preacher] Mission 1 - Given:', isMission1Given, 'Completed:', completionCount)
    console.log('[Preacher] Mission 20 - Completed:', isMission20Completed)
    console.log('[Preacher] Has Bible:', hasRequiredItem)

    const { marker, actions } = computePreacherResult({
      isMission1Given,
      isMission20Completed,
      hasRequiredItem,
      completionCount,
      randomPart,
      suffix
    })

    console.log('[Preacher] Computed marker:', marker, 'actions:', actions)

    // --- Apply actions ---
    if (actions.deleteItem) {
      this.removeInventoryItem('#Bible')
    }
    if (actions.completeMission1) {
      this.completeMission(1)
    }
    if (actions.completeMission20) {
      this.completeMission(20)
    }
    if (actions.giveMission1) {
      const user = this.game.mulle.user
      if (user && user.Missions) {
        if (!user.Missions.GivenMissions) {
          user.Missions.GivenMissions = []
        }
        user.Missions.GivenMissions.push(1)
        console.log('[Preacher] Mission 1 given (Bible Delivery)')
      }
    }
    if (actions.givePart !== null) {
      const reward = { type: 'part', id: actions.givePart }
      this.giveMission1Reward(reward)
      this.game.time.events.add(2000, () => {
        this.showRewardNotification(this.getRewardMessage(reward))
      })
    }
    if (actions.giveBelly) {
      const reward = { type: 'snack', item: '#Belly', amount: BELLY_NR }
      this.giveMission1Reward(reward)
      this.game.time.events.add(2000, () => {
        this.showRewardNotification(this.getRewardMessage(reward))
      })
    }

    // Store marker and first-visit flag for dialogue flow
    this.sceneMarker = marker
    this.isFirstVisit = !isMission20Completed

    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 11)
    this.game.add.existing(background)

    this.foreground = new MulleSprite(this.game, 320, 358)
    this.foreground.setDirectorMember(this.DirResource, 10)
    this.game.add.existing(this.foreground)

    // Draw the player's boat at position (315, 165) - original Lingo: drawBoat(point(315, 165))
    this.boat = new MulleBuildBoat(this.game, 315, 165, null, true, false)
    this.game.add.existing(this.boat)

    this.preacher = new MulleSprite(this.game, 320, 240)
    this.preacher.setDirectorMember(this.DirResource, 47)
    this.game.add.existing(this.preacher)

    this.setupPreacherAnimations()

    this.preacher.inputEnabled = true
    this.preacher.input.useHandCursor = true
    this.preacher.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.preacher.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.preacher.events.onInputUp.add(() => {
      this.onPreacherClick()
    })

    this.createExitButton()

    // Dialogue flow driven by computed marker from PreacherData
    // "cantDoit2" = first visit (M20 override), plays Bible-quest intro
    // Other markers = normal revisit flow
    if (this.sceneMarker === 'cantDoit2') {
      // First visit: play the "go find the Bible" dialogue
      this.game.time.events.add(1000, () => {
        this.playDialogue('78d002v0', () => {
          this.preacherIdleMode()
        })
      })
    } else {
      if (!this.game.mulle.user.Boat.hasCache('#PreacherIntroPlayed')) {
        this.game.time.events.add(500, () => {
          this.playDialogue('78d001v0', () => {
            this.game.mulle.user.Boat.addCache('#PreacherIntroPlayed')
            this.preacherIdleMode()
          })
        })
      } else {
        this.game.time.events.add(500, () => {
          this.playDialogue('78d002v0', () => {
            this.preacherIdleMode()
          })
        })
      }
    }

    this.playAmbientSounds()

    this.checkForMission3()

    this.dialogueIndex = 0
    this.dialogueSequence = [
      '78d003v0', '78d004v0', '78d005v0', '78d006v0', '78d007v0',
      '78d008v0', '78d009v0', '78d010v0', '78d011v0', '78d012v0',
      '78d013v0', '78d014v0', '78d015v0', '78d016v0', '78d017v0',
      '78d018v0', '78d019v0'
    ]

    console.log('[Preacher] Scene created - Church Island (Dominee)')
  }

  setupPreacherAnimations () {
    var b = this.DirResource

    var idleFrames = []
    idleFrames.push([b, 47])
    this.preacher.addAnimation('idle', idleFrames, 5, true)

    var talkFrames = []
    talkFrames.push([b, 47])
    talkFrames.push([b, 48])
    talkFrames.push([b, 49])
    talkFrames.push([b, 50])
    talkFrames.push([b, 51])
    talkFrames.push([b, 52])
    talkFrames.push([b, 53])
    talkFrames.push([b, 54])
    this.preacher.addAnimation('talk', talkFrames, 10, true)

    var bibleFrames = []
    bibleFrames.push([b, 55])
    bibleFrames.push([b, 56])
    bibleFrames.push([b, 57])
    bibleFrames.push([b, 58])
    bibleFrames.push([b, 59])
    bibleFrames.push([b, 60])
    this.preacher.addAnimation('raiseBible', bibleFrames, 8, false)

    var bibleLowerFrames = []
    bibleLowerFrames.push([b, 60])
    bibleLowerFrames.push([b, 59])
    bibleLowerFrames.push([b, 58])
    bibleLowerFrames.push([b, 57])
    bibleLowerFrames.push([b, 56])
    bibleLowerFrames.push([b, 55])
    bibleLowerFrames.push([b, 47])
    this.preacher.addAnimation('lowerBible', bibleLowerFrames, 8, false)

    var preachFrames = []
    preachFrames.push([b, 60])
    preachFrames.push([b, 48])
    preachFrames.push([b, 49])
    preachFrames.push([b, 50])
    preachFrames.push([b, 60])
    preachFrames.push([b, 51])
    preachFrames.push([b, 52])
    preachFrames.push([b, 53])
    this.preacher.addAnimation('preach', preachFrames, 10, true)

    this.preacher.animations.play('idle')
  }

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

  onPreacherClick () {
    if (this.isTalking) return

    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      if (this.dialogueIndex % 4 === 0) {
        this.preacher.animations.play('raiseBible').onComplete.addOnce(() => {
          this.playDialogue(dialogueId, () => {
            this.preacher.animations.play('lowerBible').onComplete.addOnce(() => {
              this.preacherIdleMode()
            })
          }, 'preach')
        })
      } else {
        this.playDialogue(dialogueId, () => {
          this.preacherIdleMode()
        })
      }
    } else {
      this.dialogueIndex = 0
      this.playDialogue('78d003v0', () => {
        this.preacherIdleMode()
      })
    }
  }

  playDialogue (dialogueId, onComplete, talkAnim = 'talk') {
    this.isTalking = true

    this.preacher.animations.play(talkAnim)

    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Preacher] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  preacherIdleMode () {
    this.preacher.animations.play('idle')

    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }
    this.gestureTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking && Math.random() > 0.7) {
          this.preacher.animations.play('raiseBible').onComplete.addOnce(() => {
            this.game.time.events.add(1000, () => {
              if (!this.isTalking) {
                this.preacher.animations.play('lowerBible').onComplete.addOnce(() => {
                  this.preacher.animations.play('idle')
                })
              }
            })
          })
        }
      }
    )
  }

  playAmbientSounds () {
    try {
      this.ambientSound = this.game.mulle.playAudio('78e001v0', null, true)
    } catch (e) {
      console.warn('[Preacher] Ambient sound not available')
    }
  }

  stopAmbientSounds () {
    try {
      if (this.ambientSound) {
        this.ambientSound.stop()
        this.ambientSound = null
      }
      this.game.mulle.stopAudio('78e001v0')
    } catch (e) {
    }
  }

  // Bible delivery logic is now handled by computePreacherResult() in create().

  /**
   * Deliver Bible to Preacher - completes Mission 1
   * Uses computePreacherResult() for all decision logic.
   */
  deliverBible () {
    console.log('[Preacher] Delivering Bible!')

    const { actions } = computePreacherResult({
      isMission1Given: true,
      isMission20Completed: true, // manual delivery only happens after M20
      hasRequiredItem: true,
      completionCount: this.getMissionCompletionCount(1),
      randomPart: this.getRandomPart(),
      suffix: Math.random() < 0.5 ? 1 : 2
    })

    // Apply actions
    this.removeInventoryItem('#Bible')
    this.completeMission(1)

    let reward
    if (actions.givePart !== null) {
      reward = { type: 'part', id: actions.givePart }
    } else {
      reward = { type: 'snack', item: '#Belly', amount: BELLY_NR }
    }

    this.preacher.animations.play('raiseBible').onComplete.addOnce(() => {
      this.playDialogue('78d015v0', () => {
        this.giveMission1Reward(reward)
        this.showRewardNotification(this.getRewardMessage(reward))

        this.preacher.animations.play('lowerBible').onComplete.addOnce(() => {
          this.preacherIdleMode()
        })
      }, 'preach')
    })
  }

  checkForMission3 () {
    if (this.game.mulle.user.isSeaMissionCompleted(3)) {
      this.missionState.mission3Completed = true
      return
    }

    const hasPart172 = this.hasPart172()
    const object19Nearby = this.isObject19Nearby()

    if (hasPart172 && object19Nearby) {
      console.log('[Preacher] Player has Part 172 to deliver (Mission 3)')
      this.game.time.events.add(4000, () => {
        this.offerPart172Delivery()
      })
    }
  }

  isObject19Nearby () {
    return true
  }

  offerPart172Delivery () {
    if (this.isTalking) return

    const promptBg = this.game.add.graphics(320, 350)
    promptBg.beginFill(0x000000, 0.8)
    promptBg.drawRoundedRect(-150, -40, 300, 80, 10)
    promptBg.endFill()

    const promptText = this.game.add.text(320, 340, 'Geef Mapstuk 172 aan de dominee?', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    promptText.anchor.setTo(0.5, 0.5)

    const yesBtn = this.game.add.text(260, 380, 'Ja', {
      font: 'bold 18px Arial',
      fill: '#00ff00'
    })
    yesBtn.anchor.setTo(0.5, 0.5)
    yesBtn.inputEnabled = true
    yesBtn.events.onInputOver.add(() => { yesBtn.fill = '#88ff88' })
    yesBtn.events.onInputOut.add(() => { yesBtn.fill = '#00ff00' })
    yesBtn.events.onInputUp.add(() => {
      promptBg.destroy()
      promptText.destroy()
      yesBtn.destroy()
      noBtn.destroy()
      this.deliverPart172()
    })

    const noBtn = this.game.add.text(380, 380, 'Nee', {
      font: 'bold 18px Arial',
      fill: '#ff6666'
    })
    noBtn.anchor.setTo(0.5, 0.5)
    noBtn.inputEnabled = true
    noBtn.events.onInputOver.add(() => { noBtn.fill = '#ff9999' })
    noBtn.events.onInputOut.add(() => { noBtn.fill = '#ff6666' })
    noBtn.events.onInputUp.add(() => {
      promptBg.destroy()
      promptText.destroy()
      yesBtn.destroy()
      noBtn.destroy()
    })
  }

  deliverPart172 () {
    console.log('[Preacher] Delivering Part 172!')

    const user = this.game.mulle.user
    if (user && user.Boat && user.Boat.Parts) {
      const partIndex = user.Boat.Parts.indexOf(172)
      if (partIndex > -1) {
        user.Boat.Parts.splice(partIndex, 1)
      }
    }

    this.addCacheItem('#Lemonade')

    this.completeMission(3)

    this.preacher.animations.play('raiseBible').onComplete.addOnce(() => {
      this.playDialogue('78d016v0', () => {
        this.showRewardNotification('Mapstuk 172 geaccepteerd!')

        this.preacher.animations.play('lowerBible').onComplete.addOnce(() => {
          this.preacherIdleMode()
        })
      }, 'preach')
    })
  }

  showRewardNotification (message) {
    const rewardText = this.game.add.text(320, 200, message, {
      font: 'bold 20px Arial',
      fill: '#00ff00',
      stroke: '#006600',
      strokeThickness: 3,
      align: 'center'
    })
    rewardText.anchor.setTo(0.5, 0.5)

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

  exitToSeaworld () {
    console.log('[Preacher] Returning to seaworld')

    if (this.isTalking) {
      this.isTalking = false
    }

    if (!this.game.mulle.user.Boat.hasCache('#PreacherVisited')) {
      this.game.mulle.user.Boat.addCache('#PreacherVisited')
    }

    this.game.state.start('seaworld')
  }

  /**
   * Check if mission has been given
   * Uses unified mission system from savedata.js
   * @param {number} missionId 
   * @returns {boolean}
   */
  hasMissionGiven (missionId) {
    const user = this.game.mulle.user
    if (!user) return false
    
    // Use unified method if available
    if (user.isMissionGiven) {
      return user.isMissionGiven(missionId)
    }
    
    // Fallback to direct check
    if (user.Missions && user.Missions.GivenMissions) {
      return user.Missions.GivenMissions.includes(missionId)
    }
    
    return false
  }

  /**
   * Get mission completion count
   * Uses unified mission system from savedata.js
   * @param {number} missionId 
   * @returns {number} Completion count (0 if never completed)
   */
  getMissionCompletionCount (missionId) {
    const user = this.game.mulle.user
    if (!user) return 0
    
    // Use unified method if available
    if (user.isMissionCompleted) {
      return user.isMissionCompleted(missionId)
    }
    
    // Fallback to direct check
    if (user.Missions && user.Missions.CompletedMissions) {
      return user.Missions.CompletedMissions[missionId] || 0
    }
    
    return 0
  }

  /**
   * Complete a mission and return new completion count
   * Uses unified mission system from savedata.js
   * @param {number} missionId 
   * @returns {number} New completion count
   */
  completeMission (missionId) {
    const user = this.game.mulle.user
    if (!user) return 0
    
    // Use unified method if available
    if (user.addCompletedMission) {
      return user.addCompletedMission(missionId)
    }
    
    // Fallback to legacy method
    if (user.completeSeaMission) {
      user.completeSeaMission(missionId)
    } else {
      console.warn('[Preacher] No mission completion method available on user')
    }
    
    return this.getMissionCompletionCount(missionId)
  }

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

  addInventoryItem (itemId) {
    const user = this.game.mulle.user
    
    if (user && user.Boat) {
      user.Boat.addCache(itemId)
      console.log('[Preacher] Added item to cache:', itemId)
    }
    
    if (this.game.mulle.seaInventory) {
      this.game.mulle.seaInventory.addItem(itemId.replace('#', ''))
      console.log('[Preacher] Added item to seaInventory:', itemId)
    }
  }

  removeInventoryItem (itemId) {
    if (this.game.mulle.seaInventory) {
      this.game.mulle.seaInventory.removeItem(itemId.replace('#', ''))
      console.log('[Preacher] Removed item from seaInventory:', itemId)
    }
  }

  /**
   * Get a random part from externalParts
   * Original Lingo: getRandomPart(the externalParts of gMulleGlobals)
   * Returns null if no parts available (triggers snack reward instead)
   */
  getRandomPart () {
    const user = this.game.mulle.user
    if (!user || !user.externalParts || user.externalParts.length === 0) {
      console.warn('[Preacher] No externalParts available - will give snacks instead')
      return null  // #NoPart in original Lingo
    }
    
    const randomIndex = Math.floor(Math.random() * user.externalParts.length)
    return user.externalParts[randomIndex]
  }

  /**
   * Give reward for Mission 1 (Bible Delivery)
   * 
   * Original Lingo logic from boat_78:
   * - Completion 1-5: Give boat part (random from externalParts)
   * - Completion 2: ALWAYS give Part 19 (kerkbanken/church pews)
   * - Completion 6+: Give 1000 Belly (snacks)
   * - If no parts available during 1-5: Give 1000 Belly instead
   */
  giveMission1Reward (reward) {
    const user = this.game.mulle.user
    
    console.log('[Preacher] Mission 1 reward given:', reward)
    
    if (reward.type === 'part') {
      // Add part to shop floor (player can pick it up later)
      user.addBoatPart('Quay', reward.id)
      console.log('[Preacher] Awarded Part', reward.id)
    } else if (reward.type === 'snack') {
      // Add snacks (Belly) to inventory
      // Original Lingo: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
      if (!user.SeaInventory) {
        user.SeaInventory = { items: {}, blueprints: {} }
      }

      const itemName = reward.item.replace('#', '')
      if (!user.SeaInventory.items[itemName]) {
        user.SeaInventory.items[itemName] = { nr: 0 }
      }

      if (user.SeaInventory.items[itemName].nr === undefined) {
        user.SeaInventory.items[itemName].nr = 0
      }

      user.SeaInventory.items[itemName].nr += reward.amount

      console.log('[Preacher] Awarded', reward.amount, itemName, '- Total:', user.SeaInventory.items[itemName].nr)
    }
    
    user.save()
  }

  getRewardMessage (reward) {
    if (reward.type === 'part') {
      return 'Onderdeel ' + reward.id + ' ontvangen!'
    } else if (reward.type === 'snack') {
      return reward.amount + ' snacks ontvangen!'
    }
    return 'Beloning ontvangen!'
  }

  // Mission 20 logic is now handled by computePreacherResult() in create().

  getVisitCount () {
    const user = this.game.mulle.user
    if (!user || !user.Boat) return 0
    
    let count = 0
    if (user.Boat.hasCache('#VisitedPreacher')) {
      count = 1
    }
    if (user.Boat.hasCache('#PreacherIntroPlayed')) {
      count = 2
    }
    
    return count
  }

  hasPart172 () {
    const user = this.game.mulle.user
    if (!user || !user.Boat || !user.Boat.Parts) return false
    
    return user.Boat.Parts.includes(172)
  }

  addCacheItem (itemId) {
    const user = this.game.mulle.user
    if (user && user.Boat) {
      user.Boat.addCache(itemId)
      console.log('[Preacher] Added cache item:', itemId)
    }
  }

  update () {
    super.update()
    if (this._needsCompute) {
      this._needsCompute = false
      this._runMissionCompute()
    }
  }

  /**
   * Get weather type (1-4) from global weather state
   * Original Lingo: getType(the weather of gMulleGlobals)
   * 1 = Calm, 2 = Windy, 3 = Rainy, 4 = Stormy
   */
  getWeatherType () {
    const weather = this.game.mulle.weather ||
                    this.game.mulle.user?.weather ||
                    this.game.mulle.SeaMap?.weather ||
                    'clear'

    const weatherMap = {
      'clear': 1,
      'calm': 1,
      'sunny': 1,
      'windy': 2,
      'breezy': 2,
      'rainy': 3,
      'rain': 3,
      'stormy': 4,
      'storm': 4
    }

    if (typeof weather === 'number') {
      return Math.max(1, Math.min(4, weather))
    }

    if (!weather || typeof weather !== 'string') {
      return 1
    }

    return weatherMap[weather.toLowerCase()] || 1
  }

  /**
   * Create sky sprite based on current weather
   * Original Lingo: setSky(the weather of gMulleGlobals)
   * 
   * Sky member names: 00b0XXv0 where XX = 10 + weatherType
   * - Type 1 (calm): 00b011v0
   * - Type 2 (windy): 00b012v0
   * - Type 3 (rainy): 00b013v0
   * - Type 4 (stormy): 00b014v0
   */
  setSky () {
    const weatherType = this.getWeatherType()

    // Try to load Director sky sprite
    this.skySprite = new MulleSprite(this.game, 320, 240)

    // Calculate sky member name
    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`

    // Try boten_00.CXT first
    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)

    // Fallback to 00.CXT
    if (!loaded) {
      loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
    }

    if (loaded) {
      this.game.world.sendToBack(this.skySprite)
      this.game.add.existing(this.skySprite)
      console.log('[Preacher] Sky sprite loaded:', skyMemberName, 'for weather type:', weatherType)
    } else {
      // Fallback: Create simple sky gradient
      console.log('[Preacher] Sky sprite not found, using fallback for weather type:', weatherType)
      this.skySprite.destroy()
      this.skySprite = null
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Create a fallback sky using Phaser graphics
   * @param {number} weatherType - 1=calm, 2=windy, 3=rainy, 4=stormy
   */
  createFallbackSky (weatherType) {
    const skyColors = {
      1: { top: 0x87CEEB, bottom: 0xB0E0E6 },  // Calm - Light blue
      2: { top: 0x6B8BA4, bottom: 0x9DB8C8 },  // Windy - Gray-blue
      3: { top: 0x5A6973, bottom: 0x8899A6 },  // Rainy - Dark gray
      4: { top: 0x3D4852, bottom: 0x5C6B7A }   // Stormy - Dark
    }

    const colors = skyColors[weatherType] || skyColors[1]

    this.skyGraphics = this.game.add.graphics(0, 0)

    // Draw gradient sky (top half only for island scene)
    const steps = 20
    for (let i = 0; i < steps; i++) {
      const t = i / steps
      const color = this.interpolateColor(colors.top, colors.bottom, t)
      const y = i * (240 / steps)
      const h = 240 / steps + 1
      this.skyGraphics.beginFill(color, 1)
      this.skyGraphics.drawRect(0, y, 640, h)
      this.skyGraphics.endFill()
    }

    // Send to back
    this.game.world.sendToBack(this.skyGraphics)

    console.log('[Preacher] Fallback sky created for weather type:', weatherType)
  }

  /**
   * Interpolate between two colors
   * @param {number} color1 - Start color (hex)
   * @param {number} color2 - End color (hex)
   * @param {number} t - Interpolation factor (0-1)
   * @returns {number} Interpolated color
   */
  interpolateColor (color1, color2, t) {
    const r1 = (color1 >> 16) & 0xFF
    const g1 = (color1 >> 8) & 0xFF
    const b1 = color1 & 0xFF

    const r2 = (color2 >> 16) & 0xFF
    const g2 = (color2 >> 8) & 0xFF
    const b2 = color2 & 0xFF

    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)

    return (r << 16) | (g << 8) | b
  }

  shutdown () {
    this.stopAmbientSounds()

    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }

    // Clean up sky sprite/graphics
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    this.preacher = null
    this.foreground = null
    this.boat = null

    super.shutdown()
    console.log('[Preacher] Scene shutdown')
  }
}

export default PreacherState
