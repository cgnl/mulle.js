/**
 * @fileoverview Tests for LevelHandler - Level progression management
 * Based on: ParentScript 31 - LevelHandler.ls
 * 
 * LevelHandler manages game progression levels based on built boats,
 * collected parts, and inventory items.
 */

const LevelHandler = require('../LevelHandler');

describe('LevelHandler', () => {
  let levelHandler;
  let mockGlobals;

  beforeEach(() => {
    mockGlobals = {
      user: {
        getNrOfBuiltBoats: jest.fn().mockReturnValue(0),
        gotPart: jest.fn().mockReturnValue(false),
        isInInventory: jest.fn().mockReturnValue(false)
      }
    };
  });

  afterEach(() => {
    if (levelHandler) {
      levelHandler.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize level to 0', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.level).toBe(0);
    });

    test('should initialize lockLevel to false', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.lockLevel).toBe(false);
    });

    test('should initialize minBuiltBoats array', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.minBuiltBoats).toEqual([0, 6, 9, 12, 15]);
    });

    test('should initialize partsRequired array', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.partsRequired).toHaveLength(5);
      expect(levelHandler.partsRequired[0]).toEqual([]);
      expect(levelHandler.partsRequired[2]).toEqual([30]);
      expect(levelHandler.partsRequired[3]).toEqual([17, 46]);
      expect(levelHandler.partsRequired[4]).toEqual([975]);
    });

    test('should initialize inventoryRequired array', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.inventoryRequired).toHaveLength(5);
      expect(levelHandler.inventoryRequired[0]).toEqual([]);
      expect(levelHandler.inventoryRequired[3]).toEqual(['MapPiece1']);
      expect(levelHandler.inventoryRequired[4]).toContain('helmet');
      expect(levelHandler.inventoryRequired[4]).toContain('Suit');
    });

    test('should return this', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler).toBeInstanceOf(LevelHandler);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should clear minBuiltBoats', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.kill();
      expect(levelHandler.minBuiltBoats).toBeNull();
    });

    test('should clear partsRequired', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.kill();
      expect(levelHandler.partsRequired).toBeNull();
    });

    test('should clear inventoryRequired', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.kill();
      expect(levelHandler.inventoryRequired).toBeNull();
    });

    test('should return null', () => {
      levelHandler = new LevelHandler(mockGlobals);
      const result = levelHandler.kill();
      expect(result).toBeNull();
    });
  });

  describe('setLevel', () => {
    /**
     * Lingo: on setLevel me, argLevel
     */
    test('should set level value', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.setLevel(3);
      expect(levelHandler.level).toBe(3);
    });
  });

  describe('setLockLevel', () => {
    /**
     * Lingo: on setlockLevel me, argStatus
     */
    test('should set lockLevel to true', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.setLockLevel(true);
      expect(levelHandler.lockLevel).toBe(true);
    });

    test('should set lockLevel to false', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.setLockLevel(true);
      levelHandler.setLockLevel(false);
      expect(levelHandler.lockLevel).toBe(false);
    });
  });

  describe('gotParts', () => {
    /**
     * Lingo: on gotParts me, argLevel
     */
    test('should return true for level with no required parts', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.gotParts(1)).toBe(true);
    });

    test('should return true when user has all required parts', () => {
      mockGlobals.user.gotPart.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.gotParts(3)).toBe(true);
    });

    test('should return false when user missing required part', () => {
      mockGlobals.user.gotPart.mockReturnValue(false);
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.gotParts(3)).toBe(false);
    });

    test('should check part 975 for level 5', () => {
      mockGlobals.user.gotPart.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.gotParts(5); // Level 5 requires part 975
      expect(mockGlobals.user.gotPart).toHaveBeenCalledWith(975);
    });

    test('should check parts 17 and 46 for level 4', () => {
      mockGlobals.user.gotPart.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.gotParts(4); // Level 4 requires [17, 46]
      expect(mockGlobals.user.gotPart).toHaveBeenCalledWith(17);
      expect(mockGlobals.user.gotPart).toHaveBeenCalledWith(46);
    });
  });

  describe('gotInventory', () => {
    /**
     * Lingo: on gotInventory me, argLevel
     */
    test('should return true for level with no required inventory', () => {
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.gotInventory(1)).toBe(true);
    });

    test('should return true when user has all required inventory', () => {
      mockGlobals.user.isInInventory.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.gotInventory(4)).toBe(true);
    });

    test('should return false when user missing required inventory', () => {
      mockGlobals.user.isInInventory.mockReturnValue(false);
      levelHandler = new LevelHandler(mockGlobals);
      expect(levelHandler.gotInventory(4)).toBe(false);
    });

    test('should check MapPiece1 for level 4', () => {
      mockGlobals.user.isInInventory.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.gotInventory(4);
      expect(mockGlobals.user.isInInventory).toHaveBeenCalledWith('MapPiece1');
    });

    test('should check all items for level 5', () => {
      mockGlobals.user.isInInventory.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.gotInventory(5);
      expect(mockGlobals.user.isInInventory).toHaveBeenCalledWith('helmet');
      expect(mockGlobals.user.isInInventory).toHaveBeenCalledWith('Suit');
      expect(mockGlobals.user.isInInventory).toHaveBeenCalledWith('Fishingrod');
    });
  });

  describe('updateLevel', () => {
    /**
     * Lingo: on updateLevel me
     */
    test('should set level 1 when 0 boats built', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(0);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.updateLevel();
      expect(levelHandler.level).toBe(1);
    });

    test('should set level 2 when 6 boats built', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(6);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.updateLevel();
      expect(levelHandler.level).toBe(2);
    });

    test('should set level 3 when 9 boats built and has part 30', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(9);
      mockGlobals.user.gotPart.mockImplementation((partId) => partId === 30);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.updateLevel();
      expect(levelHandler.level).toBe(3);
    });

    test('should stay at level 2 when 9 boats but missing part 30', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(9);
      mockGlobals.user.gotPart.mockReturnValue(false);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.updateLevel();
      expect(levelHandler.level).toBe(2);
    });

    test('should set level 4 when 12 boats and has parts and inventory', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(12);
      mockGlobals.user.gotPart.mockReturnValue(true);
      mockGlobals.user.isInInventory.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.updateLevel();
      expect(levelHandler.level).toBe(4);
    });

    test('should set level 5 when 15 boats and all requirements met', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(15);
      mockGlobals.user.gotPart.mockReturnValue(true);
      mockGlobals.user.isInInventory.mockReturnValue(true);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.updateLevel();
      expect(levelHandler.level).toBe(5);
    });
  });

  describe('getLevel', () => {
    /**
     * Lingo: on getLevel me
     */
    test('should update level when not locked', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(6);
      levelHandler = new LevelHandler(mockGlobals);
      const level = levelHandler.getLevel();
      expect(level).toBe(2);
    });

    test('should not update level when locked', () => {
      mockGlobals.user.getNrOfBuiltBoats.mockReturnValue(6);
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.setLevel(1);
      levelHandler.setLockLevel(true);
      const level = levelHandler.getLevel();
      expect(level).toBe(1); // Stays at 1, not updated to 2
    });

    test('should return current level', () => {
      levelHandler = new LevelHandler(mockGlobals);
      levelHandler.setLevel(3);
      levelHandler.setLockLevel(true);
      expect(levelHandler.getLevel()).toBe(3);
    });
  });
});
