/**
 * @fileoverview Tests for Inits - Game initialization utilities
 * Based on: MovieScript 6 - Inits.ls
 * 
 * Inits provides game initialization and lifecycle management:
 * - prepareMovie: Initialize all global systems
 * - startMovie: Start movie playback
 * - stopMovie: Clean up movie
 * - killall: Clean up all global systems
 */

const Inits = require('../Inits');

describe('Inits', () => {
  let inits;
  let mockFactories;

  beforeEach(() => {
    mockFactories = {
      createPathGlobals: jest.fn().mockReturnValue({ type: 'PathGlobals' }),
      createMulleGlobals: jest.fn().mockReturnValue({ 
        type: 'MulleGlobals',
        init: jest.fn(),
        users: { login: jest.fn() },
        kill: jest.fn().mockReturnValue(null)
      }),
      createCursorHandler: jest.fn().mockReturnValue({ 
        type: 'CursorHandler',
        kill: jest.fn().mockReturnValue(null)
      }),
      createSound: jest.fn().mockReturnValue({ 
        type: 'Sound',
        kill: jest.fn().mockReturnValue(null)
      }),
      createDir: jest.fn().mockReturnValue({ 
        type: 'Dir',
        init: jest.fn(),
        startMovie: jest.fn(),
        kill: jest.fn().mockReturnValue(null)
      })
    };
  });

  afterEach(() => {
    if (inits) {
      inits.killAll();
    }
  });

  describe('constructor', () => {
    test('should create Inits instance', () => {
      inits = new Inits(mockFactories);
      expect(inits).toBeDefined();
    });

    test('should initialize globals to null', () => {
      inits = new Inits(mockFactories);
      expect(inits.pathGlobals).toBeNull();
      expect(inits.mulleGlobals).toBeNull();
      expect(inits.cursor).toBeNull();
      expect(inits.sound).toBeNull();
      expect(inits.dir).toBeNull();
    });
  });

  describe('prepareMovie', () => {
    /**
     * Lingo: on prepareMovie
     *   Create all global systems if not exists
     */
    test('should create PathGlobals if not exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(mockFactories.createPathGlobals).toHaveBeenCalled();
      expect(inits.pathGlobals).toBeDefined();
    });

    test('should not recreate PathGlobals if exists', () => {
      inits = new Inits(mockFactories);
      inits.pathGlobals = { existing: true };
      inits.prepareMovie('01');
      expect(mockFactories.createPathGlobals).not.toHaveBeenCalled();
    });

    test('should create MulleGlobals if not exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(mockFactories.createMulleGlobals).toHaveBeenCalled();
      expect(inits.mulleGlobals).toBeDefined();
    });

    test('should init MulleGlobals after creation', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(inits.mulleGlobals.init).toHaveBeenCalled();
    });

    test('should login user for non-11 movies', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(inits.mulleGlobals.users.login).toHaveBeenCalledWith('Mulle');
    });

    test('should not login user for movie 11', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('11');
      expect(inits.mulleGlobals.users.login).not.toHaveBeenCalled();
    });

    test('should create CursorHandler if not exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(mockFactories.createCursorHandler).toHaveBeenCalled();
      expect(inits.cursor).toBeDefined();
    });

    test('should create Sound if not exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(mockFactories.createSound).toHaveBeenCalled();
      expect(inits.sound).toBeDefined();
    });

    test('should create Dir if not exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(mockFactories.createDir).toHaveBeenCalled();
      expect(inits.dir).toBeDefined();
    });

    test('should init Dir after creation', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      expect(inits.dir.init).toHaveBeenCalled();
    });
  });

  describe('startMovie', () => {
    /**
     * Lingo: on startMovie
     *   if objectp(gDir) then startMovie(gDir)
     */
    test('should call startMovie on Dir if exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      inits.startMovie();
      expect(inits.dir.startMovie).toHaveBeenCalled();
    });

    test('should not throw if Dir does not exist', () => {
      inits = new Inits(mockFactories);
      expect(() => inits.startMovie()).not.toThrow();
    });
  });

  describe('stopMovie', () => {
    /**
     * Lingo: on stopMovie
     *   if objectp(gDir) then kill(gDir)
     */
    test('should kill Dir if exists', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      inits.stopMovie();
      expect(inits.dir).toBeNull();
    });

    test('should not throw if Dir does not exist', () => {
      inits = new Inits(mockFactories);
      expect(() => inits.stopMovie()).not.toThrow();
    });
  });

  describe('killAll', () => {
    /**
     * Lingo: on killall
     *   Kill all global systems
     */
    test('should kill MulleGlobals', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      const mulleGlobals = inits.mulleGlobals;
      inits.killAll();
      expect(mulleGlobals.kill).toHaveBeenCalled();
      expect(inits.mulleGlobals).toBeNull();
    });

    test('should kill CursorHandler', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      const cursor = inits.cursor;
      inits.killAll();
      expect(cursor.kill).toHaveBeenCalled();
      expect(inits.cursor).toBeNull();
    });

    test('should kill Sound', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      const sound = inits.sound;
      inits.killAll();
      expect(sound.kill).toHaveBeenCalled();
      expect(inits.sound).toBeNull();
    });

    test('should not throw if systems do not exist', () => {
      inits = new Inits(mockFactories);
      expect(() => inits.killAll()).not.toThrow();
    });
  });

  describe('safePreload', () => {
    /**
     * Lingo: on safePreload argMemberName
     *   if the number of member argMemberName > 0 then preloadMember
     */
    test('should return true for valid member', () => {
      inits = new Inits(mockFactories);
      inits.memberExists = jest.fn().mockReturnValue(true);
      inits.preloadMember = jest.fn();
      
      const result = inits.safePreload('validMember');
      
      expect(result).toBe(true);
      expect(inits.preloadMember).toHaveBeenCalledWith('validMember');
    });

    test('should return false for invalid member', () => {
      inits = new Inits(mockFactories);
      inits.memberExists = jest.fn().mockReturnValue(false);
      inits.preloadMember = jest.fn();
      
      const result = inits.safePreload('invalidMember');
      
      expect(result).toBe(false);
      expect(inits.preloadMember).not.toHaveBeenCalled();
    });
  });

  describe('cuePassed', () => {
    /**
     * Lingo: on CuePassed theChannel, theNumber, theName
     *   sendAllSprites(#spritecuePassed, theChannel, theNumber, theName)
     */
    test('should emit cue event', () => {
      inits = new Inits(mockFactories);
      inits.sendAllSprites = jest.fn();
      
      inits.cuePassed('sound1', 1, 'cue1');
      
      expect(inits.sendAllSprites).toHaveBeenCalledWith('spritecuePassed', 1, 1, 'cue1');
    });

    test('should extract channel number from string', () => {
      inits = new Inits(mockFactories);
      inits.sendAllSprites = jest.fn();
      
      inits.cuePassed('sound3', 2, 'cue2');
      
      // Last char of 'sound3' is '3'
      expect(inits.sendAllSprites).toHaveBeenCalledWith('spritecuePassed', 3, 2, 'cue2');
    });
  });

  describe('getGlobals', () => {
    test('should return all globals', () => {
      inits = new Inits(mockFactories);
      inits.prepareMovie('01');
      
      const globals = inits.getGlobals();
      
      expect(globals.pathGlobals).toBeDefined();
      expect(globals.mulleGlobals).toBeDefined();
      expect(globals.cursor).toBeDefined();
      expect(globals.sound).toBeDefined();
      expect(globals.dir).toBeDefined();
    });
  });
});
