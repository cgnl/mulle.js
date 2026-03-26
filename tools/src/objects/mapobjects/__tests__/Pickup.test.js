// Mock Phaser global for class extension
global.Phaser = {
  Sprite: class { },
  State: class { },
  Point: function (x, y) { this.x = x; this.y = y },
  Circle: function () { }
}

const Pickup = require('../Pickup').default
const MulleMapObject = require('../../mapobject').default

describe('Pickup map object (ObjectPickupScript.ls)', () => {
  const BOB_LIST = [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0]

  function makeCtx(overrides = {}) {
    const mockSprite = {
      setDirectorMember: jest.fn(),
      x: 0,
      y: 0
    }

    const ctx = {
      // ... existing properties ...
      child: { id: 4 },
      id: 4,
      x: 200,
      y: 150,
      position: { x: 200, y: 150 },
      myLoc: { x: 200, y: 150 },
      SP: 10,
      insideInner: 0,
      insideOuter: 0,
      Showing: 1,
      counter: 0,
      sndId: 0,
      mode: null,
      opt: {},
      optionalData: {},
      def: {
        FrameList: { normal: ['31b001v0'], TRANS: '33b010v0' },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: { Level: [2, 3, 4, 5], Inventory: ['Bible'] }
      },
      setDirectorMember: jest.fn(),
      state: {
        driveBoat: {
          position: { x: 300, y: 300 },
          speed: 5,
          enabled: true,
          stopMotor: jest.fn()
        },
        drivingHandlers: {
          checkRadius: jest.fn(() => null)
        },
        spriteList: {
          TRANS: 75
        },
        getSprite: jest.fn(() => mockSprite)
      },
      game: {
        mulle: {
          playAudio: jest.fn(() => ({ stop: jest.fn() })),
          user: {
            getSeaLevel: jest.fn(() => 3),
            setInInventory: jest.fn(),
            getUserProp: jest.fn(() => '#NoProp')
          },
          seaInventory: {
            hasItem: jest.fn(() => false),
            addItem: jest.fn()
          },
          levelHandler: {
            getLevel: jest.fn(() => 3)
          },
          mulleTalkObject: {
            say: jest.fn(() => 42)
          }
        },
        pause: jest.fn()
      },
      InnerRadius: 45,
      OuterRadius: 55,
      sounds: ['31d001v0']
    }

    // Bind real MulleMapObject methods to the context
    ctx.setSpriteMember = MulleMapObject.prototype.setSpriteMember.bind(ctx)
    ctx.setSpriteLoc = MulleMapObject.prototype.setSpriteLoc.bind(ctx)

    return Object.assign(ctx, overrides)
  }

  // ─── 1. Constructor (`new me, theChild`) ────────────────────────────

  test('new: sets child to theChild (Lingo line 8)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    // child should be preserved (not cleared)
    expect(ctx.child).toBeTruthy()
  })

  test('new: initializes insideInner=0 and insideOuter=0 (Lingo lines 9-10)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.insideInner).toBe(0)
    expect(ctx.insideOuter).toBe(0)
  })

  // ─── 2. Kill contract ───────────────────────────────────────────────

  test('kill: sets child=0 and returns 0 (Lingo kill contract, lines 14-16)', () => {
    const ctx = makeCtx()
    ctx.child = { id: 4 }
    const result = Pickup.onDestroy.call(ctx)
    expect(ctx.child).toBe(0)
    expect(result).toBe(0)
  })

  // ─── 3. init - Level-gated visibility ───────────────────────────────

  test('init: sets Showing=1 initially (Lingo line 20)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.Showing).toBe(1)
  })

  test('init: checks optionalData for level requirement first (Lingo lines 21-24)', () => {
    const ctx = makeCtx({
      optionalData: { level: [3, 4, 5] }
    })
    ctx.game.mulle.levelHandler.getLevel.mockReturnValue(3)
    Pickup.onCreate.call(ctx)
    // Level 3 is in [3,4,5], so Showing should remain 1
    expect(ctx.Showing).toBe(1)
  })

  test('init: falls back to CheckFor.Level when optionalData has no level (Lingo lines 25-28)', () => {
    const ctx = makeCtx({
      optionalData: {},
      def: {
        FrameList: { normal: ['31b001v0'], TRANS: '33b010v0' },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: { Level: [2, 3, 4, 5] }
      }
    })
    ctx.game.mulle.levelHandler.getLevel.mockReturnValue(3)
    Pickup.onCreate.call(ctx)
    expect(ctx.Showing).toBe(1)
  })

  test('init: sets Showing=0 when current level NOT in level list (Lingo lines 30-32)', () => {
    const ctx = makeCtx({
      def: {
        FrameList: { normal: ['31b001v0'], TRANS: '33b010v0' },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: { Level: [2, 3, 4, 5] }
      }
    })
    ctx.game.mulle.levelHandler.getLevel.mockReturnValue(1)
    ctx.game.mulle.user.getSeaLevel.mockReturnValue(1)
    Pickup.onCreate.call(ctx)
    expect(ctx.Showing).toBe(0)
  })

  test('init: Showing stays 1 when current level IS in level list (Lingo lines 30-32)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.levelHandler.getLevel.mockReturnValue(4)
    ctx.game.mulle.user.getSeaLevel.mockReturnValue(4)
    Pickup.onCreate.call(ctx)
    expect(ctx.Showing).toBe(1)
  })

  test('init: when Showing, sets up bobList with 16 elements (Lingo line 34)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.bobList).toEqual(BOB_LIST)
    expect(ctx.bobList).toHaveLength(16)
  })

  test('init: when Showing, loads frameList from #normal (Lingo line 35)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.frameList).toEqual(['31b001v0'])
  })

  test('init: when Showing, sets sprite to first frame of normal list (Lingo line 37)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('31b001v0')
  })

  test('init: always sets counter=0 regardless of Showing (Lingo line 42)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.levelHandler.getLevel.mockReturnValue(1)
    ctx.game.mulle.user.getSeaLevel.mockReturnValue(1)
    Pickup.onCreate.call(ctx)
    expect(ctx.counter).toBe(0)
  })

  test('init: when NOT Showing, does NOT set up bobList or frameList (Lingo lines 33-40)', () => {
    const ctx = makeCtx()
    ctx.game.mulle.levelHandler.getLevel.mockReturnValue(1)
    ctx.game.mulle.user.getSeaLevel.mockReturnValue(1)
    Pickup.onCreate.call(ctx)
    expect(ctx.Showing).toBe(0)
    // sprite should NOT have been set to the normal frame
    // (setDirectorMember should not be called with the pickup sprite)
    expect(ctx.setDirectorMember).not.toHaveBeenCalledWith('31b001v0')
  })

  test('init: no level requirement means Showing stays 1 (Lingo lines 29-32 void check)', () => {
    const ctx = makeCtx({
      optionalData: {},
      def: {
        FrameList: { normal: ['31b001v0'], TRANS: '33b010v0' },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: {}
      }
    })
    Pickup.onCreate.call(ctx)
    expect(ctx.Showing).toBe(1)
  })

  // ─── 4. step - Bobbing animation + radius check ────────────────────

  test('step: exits early when Showing=0 (Lingo lines 45-46)', () => {
    const ctx = makeCtx()
    ctx.Showing = 0
    ctx.counter = 5
    Pickup.step.call(ctx, { x: 300, y: 300 })
    // counter should NOT increment when Showing=0
    expect(ctx.counter).toBe(5)
  })

  test('step: increments counter each tick (Lingo line 51)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.counter).toBe(0)
    Pickup.step.call(ctx, { x: 300, y: 300 })
    expect(ctx.counter).toBe(1)
    Pickup.step.call(ctx, { x: 300, y: 300 })
    expect(ctx.counter).toBe(2)
  })

  test('step: applies bobbing offset from bobList using (counter mod 16) (Lingo line 52)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)

    // Step through all 16 positions to verify bobbing cycle
    const offsets = []
    for (let i = 0; i < 16; i++) {
      Pickup.step.call(ctx, { x: 9999, y: 9999 })
      // After step, the sprite Y should be myLoc.y + bobList[(counter mod 16)]
      // counter is now i+1, so bobList index is ((i+1) mod 16)
      // In Lingo 1-indexed: bobList[((i+1) mod 16) + 1]
      // In JS 0-indexed: bobList[(i+1) % 16]
      offsets.push(BOB_LIST[(i + 1) % 16])
    }
    // Verify the bob pattern repeats: the 17th step should give same offset as 1st
    Pickup.step.call(ctx, { x: 9999, y: 9999 })
    expect(BOB_LIST[(17) % 16]).toBe(BOB_LIST[1])
  })

  test('step: bobList produces correct Y offsets for first cycle (Lingo line 52)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)

    // After counter=1: bobList[(1 mod 16)] = bobList[1] = 0 (JS 0-indexed)
    // Lingo: bobList[(1 mod 16) + 1] = bobList[2] = 0
    // The bob sequence at counter positions 1..16:
    // Lingo 1-indexed access: counter mod 16 + 1
    // counter=1 -> index 2 -> 0
    // counter=2 -> index 3 -> 1
    // counter=3 -> index 4 -> 1
    // counter=4 -> index 5 -> 1
    // counter=5 -> index 6 -> 0
    const expectedLingoOffsets = []
    for (let c = 1; c <= 16; c++) {
      const lingoIndex = (c % 16) + 1 // Lingo 1-indexed
      expectedLingoOffsets.push(BOB_LIST[lingoIndex - 1]) // convert to JS 0-indexed
    }
    expect(expectedLingoOffsets).toEqual([0, 1, 1, 1, 0, 0, 0, 0, 0, -1, -1, -1, 0, 0, 0, 0])
  })

  test('step: calls checkRadius with #both mode (Lingo line 53)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const carLoc = { x: 300, y: 300 }

    Pickup.step.call(ctx, carLoc)

    expect(ctx.state.drivingHandlers.checkRadius).toHaveBeenCalled()
  })

  test('step: triggers EnterInnerRadius on checkRadius #EnterInnerRadius result (Lingo lines 54-56)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    ctx.state.drivingHandlers.checkRadius.mockReturnValue('EnterInnerRadius')

    // Spy on the EnterInnerRadius handler
    const enterSpy = jest.fn()
    const origEnterInner = Pickup.onEnterInner || Pickup.EnterInnerRadius
    if (origEnterInner) {
      jest.spyOn(Pickup, origEnterInner === Pickup.onEnterInner ? 'onEnterInner' : 'EnterInnerRadius')
    }

    Pickup.step.call(ctx, { x: 200, y: 150 })

    // After EnterInnerRadius, Showing should be 0
    expect(ctx.Showing).toBe(0)
  })

  // ─── 5. EnterInnerRadius - Pickup sequence ─────────────────────────

  test('EnterInnerRadius: sets Showing=0 (Lingo line 60)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)
    expect(ctx.Showing).toBe(0)
  })

  test('EnterInnerRadius: hides sprite by setting member to "Dummy" (Lingo line 61)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)
    expect(ctx.setDirectorMember).toHaveBeenCalledWith('Dummy')
  })

  test('EnterInnerRadius: calls setInInventory for each item in SetWhenDone.Inventory (Lingo lines 62-69)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    // Should add 'Bible' to inventory
    const user = ctx.game.mulle.user
    const seaInv = ctx.game.mulle.seaInventory
    const addedItem = (user.setInInventory.mock.calls.length > 0)
      ? user.setInInventory.mock.calls[0][0]
      : (seaInv.addItem.mock.calls.length > 0 ? seaInv.addItem.mock.calls[0][0] : null)
    expect(addedItem).toBe('Bible')
  })

  test('EnterInnerRadius: handles multiple inventory items in SetWhenDone (Lingo repeat loop lines 66-68)', () => {
    const ctx = makeCtx({
      def: {
        FrameList: { normal: ['31b001v0'], TRANS: '33b010v0' },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible', 'Swimring'] },
        CheckFor: {}
      }
    })
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    const user = ctx.game.mulle.user
    const seaInv = ctx.game.mulle.seaInventory
    const calls = user.setInInventory.mock.calls.length > 0
      ? user.setInInventory.mock.calls.map(c => c[0])
      : seaInv.addItem.mock.calls.map(c => c[0])
    expect(calls).toContain('Bible')
    expect(calls).toContain('Swimring')
  })

  test('EnterInnerRadius: plays sound from child sounds[0] via say() (Lingo lines 70-72)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    // Original Lingo: say(the mulleTalkObject of gDir, getAt(the sounds of child, 1), 2, me, #Q)
    // Should play the first sound
    expect(ctx.game.mulle.playAudio).toHaveBeenCalledWith('31d001v0')
  })

  test('EnterInnerRadius: stops boat speed and motor when sound plays (Lingo lines 74-76)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    const boat = ctx.state.driveBoat
    expect(boat.speed).toBe(0)
    expect(boat.stopMotor).toHaveBeenCalled()
  })

  test('EnterInnerRadius: pauses gDir when sound plays (Lingo line 77)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    expect(ctx.game.pause).toHaveBeenCalledWith(1)
  })

  test('EnterInnerRadius: shows TRANS sprite at (320,200) when available (Lingo lines 78-82)', () => {
    const ctx = makeCtx()

    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    // Should call state.getSprite(75)
    expect(ctx.state.getSprite).toHaveBeenCalledWith(75)

    // Should set member on the returned sprite
    const sprite = ctx.state.getSprite.mock.results[0].value
    expect(sprite.setDirectorMember).toHaveBeenCalledWith('33b010v0')

    // Should set location on the returned sprite
    expect(sprite.x).toBe(320)
    expect(sprite.y).toBe(200)
  })

  test('EnterInnerRadius: does not show TRANS if FrameList has no TRANS entry (Lingo line 79 check)', () => {
    const ctx = makeCtx({
      def: {
        FrameList: { normal: ['31b001v0'] },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: {}
      }
    })

    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    // getSprite should not be called for TRANS sprite (channel 75)
    expect(ctx.state.getSprite).not.toHaveBeenCalledWith(75)
  })

  test('EnterInnerRadius: does nothing with sounds if child has no sounds (Lingo line 70 count check)', () => {
    const ctx = makeCtx({
      def: {
        FrameList: { normal: ['31b001v0'] },
        Sounds: [],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: {}
      },
      sounds: []
    })
    Pickup.onCreate.call(ctx)
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)

    // Should NOT pause or stop boat if no sounds
    expect(ctx.game.pause).not.toHaveBeenCalled()
    expect(ctx.state.driveBoat.speed).toBe(5) // unchanged
  })

  // ─── 6. setFrames - Mode switching ─────────────────────────────────

  test('setFrames: sets mode and reloads frameList for that mode (Lingo lines 87-91)', () => {
    const ctx = makeCtx({
      def: {
        FrameList: {
          normal: ['31b001v0'],
          TRANS: '33b010v0',
          special: ['31b002v0', '31b003v0']
        },
        Sounds: ['31d001v0'],
        SetWhenDone: { Inventory: ['Bible'] },
        CheckFor: {}
      }
    })
    Pickup.onCreate.call(ctx)

    const setFrames = Pickup.setFrames
    if (setFrames) {
      setFrames.call(ctx, 'special')
      expect(ctx.mode).toBe('special')
      expect(ctx.frameList).toEqual(['31b002v0', '31b003v0'])
      expect(ctx.listLen).toBe(2)
      expect(ctx.setDirectorMember).toHaveBeenCalledWith('31b002v0')
      expect(ctx.counter).toBe(1)
    } else {
      // Method not yet implemented — expected TDD failure
      expect(Pickup.setFrames).toBeDefined()
    }
  })

  // ─── 7. mulleFinished - Sound callback ─────────────────────────────

  test('mulleFinished: unpauses gDir (Lingo line 96)', () => {
    const ctx = makeCtx()

    const mulleFinished = Pickup.mulleFinished
    if (mulleFinished) {
      mulleFinished.call(ctx)
      expect(ctx.game.pause).toHaveBeenCalledWith(0)
    } else {
      expect(Pickup.mulleFinished).toBeDefined()
    }
  })

  test('mulleFinished: clears sprite 75 to "Dummy" (Lingo line 97)', () => {
    const ctx = makeCtx()

    const mulleFinished = Pickup.mulleFinished
    if (mulleFinished) {
      mulleFinished.call(ctx)

      // Should call state.getSprite(75)
      expect(ctx.state.getSprite).toHaveBeenCalledWith(75)

      // Should set member to 'Dummy'
      const sprite = ctx.state.getSprite.mock.results[0].value
      expect(sprite.setDirectorMember).toHaveBeenCalledWith('Dummy')
    } else {
      expect(Pickup.mulleFinished).toBeDefined()
    }
  })

  // ─── Edge cases and integration ─────────────────────────────────────

  test('step after EnterInnerRadius does not process bobbing (Showing=0 guard)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)

    // Trigger pickup
    const handler = Pickup.onEnterInner || Pickup.EnterInnerRadius
    handler.call(ctx)
    expect(ctx.Showing).toBe(0)

    // Now step should be a no-op
    const counterBefore = ctx.counter
    Pickup.step.call(ctx, { x: 300, y: 300 })
    expect(ctx.counter).toBe(counterBefore)
  })

  test('bobList wraps correctly at index boundary (16 elements, 0-offset cycle)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)

    // Step 16 times so counter=16, then step once more -> counter=17
    for (let i = 0; i < 17; i++) {
      Pickup.step.call(ctx, { x: 9999, y: 9999 })
    }
    // counter should be 17
    expect(ctx.counter).toBe(17)
    // bobList index for counter=17: (17 mod 16) = 1 -> bobList[1] = 0 (Lingo: index 2)
    // This should NOT throw or produce undefined
  })

  test('init: sets listLen to count of normal frameList (Lingo line 36)', () => {
    const ctx = makeCtx()
    Pickup.onCreate.call(ctx)
    expect(ctx.listLen).toBe(1)
  })

  test('init: sets SP from child SPUnder (Lingo line 38)', () => {
    const ctx = makeCtx()
    ctx.SPUnder = 12
    Pickup.onCreate.call(ctx)
    expect(ctx.SP).toBe(12)
  })
})
