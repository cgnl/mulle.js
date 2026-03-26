/**
 * @fileoverview BoatHandler - Boat management handler
 * Based on: ParentScript 28 - BoatHandler.ls
 * 
 * BoatHandler manages the boat building interface, including drawing parts,
 * picking up/dropping parts, and handling the drag and drop logic.
 */

const BoatPart = require('../ui/BoatPart');
const DragScript = require('../input/DragScript');

/**
 * BoatHandler class - manages boat building interface
 * 
 * Lingo properties:
 *   boatObjects, dragObject
 */
class BoatHandler {
  /**
   * Create a new BoatHandler
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   * @param {Object} dir - Director reference (gDir)
   * @param {Object} sound - Sound handler (gSound)
   */
  constructor(globals, dir, sound) {
    this.globals = globals;
    this.dir = dir;
    this.sound = sound;
    
    // Lingo: set boatObjects to []
    this.boatObjects = [];
    
    // Lingo: set dragObject to 0
    this.dragObject = 0;
  }

  /**
   * Clean up all boat objects
   * Lingo: on cleanUp me
   */
  cleanUp() {
    // Kill all boat objects
    for (const obj of this.boatObjects) {
      if (obj && obj.kill) {
        obj.kill();
      }
    }
    this.boatObjects = [];
  }

  /**
   * Kill this handler
   * Lingo: on kill me
   * 
   * @returns {number} Always returns 0
   */
  kill() {
    this.cleanUp();
    return 0;
  }

  /**
   * Draw all boat parts
   * Lingo: on drawParts me
   */
  drawParts() {
    this.cleanUp();

    // Lingo line 24-26: restore Water sprite if Dummy
    if (this.dir && this.dir.spriteList && this.dir.spriteList.Water) {
      const waterSP = this.dir.spriteList.Water;
      const current = this._getSpriteMember(waterSP);
      if (current === 'Dummy') {
        this._setSpriteMember(waterSP, '04b003v0');
      }
    }
    
    // Get boat and update properties
    const boat = this.globals.user.getBoat();
    boat.updateProperties();
    
    // Calculate draw point
    // Lingo: set tmpDrawPoint to point(315, 210) + getDrawOffset(the boatViewHandler of gMulleGlobals, #Quay)
    const drawOffset = this.globals.boatViewHandler.getDrawOffset('Quay');
    const drawPoint = {
      x: 315 + drawOffset.x,
      y: 210 + drawOffset.y
    };
    
    // Get parts and create BoatPart objects
    const parts = boat.getParts();
    for (const partId of parts) {
      const boatPart = this._createBoatPart(partId, drawPoint, this);
      this.boatObjects.push(boatPart);
    }
  }

  /**
   * Handle picking up a part from the boat
   * Lingo: on pickedUp me, argPartID
   * 
   * @param {string} partId - The part ID being picked up
   */
  pickedUp(partId) {
    const boat = this.globals.user.getBoat();
    
    // Clear and rebuild boat
    boat.clearBoat();
    boat.deletePart(partId);
    boat.rebuild();
    
    // Get part info
    const partObj = this.globals.parts.getPart(partId);
    const pic = partObj.getJunkView();
    const sndBoat = partObj.getSndAttachOnBoat();
    const master = partObj.getMaster();
    
    // Use master ID if available
    let dragPartId = partId;
    if (master) {
      dragPartId = master;
    }
    
    // Play attach sound
    if (sndBoat && sndBoat.length > 0) {
      this.sound.play(sndBoat, 'OPEFFECT');
    }
    
    // Create drag object
    this.dragObject = this._createDragScript(this, dragPartId, pic, 'Quay');
    
    // Redraw parts
    this.drawParts();
  }

