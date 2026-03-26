/**
 * BoatAncestors.test.js - TDD tests for boat propulsion ancestor classes
 *
 * Based on original Lingo:
 * - ParentScript 44 - DummyBoatAncestor.ls
 * - ParentScript 39 - MotorBoatAncestor.ls (174 lines)
 * - ParentScript 37 - SailBoatAncestor.ls (108 lines)
 * - ParentScript 40 - OarBoatAncestor.ls (102 lines)
 *
 * KEY DIFFERENCE FROM PREVIOUS TESTS:
 * The .ls ancestors call calcSpeedNDir(child, force, steering) DIRECTLY.
 * They do NOT return {force, steering} objects.
 * Only SailBoatAncestor.loop() returns a value: tmpForce * tmpDiff * SailSize (side force).
 * Motor and Oar loop() return nothing (void/undefined).
 * All kill() methods return 0, NOT null.
 */
'use strict'

import DummyBoatAncestor from '../DummyBoatAncestor'
import MotorBoatAncestor from '../MotorBoatAncestor'
import SailBoatAncestor from '../SailBoatAncestor'
import OarBoatAncestor from '../OarBoatAncestor'

describe('DummyBoatAncestor', () => {
  let ancestor

  describe('constructor', () => {
    test('should have a type property', () => {
      // DummyBoatAncestor is a placeholder with no-op methods
      ancestor = new DummyBoatAncestor({})
      expect(ancestor.type).toBeDefined()
    })
  })

  describe('interface methods', () => {
    beforeEach(() => {
      ancestor = new DummyBoatAncestor({})
    })

    test('init should be callable', () => {
      expect(() => ancestor.init()).not.toThrow()
    })

    // .ls: on kill me → return 0
    test('kill should return 0 (not null)', () => {
      expect(ancestor.kill()).toBe(0)
    })

    test('steer should be callable', () => {
      expect(() => ancestor.steer('left', 'up')).not.toThrow()
    })

    test('loop should be callable', () => {
      expect(() => ancestor.loop()).not.toThrow()
    })

    test('setSpeed should be callable', () => {
      expect(() => ancestor.setSpeed(50)).not.toThrow()
    })

    test('display should be callable', () => {
      expect(() => ancestor.display()).not.toThrow()
    })

    test('playSounds should be callable', () => {
      expect(() => ancestor.playSounds(true)).not.toThrow()
    })
  })
})

