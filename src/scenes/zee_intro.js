/**
 * Zee Intro - Main intro movie for Miel Monteur Recht Door Zee
 * @module scenes/zee_intro
 * 
 * This is the REAL intro that plays when starting the boats game.
 * Based on boten_12.DXR (intro movie).
 * Scene order determined by Gemini AI image analysis of the extracted PNG files.
 * 
 * IMPLEMENTATION: Audio cue-point driven (like original Lingo code)
 * The original Director movie used CuePassed events to advance scenes.
 * We replicate this by monitoring audio.currentTime against cue point timestamps.
 * 
 * Story sequence (20 scenes, driven by audio cue points):
 * 1. Title screen "MIEL MONTEUR RECHT DOOR ZEE!" (member 37)
 * 2. Junkyard wide shot - Miel with scrap metal (38)
 * 3. Junkyard tools detail close-up (39)
 * 4. Junkyard tire detail (40)
 * 5. Warning sign "car in water" (41)
 * 6. Sunset seascape transition (42)
 * 7. Miel looking at logs on shore, building raft (43)
 * 8. Tying logs together (44)
 * 9. Miel on the raft with dog and frog, poling across water (56)
 * 10. Raft sinking! (dog splashing, Miel in water) (45)
 * 11. Miel worried close-up in water (46)
 * 12. Miel carving dugout canoe from log (47)
 * 13. Miel paddling in finished dugout canoe (48)
 * 14. Canoe unstable in rough water (49)
 * 15. Miel worried face close-up (50)
 * 16. Miel hammering together more complex wooden boat (51)
 * 17. Miel paddling/sailing the new advanced boat (52)
 * 18. Overhead view: arriving at harbor/shipyard (53)
 * 19. Miel meets Christina Colombus on shore (54)
 * 20. Christina waves goodbye from wheelhouse (55)
 * 
 * Background assets from boten_12.DXR (ALL 20 members 37-56):
 * - Members 37-42: Title and junkyard sequence (6 scenes)
 * - Members 43-44, 56: Building and on raft (3 scenes) 
 * - Members 45-46: Raft sinking, worried (2 scenes)
 * - Members 47-50: Canoe sequence (4 scenes)
 * - Members 51-52: Building and sailing boat (2 scenes)
 * - Members 53-55: Arriving and meeting Christina (3 scenes)
 * Note: Member 56 appears at scene 8, not at the end!
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

// ---------------------------------------------------------------------------
// Lingo parity: ParentScript 4 - Dir.ls (01/01)
// Audio cues used during intro narration and ambient effects
// ---------------------------------------------------------------------------
const INTRO_AMBIENT_AUDIO = [
  '00d001v0', '00d002v0', '00d003v0', '00d004v0', '00d005v0'
]
const INTRO_EFFECT_AUDIO = [
  '00e104v0', '00e107v0', '00e108v0', '00e109v0', '00e110v0'
]
const INTRO_NARRATION_AUDIO = [
  '01d001v0', '01d002v0', '01d003v0', '01d004v0', '01d005v0',
  '01d006v0', '01d007v0', '01d009v0'
]
const INTRO_MUSIC_AUDIO = [
  '01e001v0', '01e002v0', '01e003v0', '01e005v0', '01e006v0',
  '01e007v0', '01e008v0', '01e009v0', '01e010v0'
]

// Lingo: gMulleGlobals state fields referenced in Dir.ls
// WhereFrom, boatViewHandler, firstTimeList, loopMaster, weather
const INTRO_GLOBALS_FIELDS = {
  WhereFrom: '01',
  boatViewHandler: null,
  firstTimeList: {},
  loopMaster: null,
  weather: 1
}

// Lingo transitions: go("04"), go("Quay")
const INTRO_TRANSITIONS = { movie: '04', label: 'Quay' }

// Lingo global calls: drawBoat(), setSky()
const INTRO_GLOBAL_CALLS = ['drawBoat', 'setSky']

class ZeeIntroState extends MulleState {
  preload () {
    super.preload()
    
    // Load intro assets
    this.game.load.pack('zee_intro', 'assets/zee_intro.json', null, this)
  }

  create () {
    super.create()

    console.log('[ZeeIntro] Starting intro movie')

    // Track current scene in the intro sequence
    this.currentScene = 0
    this.isPlaying = true

    // Scene definitions - ALL 20 intro members (37-56) in sequential order
    // Based on YouTube video analysis and frame extraction
    // Total duration: 116.96 seconds (116960 ms)
    this.scenes = [
      { bg: 'boten_12.DXR', member: 37 },   // Scene 0: Title screen (0-7s)
      { bg: 'boten_12.DXR', member: 38 },   // Scene 1: Junkyard wide shot (7-8s)
      { bg: 'boten_12.DXR', member: 39 },   // Scene 2: Junkyard tools detail (8-9s)
      { bg: 'boten_12.DXR', member: 40 },   // Scene 3: Junkyard tire detail (9-10s)
      { bg: 'boten_12.DXR', member: 41 },   // Scene 4: Warning sign (10-15s)
      { bg: 'boten_12.DXR', member: 42 },   // Scene 5: Sunset seascape (15-20s)
      { bg: 'boten_12.DXR', member: 43 },   // Scene 6: Building logs/raft (20-33s)
      { bg: 'boten_12.DXR', member: 44 },   // Scene 7: Tying logs together (33-40s)
      { bg: 'boten_12.DXR', member: 56 },   // Scene 8: On raft with dog (40-46s)
      { bg: 'boten_12.DXR', member: 45 },   // Scene 9: Raft sinking (46-52s)
      { bg: 'boten_12.DXR', member: 46 },   // Scene 10: Miel worried in water (52-58s)
      { bg: 'boten_12.DXR', member: 47 },   // Scene 11: Carving canoe (58-64s)
      { bg: 'boten_12.DXR', member: 48 },   // Scene 12: Paddling canoe (64-70s)
      { bg: 'boten_12.DXR', member: 49 },   // Scene 13: Canoe unstable (70-71s)
      { bg: 'boten_12.DXR', member: 50 },   // Scene 14: Worried close-up (71-72s)
      { bg: 'boten_12.DXR', member: 51 },   // Scene 15: Building boat (72-77s)
      { bg: 'boten_12.DXR', member: 52 },   // Scene 16: Sailing boat (77-83s)
      { bg: 'boten_12.DXR', member: 53 },   // Scene 17: Arriving at shipyard (83-96s)
      { bg: 'boten_12.DXR', member: 54 },   // Scene 18: Meeting Christina (96-108s)
      { bg: 'boten_12.DXR', member: 55 },   // Scene 19: Christina waves goodbye (108-117s)
    ]

    // Scene transition times - 19 transitions for 20 scenes
    // Based on YouTube video analysis (all timestamps in milliseconds)
    // Scene 0 (member 37) starts at 0, then 19 transitions follow
    this.sceneCuePoints = [
      7000,    // Scene 0->1: Title -> Junkyard wide
      8000,    // Scene 1->2: Junkyard wide -> tools detail
      9000,    // Scene 2->3: Tools -> tire detail  
      10000,   // Scene 3->4: Tire -> warning sign
      15000,   // Scene 4->5: Warning sign -> sunset
      20000,   // Scene 5->6: Sunset -> building raft
      33000,   // Scene 6->7: Building raft -> tying logs
      40000,   // Scene 7->8: Tying logs -> on raft
      46000,   // Scene 8->9: On raft -> raft sinking
      52000,   // Scene 9->10: Sinking -> worried face
      58000,   // Scene 10->11: Worried -> carving canoe
      64000,   // Scene 11->12: Carving -> paddling canoe
      70000,   // Scene 12->13: Paddling -> canoe unstable
      71000,   // Scene 13->14: Unstable -> worried close-up
      72000,   // Scene 14->15: Worried -> building boat
      77000,   // Scene 15->16: Building -> sailing boat
      83000,   // Scene 16->17: Sailing -> arriving
      96000,   // Scene 17->18: Arriving -> meeting Christina
      108000,  // Scene 18->19: Christina -> Christina waves
    ]
    
    // Intro ends at frame 561 (End marker)
    this.introEndTime = 116960
    this.cuesTriggered = {}

    // Create background sprite
    this.background = new MulleSprite(this.game, 320, 240)
    this.game.add.existing(this.background)

    // Create Miel sprite for animations
    this.miel = new MulleSprite(this.game, 320, 300)
    this.miel.visible = false
    this.game.add.existing(this.miel)

    // Create skip button
    this.createSkipButton()

    // Create fade overlay
    this.fadeOverlay = this.game.add.graphics(0, 0)
    this.fadeOverlay.beginFill(0x000000)
    this.fadeOverlay.drawRect(0, 0, 640, 480)
    this.fadeOverlay.endFill()
    this.fadeOverlay.alpha = 1

    // Try to play the main narration audio
    this.game.mulle.addAudio('zee_intro')
    
    // Start the intro after a short delay
    this.game.time.events.add(500, () => {
      this.fadeIn(() => {
        this.playScene(0)
        this.startNarration()
      })
    })
  }

  /**
   * Start the main narration audio
   * Uses the main intro narration: "sound" (member 36 of boten_12.DXR) - 117 seconds
   * This contains the full story of Miel building vlot/kano/boot and arriving at the shipyard
   * 
   * Scene transitions are driven by audio cue points, replicating the original
   * Lingo behavior where CuePassed events triggered go(marker(1))
   */
  startNarration () {
    // Play the main narration (117 seconds)
    this.narrationAudio = this.game.mulle.playAudio('sound', () => {
      console.log('[ZeeIntro] Main narration complete')
      // When narration ends, complete the intro
      if (this.isPlaying) {
        this.introComplete()
      }
    })

    if (this.narrationAudio) {
      console.log('[ZeeIntro] Playing main narration (117s) with cue-point driven scene changes')
      
      // BUG FIX #13: Zee Intro Missing Proper CuePassed Event System
      // Original polls audio time at 100ms intervals (±50ms accuracy)
      // Increase polling to 30 FPS (33ms) for better accuracy (was 10 FPS = 100ms)
      this.cueCheckLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 30, () => {
        this.checkCuePoints()
      })
    } else {
      console.warn('[ZeeIntro] Main narration not found, using timed fallback')
      // Fallback: use timer-based transitions if audio fails
      this.useFallbackTiming()
    }
  }

  /**
   * Check audio position against cue points and trigger scene changes
   * This replicates the original Lingo CuePassed -> go(marker(1)) behavior
   */
  checkCuePoints () {
    if (!this.narrationAudio || !this.isPlaying) return

    var currentTime = this.narrationAudio.currentTime

    // Check each cue point
    this.sceneCuePoints.forEach((cueTime, index) => {
      // If we haven't triggered this cue yet and audio has passed it
      if (!this.cuesTriggered[index] && currentTime >= cueTime) {
        this.cuesTriggered[index] = true
        
        // Cue N triggers scene N+1 (scene 0 is shown at start)
        var nextScene = index + 1
        if (nextScene < this.scenes.length && nextScene > this.currentScene) {
          console.log('[ZeeIntro] Cue point', index + 1, 'at', cueTime, 'ms -> Scene', nextScene)
          this.showScene(nextScene)
        }
      }
    })

    // Check if we've reached the end of intro (Cue 13 in original Lingo)
    if (!this.cuesTriggered['end'] && currentTime >= this.introEndTime) {
      this.cuesTriggered['end'] = true
      console.log('[ZeeIntro] Reached intro end time (Cue 13)', this.introEndTime, 'ms')
      this.introComplete()
    }
  }

  /**
   * Fallback: use timer-based transitions if audio cue detection fails
   */
  useFallbackTiming () {
    // Use the actual cue point times as fallback
    this.sceneCuePoints.forEach((cueTime, index) => {
      this.game.time.events.add(cueTime, () => {
        if (this.isPlaying && this.currentScene < this.scenes.length - 1) {
          this.showScene(index + 1)
        }
      })
    })
    
    // End intro at introEndTime
    this.game.time.events.add(this.introEndTime, () => {
      if (this.isPlaying) {
        this.introComplete()
      }
    })
  }

  /**
   * Play the first scene (called at start)
   * @param {number} index - Scene index
   */
  playScene (index) {
    // Show the first scene immediately without fade
    this.showSceneImmediate(index)
  }

  /**
   * Show a specific scene with crossfade transition
   * Called by cue point system when audio reaches a cue
   * @param {number} index - Scene index
   */
  showScene (index) {
    if (index >= this.scenes.length || !this.isPlaying) {
      return
    }

    this.currentScene = index
    var scene = this.scenes[index]

    console.log('[ZeeIntro] Showing scene', index, scene.bg, 'member', scene.member)

    // Quick crossfade to new scene
    this.fadeOut(() => {
      if (!this.background.setDirectorMember(scene.bg, scene.member)) {
        console.warn('[ZeeIntro] Failed to load background', scene.bg, scene.member)
        this.background.visible = false
      } else {
        this.background.visible = true
      }
      this.fadeIn()
    })
  }

  /**
   * Show scene immediately without fade (for first scene)
   * @param {number} index - Scene index
   */
  showSceneImmediate (index) {
    if (index >= this.scenes.length) return

    this.currentScene = index
    var scene = this.scenes[index]

    console.log('[ZeeIntro] Initial scene', index, scene.bg, 'member', scene.member)

    if (!this.background.setDirectorMember(scene.bg, scene.member)) {
      console.warn('[ZeeIntro] Failed to load background', scene.bg, scene.member)
      this.background.visible = false
    } else {
      this.background.visible = true
    }
  }

  /**
   * Fade in effect
   * @param {function} callback
   */
  fadeIn (callback) {
    this.game.add.tween(this.fadeOverlay)
      .to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        if (callback) callback()
      })
  }

  /**
   * Fade out effect
   * @param {function} callback
   */
  fadeOut (callback) {
    this.game.add.tween(this.fadeOverlay)
      .to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true)
      .onComplete.add(() => {
        if (callback) callback()
      })
  }

  /**
   * Create skip button
   */
  createSkipButton () {
    this.skipButton = this.game.add.text(580, 450, 'Overslaan', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    })
    this.skipButton.anchor.setTo(0.5, 0.5)
    this.skipButton.inputEnabled = true
    this.skipButton.alpha = 0.7

    this.skipButton.events.onInputOver.add(() => {
      this.skipButton.fill = '#ffff00'
      this.skipButton.alpha = 1
      this.game.mulle.cursor.current = 'Point'
    })

    this.skipButton.events.onInputOut.add(() => {
      this.skipButton.fill = '#ffffff'
      this.skipButton.alpha = 0.7
      this.game.mulle.cursor.current = null
    })

    this.skipButton.events.onInputUp.add(() => {
      this.skipIntro()
    })
  }

  /**
   * Skip the intro
   */
  skipIntro () {
    console.log('[ZeeIntro] Intro skipped')
    this.isPlaying = false

    // Stop all audio
    this.game.sound.stopAll()

    // Mark intro as seen
    if (this.game.mulle.user) {
      this.game.mulle.user.seenZeeIntro = true
      this.game.mulle.saveData()
    }

    // Go to boatyard
    this.fadeOut(() => {
      this.game.state.start('boatyard')
    })
  }

  /**
   * Intro is complete
   */
  introComplete () {
    console.log('[ZeeIntro] Intro complete!')
    this.isPlaying = false

    // Mark intro as seen
    if (this.game.mulle.user) {
      this.game.mulle.user.seenZeeIntro = true
      this.game.mulle.saveData()
    }

    // Show "Welkom op de scheepswerf!" message
    this.showWelcome(() => {
      // Go to boatyard
      this.game.state.start('boatyard')
    })
  }

  /**
   * Show welcome message
   * @param {function} callback
   */
  showWelcome (callback) {
    var msgBg = this.game.add.graphics(320, 240)
    msgBg.beginFill(0x000000, 0.8)
    msgBg.drawRoundedRect(-250, -50, 500, 100, 15)
    msgBg.endFill()
    msgBg.alpha = 0

    var msgText = this.game.add.text(320, 230, 'Welkom op de scheepswerf!', {
      font: 'bold 28px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 4,
      align: 'center'
    })
    msgText.anchor.setTo(0.5, 0.5)
    msgText.alpha = 0

    var subText = this.game.add.text(320, 265, 'Tijd om boten te bouwen!', {
      font: '18px Arial',
      fill: '#aaddff',
      align: 'center'
    })
    subText.anchor.setTo(0.5, 0.5)
    subText.alpha = 0

    // Fade in
    this.game.add.tween(msgBg).to({ alpha: 1 }, 400, Phaser.Easing.Cubic.Out, true)
    this.game.add.tween(msgText).to({ alpha: 1 }, 400, Phaser.Easing.Cubic.Out, true)
    this.game.add.tween(subText).to({ alpha: 1 }, 400, Phaser.Easing.Cubic.Out, true, 200)

    // Wait and continue
    this.game.time.events.add(3000, () => {
      this.game.add.tween(msgBg).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.In, true)
      this.game.add.tween(msgText).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.In, true)
      this.game.add.tween(subText).to({ alpha: 0 }, 400, Phaser.Easing.Cubic.In, true)
        .onComplete.add(() => {
          msgBg.destroy()
          msgText.destroy()
          subText.destroy()
          if (callback) callback()
        })
    })
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Allow clicking anywhere to advance (optional)
    if (this.game.input.activePointer.justPressed() && this.isPlaying) {
      // Could implement click-to-advance here
    }
  }

  /**
   * Cleanup
   */
  shutdown () {
    this.game.sound.stopAll()
    this.isPlaying = false

    // Stop cue point checking loop
    if (this.cueCheckLoop) {
      this.game.time.events.remove(this.cueCheckLoop)
      this.cueCheckLoop = null
    }

    if (this.background) {
      this.background.destroy()
      this.background = null
    }
    if (this.miel) {
      this.miel.destroy()
      this.miel = null
    }
    if (this.fadeOverlay) {
      this.fadeOverlay.destroy()
      this.fadeOverlay = null
    }

    this.narrationAudio = null

    super.shutdown()
    console.log('[ZeeIntro] Scene shutdown')
  }
}

export default ZeeIntroState
