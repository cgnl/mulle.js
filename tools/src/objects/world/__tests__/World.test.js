/**
 * World.test.js - TDD tests based on original Lingo
 * ParentScript 137 - World.ls
 *
 * Single world data and map grid management.
 */
'use strict'

import World from '../World'

describe('World', () => {
  let world

  beforeEach(() => {
    world = new World()
  })

  describe('constructor (new me)', () => {
    test('should initialize empty WorldId', () => {
      expect(world.WorldId).toBe('')
    })

    test('should initialize empty map array', () => {
      expect(world.map).toEqual([])
    })

    test('should initialize empty symbol', () => {
      expect(world.symbol).toBe('')
    })

    test('should initialize StartMap to origin', () => {
      expect(world.StartMap).toEqual({ x: 0, y: 0 })
    })

    test('should initialize StartCoordinate to origin', () => {
      expect(world.StartCoordinate).toEqual({ x: 0, y: 0 })
    })

    test('should initialize StartDirection to 0', () => {
      expect(world.StartDirection).toBe(0)
    })

    test('should initialize enteredObjectId to 0', () => {
      expect(world.enteredObjectId).toBe(0)
    })

    test('should initialize empty rDests', () => {
      expect(world.rDests).toEqual({})
    })

    test('should initialize empty allRDests', () => {
      expect(world.allRDests).toEqual({})
    })

    test('should initialize symbolPosition to 0', () => {
      expect(world.symbolPosition).toBe(0)
    })
  })

  describe('kill', () => {
    test('should clear map', () => {
      world.map = [[1, 2], [3, 4]]
      world.kill()
      expect(world.map).toBe(0)
    })

    test('should return 0', () => {
      expect(world.kill()).toBe(0)
    })
  })

  describe('getId', () => {
    test('should return WorldId', () => {
      world.WorldId = 'world1'
      expect(world.getId()).toBe('world1')
    })
  })

  describe('getPosition', () => {
    test('should return symbolPosition', () => {
      world.symbolPosition = 5
      expect(world.getPosition()).toBe(5)
    })
  })

  describe('enteredObject/getEnteredObject', () => {
    test('should set entered object id', () => {
      world.enteredObject(42)
      expect(world.enteredObjectId).toBe(42)
    })

    test('should get entered object id', () => {
      world.enteredObjectId = 99
      expect(world.getEnteredObject()).toBe(99)
    })
  })

  describe('getStartInfo', () => {
    test('should return start info object', () => {
      world.StartMap = { x: 5, y: 3 }
      world.StartCoordinate = { x: 100, y: 200 }
      world.StartDirection = 8

      const info = world.getStartInfo()

      expect(info).toEqual({
        map: { x: 5, y: 3 },
        coordinate: { x: 100, y: 200 },
        direction: 8,
        fuel: 'Full'
      })
    })
  })

  describe('getSymbol', () => {
    test('should return symbol', () => {
      world.symbol = 'Harbor'
      expect(world.getSymbol()).toBe('Harbor')
    })
  })

  describe('getWorldSize', () => {
    test('should return world dimensions', () => {
      world.map = [
        [1, 2, 3, 4],  // 4 columns
        [5, 6, 7, 8],
        [9, 10, 11, 12]  // 3 rows
      ]

      const size = world.getWorldSize()

      expect(size).toEqual({ x: 4, y: 3 })
    })

    test('should handle empty map', () => {
      world.map = []

      const size = world.getWorldSize()

      expect(size).toEqual({ x: 0, y: 0 })
    })
  })

  describe('getCurrentMapId', () => {
    beforeEach(() => {
      world.map = [
        [101, 102, 103],
        [104, 105, 106],
        [107, 108, 109]
      ]
      world.currentMap = { x: 2, y: 2 }
    })

    test('should return map id at current position', () => {
      expect(world.getCurrentMapId()).toBe(105)
    })

    test('should return InvalidYIndex for out of bounds Y', () => {
      world.currentMap = { x: 1, y: 10 }
      expect(world.getCurrentMapId()).toBe('InvalidYIndex')
    })

    test('should return InvalidXIndex for out of bounds X', () => {
      world.currentMap = { x: 10, y: 1 }
      expect(world.getCurrentMapId()).toBe('InvalidXIndex')
    })

    test('should return InvalidYIndex for Y < 1', () => {
      world.currentMap = { x: 1, y: 0 }
      expect(world.getCurrentMapId()).toBe('InvalidYIndex')
    })
  })

  describe('getNewMapId', () => {
    beforeEach(() => {
      world.map = [
        [101, 102, 103],
        [104, 105, 106],
        [107, 108, 109]
      ]
      world.currentMap = { x: 2, y: 2 }
    })

    test('should get map id with absolute mode', () => {
      const id = world.getNewMapId({ x: 3, y: 1 }, 'Absolute')

      expect(id).toBe(103)
    })

    test('should get map id with relational mode', () => {
      // Current is (2,2), relative (1,0) = (3,2)
      const id = world.getNewMapId({ x: 1, y: 0 }, 'Relational')

      expect(id).toBe(106)
    })

    test('should update currentMap when not just checking', () => {
      world.getNewMapId({ x: 3, y: 3 }, 'Absolute')

      expect(world.currentMap).toEqual({ x: 3, y: 3 })
    })

    test('should not update currentMap when just checking', () => {
      world.getNewMapId({ x: 3, y: 3 }, 'Absolute', true)

      expect(world.currentMap).toEqual({ x: 2, y: 2 })
    })

    test('should return InvalidYIndex for out of bounds', () => {
      expect(world.getNewMapId({ x: 1, y: 10 }, 'Absolute')).toBe('InvalidYIndex')
    })

    test('should return InvalidXIndex for out of bounds', () => {
      expect(world.getNewMapId({ x: 10, y: 1 }, 'Absolute')).toBe('InvalidXIndex')
    })
  })

  describe('randomizeDestinations', () => {
    test('should create random destination assignments', () => {
      world.allRDests = {
        dest1: [{ x: 1, y: 1 }, { x: 2, y: 2 }],
        dest2: [{ x: 3, y: 3 }]
      }

      world.randomizeDestinations()

      // Each dest should have one assigned location
      expect(world.rDests.dest1).toBeDefined()
      expect(world.rDests.dest2).toBeDefined()
    })

    test('should avoid duplicate locations', () => {
      world.allRDests = {
        dest1: [{ x: 1, y: 1 }],
        dest2: [{ x: 1, y: 1 }, { x: 2, y: 2 }]
      }

      world.randomizeDestinations()

      // Destinations should be at different locations
      const loc1 = world.rDests.dest1
      const loc2 = world.rDests.dest2

      if (loc1 && loc2) {
        expect(loc1.x !== loc2.x || loc1.y !== loc2.y).toBe(true)
      }
    })
  })

  describe('getRandomDestinations', () => {
    test('should return rDests', () => {
      world.rDests = { dest1: { x: 1, y: 2 } }

      expect(world.getRandomDestinations()).toEqual({ dest1: { x: 1, y: 2 } })
    })
  })

  describe('toList', () => {
    test('should serialize to list', () => {
      world.WorldId = 'w1'
      world.map = [[1, 2], [3, 4]]
      world.symbol = 'Harbor'
      world.StartMap = { x: 1, y: 1 }
      world.StartCoordinate = { x: 100, y: 200 }
      world.StartDirection = 4
      world.symbolPosition = 2

      const list = world.toList()

      expect(list).toEqual({
        WorldId: 'w1',
        map: [[1, 2], [3, 4]],
        symbol: 'Harbor',
        StartMap: { x: 1, y: 1 },
        StartCoordinate: { x: 100, y: 200 },
        StartDirection: 4,
        symbolPosition: 2
      })
    })
  })

  describe('fromList', () => {
    test('should deserialize from data', () => {
      const data = {
        WorldId: 'loaded',
        map: [[10, 20], [30, 40]],
        symbol: 'Island',
        StartMap: { x: 2, y: 1 },
        StartCoordinate: { x: 300, y: 400 },
        StartDirection: 12,
        symbolPosition: 3
      }

      const result = world.fromList(data)

      expect(result).toBe(true)
      expect(world.WorldId).toBe('loaded')
      expect(world.map).toEqual([[10, 20], [30, 40]])
      expect(world.symbol).toBe('Island')
      expect(world.StartDirection).toBe(12)
      expect(world.currentMap).toEqual({ x: 2, y: 1 })
    })

    test('should set currentMap to StartMap', () => {
      world.fromList({
        StartMap: { x: 5, y: 3 }
      })

      expect(world.currentMap).toEqual({ x: 5, y: 3 })
    })
  })
})
