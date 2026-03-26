/**
 * @fileoverview JunkViewHandler - Junk pile view management
 * Based on: ParentScript 27 - JunkViewHandler.ls
 * 
 * JunkViewHandler manages the junk pile view areas (Quay, Yard, Shelves)
 * including floor areas, max parts, and random positioning.
 */

/**
 * JunkViewHandler class - manages junk display areas
 * 
 * Lingo properties:
 *   floorList, maxList, maxSoundList, noOfShelfs
 */
class JunkViewHandler {
  /**
   * Create a new JunkViewHandler
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals;
    
    // Floor areas for each location
    // Lingo: set floorList to [#Quay: [rect(4, 475, 544, 476)], ...]
    this.floorList = {
      Quay: [{ left: 4, top: 475, right: 544, bottom: 476 }],
      Yard: [{ left: 4, top: 475, right: 636, bottom: 476 }],
      Shelf: [
        { left: 145, top: 94, right: 632, bottom: 95 },
        { left: 145, top: 209, right: 632, bottom: 210 },
        { left: 145, top: 314, right: 632, bottom: 315 },
        { left: 145, top: 409, right: 632, bottom: 410 }
      ]
    };
    
    // Maximum parts per location
    // Lingo: set maxList to [#Quay: 30, #Yard: 10, #Shelf: 80]
    this.maxList = {
      Quay: 30,
      Yard: 10,
      Shelf: 80
    };
    
    // Sound dialogs when locations are full
    // Lingo: set maxSoundList to [#Quay: ["00d007v0", "00d008v0"], ...]
    this.maxSoundList = {
      Quay: ['00d007v0', '00d008v0'],
      Yard: ['00d009v0', '03d008v0', '03d009v0', '03d010v0'],
      Shelf: ['03d011v0', '03d012v0', '03d014v0'],
      AllFull: ['03d015v0']
    };
    
    // Number of shelf locations
    // Lingo: set noOfShelfs to 6
    this.noOfShelfs = 6;
  }

  /**
   * Clean up the handler
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.floorList = null;
    this.maxList = null;
    this.maxSoundList = null;
    return null;
  }

  /**
   * Get maximum number of parts for a location
   * Lingo: on getMaxNoOfParts me, argWhere
   * 
   * @param {string} where - Location name (Quay, Yard, Shelf1-6)
   * @returns {number} Maximum number of parts
   */
  getMaxNoOfParts(where) {
    const whereKey = this._normalizeLocation(where);
    return this.maxList[whereKey];
  }

  /**
   * Check if a location is full
   * Lingo: on checkFull me, argWhere
   * 
   * @param {string} where - Location name
   * @returns {boolean} True if location is full
   */
  checkFull(where) {
    const maxNoOfParts = this.getMaxNoOfParts(where);
    const junkCount = this.globals.user.getJunk(where).length;
    return junkCount >= maxNoOfParts;
  }

  /**
   * Get floor area list for a location
   * Lingo: on getFloorList me, argWhere
   * 
   * @param {string} where - Location name
   * @returns {Array} Array of floor rectangles
   */
  getFloorList(where) {
    const whereKey = this._normalizeLocation(where);
    return this.floorList[whereKey];
  }

  /**
   * Get a random position for a part in a location
   * Lingo: on getRandomPosition me, argWhere, argPartID
   * 
   * @param {string} where - Location name
   * @param {string} partId - Part ID
   * @returns {Object} Position {x, y}
   */
  getRandomPosition(where, partId) {
    const partObj = this.globals.parts.getPart(partId);
    const whereKey = this._normalizeLocation(where);
    
    // Get the appropriate view
    let pic;
    if (whereKey === 'Shelf') {
      pic = partObj.getShelfView();
    } else {
      pic = partObj.getJunkView();
    }
    
    // Get member dimensions
    const dimensions = this._getMemberDimensions(pic);
    
    // Get floor list and pick random floor
    const floors = this.floorList[whereKey];
    const floor = floors[Math.floor(Math.random() * floors.length)];
    
    // Calculate position
    // Lingo: set tmpWidth to the right of tmpWhichFloor - the left of tmpWhichFloor - the width of tmpPicMember
    const floorWidth = floor.right - floor.left - dimensions.width;
    
    // Lingo: set newLeft to the left of tmpWhichFloor + random(tmpWidth) + (the width of tmpPicMember / 2)
    const newLeft = floor.left + Math.floor(Math.random() * Math.max(1, floorWidth)) + Math.floor(dimensions.width / 2);
    
    // Lingo: set newTop to the top of tmpWhichFloor - (the height of tmpPicMember / 2)
    const newTop = floor.top - Math.floor(dimensions.height / 2);
    
    return { x: newLeft, y: newTop };
  }

  /**
   * Get a random shelf that isn't full
   * Lingo: on getRandomShelf me
   * 
   * @returns {string} Shelf name or 'AllFull'
   */
  getRandomShelf() {
    const availableShelves = [];
    
    for (let i = 1; i <= this.noOfShelfs; i++) {
      const shelf = `Shelf${i}`;
      if (!this.checkFull(shelf)) {
        availableShelves.push(shelf);
      }
    }
    
    if (availableShelves.length > 0) {
      return availableShelves[Math.floor(Math.random() * availableShelves.length)];
    }
    
    return 'AllFull';
  }

  /**
   * Get a random sound for when a location is full
   * Lingo: on getMaxSound me, argWhere
   * 
   * @param {string} where - Location name
   * @returns {string} Sound/dialog ID
   */
  getMaxSound(where) {
    const whereKey = this._normalizeLocation(where);
    const sounds = this.maxSoundList[whereKey];
    return sounds[Math.floor(Math.random() * sounds.length)];
  }

  /**
   * Normalize location name (Shelf1-6 -> Shelf)
   * Lingo: char 1 to 5 of string(argWhere) = "Shelf"
   * @private
   * 
   * @param {string} where - Location name
   * @returns {string} Normalized location name
   */
  _normalizeLocation(where) {
    if (String(where).substring(0, 5) === 'Shelf') {
      return 'Shelf';
    }
    return where;
  }

  /**
   * Get dimensions of a member (mock for now)
   * @private
   * 
   * @param {string} memberName - Member name
   * @returns {Object} Dimensions {width, height}
   */
  _getMemberDimensions(memberName) {
    // This would normally look up actual sprite dimensions
    // For now return default dimensions
    return { width: 50, height: 30 };
  }
}

module.exports = JunkViewHandler;
