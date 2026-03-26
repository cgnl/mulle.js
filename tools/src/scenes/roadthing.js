import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
// import MulleActor from '../objects/actor'
import MulleCarPart from '../objects/carpart'
import blinkThing from '../util/blinkThing'

/**
 * RoadThing scene (Scene 84 — Algae island / Viola location)
 *
 * Lingo source: decompiled_lingo/84/84/casts/Internal/
 *   - ParentScript 3 - Dir.ls: Mission 10/11/21 logic, hull-based boat positioning
 *   - BehaviorScript 1: go(the frame) — loop
 *   - BehaviorScript 2: go("leave")
 *   - BehaviorScript 4: sprite 62 visible = 1
 *   - BehaviorScript 9: hull-type boat positioning, sprite 62 visible = 0
 *   - BehaviorScript 10: go("leave")
 *   - BehaviorScript 13: go(the myMarker of gDir)
 *   - BehaviorScript 14: checks Watertank → completes M11, go("justdoItTank")
 *   - BehaviorScript 26: go("justDoittank")
 *   - BehaviorScript 91/92 - mulleLogBH: Random Mulle audio on log behavior
 *   - MovieScript 5: CuePassed → sendAllSprites(#spritecuePassed)
 *
 * Mission flow (Dir.ls startMovie):
 *   myDummyPart = 86, givePart = 30
 *   1. If M11 not completed: Watertank → "JustDoItTank" / "cantDoit"
 *   2. If M21 not completed: complete M21, give part 30, give M11;
 *      Watertank → "noMissionTank" / "nomission"
 *   3. If CombineHarvester + M10 not completed: complete M10, give #helmet,
 *      → "JustDoItWeed"
 *   4. If CombineHarvester + M10 completed: → "Done" + random(5)
 *   5. Default: → "Done" + random(5)
 *
 * Hull-type positioning (BehaviorScript 9):
 *   #large  → sprite 67 at point(280, 171)
 *   #Medium → sprite 67 at point(280, 179)
 *   #Small  → sprite 67 at point(200, 196)
 */
