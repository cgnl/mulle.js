/**
 * Comprehensive mocks for headless Phaser CE scene testing.
 *
 * Provides:
 *  - Full Phaser global (State, Sprite, Group, Signal, Button, etc.)
 *  - Mock game object factory with mulle subsystem
 *  - jest.mock() helpers for all scene dependency modules
 */
'use strict'

// ---------------------------------------------------------------------------
// 1. Phaser global mock
// ---------------------------------------------------------------------------

function noop () {}
function returnThis () { return this }
function returnEmpty () { return {} }

class MockSignal {
  constructor () { this._bindings = [] }
  add (fn) { this._bindings.push(fn); return this }
  addOnce (fn) { this._bindings.push(fn); return this }
  remove () {}
  removeAll () {}
  dispatch () {}
}

class MockPoint {
  constructor (x = 0, y = 0) { this.x = x; this.y = y }
  clone () { return new MockPoint(this.x, this.y) }
  set (x, y) { this.x = x; this.y = y }
  setTo (x, y) { this.x = x; this.y = y }
  copyFrom (p) { if (p) { this.x = p.x || 0; this.y = p.y || 0 } }
  equals (p) { return p && this.x === p.x && this.y === p.y }
  add (x, y) { return new MockPoint(this.x + (x || 0), this.y + (y || 0)) }
  subtract (x, y) { return new MockPoint(this.x - (x || 0), this.y - (y || 0)) }
  multiply (x, y) { return new MockPoint(this.x * (x || 1), this.y * (y || 1)) }
  distance (p) { return Math.sqrt(Math.pow(this.x - (p?.x || 0), 2) + Math.pow(this.y - (p?.y || 0), 2)) }
}

class MockRectangle {
  constructor (x = 0, y = 0, w = 0, h = 0) {
    this.x = x; this.y = y; this.width = w; this.height = h
  }
  contains () { return false }
}

class MockGraphics {
  constructor () {
    this.x = 0; this.y = 0
    this.events = new MockEvents()
    this.input = { useHandCursor: false, enabled: false, priorityID: 0, enableDrag: noop, disableDrag: noop }
    this.inputEnabled = false
    this.visible = true; this.alpha = 1; this.alive = true
    this.anchor = { set: noop, setTo: noop }
    this.position = new MockPoint()
    this.parent = null
    this.children = []
  }
  beginFill () { return this }
  endFill () { return this }
  drawRect () { return this }
  drawCircle () { return this }
  clear () { return this }
  destroy () {}
  lineStyle () { return this }
  moveTo () { return this }
  lineTo () { return this }
  drawRoundedRect () { return this }
  drawPolygon () { return this }
  drawEllipse () { return this }
  drawTriangle () { return this }
  arc () { return this }
  quadraticCurveTo () { return this }
  bezierCurveTo () { return this }
}

class MockText {
  constructor (game, x, y, text, style) {
    this.game = game; this.x = x; this.y = y; this.text = text; this.style = style
    this.anchor = { set: noop, setTo: noop }
    this.visible = true
    this.alpha = 1
    this.events = new MockEvents()
    this.input = { useHandCursor: false, enabled: false, priorityID: 0, enableDrag: noop, disableDrag: noop }
    this.inputEnabled = false
    this.position = new MockPoint(x || 0, y || 0)
    this.scale = { set: noop, setTo: noop, x: 1, y: 1 }
    this.parent = null
    this.fill = ''
  }
  setText (t) { this.text = t }
  setStyle () {}
  destroy () {}
  setShadow () {}
  setTextBounds () {}
  addColor () {}
  clearColors () {}
  addFontStyle () {}
  addFontWeight () {}
  precalculateWordWrap () { return [] }
}

class MockAnimation {
  constructor () {
    this.onComplete = new MockSignal()
    this.onStart = new MockSignal()
    this.onLoop = new MockSignal()
    this.isPlaying = false
    this.name = ''
    this.currentFrame = { index: 0 }
  }
  play () { return this }
  stop () {}
  destroy () {}
}

class MockAnimationManager {
  constructor () {
    this.currentAnim = new MockAnimation()
    this._anims = {}
  }
  add (name) {
    const anim = new MockAnimation()
    anim.name = name
    this._anims[name] = anim
    return anim
  }
  play (name) { return this.currentAnim }
  stop () {}
  getAnimation (name) { return this._anims[name] || null }
  destroy () {}
}

class MockEvents {
  constructor () {
    this.onInputDown = new MockSignal()
    this.onInputUp = new MockSignal()
    this.onInputOver = new MockSignal()
    this.onInputOut = new MockSignal()
    this.onDragStart = new MockSignal()
    this.onDragStop = new MockSignal()
    this.onDragUpdate = new MockSignal()
    this.onAnimationComplete = new MockSignal()
    this.onKilled = new MockSignal()
    this.onRevived = new MockSignal()
    this.onDestroy = new MockSignal()
    this.onAddedToGroup = new MockSignal()
    this.onRemovedFromGroup = new MockSignal()
  }
}

