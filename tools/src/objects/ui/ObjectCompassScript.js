/**
 * ObjectCompassScript.js - Compass display for navigation
 * Based on original Lingo: ParentScript 48 - ObjectCompassScript.ls
 *
 * Shows a compass that points toward a target object.
 * Consists of three sprite layers:
 * - Bottom: rotates with boat direction
 * - Round: shows relative direction to target
 * - Needle: static needle indicator
 *
 * Original Lingo properties:
 * - child: target object
 * - insideInner/insideOuter: proximity flags
 * - Showing: visibility
 * - SP1, SP2, SP3: sprite channels
 * - headDirection: direction to target
 */
'use strict'

import { HUD_ASSETS } from '../boat/BoatConstants'

const COMPASS_DIR_FILE = 'boten_05.DXR'

// Lingo audio: ObjectCompassScript.ls init
// 05d057v0 — spoken when object compass is activated (compass equipped)
// 05d005v0 — spoken when player has no compass equipped
const SOUND_COMPASS_ACTIVATED = '05d057v0'
const SOUND_NO_COMPASS = '05d005v0'

export default class ObjectCompassScript {
  /**
   * Create compass
   * Original: on new me, theChild
   *
   * @param {object} child - Target object with SPOver and myLoc
   * @param {Object} [game] - Phaser game instance
   */
  constructor(child, game) {
    // Original: set child to theChild
    this.child = child

    // Original: set insideInner to 0
    this.insideInner = false

    // Original: set insideOuter to 0
    this.insideOuter = false

    // Sprite channels (set in init)
    this.SP1 = 0
    this.SP2 = 0
    this.SP3 = 0

    // Whether compass is displayed
    this.Showing = false

    // Direction to target
    this.headDirection = 1

    // JS-Specific: Sprites
    this.sprites = {
      bottom: null,
      round: null,
      needle: null
    }

    this.frames = {
      bottom: null,
      round: null,
      needle: null
    }

    if (game && game.add) {
      this.game = game
    }
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    // Original: set child to 0
    this.child = null

    // Destroy sprites
    if (this.sprites.bottom) { this.sprites.bottom.destroy(); this.sprites.bottom = null }
    if (this.sprites.round) { this.sprites.round.destroy(); this.sprites.round = null }
    if (this.sprites.needle) { this.sprites.needle.destroy(); this.sprites.needle = null }

    return null
  }

  /**
   * Initialize compass display
   * Original: on init me
   *
   * @param {boolean} hasCompass - Whether player has compass item
   * @param {object} boatLoc - Current boat position {x, y}
   * @param {number} enteredObject - ID of entered map object
   * @param {number} [startSP] - Starting sprite channel (optional override)
   */
  init(hasCompass, boatLoc, enteredObject, startSP) {
    // Original: set SP1 to the SPOver of child
    // In JS, we might use provided startSP or child.SPOver
    this.SP1 = (startSP !== undefined) ? startSP : (this.child ? this.child.SPOver : 0)
    this.SP2 = this.SP1 + 1
    this.SP3 = this.SP1 + 2

    // Original: if not getProperty(boat, #Compass) > 0 then set Showing to 0
    this.Showing = hasCompass

    // Lingo: play compass feedback sound
    if (this.game && this.game.mulle && typeof this.game.mulle.playAudio === 'function') {
      if (this.Showing) {
        this.game.mulle.playAudio(SOUND_COMPASS_ACTIVATED)
      } else {
        this.game.mulle.playAudio(SOUND_NO_COMPASS)
      }
    }

    if (this.Showing) {
      // Calculate direction to target
      // Original: set headDirection to calcDirection(drivingHandlers, boatLoc, the myLoc of child)
      if (this.child && this.child.myLoc) {
        this.headDirection = this._calcDirection(boatLoc, this.child.myLoc)
      }

      // Original: if getEnteredObject = 26 then headDirection += 8
      if (enteredObject === 26) {
        this.headDirection = this._correctDirection(this.headDirection + 8)
      }

      // Create Sprites if game exists
      if (this.game && !this.sprites.bottom) {
        try {
          // Bottom layer frames (CompassBottom + 16 directions)
          const bottomFrames = this._buildFrameSequence(HUD_ASSETS.COMPASS_BOTTOM, 16)
          if (bottomFrames) {
            this.frames.bottom = bottomFrames.frames
            this.sprites.bottom = this._createSprite(320, 240, bottomFrames.key, bottomFrames.frames[0], bottomFrames.baseFrame)
            if (this.sprites.bottom) this.sprites.bottom.z = this.SP1
          }

          // Round layer frames (CompassRound + 16 directions)
          const roundFrames = this._buildFrameSequence(HUD_ASSETS.COMPASS_ROUND, 16)
          if (roundFrames) {
            this.frames.round = roundFrames.frames
            this.sprites.round = this._createSprite(320, 240, roundFrames.key, roundFrames.frames[0], roundFrames.baseFrame)
            if (this.sprites.round) this.sprites.round.z = this.SP2
          }

          // Needle layer (static)
          const needleFrame = this._resolveFrame(HUD_ASSETS.COMPASS_NEEDLE)
          if (needleFrame) {
            this.frames.needle = [needleFrame.frame.name]
            this.sprites.needle = this._createSprite(320, 240, needleFrame.key, needleFrame.frame.name, needleFrame.frame)
            if (this.sprites.needle) this.sprites.needle.z = this.SP3
          }

          // Fallback: create sprites even if director frames were unavailable (tests or missing assets)
          if (!this.sprites.bottom) {
            this.sprites.bottom = this._createFallbackSprite(HUD_ASSETS.COMPASS_BOTTOM, this.SP1)
          }
          if (!this.sprites.round) {
            this.sprites.round = this._createFallbackSprite(HUD_ASSETS.COMPASS_ROUND, this.SP2)
          }
          if (!this.sprites.needle) {
            this.sprites.needle = this._createFallbackSprite(HUD_ASSETS.COMPASS_NEEDLE, this.SP3)
          }
        } catch (e) {
          console.warn('ObjectCompassScript: Failed to create sprites', e)
        }
      }
    } else {
      // Hide/Destroy if not showing
      if (this.sprites.bottom) this.sprites.bottom.visible = false
      if (this.sprites.round) this.sprites.round.visible = false
      if (this.sprites.needle) this.sprites.needle.visible = false
    }
  }

