/**
 * Waves.js - Wave system for boat game
 * @module objects/weather/Waves
 * 
 * Direct port of ParentScript 22 - Waves.ls from original Lingo
 * 
 * Properties from original:
 * - speed: wave speed
 * - waveAngle: wave direction in radians
 * - amplitude: wave height (speed * 30)
 * - period: wave period (30 + speed * 30)
 * - phase: current phase position in wave cycle
 * - amplitudeList: 100-entry sine wave lookup table
 * - corners: corner points for each direction (16 directions x 3 points)
 * - waveObjs: array of active SingleWave objects
 * - waveSPs: available sprite channels for waves
 * - deleteList: waves to remove on next loop
 * - waveVelPoint: wave velocity {x, y}
 * - spawnLines: spawn positions for waves based on direction
 * - currentSpawnLine: active spawn line
 * - direction: wave direction (1-16)
 */
'use strict'

import SingleWave from './SingleWave'

class Waves {
  /**
   * Create Waves instance
   * @param {Object} drivingHandlers - DrivingHandlers with correctDirection
   * @param {Object} [game] - Phaser game instance
   */
  constructor(drivingHandlers, game) {
    this.drivingHandlers = drivingHandlers

    if (game && game.add) {
      this.game = game
    }

    // Original: set phase to 0
    this.phase = 0

    // Original: set waveObjs to []
    this.waveObjs = []

    // Original: set corners to []
    this.corners = []

    // Original: set deleteList to []
    this.deleteList = []

    // Original: set waveSPs to [] (sprite channels 1-6 for waves)
    this.waveSPs = [1, 2, 3, 4, 5, 6]

    // Wave properties (will be set by setDirection)
    this.speed = 0
    this.direction = 1
    this.waveAngle = 0
    this.waveVelPoint = { x: 0, y: 0 }
    this.amplitude = 0
    this.period = 30

    // Original: set spawnLines to value(the text of member "spawnLines")
    // Each direction has a spawn line [midPoint, limitPoint]
    this.spawnLines = this._generateSpawnLines()

    this.currentSpawnLine = null

    // Original: set amplitudeList to value(the text of member "AmplitudeList")
    // 100-entry sine wave lookup table from original game
    this.amplitudeList = this._generateAmplitudeList()
  }

  /**
   * Initialize waves
   * Original: on init me
   */
  init() {
    // Nothing in original
  }

  /**
   * Kill waves system
   * Original .ls line 24-27: on kill me
   *   deleteObject(the loopMaster of gMulleGlobals, me)
   *   return 0
   */
  kill() {
    // Original: deleteObject(the loopMaster of gMulleGlobals, me)
    if (this.loopMaster && this.loopMaster.deleteObject) {
      this.loopMaster.deleteObject(this)
    }
    return 0
  }

  /**
   * Set corner points for wave calculations
   * Original: on setCornerPoints me, theList
   * @param {Array} theList - Array of 3 corner points [{x,y}, {x,y}, {x,y}]
   */
  setCornerPoints(theList) {
    // Default corner points if not provided
    // Original: if voidp(theList) then set theList to [point(0, -10), point(-5, 5), point(5, 5)]
    if (!theList) {
      theList = [
        { x: 0, y: -10 },
        { x: -5, y: 5 },
        { x: 5, y: 5 }
      ]
    }

    // Calculate hypotenuse and angle for each corner point
    const hypos = []
    const orgAngles = []

    for (const aPoint of theList) {
      const tmpX = aPoint.x
      const tmpY = aPoint.y
      const hypo = Math.sqrt(tmpX * tmpX + tmpY * tmpY)
      hypos.push(hypo)

      let angle
      if (tmpY === 0) {
        angle = (Math.abs(tmpX) / tmpX) * Math.PI / 2
      } else {
        angle = Math.atan(tmpX / tmpY)
      }

      // Quadrant adjustment
      if (tmpX > 0) {
        if (tmpY <= 0) {
          angle = angle + Math.PI
        }
      } else {
        if (tmpY > 0) {
          angle = angle + 2 * Math.PI
        } else {
          angle = angle + Math.PI
        }
      }

      orgAngles.push(angle)
    }

    // Calculate corner points for all 16 directions
    const tmpDirs = 16
    this.corners = []

    for (let N = 1; N <= tmpDirs; N++) {
      const tmpList = []
      const addAngle = 2 * Math.PI * N / tmpDirs

      for (let m = 0; m < theList.length; m++) {
        const angle = orgAngles[m] + addAngle
        const hypo = hypos[m]
        const newPoint = {
          x: -hypo * Math.sin(angle),
          y: hypo * Math.cos(angle)
        }
        tmpList.push(newPoint)
      }

      this.corners.push(tmpList)
    }
  }

