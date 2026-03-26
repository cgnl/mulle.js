/**
 * @fileoverview JunkPart - Junk pile part sprite handler
 * Based on: ParentScript 14 - JunkPart.ls
 * 
 * JunkPart manages the display and interaction of parts in junk piles
 * (shelves, floors). Handles physics-based settling animation and
 * mouse interaction for picking up parts.
 * 
 * @example
 * const junkPart = new JunkPart(sprite, 'partId', {x: 100, y: 100}, reportObj, globals, sound);
 */

class JunkPart {
  /**
   * Creates a new JunkPart
   * Lingo: on new me, argSP, argPartID, argLoc, argReportObject
   * @param {Object} sprite - The sprite to display
   * @param {string} partId - The part ID
   * @param {{x: number, y: number}} loc - Initial location
   * @param {Object} reportObject - Object to report events to
   * @param {Object} globals - Game globals
   * @param {Object} sound - Sound handler
   */
  constructor(sprite, partId, loc, reportObject, globals, sound) {
    this.sprite = sprite;
    this.partId = partId;
    this.reportObject = reportObject;
    this.globals = globals;
    this.sound = sound;
    
    // Get part object
    const partObj = globals.parts ? globals.parts.getPart(partId) : null;
    
    // Determine which view to show (shelf or junk)
    const where = reportObject.getWhere ? reportObject.getWhere() : '';
    const isShelf = typeof where === 'string' && where.substring(0, 5) === 'Shelf';
    
    if (partObj) {
      if (isShelf) {
        this.picMember = partObj.getShelfView ? partObj.getShelfView() : null;
      } else {
        this.picMember = partObj.getJunkView ? partObj.getJunkView() : null;
      }
    } else {
      this.picMember = null;
    }
    
    // Get floor list for physics
    this.floorList = [];
    if (globals.junkViewHandler && globals.junkViewHandler.getFloorList) {
      this.floorList = globals.junkViewHandler.getFloorList(where);
    }
    
    // Physics properties
    this.isMoving = true;
    this.pointVel = { x: 0, y: 0 };
    this.horizontalDiff = 0;
    this.verticalDiff = 0;
    this.horizontalVel = 0;
    this.verticalVel = 0;
    
    // Calculate initial position and movement
    this._calculateMovement(loc);
    
    // Set sprite properties
    if (sprite) {
      sprite.member = this.picMember;
      sprite.loc = { ...loc };
    }
    
    // Mouse object for interaction
    this.mouseObject = {
      active: !this.isMoving
    };
    
    // Register with loop master
    if (globals.loopMaster && globals.loopMaster.addObject) {
      globals.loopMaster.addObject(this);
    }
  }

  /**
   * Calculates movement needed to settle on floor
   * @private
   */
  _calculateMovement(loc) {
    if (!this.floorList || this.floorList.length === 0) {
      this.isMoving = false;
      return;
    }
    
    // Simple bounding box (would be calculated from member in real implementation)
    const width = 50;
    const height = 50;
    const area = {
      left: loc.x - width / 2,
      right: loc.x + width / 2,
      top: loc.y - height / 2,
      bottom: loc.y + height / 2
    };
    
    for (const floor of this.floorList) {
      // Check if already on this floor
      if (area.bottom >= floor.top && 
          area.bottom <= floor.bottom && 
          area.left >= floor.left && 
          area.right <= floor.right) {
        this.isMoving = false;
        return;
      }
      
      // Calculate horizontal adjustment
      if (area.left < floor.left) {
        this.horizontalDiff = floor.left - area.left;
        this.horizontalVel = 4;
      } else if (area.right > floor.right) {
        this.horizontalDiff = floor.right - area.right;
        this.horizontalVel = -4;
      } else {
        this.horizontalDiff = 0;
        this.horizontalVel = 0;
      }
      
      // Calculate vertical adjustment
      if (area.bottom < floor.top) {
        this.verticalDiff = floor.top - area.bottom;
        this.verticalVel = 4;
        return;
      } else if (area.bottom > floor.bottom) {
        this.verticalDiff = floor.bottom - area.bottom;
        this.verticalVel = -4;
      } else {
        this.verticalDiff = 0;
        this.verticalVel = 0;
      }
    }
  }

