/**
 * BoatJunkState - Boat parts storage shed
 * 
 * Equivalent of JunkState (junk.js) but for boat parts
 * Based on boten_02.DXR
 * 
 * Original Lingo data from boten_02.DXR:
 * - Member 1: 02b001v1 - Main background (640x480)
 * - Members 2-7: 02b002v0 - 02b007v0 - Navigation buttons (26x61 each)
 * - Members 17-19: 02d002v0 - 02d004v0 - Audio dialogue
 * - Member 20: 02e003v0 - Sound effect
 * - Member 25: PartData - Part configuration
 * 
 * Unlike the car junk which has 6 different pile backgrounds,
 * the boat junk appears to have a single view with category buttons.
 */
'use strict'

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleButton from '../objects/button'
import MulleBoatPart from '../objects/boatpart'
import MulleActor from '../objects/actor'
import DirectorHelper from '../objects/DirectorHelper'
import SubtitleLoader from '../objects/SubtitleLoader'

/**
 * Boat part categories based on original Lingo Properties
 */
const BOAT_PART_CATEGORIES = {
  1: { name: 'Rompen', filter: (p) => p.getProperty('largeship') || p.getProperty('mediumship') || p.getProperty('smallship') },
  2: { name: 'Motoren', filter: (p) => p.getProperty('engine') || p.getProperty('outboardengine') },
  3: { name: 'Zeilen', filter: (p) => p.getProperty('sailwithpole') },
  4: { name: 'Besturing', filter: (p) => p.getProperty('rudder') || p.getProperty('steerpart') },
  5: { name: 'Roeispanen', filter: (p) => p.getProperty('oar') },
  6: { name: 'Accessoires', filter: (p) => p.getProperty('bench') || p.getProperty('doghouse') || p.getProperty('compass') || p.getProperty('watertank') }
}

class BoatJunkState extends MulleState {
  constructor () {
    super()

    this.DirResource = 'boten_02.DXR'
    
    // Category buttons from boten_02.DXR members 2-7
    this.categoryButtons = {
      1: { member: 2, hoverMember: 2 },  // 02b002v0 - Rompen
      2: { member: 3, hoverMember: 3 },  // 02b003v0 - Motoren
      3: { member: 4, hoverMember: 4 },  // 02b004v0 - Zeilen
      4: { member: 5, hoverMember: 5 },  // 02b005v0 - Besturing
      5: { member: 6, hoverMember: 6 },  // 02b006v0 - Roeispanen
      6: { member: 7, hoverMember: 7 }   // 02b007v0 - Accessoires
    }

    // Audio from original Lingo
    this.thoughtSounds = ['02d002v0', '02d003v0', '02d004v0']
    this.ambientSound = '02e003v0'
  }

  preload () {
    this.assetPrefix = 'boten/'
    super.preload()

    this.game.load.pack('boat_junk', 'assets/boat_junk.json', null, this)
    this.subtitles = new SubtitleLoader(this.game, 'boat_junk', ['dutch', 'english'])
    this.subtitles.preload('boatparts')
  }

  /**
   * Save current pile/category parts positions
   */
  savePile () {
    console.log('[BoatJunk] Saving parts for category', this.currentCategory)

    if (!this.game.mulle.user.BoatJunk) {
      this.game.mulle.user.BoatJunk = {}
    }

    this.game.mulle.user.BoatJunk['Category' + this.currentCategory] = {}

    this.junkParts.forEach((obj) => {
      this.game.mulle.user.BoatJunk['Category' + this.currentCategory][obj.part_id] = {
        x: obj.x,
        y: obj.y
      }
    })

    this.game.mulle.user.save()
  }

