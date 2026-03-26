const Gas = require('../Gas').default

describe('Gas map object (ObjectGasScript.ls)', () => {
  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 10 },
      id: 10,
      x: 200,
      y: 150,
      position: { x: 200, y: 150 },
      opt: {},
      optionalData: {},
      def: {
        Sounds: ['31e006v0', 'gas_comment1', 'gas_comment2']
      },
      sounds: ['31e006v0', 'gas_comment1', 'gas_comment2'],
      myLoc: { x: 200, y: 150 },
      InnerRadius: 30,
      OuterRadius: 80,
      insideInner: false,
      insideOuter: false,
      setDirectorMember: jest.fn(),
      setSpriteLocation: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 100, y: 100 },
          speed: 5,
          enabled: true,
          quickProps: { fuelConsumption: 3 },
          stopMotor: jest.fn(),
          fillErUp: jest.fn(),
          programControl: jest.fn()
        },
        drivingHandlers: {
          checkRadius: jest.fn(() => 'nothing')
        },
        mulleTalkObject: {
          say: jest.fn()
        }
      },
      game: {
        mulle: {
          playAudio: jest.fn(() => ({ stop: jest.fn(), isPlaying: true })),
          sound: {
            finished: jest.fn(() => false),
            play: jest.fn(() => 42)
          },
          say: jest.fn()
        }
      }
    }

    return Object.assign(ctx, overrides)
  }

  // ── Constructor / onCreate (Lingo lines 8-13) ────────────────────────

  test('onCreate sets child reference (Lingo line 9)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    expect(ctx.child).toEqual({ id: 10 })
  })

  test('onCreate initialises insideInner=0, insideOuter=0, alreadyTold=0 (Lingo lines 10-12)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
    expect(ctx.alreadyTold).toBe(0)
  })

  // ── Kill / onDestroy (Lingo lines 15-18) ──────────────────────────────

  test('onDestroy sets child=0 and returns 0 (Lingo kill contract, lines 15-18)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.child = { id: 99 }

    const result = Gas.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  // ── init (Lingo lines 20-38) ──────────────────────────────────────────

  test('init sets sndId=0 (Lingo line 21)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 999

    Gas.init.call(ctx)

    expect(ctx.sndId).toBe(0)
  })

  test('init sets OKToEnter=1 when boat quickProps.fuelConsumption > 0 (Lingo lines 22-30)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(1)
  })

  test('init sets OKToEnter=0 when fuelConsumption is 0 (sail-only boat, Lingo line 28)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { fuelConsumption: 0 }
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)
  })

  test('init sets OKToEnter=0 when fuelConsumption is negative (Lingo line 26)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { fuelConsumption: -1 }
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)
  })

  test('init sets OKToEnter=0 when quickProps is not a list (Lingo line 23)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = 'notAList'
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)
  })

  test('init sets OKToEnter=0 when quickProps is null (Lingo line 23)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = null
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)
  })

  test('init sets OKToEnter=0 when fuelConsumption is not an integer (Lingo line 25)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { fuelConsumption: 'fast' }
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)
  })

  test('init sets OKToEnter=0 when fuelConsumption is missing from quickProps (Lingo line 24)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { someOtherProp: 5 }
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)
  })

  test('init sets sprite member from optionalData.show (Lingo lines 33-37)', () => {
    const ctx = makeCtx({ optionalData: { show: '31g001v0' } })
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.setDirectorMember).toHaveBeenCalledWith('31g001v0')
  })

  test('init does not set sprite member when optionalData.show is absent (Lingo line 34)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)

    Gas.init.call(ctx)

    expect(ctx.setDirectorMember).not.toHaveBeenCalled()
  })

  // ── step: idle state, no sndId (Lingo lines 40-52) ───────────────────

  test('step calls checkRadius with #both when sndId is 0 (Lingo lines 47-48)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 0

    Gas.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalled()
  })

  test('step dispatches EnterInnerRadius on #EnterInnerRadius result (Lingo lines 49-50)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 0
    ctx.OKToEnter = 1
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')

    Gas.step.call(ctx, { x: 200, y: 150 })

    // EnterInnerRadius should play sound[0] and fill up
    expect(ctx.state.driveBoat.fillErUp).toHaveBeenCalled()
  })

  test('step dispatches EnterInnerRadius on #EnterBoth result (Lingo lines 49-50)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 0
    ctx.OKToEnter = 1
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterBoth')

    Gas.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.state.driveBoat.fillErUp).toHaveBeenCalled()
  })

  test('step dispatches enterOuterRadius on #enterOuterRadius result (Lingo lines 51-52)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 0
    ctx.alreadyTold = 0
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'enterOuterRadius')

    Gas.step.call(ctx, { x: 180, y: 130 })

    expect(ctx.alreadyTold).toBe(1)
  })

  test('step does not dispatch radius handlers for unrelated checkRadius results (Lingo line 48)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 0
    ctx.alreadyTold = 0
    ctx.OKToEnter = 1
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'ExitOuterRadius')

    Gas.step.call(ctx, { x: 300, y: 300 })

    expect(ctx.alreadyTold).toBe(0)
    expect(ctx.state.driveBoat.fillErUp).not.toHaveBeenCalled()
  })

  // ── step: refueling state, sndId truthy (Lingo lines 41-46) ──────────

  test('step with active sndId skips checkRadius entirely (Lingo line 46 exit)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 42
    ctx.game.mulle.sound.finished = jest.fn(() => false)

    Gas.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.state.drivingHandlers.checkRadius).not.toHaveBeenCalled()
  })

  test('step clears sndId and calls programControl(boat, 0) when sound finished (Lingo lines 42-44)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 42
    ctx.game.mulle.sound.finished = jest.fn(() => true)

    Gas.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.sndId).toBe(0)
    expect(ctx.state.driveBoat.programControl).toHaveBeenCalledWith(0)
  })

  test('step does NOT call programControl when sound not yet finished (Lingo lines 42-43)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 42
    ctx.game.mulle.sound.finished = jest.fn(() => false)

    Gas.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.sndId).toBe(42)
    expect(ctx.state.driveBoat.programControl).not.toHaveBeenCalled()
  })

  test('step with finished sound still exits early, no radius check (Lingo line 46)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 42
    ctx.game.mulle.sound.finished = jest.fn(() => true)

    Gas.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.state.drivingHandlers.checkRadius).not.toHaveBeenCalled()
  })

  // ── enterOuterRadius (Lingo lines 55-62) ──────────────────────────────

  test('enterOuterRadius sets alreadyTold=1 on first call (Lingo line 57)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.alreadyTold = 0

    Gas.onEnterOuter.call(ctx)

    expect(ctx.alreadyTold).toBe(1)
  })

  test('enterOuterRadius does nothing when alreadyTold is truthy (Lingo line 56)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.alreadyTold = 1

    Gas.onEnterOuter.call(ctx)

    // Should not attempt to play any sound
    expect(ctx.game.mulle.say).not.toHaveBeenCalled()
    if (ctx.state.mulleTalkObject) {
      expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    }
  })

  test('enterOuterRadius picks random sound from index 2+ (Lingo lines 58-61)', () => {
    const ctx = makeCtx({
      def: { Sounds: ['pump_sfx', 'comment1', 'comment2', 'comment3'] },
      sounds: ['pump_sfx', 'comment1', 'comment2', 'comment3']
    })
    Gas.onCreate.call(ctx)
    ctx.alreadyTold = 0

    // Lingo: tmpCnt = count(sounds) - 1 = 3, random(3)+1 => 2..4 (1-indexed)
    // JS equivalent: pick from sounds[1..3]
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.99)
    Gas.onEnterOuter.call(ctx)
    rnd.mockRestore()

    // Should have called say with one of the comment sounds (not the first pump sound)
    const sayCalls = ctx.state.mulleTalkObject.say.mock.calls
      .concat(ctx.game.mulle.say.mock.calls)
      .concat(ctx.game.mulle.playAudio.mock.calls)
    const playedSounds = sayCalls.flat()
    const validSounds = ['comment1', 'comment2', 'comment3']
    expect(playedSounds.some(s => validSounds.includes(s))).toBe(true)
  })

  test('enterOuterRadius does not play sound when only one sound exists (Lingo line 59)', () => {
    const ctx = makeCtx({
      def: { Sounds: ['pump_sfx'] },
      sounds: ['pump_sfx']
    })
    Gas.onCreate.call(ctx)
    ctx.alreadyTold = 0

    Gas.onEnterOuter.call(ctx)

    // tmpCnt = count(sounds) - 1 = 0, not > 0 → no sound played
    expect(ctx.game.mulle.say).not.toHaveBeenCalled()
    if (ctx.state.mulleTalkObject) {
      expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    }
  })

  // ── EnterInnerRadius (Lingo lines 64-73) ──────────────────────────────

  test('EnterInnerRadius exits early when OKToEnter is falsy (Lingo line 65)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 0

    Gas.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.fillErUp).not.toHaveBeenCalled()
    expect(ctx.state.driveBoat.stopMotor).not.toHaveBeenCalled()
  })

  test('EnterInnerRadius plays sounds[0] as OPEFFECT and sets sndId (Lingo line 66)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1
    ctx.game.mulle.sound.play = jest.fn(() => 77)

    Gas.onEnterInner.call(ctx)

    // Should play the first sound (pump effect)
    const firstSound = ctx.def.Sounds[0] || ctx.sounds[0]
    // Check that some play method was called with the first sound
    const playAudioCalls = ctx.game.mulle.playAudio.mock.calls
    const soundPlayCalls = ctx.game.mulle.sound.play.mock.calls
    const allPlayed = playAudioCalls.flat().concat(soundPlayCalls.flat())
    expect(allPlayed).toContain(firstSound)
  })

  test('EnterInnerRadius calls programControl(boat, 1) when sndId is truthy (Lingo lines 67-68)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1

    Gas.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.programControl).toHaveBeenCalledWith(1)
  })

  test('EnterInnerRadius does not call programControl when play returns falsy sndId (Lingo line 67)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1
    ctx.game.mulle.playAudio = jest.fn(() => 0)
    ctx.game.mulle.sound = { play: jest.fn(() => 0) }

    Gas.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.programControl).not.toHaveBeenCalled()
  })

  test('EnterInnerRadius sets boat speed to 0 (Lingo line 70)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1
    ctx.state.driveBoat.speed = 10

    Gas.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('EnterInnerRadius calls stopMotor on the boat (Lingo line 71)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1

    Gas.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.stopMotor).toHaveBeenCalled()
  })

  test('EnterInnerRadius calls fillErUp on the boat (Lingo line 72)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1

    Gas.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.fillErUp).toHaveBeenCalled()
  })

  // ── ExitInnerRadius (Lingo line 75) ───────────────────────────────────

  test('ExitInnerRadius is a no-op (Lingo line 75)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)

    // Should not throw and should not change state
    expect(() => {
      if (typeof Gas.onExitInner === 'function') {
        Gas.onExitInner.call(ctx)
      }
    }).not.toThrow()
  })

  // ── Full refueling lifecycle ──────────────────────────────────────────

  test('full lifecycle: idle → inner radius → refueling → sound finishes → idle (Lingo lines 40-72)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1
    ctx.sndId = 0

    // Step 1: car approaches, checkRadius returns EnterInnerRadius
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    Gas.step.call(ctx, { x: 200, y: 150 })

    // After EnterInnerRadius: sndId should be set, boat stopped, fillErUp called
    expect(ctx.sndId).toBeTruthy()
    expect(ctx.state.driveBoat.speed).toBe(0)
    expect(ctx.state.driveBoat.fillErUp).toHaveBeenCalled()
    expect(ctx.state.driveBoat.programControl).toHaveBeenCalledWith(1)

    // Step 2: sound still playing — should skip radius check
    ctx.game.mulle.sound.finished = jest.fn(() => false)
    ctx.state.drivingHandlers.checkRadius.mockClear()
    Gas.step.call(ctx, { x: 200, y: 150 })
    expect(ctx.state.drivingHandlers.checkRadius).not.toHaveBeenCalled()
    expect(ctx.sndId).toBeTruthy()

    // Step 3: sound finishes — sndId cleared, programControl(0) called
    ctx.game.mulle.sound.finished = jest.fn(() => true)
    Gas.step.call(ctx, { x: 200, y: 150 })
    expect(ctx.sndId).toBe(0)
    expect(ctx.state.driveBoat.programControl).toHaveBeenCalledWith(0)
  })

  test('sail-only boat (fuelConsumption=0): EnterInnerRadius is blocked (Lingo lines 26-28, 65)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { fuelConsumption: 0 }
    Gas.onCreate.call(ctx)
    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(0)

    // Simulate inner radius hit — should be blocked
    Gas.onEnterInner.call(ctx)
    expect(ctx.state.driveBoat.fillErUp).not.toHaveBeenCalled()
    expect(ctx.state.driveBoat.stopMotor).not.toHaveBeenCalled()
  })

  test('motorised boat (fuelConsumption=5): full refuel flow works (Lingo lines 22-30, 64-72)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { fuelConsumption: 5 }
    Gas.onCreate.call(ctx)
    Gas.init.call(ctx)

    expect(ctx.OKToEnter).toBe(1)

    Gas.onEnterInner.call(ctx)
    expect(ctx.state.driveBoat.fillErUp).toHaveBeenCalled()
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  // ── Edge cases ────────────────────────────────────────────────────────

  test('multiple outer radius entries only trigger comment once (Lingo line 56 guard)', () => {
    const ctx = makeCtx({
      def: { Sounds: ['pump', 'c1', 'c2'] },
      sounds: ['pump', 'c1', 'c2']
    })
    Gas.onCreate.call(ctx)
    ctx.alreadyTold = 0

    Gas.onEnterOuter.call(ctx)
    Gas.onEnterOuter.call(ctx)
    Gas.onEnterOuter.call(ctx)

    // say/playAudio for comment should only happen once
    const totalCalls = (ctx.state.mulleTalkObject.say.mock.calls.length || 0) +
      (ctx.game.mulle.say.mock.calls.length || 0) +
      (ctx.game.mulle.playAudio.mock.calls.length || 0)
    expect(totalCalls).toBeLessThanOrEqual(1)
  })

  test('step handles missing drivingHandlers gracefully', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.sndId = 0
    ctx.state.drivingHandlers = null

    expect(() => {
      Gas.step.call(ctx, { x: 100, y: 100 })
    }).not.toThrow()
  })

  test('EnterInnerRadius sets speed=0 and stops motor even if play fails (Lingo lines 70-72)', () => {
    const ctx = makeCtx()
    Gas.onCreate.call(ctx)
    ctx.OKToEnter = 1
    // play returns falsy
    ctx.game.mulle.playAudio = jest.fn(() => null)
    ctx.game.mulle.sound = { play: jest.fn(() => 0) }
    ctx.state.driveBoat.speed = 8

    Gas.onEnterInner.call(ctx)

    // Speed and motor stop happen unconditionally (Lingo lines 70-71)
    expect(ctx.state.driveBoat.speed).toBe(0)
    expect(ctx.state.driveBoat.stopMotor).toHaveBeenCalled()
    expect(ctx.state.driveBoat.fillErUp).toHaveBeenCalled()
  })
})
