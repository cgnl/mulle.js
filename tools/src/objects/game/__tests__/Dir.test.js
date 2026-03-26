/**
 * Dir.test.js - TDD tests based on original Lingo Dir.ls (ParentScript 2)
 *
 * Main game director/controller for driving scene.
 * Manages boat, weather, map, objects, and input.
 */
'use strict'

import Dir from '../Dir'

describe('Dir', () => {
  let dir
  let mockGlobals

  beforeEach(() => {
    mockGlobals = {
      user: {
        boat: { boatProperties: {} },
        inventory: {}
      },
      world: null,
      worlds: { activeWorld: 1 },
      loopMaster: { addObject: jest.fn(), deleteObject: jest.fn() }
    }
  })

  describe('constructor (new me)', () => {
    test('should create drivingHandlers', () => {
      dir = new Dir(mockGlobals)
      expect(dir.drivingHandlers).toBeDefined()
    })

    test('should create mulleTalkObject', () => {
      dir = new Dir(mockGlobals)
      expect(dir.mulleTalkObject).toBeDefined()
    })

    test('should initialize spriteList', () => {
      // Original: set spriteList to [#Water: 15, #UnderMap: 18, ...]
      dir = new Dir(mockGlobals)
      expect(dir.spriteList).toBeDefined()
      expect(dir.spriteList.Water).toBe(15)
      expect(dir.spriteList.boat).toBe(42)
    })

    test('should initialize counter to 1', () => {
      dir = new Dir(mockGlobals)
      expect(dir.counter).toBe(1)
    })

    test('should initialize mode to normal', () => {
      dir = new Dir(mockGlobals)
      expect(dir.mode).toBe('normal')
    })

    test('should initialize cycling to false', () => {
      dir = new Dir(mockGlobals)
      expect(dir.cycling).toBe(false)
    })

    test('should initialize empty objects list', () => {
      dir = new Dir(mockGlobals)
      expect(dir.objects).toEqual([])
    })

    test('should initialize pausing to false', () => {
      dir = new Dir(mockGlobals)
      expect(dir.pausing).toBe(false)
    })

    test('should initialize isLeaving to false', () => {
      dir = new Dir(mockGlobals)
      expect(dir.isLeaving).toBe(false)
    })
  })

  describe('kill (on kill me)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.objects = [{ kill: jest.fn() }, { kill: jest.fn() }]
      dir.drivingHandlers = { kill: jest.fn().mockReturnValue(null) }
      dir.boat = { kill: jest.fn().mockReturnValue(null) }
      dir.weatherRenderer = { kill: jest.fn().mockReturnValue(null) }
      dir.ambience = { kill: jest.fn().mockReturnValue(null) }
      dir.mulleTalkObject = { kill: jest.fn().mockReturnValue(null) }
    })

    test('should kill all objects', () => {
      const obj1 = dir.objects[0]
      const obj2 = dir.objects[1]

      dir.kill()

      expect(obj1.kill).toHaveBeenCalled()
      expect(obj2.kill).toHaveBeenCalled()
    })

    test('should clear objects list', () => {
      dir.kill()
      expect(dir.objects).toEqual([])
    })

    test('should kill all sub-systems', () => {
      // Capture mock references before kill() sets them to null
      const drivingHandlersKill = dir.drivingHandlers.kill
      const boatKill = dir.boat.kill
      const weatherRendererKill = dir.weatherRenderer.kill
      const ambienceKill = dir.ambience.kill
      const mulleTalkObjectKill = dir.mulleTalkObject.kill

      dir.kill()

      expect(drivingHandlersKill).toHaveBeenCalled()
      expect(boatKill).toHaveBeenCalled()
      expect(weatherRendererKill).toHaveBeenCalled()
      expect(ambienceKill).toHaveBeenCalled()
      expect(mulleTalkObjectKill).toHaveBeenCalled()
    })

    test('should return null', () => {
      expect(dir.kill()).toBeNull()
    })
  })

  describe('mouse (on mouse me, argObj, argWhat)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.boat = { steerMethod: 'Keys' }
    })

    test('should do nothing when pausing', () => {
      dir.pausing = true

      dir.mouse(null, 'down')

      expect(dir.boat.steerMethod).toBe('Keys')
    })

    test('should switch to mouse steering on mousedown', () => {
      dir.mouse(null, 'down')

      expect(dir.boat.steerMethod).toBe('mouse')
    })

    test('should not change if already mouse steering', () => {
      dir.boat.steerMethod = 'mouse'

      dir.mouse(null, 'down')

      expect(dir.boat.steerMethod).toBe('mouse')
    })
  })

  describe('key (on key me, arg1, arg2)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.boat = {
        steerMethod: 'Keys',
        steer: jest.fn()
      }
    })

    test('should steer boat when using keyboard', () => {
      dir.key('left', 'up')

      expect(dir.boat.steer).toHaveBeenCalledWith('left', 'up')
    })

    test('should switch from mouse to keyboard on key input', () => {
      dir.boat.steerMethod = 'mouse'

      dir.key('left', null)

      expect(dir.boat.steerMethod).toBe('Keys')
      expect(dir.boat.steer).toHaveBeenCalled()
    })

    test('should not switch to keyboard on zero input', () => {
      dir.boat.steerMethod = 'mouse'

      dir.key(0, 0)

      expect(dir.boat.steerMethod).toBe('mouse')
    })
  })

  describe('loop (on loop me)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.boat = {
        loop: jest.fn(),
        getShowCoordinate: () => ({ x: 320, y: 240 })
      }
      dir.objects = [
        { step: jest.fn() },
        { step: jest.fn() }
      ]
    })

    test('should call boat.loop in Driving mode', () => {
      dir.mode = 'Driving'

      dir.loop()

      expect(dir.boat.loop).toHaveBeenCalled()
    })

    test('should call step on all objects', () => {
      dir.mode = 'Driving'

      dir.loop()

      expect(dir.objects[0].step).toHaveBeenCalled()
      expect(dir.objects[1].step).toHaveBeenCalled()
    })

    test('should not call boat.loop when not in Driving mode', () => {
      dir.mode = 'normal'

      dir.loop()

      expect(dir.boat.loop).not.toHaveBeenCalled()
    })
  })

  describe('pause (on pause me, argYesNo)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.boat = {
        programControl: jest.fn(),
        playSounds: jest.fn()
      }
      dir.weatherRenderer = {
        allowRadio: jest.fn()
      }
      dir.activateinterface = jest.fn()
    })

    test('should set pausing flag', () => {
      dir.pause(true)
      expect(dir.pausing).toBe(true)

      dir.pause(false)
      expect(dir.pausing).toBe(false)
    })

    test('should set boat program control', () => {
      dir.pause(true)

      expect(dir.boat.programControl).toHaveBeenCalledWith(true)
    })

    test('should disable boat sounds when pausing', () => {
      dir.pause(true)

      expect(dir.boat.playSounds).toHaveBeenCalledWith(false)
    })

    test('should enable boat sounds when unpausing', () => {
      dir.pause(false)

      expect(dir.boat.playSounds).toHaveBeenCalledWith(true)
    })
  })

  describe('changeMap (on changeMap me, thePoint, theMode)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.mapCoordinate = { x: 0, y: 0 }
      dir.boat = { setTopology: jest.fn() }
      dir.map = {
        getMapImage: () => 'map01',
        getTopology: () => 'topo01',
        getObjects: () => []
      }
      dir.weatherRenderer = { changeMap: jest.fn() }
      mockGlobals.world = {
        getNewMapId: () => 1,
        StartMap: { x: 0, y: 0 }
      }
    })

    test('should update mapCoordinate for Relational mode', () => {
      dir.changeMap({ x: 1, y: 0 }, 'Relational')

      expect(dir.mapCoordinate).toEqual({ x: 1, y: 0 })
    })

    test('should set mapCoordinate directly for Absolute mode', () => {
      dir.changeMap({ x: 5, y: 3 }, 'Absolute')

      expect(dir.mapCoordinate).toEqual({ x: 5, y: 3 })
    })

    test('should return true on success', () => {
      const result = dir.changeMap({ x: 1, y: 0 })

      expect(result).toBe(true)
    })

    test('should return false if no valid map', () => {
      mockGlobals.world.getNewMapId = () => null

      const result = dir.changeMap({ x: 100, y: 100 })

      expect(result).toBe(false)
    })
  })

  describe('prepareToLeave (on prepareToLeave me, argToDir)', () => {
    beforeEach(() => {
      dir = new Dir(mockGlobals)
      dir.boat = { save: () => ({ direction: 1 }) }
      dir.ambience = { activate: jest.fn() }
      dir.activateinterface = jest.fn()
      dir.mapCoordinate = { x: 1, y: 2 }
    })

    test('should do nothing if already leaving', () => {
      dir.isLeaving = true
      const initialNextDir = dir.nextDir

      dir.prepareToLeave('04')

      expect(dir.nextDir).toBe(initialNextDir)
    })

    test('should set isLeaving to true', () => {
      dir.prepareToLeave('04')

      expect(dir.isLeaving).toBe(true)
    })

    test('should set nextDir', () => {
      dir.prepareToLeave('06')

      expect(dir.nextDir).toBe('06')
    })

    test('should deactivate ambience', () => {
      dir.prepareToLeave('04')

      expect(dir.ambience.activate).toHaveBeenCalledWith(false)
    })

    test('should deactivate interface', () => {
      dir.prepareToLeave('04')

      expect(dir.activateinterface).toHaveBeenCalledWith(false)
    })

    test('should set default transPic for home (04)', () => {
      dir.prepareToLeave('04')

      expect(dir.transPic).toBe('33b018v0')
    })

    test('should set custom transPic if provided', () => {
      dir.prepareToLeave('04', '33b011v0')

      expect(dir.transPic).toBe('33b011v0')
    })
  })
})
