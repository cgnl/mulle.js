/**
 * @fileoverview DSound - DirectSound wrapper
 * Based on: ParentScript 144 - DSound.ls
 * 
 * DSound provides DirectSound-based audio playback with support for:
 * - Multiple simultaneous sounds
 * - Preloading sounds
 * - Volume and frequency control
 * - Background, effect, and optional effect channels
 * 
 * Channel types:
 * - BG: Background music (channel 1)
 * - EFFECT: Sound effects (channels 2+, replaces oldest)
 * - OPEFFECT: Optional effects (channels 2+, skipped if full)
 * - TRANS: Transition (treated as BG, stops effects)
 * 
 * @example
 * const ds = new DSound(dsApi);
 * const sndId = ds.play('explosion', 'EFFECT');
 * ds.setVol(sndId, 80);
 */

class DSound {
  /**
   * Creates a new DSound instance
   * Lingo: on new me, argOKLastTime
   * @param {Object} dsApi - DirectSound API interface
   * @param {boolean} [okLastTime] - Skip capability check
   */
  constructor(dsApi, okLastTime) {
    this.dsApi = dsApi;
    this.mode = 'xtra';
    this.soundPath = 'Sound/';
    
    // Initialize DirectSound
    if (dsApi && dsApi.dsOpen) {
      const openResult = dsApi.dsOpen();
      if (openResult === 0 && !okLastTime) {
        // Would return 0 in original
      }
    }
    
    // Get capabilities
    this.maxSounds = 5;
    if (dsApi && dsApi.dsGetCaps) {
      const caps = dsApi.dsGetCaps();
      if (Array.isArray(caps)) {
        this.maxSounds = caps[1] || 5;
        if (this.maxSounds === 0) {
          this.maxSounds = 5;
        }
      }
    }
    
    this.newSnd = 1;
    this.ticksPerSec = 60;
    this.preLoadedList = {};
    
    this.init();
  }

  /**
   * Initialize/reset channels
   * Lingo: on init me
   */
  init() {
    this.channels = {
      BG: [],
      EFFECT: [],
      OPEFFECT: []
    };
    this.nrOfPlaying = 0;
  }

  /**
   * Cleanup and close DirectSound
   * Lingo: on kill me
   * @returns {null}
   */
  kill() {
    this.unLoadAll();
    if (this.dsApi && this.dsApi.dsClose) {
      this.dsApi.dsClose();
    }
    return null;
  }

  /**
   * Get number of free channels
   * Lingo: on getFreeChannels me
   * @returns {number}
   */
  getFreeChannels() {
    return this.maxSounds - this.nrOfPlaying;
  }

  /**
   * Get total number of channels
   * Lingo: on getNrOfChannels me
   * @returns {number}
   */
  getNrOfChannels() {
    return this.maxSounds;
  }

  /**
   * Preload a sound file
   * Lingo: on preLoad me, theFileName
   * @param {string} fileName - Sound file name (without extension)
   * @returns {number} Sound ID or 0 on failure
   */
  preLoad(fileName) {
    if (!this.dsApi || !this.dsApi.dsNewSound) {
      return 0;
    }
    
    const sndId = this.dsApi.dsNewSound(this.soundPath + fileName + '.wav', 0);
    if (sndId !== 0) {
      this.preLoadedList[fileName] = sndId;
    }
    return sndId;
  }

  /**
   * Unload a sound
   * Lingo: on unLoad me, sndId
   * @param {number} sndId - Sound ID
   * @returns {number} 0
   */
  unLoad(sndId) {
    if (!this.finished(sndId)) {
      this.stop(sndId);
    }
    
    // Remove from preLoadedList
    for (const name in this.preLoadedList) {
      if (this.preLoadedList[name] === sndId) {
        delete this.preLoadedList[name];
        break;
      }
    }
    
    if (this.dsApi && this.dsApi.dsDelSound) {
      this.dsApi.dsDelSound(sndId);
    }
    return 0;
  }

  /**
   * Unload all sounds
   * Lingo: on unLoadAll me
   */
  unLoadAll() {
    this.stopAll();
    
    if (this.dsApi && this.dsApi.dsDelSound) {
      for (const name in this.preLoadedList) {
        this.dsApi.dsDelSound(this.preLoadedList[name]);
      }
    }
    this.preLoadedList = {};
  }

  /**
   * Stop all sounds
   * Lingo: on stopAll me
   */
  stopAll() {
    if (this.dsApi && this.dsApi.dsStop) {
      for (const channelName in this.channels) {
        for (const sndId of this.channels[channelName]) {
          this.dsApi.dsStop(sndId);
        }
      }
    }
    this.init();
  }

  /**
   * Set sound frequency
   * Lingo: on setFreq me, sndId, theFreq
   * @param {number} sndId - Sound ID
   * @param {number} freq - Frequency in Hz
   */
  setFreq(sndId, freq) {
    if (this.dsApi && this.dsApi.dsSetFreq) {
      this.dsApi.dsSetFreq(sndId, freq);
    }
  }

  /**
   * Set sound volume
   * Lingo: on setVol me, sndId, theVol, theOption
   * @param {number} sndId - Sound ID
   * @param {number} vol - Volume (0-100 percentage or dB)
   * @param {string} [option] - 'dB' for direct dB value
   */
  setVol(sndId, vol, option) {
    if (!this.dsApi || !this.dsApi.dsSetVolume) return;
    
    if (option === 'dB') {
      this.dsApi.dsSetVolume(sndId, vol);
    } else {
      // Convert percentage to dB
      let dbVol;
      if (vol === 0) {
        dbVol = -10000;
      } else {
        const ratio = 1 / (vol / 100.0);
        dbVol = Math.floor(-100 * Math.log10(ratio) * 144 / 10);
      }
      this.dsApi.dsSetVolume(sndId, dbVol);
    }
  }

