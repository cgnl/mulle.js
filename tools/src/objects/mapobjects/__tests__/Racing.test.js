const Racing = require('../Racing').default

describe('Racing map object (ObjectRacingScript.ls)', () => {
  function makeCtx (overrides = {}) {
    const ctx = {
      child: { id: 7 },
      id: 7,
      x: 300,
      y: 200,
      position: { x: 300, y: 200 },
      myLoc: { x: 300, y: 200 },
      SPUnder: 20,
      insideInner: 0,
      opt: {},
      optionalData: {
        EnterDir: 5,
        Board: { x: 250, y: 180 }
      },
      def: {
        FrameList: {
          Board: ['31b045v0'],
          Goal: ['31b046v0']
        },
        Sounds: ['race_start', 'race_finish', 'race_medal'],
        SetWhenDone: {
          missions: [8],
          medals: [5]
        }
      },
      sounds: ['race_start', 'race_finish', 'race_medal'],
      setDirectorMember: jest.fn(),
      setSpriteMember: jest.fn(),
      setSpriteLoc: jest.fn(),
      setFieldText: jest.fn(),
      state: {
        drivingHandlers: {
          checkRadius: jest.fn(() => 'nothing'),
          calcDirection: jest.fn(() => 5)
        }
      },
      game: {
        mulle: {
          playAudio: jest.fn(() => ({ stop: jest.fn() })),
          sound: {
            play: jest.fn(() => 42),
            setVol: jest.fn()
          },
          user: {
            isMissionCompleted: jest.fn(() => true),
            isMissionGiven: jest.fn(() => false),
            addCompletedMission: jest.fn(),
            getUserName: jest.fn(() => 'MULLE M')
          },
          createMedal: jest.fn(),
          frameTempo: 15
        }
      },
      InnerRadius: 40,
      OuterRadius: 80
    }

    return Object.assign(ctx, overrides)
  }

  // ── 1. Constructor (`new me, theChild`) ──────────────────────────────

  test('new: sets child to theChild (Lingo line 9)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    expect(ctx.child).toBeTruthy()
  })

  test('new: initialises insideInner=0 (Lingo line 10)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    expect(ctx.insideInner).toBe(0)
  })

  // ── 2. Kill contract (`kill me`) ─────────────────────────────────────

  test('kill: sets child=0 and returns 0 (Lingo kill contract, lines 14-17)', () => {
    const ctx = makeCtx()
    ctx.child = { id: 99 }

    const result = Racing.onDestroy.call(ctx)

    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  // ── 3. init – Mission gate ───────────────────────────────────────────

  test('init: sets displaying=0 when mission NOT completed AND NOT given (Lingo lines 21-24)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => false)
    ctx.game.mulle.user.isMissionGiven = jest.fn(() => false)
    Racing.onCreate.call(ctx)

    Racing.init.call(ctx)

    expect(ctx.displaying).toBe(0)
  })

  test('init: sets displaying=1 when mission IS completed (Lingo line 22)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => true)
    ctx.game.mulle.user.isMissionGiven = jest.fn(() => false)
    Racing.onCreate.call(ctx)

    Racing.init.call(ctx)

    expect(ctx.displaying).toBe(1)
  })

  test('init: sets displaying=1 when mission IS given but not completed (Lingo line 22)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => false)
    ctx.game.mulle.user.isMissionGiven = jest.fn(() => true)
    Racing.onCreate.call(ctx)

    Racing.init.call(ctx)

    expect(ctx.displaying).toBe(1)
  })

  test('init: exits early when displaying=0, does not set racing state (Lingo line 24)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => false)
    ctx.game.mulle.user.isMissionGiven = jest.fn(() => false)
    Racing.onCreate.call(ctx)

    Racing.init.call(ctx)

    expect(ctx.displaying).toBe(0)
    // racing should NOT have been initialised
    expect(ctx.racing).toBeUndefined()
  })

  test('init: sets nrOfLetters=6 (Lingo line 26)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.nrOfLetters).toBe(6)
  })

  test('init: sets racing=0 (Lingo line 27)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.racing).toBe(0)
  })

  test('init: sets delayCounter=0 (Lingo line 28)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.delayCounter).toBe(0)
  })

  test('init: sets fps from frameTempo (Lingo line 29)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.frameTempo = 20
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.fps).toBe(20)
  })

  test('init: sets nrOfTimesPassed=0 (Lingo line 30)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.nrOfTimesPassed).toBe(0)
  })

  test('init: reads mustEnterFrom from optionalData.EnterDir (Lingo line 31)', () => {
    const ctx = makeCtx()
    ctx.optionalData.EnterDir = 12
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.mustEnterFrom).toBe(12)
  })

  test('init: defaults mustEnterFrom to 1 when EnterDir is void (Lingo lines 32-34)', () => {
    const ctx = makeCtx({ optionalData: {} })
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.mustEnterFrom).toBe(1)
  })

  test('init: sets saveName to "CustomRacingDB" (Lingo line 35)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.saveName).toBe('CustomRacingDB')
  })

  test('init: sets FieldName to "CustomRacingField" (Lingo line 36)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    expect(ctx.FieldName).toBe('CustomRacingField')
  })

  test('init: creates default hiscores [186:"PIA P", 232:"STAF S"] when no save exists (Lingo lines 38-39)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    // Lingo property list: [186: "PIA P", 232: "STAF S"]
    // Sorted ascending by key (time in tenths of seconds)
    expect(ctx.hiscores).toBeDefined()
    expect(ctx.hiscores).toEqual([
      { time: 186, name: 'PIA P' },
      { time: 232, name: 'STAF S' }
    ])
  })

  test('init: hiscores are sorted ascending by time (Lingo line 43)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    expect(ctx.hiscores[0].time).toBeLessThanOrEqual(ctx.hiscores[1].time)
  })

  test('init: sets Board sprite member from FrameList.Board[0] at SPUnder (Lingo lines 45-46)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    // sprite tempSp (SPUnder) gets Board member
    expect(ctx.setSpriteMember).toHaveBeenCalledWith(20, '31b045v0')
  })

  test('init: sets Board sprite location from optionalData.Board (Lingo lines 47-50)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    expect(ctx.setSpriteLoc).toHaveBeenCalledWith(20, { x: 250, y: 180 })
  })

  test('init: defaults Board location to (0,0) when optionalData.Board is void (Lingo lines 48-49)', () => {
    const ctx = makeCtx({ optionalData: { EnterDir: 5 } })
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    expect(ctx.setSpriteLoc).toHaveBeenCalledWith(20, { x: 0, y: 0 })
  })

  test('init: sets Goal sprite at SPUnder+1 at myLoc (Lingo lines 51-52)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    expect(ctx.setSpriteMember).toHaveBeenCalledWith(21, '31b046v0')
    expect(ctx.setSpriteLoc).toHaveBeenCalledWith(21, { x: 300, y: 200 })
  })

  test('init: sets field sprites at SPUnder+2 and SPUnder+3 at Board offset (Lingo lines 55-58)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    // Field 1: Board + (-75, -25) + (0,0)*(1-1) = (250-75, 180-25) = (175, 155)
    expect(ctx.setSpriteMember).toHaveBeenCalledWith(22, 'CustomRacingField1')
    expect(ctx.setSpriteLoc).toHaveBeenCalledWith(22, { x: 175, y: 155 })

    // Field 2: Board + (-75, -25) + (0,30)*(2-1) = (175, 155+30) = (175, 185)
    expect(ctx.setSpriteMember).toHaveBeenCalledWith(23, 'CustomRacingField2')
    expect(ctx.setSpriteLoc).toHaveBeenCalledWith(23, { x: 175, y: 185 })
  })

  test('init: calls showTime to display initial hiscores (Lingo line 54)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    // showTime displays top 2 scores: "18:60 PIA P" and "23:20 STAF S"
    // time 186 => 186/10=18 remainder 6 => "18:60"
    // time 232 => 232/10=23 remainder 2 => "23:20"
    // Lingo: char 1 to 6 of "PIA P" = "PIA P" (5 chars, within limit)
    // Lingo: char 1 to 6 of "STAF S" = "STAF S" (6 chars exactly)
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '18:60 PIA P')
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField2', '23:20 STAF S')
  })

  // ── 4. step – Guard and dispatch ─────────────────────────────────────

  test('step: exits early when displaying is falsy (Lingo line 62)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    ctx.displaying = 0
    ctx.racing = 1
    ctx.counter = 10

    Racing.step.call(ctx, { x: 100, y: 100 })

    // counter should NOT have incremented
    expect(ctx.counter).toBe(10)
  })

  test('step: calls checkRadius with #Inner (not #both) (Lingo line 63)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)

    Racing.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalledWith(
      expect.anything(),
      expect.anything(),
      expect.anything(),
      'Inner'
    )
  })

  test('step: dispatches EnterInnerRadius on #EnterInnerRadius result (Lingo lines 64-65)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'EnterInnerRadius')
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.step.call(ctx, { x: 300, y: 200 })

    // EnterInnerRadius should have fired — when not racing and correct dir,
    // racing should now be 1
    expect(ctx.racing).toBe(1)
  })

  test('step: dispatches ExitInnerRadius on #ExitInnerRadius result (Lingo lines 66-67)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.enteredFrom = 1
    ctx.nrOfTimesPassed = 0
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'ExitInnerRadius')
    // Exit from different direction than mustEnterFrom → nrOfTimesPassed++
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 13)

    Racing.step.call(ctx, { x: 400, y: 400 })

    expect(ctx.nrOfTimesPassed).toBe(1)
  })

  test('step: increments counter when racing (Lingo line 69)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.counter = 0
    ctx.fps = 15
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.counter).toBe(1)
  })

  test('step: formats timer display as "seconds:tenths0" while racing (Lingo line 70)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.counter = 29 // 29 frames at 15fps
    ctx.fps = 15
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    // counter becomes 30 after increment
    // Lingo: string(counter / fps) = string(30/15) = "2"
    // string(10 * (counter mod fps) / fps) = string(10 * (30 mod 15) / 15) = string(0) = "0"
    // result: "2:00"
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '2:00')
  })

  test('step: timer display for fractional time (Lingo integer division)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.counter = 22 // will become 23 after increment
    ctx.fps = 15
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    // counter = 23
    // Lingo integer division: 23 / 15 = 1 (truncated)
    // 23 mod 15 = 8
    // 10 * 8 / 15 = 80 / 15 = 5 (truncated)
    // result: "1:50"
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '1:50')
  })

  test('step: delayCounter decrements when racing=0 and delayCounter>0 (Lingo lines 72-79)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.delayCounter = 30
    ctx.thisTime = '14:50 MULLE'
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.delayCounter).toBe(29)
  })

  test('step: blink mode shows thisTime when (delayCounter mod 6) = 5 (Lingo line 74)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.delayCounter = 12 // after decrement = 11, 11 mod 6 = 5 → show thisTime
    ctx.thisTime = '14:50 MULLE'
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '14:50 MULLE')
  })

  test('step: blink mode shows " " when (delayCounter mod 6) = 0 (Lingo line 76)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.delayCounter = 7 // after decrement = 6, 6 mod 6 = 0 → show " "
    ctx.thisTime = '14:50 MULLE'
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', ' ')
  })

  test('step: calls showTime when delayCounter reaches 0 (Lingo line 78)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.delayCounter = 1 // after decrement = 0 → showTime
    ctx.hiscores = [
      { time: 186, name: 'PIA P' },
      { time: 232, name: 'STAF S' }
    ]
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    Racing.step.call(ctx, { x: 100, y: 100 })

    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '18:60 PIA P')
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField2', '23:20 STAF S')
  })

  // ── 5. showTime ──────────────────────────────────────────────────────

  test('showTime: formats and displays top 2 hiscores (Lingo lines 82-86)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.hiscores = [
      { time: 145, name: 'ANNA A' },
      { time: 200, name: 'BERT B' }
    ]

    Racing.showTime.call(ctx)

    // 145 => 145/10=14, 145 mod 10=5 => "14:50"
    // name truncated to 6 chars: "ANNA A"
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '14:50 ANNA A')
    // 200 => 200/10=20, 200 mod 10=0 => "20:00"
    // name truncated to 6 chars: "BERT B"
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField2', '20:00 BERT B')
  })

  test('showTime: truncates names to nrOfLetters=6 (Lingo char 1 to nrOfLetters)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.nrOfLetters = 6
    ctx.hiscores = [
      { time: 100, name: 'LONGNAME' },
      { time: 200, name: 'AVERYLONGNAME' }
    ]

    Racing.showTime.call(ctx)

    // "LONGNAME" truncated to 6 = "LONGNA"
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', '10:00 LONGNA')
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField2', '20:00 AVERYL')
  })

  // ── 6. enterOuterRadius / ExitOuterRadius ────────────────────────────

  test('enterOuterRadius: is a no-op (Lingo line 88)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)

    expect(() => {
      if (typeof Racing.onEnterOuter === 'function') {
        Racing.onEnterOuter.call(ctx)
      }
    }).not.toThrow()
  })

  test('ExitOuterRadius: is a no-op (Lingo line 91)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)

    expect(() => {
      if (typeof Racing.onExitOuter === 'function') {
        Racing.onExitOuter.call(ctx)
      }
    }).not.toThrow()
  })

  // ── 7. EnterInnerRadius ──────────────────────────────────────────────

  test('EnterInnerRadius: completes mission on first entry if not yet completed (Lingo lines 94-96)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => false)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.game.mulle.user.addCompletedMission).toHaveBeenCalledWith(8)
  })

  test('EnterInnerRadius: does NOT re-complete mission if already completed (Lingo line 94)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => true)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.game.mulle.user.addCompletedMission).not.toHaveBeenCalled()
  })

  test('EnterInnerRadius: calculates direction with calcDirection(carLoc, myLoc) (Lingo line 97)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    const carLoc = { x: 310, y: 210 }

    Racing.onEnterInner.call(ctx, carLoc)

    expect(ctx.state.drivingHandlers.calcDirection).toHaveBeenCalledWith(
      carLoc,
      { x: 300, y: 200 }
    )
  })

  test('EnterInnerRadius: direction diff wraps around 16 when diff>8 (Lingo line 99)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 1
    // calcDirection returns 14 → abs(1-14)=13, 13>8 → 16-13=3, 3<=3 → correct dir
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 14)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(1)
  })

  test('EnterInnerRadius: diff<=3 means correct direction (Lingo line 100)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 5
    // calcDirection returns 7 → abs(5-7)=2, 2<=3 → correct dir
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 7)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(1)
  })

  test('EnterInnerRadius: diff>3 means wrong direction, sets enteredFrom=-1 (Lingo line 134)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 5
    // calcDirection returns 10 → abs(5-10)=5, 5<=8, 5>3 → wrong dir
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 10)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(-1)
  })

  test('EnterInnerRadius: correct dir + NOT racing → starts race (Lingo lines 123-131)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.racing).toBe(1)
    expect(ctx.counter).toBe(0)
    expect(ctx.nrOfTimesPassed).toBe(0)
  })

  test('EnterInnerRadius: starting race plays sounds[0] (Lingo lines 124-125)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // Lingo: play(gSound, getAt(the sounds of child, 1), #EFFECT)
    const allPlayed = ctx.game.mulle.playAudio.mock.calls.flat()
      .concat(ctx.game.mulle.sound.play.mock.calls.flat())
    expect(allPlayed).toContain('race_start')
  })

  test('EnterInnerRadius: starting race clears both field texts (Lingo lines 128-130)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField1', ' ')
    expect(ctx.setFieldText).toHaveBeenCalledWith('CustomRacingField2', ' ')
  })

  test('EnterInnerRadius: correct dir + racing + nrOfTimesPassed=1 → finishes race (Lingo lines 104-121)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 225 // 225 frames at 15fps = 15.0 seconds
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.racing).toBe(0)
    expect(ctx.delayCounter).toBe(60)
  })

  test('EnterInnerRadius: finish race calculates tempTime in tenths of seconds (Lingo line 107)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 225 // 10 * 225 / 15 = 150 tenths
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    ctx.game.mulle.user.getUserName = jest.fn(() => 'MULLE M')

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // tempTime = 10 * 225 / 15 = 150
    // thisTime = "15:00 MULLE "
    expect(ctx.thisTime).toBe('15:00 MULLE ')
  })

  test('EnterInnerRadius: finish with tempTime < 150 awards medal (Lingo lines 110-112)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 200 // 10 * 200 / 15 = 133 tenths < 150
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // Medal awarded: medalId = SetWhenDone.medals[0] = 5
    // Sound: sounds[2] = 'race_medal'
    expect(ctx.game.mulle.createMedal).toHaveBeenCalledWith(5, 'race_medal')
  })

  test('EnterInnerRadius: finish with tempTime >= 150 plays sounds[1] instead of medal (Lingo lines 113-115)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 225 // 10 * 225 / 15 = 150 → NOT < 150
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // No medal
    expect(ctx.game.mulle.createMedal).not.toHaveBeenCalled()
    // Should play sounds[1] = 'race_finish'
    const allPlayed = ctx.game.mulle.playAudio.mock.calls.flat()
      .concat(ctx.game.mulle.sound.play.mock.calls.flat())
    expect(allPlayed).toContain('race_finish')
  })

  test('EnterInnerRadius: finish updates hiscores when time beats last entry (Lingo lines 117-120)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 150 // 10 * 150 / 15 = 100 tenths
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    ctx.game.mulle.user.getUserName = jest.fn(() => 'WINNER')

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // tempTime = 100, last hiscore time = 232
    // 232 >= 100 → replace last entry
    // New hiscores sorted: [100:"WINNER", 186:"PIA P"]
    expect(ctx.hiscores).toEqual([
      { time: 100, name: 'WINNER' },
      { time: 186, name: 'PIA P' }
    ])
  })

  test('EnterInnerRadius: finish does NOT update hiscores when time is worse than last (Lingo line 117)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 450 // 10 * 450 / 15 = 300 tenths
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // tempTime = 300, last hiscore time = 232
    // 232 >= 300 is false → no update
    expect(ctx.hiscores).toEqual([
      { time: 186, name: 'PIA P' },
      { time: 232, name: 'STAF S' }
    ])
  })

  test('EnterInnerRadius: finish with void userName uses empty string (Lingo line 109)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.counter = 150
    ctx.fps = 15
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    ctx.game.mulle.user.getUserName = jest.fn(() => undefined)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // tempName should be EMPTY (Lingo) → ""
    // thisTime should still format correctly with empty name
    expect(ctx.thisTime).toMatch(/^10:00/)
  })

  test('EnterInnerRadius: correct dir + racing + nrOfTimesPassed!=1 → no finish (Lingo line 105)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 0
    ctx.counter = 100
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // Race should still be ongoing
    expect(ctx.racing).toBe(1)
  })

  // ── 8. ExitInnerRadius ───────────────────────────────────────────────

  test('ExitInnerRadius: does nothing when not racing (Lingo line 138)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.nrOfTimesPassed = 0

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    expect(ctx.nrOfTimesPassed).toBe(0)
  })

  test('ExitInnerRadius: exit same direction + enteredFrom=-1 → nrOfTimesPassed-- (Lingo lines 141-143)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.enteredFrom = -1
    ctx.nrOfTimesPassed = 2
    ctx.mustEnterFrom = 5
    // Exit from same direction as mustEnterFrom (diff<=3)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    expect(ctx.nrOfTimesPassed).toBe(1)
  })

  test('ExitInnerRadius: exit different direction + enteredFrom=1 → nrOfTimesPassed++ (Lingo lines 145-147)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.enteredFrom = 1
    ctx.nrOfTimesPassed = 0
    ctx.mustEnterFrom = 5
    // Exit from different direction (diff>3)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 13)

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    expect(ctx.nrOfTimesPassed).toBe(1)
  })

  test('ExitInnerRadius: exit same direction + enteredFrom=1 → no change (Lingo lines 141-147)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.enteredFrom = 1
    ctx.nrOfTimesPassed = 0
    ctx.mustEnterFrom = 5
    // Exit from same direction (diff<=3)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    // Neither branch matches: same dir but enteredFrom=1 → no decrement
    // same dir means diff<=3 → enters first if-block, but enteredFrom is 1 not -1 → skip
    expect(ctx.nrOfTimesPassed).toBe(0)
  })

  test('ExitInnerRadius: exit different direction + enteredFrom=-1 → no change (Lingo lines 141-147)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.enteredFrom = -1
    ctx.nrOfTimesPassed = 1
    ctx.mustEnterFrom = 5
    // Exit from different direction (diff>3)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 13)

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    // Different dir → enters else-block, but enteredFrom is -1 not 1 → skip
    expect(ctx.nrOfTimesPassed).toBe(1)
  })

  test('ExitInnerRadius: wraps direction diff same as EnterInnerRadius (Lingo line 141)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.enteredFrom = -1
    ctx.nrOfTimesPassed = 3
    ctx.mustEnterFrom = 1
    // calcDirection returns 15 → abs(1-15)=14, 14>8 → 16-14=2, 2<=3 → same dir
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 15)

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    // Same dir + enteredFrom=-1 → decrement
    expect(ctx.nrOfTimesPassed).toBe(2)
  })

  // ── 9. Full race lifecycle ───────────────────────────────────────────

  test('full lifecycle: start race → complete lap → finish (Lingo complete flow)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 5
    ctx.fps = 15

    // 1. Enter inner radius from correct direction → start race
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })
    expect(ctx.racing).toBe(1)
    expect(ctx.counter).toBe(0)

    // 2. Exit inner radius from different direction → nrOfTimesPassed++
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 13)
    Racing.onExitInner.call(ctx, { x: 400, y: 400 })
    expect(ctx.nrOfTimesPassed).toBe(1)

    // 3. Simulate some frames passing
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')
    for (let i = 0; i < 200; i++) {
      Racing.step.call(ctx, { x: 400, y: 400 })
    }
    expect(ctx.counter).toBe(200)

    // 4. Re-enter from correct direction with nrOfTimesPassed=1 → finish
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    ctx.game.mulle.user.isMissionCompleted = jest.fn(() => true)
    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.racing).toBe(0)
    expect(ctx.delayCounter).toBe(60)

    // tempTime = 10 * 200 / 15 = 133 → under 150 → medal
    expect(ctx.game.mulle.createMedal).toHaveBeenCalledWith(5, 'race_medal')
  })

  test('full lifecycle: blink countdown after finish (Lingo delayCounter 60→0)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 0
    ctx.delayCounter = 12
    ctx.thisTime = '13:30 MULLE'
    ctx.state.drivingHandlers.checkRadius = jest.fn(() => 'nothing')

    const fieldTexts = []
    for (let i = 0; i < 12; i++) {
      ctx.setFieldText = jest.fn()
      Racing.step.call(ctx, { x: 100, y: 100 })
      const call = ctx.setFieldText.mock.calls.find(c => c[0] === 'CustomRacingField1')
      if (call) fieldTexts.push(call[1])
    }

    // After 12 steps, delayCounter should be 0 and showTime should have been called
    expect(ctx.delayCounter).toBe(0)
    // The blink pattern should include both thisTime and " "
    expect(fieldTexts).toContain('13:30 MULLE')
    expect(fieldTexts).toContain(' ')
  })

  // ── 10. Direction edge cases ─────────────────────────────────────────

  test('direction diff exactly 3 is accepted as correct direction (Lingo <=3)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 5
    ctx.racing = 0
    // diff = abs(5 - 8) = 3, 3<=3 → accepted
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 8)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(1)
    expect(ctx.racing).toBe(1)
  })

  test('direction diff exactly 4 is rejected (Lingo >3 threshold)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 5
    ctx.racing = 0
    // diff = abs(5 - 9) = 4, 4>3 → rejected
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 9)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(-1)
    expect(ctx.racing).toBe(0)
  })

  test('direction wrapping: mustEnterFrom=16, calcDir=1 → diff=1 → accepted', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 16
    ctx.racing = 0
    // abs(16-1) = 15, 15>8 → 16-15 = 1, 1<=3 → accepted
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 1)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(1)
  })

  test('direction wrapping: mustEnterFrom=2, calcDir=15 → diff=3 → accepted', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 2
    ctx.racing = 0
    // abs(2-15) = 13, 13>8 → 16-13 = 3, 3<=3 → accepted
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 15)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(1)
  })

  test('direction wrapping: mustEnterFrom=2, calcDir=14 → diff=4 → rejected', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.mustEnterFrom = 2
    ctx.racing = 0
    // abs(2-14) = 12, 12>8 → 16-12 = 4, 4>3 → rejected
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 14)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.enteredFrom).toBe(-1)
  })

  // ── 11. Hiscore edge cases ───────────────────────────────────────────

  test('hiscore: new time equal to last entry still replaces it (Lingo >= comparison)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.fps = 10
    // Make counter such that tempTime = 232 (exact match with last hiscore)
    ctx.counter = 232 // 10 * 232 / 10 = 232
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    ctx.game.mulle.user.getUserName = jest.fn(() => 'NEW   ')

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // 232 >= 232 is true → should replace
    expect(ctx.hiscores).toEqual([
      { time: 186, name: 'PIA P' },
      { time: 232, name: 'NEW   ' }
    ])
  })

  test('hiscore: new record replaces last entry and list stays sorted (Lingo addProp + sort)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.fps = 10
    ctx.counter = 100 // tempTime = 100
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    ctx.game.mulle.user.getUserName = jest.fn(() => 'FAST F')

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    // Should replace 232, add 100, sort → [100, 186]
    expect(ctx.hiscores[0].time).toBe(100)
    expect(ctx.hiscores[1].time).toBe(186)
  })

  // ── 12. Lap counting (inverted logic) ────────────────────────────────

  test('lap counting: enter wrong dir then exit same dir → nrOfTimesPassed decrements', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.mustEnterFrom = 5

    // Enter from wrong direction
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 13)
    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })
    expect(ctx.enteredFrom).toBe(-1)

    // Exit from same direction as mustEnterFrom (diff<=3)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    // enteredFrom=-1 + exit same dir → decrement
    expect(ctx.nrOfTimesPassed).toBe(0)
  })

  test('lap counting: enter correct dir then exit different dir → nrOfTimesPassed increments', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 0
    ctx.mustEnterFrom = 5

    // Enter from correct direction (starts race, but we set racing=1 already)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)
    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })
    // This re-starts the race since nrOfTimesPassed was 0 and racing was 1 but nrOfTimesPassed!=1
    // enteredFrom should be 1

    // Exit from different direction (diff>3)
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 13)
    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    // enteredFrom=1 + exit different dir → increment
    expect(ctx.nrOfTimesPassed).toBeGreaterThanOrEqual(1)
  })

  test('lap counting: nrOfTimesPassed can go negative (Lingo has no floor check)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 0
    ctx.enteredFrom = -1
    ctx.mustEnterFrom = 5
    // Exit from same direction → decrement
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onExitInner.call(ctx, { x: 400, y: 400 })

    expect(ctx.nrOfTimesPassed).toBe(-1)
  })

  // ── 13. Medal threshold boundary ─────────────────────────────────────

  test('medal threshold: tempTime=149 (just under 150) → medal awarded', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.fps = 10
    ctx.counter = 149 // tempTime = 10 * 149 / 10 = 149
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.game.mulle.createMedal).toHaveBeenCalledWith(5, 'race_medal')
  })

  test('medal threshold: tempTime=150 (exactly 150) → NO medal (Lingo < not <=)', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.fps = 10
    ctx.counter = 150 // tempTime = 150
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.game.mulle.createMedal).not.toHaveBeenCalled()
  })

  test('medal threshold: tempTime=151 → NO medal, plays sounds[1] instead', () => {
    const ctx = makeCtx()
    Racing.onCreate.call(ctx)
    Racing.init.call(ctx)
    ctx.racing = 1
    ctx.nrOfTimesPassed = 1
    ctx.fps = 10
    ctx.counter = 151 // tempTime = 151
    ctx.mustEnterFrom = 5
    ctx.state.drivingHandlers.calcDirection = jest.fn(() => 5)

    Racing.onEnterInner.call(ctx, { x: 300, y: 200 })

    expect(ctx.game.mulle.createMedal).not.toHaveBeenCalled()
    const allPlayed = ctx.game.mulle.playAudio.mock.calls.flat()
      .concat(ctx.game.mulle.sound.play.mock.calls.flat())
    expect(allPlayed).toContain('race_finish')
  })
})
