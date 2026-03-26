/**
 * @fileoverview Tests for JunkViewHandler - Junk pile view management
 * Based on: ParentScript 27 - JunkViewHandler.ls
 * 
 * JunkViewHandler manages the junk pile view areas (Quay, Yard, Shelves)
 * including floor areas, max parts, and random positioning.
 */

const JunkViewHandler = require('../JunkViewHandler');

describe('JunkViewHandler', () => {
  let junkViewHandler;
  let mockGlobals;

  beforeEach(() => {
    mockGlobals = {
      parts: {
        getPart: jest.fn().mockReturnValue({
          getJunkView: jest.fn().mockReturnValue('junkView'),
          getShelfView: jest.fn().mockReturnValue('shelfView')
        })
      },
      user: {
        getJunk: jest.fn().mockReturnValue([])
      }
    };
  });

  afterEach(() => {
    if (junkViewHandler) {
      junkViewHandler.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize floorList with Quay, Yard, Shelf areas', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.floorList).toBeDefined();
      expect(junkViewHandler.floorList.Quay).toBeDefined();
      expect(junkViewHandler.floorList.Yard).toBeDefined();
      expect(junkViewHandler.floorList.Shelf).toBeDefined();
    });

    test('should set Quay floor rect', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.floorList.Quay).toEqual([
        { left: 4, top: 475, right: 544, bottom: 476 }
      ]);
    });

    test('should set Yard floor rect', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.floorList.Yard).toEqual([
        { left: 4, top: 475, right: 636, bottom: 476 }
      ]);
    });

    test('should set Shelf floor rects (4 shelves)', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.floorList.Shelf.length).toBe(4);
    });

    test('should initialize maxList with part limits', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.maxList).toEqual({
        Quay: 30,
        Yard: 10,
        Shelf: 80
      });
    });

    test('should initialize maxSoundList with dialog IDs', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.maxSoundList).toBeDefined();
      expect(junkViewHandler.maxSoundList.Quay).toBeDefined();
      expect(junkViewHandler.maxSoundList.Yard).toBeDefined();
      expect(junkViewHandler.maxSoundList.Shelf).toBeDefined();
      expect(junkViewHandler.maxSoundList.AllFull).toBeDefined();
    });

    test('should set noOfShelfs to 6', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.noOfShelfs).toBe(6);
    });

    test('should return this', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler).toBeInstanceOf(JunkViewHandler);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should clear floorList', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      junkViewHandler.kill();
      expect(junkViewHandler.floorList).toBeNull();
    });

    test('should clear maxList', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      junkViewHandler.kill();
      expect(junkViewHandler.maxList).toBeNull();
    });

    test('should clear maxSoundList', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      junkViewHandler.kill();
      expect(junkViewHandler.maxSoundList).toBeNull();
    });

    test('should return null', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const result = junkViewHandler.kill();
      expect(result).toBeNull();
    });
  });

  describe('getMaxNoOfParts', () => {
    /**
     * Lingo: on getMaxNoOfParts me, argWhere
     */
    test('should return 30 for Quay', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.getMaxNoOfParts('Quay')).toBe(30);
    });

    test('should return 10 for Yard', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.getMaxNoOfParts('Yard')).toBe(10);
    });

    test('should return 80 for Shelf', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.getMaxNoOfParts('Shelf')).toBe(80);
    });

    test('should return 80 for Shelf1', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.getMaxNoOfParts('Shelf1')).toBe(80);
    });

    test('should return 80 for Shelf6', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.getMaxNoOfParts('Shelf6')).toBe(80);
    });
  });

  describe('checkFull', () => {
    /**
     * Lingo: on checkFull me, argWhere
     */
    test('should return false when junk count is below max', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(10));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Quay')).toBe(false);
    });

    test('should return true when junk count equals max', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(30));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Quay')).toBe(true);
    });

    test('should return true when junk count exceeds max', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(35));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Quay')).toBe(true);
    });

    test('should check Shelf limit for Shelf1', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(50));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Shelf1')).toBe(false);
    });

    test('should return true for Shelf when at limit', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(80));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Shelf1')).toBe(true);
    });

    test('should check Yard limit', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(5));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Yard')).toBe(false);
    });

    test('should return true for Yard when at limit', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(10));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      expect(junkViewHandler.checkFull('Yard')).toBe(true);
    });
  });

  describe('getFloorList', () => {
    /**
     * Lingo: on getFloorList me, argWhere
     */
    test('should return Quay floor list', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const floors = junkViewHandler.getFloorList('Quay');
      expect(floors.length).toBe(1);
      expect(floors[0]).toEqual({ left: 4, top: 475, right: 544, bottom: 476 });
    });

    test('should return Yard floor list', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const floors = junkViewHandler.getFloorList('Yard');
      expect(floors.length).toBe(1);
    });

    test('should return Shelf floor list for Shelf', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const floors = junkViewHandler.getFloorList('Shelf');
      expect(floors.length).toBe(4);
    });

    test('should return Shelf floor list for Shelf1', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const floors = junkViewHandler.getFloorList('Shelf1');
      expect(floors.length).toBe(4);
    });

    test('should return Shelf floor list for Shelf6', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const floors = junkViewHandler.getFloorList('Shelf6');
      expect(floors.length).toBe(4);
    });
  });

  describe('getRandomPosition', () => {
    /**
     * Lingo: on getRandomPosition me, argWhere, argPartID
     */
    beforeEach(() => {
      // Mock member dimensions
      junkViewHandler = new JunkViewHandler(mockGlobals);
      junkViewHandler._getMemberDimensions = jest.fn().mockReturnValue({
        width: 50,
        height: 30
      });
    });

    test('should return a point object', () => {
      const pos = junkViewHandler.getRandomPosition('Quay', 'part1');
      expect(pos).toHaveProperty('x');
      expect(pos).toHaveProperty('y');
    });

    test('should use junkView for Quay', () => {
      junkViewHandler.getRandomPosition('Quay', 'part1');
      expect(mockGlobals.parts.getPart).toHaveBeenCalledWith('part1');
      expect(mockGlobals.parts.getPart().getJunkView).toHaveBeenCalled();
    });

    test('should use junkView for Yard', () => {
      junkViewHandler.getRandomPosition('Yard', 'part1');
      expect(mockGlobals.parts.getPart().getJunkView).toHaveBeenCalled();
    });

    test('should use shelfView for Shelf', () => {
      junkViewHandler.getRandomPosition('Shelf1', 'part1');
      expect(mockGlobals.parts.getPart().getShelfView).toHaveBeenCalled();
    });

    test('should position within floor bounds', () => {
      // Quay floor: left: 4, right: 544
      const pos = junkViewHandler.getRandomPosition('Quay', 'part1');
      expect(pos.x).toBeGreaterThanOrEqual(4);
      expect(pos.x).toBeLessThanOrEqual(544);
    });
  });

  describe('getRandomShelf', () => {
    /**
     * Lingo: on getRandomShelf me
     */
    test('should return a shelf symbol when shelves available', () => {
      mockGlobals.user.getJunk.mockReturnValue([]);
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const result = junkViewHandler.getRandomShelf();
      expect(result).toMatch(/^Shelf[1-6]$/);
    });

    test('should return AllFull when all shelves are full', () => {
      mockGlobals.user.getJunk.mockReturnValue(new Array(80));
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const result = junkViewHandler.getRandomShelf();
      expect(result).toBe('AllFull');
    });

    test('should only return non-full shelves', () => {
      // Make some shelves full
      let callCount = 0;
      mockGlobals.user.getJunk.mockImplementation(() => {
        callCount++;
        // First 3 shelves full, rest not
        return callCount <= 3 ? new Array(80) : [];
      });
      
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const result = junkViewHandler.getRandomShelf();
      expect(result).toMatch(/^Shelf[4-6]$/);
    });
  });

  describe('getMaxSound', () => {
    /**
     * Lingo: on getMaxSound me, argWhere
     */
    test('should return a Quay sound', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const sound = junkViewHandler.getMaxSound('Quay');
      expect(['00d007v0', '00d008v0']).toContain(sound);
    });

    test('should return a Yard sound', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const sound = junkViewHandler.getMaxSound('Yard');
      expect(['00d009v0', '03d008v0', '03d009v0', '03d010v0']).toContain(sound);
    });

    test('should return a Shelf sound', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const sound = junkViewHandler.getMaxSound('Shelf');
      expect(['03d011v0', '03d012v0', '03d014v0']).toContain(sound);
    });

    test('should return Shelf sound for Shelf1', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const sound = junkViewHandler.getMaxSound('Shelf1');
      expect(['03d011v0', '03d012v0', '03d014v0']).toContain(sound);
    });

    test('should return AllFull sound', () => {
      junkViewHandler = new JunkViewHandler(mockGlobals);
      const sound = junkViewHandler.getMaxSound('AllFull');
      expect(['03d015v0']).toContain(sound);
    });
  });
});
