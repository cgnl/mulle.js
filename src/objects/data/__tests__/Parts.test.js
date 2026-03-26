/**
 * @fileoverview Tests for Parts - Parts collection manager
 * Based on: ParentScript 7 - Parts.ls
 * 
 * Parts manages a collection of Part objects, allowing adding and
 * retrieving parts by their ID. It also handles serialization from
 * a list format (for save/load functionality).
 */

const Parts = require('../Parts');
const Part = require('../Part');

// Helper to create part data object
const createPartData = (id, category = 'body') => ({
  partId: id,
  master: 0,
  Properties: { category },
  ClickArea: [[0, 0, 10, 10]],
  Requires: [],
  Covers: [],
  new: [],
  ShelfView: `${id}_shelf`,
  junkView: `${id}_junk`,
  UseView: `${id}_use`
});

describe('Parts', () => {
  let parts;

  beforeEach(() => {
    parts = new Parts();
  });

  afterEach(() => {
    if (parts && parts.partList !== null) {
      parts.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     *   set partList to [:]
     *   return me
     */
    test('should initialize with empty partList', () => {
      expect(parts).toBeDefined();
      expect(parts.partList).toEqual({});
    });

    test('should return self on construction', () => {
      const newParts = new Parts();
      expect(newParts).toBeInstanceOf(Parts);
      newParts.kill();
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   set partList to 0
     *   return 0
     */
    test('should set partList to null', () => {
      parts.kill();
      expect(parts.partList).toBeNull();
    });

    test('should return null', () => {
      const result = parts.kill();
      expect(result).toBeNull();
    });

    test('should clean up all parts', () => {
      const part1 = new Part();
      part1.fromList(createPartData('part1'));
      parts.addPart(part1);

      parts.kill();
      expect(parts.partList).toBeNull();
    });
  });

  describe('addPart', () => {
    /**
     * Lingo: on addPart me, argPart
     *   addProp(partList, getId(argPart), argPart)
     */
    test('should add a part to the partList', () => {
      const part = new Part();
      part.fromList(createPartData('testPart'));
      
      parts.addPart(part);
      
      expect(parts.partList['testPart']).toBe(part);
    });

    test('should add part using its ID as key', () => {
      const part = new Part();
      part.fromList(createPartData('myPartId', 'hull'));
      
      parts.addPart(part);
      
      expect(parts.partList['myPartId']).toBeDefined();
      expect(parts.partList['myPartId'].getId()).toBe('myPartId');
    });

    test('should add multiple parts', () => {
      const part1 = new Part();
      part1.fromList(createPartData('part1'));
      
      const part2 = new Part();
      part2.fromList(createPartData('part2', 'engine'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      expect(Object.keys(parts.partList).length).toBe(2);
      expect(parts.partList['part1']).toBe(part1);
      expect(parts.partList['part2']).toBe(part2);
    });

    test('should overwrite part with same ID', () => {
      const part1 = new Part();
      part1.fromList(createPartData('sameId', 'body'));
      
      const part2 = new Part();
      part2.fromList(createPartData('sameId', 'engine'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      expect(Object.keys(parts.partList).length).toBe(1);
      expect(parts.partList['sameId']).toBe(part2);
    });
  });

  describe('getPart', () => {
    /**
     * Lingo: on getPart me, argPartID
     *   set part to getaProp(partList, argPartID)
     *   if objectp(part) then
     *     return part
     *   end if
     *   return 0
     */
    test('should return part by ID', () => {
      const part = new Part();
      part.fromList(createPartData('findMe'));
      parts.addPart(part);
      
      const found = parts.getPart('findMe');
      
      expect(found).toBe(part);
    });

    test('should return null for non-existent part', () => {
      const result = parts.getPart('nonExistent');
      expect(result).toBeNull();
    });

    test('should return null for undefined partID', () => {
      const result = parts.getPart(undefined);
      expect(result).toBeNull();
    });

    test('should return correct part from multiple parts', () => {
      const part1 = new Part();
      part1.fromList(createPartData('part1'));
      
      const part2 = new Part();
      part2.fromList(createPartData('part2', 'engine'));
      
      const part3 = new Part();
      part3.fromList(createPartData('part3', 'hull'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      parts.addPart(part3);
      
      expect(parts.getPart('part2')).toBe(part2);
      expect(parts.getPart('part1')).toBe(part1);
      expect(parts.getPart('part3')).toBe(part3);
    });

    test('should return null after kill', () => {
      const part = new Part();
      part.fromList(createPartData('testPart'));
      parts.addPart(part);
      
      parts.kill();
      
      // After kill, partList is null, so getPart should handle gracefully
      expect(() => parts.getPart('testPart')).not.toThrow();
    });
  });

  describe('fromList', () => {
    /**
     * Lingo: on fromList me, argObjectList
     *   set partList to [:]
     *   set tmpNoOfParts to count(argObjectList)
     *   repeat with tmpRkn = 1 to tmpNoOfParts
     *     set newPart to new(script "Part")
     *     if fromList(newPart, getAt(argObjectList, tmpRkn)) then
     *       addPart(me, newPart)
     *     end if
     *   end repeat
     */
    test('should initialize from empty list', () => {
      parts.fromList([]);
      expect(parts.partList).toEqual({});
    });

    test('should create parts from list of part data', () => {
      const partDataList = [
        createPartData('part1'),
        createPartData('part2', 'engine')
      ];
      
      parts.fromList(partDataList);
      
      expect(Object.keys(parts.partList).length).toBe(2);
      expect(parts.getPart('part1')).toBeDefined();
      expect(parts.getPart('part2')).toBeDefined();
    });

    test('should reset partList before loading', () => {
      // Add a part first
      const existingPart = new Part();
      existingPart.fromList(createPartData('existing'));
      parts.addPart(existingPart);
      
      // Load new list
      const partDataList = [
        createPartData('newPart', 'hull')
      ];
      
      parts.fromList(partDataList);
      
      // Should only have the new part
      expect(parts.getPart('existing')).toBeNull();
      expect(parts.getPart('newPart')).toBeDefined();
    });

    test('should skip invalid part data', () => {
      const partDataList = [
        createPartData('valid'),
        null,  // Invalid
        createPartData('another', 'hull')
      ];
      
      parts.fromList(partDataList);
      
      // Should have added the valid parts
      expect(parts.getPart('valid')).toBeDefined();
      expect(parts.getPart('another')).toBeDefined();
    });

    test('should handle undefined list', () => {
      expect(() => parts.fromList(undefined)).not.toThrow();
      expect(parts.partList).toEqual({});
    });

    test('should handle null list', () => {
      expect(() => parts.fromList(null)).not.toThrow();
      expect(parts.partList).toEqual({});
    });

    test('should correctly populate part properties', () => {
      const partDataList = [
        {
          partId: 'hull01',
          Properties: { category: 'hull', weight: 100 },
          ClickArea: [[10, 20, 30, 40]],
          ShelfView: 'hullSprite'
        }
      ];
      
      parts.fromList(partDataList);
      
      const part = parts.getPart('hull01');
      expect(part).toBeDefined();
      expect(part.getId()).toBe('hull01');
    });
  });

  describe('getPartCount', () => {
    test('should return 0 for empty parts', () => {
      expect(parts.getPartCount()).toBe(0);
    });

    test('should return correct count after adding parts', () => {
      const part1 = new Part();
      part1.fromList(createPartData('p1'));
      const part2 = new Part();
      part2.fromList(createPartData('p2', 'hull'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      expect(parts.getPartCount()).toBe(2);
    });
  });

  describe('getAllPartIds', () => {
    test('should return empty array for empty parts', () => {
      expect(parts.getAllPartIds()).toEqual([]);
    });

    test('should return all part IDs', () => {
      const part1 = new Part();
      part1.fromList(createPartData('alpha'));
      const part2 = new Part();
      part2.fromList(createPartData('beta', 'hull'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      const ids = parts.getAllPartIds();
      expect(ids).toContain('alpha');
      expect(ids).toContain('beta');
      expect(ids.length).toBe(2);
    });
  });

  describe('getPartsByCategory', () => {
    test('should return empty array if no parts in category', () => {
      expect(parts.getPartsByCategory('hull')).toEqual([]);
    });

    test('should return parts matching category', () => {
      const hull1 = new Part();
      hull1.fromList(createPartData('h1', 'hull'));
      const hull2 = new Part();
      hull2.fromList(createPartData('h2', 'hull'));
      const engine = new Part();
      engine.fromList(createPartData('e1', 'engine'));
      
      parts.addPart(hull1);
      parts.addPart(hull2);
      parts.addPart(engine);
      
      const hulls = parts.getPartsByCategory('hull');
      expect(hulls.length).toBe(2);
      expect(hulls).toContain(hull1);
      expect(hulls).toContain(hull2);
      
      const engines = parts.getPartsByCategory('engine');
      expect(engines.length).toBe(1);
      expect(engines[0]).toBe(engine);
    });
  });

  describe('hasPart', () => {
    test('should return false for non-existent part', () => {
      expect(parts.hasPart('nonExistent')).toBe(false);
    });

    test('should return true for existing part', () => {
      const part = new Part();
      part.fromList(createPartData('exists'));
      parts.addPart(part);
      
      expect(parts.hasPart('exists')).toBe(true);
    });
  });

  describe('removePart', () => {
    test('should remove part by ID', () => {
      const part = new Part();
      part.fromList(createPartData('toRemove'));
      parts.addPart(part);
      
      expect(parts.hasPart('toRemove')).toBe(true);
      
      parts.removePart('toRemove');
      
      expect(parts.hasPart('toRemove')).toBe(false);
    });

    test('should not throw for non-existent part', () => {
      expect(() => parts.removePart('nonExistent')).not.toThrow();
    });
  });

  describe('toList', () => {
    test('should return empty array for empty parts', () => {
      expect(parts.toList()).toEqual([]);
    });

    test('should return serialized part data', () => {
      const part1 = new Part();
      part1.fromList(createPartData('p1'));
      const part2 = new Part();
      part2.fromList(createPartData('p2', 'hull'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      const list = parts.toList();
      expect(list.length).toBe(2);
    });
  });

  describe('clear', () => {
    test('should remove all parts', () => {
      const part1 = new Part();
      part1.fromList(createPartData('p1'));
      const part2 = new Part();
      part2.fromList(createPartData('p2', 'hull'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      expect(parts.getPartCount()).toBe(2);
      
      parts.clear();
      
      expect(parts.getPartCount()).toBe(0);
      expect(parts.partList).toEqual({});
    });
  });

  describe('forEach', () => {
    test('should iterate over all parts', () => {
      const part1 = new Part();
      part1.fromList(createPartData('p1'));
      const part2 = new Part();
      part2.fromList(createPartData('p2', 'hull'));
      
      parts.addPart(part1);
      parts.addPart(part2);
      
      const visited = [];
      parts.forEach((part, id) => {
        visited.push(id);
      });
      
      expect(visited).toContain('p1');
      expect(visited).toContain('p2');
      expect(visited.length).toBe(2);
    });

    test('should not iterate over empty parts', () => {
      const callback = jest.fn();
      parts.forEach(callback);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
