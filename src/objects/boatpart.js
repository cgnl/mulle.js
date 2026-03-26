/**
 * MulleBoatPart object
 * @module objects/boatpart
 * 
 * Equivalent of MulleCarPart but for boats
 * Handles dragging boat parts and attaching them to boats
 * 
 * IMPLEMENTED FEATURES FROM missing.md (Items #26-51):
 * #24 - noSnapDialogList random dialogues when no snap available
 * #25 - Debug text display (console logging)
 * #26 - Shelf vs Quay context handling (dragWhere)
 * #27 - Morph snap area with rect intersection
 * #28 - insideList for overlapping zones tracking
 * #29 - Snap preview sprite management (useViewSP, useView2SP)
 * #30 - Sound on snap enter (part-specific via getSndAttachOnBoat)
 * #31 - Master reversion on leave snap area
 * #32 - Click-to-describe exact match (startPos equality)
 * #33 - Loop master registration (handled by Phaser drag system)
 * #41 - getUseViewInside() property getter
 * #42 - getUseViewInside2() property getter
 * #43 - getSndAttachOnBoat() property getter
 * #44 - getNewPoints() property getter
 * #45 - getRequiredPoints() property getter
 * #46 - getMorphToSnap() for snap point targeting
 * #47 - isMaster() part type check
 * #48 - isNormalpart() part type check
 * #49 - isMorphPart() part type check
 * #50 - BASE_DRAW_POINT constant (315, 210)
 * #51 - SPRITE_OFFSETS constants for channel management
 */
'use strict'

import MulleSprite from 'objects/sprite'

/**
 * Boat part sprite for drag & drop building
 * @extends MulleSprite
 */
