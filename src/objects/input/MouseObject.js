/**
 * @fileoverview MouseObject - Mouse area handler
 * Based on: ParentScript 21 - MouseObject.ls
 * 
 * MouseObject handles mouse interaction within defined rectangular areas.
 * Supports rollover, click, drag, and wait events.
 * 
 * Events:
 * - enter: Mouse enters area
 * - Leave: Mouse leaves area
 * - down: Mouse button pressed
 * - up: Mouse button released (not clicked)
 * - click: Mouse button pressed and released inside
 * - UpOutside: Mouse released outside after pressing inside
 * - Wait: Mouse hovered for waitTimes frames
 * 
 * @example
 * const mo = new MouseObject(reportObj, [{left: 0, top: 0, right: 100, bottom: 100}], 1, {
 *   cursor: { rollOver: 'Clickable' },
 *   report: true
 * }, globals);
 */

class MouseObject {
  /**
   * Creates a new MouseObject
   * Lingo: on new me, argReportObject, argAreaList, argLayer, argOptionList
   * @param {Object} reportObject - Object to report events to
   * @param {Array} areaList - List of rectangular areas
   * @param {number} layer - Z-order layer
   * @param {Object} options - Configuration options
   * @param {Object} globals - Game globals
   */
  constructor(reportObject, areaList, layer, options = {}, globals) {
    this.reportObject = reportObject;
    this.areaList = areaList;
    this.globals = globals;
    this.optionList = options;
    
    // Parse options
    this.SP = options.SP || null;
    this.report = options.report || false;
    this.isDragObject = options.isDragObject || false;
    
    // Cursor options
    const cursorOpts = options.cursor || {};
    this.rolloverCursor = cursorOpts.rollOver || 'NoChange';
    this.dragCursor = cursorOpts.drag || 'NoChange';
    this.dragRolloverCursor = cursorOpts.DragRollover || 'NoChange';
    
    // Drag options
    this.dragToWhere = options.dragToWhere || 'NoWhere';
    
    // Wait options
    const waitOpts = options.Wait || {};
    this.waitTimes = waitOpts.Times || 0;
    
    // State
    this.isInside = false;
    this.downOn = false;
    this.active = true;
    this.activePause = false;
    this.loopCounter = 0;
    this.soundID = 0;
    this.insideCheck = true;
    
    // Optional references
    this.sprite = null;
    this.sound = null;
    
    // Register with mouse master
    if (globals && globals.mouseMaster && globals.mouseMaster.addObject) {
      globals.mouseMaster.addObject(this, layer);
    }
    
    // Initial check
    // In real implementation: check current mouse position
  }

  /**
   * Cleanup
   * Lingo: on kill me
   * @returns {null}
   */
  kill() {
    this.optionList = null;
    
    if (this.globals && this.globals.mouseMaster && this.globals.mouseMaster.deleteObject) {
      this.globals.mouseMaster.deleteObject(this);
    }
    
    return null;
  }

  /**
   * Handle mouse event with options
   * Lingo: on mouse me, argEventType
   * @param {string} eventType - Event type
   */
  mouse(eventType) {
    if (!this.optionList) return;
    
    const actionList = this.optionList[eventType];
    if (!actionList || typeof actionList !== 'object') return;
    
    // Handle pic option
    if (actionList.Pic && this.sprite && this.SP) {
      this.sprite.member = actionList.Pic;
      if (this.sprite.loc.x === 0 && this.sprite.loc.y === 0) {
        this.sprite.loc = { x: 320, y: 240 };
      }
    }
    
    // Handle sound option
    if (actionList.sound && this.sound) {
      this.soundID = this.sound.play(actionList.sound, 'OPEFFECT');
    }
    
    // Handle frame option
    if (actionList.frame) {
      // go(actionList.frame) in real implementation
    }
    
    // Handle StopSound option
    if (actionList.StopSound && this.soundID > 0 && this.sound) {
      this.sound.stop(this.soundID);
    }
    
    // Handle insideCheck option
    if (actionList.insideCheck !== undefined) {
      this.insideCheck = actionList.insideCheck;
    }
  }

  /**
   * Handle mouse down
   * Lingo: on mouseDown me, argLoc
   * @param {Object} loc - Mouse location
   * @returns {boolean} True if handled
   */
  mouseDown(loc) {
    if (!this.active || this.activePause) {
      return false;
    }
    
    if (this.isInside && this.insideCheck) {
      this.mouse('down');
      
      if (this.report && this.reportObject && this.reportObject.mouse) {
        this.reportObject.mouse(this, 'down');
      }
      
      this.downOn = true;
      return true;
    }
    
    return false;
  }

