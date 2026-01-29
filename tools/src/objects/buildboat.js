/**
 * Buildable boat
 * @module objects/buildboat
 * 
 * Equivalent of MulleBuildCar but for boats
 * Uses boat parts from boten/CDDATA.CXT
 */
'use strict'

import MulleSprite from 'objects/sprite'
import MulleActor from 'objects/actor'

/**
 * Buildable boat
 * @extends Phaser.Group
 */
class MulleBuildBoat extends Phaser.Group {
  /**
   * Create boat
   * @param  {Phaser.Game} game
   * @param  {number}      x
   * @param  {number}      y
   * @param  {Array}       parts
   * @param  {Boolean}     isLocked
   * @param  {Boolean}     hasDriver - Show captain/mulle on boat
   * @return {void}
   */
  constructor (game, x, y, parts, isLocked = false, hasDriver = false) {
    super(game)

    this.x = x
    this.y = y

    if (parts) {
      this.parts = parts
    } else {
      // Default: get parts from user's boat
      this.parts = this.game.mulle.user.Boat ? this.game.mulle.user.Boat.Parts : [1]
    }

    this.locked = isLocked

    this.partSprites = {}

    this.points = {}
    this.layers = {}

    this.usedPoints = {}
    this.coveredPoints = {}

    this.captainSit = null
    this.hasDriver = hasDriver

    this.onAttach = new Phaser.Signal()
    this.onDetach = new Phaser.Signal()
    this.onRefresh = new Phaser.Signal()

    // Reference to junk parts container (set externally)
    this.junkParts = null

    this.refresh()
  }

  /**
   * Refresh visible object with parts set earlier
   * @return {void}
   */
  refresh () {
    this.points = {}
    this.layers = {}

    this.usedPoints = {}
    this.coveredPoints = {}

    // Clear existing sprites
    this.removeAll(true)
    this.partSprites = {}

    for (let partNum in this.parts) {
      let partId = this.parts[partNum]
      let partData = this.getBoatPart(partId)

      if (!partData) {
        console.error('[BuildBoat] Invalid part', partId)
        continue
      }

      this.partSprites[partId] = {}

      // Register new attachment points from this part
      if (partData.new) {
        partData.new.forEach((v, k) => {
          // Boat parts have different structure: [[pointId, [fg, bg], [offsetX, offsetY]], ...]
          // v = [pointId, [fg, bg], [offsetX, offsetY]]
          if (Array.isArray(v) && v.length >= 3) {
            const pointId = v[0]
            const layers = v[1]
            const offset = v[2]
            this.points[pointId] = { 
              fg: layers[0], 
              bg: layers[1], 
              offset: { x: offset[0], y: offset[1] }
            }
          }
        })
      }

      // Track required attachment points
      if (partData.Requires && partData.Requires !== 0) {
        if (Array.isArray(partData.Requires)) {
          partData.Requires.forEach((s) => {
            this.usedPoints[s] = true
          })
        } else {
          this.usedPoints[partData.Requires] = true
        }
      }

      // Create foreground sprite (UseView)
      if (partData.UseView) {
        let sprite_fg = new MulleSprite(this.game, 0, 0)
        
        // Boat parts use boten_CDDATA.CXT
        const loaded = sprite_fg.setDirectorMember('boten_CDDATA.CXT', partData.UseView)
        
        if (!loaded) {
          // Fallback: try loading by frame name
          sprite_fg.setFrameId(partData.UseView)
        }

        sprite_fg.partId = partId
        sprite_fg.layer = partData.Requires && partData.Requires !== 0 
          ? (Array.isArray(partData.Requires) ? partData.Requires[0] : partData.Requires)
          : 'base'

        sprite_fg.sortIndex = this.points[sprite_fg.layer] ? this.points[sprite_fg.layer].fg : 8

        // Apply offset
        if (partData.Offset && partData.Offset.length >= 2) {
          sprite_fg.position.add(partData.Offset[0], partData.Offset[1])
        }

        // Make draggable if not locked
        if (!this.locked && partData.Requires && partData.Requires !== 0) {
          sprite_fg.inputEnabled = true

          sprite_fg.events.onInputOver.add(() => {
            this.game.mulle.cursor.current = 'Grab'
          })

          sprite_fg.events.onInputOut.add(() => {
            this.game.mulle.cursor.current = null
          })

          sprite_fg.events.onInputDown.add((ev) => {
            this.game.mulle.cursor.current = null
            console.debug('[BuildBoat] Detach part by drag', partId)
            this.detach(partId)
          }, this.game)
        }

        this.add(sprite_fg)
        this.partSprites[partId]['fg'] = sprite_fg
      }

      // Create background sprite (UseView2)
      if (partData.UseView2) {
        let sprite_bg = new MulleSprite(this.game, 0, 0)
        sprite_bg.setDirectorMember('boten_CDDATA.CXT', partData.UseView2)
        
        sprite_bg.partId = partId
        sprite_bg.layer = partData.Requires && partData.Requires !== 0
          ? (Array.isArray(partData.Requires) ? partData.Requires[0] : partData.Requires)
          : 'base'
        sprite_bg.sortIndex = this.points[sprite_bg.layer] ? this.points[sprite_bg.layer].bg : 7
        sprite_bg.is_bg = true

        if (partData.Offset && partData.Offset.length >= 2) {
          sprite_bg.position.add(partData.Offset[0], partData.Offset[1])
        }

        this.add(sprite_bg)
        this.partSprites[partId]['bg'] = sprite_bg
      }
    }

    // Add captain/mulle if driving
    if (this.hasDriver) {
      this.captainSit = new MulleActor(this.game, 0, -30, 'mulleSit')
      this.captainSit.isMulle = true
      this.captainSit.sortIndex = 18
      this.addChild(this.captainSit)
      this.game.mulle.actors.mulle = this.captainSit
    }

    // Build layer map
    for (var k in this.points) {
      this.layers[k] = { fg: this.points[k].fg, bg: this.points[k].bg }
    }

    this.sortLayers()
    this.onRefresh.dispatch()

    console.debug('[BuildBoat] Attachment points', this.points)
  }