  /**
   * Cleans up the junk part
   * Lingo: on kill me
   * @returns {null}
   */
  kill() {
    this.picMember = null;
    this.reportObject = null;
    this.floorList = null;
    
    // Remove from loop master
    if (this.globals && this.globals.loopMaster && this.globals.loopMaster.deleteObject) {
      this.globals.loopMaster.deleteObject(this);
    }
    
    // Kill mouse object
    if (this.mouseObject && this.mouseObject.kill) {
      this.mouseObject.kill();
    }
    this.mouseObject = null;
    
    return null;
  }

  /**
   * Loop update - handles settling animation
   * Lingo: on loop me
   */
  loop() {
    if (!this.isMoving) {
      return;
    }
    
    // Check if reached destination
    if (this.horizontalDiff === 0 && this.verticalDiff === 0) {
      this.isMoving = false;
      
      if (this.mouseObject) {
        this.mouseObject.active = true;
      }
      
      // Play drop sound
      if (this.globals && this.globals.parts) {
        const partObj = this.globals.parts.getPart(this.partId);
        if (partObj && partObj.getSndDropOn) {
          const where = this.reportObject && this.reportObject.getWhere 
            ? this.reportObject.getWhere() 
            : '';
          const dropSound = partObj.getSndDropOn(where);
          if (dropSound && this.sound && this.sound.play) {
            this.sound.play(dropSound, 'OPEFFECT');
          }
        }
      }
      return;
    }
    
    // Update horizontal movement
    if (Math.abs(this.pointVel.x + this.horizontalVel) <= Math.abs(this.horizontalDiff)) {
      this.pointVel.x += this.horizontalVel;
      this.horizontalDiff -= this.pointVel.x;
    } else {
      this.pointVel.x = this.horizontalDiff;
      this.horizontalDiff = 0;
    }
    
    // Update vertical movement
    if (Math.abs(this.pointVel.y + this.verticalVel) <= Math.abs(this.verticalDiff)) {
      this.pointVel.y += this.verticalVel;
      this.verticalDiff -= this.pointVel.y;
    } else {
      this.pointVel.y = this.verticalDiff;
      this.verticalDiff = 0;
    }
    
    // Move sprite
    if (this.sprite && this.sprite.loc) {
      this.sprite.loc.x += this.pointVel.x;
      this.sprite.loc.y += this.pointVel.y;
    }
  }

  /**
   * Handles mouse events
   * Lingo: on mouse me, argObj, argWhat
   * @param {Object} obj - Mouse object
   * @param {string} what - Event type ('down', 'up', etc.)
   */
  mouse(obj, what) {
    if (what === 'down') {
      // Deactivate mouse object
      if (this.mouseObject) {
        this.mouseObject.active = false;
      }
      
      // Hide sprite
      if (this.sprite) {
        this.sprite.member = 'Dummy';
      }
      
      // Report pickup
      if (this.reportObject && this.reportObject.pickedUp) {
        this.reportObject.pickedUp(this.partId, this.picMember);
      }
    }
  }

  /**
   * Gets the part ID
   * @returns {string}
   */
  getPartId() {
    return this.partId;
  }

  /**
   * Gets current location
   * @returns {{x: number, y: number}|null}
   */
  getLocation() {
    if (this.sprite && this.sprite.loc) {
      return { ...this.sprite.loc };
    }
    return null;
  }

  /**
   * Checks if part is on floor (not moving)
   * @returns {boolean}
   */
  isOnFloor() {
    return !this.isMoving;
  }

  /**
   * Sets mouse object active state
   * @param {boolean} active
   */
  setActive(active) {
    if (this.mouseObject) {
      this.mouseObject.active = active;
    }
  }
}

module.exports = JunkPart;
