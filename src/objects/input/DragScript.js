/**
 * @fileoverview DragScript - Drag and drop handler for parts
 * Based on: ParentScript 24 - DragScript.ls
 * 
 * DragScript manages dragging parts around the screen, snapping to
 * valid boat attachment points, and handling drop events.
 */

const MouseObject = require('./MouseObject');

/**
 * DragScript class - handles drag and drop of parts with snap point detection
 * 
 * Lingo properties:
 *   reportObject, SP, partId, mouseObjectList, startPos, dragWhere,
 *   dragMember, dragSnapList, noSnapPoints, noSnapDialogList,
 *   useViewSP, useView2SP, insideList
 */
class DragScript {
  /**
   * Create a new DragScript
   * Lingo: on new me, argReportObject, argPartID, argMember, argWhere
   * 
   * @param {Object} reportObject - Object to report drop events to
   * @param {string} partId - The part ID being dragged
   * @param {string} dragMember - The sprite member for dragging
   * @param {string} dragWhere - Where the drag originated (Quay, Shelf, etc.)
   * @param {Object} globals - Global game state (gMulleGlobals)
   * @param {Object} dir - Director reference (gDir)
   * @param {Object} sound - Sound handler (gSound)
   */
  constructor(reportObject, partId, dragMember, dragWhere, globals, dir, sound) {
    this.reportObject = reportObject;
    this.partId = partId;
    this.dragMember = dragMember;
    this.dragWhere = dragWhere;
    this.globals = globals;
    this.dir = dir;
    this.sound = sound;
    
    // Initialize state
    this.dragSnapList = {};
    this.noSnapPoints = true;
    this.noSnapDialogList = ['04d009v0', '04d024v0', '04d025v0', '04d026v0'];
    this.useViewSP = 0;
    this.useView2SP = 0;
    this.insideList = [];
    this.mouseObjectList = [];
    
    // Get sprite from director
    this.SP = dir.spriteList ? dir.spriteList.DragPart : 0;
    
    // Set up sprite at mouse position
    const initialMouse = {
      x: (globals && typeof globals.mouseH === 'number') ? globals.mouseH : 0,
      y: (globals && typeof globals.mouseV === 'number') ? globals.mouseV : 0
    };
    this.sprite = { member: dragMember, loc: { ...initialMouse } };
    this.mousePosition = { ...initialMouse };
    this.startPos = { ...this.mousePosition };

    // .ls line 20: full-screen drag catcher MouseObject
    this._addMouseObject([
      { left: -1000, top: -1000, right: 1640, bottom: 1480 }
    ], 300, {
      report: true,
      cursor: { DragRollover: 'Grabbed' }
    });
    
    // Handle Quay setup - set up snap points for boat attachment
    if (dragWhere === 'Quay') {
      this._setupQuaySnapPoints();
    }
    
    // Add to loop master
    if (globals.loopMaster) {
      globals.loopMaster.addObject(this);
    }
  }

  /**
   * Set up snap points for Quay location
   * Lingo: Complex snap point setup in new() for #Quay
   * @private
   */
  _setupQuaySnapPoints() {
    const boat = this.globals.user.getBoat();
    const partObj = this.globals.parts.getPart(this.partId);
    let nextLayer = 301;
    
    if (partObj.isMorphPart()) {
      // Handle morph parts - multiple possible snap configurations
      const morphList = partObj.getMorphList();
      for (const morphId of morphList) {
        const morphObj = this.globals.parts.getPart(morphId);
        const morphReqList = morphObj.getRequiredPoints();
        
        if (boat.areTheseFree(morphReqList)) {
          this.noSnapPoints = false;
          const snapPoint = morphReqList[0];
          this.dragSnapList['Boat' + snapPoint] = morphId;

          // .ls lines 42-59: create snap MouseObjects for UseView/UseView2
          nextLayer = this._addSnapMouseObjects(boat, morphObj, snapPoint, nextLayer);
        }
      }
    } else {
      // Handle regular parts
      const partReqList = partObj.getRequiredPoints();
      
      if (boat.areTheseFree(partReqList)) {
        this.noSnapPoints = false;
        const snapPoint = partReqList[0];
        this.dragSnapList['Boat' + snapPoint] = this.partId;

        // .ls lines 68-83: create snap MouseObjects for UseView/UseView2
        this._addSnapMouseObjects(boat, partObj, snapPoint, 302);
      }
    }
    
    // If no snap points and boat has hull, make Mulle talk
    if (this.globals.boatViewHandler) {
      const currentHull = this.globals.boatViewHandler.getCurrentHull();
      if (currentHull !== 'NoHull' && this.noSnapPoints) {
        const dialogIndex = Math.floor(Math.random() * this.noSnapDialogList.length);
        this.dir.makeMulleTalk(this.noSnapDialogList[dialogIndex]);
      }
    }
  }

