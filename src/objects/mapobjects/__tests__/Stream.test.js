const Stream = require('../Stream').default

describe('Stream map object (ObjectStreamScript.ls)', () => {
  test('onCreate uses defaults Dir=8 and speed=2', () => {
    const directionList = Array.from({ length: 16 }, () => ({ x: 100, y: 0 }))
    const ctx = {
      opt: { UnderSP: 123 },
      state: { driveBoat: { directionList } }
    }

    Stream.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(false)
    expect(ctx.insideOuter).toBe(false)
    expect(ctx.driftPoint).toEqual({ x: 2, y: 0 })
    expect(ctx.SP).toBe(123)
  })

  test('onCreate uses optional Dir and speed values', () => {
    const directionList = Array.from({ length: 16 }, () => ({ x: 0, y: 0 }))
    directionList[1] = { x: 0, y: 100 }
    const ctx = {
      opt: { Dir: 2, speed: 5 },
      state: { driveBoat: { directionList } }
    }

    Stream.onCreate.call(ctx)

    expect(ctx.driftPoint).toEqual({ x: 0, y: 5 })
  })

  test('onCreate sets UnderSP sprite location when adapter exists', () => {
    const directionList = Array.from({ length: 16 }, () => ({ x: 0, y: 0 }))
    const setSpriteLoc = jest.fn()
    const ctx = {
      x: 123,
      y: 234,
      opt: { UnderSP: 77 },
      setSpriteLocation: setSpriteLoc,
      state: { driveBoat: { directionList } }
    }

    Stream.onCreate.call(ctx)

    expect(setSpriteLoc).toHaveBeenCalledWith(77, { x: 123, y: 234 })
  })

  test('step drifts boat while insideOuter', () => {
    const ctx = {
      insideOuter: true,
      driftPoint: { x: 3, y: -1 },
      state: {
        driveBoat: { position: { x: 10, y: 20 } },
        boatSprite: { position: { x: 10, y: 20 } }
      }
    }

    Stream.step.call(ctx)

    expect(ctx.state.driveBoat.position).toEqual({ x: 13, y: 19 })
    expect(ctx.state.boatSprite.position).toEqual({ x: 13, y: 19 })
  })

  test('step does not mutate insideOuter from carLoc (radius handled externally)', () => {
    const ctx = {
      insideOuter: false,
      driftPoint: { x: 2, y: 1 },
      OuterRadius: 20,
      position: { x: 100, y: 100 },
      state: {
        driveBoat: { position: { x: 95, y: 95 } },
        boatSprite: { position: { x: 95, y: 95 } }
      }
    }

    Stream.step.call(ctx, { x: 95, y: 95 })

    expect(ctx.insideOuter).toBe(false)
    expect(ctx.state.driveBoat.position).toEqual({ x: 95, y: 95 })
  })

  test('step drifts using show coordinate API when available', () => {
    const ctx = {
      insideOuter: true,
      driftPoint: { x: 2, y: 1 },
      OuterRadius: 20,
      position: { x: 100, y: 100 },
      state: {
        driveBoat: {
          position: { x: 95, y: 95 },
          getShowCoordinate: jest.fn(() => ({ x: 95, y: 95 })),
          setShowCoordinate: jest.fn()
        },
        boatSprite: { position: { x: 95, y: 95 } }
      }
    }

    Stream.step.call(ctx, { x: 95, y: 95 })

    expect(ctx.state.driveBoat.setShowCoordinate).toHaveBeenCalledWith({ x: 97, y: 96 })
  })

  test('step maps checkRadius EnterBoth to onEnterOuter behavior', () => {
    const checkRadius = jest.fn(() => 'EnterBoth')
    const ctx = {
      insideOuter: false,
      driftPoint: { x: 2, y: 1 },
      OuterRadius: 20,
      position: { x: 100, y: 100 },
      x: 100,
      y: 100,
      state: {
        drivingHandlers: { checkRadius },
        driveBoat: { position: { x: 95, y: 95 } },
        boatSprite: { position: { x: 95, y: 95 } }
      }
    }

    Stream.step.call(ctx, { x: 95, y: 95 })

    expect(checkRadius).toHaveBeenCalled()
    expect(ctx.insideOuter).toBe(true)
    expect(ctx.state.driveBoat.position).toEqual({ x: 97, y: 96 })
  })

  test('step maps checkRadius ExitOuterRadius to onExitOuter behavior', () => {
    const checkRadius = jest.fn(() => 'ExitOuterRadius')
    const ctx = {
      insideOuter: true,
      driftPoint: { x: 2, y: 1 },
      OuterRadius: 20,
      position: { x: 100, y: 100 },
      x: 100,
      y: 100,
      state: {
        drivingHandlers: { checkRadius },
        driveBoat: { position: { x: 95, y: 95 } },
        boatSprite: { position: { x: 95, y: 95 } }
      }
    }

    Stream.step.call(ctx, { x: 95, y: 95 })

    expect(ctx.insideOuter).toBe(false)
    expect(ctx.state.driveBoat.position).toEqual({ x: 95, y: 95 })
  })

  test('onEnterOuter/onExitOuter toggle drift activation', () => {
    const ctx = { insideOuter: false }

    Stream.onEnterOuter.call(ctx)
    expect(ctx.insideOuter).toBe(true)

    Stream.onExitOuter.call(ctx)
    expect(ctx.insideOuter).toBe(false)
  })

  test('onDestroy clears drift state', () => {
    const ctx = { insideOuter: true, driftPoint: { x: 1, y: 1 } }

    const result = Stream.onDestroy.call(ctx)

    expect(ctx.insideOuter).toBe(false)
    expect(ctx.driftPoint).toBeNull()
    expect(result).toBe(0)
  })
})
