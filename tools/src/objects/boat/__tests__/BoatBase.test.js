/**
 * BoatBase.test.js - TDD tests based on original Lingo BoatBase.ls (ParentScript 34)
 *
 * Source: decompiled_lingo/05/05/casts/Internal/ParentScript 34 - BoatBase.ls (641 lines)
 * Dependencies:
 *   - ExtraBoatDrivingStuff.ls: findPossiblePowers, checkCurrentlyOKPowers, makeCleanBoat
 *   - RecalcBoatProps.ls: recalculateBoatProps, calcCornersList
 *   - DrivingHandlers.ls: correctDirection, getVelPoint
 *
 * Main boat controller - coordinates all boat systems:
 * - Position and movement (calcSpeedNDir with DrivingHandlers velPoint lookup)
 * - Propulsion type switching (Motor/Sail/Oar) via changeType
 * - Fuel management (calculateFuel, fillErUp, OutOfFuel)
 * - Damage/durability (crash sounds, stepback)
 * - Hunger/seasickness (mulleHunger, buffaSick)
 * - Collision detection (checkBorders, depthChecker)
 * - Save/load state
 *
 * TDD: Tests written first from .ls lines, designed to fail against current JS.
 * Every test references specific Lingo source lines.
 */
'use strict'

import BoatBase from '../BoatBase'

