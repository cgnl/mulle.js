/**
 * Harbor Tutorial Scene
 * @module scenes/harbor
 * 
 * Scene 71 from the original game (boten_71.DXR)
 * Harbor scene where player learns to use the rope to launch/dock boat
 * 
 * Features:
 * - Background: 71b001v0 (member 14, 640x480), 71b002v0 (member 15, 402x245 overlay)
 * - Erson NPC with animations (point, Talk, liftHead, happyTalk)
 * - Interactive rope with Pull/StoppPull/Fail animations
 * - 4 dialogue clips (71d001v0 - 71d004v0)
 * - 3 effect sounds (71e001v0 - 71e003v0)
 * 
 * Original game animation charts:
 * - ErsonHappyAnimChart (member 10):
 *   Still:[1], point:[1-8], Wait:[3,TalkStill], TalkStill:[3],
 *   pointBack:[8-1], liftHead:[1,11,12], Talk:[3,5,4,3,4]
 * - ErsonAnimChart (member 12):
 *   Still:[1], Wait:[6,TalkStill], TalkStill:[6], point:[1-6],
 *   Talk:[6,8,7,8,7], pointBack:[6-1], liftHead:[9,10,11,12], happyTalk:[12,13,12,11,13]
 * - RopeAnimChart (member 13):
 *   Still:[1], Pull:[1-6], StoppPull:[6-1], 
 *   Fail:[1,2,3,4,5,6 (held for long time),5,4,3,2,1]
 * 
 * Erson sprites: members 16-21 (70a001v0 reused)
 * Rope sprites: members 23-35 (71a002v0 series)
 */

import MulleState from './base'
import MulleSprite from '../objects/sprite'

