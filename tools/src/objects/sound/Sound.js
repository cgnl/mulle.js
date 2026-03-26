/**
 * @fileoverview Sound - Standard Lingo sound handler
 * Based on: ParentScript 143 - Sound.ls
 * 
 * Sound provides standard Lingo-based audio playback with:
 * - Channel-based sound management (3-5 channels)
 * - Background and effect sound types
 * - Preloading support
 * - Volume and fade control
 * 
 * Channel types:
 * - BG: Background music (channel 1)
 * - EFFECT: Sound effects (highest free channel)
 * - OPEFFECT: Optional effects (lowest free channel, skipped if full)
 * - TRANS: Transition (stops effects, plays on channel 1)
 * 
 * @example
 * const snd = new Sound();
 * const id = snd.play('explosion', 'EFFECT');
 * snd.setVol(id, 80);
 */

class Sound {
  /**
   * Creates a new Sound instance
   * Lingo: on new me
   */
  constructor() {
    this.mode = 'normal';
    this.newSnd = 1;
    
    // Platform-dependent timing
    this.ticksPerSec = 60;
    
    // Initialize channels (3 for Mac, 5 for Windows in original)
    // Using 3 as default
    this.channels = { 1: 0, 2: 0, 3: 0 };
    this.channelInfo = [[], [], []];
    
    this.nrOfChannels = Object.keys(this.channels).length;
    this.preLoadedList = {};
  }

  /**
   * Cleanup sound handler
   * Lingo: on kill me
   * @returns {null}
   */
  kill() {
    this.stopAll();
    return null;
  }

  /**
   * Get number of free channels
   * Lingo: on getFreeChannels me
   * @returns {number}
   */
  getFreeChannels() {
    let count = 0;
    for (const ch in this.channels) {
      if (this.channels[ch] === 0) {
        count++;
      }
    }
    return count;
  }

  /**
   * Get total number of channels
   * Lingo: on getNrOfChannels me
   * @returns {number}
   */
  getNrOfChannels() {
    return this.nrOfChannels;
  }

  /**
   * Preload a sound
   * Lingo: on preLoad me, theFileName
   * @param {string} fileName - Sound file/member name
   * @returns {number} Sound ID
   */
  preLoad(fileName) {
    this.newSnd++;
    this.preLoadedList[this.newSnd] = {
      name: fileName,
      Vol: 100
    };
    return this.newSnd;
  }

  /**
   * Unload a sound (no-op in standard Lingo)
   * Lingo: on unLoad me, sndId
   */
  unLoad(sndId) {
    // Not implemented in standard Lingo version
  }

  /**
   * Unload all sounds
   * Lingo: on unLoadAll me
   */
  unLoadAll() {
    this.stopAll();
  }

  /**
   * Stop all sounds
   * Lingo: on stopAll me
   */
  stopAll() {
    this.stopBG();
    this.stopAllEffects();
    
    // Reset volumes (in real implementation)
    for (let n = 1; n <= this.nrOfChannels; n++) {
      // volume of sound n = 255
    }
  }

  /**
   * Set frequency (not implemented in standard Lingo)
   * Lingo: on setFreq me, sndId, theFreq
   */
  setFreq(sndId, freq) {
    // Not implemented
  }

  /**
   * Set volume
   * Lingo: on setVol me, sndId, theVol
   * @param {number} sndId - Sound ID
   * @param {number} vol - Volume 0-100
   */
  setVol(sndId, vol) {
    const info = this.preLoadedList[sndId];
    if (info) {
      info.Vol = Math.floor(255 * vol / 100);
    }
    
    // Find channel and set volume
    for (const ch in this.channels) {
      if (this.channels[ch] === sndId) {
        // In real implementation: set the volume of sound ch
        break;
      }
    }
  }

  /**
   * Set loop (not implemented in standard Lingo)
   * Lingo: on setloop me, sndId, YesNo
   */
  setLoop(sndId, yesNo) {
    // Not implemented
  }

  /**
   * Lingo alias: on setloop me, sndId, YesNo
   * Preserve original casing for parity.
   */
  setloop(sndId, yesNo) {
    return this.setLoop(sndId, yesNo)
  }

  /**
   * Check if sound finished
   * Lingo: on finished me, sndId
   * @param {number} sndId - Sound ID
   * @returns {boolean}
   */
  finished(sndId) {
    this.purge();
    
    if (sndId === 0) {
      return true;
    }
    
    for (const ch in this.channels) {
      if (this.channels[ch] === sndId) {
        return false;
      }
    }
    return true;
  }

