'use strict'

import SailBoatAncestor from '../SailBoatAncestor'
import Sail from '../../weather/Sail'

jest.mock('../../weather/Sail')

describe('SailBoatAncestor Visuals', () => {
    let boat, mockChild

    beforeEach(() => {
        mockChild = {
            quickProps: { SailSize: 100 },
            displayObject: {
                sprite: { x: 100, y: 200, visible: true }
            },
            deps: {
                drivingHandlers: {},
                weatherRenderer: {}
            }
        }

        Sail.mockClear()
        boat = new SailBoatAncestor(mockChild)

        // Mock the Sail instance created by constructor
        boat.Sail = {
            sprite: { x: 0, y: 0, visible: false },
            kill: jest.fn()
        }
    })

    test('should update Sail sprite position on display()', () => {
        boat.display()

        expect(boat.Sail.sprite.x).toBe(100)
        expect(boat.Sail.sprite.y).toBe(200)
        expect(boat.Sail.sprite.visible).toBe(true)
    })
})