class MulleBoatPart extends MulleSprite {
  /**
   * Create boat part
   * @param  {Phaser.Game} game      Main game
   * @param  {number}      part_id   Boat part ID
   * @param  {number}      x         x position
   * @param  {number}      y         y position
   * @param  {boolean}     noPhysics Disable physics
   * @return {void}
   */
  constructor (game, part_id, x, y, noPhysics = false) {
    super(game, x, y)

    this.part_id = part_id

    this.boat = null

    this.canAttach = false
    this.activeMorph = null
    this.activeView = null
    this.noAttach = false
    this.snapSound = false

    // BUG FIX #10: Snap distance too large - reduce from 50px to 20px
    // Original uses rect-only snap detection, not fallback distance
    this.snapDistance = 40

    this.justDetached = false

    this.groundSound = false

    this.noPhysics = noPhysics

    this.dropTargets = []

    this.dragTicks = 0
    
    // #26: noSnapDialogList - random dialogues when no snap available
    this.noSnapDialogList = ['04d009v0', '04d024v0', '04d025v0', '04d026v0']
    
    // #28: insideList for overlapping snap zones
    this.insideList = []
    
    // #29: Snap preview sprite management (separate sprite channels)
    this.useViewSP = null
    this.useView2SP = null
    
    // #27: Context tracking (Shelf vs Quay)
    this.dragWhere = null
    this.startPos = null

    this.partData = this.game.mulle.getBoatPart(this.part_id)
    
    if (!this.partData) {
      console.error('[BoatPart] Invalid part', this.part_id, '- no data in BoatPartsDB')
      // Set safe defaults so sprite doesn't crash
      this.default = { junkView: null, UseView: null, UseView2: null, offset: new Phaser.Point(0, 0) }
      this.morphs = null
      this.sound_floor = '00e001v0'
      this.sound_attach = '00e006v0'
      this.sound_attach_boat = '00e006v0'
      this.sound_description = null
      return
    }

    // Boat sound effects (different from cars)
    this.sound_floor = '00e001v0'
    this.sound_attach = '00e006v0' // Boat attach sound
    
    // Part description audio (plays on double-click or long press)
    this.sound_description = this.partData.SndDescription || null
    
    // #30: Part-specific attach sound (getSndAttachOnBoat)
    this.sound_attach_boat = this.getSndAttachOnBoat() || '00e006v0'

    var weight = this.getProperty('weight')

    if (weight) {
      if (weight >= 4) {
        this.sound_attach = '00e006v0'
        this.sound_floor = '00e003v0'
      } else if (weight >= 2) {
        this.sound_attach = '00e006v0'
        this.sound_floor = '00e002v0'
      }
    }

    // Load default views from boten/CDDATA.CXT
    // Fall back through JunkView → ShelfView → UseView so parts always have a visible sprite
    this.default = {
      junkView: this.getBoatImage(this.partData.JunkView || this.partData.ShelfView || this.partData.UseView),
      UseView: this.getBoatImage(this.partData.UseView),
      UseView2: this.getBoatImage(this.partData.UseView2),
      offset: this.partData.Offset ? new Phaser.Point(this.partData.Offset[0], this.partData.Offset[1]) : new Phaser.Point(0, 0)
    }

    console.debug('[BoatPart] Created part', this.part_id, this.default)

    this.morphs = null

    if (this.partData.MorphsTo && this.partData.MorphsTo.length > 0) {
      this.morphs = []

      for (let i = 0; i < this.partData.MorphsTo.length; i++) {
        let partId = this.partData.MorphsTo[i]
        let partData = this.game.mulle.getBoatPart(partId)

        if (!partData) continue

        this.morphs.push({
          partId: partId,
          partData: partData,

          junkView: this.getBoatImage(partData.JunkView || partData.ShelfView),
          UseView: this.getBoatImage(partData.UseView),
          UseView2: this.getBoatImage(partData.UseView2),

          offset: partData.Offset ? new Phaser.Point(partData.Offset[0], partData.Offset[1]) : new Phaser.Point(0, 0)
        })
      }
    }

    this.setImage('junkView')

    this.inputEnabled = true

    this.input.enableDrag(false)

    this.cursor = 'Grab'

    this.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Grab'
    })

    this.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })

    // Dragging events
    this.events.onDragStart.add(this.onGrab.bind(this))
    this.events.onDragStop.add(this.onDrop.bind(this))
    this.events.onDragUpdate.add(this.onMove.bind(this))

    // Double-click to play part description audio
    this.lastClickTime = 0
    this.events.onInputDown.add(this.onInputDown.bind(this))
    
    // Long press detection for part info (hold for 500ms without dragging)
    this.holdTimer = null
    this.isHolding = false

    if (!this.noPhysics) {
      this.game.physics.enable(this, Phaser.Physics.ARCADE)
      this.body.collideWorldBounds = true

      this.body.onWorldBounds = new Phaser.Signal()
      this.body.onWorldBounds.add(this.onHitGround, this)
    }
  }

  /**
   * Get boat image from boten/CDDATA.CXT
   * @param {string} frameName 
   * @returns {object|null}
   */
  getBoatImage (frameName) {
    if (!frameName) return null
    return this.game.mulle.getDirectorImage('boten_CDDATA.CXT', frameName)
  }

  /**
   * Resolve the best available director member for a requested boat-part view.
   * Some original parts only ship a `UseView`, so junk rendering must fall back
   * through the same chain we use during construction.
   * @param {Object} partData
   * @param {string} name
   * @returns {string}
   */
  resolveViewFrameName (partData, name) {
    if (!partData) return ''

    if (name === 'junkView') {
      return partData.JunkView || partData.junkView ||
        partData.ShelfView || partData.shelfView ||
        partData.UseView || partData.useView || ''
    }

    if (name === 'UseView') {
      return partData.UseView || partData.useView || ''
    }

    if (name === 'UseView2') {
      return partData.UseView2 || partData.useView2 || ''
    }

    const normalized = name.charAt(0).toUpperCase() + name.slice(1)
    return partData[name] || partData[normalized] || ''
  }

  /**
   * Set active image
   * @param {string} name junkView/UseView/UseView2
   */
  setImage (name) {
    var src = this.activeMorph != null && this.morphs ? this.morphs[this.activeMorph] : this.default
    const viewPartData = this.activeMorph != null && this.morphs
      ? this.morphs[this.activeMorph].partData
      : this.partData

    if (!src || !src[name]) {
      // Retry lookup - atlas may not have been loaded during construction
      if (src && viewPartData) {
        const retried = this.getBoatImage(this.resolveViewFrameName(viewPartData, name))
        if (retried) {
          src[name] = retried
          console.debug('[BoatPart] Retried image lookup succeeded:', name, this.part_id)
        }
      }
      if (!src || !src[name]) {
        console.warn('[BoatPart] Missing image', name, 'for part', this.part_id)
        return
      }
    }

    if (this.key === src[name].key && this.animations.frameName === src[name].name) return

    if (this.key === src[name].key) {
      this.frameName = src[name].name
    } else {
      this.loadTexture(src[name].key, src[name].name)
    }

    this.activeView = name

    console.debug('[BoatPart] Set image', this.activeMorph, name, src[name].key, src[name].name)
  }

  onMove (game, pointer, x, y, point, fromStart) {
    // Check drop targets
    if (this.dropTargets) {
      for (var t of this.dropTargets) {
        if (!t[0].hitArea) continue

        if (t[0].hitArea.contains(pointer.x - t[0].position.x, pointer.y - t[0].position.y)) {
          if (!t[0].isHovering) {
            t[0].cursor = t[0].cursorDrag
            t[0].events.onInputOver.dispatch()
            t[0].isHovering = true
          }
          break
        } else {
          if (t[0].isHovering) {
            t[0].cursor = t[0].cursorHover
            t[0].events.onInputOut.dispatch()
            t[0].isHovering = null
          }
        }
      }
    }

    if (!this.boat) return

    if (!this.justDetached && this.noAttach) {
      this.activeMorph = null
      this.canAttach = false

      if (this.activeView !== 'junkView') this.setImage('junkView')

      this.dragTicks++
      if (this.dragTicks === 60) {
        // #24: Random dialogue from noSnapDialogList when dragging incompatible part
        if (this.game.mulle.actors.mulle) {
          const randomDialogue = this.game.rnd.pick(this.noSnapDialogList)
          this.game.mulle.actors.mulle.talk(randomDialogue)
        }
      }

      return
    }

    // Try to snap to a valid snap point
    const snapResult = this.findSnapPoint(x, y)
    
    if (snapResult) {
      this.position.set(snapResult.x, snapResult.y)
      this.canAttach = true
      this.activeMorph = snapResult.morphIndex
      this.activeSnapPoint = snapResult.snapPoint
      
      // #28: Track overlapping zones in insideList
      const snapKey = `Boat${snapResult.snapPoint}`
      const wasInside = this.insideList.indexOf(snapKey) !== -1
      if (!wasInside) {
        this.insideList.push(snapKey)
      }
      
      // BUG FIX #2: Ghost preview sprite system (line 126-157 in DragScript.ls)
      // When entering snap zone: hide drag sprite, show preview sprite at snap position
      if (!wasInside) {
        this.createPreviewSprites(snapResult)
      }
      
      this.setImage('UseView')

      if (!this.snapSound) {
        // #30: Use part-specific attach sound instead of generic
        const attachSound = this.sound_attach_boat || this.sound_attach
        this.game.mulle.playAudio(attachSound)
        this.snapSound = true
      }
    } else {
      if (this.snapSound) {
        this.game.mulle.playAudio(this.sound_attach)
        this.snapSound = false
      }
      
      // BUG FIX #2: Destroy preview sprites when leaving snap area (line 159-177 in DragScript.ls)
      this.destroyPreviewSprites()
      
      // #28 & #31: Clear insideList when leaving snap area
      // #31: Revert to master when leaving snap
      if (this.insideList.length > 0) {
        this.insideList = []
        
        // If this part is a variant, revert to its master ID when leaving snap
        if (this.isVariant()) {
          const masterId = this.getMaster()
          if (masterId && masterId !== this.part_id) {
            this.part_id = masterId
            this.partData = this.game.mulle.getBoatPart(this.part_id)
          }
        }
      }

      this.canAttach = false
      this.activeMorph = null
      this.activeSnapPoint = null
      this.setImage('junkView')
    }
  }

  /**
   * Find the closest valid snap point for the current drag position
   * #27: Uses rect intersection with regPoint offset for morph parts
   * Fix #52: Uses boat world position (boatPos) instead of BASE_DRAW_POINT + drawOffset
   * BUG FIX #4: Use getSnapInfo for snap point data
   * BUG FIX #5: Validate with areTheseFree before returning snap
   * BUG FIX #6: Add regPoint offset compensation
   * @param {number} dragX - Current drag X position
   * @param {number} dragY - Current drag Y position
   * @returns {object|null} - { x, y, snapPoint, morphIndex } or null
   */
  findSnapPoint (dragX, dragY) {
    var offJnk = this.default.junkView && this.default.junkView.frame 
      ? this.default.junkView.frame.regpoint 
      : { x: 0, y: 0 }

    // Use the boat's actual world position as the base for snap calculations.
    // The boat group position already includes the draw offset from BoatViewHandler.
    // All snap point offsets are relative to this position.
    const boatPos = { x: this.boat.x, y: this.boat.y }
    console.debug('[BoatPart] findSnapPoint drag=(%d,%d) boatPos=(%d,%d) partId=%s', 
      dragX, dragY, boatPos.x, boatPos.y, this.partId)

    // BUG FIX #7: Check morphs first ONLY if this is a morph part (isMorphPart check)
    if (this.isMorphPart() && this.morphs && this.morphs.length > 0) {
      for (var i = 0; i < this.morphs.length; i++) {
        var morph = this.morphs[i]
        var morphData = morph.partData

        if (!this.checkCanAttach(i)) continue

        // Get required snap points for this morph
        var requires = morphData.Requires
        if (!requires || requires === 0) continue
        const reqList = Array.isArray(requires) ? requires : [requires]

        // BUG FIX #5: Check if all required points are free using areTheseFree
        if (this.boat.areTheseFree && !this.boat.areTheseFree(reqList)) continue

        // Check each required snap point
        for (var snapId of reqList) {
          var snapPoint = this.boat.points[snapId]
          if (!snapPoint) continue
          if (this.boat.usedPoints[snapId]) continue

          // BUG FIX #4: Use getSnapInfo to get snap offset and layers (line 43, 136 in DragScript.ls)
          const snapInfo = this.boat.getSnapInfo ? this.boat.getSnapInfo(snapId) : null
          const snapOffset = snapInfo?.offset || (snapPoint.offset ? snapPoint.offset : { x: 0, y: 0 })

          // Fix #52: Use boat's actual world position (already includes draw offset)
          // instead of BASE_DRAW_POINT + drawOffset which was in Director coordinate space
          var dst_x = boatPos.x + morph.offset.x + snapOffset.x
          var dst_y = boatPos.y + morph.offset.y + snapOffset.y

          // BUG FIX #6: Add registration point offset compensation (line 46, 72, 139 in DragScript.ls)
          var offUse = morph.UseView && morph.UseView.frame 
            ? morph.UseView.frame.regpoint 
            : { x: 0, y: 0 }

          // #27: Morph snap area calculation with rect intersection
          // Create rect for UseView at target location (line 47 in DragScript.ls)
          const useViewFrame = morph.UseView?.frame
          if (useViewFrame) {
            // BUG FIX #6: Subtract regPoint for correct rect positioning
            const targetRect = new Phaser.Rectangle(
              dst_x - offUse.x,
              dst_y - offUse.y,
              useViewFrame.width,
              useViewFrame.height
            )
            
            // Create rect for current drag position
            const dragRect = new Phaser.Rectangle(
              dragX - offJnk.x,
              dragY - offJnk.y,
              this.width,
              this.height
            )
            
            // Check if rects intersect
            if (Phaser.Rectangle.intersects(targetRect, dragRect)) {
              console.log('[BoatPart] SNAP (rect) morph=%d snapId=%s dst=(%d,%d)', i, snapId, dst_x, dst_y)
              return { x: dst_x, y: dst_y, snapPoint: snapId, morphIndex: i }
            }
          }

          // Fallback to distance-based check with regPoint compensation
          var chk_x = dragX - offJnk.x + offUse.x
          var chk_y = dragY - offJnk.y + offUse.y

          var distance = this.game.math.distance(chk_x, chk_y, dst_x, dst_y)

          if (distance < this.snapDistance) {
            console.log('[BoatPart] SNAP (dist) morph=%d snapId=%s dst=(%d,%d) dist=%.1f', i, snapId, dst_x, dst_y, distance)
            return { x: dst_x, y: dst_y, snapPoint: snapId, morphIndex: i }
          }
        }
      }
    }

    // Check non-morph part
    var partRequires = this.partData.Requires
    if (!partRequires || partRequires === 0) {
      // Part has no Requires - cannot attach to snap points
      return null
    }

    const partReqList = Array.isArray(partRequires) ? partRequires : [partRequires]
    
    // BUG FIX #5: Check if all required points are free using areTheseFree
    if (this.boat.areTheseFree && !this.boat.areTheseFree(partReqList)) return null

    if (!this.checkCanAttach()) return null

    var offUse = this.default.UseView && this.default.UseView.frame 
      ? this.default.UseView.frame.regpoint 
      : { x: 0, y: 0 }

    // Check each required snap point
    for (var snapId of partReqList) {
      var snapPoint = this.boat.points[snapId]
      if (!snapPoint) continue
      if (this.boat.usedPoints[snapId]) continue

      // BUG FIX #4: Use getSnapInfo to get snap offset and layers
      const snapInfo = this.boat.getSnapInfo ? this.boat.getSnapInfo(snapId) : null
      const snapOffset = snapInfo?.offset || (snapPoint.offset ? snapPoint.offset : { x: 0, y: 0 })

      // Fix #52: Use boat's actual world position (already includes draw offset)
      var dst_x = boatPos.x + this.default.offset.x + snapOffset.x
      var dst_y = boatPos.y + this.default.offset.y + snapOffset.y

      // Calculate where the part center is while dragging
      var chk_x = dragX - offJnk.x + offUse.x
      var chk_y = dragY - offJnk.y + offUse.y

      var distance = this.game.math.distance(chk_x, chk_y, dst_x, dst_y)

      if (distance < this.snapDistance) {
        console.log('[BoatPart] SNAP (dist) direct snapId=%s dst=(%d,%d) dist=%.1f', snapId, dst_x, dst_y, distance)
        return { x: dst_x, y: dst_y, snapPoint: snapId, morphIndex: null }
      }
    }

    return null
  }

  /**
   * Check if part can be attached
   * @param  {number} morph Morph ID
   * @return {boolean}
   */
  checkCanAttach (morph = null) {
    if (morph != null && this.morphs) {
      var morphData = this.morphs[morph].partData
      if (morphData.Requires && morphData.Requires !== 0) {
        var requires = Array.isArray(morphData.Requires) ? morphData.Requires : [morphData.Requires]
        for (var r of requires) {
          if (this.boat.usedPoints[r]) {
            return false
          }
        }
      }

      if (morphData.Covers && morphData.Covers !== 0) {
        var covers = Array.isArray(morphData.Covers) ? morphData.Covers : [morphData.Covers]
        for (var c of covers) {
          if (this.boat.coveredPoints[c]) {
            return false
          }
        }
      }
    }

    if (this.partData.Requires && this.partData.Requires !== 0) {
      var requires = Array.isArray(this.partData.Requires) ? this.partData.Requires : [this.partData.Requires]
      
      var hasPoint = false
      for (var r of requires) {
        if (this.boat.points[r]) {
          hasPoint = true
          break
        }
      }
      if (!hasPoint) return false

      for (var r of requires) {
        if (this.boat.usedPoints[r]) {
          return false
        }
      }

      if (this.partData.Covers && this.partData.Covers !== 0) {
        var covers = Array.isArray(this.partData.Covers) ? this.partData.Covers : [this.partData.Covers]
        for (var c of covers) {
          if (this.boat.coveredPoints[c]) {
            return false
          }
        }
      }
    }

    return true
  }

  onGrab () {
    this.dragTicks = 0

    this.bringToTop()

    this.groundSound = false
    
    // #32: Store start position for click-to-describe exact match
    this.startPos = { x: this.x, y: this.y }
    
    // Cancel hold timer when dragging starts
    this.isHolding = false
    if (this.holdTimer) {
      this.game.time.events.remove(this.holdTimer)
      this.holdTimer = null
    }

    if (!this.noPhysics) {
      this.body.moves = false
    }

    if (!this.boat) return
    
    // #26: Set dragWhere context (Shelf vs Quay)
    this.dragWhere = '#Quay' // Context where dragging happens
    
    // #25: Debug text display (if debug member exists)
    if (this.game.mulle.debug) {
      const weight = this.getProperty('weight')
      const loadCapacity = this.boat.getCurrentLoadCapacity ? this.boat.getCurrentLoadCapacity() : 'N/A'
      console.debug(`[BoatPart] ID:${this.part_id}, Weight:${weight}, LoadCapacity:${loadCapacity}`)
    }

    if (this.morphs && this.morphs.length > 0) {
      var ok = this.morphs.length
      this.morphs.forEach((m, i) => {
        if (!this.checkCanAttach(i)) ok--
      })

      this.noAttach = ok <= 0
      
      // #24: Random dialogue when no snap points available
      if (this.noAttach && this.game.mulle.actors.mulle) {
        // Will play after dragTicks threshold in onMove
      }
    } else {
      this.noAttach = !this.checkCanAttach()
      
      // #24: Random dialogue when no snap points available  
      if (this.noAttach && this.game.mulle.actors.mulle) {
        // Will play after dragTicks threshold in onMove
      }
    }
  }

  onDrop (obj, pointer) {
    // BUG FIX #2: Clean up preview sprites on drop
    this.destroyPreviewSprites()
    
    if (!this.justDetached) {
      // #32: Click-to-describe exact match - check if position equals startPos
      let didNotMove = false
      if (this.startPos) {
        didNotMove = (this.x === this.startPos.x && this.y === this.startPos.y)
      }
      
      // Fallback to distance check
      var dist = Phaser.Point.distance(this.position, this.input.dragStartPoint)

      if (didNotMove || dist < 5) {
        this.playDescription()
      }
    }

    this.snapSound = false

    if (!this.noPhysics) {
      this.body.moves = true
      this.body.velocity.set(0)
    } else {
      this.game.mulle.playAudio(this.sound_floor)
    }

    this.justDetached = false
    
    // Clear insideList on drop
    this.insideList = []

    if (!this.noAttach && this.canAttach) {
      var partId = this.part_id

      // #11: Morph-to-snap transformation
      // Original Lingo: getMorphToSnap(tmpPartObj, symbol(char 5 to 6 of string(tmpToWhere)))
      if (this.activeMorph !== null && this.morphs) {
        partId = this.morphs[this.activeMorph].partId
      } else if (this.activeSnapPoint) {
        // Check if we need to morph based on snap point
        const morphedPartId = this.getMorphToSnap(this.activeSnapPoint)
        if (morphedPartId && morphedPartId !== '#error' && morphedPartId !== null) {
          partId = morphedPartId
        }
      }

      console.log('[BoatPart] Attach part by drag', partId, 'at snap point:', this.activeSnapPoint)

      this.events.onInputOut.dispatch()

      this.destroy()

      this.boat.attach(partId)

      return
    } else {
      this.activeMorph = null
      this.setImage('junkView')
    }

    // Check drop targets
    if (this.dropTargets) {
      for (var dt of this.dropTargets) {
        if (!dt[0].hitArea) continue

        if (dt[0].hitArea.contains(pointer.x - dt[0].position.x, pointer.y - dt[0].position.y)) {
          var g = this.game

          var ret = dt[1](this)

          if (ret) {
            g.mulle.cursor.remove(dt[0].cursor)
            dt[0].cursor = dt[0].cursorHover
            return
          }
        }
      }
    }

    // Tween back if out of bounds
    if (this.dropRects) {
      var inBounds = false
      for (var i = 0; i < this.dropRects.length; i++) {
        if (this.dropRects[i].contains(this.x, this.y)) {
          inBounds = true
          break
        }
      }

      if (!inBounds) {
        var r = this.game.rnd.pick(this.dropRects)
        this.game.add.tween(this).to({ x: r.randomX, y: r.randomY }, 1000, Phaser.Easing.Cubic.Out, true)
      }
    }
  }

  onHitGround () {
    if (!this.groundSound) {
      this.game.mulle.playAudio(this.sound_floor)
      this.groundSound = true
    }
  }

  /**
   * Handle input down - detect double-click for part info
   * @param {MulleBoatPart} sprite 
   * @param {Phaser.Pointer} pointer 
   */
  onInputDown (sprite, pointer) {
    const now = Date.now()
    const doubleClickThreshold = 300 // ms
    
    // Check for double-click
    if (now - this.lastClickTime < doubleClickThreshold) {
      // Double-click detected - play part description
      this.playDescription()
      this.lastClickTime = 0 // Reset to prevent triple-click
      return
    }
    
    this.lastClickTime = now
    
    // Start hold timer for long press info
    this.isHolding = true
    if (this.holdTimer) {
      this.game.time.events.remove(this.holdTimer)
    }
    
    this.holdTimer = this.game.time.events.add(600, () => {
      // Only play if still holding (not dragging)
      if (this.isHolding && !this.input.isDragged) {
        this.playDescription()
      }
      this.isHolding = false
    })
  }

  /**
   * Have Mulle talk about the part
   * @return {void}
   */
  playDescription () {
    // Don't play if already playing
    if (this.game.mulle.audioPlaying) return
    
    // Check if part has description audio
    if (!this.sound_description) {
      console.debug('[BoatPart] No description audio for part', this.part_id)
      return
    }
    
    console.log('[BoatPart] Playing description for part', this.part_id, this.sound_description)
    
    // Get Mulle actor (same character for both car and boat games)
    var actor = this.game.mulle.actors.mulle
    if (actor && actor.talk) {
      actor.talk(this.sound_description)
    } else {
      // Fallback: just play the audio without actor animation
      this.game.mulle.playAudio(this.sound_description)
    }
  }

  /**
   * Get property value from part
   * BUG FIX #7: Add property getter validation
   * @param {string} name - Property name
   * @param {*} defaultValue - Default value if not found
   * @returns {*} Property value
   */
  getProperty (name, defaultValue = 0) {
    if (!this.partData) {
      console.warn('[BoatPart] No part data for part', this.part_id)
      return defaultValue
    }
    
    // Use MullePartData.getProperty() for case-insensitive lookup
    if (this.partData.getProperty) {
      const value = this.partData.getProperty(name, defaultValue)
      return value
    }
    
    // Fallback: direct property access
    if (!this.partData.Properties) return defaultValue
    const propName = name.toLowerCase()
    const value = this.partData.Properties[propName]
    return value !== undefined ? value : defaultValue
  }
  
  /**
   * Override destroy to clean up preview sprites
   */
  destroy () {
    // BUG FIX #2: Clean up preview sprites on destroy
    this.destroyPreviewSprites()
    super.destroy()
  }

  // === PROPERTY GETTERS (Items #41-45) ===
  
  /**
   * #41: Get inside view image name (for hull parts)
   * @returns {string|null}
   */
  getUseViewInside () {
    const useViewInside = this.partData.UseViewInside || this.partData.useViewInside
    if (useViewInside && useViewInside.length > 0) {
      return useViewInside
    }
    
    // If this is a master part with no inside view, get from master
    if (this.isMaster() && (!useViewInside || useViewInside.length === 0)) {
      const masterId = this.getMaster()
      if (masterId && masterId !== this.part_id) {
        const masterData = this.game.mulle.getBoatPart(masterId)
        return masterData?.UseViewInside || masterData?.useViewInside || null
      }
    }
    
    return null
  }
  
  /**
   * #42: Get second inside view image name
   * @returns {string|null}
   */
  getUseViewInside2 () {
    const useViewInside2 = this.partData.UseViewInside2 || this.partData.useViewInside2
    if (useViewInside2 && useViewInside2.length > 0) {
      return useViewInside2
    }
    
    // If this is a master part with no inside view2, get from master
    if (this.isMaster() && (!useViewInside2 || useViewInside2.length === 0)) {
      const masterId = this.getMaster()
      if (masterId && masterId !== this.part_id) {
        const masterData = this.game.mulle.getBoatPart(masterId)
        return masterData?.UseViewInside2 || masterData?.useViewInside2 || null
      }
    }
    
    return null
  }
  
  /**
   * #43: Get part-specific attach sound
   * @returns {string|null}
   */
  getSndAttachOnBoat () {
    const sndAttach = this.partData.SndAttachOnBoat || this.partData.sndAttachOnBoat
    if (sndAttach && sndAttach.length > 0) {
      return sndAttach
    }
    
    // If this is a master part with no sound, get from master
    if (this.isMaster() && (!sndAttach || sndAttach.length === 0)) {
      const masterId = this.getMaster()
      if (masterId && masterId !== this.part_id) {
        const masterData = this.game.mulle.getBoatPart(masterId)
        return masterData?.SndAttachOnBoat || masterData?.sndAttachOnBoat || null
      }
    }
    
    return null
  }
  
  /**
   * #44: Get new snap points this part provides
   * @returns {Array}
   */
  getNewPoints () {
    return this.partData.New || this.partData.new || []
  }
  
  /**
   * #45: Get required snap points for attachment
   * @returns {Array|number}
   */
  getRequiredPoints () {
    return this.partData.Requires || []
  }
  
  // === PART TYPE CHECKS (Items #47-49) ===
  
  /**
   * #47: Check if this part is a variant (has a different Master part ID)
   * NOTE: Despite the name, this returns true when the part IS a variant/slave,
   * not when it IS the master. This matches the original Lingo convention where
   * "isMaster" checks if the Master field is populated and differs from self.
   * Use isVariant() for clarity in new code.
   * @returns {boolean}
   */
  isMaster () {
    const master = this.partData.Master || this.partData.master
    return master && master !== 0 && master !== this.part_id
  }

  /**
   * Alias for isMaster() with clearer semantics.
   * Returns true if this part is a variant that references a different master part.
   * @returns {boolean}
   */
  isVariant () {
    return this.isMaster()
  }
  
  /**
   * #48: Check if part is a normal part (not master, not morph)
   * @returns {boolean}
   */
  isNormalpart () {
    const master = this.partData.Master || this.partData.master || 0
    const morphsTo = this.partData.MorphsTo || []
    return master === 0 && (!morphsTo || morphsTo.length === 0)
  }
  
  /**
   * #49: Check if part is a morph part (has morphs)
   * @returns {boolean}
   */
  isMorphPart () {
    const morphsTo = this.partData.MorphsTo || []
    return Array.isArray(morphsTo) && morphsTo.length > 0
  }
  
  /**
   * #33: Get master part ID
   * @returns {number}
   */
  getMaster () {
    return this.partData.Master || this.partData.master || 0
  }
  
  /**
   * #46: Get morph target for specific snap point
   * @param {number|string} snapPoint 
   * @returns {number|null}
   */
  getMorphToSnap (snapPoint) {
    if (!this.isMorphPart()) return null
    
    const morphsTo = this.partData.MorphsTo || []
    for (let morphId of morphsTo) {
      const morphData = this.game.mulle.getBoatPart(morphId)
      if (!morphData) continue
      
      const requires = morphData.Requires || []
      const reqList = Array.isArray(requires) ? requires : [requires]
      
      if (reqList.length > 0 && reqList[0] === snapPoint) {
        return morphId
      }
    }
    
    return null
  }
  
  /**
   * BUG FIX #2: Create preview sprites when entering snap zone
   * Original Lingo (line 126-157 in DragScript.ls)
   * @param {object} snapResult - { x, y, snapPoint, morphIndex }
   * @returns {void}
   */
  createPreviewSprites (snapResult) {
    // Destroy existing preview sprites first
    this.destroyPreviewSprites()
    
    if (!this.boat) return
    
    // Get the part data for the snap (could be morph variant)
    let previewPartData = this.partData
    let previewOffset = this.default.offset
    let previewUseView = this.default.UseView
    let previewUseView2 = this.default.UseView2
    
    if (snapResult.morphIndex !== null && this.morphs && this.morphs[snapResult.morphIndex]) {
      const morph = this.morphs[snapResult.morphIndex]
      previewPartData = morph.partData
      previewOffset = morph.offset
      previewUseView = morph.UseView
      previewUseView2 = morph.UseView2
    }
    
    // Get snap info for layer positioning
    const snapInfo = this.boat.getSnapInfo ? this.boat.getSnapInfo(snapResult.snapPoint) : null
    const layers = snapInfo?.layers || [8, 7]
    
    // Calculate preview position (same as snap result)
    const previewX = snapResult.x
    const previewY = snapResult.y
    
    // Create UseView preview sprite (foreground)
    // Fix #53: previewUseView is a {key, name, frame} object from getBoatImage()
    // Use loadTexture(key, name) directly instead of setDirectorMember which fails
    // because atlas frame keys (e.g. "612") don't match dirNum/dirName.
    if (previewUseView && previewUseView.key) {
      this.useViewSP = new MulleSprite(this.game, previewX, previewY)
      this.useViewSP.loadTexture(previewUseView.key, previewUseView.name)
      this.useViewSP.sortIndex = layers[0]
      this.useViewSP.alpha = 0.8 // Slightly transparent to show it's a preview
      
      // Add to boat group for proper layering
      if (this.boat.add) {
        this.boat.add(this.useViewSP)
      } else {
        this.game.world.add(this.useViewSP)
      }
    }
    
    // Create UseView2 preview sprite (background)
    if (previewUseView2 && previewUseView2.key) {
      this.useView2SP = new MulleSprite(this.game, previewX, previewY)
      this.useView2SP.loadTexture(previewUseView2.key, previewUseView2.name)
      this.useView2SP.sortIndex = layers[1]
      this.useView2SP.alpha = 0.8
      
      if (this.boat.add) {
        this.boat.add(this.useView2SP)
      } else {
        this.game.world.add(this.useView2SP)
      }
    }
    
    // Hide the drag sprite (line 140 in DragScript.ls: set the member of sprite SP to member "Dummy")
    this.visible = false
    
    // Sort layers in boat to ensure proper rendering
    if (this.boat.sortLayers) {
      this.boat.sortLayers()
    }
  }
  
  /**
   * BUG FIX #2: Destroy preview sprites when leaving snap area
   * Original Lingo (line 169-175 in DragScript.ls)
   * @returns {void}
   */
  destroyPreviewSprites () {
    if (this.useViewSP) {
      this.useViewSP.destroy()
      this.useViewSP = null
    }
    
    if (this.useView2SP) {
      this.useView2SP.destroy()
      this.useView2SP = null
    }
    
    // Show the drag sprite again (line 177 in DragScript.ls: set the member of sprite SP to dragMember)
    this.visible = true
  }
}

// === CONSTANTS (Items #50-51) ===

/**
 * #50: Base draw point for boat building (fixed reference point)
 */
MulleBoatPart.BASE_DRAW_POINT = { x: 315, y: 210 }

/**
 * #51: Sprite channel offsets for boat rendering
 * These define the layer system for different part types
 */
MulleBoatPart.SPRITE_OFFSETS = {
  BOAT_START: 0,        // Base boat sprite channel
  HULL_FRONT: 1,        // Hull front offset
  HULL_BACK: 2,         // Hull back offset
  RUDDER_FRONT: 3,      // Rudder front offset
  RUDDER_BACK: 4,       // Rudder back offset
  INSIDE_VIEW: 5,       // Inside view offset
  INSIDE_VIEW2: 6       // Second inside view offset
}

export default MulleBoatPart
