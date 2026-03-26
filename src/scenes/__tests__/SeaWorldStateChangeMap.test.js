/**
 * @fileoverview changeMap behavior tests for SeaWorldState
 *
 * Lingo references:
 * - 05/Dir.ls line 169-182: getNewMapId + #Relational/#Absolute mapCoordinate update
 * - 05/Dir.ls line 190-206: fog/underMap/weatherRenderer changeMap flow
 * - 05/Dir.ls line 207-214: theRealInit gate for setTopology + object pass
 */

if (!global.Phaser) {
  global.Phaser = {}
}
if (!global.Phaser.State) {
  global.Phaser.State = class State {}
}
if (!global.Phaser.Sprite) {
  global.Phaser.Sprite = class Sprite {}
}
if (!global.Phaser.Group) {
  global.Phaser.Group = class Group {}
}
if (!global.Phaser.Point) {
  global.Phaser.Point = class Point {
    constructor (x, y) {
      this.x = x
      this.y = y
    }
  }
}

jest.mock('../../objects/mapobject', () => {
  const ctor = jest.fn().mockImplementation(function MockMapObject (game, id, pos, opt) {
    this.game = game
    this.id = id
    this.pos = pos
    this.opt = opt
  })
  return {
    __esModule: true,
    default: ctor
  }
})

jest.mock('../../objects/ambiencesound', () => {
  const ctor = jest.fn().mockImplementation(function MockAmbienceSound () {
    this.activate = jest.fn()
    this.cleanup = jest.fn()
  })
  return {
    __esModule: true,
    default: ctor
  }
})

const MulleMapObject = require('../../objects/mapobject').default
const AmbienceSound = require('../../objects/ambiencesound').default
const MulleDriveBoat = require('../../objects/driveboat').default
const SeaWorldState = require('../seaworld').default

function makePoint (x, y) {
  return {
    x,
    y,
    clone () {
      return makePoint(this.x, this.y)
    }
  }
}

function makeState ({ fog = false, underMap = null } = {}) {
  const state = Object.create(SeaWorldState.prototype)

  const map = {
    MapId: 52,
    MapImage: '30b052v0',
    Topology: '30t052v0',
    getSpecial: jest.fn((key) => {
      if (key === '#Fog') return fog ? 1 : null
      if (key === '#windspeed' || key === '#WindSpeed') return '#2'
      return null
    }),
    getUnderMapImage: jest.fn(() => underMap)
  }

  const currentMap = makePoint(3, 4)

  state.activeWorld = {
    currentMap,
    getNewMapId: jest.fn(() => 43),
    getMap: jest.fn(() => map)
  }

  state.weather = {
    changeMap: jest.fn()
  }

  state.seaBackground = { visible: true }
  state.seaMapSprite = { visible: true }

  state.updateBackgroundFromMap = jest.fn()
  state.createFogLayer = jest.fn()
  state.removeFogLayer = jest.fn()
  state.updateUnderMapLayer = jest.fn()
  state.removeUnderMapLayer = jest.fn()
  state.updateTopology = jest.fn()
  state.clearMapObjects = jest.fn()
  state.createMapObjectsForTile = jest.fn()
  state.updateMinimap = jest.fn()
  state.createBackgroundForArea = jest.fn()

  return { state, map }
}

describe('SeaWorldState.changeMap (Lingo-aligned)', () => {
  test('uses #Relational mode by default and updates mapCoordinate from world.currentMap', () => {
    const { state } = makeState()

    const ok = state.changeMap(makePoint(1, 0))

    expect(ok).toBe(true)
    expect(state.activeWorld.getNewMapId).toHaveBeenCalled()
    const args = state.activeWorld.getNewMapId.mock.calls[0]
    expect(args[1]).toBe('#Relational')
    expect(state.mapCoordinate).toEqual({ x: 3, y: 4, clone: expect.any(Function) })
  })

  test('fog map follows Dir.ls line 193-196 flow', () => {
    const { state } = makeState({ fog: true })

    state.changeMap(makePoint(1, 0), false)

    expect(state.weather.changeMap).toHaveBeenCalledWith('hide', '#2')
    expect(state.updateBackgroundFromMap).not.toHaveBeenCalled()
    expect(state.createFogLayer).toHaveBeenCalled()
    // Lingo keeps Water/background channel active; only map channel is hidden.
    expect(state.seaBackground.visible).toBe(true)
    expect(state.seaMapSprite.visible).toBe(false)
  })

  test('non-fog map follows Dir.ls line 197-206 flow including underMap', () => {
    const { state, map } = makeState({ fog: false, underMap: '30u001v0' })

    state.changeMap(makePoint(0, 1), false)

    expect(state.weather.changeMap).toHaveBeenCalledWith(undefined, '#2')
    expect(state.updateBackgroundFromMap).toHaveBeenCalledWith(map)
    expect(state.updateUnderMapLayer).toHaveBeenCalledWith('30u001v0')
    expect(state.removeFogLayer).toHaveBeenCalled()
    expect(state.seaBackground.visible).toBe(true)
    expect(state.seaMapSprite.visible).toBe(true)
  })

  test('realInit skips topology/object pass (Dir.ls line 207)', () => {
    const { state } = makeState()

    state.changeMap(makePoint(2, 2), true, true)

    expect(state.activeWorld.getNewMapId).toHaveBeenCalled()
    const args = state.activeWorld.getNewMapId.mock.calls[0]
    expect(args[1]).toBe('#Absolute')
    expect(state.updateTopology).not.toHaveBeenCalled()
    expect(state.clearMapObjects).not.toHaveBeenCalled()
    expect(state.createMapObjectsForTile).not.toHaveBeenCalled()
    expect(state.updateMinimap).toHaveBeenCalled()
  })
})

