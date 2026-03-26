'use strict'

import ToolBoxBH from '../ToolBoxBH'

describe('ToolBoxBH Visuals', () => {
    let mockGame, mockDir, mockGlobals, mockSound, mockSprite

    beforeEach(() => {
        mockSprite = {
            spriteNum: 106,
            locH: 640,
            visible: true
        }

        mockGame = {
            add: {
                graphics: jest.fn().mockImplementation(() => ({
                    beginFill: jest.fn(),
                    drawRect: jest.fn(),
                    endFill: jest.fn(),
                    destroy: jest.fn(),
                    events: {
                        onInputOver: { add: jest.fn() },
                        onInputOut: { add: jest.fn() },
                        onInputUp: { add: jest.fn() }
                    }
                }))
            }
        }

        mockDir = {
            spriteList: { DialogOverlay: 92 },
            pause: jest.fn(),
            mulleTalkObject: { stop: jest.fn() }
        }

        mockGlobals = {
            mouseMaster: { setActivePauseAll: jest.fn() },
            game: mockGame
        }

        mockSound = { stopAllEffects: jest.fn() }
    })

    test('should create menu buttons on mouseUp (opening)', () => {
        const toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound, '05_sea')
        toolbox.activateClick(true)

        // Trigger open
        toolbox.mouseUp()

        expect(toolbox.displaying).toBe(true)
        // 5 background hotspots + 4 menu hotspots
        expect(mockGame.add.graphics.mock.calls.length).toBeGreaterThanOrEqual(9)
    })

    test('should destroy buttons on kill', () => {
        const toolbox = new ToolBoxBH(mockSprite, mockDir, mockGlobals, mockSound)
        toolbox.activateClick(true)
        toolbox.mouseUp()

        const createdHotspots = mockGame.add.graphics.mock.results.map(r => r.value)
        const destroySpies = createdHotspots.map(hs => hs.destroy)

        toolbox.kill()

        expect(toolbox.displaying).toBe(false)
        destroySpies.forEach(spy => expect(spy).toHaveBeenCalled())
    })
})
