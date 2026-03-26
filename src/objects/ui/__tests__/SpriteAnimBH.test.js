/**
 * @fileoverview Tests for SpriteAnimBH - Sprite Animation Behavior
 * Based on: BehaviorScript 25 - SpriteAnimBH.ls
 * 
 * SpriteAnimBH handles sprite-based animations with support for:
 * - Frame-based animation sequences
 * - Path-based movement
 * - Sound synchronization (especially for speech/talk animations)
 * - Wait states and action states
 */

const SpriteAnimBH = require('../SpriteAnimBH');

describe('SpriteAnimBH', () => {
  let anim;
  let mockSprite;
  let mockSound;

  beforeEach(() => {
    mockSprite = {
      spriteNum: 1,
      member: 'frame1',
      loc: { x: 100, y: 100 }
    };

    mockSound = {
      play: jest.fn().mockReturnValue(1),
      stop: jest.fn(),
      finished: jest.fn().mockReturnValue(false),
      getChannel: jest.fn().mockReturnValue(1)
    };
  });

  afterEach(() => {
    if (anim) {
      anim.endSprite();
    }
  });

  describe('constructor / beginSprite', () => {
    /**
     * Lingo: on beginSprite me
     *   set type to #SpriteAnim
     *   if voidp(active) then set active to 1
     */
    test('should set type to SpriteAnim', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      expect(anim.type).toBe('SpriteAnim');
    });

    test('should initialize active to true by default', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      expect(anim.active).toBe(true);
    });

    test('should store sprite reference', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      expect(anim.sprite).toBe(mockSprite);
    });

    test('should store initial location', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      expect(anim.myLoc).toEqual({ x: 100, y: 100 });
    });

    test('should initialize with inactive state when active is false', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound, { active: false });
      expect(anim.active).toBe(false);
    });
  });

  describe('endSprite', () => {
    /**
     * Lingo: on endSprite me
     *   if sndId then stop(gSound, sndId)
     */
    test('should stop sound if playing', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.sndId = 5;
      
      anim.endSprite();
      
      expect(mockSound.stop).toHaveBeenCalledWith(5);
    });

    test('should not call stop if no sound playing', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.sndId = 0;
      
      anim.endSprite();
      
      expect(mockSound.stop).not.toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    /**
     * Lingo: on activate me, YesNo
     *   set active to YesNo
     */
    test('should set active state to true', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound, { active: false });
      anim.activate(true);
      expect(anim.active).toBe(true);
    });

    test('should set active state to false', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.activate(false);
      expect(anim.active).toBe(false);
    });
  });

  describe('setAnimFirstFrame', () => {
    /**
     * Lingo: on setAnimFirstFrame me, theMember
     *   if theMember = EMPTY then use current member
     *   else set firstFrame to member number
     */
    test('should set first frame from member name', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimFirstFrame('startFrame');
      expect(anim.firstFrame).toBe('startFrame');
    });

    test('should use current sprite member if empty', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimFirstFrame('');
      expect(anim.firstFrame).toBe('frame1');
    });
  });

  describe('setAnimChart', () => {
    /**
     * Lingo: on setAnimChart me, theName
     *   set tempChart to value(the text of member (theName & "AnimChart"))
     */
    test('should set animation chart name', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimChart('Mulle');
      expect(anim.frameListMember).toBe('Mulle');
    });

    test('should initialize allFrameLists', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimChart('Standard', {
        Actions: { Still: [1], Talk: [1, 2, 3], Wait: [1, 2] },
        Paths: {}
      });
      expect(anim.allFrameLists).toBeDefined();
    });
  });

  describe('setAnimAction', () => {
    /**
     * Lingo: on setAnimAction me, theMove
     *   if theMove = #Still then playAnimSound(me, EMPTY)
     *   set movement to theMove
     */
    test('should set movement to Still', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.allFrameLists = { Still: [1], Talk: [1, 2, 3] };
      anim.setAnimAction('Still');
      expect(anim.movement).toBe('Still');
    });

    test('should stop sound when setting Still', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.sndId = 5;
      anim.allFrameLists = { Still: [1] };
      anim.setAnimAction('Still');
      expect(mockSound.stop).toHaveBeenCalled();
    });

    test('should set movement to Talk', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.allFrameLists = { Talk: [1, 2, 3, 4] };
      anim.setAnimAction('Talk');
      expect(anim.movement).toBe('Talk');
    });

    test('should build frame list from action', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.allFrameLists = { Walk: [1, 2, 3, 4] };
      anim.setAnimAction('Walk');
      expect(anim.frameList).toEqual([1, 2, 3, 4]);
    });

    test('should handle Wait action with random selection', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.allFrameLists = { 
        Wait: [1, 'Scratch', 'Yawn'],
        Scratch: [2, 3, 4],
        Yawn: [5, 6] 
      };
      anim.waitState = 'Still';
      anim.setAnimAction('Wait');
      // Should toggle waitState
      expect(anim.waitState).toBe('move');
    });

    test('should reset action counter', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.actionCounter = 10;
      anim.allFrameLists = { Still: [1] };
      anim.setAnimAction('Still');
      expect(anim.actionCounter).toBe(0);
    });

    test('should set actionActive to true', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.allFrameLists = { Still: [1] };
      anim.setAnimAction('Still');
      expect(anim.actionActive).toBe(true);
    });
  });

  describe('getAnimAction', () => {
    /**
     * Lingo: on getAnimAction me
     *   return movement
     */
    test('should return current movement', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.movement = 'Talk';
      expect(anim.getAnimAction()).toBe('Talk');
    });
  });

  describe('getAnimWaitState', () => {
    /**
     * Lingo: on getAnimWaitState me
     *   return waitState
     */
    test('should return current wait state', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.waitState = 'Still';
      expect(anim.getAnimWaitState()).toBe('Still');
    });
  });

  describe('playAnimSound', () => {
    /**
     * Lingo: on playAnimSound me, theSnd
     *   if length(theSnd) > 0 then play and return sndId
     *   else stop current sound
     */
    test('should play sound and return id', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      mockSound.play.mockReturnValue(42);
      
      const result = anim.playAnimSound('testSound');
      
      expect(mockSound.play).toHaveBeenCalledWith('testSound', 'EFFECT');
      expect(result).toBe(42);
    });

    test('should stop current sound before playing new one', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.sndId = 5;
      
      anim.playAnimSound('newSound');
      
      expect(mockSound.stop).toHaveBeenCalledWith(5);
    });

    test('should stop sound and return 0 for empty sound', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.sndId = 5;
      
      const result = anim.playAnimSound('');
      
      expect(mockSound.stop).toHaveBeenCalled();
      expect(result).toBe(0);
    });
  });

  describe('makeAnimSpeech', () => {
    /**
     * Lingo: on makeAnimSpeech me, theSnd
     *   set repeatIt to 1, syncTalk to 1
     *   playAnimSound and set waitForWhat to #sound
     */
    test('should set repeatIt to true', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.makeAnimSpeech('speech1');
      expect(anim.repeatIt).toBe(true);
    });

    test('should set syncTalk to true', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.makeAnimSpeech('speech1');
      expect(anim.syncTalk).toBe(true);
    });

    test('should set waitForWhat to sound', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.makeAnimSpeech('speech1');
      expect(anim.waitForWhat).toBe('sound');
    });

    test('should play sound and return id', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      mockSound.play.mockReturnValue(99);
      
      const result = anim.makeAnimSpeech('speech1');
      
      expect(result).toBe(99);
    });
  });

  describe('setAnimNormal', () => {
    /**
     * Lingo: on setAnimNormal me
     *   set repeatIt to 0, syncTalk to 0
     *   set waitForWhat to #anim, doWhat to #SendSpriteMe
     */
    test('should set repeatIt to false', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.repeatIt = true;
      anim.setAnimNormal();
      expect(anim.repeatIt).toBe(false);
    });

    test('should set syncTalk to false', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.syncTalk = true;
      anim.setAnimNormal();
      expect(anim.syncTalk).toBe(false);
    });

    test('should set waitForWhat to anim', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimNormal();
      expect(anim.waitForWhat).toBe('anim');
    });

    test('should set doWhat to SendSpriteMe', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimNormal();
      expect(anim.doWhat).toBe('SendSpriteMe');
    });
  });

  describe('setAnimPath', () => {
    /**
     * Lingo: on setAnimPath me, movePathName, toLoc, nrOfSteps
     *   Creates path for movement animation
     */
    test('should set pathActive to false initially', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.setAnimPath('', null, 0);
      expect(anim.pathActive).toBe(false);
    });

    test('should activate path when toLoc provided', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.myLoc = { x: 0, y: 0 };
      anim.setAnimPath('', { x: 100, y: 100 }, 10);
      expect(anim.pathActive).toBe(true);
    });

    test('should create movePath with correct number of steps', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.myLoc = { x: 0, y: 0 };
      anim.setAnimPath('', { x: 100, y: 0 }, 5);
      expect(anim.movePath.length).toBe(5);
    });

    test('should calculate correct path points', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.myLoc = { x: 0, y: 0 };
      anim.pathRelative = false;
      anim.setAnimPath('', { x: 100, y: 0 }, 4);
      
      expect(anim.movePath[0].x).toBe(25);
      expect(anim.movePath[3].x).toBe(100);
    });

    test('should use named path from allPathLists', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.allPathLists = {
        walkPath: [{ x: 10, y: 0 }, { x: 20, y: 0 }, { x: 30, y: 0 }]
      };
      anim.myLoc = { x: 0, y: 0 };
      anim.pathRelative = false;
      
      anim.setAnimPath('walkPath', null, 0);
      
      expect(anim.pathActive).toBe(true);
      expect(anim.nrOfSteps).toBe(3);
    });
  });

  describe('setAnimLoc', () => {
    /**
     * Lingo: on setAnimLoc me, theLoc, isRelational
     *   if isRelational then add to myLoc
     *   else set myLoc directly
     */
    test('should set absolute location', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.myLoc = { x: 50, y: 50 };
      anim.setAnimLoc({ x: 200, y: 300 }, false);
      expect(anim.myLoc).toEqual({ x: 200, y: 300 });
    });

    test('should add relative location', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.myLoc = { x: 50, y: 50 };
      anim.setAnimLoc({ x: 10, y: -20 }, true);
      expect(anim.myLoc).toEqual({ x: 60, y: 30 });
    });
  });

  describe('exitFrame', () => {
    /**
     * Lingo: on exitFrame me
     *   Main update loop for animation
     */
    test('should do nothing when not active', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.active = false;
      anim.pathActive = true;
      anim.pathCounter = 0;
      
      anim.exitFrame();
      
      expect(anim.pathCounter).toBe(0);
    });

    test('should update path counter when path active', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.active = true;
      anim.pathActive = true;
      anim.pathCounter = 0;
      anim.nrOfSteps = 5;
      anim.movePath = [
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 30, y: 30 },
        { x: 40, y: 40 },
        { x: 50, y: 50 }
      ];
      anim.actionActive = false;
      
      anim.exitFrame();
      
      expect(anim.pathCounter).toBe(1);
      expect(anim.myLoc).toEqual({ x: 10, y: 10 });
    });

    test('should update action counter when action active', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.active = true;
      anim.pathActive = false;
      anim.actionActive = true;
      anim.actionCounter = 0;
      anim.frameList = [1, 2, 3];
      anim.soundList = [0, 0, 0];
      anim.listLen = 3;
      anim.firstFrame = 'frame';
      
      anim.exitFrame();
      
      expect(anim.actionCounter).toBe(1);
    });

    test('should deactivate path when complete', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.active = true;
      anim.pathActive = true;
      anim.pathCounter = 4;
      anim.nrOfSteps = 5;
      anim.movePath = [
        { x: 10, y: 10 },
        { x: 20, y: 20 },
        { x: 30, y: 30 },
        { x: 40, y: 40 },
        { x: 50, y: 50 }
      ];
      anim.waitForWhat = 'none';
      anim.actionActive = false;
      
      anim.exitFrame();
      
      expect(anim.pathActive).toBe(false);
    });
  });

  describe('spriteCuePassed', () => {
    /**
     * Lingo: on spritecuePassed me, theChannel, cueNr, cueName
     *   if syncTalk and cueName = "T" then Talk
     *   if cueName = "S" then Wait
     */
    test('should set action to Talk on T cue', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.syncTalk = true;
      anim.myChannel = 1;
      anim.sndId = 5;
      anim.allFrameLists = { Talk: [1, 2, 3] };
      mockSound.finished.mockReturnValue(false);
      
      anim.spriteCuePassed(1, 1, 'T');
      
      expect(anim.movement).toBe('Talk');
    });

    test('should set action to Wait on S cue', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.syncTalk = true;
      anim.myChannel = 1;
      anim.sndId = 5;
      anim.waitState = 'Still'; // Start in Still state
      anim.allFrameLists = { Wait: [1] };
      mockSound.finished.mockReturnValue(false);
      
      anim.spriteCuePassed(1, 1, 'S');
      
      expect(anim.movement).toBe('Wait');
      // Wait action toggles waitState from Still to move
      expect(anim.waitState).toBe('move');
    });

    test('should ignore cues on different channel', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.syncTalk = true;
      anim.myChannel = 1;
      anim.movement = 'Still';
      anim.allFrameLists = { Talk: [1, 2, 3] };
      
      anim.spriteCuePassed(2, 1, 'T');
      
      expect(anim.movement).toBe('Still');
    });

    test('should ignore cues when syncTalk is false', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      anim.syncTalk = false;
      anim.myChannel = 1;
      anim.movement = 'Still';
      
      anim.spriteCuePassed(1, 1, 'T');
      
      expect(anim.movement).toBe('Still');
    });
  });

  describe('RndHold frame list handling', () => {
    test('should expand RndHold into repeated frames', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      // RndHold format: [#RndHold, frame, minRepeat, maxRepeat]
      anim.allFrameLists = { 
        Test: [1, ['RndHold', 2, 3, 3], 4] // Hold frame 2 for exactly 3 times
      };
      
      anim.setAnimAction('Test');
      
      // Should have: 1, 2, 2, 2, 4 = 5 frames
      expect(anim.frameList.length).toBe(5);
      expect(anim.frameList[1]).toBe(2);
      expect(anim.frameList[2]).toBe(2);
      expect(anim.frameList[3]).toBe(2);
    });
  });

  describe('RndFrame frame list handling', () => {
    test('should pick random frame from list', () => {
      anim = new SpriteAnimBH(mockSprite, mockSound);
      // RndFrame format: [#RndFrame, [frame1, frame2, frame3]]
      anim.allFrameLists = { 
        Test: [1, ['RndFrame', [5, 6, 7]], 4]
      };
      
      anim.setAnimAction('Test');
      
      expect(anim.frameList.length).toBe(3);
      expect([5, 6, 7]).toContain(anim.frameList[1]);
    });
  });
});