  /**
   * Set wave direction and speed
   * Original: on setDirection me, argDir, argSpeed
   * @param {number} argDir - Direction (1-16)
   * @param {number} argSpeed - Speed (0-4)
   */
  setDirection(argDir, argSpeed) {
    // Kill existing waves
    if (this.waveObjs.length > 0) {
      for (const aWave of this.waveObjs) {
        this.Stopped(aWave)
      }
      this.deleteObjects()
      this.waveObjs = []
    }

    // Original: set speed to integer(argSpeed)
    this.speed = Math.floor(argSpeed)

    // Original: set direction to correctDirection(argDir + 8)
    this.direction = this._correctDirection(argDir + 8)

    // Original: set currentSpawnLine to getAt(spawnLines, direction)
    this.currentSpawnLine = this.spawnLines[this.direction]

    // Original: set waveAngle to direction * PI / 8.0
    this.waveAngle = this.direction * Math.PI / 8.0

    // Original: set waveVelPoint to point(10 * speed * sin(waveAngle), -10 * speed * cos(waveAngle))
    this.waveVelPoint = {
      x: 10 * this.speed * Math.sin(this.waveAngle),
      y: -10 * this.speed * Math.cos(this.waveAngle)
    }

    // Original: set amplitude to speed * 30
    this.amplitude = this.speed * 30

    // Original: set period to 30 + (speed * 30)
    this.period = 30 + this.speed * 30

    // Original: set phase to 0
    this.phase = 0

    // Don't create waves if speed is 0
    // Original: if speed = 0 then exit
    if (this.speed === 0) {
      return
    }

    // Create initial wave objects (4 waves)
    // Original: set tmpCnt to count(waveSPs)
    //           repeat with N = 1 to tmpCnt - 2
    const initialWaveCount = Math.min(4, this.waveSPs.length)
    for (let i = 0; i < initialWaveCount; i++) {
      if (this.waveSPs.length > 2) {
        const sp = this.waveSPs.shift()
        const loc = {
          x: Math.floor(Math.random() * 640),
          y: Math.floor(Math.random() * 400)
        }
        const wave = new SingleWave(
          this,
          sp,
          loc,
          this.waveVelPoint,
          this.direction,
          this.amplitude,
          this.game
        )
        this.waveObjs.push(wave)
      }
    }
  }

  /**
   * Called when a wave stops (goes out of bounds)
   * Original: on Stopped me, theObj
   * @param {SingleWave} theObj - Wave object that stopped
   */
  Stopped(theObj) {
    // Return sprite to pool
    // Original: add(waveSPs, the SP of theObj)
    this.waveSPs.push(theObj.SP)

    // Kill the wave
    if (theObj.kill) theObj.kill()

    // Add to delete list if not already there
    // Original: if getPos(deleteList, theObj) = 0 then add(deleteList, theObj)
    if (!this.deleteList.includes(theObj)) {
      this.deleteList.push(theObj)
    }
  }