class MockSprite {
  constructor (game, x, y, key, frame) {
    this.game = game
    this.x = x || 0; this.y = y || 0
    this.key = key || null
    this.position = new MockPoint(this.x, this.y)
    this.anchor = { set: noop, setTo: noop, x: 0, y: 0 }
    this.pivot = { set: noop, x: 0, y: 0 }
    this.scale = { set: noop, setTo: noop, x: 1, y: 1 }
    this.alpha = 1; this.visible = true; this.alive = true
    this.width = 0; this.height = 0
    this.angle = 0; this.rotation = 0
    this.body = null
    this.input = { useHandCursor: false, enabled: false, priorityID: 0, enableDrag: noop, disableDrag: noop }
    this.inputEnabled = false
    this.tint = 0xffffff
    this.events = new MockEvents()
    this.animations = new MockAnimationManager()
    this._frame = null
    this.frameName = null
    this.parent = null
    this.children = []
  }
  loadTexture () {}
  setFrame () {}
  destroy () {}
  kill () { this.alive = false; return this }
  revive () { this.alive = true; return this }
  addChild (c) { this.children.push(c); return c }
  removeChild () {}
  bringToTop () {}
  reset (x, y) { this.x = x; this.y = y; this.alive = true }
  crop () {}
}

class MockButton extends MockSprite {
  constructor (game, x, y, key, cb, ctx) {
    super(game, x, y, key)
    this.onInputDown = new MockSignal()
    this.onInputUp = new MockSignal()
    this.onInputOver = new MockSignal()
    this.onInputOut = new MockSignal()
  }
}

class MockGroup {
  constructor (game, parent, name) {
    this.game = game; this.name = name || ''
    this.children = []; this.alive = true; this.visible = true
    this.x = 0; this.y = 0; this.alpha = 1
    this.position = new MockPoint()
    this.scale = { set: noop, setTo: noop, x: 1, y: 1 }
    this.pivot = { set: noop, x: 0, y: 0 }
    this.angle = 0
    this.length = 0
  }
  add (child) { this.children.push(child); this.length++; return child }
  addChild (child) { this.children.push(child); this.length++; return child }
  addAt (child) { this.children.push(child); this.length++; return child }
  remove (child) { this.children = this.children.filter(c => c !== child); this.length-- }
  removeAll () { this.children = []; this.length = 0 }
  create (x, y, key, frame) { const s = new MockSprite(this.game, x, y, key, frame); this.add(s); return s }
  destroy () { this.removeAll() }
  forEach (fn, ctx) { this.children.forEach(fn, ctx) }
  forEachAlive (fn, ctx) { this.children.filter(c => c.alive).forEach(fn, ctx) }
  getAt (i) { return this.children[i] }
  setAll (prop, val) { this.children.forEach(c => { c[prop] = val }) }
  bringToTop () {}
  sort () {}
  getFirstAlive () { return this.children.find(c => c.alive) || null }
  countLiving () { return this.children.filter(c => c.alive).length }
}

class MockState {
  constructor () {
    this.game = null
    this.key = ''
  }
  init () {}
  preload () {}
  create () {}
  update () {}
  render () {}
  shutdown () {}
}

class MockTween {
  constructor () {
    this.onComplete = new MockSignal()
    this.onStart = new MockSignal()
    this.isRunning = false
    this._chainedTweens = []
  }
  to () { return this }
  from () { return this }
  start () { return this }
  stop () { return this }
  chain () { this._chainedTweens.push(...arguments); return this }
  delay () { return this }
  repeat () { return this }
  yoyo () { return this }
  easing () { return this }
  onUpdateCallback () { return this }
}

class MockTimer {
  constructor () {
    this.events = []
    this.running = false
  }
  add (delay, cb) { this.events.push({ delay, cb }); return { timer: this } }
  start () { this.running = true }
  stop () { this.running = false }
  destroy () {}
  loop (delay, cb) { return this.add(delay, cb) }
  remove () {}
}

class MockBitmapData {
  constructor () {
    this.width = 0; this.height = 0
    this.ctx = {
      fillRect: noop, clearRect: noop, drawImage: noop, fillStyle: '', strokeStyle: '',
      putImageData: noop, getImageData: () => ({ data: new Uint8ClampedArray(4) }),
      createImageData: (w, h) => ({ data: new Uint8ClampedArray((w || 1) * (h || 1) * 4), width: w || 1, height: h || 1 }),
      fillText: noop, measureText: () => ({ width: 0 }),
      save: noop, restore: noop, translate: noop, rotate: noop, scale: noop,
      beginPath: noop, closePath: noop, moveTo: noop, lineTo: noop,
      arc: noop, stroke: noop, fill: noop, clip: noop, rect: noop,
      setTransform: noop, transform: noop
    }
    this.context = this.ctx
    this.canvas = { width: 0, height: 0, getContext: () => this.ctx }
    this.imageData = { data: new Uint8ClampedArray(4), width: 1, height: 1 }
    this.dirty = false
  }
  clear () { return this }
  fill () { return this }
  draw () { return this }
  copy () { return this }
  destroy () {}
  getPixel () { return { r: 0, g: 0, b: 0, a: 0 } }
  getPixel32 () { return 0 }
  setPixel () { return this }
  setPixel32 () { return this }
  resize () {}
  update () {}
}

