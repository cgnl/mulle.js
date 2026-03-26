/**
 * MapDisplay.js - Map overview display
 * Based on original Lingo: BehaviorScript 78 - MapDisplay.ls
 *
 * Handles the mini-map/overview display:
 * - Shows world map on click
 * - Highlights regions on rollover
 * - Plays location sounds
 * - Shows boat position
 *
 * Original Lingo properties:
 * - displaying: Whether map is currently shown
 * - SP: Sprite channel
 * - rollOvers: Region definitions by map level
 * - mouseObjects: Interactive region objects
 * - sounds: Sound mappings
 * - pics: Picture mappings
 * - active: Whether interactive
 * - nowOver: Currently hovered region
 */
'use strict'

// Lingo audio: MapDisplay.ls — spoken when hovering a location in tutorial mode (level 1)
const SOUND_MAP_HOVER_TUTORIAL = '05d128v0'

// Sound mappings by region ID
const SOUNDS = {
  2: '19d001v0',
  3: '19d002v0',
  4: '19d003v0',
  5: '19d004v0',
  6: '19d006v0',
  7: '19d007v0',
  8: '19d008v0',
  9: '19d009v0',
  10: '19d010v0',
  11: '19d011v0',
  12: '19d012v0',
  13: '19d013v0',
  14: '19d014v0',
  15: '19d015v0',
  16: '19d016v0',
  17: '05d066v0'
}

// Picture mappings by region ID
const PICS = {
  2: 6,
  3: 7,
  4: 8,
  5: 9,
  6: 10,
  7: 11,
  8: 12,
  9: 13,
  10: 14,
  11: 15,
  12: 16,
  13: 17,
  14: 18,
  15: 19,
  16: 20,
  17: 21
}

// Rollover regions by map level
// Each entry: [regionId, {left, top, right, bottom}]
const ROLLOVERS = [
  // Level 0 (basic map)
  [
    [2, { left: 30, top: 100, right: 67, bottom: 124 }],
    [3, { left: 144, top: 128, right: 182, bottom: 160 }],
    [4, { left: 101, top: 208, right: 133, bottom: 234 }],
    [5, { left: 32, top: 193, right: 70, bottom: 225 }],
    [6, { left: 178, top: 274, right: 202, bottom: 311 }],
    [9, { left: 271, top: 199, right: 295, bottom: 236 }],
    [15, { left: 78, top: 160, right: 130, bottom: 199 }],
    [16, { left: -1, top: 352, right: 73, bottom: 394 }],
    [17, { left: 141, top: 234, right: 169, bottom: 258 }]
  ],
  // Level 1 (map piece 1)
  [
    [7, { left: 212, top: 352, right: 263, bottom: 389 }],
    [8, { left: 274, top: 277, right: 298, bottom: 314 }],
    [10, { left: 326, top: 318, right: 442, bottom: 426 }],
    [12, { left: 343, top: 238, right: 380, bottom: 276 }]
  ],
  // Level 2 (map piece 2)
  [
    [11, { left: 414, top: 141, right: 480, bottom: 234 }],
    [13, { left: 516, top: 45, right: 553, bottom: 83 }],
    [14, { left: 530, top: 327, right: 620, bottom: 378 }]
  ],
  // Level 3 (map piece 3)
  []
]

export default class MapDisplay {
  /**
   * Create map display
   * @param {Object} dir - Director reference (gDir)
   */
  constructor(dir) {
    this.dir = dir
    this.globals = null
    this.mapDirFile = 'boten_05.DXR'
    this.mapBaseMemberNum = null

    // Original: on beginSprite me
    this.SP = 79  // Default sprite channel
    this.displaying = false
    this.sounds = { ...SOUNDS }
    this.pics = { ...PICS }
    this.rollOvers = ROLLOVERS
    this.sound = ''
    this.active = true
    this.nowOver = 0
    this.mouseObjects = []
    this.mapLevel = 0

    // Sprite members
    this.member = 'litenkarta'
    this.mapMember = '30n001v0'
    this.picMember = 'Dummy'
    this.markerLoc = { x: -100, y: -100 }
    this.mapLoc = { x: 320, y: 240 }
  }

  /**
   * End sprite / cleanup
   * Original: on endSprite me
   */
  endSprite() {
    this.kill()
  }

