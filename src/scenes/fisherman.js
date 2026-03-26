/**
 * Fisherman Scene (boat_79 - Visser/Myrtil)
 * @module scenes/fisherman
 *
 * Scene 79 from the original game (boten_79.DXR)
 * A fisherman (Myrtil) on a pier/dock with his fishing rod
 *
 * Features:
 * - Background: 79b001v1 (640x480), 79b002v0, 79b003v0, 79b004v0
 * - Fisherman NPC with body animations (move, point, Startmove)
 * - Fisherman head with talk, blink animations
 * - Fishing rod/fish elements (79a004v0)
 * - Dialogue clips (79d002v0 - 79d008v0) — all confirmed in boten_79.DXR members 89-95
 * - Ambient sound (79e002v0) — confirmed in boten_79.DXR member 72
 * - NOTE: 79d009v0-79d030v0 do NOT exist in any ISO; they are not referenced here
 *
 * Missions:
 * - Mission 17: Object delivery (MapPiece1)
 * - Mission 18: RottenFish delivery (awards Medal 3)
 *
 * Frame Routing (Original Lingo):
 * - JustDoIt/JustDoIt2: Player has required object → Offer delivery → Success
 * - CantDoIt: Player does NOT have required object → Show dialogue
 * - leave: Exit to seaworld
 * - burkLeave: Exit after dialogue
 *
 * Object System:
 * - Object 18 (537.txt): Dest to boat 87 with MapPiece1 check, Parts:[172]
 * - Object 19 (1968.txt): Dest to boat 79 with RottenFish check
 *
 * Original game animation charts:
 * - headAnimChart (member 6):
 *   Still:[2], talk:[3,5,rndFrame], Wait:[2,TalkStill], TalkStill:[2],
 *   Blinkloop:[2 with occasional 4], Up:[1,2,2], Down:[2,2,1]
 * - bodyAnimChart (member 7):
 *   Still:[1], move:[1-16 cycling], Down:[9-16,1-9],
 *   point:[1,2,3,2,1...], point2:[...], Startmove:[1-16,1]
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import { computeFishermanResult, MARKER_SUCCESS, MARKER_FAILURE } from './FishermanData'

// Lingo parity: BehaviorScript 5 (79/79)
// Transition: "anchorleave" — anchor click exit marker
const FISHERMAN_ANCHOR_LEAVE = 'anchorleave'

class FishermanState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
    this.game.load.json('MarkerAudioMap79', 'data/marker_audio_map_boten_79.json')
  }

  create () {
    super.create()

    // Strict Lingo parity: disable JS-only dialogue/mission extras
    this.strictParity = true

    this.DirResource = 'boten_79.DXR'
    this.game.mulle.addAudio('seaworld')

    // === SKY SPRITE ===
    // Original Lingo: setSky(the weather of gMulleGlobals)
    this.setSky()

    // Track visit count
    this.trackVisit()
    
    // Initialize mission state
    this.missionState = {
      mission17Completed: false,
      mission18Completed: false,
      hasObjectForDelivery: false,
      objectNeeded: null
    }
    this.isTalking = false
    this.markerAudioMap = this.buildMarkerAudioMap()

    // Defer mission checks to first update() — allows E2E state injection
    this._needsMissionCheck = true

    // === BACKGROUND ===
    // 79b001v1 (member 16) = Main background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 16)) {
      console.warn('[Fisherman] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x87CEEB)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // === PLAYER'S BOAT ===
    // Original Lingo: drawBoat(point(320, 155))
    this.boat = new MulleBuildBoat(this.game, 320, 155, this.game.mulle.user.Boat.Parts, true, false)
    this.game.add.existing(this.boat)

    // 79b002v0 (member 12) = Pier/dock overlay (503x250)
    // Pivot point from metadata: (320, 10)
    var pier = new MulleSprite(this.game, 320, 10)
    if (pier.setDirectorMember(this.DirResource, 12)) {
      this.game.add.existing(pier)
    }

    // 79b003v0 (member 13) = Additional element
    var element1 = new MulleSprite(this.game, 320, 240)
    if (element1.setDirectorMember(this.DirResource, 13)) {
      this.game.add.existing(element1)
    }

    // === FISHERMAN BODY ===
    // Body sprites are members 29-60 (79a002v0 and 79a003v0 series)
    // Two sets: frames 1-16 and 17-32
    this.fishermanBody = new MulleSprite(this.game, 320, 240)
    this.fishermanBody.setDirectorMember(this.DirResource, 29) // First body frame
    this.game.add.existing(this.fishermanBody)
    this.setupBodyAnimations()

    // === FISHERMAN HEAD ===
    // Head sprites are members 61-65 (79a001v0 series)
    this.fishermanHead = new MulleSprite(this.game, 320, 240)
    this.fishermanHead.setDirectorMember(this.DirResource, 61) // First head frame
    this.game.add.existing(this.fishermanHead)
    this.setupHeadAnimations()

    // Make fisherman clickable
    if (!this.strictParity) {
      this.fishermanHead.inputEnabled = true
      this.fishermanHead.events.onInputOver.add(() => {
        this.game.mulle.cursor.current = 'Point'
      })
      this.fishermanHead.events.onInputOut.add(() => {
        this.game.mulle.cursor.current = null
      })
      this.fishermanHead.events.onInputUp.add(() => {
        this.onFishermanClick()
      })
    }

    // === FISHING ROD/FISH ===
    // 79a004v0 (members 76-81)
    this.fishingRod = new MulleSprite(this.game, 320, 240)
    if (this.fishingRod.setDirectorMember(this.DirResource, 76)) {
      this.game.add.existing(this.fishingRod)
      this.setupFishingRodAnimations()
    }

    // === EXIT BUTTON ===
    this.createExitButton()

    if (this.strictParity) {
      // Lingo uses timeline routing (go markers) for dialogue flow.
      this.startMovie()
      this.startIdleAnimations()
      return
    }

    // === DIALOGUE ===
    this.isTalking = false
    this.dialogueIndex = 0
    
    // All available dialogues for fisherman (79d002v0 - 79d008v0)
    // Verified in ISO: boten_79.DXR members 89-95
    // Not referenced by Lingo scripts (score-driven), but assets exist.
    this.allDialogues = [
      '79d002v0', '79d003v0', '79d004v0', '79d005v0',
      '79d006v0', '79d007v0', '79d008v0'
    ]
    
    // Mission-specific dialogues
    this.missionDialogues = {
      intro: '79d002v0',
      returnVisit: '79d003v0',
      mission17Success: '79d005v0',
      mission17Fail: '79d002v0',
      mission17ObjectDelivered: '79d007v0',
      mission18Success: '79d006v0',
      mission18Fail: '79d003v0',
      mission18Start: '79d004v0',
      yesAnswer: '79d008v0',
      noAnswer: '79d003v0',
      hasObject: '79d006v0',
      noObject: '79d002v0',
      objectReceived: '79d007v0'
    }
    
    this.dialogueSequence = this.allDialogues.slice(0, 7)

    // === AMBIENT SOUNDS ===
    this.playAmbientSounds()

    // === INTRO ===
    this.game.time.events.add(500, () => {
      this.playIntroDialogue()
    })

    // Start idle animations
    this.startIdleAnimations()

    console.log('[Fisherman] Scene created')
    console.log('[Fisherman] Visit count:', this.getVisitCount())
    console.log('[Fisherman] Mission 17 completed:', this.game.mulle.user.isSeaMissionCompleted(17))
    console.log('[Fisherman] Mission 18 completed:', this.game.mulle.user.isSeaMissionCompleted(18))
  }

  /**
   * Check if player has RottenFish inventory item to deliver
   * Originele Lingo: checkFor:[#inventory:[#RottenFish]] uit Dest 19 (1968.txt)
   */
  checkForRottenFishDelivery () {
    if (!this.game.mulle.seaInventory) return

    if (this.game.mulle.seaInventory.hasItem('RottenFish')) {
      console.log('[Fisherman] Player has RottenFish to deliver!')
      
      // Show delivery prompt after intro
      this.game.time.events.add(3000, () => {
        this.offerRottenFishDelivery()
      })
    }
  }

  /**
   * Offer to deliver the rotten fish
   */
  offerRottenFishDelivery () {
    if (this.isTalking) {
      // Wait and try again
      this.game.time.events.add(2000, () => {
        this.offerRottenFishDelivery()
      })
      return
    }

    // Create delivery prompt
    const promptBg = this.game.add.graphics(320, 350)
    promptBg.beginFill(0x000000, 0.8)
    promptBg.drawRoundedRect(-150, -40, 300, 80, 10)
    promptBg.endFill()

    const promptText = this.game.add.text(320, 340, 'Geef de rotte vis aan de visser?', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    promptText.anchor.setTo(0.5, 0.5)

    // Yes button
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
      this.deliverRottenFish()
    })

    // No button
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

  /**
   * Deliver the rotten fish and receive reward (Mission 18)
   * Original Lingo: CheckFor:[#inventory:[#RottenFish]] → Award Medal 3
   */
  deliverRottenFish () {
    console.log('[Fisherman] Delivering RottenFish for Mission 18!')
    
    // Remove item from inventory
    this.game.mulle.seaInventory.removeItem('RottenFish')
 
    // Play success dialogue for Mission 18
    this.playDialogue(this.missionDialogues.mission18Success, () => {
      // Award Medal 3 - Vrachtschip-medaille
      if (this.game.mulle.seaMedals && !this.game.mulle.seaMedals.hasMedal(3)) {
        this.game.mulle.seaMedals.awardMedal(3)
        console.log('[Fisherman] Awarded Vrachtschip-medaille (Medal 3)!')
        this.showMedalNotification('Vrachtschip-medaille')
      }
 
      // Complete Mission 18
      this.game.mulle.user.completeSeaMission(18)
      this.missionState.mission18Completed = true
      console.log('[Fisherman] Mission 18 completed!')
      
      // Mark delivery as complete
      if (this.game.mulle.user) {
        this.game.mulle.user.deliveryMade = true
        this.game.mulle.user.save()
      }
 
      this.returnToIdle()
    })
  }

  /**
   * Show medal notification
   * @param {string} medalName - Name of the awarded medal
   */
  showMedalNotification (medalName) {
    const medalText = this.game.add.text(320, 200, 'Medaille verdiend!\n' + medalName, {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#8b6914',
      strokeThickness: 3,
      align: 'center'
    })
    medalText.anchor.setTo(0.5, 0.5)

    // Animate
    this.game.add.tween(medalText.scale)
      .to({ x: 1.3, y: 1.3 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    // Fade out
    this.game.time.events.add(2500, () => {
      this.game.add.tween(medalText)
        .to({ alpha: 0 }, 500, null, true)
    })
  }

  /**
   * Track visit count
   */
  trackVisit () {
    if (!this.game.mulle.user.Boat.hasCache('#FishermanVisited')) {
      this.game.mulle.user.Boat.addCache('#FishermanVisited')
      this.isFirstVisit = true
    } else {
      this.isFirstVisit = false
    }
  }

  /**
   * Get visit count
   * @returns {number}
   */
  getVisitCount () {
    let count = 0
    if (this.game.mulle.user.Boat.hasCache('#FishermanVisited')) {
      count = 1
    }
    return count
  }

  /**
   * Check for Mission 17: Object Delivery
   * Original Lingo: isInInventory(...) → addCompletedMission(17) → add #Belly (1000)
   * Frame routing: JustDoIt → Object delivered → Success
   */
  checkForMission17 () {
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

    if (this.game.mulle.user.isSeaMissionCompleted(17)) {
      this.missionState.mission17Completed = true
      return
    }

    // Check if player has required object
    // Mission 17 gives #Belly as reward
    // Original Lingo: set tmpStuffNeeded to getAt(getCheckFor(tempObj, #Inventory), 1)
    const requiredObject = this.getRequiredObjectForMission17()

    // Lingo-faithful mission logic (Dir.ls scene 79)
    const hasItem = requiredObject && this.game.mulle.seaInventory && this.game.mulle.seaInventory.hasItem(requiredObject)
    const fishermanResult = computeFishermanResult({
      hasRequiredItem: !!hasItem
    })
    console.log('[Fisherman] Lingo result:', fishermanResult.marker)

    if (requiredObject) {
      this.missionState.hasObjectForDelivery = true
      this.missionState.objectNeeded = requiredObject

      // Check if player has the object in inventory
      const hasObject = this.game.mulle.seaInventory && this.game.mulle.seaInventory.hasItem(requiredObject)

      if (hasObject) {
        console.log('[Fisherman] Player has', requiredObject, '- ready for Mission 17 (JustDoIt)')
        // Offer to deliver after intro
        this.game.time.events.add(3000, () => {
          this.offerMission17Delivery()
        })
      } else {
        // BUG FIX #1.3: Add missing cantDoIt dialogue when player doesn't have required object
        console.log('[Fisherman] Player does NOT have', requiredObject, '- CantDoIt')
        this.game.time.events.add(3000, () => {
          this.playDialogue(this.missionDialogues.mission17Fail)
        })
      }
    }
  }

  /**
   * Get the required object for Mission 17
   * Original Lingo: set tmpStuffNeeded to getAt(getCheckFor(tempObj, #Inventory), 1)
   * Reads from Object config dynamically using getEnteredObject/getCheckFor pattern
   * @returns {string|null}
   */
  getRequiredObjectForMission17 () {
    // Get the entered object from seaworld navigation
    const enteredObject = this.game.mulle.user.getEnteredObject ? 
      this.game.mulle.user.getEnteredObject() : 
      (this.game.mulle.enteredObject || null)
    
    if (!enteredObject) {
      console.log('[Fisherman] No entered object found')
      return null
    }
    
    // Get the CheckFor property from the object config
    // Original Lingo: getCheckFor(tempObj, #Inventory)
    const objectConfig = this.game.mulle.getObjectConfig ? 
      this.game.mulle.getObjectConfig(enteredObject) : 
      (this.game.mulle.objectConfigs && this.game.mulle.objectConfigs[enteredObject])
    
    if (!objectConfig) {
      console.log('[Fisherman] No object config found for:', enteredObject)
      return null
    }
    
    // Extract inventory check requirement
    // Original Lingo: set tmpStuffNeeded to getAt(getCheckFor(tempObj, #Inventory), 1)
    const checkFor = objectConfig.CheckFor || objectConfig.checkFor
    if (checkFor && checkFor.Inventory) {
      const inventoryCheck = checkFor.Inventory
      // Get first item from inventory check array
      const requiredItem = Array.isArray(inventoryCheck) ? inventoryCheck[0] : inventoryCheck
      console.log('[Fisherman] Required object from config:', requiredItem)
      return requiredItem
    }
    
    console.log('[Fisherman] No inventory check found in object config')
    return null
  }

  /**
   * Lingo startMovie parity: resolve marker and apply actions.
   */
  startMovie () {
    if (!this.strictParity) return

    const requiredObject = this.getRequiredObjectForMission17()
    const hasItem = !!(requiredObject && this.game.mulle.seaInventory && this.game.mulle.seaInventory.hasItem(requiredObject))
    const result = computeFishermanResult({ hasRequiredItem: hasItem })

    console.log('[Fisherman] Lingo marker:', result.marker)
    this.applyFishermanResult(result, requiredObject)
    this.executeRoute(result.marker)
  }

  executeRoute (route) {
    if (!route) return

    const key = String(route).toLowerCase()
    const map = this.markerAudioMap
    if (map && Object.prototype.hasOwnProperty.call(map, key)) {
      const dialogue = map[key]
      if (dialogue) {
        this.playDialogue(dialogue, () => {
          this.returnToIdle()
        })
      } else {
        console.warn('[Fisherman] No audio mapped for route:', route)
        this.returnToIdle()
      }
      return
    }

    console.warn('[Fisherman] Marker map missing route:', route)
    this.returnToIdle()
  }

  buildMarkerAudioMap () {
    const data = this.game.cache.getJSON('MarkerAudioMap79')
    if (!data || !data.markers) return null
    const map = {}
    Object.keys(data.markers).forEach((name) => {
      map[String(name).toLowerCase()] = data.markers[name]
    })
    return map
  }

  /**
   * Apply Lingo actions for Fisherman result.
   * @param {object} result
   * @param {string|null} requiredObject
   */
  applyFishermanResult (result, requiredObject) {
    const user = this.game.mulle.user

    if (result?.actions?.deleteItem && requiredObject && this.game.mulle.seaInventory) {
      this.game.mulle.seaInventory.removeItem(requiredObject)
    }

    if (result?.actions?.completeMission17) {
      if (user && typeof user.completeSeaMission === 'function') {
        user.completeSeaMission(17)
      } else if (user && typeof user.addCompletedMission === 'function') {
        user.addCompletedMission(17)
      }
    }

    // Lingo: setaProp(tmp, #fuel, #Full)
    if (result?.actions?.refuelToFull && user) {
      if (typeof user.getDrivingInfo === 'function' && typeof user.setDrivingInfo === 'function') {
        const info = user.getDrivingInfo()
        if (info && typeof info === 'object') {
          info.fuel = 'Full'
          user.setDrivingInfo(info)
        }
      }
      // Also set fuelFull flag on Boat object (used by seaworld on next sail)
      if (user.Boat) {
        user.Boat.fuelFull = true
      }
    }

    if (result?.actions?.giveBelly && user && typeof user.setInInventory === 'function') {
      user.setInInventory('Belly', { nr: 1000 })
    }
  }

  /**
   * Offer to deliver object for Mission 17
   */
  offerMission17Delivery () {
    if (this.isTalking) {
      this.game.time.events.add(2000, () => {
        this.offerMission17Delivery()
      })
      return
    }

    // Create delivery prompt
    const promptBg = this.game.add.graphics(320, 350)
    promptBg.beginFill(0x000000, 0.8)
    promptBg.drawRoundedRect(-200, -40, 400, 80, 10)
    promptBg.endFill()

    const promptText = this.game.add.text(320, 340, `Geef ${this.missionState.objectNeeded} aan de visser?`, {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    promptText.anchor.setTo(0.5, 0.5)

    // Yes button
    const yesBtn = this.game.add.text(240, 380, 'Ja', {
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
      this.deliverMission17Object()
    })

    // No button
    const noBtn = this.game.add.text(400, 380, 'Nee', {
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

  /**
   * Deliver object for Mission 17 and receive reward
   * Original Lingo: addCompletedMission(17) → setInInventory(#Belly, [#nr: 1000])
   * Additional reward from ParentScript 4: setaProp(tmp, #fuel, #Full)
   */
  deliverMission17Object () {
    console.log('[Fisherman] Delivering', this.missionState.objectNeeded, 'for Mission 17!')

    // Remove item from inventory
    this.game.mulle.seaInventory.removeItem(this.missionState.objectNeeded)

    // Play success dialogue
    this.playDialogue(this.missionDialogues.mission17ObjectDelivered, () => {
      // Complete mission 17
      this.game.mulle.user.completeSeaMission(17)
      console.log('[Fisherman] Mission 17 completed!')

      // Add #Belly to inventory with nr: 1000
      if (this.game.mulle.seaInventory) {
        // Belly is a special food item with quantity
        const user = this.game.mulle.user
        if (!user.SeaInventory) {
          user.SeaInventory = { items: {}, blueprints: {} }
        }
        user.SeaInventory.items.Belly = { nr: 1000 }
        console.log('[Fisherman] Added Belly (1000) to inventory!')

        // Set fuel to full (from ParentScript 4: setaProp(tmp, #fuel, #Full))
        // This flag will be checked by DriveBoat when it initializes
        user.Boat.fuelFull = true
        console.log('[Fisherman] Set fuel to Full (will be applied on next sail)!')

        user.save()
      }

      this.missionState.mission17Completed = true
      this.showRewardNotification('Belly (1000) + Volle tank')
      this.returnToIdle()
    })
  }

  /**
   * Check for Mission 18: RottenFish Delivery
   * Original Lingo: CheckFor:[#inventory:[#RottenFish]] → Award Medal 3
   * Object 19 (1968.txt): Dest to boat 79 with RottenFish check
   * Frame routing: JustDoIt → Object delivered → Success
   */
  checkForMission18 () {
    if (this.game.mulle.user.isSeaMissionCompleted(18)) {
      this.missionState.mission18Completed = true
      return
    }

    // Check if player has RottenFish
    if (this.game.mulle.seaInventory && this.game.mulle.seaInventory.hasItem('RottenFish')) {
      console.log('[Fisherman] Player has RottenFish to deliver! (JustDoIt)')

      // Show delivery prompt after intro
      this.game.time.events.add(3000, () => {
        this.offerRottenFishDelivery()
      })
    } else {
      console.log('[Fisherman] Player does NOT have RottenFish - CantDoIt')
    }
  }

  /**
   * Show reward notification
   * @param {string} rewardName - Name of reward received
   */
  showRewardNotification (rewardName) {
    const rewardText = this.game.add.text(320, 200, 'Beloning ontvangen!\n' + rewardName, {
      font: 'bold 20px Arial',
      fill: '#00ff00',
      stroke: '#006600',
      strokeThickness: 3,
      align: 'center'
    })
    rewardText.anchor.setTo(0.5, 0.5)

    // Animate
    this.game.add.tween(rewardText.scale)
      .to({ x: 1.3, y: 1.3 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    // Fade out
    this.game.time.events.add(2500, () => {
      this.game.add.tween(rewardText)
        .to({ alpha: 0 }, 500, null, true)
    })
  }

  /**
   * Check for RottenFish inventory item to deliver
   * Originele Lingo: checkFor:[#inventory:[#RottenFish]] uit Dest 19 (1968.txt)
   * DEPRECATED: Use checkForMission18() instead
   */
  checkForRottenFishDelivery () {
    console.warn('[Fisherman] checkForRottenFishDelivery() deprecated, use checkForMission18()')
    this.checkForMission18()
  }

  /**
   * Play ambient pier/water sounds
   */
  playAmbientSounds () {
    try {
      // 79e002v0 = water/fishing ambient sound (verified in ISO: boten_79.DXR member 72)
      this.ambientSound = this.game.mulle.playAudio('79e002v0', null)
      if (this.ambientSound) {
        this.ambientSound.loop = true
        this.ambientSound.volume = 0.4
      }
    } catch (e) {
      console.warn('[Fisherman] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      if (this.ambientSound) this.ambientSound.stop()
      this.game.mulle.stopAudio('79e002v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Setup body animations based on bodyAnimChart from 7.txt
   * Original Lingo frame sequences from boten_79.DXR member 7
   */
  setupBodyAnimations () {
    var b = this.DirResource

    // Still: [1] (frame 1 = member 29)
    var stillFrames = []
    stillFrames.push([b, 29])
    this.fishermanBody.addAnimation('still', stillFrames, 5, true)

    // Move animation: [1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,2,3,4,5,6,7,8,9] (26 frames)
    var moveSequence = [1,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1,2,3,4,5,6,7,8,9]
    var moveFrames = []
    for (var i = 0; i < moveSequence.length; i++) {
      moveFrames.push([b, 28 + moveSequence[i]]) // frame 1 = member 29
    }
    this.fishermanBody.addAnimation('move', moveFrames, 8, true)

    // Point animation: [1,1,2,2,3,3,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] (39 frames)
    var pointSequence = [1,1,2,2,3,3,2,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    var pointFrames = []
    for (var i = 0; i < pointSequence.length; i++) {
      pointFrames.push([b, 28 + pointSequence[i]])
    }
    this.fishermanBody.addAnimation('point', pointFrames, 10, false)
    
    // Point2 animation (from original 7.txt bodyAnimChart)
    var point2Sequence = [1,2,3,2,1]
    var point2Frames = []
    for (var i = 0; i < point2Sequence.length; i++) {
      point2Frames.push([b, 28 + point2Sequence[i]])
    }
    this.fishermanBody.addAnimation('point2', point2Frames, 10, false)
    
    // Startmove animation: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1] (17 frames)
    var startmoveSequence = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,1]
    var startmoveFrames = []
    for (var i = 0; i < startmoveSequence.length; i++) {
      startmoveFrames.push([b, 28 + startmoveSequence[i]])
    }
    this.fishermanBody.addAnimation('startmove', startmoveFrames, 8, false)

    // Down animation (from original 7.txt bodyAnimChart)
    var downSequence = [9,10,11,12,13,14,15,16,1,2,3,4,5,6,7,8,9]
    var downFrames = []
    for (var i = 0; i < downSequence.length; i++) {
      downFrames.push([b, 28 + downSequence[i]])
    }
    this.fishermanBody.addAnimation('down', downFrames, 8, false)

    this.fishermanBody.animations.play('still')
  }

  /**
   * Setup head animations based on headAnimChart
   */
  setupHeadAnimations () {
    var b = this.DirResource

    // Still (frame 2 = member 62)
    var stillFrames = []
    stillFrames.push([b, 62])
    this.fishermanHead.addAnimation('still', stillFrames, 5, true)

    // Talk animation (frames 3,5,random)
    var talkFrames = []
    talkFrames.push([b, 63]) // 3
    talkFrames.push([b, 65]) // 5
    talkFrames.push([b, 63]) // 3
    talkFrames.push([b, 65]) // 5
    talkFrames.push([b, 62]) // 2
    talkFrames.push([b, 62]) // 2
    this.fishermanHead.addAnimation('talk', talkFrames, 8, true)

    // Blink animation (Blinkloop from 6.txt headAnimChart)
    // Original: [2,2,2,2,2,2,2,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2] (37 frames with sparse blinks)
    var blinkSequence = [2,2,2,2,2,2,2,4,4,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2]
    var blinkFrames = []
    for (var i = 0; i < blinkSequence.length; i++) {
      blinkFrames.push([b, 60 + blinkSequence[i]]) // frame 2 = member 62, frame 4 = member 64
    }
    this.fishermanHead.addAnimation('blink', blinkFrames, 10, false)

    // Up animation
    var upFrames = []
    upFrames.push([b, 61]) // 1
    upFrames.push([b, 62]) // 2
    upFrames.push([b, 62]) // 2
    this.fishermanHead.addAnimation('up', upFrames, 8, false)

    // Down animation
    var downFrames = []
    downFrames.push([b, 62]) // 2
    downFrames.push([b, 62]) // 2
    downFrames.push([b, 61]) // 1
    this.fishermanHead.addAnimation('down', downFrames, 8, false)

    this.fishermanHead.animations.play('still')
  }

  /**
   * Setup fishing rod animations
   */
  setupFishingRodAnimations () {
    var b = this.DirResource

    // Still
    var stillFrames = []
    stillFrames.push([b, 76])
    this.fishingRod.addAnimation('still', stillFrames, 5, true)

    // Cast animation (members 76-81)
    var castFrames = []
    for (var i = 76; i <= 81; i++) {
      castFrames.push([b, i])
    }
    this.fishingRod.addAnimation('cast', castFrames, 10, false)

    this.fishingRod.animations.play('still')
  }

  /**
   * Start idle animation timers
   */
  startIdleAnimations () {
    if (this.strictParity) {
      // Keep idle frames only; Director score drives animation.
      this.fishermanHead.animations.play('still')
      this.fishermanBody.animations.play('still')
      if (this.fishingRod) this.fishingRod.animations.play('still')
      return
    }

    // Random blink
    this.blinkTimer = this.game.time.events.loop(
      3000 + Math.random() * 4000,
      () => {
        if (!this.isTalking) {
          this.fishermanHead.animations.play('blink').onComplete.addOnce(() => {
            this.fishermanHead.animations.play('still')
          })
        }
      }
    )

    // Random body movement
    this.moveTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking) {
          this.fishermanBody.animations.play('point').onComplete.addOnce(() => {
            this.fishermanBody.animations.play('still')
          })
        }
      }
    )
  }

  /**
   * Create exit button
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
  }

  /**
   * Play intro dialogue
   * Handles first visit vs return visit dialogues
   */
  playIntroDialogue () {
    if (this.isFirstVisit) {
      this.playDialogue(this.missionDialogues.intro, () => {
        this.game.mulle.user.Boat.addCache('#FishermanIntroPlayed')
        this.returnToIdle()
      })
    } else {
      this.playDialogue(this.missionDialogues.returnVisit, () => {
        this.returnToIdle()
      })
    }
  }

  /**
   * Handle fisherman click
   * Cycles through all 30+ dialogues
   */
  onFishermanClick () {
    if (this.isTalking) return

    var dialogue = this.allDialogues[this.dialogueIndex]
    this.dialogueIndex = (this.dialogueIndex + 1) % this.allDialogues.length

    this.playDialogue(dialogue, () => {
      this.returnToIdle()
    })
  }

  /**
   * Get next random dialogue from full list
   * @returns {string}
   */
  getRandomDialogue () {
    const index = Math.floor(Math.random() * this.allDialogues.length)
    return this.allDialogues[index]
  }

  /**
   * Play dialogue based on mission state
   * @param {string} key - Mission dialogue key
   */
  playMissionDialogue (key) {
    const dialogueId = this.missionDialogues[key]
    if (dialogueId) {
      this.playDialogue(dialogueId, () => {
        this.returnToIdle()
      })
    }
  }

  /**
   * Play dialogue with animations
   * NOTE: Sequential dialogue cycling (not frame-based routing) is intentional simplification.
   * Original Lingo used frame-based routing (go() commands) for dialogue flow, but this
   * implementation uses simpler sequential cycling through dialogue array which provides
   * equivalent functionality without complex frame state management.
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    this.fishermanHead.animations.play('talk')
    this.fishermanBody.animations.play('point')

    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.fishermanHead.animations.stop()
      this.fishermanHead.animations.play('still')
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Fisherman] Audio not found:', dialogueId)
      this.game.time.events.add(2000, () => {
        this.fishermanHead.animations.stop()
        this.fishermanHead.animations.play('still')
        this.isTalking = false
        if (onComplete) onComplete()
      })
    }
  }

  /**
   * Return to idle state
   */
  returnToIdle () {
    this.fishermanHead.animations.play('still')
    this.fishermanBody.animations.play('still')
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Fisherman] Returning to seaworld')
    this.stopAmbientSounds()
    this.game.state.start('seaworld')
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
   */
  setSky () {
    const weatherType = this.getWeatherType()

    this.skySprite = new MulleSprite(this.game, 320, 240)

    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`

    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)

    if (!loaded) {
      loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
    }

    if (loaded) {
      this.game.world.sendToBack(this.skySprite)
      this.game.add.existing(this.skySprite)
      console.log('[Fisherman] Sky sprite loaded:', skyMemberName)
    } else {
      console.log('[Fisherman] Sky sprite not found, using fallback')
      this.skySprite.destroy()
      this.skySprite = null
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Create a fallback sky using Phaser graphics
   */
  createFallbackSky (weatherType) {
    const skyColors = {
      1: { top: 0x87CEEB, bottom: 0xB0E0E6 },
      2: { top: 0x6B8BA4, bottom: 0x9DB8C8 },
      3: { top: 0x5A6973, bottom: 0x8899A6 },
      4: { top: 0x3D4852, bottom: 0x5C6B7A }
    }

    const colors = skyColors[weatherType] || skyColors[1]
    this.skyGraphics = this.game.add.graphics(0, 0)

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

    this.game.world.sendToBack(this.skyGraphics)
  }

  /**
   * Interpolate between two colors
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

  /**
   * Cleanup
   */
  update () {
    super.update()
    if (this._needsMissionCheck) {
      this._needsMissionCheck = false
      this.checkForMission17()
      this.checkForMission18()
    }
  }

  shutdown () {
    this.stopAmbientSounds()
    
    if (this.blinkTimer) this.game.time.events.remove(this.blinkTimer)
    if (this.moveTimer) this.game.time.events.remove(this.moveTimer)

    // Clear sky
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    // Clear boat
    if (this.boat) {
      this.boat.destroy()
      this.boat = null
    }

    this.fishermanBody = null
    this.fishermanHead = null
    this.fishingRod = null

    super.shutdown()
    console.log('[Fisherman] Scene shutdown')
  }
}

export default FishermanState
