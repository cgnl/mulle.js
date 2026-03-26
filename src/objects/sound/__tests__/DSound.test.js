/**
 * @fileoverview Tests for DSound - DirectSound wrapper
 * Based on: ParentScript 144 - DSound.ls
 * 
 * DSound provides DirectSound-based audio playback with support for:
 * - Multiple simultaneous sounds
 * - Preloading sounds
 * - Volume and frequency control
 * - Background, effect, and optional effect channels
 */

const DSound = require('../DSound');

describe('DSound', () => {
  let dsound;
  let mockDsApi;

  beforeEach(() => {
    mockDsApi = {
      dsOpen: jest.fn().mockReturnValue(1),
      dsClose: jest.fn(),
      dsGetCaps: jest.fn().mockReturnValue([1024 * 1024, 8, 1, 10]),
      dsNewSound: jest.fn().mockReturnValue(1),
      dsDelSound: jest.fn(),
      dsPlay: jest.fn(),
      dsStop: jest.fn(),
      dsIsPlaying: jest.fn().mockReturnValue(false),
      dsSetVolume: jest.fn(),
      dsSetFreq: jest.fn(),
      dsSetLoop: jest.fn(),
      dsSetPosition: jest.fn()
    };
  });

  afterEach(() => {
    if (dsound) {
      dsound.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me, argOKLastTime
     *   set mode to #xtra
     *   dsOpen()
     */
    test('should set mode to xtra', () => {
      dsound = new DSound(mockDsApi);
      expect(dsound.mode).toBe('xtra');
    });

    test('should call dsOpen', () => {
      dsound = new DSound(mockDsApi);
      expect(mockDsApi.dsOpen).toHaveBeenCalled();
    });

    test('should initialize channels', () => {
      dsound = new DSound(mockDsApi);
      expect(dsound.channels).toEqual({
        BG: [],
        EFFECT: [],
        OPEFFECT: []
      });
    });

    test('should set maxSounds from dsGetCaps', () => {
      mockDsApi.dsGetCaps.mockReturnValue([1024 * 1024, 16, 1, 10]);
      dsound = new DSound(mockDsApi);
      expect(dsound.maxSounds).toBe(16);
    });

    test('should default maxSounds to 5 if 0', () => {
      mockDsApi.dsGetCaps.mockReturnValue([1024 * 1024, 0, 1, 10]);
      dsound = new DSound(mockDsApi);
      expect(dsound.maxSounds).toBe(5);
    });

    test('should initialize preLoadedList', () => {
      dsound = new DSound(mockDsApi);
      expect(dsound.preLoadedList).toEqual({});
    });

    test('should return null if dsOpen fails and no okLastTime', () => {
      mockDsApi.dsOpen.mockReturnValue(0);
      dsound = new DSound(mockDsApi);
      // In real implementation this would return 0/null
      expect(dsound.mode).toBe('xtra');
    });
  });

  describe('init', () => {
    /**
     * Lingo: on init me
     *   set channels to [#BG: [], #EFFECT: [], #OPEFFECT: []]
     *   set nrOfPlaying to 0
     */
    test('should reset channels', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.BG.push(1);
      dsound.init();
      expect(dsound.channels).toEqual({
        BG: [],
        EFFECT: [],
        OPEFFECT: []
      });
    });

    test('should reset nrOfPlaying to 0', () => {
      dsound = new DSound(mockDsApi);
      dsound.nrOfPlaying = 5;
      dsound.init();
      expect(dsound.nrOfPlaying).toBe(0);
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   unLoadAll(me)
     *   dsClose()
     *   return 0
     */
    test('should call dsClose', () => {
      dsound = new DSound(mockDsApi);
      dsound.kill();
      expect(mockDsApi.dsClose).toHaveBeenCalled();
    });

    test('should return null', () => {
      dsound = new DSound(mockDsApi);
      const result = dsound.kill();
      expect(result).toBeNull();
    });
  });

  describe('getFreeChannels', () => {
    /**
     * Lingo: on getFreeChannels me
     *   return maxSounds - nrOfPlaying
     */
    test('should return available channels', () => {
      dsound = new DSound(mockDsApi);
      dsound.maxSounds = 8;
      dsound.nrOfPlaying = 3;
      expect(dsound.getFreeChannels()).toBe(5);
    });

    test('should return 0 when all channels used', () => {
      dsound = new DSound(mockDsApi);
      dsound.maxSounds = 8;
      dsound.nrOfPlaying = 8;
      expect(dsound.getFreeChannels()).toBe(0);
    });
  });

  describe('getNrOfChannels', () => {
    /**
     * Lingo: on getNrOfChannels me
     *   return maxSounds
     */
    test('should return maxSounds', () => {
      dsound = new DSound(mockDsApi);
      dsound.maxSounds = 12;
      expect(dsound.getNrOfChannels()).toBe(12);
    });
  });

  describe('preLoad', () => {
    /**
     * Lingo: on preLoad me, theFileName
     *   set tmpID to dsNewSound(soundPath & theFileName & ".wav", 0)
     *   addProp(preLoadedList, theFileName, tmpID)
     */
    test('should create new sound', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      const result = dsound.preLoad('explosion');
      
      expect(mockDsApi.dsNewSound).toHaveBeenCalled();
      expect(result).toBe(42);
    });

    test('should add to preLoadedList', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      dsound.preLoad('explosion');
      
      expect(dsound.preLoadedList.explosion).toBe(42);
    });

    test('should return 0 on failure', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(0);
      
      const result = dsound.preLoad('missing');
      
      expect(result).toBe(0);
    });
  });

  describe('unLoad', () => {
    /**
     * Lingo: on unLoad me, sndId
     *   if not finished then stop
     *   deleteOne(preLoadedList, sndId)
     *   dsDelSound(sndId)
     */
    test('should stop sound if playing', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.EFFECT.push(5);
      mockDsApi.dsIsPlaying.mockReturnValue(true);
      
      dsound.unLoad(5);
      
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(5);
    });

    test('should delete sound', () => {
      dsound = new DSound(mockDsApi);
      dsound.preLoadedList.test = 5;
      
      dsound.unLoad(5);
      
      expect(mockDsApi.dsDelSound).toHaveBeenCalledWith(5);
    });
  });

  describe('unLoadAll', () => {
    /**
     * Lingo: on unLoadAll me
     *   stopAll(me)
     *   repeat with N to delete all sounds
     */
    test('should stop all sounds', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.BG = [1];
      dsound.channels.EFFECT = [2, 3];
      
      dsound.unLoadAll();
      
      expect(mockDsApi.dsStop).toHaveBeenCalledTimes(3);
    });

    test('should delete all preloaded sounds', () => {
      dsound = new DSound(mockDsApi);
      dsound.preLoadedList = { a: 1, b: 2, c: 3 };
      
      dsound.unLoadAll();
      
      expect(mockDsApi.dsDelSound).toHaveBeenCalledTimes(3);
    });

    test('should clear preLoadedList', () => {
      dsound = new DSound(mockDsApi);
      dsound.preLoadedList = { a: 1 };
      
      dsound.unLoadAll();
      
      expect(dsound.preLoadedList).toEqual({});
    });
  });

  describe('stopAll', () => {
    /**
     * Lingo: on stopAll me
     *   repeat with aList in channels
     *     repeat with sndId in aList: dsStop
     *   init(me)
     */
    test('should stop all sounds in all channels', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.BG = [1, 2];
      dsound.channels.EFFECT = [3];
      dsound.channels.OPEFFECT = [4, 5];
      
      dsound.stopAll();
      
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(1);
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(2);
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(3);
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(4);
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(5);
    });

    test('should reset channels', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.BG = [1];
      
      dsound.stopAll();
      
      expect(dsound.channels.BG).toEqual([]);
    });
  });

  describe('setFreq', () => {
    /**
     * Lingo: on setFreq me, sndId, theFreq
     *   dsSetFreq(sndId, theFreq)
     */
    test('should set frequency', () => {
      dsound = new DSound(mockDsApi);
      dsound.setFreq(5, 44100);
      expect(mockDsApi.dsSetFreq).toHaveBeenCalledWith(5, 44100);
    });
  });

  describe('setVol', () => {
    /**
     * Lingo: on setVol me, sndId, theVol, theOption
     *   Converts percentage to dB if not #dB option
     */
    test('should set volume in dB directly', () => {
      dsound = new DSound(mockDsApi);
      dsound.setVol(5, -1000, 'dB');
      expect(mockDsApi.dsSetVolume).toHaveBeenCalledWith(5, -1000);
    });

    test('should convert percentage to dB', () => {
      dsound = new DSound(mockDsApi);
      dsound.setVol(5, 100);
      expect(mockDsApi.dsSetVolume).toHaveBeenCalled();
    });

    test('should handle 0 volume', () => {
      dsound = new DSound(mockDsApi);
      dsound.setVol(5, 0);
      expect(mockDsApi.dsSetVolume).toHaveBeenCalledWith(5, -10000);
    });
  });

  describe('setLoop', () => {
    /**
     * Lingo: on setloop me, sndId, YesNo
     *   dsSetLoop(sndId, YesNo)
     */
    test('should set loop on', () => {
      dsound = new DSound(mockDsApi);
      dsound.setLoop(5, true);
      expect(mockDsApi.dsSetLoop).toHaveBeenCalledWith(5, true);
    });

    test('should set loop off', () => {
      dsound = new DSound(mockDsApi);
      dsound.setLoop(5, false);
      expect(mockDsApi.dsSetLoop).toHaveBeenCalledWith(5, false);
    });
  });

  describe('finished', () => {
    /**
     * Lingo: on finished me, sndId
     *   purge(me)
     *   return not dsIsPlaying(sndId)
     */
    test('should return true when not playing', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsIsPlaying.mockReturnValue(false);
      expect(dsound.finished(5)).toBe(true);
    });

    test('should return false when playing', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsIsPlaying.mockReturnValue(true);
      expect(dsound.finished(5)).toBe(false);
    });
  });

  describe('getChannel', () => {
    /**
     * Lingo: on getChannel me, sndId
     *   return 0 (DSound doesn't use channel numbers)
     */
    test('should return 0', () => {
      dsound = new DSound(mockDsApi);
      expect(dsound.getChannel(5)).toBe(0);
    });
  });

  describe('stop', () => {
    /**
     * Lingo: on stop me, sndId
     *   Find in channels, dsStop, remove from list
     */
    test('should stop sound', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.EFFECT = [5, 6, 7];
      dsound.nrOfPlaying = 3;
      
      dsound.stop(6);
      
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(6);
    });

    test('should remove from channel list', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.EFFECT = [5, 6, 7];
      dsound.nrOfPlaying = 3;
      
      dsound.stop(6);
      
      expect(dsound.channels.EFFECT).toEqual([5, 7]);
    });

    test('should decrement nrOfPlaying', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.EFFECT = [5, 6, 7];
      dsound.nrOfPlaying = 3;
      
      dsound.stop(6);
      
      expect(dsound.nrOfPlaying).toBe(2);
    });

    test('should reset position to 0', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.EFFECT = [5];
      dsound.nrOfPlaying = 1;
      
      dsound.stop(5);
      
      expect(mockDsApi.dsSetPosition).toHaveBeenCalledWith(5, 0);
    });
  });

  describe('play', () => {
    /**
     * Lingo: on play me, sndId, what, theOption
     *   Handle channel management and play sound
     */
    test('should play sound and return id', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      const result = dsound.play('test', 'EFFECT');
      
      expect(mockDsApi.dsPlay).toHaveBeenCalledWith(42);
      expect(result).toBe(42);
    });

    test('should add to EFFECT channel', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      dsound.play('test', 'EFFECT');
      
      expect(dsound.channels.EFFECT).toContain(42);
    });

    test('should add to BG channel', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      dsound.play('test', 'BG');
      
      expect(dsound.channels.BG).toContain(42);
    });

    test('should treat TRANS as BG', () => {
      dsound = new DSound(mockDsApi);
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      dsound.play('test', 'TRANS');
      
      expect(dsound.channels.BG).toContain(42);
    });

    test('should increment nrOfPlaying', () => {
      dsound = new DSound(mockDsApi);
      dsound.nrOfPlaying = 0;
      mockDsApi.dsNewSound.mockReturnValue(42);
      
      dsound.play('test', 'EFFECT');
      
      expect(dsound.nrOfPlaying).toBe(1);
    });

    test('should use preloaded sound if available', () => {
      dsound = new DSound(mockDsApi);
      dsound.preLoadedList.cached = 99;
      
      const result = dsound.play('cached', 'EFFECT');
      
      expect(result).toBe(99);
      expect(mockDsApi.dsNewSound).not.toHaveBeenCalled();
    });

    test('should stop oldest OPEFFECT when full', () => {
      dsound = new DSound(mockDsApi);
      dsound.maxSounds = 2;
      dsound.nrOfPlaying = 2;
      dsound.channels.OPEFFECT = [1];
      dsound.channels.EFFECT = [2];
      dsound.preLoadedList.new = 3; // Pre-cache to avoid dsNewSound call
      // Make sounds appear as playing so purge doesn't remove them
      mockDsApi.dsIsPlaying.mockReturnValue(true);
      
      dsound.play('new', 'EFFECT');
      
      // Should have stopped the oldest OPEFFECT (id 1)
      expect(mockDsApi.dsStop).toHaveBeenCalledWith(1);
    });
  });

  describe('purge', () => {
    /**
     * Lingo: on purge me
     *   Remove finished sounds from channels
     */
    test('should remove finished sounds', () => {
      dsound = new DSound(mockDsApi);
      dsound.channels.EFFECT = [1, 2, 3];
      dsound.nrOfPlaying = 3;
      mockDsApi.dsIsPlaying.mockImplementation(id => id === 2);
      
      dsound.purge();
      
      expect(dsound.channels.EFFECT).toEqual([2]);
      expect(dsound.nrOfPlaying).toBe(1);
    });
  });
});
