/**
 * @fileoverview ToolBoxBH - Toolbox menu behavior
 * Based on: BehaviorScript 86 - ToolBoxBH.ls (and boat ZZToolBoxBH.ls)
 *
 * ToolBoxBH manages the toolbox menu that slides in from the right edge.
 * It provides access to:
 * - Trash boat / Return home (depending on location)
 * - Diploma (achievements)
 * - Quit game
 * - Inventory chest
 *
 * Implementation notes:
 * - Uses Phaser input hotspots (rects) to mirror Lingo mouseObject areas.
 * - Overlay + dialog sprites are provided by the scene for proper layering.
 */

'use strict'

const MulleSpriteModule = require('../sprite')
const MulleSprite = MulleSpriteModule.default || MulleSpriteModule

const rect = (left, top, right, bottom) => ({ left, top, right, bottom })

class ToolBoxBH {
  /**
   * Creates a new ToolBoxBH
   * Lingo: on beginSprite me
   * @param {Object} sprite - The toolbox sprite
   * @param {Object} dir - Director reference (scene)
   * @param {Object} globals - Game globals (gMulleGlobals)
   * @param {Object} sound - Sound handler (gSound)
   * @param {string} [movieName] - Current movie name for location detection
   */
  constructor(sprite, dir, globals, sound, movieName = '') {
    this.sprite = sprite
    this.dir = dir
    this.globals = globals
    this.sound = sound

    // Sprite properties
    this.SP = sprite ? sprite.spriteNum : 0
    this.startLocH = this._getLocH()

    // Animation settings
    this.max = 4
    this.step = 11
    this.counter = 0
    this.mode = 'in'
    this.centerH = 640

    // State
    this.isInside = false
    this.trackRect = { left: 560, top: 400, right: 800, bottom: 650 }
    this.checkForLeave = false
    this.mouseAreaList = []
    this.BGMouseObjects = []
    this.activeClick = true

    // Rollover definitions
    this.orgRollOvers = {
      normal: {
        TrashBoat: { Roll: '09b017v0', Snd: '09d001v0' },
        ReturnHome: { Roll: '09b018v0', Snd: '09d005v0' },
        Diploma: { Roll: '09b019v0', Snd: '09d002v0' },
        quit: { Roll: '09b020v0', Snd: '09d003v0' },
        Inventory: { Roll: '09b006v0', Snd: '09d006v0' }
      },
      Inventory: {
        Fishingrod: { Pic: '09b008v0', Snd: '09d058v0' },
        Diary: { Pic: '09b009v0', Snd: '09d064v0' },
        Bible: { Pic: '09b010v0', Snd: '09d059v0' },
        Swimring: { Pic: '09b011v0', Snd: '09d062v0' },
        RottenFish: { Pic: '09b012v0', Snd: '' },
        DoctorBag: { Pic: '09b013v0', Snd: '09d063v0' },
        Suit: { Pic: '09b014v0', Snd: '09d060v0' },
        Pills: { Pic: '09b015v0', Snd: '' },
        helmet: { Pic: '09b016v0', Snd: '09d061v0' }
      }
    }

    // Display state
    this.displaying = false
    this.overlaySP = (dir && dir.spriteList && typeof dir.spriteList.DialogOverlay === 'number')
      ? dir.spriteList.DialogOverlay
      : 0

    // Location detection
    if (movieName && movieName.substring(0, 2) === '05') {
      this.where = 'Sea'
    } else {
      this.where = 'Home'
    }

    // Rollover state
    this.nowOver = 0
    this.nowOverCounter = 0
    this.rollOvers = null
    this.sndId = 0
    this.inChest = false
    this.waitThenGoMovie = false

    // Dialog + overlay sprites (optional, scene-managed)
    this.dialogSprite = this._resolveDialogSprite()
    this.overlaySprites = this._resolveOverlaySprites()
    this.dialogOverlaySprite = this.overlaySprites[0] || null
  }

  /**
   * End sprite cleanup
   * Lingo: on endSprite me
   */
  endSprite() {
    this.kill()
  }

  /**
   * Set click active state
   * Lingo: on activateClick me, theState
   * @param {boolean} state
   */
  activateClick(state) {
    this.activeClick = !!state
  }