// Assemble global Phaser
const PhaserMock = {
  Point: MockPoint,
  Rectangle: MockRectangle,
  Signal: MockSignal,
  Sprite: MockSprite,
  Group: MockGroup,
  State: MockState,
  Button: MockButton,
  Text: MockText,
  Graphics: MockGraphics,
  BitmapData: MockBitmapData,
  Animation: MockAnimation,
  Timer: Object.assign(MockTimer, {
    SECOND: 1000,
    HALF: 500,
    QUARTER: 250
  }),
  Tween: MockTween,

  Math: {
    angleBetween: (x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1),
    degToRad: (d) => d * (Math.PI / 180),
    radToDeg: (r) => r * (180 / Math.PI),
    clamp: (v, min, max) => Math.min(Math.max(v, min), max),
    distance: (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2),
    between: (min, max) => min + Math.floor(Math.random() * (max - min + 1)),
    linear: (p0, p1, t) => (p1 - p0) * t + p0,
    wrapAngle: (a) => a,
    normalizeAngle: (a) => a
  },

  Physics: {
    ARCADE: 0,
    P2JS: 1,
    Arcade: { sortDirection: { NONE: 0 } }
  },

  Loader: {
    TEXTURE_ATLAS_JSON_HASH: 0,
    TEXTURE_ATLAS_JSON_ARRAY: 1
  },

  Easing: {
    Linear: { None: (k) => k },
    Quadratic: { In: (k) => k * k, Out: (k) => k * (2 - k), InOut: noop },
    Cubic: { In: noop, Out: noop, InOut: noop },
    Sinusoidal: { In: noop, Out: noop, InOut: noop },
    Exponential: { In: noop, Out: noop, InOut: noop },
    Back: { In: noop, Out: noop, InOut: noop },
    Bounce: { In: noop, Out: noop, InOut: noop }
  },

  Filter: class MockFilter { constructor () {} init () {} update () {} destroy () {} },

  Keyboard: {
    SPACEBAR: 32,
    ENTER: 13,
    ESC: 27,
    UP: 38, DOWN: 40, LEFT: 37, RIGHT: 39
  },

  AnimationParser: {
    JSONDataHash: noop,
    JSONData: noop
  },

  Cache: {
    IMAGE: 0,
    JSON: 7,
    SOUND: 3
  },

  ScaleManager: {
    SHOW_ALL: 2,
    EXACT_FIT: 0,
    NO_SCALE: 1
  },

  Canvas: { addToDOM: noop, setTouchAction: noop },
  Device: { desktop: true, touch: false },

  GAMES: [],
  AUTO: 0,
  CANVAS: 1,
  WEBGL: 2,
  HEADLESS: 3,

  Game: class MockGame {}
}

// ---------------------------------------------------------------------------
// 2. Mock game object factory
// ---------------------------------------------------------------------------

