/**
 * @fileoverview GameObject - Game world object
 * Based on: ParentScript 140 - Object.ls
 * 
 * GameObject represents objects in the game world with properties
 * for detection radii, sounds, animations, and conditions.
 */

/**
 * GameObject class - represents world objects
 * 
 * Lingo properties:
 *   ObjectId, type, InnerRadius, OuterRadius, customObject, DirResource,
 *   sounds, frameList, setWhenDone, checkFor, ifFound, spriteInfo,
 *   ancestor, active, myLoc, SPOver, SPUnder, optionalData, canEnter
 */
class GameObject {
  /**
   * Create a new GameObject
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   * @param {Object} dir - Director reference (gDir)
   */
  constructor(globals, dir) {
    this.globals = globals;
    this.dir = dir;
    
    // Object properties
    this.ObjectId = 0;
    this.type = 'none';
    this.InnerRadius = 0;
    this.OuterRadius = 0;
    this.customObject = '';
    this.DirResource = '';
    this.sounds = [];
    this.frameList = [];
    this.setWhenDone = {};
    this.checkFor = {};
    this.ifFound = 'none';
    this.spriteInfo = {};
    
    // Runtime state
    this.ancestor = null;
    this.active = true;
    this.SPOver = 0;
    this.SPUnder = 0;
    this.myLoc = { x: 0, y: 0 };
    this.optionalData = {};
    this.canEnter = true;
  }

  /**
   * Clean up
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    // Remove reference from mulle talk
    if (this.dir && this.dir.mulleTalkObject) {
      this.dir.mulleTalkObject.deleteReference(this);
    }
    
    // Kill ancestor
    if (this.ancestor) {
      if (this.dir && this.dir.mulleTalkObject) {
        this.dir.mulleTalkObject.deleteReference(this.ancestor);
      }
      if (this.ancestor.kill) {
        this.ancestor = this.ancestor.kill();
      } else {
        this.ancestor = null;
      }
    }
    
    return null;
  }

  /**
   * Initialize object
   * Lingo: on init me, theSprites, theLoc, theOptional, theCarLoc
   * 
   * @param {Array} sprites - [SPOver, SPUnder]
   * @param {Object} loc - Location {x, y}
   * @param {Object} optional - Optional data
   * @param {Object} carLoc - Car/boat location
   * @returns {number} 1 on success, 0 on failure
   */
  init(sprites, loc, optional, carLoc) {
    // Set sprites
    this.SPOver = sprites[0];
    this.SPUnder = sprites[1];
    this.myLoc = loc;
    this.optionalData = {};
    
    let tempDir = undefined;
    if (optional && typeof optional === 'object') {
      if (Object.keys(optional).length > 0) {
        this.optionalData = optional;
        tempDir = optional.direction;
      }
    }
    
    if (tempDir === undefined) {
      tempDir = 1;
    }
    
    // Handle directional frame lists
    if (this.frameList.length > 0) {
      const tempList = this.frameList[tempDir];
      if (Array.isArray(tempList)) {
        this.frameList = tempList;
      }
    }
    
    // Check conditions
    let lookUp = false;
    if (typeof this.ifFound === 'string' && this.ifFound !== 'none') {
      lookUp = true;
    }
    
    if (lookUp) {
      const foundOne = this._checkConditions();
      if (foundOne) {
        if (this.ifFound === 'NoDisplay') {
          return 0;
        } else if (this.ifFound === 'NoEnter') {
          this.canEnter = false;
        }
      }
    }
    
    // Apply optional radii
    if (optional && typeof optional.InnerRadius === 'number') {
      this.InnerRadius = optional.InnerRadius;
    }
    if (optional && typeof optional.OuterRadius === 'number') {
      this.OuterRadius = optional.OuterRadius;
    }
    
    // Initialize ancestor
    if (this.ancestor && this.ancestor.init) {
      this.ancestor.init(carLoc);
    }
    
    return 1;
  }

  /**
   * Check conditions for display/entry
   * @private
   * 
   * @returns {boolean} True if condition found
   */
  _checkConditions() {
    for (const [prop, value] of Object.entries(this.checkFor)) {
      let tempVal = Array.isArray(value) ? [...value] : [value];
      
      switch (prop) {
        case 'Inventory':
          for (const item of tempVal) {
            if (this.globals.user.isInInventory(item)) {
              return true;
            }
          }
          break;
          
        case 'medals':
          for (const medal of tempVal) {
            if (this.globals.user.boat.getMedal(medal)) {
              return true;
            }
          }
          break;
          
        case 'missions':
          for (const mission of tempVal) {
            if (this.globals.user.isMissionCompleted(mission)) {
              return true;
            }
          }
          break;
          
        case 'NotGivenMissions':
          for (const mission of tempVal) {
            if (!this.globals.user.isMissionGiven(mission)) {
              return true;
            }
          }
          break;
          
        case 'NotCompletedMissions':
          for (const mission of tempVal) {
            if (!this.globals.user.isMissionCompleted(mission)) {
              return true;
            }
          }
          break;
          
        case 'parts':
          return !this.getOnePart('checkFor');
          
        case 'BoatProp':
          for (const prop of tempVal) {
            if (!(this.dir.boat.quickProps[prop] > 0)) {
              return true;
            }
          }
          break;
      }
    }
    
    return false;
  }

