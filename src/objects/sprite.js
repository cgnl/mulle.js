/**
 * MulleSprite object
 * @module objects/sprite
 */
'use strict'

import directorAnimation from '../util/directorAnimation'

var spriteLookup = {}

/**
 * Mulle sprite, extension of phaser sprite
 * @extends Phaser.Sprite
 */
const PhaserSpriteBase = (typeof Phaser !== 'undefined' && Phaser.Sprite)
  ? Phaser.Sprite
  : class {
    constructor (game, x, y, key = null, frame = null) {
      this.game = game
      this.position = { set: () => {}, x: x || 0, y: y || 0 }
      this.pivot = { set: () => {} }
      this.scale = { setTo: () => {} }
      this.loadTexture = () => {}
      this.setFrame = () => {}
      this.destroy = () => {}
    }
  }

class MulleSprite extends PhaserSpriteBase {
  /**
   * Create
   * @param	{Phaser.Game} game  Main game
   * @param	{number}      x     x coordinate
   * @param	{number}      y     y coordinate
   * @param	{string|null}      key   texture atlas key
   * @param	{string|null}      frame frame name/number
   * @return	{void}
   */
  constructor (game, x, y, key = null, frame = null) {
    super(game, x, y, key, frame)

    if (typeof PIXI !== 'undefined' && PIXI.Point) {
      this.regPoint = new PIXI.Point(0, 0)
    } else {
      this.regPoint = { x: 0, y: 0 }
    }

    /**
     * Director movie
     * @type {string}
     */
    this.movie = ''

    // BUG FIX #9: Add Director channel z-order management
    /**
     * Director sprite channel (1-100)
     * @type {number}
     */
    this.directorChannel = 0

    // BUG FIX #10: Add ink/blend mode support
    /**
     * Director ink mode (matte, transparent, blend, etc.)
     * @type {string}
     */
    this.directorInkMode = 'copy'

    // console.log('MulleSprite', this)

    /*
    this.events.onInputOver.add( () => {

      this.game.mulle.cursor.current = this.cursor

    } )
    */

    // this.events.onInputOut.add( this.cursorOut, this )

    // this._cursor = null
  }

  /*
  getCursor() {
    return false
  }

  cursorOver() {
    // console.log('cursor in')

    // var c = this.getCursor()
    // if (c) this.game.canvas.className = 'cursor-' + c

    // if (this.cursor) this.game.canvas.className = 'cursor-' + this.cursor

    if (this.cursor) {
      this.game.mulle.cursor.setCursor(this, this.cursor)
    }

  }

  cursorOut(){
    // console.log('cursor out')
    // if (this.cursor) this.game.canvas.className = ''
    if (this.cursor) {
      this.game.mulle.cursor.setCursor(this, null)
    }
  }
  */

  /**
   * Update pivot point, called internally
   * @return {void}
   */
  updatePivot () {
    // console.log('regpoint update', this, this._frame.regpoint)

    if (!this._frame) {
      console.warn('no frame')
      return
    }

    if (!this._frame.regpoint) {
      console.warn('no regpoint', this._frame, this.key, this._frame.name)
      return
    }

    this.regPoint.set(this._frame.regpoint.x, this._frame.regpoint.y) // new PIXI.Point( this._frame.regpoint.x, this._frame.regpoint.y )

    this.pivot.set(this.regPoint.x, this.regPoint.y)

    // this.anchor = new PIXI.Point( this._frame.regpoint.x / this.w, this._frame.regpoint.y / this.h )
  }

  /**
   * Override phaser setFrame function
   * @param {string} frame
   */
  setFrame (frame) {
    super.setFrame(frame)

    this.updatePivot()

    // console.log('setFrame hijack')
  }

  setFrameId (val) {
    // console.log('frame id', this)

    var f = this.game.mulle.findFrameById(val)

    if (f) {
      this.loadTexture(f[0], f[1])

      // console.log('frame found', val, f[0], f[1])

      return true
    } else {
      // console.warn('frame not found', val)

      return false
    }
  }

  /**
   * Set sprite frame by Director member
   * Deprecated, use DirectorHelper.sprite
   * @param {string} dir
   * @param {number} num
   * @deprecated
   */
  setDirectorMember (dir, num) {
    // Lingo uses member "Dummy" as a clear/empty placeholder.
    // We don't have a Dummy sprite in atlases, so treat it as "hide sprite".
    if (dir === 'Dummy' || num === 'Dummy') {
      this.visible = false
      this._hiddenByDummy = true
      return true
    }

    if (this._hiddenByDummy) {
      this.visible = true
      this._hiddenByDummy = false
    }

    if (dir && num && spriteLookup[ dir + '_' + num ]) {
      this.loadTexture(spriteLookup[ dir + '_' + num ][0], spriteLookup[ dir + '_' + num ][1])
      return true
    }

    if (dir && num && this.game && this.game.mulle && typeof this.game.mulle.getDirectorImage === 'function') {
      const img = this.game.mulle.getDirectorImage(dir, num)
      if (img && img.key && img.name) {
        spriteLookup[ dir + '_' + num ] = [img.key, img.name]
        this.loadTexture(img.key, img.name)
        return true
      }
      return false
    }

    if (!this.game || !this.game.cache || typeof Phaser === 'undefined' || !Phaser.Cache) {
      return false
    }

    var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE) || []

