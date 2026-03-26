/**
 * WeatherRenderer.test.js - TDD tests based on original Lingo WeatherRenderer.ls
 * 
 * Original Lingo properties:
 * - wind: Wind object
 * - waves: Waves object
 * - speedFactor: wind speed multiplier (100 = normal)
 * - allowingRadio: whether radio reports are allowed
 */
'use strict'

import WeatherRenderer from '../WeatherRenderer'

// Mock global Phaser
global.Phaser = {
  Easing: {
    Linear: {
      None: jest.fn()
    }
  }
}

// Mock dependencies
const mockDrivingHandlers = {
  nrOfDirections: 16,
  correctDirection: (dir) => {
    dir = dir % 16
    if (dir <= 0) return dir + 16
    return dir
  },
  getVelPoint: (dir) => ({ x: 0, y: 0 })
}

const mockWeather = {
  getWindspeed: () => 2,
  getWindDirection: () => 8,
  getComingWeather: () => ({ type: 2, speed: 2, direction: 8 })
}

const mockGame = {
  add: {
    group: () => ({
      fixedToCamera: true,
      destroy: jest.fn()
    }),
    tileSprite: jest.fn(() => ({
      visible: true,
      alpha: 1,
      tilePosition: { x: 0, y: 0 }
    })),
    tween: () => ({
      to: () => ({
        start: jest.fn()
      })
    })
  },
  make: {
    bitmapData: () => ({
      context: { fillStyle: '', fillRect: jest.fn() },
      canvas: {}
    })
  },
  cache: {
    checkImageKey: jest.fn(() => true),
    addSpriteSheet: jest.fn()
  },
  time: { now: 1000 }
}

describe('WeatherRenderer', () => {
  let renderer

  beforeEach(() => {
    renderer = new WeatherRenderer(mockDrivingHandlers, mockWeather, mockGame)
  })

  describe('constructor (new me)', () => {
    test('should create Wind object', () => {
      expect(renderer.wind).toBeDefined()
      expect(renderer.wind.getDirection).toBeDefined()
    })

    test('should create Waves object', () => {
      expect(renderer.waves).toBeDefined()
      expect(renderer.waves.setDirection).toBeDefined()
    })

    test('should initialize speedFactor to 100', () => {
      expect(renderer.speedFactor).toBe(100)
    })

    test('should allow radio by default', () => {
      expect(renderer.allowingRadio).toBe(true)
    })

    test('should create Precipitation object', () => {
      expect(renderer.precipitation).toBeDefined()
      expect(renderer.precipitation.update).toBeDefined()
    })
  })

  describe('init (on init me)', () => {
    test('should initialize wind with weather values', () => {
      renderer.init()

      // Wind should have been initialized
      expect(renderer.wind.getSpeed).toBeDefined()
    })

    test('should initialize waves', () => {
      renderer.init()

      expect(renderer.waves.speed).toBeDefined()
    })
  })

  describe('allowRadio (on allowRadio me, argYesNo)', () => {
    test('should set allowingRadio flag', () => {
      renderer.allowRadio(false)
      expect(renderer.allowingRadio).toBe(false)

      renderer.allowRadio(true)
      expect(renderer.allowingRadio).toBe(true)
    })
  })

  describe('weatherReport (on weatherReport me, argList)', () => {
    test('should update wind with slow change', () => {
      const argList = { TimeLeft: 100, direction: 5, speed: 3 }

      renderer.weatherReport(argList)

      // Wind should have changeTime set
      expect(renderer.wind.changeTime).toBeGreaterThan(0)
    })

    test('should not update if TimeLeft is 0', () => {
      const initialChangeTime = renderer.wind.changeTime
      const argList = { TimeLeft: 0, direction: 5, speed: 3 }

      renderer.weatherReport(argList)

      // Wind changeTime should not have been updated
      expect(renderer.wind.changeTime).toBe(initialChangeTime)
    })
  })

  describe('changeMap (on changeMap me, argHide, argWindSpeedFactor)', () => {
    test('should set speedFactor from argument', () => {
      renderer.changeMap(null, 150)
      expect(renderer.speedFactor).toBe(150)
    })

    test('should convert numeric speedFactor levels', () => {
      // Original: case speedFactor of 0: 0, 1: 100, 2: 125, 3: 150, 4: 175, 5: 200
      renderer.changeMap(null, 0)
      expect(renderer.speedFactor).toBe(0)

      renderer.changeMap(null, 1)
      expect(renderer.speedFactor).toBe(100)

      renderer.changeMap(null, 2)
      expect(renderer.speedFactor).toBe(125)

      renderer.changeMap(null, 3)
      expect(renderer.speedFactor).toBe(150)

      renderer.changeMap(null, 4)
      expect(renderer.speedFactor).toBe(175)

      renderer.changeMap(null, 5)
      expect(renderer.speedFactor).toBe(200)
    })

    test('should handle #Full speedFactor', () => {
      renderer.changeMap(null, 'Full')
      expect(renderer.speedFactor).toBe(200)
    })

    test('should default to 100 if undefined', () => {
      renderer.changeMap(null, undefined)
      expect(renderer.speedFactor).toBe(100)
    })

    test('should update waves direction', () => {
      const spy = jest.spyOn(renderer.waves, 'setDirection')

      renderer.changeMap(null, 100)

      expect(spy).toHaveBeenCalled()
    })

    test('should update wind', () => {
      const spy = jest.spyOn(renderer.wind, 'Change')

      renderer.changeMap(null, 100)

      expect(spy).toHaveBeenCalled()
    })
  })

  describe('updatePrecipitation (on updatePrecipitation me, argType)', () => {
    test('should delegate to precipitation object', () => {
      const spy = jest.spyOn(renderer.precipitation, 'update')
      renderer.updatePrecipitation(2)
      expect(spy).toHaveBeenCalledWith(2)
    })
  })

  describe('kill (on kill me)', () => {
    test('should kill wind, waves and precipitation', () => {
      const precipSpy = jest.spyOn(renderer.precipitation, 'kill')
      const result = renderer.kill()

      expect(precipSpy).toHaveBeenCalled()
      expect(renderer.precipitation).toBeNull()
      expect(result).toBeNull()
    })
  })

  describe('getters', () => {
    test('should expose wind object', () => {
      expect(renderer.getWind()).toBe(renderer.wind)
    })

    test('should expose waves object', () => {
      expect(renderer.getWaves()).toBe(renderer.waves)
    })
  })
})
