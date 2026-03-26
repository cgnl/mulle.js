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
   * @param  {Object}      boatViewHandler - Handler for view offset calculation
   * @return {void}
   */
  constructor (game, x, y, parts, isLocked = false, hasDriver = false, boatViewHandler = null) {
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
    
    // Handler for dynamic offset calculation (#2)
    this.boatViewHandler = boatViewHandler

    this.onAttach = new Phaser.Signal()
    this.onDetach = new Phaser.Signal()
    this.onRefresh = new Phaser.Signal()

    // Reference to junk parts container (set externally)
    this.junkParts = null
    
    // Water sprite reference (#1, #23)
    this.waterSprite = null
    
    // Foreground overlay reference (dock/quay ground that overlaps bottom of boat)
    this.foregroundOverlay = null
    
    // Hull inside view tracking (#17, #22)
    this.hullInsideVisible = false

    this.refresh()
  }

  /**
   * Refresh visible object with parts set earlier
   * @return {void}
   */
  refresh () {
    this.clearBoat()
    
    this.points = {}
    this.layers = {}

    this.usedPoints = {}
    this.coveredPoints = {}

    // Clear existing sprites
    this.removeAll(true)
    this.partSprites = {}
    
    // Reset hull inside view state
    this.hullInsideVisible = false

    // Get hull and rudder (#16-20, #38-39)
    const hullId = this.getHull()
    const rudderId = this.getRudder()

    for (let partNum in this.parts) {
      let partId = this.parts[partNum]
      let partData = this.getBoatPart(partId)

      if (!partData) {
        console.error('[BuildBoat] Invalid part', partId)
        continue
      }

      this.partSprites[partId] = {}

      // BUG FIX #1: Register new attachment points from this part (#12)
      // Original Lingo (line 30-35 in DragScript.ls):
      // set tmpList to getNewPoints(tmpPartObj)
      // if listp(tmpList) then
      //   repeat with tmpRkn = 1 to count(tmpList)
      //     add(tmpNewPoints, getAt(getAt(tmpList, tmpRkn), 1))
      // Double-nested array: [[pointId, [fg, bg], [offsetX, offsetY]], ...]
      // Register new attachment points from this part
      // Support both raw array format [[pointId, [fg, bg], [x, y]], ...]
      // and parsed object format [{id, fg, bg, offset}, ...]
      const newPoints = partData.New || partData.new
      if (newPoints && Array.isArray(newPoints)) {
        newPoints.forEach((v) => {
          if (Array.isArray(v) && v.length >= 3) {
            // Raw array format: [pointId, [fg, bg], [offsetX, offsetY]]
            const pointId = v[0]
            const layers = v[1]
            const offset = v[2]
            if (Array.isArray(layers) && layers.length >= 2 && 
                Array.isArray(offset) && offset.length >= 2) {
              this.points[pointId] = { 
                fg: layers[0], bg: layers[1], 
                offset: { x: offset[0], y: offset[1] }
              }
            }
          } else if (v && v.id !== undefined) {
            // Parsed object format: {id, fg, bg, offset: Phaser.Point}
            this.points[v.id] = { 
              fg: v.fg, bg: v.bg, 
              offset: { x: v.offset ? v.offset.x : 0, y: v.offset ? v.offset.y : 0 }
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

      // Track covered points (blocked by this part)
      if (partData.Covers && partData.Covers !== 0) {
        if (Array.isArray(partData.Covers)) {
          partData.Covers.forEach((s) => {
            this.coveredPoints[s] = true
          })
        } else {
          this.coveredPoints[partData.Covers] = true
        }
      }

      // Special handling for hull (#14-#15, #16-#18, #21-#23)
      const isHull = partId === hullId
      const isRudder = partId === rudderId

      // Fix #53: Variant parts (Master != 0) may have empty UseView/UseView2.
      // Fall back to master part's views, matching original Lingo behavior.
      let useView = partData.UseView
      let useView2 = partData.UseView2
      let useViewInside = partData.UseViewInside
      let useViewInside2 = partData.UseViewInside2
      if (partData.Master && (!useView || !useView2)) {
        const masterData = this.getBoatPart(partData.Master)
        if (masterData) {
          if (!useView) useView = masterData.UseView || ''
          if (!useView2) useView2 = masterData.UseView2 || ''
          if (!useViewInside) useViewInside = masterData.UseViewInside || ''
          if (!useViewInside2) useViewInside2 = masterData.UseViewInside2 || ''
          console.debug('[BuildBoat] Part', partId, 'inherits views from master', partData.Master, 
            'UseView:', useView, 'UseView2:', useView2)
        }
      }

      // Create foreground sprite (UseView)
      if (useView) {
        let sprite_fg = new MulleSprite(this.game, 0, 0)
        
        // Boat parts use boten_CDDATA.CXT
        const loaded = sprite_fg.setDirectorMember('boten_CDDATA.CXT', useView)
        
        if (!loaded) {
          // Fallback: try loading by frame name
          sprite_fg.setFrameId(useView)
        }

        sprite_fg.partId = partId
        sprite_fg.layer = partData.Requires && partData.Requires !== 0 
          ? (Array.isArray(partData.Requires) ? partData.Requires[0] : partData.Requires)
          : 'base'

        // Layer handling with global offsets (#12, #16-20)
        if (isHull) {
          // Hull front layer (#16)
          sprite_fg.sortIndex = this.game.mulle.globals?.HullFrontOffset || 10
        } else if (isRudder && partData.UseView2) {
          // Rudder front layer (#20)
          sprite_fg.sortIndex = this.game.mulle.globals?.rudderFrontOffset || 6
        } else {
          sprite_fg.sortIndex = this.points[sprite_fg.layer] ? this.points[sprite_fg.layer].fg : 8
        }

        // Apply offset (#2 - getDrawOffset integration)
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

          sprite_fg.events.onInputDown.add((sprite, pointer) => {
            this.game.mulle.cursor.current = null
            console.debug('[BuildBoat] Detach part by drag', partId)
            this.detach(partId)
          }, this)
        }
        
        this.add(sprite_fg)
        this.partSprites[partId]['fg'] = sprite_fg
      }

      // Create background sprite (UseView2)
      if (useView2) {
        let sprite_bg = new MulleSprite(this.game, 0, 0)
        sprite_bg.setDirectorMember('boten_CDDATA.CXT', useView2)
        
        sprite_bg.partId = partId
        sprite_bg.layer = partData.Requires && partData.Requires !== 0
          ? (Array.isArray(partData.Requires) ? partData.Requires[0] : partData.Requires)
          : 'base'
        
        // Layer handling with global offsets (#17, #20)
        if (isHull) {
          // Hull back layer (#17)
          sprite_bg.sortIndex = this.game.mulle.globals?.HullBackOffset || 5
        } else if (isRudder) {
          // Rudder back layer (#20)
          sprite_bg.sortIndex = this.game.mulle.globals?.rudderBackOffset || 4
        } else {
          sprite_bg.sortIndex = this.points[sprite_bg.layer] ? this.points[sprite_bg.layer].bg : 7
        }
        sprite_bg.is_bg = true

        if (partData.Offset && partData.Offset.length >= 2) {
          sprite_bg.position.add(partData.Offset[0], partData.Offset[1])
        }

        this.add(sprite_bg)
        this.partSprites[partId]['bg'] = sprite_bg
      }
      
      // Create hull inside views (#14-#15, #18-#19)
      if (isHull && (useViewInside || useViewInside2)) {
        if (useViewInside) {
          let sprite_inside_fg = new MulleSprite(this.game, 0, 0)
          const insideLoaded = sprite_inside_fg.setDirectorMember('boten_CDDATA.CXT', useViewInside)
          sprite_inside_fg.partId = partId
          sprite_inside_fg.sortIndex = this.game.mulle.globals?.hullFrontInsideOffset || 11
          sprite_inside_fg.visible = false // Hidden by default (#14)
          
          if (partData.Offset && partData.Offset.length >= 2) {
            sprite_inside_fg.position.add(partData.Offset[0], partData.Offset[1])
          }
          
          this.add(sprite_inside_fg)
          this.partSprites[partId]['inside_fg'] = sprite_inside_fg
        }
        
        if (useViewInside2) {
          let sprite_inside_bg = new MulleSprite(this.game, 0, 0)
          sprite_inside_bg.setDirectorMember('boten_CDDATA.CXT', useViewInside2)
          sprite_inside_bg.partId = partId
          sprite_inside_bg.sortIndex = this.game.mulle.globals?.hullBackInsideOffset || 3
          sprite_inside_bg.visible = false // Hidden by default (#15)
          sprite_inside_bg.is_bg = true
          
          if (partData.Offset && partData.Offset.length >= 2) {
            sprite_inside_bg.position.add(partData.Offset[0], partData.Offset[1])
          }
          
          this.add(sprite_inside_bg)
          this.partSprites[partId]['inside_bg'] = sprite_inside_bg
        }
      }
    }

    // Hull click overlay (#21-#23): transparent always-visible sprite for hull click
    // We create this AFTER all hull sprites, so we can size it to match sprite_fg.
    // Phaser CE ignores input on invisible sprites, so we use a persistent overlay
    // instead of attaching the click handler to sprite_fg (which gets hidden).
    const hullSprites = hullId && this.partSprites[hullId]
    if (hullSprites && hullSprites.fg && !this.locked) {
      const fgSprite = hullSprites.fg
      const hitArea = this.game.add.graphics(0, 0)
      // Draw a transparent rectangle matching the hull fg sprite bounds
      hitArea.beginFill(0x000000, 0) // fully transparent
      hitArea.drawRect(
        fgSprite.x - (fgSprite.pivot ? fgSprite.pivot.x : 0),
        fgSprite.y - (fgSprite.pivot ? fgSprite.pivot.y : 0),
        fgSprite.width || 200,
        fgSprite.height || 200
      )
      hitArea.endFill()
      hitArea.inputEnabled = true
      hitArea.sortIndex = 20 // above everything
      hitArea.events.onInputDown.add(this.onHullClick, this)
      this.add(hitArea)
      this.partSprites[hullId]['clickOverlay'] = hitArea
      console.debug('[BuildBoat] Hull click overlay created, size:', fgSprite.width, 'x', fgSprite.height)
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
    
    // Update boat properties (#34)
    this.updateProperties()
    
    this.onRefresh.dispatch()

    console.debug('[BuildBoat] Attachment points', this.points)
  }

  /**
   * Get boat part data from BoatPartsDB
   * @param {number} partId 
   * @returns {object|null}
   */
  getBoatPart (partId) {
    const db = this.game.mulle.BoatPartsDB
    if (!db) {
      console.warn('[BuildBoat] BoatPartsDB not initialized')
      return null
    }
    
    // Use getPart() method (handles string/number key conversion)
    const part = db.getPart ? db.getPart(partId) : (db.parts ? db.parts[String(partId)] : db[String(partId)])
    if (part) return part
    
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
    
    const partData = this.getBoatPart(partId)
    if (!partData) return false
    
    // Load capacity validation (RecalcBoatProps.ls line 15)
    // Original: loadPercent = 100 * (totalWeight - hullWeight) / loadCapacity
    // The hull's own weight does NOT count towards the load - it's the base displacement.
    // Only non-hull parts' weight counts as "cargo".
    const boat = this.game.mulle.user?.Boat
    const hullId = this.getHull()
    const hullData = this.getBoatPart(hullId)
    const hullWeight = hullData && hullData.Properties ? (hullData.Properties.weight || 0) : 0
    const totalWeight = boat ? boat.getProperty('weight', 0) : hullWeight
    const loadCapacity = boat ? boat.getProperty('loadcapacity', 0) : 0
    const partWeight = partData.Properties?.weight || 0
    
    // Cargo weight = total weight minus hull weight, plus the new part
    const cargoWeight = (totalWeight - hullWeight) + partWeight
    const loadPercent = loadCapacity > 0 ? (100 * cargoWeight / loadCapacity) : 0
    
    console.debug('[BuildBoat] Attach check: cargo=', cargoWeight, 'capacity=', loadCapacity, 'loadPct=', loadPercent)
    
    // Sink if load exceeds 100% capacity
    if (loadCapacity > 0 && loadPercent > 100) {
      console.warn('[BuildBoat] Overload - load at', Math.round(loadPercent), '%')
      
      // Return part to Quay junk pile
      const masterPartId = partData.Master || partId
      if (this.game.mulle.user.BoatJunk) {
        if (!this.game.mulle.user.BoatJunk.Quay) this.game.mulle.user.BoatJunk.Quay = {}
        this.game.mulle.user.BoatJunk.Quay[masterPartId] = new Phaser.Point(300, 300)
      }
      
      // Play overload warning
      if (this.game.mulle.actors.mulle) {
        this.game.mulle.actors.mulle.talk('04d048v0')
      }
      
      return false
    }
    
    // Warning at 80% load
    if (loadPercent > 80) {
      console.debug('[BuildBoat] Load capacity warning at', Math.round(loadPercent), '%')
      if (this.game.mulle.actors.mulle) {
        this.game.mulle.actors.mulle.talk('04d048v0')
      }
    }

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
    
    // Get master part for drag operation (#4)
    var newId = partData && partData.Master ? partData.Master : partId

    var newPos = this.partSprites[partId] && this.partSprites[partId].fg 
      ? this.partSprites[partId].fg.worldPosition.clone()
      : new Phaser.Point(0, 0)

    // Sound effect on boat pickup (#5)
    if (partData && partData.SndAttachOnBoat) {
      this.game.mulle.playAudio(partData.SndAttachOnBoat)
    }

    // Proper rebuild sequence (#3): clearBoat -> deletePart -> rebuild
    this.clearBoat()
    this.parts.splice(partIndex, 1)

    this.onDetach.dispatch(partId, newId, newPos)

    // rebuild is done by refresh()
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
        
        // Place part in Quay junk pile
        if (this.game.mulle.user.BoatJunk) {
          if (!this.game.mulle.user.BoatJunk.Quay) this.game.mulle.user.BoatJunk.Quay = {}
          this.game.mulle.user.BoatJunk.Quay[partId] = new Phaser.Point(
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
   * Uses fromList() to rebuild snap points on MulleBoat,
   * keeping MulleBoat.boatSnapPoints in sync with the visual boat.
   * @return {void}
   */
  save () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return
    
    if (boat.fromList) {
      boat.fromList({ Parts: this.parts, Name: boat.Name, Medals: boat.Medals, fuelFull: boat.fuelFull, CacheList: boat.CacheList })
    } else {
      boat.Parts = this.parts
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
  
  /**
   * Clear boat display (part of rebuild sequence #3)
   * @returns {void}
   */
  clearBoat () {
    // Hide water sprite (#1)
    if (this.waterSprite) {
      this.waterSprite.visible = false
    }
    
    // Reset hull inside view
    this.hullInsideVisible = false
  }
  
  /**
   * Get draw offset from boatViewHandler (#2)
   * @param {string} context - Context (e.g., 'Quay')
   * @returns {Phaser.Point}
   */
  getDrawOffset (context = 'Quay') {
    if (this.boatViewHandler && this.boatViewHandler.getDrawOffset) {
      return this.boatViewHandler.getDrawOffset(context)
    }
    return new Phaser.Point(0, 0)
  }
  
  /**
   * Update boat properties (#34)
   * Calls updateStats on the user's boat object
   * @returns {void}
   */
  updateProperties () {
    if (this.game.mulle.user?.Boat) {
      this.game.mulle.user.Boat.updateStats()
    }
  }
  
  /**
   * Get current load capacity (#37)
   * @returns {number}
   */
  getCurrentLoadCapacity () {
    const boat = this.game.mulle.user?.Boat
    if (!boat) return 100 // Default: allow attachments if no boat data
    
    const loadCapacity = boat.getProperty('loadcapacity', 0)
    if (loadCapacity <= 0) return 100 // No capacity limit defined
    
    // Hull weight doesn't count as cargo (RecalcBoatProps.ls line 15)
    const totalWeight = boat.getProperty('weight', 0)
    const hullId = this.getHull()
    const hullData = this.getBoatPart(hullId)
    const hullWeight = hullData && hullData.Properties ? (hullData.Properties.weight || 0) : 0
    const cargoWeight = totalWeight - hullWeight
    
    return loadCapacity - cargoWeight
  }
  
  /**
   * Get hull part ID (#38)
   * @returns {number|null}
   */
  getHull () {
    // Hull is typically the first part (base)
    // In boat building, hull parts have ship size properties
    for (const partId of this.parts) {
      const partData = this.getBoatPart(partId)
      if (partData && partData.Properties) {
        if (partData.Properties.largeship || 
            partData.Properties.mediumship || 
            partData.Properties.smallship) {
          return partId
        }
      }
    }
    // Fallback: first part
    return this.parts.length > 0 ? this.parts[0] : null
  }
  
  /**
   * Get rudder part ID (#39)
   * @returns {number|null}
   */
  getRudder () {
    for (const partId of this.parts) {
      const partData = this.getBoatPart(partId)
      if (partData && partData.Properties && partData.Properties.rudder) {
        return partId
      }
    }
    return null
  }
  
  /**
   * Check if snap points are free (#13)
   * @param {Array} pointIds - Array of point IDs to check
   * @returns {boolean}
   */
  areTheseFree (pointIds) {
    if (!Array.isArray(pointIds)) return true
    
    for (const pointId of pointIds) {
      if (this.usedPoints[pointId] || this.coveredPoints[pointId]) {
        return false
      }
    }
    
    return true
  }
  
  /**
   * Handle hull click (#21-#23)
   * Shows inside view and hides water sprite
   * @returns {void}
   */
   onHullClick () {
    const hullId = this.getHull()
    if (!hullId || !this.partSprites[hullId]) {
      console.debug('[BuildBoat] Hull click: no hull found or no sprites')
      return
    }
    
    const sprites = this.partSprites[hullId]
    
    // Only allow inside view toggle if the hull actually has inside view sprites
    if (!sprites.inside_fg && !sprites.inside_bg) {
      console.debug('[BuildBoat] Hull click: no inside views available, ignoring')
      return
    }
    
    // Only show inside view if there are attached parts to see inside
    // (hull alone = 1 part, need at least 2 for inside view to be useful)
    const attachedCount = Object.keys(this.partSprites).length
    if (attachedCount <= 1 && !this.hullInsideVisible) {
      console.debug('[BuildBoat] Hull click: no attached parts, skipping inside view')
      return
    }
    
    this.hullInsideVisible = !this.hullInsideVisible
    console.debug('[BuildBoat] Hull click: hullId=', hullId, 'insideVisible=', this.hullInsideVisible)
    
    // Original Lingo: clicking hull toggles between outside and inside view
    // Outside view: fg (hull front) visible, bg visible
    // Inside view: fg hidden, inside_fg + inside_bg visible
    // bg (hull back) stays visible in both modes
    
    // Toggle hull front visibility
    if (sprites.fg) {
      sprites.fg.visible = !this.hullInsideVisible
    }
    
    // Hull back stays visible in both views (you see the back of the hull
    // whether looking at outside or inside)
    
    // Toggle inside views
    if (sprites.inside_fg) {
      sprites.inside_fg.visible = this.hullInsideVisible
    }
    if (sprites.inside_bg) {
      sprites.inside_bg.visible = this.hullInsideVisible
    }
    
    // Hide water sprite when showing inside (so you can see hull interior below waterline)
    if (this.waterSprite) {
      this.waterSprite.visible = !this.hullInsideVisible
    }
  }
  
  /**
   * Set water sprite reference (#1, #23)
   * @param {Phaser.Sprite} sprite
   */
  setWaterSprite (sprite) {
    this.waterSprite = sprite
  }
  
  /**
   * Set foreground overlay reference (dock/quay ground)
   * Used by hull click to toggle overlay visibility for inside view
   * @param {Phaser.Sprite} sprite
   */
  setForegroundOverlay (sprite) {
    this.foregroundOverlay = sprite
  }
  
  /**
   * Toggle water sprite visibility (#1)
   * @param {boolean} visible
   */
  setWaterVisible (visible) {
    if (this.waterSprite) {
      this.waterSprite.visible = visible
    }
  }
  
  /**
   * BUG FIX #4: Get snap point info (line 24, 43, 70, 136, 189 in DragScript.ls & BoatPart.ls)
   * Returns snap point information for positioning calculations
   * @param {number} snapPointId - The snap point ID
   * @param {string} field - Optional field to return ('offset', 'layers', or null for all)
   * @returns {object|null} - Snap point info with offset and layers
   */
  getSnapInfo (snapPointId, field = null) {
    const snapPoint = this.points[snapPointId]
    if (!snapPoint) return null
    
    const info = {
      offset: snapPoint.offset || { x: 0, y: 0 },
      layers: [snapPoint.fg || 0, snapPoint.bg || 0]
    }
    
    if (field === 'offset') return info.offset
    if (field === 'layers') return info.layers
    
    return info
  }
}

export default MulleBuildBoat
