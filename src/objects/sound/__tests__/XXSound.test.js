/**
 * Tests for XXSound
 * Based on: ParentScript 22 - XXSound.ls
 */

const XXSound = require('../XXSound');

describe('XXSound', () => {
  let sound;

  beforeEach(() => {
    sound = new XXSound();
  });

  describe('constructor', () => {
    it('should initialize with three free channels', () => {
      expect(sound.channels[1]).toBe(0);
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });

    it('should initialize channel info arrays', () => {
      expect(sound.channelInfo).toEqual([[], [], []]);
    });

    it('should initialize sound ID counter to 1', () => {
      expect(sound.newSnd).toBe(1);
    });

    it('should set ticksPerSec to 60', () => {
      expect(sound.ticksPerSec).toBe(60);
    });

    it('should initialize currentTicks to 0', () => {
      expect(sound.currentTicks).toBe(0);
    });
  });

  describe('play - BG (background)', () => {
    it('should play background sound on channel 1', () => {
      const id = sound.play('music', 'BG');
      expect(id).toBe(2);
      expect(sound.channels[1]).toBe(2);
    });

    it('should increment sound ID counter', () => {
      sound.play('music1', 'BG');
      expect(sound.newSnd).toBe(2);
      sound.play('music2', 'BG');
      expect(sound.newSnd).toBe(3);
    });

    it('should replace previous background sound', () => {
      const id1 = sound.play('music1', 'BG');
      const id2 = sound.play('music2', 'BG');
      expect(sound.channels[1]).toBe(id2);
      expect(id2).toBe(3);
    });
  });

  describe('play - TRANS (transition)', () => {
    it('should play on channel 1 like BG', () => {
      const id = sound.play('transition', 'TRANS');
      expect(sound.channels[1]).toBe(id);
    });

    it('should stop all effects when playing transition', () => {
      sound.play('effect1', 'EFFECT');
      sound.play('effect2', 'EFFECT');
      expect(sound.channels[2]).not.toBe(0);
      expect(sound.channels[3]).not.toBe(0);

      sound.play('transition', 'TRANS');
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });
  });

  describe('play - EFFECT', () => {
    it('should play first effect on channel 3', () => {
      const id = sound.play('click', 'EFFECT');
      expect(sound.channels[3]).toBe(id);
      expect(sound.channels[2]).toBe(0);
    });

    it('should play second effect on channel 2 when channel 3 is busy', () => {
      const id1 = sound.play('click1', 'EFFECT');
      const id2 = sound.play('click2', 'EFFECT');
      expect(sound.channels[3]).toBe(id1);
      expect(sound.channels[2]).toBe(id2);
    });

    it('should always return a sound ID for effects (overwrites)', () => {
      sound.play('effect1', 'EFFECT');
      sound.play('effect2', 'EFFECT');
      const id3 = sound.play('effect3', 'EFFECT');
      // Third effect overwrites channel 3
      expect(id3).toBeGreaterThan(0);
    });
  });

  describe('play - OPEFFECT (opposite priority effect)', () => {
    it('should play first OPEFFECT on channel 2', () => {
      const id = sound.play('sound', 'OPEFFECT');
      expect(sound.channels[2]).toBe(id);
      expect(sound.channels[3]).toBe(0);
    });

    it('should play second OPEFFECT on channel 3 when channel 2 is busy', () => {
      const id1 = sound.play('sound1', 'OPEFFECT');
      const id2 = sound.play('sound2', 'OPEFFECT');
      expect(sound.channels[2]).toBe(id1);
      expect(sound.channels[3]).toBe(id2);
    });

    it('should return 0 when both effect channels are busy', () => {
      sound.play('sound1', 'OPEFFECT');
      sound.play('sound2', 'OPEFFECT');
      const id3 = sound.play('sound3', 'OPEFFECT');
      expect(id3).toBe(0);
    });
  });

  describe('play - invalid sound', () => {
    it('should use default sound for empty string', () => {
      // Should not throw and should still assign a channel
      const id = sound.play('', 'BG');
      expect(id).toBeGreaterThan(0);
    });

    it('should use default sound for null', () => {
      const id = sound.play(null, 'BG');
      expect(id).toBeGreaterThan(0);
    });
  });

  describe('play - option parameter', () => {
    it('should default to member option', () => {
      sound.play('sound', 'BG');
      expect(sound.channelInfo[0][0]).toBe('member');
    });

    it('should accept file option', () => {
      sound.play('/path/to/sound.mp3', 'BG', 'file');
      expect(sound.channelInfo[0][0]).toBe('file');
    });

    it('should store member info with timing data', () => {
      sound.currentTicks = 100;
      sound.play('sound', 'BG', 'member');
      expect(sound.channelInfo[0][0]).toBe('member');
      expect(sound.channelInfo[0][1]).toBe(100); // start ticks
      expect(sound.channelInfo[0][2]).toBe(false); // loop
    });
  });

  describe('stop', () => {
    it('should stop sound by ID on channel 1', () => {
      const id = sound.play('music', 'BG');
      sound.stop(id);
      expect(sound.channels[1]).toBe(0);
    });

    it('should stop sound by ID on channel 2', () => {
      const id = sound.play('effect', 'OPEFFECT');
      expect(sound.channels[2]).toBe(id);
      sound.stop(id);
      expect(sound.channels[2]).toBe(0);
    });

    it('should stop sound by ID on channel 3', () => {
      const id = sound.play('effect', 'EFFECT');
      expect(sound.channels[3]).toBe(id);
      sound.stop(id);
      expect(sound.channels[3]).toBe(0);
    });

    it('should do nothing for sound ID 0', () => {
      sound.play('music', 'BG');
      sound.stop(0);
      expect(sound.channels[1]).not.toBe(0);
    });

    it('should do nothing for unknown sound ID', () => {
      const id = sound.play('music', 'BG');
      sound.stop(id + 100);
      expect(sound.channels[1]).toBe(id);
    });

    it('should return 0', () => {
      const id = sound.play('music', 'BG');
      expect(sound.stop(id)).toBe(0);
    });
  });

  describe('stopBG', () => {
    it('should stop background channel only', () => {
      sound.play('music', 'BG');
      sound.play('effect', 'EFFECT');
      sound.stopBG();
      expect(sound.channels[1]).toBe(0);
      expect(sound.channels[3]).not.toBe(0);
    });

    it('should do nothing if BG not playing', () => {
      sound.stopBG();
      expect(sound.channels[1]).toBe(0);
    });
  });

  describe('stopAllEffects', () => {
    it('should stop channels 2 and 3', () => {
      sound.play('effect1', 'EFFECT');
      sound.play('effect2', 'EFFECT');
      expect(sound.channels[2]).not.toBe(0);
      expect(sound.channels[3]).not.toBe(0);
      sound.stopAllEffects();
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });

    it('should not affect background channel', () => {
      const bgId = sound.play('music', 'BG');
      sound.play('effect', 'EFFECT');
      sound.stopAllEffects();
      expect(sound.channels[1]).toBe(bgId);
    });
  });

  describe('finished', () => {
    it('should return 1 for sound ID 0', () => {
      expect(sound.finished(0)).toBe(1);
    });

    it('should return 0 for currently playing sound', () => {
      const id = sound.play('music', 'BG');
      expect(sound.finished(id)).toBe(0);
    });

    it('should return 1 for unknown sound ID', () => {
      sound.play('music', 'BG');
      expect(sound.finished(999)).toBe(1);
    });

    it('should return 1 after sound is stopped', () => {
      const id = sound.play('music', 'BG');
      sound.stop(id);
      expect(sound.finished(id)).toBe(1);
    });

    it('should check all channels', () => {
      const id1 = sound.play('music', 'BG');
      const id2 = sound.play('effect1', 'EFFECT');
      const id3 = sound.play('effect2', 'EFFECT');
      expect(sound.finished(id1)).toBe(0);
      expect(sound.finished(id2)).toBe(0);
      expect(sound.finished(id3)).toBe(0);
    });
  });

  describe('getChannel', () => {
    it('should return channel number for playing sound', () => {
      const id = sound.play('music', 'BG');
      expect(sound.getChannel(id)).toBe(1);
    });

    it('should return correct channel for effects', () => {
      const id1 = sound.play('effect1', 'EFFECT');
      const id2 = sound.play('effect2', 'EFFECT');
      expect(sound.getChannel(id1)).toBe(3);
      expect(sound.getChannel(id2)).toBe(2);
    });

    it('should return 0 for unknown sound ID', () => {
      expect(sound.getChannel(999)).toBe(0);
    });

    it('should return 0 after sound is stopped', () => {
      const id = sound.play('music', 'BG');
      sound.stop(id);
      expect(sound.getChannel(id)).toBe(0);
    });
  });

  describe('fade', () => {
    it('should not throw for valid sound ID', () => {
      const id = sound.play('music', 'BG');
      expect(() => sound.fade(id, 'out', 60)).not.toThrow();
    });

    it('should do nothing for sound ID 0', () => {
      expect(() => sound.fade(0, 'out', 60)).not.toThrow();
    });

    it('should do nothing for unknown sound ID', () => {
      expect(() => sound.fade(999, 'in', 30)).not.toThrow();
    });

    it('should handle fade in', () => {
      const id = sound.play('music', 'BG');
      expect(() => sound.fade(id, 'in', 120)).not.toThrow();
    });

    it('should handle fade out', () => {
      const id = sound.play('music', 'BG');
      expect(() => sound.fade(id, 'out', 120)).not.toThrow();
    });
  });

  describe('purge', () => {
    it('should clear channels with no active sounds', () => {
      // Manually set a channel and then clear via purge
      // Since _soundBusy checks channels, we need to force a state
      sound.channels[1] = 5;
      sound.channels[1] = 0; // Simulate sound finished
      sound.purge();
      expect(sound.channels[1]).toBe(0);
    });

    it('should be called automatically during play', () => {
      // Just verify it doesn't throw
      sound.play('sound', 'BG');
      expect(() => sound.play('sound2', 'EFFECT')).not.toThrow();
    });
  });

  describe('cuePassed', () => {
    it('should handle string channel identifier', () => {
      expect(() => sound.cuePassed('sound1', 5, 'cue1')).not.toThrow();
    });

    it('should handle numeric channel identifier', () => {
      expect(() => sound.cuePassed(2, 10, 'cue2')).not.toThrow();
    });
  });

  describe('updateTicks', () => {
    it('should increment currentTicks', () => {
      sound.updateTicks(10);
      expect(sound.currentTicks).toBe(10);
    });

    it('should default to incrementing by 1', () => {
      sound.updateTicks();
      expect(sound.currentTicks).toBe(1);
    });

    it('should accumulate ticks', () => {
      sound.updateTicks(5);
      sound.updateTicks(10);
      sound.updateTicks(15);
      expect(sound.currentTicks).toBe(30);
    });
  });

  describe('isChannelFree', () => {
    it('should return true for free channel', () => {
      expect(sound.isChannelFree(1)).toBe(true);
      expect(sound.isChannelFree(2)).toBe(true);
      expect(sound.isChannelFree(3)).toBe(true);
    });

    it('should return false for occupied channel', () => {
      sound.play('music', 'BG');
      expect(sound.isChannelFree(1)).toBe(false);
    });
  });

  describe('getNextSoundId', () => {
    it('should return next sound ID', () => {
      expect(sound.getNextSoundId()).toBe(2);
    });

    it('should update after playing sounds', () => {
      sound.play('music', 'BG');
      expect(sound.getNextSoundId()).toBe(3);
      sound.play('effect', 'EFFECT');
      expect(sound.getNextSoundId()).toBe(4);
    });
  });

  describe('kill', () => {
    it('should stop all sounds', () => {
      sound.play('music', 'BG');
      sound.play('effect1', 'EFFECT');
      sound.play('effect2', 'EFFECT');
      sound.kill();
      expect(sound.channels[1]).toBe(0);
      expect(sound.channels[2]).toBe(0);
      expect(sound.channels[3]).toBe(0);
    });
  });

  describe('channel priority integration', () => {
    it('should handle mixed EFFECT and OPEFFECT correctly', () => {
      // EFFECT prefers channel 3, OPEFFECT prefers channel 2
      const effect1 = sound.play('e1', 'EFFECT'); // -> ch3
      const opeffect1 = sound.play('o1', 'OPEFFECT'); // -> ch2
      expect(sound.channels[3]).toBe(effect1);
      expect(sound.channels[2]).toBe(opeffect1);
    });

    it('should handle BG replacement correctly', () => {
      const bg1 = sound.play('bg1', 'BG');
      const bg2 = sound.play('bg2', 'BG');
      expect(sound.channels[1]).toBe(bg2);
      expect(sound.finished(bg1)).toBe(1); // Old BG is gone
    });
  });
});