function makeObjectPassState ({ objects, objectDefs, boatObjectDefs, rDests, mapCoordinate, boatPos } = {}) {
  const state = Object.create(SeaWorldState.prototype)

  const mapDef = {
    MapId: 52,
    objects: objects || []
  }

  state.activeWorld = {
    getMap: jest.fn(() => mapDef),
    rDests: rDests || {}
  }

  state.mapCoordinate = mapCoordinate || makePoint(3, 4)
  state.game = {
    mulle: {
      ObjectsDB: objectDefs || {},
      BoatObjectsDB: boatObjectDefs || {}
    }
  }

  state.mapObjects = {
    add: jest.fn()
  }

  state.dir = {
    spriteList: {
      ObjectsUnder: 100,
      ObjectsOver: 200
    },
    _spriteMembers: {}
  }

  const pos = boatPos || makePoint(320, 240)
  state.driveBoat = {
    position: {
      x: pos.x,
      y: pos.y,
      copyFrom: jest.fn(function (p) {
        this.x = p.x
        this.y = p.y
      })
    }
  }

  state.boatSprite = {
    position: {
      copyFrom: jest.fn()
    }
  }

  return { state, mapDef }
}

describe('SeaWorldState.createMapObjectsForTile (Dir.ls goThroughObjects)', () => {
  beforeEach(() => {
    MulleMapObject.mockClear()
  })

  test('#rdest only shows when rDests[objectId] equals mapCoordinate (Dir.ls 253-257)', () => {
    const objects = [[101, { x: 10, y: 20 }, {}]]
    const objectDefs = {
      101: { type: '#rdest' }
    }

    const { state } = makeObjectPassState({
      objects,
      objectDefs,
      rDests: { 101: makePoint(1, 1) },
      mapCoordinate: makePoint(3, 4)
    })

    state.createMapObjectsForTile(3, 4)
    expect(state.mapObjects.add).not.toHaveBeenCalled()

    state.activeWorld.rDests = { 101: makePoint(3, 4) }
    state.createMapObjectsForTile(3, 4)
    expect(state.mapObjects.add).toHaveBeenCalledTimes(1)
  })

  // Lingo Dir.ls line 273 BUG: writes to correctedCarLoc (dead local) instead of
  // correctedBoatLoc (parent scope), so position correction NEVER applies.
  // We replicate this bug for faithful parity.
  test('#Correct does NOT apply correction due to Lingo correctedCarLoc bug (Dir.ls 273)', () => {
    const objects = [[201, { x: 100, y: 120 }, { InnerRadius: 80 }]]
    const objectDefs = {
      201: { type: '#Correct' }
    }

    const { state } = makeObjectPassState({
      objects,
      objectDefs,
      boatPos: makePoint(110, 125)
    })

    state.createMapObjectsForTile(3, 4)

    // Not created as visual object
    expect(state.mapObjects.add).not.toHaveBeenCalled()
    // Position is NOT corrected (Lingo bug: correctedCarLoc is a dead variable)
    expect(state.driveBoat.position.copyFrom).not.toHaveBeenCalled()
    expect(state.boatSprite.position.copyFrom).not.toHaveBeenCalled()
  })

  test('#Correct does NOT use setCoordinate due to Lingo correctedCarLoc bug', () => {
    const objects = [[202, { x: 100, y: 120 }, { InnerRadius: 80 }]]
    const objectDefs = {
      202: { type: '#Correct' }
    }

    const { state } = makeObjectPassState({
      objects,
      objectDefs,
      boatPos: makePoint(110, 125)
    })

    state.driveBoat.setCoordinate = jest.fn()

    state.createMapObjectsForTile(3, 4)

    expect(state.mapObjects.add).not.toHaveBeenCalled()
    // Position correction never fires due to correctedCarLoc bug
    expect(state.driveBoat.setCoordinate).not.toHaveBeenCalled()
  })

  test('non-rdest and non-Correct objects are created (Dir.ls 276-292)', () => {
    const objects = [[301, { x: 200, y: 220 }, { Show: 'normal' }]]
    const objectDefs = {
      301: { type: '#dest' }
    }

    const { state } = makeObjectPassState({
      objects,
      objectDefs
    })

    state.createMapObjectsForTile(3, 4)

    // OverSP/UnderSP are always injected into opt with current counter values
    expect(MulleMapObject).toHaveBeenCalledWith(
      state.game, 301, { x: 200, y: 220 },
      expect.objectContaining({ Show: 'normal', OverSP: 200, UnderSP: 100 })
    )
    expect(state.mapObjects.add).toHaveBeenCalledTimes(1)
  })

  test('clears ObjectsUnder/ObjectsOver sprite slots to Dummy before pass (Dir.ls 231-236)', () => {
    const { state } = makeObjectPassState({
      objects: [[301, { x: 200, y: 220 }, {}]],
      objectDefs: { 301: { type: '#dest' } }
    })

    state.dir._spriteMembers[100] = 'oldUnder1'
    state.dir._spriteMembers[105] = 'oldUnder6'
    state.dir._spriteMembers[200] = 'oldOver1'
    state.dir._spriteMembers[205] = 'oldOver6'

    state.createMapObjectsForTile(3, 4)

    expect(state.dir._spriteMembers[100]).toBe('Dummy')
    expect(state.dir._spriteMembers[105]).toBe('Dummy')
    expect(state.dir._spriteMembers[200]).toBe('Dummy')
    expect(state.dir._spriteMembers[205]).toBe('Dummy')
  })

  test('clears object sprite slots even when map has no objects', () => {
    const { state, mapDef } = makeObjectPassState({
      objects: [],
      objectDefs: {}
    })
    mapDef.objects = []

    state.dir._spriteMembers[100] = 'oldUnder1'
    state.dir._spriteMembers[200] = 'oldOver1'

    state.createMapObjectsForTile(3, 4)

    expect(state.dir._spriteMembers[100]).toBe('Dummy')
    expect(state.dir._spriteMembers[200]).toBe('Dummy')
  })

  test('clears sprite slots even when map objects list is undefined', () => {
    const { state, mapDef } = makeObjectPassState({
      objects: [],
      objectDefs: {}
    })
    mapDef.objects = undefined

    state.dir._spriteMembers[100] = 'oldUnder1'
    state.dir._spriteMembers[200] = 'oldOver1'

    state.createMapObjectsForTile(3, 4)

    expect(state.dir._spriteMembers[100]).toBe('Dummy')
    expect(state.dir._spriteMembers[200]).toBe('Dummy')
  })

  test('assigns sequential OverSP/UnderSP from sprite counters (Dir.ls 238-289)', () => {
    const objects = [
      [401, { x: 10, y: 20 }, { a: 1 }],
      [402, { x: 30, y: 40 }, { b: 2 }]
    ]
    const objectDefs = {
      401: { type: '#dest', SpriteInfo: { over: 2, Under: 1 } },
      402: { type: '#dest', SpriteInfo: { over: 1, Under: 2 } }
    }

    const { state } = makeObjectPassState({ objects, objectDefs })

    state.createMapObjectsForTile(3, 4)

    expect(MulleMapObject).toHaveBeenCalledTimes(2)
    const firstOpt = MulleMapObject.mock.calls[0][3]
    const secondOpt = MulleMapObject.mock.calls[1][3]

    expect(firstOpt.OverSP).toBe(200)
    expect(firstOpt.UnderSP).toBe(100)
    expect(secondOpt.OverSP).toBe(202)
    expect(secondOpt.UnderSP).toBe(101)
  })

  // Lingo has NO pre-init budget guard — it always calls init() and adds objects
  // even if sprite slots would overflow. The counter just keeps incrementing.
  test('does NOT skip objects when sprite slot budget overflows (Lingo parity)', () => {
    const objects = [
      [501, { x: 10, y: 20 }, {}],
      [502, { x: 30, y: 40 }, {}]
    ]
    const objectDefs = {
      501: { type: '#dest', SpriteInfo: { over: 6, Under: 0 } },
      502: { type: '#dest', SpriteInfo: { over: 1, Under: 0 } }
    }

    const { state } = makeObjectPassState({ objects, objectDefs })

    state.createMapObjectsForTile(3, 4)

    // Both objects are created — Lingo never pre-checks budget
    expect(MulleMapObject).toHaveBeenCalledTimes(2)
    expect(MulleMapObject.mock.calls[0][1]).toBe(501)
    expect(MulleMapObject.mock.calls[1][1]).toBe(502)
  })

  test('resolves sea object defs from BoatObjectsDB when ObjectsDB lacks id', () => {
    const objects = [[610, { x: 10, y: 20 }, {}]]
    const { state } = makeObjectPassState({
      objects,
      objectDefs: {},
      boatObjectDefs: {
        610: { type: '#dest', SpriteInfo: { Under: 1 } }
      }
    })

    state.createMapObjectsForTile(3, 4)

    expect(MulleMapObject).toHaveBeenCalledTimes(1)
    expect(state.game.mulle.ObjectsDB[610]).toEqual({ type: '#dest', SpriteInfo: { Under: 1 } })
  })

  test('skips object when mapObject.init returns false (Dir.ls tmpShowIt gate)', () => {
    MulleMapObject.mockImplementationOnce(() => ({
      init: jest.fn(() => false)
    }))

    const { state } = makeObjectPassState({
      objects: [[701, { x: 1, y: 2 }, {}]],
      objectDefs: {
        701: { type: '#dest', SpriteInfo: { Under: 1 } }
      }
    })

    state.createMapObjectsForTile(3, 4)

    expect(MulleMapObject).toHaveBeenCalledTimes(1)
    expect(state.mapObjects.add).not.toHaveBeenCalled()
  })

  test('adds object when mapObject.init returns true', () => {
    MulleMapObject.mockImplementationOnce(() => ({
      init: jest.fn(() => true)
    }))

    const { state } = makeObjectPassState({
      objects: [[702, { x: 3, y: 4 }, {}]],
      objectDefs: {
        702: { type: '#dest', SpriteInfo: { Under: 1 } }
      }
    })

    state.createMapObjectsForTile(3, 4)

    expect(MulleMapObject).toHaveBeenCalledTimes(1)
    expect(state.mapObjects.add).toHaveBeenCalledTimes(1)
  })

  // Lingo parity: checkFor/ifFound conditional logic lives inside Object.init
  // (lines 57-130), NOT as a separate pre-gate before init. The goThroughObjects
  // handler does NOT call doCheck() — it calls init() which internally handles
  // the checkFor/ifFound gating and returns tmpShowIt=0 when #NoDisplay applies.
  test('delegates conditional display to init (no separate doCheck pre-gate, Lingo parity)', () => {
    // Object where init returns false (simulating checkFor → #NoDisplay)
    MulleMapObject.mockImplementationOnce(() => ({
      init: jest.fn(() => false)
    }))

    const { state } = makeObjectPassState({
      objects: [[704, { x: 5, y: 6 }, {}]],
      objectDefs: {
        704: { type: '#dest', SpriteInfo: { Under: 1 } }
      }
    })

    state.createMapObjectsForTile(3, 4)

    expect(MulleMapObject).toHaveBeenCalledTimes(1)
    expect(state.mapObjects.add).not.toHaveBeenCalled()
  })

  test('adds object when init returns true (checkFor passes)', () => {
    MulleMapObject.mockImplementationOnce(() => ({
      init: jest.fn(() => true)
    }))

    const { state } = makeObjectPassState({
      objects: [[705, { x: 7, y: 8 }, {}]],
      objectDefs: {
        705: { type: '#dest', SpriteInfo: { Under: 1 } }
      }
    })

    state.createMapObjectsForTile(3, 4)

    expect(MulleMapObject).toHaveBeenCalledTimes(1)
    expect(state.mapObjects.add).toHaveBeenCalledTimes(1)
  })

  // Lingo Object.init receives: (theSprites, theLoc, theOptional, theCarLoc)
  // JS passes: (overCounter, underCounter, boatLoc, carLoc)
  // The JS init functions don't use these args (they access this.state/this.opt),
  // but we pass them for potential future parity with Lingo's init signature.
  test('passes init args with counters, boat loc, and car loc (Dir.ls line 281)', () => {
    const init = jest.fn(() => true)
    MulleMapObject.mockImplementationOnce(() => ({ init }))

    const { state } = makeObjectPassState({
      objects: [[703, { x: 3, y: 4 }, {}]],
      objectDefs: {
        703: { type: '#dest', SpriteInfo: { over: 2, Under: 1 } }
      },
      boatPos: makePoint(321, 222)
    })

    state.createMapObjectsForTile(3, 4)

    expect(init).toHaveBeenCalledWith(
      0,
      0,
      expect.objectContaining({ x: 321, y: 222 }),
      expect.objectContaining({ x: 321, y: 222 })
    )
  })
})

