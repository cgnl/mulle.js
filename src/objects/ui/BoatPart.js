/**
 * @fileoverview BoatPart - Boat part display handler
 * Based on: ParentScript 29 - BoatPart.ls
 * 
 * BoatPart manages the display of parts attached to the boat.
 * Handles multiple sprite layers (front/back, inside/outside) and
 * mouse interaction for picking up and manipulating parts.
 * 
 * Special handling exists for:
 * - Hull parts (front/back layers, inside views)
 * - Rudder parts (front/back layers)
 * - Regular parts (snap point based positioning)
 * 
 * @example
 * const boatPart = new BoatPart('partId', {x: 100, y: 100}, reportObj, globals, dir);
 */

const MouseObject = require('../input/MouseObject');

class BoatPart {
  /**
   * Creates a new BoatPart
   * Lingo: on new me, argPartID, argOffset, argReportObject
   * @param {string} partId - The part ID
   * @param {{x: number, y: number}} offset - Position offset
   * @param {Object} reportObject - Object to report events to
   * @param {Object} globals - Game globals
   * @param {Object} dir - Director reference for sprite list
   */
  constructor(partId, offset, reportObject, globals, dir) {
    this.partId = partId;
    this.reportObject = reportObject;
    this.globals = globals;
    this.dir = dir;
    
    // Sprite channel references
    this.useViewSP = 0;
    this.useView2SP = 0;
    this.useViewInsideSP = 0;
    this.useViewInside2SP = 0;
    
    // Member references
    this.useViewMember = null;
    this.useView2Member = null;
    this.useViewInsideMember = null;
    this.useViewInside2Member = null;
    
    // Position
    this.currentOffset = { x: 0, y: 0 };
    
    // Mouse objects for interaction
    this.mouseObjectList = [];
    
    // Get start sprite channel
    this.startSP = 0;
    if (dir && dir.spriteList && dir.spriteList.BoatStart) {
      this.startSP = dir.spriteList.BoatStart - 1;
    }
    
    // Get boat and part objects
    const boat = globals.user ? globals.user.getBoat() : null;
    const partObj = globals.parts ? globals.parts.getPart(partId) : null;
    
    if (!partObj || !boat) {
      return;
    }
    
    // Store references for later checks
    this._hullId = boat.getHull ? boat.getHull() : null;
    this._rudderId = boat.getRudder ? boat.getRudder() : null;
    
    // Get part offset
    const partOffset = partObj.getOffset ? partObj.getOffset() : { x: 0, y: 0 };
    
    // Handle based on part type
    if (partId === this._hullId || partId === this._rudderId) {
      // Special handling for hull and rudder
      this._setupHullOrRudder(partId, offset, partOffset, partObj, boat);
    } else {
      // Regular part handling
      this._setupRegularPart(offset, partOffset, partObj, boat);
    }
  }

  /**
   * Sets up hull or rudder part
   * @private
   */
  _setupHullOrRudder(partId, offset, partOffset, partObj, boat) {
    this.currentOffset = {
      x: offset.x + partOffset.x,
      y: offset.y + partOffset.y
    };
    
    if (partId === this._hullId) {
      // Hull setup
      this.useViewSP = this.startSP + (this.globals.HullFrontOffset || 1);
      this.useView2SP = this.startSP + (this.globals.HullBackOffset || 2);
      
      this.useViewMember = partObj.getUseView ? partObj.getUseView() : null;
      this.useView2Member = partObj.getUseView2 ? partObj.getUseView2() : null;
      this._setSpriteMember(this.useViewSP, this.useViewMember);
      this._setSpriteMember(this.useView2SP, this.useView2Member);
      
      // Check for inside views
      const insideView = partObj.getUseViewInside ? partObj.getUseViewInside() : '';
      if (insideView && insideView.length > 0) {
        this.useViewInsideSP = this.startSP + (this.globals.hullFrontInsideOffset || 3);
        this.useViewInside2SP = this.startSP + (this.globals.hullBackInsideOffset || 4);
        this.useViewInsideMember = insideView;
        this.useViewInside2Member = partObj.getUseViewInside2 ? partObj.getUseViewInside2() : null;
        this._setSpriteMember(this.useViewInsideSP, this.useViewInsideMember);
        this._setSpriteMember(this.useViewInside2SP, this.useViewInside2Member);

        // .ls lines 84-88: clickable hull mouse area
        this.mouseObjectList.push(new MouseObject(
          this,
          this._createAreaListForMember(this.useViewInside2Member),
          this.useViewSP,
          {
            cursor: { rollOver: 'Clickable' },
            Leave: { Pic: partObj.getUseView ? partObj.getUseView() : 'Dummy', insideCheck: 1 },
            SP: this.useViewSP,
            dragToWhere: 'Hull',
            report: true
          },
          this.globals
        ));
      }
    } else {
      // Rudder setup
      const useView2 = partObj.getUseView2 ? partObj.getUseView2() : '';
      
      if (useView2 && useView2.length > 0) {
        this.useViewSP = this.startSP + (this.globals.rudderFrontOffset || 5);
        this.useView2SP = this.startSP + (this.globals.rudderBackOffset || 6);
        this.useViewMember = partObj.getUseView ? partObj.getUseView() : null;
        this.useView2Member = useView2;
        this._setSpriteMember(this.useViewSP, this.useViewMember);
        this._setSpriteMember(this.useView2SP, this.useView2Member);
      } else {
        this.useViewSP = this.startSP + (this.globals.rudderBackOffset || 6);
        this.useViewMember = partObj.getUseView ? partObj.getUseView() : null;
        this._setSpriteMember(this.useViewSP, this.useViewMember);
      }
    }
  }

