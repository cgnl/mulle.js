/**
 * @fileoverview Tests for GivePart - Give part behavior
 * Based on: BehaviorScript 33 - givePart.ls
 * 
 * GivePart handles displaying a part that is being given to the player,
 * showing its shelf view sprite in the designated sprite slot.
 */

const GivePart = require('../GivePart');

describe('GivePart', () => {
  let givePart;
  let mockDir;
  let mockGlobals;
  let mockSprite;

  beforeEach(() => {
    mockSprite = {
      member: null
    };

    mockDir = {
      givePart: 'NoPart',
      myDummyPart: 5,
      getSprite: jest.fn().mockReturnValue(mockSprite),
      goToFrame: jest.fn(),
      getCurrentFrame: jest.fn().mockReturnValue(10)
    };

    mockGlobals = {
      parts: {
        getPart: jest.fn().mockReturnValue({
          getShelfView: jest.fn().mockReturnValue('partShelfView')
        })
      }
    };
  });

  describe('constructor', () => {
    test('should store dir reference', () => {
      givePart = new GivePart(mockDir, mockGlobals);
      expect(givePart.dir).toBe(mockDir);
    });

    test('should store globals reference', () => {
      givePart = new GivePart(mockDir, mockGlobals);
      expect(givePart.globals).toBe(mockGlobals);
    });
  });

  describe('beginSprite', () => {
    /**
     * Lingo: on beginSprite
     */
    test('should not set member when givePart is NoPart', () => {
      mockDir.givePart = 'NoPart';
      givePart = new GivePart(mockDir, mockGlobals);
      
      givePart.beginSprite();
      
      expect(mockGlobals.parts.getPart).not.toHaveBeenCalled();
    });

    test('should get part from parts manager when givePart is set', () => {
      mockDir.givePart = 42;
      givePart = new GivePart(mockDir, mockGlobals);
      
      givePart.beginSprite();
      
      expect(mockGlobals.parts.getPart).toHaveBeenCalledWith(42);
    });

    test('should set sprite member to shelf view', () => {
      mockDir.givePart = 42;
      givePart = new GivePart(mockDir, mockGlobals);
      
      givePart.beginSprite();
      
      expect(mockSprite.member).toBe('partShelfView');
    });

    test('should use myDummyPart sprite slot', () => {
      mockDir.givePart = 42;
      mockDir.myDummyPart = 7;
      givePart = new GivePart(mockDir, mockGlobals);
      
      givePart.beginSprite();
      
      expect(mockDir.getSprite).toHaveBeenCalledWith(7);
    });
  });

  describe('exitFrame', () => {
    /**
     * Lingo: on exitFrame
     *   go(the frame)
     */
    test('should stay on current frame', () => {
      mockDir.getCurrentFrame.mockReturnValue(15);
      givePart = new GivePart(mockDir, mockGlobals);
      
      givePart.exitFrame();
      
      expect(mockDir.goToFrame).toHaveBeenCalledWith(15);
    });
  });

  describe('hasPartToGive', () => {
    test('should return false when givePart is NoPart', () => {
      mockDir.givePart = 'NoPart';
      givePart = new GivePart(mockDir, mockGlobals);
      
      expect(givePart.hasPartToGive()).toBe(false);
    });

    test('should return true when givePart is set', () => {
      mockDir.givePart = 42;
      givePart = new GivePart(mockDir, mockGlobals);
      
      expect(givePart.hasPartToGive()).toBe(true);
    });

    test('should return false when givePart is null', () => {
      mockDir.givePart = null;
      givePart = new GivePart(mockDir, mockGlobals);
      
      expect(givePart.hasPartToGive()).toBe(false);
    });

    test('should return false when givePart is 0', () => {
      mockDir.givePart = 0;
      givePart = new GivePart(mockDir, mockGlobals);
      
      expect(givePart.hasPartToGive()).toBe(false);
    });
  });

  describe('getGivePart', () => {
    test('should return current givePart value', () => {
      mockDir.givePart = 99;
      givePart = new GivePart(mockDir, mockGlobals);
      
      expect(givePart.getGivePart()).toBe(99);
    });
  });
});