describe('SeaWorldState.prepareToLeave (Dir.ls line 298+)', () => {
  function makeLeaveState () {
    const state = Object.create(SeaWorldState.prototype)

    state.isLeaving = false
    state.mapCoordinate = makePoint(3, 4)
    state.stopAmbientSounds = jest.fn()
    state.go = jest.fn()
    state.activateinterface = jest.fn()
    state.driveBoat = {
      save: jest.fn(() => ({ direction: 12, speed: 3 })),
      position: makePoint(320, 240)
    }

    const user = {
      setDrivingInfo: jest.fn()
    }

    const gMulleGlobals = {
      setWhereFrom: jest.fn(),
      WhereFrom: ''
    }

    state.game = {
      mulle: {
        user,
        gMulleGlobals
      }
    }

    return { state, user, gMulleGlobals }
  }

  test('returns early when already leaving (Dir.ls line 299-301)', () => {
    const { state } = makeLeaveState()
    state.isLeaving = true

    state.prepareToLeave('04')

    expect(state.stopAmbientSounds).not.toHaveBeenCalled()
  })

  test('sets leave flags and deactivates ambience/interface', () => {
    const { state } = makeLeaveState()

    state.prepareToLeave('06')

    expect(state.isLeaving).toBe(true)
    expect(state.nextDir).toBe('06')
    expect(state.stopAmbientSounds).toHaveBeenCalled()
    expect(state.activateinterface).toHaveBeenCalledWith(false)
  })

  test('sets WhereFrom to 05 and stores map in save payload', () => {
    const { state, user, gMulleGlobals } = makeLeaveState()

    state.prepareToLeave('06')

    expect(gMulleGlobals.setWhereFrom).toHaveBeenCalledWith('05')
    const payload = user.setDrivingInfo.mock.calls[0][0]
    expect(payload.map).toEqual({ x: 3, y: 4, clone: expect.any(Function) })
  })

  test('toDir 04/03 clears driving info and uses home transPic default', () => {
    const { state, user } = makeLeaveState()

    state.prepareToLeave('04')

    expect(user.setDrivingInfo).toHaveBeenCalledWith(0)
    expect(state.transPic).toBe('33b018v0')
    expect(state.go).toHaveBeenCalledWith('Leave')
  })

  test('toDir 08 uses TransTmp8 and keeps save payload', () => {
    const { state, user } = makeLeaveState()

    state.prepareToLeave('08')

    expect(user.setDrivingInfo).toHaveBeenCalledWith(expect.objectContaining({ map: state.mapCoordinate }))
    expect(state.transPic).toBe('TransTmp8')
    expect(state.go).toHaveBeenCalledWith('Leave')
  })

  test('other dirs use default transPic/transSnd', () => {
    const { state } = makeLeaveState()

    state.prepareToLeave('06')

    expect(state.transPic).toBe('33b007v0')
    expect(state.transSnd).toBe('33e007v0')
    expect(state.go).toHaveBeenCalledWith('Leave')
  })
})