  /**
   * Update compass display
   * Original: on step me, boatLoc
   *
   * @param {object} boatLoc - Current boat position
   * @param {number} boatDirection - Current boat direction (1-16)
   * @returns {object|null} Frame info or null if not showing
   */
  step(boatLoc, boatDirection) {
    if (!this.Showing) {
      return null
    }

    // Original: set the member of sprite SP1 to member (firstFrame1 + tmpDirection)
    const bottomFrame = boatDirection

    // Original: set the member of sprite SP2 to member (firstFrame2 + correctDirection(tmpDirection - headDirection))
    const relativeDirection = this._correctDirection(boatDirection - this.headDirection)
    const roundFrame = relativeDirection

    // Update Phaser Sprites
    if (this.sprites.bottom) {
      this.sprites.bottom.visible = true
      this._setFrameByDirection(this.sprites.bottom, this.frames.bottom, bottomFrame)
    }
    if (this.sprites.round) {
      this.sprites.round.visible = true
      this._setFrameByDirection(this.sprites.round, this.frames.round, roundFrame)
    }
    if (this.sprites.needle) {
      this.sprites.needle.visible = true
      this._setFrameByDirection(this.sprites.needle, this.frames.needle, 1)
    }

    return {
      SP1: this.SP1,
      SP2: this.SP2,
      SP3: this.SP3,
      bottomFrame,
      roundFrame,
      needleFrame: 1
    }
  }

  _resolveFrame(memberName) {
    if (!this.game || !this.game.mulle || !this.game.mulle.getDirectorImage) return null
    return this.game.mulle.getDirectorImage(COMPASS_DIR_FILE, memberName)
  }

  _getFrameSize(frame) {
    if (!frame) return null
    const width = (typeof frame.width === 'number')
      ? frame.width
      : (frame.frame && typeof frame.frame.w === 'number' ? frame.frame.w : null)
    const height = (typeof frame.height === 'number')
      ? frame.height
      : (frame.frame && typeof frame.frame.h === 'number' ? frame.frame.h : null)
    if (typeof width === 'number' && typeof height === 'number') {
      return { width, height }
    }
    return null
  }

  _buildFrameSequence(memberName, count) {
    const base = this._resolveFrame(memberName)
    if (!base || !base.frame) return null

    const baseFrame = base.frame
    const baseSize = this._getFrameSize(baseFrame)
    const frames = [baseFrame.name]
    const dirNum = Number(baseFrame.dirNum)
    if (Number.isNaN(dirNum)) {
      return { key: base.key, frames, baseFrame }
    }

    for (let i = 1; i < count; i++) {
      const img = this.game.mulle.getDirectorImage(COMPASS_DIR_FILE, dirNum + i)
      if (!img || !img.frame) break

      if (baseSize) {
        const nextSize = this._getFrameSize(img.frame)
        if (!nextSize || nextSize.width !== baseSize.width || nextSize.height !== baseSize.height) {
          break
        }
      }

      frames.push(img.frame.name)
    }

    return { key: base.key, frames, baseFrame }
  }

  _createSprite(x, y, key, frameName, frame) {
    if (!this.game || !this.game.add) return null
    const sprite = this.game.add.sprite(x, y, key, frameName)
    if (frame && frame.regpoint && sprite.pivot && typeof sprite.pivot.set === 'function') {
      sprite.pivot.set(frame.regpoint.x, frame.regpoint.y)
    }
    return sprite
  }

  _createFallbackSprite(key, z) {
    if (!this.game || !this.game.add) return null
    const sprite = this.game.add.sprite(320, 240, key, 0)
    sprite.z = z
    return sprite
  }

  _setFrameByDirection(sprite, frames, dir) {
    if (!sprite) return
    if (!frames || frames.length === 0) {
      sprite.frame = dir
      return
    }
    const idx = Math.max(1, Math.min(dir, frames.length)) - 1
    const frameName = frames[idx]
    sprite.frame = frameName
  }

  /**
   * Calculate direction from one point to another
   * Simplified version of DrivingHandlers.calcDirection
   * @private
   */
  _calcDirection(from, to) {
    const diffX = to.x - from.x
    const diffY = from.y - to.y // Inverted for screen coords

    const safeY = diffY === 0 ? 0.1 : diffY
    let angle = Math.atan(diffX / safeY)

    // Adjust for quadrant
    if (diffX > 0) {
      if (diffY <= 0) angle += Math.PI
    } else {
      if (diffY > 0) angle += 2 * Math.PI
      else angle += Math.PI
    }

    // Convert to direction (1-16)
    let dir = Math.round((angle / Math.PI) * 8)
    if (dir === 0) dir = 16

    return dir
  }

  /**
   * Normalize direction to 1-16 range
   * @private
   */
  _correctDirection(dir) {
    let d = dir % 16
    if (d <= 0) d += 16
    return d
  }
}