describe('MotorBoatAncestor', () => {
  let motor
  let mockChild

  beforeEach(() => {
    mockChild = {
      quickProps: {
        EngineSound: 1,
        fuelConsumption: 10
      },
      steerMethod: 'Keys',
      inFreeZone: false,
      fuel: 10000,
      fuelMeter: { show: jest.fn() },
      // .ls: MotorBoatAncestor.loop() calls calcSpeedNDir(child, motorSpeed, 10 * Steering)
      calcSpeedNDir: jest.fn()
    }
  })

  // MotorBoatAncestor.ls line 4-25: on new me, argChild
  describe('constructor', () => {
    test('should set type to #Motor', () => {
      // .ls line 5: set type to #Motor
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.type).toBe('Motor')
    })

    test('should store child reference', () => {
      // .ls line 4: set child to argChild
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.child).toBe(mockChild)
    })

    test('should initialize motorSpeed to 0', () => {
      // .ls line 4: set motorSpeed to 0
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.motorSpeed).toBe(0)
    })

    test('should load 3 motor sounds based on EngineSound prop', () => {
      // .ls lines 7-20: 8 motor sound sets, each with 3 sounds [start, idle, loop]
      // Selects set based on quickProps.EngineSound (clamped to 1-8)
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.motorSounds).toBeDefined()
      expect(motor.motorSounds.length).toBe(3)
    })

    test('should default EngineSound to 1 when <= 0', () => {
      // .ls line 12: if not (tmpMotorType > 0) then set tmpMotorType to 1
      mockChild.quickProps.EngineSound = 0
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.motorSounds).toBeDefined()
    })

    test('should clamp EngineSound to max 8', () => {
      // .ls line 14: if tmpMotorType > count(motorSounds) then set tmpMotorType to count(motorSounds)
      mockChild.quickProps.EngineSound = 100
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.motorSounds).toBeDefined()
    })

    test('should store fuelConsumption from quickProps', () => {
      // .ls line 25: set fuelConsumption to getaProp(the quickProps of child, #fuelConsumption)
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.fuelConsumption).toBe(10)
    })

    test('should set speedChangeSpeed to 2', () => {
      // .ls line 27: set speedChangeSpeed to 2
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.speedChangeSpeed).toBe(2)
    })

    test('should set zeroSpeedWait to 0', () => {
      // .ls line 26: set zeroSpeedWait to 0
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.zeroSpeedWait).toBe(0)
    })
  })

  // MotorBoatAncestor.ls line 37-51: on steer me, toWhere, argSpeed
  describe('steer', () => {
    beforeEach(() => {
      motor = new MotorBoatAncestor(mockChild)
    })

    test('should set Steering to -1 for #left', () => {
      // .ls line 38: if toWhere = #left then set Steering to -1
      motor.steer('left', null)
      expect(motor.Steering).toBe(-1)
    })

    test('should set Steering to 1 for #right', () => {
      // .ls line 40: if toWhere = #right then set Steering to 1
      motor.steer('right', null)
      expect(motor.Steering).toBe(1)
    })

    test('should set Steering to 0 for neutral', () => {
      // .ls line 42: else set Steering to 0
      motor.steer(null, null)
      expect(motor.Steering).toBe(0)
    })

    test('should set speedChange to -1 for #down', () => {
      // .ls line 45: if argSpeed = #down then set speedChange to -1
      motor.steer(null, 'down')
      expect(motor.speedChange).toBe(-1)
    })

    test('should set speedChange to 1 for #up', () => {
      // .ls line 47: if argSpeed = #up then set speedChange to 1
      motor.steer(null, 'up')
      expect(motor.speedChange).toBe(1)
    })
  })

  // MotorBoatAncestor.ls line 53-119: on loop me
  describe('loop', () => {
    beforeEach(() => {
      motor = new MotorBoatAncestor(mockChild)
      motor.playingSounds = false
    })

    test('should increase motorSpeed by speedChangeSpeed when speedChange > 0', () => {
      // .ls line 72: set motorSpeed to motorSpeed + speedChangeSpeed
      motor.speedChange = 1
      motor.motorSpeed = 50
      motor.loop()
      expect(motor.motorSpeed).toBe(52) // 50 + 2 (speedChangeSpeed)
    })

    test('should decrease motorSpeed by 2*speedChangeSpeed when speedChange < 0 and motorSpeed > 0', () => {
      // .ls line 85: set motorSpeed to motorSpeed - (speedChangeSpeed * 2)
      motor.speedChange = -1
      motor.motorSpeed = 50
      motor.loop()
      expect(motor.motorSpeed).toBe(46) // 50 - 4 (2*speedChangeSpeed)
    })

    test('should cap motorSpeed at 100', () => {
      // .ls line 69: if motorSpeed < 100 then ...
      motor.speedChange = 1
      motor.motorSpeed = 99
      motor.loop()
      expect(motor.motorSpeed).toBeLessThanOrEqual(100)
    })

    test('should cap reverse motorSpeed at -20', () => {
      // .ls line 78: if motorSpeed > -20 then ...
      motor.speedChange = -1
      motor.motorSpeed = -19
      motor.loop()
      expect(motor.motorSpeed).toBeGreaterThanOrEqual(-20)
    })

    test('should set zeroSpeedWait to 15 when crossing zero forward→reverse', () => {
      // .ls line 83: if motorSpeed <= speedChangeSpeed then set zeroSpeedWait to 15; set motorSpeed to 0
      motor.speedChange = -1
      motor.motorSpeed = 2 // <= speedChangeSpeed
      motor.loop()
      expect(motor.zeroSpeedWait).toBe(15)
      expect(motor.motorSpeed).toBe(0)
    })

    test('should set zeroSpeedWait to 15 when crossing zero reverse→forward', () => {
      // .ls line 71-73: if (motorSpeed < 0) and (motorSpeed >= -speedChangeSpeed) then set zeroSpeedWait to 15
      motor.speedChange = 1
      motor.motorSpeed = -2 // >= -speedChangeSpeed
      motor.loop()
      expect(motor.zeroSpeedWait).toBe(15)
      expect(motor.motorSpeed).toBe(0)
    })

    test('should not change speed while zeroSpeedWait > 0', () => {
      // .ls line 66: if zeroSpeedWait then set zeroSpeedWait to zeroSpeedWait - 1
      motor.zeroSpeedWait = 5
      motor.speedChange = 1
      motor.motorSpeed = 0
      motor.loop()
      expect(motor.zeroSpeedWait).toBe(4)
      expect(motor.motorSpeed).toBe(0)
    })

    test('should consume fuel: abs(motorSpeed) * fuelConsumption / 30', () => {
      // .ls line 95: set tmpFuel to tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
      motor.motorSpeed = 60
      const initialFuel = mockChild.fuel
      motor.loop()
      // Expected consumption: 60 * 10 / 30 = 20
      expect(mockChild.fuel).toBe(initialFuel - 20)
    })

    test('should not consume fuel in free zone', () => {
      // .ls line 91: if not (the inFreeZone of child) then
      mockChild.inFreeZone = true
      motor.motorSpeed = 50
      const initialFuel = mockChild.fuel
      motor.loop()
      expect(mockChild.fuel).toBe(initialFuel)
    })

    test('should call calcSpeedNDir on child with (motorSpeed, 10 * Steering)', () => {
      // .ls line 119: calcSpeedNDir(child, motorSpeed, 10 * Steering)
      // KEY: calls directly, does NOT return {force, steering}
      motor.motorSpeed = 50
      motor.Steering = 1
      motor.loop()
      expect(mockChild.calcSpeedNDir).toHaveBeenCalledWith(50, 10)
    })

    test('should NOT return {force, steering} — loop has no return value in .ls', () => {
      // .ls line 119 is the last line of loop — no return statement
      motor.motorSpeed = 50
      motor.Steering = 1
      const result = motor.loop()
      // In Lingo, handlers without explicit return give void/undefined
      expect(result).toBeUndefined()
    })

    test('should call OutOfFuel on child when fuel <= 0', () => {
      // .ls line 98-99: if tmpFuel <= 0 then OutOfFuel(child)
      mockChild.OutOfFuel = jest.fn()
      mockChild.fuel = 1
      motor.motorSpeed = 60
      motor.fuelConsumption = 10
      // Consumption: 60 * 10 / 30 = 20, fuel goes 1 → -19
      motor.loop()
      expect(mockChild.OutOfFuel).toHaveBeenCalled()
    })
  })

  // MotorBoatAncestor.ls line 121-122: on setSpeed me, argSpeed
  describe('setSpeed', () => {
    test('should set motorSpeed directly', () => {
      // .ls line 122: set motorSpeed to argSpeed
      motor = new MotorBoatAncestor(mockChild)
      motor.setSpeed(75)
      expect(motor.motorSpeed).toBe(75)
    })
  })

  // MotorBoatAncestor.ls line 32-35: on kill me
  describe('kill', () => {
    test('should return 0 (not null)', () => {
      // .ls line 35: return 0
      motor = new MotorBoatAncestor(mockChild)
      expect(motor.kill()).toBe(0)
    })
  })
})