function createMockUser () {
  const mockBoat = {
    Parts: [730],
    Name: 'TestBoat',
    Medals: [],
    CacheList: [],
    fuelFull: false,
    properties: {},
    quickProperties: {},
    criteria: {},
    boatSnapPoints: [],
    boatSnapOffsets: {},
    hasPart: () => false,
    hasPartWithProperty: () => false,
    hasCache: () => false,
    addCache: noop,
    removeCache: noop,
    getParts: () => [],
    getProperty: () => 0,
    getQuickProperty: () => 0,
    addPart: noop,
    removePart: noop,
    fromList: noop,
    recalculate: noop,
    getFuelCapacity: () => 100,
    getFuelLevel: () => 50,
    getLoadCapacity: () => 100,
    getWeight: () => 50,
    getPower: () => 200,
    getSpeed: () => 10,
    getMaterial: () => 1,
    getHullSize: () => 'Medium',
    hasEngine: () => false,
    hasSail: () => false,
    hasOar: () => false,
    clone: function () { return { ...this } },
    updateStats: noop,
    isSeaworthy: () => true,
    getStats: () => ({ power: 200, speed: 10, fuel: 100, weight: 50 })
  }

  const mockCar = {
    Parts: [1, 2, 3],
    Name: 'TestCar',
    Medals: [],
    CacheList: [],
    properties: {},
    quickProperties: {},
    hasPart: () => false,
    hasPartWithProperty: () => false,
    hasCache: () => false,
    addCache: noop,
    removeCache: noop,
    getParts: () => [],
    getProperty: () => 0,
    getQuickProperty: () => 0,
    addPart: noop,
    removePart: noop,
    fromList: noop,
    recalculate: noop,
    clone: function () { return { ...this } }
  }

  return {
    UserId: 'TestUser',
    Car: mockCar,
    Boat: mockBoat,
    Junk: {
      Pile1: {}, Pile2: {}, Pile3: {}, Pile4: {},
      Pile5: {}, Pile6: {}, shopFloor: {}, yard: {}
    },
    NrOfBuiltCars: 0,
    Saves: [],
    CompletedMissions: [],
    OwnStuff: [],
    myLastPile: 1,
    gifts: [],
    toYardThroughDoor: true,
    givenMissions: [],
    figgeIsComing: false,
    missionIsComing: false,
    savedCars: [],
    FiggeVisits: 0,
    FiggeUnlocks: { tier1: false, tier2: false, tier3: false, vip: false },
    DLCPurchased: [],
    saveVersion: 2,
    drivingInfo: { totalDistanceSailed: 0, totalTimeSailed: 0, longestVoyage: 0, favouritePropulsion: null },
    save: noop,
    calculateParts: noop,
    hasPart: () => false,
    addPart: noop,
    removePart: noop,
    getRandomPart: () => 100,
    hasStuff: () => false,
    addStuff: noop,
    removeStuff: noop,
    setInventory: noop,
    getInventory: () => null,
    hasInventory: () => false,
    isMissionCompleted: () => false,
    isMissionGiven: () => false,
    isSeaMissionCompleted: () => false,
    isSeaMissionGiven: () => false,
    completeMission: noop,
    completeSeaMission: noop,
    giveMission: noop,
    giveSeaMission: noop,
    getMissionCount: () => 0,
    getSeaMissionCount: () => 0,
    deliveryMade: false,
    getEnteredObject: () => null,
    hasBoatPart: () => false,
    getFromInventory: () => null,
    isInInventory: () => false,
    getRandomBoatPart: () => 800,
    getExternalParts: () => [],
    setExternalParts: noop,
    addCompletedMission: noop,
    addCompletedSeaMission: noop,
    hasMedal: () => false,
    awardMedal: noop,
    getRandomRewardPart: () => null,
    getPartInfo: () => ({}),
    fromJSON: noop,
    toJSON: () => ({}),
    addGivenMission: noop,
    addGivenSeaMission: noop,
    setInInventory: noop,
    getCompletedMissionInfo: () => ({ count: 0 }),
    getCompletedMissions: () => [],
    getGivenMissions: () => [],
    addBoatPart: noop,
    addNewPart: noop,
    addMedal: noop,
    deletePart: noop,
    deleteItem: noop,
    refuelBoat: noop,
    setProperty: noop,
    getProperty: () => 0
  }
}

