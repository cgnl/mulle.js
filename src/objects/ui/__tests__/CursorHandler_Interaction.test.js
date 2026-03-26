'use strict'

import CursorHandler from '../CursorHandler'

describe('CursorHandler Interaction', () => {
    let cursor, mockGame

    beforeEach(() => {
        mockGame = {
            input: {
                activePointer: { x: 50, y: 60 }
            }
        }
        cursor = new CursorHandler()
        cursor.setGame(mockGame)
        cursor.init(115, 'Standard')
    })

    test('should use game input pointer if no args provided to loop', () => {
        // Initial loc is 0,0
        expect(cursor.loc).toEqual({ x: 0, y: 0 })

        // Call loop without args
        cursor.loop()

        // Should use mockGame activePointer (50, 60)
        expect(cursor.loc).toEqual({ x: 50, y: 60 })
    })

    test('should prefer explicit args over game input', () => {
        cursor.loop({ x: 100, y: 200 })
        expect(cursor.loc).toEqual({ x: 100, y: 200 })
    })

    test('should default to 0,0 if no game and no args', () => {
        cursor.setGame(null)
        cursor.loop()
        expect(cursor.loc).toEqual({ x: 0, y: 0 })
    })
})
