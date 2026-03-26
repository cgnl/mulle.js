/**
 * MulleWeather.test.js - Unit tests for monolithic weather controller
 */
'use strict'

// Mock PIXI and Phaser
const PIXI = {
    Point: function (x, y) { this.x = x; this.y = y }
}
global.PIXI = PIXI

const Phaser = {
    Sprite: class {
        constructor(game) {
            this.game = game
            this.position = { set: jest.fn(), x: 0, y: 0, copyFrom: jest.fn() }
            this.pivot = { set: jest.fn() }
            this.scale = { setTo: jest.fn() }
            this.anchor = { setTo: jest.fn() }
            this.destroy = jest.fn()
        }
        loadTexture() { }
    },
    Point: function (x, y) { this.x = x; this.y = y },
    Circle: function (x, y, r) { this.x = x; this.y = y; this.r = r },
    Math: {
        distance: jest.fn(() => 0)
    },
    Cache: { IMAGE: 1 }
}
global.Phaser = Phaser

// Mock Precipitation
jest.mock('../weather/Precipitation', () => {
    return jest.fn().mockImplementation(() => ({
        update: jest.fn(),
        kill: jest.fn()
    }))
})

// Mock MulleSprite (imported as ./sprite)
jest.mock('../sprite', () => {
    return jest.fn().mockImplementation(function () {
        this.game = global.mockGame
        this.position = { set: jest.fn(), x: 0, y: 0, copyFrom: jest.fn() }
        this.scale = { setTo: jest.fn() }
        this.destroy = jest.fn()
        this.loadTexture = jest.fn()
        this.setDirectorMember = jest.fn(() => true)
        return this
    })
})

const MulleWeather = require('../weather').default

const mockGame = {
    mulle: {
        user: { getSeaLevel: () => 1 },
        playAudio: jest.fn(() => ({ onStop: { addOnce: jest.fn() }, stop: jest.fn() })),
        boatAssetsLoaded: true
    },
    add: {
        group: jest.fn(() => ({ add: jest.fn(), destroy: jest.fn() })),
        sprite: jest.fn(() => new Phaser.Sprite()),
        graphics: jest.fn(() => ({ beginFill: jest.fn(), drawRect: jest.fn(), endFill: jest.fn(), destroy: jest.fn() })),
        tween: jest.fn(() => ({ to: jest.fn(() => ({ start: jest.fn() })) })),
        existing: jest.fn()
    },
    cache: {
        getKeys: jest.fn(() => []),
        checkImageKey: jest.fn(() => false),
        getJSON: jest.fn(() => ({}))
    },
    time: { now: 1000 },
    world: {
        bringToTop: jest.fn(),
        sendToBack: jest.fn()
    }
}
global.mockGame = mockGame

const mockState = {
    getSprite: jest.fn(() => ({ setDirectorMember: jest.fn() }))
}

describe('MulleWeather (Monolithic)', () => {
    let weather

    beforeEach(() => {
        jest.clearAllMocks()
        weather = new MulleWeather(mockGame, mockState)
    })

    test('constructor should initialize sub-systems', () => {
        expect(weather.precipitation).toBeDefined()
        expect(weather.wind).toBeDefined()
        expect(weather.waves).toBeDefined()
    })

    test('destroy should clean up all systems', () => {
        // Mock components that have destroy methods
        const precipKillSpy = jest.spyOn(weather.precipitation, 'kill')

        // Wind and waves are internal instances
        const windDestroySpy = jest.fn()
        weather.wind.destroy = windDestroySpy

        const wavesDestroySpy = jest.fn()
        weather.waves.destroy = wavesDestroySpy

        weather.skySprite = { destroy: jest.fn() }

        weather.destroy()

        expect(precipKillSpy).toHaveBeenCalled()
        expect(windDestroySpy).toHaveBeenCalled()
        expect(wavesDestroySpy).toHaveBeenCalled()
        expect(weather.skySprite).toBeNull()
    })

    test('updatePrecipitation should delegate to precipitation object', () => {
        weather.weatherType = 2 // Rain
        weather.updatePrecipitation()
        expect(weather.precipitation.update).toHaveBeenCalledWith(2)
    })

    test('updateSkySprite should use correct boten_shared prefix', () => {
        weather.weatherType = 1
        weather.createSkySprite()

        const setDirectorSpy = jest.spyOn(weather.skySprite, 'setDirectorMember')

        weather.updateSkySprite()

        // Type 1 -> "00b011v0"
        expect(setDirectorSpy).toHaveBeenCalledWith('boten_00.CXT', '00b011v0')
    })
})