function createMockGame () {
  const game = {
    width: 640,
    height: 480,
    world: {
      add: (child) => child,
      remove: noop,
      setBounds: noop,
      centerX: 320,
      centerY: 240,
      bounds: new MockRectangle(0, 0, 640, 480),
      children: [],
      sendToBack: (child) => child,
      bringToTop: (child) => child,
      swap: noop,
      moveUp: noop,
      moveDown: noop,
      setChildIndex: noop,
      getChildAt: () => null,
      getChildIndex: () => 0
    },
    add: {
      existing: (obj) => obj,
      sprite: (x, y, key, frame) => new MockSprite(game, x, y, key, frame),
      group: (parent, name) => {
        if (typeof parent === 'string') return new MockGroup(game, null, parent)
        return new MockGroup(game, parent, name)
      },
      text: (x, y, text, style) => new MockText(game, x, y, text, style),
      graphics: () => new MockGraphics(),
      tween: (target) => new MockTween(),
      audio: (key) => ({
        play: noop, stop: noop, pause: noop, resume: noop, destroy: noop,
        onStop: new MockSignal(), onComplete: new MockSignal(),
        isPlaying: false, volume: 1, key: key,
        addMarker: noop, currentTime: 0, totalDuration: 0
      }),
      button: (x, y, key, cb, ctx) => new MockButton(game, x, y, key, cb, ctx),
      bitmapData: (w, h) => new MockBitmapData(),
      tileSprite: (x, y, w, h, key) => new MockSprite(game, x, y, key),
      image: (x, y, key) => new MockSprite(game, x, y, key)
    },
    make: {
      bitmapData: (w, h) => new MockBitmapData(),
      sprite: (x, y, key) => new MockSprite(game, x, y, key)
    },
    load: {
      pack: noop,
      json: noop,
      image: noop,
      spritesheet: noop,
      atlas: noop,
      audio: noop,
      audiosprite: noop,
      bitmapFont: noop,
      tilemap: noop,
      onLoadComplete: new MockSignal(),
      progressFloat: 100,
      isLoading: false,
      hasLoaded: true,
      start: noop,
      reset: noop
    },
    cache: {
      getJSON: (key) => {
        // Return nested animation chart structure for mudcar/similar
        // mudcar accesses e.g. result['TittAnimChart']['Actions']['suck']
        const animChart = { Actions: new Proxy({}, { get: () => [] }), Animations: {} }
        if (key && key.toLowerCase().includes('anim')) {
          return new Proxy({}, { get: () => animChart })
        }
        // diploma accesses strings[dirResource][69], etc.
        if (key === 'strings') {
          return new Proxy({}, { get: () => new Proxy({}, { get: () => '' }) })
        }
        return {}
      },
      getText: () => ({}),
      getImage: () => ({ base: { width: 1, height: 1 } }),
      getFrameData: () => null,
      getFrame: () => null,
      checkImageKey: () => true,
      checkJSONKey: () => true,
      checkSoundKey: () => true,
      isSoundDecoded: () => true,
      getItem: () => null,
      _cache: {}
    },
    sound: {
      play: () => ({ stop: noop, onStop: new MockSignal() }),
      add: (key) => ({
        play: noop, stop: noop, pause: noop, resume: noop, destroy: noop,
        onStop: new MockSignal(), onComplete: new MockSignal(),
        isPlaying: false, volume: 1, key: key,
        addMarker: noop, currentTime: 0, totalDuration: 0
      }),
      remove: noop,
      stopAll: noop,
      pauseAll: noop,
      resumeAll: noop,
      mute: false,
      volume: 1
    },
    input: {
      activePointer: { x: 0, y: 0, isDown: false, worldX: 0, worldY: 0 },
      keyboard: {
        addKey: () => ({ onDown: new MockSignal(), onUp: new MockSignal(), isDown: false }),
        createCursorKeys: () => ({
          up: { isDown: false }, down: { isDown: false },
          left: { isDown: false }, right: { isDown: false }
        }),
        isDown: () => false,
        onDownCallback: null,
        onUpCallback: null
      },
      onDown: new MockSignal(),
      onUp: new MockSignal(),
      onTap: new MockSignal(),
      mouse: { capture: false },
      enabled: true,
      x: 0, y: 0
    },
    state: {
      start: noop,
      add: noop,
      remove: noop,
      restart: noop,
      getCurrentState: () => null,
      current: ''
    },
    rnd: {
      between: (min, max) => min,
      integerInRange: (min, max) => min,
      pick: (arr) => arr[0],
      frac: () => 0.5,
      integer: () => 0,
      sign: () => 1,
      uuid: () => 'test-uuid'
    },
    time: {
      events: new MockTimer(),
      now: Date.now(),
      elapsed: 16,
      fps: 60,
      desiredFps: 60,
      create: () => new MockTimer()
    },
    physics: {
      startSystem: noop,
      arcade: {
        enable: noop,
        enableBody: noop,
        overlap: () => false,
        collide: () => false,
        gravity: { y: 0 },
        setBoundsToWorld: noop
      },
      p2: null
    },
    stage: {
      backgroundColor: '#000000',
      disableVisibilityChange: false,
      smoothed: true
    },
    renderer: {
      render: noop,
      renderSession: {},
      type: 1
    },
    camera: {
      x: 0, y: 0,
      width: 640, height: 480,
      view: new MockRectangle(0, 0, 640, 480),
      follow: noop,
      reset: noop,
      setPosition: noop,
      focusOn: noop,
      focusOnXY: noop,
      shake: noop,
      flash: noop,
      fade: noop,
      setBoundsToWorld: noop
    },
    canvas: {
      style: {},
      className: '',
      getContext: () => ({ fillRect: noop, clearRect: noop, drawImage: noop })
    },
    scale: {
      setGameSize: noop,
      setShowAll: noop,
      pageAlignHorizontally: false,
      pageAlignVertically: false,
      refresh: noop
    },
    debug: {
      text: noop,
      spriteInfo: noop,
      body: noop
    },
    tweens: {
      create: () => new MockTween(),
      add: () => new MockTween(),
      remove: noop,
      removeAll: noop,
      isTweening: () => false
    },
    // ── game.mulle subsystem ──
    mulle: {
      user: createMockUser(),
      UsersDB: { TestUser: null },  // filled below
      addAudio: noop,
      playAudio: () => ({ stop: noop, onStop: new MockSignal(), onComplete: new MockSignal(), isPlaying: false }),
      stopAudio: noop,
      getDirectorImage: () => ({
        frame: { x: 0, y: 0, width: 1, height: 1, regpoint: { x: 0, y: 0 } }
      }),
      getBoatPart: () => null,
      actors: {
        mulle: { talk: noop, play: noop, setIdle: noop, setState: noop, destroy: noop, position: new MockPoint(), visible: true, alpha: 1, x: 0, y: 0, setDirectorMember: noop, setAnimChart: noop },
        figge: { talk: noop, play: noop, setIdle: noop, setState: noop, destroy: noop, position: new MockPoint(), visible: true, alpha: 1, x: 0, y: 0, setDirectorMember: noop, setAnimChart: noop },
        buffa: { talk: noop, play: noop, setIdle: noop, setState: noop, destroy: noop, position: new MockPoint(), visible: true, alpha: 1, x: 0, y: 0 },
        judge: { talk: noop, play: noop, setIdle: noop, setState: noop, destroy: noop, position: new MockPoint(), visible: true, alpha: 1, x: 0, y: 0 }
      },
      cursor: { reset: noop, update: noop, current: null, set: noop },
      loopMaster: { loop: noop, dispose: noop, register: noop, unregister: noop },
      PartsDB: {},
      BoatPartsDB: {},
      net: { send: noop },
      sceneTransition: { currentScene: '' },
      missionManager: {
        completeMission: noop,
        giveMission: noop,
        isMissionCompleted: () => false,
        isMissionGiven: () => false,
        getMissionCount: () => 0,
        hasInventoryItem: () => false,
        getInventoryItem: () => null,
        addInventoryItem: noop,
        removeInventoryItem: noop,
        checkMissions: noop,
        isGiven: () => false,
        isCompleted: () => false,
        give: noop,
        complete: noop,
        getCount: () => 0
      },
      missionSystem: {
        getPendingMailMission: () => null,
        getPendingPhoneMission: () => null,
        completeMission: noop,
        giveMission: noop,
        isMissionCompleted: () => false,
        isMissionGiven: () => false
      },
      activeCutscene: null,
      cheats: false,
      directorMemberMap: {},
      SetWhenDone: { Cache: ['#Test'], Parts: [], Actions: [], Medals: [] },
      WorldsDB: { 'Da Hood': { destinations: [], name: 'Da Hood' }, 'Metal World': { destinations: [] }, 'Wood World': { destinations: [] } },
      loadBoatAssets: noop,
      registerBoatAudio: noop,
      saveData: noop,
      getBoatPartInfo: () => ({}),
      getPartInfo: () => ({}),
      lastSession: null,
      medalManager: { awardMedal: noop, hasMedal: () => false },
      subtitle: { setLines: noop, show: noop, hide: noop, load: noop },
      Worlds: { 'Da Hood': { destinations: [] }, 'Metal World': { destinations: [] }, 'Wood World': { destinations: [] } }
    }
  }

  // Fill UsersDB with the user ref
  game.mulle.UsersDB.TestUser = game.mulle.user

  return game
}

