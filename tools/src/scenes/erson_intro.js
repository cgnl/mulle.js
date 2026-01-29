/**
 * Erson Intro Tutorial Scene
 * @module scenes/erson_intro
 * 
 * Scene 70 from the original game (boten_70.DXR)
 * Tutorial introduction with Erson the diver explaining boat building
 * 
 * Features:
 * - Background: 70b001v0 (member 42, 640x480)
 * - Erson NPC with animations (point, Talk, liftHead, happyTalk)
 * - Diver character with popUp animation
 * - 5 dialogue clips (70d001v0 - 70d005v0)
 * - 2 ambient/effect sounds (70e001v0, 70e002v0)
 * 
 * Original game animation charts:
 * - ErsonAnimChart (member 26): 
 *   Still:[1], point:[1-8], Wait:[8,TalkStill], TalkStill:[8], 
 *   Talk:[9,8,10,9,10,8], pointBack:[8-1], liftHead:[1,11,12], happyTalk:[12,13,12,13,13]
 * - DiverAnimChart (member 27):
 *   Still:[21], popUp:[1-21 animated sequence]
 * - ErsonHappyAnimChart (member 29):
 *   Still:[6], point:[1-8], Wait:[6,TalkStill], TalkStill:[6],
 *   pointBack:[8-1], liftHead:[1-6], Talk:[7,rndFrame[6,8,6]]
 * 
 * Erson sprite members: 6-24 (70a001v0 series)
 * Diver sprite members: 47-67 (70a002v0 series)
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

class ErsonIntroState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets which should contain boten_70 assets
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_70.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // === BACKGROUND ===
    // 70b001v0 (member 42) = Main background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 42)) {
      console.warn('[ErsonIntro] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x87CEEB) // Light blue water color
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // === ERSON NPC ===
    // Erson is the main character in this tutorial
    // Sprite frames are members 6-24 (70a001v0 series)
    // Position based on original metadata: imagePosX/Y around 215, 179
    this.erson = new MulleSprite(this.game, 320, 240)
    this.erson.setDirectorMember(this.DirResource, 6) // 70a001v0 - first frame
    this.game.add.existing(this.erson)
    
    this.setupErsonAnimations()

    // === DIVER CHARACTER ===
    // Diver pops up from water during tutorial
    // Sprite frames are members 47-67 (70a002v0 series)
    this.diver = new MulleSprite(this.game, 320, 240)
    this.diver.setDirectorMember(this.DirResource, 67) // Start hidden (last frame = still/21)
    this.diver.visible = false // Hidden initially
    this.game.add.existing(this.diver)
    
    this.setupDiverAnimations()

    // === DIALOGUE SEQUENCE ===
    // Track dialogue progress
    this.dialogueStep = 0
    this.isTalking = false

    // Dialogue audio IDs (from original Lingo members 31-35)
    // 70d001v0 (32), 70d002v0 (33), 70d003v0 (34), 70d004v0 (31), 70d005v0 (35)
    this.dialogueSequence = [
      { audio: '70d001v0', action: 'point' },      // Erson points and explains
      { audio: '70d002v0', action: 'talk' },       // Erson talks
      { audio: '70d003v0', action: 'diverPopUp' }, // Diver pops up
      { audio: '70d004v0', action: 'happyTalk' },  // Erson happy
      { audio: '70d005v0', action: 'liftHead' }    // Final dialogue
    ]

    // === SKIP BUTTON ===
    this.createSkipButton()

    // === START TUTORIAL ===
    // Delay slightly before starting
    this.game.time.events.add(1000, () => {
      this.startTutorial()
    })

    console.log('[ErsonIntro] Tutorial scene created')
  }

  /**
   * Setup Erson's animations based on ErsonAnimChart
   * Original AnimChart from member 26:
   * [#Actions:[#Still:[1],#point:[1,2,3,4,5,6,7,8],#Wait:[8,#TalkStill],#TalkStill:[8],
   *  #Talk:[9,8,10,9,10,8],#pointBack:[8,7,6,5,4,3,2,1], #liftHead:[1,11,12], 
   *  #happyTalk:[12,13,12,13,13]],#Paths:[:]]
   * 
   * Sprite members: 6=frame1, 7=frame2, ... mapping:
   * Frame 1 = member 6 (70a001v0)
   * Frame 2 = member 7 (02)
   * ...up to frame 13+ in members 17-24
   */
  setupErsonAnimations () {
    var b = this.DirResource

    // Mapping: AnimChart frame number -> member ID
    // Frame 1=6, 2=7, 3=8, 4=9, 5=10, 6=11, 7=12, 8=13, 9=14, 10=15
    // Frame 11=16, 12=17, 13=18, etc.
    
    // Still animation (frame 1)
    var stillFrames = []
    stillFrames.push([b, 6])
    this.erson.addAnimation('still', stillFrames, 5, true)

    // Point animation (frames 1,2,3,4,5,6,7,8)
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

    // TalkStill animation (frame 8 - pointing pose while talking)
    var talkStillFrames = []
    talkStillFrames.push([b, 13]) // frame 8
    this.erson.addAnimation('talkStill', talkStillFrames, 5, true)

    // Talk animation (frames 9,8,10,9,10,8 - mouth movement cycle)
    var talkFrames = []
    talkFrames.push([b, 14]) // 9
    talkFrames.push([b, 13]) // 8
    talkFrames.push([b, 15]) // 10
    talkFrames.push([b, 14]) // 9
    talkFrames.push([b, 15]) // 10
    talkFrames.push([b, 13]) // 8
    this.erson.addAnimation('talk', talkFrames, 10, true)

    // PointBack animation (frames 8,7,6,5,4,3,2,1 - reverse of point)
    var pointBackFrames = []
    pointBackFrames.push([b, 13]) // 8
    pointBackFrames.push([b, 12]) // 7
    pointBackFrames.push([b, 11]) // 6
    pointBackFrames.push([b, 10]) // 5
    pointBackFrames.push([b, 9])  // 4
    pointBackFrames.push([b, 8])  // 3
    pointBackFrames.push([b, 7])  // 2
    pointBackFrames.push([b, 6])  // 1
    this.erson.addAnimation('pointBack', pointBackFrames, 8, false)

    // LiftHead animation (frames 1,11,12)
    var liftHeadFrames = []
    liftHeadFrames.push([b, 6])  // 1
    liftHeadFrames.push([b, 16]) // 11
    liftHeadFrames.push([b, 17]) // 12
    this.erson.addAnimation('liftHead', liftHeadFrames, 6, false)

    // HappyTalk animation (frames 12,13,12,13,13 - from ErsonHappyAnimChart)
    // Note: member 17 is "70a001v1", member 18 is "14", etc.
    var happyTalkFrames = []
    happyTalkFrames.push([b, 17]) // 12 (70a001v1)
    happyTalkFrames.push([b, 18]) // 13
    happyTalkFrames.push([b, 17]) // 12
    happyTalkFrames.push([b, 18]) // 13
    happyTalkFrames.push([b, 18]) // 13
    this.erson.addAnimation('happyTalk', happyTalkFrames, 8, true)

    // Start with still
    this.erson.animations.play('still')
  }

  /**
   * Setup Diver animations based on DiverAnimChart
   * Original AnimChart from member 27:
   * [#Actions:[#Still:[21], #popUp:[1,2,2,3,3,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,
   *  11,11,12,13,14,15,16,17,18,19,20,21]],#Paths:[:]]
   * 
   * Diver sprites are members 47-67 (70a002v0 series)
   * Frame 1 = member 47 (70a002v0), Frame 21 = member 67
   */
  setupDiverAnimations () {
    var b = this.DirResource

    // Mapping: AnimChart frame -> member
    // Frame 1 = member 47, Frame 2 = 48, ... Frame 21 = 67
    
    // Still animation (frame 21 - fully visible)
    var stillFrames = []
    stillFrames.push([b, 67]) // frame 21
    this.diver.addAnimation('still', stillFrames, 5, true)

    // PopUp animation - complex sequence from water
    // [1,2,2,3,3,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,13,14,15,16,17,18,19,20,21]
    var popUpFrames = []
    var popUpSequence = [1,2,2,3,3,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,13,14,15,16,17,18,19,20,21]
    for (var i = 0; i < popUpSequence.length; i++) {
      var frameNum = popUpSequence[i]
      var memberNum = 46 + frameNum // member 47 = frame 1, etc.
      popUpFrames.push([b, memberNum])
    }
    this.diver.addAnimation('popUp', popUpFrames, 12, false)

    // Hidden state (before popup)
    var hiddenFrames = []
    hiddenFrames.push([b, 47]) // frame 1 - barely visible
    this.diver.addAnimation('hidden', hiddenFrames, 5, true)
  }

  /**
   * Create skip button to bypass tutorial
   */
  createSkipButton () {
    this.skipButton = this.game.add.text(580, 450, 'Overslaan', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 2
    })
    this.skipButton.anchor.setTo(0.5, 0.5)
    this.skipButton.inputEnabled = true
    this.skipButton.events.onInputOver.add(() => {
      this.skipButton.fill = '#ffff00'
      this.game.mulle.cursor.current = 'Point'
    })
    this.skipButton.events.onInputOut.add(() => {
      this.skipButton.fill = '#ffffff'
      this.game.mulle.cursor.current = null
    })
    this.skipButton.events.onInputUp.add(() => {
      this.skipTutorial()
    })
  }

  /**
   * Start the tutorial dialogue sequence
   */
  startTutorial () {
    console.log('[ErsonIntro] Starting tutorial sequence')
    this.playNextDialogue()
  }

  /**
   * Play the next dialogue in the sequence
   */
  playNextDialogue () {
    if (this.dialogueStep >= this.dialogueSequence.length) {
      // Tutorial complete
      this.tutorialComplete()
      return
    }

    var dialogue = this.dialogueSequence[this.dialogueStep]
    this.dialogueStep++

    console.log('[ErsonIntro] Playing dialogue:', dialogue.audio, 'action:', dialogue.action)

    // Execute the action for this dialogue
    this.executeAction(dialogue.action)

    // Play the audio
    this.isTalking = true
    var audio = this.game.mulle.playAudio(dialogue.audio, () => {
      this.isTalking = false
      // Small pause between dialogues
      this.game.time.events.add(500, () => {
        this.playNextDialogue()
      })
    })

    if (!audio) {
      console.warn('[ErsonIntro] Audio not found:', dialogue.audio)
      this.isTalking = false
      // Continue anyway after delay
      this.game.time.events.add(2000, () => {
        this.playNextDialogue()
      })
    }
  }

  /**
   * Execute animation action for dialogue
   * @param {string} action - The action to execute
   */
  executeAction (action) {
    switch (action) {
      case 'point':
        // Erson points at something
        var pointAnim = this.erson.animations.play('point')
        if (pointAnim) {
          pointAnim.onComplete.addOnce(() => {
            this.erson.animations.play('talk')
          })
        }
        break

      case 'talk':
        // Simple talking
        this.erson.animations.play('talk')
        break

      case 'diverPopUp':
        // Diver appears from water
        this.diver.visible = true
        this.diver.animations.play('popUp')
        // Erson reacts
        this.erson.animations.play('liftHead')
        break

      case 'happyTalk':
        // Erson is happy
        this.erson.animations.play('happyTalk')
        break

      case 'liftHead':
        // Erson lifts head
        var liftAnim = this.erson.animations.play('liftHead')
        if (liftAnim) {
          liftAnim.onComplete.addOnce(() => {
            this.erson.animations.play('happyTalk')
          })
        }
        break

      default:
        // Default to talking
        this.erson.animations.play('talk')
    }
  }

  /**
   * Skip the tutorial and go to boatyard
   */
  skipTutorial () {
    console.log('[ErsonIntro] Tutorial skipped')
    
    // Stop any playing audio
    this.game.sound.stopAll()
    
    // Mark tutorial as seen
    this.game.mulle.user.seenErsonTutorial = true
    this.game.mulle.user.seenHarborTutorial = true // Also skip harbor
    this.game.mulle.saveData()

    // Go to boatyard
    this.game.state.start('boatyard')
  }

  /**
   * Tutorial is complete, transition to harbor tutorial (boten_71)
   */
  tutorialComplete () {
    console.log('[ErsonIntro] Tutorial complete!')

    // Return Erson to still pose
    var pointBackAnim = this.erson.animations.play('pointBack')
    if (pointBackAnim) {
      pointBackAnim.onComplete.addOnce(() => {
        this.erson.animations.play('still')
      })
    }

    // Mark tutorial as seen
    this.game.mulle.user.seenErsonTutorial = true
    this.game.mulle.saveData()

    // Show completion message and go to harbor tutorial
    this.showMessage('Naar de haven!', () => {
      // Transition to harbor tutorial
      this.game.state.start('harbor')
    })
  }

  /**
   * Show a message on screen
   * @param {string} text - Message text
   * @param {function} onComplete - Callback when done
   */
  showMessage (text, onComplete) {
    var msgBg = this.game.add.graphics(320, 240)
    msgBg.beginFill(0x000000, 0.7)
    msgBg.drawRoundedRect(-200, -40, 400, 80, 15)
    msgBg.endFill()
    msgBg.alpha = 0

    var msgText = this.game.add.text(320, 240, text, {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    })
    msgText.anchor.setTo(0.5, 0.5)
    msgText.alpha = 0

    // Fade in
    this.game.add.tween(msgBg).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true)
    this.game.add.tween(msgText).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true)

    // Wait and then continue
    this.game.time.events.add(2000, () => {
      // Fade out
      this.game.add.tween(msgBg).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.In, true)
      this.game.add.tween(msgText).to({ alpha: 0 }, 300, Phaser.Easing.Cubic.In, true)
        .onComplete.add(() => {
          msgBg.destroy()
          msgText.destroy()
          if (onComplete) onComplete()
        })
    })
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Click anywhere to advance dialogue (if currently talking)
    if (this.game.input.activePointer.justPressed() && this.isTalking) {
      // Optional: allow skipping current dialogue on click
      // For now, let dialogues play fully
    }
  }

  /**
   * Cleanup on scene exit
   */
  shutdown () {
    // Stop all sounds
    this.game.sound.stopAll()

    // Clear sprites
    this.erson = null
    this.diver = null

    super.shutdown()
    console.log('[ErsonIntro] Scene shutdown')
  }
}

export default ErsonIntroState
