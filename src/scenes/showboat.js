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
import { computeShowBoatResult, MISSION_ID as SHOWBOAT_MISSION_ID } from './ShowBoatData'

// Lingo parity: ParentScript 4 - Dir.ls (76/76)
// Audio: 76e002v1 — ShowBoat ambient water/crowd sound
// Transition: "leave" — BehaviorScript 2/6/7 exit markers
// Global: drawBoat — Dir.ls draws the player's boat in the show area
// Inventory: DrivenTimes — showboat/DeleteType.ls tracks propulsion usage
const SHOWBOAT_AMBIENT_SOUND = '76e002v1'
const SHOWBOAT_LEAVE_TRANSITION = 'leave'
const SHOWBOAT_DRAW_BOAT_FN = 'drawBoat'
const SHOWBOAT_DRIVEN_TIMES_ITEM = 'DrivenTimes'

/**
 * Boat show scene - showcase your boat and get rated
 * @extends MulleState
 */
class ShowBoatState extends MulleState {
  preload () {
    super.preload()

    // Load showboat assets
    this.game.load.pack('showboat', 'assets/showboat.json', null, this)

    // Initialize mission manager if not exists
    if (!this.game.mulle.missionManager) {
      this.game.mulle.missionManager = new MissionManager(this.game)
    }
  }

