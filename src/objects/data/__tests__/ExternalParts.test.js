/**
 * @fileoverview Tests for ExternalParts - External parts availability manager
 * Based on: ParentScript 32 - ExternalParts.ls
 * 
 * ExternalParts manages parts that can be obtained externally (e.g., from
 * postal delivery, random finds, etc.). It tracks which parts are available
 * and which the user already has.
 */

const ExternalParts = require('../ExternalParts');

describe('ExternalParts', () => {
  let externalParts;
  let mockGlobals;

  beforeEach(() => {
    mockGlobals = {
      user: {
        gotPart: jest.fn().mockReturnValue(false)
      }
    };
    externalParts = new ExternalParts(mockGlobals);
  });

  afterEach(() => {
    if (externalParts) {
      externalParts.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     *   set partList to [:]
     *   set currentlyAvailable to [:]
     *   return me
     */
    test('should initialize with empty partList', () => {
      expect(externalParts).toBeDefined();
      expect(externalParts.partList).toEqual({});
    });

    test('should initialize with empty currentlyAvailable', () => {
      expect(externalParts.currentlyAvailable).toEqual({});
    });

    test('should store globals reference', () => {
      expect(externalParts.globals).toBe(mockGlobals);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   set partList to 0
     *   set currentlyAvailable to 0
     *   return 0
     */
    test('should set partList to null', () => {
      externalParts.kill();
      expect(externalParts.partList).toBeNull();
    });

    test('should set currentlyAvailable to null', () => {
      externalParts.kill();
      expect(externalParts.currentlyAvailable).toBeNull();
    });

    test('should return null', () => {
      const result = externalParts.kill();
      expect(result).toBeNull();
    });
  });

  describe('calcCurrentlyAvailable', () => {
    /**
     * Lingo: on calcCurrentlyAvailable me, argCategory
     *   set tmpCategory to getaProp(partList, argCategory)
     *   if listp(tmpCategory) then
     *     set tmpList to []
     *     repeat with tmpPartID in tmpCategory
     *       if not gotPart(the user of gMulleGlobals, tmpPartID) then
     *         add(tmpList, tmpPartID)
     *       end if
     *     end repeat
     *     setProp(currentlyAvailable, argCategory, duplicate(tmpList))
     *   end if
     */
    test('should calculate available parts for category', () => {
      externalParts.partList = {
        postal: ['part1', 'part2', 'part3']
      };
      mockGlobals.user.gotPart.mockReturnValue(false);
      
      externalParts.calcCurrentlyAvailable('postal');
      
      expect(externalParts.currentlyAvailable.postal).toEqual(['part1', 'part2', 'part3']);
    });

    test('should exclude parts user already has', () => {
      externalParts.partList = {
        postal: ['part1', 'part2', 'part3']
      };
      mockGlobals.user.gotPart.mockImplementation(partId => partId === 'part2');
      
      externalParts.calcCurrentlyAvailable('postal');
      
      expect(externalParts.currentlyAvailable.postal).toEqual(['part1', 'part3']);
    });

    test('should return empty list if user has all parts', () => {
      externalParts.partList = {
        random: ['part1', 'part2']
      };
      mockGlobals.user.gotPart.mockReturnValue(true);
      
      externalParts.calcCurrentlyAvailable('random');
      
      expect(externalParts.currentlyAvailable.random).toEqual([]);
    });

    test('should do nothing for non-existent category', () => {
      externalParts.calcCurrentlyAvailable('nonExistent');
      
      expect(externalParts.currentlyAvailable.nonExistent).toBeUndefined();
    });

    test('should do nothing if category is not a list', () => {
      externalParts.partList = {
        invalid: 'not a list'
      };
      
      externalParts.calcCurrentlyAvailable('invalid');
      
      expect(externalParts.currentlyAvailable.invalid).toBeUndefined();
    });
  });

  describe('getCurrentlyAvailable', () => {
    /**
     * Lingo: on getCurrentlyAvailable me, argCategory
     *   calcCurrentlyAvailable(me, argCategory)
     *   return getaProp(currentlyAvailable, argCategory)
     */
    test('should return available parts for category', () => {
      externalParts.partList = {
        delivery: ['partA', 'partB']
      };
      mockGlobals.user.gotPart.mockReturnValue(false);
      
      const result = externalParts.getCurrentlyAvailable('delivery');
      
      expect(result).toEqual(['partA', 'partB']);
    });

    test('should recalculate before returning', () => {
      externalParts.partList = {
        postal: ['p1', 'p2']
      };
      
      // First call - user has no parts
      mockGlobals.user.gotPart.mockReturnValue(false);
      let result = externalParts.getCurrentlyAvailable('postal');
      expect(result).toEqual(['p1', 'p2']);
      
      // User got part p1
      mockGlobals.user.gotPart.mockImplementation(id => id === 'p1');
      result = externalParts.getCurrentlyAvailable('postal');
      expect(result).toEqual(['p2']);
    });

    test('should return undefined for non-existent category', () => {
      const result = externalParts.getCurrentlyAvailable('nonExistent');
      expect(result).toBeUndefined();
    });
  });

  describe('getRandomPart', () => {
    /**
     * Lingo: on getRandomPart me
     *   set tmpRandom to getCurrentlyAvailable(me, #random)
     *   if listp(tmpRandom) then
     *     set tmpCount to count(tmpRandom)
     *     if tmpCount > 0 then
     *       return getAt(tmpRandom, random(tmpCount))
     *     end if
     *   end if
     *   return #NoPart
     */
    test('should return a random part from random category', () => {
      externalParts.partList = {
        random: ['r1', 'r2', 'r3']
      };
      mockGlobals.user.gotPart.mockReturnValue(false);
      
      const result = externalParts.getRandomPart();
      
      expect(['r1', 'r2', 'r3']).toContain(result);
    });

    test('should return NoPart symbol when no random parts available', () => {
      externalParts.partList = {
        random: []
      };
      
      const result = externalParts.getRandomPart();
      
      expect(result).toBe('NoPart');
    });

    test('should return NoPart when user has all random parts', () => {
      externalParts.partList = {
        random: ['r1', 'r2']
      };
      mockGlobals.user.gotPart.mockReturnValue(true);
      
      const result = externalParts.getRandomPart();
      
      expect(result).toBe('NoPart');
    });

    test('should return NoPart when random category does not exist', () => {
      externalParts.partList = {};
      
      const result = externalParts.getRandomPart();
      
      expect(result).toBe('NoPart');
    });
  });

  describe('getParts', () => {
    /**
     * Lingo: on getParts me, theCategory
     *   if voidp(theCategory) then
     *     return partList
     *   end if
     *   return getaProp(partList, theCategory)
     */
    test('should return entire partList when no category specified', () => {
      externalParts.partList = {
        postal: ['p1'],
        random: ['r1']
      };
      
      const result = externalParts.getParts();
      
      expect(result).toEqual({
        postal: ['p1'],
        random: ['r1']
      });
    });

    test('should return specific category when specified', () => {
      externalParts.partList = {
        postal: ['p1', 'p2'],
        random: ['r1']
      };
      
      const result = externalParts.getParts('postal');
      
      expect(result).toEqual(['p1', 'p2']);
    });

    test('should return undefined for non-existent category', () => {
      externalParts.partList = {
        postal: ['p1']
      };
      
      const result = externalParts.getParts('nonExistent');
      
      expect(result).toBeUndefined();
    });
  });

  describe('toList', () => {
    /**
     * Lingo: on toList me
     *   return partList
     */
    test('should return partList', () => {
      externalParts.partList = {
        postal: ['p1'],
        delivery: ['d1']
      };
      
      const result = externalParts.toList();
      
      expect(result).toBe(externalParts.partList);
    });
  });

  describe('fromList', () => {
    /**
     * Lingo: on fromList me, objectList
     *   set partList to objectList
     *   set currentlyAvailable to [#Postal: [], #Delivery: [], #random: []]
     *   if voidp(partList) then
     *     set partList to duplicate(currentlyAvailable)
     *   else
     *     if count(partList) = 0 then
     *       set partList to duplicate(currentlyAvailable)
     *     end if
     *   end if
     */
    test('should set partList from objectList', () => {
      const data = {
        postal: ['p1', 'p2'],
        delivery: ['d1'],
        random: ['r1']
      };
      
      externalParts.fromList(data);
      
      expect(externalParts.partList).toEqual(data);
    });

    test('should initialize currentlyAvailable with empty arrays', () => {
      externalParts.fromList({
        postal: ['p1']
      });
      
      expect(externalParts.currentlyAvailable).toEqual({
        postal: [],
        delivery: [],
        random: []
      });
    });

    test('should use default structure for undefined partList', () => {
      externalParts.fromList(undefined);
      
      expect(externalParts.partList).toEqual({
        postal: [],
        delivery: [],
        random: []
      });
    });

    test('should use default structure for null partList', () => {
      externalParts.fromList(null);
      
      expect(externalParts.partList).toEqual({
        postal: [],
        delivery: [],
        random: []
      });
    });

    test('should use default structure for empty partList', () => {
      externalParts.fromList({});
      
      expect(externalParts.partList).toEqual({
        postal: [],
        delivery: [],
        random: []
      });
    });
  });

  describe('addPartToCategory', () => {
    test('should add part to existing category', () => {
      externalParts.partList = {
        postal: ['p1']
      };
      
      externalParts.addPartToCategory('postal', 'p2');
      
      expect(externalParts.partList.postal).toEqual(['p1', 'p2']);
    });

    test('should create category if not exists', () => {
      externalParts.partList = {};
      
      externalParts.addPartToCategory('newCategory', 'part1');
      
      expect(externalParts.partList.newCategory).toEqual(['part1']);
    });
  });

  describe('removePartFromCategory', () => {
    test('should remove part from category', () => {
      externalParts.partList = {
        postal: ['p1', 'p2', 'p3']
      };
      
      externalParts.removePartFromCategory('postal', 'p2');
      
      expect(externalParts.partList.postal).toEqual(['p1', 'p3']);
    });

    test('should do nothing if part not in category', () => {
      externalParts.partList = {
        postal: ['p1', 'p2']
      };
      
      externalParts.removePartFromCategory('postal', 'p3');
      
      expect(externalParts.partList.postal).toEqual(['p1', 'p2']);
    });

    test('should do nothing if category does not exist', () => {
      externalParts.partList = {};
      
      expect(() => externalParts.removePartFromCategory('nonExistent', 'p1')).not.toThrow();
    });
  });

  describe('getCategoryCount', () => {
    test('should return count of parts in category', () => {
      externalParts.partList = {
        postal: ['p1', 'p2', 'p3']
      };
      
      expect(externalParts.getCategoryCount('postal')).toBe(3);
    });

    test('should return 0 for empty category', () => {
      externalParts.partList = {
        postal: []
      };
      
      expect(externalParts.getCategoryCount('postal')).toBe(0);
    });

    test('should return 0 for non-existent category', () => {
      externalParts.partList = {};
      
      expect(externalParts.getCategoryCount('nonExistent')).toBe(0);
    });
  });

  describe('hasPartInCategory', () => {
    test('should return true if part exists in category', () => {
      externalParts.partList = {
        random: ['r1', 'r2', 'r3']
      };
      
      expect(externalParts.hasPartInCategory('random', 'r2')).toBe(true);
    });

    test('should return false if part not in category', () => {
      externalParts.partList = {
        random: ['r1', 'r2']
      };
      
      expect(externalParts.hasPartInCategory('random', 'r3')).toBe(false);
    });

    test('should return false for non-existent category', () => {
      externalParts.partList = {};
      
      expect(externalParts.hasPartInCategory('nonExistent', 'p1')).toBe(false);
    });
  });

  describe('getAllCategories', () => {
    test('should return all category names', () => {
      externalParts.partList = {
        postal: ['p1'],
        delivery: ['d1'],
        random: ['r1']
      };
      
      const categories = externalParts.getAllCategories();
      
      expect(categories).toContain('postal');
      expect(categories).toContain('delivery');
      expect(categories).toContain('random');
      expect(categories.length).toBe(3);
    });

    test('should return empty array for empty partList', () => {
      externalParts.partList = {};
      
      expect(externalParts.getAllCategories()).toEqual([]);
    });
  });
});