class HarborState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets which should contain boten_71 assets
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_71.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // === BACKGROUND ===
    // 71b001v0 (member 14) = Main harbor background (640x480)
    var background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember(this.DirResource, 14)) {
      console.warn('[Harbor] Background not found, using fallback')
      background.destroy()
      var fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x6699CC) // Harbor blue
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }

    // 71b002v0 (member 15) = Overlay layer (402x245)
    var overlay = new MulleSprite(this.game, 320, 240)
    if (overlay.setDirectorMember(this.DirResource, 15)) {
      this.game.add.existing(overlay)
    }

    // === ERSON NPC ===
    // Erson appears here to explain the rope mechanism
    // Sprites are members 16-21 (70a001v0 series, reused from boten_70)
    this.erson = new MulleSprite(this.game, 320, 240)
    this.erson.setDirectorMember(this.DirResource, 16) // First frame
    this.game.add.existing(this.erson)
    
    this.setupErsonAnimations()

    // === ROPE ===
    // Interactive rope that player must pull
    // Sprites are members 23-35 (71a002v0 series)
    this.rope = new MulleSprite(this.game, 320, 240)
    this.rope.setDirectorMember(this.DirResource, 23) // First frame (71a002v0)
    this.game.add.existing(this.rope)
    
    this.setupRopeAnimations()
    this.makeRopeInteractive()

    // === STATE TRACKING ===
    this.isTalking = false
    this.ropePulled = false
    this.tutorialStep = 0

    // === SKIP BUTTON ===
    this.createSkipButton()

    // === START TUTORIAL ===
    this.game.time.events.add(1000, () => {
      this.startHarborTutorial()
    })

    console.log('[Harbor] Harbor tutorial scene created')
  }

  /**
   * Setup Erson's animations based on ErsonAnimChart (member 12)
   * [#Actions:[#Still:[1],#Wait:[6,#TalkStill],#TalkStill:[6],#point:[1,2,3,4,5,6],
   *  #Talk:[6,8,7,8,7],#pointBack:[6,5,4,3,2,1], #liftHead:[9,10,11,12], 
   *  #happyTalk:[12,13,12,11,13]],#Paths:[:]]
   * 
   * Members: 16=frame1, 17=frame2, 18=frame3, 19=frame4, 20=frame5, 21=frame6
   * Note: This Erson has fewer frames than in boten_70
   */
  setupErsonAnimations () {
    var b = this.DirResource

    // Still animation (frame 1)
    var stillFrames = []
    stillFrames.push([b, 16])
    this.erson.addAnimation('still', stillFrames, 5, true)

    // Point animation (frames 1-6)
    var pointFrames = []
    pointFrames.push([b, 16]) // 1
    pointFrames.push([b, 17]) // 2
    pointFrames.push([b, 18]) // 3
    pointFrames.push([b, 19]) // 4
    pointFrames.push([b, 20]) // 5
    pointFrames.push([b, 21]) // 6
    this.erson.addAnimation('point', pointFrames, 8, false)

    // TalkStill animation (frame 6)
    var talkStillFrames = []
    talkStillFrames.push([b, 21]) // frame 6
    this.erson.addAnimation('talkStill', talkStillFrames, 5, true)

    // Talk animation (frames 6,8,7,8,7) - note: we only have up to frame 6
    // So we'll use 6,5,4,5,4 as approximation
    var talkFrames = []
    talkFrames.push([b, 21]) // 6
    talkFrames.push([b, 20]) // 5
    talkFrames.push([b, 19]) // 4
    talkFrames.push([b, 20]) // 5
    talkFrames.push([b, 19]) // 4
    this.erson.addAnimation('talk', talkFrames, 10, true)

    // PointBack animation (frames 6-1)
    var pointBackFrames = []
    pointBackFrames.push([b, 21]) // 6
    pointBackFrames.push([b, 20]) // 5
    pointBackFrames.push([b, 19]) // 4
    pointBackFrames.push([b, 18]) // 3
    pointBackFrames.push([b, 17]) // 2
    pointBackFrames.push([b, 16]) // 1
    this.erson.addAnimation('pointBack', pointBackFrames, 8, false)

    // Start with still
    this.erson.animations.play('still')
  }

  /**
   * Setup Rope animations based on RopeAnimChart (member 13)
   * [#Actions:[#Still:[1],#Pull:[1,2,3,4,5,6],#StoppPull:[6,5,4,3,2,1], 
   *  #Fail:[1,2,3,4,5,6 (x many),5,4,3,2,1]],#Paths:[:]]
   * 
   * Rope sprites: members 23-35
   * Frame 1 = member 23 (71a002v0)
   * Frame 2 = member 24 (02)
   * ... up to frame 13 = member 35
   */
  setupRopeAnimations () {
    var b = this.DirResource

    // Still animation (frame 1 - rope at rest)
    var stillFrames = []
    stillFrames.push([b, 23])
    this.rope.addAnimation('still', stillFrames, 5, true)

    // Pull animation (frames 1-6) - rope being pulled
    var pullFrames = []
    pullFrames.push([b, 23]) // 1
    pullFrames.push([b, 24]) // 2
    pullFrames.push([b, 25]) // 3
    pullFrames.push([b, 26]) // 4
    pullFrames.push([b, 27]) // 5
    pullFrames.push([b, 28]) // 6
    this.rope.addAnimation('pull', pullFrames, 10, false)

    // StoppPull animation (frames 6-1) - rope returning
    var stoppPullFrames = []
    stoppPullFrames.push([b, 28]) // 6
    stoppPullFrames.push([b, 27]) // 5
    stoppPullFrames.push([b, 26]) // 4
    stoppPullFrames.push([b, 25]) // 3
    stoppPullFrames.push([b, 24]) // 2
    stoppPullFrames.push([b, 23]) // 1
    this.rope.addAnimation('stoppPull', stoppPullFrames, 10, false)

    // Fail animation - pull but fail (long hold at extended position)
    var failFrames = []
    // Build up
    failFrames.push([b, 23]) // 1
    failFrames.push([b, 24]) // 2
    failFrames.push([b, 25]) // 3
    failFrames.push([b, 26]) // 4
    failFrames.push([b, 27]) // 5
    failFrames.push([b, 28]) // 6
    // Hold at extended position (repeat frame 6 many times)
    for (var i = 0; i < 20; i++) {
      failFrames.push([b, 28]) // 6
    }
    // Release back
    failFrames.push([b, 27]) // 5
    failFrames.push([b, 26]) // 4
    failFrames.push([b, 25]) // 3
    failFrames.push([b, 24]) // 2
    failFrames.push([b, 23]) // 1
    this.rope.addAnimation('fail', failFrames, 15, false)

    // Pulled state (frame 6 - fully pulled)
    var pulledFrames = []
    pulledFrames.push([b, 28])
    this.rope.addAnimation('pulled', pulledFrames, 5, true)

    // Start with still
    this.rope.animations.play('still')
  }

  /**
   * Make the rope interactive (clickable/draggable)
   */
  makeRopeInteractive () {
    this.rope.inputEnabled = true
    this.rope.input.useHandCursor = true

    this.rope.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Grab'
    })

    this.rope.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })

    this.rope.events.onInputDown.add(() => {
      this.game.mulle.cursor.current = 'Grabbing'
      this.onRopePull()
    })

    this.rope.events.onInputUp.add(() => {
      this.game.mulle.cursor.current = 'Grab'
    })
  }

  /**
   * Handle rope being pulled
   */
  onRopePull () {
    if (this.ropePulled || this.isTalking) return

    console.log('[Harbor] Rope pulled!')

    // Play pull animation
    var pullAnim = this.rope.animations.play('pull')
    
    // Play rope pull sound effect
    try {
      this.game.mulle.playAudio('71e002v0') // Rope sound
    } catch (e) {
      console.warn('[Harbor] Rope sound not found')
    }

    if (pullAnim) {
      pullAnim.onComplete.addOnce(() => {
        this.rope.animations.play('pulled')
        this.ropePulled = true
        
        // Erson reacts positively
        this.onRopeSuccess()
      })
    } else {
      // Fallback if animation fails
      this.ropePulled = true
      this.onRopeSuccess()
    }
  }

  /**
   * Handle successful rope pull
   */
  onRopeSuccess () {
    console.log('[Harbor] Rope pull success!')

    // Erson celebrates
    this.erson.animations.play('point')

    // Play success dialogue
    this.isTalking = true
    var audio = this.game.mulle.playAudio('71d003v0', () => {
      this.isTalking = false
      this.erson.animations.play('still')
      
      // Tutorial complete
      this.tutorialComplete()
    })

    if (!audio) {
      // Continue anyway
      this.game.time.events.add(2000, () => {
        this.isTalking = false
        this.tutorialComplete()
      })
    }
  }

  /**
   * Create skip button
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
   * Start harbor tutorial sequence
   */
  startHarborTutorial () {
    console.log('[Harbor] Starting harbor tutorial')

    // Erson points at the rope and explains
    this.erson.animations.play('point')

    // Play explanation dialogue
    this.isTalking = true
    var audio = this.game.mulle.playAudio('71d001v0', () => {
      this.isTalking = false
      
      // Continue with second dialogue
      this.game.time.events.add(500, () => {
        this.playSecondDialogue()
      })
    })

    if (!audio) {
      console.warn('[Harbor] Dialogue not found, continuing...')
      this.isTalking = false
      this.game.time.events.add(2000, () => {
        this.playSecondDialogue()
      })
    }
  }

  /**
   * Play second part of tutorial
   */
  playSecondDialogue () {
    // Erson continues explaining
    this.erson.animations.play('talk')

    this.isTalking = true
    var audio = this.game.mulle.playAudio('71d002v0', () => {
      this.isTalking = false
      this.erson.animations.play('still')
      
      // Show hint to pull rope
      this.showHint('Trek aan het touw!')
    })

    if (!audio) {
      this.isTalking = false
      this.erson.animations.play('still')
      this.showHint('Trek aan het touw!')
    }
  }

  /**
   * Show a hint message
   * @param {string} text - Hint text
   */
  showHint (text) {
    if (this.hintText) {
      this.hintText.destroy()
    }

    this.hintText = this.game.add.text(320, 420, text, {
      font: 'bold 18px Arial',
      fill: '#ffff00',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    })
    this.hintText.anchor.setTo(0.5, 0.5)

    // Pulse effect
    this.game.add.tween(this.hintText.scale)
      .to({ x: 1.1, y: 1.1 }, 500, Phaser.Easing.Sine.InOut, true, 0, -1, true)
  }

  /**
   * Skip tutorial
   */
  skipTutorial () {
    console.log('[Harbor] Tutorial skipped')
    
    this.game.sound.stopAll()
    
    // Mark as complete
    this.game.mulle.user.seenHarborTutorial = true
    this.game.mulle.saveData()

    // Go to seaworld
    this.game.state.start('seaworld')
  }

  /**
   * Tutorial complete
   */
  tutorialComplete () {
    console.log('[Harbor] Tutorial complete!')

    // Hide hint
    if (this.hintText) {
      this.hintText.destroy()
    }

    // Mark as complete
    this.game.mulle.user.seenHarborTutorial = true
    this.game.mulle.saveData()

    // Show completion message and go to boatyard to build first boat
    this.showMessage('Goed gedaan! Naar de scheepswerf!', () => {
      this.game.state.start('boatyard')
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

    // Wait and continue
    this.game.time.events.add(2500, () => {
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
  }

  /**
   * Cleanup
   */
  shutdown () {
    this.game.sound.stopAll()
    
    this.erson = null
    this.rope = null

    super.shutdown()
    console.log('[Harbor] Scene shutdown')
  }
}

export default HarborState
