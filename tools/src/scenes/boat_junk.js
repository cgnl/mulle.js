/**
 * BoatJunkState - Boat parts storage shed (Shelves)
 * 
 * Based on boten_02.DXR (ParentScript 10 - Dir.ls)
 * 
 * ORIGINAL LINGO SYSTEM:
 * The shelves are STORAGE LOCATIONS, not categories!
 * - 6 shelves (#Shelf1-6) that can each hold ANY part type
 * - Max 80 parts per shelf
 * - Parts are placed at random positions within floor rects
 * - Navigation: up/down arrows to switch between shelves
 * - Exit to Quay (boatyard) or Yard
 * 
 * Original Lingo (ParentScript 10 - Dir.ls):
 *   spriteList = [#Sky: 1, #ShelfNr: 3, #JunkStart: 6, #DragPart: 90, #dialog: 95]
 *   case currentShelf of
 *     1: member "02b002v0"
 *     2: member "02b003v0"
 *     ...
 *   end case
 * 
 * Original Lingo (JunkViewHandler.ls):
 *   floorList = [#Shelf: [rect(145,94,632,95), rect(145,209,632,210), 
 *                         rect(145,314,632,315), rect(145,409,632,410)]]
 *   maxList = [#Shelf: 80]
 *   noOfShelfs = 6
 * 
 * Dialogue lists (Dir.ls):
 *   firstDialogList = ["02d002v0", "02d003v0"]
 *   genDialogList = ["02d004v0", "00d001v0", "00d002v0", "00d003v0", "00d004v0", "00d005v0"]
 */
'use strict'

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleButton from '../objects/button'
import MulleBoatPart from '../objects/boatpart'
import DirectorHelper from '../objects/DirectorHelper'
import SubtitleLoader from '../objects/SubtitleLoader'
import LingoSceneRuntime from '../objects/LingoSceneRuntime'
import boatJunkSpec from '../lingo/scenes/boat_junk_02'

/**
 * Floor rectangles for part placement on shelves
 * Original Lingo: rect(145, 94, 632, 95), etc.
 * These are the Y positions where parts can be placed
 */
const SHELF_FLOORS = [
  { y: 94, rect: new Phaser.Rectangle(145, 60, 487, 50) },   // Top shelf
  { y: 209, rect: new Phaser.Rectangle(145, 175, 487, 50) }, // Second shelf
  { y: 314, rect: new Phaser.Rectangle(145, 280, 487, 50) }, // Third shelf
  { y: 409, rect: new Phaser.Rectangle(145, 375, 487, 50) }  // Bottom shelf (floor)
]

/**
 * Maximum parts per shelf
 * Original Lingo: maxList = [#Shelf: 80]
 */
const MAX_PARTS_PER_SHELF = 80

/**
 * Number of shelves
 * Original Lingo: noOfShelfs = 6
 */
const NUM_SHELVES = 6

// Lingo parity: ParentScript 10 - Dir.ls (02/02)
// Transition: "NewShelf" — shelf navigation marker
const BOAT_JUNK_NEW_SHELF_TRANSITION = 'NewShelf'

class BoatJunkState extends MulleState {
  constructor () {
    super()

    this.DirResource = 'boten_02.DXR'
    
    // Shelf background members (02b002v0 - 02b007v0)
    // Original Lingo: case currentShelf of 1: member "02b002v0" ...
    this.shelfMembers = {
      1: '02b002v0',
      2: '02b003v0',
      3: '02b004v0',
      4: '02b005v0',
      5: '02b006v0',
      6: '02b007v0'
    }

    // Audio from original Lingo (Dir.ls lines 9-10)
    this.firstDialogList = ['02d002v0', '02d003v0']
    this.genDialogList = ['02d004v0', '00d001v0', '00d002v0', '00d003v0', '00d004v0', '00d005v0']
    
    // Sound effects
    this.clickSound = '02e003v0'
    this.dropSound = '00e110v0'
  }

  preload () {
    this.assetPrefix = 'boten/'
    super.preload()

    this.game.load.pack('boatjunk', 'assets/boatjunk.json', null, this)
    this.game.load.pack('boatparts', 'assets/boatparts.json', null, this)
    this.subtitles = new SubtitleLoader(this.game, 'boat_junk', ['dutch', 'english'])
    this.subtitles.preload('boatparts')
  }