describe('SeaWorldState transition callsites use prepareToLeave', () => {
  function makeTransitionState () {
    const state = Object.create(SeaWorldState.prototype)
    state.saveSession = jest.fn()
    state.stopAmbientSounds = jest.fn()
    state.prepareToLeave = jest.fn()
    state.showMessage = jest.fn()
    state.showSeaMap = jest.fn()
    state.targetDestination = { id: 9, name: 'Test', scene: 'boatyard' }

    state.game = {
      state: {
        states: {
          boatyard: {},
          fisherman: {}
        },
        start: jest.fn()
      },
      time: {
        events: {
          add: jest.fn((delay, cb) => cb())
        }
      }
    }

    return state
  }

  test('returnToBoatyard delegates to prepareToLeave with home dir', () => {
    const state = makeTransitionState()

    state.returnToBoatyard()

    expect(state.saveSession).toHaveBeenCalled()
    expect(state.prepareToLeave).toHaveBeenCalledWith('04')
    expect(state.game.state.start).toHaveBeenCalledWith('boatyard')
  })

  test('arriveAtDestination uses prepareToLeave for non-boatyard scene', () => {
    const state = makeTransitionState()
    state.targetDestination = { id: 2, name: 'Fish', scene: 'fisherman' }

    state.arriveAtDestination()

    expect(state.saveSession).toHaveBeenCalledWith({ id: 2 })
    expect(state.prepareToLeave).toHaveBeenCalledWith('06')
    expect(state.game.state.start).toHaveBeenCalledWith('fisherman')
  })

  test('transition fallback still starts scene even when go() exists', () => {
    const state = makeTransitionState()
    state.go = jest.fn()

    state.returnToBoatyard()

    expect(state.prepareToLeave).toHaveBeenCalledWith('04')
    expect(state.game.state.start).toHaveBeenCalledWith('boatyard')
  })
})