  /**
   * Get channel for sound
   * Lingo: on getChannel me, sndId
   * @param {number} sndId - Sound ID
   * @returns {number} Channel number or 0
   */
  getChannel(sndId) {
    this.purge();
    
    for (const ch in this.channels) {
      if (this.channels[ch] === sndId) {
        return parseInt(ch);
      }
    }
    return 0;
  }

  /**
   * Fade sound in or out
   * Lingo: on fade me, sndId, inOut, theLength
   * @param {number} sndId - Sound ID
   * @param {string} inOut - 'in' or 'out'
   * @param {number} length - Fade duration in ticks
   */
  fade(sndId, inOut, length) {
    if (sndId === 0) return;
    
    // Find channel
    let channel = 0;
    if (this.channels[2] === sndId) {
      channel = 2;
    } else if (this.channels[1] === sndId) {
      channel = 1;
    } else if (this.channels[3] === sndId) {
      channel = 3;
    }
    
    if (channel) {
      // In real implementation: sound fadeIn/fadeOut channel, length
    }
  }

  /**
   * Stop a sound
   * Lingo: on stop me, sndId
   * @param {number} sndId - Sound ID
   * @returns {number} 0
   */
  stop(sndId) {
    if (sndId === 0) return 0;
    
    for (const ch in this.channels) {
      if (this.channels[ch] === sndId) {
        // In real implementation: sound stop ch
        this.channels[ch] = 0;
        break;
      }
    }
    return 0;
  }

  /**
   * Stop background music
   * Lingo: on stopBG me
   */
  stopBG() {
    if (this.channels[1] !== 0) {
      // In real implementation: sound stop 1
      this.channels[1] = 0;
    }
  }

  /**
   * Stop all effect sounds
   * Lingo: on stopAllEffects me
   */
  stopAllEffects() {
    for (let n = 2; n <= this.nrOfChannels; n++) {
      // In real implementation: sound stop n
      this.channels[n] = 0;
    }
  }

  /**
   * Play a sound
   * Lingo: on play me, soundMember, what, theOption
   * @param {string|number} soundMember - Sound name or preloaded ID
   * @param {string} type - BG, EFFECT, OPEFFECT, or TRANS
   * @param {string} [option] - 'member' or 'file'
   * @returns {number} Sound ID or 0
   */
  play(soundMember, type, option) {
    this.purge();
    
    let gotId = null;
    let vol = null;
    
    if (!option) {
      option = 'member';
      
      // Check if preloaded
      if (typeof soundMember === 'number') {
        const info = this.preLoadedList[soundMember];
        if (info) {
          gotId = soundMember;
          soundMember = info.name;
          vol = info.Vol;
        }
      }
    }
    
    switch (type) {
      case 'BG':
        return this.lowLevelPlay(1, option, soundMember, gotId, vol);
        
      case 'TRANS':
        this.stopAllEffects();
        return this.lowLevelPlay(1, option, soundMember, gotId, vol);
        
      case 'EFFECT':
        // Find free channel from high to low
        for (let n = this.nrOfChannels; n >= 2; n--) {
          if (this.channels[n] === 0) {
            return this.lowLevelPlay(n, option, soundMember, gotId, vol);
          }
        }
        // All full, use channel 2
        return this.lowLevelPlay(2, option, soundMember, gotId, vol);
        
      case 'OPEFFECT':
        // Find free channel from low to high
        for (let n = 2; n <= this.nrOfChannels; n++) {
          if (this.channels[n] === 0) {
            return this.lowLevelPlay(n, option, soundMember, gotId, vol);
          }
        }
        // All full, skip
        return 0;
    }
    
    return 0;
  }

  /**
   * Low-level play on specific channel
   * Lingo: on lowLevelPlay me, ch, how, theName, argSndID, argVol
   * @param {number} ch - Channel number
   * @param {string} how - 'member' or 'file'
   * @param {string} name - Sound name
   * @param {number|null} sndId - Existing sound ID
   * @param {number|null} vol - Volume
   * @returns {number} Sound ID
   */
  lowLevelPlay(ch, how, name, sndId, vol) {
    if (!sndId) {
      this.newSnd++;
      sndId = this.newSnd;
    }
    
    this.channels[ch] = sndId;
    
    // Set volume if provided
    if (vol) {
      // In real implementation: set the volume of sound ch to vol
    }
    
    // Play sound
    if (how === 'file') {
      // In real implementation: sound playFile ch, name
      this.channelInfo[ch - 1] = ['file'];
    } else {
      // In real implementation: puppetSound(ch, name)
      this.channelInfo[ch - 1] = ['member', Date.now(), false, 1000];
    }
    
    return sndId;
  }

  /**
   * Purge finished sounds from channels
   * Lingo: on purge me
   */
  purge() {
    // In real implementation, would check soundBusy and timing
    // For now, no-op
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

module.exports = Sound;
