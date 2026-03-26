'use strict'

import Waves from '../Waves'
import SingleWave from '../SingleWave'

describe('Waves & SingleWave Visuals', () => {
    let mockGame, mockDrivingHandlers
    let waves

    beforeEach(() => {
        // Mock Phaser Game
        mockGame = {
            add: {
                sprite: jest.fn().mockReturnValue({
                    x: 0,
                    y: 0,
                    z: 0,
                    visible: true,
                    frame: 0,
                    destroy: jest.fn(),
                    anchor: { set: jest.fn() }
                })
            }
        }

        mockDrivingHandlers = {
            correctDirection: jest.fn(d => d)
        }

        waves = new Waves(mockDrivingHandlers, mockGame)
    })

    test('Waves constructor should store game instance', () => {
        expect(waves.game).toBe(mockGame)
    })

    test('setDirection should create SingleWave instances with game reference', () => {
        // Force speed > 0 to create waves
        waves.setDirection(1, 4)

        expect(waves.waveObjs.length).toBeGreaterThan(0)
        expect(waves.waveObjs[0].game).toBe(mockGame)
    })

    describe('SingleWave Sprite Integration', () => {
        let singleWave
        let mockSprite

        beforeEach(() => {
            mockSprite = mockGame.add.sprite()
            mockGame.add.sprite.mockClear() // Clear the call from setup

            // Manually create a SingleWave with game ref
            singleWave = new SingleWave(
                waves,
                1, // Channel
                { x: 100, y: 100 }, // Loc
                { x: 1, y: 1 }, // Vel
                1, // Dir
                50, // Amplitude
                mockGame
            )
        })

        test('should create a Phaser sprite on instantiation', () => {
            expect(mockGame.add.sprite).toHaveBeenCalledWith(0, 0, 'WavePic2', 0)
            // WavePic2 because amplitude 50 <= 60
        })

        test('should uses high amplitude sprite if amplitude > 60', () => {
            new SingleWave(waves, 2, { x: 0, y: 0 }, { x: 0, y: 0 }, 1, 70, mockGame)
            expect(mockGame.add.sprite).toHaveBeenCalledWith(0, 0, 'WavePic1', 0)
        })

        test('should set sprite Z-index based on channel', () => {
            // We assume sprite is created and attached to singleWave.sprite
            expect(singleWave.sprite.z).toBe(1) // Channel 1 passed in ctor
        })

        test('should update sprite position in loop', () => {
            singleWave.sprite.x = 0
            singleWave.sprite.y = 0

            // Run loop to move wave
            singleWave.loop()

            // Verify sprite updated (exact coord depends on vel logic, just check change)
            // Initial loc was {100, 100} -> *10 = 1000
            // loop updates internal loc, and should sync sprite
            // Unscaled loc is loc/10
            expect(singleWave.sprite.x).toBe(100)
            expect(singleWave.sprite.y).toBe(100)
        })

        test('should update sprite frame in loop', () => {
            const targetIndex = singleWave.frameList.findIndex(value => value >= 2)
            if (targetIndex >= 0) {
                // Ensure loop lands on a frame value that maps above 0 in sprite frames
                singleWave.counter = targetIndex
            }
            singleWave.loop()
            expect(singleWave.sprite.frame).toBeGreaterThan(0)
        })

        test('should destroy sprite on kill', () => {
            const sprite = singleWave.sprite
            singleWave.kill()
            expect(sprite.destroy).toHaveBeenCalled()
            expect(singleWave.sprite).toBeNull()
        })
    })
})
