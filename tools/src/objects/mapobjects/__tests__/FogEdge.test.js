const FogEdge = require('../FogEdge').default

describe('FogEdge map object (ObjectFogEdgeScript.ls)', () => {
  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 25 },
      id: 25,
      x: 320,
      y: 240,
      position: { x: 320, y: 240 },
      opt: {},
      optionalData: { Pic: 'FogPic01' },
      def: {},
      myLoc: { x: 320, y: 240 },
      SPOver: 10,
      SPUnder: 0,
      setDirectorMember: jest.fn(),
      setSpriteLocation: jest.fn(),
      spriteRect: { left: 100, top: 50, right: 540, bottom: 430 },
      state: {
        driveBoat: {
          position: { x: 200, y: 200 },
          speed: 5,
          quickProps: { Compass: 1 }
        },
        mulleTalkObject: {
          say: jest.fn()
        }
      },
      game: {
        mulle: {}
      }
    }

    return Object.assign(ctx, overrides)
  }

  // ── Constructor / onCreate (Lingo new + init) ─────────────────────────

  test('onCreate initialises insideInner=0, insideOuter=0, alreadyTold=0 (Lingo new lines 5-8)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
    expect(ctx.alreadyTold).toBe(0)
  })

  test('onCreate preserves child reference (Lingo new line 5)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    expect(ctx.child).toEqual({ id: 25 })
  })

  // ── init: compass check (Lingo lines 17-20) ──────────────────────────

  test('init sets gotCompass=1 when boat has Compass (Lingo line 18)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { Compass: 1 }
    FogEdge.onCreate.call(ctx)

    expect(ctx.gotCompass).toBe(1)
  })

  test('init sets gotCompass=0 when boat has no Compass (Lingo line 20)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { Compass: 0 }
    FogEdge.onCreate.call(ctx)

    expect(ctx.gotCompass).toBe(0)
  })

  test('init sets gotCompass=0 when quickProps is missing (Lingo line 17)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = null
    FogEdge.onCreate.call(ctx)

    expect(ctx.gotCompass).toBe(0)
  })

  test('init sets gotCompass=0 when Compass property is absent from quickProps', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { SomeOtherProp: 1 }
    FogEdge.onCreate.call(ctx)

    expect(ctx.gotCompass).toBe(0)
  })

  // ── init: Pic and sprite setup (Lingo lines 22-27) ────────────────────

  test('init reads Pic from optionalData (Lingo line 22)', () => {
    const ctx = makeCtx({ optionalData: { Pic: 'FogOverlay' } })
    FogEdge.onCreate.call(ctx)

    expect(ctx.Pic).toBe('FogOverlay')
  })

  test('init sets SP to SPOver (Lingo line 23)', () => {
    const ctx = makeCtx({ SPOver: 33 })
    FogEdge.onCreate.call(ctx)

    expect(ctx.SP).toBe(33)
  })

  test('init sets sprite loc to (320, 240) (Lingo line 25)', () => {
    const ctx = makeCtx({ SPOver: 10 })
    FogEdge.onCreate.call(ctx)

    expect(ctx.setSpriteLocation).toHaveBeenCalledWith(10, { x: 320, y: 240 })
  })

  test('init sets sprite member to Pic (Lingo line 26)', () => {
    const ctx = makeCtx({ optionalData: { Pic: 'FogPic01' } })
    FogEdge.onCreate.call(ctx)

    expect(ctx.setDirectorMember).toHaveBeenCalledWith('FogPic01')
  })

  test('init does not set sprite member when Pic is absent', () => {
    const ctx = makeCtx({ optionalData: {} })
    FogEdge.onCreate.call(ctx)

    expect(ctx.setDirectorMember).not.toHaveBeenCalled()
  })

  // ── Kill / onDestroy (Lingo lines 11-14) ──────────────────────────────

  test('onDestroy sets child=0 and returns 0 (Lingo kill contract, lines 11-14)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)
    ctx.child = { id: 99 }

    const result = FogEdge.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('onDestroy returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = FogEdge.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ── step: rectangular hit test (Lingo lines 30-45) ────────────────────

  test('step exits immediately when alreadyTold=1 (Lingo line 31)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)
    ctx.alreadyTold = 1

    FogEdge.step.call(ctx, { x: 300, y: 300 })

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  test('step plays compass voice line when inside rect and gotCompass (Lingo line 40)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { Compass: 1 }
    FogEdge.onCreate.call(ctx)

    // carLoc inside sprite rect
    FogEdge.step.call(ctx, { x: 300, y: 200 })

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('05d006v0', 4)
    expect(ctx.alreadyTold).toBe(1)
  })

  test('step plays no-compass voice line when inside rect and no compass (Lingo line 41)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { Compass: 0 }
    FogEdge.onCreate.call(ctx)

    FogEdge.step.call(ctx, { x: 300, y: 200 })

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('05d005v0', 4)
    expect(ctx.alreadyTold).toBe(1)
  })

  test('step does not trigger when carLoc is outside sprite rect (Lingo line 34)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    // carLoc outside rect (left=100, top=50, right=540, bottom=430)
    FogEdge.step.call(ctx, { x: 50, y: 200 })

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    expect(ctx.alreadyTold).toBe(0)
  })

  test('step does not trigger when carLoc is above rect', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    FogEdge.step.call(ctx, { x: 300, y: 10 })

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    expect(ctx.alreadyTold).toBe(0)
  })

  test('step does not trigger when carLoc is below rect', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    FogEdge.step.call(ctx, { x: 300, y: 500 })

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    expect(ctx.alreadyTold).toBe(0)
  })

  test('step does not trigger when carLoc is to the right of rect', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    FogEdge.step.call(ctx, { x: 600, y: 200 })

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    expect(ctx.alreadyTold).toBe(0)
  })

  test('step triggers exactly once even with multiple calls inside rect (Lingo line 43)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    FogEdge.step.call(ctx, { x: 300, y: 200 })
    FogEdge.step.call(ctx, { x: 350, y: 300 })
    FogEdge.step.call(ctx, { x: 400, y: 400 })

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)
    expect(ctx.alreadyTold).toBe(1)
  })

  test('step at exact rect boundary counts as inside (Lingo sprite rect inclusive)', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    // Exact boundary point
    FogEdge.step.call(ctx, { x: 100, y: 50 })

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)
    expect(ctx.alreadyTold).toBe(1)
  })

  // ── Edge cases ────────────────────────────────────────────────────────

  test('step handles missing carLoc gracefully', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)

    expect(() => {
      FogEdge.step.call(ctx)
    }).not.toThrow()
    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  test('step handles missing spriteRect gracefully', () => {
    const ctx = makeCtx()
    FogEdge.onCreate.call(ctx)
    ctx.spriteRect = null

    expect(() => {
      FogEdge.step.call(ctx, { x: 300, y: 200 })
    }).not.toThrow()
    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  test('step does no radius checks (Lingo: uses rect hit test, not checkRadius)', () => {
    const checkRadius = jest.fn()
    const ctx = makeCtx()
    ctx.state.drivingHandlers = { checkRadius }
    FogEdge.onCreate.call(ctx)

    FogEdge.step.call(ctx, { x: 300, y: 200 })

    expect(checkRadius).not.toHaveBeenCalled()
  })
})
