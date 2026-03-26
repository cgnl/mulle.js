import DirectorHelper from '../objects/DirectorHelper'

class directorAnimation {
  /**
   *
   * @param {array} frames
   * @param {int} offset Offset number
   * @return {[]}
   */
  static offset (frames, offset) {
    const framesOffset = []

    for (const frame of frames) {
      framesOffset.push(frame + offset)
    }
    return framesOffset
  }

  /**
   * Resolve a list of director frame numbers
   * @param {MulleGame|Phaser.Game} game
   * @param {string} movie Director movie
   * @param {array} frames List of frames relative to first frame
   * @return {array} Resolved frames
   */
  static resolveDirectorFrames (game, movie, frames) {
    if (!movie) {
      console.error('Movie not set')
      return []
    }

    const DirectorFrames = []
    const DirectorFramesObjects = []
    let key, frame
    for (const frameName of frames) {
      if (frameName === 'Dummy')
        continue
      [key, frame] = DirectorHelper.getDirectorImage(game, movie, frameName)
      if (!frame || !frame.name) {
        console.warn('[directorAnimation] Unable to resolve frame', movie, frameName)
        continue
      }
      DirectorFrames.push(frame.name)
      DirectorFramesObjects.push(frame)
    }

    return [key, DirectorFrames, DirectorFramesObjects]
  }

  /**
   * Offset and resolve frames from a director animation
   * @param {MulleGame|Phaser.Game} game
   * @param {string} movie Move file name
   * @param {int} firstFrame First frame number
   * @param {array} frames Frames relative to first frame
   * @return {array} Resolved frames
   */
  static createAnimation (game, movie, firstFrame, frames) {
    const offset_frames = directorAnimation.offset(frames, firstFrame - 1)
    return this.resolveDirectorFrames(game, movie, offset_frames)
  }

  /**
   * Add animation to existing sprite
   * @param {Phaser.Sprite} sprite
   * @param {string} name The unique (within this Sprite) name for the animation, i.e. "run", "fire", "walk".
   * @param {int[]} frames List of frames, relative to first frame
   * @param {number} firstFrame Cast number of the first frame in the animation
   * @param {boolean} loop Whether or not the animation is looped or just plays once.
   * @param {int} frameRate The speed at which the animation should play. The speed is given in frames per second.
   */
  // BUG FIX #3: Changed default frame rate from implicit 12 to explicit 12 FPS
  // BUG FIX #2.10: Default Frame Rate Audit - Confirmed 12 FPS is correct
  // Director's default tempo is 12 FPS (confirmed from original .DXR metadata)
  // This matches Macromedia Director 7's default playback speed
  // Lower rates (5 FPS) used intentionally for idle/static animations
  // Higher rates (15+ FPS) used intentionally for special effects
  static addAnimation (sprite, name, frames, firstFrame, loop = false, frameRate = 12) {
    const offset_frames = directorAnimation.offset(frames, firstFrame - 1)
    let resolved_frames = []

    for (const castNum of offset_frames) {
      const frame = DirectorHelper.getSpriteSheetImage(sprite.key, castNum)
      if (!frame) {
        console.warn('[directorAnimation] Unable to find image in', sprite.key, 'cast', castNum)
        continue
      }
      resolved_frames.push(frame.name)
    }

    return sprite.animations.add(name, resolved_frames, frameRate, loop)
  }
}

export default directorAnimation