  /**
   * Sets up regular part
   * @private
   */
  _setupRegularPart(offset, partOffset, partObj, boat) {
    // Get required snap points
    const snaps = partObj.getRequiredPoints ? partObj.getRequiredPoints() : [];
    const firstSnapPoint = snaps.length > 0 ? snaps[0] : null;
    
    if (!firstSnapPoint) {
      return;
    }
    
    // Get snap info from boat
    let useLayers = [1, 2];
    let snapOffset = { x: 0, y: 0 };
    
    if (boat.getSnapInfo) {
      const layersInfo = boat.getSnapInfo(firstSnapPoint, 'layers');
      const offsetInfo = boat.getSnapInfo(firstSnapPoint, 'offset');
      
      if (layersInfo && layersInfo.layers) {
        useLayers = layersInfo.layers;
      } else if (Array.isArray(layersInfo)) {
        useLayers = layersInfo;
      }
      
      if (offsetInfo && typeof offsetInfo === 'object') {
        snapOffset = offsetInfo.offset || offsetInfo;
      }
    }
    
    // Calculate current offset
    this.currentOffset = {
      x: offset.x + partOffset.x + (snapOffset.x || 0),
      y: offset.y + partOffset.y + (snapOffset.y || 0)
    };
    
    // Set up primary sprite
    this.useViewSP = this.startSP + useLayers[0];
    this.useViewMember = partObj.getUseView ? partObj.getUseView() : null;
    this._setSpriteMember(this.useViewSP, this.useViewMember);
    
    // Check if new points are free (determines if mouse object should be created)
    const newPoints = partObj.getNewPoints ? partObj.getNewPoints() : [];
    let makeMouseObject = true;
    
    if (Array.isArray(newPoints) && newPoints.length > 0) {
      const newPointIds = newPoints.map(np => Array.isArray(np) ? np[0] : np);
      if (boat.areTheseFree) {
        makeMouseObject = boat.areTheseFree(newPointIds);
      }
    }
    
    // Set up secondary sprite if exists
    const useView2 = partObj.getUseView2 ? partObj.getUseView2() : '';
    if (useView2 && useView2.length > 0 && useLayers.length > 1) {
      this.useView2SP = this.startSP + useLayers[1];
      this.useView2Member = useView2;
      this._setSpriteMember(this.useView2SP, this.useView2Member);
    }
    
    // Store makeMouseObject flag for later use
    this._makeMouseObject = makeMouseObject;

    // .ls lines 44-49 + 56-61: create drag MouseObject(s) when allowed
    if (this._makeMouseObject) {
      this.mouseObjectList.push(new MouseObject(
        this,
        this._createAreaListForMember(this.useViewMember),
        this.useViewSP,
        {
          cursor: { rollOver: 'Grabable', drag: 'Grabbed' },
          SP: this.useViewSP,
          isDragObject: true,
          report: true
        },
        this.globals
      ));

      if (this.useView2SP > 0 && this.useView2Member) {
        this.mouseObjectList.push(new MouseObject(
          this,
          this._createAreaListForMember(this.useView2Member),
          this.useView2SP,
          {
            cursor: { rollOver: 'Grabable', drag: 'Grabbed' },
            SP: this.useView2SP,
            isDragObject: true,
            report: true
          },
          this.globals
        ));
      }
    }
  }

  /**
   * Cleans up the boat part
   * Lingo: on kill me
   * @returns {null}
   */
  kill() {
    this.useViewMember = 0;
    this.useView2Member = 0;
    this.useViewInsideMember = 0;
    this.useViewInside2Member = 0;
    this.reportObject = 0;
    
    // Kill all mouse objects
    if (this.mouseObjectList) {
      for (const mouseObj of this.mouseObjectList) {
        if (mouseObj && mouseObj.kill) {
          mouseObj.kill();
        }
      }
    }
    this.mouseObjectList = 0;
    
    return 0;
  }

