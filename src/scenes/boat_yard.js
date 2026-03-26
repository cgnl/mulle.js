/**
 * BoatYardState - Junkyard overview scene (scene 03)
 *
 * Equivalent of the car game's YardState but for the boat game.
 * Mulle stands among junk parts; 7 navigation zones lead to the Quay
 * and 6 shelf storage areas.
 *
 * Scene 03.DXR from boten ISO
 * Original Lingo: decompiled_lingo/03/03/casts/Internal/ParentScript 2 - Dir.ls (134 lines)
 *
 * Dialog Priority (from original Lingo loop handler, lines 87–133):
 *   1. gotNewParts  → dorisDialogList (random)
 *   2. gotGifts     → giftDialogList  (random)
 *   3. FirstTime AND loopCounter=0 → consume from firstDialogList (random pick + delete)
 *      When list exhausted → FirstTime=0
 *   4. NOT FirstTime AND loopCounter=0 → genDialogList (random)
 *
 * Counter reset ranges:
 *   - FirstTime context:  120 + random(120) → [121, 240]
 *   - Normal context:     360 + random(720) → [361, 1080]
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleActor from '../objects/actor'
import MulleBoatPart from '../objects/boatpart'
import LingoSceneRuntime from '../objects/LingoSceneRuntime'
import boatYardSpec from '../lingo/scenes/boat_yard_03'

const {
  NAV_ZONES,
  SPRITE_LIST,
  DIALOG_LISTS,
  computeGiftCollection,
  resolveDialogPriority,
  computeInitState
} = require('./YardData')

/**
 * BoatYardState - Junkyard overview where Mulle stands among parts
 * @extends MulleState
 */
class BoatYardState extends MulleState {
  preload() {
    // Scene 03.DXR in boten is the junkyard (Yard)
    // Original Lingo: this movie is 03.DXR
    this.DirResource = '03.DXR'
    this.assetPrefix = 'boten/'

    // Lazy load boat assets (prevents sprite conflicts with car game)
    this.game.mulle.loadBoatAssets(this.game.load)

    super.preload()
  }

  create() {
    super.create()

    const user = this.game.mulle.user

    // ========================================================================
    // BACKGROUND (sprite channel Sky:1)
    // Original Lingo (init, line 8): spriteList = [#Sky: 1, ...]
    // ========================================================================
    this.createBackground()

    // ========================================================================
    // INIT STATE  (original Lingo new(), lines 4–24)
    // ========================================================================

    // Original Lingo line 14: FirstTime = getaProp(firstTimeList, #Yard)
    const isFirstTime = !!(user.firstTimeList && user.firstTimeList.Yard)

    // Original Lingo line 13: loopCounter = random(360)  →  [1, 360]
    const randomValue = Math.floor(Math.random() * 360) + 1

    // Gather → Compute → Apply
    const initState = computeInitState(isFirstTime, randomValue)
    this.loopCounter = initState.loopCounter
    this.FirstTime = isFirstTime

    // Original Lingo line 18: setaProp(firstTimeList, #Yard, 0)
    if (initState.firstTimeCleared && user.firstTimeList) {
      user.firstTimeList.Yard = 0
    }

    // Clone firstDialogList for consumption (original Lingo line 10)
    // We clone so we can splice items out without mutating the data module
    this.firstDialogList = [...DIALOG_LISTS.firstDialogList]

    // Original Lingo lines 5–6: OKToTalk=1, dialogClosed=1
    this.OKToTalk = true
    this.dialogClosed = true

    // Flags set by external systems (Doris delivery, gift box)
    this.gotNewParts = !!(this.game.mulle.gotNewParts)
    this.gotGifts = false

    // ========================================================================
    // JUNK PARTS GROUP
    // ========================================================================
    this.junkParts = this.game.add.group()

    // ========================================================================
    // NAVIGATION ZONES / MOUSEOBJECTS (Lingo-lite runtime)
    // ========================================================================
    this.initLingoMouseObjects()

    // ========================================================================
    // MULLE NPC  (original Lingo spriteList #Mulle: 4)
    // ========================================================================
    this.createMulleActor()

    // ========================================================================
    // GIFTS  (original Lingo init, lines 36–42)
    // ========================================================================
    this.checkAndCreateGiftSprite()
    if (this.lingoRuntime) {
      this.lingoRuntime.refreshActive()
    }

    // ========================================================================
    // JUNK HANDLER  (original Lingo init, lines 44–45)
    // set junkHandler to new(script "JunkHandler", #Yard)
    // drawParts(junkHandler)
    // ========================================================================
    this.loadYardJunkParts()

    // ========================================================================
    // SKY  (original Lingo init, line 43): setSky(the weather)
    // ========================================================================
    this.setSky()

    // ========================================================================
    // SOUND PRELOAD  (original Lingo new, line 23): safePreload("00e110v0")
    // ========================================================================
    try {
      const preload = this.game.mulle.playAudio('00e110v0')
      if (preload) { preload.volume = 0; preload.stop() }
    } catch (e) {
      console.warn('[BoatYard] Could not preload 00e110v0:', e)
    }

    // ========================================================================
    // DIALOG LOOP TIMER  (original Lingo init, line 46)
    // addObject(loopMaster, me)  →  loop() called every exitFrame (60 FPS)
    // BUG FIX: Must run at 60 FPS to match original counter timing
    // (See boatyard.js BUG FIX #1 for same issue)
    // ========================================================================
    this.dialogLoopTimer = this.game.time.events.loop(
      Math.floor(1000 / 60), // 16.67ms ≈ 60 FPS
      this.processDialogLoop,
      this
    )

    // ========================================================================
    // WHERE-FROM  (original Lingo kill, line 63): WhereFrom = "03"
    // Set immediately so other scenes know where we came from
    // ========================================================================
    this.game.mulle.whereFrom = '03'

    console.debug('[BoatYard] Scene created — FirstTime:', this.FirstTime,
      'loopCounter:', this.loopCounter,
      'gifts:', (user.gifts || []).length)
  }

