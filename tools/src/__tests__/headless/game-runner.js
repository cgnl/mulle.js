/**
 * Headless Phaser game runner for scene smoke testing.
 *
 * Creates a minimal Phaser-like game environment (no browser, no canvas)
 * that can boot any scene class and run its lifecycle methods.
 *
 * Usage:
 *   const { createHeadlessGame } = require('./game-runner')
 *   const { game, errors, warnings, calls } = createHeadlessGame()
 *   const Scene = require('../../scenes/menu').default
 *   const instance = new Scene(game)  // or: new Scene()
 *   instance.game = game
 *   instance.preload && instance.preload()
 *   instance.create && instance.create()
 *   expect(errors).toEqual([])
 */
'use strict'

const { PhaserMock, createMockGame, noop } = require('./mocks')

/**
 * Creates a fully mocked headless game environment.
 *
 * @returns {{ game: object, errors: string[], warnings: string[], calls: Map }}
 */
function createHeadlessGame (options = {}) {
  // ── Error / warning capture ──
  const errors = []
  const warnings = []
  const calls = new Map()  // function-name → call-count

  // Install Phaser global (required by base.js / sprite.js / button.js)
  global.Phaser = PhaserMock

  // Provide PIXI global (referenced by sprite.js)
  global.PIXI = {
    Point: PhaserMock.Point,
    DisplayObject: class {},
    DisplayObjectContainer: class { addChild () {} removeChild () {} },
    Sprite: class {},
    blendModes: { NORMAL: 0 },
    scaleModes: { DEFAULT: 0, LINEAR: 0, NEAREST: 1 }
  }

  // Provide minimal window/document globals for scenes that touch DOM
  if (typeof window === 'undefined') {
    global.window = {
      location: { hash: '', href: '', origin: '' },
      addEventListener: noop,
      removeEventListener: noop,
      innerWidth: 640,
      innerHeight: 480,
      devicePixelRatio: 1,
      localStorage: { getItem: () => null, setItem: noop, removeItem: noop },
      setTimeout: global.setTimeout,
      clearTimeout: global.clearTimeout,
      requestAnimationFrame: (cb) => setTimeout(cb, 16)
    }
  } else {
    // Ensure hash is safe
    if (!window.location) window.location = { hash: '', href: '', origin: '' }
  }
  if (typeof document === 'undefined') {
    global.document = {
      createElement: (tag) => ({
        tagName: tag,
        style: {},
        getContext: () => ({
          fillRect: noop, clearRect: noop, drawImage: noop,
          fillStyle: '', strokeStyle: '', fillText: noop,
          canvas: { width: 640, height: 480 }
        }),
        addEventListener: noop,
        removeEventListener: noop,
        appendChild: noop,
        removeChild: noop,
        setAttribute: noop,
        getAttribute: () => null,
        width: 640, height: 480
      }),
      getElementById: () => ({
        appendChild: noop,
        removeChild: noop,
        addEventListener: noop,
        removeEventListener: noop,
        style: {},
        setAttribute: noop,
        getAttribute: () => null,
        innerHTML: '',
        children: []
      }),
      body: { appendChild: noop, removeChild: noop },
      addEventListener: noop,
      removeEventListener: noop
    }
  }

  // Global `game` reference (some scenes use bare `game` instead of `this.game`)
  const game = createMockGame()
  global.game = game

  // ── Spy on console.error / console.warn ──
  const origError = console.error
  const origWarn = console.warn
  console.error = (...args) => {
    errors.push(args.map(String).join(' '))
  }
  console.warn = (...args) => {
    warnings.push(args.map(String).join(' '))
  }

  // Track calls on key game.mulle methods
  const trackedMethods = ['addAudio', 'playAudio', 'stopAudio', 'getDirectorImage']
  trackedMethods.forEach(method => {
    const orig = game.mulle[method]
    calls.set(method, 0)
    game.mulle[method] = function (...args) {
      calls.set(method, (calls.get(method) || 0) + 1)
      return typeof orig === 'function' ? orig.apply(this, args) : undefined
    }
  })

  /**
   * Restore console after tests.
   */
  function cleanup () {
    console.error = origError
    console.warn = origWarn
  }

  return { game, errors, warnings, calls, cleanup }
}

/**
 * Boot a scene class in the headless environment.
 * Runs init → preload → create lifecycle.
 *
 * @param {Function} SceneClass  The scene class (default export)
 * @param {object}   [options]
 * @returns {{ instance, game, errors, warnings, calls, cleanup }}
 */
function bootScene (SceneClass, options = {}) {
  const env = createHeadlessGame(options)

  const instance = new SceneClass()
  instance.game = env.game
  instance.key = options.sceneName || 'test'

  // Run lifecycle (guard against missing methods)
  try {
    if (typeof instance.init === 'function') instance.init()
  } catch (e) {
    env.errors.push(`init() threw: ${e.message}`)
  }

  try {
    if (typeof instance.preload === 'function') instance.preload()
  } catch (e) {
    env.errors.push(`preload() threw: ${e.message}`)
  }

  try {
    if (typeof instance.create === 'function') instance.create()
  } catch (e) {
    env.errors.push(`create() threw: ${e.message}`)
  }

  return { instance, ...env }
}

module.exports = { createHeadlessGame, bootScene }