  /**
   * Get boat part data from BoatPartsDB
   * @param {number} partId 
   * @returns {object|null}
   */
  getBoatPart (partId) {
    // First try BoatPartsDB
    if (this.game.mulle.BoatPartsDB && this.game.mulle.BoatPartsDB[partId]) {
      return this.game.mulle.BoatPartsDB[partId]
    }
    
    // Fallback: return basic structure
    console.warn('[BuildBoat] Part not in BoatPartsDB:', partId)
    return null
  }

  sortLayers () {
    this.customSort((a, b) => {
      return a.sortIndex < b.sortIndex ? -1 : 1
    })
  }

  /**
   * Attach a part by ID
   * @param  {number} partId
   * @param  {Boolean} noSave - Don't save after attaching
   * @return {Boolean} successful
   */
  attach (partId, noSave = false) {
    if (this.locked) return false

    this.parts.push(parseInt(partId))

    this.onAttach.dispatch(partId)

    this.refresh()

    if (!noSave) this.save()

    return true
  }

  /**
   * Detach a part by ID
   * @param  {number}  partId
   * @param  {Boolean} makePart - Create part and start dragging
   * @return {Boolean} successful
   */
  detach (partId, makePart = false) {
    if (this.locked) return false

    console.debug('[BuildBoat] Detach part', partId)

    var partIndex = this.parts.indexOf(partId)
    if (partIndex === -1) return false

    let partData = this.getBoatPart(partId)

    var newPos = this.partSprites[partId] && this.partSprites[partId].fg 
      ? this.partSprites[partId].fg.worldPosition.clone()
      : new Phaser.Point(0, 0)
    var newId = partData && partData.Master ? partData.Master : partId

    this.parts.splice(partIndex, 1)

    this.onDetach.dispatch(partId, newId, newPos)

    this.refresh()

    // Note: makePart logic would need BoatPart class (similar to MulleCarPart)
    // For now, just save
    if (makePart) {
      console.log('[BuildBoat] makePart not fully implemented yet')
    }

    this.save()

    return true
  }

  destroy () {
    if (this.captainSit && this.game.mulle.actors.mulle === this.captainSit) {
      this.game.mulle.actors.mulle = null
    }

    super.destroy()
  }

  /**
   * Trash the boat and place parts in junkyard
   */
  trash () {
    let partId, partData
    for (partId of this.parts) {
      if (partId > 1) {
        partData = this.getBoatPart(partId)

        if (partData && partData.Master) {
          partId = partData.Master
        }
        
        // Place part in boatyard junk
        if (this.game.mulle.user.BoatJunk) {
          this.game.mulle.user.BoatJunk.boatyard = this.game.mulle.user.BoatJunk.boatyard || {}
          this.game.mulle.user.BoatJunk.boatyard[partId] = new Phaser.Point(
            this.game.rnd.integerInRange(100, 500),
            this.game.rnd.integerInRange(380, 440)
          )
        }
      }
    }

    // Reset to default hull only
    this.parts = [1]
    
    if (this.game.mulle.user.Boat) {
      this.game.mulle.user.Boat.Medals = []
      this.game.mulle.user.Boat.Name = ''
    }
    
    this.refresh()
    this.save()
  }

  /**
   * Dump data into user save object
   * @return {void}
   */
  save () {
    if (this.game.mulle.user.Boat) {
      this.game.mulle.user.Boat.Parts = this.parts
    }
  }

  /**
   * Check if boat is seaworthy
   * @returns {boolean}
   */
  isSeaworthy () {
    if (!this.game.mulle.user.Boat) return false
    return this.game.mulle.user.Boat.isSeaworthy()
  }
}

export default MulleBuildBoat
