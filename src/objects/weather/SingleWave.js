/**
 * SingleWave.js - Individual wave object
 * @module objects/weather/SingleWave
 * 
 * Direct port of ParentScript 23 - SingleWave.ls from original Lingo
 * 
 * Properties from original:
 * - SP: sprite channel
 * - counter: animation frame counter
 * - firstFrame: base frame number
 * - frameList: animation frame sequence (ramp up, hold, ramp down)
 * - listLen: length of frameList
 * - vel: velocity point
 * - reportObject: parent Waves object
 * - active: whether wave is active
 * - loc: position (scaled by 10 for precision)
 * - waveCircle: radius of effect (70 pixels)
 * - amplitude: wave strength
 */
'use strict'

class SingleWave {
  /**
   * Create SingleWave instance
   * @param {Object} reportObject - Parent Waves object with Stopped method
   * @param {number} theSP - Sprite channel
   * @param {Object} theLoc - Initial location {x, y}
   * @param {Object} argVelPoint - Velocity {x, y}
   * @param {number} argDirection - Direction (1-16)
   * @param {number} argAmplitude - Wave amplitude
   * @param {Object} [game] - Phaser game instance
   */
  constructor(reportObject, theSP, theLoc, argVelPoint, argDirection, argAmplitude, game) {
    this.reportObject = reportObject
    this.SP = theSP
    this.amplitude = argAmplitude
    this.direction = argDirection

    // Original: if amplitude > 60 then firstFrame = WavePic1 else WavePic2
    // We track this for sprite selection
    this.useHighAmplitudeSprite = argAmplitude > 60

    // Original: set firstFrame to -1 + the number of member "WavePic1" + (4 * (argDirection - 1))
    // We'll store the base and calculate actual frame later
    this.firstFrame = 0 // Will be set by renderer

    // Build frame list
    // Original: tmpDur = 30, tmpMax = 4
    const tmpDur = 30
    const tmpMax = 4
    this.frameList = []

    // Original pattern: repeat with m = 1 to 2:
    for (let m = 1; m <= 2; m++) {
      // Ramp up: 1 to tmpDur-1
      for (let N = 1; N <= tmpDur - 1; N++) {
        // Original Lingo line 17: add(frameList, 1 + ((tmpMax - 1) * N / tmpDur))
        // Lingo keeps float values (no floor), important for smooth ramp
        this.frameList.push(1 + (tmpMax - 1) * N / tmpDur)
      }
      // Hold at max: 1 to tmpDur
      for (let N = 1; N <= tmpDur; N++) {
        this.frameList.push(tmpMax)
      }
      // Ramp down: 2 to tmpDur
      for (let N = 2; N <= tmpDur; N++) {
        // Original Lingo line 23: add(frameList, 1 + ((tmpMax - 1) * (tmpDur - N) / tmpDur))
        this.frameList.push(1 + (tmpMax - 1) * (tmpDur - N) / tmpDur)
      }
    }

    // Original: set listLen to count(frameList)
    this.listLen = this.frameList.length

    // Original: set counter to random(listLen - 1)
    this.counter = Math.floor(Math.random() * (this.listLen - 1)) + 1

    // Original: set vel to argVelPoint
    this.vel = { x: argVelPoint.x, y: argVelPoint.y }

    // Original: set loc to theLoc * 10
    this.loc = { x: theLoc.x * 10, y: theLoc.y * 10 }

    // Original: set active to 1
    this.active = true

    // Original: set waveCircle to 70
    this.waveCircle = 70

    // JS Visuals
    this.sprite = null
    if (game && game.add) {
      this.game = game
      // Select asset
      const key = this.useHighAmplitudeSprite ? 'WavePic1' : 'WavePic2'
      try {
        // Create sprite
        this.sprite = game.add.sprite(0, 0, key, 0)
        this.sprite.z = this.SP
        this.sprite.anchor.set(0.5) // Assume center anchor for waves
      } catch (e) {
        console.warn('SingleWave: Failed to create sprite', key, e)
      }
    }

    // Run first loop
    this.loop()
  }

