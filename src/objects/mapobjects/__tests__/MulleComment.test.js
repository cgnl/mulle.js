const MulleComment = require('../MulleComment').default

describe('MulleComment map object (ObjectMulleCommentScript.ls)', () => {
  /**
   * ObjectMulleCommentScript is a one-shot comment trigger.
   * Plays a Mulle comment when the car enters the inner radius of any checkpoint.
   * Multi-checkpoint support using standard checkRadius (unlike Bridge's custom distance calc).
   *
   * Lingo properties: child, hasEntered, insideInner, insideOuter, sound, checkPoints
   * Lingo handlers: new, kill, init, step, EnterInnerRadius
   */

  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 5 },
      id: 5,
      x: 200,
      y: 150,
      position: { x: 200, y: 150 },
      myLoc: { x: 200, y: 150 },
      opt: {},
      optionalData: { sound: '31d010v0' },
      def: {
        Sounds: ['31d010v0']
      },
      InnerRadius: 40,
      OuterRadius: 80,
      setDirectorMember: jest.fn(),
      setSpriteLoc: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 400, y: 400 },
          speed: 5
        },
        drivingHandlers: {
          checkRadius: jest.fn(() => 'nothing')
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

  // ─── 1. Constructor (`new me, theChild`) ─────────────────────────────

  test('new: preserves child reference (Lingo line 5)', () => {
    const ctx = makeCtx()
    MulleComment.onCreate.call(ctx)
    expect(ctx.child).toEqual({ id: 5 })
  })

  test('new: sets hasEntered=0 (Lingo line 5)', () => {
    const ctx = makeCtx()
    MulleComment.onCreate.call(ctx)
    expect(ctx.hasEntered).toBe(0)
  })

  test('new: sets insideInner=0 and insideOuter=0 (Lingo lines 6-7)', () => {
    const ctx = makeCtx()
    MulleComment.onCreate.call(ctx)
    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
  })

  // ─── 2. Kill contract (`kill me`) ────────────────────────────────────

  test('kill: sets child=0 and returns 0 (Lingo kill contract, lines 9-12)', () => {
    const ctx = makeCtx()
    ctx.child = { id: 5 }

    const result = MulleComment.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('kill: returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = MulleComment.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ─── 3. init: sound from optionalData ────────────────────────────────

  test('init: reads sound from optionalData.sound', () => {
    const ctx = makeCtx({ optionalData: { sound: 'myComment' } })
    MulleComment.onCreate.call(ctx)
    expect(ctx.sound).toBe('myComment')
  })

  test('init: sound is null when optionalData has no sound', () => {
    const ctx = makeCtx({ optionalData: {} })
    MulleComment.onCreate.call(ctx)
    expect(ctx.sound).toBe(null)
  })

  test('init: sound is null when optionalData is undefined', () => {
    const ctx = makeCtx({ optionalData: undefined })
    MulleComment.onCreate.call(ctx)
    expect(ctx.sound).toBe(null)
  })

  // ─── 4. init: radius override ────────────────────────────────────────

  test('init: overrides InnerRadius from optionalData.radius when truthy', () => {
    const ctx = makeCtx({ optionalData: { sound: 's', radius: 60 } })
    ctx.InnerRadius = 40
    MulleComment.onCreate.call(ctx)
    expect(ctx.InnerRadius).toBe(60)
  })

  test('init: does NOT override InnerRadius when optionalData.radius is falsy (0)', () => {
    const ctx = makeCtx({ optionalData: { sound: 's', radius: 0 } })
    ctx.InnerRadius = 40
    MulleComment.onCreate.call(ctx)
    expect(ctx.InnerRadius).toBe(40)
  })

  test('init: preserves InnerRadius when optionalData has no radius property', () => {
    const ctx = makeCtx({ optionalData: { sound: 's' } })
    ctx.InnerRadius = 40
    MulleComment.onCreate.call(ctx)
    expect(ctx.InnerRadius).toBe(40)
  })

  // ─── 5. init: checkPoints ────────────────────────────────────────────

  test('init: reads checkPoints from optionalData.checkPoints', () => {
    const pts = [{ x: 100, y: 100 }, { x: 200, y: 200 }]
    const ctx = makeCtx({ optionalData: { sound: 's', checkPoints: pts } })
    MulleComment.onCreate.call(ctx)
    expect(ctx.checkPoints).toEqual(pts)
  })

  test('init: defaults checkPoints to [myLoc] when optionalData has no checkPoints', () => {
    const ctx = makeCtx({ optionalData: { sound: 's' }, myLoc: { x: 200, y: 150 } })
    MulleComment.onCreate.call(ctx)
    expect(ctx.checkPoints).toEqual([{ x: 200, y: 150 }])
  })

  test('init: defaults checkPoints to [myLoc] when optionalData is undefined', () => {
    const ctx = makeCtx({ optionalData: undefined, myLoc: { x: 200, y: 150 } })
    MulleComment.onCreate.call(ctx)
    expect(ctx.checkPoints).toEqual([{ x: 200, y: 150 }])
  })

  // ─── 6. step: checkRadius calls ─────────────────────────────────────

  test('step: calls checkRadius with #both for each checkpoint', () => {
    const pts = [{ x: 100, y: 100 }, { x: 200, y: 200 }]
    const ctx = makeCtx({ optionalData: { sound: 's', checkPoints: pts } })
    MulleComment.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('nothing')

    MulleComment.step.call(ctx, { x: 300, y: 300 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledTimes(2)
    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledWith(
      ctx, { x: 300, y: 300 }, { x: 100, y: 100 }, 'both'
    )
    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledWith(
      ctx, { x: 300, y: 300 }, { x: 200, y: 200 }, 'both'
    )
  })

  test('step: stops iterating after first EnterInnerRadius match', () => {
    const pts = [{ x: 100, y: 100 }, { x: 200, y: 200 }]
    const ctx = makeCtx({ optionalData: { sound: 's', checkPoints: pts } })
    MulleComment.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('EnterInnerRadius')

    MulleComment.step.call(ctx, { x: 100, y: 100 })

    // Should stop after the first match
    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledTimes(1)
  })

  test('step: triggers EnterInnerRadius on #EnterBoth result', () => {
    const ctx = makeCtx({ optionalData: { sound: 'testSound' } })
    MulleComment.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('EnterBoth')

    MulleComment.step.call(ctx, { x: 200, y: 150 })

    expect(ctx.hasEntered).toBe(1)
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('testSound', 5)
  })

  test('step: does not trigger on non-enter results', () => {
    const ctx = makeCtx({ optionalData: { sound: 'testSound' } })
    MulleComment.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('ExitOuterRadius')

    MulleComment.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.hasEntered).toBe(0)
    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  test('step: handles missing drivingHandlers gracefully', () => {
    const ctx = makeCtx()
    MulleComment.onCreate.call(ctx)
    ctx.state.drivingHandlers = null

    expect(() => {
      MulleComment.step.call(ctx, { x: 100, y: 100 })
    }).not.toThrow()
  })

  // ─── 7. EnterInnerRadius: one-shot trigger ──────────────────────────

  test('EnterInnerRadius: sets hasEntered=1 and says sound with priority 5', () => {
    const ctx = makeCtx({ optionalData: { sound: 'comment01' } })
    MulleComment.onCreate.call(ctx)
    expect(ctx.hasEntered).toBe(0)

    MulleComment.onEnterInner.call(ctx)

    expect(ctx.hasEntered).toBe(1)
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('comment01', 5)
  })

  test('EnterInnerRadius: does NOT trigger again after first entry (one-shot)', () => {
    const ctx = makeCtx({ optionalData: { sound: 'comment01' } })
    MulleComment.onCreate.call(ctx)

    MulleComment.onEnterInner.call(ctx)
    MulleComment.onEnterInner.call(ctx)
    MulleComment.onEnterInner.call(ctx)

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)
  })

  test('EnterInnerRadius: does not call say when sound is null', () => {
    const ctx = makeCtx({ optionalData: {} })
    MulleComment.onCreate.call(ctx)
    expect(ctx.sound).toBe(null)

    MulleComment.onEnterInner.call(ctx)

    expect(ctx.hasEntered).toBe(1)
    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  // ─── 8. Full lifecycle tests ─────────────────────────────────────────

  test('lifecycle: car enters inner radius → sound plays → car exits and re-enters → no repeat', () => {
    const ctx = makeCtx({ optionalData: { sound: 'mulleComment' } })
    MulleComment.onCreate.call(ctx)

    // First entry
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('EnterInnerRadius')
    MulleComment.step.call(ctx, { x: 200, y: 150 })
    expect(ctx.hasEntered).toBe(1)
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)

    // Exit
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('ExitInnerRadius')
    MulleComment.step.call(ctx, { x: 999, y: 999 })

    // Re-enter
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('EnterInnerRadius')
    MulleComment.step.call(ctx, { x: 200, y: 150 })

    // Should NOT have played sound again
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)
  })

  test('lifecycle: multi-checkpoint triggers on second checkpoint match', () => {
    const pts = [{ x: 100, y: 100 }, { x: 400, y: 400 }]
    const ctx = makeCtx({ optionalData: { sound: 'farComment', checkPoints: pts } })
    MulleComment.onCreate.call(ctx)

    // First checkpoint: no match, second checkpoint: match
    ctx.state.drivingHandlers.checkRadius
      .mockReturnValueOnce('nothing')
      .mockReturnValueOnce('EnterInnerRadius')

    MulleComment.step.call(ctx, { x: 410, y: 400 })

    expect(ctx.hasEntered).toBe(1)
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('farComment', 5)
  })

  test('lifecycle: no checkpoints match, nothing triggers', () => {
    const pts = [{ x: 100, y: 100 }, { x: 400, y: 400 }]
    const ctx = makeCtx({ optionalData: { sound: 'comment', checkPoints: pts } })
    MulleComment.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('nothing')

    MulleComment.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.hasEntered).toBe(0)
    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })
})
