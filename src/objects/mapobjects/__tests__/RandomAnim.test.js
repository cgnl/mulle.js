const RandomAnim = require('../RandomAnim').default

describe('RandomAnim map object (ObjectRandomAnimScript.ls)', () => {
  /**
   * ObjectRandomAnimScript is a decorative animation with random wait intervals.
   * State machine: WAITING (counter=0, waitCounter>0) → ANIMATING (counter>=1) → WAITING
   * No radius checks, no insideInner/insideOuter.
   *
   * Lingo properties: child, frameList, listLen, counter, rateCounter, waitCounter, waitTime, rate, SP
   * Lingo handlers: new, kill, init, step
   */

  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 8 },
      id: 8,
      x: 250,
      y: 180,
      position: { x: 250, y: 180 },
      myLoc: { x: 250, y: 180 },
      opt: {},
      optionalData: {},
      def: {
        FrameList: { normal: ['ra_v0', 'ra_v1', 'ra_v2'] }
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

  test('new: preserves child reference (Lingo line 5)', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx()
    RandomAnim.onCreate.call(ctx)
    expect(ctx.child).toEqual({ id: 8 })
    rnd.mockRestore()
  })

  test('new: does NOT initialize insideInner or insideOuter (unlike Pickup/Gas)', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx()
    delete ctx.insideInner
    delete ctx.insideOuter
    RandomAnim.onCreate.call(ctx)
    // RandomAnim script has NO insideInner/insideOuter in its constructor
    expect(ctx.insideInner).toBeUndefined()
    expect(ctx.insideOuter).toBeUndefined()
    rnd.mockRestore()
  })

  // ─── 2. Kill contract (`kill me`) ────────────────────────────────────

  test('kill: sets child=0 and returns 0 (Lingo kill contract)', () => {
    const ctx = makeCtx()
    ctx.child = { id: 8 }

    const result = RandomAnim.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  test('kill: returns exactly 0 (not undefined, not null)', () => {
    const ctx = makeCtx()

    const result = RandomAnim.onDestroy.call(ctx)

    expect(result).toBe(0)
  })

  // ─── 3. init: frameList source preference ────────────────────────────

  test('init: uses optionalData.frameList as primary frame source', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: { frameList: ['opt_f0', 'opt_f1'] },
      def: { FrameList: { normal: ['normal_f0'] } }
    })

    RandomAnim.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['opt_f0', 'opt_f1'])
    rnd.mockRestore()
  })

  test('init: falls back to FrameList.normal when optionalData has no frameList', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: {},
      def: { FrameList: { normal: ['ra_v0', 'ra_v1', 'ra_v2'] } }
    })

    RandomAnim.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['ra_v0', 'ra_v1', 'ra_v2'])
    rnd.mockRestore()
  })

  test('init: falls back to FrameList.normal when optionalData is undefined', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: undefined,
      def: { FrameList: { normal: ['ra_v0'] } }
    })

    RandomAnim.onCreate.call(ctx)

    expect(ctx.frameList).toEqual(['ra_v0'])
    rnd.mockRestore()
  })

  // ─── 4. init: waitTime from optionalData.Wait ────────────────────────

  test('init: reads Wait from optionalData (default 400)', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ optionalData: { Wait: 200 } })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.waitTime).toBe(200)
    rnd.mockRestore()
  })

  test('init: defaults waitTime to 400 when optionalData has no Wait', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ optionalData: {} })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.waitTime).toBe(400)
    rnd.mockRestore()
  })

  // ─── 5. init: rate from optionalData.rate ────────────────────────────

  test('init: reads rate from optionalData (default 1)', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ optionalData: { rate: 3 } })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.rate).toBe(3)
    rnd.mockRestore()
  })

  test('init: defaults rate to 1 when optionalData has no rate', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ optionalData: {} })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.rate).toBe(1)
    rnd.mockRestore()
  })

  // ─── 6. init: SP preference ──────────────────────────────────────────

  test('init: prefers SPOver when SPOver > 0', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ SPOver: 22, SPUnder: 14 })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.SP).toBe(22)
    rnd.mockRestore()
  })

  test('init: falls back to SPUnder when SPOver is 0', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ SPOver: 0, SPUnder: 14 })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.SP).toBe(14)
    rnd.mockRestore()
  })

  // ─── 7. init: listLen, counter, rateCounter, waitCounter ─────────────

  test('init: sets listLen to count of frameList', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2', 'f3'] } }
    })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.listLen).toBe(4)
    rnd.mockRestore()
  })

  test('init: sets counter=0 (idle/waiting state)', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx()
    RandomAnim.onCreate.call(ctx)
    expect(ctx.counter).toBe(0)
    rnd.mockRestore()
  })

  test('init: sets rateCounter=0', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx()
    RandomAnim.onCreate.call(ctx)
    expect(ctx.rateCounter).toBe(0)
    rnd.mockRestore()
  })

  test('init: waitCounter = waitTime + random(waitTime) (Lingo random 1..n)', () => {
    // Lingo random(n) returns 1..n
    // With waitTime=400 and Math.random()=0.5: floor(0.5*400)+1 = 201
    // waitCounter = 400 + 201 = 601
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ optionalData: {} })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.waitCounter).toBe(400 + 201)
    rnd.mockRestore()
  })

  test('init: waitCounter minimum is waitTime+1 (random(n) min is 1)', () => {
    // Math.random()=0.0: floor(0.0*400)+1 = 1
    // waitCounter = 400 + 1 = 401
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.0)
    const ctx = makeCtx({ optionalData: {} })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.waitCounter).toBe(401)
    rnd.mockRestore()
  })

  test('init: waitCounter maximum is 2*waitTime (random(n) max is n)', () => {
    // Math.random()=0.999: floor(0.999*400)+1 = 399+1 = 400
    // waitCounter = 400 + 400 = 800
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.999)
    const ctx = makeCtx({ optionalData: {} })
    RandomAnim.onCreate.call(ctx)
    expect(ctx.waitCounter).toBe(800)
    rnd.mockRestore()
  })

  // ─── 8. init: sprite loc ─────────────────────────────────────────────

  test('init: sets sprite loc to myLoc', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({ myLoc: { x: 300, y: 200 }, SPOver: 0, SPUnder: 14 })
    RandomAnim.onCreate.call(ctx)

    const locSet = (ctx.setSpriteLoc.mock.calls.length > 0) ||
      (ctx.setSpriteLocation.mock.calls.length > 0)
    expect(locSet).toBe(true)
    rnd.mockRestore()
  })

  // ─── 9. step: WAITING state ──────────────────────────────────────────

  test('step: decrements waitCounter and exits while in WAITING state', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx()
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    const initialWait = ctx.waitCounter
    RandomAnim.step.call(ctx)

    expect(ctx.waitCounter).toBe(initialWait - 1)
    expect(ctx.counter).toBe(0)
    expect(ctx.setDirectorMember).not.toHaveBeenCalled()
  })

  test('step: transitions to ANIMATING when waitCounter reaches 0', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    // Force waitCounter to 1 so next step decrements to 0
    ctx.waitCounter = 1
    RandomAnim.step.call(ctx) // waitCounter 1 → 0, exits

    expect(ctx.waitCounter).toBe(0)
    expect(ctx.counter).toBe(0) // still idle

    // Next step: waitCounter is 0, should enter ANIMATING
    RandomAnim.step.call(ctx)
    expect(ctx.counter).toBe(1)
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('f0') // frameList[0]
  })

  // ─── 10. step: ANIMATING state ──────────────────────────────────────

  test('step: displays frames in order during animation cycle', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    const frames = []
    for (let i = 0; i < 3; i++) {
      RandomAnim.step.call(ctx)
      const calls = ctx.setDirectorMember.mock.calls
      frames.push(calls[calls.length - 1][0])
    }

    expect(frames).toEqual(['f0', 'f1', 'f2'])
  })

  test('step: sets sprite to "Dummy" and resets to WAITING when animation finishes', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    // Step through all frames
    RandomAnim.step.call(ctx) // counter=1 → f0
    RandomAnim.step.call(ctx) // counter=2 → f1

    // Mock random for the new waitCounter
    const rnd2 = jest.spyOn(Math, 'random').mockReturnValue(0.25)
    RandomAnim.step.call(ctx) // counter=3 > listLen(2) → WAITING, Dummy
    rnd2.mockRestore()

    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('Dummy')
    expect(ctx.counter).toBe(0)
    expect(ctx.waitCounter).toBeGreaterThan(0)
  })

  test('step: new waitCounter after animation uses waitTime + random(waitTime)', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: { Wait: 100 },
      def: { FrameList: { normal: ['f0'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    // Play the single frame
    RandomAnim.step.call(ctx) // counter=1 → f0

    // Now finish the animation → back to WAITING
    const rnd2 = jest.spyOn(Math, 'random').mockReturnValue(0.3)
    RandomAnim.step.call(ctx) // counter=2 > listLen(1) → Dummy, new waitCounter
    rnd2.mockRestore()

    // waitTime=100, floor(0.3*100)+1 = 31
    // waitCounter = 100 + 31 = 131
    expect(ctx.waitCounter).toBe(131)
  })

  // ─── 11. step: rate as frame-skip divisor ────────────────────────────

  test('step: rate=1 advances frame every step', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: { rate: 1 },
      def: { FrameList: { normal: ['f0', 'f1'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    RandomAnim.step.call(ctx)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('f0')
    RandomAnim.step.call(ctx)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('f1')
  })

  test('step: rate=3 only advances frame every 3rd step', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: { rate: 3 },
      def: { FrameList: { normal: ['f0', 'f1', 'f2'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    // Steps 1,2: rateCounter increments but no frame advance
    RandomAnim.step.call(ctx)
    expect(ctx.rateCounter).toBe(1)
    expect(ctx.setDirectorMember).not.toHaveBeenCalled()

    RandomAnim.step.call(ctx)
    expect(ctx.rateCounter).toBe(2)
    expect(ctx.setDirectorMember).not.toHaveBeenCalled()

    // Step 3: rateCounter hits rate → advance frame
    RandomAnim.step.call(ctx)
    expect(ctx.rateCounter).toBe(0)
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('f0')
    expect(ctx.counter).toBe(1)

    // Next 3 steps → f1
    RandomAnim.step.call(ctx)
    RandomAnim.step.call(ctx)
    RandomAnim.step.call(ctx)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('f1')
    expect(ctx.counter).toBe(2)
  })

  test('step: rateCounter resets to 0 when it reaches rate', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: { rate: 2 },
      def: { FrameList: { normal: ['f0', 'f1'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    RandomAnim.step.call(ctx)
    expect(ctx.rateCounter).toBe(1)

    RandomAnim.step.call(ctx)
    expect(ctx.rateCounter).toBe(0)
    expect(ctx.counter).toBe(1)
  })

  // ─── 12. step: no radius checks ─────────────────────────────────────

  test('step: no radius checks, no sound, no inventory interaction', () => {
    const checkRadius = jest.fn()
    const playAudio = jest.fn()
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      state: {
        driveBoat: { position: { x: 400, y: 400 } },
        drivingHandlers: { checkRadius }
      },
      game: {
        mulle: { playAudio }
      }
    })

    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0
    RandomAnim.step.call(ctx, { x: 250, y: 180 }) // car right on top

    expect(checkRadius).not.toHaveBeenCalled()
    expect(playAudio).not.toHaveBeenCalled()
  })

  test('step: ignores carLoc parameter entirely', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      def: { FrameList: { normal: ['f0', 'f1'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    RandomAnim.step.call(ctx, { x: 0, y: 0 })
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('f0')

    RandomAnim.step.call(ctx, { x: 99999, y: 99999 })
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('f1')

    // Results are the same regardless of car position
    expect(ctx.setDirectorMember).toHaveBeenCalledTimes(2)
  })

  // ─── 13. Full state machine lifecycle ────────────────────────────────

  test('lifecycle: WAITING → ANIMATING → WAITING → ANIMATING cycle', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.0)
    const ctx = makeCtx({
      optionalData: { Wait: 3 },
      def: { FrameList: { normal: ['a', 'b'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    // Initial waitCounter = 3 + floor(0*3)+1 = 4
    expect(ctx.waitCounter).toBe(4)
    expect(ctx.counter).toBe(0)

    // Step through WAITING phase (4 steps)
    for (let i = 0; i < 4; i++) {
      RandomAnim.step.call(ctx)
    }
    expect(ctx.waitCounter).toBe(0)
    expect(ctx.counter).toBe(0)
    expect(ctx.setDirectorMember).not.toHaveBeenCalled()

    // ANIMATING: step 1 → f0
    RandomAnim.step.call(ctx)
    expect(ctx.counter).toBe(1)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('a')

    // ANIMATING: step 2 → f1
    RandomAnim.step.call(ctx)
    expect(ctx.counter).toBe(2)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('b')

    // ANIMATING: step 3 → counter > listLen → Dummy, back to WAITING
    const rnd2 = jest.spyOn(Math, 'random').mockReturnValue(0.0)
    RandomAnim.step.call(ctx)
    rnd2.mockRestore()
    expect(ctx.counter).toBe(0)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('Dummy')
    expect(ctx.waitCounter).toBe(4) // waitTime(3) + 1

    // WAITING again: 4 steps
    for (let i = 0; i < 4; i++) {
      RandomAnim.step.call(ctx)
    }
    expect(ctx.waitCounter).toBe(0)

    // Back to ANIMATING
    RandomAnim.step.call(ctx)
    expect(ctx.counter).toBe(1)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('a')
  })

  test('lifecycle: single-frame animation works correctly', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      def: { FrameList: { normal: ['only_frame'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 0

    // Step: show the only frame
    RandomAnim.step.call(ctx)
    expect(ctx.counter).toBe(1)
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('only_frame')

    // Next step: counter=2 > listLen=1 → Dummy, back to WAITING
    const rnd2 = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    RandomAnim.step.call(ctx)
    rnd2.mockRestore()

    expect(ctx.counter).toBe(0)
    expect(ctx.setDirectorMember).toHaveBeenLastCalledWith('Dummy')
  })

  // ─── 14. Long-running stability ──────────────────────────────────────

  test('step: 500 iterations do not throw or produce undefined frames', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.01)
    const ctx = makeCtx({
      optionalData: { Wait: 5 },
      def: { FrameList: { normal: ['f0', 'f1', 'f2', 'f3', 'f4'] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    // Use consistent randomness for each wait reset
    const rnd2 = jest.spyOn(Math, 'random').mockReturnValue(0.01)
    for (let i = 0; i < 500; i++) {
      expect(() => RandomAnim.step.call(ctx)).not.toThrow()
    }
    rnd2.mockRestore()

    // All setDirectorMember calls should have valid frame names or "Dummy"
    const validFrames = ['f0', 'f1', 'f2', 'f3', 'f4', 'Dummy']
    const allFrames = ctx.setDirectorMember.mock.calls.map(c => c[0])
    allFrames.forEach(frame => {
      expect(frame).toBeDefined()
      expect(validFrames).toContain(frame)
    })
  })

  // ─── 15. Edge cases ──────────────────────────────────────────────────

  test('init: empty frameList produces listLen=0 and step handles gracefully', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: {},
      def: { FrameList: { normal: [] } }
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    expect(ctx.listLen).toBe(0)

    ctx.waitCounter = 0

    // Step should transition immediately to Dummy since counter(1) > listLen(0)
    const rnd2 = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    RandomAnim.step.call(ctx)
    rnd2.mockRestore()

    expect(ctx.setDirectorMember).toHaveBeenCalledWith('Dummy')
    expect(ctx.counter).toBe(0)
    expect(ctx.waitCounter).toBeGreaterThan(0)
  })

  test('init: missing FrameList falls back to empty array', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx({
      optionalData: {},
      def: {}
    })
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    expect(ctx.frameList).toEqual([])
    expect(ctx.listLen).toBe(0)
  })

  test('step: waitCounter never goes below 0', () => {
    const rnd = jest.spyOn(Math, 'random').mockReturnValue(0.5)
    const ctx = makeCtx()
    RandomAnim.onCreate.call(ctx)
    rnd.mockRestore()

    ctx.waitCounter = 1

    RandomAnim.step.call(ctx)
    expect(ctx.waitCounter).toBe(0)

    // Next step should enter ANIMATING, not decrement below 0
    RandomAnim.step.call(ctx)
    expect(ctx.waitCounter).toBe(0)
    expect(ctx.counter).toBe(1) // entered ANIMATING
  })
})