  /**
   * Frame update
   * Lingo: on exitFrame me
   */
  exitFrame() {
    // Check for mouse leaving track area
    if (this.checkForLeave) {
      const loc = this._getPointerLoc()
      if (loc && !this._pointInRect(loc, this.trackRect)) {
        this.mymouseLeave()
      }
    }

    // Animation update
    if (this.counter > 0) {
      this.counter--

      if (this.mode === 'in') {
        this._setLocH(this.startLocH - (this.counter * this.step))
      } else if (this.mode === 'Out') {
        this._setLocH(this.startLocH - ((this.max - this.counter) * this.step))
      }
    }

    // Rollover sound handling
    if (this.displaying && this.nowOver !== 0) {
      if (this.nowOverCounter > 0) {
        this.nowOverCounter--
        if (this.nowOverCounter === 0) {
          const info = this.rollOvers ? this.rollOvers[this.nowOver] : null
          const snd = info && info.Snd ? info.Snd : null
          if (snd) {
            if (this.where === 'Sea' && this.dir && this.dir.mulleTalkObject && this.dir.mulleTalkObject.say) {
              this.sndId = this.dir.mulleTalkObject.say(snd, 2)
            } else {
              this.sndId = this._playSound(snd, 'EFFECT')
            }
          }
        }
      }
    }
  }

  /**
   * Mouse enter handler
   * Lingo: on mouseEnter me
   */
  mouseEnter() {
    if (this.activeClick) {
      this.checkForLeave = true

      if (this.mode === 'in') {
        if (this.counter < 4) {
          this._playSound('00e110v0', 'OPEFFECT')
        }
        this.mode = 'Out'
        this.counter = this.max - this.counter
        this.isInside = false
      }
    } else {
      if (this.mode === 'Out') {
        this.mode = 'in'
        this.counter = this.max - this.counter
      }
    }
  }

  /**
   * Mouse leave handler
   * Lingo: on mymouseLeave me
   */
  mymouseLeave() {
    this.isInside = false
    this.checkForLeave = false
    this._setCursor(null)

    if (this.mode === 'Out') {
      this.mode = 'in'
      this.counter = this.max - this.counter
    }
  }

  /**
   * Mouse down handler
   * Lingo: on mouseDown me
   */
  mouseDown() {
    // No action in original
  }

  /**
   * Mouse up handler - opens toolbox
   * Lingo: on mouseUp me
   */
  mouseUp() {
    if (!this.activeClick) return
    if (this.displaying) return

    this.inChest = false
    this.displaying = true
    this.rollOvers = this.orgRollOvers.normal

    this.counter = 0
    this.mode = 'Out'
    this._setLocH(this.startLocH - (this.max * this.step))
    this._setOverlayMember('Dummy')

    if (this.dir && typeof this.dir.activateinterface === 'function') {
      this.dir.activateinterface(false)
    }

    // Pause all mouse objects
    if (this.globals && this.globals.mouseMaster) {
      this.globals.mouseMaster.setActivePauseAll(true)
    }

    // Create background mouse objects (click outside -> exit)
    this._clearHotspots(this.BGMouseObjects)
    this.BGMouseObjects = []
    this.BGMouseObjects.push(this._createRectHotspot(rect(0, 0, 640, 480)))
    this.BGMouseObjects.push(this._createRectHotspot(rect(0, 0, 109, 480), { id: 'exit' }))
    this.BGMouseObjects.push(this._createRectHotspot(rect(0, 0, 640, 91), { id: 'exit' }))
    this.BGMouseObjects.push(this._createRectHotspot(rect(533, 0, 640, 480), { id: 'exit' }))
    this.BGMouseObjects.push(this._createRectHotspot(rect(0, 389, 640, 480), { id: 'exit' }))

    // Create menu mouse objects
    this._createMenuButtons()

    // Set dialog sprite
    this._setDialogMember(this.where === 'Sea' ? '09b002v0' : '09b001v0')

    if (this.dir && this.where === 'Sea') {
      this.dir.pause(true)
    }
  }

  /**
   * Create menu buttons (hotspots)
   * @private
   */
  _createMenuButtons() {
    this._clearHotspots(this.mouseAreaList)
    this.mouseAreaList = []

    const homeOrTrash = this.where === 'Home' ? 'TrashBoat' : 'ReturnHome'

    const menuButtons = [
      { id: homeOrTrash, rect: rect(196, 136, 300, 240) },
      { id: 'Diploma', rect: rect(297, 211, 403, 315) },
      { id: 'quit', rect: rect(397, 129, 503, 233) },
      { id: 'Inventory', rect: rect(384, 312, 532, 388) }
    ]

    menuButtons.forEach((btn) => {
      const hs = this._createRectHotspot(btn.rect, { id: btn.id })
      if (hs) this.mouseAreaList.push(hs)
    })
  }

