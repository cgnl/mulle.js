'use strict'

import Sail from '../Sail'

describe('Sail Visuals', () => {
    let sail, mockReportObject, mockDrivingHandlers, mockWeatherRenderer, mockGame

    beforeEach(() => {
        mockGame = {
            add: {
                sprite: jest.fn().mockReturnValue({
                    x: 0, y: 0, z: 0,
                    visible: true,
                    frame: 0,
                    anchor: { set: jest.fn() },
                    destroy: jest.fn(),
                    loadTexture: jest.fn()
                })
            }
        }

        // Sail's report object is SailBoatAncestor
        // SailBoatAncestor has access to master object's game? 
        // Usually via deps. 
        // But Sail constructor signature is (reportObject, drivingHandlers, weatherRenderer).
        // It doesn't take 'game' directly.
        // However, SailBoatAncestor is a child of BoatBase.

        // We might need to inject game into Sail or access it via reportObject.child.game
        // Let's assume reportObject.child.game exists.

        mockReportObject = {
            child: {
                game: mockGame,
                deps: {
                    drivingHandlers: {},
                    weatherRenderer: {}
                }
            },
            scooting: 0
        }

        mockDrivingHandlers = {
            correctDirection: jest.fn(d => d)
        }

        mockWeatherRenderer = {
            wind: {
                getDirection: jest.fn().mockReturnValue(1),
                getSpeed: jest.fn().mockReturnValue(10)
            }
        }

        sail = new Sail(mockReportObject, mockDrivingHandlers, mockWeatherRenderer)
    })

    test('should create sail sprite on instantiation if game exists', () => {
        expect(mockGame.add.sprite).toHaveBeenCalled()
        // Segel is german for Sail
        expect(mockGame.add.sprite).toHaveBeenCalledWith(0, 0, 'Segel', 0)
    })

    test('should update sail sprite frame in setPic', () => {
        // setPic is called by Ancestor to update visual
        const offset = 5
        sail.setPic(offset)

        expect(sail.sprite.frame).toBe(offset) // firstFram + offset
    })

    test('should destroy sail sprite on kill', () => {
        const sprite = sail.sprite
        sail.kill()
        expect(sprite.destroy).toHaveBeenCalled()
        expect(sail.sprite).toBeNull()
    })
})
