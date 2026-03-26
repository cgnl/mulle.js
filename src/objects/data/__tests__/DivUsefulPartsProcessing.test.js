/**
 * Tests for DivUsefulPartsProcessing
 * Based on: MovieScript 145 - DivUsefulPartsProcessing.ls
 */

const {
  getStartPile,
  getPlugReserved,
  includeMorphs,
  checkForNonMorphs,
  makeRandomJunkParts,
  setPartPosition,
  checkForDestParts,
  leftOvers,
  fromIdToSound,
  fromSoundToId,
  checkForSoundDoubles,
  getStartParts,
  checkAllPartsValid,
  getUserStuff
} = require('../DivUsefulPartsProcessing');

// Mock part class
class MockPart {
  constructor(id, master = 0, morphList = null, description = '') {
    this._id = id;
    this._master = master;
    this._morphList = morphList;
    this._description = description;
  }

  getId() { return this._id; }
  get id() { return this._id; }
  getMaster() { return this._master; }
  getMorphList() { return this._morphList; }
  getDescription() { return this._description; }
}

// Mock parts collection
class MockParts {
  constructor(parts = []) {
    this.partList = parts;
    this._partsById = {};
    for (const part of parts) {
      this._partsById[part.getId()] = part;
    }
  }

  getPart(id) {
    return this._partsById[id] || null;
  }
}

