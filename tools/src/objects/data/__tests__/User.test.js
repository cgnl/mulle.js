/**
 * User.test.js - TDD tests based on original Lingo
 * ParentScript 10 - User.ls
 *
 * User/player state management including boat, inventory, missions, and junk.
 */
'use strict'

import User from '../User'

describe('User', () => {
  let user

  beforeEach(() => {
    user = new User()
  })

  describe('constructor (new me)', () => {
    test('should initialize empty userId', () => {
      expect(user.userId).toBe('')
    })

    test('should initialize empty userName', () => {
      expect(user.userName).toBe('')
    })

    test('should create boat object', () => {
      expect(user.boat).toBeDefined()
    })

    test('should initialize empty junk array', () => {
      expect(user.junk).toEqual([])
    })

    test('should initialize nrOfBuiltBoats to 0', () => {
      expect(user.nrOfBuiltBoats).toBe(0)
    })

    test('should initialize empty Saves array', () => {
      expect(user.Saves).toEqual([])
    })

    test('should initialize empty completedMissions', () => {
      expect(user.completedMissions).toEqual({})
    })

    test('should initialize empty Inventory', () => {
      expect(user.Inventory).toEqual({})
    })

    test('should initialize empty givenMissions', () => {
      expect(user.givenMissions).toEqual([])
    })

    test('should initialize deliveryMade to 0', () => {
      expect(user.deliveryMade).toBe(0)
    })

    test('should initialize empty gifts', () => {
      expect(user.gifts).toEqual([])
    })

    test('should initialize drivingInfo to 0', () => {
      expect(user.drivingInfo).toBe(0)
    })

    test('should initialize veryFirstTime to true', () => {
      expect(user.veryFirstTime).toBe(true)
    })
  })

  describe('kill', () => {
    test('should clear boat', () => {
      user.kill()
      expect(user.boat).toBe(0)
    })

    test('should clear junk', () => {
      user.junk = [{ part1: { x: 1 } }]
      user.kill()
      expect(user.junk).toBe(0)
    })

    test('should return 0', () => {
      expect(user.kill()).toBe(0)
    })
  })

  describe('getUserId/setUserId', () => {
    test('should get userId', () => {
      user.userId = 'player1'
      expect(user.getUserId()).toBe('player1')
    })

    test('should set userId', () => {
      user.setUserId('player2')
      expect(user.userId).toBe('player2')
    })
  })

  describe('getUserName/setUserName', () => {
    test('should get userName', () => {
      user.userName = 'Mulle'
      expect(user.getUserName()).toBe('Mulle')
    })

    test('should set userName', () => {
      user.setUserName('Buffa')
      expect(user.userName).toBe('Buffa')
    })
  })

  describe('isItTheVeryFirstTime', () => {
    test('should return true initially', () => {
      expect(user.isItTheVeryFirstTime()).toBe(true)
    })

    test('should return false after set', () => {
      user.veryFirstTime = false
      expect(user.isItTheVeryFirstTime()).toBe(false)
    })
  })

  describe('getBoat', () => {
    test('should return boat object', () => {
      expect(user.getBoat()).toBe(user.boat)
    })
  })

  describe('getNrOfBuiltBoats/addNrOfBuiltBoats', () => {
    test('should get number of built boats', () => {
      expect(user.getNrOfBuiltBoats()).toBe(0)
    })

    test('should increment built boats count', () => {
      user.addNrOfBuiltBoats()
      expect(user.nrOfBuiltBoats).toBe(1)

      user.addNrOfBuiltBoats()
      expect(user.nrOfBuiltBoats).toBe(2)
    })
  })

  describe('getDrivingInfo/setDrivingInfo', () => {
    test('should get driving info', () => {
      expect(user.getDrivingInfo()).toBe(0)
    })

    test('should set driving info', () => {
      const info = { map: { x: 1, y: 2 }, direction: 3 }
      user.setDrivingInfo(info)
      expect(user.drivingInfo).toBe(info)
    })
  })

  describe('junk management', () => {
    beforeEach(() => {
      user.junk = {
        Yard: { part1: { x: 10, y: 20 }, part2: { x: 30, y: 40 } },
        Shelf1: { part3: { x: 50, y: 60 } }
      }
    })

    describe('getJunk', () => {
      test('should return junk for place', () => {
        const result = user.getJunk('Yard')
        expect(result).toEqual({ part1: { x: 10, y: 20 }, part2: { x: 30, y: 40 } })
      })

      test('should return undefined for unknown place', () => {
        expect(user.getJunk('Unknown')).toBeUndefined()
      })
    })

    describe('isJunkPart', () => {
      test('should return true if part exists', () => {
        expect(user.isJunkPart('part1')).toBe(true)
      })

      test('should return false if part not found', () => {
        expect(user.isJunkPart('partX')).toBe(false)
      })

      test('should handle non-list junk', () => {
        user.junk = 0
        expect(user.isJunkPart('part1')).toBe(false)
      })
    })

    describe('removeJunkPart', () => {
      test('should remove part from specific place', () => {
        user.removeJunkPart('Yard', 'part1')
        expect(user.junk.Yard.part1).toBeUndefined()
      })

      test('should remove part from any place when no place specified', () => {
        user.removeJunkPart(null, 'part3')
        expect(user.junk.Shelf1.part3).toBeUndefined()
      })
    })

    describe('addJunkPart', () => {
      test('should add part to place', () => {
        user.addJunkPart('Yard', 'newPart', { x: 100, y: 200 })
        expect(user.junk.Yard.newPart).toEqual({ x: 100, y: 200 })
      })

      test('should not add duplicate part', () => {
        const result = user.addJunkPart('Yard', 'part1', { x: 0, y: 0 })
        expect(result).toBe(false)
      })
    })

    describe('getJunkPartProp/setJunkPartProp', () => {
      test('should get part property', () => {
        expect(user.getJunkPartProp('Yard', 'part1')).toEqual({ x: 10, y: 20 })
      })

      test('should set part property', () => {
        user.setJunkPartProp('Yard', 'part1', { x: 100, y: 200 })
        expect(user.junk.Yard.part1).toEqual({ x: 100, y: 200 })
      })
    })
  })

  describe('mission management', () => {
    describe('addCompletedMission', () => {
      test('should add new completed mission', () => {
        user.addCompletedMission(5)
        expect(user.completedMissions[5]).toEqual({ count: 1 })
      })

      test('should increment count for existing mission', () => {
        user.addCompletedMission(5)
        user.addCompletedMission(5)
        expect(user.completedMissions[5].count).toBe(2)
      })

      test('should remove from givenMissions', () => {
        user.givenMissions = [5, 6, 7]
        user.addCompletedMission(5)
        expect(user.givenMissions).not.toContain(5)
      })
    })

    describe('isMissionCompleted', () => {
      test('should return true for completed mission', () => {
        user.completedMissions[5] = { count: 1 }
        expect(user.isMissionCompleted(5)).toBe(true)
      })

      test('should return false for uncompleted mission', () => {
        expect(user.isMissionCompleted(99)).toBe(false)
      })
    })

    describe('getCompletedMissionInfo', () => {
      test('should return mission info', () => {
        user.completedMissions[5] = { count: 3, bonus: true }
        expect(user.getCompletedMissionInfo(5)).toEqual({ count: 3, bonus: true })
      })

      test('should return specific info type', () => {
        user.completedMissions[5] = { count: 3, bonus: true }
        expect(user.getCompletedMissionInfo(5, 'count')).toBe(3)
      })
    })

    describe('setCompletedMissionInfo', () => {
      test('should update mission info', () => {
        user.completedMissions[5] = { count: 1 }
        user.setCompletedMissionInfo(5, { bonus: true })
        expect(user.completedMissions[5]).toEqual({ count: 1, bonus: true })
      })
    })

    describe('addGivenMission', () => {
      test('should add mission to givenMissions', () => {
        user.addGivenMission(10)
        expect(user.givenMissions).toContain(10)
      })

      test('should not add duplicate', () => {
        user.addGivenMission(10)
        user.addGivenMission(10)
        expect(user.givenMissions.filter(m => m === 10)).toHaveLength(1)
      })
    })

    describe('isMissionGiven', () => {
      test('should return true for given mission', () => {
        user.givenMissions = [10, 11]
        expect(user.isMissionGiven(10)).toBe(true)
      })

      test('should return false for not given mission', () => {
        expect(user.isMissionGiven(99)).toBe(false)
      })
    })
  })

  describe('inventory management', () => {
    beforeEach(() => {
      user.Inventory = { key1: 'value1', key2: { nested: true } }
    })

    describe('isInInventory', () => {
      test('should return true if item exists', () => {
        expect(user.isInInventory('key1')).toBe(true)
      })

      test('should return false if item not exists', () => {
        expect(user.isInInventory('keyX')).toBe(false)
      })
    })

    describe('lookUpInventory', () => {
      test('should return item value', () => {
        expect(user.lookUpInventory('key1')).toBe('value1')
      })
    })

    describe('deleteFromInventory', () => {
      test('should remove item', () => {
        user.deleteFromInventory('key1')
        expect(user.Inventory.key1).toBeUndefined()
      })
    })

    describe('setInInventory', () => {
      test('should set item value', () => {
        user.setInInventory('key3', 'value3')
        expect(user.Inventory.key3).toBe('value3')
      })
    })

    describe('clearInventory', () => {
      test('should clear items matching criteria', () => {
        user.Inventory = {
          item1: { temporary: true },
          item2: { permanent: true },
          item3: { temporary: true }
        }

        user.clearInventory('temporary')

        expect(user.Inventory.item1).toBeUndefined()
        expect(user.Inventory.item2).toBeDefined()
        expect(user.Inventory.item3).toBeUndefined()
      })
    })
  })

  describe('boat saves', () => {
    beforeEach(() => {
      user.boat = {
        toList: () => ({ name: 'TestBoat', parts: [1, 2, 3] }),
        fromList: jest.fn()
      }
    })

    describe('saveBoat', () => {
      test('should save boat to slot', () => {
        user.Saves = [null, null, null]

        user.saveBoat(1)

        expect(user.Saves[0]).toEqual({ name: 'TestBoat', parts: [1, 2, 3] })
      })

      test('should not save to slot 0', () => {
        user.Saves = [null]

        user.saveBoat(0)

        expect(user.Saves[0]).toBeNull()
      })
    })

    describe('loadBoat', () => {
      test('should load boat from slot', () => {
        user.Saves = [{ name: 'Saved1' }, { name: 'Saved2' }]

        user.loadBoat(1)

        expect(user.boat.fromList).toHaveBeenCalledWith({ name: 'Saved1' })
      })

      test('should not load from invalid slot', () => {
        user.Saves = []

        user.loadBoat(1)

        expect(user.boat.fromList).not.toHaveBeenCalled()
      })
    })

    describe('getSavedBoats', () => {
      test('should return all saves', () => {
        user.Saves = [{ name: 'A' }, { name: 'B' }]

        expect(user.getSavedBoats('All')).toEqual([{ name: 'A' }, { name: 'B' }])
      })

      test('should return specific save', () => {
        user.Saves = [{ name: 'A' }, { name: 'B' }]

        expect(user.getSavedBoats(2)).toEqual({ name: 'B' })
      })

      test('should return 0 for invalid slot', () => {
        user.Saves = []

        expect(user.getSavedBoats(5)).toBe(0)
      })
    })
  })

  describe('gotPart', () => {
    test('should return true if part in junk', () => {
      user.junk = { Yard: { part1: {} } }
      expect(user.gotPart('part1')).toBe(true)
    })

    test('should return true if part in gifts', () => {
      user.gifts = ['part2']
      expect(user.gotPart('part2')).toBe(true)
    })

    test('should return false if part not found', () => {
      user.junk = {}
      user.gifts = []
      user.boat = { isBoatPart: () => false }
      expect(user.gotPart('partX')).toBe(false)
    })
  })

  describe('toList/fromList', () => {
    test('should serialize to list', () => {
      user.userId = 'id1'
      user.userName = 'name1'
      user.nrOfBuiltBoats = 5
      user.boat = { toList: () => ({ boatData: true }) }

      const list = user.toList()

      expect(list.userId).toBe('id1')
      expect(list.userName).toBe('name1')
      expect(list.nrOfBuiltBoats).toBe(5)
      expect(list.boat).toEqual({ boatData: true })
    })

    test('should deserialize from list', () => {
      user.boat = { fromList: jest.fn() }

      user.fromList({
        userId: 'loaded1',
        userName: 'LoadedName',
        boat: { boatData: true },
        junk: { Yard: {} },
        nrOfBuiltBoats: 10,
        Saves: [],
        completedMissions: { 1: { count: 1 } },
        Inventory: {},
        givenMissions: [5],
        deliveryMade: 1,
        gifts: ['gift1'],
        veryFirstTime: false
      })

      expect(user.userId).toBe('loaded1')
      expect(user.userName).toBe('LoadedName')
      expect(user.nrOfBuiltBoats).toBe(10)
      expect(user.veryFirstTime).toBe(false)
      expect(user.boat.fromList).toHaveBeenCalledWith({ boatData: true })
    })
  })
})