  _addMouseObject(areaList, layer, options) {
    this.mouseObjectList.push(new MouseObject(this, areaList, layer, options, this.globals));
  }

  _addSnapMouseObjects(boat, partObj, snapPoint, startLayer) {
    const partOffset = partObj.getOffset ? partObj.getOffset() : { x: 0, y: 0 };
    const snapOffset = boat.getSnapInfo ? (boat.getSnapInfo(snapPoint, 'offset') || { x: 0, y: 0 }) : { x: 0, y: 0 };
    const drawOffset = this.globals.boatViewHandler && this.globals.boatViewHandler.getDrawOffset
      ? (this.globals.boatViewHandler.getDrawOffset(this.dragWhere) || { x: 0, y: 0 })
      : { x: 0, y: 0 };

    const center = {
      x: 315 + (partOffset.x || 0) + (snapOffset.x || 0) + (drawOffset.x || 0),
      y: 210 + (partOffset.y || 0) + (snapOffset.y || 0) + (drawOffset.y || 0)
    };
    const area = this._resolveSnapAreaFromMember(partObj, center);

    const dragToWhere = 'Boat' + snapPoint;
    this._addMouseObject(area, startLayer, {
      report: true,
      cursor: { DragRollover: 'Grabbed' },
      dragToWhere
    });

    const tmpPic = partObj.getUseView2 ? partObj.getUseView2() : '';
    if (tmpPic && tmpPic.length > 0) {
      this._addMouseObject(area, startLayer + 1, {
        report: true,
        cursor: { DragRollover: 'Grabbed' },
        dragToWhere
      });
      return startLayer + 2;
    }

    return startLayer + 1;
  }

  _resolveSnapAreaFromMember(partObj, center) {
    const resolver = this.globals ? this.globals.memberResolver : null;
    const viewName = partObj && partObj.getUseView ? partObj.getUseView() : null;

    if (resolver && viewName) {
      const rect = resolver.getMemberRect ? resolver.getMemberRect(viewName) : null;
      const reg = resolver.getRegPoint ? resolver.getRegPoint(viewName) : null;

      if (rect && reg) {
        const locX = center.x - (reg.x || 0);
        const locY = center.y - (reg.y || 0);
        return [{
          left: (rect.left || 0) + locX,
          top: (rect.top || 0) + locY,
          right: (rect.right || 0) + locX,
          bottom: (rect.bottom || 0) + locY
        }];
      }
    }

    return [{
      left: center.x - 40,
      top: center.y - 40,
      right: center.x + 40,
      bottom: center.y + 40
    }];
  }

  /**
   * Clean up drag script
   * Original .ls line 94-105: on kill me
   *   set dragMember to 0
   *   set dragSnapList to 0
   *   set reportObject to 0
   *   deleteObject(the loopMaster of gMulleGlobals, me)
   *   repeat with tmpObj in mouseObjectList
   *     kill(tmpObj)
   *   end repeat
   *   set mouseObjectList to 0
   *   set the member of sprite SP to member "Dummy"
   *   return 0
   */
  kill() {
    // .ls line 95-97
    this.dragMember = 0;
    this.dragSnapList = 0;
    this.reportObject = 0;

    // .ls line 98
    if (this.globals && this.globals.loopMaster) {
      this.globals.loopMaster.deleteObject(this);
    }

    // .ls lines 99-101
    if (this.mouseObjectList) {
      for (const mouseObj of this.mouseObjectList) {
        if (mouseObj && mouseObj.kill) {
          mouseObj.kill();
        }
      }
    }

    // .ls line 102
    this.mouseObjectList = 0;

    // .ls line 103
    if (this.sprite) {
      this.sprite.member = 'Dummy';
    }

    // .ls line 104
    return 0;
  }

  /**
   * Update sprite position to follow mouse
   * Lingo: on loop me
   */
  loop() {
    if (!this.sprite) return;

    // .ls line 108: always follow the global mouse position
    if (this.globals && typeof this.globals.mouseH === 'number' && typeof this.globals.mouseV === 'number') {
      this.sprite.loc = { x: this.globals.mouseH, y: this.globals.mouseV };
      return;
    }

    if (this.mousePosition) {
      this.sprite.loc = { ...this.mousePosition };
    }
  }

