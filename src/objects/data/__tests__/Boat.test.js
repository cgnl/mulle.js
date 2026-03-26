/**
 * Boat.test.js - TDD tests based on original Lingo
 * ParentScript 11 - Boat.ls
 *
 * Boat configuration and parts management.
 */
'use strict'

import Boat from '../Boat'

describe('Boat', () => {
  let boat
  let mockParts

  beforeEach(() => {
    mockParts = {
      getPart: jest.fn().mockImplementation((partId) => ({
        getCoveredPoints: () => [],
        getNewPoints: () => [],
        getRequiredPoints: () => [],
        getPropertyList: () => ({}),
        getMorphList: () => [partId],
        getMaster: () => 0
      }))
    }
    boat = new Boat(mockParts)
  })

  describe('constructor (new me)', () => {
    test('should initialize empty parts array', () => {
      expect(boat.parts).toEqual([])
    })

    test('should initialize empty name', () => {
      expect(boat.name).toBe('')
    })

    test('should initialize empty medals array', () => {
      expect(boat.medals).toEqual([])
    })

    test('should initialize empty boatProperties', () => {
      expect(boat.boatProperties).toEqual({})
    })

    test('should initialize empty boatSnapPoints', () => {
      expect(boat.boatSnapPoints).toEqual([])
    })

    test('should initialize empty boatSnapOffsets', () => {
      expect(boat.boatSnapOffsets).toEqual({})
    })

    test('should initialize newBoatName', () => {
      expect(boat.newBoatName).toBeDefined()
    })
  })

  describe('kill', () => {
    test('should clear parts', () => {
      boat.parts = [1, 2, 3]
      boat.kill()
      expect(boat.parts).toBe(0)
    })

    test('should clear medals', () => {
      boat.medals = [1, 2]
      boat.kill()
      expect(boat.medals).toBe(0)
    })

    test('should return 0', () => {
      expect(boat.kill()).toBe(0)
    })
  })

  describe('areTheseFree', () => {
    test('should return false for empty list', () => {
      expect(boat.areTheseFree([])).toBe(false)
    })

    test('should return true if all points are free', () => {
      boat.boatSnapPoints = [1, 2, 3]
      expect(boat.areTheseFree([1, 2])).toBe(true)
    })

    test('should return false if any point is not free', () => {
      boat.boatSnapPoints = [1, 2]
      expect(boat.areTheseFree([1, 3])).toBe(false)
    })
  })

  describe('parts management', () => {
    describe('addPart', () => {
      test('should add part to parts list', () => {
        boat.addPart(100)
        expect(boat.parts).toContain(100)
      })

      test('should remove covered points', () => {
        mockParts.getPart = jest.fn().mockReturnValue({
          getCoveredPoints: () => [5],
          getNewPoints: () => [],
          getRequiredPoints: () => []
        })
        boat.boatSnapPoints = [5, 6, 7]

        boat.addPart(100)

        expect(boat.boatSnapPoints).not.toContain(5)
      })

      test('should add new snap points', () => {
        mockParts.getPart = jest.fn().mockReturnValue({
          getCoveredPoints: () => [],
          getNewPoints: () => [[10, [1, 2], { x: 0, y: 0 }]],
          getRequiredPoints: () => []
        })

        boat.addPart(100)

        expect(boat.boatSnapPoints).toContain(10)
      })
    })

    describe('removePart', () => {
      test('should remove part from parts list', () => {
        boat.parts = [100, 200, 300]

        boat.removePart(200)

        expect(boat.parts).toEqual([100, 300])
      })

      test('should restore covered points', () => {
        mockParts.getPart = jest.fn().mockReturnValue({
          getCoveredPoints: () => [5],
          getNewPoints: () => []
        })
        boat.parts = [100]
        boat.boatSnapPoints = []

        boat.removePart(100)

        expect(boat.boatSnapPoints).toContain(5)
      })
    })

    describe('deletePart', () => {
      test('should delete part by id', () => {
        boat.parts = [100, 200, 300]

        boat.deletePart(200)

        expect(boat.parts).toEqual([100, 300])
      })
    })

    describe('replacePart', () => {
      test('should replace one part with another', () => {
        boat.parts = [100, 200, 300]

        boat.replacePart(200, 250)

        expect(boat.parts).toEqual([100, 250, 300])
      })

      test('should do nothing if from part not found', () => {
        boat.parts = [100, 300]

        boat.replacePart(200, 250)

        expect(boat.parts).toEqual([100, 300])
      })
    })

    describe('getParts', () => {
      test('should return parts array', () => {
        boat.parts = [1, 2, 3]
        expect(boat.getParts()).toEqual([1, 2, 3])
      })
    })

    describe('findPart', () => {
      test('should return true if part exists', () => {
        boat.parts = [100, 200]
        expect(boat.findPart(100)).toBe(true)
      })

      test('should return false if part not found', () => {
        boat.parts = [100, 200]
        expect(boat.findPart(300)).toBe(false)
      })

      test('should check morphs', () => {
        mockParts.getPart = jest.fn().mockReturnValue({
          getMorphList: () => [100, 101, 102]
        })
        boat.parts = [101]

        expect(boat.findPart(100)).toBe(true)
      })
    })

    describe('isBoatPart', () => {
      test('should return true if part in boat', () => {
        boat.parts = [100, 200]
        mockParts.getPart = jest.fn().mockReturnValue({
          getMaster: () => 0
        })

        expect(boat.isBoatPart(100)).toBe(true)
      })

      test('should check master id', () => {
        boat.parts = [101]  // Variant part
        mockParts.getPart = jest.fn().mockReturnValue({
          getMaster: () => 100  // Master is 100
        })

        expect(boat.isBoatPart(100)).toBe(true)
      })
    })
  })

  describe('medals', () => {
    describe('addMedal', () => {
      test('should add new medal', () => {
        boat.addMedal(5)
        expect(boat.medals).toContain(5)
      })

      test('should not add duplicate medal', () => {
        boat.addMedal(5)
        boat.addMedal(5)
        expect(boat.medals.filter(m => m === 5)).toHaveLength(1)
      })
    })

    describe('getMedal', () => {
      test('should return true if medal exists', () => {
        boat.medals = [5, 6]
        expect(boat.getMedal(5)).toBe(true)
      })

      test('should return false if medal not exists', () => {
        boat.medals = [5, 6]
        expect(boat.getMedal(7)).toBe(false)
      })
    })
  })

  describe('name', () => {
    describe('setName', () => {
      test('should set boat name', () => {
        boat.setName('SS Mulle')
        expect(boat.name).toBe('SS Mulle')
      })
    })

    describe('getName', () => {
      test('should get boat name', () => {
        boat.name = 'My Boat'
        expect(boat.getName()).toBe('My Boat')
      })
    })

    describe('clearBoat', () => {
      test('should reset name to default', () => {
        boat.name = 'Old Name'
        boat.newBoatName = 'New Boat'

        boat.clearBoat()

        expect(boat.name).toBe('New Boat')
      })

      test('should clear medals', () => {
        boat.medals = [1, 2, 3]

        boat.clearBoat()

        expect(boat.medals).toEqual([])
      })
    })
  })

  describe('snap points', () => {
    describe('getSnapPoints', () => {
      test('should return snap points', () => {
        boat.boatSnapPoints = [1, 2, 3]
        expect(boat.getSnapPoints()).toEqual([1, 2, 3])
      })
    })

    describe('getSnapInfo', () => {
      beforeEach(() => {
        boat.boatSnapOffsets = {
          5: [[1, 2], { x: 10, y: 20 }]
        }
      })

      test('should return layers', () => {
        expect(boat.getSnapInfo(5, 'layers')).toEqual([1, 2])
      })

      test('should return offset', () => {
        expect(boat.getSnapInfo(5, 'offset')).toEqual({ x: 10, y: 20 })
      })

      test('should return full info without what', () => {
        expect(boat.getSnapInfo(5)).toEqual([[1, 2], { x: 10, y: 20 }])
      })
    })
  })

  describe('properties', () => {
    describe('updateProperties', () => {
      test('should aggregate properties from all parts', () => {
        boat.parts = [100, 200]
        mockParts.getPart = jest.fn()
          .mockReturnValueOnce({ getPropertyList: () => ({ weight: 50, power: 10 }) })
          .mockReturnValueOnce({ getPropertyList: () => ({ weight: 30, speed: 5 }) })

        boat.updateProperties()

        expect(boat.boatProperties.weight).toBe(80)
        expect(boat.boatProperties.power).toBe(10)
        expect(boat.boatProperties.speed).toBe(5)
      })
    })

    describe('getProperty', () => {
      test('should return property value', () => {
        boat.boatProperties = { weight: 100, power: 50 }

        expect(boat.getProperty('weight')).toBe(100)
        expect(boat.getProperty('power')).toBe(50)
      })

      test('should return undefined for missing property', () => {
        boat.boatProperties = {}

        expect(boat.getProperty('missing')).toBeUndefined()
      })
    })

    describe('getCurrentLoadCapacity', () => {
      test('should calculate load capacity', () => {
        boat.getHull = jest.fn().mockReturnValue(100)
        boat.boatProperties = {
          weight: 200,
          LoadCapacity: 500
        }
        mockParts.getPart = jest.fn().mockReturnValue({
          getProperty: (prop) => prop === 'weight' ? 50 : 0
        })

        const capacity = boat.getCurrentLoadCapacity()

        // LoadCapacity - (totalWeight - hullWeight) = 500 - (200 - 50) = 350
        expect(capacity).toBe(350)
      })

      test('should return 0 if no hull', () => {
        boat.getHull = jest.fn().mockReturnValue('NoHull')

        expect(boat.getCurrentLoadCapacity()).toBe(0)
      })
    })
  })

  describe('trash', () => {
    test('should clear boat parts', () => {
      boat.parts = [100, 200, 300]
      boat.getHull = jest.fn().mockReturnValue(100)
      boat.getRudder = jest.fn().mockReturnValue(200)

      boat.trash()

      expect(boat.parts).toEqual([])
    })

    test('should clear properties', () => {
      boat.boatProperties = { weight: 100 }

      boat.trash()

      expect(boat.boatProperties).toEqual({})
    })
  })

  describe('rebuild', () => {
    test('should rebuild snap points from parts', () => {
      boat.parts = [100, 200]
      mockParts.getPart = jest.fn().mockReturnValue({
        getCoveredPoints: () => [],
        getNewPoints: () => [[1, [1], { x: 0, y: 0 }]],
        getRequiredPoints: () => []
      })

      boat.rebuild()

      // Parts should be re-added
      expect(boat.parts).toEqual([100, 200])
    })
  })

  describe('toList/fromList', () => {
    test('should serialize to list', () => {
      boat.parts = [1, 2, 3]
      boat.name = 'Test Boat'
      boat.medals = [5, 6]

      const list = boat.toList()

      expect(list).toEqual({
        parts: [1, 2, 3],
        name: 'Test Boat',
        medals: [5, 6]
      })
    })

    test('should deserialize from list', () => {
      mockParts.getPart = jest.fn().mockReturnValue({
        getCoveredPoints: () => [],
        getNewPoints: () => [],
        getRequiredPoints: () => []
      })

      boat.fromList({
        parts: [10, 20],
        name: 'Loaded Boat',
        medals: [1, 2]
      })

      expect(boat.parts).toEqual([10, 20])
      expect(boat.name).toBe('Loaded Boat')
      expect(boat.medals).toEqual([1, 2])
    })
  })
})