  /**
   * Main loop - update waves each tick
   * Original: on loop me
   */
  loop() {
    // Maybe spawn a new wave
    // Original: if (random(30) = 1) and (speed > 0)
    if (Math.random() < 1 / 30 && this.speed > 0) {
      if (this.waveSPs.length > 0 && this.currentSpawnLine) {
        // Find a spawn location that doesn't overlap existing waves
        const tmpLocs = this.waveObjs.map(w => w.getLoc())
        const tmpMid = this.currentSpawnLine[0]
        const tmpLim = this.currentSpawnLine[1]

        let itsBad = false
        let tmpX, tmpY

        for (let N = 0; N < 30; N++) {
          const tmpRnd = Math.floor(Math.random() * 400) - 200
          tmpX = tmpMid.x + tmpLim.x * tmpRnd / 100
          tmpY = tmpMid.y + tmpLim.y * tmpRnd / 100

          itsBad = false
          for (const aLoc of tmpLocs) {
            if (Math.abs(tmpX - aLoc.x) < 100 || Math.abs(tmpY - aLoc.y) < 100) {
              itsBad = true
              break
            }
          }

          if (!itsBad) break
        }

        if (!itsBad) {
          const sp = this.waveSPs.shift()
          const wave = new SingleWave(
            this,
            sp,
            { x: tmpX, y: tmpY },
            this.waveVelPoint,
            this.direction,
            this.amplitude,
            this.game
          )
          this.waveObjs.push(wave)
        }
      }
    }

    // Update phase
    // Original: set phase to (phase + speed) mod period
    this.phase = (this.phase + this.speed) % this.period

    // Update all waves
    for (const aWave of this.waveObjs) {
      if (aWave.loop) aWave.loop()
    }

    // Remove deleted waves
    this.deleteObjects()
  }

  /**
   * Get topology info at a point
   * Original: on getTopoInfo me, theCenter, theDir, argCorners
   * @param {Object} theCenter - Center point {x, y}
   * @param {number} theDir - Direction (1-16)
   * @param {Array} argCorners - Corner points to check
   * @returns {Array} [avgAlt, frontBackInclination, sideInclination]
   */
  getTopoInfo(theCenter, theDir, argCorners) {
    // Calculate altitude at each corner
    // Original: repeat with N = 1 to 3
    //             set tmpAlt to getAltitude(me, theCenter + getAt(argCorners, N))
    const alts = []
    let totAlt = 0

    for (let i = 0; i < 3; i++) {
      const corner = argCorners[i] || { x: 0, y: 0 }
      const point = {
        x: theCenter.x + corner.x,
        y: theCenter.y + corner.y
      }
      const tmpAlt = this.getAltitude(point)
      alts.push(tmpAlt)
      totAlt += tmpAlt
    }

    // Original: set frontBackInclination to getAt(alts, 1) - ((getAt(alts, 2) + getAt(alts, 3)) / 2)
    const frontBackInclination = alts[0] - ((alts[1] + alts[2]) / 2)

    // Original: set sideInclination to getAt(alts, 2) - getAt(alts, 3)
    const sideInclination = alts[1] - alts[2]

    // Original: set avgAlt to totAlt / 3
    const avgAlt = totAlt / 3

    return [avgAlt, frontBackInclination, sideInclination]
  }

  /**
   * Get altitude at a point
   * Original: on getAltitude me, aPoint
   * @param {Object} aPoint - Point {x, y}
   * @returns {number} Altitude value
   */
  getAltitude(aPoint) {
    // Add up effect from all big waves
    // Original: repeat with aWave in waveObjs
    //             set bigWaveTot to bigWaveTot + check(aWave, aPoint)
    let bigWaveTot = 0
    for (const aWave of this.waveObjs) {
      if (aWave.check) {
        bigWaveTot += aWave.check(aPoint)
      }
    }

    // Calculate base wave altitude using sine wave lookup
    // Original calculation uses position, waveAngle, and phase
    const tmpX = aPoint.x + 100
    const tmpY = aPoint.y + 100
    const tmpAngle = Math.atan(tmpX / (tmpY || 0.001))
    const hypo = Math.sqrt(tmpX * tmpX + tmpY * tmpY)
    const totalAngle = tmpAngle + this.waveAngle
    const fromZero = Math.floor(hypo * Math.cos(totalAngle))

    // Calculate position in wave period
    let whereInPeriod = (fromZero + this.phase) % this.period
    if (whereInPeriod < 0) {
      whereInPeriod += this.period
    }
    whereInPeriod = 1 + (Math.floor(100 * whereInPeriod / this.period) % 100)
    if (whereInPeriod < 1) whereInPeriod = 1
    if (whereInPeriod > 100) whereInPeriod = 100

    // Look up in amplitude table
    // Original: set altitude to (amplitude * getAt(amplitudeList, whereInPeriod)) + bigWaveTot
    const amplitudeValue = this.amplitudeList[whereInPeriod - 1] || 0
    const altitude = (this.amplitude * amplitudeValue) + bigWaveTot

    // Original: return altitude / 200
    return altitude / 200
  }

