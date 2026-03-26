/**
 * MulleSez.js - Mulle's speech/comment system
 * Based on original Lingo: ParentScript 42 - MulleSez.ls
 *
 * Manages Mulle's voice comments with:
 * - Priority system (lower number = higher priority)
 * - Sound queue for pending comments
 * - Prevention of immediate repetition
 * - Minimum wait between same comments
 * - Callback on completion
 *
 * Original Lingo properties:
 * - commentList: Mapping of comment types to sound numbers
 * - soundsInQ: Queue of pending sounds
 * - currentPriority: Priority of currently playing sound
 * - lastPlayed: Track last played sounds
 * - sndId: Current sound ID
 */
'use strict'

// Comment types mapped to sound numbers
// Original: set commentList to [#Vomit: [52, 53, 54], ...]
const COMMENT_LIST = {
  Vomit: [52, 53, 54],
  VomitPills: [39, 44],
  Tired: [12],
  Hungry: [13, 14, 15],
  MotorToSail: [20, 33],
  MotorToOar: [19, 33],
  SailToOar: [16],
  Heavy: [22],
  OutOfFuel: [30, 31, 32],
  BadWeather: [8, 9, 18, 21],
  crash: [89, 90, 91, 92, 93],
  CrashEasy: [94, 99, 100],
  LurchEasy: [121, 122, 123],
  LurchHard: [107, 102, 104, 108],
  Capsize: [21]
}

export default class MulleSez {
  /**
   * Create MulleSez speech manager
   * Original: on new me
   * @param {Object} [game] - Phaser game instance
   */
  constructor(game) {
    if (game && game.add) {
      this.game = game
    }
    // Original: set commentList to [...]
    this.commentList = { ...COMMENT_LIST }

    // Original: set lastPlayed to [:]
    this.lastPlayed = {}
    for (const key of Object.keys(this.commentList)) {
      this.lastPlayed[key] = { nr: 0, Started: 0, Wait: 0 }
    }

    // Original: set currentPriority to 0
    this.currentPriority = 0

    // Original: set soundsInQ to []
    this.soundsInQ = []

    // Original: set sndId to 0
    this.sndId = null

    // Original: set counter to 0
    this.counter = 0

    // Original: set soundCounter to 0
    this.soundCounter = 0

    // Original: set nowPlaying to EMPTY
    this.nowPlaying = ''

    // Report object for callback
    this.reportObject = null
    this.currentIdentifier = null

    // Sound list for sequential playback
    this.soundList = null

    // Track if sound finished (for isQuiet check)
    this.soundFinished = true
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    this.reportObject = null
    this.soundsInQ = []
    return null
  }

  /**
   * Check if no sound is playing
   * Original: on isQuiet me
   *
   * @returns {boolean} True if quiet
   */
  isQuiet() {
    return !this.sndId || this.soundFinished
  }

  /**
   * Play a sound/comment
   * Original: on say me, argWhat, argPriority, argReportObject, argPutInQ, argID, argMinWait
   *
   * @param {string} argWhat - Sound ID or comment type symbol
   * @param {number} argPriority - Priority (lower = higher priority)
   * @param {object} [argReportObject] - Object to call mulleFinished on
   * @param {string} [argPutInQ] - 'Q' to queue if busy
   * @param {string} [argID] - Identifier for callback
   * @param {number} [argMinWait=0] - Minimum wait before replaying same comment
   * @returns {object|null} Sound info or null
   */
  say(argWhat, argPriority, argReportObject, argPutInQ, argID, argMinWait = 0) {
    // Original: if argWhat = nowPlaying then return 0
    if (argWhat === this.nowPlaying) {
      return null
    }

    let soundToPlay = argWhat

    // Handle symbol (comment type)
    // Original: if symbolp(argWhat) then ...
    if (this.commentList[argWhat]) {
      const lastPlayedInfo = this.lastPlayed[argWhat]

      // Check minimum wait time
      // Original: if counter < (Started + Wait) then return 0
      if (this.counter < (lastPlayedInfo.Started + lastPlayedInfo.Wait)) {
        return null
      }

      // Get list of sounds, excluding last played if multiple
      const soundList = [...this.commentList[argWhat]]
      if (soundList.length > 1 && lastPlayedInfo.nr) {
        const idx = soundList.indexOf(lastPlayedInfo.nr)
        if (idx > -1) {
          soundList.splice(idx, 1)
        }
      }

      // Pick random sound
      const soundNr = soundList[Math.floor(Math.random() * soundList.length)]

      // Update lastPlayed
      this.lastPlayed[argWhat] = {
        nr: soundNr,
        Started: this.counter,
        Wait: argMinWait
      }

      // Convert to filename
      // Original: set argWhat to "05d" & convItoS(tmpSndNr, 3) & "v0"
      soundToPlay = `05d${String(soundNr).padStart(3, '0')}v0`
    }

    // Handle priority
    if (this.sndId) {
      // Original: if argPriority <= currentPriority then stop current
      if (argPriority <= this.currentPriority) {
        // Stop current sound
        if (this.reportObject?.mulleFinished) {
          this.reportObject.mulleFinished(this.currentIdentifier)
        }
        this.sndId = null
      } else {
        // Current sound has higher priority
        // Original: if argPutInQ = #Q then add to queue
        if (argPutInQ === 'Q') {
          this.soundsInQ.push({
            priority: argPriority,
            sound: soundToPlay,
            reportObject: argReportObject,
            id: argID
          })
        }
        return null
      }
    }

    // Play the sound
    this.reportObject = argReportObject
    this.currentPriority = argPriority
    this.currentIdentifier = argID

    this.playStringOrList(soundToPlay)

    return {
      sound: soundToPlay,
      sndId: this.sndId
    }
  }

