import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'

/**
 * Saftfabrik scene (Scene 87 — Juice factory / Diving location)
 *
 * Lingo source: decompiled_lingo/87/87/casts/Internal/
 *   - ParentScript 1 - Dir.ls: Mission 23/12, medal 5, part 979
 *   - BehaviorScript 3: go(the frame) — loop
 *   - BehaviorScript 7: go(the frame) — loop
 *   - BehaviorScript 8: go(the myMarker of gDir) — route to marker
 *   - BehaviorScript 9: go(the frame) — loop
 *   - BehaviorScript 10: go(the frame) — loop
 *
 * Mission flow (Dir.ls startMovie):
 *   myDummyPart = 25
 *   Always: addCompletedMission(user, 23)
 *
 *   1. If has #helmet AND has #Suit:
 *        complete M12, add Medal 5
 *        if not gotPart(979) → givePart = 979, addNewPart(979)
 *        else → givePart = getRandomPart(externalParts)
 *        marker = "JustDoit"
 *   2. Else: marker = "cantDoit"
 *
 *   Routing:
 *     if getCompletedMissionInfo(user, 23, #count) >= 2 → go(myMarker)
 *     else → go("start")
 *
 * Dir.ls init:
 *   spriteList = [#BoatStart: 5, #Sky: 1]
 *   setSky(the weather of gMulleGlobals)
 *   drawBoat(point(355, 150), VOID, VOID, 0)
 */
