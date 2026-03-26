/**
 * @fileoverview Tests for MulleGlobals - Global game state container
 * Based on: ParentScript 5 - MulleGlobals.ls
 * 
 * MulleGlobals is the central container for all global game state,
 * including parts, users, handlers, and game-wide configuration.
 */

const MulleGlobals = require('../MulleGlobals');

describe('MulleGlobals', () => {
  let globals;

  afterEach(() => {
    if (globals) {
      globals.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should create parts manager', () => {
      globals = new MulleGlobals();
      expect(globals.parts).toBeDefined();
    });

    test('should create users manager', () => {
      globals = new MulleGlobals();
      expect(globals.users).toBeDefined();
    });

    test('should create user object', () => {
      globals = new MulleGlobals();
      expect(globals.user).toBeDefined();
    });

    test('should create externalParts manager', () => {
      globals = new MulleGlobals();
      expect(globals.externalParts).toBeDefined();
    });

    test('should create loopMaster', () => {
      globals = new MulleGlobals();
      expect(globals.loopMaster).toBeDefined();
    });

    test('should create mouseMaster', () => {
      globals = new MulleGlobals();
      expect(globals.mouseMaster).toBeDefined();
    });

    test('should create junkViewHandler', () => {
      globals = new MulleGlobals();
      expect(globals.junkViewHandler).toBeDefined();
    });

    test('should create boatViewHandler', () => {
      globals = new MulleGlobals();
      expect(globals.boatViewHandler).toBeDefined();
    });

    test('should create levelHandler', () => {
      globals = new MulleGlobals();
      expect(globals.levelHandler).toBeDefined();
    });

    test('should create worlds manager', () => {
      globals = new MulleGlobals();
      expect(globals.worlds).toBeDefined();
    });

    test('should create maps manager', () => {
      globals = new MulleGlobals();
      expect(globals.maps).toBeDefined();
    });

    test('should set enterShelf to Shelf1', () => {
      globals = new MulleGlobals();
      expect(globals.enterShelf).toBe('Shelf1');
    });

    test('should set hullBackInsideOffset to 6', () => {
      globals = new MulleGlobals();
      expect(globals.hullBackInsideOffset).toBe(6);
    });

    test('should set hullFrontInsideOffset to 45', () => {
      globals = new MulleGlobals();
      expect(globals.hullFrontInsideOffset).toBe(45);
    });

    test('should set HullBackOffset to 12', () => {
      globals = new MulleGlobals();
      expect(globals.HullBackOffset).toBe(12);
    });

    test('should set HullFrontOffset to 46', () => {
      globals = new MulleGlobals();
      expect(globals.HullFrontOffset).toBe(46);
    });

    test('should set rudderBackOffset to 1', () => {
      globals = new MulleGlobals();
      expect(globals.rudderBackOffset).toBe(1);
    });

    test('should set rudderFrontOffset to 13', () => {
      globals = new MulleGlobals();
      expect(globals.rudderFrontOffset).toBe(13);
    });

    test('should set gotNewHull to false', () => {
      globals = new MulleGlobals();
      expect(globals.gotNewHull).toBe(false);
    });

    test('should set gotNewParts to false', () => {
      globals = new MulleGlobals();
      expect(globals.gotNewParts).toBe(false);
    });

    test('should initialize firstTimeList', () => {
      globals = new MulleGlobals();
      expect(globals.firstTimeList).toBeDefined();
      expect(globals.firstTimeList.ShipYard).toBe(true);
      expect(globals.firstTimeList.SecondShipYard).toBe(true);
      expect(globals.firstTimeList.Yard).toBe(true);
      expect(globals.firstTimeList.Quay).toBe(true);
      expect(globals.firstTimeList.Shelf).toBe(true);
      expect(globals.firstTimeList.BluePrint).toBe(true);
    });

    test('should return this', () => {
      globals = new MulleGlobals();
      expect(globals).toBeInstanceOf(MulleGlobals);
    });
  });

  describe('init', () => {
    /**
     * Lingo: on init me
     */
    test('should create weather object', () => {
      globals = new MulleGlobals();
      globals.init();
      expect(globals.weather).toBeDefined();
    });

    test('should create radioHandler', () => {
      globals = new MulleGlobals();
      globals.init();
      expect(globals.radioHandler).toBeDefined();
    });

    test('should add mouseMaster to loopMaster', () => {
      globals = new MulleGlobals();
      globals.init();
      expect(globals.loopMaster.hasObject(globals.mouseMaster)).toBe(true);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should kill weather', () => {
      globals = new MulleGlobals();
      globals.init();
      globals.kill();
      expect(globals.weather).toBeNull();
    });

    test('should kill worlds', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.worlds).toBeNull();
    });

    test('should kill maps', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.maps).toBeNull();
    });

    test('should kill parts', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.parts).toBeNull();
    });

    test('should kill users', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.users).toBeNull();
    });

    test('should kill user', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.user).toBeNull();
    });

    test('should kill externalParts', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.externalParts).toBeNull();
    });

    test('should kill loopMaster', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.loopMaster).toBeNull();
    });

    test('should kill mouseMaster', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.mouseMaster).toBeNull();
    });

    test('should kill junkViewHandler', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.junkViewHandler).toBeNull();
    });

    test('should kill boatViewHandler', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.boatViewHandler).toBeNull();
    });

    test('should kill levelHandler', () => {
      globals = new MulleGlobals();
      globals.kill();
      expect(globals.levelHandler).toBeNull();
    });

    test('should return null', () => {
      globals = new MulleGlobals();
      const result = globals.kill();
      expect(result).toBeNull();
    });
  });

  describe('save', () => {
    /**
     * Lingo: on save me
     */
    test('should call users toList', () => {
      globals = new MulleGlobals();
      globals.users.toList = jest.fn().mockReturnValue([]);
      globals.save();
      expect(globals.users.toList).toHaveBeenCalled();
    });

    test('should call user toList when user exists', () => {
      globals = new MulleGlobals();
      globals.user.getUserId = jest.fn().mockReturnValue(1);
      globals.user.toList = jest.fn().mockReturnValue([]);
      globals.save();
      expect(globals.user.toList).toHaveBeenCalled();
    });
  });

  describe('getters and setters', () => {
    test('should get and set WhereFrom', () => {
      globals = new MulleGlobals();
      globals.setWhereFrom('TestLocation');
      expect(globals.getWhereFrom()).toBe('TestLocation');
    });

    test('should get and set world', () => {
      globals = new MulleGlobals();
      const mockWorld = { name: 'testWorld' };
      globals.setWorld(mockWorld);
      expect(globals.getWorld()).toBe(mockWorld);
    });

    test('should get and set enterShelf', () => {
      globals = new MulleGlobals();
      globals.setEnterShelf('Shelf3');
      expect(globals.getEnterShelf()).toBe('Shelf3');
    });

    test('should get and set gotNewHull', () => {
      globals = new MulleGlobals();
      globals.setGotNewHull(true);
      expect(globals.getGotNewHull()).toBe(true);
    });

    test('should get and set gotNewParts', () => {
      globals = new MulleGlobals();
      globals.setGotNewParts(true);
      expect(globals.getGotNewParts()).toBe(true);
    });

    test('should check and set firstTime status', () => {
      globals = new MulleGlobals();
      expect(globals.isFirstTime('Quay')).toBe(true);
      globals.setFirstTime('Quay', false);
      expect(globals.isFirstTime('Quay')).toBe(false);
    });
  });
});
