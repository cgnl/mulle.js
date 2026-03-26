const Ferry = require('../Ferry').default

describe('Ferry map object (ObjectFerryScript.ls)', () => {
  function makeCtx (overrides = {}) {
    const ctx = {
      x: 100,
      y: 100,
      position: { x: 100, y: 100 },
      opt: {},
      optionalData: {},
      def: {
        FrameList: { normal: ['31b015v0'] },
        Sounds: ['deny', 'board', 'ride'],
        CheckFor: { UserStuff: ['#FerryTicket'] }
      },
      setDirectorMember: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 100, y: 100 },
          direction: 1,
          enabled: true
        }
      },
      game: {
        mulle: {
          playAudio: jest.fn(() => ({ stop: jest.fn() })),
          user: {
            getUserProp: jest.fn(() => '#HasProp')
          }
        }
      },
      InnerRadius: 35,
      sounds: ['deny', 'board', 'ride']
    }

    return Object.assign(ctx, overrides)
  }

  test('onCreate handles missing EndLoc without throwing', () => {
    const ctx = makeCtx({ optionalData: {} })

    expect(() => Ferry.onCreate.call(ctx)).not.toThrow()
    expect(ctx.endLocs[0]).toEqual({ x: 100, y: 100 })
    expect(ctx.endLocs[1]).toEqual({ x: 0, y: 0 })
    expect(typeof ctx.maxCounter).toBe('number')
    expect(ctx.maxCounter).toBeGreaterThan(0)
  })

  test('onCreate random Back=1 sets atStart=-1 and endLoc=endLocs[1]', () => {
    const ctx = makeCtx({ optionalData: { EndLoc: { x: 140, y: 100 } } })
    const rnd = jest.spyOn(Math, 'random')
      .mockReturnValueOnce(0.5) // counter
      .mockReturnValueOnce(0.95) // Back -> 1

    Ferry.onCreate.call(ctx)
    rnd.mockRestore()

    expect(ctx.Back).toBe(1)
    expect(ctx.atStart).toBe(-1)
    expect(ctx.endLoc).toEqual(ctx.endLocs[1])
  })

  test('step does not midpoint-flip on odd maxCounter', () => {
    const ctx = makeCtx({ optionalData: { EndLoc: { x: 140, y: 100 } } })
    Ferry.onCreate.call(ctx)
    ctx.maxCounter = 5
    ctx.counter = 2 // half would be 2.5 -> should not flip in Lingo exact check
    ctx.waitCounter = 0
    ctx.Back = 1
    ctx.atStart = 1
    ctx.endLoc = ctx.endLocs[0]

    Ferry.step.call(ctx, { x: 300, y: 300 })

    expect(ctx.atStart).toBe(1)
    expect(ctx.endLoc).toEqual(ctx.endLocs[0])
  })

  test('step reverses at endpoint and starts 15-tick dock wait', () => {
    const ctx = makeCtx({ optionalData: { EndLoc: { x: 140, y: 100 } } })
    Ferry.onCreate.call(ctx)

    ctx.counter = ctx.maxCounter + 1
    Ferry.step.call(ctx, { x: 400, y: 400 })

    expect(ctx.counter).toBe(ctx.maxCounter)
    // Lingo decrements waitCounter in same step tick after setting to 15
    expect(ctx.waitCounter).toBe(14)
    expect(ctx.Back).toBe(-1)
  })

  test('step near dock starts boarding and completes after 10 ticks', () => {
    const boat = { position: { x: 100, y: 100 }, direction: 1, enabled: true }
    const ctx = makeCtx({
      optionalData: { EndLoc: { x: 140, y: 100 } },
      state: { driveBoat: boat }
    })
    Ferry.onCreate.call(ctx)

    // Ensure proximity check is deterministic for this test
    ctx.myLoc = { x: 100 * ctx.decimalPrec, y: 100 * ctx.decimalPrec }

    // Force dock wait branch and near-car detection
    ctx.counter = ctx.maxCounter + 1
    Ferry.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.carLeaving).toBe(-1)
    expect(ctx.carOnBoard).toBe(1)

    for (let i = 0; i < 11; i++) {
      Ferry.carBoarding.call(ctx)
    }

    expect(ctx.carLeaving).toBe(0)
    expect(ctx.carOnBoard).toBe(1)
    // Lingo lines 170-171: board + ride sounds
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledWith('board')
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledWith('ride')
    expect(boat.enabled).toBe(false)
  })

  test('carBoardInit sets boat direction toward endLoc (Lingo line 152)', () => {
    const boat = { position: { x: 90, y: 90 }, direction: 1, enabled: true }
    const ctx = makeCtx({
      optionalData: { EndLoc: { x: 140, y: 100 } },
      state: { driveBoat: boat }
    })
    Ferry.onCreate.call(ctx)

    ctx.endLoc = { x: 140, y: 100 }
    Ferry.carBoardInit.call(ctx, -1)

    expect(boat.direction).not.toBe(1)
  })

  test('uses drivingHandlers.calcDirection when available', () => {
    const calcDirection = jest.fn()
      .mockReturnValueOnce(12)
      .mockReturnValueOnce(4)
      .mockReturnValueOnce(9)
    const boat = { position: { x: 90, y: 90 }, direction: 1, enabled: true }
    const ctx = makeCtx({
      optionalData: { EndLoc: { x: 140, y: 100 } },
      state: {
        driveBoat: boat,
        drivingHandlers: { calcDirection }
      }
    })

    Ferry.onCreate.call(ctx)
    expect(ctx.myDirections).toEqual([12, 4])

    ctx.endLoc = { x: 140, y: 100 }
    Ferry.carBoardInit.call(ctx, -1)
    expect(boat.direction).toBe(9)
  })

  test('carBoarding leave path stops ride sound and enables boat (Lingo lines 165-168)', () => {
    const stop = jest.fn()
    const boat = {
      position: { x: 100, y: 100 },
      direction: 1,
      enabled: false,
      programControl: jest.fn()
    }
    const ctx = makeCtx({
      optionalData: { EndLoc: { x: 140, y: 100 } },
      state: { driveBoat: boat }
    })
    Ferry.onCreate.call(ctx)
    ctx.sndId = { stop }

    Ferry.carBoardInit.call(ctx, 1)
    for (let i = 0; i < 11; i++) {
      Ferry.carBoarding.call(ctx)
    }

    expect(stop).toHaveBeenCalled()
    expect(boat.enabled).toBe(true)
    expect(boat.programControl).toHaveBeenCalledWith(0)
    expect(ctx.carOnBoard).toBe(0)
  })

  test('carBoarding board path calls programControl(1, #NoCheck) equivalent', () => {
    const boat = {
      position: { x: 100, y: 100 },
      direction: 1,
      enabled: true,
      programControl: jest.fn()
    }
    const ctx = makeCtx({
      optionalData: { EndLoc: { x: 140, y: 100 } },
      state: { driveBoat: boat }
    })
    Ferry.onCreate.call(ctx)

    Ferry.carBoardInit.call(ctx, -1)
    for (let i = 0; i < 11; i++) {
      Ferry.carBoarding.call(ctx)
    }

    expect(boat.programControl).toHaveBeenCalledWith(1, 'NoCheck')
  })

  test('onCreate sets active false when ticket prop missing (Lingo lines 52-57)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.user.getUserProp = jest.fn(() => '#NoProp')

    Ferry.onCreate.call(ctx)

    expect(ctx.active).toBe(false)
  })

  test('carClose inactive plays denied sound once until reset', () => {
    const ctx = makeCtx({
      active: false,
      myLoc: { x: 10000, y: 10000 },
      decimalPrec: 100,
      InnerRadius: 35
    })

    const first = Ferry.carClose.call(ctx, { x: 100, y: 100 })
    const second = Ferry.carClose.call(ctx, { x: 100, y: 100 })

    expect(first).toBe(0)
    expect(second).toBe(0)
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(1)

    ctx._deniedSoundPlaying = false
    Ferry.carClose.call(ctx, { x: 100, y: 100 })
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(2)
  })

  test('carClose inactive replays denied sound when previous sound finished (Lingo line 132)', () => {
    const ctx = makeCtx({
      active: false,
      myLoc: { x: 10000, y: 10000 },
      decimalPrec: 100,
      InnerRadius: 35,
      _deniedSoundPlaying: true,
      sndId: { isPlaying: false }
    })

    Ferry.carClose.call(ctx, { x: 100, y: 100 })

    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(1)
  })

  test('carClose inactive checks sound.finished(sndId) when available', () => {
    const finished = jest.fn(() => true)
    const ctx = makeCtx({
      active: false,
      myLoc: { x: 10000, y: 10000 },
      decimalPrec: 100,
      InnerRadius: 35,
      _deniedSoundPlaying: true,
      sndId: { token: 1 },
      game: {
        mulle: {
          playAudio: jest.fn(() => ({ token: 2 })),
          sound: { finished }
        }
      }
    })
    const prevSnd = ctx.sndId

    Ferry.carClose.call(ctx, { x: 100, y: 100 })

    expect(finished).toHaveBeenCalledWith(prevSnd)
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(1)
  })

  test('onDestroy resets sound state and returns 0 (Lingo kill contract)', () => {
    const ctx = makeCtx()
    ctx._deniedSoundPlaying = true
    ctx.sndId = { stop: jest.fn() }
    ctx.child = { id: 1 }

    const result = Ferry.onDestroy.call(ctx)

    expect(ctx._deniedSoundPlaying).toBe(false)
    expect(ctx.sndId).toBe(0)
    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })
})