// ---------------------------------------------------------------------------
// 3. Module‐level jest.mock() registration
//
// Call `registerAllMocks()` before any scene import.
// Each mock returns a class / function stub with the right shape.
// ---------------------------------------------------------------------------

function makeMockClass (name, extras = {}) {
  const cls = class {
    constructor (...args) {
      this.game = args[0] || null
      this.x = args[1] || 0
      this.y = args[2] || 0
      this.position = new MockPoint(this.x, this.y)
      this.anchor = { set: noop, setTo: noop, x: 0, y: 0 }
      this.pivot = { set: noop, x: 0, y: 0 }
      this.scale = { set: noop, setTo: noop, x: 1, y: 1 }
      this.visible = true; this.alpha = 1; this.alive = true
      this.width = 0; this.height = 0
      this.events = new MockEvents()
      this.animations = new MockAnimationManager()
      this.children = []
      this.body = null
      this.input = { useHandCursor: false, enabled: false, priorityID: 0, enableDrag: noop, disableDrag: noop, start: noop }
      this.inputEnabled = false
      this.tint = 0xffffff; this._frame = null
      this._name = name
      // Apply extras
      Object.keys(extras).forEach(k => { this[k] = typeof extras[k] === 'function' ? extras[k] : extras[k] })
      // Proxy: return noop for any undefined method call
      return new Proxy(this, {
        get (target, prop) {
          if (prop in target) return target[prop]
          if (typeof prop === 'string' && !prop.startsWith('_')) return noop
          return undefined
        }
      })
    }
  }
  // Prototype stubs
  ;[
    'destroy', 'kill', 'revive', 'addChild', 'removeChild', 'bringToTop',
    'setDirectorMember', 'setFrameId', 'loadTexture', 'setFrame', 'crop',
    'addAnimation', 'play', 'stop', 'setAnimChart', 'setState',
    'addStateTransition', 'chainAnimation', 'stopAnimationChain',
    'addFrameHold', 'addRandomFrameAnimation', 'addAnimationWithSounds',
    'reset', 'talkTo', 'setIdle', 'setTalkAnimation',
    // BuildCar / BuildBoat
    'draw', 'drawBoat', 'drawCar', 'update', 'addPart', 'removePart', 'clear',
    'getProperty', 'getQuickProperty', 'recalculate', 'fromList',
    'setBoatHull', 'setBoatRudder', 'getSnapPoints', 'getPartAt',
    // DriveCar / DriveBoat
    'init', 'start', 'steer', 'accelerate', 'brake', 'setPosition',
    // Button
    'setCallback', 'enable', 'disable',
    // SubtitleLoader
    'load', 'show', 'hide', 'setLanguage',
    // LingoSceneRuntime
    'run', 'step', 'goto', 'setContext',
    // DirectorHelper
    'getMember', 'getImage', 'getLocation', 'getCastMember',
    // MulleFileBrowser
    'open', 'close', 'refresh',
    // TextInput
    'focus', 'blur', 'setValue', 'getValue',
    // BoatViewHandler
    'render', 'setView', 'getView',
    // MapDisplay / MeterScript
    'show', 'hide', 'update', 'setPosition',
    // Weather
    'setSky', 'getWeather', 'setWeather',
    // Toolbox
    'open', 'close', 'toggle',
    // JunkActor
    'startIdle', 'stopIdle',
    // Inventory
    'add', 'remove', 'has', 'get'
  ].forEach(m => {
    if (!cls.prototype[m]) {
      cls.prototype[m] = function () { return this }
    }
  })
  return cls
}