describe('SeaWorldState.stepMapObjects', () => {
  test('calls step on enabled map objects with boat position', () => {
    const state = Object.create(SeaWorldState.prototype)
    const pos = { x: 320, y: 240 }
    const stepA = jest.fn()
    const stepB = jest.fn()

    state.driveBoat = { position: pos }
    state.mapObjects = {
      forEach: (cb) => {
        cb({ enabled: true, step: stepA })
        cb({ enabled: false, step: stepB })
        cb({ enabled: true })
      }
    }

    state.stepMapObjects()

    expect(stepA).toHaveBeenCalledWith(pos)
    expect(stepB).not.toHaveBeenCalled()
  })

  test('dispatches outer/inner enter and exit hooks by radius', () => {
    const state = Object.create(SeaWorldState.prototype)
    const pos = {
      x: 10,
      y: 10,
      distance: () => 5
    }
    const obj = {
      enabled: true,
      position: { x: 10, y: 10 },
      OuterRadius: 20,
      InnerRadius: 10,
      enteredOuter: false,
      enteredInner: false,
      onEnterOuter: jest.fn(),
      onEnterInner: jest.fn(),
      onExitOuter: jest.fn(),
      onExitInner: jest.fn()
    }

    state.driveBoat = { position: pos }
    state.mapObjects = {
      forEach: (cb) => cb(obj)
    }

    state.stepMapObjects()

    expect(obj.onEnterOuter).toHaveBeenCalled()
    expect(obj.onEnterInner).toHaveBeenCalled()
    expect(obj.enteredOuter).toBe(true)
    expect(obj.enteredInner).toBe(true)

    // Move boat far away and ensure exit hooks fire
    state.driveBoat.position = {
      x: 200,
      y: 200,
      distance: () => 300
    }
    state.stepMapObjects()

    expect(obj.onExitOuter).toHaveBeenCalled()
    expect(obj.onExitInner).toHaveBeenCalled()
    expect(obj.enteredOuter).toBe(false)
    expect(obj.enteredInner).toBe(false)
  })
})

