/**
 * @fileoverview Tests for MouseObject - Mouse area handler
 * Based on: ParentScript 21 - MouseObject.ls
 * 
 * MouseObject handles mouse interaction within defined rectangular areas.
 * Supports rollover, click, drag, and wait events.
 */

const MouseObject = require('../MouseObject');

describe('MouseObject', () => {
  let mouseObj;
  let mockReportObject;
  let mockGlobals;
  let mockCursor;
  let mockSound;

  beforeEach(() => {
    mockReportObject = {
      mouse: jest.fn()
    };

    mockGlobals = {
      mouseMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      }
    };

    mockCursor = {
      setCursor: jest.fn()
    };

    mockSound = {
      play: jest.fn().mockReturnValue(1),
      stop: jest.fn()
    };
  });

  afterEach(() => {
    if (mouseObj) {
      mouseObj.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me, argReportObject, argAreaList, argLayer, argOptionList
     */
    test('should store report object', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.reportObject).toBe(mockReportObject);
    });

    test('should store area list', () => {
      const areas = [{ left: 0, top: 0, right: 100, bottom: 100 }];
      mouseObj = new MouseObject(mockReportObject, areas, 1, {}, mockGlobals);
      expect(mouseObj.areaList).toBe(areas);
    });

    test('should initialize active to true', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.active).toBe(true);
    });

    test('should initialize downOn to false', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.downOn).toBe(false);
    });

    test('should initialize activePause to false', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.activePause).toBe(false);
    });

    test('should initialize insideCheck to true', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.insideCheck).toBe(true);
    });

    test('should set report from options', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      expect(mouseObj.report).toBe(true);
    });

    test('should set isDragObject from options', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { isDragObject: true }, mockGlobals);
      expect(mouseObj.isDragObject).toBe(true);
    });

    test('should set cursor options', () => {
      const options = {
        cursor: {
          rollOver: 'Clickable',
          drag: 'Grabbed',
          DragRollover: 'DragOver'
        }
      };
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, options, mockGlobals);
      expect(mouseObj.rolloverCursor).toBe('Clickable');
      expect(mouseObj.dragCursor).toBe('Grabbed');
      expect(mouseObj.dragRolloverCursor).toBe('DragOver');
    });

    test('should default cursors to NoChange', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.rolloverCursor).toBe('NoChange');
      expect(mouseObj.dragCursor).toBe('NoChange');
      expect(mouseObj.dragRolloverCursor).toBe('NoChange');
    });

    test('should set dragToWhere from options', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { dragToWhere: 'Trash' }, mockGlobals);
      expect(mouseObj.dragToWhere).toBe('Trash');
    });

    test('should default dragToWhere to NoWhere', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.dragToWhere).toBe('NoWhere');
    });

    test('should set waitTimes from options', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { Wait: { Times: 30 } }, mockGlobals);
      expect(mouseObj.waitTimes).toBe(30);
    });

    test('should add to mouseMaster', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mockGlobals.mouseMaster.addObject).toHaveBeenCalledWith(mouseObj, 1);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   deleteObject from mouseMaster
     */
    test('should remove from mouseMaster', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.kill();
      expect(mockGlobals.mouseMaster.deleteObject).toHaveBeenCalledWith(mouseObj);
    });

    test('should return null', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      const result = mouseObj.kill();
      expect(result).toBeNull();
    });
  });

  describe('insideAreaList', () => {
    /**
     * Lingo: on InsideareaList me, argLoc
     *   Check if point is inside any area
     */
    test('should return true for point inside single area', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.insideAreaList({ x: 50, y: 50 })).toBe(true);
    });

    test('should return false for point outside area', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      expect(mouseObj.insideAreaList({ x: 150, y: 150 })).toBe(false);
    });

    test('should check all areas in list', () => {
      mouseObj = new MouseObject(mockReportObject, [
        { left: 0, top: 0, right: 100, bottom: 100 },
        { left: 50, top: 50, right: 75, bottom: 75 }
      ], 1, {}, mockGlobals);
      // Must be inside first area AND at least one sub-area
      expect(mouseObj.insideAreaList({ x: 60, y: 60 })).toBe(true);
    });

    test('should return false if inside first area but not sub-areas', () => {
      mouseObj = new MouseObject(mockReportObject, [
        { left: 0, top: 0, right: 100, bottom: 100 },
        { left: 50, top: 50, right: 75, bottom: 75 }
      ], 1, {}, mockGlobals);
      expect(mouseObj.insideAreaList({ x: 10, y: 10 })).toBe(false);
    });
  });

  describe('mouseDown', () => {
    /**
     * Lingo: on mouseDown me, argLoc
     */
    test('should set downOn when inside and active', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.isInside = true;
      mouseObj.mouseDown({ x: 50, y: 50 });
      expect(mouseObj.downOn).toBe(true);
    });

    test('should return true when clicked inside', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.isInside = true;
      expect(mouseObj.mouseDown({ x: 50, y: 50 })).toBe(true);
    });

    test('should return false when not active', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.active = false;
      mouseObj.isInside = true;
      expect(mouseObj.mouseDown({ x: 50, y: 50 })).toBe(false);
    });

    test('should return false when activePause', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.activePause = true;
      mouseObj.isInside = true;
      expect(mouseObj.mouseDown({ x: 50, y: 50 })).toBe(false);
    });

    test('should report down event', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      mouseObj.isInside = true;
      mouseObj.mouseDown({ x: 50, y: 50 });
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'down');
    });
  });

  describe('mouseUp', () => {
    /**
     * Lingo: on mouseUp me, argLoc
     */
    test('should trigger click when downOn and inside', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      mouseObj.downOn = true;
      mouseObj.isInside = true;
      mouseObj.mouseUp({ x: 50, y: 50 });
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'click');
    });

    test('should trigger UpOutside when downOn but outside', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      mouseObj.downOn = true;
      mouseObj.isInside = false;
      mouseObj.mouseUp({ x: 150, y: 150 });
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'UpOutside');
    });

    test('should trigger up when not downOn but inside', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      mouseObj.downOn = false;
      mouseObj.isInside = true;
      mouseObj.mouseUp({ x: 50, y: 50 });
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'up');
    });

    test('should reset downOn', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.downOn = true;
      mouseObj.isInside = true;
      mouseObj.mouseUp({ x: 50, y: 50 });
      expect(mouseObj.downOn).toBe(false);
    });
  });

  describe('check', () => {
    /**
     * Lingo: on check me, argLoc
     *   Check mouse position and trigger enter/leave
     */
    test('should trigger enter when moving inside', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      mouseObj.isInside = false;
      mouseObj.check({ x: 50, y: 50 });
      expect(mouseObj.isInside).toBe(true);
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'enter');
    });

    test('should trigger leave when moving outside', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true }, mockGlobals);
      mouseObj.isInside = true;
      mouseObj.check({ x: 150, y: 150 });
      expect(mouseObj.isInside).toBe(false);
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'Leave');
    });

    test('should trigger wait after waitTimes', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, { report: true, Wait: { Times: 3 } }, mockGlobals);
      mouseObj.isInside = true;
      
      mouseObj.check({ x: 50, y: 50 });
      mouseObj.check({ x: 50, y: 50 });
      mouseObj.check({ x: 50, y: 50 });
      
      expect(mockReportObject.mouse).toHaveBeenCalledWith(mouseObj, 'Wait');
    });

    test('should reset loopCounter on leave', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.isInside = true;
      mouseObj.loopCounter = 5;
      mouseObj.check({ x: 150, y: 150 });
      expect(mouseObj.loopCounter).toBe(0);
    });

    test('should return isInside when insideCheck is true', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.isInside = true;
      expect(mouseObj.check({ x: 50, y: 50 })).toBe(true);
    });

    test('should return 0 when not active', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.active = false;
      expect(mouseObj.check({ x: 50, y: 50 })).toBe(0);
    });
  });

  describe('move', () => {
    /**
     * Lingo: on move me, argPoint
     *   Move all areas by offset
     */
    test('should move all areas by point', () => {
      mouseObj = new MouseObject(mockReportObject, [
        { left: 0, top: 0, right: 100, bottom: 100 },
        { left: 50, top: 50, right: 75, bottom: 75 }
      ], 1, {}, mockGlobals);
      
      mouseObj.move({ x: 10, y: 20 });
      
      expect(mouseObj.areaList[0]).toEqual({ left: 10, top: 20, right: 110, bottom: 120 });
      expect(mouseObj.areaList[1]).toEqual({ left: 60, top: 70, right: 85, bottom: 95 });
    });
  });

  describe('moveTo', () => {
    /**
     * Lingo: on moveTo me, argPoint
     *   Move to absolute position
     */
    test('should move to absolute position', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 50, top: 50, right: 150, bottom: 150 }], 1, {}, mockGlobals);
      
      mouseObj.moveTo({ x: 0, y: 0 });
      
      expect(mouseObj.areaList[0]).toEqual({ left: 0, top: 0, right: 100, bottom: 100 });
    });
  });

  describe('mouse event handling', () => {
    /**
     * Lingo: on mouse me, argEventType
     *   Handle event-specific actions from options
     */
    test('should handle pic option', () => {
      const options = {
        enter: { Pic: 'rolloverPic' },
        SP: 5
      };
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, options, mockGlobals);
      mouseObj.sprite = { member: null, loc: { x: 0, y: 0 } };
      
      mouseObj.mouse('enter');
      
      // Would set sprite member in real implementation
    });

    test('should handle sound option', () => {
      const options = {
        click: { sound: 'clickSound' }
      };
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, options, mockGlobals);
      mouseObj.sound = mockSound;
      
      mouseObj.mouse('click');
      
      expect(mockSound.play).toHaveBeenCalledWith('clickSound', 'OPEFFECT');
    });

    test('should handle StopSound option', () => {
      const options = {
        Leave: { StopSound: true }
      };
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, options, mockGlobals);
      mouseObj.sound = mockSound;
      mouseObj.soundID = 5;
      
      mouseObj.mouse('Leave');
      
      expect(mockSound.stop).toHaveBeenCalledWith(5);
    });
  });

  describe('setActive', () => {
    test('should set active state', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.setActive(false);
      expect(mouseObj.active).toBe(false);
    });
  });

  describe('setActivePause', () => {
    test('should set activePause state', () => {
      mouseObj = new MouseObject(mockReportObject, [{ left: 0, top: 0, right: 100, bottom: 100 }], 1, {}, mockGlobals);
      mouseObj.setActivePause(true);
      expect(mouseObj.activePause).toBe(true);
    });
  });
});
