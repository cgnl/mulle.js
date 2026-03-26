/**
 * XXSound - Extended sound channel manager
 * Based on: ParentScript 22 - XXSound.ls
 *
 * Manages 3 sound channels with support for background music,
 * effects, and transitions. Handles channel allocation, fading,
 * and automatic cleanup of finished sounds.
 */

/** @typedef {'BG' | 'TRANS' | 'EFFECT' | 'OPEFFECT'} SoundType */
/** @typedef {'in' | 'out'} FadeDirection */
/** @typedef {'member' | 'file'} PlayOption */

class XXSound {
  /**
   * Create a new XXSound instance
   * Lingo: on new me
   */
  constructor() {
    // Sound ID assigned to each channel (0 = free)
    // Channel 1: background, Channel 2-3: effects
    /** @type {Object<number, number>} */
    this.channels = { 1: 0, 2: 0, 3: 0 };

    // Info about each channel: [type, startTicks, loop, duration]
    /** @type {Array<Array>} */
    this.channelInfo = [[], [], []];

    // Counter for generating unique sound IDs
    /** @type {number} */
    this.newSnd = 1;

    // Ticks per second (platform dependent in Director)
    /** @type {number} */
    this.ticksPerSec = 60;

    // Audio context for web audio (optional)
    /** @type {Object|null} */
    this.audioContext = null;

    // Active audio elements per channel
    /** @type {Object<number, Object>} */
    this.audioElements = { 1: null, 2: null, 3: null };

    // Current tick count (simulated)
    /** @type {number} */
    this.currentTicks = 0;
  }

  /**
   * Clean up the sound manager
   * Lingo: on kill me
   */
  kill() {
    this.stopBG();
    this.stopAllEffects();
  }

  /**
   * Check if a sound has finished playing
   * Lingo: on finished me, sndId
   * @param {number} sndId - The sound ID to check
   * @returns {number} 0 if still playing, 1 if finished
   */
  finished(sndId) {
    this.purge();

    if (sndId !== 0) {
      // Check if sound is still in any channel
      if (this.channels[2] === sndId) {
        return 0;
      } else if (this.channels[1] === sndId) {
        return 0;
      } else if (this.channels[3] === sndId) {
        return 0;
      } else {
        return 1;
      }
    } else {
      return 1;
    }
  }

  /**
   * Get the channel number for a sound ID
   * Lingo: on getChannel me, sndId
   * @param {number} sndId - The sound ID to find
   * @returns {number} Channel number (1-3) or 0 if not found
   */
  getChannel(sndId) {
    this.purge();

    for (let n = 1; n <= 3; n++) {
      if (this.channels[n] === sndId) {
        return n;
      }
    }
    return 0;
  }

  /**
   * Fade a sound in or out
   * Lingo: on fade me, sndId, inOut, theLength
   * @param {number} sndId - The sound ID to fade
   * @param {string} inOut - 'in' or 'out'
   * @param {number} length - Duration of fade in ticks
   */
  fade(sndId, inOut, length) {
    if (sndId !== 0) {
      let tempCh = 0;

      if (this.channels[2] === sndId) {
        tempCh = 2;
      } else if (this.channels[1] === sndId) {
        tempCh = 1;
      } else if (this.channels[3] === sndId) {
        tempCh = 3;
      }

      if (tempCh) {
        // In a real implementation, this would apply fade to audio
        if (this.audioElements[tempCh]) {
          // Store fade info for processing
          this.audioElements[tempCh].fadeDirection = inOut;
          this.audioElements[tempCh].fadeLength = length;
        }
      }
    }
  }

  /**
   * Stop a specific sound
   * Lingo: on stop me, sndId
   * @param {number} sndId - The sound ID to stop
   * @returns {number} Always returns 0
   */
  stop(sndId) {
    if (sndId !== 0) {
      if (this.channels[2] === sndId) {
        this._stopChannel(2);
        this.channels[2] = 0;
      } else if (this.channels[1] === sndId) {
        this._stopChannel(1);
        this.channels[1] = 0;
      } else if (this.channels[3] === sndId) {
        this._stopChannel(3);
        this.channels[3] = 0;
      }
    }
    return 0;
  }

  /**
   * Stop background music (channel 1)
   * Lingo: on stopBG me
   */
  stopBG() {
    if (this.channels[1] !== 0) {
      this._stopChannel(1);
      this.channels[1] = 0;
    }
  }

  /**
   * Stop all effect sounds (channels 2 and 3)
   * Lingo: on stopAllEffects me
   */
  stopAllEffects() {
    if (this.channels[2] !== 0) {
      this._stopChannel(2);
      this.channels[2] = 0;
    }
    if (this.channels[3] !== 0) {
      this._stopChannel(3);
      this.channels[3] = 0;
    }
  }

