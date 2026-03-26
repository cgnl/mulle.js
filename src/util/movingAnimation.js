import DirectorHelper from '../objects/DirectorHelper'
import directorAnimation from './directorAnimation'

/**
 * https://gist.github.com/eddieajau/5f3e289967de60cf7bf9
 * @param arr
 * @param column
 * @returns {*}
 */
function extractColumn (arr, column) {
  return arr.map(x => x[column])
}

class movingAnimation {
  /**
   * Create moving animation
   * @param {Phaser.Game} game
   * @param {string} movie Director movie
   * @param {array} frames
   * @param {int} fps
   * @param {int} offsetX
   * @param {int} offsetY
   * @param {boolean} destroy Destroy sprite after animation
   * @param {boolean} director_pos Use position without conversion
   */
  constructor (game, movie, frames, fps = 12, offsetX = 0, offsetY = 0, destroy = true, director_pos = true) {
    this.game = game
    this.movie = movie
    this.frames = frames
    this.offsetX = offsetX
    this.offsetY = offsetY
    this.destroy = destroy
    this.director_pos = director_pos

    const [spriteSheet, spriteFrames, spriteFrameObjects] = this.resolveCastToSprites()
    this.spriteSheet = spriteSheet
    this.spriteFrames = spriteFrames
    this.spriteFrameObjects = spriteFrameObjects
    this.createSprite()

    this.frameCount = frames.length
    this.delay = 1000 / fps
  }

  /**
   * Resolve director cast numbers to sprite numbers
   * @returns {Array}
   */
  resolveCastToSprites () {
    const casts = extractColumn(this.frames, 'cast')
    return directorAnimation.resolveDirectorFrames(game, this.movie, casts)
  }

  /**
   * Get position for the frame with the correct offset
   * @param {int} frameNum Frame number
   * @returns {number[]} X and Y coordinates
   */
  getPosition (frameNum) {
    let x
    let y

    if (this.offsetX === 0 && this.offsetY === 0) {
      [x, y] = DirectorHelper.CenterToOuter(this.frames[frameNum].x, this.frames[frameNum].y, this.frames[frameNum].h, this.frames[frameNum].w)
    } else {
      x = this.frames[frameNum].x - this.offsetX
      y = this.frames[frameNum].y - this.offsetY
    }

    return [x, y]
  }

  createSprite () {
    if (!this.director_pos) {
      const [x, y] = this.getPosition(0)
      this.sprite = new Phaser.Sprite(this.game, x, y, this.spriteSheet, this.spriteFrameObjects[0].name)
    } else {
      this.sprite = new Phaser.Sprite(this.game, null, null, this.spriteSheet)
      this.setFrame(0)
    }
    this.currentSprite = this.spriteFrames[0]
    this.currentFrame = 0
  }

  /**
   * Start animation
   * @param {function} callback - The callback that will be called when the blink ends.
   * @param {object} callbackContext - The context in which the callback will be called.
   */
  play (callback = undefined, callbackContext = this) {
    this.setNextFrame()
    this.callback = callback
    this.callbackContext = callbackContext
  }

  /**
   * Set the frame to show
   * @param {int} frameNum
   */
  setFrame (frameNum) {
    this.currentFrame = frameNum
    if (!this.director_pos) {
      const [x, y] = this.getPosition(frameNum)
      this.sprite.x = x
      this.sprite.y = y
    } else {
      const frame = this.spriteFrameObjects[frameNum]
      this.sprite.x = this.frames[frameNum].x
      this.sprite.y = this.frames[frameNum].y
      this.sprite.pivot = frame.regpoint
    }

    if (this.spriteFrames[frameNum] !== this.currentSprite) {
      console.log(`Set texture to ${this.spriteFrames[frameNum]} at frame ${frameNum}`)
      this.sprite.loadTexture(this.spriteSheet, this.spriteFrames[frameNum])
      this.currentSprite = this.spriteFrames[frameNum]
    }
  }

  setNextFrame () {
    this.setFrame(this.currentFrame + 1)
    if (this.currentFrame + 1 < this.frameCount) {
      game.time.events.add(this.delay, this.setNextFrame, this)
    } else {
      if (this.destroy)
        this.sprite.destroy()

      if (this.callback !== undefined)
        this.callback.apply(this.callbackContext)
    }
  }

  static offset (x, y) {
    return [x - 320, y - 240]
  }
}

export default movingAnimation
