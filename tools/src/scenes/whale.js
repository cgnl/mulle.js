/**
 * Whale Scene
 * @module scenes/whale
 * 
 * Scene 88 from the original game (boten_88.DXR)
 * A whale watching scene where a whale emerges from the water
 * 
 * Features:
 * - Background: 88b001v1 (640x480), 88b002v0 (534x130 water overlay)
 * - Whale animation: 88a001v0 (members 15-22, 8 frames) - whale surfacing
 * - Water spray: 88a002v0 (members 23-26, 4 frames) - whale blowhole
 * - 4 dialogue clips (88d001v0 - 88d005v0)
 * - Ambient sounds (88e001v0, 88e002v0)
 * 
 * Original game animation: No explicit AnimChart for whale animations.
 * waterAnimChart (member 2) is for water pump effects, not whale.
 * Original Director tempo: ~12-15 fps (standard for Mulle Meck games)
 * 
 * Mission Logic (from original Lingo ParentScript 1 - Dir.ls):
 * - Mission 24: Whale watching reward
 * - Prerequisite: Mission 11 (water delivery) must be complete
 * - Requirement: Boat must have Watertank property
 * - Reward: #Fishingrod item added to inventory
 * 
 * Flow:
 * - If mission 24 already complete: "Done" marker (already visited, no reward)
 * - If mission 11 complete AND has Watertank: Complete mission 24, give Fishingrod, "JustDoit"
 * - Otherwise: "cantDoIt" - can see whale but no reward
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import { computeWhaleResult } from './WhaleData'

class WhaleState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_88.DXR'
    this.game.mulle.addAudio('seaworld')

    // Track visit
    if (!this.game.mulle.user.Boat.hasCache('#WhaleVisited')) {
      this.game.mulle.user.Boat.addCache('#WhaleVisited')
    }

    // === MISSION LOGIC (from original Lingo) ===
    // Determine mission state marker based on prerequisites
    this.missionMarker = this.determineMissionMarker()

    // === SKY SPRITE (from original Lingo) ===
    // Original: setSky(the weather of gMulleGlobals)
    this.setSky()

    // === BACKGROUND ===
    // 88b001v1 (member 13) = Main ocean background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 13)) {
      console.warn('[Whale] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x1a5276)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // === PLAYER'S BOAT ===
    // Original Lingo: drawBoat(point(340, 280))
    this.boat = new MulleBuildBoat(this.game, 340, 280, this.game.mulle.user.Boat.Parts, true, false)
    this.game.add.existing(this.boat)

    // === WHALE ===
    // Whale sprites: members 15-22 (88a001v0 series, 8 frames)
    // Frames go from small (15) to large (22) as whale surfaces
    this.whale = new MulleSprite(this.game, 320, 300)
    this.whale.setDirectorMember(this.DirResource, 15) // Start small/hidden
    this.whale.visible = false // Hidden initially
    this.game.add.existing(this.whale)
    this.setupWhaleAnimations()

    // === WATER SPRAY (Blowhole) ===
    // Spray sprites: members 23-26 (88a002v0 series, 4 frames)
    this.spray = new MulleSprite(this.game, 320, 200)
    this.spray.setDirectorMember(this.DirResource, 23)
    this.spray.visible = false
    this.game.add.existing(this.spray)
    this.setupSprayAnimations()

    // === WATER OVERLAY ===
    // 88b002v0 (member 14) = Water surface overlay (534x130)
    this.waterOverlay = new MulleSprite(this.game, 320, 400)
    if (this.waterOverlay.setDirectorMember(this.DirResource, 14)) {
      this.game.add.existing(this.waterOverlay)
    }

    // Make water clickable to trigger whale
    var clickZone = this.game.add.graphics(320, 300)
    clickZone.beginFill(0x000000, 0.01)
    clickZone.drawRect(-200, -100, 400, 200)
    clickZone.endFill()
    clickZone.inputEnabled = true
    clickZone.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    clickZone.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    clickZone.events.onInputUp.add(() => {
      this.onWaterClick()
    })

    // === STATE ===
    this.whaleVisible = false
    this.whaleAnimating = false
    this.whaleAppearances = 0

    // === EXIT BUTTON ===
    this.createExitButton()

    // === DIALOGUE ===
    this.dialogueSequence = ['88d001v0', '88d003v0', '88d004v0', '88d005v0']
    this.dialogueIndex = 0

    // === AMBIENT SOUNDS ===
    this.playAmbientSounds()

    // === INTRO ===
    this.game.time.events.add(1000, () => {
      this.playIntroDialogue()
    })

    // Random whale appearances
    this.startRandomWhaleTimer()

    console.log('[Whale] Scene created - watch for the whale!')
  }

  /**
   * Setup whale animations
   * Frames 1-8 show whale rising from water (small to large)
   * Members 15-22 (88a001v0 series)
   * 
   * Original Director tempo: ~12-15 fps
   * Using 12 fps for consistency with original game timing
   */
  setupWhaleAnimations () {
    var b = this.DirResource

    // Hidden state (frame 1 = member 15, smallest)
    var hiddenFrames = []
    hiddenFrames.push([b, 15])
    this.whale.addAnimation('hidden', hiddenFrames, 12, true)

    // Surface animation (frames 1-8, whale emerges)
    var surfaceFrames = []
    for (var i = 15; i <= 22; i++) {
      surfaceFrames.push([b, i])
    }
    this.whale.addAnimation('surface', surfaceFrames, 12, false)

    // Visible state (frame 8 = member 22, fully surfaced)
    var visibleFrames = []
    visibleFrames.push([b, 22])
    this.whale.addAnimation('visible', visibleFrames, 12, true)

    // Dive animation (frames 8-1, whale submerges)
    var diveFrames = []
    for (var i = 22; i >= 15; i--) {
      diveFrames.push([b, i])
    }
    this.whale.addAnimation('dive', diveFrames, 12, false)

    // Breach animation (quick surface and dive)
    var breachFrames = []
    // Up
    for (var i = 15; i <= 22; i++) {
      breachFrames.push([b, i])
    }
    // Hold at top (3 frames at 12fps = 0.25 sec hold)
    breachFrames.push([b, 22])
    breachFrames.push([b, 22])
    breachFrames.push([b, 22])
    // Down
    for (var i = 22; i >= 15; i--) {
      breachFrames.push([b, i])
    }
    this.whale.addAnimation('breach', breachFrames, 12, false)
  }

  /**
   * Setup spray/blowhole animations
   * Members 23-26 (88a002v0 series, 4 frames)
   * Using 12 fps for consistency with original Director tempo
   */
  setupSprayAnimations () {
    var b = this.DirResource

    // Spray animation (frames 1-4, then reverse)
    var sprayFrames = []
    sprayFrames.push([b, 23]) // 1
    sprayFrames.push([b, 24]) // 2
    sprayFrames.push([b, 25]) // 3
    sprayFrames.push([b, 26]) // 4
    sprayFrames.push([b, 25]) // 3
    sprayFrames.push([b, 24]) // 2
    this.spray.addAnimation('spray', sprayFrames, 12, false)
  }

  /**
   * Start random whale appearance timer
   */
  startRandomWhaleTimer () {
    this.whaleTimer = this.game.time.events.loop(
      10000 + Math.random() * 15000,
      () => {
        if (!this.whaleAnimating && Math.random() > 0.5) {
          this.triggerWhaleAppearance()
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
   * Play ambient ocean sounds
   */
  playAmbientSounds () {
    try {
      this.ambientSound = this.game.mulle.playAudio('88e001v0')
      if (this.ambientSound) {
        this.ambientSound.loop = true
      }
    } catch (e) {
      console.warn('[Whale] Ambient sound not available')
    }
  }

  /**
   * Play intro dialogue based on mission state
   * 
   * Original Lingo marker behavior:
   * - "Done": Already visited, show done state
   * - "JustDoit": Just completed mission, play success
   * - "start": Show whale but no reward (original "cantDoIt" routes here)
   */
   playIntroDialogue () {
    const dialogueId = this.getMissionDialogue()

    // Show appropriate hint based on mission state
    let hintText = 'Wacht op de walvis...'
    if (this.missionMarker === 'JustDoit') {
      hintText = 'Je hebt een hengel gekregen!'
    } else if (this.missionMarker === 'Done') {
      hintText = 'Je hebt de walvis al eerder gezien.'
    }

    this.playDialogue(dialogueId, () => {
      // Side-effects (completeMission24, giveFishingrod) already applied
      // in determineMissionMarker() via WhaleData action flags.
      if (this.missionMarker === 'JustDoit') {
        this.showRewardNotification()
      }

      this.showHint(hintText)
    })
  }

  /**
   * Show reward notification when Fishingrod is received
   */
  showRewardNotification () {
    // Create a simple notification for the reward
    const rewardText = this.game.add.text(320, 100, 'Hengel ontvangen!', {
      font: 'bold 24px Arial',
      fill: '#ffdd00',
      stroke: '#000000',
      strokeThickness: 4
    })
    rewardText.anchor.setTo(0.5, 0.5)

    // Animate and fade out
    this.game.add.tween(rewardText)
      .to({ y: 80, alpha: 0 }, 3000, Phaser.Easing.Quadratic.Out, true)
      .onComplete.add(() => {
        rewardText.destroy()
      })

    console.log('[Whale] Reward notification shown - Fishingrod added to inventory')
  }

  /**
   * Handle water click
   */
  onWaterClick () {
    if (this.whaleAnimating) return

    // Clicking water can trigger whale appearance
    if (!this.whaleVisible && Math.random() > 0.3) {
      this.triggerWhaleAppearance()
    } else if (this.whaleVisible) {
      // Clicking when whale visible plays dialogue
      var dialogue = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex = (this.dialogueIndex + 1) % this.dialogueSequence.length
      this.playDialogue(dialogue)
    }
  }

  /**
   * Trigger whale appearance
   */
  triggerWhaleAppearance () {
    if (this.whaleAnimating) return

    this.whaleAnimating = true
    this.whaleAppearances++

    // Hide hint
    if (this.hintText) {
      this.hintText.destroy()
      this.hintText = null
    }

    // Show whale
    this.whale.visible = true

    // Play whale sound
    try {
      this.game.mulle.playAudio('88e002v0')
    } catch (e) {
      console.warn('[Whale] Whale sound not available')
    }

    // Play breach animation
    var breachAnim = this.whale.animations.play('breach')
    
    if (breachAnim) {
      // Show spray at peak of breach
      this.game.time.events.add(800, () => {
        this.showSpray()
      })

      breachAnim.onComplete.addOnce(() => {
        this.whale.visible = false
        this.whaleAnimating = false
        this.whaleVisible = false

        // Play reaction dialogue on first appearance
        // Use mission-aware dialogue for first whale sighting
        if (this.whaleAppearances === 1) {
          if (this.missionMarker === 'JustDoit') {
            // Success! Play excited dialogue
            this.playDialogue('88d003v0')
          } else if (this.missionMarker === 'Done') {
            // Already seen before
            this.playDialogue('88d004v0')
          } else {
            // Can see whale but no reward (start)
            this.playDialogue('88d003v0')
          }
        }
      })
    } else {
      this.whaleAnimating = false
    }
  }

  /**
   * Show whale spray/blowhole effect
   */
  showSpray () {
    this.spray.visible = true
    this.spray.position.set(this.whale.x, this.whale.y - 50)

    var sprayAnim = this.spray.animations.play('spray')
    if (sprayAnim) {
      sprayAnim.onComplete.addOnce(() => {
        this.spray.visible = false
      })
    } else {
      this.game.time.events.add(600, () => {
        this.spray.visible = false
      })
    }
  }

  /**
   * Play dialogue
   */
  playDialogue (dialogueId, onComplete) {
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      if (onComplete) onComplete()
    })

    if (!audio && onComplete) {
      this.game.time.events.add(2000, onComplete)
    }
  }

  /**
   * Show hint text
   */
  showHint (text) {
    if (this.hintText) this.hintText.destroy()

    this.hintText = this.game.add.text(320, 420, text, {
      font: 'bold 16px Arial',
      fill: '#aaddff',
      stroke: '#000000',
      strokeThickness: 2
    })
    this.hintText.anchor.setTo(0.5, 0.5)
  }

  /**
   * Exit to seaworld
   */
  /**
   * Lingo: BehaviorScript 6.ls go("leave")
   */
  exitToSeaworld () {
    // Lingo parity: transition marker "leave"
    console.log('[Whale] leave → Returning to seaworld')

    // Stop ambient sounds
    if (this.ambientSound) {
      this.ambientSound.stop()
    }

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
      console.log('[Whale] Sky sprite loaded:', skyMemberName)
    } else {
      console.log('[Whale] Sky sprite not found, using fallback')
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
  shutdown () {
    if (this.whaleTimer) this.game.time.events.remove(this.whaleTimer)
    if (this.ambientSound) this.ambientSound.stop()

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

    this.whale = null
    this.spray = null
    this.waterOverlay = null
    if (this.hintText) this.hintText.destroy()

    super.shutdown()
    console.log('[Whale] Scene shutdown')
  }

  // ==========================================================================
  // MISSION LOGIC
  // Based on original Lingo from ParentScript 1 - Dir.ls (boten_88.DXR)
  // ==========================================================================

  /**
   * Determine mission marker based on prerequisites using WhaleData.
   *
   * Delegates to the pure-function computeWhaleResult() and then applies
   * any side-effects (mission completion, inventory) based on the returned
   * action flags.  Stores the full result on `this.whaleResult` for later
   * inspection / logging.
   *
   * @returns {string} Mission marker: 'Done', 'JustDoit', or 'cantDoIt'
   */
  determineMissionMarker () {
    const user = this.game.mulle.user

    // --- gather state ---
    const isMission24Completed = user.isMissionCompleted(24) > 0
    const isMission11Completed = user.isMissionCompleted(11) > 0
    const hasWatertank = user.Boat.getProperty('watertank', 0) > 0

    // --- pure computation (WhaleData) ---
    const result = computeWhaleResult({
      isMission24Completed,
      isMission11Completed,
      hasWatertank
    })

    // Store full result for debugging / other methods
    this.whaleResult = result
    console.log('[Whale] computeWhaleResult:', JSON.stringify(result))

    // --- apply side-effects based on action flags ---
    if (result.actions.completeMission24) {
      user.addCompletedMission(24)
      console.log('[Whale] Mission 24 completed')
    }
    if (result.actions.giveFishingrod) {
      user.setInInventory('#Fishingrod', {})
      console.log('[Whale] Fishingrod given')
    }

    return result.marker
  }

  /**
   * Check if player can receive the whale watching reward
   * @returns {boolean}
   */
  canReceiveReward () {
    return this.missionMarker === 'JustDoit'
  }

  /**
   * Check if player has already received the reward
   * @returns {boolean}
   */
  hasReceivedReward () {
    return this.missionMarker === 'Done'
  }

  /**
   * Get appropriate dialogue based on mission state
   * @returns {string} Dialogue ID to play
   */
  getMissionDialogue () {
    switch (this.missionMarker) {
      case 'Done':
        // Already completed - play "done" dialogue
        return '88d005v0'  // Generic whale watching dialogue
      case 'JustDoit':
        // Just completed - play success/reward dialogue
        return '88d003v0'  // Excited whale sighting dialogue
      case 'cantDoIt':
      default:
        // Cannot complete - play hint about requirements
        return '88d001v0'  // Intro dialogue (whale watching without reward)
    }
  }
}

export default WhaleState