  /**
   * Initialize junk storage structure if needed
   * Original Lingo: junk = [#Quay: [...], #Yard: [...], #Shelf1: [...], ...]
   */
  initJunkStorage () {
    if (!this.game.mulle.user.BoatJunk) {
      this.game.mulle.user.BoatJunk = {}
    }

    // Ensure all shelf locations exist
    // Original: #Quay, #Yard, #Shelf1-6
    const locations = ['Quay', 'Yard', 'Shelf1', 'Shelf2', 'Shelf3', 'Shelf4', 'Shelf5', 'Shelf6']
    locations.forEach(loc => {
      if (!this.game.mulle.user.BoatJunk[loc]) {
        this.game.mulle.user.BoatJunk[loc] = {}
      }
    })
  }

  /**
   * Save current shelf parts positions
   * Original Lingo: handled by JunkHandler
   */
  saveShelf () {
    if (!this.junkParts) return

    const shelfKey = 'Shelf' + this.currentShelf
    console.log('[BoatJunk] Saving parts for', shelfKey)

    this.game.mulle.user.BoatJunk[shelfKey] = {}

    this.junkParts.forEach((obj) => {
      if (obj.part_id) {
        this.game.mulle.user.BoatJunk[shelfKey][obj.part_id] = {
          x: obj.x,
          y: obj.y
        }
      }
    })

    this.game.mulle.user.save()
  }

  /**
   * Set current shelf view
   * Original Lingo (Dir.ls lines 30-43):
   *   case currentShelf of
   *     1: set the member of sprite ShelfNr to member "02b002v0"
   *     ...
   * @param {number} num - Shelf number (1-6)
   */
  setShelf (num) {
    if (this.junkParts) {
      this.saveShelf()
      this.junkParts.destroy()
    }

    this.currentShelf = num
    console.log('[BoatJunk] Switching to Shelf', num)

    // Update shelf indicator
    this.updateShelfIndicator()

    // Update navigation arrows visibility
    this.updateArrows()

    // Spawn parts for this shelf
    this.spawnPartsForShelf(num)
  }

  /**
   * Update shelf indicator/background
   * Original Lingo (Dir.ls lines 30-44):
   *   case currentShelf of
   *     1: set the member of sprite ShelfNr to member "02b002v0"
   *     2: set the member of sprite ShelfNr to member "02b003v0"
   *     ...
   *   set the loc of sprite ShelfNr to point(320, 240)
   */
  updateShelfIndicator () {
    // Update fallback text if visible
    if (this.shelfText && this.shelfText.visible) {
      this.shelfText.text = 'Plank ' + this.currentShelf
    }

    // Update Director sprite background to show current shelf
    // Each shelf has its own background member (02b002v0 - 02b007v0)
    if (this.shelfIndicatorSprite) {
      const memberName = this.shelfMembers[this.currentShelf]
      if (memberName) {
        if (this.shelfIndicatorSprite.setDirectorMember(this.DirResource, memberName)) {
          console.log('[BoatJunk] Set shelf background to', memberName)
        } else {
          console.warn('[BoatJunk] Could not load shelf member:', memberName)
        }
      }
    }
  }

  /**
   * Update arrow visibility based on current shelf
   * Original Lingo (Dir.ls lines 46-53):
   *   case currentShelf of 1,2,3,4,5: show up arrow
   *   case currentShelf of 2,3,4,5,6: show down arrow
   */
  updateArrows () {
    if (this.lingoRuntime) {
      this.lingoRuntime.refreshActive()
    }
  }

  /**
   * Get random position on one of the shelf floors
   * Original Lingo (JunkViewHandler.ls lines 49-64)
   */
  getRandomPosition (partId) {
    const floor = SHELF_FLOORS[Math.floor(Math.random() * SHELF_FLOORS.length)]
    const x = floor.rect.x + Math.random() * floor.rect.width
    const y = floor.rect.y + Math.random() * floor.rect.height
    return { x: Math.floor(x), y: Math.floor(y) }
  }

  /**
   * Check if shelf is full
   * Original Lingo: checkFull() in JunkViewHandler
   */
  isShelfFull (shelfNum) {
    const shelfKey = 'Shelf' + shelfNum
    const parts = this.game.mulle.user.BoatJunk[shelfKey] || {}
    return Object.keys(parts).length >= MAX_PARTS_PER_SHELF
  }

