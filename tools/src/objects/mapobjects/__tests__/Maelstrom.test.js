const Maelstrom = require('../Maelstrom').default

describe('Maelstrom map object (ObjectMaelstromScript.ls)', () => {
  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 20 },
      id: 20,
      x: 300,
      y: 250,
      position: { x: 300, y: 250 },
      opt: {},
      optionalData: {},
      def: {},
      myLoc: { x: 300, y: 250 },
      InnerRadius: 20,
      OuterRadius: 80,
      SPUnder: 12,
      SPOver: 0,
      setDirectorMember: jest.fn(),
      setSpriteLocation: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 350, y: 250 },
          speed: 5,
          setShowCoordinate: jest.fn(),
          getShowCoordinate: jest.fn(() => ({ x: 350, y: 250 }))
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
    Maelstrom.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
  })

  test('onCreate preserves child reference (Lingo new line 5)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)

    expect(ctx.child).toEqual({ id: 20 })
  })

  // ── init (Lingo lines 15-22) ──────────────────────────────────────────

  test('init reads sound from optionalData (Lingo line 16)', () => {
    const ctx = makeCtx({ optionalData: { sound: 'maelstrom_sfx' } })
    Maelstrom.onCreate.call(ctx)

    expect(ctx.sound).toBe('maelstrom_sfx')
  })

  test('init sets SP to SPUnder (Lingo line 18)', () => {
    const ctx = makeCtx({ SPUnder: 42 })
    Maelstrom.onCreate.call(ctx)

    expect(ctx.SP).toBe(42)
  })

  test('init sets sprite member to MaelstromPic (Lingo line 19)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)

    expect(ctx.setDirectorMember).toHaveBeenCalledWith('MaelstromPic')
  })

  test('init sets sprite loc to myLoc (Lingo line 20)', () => {
    const ctx = makeCtx({ SPUnder: 12 })
    Maelstrom.onCreate.call(ctx)

    expect(ctx.setSpriteLocation).toHaveBeenCalledWith(12, { x: 300, y: 250 })
  })

  test('init does not call setSpriteLocation when SP is 0', () => {
    const ctx = makeCtx({ SPUnder: 0 })
    Maelstrom.onCreate.call(ctx)

    expect(ctx.setSpriteLocation).not.toHaveBeenCalled()
  })

  // ── Kill / onDestroy (Lingo lines 10-13) ──────────────────────────────

  test('onDestroy sets child=0 and returns 0 (Lingo kill contract, lines 10-13)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.child = { id: 99 }

    const result = Maelstrom.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('onDestroy returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = Maelstrom.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ── step: checkRadius dispatch (Lingo lines 25-32) ────────────────────

  test('step calls checkRadius with #both (Lingo line 27)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)

    Maelstrom.step.call(ctx, { x: 350, y: 250 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledWith(
      ctx,
      [350, 250],
      expect.any(Array),
      'both'
    )
  })

  test('step sets insideOuter=1 on EnterBoth (Lingo line 29)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterBoth')

    Maelstrom.step.call(ctx, { x: 350, y: 250 })

    expect(ctx.insideOuter).toBe(1)
  })

  test('step sets insideOuter=1 on enterOuterRadius (Lingo line 29)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'enterOuterRadius')

    Maelstrom.step.call(ctx, { x: 350, y: 250 })

    expect(ctx.insideOuter).toBe(1)
  })

  test('step sets insideOuter=0 on ExitOuterRadius (Lingo line 31)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.insideOuter = 1
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'ExitOuterRadius')

    Maelstrom.step.call(ctx, { x: 500, y: 500 })

    expect(ctx.insideOuter).toBe(0)
  })

  // ── step: rotation effect (Lingo lines 33-44) ─────────────────────────

  test('step applies 2D rotation using setShowCoordinate when insideOuter (Lingo lines 35-43)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.insideOuter = 1

    // Boat at (350, 250), maelstrom at (300, 250) → X=50, Y=0, distance=50
    Maelstrom.step.call(ctx, { x: 350, y: 250 })

    expect(ctx.state.driveBoat.setShowCoordinate).toHaveBeenCalled()
    const arg = ctx.state.driveBoat.setShowCoordinate.mock.calls[0][0]
    // angle = 2.0/50 = 0.04, cos(0.04) ≈ 0.9992, sin(0.04) ≈ 0.03999
    // newX = 0*sin(0.04) + 50*cos(0.04) ≈ 49.96
    // newY = 0*cos(0.04) - 50*sin(0.04) ≈ -2.0
    // result: (300 + 49.96, 250 + (-2.0)) ≈ (349.96, 248.0)
    expect(arg.x).toBeCloseTo(300 + 50 * Math.cos(0.04), 2)
    expect(arg.y).toBeCloseTo(250 - 50 * Math.sin(0.04), 2)
  })

  test('step does not rotate when insideOuter=0 (Lingo line 33 guard)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.insideOuter = 0

    Maelstrom.step.call(ctx, { x: 350, y: 250 })

    expect(ctx.state.driveBoat.setShowCoordinate).not.toHaveBeenCalled()
  })

  test('step exits without rotating when distance is exactly 0 (Lingo line 38)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.insideOuter = 1

    // Boat right on top of maelstrom center
    Maelstrom.step.call(ctx, { x: 300, y: 250 })

    expect(ctx.state.driveBoat.setShowCoordinate).not.toHaveBeenCalled()
  })

  test('step rotation is stronger at closer distances (angle = 2.0/distance, Lingo line 39)', () => {
    // Test at distance=50
    const ctx1 = makeCtx()
    Maelstrom.onCreate.call(ctx1)
    ctx1.insideOuter = 1
    Maelstrom.step.call(ctx1, { x: 350, y: 250 })
    const pos1 = ctx1.state.driveBoat.setShowCoordinate.mock.calls[0][0]

    // Test at distance=25 (closer)
    const ctx2 = makeCtx()
    Maelstrom.onCreate.call(ctx2)
    ctx2.insideOuter = 1
    Maelstrom.step.call(ctx2, { x: 325, y: 250 })
    const pos2 = ctx2.state.driveBoat.setShowCoordinate.mock.calls[0][0]

    // At distance=50: angle=0.04, Y-offset from center ≈ -50*sin(0.04) ≈ -2.0
    // At distance=25: angle=0.08, Y-offset from center ≈ -25*sin(0.08) ≈ -2.0
    // The Y-offset relative to distance should be larger when closer
    const yOff1 = Math.abs(pos1.y - 250) / 50
    const yOff2 = Math.abs(pos2.y - 250) / 25
    expect(yOff2).toBeGreaterThan(yOff1)
  })

  test('step falls back to boat.position when setShowCoordinate is not available', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.insideOuter = 1
    ctx.state.driveBoat.setShowCoordinate = undefined
    ctx.state.driveBoat.position = { x: 350, y: 250 }

    Maelstrom.step.call(ctx, { x: 350, y: 250 })

    // Should have modified position directly
    expect(ctx.state.driveBoat.position.x).toBeCloseTo(300 + 50 * Math.cos(0.04), 2)
    expect(ctx.state.driveBoat.position.y).toBeCloseTo(250 - 50 * Math.sin(0.04), 2)
  })

  // ── onEnterInner (Lingo lines 47-48) ──────────────────────────────────

  test('onEnterInner is a no-op (Lingo lines 47-48)', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    const speedBefore = ctx.state.driveBoat.speed

    expect(() => {
      Maelstrom.onEnterInner.call(ctx)
    }).not.toThrow()

    expect(ctx.state.driveBoat.speed).toBe(speedBefore)
  })

  // ── Edge cases ────────────────────────────────────────────────────────

  test('step handles missing drivingHandlers gracefully', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.state.drivingHandlers = null

    expect(() => {
      Maelstrom.step.call(ctx, { x: 350, y: 250 })
    }).not.toThrow()
  })

  test('step handles missing carLoc gracefully', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)

    expect(() => {
      Maelstrom.step.call(ctx)
    }).not.toThrow()
  })

  test('step rotation with diagonal offset produces correct coordinates', () => {
    const ctx = makeCtx()
    Maelstrom.onCreate.call(ctx)
    ctx.insideOuter = 1

    // Boat at (350, 300): X=50, Y=50, distance=sqrt(5000)≈70.71
    Maelstrom.step.call(ctx, { x: 350, y: 300 })

    const arg = ctx.state.driveBoat.setShowCoordinate.mock.calls[0][0]
    const dist = Math.sqrt(50 * 50 + 50 * 50)
    const a = 2.0 / dist
    const sinA = Math.sin(a)
    const cosA = Math.cos(a)
    const expectedX = 300 + (50 * sinA + 50 * cosA)
    const expectedY = 250 + (50 * cosA - 50 * sinA)
    expect(arg.x).toBeCloseTo(expectedX, 2)
    expect(arg.y).toBeCloseTo(expectedY, 2)
  })
})
