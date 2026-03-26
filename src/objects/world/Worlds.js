/**
 * @fileoverview Worlds - World collection manager
 * Based on: ParentScript 136 - Worlds.ls
 * 
 * Worlds manages the collection of game worlds and tracks
 * the active/last world for navigation.
 */

/**
 * Worlds class - manages collection of game worlds
 * 
 * Lingo properties:
 *   worlds, activeWorld, lastWorld
 */
class Worlds {
  /**
   * Create a new Worlds manager
   * Lingo: on new me
   */
  constructor() {
    // List of world data/IDs
    // Lingo: set worlds to []
    this.worlds = [];
    
    // Currently active world
    // Lingo: set activeWorld to 0
    this.activeWorld = null;
    
    // Previously active world
    // Lingo: set lastWorld to 0
    this.lastWorld = null;
  }

  /**
   * Clean up
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.worlds = null;
    return null;
  }

  /**
   * Get number of worlds
   * Lingo: on nrOfWorlds me
   * 
   * @returns {number} Number of worlds
   */
  nrOfWorlds() {
    return this.worlds.length;
  }

  /**
   * Check if current world is same as last
   * Lingo: on isSameWorld me
   * 
   * @returns {boolean} True if active world equals last world
   */
  isSameWorld() {
    if (!this.activeWorld) {
      return false;
    }
    return this.activeWorld === this.lastWorld;
  }

  /**
   * Get symbols for all worlds
   * Lingo: on getWorldSymbols me
   * 
   * @returns {Array} Array of [symbol, worldData] pairs
   */
  getWorldSymbols() {
    const symbolList = [];
    
    for (const worldData of this.worlds) {
      const tempWorld = this._createWorld();
      if (tempWorld.fromList(worldData)) {
        symbolList.push([tempWorld.getSymbol(), worldData]);
      }
    }
    
    return [...symbolList]; // Return copy
  }

  /**
   * Load a world by ID
   * Lingo: on loadWorld me, world, WorldId
   * 
   * @param {Object} world - World object to load into
   * @param {*} worldId - World ID to load
   * @returns {number|string} 0 on success, error code on failure
   */
  loadWorld(world, worldId) {
    // Validate world object
    if (!world || typeof world !== 'object') {
      return 'InvalidObject';
    }
    
    // Check if world ID exists
    if (!this.worlds.includes(worldId)) {
      return 'InvalidId';
    }
    
    // Load world data
    if (world.fromList(worldId)) {
      this.lastWorld = worldId;
      this.activeWorld = worldId;
      return 0;
    }
    
    return 'InvalidMember';
  }

  /**
   * Convert to list for saving
   * Lingo: on toList me
   * 
   * @returns {Array} Worlds array
   */
  toList() {
    return this.worlds;
  }

  /**
   * Load from list
   * Lingo: on fromList me, objectList
   * 
   * @param {Array} objectList - Worlds array to load
   */
  fromList(objectList) {
    this.worlds = objectList;
  }

  /**
   * Get active world
   * @returns {*} Active world ID
   */
  getActiveWorld() {
    return this.activeWorld;
  }

  /**
   * Get last world
   * @returns {*} Last world ID
   */
  getLastWorld() {
    return this.lastWorld;
  }

  /**
   * Create a World object (factory for testing)
   * @private
   * 
   * @returns {Object} World instance
   */
  _createWorld() {
    // In real implementation: return new World()
    return {
      fromList: () => true,
      getSymbol: () => 'Unknown'
    };
  }
}

module.exports = Worlds;
