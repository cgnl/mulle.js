'use strict'

const handlers = () => ({
  onInputOver: { add: jest.fn(function (fn) { this._fn = fn }) },
  onInputOut: { add: jest.fn(function (fn) { this._fn = fn }) },
  onInputDown: { add: jest.fn(function (fn) { this._fn = fn }) },
  onInputUp: { add: jest.fn(function (fn) { this._fn = fn }) }
})

jest.mock('objects/sprite', () => {
  return class MockMulleSprite {
    constructor (game, x = 0, y = 0) {
      this.game = game
      this.position = {
        x,
        y,
        set: (nx, ny) => { this.position.x = nx; this.position.y = ny }
      }
      this.events = handlers()
      this.inputEnabled = false
      this.memberName = 'Dummy'
    }
    setDirectorMember (_a, b) {
      this.memberName = typeof _a === 'string' && !b ? _a : (typeof b === 'string' ? b : 'Dummy')
      return true
    }
    getBounds () {
      return { left: this.position.x - 16, top: this.position.y - 16, right: this.position.x + 16, bottom: this.position.y + 16 }
    }
    destroy () {}
  }
})

const MulleToolbox = require('../toolbox').default

describe('MulleToolbox ZZToolBoxBH phase-2 behavior', () => {
  let game
  let scene

  beforeEach(() => {
    global.Phaser = {
      Timer: { SECOND: 1000 },
      Easing: { Linear: { None: null } }
    }

    scene = {
      pause: jest.fn(),
      returnToBoatyard: jest.fn()
    }

    game = {
      add: {
        tween: jest.fn(() => ({ to: jest.fn() })),
        group: jest.fn(() => ({
          visible: true,
          children: [],
          add (obj) { this.children.push(obj) }
        })),
        graphics: jest.fn(() => {
          const g = {
            events: handlers(),
            beginFill: jest.fn(),
            drawRect: jest.fn((l, t, w, h) => { g._rect = { left: l, top: t, right: l + w, bottom: t + h } }),
            endFill: jest.fn(),
            destroy: jest.fn()
          }
          return g
        })
      },
      state: {
        current: 'seaworld',
        states: { seaworld: scene },
        start: jest.fn()
      },
      mulle: {
        cursor: { current: null },
        playAudio: jest.fn(),
        saveData: jest.fn(),
        user: {
          isInInventory: jest.fn((id) => id === 'Fishingrod')
        }
      }
    }
  })

  test('showToolbox pauses scene and creates overlay slots', () => {
    const t = new MulleToolbox(game, 620, 250)

    const shown = t.showToolbox()

    expect(shown).toBe(true)
    expect(scene.pause).toHaveBeenCalledWith(true)
    expect(t.overlaySprites).toHaveLength(9)
    expect(t.currentPanelMember).toBe('09b002v0')
  })

  test('inventory hotspot opens inventory panel and places item overlay', () => {
    const t = new MulleToolbox(game, 620, 250)
    t.showToolbox()

    // Trigger inventory hotspot (rect 384,312,532,388)
    const invHotspot = t.toolboxGroup.children.find(c => c._rect && c._rect.left === 384 && c._rect.top === 312)
    expect(invHotspot).toBeTruthy()
    invHotspot.events.onInputUp._fn()

    expect(t.currentPanelMember).toBe('09b007v0')
    const hasFishingrodOverlay = t.overlaySprites.some(s => s.memberName === '09b008v0')
    expect(hasFishingrodOverlay).toBe(true)
  })

  test('hovering ReturnHome hotspot sets and clears dialog overlay member', () => {
    const t = new MulleToolbox(game, 620, 250)
    t.showToolbox()

    const homeHotspot = t.toolboxGroup.children.find(c => c._rect && c._rect.left === 196 && c._rect.top === 136)
    expect(homeHotspot).toBeTruthy()

    homeHotspot.events.onInputOver._fn()
    expect(t.dialogOverlaySprite.memberName).toBe('09b018v0')

    homeHotspot.events.onInputOut._fn()
    expect(t.dialogOverlaySprite.memberName).toBe('Dummy')
  })

  test('return-home hotspot closes toolbox and delegates to scene', () => {
    const t = new MulleToolbox(game, 620, 250)
    t.showToolbox()

    const homeHotspot = t.toolboxGroup.children.find(c => c._rect && c._rect.left === 196 && c._rect.top === 136)
    expect(homeHotspot).toBeTruthy()
    homeHotspot.events.onInputUp._fn()

    expect(scene.returnToBoatyard).toHaveBeenCalled()
    expect(t.toolboxGroup.visible).toBe(false)
    expect(scene.pause).toHaveBeenCalledWith(false)
  })
})
