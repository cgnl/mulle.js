/**
 * @fileoverview Tests for Worlds - World collection manager
 * Based on: ParentScript 136 - Worlds.ls
 * 
 * Worlds manages the collection of game worlds and tracks
 * the active/last world for navigation.
 */

const Worlds = require('../Worlds');

describe('Worlds', () => {
  let worlds;

  afterEach(() => {
    if (worlds) {
      worlds.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize worlds as empty array', () => {
      worlds = new Worlds();
      expect(worlds.worlds).toEqual([]);
    });

    test('should initialize activeWorld to null', () => {
      worlds = new Worlds();
      expect(worlds.activeWorld).toBeNull();
    });

    test('should initialize lastWorld to null', () => {
      worlds = new Worlds();
      expect(worlds.lastWorld).toBeNull();
    });

    test('should return this', () => {
      worlds = new Worlds();
      expect(worlds).toBeInstanceOf(Worlds);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should clear worlds array', () => {
      worlds = new Worlds();
      worlds.kill();
      expect(worlds.worlds).toBeNull();
    });

    test('should return null', () => {
      worlds = new Worlds();
      const result = worlds.kill();
      expect(result).toBeNull();
    });
  });

  describe('nrOfWorlds', () => {
    /**
     * Lingo: on nrOfWorlds me
     */
    test('should return 0 for empty worlds', () => {
      worlds = new Worlds();
      expect(worlds.nrOfWorlds()).toBe(0);
    });

    test('should return correct count of worlds', () => {
      worlds = new Worlds();
      worlds.worlds = [{}, {}, {}];
      expect(worlds.nrOfWorlds()).toBe(3);
    });
  });

  describe('isSameWorld', () => {
    /**
     * Lingo: on isSameWorld me
     */
    test('should return false when no active world', () => {
      worlds = new Worlds();
      worlds.activeWorld = null;
      expect(worlds.isSameWorld()).toBe(false);
    });

    test('should return true when active equals last', () => {
      worlds = new Worlds();
      worlds.activeWorld = 'world1';
      worlds.lastWorld = 'world1';
      expect(worlds.isSameWorld()).toBe(true);
    });

    test('should return false when active differs from last', () => {
      worlds = new Worlds();
      worlds.activeWorld = 'world1';
      worlds.lastWorld = 'world2';
      expect(worlds.isSameWorld()).toBe(false);
    });
  });

  describe('getWorldSymbols', () => {
    /**
     * Lingo: on getWorldSymbols me
     */
    test('should return empty array for no worlds', () => {
      worlds = new Worlds();
      expect(worlds.getWorldSymbols()).toEqual([]);
    });

    test('should return symbols for each world', () => {
      worlds = new Worlds();
      worlds.worlds = [
        { symbol: 'Island', name: 'Test Island' },
        { symbol: 'Harbor', name: 'Test Harbor' }
      ];
      worlds._createWorld = jest.fn().mockImplementation(() => ({
        fromList: (data) => true,
        getSymbol: () => data.symbol
      }));
      
      // Mock to track data
      let capturedData = [];
      worlds._createWorld = jest.fn().mockImplementation(() => {
        const mockWorld = {
          data: null,
          fromList: function(d) { this.data = d; return true; },
          getSymbol: function() { return this.data.symbol; }
        };
        return mockWorld;
      });
      
      const result = worlds.getWorldSymbols();
      expect(result).toHaveLength(2);
    });
  });

  describe('loadWorld', () => {
    /**
     * Lingo: on loadWorld me, world, WorldId
     */
    test('should return InvalidObject for non-object world', () => {
      worlds = new Worlds();
      expect(worlds.loadWorld(null, 'world1')).toBe('InvalidObject');
    });

    test('should return InvalidId when world ID not in list', () => {
      worlds = new Worlds();
      worlds.worlds = ['world1', 'world2'];
      const mockWorld = { fromList: jest.fn() };
      
      expect(worlds.loadWorld(mockWorld, 'world3')).toBe('InvalidId');
    });

    test('should load world and update tracking', () => {
      worlds = new Worlds();
      worlds.worlds = ['world1', 'world2'];
      const mockWorld = { fromList: jest.fn().mockReturnValue(true) };
      
      const result = worlds.loadWorld(mockWorld, 'world1');
      
      expect(result).toBe(0);
      expect(worlds.activeWorld).toBe('world1');
      expect(worlds.lastWorld).toBe('world1');
    });

    test('should call fromList on world object', () => {
      worlds = new Worlds();
      worlds.worlds = ['world1'];
      const mockWorld = { fromList: jest.fn().mockReturnValue(true) };
      
      worlds.loadWorld(mockWorld, 'world1');
      
      expect(mockWorld.fromList).toHaveBeenCalledWith('world1');
    });

    test('should return InvalidMember when fromList fails', () => {
      worlds = new Worlds();
      worlds.worlds = ['world1'];
      const mockWorld = { fromList: jest.fn().mockReturnValue(false) };
      
      expect(worlds.loadWorld(mockWorld, 'world1')).toBe('InvalidMember');
    });
  });

  describe('toList', () => {
    /**
     * Lingo: on toList me
     */
    test('should return worlds array', () => {
      worlds = new Worlds();
      worlds.worlds = ['world1', 'world2'];
      expect(worlds.toList()).toEqual(['world1', 'world2']);
    });
  });

  describe('fromList', () => {
    /**
     * Lingo: on fromList me, objectList
     */
    test('should set worlds from list', () => {
      worlds = new Worlds();
      worlds.fromList(['w1', 'w2', 'w3']);
      expect(worlds.worlds).toEqual(['w1', 'w2', 'w3']);
    });
  });

  describe('getActiveWorld', () => {
    test('should return active world', () => {
      worlds = new Worlds();
      worlds.activeWorld = 'currentWorld';
      expect(worlds.getActiveWorld()).toBe('currentWorld');
    });
  });

  describe('getLastWorld', () => {
    test('should return last world', () => {
      worlds = new Worlds();
      worlds.lastWorld = 'previousWorld';
      expect(worlds.getLastWorld()).toBe('previousWorld');
    });
  });
});
