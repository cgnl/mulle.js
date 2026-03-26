/**
 * @fileoverview Tests for Sound - Standard Lingo sound handler
 * Based on: ParentScript 143 - Sound.ls
 * 
 * Sound provides standard Lingo-based audio playback with:
 * - Channel-based sound management (3-5 channels)
 * - Background and effect sound types
 * - Preloading support
 * - Volume and fade control
 */

const Sound = require('../Sound');

describe('Sound', () => {
  let sound;

  afterEach(() => {
    if (sound) {
      sound.kill();
    }
  });

  describe('constructor / new', () => {
    /**
     * Lingo: on new me
     *   set mode to #normal
     *   set channels based on platform
     */
    test('should set mode to normal', () => {
      sound = new Sound();
      expect(sound.mode).toBe('normal');
    });

    test('should initialize newSnd counter to 1', () => {
      sound = new Sound();
      expect(sound.newSnd).toBe(1);
    });

    test('should initialize channels', () => {
      sound = new Sound();
      expect(sound.channels).toBeDefined();
      expect(Object.keys(sound.channels).length).toBeGreaterThanOrEqual(3);
    });

    test('should initialize channelInfo', () => {
      sound = new Sound();
      expect(sound.channelInfo).toBeDefined();
      expect(Array.isArray(sound.channelInfo)).toBe(true);
    });

    test('should set nrOfChannels', () => {
      sound = new Sound();
      expect(sound.nrOfChannels).toBeGreaterThanOrEqual(3);
    });

    test('should initialize empty preLoadedList', () => {
      sound = new Sound();
      expect(sound.preLoadedList).toEqual({});
    });
  });

  describe('kill', () => {
    /**
     * Lingo: on kill me
     *   stopAll(me)
     *   return 0
     */
    test('should stop all sounds', () => {
      sound = new Sound();
      sound.stopAll = jest.fn();
      sound.kill();
      expect(sound.stopAll).toHaveBeenCalled();
    });

    test('should return null', () => {
      sound = new Sound();
      const result = sound.kill();
      expect(result).toBeNull();
    });
  });

  describe('getFreeChannels', () => {
    /**
     * Lingo: on getFreeChannels me
     *   count channels with value 0
     */
    test('should return count of free channels', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 5, 3: 0 };
      expect(sound.getFreeChannels()).toBe(2);
    });

    test('should return 0 when all channels used', () => {
      sound = new Sound();
      sound.channels = { 1: 1, 2: 2, 3: 3 };
      expect(sound.getFreeChannels()).toBe(0);
    });

    test('should return all channels when none used', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 0, 3: 0 };
      expect(sound.getFreeChannels()).toBe(3);
    });
  });

  describe('getNrOfChannels', () => {
    /**
     * Lingo: on getNrOfChannels me
     *   return nrOfChannels
     */
    test('should return number of channels', () => {
      sound = new Sound();
      sound.nrOfChannels = 5;
      expect(sound.getNrOfChannels()).toBe(5);
    });
  });

  describe('preLoad', () => {
    /**
     * Lingo: on preLoad me, theFileName
     *   preloadMember(theFileName)
     *   add to preLoadedList with newSnd id
     */
    test('should increment newSnd counter', () => {
      sound = new Sound();
      const before = sound.newSnd;
      sound.preLoad('test');
      expect(sound.newSnd).toBe(before + 1);
    });

    test('should add to preLoadedList', () => {
      sound = new Sound();
      const id = sound.preLoad('explosion');
      expect(sound.preLoadedList[id]).toBeDefined();
      expect(sound.preLoadedList[id].name).toBe('explosion');
    });

    test('should return sound ID', () => {
      sound = new Sound();
      const id = sound.preLoad('test');
      expect(id).toBeGreaterThan(0);
    });

    test('should store default volume of 100', () => {
      sound = new Sound();
      const id = sound.preLoad('test');
      expect(sound.preLoadedList[id].Vol).toBe(100);
    });
  });

  describe('unLoad', () => {
    /**
     * Lingo: on unLoad me, sndId
     *   (empty in original)
     */
    test('should not throw', () => {
      sound = new Sound();
      expect(() => sound.unLoad(5)).not.toThrow();
    });
  });

  describe('unLoadAll', () => {
    /**
     * Lingo: on unLoadAll me
     *   stopAll(me)
     */
    test('should call stopAll', () => {
      sound = new Sound();
      sound.stopAll = jest.fn();
      sound.unLoadAll();
      expect(sound.stopAll).toHaveBeenCalled();
    });
  });

  describe('stopAll', () => {
    /**
     * Lingo: on stopAll me
     *   stopBG(me)
     *   stopAllEffects(me)
     *   reset volumes
     */
    test('should reset all channels to 0', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 6, 3: 7 };
      sound.stopAll();
      expect(sound.channels[1]).toBe(0);
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });
  });

  describe('setVol', () => {
    /**
     * Lingo: on setVol me, sndId, theVol
     *   update preLoadedList and active channel volume
     */
    test('should update volume in preLoadedList', () => {
      sound = new Sound();
      const id = sound.preLoad('test');
      sound.setVol(id, 50);
      expect(sound.preLoadedList[id].Vol).toBe(Math.floor(255 * 50 / 100));
    });

    test('should not throw for non-existent sound', () => {
      sound = new Sound();
      expect(() => sound.setVol(999, 50)).not.toThrow();
    });
  });

  describe('finished', () => {
    /**
     * Lingo: on finished me, sndId
     *   return 1 if not in channels, 0 if still playing
     */
    test('should return true for sndId 0', () => {
      sound = new Sound();
      expect(sound.finished(0)).toBe(true);
    });

    test('should return true if not in channels', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 0, 3: 0 };
      expect(sound.finished(10)).toBe(true);
    });

    test('should return false if in channels', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 0, 3: 0 };
      expect(sound.finished(5)).toBe(false);
    });
  });

  describe('getChannel', () => {
    /**
     * Lingo: on getChannel me, sndId
     *   find channel number for sndId
     */
    test('should return channel number for playing sound', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 42, 3: 0 };
      expect(sound.getChannel(42)).toBe(2);
    });

    test('should return 0 for non-playing sound', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 0, 3: 0 };
      expect(sound.getChannel(42)).toBe(0);
    });
  });

  describe('stop', () => {
    /**
     * Lingo: on stop me, sndId
     *   find and stop sound, clear channel
     */
    test('should clear channel when stopping', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 42, 3: 0 };
      sound.stop(42);
      expect(sound.channels[2]).toBe(0);
    });

    test('should do nothing for sndId 0', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 0, 3: 0 };
      sound.stop(0);
      expect(sound.channels[1]).toBe(5);
    });

    test('should return 0', () => {
      sound = new Sound();
      expect(sound.stop(5)).toBe(0);
    });
  });

  describe('stopBG', () => {
    /**
     * Lingo: on stopBG me
     *   stop channel 1 if playing
     */
    test('should clear channel 1', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 0, 3: 0 };
      sound.stopBG();
      expect(sound.channels[1]).toBe(0);
    });

    test('should do nothing if channel 1 empty', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 5, 3: 0 };
      sound.stopBG();
      expect(sound.channels[2]).toBe(5);
    });
  });

  describe('stopAllEffects', () => {
    /**
     * Lingo: on stopAllEffects me
     *   stop channels 2 to nrOfChannels
     */
    test('should clear all effect channels', () => {
      sound = new Sound();
      sound.nrOfChannels = 3;
      sound.channels = { 1: 5, 2: 6, 3: 7 };
      sound.stopAllEffects();
      expect(sound.channels[1]).toBe(5); // BG untouched
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });
  });

  describe('play', () => {
    /**
     * Lingo: on play me, soundMember, what, theOption
     *   play sound on appropriate channel
     */
    test('should play BG on channel 1', () => {
      sound = new Sound();
      const id = sound.play('test', 'BG');
      expect(sound.channels[1]).toBe(id);
    });

    test('should return sound ID', () => {
      sound = new Sound();
      const id = sound.play('test', 'EFFECT');
      expect(id).toBeGreaterThan(0);
    });

    test('should play EFFECT on first free channel', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 0, 3: 0 };
      const id = sound.play('test', 'EFFECT');
      // EFFECT plays from nrOfChannels down to 2, finding first free
      expect(Object.values(sound.channels)).toContain(id);
    });

    test('should play OPEFFECT on first free channel from 2', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 0, 3: 0 };
      const id = sound.play('test', 'OPEFFECT');
      expect(Object.values(sound.channels)).toContain(id);
    });

    test('should stop effects on TRANS', () => {
      sound = new Sound();
      sound.channels = { 1: 0, 2: 5, 3: 6 };
      sound.nrOfChannels = 3;
      sound.play('test', 'TRANS');
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });

    test('should use preloaded sound info', () => {
      sound = new Sound();
      const preloadId = sound.preLoad('cached');
      sound.preLoadedList[preloadId].Vol = 128;
      
      const playId = sound.play(preloadId, 'EFFECT');
      expect(playId).toBe(preloadId);
    });

    test('should return 0 for OPEFFECT when no channels free', () => {
      sound = new Sound();
      sound.nrOfChannels = 3;
      sound.channels = { 1: 1, 2: 2, 3: 3 };
      const id = sound.play('test', 'OPEFFECT');
      expect(id).toBe(0);
    });
  });

  describe('fade', () => {
    /**
     * Lingo: on fade me, sndId, inOut, theLength
     *   fade sound in or out
     */
    test('should not throw for fade in', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 0, 3: 0 };
      expect(() => sound.fade(5, 'in', 60)).not.toThrow();
    });

    test('should not throw for fade out', () => {
      sound = new Sound();
      sound.channels = { 1: 5, 2: 0, 3: 0 };
      expect(() => sound.fade(5, 'out', 60)).not.toThrow();
    });

    test('should do nothing for sndId 0', () => {
      sound = new Sound();
      expect(() => sound.fade(0, 'in', 60)).not.toThrow();
    });
  });

  describe('lowLevelPlay', () => {
    /**
     * Lingo: on lowLevelPlay me, ch, how, theName, argSndID, argVol
     *   actual playback on channel
     */
    test('should set channel to sound ID', () => {
      sound = new Sound();
      const id = sound.lowLevelPlay(2, 'member', 'test', null, null);
      expect(sound.channels[2]).toBe(id);
    });

    test('should use provided sound ID', () => {
      sound = new Sound();
      const id = sound.lowLevelPlay(2, 'member', 'test', 99, null);
      expect(id).toBe(99);
    });

    test('should generate new ID if not provided', () => {
      sound = new Sound();
      const before = sound.newSnd;
      const id = sound.lowLevelPlay(2, 'member', 'test', null, null);
      expect(id).toBe(before + 1);
    });

    test('should store channel info', () => {
      sound = new Sound();
      sound.lowLevelPlay(2, 'member', 'test', null, null);
      expect(sound.channelInfo[1]).toBeDefined(); // Index 1 = channel 2
    });
  });

  describe('purge', () => {
    /**
     * Lingo: on purge me
     *   clean up finished sounds from channels
     */
    test('should be callable', () => {
      sound = new Sound();
      expect(() => sound.purge()).not.toThrow();
    });
  });

  describe('cuePassed', () => {
    /**
     * Lingo: on CuePassed me, theChannel, theNumber, theName
     *   handle sound cue events
     */
    test('should not throw', () => {
      sound = new Sound();
      expect(() => sound.cuePassed(1, 1, 'test')).not.toThrow();
    });
  });
});
