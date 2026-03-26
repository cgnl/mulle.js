/**
 * @fileoverview Tests for BoatPart - Boat part display handler
 * Based on: ParentScript 29 - BoatPart.ls
 * 
 * BoatPart manages the display of parts attached to the boat.
 * Handles multiple sprite layers (front/back) and mouse interaction.
 */

const BoatPart = require('../BoatPart');

describe('BoatPart', () => {
  let boatPart;
  let mockGlobals;
  let mockDir;
  let mockReportObject;
  let mockPartObj;
  let mockBoat;

  beforeEach(() => {
    mockPartObj = {
      getOffset: jest.fn().mockReturnValue({ x: 10, y: 20 }),
      getRequiredPoints: jest.fn().mockReturnValue(['snap1']),
      getNewPoints: jest.fn().mockReturnValue([['newSnap1', 50, 60]]),
      getUseView: jest.fn().mockReturnValue('useView1'),
      getUseView2: jest.fn().mockReturnValue('useView2'),
      getUseViewInside: jest.fn().mockReturnValue('insideView1'),
      getUseViewInside2: jest.fn().mockReturnValue('insideView2')
    };

    mockBoat = {
      getHull: jest.fn().mockReturnValue('hullPart'),
      getRudder: jest.fn().mockReturnValue('rudderPart'),
      getSnapInfo: jest.fn().mockReturnValue({ layers: [1, 2], offset: { x: 0, y: 0 } }),
      areTheseFree: jest.fn().mockReturnValue(true)
    };

    mockDir = {
      spriteList: {
        BoatStart: 10,
        Water: 20
      },
      _spriteMembers: {},
      junkHandler: {
        dragObject: null
      }
    };

    mockGlobals = {
      parts: {
        getPart: jest.fn().mockReturnValue(mockPartObj)
      },
      user: {
        getBoat: jest.fn().mockReturnValue(mockBoat)
      },
      HullFrontOffset: 1,
      HullBackOffset: 2,
      hullFrontInsideOffset: 3,
      hullBackInsideOffset: 4,
      rudderFrontOffset: 5,
      rudderBackOffset: 6,
      memberResolver: {
        getMemberRect: jest.fn().mockImplementation((name) => {
          if (name === 'insideView2') return { left: 0, top: 0, right: 80, bottom: 20 };
          return { left: 0, top: 0, right: 60, bottom: 40 };
        }),
        getRegPoint: jest.fn().mockImplementation((name) => {
          if (name === 'insideView2') return { x: 4, y: 6 };
          return { x: 10, y: 5 };
        })
      }
    };

    mockReportObject = {
      pickedUp: jest.fn(),
      getDragObject: jest.fn().mockReturnValue(null)
    };
  });

  afterEach(() => {
    if (boatPart) {
      boatPart.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me, argPartID, argOffset, argReportObject
     */
    test('should store part ID', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      expect(boatPart.partId).toBe('part1');
    });

    test('should store report object', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      expect(boatPart.reportObject).toBe(mockReportObject);
    });

    test('should set sprite channels based on layer info', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      // Sprite channels get set during construction based on snap layers
      expect(typeof boatPart.useViewSP).toBe('number');
      expect(typeof boatPart.useView2SP).toBe('number');
    });

    test('should set member properties from part views', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      // Members get set during construction based on part views
      expect(boatPart.useViewMember).toBe('useView1');
      expect(boatPart.useView2Member).toBe('useView2');
    });

    test('should calculate currentOffset from part and snap offsets', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      // currentOffset is calculated from offset + partOffset + snapOffset
      expect(boatPart.currentOffset).toBeDefined();
      expect(typeof boatPart.currentOffset.x).toBe('number');
      expect(typeof boatPart.currentOffset.y).toBe('number');
    });

    test('should initialize mouseObjectList', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      expect(Array.isArray(boatPart.mouseObjectList)).toBe(true);
    });

    test('should get part from parts manager', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      expect(mockGlobals.parts.getPart).toHaveBeenCalledWith('part1');
    });

    test('should get boat from user', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      expect(mockGlobals.user.getBoat).toHaveBeenCalled();
    });
  });

  describe('hull part handling', () => {
    test('should use hull offsets for hull part', () => {
      mockBoat.getHull.mockReturnValue('hullPart');
      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      // Hull should have special handling
      expect(mockPartObj.getUseView).toHaveBeenCalled();
    });

    test('should set up inside views for hull with inside view', () => {
      mockBoat.getHull.mockReturnValue('hullPart');
      mockPartObj.getUseViewInside.mockReturnValue('hullInside');
      
      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(mockPartObj.getUseViewInside).toHaveBeenCalled();
    });
  });

  describe('rudder part handling', () => {
    test('should use rudder offsets for rudder part', () => {
      mockBoat.getRudder.mockReturnValue('rudderPart');
      boatPart = new BoatPart('rudderPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(mockPartObj.getUseView).toHaveBeenCalled();
    });

    test('should handle rudder with use view 2', () => {
      mockBoat.getRudder.mockReturnValue('rudderPart');
      mockPartObj.getUseView2.mockReturnValue('rudderBack');
      
      boatPart = new BoatPart('rudderPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(mockPartObj.getUseView2).toHaveBeenCalled();
    });
  });

  describe('regular part handling', () => {
    test('should get required snap points for regular parts', () => {
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(mockPartObj.getRequiredPoints).toHaveBeenCalled();
    });

    test('should get snap info from boat', () => {
      mockBoat.getSnapInfo = jest.fn().mockReturnValue({ x: 5, y: 10 });
      
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(mockBoat.getSnapInfo).toHaveBeenCalled();
    });

    test('should check if new points are free', () => {
      mockPartObj.getNewPoints.mockReturnValue([['newSnap', 10, 20]]);
      
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(mockBoat.areTheseFree).toHaveBeenCalled();
    });

    test('should create drag MouseObject when snap/new points are valid (.ls lines 44-49)', () => {
      mockPartObj.getNewPoints.mockReturnValue([['newSnap', 10, 20]]);
      mockBoat.areTheseFree.mockReturnValue(true);

      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);

      expect(boatPart.mouseObjectList.length).toBeGreaterThan(0);
      expect(boatPart.mouseObjectList[0].isDragObject).toBe(true);
      expect(boatPart.mouseObjectList[0].SP).toBe(boatPart.useViewSP);
      // .ls lines 45-47: area = rect(member) + (currentOffset - regPoint)
      expect(boatPart.mouseObjectList[0].areaList[0]).toEqual({
        left: 100,
        top: 115,
        right: 160,
        bottom: 155
      });
    });

    test('should create second MouseObject for UseView2 layer (.ls lines 56-61)', () => {
      mockPartObj.getUseView2.mockReturnValue('useView2');
      mockPartObj.getNewPoints.mockReturnValue([['newSnap', 10, 20]]);
      mockBoat.areTheseFree.mockReturnValue(true);

      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);

      expect(boatPart.mouseObjectList.length).toBeGreaterThanOrEqual(2);
    });

    test('should not create MouseObject when required new points are blocked (.ls lines 36-40)', () => {
      mockPartObj.getNewPoints.mockReturnValue([['newSnap', 10, 20]]);
      mockBoat.areTheseFree.mockReturnValue(false);

      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);

      expect(boatPart.mouseObjectList).toEqual([]);
    });
  });

  describe('hull mouse object handling', () => {
    test('should create clickable hull MouseObject when inside views exist (.ls lines 84-88)', () => {
      mockBoat.getHull.mockReturnValue('hullPart');
      mockPartObj.getUseViewInside.mockReturnValue('insideView1');
      mockPartObj.getUseViewInside2.mockReturnValue('insideView2');

      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);

      expect(boatPart.mouseObjectList.length).toBeGreaterThan(0);
      const hullObj = boatPart.mouseObjectList[boatPart.mouseObjectList.length - 1];
      expect(hullObj.dragToWhere).toBe('Hull');
      expect(hullObj.SP).toBe(boatPart.useViewSP);
      // .ls lines 84-87: hull area uses useViewInside2 member dimensions
      expect(hullObj.areaList[0]).toEqual({
        left: 106,
        top: 114,
        right: 186,
        bottom: 134
      });
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   set useViewMember to 0
     *   ... kill all mouse objects
     */
    test('should clear member references to 0 (.ls lines 112-115)', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.kill();
      
      expect(boatPart.useViewMember).toBe(0);
      expect(boatPart.useView2Member).toBe(0);
      expect(boatPart.useViewInsideMember).toBe(0);
      expect(boatPart.useViewInside2Member).toBe(0);
    });

    test('should clear report object to 0 (.ls line 116)', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.kill();
      
      expect(boatPart.reportObject).toBe(0);
    });

    test('should kill all mouse objects', () => {
      const mockMouseObj = { kill: jest.fn() };
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.mouseObjectList = [mockMouseObj];
      
      boatPart.kill();
      
      expect(mockMouseObj.kill).toHaveBeenCalled();
    });

    test('should set mouseObjectList to 0 (.ls line 120)', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.kill();
      expect(boatPart.mouseObjectList).toBe(0);
    });

    test('should return 0 (.ls line 121)', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      const result = boatPart.kill();
      
      expect(result).toBe(0);
    });
  });

  describe('mouse', () => {
    /**
     * Lingo: on mouse me, argObj, argWhat
     */
    test('should deactivate all mouse objects on down', () => {
      const mockMouseObj = { active: true };
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.mouseObjectList = [mockMouseObj];
      
      boatPart.mouse({ dragToWhere: 'Other' }, 'down');
      
      expect(mockMouseObj.active).toBe(false);
    });

    test('should call pickedUp on report object', () => {
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      boatPart.mouse({ dragToWhere: 'Other' }, 'down');
      
      expect(mockReportObject.pickedUp).toHaveBeenCalledWith('regularPart');
    });

    test('should hide useView sprites on non-hull down (.ls lines 130-133)', () => {
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.useViewSP = 11;
      boatPart.useView2SP = 12;

      boatPart.mouse({ dragToWhere: 'Other' }, 'down');

      expect(mockDir._spriteMembers[11]).toBe('Dummy');
      expect(mockDir._spriteMembers[12]).toBe('Dummy');
    });

    test('should not pick up on hull drag-to-hull', () => {
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      boatPart.mouse({ dragToWhere: 'Hull' }, 'down');
      
      expect(mockReportObject.pickedUp).not.toHaveBeenCalled();
    });

    test('should handle click event for hull', () => {
      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      const obj = { dragToWhere: 'Hull', insideCheck: true };

      boatPart.mouse(obj, 'click');

      // .ls lines 139-141
      expect(mockDir._spriteMembers[10]).toBe('Dummy'); // startSP(9) + HullFrontOffset(1)
      expect(mockDir._spriteMembers[20]).toBe('Dummy'); // Water sprite
      expect(obj.insideCheck).toBe(false);
    });

    test('should hide hull/water on hull enter when drag snap contains Boate1 or Boatt1 (.ls lines 148-153)', () => {
      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      mockReportObject.dragObject = {
        dragSnapList: {
          Boate1: 'somePart'
        }
      };

      boatPart.mouse({ dragToWhere: 'Hull' }, 'enter');

      expect(mockDir._spriteMembers[10]).toBe('Dummy');
      expect(mockDir._spriteMembers[20]).toBe('Dummy');
    });

    test('should restore water on hull leave (.ls line 156)', () => {
      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);

      boatPart.mouse({ dragToWhere: 'Hull' }, 'leave');

      expect(mockDir._spriteMembers[20]).toBe('04b003v0');
    });
  });

  describe('getPartId', () => {
    test('should return part ID', () => {
      boatPart = new BoatPart('testPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      expect(boatPart.getPartId()).toBe('testPart');
    });
  });

  describe('getCurrentOffset', () => {
    test('should return current offset', () => {
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.currentOffset = { x: 50, y: 75 };
      
      expect(boatPart.getCurrentOffset()).toEqual({ x: 50, y: 75 });
    });
  });

  describe('isHull', () => {
    test('should return true for hull part', () => {
      mockBoat.getHull.mockReturnValue('hullPart');
      boatPart = new BoatPart('hullPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(boatPart.isHull()).toBe(true);
    });

    test('should return false for non-hull part', () => {
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(boatPart.isHull()).toBe(false);
    });
  });

  describe('isRudder', () => {
    test('should return true for rudder part', () => {
      mockBoat.getRudder.mockReturnValue('rudderPart');
      boatPart = new BoatPart('rudderPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(boatPart.isRudder()).toBe(true);
    });

    test('should return false for non-rudder part', () => {
      boatPart = new BoatPart('regularPart', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      
      expect(boatPart.isRudder()).toBe(false);
    });
  });

  describe('setActive', () => {
    test('should set active state on all mouse objects', () => {
      const mockMouseObj1 = { active: false };
      const mockMouseObj2 = { active: false };
      boatPart = new BoatPart('part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockDir);
      boatPart.mouseObjectList = [mockMouseObj1, mockMouseObj2];
      
      boatPart.setActive(true);
      
      expect(mockMouseObj1.active).toBe(true);
      expect(mockMouseObj2.active).toBe(true);
    });
  });
});
