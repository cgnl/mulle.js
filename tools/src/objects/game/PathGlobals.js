/**
 * PathGlobals - Stores global path information
 * Based on: ParentScript 35 - PathGlobals.ls
 *
 * Very simple class that just stores the base path for assets.
 */
class PathGlobals {
  /**
   * Create a new PathGlobals instance
   * Lingo: on new me
   * @param {string} [moviePath=''] - The base path (moviePath in Director)
   */
  constructor(moviePath = '') {
    /** @type {string} */
    this.boatPath = moviePath;
  }

  /**
   * Get the boat/movie path
   * @returns {string} The stored path
   */
  getBoatPath() {
    return this.boatPath;
  }

  /**
   * Set the boat/movie path
   * @param {string} path - The path to set
   */
  setBoatPath(path) {
    this.boatPath = path;
  }

  /**
   * Clean up the path globals
   * Lingo: on kill me
   * @returns {number} Always returns 0
   */
  kill() {
    // Lingo: on kill me → return 0
    // Does NOT clear boatPath — only returns 0
    // The caller sets the reference to 0: set x = kill(x)
    return 0;
  }
}

module.exports = PathGlobals;
