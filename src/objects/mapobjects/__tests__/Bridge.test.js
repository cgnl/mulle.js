const Bridge = require('../Bridge').default

describe('Bridge map object (ObjectBridgeScript.ls)', () => {
  /**
   * ObjectBridgeScript is the most complex CDdata script (92 lines).
   * It implements a custom multi-checkpoint radius check (NOT checkRadius!),
   * animation frame cycling, and sail-based blocking behavior.
   *
   * Lingo properties: child, insideInner, insideOuter, gotSail, frameList,
   *   listLen, counter, SP, checkPoints, lastCommentCounter, enterLoc
   * Lingo handlers: new, kill, init, step, EnterInnerRadius
   */

  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 10 },
      id: 10,
      x: 300,
      y: 200,
      position: { x: 300, y: 200 },
      myLoc: { x: 300, y: 200 },
      opt: {},
      optionalData: {},
      def: {
        FrameList: { normal: ['br_v0', 'br_v1', 'br_v2'] },
        Sounds: ['bridge_warning']
      },
      SpriteInfo: { Over: 0, Under: 0 },
      SPOver: 0,
      SPUnder: 18,
      SP: 0,
      InnerRadius: 40,
      setDirectorMember: jest.fn(),
      setSpriteLoc: jest.fn(),
      setSpriteLocation: jest.fn(),
      state: {
        driveBoat: {
          loc: { x: 500, y: 500 },
          speed: 5,
          quickProps: { SailWithPole: 0 },
          stepback: jest.fn((n) => {
            if (n === 2) return { x: 490, y: 490 }
            return { x: 500, y: 500 }
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

  test('new: sets insideInner=0 and insideOuter=0 (Lingo new lines 5-6)', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)

    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
  })

  test('new: preserves child reference (Lingo new line 5)', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)

    expect(ctx.child).toEqual({ id: 10 })
  })

  // ─── 2. Kill contract (`kill me`) ────────────────────────────────────

  test('kill: sets child=0 and returns 0 (Lingo kill contract, lines 9-12)', () => {
    const ctx = makeCtx()
    ctx.child = { id: 10 }

    const result = Bridge.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('kill: returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = Bridge.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ─── 3. init: gotSail from boat quickProps.SailWithPole ──────────────

  test('init: gotSail=1 when boat has no SailWithPole (boat can pass freely)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { SailWithPole: 0 }
    Bridge.onCreate.call(ctx)

    expect(ctx.gotSail).toBe(1)
  })

  test('init: gotSail=0 when boat has SailWithPole truthy (Lingo: sail blocks bridge)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 }
    Bridge.onCreate.call(ctx)

    expect(ctx.gotSail).toBe(0)
  })

  test('init: gotSail=1 when quickProps is missing entirely', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = null
    Bridge.onCreate.call(ctx)

    expect(ctx.gotSail).toBe(1)
  })

  // ─── 4. init: frameList source preference ────────────────────────────

  test('init: uses optionalData.frameList as primary frame source', () => {
    const ctx = makeCtx({
      optionalData: { frameList: ['opt_br0', 'opt_br1'] },
      def: { FrameList: { normal: ['normal_br0'] }, Sounds: ['s'] }
    })

    Bridge.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['opt_br0', 'opt_br1'])
  })

  test('init: falls back to FrameList.normal when optionalData has no frameList', () => {
    const ctx = makeCtx({
      optionalData: {},
      def: { FrameList: { normal: ['br_v0', 'br_v1', 'br_v2'] }, Sounds: ['s'] }
    })

    Bridge.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['br_v0', 'br_v1', 'br_v2'])
  })

  test('init: falls back to FrameList.normal when optionalData is undefined', () => {
    const ctx = makeCtx({
      optionalData: undefined,
      def: { FrameList: { normal: ['br_v0'] }, Sounds: ['s'] }
    })

    Bridge.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['br_v0'])
  })

  // ─── 5. init: checkPoints from optionalData ──────────────────────────

  test('init: reads checkPoints from optionalData.checkPoints', () => {
    const pts = [{ x: 100, y: 100 }, { x: 200, y: 200 }]
    const ctx = makeCtx({ optionalData: { checkPoints: pts } })

    Bridge.onCreate.call(ctx)

    expect(ctx.checkPoints).toEqual(pts)
  })

  test('init: defaults checkPoints to [myLoc] when optionalData has no checkPoints', () => {
    const ctx = makeCtx({ optionalData: {}, myLoc: { x: 300, y: 200 } })

    Bridge.onCreate.call(ctx)

    expect(ctx.checkPoints).toEqual([{ x: 300, y: 200 }])
  })

  test('init: defaults checkPoints to [myLoc] when optionalData is undefined', () => {
    const ctx = makeCtx({ optionalData: undefined, myLoc: { x: 300, y: 200 } })

    Bridge.onCreate.call(ctx)

    expect(ctx.checkPoints).toEqual([{ x: 300, y: 200 }])
  })

  // ─── 6. init: SP preference ──────────────────────────────────────────

  test('init: prefers SPOver when SPOver > 0 (Lingo SP preference)', () => {
    const ctx = makeCtx({ SPOver: 22, SPUnder: 14 })

    Bridge.onCreate.call(ctx)

    expect(ctx.SP).toBe(22)
  })

  test('init: falls back to SPUnder when SPOver is 0', () => {
    const ctx = makeCtx({ SPOver: 0, SPUnder: 14 })

    Bridge.onCreate.call(ctx)

    expect(ctx.SP).toBe(14)
  })

  // ─── 7. init: listLen, counter, lastCommentCounter ───────────────────

  test('init: sets listLen to count of frameList', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2', 'f3'] }, Sounds: ['s'] }
    })

    Bridge.onCreate.call(ctx)

    expect(ctx.listLen).toBe(4)
  })

  test('init: sets counter to 0 (JS 0-indexed)', () => {
    const ctx = makeCtx()

    Bridge.onCreate.call(ctx)

    expect(ctx.counter).toBe(0)
  })

  test('init: sets lastCommentCounter to 0', () => {
    const ctx = makeCtx()

    Bridge.onCreate.call(ctx)

    expect(ctx.lastCommentCounter).toBe(0)
  })

  // ─── 8. init: sprite loc ─────────────────────────────────────────────

  test('init: sets sprite loc to myLoc', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 }, SPOver: 0, SPUnder: 18 })

    Bridge.onCreate.call(ctx)

    const locSet = (ctx.setSpriteLoc.mock.calls.length > 0) ||
      (ctx.setSpriteLocation.mock.calls.length > 0)
    expect(locSet).toBe(true)
  })

  // ─── 9. step: custom multi-checkpoint radius check ───────────────────

  test('step: does NOT use checkRadius (Bridge has custom distance check)', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)

    Bridge.step.call(ctx, { x: 300, y: 200 })

    expect(ctx.state.drivingHandlers.checkRadius).not.toHaveBeenCalled()
  })

  test('step: detects inner radius via custom distance calc on single checkpoint', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 }
    Bridge.onCreate.call(ctx)
    // checkPoints defaults to [myLoc] = [{x:300,y:200}]
    // InnerRadius = 40. Car at (310, 200) → distance = 10 < 40

    Bridge.step.call(ctx, { x: 310, y: 200 })

    expect(ctx.insideInner).toBe(1)
  })

  test('step: does NOT trigger inner radius when distance >= InnerRadius', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    Bridge.onCreate.call(ctx)

    Bridge.step.call(ctx, { x: 500, y: 500 })

    expect(ctx.insideInner).toBe(0)
  })

  test('step: detects inner radius across multiple checkpoints', () => {
    const pts = [{ x: 100, y: 100 }, { x: 400, y: 400 }]
    const ctx = makeCtx({ optionalData: { checkPoints: pts } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 }
    Bridge.onCreate.call(ctx)
    // InnerRadius = 40. Car at (410, 400) → distance from second checkpoint = 10 < 40

    Bridge.step.call(ctx, { x: 410, y: 400 })

    expect(ctx.insideInner).toBe(1)
  })

  test('step: first checkpoint match stops iteration (calls onEnterInner once)', () => {
    const pts = [{ x: 100, y: 100 }, { x: 110, y: 100 }]
    const ctx = makeCtx({ optionalData: { checkPoints: pts } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 }
    Bridge.onCreate.call(ctx)
    // Car at (105, 100) → dist to both checkpoints < 40

    const spy = jest.spyOn(Bridge, 'onEnterInner')
    Bridge.step.call(ctx, { x: 105, y: 100 })

    expect(spy).toHaveBeenCalledTimes(1)
    spy.mockRestore()
  })

  test('step: clears insideInner when no checkpoint is within radius', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    Bridge.onCreate.call(ctx)
    ctx.insideInner = 1 // was inside

    Bridge.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.insideInner).toBe(0)
  })

  test('step: does NOT call onEnterInner when already inside (re-entry suppressed)', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 }
    Bridge.onCreate.call(ctx)

    // Enter for the first time
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.insideInner).toBe(1)

    const spy = jest.spyOn(Bridge, 'onEnterInner')
    // Step again still inside
    Bridge.step.call(ctx, { x: 310, y: 200 })

    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  // ─── 10. step: blocking behavior (insideInner && gotSail) ────────────

  test('step: forces boat loc to enterLoc when insideInner and gotSail', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 0 } // no sail → gotSail=1
    Bridge.onCreate.call(ctx)

    // Trigger enter
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.insideInner).toBe(1)
    expect(ctx.enterLoc).toBeTruthy()

    // Now move boat and step again
    ctx.state.driveBoat.loc = { x: 320, y: 220 }
    ctx.state.driveBoat.speed = 10

    Bridge.step.call(ctx, { x: 310, y: 200 })

    expect(ctx.state.driveBoat.loc.x).toBe(ctx.enterLoc.x)
    expect(ctx.state.driveBoat.loc.y).toBe(ctx.enterLoc.y)
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('step: does NOT force boat back when gotSail=0 (has sail, passes freely)', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 } // has sail → gotSail=0
    Bridge.onCreate.call(ctx)
    expect(ctx.gotSail).toBe(0)

    Bridge.step.call(ctx, { x: 310, y: 200 })

    // Should still enter inner but NOT block
    expect(ctx.insideInner).toBe(1)
    expect(ctx.state.driveBoat.speed).toBe(5)
  })

  // ─── 11. step: lastCommentCounter decrement ──────────────────────────

  test('step: decrements lastCommentCounter each step', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.lastCommentCounter = 50

    Bridge.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.lastCommentCounter).toBe(49)
  })

  test('step: does not decrement lastCommentCounter below 0', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.lastCommentCounter = 0

    Bridge.step.call(ctx, { x: 999, y: 999 })

    expect(ctx.lastCommentCounter).toBe(0)
  })

  test('step: lastCommentCounter reaches 0 after exactly 100 steps', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.lastCommentCounter = 100

    for (var i = 0; i < 100; i++) {
      Bridge.step.call(ctx, { x: 999, y: 999 })
    }

    expect(ctx.lastCommentCounter).toBe(0)
  })

  // ─── 12. step: animation frame cycling ───────────────────────────────

  test('step: sets sprite member to current frame from frameList', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['br_a', 'br_b', 'br_c'] }, Sounds: ['s'] }
    })
    Bridge.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    Bridge.step.call(ctx)

    expect(ctx.setDirectorMember).toHaveBeenCalled()
  })

  test('step: advances counter each call and cycles through frames', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] }, Sounds: ['s'] }
    })
    Bridge.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    const frames = []
    for (let i = 0; i < 3; i++) {
      Bridge.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    expect(frames).toContain('f0')
    expect(frames).toContain('f1')
    expect(frames).toContain('f2')
  })

  test('step: wraps counter back to first frame after reaching end', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] }, Sounds: ['s'] }
    })
    Bridge.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    // counter starts at 0, steps: f0 → f1 → f2 → wrap → f0
    const frames = []
    for (let i = 0; i < 4; i++) {
      Bridge.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    expect(frames[0]).toBe('f0')
    expect(frames[3]).toBe('f0')
  })

  test('step: single-frame list always shows same frame', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['only_frame'] }, Sounds: ['s'] }
    })
    Bridge.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    for (let i = 0; i < 5; i++) {
      Bridge.step.call(ctx)
    }

    const allCalls = ctx.setDirectorMember.mock.calls.map(c => c[0])
    expect(allCalls.every(f => f === 'only_frame')).toBe(true)
  })

  // ─── 13. onEnterInner behavior ───────────────────────────────────────

  test('onEnterInner: says sound when gotSail and lastCommentCounter=0', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.gotSail = 1
    ctx.lastCommentCounter = 0

    Bridge.onEnterInner.call(ctx)

    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledWith('bridge_warning', 2)
  })

  test('onEnterInner: does NOT say sound when lastCommentCounter > 0', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.gotSail = 1
    ctx.lastCommentCounter = 50

    Bridge.onEnterInner.call(ctx)

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
  })

  test('onEnterInner: calls stepback(2) and saves as enterLoc when gotSail', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.gotSail = 1

    Bridge.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.stepback).toHaveBeenCalledWith(2)
    expect(ctx.enterLoc).toEqual({ x: 490, y: 490 })
  })

  test('onEnterInner: sets speed=0 when gotSail', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.gotSail = 1

    Bridge.onEnterInner.call(ctx)

    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('onEnterInner: sets lastCommentCounter to 100 when gotSail', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.gotSail = 1

    Bridge.onEnterInner.call(ctx)

    expect(ctx.lastCommentCounter).toBe(100)
  })

  test('onEnterInner: does nothing when gotSail=0 (has sail, free passage)', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 }
    Bridge.onCreate.call(ctx)
    expect(ctx.gotSail).toBe(0)

    Bridge.onEnterInner.call(ctx)

    expect(ctx.state.mulleTalkObject.say).not.toHaveBeenCalled()
    expect(ctx.state.driveBoat.speed).toBe(5)
  })

  test('onEnterInner: falls back to boat loc when stepback unavailable', () => {
    const ctx = makeCtx()
    ctx.state.driveBoat.stepback = undefined
    ctx.state.driveBoat.loc = { x: 100, y: 100 }
    Bridge.onCreate.call(ctx)
    ctx.gotSail = 1

    Bridge.onEnterInner.call(ctx)

    expect(ctx.enterLoc).toEqual({ x: 100, y: 100 })
  })

  // ─── 14. Full lifecycle tests ────────────────────────────────────────

  test('lifecycle: boat without sail enters bridge freely (no blocking)', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 1 } // has sail → gotSail=0
    Bridge.onCreate.call(ctx)

    // Enter inner radius
    Bridge.step.call(ctx, { x: 310, y: 200 })

    expect(ctx.insideInner).toBe(1)
    expect(ctx.state.driveBoat.speed).toBe(5)
  })

  test('lifecycle: boat with no sail is blocked and pushed back repeatedly', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 0 }
    Bridge.onCreate.call(ctx)
    expect(ctx.gotSail).toBe(1)

    // First entry triggers block
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.insideInner).toBe(1)
    expect(ctx.enterLoc).toEqual({ x: 490, y: 490 })
    expect(ctx.state.driveBoat.speed).toBe(0)

    // Boat tries again
    ctx.state.driveBoat.loc = { x: 320, y: 220 }
    ctx.state.driveBoat.speed = 5
    Bridge.step.call(ctx, { x: 310, y: 200 })

    expect(ctx.state.driveBoat.loc.x).toBe(490)
    expect(ctx.state.driveBoat.loc.y).toBe(490)
    expect(ctx.state.driveBoat.speed).toBe(0)
  })

  test('lifecycle: cooldown prevents repeated sounds during 100-step window', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 0 }
    Bridge.onCreate.call(ctx)

    // First entry with sound
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)

    // Exit and re-enter before cooldown expires
    Bridge.step.call(ctx, { x: 999, y: 999 }) // exit
    expect(ctx.insideInner).toBe(0)

    // Re-enter: lastCommentCounter is still > 0 (about 98)
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1) // no new sound
  })

  test('lifecycle: sound plays again after 100 steps', () => {
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 } })
    ctx.state.driveBoat.quickProps = { SailWithPole: 0 }
    Bridge.onCreate.call(ctx)

    // First entry
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(1)

    // Exit
    Bridge.step.call(ctx, { x: 999, y: 999 })

    // Run 100 steps far away to expire cooldown
    for (let i = 0; i < 100; i++) {
      Bridge.step.call(ctx, { x: 999, y: 999 })
    }
    expect(ctx.lastCommentCounter).toBe(0)

    // Re-enter: should play sound again
    Bridge.step.call(ctx, { x: 310, y: 200 })
    expect(ctx.state.mulleTalkObject.say).toHaveBeenCalledTimes(2)
  })

  // ─── 15. Edge cases ──────────────────────────────────────────────────

  test('step: handles missing carLoc gracefully', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)

    expect(() => {
      Bridge.step.call(ctx)
    }).not.toThrow()
  })

  test('step: handles missing boat gracefully in blocking section', () => {
    const ctx = makeCtx()
    Bridge.onCreate.call(ctx)
    ctx.insideInner = 1
    ctx.gotSail = 1
    ctx.state.driveBoat = null

    expect(() => {
      Bridge.step.call(ctx, { x: 310, y: 200 })
    }).not.toThrow()
  })

  test('step: 100 iterations do not throw or produce undefined frames', () => {
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2', 'f3', 'f4'] }, Sounds: ['s'] }
    })
    Bridge.onCreate.call(ctx)
    ctx.setDirectorMember.mockClear()

    for (let i = 0; i < 100; i++) {
      expect(() => Bridge.step.call(ctx)).not.toThrow()
    }

    const allFrames = ctx.setDirectorMember.mock.calls.map(c => c[0])
    expect(allFrames).toHaveLength(100)
    allFrames.forEach(frame => {
      expect(frame).toBeDefined()
      expect(['f0', 'f1', 'f2', 'f3', 'f4']).toContain(frame)
    })
  })

  test('step: distance calculation uses sqrt for proper Euclidean distance', () => {
    // Checkpoint at (0,0), InnerRadius=5
    // Car at (3,4) → distance = 5, should NOT be inside (< 5 is false)
    // Car at (2,2) → distance = 2.828, should be inside
    const ctx = makeCtx({
      optionalData: { checkPoints: [{ x: 0, y: 0 }] },
      myLoc: { x: 0, y: 0 }
    })
    ctx.InnerRadius = 5
    Bridge.onCreate.call(ctx)

    Bridge.step.call(ctx, { x: 3, y: 4 })
    expect(ctx.insideInner).toBe(0) // distance exactly 5, not < 5

    Bridge.step.call(ctx, { x: 2, y: 2 })
    expect(ctx.insideInner).toBe(1) // distance 2.828 < 5
  })
})