  /**
   * Remove waves in delete list
   * Original .ls line 153-158: on deleteObjects me
   */
  deleteObjects() {
    for (const aWave of this.deleteList) {
      const idx = this.waveObjs.indexOf(aWave)
      if (idx !== -1) {
        this.waveObjs.splice(idx, 1)
      }
    }
    this.deleteList = []
  }

  /**
   * Correct direction to valid range (1-16)
   * @private
   */
  _correctDirection(dir) {
    if (this.drivingHandlers && this.drivingHandlers.correctDirection) {
      return this.drivingHandlers.correctDirection(dir)
    }
    dir = dir % 16
    if (dir <= 0) return dir + 16
    return dir
  }

  /**
   * Get velocity point
   * Original .ls line 197-198: on getVelPoint me (empty handler)
   */
  getVelPoint() {
    // Empty in original — stub for interface compatibility
  }

  /**
   * Get amplitude list (sine wave lookup table)
   * Extracted from Director member "AmplitudeList" (boten_05.DXR/Internal/11.txt)
   * Original: value(the text of member "AmplitudeList")
   * @private
   * @returns {Array} 100-entry custom wave shape values
   */
  _generateAmplitudeList() {
    // Real data from original game - NOT a pure sine wave
    // Values range from -100 to 100, 100 entries
    return [
      6, 13, 19, 25, 31, 37, 43, 48, 54, 59, 64, 68, 73, 77, 81, 84, 88, 90, 93, 95,
      97, 98, 99, 100, 100, 100, 99, 98, 97, 95, 93, 90, 88, 84, 81, 77, 73, 68, 64, 59,
      54, 48, 43, 37, 31, 25, 19, 13, 6, 0, -6, -13, -19, -25, -31, -37, -43, -48, -54, -59,
      -64, -68, -73, -77, -81, -84, -88, -90, -93, -95, -97, -98, -99, -100, -100, -100, -99, -98, -97, -95,
      -93, -90, -88, -84, -81, -77, -73, -68, -64, -59, -54, -48, -43, -37, -31, -25, -19, -13, -6, 0
    ]
  }

  /**
   * Get spawn lines for each direction
   * Extracted from Director member "SpawnLines" (boten_05.DXR/Internal/12.txt)
   * Original: value(the text of member "spawnLines")
   * @private
   * @returns {Object} Spawn lines indexed by direction (1-16), each [midPoint, limitVector]
   */
  _generateSpawnLines() {
    // Real spawn line data from original game
    // Each direction has [midPoint, limitVector] defining where waves appear
    // Lingo list is 1-indexed, we use object with 1-16 keys to match
    return {
      1: [{ x: 206, y: 478 }, { x: -92, y: -38 }],
      2: [{ x: 110, y: 412 }, { x: -70, y: -70 }],
      3: [{ x: 44, y: 316 }, { x: -38, y: -92 }],
      4: [{ x: 20, y: 202 }, { x: 0, y: -100 }],
      5: [{ x: 44, y: 88 }, { x: 38, y: -92 }],
      6: [{ x: 110, y: -8 }, { x: 70, y: -70 }],
      7: [{ x: 206, y: -74 }, { x: 92, y: -38 }],
      8: [{ x: 320, y: -98 }, { x: 100, y: 0 }],
      9: [{ x: 434, y: -74 }, { x: 92, y: 38 }],
      10: [{ x: 530, y: -8 }, { x: 70, y: 70 }],
      11: [{ x: 596, y: 88 }, { x: 38, y: 92 }],
      12: [{ x: 620, y: 202 }, { x: 0, y: 100 }],
      13: [{ x: 596, y: 316 }, { x: -38, y: 92 }],
      14: [{ x: 530, y: 412 }, { x: -70, y: 70 }],
      15: [{ x: 434, y: 478 }, { x: -92, y: 38 }],
      16: [{ x: 320, y: 502 }, { x: -100, y: 0 }]
    }
  }
}

export default Waves