  /**
   * Spawn boat parts for current shelf
   * Original Lingo: drawParts() in JunkHandler
   * @param {number} shelfNum - Shelf number (1-6)
   */
  spawnPartsForShelf (shelfNum) {
    this.junkParts = this.game.add.group()

    const shelfKey = 'Shelf' + shelfNum
    const savedParts = this.game.mulle.user.BoatJunk[shelfKey] || {}

    for (let partId in savedParts) {
      const partData = this.game.mulle.getBoatPart(partId)
      if (!partData) continue

      const pos = savedParts[partId]
      const part = new MulleBoatPart(this.game, partId, pos.x, pos.y, true)

      // Set drop rectangles (all shelf floors)
      part.dropRects = SHELF_FLOORS.map(f => f.rect)

      // Setup drop targets
      this.setupPartDropTargets(part, partId)

      this.junkParts.addChild(part)
    }

    console.log('[BoatJunk] Spawned', this.junkParts.children.length, 'parts for Shelf', shelfNum)
  }

  /**
   * Setup drop targets for a part
   * Original Lingo: dropped() in JunkHandler
   */
  setupPartDropTargets (part, partId) {
    // Drop on door to Quay -> move part to Quay (boatyard floor)
    part.dropTargets.push([this.doorQuay, (d) => {
      if (this.movePartToLocation(partId, 'Quay')) {
        d.destroy()
        return true
      }
      return false
    }])

    // Drop on door to Yard -> move part to Yard
    part.dropTargets.push([this.doorYard, (d) => {
      if (this.movePartToLocation(partId, 'Yard')) {
        d.destroy()
        return true
      }
      return false
    }])

    // Drop on up arrow -> move to next shelf
    if (this.arrowUp) {
      part.dropTargets.push([this.arrowUp, (d) => {
        if (this.currentShelf < NUM_SHELVES) {
          if (this.movePartToShelf(partId, this.currentShelf + 1)) {
            d.destroy()
            return true
          }
        }
        return false
      }])
    }

    // Drop on down arrow -> move to previous shelf
    if (this.arrowDown) {
      part.dropTargets.push([this.arrowDown, (d) => {
        if (this.currentShelf > 1) {
          if (this.movePartToShelf(partId, this.currentShelf - 1)) {
            d.destroy()
            return true
          }
        }
        return false
      }])
    }
  }

  /**
   * Lingo runtime click handler
   * @param {object} obj Lingo mouseObject spec
   */
  onLingoClick (obj) {
    if (!obj) return

    switch (obj.dragToWhere) {
      case 'UpShelf':
        if (this.currentShelf < NUM_SHELVES) {
          this.setShelf(this.currentShelf + 1)
        }
        return
      case 'DownShelf':
        if (this.currentShelf > 1) {
          this.setShelf(this.currentShelf - 1)
        }
        return
      case 'Quay':
        console.log('[BoatJunk] Going to Quay (boatyard)')
        this.game.mulle.whereFrom = 'boat_junk'
        this.game.state.start('boatyard')
        return
      case 'Yard':
        console.log('[BoatJunk] Going to Yard (boten_03.DXR)')
        this.game.mulle.whereFrom = 'boat_junk'
        this.game.state.start('boat_yard')
        return
      default:
        break
    }

    if (obj.click && obj.click.frame === 'Quay') {
      this.game.mulle.whereFrom = 'boat_junk'
      this.game.state.start('boatyard')
      return
    }

    if (obj.click && obj.click.frame === 'Yard') {
      this.game.mulle.whereFrom = 'boat_junk'
      this.game.state.start('boat_yard')
    }
  }

  /**
   * Move a part to another shelf
   */
  movePartToShelf (partId, targetShelf) {
    const targetKey = 'Shelf' + targetShelf
    
    if (this.isShelfFull(targetShelf)) {
      // Play "shelf full" sound
      const fullSounds = ['03d011v0', '03d012v0', '03d014v0']
      const sound = fullSounds[Math.floor(Math.random() * fullSounds.length)]
      try {
        this.game.mulle.playAudio(sound)
      } catch (e) {}
      return false
    }

    const pos = this.getRandomPosition(partId)
    
    if (!this.game.mulle.user.BoatJunk[targetKey]) {
      this.game.mulle.user.BoatJunk[targetKey] = {}
    }
    
    this.game.mulle.user.BoatJunk[targetKey][partId] = pos
    this.saveShelf()
    
    try {
      this.game.mulle.playAudio(this.clickSound)
    } catch (e) {}
    
    console.log('[BoatJunk] Moved part', partId, 'to Shelf', targetShelf)
    return true
  }

