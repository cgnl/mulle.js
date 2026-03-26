/**
 * AmbienceSound - Sea ambient sound management
 * @module objects/ambiencesound
 * 
 * Manages ambient sounds for the sea world (waves, wind, water)
 * Based on ParentScript 24 - AmbienceSound.ls from boat_05
 * 
 * IMPLEMENTED FEATURES FROM missing.md:
 * #184 - Weather-based ambient volume (200 for clear, 150 for storm)
 * #188 - Wave hit sound triggers (hitWave method)
 * #191 - AmbienceSound class with dynamic sound switching
 * 
 * Sound Modes:
 * - #waves: Gentle wave sounds (when boat speed < 20%)
 * - #Stem: Bow wave sounds (when boat speed >= 20%)
 * - Wind sounds play when wind speed > 150
 */
'use strict'

/**
 * Ambient sound controller for sea scenes
 */
class AmbienceSound {
  /**
   * Create AmbienceSound system
   * @param {Phaser.Game} game - Game instance
   */
  constructor(game) {
    this.game = game

    // Sound IDs for different ambient sounds
    this.wavesID = null
    this.stemWaterID = null
    this.windID = null
    this.singleWaveID = null

    // Current mode (#waves or #Stem)
    this.mode = null

    // Currently playing sounds array
    this.currentlyPlaying = []

    // System state
    this.active = false
    this.OKToPlayDouble = true // Can play multiple sounds at once

    // BUG FIX #3.12: Mac volume detection - detect Mac/iOS devices
    // Original Lingo checks for Mac platform to adjust wave volume (70 vs 50)
    const nav = (typeof navigator !== 'undefined') ? navigator : { platform: '', userAgent: '' }
    this.isMac = /Mac|iPhone|iPod|iPad/i.test((nav.platform || '') + ' ' + (nav.userAgent || ''))

    // Speed tracking for mode switching
    this.speedPercent = 0

    // Weather tracking for volume adjustment
    this.weatherType = 1 // 1=clear, 2-4=storm levels

    console.log('[AmbienceSound] Initialized')
  }

  /**
   * Activate or deactivate ambient sounds
   * @param {boolean} argYesNo - true to activate, false to deactivate
   */
  activate(argYesNo) {
    this.active = argYesNo

    if (this.active) {
      // Preload and start ambient sounds
      this.initSounds()

      // BUG FIX #3.6: AmbienceSound loop never called - add to LoopMaster
      // Original Lingo: AmbienceSound added to global loop system when activated
      if (this.game.mulle.loopMaster) {
        this.game.mulle.loopMaster.addObject(this)
      }
    } else {
      // Stop and unload all sounds
      this.cleanup()

      // BUG FIX #3.6: Remove from LoopMaster when deactivated
      if (this.game.mulle.loopMaster) {
        this.game.mulle.loopMaster.deleteObject(this)
      }
    }
  }

  /**
   * Initialize ambient sounds
   */
  initSounds() {
    // #191: WaveSm - gentle wave sound (loops)
    const wavesSound = this.resolveFirstAvailableSound(['WaveSm', '00e108v0', '00e109v0'])
    this.wavesID = wavesSound ? this.game.mulle.playAudio(wavesSound, true) : null
    if (this.wavesID) {
      this.wavesID.loop = true

      // #184: Volume based on Mac platform (70 for Mac, 50 for others)
      const tmpVol = this.isMac ? 0.7 : 0.5
      this.wavesID.volume = tmpVol

      this.currentlyPlaying.push(this.wavesID)
    }

    // #191: Vatten - bow wave sound (water moving past boat)
    const stemSound = this.resolveFirstAvailableSound(['Vatten', '00e109v0', '00e108v0'])
    this.stemWaterID = stemSound ? this.game.mulle.playAudio(stemSound, true) : null
    if (this.stemWaterID) {
      this.stemWaterID.loop = true
      this.stemWaterID.volume = 0 // Start muted, will adjust based on speed
      this.stemWaterID.pause() // Don't play yet
    }

    // #191: Wind sound (plays when wind speed > 150)
    const windSound = this.resolveFirstAvailableSound(['05e043v0', '00e104v0', '00e107v0'])
    this.windID = windSound ? this.game.mulle.playAudio(windSound, true) : null
    if (this.windID) {
      this.windID.loop = true
      this.windID.volume = 0 // Start muted
      this.windID.pause() // Don't play yet
    }

    // #188: OneWave2 - single wave hit sound (one-shot)
    const singleWaveSound = this.resolveFirstAvailableSound(['OneWave2', '31e003v0'])
    this.singleWaveID = singleWaveSound ? this.game.mulle.playAudio(singleWaveSound, false) : null
    if (this.singleWaveID) {
      this.singleWaveID.loop = false
      this.singleWaveID.volume = 0.75
      this.singleWaveID.pause() // Don't play yet
    }

    // Start in waves mode
    this.mode = 'waves'

    console.log('[AmbienceSound] Sounds initialized')
  }

