/**
 * @fileoverview Tests for ToolBoxBH - Toolbox menu behavior
 * Based on: BehaviorScript 86 - ToolBoxBH.ls
 * 
 * ToolBoxBH manages the toolbox menu that slides in from the right edge.
 * It provides access to:
 * - Trash boat / Return home
 * - Diploma (achievements)
 * - Quit game
 * - Inventory chest
 */

const ToolBoxBH = require('../ToolBoxBH');

describe('ToolBoxBH', () => {
  let toolbox;
  let mockSprite;
  let mockDir;
  let mockGlobals;
  let mockSound;

  beforeEach(() => {
    mockSprite = {
      spriteNum: 1,
      locH: 640,
      loc: { x: 640, y: 400 }
    };

    mockDir = {
      spriteList: {
        DialogOverlay: 10,
        dialog: 20
      },
      mulleTalkObject: {
        say: jest.fn().mockReturnValue(1),
        stop: jest.fn()
      },
      pause: jest.fn(),
      prepareToLeave: jest.fn(),
      dialogClosed: false
    };

    mockGlobals = {
      mouseMaster: {
        setActivePauseAll: jest.fn()
      },
      user: {
        getBoat: jest.fn().mockReturnValue({ trash: jest.fn() }),
        isInInventory: jest.fn().mockReturnValue(false),
        veryFirstTime: 1
      },
      save: jest.fn()
    };

    mockSound = {
      play: jest.fn().mockReturnValue(1),
      stop: jest.fn(),
      stopAllEffects: jest.fn()
    };
  });

  afterEach(() => {
    if (toolbox) {
      toolbox.kill();
    }
  });

  describe('constructor / beginSprite', () => {
    /**
     * Lingo: on beginSprite me
     *   Initialize toolbox state
     */
    test('should store sprite number', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.SP).toBe(1);
    });

    test('should store start location', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.startLocH).toBe(640);
    });

    test('should set max to 4', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.max).toBe(4);
    });

    test('should set step to 11', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.step).toBe(11);
    });

    test('should initialize counter to 0', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.counter).toBe(0);
    });

    test('should set mode to in', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.mode).toBe('in');
    });

    test('should set centerH to 640', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.centerH).toBe(640);
    });

    test('should initialize isInside to false', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.isInside).toBe(false);
    });

    test('should set trackRect', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.trackRect).toEqual({ left: 560, top: 400, right: 800, bottom: 650 });
    });

    test('should initialize mouseAreaList as empty', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.mouseAreaList).toEqual([]);
    });

    test('should initialize BGMouseObjects as empty', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.BGMouseObjects).toEqual([]);
    });

    test('should set activeClick to true', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.activeClick).toBe(true);
    });

    test('should initialize orgRollOvers', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      expect(toolbox.orgRollOvers).toBeDefined();
      expect(toolbox.orgRollOvers.normal).toBeDefined();
      expect(toolbox.orgRollOvers.Inventory).toBeDefined();
    });

    test('should detect Sea location from movie 05', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound, '05');
      expect(toolbox.where).toBe('Sea');
    });

    test('should detect Home location from other movies', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound, '01');
      expect(toolbox.where).toBe('Home');
    });
  });

  describe('endSprite', () => {
    /**
     * Lingo: on endSprite me
     *   kill(me)
     */
    test('should call kill', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.kill = jest.fn();
      toolbox.endSprite();
      expect(toolbox.kill).toHaveBeenCalled();
    });
  });

  describe('activateClick', () => {
    /**
     * Lingo: on activateClick me, theState
     *   set activeClick to theState
     */
    test('should set activeClick to true', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activeClick = false;
      toolbox.activateClick(true);
      expect(toolbox.activeClick).toBe(true);
    });

    test('should set activeClick to false', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activateClick(false);
      expect(toolbox.activeClick).toBe(false);
    });
  });

  describe('exitFrame', () => {
    /**
     * Lingo: on exitFrame me
     *   Handle animation and rollover sounds
     */
    test('should decrement counter when > 0', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.counter = 3;
      toolbox.exitFrame();
      expect(toolbox.counter).toBe(2);
    });

    test('should not change counter when 0', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.counter = 0;
      toolbox.exitFrame();
      expect(toolbox.counter).toBe(0);
    });

    test('should update sprite position in mode in', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mode = 'in';
      toolbox.counter = 2;
      toolbox.startLocH = 640;
      toolbox.step = 11;
      
      toolbox.exitFrame();
      
      // Position = startLocH - (counter * step) = 640 - (1 * 11) = 629
      expect(mockSprite.locH).toBe(629);
    });

    test('should update sprite position in mode Out', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mode = 'Out';
      toolbox.counter = 2;
      toolbox.max = 4;
      toolbox.startLocH = 640;
      toolbox.step = 11;
      
      toolbox.exitFrame();
      
      // Position = startLocH - ((max - counter) * step) = 640 - ((4 - 1) * 11) = 607
      expect(mockSprite.locH).toBe(607);
    });
  });

  describe('mouseEnter', () => {
    /**
     * Lingo: on mouseEnter me
     *   Start slide out animation
     */
    test('should set checkForLeave when activeClick', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activeClick = true;
      toolbox.mouseEnter();
      expect(toolbox.checkForLeave).toBe(true);
    });

    test('should switch mode from in to Out', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activeClick = true;
      toolbox.mode = 'in';
      toolbox.mouseEnter();
      expect(toolbox.mode).toBe('Out');
    });

    test('should play sound when counter < 4', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activeClick = true;
      toolbox.counter = 2;
      toolbox.mouseEnter();
      expect(mockSound.play).toHaveBeenCalled();
    });

    test('should switch mode from Out to in when not activeClick', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activeClick = false;
      toolbox.mode = 'Out';
      toolbox.mouseEnter();
      expect(toolbox.mode).toBe('in');
    });
  });

  describe('mymouseLeave', () => {
    /**
     * Lingo: on mymouseLeave me
     *   Retract toolbox
     */
    test('should set isInside to false', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.isInside = true;
      toolbox.mymouseLeave();
      expect(toolbox.isInside).toBe(false);
    });

    test('should set checkForLeave to false', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.checkForLeave = true;
      toolbox.mymouseLeave();
      expect(toolbox.checkForLeave).toBe(false);
    });

    test('should switch mode from Out to in', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mode = 'Out';
      toolbox.max = 4;
      toolbox.counter = 2;
      toolbox.mymouseLeave();
      expect(toolbox.mode).toBe('in');
      expect(toolbox.counter).toBe(2); // max - counter = 4 - 2 = 2
    });
  });

  describe('mouseUp', () => {
    /**
     * Lingo: on mouseUp me
     *   Open toolbox dialog
     */
    test('should set displaying to true', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mouseUp();
      expect(toolbox.displaying).toBe(true);
    });

    test('should keep activeClick true (Lingo does not disable on open)', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mouseUp();
      expect(toolbox.activeClick).toBe(true);
    });

    test('should set rollOvers to normal', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mouseUp();
      expect(toolbox.rollOvers).toBe(toolbox.orgRollOvers.normal);
    });

    test('should set mode to Out', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mouseUp();
      expect(toolbox.mode).toBe('Out');
    });
  });

  describe('mouse', () => {
    /**
     * Lingo: on mouse me, argObj, argWhat
     *   Handle menu item clicks and rollovers
     */
    test('should handle exit click', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.displaying = true;
      toolbox.mouse({ dragToWhere: 'exit' }, 'click');
      expect(toolbox.displaying).toBe(false);
    });

    test('should set nowOver on enter', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.rollOvers = { TestItem: { Roll: 'pic', Snd: 'snd' } };
      toolbox.mouse({ dragToWhere: 'TestItem' }, 'enter');
      expect(toolbox.nowOver).toBe('TestItem');
    });

    test('should clear nowOver on leave', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.nowOver = 'TestItem';
      toolbox.inChest = false;
      toolbox.mouse({ dragToWhere: 'TestItem' }, 'Leave');
      expect(toolbox.nowOver).toBe(0);
    });

    test('should not clear nowOver on leave if different item', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.nowOver = 'OtherItem';
      toolbox.mouse({ dragToWhere: 'TestItem' }, 'Leave');
      expect(toolbox.nowOver).toBe('OtherItem');
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   Clean up toolbox
     */
    test('should set displaying to false', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.displaying = true;
      toolbox.kill();
      expect(toolbox.displaying).toBe(false);
    });

    test('should set activeClick to true', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.activeClick = false;
      toolbox.kill();
      expect(toolbox.activeClick).toBe(true);
    });

    test('should return null', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      const result = toolbox.kill();
      expect(result).toBeNull();
    });

    test('should clear mouseAreaList', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.mouseAreaList = [{ kill: jest.fn() }];
      toolbox.displaying = true;
      toolbox.kill();
      expect(toolbox.mouseAreaList).toEqual([]);
    });

    test('should clear BGMouseObjects', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.BGMouseObjects = [{ kill: jest.fn() }];
      toolbox.displaying = true;
      toolbox.kill();
      expect(toolbox.BGMouseObjects).toEqual([]);
    });
  });

  describe('inventory handling', () => {
    test('should set inChest when clicking Inventory', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.displaying = true;
      toolbox.rollOvers = toolbox.orgRollOvers.normal;
      toolbox.mouseAreaList = [];
      
      toolbox.mouse({ dragToWhere: 'Inventory' }, 'click');
      
      expect(toolbox.inChest).toBe(true);
    });

    test('should change rollOvers to Inventory', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.displaying = true;
      toolbox.rollOvers = toolbox.orgRollOvers.normal;
      toolbox.mouseAreaList = [];
      
      toolbox.mouse({ dragToWhere: 'Inventory' }, 'click');
      
      expect(toolbox.rollOvers).toBe(toolbox.orgRollOvers.Inventory);
    });
  });

  describe('getDisplaying', () => {
    test('should return current displaying state', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.displaying = true;
      expect(toolbox.getDisplaying()).toBe(true);
    });
  });

  describe('getInChest', () => {
    test('should return current inChest state', () => {
      toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound);
      toolbox.inChest = true;
      expect(toolbox.getInChest()).toBe(true);
    });
  });
});
