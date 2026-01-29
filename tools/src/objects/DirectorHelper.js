/* global Phaser */

class DirectorHelper {
  /**
   *
   * @param {MulleGame} game
   */
  constructor (game) {
    this.game = game
    this.name_cache = {}
    this.movie_cache = {}
  }

  /**
   * Get key and frame for a director image
   * @param {Phaser.Game} game
   * @param {string} movie
   * @param {int|string} member
   * @returns string[] Array with sprite sheet key and frame number
   * @deprecated Use getImageByCastNumber or getNamedImage
   */
  static getDirectorImage (game, movie, member) {
    // noinspection JSUnresolvedVariable
    const { key, frame } = game.mulle.getDirectorImage(movie, member)
    return [key, frame]
  }

  /**
   * Get frame from sprite sheet
   * @param {string} spriteSheetKey
   * @param {string|int} castNumber Cast number
   * @returns {Phaser.Frame}
   */
  static getSpriteSheetImage(spriteSheetKey, castNumber) {
    const spriteSheet = game.cache.getImage(spriteSheetKey, true)
    for (const frame of spriteSheet.frameData.getFrames()) {
      if (frame.dirNum === castNumber) {
        return frame
      }
    }
    console.error('No image with cast number', castNumber)
  }

  /**
   * Get sprite by director movie and cast number
   * @param {string} movie Director movie
   * @param {string} member Director cast member
   * @returns string[] Array with sprite sheet key and frame number
   */
  getImageByCastNumber (movie, member) {
    if(this.movie_cache[movie] && this.movie_cache[movie][member]) {
      return this.movie_cache[movie][member]
    }

    var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE)

    for (const k in keys) {
      var spriteSheet = game.cache.getImage(keys[k], true)
      var frames = spriteSheet.frameData.getFrames()

      for (const f in frames) {
        const frame = frames[f]

        if (frame.dirFile === movie && (frame.dirNum === member)) {
          console.log('match', frame)
          this.movie_cache[frame.dirFile][frame.dirNum] = [spriteSheet.key, frames[f].name]
          return [spriteSheet.key, frames[f].name]
        }
      }
    }
    console.error('Unable to find image', name)
    return [false, false]
  }

  /**
   * Get sprite by director cast name
   * @param {string} name Director cast name
   * @returns string[] Array with sprite sheet key and frame number
   */
  getNamedImage (name) {
    if(this.name_cache[name])
      return this.name_cache[name]

    var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE)

    for (var k in keys) {
      var img = game.cache.getImage(keys[k], true)

      var frames = img.frameData.getFrames()

      for (var f in frames) {
        if (frames[f].dirName === name) {
          console.log('match', frames[f])
          this.name_cache[name] = [img.key, frames[f].name]
          return [img.key, frames[f].name]
        }
      }
    }
    console.error('Unable to find image', name)
    return [false, false]
  }

  /**
   * Create a Phaser.Button with director texture and position
   * @param {Phaser.Game} game
   * @param {int|null} x X, set to null to use director position
   * @param {int|null} y Y, set to null to use director position
   * @param {Function} callback
   * @param callbackContext Callback context
   * @param {string} movie Director movie
   * @param {int|string} overFrameDir Director cast number or name for hover texture
   * @param {int|string} outFrameDir Director cast number or name for standard texture
   * @param {boolean} center Treat given coordinates as center and convert to top left
   * @return {Phaser.Button}
   */
  static button (game, x, y, callback, callbackContext, movie, overFrameDir, outFrameDir, center = false) {
    let overKey, outKey, key, overFrame, outFrame
    if (overFrameDir) {
      [overKey, overFrame] = this.getDirectorImage(game, movie, overFrameDir)
      key = overKey
    } else {
      overKey = null
    }
    if (outFrameDir) {
      [outKey, outFrame] = this.getDirectorImage(game, movie, outFrameDir)
      key = outKey
    } else {
      outKey = null
      outFrame = { name: undefined }
    }

    if ((overKey && outKey) && (overKey !== outKey)) {
      throw Error('Frames are from different sprite sheets')
    }

    if (x === null && y === null && outFrame) {
      x = 320 - outFrame.regpoint.x
      y = 240 - outFrame.regpoint.y
    }

    if (center) {
      [x, y] = this.CenterToOuter(x, y, outFrame.height, outFrame.width)
    }

    return new Phaser.Button(game, x, y, key, callback, callbackContext, overFrame.name, outFrame.name, null, null)
  }

  static rectangleButton (game, x, y, h, w, callback, movie, overFrame, outFrame) {
    const button = this.button(game, x, y, callback, movie, overFrame, outFrame)
    button.height = h
    button.width = w

    return button
  }

  /**
   * Create a Phaser.Sprite with director texture and position
   * @param {Phaser.Game} game
   * @param {int|null} x X, set to null to use director position
   * @param {int|null} y Y, set to null to use director position
   * @param {string} movie Director movie
   * @param {int|string} member Director cast number or name
   * @param {boolean} center Treat given coordinates as center and convert to top left
   * @param {boolean} use_regpoint Use Director regpoint as Phaser pivot point
   * @return {Phaser.Sprite}
   */
  static sprite (game, x, y, movie, member, center = false, use_regpoint = true) {
    const [key, frame] = this.getDirectorImage(game, movie, member)
    if (x === null && y === null) {
      x = 320 - frame.regpoint.x
      y = 240 - frame.regpoint.y
    }

    if (center) {
      [x, y] = this.CenterToOuter(x, y, frame.height, frame.width)
    }

    const sprite = new Phaser.Sprite(game, x, y, key, frame.name)
    if (use_regpoint)
      sprite.pivot = frame.regpoint
    return sprite
  }

  /**
   * Convert center coordinates to top left coordinates
   * @param {int} x Center X
   * @param {int} y Center Y
   * @param {int} h Height
   * @param {int} w Width
   * @return {[int, int]} Top left coordinates
   */
  static CenterToOuter (x, y, h, w) {
    return [x - w / 2, y - h / 2]
  }
}

export default DirectorHelper