  /**
   * Move a part to Quay or Yard
   * Original Lingo: addJunkPart(user, #Quay/#Yard, partId)
   */
  movePartToLocation (partId, location) {
    const maxParts = location === 'Quay' ? 30 : 10  // Original limits
    const currentParts = this.game.mulle.user.BoatJunk[location] || {}
    
    if (Object.keys(currentParts).length >= maxParts) {
      // Play "location full" sound
      const fullSounds = location === 'Quay' 
        ? ['00d007v0', '00d008v0'] 
        : ['00d009v0', '03d008v0', '03d009v0', '03d010v0']
      const sound = fullSounds[Math.floor(Math.random() * fullSounds.length)]
      try {
        this.game.mulle.playAudio(sound)
      } catch (e) {}
      return false
    }

    // Random position for Quay/Yard floors
    // Original: #Quay: rect(4,475,544,476), #Yard: rect(4,475,636,476)
    const pos = {
      x: location === 'Quay' 
        ? 4 + Math.floor(Math.random() * 540)
        : 4 + Math.floor(Math.random() * 632),
      y: 450 + Math.floor(Math.random() * 20)
    }
    
    if (!this.game.mulle.user.BoatJunk[location]) {
      this.game.mulle.user.BoatJunk[location] = {}
    }
    
    this.game.mulle.user.BoatJunk[location][partId] = pos
    this.saveShelf()
    
    try {
      this.game.mulle.playAudio(this.dropSound)
    } catch (e) {}
    
    console.log('[BoatJunk] Moved part', partId, 'to', location)
    return true
  }

