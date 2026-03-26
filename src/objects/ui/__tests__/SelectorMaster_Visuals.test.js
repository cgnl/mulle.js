'use strict'

import SelectorMaster from '../SelectorMaster'
import TypeSelectButton from '../TypeSelectButton'

describe('SelectorMaster & TypeSelectButton Visuals', () => {
    let mockGame, mockButton

    beforeEach(() => {
        mockButton = {
            z: 0,
            visible: true,
            inputEnabled: true,
            setFrames: jest.fn(),
            destroy: jest.fn(),
            onInputOver: { add: jest.fn() }
        }

        mockGame = {
            add: {
                button: jest.fn().mockReturnValue(mockButton)
            }
        }
    })

    describe('SelectorMaster Integration', () => {
        test('should pass game instance to buttons', () => {
            const selector = new SelectorMaster(['Motor'], 0, mockGame)

            expect(selector.buttons[0].game).toBe(mockGame)
            expect(mockGame.add.button).toHaveBeenCalled()
        })

        test('should handle legacy (baseSP) argument correctly', () => {
            // constructor(okTypes, baseSP, game) vs (okTypes, game) inferred?
            // My implementation checks if baseSP has .add
            const selector = new SelectorMaster(['Motor'], mockGame)

            expect(selector.buttons[0].game).toBe(mockGame)
            expect(mockGame.add.button).toHaveBeenCalled()
        })
    })

    describe('TypeSelectButton Visuals', () => {
        let button

        beforeEach(() => {
            button = new TypeSelectButton(null, 65, 'Motor', 'snd', mockGame)
        })

        test('should create Phaser button with correct key', () => {
            expect(mockGame.add.button).toHaveBeenCalledWith(
                0, 0, 'TypePicMotor', expect.any(Function), button, 2, 1, 0, 1
            )
        })

        test('should set Z-index from SP', () => {
            expect(mockButton.z).toBe(65)
        })

        test('should force frame 0 on select()', () => {
            button.select()
            expect(mockButton.setFrames).toHaveBeenCalledWith(0, 0, 0, 0)
        })

        test('should restore frames on deselect()', () => {
            button.select()
            mockButton.setFrames.mockClear()

            button.deselect()
            expect(mockButton.setFrames).toHaveBeenCalledWith(2, 1, 0, 1)
        })

        test('should set inputEnabled on activate(bool)', () => {
            button.activate(false)
            expect(mockButton.inputEnabled).toBe(false)

            button.activate(true)
            expect(mockButton.inputEnabled).toBe(true)
        })

        test('should destroy Phaser button on kill()', () => {
            button.kill()
            expect(mockButton.destroy).toHaveBeenCalled()
            expect(button.button).toBeNull()
        })
    })
})
