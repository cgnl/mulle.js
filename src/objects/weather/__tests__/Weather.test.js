/**
 * Weather.test.js - TDD tests based on original Lingo Weather.ls (ParentScript 142)
 * 
 * Original Lingo properties:
 * - weatherType: current weather type (1-4)
 * - windspeed: current wind speed
 * - windDirection: current wind direction (1-16)
 * - foreCastCounter, changeWaitCounter: timing
 * - nextWeather: upcoming weather settings
 * - reportObject, reportTime: for weather reports
 * - windInfo: wind settings per weather type
 * - possibleWeatherInLevel: allowed weather types per game level
 * - realChange: whether weather actually changed
 */
'use strict'

import Weather from '../Weather'

describe('Weather', () => {
  let weather
  let mockLevelHandler

  beforeEach(() => {
    mockLevelHandler = {
      getLevel: () => 3 // Level 3 allows weather types [1, 2]
    }
    weather = new Weather(mockLevelHandler)
  })

  describe('constructor (new me)', () => {
    test('should initialize weather type (may be random after setNextWeather)', () => {
      // Constructor calls setNextWeather which may change type
      // Just verify it's a valid type 1-4
      expect(weather.weatherType).toBeGreaterThanOrEqual(1)
      expect(weather.weatherType).toBeLessThanOrEqual(4)
    })

    test('should have possibleWeatherInLevel for 6 levels', () => {
      // Original: [[1], [1], [1, 2], [3, 4], [1, 2, 3, 4], [1, 2, 3, 4]]
      expect(weather.possibleWeatherInLevel.length).toBe(6)
      expect(weather.possibleWeatherInLevel[0]).toEqual([1]) // Level 1
      expect(weather.possibleWeatherInLevel[2]).toEqual([1, 2]) // Level 3
      expect(weather.possibleWeatherInLevel[4]).toEqual([1, 2, 3, 4]) // Level 5
    })

    test('should have windInfo for 4 weather types', () => {
      // Original: 4 weather types with Speeds and Directions
      expect(weather.windInfo.length).toBe(4)
      
      // Weather type 1: calm
      expect(weather.windInfo[0].Speeds).toBeDefined()
      expect(weather.windInfo[0].Directions).toBeDefined()
    })

    test('should have changeWaitCounter set after constructor', () => {
      // Constructor calls setNextWeather which sets a random wait time
      expect(weather.changeWaitCounter).toBeGreaterThanOrEqual(0)
    })

    test('should set initial nextWeather', () => {
      expect(weather.nextWeather).toBeDefined()
    })
  })

  describe('loop (on loop me)', () => {
    test('should apply nextWeather when changeWaitCounter reaches 0', () => {
      // Set explicit values
      weather.nextWeather = { type: 2, direction: 8, speed: 2 }
      weather.changeWaitCounter = 1
      weather.reportObject = null // Disable reporting

      weather.loop()

      // Type should be 2
      expect(weather.weatherType).toBe(2)
      // Direction and speed are applied, then setNextWeather is called with new random values
      // So we just check the type was applied before the next random generation
    })

    test('should decrement changeWaitCounter', () => {
      weather.changeWaitCounter = 100

      weather.loop()

      expect(weather.changeWaitCounter).toBe(99)
    })

    test('should call weatherReport at reportTime', () => {
      const mockReporter = {
        weatherReport: jest.fn()
      }
      weather.reportObject = mockReporter
      weather.reportTime = 50
      weather.changeWaitCounter = 50
      weather.realChange = 1
      weather.nextWeather = { type: 1, direction: 5, speed: 1 }

      weather.loop()

      expect(mockReporter.weatherReport).toHaveBeenCalled()
    })
  })

  describe('getComingWeather (on getComingWeather me)', () => {
    test('should return nextWeather when close to change', () => {
      weather.nextWeather = { type: 2, direction: 10, speed: 3 }
      weather.changeWaitCounter = 10
      weather.reportTime = 50

      const result = weather.getComingWeather()

      expect(result).toEqual(weather.nextWeather)
    })

    test('should return current weather when not close to change', () => {
      weather.weatherType = 1
      weather.windDirection = 5
      weather.windspeed = 2
      weather.changeWaitCounter = 100
      weather.reportTime = 50

      const result = weather.getComingWeather()

      expect(result.type).toBe(1)
      expect(result.direction).toBe(5)
      expect(result.speed).toBe(2)
    })
  })

  describe('getType (on getType me)', () => {
    test('should return current weather type', () => {
      weather.weatherType = 3
      expect(weather.getType()).toBe(3)
    })
  })

  describe('getWindspeed (on getWindspeed me)', () => {
    test('should return current wind speed', () => {
      weather.windspeed = 2
      expect(weather.getWindspeed()).toBe(2)
    })
  })

  describe('getWindDirection (on getWindDirection me)', () => {
    test('should return current wind direction', () => {
      weather.windDirection = 12
      expect(weather.getWindDirection()).toBe(12)
    })
  })

  describe('reportWeatherToMe (on reportWeatherToMe me, argObj)', () => {
    test('should set report object', () => {
      const mockObj = { weatherReport: jest.fn() }
      weather.reportWeatherToMe(mockObj)
      expect(weather.reportObject).toBe(mockObj)
    })
  })

  describe('setNextWeather (on setNextWeather me, argWeather, argRandomWait)', () => {
    test('should set changeWaitCounter from argRandomWait', () => {
      weather.setNextWeather(null, 1000)
      expect(weather.changeWaitCounter).toBe(1000)
    })

    test('should set reportTime to 1/4 to 1/2 of wait time', () => {
      weather.setNextWeather(null, 1000)
      expect(weather.reportTime).toBeGreaterThanOrEqual(250)
      expect(weather.reportTime).toBeLessThanOrEqual(500)
    })

    test('should apply weather immediately if no wait time', () => {
      weather.setNextWeather({ type: 2, speed: 1, direction: 5 }, 0)
      expect(weather.weatherType).toBe(2)
    })
  })

  describe('interpretList (on interpretList me, argWeather)', () => {
    test('should generate random type when #new', () => {
      // Level 3 allows types [1, 2]
      weather.weatherType = 1
      
      weather.interpretList({ type: 'new', speed: 1, direction: 5 })
      
      // New type should be different if possible (or same if only 1 option)
      expect(weather.nextWeather.type).toBeDefined()
      expect([1, 2]).toContain(weather.nextWeather.type)
    })

    test('should generate random speed when #new', () => {
      weather.weatherType = 1
      weather.windspeed = 1
      
      weather.interpretList({ type: 1, speed: 'new', direction: 5 })
      
      // Speed should be from windInfo for weather type 1
      expect(weather.nextWeather.speed).toBeDefined()
    })

    test('should generate random direction when #new', () => {
      weather.weatherType = 1
      weather.windDirection = 12
      
      weather.interpretList({ type: 1, speed: 1, direction: 'new' })
      
      expect(weather.nextWeather.direction).toBeDefined()
    })

    test('should keep existing values when not specified', () => {
      weather.weatherType = 2
      weather.windspeed = 3
      weather.windDirection = 8
      
      weather.interpretList({})
      
      expect(weather.nextWeather.type).toBe(2)
    })

    test('should handle SomethingNew to randomly pick one aspect to change', () => {
      weather.weatherType = 1
      weather.windspeed = 1
      weather.windDirection = 5
      
      weather.interpretList('SomethingNew')
      
      // At least one should have been set to change
      expect(weather.nextWeather).toBeDefined()
    })
  })

  describe('windInfo structure', () => {
    test('weather type 1 should have specific speeds and directions', () => {
      // Original: [#Speeds: [1], #Directions: [12]]
      expect(weather.windInfo[0].Speeds).toEqual([1])
      expect(weather.windInfo[0].Directions).toEqual([12])
    })

    test('weather type 2 should have more variety', () => {
      // Original: [#Speeds: [0, 1, 2], #Directions: [16, 2, 6, 8, 10]]
      expect(weather.windInfo[1].Speeds).toEqual([0, 1, 2])
      expect(weather.windInfo[1].Directions).toEqual([16, 2, 6, 8, 10])
    })

    test('weather type 3 should have stronger winds', () => {
      // Original: [#Speeds: [0, 1, 2, 3], #Directions: [16, 2, 6, 8, 10]]
      expect(weather.windInfo[2].Speeds).toContain(3)
    })

    test('weather type 4 should be stormy', () => {
      // Original: [#Speeds: [0, 2, 3], #Directions: [2, 4, 4, 6, 8, 10, 12, 12, 14, 16]]
      expect(weather.windInfo[3].Speeds).toEqual([0, 2, 3])
    })
  })
})