  create () {
    super.create()

    this.boat = null

    // Add showboat audio
    this.game.mulle.addAudio('showboat')

    // === SKY SPRITE ===
    // Original Lingo: setSky(the weather of gMulleGlobals)
    this.setSky()

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
    this.boat = new MulleBuildBoat(this.game, 360, 155, null, true, false)
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
   * Calculate boat score based on funnyFactor.
   * Original Lingo: ParentScript 4 - Dir.ls lines 26-42
   *
   * Scene 76 ONLY uses FunnyFactor. LuxuryFactor belongs in Birgit (scene 77).
   */
  calculateScore () {
    const boat = this.game.mulle.user.Boat

    if (!boat) {
      console.error('[ShowBoat] No boat data found!')
      this.funnyFactor = 0
      this.rating = 1
      return
    }

    // Get funnyFactor from boat properties — Lingo: getProperty(tmpBoat, #FunnyFactor)
    this.funnyFactor = boat.getProperty('funnyfactor', 0)

    // Use Lingo-faithful pure function for rating + medal determination
    const result = computeShowBoatResult(this.funnyFactor)
    this.rating = result.rating
    this._showBoatResult = result

    console.log('[ShowBoat] Score calculated:', {
      funnyFactor: this.funnyFactor,
      rating: this.rating,
      marker: result.marker,
      medal: result.medal
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

    // Award medal if earned — determined by computeShowBoatResult()
    // Original Lingo: addMedal(the boat, 4) when tmpFun > 25
    if (this._showBoatResult && this._showBoatResult.medal !== null) {
      this.awardMedal(this._showBoatResult.medal, 'Meest-blitse-boot-medaille')
    }

    // Mark boat show mission as completed (if missions system exists)
    // Original Lingo: addCompletedMission(the user, 6)
    if (this.game.mulle.missions) {
      this.game.mulle.missions.markAsCompleted(SHOWBOAT_MISSION_ID)
    }

    // Show "continue" prompt after a delay
    this.game.time.events.add(2000, () => {
      this.showContinuePrompt()
    })
  }

  /**
   * Award medal for excellent boat
   * Original Lingo: ParentScript 4 - Dir.ls lines 34-36
   * 
   * Medal 4 = "Meest-blitse-boot-medaille" for funnyFactor > 25 at boat show
   * Medal 6 = "Luxe-medaille" for luxuryFactor > 15 (Prima Trip eligible)
   * 
   * @param {number} medalId - Medal ID (4 or 6)
   * @param {string} medalName - Name of the medal
   */
  awardMedal (medalId, medalName) {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    // Use seaMedals system if available
    if (this.game.mulle.seaMedals) {
      if (!this.game.mulle.seaMedals.hasMedal(medalId)) {
        this.game.mulle.seaMedals.awardMedal(medalId)
        console.log('[ShowBoat] Awarded:', medalName)
        this.showMedalNotification(medalName)
      }
    } else {
      // Fallback to boat medal system
      if (!boat.hasMedal(medalId)) {
        boat.addMedal(medalId)
        console.log('[ShowBoat] Medal awarded:', medalId)
        this.showMedalNotification(medalName)
      }
    }
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

    // Animate medal text
    this.game.add.tween(medalText.scale)
      .to({ x: 1.2, y: 1.2 }, 300, Phaser.Easing.Bounce.Out, true, 0, 2, true)

    // Fade out
    this.game.time.events.add(3000, () => {
      this.game.add.tween(medalText)
        .to({ alpha: 0 }, 500, null, true)
    })
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
      console.log('[ShowBoat] Sky sprite loaded:', skyMemberName, 'for weather type:', weatherType)
    } else {
      // Fallback: Create simple sky gradient
      console.log('[ShowBoat] Sky sprite not found, using fallback for weather type:', weatherType)
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

    // Draw gradient sky (top portion for boat show scene)
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

    console.log('[ShowBoat] Fallback sky created for weather type:', weatherType)
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

    // Clean up sky sprite
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    // Clear actor references
    this.game.mulle.actors.mulle = null
    this.game.mulle.actors.judge = null

    console.log('[ShowBoat] Scene shutdown')
  }
}

/**
 * MissionManager - Handles boat mission tracking and completion
 * Based on Lingo mission system from boat_77 (Birgit's Strand)
 * 
 * Features:
 * - Track given missions (via telephone)
 * - Track completed missions
 * - Check mission prerequisites
 * - Award mission rewards
 * 
 * Missions in boat_77 (Birgit's Strand):
 * - Mission 2: Swimring Delivery (Mail Mission)
 * - Mission 3: DoctorBag Delivery (Mail Mission)
 * - Mission 4: Prima Trip Voorbereiding (Telephone Mission)
 * - Mission 5: Prima Trip Hoofdmissie (Telephone Mission)
 * - Mission 22: MapPiece Delivery (Custom Mission)
 */
class MissionManager {
  constructor (game) {
    this.game = game
    this.user = this.game.mulle.user
    this.missions = this.user.Boat?.Missions || {}
    
    // Temporary flags (reset each session)
    this.tmpRing = false
    this.tmpBag = false
    this.tmpMapPiece = false
    this.tmpStartSuffix = ''
  }

  /**
   * Check if a mission has been given to the player
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  isGiven (missionId) {
    return this.missions[missionId]?.given === true
  }

  /**
   * Check if a mission has been completed
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  isCompleted (missionId) {
    return this.missions[missionId]?.completed === true
  }

  /**
   * Mark a mission as given (received by player)
   * @param {number} missionId - Mission ID
   */
  addGiven (missionId) {
    if (!this.missions[missionId]) {
      this.missions[missionId] = {}
    }
    this.missions[missionId].given = true
    this.missions[missionId].givenAt = Date.now()
    this.save()
    console.log('[MissionManager] Mission', missionId, 'marked as given')
  }

  /**
   * Mark a mission as completed
   * @param {number} missionId - Mission ID
   * @param {Object} reward - Optional reward object
   */
  addCompleted (missionId, reward = null) {
    if (!this.missions[missionId]) {
      this.missions[missionId] = {}
    }
    this.missions[missionId].completed = true
    this.missions[missionId].completedAt = Date.now()
    
    if (reward) {
      this.missions[missionId].reward = reward
    }
    
    this.save()
    console.log('[MissionManager] Mission', missionId, 'marked as completed', reward ? 'with reward' : '')
  }

  /**
   * Get the number of times a mission has been completed
   * @param {number} missionId - Mission ID
   * @returns {number} Completion count
   */
  getCompletionCount (missionId) {
    return this.missions[missionId]?.completionCount || 0
  }

  /**
   * Increment completion count for a mission (for repeatable missions)
   * @param {number} missionId - Mission ID
   */
  incrementCompletionCount (missionId) {
    if (!this.missions[missionId]) {
      this.missions[missionId] = {}
    }
    const count = (this.missions[missionId].completionCount || 0) + 1
    this.missions[missionId].completionCount = count
    this.save()
    return count
  }

  completeSeaMission (missionId) {
    const completionCount = this.completeMission(missionId)
    console.log('[MissionManager] Sea mission', missionId, 'completed', completionCount, 'time(s)')
    return completionCount
  }

  /**
   * Check if player has a specific inventory item
   * @param {string} item - Item name (e.g., '#Swimring', '#DoctorBag')
   * @returns {boolean}
   */
  hasInventoryItem (item) {
    if (!this.user) return false

    if (!this.user.SeaInventory) {
      return false
    }

    const normalizedItem = item.replace(/^#/, '')
    return this.user.SeaInventory.items && this.user.SeaInventory.items[normalizedItem]
  }

  /**
   * Remove item from sea inventory
   * @param {string} item - Item name to remove
   * @returns {boolean}
   */
  removeInventoryItem (item) {
    if (!this.user || !this.user.SeaInventory) return false

    if (!this.user.SeaInventory.items) {
      return false
    }

    const normalizedItem = item.replace(/^#/, '')
    if (this.user.SeaInventory.items[normalizedItem]) {
      delete this.user.SeaInventory.items[normalizedItem]
      this.save()
      console.log('[MissionManager] Removed item from inventory:', item)
      return true
    }

    return false
  }

  /**
   * Add item to sea inventory
   * @param {string} item - Item name to add
   * @param {Object} properties - Item properties (nr, etc.)
   * @returns {boolean}
   */
  addInventoryItem (item, properties = {}) {
    if (!this.user) return false

    if (!this.user.SeaInventory) {
      return false
    }

    if (!this.user.SeaInventory.items) {
      this.user.SeaInventory.items = {}
    }

    this.user.SeaInventory.items[item] = properties
    this.save()
    console.log('[MissionManager] Added item to inventory:', item, properties)
    return true
  }

  /**
   * Add a part to player's boat parts
   * @param {number} partId - Part ID to add
   */
  addPart (partId) {
    const user = this.game.mulle.user
    if (!user.Boat || !user.Boat.Parts) {
      console.error('[MissionManager] No boat parts to add to')
      return
    }
    user.Boat.Parts.push(partId)
    user.save()
    console.log('[MissionManager] Added part to boat:', partId)
  }

  /**
   * Get a random part from external parts (postal gifts)
   * @returns {Object} { partId: number, name: string } or null
   */
  getRandomExternalPart () {
    if (!this.game.mulle.externalParts) {
      console.warn('[MissionManager] externalParts not initialized')
      return null
    }
    
    const availableParts = this.game.mulle.externalParts.calcCurrentlyAvailable('')
    if (availableParts.length === 0) {
      console.warn('[MissionManager] No external parts available')
      return null
    }
    
    const randomPartId = availableParts[Math.floor(Math.random() * availableParts.length)]
    
    return {
      partId: randomPartId,
      name: 'Part ' + randomPartId
    }
  }

  /**
   * Get a random part that player doesn't have
   * @param {number} partId - Specific part ID to give (optional)
   * @returns {number} Part ID
   */
  getRandomPart (partId = null) {
    if (partId !== null) {
      return partId
    }
    
    // Get external parts player doesn't have
    const randomPart = this.getRandomExternalPart()
    if (randomPart) {
      return randomPart.partId
    }
    
    // Fallback to random part from all boat parts
    const allParts = this.game.cache.getJSON('BoatParts')
    const user = this.game.mulle.user
    
    const availableParts = allParts.filter(part => 
      !user.hasPart(part.id)
    )
    
    if (availableParts.length === 0) {
      console.warn('[MissionManager] No parts available')
      return 0
    }
    
    const randomIndex = Math.floor(Math.random() * availableParts.length)
    return availableParts[randomIndex].id
  }

  /**
   * Save missions data
   */
  save () {
    this.game.mulle.user.Boat.Missions = this.missions
    this.game.mulle.user.save()
  }

  /**
   * Check for a specific mission (alias for isGiven)
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  checkForMission (missionId) {
    return this.isGiven(missionId)
  }

  /**
   * Complete a mission with reward
   * @param {number} missionId - Mission ID
   * @param {Object} reward - Reward object (part, medal, etc.)
   */
  completeMission (missionId, reward) {
    this.addCompleted(missionId, reward)
  }
}

export default ShowBoatState
export { MissionManager }
