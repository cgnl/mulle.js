class ObjectAnimation {
  /**
   * Helpers for object animations
   * @param {MulleMapObject} sprite MapObject class instance
   * @param {string} movie Director movie
   */
  constructor (sprite, movie = 'CDDATA.CXT') {
    this.sprite = sprite
    // noinspection JSValidateTypes
    /**
     * @type {MulleGame}
     */
    this.game = sprite.game
    this.movie = movie
  }

  /**
   * Check if the object has frames
   * @returns {boolean}
   */
  hasFrames() {
    return (typeof this.sprite.def.FrameList === 'object' && this.sprite.FrameList.length > 0)
  }

  /**
   * Check if the FrameList has named animations
   * @returns {boolean}
   */
  hasNamedAnimations() {
    if (this.hasDirections()) {
      return !Array.isArray(this.sprite.FrameList[1])
    } else {
      const keys = Object.keys(this.sprite.FrameList)
      return typeof (this.sprite.FrameList[keys[0]]) === "object";
    }
  }

  /**
   * Check if the FrameList has directions
   * @return {boolean}
   */
  hasDirections() {
    return this.sprite.FrameList[1] !== undefined
  }

  /**
   * Get frames for specified direction and animation
   * @param {int} direction Direction
   * @param {string} animation Animation name
   * @return {Array}
   */
  getFrames (animation, direction = 1) {
    let frames = this.sprite.FrameList

    if(this.hasDirections()) {
      if (frames[direction] === undefined) {
        console.error(`Invalid direction ${direction} for MapObject ${this.sprite.id}`)
        return []
      }
      if(!this.hasNamedAnimations())
        return frames[direction]
      else
        frames = frames[direction]
    }

    if(this.hasNamedAnimations()) {
      if (frames[animation] === undefined) {
        console.error(`Invalid animation ${animation} for MapObject ${this.sprite.id}`)
        return []
      }

      return frames[animation]
    }
    throw Error('No frames found for animation ' + animation + ' direction ' + direction + 'in map object ' + this.sprite.id)
  }

  /**
   *
   * @param frames
   * @returns {string[]}
   */
  resolveDirectorFrames (frames) {
    console.log('resolve frames', frames)
    const DirectorFrames = []
    let key, frame
    for (const frameName of frames) {
      if (frameName === 'Dummy')
        continue
      //
      if(isNaN(+frameName)) {
        [key, frame] = this.game.director.getNamedImage(frameName)
      }
      else
        [key, frame] = this.game.director.getImageByCastNumber(this.movie, frameName)

      if (!frame)
        throw Error('Unable to resolve frame ' + frameName)

      console.log('Frame matched as', key, frame)
      DirectorFrames.push(frame)
    }

    if (this.sprite.key !== key)
      this.sprite.loadTexture(key)
    /*console.debug('Set sprite key to', key)
    this.sprite.key = key*/
    console.log('Frames resolved to', DirectorFrames)

    return DirectorFrames
  }

  /**
   * Adds a new animation under the given key. Optionally set the frames, frame rate and loop. Animations added in this way are played back with the play function.
   * @param {string} name The unique (within this Sprite) name for the animation, i.e. "run", "fire", "walk".
   * @param {string} frameListName The name of the frame list to use
   * @param {int} direction Direction of the object
   * @param {int} frameRate The speed at which the animation should play. The speed is given in frames per second. - Default: 60
   * @param {boolean} loop Whether or not the animation is looped or just plays once.
   * @param {boolean} reverse Play animation in reverse to return to initial position
   * @returns {Phaser.Animation} The Animation object that was created.
   */
  add (name, frameListName, direction = 1, frameRate = 12, loop = false, reverse = false) {
    let frames = this.getFrames(frameListName, direction)
    console.log('Director frames', frames)
    frames = this.resolveDirectorFrames(frames)

    if (reverse) {
      const framesForward = frames
      const framesReverse = [...frames].reverse()
      frames = framesReverse.concat(framesForward)
    }

    console.log('Frames', frames)
    return this.sprite.animations.add(name, frames, frameRate, loop)
  }

  /**
   * Use a static image as the texture for the sprite
   * @param {string} frameListName The name of the frame list to use
   * @param {int} direction Direction of the object
   */
  static (frameListName, direction = 1) {
    let frames = this.getFrames(frameListName, direction)
    if (frames[0] === 'Dummy')
      return

    frames = this.resolveDirectorFrames(frames)
    /*console.log('Frames static', frames)
    console.log('Frames static', frames[0])
    console.log('key', this.sprite.key)*/
    this.sprite.loadTexture(this.sprite.key, frames[0])
  }

  /**
   * Play audio by key
   * @param {int} key
   * @param {function} onStop
   */
  playAudio (key, onStop = null) {
    if (!this.sprite.Sounds[key]) {
      console.error(`No sound with key ${key}`)
      return
    }
    return this.game.mulle.playAudio(this.sprite.Sounds[key], onStop)
  }
}

export default ObjectAnimation