  /**
   * Play a sound
   * Lingo: on play me, soundMember, what, theOption
   * @param {string} soundMember - The sound name or file path
   * @param {string} what - Type: 'BG', 'TRANS', 'EFFECT', or 'OPEFFECT'
   * @param {string} [option='member'] - How to play: 'member' or 'file'
   * @returns {number} Sound ID if played, 0 if no channel available
   */
  play(soundMember, what, option = 'member') {
    this.purge();

    // Handle invalid sound member
    if (!soundMember || soundMember === '') {
      soundMember = '20d163v0'; // Default fallback sound
    }

    switch (what) {
      case 'BG':
        this.newSnd += 1;
        this.channels[1] = this.newSnd;
        this._lowLevelPlay(1, option, soundMember);
        return this.newSnd;

      case 'TRANS':
        this.newSnd += 1;
        this.channels[1] = this.newSnd;
        this.stopAllEffects();
        this._lowLevelPlay(1, option, soundMember);
        return this.newSnd;

      case 'EFFECT':
        // Try channel 3 first, then channel 2
        if (this.channels[3] === 0) {
          this.newSnd += 1;
          this.channels[3] = this.newSnd;
          this._lowLevelPlay(3, option, soundMember);
          return this.newSnd;
        } else {
          this.newSnd += 1;
          this.channels[2] = this.newSnd;
          this._lowLevelPlay(2, option, soundMember);
          return this.newSnd;
        }

      case 'OPEFFECT':
        // Opposite priority: try channel 2 first, then channel 3
        if (this.channels[2] === 0) {
          this.newSnd += 1;
          this.channels[2] = this.newSnd;
          this._lowLevelPlay(2, option, soundMember);
          return this.newSnd;
        } else if (this.channels[3] === 0) {
          this.newSnd += 1;
          this.channels[3] = this.newSnd;
          this._lowLevelPlay(3, option, soundMember);
          return this.newSnd;
        }
        break;
    }

    return 0;
  }

  /**
   * Low-level play implementation
   * Lingo: on lowLevelPlay me, ch, how, theName
   * @param {number} ch - Channel number (1-3)
   * @param {string} how - 'member' or 'file'
   * @param {string} name - Sound name or file path
   * @private
   */
  _lowLevelPlay(ch, how, name) {
    if (how === 'file') {
      // File-based playback
      this.channelInfo[ch - 1] = ['file'];
      // In real implementation: sound playFile ch, name
    } else if (how === 'member') {
      // Member-based playback
      // Store: [type, startTicks, loop, calculatedDuration]
      // Duration calculation from Lingo: 90 + (size * ticksPerSec / 11025)
      const estimatedDuration = 90; // Default estimate
      this.channelInfo[ch - 1] = ['member', this.currentTicks, false, estimatedDuration];
      // In real implementation: puppetSound ch, name
    }
  }

  /**
   * Clean up finished sounds from channels
   * Lingo: on purge me
   */
  purge() {
    // Check channel 1
    if (!this._soundBusy(1)) {
      this.channels[1] = 0;
    }

    // Check channel 2
    if (!this._soundBusy(2)) {
      this.channels[2] = 0;
    } else {
      const tempInfo = this.channelInfo[1]; // Index 1 for channel 2
      if (tempInfo && tempInfo.length > 0) {
        if (tempInfo[0] === 'member') {
          // Check if non-looping sound has exceeded duration
          const elapsed = this.currentTicks - tempInfo[1];
          if (elapsed > tempInfo[3] && tempInfo[2] === false) {
            this.channels[2] = 0;
            this._stopChannel(2);
          }
        }
      }
    }

    // Check channel 3
    if (!this._soundBusy(3)) {
      this.channels[3] = 0;
    } else {
      const tempInfo = this.channelInfo[2]; // Index 2 for channel 3
      if (tempInfo && tempInfo.length > 0) {
        if (tempInfo[0] === 'member') {
          // Check if non-looping sound has exceeded duration
          const elapsed = this.currentTicks - tempInfo[1];
          if (elapsed > tempInfo[3] && tempInfo[2] === false) {
            this.channels[3] = 0;
            this._stopChannel(3);
          }
        }
      }
    }
  }

  /**
   * Handle cue point passed event
   * Lingo: on CuePassed me, theChannel, theNumber, theName
   * @param {string|number} channel - Channel identifier
   * @param {number} number - Cue number
   * @param {string} name - Cue name
   */
  cuePassed(channel, number, name) {
    // Extract channel number from string (e.g., "sound1" -> 1)
    const channelNum = typeof channel === 'string'
      ? parseInt(channel.slice(-1), 10)
      : channel;

    // In real implementation: sendAllSprites(#spritecuePassed, channelNum, number, name)
    // This would broadcast to all sprites listening for cue events
  }

  /**
   * Check if a channel is currently playing
   * @param {number} ch - Channel number
   * @returns {boolean} True if channel is busy
   * @private
   */
  _soundBusy(ch) {
    // In real implementation, check actual audio state
    // For now, check if we have an assigned sound ID
    return this.channels[ch] !== 0;
  }

  /**
   * Stop audio on a specific channel
   * @param {number} ch - Channel number
   * @private
   */
  _stopChannel(ch) {
    if (this.audioElements[ch]) {
      // In real implementation: stop the audio
      this.audioElements[ch] = null;
    }
    this.channelInfo[ch - 1] = [];
  }

  /**
   * Update the tick counter (call each frame)
   * @param {number} [ticks=1] - Number of ticks to advance
   */
  updateTicks(ticks = 1) {
    this.currentTicks += ticks;
  }

  /**
   * Check if a channel is free
   * @param {number} ch - Channel number (1-3)
   * @returns {boolean} True if channel is free
   */
  isChannelFree(ch) {
    return this.channels[ch] === 0;
  }

  /**
   * Get the current sound ID counter
   * @returns {number} The next sound ID that will be assigned
   */
  getNextSoundId() {
    return this.newSnd + 1;
  }
}

module.exports = XXSound;
