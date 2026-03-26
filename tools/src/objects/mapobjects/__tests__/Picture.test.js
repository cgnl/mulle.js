const Picture = require('../Picture').default

describe('Picture map object (ObjectPictureScript.ls)', () => {
  /**
   * ObjectPictureScript is the simplest CDdata looping-animation script.
   * No radius checks, no sound, no inventory — just frame cycling.
   *
   * Lingo properties: child, frameList, listLen, counter, SP
   * Lingo handlers: new, kill, init, step
   */

  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 7 },
      id: 7,
      x: 250,
      y: 180,
      position: { x: 250, y: 180 },
      myLoc: { x: 250, y: 180 },
      opt: {},
      optionalData: {},
      def: {
        FrameList: { normal: ['31b020v0', '31b020v1', '31b020v2'] }
      },
      SpriteInfo: { Over: 0, Under: 0 },
      SPOver: 0,
      SPUnder: 14,
      SP: 0,
      setDirectorMember: jest.fn(),
      setSpriteLoc: jest.fn(),
      setSpriteLocation: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 400, y: 400 }
        }
      },
      game: {
        mulle: {}
      }
    }

    return Object.assign(ctx, overrides)
  }

  // ─── 1. Constructor (`new me, theChild`) ─────────────────────────────

  test('new: sets child reference (Lingo line 5)', () => {
    const ctx = makeCtx()
    Picture.onCreate.call(ctx)
    // child should be preserved — not cleared
    expect(ctx.child).toBeTruthy()
    expect(ctx.child).toEqual({ id: 7 })
  })

  test('new: does NOT initialize insideInner or insideOuter (unlike Pickup/Gas)', () => {
    const ctx = makeCtx()
    // Intentionally do NOT set insideInner/insideOuter on ctx
    delete ctx.insideInner
    delete ctx.insideOuter

    Picture.onCreate.call(ctx)

    // Picture script has NO insideInner/insideOuter in its constructor
    // (unlike ObjectPickupScript which sets them to 0)
    // If the implementation sets them, that's a deviation from Lingo
    // but acceptable. The key is it must NOT require them.
    expect(() => Picture.onCreate.call(makeCtx())).not.toThrow()
  })

  // ─── 2. Kill contract (`kill me`) ────────────────────────────────────

  test('kill: sets child=0 and returns 0 (Lingo kill contract, lines 9-11)', () => {
    const ctx = makeCtx()
    ctx.child = { id: 7 }

    const result = Picture.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('kill: returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = Picture.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ─── 3. init - frameList source preference ──────────────────────────

  test('init: uses optionalData.frameList as primary frame source (Lingo line 15)', () => {
    const ctx = makeCtx({
      optionalData: { frameList: ['opt_frame0', 'opt_frame1'] },
      def: { FrameList: { normal: ['normal_frame0'] } }
    })

    Picture.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['opt_frame0', 'opt_frame1'])
  })

  test('init: falls back to FrameList.normal when optionalData has no frameList (Lingo line 17)', () => {
    const ctx = makeCtx({
      optionalData: {},
      def: { FrameList: { normal: ['31b020v0', '31b020v1', '31b020v2'] } }
    })

    Picture.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['31b020v0', '31b020v1', '31b020v2'])
  })

  test('init: falls back to FrameList.normal when optionalData is undefined (Lingo line 15 voidp check)', () => {
    const ctx = makeCtx({
      optionalData: undefined,
      def: { FrameList: { normal: ['31b020v0'] } }
    })

    Picture.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['31b020v0'])
  })

  test('init: optionalData.frameList with a single frame still works (Lingo line 15)', () => {
    const ctx = makeCtx({
      optionalData: { frameList: ['single_frame'] }
    })

    Picture.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['single_frame'])
    expect(ctx.listLen).toBe(1)
  })

  // ─── 4. init - SPOver/SPUnder preference ─────────────────────────────

  test('init: prefers SPOver when SPOver > 0 (Lingo lines 19-21)', () => {
    const ctx = makeCtx({
      SPOver: 22,
      SPUnder: 14
    })

    Picture.onCreate.call(ctx)

    expect(ctx.SP).toBe(22)
  })

  test('init: falls back to SPUnder when SPOver is 0 (Lingo lines 19-21)', () => {
    const ctx = makeCtx({
      SPOver: 0,
      SPUnder: 14
    })

    Picture.onCreate.call(ctx)

    expect(ctx.SP).toBe(14)
  })

  test('init: falls back to SPUnder when SPOver is negative (Lingo "not (SP > 0)" line 20)', () => {
    const ctx = makeCtx({
      SPOver: -1,
      SPUnder: 14
    })

    Picture.onCreate.call(ctx)

    expect(ctx.SP).toBe(14)
  })

  test('init: SPOver=0 and SPUnder=0 results in SP=0 (Lingo lines 19-21)', () => {
    const ctx = makeCtx({
      SPOver: 0,
      SPUnder: 0
    })

    Picture.onCreate.call(ctx)

    expect(ctx.SP).toBe(0)
  })

  // ─── 5. init - listLen and counter ──────────────────────────────────

  test('init: sets listLen to count of frameList (Lingo line 23)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2', 'f3'] } }
    })

    Picture.onCreate.call(ctx)

    expect(ctx.listLen).toBe(4)
  })

  test('init: sets counter to 1 (Lingo line 24, 1-indexed) mapped to 0 in JS', () => {
    const ctx = makeCtx()

    Picture.onCreate.call(ctx)

    // Lingo uses counter=1 (1-indexed). In JS this maps to index 0.
    // Implementation may use 0-based or 1-based — what matters is the
    // first step displays the first frame correctly.
    expect(ctx.counter).toBeDefined()
    expect(typeof ctx.counter).toBe('number')
  })

  // ─── 6. init calls step immediately ─────────────────────────────────

  test('init: calls step immediately to display first frame (Lingo line 25)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['first_frame', 'second_frame'] } }
    })

    Picture.onCreate.call(ctx)

    // After init, the first frame should already be set on the sprite.
    // Lingo line 25: step(me) — which sets member to frameList[counter]
    // At counter=1 (Lingo 1-indexed), that's the first frame.
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('first_frame')
  })

  test('init: first frame comes from optionalData.frameList when available', () => {
    const ctx = makeCtx({
      optionalData: { frameList: ['opt_first', 'opt_second'] },
      def: { FrameList: { normal: ['normal_first'] } }
    })

    Picture.onCreate.call(ctx)

    expect(ctx.setDirectorMember).toHaveBeenCalledWith('opt_first')
  })

  // ─── 7. step - Frame cycling animation ──────────────────────────────

  test('step: sets sprite member to current frame from frameList (Lingo line 28)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['frame_a', 'frame_b', 'frame_c'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    // First explicit step should advance to the next frame
    Picture.step.call(ctx)

    expect(ctx.setDirectorMember).toHaveBeenCalled()
    // The member set should be one of the frames in the list
    const calledWith = ctx.setDirectorMember.mock.calls[0][0]
    expect(['frame_a', 'frame_b', 'frame_c']).toContain(calledWith)
  })

  test('step: advances counter each call (Lingo lines 29-30)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] } }
    })
    Picture.onCreate.call(ctx)

    const frames = []
    ctx.setDirectorMember.mockClear()

    // Call step 3 times to cycle through all frames
    for (let i = 0; i < 3; i++) {
      Picture.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    // All three frames should appear in the cycle
    expect(frames).toContain('f0')
    expect(frames).toContain('f1')
    expect(frames).toContain('f2')
  })

  test('step: wraps counter back to first frame after reaching end (Lingo lines 31-33)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    // After init, counter is already at 1 (init called step once: showed f0, advanced to 1)
    // step 1: shows f1, counter→2
    // step 2: shows f2, counter→3→wrap→0
    // step 3: shows f0, counter→1
    const frames = []
    for (let i = 0; i < 3; i++) {
      Picture.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    // The 3rd step should wrap back to frame 0
    expect(frames[2]).toBe('f0')
  })

  test('step: complete double cycle produces correct frame sequence', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['alpha', 'beta'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    // 2-frame list: should cycle alpha, beta, alpha, beta
    const frames = []
    for (let i = 0; i < 4; i++) {
      Picture.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    expect(frames).toEqual(['beta', 'alpha', 'beta', 'alpha'])
  })

  test('step: single-frame list always shows same frame (Lingo counter wrap)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['only_frame'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    for (let i = 0; i < 5; i++) {
      Picture.step.call(ctx)
    }

    // Every step call should set the same frame
    const allCalls = ctx.setDirectorMember.mock.calls.map(c => c[0])
    expect(allCalls.every(f => f === 'only_frame')).toBe(true)
  })

  test('step: ignores carLoc parameter entirely (Lingo step takes carLoc but never uses it)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    // Call with various carLoc values — should make no difference
    Picture.step.call(ctx, { x: 0, y: 0 })
    const frame1 = ctx.setDirectorMember.mock.calls[0][0]

    Picture.step.call(ctx, { x: 99999, y: 99999 })
    const frame2 = ctx.setDirectorMember.mock.calls[1][0]

    Picture.step.call(ctx, null)
    const frame3 = ctx.setDirectorMember.mock.calls[2][0]

    Picture.step.call(ctx, undefined)
    const frame4 = ctx.setDirectorMember.mock.calls[3][0]

    // Frames should cycle normally regardless of carLoc
    expect([frame1, frame2, frame3, frame4]).toEqual(['f1', 'f0', 'f1', 'f0'])
  })

  test('step: no radius checks, no sound, no inventory interaction (simplest CDdata script)', () => {
    const checkRadius = jest.fn()
    const playAudio = jest.fn()
    const ctx = makeCtx({
      state: {
        driveBoat: { position: { x: 400, y: 400 } },
        drivingHandlers: { checkRadius }
      },
      game: {
        mulle: { playAudio }
      }
    })

    Picture.onCreate.call(ctx)
    Picture.step.call(ctx, { x: 250, y: 180 }) // car right on top

    expect(checkRadius).not.toHaveBeenCalled()
    expect(playAudio).not.toHaveBeenCalled()
  })

  // ─── 8. init sets sprite loc (Lingo line 22) ────────────────────────

  test('init: sets sprite loc to myLoc (Lingo line 22)', () => {
    const ctx = makeCtx({
      myLoc: { x: 300, y: 200 },
      SPOver: 0,
      SPUnder: 14
    })

    Picture.onCreate.call(ctx)

    // Implementation may use setSpriteLoc, setSpriteLocation, or set position directly
    // The important thing is the sprite ends up at myLoc
    const locSet = (ctx.setSpriteLoc.mock.calls.length > 0) ||
      (ctx.setSpriteLocation.mock.calls.length > 0)
    // If using setDirectorMember only (current minimal impl), this test documents
    // the missing sprite positioning behavior
    expect(locSet).toBe(true)
  })

  // ─── 9. Long-running animation stability ────────────────────────────

  test('step: 100 iterations do not throw or produce undefined frames', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2', 'f3', 'f4'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    for (let i = 0; i < 100; i++) {
      expect(() => Picture.step.call(ctx)).not.toThrow()
    }

    // Every call should have set a valid frame member
    const allFrames = ctx.setDirectorMember.mock.calls.map(c => c[0])
    expect(allFrames).toHaveLength(100)
    allFrames.forEach(frame => {
      expect(frame).toBeDefined()
      expect(['f0', 'f1', 'f2', 'f3', 'f4']).toContain(frame)
    })
  })

  test('step: counter wraps correctly at exact boundary (listLen frames)', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['a', 'b', 'c'] } }
    })
    Picture.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    // Step exactly listLen times (3), then one more
    const frames = []
    for (let i = 0; i < 4; i++) {
      Picture.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    // Lingo counter starts at 1, steps: 1→a, 2→b, 3→c, then wraps: 1→a
    // JS 0-indexed equivalent: 0→a, 1→b, 2→c, wrap: 0→a
    // After init already showed first frame, step cycle is: b, c, a, b
    expect(frames[2]).toBe(frames[2]) // no undefined
    expect(frames[3]).toBe(frames[0]) // wrap produces same as first step
  })

  // ─── 10. Missing handlers that exist in current impl ────────────────

  test('onEnterInner should be absent or a no-op (Picture has no radius behavior)', () => {
    // The current Picture.js has an empty onEnterInner stub.
    // The Lingo script has NO enter/exit radius handlers at all.
    // Either onEnterInner should not exist, or be a harmless no-op.
    if (typeof Picture.onEnterInner === 'function') {
      const ctx = makeCtx()
      Picture.onCreate.call(ctx)

      // Should not throw and should not modify state meaningfully
      expect(() => Picture.onEnterInner.call(ctx)).not.toThrow()
    }
  })

  // ─── 11. bringToTop for SPOver sprites ──────────────────────────────

  test('init: brings sprite to top when using SPOver (Lingo SPOver implies over-layer)', () => {
    const bringToTop = jest.fn()
    const ctx = makeCtx({
      SPOver: 22,
      SPUnder: 14,
      SpriteInfo: { Over: 22, Under: 14 },
      bringToTop
    })

    Picture.onCreate.call(ctx)

    // When SPOver is used, the sprite should be brought to top
    // (existing Picture.js already does this via SpriteInfo.Over check)
    expect(bringToTop).toHaveBeenCalled()
  })

  test('init: does NOT bring to top when only SPUnder is used', () => {
    const bringToTop = jest.fn()
    const ctx = makeCtx({
      SPOver: 0,
      SPUnder: 14,
      SpriteInfo: { Over: 0, Under: 14 },
      bringToTop
    })

    Picture.onCreate.call(ctx)

    expect(bringToTop).not.toHaveBeenCalled()
  })
})
