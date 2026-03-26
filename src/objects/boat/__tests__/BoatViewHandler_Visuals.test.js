'use strict'

import BoatViewHandler from '../BoatViewHandler'

describe('BoatViewHandler Visuals', () => {
    let handler
    let mockGlobals

    beforeEach(() => {
        mockGlobals = {
            director: {
                getMemberText: jest.fn()
            }
        }
        handler = new BoatViewHandler(mockGlobals)
    })

    test('should return correct sprite key for wood hulls', () => {
        // 719 is in woodList and largeList (based on constructor defaults)
        const key = handler.getHullSpriteKey(719)
        expect(key).toBe('Boat_Wood_Large')
    })

    test('should return correct sprite key for metal hulls', () => {
        // 1 is in metalList and largeList
        const key = handler.getHullSpriteKey(1)
        expect(key).toBe('Boat_Metal_Large')
    })

    test('should return correct sprite key for medium hulls', () => {
        // 723 is in metalList and mediumList (check constructor)
        const key = handler.getHullSpriteKey(723)
        expect(key).toBe('Boat_Metal_Medium')
    })

    test('should return partial key if material unknown', () => {
        // Mock lists to exclude ID
        handler.woodList = []
        handler.metalList = []
        handler.largeList = [999]

        const key = handler.getHullSpriteKey(999)
        // Should fallback or return something reasonable
        expect(key).toContain('Large')
    })
})