  /**
   * Mouse event handler
   * Lingo: on mouse me, argObj, argWhat
   * @param {Object} obj - Object with dragToWhere property
   * @param {string} what - Event type (click, enter, Leave)
   */
  mouse(obj, what) {
    const id = obj ? obj.dragToWhere : null

    if (what === 'click') {
      switch (id) {
        case 'exit':
          this.kill()
          break

        case 'ReturnHome':
          this.kill()
          if (this.dir && this.dir.prepareToLeave) {
            this.dir.prepareToLeave('04')
          }
          break

        case 'TrashBoat': {
          this.kill()
          if (this.globals && this.globals.user) {
            const boat = this.globals.user.getBoat ? this.globals.user.getBoat() : null
            if (boat && boat.trash) {
              boat.trash()
            }
          }
          this._goMovie('01')
          break
        }

        case 'Diploma':
          this.kill()
          if (this.where === 'Sea') {
            if (this.dir && this.dir.prepareToLeave) {
              this.dir.prepareToLeave('08')
            }
          } else {
            this._goMovie('08')
          }
          break

        case 'Inventory':
          this._enterInventory()
          break

        case 'quit':
          if (this.globals && this.globals.user) {
            this.globals.user.veryFirstTime = 0
          }
          if (this.globals && this.globals.save) {
            this.globals.save()
          }
          this.kill()
          this._goMovie('13')
          break
      }
    } else if (what === 'enter') {
      const rollInfo = this.rollOvers ? this.rollOvers[id] : null
      if (rollInfo) {
        const rollPic = rollInfo.Roll
        if (rollPic && this.dialogOverlaySprite) {
          this._setOverlayMember(rollPic)
        }
        this.nowOver = id
        if (!this.inChest) {
          this.nowOverCounter = this.where === 'Sea' ? 14 : 7
          if (this.sndId) {
            this._stopSound(this.sndId)
          }
        }
      }
    } else if (what === 'Leave') {
      if (id === this.nowOver && !this.inChest) {
        this._setOverlayMember('Dummy')
        this.nowOver = 0
        this.nowOverCounter = 0
      }
    }
  }

  /**
   * Enter inventory chest mode
   * Lingo: #Inventory branch
   */
  _enterInventory() {
    this._clearHotspots(this.mouseAreaList)
    this.mouseAreaList = []

    this.inChest = true
    this.nowOver = 0
    this.nowOverCounter = 0
    this._setOverlayMember('Dummy')

    if (this.dir && this.dir.mulleTalkObject && this.dir.mulleTalkObject.stop) {
      this.dir.mulleTalkObject.stop()
    } else if (this.sound && this.sound.stopAllEffects) {
      this.sound.stopAllEffects()
    }

    this.rollOvers = this.orgRollOvers.Inventory

    // Show inventory dialog
    this._setDialogMember('09b007v0')

    // Populate inventory items
    const rollKeys = Object.keys(this.rollOvers || {})
    rollKeys.forEach((itemId, index) => {
      const info = this.rollOvers[itemId]
      if (!info || !info.Pic) return
      const hasItem = this.globals && this.globals.user && this.globals.user.isInInventory
        ? this.globals.user.isInInventory(itemId)
        : false
      if (!hasItem) return

      const overlay = this._getOverlaySprite(index)
      if (!overlay || !overlay.setDirectorMember) return

      overlay.setDirectorMember(info.Pic)
      if (overlay.position && typeof overlay.position.set === 'function') {
        overlay.position.set(320, 240)
      } else {
        overlay.x = 320
        overlay.y = 240
      }

      const rectBounds = this._spriteBoundsRect(overlay)
      const hs = this._createRectHotspot(rectBounds, { id: itemId })
      if (hs) this.mouseAreaList.push(hs)
    })
  }

