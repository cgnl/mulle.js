/**
 * MulleMapObject.test.js - Unit tests for generic map objects
 */
'use strict'

// Mock Phaser
global.Phaser = {
    Sprite: class {
        constructor(game) {
            this.game = game
            this.position = { set: jest.fn(), x: 0, y: 0 }
            this.pivot = { set: jest.fn() }
            this.scale = { setTo: jest.fn() }
        }
        loadTexture() { }
        setFrame() { }
    },
    Point: function (x, y) { this.x = x; this.y = y },
    Circle: function (x, y, r) { this.x = x; this.y = y; this.r = r },
    Cache: { IMAGE: 1 }
}

const PIXI = {
    Point: function (x, y) { this.x = x; this.y = y }
}

global.PIXI = PIXI
global.Phaser = Phaser

const MulleMapObject = require('../mapobject').default

// Mock dependencies
const mockGame = {
    mulle: {
        ObjectsDB: {
            1: {
                OuterRadius: 100,
                InnerRadius: 50,
                FrameList: { normal: ['frame1'] }
            }
        }
    },
    cache: {
        getKeys: jest.fn(() => []),
        checkImageKey: jest.fn(() => false)
    }
}

const mockState = {
    getSprite: jest.fn(() => ({
        setDirectorMember: jest.fn(),
        x: 0,
        y: 0
    }))
}

describe('MulleMapObject', () => {
    let mapObject

    beforeEach(() => {
        jest.clearAllMocks()
        mapObject = new MulleMapObject(mockGame, 1, { x: 10, y: 20 }, {})
        mapObject.state = mockState
    })

    test('constructor should initialize properties from ObjectsDB', () => {
        expect(mapObject.id).toBe(1)
        expect(mapObject.OuterRadius).toBe(100)
        expect(mapObject.InnerRadius).toBe(50)
    })

    test('constructor should fall back to BoatObjectsDB if ObjectsDB lacks ID', () => {
        mockGame.mulle.BoatObjectsDB = {
            2: {
                OuterRadius: 200,
                InnerRadius: 80,
                FrameList: { normal: ['frame2'] }
            }
        }
        const boatObject = new MulleMapObject(mockGame, 2, { x: 30, y: 40 }, {})
        expect(boatObject.id).toBe(2)
        expect(boatObject.OuterRadius).toBe(200)
        expect(boatObject.InnerRadius).toBe(80)
    })

    test('constructor should support radius hysteresis properties', () => {
        const customObject = new MulleMapObject(mockGame, 1, { x: 0, y: 0 }, {
            EnterInnerRadius: 30,
            ExitOuterRadius: 150
        })
        expect(customObject.EnterInnerRadius).toBe(30)
        expect(customObject.ExitOuterRadius).toBe(150)
    })

    test('constructor should fall back to base radii if hysteresis properties missing', () => {
        expect(mapObject.EnterInnerRadius).toBe(50) // InnerRadius was 50
        expect(mapObject.ExitOuterRadius).toBe(100) // OuterRadius was 100
    })

    test('setSpriteMember should call state.getSprite and setDirectorMember', () => {
        mapObject.setSpriteMember(10, 'newMember')
        expect(mockState.getSprite).toHaveBeenCalledWith(10)
        const sprite = mockState.getSprite.mock.results[0].value
        expect(sprite.setDirectorMember).toHaveBeenCalledWith('newMember')
    })

    test('setSpriteLoc should call state.getSprite and update sprite position', () => {
        const newLoc = { x: 100, y: 200 }
        mapObject.setSpriteLoc(10, newLoc)
        expect(mockState.getSprite).toHaveBeenCalledWith(10)
        const sprite = mockState.getSprite.mock.results[0].value
        expect(sprite.x).toBe(100)
        expect(sprite.y).toBe(200)
    })

    test('destroy should call custom.onDestroy if it exists', () => {
        const onDestroySpy = jest.fn()
        mapObject.custom = { onDestroy: onDestroySpy }

        // We need to mock super.destroy which is Pharaoh.Sprite.destroy
        MulleMapObject.prototype.__proto__.destroy = jest.fn()

        mapObject.destroy()
        expect(onDestroySpy).toHaveBeenCalled()
    })

    test('doCheck should handle level-based hiding', () => {
        mockGame.mulle.levelHandler = { getLevel: () => 1 }
        mapObject.def.CheckFor = { Level: [2, 3] }

        mapObject.doCheck()
        expect(mapObject.enabled).toBe(false)
        expect(mapObject.visible).toBe(false)
    })

    test('doCheck should handle inventory-based hiding', () => {
        mockGame.mulle.seaInventory = { hasItem: jest.fn(() => true) }
        mapObject.def.CheckFor = { Inventory: ['Bible'] }
        mapObject.def.IfFound = '#NoDisplay'

        mapObject.doCheck()
        expect(mapObject.enabled).toBe(false)
        expect(mockGame.mulle.seaInventory.hasItem).toHaveBeenCalledWith('Bible')
    })

    test('doCheck should handle mission-based hiding', () => {
        mockGame.mulle.user = {
            isSeaMissionGiven: jest.fn(() => false)
        }
        mapObject.def.CheckFor = { NotGivenMissions: [10] }
        mapObject.def.IfFound = '#NoDisplay'

        mapObject.doCheck()
        expect(mapObject.enabled).toBe(false)
        expect(mockGame.mulle.user.isSeaMissionGiven).toHaveBeenCalledWith(10)
    })

    test('doCheck should handle cache-based hiding', () => {
        mockGame.mulle.user = {
            Car: { hasCache: jest.fn(() => true) }
        }
        mapObject.def.CheckFor = { Cache: ['#FirstSeaTrip'] }
        mapObject.def.IfFound = '#NoDisplay'

        mapObject.doCheck()
        expect(mapObject.enabled).toBe(false)
        expect(mockGame.mulle.user.Car.hasCache).toHaveBeenCalledWith('#FirstSeaTrip')
    })

    test('doCheck should handle UserStuff hiding (FerryTicket example)', () => {
        mockGame.mulle.user = {
            getUserProp: jest.fn((prop) => prop === '#FerryTicket' ? '#NoProp' : 'SomeValue')
        }
        mapObject.def.CheckFor = { UserStuff: ['#FerryTicket'] }
        mapObject.def.IfFound = 0 // Ferry in ObjectsDB has IfFound: 0

        mapObject.doCheck()
        expect(mapObject.enabled).toBe(false)
        expect(mapObject.visible).toBe(false)
    })

    test('doCheck should NOT hide if UserStuff property is present', () => {
        mockGame.mulle.user = {
            getUserProp: jest.fn(() => 'HasTicket')
        }
        mapObject.def.CheckFor = { UserStuff: ['#FerryTicket'] }
        mapObject.def.IfFound = 0

        mapObject.doCheck()
        expect(mapObject.enabled).toBe(true)
        expect(mapObject.visible).not.toBe(false)
    })
})