  /**
   * Return first sound id that exists in currently loaded audio packs.
   * @param {string[]} candidates
   * @returns {string|null}
   */
  resolveFirstAvailableSound(candidates) {
    if (!this.game || !this.game.mulle || !this.game.mulle.audio) return null

    for (let i = 0; i < candidates.length; i++) {
      const id = candidates[i]
      if (!id) continue

      for (const key in this.game.mulle.audio) {
        const pack = this.game.mulle.audio[key]
        if (!pack || !pack.sounds) continue

        for (const soundKey in pack.sounds) {
          const snd = pack.sounds[soundKey]
          if (snd && snd.extraData && snd.extraData.dirName && snd.extraData.dirName.toLowerCase() === id.toLowerCase()) {
            return id
          }
        }
      }
    }

    return null
  }

  /**
   * #188: Play wave hit sound when boat hits a wave
   * Original: hitWave(me, theSize)
   * @param {number} theSize - Wave size (0-100)
   */
  hitWave(theSize) {
    if (!this.active) return
    if (!this.singleWaveID) return

    // Only play if not already playing
    if (!this.singleWaveID.isPlaying) {
      // Adjust volume based on wave size
      const volume = Math.min(1.0, 0.5 + (theSize / 200))
      this.singleWaveID.volume = volume

      // Play the sound
      if (this.singleWaveID.paused) {
        this.singleWaveID.resume()
      } else {
        this.singleWaveID.restart()
      }

      console.log('[AmbienceSound] Wave hit! Size:', theSize, 'Volume:', volume)
    }
  }

  /**
   * Set stem water sound (bow wave)
   * @param {string} argSound - Sound name (defaults to "Vatten")
   */
  setStemSound(argSound) {
    if (this.stemWaterID && this.stemWaterID.isPlaying) {
      this.stemWaterID.stop()
    }

    const soundName = argSound || 'Vatten'
    this.stemWaterID = this.game.mulle.playAudio(soundName, true)
    if (this.stemWaterID) {
      this.stemWaterID.loop = true
      this.stemWaterID.volume = 0
      this.stemWaterID.pause()
    }
  }

  /**
   * Update loop - called each frame
   * Manages sound switching based on boat speed and weather
   * @param {object} boat - Boat object with speed property
   * @param {object} weather - Weather object with wind properties
   */
  loop(boat, weather) {
    if (!this.active) return

    // Get wind speed from weather system
    let tmpWindspeed = 0
    if (weather && weather.windSpeed !== undefined) {
      tmpWindspeed = weather.windSpeed
    }

    // #184: Wind sound plays when wind speed > 150
    // Volume scales with wind speed / 4
    if (tmpWindspeed > 150) {
      if (!this.isPlaying(this.windID)) {
        // Start wind sound
        if (this.OKToPlayDouble) {
          // Can play multiple sounds - keep existing sounds
        } else {
          // Can't play multiple - stop other sounds
          this.stopAllExcept(this.windID)
        }

        if (this.windID) {
          if (this.windID.paused) {
            this.windID.resume()
          }
          this.addToPlaying(this.windID)
        }
      }

      // #184: Volume based on wind speed (200 for clear, 150 for storm)
      // Adjust volume: windSpeed / 4
      // BUG FIX #6: Wind sound volume 100x too quiet - should divide by 4, not 400
      if (this.windID) {
        this.windID.volume = Math.min(1.0, tmpWindspeed / 4)
      }
    } else {
      // Wind not strong enough - stop wind sound
      if (this.isPlaying(this.windID)) {
        this.removeFromPlaying(this.windID)
        if (this.windID) {
          this.windID.pause()
        }
      }
    }

    // Select water sound based on boat speed
    if (boat && boat.speed !== undefined) {
      this.selectWaterSound(boat)
    }

    // Ensure looping sounds keep playing
    for (let sound of this.currentlyPlaying) {
      if (sound && sound.loop && !sound.isPlaying) {
        // Restart looping sound if it stopped
        if (sound.paused) {
          sound.resume()
        }
      }
    }
  }