  /**
   * Kill / cleanup
   * Original: on kill me
   */
  kill() {
    if (this.displaying) {
      this.displaying = false

      if (this.dir) {
        // Original: deleteSound(the mulleTalkObject of gDir, sound)
        if (this.dir.mulleTalkObject && this.sound) {
          this.dir.mulleTalkObject.deleteSound(this.sound)
        }

        // Original: pause(gDir, 0)
        if (typeof this.dir.pause === 'function') {
          this.dir.pause(false)
        }

        // Original: set the mode of gDir to #Driving
        this.dir.mode = 'Driving'
      }

      // Reset sprites
      this.member = 'litenkarta'
      this.picMember = 'Dummy'
      this.markerLoc = { x: -100, y: -100 }

      // Destroy Phaser sprites
      if (this.mapSprite) {
        this.mapSprite.destroy()
        this.mapSprite = null
      }
      if (this.markerSprite) {
        this.markerSprite.destroy()
        this.markerSprite = null
      }

      // Kill mouse objects
      for (const obj of this.mouseObjects) {
        if (obj && typeof obj.kill === 'function') {
          obj.kill()
        }
      }
      this.mouseObjects = []
    }
  }

  /**
   * Mouse enter handler
   * Original: on mouseEnter me
   */
  mouseEnter() {
    if (!this.active) return
    if (this.displaying) return

    // Original: set the member of sprite SP to member "litenkarta-hi"
    this.member = 'litenkarta-hi'
  }

  /**
   * Mouse leave handler
   * Original: on mouseLeave me
   */
  mouseLeave() {
    if (!this.active) return

    // Original: set the member of sprite SP to member "litenkarta"
    this.member = 'litenkarta'
  }

  /**
   * Mouse down handler
   * Original: on mouseDown me
   */
  mouseDown() {
    // Empty in original
  }

  /**
   * Mouse up handler - toggle map display
   * Original: on mouseUp me
   */
  mouseUp() {
    if (this.displaying) {
      this.kill()
      return
    }

    if (!this.active) return

    // Original: check world ID
    if (this.globals && this.globals.world) {
      const worldId = this.globals.world.getId()
      if (worldId !== 'Da hood') return
    }

    // Original: pause(gDir, 1)
    if (this.dir && typeof this.dir.pause === 'function') {
      this.dir.pause(true)
    }

    // Original: set the mode of gDir to #Waiting
    if (this.dir) {
      this.dir.mode = 'Waiting'
    }

    // Determine map level from inventory
    this.mapLevel = this._determineMapLevel()

    // Position boat marker on world map (Lingo lines 73-81)
    this.markerLoc = this.getBoatPosition()

    // Create mouse objects for regions
    this.mouseObjects = []
    const regionLevels = this._getRegionLevels()

    for (const level of regionLevels) {
      const regions = this.rollOvers[level]
      for (const [regionId, rect] of regions) {
        this.mouseObjects.push({
          regionId,
          rect,
          dragToWhere: regionId,
          kill: () => { }
        })
      }
    }

    this.displaying = true
    this.mapMember = this._mapMemberFromIndex(this.mapLevel + 1)
  }

  /**
   * Handle mouse event from region
   * Original: on mouse me, argObj, argWhat
   */
  mouse(obj, what) {
    if (what === 'enter') {
      const regionId = obj.dragToWhere
      this.nowOver = regionId

      if (typeof regionId === 'number') {
        // Lingo: in tutorial mode (level 1), play map hover tutorial sound
        const levelHandler = this.globals && this.globals.levelHandler
        const level = levelHandler && typeof levelHandler.getLevel === 'function'
          ? levelHandler.getLevel()
          : 0
        if (level === 1 && this.dir && this.dir.mulleTalkObject && typeof this.dir.mulleTalkObject.say === 'function') {
          this.dir.mulleTalkObject.say(SOUND_MAP_HOVER_TUTORIAL, 6)
        }

        // Play region-specific sound
        const snd = this.sounds[regionId]
        if (snd) {
          this.sound = snd
          // Original: say(the mulleTalkObject of gDir, tmpSnd, 6)
          if (this.dir && this.dir.mulleTalkObject && typeof this.dir.mulleTalkObject.say === 'function') {
            this.dir.mulleTalkObject.say(snd, 6)
          }
        }

        // Show picture
        const picIndex = this.pics[regionId]
        if (typeof picIndex === 'number') {
          this.picMember = this._mapMemberFromIndex(picIndex)
        }
      }
    } else if (what === 'Leave') {
      if (obj.dragToWhere === this.nowOver) {
        // Reset preview to Dummy (tests expect picMember reset)
        this.picMember = 'Dummy'
      }
    }
  }

