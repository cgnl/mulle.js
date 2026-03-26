import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'
import blinkThing from '../util/blinkThing'
import SubtitleLoader from '../objects/SubtitleLoader'

/**
 * TreeCar scene (Scene 83 — Mia tree island, boat ride interactions)
 *
 * Lingo source: decompiled_lingo/83/83/casts/Internal/
 *   - ParentScript 1 - Dir.ls: Mission 25/13 logic, bench check, boat ride
 *   - BehaviorScript 3: go("leave")
 *   - BehaviorScript 4: go(the myMarker of gDir)
 *   - BehaviorScript 5: go("story1")
 *   - BehaviorScript 6: go("boatride")
 *   - BehaviorScript 7: go("boatride")
 *   - BehaviorScript 9: go("justdoit2")
 *   - BehaviorScript 10: setSky + go(the frame)
 *   - BehaviorScript 23: go("infiniteJustDoIt2")
 *   - BehaviorScript 24: go("boatride2")
 *   - BehaviorScript 25: go(the frame) — loop
 *   - BehaviorScript 31: go("boatride3")
 *   - BehaviorScript 32: go("justDoITluck2")
 *   - MovieScript 8: CuePassed → sendAllSprites(#spritecuePassed)
 *
 * Dir.ls init:
 *   spriteList = [#BoatStart: 6, #Sky: 1]
 *   myDummyPart = 68
 *   setSky(the weather of gMulleGlobals)
 *
 * Mission flow (Dir.ls startMovie):
 *   drawBoat(point(310, 150))
 *   objId = getEnteredObject(world) or 23
 *   tempObj = new Object, fromList(tempObj, objId)
 *   MissionId = getSetWhenDone(tempObj, #missions)[1]
 *   tmpGiveParts = getSetWhenDone(tempObj, #parts)  → [17, 46]
 *
 *   M25 completed path (return visits):
 *     M13 given + Bench + M13 completed → "infiniteJustDoit" (random part)
 *     M13 given + Bench + M13 NOT completed → "JustdoIt" (give parts[1]=46, complete M13)
 *     M13 given + no Bench → "cantdoIT"
 *     M13 not given → "Done"
 *
 *   M25 NOT completed (first visit):
 *     complete M25, marker "nomission"
 *     give parts[0]=17, give M13
 *     if Bench → "justDoITluck" (complete M13)
 *     always go("start") (not marker)
 *
 *   Routing: nomission → go("start"), others → go(myMarker)
 */