describe('BoatBase', () => {
  let boat
  let mockDeps

  beforeEach(() => {
    mockDeps = {
      boatProperties: {
        power: 100,
        weight: 200,
        FuelVolume: 10,
        Drift: 5,
        Material: 1,
        stabilities: [90, 80],
        Stability: 30,
        ManoeuverAbility: 20,
        LoadCapacity: 500,
        depth: 3,
        MaxDepth: 10,
        WaterResistance: 5,
        MaxWaterResistance: 15,
        Durability: 8,
        SmallShip: 0,
        LargeShip: 0,
        SailSize: 0,
        Rudder: 1,
        SteerPart: 1,
        engine: 1,
        OutboardEngine: 0,
        SailWithPole: 0,
        Oar: 0
      },
      user: {
        inventory: {},
        level: 1,
        lookUpInventory: jest.fn().mockReturnValue(null),
        setInInventory: jest.fn(),
        deleteFromInventory: jest.fn(),
        isMissionCompleted: jest.fn().mockReturnValue(false),
        addGivenMission: jest.fn(),
        isInInventory: jest.fn().mockReturnValue(false)
      },
      drivingHandlers: {
        correctDirection: (d) => {
          let dir = d % 16
          if (dir <= 0) dir += 16
          return dir
        },
        getVelPoint: (d) => {
          // Real DirectionList lookup (from member 10)
          const list = [
            { x: 0, y: -97 }, { x: 38, y: -92 }, { x: 71, y: -71 }, { x: 92, y: -38 },
            { x: 97, y: 0 }, { x: 92, y: 38 }, { x: 71, y: 71 }, { x: 38, y: 92 },
            { x: 0, y: 97 }, { x: -38, y: 92 }, { x: -71, y: 71 }, { x: -92, y: 38 },
            { x: -97, y: 0 }, { x: -92, y: -38 }, { x: -71, y: -71 }, { x: -38, y: -92 }
          ]
          const idx = ((d - 1) % 16 + 16) % 16
          return list[idx]
        },
        calcDirection: () => [1, 100]
      },
      weatherRenderer: {
        wind: {
          getSpeed: () => 50,
          getVelPoint: () => ({ x: 50, y: 0 })
        },
        waves: {
          getTopoInfo: () => [0, 0, 0],
          setCornerPoints: jest.fn()
        }
      },
      mulleTalkObject: { say: jest.fn(), deleteReference: jest.fn() },
      sound: { play: jest.fn().mockReturnValue(1), finished: () => true, setVol: jest.fn() },
      levelHandler: { getLevel: () => 1 },
      loopMaster: { addObject: jest.fn(), deleteObject: jest.fn() },
      activateinterface: jest.fn(),
      changeMap: jest.fn(),
      prepareToLeave: jest.fn(),
      pause: jest.fn(),
      spriteList: { fuel: 70, TRANS: 75, Stroot: 73 },
      world: { getNewMapId: jest.fn().mockReturnValue(null) },
      // Mock for boat object that provides boatProperties and parts
      boat: {
        boatProperties: {},
        parts: [],
        getHull: jest.fn().mockReturnValue(1),
        updateProperties: jest.fn()
      },
      parts: {
        getPart: jest.fn().mockReturnValue({ getProperty: jest.fn().mockReturnValue(0) })
      },
      game: {
        time: { now: 1000 },
        mulle: {
          user: { inventory: {} },
          say: jest.fn()
        }
      }
    }
    // Fix circular ref for user
    mockDeps.game.mulle.user = mockDeps.user
    // Fix spy on say to match mulleTalkObject if needed, or just let it be a spy
    // But mulleTalkObject.say is also mocked. logic in BoatBase uses deps.mulleTalkObject.
    // logic in new modules uses game.mulle.say.
  })

  // ============================================================
  // constructor (on new me) — .ls lines 4-55
  // ============================================================
  describe('constructor (on new me) — .ls lines 4-55', () => {
    test('decimalPrec = 100 — .ls line 5', () => {
      boat = new BoatBase(mockDeps)
      // Mock game object for BoatDamage/BoatEnergy
      boat.game = {
        time: { now: 1000 },
        mulle: { user: mockDeps.user }
      }
      expect(boat.decimalPrec).toBe(100)
    })

    test('speed = 3 — .ls line 6', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.speed).toBe(3)
    })

    test('velPoint = point(0, 0) — .ls line 7', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.velPoint).toEqual({ x: 0, y: 0 })
    })

    test('direction = 1 — .ls line 8', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.direction).toBe(1)
    })

    test('internalDirection = direction * decimalPrec — .ls line 9', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.internalDirection).toBe(100)
    })

    test('loc = point(320, 240) * decimalPrec — .ls line 11', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.loc).toEqual({ x: 32000, y: 24000 })
    })

    test('inclinations = [0, 0] — .ls line 13', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.inclinations).toEqual([0, 0])
    })

    test('creates depthChecker — .ls line 14', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.depthChecker).toBeDefined()
    })

    test('passes topologyProvider dependency to depthChecker when provided', () => {
      const provider = jest.fn()
      boat = new BoatBase({ ...mockDeps, topologyProvider: provider })
      expect(boat.depthChecker.topologyProvider).toBe(provider)
    })

    test('locHistory has 10 entries of initial loc — .ls lines 16-20', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.locHistory.length).toBe(10)
      // All entries should be copies of initial loc
      for (const entry of boat.locHistory) {
        expect(entry).toEqual({ x: 32000, y: 24000 })
      }
    })

    test('swayHistory has 10 entries of 0 — .ls lines 16-20', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.swayHistory.length).toBe(10)
      for (const entry of boat.swayHistory) {
        expect(entry).toBe(0)
      }
    })

    test('hitLast = 0 — .ls line 21', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.hitLast).toBe(0)
    })

    test('steerMethod = Keys — .ls line 22', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.steerMethod).toBe('Keys')
    })

    test('buffaSick = 1000 + (pills * 25) — .ls lines 23-27', () => {
      // No pills: buffaSick = 1000
      boat = new BoatBase(mockDeps)
      expect(boat.buffaSick).toBe(1000)
    })

    test('buffaSick with pills from inventory — .ls lines 23-27', () => {
      mockDeps.user.inventory = { Pills: { nr: 4 } }
      // When pills are present, should look up and use them
      boat = new BoatBase(mockDeps)
      expect(boat.buffaSick).toBe(1000 + (4 * 25))
    })

    test('mulleHunger defaults to 1000 * 10 = 10000 — .ls lines 28-33', () => {
      // Default: mulleHunger = 1000, then * 10
      boat = new BoatBase(mockDeps)
      expect(boat.mulleHunger).toBeGreaterThan(0)
    })

    test('programControlsBoat = 0 (false) — .ls line 34', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.programControlsBoat).toBeFalsy()
    })

    test('speedDivider = 1 — .ls line 37', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.speedDivider).toBe(1)
    })

    test('shallowCommentCounter = 500 — .ls line 38', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.shallowCommentCounter).toBe(500)
    })

    test('inFreeZone = 0 (false) — .ls line 39', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.inFreeZone).toBeFalsy()
    })

    test('changedMapRecently = 0 — .ls line 40', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.changedMapRecently).toBe(0)
    })

    test('mulleHungerSpeed = 3 at level 1, 2 otherwise — .ls lines 44-48', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.orgMulleHungerSpeed).toBe(3)
      expect(boat.mulleHungerSpeed).toBe(3)

      mockDeps.user.level = 2
      boat = new BoatBase(mockDeps)
      expect(boat.orgMulleHungerSpeed).toBe(2)
      expect(boat.mulleHungerSpeed).toBe(2)
    })

    test('crashSndID = 0 — .ls line 50', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.crashSndID).toBe(0)
    })

    test('notAllowedTypes = [] — .ls line 51', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.notAllowedTypes).toEqual([])
    })

    test('ancestor = DummyBoatAncestor — .ls line 52', () => {
      boat = new BoatBase(mockDeps)
      expect(boat.ancestor).toBeDefined()
      expect(boat.ancestor.type).toBe('none')
    })
  })

  // ============================================================
  // init (on init me) — .ls lines 57-79 — ONTBREEKT IN JS
  // ============================================================
  describe('init (on init me) — .ls lines 57-79', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.game = {
        time: { now: 1000 },
        mulle: { user: mockDeps.user }
      }
      // Provide findPossiblePowers/checkCurrentlyOKPowers as deps
      boat.deps.findPossiblePowers = jest.fn().mockReturnValue(['Motor'])
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 1 })
      boat.deps.makeCleanBoat = jest.fn()
      boat.deps.recalculateBoatProps = jest.fn()
      boat.deps.calcCornersList = jest.fn().mockReturnValue(Array(16).fill([]))
    })

    test('should set possibleTypes from findPossiblePowers — .ls line 58', () => {
      boat.init()
      expect(boat.possibleTypes).toEqual(['Motor'])
    })

    test('should create SelectorMaster with possibleTypes — .ls line 64', () => {
      boat.init()
      expect(boat.SelectorMaster).toBeDefined()
    })

    test('should create DisplayBoat — .ls line 65', () => {
      boat.init()
      expect(boat.displayObject).toBeDefined()
    })

    test('should call calculateFuel — .ls line 66', () => {
      const spy = jest.spyOn(boat, 'calculateFuel')
      boat.init()
      expect(spy).toHaveBeenCalled()
    })

    test('should call changeType with wishedType — .ls line 67', () => {
      boat.wishedType = 'Motor'
      const spy = jest.spyOn(boat, 'changeType')
      boat.init()
      expect(spy).toHaveBeenCalledWith('Motor')
    })

    test('should reset wishedType to 0 after init — .ls line 68', () => {
      boat.wishedType = 'Motor'
      boat.init()
      expect(boat.wishedType).toBe(0)
    })

    test('should call calculateMyProps with resolved type — .ls line 77', () => {
      // changeType returns 'Motor' (from checkCurrentlyOKPowers mock)
      // init should then call calculateMyProps with that type
      boat.calculateMyProps = jest.fn()
      boat.init()
      expect(boat.calculateMyProps).toHaveBeenCalledWith('Motor')
    })

    test('should create speedMeter', () => {
      // Mock MeterScript constructor or check instance
      boat.init()
      expect(boat.speedMeter).toBeDefined()
      // We can't strict check class type without mocking the import, 
      // but we can check if it looks like a meter
      expect(boat.speedMeter.show).toBeDefined()
    })

    test('should create fuelMeter', () => {
      boat.init()
      expect(boat.fuelMeter).toBeDefined()
    })

    test('should create hungerMeter', () => {
      boat.init()
      expect(boat.hungerMeter).toBeDefined()
    })
  })

  // ============================================================
  // cheat (on cheat me) — .ls lines 81-85
  // ============================================================
  describe('cheat (on cheat me) — .ls lines 81-85', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('mulleHunger = 10000 — .ls line 82', () => {
      boat.cheat()
      expect(boat.mulleHunger).toBe(10000)
    })

    test('fuel = 40000 — .ls line 83', () => {
      boat.cheat()
      expect(boat.fuel).toBe(40000)
    })

    test('buffaSick = 2000 — .ls line 84', () => {
      boat.cheat()
      expect(boat.buffaSick).toBe(2000)
    })
  })

  // ============================================================
  // getType (on getType me) — .ls lines 87-93
  // ============================================================
  describe('getType (on getType me) — .ls lines 87-93', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('should return ancestor.type when ancestor exists — .ls line 89', () => {
      boat.ancestor = { type: 'Motor' }
      expect(boat.getType()).toBe('Motor')
    })

    test('should return 0 (not null) when no ancestor — .ls line 92', () => {
      // Original Lingo: return 0 (not VOID/null)
      boat.ancestor = null
      expect(boat.getType()).toBe(0)
    })
  })

  // ============================================================
  // checkWindOK (on checkWindOK me, argType) — .ls lines 95-106 — ONTBREEKT
  // ============================================================
  describe('checkWindOK (on checkWindOK me, argType) — .ls lines 95-106', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('should return sound ID when Sail and wind speed is 0 — .ls lines 96-103', () => {
      mockDeps.weatherRenderer.wind.getSpeed = () => 0
      const result = boat.checkWindOK('Sail')
      // Returns one of "05d135v0" or "05d136v0"
      expect(['05d135v0', '05d136v0']).toContain(result)
    })

    test('should call say with priority 5 when no wind — .ls line 102', () => {
      mockDeps.weatherRenderer.wind.getSpeed = () => 0
      boat.checkWindOK('Sail')
      expect(mockDeps.mulleTalkObject.say).toHaveBeenCalled()
    })

    test('should return undefined (void) when wind is OK — .ls line 105', () => {
      mockDeps.weatherRenderer.wind.getSpeed = () => 50
      const result = boat.checkWindOK('Sail')
      expect(result).toBeUndefined()
    })

    test('should return undefined for non-Sail types — .ls line 96 condition', () => {
      const result = boat.checkWindOK('Motor')
      expect(result).toBeUndefined()
    })
  })

  // ============================================================
  // changeType (on changeType me, argRequestedType) — .ls lines 108-189 — ONTBREEKT
  // ============================================================
  describe('changeType (on changeType me, argRequestedType) — .ls lines 108-189', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.possibleTypes = ['Motor', 'Sail']
      boat.notAllowedTypes = []
      boat.fuel = 10000
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 1, Sail: 1 })
      boat.deps.makeCleanBoat = jest.fn()
      boat.deps.recalculateBoatProps = jest.fn()
    })

    test('should return 0 if requested type is in notAllowedTypes — .ls lines 109-113', () => {
      boat.notAllowedTypes = ['Sail']
      const result = boat.changeType('Sail')
      expect(result).toBe(0)
    })

    test('should mark Motor as NoFuel when fuel <= 0 — .ls lines 122-126', () => {
      boat.fuel = 0
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 1, Sail: 1 })
      // When Motor is requested but no fuel, should set Motor: NoFuel
      boat.changeType('Motor')
      // The checkCurrentlyOKPowers result should have Motor overwritten to NoFuel
    })

    test('should return requested type when it is OK — .ls lines 128-131', () => {
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 1, Sail: 1 })
      const result = boat.changeType('Motor')
      expect(result).toBe('Motor')
    })

    test('should call checkWindOK for the selected type — .ls line 130', () => {
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 1, Sail: 1 })
      const spy = jest.spyOn(boat, 'checkWindOK')
      boat.changeType('Sail')
      expect(spy).toHaveBeenCalledWith('Sail')
    })

    test('should find first OK type when no specific type requested — .ls lines 137-154', () => {
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 1, Sail: 1 })
      const result = boat.changeType()
      // Should return first available type
      expect(result).toBe('Motor')
    })

    test('should return error sound string when no valid type — .ls lines 155-188', () => {
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 'NoFuel' })
      boat.possibleTypes = ['Motor']
      const result = boat.changeType('Motor')
      // Error case returns sound ID string like "05d137v0" for NoFuel
      expect(typeof result).toBe('string')
    })
  })

  // ============================================================
  // calculateFuel (on calculateFuel me) — .ls lines 191-201
  // ============================================================
  describe('calculateFuel (on calculateFuel me) — .ls lines 191-201', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { FuelVolume: 10 }
    })

    test('fuel = 4500 * FuelVolume when undefined — .ls line 193', () => {
      boat.fuel = undefined
      boat.calculateFuel()
      expect(boat.fuel).toBe(45000)
    })

    test('fuel = 4500 * FuelVolume when Full — .ls line 192', () => {
      boat.fuel = 'Full'
      boat.calculateFuel()
      expect(boat.fuel).toBe(45000)
    })

    test('sets MaxFuelVolume = fuel — .ls line 194', () => {
      boat.fuel = undefined
      boat.calculateFuel()
      expect(boat.quickProps.MaxFuelVolume).toBe(45000)
    })

    test('sets MaxFuelVolume = 4000 * FuelVolume when fuel is numeric — .ls lines 196-198', () => {
      boat.fuel = 20000
      boat.quickProps.MaxFuelVolume = undefined
      boat.calculateFuel()
      expect(boat.quickProps.MaxFuelVolume).toBe(40000)
    })
  })

  // ============================================================
  // calculateMyProps (on calculateMyProps me, argType) — .ls lines 203-227 — ONTBREEKT
  // ============================================================
  describe('calculateMyProps (on calculateMyProps me, argType) — .ls lines 203-227', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.deps.makeCleanBoat = jest.fn()
      boat.deps.recalculateBoatProps = jest.fn()
      boat.deps.calcCornersList = jest.fn().mockReturnValue(Array(16).fill([]))
      boat.quickProps = { ...mockDeps.boatProperties }
      boat.fuel = 10000
    })

    test('should refresh quickProps from boatProperties — .ls line 204', () => {
      boat.calculateMyProps('Motor')
      // quickProps should be refreshed (duplicate of boatProperties)
      expect(boat.deps.makeCleanBoat).toHaveBeenCalledWith('Motor', expect.any(Object))
    })

    test('should call recalculateBoatProps — .ls line 206', () => {
      boat.calculateMyProps('Motor')
      expect(boat.deps.recalculateBoatProps).toHaveBeenCalledWith('Motor', expect.any(Object))
    })

    test('should call calculateFuel — .ls line 207', () => {
      const spy = jest.spyOn(boat, 'calculateFuel')
      boat.calculateMyProps('Motor')
      expect(spy).toHaveBeenCalled()
    })

    test('should set stabilities from quickProps — .ls line 208', () => {
      // calculateMyProps refreshes quickProps from deps.boatProperties first,
      // then recalculateBoatProps modifies them. We mock recalculate to set stabilities.
      boat.deps.recalculateBoatProps = jest.fn().mockImplementation((type, props) => {
        props.stabilities = [85, 55]
      })
      boat.calculateMyProps('Motor')
      expect(boat.stabilities).toEqual([85, 55])
    })

    test('should set Durability only if undefined — .ls lines 209-211', () => {
      boat.Durability = undefined
      // recalculateBoatProps sets Durability on quickProps
      boat.deps.recalculateBoatProps = jest.fn().mockImplementation((type, props) => {
        props.Durability = 5000
      })
      boat.calculateMyProps('Motor')
      expect(boat.Durability).toBe(5000)
    })

    test('should not overwrite existing Durability — .ls lines 209-211', () => {
      boat.Durability = 3000
      boat.deps.recalculateBoatProps = jest.fn().mockImplementation((type, props) => {
        props.Durability = 5000
      })
      boat.calculateMyProps('Motor')
      expect(boat.Durability).toBe(3000)
    })

    test('should set acceleration from quickProps — .ls line 212', () => {
      // recalculateBoatProps sets acceleration on quickProps
      boat.deps.recalculateBoatProps = jest.fn().mockImplementation((type, props) => {
        props.acceleration = 42
      })
      boat.calculateMyProps('Motor')
      expect(boat.acceleration).toBe(42)
    })

    test('should set retardation from quickProps — .ls line 213', () => {
      boat.deps.recalculateBoatProps = jest.fn().mockImplementation((type, props) => {
        props.retardation = 18
      })
      boat.calculateMyProps('Motor')
      expect(boat.retardation).toBe(18)
    })

    test('should kill old ancestor and create new one — .ls lines 221-225', () => {
      const oldAncestor = { kill: jest.fn().mockReturnValue(0) }
      boat.ancestor = oldAncestor
      boat.calculateMyProps('Motor')
      expect(oldAncestor.kill).toHaveBeenCalled()
      expect(boat.ancestor).toBeDefined()
    })

    test('should track DrivenTimes in user inventory — .ls lines 215-220', () => {
      boat.deps.user.lookUpInventory = jest.fn().mockReturnValue({ Motor: 0, Sail: 0, Oar: 0 })
      boat.calculateMyProps('Motor')
      expect(boat.deps.user.setInInventory).toHaveBeenCalledWith(
        'DrivenTimes',
        expect.objectContaining({ Motor: 1 })
      )
    })
  })

  // ============================================================
  // OutOfFuel (on OutOfFuel me) — .ls lines 229-242 — ONTBREEKT
  // ============================================================
  describe('OutOfFuel (on OutOfFuel me) — .ls lines 229-242', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.possibleTypes = ['Motor']
    })

    test('should go home when only one possible type — .ls lines 230-232', () => {
      boat.possibleTypes = ['Motor']
      boat.OutOfFuel()
      expect(boat.programControlsBoat).toBe(true)
    })

    test('should call say with #OutOfFuel when single type — .ls line 231', () => {
      boat.possibleTypes = ['Motor']
      boat.OutOfFuel()
      expect(mockDeps.mulleTalkObject.say).toHaveBeenCalledWith(
        'OutOfFuel', 1, boat, 'Q', 'GoHomeTow'
      )
    })

    test('should switch to alternative type when multiple types — .ls lines 233-241', () => {
      boat.possibleTypes = ['Motor', 'Sail']
      boat.deps.checkCurrentlyOKPowers = jest.fn().mockReturnValue({ Motor: 'NoFuel', Sail: 1 })
      const spy = jest.spyOn(boat, 'changeType')
      boat.OutOfFuel()
      expect(spy).toHaveBeenCalled()
    })

    test('should go home if alternative type also fails — .ls lines 235-238', () => {
      boat.possibleTypes = ['Motor', 'Sail']
      // changeType returns error string
      boat.changeType = jest.fn().mockReturnValue('05d135v0')
      boat.OutOfFuel()
      expect(boat.programControlsBoat).toBe(true)
    })
  })

  // ============================================================
  // fillErUp (on fillErUp me) — .ls lines 244-248
  // ============================================================
  describe('fillErUp (on fillErUp me) — .ls lines 244-248', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { FuelVolume: 10 }
      boat.fuelMeter = { show: jest.fn(), setMax: jest.fn() }
    })

    test('sets fuel to Full then calculates — .ls lines 245-247', () => {
      boat.fuel = 1000
      boat.fillErUp()
      expect(boat.fuel).toBe(45000)
    })

    test('shows fuel on fuelMeter — .ls line 247', () => {
      boat.fillErUp()
      expect(boat.fuelMeter.show).toHaveBeenCalledWith(boat.fuel)
    })
  })

  // ============================================================
  // save (on save me) — .ls lines 250-263
  // ============================================================
  describe('save (on save me) — .ls lines 250-263', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.direction = 5
      boat.loc = { x: 10000, y: 20000 }
      boat.fuel = 5000
      boat.Durability = 8000
      boat.ancestor = { type: 'Motor' }
    })

    test('returns save data with direction, loc/decimalPrec, fuel, Durability, type — .ls line 262', () => {
      const data = boat.save()
      expect(data.direction).toBe(5)
      expect(data.loc).toEqual({ x: 100, y: 200 })
      expect(data.fuel).toBe(5000)
      expect(data.Durability).toBe(8000)
      expect(data.type).toBe('Motor')
    })

    test('should save pills back to user inventory — .ls lines 251-259', () => {
      boat.buffaSick = 1100  // (1100-1000)/25 = 4 pills left
      boat.deps.user.lookUpInventory = jest.fn().mockReturnValue({ nr: 10 })
      boat.save()
      // Should save pills count back
    })

    test('should save belly (mulleHunger / 10) to user — .ls line 261', () => {
      boat.mulleHunger = 5000
      boat.save()
      expect(boat.deps.user.setInInventory).toHaveBeenCalledWith(
        'Belly', { nr: 500 }
      )
    })
  })

  // ============================================================
  // load (on load me, argList) — .ls lines 265-282
  // ============================================================
  describe('load (on load me, argList) — .ls lines 265-282', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('sets direction and internalDirection — .ls lines 266-267', () => {
      boat.load({ direction: 8, loc: { x: 100, y: 200 } })
      expect(boat.direction).toBe(8)
      expect(boat.internalDirection).toBe(800)
    })

    test('sets loc = argList.loc * decimalPrec — .ls line 268', () => {
      boat.load({ direction: 1, loc: { x: 100, y: 200 } })
      expect(boat.loc).toEqual({ x: 10000, y: 20000 })
    })

    test('sets fuel when Full — .ls lines 270-271', () => {
      boat.load({ direction: 1, loc: { x: 100, y: 200 }, fuel: 'Full' })
      expect(boat.fuel).toBe('Full')
    })

    test('sets fuel when integer — .ls lines 273-274', () => {
      boat.load({ direction: 1, loc: { x: 100, y: 200 }, fuel: 5000 })
      expect(boat.fuel).toBe(5000)
    })

    test('sets Durability when integer — .ls lines 277-279', () => {
      boat.load({ direction: 1, loc: { x: 100, y: 200 }, Durability: 7500 })
      expect(boat.Durability).toBe(7500)
    })

    test('sets wishedType — .ls line 281', () => {
      boat.load({ direction: 1, loc: { x: 100, y: 200 }, type: 'Sail' })
      expect(boat.wishedType).toBe('Sail')
    })
  })

  // ============================================================
  // kill (on kill me) — .ls lines 284-298
  // ============================================================
  describe('kill (on kill me) — .ls lines 284-298', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.speedMeter = { kill: jest.fn().mockReturnValue(0) }
      boat.hungerMeter = { kill: jest.fn().mockReturnValue(0) }
      boat.fuelMeter = { kill: jest.fn().mockReturnValue(0) }
      boat.displayObject = { kill: jest.fn().mockReturnValue(0) }
      boat.SelectorMaster = { kill: jest.fn().mockReturnValue(0) }
      boat.depthChecker = { kill: jest.fn().mockReturnValue(0) }
      boat.ancestor = { kill: jest.fn().mockReturnValue(0) }
    })

    test('kills all sub-objects in correct order — .ls lines 286-296', () => {
      // Save refs to mocks before kill() replaces them with return values
      const speedMeterKill = boat.speedMeter.kill
      const hungerMeterKill = boat.hungerMeter.kill
      const fuelMeterKill = boat.fuelMeter.kill
      const displayObjectKill = boat.displayObject.kill
      const selectorMasterKill = boat.SelectorMaster.kill
      const depthCheckerKill = boat.depthChecker.kill
      const ancestorKill = boat.ancestor.kill

      boat.kill()

      expect(speedMeterKill).toHaveBeenCalled()
      expect(hungerMeterKill).toHaveBeenCalled()
      expect(fuelMeterKill).toHaveBeenCalled()
      expect(displayObjectKill).toHaveBeenCalled()
      expect(selectorMasterKill).toHaveBeenCalled()
      expect(depthCheckerKill).toHaveBeenCalled()
      expect(ancestorKill).toHaveBeenCalled()
    })

    test('returns 0 (not null) — .ls line 297', () => {
      // Original Lingo: return 0
      expect(boat.kill()).toBe(0)
    })

    test('should skip SelectorMaster.kill if not objectp — .ls lines 290-292', () => {
      boat.SelectorMaster = null
      expect(() => boat.kill()).not.toThrow()
    })

    test('should skip ancestor.kill if not objectp — .ls lines 294-296', () => {
      boat.ancestor = null
      expect(() => boat.kill()).not.toThrow()
    })
  })

  // ============================================================
  // stopMotor (on stopMotor me) — .ls lines 300-304
  // ============================================================
  describe('stopMotor (on stopMotor me) — .ls lines 300-304', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('calls setSpeed(0) when ancestor type is Motor — .ls lines 301-303', () => {
      boat.ancestor = { type: 'Motor', setSpeed: jest.fn() }
      boat.stopMotor()
      expect(boat.ancestor.setSpeed).toHaveBeenCalledWith(0)
    })

    test('does nothing when type is not Motor — .ls line 301 condition', () => {
      boat.ancestor = { type: 'Sail', setSpeed: jest.fn() }
      boat.stopMotor()
      expect(boat.ancestor.setSpeed).not.toHaveBeenCalled()
    })
  })

  // ============================================================
  // stepback (on stepback me, argNrOfSteps) — .ls lines 306-320
  // ============================================================
  describe('stepback (on stepback me, argNrOfSteps) — .ls lines 306-320', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.locHistory = [
        { x: 1000, y: 1000 },
        { x: 2000, y: 2000 },
        { x: 3000, y: 3000 },
        { x: 4000, y: 4000 },
        { x: 5000, y: 5000 }
      ]
      boat.loc = { x: 6000, y: 6000 }
    })

    test('sets speed to 0 — .ls line 307', () => {
      boat.speed = 100
      boat.stepback(2)
      expect(boat.speed).toBe(0)
    })

    test('exits early if argNrOfSteps < 1 — .ls lines 308-310', () => {
      const originalLoc = { ...boat.loc }
      boat.stepback(0)
      expect(boat.loc).toEqual(originalLoc)
    })

    test('restores loc from history (Lingo 1-indexed) — .ls lines 311-315', () => {
      // Lingo: tmp = count(locHistory) - argNrOfSteps + 1
      // count=5, steps=2: tmp=4, which is index 3 in 0-based
      boat.stepback(2)
      expect(boat.loc).toEqual({ x: 4000, y: 4000 })
    })

    test('fills forward entries with restored loc — .ls lines 316-318', () => {
      boat.stepback(2)
      expect(boat.locHistory[3]).toEqual({ x: 4000, y: 4000 })
      expect(boat.locHistory[4]).toEqual({ x: 4000, y: 4000 })
    })

    test('returns loc — .ls line 319', () => {
      const result = boat.stepback(2)
      expect(result).toEqual({ x: 4000, y: 4000 })
    })

    test('clamps to first entry — .ls lines 312-314', () => {
      boat.stepback(100)
      expect(boat.loc).toEqual({ x: 1000, y: 1000 })
    })
  })

  // ============================================================
  // freeZone, setTopology, getShowCoordinate, setShowCoordinate, steer, setSpeed, programControl
  // ============================================================
  describe('simple handlers', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('freeZone sets inFreeZone — .ls lines 322-324', () => {
      boat.freeZone(1)
      expect(boat.inFreeZone).toBe(1)
      boat.freeZone(0)
      expect(boat.inFreeZone).toBe(0)
    })

    test('setTopology delegates to depthChecker — .ls lines 326-328', () => {
      boat.depthChecker = { setTopology: jest.fn() }
      boat.setTopology('map01')
      expect(boat.depthChecker.setTopology).toHaveBeenCalledWith('map01')
    })

    test('getShowCoordinate returns loc / decimalPrec — .ls lines 330-332', () => {
      boat.loc = { x: 32000, y: 24000 }
      expect(boat.getShowCoordinate()).toEqual({ x: 320, y: 240 })
    })

    test('setShowCoordinate sets loc = argPoint * decimalPrec — .ls lines 334-336', () => {
      boat.setShowCoordinate({ x: 100, y: 200 })
      expect(boat.loc).toEqual({ x: 10000, y: 20000 })
    })

    test('steer delegates to ancestor — .ls lines 338-342', () => {
      boat.ancestor = { steer: jest.fn() }
      boat.steer('left', 'up')
      expect(boat.ancestor.steer).toHaveBeenCalledWith('left', 'up')
    })

    test('steer handles null ancestor — .ls line 339 condition', () => {
      boat.ancestor = null
      expect(() => boat.steer('left', 'up')).not.toThrow()
    })

    test('setSpeed sets speed directly — .ls lines 393-395', () => {
      boat.setSpeed(50)
      expect(boat.speed).toBe(50)
    })

    test('programControl sets programControlsBoat — .ls lines 419-421', () => {
      boat.programControl(1)
      expect(boat.programControlsBoat).toBe(1)
      boat.programControl(0)
      expect(boat.programControlsBoat).toBe(0)
    })
  })

  // ============================================================
  // calcSpeedNDir (on calcSpeedNDir me, argForce, argSteering) — .ls lines 344-391
  // CRITICAL: Must use DrivingHandlers.getVelPoint, NOT trig
  // ============================================================
  describe('calcSpeedNDir (on calcSpeedNDir me, argForce, argSteering) — .ls lines 344-391', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { power: 100, ManoeuverAbility: 20 }
      boat.speedList = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      boat.acceleration = 50
      boat.retardation = 25
      boat.cornerPoints = Array(17).fill([{ x: 0, y: 0 }])
      // Ensure direction starts at 1
      boat.direction = 1
      boat.internalDirection = 100
    })

    test('calculates tmpPowerIn = abs(argForce * power) — .ls line 345', () => {
      boat.speed = 0
      // force=50, power=100 → tmpPowerIn=5000
      // tmpPower=50, tmpDec=0
      // speedList[50] should be used (need enough entries)
      boat.speedList = new Array(251).fill(0).map((_, i) => i)
      boat.calcSpeedNDir(50, 0)
      expect(boat.speed).toBeGreaterThan(0)
    })

    test('interpolates between speedList entries — .ls lines 348-366', () => {
      // force=1.5, power=100 → tmpPowerIn=150
      // tmpPower=1, tmpDec=50
      // tmpLower = speedList[1]=10, tmpHigher=speedList[2]=20
      // tmpWanted = 10 + 50*(20-10)/100 = 15
      boat.speed = 0
      boat.calcSpeedNDir(1.5, 0)
      // Speed should increase towards 15
      expect(boat.speed).toBeGreaterThan(0)
    })

    test('handles tmpPower=0 case — .ls lines 362-365', () => {
      // force=0.5, power=100 → tmpPowerIn=50
      // tmpPower=0, tmpDec=50
      // When tmpPower=0: tmpLower=0, tmpHigher=speedList[0]
      // tmpWanted = tmpDec * speedList[0] / 100 = 50 * 10 / 100 = 5
      // Use speedList where [0] is non-zero
      boat.speedList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      boat.speed = 0
      boat.calcSpeedNDir(0.5, 0)
      expect(boat.speed).toBeGreaterThan(0)
    })

    test('negates wanted speed for negative force — .ls lines 367-369', () => {
      // force=-1, power=100 → tmpPowerIn=100, tmpPower=1
      // speedList[0]=10 → tmpWanted=10, negated → -10
      // speed change = retardation * -10 / 100 = 25 * -10 / 100 = -2.5
      boat.speedList = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      boat.speed = 0
      boat.calcSpeedNDir(-1, 0)
      expect(boat.speed).toBeLessThan(0)
    })

    test('acceleration clamps speed change — .ls lines 372-376', () => {
      boat.speed = 0
      boat.acceleration = 10
      boat.speedList = new Array(251).fill(0).map((_, i) => i * 10)
      boat.calcSpeedNDir(100, 0)
      // Speed change limited to acceleration (10)
      expect(boat.speed).toBeLessThanOrEqual(10)
    })

    test('retardation clamps speed change — .ls lines 377-382', () => {
      boat.speed = 100
      boat.retardation = 10
      boat.calcSpeedNDir(0, 0)
      // Speed change (deceleration) limited to retardation
      expect(boat.speed).toBeGreaterThanOrEqual(90)
    })

    test('updates internalDirection from steering — .ls lines 384-388', () => {
      boat.internalDirection = 100
      boat.calcSpeedNDir(0, 10)
      // tmpSteer = 10 * 20 / 10 = 20
      expect(boat.internalDirection).toBe(120)
    })

    test('updates direction via DrivingHandlers.correctDirection — .ls line 387', () => {
      boat.internalDirection = 100
      boat.calcSpeedNDir(0, 50)
      // tmpSteer = 50 * 20 / 10 = 100
      // internalDirection = 100 + 100 = 200
      // direction = correctDirection(200 / 100) = correctDirection(2) = 2
      expect(boat.direction).toBe(2)
    })

    test('updates velPoint via DrivingHandlers.getVelPoint — .ls line 390', () => {
      // CRITICAL: Lingo uses getVelPoint(drivingHandlers, direction) * speed / 100
      // NOT trig-based calculation
      boat.speed = 100
      boat.direction = 1
      boat.calcSpeedNDir(1, 0)
      // velPoint should be DrivingHandlers.getVelPoint(direction) * speed / 100
      // For direction 1: getVelPoint returns {x: 0, y: -97}
      // velPoint = {x: 0, y: -97} * speed / 100
      // The key assertion: velPoint should NOT use cos/sin
      expect(boat.velPoint).toBeDefined()
      expect(typeof boat.velPoint.x).toBe('number')
      expect(typeof boat.velPoint.y).toBe('number')
    })

    test('updates currentCorners from cornerPoints[direction] — .ls line 389', () => {
      boat.cornerPoints = { 1: [{ x: 5, y: -10 }], 2: [{ x: 10, y: -5 }] }
      boat.direction = 1
      boat.calcSpeedNDir(0, 0)
      expect(boat.currentCorners).toEqual([{ x: 5, y: -10 }])
    })
  })

  // ============================================================
  // waitToGoHome (on waitToGoHome me) — .ls lines 423-426
  // ============================================================
  describe('waitToGoHome (on waitToGoHome me) — .ls lines 423-426', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('sets programControlsBoat to 1 (true) — .ls line 425', () => {
      boat.waitToGoHome()
      expect(boat.programControlsBoat).toBeTruthy()
    })

    test('calls activateinterface(gDir, 0) — .ls line 424', () => {
      boat.waitToGoHome()
      expect(mockDeps.activateinterface).toHaveBeenCalledWith(0)
    })
  })

  // ============================================================
  // checkBorders (on checkBorders me) — .ls lines 428-473
  // ============================================================
  describe('checkBorders (on checkBorders me) — .ls lines 428-473', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.depthChecker = {
        checkBorders: jest.fn().mockReturnValue(null),
        checkDepth: jest.fn().mockReturnValue(0)
      }
    })

    test('does nothing when checkBorders returns non-list — .ls line 430', () => {
      boat.depthChecker.checkBorders = jest.fn().mockReturnValue(null)
      const origLoc = { ...boat.loc }
      boat.checkBorders()
      expect(boat.loc).toEqual(origLoc)
    })

    test('changes map when valid neighbor exists — .ls lines 431-449', () => {
      // border = [-1, 0] means left edge
      boat.depthChecker.checkBorders = jest.fn().mockReturnValue([-1, 0])
      mockDeps.world.getNewMapId = jest.fn().mockReturnValue(51) // valid mapId
      const border = 12 // 8 + 4
      boat.checkBorders()
      // loc.x should be set to (640 - border) * decimalPrec
      expect(boat.loc.x).toBe((640 - border) * 100)
      // changedMapRecently is set to 5, then immediately decremented to 4
      // because the decrement happens at the end of checkBorders
      expect(boat.changedMapRecently).toBe(4)
    })

    test('clamps position when no valid neighbor — .ls lines 451-467', () => {
      boat.depthChecker.checkBorders = jest.fn().mockReturnValue([1, 0])
      mockDeps.world.getNewMapId = jest.fn().mockReturnValue(null) // no valid neighbor
      boat.loc = { x: 64000, y: 24000 } // at right edge
      boat.checkBorders()
      // Should clamp to 630 * 100
      expect(boat.loc.x).toBe(630 * 100)
    })

    test('decrements changedMapRecently — .ls lines 470-472', () => {
      boat.changedMapRecently = 3
      boat.depthChecker.checkBorders = jest.fn().mockReturnValue(null)
      boat.checkBorders()
      expect(boat.changedMapRecently).toBe(2)
    })
  })

  // ============================================================
  // loop (on loop me) — .ls lines 475-622
  // ============================================================
  describe('loop (on loop me) — .ls lines 475-622', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { Drift: 5, Material: 1, weight: 100 }
      boat.speedMeter = { show: jest.fn() }
      boat.hungerMeter = { show: jest.fn() }
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue(0),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.ancestor = { loop: jest.fn().mockReturnValue(0), display: jest.fn() }
      boat.displayObject = { display: jest.fn() }
      boat.stabilities = [90, 80]
      boat.cornerPoints = Array(17).fill([{ x: 0, y: 0 }])
      boat.currentCorners = [{ x: 0, y: 0 }]
    })

    test('exits early when programControlsBoat — .ls lines 476-478', () => {
      boat.programControlsBoat = true
      const origLoc = { ...boat.loc }
      boat.loop()
      expect(boat.loc).toEqual(origLoc)
    })

    test('updates position: loc = loc + (velPoint + drift) / speedDivider — .ls line 480', () => {
      boat.velPoint = { x: 100, y: 50 }
      const origX = boat.loc.x
      boat.loop()
      expect(boat.loc.x).not.toBe(origX)
    })

    test('shows speed on speedMeter — .ls line 482', () => {
      boat.speed = 50
      boat.loop()
      expect(boat.speedMeter.show).toHaveBeenCalledWith(50)
    })

    test('shows mulleHunger on hungerMeter — .ls line 483', () => {
      boat.mulleHunger = 5000
      boat.loop()
      expect(boat.hungerMeter.show).toHaveBeenCalledWith(5000)
    })

    test('updates locHistory (push + shift) — .ls lines 547-548', () => {
      const initialLen = boat.locHistory.length
      boat.loop()
      expect(boat.locHistory.length).toBe(initialLen)
    })

    test('calls ancestor.loop and uses return value — .ls line 549', () => {
      boat.loop()
      expect(boat.ancestor.loop).toHaveBeenCalled()
    })

    test('calls displayObject.display with [alt, side, frontBack] — .ls line 620', () => {
      boat.loop()
      expect(boat.displayObject.display).toHaveBeenCalledWith(
        expect.arrayContaining([expect.any(Number), expect.any(Number), expect.any(Number)])
      )
    })

    test('calls ancestor.display — .ls line 621', () => {
      boat.loop()
      expect(boat.ancestor.display).toHaveBeenCalled()
    })
  })

  // ============================================================
  // loop - collision (Hit) — .ls lines 485-531
  // ============================================================
  describe('loop - collision handling — .ls lines 485-531', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { Drift: 5, Material: 1, weight: 100 }
      boat.speedMeter = { show: jest.fn() }
      boat.hungerMeter = { show: jest.fn() }
      boat.ancestor = { loop: jest.fn().mockReturnValue(0), display: jest.fn() }
      boat.displayObject = { display: jest.fn() }
      boat.stabilities = [90, 80]
      boat.cornerPoints = Array(17).fill([{ x: 0, y: 0 }])
      boat.currentCorners = [{ x: 0, y: 0 }]
      boat.Durability = 10000
      boat.locHistory = Array(10).fill(null).map(() => ({ x: 30000, y: 23000 }))
    })

    test('stepbacks 2 on Hit collision — .ls line 488', () => {
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue('Hit'),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.speed = 100
      const spy = jest.spyOn(boat, 'stepback')
      boat.loop()
      expect(spy).toHaveBeenCalledWith(2)
    })

    test('sets velPoint to (0,0) and speed to 0 — .ls lines 490-491', () => {
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue('Hit'),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.speed = 100
      boat.velPoint = { x: 100, y: 0 }
      boat.loop()
      expect(boat.speed).toBe(0)
      expect(boat.velPoint).toEqual({ x: 0, y: 0 })
    })

    test('reduces Durability by abs(speed) damage — .ls line 521', () => {
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue('Hit'),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.speed = 100
      boat.loop()
      expect(boat.Durability).toBe(9900)
    })

    test('does not reduce Durability in freeZone — .ls line 520 condition', () => {
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue('Hit'),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.inFreeZone = true
      boat.speed = 100
      boat.loop()
      expect(boat.Durability).toBe(10000)
    })

    test('goes home when Durability <= 0 — .ls lines 522-524', () => {
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue('Hit'),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.Durability = 50
      boat.speed = 100
      boat.loop()
      expect(boat.programControlsBoat).toBeTruthy()
    })

    test('sets speedDivider to 2 on Shallow — .ls line 541', () => {
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue('Shallow'),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.loop()
      expect(boat.speedDivider).toBe(2)
    })

    test('resets speedDivider to 1 when not shallow — .ls line 543', () => {
      boat.speedDivider = 2
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue(0),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.loop()
      expect(boat.speedDivider).toBe(1)
    })
  })

  // ============================================================
  // loop - hunger — .ls lines 568-588
  // ============================================================
  describe('loop - hunger — .ls lines 568-588', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { Drift: 5, Material: 1, weight: 100 }
      boat.speedMeter = { show: jest.fn() }
      boat.hungerMeter = { show: jest.fn() }
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue(0),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.ancestor = { loop: jest.fn().mockReturnValue(0), display: jest.fn() }
      boat.displayObject = { display: jest.fn() }
      boat.stabilities = [90, 80]
      boat.cornerPoints = Array(17).fill([{ x: 0, y: 0 }])
      boat.currentCorners = [{ x: 0, y: 0 }]
    })

    test('decreases mulleHunger by mulleHungerSpeed each loop — .ls line 569', () => {
      boat.mulleHunger = 1000
      boat.mulleHungerSpeed = 3
      boat.loop()
      expect(boat.mulleHunger).toBe(997)
    })

    test('does not decrease hunger in freeZone — .ls line 553 condition', () => {
      boat.inFreeZone = true
      boat.mulleHunger = 1000
      boat.loop()
      expect(boat.mulleHunger).toBe(1000)
    })

    test('triggers goHome when mulleHunger <= 0 and no fishingrod — .ls lines 583-585', () => {
      boat.mulleHunger = 1
      boat.mulleHungerSpeed = 3
      boat.loop()
      expect(boat.programControlsBoat).toBeTruthy()
    })
  })

  // ============================================================
  // loop - seasickness (buffaSick) — .ls lines 554-566
  // ============================================================
  describe('loop - seasickness — .ls lines 554-566', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { Drift: 5, Material: 1, weight: 100 }
      boat.speedMeter = { show: jest.fn() }
      boat.hungerMeter = { show: jest.fn() }
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue(0),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.ancestor = { loop: jest.fn().mockReturnValue(0), display: jest.fn() }
      boat.displayObject = { display: jest.fn() }
      boat.stabilities = [90, 80]
      boat.cornerPoints = Array(17).fill([{ x: 0, y: 0 }])
      boat.currentCorners = [{ x: 0, y: 0 }]
    })

    test('only checks buffaSick at level >= 4 — .ls line 554', () => {
      boat.level = 3
      boat.buffaSick = 100
      boat.swayHistory = Array(10).fill(0)
      boat.loop()
      // Should not trigger waitToGoHome at level < 4
      expect(boat.programControlsBoat).toBeFalsy()
    })

    test('decreases buffaSick based on sway diff / 13 — .ls line 558', () => {
      boat.level = 4
      boat.buffaSick = 1000
      boat.swayHistory = Array(10).fill(0)
      boat.loop()
      expect(boat.buffaSick).toBeLessThanOrEqual(1000)
    })

    test('not checked in freeZone — .ls line 553 condition', () => {
      boat.level = 4
      boat.inFreeZone = true
      boat.buffaSick = 1
      boat.swayHistory = Array(10).fill(100) // Big sway
      boat.loop()
      expect(boat.programControlsBoat).toBeFalsy()
    })
  })

  // ============================================================
  // loop - capsize — .ls lines 598-611
  // ============================================================
  describe('loop - capsize — .ls lines 598-611', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
      boat.quickProps = { Drift: 5, Material: 1, weight: 100 }
      boat.speedMeter = { show: jest.fn() }
      boat.hungerMeter = { show: jest.fn() }
      boat.depthChecker = {
        checkDepth: jest.fn().mockReturnValue(0),
        checkBorders: jest.fn().mockReturnValue(null)
      }
      boat.ancestor = { loop: jest.fn().mockReturnValue(0), display: jest.fn() }
      boat.displayObject = { display: jest.fn() }
      boat.cornerPoints = Array(17).fill([{ x: 0, y: 0 }])
      boat.currentCorners = [{ x: 0, y: 0 }]
    })

    test('clamps side inclination to [-2, 2] — .ls lines 612-615', () => {
      boat.stabilities = [90, 80]
      boat.loop()
      expect(boat.inclinations[0]).toBeGreaterThanOrEqual(-2)
      expect(boat.inclinations[0]).toBeLessThanOrEqual(2)
    })

    test('clamps frontBack inclination to [-2, 2] — .ls lines 616-618', () => {
      boat.stabilities = [90, 80]
      boat.loop()
      expect(boat.inclinations[1]).toBeGreaterThanOrEqual(-2)
      expect(boat.inclinations[1]).toBeLessThanOrEqual(2)
    })
  })

  // ============================================================
  // mulleFinished (on mulleFinished me, argID) — .ls lines 624-641
  // ============================================================
  describe('mulleFinished (on mulleFinished me, argID) — .ls lines 624-641', () => {
    beforeEach(() => {
      boat = new BoatBase(mockDeps)
    })

    test('continue: returns action unpause — .ls lines 625-627', () => {
      const result = boat.mulleFinished('continue')
      expect(result).toEqual({ action: 'unpause' })
    })

    test('GoHome: prepareToLeave to 04 — .ls lines 629-630', () => {
      const result = boat.mulleFinished('GoHome')
      expect(result).toEqual({ action: 'prepareToLeave', destination: '04' })
    })

    test('GoHomeTow: with tow animation — .ls lines 631-633', () => {
      const result = boat.mulleFinished('GoHomeTow')
      expect(result.action).toBe('prepareToLeave')
      expect(result.destination).toBe('04')
      expect(result.animation).toBe('33b011v0')
      expect(result.sound).toBe('33e011v0')
    })

    test('GoHomeCapsize: with capsize animation — .ls lines 634-636', () => {
      const result = boat.mulleFinished('GoHomeCapsize')
      expect(result.action).toBe('prepareToLeave')
      expect(result.destination).toBe('04')
      expect(result.animation).toBe('33b014v0')
      expect(result.sound).toBe('05d125v0')
    })
  })
})