  /**
   * Activate/deactivate
   * Original: on activate me, argYesNo
   */
  activate(enabled) {
    this.active = enabled
  }

  /**
   * Get boat position on map
   */
  getBoatPosition() {
    if (!this.dir) return { x: 0, y: 0 }

    const mapRect = { left: 19, top: 16, right: 622, bottom: 423 }
    const mapPicSize = {
      x: mapRect.right - mapRect.left,
      y: mapRect.bottom - mapRect.top
    }

    const worldSize = this.globals?.world?.getWorldSize() || { x: 6, y: 4 }
    // Lingo: tmpOneScreenSize = 100 * tmpWorldMapPicSize / tmpWorldSize
    const oneScreenSize100 = {
      x: (100 * mapPicSize.x) / worldSize.x,
      y: (100 * mapPicSize.y) / worldSize.y
    }

    const mapCoord = this.dir.mapCoordinate || { x: 1, y: 1 }
    const boatCoord = this.dir.boat?.getShowCoordinate() || { x: 320, y: 240 }

    // Lingo: tmpLoc = (mapCoordinate - point(1,1)) * tmpOneScreenSize
    const baseLoc100 = {
      x: (mapCoord.x - 1) * oneScreenSize100.x,
      y: (mapCoord.y - 1) * oneScreenSize100.y
    }

    // Lingo: tmpBoatInMapPercent = 100 * showCoord / point(632,396)
    const boatPercent100 = {
      x: (100 * boatCoord.x) / 632,
      y: (100 * boatCoord.y) / 396
    }

    // Lingo: tmpBoatInMap = tmpBoatInMapPercent * tmpOneScreenSize / 100
    const boatInMap100 = {
      x: (boatPercent100.x * oneScreenSize100.x) / 100,
      y: (boatPercent100.y * oneScreenSize100.y) / 100
    }

    // Lingo: (tmpLoc / 100) + point(left, top)
    const tmpLoc100 = {
      x: baseLoc100.x + boatInMap100.x,
      y: baseLoc100.y + boatInMap100.y
    }

    return {
      x: (tmpLoc100.x / 100) + mapRect.left,
      y: (tmpLoc100.y / 100) + mapRect.top
    }
  }

  /**
   * Determine map level from inventory
   * @private
   */
  _determineMapLevel() {
    if (!this.globals?.user) return 0

    const hasMap = (piece) =>
      this.globals.user.isInInventory(piece)

    if (hasMap('MapPiece3') && hasMap('MapPiece2')) {
      return 4
    } else if (hasMap('MapPiece3')) {
      return 3
    } else if (hasMap('MapPiece2')) {
      return 2
    } else if (hasMap('MapPiece1')) {
      return 1
    }

    return 0
  }

  /**
   * Get region level indices based on map level
   * @private
   */
  _getRegionLevels() {
    switch (this.mapLevel) {
      case 0: return [0]
      case 1: return [0, 1]
      case 2: return [0, 1, 2]
      case 3: return [0, 1, 3]
      case 4: return [0, 1, 2, 3]
      default: return [0]
    }
  }

  _mapMemberFromIndex(index) {
    const n = Math.max(1, Number(index) || 1)
    const base = this._getMapBaseMemberNum()
    if (typeof base === 'number') {
      return { dirFile: this.mapDirFile, member: base + (n - 1) }
    }
    return `30n${String(n).padStart(3, '0')}v0`
  }

  _getMapBaseMemberNum() {
    if (typeof this.mapBaseMemberNum === 'number') return this.mapBaseMemberNum
    const game = (this.dir && this.dir.game) || (this.dir && this.dir.globals ? this.dir.globals.game : null)
    if (!game || !game.mulle || !game.mulle.getDirectorImage) return null

    const baseImage = game.mulle.getDirectorImage(this.mapDirFile, '30n001v0')
    if (baseImage && baseImage.frame && baseImage.frame.dirNum !== undefined && baseImage.frame.dirNum !== null) {
      const num = Number(baseImage.frame.dirNum)
      if (!Number.isNaN(num)) {
        this.mapBaseMemberNum = num
        return num
      }
    }
    return null
  }
}