  /**
   * Get one available part
   * Lingo: on getOnePart me, where
   * 
   * @param {string} where - 'setWhenDone' or 'checkFor'
   * @returns {number} Part ID or 0
   */
  getOnePart(where) {
    let tempVal;
    if (where === 'setWhenDone') {
      tempVal = this.setWhenDone.parts;
    } else {
      tempVal = this.checkFor.parts;
    }
    
    if (!tempVal) return 0;
    if (!Array.isArray(tempVal)) {
      tempVal = [tempVal];
    }
    tempVal = [...tempVal];
    
    // Check for random flag
    let tempRandomPart = false;
    const randomIdx = tempVal.indexOf('random');
    if (randomIdx >= 0) {
      tempRandomPart = true;
      tempVal.splice(randomIdx, 1);
    }
    
    // Check available parts
    const available = this.globals.externalParts.getCurrentlyAvailable('Destinations');
    for (const partId of tempVal) {
      if (available.includes(partId)) {
        return partId;
      }
    }
    
    // Try random part if allowed
    if (tempRandomPart) {
      const randomPart = this.globals.externalParts.getRandomPart();
      if (randomPart !== 'NoPart') {
        return randomPart;
      }
    }
    
    return 0;
  }

  // Getters

  getId() {
    return this.ObjectId;
  }

  getCacheProp() {
    return this.setWhenDone.Cache;
  }

  getOptionalData(prop) {
    if (prop === undefined) {
      return this.optionalData;
    }
    if (this.optionalData && typeof this.optionalData === 'object') {
      return this.optionalData[prop];
    }
    return undefined;
  }

  getGiftParts() {
    return this.setWhenDone.parts;
  }

  getSetWhenDone(what) {
    if (what === undefined) {
      return { ...this.setWhenDone };
    }
    return this.setWhenDone[what];
  }

  getCheckFor(what) {
    if (what === undefined) {
      return { ...this.checkFor };
    }
    return this.checkFor[what];
  }

  getType() {
    return this.type;
  }

  getLoc() {
    return this.myLoc;
  }

  getSpritesInfo() {
    return this.spriteInfo;
  }

  getInnerRadius() {
    return this.InnerRadius;
  }

  getOuterRadius() {
    return this.OuterRadius;
  }

  getDirResource() {
    return this.DirResource;
  }

  getFrameList() {
    return this.frameList;
  }

  /**
   * Convert to list
   * Lingo: on toList me
   * 
   * @returns {Array} Object properties
   */
  toList() {
    return [
      this.ObjectId,
      this.type,
      this.InnerRadius,
      this.OuterRadius,
      this.customObject,
      this.DirResource,
      this.sounds,
      this.frameList,
      this.setWhenDone,
      this.checkFor,
      this.ifFound
    ];
  }

  /**
   * Load from database
   * Lingo: on fromList me, theid
   * 
   * @param {number} id - Object ID
   * @returns {number} 1 on success, 0 on failure
   */
  fromList(id) {
    const objectData = this._loadObjectDB(id);
    if (!objectData) {
      return 0;
    }
    
    this.ObjectId = objectData.ObjectId || 0;
    this.type = objectData.type || 'none';
    this.InnerRadius = objectData.InnerRadius || 0;
    this.OuterRadius = objectData.OuterRadius || 0;
    this.customObject = objectData.customObject || '';
    this.DirResource = objectData.DirResource || '';
    this.sounds = objectData.sounds || [];
    this.frameList = objectData.frameList || [];
    this.setWhenDone = objectData.setWhenDone || {};
    this.checkFor = objectData.checkFor || {};
    this.ifFound = objectData.ifFound || 'none';
    this.spriteInfo = objectData.spriteInfo || { Under: 1 };
    
    // Ensure checkFor and setWhenDone are objects
    if (!this.checkFor || typeof this.checkFor !== 'object') {
      this.checkFor = {};
    }
    if (!this.setWhenDone || typeof this.setWhenDone !== 'object') {
      this.setWhenDone = {};
    }
    
    // Create ancestor
    if (this.customObject && this.customObject.length > 0) {
      this.ancestor = this._createCustomObject(this.customObject);
      if (!this.ancestor) {
        return 0;
      }
    } else {
      this.ancestor = this._createDestination();
    }
    
    return 1;
  }

  /**
   * Load object database (stub)
   * @private
   * 
   * @param {number} id - Object ID
   * @returns {Object|null} Object data
   */
  _loadObjectDB(id) {
    // Would load from member "Object{id}DB"
    return null;
  }

  /**
   * Create custom object (stub)
   * @private
   * 
   * @param {string} name - Custom object name
   * @returns {Object|null} Custom object
   */
  _createCustomObject(name) {
    // Would create custom script object
    return { init: () => {} };
  }

  /**
   * Create destination (stub)
   * @private
   * 
   * @returns {Object} Destination object
   */
  _createDestination() {
    // Would create new Destination(this)
    return { init: () => {} };
  }
}

module.exports = GameObject;
