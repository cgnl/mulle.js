/**
 * @fileoverview Tests for BoatHandler - Boat management handler
 * Based on: ParentScript 28 - BoatHandler.ls
 * 
 * BoatHandler manages the boat building interface, including drawing parts,
 * picking up/dropping parts, and handling the drag and drop logic.
 */

const BoatHandler = require('../BoatHandler');

describe('BoatHandler', () => {
  let boatHandler;
  let mockGlobals;
  let mockDir;
  let mockSound;

  beforeEach(() => {
    mockDir = {
      spriteList: {
        Water: 50,
        DragPart: 10
      },
      _spriteMembers: {},
      makeMulleTalk: jest.fn(),
      junkHandler: {
        drawParts: jest.fn(),
        dropped: jest.fn()
      }
    };

    mockGlobals = {
      parts: {
        getPart: jest.fn().mockReturnValue({
          getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
          getRequiredPoints: jest.fn().mockReturnValue(['S1']),
          getJunkView: jest.fn().mockReturnValue('junkView'),
          getUseView: jest.fn().mockReturnValue('useView'),
          getUseView2: jest.fn().mockReturnValue(''),
          getSndAttachOnBoat: jest.fn().mockReturnValue(''),
          getMaster: jest.fn().mockReturnValue(null),
          isMaster: jest.fn().mockReturnValue(false),
          isMorphPart: jest.fn().mockReturnValue(false),
          getMorphList: jest.fn().mockReturnValue([]),
          isNormalpart: jest.fn().mockReturnValue(true),
          getMorphToSnap: jest.fn().mockReturnValue('morphPart'),
          getProperty: jest.fn().mockReturnValue(10)
        })
      },
      user: {
        getBoat: jest.fn().mockReturnValue({
          getParts: jest.fn().mockReturnValue([]),
          addPart: jest.fn(),
          deletePart: jest.fn(),
          clearBoat: jest.fn(),
          rebuild: jest.fn(),
          updateProperties: jest.fn(),
          getHull: jest.fn().mockReturnValue('hull1'),
          getSnapInfo: jest.fn((snap, key) => {
            if (key === 'layers') return [1, 2]
            if (key === 'offset') return { x: 0, y: 0 }
            return null
          }),
          areTheseFree: jest.fn().mockReturnValue(true),
          getProperty: jest.fn().mockReturnValue(100),
          getCurrentLoadCapacity: jest.fn().mockReturnValue(50)
        }),
        addJunkPart: jest.fn()
      },
      boatViewHandler: {
        getDrawOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        getCurrentHull: jest.fn().mockReturnValue('hull1')
      },
      mouseMaster: {
        getToWhere: jest.fn().mockReturnValue('Quay')
      }
    };

    mockSound = {
      play: jest.fn()
    };
  });

  afterEach(() => {
    if (boatHandler) {
      boatHandler.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     */
    test('should initialize boatObjects as empty array', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      expect(boatHandler.boatObjects).toEqual([]);
    });

    test('should initialize dragObject to 0', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      expect(boatHandler.dragObject).toBe(0);
    });

    test('should return this', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      expect(boatHandler).toBeInstanceOf(BoatHandler);
    });
  });

  describe('cleanUp', () => {
    /**
     * Lingo: on cleanUp me
     */
    test('should kill all boat objects', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const mockObj1 = { kill: jest.fn() };
      const mockObj2 = { kill: jest.fn() };
      boatHandler.boatObjects = [mockObj1, mockObj2];
      
      boatHandler.cleanUp();
      
      expect(mockObj1.kill).toHaveBeenCalled();
      expect(mockObj2.kill).toHaveBeenCalled();
    });

    test('should clear boatObjects array', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.boatObjects = [{ kill: jest.fn() }];
      
      boatHandler.cleanUp();
      
      expect(boatHandler.boatObjects).toEqual([]);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     */
    test('should call cleanUp', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const cleanUpSpy = jest.spyOn(boatHandler, 'cleanUp');
      
      boatHandler.kill();
      
      expect(cleanUpSpy).toHaveBeenCalled();
    });

    test('should return 0', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const result = boatHandler.kill();
      expect(result).toBe(0);
    });
  });

  describe('drawParts', () => {
    /**
     * Lingo: on drawParts me
     */
    test('should call cleanUp first', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const cleanUpSpy = jest.spyOn(boatHandler, 'cleanUp');
      
      boatHandler.drawParts();
      
      expect(cleanUpSpy).toHaveBeenCalled();
    });

    test('should restore Water sprite when currently Dummy (.ls lines 24-26)', () => {
      mockDir._spriteMembers[50] = 'Dummy';
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);

      boatHandler.drawParts();

      expect(mockDir._spriteMembers[50]).toBe('04b003v0');
    });

    test('should update boat properties', () => {
      const boat = mockGlobals.user.getBoat();
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      
      boatHandler.drawParts();
      
      expect(boat.updateProperties).toHaveBeenCalled();
    });

    test('should get parts from boat', () => {
      const boat = mockGlobals.user.getBoat();
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      
      boatHandler.drawParts();
      
      expect(boat.getParts).toHaveBeenCalled();
    });

    test('should create BoatPart objects for each part', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue(['part1', 'part2']);
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler._createBoatPart = jest.fn().mockReturnValue({ id: 'test' });
      
      boatHandler.drawParts();
      
      expect(boatHandler._createBoatPart).toHaveBeenCalledTimes(2);
    });

    test('should add created BoatParts to boatObjects', () => {
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue(['part1']);
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const mockBoatPart = { id: 'test' };
      boatHandler._createBoatPart = jest.fn().mockReturnValue(mockBoatPart);
      
      boatHandler.drawParts();
      
      expect(boatHandler.boatObjects).toContain(mockBoatPart);
    });

    test('should use draw offset from boatViewHandler', () => {
      mockGlobals.boatViewHandler.getDrawOffset.mockReturnValue({ x: 10, y: 20 });
      const boat = mockGlobals.user.getBoat();
      boat.getParts.mockReturnValue(['part1']);
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler._createBoatPart = jest.fn().mockReturnValue({ id: 'test' });
      
      boatHandler.drawParts();
      
      expect(mockGlobals.boatViewHandler.getDrawOffset).toHaveBeenCalledWith('Quay');
    });
  });

  describe('pickedUp', () => {
    /**
     * Lingo: on pickedUp me, argPartID
     */
    test('should clear boat before deleting part', () => {
      const boat = mockGlobals.user.getBoat();
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      
      boatHandler.pickedUp('part1');
      
      expect(boat.clearBoat).toHaveBeenCalled();
    });

    test('should delete part from boat', () => {
      const boat = mockGlobals.user.getBoat();
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      
      boatHandler.pickedUp('part1');
      
      expect(boat.deletePart).toHaveBeenCalledWith('part1');
    });

    test('should rebuild boat after deleting', () => {
      const boat = mockGlobals.user.getBoat();
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      
      boatHandler.pickedUp('part1');
      
      expect(boat.rebuild).toHaveBeenCalled();
    });

    test('should play attach sound if available', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getSndAttachOnBoat.mockReturnValue('attachSound');
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.pickedUp('part1');
      
      expect(mockSound.play).toHaveBeenCalledWith('attachSound', 'OPEFFECT');
    });

    test('should not play sound if no attach sound', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getSndAttachOnBoat.mockReturnValue('');
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.pickedUp('part1');
      
      expect(mockSound.play).not.toHaveBeenCalled();
    });

    test('should use master part ID if part has master', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getMaster.mockReturnValue('masterPart');
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler._createDragScript = jest.fn();
      boatHandler.pickedUp('childPart');
      
      expect(boatHandler._createDragScript).toHaveBeenCalledWith(
        expect.anything(),
        'masterPart',
        expect.anything(),
        'Quay'
      );
    });

    test('should assign dragObject from DragScript factory return', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const fakeDrag = { kill: jest.fn().mockReturnValue(0) };
      boatHandler._createDragScript = jest.fn().mockReturnValue(fakeDrag);

      boatHandler.pickedUp('part1');

      expect(boatHandler.dragObject).toBe(fakeDrag);
    });

    test('should redraw parts after pickup', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const drawPartsSpy = jest.spyOn(boatHandler, 'drawParts');
      
      boatHandler.pickedUp('part1');
      
      expect(drawPartsSpy).toHaveBeenCalled();
    });
  });

  describe('dropped', () => {
    /**
     * Lingo: on dropped me, argPartID, argLoc
     */
    test('should kill existing drag object and set to 0 (.ls lines 59-61)', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const mockDrag = { kill: jest.fn().mockReturnValue(0) };
      boatHandler.dragObject = mockDrag;
      
      boatHandler.dropped('part1', { x: 100, y: 100 });
      
      expect(mockDrag.kill).toHaveBeenCalled();
      expect(boatHandler.dragObject).toBe(0);
    });

    test('should delegate to junkHandler when not dropping on boat', () => {
      mockGlobals.mouseMaster.getToWhere.mockReturnValue('Quay');
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.dropped('part1', { x: 100, y: 100 });
      
      expect(mockDir.junkHandler.dropped).toHaveBeenCalledWith('part1', { x: 100, y: 100 });
    });

    test('should add part to boat when dropping on boat snap', () => {
      mockGlobals.mouseMaster.getToWhere.mockReturnValue('BoatS1');
      const boat = mockGlobals.user.getBoat();
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.dropped('part1', { x: 100, y: 100 });
      
      expect(boat.addPart).toHaveBeenCalledWith('part1');
    });

    test('should redraw parts after adding to boat', () => {
      mockGlobals.mouseMaster.getToWhere.mockReturnValue('BoatS1');
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const drawPartsSpy = jest.spyOn(boatHandler, 'drawParts');
      
      boatHandler.dropped('part1', { x: 100, y: 100 });
      
      expect(drawPartsSpy).toHaveBeenCalled();
    });

    test('should show load warning when near capacity', () => {
      mockGlobals.mouseMaster.getToWhere.mockReturnValue('BoatS1');
      const boat = mockGlobals.user.getBoat();
      // LoadCapacity = 100, loadLimit = 10
      // futureLoad = getCurrentLoadCapacity - weight = 15 - 5 = 10
      // 10 <= 10, so warning triggers
      boat.getProperty.mockImplementation((prop) => {
        if (prop === 'LoadCapacity') return 100;
        if (prop === 'Stability') return 100;
        return 50;
      });
      boat.getCurrentLoadCapacity.mockReturnValue(15);
      
      // Part weight = 5, so futureLoad = 15 - 5 = 10 which equals loadLimit
      const partObj = mockGlobals.parts.getPart();
      partObj.getProperty.mockReturnValue(5);
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.dropped('part1', { x: 100, y: 100 });
      
      expect(mockDir.makeMulleTalk).toHaveBeenCalledWith('04d048v0');
    });

    test('should add to junk when drop causes error', () => {
      mockGlobals.mouseMaster.getToWhere.mockReturnValue('BoatS1');
      const partObj = mockGlobals.parts.getPart();
      partObj.isNormalpart.mockReturnValue(false);
      partObj.isMaster.mockReturnValue(false);
      partObj.getMorphToSnap.mockReturnValue('error');
      
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      boatHandler.dropped('part1', { x: 100, y: 100 });
      
      expect(mockGlobals.user.addJunkPart).toHaveBeenCalled();
    });

    test('should trigger Sink transition when overload/instability occurs (.ls line 82)', () => {
      mockGlobals.mouseMaster.getToWhere.mockReturnValue('BoatS1');
      const boat = mockGlobals.user.getBoat();
      boat.getCurrentLoadCapacity.mockReturnValue(0);
      const partObj = mockGlobals.parts.getPart();
      partObj.getProperty.mockImplementation((prop) => {
        if (prop === 'weight') return 100;
        if (prop === 'Stability') return 0;
        return 0;
      });

      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const goSpy = jest.spyOn(boatHandler, '_go');

      boatHandler.dropped('part1', { x: 100, y: 100 });

      expect(goSpy).toHaveBeenCalledWith('Sink');
    });
  });

  describe('getBoatObjects', () => {
    test('should return boat objects array', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const mockObjs = [{ id: 1 }, { id: 2 }];
      boatHandler.boatObjects = mockObjs;
      
      expect(boatHandler.getBoatObjects()).toBe(mockObjs);
    });
  });

  describe('getDragObject', () => {
    test('should return current drag object', () => {
      boatHandler = new BoatHandler(mockGlobals, mockDir, mockSound);
      const mockDrag = { id: 'drag' };
      boatHandler.dragObject = mockDrag;
      
      expect(boatHandler.getDragObject()).toBe(mockDrag);
    });
  });
});