  /**
   * Handle dropping a part
   * Lingo: on dropped me, argPartID, argLoc
   * 
   * @param {string} partId - The part ID being dropped
   * @param {Object} loc - Drop location {x, y}
   */
  dropped(partId, loc) {
    // Kill drag object if exists
    if (this.dragObject) {
      this.dragObject = this.dragObject.kill();
    }
    
    // Check where we're dropping
    const toWhere = this.globals.mouseMaster.getToWhere();
    
    // Check if dropping on boat
    if (String(toWhere).substring(0, 4) === 'Boat') {
      const partObj = this.globals.parts.getPart(partId);
      
      // Handle morph parts
      let dropPartId = partId;
      let orgPartId = partId;
      
      if (!partObj.isMaster() && !partObj.isNormalpart()) {
        orgPartId = partId;
        const snapPoint = String(toWhere).substring(4, 6);
        dropPartId = partObj.getMorphToSnap(snapPoint);
      }
      
      if (dropPartId !== 'error') {
        const boat = this.globals.user.getBoat();
        
        // Check load and stability limits
        const loadLimit = boat.getProperty('LoadCapacity') / 10;
        const futureLoad = boat.getCurrentLoadCapacity() - partObj.getProperty('weight');
        
        const hullObj = this.globals.parts.getPart(boat.getHull());
        const stabilityLimit = hullObj.getProperty('Stability') / 10;
        const futureStability = boat.getProperty('Stability') + partObj.getProperty('Stability');
        
        if (futureLoad < 0 || futureStability < 0) {
          // Boat will sink
          const master = partObj.getMaster();
          let junkPartId = partId;
          if (typeof master === 'number' && master > 0) {
            junkPartId = master;
          }
          this.globals.user.addJunkPart('Quay', junkPartId, { x: 300, y: 300 });
          // Lingo line 82: go("Sink")
          this._go('Sink');
        } else {
          // Check warnings
          if (futureLoad <= loadLimit) {
            this.dir.makeMulleTalk('04d048v0');
          } else if (futureStability <= stabilityLimit) {
            this.dir.makeMulleTalk('04d056v0');
          }
          
          // Add part to boat
          boat.addPart(dropPartId);
          this.drawParts();
        }
      } else {
        // Error with morph - add to junk
        this.globals.user.addJunkPart('Quay', orgPartId, loc);
        this.dir.junkHandler.drawParts();
      }
    } else {
      // Not dropping on boat - delegate to junk handler
      this.dir.junkHandler.dropped(partId, loc);
    }
  }

  /**
   * Get boat objects
   * @returns {Array} Array of boat part objects
   */
  getBoatObjects() {
    return this.boatObjects;
  }

  /**
   * Get current drag object
   * @returns {Object|null} The drag object or null
   */
  getDragObject() {
    return this.dragObject;
  }

  /**
   * Create a BoatPart object (factory method for testing)
   * @private
   * 
   * @param {string} partId - Part ID
   * @param {Object} drawPoint - Draw point {x, y}
   * @param {Object} handler - This handler
   * @returns {Object} BoatPart instance
   */
  _createBoatPart(partId, drawPoint, handler) {
    return new BoatPart(partId, drawPoint, handler, this.globals, this.dir);
  }

  /**
   * Create a DragScript object (factory method for testing)
   * @private
   * 
   * @param {Object} handler - This handler
   * @param {string} partId - Part ID
   * @param {string} member - Sprite member
   * @param {string} where - Where (Quay, etc)
   */
  _createDragScript(handler, partId, member, where) {
    return new DragScript(handler, partId, member, where, this.globals, this.dir, this.sound);
  }

  _go(frame) {
    if (this.dir && typeof this.dir.go === 'function') {
      this.dir.go(frame);
    }
  }

  _setSpriteMember(sp, member) {
    if (!this.dir || !sp) return;
    if (!this.dir._spriteMembers) this.dir._spriteMembers = {};
    this.dir._spriteMembers[sp] = member;
  }

  _getSpriteMember(sp) {
    if (!this.dir || !sp) return undefined;
    return this.dir._spriteMembers ? this.dir._spriteMembers[sp] : undefined;
  }
}

module.exports = BoatHandler;