  /**
   * Set current category/pile view
   * @param {number} num - Category number (1-6)
   */
  setCategory (num) {
    if (this.junkParts) {
      this.savePile()
      this.junkParts.destroy()
    }

    this.currentCategory = num
    console.log('[BoatJunk] Switching to category', num, BOAT_PART_CATEGORIES[num].name)

    // Update category indicator
    this.updateCategoryIndicator()

    // Setup drop rectangles for this view
    // Based on original Lingo rect data - using reasonable defaults
    this.dropRects = [
      new Phaser.Rectangle(50, 280, 540, 180),   // Main floor area
      new Phaser.Rectangle(50, 150, 540, 130),   // Shelf area
      new Phaser.Rectangle(50, 80, 400, 70)      // Top shelf
    ]

    // Spawn parts for this category
    this.spawnPartsForCategory(num)
  }

  /**
   * Update the category indicator text
   */
  updateCategoryIndicator () {
    if (this.categoryText) {
      this.categoryText.text = BOAT_PART_CATEGORIES[this.currentCategory].name
    }
  }

  /**
   * Spawn boat parts that belong to current category
   * @param {number} categoryNum - Category number
   */
  spawnPartsForCategory (categoryNum) {
    this.junkParts = this.game.add.group()

    // Get saved positions for this category
    const savedPositions = this.game.mulle.user.BoatJunk?.['Category' + categoryNum] || {}

    // Get all boat parts from database that match this category
    const category = BOAT_PART_CATEGORIES[categoryNum]
    const partsDB = this.game.mulle.BoatPartsDB || {}

    for (let partId in savedPositions) {
      const partData = this.game.mulle.getBoatPart(partId)
      if (!partData) continue

      // Check if part matches category filter
      if (!category.filter(partData)) continue

      const pos = savedPositions[partId]
      const part = new MulleBoatPart(this.game, partId, pos.x, pos.y, true)

      part.dropRects = this.dropRects

      // Drop on door -> go to boatyard shopFloor
      part.dropTargets.push([this.doorShop, (d) => {
        d.destroy()

        if (!this.game.mulle.user.BoatJunk.shopFloor) {
          this.game.mulle.user.BoatJunk.shopFloor = {}
        }

        this.game.mulle.user.BoatJunk.shopFloor[partId] = {
          x: this.game.rnd.integerInRange(100, 540),
          y: this.game.rnd.integerInRange(380, 440)
        }

        this.savePile()
        this.game.mulle.playAudio('00e004v0')

        return true
      }])

      // Drop on left arrow -> previous category
      part.dropTargets.push([this.arrowLeft, (d) => {
        d.destroy()

        let prevCat = this.currentCategory - 1
        if (prevCat < 1) prevCat = 6

        if (!this.game.mulle.user.BoatJunk['Category' + prevCat]) {
          this.game.mulle.user.BoatJunk['Category' + prevCat] = {}
        }

        this.game.mulle.user.BoatJunk['Category' + prevCat][partId] = {
          x: this.game.rnd.integerInRange(100, 540),
          y: this.game.rnd.integerInRange(200, 350)
        }

        this.savePile()
        this.game.mulle.playAudio('00e004v0')

        return true
      }])

      // Drop on right arrow -> next category
      part.dropTargets.push([this.arrowRight, (d) => {
        d.destroy()

        let nextCat = this.currentCategory + 1
        if (nextCat > 6) nextCat = 1

        if (!this.game.mulle.user.BoatJunk['Category' + nextCat]) {
          this.game.mulle.user.BoatJunk['Category' + nextCat] = {}
        }

        this.game.mulle.user.BoatJunk['Category' + nextCat][partId] = {
          x: this.game.rnd.integerInRange(100, 540),
          y: this.game.rnd.integerInRange(200, 350)
        }

        this.savePile()
        this.game.mulle.playAudio('00e004v0')

        return true
      }])

      this.junkParts.addChild(part)
    }

    console.log('[BoatJunk] Spawned', this.junkParts.children.length, 'parts for category', categoryNum)
  }

