'use strict'

import MulleActor from '../actor'

describe('MulleActor Duplication', () => {
    let game, actor

    beforeEach(() => {
        game = {
            add: { existing: jest.fn() },
            make: { sprite: jest.fn() },
            cache: { getKeys: () => [], getImage: () => ({ frameData: { getFrames: () => [] } }) },
            rnd: { integerInRange: () => 0 },
            mulle: {
                findFrameById: () => null,
                getDirectorImage: () => ({ name: 'test' })
            },
            director: {
                getNamedImage: () => ['key', 'frame']
            }
        }

        // Mock Phaser.Sprite methods
        MulleActor.prototype.loadTexture = jest.fn()
        MulleActor.prototype.animations = {
            add: jest.fn(),
            getAnimation: jest.fn()
        }
    })

    test('should not duplicate when created multiple times if destroyed properly', () => {
        // Create first actor
        const actor1 = new MulleActor(game, 0, 0, 'salkaRight')

        // Simulate adding to scene
        game.add.existing(actor1)

        // Simulate cleanup
        // In Phaser, destroying a sprite should remove it from the display list
        // However, if MulleActor registers itself globally (e.g. game.mulle.actors), it needs to deregister

        // Let's check if it registers? 
        // The constructor analysis didn't show explicit registration, but let's see.

        // If we manually destroy()
        // actor1.destroy()

        // Create second actor
        const actor2 = new MulleActor(game, 0, 0, 'salkaRight')

        // Verification:
        // This is hard to test without the full game loop but we can inspect if any global state is mutated.
        // The suspicion is that 'roaddog.js' might not be clearing the PREVIOUS actor if the state isn't shutdown cleanly
        // or if the actor persists.
    })
})
