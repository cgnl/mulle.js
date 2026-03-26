/**
 * MeterScript.js - UI meter display for fuel, speed, etc.
 * Based on original Lingo: ParentScript 181 - MeterScript.ls
 *
 * Original Lingo properties:
 * - nrOfFrames: number of animation frames for meter
 * - firstFrame: base frame number in cast
 * - SP: sprite channel
 * - speedPerFrame: value per frame step
 * - meter: current meter value (frame offset)
 * - counter: fill animation counter
 */
'use strict'

export default class MeterScript {
  /**
   * Create a new meter
   * Original: on new me, argSP, argMaxVal, argFirstFrame, argNrOfFrames
   *
   * @param {number} argSP - Sprite channel number
   * @param {number} argMaxVal - Maximum value the meter represents
   * @param {string|Object|Array} argFirstFrame - First frame member name or {dirFile, member} tuple
   * @param {number} [argNrOfFrames=17] - Number of frames in meter animation
   * @param {Object} [game] - Phaser game instance (for rendering)
   */
  constructor(argSP, argMaxVal, argFirstFrame, argNrOfFrames, game) {
    // Original: set nrOfFrames to argNrOfFrames
    // Original: if voidp(nrOfFrames) then set nrOfFrames to 17
    this.nrOfFrames = argNrOfFrames !== undefined ? argNrOfFrames : 17

    // Original: set speedPerFrame to tmpMaxSpeed / nrOfFrames
    this.speedPerFrame = argMaxVal / this.nrOfFrames

    // Original: if speedPerFrame = 0 then set speedPerFrame to 1
    if (this.speedPerFrame === 0) {
      this.speedPerFrame = 1
    }

    // Original: set firstFrame to the number of member argFirstFrame
    this.firstFrame = argFirstFrame

    // Original: set SP to argSP
    this.SP = argSP

    // Original: set meter to 0
    this.meter = 0

    // Original: set counter to 0
    this.counter = 0

    // JS-Specific: Create Phaser Sprite if game is provided
    this.sprite = null
    this.frames = null
    this.frameKey = null
    this.dirFile = null
    this.firstFrameNum = null

    if (game && game.add) {
      this.game = game

      const resolved = this._resolveFirstFrame(game, argFirstFrame)
      if (resolved && resolved.dirFile && resolved.dirNum !== null && resolved.dirNum !== undefined) {
        this.dirFile = resolved.dirFile
        this.firstFrameNum = resolved.dirNum

        const built = this._buildFrames(game, resolved)
        if (built && built.frames && built.frames.length) {
          this.frames = built.frames
          this.frameKey = built.key
          this.sprite = game.add.sprite(0, 0, built.key, built.frames[0])
          this.sprite.z = this.SP
          this._applyRegPoint(this.sprite, built.baseFrame)
        }
      }

      if (!this.sprite) {
        // Fallback to previous behavior (best effort)
        try {
          this.sprite = game.add.sprite(0, 0, argFirstFrame, 0)
          this.sprite.z = this.SP
        } catch (e) {
          console.warn('MeterScript: Failed to create sprite for', argFirstFrame, e)
        }
      }
    }
  }