  /**
   * Kill wave
   * Original: on kill me
   */
  kill() {
    this.active = false
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
    return null
  }

  /**
   * Check wave effect at a point
   * Original: on check me, thePoint
   * @param {Object} thePoint - Point to check {x, y}
   * @returns {number} Wave force at point
   */
  check(thePoint) {
    // Original: set tmpDiff to thePoint - (loc / 10)
    const tmpDiff = {
      x: thePoint.x - (this.loc.x / 10),
      y: thePoint.y - (this.loc.y / 10)
    }

    // Original: set hypo to sqrt(tmpDiff.x^2 + tmpDiff.y^2)
    const hypo = Math.sqrt(tmpDiff.x * tmpDiff.x + tmpDiff.y * tmpDiff.y)

    // Original: set factor to waveCircle - hypo
    //           if factor < 0 then set factor to 0
    let factor = this.waveCircle - hypo
    if (factor < 0) {
      factor = 0
    }

    // Original: return getAt(frameList, counter) * factor * amplitude * 2
    const frameValue = this.frameList[this.counter - 1] || 1
    return frameValue * factor * this.amplitude * 2
  }

  /**
   * Update wave each tick
   * Original: on loop me
   */
  loop() {
    if (!this.active) {
      return
    }

    // Original: set counter to counter + 1
    this.counter = this.counter + 1

    // Original: if counter >= listLen then set counter to 1
    if (this.counter >= this.listLen) {
      this.counter = 1
    }

    // Check bounds
    // Original: if loc.x < -1000 or loc.y < -1000 or loc.x > 6400 or loc.y > 5100
    if (this.loc.x < -1000 || this.loc.y < -1000 ||
      this.loc.x > 6400 || this.loc.y > 5100) {
      // Original: Stopped(reportObject, me)
      if (this.reportObject && this.reportObject.Stopped) {
        this.reportObject.Stopped(this)
      }
      this.active = false
      if (this.sprite) {
        this.sprite.visible = false
      }
      return
    }

    // Update location
    // Original: set tmpFrame to getAt(frameList, counter)
    const tmpFrame = this.frameList[this.counter - 1] || 1

    // Original: set loc to loc + (vel / 2) + (vel * tmpFrame / 8)
    this.loc.x = this.loc.x + Math.floor(this.vel.x / 2) + Math.floor(this.vel.x * tmpFrame / 8)
    this.loc.y = this.loc.y + Math.floor(this.vel.y / 2) + Math.floor(this.vel.y * tmpFrame / 8)

    // Store current frame for rendering
    this.currentFrame = tmpFrame

    // Update Sprite
    if (this.sprite) {
      this.sprite.x = Math.floor(this.loc.x / 10)
      this.sprite.y = Math.floor(this.loc.y / 10)

      // Frame calc:
      // Lingo: member = firstFrame + (4 * (direction - 1)) + tmpFrame
      // We need to implement this frame logic.
      // We likely need a base frame per direction? 
      // For now, let's assume frames are laid out sequentially:
      // Dir 1: Frames 0, 1, 2, 3
      // Dir 2: Frames 4, 5, 6, 7 ...

      let frameIndex = Math.floor(tmpFrame) - 1 // tmpFrame is 1..4
      if (frameIndex < 0) frameIndex = 0
      if (frameIndex > 3) frameIndex = 3

      const dirOffset = (this.direction - 1) * 4
      this.sprite.frame = dirOffset + frameIndex
      this.sprite.visible = true
    }
  }

  /**
   * Get unscaled location
   * Original: on getLoc me
   * @returns {Object} Location {x, y}
   */
  getLoc() {
    // Original: return loc / 10
    return {
      x: Math.floor(this.loc.x / 10),
      y: Math.floor(this.loc.y / 10)
    }
  }

  /**
   * Get sprite frame offset
   * @returns {number} Frame offset for sprite
   */
  getFrameOffset() {
    return this.firstFrame + (this.currentFrame || 1)
  }
}

export default SingleWave