describe('SeaWorldState.activateinterface', () => {
  test('toggles inputEnabled on UI groups and markers', () => {
    const state = Object.create(SeaWorldState.prototype)
    const markerA = { inputEnabled: true }
    const markerB = { inputEnabled: true }

    state.destinationGroup = {
      inputEnableChildren: true,
      forEach: (cb) => {
        cb(markerA)
        cb(markerB)
      }
    }
    state.minimapGroup = {
      inputEnableChildren: true
    }

    state.activateinterface(false)

    expect(state.interfaceActive).toBe(false)
    expect(state.destinationGroup.inputEnableChildren).toBe(false)
    expect(state.minimapGroup.inputEnableChildren).toBe(false)
    expect(markerA.inputEnabled).toBe(false)
    expect(markerB.inputEnabled).toBe(false)
  })
})

describe('SeaWorldState.loadSession lifecycle', () => {
  test('applies boat position before changeMap object pass', () => {
    const state = Object.create(SeaWorldState.prototype)
    const callOrder = []

    state.game = {
      mulle: {
        lastSeaSession: {
          mapCoordinate: makePoint(4, 5),
          boatPosition: makePoint(321, 222),
          boatDirection: 7
        }
      }
    }

    state.driveBoat = {
      position: {
        set: jest.fn(() => {
          callOrder.push('setPosition')
        })
      },
      direction: 0,
      speed: 0
    }

    state.changeMap = jest.fn(() => {
      callOrder.push('changeMap')
      return true
    })

    state.loadSession()

    expect(callOrder).toEqual(['setPosition', 'changeMap'])
  })

  test('restores map and boat state, marks entered object flags', () => {
    const state = Object.create(SeaWorldState.prototype)
    const objA = { id: 99, enteredInner: false, enteredOuter: false }
    const objB = { id: 11, enteredInner: false, enteredOuter: false }

    state.game = {
      mulle: {
        lastSeaSession: {
          mapCoordinate: makePoint(4, 5),
          boatPosition: makePoint(321, 222),
          boatDirection: 7,
          mapObject: 11
        }
      }
    }

    state.mapObjects = {
      forEach: (cb) => {
        cb(objA)
        cb(objB)
      }
    }

    state.driveBoat = {
      position: { set: jest.fn() },
      direction: 0
    }

    state.changeMap = jest.fn(() => true)

    const ok = state.loadSession()

    expect(ok).toBe(true)
    expect(state.changeMap).toHaveBeenCalledWith(state.game.mulle.lastSeaSession.mapCoordinate, true, undefined)
    expect(state.driveBoat.position.set).toHaveBeenCalledWith(321, 222)
    expect(state.driveBoat.direction).toBe(7)
    expect(objA.enteredInner).toBe(false)
    expect(objA.enteredOuter).toBe(false)
    expect(objB.enteredInner).toBe(true)
    expect(objB.enteredOuter).toBe(true)
  })

  test('restores boat speed from session payload', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.game = {
      mulle: {
        lastSeaSession: {
          mapCoordinate: makePoint(4, 5),
          boatPosition: makePoint(321, 222),
          boatDirection: 7,
          boatSpeed: 2.5
        }
      }
    }
    state.driveBoat = {
      position: { set: jest.fn() },
      direction: 0,
      speed: 0
    }
    state.changeMap = jest.fn(() => true)

    state.loadSession()

    expect(state.driveBoat.speed).toBe(2.5)
  })

  test('uses user drivingInfo fallback when lastSeaSession is absent', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.game = {
      mulle: {
        lastSeaSession: null,
        user: {
          getDrivingInfo: jest.fn(() => ({
            map: makePoint(6, 7),
            position: { x: 111, y: 222 },
            direction: 9,
            speed: 1.25
          }))
        }
      }
    }
    state.driveBoat = {
      position: { set: jest.fn() },
      direction: 0,
      speed: 0
    }
    state.changeMap = jest.fn(() => true)

    const ok = state.loadSession()

    expect(ok).toBe(true)
    expect(state.changeMap).toHaveBeenCalledWith({ x: 6, y: 7, clone: expect.any(Function) }, true, undefined)
    expect(state.driveBoat.position.set).toHaveBeenCalledWith(111, 222)
    expect(state.driveBoat.direction).toBe(9)
    expect(state.driveBoat.speed).toBe(1.25)
  })
})

