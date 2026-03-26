'use strict'

import DisplayBoat from '../DisplayBoat'

describe('DisplayBoat Visuals', () => {
    let displayBoat
    let mockMaster, mockGame, mockViewHandler, mockBoat

    beforeEach(() => {
        // Mock Phaser Game
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

        // Mock BoatViewHandler (via deps)
        mockViewHandler = {
            getCurrentHull: jest.fn().mockReturnValue(719),
            getHullSpriteKey: jest.fn().mockReturnValue('Boat_Wood_Large')
        }

        mockBoat = {
            getParts: jest.fn().mockReturnValue([719])
        }

        // Mock Master (BoatBase)
        mockMaster = {
            // Direct refs
            game: mockGame,
            loc: { x: 32000, y: 24000 }, // 320, 240 * 100
            direction: 1,
            deps: {
                // Access to globals via master.deps? Or master.game?
                // DisplayBoat usually gets master. 
                // master.deps.boatViewHandler might be how we access it?
                // Or we pass it in. 
                // Let's assume master has access to globals/deps
                user: {
                    getBoat: jest.fn().mockReturnValue(mockBoat)
                }
            },
            // Helper to access ViewHandler
            // In BoatBase, viewHandler isn't explicitly stored as a prop, 
            // but it might be in `deps`.
        }
        // Inject viewhandler into deps for test
        mockMaster.deps.boatViewHandler = mockViewHandler

        displayBoat = new DisplayBoat(mockMaster)
    })

    test('should create hull sprite on instantiation if game exists', () => {
        // Verify sprite created
        expect(mockGame.add.sprite).toHaveBeenCalled()

        // Verify correct asset used
        expect(mockViewHandler.getHullSpriteKey).toHaveBeenCalledWith(719)
        expect(mockGame.add.sprite).toHaveBeenCalledWith(
            expect.any(Number),
            expect.any(Number),
            'Boat_Wood_Large',
            0
        )
    })

    test('should update sprite frame and position in display()', () => {
        // 1. Setup initial state
        const sprite = displayBoat.sprite
        sprite.frame = -1
        sprite.x = 0
        sprite.y = 0

        // 2. Call display()
        // inclination = [altitude, side, frontBack]
        displayBoat.display([0, 0, 0])

        // 3. Verify updates
        expect(sprite.frame).toBeGreaterThanOrEqual(0)
        expect(sprite.x).toBe(320) // 32000 / 100
        expect(sprite.y).toBe(240) // 24000 / 100
    })

    test('should destroy sprite on kill', () => {
        const sprite = displayBoat.sprite
        displayBoat.kill()
        expect(sprite.destroy).toHaveBeenCalled()
        expect(displayBoat.sprite).toBeNull()
    })
})
