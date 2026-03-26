/**
 * @fileoverview Tests for SoundHandler - Sound queue and playback handler
 * Based on: ParentScript 36 - SoundHandler.ls
 * 
 * SoundHandler manages sound queues for talk and effects,
 * with priority-based playback control.
 */

const SoundHandler = require('../SoundHandler');

describe('SoundHandler', () => {
  let soundHandler;
  let mockGlobals;
  let mockSound;

  beforeEach(() => {
    mockGlobals = {
      loopMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      }
    };

    mockSound = {
      stop: jest.fn().mockReturnValue(0),
      stopAll: jest.fn()
    };
  });

  afterEach(() => {
    if (soundHandler) {
      soundHandler.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize talkList as empty array', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(soundHandler.talkList).toEqual([]);
    });

    test('should initialize fxList as empty array', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(soundHandler.fxList).toEqual([]);
    });

    test('should initialize talkID to 0', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(soundHandler.talkID).toBe(0);
    });

    test('should initialize fxID to 0', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(soundHandler.fxID).toBe(0);
    });

    test('should add to loopMaster', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(mockGlobals.loopMaster.addObject).toHaveBeenCalledWith(soundHandler);
    });

    test('should return this', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(soundHandler).toBeInstanceOf(SoundHandler);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should stop all sounds', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.kill();
      expect(mockSound.stopAll).toHaveBeenCalled();
    });

    test('should clear talkList', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.kill();
      expect(soundHandler.talkList).toBeNull();
    });

    test('should clear fxList', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.kill();
      expect(soundHandler.fxList).toBeNull();
    });

    test('should reset talkID', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.talkID = 5;
      soundHandler.kill();
      expect(soundHandler.talkID).toBe(0);
    });

    test('should reset fxID', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.fxID = 5;
      soundHandler.kill();
      expect(soundHandler.fxID).toBe(0);
    });

    test('should remove from loopMaster', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.kill();
      expect(mockGlobals.loopMaster.deleteObject).toHaveBeenCalledWith(soundHandler);
    });

    test('should return null', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      const result = soundHandler.kill();
      expect(result).toBeNull();
    });
  });

  describe('remove', () => {
    /**
     * Lingo: on Remove me, argType
     */
    test('should remove first item from talkList', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.talkList = ['sound1', 'sound2', 'sound3'];
      
      soundHandler.remove('Talk');
      
      expect(soundHandler.talkList).toEqual(['sound2', 'sound3']);
    });

    test('should not error when removing from empty talkList', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.talkList = [];
      
      expect(() => soundHandler.remove('Talk')).not.toThrow();
    });

    test('should remove first item from fxList', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.fxList = ['fx1', 'fx2'];
      
      soundHandler.remove('FX');
      
      expect(soundHandler.fxList).toEqual(['fx2']);
    });

    test('should not error when removing from empty fxList', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.fxList = [];
      
      expect(() => soundHandler.remove('FX')).not.toThrow();
    });
  });

  describe('play - Talk type', () => {
    /**
     * Lingo: on play me, argType, argPrio, argMemberList
     */
    describe('super priority', () => {
      test('should stop current talk', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkID = 5;
        
        soundHandler.play('Talk', 'super', ['sound.wav']);
        
        expect(mockSound.stop).toHaveBeenCalledWith(5);
      });

      test('should stop current fx', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.fxID = 3;
        
        soundHandler.play('Talk', 'super', ['sound.wav']);
        
        expect(mockSound.stop).toHaveBeenCalledWith(3);
      });

      test('should clear talk list and add at beginning', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkList = ['existing'];
        
        soundHandler.play('Talk', 'super', ['new.wav']);
        
        expect(soundHandler.talkList[0]).toEqual(['new.wav']);
      });
    });

    describe('High priority', () => {
      test('should stop current talk', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkID = 5;
        
        soundHandler.play('Talk', 'High', ['sound.wav']);
        
        expect(mockSound.stop).toHaveBeenCalledWith(5);
      });

      test('should not stop fx', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.fxID = 3;
        mockSound.stop.mockClear();
        
        soundHandler.play('Talk', 'High', ['sound.wav']);
        
        // Only called once (for talkID), not for fxID
        expect(mockSound.stop).toHaveBeenCalledTimes(1);
      });

      test('should add at beginning of talk list', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkList = [['existing']];
        
        soundHandler.play('Talk', 'High', ['new.wav']);
        
        expect(soundHandler.talkList[0]).toEqual(['new.wav']);
      });
    });

    describe('Medium priority', () => {
      test('should add to end of talk list', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkList = [['existing']];
        
        soundHandler.play('Talk', 'Medium', ['new.wav']);
        
        expect(soundHandler.talkList).toEqual([['existing'], ['new.wav']]);
      });
    });

    describe('Low priority', () => {
      test('should add to talk list only when empty', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkList = [];
        
        soundHandler.play('Talk', 'Low', ['new.wav']);
        
        expect(soundHandler.talkList).toEqual([['new.wav']]);
      });

      test('should not add when talk list has items', () => {
        soundHandler = new SoundHandler(mockGlobals, mockSound);
        soundHandler.talkList = [['existing']];
        
        soundHandler.play('Talk', 'Low', ['new.wav']);
        
        expect(soundHandler.talkList).toEqual([['existing']]);
      });
    });
  });

  describe('loop', () => {
    /**
     * Lingo: on loop me
     */
    test('should exist as method', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(typeof soundHandler.loop).toBe('function');
    });

    test('should not throw when called', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      expect(() => soundHandler.loop()).not.toThrow();
    });
  });

  describe('getTalkList', () => {
    test('should return talk list', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.talkList = [['sound1'], ['sound2']];
      expect(soundHandler.getTalkList()).toEqual([['sound1'], ['sound2']]);
    });
  });

  describe('getFxList', () => {
    test('should return fx list', () => {
      soundHandler = new SoundHandler(mockGlobals, mockSound);
      soundHandler.fxList = [['fx1']];
      expect(soundHandler.getFxList()).toEqual([['fx1']]);
    });
  });
});