  _resolveFirstFrame(game, argFirstFrame) {
    if (!game || !game.mulle) return null

    let dirFile = null
    let member = null

    if (Array.isArray(argFirstFrame) && argFirstFrame.length >= 2) {
      dirFile = argFirstFrame[0]
      member = argFirstFrame[1]
    } else if (argFirstFrame && typeof argFirstFrame === 'object') {
      if (argFirstFrame.dirFile && argFirstFrame.member !== undefined) {
        dirFile = argFirstFrame.dirFile
        member = argFirstFrame.member
      } else if (argFirstFrame.dirFile && argFirstFrame.num !== undefined) {
        dirFile = argFirstFrame.dirFile
        member = argFirstFrame.num
      }
    }

    if (dirFile && member !== null && member !== undefined) {
      if (game.mulle.getDirectorImage) {
        const baseImage = game.mulle.getDirectorImage(dirFile, member)
        if (baseImage && baseImage.frame) {
          const dirNum = Number(baseImage.frame.dirNum ?? member)
          if (!Number.isNaN(dirNum)) {
            return { dirFile, dirNum, baseImage }
          }
        }
      }
      if (typeof member === 'number') {
        return { dirFile, dirNum: member, baseImage: null }
      }
      return null
    }

    if (typeof argFirstFrame === 'string' && game.mulle.findDirectorMember) {
      const frame = game.mulle.findDirectorMember(argFirstFrame)
      if (frame && frame.dirFile && frame.dirNum !== undefined && frame.dirNum !== null) {
        return { dirFile: frame.dirFile, dirNum: Number(frame.dirNum), baseImage: null }
      }
    }

    return null
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

  _buildFrames(game, resolved) {
    if (!game || !game.mulle || !game.mulle.getDirectorImage) return null

    const baseImage = resolved.baseImage || game.mulle.getDirectorImage(resolved.dirFile, resolved.dirNum)
    if (!baseImage || !baseImage.frame) return null

    const baseFrame = baseImage.frame
    const baseSize = this._getFrameSize(baseFrame)
    const frames = [baseFrame.name]

    const startNum = Number(resolved.dirNum)
    if (Number.isNaN(startNum)) {
      return { key: baseImage.key, frames, baseFrame }
    }

    for (let i = 1; i <= this.nrOfFrames; i++) {
      const img = game.mulle.getDirectorImage(resolved.dirFile, startNum + i)
      if (!img || !img.frame) break

      if (baseSize) {
        const nextSize = this._getFrameSize(img.frame)
        if (!nextSize || nextSize.width !== baseSize.width || nextSize.height !== baseSize.height) {
          break
        }
      }

      frames.push(img.frame.name)
    }

    return { key: baseImage.key, frames, baseFrame }
  }

  _applyRegPoint(sprite, frame) {
    if (!sprite || !frame || !frame.regpoint || !sprite.pivot || typeof sprite.pivot.set !== 'function') {
      return
    }
    sprite.pivot.set(frame.regpoint.x, frame.regpoint.y)
  }

  _setSpriteFrame(frameIndex) {
    if (!this.sprite) return

    if (this.frames && this.frames.length) {
      const idx = Math.max(0, Math.min(frameIndex, this.frames.length - 1))
      const frameName = this.frames[idx]
      if (this.sprite.frameName !== undefined) {
        this.sprite.frameName = frameName
      } else {
        this.sprite.frame = frameName
      }
      return
    }

    this.sprite.frame = frameIndex
  }

  /**
   * Clean up meter
   * Original: on kill me - return 0
   *
   * @returns {null}
   */
  kill() {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
    return null
  }

  /**
   * Update max value and recalculate speedPerFrame
   * Original: on setMax me, argMaxVal
   *
   * @param {number} argMaxVal - New maximum value
   */
  setMax(argMaxVal) {
    // Original: set speedPerFrame to argMaxVal / nrOfFrames
    this.speedPerFrame = argMaxVal / this.nrOfFrames

    // Original: if speedPerFrame = 0 then set speedPerFrame to 1
    if (this.speedPerFrame === 0) {
      this.speedPerFrame = 1
    }
  }

  /**
   * Display meter value
   * Original: on show me, argSpeed
   *
   * @param {number} argSpeed - Current value to display
   */
  show(argSpeed) {
    // Original: set meter to argSpeed / speedPerFrame
    this.meter = Math.floor(argSpeed / this.speedPerFrame)

    // Original: if meter > nrOfFrames then set meter to nrOfFrames
    if (this.meter > this.nrOfFrames) {
      this.meter = this.nrOfFrames
    }

    // Original: set the member of sprite SP to member (firstFrame + meter)
    this._setSpriteFrame(this.meter)
  }

  /**
   * Start fill animation
   * Original: on fill me
   */
  fill() {
    // Original: set counter to 0
    this.counter = 0
  }

  /**
   * Animation loop for fill effect
   * Original: on loop me
   */
  loop() {
    // Original: if (counter mod 2) = 0 then
    //   if meter < nrOfFrames then set meter to meter + 1
    if (this.counter % 2 === 0) {
      if (this.meter < this.nrOfFrames) {
        this.meter = this.meter + 1
        // Original: set the member of sprite SP to member (firstFrame + meter)
        this._setSpriteFrame(this.meter)
      }
    }

    // Original: set counter to counter + 1
    this.counter = this.counter + 1
  }

  /**
   * Get current frame index for rendering
   * Not in original Lingo - helper for JS renderer
   *
   * @returns {number} Frame offset (0 to nrOfFrames)
   */
  getFrame() {
    if (this.frames && this.frames.length) {
      const idx = Math.max(0, Math.min(this.meter, this.frames.length - 1))
      return this.frames[idx]
    }
    return this.meter
  }
}
