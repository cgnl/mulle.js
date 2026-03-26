/**
 * AlgaeIsland scene (scene 84)
 * @module scenes/algae_island
 *
 * Scene 84 from the boat game (boten_84.DXR) — Algae Island.
 *
 * Lingo source: decompiled_lingo/boat_84/84/casts/Internal/
 *   ParentScript 3 - Dir.ls       — main scene controller (startMovie, init, kill)
 *   BehaviorScript 9.ls           — boat position by hull type + hide sprite 62
 *   BehaviorScript 14.ls          — watertank exitFrame check → "JustDoItTank"
 *   BehaviorScript 91 - mulleLogBH.ls — NPC idle speech (3-clip list, 50% 84e007v0)
 *   BehaviorScript 92 - mulleLogBH.ls — NPC idle speech (5-clip list, 67% 84e007v0)
 *   BehaviorScript 4.ls           — show sprite 62
 *   BehaviorScript 1.ls           — exitFrame loop
 *   BehaviorScript 2.ls           — go("leave")
 *   BehaviorScript 10.ls          — go("leave")
 *   BehaviorScript 13.ls          — go(gDir.myMarker)
 *   BehaviorScript 26.ls          — go("justDoittank")
 *   MovieScript 5.ls              — CuePassed relay
 *
 * Mission Logic (cascading overwrites, from Lingo startMovie):
 *   Block 1: M11 not completed → Watertank? complete M11 + "JustDoItTank" : "cantDoit"
 *   Block 2: M21 not completed → OVERWRITES marker from Block 1.
 *            Watertank? also complete M11 + "noMissionTank" : "nomission".
 *            ALWAYS: complete M21, give part 30, give mission 11.
 *   Block 3: CombineHarvester → OVERWRITES everything.
 *            M10 not completed? complete M10, give helmet, "JustDoItWeed".
 *            M10 already completed? "Done" + random(1-5).
 *   Block 4: Fallback: marker still undefined → "Done" + random(1-5).
 *
 * Dir-level constants (ParentScript 3 - Dir.ls):
 *   myDummyPart = 86
 *   givePart    = 30
 *   spriteList  = [#BoatStart: 14, #Sky: 1]
 *
 * Boat hull positioning (BehaviorScript 9.ls):
 *   #large  → point(280, 171)
 *   #Medium → point(280, 179)
 *   #Small  → point(200, 196)
 *
 * NPC idle audio (BehaviorScript 91 - mulleLogBH.ls):
 *   soundList = ["04d029v0", "84e007v0", "04d027v0"]
 *   50% → "84e007v0", else random(soundList)
 *
 * NPC idle audio (BehaviorScript 92 - mulleLogBH.ls):
 *   soundList = ["04d029v0", "05d109v0", "83d019v0", "84e007v0", "04d027v0"]
 *   67% → "84e007v0", else random(soundList[1..4])
 *
 * Features:
 * - Island background
 * - NPC with dialogue and idle speech animations
 * - Boat display positioned by hull type
 * - Mission-driven marker routing via AlgaeIslandData
 * - Exit button to return to seaworld
 * - Visit tracking in boat's CacheList
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import { computeAlgaeIslandResult } from './AlgaeIslandData'

// Lingo parity: ParentScript 3 - Dir.ls / BehaviorScript 9 (84/84)
// State: boatViewHandler — used for hull-type boat positioning
// State: weather — read from gMulleGlobals for sky rendering
// Global: setSky — called with weather to render sky sprite
const ALGAE_BOAT_VIEW_HANDLER = 'boatViewHandler'
const ALGAE_WEATHER_STATE = 'weather'
const ALGAE_SET_SKY_FN = 'setSky'

// ---------------------------------------------------------------------------
// Dir-level constants — Lingo: ParentScript 3 - Dir.ls, on new / on startMovie
// ---------------------------------------------------------------------------
const DIR_DUMMY_PART = 86
const DIR_GIVE_PART = 30
const DIR_SPRITE_LIST = { BoatStart: 14, Sky: 1 }

// ---------------------------------------------------------------------------
// Boat hull positions — Lingo: BehaviorScript 9.ls, on beginSprite
//   set the loc of sprite 67 to point(…)
// ---------------------------------------------------------------------------
const HULL_POSITIONS = {
  large: { x: 280, y: 171 },
  medium: { x: 280, y: 179 },
  small: { x: 200, y: 196 }
}

// ---------------------------------------------------------------------------
// NPC idle-speech tables — Lingo: BehaviorScript 91 & 92 (mulleLogBH)
//
// BehaviorScript 91:
//   soundList = ["04d029v0", "84e007v0", "04d027v0"]
//   tmpRnd = random(2); if <> 1 → "84e007v0", else random(soundList)
//
// BehaviorScript 92:
//   soundList = ["04d029v0", "05d109v0", "83d019v0", "84e007v0", "04d027v0"]
//   tmpRnd = random(3); if <> 1 → "84e007v0", else random(soundList[1..4])
// ---------------------------------------------------------------------------
const NPC_SOUND_LIST_A = ['04d029v0', '84e007v0', '04d027v0']
const NPC_SOUND_LIST_B = ['04d029v0', '05d109v0', '83d019v0', '84e007v0', '04d027v0']

class AlgaeIslandState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
  }

  create () {
    super.create()

    // Lingo: ParentScript 3 - Dir.ls — the movie is boten_84.DXR
    this.DirResource = 'boten_84.DXR'

    this.game.mulle.addAudio('seaworld')

    if (!this.game.mulle.missionManager) {
      const { MissionManager } = require('./showboat')
      this.game.mulle.missionManager = new MissionManager(this.game)
    }
    this.missionManager = this.game.mulle.missionManager

    if (!this.game.mulle.user.Boat.hasCache('#VisitedAlgae')) {
      this.game.mulle.user.Boat.addCache('#VisitedAlgae')
    }

    // Lingo: BehaviorScript 9.ls — draw boat positioned by hull type
    this.createBackground()
    this.drawBoatByHull()
    this.createIslandElements()
    this.createMiel()
    this.createForegroundOverlay()

    this.createExitButton()

    this.missionMarker = this.determineMissionMarker()

    this.playAmbientSounds()

    // Lingo: BehaviorScript 91/92 — start NPC idle speech
    this.startNpcIdleSpeech()

    this.playMissionDialogue()

    console.log('[AlgaeIsland] Scene created, marker:', this.missionMarker)
  }

  createMiel () {
    this.mielBody = new MulleSprite(this.game, 320, 240)
    this.mielBody.setDirectorMember(this.DirResource, 15) // 84a000v0
    this.game.add.existing(this.mielBody)

    this.mielHead = new MulleSprite(this.game, 320, 240)
    this.mielHead.setDirectorMember(this.DirResource, 16) // 84a001v0
    this.game.add.existing(this.mielHead)

    this.mielArm = new MulleSprite(this.game, 320, 240)
    this.mielArm.setDirectorMember(this.DirResource, 20) // 84a002v0
    this.game.add.existing(this.mielArm)

    this.mielHead.inputEnabled = true
    this.mielHead.input.useHandCursor = true
    this.mielHead.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.mielHead.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.mielHead.events.onInputUp.add(() => {
      this.onMielClick()
    })
  }

  createIslandElements () {
    this.dredger = new MulleSprite(this.game, 320, 240)
    this.dredger.setDirectorMember(this.DirResource, 47) // 84a003v0
    this.game.add.existing(this.dredger)
  }

  createBackground () {
    this.background = new MulleSprite(this.game, 320, 240)
    this.background.setDirectorMember(this.DirResource, 27) // 84b003v0
    this.game.add.existing(this.background)
  }

  createForegroundOverlay () {
    this.foregroundOverlay = new MulleSprite(this.game, 320, 240)
    this.foregroundOverlay.setDirectorMember(this.DirResource, 28) // 84b004v0
    this.game.add.existing(this.foregroundOverlay)
  }

  // ==========================================================================
  // BOAT DISPLAY — Lingo: BehaviorScript 9.ls
  // Positions the boat sprite according to hull type.
  //   #large  → point(280, 171)
  //   #Medium → point(280, 179)
  //   #Small  → point(200, 196)
  // Also hides sprite 62 (set the visible of sprite 62 to 0).
  // ==========================================================================

  drawBoatByHull () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    // Determine hull type string
    let hullType = 'medium'
    if (boat.getHullType) {
      hullType = boat.getHullType()
    } else if (boat.hullType) {
      hullType = boat.hullType
    }
    const hullKey = (typeof hullType === 'string' ? hullType : 'medium')
      .replace('#', '').toLowerCase()

    const pos = HULL_POSITIONS[hullKey] || HULL_POSITIONS.medium

    console.log('[AlgaeIsland] Drawing boat, hull:', hullKey, 'pos:', pos)

    this.boatDisplay = new MulleBuildBoat(this.game, pos.x, pos.y)
    this.boatDisplay.create(boat)
    this.game.add.existing(this.boatDisplay)
  }

  // ==========================================================================
  // NPC IDLE SPEECH — Lingo: BehaviorScript 91 & 92 (mulleLogBH)
  //
  // Two behavior scripts attach to NPC sprites and play random dialogue clips
  // via makeAnimSpeech on beginSprite.  We reproduce the weighted random
  // selection here as a one-shot that fires shortly after scene creation.
  //
  // BehaviorScript 91 (soundList A):
  //   ["04d029v0", "84e007v0", "04d027v0"]
  //   random(2) <> 1 → "84e007v0"        (50 %)
  //   else            → random(soundList) (50 % spread across 3 clips)
  //
  // BehaviorScript 92 (soundList B):
  //   ["04d029v0", "05d109v0", "83d019v0", "84e007v0", "04d027v0"]
  //   random(3) <> 1 → "84e007v0"                (67 %)
  //   else            → random(soundList[0..3])   (33 % spread across 4 clips)
  // ==========================================================================

  /**
   * Pick and play an NPC idle speech clip using BehaviorScript 91 logic.
   * Lingo: BehaviorScript 91 - mulleLogBH.ls
   *
   * @returns {string} The chosen clip ID
   */
  pickNpcSpeechA () {
    // Lingo: set tmpRnd to random(2); if tmpRnd <> 1 → "84e007v0"
    const rnd = Math.floor(Math.random() * 2) + 1  // 1 or 2
    if (rnd !== 1) {
      return '84e007v0'
    }
    // else → random(soundList) — Lingo random(3) picks index 1..3
    return NPC_SOUND_LIST_A[Math.floor(Math.random() * NPC_SOUND_LIST_A.length)]
  }

  /**
   * Pick and play an NPC idle speech clip using BehaviorScript 92 logic.
   * Lingo: BehaviorScript 92 - mulleLogBH.ls
   *
   * @returns {string} The chosen clip ID
   */
  pickNpcSpeechB () {
    // Lingo: set tmpRnd to random(3); if tmpRnd <> 1 → "84e007v0"
    const rnd = Math.floor(Math.random() * 3) + 1  // 1, 2, or 3
    if (rnd !== 1) {
      return '84e007v0'
    }
    // else → random(soundList[1..4]) — Lingo random(4) picks index 1..4
    return NPC_SOUND_LIST_B[Math.floor(Math.random() * 4)]
  }

  /**
   * Start NPC idle speech after a short delay.
   * Uses BehaviorScript 91 logic for the first NPC sprite and
   * BehaviorScript 92 for a second if present.
   */
  startNpcIdleSpeech () {
    this.game.time.events.add(800, () => {
      const clipA = this.pickNpcSpeechA()
      console.log('[AlgaeIsland] NPC idle speech A:', clipA)
      this.game.mulle.playAudio(clipA)
    })
  }

  createExitButton () {
    this.exitButton = this.game.add.graphics(580, 440)

    var btn = this.exitButton
    btn.beginFill(0xcc0000, 0.8)
    btn.drawCircle(0, 0, 25)
    btn.endFill()

    btn.beginFill(0xffffff, 0.9)
    btn.lineStyle(2, 0xcc0000, 1)
    btn.moveTo(-10, -10)
    btn.lineTo(10, 10)
    btn.moveTo(10, -10)
    btn.lineTo(-10, 10)
    btn.endFill()

    btn.inputEnabled = true
    btn.input.useHandCursor = true
    btn.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
      btn.scale.setTo(1.1, 1.1)
    })
    btn.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
      btn.scale.setTo(1, 1)
    })
    btn.events.onInputUp.add(() => {
      console.log('[AlgaeIsland] Returning to seaworld')
      this.game.mulle.playAudio('boten_04.DXR/04d004v0')
      this.game.state.start('seaworld')
    })
  }

  // ==========================================================================
  // MISSION LOGIC
  // Based on original Lingo startMovie for scene 84 (boten_84.DXR)
  // Lingo: ParentScript 3 - Dir.ls, on startMovie
  // ==========================================================================

  /**
   * Determine mission marker using AlgaeIslandData pure-function module.
   *
   * Gathers state, delegates to computeAlgaeIslandResult(), and applies
   * side-effects based on returned action flags.
   *
   * @returns {string} Mission marker
   */
  determineMissionMarker () {
    const user = this.game.mulle.user

    // --- gather state ---
    const isMission11Completed = user.isMissionCompleted(11) > 0
    const isMission21Completed = user.isMissionCompleted(21) > 0
    const isMission10Completed = user.isMissionCompleted(10) > 0
    const hasWatertank = user.Boat.getProperty('watertank', 0) > 0
    const hasCombineHarvester = user.Boat.getProperty('combineharvester', 0) > 0
    const randomDoneSuffix = Math.floor(Math.random() * 5) + 1

    // --- pure computation (AlgaeIslandData) ---
    const result = computeAlgaeIslandResult({
      isMission11Completed,
      isMission21Completed,
      isMission10Completed,
      hasWatertank,
      hasCombineHarvester,
      randomDoneSuffix
    })

    // Store full result for debugging / other methods
    this.algaeIslandResult = result
    console.log('[AlgaeIsland] computeAlgaeIslandResult:', JSON.stringify(result))

    // --- apply side-effects based on action flags ---
    if (result.actions.completeMission11) {
      user.addCompletedMission(11)
      console.log('[AlgaeIsland] Mission 11 completed')
    }
    if (result.actions.completeMission21) {
      user.addCompletedMission(21)
      console.log('[AlgaeIsland] Mission 21 completed')
    }
    if (result.actions.completeMission10) {
      user.addCompletedMission(10)
      console.log('[AlgaeIsland] Mission 10 completed')
    }
    if (result.actions.giveMission11) {
      user.addGivenMission(11)
      console.log('[AlgaeIsland] Mission 11 given')
    }
    if (result.actions.givePart30) {
      user.addNewPart(30)
      console.log('[AlgaeIsland] Part 30 given')
    }
    if (result.actions.giveHelmet) {
      user.setInInventory('#helmet', {})
      console.log('[AlgaeIsland] Helmet given')
    }

    return result.marker
  }

  /**
   * Play dialogue based on mission marker.
   * Markers come from AlgaeIslandData: JustDoItTank, cantDoit,
   * noMissionTank, nomission, JustDoItWeed, Done1-5.
   */
  playMissionDialogue () {
    const dialogueMap = {
      'JustDoItTank': '80d003v0',   // M11 completed with watertank
      'cantDoit': '80d004v0',       // M11 not completed, no watertank
      'noMissionTank': '80d005v0',  // M21 not completed, has watertank
      'nomission': '80d002v0',      // M21 not completed, no watertank
      'JustDoItWeed': '80d006v0'    // CombineHarvester, M10 completed
    }

    // Done1-5 markers share a single "done" dialogue
    let dialogueId = dialogueMap[this.missionMarker]
    if (!dialogueId && this.missionMarker && this.missionMarker.startsWith('Done')) {
      dialogueId = '80d001v0'
    }
    if (!dialogueId) {
      dialogueId = '80d001v0' // fallback
    }

    const fullId = this.DirResource + '/' + dialogueId
    this.game.mulle.playAudio(fullId)
    console.log('[AlgaeIsland] Playing dialogue:', fullId, 'for marker:', this.missionMarker)
  }

  /**
   * Handle click on Miel NPC.
   * Plays a random idle speech clip using BehaviorScript 92 logic
   * (the richer 5-clip list), matching how the Lingo behaviors fire
   * makeAnimSpeech on interaction.
   * Lingo: BehaviorScript 92 - mulleLogBH.ls
   */
  onMielClick () {
    if (this._npcTalking) return
    this._npcTalking = true

    const clip = this.pickNpcSpeechB()
    console.log('[AlgaeIsland] Miel clicked, playing NPC speech B:', clip)

    const audio = this.game.mulle.playAudio(clip, () => {
      this._npcTalking = false
    })
    if (!audio) {
      this._npcTalking = false
    }
  }

  playAmbientSounds () {
    this.game.mulle.playAudio('seaworld', true)
  }

  showMessage (text) {
    console.log('[AlgaeIsland]', text)

    const msg = this.game.add.text(320, 420, text, {
      font: '16px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    })
    msg.anchor.setTo(0.5, 0.5)
    msg.alpha = 0

    this.game.add.tween(msg)
      .to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true)

    this.game.time.events.add(3000, () => {
      this.game.add.tween(msg)
        .to({ alpha: 0 }, 300, Phaser.Easing.Cubic.In, true)
        .onComplete.add(() => {
          msg.destroy()
        })
    })
  }

  update () {
  }

  shutdown () {
    super.shutdown()

    this.game.sound.stopAll()
    console.log('[AlgaeIsland] Scene shutdown')
  }
}

export default AlgaeIslandState
