/**
 * MulleBoatPart object
 * @module objects/boatpart
 * 
 * Equivalent of MulleCarPart but for boats
 * Handles dragging boat parts and attaching them to boats
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

    this.snapDistance = 50

    this.justDetached = false

    this.groundSound = false

    this.noPhysics = noPhysics

    this.dropTargets = []

    this.dragTicks = 0

    if (!this.game.mulle.BoatPartsDB[this.part_id]) {
      console.error('[BoatPart] Invalid part', this.part_id)
      return
    }

    this.partData = this.game.mulle.getBoatPart(this.part_id)

    // Boat sound effects (different from cars)
    this.sound_floor = '00e001v0'
    this.sound_attach = '00e006v0' // Boat attach sound
    
    // Part description audio (plays on double-click or long press)
    this.sound_description = this.partData.SndDescription || null

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
    this.default = {
      junkView: this.getBoatImage(this.partData.JunkView || this.partData.ShelfView),
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
   * Set active image
   * @param {string} name junkView/UseView/UseView2
   */
  setImage (name) {
    var src = this.activeMorph != null && this.morphs ? this.morphs[this.activeMorph] : this.default

    if (!src || !src[name]) {
      console.warn('[BoatPart] Missing image', name, 'for part', this.part_id)
      return
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
        // Christina talks when dragging incompatible part
        if (this.game.mulle.actors.christina) {
          this.game.mulle.actors.christina.talk('04d007v0')
        }
      }

      return
    }

    var offJnk = this.default.junkView && this.default.junkView.frame ? this.default.junkView.frame.regpoint : { x: 0, y: 0 }

    if (this.morphs && this.morphs.length > 0) {
      for (var i = 0; i < this.morphs.length; i++) {
        var morph = this.morphs[i]

        var offUse = morph.UseView && morph.UseView.frame ? morph.UseView.frame.regpoint : { x: 0, y: 0 }

        var chk_x = x - offJnk.x + offUse.x
        var chk_y = y - offJnk.y + offUse.y - morph.offset.y

        var dst_x = this.boat.x + morph.offset.x
        var dst_y = this.boat.y + morph.offset.y

        var distance = this.game.math.distance(chk_x, chk_y, dst_x, dst_y)

        if (distance < this.snapDistance) {
          if (!this.checkCanAttach(i)) continue

          this.position.set(dst_x, dst_y)
          this.canAttach = true
          this.activeMorph = i
          this.setImage('UseView')

          if (!this.snapSound) {
            this.game.mulle.playAudio(this.sound_attach)
            this.snapSound = true
          }

          return
        }
      }

      if (this.snapSound) {
        this.game.mulle.playAudio(this.sound_attach)
        this.snapSound = false
      }

      this.canAttach = false
      this.activeMorph = null
      this.setImage('junkView')
    } else {
      var offUse = this.default.UseView && this.default.UseView.frame ? this.default.UseView.frame.regpoint : { x: 0, y: 0 }

      var chk_x = x - offJnk.x + offUse.x
      var chk_y = y - offJnk.y + offUse.y

      var distance = this.game.math.distance(chk_x, chk_y, this.boat.x, this.boat.y)

      if (distance < this.snapDistance && this.checkCanAttach()) {
        this.setImage('UseView')
        this.position.set(this.boat.x, this.boat.y)
        this.canAttach = true

        if (!this.snapSound) {
          this.game.mulle.playAudio(this.sound_attach)
          this.snapSound = true
        }
      } else {
        this.setImage('junkView')
        this.canAttach = false

        if (this.snapSound) {
          this.game.mulle.playAudio(this.sound_attach)
          this.snapSound = false
        }
      }
    }
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

    if (this.morphs && this.morphs.length > 0) {
      var ok = this.morphs.length
      this.morphs.forEach((m, i) => {
        if (!this.checkCanAttach(i)) ok--
      })

      this.noAttach = ok <= 0
    } else {
      this.noAttach = !this.checkCanAttach()
    }
  }

  onDrop (obj, pointer) {
    if (!this.justDetached) {
      var dist = Phaser.Point.distance(this.position, this.input.dragStartPoint)

      if (dist < 5) {
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

    if (!this.noAttach && this.canAttach) {
      var partId = this.part_id

      if (this.activeMorph !== null && this.morphs) {
        partId = this.morphs[this.activeMorph].partId
      }

      console.log('[BoatPart] Attach part by drag', partId)

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
   * Have Christina talk about the part
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
    
    // Try Christina first (boat game), then Mulle (car game)
    var actor = this.game.mulle.actors.christina || this.game.mulle.actors.mulle
    if (actor && actor.talk) {
      actor.talk(this.sound_description)
    } else {
      // Fallback: just play the audio without actor animation
      this.game.mulle.playAudio(this.sound_description)
    }
  }

  getProperty (name) {
    if (!this.partData || !this.partData.Properties) return 0
    return this.partData.Properties[name.toLowerCase()] || 0
  }
}

export default MulleBoatPart