describe('SeaWorldState Lingo-mode startup', () => {
  beforeEach(() => {
    AmbienceSound.mockClear()
  })

  test('startDrivingMode enables direct sailing and hides map markers', () => {
    const state = Object.create(SeaWorldState.prototype)

    state.navigationMode = 'map'
    state.targetDestination = { id: 9 }
    state.destinationGroup = { visible: true }
    state.driveBoat = {
      enabled: false,
      position: makePoint(111, 222)
    }
    state.boatSprite = {
      visible: false,
      scale: { setTo: jest.fn() },
      position: { copyFrom: jest.fn() }
    }
    state.instructionText = { text: '' }

    state.startDrivingMode()

    expect(state.navigationMode).toBe('sailing')
    expect(state.targetDestination).toBe(null)
    expect(state.destinationGroup.visible).toBe(false)
    expect(state.driveBoat.enabled).toBe(true)
    expect(state.boatSprite.visible).toBe(true)
    expect(state.boatSprite.scale.setTo).toHaveBeenCalledWith(0.7)
    expect(state.boatSprite.position.copyFrom).toHaveBeenCalledWith(state.driveBoat.position)
    expect(state.instructionText.text).toBe('Vaar met de pijltjes of WASD')
  })

  test('startDrivingMode does not rescale when using driveBoat as visual sprite', () => {
    const state = Object.create(SeaWorldState.prototype)

    state.destinationGroup = null
    state.driveBoat = {
      enabled: false,
      position: makePoint(100, 200),
      scale: { setTo: jest.fn() }
    }
    state.boatSprite = state.driveBoat
    state.activateinterface = jest.fn()

    state.startDrivingMode()

    expect(state.driveBoat.scale.setTo).not.toHaveBeenCalled()
    expect(state.activateinterface).toHaveBeenCalledWith(true)
  })

  test('playAmbientSounds uses AmbienceSound only (no legacy music track)', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.game = {
      mulle: {
        playAudio: jest.fn()
      }
    }

    state.playAmbientSounds()

    expect(AmbienceSound).toHaveBeenCalledWith(state.game)
    expect(state.ambienceSound.activate).toHaveBeenCalledWith(true)
    expect(state.game.mulle.playAudio).not.toHaveBeenCalled()
  })
})

describe('SeaWorldState steering/map boundary/weather drift TDD', () => {
  test('updateBoatDirection maps angle to 8-dir visual + 16-dir drive direction', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.driveBoat = { setDirection: jest.fn() }
    state.setBoatSpriteDirection = jest.fn()

    // Angle 0 = east
    state.updateBoatDirection(0)
    expect(state.driveBoat.setDirection).toHaveBeenLastCalledWith(4)
    expect(state.setBoatSpriteDirection).toHaveBeenLastCalledWith(3)

    // Angle PI/2 = south
    state.updateBoatDirection(Math.PI / 2)
    expect(state.driveBoat.setDirection).toHaveBeenLastCalledWith(8)
    expect(state.setBoatSpriteDirection).toHaveBeenLastCalledWith(5)

    // Angle PI = west
    state.updateBoatDirection(Math.PI)
    expect(state.driveBoat.setDirection).toHaveBeenLastCalledWith(12)
    expect(state.setBoatSpriteDirection).toHaveBeenLastCalledWith(7)
  })

  test('spawnBoatFromEdge uses spawn line position and direction', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.driveBoat = {
      position: { set: jest.fn() },
      setDirection: jest.fn()
    }
    state.boatSprite = {
      position: { set: jest.fn() }
    }
    state.setBoatSpriteDirection = jest.fn()

    const spawnLine = { pos: { x: 111, y: 222 }, dir: { x: 100, y: 0 } }
    const edgeSpy = jest.spyOn(MulleDriveBoat, 'getSpawnLineForEdge').mockReturnValue(spawnLine)
    const dirSpy = jest.spyOn(MulleDriveBoat, 'getDirectionFromSpawnLine').mockReturnValue(13)

    state.spawnBoatFromEdge('south')

    expect(MulleDriveBoat.getSpawnLineForEdge).toHaveBeenCalledWith('south')
    expect(MulleDriveBoat.getDirectionFromSpawnLine).toHaveBeenCalledWith(spawnLine)
    expect(state.driveBoat.position.set).toHaveBeenCalledWith(111, 222)
    expect(state.driveBoat.setDirection).toHaveBeenCalledWith(13)
    expect(state.boatSprite.position.set).toHaveBeenCalledWith(111, 222)
    expect(state.setBoatSpriteDirection).toHaveBeenCalledWith(7)

    edgeSpy.mockRestore()
    dirSpy.mockRestore()
  })

  test('checkMapBoundaries wraps position after successful map transition', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.driveBoat = {
      x: 5,
      y: 120,
      position: { set: jest.fn(), x: 5, y: 120 }
    }
    state.boatSprite = {
      position: { set: jest.fn() }
    }
    state.changeMap = jest.fn(() => true)

    state.checkMapBoundaries()

    expect(state.changeMap).toHaveBeenCalledWith(expect.objectContaining({ x: -1, y: 0 }), false, undefined)
    expect(state.driveBoat.position.set).toHaveBeenCalledWith(628, 120)
    expect(state.boatSprite.position.set).toHaveBeenCalledWith(628, 120)
  })

  test('update applies weather drift during sailing and checks boundaries', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.game = {
      mulle: {
        loopMaster: null,
        cursor: null
      }
    }
    state.navigationMode = 'sailing'
    state.driveBoat = {
      position: { x: 100, y: 200 },
      direction: 8
    }
    state.weather = {
      update: jest.fn(),
      getWindVelPoint: jest.fn(() => ({ x: 50, y: -20 })),
      getWaveInfo: jest.fn(() => [0, 0, 0])
    }
    state.checkMapBoundaries = jest.fn()
    state.stepMapObjects = jest.fn()
    state.boatSprite = null
    state.targetDestination = null
    state.ambienceSound = null
    state.speedText = null
    state.propulsionText = null
    state.terrainText = null
    state.energyGaugeGroup = null

    state.update()

    expect(state.weather.update).toHaveBeenCalled()
    expect(state.driveBoat.position.x).toBeCloseTo(100.5)
    expect(state.driveBoat.position.y).toBeCloseTo(199.8)
    expect(state.checkMapBoundaries).toHaveBeenCalled()
    expect(state.stepMapObjects).toHaveBeenCalled()
  })
})