  /**
   * Set sound loop
   * Lingo: on setloop me, sndId, YesNo
   * @param {number} sndId - Sound ID
   * @param {boolean} yesNo - Loop on/off
   */
  setLoop(sndId, yesNo) {
    if (this.dsApi && this.dsApi.dsSetLoop) {
      this.dsApi.dsSetLoop(sndId, yesNo);
    }
  }

  /**
   * Lingo alias: on setloop me, sndId, YesNo
   * Preserve original casing for parity.
   */
  setloop(sndId, yesNo) {
    return this.setLoop(sndId, yesNo)
  }

  /**
   * Check if sound finished playing
   * Lingo: on finished me, sndId
   * @param {number} sndId - Sound ID
   * @returns {boolean}
   */
  finished(sndId) {
    this.purge();
    if (this.dsApi && this.dsApi.dsIsPlaying) {
      return !this.dsApi.dsIsPlaying(sndId);
    }
    return true;
  }

  /**
   * Get channel for sound (not used in DirectSound)
   * Lingo: on getChannel me, sndId
   * @returns {number} Always 0
   */
  getChannel(sndId) {
    return 0;
  }

  /**
   * Fade sound (not implemented in DirectSound version)
   * Lingo: on fade me, sndId, inOut, theLength
   */
  fade(sndId, inOut, length) {
    // Not implemented in DirectSound version
  }

  /**
   * Stop a sound
   * Lingo: on stop me, sndId
   * @param {number} sndId - Sound ID
   */
  stop(sndId) {
    for (const channelName in this.channels) {
      const list = this.channels[channelName];
      const pos = list.indexOf(sndId);
      if (pos !== -1) {
        if (this.dsApi) {
          if (this.dsApi.dsStop) this.dsApi.dsStop(sndId);
          if (this.dsApi.dsSetPosition) this.dsApi.dsSetPosition(sndId, 0);
        }
        list.splice(pos, 1);
        this.nrOfPlaying--;
        break;
      }
    }
  }

  /**
   * Stop background music
   * Lingo: on stopBG me
   */
  stopBG() {
    // Not implemented in DirectSound version
  }

  /**
   * Stop all effects
   * Lingo: on stopAllEffects me
   */
  stopAllEffects() {
    // Not implemented in DirectSound version
  }

  /**
   * Play a sound
   * Lingo: on play me, sndId, what, theOption
   * @param {string|number} sound - Sound name or ID
   * @param {string} type - Channel type (BG, EFFECT, OPEFFECT, TRANS)
   * @param {string} [option] - Play option
   * @returns {number} Sound ID or 0 on failure
   */
  play(sound, type, option) {
    this.purge();
    
    // TRANS is treated as BG
    if (type === 'TRANS') {
      type = 'BG';
    }
    
    // Check if at capacity
    if (this.nrOfPlaying >= this.maxSounds) {
      // Try to stop an OPEFFECT first
      if (this.channels.OPEFFECT.length > 0) {
        this.stop(this.channels.OPEFFECT[0]);
      } else if (type === 'BG' || type === 'EFFECT') {
        // Try to stop an EFFECT
        if (this.channels.EFFECT.length > 0) {
          this.stop(this.channels.EFFECT[0]);
        }
      } else {
        // OPEFFECT when full - skip
        return 0;
      }
    }
    
    // Get or create sound ID
    let sndId;
    if (typeof sound === 'string') {
      // Check preloaded
      sndId = this.preLoadedList[sound];
      if (!sndId) {
        sndId = this.preLoad(sound);
        if (sndId === 0) {
          return 0;
        }
      }
    } else {
      sndId = sound;
    }
    
    // Play sound
    if (this.dsApi && this.dsApi.dsPlay) {
      this.dsApi.dsPlay(sndId);
    }
    
    // Add to channel
    const channelList = this.channels[type];
    if (channelList) {
      channelList.push(sndId);
    }
    this.nrOfPlaying++;
    
    return sndId;
  }

  /**
   * Remove finished sounds from channels
   * Lingo: on purge me
   */
  purge() {
    if (!this.dsApi || !this.dsApi.dsIsPlaying) return;
    
    for (const channelName in this.channels) {
      const list = this.channels[channelName];
      const toDelete = [];
      
      for (const sndId of list) {
        if (!this.dsApi.dsIsPlaying(sndId)) {
          toDelete.push(sndId);
          this.nrOfPlaying--;
        }
      }
      
      for (const sndId of toDelete) {
        const pos = list.indexOf(sndId);
        if (pos !== -1) {
          list.splice(pos, 1);
        }
      }
    }
  }

  /**
   * Handle cue passed event
   * Lingo: on CuePassed me, theChannel, theNumber, theName
   * @param {number} channel - Channel number
   * @param {number} number - Cue number
   * @param {string} name - Cue name
   */
  cuePassed(channel, number, name) {
    // Would send to all sprites in real implementation
  }

  /**
   * Lingo alias: on CuePassed me, theChannel, theNumber, theName
   * Preserve original casing for parity.
   */
  CuePassed(channel, number, name) {
    return this.cuePassed(channel, number, name)
  }
}

module.exports = DSound;