class TreeCarState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('treecar', 'assets/treecar.json', null, this)
    this.subtitles = new SubtitleLoader(this.game, 'roadtree', ['dutch', 'english'])
    this.subtitles.preload()
  }

  create () {
    super.create()

    this.DirResource = '83.DXR'

    this.game.mulle.addAudio('treecar')
    this.subtitles.load()

    this.isTalking = false

    // Lingo: cursor(200)
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.current = null
    }

    // === SKY (Lingo BehaviorScript 10: setSky) ===
    this.setupSky()

    // === BACKGROUND (member 1) ===
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 1)
    this.game.add.existing(background)

    // === VEHICLE ===
    // Lingo Dir.ls init: drawBoat(point(310, 150))
    this.car = new MulleBuildCar(this.game, 445, 370, null, true, false)
    this.game.add.existing(this.car)

    // === TREE (member 2) ===
    var tree = new MulleSprite(this.game, 320, 240)
    tree.setDirectorMember(this.DirResource, 2)
    this.game.add.existing(tree)
    this.tree = tree

    // Make tree clickable
    tree.inputEnabled = true
    tree.events.onInputOver.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = 'Point'
    })
    tree.events.onInputOut.add(() => {
      if (this.game.mulle.cursor) this.game.mulle.cursor.current = null
    })

    // === LINGO MISSION LOGIC (Dir.ls startMovie) ===
    this.myMarker = this.determineMissionMarker()
    console.log('[TreeCar] Mission marker:', this.myMarker, '→ goTo:', this.goTo)

    // === FLOW ROUTING ===
    // Check car strength for the car-game tree-clearing mechanic
    var carStrength = this.game.mulle.user.Car.getProperty('strength', 0)
    console.log('[TreeCar] Car strength:', carStrength)

    if (carStrength < 3) {
      this.weakCar()
    } else {
      this.strongCar(tree)
    }
  }

  /**
   * Lingo BehaviorScript 10: setSky(the weather of gMulleGlobals)
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
   * Lingo ParentScript 1 - Dir.ls startMovie — full mission 25/13 logic.
   *
   * tmpGiveParts from object definition: [17, 46]
   *   objectParts[0] = 17 (first-visit gift)
   *   objectParts[1] = 46 (M13 completion reward — Compass)
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    var user = this.game.mulle.user
    if (!user || typeof user.isMissionCompleted !== 'function') {
      this.goTo = 'start'
      return 'Done'
    }

    var myMarker = null
    var objectParts = [17, 46]
    var tmpBoat = user.Car || user.Boat || {}
    var hasBench = typeof tmpBoat.getProperty === 'function'
      ? tmpBoat.getProperty('bench', 0) > 0
      : false

    // === M25 completed path (return visits) ===
    if (user.isMissionCompleted(25)) {
      if (user.isMissionGiven(13)) {
        if (hasBench) {
          if (user.isMissionCompleted(13)) {
            // Infinite/repeatable path
            user.addCompletedMission(13)
            var randomPart = typeof user.getRandomPart === 'function'
              ? user.getRandomPart()
              : null
            this.givePart = randomPart
            myMarker = 'infiniteJustDoit'
          } else {
            // First M13 completion
            myMarker = 'JustdoIt'
            user.addCompletedMission(13)
            this.givePart = objectParts[1]
            user.addNewPart(objectParts[1])
            console.log('[TreeCar] Mission 13 completed — Part', objectParts[1], 'given')
          }
        } else {
          myMarker = 'cantdoIT'
        }
      } else {
        myMarker = 'Done'
      }
    }

    // === M25 NOT completed path (first visit) ===
    if (!user.isMissionCompleted(25)) {
      user.addCompletedMission(25)
      myMarker = 'nomission'
      console.log('[TreeCar] Mission 25 completed (first visit)')
    }

    // === Special "nomission" flow ===
    if (myMarker === 'nomission') {
      this.givePart = objectParts[0]
      user.addGivenMission(13)
      user.addNewPart(objectParts[0])
      console.log('[TreeCar] Part', objectParts[0], 'given, mission 13 assigned')

      if (hasBench) {
        myMarker = 'justDoITluck'
        user.addCompletedMission(13)
        console.log('[TreeCar] Lucky! Bench found — mission 13 completed immediately')
      }
    }

    // === goTo routing ===
    // Lingo: nomission/justDoITluck (first visit) → go("start")
    // Others → go(myMarker)
    if (!user.isMissionCompleted(25) || myMarker === 'nomission' || myMarker === 'justDoITluck') {
      this.goTo = 'start'
    } else {
      this.goTo = myMarker
    }

    return myMarker || 'Done'
  }

  /**
   * Car too weak — can't move the tree.
   * Plays "too weak" dialogue, returns to world.
   */
  weakCar () {
    this.game.mulle.playAudio('83d003v0', () => {
      this.leaveScene()
    })
  }

  /**
   * Car strong enough — tree-clearing success sequence.
   *
   * Plays success dialogues, removes tree, shows reward.
   * Integrates Lingo frame label flow:
   *   BehaviorScript 6/7: go("boatride")
   *   BehaviorScript 9: go("justdoit2")
   *   BehaviorScript 24: go("boatride2")
   *   BehaviorScript 31: go("boatride3")
   *
   * @param {MulleSprite} tree
   */
  strongCar (tree) {
    // Play success dialogues
    // 83d007v0 — "Let's try to move this tree"
    this.game.mulle.playAudio('83d007v0', () => {
      // 83d008v0 — "There we go!"
      this.game.mulle.playAudio('83d008v0', () => {
        // Mission 5 completed: Tree cleared
        if (this.game.mulle.missions) {
          this.game.mulle.missions.markAsCompleted(5)
        }

        // Tree disappears (Lingo: frame transition to boatride)
        new blinkThing(this.game, tree, () => {
          this.showReward()
        }, this)
      })
    })
  }

  /**
   * Show reward part after tree clearing.
   * Uses givePart from mission logic or random part.
   */
  showReward () {
    // Use Lingo givePart if available, otherwise random
    var partId = this.givePart || this.game.mulle.user.getRandomPart()
    var partData = this.game.mulle.PartsDB[partId]

    // Create the reward part sprite
    var rewardPart = new MulleSprite(this.game, 320, 300)
    if (partData && partData.junkView) {
      rewardPart.setDirectorMember('CDDATA.CXT', partData.junkView)
    }
    rewardPart.partId = partId
    this.game.add.existing(rewardPart)

    // Play success sound (shared DING)
    this.game.mulle.playAudio('00d035v0')

    new blinkThing(this.game, rewardPart, () => {
      // Add part to junk yard
      this.game.mulle.user.Junk.yard[partId] = {
        x: this.game.rnd.integerInRange(290, 580),
        y: 440
      }

      // Mark tree as removed
      this.game.mulle.user.Car.addCache('#TreeRemoved')

      this.leaveScene()
    }, this)
  }

  /**
   * Play a dialogue audio clip.
   * Lingo: MovieScript 8 CuePassed → sendAllSprites(#spritecuePassed)
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
   * Leave scene — Lingo: BehaviorScript 3 go("leave")
   */
  leaveScene () {
    this.game.state.start('world')
  }

  shutdown () {
    this.game.mulle.stopAudio('treecar')
    this.car = null
    this.tree = null
    this.sky = null

    super.shutdown()
  }
}

export default TreeCarState
