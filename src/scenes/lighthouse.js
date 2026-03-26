/**
 * Lighthouse scene (Sam's place)
 * @module scenes/lighthouse
 * 
 * Scene 80 from the original game (boten_80.DXR)
 * The largest boat destination at 9.7 MB
 * 
 * WARNING: No original Lingo reference found for verification.
 * This implementation is based on asset analysis and game behavior patterns
 * from other NPC scenes, but has not been validated against original source code.
 * 
 * Features:
 * - Lighthouse background (80b001v1, 80b002v0)
 * - Sam NPC with idle/talk animations
 * - Lamp animation with blinking effect
 * - 18 dialogue clips (80d001v0 - 80d018v0)
 * - Clickable interaction with Sam
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'
import { computeLighthouseResult, MARKER_GOTO } from './LighthouseData'

class LighthouseState extends MulleState {
  preload () {
    super.preload()

    // Load lighthouse assets (seaworld pack contains boten_80 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_80.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedLighthouse')) {
      this.game.mulle.user.Boat.addCache('#VisitedLighthouse')
    }

    // === BACKGROUND ===
    // 80b001v1 (member 17) = Main lighthouse background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 17)
    this.game.add.existing(background)

    // 80b002v0 (member 22) = Alternative/overlay background (if needed)
    // Can be used for different states or weather conditions

    // === SAM NPC ===
    // Create Sam actor using boten_80.DXR sprites
    // Member 24 (80a000v0) is Sam's base sprite
    // Original position calculated from imagePosX (158) + imageRegX (162) = 320
    // and imagePosY (247) + imageRegY (-7) = 240
    this.sam = new MulleSprite(this.game, 320, 240)
    this.sam.setDirectorMember(this.DirResource, 24)
    this.game.add.existing(this.sam)

    // Setup Sam animations based on seaworld-animations.json
    // The animation chart shows frames for: Still, turntalk, thumbs, Wait, TalkStill, talk, EyetoEyeTalk, eyeloop
    this.setupSamAnimations()

    // Make Sam clickable
    this.sam.inputEnabled = true
    this.sam.input.useHandCursor = true
    this.sam.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.sam.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.sam.events.onInputUp.add(() => {
      this.onSamClick()
    })

    // === LAMP ANIMATION ===
    // The animation data shows 'lampa' (lamp) animations with frames 1,2,3 and 'blinkloop'
    // Member 36 (80a001v0) is the actual lamp sprite, NOT member 23 (which is a full background)
    // Lamp position from imagePosX (202) + imageRegX (118) = 320
    // and imagePosY (164) + imageRegY (76) = 240
    this.lamp = new MulleSprite(this.game, 320, 240)
    this.lamp.setDirectorMember(this.DirResource, 36) // 80a001v0 - lamp sprite
    this.game.add.existing(this.lamp)

    // Setup lamp blinking animation
    this.setupLampAnimation()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#LighthouseIntroPlayed')) {
      // Play intro dialogue (80d001v0 - Sam's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('80d001v0', () => {
          this.game.mulle.user.Boat.addCache('#LighthouseIntroPlayed')
          this.samIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('80d002v0', () => {
          this.samIdleMode()
        })
      })
    }

    // Play ambient sounds (waves, seagulls, etc.)
    this.playAmbientSounds()

    // Check if player has Diary to deliver
    // Originele Lingo (1969.txt - Dest 20): CheckFor:[#Inventory:[#Diary]]
    this.checkForDiaryDelivery()

    // Track dialogue state
    this.dialogueIndex = 0
    this.dialogueSequence = [
      '80d003v0', '80d004v0', '80d005v0', '80d006v0', '80d007v0',
      '80d008v0', '80d009v0', '80d010v0', '80d011v0', '80d012v0',
      '80d013v0', '80d014v0', '80d015v0', '80d016v0', '80d017v0', '80d018v0'
    ]

    console.log('[Lighthouse] Scene created - Sam\'s lighthouse')
  }

  /**
   * Setup Sam's animations
   * Based on SamAnimChart (member 2) from boten_80.DXR metadata
   * 
   * Sam sprite members:
   * - 24 (80a000v0), 25 (80a000v1): Base Sam frames
   * - 40-47 (80a003v0 + "02"-"08"): Body/torso animation frames
   * 
   * Animation actions from SamAnimChart:
   * - Still: [1]
   * - turntalk: [4,6,5,4,5,6]
   * - thumbs: [1,2,3,4,5,6,7,8,9,10]
   * - talk: [3,1,4,[#rndFrame,[3,1,4]]]
   * - eyeloop: long sequence with 1,2,3,4 frames
   */
  setupSamAnimations () {
    var b = this.DirResource

    // Sam base sprite is member 24 (80a000v0)
    // Sam alternate frame is member 25 (80a000v1)
    
    // Idle/Still animation - just the base frame
    var idleFrames = []
    idleFrames.push([b, 24])
    this.sam.addAnimation('idle', idleFrames, 5, true)

    // Talk animation - based on 'talk' action [3,1,4]
    // Using members 40-47 (80a003v0 series) for body animation
    var talkFrames = []
    talkFrames.push([b, 42]) // frame 3
    talkFrames.push([b, 40]) // frame 1 (80a003v0)
    talkFrames.push([b, 43]) // frame 4
    talkFrames.push([b, 42]) // frame 3
    talkFrames.push([b, 40]) // frame 1
    talkFrames.push([b, 43]) // frame 4
    this.sam.addAnimation('talk', talkFrames, 10, true)

    // Eye blink/loop animation - members 24, 25
    var blinkFrames = []
    blinkFrames.push([b, 24])
    blinkFrames.push([b, 25])
    blinkFrames.push([b, 24])
    this.sam.addAnimation('blink', blinkFrames, 8, false)

    // Thumbs up animation - based on 'thumbs' action [1,2,3,4,5,6,7,8,9,10]
    // Using members 40-47 for the sequence
    var thumbsFrames = []
    thumbsFrames.push([b, 40]) // 80a003v0
    thumbsFrames.push([b, 41])
    thumbsFrames.push([b, 42])
    thumbsFrames.push([b, 43])
    thumbsFrames.push([b, 44])
    thumbsFrames.push([b, 45])
    thumbsFrames.push([b, 46])
    thumbsFrames.push([b, 47])
    this.sam.addAnimation('thumbs', thumbsFrames, 8, false)

    // Turntalk animation - based on 'turntalk' action [4,6,5,4,5,6]
    var turntalkFrames = []
    turntalkFrames.push([b, 43]) // frame 4
    turntalkFrames.push([b, 45]) // frame 6
    turntalkFrames.push([b, 44]) // frame 5
    turntalkFrames.push([b, 43]) // frame 4
    turntalkFrames.push([b, 44]) // frame 5
    turntalkFrames.push([b, 45]) // frame 6
    this.sam.addAnimation('turntalk', turntalkFrames, 8, false)

    // Start with idle
    this.sam.animations.play('idle')
  }

  /**
   * Setup lamp blinking animation
   */
  setupLampAnimation () {
    var b = this.DirResource

    // Lamp frames based on animation data from SamAnimChart (member 2)
    // 'lampa' action uses frames [1,2,3] which map to members 36, 37, 38
    // Members 36-39 are 80a001v0 and frames 13, 14, 15
    var lampFrames = []
    lampFrames.push([b, 36]) // 80a001v0 - frame 1
    lampFrames.push([b, 37]) // frame 2 (member "13")
    lampFrames.push([b, 38]) // frame 3 (member "14")

    this.lamp.addAnimation('lampa', lampFrames, 5, false)
    this.lamp.addAnimation('on', [[b, 36]], 1, true)

    // Create periodic lamp blinking based on 'blinkloop' animation pattern
    // The blinkloop pattern shows mostly 1s with occasional 10s
    this.lampBlinkTimer = this.game.time.events.loop(3000, () => {
      this.lamp.animations.play('lampa').onComplete.addOnce(() => {
        this.lamp.setDirectorMember(b, 36)
      })
    })
  }

  /**
   * Create exit button to return to seaworld
   */
  createExitButton () {
    // Create exit/back button
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

    // Also add clickable area at bottom of screen
    var exitZone = this.game.add.graphics(0, 450)
    exitZone.beginFill(0x000000, 0.01) // Nearly invisible
    exitZone.drawRect(0, 0, 640, 30)
    exitZone.endFill()
    exitZone.inputEnabled = true
    exitZone.events.onInputUp.add(() => {
      this.exitToSeaworld()
    })
  }

  /**
   * Handle click on Sam
   */
  onSamClick () {
    if (this.isTalking) return

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      this.playDialogue(dialogueId, () => {
        this.samIdleMode()
      })
    } else {
      // Loop back to start of additional dialogues
      this.dialogueIndex = 0
      this.playDialogue('80d003v0', () => {
        this.samIdleMode()
      })
    }
  }

  /**
   * Play a dialogue clip
   * @param {string} dialogueId - The dialogue ID (e.g., '80d001v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation
    this.sam.animations.play('talk')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.sam.animations.stop()
      this.sam.animations.play('idle')
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Lighthouse] Dialogue audio not found:', dialogueId)
      this.sam.animations.stop()
      this.sam.animations.play('idle')
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Put Sam in idle mode
   */
  samIdleMode () {
    this.sam.animations.play('idle')

    // Occasional blink
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
    this.blinkTimer = this.game.time.events.loop(
      4000 + Math.random() * 3000,
      () => {
        if (!this.isTalking) {
          this.sam.animations.play('blink').onComplete.addOnce(() => {
            this.sam.animations.play('idle')
          })
        }
      }
    )
  }

  /**
   * Play ambient sounds
   */
  playAmbientSounds () {
    // Try to play ambient ocean/lighthouse sounds
    // The audio file may contain ambient tracks
    try {
      // Ocean waves ambient (if available)
      // STUB: asset not found in ISO — 80e001v0 (ocean waves ambient)
    } catch (e) {
      console.warn('[Lighthouse] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      // No ambient audio to stop
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Check mission 7/8 state and diary inventory to determine scene behaviour.
   * Replaces the old Diary-only check with the full Lingo Dir.ls logic
   * (scene 85) via the pure-function LighthouseData module.
   *
   * Lingo flow:
   *   M7 completed → M8 given? → suit path (give Suit, complete M8)
   *                              → else leave
   *   M7 not completed → M7 given? → no diary? → give Diary
   *                                  → else leave
   *                    → else leave
   */
  checkForDiaryDelivery () {
    const user = this.game.mulle.user

    // Lingo-faithful mission logic (Dir.ls scene 85)
    const lighthouseResult = computeLighthouseResult({
      isMission7Completed: !!user.isMissionCompleted(7),
      isMission8Given: !!user.isMissionGiven(8),
      isMission7Given: !!user.isMissionGiven(7),
      hasDiary: !!(user.isInInventory('#Diary') || user.isInInventory('Diary'))
    })
    console.log('[Lighthouse] Lingo result:', lighthouseResult.marker, '→', lighthouseResult.goTo)

    // Store result for the rest of the scene to use
    this.lighthouseResult = lighthouseResult

    // --- Apply side-effects based on computed actions ---

    if (lighthouseResult.actions.giveDiary) {
      // Mission 7 is given but player has no Diary yet → give Diary
      console.log('[Lighthouse] Giving Diary to player (mission 7 path)')
      if (this.game.mulle.seaInventory) {
        this.game.mulle.seaInventory.addItem('Diary')
      }
      user.setInInventory('#Diary', 1)
    }

    if (lighthouseResult.actions.giveSuit) {
      // Mission 8 path → give Suit
      console.log('[Lighthouse] Giving Suit to player (mission 8 path)')
      user.setInInventory('#Suit', 1)
    }

    if (lighthouseResult.actions.completeMission8) {
      // Complete mission 8
      console.log('[Lighthouse] Completing mission 8')
      user.addCompletedMission(8)
    }

    // --- UI triggers (keep existing Phaser flows working) ---

    if (lighthouseResult.marker === 'Diary') {
      // The old code offered diary delivery via a prompt.
      // With Lingo logic the diary is *given* here, not delivered.
      // Show a notification instead of the old interactive prompt.
      this.game.time.events.add(3000, () => {
        this.showNotification('Sam geeft je een dagboek!')
      })
    } else if (lighthouseResult.marker === 'suit') {
      // Suit path — show a notification
      this.game.time.events.add(3000, () => {
        this.showNotification('Sam geeft je een duikpak!')
      })
    }
  }

  /**
   * Offer to deliver the Diary to Sam
   * @deprecated Superseded by computeLighthouseResult() in checkForDiaryDelivery.
   * The Lingo Dir.ls gives the diary TO the player, not the other way around.
   * Kept for backward compatibility; no longer called from checkForDiaryDelivery.
   */
  offerDiaryDelivery () {
    if (this.isTalking) {
      // Wait and try again
      this.game.time.events.add(2000, () => {
        this.offerDiaryDelivery()
      })
      return
    }

    // Create delivery prompt
    const promptBg = this.game.add.graphics(320, 350)
    promptBg.beginFill(0x000000, 0.8)
    promptBg.drawRoundedRect(-150, -40, 300, 80, 10)
    promptBg.endFill()

    const promptText = this.game.add.text(320, 340, 'Geef het dagboek aan Sam?', {
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
      this.deliverDiary()
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
   * Deliver the Diary to Sam
   * @deprecated Superseded by computeLighthouseResult() in checkForDiaryDelivery.
   * The original Lingo gives diary to the player; this method incorrectly
   * removed it.  Kept for backward compatibility; no longer triggered.
   */
  deliverDiary () {
    console.log('[Lighthouse] Delivering Diary!')

    // Remove Diary from inventory
    this.game.mulle.seaInventory.removeItem('Diary')

    // Play thumbs up animation and happy dialogue
    this.sam.animations.play('thumbs').onComplete.addOnce(() => {
      // Play thank you dialogue
      this.playDialogue('80d015v0', () => {
        // Mark delivery complete
        const user = this.game.mulle.user
        if (user) {
          user.Boat.addCache('#DiaryDelivered')
          user.save()
          console.log('[Lighthouse] Diary delivered to Sam!')
        }

        // Show thank you notification
        this.showNotification('Sam is blij met het dagboek!')

        this.samIdleMode()
      })
    })
  }

  /**
   * Show notification
   * @param {string} message - Message to display
   */
  showNotification (message) {
    const notifyText = this.game.add.text(320, 200, message, {
      font: 'bold 18px Arial',
      fill: '#00ff00',
      stroke: '#006600',
      strokeThickness: 3,
      align: 'center'
    })
    notifyText.anchor.setTo(0.5, 0.5)

    // Animate
    this.game.add.tween(notifyText.scale)
      .to({ x: 1.2, y: 1.2 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    // Fade out
    this.game.time.events.add(2500, () => {
      this.game.add.tween(notifyText)
        .to({ alpha: 0 }, 500, null, true)
        .onComplete.add(() => {
          notifyText.destroy()
        })
    })
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Lighthouse] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#LighthouseVisited')) {
      this.game.mulle.user.Boat.addCache('#LighthouseVisited')
    }

    this.game.state.start('seaworld')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Any per-frame updates
  }

  /**
   * Cleanup on scene exit
   */
  shutdown () {
    // Stop all sounds
    this.stopAmbientSounds()

    // Clear timers
    if (this.lampBlinkTimer) {
      this.game.time.events.remove(this.lampBlinkTimer)
    }
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }

    // Clear actors
    this.sam = null

    super.shutdown()
    console.log('[Lighthouse] Scene shutdown')
  }
}

export default LighthouseState