  /**
   * Handle mouse events
   * Lingo: on mouse me, argObj, argWhat
   * 
   * @param {Object} obj - The mouse object that triggered the event
   * @param {string} what - The event type: 'up', 'enter', 'Leave'
   */
  mouse(obj, what) {
    switch (what) {
      case 'up':
        this._handleMouseUp();
        break;
      case 'enter':
        this._handleMouseEnter(obj);
        break;
      case 'Leave':
        this._handleMouseLeave(obj);
        break;
    }
  }

  /**
   * Handle mouse up - drop the part
   * Lingo: #up case in mouse handler
   * @private
   */
  _handleMouseUp() {
    if (this.reportObject) {
      // Check if not moved - play description sound
      if (this.sprite && this.startPos) {
        const spriteLoc = this.sprite.loc;
        if (spriteLoc.x === this.startPos.x && spriteLoc.y === this.startPos.y) {
          const partObj = this.globals.parts.getPart(this.partId);
          const sndDescription = partObj.getSndDescription();
          if (sndDescription && sndDescription.length > 0) {
            this.dir.makeMulleTalk(sndDescription);
          }
        }
      }
      
      // Report drop
      this.reportObject.dropped(this.partId, this.mousePosition);
    }
  }

  /**
   * Handle mouse enter snap zone
   * Lingo: #enter case in mouse handler
   * @private
   */
  _handleMouseEnter(obj) {
    const dragToWhere = obj.dragToWhere;
    
    if (dragToWhere && String(dragToWhere).substring(0, 4) === 'Boat') {
      // Update partId from dragSnapList when first entering
      if (this.insideList.length === 0 && this.dragSnapList[dragToWhere]) {
        this.partId = this.dragSnapList[dragToWhere];

        // .ls line 129-149: show preview on boat layers
        this._showPreviewForPart(this.partId);
        
        // Play attach sound
        const partObj = this.globals.parts.getPart(this.partId);
        const sndAttach = partObj.getSndAttachOnBoat();
        if (sndAttach && sndAttach.length > 0 && this.sound) {
          this.sound.play(sndAttach, 'OPEFFECT');
        }
      }
      
      // Add to inside list if not already there
      if (!this.insideList.includes(dragToWhere)) {
        this.insideList.push(dragToWhere);
      }
    }
  }

  /**
   * Handle mouse leave snap zone
   * Lingo: #Leave case in mouse handler
   * @private
   */
  _handleMouseLeave(obj) {
    const dragToWhere = obj.dragToWhere;
    
    if (dragToWhere && String(dragToWhere).substring(0, 4) === 'Boat') {
      // Remove from inside list
      const idx = this.insideList.indexOf(dragToWhere);
      if (idx >= 0) {
        this.insideList.splice(idx, 1);
      }
      
      // If all snaps left, restore drag member
      if (this.insideList.length === 0) {
        // Reset partId if it was a master part
        const partObj = this.globals.parts.getPart(this.partId);
        if (partObj.isMaster()) {
          this.partId = partObj.getMaster();
        }
        
        // .ls line 169-176: clear preview layers
        this._clearPreviewSprites();
        
        // Restore drag member
        if (this.sprite) {
          this.sprite.member = this.dragMember;
        }
        this._setSpriteMember(this.SP, this.dragMember);
      } else {
        // Switch to another snap point if available
        const newDragToWhere = this.insideList[0];
        if (this.dragSnapList[newDragToWhere]) {
          const oldPartId = this.partId;
          this.partId = this.dragSnapList[newDragToWhere];
          
          if (oldPartId !== this.partId) {
            // .ls line 191-208: refresh preview for new morph
            this._clearPreviewSprites();
            this._showPreviewForPart(this.partId);

            // Play attach sound for new part
            const partObj = this.globals.parts.getPart(this.partId);
            const sndAttach = partObj.getSndAttachOnBoat();
            if (sndAttach && sndAttach.length > 0 && this.sound) {
              this.sound.play(sndAttach, 'OPEFFECT');
            }
          }
        }
      }
    }
  }