  // ==========================================================================
  // BACKGROUND
  // ==========================================================================

  /**
   * Create background sprite from 03.DXR member 1 (Sky channel)
   * Original Lingo (init, line 8): spriteList #Sky: 1
   */
  createBackground() {
    // Member 1 = 03b001v0 = main yard background (640×480)
    const background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember('boten_03.DXR', 1)) {
      console.warn('[BoatYard] Background sprite not found, using fallback')
      background.destroy()
      const fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x8B6914) // Earthy brown for junkyard
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }
  }

  /**
   * Set sky sprite based on weather type
   * Original Lingo (init, line 43): setSky(the weather of gMulleGlobals)
   * Sky member names: 00b0XXv0 where XX = 10 + weatherType
   */
  setSky() {
    const weatherType = this.getWeatherType()
    const skyMemberNum = 10 + weatherType
    const skyMemberName = `00b0${skyMemberNum}v0`

    this.skySprite = new MulleSprite(this.game, 320, 240)

    // Try boten_00.CXT first (boat-game shared sky assets)
    let loaded = this.skySprite.setDirectorMember('boten_00.CXT', skyMemberName)
    if (!loaded) {
      loaded = this.skySprite.setDirectorMember('00.CXT', skyMemberName)
    }

    if (loaded) {
      this.game.add.existing(this.skySprite)
      this.game.world.sendToBack(this.skySprite)
      console.debug('[BoatYard] Sky loaded:', skyMemberName)
    } else {
      this.skySprite.destroy()
      this.skySprite = null
      console.debug('[BoatYard] Sky sprite not found, skipping')
    }
  }

  /**
   * Get weather type (1–4) from global weather state
   * 1 = Calm, 2 = Windy, 3 = Rainy, 4 = Stormy
   */
  getWeatherType() {
    const weatherObj = this.game.mulle.weather
    if (weatherObj && typeof weatherObj.weatherType === 'number') {
      return Math.max(1, Math.min(4, weatherObj.weatherType))
    }
    return 1 // Default: calm
  }

  // ==========================================================================
  // LINGO-LITE MOUSEOBJECTS
  // ==========================================================================

  initLingoMouseObjects() {
    this.lingoRuntime = new LingoSceneRuntime(this, boatYardSpec)
    this.lingoRuntime.build()
    this.lingoRuntime.startLoop()

    // Cache nav zones for drop targets (exclude Gift)
    this.navZones = this.lingoRuntime.objects.filter((o) => {
      const tag = o.lingo && o.lingo.dragToWhere
      return tag && (tag === 'Quay' || String(tag).startsWith('Shelf'))
    })
  }

  // ==========================================================================
  // NAVIGATION ZONES
  // ==========================================================================

  /**
   * Create 7 navigation zones from NAV_ZONES
   * Original Lingo (init, lines 28–35): mouseObject rects
   *
   * Zone 301 (Quay)     → navigates to 'boatyard' state
   * Zones 302–307 (Shelf1–6) → navigates to 'boat_junk' state with shelfId
   */
  createNavZones() {
    this.navZones = []

    NAV_ZONES.forEach((zone) => {
      const [x1, y1, x2, y2] = zone.rect
      const w = x2 - x1
      const h = y2 - y1

      // Create transparent clickable graphics region
      // (same pattern as boat_junk.js navigation)
      const gfx = this.game.add.graphics(0, 0)
      gfx.beginFill(0x000000, 0.01) // Nearly invisible
      gfx.drawRect(x1, y1, w, h)
      gfx.endFill()
      gfx.inputEnabled = true
      gfx.input.useHandCursor = true

      // Cursor handling
      // Original Lingo: #cursor: [#rollOver: #GoLeft/#GoForward, ...]
      gfx.events.onInputOver.add(() => {
        this.game.mulle.cursor.current = zone.cursor.rollOver === 'GoLeft'
          ? 'MoveLeft'
          : 'MoveForward'
      })
      gfx.events.onInputOut.add(() => {
        this.game.mulle.cursor.current = null
      })

      // Click handler
      // Original Lingo (mouse handler, line 68): case argWhat = #click
      gfx.events.onInputUp.add(() => {
        this.navigateToZone(zone)
      })

      // Store reference for drag-and-drop targets
      gfx.zoneData = zone
      this.navZones.push(gfx)
    })

    console.debug('[BoatYard] Created', this.navZones.length, 'navigation zones')
  }

  /**
   * Lingo runtime click handler
   * @param {object} obj Lingo mouseObject spec
   */
  onLingoClick(obj) {
    if (!obj) return

    if (obj.dragToWhere === 'Gift') {
      this.onGiftClick()
      return
    }

    if (obj.click && obj.click.frame) {
      this.lingoGo(obj.click.frame)
    }
  }

  /**
   * Handle Lingo "go(frame)" destinations
   * @param {string} frame
   */
  lingoGo(frame) {
    if (frame === 'Quay') {
      this.game.mulle.whereFrom = 'boat_yard'
      this.game.state.start('boatyard')
      return
    }

    if (String(frame).startsWith('Shelf')) {
      const shelfNum = parseInt(String(frame).replace('Shelf', ''), 10)
      this.game.mulle.user.lastBoatShelf = shelfNum
      this.game.mulle.whereFrom = 'boat_yard'
      this.game.state.start('boat_junk')
    }
  }

  /**
   * Handle navigation from a clicked zone
   * Original Lingo: go(clickFrame)
   *
   * @param {object} zone - NAV_ZONE entry
   */
  navigateToZone(zone) {
    console.debug('[BoatYard] Navigating to:', zone.clickFrame, '(zone', zone.id, ')')

    if (zone.clickFrame === 'Quay') {
      // Zone 301: go to Quay (boatyard / shipyard build area)
      // Original Lingo (init, line 29): #click: [#frame: "Quay"]
      this.game.mulle.whereFrom = 'boat_yard'
      this.game.state.start('boatyard')
    } else {
      // Zones 302–307: go to shelves (boat_junk scene)
      // Original Lingo (init, lines 30–35): #click: [#frame: "Shelf1"..."Shelf6"]
      // Extract shelf number from clickFrame (e.g. "Shelf3" → 3)
      const shelfNum = parseInt(zone.clickFrame.replace('Shelf', ''), 10)

      // Store which shelf to show so boat_junk can read it
      this.game.mulle.user.lastBoatShelf = shelfNum
      this.game.mulle.whereFrom = 'boat_yard'
      this.game.state.start('boat_junk')
    }
  }

  // ==========================================================================
  // MULLE NPC
  // ==========================================================================

  /**
   * Create Mulle NPC actor
   * Original Lingo: spriteList #Mulle: 4 (channel 4)
   * Mulle stands in the yard among parts, uses 'mulleDefault' actor type
   */
  createMulleActor() {
    // Position Mulle in the yard — centered lower area
    // Original Lingo doesn't specify exact position; it's set by the sprite channel
    const mulleX = 320
    const mulleY = 380

    this.mulleActor = new MulleActor(this.game, mulleX, mulleY, 'mulleDefault')
    this.game.add.existing(this.mulleActor)

    // Register as global actor reference for dialog system
    this.game.mulle.actors.mulle = this.mulleActor

    // Make Mulle clickable
    this.mulleActor.inputEnabled = true
    this.mulleActor.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.mulleActor.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.mulleActor.events.onInputUp.add(() => {
      this.mulleTalk()
    })

    // Start idle animation
    this.mulleActor.animations.play('idle')

    console.debug('[BoatYard] Mulle actor created at', mulleX, mulleY)
  }

  /**
   * Make Mulle talk (player-initiated click)
   * Original Lingo (line 84): sendSprite(#Mulle, #makeMulleTalk, #PrioTalk, argSnd)
   */
  mulleTalk() {
    if (!this.mulleActor) return
    if (this.mulleActor.isTalking) return

    // Pick a random general dialog
    const list = DIALOG_LISTS.genDialogList
    const sound = list[Math.floor(Math.random() * list.length)]
    this.makeMulleTalk('PrioTalk', sound)
  }

  /**
   * Send talk command to Mulle actor
   * Original Lingo (line 84): sendSprite(spriteList.Mulle, #makeMulleTalk, talkType, sound)
   *
   * @param {string} talkType - 'PrioTalk', 'InfoTalk', or 'NormalTalk'
   * @param {string} sound    - Sound asset ID (e.g. '03d001v0')
   */
  makeMulleTalk(talkType, sound) {
    if (!this.mulleActor || !sound) return

    this.OKToTalk = false
    this.dialogClosed = false

    console.debug('[BoatYard] Mulle talk:', talkType, sound)

    try {
      const audio = this.game.mulle.playAudio(sound)
      if (audio) {
        // Play talk animation while audio plays
        if (this.mulleActor.animations.getAnimation('talkPlayer')) {
          this.mulleActor.animations.play('talkPlayer')
        }

        audio.onStop.addOnce(() => {
          this.dialogClosed = true
          this.OKToTalk = true
          // Return to idle
          if (this.mulleActor && this.mulleActor.animations) {
            this.mulleActor.animations.play('idle')
          }
        })
      } else {
        // No audio available — reset flags
        this.dialogClosed = true
        this.OKToTalk = true
      }
    } catch (e) {
      console.warn('[BoatYard] Could not play sound:', sound, e)
      this.dialogClosed = true
      this.OKToTalk = true
    }
  }

  // ==========================================================================
  // GIFT SYSTEM
  // ==========================================================================

  /**
   * Check for pending gifts and create gift sprite if any exist
   * Original Lingo (init, lines 36–42):
   *   gotGifts = count(gifts) > 0
   *   if gotGifts then create gift sprite at point(320, 430), member "03b999v0"
   *   mouseObject rect(262, 383, 379, 478)
   */
  checkAndCreateGiftSprite() {
    const user = this.game.mulle.user
    const gifts = user.gifts || []

    if (gifts.length === 0) {
      this.gotGifts = false
      return
    }

    this.gotGifts = true

    // Create gift box sprite at channel Gift:38
    // Original Lingo: set the loc of sprite Gift to point(320, 430)
    //                 set the member of sprite Gift to member "03b999v0"
    this.giftSprite = new MulleSprite(this.game, 320, 430)
    if (!this.giftSprite.setDirectorMember('boten_03.DXR', '03b999v0')) {
      // Asset missing in current packs; hide instead of inventing a sprite.
      console.warn('[BoatYard] Gift sprite 03b999v0 not found in assets, hiding (Dummy)')
      this.giftSprite.setDirectorMember('Dummy')
    }
    this.game.add.existing(this.giftSprite)

    console.debug('[BoatYard] Gift sprite created with', gifts.length, 'gifts')
  }

  /**
   * Handle gift box click
   * Original Lingo (mouse handler, lines 67–81):
   *   case dragToWhere of #Gift:
   *     repeat with partId in gifts
   *       if not addJunkPart(user, #Yard, partId) then addNewPart(user, partId)
   *     end repeat
   *     set gifts to []
   *     go("Gift")
   *
   * Uses computeGiftCollection from YardData for the gather step.
   */
  onGiftClick() {
    const user = this.game.mulle.user
    const gifts = user.gifts || []

    if (gifts.length === 0) return

    // === GATHER ===
    const result = computeGiftCollection(gifts)

    // === APPLY SIDE EFFECTS ===
    // Original Lingo (lines 72–76): try addJunkPart, fall back to addNewPart
    result.gifts.forEach((partId) => {
      let added = false

      // Try to add as junk part in Yard location
      if (user.addBoatJunkPart) {
        added = user.addBoatJunkPart('Yard', partId)
      } else if (!user.BoatJunk) {
        user.BoatJunk = { Yard: {} }
      }

      if (!added) {
        // Fallback: add as new part (goes to Quay floor)
        // Original Lingo line 74: addNewPart(user, partId)
        if (user.addBoatPart) {
          user.addBoatPart('Quay', partId)
        } else {
          // Manual fallback: put in Yard junk storage
          if (!user.BoatJunk) user.BoatJunk = {}
          if (!user.BoatJunk.Yard) user.BoatJunk.Yard = {}
          const pos = {
            x: 4 + Math.floor(Math.random() * 632),
            y: 440 + Math.floor(Math.random() * 30)
          }
          user.BoatJunk.Yard[partId] = pos
        }
      }
    })

    // Clear gifts list
    // Original Lingo line 77: set the gifts of user to []
    user.gifts = []

    // Set gotGifts flag for dialog system
    this.gotGifts = true

    // Remove gift sprite
    if (this.giftSprite) {
      this.giftSprite.destroy()
      this.giftSprite = null
    }

    // Original Lingo line 78: go("Gift")
    // "Gift" frame shows a brief animation/transition; reload scene to show new parts
    // In the port we just refresh the junk parts
    this.loadYardJunkParts()

    // Play gift collection sound
    try {
      this.game.mulle.playAudio('00e110v0')
    } catch (e) {
      console.warn('[BoatYard] Could not play gift sound')
    }

    user.save()
    console.debug('[BoatYard] Collected', result.gifts.length, 'gifts')
  }

  // ==========================================================================
  // YARD JUNK PARTS
  // ==========================================================================

  /**
   * Load and display junk parts stored in the Yard location
   * Original Lingo (init, lines 44–45):
   *   set junkHandler to new(script "JunkHandler", #Yard)
   *   drawParts(junkHandler)
   */
  loadYardJunkParts() {
    // Clear existing parts
    if (this.junkParts) {
      this.junkParts.removeAll(true)
    }

    const user = this.game.mulle.user
    if (!user.BoatJunk) user.BoatJunk = {}
    if (!user.BoatJunk.Yard) user.BoatJunk.Yard = {}

    const yardParts = user.BoatJunk.Yard

    for (const partId in yardParts) {
      const partData = this.game.mulle.getBoatPart(partId)
      if (!partData) continue

      const pos = yardParts[partId]
      const part = new MulleBoatPart(this.game, partId, pos.x, pos.y, true)

      // Setup drag-and-drop targets for navigation zones
      // Parts can be dragged to Quay or Shelf zones
      this.setupPartDropTargets(part, partId)

      this.junkParts.addChild(part)
    }

    // Bring junk parts to top so they render above background
    this.game.world.bringToTop(this.junkParts)

    console.debug('[BoatYard] Loaded', this.junkParts.children.length, 'yard junk parts')
  }

  /**
   * Setup drop targets for a junk part
   * Allows dragging parts to Quay or Shelf zones
   *
   * @param {MulleBoatPart} part   - The part sprite
   * @param {string|number} partId - Part identifier
   */
  setupPartDropTargets(part, partId) {
    this.navZones.forEach((gfx) => {
      const zone = gfx.lingo || gfx.zoneData
      if (!zone) return

      part.dropTargets.push([gfx, (d) => {
        d.destroy()
        this.movePartToZone(partId, zone)
        return true
      }])
    })
  }

  /**
   * Move a part to the target zone's location
   *
   * @param {string|number} partId - Part identifier
   * @param {object}        zone   - NAV_ZONE entry
   */
  movePartToZone(partId, zone) {
    const user = this.game.mulle.user
    if (!user.BoatJunk) user.BoatJunk = {}

    // Remove from Yard
    if (user.BoatJunk.Yard && user.BoatJunk.Yard[partId] !== undefined) {
      delete user.BoatJunk.Yard[partId]
    }

    const targetLocation = zone.dragToWhere // 'Quay' | 'Shelf1'...'Shelf6'
    if (!user.BoatJunk[targetLocation]) {
      user.BoatJunk[targetLocation] = {}
    }

    // Random position in target area
    const pos = {
      x: 4 + Math.floor(Math.random() * 632),
      y: 440 + Math.floor(Math.random() * 30)
    }
    user.BoatJunk[targetLocation][partId] = pos

    try {
      this.game.mulle.playAudio('00e110v0')
    } catch (e) { /* ignore */ }

    user.save()
    console.debug('[BoatYard] Moved part', partId, 'to', targetLocation)
  }

  // ==========================================================================
  // DIALOG LOOP
  // ==========================================================================

  /**
   * Process dialog loop — called at 60 FPS
   * Original Lingo (lines 87–133): on loop me
   *
   * Uses resolveDialogPriority from YardData for the gather→compute step,
   * then applies side effects.
   */
  processDialogLoop() {
    // === GATHER current state ===
    const state = {
      okToTalk: this.OKToTalk,
      dialogClosed: this.dialogClosed,
      gotNewParts: this.gotNewParts || !!(this.game.mulle.gotNewParts),
      gotGifts: this.gotGifts,
      firstTime: this.FirstTime,
      loopCounter: this.loopCounter,
      firstDialogListLength: this.firstDialogList.length
    }

    // Decrement loop counter (original Lingo lines 89–91)
    if (this.OKToTalk && this.dialogClosed && this.loopCounter > 0) {
      this.loopCounter--
      // Update gathered state to reflect decrement
      state.loopCounter = this.loopCounter
    }

    // === COMPUTE ===
    const result = resolveDialogPriority(state)
    if (!result) return

    // === APPLY side effects ===

    // Reset flags as indicated by result
    if (result.resetGotNewParts) {
      this.gotNewParts = false
      this.game.mulle.gotNewParts = false
    }
    if (result.resetGotGifts) {
      this.gotGifts = false
    }
    if (result.endFirstTime) {
      this.FirstTime = false
    }

    // Reset loop counter
    if (result.newLoopCounter) {
      const { min, max } = result.newLoopCounter
      this.loopCounter = min + Math.floor(Math.random() * (max - min))
    }

    // Play dialog if a list was selected
    if (result.dialogList) {
      let sound = null

      if (result.consumeFromList) {
        // firstDialogList: random pick + delete
        // Original Lingo (lines 115–117):
        //   tmpRandomSound = random(count(firstDialogList))
        //   sendSprite(Mulle, makeMulleTalk, InfoTalk, getAt(firstDialogList, tmpRandomSound))
        //   deleteAt(firstDialogList, tmpRandomSound)
        const idx = Math.floor(Math.random() * this.firstDialogList.length)
        sound = this.firstDialogList[idx]
        this.firstDialogList.splice(idx, 1)
      } else {
        // Random pick from named dialog list (no consumption)
        // Original Lingo: getAt(list, random(count(list)))
        const list = DIALOG_LISTS[result.dialogList]
        if (list && list.length > 0) {
          sound = list[Math.floor(Math.random() * list.length)]
        }
      }

      if (sound) {
        this.makeMulleTalk(result.talkType, sound)
      }
    }
  }

  // ==========================================================================
  // SHUTDOWN
  // ==========================================================================

  /**
   * Clean up timers and persist state
   * Original Lingo (kill, lines 52–65):
   *   kill junkHandler
   *   kill mouseObjects
   *   deleteObject(loopMaster, me)
   *   set volume of sound 1 to 255
   *   set WhereFrom to "03"
   */
  shutdown() {
    console.debug('[BoatYard] Shutdown')

    // Stop dialog loop timer
    // Original Lingo line 61: deleteObject(loopMaster, me)
    if (this.dialogLoopTimer) {
      this.game.time.events.remove(this.dialogLoopTimer)
      this.dialogLoopTimer = null
    }

    // Save yard junk part positions
    const user = this.game.mulle.user
    if (this.junkParts && user.BoatJunk && user.BoatJunk.Yard) {
      user.BoatJunk.Yard = {}
      this.junkParts.forEach((p) => {
        if (p.part_id) {
          user.BoatJunk.Yard[p.part_id] = { x: p.x, y: p.y }
        }
      })
    }

    // Original Lingo line 62: set the volume of sound 1 to 255
    // (restore full volume — no-op in Phaser, but noted for parity)

    // Original Lingo line 63: set WhereFrom to "03"
    this.game.mulle.whereFrom = '03'

    // Clean up sky sprite
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }

    // Clean up gift sprite
    if (this.giftSprite) {
      this.giftSprite.destroy()
      this.giftSprite = null
    }

    if (this.lingoRuntime) {
      this.lingoRuntime.destroy()
      this.lingoRuntime = null
    }

    user.save()

    super.shutdown()
  }
}

export default BoatYardState
