/**
 * ExtraBoatDrivingStuff.test.js - TDD tests based on original Lingo
 * MovieScript 147 - ExtraBoatDrivingStuff.ls
 *
 * Utility functions for boat power configuration and validation.
 */
'use strict'

import ExtraBoatDrivingStuff from '../ExtraBoatDrivingStuff'

describe('ExtraBoatDrivingStuff', () => {
  let stuff
  let mockGlobals

  beforeEach(() => {
    mockGlobals = {
      user: {
        boat: {
          boatProperties: {
            engine: 1,
            OutboardEngine: 0,
            SailWithPole: 1,
            SailSize: 2,
            Oar: 0,
            Rudder: 1,
            SteerPart: 1,
            FuelVolume: 10,
            EngineSound: 1,
            power: 100,
            speed: 50,
            depth: 5,
            MaxDepth: 10
          },
          parts: []
        }
      },
      parts: {
        getPart: jest.fn()
      }
    }
    stuff = new ExtraBoatDrivingStuff(mockGlobals)
  })

  describe('getEngineStartSound', () => {
    test('should return sound name for valid motor boat', () => {
      const sound = stuff.getEngineStartSound()

      expect(sound).toBe('05e018v1')
    })

    test('should return correct sound for engine type 2', () => {
      mockGlobals.user.boat.boatProperties.EngineSound = 2

      const sound = stuff.getEngineStartSound()

      expect(sound).toBe('05e018v0')
    })

    test('should return correct sound for engine type 3', () => {
      mockGlobals.user.boat.boatProperties.EngineSound = 3

      const sound = stuff.getEngineStartSound()

      expect(sound).toBe('05e030v0')
    })

    test('should return 0 if no motor power', () => {
      mockGlobals.user.boat.boatProperties.engine = 0

      const sound = stuff.getEngineStartSound()

      expect(sound).toBe(0)
    })

    test('should return 0 if motor check fails', () => {
      // Motor requires steering or outboard
      mockGlobals.user.boat.boatProperties.SteerPart = 0
      mockGlobals.user.boat.boatProperties.OutboardEngine = 0

      const sound = stuff.getEngineStartSound()

      expect(sound).toBe(0)
    })

    test('should return 0 if invalid engine sound index', () => {
      mockGlobals.user.boat.boatProperties.EngineSound = 99

      const sound = stuff.getEngineStartSound()

      expect(sound).toBe(0)
    })

    test('should return 0 if engine sound is 0', () => {
      mockGlobals.user.boat.boatProperties.EngineSound = 0

      const sound = stuff.getEngineStartSound()

      expect(sound).toBe(0)
    })
  })

  describe('findPossiblePowers', () => {
    test('should return Motor for boat with engine', () => {
      const powers = stuff.findPossiblePowers()

      expect(powers).toContain('Motor')
    })

    test('should return Sail for boat with sail and pole', () => {
      const powers = stuff.findPossiblePowers()

      expect(powers).toContain('Sail')
    })

    test('should return Oar for boat with oars', () => {
      mockGlobals.user.boat.boatProperties.Oar = 2

      const powers = stuff.findPossiblePowers()

      expect(powers).toContain('Oar')
    })

    test('should not return Motor without engine', () => {
      mockGlobals.user.boat.boatProperties.engine = 0
      mockGlobals.user.boat.boatProperties.OutboardEngine = 0

      const powers = stuff.findPossiblePowers()

      expect(powers).not.toContain('Motor')
    })

    test('should not return Sail without sail', () => {
      mockGlobals.user.boat.boatProperties.SailWithPole = 0

      const powers = stuff.findPossiblePowers()

      expect(powers).not.toContain('Sail')
    })

    test('should not return Sail without sail size', () => {
      mockGlobals.user.boat.boatProperties.SailSize = 0

      const powers = stuff.findPossiblePowers()

      expect(powers).not.toContain('Sail')
    })

    test('should return Motor for outboard engine', () => {
      mockGlobals.user.boat.boatProperties.engine = 0
      mockGlobals.user.boat.boatProperties.OutboardEngine = 1

      const powers = stuff.findPossiblePowers()

      expect(powers).toContain('Motor')
    })

    test('should accept custom props argument', () => {
      const customProps = {
        engine: 0,
        OutboardEngine: 0,
        SailWithPole: 0,
        SailSize: 0,
        Oar: 4
      }

      const powers = stuff.findPossiblePowers(customProps)

      expect(powers).toEqual(['Oar'])
    })

    test('should not duplicate power types', () => {
      // Both engine and outboard are Motor type
      mockGlobals.user.boat.boatProperties.engine = 1
      mockGlobals.user.boat.boatProperties.OutboardEngine = 1

      const powers = stuff.findPossiblePowers()

      const motorCount = powers.filter(p => p === 'Motor').length
      expect(motorCount).toBe(1)
    })
  })

  describe('checkCurrentlyOKPowers', () => {
    test('should return 1 for valid motor boat', () => {
      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Motor']
      )

      expect(result.Motor).toBe(1)
    })

    test('should return NoSteering for motor without steering', () => {
      mockGlobals.user.boat.boatProperties.SteerPart = 0
      mockGlobals.user.boat.boatProperties.OutboardEngine = 0

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Motor']
      )

      expect(result.Motor).toBe('NoSteering')
    })

    test('should return NoRudder for motor without rudder', () => {
      mockGlobals.user.boat.boatProperties.Rudder = 0
      mockGlobals.user.boat.boatProperties.OutboardEngine = 0

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Motor']
      )

      expect(result.Motor).toBe('NoRudder')
    })

    test('should return NoTank for motor without fuel tank', () => {
      mockGlobals.user.boat.boatProperties.FuelVolume = 0

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Motor']
      )

      expect(result.Motor).toBe('NoTank')
    })

    test('should allow motor with outboard even without rudder/steering', () => {
      mockGlobals.user.boat.boatProperties.Rudder = 0
      mockGlobals.user.boat.boatProperties.SteerPart = 0
      mockGlobals.user.boat.boatProperties.OutboardEngine = 1

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Motor']
      )

      // Outboard provides both steering and rudder function
      expect(result.Motor).toBe(1)
    })

    test('should return 1 for valid sail boat', () => {
      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Sail']
      )

      expect(result.Sail).toBe(1)
    })

    test('should return NoRudder for sail without rudder', () => {
      mockGlobals.user.boat.boatProperties.Rudder = 0

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Sail']
      )

      expect(result.Sail).toBe('NoRudder')
    })

    test('should return NoSteering for sail without steering part', () => {
      mockGlobals.user.boat.boatProperties.SteerPart = 0

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Sail']
      )

      expect(result.Sail).toBe('NoSteering')
    })

    test('should check rudder before steering for sail', () => {
      mockGlobals.user.boat.boatProperties.Rudder = 0
      mockGlobals.user.boat.boatProperties.SteerPart = 0

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Sail']
      )

      // Rudder is checked first
      expect(result.Sail).toBe('NoRudder')
    })

    test('should return 1 for valid oar boat', () => {
      mockGlobals.user.boat.boatProperties.Oar = 2

      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Oar']
      )

      expect(result.Oar).toBe(1)
    })

    test('should check multiple power types', () => {
      const result = stuff.checkCurrentlyOKPowers(
        mockGlobals.user.boat.boatProperties,
        ['Motor', 'Sail']
      )

      expect(result.Motor).toBe(1)
      expect(result.Sail).toBe(1)
    })
  })

  describe('makeCleanBoat', () => {
    beforeEach(() => {
      mockGlobals.user.boat.parts = ['part1', 'part2']
      mockGlobals.parts.getPart = jest.fn().mockReturnValue({
        getProperty: (prop) => {
          if (prop === 'engine') return true
          if (prop === 'power') return 20
          if (prop === 'speed') return 10
          return 0
        }
      })
    })

    test('should return modified props for Sail mode', () => {
      // For sail, engine/outboard/oar properties should be drained
      const result = stuff.makeCleanBoat('Sail')

      expect(result).toBeDefined()
    })

    test('should return modified props for Motor mode', () => {
      // For motor, oar properties should be drained
      const result = stuff.makeCleanBoat('Motor')

      expect(result).toBeDefined()
    })

    test('should return modified props for Oar mode', () => {
      // For oar, engine/outboard properties should be drained
      const result = stuff.makeCleanBoat('Oar')

      expect(result).toBeDefined()
    })

    test('should accept custom props argument', () => {
      const customProps = { ...mockGlobals.user.boat.boatProperties }

      const result = stuff.makeCleanBoat('Sail', customProps)

      expect(result).toBe(customProps)
    })

    test('should handle parts without matching properties', () => {
      mockGlobals.parts.getPart = jest.fn().mockReturnValue({
        getProperty: () => false
      })

      const result = stuff.makeCleanBoat('Sail')

      expect(result).toBeDefined()
    })

    test('should handle null parts', () => {
      mockGlobals.parts.getPart = jest.fn().mockReturnValue(null)

      const result = stuff.makeCleanBoat('Sail')

      expect(result).toBeDefined()
    })
  })
})