class SaftfabrikState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('saftfabrik', 'assets/saftfabrik.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '87.DXR'

    this.game.mulle.addAudio('saftfabrik')

    this.car = null
    this.isTalking = false

    // Lingo: cursor(200)
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    // === SKY (Lingo: setSky) ===
    this.setupSky()

    // Existing car-game state checks
    var hasLemonade = this.game.mulle.user.Car.hasCache('#Lemonade')
    var hasTank = this.game.mulle.user.Car.hasPart(172)

    // === BACKGROUND (member 208) ===
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 208)
    this.game.add.existing(background)

    // === MULLE NPC ===
    var mulle = new MulleActor(this.game, 496, 332, 'mulleDefault')
    mulle.talkAnimation = 'talkRegular'
    mulle.silenceAnimation = 'idle'
    this.game.add.existing(mulle)
    this.game.mulle.actors.mulle = mulle

    // === VEHICLE ===
    // Lingo Dir.ls init: drawBoat(point(355, 150), VOID, VOID, 0)
    this.car = new MulleBuildCar(this.game, 217, 335, null, true, false)
    this.game.add.existing(this.car)

    // === GARSON NPC ===
    var garson = new MulleActor(this.game, 537, 218, 'garson')
    garson.talkAnimation = 'talk'
    garson.silenceAnimation = 'idle'
    this.game.add.existing(garson)
    this.game.mulle.actors.garson = garson

    // === LINGO MISSION LOGIC (Dir.ls startMovie) ===
    // Always complete mission 23 on visit
    this.processMission23()

    // Determine mission marker from helmet/suit inventory
    this.myMarker = this.determineMissionMarker()
    console.log('[Saftfabrik] Mission marker:', this.myMarker)

    // === DIALOGUE FLOW ===
    // Route based on car-game lemonade state AND boat-game mission state

    if (hasLemonade) {
      // "nu är ju saftfabriken stängd" branch
      mulle.talk('87d007v0', () => {
        this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
          this.leaveScene()
        })
      })
      return
    }

    // Check if this is an early visit (Lingo: count < 2 → go("start"))
    var visitCount = this.getMission23Count()

    if (visitCount < 2 && this.myMarker !== 'JustDoit') {
      // First visits: play start/intro sequence (87d001v0 narrator)
      this.playDialogue('87d001v0', () => {
        this.executeGarsonFlow(garson, mulle, hasTank)
      })
    } else {
      // Later visits or success: go directly to marker flow
      this.executeGarsonFlow(garson, mulle, hasTank)
    }
  }

  /**
   * Lingo Dir.ls: setSky(the weather of gMulleGlobals)
   * spriteList = [#BoatStart: 5, #Sky: 1]
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
   * Lingo Dir.ls: addCompletedMission(user, 23) — always on visit.
   */
  processMission23 () {
    var user = this.game.mulle.user
    if (user && typeof user.addCompletedMission === 'function') {
      user.addCompletedMission(23)
      console.log('[Saftfabrik] Mission 23 completed (visit tracked)')
    }
  }

  /**
   * Get mission 23 completion count.
   * Lingo: getCompletedMissionInfo(user, 23, #count)
   *
   * @returns {number}
   */
  getMission23Count () {
    var user = this.game.mulle.user
    if (user && typeof user.getCompletedMissionInfo === 'function') {
      var info = user.getCompletedMissionInfo(23, 'count')
      if (typeof info === 'object' && info !== null) return info.count || 0
      if (typeof info === 'number') return info
    }
    return 0
  }

  /**
   * Lingo Dir.ls startMovie — mission marker determination.
   *
   *   if isInInventory(user, #helmet) then
   *     if isInInventory(user, #Suit) then
   *       addCompletedMission(user, 12)
   *       if gotPart(user, 979) = 0 then
   *         set givePart to 979
   *         addNewPart(user, 979)
   *       else
   *         set givePart to getRandomPart(externalParts)
   *       end if
   *       set myMarker to "JustDoit"
   *       addMedal(boat, 5)
   *     else
   *       set myMarker to "cantDoit"
   *     end if
   *   else
   *     set myMarker to "cantDoit"
   *   end if
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    var user = this.game.mulle.user
    if (!user || typeof user.isInInventory !== 'function') return 'cantDoit'

    var hasHelmet = user.isInInventory('#helmet') || user.isInInventory('helmet')
    var hasSuit = user.isInInventory('#Suit') || user.isInInventory('Suit')

    if (hasHelmet && hasSuit) {
      // Complete mission 12
      user.addCompletedMission(12)
      console.log('[Saftfabrik] Mission 12 completed — has diving equipment')

      // Give part 979 or random
      if (typeof user.hasBoatPart === 'function' && !user.hasBoatPart(979)) {
        this.givePart = 979
        user.addNewPart(979)
        console.log('[Saftfabrik] Part 979 given')
      } else {
        var randomPart = typeof user.getRandomRewardPart === 'function'
          ? user.getRandomRewardPart()
          : null
        if (randomPart) {
          this.givePart = randomPart
          // Random part not added via addNewPart in original for infinite path
        }
      }

      // Award Medal 5
      if (typeof user.addMedal === 'function') {
        user.addMedal(5)
        console.log('[Saftfabrik] Medal 5 (Duik-medaille) awarded')
      }

      return 'JustDoit'
    }

    return 'cantDoit'
  }

  /**
   * Execute the garson dialogue flow (existing car-game behavior + Lingo routing).
   *
   * Garson talks first, then branches on tank/lemonade state.
   *
   * @param {MulleActor} garson - Garson NPC
   * @param {MulleActor} mulle - Mulle NPC
   * @param {boolean} hasTank - Whether car has fuel tank part
   */
  executeGarsonFlow (garson, mulle, hasTank) {
    garson.talk('87d002v0', () => {
      if (hasTank) {
        // "jomenvisst" — Mulle accepts
        mulle.talk('87d004v0', () => {
          // Splash animation (members 26-29, 4 frames)
          var splash = new MulleSprite(this.game, 320, 241)
          splash.setDirectorMember(this.DirResource, 26)
          this.game.add.existing(splash)

          var f = []
          for (var i = 0; i < 4; i++) f.push([this.DirResource, 26 + i])
          splash.addAnimation('idle', f, 5, true)
          splash.animations.play('idle')

          // Splash sound (87e001v0)
          this.game.mulle.playAudio('87e001v0', () => {
            splash.destroy()

            // "nu kör du bara rakt fram" — Garson gives directions
            garson.talk('87d005v0', () => {
              // "uppfattat" — Mulle acknowledges
              mulle.talk('87d006v0', () => {
                this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
                  this.leaveScene()
                })
              })
            })
          })
        })

        // Mark lemonade fetched
        this.game.mulle.user.Car.addCache('#Lemonade')
      } else {
        // "nja" — no tank
        mulle.talk('87d003v0', () => {
          this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            this.leaveScene()
          })
        })
      }
    })
  }

  /**
   * Play a dialogue audio clip.
   * Lingo: BehaviorScript 8 go(the myMarker of gDir) routes after dialogue.
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
   * Leave scene — Lingo: BehaviorScript exitFrame patterns → go("leave")
   */
  leaveScene () {
    this.game.state.start('world')
  }

  shutdown () {
    this.game.mulle.stopAudio('87e001v0')

    this.game.mulle.actors.mulle = null
    if (this.game.mulle.actors.garson) {
      this.game.mulle.actors.garson = null
    }
    this.sky = null
    this.car = null

    super.shutdown()
  }
}

export default SaftfabrikState