  /**
   * Select water sound based on boat speed
   * Original logic: < 20% = waves mode, >= 20% = stem mode
   * @param {object} boat - Boat object
   */
  selectWaterSound(boat) {
    // Calculate speed percentage (0-100)
    const maxSpeed = boat.maxSpeed || 600
    this.speedPercent = (boat.speed / maxSpeed) * 100

    if (this.speedPercent < 20) {
      // Slow speed - use gentle wave sounds
      if (this.mode !== 'waves') {
        // Lingo parity: If wind is playing and we can't play double, don't switch
        if (this.windID && this.isPlaying(this.windID) && !this.OKToPlayDouble) {
          return
        }

        // Switch to waves mode
        this.switchToWaves()
        this.mode = 'waves'
      }
    } else {
      // Fast speed - use bow wave sounds
      if (this.mode !== 'Stem') {
        // Lingo parity: If wind is playing and we can't play double, don't switch
        if (this.windID && this.isPlaying(this.windID) && !this.OKToPlayDouble) {
          return
        }

        // Switch to stem mode
        this.switchToStem()
        this.mode = 'Stem'
      }

      // Adjust stem volume based on speed (70% * speedPercent / 100)
      if (this.stemWaterID) {
        const volume = 0.7 * Math.abs(this.speedPercent) / 100
        this.stemWaterID.volume = Math.min(1.0, volume)
      }
    }
  }

  /**
   * Switch to waves mode (gentle waves)
   */
  switchToWaves() {
    // Stop stem sound
    if (this.stemWaterID) {
      this.stemWaterID.pause()
    }
    this.removeFromPlaying(this.stemWaterID)

    // Start waves sound
    if (this.wavesID) {
      if (this.wavesID.paused) {
        this.wavesID.resume()
      }
    }
    this.addToPlaying(this.wavesID)

    console.log('[AmbienceSound] Switched to waves mode')
  }

  /**
   * Switch to stem mode (bow wave)
   */
  switchToStem() {
    // Stop waves sound
    if (this.wavesID) {
      this.wavesID.pause()
    }
    this.removeFromPlaying(this.wavesID)

    // Start stem sound
    if (this.stemWaterID) {
      if (this.stemWaterID.paused) {
        this.stemWaterID.resume()
      }
    }
    this.addToPlaying(this.stemWaterID)

    console.log('[AmbienceSound] Switched to stem mode')
  }

  /**
   * Check if a sound is in the currently playing list
   * @param {object} sound - Sound object
   * @returns {boolean}
   */
  isPlaying(sound) {
    return this.currentlyPlaying.includes(sound)
  }

  /**
   * Add sound to currently playing list
   * @param {object} sound - Sound object
   */
  addToPlaying(sound) {
    if (!this.isPlaying(sound)) {
      this.currentlyPlaying.push(sound)
    }
  }

  /**
   * Remove sound from currently playing list
   * @param {object} sound - Sound object
   */
  removeFromPlaying(sound) {
    const index = this.currentlyPlaying.indexOf(sound)
    if (index > -1) {
      this.currentlyPlaying.splice(index, 1)
    }
  }

  /**
   * Stop all sounds except the specified one
   * @param {object} exceptSound - Sound to keep playing
   */
  stopAllExcept(exceptSound) {
    for (let sound of this.currentlyPlaying) {
      if (sound !== exceptSound && sound) {
        sound.pause()
      }
    }

    this.currentlyPlaying = exceptSound ? [exceptSound] : []
  }

  /**
   * Cleanup - stop and unload all sounds
   */
  cleanup() {
    // Stop all playing sounds
    if (this.wavesID) {
      this.wavesID.stop()
      this.wavesID = null
    }

    if (this.stemWaterID) {
      this.stemWaterID.stop()
      this.stemWaterID = null
    }

    if (this.windID) {
      this.windID.stop()
      this.windID = null
    }

    if (this.singleWaveID) {
      this.singleWaveID.stop()
      this.singleWaveID = null
    }

    this.currentlyPlaying = []
    this.active = false

    console.log('[AmbienceSound] Cleanup complete')
  }

  /**
   * Destroy and cleanup
   */
  kill() {
    this.cleanup()
    return 0
  }
}

export default AmbienceSound
