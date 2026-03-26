/**
 * @fileoverview Tests for GameObject - Game world object
 * Based on: ParentScript 140 - Object.ls
 * 
 * GameObject represents objects in the game world with properties
 * for detection radii, sounds, animations, and conditions.
 */

const GameObject = require('../GameObject');

describe('GameObject', () => {
  let gameObject;
  let mockGlobals;
  let mockDir;

  beforeEach(() => {
    mockGlobals = {
      user: {
        isInInventory: jest.fn().mockReturnValue(false),
        isMissionCompleted: jest.fn().mockReturnValue(false),
        isMissionGiven: jest.fn().mockReturnValue(false),
        boat: {
          getMedal: jest.fn().mockReturnValue(false)
        }
      },
      externalParts: {
        getCurrentlyAvailable: jest.fn().mockReturnValue([]),
        getRandomPart: jest.fn().mockReturnValue('NoPart')
      }
    };

    mockDir = {
      mulleTalkObject: {
        deleteReference: jest.fn()
      },
      boat: {
        quickProps: {}
      }
    };
  });

  afterEach(() => {
    if (gameObject) {
      gameObject.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize ObjectId to 0', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.ObjectId).toBe(0);
    });

    test('should initialize type to none', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.type).toBe('none');
    });

    test('should initialize InnerRadius to 0', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.InnerRadius).toBe(0);
    });

    test('should initialize OuterRadius to 0', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.OuterRadius).toBe(0);
    });

    test('should initialize customObject to empty', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.customObject).toBe('');
    });

    test('should initialize DirResource to empty', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.DirResource).toBe('');
    });

    test('should initialize sounds as empty array', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.sounds).toEqual([]);
    });

    test('should initialize frameList as empty array', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.frameList).toEqual([]);
    });

    test('should initialize setWhenDone as empty object', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.setWhenDone).toEqual({});
    });

    test('should initialize checkFor as empty object', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.checkFor).toEqual({});
    });

    test('should initialize ifFound to none', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.ifFound).toBe('none');
    });

    test('should initialize spriteInfo as empty object', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.spriteInfo).toEqual({});
    });

    test('should initialize ancestor to null', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.ancestor).toBeNull();
    });

    test('should initialize active to true', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.active).toBe(true);
    });

    test('should initialize SPOver to 0', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.SPOver).toBe(0);
    });

    test('should initialize SPUnder to 0', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.SPUnder).toBe(0);
    });

    test('should initialize myLoc to origin', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.myLoc).toEqual({ x: 0, y: 0 });
    });

    test('should initialize optionalData as empty object', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.optionalData).toEqual({});
    });

    test('should initialize canEnter to true', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      expect(gameObject.canEnter).toBe(true);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should delete reference from mulleTalk', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.kill();
      expect(mockDir.mulleTalkObject.deleteReference).toHaveBeenCalledWith(gameObject);
    });

    test('should kill ancestor if present', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      const mockAncestor = { kill: jest.fn().mockReturnValue(null) };
      gameObject.ancestor = mockAncestor;
      
      gameObject.kill();
      
      expect(mockAncestor.kill).toHaveBeenCalled();
      expect(gameObject.ancestor).toBeNull();
    });

    test('should return null', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      const result = gameObject.kill();
      expect(result).toBeNull();
    });
  });

  describe('init', () => {
    /**
     * Lingo: on init me, theSprites, theLoc, theOptional, theCarLoc
     */
    test('should set sprite slots', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.init([10, 20], { x: 100, y: 200 }, {}, { x: 0, y: 0 });
      
      expect(gameObject.SPOver).toBe(10);
      expect(gameObject.SPUnder).toBe(20);
    });

    test('should set location', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.init([10, 20], { x: 100, y: 200 }, {}, { x: 0, y: 0 });
      
      expect(gameObject.myLoc).toEqual({ x: 100, y: 200 });
    });

    test('should use optional InnerRadius', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.init([10, 20], { x: 100, y: 200 }, { InnerRadius: 30 }, { x: 0, y: 0 });
      
      expect(gameObject.InnerRadius).toBe(30);
    });

    test('should use optional OuterRadius', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.init([10, 20], { x: 100, y: 200 }, { OuterRadius: 60 }, { x: 0, y: 0 });
      
      expect(gameObject.OuterRadius).toBe(60);
    });

    test('should return 1 on success', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      const result = gameObject.init([10, 20], { x: 100, y: 200 }, {}, { x: 0, y: 0 });
      
      expect(result).toBe(1);
    });
  });

  describe('getId', () => {
    /**
     * Lingo: on getId me
     */
    test('should return ObjectId', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.ObjectId = 42;
      expect(gameObject.getId()).toBe(42);
    });
  });

  describe('getCacheProp', () => {
    /**
     * Lingo: on getCacheProp me
     */
    test('should return Cache from setWhenDone', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.setWhenDone = { Cache: 'cacheValue' };
      expect(gameObject.getCacheProp()).toBe('cacheValue');
    });
  });

  describe('getOptionalData', () => {
    /**
     * Lingo: on getOptionalData me, argProp
     */
    test('should return all optionalData when no prop', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.optionalData = { a: 1, b: 2 };
      expect(gameObject.getOptionalData()).toEqual({ a: 1, b: 2 });
    });

    test('should return specific prop', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.optionalData = { a: 1, b: 2 };
      expect(gameObject.getOptionalData('b')).toBe(2);
    });
  });

  describe('getGiftParts', () => {
    /**
     * Lingo: on getGiftParts me
     */
    test('should return parts from setWhenDone', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.setWhenDone = { parts: [1, 2, 3] };
      expect(gameObject.getGiftParts()).toEqual([1, 2, 3]);
    });
  });

  describe('getSetWhenDone', () => {
    /**
     * Lingo: on getSetWhenDone me, theWhat
     */
    test('should return copy of setWhenDone when no arg', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.setWhenDone = { a: 1 };
      const result = gameObject.getSetWhenDone();
      expect(result).toEqual({ a: 1 });
    });

    test('should return specific property', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.setWhenDone = { a: 1, b: 2 };
      expect(gameObject.getSetWhenDone('b')).toBe(2);
    });
  });

  describe('getCheckFor', () => {
    /**
     * Lingo: on getCheckFor me, theWhat
     */
    test('should return copy of checkFor when no arg', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.checkFor = { x: 1 };
      const result = gameObject.getCheckFor();
      expect(result).toEqual({ x: 1 });
    });

    test('should return specific property', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.checkFor = { x: 1, y: 2 };
      expect(gameObject.getCheckFor('y')).toBe(2);
    });
  });

  describe('getType', () => {
    test('should return type', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.type = 'destination';
      expect(gameObject.getType()).toBe('destination');
    });
  });

  describe('getLoc', () => {
    test('should return myLoc', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.myLoc = { x: 50, y: 60 };
      expect(gameObject.getLoc()).toEqual({ x: 50, y: 60 });
    });
  });

  describe('getSpritesInfo', () => {
    test('should return spriteInfo', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.spriteInfo = { Under: 1 };
      expect(gameObject.getSpritesInfo()).toEqual({ Under: 1 });
    });
  });

  describe('getInnerRadius', () => {
    test('should return InnerRadius', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.InnerRadius = 25;
      expect(gameObject.getInnerRadius()).toBe(25);
    });
  });

  describe('getOuterRadius', () => {
    test('should return OuterRadius', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.OuterRadius = 50;
      expect(gameObject.getOuterRadius()).toBe(50);
    });
  });

  describe('getDirResource', () => {
    test('should return DirResource', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.DirResource = 'resource1';
      expect(gameObject.getDirResource()).toBe('resource1');
    });
  });

  describe('getFrameList', () => {
    test('should return frameList', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.frameList = ['f1', 'f2'];
      expect(gameObject.getFrameList()).toEqual(['f1', 'f2']);
    });
  });

  describe('toList', () => {
    /**
     * Lingo: on toList me
     */
    test('should return object properties as list', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.ObjectId = 1;
      gameObject.type = 'test';
      
      const result = gameObject.toList();
      
      expect(result).toContain(1);
      expect(result).toContain('test');
    });
  });

  describe('fromList', () => {
    /**
     * Lingo: on fromList me, theid
     */
    test('should load from database member', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject._loadObjectDB = jest.fn().mockReturnValue({
        ObjectId: 5,
        type: 'destination',
        InnerRadius: 20,
        OuterRadius: 50,
        customObject: '',
        DirResource: 'res1',
        sounds: ['s1'],
        frameList: ['f1'],
        setWhenDone: {},
        checkFor: {},
        ifFound: 'none',
        spriteInfo: { Under: 1 }
      });
      
      const result = gameObject.fromList(5);
      
      expect(result).toBe(1);
      expect(gameObject.ObjectId).toBe(5);
      expect(gameObject.type).toBe('destination');
    });

    test('should return 0 when member not found', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject._loadObjectDB = jest.fn().mockReturnValue(null);
      
      const result = gameObject.fromList(999);
      
      expect(result).toBe(0);
    });
  });

  describe('getOnePart', () => {
    /**
     * Lingo: on getOnePart me, where
     */
    test('should return available part from setWhenDone', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.setWhenDone = { parts: [10, 20, 30] };
      mockGlobals.externalParts.getCurrentlyAvailable.mockReturnValue([20, 40]);
      
      const result = gameObject.getOnePart('setWhenDone');
      
      expect(result).toBe(20);
    });

    test('should return available part from checkFor', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.checkFor = { parts: [5, 15] };
      mockGlobals.externalParts.getCurrentlyAvailable.mockReturnValue([15]);
      
      const result = gameObject.getOnePart('checkFor');
      
      expect(result).toBe(15);
    });

    test('should return 0 when no parts available', () => {
      gameObject = new GameObject(mockGlobals, mockDir);
      gameObject.setWhenDone = { parts: [10] };
      mockGlobals.externalParts.getCurrentlyAvailable.mockReturnValue([]);
      
      const result = gameObject.getOnePart('setWhenDone');
      
      expect(result).toBe(0);
    });
  });
});
