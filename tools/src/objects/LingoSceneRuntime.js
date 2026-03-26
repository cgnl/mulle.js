'use strict'

/**
 * Minimal Lingo scene interpreter:
 * - mouseObject rects
 * - cursor rollovers
 * - enter/leave sprite + sound
 * - click + wait callbacks
 *
 * This is intentionally small and deterministic for parity-critical scenes.
 */
class LingoSceneRuntime {
  /**
   * @param {Phaser.State} scene
   * @param {object} spec
   */
  constructor (scene, spec) {
    this.scene = scene
    this.game = scene.game
    this.spec = spec || {}
    this.objects = []
    this._loop = null
  }

  /**
   * Register a sprite for Lingo spriteList name.
   * @param {string} name
   * @param {Phaser.Sprite} sprite
   */
  registerSprite (name, sprite) {
    if (!this.scene.lingoSprites) this.scene.lingoSprites = {}
    this.scene.lingoSprites[name] = sprite
  }

  /**
   * Build mouseObjects from spec.
   */
  build () {
    const mouseObjects = this.spec.mouseObjects || []
    mouseObjects.forEach((obj) => {
      const gfx = this.game.add.graphics(0, 0)
      const [x1, y1, x2, y2] = obj.rect
      const w = x2 - x1
      const h = y2 - y1
      gfx.beginFill(0x000000, 0.01)
      gfx.drawRect(x1, y1, w, h)
      gfx.endFill()

      gfx.inputEnabled = true
      gfx.input.useHandCursor = false
      gfx.hitArea = new Phaser.Rectangle(x1, y1, w, h)

      gfx.lingo = obj
      gfx._lingoHover = false
      gfx._lingoWaitCounter = 0
      gfx._lingoActive = true
      gfx._lingoHitArea = gfx.hitArea

      // Cursor mapping
      gfx.cursorHover = this.mapCursor(obj.cursor && obj.cursor.rollOver)
      gfx.cursorDrag = this.mapCursor(obj.cursor && obj.cursor.dragRollover)
      gfx.cursor = gfx.cursorHover

      gfx.events.onInputOver.add(() => {
        if (!gfx._lingoActive) return
        gfx._lingoHover = true
        gfx._lingoWaitCounter = 0
        const cursorType = gfx.cursor || gfx.cursorHover
        if (cursorType) {
          this.scene.game.mulle.cursor.current = cursorType
        }
        this.applyEnterLeave(obj.enter, obj, true)
        this.dispatchMouse(obj, 'enter')
      })

      gfx.events.onInputOut.add(() => {
        gfx._lingoHover = false
        gfx._lingoWaitCounter = 0
        this.scene.game.mulle.cursor.current = null
        this.applyEnterLeave(obj.leave, obj, false)
        this.dispatchMouse(obj, 'leave')
      })

      gfx.events.onInputUp.add(() => {
        if (!gfx._lingoActive) return
        if (obj.click && obj.click.sound) {
          try { this.scene.game.mulle.playAudio(obj.click.sound) } catch (e) {}
        }
        this.dispatchMouse(obj, 'click')
      })

      this.objects.push(gfx)
    })

    this.refreshActive()
  }

  /**
   * Start 60 FPS loop for wait handling.
   */
  startLoop () {
    if (this._loop) return
    this._loop = this.game.time.events.loop(Math.floor(1000 / 60), this.update, this)
  }

  /**
   * Update wait counters + active predicates.
   */
  update () {
    this.refreshActive()

    for (const gfx of this.objects) {
      if (!gfx._lingoActive) continue
      const obj = gfx.lingo
      if (!obj || !obj.wait || !gfx._lingoHover) continue

      gfx._lingoWaitCounter++
      if (gfx._lingoWaitCounter >= obj.wait.times) {
        gfx._lingoWaitCounter = 0
        this.dispatchMouse(obj, 'wait')
      }
    }
  }

  /**
   * Re-evaluate activeWhen for mouseObjects.
   */
  refreshActive () {
    for (const gfx of this.objects) {
      const obj = gfx.lingo
      const active = typeof obj.activeWhen === 'function' ? !!obj.activeWhen(this.scene) : true
      if (active === gfx._lingoActive) continue

      gfx._lingoActive = active
      if (!active) {
        gfx.inputEnabled = false
        gfx.visible = false
        if (gfx.hitArea) {
          gfx._lingoHitArea = gfx.hitArea
          gfx.hitArea = null
        }
      } else {
        gfx.inputEnabled = true
        gfx.visible = true
        if (!gfx.hitArea && gfx._lingoHitArea) {
          gfx.hitArea = gfx._lingoHitArea
        }
      }
    }
  }

  /**
   * Map Lingo cursor names to in-game cursor types.
   */
  mapCursor (name) {
    if (!name) return null
    switch (name) {
      case 'GoLeft': return 'Left'
      case 'GoRight': return 'Right'
      case 'GoForward': return 'MoveIn'
      case 'Clickable': return 'Click'
      case 'Standard': return null
      case 'Point': return 'Point'
      case 'DropLeft': return 'MoveLeft'
      case 'DropRight': return 'MoveRight'
      case 'DropForward': return 'MoveIn'
      case 'Grabbed': return 'Grab'
      case 'Grabable': return 'Grab'
      default: return name
    }
  }

  /**
   * Dispatch a Lingo-style mouse event to the scene.
   * Prefers onLingoMouse(obj, type). Falls back to onLingoClick/onLingoWait.
   */
  dispatchMouse (obj, type) {
    if (!obj) return
    if (typeof this.scene.onLingoMouse === 'function') {
      this.scene.onLingoMouse(obj, type)
      return
    }
    if (type === 'click' && typeof this.scene.onLingoClick === 'function') {
      this.scene.onLingoClick(obj)
      return
    }
    if (type === 'wait' && typeof this.scene.onLingoWait === 'function') {
      this.scene.onLingoWait(obj)
    }
  }

  /**
   * Apply enter/leave actions (sprite pic + sound).
   */
  applyEnterLeave (action, obj, isEnter) {
    if (!action) return

    if (action.sound && isEnter) {
      try { this.scene.game.mulle.playAudio(action.sound) } catch (e) {}
    }

    if (action.pic) {
      const spriteKey = action.sprite || obj.sprite
      const sprite = spriteKey && this.scene.lingoSprites ? this.scene.lingoSprites[spriteKey] : null
      if (sprite && sprite.setDirectorMember) {
        const dirFile = action.dirFile || this.spec.dirFile || this.scene.DirResource
        if (action.pic === 'Dummy') {
          sprite.setDirectorMember('Dummy')
        } else {
          sprite.setDirectorMember(dirFile, action.pic)
        }
      }
    }
  }

  /**
   * Get a mouseObject graphics by Lingo id.
   */
  getById (id) {
    return this.objects.find(o => o.lingo && o.lingo.id === id)
  }

  /**
   * Get all mouseObjects by dragToWhere tag.
   */
  getByDragToWhere (tag) {
    return this.objects.filter(o => o.lingo && o.lingo.dragToWhere === tag)
  }

  destroy () {
    if (this._loop) {
      this.game.time.events.remove(this._loop)
      this._loop = null
    }
    for (const gfx of this.objects) {
      if (gfx && typeof gfx.destroy === 'function') {
        gfx.destroy()
      }
    }
    this.objects = []
  }
}

export default LingoSceneRuntime