class RoadThingState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('roadthing', 'assets/roadthing.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '84.DXR'

    this.game.mulle.addAudio('roadthing')

    this.car = null
    this.isTalking = false

    // Lingo: cursor(200)
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    // === SKY (Lingo: setSky(the weather of gMulleGlobals)) ===
    // Lingo Dir.ls: spriteList to [#BoatStart: 14, #Sky: 1]
    this.setupSky()

    // === BACKGROUND (member 25) ===
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 25)
    this.game.add.existing(background)

    // === VEHICLE ===
    // Lingo Dir.ls init: hull-type dependent positioning
    // #large → point(280, 170), #Medium → point(280, 170), #Small → point(200, 190)
    var boatPos = this.getHullPosition()
    this.car = new MulleBuildCar(this.game, boatPos.x, boatPos.y, null, true, true)
    this.game.add.existing(this.car)

    // === MISSION LOGIC (Lingo ParentScript 3 - Dir.ls startMovie) ===
    this.myMarker = this.determineMissionMarker()
    console.log('[RoadThing] Mission marker:', this.myMarker)

    // === PART REWARD ===
    // Original roadthing gave a part from SetWhenDone; Lingo Dir.ls gives part 30 or helmet
    if (!this.game.mulle.SetWhenDone) {
      this.game.mulle.SetWhenDone = {
        Cache: ['#RoadThing1'],
        Parts: [287, '#Random']
      }
    }

    var partId = this.determineRewardPart()
    console.log('[RoadThing] Reward part:', partId)

    if (partId) {
      var part = new MulleCarPart(this.game, partId, 150, 400)
      part.input.inputEnabled = false
      part.input.disableDrag()
      this.game.add.existing(part)
      this.rewardPart = part

      this.game.mulle.user.addPart('yard', partId)
      this.game.mulle.user.Car.addCache(this.game.mulle.SetWhenDone.Cache[0])
    }

    // === DIALOGUE FLOW (marker-based) ===
    this.executeMarkerFlow(partId)
  }

  /**
   * Lingo Dir.ls init: setSky(the weather of gMulleGlobals)
   */
  setupSky () {
    var sky = new MulleSprite(this.game, 320, 240)
    var loaded = sky.setDirectorMember('00.CXT', '00b011v0')
    if (loaded) {
      this.game.add.existing(sky)
      this.sky = sky
    }
  }

  /**
   * Lingo BehaviorScript 9: hull-type boat positioning.
   *
   *   if tmpBoat = #large then loc = point(280, 171)
   *   if tmpBoat = #Medium then loc = point(280, 179)
   *   if tmpBoat = #Small then loc = point(200, 196)
   *
   * @returns {{ x: number, y: number }}
   */
  getHullPosition () {
    var user = this.game.mulle.user
    var hullType = 'Medium'

    // Try to get hull type from boat view handler
    if (user && user.Boat && typeof user.Boat.getProperty === 'function') {
      var hull = user.Boat.getProperty('hullType', 0)
      if (hull === 'large' || hull === 3) hullType = 'large'
      else if (hull === 'Small' || hull === 1) hullType = 'Small'
    }

    switch (hullType) {
      case 'large': return { x: 280, y: 171 }
      case 'Small': return { x: 200, y: 196 }
      case 'Medium':
      default: return { x: 280, y: 179 }
    }
  }

  /**
   * Lingo ParentScript 3 - Dir.ls startMovie
   *
   * Full mission logic:
   *   myDummyPart = 86, givePart = 30
   *   tmpBoat = getBoat(user)
   *
   *   1. if M11 not completed:
   *        if Watertank → complete M11, "JustDoItTank"
   *        else → "cantDoit"
   *   2. if M21 not completed:
   *        complete M21, addNewPart(30), addGivenMission(11)
   *        if Watertank → complete M11, "noMissionTank"
   *        else → "nomission"
   *   3. if CombineHarvester:
   *        if M10 not completed → complete M10, give #helmet, "JustDoItWeed"
   *        else → "Done" + random(5)
   *   4. default: "Done" + random(5)
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    var user = this.game.mulle.user
    if (!user || typeof user.isMissionCompleted !== 'function') return 'Done1'

    var myMarker = null
    var tmpBoat = user.Car || user.Boat || {}
    var hasWatertank = typeof tmpBoat.getProperty === 'function'
      ? tmpBoat.getProperty('watertank', 0) > 0
      : false
    var hasCombineHarvester = typeof tmpBoat.getProperty === 'function'
      ? tmpBoat.getProperty('combineHarvester', 0) > 0
      : false

    // Block 1: M11 check
    if (!user.isMissionCompleted(11)) {
      if (hasWatertank) {
        user.addCompletedMission(11)
        myMarker = 'JustDoItTank'
      } else {
        myMarker = 'cantDoit'
      }
    }

    // Block 2: M21 check (overwrites if applicable)
    if (!user.isMissionCompleted(21)) {
      if (hasWatertank) {
        user.addCompletedMission(11)
        myMarker = 'noMissionTank'
      } else {
        myMarker = 'nomission'
      }
      user.addCompletedMission(21)
      user.addNewPart(30)
      user.addGivenMission(11)
    }

    // Block 3: CombineHarvester check (overwrites if applicable)
    if (hasCombineHarvester) {
      if (!user.isMissionCompleted(10)) {
        user.addCompletedMission(10)
        user.setInInventory('#helmet', [])
        myMarker = 'JustDoItWeed'
      } else {
        myMarker = 'Done' + (Math.floor(Math.random() * 5) + 1)
      }
    }

    // Block 4: Default
    if (myMarker === null) {
      myMarker = 'Done' + (Math.floor(Math.random() * 5) + 1)
    }

    return myMarker
  }

  /**
   * Determine which part to give as reward.
   * Uses SetWhenDone.Parts list, or Lingo givePart = 30.
   *
   * @returns {number|null}
   */
  determineRewardPart () {
    var partId = null

    for (var i of this.game.mulle.SetWhenDone.Parts) {
      if (i === '#Random') {
        i = this.game.mulle.user.getRandomPart()
      } else {
        if (this.game.mulle.user.hasPart(i)) continue
      }
      partId = i
      break
    }

    return partId
  }

  /**
   * Execute marker-based dialogue flow.
   *
   * Lingo markers and their dialogue:
   *   - "JustDoItTank" / "justdoItTank": Success with water tank
   *   - "cantDoit": Missing water tank
   *   - "noMissionTank": First visit with tank
   *   - "nomission": First visit without tank
   *   - "JustDoItWeed": Success with combine harvester
   *   - "Done1"-"Done5": Random return visit dialogue
   *
   * BehaviorScript 91/92 (mulleLogBH): Random Mulle audio from soundList:
   *   ["04d029v0", "84e007v0", "04d027v0"]  (BS91)
   *   ["04d029v0", "05d109v0", "83d019v0", "84e007v0", "04d027v0"]  (BS92)
   *
   * @param {number|null} partId - Reward part ID
   */
  executeMarkerFlow (partId) {
    var marker = this.myMarker

    // Select dialogue based on marker
    var dialogueId = this.getMarkerDialogue(marker)

    // Play Mulle log behavior audio (BehaviorScript 91/92)
    this.playMulleLogAudio()

    // Play main dialogue, then blink reward part and leave
    this.game.mulle.actors.mulle.talk(dialogueId, () => {
      if (this.rewardPart) {
        new blinkThing(this.game, this.rewardPart, () => {
          this.leaveScene()
        }, this)
      } else {
        this.game.time.events.add(500, () => {
          this.leaveScene()
        })
      }
    })
  }

  /**
   * Get dialogue ID for a given marker.
   *
   * Dialogue mapping based on Lingo frame labels:
   *   84d001v0 - Main dialogue
   *   84e007v0 - Ambient/idle sound
   *   04d029v0, 04d027v0 - Shared Mulle dialogue
   *   05d109v0 - Shared dialogue
   *   83d019v0 - Shared dialogue
   *
   * @param {string} marker
   * @returns {string}
   */
  getMarkerDialogue (marker) {
    if (marker === 'JustDoItTank' || marker === 'justdoItTank') {
      return '84d001v0'
    }
    if (marker === 'cantDoit') {
      return '84d001v0'
    }
    if (marker === 'JustDoItWeed') {
      return '84d001v0'
    }
    if (marker === 'noMissionTank' || marker === 'nomission') {
      return '84d001v0'
    }
    // Done1-Done5 (return visits)
    return '84d001v0'
  }

  /**
   * Lingo BehaviorScript 91/92 - mulleLogBH
   *
   * Plays random Mulle audio from a sound list on beginSprite.
   *   BS91 soundList: ["04d029v0", "84e007v0", "04d027v0"]
   *   BS92 soundList: ["04d029v0", "05d109v0", "83d019v0", "84e007v0", "04d027v0"]
   *
   * If random(2) != 1 → play "84e007v0" (idle sound)
   * else → play random from soundList
   */
  playMulleLogAudio () {
    var soundList = ['04d029v0', '84e007v0', '04d027v0', '05d109v0', '83d019v0']
    var tmpRnd = Math.floor(Math.random() * 3) + 1

    if (tmpRnd !== 1) {
      // Play idle sound
      this.game.mulle.playAudio('84e007v0')
    } else {
      // Play random from list
      var idx = Math.floor(Math.random() * soundList.length)
      this.game.mulle.playAudio(soundList[idx])
    }
  }

  /**
   * Play a dialogue audio clip.
   *
   * @param {string} dialogueId
   * @param {Function} [onComplete]
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
   * Leave scene — Lingo: BehaviorScript 2/10 go("leave")
   */
  leaveScene () {
    this.game.state.start('world')
  }

  shutdown () {
    this.game.mulle.stopAudio('84e007v0')
    this.car = null
    this.rewardPart = null
    this.sky = null

    super.shutdown()
  }
}

export default RoadThingState