  /**
   * Play a sound or list of sounds
   * Original: on playStringOrList me, argWhat
   *
   * @param {string|string[]} argWhat - Sound ID or list of sounds
   */
  playStringOrList(argWhat) {
    if (typeof argWhat === 'string') {
      this.nowPlaying = argWhat
      this.sndId = argWhat // In real impl, would be sound channel ID
      this.soundFinished = false
      this.soundList = null
    } else if (Array.isArray(argWhat)) {
      this.soundList = argWhat
      this.soundCounter = 1
      this.nowPlaying = this.soundList[0]
      this.sndId = this.soundList[0]
      this.soundFinished = false
    }

    // JS Audio Integration
    if (this.game && this.nowPlaying) {
      try {
        // Stop previous if needed?
        // Phaser 2: game.sound.play(key)
        // We typically map 05d... to asset keys. 
        // Assuming asset keys match Lingo names for now.
        // If sound manager exists:
        if (this.game.mulle) {
          this.game.mulle.play(this.nowPlaying)
        } else if (this.game.sound) {
          // Basic fallback
          this.game.sound.play(this.nowPlaying)
        }
      } catch (e) {
        console.warn('MulleSez: Failed to play', this.nowPlaying, e)
      }
    }
  }

  /**
   * Lingo handler: on soundStopped me
   * Empty in original; kept for parity.
   */
  soundStopped() {
    return null
  }

  /**
   * Main loop - check for sound completion
   * Original: on loop me
   *
   * @param {boolean} soundFinished - Whether current sound has finished
   */
  loop(soundFinished) {
    // JS: If soundFinished arg is undefined, check game audio status
    if (soundFinished === undefined && this.game) {
      // Check if our specific sound is playing?
      // Simplified: assume finished if not playing?
      // Phaser 2 `game.sound.isPlaying` is global?
      // Better: check specific sound object if we stored it?
      // For now, default to true if we can't check, or pass in from Dir
      soundFinished = true
    }
    // Original: set counter to counter + 1
    this.counter++

    if (this.sndId && soundFinished) {
      this.nowPlaying = ''

      // Check for sound list
      if (this.soundList) {
        this.soundCounter++
        if (this.soundCounter <= this.soundList.length) {
          this.sndId = this.soundList[this.soundCounter - 1]
          this.nowPlaying = this.sndId
          return // Continue with next sound in list
        }
      }

      // Sound finished
      this.soundList = null
      this.sndId = null
      this.currentPriority = 0
      this.soundFinished = true

      // Callback
      if (this.reportObject?.mulleFinished) {
        this.reportObject.mulleFinished(this.currentIdentifier)
      }
      this.currentIdentifier = null
      this.reportObject = null

      // Play next from queue
      if (this.soundsInQ.length > 0) {
        const next = this.soundsInQ.shift()
        this.currentPriority = next.priority
        this.playStringOrList(next.sound)
        this.reportObject = next.reportObject
        this.currentIdentifier = next.id
      }
    }
  }

  /**
   * Stop current sound
   * Original: on stop me
   */
  stop() {
    this.nowPlaying = ''
    this.reportObject = null
    this.sndId = null
    this.soundFinished = true
  }

  /**
   * Remove sound(s) from queue
   * Original: on deleteSound me, argSoundOrReportObject
   *
   * @param {string|object} argSoundOrReportObject - Sound ID or report object
   */
  deleteSound(argSoundOrReportObject) {
    if (typeof argSoundOrReportObject === 'object') {
      // Remove by report object
      this.soundsInQ = this.soundsInQ.filter(
        item => item.reportObject !== argSoundOrReportObject
      )
    } else {
      // Remove by sound name
      if (this.nowPlaying === argSoundOrReportObject) {
        this.stop()
      }
      this.soundsInQ = this.soundsInQ.filter(
        item => item.sound !== argSoundOrReportObject
      )
    }
  }

  /**
   * Remove all references to an object
   * Original: on deleteReference me, argObj
   *
   * @param {object} argObj - Object to remove references to
   */
  deleteReference(argObj) {
    if (this.reportObject === argObj) {
      this.reportObject = null
    }
    this.deleteSound(argObj)
  }
}
