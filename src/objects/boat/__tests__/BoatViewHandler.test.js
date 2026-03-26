/**
 * @fileoverview Tests for BoatViewHandler - Boat view management
 * Based on: ParentScript 30 - BoatViewHandler.ls
 * 
 * BoatViewHandler manages boat display, hull types, materials,
 * and draw offsets for different view contexts.
 */

const BoatViewHandler = require('../BoatViewHandler');

describe('BoatViewHandler', () => {
  let boatViewHandler;
  let mockGlobals;

  beforeEach(() => {
    mockGlobals = {
      user: {
        getBoat: jest.fn().mockReturnValue({
          getParts: jest.fn().mockReturnValue([]),
          replacePart: jest.fn(),
          rebuild: jest.fn(),
          getCurrentLoadCapacity: jest.fn().mockReturnValue(50),
          getProperty: jest.fn().mockReturnValue(100)
        })
      }
    };
  });

  afterEach(() => {
    if (boatViewHandler) {
      boatViewHandler.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize woodList', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.woodList).toBeDefined();
      expect(Array.isArray(boatViewHandler.woodList)).toBe(true);
    });

    test('should initialize metalList', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.metalList).toBeDefined();
      expect(Array.isArray(boatViewHandler.metalList)).toBe(true);
    });

    test('should initialize hullOffsetList with 12 points', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.hullOffsetList).toHaveLength(12);
      expect(boatViewHandler.hullOffsetList[0]).toEqual({ x: 390, y: 167 });
    });

    test('should initialize rudderList', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.rudderList).toBeDefined();
      expect(Array.isArray(boatViewHandler.rudderList)).toBe(true);
    });

    test('should initialize largeList with hull IDs', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.largeList).toContain(1);
      expect(boatViewHandler.largeList).toContain(716);
    });

    test('should initialize mediumList with hull IDs', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.mediumList).toContain(45);
      expect(boatViewHandler.mediumList).toContain(723);
    });

    test('should initialize smallList with hull IDs', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.smallList).toContain(92);
      expect(boatViewHandler.smallList).toContain(730);
    });

    test('should return this', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler).toBeInstanceOf(BoatViewHandler);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should clear woodList', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      boatViewHandler.kill();
      expect(boatViewHandler.woodList).toBeNull();
    });

    test('should clear metalList', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      boatViewHandler.kill();
      expect(boatViewHandler.metalList).toBeNull();
    });

    test('should clear rudderList', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      boatViewHandler.kill();
      expect(boatViewHandler.rudderList).toBeNull();
    });

    test('should return null', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      const result = boatViewHandler.kill();
      expect(result).toBeNull();
    });
  });

  describe('isHull', () => {
    /**
     * Lingo: on isHull me, argPartID
     */
    test('should return true for wood hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // woodList is initialized in constructor with 12 real hull IDs
      expect(boatViewHandler.isHull(719)).toBe(true);
    });

    test('should return true for metal hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // metalList is initialized in constructor with 12 real hull IDs
      expect(boatViewHandler.isHull(716)).toBe(true);
    });

    test('should return false for non-hull part', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.isHull(999)).toBe(false);
    });
  });

  describe('isRudder', () => {
    /**
     * Lingo: on isRudder me, argPartID
     */
    test('should return true for rudder part', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // rudderList initialized in constructor: [818, 820, 822, ...]
      expect(boatViewHandler.isRudder(818)).toBe(true);
    });

    test('should return false for non-rudder part', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.isRudder(999)).toBe(false);
    });
  });

  describe('getHull', () => {
    /**
     * Lingo: on getHull me, argPartList
     */
    test('should return hull from part list', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 719 is in woodList (large wood hull)
      expect(boatViewHandler.getHull([5, 719, 10])).toBe(719);
    });

    test('should return NoHull when no hull in list', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getHull([5, 10, 15])).toBe('NoHull');
    });

    test('should return NoHull for empty list', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getHull([])).toBe('NoHull');
    });

    test('should return NoHull for non-list input', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getHull(null)).toBe('NoHull');
    });
  });

  describe('getCurrentHull', () => {
    /**
     * Lingo: on getCurrentHull me
     */
    test('should get hull from current boat', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue([5, 719, 10]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      expect(boatViewHandler.getCurrentHull()).toBe(719);
    });

    test('should return NoHull when boat has no hull', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue([5, 10]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      expect(boatViewHandler.getCurrentHull()).toBe('NoHull');
    });
  });

  describe('getHullMaterial', () => {
    /**
     * Lingo: on getHullMaterial me, argPartList
     */
    test('should return Wood for wood hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 719 is in woodList
      expect(boatViewHandler.getHullMaterial([719, 5])).toBe('Wood');
    });

    test('should return Metal for metal hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is in metalList
      expect(boatViewHandler.getHullMaterial([1, 5])).toBe('Metal');
    });

    test('should return NoMaterial when no hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getHullMaterial([5, 10])).toBe('NoMaterial');
    });
  });

  describe('getCurrentHullMaterial', () => {
    /**
     * Lingo: on getCurrentHullMaterial me
     */
    test('should get material from current boat', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue([716, 5]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 716 is in metalList
      expect(boatViewHandler.getCurrentHullMaterial()).toBe('Metal');
    });
  });

  describe('getHullType', () => {
    /**
     * Lingo: on getHullType me, argPartList
     */
    test('should return Large for large hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is in metalList and largeList
      expect(boatViewHandler.getHullType([1, 5])).toBe('Large');
    });

    test('should return Medium for medium hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 45 is in metalList and mediumList
      expect(boatViewHandler.getHullType([45, 5])).toBe('Medium');
    });

    test('should return Small for small hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 92 is in woodList and smallList
      expect(boatViewHandler.getHullType([92, 5])).toBe('Small');
    });

    test('should return NoType when no hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getHullType([5, 10])).toBe('NoType');
    });
  });

  describe('getCurrentHullType', () => {
    /**
     * Lingo: on getCurrentHullType me
     */
    test('should get type from current boat', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue([1, 5]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is in metalList and largeList
      expect(boatViewHandler.getCurrentHullType()).toBe('Large');
    });
  });

  describe('getRudder', () => {
    /**
     * Lingo: on getRudder me, argPartList
     */
    test('should return rudder from part list', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 818 is first rudder in rudderList
      expect(boatViewHandler.getRudder([5, 818, 10])).toBe(818);
    });

    test('should return NoRudder when no rudder in list', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getRudder([5, 10])).toBe('NoRudder');
    });

    test('should return NoRudder for non-list input', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      expect(boatViewHandler.getRudder(null)).toBe('NoRudder');
    });
  });

  describe('getCurrentRudder', () => {
    /**
     * Lingo: on getCurrentRudder me
     */
    test('should get rudder from current boat', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue([5, 818, 10]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      expect(boatViewHandler.getCurrentRudder()).toBe(818);
    });
  });

  describe('setWoodHull', () => {
    /**
     * Lingo: on setWoodHull me
     */
    test('should replace metal hull with wood equivalent', () => {
      const boat = mockGlobals.user.getBoat();
      // 1 is metalList[0], woodList[0] is 719
      boat.getParts.mockReturnValue([1]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      boatViewHandler.setWoodHull();
      
      expect(boat.replacePart).toHaveBeenCalledWith(1, 719);
      expect(boat.rebuild).toHaveBeenCalled();
    });

    test('should keep wood hull if already wood', () => {
      const boat = mockGlobals.user.getBoat();
      // 719 is woodList[0]
      boat.getParts.mockReturnValue([719]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      boatViewHandler.setWoodHull();
      
      expect(boat.replacePart).toHaveBeenCalledWith(719, 719);
    });
  });

  describe('setMetalHull', () => {
    /**
     * Lingo: on setMetalHull me
     */
    test('should replace wood hull with metal equivalent', () => {
      const boat = mockGlobals.user.getBoat();
      // 719 is woodList[0], metalList[0] is 1
      boat.getParts.mockReturnValue([719]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      boatViewHandler.setMetalHull();
      
      expect(boat.replacePart).toHaveBeenCalledWith(719, 1);
      expect(boat.rebuild).toHaveBeenCalled();
    });

    test('should keep metal hull if already metal', () => {
      const boat = mockGlobals.user.getBoat();
      // 716 is metalList[1]
      boat.getParts.mockReturnValue([716]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      boatViewHandler.setMetalHull();
      
      expect(boat.replacePart).toHaveBeenCalledWith(716, 716);
    });
  });

  describe('getDrawOffset', () => {
    /**
     * Lingo: on getDrawOffset me, argWhere, argPartList
     */
    test('should return zero offset for Quay with no hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      
      const offset = boatViewHandler.getDrawOffset('Quay', [5, 10]);
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    test('should return offset for Quay with large hull', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getCurrentLoadCapacity.mockReturnValue(50);
      boat.getProperty.mockReturnValue(100);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is metalList large hull
      const offset = boatViewHandler.getDrawOffset('Quay', [1, 5]);
      expect(offset.x).toBe(0);
      // 45 * (1 - 50/100) = 45 * 0.5 = 22.5
      expect(offset.y).toBeCloseTo(22.5, 1);
    });

    test('should return offset for Quay with medium hull', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getCurrentLoadCapacity.mockReturnValue(50);
      boat.getProperty.mockReturnValue(100);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 45 is metalList medium hull
      const offset = boatViewHandler.getDrawOffset('Quay', [45, 5]);
      expect(offset.x).toBe(-25);
      // 5 + 35 * 0.5 = 5 + 17.5 = 22.5
      expect(offset.y).toBeCloseTo(22.5, 1);
    });

    test('should return offset for Quay with small hull', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getCurrentLoadCapacity.mockReturnValue(50);
      boat.getProperty.mockReturnValue(100);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 92 is woodList small hull
      const offset = boatViewHandler.getDrawOffset('Quay', [92, 5]);
      expect(offset.x).toBe(-55);
      // 25 + 20 * 0.5 = 25 + 10 = 35
      expect(offset.y).toBeCloseTo(35, 1);
    });

    test('should return hull offset for ShipYard', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 719 is woodList[0], so hullOffsetList[0] = {390,167}
      const offset = boatViewHandler.getDrawOffset('ShipYard', [719, 5]);
      expect(offset).toEqual({ x: 390, y: 167 });
    });

    test('should return correct offset for PhotoBook with large hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is metalList large hull
      const offset = boatViewHandler.getDrawOffset('PhotoBook', [1, 5]);
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    test('should return correct offset for PhotoBook with medium hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 45 is metalList medium hull
      const offset = boatViewHandler.getDrawOffset('PhotoBook', [45, 5]);
      expect(offset).toEqual({ x: -25, y: 5 });
    });

    test('should return correct offset for PhotoBook with small hull', () => {
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 92 is woodList small hull
      const offset = boatViewHandler.getDrawOffset('PhotoBook', [92, 5]);
      expect(offset).toEqual({ x: -55, y: 25 });
    });

    test('should use current hull when no partList provided', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue([1, 5]);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is metalList large hull
      const offset = boatViewHandler.getDrawOffset('PhotoBook');
      expect(offset).toEqual({ x: 0, y: 0 });
    });

    test('should handle world same as Quay', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getCurrentLoadCapacity.mockReturnValue(100);
      boat.getProperty.mockReturnValue(100);
      
      boatViewHandler = new BoatViewHandler(mockGlobals);
      // 1 is metalList large hull
      const offset = boatViewHandler.getDrawOffset('world', [1, 5]);
      expect(offset.x).toBe(0);
      // Full load, no vertical offset
      expect(offset.y).toBeCloseTo(0, 1);
    });
  });
});