  /**
   * Handle mouse up
   * Lingo: on mouseUp me, argLoc
   * @param {Object} loc - Mouse location
   */
  mouseUp(loc) {
    if (!this.active || this.activePause) {
      return;
    }
    
    if (this.downOn) {
      if (this.isInside && this.insideCheck) {
        this.mouse('click');
        
        if (this.report && this.insideCheck && this.reportObject && this.reportObject.mouse) {
          this.reportObject.mouse(this, 'click');
        }
      } else {
        this.mouse('UpOutside');
        
        if (this.report && this.reportObject && this.reportObject.mouse) {
          this.reportObject.mouse(this, 'UpOutside');
        }
      }
    } else {
      if (this.isInside && this.insideCheck) {
        this.mouse('up');
        
        if (this.report && this.reportObject && this.reportObject.mouse) {
          this.reportObject.mouse(this, 'up');
        }
      }
    }
    
    this.downOn = false;
  }

  /**
   * Check if point is inside any area
   * Lingo: on InsideareaList me, argLoc
   * @param {Object} loc - Point to check
   * @returns {boolean}
   */
  insideAreaList(loc) {
    if (!this.areaList || this.areaList.length === 0) {
      return false;
    }
    
    // Check first area (bounding box)
    const first = this.areaList[0];
    if (!this.pointInRect(loc, first)) {
      return false;
    }
    
    // If only one area, we're done
    if (this.areaList.length === 1) {
      return true;
    }
    
    // Check sub-areas (must be inside at least one)
    for (let i = 1; i < this.areaList.length; i++) {
      if (this.pointInRect(loc, this.areaList[i])) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * Lingo alias: on InsideareaList me, argLoc
   * Preserve original casing for parity.
   */
  InsideareaList(loc) {
    return this.insideAreaList(loc)
  }

  /**
   * Check if point is inside rect
   * @param {Object} point - {x, y}
   * @param {Object} rect - {left, top, right, bottom}
   * @returns {boolean}
   */
  pointInRect(point, rect) {
    return point.x >= rect.left && 
           point.x <= rect.right && 
           point.y >= rect.top && 
           point.y <= rect.bottom;
  }

  /**
   * Check mouse position and trigger events
   * Lingo: on check me, argLoc
   * @param {Object} loc - Mouse location
   * @returns {boolean|number}
   */
  check(loc) {
    if (!this.active || this.activePause) {
      return 0;
    }
    
    const nowInside = this.insideAreaList(loc);
    
    if (this.isInside) {
      if (!nowInside) {
        // Left the area
        this.isInside = false;
        this.mouse('Leave');
        this.loopCounter = 0;
        
        if (this.report && this.insideCheck && this.reportObject && this.reportObject.mouse) {
          this.reportObject.mouse(this, 'Leave');
        }
      } else {
        // Still inside - check wait
        if (this.waitTimes > 0) {
          this.loopCounter++;
          
          if (this.loopCounter === this.waitTimes) {
            this.mouse('Wait');
            
            if (this.report && this.insideCheck && this.reportObject && this.reportObject.mouse) {
              this.reportObject.mouse(this, 'Wait');
            }
          }
        }
      }
    } else {
      if (nowInside) {
        // Entered the area
        this.isInside = true;
        this.mouse('enter');
        
        if (this.report && this.insideCheck && this.reportObject && this.reportObject.mouse) {
          this.reportObject.mouse(this, 'enter');
        }
      }
    }
    
    if (this.insideCheck) {
      return this.isInside;
    }
    
    return 0;
  }

  /**
   * Move all areas by offset
   * Lingo: on move me, argPoint
   * @param {Object} point - Offset {x, y}
   */
  move(point) {
    for (let i = 0; i < this.areaList.length; i++) {
      const area = this.areaList[i];
      this.areaList[i] = {
        left: area.left + point.x,
        top: area.top + point.y,
        right: area.right + point.x,
        bottom: area.bottom + point.y
      };
    }
  }

  /**
   * Move to absolute position
   * Lingo: on moveTo me, argPoint
   * @param {Object} point - Target position {x, y}
   */
  moveTo(point) {
    const first = this.areaList[0];
    const diff = {
      x: point.x - first.left,
      y: point.y - first.top
    };
    this.move(diff);
  }

  /**
   * Set active state
   * @param {boolean} state
   */
  setActive(state) {
    this.active = state;
  }

  /**
   * Set activePause state
   * @param {boolean} state
   */
  setActivePause(state) {
    this.activePause = state;
  }
}

module.exports = MouseObject;