describe('SeaWorldState topology fallback TDD', () => {
  test('updateTopology uses map-image derivation when topology atlas frame is unavailable', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.topBitmap = {}
    state.topSprite = null
    state.seaMapSprite = {}
    state.generateOpenWaterTopology = jest.fn()
    state.generateTopologyFromSeaMapSprite = jest.fn()
    state.game = {
      cache: {
        checkImageKey: jest.fn(() => false)
      }
    }

    state.updateTopology('30t029v0')

    expect(state.generateTopologyFromSeaMapSprite).toHaveBeenCalled()
  })

  test('generateTopologyFromSeaMapSprite falls back to open water when no map sprite exists', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.topBitmap = {}
    state.seaMapSprite = null
    state.generateOpenWaterTopology = jest.fn()

    state.generateTopologyFromSeaMapSprite()

    expect(state.generateOpenWaterTopology).toHaveBeenCalled()
  })
})

describe('SeaWorldState overlay pause behavior', () => {
  test('pause(true/false) toggles driveBoat enabled in sailing mode', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.navigationMode = 'sailing'
    state.driveBoat = { enabled: true }

    state.pause(true)
    expect(state.overlayPaused).toBe(true)
    expect(state.driveBoat.enabled).toBe(false)

    state.pause(false)
    expect(state.overlayPaused).toBe(false)
    expect(state.driveBoat.enabled).toBe(true)
  })
})

describe('SeaWorldState MapDisplay integration', () => {
  test('startMapMode toggles map display visibility and mode via controller', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.mapDisplayGroup = { visible: false }
    state.mapDisplayController = {
      displaying: false,
      mouseUp: jest.fn(function () { this.displaying = true })
    }
    state.syncMapDisplayVisuals = jest.fn()

    state.startMapMode()

    expect(state.mapDisplayController.mouseUp).toHaveBeenCalled()
    expect(state.mode).toBe('Waiting')
    expect(state.mapDisplayGroup.visible).toBe(true)
    expect(state.syncMapDisplayVisuals).toHaveBeenCalled()
  })

  test('syncMapDisplayVisuals applies controller members and marker location', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.mapDisplayController = {
      displaying: true,
      mapMember: { dirFile: 'boten_05.DXR', member: 82 },
      picMember: { dirFile: 'boten_05.DXR', member: 90 },
      markerLoc: { x: 111, y: 222 },
      mouseObjects: []
    }
    state.mapDisplayGroup = { visible: false }
    state.mapDisplaySprite = { setDirectorMember: jest.fn() }
    state.mapDisplayPicSprite = { setDirectorMember: jest.fn() }
    state.mapDisplayMarkerSprite = { visible: false, position: { set: jest.fn() } }
    state._destroyMapDisplayHotspots = jest.fn()
    state._rebuildMapDisplayHotspots = jest.fn()

    state.syncMapDisplayVisuals()

    expect(state.mapDisplayGroup.visible).toBe(true)
    expect(state.mapDisplaySprite.setDirectorMember).toHaveBeenCalledWith('boten_05.DXR', 82)
    expect(state.mapDisplayPicSprite.setDirectorMember).toHaveBeenCalledWith('boten_05.DXR', 90)
    expect(state.mapDisplayMarkerSprite.visible).toBe(true)
    expect(state.mapDisplayMarkerSprite.position.set).toHaveBeenCalledWith(111, 222)
  })

  test('startMapMode toggles back to Driving when map is already displaying', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.mapDisplayGroup = { visible: true }
    state.mapDisplayController = {
      displaying: true,
      mouseUp: jest.fn(function () { this.displaying = false })
    }
    state.syncMapDisplayVisuals = jest.fn()

    state.startMapMode()

    expect(state.mode).toBe('Driving')
    expect(state.mapDisplayGroup.visible).toBe(false)
  })

  test('syncMapDisplayVisuals rebuilds hotspots when region count changes', () => {
    const state = Object.create(SeaWorldState.prototype)
    state.mapDisplayController = {
      displaying: true,
      mapMember: { dirFile: 'boten_05.DXR', member: 82 },
      picMember: 'Dummy',
      markerLoc: { x: 1, y: 2 },
      mouseObjects: [{ rect: { left: 10, top: 20, right: 40, bottom: 50 }, dragToWhere: 2 }]
    }
    state.mapDisplayGroup = { visible: false }
    state.mapDisplaySprite = { setDirectorMember: jest.fn() }
    state.mapDisplayPicSprite = { setDirectorMember: jest.fn() }
    state.mapDisplayMarkerSprite = { visible: false, position: { set: jest.fn() } }
    state.mapDisplayHotspots = []
    state._destroyMapDisplayHotspots = jest.fn()
    state._rebuildMapDisplayHotspots = jest.fn()

    state.syncMapDisplayVisuals()

    expect(state._rebuildMapDisplayHotspots).toHaveBeenCalled()
  })
})