describe('SailBoatAncestor', () => {
  let sail
  let mockChild

  beforeEach(() => {
    mockChild = {
      quickProps: {
        SailSize: 100
      },
      steerMethod: 'Keys',
      direction: 1,
      inclinations: [0, 0],
      displayObject: {
        calcPicToShow: jest.fn().mockReturnValue(1)
      },
      // .ls: SailBoatAncestor.loop() calls calcSpeedNDir(child, tmpForce * 14, Steering * 10)
      calcSpeedNDir: jest.fn()
    }
  })

  // SailBoatAncestor.ls line 4-12: on new me, argChild
  describe('constructor', () => {
    test('should set type to #Sail', () => {
      // .ls line 7: set type to #Sail
      sail = new SailBoatAncestor(mockChild)
      expect(sail.type).toBe('Sail')
    })

    test('should store child reference', () => {
      // .ls line 5: set child to argChild
      sail = new SailBoatAncestor(mockChild)
      expect(sail.child).toBe(mockChild)
    })

    test('should create Sail object', () => {
      // .ls line 6: set Sail to new(script "Sail", me)
      sail = new SailBoatAncestor(mockChild)
      expect(sail.Sail).toBeDefined()
    })

    test('should initialize scooting to 0', () => {
      // .ls line 8: set scooting to 0
      sail = new SailBoatAncestor(mockChild)
      expect(sail.scooting).toBe(0)
    })

    test('should store SailSize from quickProps', () => {
      // .ls line 10: set SailSize to getaProp(the quickProps of child, #SailSize)
      sail = new SailBoatAncestor(mockChild)
      expect(sail.SailSize).toBe(100)
    })
  })

  // SailBoatAncestor.ls line 26-42: on steer me, toWhere, argScoot
  describe('steer', () => {
    beforeEach(() => {
      sail = new SailBoatAncestor(mockChild)
    })

    test('should set Steering to -1 for #left', () => {
      // .ls line 27: if toWhere = #left then set Steering to -1
      sail.steer('left', null)
      expect(sail.Steering).toBe(-1)
    })

    test('should set Steering to 1 for #right', () => {
      // .ls line 29: if toWhere = #right then set Steering to 1
      sail.steer('right', null)
      expect(sail.Steering).toBe(1)
    })

    test('should set Steering to 0 for neutral', () => {
      // .ls line 31: else set Steering to 0
      sail.steer(null, null)
      expect(sail.Steering).toBe(0)
    })

    test('should set scooting to -1 for #up', () => {
      // .ls line 34: if argScoot = #up then set scooting to -1
      sail.steer(null, 'up')
      expect(sail.scooting).toBe(-1)
    })

    test('should set scooting to 1 for #down', () => {
      // .ls line 36: if argScoot = #down then set scooting to 1
      sail.steer(null, 'down')
      expect(sail.scooting).toBe(1)
    })

    test('should set scooting to 0 for neutral', () => {
      // .ls line 38: else set scooting to 0
      sail.steer(null, null)
      expect(sail.scooting).toBe(0)
    })
  })

  // SailBoatAncestor.ls line 44-87: on loop me
  describe('loop', () => {
    beforeEach(() => {
      sail = new SailBoatAncestor(mockChild)
    })

    test('should call Sail.getForce() for force — .ls line 51', () => {
      // .ls line 51: set tmpForce to getForce(Sail)
      const spy = jest.spyOn(sail.Sail, 'getForce')
      sail.loop()
      expect(spy).toHaveBeenCalled()
    })

    test('should call calcSpeedNDir on child with (force * 14, Steering * 10) — .ls line 56', () => {
      // .ls line 56: calcSpeedNDir(child, tmpForce * 14, Steering * 10)
      sail.Steering = 1
      sail.Sail.getForce = jest.fn().mockReturnValue(50)
      sail.loop()
      expect(mockChild.calcSpeedNDir).toHaveBeenCalledWith(50 * 14, 1 * 10)
    })

    test('should call Sail.calcDirection with child direction — .ls line 57', () => {
      // .ls line 57: calcDirection(Sail, the direction of child)
      const spy = jest.spyOn(sail.Sail, 'calcDirection')
      mockChild.direction = 5
      sail.loop()
      expect(spy).toHaveBeenCalledWith(5)
    })

    test('should calculate tmpDiff from wind-boat direction — .ls lines 58-68', () => {
      // .ls line 58: tmpDiff = correctDirection(windDir - boatDir - 8)
      // .ls lines 59-68: normalize to -4..4 range
      // Result = tmpForce * tmpDiff * SailSize
      const result = sail.loop()
      expect(typeof result).toBe('number')
    })

    test('should RETURN tmpForce * tmpDiff * SailSize — .ls line 87', () => {
      // .ls line 87: return tmpForce * tmpDiff * SailSize
      // This is the ONLY ancestor that returns a value from loop()
      const result = sail.loop()
      expect(typeof result).toBe('number')
    })

    test('should NOT return {force, steering, sideForce} object', () => {
      const result = sail.loop()
      expect(result).not.toHaveProperty('force')
      expect(result).not.toHaveProperty('steering')
    })

    test('should handle mouse steerMethod — .ls lines 49-53', () => {
      // .ls line 49: if the steerMethod of child = #mouse then
      //   set Steering to calcMouseDir(child)
      //   set tmpForce to getForce(Sail)
      //   set tmpForce to (tmpForce > 0) * (tmpForce + 10) / 2
      mockChild.steerMethod = 'mouse'
      mockChild.calcMouseDir = jest.fn().mockReturnValue(3)
      sail.Sail.getForce = jest.fn().mockReturnValue(50)
      sail.loop()
      // With mouse: Steering should be set from calcMouseDir
      expect(sail.Steering).toBe(3)
      // Force should be modified: (50 > 0) * (50 + 10) / 2 = 1 * 60 / 2 = 30
      expect(mockChild.calcSpeedNDir).toHaveBeenCalledWith(30 * 14, 3 * 10)
    })

    test('should pass keyboard force unchanged — .ls line 54', () => {
      // .ls line 54: else set tmpForce to getForce(Sail)
      // No modification for keyboard mode
      mockChild.steerMethod = 'Keys'
      sail.Sail.getForce = jest.fn().mockReturnValue(50)
      sail.loop()
      expect(mockChild.calcSpeedNDir).toHaveBeenCalledWith(50 * 14, 0) // Steering=0
    })
  })

  // SailBoatAncestor.ls line 22-24: on kill me
  describe('kill', () => {
    test('should kill Sail object and return 0', () => {
      // .ls line 23: set Sail to kill(Sail)
      // .ls line 24: return 0
      sail = new SailBoatAncestor(mockChild)
      expect(sail.kill()).toBe(0)
    })
  })
})

