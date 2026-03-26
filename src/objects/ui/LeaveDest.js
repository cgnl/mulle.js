/**
 * @fileoverview LeaveDest - Leave destination behavior
 * Based on: BehaviorScript 26 - LeaveDest.ls
 * 
 * LeaveDest handles the transition when leaving a destination,
 * including stopping sounds and navigating to the world map.
 */

/**
 * LeaveDest class - handles leaving a destination
 * 
 * This behavior script is attached to frames that transition
 * from a destination back to the world map (movie "05").
 */
class LeaveDest {
  /**
   * Create a new LeaveDest behavior
   * 
   * @param {Object} dir - Director reference (gDir)
   * @param {Object} sound - Sound manager
   */
  constructor(dir, sound) {
    this.dir = dir;
    this.sound = sound;
  }

  /**
   * Exit frame handler
   * Lingo: on exitFrame
   * 
   * When testing, stays on current frame.
   * Otherwise, stops all sounds and navigates to world map.
   */
  exitFrame() {
    if (this.isTesting()) {
      // Stay on current frame during testing
      // Lingo: go(the frame)
      const currentFrame = this.dir.getCurrentFrame();
      this.dir.goToFrame(currentFrame);
    } else {
      // Stop all puppet sounds
      // Lingo: puppetSound(1, 0); puppetSound(2, 0); puppetSound(3, 0)
      this.sound.puppetSound(1, 0);
      this.sound.puppetSound(2, 0);
      this.sound.puppetSound(3, 0);
      
      // Reset sound 1 volume
      // Lingo: set the volume of sound 1 to 255
      this.sound.setVolume(1, 255);
      
      // Navigate to world map (movie "05", frame 1)
      // Lingo: go(1, "05")
      this.dir.goToMovie(1, '05');
    }
  }

  /**
   * Check if in testing mode
   * Lingo: the testing of gDir
   * 
   * @returns {boolean} True if testing
   */
  isTesting() {
    return this.dir.testing || false;
  }
}

module.exports = LeaveDest;