describe('DivUsefulPartsProcessing', () => {
  describe('getStartPile', () => {
    it('should return the correct starting pile part IDs', () => {
      const pile = getStartPile();
      expect(pile).toEqual([2, 6, 12, 23, 29, 30, 47, 66, 90, 96, 112, 119, 121, 126, 131, 143, 153, 158, 178, 190, 203, 210, 211, 214, 215, 307]);
    });

    it('should have 26 parts in the starting pile', () => {
      expect(getStartPile().length).toBe(26);
    });

    it('should return a new array each time', () => {
      const pile1 = getStartPile();
      const pile2 = getStartPile();
      expect(pile1).not.toBe(pile2);
      pile1.push(999);
      expect(pile2).not.toContain(999);
    });
  });

  describe('getPlugReserved', () => {
    it('should return reserved plug parts', () => {
      const globals = { parts: null };
      const reserved = getPlugReserved(globals);
      expect(reserved).toContain(279);
      expect(reserved).toContain(280);
      expect(reserved).toContain(31);
    });

    it('should include morphs when parts are available', () => {
      const parts = [
        new MockPart(279, 0, [400, 401]),
        new MockPart(280, 0, null),
        new MockPart(31, 0, [500])
      ];
      const globals = { parts: new MockParts(parts) };
      const reserved = getPlugReserved(globals);
      expect(reserved).toContain(279);
      expect(reserved).toContain(400);
      expect(reserved).toContain(401);
      expect(reserved).toContain(31);
      expect(reserved).toContain(500);
    });
  });

  describe('includeMorphs', () => {
    it('should return original list when no globals', () => {
      const result = includeMorphs([1, 2, 3], null);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should include morphs for valid parts', () => {
      const parts = [
        new MockPart(1, 0, [10, 11]),
        new MockPart(2, 0, null),
        new MockPart(3, 0, [30])
      ];
      const globals = { parts: new MockParts(parts) };
      const result = includeMorphs([1, 2, 3], globals);
      expect(result).toContain(1);
      expect(result).toContain(10);
      expect(result).toContain(11);
      expect(result).toContain(2);
      expect(result).toContain(3);
      expect(result).toContain(30);
    });

    it('should skip parts that do not exist', () => {
      const parts = [new MockPart(1, 0, [10])];
      const globals = { parts: new MockParts(parts) };
      const result = includeMorphs([1, 999], globals);
      expect(result).toContain(1);
      expect(result).toContain(10);
      expect(result).not.toContain(999);
    });
  });

  describe('checkForNonMorphs', () => {
    it('should return empty array when no globals', () => {
      const result = checkForNonMorphs(null, null);
      expect(result).toEqual([]);
    });

    it('should filter out morphs from a list', () => {
      const parts = [
        new MockPart(1, 0),      // Master
        new MockPart(2, 1),      // Morph of 1
        new MockPart(3, 0),      // Master
        new MockPart(4, 3)       // Morph of 3
      ];
      const globals = { parts: new MockParts(parts) };
      const result = checkForNonMorphs([1, 2, 3, 4], globals);
      expect(result).toContain(1);
      expect(result).not.toContain(2);
      expect(result).toContain(3);
      expect(result).not.toContain(4);
    });

    it('should use all parts when no list provided', () => {
      const parts = [
        new MockPart(1, 0),
        new MockPart(2, 1),
        new MockPart(3, 0)
      ];
      const globals = { parts: new MockParts(parts) };
      const result = checkForNonMorphs(null, globals);
      expect(result).toContain(1);
      expect(result).not.toContain(2);
      expect(result).toContain(3);
    });
  });

  describe('makeRandomJunkParts', () => {
    it('should distribute parts across 6 piles', () => {
      const parts = [];
      for (let i = 1; i <= 20; i++) {
        parts.push(new MockPart(i, 0));
      }
      const globals = { parts: new MockParts(parts) };

      const junk = makeRandomJunkParts(globals);
      expect(junk).toHaveProperty('Pile1');
      expect(junk).toHaveProperty('Pile2');
      expect(junk).toHaveProperty('Pile3');
      expect(junk).toHaveProperty('Pile4');
      expect(junk).toHaveProperty('Pile5');
      expect(junk).toHaveProperty('Pile6');
    });

    it('should balance piles within 10 parts difference', () => {
      const parts = [];
      for (let i = 1; i <= 60; i++) {
        parts.push(new MockPart(i, 0));
      }
      const globals = { parts: new MockParts(parts) };

      const junk = makeRandomJunkParts(globals);

      const counts = [];
      for (let n = 1; n <= 6; n++) {
        counts.push(Object.keys(junk[`Pile${n}`]).length);
      }

      const max = Math.max(...counts);
      const min = Math.min(...counts);
      expect(max - min).toBeLessThanOrEqual(10);
    });

    it('should include positions for each part', () => {
      const parts = [new MockPart(1, 0), new MockPart(2, 0)];
      const globals = { parts: new MockParts(parts) };

      const junk = makeRandomJunkParts(globals);

      // Find where parts were placed
      let foundWithPosition = false;
      for (let n = 1; n <= 6; n++) {
        const pile = junk[`Pile${n}`];
        for (const partId of Object.keys(pile)) {
          const pos = pile[partId];
          if (pos && typeof pos.x === 'number') {
            foundWithPosition = true;
          }
        }
      }
      expect(foundWithPosition).toBe(true);
    });
  });

  describe('setPartPosition', () => {
    it('should return random position without handlers', () => {
      const pos = setPartPosition(null, 'Pile1', 1);
      expect(pos).toHaveProperty('x');
      expect(pos).toHaveProperty('y');
    });

    it('should use handlers when available', () => {
      const handlers = {
        setPartPosition: (pile, partId) => ({ x: 100, y: 200 })
      };
      const pos = setPartPosition(handlers, 'Pile1', 1);
      expect(pos).toEqual({ x: 100, y: 200 });
    });
  });

  describe('checkForDestParts', () => {
    it('should return empty array without member data', () => {
      const result = checkForDestParts(null, null);
      expect(result).toEqual([]);
    });

    it('should extract parts from destination rewards', () => {
      const memberData = {
        ObjectsDB: [1, 2],
        Object1DB: {
          setWhenDone: { parts: [10, 20] }
        },
        Object2DB: {
          setWhenDone: { parts: [30] }
        }
      };
      const result = checkForDestParts(null, memberData);
      expect(result).toContain(10);
      expect(result).toContain(20);
      expect(result).toContain(30);
    });

    it('should filter out random symbol', () => {
      const memberData = {
        ObjectsDB: [1],
        Object1DB: {
          setWhenDone: { parts: [10, 'random', 20] }
        }
      };
      const result = checkForDestParts(null, memberData);
      expect(result).toContain(10);
      expect(result).toContain(20);
      expect(result).not.toContain('random');
    });

    it('should resolve morphs to masters', () => {
      const parts = [new MockPart(10, 5)]; // 10 is morph of 5
      const globals = { parts: new MockParts(parts) };
      const memberData = {
        ObjectsDB: [1],
        Object1DB: { setWhenDone: { parts: [10] } }
      };
      const result = checkForDestParts(globals, memberData);
      expect(result).toContain(5);
    });
  });

  describe('leftOvers', () => {
    it('should return forRandom and forFigge lists', () => {
      const parts = [];
      for (let i = 1; i <= 50; i++) {
        parts.push(new MockPart(i, 0));
      }
      const globals = { parts: new MockParts(parts) };

      const result = leftOvers(globals, null);
      expect(result).toHaveProperty('forRandom');
      expect(result).toHaveProperty('forFigge');
      expect(Array.isArray(result.forRandom)).toBe(true);
      expect(Array.isArray(result.forFigge)).toBe(true);
    });

    it('should not include start pile parts in forRandom', () => {
      const startPile = getStartPile();
      const parts = startPile.map(id => new MockPart(id, 0));
      parts.push(new MockPart(999, 0)); // Add non-start part
      const globals = { parts: new MockParts(parts) };

      const result = leftOvers(globals, null);
      for (const id of startPile) {
        expect(result.forRandom).not.toContain(id);
      }
    });
  });

  describe('fromIdToSound', () => {
    it('should map part IDs to sound codes', () => {
      const parts = [
        new MockPart(1, 0, null, '20d163v0'),
        new MockPart(2, 0, null, '20d042v0')
      ];
      const globals = { parts: new MockParts(parts) };

      const result = fromIdToSound(globals);
      expect(result[1]).toBe('163');
      expect(result[2]).toBe('042');
    });

    it('should return empty object without globals', () => {
      const result = fromIdToSound(null);
      expect(result).toEqual({});
    });
  });

  describe('fromSoundToId', () => {
    it('should convert sound codes to part IDs', () => {
      const parts = [
        new MockPart(1, 0, null, '20d163v0'),
        new MockPart(2, 0, null, '20d042v0')
      ];
      const globals = { parts: new MockParts(parts) };

      const result = fromSoundToId([163, 42], globals);
      expect(result).toContain(1);
      expect(result).toContain(2);
    });

    it('should return sorted results', () => {
      const parts = [
        new MockPart(50, 0, null, '20d001v0'),
        new MockPart(10, 0, null, '20d002v0'),
        new MockPart(30, 0, null, '20d003v0')
      ];
      const globals = { parts: new MockParts(parts) };

      const result = fromSoundToId([1, 2, 3], globals);
      expect(result).toEqual([10, 30, 50]);
    });

    it('should skip missing sounds', () => {
      const parts = [new MockPart(1, 0, null, '20d163v0')];
      const globals = { parts: new MockParts(parts) };

      const result = fromSoundToId([163, 999], globals);
      expect(result).toEqual([1]);
    });
  });

  describe('checkForSoundDoubles', () => {
    it('should find duplicate sound codes', () => {
      const parts = [
        new MockPart(1, 0, null, '20d163v0'),
        new MockPart(2, 0, null, '20d163v0'),
        new MockPart(3, 0, null, '20d042v0')
      ];
      const globals = { parts: new MockParts(parts) };

      const doubles = checkForSoundDoubles(globals);
      expect(doubles[163]).toContain(1);
      expect(doubles[163]).toContain(2);
      expect(doubles[42]).toBeUndefined();
    });

    it('should return empty object for no duplicates', () => {
      const parts = [
        new MockPart(1, 0, null, '20d001v0'),
        new MockPart(2, 0, null, '20d002v0')
      ];
      const globals = { parts: new MockParts(parts) };

      const doubles = checkForSoundDoubles(globals);
      expect(Object.keys(doubles).length).toBe(0);
    });
  });

  describe('getStartParts', () => {
    it('should extract parts from InitialJunkDB', () => {
      const memberData = {
        InitialJunkDB: [
          { 1: { x: 0, y: 0 }, 2: { x: 10, y: 10 } },
          { 3: { x: 20, y: 20 } }
        ]
      };

      const result = getStartParts(memberData);
      expect(result).toContain(1);
      expect(result).toContain(2);
      expect(result).toContain(3);
    });

    it('should return sorted results', () => {
      const memberData = {
        InitialJunkDB: [
          { 30: {}, 10: {} },
          { 20: {} }
        ]
      };

      const result = getStartParts(memberData);
      expect(result).toEqual([10, 20, 30]);
    });

    it('should return empty array without data', () => {
      expect(getStartParts(null)).toEqual([]);
      expect(getStartParts({})).toEqual([]);
    });
  });

  describe('checkAllPartsValid', () => {
    it('should return missing parts from ExternalPartsDB', () => {
      const parts = [new MockPart(1, 0), new MockPart(2, 0)];
      const globals = { parts: new MockParts(parts) };
      const memberData = {
        ExternalPartsDB: [[1, 2, 999]]
      };

      const missing = checkAllPartsValid(globals, memberData);
      expect(missing).toContain(999);
      expect(missing).not.toContain(1);
      expect(missing).not.toContain(2);
    });

    it('should return missing parts from InitialJunkDB', () => {
      const parts = [new MockPart(1, 0)];
      const globals = { parts: new MockParts(parts) };
      const memberData = {
        InitialJunkDB: [{ 1: {}, 888: {} }]
      };

      const missing = checkAllPartsValid(globals, memberData);
      expect(missing).toContain(888);
    });

    it('should remove duplicate missing IDs', () => {
      const globals = { parts: new MockParts([]) };
      const memberData = {
        ExternalPartsDB: [[999]],
        InitialJunkDB: [{ 999: {} }]
      };

      const missing = checkAllPartsValid(globals, memberData);
      expect(missing.filter(id => id === 999).length).toBe(1);
    });

    it('should return empty array when all valid', () => {
      const parts = [new MockPart(1, 0), new MockPart(2, 0)];
      const globals = { parts: new MockParts(parts) };
      const memberData = {
        ExternalPartsDB: [[1, 2]],
        InitialJunkDB: [{ 1: {}, 2: {} }]
      };

      const missing = checkAllPartsValid(globals, memberData);
      expect(missing).toEqual([]);
    });
  });

  describe('getUserStuff', () => {
    it('should return user ownStuff', () => {
      const globals = {
        user: {
          ownStuff: [1, 2, 3]
        }
      };

      const result = getUserStuff(globals);
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return null without user', () => {
      expect(getUserStuff(null)).toBeNull();
      expect(getUserStuff({})).toBeNull();
      expect(getUserStuff({ user: {} })).toBeNull();
    });
  });
});
