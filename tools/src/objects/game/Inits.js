/**
 * @fileoverview Inits - Game initialization utilities
 * Based on: MovieScript 6 - Inits.ls
 * 
 * Inits provides game initialization and lifecycle management:
 * - prepareMovie: Initialize all global systems
 * - startMovie: Start movie playback
 * - stopMovie: Clean up movie
 * - killall: Clean up all global systems
 * 
 * @example
 * const inits = new Inits(factories);
 * inits.prepareMovie('01');
 * inits.startMovie();
 * // ... game runs ...
 * inits.stopMovie();
 * inits.killAll();
 */

class Inits {
  /**
   * Creates a new Inits instance
   * @param {Object} factories - Factory functions for creating systems
   */
  constructor(factories) {
    this.factories = factories || {};
    
    // Global systems
    this.pathGlobals = null;
    this.mulleGlobals = null;
    this.cursor = null;
    this.sound = null;
    this.dir = null;
  }

  /**
   * Prepare movie - initialize all global systems
   * Lingo: on prepareMovie
   * @param {string} movieName - Current movie name
   */
  prepareMovie(movieName) {
    // Create PathGlobals if not exists
    if (!this.pathGlobals && this.factories.createPathGlobals) {
      this.pathGlobals = this.factories.createPathGlobals();
    }
    
    // Create MulleGlobals if not exists
    if (!this.mulleGlobals && this.factories.createMulleGlobals) {
      this.mulleGlobals = this.factories.createMulleGlobals();
      
      if (this.mulleGlobals.init) {
        this.mulleGlobals.init();
      }
      
      // Login user for non-11 movies (11 is the user selection screen)
      const moviePrefix = movieName ? movieName.substring(0, 2) : '';
      if (moviePrefix !== '11' && this.mulleGlobals.users && this.mulleGlobals.users.login) {
        this.mulleGlobals.users.login('Mulle');
      }
    }
    
    // Create CursorHandler if not exists
    if (!this.cursor && this.factories.createCursorHandler) {
      this.cursor = this.factories.createCursorHandler();
    }
    
    // Create Sound if not exists
    if (!this.sound && this.factories.createSound) {
      this.sound = this.factories.createSound();
    }
    
    // Create Dir if not exists
    if (!this.dir && this.factories.createDir) {
      this.dir = this.factories.createDir();
      
      if (this.dir.init) {
        this.dir.init();
      }
    }
  }

  /**
   * Start movie playback
   * Lingo: on startMovie
   */
  startMovie() {
    if (this.dir && this.dir.startMovie) {
      this.dir.startMovie();
    }
  }

  /**
   * Stop movie and clean up
   * Lingo: on stopMovie
   */
  stopMovie() {
    if (this.dir && this.dir.kill) {
      this.dir = this.dir.kill();
    }
  }

  /**
   * Kill all global systems
   * Lingo: on killall
   */
  killAll() {
    if (this.mulleGlobals && this.mulleGlobals.kill) {
      this.mulleGlobals = this.mulleGlobals.kill();
    }
    
    if (this.cursor && this.cursor.kill) {
      this.cursor = this.cursor.kill();
    }
    
    if (this.sound && this.sound.kill) {
      this.sound = this.sound.kill();
    }
    
    // Reset cursor (in real implementation: cursor(-1))
  }

  /**
   * Safely preload a member
   * Lingo: on safePreload argMemberName
   * @param {string} memberName - Member name to preload
   * @returns {boolean} True if preloaded successfully
   */
  safePreload(memberName) {
    if (this.memberExists && this.memberExists(memberName)) {
      if (this.preloadMember) {
        this.preloadMember(memberName);
      }
      return true;
    }
    return false;
  }

  /**
   * Handle sound cue passed event
   * Lingo: on CuePassed theChannel, theNumber, theName
   * @param {string} channel - Channel identifier
   * @param {number} number - Cue number
   * @param {string} name - Cue name
   */
  cuePassed(channel, number, name) {
    // Extract channel number from last character
    const channelNum = parseInt(String(channel).slice(-1));
    
    if (this.sendAllSprites) {
      this.sendAllSprites('spritecuePassed', channelNum, number, name);
    }
  }

  /**
   * Get all global systems
   * @returns {Object} All global systems
   */
  getGlobals() {
    return {
      pathGlobals: this.pathGlobals,
      mulleGlobals: this.mulleGlobals,
      cursor: this.cursor,
      sound: this.sound,
      dir: this.dir
    };
  }

  /**
   * Check if a member exists (to be overridden)
   * @param {string} memberName
   * @returns {boolean}
   */
  memberExists(memberName) {
    return false;
  }

  /**
   * Preload a member (to be overridden)
   * @param {string} memberName
   */
  preloadMember(memberName) {
    // Override in subclass
  }

  /**
   * Send event to all sprites (to be overridden)
   * @param {string} event
   * @param {...any} args
   */
  sendAllSprites(event, ...args) {
    // Override in subclass
  }
}

module.exports = Inits;
