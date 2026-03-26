import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'
import blinkThing from '../util/blinkThing'

/**
 * RoadDog scene (Scene 85 - Salka the dog)
 *
 * Lingo source: decompiled_lingo/85/85/casts/Internal/
 *   - ParentScript 1 - Dir.ls: Mission 7/8 logic (Diary, Suit)
 *   - BehaviorScript 3: go(the frame) — loop on current frame
 *   - BehaviorScript 5: go(the myMarker of gDir) — route to marker
 *   - BehaviorScript 6,7: go("leave") — exit scene
 *   - MovieScript 10: CuePassed — advance frame on audio cue
 *
 * Mission flow (Dir.ls startMovie):
 *   1. M7 completed + M8 given → give #Suit, complete M8, marker "suit"
 *   2. M7 completed + M8 not given → marker "leave"
 *   3. M7 given + no #Diary → give #Diary, marker "Diary"
 *   4. M7 given + has #Diary → marker "Leave"
 *   5. M7 not given → marker "Leave"
 *
 * Marker routing:
 *   "Diary" → go("StartDiary")
 *   "Leave"/"leave" → go("Start")
 *   "suit" → go("suit")
 */
class RoadDogState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('roaddog', 'assets/roaddog.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '85.DXR'

    this.game.mulle.addAudio('roaddog')

    this.car = null
    this.isTalking = false

    // Lingo: cursor(200)
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    // === BACKGROUND (member 25) ===
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 25)
    this.game.add.existing(background)

    // === VEHICLE ===
    // Lingo Dir.ls: drawBoat(point(320, 155))
    this.car = new MulleBuildCar(this.game, 368, 240, null, true, true)
    this.game.add.existing(this.car)

    // === MISSION LOGIC (Lingo ParentScript 1 - Dir.ls startMovie) ===
    this.myMarker = this.determineMissionMarker()
    console.log('[RoadDog] Mission marker:', this.myMarker)

    // === NPC: SALKA THE DOG ===
    // Lingo: spriteList to [#BoatStart: 6]
    this.salka = new MulleActor(this.game, 480, 386, 'salkaRight')
    this.salka.animations.play('idle')
    this.game.add.existing(this.salka)

    // Make Salka clickable (Lingo mouseObject interaction area)
    this.salka.inputEnabled = true
    this.salka.events.onInputOver.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = 'Point'
    })
    this.salka.events.onInputOut.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = null
    })
    this.salka.events.onInputUp.add(() => {
      this.onSalkaClick()
    })

    // Salka idle audio
    this.ambientSound = this.game.mulle.playAudio('85e001v0')

    // === SUBTITLE SETUP ===
    this.game.mulle.subtitle.setLines('85d002v0', 'swedish', [
      '- Jahadu lilla {Salka}, du har kommit vilse igen.',
      '- Då kör vi hem dig till {Figge}!'
    ], 'mulle')

    this.game.mulle.subtitle.setLines('85d002v0', 'english', [
      "- Oh {Salka}, you've gotten lost again.",
      "- We'll drive you home to {Figge}!"
    ], 'mulle')

    // === MARKER-BASED FLOW ===
    // Lingo startMovie: routes based on myMarker at end of startMovie
    this.executeMarkerFlow()
  }

  /**
   * Lingo: ParentScript 1 - Dir.ls startMovie
   *
   * Determines mission marker from current game state.
   * Exact Lingo:
   *   if isMissionCompleted(user, 7) then
   *     if isMissionGiven(user, 8) then
   *       set myMarker to "suit"
   *       setInInventory(user, #Suit, [])
   *       addCompletedMission(user, 8)
   *     else
   *       set myMarker to "leave"
   *     end if
   *   else
   *     if isMissionGiven(user, 7) then
   *       if isInInventory(user, #Diary) = 0 then
   *         setInInventory(user, #Diary, [])
   *         set myMarker to "Diary"
   *       else
   *         set myMarker to "Leave"
   *       end if
   *     else
   *       set myMarker to "Leave"
   *     end if
   *   end if
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    var user = this.game.mulle.user
    if (!user || typeof user.isMissionCompleted !== 'function') return 'Leave'

    if (user.isMissionCompleted(7)) {
      if (user.isMissionGiven(8)) {
        // Lingo: setInInventory(user, #Suit, [])
        user.setInInventory('#Suit', [])
        // Lingo: addCompletedMission(user, 8)
        user.addCompletedMission(8)
        console.log('[RoadDog] Mission 8 completed - Suit given')
        return 'suit'
      } else {
        return 'leave'
      }
    } else {
      if (user.isMissionGiven(7)) {
        if (!user.isInInventory('#Diary')) {
          // Lingo: setInInventory(user, #Diary, [])
          user.setInInventory('#Diary', [])
          console.log('[RoadDog] Diary given for mission 7')
          return 'Diary'
        } else {
          return 'Leave'
        }
      } else {
        return 'Leave'
      }
    }
  }

  /**
   * Lingo marker routing from startMovie:
   *   if myMarker = "Diary" then go("StartDiary")
   *   if myMarker = "Leave" then go("Start")
   *   if myMarker = "suit" then go("suit")
   *
   * BehaviorScript 5: go(the myMarker of gDir)
   * BehaviorScript 6/7: go("leave")
   */
  executeMarkerFlow () {
    switch (this.myMarker) {
      case 'Diary':
        // Lingo: go("StartDiary")
        this.playDiarySequence()
        break
      case 'suit':
        // Lingo: go("suit")
        this.playSuitSequence()
        break
      case 'Leave':
      case 'leave':
      default:
        // Lingo: go("Start") — standard Salka pickup flow
        this.playStandardSequence()
        break
    }
  }

  /**
   * Standard Salka pickup — Lingo go("Start")
   * Mulle talks about Salka, then blinks her away
   */
  playStandardSequence () {
    this.game.mulle.actors.mulle.talk('85d002v0', () => {
      this.completeSalkaSequence()
    })
  }

  /**
   * Diary found sequence — Lingo go("StartDiary")
   * Narrator intro (85d001v0), then Mulle talks, then pickup
   */
  playDiarySequence () {
    // Narrator/intro audio first
    this.playDialogue('85d001v0', () => {
      // Then standard Mulle dialogue about Salka
      this.game.mulle.actors.mulle.talk('85d002v0', () => {
        this.completeSalkaSequence()
      })
    })
  }

  /**
   * Suit found sequence — Lingo go("suit")
   * Play suit-related dialogue, then complete
   */
  playSuitSequence () {
    // Play narrator intro for suit marker
    this.playDialogue('85d001v0', () => {
      this.game.mulle.actors.mulle.talk('85d002v0', () => {
        this.completeSalkaSequence()
      })
    })
  }

  /**
   * Complete the Salka pickup — common ending for all marker paths.
   *
   * Sets cutscene, caches dog state, completes mission 1,
   * blinks Salka away, returns to world.
   *
   * Lingo: BehaviorScript 6/7 exitFrame → go("leave")
   */
  completeSalkaSequence () {
    this.game.mulle.activeCutscene = '00b008v0'

    this.game.mulle.user.Car.addCache('#GotDogOnce')
    this.game.mulle.user.Car.addCache('#Dog')

    // Mission 1 completed: Bring back Salka
    if (this.game.mulle.missions) {
      this.game.mulle.missions.markAsCompleted(1)
    }

    new blinkThing(this.game, this.salka, () => {
      this.leaveScene()
    }, this)
  }

  /**
   * Handle click on Salka NPC.
   * Plays idle bark sound if not already talking.
   */
  onSalkaClick () {
    if (this.isTalking) return
    // Re-trigger Salka idle sound on click
    this.game.mulle.playAudio('85e001v0')
  }

  /**
   * Play a dialogue audio clip with completion callback.
   * Lingo: MovieScript 10 CuePassed handler advances frames on audio cue.
   *
   * @param {string} dialogueId - Audio clip ID (e.g. '85d001v0')
   * @param {Function} [onComplete] - Called when audio finishes
   */
  playDialogue (dialogueId, onComplete) {
    this.isTalking = true
    var audio = this.game.mulle.playAudio(dialogueId, () => {
      this.isTalking = false
      if (onComplete) onComplete()
    })
    if (!audio) {
      this.isTalking = false
      if (onComplete) {
        this.game.time.events.add(2000, onComplete)
      }
    }
  }

  /**
   * Leave the scene — Lingo: go("leave")
   * BehaviorScript 6 and 7 both route here.
   */
  leaveScene () {
    this.game.state.start('world')
  }

  shutdown () {
    this.game.mulle.stopAudio('85e001v0')
    this.salka = null
    this.car = null

    super.shutdown()
  }
}

export default RoadDogState