function registerAllMocks () {
  // ---------- objects ----------
  const mockModules = {
    '../../objects/sprite': makeMockClass('MulleSprite'),
    '../../objects/actor': makeMockClass('MulleActor', { talkAnimation: 'talk', idleAnimation: 'idle', talk: noop, setIdle: noop, setState: returnThis, setAnimChart: noop }),
    '../../objects/button': (() => {
      const cls = makeMockClass('MulleButton')
      cls.fromRectangle = (game, rect, cb, ctx) => new cls(game, 0, 0)
      return cls
    })(),
    '../../objects/buildcar': (() => {
      const cls = makeMockClass('MulleBuildCar')
      const origCtor = cls
      const wrappedCls = class extends origCtor {
        constructor (...args) {
          super(...args)
          this.onDetach = new MockSignal()
          this.onAttach = new MockSignal()
          this.onDrop = new MockSignal()
        }
      }
      wrappedCls.default = wrappedCls
      return wrappedCls
    })(),
    '../../objects/buildboat': (() => {
      const cls = makeMockClass('MulleBuildBoat', { setWaterSprite: noop, create: noop, isSeaworthy: () => true, getProperty: () => 0, getQuickProperty: () => 0 })
      const wrappedCls = class extends cls {
        constructor (...args) {
          super(...args)
          this.onDetach = new MockSignal()
          this.onAttach = new MockSignal()
          this.onDrop = new MockSignal()
        }
      }
      wrappedCls.default = wrappedCls
      return wrappedCls
    })(),
    '../../objects/carpart': makeMockClass('MulleCarPart'),
    '../../objects/boatpart': makeMockClass('MulleBoatPart'),
    '../../objects/toolbox': makeMockClass('MulleToolbox'),
    '../../objects/drivecar': makeMockClass('MulleDriveCar', {
      setCoordinate: noop, setSpeed: noop, setDirection: noop, update: noop,
      kill: noop, init: noop, start: noop, stop: noop
    }),
    '../../objects/driveboat': makeMockClass('MulleDriveBoat'),
    '../../objects/mapobject': makeMockClass('MulleMapObject'),
    '../../objects/mpcar': makeMockClass('MulleMPCar'),
    '../../objects/TextInput': (() => {
      const cls = makeMockClass('TextInput', { id: () => 'mock-input', focus: noop, blur: noop, setValue: noop, getValue: () => '', text: noop, value: noop })
      const origCtor = cls
      const wrappedCls = class extends origCtor {
        constructor (...args) {
          super(...args)
          this.input = { addEventListener: noop, removeEventListener: noop, value: '', focus: noop, blur: noop, style: {} }
          this.element = { style: {}, appendChild: noop, removeChild: noop, addEventListener: noop }
        }
      }
      wrappedCls.default = wrappedCls
      return wrappedCls
    })(),
    '../../objects/MulleFileBrowser': makeMockClass('MulleFileBrowser'),
    '../../objects/DirectorHelper': (() => {
      const cls = makeMockClass('DirectorHelper')
      // Static methods used by scenes
      cls.getDirectorImage = () => ['mock_key', { x: 0, y: 0, width: 1, height: 1, regpoint: { x: 0, y: 0 } }]
      cls.sprite = (game, x, y, dir, member) => new MockSprite(game, x, y)
      cls.button = (game, x, y, dir, member) => {
        const btn = new MockSprite(game, x, y)
        btn.onInputDown = new MockSignal()
        btn.onInputUp = new MockSignal()
        return btn
      }
      cls.getMember = () => ({})
      cls.getLocation = () => new MockPoint()
      cls.getCastMember = () => ({})
      return cls
    })(),
    '../../objects/SubtitleLoader': (() => {
      const cls = makeMockClass('SubtitleLoader', { preload: noop, load: noop, show: noop, hide: noop, setLanguage: noop, setLines: noop })
      const wrappedCls = class extends cls {
        constructor (...args) {
          super(...args)
          this.subtitles = this
        }
      }
      wrappedCls.default = wrappedCls
      return wrappedCls
    })(),
    '../../objects/LingoSceneRuntime': makeMockClass('LingoSceneRuntime', {
      build: function () { return this },
      run: noop, step: noop, goto: noop, setContext: noop,
      startLoop: noop, stopLoop: noop,
      getById: () => ({ events: new MockEvents(), input: { useHandCursor: false, enabled: false, enableDrag: noop, disableDrag: noop }, position: new MockPoint(), visible: true, alpha: 1, setDirectorMember: noop, addChild: noop }),
      getAllSprites: () => [],
      dispose: noop,
      refreshActive: noop,
      setHandler: noop,
      getHandler: () => noop,
      registerSprite: noop,
      unregisterSprite: noop,
      setProperty: noop,
      getProperty: () => null,
      objects: []
    }),
    '../../objects/JunkActor': makeMockClass('MulleJunkActor'),
    '../../objects/audio': makeMockClass('MulleAudio'),
    '../../objects/ambiencesound': makeMockClass('AmbienceSound', { activate: noop, deactivate: noop, setVolume: noop }),
    '../../objects/weather': makeMockClass('MulleWeather', {
      setCornerPoints: noop, init: noop, kill: noop, update: noop,
      setWindSpeed: noop, setWeatherType: noop, startWeather: noop, stopWeather: noop,
      waves: { setCornerPoints: noop, update: noop, kill: noop },
      wind: { update: noop, kill: noop, setWindSpeed: noop }
    }),
    '../../objects/loopmaster': makeMockClass('LoopMaster'),
    '../../objects/inventory': makeMockClass('Inventory'),
    '../../objects/junkpile': makeMockClass('MulleJunkPile'),
    '../../objects/mullesez': makeMockClass('MulleSez'),
    '../../objects/GameObserver': makeMockClass('GameObserver'),
    // input
    '../../objects/input/MouseObject': makeMockClass('MouseObject'),
    // boat sub-objects
    '../../objects/boat/BoatViewHandler': makeMockClass('BoatViewHandler'),
    '../../objects/boat/DrivingHandlers': makeMockClass('DrivingHandlers'),
    '../../objects/boat/BoatConstants': {
      HUD_LAYERS: {}, HUD_ASSETS: {}, HUD_POSITIONS: {},
      DEFAULT_BOAT_PROPS: { engine: false, sailWithPole: false, oar: false, material: 1 },
      TOPOLOGY: {}
    },
    // UI
    '../../objects/ui/ToolBoxBH': makeMockClass('ToolBoxBH', { show: noop, hide: noop, toggle: noop, create: noop }),
    '../../objects/ui/MapDisplay': makeMockClass('MapDisplay'),
    '../../objects/ui/MeterScript': makeMockClass('MeterScript'),
    // ---------- struct ----------
    '../../struct/savedata': makeMockClass('MulleSave'),
    '../../struct/world': makeMockClass('MulleWorld', {
      createDefault: noop, fromJSON: noop,
      getDestination: () => ({ name: 'test', x: 0, y: 0 }), getDestinations: () => [],
      setPosition: noop, worlds: { 'Da Hood': { destinations: [] } },
      calcRandomDestinations: noop, randomizeDestinations: noop,
      getMap: () => ({ objects: [], terrain: 0 }),
      StartMap: new MockPoint(), StartCoordinate: new MockPoint(), StartDirection: 0,
      rDests: {}, map: [[]]
    }),
    '../../struct/seaworld': makeMockClass('MulleSeaWorld', {
      createDefault: noop, fromJSON: noop, getDestination: () => null, getDestinations: () => [],
      setPosition: noop, calcRandomDestinations: noop, randomizeDestinations: noop,
      getMap: () => ({ objects: [], terrain: 0 }),
      StartMap: new MockPoint(3, 6), StartCoordinate: new MockPoint(320, 240), StartDirection: 1,
      rDests: {}, map: [[]]
    }),
    '../../struct/missions': makeMockClass('MulleMissions', {
      getPendingMailMission: () => null,
      getPendingTelephoneMission: () => null,
      getPendingPhoneMission: () => null,
      completeMission: noop,
      giveMission: noop,
      isMissionCompleted: () => false,
      isMissionGiven: () => false,
      getMissionCount: () => 0,
      checkMissions: noop
    }),
    // ---------- util ----------
    '../../util/blinkThing': noop,
    '../../util/directorAnimation': { default: { addAnimation: noop, playAnimation: noop, stopAnimation: noop }, directorAnimation: noop, addAnimation: noop },
    '../../util/movingAnimation': { default: noop },
    '../../util/partUtil': { default: { getPartCategory: () => 'body', getPartType: () => 'hull' } },
    '../../util/LoadSaveBoat': makeMockClass('LoadSaveBoat'),
    '../../util/cursor': { default: { reset: noop, update: noop, set: noop } },
    // ---------- lingo specs ----------
    '../../lingo/scenes/boatyard_04': { default: { sprites: [], handlers: {} } },
    '../../lingo/scenes/boat_yard_03': { default: { sprites: [], handlers: {} } },
    '../../lingo/scenes/boat_junk_02': { default: { sprites: [], handlers: {} } }
  }

  Object.entries(mockModules).forEach(([modulePath, mockValue]) => {
    // If it's a class (function), wrap as default export
    if (typeof mockValue === 'function') {
      jest.mock(modulePath, () => {
        const cls = mockValue
        // Support both `import X` (default) and `require(X)` / `require(X).default`
        cls.default = cls
        return cls
      })
    } else {
      // It's an object (named exports) – return as-is, with a default
      jest.mock(modulePath, () => {
        const mod = { ...mockValue }
        if (!mod.default) mod.default = mockValue
        return mod
      })
    }
  })
}

module.exports = {
  PhaserMock,
  MockPoint,
  MockRectangle,
  MockSignal,
  MockSprite,
  MockGroup,
  MockState,
  MockTween,
  MockTimer,
  MockGraphics,
  MockText,
  MockEvents,
  MockBitmapData,
  MockButton,
  createMockGame,
  createMockUser,
  registerAllMocks,
  makeMockClass,
  noop
}
