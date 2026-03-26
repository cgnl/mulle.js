/**
 * George/Erson scene (scene 80)
 * @module scenes/george
 *
 * Scene 80 from the boat game (boten_80.DXR) - George (Erson).
 *
 * Mission Logic (sequential if-blocks, last write wins):
 *   Block A: M19 completed       → "story"
 *   Block B: M7 given            → "CantDoiT"; +Diary → "JustDoitDiary"
 *   Block C: M19 given           → has MapPiece2 → "Story"; else → "JustDoitMap"
 *   Block D: M18 NOT completed   → "nomission"
 *   Block E: marker VOID         → "Story"
 *
 * Markers: "story", "CantDoiT", "JustDoitDiary", "Story", "JustDoitMap", "nomission"
 *
 * Features:
 * - George NPC with dialogue
 * - Mission-based dialogues
 * - Boat display (small hull at 200,190 or medium/large at 280,170)
 * - Weather-based sky
 * - Exit button to seaworld
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import { computeGeorgeResult } from './GeorgeData'

// Lingo parity: BehaviorScripts (80/80)
// Transitions from original Director score:
//   "Story1" (BehaviorScript 11), "Story2" (BehaviorScript 10),
//   "leave" (BehaviorScript 8), "story2" (BehaviorScript 6),
//   "story3" (BehaviorScript 13)
const GEORGE_TRANSITIONS = ['Story1', 'Story2', 'leave', 'story2', 'story3']

class GeorgeState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_80.DXR'
    this.game.mulle.addAudio('seaworld')

    // === SKY ===
    this.setSky()

    // === MISSION LOGIC ===
    this.missionMarker = this.processMissions()

    // === BACKGROUND ===
    // Director score uses member 17 (80b001v1) as the base background.
    const background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 17)) {
      console.warn('[George] Background sprite not found, using fallback')
      background.destroy()
      this.createFallbackBackground()
    } else {
      this.game.add.existing(background)
    }

    // === BOAT DISPLAY ===
    this.drawBoatInScene()

    // === GEORGE NPC ===
    // Create George sprite (reusing assets, similar to Viola structure)
    this.createGeorgeNPC()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    this.game.time.events.add(500, () => {
      this.playMissionDialogue()
    })

    console.log('[George] Scene created - George/Erson (scene 80)')
  }

  /**
   * Create George NPC sprite
   * Uses basic sprite for now - can be enhanced with animations later
   */
  createGeorgeNPC () {
    // George sprite - using a placeholder member
    this.george = new MulleSprite(this.game, 400, 300)
    
    // Try to load George sprite (may need adjustment based on actual assets)
    if (!this.george.setDirectorMember(this.DirResource, 15)) {
      // Fallback: create a simple rectangle for George
      this.george.destroy()
      this.createGeorgeFallback()
      return
    }
    
    this.game.add.existing(this.george)
    
    // Make George clickable
    this.george.inputEnabled = true
    this.george.input.useHandCursor = true
    this.george.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.george.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.george.events.onInputUp.add(() => {
      this.onGeorgeClick()
    })
  }

  /**
   * Create fallback George when sprite not available
   */
  createGeorgeFallback () {
    const graphics = this.game.add.graphics(400, 300)
    graphics.beginFill(0x8B4513) // Brown color for farmer
    graphics.drawRect(-30, -60, 60, 120)
    graphics.endFill()
    
    graphics.inputEnabled = true
    graphics.events.onInputUp.add(() => {
      this.onGeorgeClick()
    })
    
    this.george = graphics
  }

  /**
   * Handle click on George
   */
  onGeorgeClick () {
    if (this.isTalking) return
    
    // Play a generic dialogue
    const dialogues = ['80d007v0', '80d008v0', '80d009v0']
    const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)]
    
    this.playDialogue(dialogue)
  }

  /**
   * Play a dialogue clip
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true
    
    const audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })
    
    if (!audio) {
      console.warn('[George] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Process missions using GeorgeData pure-function module.
   *
   * Gathers state, delegates to computeGeorgeResult(), and applies
   * side-effects based on returned action flags.
   *
   * @returns {string} Mission marker
   */
  processMissions () {
    const user = this.game.mulle.user

    // --- gather state ---
    const isMission19Completed = user.isMissionCompleted(19) > 0
    const isMission7Given = user.isMissionGiven(7) > 0
    const hasDiary = !!user.getFromInventory('#Diary')
    const isMission19Given = user.isMissionGiven(19) > 0
    const hasMapPiece2 = !!user.getFromInventory('#MapPiece2')
    const isMission18Completed = user.isMissionCompleted(18) > 0

    // --- pure computation (GeorgeData) ---
    const result = computeGeorgeResult({
      isMission19Completed,
      isMission7Given,
      hasDiary,
      isMission19Given,
      hasMapPiece2,
      isMission18Completed
    })

    // Store full result for debugging / other methods
    this.georgeResult = result
    console.log('[George] computeGeorgeResult:', JSON.stringify(result))

    // --- apply side-effects based on action flags ---
    if (result.actions.deleteDiary) {
      user.deleteFromInventory('#Diary')
      console.log('[George] Diary deleted')
    }
    if (result.actions.completeMission7) {
      user.addCompletedMission(7)
      console.log('[George] Mission 7 completed')
    }
    if (result.actions.giveMapPiece2) {
      user.setInInventory('#MapPiece2', {})
      console.log('[George] MapPiece2 given')
    }
    if (result.actions.completeMission19) {
      user.addCompletedMission(19)
      console.log('[George] Mission 19 completed')
    }
    if (result.actions.completeMission18) {
      user.addCompletedMission(18)
      console.log('[George] Mission 18 completed')
    }
    if (result.actions.giveMission7) {
      user.addGivenMission(7)
      console.log('[George] Mission 7 given')
    }

    return result.marker
  }

  /**
   * Play dialogue based on mission marker.
   * Markers come from GeorgeData: story, CantDoiT, JustDoitDiary,
   * Story, JustDoitMap, nomission.
   */
  playMissionDialogue () {
    // Map mission markers to dialogue clips
    const dialogueMap = {
      'story': '80d001v0',          // M19 completed (lowercase)
      'CantDoiT': '80d002v0',       // M7 given, no diary
      'JustDoitDiary': '80d003v0',  // M7 given + diary delivered
      'Story': '80d004v0',          // M19 given + has map / VOID fallback
      'JustDoitMap': '80d005v0',    // M19 given, map piece given
      'nomission': '80d006v0'       // M18 not completed, first visit
    }

    const dialogueId = dialogueMap[this.missionMarker] || '80d004v0'

    console.log('[George] Playing mission dialogue:', this.missionMarker, '->', dialogueId)

    this.playDialogue(dialogueId)
  }

  /**
   * Draw the boat in scene at position based on hull type
   */
  drawBoatInScene () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    // Get hull type
    let hullType = 'medium'
    if (boat.getHullType) {
      hullType = boat.getHullType()
    } else if (boat.hullType) {
      hullType = boat.hullType
    }

    // Determine position based on hull type
    let boatPos = { x: 280, y: 170 }
    
    if (hullType === 'small' || hullType === '#Small') {
      boatPos = { x: 200, y: 190 }
    }

    console.log('[George] Drawing boat with hull type:', hullType, 'at position:', boatPos)

    if (this.game.mulle.user.Boat) {
      this.boatDisplay = new MulleBuildBoat(this.game, boatPos.x, boatPos.y)
      this.boatDisplay.create(this.game.mulle.user.Boat)
      this.game.add.existing(this.boatDisplay)
    }
  }

  /**
   * Create sky sprite based on weather
   */
  setSky () {
    const weatherType = this.getWeatherType()
    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`
    
    this.skySprite = new MulleSprite(this.game, 320, 240)
    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)
    
    if (!loaded) {
      loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
    }
    
    if (loaded) {
      this.game.add.existing(this.skySprite)
      console.log('[George] Sky sprite loaded:', skyMemberName)
    } else {
      this.skySprite.destroy()
      this.skySprite = null
      this.createFallbackSky(weatherType)
    }
  }

  /**
   * Get weather type (1-4)
   */
  getWeatherType () {
    const weather = this.game.mulle.weather ||
                    this.game.mulle.user?.weather ||
                    this.game.mulle.SeaMap?.weather ||
                    'clear'

    const weatherMap = {
      'clear': 1, 'calm': 1, 'sunny': 1,
      'windy': 2, 'breezy': 2,
      'rainy': 3, 'rain': 3,
      'stormy': 4, 'storm': 4
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
   * Create fallback sky
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
   * Interpolate colors
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
   * Create fallback background
   */
  createFallbackBackground () {
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x88AA66) // Green for farm
    bg.drawRect(0, 0, 640, 480)
    bg.endFill()
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
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[George] Returning to seaworld')
    
    if (!this.game.mulle.user.Boat.hasCache('#GeorgeVisited')) {
      this.game.mulle.user.Boat.addCache('#GeorgeVisited')
    }
    
    this.game.state.start('seaworld')
  }

  /**
   * Shutdown
   */
  shutdown () {
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }
    
    super.shutdown()
    console.log('[George] Scene shutdown')
  }
}

export default GeorgeState