describe('OarBoatAncestor', () => {
  let oar
  let mockChild

  beforeEach(() => {
    mockChild = {
      steerMethod: 'Keys',
      mulleHungerSpeed: 2,
      orgMulleHungerSpeed: 2,
      // .ls: OarBoatAncestor.loop() calls calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
      calcSpeedNDir: jest.fn()
    }
  })

  // OarBoatAncestor.ls line 4-17: on new me, argChild
  describe('constructor', () => {
    test('should set type to #Oar', () => {
      // .ls line 6: set type to #Oar
      oar = new OarBoatAncestor(mockChild)
      expect(oar.type).toBe('Oar')
    })

    test('should store child reference', () => {
      // .ls line 5: set child to argChild
      oar = new OarBoatAncestor(mockChild)
      expect(oar.child).toBe(mockChild)
    })

    test('should initialize Oars to [0, 0]', () => {
      // .ls line 7: set Oars to [0, 0]
      oar = new OarBoatAncestor(mockChild)
      expect(oar.Oars).toEqual([0, 0])
    })

    test('should initialize Oar to 0', () => {
      // .ls line 8: set Oar to 0
      oar = new OarBoatAncestor(mockChild)
      expect(oar.Oar).toBe(0)
    })

    test('should initialize exact oarForce array from .ls', () => {
      // .ls line 9: set oarForce to [20, 20, 20, 20, 40, 40, 40, 60, 60, 80, 100, 80, 80, 80, 60, 60, 60, 60, 40, 40, 40, 40, 20, 20, 0]
      oar = new OarBoatAncestor(mockChild)
      expect(oar.oarForce).toEqual([
        20, 20, 20, 20, 40, 40, 40, 60, 60, 80,
        100, 80, 80, 80, 60, 60, 60, 60, 40, 40,
        40, 40, 20, 20, 0
      ])
    })

    test('should set forceCount to 25 (oarForce length)', () => {
      // .ls line 10: set forceCount to count(oarForce)
      oar = new OarBoatAncestor(mockChild)
      expect(oar.forceCount).toBe(25)
    })

    test('should set mouseForceCount to forceCount', () => {
      // .ls line 11: set mouseForceCount to forceCount
      oar = new OarBoatAncestor(mockChild)
      expect(oar.mouseForceCount).toBe(25)
    })

    test('should initialize rowing sounds', () => {
      // .ls line 12: set sounds to ["05d127v0", "05d126v0"]
      oar = new OarBoatAncestor(mockChild)
      expect(oar.sounds).toEqual(['05d127v0', '05d126v0'])
    })

    test('should initialize soundCount to 1', () => {
      // .ls line 15: set soundCount to 1
      oar = new OarBoatAncestor(mockChild)
      expect(oar.soundCount).toBe(1)
    })
  })

  // OarBoatAncestor.ls line 23-39: on steer me, toWhere, argSpeed
  describe('steer', () => {
    beforeEach(() => {
      oar = new OarBoatAncestor(mockChild)
    })

    test('should set Steering to -1 for #left', () => {
      // .ls line 24: if toWhere = #left then set Steering to -1
      oar.steer('left', null)
      expect(oar.Steering).toBe(-1)
    })

    test('should set Steering to 1 for #right', () => {
      // .ls line 26: if toWhere = #right then set Steering to 1
      oar.steer('right', null)
      expect(oar.Steering).toBe(1)
    })

    test('should set Steering to 0 for neutral', () => {
      // .ls line 28: else set Steering to 0
      oar.steer(null, null)
      expect(oar.Steering).toBe(0)
    })

    test('should set Oar to -forceCount for #down when idle', () => {
      // .ls line 31-33: if Oar = 0 then if argSpeed = #down then set Oar to -forceCount
      oar.Oar = 0
      oar.steer(null, 'down')
      expect(oar.Oar).toBe(-25)
    })

    test('should set Oar to forceCount for #up when idle', () => {
      // .ls line 34-36: if argSpeed = #up then set Oar to forceCount
      oar.Oar = 0
      oar.steer(null, 'up')
      expect(oar.Oar).toBe(25)
    })

    test('should NOT change Oar when already rowing', () => {
      // .ls line 30: if Oar = 0 then ... (only acts when idle)
      oar.Oar = 10
      oar.steer(null, 'up')
      expect(oar.Oar).toBe(10)
    })

    test('should set Oar to 0 for non-symbol argSpeed', () => {
      // .ls line 38: else set Oar to 0
      oar.Oar = 10
      oar.steer(null, 0)  // non-symbol
      expect(oar.Oar).toBe(0)
    })
  })

  // OarBoatAncestor.ls line 41-82: on loop me
  describe('loop', () => {
    beforeEach(() => {
      oar = new OarBoatAncestor(mockChild)
    })

    test('should decrement Oar and read force when Oar > 1', () => {
      // .ls line 56-58: if Oar > 1 then set tmpForce to getAt(oarForce, Oar); set Oar to Oar - 1
      oar.Oar = 20
      oar.loop()
      expect(oar.Oar).toBe(19)
    })

    test('should increment Oar and negate force when Oar < -1', () => {
      // .ls line 62-64: if Oar < -1 then set tmpForce to -getAt(oarForce, -Oar); set Oar to Oar + 1
      oar.Oar = -20
      oar.loop()
      expect(oar.Oar).toBe(-19)
    })

    test('should set tmpForce to 0 when Oar is 0 or 1 or -1', () => {
      // .ls line 65: else set tmpForce to 0
      oar.Oar = 0
      oar.loop()
      // Should call calcSpeedNDir with force 0
      expect(mockChild.calcSpeedNDir).toHaveBeenCalledWith(0, expect.any(Number))
    })

    test('should call calcSpeedNDir with (force * 13, 5 * Steering)', () => {
      // .ls line 82: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
      oar.Oar = 11 // oarForce[10] = 100 (peak, 0-indexed) — but .ls is 1-indexed!
      // In .ls: getAt(oarForce, 11) = 100 (1-indexed, so index 11 = oarForce[10] = 100)
      oar.Steering = 1
      oar.loop()
      // Force = 100 * 13 = 1300, Steering = 5 * 1 = 5
      expect(mockChild.calcSpeedNDir).toHaveBeenCalledWith(1300, 5)
    })

    test('should NOT return {force, steering} — loop has no return in .ls', () => {
      // .ls: no return statement in OarBoatAncestor.loop()
      oar.Oar = 10
      const result = oar.loop()
      expect(result).toBeUndefined()
    })

    test('should double mulleHungerSpeed when rowing (force > 0)', () => {
      // .ls line 75-76: if tmpForce then set the mulleHungerSpeed of child to 2 * the orgMulleHungerSpeed of child
      oar.Oar = 10 // Will have non-zero force
      oar.loop()
      expect(mockChild.mulleHungerSpeed).toBe(4) // 2 * orgMulleHungerSpeed(2)
    })

    test('should reset mulleHungerSpeed to orgMulleHungerSpeed when idle', () => {
      // .ls line 77-78: else set the mulleHungerSpeed of child to the orgMulleHungerSpeed of child
      mockChild.mulleHungerSpeed = 4
      oar.Oar = 0
      oar.loop()
      expect(mockChild.mulleHungerSpeed).toBe(2) // orgMulleHungerSpeed
    })

    test('should toggle soundCount (3 - soundCount) when force becomes 0', () => {
      // .ls line 80: set soundCount to 3 - soundCount
      // Sound plays when tmpForce = 0 and tmpPlaySound = 1
      // oarForce[24] = 0 (1-indexed: index 25), so Oar = 25 reads force = 0
      // But Oar must be > 1 to enter the force-reading branch...
      // Actually: Oar=25, getAt(oarForce, 25) = oarForce[24] = 0, tmpPlaySound = 1
      oar.Oar = 25
      const initialSoundCount = oar.soundCount
      oar.loop()
      expect(oar.soundCount).toBe(3 - initialSoundCount)
    })
  })

  // OarBoatAncestor.ls line 84-85: on setSpeed me, argSpeed
  describe('setSpeed', () => {
    test('should set Oars to [1, 1]', () => {
      // .ls line 85: set Oars to [1, 1]
      // NOTE: setSpeed doesn't set speed, it sets Oars!
      oar = new OarBoatAncestor(mockChild)
      oar.setSpeed(50)
      expect(oar.Oars).toEqual([1, 1])
    })
  })

  // OarBoatAncestor.ls line 20-21: on kill me
  describe('kill', () => {
    test('should return 0 (not null)', () => {
      // .ls line 21: return 0
      oar = new OarBoatAncestor(mockChild)
      expect(oar.kill()).toBe(0)
    })
  })
})
