/**
 * @fileoverview LevelHandler - Level progression management
 * Based on: ParentScript 31 - LevelHandler.ls
 * 
 * LevelHandler manages game progression levels based on built boats,
 * collected parts, and inventory items.
 */

/**
 * LevelHandler class - manages level progression
 * 
 * Lingo properties:
 *   level, lockLevel, minBuiltBoats, partsRequired, inventoryRequired
 */
class LevelHandler {
  /**
   * Create a new LevelHandler
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals;
    
    // Set initial level and lock state
    // Lingo: setLevel(me, 0)
    this.level = 0;
    
    // Lingo: setlockLevel(me, 0)
    this.lockLevel = false;
    
    // Minimum boats built for each level
    // Lingo: set minBuiltBoats to [0, 6, 9, 12, 15]
    this.minBuiltBoats = [0, 6, 9, 12, 15];
    
    // Parts required for each level (1-indexed in Lingo, 0-indexed here)
    // Lingo: set partsRequired to [[], [], [30], [17, 46], [975]]
    this.partsRequired = [
      [],         // Level 1: no parts required
      [],         // Level 2: no parts required
      [30],       // Level 3: requires part 30
      [17, 46],   // Level 4: requires parts 17 and 46
      [975]       // Level 5: requires part 975
    ];
    
    // Inventory items required for each level
    // Lingo: set inventoryRequired to [[], [], [], [#MapPiece1], [#helmet, #Suit, #Fishingrod, #MapPiece2, #MapPiece3]]
    this.inventoryRequired = [
      [],                                                           // Level 1
      [],                                                           // Level 2
      [],                                                           // Level 3
      ['MapPiece1'],                                                // Level 4
      ['helmet', 'Suit', 'Fishingrod', 'MapPiece2', 'MapPiece3']   // Level 5
    ];
  }

  /**
   * Clean up the handler
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.minBuiltBoats = null;
    this.partsRequired = null;
    this.inventoryRequired = null;
    return null;
  }

  /**
   * Set the current level
   * Lingo: on setLevel me, argLevel
   * 
   * @param {number} level - Level to set
   */
  setLevel(level) {
    this.level = level;
  }

  /**
   * Set the lock level state
   * Lingo: on setlockLevel me, argStatus
   * 
   * @param {boolean} status - Lock status
   */
  setLockLevel(status) {
    this.lockLevel = status;
  }

  /**
   * Lingo alias: on setlockLevel me, argStatus
   * Preserve original casing for parity.
   *
   * @param {boolean} status - Lock status
   */
  setlockLevel(status) {
    return this.setLockLevel(status)
  }

  /**
   * Check if user has all required parts for a level
   * Lingo: on gotParts me, argLevel
   * 
   * @param {number} level - Level to check (1-indexed)
   * @returns {boolean} True if user has all required parts
   */
  gotParts(level) {
    // Convert to 0-indexed
    const partsList = this.partsRequired[level - 1];
    
    for (const part of partsList) {
      if (!this.globals.user.gotPart(part)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Check if user has all required inventory for a level
   * Lingo: on gotInventory me, argLevel
   * 
   * @param {number} level - Level to check (1-indexed)
   * @returns {boolean} True if user has all required inventory
   */
  gotInventory(level) {
    // Convert to 0-indexed
    const inventoryList = this.inventoryRequired[level - 1];
    
    for (const item of inventoryList) {
      if (!this.globals.user.isInInventory(item)) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Update the level based on user progress
   * Lingo: on updateLevel me
   */
  updateLevel() {
    const nrOfBuiltBoats = this.globals.user.getNrOfBuiltBoats();
    
    // Check each level (1-indexed in Lingo)
    for (let i = 0; i < this.minBuiltBoats.length; i++) {
      const levelNum = i + 1;
      const minBoats = this.minBuiltBoats[i];
      
      if (nrOfBuiltBoats >= minBoats && 
          this.gotParts(levelNum) && 
          this.gotInventory(levelNum)) {
        this.setLevel(levelNum);
      }
    }
  }

  /**
   * Get current level (updates if not locked)
   * Lingo: on getLevel me
   * 
   * @returns {number} Current level
   */
  getLevel() {
    if (!this.lockLevel) {
      this.updateLevel();
    }
    return this.level;
  }
}

module.exports = LevelHandler;
