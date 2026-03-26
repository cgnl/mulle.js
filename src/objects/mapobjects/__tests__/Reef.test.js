const Reef = require('../Reef').default

describe('Reef map object (ObjectReefScript.ls)', () => {
  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 15 },
      id: 15,
      x: 200,
      y: 150,
      position: { x: 200, y: 150 },
      opt: {},
      optionalData: {},
      def: {},
      myLoc: { x: 200, y: 150 },
      InnerRadius: 30,
      OuterRadius: 80,
      setDirectorMember: jest.fn(),
      setSpriteLocation: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 100, y: 100 },
          speed: 5,
          quickProps: { RealDepth: 3 },
          loc: { x: 100, y: 100 },
          stepback: jest.fn((n) => {
            if (n === 2) return { x: 98, y: 98 }
            return { x: 100, y: 100 }
          })
        },
        drivingHandlers: {
          checkRadius: jest.fn(() => 'nothing')
        }
      },
      game: {
        mulle: {}
      }
    }

    return Object.assign(ctx, overrides)
  }

  // ── Constructor / onCreate (Lingo new + init) ─────────────────────────

  test('onCreate initialises insideInner=0, insideOuter=0 (Lingo new lines 5-7)', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
  })

  test('onCreate preserves child reference (Lingo new line 5)', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)

    expect(ctx.child).toEqual({ id: 15 })
  })

  // ── init: OKDepth from optionalData (Lingo lines 16-17) ──────────────

  test('init reads OKDepth from optionalData.depth (Lingo line 16)', () => {
    const ctx = makeCtx({ optionalData: { depth: 6 } })
    Reef.onCreate.call(ctx)

    expect(ctx.OKDepth).toBe(6)
  })

  test('init defaults OKDepth to 4 when optionalData.depth is absent (Lingo line 17)', () => {
    const ctx = makeCtx({ optionalData: {} })
    Reef.onCreate.call(ctx)

    expect(ctx.OKDepth).toBe(4)
  })

  test('init defaults OKDepth to 4 when optionalData is undefined', () => {
    const ctx = makeCtx({ optionalData: undefined })
    Reef.onCreate.call(ctx)

    expect(ctx.OKDepth).toBe(4)
  })

  // ── init: enterOK based on RealDepth vs OKDepth (Lingo lines 19-27) ──

  test('init sets enterOK=1 when boat RealDepth <= OKDepth (Lingo line 24)', () => {
    const ctx = makeCtx({ optionalData: { depth: 5 } })
    ctx.state.driveBoat.quickProps = { RealDepth: 3 }
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  test('init sets enterOK=1 when boat RealDepth equals OKDepth exactly (Lingo line 22)', () => {
    const ctx = makeCtx({ optionalData: { depth: 4 } })
    ctx.state.driveBoat.quickProps = { RealDepth: 4 }
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  test('init sets enterOK=0 when boat RealDepth > OKDepth (blocked, Lingo line 21)', () => {
    const ctx = makeCtx({ optionalData: { depth: 3 } })
    ctx.state.driveBoat.quickProps = { RealDepth: 5 }
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(0)
  })

  test('init sets enterOK=1 when quickProps is missing (no depth info, Lingo line 19)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = null
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  test('init sets enterOK=1 when RealDepth is not a number (Lingo line 20)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 'deep' }
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  // ── Kill / onDestroy (Lingo lines 10-13) ──────────────────────────────

  test('onDestroy sets child=0 and returns 0 (Lingo kill contract, lines 10-13)', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)
    ctx.child = { id: 99 }

    const result = Reef.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('onDestroy returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = Reef.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ── step: checkRadius dispatch (Lingo lines 31-38) ────────────────────

  test('step calls checkRadius with #both (Lingo line 33)', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)

    Reef.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledWith(
      ctx,
      [100, 100],
      expect.any(Array),
      'both'
    )
  })

  test('step dispatches onEnterInner on EnterInnerRadius (Lingo line 35)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    ctx.optionalData = { depth: 3 }
    Reef.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')

    Reef.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.insideInner).toBe(1)
  })

  test('step dispatches onEnterInner on EnterBoth (Lingo line 35)', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterBoth')

    Reef.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.insideInner).toBe(1)
  })

  // ── step: blocking behavior when insideInner && !enterOK (Lingo lines 39-44) ──

  test('step forces boat to enterLoc and speed=0 when insideInner and blocked (Lingo lines 39-44)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 8 }
    ctx.optionalData = { depth: 3 }
    Reef.onCreate.call(ctx)
    expect(ctx.enterOK).toBe(0)

    // Trigger enter inner
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    Reef.step.call(ctx, { x: 200, y: 150 })

    // enterLoc should be set from stepback
    expect(ctx.enterLoc).toEqual({ x: 98, y: 98 })

    // Now step again with boat at different position → forced back
    ctx.state.driveBoat.position = { x: 300, y: 300 }
    ctx.state.driveBoat.speed = 10
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Reef.step.call(ctx, { x: 300, y: 300 })

    expect(ctx.state.driveBoat.position).toEqual({ x: 98, y: 98 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('step does NOT force boat back when enterOK=1 (Lingo line 39 guard)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 2 }
    ctx.optionalData = { depth: 5 }
    Reef.onCreate.call(ctx)
    expect(ctx.enterOK).toBe(1)

    // Trigger enter inner
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    Reef.step.call(ctx, { x: 200, y: 150 })

    // Boat should not be blocked
    expect(ctx.state.driveBoat.speed).toBe(5)
    expect(ctx.state.driveBoat.position).toEqual({ x: 100, y: 100 })
  })

  // ── onEnterInner (Lingo lines 47-56) ──────────────────────────────────

  test('onEnterInner sets insideInner=1 (Lingo line 48)', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)

    Reef.onEnterInner.call(ctx)

    expect(ctx.insideInner).toBe(1)
  })

  test('onEnterInner computes stepback and saves as enterLoc when blocked (Lingo lines 50-54)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    ctx.optionalData = { depth: 3 }
    Reef.onCreate.call(ctx)

    Reef.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.stepback).toHaveBeenCalledWith(2)
    expect(ctx.enterLoc).toEqual({ x: 98, y: 98 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('onEnterInner falls back to boat position when stepback is not available (Lingo line 52)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    ctx.state.driveBoat.stepback = undefined
    ctx.optionalData = { depth: 3 }
    Reef.onCreate.call(ctx)

    Reef.onEnterInner.call(ctx)

    expect(ctx.enterLoc).toEqual({ x: 100, y: 100 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('onEnterInner does NOT set enterLoc or speed when enterOK=1 (Lingo line 49 guard)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 2 }
    ctx.optionalData = { depth: 5 }
    Reef.onCreate.call(ctx)
    ctx.state.driveBoat.speed = 7

    Reef.onEnterInner.call(ctx)

    expect(ctx.insideInner).toBe(1)
    expect(ctx.state.driveBoat.speed).toBe(7)
  })

  // ── Edge cases ────────────────────────────────────────────────────────

  test('step handles missing drivingHandlers gracefully', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)
    ctx.state.drivingHandlers = null

    expect(() => {
      Reef.step.call(ctx, { x: 100, y: 100 })
    }).not.toThrow()
  })

  test('step handles missing carLoc gracefully', () => {
    const ctx = makeCtx()
    Reef.onCreate.call(ctx)

    expect(() => {
      Reef.step.call(ctx)
    }).not.toThrow()
  })

  test('onEnterInner handles missing boat gracefully', () => {
    const ctx = makeCtx()
    ctx.optionalData = { depth: 2 }
    ctx.state.driveBoat.quickProps = { RealDepth: 5 }
    Reef.onCreate.call(ctx)
    ctx.state.driveBoat = null

    expect(() => {
      Reef.onEnterInner.call(ctx)
    }).not.toThrow()
  })

  test('full lifecycle: shallow boat passes through reef freely', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 2 }
    ctx.optionalData = { depth: 4 }
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)

    // Enter inner radius
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    Reef.step.call(ctx, { x: 200, y: 150 })

    // Boat should not be pushed back
    expect(ctx.state.driveBoat.speed).toBe(5)
    expect(ctx.state.driveBoat.position).toEqual({ x: 100, y: 100 })
  })

  test('full lifecycle: deep boat is blocked and pushed back repeatedly', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 8 }
    ctx.optionalData = { depth: 3 }
    Reef.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(0)

    // Enter inner radius
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    Reef.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.enterLoc).toEqual({ x: 98, y: 98 })
    expect(ctx.state.driveBoat.speed).toBe(0)

    // Boat tries to advance again
    ctx.state.driveBoat.position = { x: 200, y: 200 }
    ctx.state.driveBoat.speed = 5
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Reef.step.call(ctx, { x: 200, y: 200 })

    // Forced back again
    expect(ctx.state.driveBoat.position).toEqual({ x: 98, y: 98 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })
})
