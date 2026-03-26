/**
 * Precipitation.test.js - Unit tests for procedural rain and snow
 */
'use strict'

import Precipitation from '../Precipitation'

// Mock global Phaser
global.Phaser = {
    Easing: {
        Linear: {
            None: jest.fn()
        }
    }
}

// Mock Phaser
const mockGame = {
    add: {
        group: () => ({
            fixedToCamera: true,
            destroy: jest.fn()
        }),
        tileSprite: jest.fn((x, y, w, h, key) => ({
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
            context: {
                fillStyle: '',
                fillRect: jest.fn()
            },
            canvas: {}
        })
    },
    cache: {
        checkImageKey: jest.fn(() => false),
        addSpriteSheet: jest.fn()
    },
    time: {
        now: 1000
    }
}

describe('Precipitation', () => {
    let precipitation

    beforeEach(() => {
        jest.clearAllMocks()
        precipitation = new Precipitation(mockGame)
    })

    test('constructor should initialize correctly', () => {
        expect(precipitation.game).toBe(mockGame)
        expect(precipitation.currentType).toBe(0)
        expect(precipitation.precipGroup).toBeDefined()
    })

    test('update with weatherType 1 (Clear) should have no precipitation', () => {
        precipitation.update(1)
        expect(precipitation.currentType).toBe(0)
        expect(mockGame.add.tileSprite).not.toHaveBeenCalled()
    })

    test('update with weatherType 2 (Cloudy) should trigger rain', () => {
        precipitation.update(2)
        expect(precipitation.currentType).toBe(2)
        expect(mockGame.add.tileSprite).toHaveBeenCalledWith(0, 0, 640, 480, 'precip_rain', null, expect.anything())
    })

    test('update with weatherType 4 (Storm) should trigger snow', () => {
        precipitation.update(4)
        expect(precipitation.currentType).toBe(4)
        expect(mockGame.add.tileSprite).toHaveBeenCalledWith(0, 0, 640, 480, 'precip_snow', null, expect.anything())
    })

    test('kill should destroy the group', () => {
        const spy = jest.spyOn(precipitation.precipGroup, 'destroy')
        precipitation.kill()
        expect(spy).toHaveBeenCalled()
        expect(precipitation.rainSprite).toBeNull()
    })
})
