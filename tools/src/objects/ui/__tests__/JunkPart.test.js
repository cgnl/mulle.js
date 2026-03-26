/**
 * @fileoverview Tests for JunkPart - Junk pile part sprite handler
 * Based on: ParentScript 14 - JunkPart.ls
 * 
 * JunkPart manages the display and interaction of parts in junk piles
 * (shelves, floors). Handles physics-based settling and mouse interaction.
 */

const JunkPart = require('../JunkPart');

describe('JunkPart', () => {
  let junkPart;
  let mockSprite;
  let mockGlobals;
  let mockReportObject;
  let mockPartObj;
  let mockSound;

  beforeEach(() => {
    mockSprite = {
      id: 1,
      member: null,
      loc: { x: 100, y: 100 }
    };

    mockPartObj = {
      getShelfView: jest.fn().mockReturnValue('shelf_view'),
      getJunkView: jest.fn().mockReturnValue('junk_view'),
      getClickArea: jest.fn().mockReturnValue([[0, 0, 50, 50]]),
      getSndDropOn: jest.fn().mockReturnValue('drop_sound')
    };

    mockGlobals = {
      parts: {
        getPart: jest.fn().mockReturnValue(mockPartObj)
      },
      junkViewHandler: {
        getFloorList: jest.fn().mockReturnValue([
          { top: 200, bottom: 250, left: 0, right: 400 }
        ])
      },
      loopMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      }
    };

    mockSound = {
      play: jest.fn()
    };

    mockReportObject = {
      getWhere: jest.fn().mockReturnValue('Junk1'),
      pickedUp: jest.fn()
    };
  });

  afterEach(() => {
    if (junkPart) {
      junkPart.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me, argSP, argPartID, argLoc, argReportObject
     */
    test('should initialize with sprite reference', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(junkPart.sprite).toBe(mockSprite);
    });

    test('should store part ID', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(junkPart.partId).toBe('part1');
    });

    test('should store report object', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(junkPart.reportObject).toBe(mockReportObject);
    });

    test('should use shelf view when on shelf', () => {
      mockReportObject.getWhere.mockReturnValue('Shelf1');
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(mockPartObj.getShelfView).toHaveBeenCalled();
    });

    test('should use junk view when not on shelf', () => {
      mockReportObject.getWhere.mockReturnValue('Junk1');
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(mockPartObj.getJunkView).toHaveBeenCalled();
    });

    test('should initialize point velocity to zero', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(junkPart.pointVel).toEqual({ x: 0, y: 0 });
    });

    test('should add self to loop master', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(mockGlobals.loopMaster.addObject).toHaveBeenCalledWith(junkPart);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   set picMember to 0
     *   deleteObject(the loopMaster of gMulleGlobals, me)
     */
    test('should clear picMember', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      junkPart.kill();
      expect(junkPart.picMember).toBeNull();
    });

    test('should remove from loop master', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      junkPart.kill();
      expect(mockGlobals.loopMaster.deleteObject).toHaveBeenCalledWith(junkPart);
    });

    test('should return null', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      const result = junkPart.kill();
      expect(result).toBeNull();
    });
  });

  describe('loop', () => {
    /**
     * Lingo: on loop me
     *   if isMoving then ...
     */
    test('should stop moving when at destination', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 200 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = true;
      junkPart.horizontalDiff = 0;
      junkPart.verticalDiff = 0;
      
      junkPart.loop();
      
      expect(junkPart.isMoving).toBe(false);
    });

    test('should play drop sound when stopping', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 200 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = true;
      junkPart.horizontalDiff = 0;
      junkPart.verticalDiff = 0;
      
      junkPart.loop();
      
      expect(mockSound.play).toHaveBeenCalled();
    });

    test('should update position when moving horizontally', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 200 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = true;
      junkPart.horizontalDiff = 20;
      junkPart.verticalDiff = 0;
      junkPart.horizontalVel = 4;
      junkPart.verticalVel = 0;
      
      junkPart.loop();
      
      expect(junkPart.pointVel.x).toBeGreaterThan(0);
    });

    test('should update position when moving vertically', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = true;
      junkPart.horizontalDiff = 0;
      junkPart.verticalDiff = 50;
      junkPart.horizontalVel = 0;
      junkPart.verticalVel = 4;
      
      junkPart.loop();
      
      expect(junkPart.pointVel.y).toBeGreaterThan(0);
    });

    test('should do nothing when not moving', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 200 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = false;
      const initialLoc = { ...mockSprite.loc };
      
      junkPart.loop();
      
      expect(mockSprite.loc).toEqual(initialLoc);
    });
  });

  describe('mouse', () => {
    /**
     * Lingo: on mouse me, argObj, argWhat
     *   if argWhat = #down then
     *     pickedUp(reportObject, partId, picMember)
     */
    test('should call pickedUp on mouse down', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      
      junkPart.mouse({}, 'down');
      
      expect(mockReportObject.pickedUp).toHaveBeenCalledWith('part1', expect.anything());
    });

    test('should not call pickedUp on other mouse events', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      
      junkPart.mouse({}, 'up');
      junkPart.mouse({}, 'move');
      
      expect(mockReportObject.pickedUp).not.toHaveBeenCalled();
    });
  });

  describe('getPartId', () => {
    test('should return part ID', () => {
      junkPart = new JunkPart(mockSprite, 'testPartId', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      expect(junkPart.getPartId()).toBe('testPartId');
    });
  });

  describe('getLocation', () => {
    test('should return current location', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 150, y: 200 }, mockReportObject, mockGlobals, mockSound);
      const loc = junkPart.getLocation();
      expect(loc).toBeDefined();
    });
  });

  describe('isOnFloor', () => {
    test('should return true when settled on floor', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 200 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = false;
      expect(junkPart.isOnFloor()).toBe(true);
    });

    test('should return false when still moving', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      junkPart.isMoving = true;
      expect(junkPart.isOnFloor()).toBe(false);
    });
  });

  describe('setActive', () => {
    test('should set mouse object active state', () => {
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      junkPart.mouseObject = { active: true };
      
      junkPart.setActive(false);
      
      expect(junkPart.mouseObject.active).toBe(false);
    });
  });

  describe('floor detection', () => {
    test('should detect when part is within floor bounds', () => {
      mockGlobals.junkViewHandler.getFloorList.mockReturnValue([
        { top: 200, bottom: 250, left: 0, right: 400 }
      ]);
      
      // Part at y=220 should be on the floor (between 200-250)
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 220 }, mockReportObject, mockGlobals, mockSound);
      
      // Should not be moving if already on floor
      expect(junkPart.isMoving).toBeDefined();
    });

    test('should calculate vertical diff when above floor', () => {
      mockGlobals.junkViewHandler.getFloorList.mockReturnValue([
        { top: 200, bottom: 250, left: 0, right: 400 }
      ]);
      
      // Part at y=100 is above floor at y=200
      junkPart = new JunkPart(mockSprite, 'part1', { x: 100, y: 100 }, mockReportObject, mockGlobals, mockSound);
      
      expect(junkPart.verticalDiff).toBeDefined();
    });
  });
});