  /**
   * Cleanup
   * Lingo: on kill me
   * @returns {null}
   */
  kill() {
    if (this.displaying) {
      this.displaying = false

      this._setDialogMember('Dummy')
      this._setOverlayMember('Dummy')

      // Clear overlay item sprites
      if (this.overlaySprites && this.overlaySprites.length > 1) {
        for (let i = 1; i < this.overlaySprites.length; i++) {
          const sp = this.overlaySprites[i]
          if (sp && sp.setDirectorMember) {
            sp.setDirectorMember('Dummy')
          }
        }
      }

      if (this.dir) {
        if (this.where === 'Sea') {
          this.dir.pause(false)
          if (this.dir.mulleTalkObject && this.dir.mulleTalkObject.stop) {
            this.dir.mulleTalkObject.stop()
          }
        }
      }

      this._clearHotspots(this.mouseAreaList)
      this._clearHotspots(this.BGMouseObjects)
      this.mouseAreaList = []
      this.BGMouseObjects = []

      if (this.globals && this.globals.mouseMaster) {
        this.globals.mouseMaster.setActivePauseAll(false)
      }

      if (this.dir && typeof this.dir.activateinterface === 'function') {
        this.dir.activateinterface(true)
      }

      if (this.where === 'Home' && this.dir) {
        this.dir.dialogClosed = true
      }
    }

    this.activateClick(true)
    return null
  }

  /**
   * Get displaying state
   * @returns {boolean}
   */
  getDisplaying() {
    return this.displaying
  }

  /**
   * Get inChest state
   * @returns {boolean}
   */
  getInChest() {
    return this.inChest
  }

  _getGame() {
    if (this.globals && this.globals.game) return this.globals.game
    if (this.dir && this.dir.game) return this.dir.game
    if (this.sprite && this.sprite.game) return this.sprite.game
    return null
  }

  _getPointerLoc() {
    const game = this._getGame()
    const pointer = game && game.input ? game.input.activePointer : null
    if (!pointer) return null
    return { x: pointer.x, y: pointer.y }
  }

  _getLocH() {
    if (!this.sprite) return 640
    if (typeof this.sprite.locH === 'number') return this.sprite.locH
    if (typeof this.sprite.x === 'number') return this.sprite.x
    if (this.sprite.position && typeof this.sprite.position.x === 'number') return this.sprite.position.x
    return 640
  }

  _setLocH(value) {
    if (!this.sprite) return
    if (typeof this.sprite.locH === 'number') {
      this.sprite.locH = value
      return
    }
    if (typeof this.sprite.x === 'number') {
      this.sprite.x = value
      return
    }
    if (this.sprite.position && typeof this.sprite.position.set === 'function') {
      this.sprite.position.set(value, this.sprite.position.y || 0)
    }
  }

  _pointInRect(point, r) {
    return point.x >= r.left && point.x <= r.right && point.y >= r.top && point.y <= r.bottom
  }

  _setCursor(name) {
    const game = this._getGame()
    if (game && game.mulle && game.mulle.cursor && 'current' in game.mulle.cursor) {
      game.mulle.cursor.current = name || null
    }
  }

  _createRectHotspot(r, opts = {}) {
    const game = this._getGame()
    if (!game || !game.add || !game.add.graphics) return null

    const hs = game.add.graphics(0, 0)
    hs.beginFill(0x000000, 0)
    hs.drawRect(r.left, r.top, r.right - r.left, r.bottom - r.top)
    hs.endFill()
    hs.alpha = 0.01
    hs.fixedToCamera = true
    hs.inputEnabled = true
    if (hs.input) {
      hs.input.useHandCursor = false
    }

    const id = opts.id || opts.dragToWhere || null
    if (id) {
      hs.events.onInputOver.add(() => {
        this._setCursor('Clickable')
        this.mouse({ dragToWhere: id }, 'enter')
      })
      hs.events.onInputOut.add(() => {
        this._setCursor(null)
        this.mouse({ dragToWhere: id }, 'Leave')
      })
      hs.events.onInputUp.add(() => {
        this.mouse({ dragToWhere: id }, 'click')
      })
    }

    return hs
  }

  _clearHotspots(list) {
    if (!Array.isArray(list)) return
    list.forEach((obj) => {
      if (obj && typeof obj.destroy === 'function') {
        obj.destroy()
      }
    })
  }

  _resolveDialogSprite() {
    if (this.dir && this.dir.dialogSprite && typeof this.dir.dialogSprite.setDirectorMember === 'function') {
      return this.dir.dialogSprite
    }
    const dialogFromList = this.dir && this.dir.spriteList ? this.dir.spriteList.dialog : null
    if (dialogFromList && typeof dialogFromList.setDirectorMember === 'function') {
      return dialogFromList
    }
    if (this.dir && this.dir._spriteInstances && this.dir.spriteList && typeof this.dir.spriteList.dialog === 'number') {
      const sp = this.dir._spriteInstances[this.dir.spriteList.dialog]
      if (sp && typeof sp.setDirectorMember === 'function') return sp
    }
    return null
  }