  create () {
    super.create()

    // Initialize storage
    this.initJunkStorage()

    this.junkParts = null
    this.OKToTalk = true
    this.dialogClosed = true
    this.loopCounter = 120 + Math.floor(Math.random() * 360)

    // Check first time visit
    // Original Lingo: FirstTime = getaProp(firstTimeList, #Shelf)
    this.firstTime = !this.game.mulle.user.visitedShelf
    if (this.firstTime) {
      this.loopCounter = 12  // Talk soon on first visit
      this.game.mulle.user.visitedShelf = true
    }

    // === SKY ===
    // Original Lingo: setSky(the weather of gMulleGlobals)
    // spriteList = [#Sky: 1, ...]
    this.setSky()

    // Create background
    this.createBackground()

    // Create navigation elements
    this.createNavigation()

    // Set initial shelf (remember last visited)
    // Original Lingo: enterShelf from gMulleGlobals
    const lastShelf = this.game.mulle.user.lastBoatShelf || 1
    this.setShelf(lastShelf)

    // Start dialogue loop
    // Original Lingo: addObject(loopMaster, me)
    this.startDialogueLoop()

    // Audio setup - boatparts audio already loaded in load.js
    this.subtitles.load('boatparts')

    // Hotkey W for world select
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      this.game.state.start('worldselect')
    })

    console.log('[BoatJunk] Scene created - Original shelf-based system')
  }

  /**
   * Create background using Director sprites
   * Original Lingo (Dir.ls):
   *   spriteList = [#Sky: 1, #ShelfNr: 3, ...]
   *   set the member of sprite ShelfNr to member "02b002v0"
   *   set the loc of sprite ShelfNr to point(320, 240)
   */
  createBackground () {
    // Full background image (member 1: 02b001v1, 640x480)
    // Original Lingo: sprite #Sky: 1
    this.backgroundSprite = new MulleSprite(this.game, 320, 240, null, null)
    if (this.backgroundSprite.setDirectorMember(this.DirResource, '02b001v1')) {
      this.game.add.existing(this.backgroundSprite)
      this.background = this.backgroundSprite
    } else {
      // Fallback: programmatic background
      this.backgroundSprite.destroy()
      this.backgroundSprite = null
      
      const graphics = this.game.add.graphics(0, 0)
      graphics.beginFill(0x8B4513)
      graphics.drawRect(0, 0, 640, 480)
      graphics.endFill()
      graphics.beginFill(0xA0522D)
      SHELF_FLOORS.forEach(floor => {
        graphics.drawRect(140, floor.y - 5, 500, 12)
      })
      graphics.endFill()
      graphics.beginFill(0x654321)
      graphics.drawRect(0, 0, 140, 480)
      graphics.endFill()
      this.background = graphics
    }

    // Shelf number indicator sprite (member 2-7: 02b002v0-02b007v0, 26x61 px)
    // Original Lingo: sprite #ShelfNr: 3, loc = point(320, 240)
    this.shelfIndicatorSprite = new MulleSprite(this.game, 320, 240, null, null)
    const initialMember = this.shelfMembers[1]
    if (this.shelfIndicatorSprite.setDirectorMember(this.DirResource, initialMember)) {
      this.game.add.existing(this.shelfIndicatorSprite)
    } else {
      console.warn('[BoatJunk] Could not load shelf indicator')
      this.shelfIndicatorSprite.destroy()
      this.shelfIndicatorSprite = null
    }
  }

  /**
   * Create navigation elements using Director sprites where available
   * Original Lingo (Dir.ls lines 45-55):
   *   mouseObject for UpShelf: rect(111, 24, 137, 50)
   *   mouseObject for DownShelf: rect(111, 67, 137, 94)
   *   mouseObject for Quay: rect(48, 0, 137, 287)
   *   mouseObject for Yard: rect(0, 313, 137, 480)
   */
  createNavigation () {
    // Shelf number text indicator (fallback if Director sprite not available)
    // The original uses the shelf background member which includes the number
    this.shelfText = this.game.add.text(70, 30, 'Plank 1', {
      font: 'bold 18px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    this.shelfText.anchor.setTo(0.5, 0.5)
    // Hide if we have proper Director sprites
    if (this.shelfIndicatorSprite) {
      this.shelfText.visible = false
    }

    // Lingo-lite runtime mouseObjects
    this.lingoRuntime = new LingoSceneRuntime(this, boatJunkSpec)
    this.lingoRuntime.build()
    this.lingoRuntime.startLoop()

    // Cache references for drop targets
    this.arrowNeutral = this.lingoRuntime.getById(303)
    this.arrowUp = this.lingoRuntime.getById(305)
    this.arrowDown = this.lingoRuntime.getById(304)
    this.doorQuay = this.lingoRuntime.getById(301)
    this.doorYard = this.lingoRuntime.getById(302)
  }

  /**
   * Start the dialogue loop timer
   * Original Lingo: loop() handler in Dir.ls lines 95-118
   */
  startDialogueLoop () {
    this.dialogueTimer = this.game.time.events.loop(
      Phaser.Timer.SECOND,
      () => this.processDialogueLoop(),
      this
    )
  }

  /**
   * Process dialogue loop
   * Original Lingo (Dir.ls lines 95-118):
   *   if OKToTalk and dialogClosed then
   *     loopCounter--
   *     if FirstTime and loopCounter = 0 then play firstDialogList
   *     else if loopCounter = 0 then play random genDialogList
   */
  processDialogueLoop () {
    if (!this.OKToTalk || !this.dialogClosed) return

    this.loopCounter--

    if (this.loopCounter <= 0) {
      if (this.firstTime && this.firstDialogList.length > 0) {
        // Play first-time dialogue
        const dialog = this.firstDialogList.shift()
        this.playDialogue(dialog)
        this.loopCounter = 120 + Math.floor(Math.random() * 120)
        
        if (this.firstDialogList.length === 0) {
          this.firstTime = false
        }
      } else {
        // Play random general dialogue
        const dialog = this.genDialogList[Math.floor(Math.random() * this.genDialogList.length)]
        this.playDialogue(dialog)
        this.loopCounter = 360 + Math.floor(Math.random() * 720)
      }
    }
  }

  /**
   * Play a dialogue sound
   * Original Lingo: makeMulleTalk(me, argSnd)
   */
  playDialogue (soundId) {
    try {
      this.game.mulle.playAudio(soundId)
      console.log('[BoatJunk] Playing dialogue:', soundId)
    } catch (e) {
      console.warn('[BoatJunk] Could not play dialogue:', soundId)
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
      this.game.add.existing(this.skySprite)
      console.log('[BoatJunk] Sky sprite loaded:', skyMemberName, 'for weather type:', weatherType)
    } else {
      // Fallback: Create simple sky gradient
      console.log('[BoatJunk] Sky sprite not found, using fallback for weather type:', weatherType)
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

    // Draw gradient sky (top portion visible through window)
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

    console.log('[BoatJunk] Fallback sky created for weather type:', weatherType)
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
    console.log('[BoatJunk] Shutdown')

    // Stop dialogue timer
    if (this.dialogueTimer) {
      this.game.time.events.remove(this.dialogueTimer)
      this.dialogueTimer = null
    }

    // Save current shelf
    if (this.junkParts) {
      this.saveShelf()
    }

    // Remember last shelf
    // Original Lingo: whereFrom = "02"
    this.game.mulle.user.lastBoatShelf = this.currentShelf

    // Clean up sky sprite/graphics
    if (this.skySprite) {
      this.skySprite.destroy()
      this.skySprite = null
    }
    if (this.skyGraphics) {
      this.skyGraphics.destroy()
      this.skyGraphics = null
    }

    if (this.lingoRuntime) {
      this.lingoRuntime.destroy()
      this.lingoRuntime = null
    }

    this.game.mulle.user.save()

    super.shutdown()
  }
}

export default BoatJunkState
