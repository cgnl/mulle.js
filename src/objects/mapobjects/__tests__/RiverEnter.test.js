const RiverEnter = require('../RiverEnter').default

describe('RiverEnter map object (ObjectRiverEnterScript.ls)', () => {
  /**
   * ObjectRiverEnterScript blocks boats whose RealDepth exceeds 8
   * from entering the river. Uses standard checkRadius with #both.
   *
   * Lingo properties: child, insideInner, insideOuter, lastCommentCounter,
   *   enterOK, enterLoc
   * Lingo handlers: new, kill, init, step, EnterInnerRadius
   */

  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 20 },
      id: 20,
      x: 150,
      y: 250,
      position: { x: 150, y: 250 },
      myLoc: { x: 150, y: 250 },
      opt: {},
      optionalData: {},
      def: {
        Sounds: ['river_blocked']
      },
      InnerRadius: 30,
      OuterRadius: 80,
      setDirectorMember: jest.fn(),
      setSpriteLocation: jest.fn(),
      state: {
        driveBoat: {
          loc: { x: 400, y: 400 },
          speed: 5,
          quickProps: { RealDepth: 3 },
          stepback: jest.fn((n) => {
            if (n === 2) return { x: 390, y: 390 }
            return { x: 400, y: 400 }
          })
        },
        mulleTalkObject: {
          say: jest.fn()
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

  // ─── 1. Constructor (`new me, theChild`) ─────────────────────────────

  test('onCreate initialises insideInner=0, insideOuter=0 (Lingo new lines 5-7)', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
  })

  test('onCreate sets lastCommentCounter=0 (Lingo new line 7)', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)

    expect(ctx.lastCommentCounter).toBe(0)
  })

  test('onCreate preserves child reference (Lingo new line 5)', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)

    expect(ctx.child).toEqual({ id: 20 })
  })

  // ─── 2. init: enterOK based on RealDepth vs 8 ───────────────────────

  test('init sets enterOK=1 when boat RealDepth <= 8', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 3 }
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  test('init sets enterOK=1 when boat RealDepth equals 8 exactly', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 8 }
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  test('init sets enterOK=0 when boat RealDepth > 8 (blocked)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(0)
  })

  test('init sets enterOK=1 when quickProps is missing', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = null
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  test('init sets enterOK=1 when RealDepth is not a number', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 'deep' }
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)
  })

  // ─── 3. Kill / onDestroy ─────────────────────────────────────────────

  test('onDestroy sets child=0 and returns 0 (Lingo kill contract)', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)
    ctx.child = { id: 99 }

    const result = RiverEnter.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('onDestroy returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = RiverEnter.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ─── 4. step: lastCommentCounter decrement ───────────────────────────

  test('step: decrements lastCommentCounter each step', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)
    ctx.lastCommentCounter = 50

    RiverEnter.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.lastCommentCounter).toBe(49)
  })

  test('step: does not decrement lastCommentCounter below 0', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)
    ctx.lastCommentCounter = 0

    RiverEnter.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.lastCommentCounter).toBe(0)
  })

  // ─── 5. step: checkRadius dispatch ───────────────────────────────────

  test('step calls checkRadius with #both', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)

    RiverEnter.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledWith(
      ctx,
      [100, 100],
      expect.any(Array),
      'both'
    )
  })

  test('step dispatches onEnterInner on EnterInnerRadius', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')

    RiverEnter.step.call(ctx, { x: 150, y: 250 })

    expect(ctx.insideInner).toBe(1)
  })

  test('step dispatches onEnterInner on EnterBoth', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterBoth')

    RiverEnter.step.call(ctx, { x: 150, y: 250 })

    expect(ctx.insideInner).toBe(1)
  })

  // ─── 6. step: blocking behavior (insideInner && !enterOK) ────────────

  test('step forces boat to enterLoc and speed=0 when insideInner and blocked', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)
    expect(ctx.enterOK).toBe(0)

    // Trigger enter inner
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })

    expect(ctx.enterLoc).toEqual({ x: 390, y: 390 })

    // Step again with boat at different position → forced back
    ctx.state.driveBoat.loc = { x: 300, y: 300 }
    ctx.state.driveBoat.speed = 10
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    RiverEnter.step.call(ctx, { x: 300, y: 300 })

    expect(ctx.state.driveBoat.loc).toEqual({ x: 390, y: 390 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('step does NOT force boat back when enterOK=1', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 3 }
    RiverEnter.onCreate.call(ctx)
    expect(ctx.enterOK).toBe(1)

    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })

    expect(ctx.state.driveBoat.speed).toBe(5)
  })

  // ─── 7. onEnterInner behavior ────────────────────────────────────────

  test('onEnterInner sets insideInner=1', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.insideInner).toBe(1)
  })

  test('onEnterInner says sound when blocked and lastCommentCounter=0', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)
    expect(ctx.enterOK).toBe(0)

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('river_blocked', 2)
  })

  test('onEnterInner does NOT say sound when lastCommentCounter > 0', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)
    ctx.lastCommentCounter = 50

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  test('onEnterInner calls stepback(2) and saves as enterLoc when blocked', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.stepback).toHaveBeenCalledWith(2)
    expect(ctx.enterLoc).toEqual({ x: 390, y: 390 })
  })

  test('onEnterInner sets speed=0 when blocked', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('onEnterInner sets lastCommentCounter to 100 when blocked', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.lastCommentCounter).toBe(100)
  })

  test('onEnterInner does NOT set enterLoc or speed when enterOK=1', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 3 }
    RiverEnter.onCreate.call(ctx)
    ctx.state.driveBoat.speed = 7

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.insideInner).toBe(1)
    expect(ctx.state.driveBoat.speed).toBe(7)
  })

  test('onEnterInner falls back to boat loc when stepback unavailable', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    ctx.state.driveBoat.stepback = undefined
    ctx.state.driveBoat.loc = { x: 100, y: 100 }
    RiverEnter.onCreate.call(ctx)

    RiverEnter.onEnterInner.call(ctx)

    expect(ctx.enterLoc).toEqual({ x: 100, y: 100 })
  })

  // ─── 8. Edge cases ──────────────────────────────────────────────────

  test('step handles missing drivingHandlers gracefully', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)
    ctx.state.drivingHandlers = null

    expect(() => {
      RiverEnter.step.call(ctx, { x: 100, y: 100 })
    }).not.toThrow()
  })

  test('step handles missing carLoc gracefully', () => {
    const ctx = makeCtx()
    RiverEnter.onCreate.call(ctx)

    expect(() => {
      RiverEnter.step.call(ctx)
    }).not.toThrow()
  })

  test('onEnterInner handles missing boat gracefully', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)
    ctx.state.driveBoat = null

    expect(() => {
      RiverEnter.onEnterInner.call(ctx)
    }).not.toThrow()
  })

  // ─── 9. Full lifecycle tests ──────────────────────────────────────────

  test('full lifecycle: shallow boat passes through river enter freely', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 5 }
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(1)

    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })

    expect(ctx.state.driveBoat.speed).toBe(5)
  })

  test('full lifecycle: deep boat is blocked and pushed back repeatedly', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 12 }
    RiverEnter.onCreate.call(ctx)

    expect(ctx.enterOK).toBe(0)

    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })

    expect(ctx.enterLoc).toEqual({ x: 390, y: 390 })
    expect(ctx.state.driveBoat.speed).toBe(0)

    // Boat tries to advance again
    ctx.state.driveBoat.loc = { x: 200, y: 200 }
    ctx.state.driveBoat.speed = 5
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    RiverEnter.step.call(ctx, { x: 200, y: 200 })

    expect(ctx.state.driveBoat.loc).toEqual({ x: 390, y: 390 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('full lifecycle: cooldown prevents repeated sounds during 100-step window', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)

    // First enter
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)

    // Re-enter immediately (counter still high)
    ctx.insideInner = 0
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1) // no new sound
  })

  test('full lifecycle: sound plays again after cooldown expires', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { RealDepth: 10 }
    RiverEnter.onCreate.call(ctx)

    // First enter
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)

    // Run 100 steps to expire cooldown
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')
    for (let i = 0; i < 100; i++) {
      RiverEnter.step.call(ctx, { x: 999, y: 999 })
    }
    expect(ctx.lastCommentCounter).toBe(0)

    // Re-enter
    ctx.insideInner = 0
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    RiverEnter.step.call(ctx, { x: 150, y: 250 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(2)
  })
})
