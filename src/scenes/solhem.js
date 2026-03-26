import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'

/**
 * Solhem scene (Scene 86 — Sven cave / Solhem location)
 *
 * Lingo source: decompiled_lingo/86/86/casts/Internal/
 *   - ParentScript 1 - Dir.ls: Mission 4/8 logic, medal 1, Blinddog, MapPiece3
 *   - BehaviorScript 3: go(the myMarker of gDir)
 *   - BehaviorScript 4: go(the myMarker of gDir)
 *   - BehaviorScript 5: go(the frame) — loop
 *   - BehaviorScript 19: deleteDog(gDir) on beginSprite, go(the frame)
 *   - BehaviorScript 20: go("leave")
 *   - BehaviorScript 67 - BatBH: Bat flight animation with physics
 *   - CastScript 74: mouseUp → sendSprite(18, #randomMove, 2)
 *
 * Dir.ls init:
 *   spriteList = [#BoatStart: 6]
 *   cursor(200)
 *
 * Mission flow (Dir.ls startMovie):
 *   myDummyPart = 13, givePart = 975
 *   set myMarker to "noMission"
 *
 *   Block 1 — M8 check:
 *     if M8 given → "done"
 *     else if M8 not completed → give MapPiece3, give M8
 *     else → "done"
 *
 *   Block 2 — M4 completed override:
 *     if M4 completed → "done"
 *
 *   Block 3 — Blinddog delivery (only if M8 completed):
 *     if M8 completed:
 *       if M4 completed → "done"
 *       else if M4 given:
 *         if has #Blinddog → complete M4, delete #Blinddog,
 *           give M10, give part 975 (if not owned) → "JustDoIT"
 *         else → "CantDoIT"
 *
 *   Block 4 — Medal 1:
 *     if no medal 1 → addMedal(1), go("medalStart")
 *     else → go(myMarker)
 *
 *   Dir.ls deleteDog handler:
 *     deleteFromInventory(user, #Blinddog)
 *
 * Bat (BehaviorScript 67 - BatBH):
 *   spriteList = ["86a002v0", "86a002v1"]
 *   mode: #Still / #flyRight / #flyLeft
 *   StartPoint: point(-40, 40) for flyRight, point(680, 40) for flyLeft
 *   EndPoint: 680 for flyRight, -40 for flyLeft
 *   Movement: myPoint +/- point(15, altitude), altitude oscillation
 *   Flap: flapMod 0-4 cycling, member = theMember & flapMod
 *   randomMove: random(200) = 1 triggers flight
 *
 * CastScript 74: mouseUp → sendSprite(18, #randomMove, 2) (click triggers bat)
 */
