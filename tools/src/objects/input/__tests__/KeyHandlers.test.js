/**
 * @fileoverview Tests for KeyHandlers - Keyboard input handling
 * Based on: MovieScript 135 - KeyHandlers.ls
 * 
 * KeyHandlers manages keyboard input including system keys like
 * quit, help, and special commands.
 */

const KeyHandlers = require('../KeyHandlers');

describe('KeyHandlers', () => {
  let keyHandlers;
  let mockGlobals;
  let mockSystem;

  beforeEach(() => {
    mockGlobals = {
      save: jest.fn()
    };

    mockSystem = {
      CDPath: '/cd/',
      helpFile: 'help.hlp',
      moviePath: '/game/'
    };
  });

  afterEach(() => {
    if (keyHandlers) {
      keyHandlers = null;
    }
  });

  describe('constructor', () => {
    test('should store globals reference', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      expect(keyHandlers.globals).toBe(mockGlobals);
    });

    test('should store system reference', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      expect(keyHandlers.system).toBe(mockSystem);
    });

    test('should initialize machineType (256 = Windows)', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      expect(keyHandlers.machineType).toBeDefined();
    });
  });

  describe('keyDown', () => {
    /**
     * Lingo: on keyDown
     *   systemKeys()
     */
    test('should call systemKeys', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      const spy = jest.spyOn(keyHandlers, 'systemKeys');
      
      keyHandlers.keyDown({ keyCode: 65 });
      
      expect(spy).toHaveBeenCalled();
    });
  });

  describe('systemKeys', () => {
    /**
     * Lingo: on systemKeys
     */
    describe('F1 key (keyCode 122)', () => {
      test('should get help file path from system', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        
        const result = keyHandlers.systemKeys({ keyCode: 122 });
        
        expect(result.action).toBe('help');
        expect(result.helpFile).toBe('/cd/help.hlp');
      });

      test('should fallback to moviePath when no system', () => {
        keyHandlers = new KeyHandlers(mockGlobals, null);
        keyHandlers.moviePath = '/game/';
        
        const result = keyHandlers.systemKeys({ keyCode: 122 });
        
        expect(result.helpFile).toBe('/game/Mullebat.hlp');
      });
    });

    describe('Windows quit (Option+Escape, keyCode 53)', () => {
      test('should save and quit on Windows', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 256; // Windows
        
        const result = keyHandlers.systemKeys({ 
          keyCode: 53, 
          optionDown: true 
        });
        
        expect(mockGlobals.save).toHaveBeenCalled();
        expect(result.action).toBe('quit');
      });

      test('should not quit without option key', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 256;
        
        const result = keyHandlers.systemKeys({ 
          keyCode: 53, 
          optionDown: false 
        });
        
        expect(result.action).not.toBe('quit');
      });
    });

    describe('Mac quit (Cmd+Q)', () => {
      test('should save and quit on Mac', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 0; // Mac
        
        const result = keyHandlers.systemKeys({ 
          key: 'q', 
          commandDown: true 
        });
        
        expect(mockGlobals.save).toHaveBeenCalled();
        expect(result.action).toBe('quit');
      });

      test('should not quit without command key', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 0;
        
        const result = keyHandlers.systemKeys({ 
          key: 'q', 
          commandDown: false 
        });
        
        expect(result.action).not.toBe('quit');
      });
    });

    describe('Help key (keyCode 114) on Mac', () => {
      test('should get help file path', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 0; // Mac
        
        const result = keyHandlers.systemKeys({ keyCode: 114 });
        
        expect(result.action).toBe('help');
      });
    });

    describe('Ctrl+M (mute toggle)', () => {
      test('should handle Ctrl+M on Windows', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 256;
        
        const result = keyHandlers.systemKeys({ 
          key: 'm', 
          controlDown: true 
        });
        
        expect(result.action).toBe('mute');
      });

      test('should handle Ctrl+M on Mac', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        keyHandlers.machineType = 0;
        
        const result = keyHandlers.systemKeys({ 
          key: 'm', 
          controlDown: true 
        });
        
        expect(result.action).toBe('mute');
      });
    });

    describe('unknown key', () => {
      test('should return no action for unknown key', () => {
        keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
        
        const result = keyHandlers.systemKeys({ keyCode: 999 });
        
        expect(result.action).toBe('none');
      });
    });
  });

  describe('getHelpFilePath', () => {
    test('should return system help path when available', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      
      expect(keyHandlers.getHelpFilePath()).toBe('/cd/help.hlp');
    });

    test('should return default path when no system', () => {
      keyHandlers = new KeyHandlers(mockGlobals, null);
      keyHandlers.moviePath = '/default/';
      
      expect(keyHandlers.getHelpFilePath()).toBe('/default/Mullebat.hlp');
    });
  });

  describe('isWindows', () => {
    test('should return true when machineType is 256', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      keyHandlers.machineType = 256;
      
      expect(keyHandlers.isWindows()).toBe(true);
    });

    test('should return false when machineType is not 256', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      keyHandlers.machineType = 0;
      
      expect(keyHandlers.isWindows()).toBe(false);
    });
  });

  describe('isMac', () => {
    test('should return true when machineType is not 256', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      keyHandlers.machineType = 0;
      
      expect(keyHandlers.isMac()).toBe(true);
    });

    test('should return false when machineType is 256', () => {
      keyHandlers = new KeyHandlers(mockGlobals, mockSystem);
      keyHandlers.machineType = 256;
      
      expect(keyHandlers.isMac()).toBe(false);
    });
  });
});
