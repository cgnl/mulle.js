const NoMotor = require('../NoMotor').default

describe('NoMotor map object (ObjectNoMotorScript.ls)', () => {
  function makeCtx () {
    return {
      insideInner: false,
      insideOuter: false,
      lastCommentCounter: 0,
      enterLoc: null,
      game: {
        mulle: {
          playAudio: jest.fn()
        }
      },
      def: {
        Sounds: ['nm1', 'nm2', 'nm3']
      },
      state: {
        driveBoat: {
          currentPropulsion: 'motor',
          speed: 5,
          position: { x: 10, y: 20 },
          stepback: jest.fn((n) => {
            if (n === 2) return { x: 8, y: 18 }
            return { x: 10, y: 20 }
          }),
          notAllowedTypes: []
        }
      }
    }
  }

  test('onCreate initializes flags and cooldown', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(false)
    expect(ctx.insideOuter).toBe(false)
    expect(ctx.lastCommentCounter).toBe(0)
  })

  test('onEnterInner blocks motor and captures stepback location', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)

    NoMotor.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.notAllowedTypes).toEqual(['Motor'])
    expect(ctx.enterLoc).toEqual({ x: 8, y: 18 })
    expect(ctx.state.driveBoat.speed).toBe(0)
    expect(ctx.lastCommentCounter).toBe(100)
  })

  test('onEnterInner motor warning uses random sound index 2 or 3 (Lingo lines 42-44)', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)

    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.9)
    NoMotor.onEnterInner.call(ctx)
    rnd.mockRestore()

    expect(ctx.game.mulle.playAudio).toHaveBeenCalledWith('nm3')
  })

  test('cooldown prevents repeated motor warning until counter reaches zero', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)

    NoMotor.onEnterInner.call(ctx)
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(1)

    NoMotor.onEnterInner.call(ctx)
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(1)

    for (let i = 0; i < 100; i++) {
      NoMotor.step.call(ctx)
    }

    NoMotor.onEnterInner.call(ctx)
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledTimes(2)
  })

  test('non-motor entry plays first warning line (Lingo line 50)', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)
    ctx.state.driveBoat.currentPropulsion = 'sail'

    NoMotor.onEnterInner.call(ctx)

    expect(ctx.game.mulle.playAudio).toHaveBeenCalledWith('nm1')
    expect(ctx.enterLoc).toBeNull()
  })

  test('step while insideInner and motor keeps boat at enterLoc and speed zero', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)
    NoMotor.onEnterInner.call(ctx)

    ctx.state.driveBoat.position = { x: 999, y: 999 }
    ctx.state.driveBoat.speed = 9

    NoMotor.step.call(ctx)

    expect(ctx.state.driveBoat.position).toEqual({ x: 8, y: 18 })
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('step calls checkRadius and triggers EnterInnerRadius handler', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)
    const onEnterSpy = jest.spyOn(NoMotor, 'onEnterInner')
    ctx.state.drivingHandlers = {
      checkRadius: jest.fn(() => 'EnterInnerRadius')
    }

    NoMotor.step.call(ctx, { x: 10, y: 20 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalled()
    expect(onEnterSpy).toHaveBeenCalled()
    onEnterSpy.mockRestore()
  })

  test('step while insideInner and motor forces speed zero even without enterLoc', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)
    ctx.insideInner = true
    ctx.enterLoc = null
    ctx.state.driveBoat.speed = 6

    NoMotor.step.call(ctx)

    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('onExitInner clears insideInner flag', () => {
    const ctx = makeCtx()
    NoMotor.onCreate.call(ctx)
    NoMotor.onEnterInner.call(ctx)

    NoMotor.onExitInner.call(ctx)

    expect(ctx.insideInner).toBe(false)
  })

  test('onDestroy clears notAllowedTypes and returns kill-equivalent state', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.notAllowedTypes = ['Motor']
    ctx.child = { id: 123 }

    const result = NoMotor.onDestroy.call(ctx)

    expect(ctx.state.driveBoat.notAllowedTypes).toEqual([])
    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })
})