  _showPreviewForPart(partId) {
    if (!this.globals || !this.globals.user || !this.globals.parts) return;
    const boat = this.globals.user.getBoat();
    const partObj = this.globals.parts.getPart(partId);
    if (!boat || !partObj) return;

    const tmpStartSP = (this.dir && this.dir.spriteList ? this.dir.spriteList.BoatStart : 1) - 1;
    const tmpPartOffset = partObj.getOffset ? partObj.getOffset() : { x: 0, y: 0 };
    const tmpSnaps = partObj.getRequiredPoints ? partObj.getRequiredPoints() : [];
    const tmpFirstSnapPoint = tmpSnaps.length > 0 ? tmpSnaps[0] : null;
    if (!tmpFirstSnapPoint) return;

    let tmpUseLayers = boat.getSnapInfo ? boat.getSnapInfo(tmpFirstSnapPoint, 'layers') : [1, 2];
    if (!Array.isArray(tmpUseLayers)) tmpUseLayers = [1, 2];
    const tmpSnapOffset = boat.getSnapInfo ? (boat.getSnapInfo(tmpFirstSnapPoint, 'offset') || { x: 0, y: 0 }) : { x: 0, y: 0 };
    const drawOffset = this.globals.boatViewHandler && this.globals.boatViewHandler.getDrawOffset
      ? (this.globals.boatViewHandler.getDrawOffset('Quay') || { x: 0, y: 0 })
      : { x: 0, y: 0 };

    this.currentOffset = {
      x: 315 + (tmpPartOffset.x || 0) + (tmpSnapOffset.x || 0) + (drawOffset.x || 0),
      y: 210 + (tmpPartOffset.y || 0) + (tmpSnapOffset.y || 0) + (drawOffset.y || 0)
    };

    this.useViewSP = tmpStartSP + (tmpUseLayers[0] || 1);
    // .ls line 140: set the member of sprite SP to member "Dummy"
    this._setSpriteMember(this.SP, 'Dummy');
    // .ls line 141-142: set member and loc of useViewSP
    this._setSpriteMember(this.useViewSP, partObj.getUseView ? partObj.getUseView() : 'Dummy');
    this._setSpriteLoc(this.useViewSP, this.currentOffset);

    const tmpPic = partObj.getUseView2 ? partObj.getUseView2() : '';
    if (tmpPic && tmpPic.length > 0) {
      this.useView2SP = tmpStartSP + (tmpUseLayers[1] || ((tmpUseLayers[0] || 1) + 1));
      // .ls line 147-148: set member and loc of useView2SP
      this._setSpriteMember(this.useView2SP, tmpPic);
      this._setSpriteLoc(this.useView2SP, this.currentOffset);
    } else {
      this.useView2SP = 0;
    }
  }

  _clearPreviewSprites() {
    if (this.useViewSP > 0) {
      this._setSpriteMember(this.useViewSP, 'Dummy');
      this.useViewSP = 0;
    }
    if (this.useView2SP > 0) {
      this._setSpriteMember(this.useView2SP, 'Dummy');
      this.useView2SP = 0;
    }
  }

  _setSpriteMember(sp, member) {
    if (!this.dir || !sp) return;
    if (!this.dir._spriteMembers) this.dir._spriteMembers = {};
    this.dir._spriteMembers[sp] = member;
  }

  /**
   * Set sprite location for a channel
   * Lingo: set the loc of sprite <sp> to <loc>
   * @param {number} sp - Sprite channel number
   * @param {Object} loc - Position {x, y}
   */
  _setSpriteLoc(sp, loc) {
    if (!this.dir || !sp) return;
    if (!this.dir._spriteLocations) this.dir._spriteLocations = {};
    this.dir._spriteLocations[sp] = { x: loc.x, y: loc.y };
  }

  /**
   * Get current part ID
   * @returns {string} The current part ID
   */
  getPartId() {
    return this.partId;
  }

  /**
   * Get drag snap list
   * @returns {Object} Map of snap point names to part IDs
   */
  getDragSnapList() {
    return this.dragSnapList;
  }

  /**
   * Check if there are no snap points available
   * @returns {boolean} True if no snap points
   */
  hasNoSnapPoints() {
    return this.noSnapPoints;
  }

  /**
   * Get start position
   * @returns {Object} The start position {x, y}
   */
  getStartPos() {
    return this.startPos;
  }

  /**
   * Set mouse position
   * @param {Object} pos - The position {x, y}
   */
  setMousePosition(pos) {
    this.mousePosition = pos;
  }
}

module.exports = DragScript;