  create () {
    super.create()

    // Initialize BoatJunk storage if not exists
    if (!this.game.mulle.user.BoatJunk) {
      this.game.mulle.user.BoatJunk = {
        shopFloor: {},
        Category1: {},
        Category2: {},
        Category3: {},
        Category4: {},
        Category5: {},
        Category6: {}
      }
    }

    this.background = null
    this.doorShop = null
    this.arrowRight = null
    this.arrowLeft = null
    this.dropRects = null
    this.junkParts = null

    // Create background from boten_02.DXR member 1 (02b001v1)
    this.background = new MulleSprite(this.game, 320, 240)
    if (!this.background.setDirectorMember('boten_02.DXR', 1)) {
      // Fallback: create procedural background
      console.warn('[BoatJunk] Could not load background, using fallback')
      this.createFallbackBackground()
    }
    this.game.add.existing(this.background)

    // Door back to boatyard
    this.doorShop = new MulleButton(this.game, 580, 400, {
      imageDefault: ['boten_02.DXR', 2],
      imageHover: ['boten_02.DXR', 2],
      soundDefault: '02e015v0',
      soundHover: '02e016v0',
      click: () => {
        console.log('[BoatJunk] Returning to boatyard')
        this.game.mulle.activeCutscene = 71
        this.game.state.start('boatyard')
      }
    })
    this.doorShop.cursor = 'Point'
    this.game.add.existing(this.doorShop)

    // Left arrow - previous category
    this.arrowLeft = new MulleButton(this.game, 30, 240, {
      imageDefault: ['boten_02.DXR', 6],
      imageHover: ['boten_02.DXR', 6],
      click: () => {
        let prevCat = this.currentCategory - 1
        if (prevCat < 1) prevCat = 6
        this.setCategory(prevCat)
      }
    })
    this.arrowLeft.cursor = 'Left'
    this.game.add.existing(this.arrowLeft)

    // Right arrow - next category
    this.arrowRight = new MulleButton(this.game, 610, 240, {
      imageDefault: ['boten_02.DXR', 7],
      imageHover: ['boten_02.DXR', 7],
      click: () => {
        let nextCat = this.currentCategory + 1
        if (nextCat > 6) nextCat = 1
        this.setCategory(nextCat)
      }
    })
    this.arrowRight.cursor = 'Right'
    this.game.add.existing(this.arrowRight)

    // Category indicator text
    this.categoryText = this.game.add.text(320, 30, '', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 3
    })
    this.categoryText.anchor.setTo(0.5, 0.5)

    // Set initial category
    const lastCategory = this.game.mulle.user.myLastBoatPile || 1
    this.setCategory(lastCategory)

    // Add audio
    this.game.mulle.addAudio('boat_junk')
    this.subtitles.load('boatparts')

    // Play ambient sound
    this.game.mulle.playAudio('02e003v0', true)

    // Hotkey W for world select
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      this.game.state.start('worldselect')
    })

    console.log('[BoatJunk] Scene created')
  }

  /**
   * Create fallback background if assets not loaded
   */
  createFallbackBackground () {
    const graphics = this.game.add.graphics(0, 0)

    // Wooden shed background
    graphics.beginFill(0x8B4513)  // Brown
    graphics.drawRect(0, 0, 640, 480)
    graphics.endFill()

    // Floor
    graphics.beginFill(0x654321)
    graphics.drawRect(0, 380, 640, 100)
    graphics.endFill()

    // Shelves
    graphics.beginFill(0xA0522D)
    graphics.drawRect(50, 150, 540, 10)
    graphics.drawRect(50, 280, 540, 10)
    graphics.endFill()

    this.background = graphics
  }

  shutdown () {
    console.log('[BoatJunk] Shutdown')

    // Stop ambient sound
    this.game.mulle.stopAudio('02e003v0')

    // Save current pile
    this.savePile()

    // Remember last category
    this.game.mulle.user.myLastBoatPile = this.currentCategory

    this.game.mulle.user.save()

    super.shutdown()
  }

  render () {
    // Debug: show drop rectangles
    // if (this.dropRects) {
    //   this.dropRects.forEach(r => this.game.debug.geom(r, '#00ff00'))
    // }
  }
}

export default BoatJunkState