class SolhemState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('solhem', 'assets/solhem.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '86.DXR'

    this.game.mulle.addAudio('solhem')

    this.car = null
    this.isTalking = false

    // Lingo: cursor(200)
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    // === BACKGROUND (member 1) ===
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 1)
    this.game.add.existing(background)

    // === LINGO MISSION LOGIC (Dir.ls startMovie) ===
    this.myMarker = this.determineMissionMarker()
    console.log('[Solhem] Mission marker:', this.myMarker, '→ goTo:', this.goTo)

    // === MEDAL 1 CHECK (Dir.ls final block) ===
    this.checkMedal1()

    // === BAT ANIMATION (BehaviorScript 67 - BatBH) ===
    this.setupBat()

    // === EXISTING CAR-GAME FLOW ===
    var hasLadder = this.game.mulle.user.Car.hasPart(173)

    if (!this.game.mulle.user.hasStuff('#FerryTicket')) {
      this.setupFirstVisitFlow(hasLadder)
    } else {
      this.setupReturnVisitFlow()
    }

    // === AMBIENT AUDIO ===
    // 86e005v0 — bg loop
    this.game.mulle.playAudio('86e005v0')
  }

  /**
   * Lingo ParentScript 1 - Dir.ls startMovie — full mission 4/8 logic.
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    var user = this.game.mulle.user
    if (!user || typeof user.isMissionCompleted !== 'function') {
      this.goTo = 'noMission'
      return 'noMission'
    }

    var myMarker = 'noMission'

    // Block 1: M8 check
    if (user.isMissionGiven(8)) {
      myMarker = 'done'
    } else {
      if (!user.isMissionCompleted(8)) {
        // First visit: give MapPiece3, give M8
        user.setInInventory('#MapPiece3', [])
        user.addGivenMission(8)
        console.log('[Solhem] MapPiece3 given, mission 8 assigned')
      } else {
        myMarker = 'done'
      }
    }

    // Block 2: M4 completed override
    if (user.isMissionCompleted(4)) {
      myMarker = 'done'
    }

    // Block 3: Blinddog delivery (only when M8 completed)
    if (user.isMissionCompleted(8)) {
      if (user.isMissionCompleted(4)) {
        myMarker = 'done'
      } else {
        if (user.isMissionGiven(4)) {
          if (user.isInInventory('#Blinddog')) {
            // Complete mission 4
            user.addCompletedMission(4)
            // Delete Blinddog from inventory
            if (typeof user.deleteFromInventory === 'function') {
              user.deleteFromInventory('#Blinddog')
            } else if (typeof user.removeFromInventory === 'function') {
              user.removeFromInventory('#Blinddog')
            }
            // Give mission 10
            user.addGivenMission(10)
            // Give part 975 if not owned
            if (typeof user.hasBoatPart === 'function' && !user.hasBoatPart(975)) {
              user.addNewPart(975)
              console.log('[Solhem] Part 975 given')
            }
            myMarker = 'JustDoIT'
            console.log('[Solhem] Mission 4 completed — Blinddog delivered')
          } else {
            myMarker = 'CantDoIT'
          }
        }
      }
    }

    // Store goTo for medal check
    this.goTo = myMarker
    return myMarker
  }

  /**
   * Lingo Dir.ls — Medal 1 check (final block of startMovie).
   *
   *   if getMedal(boat, 1) = 0 then
   *     addMedal(boat, 1)
   *     go("medalStart")
   *   else
   *     go(myMarker)
   *   end if
   */
  checkMedal1 () {
    var user = this.game.mulle.user
    if (!user || typeof user.hasMedal !== 'function') return

    if (!user.hasMedal(1)) {
      user.addMedal(1)
      this.goTo = 'medalStart'
      console.log('[Solhem] Medal 1 (Lange-afstands-medaille) awarded — go medalStart')
    }
    // else goTo stays as myMarker
  }

  /**
   * Lingo Dir.ls deleteDog handler.
   * Called by BehaviorScript 19 on beginSprite.
   *
   *   on deleteDog me
   *     deleteFromInventory(user, #Blinddog)
   *   end
   */
  deleteDog () {
    var user = this.game.mulle.user
    if (typeof user.deleteFromInventory === 'function') {
      user.deleteFromInventory('#Blinddog')
    } else if (typeof user.removeFromInventory === 'function') {
      user.removeFromInventory('#Blinddog')
    }
  }

  /**
   * Lingo BehaviorScript 67 — BatBH setup.
   *
   * Creates a bat sprite that flies across the scene.
   * spriteList: ["86a002v0", "86a002v1"]
   * StartPoint: point(-40, 40) for flyRight, point(680, 40) for flyLeft
   * Flight speed: 15px per frame, altitude oscillation
   *
   * CastScript 74: mouseUp on background triggers sendSprite(18, #randomMove, 2)
   */
  setupBat () {
    // Create bat sprite (starts offscreen per Lingo: point(5000, 5000))
    this.bat = new MulleSprite(this.game, 5000, 5000)
    this.bat.setDirectorMember(this.DirResource, 69) // 86a002v0 base frame
    this.game.add.existing(this.bat)

    // Bat flight state (from BatBH properties)
    this.batMode = 'Still'
    this.batPoint = { x: 5000, y: 5000 }
    this.batAltitude = 3
    this.batFlapMod = 0
    this.batAlterFlap = 1
    this.batTopPoint = 10 + Math.floor(Math.random() * 50)
    this.batLowPoint = 150 + Math.floor(Math.random() * 50)
    this.batEndPoint = 0

    // Setup bat animation frames
    this.setupBatAnimations()

    // Lingo: random(200) = 1 triggers flight — check periodically
    this.batTimer = this.game.time.events.loop(100, () => {
      this.updateBat()
    })

    // CastScript 74: clicking background triggers bat flight
    // (Background already exists, make it clickable)
    var clickArea = this.game.add.graphics(0, 0)
    clickArea.beginFill(0x000000, 0.01) // Nearly invisible
    clickArea.drawRect(0, 0, 640, 200) // Top portion of screen (sky/cave area)
    clickArea.endFill()
    clickArea.inputEnabled = true
    clickArea.events.onInputUp.add(() => {
      // Lingo: sendSprite(18, #randomMove, 2)
      this.batRandomMove(2)
    })
  }

  /**
   * Setup bat animation frames.
   * Lingo: spriteList = ["86a002v0", "86a002v1"]
   * Members 69-73 (direction 0), members 82-86 (direction 1)
   */
  setupBatAnimations () {
    var b = this.DirResource

    // flyRight: 86a002v1 (members 82-86)
    var flyRightFrames = []
    for (var i = 82; i <= 86; i++) flyRightFrames.push([b, i])
    for (var i = 85; i >= 83; i--) flyRightFrames.push([b, i])
    this.bat.addAnimation('flyRight', flyRightFrames, 12, true)

    // flyLeft: 86a002v0 (members 69-73)
    var flyLeftFrames = []
    for (var i = 69; i <= 73; i++) flyLeftFrames.push([b, i])
    for (var i = 72; i >= 70; i--) flyLeftFrames.push([b, i])
    this.bat.addAnimation('flyLeft', flyLeftFrames, 12, true)
  }

  /**
   * Lingo BatBH exitFrame — update bat movement per frame.
   *
   * If mode = #Still: random(200) = 1 → randomMove
   * If mode = #flyRight: myPoint += point(15, altitude), check bounds
   * If mode = #flyLeft: myPoint -= point(15, altitude), check bounds
   */
  updateBat () {
    if (this.batMode === 'Still') {
      // Lingo: random(200) = 1
      if (Math.floor(Math.random() * 200) === 0) {
        this.batRandomMove(2)
      }
      return
    }

    if (this.batMode === 'flyRight') {
      this.batPoint.x += 15
      this.batPoint.y += this.batAltitude
      this.bat.position.set(this.batPoint.x, this.batPoint.y)

      if (this.batPoint.x >= this.batEndPoint) {
        this.batMode = 'Still'
        this.bat.position.set(5000, 5000) // Offscreen
      }
      // Altitude oscillation
      if (this.batPoint.y <= this.batTopPoint) {
        this.batLowPoint = 150 + Math.floor(Math.random() * 50)
        this.batAltitude = Math.abs(this.batAltitude)
      }
      if (this.batPoint.y >= this.batLowPoint) {
        this.batTopPoint = 10 + Math.floor(Math.random() * 50)
        this.batAltitude = -Math.abs(this.batAltitude)
      }
    }

    if (this.batMode === 'flyLeft') {
      this.batPoint.x -= 15
      this.batPoint.y -= this.batAltitude
      this.bat.position.set(this.batPoint.x, this.batPoint.y)

      if (this.batPoint.x <= this.batEndPoint) {
        this.batMode = 'Still'
        this.bat.position.set(5000, 5000)
      }
      if (this.batPoint.y <= this.batTopPoint) {
        this.batLowPoint = 150 + Math.floor(Math.random() * 30)
        this.batAltitude = Math.abs(this.batAltitude)
      }
      if (this.batPoint.y >= this.batLowPoint) {
        this.batTopPoint = 10 + Math.floor(Math.random() * 50)
        this.batAltitude = -Math.abs(this.batAltitude)
      }
    }
  }

  /**
   * Lingo BatBH randomMove handler.
   *
   *   case tempRnd of
   *     1: mode = #flyRight, StartPoint = point(-40, 40), EndPoint = 680
   *     2: mode = #flyLeft, StartPoint = point(680, 40), EndPoint = -40
   *   end case
   *
   * @param {number} maxRnd - Max random range (1 or 2)
   */
  batRandomMove (maxRnd) {
    if (this.batMode !== 'Still') return

    var rnd = Math.floor(Math.random() * maxRnd) + 1

    if (rnd === 1) {
      this.batMode = 'flyRight'
      this.batPoint = { x: -40, y: 40 }
      this.batEndPoint = 680
      this.bat.animations.play('flyRight')
    } else {
      this.batMode = 'flyLeft'
      this.batPoint = { x: 680, y: 40 }
      this.batEndPoint = -40
      this.bat.animations.play('flyLeft')
    }

    this.bat.position.set(this.batPoint.x, this.batPoint.y)
  }

  /**
   * First visit flow — Mia needs help getting cat down.
   *
   * @param {boolean} hasLadder - Whether car has ladder part (173)
   */
  setupFirstVisitFlow (hasLadder) {
    var car = new MulleBuildCar(this.game, 257, 344, null, true, false)
    this.game.add.existing(car)
    this.car = car

    var mulle = new MulleActor(this.game, 350, 398, 'mulleDefault')
    mulle.animations.play('idle')
    mulle.talkAnimation = 'talkRegular'
    mulle.silenceAnimation = 'idle'
    this.game.add.existing(mulle)
    this.game.mulle.actors.mulle = mulle

    var miaBody = new MulleActor(this.game, 277, 246, 'miaBody')
    miaBody.animations.play('idle')
    miaBody.talkAnimation = 'talk'
    miaBody.silenceAnimation = 'idle'
    this.game.add.existing(miaBody)
    this.game.mulle.actors.miaBody = miaBody

    var miaHead = new MulleActor(this.game, 535, 336, 'miaHead')
    miaHead.animations.play('idle')
    miaHead.talkAnimation = 'talk'
    miaHead.silenceAnimation = 'idle'
    this.game.add.existing(miaHead)
    this.game.mulle.actors.miaHead = miaHead

    var cat = new MulleActor(this.game, 278, 240, 'cat')
    cat.animations.play('idle')
    this.game.add.existing(cat)
    this.game.mulle.actors.cat = cat

    // Cat sounds (86e001v0 - 86e004v0)
    // Play random cat sound on occasion
    this.catSoundTimer = this.game.time.events.loop(8000 + Math.random() * 5000, () => {
      var catSounds = ['86e001v0', '86e002v0', '86e003v0', '86e004v0']
      var idx = Math.floor(Math.random() * catSounds.length)
      this.game.mulle.playAudio(catSounds[idx])
    })

    // "åh vad bra att du kom mulle"
    miaHead.talk('86d002v0', () => {
      if (hasLadder) {
        // "jajamänsan" — Mulle has a ladder
        mulle.talk('86d004v0', () => {
          // Attach ladder to car
          if (hasLadder) {
            var ladder = new MulleSprite(this.game, 0, 0)
            ladder.setDirectorMember(this.DirResource, 3)
            ladder.sortIndex = 12
            car.add(ladder)
            car.forEach((c) => { if (c.partId === 173) c.destroy() })
            car.sortLayers()
          }

          // Cat jump sequence
          cat.animations.play('jump1').onComplete.addOnce(() => {
            miaBody.position.set(278, 240)
            miaHead.position.set(528, 337)

            miaBody.animations.play('catchIntro')
            miaHead.visible = false

            cat.animations.play('jump2').onComplete.addOnce(() => {
              cat.visible = false

              miaBody.animations.play('catchEnd').onComplete.addOnce(() => {
                miaHead.animations.play('idleCat')
                miaHead.visible = true

                miaHead.talkAnimation = 'talkCat'
                miaHead.silenceAnimation = 'idleCat'

                // "färja" — Mia offers ferry ticket
                miaHead.talk('86d005v0', () => {
                  this.game.mulle.user.addStuff('#FerryTicket')

                  // "man tackar" — Mulle thanks
                  mulle.talk('86d006v0', () => {
                    this.leaveScene()
                  })
                })
              })
            })
          })
        })
      } else {
        // "nja" — no ladder
        mulle.talk('86d003v0', () => {
          this.leaveScene()
        })
      }
    })
  }

  /**
   * Return visit flow — already helped Mia.
   */
  setupReturnVisitFlow () {
    var car = new MulleBuildCar(this.game, 257, 344, null, true, true)
    this.game.add.existing(car)
    this.car = car

    // "ja jag hjälpte mia att ta ner" — recall dialogue
    this.game.mulle.actors.mulle.talk('86d007v0', () => {
      this.leaveScene()
    })
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
   * Leave scene — Lingo: BehaviorScript 20 go("leave")
   */
  leaveScene () {
    this.game.state.start('world')
  }

  shutdown () {
    this.game.mulle.actors.mulle = null
    if (this.game.mulle.actors.miaHead) {
      this.game.mulle.actors.miaHead = null
    }
    if (this.game.mulle.actors.miaBody) {
      this.game.mulle.actors.miaBody = null
    }
    if (this.game.mulle.actors.cat) {
      this.game.mulle.actors.cat = null
    }

    this.game.mulle.stopAudio('86e005v0')

    // Stop bat timer
    if (this.batTimer) {
      this.game.time.events.remove(this.batTimer)
    }
    if (this.catSoundTimer) {
      this.game.time.events.remove(this.catSoundTimer)
    }

    this.bat = null
    this.car = null

    super.shutdown()
  }
}

export default SolhemState
