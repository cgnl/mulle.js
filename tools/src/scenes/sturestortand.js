import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'

/**
 * Sture Stortand scene (Scene 88 — Whale watching with Sture)
 *
 * Lingo source: decompiled_lingo/88/88/casts/Internal/
 *   - ParentScript 1 - Dir.ls: Mission 24 logic, Fishingrod reward
 *   - BehaviorScript 3: go(the frame) — loop
 *   - BehaviorScript 5: go(the myMarker of gDir) — route to marker
 *   - BehaviorScript 6: go("leave") — exit scene
 *
 * Dir.ls init:
 *   spriteList = [#BoatStart: 6, #Sky: 1]
 *   setSky(the weather of gMulleGlobals)
 *   drawBoat(point(340, 280))
 *
 * Mission flow (Dir.ls startMovie):
 *   1. If M24 completed → marker "Done"
 *   2. Else if M11 completed:
 *        if Watertank → complete M24, setInInventory(#Fishingrod, [:]),
 *                        marker "JustDoit"
 *        else → marker "cantDoIt"
 *   3. Else → marker "cantDoIt"
 *
 *   Routing (Lingo case-insensitive):
 *     if myMarker <> "cantDoiT" → go(myMarker)
 *     else → go("start")
 */
class StureStortandState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('sturestortand', 'assets/sturestortand.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '88.DXR'

    this.game.mulle.addAudio('sturestortand')

    this.car = null
    this.isTalking = false

    // Lingo: cursor(200)
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    // === SKY (Lingo: setSky(the weather of gMulleGlobals)) ===
    this.setupSky()

    // Existing car-game state checks
    var hasLemonade = this.game.mulle.user.Car.hasCache('#Lemonade')
    var hasTank = this.game.mulle.user.Car.hasPart(172)

    // === BACKGROUND ===
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, hasLemonade ? 32 : 40)
    this.game.add.existing(background)

    // === MULLE NPC ===
    var mulle = new MulleActor(this.game, 351, 234, 'mulleDefault')
    mulle.talkAnimation = 'talkRegular'
    mulle.silenceAnimation = 'idle'
    this.game.add.existing(mulle)
    this.game.mulle.actors.mulle = mulle
    mulle.scale.x = -1

    // === VEHICLE ===
    // Lingo Dir.ls init: drawBoat(point(340, 280))
    this.car = new MulleBuildCar(this.game, 41, 301, null, true, false)
    this.game.add.existing(this.car)

    // === LINGO MISSION LOGIC (Dir.ls startMovie) ===
    this.myMarker = this.determineMissionMarker()
    console.log('[StureStortand] Mission marker:', this.myMarker)

    // === STURE NPC + DIALOGUE FLOW ===
    if (hasLemonade) {
      // --- Lemonade delivery path (car-game) ---
      this.setupLemonadeFlow(mulle)
    } else {
      // --- Standard / request path ---
      this.setupStandardFlow(mulle, hasTank)
    }

    // === AMBIENT AUDIO ===
    // 88e001v0 — background loop
    this.game.mulle.playAudio('88e001v0')
  }

  /**
   * Lingo Dir.ls: setSky(the weather of gMulleGlobals)
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
   * Lingo ParentScript 1 - Dir.ls startMovie — mission 24 logic.
   *
   *   if isMissionCompleted(user, 24) then
   *     set myMarker to "Done"
   *   else
   *     if isMissionCompleted(user, 11) then
   *       if getProperty(tmpBoat, #Watertank) then
   *         set myMarker to "JustDoit"
   *         addCompletedMission(user, 24)
   *         setInInventory(user, #Fishingrod, [:])
   *       else
   *         set myMarker to "cantDoIt"
   *       end if
   *     else
   *       set myMarker to "cantDoIt"
   *     end if
   *   end if
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    var user = this.game.mulle.user
    if (!user || typeof user.isMissionCompleted !== 'function') return 'cantDoIt'

    if (user.isMissionCompleted(24)) {
      return 'Done'
    }

    if (user.isMissionCompleted(11)) {
      // Check boat Watertank property
      var tmpBoat = user.Car || user.Boat || {}
      var hasWatertank = typeof tmpBoat.getProperty === 'function'
        ? tmpBoat.getProperty('watertank', 0) > 0
        : false

      if (hasWatertank) {
        // Complete mission 24
        user.addCompletedMission(24)
        // Give Fishingrod
        user.setInInventory('#Fishingrod', {})
        console.log('[StureStortand] Mission 24 completed — Fishingrod given')
        return 'JustDoit'
      } else {
        return 'cantDoIt'
      }
    }

    return 'cantDoIt'
  }

  /**
   * Lemonade delivery flow — Sture is happy, rewards a part.
   *
   * @param {MulleActor} mulle
   */
  setupLemonadeFlow (mulle) {
    // Tube/drinking animation (members 17-23, 7 frames)
    var tube = new MulleSprite(this.game, 304, 245)
    tube.setDirectorMember(this.DirResource, 17)
    this.game.add.existing(tube)

    var f = []
    for (let i = 0; i < 7; i++) f.push([this.DirResource, 17 + i])
    tube.addAnimation('idle', f, 5, true)
    tube.animations.play('idle')

    // Happy Sture
    var sture = new MulleActor(this.game, 285, 162, 'stureHappy')
    sture.talkAnimation = 'talk'
    sture.silenceAnimation = 'idle'
    this.game.add.existing(sture)
    this.game.mulle.actors.sture = sture

    // Make Sture clickable
    sture.inputEnabled = true
    sture.events.onInputOver.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = 'Point'
    })
    sture.events.onInputOut.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = null
    })

    // "tackar tackar, mera saft och kalaset"
    sture.talk('88d005v0', () => {
      // "men så bra, den kommer nog väl till pass"
      mulle.talk('88d006v0', () => {
        // Reward: part 162
        this.game.mulle.user.addPart('yard', 162)
        this.game.mulle.user.Car.removeCache('#Lemonade')

        // Mission 3 completed: Lemonade party
        if (this.game.mulle.missions) {
          this.game.mulle.missions.markAsCompleted(3)
        }

        this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
          this.leaveScene()
        })
      })
    })
  }

  /**
   * Standard flow — Sture has a problem, needs help.
   *
   * Also integrates Lingo marker flow for mission 24.
   *
   * @param {MulleActor} mulle
   * @param {boolean} hasTank
   */
  setupStandardFlow (mulle, hasTank) {
    // Sad Sture
    var sture = new MulleActor(this.game, 285, 162, 'stureSad')
    sture.talkAnimation = 'talk'
    sture.silenceAnimation = 'idle'
    this.game.add.existing(sture)
    this.game.mulle.actors.sture = sture

    // Make Sture clickable
    sture.inputEnabled = true
    sture.events.onInputOver.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = 'Point'
    })
    sture.events.onInputOut.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = null
    })

    // Determine dialogue based on Lingo marker
    if (this.myMarker === 'Done') {
      // Already completed — short "done" dialogue
      // 88d001v0 is the intro/done dialogue
      sture.talk('88d002v0', () => {
        mulle.talk('88d004v0', () => {
          this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            this.leaveScene()
          })
        })
      })
    } else if (this.myMarker === 'JustDoit') {
      // Success! Just completed mission 24
      sture.talk('88d002v0', () => {
        mulle.talk('88d004v0', () => {
          this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
            this.leaveScene()
          })
        })
      })
    } else {
      // "cantDoIt" — standard request flow
      // Lingo: go("start") for cantDoIt marker
      // "mulle, vi har ett problem"
      sture.talk('88d002v0', () => {
        if (!hasTank) {
          // "tja, jag kan ju försöka hjälpa till"
          mulle.talk('88d003v0', () => {
            this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
              this.leaveScene()
            })
          })
        } else {
          // "jajamänsan, såklart"
          mulle.talk('88d004v0', () => {
            this.game.time.events.add(Phaser.Timer.SECOND * 1, () => {
              this.leaveScene()
            })
          })
        }
      })
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
   * Leave scene — Lingo: BehaviorScript 6 go("leave")
   */
  leaveScene () {
    this.game.state.start('world')
  }

  shutdown () {
    this.game.mulle.stopAudio('88e001v0')

    this.game.mulle.actors.mulle = null
    if (this.game.mulle.actors.sture) {
      this.game.mulle.actors.sture = null
    }
    this.car = null
    this.sky = null

    super.shutdown()
  }
}

export default StureStortandState
