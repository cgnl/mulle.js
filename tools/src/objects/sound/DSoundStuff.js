/**
 * DSoundStuff.js - DirectSound initialization and management
 * Based on original Lingo: MovieScript 4 - DSoundStuff.ls
 *
 * Manages DirectSound vs normal sound:
 * - Checks for DirectSound availability
 * - Switches between sound modes
 * - Reads/writes sound preferences
 *
 * In modern web context, this is simplified as Web Audio API
 * handles sound uniformly across platforms.
 */
'use strict'

export default class DSoundStuff {
  /**
   * Create DirectSound manager
   * @param {Object} sound - Sound manager (gSound)
   */
  constructor(sound) {
    this.sound = sound

    // Original: if voidp(gUseDirectSound) then set gUseDirectSound to 1
    this.useDirectSound = true

    // Platform detection (simplified)
    this.machineType = 'Web'  // Original: the machineType = 256 for Windows

    // Available Xtras (not applicable in web)
    this.availableXtras = ''
  }

  /**
   * Try to use DirectSound
   * Original: on tryToUseDSound
   * @returns {Object|null} Sound object or null
   */
  tryToUseDSound() {
    // Original: if gUseDirectSound = 0 then exit
    if (!this.useDirectSound) {
      return null
    }

    // Original checks Windows and DirectSound Xtra availability
    // In web context, we always use Web Audio API
    if (this.machineType !== 'Windows' && this.machineType !== 'Web') {
      return null
    }

    // Original: if (the mode of gSound = #normal) and (the machineType = 256) then
    if (this.sound && this.sound.mode === 'normal') {
      // In web, we don't switch sound modes
      // Just return current sound
      return this.sound
    }

    return this.sound
  }

  /**
   * Switch to normal sound
   * Original: on useNormalSound
   */
  useNormalSound() {
    if (!this.sound) return

    // Original: if the mode of gSound = #xtra then
    if (this.sound.mode === 'xtra') {
      // Original: set gSound to kill(gSound)
      if (typeof this.sound.kill === 'function') {
        this.sound.kill()
      }
      // Original: set gSound to new(script "Sound")
      // In web, sound manager handles this
    } else {
      // Original: stopAll(gSound)
      if (typeof this.sound.stopAll === 'function') {
        this.sound.stopAll()
      }
    }
  }

  /**
   * Check if DirectSound is enabled
   * @returns {boolean}
   */
  isDirectSoundEnabled() {
    return this.useDirectSound
  }

  /**
   * Set DirectSound enabled state
   * @param {boolean} enabled
   */
  setDirectSoundEnabled(enabled) {
    this.useDirectSound = enabled
  }
}
