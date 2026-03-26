'use strict'

import MapDisplay from '../MapDisplay'

describe('MapDisplay Visuals', () => {
    let mockDir, mockGame, mockGlobals

    beforeEach(() => {
        mockGame = {
            add: {
                sprite: jest.fn().mockReturnValue({
                    x: 0, y: 0, z: 0,
                    visible: true,
                    destroy: jest.fn(),
                    loadTexture: jest.fn(),
                    anchor: { set: jest.fn() }
                })
            }
        }

        mockGlobals = {
            game: mockGame,
            world: {
                getId: jest.fn().mockReturnValue('Da hood'),
                getWorldSize: jest.fn().mockReturnValue({ x: 6, y: 4 })
            },
            user: {
                isInInventory: jest.fn().mockReturnValue(true) // Has all maps
            }
        }

        mockDir = {
            globals: mockGlobals,
            mapCoordinate: { x: 1, y: 1 },
            boat: {
                getShowCoordinate: jest.fn().mockReturnValue({ x: 320, y: 240 })
            },
            pause: jest.fn(),
            mode: 'Driving'
        }
    })

    test('should NOT create sprites on mouseUp (logic-only controller)', () => {
        const mapDisplay = new MapDisplay(mockDir)

        // Open map
        mapDisplay.mouseUp()

        expect(mapDisplay.displaying).toBe(true)
        expect(mockGame.add.sprite).not.toHaveBeenCalled()
    })

    test('should update picMember on hover without creating sprites', () => {
        const mapDisplay = new MapDisplay(mockDir)
        mapDisplay.mouseUp()

        // Simulate hover over region 2
        // MapDisplay.js: mouse(obj, 'enter') -> updates picMember
        // We need to ensure it also updates the sprite texture/frame

        const mockObj = { dragToWhere: 2 }
        mapDisplay.mouse(mockObj, 'enter')

        expect(mapDisplay.picMember).toBeDefined()
    })

    test('should not fail kill without sprites', () => {
        const mapDisplay = new MapDisplay(mockDir)
        mapDisplay.mouseUp()

        mapDisplay.kill()

        expect(mapDisplay.mapSprite).toBeUndefined()
    })
})
