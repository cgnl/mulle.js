/**
 * @fileoverview Tests for DragScript - Drag and drop handler
 * Based on: ParentScript 24 - DragScript.ls
 * 
 * DragScript manages dragging parts around the screen, snapping to
 * valid boat attachment points, and handling drop events.
 */

const DragScript = require('../DragScript');

describe('DragScript', () => {
  let dragScript;
  let mockReportObject;
  let mockGlobals;
  let mockDir;
  let mockSound;

  beforeEach(() => {
    mockReportObject = {
      dropped: jest.fn()
    };

    mockDir = {
      spriteList: {
        DragPart: 10,
        BoatStart: 20
      },
      _spriteMembers: {},
      makeMulleTalk: jest.fn()
    };

    mockGlobals = {
      mouseH: 0,
      mouseV: 0,
      loopMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      },
      parts: {
        getPart: jest.fn().mockReturnValue({
          getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
          getRequiredPoints: jest.fn().mockReturnValue(['snap1']),
          getUseView: jest.fn().mockReturnValue('useView'),
          getUseView2: jest.fn().mockReturnValue(''),
          getSndDescription: jest.fn().mockReturnValue(''),
          getSndAttachOnBoat: jest.fn().mockReturnValue(''),
          isMorphPart: jest.fn().mockReturnValue(false),
          getMorphList: jest.fn().mockReturnValue([]),
          isMaster: jest.fn().mockReturnValue(false),
          getMaster: jest.fn().mockReturnValue(null)
        })
      },
      user: {
        getBoat: jest.fn().mockReturnValue({
          areTheseFree: jest.fn().mockReturnValue(true),
          getSnapInfo: jest.fn().mockReturnValue({ x: 0, y: 0 })
        })
      },
      boatViewHandler: {
        getDrawOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        getCurrentHull: jest.fn().mockReturnValue('hull1')
      },
      memberResolver: {
        getMemberRect: jest.fn().mockReturnValue({ left: 0, top: 0, right: 60, bottom: 40 }),
        getRegPoint: jest.fn().mockReturnValue({ x: 10, y: 5 })
      }
    };

    mockSound = {
      play: jest.fn()
    };
  });

  afterEach(() => {
    if (dragScript) {
      dragScript.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me, argReportObject, argPartID, argMember, argWhere
     */
    test('should store report object', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.reportObject).toBe(mockReportObject);
    });

    test('should store part ID', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.partId).toBe('part1');
    });

    test('should store drag member', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.dragMember).toBe('partMember');
    });

    test('should store drag where', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.dragWhere).toBe('Quay');
    });

    // .ls line 7-8: sprite loc and startPos from the mouseH/mouseV
    test('should initialize startPos from globals mouse position (.ls line 7)', () => {
      mockGlobals.mouseH = 123;
      mockGlobals.mouseV = 234;
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.sprite.loc).toEqual({ x: 123, y: 234 });
      expect(dragScript.startPos).toEqual({ x: 123, y: 234 });
    });

    test('should initialize dragSnapList as empty object when no free snaps', () => {
      mockGlobals.user.getBoat().areTheseFree.mockReturnValue(false);
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.dragSnapList).toEqual({});
    });

    test('should populate dragSnapList for Quay when snaps are free', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.dragSnapList).toEqual({ Boatsnap1: 'part1' });
    });

    test('should initialize noSnapPoints to true when no free snaps', () => {
      mockGlobals.user.getBoat().areTheseFree.mockReturnValue(false);
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.noSnapPoints).toBe(true);
    });

    test('should set noSnapPoints to false when snaps are free', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.noSnapPoints).toBe(false);
    });

    test('should initialize insideList as empty', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.insideList).toEqual([]);
    });

    // .ls line 20: add full-screen MouseObject for drag handling
    test('should create base drag MouseObject (.ls line 20)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.mouseObjectList.length).toBeGreaterThan(0);
    });

    test('should add to loopMaster', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(mockGlobals.loopMaster.addObject).toHaveBeenCalledWith(dragScript);
    });

    test('should create snap MouseObject area from member rect + regPoint (.ls parity)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);

      // mouseObjectList[0] is fullscreen drag catcher, [1] is first Boat snap area.
      const snapObj = dragScript.mouseObjectList[1];
      expect(snapObj).toBeDefined();
      expect(snapObj.dragToWhere).toBe('Boatsnap1');
      expect(snapObj.areaList[0]).toEqual({
        left: 305,
        top: 205,
        right: 365,
        bottom: 245
      });
    });

    test('should fallback to 80x80 snap area when member geometry is unavailable', () => {
      mockGlobals.memberResolver.getMemberRect.mockReturnValue(null);
      mockGlobals.memberResolver.getRegPoint.mockReturnValue(null);

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);

      const snapObj = dragScript.mouseObjectList[1];
      expect(snapObj.areaList[0]).toEqual({
        left: 275,
        top: 170,
        right: 355,
        bottom: 250
      });
    });

    test('should set useViewSP to 0', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.useViewSP).toBe(0);
    });

    test('should set useView2SP to 0', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      expect(dragScript.useView2SP).toBe(0);
    });

    // .ls line 31-61: morph part quay setup
    test('should populate dragSnapList from free morph snap points (.ls line 31)', () => {
      const basePart = {
        isMorphPart: jest.fn().mockReturnValue(true),
        getMorphList: jest.fn().mockReturnValue(['morphA', 'morphB']),
        getRequiredPoints: jest.fn().mockReturnValue([]),
        getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        getUseView2: jest.fn().mockReturnValue('')
      };
      const morphA = {
        getRequiredPoints: jest.fn().mockReturnValue(['snapA']),
        getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        getUseView2: jest.fn().mockReturnValue('')
      };
      const morphB = {
        getRequiredPoints: jest.fn().mockReturnValue(['snapB']),
        getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        getUseView2: jest.fn().mockReturnValue('')
      };

      mockGlobals.parts.getPart = jest.fn((id) => {
        if (id === 'part1') return basePart;
        if (id === 'morphA') return morphA;
        if (id === 'morphB') return morphB;
        return basePart;
      });

      const boat = mockGlobals.user.getBoat();
      boat.areTheseFree = jest.fn((req) => req[0] === 'snapA');

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);

      expect(dragScript.dragSnapList).toEqual({ BoatsnapA: 'morphA' });
      expect(dragScript.noSnapPoints).toBe(false);
    });

    // .ls line 86-88: no snap points dialog
    test('should trigger no-snap dialog when hull exists and no snaps are free (.ls line 86)', () => {
      const boat = mockGlobals.user.getBoat();
      boat.areTheseFree.mockReturnValue(false);
      mockGlobals.boatViewHandler.getCurrentHull.mockReturnValue('hull1');

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);

      expect(mockDir.makeMulleTalk).toHaveBeenCalled();
      const snd = mockDir.makeMulleTalk.mock.calls[0][0];
      expect(['04d009v0', '04d024v0', '04d025v0', '04d026v0']).toContain(snd);
    });

    test('should not trigger no-snap dialog when hull is NoHull', () => {
      const boat = mockGlobals.user.getBoat();
      boat.areTheseFree.mockReturnValue(false);
      mockGlobals.boatViewHandler.getCurrentHull.mockReturnValue('NoHull');

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);

      expect(mockDir.makeMulleTalk).not.toHaveBeenCalled();
      expect(dragScript.noSnapPoints).toBe(true);
    });
  });

  // .ls line 94-105: on kill me
  describe('kill (.ls line 94)', () => {
    test('should set dragMember to 0 (.ls line 95)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.kill();
      expect(dragScript.dragMember).toBe(0);
    });

    test('should set dragSnapList to 0 (.ls line 96)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.kill();
      expect(dragScript.dragSnapList).toBe(0);
    });

    test('should set reportObject to 0 (.ls line 97)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.kill();
      expect(dragScript.reportObject).toBe(0);
    });

    test('should remove from loopMaster (.ls line 98)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.kill();
      expect(mockGlobals.loopMaster.deleteObject).toHaveBeenCalledWith(dragScript);
    });

    test('should kill all mouse objects (.ls lines 99-101)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      const mockMouseObj = { kill: jest.fn() };
      dragScript.mouseObjectList = [mockMouseObj];
      dragScript.kill();
      expect(mockMouseObj.kill).toHaveBeenCalled();
    });

    test('should set mouseObjectList to 0 (.ls line 102)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.kill();
      expect(dragScript.mouseObjectList).toBe(0);
    });

    test('should set sprite to Dummy (.ls line 103)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.kill();
      expect(dragScript.sprite.member).toBe('Dummy');
    });

    test('should return 0 (.ls line 104)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      const result = dragScript.kill();
      expect(result).toBe(0);
    });
  });

  describe('loop', () => {
    /**
     * Lingo: on loop me
     *   Update sprite position to follow mouse
     */
    test('should update sprite position', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.sprite = { loc: { x: 0, y: 0 } };
      dragScript.mousePosition = { x: 100, y: 200 };
      mockGlobals.mouseH = undefined;
      mockGlobals.mouseV = undefined;
      
      dragScript.loop();
      
      expect(dragScript.sprite.loc).toEqual({ x: 100, y: 200 });
    });

    // .ls line 108: set loc from the mouseH/mouseV every loop
    test('should prefer globals mouse coordinates when available (.ls line 108)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.sprite = { loc: { x: 0, y: 0 } };
      dragScript.mousePosition = { x: 100, y: 200 };
      mockGlobals.mouseH = 333;
      mockGlobals.mouseV = 444;

      dragScript.loop();

      expect(dragScript.sprite.loc).toEqual({ x: 333, y: 444 });
    });
  });

  describe('mouse - up event', () => {
    /**
     * Lingo: on mouse me, argObj, argWhat
     *   Handle up event - drop part
     */
    test('should call dropped on report object', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.sprite = { loc: { x: 100, y: 100 } };
      dragScript.startPos = { x: 100, y: 100 };
      dragScript.mousePosition = { x: 100, y: 100 };
      
      dragScript.mouse({}, 'up');
      
      expect(mockReportObject.dropped).toHaveBeenCalledWith('part1', { x: 100, y: 100 });
    });

    test('should play description sound if not moved', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getSndDescription.mockReturnValue('descSound');
      
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.sprite = { loc: { x: 50, y: 50 } };
      dragScript.startPos = { x: 50, y: 50 };
      dragScript.mousePosition = { x: 50, y: 50 };
      
      dragScript.mouse({}, 'up');
      
      expect(mockDir.makeMulleTalk).toHaveBeenCalledWith('descSound');
    });
  });

  describe('mouse - enter event', () => {
    /**
     * Lingo: on mouse me, argObj, argWhat
     *   Handle enter - show snap preview
     */
    test('should add to insideList for Boat snap', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'morphPart1' };
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
      
      expect(dragScript.insideList).toContain('Boatsnap1');
    });

    test('should update partId from dragSnapList', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'morphPart1' };
      dragScript.insideList = [];
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
      
      expect(dragScript.partId).toBe('morphPart1');
    });

    test('should show preview sprites and hide drag sprite on first enter (.ls lines 129-149)', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getUseView.mockReturnValue('previewUseView');
      partObj.getUseView2.mockReturnValue('previewUseView2');
      partObj.getRequiredPoints.mockReturnValue(['snap1']);
      const boat = mockGlobals.user.getBoat();
      boat.getSnapInfo = jest.fn((snap, key) => {
        if (key === 'layers') return [3, 4];
        if (key === 'offset') return { x: 5, y: 6 };
        return null;
      });

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'part1' };
      dragScript.insideList = [];

      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');

      expect(dragScript.useViewSP).toBe(22); // startSP(19) + layer 3
      expect(dragScript.useView2SP).toBe(23); // startSP(19) + layer 4
      expect(mockDir._spriteMembers[dragScript.SP]).toBe('Dummy');
      expect(mockDir._spriteMembers[dragScript.useViewSP]).toBe('previewUseView');
      expect(mockDir._spriteMembers[dragScript.useView2SP]).toBe('previewUseView2');
    });

    // .ls line 142/148: set the loc of sprite useViewSP/useView2SP to currentOffset
    test('should set sprite locations for preview channels (.ls line 142, 148)', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getUseView.mockReturnValue('previewUseView');
      partObj.getUseView2.mockReturnValue('previewUseView2');
      partObj.getRequiredPoints.mockReturnValue(['snap1']);
      partObj.getOffset.mockReturnValue({ x: 10, y: 20 });
      const boat = mockGlobals.user.getBoat();
      boat.getSnapInfo = jest.fn((snap, key) => {
        if (key === 'layers') return [3, 4];
        if (key === 'offset') return { x: 5, y: 6 };
        return null;
      });
      mockGlobals.boatViewHandler.getDrawOffset.mockReturnValue({ x: 2, y: 3 });
      mockDir._spriteLocations = {};

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'part1' };
      dragScript.insideList = [];

      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');

      // currentOffset = point(315,210) + partOffset(10,20) + snapOffset(5,6) + drawOffset(2,3)
      const expectedLoc = { x: 315 + 10 + 5 + 2, y: 210 + 20 + 6 + 3 };
      expect(mockDir._spriteLocations[dragScript.useViewSP]).toEqual(expectedLoc);
      expect(mockDir._spriteLocations[dragScript.useView2SP]).toEqual(expectedLoc);
    });

    test('should not add duplicate to insideList', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.insideList = ['Boatsnap1'];
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
      
      expect(dragScript.insideList.filter(x => x === 'Boatsnap1').length).toBe(1);
    });

    // .ls line 150-153: play attach sound on first enter
    test('should play attach sound on first enter (.ls line 150)', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getSndAttachOnBoat.mockReturnValue('attachSound');
      
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'part1' };
      dragScript.insideList = [];
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
      
      expect(mockSound.play).toHaveBeenCalledWith('attachSound', 'OPEFFECT');
    });

    test('should not play attach sound if already inside (.ls line 127)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'part1', Boatsnap2: 'part2' };
      dragScript.insideList = ['Boatsnap1']; // already inside one
      
      dragScript.mouse({ dragToWhere: 'Boatsnap2' }, 'enter');
      
      // Should NOT play because count(insideList) > 0 at the point of entry
      expect(mockSound.play).not.toHaveBeenCalled();
    });
  });

  describe('mouse - Leave event', () => {
    /**
     * Lingo: on mouse me, argObj, argWhat
     *   Handle leave - hide snap preview
     */
    test('should remove from insideList', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.insideList = ['Boatsnap1', 'Boatsnap2'];
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      expect(dragScript.insideList).not.toContain('Boatsnap1');
      expect(dragScript.insideList).toContain('Boatsnap2');
    });

    test('should restore drag member when all snaps left (.ls line 177)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.insideList = ['Boatsnap1'];
      dragScript.sprite = { member: 'Dummy' };
      dragScript.dragMember = 'partMember';
      dragScript.useViewSP = 5;
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      expect(dragScript.sprite.member).toBe('partMember');
    });

    test('should clear preview sprite members when all snaps left (.ls lines 169-174)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.insideList = ['Boatsnap1'];
      dragScript.useViewSP = 22;
      dragScript.useView2SP = 23;
      mockDir._spriteMembers[22] = 'previewA';
      mockDir._spriteMembers[23] = 'previewB';

      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');

      expect(mockDir._spriteMembers[22]).toBe('Dummy');
      expect(mockDir._spriteMembers[23]).toBe('Dummy');
    });

    // .ls line 164-168: reset partId to master when all snaps left
    test('should reset partId to master when leaving all snaps (.ls line 166)', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.isMaster.mockReturnValue(true);
      partObj.getMaster.mockReturnValue('masterPart');
      
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.insideList = ['Boatsnap1'];
      dragScript.partId = 'morphPart';
      dragScript.sprite = { member: 'current' };
      dragScript.dragMember = 'partMember';
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      expect(dragScript.partId).toBe('masterPart');
    });

    // .ls line 169-176: reset useViewSP and useView2SP sprites to Dummy when all snaps left
    test('should reset useViewSP to 0 when all snaps left (.ls line 169)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.insideList = ['Boatsnap1'];
      dragScript.sprite = { member: 'current' };
      dragScript.dragMember = 'partMember';
      dragScript.useViewSP = 5;
      dragScript.useView2SP = 6;
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      expect(dragScript.useViewSP).toBe(0);
      expect(dragScript.useView2SP).toBe(0);
    });

    // .ls line 178-213: switch to different snap when leaving one but still inside another
    test('should switch to another snap when partially leaving (.ls line 180)', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'morphA', Boatsnap2: 'morphB' };
      dragScript.insideList = ['Boatsnap1', 'Boatsnap2'];
      dragScript.partId = 'morphA';
      dragScript.sprite = { member: 'current' };
      
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      // Should switch to the remaining snap's part
      expect(dragScript.partId).toBe('morphB');
    });

    test('should refresh preview sprites when switching snap (.ls lines 197-208)', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getUseView.mockReturnValue('newUseView');
      partObj.getUseView2.mockReturnValue('newUseView2');
      partObj.getRequiredPoints.mockReturnValue(['snap2']);
      const boat = mockGlobals.user.getBoat();
      boat.getSnapInfo = jest.fn((snap, key) => {
        if (key === 'layers') return [5, 6];
        if (key === 'offset') return { x: 7, y: 8 };
        return null;
      });

      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'morphA', Boatsnap2: 'morphB' };
      dragScript.insideList = ['Boatsnap1', 'Boatsnap2'];
      dragScript.partId = 'morphA';
      dragScript.useViewSP = 22;
      dragScript.useView2SP = 23;
      mockDir._spriteMembers[22] = 'oldUse';
      mockDir._spriteMembers[23] = 'oldUse2';

      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');

      expect(mockDir._spriteMembers[22]).toBe('Dummy');
      expect(mockDir._spriteMembers[23]).toBe('Dummy');
      expect(dragScript.useViewSP).toBe(24); // startSP(19) + layer 5
      expect(dragScript.useView2SP).toBe(25); // startSP(19) + layer 6
      expect(mockDir._spriteMembers[24]).toBe('newUseView');
      expect(mockDir._spriteMembers[25]).toBe('newUseView2');
      expect(mockDir._spriteMembers[dragScript.SP]).toBe('Dummy');
    });

    // .ls line 209-212: play attach sound when switching snap on partial leave
    test('should play attach sound when switching snap (.ls line 209)', () => {
      const partObj = mockGlobals.parts.getPart();
      partObj.getSndAttachOnBoat.mockReturnValue('attachSound');
      
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'morphA', Boatsnap2: 'morphB' };
      dragScript.insideList = ['Boatsnap1', 'Boatsnap2'];
      dragScript.partId = 'morphA';
      dragScript.sprite = { member: 'current' };
      
      mockSound.play.mockClear();
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      expect(mockSound.play).toHaveBeenCalledWith('attachSound', 'OPEFFECT');
    });

    test('should not play attach sound when switching to same part', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { Boatsnap1: 'samePartId', Boatsnap2: 'samePartId' };
      dragScript.insideList = ['Boatsnap1', 'Boatsnap2'];
      dragScript.partId = 'samePartId';
      dragScript.sprite = { member: 'current' };
      
      mockSound.play.mockClear();
      dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');
      
      // Same part, no sound (.ls line 181: if not (tmpOldPartID = partId))
      expect(mockSound.play).not.toHaveBeenCalled();
    });
  });

  describe('getPartId', () => {
    test('should return current part ID', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.partId = 'currentPart';
      expect(dragScript.getPartId()).toBe('currentPart');
    });
  });

  describe('getDragSnapList', () => {
    test('should return drag snap list', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.dragSnapList = { snap1: 'part1', snap2: 'part2' };
      expect(dragScript.getDragSnapList()).toEqual({ snap1: 'part1', snap2: 'part2' });
    });
  });

  describe('hasNoSnapPoints', () => {
    test('should return noSnapPoints state', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.noSnapPoints = true;
      expect(dragScript.hasNoSnapPoints()).toBe(true);
    });
  });

  describe('getStartPos', () => {
    test('should return start position', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.startPos = { x: 100, y: 200 };
      expect(dragScript.getStartPos()).toEqual({ x: 100, y: 200 });
    });
  });

  describe('setMousePosition', () => {
    test('should set mouse position', () => {
      dragScript = new DragScript(mockReportObject, 'part1', 'partMember', 'Quay', mockGlobals, mockDir, mockSound);
      dragScript.setMousePosition({ x: 150, y: 250 });
      expect(dragScript.mousePosition).toEqual({ x: 150, y: 250 });
    });
  });
});