  _resolveOverlaySprites() {
    if (this.dir && Array.isArray(this.dir.dialogOverlaySprites)) {
      return this.dir.dialogOverlaySprites
    }
    const overlayFromList = this.dir && this.dir.spriteList ? this.dir.spriteList.DialogOverlay : null
    if (Array.isArray(overlayFromList)) {
      return overlayFromList
    }
    if (overlayFromList && typeof overlayFromList.setDirectorMember === 'function') {
      return [overlayFromList]
    }
    if (this.dir && this.dir._spriteInstances && this.dir.spriteList && typeof this.dir.spriteList.DialogOverlay === 'number') {
      const base = this.dir.spriteList.DialogOverlay
      const sprites = []
      for (let i = 0; i < 9; i++) {
        const sp = this.dir._spriteInstances[base + i]
        if (sp && typeof sp.setDirectorMember === 'function') {
          sprites.push(sp)
        }
      }
      if (sprites.length) return sprites
    }
    return []
  }

  _setDialogMember(memberName) {
    if (!this.dialogSprite || typeof this.dialogSprite.setDirectorMember !== 'function') return
    if (memberName === 'Dummy') {
      this.dialogSprite.setDirectorMember('Dummy')
      return
    }
    this.dialogSprite.setDirectorMember(memberName)
    if (this.dialogSprite.position && typeof this.dialogSprite.position.set === 'function') {
      this.dialogSprite.position.set(320, 240)
    } else {
      this.dialogSprite.x = 320
      this.dialogSprite.y = 240
    }
  }

  _setOverlayMember(memberName) {
    if (!this.dialogOverlaySprite || typeof this.dialogOverlaySprite.setDirectorMember !== 'function') return
    this.dialogOverlaySprite.setDirectorMember(memberName || 'Dummy')
    if (this.dialogOverlaySprite.position && typeof this.dialogOverlaySprite.position.set === 'function') {
      this.dialogOverlaySprite.position.set(320, 240)
    } else if (this.dialogOverlaySprite) {
      this.dialogOverlaySprite.x = 320
      this.dialogOverlaySprite.y = 240
    }
  }

  _getOverlaySprite(index) {
    if (!this.overlaySprites || !this.overlaySprites.length) return null
    const i = Math.max(0, Math.min(index, this.overlaySprites.length - 1))
    return this.overlaySprites[i]
  }

  _spriteBoundsRect(sprite) {
    if (!sprite) return rect(0, 0, 0, 0)
    if (typeof sprite.getBounds === 'function') {
      const b = sprite.getBounds()
      return rect(b.left, b.top, b.right, b.bottom)
    }
    const x = sprite.x || 0
    const y = sprite.y || 0
    const w = sprite.width || 1
    const h = sprite.height || 1
    return rect(x, y, x + w, y + h)
  }

  _playSound(id, channel = 'EFFECT') {
    if (!id) return null
    if (this.sound && typeof this.sound.play === 'function') {
      return this.sound.play(id, channel)
    }
    const game = this._getGame()
    if (game && game.mulle && typeof game.mulle.playAudioChannel === 'function') {
      return game.mulle.playAudioChannel(id, channel)
    }
    if (game && game.mulle && typeof game.mulle.playAudio === 'function') {
      return game.mulle.playAudio(id)
    }
    return null
  }

  _stopSound(snd) {
    if (!snd) return
    if (typeof snd.stop === 'function') {
      snd.stop()
      return
    }
    if (this.sound && typeof this.sound.stop === 'function') {
      this.sound.stop(snd)
    }
  }

  _goMovie(dirId) {
    const game = this._getGame()
    if (!game || !game.state || typeof game.state.start !== 'function') return

    const key = String(dirId || '')
    let sceneKey = null

    if (game.mulle) {
      if (game.mulle.botenScenes && game.mulle.botenScenes[key]) {
        sceneKey = game.mulle.botenScenes[key]
      } else if (game.mulle.resolveSceneFromDirResource) {
        sceneKey = game.mulle.resolveSceneFromDirResource(key, game.state.current)
      }
    }

    game.state.start(sceneKey || key)
  }
}

module.exports = ToolBoxBH
