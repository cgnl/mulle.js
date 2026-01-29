/**
 * Birgit's Beach scene (Dog lady)
 * @module scenes/birgit
 * 
 * Scene 77 from the original game (boten_77.DXR)
 * Birgit's beach with multiple dogs
 * 
 * Features:
 * - Beach background (77b001v1, 77b002v0, 77b006v0)
 * - Birgit NPC with Head/Arm/Turn animations
 * - Multiple dogs: Prima, Poodle, Dog, Labrador
 * - 30+ dialogue clips (77d002v0 - 77d032v0)
 * - Dog interaction/puzzle
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 * 
 * Original game animation charts:
 * - birgitHeadAnimChart (member 5)
 * - birgitArmAnimChart (member 6)
 * - birgitTurnAnimChart (member 11)
 * - PrimaAnimChart (member 8)
 * - poodleAnimChart (member 9)
 * - DogAnimChart (member 10)
 * - LabradorAnimChart (member 12)
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleActor from '../objects/actor'

class BirgitState extends MulleState {
  preload () {
    super.preload()

    // Load seaworld assets (contains boten_77 assets)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = 'boten_77.DXR'

    // Add audio for this scene
    this.game.mulle.addAudio('seaworld')

    // Track visit in boat's cache
    if (!this.game.mulle.user.Boat.hasCache('#VisitedBirgit')) {
      this.game.mulle.user.Boat.addCache('#VisitedBirgit')
    }

    // === BACKGROUND ===
    // 77b001v1 (member 18) = Main beach background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 18)
    this.game.add.existing(background)

    // 77b002v0 (member 19) = Alternative background layer
    // 77b006v0 (member 20) = Overlay/decoration layer with alpha

    // === BIRGIT NPC ===
    // Birgit is composed of multiple layers:
    // - Body: 77a000v0 (member 114) / 77a000v1 (member 115)
    // - Turn animations: 77a004v0 (member 116) / 77a004v1 (member 120)
    // - Arm: 77a002v0 (member 64), 77a003v0 (member 73)
    // - Head: 77a001v0 (member 122) / 77a001v1 (member 129)
    
    // Create Birgit's body sprite
    this.birgitBody = new MulleSprite(this.game, 320, 240)
    this.birgitBody.setDirectorMember(this.DirResource, 114) // 77a000v0
    this.game.add.existing(this.birgitBody)
    
    // Setup Birgit body animations
    this.setupBirgitBodyAnimations()

    // Create Birgit's arm sprite (layered on top of body)
    this.birgitArm = new MulleSprite(this.game, 320, 240)
    this.birgitArm.setDirectorMember(this.DirResource, 64) // 77a002v0
    this.game.add.existing(this.birgitArm)
    
    // Setup Birgit arm animations
    this.setupBirgitArmAnimations()

    // Create Birgit's head sprite (topmost layer)
    this.birgitHead = new MulleSprite(this.game, 320, 240)
    this.birgitHead.setDirectorMember(this.DirResource, 122) // 77a001v0
    this.game.add.existing(this.birgitHead)
    
    // Setup Birgit head animations
    this.setupBirgitHeadAnimations()

    // Make Birgit clickable (use head as click area)
    this.birgitHead.inputEnabled = true
    this.birgitHead.input.useHandCursor = true
    this.birgitHead.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.birgitHead.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.birgitHead.events.onInputUp.add(() => {
      this.onBirgitClick()
    })

    // === DOGS ===
    // Create the dogs group
    this.dogs = this.game.add.group()
    this.createDogs()

    // === BEACH ELEMENTS ===
    // Add beach decorations (77b003v0-77b005v0 are element overlays)
    this.createBeachElements()

    // === EXIT BUTTON ===
    this.createExitButton()

    // === INITIAL DIALOGUE ===
    // Check if this is the first visit
    if (!this.game.mulle.user.Boat.hasCache('#BirgitIntroPlayed')) {
      // Play intro dialogue (77d002v0 - Birgit's welcome)
      this.game.time.events.add(500, () => {
        this.playDialogue('77d002v0', () => {
          this.game.mulle.user.Boat.addCache('#BirgitIntroPlayed')
          this.birgitIdleMode()
        })
      })
    } else {
      // Return visit - play shorter greeting
      this.game.time.events.add(500, () => {
        this.playDialogue('77d003v0', () => {
          this.birgitIdleMode()
        })
      })
    }

    // Play ambient beach sounds
    this.playAmbientSounds()

    // Track dialogue state
    this.dialogueIndex = 0
    
    // All available dialogues (77d002v0 - 77d032v0)
    this.dialogueSequence = [
      '77d005v0', '77d006v0', '77d007v0', '77d008v0', '77d009v0',
      '77d010v0', '77d011v0', '77d012v0', '77d013v0', '77d014v0',
      '77d015v0', '77d016v0', '77d018v0', '77d019v0',
      '77d021v0', '77d022v0', '77d023v0', '77d024v0', '77d025v0',
      '77d026v0', '77d027v0', '77d028v0', '77d029v0', '77d030v0',
      '77d031v0', '77d032v0'
    ]

    // Dog-related dialogues
    this.dogDialogues = {
      prima: ['77d008v0', '77d012v0'],
      poodle: ['77d009v0', '77d013v0'],
      dog: ['77d010v0', '77d014v0'],
      labrador: ['77d011v0', '77d015v0']
    }

    console.log('[Birgit] Scene created - Birgit\'s beach with dogs')
  }

  /**
   * Setup Birgit's body animations
   * Based on birgitTurnAnimChart (turn/facing directions)
   */
  setupBirgitBodyAnimations () {
    var b = this.DirResource

    // Body uses members 114-120 for various positions
    // 77a000v0 (114), 77a000v1 (115), 77a004v0 (116), etc.

    // Idle/Still animation (facing forward)
    var idleFrames = []
    idleFrames.push([b, 114])
    this.birgitBody.addAnimation('idle', idleFrames, 5, true)

    // Turn to side animation
    var turnFrames = []
    turnFrames.push([b, 114])
    turnFrames.push([b, 115])
    turnFrames.push([b, 116])
    this.birgitBody.addAnimation('turn', turnFrames, 8, false)

    // Turned/side view
    var turnedFrames = []
    turnedFrames.push([b, 116])
    this.birgitBody.addAnimation('turned', turnedFrames, 5, true)

    // Turn back animation
    var turnBackFrames = []
    turnBackFrames.push([b, 116])
    turnBackFrames.push([b, 115])
    turnBackFrames.push([b, 114])
    this.birgitBody.addAnimation('turnBack', turnBackFrames, 8, false)

    // Start with idle
    this.birgitBody.animations.play('idle')
  }

  /**
   * Setup Birgit's arm animations
   * Based on birgitArmAnimChart
   */
  setupBirgitArmAnimations () {
    var b = this.DirResource

    // Arm uses members 64-75 for gestures
    // 77a002v0 (64) = base arm position
    // 77a003v0 (73) = different arm position

    // Idle arm position
    var idleFrames = []
    idleFrames.push([b, 64])
    this.birgitArm.addAnimation('idle', idleFrames, 5, true)

    // Wave/gesture animation
    var waveFrames = []
    waveFrames.push([b, 64])
    waveFrames.push([b, 65])
    waveFrames.push([b, 66])
    waveFrames.push([b, 67])
    waveFrames.push([b, 68])
    waveFrames.push([b, 69])
    waveFrames.push([b, 68])
    waveFrames.push([b, 67])
    waveFrames.push([b, 66])
    waveFrames.push([b, 65])
    this.birgitArm.addAnimation('wave', waveFrames, 10, true)

    // Point gesture
    var pointFrames = []
    pointFrames.push([b, 64])
    pointFrames.push([b, 73])
    pointFrames.push([b, 74])
    pointFrames.push([b, 75])
    this.birgitArm.addAnimation('point', pointFrames, 8, false)

    // Start with idle
    this.birgitArm.animations.play('idle')
  }

  /**
   * Setup Birgit's head animations (talking, blinking)
   * Based on birgitHeadAnimChart
   */
  setupBirgitHeadAnimations () {
    var b = this.DirResource

    // Head uses members 122-135 for expressions
    // 77a001v0 (122), 77a001v1 (129), plus numbered variants

    // Idle head (neutral expression)
    var idleFrames = []
    idleFrames.push([b, 122])
    this.birgitHead.addAnimation('idle', idleFrames, 5, true)

    // Talk animation (mouth movements)
    var talkFrames = []
    talkFrames.push([b, 122])
    talkFrames.push([b, 123])
    talkFrames.push([b, 124])
    talkFrames.push([b, 125])
    talkFrames.push([b, 126])
    talkFrames.push([b, 127])
    talkFrames.push([b, 128])
    this.birgitHead.addAnimation('talk', talkFrames, 10, true)

    // Blink animation
    var blinkFrames = []
    blinkFrames.push([b, 122])
    blinkFrames.push([b, 129])
    blinkFrames.push([b, 122])
    this.birgitHead.addAnimation('blink', blinkFrames, 8, false)

    // Smile animation
    var smileFrames = []
    smileFrames.push([b, 130])
    smileFrames.push([b, 131])
    this.birgitHead.addAnimation('smile', smileFrames, 5, true)

    // Start with idle
    this.birgitHead.animations.play('idle')
  }

  /**
   * Create the dogs on the beach
   * Uses PrimaAnimChart, poodleAnimChart, DogAnimChart, LabradorAnimChart
   */
  createDogs () {
    var b = this.DirResource

    // Prima dog - members around 50-56
    this.prima = new MulleSprite(this.game, 180, 350)
    this.prima.setDirectorMember(b, 54)
    this.prima.dogName = 'prima'
    this.setupDogSprite(this.prima, 54, 56)
    this.dogs.add(this.prima)

    // Poodle - members around 50-56 (different set)
    this.poodle = new MulleSprite(this.game, 420, 340)
    this.poodle.setDirectorMember(b, 50)
    this.poodle.dogName = 'poodle'
    this.setupDogSprite(this.poodle, 50, 53)
    this.dogs.add(this.poodle)

    // Generic dog - members 67-70
    this.dog = new MulleSprite(this.game, 520, 380)
    this.dog.setDirectorMember(b, 67)
    this.dog.dogName = 'dog'
    this.setupDogSprite(this.dog, 67, 70)
    this.dogs.add(this.dog)

    // Labrador - uses similar member range
    this.labrador = new MulleSprite(this.game, 100, 400)
    this.labrador.setDirectorMember(b, 51)
    this.labrador.dogName = 'labrador'
    this.setupDogSprite(this.labrador, 51, 53)
    this.dogs.add(this.labrador)

    // Start random dog animations
    this.startDogAnimations()
  }

  /**
   * Setup a dog sprite with animations and click handling
   * @param {MulleSprite} dog - The dog sprite
   * @param {number} startMember - Starting member number for animations
   * @param {number} endMember - Ending member number for animations
   */
  setupDogSprite (dog, startMember, endMember) {
    var b = this.DirResource

    // Idle animation
    var idleFrames = []
    idleFrames.push([b, startMember])
    dog.addAnimation('idle', idleFrames, 5, true)

    // Animated idle (tail wag, etc)
    var animatedFrames = []
    for (var i = startMember; i <= endMember; i++) {
      animatedFrames.push([b, i])
    }
    dog.addAnimation('animated', animatedFrames, 8, true)

    // Bark animation (subset of frames)
    var barkFrames = []
    barkFrames.push([b, startMember])
    barkFrames.push([b, startMember + 1])
    barkFrames.push([b, startMember])
    dog.addAnimation('bark', barkFrames, 12, true)

    // Start with idle
    dog.animations.play('idle')

    // Make dog clickable
    dog.inputEnabled = true
    dog.input.useHandCursor = true
    dog.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
      // Highlight dog on hover
      dog.alpha = 0.9
    })
    dog.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
      dog.alpha = 1.0
    })
    dog.events.onInputUp.add(() => {
      this.onDogClick(dog)
    })
  }

  /**
   * Start random dog animation timers
   */
  startDogAnimations () {
    // Each dog has random intervals for animation
    this.dogs.forEach((dog) => {
      // Random bark/animation timer
      this.game.time.events.loop(
        3000 + Math.random() * 5000,
        () => {
          if (!this.isTalking) {
            var anim = Math.random() > 0.5 ? 'animated' : 'bark'
            dog.animations.play(anim)
            
            // Return to idle after animation
            this.game.time.events.add(1500, () => {
              dog.animations.play('idle')
            })
          }
        }
      )
    })
  }

  /**
   * Create beach decoration elements
   */
  createBeachElements () {
    var b = this.DirResource

    // Beach chair/umbrella (77b003v0 - member 43)
    var beachChair = new MulleSprite(this.game, 320, 240)
    try {
      beachChair.setDirectorMember(b, 43)
      this.game.add.existing(beachChair)
    } catch (e) {
      console.warn('[Birgit] Could not load beach chair sprite')
    }

    // Towel/blanket (77b004v0 - member 44)
    var towel = new MulleSprite(this.game, 320, 240)
    try {
      towel.setDirectorMember(b, 44)
      this.game.add.existing(towel)
    } catch (e) {
      console.warn('[Birgit] Could not load towel sprite')
    }

    // Beach bucket/toys (77b005v0 - member 45)
    var toys = new MulleSprite(this.game, 320, 240)
    try {
      toys.setDirectorMember(b, 45)
      this.game.add.existing(toys)
    } catch (e) {
      console.warn('[Birgit] Could not load beach toys sprite')
    }
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
   * Handle click on Birgit
   */
  onBirgitClick () {
    if (this.isTalking) return

    // Get next dialogue in sequence
    if (this.dialogueIndex < this.dialogueSequence.length) {
      var dialogueId = this.dialogueSequence[this.dialogueIndex]
      this.dialogueIndex++

      this.playDialogue(dialogueId, () => {
        this.birgitIdleMode()
      })
    } else {
      // Loop back to start of additional dialogues
      this.dialogueIndex = 0
      this.playDialogue('77d005v0', () => {
        this.birgitIdleMode()
      })
    }
  }

  /**
   * Handle click on a dog
   * @param {MulleSprite} dog - The clicked dog
   */
  onDogClick (dog) {
    if (this.isTalking) return

    // Play dog bark sound effect
    try {
      this.game.mulle.playAudio('77e002v1')
    } catch (e) {
      console.warn('[Birgit] Could not play dog bark sound')
    }

    // Make dog bark animation
    dog.animations.play('bark')
    this.game.time.events.add(1000, () => {
      dog.animations.play('idle')
    })

    // Birgit comments about the dog
    var dogDialogues = this.dogDialogues[dog.dogName]
    if (dogDialogues && dogDialogues.length > 0) {
      var randomDialogue = dogDialogues[Math.floor(Math.random() * dogDialogues.length)]
      
      this.game.time.events.add(500, () => {
        this.playDialogue(randomDialogue, () => {
          this.birgitIdleMode()
        })
      })
    }
  }

  /**
   * Play a dialogue clip with Birgit talking animation
   * @param {string} dialogueId - The dialogue ID (e.g., '77d002v0')
   * @param {function} onComplete - Callback when dialogue finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    // Play talk animation on head
    this.birgitHead.animations.play('talk')
    
    // Arm gesture while talking
    this.birgitArm.animations.play('wave')

    // Play audio
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })

    if (!audio) {
      console.warn('[Birgit] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Put Birgit in idle mode
   */
  birgitIdleMode () {
    // Return all parts to idle
    this.birgitBody.animations.play('idle')
    this.birgitArm.animations.play('idle')
    this.birgitHead.animations.play('idle')

    // Occasional blink
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
    this.blinkTimer = this.game.time.events.loop(
      4000 + Math.random() * 3000,
      () => {
        if (!this.isTalking) {
          this.birgitHead.animations.play('blink').onComplete.addOnce(() => {
            this.birgitHead.animations.play('idle')
          })
        }
      }
    )

    // Occasional arm gesture
    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }
    this.gestureTimer = this.game.time.events.loop(
      8000 + Math.random() * 5000,
      () => {
        if (!this.isTalking) {
          this.birgitArm.animations.play('point').onComplete.addOnce(() => {
            this.birgitArm.animations.play('idle')
          })
        }
      }
    )
  }

  /**
   * Play ambient beach sounds
   */
  playAmbientSounds () {
    // Try to play beach ambient sounds
    // 77e001v0 = ambient beach sounds
    // 77e003v0 = longer ambient loop
    try {
      this.ambientSound = this.game.mulle.playAudio('77e001v0', null)
      if (this.ambientSound) {
        this.ambientSound.loop = true
      }
    } catch (e) {
      console.warn('[Birgit] Ambient sound not available')
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      if (this.ambientSound) {
        this.ambientSound.stop()
      }
      this.game.mulle.stopAudio('77e001v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Exit to seaworld
   */
  exitToSeaworld () {
    console.log('[Birgit] Returning to seaworld')

    // Save that we've visited
    if (!this.game.mulle.user.Boat.hasCache('#BirgitVisited')) {
      this.game.mulle.user.Boat.addCache('#BirgitVisited')
    }

    // Stop sounds before leaving
    this.stopAmbientSounds()

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
    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
    if (this.gestureTimer) {
      this.game.time.events.remove(this.gestureTimer)
    }

    // Clear actors
    this.birgitBody = null
    this.birgitArm = null
    this.birgitHead = null
    
    // Clear dogs
    if (this.dogs) {
      this.dogs.destroy(true)
    }

    super.shutdown()
    console.log('[Birgit] Scene shutdown')
  }
}

export default BirgitState