    for (var k in keys) {
      var img = this.game.cache.getImage(keys[k], true)

      // Skip if no frameData (not an atlas)
      if (!img || !img.frameData) {
        continue
      }

      var frames = img.frameData.getFrames()

      for (var f in frames) {
        if (!num) {
          if ((frames[f].dirNum === dir || frames[f].dirName === dir)) {
            // Context-aware lookup: prefer car game assets (CDDATA.CXT) over boat assets (boten_CDDATA.CXT)
            // unless we're explicitly in a boat scene (boatAssetsLoaded flag indicates boat context)
            const dirFile = frames[f].dirFile || ''
            const isBoatAsset = dirFile.startsWith('boten_')
            const inBoatContext = this.game.mulle && this.game.mulle.boatAssetsLoaded
            
            // Skip boat assets if we're not in boat context
            if (isBoatAsset && !inBoatContext) {
              continue
            }
            
            this.loadTexture(img.key, frames[f].name)
            return true
          }
        } else {
          if (frames[f].dirFile === dir && (frames[f].dirNum === num || frames[f].dirName === num)) {
            spriteLookup[ dir + '_' + num ] = [img.key, frames[f].name]
            this.loadTexture(img.key, frames[f].name)
            return true
          }
        }
      }
    }

    console.error('set member fail', dir, num, 'searched', keys.length, 'image keys')

    return false
  }

  loadDirectorTexture(name) {
    const [key, frame] = this.game.director.getNamedImage(name)
    this.loadTexture(key, frame)
  }

  /**
   * Add animation with director members instead of frames
   * @param {string}  name           [description]
   * @param {array}   members        [description]
   * @param {number}  fps            [description]
   * @param {boolean}    loop           [description]
   * @param {boolean}    killOnComplete [description]
   * @return {Phaser.Animation}
   */
  addAnimation (name, members, fps, loop, killOnComplete = false) {
    var frames = []
    var missingFrames = []

    members.forEach(v => {
      var img = this.game.mulle.getDirectorImage(v[0], v[1])
      if (img && img.name) {
        frames.push(img.name)
      } else {
        missingFrames.push(v[0] + ':' + v[1])
      }
    })

    if (missingFrames.length > 0) {
      console.warn('[sprite-anim] Missing frames for animation', name, ':', missingFrames.join(', '))
    }

    if (frames.length === 0) {
      console.error('[sprite-anim] Cannot create animation', name, '- no valid frames found')
      return null
    }

    console.debug('[sprite-anim]', 'animation added', name, frames)

    return this.animations.add(name, frames, fps, loop, killOnComplete)
  }

  /**
   * Add animation with director offset frames
   * @param {string} name Animation name
   * @param {int} firstFrame First frame number
   * @param {array} frames Frames relative to first frame
   * @param {boolean} loop Loop the animation
   * @returns {Phaser.Animation}
   */
  addDirectorAnimation (name, firstFrame, frames, loop = false) {
    const [key, frames_offset] = directorAnimation.createAnimation(this.game, this.movie, firstFrame, frames)
    if (!this.key) {
      console.debug('Set sprite key to', key)
      this.loadTexture(key, frames_offset[0])
    } else if (this.key !== key) {
      // Director members for one logical sprite can resolve from a more specific atlas
      // than the initial placeholder frame. Prefer rebasing onto the animation atlas
      // instead of throwing a browser-console error during runtime.
      // Guard: only rebase if the target frame exists in the new atlas
      const targetAtlas = this.game.cache.getImage(key, true)
      if (targetAtlas && targetAtlas.frameData && targetAtlas.frameData.getFrameByName(frames_offset[0])) {
        this.loadTexture(key, frames_offset[0])
        console.debug('[sprite-anim] Rebased sprite to animation atlas', name, key)
      }
    }

    // BUG FIX #1: Changed frame rate from 10 FPS to 12 FPS (Director default)
    return this.animations.add(name, frames_offset, 12, loop)
  }

  /**
   * BUG FIX #9: Set Director sprite channel for z-order management
   * @param {number} channel Director channel number (1-100)
   */
  setDirectorChannel(channel) {
    this.directorChannel = channel
    this.z = channel
  }

  /**
   * BUG FIX #10: Set Director ink/blend mode
   * @param {string} inkMode Director ink mode (copy, matte, transparent, blend, etc.)
   */
  setDirectorInkMode(inkMode) {
    this.directorInkMode = inkMode
    
    // Map Director ink modes to Phaser blend modes
    switch (inkMode.toLowerCase()) {
      case 'transparent':
      case 'blend':
        this.blendMode = PIXI.blendModes.NORMAL
        this.alpha = 0.5
        break
      case 'add':
      case 'additive':
        this.blendMode = PIXI.blendModes.ADD
        break
      case 'multiply':
        this.blendMode = PIXI.blendModes.MULTIPLY
        break
      case 'matte':
      case 'copy':
      default:
        this.blendMode = PIXI.blendModes.NORMAL
        this.alpha = 1.0
        break
    }
  }
}

export default MulleSprite
