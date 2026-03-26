/**
 * @fileoverview Tests for LeaveDest - Leave destination behavior
 * Based on: BehaviorScript 26 - LeaveDest.ls
 * 
 * LeaveDest handles the transition when leaving a destination,
 * including stopping sounds and navigating to the world map.
 */

const LeaveDest = require('../LeaveDest');

describe('LeaveDest', () => {
  let leaveDest;
  let mockDir;
  let mockSound;

  beforeEach(() => {
    mockDir = {
      testing: false,
      goToFrame: jest.fn(),
      goToMovie: jest.fn(),
      getCurrentFrame: jest.fn().mockReturnValue(10)
    };

    mockSound = {
      puppetSound: jest.fn(),
      setVolume: jest.fn()
    };
  });

  describe('constructor', () => {
    test('should store dir reference', () => {
      leaveDest = new LeaveDest(mockDir, mockSound);
      expect(leaveDest.dir).toBe(mockDir);
    });

    test('should store sound reference', () => {
      leaveDest = new LeaveDest(mockDir, mockSound);
      expect(leaveDest.sound).toBe(mockSound);
    });
  });

  describe('exitFrame', () => {
    /**
     * Lingo: on exitFrame
     */
    describe('testing mode', () => {
      test('should stay on current frame when testing', () => {
        mockDir.testing = true;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockDir.goToFrame).toHaveBeenCalledWith(10);
      });

      test('should not stop sounds when testing', () => {
        mockDir.testing = true;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockSound.puppetSound).not.toHaveBeenCalled();
      });
    });

    describe('normal mode', () => {
      test('should stop puppetSound channel 1', () => {
        mockDir.testing = false;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockSound.puppetSound).toHaveBeenCalledWith(1, 0);
      });

      test('should stop puppetSound channel 2', () => {
        mockDir.testing = false;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockSound.puppetSound).toHaveBeenCalledWith(2, 0);
      });

      test('should stop puppetSound channel 3', () => {
        mockDir.testing = false;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockSound.puppetSound).toHaveBeenCalledWith(3, 0);
      });

      test('should set sound 1 volume to 255', () => {
        mockDir.testing = false;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockSound.setVolume).toHaveBeenCalledWith(1, 255);
      });

      test('should navigate to movie "05" frame 1', () => {
        mockDir.testing = false;
        leaveDest = new LeaveDest(mockDir, mockSound);
        
        leaveDest.exitFrame();
        
        expect(mockDir.goToMovie).toHaveBeenCalledWith(1, '05');
      });
    });
  });

  describe('isTesting', () => {
    test('should return testing state from dir', () => {
      mockDir.testing = true;
      leaveDest = new LeaveDest(mockDir, mockSound);
      
      expect(leaveDest.isTesting()).toBe(true);
    });

    test('should return false when not testing', () => {
      mockDir.testing = false;
      leaveDest = new LeaveDest(mockDir, mockSound);
      
      expect(leaveDest.isTesting()).toBe(false);
    });
  });
});
