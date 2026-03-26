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
 * Missions (from BOAT_77_ANALYSIS.md):
 * - Mission 2: Swimring Delivery (Mail Mission 50d016v0)
 * - Mission 3: DoctorBag Delivery (Mail Mission 50d017v0)
 * - Mission 4: Prima Trip Voorbereiding (Telephone Mission 50d018v0)
 * - Mission 5: Prima Trip Hoofdmissie (Telephone Mission 50d019v0)
 * - Mission 22: MapPiece Delivery (Custom Mission)
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

const { computeBirgitResult, BIRGIT_POST_DIALOGUE_FLOWS } = require('./BirgitData')

// Lingo parity: ParentScript 1 - Dir.ls (77/77)
// State: externalParts — used for random reward part selection
const BIRGIT_EXTERNAL_PARTS_STATE = 'externalParts'

class BirgitState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
    this.game.load.json('MarkerAudioMap77', 'data/marker_audio_map_boten_77.json')
  }

  create () {
    super.create()

    this.DirResource = 'boten_77.DXR'

    this.game.mulle.addAudio('seaworld')

    if (!this.game.mulle.missionManager) {
      const { MissionManager } = require('./showboat')
      this.game.mulle.missionManager = new MissionManager(this.game)
    }
    this.missionManager = this.game.mulle.missionManager

    if (!this.game.mulle.user.Boat.hasCache('#VisitedBirgit')) {
      this.game.mulle.user.Boat.addCache('#VisitedBirgit')
    }

    // === SKY SPRITE ===
    // Original Lingo: setSky(the weather of gMulleGlobals)
    this.setSky()

    this.createBeachBackground()
    this.createPastryElement()

    this.birgitBody = new MulleSprite(this.game, 320, 240)
    this.birgitBody.setDirectorMember(this.DirResource, 114)
    this.game.add.existing(this.birgitBody)
    
    this.setupBirgitBodyAnimations()

    this.birgitArm = new MulleSprite(this.game, 320, 240)
    this.birgitArm.setDirectorMember(this.DirResource, 64)
    this.game.add.existing(this.birgitArm)
    
    this.setupBirgitArmAnimations()

    this.birgitHead = new MulleSprite(this.game, 320, 240)
    this.birgitHead.setDirectorMember(this.DirResource, 122)
    this.game.add.existing(this.birgitHead)
    
    this.setupBirgitHeadAnimations()

    this.dogs = this.game.add.group()
    this.createDogs()

    this.createExitButton()

    // === BOAT DISPLAY ===
    // Original Lingo: drawBoat(point(290, 160))
    this.drawBoatInScene()

    // Defer routeFrame to first update() — allows E2E state injection
    // between create() and the first frame. No visual difference (1 frame delay).
    this._needsRouteFrame = true

    this.playAmbientSounds()

    this.isTalking = false
    this.deliverMap = 0

    this.markerAudioMap = this.buildMarkerAudioMap()

    // Original Lingo: cursor(200) — custom scene cursor
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    console.log('[Birgit] Scene created - Birgit\'s beach with dogs')
  }

  createBeachBackground () {
    const b = this.DirResource

    // Director score (VWSC) shows three background layers:
    // Channel order at frame 1: member 19 (back), 20 (mid), 18 (front).
    const layers = [19, 20, 18]
    layers.forEach((member) => {
      const layer = new MulleSprite(this.game, 320, 240)
      if (layer.setDirectorMember(b, member)) {
        this.game.add.existing(layer)
      } else {
        console.warn('[Birgit] Missing background layer:', member)
      }
    })
  }

  setupBirgitBodyAnimations () {
    var b = this.DirResource

    var idleFrames = []
    idleFrames.push([b, 114])
    this.birgitBody.addAnimation('idle', idleFrames, 5, true)

    var turnFrames = []
    turnFrames.push([b, 114])
    turnFrames.push([b, 115])
    turnFrames.push([b, 116])
    this.birgitBody.addAnimation('turn', turnFrames, 8, false)

    var turnedFrames = []
    turnedFrames.push([b, 116])
    this.birgitBody.addAnimation('turned', turnedFrames, 5, true)

    var turnBackFrames = []
    turnBackFrames.push([b, 116])
    turnBackFrames.push([b, 115])
    turnBackFrames.push([b, 114])
    this.birgitBody.addAnimation('turnBack', turnBackFrames, 8, false)

    this.birgitBody.animations.play('idle')
  }

  setupBirgitArmAnimations () {
    var b = this.DirResource

    var idleFrames = []
    idleFrames.push([b, 64])
    this.birgitArm.addAnimation('idle', idleFrames, 5, true)

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

    var pointFrames = []
    pointFrames.push([b, 64])
    pointFrames.push([b, 73])
    pointFrames.push([b, 74])
    pointFrames.push([b, 75])
    this.birgitArm.addAnimation('point', pointFrames, 8, false)

    this.birgitArm.animations.play('idle')
  }

  setupBirgitHeadAnimations () {
    var b = this.DirResource

    var idleFrames = []
    idleFrames.push([b, 122])
    this.birgitHead.addAnimation('idle', idleFrames, 5, true)

    var talkFrames = []
    talkFrames.push([b, 122])
    talkFrames.push([b, 123])
    talkFrames.push([b, 124])
    talkFrames.push([b, 125])
    talkFrames.push([b, 126])
    talkFrames.push([b, 127])
    talkFrames.push([b, 128])
    this.birgitHead.addAnimation('talk', talkFrames, 10, true)

    var blinkFrames = []
    blinkFrames.push([b, 122])
    blinkFrames.push([b, 129])
    blinkFrames.push([b, 122])
    this.birgitHead.addAnimation('blink', blinkFrames, 8, false)

    var smileFrames = []
    smileFrames.push([b, 130])
    smileFrames.push([b, 131])
    this.birgitHead.addAnimation('smile', smileFrames, 5, true)

    this.birgitHead.animations.play('idle')
  }

  createDogs () {
    var b = this.DirResource

    this.prima = new MulleSprite(this.game, 180, 350)
    this.prima.setDirectorMember(b, 54)
    this.prima.dogName = 'prima'
    this.setupDogSprite(this.prima, 54, 56)
    this.dogs.add(this.prima)

    this.poodle = new MulleSprite(this.game, 420, 340)
    this.poodle.setDirectorMember(b, 50)
    this.poodle.dogName = 'poodle'
    this.setupDogSprite(this.poodle, 50, 53)
    this.dogs.add(this.poodle)

    this.dog = new MulleSprite(this.game, 520, 380)
    this.dog.setDirectorMember(b, 67)
    this.dog.dogName = 'dog'
    this.setupDogSprite(this.dog, 67, 70)
    this.dogs.add(this.dog)

    this.labrador = new MulleSprite(this.game, 100, 400)
    this.labrador.setDirectorMember(b, 51)
    this.labrador.dogName = 'labrador'
    this.setupDogSprite(this.labrador, 51, 53)
    this.dogs.add(this.labrador)

    // Dog animation is score-driven in Director; keep idle frames in JS.
  }

  setupDogSprite (dog, startMember, endMember) {
    var b = this.DirResource

    var idleFrames = []
    idleFrames.push([b, startMember])
    dog.addAnimation('idle', idleFrames, 5, true)

    var animatedFrames = []
    for (var i = startMember; i <= endMember; i++) {
      animatedFrames.push([b, i])
    }
    dog.addAnimation('animated', animatedFrames, 8, true)

    var barkFrames = []
    barkFrames.push([b, startMember])
    barkFrames.push([b, startMember + 1])
    barkFrames.push([b, startMember])
    dog.addAnimation('bark', barkFrames, 12, true)

    dog.animations.play('idle')

  }

  createPastryElement () {
    const b = this.DirResource

    // Lingo startMovie: pastrylist ["77b003v0","77b004v0","77b005v0"] on sprite 63
    const pastryMembers = [43, 44, 45]
    const pastryMember = pastryMembers[Math.floor(Math.random() * pastryMembers.length)]
    const pastry = new MulleSprite(this.game, 320, 240)
    if (pastry.setDirectorMember(b, pastryMember)) {
      this.game.add.existing(pastry)
    } else {
      console.warn('[Birgit] Could not load pastry element:', pastryMember)
    }
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

  /**
   * Draw the player's boat in the scene.
   * Original Lingo: drawBoat(point(290, 160))
   */
  drawBoatInScene () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    try {
      this.boatDisplay = new MulleBuildBoat(this.game, 290, 160, boat.Parts, true, false)
      this.game.add.existing(this.boatDisplay)
      console.log('[Birgit] Boat drawn at (290, 160)')
    } catch (e) {
      console.warn('[Birgit] Could not draw boat:', e.message)
    }
  }

  playDialogue (dialogueId, onComplete) {
    this.isTalking = true

    this.birgitHead.animations.play('talk')
    this.birgitArm.animations.play('wave')

    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      this.birgitHead.animations.play('idle')
      this.birgitArm.animations.play('idle')
      if (onComplete) onComplete()
    })

    // Original Lingo MovieScript 29: CuePassed routes cue events to sprites
    // via sendAllSprites(#spritecuePassed, ...). We listen for cue markers
    // on the audio to trigger animation changes mid-dialogue.
    if (audio && audio.onMarkerReached) {
      audio.onMarkerReached.add((marker) => {
        this.onCuePassed(marker)
      })
    }

    if (!audio) {
      console.warn('[Birgit] Dialogue audio not found:', dialogueId)
      this.isTalking = false
      if (onComplete) onComplete()
    }
  }

  /**
   * Handle audio cue marker events.
   * Original Lingo MovieScript 29: CuePassed → sendAllSprites(#spritecuePassed, ...)
   * Cue markers in dialogue audio trigger animation changes on Birgit and the dogs.
   *
   * @param {string} marker - Cue point name from the audio
   */
  onCuePassed (marker) {
    if (!marker) return
    const m = String(marker).toLowerCase()

    // Head animation cues
    if (m === 'talk' || m === 'talkstart') {
      this.birgitHead.animations.play('talk')
    } else if (m === 'smile') {
      this.birgitHead.animations.play('smile')
    } else if (m === 'blink') {
      this.birgitHead.animations.play('blink')
    } else if (m === 'idle' || m === 'talkstop') {
      this.birgitHead.animations.play('idle')
    }

    // Arm animation cues
    if (m === 'wave' || m === 'wavestart') {
      this.birgitArm.animations.play('wave')
    } else if (m === 'point') {
      this.birgitArm.animations.play('point')
    } else if (m === 'armdown' || m === 'wavestop') {
      this.birgitArm.animations.play('idle')
    }

    // Body turn cues
    if (m === 'turn') {
      this.birgitBody.animations.play('turn')
    } else if (m === 'turnback') {
      this.birgitBody.animations.play('turnBack')
    }

    // Dog animation cues
    if (m === 'primabark' && this.prima) {
      this.prima.animations.play('bark')
    } else if (m === 'poodlebark' && this.poodle) {
      this.poodle.animations.play('bark')
    } else if (m === 'dogbark' && this.dog) {
      this.dog.animations.play('bark')
    } else if (m === 'labradorbark' && this.labrador) {
      this.labrador.animations.play('bark')
    } else if (m === 'alldogs') {
      if (this.prima) this.prima.animations.play('bark')
      if (this.poodle) this.poodle.animations.play('bark')
      if (this.dog) this.dog.animations.play('bark')
      if (this.labrador) this.labrador.animations.play('bark')
    } else if (m === 'dogsidle') {
      if (this.prima) this.prima.animations.play('idle')
      if (this.poodle) this.poodle.animations.play('idle')
      if (this.dog) this.dog.animations.play('idle')
      if (this.labrador) this.labrador.animations.play('idle')
    }

    console.log('[Birgit] CuePassed:', marker)
  }

  birgitIdleMode () {
    this.birgitBody.animations.play('idle')
    this.birgitArm.animations.play('idle')
    this.birgitHead.animations.play('idle')

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
   * Complete Mission 5 (Prima trip).
   * Original Lingo BehaviorScript 26: primaTrip(gDir)
   * Called when the Prima trip dialogue sequence finishes.
   */
  primaTrip () {
    if (this.missionManager) {
      this.missionManager.addCompleted(5)
      console.log('[Birgit] primaTrip - Completed Mission 5')
    }
  }

  /**
   * Secondary DoctorBag routing — mirrors the Lingo BehaviorScripts (15, 16, 21,
   * 23, 24, 31, 32, 33, 34) that sit on specific frames and check whether the
   * DoctorBag is still in inventory mid-animation, redirecting to a "Bag" marker
   * variant if so.
   *
   * In the original Director, each animation marker's first frame could have a
   * BehaviorScript that runs on exitFrame and redirects to a Bag-specific variant.
   * We replicate this by checking AFTER the main marker is computed but BEFORE
   * playback begins.
   *
   * @param {string} marker - The computed marker from routeFrame
   * @returns {string} The marker (potentially redirected to a Bag variant)
   */
  applySecondaryDoctorBagRouting (marker) {
    if (!marker) return marker

    // Only applies when DoctorBag is STILL in inventory
    // (e.g., Swimring path was taken, but DoctorBag wasn't consumed yet)
    const hasDoctorBag = this.missionManager.hasInventoryItem
      ? this.missionManager.hasInventoryItem('#DoctorBag')
      : false
    if (!hasDoctorBag) return marker

    // Map of markers → Bag-redirect targets, from BehaviorScripts:
    // BS 15: JustDoItPrima → JustDoItPrimaBag
    // BS 16: JustDoItDog → JustDoItDogBag
    // BS 21: CantDoItDog → CantDoItDogBag
    // BS 23/24: JustDoIt1/JustDoIt2 → JustDoItBag
    // BS 31: SCJustDoItPrima → SCJustDoItPrimaBag
    // BS 32: SCcantDoItPrima → SCcantDoItPrimaBag
    // BS 33: cantDoItPrima → cantDoItPrimaBag
    // BS 34: DeliverMap → DeliverMapBag
    const bagRedirects = {
      'JustDoItPrimaRing': 'JustDoItPrimaBag',
      'JustDoItPrima': 'JustDoItPrimaBag',
      'JustDoItDogRing': 'JustDoItDogBag',
      'JustDoItDog': 'JustDoItDogBag',
      'CantDoItDogRing': 'CantDoItDogBag',
      'CantDoItDog': 'CantDoItDogBag',
      'JustDoIt1': 'JustDoItBag',
      'JustDoIt2': 'JustDoItBag',
      'SCJustDoItPrimaRing': 'SCJustDoItPrimaBag',
      'SCJustDoItPrima': 'SCJustDoItPrimaBag',
      'SCcantDoItPrimaRing': 'SCcantDoItPrimaBag',
      'SCcantDoItPrima': 'SCcantDoItPrimaBag',
      'cantDoItPrimaRing': 'cantDoItPrimaBag',
      'cantDoItPrima': 'cantDoItPrimaBag',
      'deliverMapRing': 'DeliverMapBag',
      'deliverMap': 'DeliverMapBag'
    }

    if (bagRedirects[marker]) {
      // Delete DoctorBag as the Lingo scripts do
      this.missionManager.removeInventoryItem('#DoctorBag')
      console.log('[Birgit] Secondary DoctorBag routing:', marker, '->', bagRedirects[marker])
      return bagRedirects[marker]
    }

    return marker
  }

  /**
   * Check for deliverMap + Ring combination.
   * Original Lingo BehaviorScript 36: if deliverMap = 1 → go("deliverMapRing")
   * This handles the case where the player is delivering a map AND had a swimring.
   *
   * @param {string} marker - The computed marker
   * @returns {string} Possibly redirected marker
   */
  applyDeliverMapRingRouting (marker) {
    if (!marker) return marker

    // BS 36: beginSprite check — if deliverMap flag is set, redirect to deliverMapRing
    if (this.deliverMap === 1 && marker.toLowerCase().startsWith('justdoitring')) {
      this.deliverMap = 0
      console.log('[Birgit] deliverMap + Ring routing: deliverMapRing')
      return 'deliverMapRing'
    }

    return marker
  }

  playAmbientSounds () {
    try {
      this.ambientSound = this.game.mulle.playAudio('77e001v0', null)
      if (this.ambientSound) {
        this.ambientSound.loop = true
      }
    } catch (e) {
      console.warn('[Birgit] Ambient sound not available')
    }
  }

  stopAmbientSounds () {
    try {
      if (this.ambientSound) {
        this.ambientSound.stop()
      }
      this.game.mulle.stopAudio('77e001v0')
    } catch (e) {
    }
  }

  exitToSeaworld () {
    console.log('[Birgit] Returning to seaworld')

    if (!this.game.mulle.user.Boat.hasCache('#BirgitVisited')) {
      this.game.mulle.user.Boat.addCache('#BirgitVisited')
    }

    this.checkLuxuryMedal()

    this.stopAmbientSounds()

    this.game.state.start('seaworld')
  }

  routeFrame () {
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
      this.game.mulle.missionManager = null
      const { MissionManager } = require('./showboat')
      this.game.mulle.missionManager = new MissionManager(this.game)
      this.missionManager = this.game.mulle.missionManager
    }

    // --- Gather state for pure-function computation ---
    const boat = this.game.mulle.user.Boat
    const hasSwimring = this.missionManager.hasInventoryItem('#Swimring')
    const hasDoctorBag = this.missionManager.hasInventoryItem('#DoctorBag')
    const hasDoghouse = boat.getProperty ? boat.getProperty('doghouse') === true : false
    const luxuryFactor = boat.getProperty ? boat.getProperty('luxuryfactor', 0) : 0
    const isMission22Given = !!this.missionManager.isGiven(22)
    const hasMapPiece1 = this.missionManager.hasInventoryItem('#MapPiece1')
    const isMission5Given = !!this.missionManager.isGiven(5)
    const isMission5Completed = !!this.missionManager.isCompleted(5)
    const isMission4Given = !!this.missionManager.isGiven(4)
    const hasMedal8 = !!(
      (this.game.mulle.seaMedals && this.game.mulle.seaMedals.hasMedal(8)) ||
      (boat.hasMedal && boat.hasMedal(8))
    )
    const hasMedal6 = !!(
      (this.game.mulle.seaMedals && this.game.mulle.seaMedals.hasMedal(6)) ||
      (boat.hasMedal && boat.hasMedal(6))
    )
    const randomPart = this.missionManager.getRandomExternalPart
      ? this.missionManager.getRandomExternalPart()
      : null
    const randomSuffix = Math.ceil(Math.random() * 2)

    // --- Compute (pure) ---
    const result = computeBirgitResult({
      hasDoctorBag,
      hasSwimring,
      isMission22Given,
      hasMapPiece1,
      isMission5Given,
      isMission5Completed,
      isMission4Given,
      luxuryFactor,
      hasDoghouse,
      hasMedal8,
      hasMedal6,
      randomPart,
      randomSuffix
    })

    console.log('[Birgit] Computed marker:', result.marker, '(suffix:', result.suffix, ')')

    // --- Apply side-effects based on computed actions ---
    if (result.actions.givePills) {
      this.game.mulle.user.setInInventory('#Pills', { nr: 100 })
      console.log('[Birgit] Gave Pills')
    }

    if (result.actions.completeMission3) {
      this.missionManager.addCompleted(3, { item: '#Pills', quantity: 100 })
      console.log('[Birgit] Completed Mission 3')
    }

    if (result.actions.giveRandomPart && randomPart) {
      this.missionManager.addPart(randomPart.partId)
      console.log('[Birgit] Gave random part', randomPart.partId)
    }

    if (result.actions.deleteSwimring) {
      this.missionManager.removeInventoryItem('#Swimring')
      console.log('[Birgit] Deleted Swimring')
    }

    if (result.actions.completeMission2) {
      this.missionManager.addCompleted(2, { part: randomPart ? randomPart.partId : null })
      console.log('[Birgit] Completed Mission 2')
    }

    if (result.actions.giveMapPiece1) {
      this.game.mulle.user.setInInventory('#MapPiece1', {})
      console.log('[Birgit] Gave MapPiece1')
    }

    if (result.actions.completeMission22) {
      this.missionManager.addCompleted(22, { item: '#MapPiece1' })
      console.log('[Birgit] Completed Mission 22')
    }

    if (result.actions.awardMedal6) {
      if (this.game.mulle.seaMedals) {
        this.game.mulle.seaMedals.awardMedal(6)
      } else if (boat.addMedal) {
        boat.addMedal(6)
      }
      console.log('[Birgit] Awarded Medal 6')
    }

    if (result.actions.giveMission5) {
      this.missionManager.addGiven(5)
      console.log('[Birgit] Gave Mission 5')
    }

    if (result.actions.giveBlinddog) {
      this.game.mulle.user.setInInventory('#Blinddog', {})
      console.log('[Birgit] Gave Blinddog')
    }

    if (result.actions.deleteDoctorBag) {
      this.missionManager.removeInventoryItem('#DoctorBag')
      console.log('[Birgit] Deleted DoctorBag')
    }

    if (result.actions.giveBelly) {
      this.game.mulle.user.setInInventory('#Belly', { nr: 1000 })
      console.log('[Birgit] Gave Belly 1000')
    }

    // Track tmpRing on missionManager for legacy compatibility
    this.missionManager.tmpRing = !!result.actions.deleteSwimring

    // Set deliverMap flag for BS 36 routing
    if (result.marker && result.marker.toLowerCase().startsWith('delivermap')) {
      this.deliverMap = 1
    }

    console.log('[Birgit] Frame route:', result.marker, '(suffix:', result.suffix, ')')
    this.executeRoute(result.marker)
  }

  executeRoute (route) {
    if (!route) return

    // Apply secondary DoctorBag frame routing (Lingo BehaviorScripts 15/16/21/23/24/31-34)
    route = this.applySecondaryDoctorBagRouting(route)

    // Apply deliverMap + Ring routing (Lingo BehaviorScript 36)
    route = this.applyDeliverMapRingRouting(route)

    const key = String(route).toLowerCase()
    const map = this.markerAudioMap
    if (map && Object.prototype.hasOwnProperty.call(map, key)) {
      const dialogue = map[key]
      if (dialogue) {
        this.playDialogue(dialogue, () => {
          this.game.mulle.user.Boat.addCache('#BirgitIntroPlayed')
          this.handlePostDialogueFlow(route)
        })
      } else {
        console.warn('[Birgit] No audio mapped for route:', route)
        this.game.mulle.user.Boat.addCache('#BirgitIntroPlayed')
        this.handlePostDialogueFlow(route)
      }
      return
    }

    console.warn('[Birgit] Marker map missing route:', route)
    this.game.mulle.user.Boat.addCache('#BirgitIntroPlayed')
    this.birgitIdleMode()
  }

  /**
   * Handle post-dialogue flow based on the route marker.
   * Uses data-driven flow table from BirgitData.BIRGIT_POST_DIALOGUE_FLOWS.
   *
   * This replicates the Lingo frame navigation that occurs after dialogue playback:
   *
   * - BehaviorScript 3: go("leave") → exit to seaworld
   * - BehaviorScript 4: go("ringleave") → exit after ring delivery
   * - BehaviorScript 25: go("notrip") → Prima can't go on trip yet
   * - BehaviorScript 26: primaTrip(gDir) → complete mission 5
   * - BehaviorScript 27/28: go("trip") → Prima trip sequence
   *
   * In the original Director, after an animation/dialogue marker finishes, the
   * playback head advances into frames with exitFrame scripts that determine the
   * next action. We map this to post-dialogue callbacks.
   *
   * @param {string} route - The marker that was just played
   */
  handlePostDialogueFlow (route) {
    if (!route) {
      this.birgitIdleMode()
      return
    }

    const r = String(route).toLowerCase()
    const flow = BIRGIT_POST_DIALOGUE_FLOWS[r]

    switch (flow) {
      case 'leave':
        // BS 3 / BS 4: exit to seaworld after delivery dialogue
        this.playLeaveDialogue()
        break

      case 'primaTrip':
        // BS 26: complete mission 5, then play trip dialogue
        this.primaTrip()
        this.playTripDialogue()
        break

      case 'trip':
        // BS 27/28: play Prima trip dialogue sequence
        this.playTripDialogue()
        break

      case 'notrip':
      case 'idle':
      default:
        // BS 25 / BS 2: stay on beach in idle mode
        this.birgitIdleMode()
        break
    }
  }

  /**
   * Play the "leave" dialogue then exit to seaworld.
   * Original Lingo: go("leave") → plays 77d002v0 then exits.
   */
  playLeaveDialogue () {
    const leaveAudio = '77d002v0'
    this.playDialogue(leaveAudio, () => {
      this.exitToSeaworld()
    })
  }

  /**
   * Play the "trip" dialogue sequence.
   * Original Lingo: go("trip") → plays 77d021v0 (trip dialogue).
   * After trip dialogue, enters idle mode.
   */
  playTripDialogue () {
    const tripAudio = '77d021v0'
    this.playDialogue(tripAudio, () => {
      this.birgitIdleMode()
    })
  }

  buildMarkerAudioMap () {
    const data = this.game.cache.getJSON('MarkerAudioMap77')
    if (!data || !data.markers) return null
    const map = {}
    Object.keys(data.markers).forEach((name) => {
      map[String(name).toLowerCase()] = data.markers[name]
    })
    return map
  }

  // NOTE: Mission completion logic has been moved to routeFrame() to match
  // the original Lingo implementation in ParentScript 1 - Dir.ls
  // The original processes all inventory checks and mission completions
  // in startMovie before going to the appropriate marker.

  checkLuxuryMedal () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    const luxuryFactor = boat.getProperty ? boat.getProperty('luxuryfactor', 0) : 0

    console.log('[Birgit] Checking LuxuryFactor:', luxuryFactor)

    if (luxuryFactor > 15) {
      // Original Lingo line 55: if getMedal(the boat of the user of gMulleGlobals, 8) = 0 then
      // Medal 6 should only be awarded if Medal 8 is NOT already obtained
      const hasMedal8 = (this.game.mulle.seaMedals && this.game.mulle.seaMedals.hasMedal(8)) ||
                        (boat.hasMedal && boat.hasMedal(8))
      
      if (hasMedal8) {
        console.log('[Birgit] Medal 8 already obtained, not awarding Medal 6')
        return
      }
      
      // Use seaMedals system if available
      if (this.game.mulle.seaMedals && !this.game.mulle.seaMedals.hasMedal(6)) {
        this.game.mulle.seaMedals.awardMedal(6)
        console.log('[Birgit] Awarded Luxe-medaille!')
        this.showMedalNotification('Luxe-medaille')
      } else if (boat.hasMedal && !boat.hasMedal(6)) {
        // Fallback to boat medal system
        boat.addMedal(6)
        console.log('[Birgit] Awarded Luxe-medaille!')
        this.showMedalNotification('Luxe-medaille')
      }
    }
  }

  showMedalNotification (medalName) {
    const medalText = this.game.add.text(320, 200, 'Medaille verdiend!\n' + medalName, {
      font: 'bold 20px Arial',
      fill: '#ffd700',
      stroke: '#8b6914',
      strokeThickness: 3,
      align: 'center'
    })
    medalText.anchor.setTo(0.5, 0.5)

    this.game.add.tween(medalText.scale)
      .to({ x: 1.3, y: 1.3 }, 300, Phaser.Easing.Bounce.Out, true, 0, 1, true)

    this.game.time.events.add(2500, () => {
      this.game.add.tween(medalText)
        .to({ alpha: 0 }, 500, null, true)
    })
  }

  update () {
    super.update()
    if (this._needsRouteFrame) {
      this._needsRouteFrame = false
      this.routeFrame()
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
      console.log('[Birgit] Sky sprite loaded:', skyMemberName, 'for weather type:', weatherType)
    } else {
      // Fallback: Create simple sky gradient
      console.log('[Birgit] Sky sprite not found, using fallback for weather type:', weatherType)
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

    // Draw gradient sky (top half only for beach scene)
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

    console.log('[Birgit] Fallback sky created for weather type:', weatherType)
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

    if (this.blinkTimer) {
      this.game.time.events.remove(this.blinkTimer)
    }
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

    this.birgitBody = null
    this.birgitArm = null
    this.birgitHead = null

    if (this.dogs) {
      this.dogs.destroy(true)
    }

    // Clean up boat display
    if (this.boatDisplay) {
      this.boatDisplay.destroy()
      this.boatDisplay = null
    }

    super.shutdown()
    console.log('[Birgit] Scene shutdown')
  }
}

export default BirgitState