  /**
   * Handles mouse events
   * Lingo: on mouse me, argObj, argWhat
   * @param {Object} obj - Mouse object with dragToWhere property
   * @param {string} what - Event type ('down', 'click', 'enter', 'leave')
   */
  mouse(obj, what) {
    const dragToWhere = obj ? obj.dragToWhere : null;
    
    // Non-hull drag handling
    if (dragToWhere !== 'Hull') {
      if (what === 'down') {
        // Deactivate all mouse objects
        for (const mouseObj of (this.mouseObjectList || [])) {
          if (mouseObj) {
            mouseObj.active = false;
          }
        }

        // .ls line 130-133: hide useView sprites while dragging
        this._setSpriteMember(this.useViewSP, 'Dummy');
        if (this.useView2SP > 0) {
          this._setSpriteMember(this.useView2SP, 'Dummy');
        }
        
        // Report pickup
        if (this.reportObject && this.reportObject.pickedUp) {
          this.reportObject.pickedUp(this.partId);
        }
      }
    } else {
      // Hull-specific handling
      switch (what) {
        case 'click':
          // .ls line 139-141
          this._setSpriteMember(this.startSP + (this.globals.HullFrontOffset || 1), 'Dummy');
          if (this.dir && this.dir.spriteList && this.dir.spriteList.Water) {
            this._setSpriteMember(this.dir.spriteList.Water, 'Dummy');
          }
          if (obj) {
            obj.insideCheck = false;
          }
          break;
          
        case 'enter':
          // .ls line 143-153: check dragObject.dragSnapList for Boate1/Boatt1
          {
            const dragObject = this._getCurrentDragObject();
            const snapList = dragObject && dragObject.dragSnapList ? dragObject.dragSnapList : null;
            const hasE1 = snapList && snapList.Boate1 !== undefined && snapList.Boate1 !== null;
            const hasT1 = snapList && snapList.Boatt1 !== undefined && snapList.Boatt1 !== null;
            if (hasE1 || hasT1) {
              this._setSpriteMember(this.startSP + (this.globals.HullFrontOffset || 1), 'Dummy');
              if (this.dir && this.dir.spriteList && this.dir.spriteList.Water) {
                this._setSpriteMember(this.dir.spriteList.Water, 'Dummy');
              }
            }
          }
          break;

        case 'Leave':
        case 'leave':
          // Restore water sprite
          if (this.dir && this.dir.spriteList && this.dir.spriteList.Water) {
            this._setSpriteMember(this.dir.spriteList.Water, '04b003v0');
          }
          break;
      }
    }
  }

  _setSpriteMember(sp, member) {
    if (!sp || !member) return;
    if (!this.dir) return;
    if (!this.dir._spriteMembers) {
      this.dir._spriteMembers = {};
    }
    this.dir._spriteMembers[sp] = member;
  }

  _getCurrentDragObject() {
    if (this.reportObject) {
      if (this.reportObject.dragObject) return this.reportObject.dragObject;
      if (this.reportObject.getDragObject) {
        const obj = this.reportObject.getDragObject();
        if (obj) return obj;
      }
    }
    if (this.dir && this.dir.junkHandler && this.dir.junkHandler.dragObject) {
      return this.dir.junkHandler.dragObject;
    }
    return null;
  }

  _createDefaultAreaList() {
    const x = this.currentOffset ? this.currentOffset.x : 0;
    const y = this.currentOffset ? this.currentOffset.y : 0;
    return [{ left: x - 20, top: y - 20, right: x + 20, bottom: y + 20 }];
  }

  _createAreaListForMember(memberName) {
    const resolver = this.globals ? this.globals.memberResolver : null;
    if (!resolver || !memberName) {
      return this._createDefaultAreaList();
    }

    const rect = resolver.getMemberRect ? resolver.getMemberRect(memberName) : null;
    const reg = resolver.getRegPoint ? resolver.getRegPoint(memberName) : null;
    if (!rect || !reg) {
      return this._createDefaultAreaList();
    }

    const x = this.currentOffset ? this.currentOffset.x : 0;
    const y = this.currentOffset ? this.currentOffset.y : 0;
    const locX = x - (reg.x || 0);
    const locY = y - (reg.y || 0);

    return [{
      left: (rect.left || 0) + locX,
      top: (rect.top || 0) + locY,
      right: (rect.right || 0) + locX,
      bottom: (rect.bottom || 0) + locY
    }];
  }

  /**
   * Gets the part ID
   * @returns {string}
   */
  getPartId() {
    return this.partId;
  }

  /**
   * Gets current offset
   * @returns {{x: number, y: number}}
   */
  getCurrentOffset() {
    return { ...this.currentOffset };
  }

  /**
   * Checks if this is the hull part
   * @returns {boolean}
   */
  isHull() {
    return this.partId === this._hullId;
  }

  /**
   * Checks if this is the rudder part
   * @returns {boolean}
   */
  isRudder() {
    return this.partId === this._rudderId;
  }

  /**
   * Sets active state on all mouse objects
   * @param {boolean} active
   */
  setActive(active) {
    for (const mouseObj of (this.mouseObjectList || [])) {
      if (mouseObj) {
        mouseObj.active = active;
      }
    }
  }
}

module.exports = BoatPart;
