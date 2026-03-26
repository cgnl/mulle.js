/**
 * SeaWorld scene
 * @module SeaWorldState
 * 
 * The boat equivalent of WorldState (car driving)
 * Navigate through the sea with your boat using point-and-click destinations
 * 
 * Original game navigation (boten_76-88.DXR):
 * - Shows sea map with clickable destination markers
 * - Destinations: Vuurtoren (Sam, scene 80), Boot Show (Judge, scene 76),
 *   Surfstrand (Sur, scene 81), Birgit's strand (scene 77)
 * - Clicking destination starts sailing animation toward it
 * - When reaching destination, transitions to that scene
 * 
 * Sea Topology System:
 * Similar to the car world's topology system, the sea world uses a
 * topology bitmap to define navigable areas and terrain types.
 * 
 * Color coding (R channel value):
 * - 0-50: Deep water (normal sailing)
 * - 51-100: Medium depth (slight current effects)
 * - 101-150: Shallow water (slow, small boats only)
 * - 160-200: Reef/rocks (requires durability)
 * - 201-220: Strong currents (pushes boat, direction in G channel)
 * - 240-255: Shore/land (impassable)
 * 
 * The G channel can encode current direction (0-255 = 0-360 degrees)
 * The B channel is reserved for future use (tides, depth variation)
 */

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleDriveBoat from '../objects/driveboat'
const ToolBoxBH = require('../objects/ui/ToolBoxBH')
import MapDisplay from '../objects/ui/MapDisplay'
import MulleMapObject from '../objects/mapobject'
import MulleWeather from '../objects/weather'
import AmbienceSound from '../objects/ambiencesound'
import MeterScript from '../objects/ui/MeterScript'
import { HUD_LAYERS, HUD_ASSETS, HUD_POSITIONS, DEFAULT_BOAT_PROPS, TOPOLOGY } from '../objects/boat/BoatConstants'
import DrivingHandlers from '../objects/boat/DrivingHandlers'

import MulleSeaWorld from '../struct/seaworld'

/**
 * Navigation mode for the sea world
 */
const NavigationMode = {
  MAP: 'map',           // Viewing sea map with clickable destinations
  SAILING: 'sailing',   // Actively sailing to a destination
  ARRIVED: 'arrived'    // Arrived at destination, transitioning to scene
}

function clonePointSafe(point, fallback = { x: 0, y: 0 }) {
  if (point && typeof point.clone === 'function') {
    return point.clone()
  }

  const x = point && typeof point.x === 'number' ? point.x : fallback.x
  const y = point && typeof point.y === 'number' ? point.y : fallback.y
  return new Phaser.Point(x, y)
}

/**
 * Sea world scene - sail your boat!
 * @extends MulleState
 */
class SeaWorldState extends MulleState {
  preload() {
    super.preload()

    // Lazy load boat assets (prevents sprite conflicts with car game)
    this.game.mulle.loadBoatAssets(this.game.load)

    // Load sea world assets (these may already be in the boat assets pack)
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
    this.game.load.pack('boatbuild', 'assets/boatbuild.json', null, this)
    this.game.load.pack('boat_bms', 'assets/boat_bms.json', null, this)

    // Sea tile backgrounds (30b***) are stored in map atlases.
    this.game.load.pack('map', 'assets/map.json', null, this)

    // Sea map objects reuse several 31b*** members from driving/CDDATA atlases.
    this.game.load.pack('driving', 'assets/driving.json', null, this)

    // Sea topology atlas is optional; runtime falls back to procedural/open-water topology.
  }

  /**
   * Save current session state for returning later
   * @param {Object} obj - Optional object info (destination entered)
   */
  saveSession(obj) {
    console.log('[SeaWorld] Save session')

    const fallbackMap = (this.activeWorld && this.activeWorld.StartMap) || { x: 3, y: 6 }
    const fallbackBoatPos = this.driveBoat && this.driveBoat.position
      ? this.driveBoat.position
      : { x: this.driveBoat ? this.driveBoat.x : 320, y: this.driveBoat ? this.driveBoat.y : 240 }

    this.game.mulle.lastSeaSession = {
      mapCoordinate: clonePointSafe(this.mapCoordinate, fallbackMap),
      boatPosition: clonePointSafe(fallbackBoatPos, { x: 320, y: 240 }),
      boatDirection: this.driveBoat ? this.driveBoat.direction : 0,
      boatSpeed: this.driveBoat ? this.driveBoat.speed : 0
    }

    if (this.driveBoat) {
      const fuel = (this.driveBoat.fuelMax > 0 && this.driveBoat.fuelCurrent >= this.driveBoat.fuelMax)
        ? 'Full'
        : (typeof this.driveBoat.fuelCurrent === 'number' ? Math.round(this.driveBoat.fuelCurrent) : this.driveBoat.fuelCurrent)
      this.game.mulle.lastSeaSession.boatFuel = fuel
      this.game.mulle.lastSeaSession.boatDurability = this.driveBoat.Durability
      if (typeof this.driveBoat.getDriveType === 'function') {
        this.game.mulle.lastSeaSession.boatType = this.driveBoat.getDriveType()
      }
    }

    if (obj) {
      this.game.mulle.lastSeaSession.mapObject = obj.id
    }
  }

  /**
   * Load previous session state
   */
  loadSession() {
    const session = this._getSessionData()
    if (!session) return false

    // Align with Lingo init flow: apply boat state first, then run map/object pass.
    this.driveBoat.position.set(session.boatPosition.x, session.boatPosition.y)
    if (typeof this.driveBoat.setDirection === 'function') {
      this.driveBoat.setDirection(session.boatDirection)
    } else {
      this.driveBoat.direction = session.boatDirection
    }
    if (typeof session.boatSpeed === 'number') {
      this.driveBoat.speed = session.boatSpeed
    }
    if (typeof this.driveBoat.applySavedState === 'function') {
      this.driveBoat.applySavedState({
        fuel: session.boatFuel,
        Durability: session.boatDurability,
        type: session.boatType
      })
    }

    // Lingo equivalent: changeMap(gDir, mapCoordinate, #Absolute)
    // theRealInit is VOID in this path.
    this.changeMap(session.mapCoordinate, true, undefined)
    // Validate saved spawn after text topology loads (fixes bad saves from earlier parity bugs).
    if (this.topBitmap && this.topBitmap.isTextTopology === true) {
      this._pendingSessionStartValidation = false
      this._validateBoatStart('session')
    } else {
      this._pendingSessionStartValidation = true
    }

    // Handle entered objects (disable them temporarily)
    if (session.mapObject && this.mapObjects) {
      this.mapObjects.forEach((o) => {
        if (o.id === session.mapObject) {
          console.log('[SeaWorld] Disable object', o.id)
          o.enteredInner = true
          o.enteredOuter = true
        }
      })
    }

    return true
  }

  _getSessionData() {
    const mulle = this.game ? this.game.mulle : null
    if (!mulle) return null

    if (mulle.lastSeaSession) {
      return mulle.lastSeaSession
    }

    const user = mulle.user
    if (user && typeof user.getDrivingInfo === 'function') {
      const info = user.getDrivingInfo()
      const pos = info ? (info.position || info.loc) : null
      if (info && info.map && pos) {
        return {
          mapCoordinate: info.map,
          boatPosition: pos,
          boatDirection: info.direction,
          boatSpeed: info.speed,
          boatFuel: info.fuel,
          boatDurability: info.Durability,
          boatType: info.type,
          mapObject: info.mapObject
        }
      }
    }

    return null
  }

  /**
   * Remove session data
   */
  removeSession() {
    this.game.mulle.lastSeaSession = null
  }

  create() {
    super.create()

    // Register boat audio after assets are loaded
    this.game.mulle.registerBoatAudio()

    // Check if boat is seaworthy
    const boat = this.game.mulle.user.Boat
    if (!boat || !boat.isSeaworthy()) {
      console.error('[SeaWorld] Boat is not seaworthy!')
      this.game.state.start('boatyard')
      return
    }

    // Initialize topology system (similar to car world)
    this.topBitmap = null
    this.topSprite = null
    this.mapCoordinate = null
    this.activeWorld = null
    this._topologyMemberMap = null
    this._topologyMemberMapPromise = null
    this._topologyBytesCache = new Map()
    this._pendingTopologyLoads = new Map()
    this._currentTopologyName = null

    // Original Lingo starts directly in driving mode.
    this.navigationMode = NavigationMode.SAILING
    this.targetDestination = null
    this.sailingProgress = 0

    // Add sea audio (scene-specific)
    this.game.mulle.addAudio('seaworld')

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // Create topology bitmap for collision detection
    // Same size as car world topology (316x198 at half resolution)
    this.topBitmap = this.game.make.bitmapData(316, 198)

    // Create the sea world (multi-screen 3x3 grid)
    this.activeWorld = new MulleSeaWorld(this.game, 'De Zee')
    this._startTopologyLogged = false

    // Try to load from data, or create default
    const seaWorlds = this.game.mulle.SeaWorldsDB || null
    let seaWorldData = null
    if (seaWorlds) {
      seaWorldData = seaWorlds['De Zee'] || seaWorlds['Da Hood']
      if (!seaWorldData) {
        const keys = Object.keys(seaWorlds)
        if (keys.length) {
          seaWorldData = seaWorlds[keys[0]]
        }
      }
    }

    if (seaWorldData && Array.isArray(seaWorldData.map) && seaWorldData.map.length) {
      this.activeWorld.fromJSON(seaWorldData)
    } else {
      this.activeWorld.createDefault()
    }

    // Original Dir.ls line 164: randomizeDestinations(the world of gMulleGlobals)
    // Ensure randomized destination placement is ready before first map load.
    if (this.activeWorld.calcRandomDestinations && this.activeWorld.randomizeDestinations) {
      this.activeWorld.calcRandomDestinations()
      this.activeWorld.randomizeDestinations()
    }

    // Play ocean ambient sounds
    this.playAmbientSounds()

    // Create sea background (sea map view)
    this.createBackground()

    // Create sea topology layer
    this.createTopology()

    // Create the sailing boat
    this.createBoat()

    // Create map objects (islands, buoys, etc)
    this.mapObjects = this.game.add.group()

    // Keep SeaWorld close to original Lingo flow: no custom overlay HUD/minimap.
    this.energyGaugeGroup = null
    this.minimapGroup = null

    // Lingo-style HUD members/buttons.
    this.createLingoHud()

    // Create weather system (items #125-136)
    this.createWeatherSystem()

    // Initialize driving handlers for direction/radius checks (Lingo parity).
    this.drivingHandlers = new DrivingHandlers()

    // Initialize dynamic sprite storage for external control
    this.dynamicSprites = {}

    // Load session or start fresh
    if (this.game.mulle.lastSeaSession) {
      this.loadSession()
      this.removeSession()
    } else {
      // Start at world start position (boat dock)
      this.mapCoordinate = this.activeWorld.StartMap.clone()

      // First entry: use world-defined start coordinate/direction.
      // Edge-spawn is only for explicit map-edge returns.
      const spawnEdge = this.game.mulle.seaSpawnEdge
      if (spawnEdge) {
        this.spawnBoatFromEdge(spawnEdge)
        this.game.mulle.seaSpawnEdge = null
      } else {
        this.driveBoat.position.copyFrom(this.activeWorld.StartCoordinate)
        this.driveBoat.setDirection(this.activeWorld.StartDirection || 1)

        if (this.boatSprite) {
          this.boatSprite.position.copyFrom(this.driveBoat.position)
          this.setBoatSpriteDirection(Math.ceil(this.driveBoat.direction / 2))
        }
      }

      // Lingo equivalent: changeMap(gDir, mapCoordinate, #Absolute)
      // theRealInit is VOID here, so topology/object pass runs.
      this.changeMap(this.mapCoordinate, true, undefined)
      this._logStartTopology('post-changeMap')
    }

    // Start in direct sailing mode (Lingo parity)
    this.startDrivingMode()

    // BUG FIX #6: Mission 14/15 Random Erson Assignment - First Sailing Trip
    // On first sailing trip, randomly assign mission 14 (Haven/Peggy) or 15 (Erson diving)
    // Original Lingo: if first time then randomly pick mission 14 or 15
    const user = this.game.mulle.user
    if (user && !user.Boat.hasCache('#FirstSeaTripMissionAssigned')) {
      const randomMission = Math.random() < 0.5 ? 14 : 15
      console.log('[SeaWorld] First sailing trip - randomly assigned mission', randomMission)

      // Mark which mission was randomly selected
      if (randomMission === 14) {
        user.Boat.addCache('#RandomMission14')
      } else {
        user.Boat.addCache('#RandomMission15')
      }

      // Mark that we've done the first-time assignment
      user.Boat.addCache('#FirstSeaTripMissionAssigned')
      user.save()
    }

    // Start in direct sailing mode (Lingo parity)
    this.startDrivingMode()

    // === HOTKEYS ===

    // Hotkey W for world select (switch between car/boat worlds)
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      console.log('[SeaWorld] Hotkey W - going to world select')
      this.game.state.start('worldselect')
    })

    // Hotkey C for credits
    const cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C)
    cKey.onDown.add(() => {
      this.game.state.start('credits')
    })

    // Hotkey B for Belly snacks
    const bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B)
    bKey.onDown.add(() => {
      this.consumeBellySnack()
    })

    console.log('[SeaWorld] Scene created - direct sailing mode')
  }

  /**
   * Change to a different sea map tile
   * Similar to WorldState.changeMap for cars
   * @param {Phaser.Point} pos - Map coordinate or offset
   * @param {boolean} absolute - Whether pos is absolute or relative
   * @param {boolean} realInit - Mirrors Lingo theRealInit flag; when set,
   *                             skip topology/object pass (Dir.ls line 207)
   * @returns {boolean} True if map change succeeded
   */
  changeMap(pos, absolute = false, realInit) {
    console.log('[SeaWorld] Change map', pos, absolute ? 'absolute' : 'relative')
    // Original Lingo (05/Dir.ls line 169-182):
    // - Resolve map via getNewMapId(world, point, #Relational/#Absolute)
    // - Update mapCoordinate only when MapId is valid
    const mode = absolute ? '#Absolute' : '#Relational'
    const point = new Phaser.Point(pos.x, pos.y)
    const newMapId = this.activeWorld ? this.activeWorld.getNewMapId(point, mode, false) : null

    if (!Number.isInteger(newMapId)) {
      console.log('[SeaWorld] Invalid position for mode', mode, 'point', point)
      return false
    }

    // Keep scene and world mapCoordinate in sync with getNewMapId side-effect.
    this.mapCoordinate = this.activeWorld.currentMap.clone()

    const newX = this.mapCoordinate.x
    const newY = this.mapCoordinate.y

    // Load current map using resolved coordinates (1-based world grid)
    var map = this.activeWorld ? this.activeWorld.getMap(newX, newY) : null
    var topName = `sea_top_${newX}_${newY}`

    console.log('[SeaWorld] Map coordinates', newX, newY, map ? 'MapId:' + map.MapId : '')

    // Lingo reference (05/Dir.ls lines 190-206):
    // tmpWindSpeedFactor = getSpecial(map, #windspeed)
    // tmpFog = getSpecial(map, #Fog)
    // if tmpFog then
    //   changeMap(weatherRenderer, #hide, tmpWindSpeedFactor)
    //   map sprite = Dummy, Fog sprite = FogPic
    // else
    //   changeMap(weatherRenderer, VOID, tmpWindSpeedFactor)
    //   map sprite = getMapImage(map)
    //   underMap sprite = getUnderMapImage(map) or Dummy
    //   Fog sprite = Dummy
    // end if
    if (map && map.MapImage) {
      const tmpWindSpeedFactor = map.getSpecial ? (map.getSpecial('#windspeed') || map.getSpecial('#WindSpeed')) : null
      const tmpFog = map.getSpecial ? map.getSpecial('#Fog') : null

      if (tmpFog) {
        if (this.weather && this.weather.changeMap) {
          this.weather.changeMap('hide', tmpWindSpeedFactor)
        }

        if (this.seaBackground && typeof this.seaBackground.setDirectorMember === 'function') {
          this.seaBackground.setDirectorMember('Dummy')
        }

        if (this.seaMapSprite) {
          this.seaMapSprite.visible = false
        }
        this.createFogLayer()
      } else {
        if (this.weather && this.weather.changeMap) {
          this.weather.changeMap(undefined, tmpWindSpeedFactor)
        }

        if (this.seaBackground && typeof this.seaBackground.setDirectorMember === 'function') {
          // Lingo: set member of #Water to "Weather1" (boten_05.DXR).
          this.seaBackground.setDirectorMember('boten_05.DXR', 'Weather1')
        }

        this.updateBackgroundFromMap(map)

        if (this.seaMapSprite) {
          this.seaMapSprite.visible = true
        }

        const tmpUnder = map.getUnderMapImage ? map.getUnderMapImage() : null
        if (typeof tmpUnder === 'string') {
          this.updateUnderMapLayer(tmpUnder)
        } else {
          this.removeUnderMapLayer()
        }

        this.removeFogLayer()
      }
    } else if (this.seaMapSprite) {
      try {
        this.seaMapSprite.setDirectorMember('boten_80.DXR', (newX + newY * 3) % 3 + 1)
      } catch (e) {
        console.warn('[SeaWorld] Could not load sea map sprite')
      }
    }

    // Original Dir.ls line 207-214:
    // if voidp(theRealInit) then setTopology + goThroughObjects + corrected position
    if (realInit === undefined || realInit === null) {
      // Original Dir.ls line 208: setTopology(boat, getTopology(map))
      // Prefer map.Topology from extracted tile data; fallback to generated coordinate key.
      const topologyName = map && typeof map.Topology === 'string' ? map.Topology : topName
      this.updateTopology(topologyName)

      // Clear and recreate map objects for this tile (goThroughObjects equivalent)
      this.clearMapObjects()
      this.createMapObjectsForTile(newX, newY)
    }

    // mapCoordinate/currentMap already set by getNewMapId in #Relational/#Absolute mode.

    // Update minimap
    this.updateMinimap()

    return true
  }

  /**
   * Update background from map data
   * @param {MulleSeaMap} map - Map tile data
   */
  updateBackgroundFromMap(map) {
    if (!(this.seaMapSprite instanceof MulleSprite)) {
      if (this.seaMapSprite) this.seaMapSprite.destroy()
      const mapLoc = this._getSeaMapLoc()
      this.seaMapSprite = new MulleSprite(this.game, mapLoc.x, mapLoc.y)
      this.game.add.existing(this.seaMapSprite)
    } else {
      const mapLoc = this._getSeaMapLoc()
      this.seaMapSprite.position.set(mapLoc.x, mapLoc.y)
    }

    // Prefer explicit map atlases for 30b*** tiles to avoid collisions with
    // similarly named members in unrelated atlases.
    if (map.DirFile && map.MapImage) {
      let loaded = false
      if (map.MapImage && map.MapImage.indexOf('30b') === 0) {
        const direct = this._findFrameByDirNameInAtlases(map.MapImage, ['map-sprites-0', 'map-sprites-1'])
        if (direct) {
          this.seaMapSprite.loadTexture(direct.key, direct.frame)
          loaded = true
        }
      }

      // Fallbacks: name-only, then strict dir+member.
      if (!loaded && map.MapImage) {
        loaded = this.seaMapSprite.setDirectorMember(map.MapImage)
      }
      if (!loaded && map.MapImage) {
        loaded = this.seaMapSprite.setDirectorMember('boten_CDDATA.CXT', map.MapImage)
      }
      if (!loaded && map.DirFile && map.MapImage) {
        loaded = this.seaMapSprite.setDirectorMember(map.DirFile, map.MapImage)
      }
      this.game.world.sendToBack(this.seaBackground)

      if (loaded) {
        return
      }
    }

    // Fallback to atlas frame mapping.
    const atlasKey = map.getAtlasKey()
    const frameName = map.getFrameName()
    if (this.game.cache.checkImageKey(atlasKey)) {
      this.seaMapSprite.loadTexture(atlasKey, frameName)
    }
  }

  _findFrameByDirNameInAtlases(dirName, atlasKeys) {
    for (let i = 0; i < atlasKeys.length; i++) {
      const key = atlasKeys[i]
      if (!this.game.cache.checkImageKey(key)) continue

      const img = this.game.cache.getImage(key, true)
      if (!img || !img.frameData) continue

      const frames = img.frameData.getFrames()
      for (let f = 0; f < frames.length; f++) {
        if (frames[f] && frames[f].dirName === dirName) {
          return { key, frame: frames[f].name }
        }
      }
    }

    return null
  }

  _getSeaMapLoc() {
    const mapOffset = DEFAULT_BOAT_PROPS && DEFAULT_BOAT_PROPS.mapOffset
      ? DEFAULT_BOAT_PROPS.mapOffset
      : { x: 4, y: 4 }
    const topo = TOPOLOGY || { WIDTH: 316, HEIGHT: 198 }
    return new Phaser.Point(mapOffset.x + topo.WIDTH, mapOffset.y + topo.HEIGHT)
  }

  createLingoHud() {
    this.hudGroup = this.game.add.group()
    this.hudGroup.fixedToCamera = true

    this.mapDisplayGroup = this.game.add.group()
    this.mapDisplayGroup.fixedToCamera = true
    this.mapDisplayGroup.visible = false

    // Lingo spriteList mapping (used by parity handlers)
    this.dir = this
    if (!this.spriteList) {
      this.spriteList = {
        Water: 15,
        UnderMap: 18,
        waves: 20,
        map: 34,
        ObjectsUnder: 36,
        boat: 42,
        Sail: 43,
        Fog: 44,
        ObjectsOver: 45,
        Stroot: 64,
        BoatTypes: 65,
        HelpButton: 68,
        fuel: 72,
        TRANS: 75,
        MapOverview: 79,
        medal: 91,
        dialog: 91,
        DialogOverlay: 92,
        ToolBox: 106
      }
    }
    if (!this._spriteInstances) this._spriteInstances = {}

    // Dialog + overlay sprites (DialogOverlay uses 9 consecutive channels)
    this.dialogSprite = new MulleSprite(this.game, 320, 240)
    this.dialogSprite.setDirectorMember('Dummy')
    this.dialogSprite.fixedToCamera = true
    this.hudGroup.add(this.dialogSprite)
    this._spriteInstances[this.spriteList.dialog] = this.dialogSprite

    this.dialogOverlaySprites = []
    for (let i = 0; i < 9; i++) {
      const sp = new MulleSprite(this.game, 320, 240)
      sp.setDirectorMember('Dummy')
      sp.fixedToCamera = true
      this.hudGroup.add(sp)
      this.dialogOverlaySprites.push(sp)
      this._spriteInstances[this.spriteList.DialogOverlay + i] = sp
    }
    this.dialogOverlaySprite = this.dialogOverlaySprites[0]

    // Help button (BehaviorScript 175 - HelpBH.ls)
    this.helpButtonSprite = new MulleSprite(this.game, 605, 430)
    if (this.helpButtonSprite.setDirectorMember('HelpButton')) {
      this.helpButtonSprite.inputEnabled = true
      this.helpButtonSprite.events.onInputOver.add(() => {
        this.helpButtonSprite.setDirectorMember('HelpButton-hi')
      })
      this.helpButtonSprite.events.onInputOut.add(() => {
        this.helpButtonSprite.setDirectorMember('HelpButton')
      })
      this.helpButtonSprite.events.onInputUp.add(() => {
        if (this.game && this.game.state && this.game.state.states && this.game.state.states.help) {
          this.game.state.start('help')
        }
      })
      this.hudGroup.add(this.helpButtonSprite)
    }

    // MapDisplay overlay channels: SP (map), SP+1 (rollover pic), SP+2 (boat marker)
    this.mapDisplaySprite = new MulleSprite(this.game, 320, 240)
    // this.mapDisplaySprite.setDirectorMember('Dummy') // Fixed: 'Dummy' sprite key not found
    this.mapDisplayGroup.add(this.mapDisplaySprite)

    this.mapDisplayPicSprite = new MulleSprite(this.game, 320, 240)
    // this.mapDisplayPicSprite.setDirectorMember('Dummy') // Fixed: 'Dummy' sprite key not found
    this.mapDisplayGroup.add(this.mapDisplayPicSprite)

    // Map marker (SP+2) - prefer original "Dot" sprite if available
    this.mapDisplayMarkerSprite = new MulleSprite(this.game, 0, 0)
    if (this.mapDisplayMarkerSprite.setDirectorMember('Dot')) {
      // Dot is 1x1; scale up to match previous visible marker size (≈8px)
      this.mapDisplayMarkerSprite.scale.setTo(8, 8)
    } else {
      // Fallback to simple graphics marker
      this.mapDisplayMarkerSprite.destroy()
      this.mapDisplayMarkerSprite = this.game.add.graphics(0, 0)
      this.mapDisplayMarkerSprite.beginFill(0xffcc00, 1)
      this.mapDisplayMarkerSprite.drawCircle(0, 0, 8)
      this.mapDisplayMarkerSprite.endFill()
    }
    this.mapDisplayMarkerSprite.visible = false
    this.mapDisplayGroup.add(this.mapDisplayMarkerSprite)

    this.mapDisplayController = new MapDisplay(this)
    this.mapDisplayController.globals = {
      world: {
        getId: () => 'Da hood',
        getWorldSize: () => (this.activeWorld && this.activeWorld.getWorldSize
          ? this.activeWorld.getWorldSize()
          : new Phaser.Point(6, 4))
      },
      user: this.game.mulle.user
    }

    this.mulleTalkObject = this.game.mulle.mulleTalkObject || {
      say: (id, ch) => this.game.mulle.playAudio(id),
      deleteSound: () => { }
    }
    this.mode = 'Driving'
    this.boat = this.driveBoat

    // Map overview button (BehaviorScript 78 - MapDisplay.ls)
    this.mapOverviewSprite = new MulleSprite(this.game, 560, 430)
    if (this.mapOverviewSprite.setDirectorMember('litenkarta')) {
      this.mapOverviewSprite.inputEnabled = true
      this.mapOverviewSprite.events.onInputOver.add(() => {
        this.mapOverviewSprite.setDirectorMember('litenkarta-hi')
      })
      this.mapOverviewSprite.events.onInputOut.add(() => {
        this.mapOverviewSprite.setDirectorMember('litenkarta')
      })
      this.mapOverviewSprite.events.onInputUp.add(() => {
        this.startMapMode()
      })
      this.hudGroup.add(this.mapOverviewSprite)
    }

    // Toolbox tab (spriteList #ToolBox)
    this.toolboxSprite = new MulleSprite(this.game, 640, 440)
    if (!this.toolboxSprite.setDirectorMember('00.CXT', 97)) {
      this.toolboxSprite.setDirectorMember('Dummy')
    }
    this.toolboxSprite.inputEnabled = true
    if (this.toolboxSprite.input) this.toolboxSprite.input.useHandCursor = false
    this.toolboxSprite.events.onInputOver.add(() => {
      if (this.toolboxController) this.toolboxController.mouseEnter()
    })
    this.toolboxSprite.events.onInputOut.add(() => {
      if (this.toolboxController) this.toolboxController.mymouseLeave()
    })
    this.toolboxSprite.events.onInputUp.add(() => {
      if (this.toolboxController) this.toolboxController.mouseUp()
    })
    this.toolboxController = new ToolBoxBH(
      this.toolboxSprite,
      this,
      this.game.mulle ? this.game.mulle.gMulleGlobals : null,
      this.game.mulle ? this.game.mulle.sound : null,
      '05'
    )
    this.hudGroup.add(this.toolboxSprite)

    // Lingo meters (speed, hunger, fuel) - score channel sprites
    this.speedMeter = new MeterScript(
      HUD_LAYERS.SPEED,
      700,
      { dirFile: 'boten_05.DXR', member: HUD_ASSETS.SPEED },
      25,
      this.game
    )
    this.hungerMeter = new MeterScript(
      HUD_LAYERS.HUNGER,
      10000,
      { dirFile: 'boten_05.DXR', member: HUD_ASSETS.HUNGER },
      4,
      this.game
    )
    this.fuelMeter = new MeterScript(
      HUD_LAYERS.FUEL,
      1,
      { dirFile: 'boten_05.DXR', member: HUD_ASSETS.FUEL },
      13,
      this.game
    )

    this._applyHudPosition(this.speedMeter, HUD_POSITIONS.SPEED)
    this._applyHudPosition(this.hungerMeter, HUD_POSITIONS.HUNGER)
    this._applyHudPosition(this.fuelMeter, HUD_POSITIONS.FUEL)

    if (this.speedMeter?.sprite) this.hudGroup.add(this.speedMeter.sprite)
    if (this.hungerMeter?.sprite) this.hudGroup.add(this.hungerMeter.sprite)
    if (this.fuelMeter?.sprite) this.hudGroup.add(this.fuelMeter.sprite)

    this.game.world.bringToTop(this.hudGroup)
    this.game.world.bringToTop(this.mapDisplayGroup)
  }

  _applyHudPosition(meter, pos) {
    if (!meter || !meter.sprite || !pos) return
    meter.sprite.fixedToCamera = true
    if (meter.sprite.position && typeof meter.sprite.position.set === 'function') {
      meter.sprite.position.set(pos.x, pos.y)
    } else {
      meter.sprite.x = pos.x
      meter.sprite.y = pos.y
    }
  }

  startMapMode() {
    if (!this.mapDisplayController) return

    this.mapDisplayController.mouseUp()
    this.mode = this.mapDisplayController.displaying ? 'Waiting' : 'Driving'
    this.mapDisplayGroup.visible = this.mapDisplayController.displaying
    this.syncMapDisplayVisuals()
  }

  syncMapDisplayVisuals() {
    if (!this.mapDisplayController || !this.mapDisplayGroup) return

    const c = this.mapDisplayController
    this.mapDisplayGroup.visible = !!c.displaying

    if (!c.displaying) {
      this._destroyMapDisplayHotspots()
      this._applyMapDisplayMember(this.mapDisplaySprite, 'Dummy')
      this._applyMapDisplayMember(this.mapDisplayPicSprite, 'Dummy')
      this.mapDisplayMarkerSprite.visible = false
      return
    }

    if (!this.mapDisplayHotspots || this.mapDisplayHotspots.length !== c.mouseObjects.length) {
      this._rebuildMapDisplayHotspots()
    }

    this._applyMapDisplayMember(this.mapDisplaySprite, c.mapMember || 'Dummy')
    this._applyMapDisplayMember(this.mapDisplayPicSprite, c.picMember || 'Dummy')

    if (c.markerLoc && Number.isFinite(c.markerLoc.x) && Number.isFinite(c.markerLoc.y)) {
      this.mapDisplayMarkerSprite.visible = true
      this.mapDisplayMarkerSprite.position.set(c.markerLoc.x, c.markerLoc.y)
    } else {
      this.mapDisplayMarkerSprite.visible = false
    }
  }

  _applyMapDisplayMember(sprite, member) {
    if (!sprite || !sprite.setDirectorMember) return

    if (!member || member === 'Dummy') {
      sprite.setDirectorMember('Dummy')
      return
    }

    if (typeof member === 'object' && member.dirFile && member.member !== undefined) {
      sprite.setDirectorMember(member.dirFile, member.member)
      return
    }

    if (typeof member === 'number') {
      sprite.setDirectorMember('boten_05.DXR', member)
      return
    }

    sprite.setDirectorMember(member)
  }

  _rebuildMapDisplayHotspots() {
    this._destroyMapDisplayHotspots()
    this.mapDisplayHotspots = []

    if (!this.mapDisplayController || !this.mapDisplayController.mouseObjects) return

    this.mapDisplayController.mouseObjects.forEach((obj) => {
      const r = obj.rect
      const hs = this.game.add.graphics(0, 0)
      hs.beginFill(0x000000, 0)
      hs.drawRect(r.left, r.top, r.right - r.left, r.bottom - r.top)
      hs.endFill()
      hs.alpha = 0.01
      hs.inputEnabled = true
      hs.events.onInputOver.add(() => {
        this.mapDisplayController.mouse(obj, 'enter')
        this.syncMapDisplayVisuals()
      })
      hs.events.onInputOut.add(() => {
        this.mapDisplayController.mouse(obj, 'Leave')
        this.syncMapDisplayVisuals()
      })
      this.mapDisplayGroup.add(hs)
      this.mapDisplayHotspots.push(hs)
    })
  }

  _destroyMapDisplayHotspots() {
    if (!this.mapDisplayHotspots) return
    this.mapDisplayHotspots.forEach((h) => {
      if (h && typeof h.destroy === 'function') h.destroy()
    })
    this.mapDisplayHotspots = []
  }

  /**
   * Update topology bitmap from sprite
   * @param {string} topName - Topology frame name
   */
  updateTopology(topName) {
    if (!this.topBitmap) return
    this._currentTopologyName = topName

    // Original DepthChecker behavior: "30t999v0" means inactive topology
    // (open water, no depth/collision checks from topology bitmap).
    if (topName === '30t999v0') {
      this.generateOpenWaterTopology()
      console.log('[SeaWorld] Topology set to open water:', topName)
      return
    }

    // Prefer original Topology string data (30t*.txt from CDDATA.CXT) when available.
    if (this._applyCachedTopologyBytes(topName)) {
      console.log('[SeaWorld] Topology loaded from CDDATA text:', topName)
      return
    }
    this._queueTopologyBytesLoad(topName)

    // Try to load specific topology frame
    try {
      if (this.topSprite) {
        this.topSprite.frameName = topName
      } else if (this.game.cache.checkImageKey('sea_topology')) {
        this.topSprite = this.game.add.sprite(-320, -240, 'sea_topology', topName)
        this.topSprite.smoothed = false
      }

      if (this.topSprite) {
        this.generateOpenWaterTopology()
        this.topBitmap.draw(this.topSprite, 0, 0)
        this.topBitmap.update()
        console.log('[SeaWorld] Topology updated:', topName)
      } else {
        this.generateTopologyFromSeaMapSprite()
      }
    } catch (e) {
      console.warn('[SeaWorld] Topology not found, deriving from map image:', topName)
      this.generateTopologyFromSeaMapSprite()
    }
  }

  _queueTopologyBytesLoad(topName) {
    if (typeof fetch !== 'function') return
    if (!this._topologyBytesCache) this._topologyBytesCache = new Map()
    if (!this._pendingTopologyLoads) this._pendingTopologyLoads = new Map()
    if (this._topologyBytesCache.has(topName) || this._pendingTopologyLoads.has(topName)) return

    const promise = this._loadTopologyBytes(topName)
      .then((bytes) => {
        if (!bytes || !this.topBitmap) return
        if (this._currentTopologyName !== topName) return
        if (this._applyTopologyBytes(bytes)) {
          console.log('[SeaWorld] Topology updated from CDDATA text:', topName)
        }
      })
      .catch((err) => {
        console.warn('[SeaWorld] Failed to load topology bytes:', topName, err)
      })
      .finally(() => {
        if (this._pendingTopologyLoads) this._pendingTopologyLoads.delete(topName)
      })

    this._pendingTopologyLoads.set(topName, promise)
  }

  _applyCachedTopologyBytes(topName) {
    if (!this._topologyBytesCache || !this._topologyBytesCache.has(topName)) return false
    const bytes = this._topologyBytesCache.get(topName)
    return this._applyTopologyBytes(bytes)
  }

  async _loadTopologyBytes(topName) {
    if (!topName) return null
    if (!this._topologyBytesCache) this._topologyBytesCache = new Map()
    if (this._topologyBytesCache.has(topName)) return this._topologyBytesCache.get(topName)

    const part1 = await this._fetchTopologyMemberBytes(topName)
    if (!part1) return null
    const part2 = await this._fetchTopologyMemberBytes(`${topName}-2`)
    const part2Bytes = part2 || new Uint8Array(0)

    const combined = new Uint8Array(part1.length + part2Bytes.length)
    combined.set(part1, 0)
    combined.set(part2Bytes, part1.length)
    this._topologyBytesCache.set(topName, combined)
    return combined
  }

  async _fetchTopologyMemberBytes(memberName) {
    if (typeof fetch !== 'function') return null
    const memberMap = await this._getTopologyMemberMap()
    const castId = memberMap ? memberMap[memberName] : null
    if (!castId) return null

    const url = `assets/boten/CDDATA.CXT/Standalone/${castId}.txt`
    const res = await fetch(url)
    if (!res.ok) return null

    const buf = await res.arrayBuffer()
    return new Uint8Array(buf)
  }

  async _getTopologyMemberMap() {
    if (this._topologyMemberMap) return this._topologyMemberMap
    if (this._topologyMemberMapPromise) return this._topologyMemberMapPromise
    if (typeof fetch !== 'function') return {}

    const url = 'assets/boten/CDDATA.CXT/metadata.json'
    this._topologyMemberMapPromise = fetch(url)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!json || !json.libraries) return {}
        const out = {}
        for (const lib of json.libraries) {
          const members = lib && lib.members ? lib.members : null
          if (!members) continue
          for (const castNum of Object.keys(members)) {
            const member = members[castNum]
            if (!member || typeof member.name !== 'string') continue
            if (member.name.startsWith('30t')) {
              out[member.name] = castNum
            }
          }
        }
        return out
      })
      .catch((err) => {
        console.warn('[SeaWorld] Failed to load topology member map:', err)
        return {}
      })
      .finally(() => {
        this._topologyMemberMapPromise = null
      })

    this._topologyMemberMap = await this._topologyMemberMapPromise
    return this._topologyMemberMap
  }

  _applyTopologyBytes(bytes) {
    if (!this.topBitmap || !bytes) return false
    const expected = 316 * 198
    const normalized = (bytes instanceof Uint8Array) ? bytes : new Uint8Array(bytes)
    if (normalized.length < expected) {
      console.warn('[SeaWorld] Topology bytes too short:', bytes.length, 'expected', expected)
      return false
    }

    const data = this.topBitmap.imageData.data
    const limit = Math.min(expected, normalized.length)
    for (let i = 0; i < limit; i++) {
      const v = normalized[i]
      const idx = i * 4
      data[idx] = v
      data[idx + 1] = 0
      data[idx + 2] = 0
      data[idx + 3] = 255
    }

    this.topBitmap.context.putImageData(this.topBitmap.imageData, 0, 0)
    this.topBitmap.dirty = true
    // Mark this bitmap as Lingo-style text/binary topology (DepthChecker rules).
    this.topBitmap.isTextTopology = true
    // Keep raw bytes so depth checks don't depend on bitmap readback.
    this.topBitmap.byteArray = normalized
    this._logStartTopology('topology-bytes')
    if (this._pendingSessionStartValidation) {
      this._pendingSessionStartValidation = false
      this._validateBoatStart('session')
    }
    return true
  }

  _validateBoatStart(tag) {
    if (!this.driveBoat || !this.topBitmap || !this.activeWorld) return false
    if (this.topBitmap.isTextTopology !== true) return false

    const pos = this.driveBoat.position || this.driveBoat
    if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') return false

    const depthCheck = this.driveBoat.checkDepthAtCorners
      ? this.driveBoat.checkDepthAtCorners(new Phaser.Point(pos.x, pos.y), [new Phaser.Point(0, 0)])
      : null

    const invalid = depthCheck === 'Hit' || depthCheck === 1
    if (!invalid) return false

    console.warn('[SeaWorld] Invalid boat start (' + tag + ') - resetting to world start.')

    this.mapCoordinate = this.activeWorld.StartMap.clone()
    this.driveBoat.position.copyFrom(this.activeWorld.StartCoordinate)
    if (typeof this.driveBoat.setDirection === 'function') {
      this.driveBoat.setDirection(this.activeWorld.StartDirection || 1)
    } else {
      this.driveBoat.direction = this.activeWorld.StartDirection || 1
    }
    if (this.boatSprite) {
      this.boatSprite.position.copyFrom(this.driveBoat.position)
      this.setBoatSpriteDirection(Math.ceil(this.driveBoat.direction / 2))
    }

    // Re-run map setup at the corrected coordinate.
    this.changeMap(this.mapCoordinate, true, undefined)

    return true
  }

  _logStartTopology(tag) {
    if (this._startTopologyLogged) return
    if (!this.driveBoat || !this.topBitmap) return

    const pos = this.driveBoat.position || this.driveBoat
    const x = typeof pos.x === 'number' ? pos.x : 0
    const y = typeof pos.y === 'number' ? pos.y : 0

    let topoCoord = null
    if (this.driveBoat && typeof this.driveBoat.getTopologyCoord === 'function') {
      topoCoord = this.driveBoat.getTopologyCoord(new Phaser.Point(x, y))
    } else {
      const mapOffset = this.driveBoat.mapOffset || { x: 4, y: 4 }
      topoCoord = new Phaser.Point(
        Math.round((x - mapOffset.x) / 2),
        Math.round((y - mapOffset.y) / 2)
      )
    }

    let topoValue = null
    if (this.topBitmap && typeof this.topBitmap.getPixel === 'function') {
      const pix = this.topBitmap.getPixel(topoCoord.x, topoCoord.y)
      topoValue = pix ? pix.r : null
    }

    console.log('[SeaWorld] Start topology check (' + tag + '):', {
      start: { x, y },
      topoCoord: { x: topoCoord.x, y: topoCoord.y },
      topoValue,
      isTextTopology: !!this.topBitmap.isTextTopology
    })

    if (this.topBitmap.isTextTopology) {
      this._startTopologyLogged = true
    }
  }

  generateTopologyFromSeaMapSprite() {
    if (!this.topBitmap || !this.seaMapSprite) {
      this.generateOpenWaterTopology()
      return
    }

    try {
      const probe = this.game.make.bitmapData(316, 198)
      const mapOffset = DEFAULT_BOAT_PROPS && DEFAULT_BOAT_PROPS.mapOffset
        ? DEFAULT_BOAT_PROPS.mapOffset
        : { x: 4, y: 4 }
      // Align map image to topology origin (0,0) by subtracting mapOffset.
      probe.draw(this.seaMapSprite, -mapOffset.x, -mapOffset.y, 316, 198)
      const src = probe.context.getImageData(0, 0, 316, 198).data

      for (let y = 0; y < 198; y++) {
        for (let x = 0; x < 316; x++) {
          const i = (y * 316 + x) * 4
          const r = src[i]
          const g = src[i + 1]
          const b = src[i + 2]
          const a = src[i + 3]

          let terrain = 25
          if (a < 16) {
            terrain = 245
          } else if ((r > 100 && g > 80 && b < 110) || (r > 120 && b < 90)) {
            terrain = 245
          } else if (b < 70 && g < 90) {
            terrain = 180
          } else if (b < 95) {
            terrain = 120
          }

          this.topBitmap.setPixel(x, y, terrain, 0, 0, false)
        }
      }

      this.topBitmap.context.putImageData(this.topBitmap.imageData, 0, 0)
      this.topBitmap.dirty = true
      // Generated from RGB sea map; use RGB terrain rules.
      this.topBitmap.isTextTopology = false
      this.topBitmap.byteArray = null
      console.log('[SeaWorld] Topology derived from map image')
    } catch (e) {
      console.warn('[SeaWorld] Topology derivation failed, using open water:', e)
      this.generateOpenWaterTopology()
    }
  }

  /**
   * Generate open-water topology (equivalent to inactive 30t999v0 in Lingo)
   */
  generateOpenWaterTopology() {
    if (!this.topBitmap) return

    for (let y = 0; y < 198; y++) {
      for (let x = 0; x < 316; x++) {
        // Deep water everywhere (R=25), no special current.
        this.topBitmap.setPixel(x, y, 25, 0, 0, false)
      }
    }

    this.topBitmap.context.putImageData(this.topBitmap.imageData, 0, 0)
    this.topBitmap.dirty = true
    // Procedural/open water uses RGB terrain rules.
    this.topBitmap.isTextTopology = false
    this.topBitmap.byteArray = null
  }

  /**
   * Generate default sea topology if no specific one exists
   * Creates a simple sea with shore borders
   */
  generateDefaultTopology() {
    if (!this.topBitmap) return

    // Generate procedural topology
    // Shore on edges, deep water in center, some shallow areas
    for (let y = 0; y < 198; y++) {
      for (let x = 0; x < 316; x++) {
        let terrainValue = 25  // Default: deep water

        // Shore on edges (impassable)
        const edgeMargin = 10
        if (x < edgeMargin || x > 316 - edgeMargin || y < edgeMargin || y > 198 - edgeMargin) {
          terrainValue = 245  // Shore
        }
        // Shallow water near shore
        else if (x < edgeMargin * 2 || x > 316 - edgeMargin * 2 || y < edgeMargin * 2 || y > 198 - edgeMargin * 2) {
          terrainValue = 120  // Shallow
        }
        // Some random reefs
        else if (Math.random() < 0.005) {
          terrainValue = 180  // Reef
        }
        // Random shallow patches
        else if (Math.random() < 0.02) {
          terrainValue = 110  // Shallow water
        }
        // Occasional current zones
        else if (Math.random() < 0.01) {
          terrainValue = 210  // Strong current
        }

        // Set pixel (R = terrain, G = current direction if applicable, B = reserved)
        const currentDir = Math.floor(Math.random() * 255)
        this.topBitmap.setPixel(x, y, terrainValue, currentDir, 0, false)
      }
    }

    this.topBitmap.context.putImageData(this.topBitmap.imageData, 0, 0)
    this.topBitmap.dirty = true
    this.topBitmap.isTextTopology = false
    this.topBitmap.byteArray = null
    console.log('[SeaWorld] Generated default topology')
  }

  /**
   * Create fog layer for fog visibility mode (#156)
   * Original: set member of sprite #Fog to member "FogPic"
   */
  createFogLayer() {
    if (this.fogLayer) return  // Already exists

    // Lingo parity: set Fog sprite to member "FogPic".
    this.fogLayer = new MulleSprite(this.game, 320, 240)
    const loaded = this.fogLayer.setDirectorMember('FogPic')
    if (!loaded) {
      this.fogLayer.visible = false
    }
    this.game.add.existing(this.fogLayer)

    console.log('[SeaWorld] Fog layer created')
  }

  /**
   * Remove fog layer
   */
  removeFogLayer() {
    if (this.fogLayer) {
      this.fogLayer.destroy()
      this.fogLayer = null
      console.log('[SeaWorld] Fog layer removed')
    }
  }

  /**
   * Update underMapImage layer (#148)
   * Original: set member of sprite #UnderMap to member tmpUnder
   * @param {string} underMapImageName - Image name for under layer
   */
  updateUnderMapLayer(underMapImageName) {
    if (!underMapImageName) {
      this.removeUnderMapLayer()
      return
    }

    // Create or update under map layer sprite
    if (!this.underMapSprite) {
      this.underMapSprite = new MulleSprite(this.game, 320, 240)
      this.game.add.existing(this.underMapSprite)
      // Send to back (below main map)
      this.game.world.sendToBack(this.underMapSprite)
      if (this.seaBackground) {
        this.game.world.moveDown(this.seaBackground)
      }
    }

    // Try to load the underMapImage
    this.underMapSprite.setDirectorMember('boten_80.DXR', underMapImageName)

    console.log('[SeaWorld] UnderMap layer updated:', underMapImageName)
  }

  /**
   * Remove underMapImage layer
   */
  removeUnderMapLayer() {
    if (this.underMapSprite) {
      this.underMapSprite.destroy()
      this.underMapSprite = null
      console.log('[SeaWorld] UnderMap layer removed')
    }
  }

  /**
   * Clear map objects when changing tiles
   */
  clearMapObjects() {
    if (!this.mapObjects) return

    // Lingo Dir.ls line 222-224: kill each object before clearing
    for (var i = this.mapObjects.children.length - 1; i >= 0; i--) {
      var c = this.mapObjects.children[i]
      if (c) {
        // Lingo: kill(tmpObj) cleans up talk references and ancestor
        if (typeof c.kill === 'function') {
          c.kill()
        }
        this.mapObjects.remove(c, true)
      }
    }
  }

  /**
   * Create map objects for a specific tile (buoys, rocks, etc)
   * Handles:
   * - Position correction zones (#152) - #Correct type objects
   * - Object conditional display (#155) - checkFor, ifFound properties
   * - Object radius checking (#153) - #EnterInnerRadius, #ExitOuterRadius
   * - Random destinations (#150) - #rdest type
   */
  createMapObjectsForTile(x, y) {
    const mapDef = this.activeWorld ? this.activeWorld.getMap(x, y) : null

    // Dir.ls line 227-236: clear object sprite slots before object iteration,
    // even when no objects exist on this tile.
    this._clearObjectSpriteSlots()

    if (!mapDef || !mapDef.objects) {
      console.log('[SeaWorld] No map objects for tile', x, y)
      return
    }

    console.log('[SeaWorld] Creating map objects for tile', x, y, 'objects:', mapDef.objects.length)

    // Get random destinations for this world
    const rDests = this.activeWorld ? this.activeWorld.rDests : {}

    // Get boat position for position correction checks
    const boatPos = this.driveBoat ? this.driveBoat.position : new Phaser.Point(320, 240)

    // Track corrected position (if any #Correct type object applies)
    let correctedBoatLoc = null

    // Dir.ls line 238-239: per-pass sprite channel counters (max 6 each)
    let tmpSPCounterUnder = 0
    let tmpSPCounterOver = 0
    const maxSPUnder = 6
    const maxSPOver = 6
    const tmpSPUnder = this.dir && this.dir.spriteList ? this.dir.spriteList.ObjectsUnder : null
    const tmpSPOver = this.dir && this.dir.spriteList ? this.dir.spriteList.ObjectsOver : null

    mapDef.objects.forEach((obj) => {
      const objectId = obj[0]
      const objectPos = obj[1]
      const objectOpt = obj[2] || {}

      // Get object definition from database (car + sea fallback)
      const objectDef = this._resolveObjectDefinition(objectId, objectOpt)
      if (!objectDef) {
        console.log('[SeaWorld] Missing object definition, skipping', objectId)
        return
      }
      const objectType = objectDef ? objectDef.type : null

      let shouldCreate = false

      // Handle random destinations (#150)
      if (objectType === '#rdest') {
        // Only show if this tile is assigned for this rdest
        const tmpInMap = rDests[objectId]
        if (!tmpInMap || !this.mapCoordinate || tmpInMap.x !== this.mapCoordinate.x || tmpInMap.y !== this.mapCoordinate.y) {
          shouldCreate = false
          console.log('[SeaWorld] Hiding rdest', objectId, '- not on this tile')
        } else {
          shouldCreate = true
        }
      }

      // Handle position correction zones (#152)
      if (objectType === '#Correct') {
        // Lingo Dir.ls line 273 BUG: sets "correctedCarLoc" (local) instead of
        // "correctedBoatLoc" (parent scope). The parent changeMap reads
        // correctedBoatLoc on line 211, so the correction NEVER applies.
        // We replicate this bug for faithful parity — do NOT set correctedBoatLoc.
        // The distance check is performed but the result is discarded.
        const tmpDiff = new Phaser.Point(
          boatPos.x - objectPos.x,
          boatPos.y - objectPos.y
        )
        const tmpHypo = Math.sqrt(tmpDiff.x * tmpDiff.x + tmpDiff.y * tmpDiff.y)

        const tmpRadius = objectOpt.InnerRadius || 80
        if (tmpHypo < tmpRadius) {
          // Lingo: set correctedCarLoc to tmpObjectLoc  (dead variable)
          console.log('[SeaWorld] Position correction detected but NOT applied (Lingo correctedCarLoc bug):', objectPos)
        }

        // Don't create visual for Correct objects
        shouldCreate = false
      } else if (objectType !== '#rdest') {
        // Original Dir.ls line 276: all non-rdest/non-Correct objects are shown
        shouldCreate = true
      }

      // Create map object if not filtered out
      if (shouldCreate) {
        const objectOptWithSlots = { ...objectOpt }
        if (Number.isInteger(tmpSPOver)) {
          objectOptWithSlots.OverSP = tmpSPOver + tmpSPCounterOver
        }
        if (Number.isInteger(tmpSPUnder)) {
          objectOptWithSlots.UnderSP = tmpSPUnder + tmpSPCounterUnder
        }

        this.addMapObject(objectId, objectPos, {
          ...objectOptWithSlots,
          _tmpSPCounterOver: tmpSPCounterOver,
          _tmpSPCounterUnder: tmpSPCounterUnder,
          _objectDef: objectDef // Pass already resolved def
        })

        // Dir.ls line 283-289: read getSpritesInfo from the object AFTER init
        const spriteInfo = objectDef && objectDef.SpriteInfo ? objectDef.SpriteInfo : null
        const overCount = this._getSpriteInfoCount(spriteInfo, 'over')
        const underCount = this._getSpriteInfoCount(spriteInfo, 'Under')
        tmpSPCounterOver += overCount
        tmpSPCounterUnder += underCount
      }
    })

    // Apply position correction if found (#152)
    if (correctedBoatLoc && this.driveBoat) {
      this._applyCorrectedBoatLocation(correctedBoatLoc)
      console.log('[SeaWorld] Boat position corrected to:', correctedBoatLoc)
    }
  }

  /**
   * Unified MapObject factory
   * @param {number} objectId - Object ID
   * @param {Object} pos - Position {x, y}
   * @param {Object} opt - Optional data
   * @returns {MulleMapObject|null} Created object
   */
  addMapObject(objectId, pos, opt = {}) {
    const MulleMapObject = require('../objects/mapobject').default
    const mapObject = new MulleMapObject(this.game, objectId, pos, opt)
    mapObject.state = this

    // Handle initialization if needed
    if (typeof mapObject.init === 'function') {
      const boatPos = this.driveBoat ? this.driveBoat.position : new Phaser.Point(0, 0)
      const showIt = mapObject.init(
        opt._tmpSPCounterOver || 0,
        opt._tmpSPCounterUnder || 0,
        boatPos,
        boatPos
      )
      if (!showIt) {
        if (typeof mapObject.destroy === 'function') {
          mapObject.destroy()
        } else if (typeof mapObject.kill === 'function') {
          mapObject.kill()
        }
        return null
      }
    }

    if (this.mapObjects) {
      this.mapObjects.add(mapObject)
    } else {
      this.game.add.existing(mapObject)
    }

    console.log('[SeaWorld] MapObject added:', objectId, 'at', pos)
    return mapObject
  }

  _applyCorrectedBoatLocation(correctedBoatLoc) {
    // Dir.ls line 211-213: setCoordinate(boat, correctedBoatLoc, #AdjustTopo)
    if (this.driveBoat && typeof this.driveBoat.setCoordinate === 'function') {
      this.driveBoat.setCoordinate(correctedBoatLoc, 'AdjustTopo')
    } else if (this.driveBoat && this.driveBoat.position && typeof this.driveBoat.position.copyFrom === 'function') {
      this.driveBoat.position.copyFrom(correctedBoatLoc)
    }

    if (this.boatSprite && this.boatSprite.position && typeof this.boatSprite.position.copyFrom === 'function') {
      this.boatSprite.position.copyFrom(correctedBoatLoc)
    }
  }

  _clearObjectSpriteSlots() {
    if (!this.dir || !this.dir.spriteList) return
    if (!this.dir._spriteMembers) this.dir._spriteMembers = {}

    const underStart = this.dir.spriteList.ObjectsUnder
    const overStart = this.dir.spriteList.ObjectsOver
    const maxSlots = 6

    if (Number.isInteger(underStart)) {
      for (let i = 0; i < maxSlots; i++) {
        this.dir._spriteMembers[underStart + i] = 'Dummy'
      }
    }

    if (Number.isInteger(overStart)) {
      for (let i = 0; i < maxSlots; i++) {
        this.dir._spriteMembers[overStart + i] = 'Dummy'
      }
    }
  }

  _getSpriteInfoCount(spriteInfo, key) {
    // Lingo Object.fromList line 262-264: default spriteInfo is [#Under: 1]
    // when no spriteInfo property exists on the object definition.
    if (!spriteInfo || typeof spriteInfo !== 'object') {
      return key === 'Under' || key === 'under' || key === 'UNDER' ? 1 : 0
    }
    if (typeof spriteInfo[key] === 'number') return spriteInfo[key]

    const lowerKey = key.toLowerCase()
    if (typeof spriteInfo[lowerKey] === 'number') return spriteInfo[lowerKey]

    const upperKey = key.toUpperCase()
    if (typeof spriteInfo[upperKey] === 'number') return spriteInfo[upperKey]

    return 0
  }

  _resolveObjectDefinition(objectId, objectOpt = {}) {
    const mulle = this.game ? this.game.mulle : null
    if (!mulle) return null

    const boatObjectsDB = mulle.BoatObjectsDB || {}
    const idKey = String(objectId)

    // Sea world uses exclusively BoatObjectsDB — never car ObjectsDB
    let def = boatObjectsDB[objectId] || boatObjectsDB[idKey] || null

    if (!def) {
      def = this._createFallbackObjectDefinition(objectId, objectOpt)
    }

    // Cache resolved sea defs into BoatObjectsDB (not car ObjectsDB) to avoid pollution
    if (def && !boatObjectsDB[objectId]) {
      boatObjectsDB[objectId] = def
      if (mulle.BoatObjectsDB) {
        mulle.BoatObjectsDB[objectId] = def
      }
    }

    return def
  }

  _createFallbackObjectDefinition(objectId, objectOpt) {
    const rawFrameList = objectOpt ? objectOpt['#FrameList'] : null
    let parsedFrames = null

    if (Array.isArray(rawFrameList)) {
      parsedFrames = rawFrameList
    } else if (typeof rawFrameList === 'string') {
      try {
        const list = JSON.parse(rawFrameList)
        if (Array.isArray(list)) parsedFrames = list
      } catch (e) {
        parsedFrames = null
      }
    }

    if (!parsedFrames || parsedFrames.length === 0) {
      return null
    }

    const frame = parsedFrames[0] || 'Dummy'
    return {
      ObjectId: Number(objectId),
      type: '#custom',
      InnerRadius: typeof objectOpt.InnerRadius === 'number' ? objectOpt.InnerRadius : 25,
      OuterRadius: typeof objectOpt.OuterRadius === 'number' ? objectOpt.OuterRadius : 35,
      CustomObject: '',
      DirResource: '',
      Sounds: [],
      FrameList: {
        normal: [frame]
      },
      SetWhenDone: 0,
      CheckFor: 0,
      IfFound: 0,
      SpriteInfo: { Under: 1 }
    }
  }

  /**
   * Create the sea background
   * Lingo sets #Water to member "Weather1" (boten_05.DXR).
   */
  createBackground() {
    // Base water layer (Lingo spriteList #Water).
    this.seaBackground = new MulleSprite(this.game, 320, 240)

    let loaded = false

    loaded = this.seaBackground.setDirectorMember('boten_05.DXR', 'Weather1')

    if (!loaded) {
      console.warn('[SeaWorld] Could not load sea weather background, using Dummy')
      this.seaBackground.setDirectorMember('Dummy')
    }
    this.game.add.existing(this.seaBackground)

    // Sea map layer (Lingo spriteList #map).
    const mapLoc = this._getSeaMapLoc()
    this.seaMapSprite = new MulleSprite(this.game, mapLoc.x, mapLoc.y)
    this.game.add.existing(this.seaMapSprite)
    this.seaMapSprite.visible = true

    // Add animated waves overlay
    this.createWaves()
  }

  /**
   * Create area-specific background for sailing areas 76-79
   * Uses different background frames for each area to show unique landscapes
   * @param {number} x - Map X coordinate (1-based, 1-3)
   * @param {number} y - Map Y coordinate (1-based, 1-3)
   */
  createBackgroundForArea(x, y) {
    let frameName = '1'  // Default: 80b001v1

    // Determine which sailing area we're in based on coordinates
    // The 3x3 grid maps to specific sailing areas
    if (x === 3 && y === 1) {
      // Area 76 (Boot Show) - top right
      // Backgrounds: 76b001v1, 76b002v0
      const bgNum = Math.random() < 0.5 ? 1 : 2
      frameName = String(bgNum)
      console.log('[SeaWorld] Area 76 (Boot Show) - background:', '76b00' + bgNum + (bgNum === 1 ? '1v' : '0v'))
    } else if (x === 1 && y === 2) {
      // Area 77 (Birgit's Strand) - middle left
      // Backgrounds: 77b001v1, 77b002-008v0 (7 variants)
      const bgNum = 1 + Math.floor(Math.random() * 7)
      frameName = String(bgNum)
      console.log('[SeaWorld] Area 77 (Birgit\'s Strand) - background: 77b00' + bgNum + (bgNum === 1 ? '1v' : '0v'))
    } else if (x === 2 && y === 2) {
      // Area 78 (Kerk) - middle center
      // Backgrounds: 78b001v1, 78b002v0
      const bgNum = Math.random() < 0.5 ? 1 : 2
      frameName = String(bgNum)
      console.log('[SeaWorld] Area 78 (Kerk) - background: 78b00' + bgNum + (bgNum === 1 ? '1v' : '0v'))
    } else if (x === 1 && y === 3) {
      // Area 79 (Visser) - bottom left
      // Backgrounds: 79b001v1, 79b002-004v0 (4 variants)
      const bgNum = 1 + Math.floor(Math.random() * 4)
      frameName = String(bgNum)
      console.log('[SeaWorld] Area 79 (Visser) - background: 79b00' + bgNum + (bgNum === 1 ? '1v' : '0v'))
    } else {
      // Other areas: use default 80b001v1
      frameName = '1'
      console.log('[SeaWorld] Other area (' + x + ',' + y + ') - default background: 80b001v1')
    }

    // Update background sprite with the selected frame
    if (this.seaBackground) {
      this.seaBackground.loadTexture('seaworld-sprites-0', frameName)
    }
  }

  /**
   * Create procedural sea map background when assets not available
   */
  createProceduralSeaMap() {
    const seaGraphics = this.game.add.graphics(0, 0)

    // Sky gradient (top portion)
    for (let y = 0; y < 120; y++) {
      const skyBlue = Math.floor(135 + (y / 120) * 40)
      seaGraphics.beginFill(Phaser.Color.getColor(135, 206, skyBlue))
      seaGraphics.drawRect(0, y, 640, 1)
      seaGraphics.endFill()
    }

    // Sea gradient (main area)
    for (let y = 120; y < 480; y++) {
      const depth = (y - 120) / 360
      const r = Math.floor(20 + depth * 10)
      const g = Math.floor(80 + depth * 40)
      const b = Math.floor(160 - depth * 20)
      seaGraphics.beginFill(Phaser.Color.getColor(r, g, b))
      seaGraphics.drawRect(0, y, 640, 1)
      seaGraphics.endFill()
    }

    // Add some decorative islands/landmasses
    this.drawMapLandmasses(seaGraphics)

    this.seaBackground = seaGraphics
  }

  /**
   * Draw decorative landmasses on the sea map
   * @param {Phaser.Graphics} graphics - Graphics object to draw on
   */
  drawMapLandmasses(graphics) {
    // Top-left island (Vuurtoren area)
    graphics.beginFill(0x8B7355, 0.6)  // Brown/sand
    graphics.drawEllipse(80, 80, 60, 40)
    graphics.endFill()

    // Top-right island (Boot Show area)
    graphics.beginFill(0x8B7355, 0.6)
    graphics.drawEllipse(550, 90, 50, 35)
    graphics.endFill()

    // Bottom-left island (Birgit's beach)
    graphics.beginFill(0xD4A574, 0.6)  // Sandy beach color
    graphics.drawEllipse(70, 400, 55, 45)
    graphics.endFill()

    // Bottom-right island (Surfstrand)
    graphics.beginFill(0xD4A574, 0.6)
    graphics.drawEllipse(560, 380, 50, 40)
    graphics.endFill()

    // Dock area at bottom center
    graphics.beginFill(0x654321, 0.8)  // Dark brown dock
    graphics.drawRect(300, 440, 40, 40)
    graphics.endFill()
  }

  /**
   * Create topology layer for collision detection
   * Similar to car world's topology system
   */
  createTopology() {
    // The topology sprite is rendered off-screen and used for pixel checks
    // It's never displayed, just used for the topBitmap

    // Start with stable open-water topology.
    this.generateOpenWaterTopology()

    console.log('[SeaWorld] Topology layer created')
  }

  /**
   * Create animated wave effect
   */
  createWaves() {
    // Disable synthetic overlay waves (grey line effect).
    // Wave behavior comes from weather/waves systems and map art.
    this.waves = null
    this.waveOffset = 0
    this.waveTimer = null
  }

  /**
   * Draw wave animation
   */
  drawWaves() {
    if (!this.waves) return

    this.waves.clear()
    this.waves.lineStyle(2, 0xffffff, 0.3)

    for (let row = 0; row < 5; row++) {
      const y = 250 + row * 50
      this.waves.moveTo(0, y)

      for (let x = 0; x < 640; x += 10) {
        const waveY = y + Math.sin((x / 50) + this.waveOffset + row) * 3
        this.waves.lineTo(x, waveY)
      }
    }
  }

  /**
   * Spawn boat at a position from a specific edge using original Lingo SpawnLines
   * The SpawnLines define 16 positions around the screen edge with corresponding
   * direction vectors for natural entry into the sea world.
   * 
   * BUG FIX #5: Island Docking Position - Spawn Lines Verified
   * SpawnLines array in driveboat.js:88-105 matches original 16 positions
   * with direction vectors from original Lingo code
   * 
   * @param {string} edge - Edge to spawn from: 'north', 'south', 'east', 'west'
   *                        or diagonal: 'northeast', 'northwest', 'southeast', 'southwest'
   */
  spawnBoatFromEdge(edge) {
    // Get spawn line data for this edge
    const spawnLine = MulleDriveBoat.getSpawnLineForEdge(edge)

    // Set boat position from spawn line
    this.driveBoat.position.set(spawnLine.pos.x, spawnLine.pos.y)

    // Get the direction index that matches this spawn line's direction vector
    const direction = MulleDriveBoat.getDirectionFromSpawnLine(spawnLine)
    this.driveBoat.setDirection(direction)

    // Update visual boat sprite position and direction
    if (this.boatSprite) {
      this.boatSprite.position.set(spawnLine.pos.x, spawnLine.pos.y)
      this.setBoatSpriteDirection(Math.ceil(direction / 2)) // Convert 16-dir to 8-dir
    }

    console.log('[SeaWorld] Spawned boat from edge:', edge,
      'at', spawnLine.pos.x, spawnLine.pos.y,
      'facing direction', direction)
  }

  /**
   * Spawn boat at a specific spawn line index (0-15)
   * @param {number} index - Spawn line index (0-15, clockwise from south-southwest)
   */
  spawnBoatAtLine(index) {
    const spawnLine = MulleDriveBoat.getSpawnLine(index)

    this.driveBoat.position.set(spawnLine.pos.x, spawnLine.pos.y)
    const direction = MulleDriveBoat.getDirectionFromSpawnLine(spawnLine)
    this.driveBoat.setDirection(direction)

    if (this.boatSprite) {
      this.boatSprite.position.set(spawnLine.pos.x, spawnLine.pos.y)
      this.setBoatSpriteDirection(Math.ceil(direction / 2))
    }

    console.log('[SeaWorld] Spawned boat at line', index,
      'pos:', spawnLine.pos.x, spawnLine.pos.y)
  }

  /**
   * Create the sailing boat
   * Uses the user's built boat (MulleBuildBoat) with proper 8-directional display
   */
  createBoat() {
    // Create the drive boat controller (handles physics and movement)
    this.driveBoat = new MulleDriveBoat(this.game)
    this.driveBoat.position.set(320, 420)  // Default position, will be overridden by spawn
    this.driveBoat.state = this // Give boat reference to scene for callbacks
    this.driveBoat.enabled = false  // Disabled in map mode

    // Connect topology bitmap to boat for terrain checking
    this.driveBoat.topology = this.topBitmap

    // Lingo parity: use the driving/display boat sprite directly in SeaWorld.
    this.driveBoat.visible = true
    this.driveBoat.scale.setTo(1)
    this.game.add.existing(this.driveBoat)

    this.boatSprite = this.driveBoat

    console.log('[SeaWorld] Boat created - using driveboat sprite renderer')
  }

  /**
   * Setup 8-directional sprites for the built boat
   * The original game uses directional boat sprites during sailing
   */
  setupBoatDirectionalSprites() {
    // The boat's direction display is handled by MulleBuildBoat
    // For sailing animation, we rotate the boat sprite to face the direction
    // The driveboat handles the directional sprite frames internally

    // If the boat has specific directional frames in the atlas, use them
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    // Get boat size for correct sprite set
    const size = boat.getShipSize ? boat.getShipSize() : 'medium'

    // MulleBuildBoat is a Phaser.Group, not a single-frame sprite.
    // Keep rotation-based direction so the whole built boat rotates consistently.
    this.boatSprite.hasDirectionalSprites = false
  }

  /**
   * Update the built boat sprite to show correct direction
   * @param {number} direction - Direction 1-8 (N, NE, E, SE, S, SW, W, NW)
   */
  setBoatSpriteDirection(direction) {
    if (!this.boatSprite) return

    // DriveBoat already updates sprite frame from its 16-dir direction.
    if (this.boatSprite === this.driveBoat) {
      return
    }

    if (this.boatSprite.hasDirectionalSprites) {
      // Use frame from seaworld-sprites-0 based on direction
      // Frames 6-13 are the 8 directional boat sprites
      const frameNum = 5 + direction  // Map direction 1-8 to frames 6-13
      try {
        this.boatSprite.setFrame(frameNum)
      } catch (e) {
        // Fallback to rotation
        const angle = ((direction - 1) * (Math.PI / 4)) + Math.PI
        this.boatSprite.rotation = angle
      }
    } else {
      // Rotate sprite to show direction
      const angle = ((direction - 1) * (Math.PI / 4)) + Math.PI
      this.boatSprite.rotation = angle
    }
  }

  /**
   * Create navigation UI for point-and-click sea map
   */
  createUI() {
    // Title/header
    this.titleText = this.game.add.text(320, 25, 'De Zee', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 4
    })
    this.titleText.anchor.setTo(0.5, 0.5)

    // Sea Level indicator (top-left corner)
    this.createLevelIndicator()

    // Compass in top-right
    this.createCompass()

    // Speed indicator (hidden in map mode)
    this.speedText = this.game.add.text(50, 30, 'Snelheid: 0', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 2
    })
    this.speedText.visible = false

    // Create fuel/energy gauge (hidden in map mode)
    this.createEnergyGauge()

    // Back to boatyard button - always visible
    const backBtn = this.game.add.text(50, 450, 'Terug naar werf', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    backBtn.inputEnabled = true
    backBtn.events.onInputOver.add(() => {
      backBtn.fill = '#ffff00'
      this.game.mulle.cursor.current = 'Point'
    })
    backBtn.events.onInputOut.add(() => {
      backBtn.fill = '#ffffff'
      this.game.mulle.cursor.current = null
    })
    backBtn.events.onInputUp.add(() => {
      this.returnToBoatyard()
    })

    // Instructions - changes based on mode
    this.instructionText = this.game.add.text(320, 460, 'Klik op een bestemming om te varen', {
      font: '12px Arial',
      fill: '#cccccc'
    })
    this.instructionText.anchor.setTo(0.5, 0.5)

    // Propulsion indicator (hidden in map mode)
    this.propulsionText = this.game.add.text(50, 85, '', {
      font: '12px Arial',
      fill: '#aaaaaa',
      stroke: '#000000',
      strokeThickness: 1
    })
    this.propulsionText.visible = false

    // Terrain/depth indicator (hidden in map mode)
    this.terrainText = this.game.add.text(50, 100, '', {
      font: '12px Arial',
      fill: '#66ccff',
      stroke: '#000000',
      strokeThickness: 1
    })
    this.terrainText.visible = false
  }

  /**
   * Create fuel/stamina gauge UI
   */
  createEnergyGauge() {
    const gaugeX = 50
    const gaugeY = 50
    const gaugeWidth = 100
    const gaugeHeight = 12

    // Gauge container
    this.energyGaugeGroup = this.game.add.group()

    // Fuel gauge (for motor boats)
    this.fuelGaugeBackground = this.game.add.graphics(gaugeX, gaugeY)
    this.fuelGaugeBackground.beginFill(0x333333, 0.8)
    this.fuelGaugeBackground.drawRoundedRect(0, 0, gaugeWidth, gaugeHeight, 3)
    this.fuelGaugeBackground.endFill()
    this.energyGaugeGroup.add(this.fuelGaugeBackground)

    this.fuelGaugeFill = this.game.add.graphics(gaugeX + 2, gaugeY + 2)
    this.energyGaugeGroup.add(this.fuelGaugeFill)

    this.fuelGaugeLabel = this.game.add.text(gaugeX + gaugeWidth + 5, gaugeY + gaugeHeight / 2, 'Brandstof', {
      font: '10px Arial',
      fill: '#ffffff'
    })
    this.fuelGaugeLabel.anchor.setTo(0, 0.5)
    this.energyGaugeGroup.add(this.fuelGaugeLabel)

    // Stamina gauge (for rowing boats) - positioned below fuel gauge
    const staminaY = gaugeY + gaugeHeight + 5

    this.staminaGaugeBackground = this.game.add.graphics(gaugeX, staminaY)
    this.staminaGaugeBackground.beginFill(0x333333, 0.8)
    this.staminaGaugeBackground.drawRoundedRect(0, 0, gaugeWidth, gaugeHeight, 3)
    this.staminaGaugeBackground.endFill()
    this.energyGaugeGroup.add(this.staminaGaugeBackground)

    this.staminaGaugeFill = this.game.add.graphics(gaugeX + 2, staminaY + 2)
    this.energyGaugeGroup.add(this.staminaGaugeFill)

    this.staminaGaugeLabel = this.game.add.text(gaugeX + gaugeWidth + 5, staminaY + gaugeHeight / 2, 'Energie', {
      font: '10px Arial',
      fill: '#ffffff'
    })
    this.staminaGaugeLabel.anchor.setTo(0, 0.5)
    this.energyGaugeGroup.add(this.staminaGaugeLabel)

    // Warning text (hidden by default)
    this.energyWarningText = this.game.add.text(320, 100, '', {
      font: 'bold 18px Arial',
      fill: '#ff0000',
      stroke: '#000000',
      strokeThickness: 3
    })
    this.energyWarningText.anchor.setTo(0.5, 0.5)
    this.energyWarningText.visible = false

    // Initial visibility based on boat type
    this.updateGaugeVisibility()
  }

  /**
   * Update which gauges are visible based on boat propulsion
   */
  updateGaugeVisibility() {
    if (!this.driveBoat) return
    if (!this.fuelGaugeBackground || !this.fuelGaugeFill || !this.fuelGaugeLabel ||
      !this.staminaGaugeBackground || !this.staminaGaugeFill || !this.staminaGaugeLabel) {
      return
    }

    // Show fuel gauge only for motor boats
    const showFuel = this.driveBoat.hasEngine && this.driveBoat.fuelMax > 0
    this.fuelGaugeBackground.visible = showFuel
    this.fuelGaugeFill.visible = showFuel
    this.fuelGaugeLabel.visible = showFuel

    // Show stamina gauge only for rowing boats
    const showStamina = this.driveBoat.hasOars && this.driveBoat.staminaMax > 0
    this.staminaGaugeBackground.visible = showStamina
    this.staminaGaugeFill.visible = showStamina
    this.staminaGaugeLabel.visible = showStamina

    // Adjust speed text position if needed
    if (this.speedText) {
      if (showFuel || showStamina) {
        this.speedText.y = showFuel && showStamina ? 95 : 80
      } else {
        this.speedText.y = 30
      }
    }
  }

  /**
   * Update energy gauges display
   */
  updateEnergyGauges() {
    if (!this.driveBoat) return
    if (!this.fuelGaugeFill || !this.staminaGaugeFill) return

    const gaugeWidth = 96  // Inner width (100 - 4 for padding)
    const gaugeHeight = 8  // Inner height

    // Update fuel gauge
    if (this.fuelGaugeFill.visible) {
      const fuelPercent = this.driveBoat.getFuelPercentage()
      const fuelWidth = Math.max(0, gaugeWidth * fuelPercent)

      // Color based on level: green -> yellow -> red
      let fuelColor
      if (fuelPercent > 0.5) {
        fuelColor = 0x00ff00 // Green
      } else if (fuelPercent > 0.2) {
        fuelColor = 0xffff00 // Yellow
      } else {
        fuelColor = 0xff0000 // Red
      }

      this.fuelGaugeFill.clear()
      this.fuelGaugeFill.beginFill(fuelColor)
      this.fuelGaugeFill.drawRect(0, 0, fuelWidth, gaugeHeight)
      this.fuelGaugeFill.endFill()
    }

    // Update stamina gauge
    if (this.staminaGaugeFill.visible) {
      const staminaPercent = this.driveBoat.getStaminaPercentage()
      const staminaWidth = Math.max(0, gaugeWidth * staminaPercent)

      // Color based on level: blue -> cyan -> red
      let staminaColor
      if (staminaPercent > 0.5) {
        staminaColor = 0x0088ff // Blue
      } else if (staminaPercent > 0.2) {
        staminaColor = 0x00ffff // Cyan
      } else {
        staminaColor = 0xff8800 // Orange
      }

      this.staminaGaugeFill.clear()
      this.staminaGaugeFill.beginFill(staminaColor)
      this.staminaGaugeFill.drawRect(0, 0, staminaWidth, gaugeHeight)
      this.staminaGaugeFill.endFill()
    }
  }

  /**
   * Update Lingo meter sprites (speed, hunger, fuel)
   */
  updateLingoMeters() {
    if (!this.driveBoat) return

    if (this.speedMeter?.show) {
      this.speedMeter.show(Math.abs(this.driveBoat.speed || 0))
      if (this.speedMeter.sprite) this.speedMeter.sprite.visible = true
    }

    if (this.hungerMeter?.show) {
      this.hungerMeter.show(this.driveBoat.mulleHunger || 0)
      if (this.hungerMeter.sprite) this.hungerMeter.sprite.visible = true
    }

    if (this.fuelMeter?.show) {
      const showFuel = this.driveBoat.hasEngine && this.driveBoat.fuelMax > 0
      if (this.fuelMeter.sprite) this.fuelMeter.sprite.visible = showFuel
      if (showFuel) {
        if (this.fuelMeter?.setMax && this.driveBoat.fuelMax) {
          this.fuelMeter.setMax(this.driveBoat.fuelMax)
        }
        this.fuelMeter.show(this.driveBoat.fuelCurrent ?? 0)
      }
    }
  }

  /**
   * Called by driveboat when fuel is low
   */
  onLowFuel(current, max) {
    console.log('[SeaWorld] Low fuel warning!', current, '/', max)

    const bellyCount = this.driveBoat.getBellyCount()
    if (bellyCount > 0) {
      this.showEnergyWarning(`Brandstof bijna op! (${bellyCount} Belly snacks)`)
    } else {
      this.showEnergyWarning('Brandstof bijna op!')
    }
  }

  /**
   * Called by driveboat when stamina is low
   */
  onLowStamina(current, max) {
    console.log('[SeaWorld] Low stamina warning!', current, '/', max)

    const bellyCount = this.driveBoat.getBellyCount()
    if (bellyCount > 0) {
      this.showEnergyWarning(`Je raakt moe! (${bellyCount} Belly snacks)`)
    } else {
      this.showEnergyWarning('Je raakt moe!')
    }
  }

  /**
   * Called by driveboat when propulsion changes
   */
  onPropulsionChange(oldType, newType) {
    console.log('[SeaWorld] Propulsion changed:', oldType, '->', newType)

    // Show appropriate message
    let message = ''
    switch (newType) {
      case 'motor':
        message = 'Motor gestart'
        break
      case 'sail':
        message = 'Zeilen gehesen!'
        break
      case 'oar':
        message = 'Aan het roeien...'
        break
      case 'none':
        message = 'Drijvend...'
        this.showOutOfFuelDialog()
        break
    }

    if (message) {
      this.showMessage(message)
    }

    // Update gauge visibility
    this.updateGaugeVisibility()
  }

  /**
   * Show energy warning message
   */
  showEnergyWarning(text) {
    if (!this.energyWarningText) return

    this.energyWarningText.text = text
    this.energyWarningText.visible = true
    this.energyWarningText.alpha = 1

    // Flash effect
    this.game.add.tween(this.energyWarningText)
      .to({ alpha: 0.3 }, 300, Phaser.Easing.Linear.None, true, 0, 3, true)
      .onComplete.add(() => {
        // Fade out after flashing
        this.game.add.tween(this.energyWarningText)
          .to({ alpha: 0 }, 1000, null, true)
          .onComplete.add(() => {
            this.energyWarningText.visible = false
          })
      })
  }

  /**
   * Manually consume a Belly snack (hotkey B)
   */
  consumeBellySnack() {
    if (!this.driveBoat) {
      console.warn('[SeaWorld] No driveboat available')
      return
    }

    const bellyCount = this.driveBoat.getBellyCount()
    if (bellyCount <= 0) {
      this.showMessage('Geen Belly snacks!')
      return
    }

    const consumed = this.driveBoat.consumeBelly()
    if (consumed) {
      const newCount = this.driveBoat.getBellyCount()
      this.showMessage(`Belly snack gegeten! (${newCount} over)`)

      if (this.driveBoat.hasEngine) {
        this.updateEnergyGauges()
      }
    }
  }

  /**
   * Show dialog when out of fuel with no alternative propulsion
   */
  showOutOfFuelDialog() {
    const bellyCount = this.driveBoat ? this.driveBoat.getBellyCount() : 0
    const hasBelly = bellyCount > 0

    // Create dialog box
    if (this.outOfFuelDialog) {
      this.outOfFuelDialog.destroy()
    }

    this.outOfFuelDialog = this.game.add.group()

    // Background - make it taller if Belly option is available
    const dialogHeight = hasBelly ? 200 : 150
    const bg = this.game.add.graphics(320, 240)
    bg.beginFill(0x000000, 0.9)
    bg.drawRoundedRect(-150, -dialogHeight / 2, 300, dialogHeight, 10)
    bg.endFill()
    this.outOfFuelDialog.add(bg)

    // Title
    const title = this.game.add.text(320, 175, 'Geen brandstof!', {
      font: 'bold 18px Arial',
      fill: '#ff0000'
    })
    title.anchor.setTo(0.5, 0.5)
    this.outOfFuelDialog.add(title)

    // Message
    const msg = this.game.add.text(320, 210, 'Je boot heeft geen brandstof meer.', {
      font: '14px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    msg.anchor.setTo(0.5, 0.5)
    this.outOfFuelDialog.add(msg)

    let btnY = 250

    if (hasBelly) {
      // Belly snack button
      const bellyBtn = this.game.add.text(320, 230, `Eet Belly snack (${bellyCount} over)`, {
        font: 'bold 14px Arial',
        fill: '#ff9900',
        stroke: '#663300',
        strokeThickness: 2
      })
      bellyBtn.anchor.setTo(0.5, 0.5)
      bellyBtn.inputEnabled = true
      bellyBtn.events.onInputOver.add(() => { bellyBtn.fill = '#ffcc00' })
      bellyBtn.events.onInputOut.add(() => { bellyBtn.fill = '#ff9900' })
      bellyBtn.events.onInputUp.add(() => {
        this.outOfFuelDialog.destroy()
        this.consumeBellySnack()
      })
      this.outOfFuelDialog.add(bellyBtn)
      btnY = 280
    }

    // Back to boatyard button
    const backBtn = this.game.add.text(240, btnY, 'Terug naar werf', {
      font: 'bold 14px Arial',
      fill: '#00ff00',
      stroke: '#003300',
      strokeThickness: 2
    })
    backBtn.anchor.setTo(0.5, 0.5)
    backBtn.inputEnabled = true
    backBtn.events.onInputOver.add(() => { backBtn.fill = '#88ff88' })
    backBtn.events.onInputOut.add(() => { backBtn.fill = '#00ff00' })
    backBtn.events.onInputUp.add(() => {
      this.outOfFuelDialog.destroy()
      this.returnToBoatyard()
    })
    this.outOfFuelDialog.add(backBtn)

    // Continue drifting button
    const driftBtn = this.game.add.text(400, btnY, 'Drijven', {
      font: 'bold 14px Arial',
      fill: '#ffff00',
      stroke: '#333300',
      strokeThickness: 2
    })
    driftBtn.anchor.setTo(0.5, 0.5)
    driftBtn.inputEnabled = true
    driftBtn.events.onInputOver.add(() => { driftBtn.fill = '#ffff88' })
    driftBtn.events.onInputOut.add(() => { driftBtn.fill = '#ffff00' })
    driftBtn.events.onInputUp.add(() => {
      this.outOfFuelDialog.destroy()
      this.outOfFuelDialog = null
      // Re-enable boat for drifting
      if (this.driveBoat) {
        this.driveBoat.enabled = true
      }
    })
    this.outOfFuelDialog.add(driftBtn)
  }

  /**
   * Draw compass
   */
  drawCompass() {
    this.compass.clear()

    // Compass background
    this.compass.beginFill(0x000000, 0.5)
    this.compass.drawCircle(0, 0, 40)
    this.compass.endFill()

    // Compass ring
    this.compass.lineStyle(2, 0xffffff, 0.8)
    this.compass.drawCircle(0, 0, 38)

    // Cardinal directions
    const directions = [
      { letter: 'N', angle: 0 },
      { letter: 'O', angle: 90 },
      { letter: 'Z', angle: 180 },
      { letter: 'W', angle: 270 }
    ]

    directions.forEach(dir => {
      const rad = (dir.angle - 90) * Math.PI / 180
      const x = Math.cos(rad) * 25
      const y = Math.sin(rad) * 25

      const text = this.game.add.text(590 + x, 50 + y, dir.letter, {
        font: 'bold 10px Arial',
        fill: '#ffffff'
      })
      text.anchor.setTo(0.5, 0.5)
    })
  }

  /**
   * Create compass UI element
   * Prefers original "kompass" sprite; falls back to drawn vector compass.
   */
  createCompass() {
    this.compassSprite = new MulleSprite(this.game, 590, 50)
    if (this.compassSprite.setDirectorMember('kompass')) {
      // Scale to roughly match previous 80px diameter compass
      const targetSize = 80
      const width = this.compassSprite.width || 0
      if (width > 0) {
        const scale = targetSize / width
        this.compassSprite.scale.setTo(scale, scale)
      }
      this.game.add.existing(this.compassSprite)
      return
    }

    this.compassSprite.destroy()
    this.compassSprite = null
    this.compass = this.game.add.graphics(590, 50)
    this.drawCompass()
  }

  /**
   * Create the sea level indicator UI element
   * Shows current level (1-5) with progress toward next level
   */
  createLevelIndicator() {
    const user = this.game.mulle.user
    const currentLevel = user.getSeaLevel()

    this.levelGroup = this.game.add.group()
    this.levelGroup.x = 50
    this.levelGroup.y = 25

    // Background
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x000000, 0.6)
    bg.drawRoundedRect(-10, -15, 90, 30, 5)
    bg.endFill()
    this.levelGroup.add(bg)

    // Star icon
    const star = this.game.add.graphics(0, 0)
    star.beginFill(0xffd700, 1)
    // Simple 5-point star
    const starPoints = []
    for (let i = 0; i < 5; i++) {
      const outerAngle = (i * 72 - 90) * Math.PI / 180
      const innerAngle = ((i * 72) + 36 - 90) * Math.PI / 180
      starPoints.push({ x: Math.cos(outerAngle) * 10, y: Math.sin(outerAngle) * 10 })
      starPoints.push({ x: Math.cos(innerAngle) * 5, y: Math.sin(innerAngle) * 5 })
    }
    star.moveTo(starPoints[0].x, starPoints[0].y)
    for (let i = 1; i < starPoints.length; i++) {
      star.lineTo(starPoints[i].x, starPoints[i].y)
    }
    star.lineTo(starPoints[0].x, starPoints[0].y)
    star.endFill()
    this.levelGroup.add(star)

    // Level text
    this.levelText = this.game.add.text(35, 0, `Level ${currentLevel}`, {
      font: 'bold 14px Arial',
      fill: '#ffd700'
    })
    this.levelText.anchor.setTo(0.5, 0.5)
    this.levelGroup.add(this.levelText)

    // Make clickable for info
    bg.inputEnabled = true
    bg.events.onInputUp.add(() => {
      this.showLevelInfo()
    })
    bg.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    bg.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
  }

  /**
   * Update the level indicator (call after level changes)
   */
  updateLevelIndicator() {
    if (!this.levelText) return
    const currentLevel = this.game.mulle.user.getSeaLevel()
    this.levelText.text = `Level ${currentLevel}`
  }

  /**
   * Show level info popup with progress and unlocks
   */
  showLevelInfo() {
    const user = this.game.mulle.user
    const currentLevel = user.getSeaLevel()
    const requirements = user.getNextLevelRequirements()
    const unlocks = user.getSeaLevelUnlocks(currentLevel)

    // Create info popup
    if (this.levelInfoPopup) {
      this.levelInfoPopup.destroy()
    }

    this.levelInfoPopup = this.game.add.group()
    this.levelInfoPopup.x = 200
    this.levelInfoPopup.y = 150

    // Background
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x003366, 0.95)
    bg.drawRoundedRect(-150, -100, 300, 200, 10)
    bg.endFill()
    bg.lineStyle(2, 0xffd700, 1)
    bg.drawRoundedRect(-150, -100, 300, 200, 10)
    this.levelInfoPopup.add(bg)

    // Title
    const title = this.game.add.text(0, -75, `Zee Level ${currentLevel}`, {
      font: 'bold 20px Arial',
      fill: '#ffd700'
    })
    title.anchor.setTo(0.5, 0.5)
    this.levelInfoPopup.add(title)

    // Current level unlocks
    const unlockTitle = this.game.add.text(0, -45, 'Ontgrendeld:', {
      font: '12px Arial',
      fill: '#aaaaaa'
    })
    unlockTitle.anchor.setTo(0.5, 0.5)
    this.levelInfoPopup.add(unlockTitle)

    unlocks.forEach((unlock, i) => {
      const text = this.game.add.text(0, -25 + i * 16, '- ' + unlock, {
        font: '12px Arial',
        fill: '#88ff88'
      })
      text.anchor.setTo(0.5, 0.5)
      this.levelInfoPopup.add(text)
    })

    // Next level requirements (if not max level)
    if (!requirements.complete) {
      const nextTitle = this.game.add.text(0, 30, `Volgende level (${requirements.nextLevel}):`, {
        font: '12px Arial',
        fill: '#aaaaaa'
      })
      nextTitle.anchor.setTo(0.5, 0.5)
      this.levelInfoPopup.add(nextTitle)

      const reqText = this.game.add.text(0, 50, requirements.message, {
        font: '12px Arial',
        fill: '#ffff88'
      })
      reqText.anchor.setTo(0.5, 0.5)
      this.levelInfoPopup.add(reqText)
    } else {
      const maxText = this.game.add.text(0, 40, 'Maximum level bereikt!', {
        font: 'bold 14px Arial',
        fill: '#00ff00'
      })
      maxText.anchor.setTo(0.5, 0.5)
      this.levelInfoPopup.add(maxText)
    }

    // Close button
    const closeBtn = this.game.add.text(0, 75, 'Sluiten', {
      font: 'bold 14px Arial',
      fill: '#ffffff'
    })
    closeBtn.anchor.setTo(0.5, 0.5)
    closeBtn.inputEnabled = true
    closeBtn.events.onInputOver.add(() => {
      closeBtn.fill = '#ffff00'
      this.game.mulle.cursor.current = 'Point'
    })
    closeBtn.events.onInputOut.add(() => {
      closeBtn.fill = '#ffffff'
      this.game.mulle.cursor.current = null
    })
    closeBtn.events.onInputUp.add(() => {
      this.levelInfoPopup.destroy()
      this.levelInfoPopup = null
    })
    this.levelInfoPopup.add(closeBtn)

    // Animate in
    this.levelInfoPopup.alpha = 0
    this.game.add.tween(this.levelInfoPopup)
      .to({ alpha: 1 }, 200, Phaser.Easing.Linear.None, true)
  }

  /**
   * Create minimap showing grid position
   */
  createMinimap() {
    if (!this.activeWorld) return

    const miniX = 560
    const miniY = 30
    const tileSize = 20
    const padding = 2

    this.minimapGroup = this.game.add.group()

    // Background
    var bg = this.game.add.graphics(miniX - padding, miniY - padding)
    bg.beginFill(0x000000, 0.6)
    bg.drawRect(
      0, 0,
      this.activeWorld.gridWidth * tileSize + padding * 2,
      this.activeWorld.gridHeight * tileSize + padding * 2
    )
    bg.endFill()
    this.minimapGroup.add(bg)

    // Grid tiles
    this.minimapTiles = []
    for (let y = 0; y < this.activeWorld.gridHeight; y++) {
      this.minimapTiles[y] = []
      for (let x = 0; x < this.activeWorld.gridWidth; x++) {
        let tile = this.game.add.graphics(
          miniX + x * tileSize,
          miniY + y * tileSize
        )
        tile.beginFill(0x1a5276, 0.8)
        tile.drawRect(0, 0, tileSize - 1, tileSize - 1)
        tile.endFill()

        // Add click handler for cheats mode
        tile.inputEnabled = true
        tile.hitArea = new Phaser.Rectangle(0, 0, tileSize, tileSize)
        tile.events.onInputDown.add(() => {
          if (this.game.mulle.cheats) {
            // Cheat teleport uses absolute map switch with normal init pass.
            this.changeMap(new Phaser.Point(x + 1, y + 1), true, undefined)
            this.driveBoat.position.set(320, 250)
          }
        })

        this.minimapGroup.add(tile)
        this.minimapTiles[y][x] = tile
      }
    }

    // Current position marker
    this.minimapMarker = this.game.add.graphics(miniX, miniY)
    this.minimapMarker.beginFill(0xffff00)
    this.minimapMarker.drawCircle(tileSize / 2, tileSize / 2, 8)
    this.minimapMarker.endFill()
    this.minimapGroup.add(this.minimapMarker)

    this.minimapTileSize = tileSize
    this.minimapX = miniX
    this.minimapY = miniY
  }

  /**
   * Update minimap position marker
   */
  updateMinimap() {
    if (!this.minimapMarker || !this.mapCoordinate) return

    this.minimapMarker.x = this.minimapX + (this.mapCoordinate.x - 1) * this.minimapTileSize
    this.minimapMarker.y = this.minimapY + (this.mapCoordinate.y - 1) * this.minimapTileSize
  }

  /**
   * Create weather system (missing.md items #125-136)
   * Implements complete weather system from Weather.ls, Wind.ls, Waves.ls:
   * - 4 weather types with level-based restrictions
   * - Dynamic weather changes every 3000-6000 ticks
   * - Wind velocity point calculation for drift
   * - Wave spawn lines (16 directions)
   * - Visual wave sprites (6 sprites)
   * - Wave collision detection (hitWave when bigWaveTot > 7000)
   * - Sky sprite per weather type
   * - Weather forecasts via radio
   */
  createWeatherSystem() {
    console.log('[SeaWorld] Creating weather system')

    // Create weather system
    this.weather = new MulleWeather(this.game, this)

    // Set up corner points for wave collision detection
    // Default boat corner points (will be updated by boat size)
    const corners = [
      new Phaser.Point(0, -10),
      new Phaser.Point(-5, 5),
      new Phaser.Point(5, 5)
    ]
    this.weather.setCornerPoints(corners)

    console.log('[SeaWorld] Weather system created - Type:', this.weather.getType(),
      'Wind:', this.weather.getWindSpeed(), 'Dir:', this.weather.getWindDirection())
  }

  /**
   * Create destination markers for point-and-click navigation
   * Based on original game destinations from boten_76-88.DXR
   */
  createDestinationMarkers() {
    this.destinations = []
    this.destinationGroup = this.game.add.group()

    // Original game destinations (from boten_CDDATA.CXT):
    // Positions extracted from Lingo map data - see data/sea_positions_extracted.json
    // Swedish names from boten_05.DXR audio - confirmed by fuska.se FAQ
    //
    // Key findings from Swedish FAQ (https://fuska.se/spel/bygg-batar-med-mulle-meck/fusk/fragor-och-svar):
    // - Labyrinthavet = The labyrinth sea area where Mia lives (not a single destination!)
    // - Storön = Big Island = where Viola's gardens are (NOT Mia's island!)
    // - Flaskön = Fountain Island = Fontein (has a gas station!)
    // - Myrorna = The Ants = destination for surströmming transport (food + gasoline reward!)
    // - Vrakviken = Wreck Bay = Duikplek
    // - Dödskalleön = Skull Island = Sven's Cave area
    //
    // Destinations with ObjectId, MapId, Swedish audio names:
    // - Vuurtoren (Sam) - scene 80 - ObjectId 20, MapId 21 - Swedish: "Sam"
    // - Boot Show - scene 76 - ObjectId 16, MapId 63
    // - Surfstrand (Sur) - scene 81 - ObjectId 21, MapId 73
    // - Birgit's strand - scene 77 - ObjectId 17, MapId 51 - Swedish: "Birgit"
    const seaDestinations = [
      {
        id: 'vuurtoren',
        name: 'Vuurtoren (Sam)',
        swedishName: 'Sam',  // Audio: 19d001v0
        x: 342, y: 284,  // Extracted from MapId 21: point(342, 284)
        scene: 'lighthouse',
        dirScene: 80,
        color: 0xffff00,  // Yellow - lighthouse
        icon: 'lighthouse',
        _source: 'ObjectId 20, MapId 21',
        _audio: '19d001v0'
      },
      {
        id: 'bootshow',
        name: 'Boot Show',
        swedishName: '',  // No audio in boten_05.DXR list
        x: 253, y: 89,  // Extracted from MapId 63: point(253, 89)
        scene: 'boatshow',
        dirScene: 76,
        color: 0xff6600,  // Orange - competition
        icon: 'trophy',
        _source: 'ObjectId 16, MapId 63'
      },
      {
        id: 'surfstrand',
        name: 'Surfstrand (Sur)',
        swedishName: '',  // No audio in boten_05.DXR list
        x: 562, y: 164,  // Extracted from MapId 73: point(562, 164)
        scene: 'surfbeach',
        dirScene: 81,
        color: 0x00ccff,  // Cyan - surf
        icon: 'wave',
        _source: 'ObjectId 21, MapId 73'
      },
      {
        id: 'birgitstrand',
        name: "Birgit's Strand",
        swedishName: 'Birgit',  // Audio: 19d004v0
        x: 423, y: 100,  // Extracted from MapId 51: point(423, 100)
        scene: 'birgitbeach',
        dirScene: 77,
        color: 0xff69b4,  // Pink - Birgit
        icon: 'beach',
        _source: 'ObjectId 17, MapId 51',
        _audio: '19d004v0'
      },
      {
        id: 'boatyard',
        name: 'Scheepswerf',
        x: 490, y: 152,  // Extracted from MapId 52: point(490, 152)
        scene: 'boatyard',
        dirScene: null,
        color: 0x8B4513,  // Brown - boatyard
        icon: 'dock',
        _source: 'ObjectId 3, MapId 52'
      },
      {
        id: 'mia',
        name: "Mia's Eiland (in Labyrinthavet)",
        swedishName: 'Myrån (Labyrinthavet)',  // Audio: 19d009v0 - "myra" = ant. FAQ: "Mia bor i labyrint havet"
        x: 144, y: 263,  // Extracted from MapId 97: point(144, 263)
        scene: 'mia',
        dirScene: 83,
        color: 0x90EE90,  // Light green - island
        icon: 'island',
        _source: 'ObjectId 23, MapId 97',
        _audio: '19d009v0',
        _note: 'Swedish FAQ: "åk till labyrint havet. där bor den där mia minadri" - Mia lives in the labyrinth sea area!'
      },
      {
        id: 'preacher',
        name: 'Kerk (Dominee)',
        swedishName: 'kyrkån',  // Audio: 19d002v0 - "kyrka" = church
        x: 169, y: 195,  // Extracted from MapId 33: point(169, 195)
        scene: 'preacher',
        dirScene: 78,
        color: 0x9966CC,  // Purple - church
        icon: 'church',
        _source: 'ObjectId 18, MapId 33',
        _audio: '19d002v0'
      },
      {
        id: 'diving',
        name: 'Duikplek (Vrakviken)',
        swedishName: 'Vrakviken',  // Audio: 19d014v0 - "vrak" = wreck, "vik" = bay
        x: 286, y: 54,  // Extracted from MapId 100: point(286, 54)
        scene: 'diving',
        dirScene: 87,
        color: 0x0066AA,  // Dark blue - underwater
        icon: 'diving',
        _source: 'ObjectId 27, MapId 100',
        _audio: '19d014v0',
        _note: 'Swedish FAQ: "När man hämtat dagboken... får man en kartbit över Vrakviken" - Get map after finding diary'
      },
      {
        id: 'cave',
        name: "Sven's Grot (Dödskalleön)",
        swedishName: 'Svartesven / döskalleån',  // Audio: 19d013v0 / 19d008v0 - "Svarte Sven" / "skull creek"
        x: 319, y: 176,  // Extracted from MapId 19: point(319, 176)
        scene: 'cave',
        dirScene: 86,
        color: 0x4A4A4A,  // Dark gray - cave
        icon: 'cave',
        // Originele Lingo (1974.txt): CheckFor:[#BoatProp:[#Compass]], IfFound:#NoDisplay
        // Cave is only visible/accessible when boat has Compass (Part 46)
        requiresBoatPart: 46,
        _source: 'ObjectId 26, MapId 19',
        _audio: '19d013v0, 19d008v0',
        _note: 'Swedish FAQ: "En bensinstation... till vänster om Dödskalleön" - Gas station near Dödskalleön!'
      },
      {
        id: 'viola',
        name: "Viola's Huis (op Storön!)",
        swedishName: 'Viola (Storön)',  // Audio: 19d016v0. FAQ: "Storön" = where Viola's gardens are!
        x: 204, y: 189,  // Extracted from MapId 91: point(204, 189). FAQ: "Storön ligger nordöst om Flaskön"
        scene: 'viola_boat',
        dirScene: 84,
        color: 0xFF1493,  // Deep pink - music
        icon: 'music',
        _source: 'ObjectId 24, MapId 91',
        _audio: '19d016v0',
        _note: 'Swedish FAQ: "Hur vattnar jag Violas odlingar på Storön?" - Viola is located on Storön!'
      },
      {
        id: 'fisherman',
        name: 'Visser (Surströmming → Myrorna)',
        swedishName: 'Surströmming',  // Audio: 19d006v0 - pickled herring! FAQ: "frakta surströmming till Myrorna"
        x: 210, y: 173,  // Extracted from MapId 55: point(210, 173)
        scene: 'fisherman',
        dirScene: 79,
        color: 0x8B7355,  // Tan - fishing pier
        icon: 'fish',
        _source: 'ObjectId 19, MapId 55',
        _audio: '19d006v0',
        _note: 'Swedish FAQ: "frakta surströmming från fabriken till Myrarna" - Transport herring to Myrorna, get food + gasoline!'
      },
      {
        id: 'waterpump',
        name: 'Fontein (Flaskön - Gas Station!)',
        swedishName: 'Fotön / Flaskön',  // Audio: 19d007v0 - "fot-ön" = fountain island. FAQ: "Flaskön" has gas station!
        x: 552, y: 305,  // Extracted from MapId 3: point(552, 305)
        scene: 'waterpump',
        dirScene: 85,
        color: 0x40E0D0,  // Turquoise - water
        icon: 'fountain',
        _source: 'ObjectId 25, MapId 3',
        _audio: '19d007v0',
        _note: 'Swedish FAQ: "En bensinstation på Flaskön" - Has a gas station!'
      },
      // ========== FUEL STATIONS ==========
      {
        id: 'fuelstation_flaskon',
        name: 'Benzinestation (Flaskön)',
        swedishName: 'Bensinstation',
        x: 530, y: 280,  // Near Fontein on Flaskön - FAQ confirms gas station here!
        scene: null,  // No scene transition, just refuel
        dirScene: null,
        color: 0xFF4444,  // Red - fuel/gas
        icon: 'fuel',
        isFuelStation: true,
        fuelCost: 0,  // Free refueling (original game behavior)
        _source: 'FAQ: "En bensinstation på Flaskön"',
        _note: 'Gas station on Flaskön - free refueling!'
      },
      {
        id: 'fuelstation_dodskallon',
        name: 'Benzinestation (bij Dödskalleön)',
        swedishName: 'Bensinstation',
        x: 295, y: 200,  // Near Sven's Cave / Dödskalleön - FAQ mentions station here
        scene: null,
        dirScene: null,
        color: 0xFF4444,  // Red - fuel/gas
        icon: 'fuel',
        isFuelStation: true,
        fuelCost: 0,  // Free refueling
        _source: 'FAQ: "En bensinstation... till vänster om Dödskalleön"',
        _note: 'Gas station near Dödskalleön - free refueling!'
      },
      {
        id: 'whale',
        name: 'Walvis Plek',
        swedishName: '',  // No audio in boten_05.DXR list
        x: 285, y: 170,  // Extracted from MapId 48: point(285, 170)
        scene: 'whale',
        dirScene: 88,
        color: 0x4169E1,  // Royal blue - ocean
        icon: 'whale',
        _source: 'ObjectId 28, MapId 48'
      },
      {
        id: 'racing',
        name: 'Race Parcours',
        swedishName: 'Racerbanan',  // Audio: 05d066v0 - racing track
        x: 425, y: 75,  // Extracted from MapId 42: point(425, 75)
        scene: 'racing',
        dirScene: null,
        color: 0xFF4500,
        icon: 'racing',
        isMapObject: true,
        objectId: 2,
        audioRef: '82d004v0',
        _source: 'ObjectId 2, MapId 42',
        _audio: '05d066v0'
      },
      {
        id: 'vitamineiland',
        name: 'Vitamine Eiland (Vicky)',
        x: 580, y: 250,  // DLC - not in original Lingo
        scene: 'vickyisland',
        dirScene: null,
        color: 0x32CD32,
        icon: 'island',
        _source: 'DLC addition - not in original data'
      },
      {
        id: 'algeneiland',
        name: 'Algeneiland (Miel)',
        x: 50, y: 280,  // DLC - not in original Lingo
        scene: 'algaeisland',
        dirScene: null,
        color: 0x008080,
        icon: 'island',
        _source: 'DLC addition - not in original data'
      }
    ]

    seaDestinations.forEach(dest => {
      this.createDestinationMarker(dest)
    })
  }

  /**
   * Create a single destination marker
   * @param {Object} dest - Destination data
   */
  createDestinationMarker(dest) {
    // Check if destination requires a boat part (e.g., Compass for cave)
    // Originele Lingo: CheckFor:[#BoatProp:[#Compass]], IfFound:#NoDisplay
    if (dest.requiresBoatPart) {
      const user = this.game.mulle.user
      const hasPart = user && user.hasBoatPart(dest.requiresBoatPart)

      if (!hasPart) {
        // Don't show this destination - boat doesn't have required part
        console.log('[SeaWorld] Hiding destination', dest.id, '- missing required part', dest.requiresBoatPart)
        return  // Skip creating this marker
      }
    }

    const markerGroup = this.game.add.group()
    markerGroup.x = dest.x
    markerGroup.y = dest.y

    // Island/location shape - different icons for different destinations
    const marker = this.game.add.graphics(0, 0)

    // Outer glow ring
    marker.beginFill(dest.color, 0.3)
    marker.drawCircle(0, 0, 50)
    marker.endFill()

    // Main marker circle
    marker.beginFill(dest.color, 0.8)
    marker.drawCircle(0, 0, 25)
    marker.endFill()

    // Inner icon area
    marker.beginFill(0xffffff, 0.9)
    marker.drawCircle(0, 0, 15)
    marker.endFill()

    // Draw icon based on destination type
    this.drawDestinationIcon(marker, dest.icon, dest.color)

    markerGroup.add(marker)

    // Pulsing animation for the glow
    const pulseMarker = this.game.add.graphics(0, 0)
    pulseMarker.beginFill(dest.color, 0.2)
    pulseMarker.drawCircle(0, 0, 30)
    pulseMarker.endFill()
    markerGroup.add(pulseMarker)

    // Pulse animation
    this.game.add.tween(pulseMarker.scale)
      .to({ x: 1.5, y: 1.5 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
    this.game.add.tween(pulseMarker)
      .to({ alpha: 0 }, 1000, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)

    // Hit area for clicking
    marker.inputEnabled = true
    marker.hitArea = new Phaser.Circle(0, 0, 40)

    marker.events.onInputOver.add(() => {
      this.showDestinationInfo(dest)
      this.game.mulle.cursor.current = 'Point'
      // Scale up on hover
      markerGroup.scale.setTo(1.2)
    })
    marker.events.onInputOut.add(() => {
      this.hideDestinationInfo()
      this.game.mulle.cursor.current = null
      markerGroup.scale.setTo(1.0)
    })
    marker.events.onInputUp.add(() => {
      if (this.navigationMode === NavigationMode.MAP) {
        if (dest.isFuelStation) {
          // Special handling for fuel stations - refuel without sailing
          this.handleFuelStationClick(dest)
        } else if (dest.isMapObject && dest.scene === 'racing') {
          // Special handling for racing - start the racing mini-game directly
          this.startRacingMiniGame(dest)
        } else if (dest.scene) {
          this.startSailingToDestination(dest)
        } else {
          // Destination not implemented yet
          this.showMessage(`${dest.name} - nog niet beschikbaar`)
          // Play audio reference if available
          if (dest.audioRef) {
            this.game.mulle.playAudio(dest.audioRef)
          }
        }
      }
    })

    this.destinationGroup.add(markerGroup)
    this.destinations.push({ marker: markerGroup, data: dest })
  }

  /**
   * Draw icon inside destination marker
   * @param {Phaser.Graphics} graphics - Graphics object to draw on
   * @param {string} icon - Icon type
   * @param {number} color - Icon color
   */
  drawDestinationIcon(graphics, icon, color) {
    graphics.lineStyle(2, color, 1)

    switch (icon) {
      case 'lighthouse':
        // Simple lighthouse shape
        graphics.moveTo(-4, 8)
        graphics.lineTo(-6, -4)
        graphics.lineTo(6, -4)
        graphics.lineTo(4, 8)
        graphics.moveTo(0, -4)
        graphics.lineTo(0, -8)
        break
      case 'trophy':
        // Trophy/cup shape
        graphics.moveTo(-5, -5)
        graphics.lineTo(-5, 0)
        graphics.lineTo(5, 0)
        graphics.lineTo(5, -5)
        graphics.moveTo(-3, 0)
        graphics.lineTo(-3, 5)
        graphics.lineTo(3, 5)
        graphics.lineTo(3, 0)
        break
      case 'wave':
        // Wave shape
        graphics.moveTo(-8, 0)
        graphics.quadraticCurveTo(-4, -5, 0, 0)
        graphics.quadraticCurveTo(4, 5, 8, 0)
        break
      case 'beach':
        // Palm tree / beach
        graphics.moveTo(0, 8)
        graphics.lineTo(0, -2)
        graphics.moveTo(-6, -6)
        graphics.lineTo(0, -2)
        graphics.lineTo(6, -6)
        break
      case 'dock':
        // Dock/anchor shape
        graphics.drawCircle(0, -4, 4)
        graphics.moveTo(0, -2)
        graphics.lineTo(0, 6)
        graphics.moveTo(-5, 6)
        graphics.lineTo(5, 6)
        break
      case 'island':
        // Island with palm tree
        graphics.moveTo(-7, 3)
        graphics.quadraticCurveTo(0, 6, 7, 3)
        graphics.moveTo(0, 3)
        graphics.lineTo(0, -4)
        graphics.moveTo(-4, -7)
        graphics.lineTo(0, -4)
        graphics.lineTo(4, -7)
        break
      case 'church':
        // Church/chapel shape with cross
        graphics.moveTo(-5, 6)
        graphics.lineTo(-5, -2)
        graphics.lineTo(0, -5)
        graphics.lineTo(5, -2)
        graphics.lineTo(5, 6)
        graphics.moveTo(0, -5)
        graphics.lineTo(0, -9)
        graphics.moveTo(-2, -7)
        graphics.lineTo(2, -7)
        break
      case 'diving':
        // Diver/underwater icon - person with bubbles
        graphics.moveTo(0, -6)
        graphics.lineTo(0, 2)
        graphics.moveTo(-4, -3)
        graphics.lineTo(4, -3)
        graphics.moveTo(-3, 2)
        graphics.lineTo(-5, 6)
        graphics.moveTo(3, 2)
        graphics.lineTo(5, 6)
        // Bubbles
        graphics.drawCircle(6, -4, 2)
        graphics.drawCircle(8, -7, 1.5)
        break
      case 'cave':
        // Cave entrance shape - arch with stalactites
        graphics.moveTo(-7, 6)
        graphics.lineTo(-7, 0)
        graphics.quadraticCurveTo(-4, -6, 0, -6)
        graphics.quadraticCurveTo(4, -6, 7, 0)
        graphics.lineTo(7, 6)
        // Stalactites
        graphics.moveTo(-3, -5)
        graphics.lineTo(-3, -2)
        graphics.moveTo(3, -5)
        graphics.lineTo(3, -1)
        break
      case 'music':
        // Music note shape
        graphics.drawCircle(-3, 4, 4)
        graphics.moveTo(-1, 4)
        graphics.lineTo(-1, -6)
        graphics.lineTo(5, -8)
        graphics.lineTo(5, -4)
        graphics.lineTo(-1, -2)
        break
      case 'fish':
        // Fish shape (for fisherman)
        graphics.moveTo(-7, 0)
        graphics.lineTo(-3, -3)
        graphics.lineTo(5, -2)
        graphics.lineTo(7, 0)
        graphics.lineTo(5, 2)
        graphics.lineTo(-3, 3)
        graphics.lineTo(-7, 0)
        // Tail
        graphics.moveTo(-7, 0)
        graphics.lineTo(-10, -3)
        graphics.moveTo(-7, 0)
        graphics.lineTo(-10, 3)
        // Eye
        graphics.drawCircle(3, -1, 1.5)
        break
      case 'fountain':
        // Fountain/water pump shape
        graphics.moveTo(-5, 6)
        graphics.lineTo(-5, 2)
        graphics.lineTo(-2, 2)
        graphics.lineTo(-2, -2)
        graphics.lineTo(2, -2)
        graphics.lineTo(2, 2)
        graphics.lineTo(5, 2)
        graphics.lineTo(5, 6)
        // Water spray
        graphics.moveTo(0, -2)
        graphics.lineTo(0, -6)
        graphics.moveTo(-3, -4)
        graphics.lineTo(0, -6)
        graphics.lineTo(3, -4)
        break
      case 'whale':
        // Whale shape
        graphics.moveTo(-8, 0)
        graphics.quadraticCurveTo(-4, -4, 2, -3)
        graphics.lineTo(6, -1)
        graphics.lineTo(8, -4)
        graphics.lineTo(8, 2)
        graphics.lineTo(6, 0)
        graphics.lineTo(2, 2)
        graphics.quadraticCurveTo(-4, 3, -8, 0)
        // Eye
        graphics.drawCircle(-2, -1, 1)
        // Spout
        graphics.moveTo(4, -3)
        graphics.lineTo(3, -6)
        graphics.moveTo(4, -3)
        graphics.lineTo(5, -6)
        break
      case 'racing':
        // Racing/checkered flag shape
        // Flag pole
        graphics.moveTo(0, 8)
        graphics.lineTo(0, -4)
        // Checkered flag
        graphics.beginFill(0xffffff, 1)
        graphics.drawRect(-8, -8, 8, 8)
        graphics.endFill()
        graphics.beginFill(0x000000, 1)
        graphics.drawRect(-8, -8, 4, 4)
        graphics.drawRect(-4, -4, 4, 4)
        graphics.drawRect(0, -8, 4, 4)
        graphics.drawRect(-8, 0, 4, 4)
        graphics.endFill()
        // Speed lines
        graphics.lineStyle(1, color, 0.7)
        graphics.moveTo(-10, 2)
        graphics.lineTo(-6, 2)
        graphics.moveTo(-10, 4)
        graphics.lineTo(-4, 4)
        graphics.moveTo(-10, 6)
        graphics.lineTo(-6, 6)
        break
      case 'fuel':
        // Fuel pump / gas station icon
        // Pump body
        graphics.beginFill(color, 1)
        graphics.drawRect(-5, -4, 10, 12)
        graphics.endFill()
        // Pump top/display
        graphics.beginFill(0xFFFFFF, 0.9)
        graphics.drawRect(-4, -2, 8, 4)
        graphics.endFill()
        // Nozzle/hose
        graphics.lineStyle(2, color, 1)
        graphics.moveTo(5, 0)
        graphics.lineTo(8, 0)
        graphics.lineTo(8, -6)
        graphics.lineTo(10, -6)
        // Pump base
        graphics.lineStyle(0)
        graphics.beginFill(0x333333, 1)
        graphics.drawRect(-6, 8, 12, 2)
        graphics.endFill()
        // Fuel drop icon on pump
        graphics.beginFill(color, 1)
        graphics.moveTo(0, 1)
        graphics.lineTo(-2, 4)
        graphics.quadraticCurveTo(0, 6, 2, 4)
        graphics.lineTo(0, 1)
        graphics.endFill()
        break
      default:
        // Default: simple dot
        graphics.beginFill(color)
        graphics.drawCircle(0, 0, 5)
        graphics.endFill()
    }
  }

  /**
   * Show destination info tooltip with name and description
   */
  showDestinationInfo(dest) {
    if (this.destInfoGroup) {
      this.destInfoGroup.destroy()
    }

    this.destInfoGroup = this.game.add.group()

    // Background box
    const padding = 10
    const textStyle = {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }

    const nameText = this.game.make.text(0, 0, dest.name, textStyle)
    const boxWidth = nameText.width + padding * 2
    const boxHeight = nameText.height + padding * 2

    const bg = this.game.add.graphics(dest.x, dest.y - 50)
    bg.beginFill(0x000000, 0.8)
    bg.drawRoundedRect(-boxWidth / 2, -boxHeight / 2, boxWidth, boxHeight, 8)
    bg.endFill()

    // Arrow pointing down
    bg.beginFill(0x000000, 0.8)
    bg.moveTo(-8, boxHeight / 2)
    bg.lineTo(8, boxHeight / 2)
    bg.lineTo(0, boxHeight / 2 + 10)
    bg.lineTo(-8, boxHeight / 2)
    bg.endFill()

    this.destInfoGroup.add(bg)

    const label = this.game.add.text(dest.x, dest.y - 50, dest.name, textStyle)
    label.anchor.setTo(0.5, 0.5)
    this.destInfoGroup.add(label)

    // Click instruction - different based on destination type
    let instructionText = 'Nog niet beschikbaar'
    let instructionColor = '#ff9999'

    if (dest.isFuelStation) {
      // Fuel station - show fuel status
      if (this.driveBoat && this.driveBoat.hasEngine) {
        const fuelPercent = Math.round(this.driveBoat.getFuelPercentage() * 100)
        instructionText = `Klik om te tanken (${fuelPercent}% vol)`
        instructionColor = fuelPercent < 30 ? '#ff6666' : '#66ff66'
      } else {
        instructionText = 'Je boot heeft geen motor'
        instructionColor = '#999999'
      }
    } else if (dest.scene) {
      instructionText = 'Klik om te varen'
      instructionColor = '#cccccc'
    }

    const clickText = this.game.add.text(dest.x, dest.y - 25, instructionText, {
      font: '12px Arial',
      fill: instructionColor
    })
    clickText.anchor.setTo(0.5, 0.5)
    this.destInfoGroup.add(clickText)
  }

  /**
   * Hide destination info tooltip
   */
  hideDestinationInfo() {
    if (this.destInfoGroup) {
      this.destInfoGroup.destroy()
      this.destInfoGroup = null
    }
  }

  /**
   * Start direct sailing mode (original Lingo flow)
   */
  startDrivingMode() {
    this.navigationMode = NavigationMode.SAILING
    this.targetDestination = null

    if (this.destinationGroup) {
      this.destinationGroup.visible = false
    }

    if (this.driveBoat) {
      this.driveBoat.enabled = true
    }

    if (this.boatSprite) {
      this.boatSprite.visible = true
      if (this.boatSprite !== this.driveBoat) {
        this.boatSprite.scale.setTo(0.7)
      }
      if (this.driveBoat && this.driveBoat.position && this.boatSprite.position && typeof this.boatSprite.position.copyFrom === 'function') {
        this.boatSprite.position.copyFrom(this.driveBoat.position)
      }
    }

    if (typeof this.activateinterface === 'function') {
      this.activateinterface(true)
    }

    if (this.instructionText) {
      this.instructionText.text = 'Vaar met de pijltjes of WASD'
    }

    console.log('[SeaWorld] Driving mode active (Lingo parity)')
  }

  /**
   * Show the sea map with all destinations (point-and-click mode)
   */
  showSeaMap() {
    this.navigationMode = NavigationMode.MAP

    // Show destination markers
    if (this.destinationGroup) {
      this.destinationGroup.visible = true
    }

    // Hide boat during map view or show small boat at dock
    if (this.driveBoat) {
      this.driveBoat.enabled = false
    }
    if (this.boatSprite) {
      // Position boat at dock/starting point
      this.boatSprite.visible = true
      this.boatSprite.x = 320
      this.boatSprite.y = 420
      this.boatSprite.scale.setTo(0.4)  // Smaller on map view
    }

    // Update instruction text
    if (this.instructionText) {
      this.instructionText.text = 'Klik op een bestemming om te varen'
    }

    console.log('[SeaWorld] Showing sea map - select destination')
  }

  /**
   * Start sailing animation to destination
   * @param {Object} dest - Destination data
   */
  startSailingToDestination(dest) {
    console.log('[SeaWorld] Starting sail to:', dest.name)

    this.navigationMode = NavigationMode.SAILING
    this.targetDestination = dest
    this.sailingProgress = 0

    // Hide destination markers during sailing
    if (this.destinationGroup) {
      this.destinationGroup.visible = false
    }
    this.hideDestinationInfo()

    // Show sailing message
    this.showMessage(`Op naar ${dest.name}!`)

    // Setup boat for sailing animation
    if (this.boatSprite) {
      this.boatSprite.visible = true
      this.boatSprite.scale.setTo(0.7)
    }

    // Calculate sailing path - boat starts from current position (dock)
    this.sailingStartX = this.boatSprite ? this.boatSprite.x : 320
    this.sailingStartY = this.boatSprite ? this.boatSprite.y : 420
    this.sailingTargetX = dest.x
    this.sailingTargetY = dest.y

    // Calculate direction for boat sprite
    const angle = Phaser.Math.angleBetween(
      this.sailingStartX, this.sailingStartY,
      this.sailingTargetX, this.sailingTargetY
    )
    this.updateBoatDirection(angle)

    // Update instruction text
    if (this.instructionText) {
      this.instructionText.text = `Onderweg naar ${dest.name}...`
    }

    // Enable driveboat for sailing sounds
    if (this.driveBoat) {
      this.driveBoat.enabled = true
      if (this.driveBoat.hasEngine) {
        this.driveBoat.startEngine()
      }
    }
  }

  /**
   * Update boat sprite direction based on sailing angle
   * @param {number} angle - Angle in radians
   */
  updateBoatDirection(angle) {
    // Convert angle to 8-direction index (0-7)
    // Angle 0 = right, PI/2 = down, PI = left, -PI/2 = up
    // Boat directions: 1=N, 2=NE, 3=E, 4=SE, 5=S, 6=SW, 7=W, 8=NW
    const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2)
    const dirIndex = Math.round(normalizedAngle / (Math.PI / 4)) % 8

    // Map to boat direction (1-8)
    // dirIndex: 0=E, 1=SE, 2=S, 3=SW, 4=W, 5=NW, 6=N, 7=NE
    const directionMap8 = [3, 4, 5, 6, 7, 8, 1, 2]
    const directionMap16 = [4, 6, 8, 10, 12, 14, 16, 2]
    const boatDirection = directionMap8[dirIndex]
    const driveBoatDirection = directionMap16[dirIndex]

    // Update driveboat direction (handles engine sounds, etc)
    if (this.driveBoat) {
      this.driveBoat.setDirection(driveBoatDirection)
    }

    // Update the visual boat sprite
    this.setBoatSpriteDirection(boatDirection)

    // Store current direction for reference
    this.currentBoatDirection = boatDirection
  }

  /**
   * Update sailing animation (called from update loop)
   */
  updateSailing() {
    if (this.navigationMode !== NavigationMode.SAILING) return
    if (!this.targetDestination) return

    // Progress sailing (0-1)
    const sailingSpeed = 0.008  // Adjust for sailing speed
    this.sailingProgress += sailingSpeed

    if (this.sailingProgress >= 1) {
      this.sailingProgress = 1
      this.arriveAtDestination()
      return
    }

    // Lerp boat position
    const currentX = Phaser.Math.linear(this.sailingStartX, this.sailingTargetX, this.sailingProgress)
    const currentY = Phaser.Math.linear(this.sailingStartY, this.sailingTargetY, this.sailingProgress)

    // Update boat sprite position
    if (this.boatSprite) {
      this.boatSprite.x = currentX
      this.boatSprite.y = currentY
    }
    if (this.driveBoat) {
      this.driveBoat.x = currentX
      this.driveBoat.y = currentY
    }

    // Slight bobbing motion on waves
    const bobAmount = Math.sin(this.game.time.now / 200) * 2
    if (this.boatSprite) {
      this.boatSprite.y += bobAmount
    }

    // Scale boat slightly as it "travels"
    if (this.boatSprite) {
      // Boat gets smaller as it goes toward horizon (top), larger toward bottom
      const scaleFactor = 0.5 + (currentY / 480) * 0.4
      this.boatSprite.scale.setTo(scaleFactor)
    }
  }

  /**
   * Called when boat arrives at destination
   */
  arriveAtDestination() {
    console.log('[SeaWorld] Arrived at:', this.targetDestination.name)

    this.navigationMode = NavigationMode.ARRIVED

    // Stop engine
    if (this.driveBoat) {
      this.driveBoat.stopEngine()
      this.driveBoat.enabled = false
    }

    // Show arrival message
    this.showMessage(`Aankomst bij ${this.targetDestination.name}!`)

    // Save session before transitioning
    this.saveSession({ id: this.targetDestination.id })

    // Transition to destination scene after short delay
    this.game.time.events.add(1500, () => {
      const sceneName = this.targetDestination.scene

      if (sceneName === 'boatyard') {
        // Return to boatyard
        this.returnToBoatyard()
      } else if (this.game.state.states[sceneName]) {
        // Scene exists - leave via prepareToLeave flow
        this._transitionToScene(sceneName, '06')
      } else {
        // Scene not implemented - show message and return to map
        this.showMessage(`${this.targetDestination.name} - Komt binnenkort!`)
        this.game.time.events.add(2000, () => {
          this.targetDestination = null
          this.showSeaMap()
        })
      }
    })
  }

  /**
   * Start the racing mini-game
   * Creates a BoatRacing MapObject directly in the scene
   * @param {Object} dest - Racing destination data
   */
  startRacingMiniGame(dest) {
    console.log('[SeaWorld] Starting racing mini-game at:', dest.name)

    // Play racing ambient sound
    if (dest.audioRef) {
      this.game.mulle.playAudio(dest.audioRef)
    }

    // Hide destination markers
    if (this.destinationGroup) {
      this.destinationGroup.visible = false
    }
    this.hideDestinationInfo()

    // Show racing instructions
    this.showRacingInstructions()

    // Create the racing MapObject
    this.createRacingObject(dest)

    // Enable boat for racing
    if (this.driveBoat) {
      this.driveBoat.enabled = true
      this.driveBoat.position.set(320, 380)  // Start position for race
    }
    if (this.boatSprite) {
      this.boatSprite.visible = true
      this.boatSprite.scale.setTo(0.8)
      this.boatSprite.position.set(320, 380)
    }

    // Switch to racing mode
    this.navigationMode = NavigationMode.SAILING
    this.isRacingMode = true

    // Update instruction text
    if (this.instructionText) {
      this.instructionText.text = 'Vaar door de race poort om te starten!'
    }
  }

  /**
   * Create the racing MapObject on the sea
   * @param {Object} dest - Racing destination data
   */
  createRacingObject(dest) {
    // Get the boat racing object definition from BoatObjectsDB
    const objectId = dest.objectId || 2

    // Use unified factory
    this.racingObject = this.addMapObject(objectId, { x: dest.x, y: dest.y }, {
      EnterDir: 12,
      Board: { x: 549, y: 355 }
    })

    console.log('[SeaWorld] Racing object created:', this.racingObject)
  }

  /**
   * Create a simple racing marker if MapObject fails
   * @param {Object} dest - Destination data
   */
  createSimpleRacingMarker(dest) {
    console.log('[SeaWorld] Creating simple racing marker as fallback')

    this.racingMarker = this.game.add.graphics(dest.x, dest.y)

    // Outer radius
    this.racingMarker.beginFill(0xff6600, 0.3)
    this.racingMarker.drawCircle(0, 0, 90)
    this.racingMarker.endFill()

    // Inner radius (trigger zone)
    this.racingMarker.beginFill(0xff0000, 0.5)
    this.racingMarker.drawCircle(0, 0, 50)
    this.racingMarker.endFill()

    // Checkered flag visual
    this.racingMarker.lineStyle(3, 0x333333, 1)
    this.racingMarker.moveTo(0, 0)
    this.racingMarker.lineTo(0, -40)

    // Flag checkers
    this.racingMarker.beginFill(0xffffff, 1)
    this.racingMarker.drawRect(-20, -40, 20, 15)
    this.racingMarker.endFill()
    this.racingMarker.beginFill(0x000000, 1)
    this.racingMarker.drawRect(-20, -40, 10, 7.5)
    this.racingMarker.drawRect(-10, -32.5, 10, 7.5)
    this.racingMarker.endFill()

    // Pulse animation
    this.game.add.tween(this.racingMarker.scale)
      .to({ x: 1.1, y: 1.1 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
  }

  /**
   * Show racing instructions dialog
   */
  showRacingInstructions() {
    const dialog = this.game.add.group()
    dialog.x = 320
    dialog.y = 200

    // Background
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x003366, 0.95)
    bg.drawRoundedRect(-180, -100, 360, 200, 10)
    bg.endFill()
    bg.lineStyle(3, 0xff6600, 1)
    bg.drawRoundedRect(-180, -100, 360, 200, 10)
    dialog.add(bg)

    // Title with racing icon
    const title = this.game.add.text(0, -70, 'Race Parcours', {
      font: 'bold 22px Arial',
      fill: '#ff6600'
    })
    title.anchor.setTo(0.5, 0.5)
    dialog.add(title)

    // Instructions
    const instructions = [
      'Vaar door de race poort om te starten',
      'Maak een ronde en kom terug',
      'Je wint de Snelheids-medaille!'
    ]

    instructions.forEach((text, i) => {
      const line = this.game.add.text(0, -25 + i * 25, text, {
        font: '14px Arial',
        fill: '#ffffff'
      })
      line.anchor.setTo(0.5, 0.5)
      dialog.add(line)
    })

    // Start button
    const startBtn = this.game.add.text(0, 60, 'Start Race!', {
      font: 'bold 18px Arial',
      fill: '#00ff00',
      stroke: '#003300',
      strokeThickness: 2
    })
    startBtn.anchor.setTo(0.5, 0.5)
    startBtn.inputEnabled = true
    startBtn.events.onInputOver.add(() => {
      startBtn.fill = '#88ff88'
      this.game.mulle.cursor.current = 'Point'
    })
    startBtn.events.onInputOut.add(() => {
      startBtn.fill = '#00ff00'
      this.game.mulle.cursor.current = null
    })
    startBtn.events.onInputUp.add(() => {
      // Animate out
      this.game.add.tween(dialog)
        .to({ alpha: 0, y: 150 }, 300, Phaser.Easing.Back.In, true)
        .onComplete.add(() => {
          dialog.destroy()
        })
    })
    dialog.add(startBtn)

    // Back button
    const backBtn = this.game.add.text(-100, 60, 'Terug', {
      font: '14px Arial',
      fill: '#aaaaaa'
    })
    backBtn.anchor.setTo(0.5, 0.5)
    backBtn.inputEnabled = true
    backBtn.events.onInputOver.add(() => {
      backBtn.fill = '#ffffff'
      this.game.mulle.cursor.current = 'Point'
    })
    backBtn.events.onInputOut.add(() => {
      backBtn.fill = '#aaaaaa'
      this.game.mulle.cursor.current = null
    })
    backBtn.events.onInputUp.add(() => {
      // Return to sea map
      this.exitRacingMode()
      dialog.destroy()
    })
    dialog.add(backBtn)

    // Animate in
    dialog.alpha = 0
    dialog.y = 250
    this.game.add.tween(dialog)
      .to({ alpha: 1, y: 200 }, 400, Phaser.Easing.Back.Out, true)

    this.racingInstructionsDialog = dialog
  }

  /**
   * Exit racing mode and return to sea map
   */
  exitRacingMode() {
    console.log('[SeaWorld] Exiting racing mode')

    this.isRacingMode = false

    // Destroy racing objects
    if (this.racingObject) {
      this.racingObject.destroy()
      this.racingObject = null
    }
    if (this.racingMarker) {
      this.racingMarker.destroy()
      this.racingMarker = null
    }

    // Return to sea map view
    this.showSeaMap()
  }

  // ========================================
  // FUEL STATION SYSTEM
  // ========================================

  /**
   * Handle click on a fuel station marker
   * Shows refueling dialog with current fuel level and refuel option
   * @param {Object} dest - Fuel station destination data
   */
  handleFuelStationClick(dest) {
    console.log('[SeaWorld] Fuel station clicked:', dest.name)

    // Check if boat has an engine (needs fuel)
    if (!this.driveBoat || !this.driveBoat.hasEngine) {
      this.showMessage('Je boot heeft geen motor!')
      return
    }

    // Check if already full
    const fuelPercent = this.driveBoat.getFuelPercentage()
    if (fuelPercent >= 0.99) {
      this.showMessage('Tank is al vol!')
      this.game.mulle.playAudio('05d012v0')  // Full tank sound
      return
    }

    // Show refueling dialog
    this.showFuelStationDialog(dest)
  }

  /**
   * Show fuel station refueling dialog
   * @param {Object} dest - Fuel station data
   */
  showFuelStationDialog(dest) {
    // Destroy existing dialog if any
    if (this.fuelStationDialog) {
      this.fuelStationDialog.destroy()
    }

    const currentFuel = this.driveBoat.fuelCurrent
    const maxFuel = this.driveBoat.fuelMax
    const fuelPercent = Math.round((currentFuel / maxFuel) * 100)
    const fuelNeeded = maxFuel - currentFuel

    this.fuelStationDialog = this.game.add.group()

    // Background
    const bg = this.game.add.graphics(320, 240)
    bg.beginFill(0x003366, 0.95)
    bg.drawRoundedRect(-180, -120, 360, 240, 15)
    bg.endFill()
    bg.lineStyle(3, 0xFF4444, 1)
    bg.drawRoundedRect(-180, -120, 360, 240, 15)
    this.fuelStationDialog.add(bg)

    // Title with fuel icon
    const title = this.game.add.text(320, 145, 'Benzinestation', {
      font: 'bold 24px Arial',
      fill: '#FF4444'
    })
    title.anchor.setTo(0.5, 0.5)
    this.fuelStationDialog.add(title)

    // Station name
    const stationName = this.game.add.text(320, 175, dest.name, {
      font: '14px Arial',
      fill: '#aaaaaa'
    })
    stationName.anchor.setTo(0.5, 0.5)
    this.fuelStationDialog.add(stationName)

    // Current fuel level display
    const fuelLabel = this.game.add.text(320, 210, 'Brandstofniveau:', {
      font: '14px Arial',
      fill: '#ffffff'
    })
    fuelLabel.anchor.setTo(0.5, 0.5)
    this.fuelStationDialog.add(fuelLabel)

    // Fuel gauge visualization
    const gaugeX = 180
    const gaugeY = 235
    const gaugeWidth = 280
    const gaugeHeight = 25

    // Gauge background
    const gaugeBg = this.game.add.graphics(gaugeX, gaugeY)
    gaugeBg.beginFill(0x333333, 1)
    gaugeBg.drawRoundedRect(0, 0, gaugeWidth, gaugeHeight, 5)
    gaugeBg.endFill()
    this.fuelStationDialog.add(gaugeBg)

    // Gauge fill (current fuel)
    const fillWidth = (currentFuel / maxFuel) * (gaugeWidth - 4)
    const gaugeFill = this.game.add.graphics(gaugeX + 2, gaugeY + 2)

    // Color based on fuel level
    let fuelColor = 0x00ff00  // Green
    if (fuelPercent < 20) {
      fuelColor = 0xff0000  // Red
    } else if (fuelPercent < 50) {
      fuelColor = 0xffff00  // Yellow
    }

    gaugeFill.beginFill(fuelColor, 1)
    gaugeFill.drawRoundedRect(0, 0, fillWidth, gaugeHeight - 4, 3)
    gaugeFill.endFill()
    this.fuelStationDialog.add(gaugeFill)

    // Percentage text on gauge
    const percentText = this.game.add.text(320, gaugeY + gaugeHeight / 2, `${fuelPercent}%`, {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    })
    percentText.anchor.setTo(0.5, 0.5)
    this.fuelStationDialog.add(percentText)

    // Fuel amount text
    const amountText = this.game.add.text(320, 275, `${Math.round(currentFuel)} / ${Math.round(maxFuel)} liter`, {
      font: '12px Arial',
      fill: '#cccccc'
    })
    amountText.anchor.setTo(0.5, 0.5)
    this.fuelStationDialog.add(amountText)

    // Cost info (free in original game)
    const costText = this.game.add.text(320, 300, dest.fuelCost === 0 ? 'Gratis tanken!' : `Kosten: ${dest.fuelCost} munten`, {
      font: '14px Arial',
      fill: dest.fuelCost === 0 ? '#00ff00' : '#ffff00'
    })
    costText.anchor.setTo(0.5, 0.5)
    this.fuelStationDialog.add(costText)

    // Refuel button
    const refuelBtn = this.game.add.text(250, 340, 'Vol Tanken', {
      font: 'bold 18px Arial',
      fill: '#00ff00',
      stroke: '#003300',
      strokeThickness: 3
    })
    refuelBtn.anchor.setTo(0.5, 0.5)
    refuelBtn.inputEnabled = true
    refuelBtn.events.onInputOver.add(() => {
      refuelBtn.fill = '#88ff88'
      this.game.mulle.cursor.current = 'Point'
    })
    refuelBtn.events.onInputOut.add(() => {
      refuelBtn.fill = '#00ff00'
      this.game.mulle.cursor.current = null
    })
    refuelBtn.events.onInputUp.add(() => {
      this.performRefuel(dest, gaugeFill, percentText, amountText, gaugeWidth)
    })
    this.fuelStationDialog.add(refuelBtn)

    // Close button
    const closeBtn = this.game.add.text(390, 340, 'Sluiten', {
      font: '14px Arial',
      fill: '#aaaaaa'
    })
    closeBtn.anchor.setTo(0.5, 0.5)
    closeBtn.inputEnabled = true
    closeBtn.events.onInputOver.add(() => {
      closeBtn.fill = '#ffffff'
      this.game.mulle.cursor.current = 'Point'
    })
    closeBtn.events.onInputOut.add(() => {
      closeBtn.fill = '#aaaaaa'
      this.game.mulle.cursor.current = null
    })
    closeBtn.events.onInputUp.add(() => {
      this.closeFuelStationDialog()
    })
    this.fuelStationDialog.add(closeBtn)

    // Animate dialog in
    this.fuelStationDialog.alpha = 0
    this.fuelStationDialog.y = 20
    this.game.add.tween(this.fuelStationDialog)
      .to({ alpha: 1, y: 0 }, 300, Phaser.Easing.Back.Out, true)

    // Play station ambient sound
    this.game.mulle.playAudio('05d009v0')  // Gas station ambient
  }

  /**
   * Perform the refueling action with animation
   * @param {Object} dest - Fuel station data
   * @param {Phaser.Graphics} gaugeFill - Gauge fill graphics
   * @param {Phaser.Text} percentText - Percentage text
   * @param {Phaser.Text} amountText - Amount text
   * @param {number} gaugeWidth - Total gauge width
   */
  performRefuel(dest, gaugeFill, percentText, amountText, gaugeWidth) {
    if (!this.driveBoat) return

    const maxFuel = this.driveBoat.fuelMax
    const startFuel = this.driveBoat.fuelCurrent
    const fuelNeeded = maxFuel - startFuel

    if (fuelNeeded < 1) {
      this.showMessage('Tank is al vol!')
      return
    }

    // Play refueling sound
    const refuelSound = this.game.mulle.playAudio('05d010v0')  // Fuel pump sound

    // Animate the gauge filling up
    const fillDuration = 1500  // 1.5 seconds
    const startTime = this.game.time.now
    const startWidth = gaugeFill.width

    // Disable button during refuel
    this.isRefueling = true

    const refuelUpdate = () => {
      const elapsed = this.game.time.now - startTime
      const progress = Math.min(1, elapsed / fillDuration)

      // Calculate current fuel level during animation
      const currentFuel = startFuel + (fuelNeeded * progress)
      const fuelPercent = Math.round((currentFuel / maxFuel) * 100)
      const fillWidth = (currentFuel / maxFuel) * (gaugeWidth - 4)

      // Update gauge
      gaugeFill.clear()
      gaugeFill.beginFill(0x00ff00, 1)  // Green when filling
      gaugeFill.drawRoundedRect(0, 0, fillWidth, 21, 3)
      gaugeFill.endFill()

      // Update texts
      percentText.text = `${fuelPercent}%`
      amountText.text = `${Math.round(currentFuel)} / ${Math.round(maxFuel)} liter`

      // Update actual boat fuel
      this.driveBoat.fuelCurrent = currentFuel

      if (progress < 1) {
        this.game.time.events.add(30, refuelUpdate)
      } else {
        // Refuel complete
        this.isRefueling = false
        this.driveBoat.refuel(fuelNeeded)  // Ensure full tank

        // Play completion sound
        this.game.mulle.playAudio('05d011v0')  // Tank full ding

        // Show completion message
        this.showMessage('Tank is vol!')

        // Update energy gauges in main UI
        this.updateEnergyGauges()

        console.log('[SeaWorld] Refuel complete:', this.driveBoat.fuelCurrent, '/', this.driveBoat.fuelMax)
      }
    }

    refuelUpdate()
  }

  /**
   * Close the fuel station dialog
   */
  closeFuelStationDialog() {
    if (this.fuelStationDialog) {
      this.game.add.tween(this.fuelStationDialog)
        .to({ alpha: 0, y: 20 }, 200, Phaser.Easing.Back.In, true)
        .onComplete.add(() => {
          this.fuelStationDialog.destroy()
          this.fuelStationDialog = null
        })
    }
  }

  /**
   * Show a message on screen
   */
  showMessage(text) {
    if (this.messageBox) {
      this.messageBox.destroy()
    }
    if (this.messageText) {
      this.messageText.destroy()
    }

    this.messageBox = this.game.add.graphics(320, 60)
    this.messageBox.beginFill(0x000000, 0.8)
    this.messageBox.drawRoundedRect(-200, -25, 400, 50, 10)
    this.messageBox.endFill()

    this.messageText = this.game.add.text(320, 60, text, {
      font: 'bold 16px Arial',
      fill: '#ffffff'
    })
    this.messageText.anchor.setTo(0.5, 0.5)

    // Auto-hide
    this.game.time.events.add(3000, () => {
      if (this.messageBox) {
        this.game.add.tween(this.messageBox).to({ alpha: 0 }, 500, null, true)
      }
      if (this.messageText) {
        this.game.add.tween(this.messageText).to({ alpha: 0 }, 500, null, true)
      }
    })
  }

  /**
   * Play ambient ocean sounds
   * Original Lingo uses AmbienceSound controller (waves/wind/stem water)
   */
  playAmbientSounds() {
    // Lingo parity: no extra music track here, only AmbienceSound.
    this.ambienceSound = new AmbienceSound(this.game)
    this.ambienceSound.activate(true)

    console.log('[SeaWorld] AmbienceSound system activated')
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds() {
    // Lingo parity: cleanup AmbienceSound system.
    if (this.ambienceSound) {
      this.ambienceSound.cleanup()
      this.ambienceSound = null
    }
  }

  /**
   * Return to boatyard
   */
  returnToBoatyard() {
    console.log('[SeaWorld] Returning to boatyard')
    this.saveSession()
    this._transitionToScene('boatyard', '04')
  }

  activateinterface(active) {
    const enabled = !!active
    this.interfaceActive = enabled

    if (this.destinationGroup) {
      this.destinationGroup.inputEnableChildren = enabled
      if (typeof this.destinationGroup.forEach === 'function') {
        this.destinationGroup.forEach((child) => {
          if (child && 'inputEnabled' in child) {
            child.inputEnabled = enabled
          }
        })
      }
    }

    if (this.minimapGroup) {
      this.minimapGroup.inputEnableChildren = enabled
    }

    if (this.hudGroup) {
      this.hudGroup.inputEnableChildren = enabled
      if (this.helpButtonSprite) {
        this.helpButtonSprite.inputEnabled = enabled
      }
      if (this.mapOverviewSprite) {
        this.mapOverviewSprite.inputEnabled = enabled
      }
      if (this.toolboxSprite) {
        this.toolboxSprite.inputEnabled = enabled
      }
    }
  }

  pause(argYesNo) {
    this.overlayPaused = !!argYesNo

    if (this.driveBoat) {
      if (this.overlayPaused) {
        this.driveBoat.enabled = false
      } else if (this.navigationMode === NavigationMode.SAILING) {
        this.driveBoat.enabled = !this.mapDisplayController || !this.mapDisplayController.displaying
      }
    }
  }

  _transitionToScene(sceneKey, toDir) {
    if (typeof this.prepareToLeave === 'function') {
      this.prepareToLeave(toDir)
    }

    // Current Phaser state routing has no explicit frame-based Leave handler,
    // so always perform the scene switch after prepareToLeave bookkeeping.
    if (this.game && this.game.state && typeof this.game.state.start === 'function') {
      this.game.state.start(sceneKey)
    }
  }

  /**
   * Update loop
   */
  update() {
    super.update()

    if (this.toolboxController && typeof this.toolboxController.exitFrame === 'function') {
      this.toolboxController.exitFrame()
    }

    if (this.hudGroup) {
      this.game.world.bringToTop(this.hudGroup)
    }
    if (this.mapDisplayGroup) {
      this.game.world.bringToTop(this.mapDisplayGroup)
    }

    if (this.mapDisplayController && this.mapDisplayController.displaying) {
      this.syncMapDisplayVisuals()
    }

    if (this.overlayPaused) {
      return
    }

    // Handle different navigation modes
    switch (this.navigationMode) {
      case NavigationMode.MAP:
        // Map mode - destinations visible, waiting for click
        // No boat movement
        break

      case NavigationMode.SAILING:
        // Sailing mode - either animate to destination or allow direct control
        if (this.targetDestination) {
          this.updateSailing()
        }
        break

      case NavigationMode.ARRIVED:
        // Arrived - waiting for scene transition
        break
    }

    // Update speed display (only during sailing)
    if (this.driveBoat && this.speedText) {
      if (this.navigationMode === NavigationMode.SAILING) {
        const speed = Math.abs(this.driveBoat.speed).toFixed(1)
        this.speedText.text = `Snelheid: ${speed}`
        this.speedText.visible = true
      } else {
        this.speedText.visible = false
      }
    }

    // Update propulsion indicator
    if (this.driveBoat && this.propulsionText) {
      if (this.navigationMode === NavigationMode.SAILING) {
        const propLabels = {
          'motor': 'Motor',
          'sail': 'Zeil',
          'oar': 'Roeien',
          'none': 'Drijvend'
        }
        this.propulsionText.text = propLabels[this.driveBoat.currentPropulsion] || ''
        this.propulsionText.visible = true
      } else {
        this.propulsionText.visible = false
      }
    }

    // Update terrain/depth indicator (only during sailing)
    if (this.driveBoat && this.terrainText) {
      if (this.navigationMode === NavigationMode.SAILING) {
        const depthInfo = this.driveBoat.getWaterDepth()
        const terrainLabels = {
          'deep': 'Diep water',
          'medium': 'Normaal water',
          'shallow': 'Ondiep water',
          'reef': 'Rif!',
          'current': 'Stroming',
          'shore': 'Kust'
        }
        this.terrainText.text = terrainLabels[depthInfo.terrain.name] || ''

        // Color code terrain indicator
        if (depthInfo.terrain.name === 'reef') {
          this.terrainText.fill = '#ff6600'
        } else if (depthInfo.terrain.name === 'shallow') {
          this.terrainText.fill = '#88ccff'
        } else if (depthInfo.terrain.name === 'current') {
          this.terrainText.fill = '#00ffff'
        } else {
          this.terrainText.fill = '#66ccff'
        }
        this.terrainText.visible = true
      } else {
        this.terrainText.visible = false
      }
    }

    // Update energy gauges (only during sailing)
    if (this.navigationMode === NavigationMode.SAILING) {
      this.updateEnergyGauges()
      if (this.energyGaugeGroup) {
        this.energyGaugeGroup.visible = true
      }
    } else {
      if (this.energyGaugeGroup) {
        this.energyGaugeGroup.visible = false
      }
    }

    // Update Lingo HUD meters (speed/hunger/fuel)
    this.updateLingoMeters()

    // Update weather system
    if (this.weather) {
      this.weather.update()

      // Apply wind drift to boat during sailing
      if (this.navigationMode === NavigationMode.SAILING && this.driveBoat) {
        const windVel = this.weather.getWindVelPoint()
        // Apply drift (scaled down for game balance)
        this.driveBoat.position.x += windVel.x * 0.01
        this.driveBoat.position.y += windVel.y * 0.01
      }
    }

    // BUG FIX #5: Update AmbienceSound with boat speed and weather
    if (this.ambienceSound && this.driveBoat && this.weather) {
      this.ambienceSound.loop(this.driveBoat, this.weather)
    }

    // Get wave info for boat stability
    if (this.navigationMode === NavigationMode.SAILING && this.driveBoat) {
      const boatCorners = [
        new Phaser.Point(0, -10),
        new Phaser.Point(-5, 5),
        new Phaser.Point(5, 5)
      ]
      const waveInfo = this.weather.getWaveInfo(
        this.driveBoat.position,
        this.driveBoat.direction,
        boatCorners
      )
      // waveInfo = [avgAlt, frontBackInclination, sideInclination]
      // This can be used for boat tilting/stability effects
      // For now, just log when waves are significant
      if (Math.abs(waveInfo[1]) > 5 || Math.abs(waveInfo[2]) > 5) {
        // Boat is experiencing significant wave motion
        // This could trigger visual effects, sound, or stability warnings
      }
    }

    // In direct driving mode, keep visual boat synced to driveBoat movement.
    if (this.navigationMode === NavigationMode.SAILING && this.driveBoat && this.boatSprite && !this.targetDestination) {
      this.boatSprite.position.copyFrom(this.driveBoat.position)
      this.setBoatSpriteDirection(Math.ceil(this.driveBoat.direction / 2))
    }

    // Check for map boundary crossing (#146)
    // Map transitions at border - auto-trigger when boat at edge
    // Only during sailing mode (not during map view)
    if (this.navigationMode === NavigationMode.SAILING) {
      this.checkMapBoundaries()
    }

    this.stepMapObjects()
  }

  stepMapObjects() {
    if (!this.mapObjects || !this.driveBoat || !this.driveBoat.position) return
    const boatPos = this.driveBoat.position

    const stepOne = (obj) => {
      if (!obj || obj.enabled === false) return

      if (obj.position && typeof obj.OuterRadius === 'number' && typeof obj.InnerRadius === 'number') {
        this._dispatchMapObjectRadiusHooks(obj, boatPos)
      }

      if (typeof obj.step === 'function') {
        obj.step(boatPos)
      }
    }

    if (typeof this.mapObjects.forEach === 'function') {
      this.mapObjects.forEach((obj) => stepOne(obj))
      return
    }

    if (Array.isArray(this.mapObjects.children)) {
      this.mapObjects.children.forEach((obj) => stepOne(obj))
    }
  }

  _dispatchMapObjectRadiusHooks(obj, boatPos) {
    const dx = (boatPos.x || 0) - (obj.position.x || 0)
    const dy = (boatPos.y || 0) - (obj.position.y || 0)
    const dist = Math.sqrt((dx * dx) + (dy * dy))

    // BUG FIX #5.7: Implement Radius Hysteresis for Lingo Parity
    // Use EnterInnerRadius for entering, InnerRadius for staying
    // Use OuterRadius for entering, ExitOuterRadius for staying
    const hitOuter = obj.enteredOuter ? dist <= (obj.ExitOuterRadius || obj.OuterRadius) : dist <= obj.OuterRadius
    const hitInner = obj.enteredInner ? dist <= obj.InnerRadius : dist <= (obj.EnterInnerRadius || obj.InnerRadius)

    if (hitOuter) {
      if (!obj.enteredOuter) {
        obj.enteredOuter = true
        if (typeof obj.onEnterOuter === 'function') obj.onEnterOuter(this.driveBoat)
      }
    } else if (obj.enteredOuter) {
      obj.enteredOuter = false
      if (typeof obj.onExitOuter === 'function') obj.onExitOuter(this.driveBoat)
    }

    if (hitInner) {
      if (!obj.enteredInner) {
        obj.enteredInner = true
        if (typeof obj.onEnterInner === 'function') obj.onEnterInner(this.driveBoat)
      }
    } else if (obj.enteredInner) {
      obj.enteredInner = false
      if (typeof obj.onExitInner === 'function') obj.onExitInner(this.driveBoat)
    }
  }

  /**
   * Check if boat has crossed map boundaries
   * Map transitions at border - auto-trigger when boat at edge (#146)
   * Position wrap on transition - boat wraps to opposite edge with 12px offset (#147)
   * 
   * Original Lingo (DepthChecker.ls lines 119):
   * - Border detection via (loc - mapOffset) / 2 with topo bounds
   * - Position wraps to opposite edge with offset (12px)
   */
  checkMapBoundaries() {
    if (!this.driveBoat) return

    const pos = this.driveBoat.position || this.driveBoat
    const x = typeof pos.x === 'number' ? pos.x : this.driveBoat.x
    const y = typeof pos.y === 'number' ? pos.y : this.driveBoat.y

    // Lingo reference:
    // - DepthChecker.checkBorders (05/ParentScript 35, line 44-64)
    // - BoatBase.checkBorders (05/ParentScript 34, line 428-468)
    const margin = 10
    const mapMaxX = 640
    const mapMaxY = 396
    const tmpBorder = 12
    const mapOffset = this.driveBoat.mapOffset || { x: 4, y: 4 }
    const tmpBorderWidth = 4

    const tmpH = (x - mapOffset.x) / 2
    const tmpV = (y - mapOffset.y) / 2

    let mapChange = null
    let newX = x
    let newY = y

    if (tmpH < (1 + tmpBorderWidth)) {
      mapChange = new Phaser.Point(-1, 0)
      newX = mapMaxX - tmpBorder // 628
    } else if (tmpH > (316 - tmpBorderWidth)) {
      mapChange = new Phaser.Point(1, 0)
      newX = 4 + tmpBorder // 16
    } else if (tmpV < (1 + tmpBorderWidth)) {
      mapChange = new Phaser.Point(0, -1)
      newY = mapMaxY - tmpBorder // 384
    } else if (tmpV > (198 - tmpBorderWidth)) {
      mapChange = new Phaser.Point(0, 1)
      newY = 4 + tmpBorder // 16
    }

    if (mapChange) {
      this._applyMapBoundaryChange(mapChange, x, y, newX, newY)
    }
  }

  onMapBorder(borderPoint) {
    if (!borderPoint) return false
    const pos = this.driveBoat ? (this.driveBoat.position || this.driveBoat) : null
    const x = pos && typeof pos.x === 'number' ? pos.x : this.driveBoat?.x
    const y = pos && typeof pos.y === 'number' ? pos.y : this.driveBoat?.y
    if (typeof x !== 'number' || typeof y !== 'number') return false

    // Compute wrapped target for provided border direction.
    const mapMaxX = 640
    const mapMaxY = 396
    const tmpBorder = 12
    let newX = x
    let newY = y
    if (borderPoint.x === -1) newX = mapMaxX - tmpBorder
    else if (borderPoint.x === 1) newX = 4 + tmpBorder
    else if (borderPoint.y === -1) newY = mapMaxY - tmpBorder
    else if (borderPoint.y === 1) newY = 4 + tmpBorder

    return this._applyMapBoundaryChange(borderPoint, x, y, newX, newY)
  }

  _applyMapBoundaryChange(mapChange, x, y, newX, newY) {
    if (!mapChange) return false
    const margin = 10
    console.log('[SeaWorld] Map boundary crossed:', mapChange, 'wrap to:', newX, newY)

    // Try to change map (might fail if at world edge)
    // Border crossing uses relational map switch with normal init pass.
    if (this.changeMap(mapChange, false, undefined)) {
      // Position wrap - set boat to opposite edge with offset (#147)
      if (this.driveBoat && this.driveBoat.position && typeof this.driveBoat.position.set === 'function') {
        this.driveBoat.position.set(newX, newY)
      } else if (this.driveBoat) {
        this.driveBoat.x = newX
        this.driveBoat.y = newY
      }
      // Lingo: prevent immediate stepback right after map switch
      if (this.driveBoat) {
        this.driveBoat.changedMapRecently = 5
      }
      if (this.boatSprite && this.boatSprite.position && typeof this.boatSprite.position.set === 'function') {
        this.boatSprite.position.set(newX, newY)
      }
      return true
    }

    // At world boundary - clamp like BoatBase.checkBorders() failure path
    const clampedX = Math.max(margin, Math.min(630, x))
    const clampedY = Math.max(margin, Math.min(386, y))
    if (this.driveBoat && this.driveBoat.position && typeof this.driveBoat.position.set === 'function') {
      this.driveBoat.position.set(clampedX, clampedY)
    } else if (this.driveBoat) {
      this.driveBoat.x = clampedX
      this.driveBoat.y = clampedY
    }
    if (this.boatSprite && this.boatSprite.position && typeof this.boatSprite.position.copyFrom === 'function') {
      this.boatSprite.position.copyFrom(this.driveBoat.position)
    } else if (this.boatSprite && this.boatSprite.position && typeof this.boatSprite.position.set === 'function') {
      this.boatSprite.position.set(clampedX, clampedY)
    }
    return false
  }

  /**
   * Prepare leaving SeaWorld
   * Original Lingo: 05/Dir.ls on prepareToLeave me, argToDir, argTransPic, argTransSnd
   */
  prepareToLeave(argToDir, argTransPic, argTransSnd) {
    if (!argToDir) return

    // Dir.ls line 299-301
    if (this.isLeaving) {
      return
    }

    // Dir.ls line 302-306
    this.isLeaving = true

    if (this.game && this.game.mulle && this.game.mulle.gMulleGlobals) {
      const gm = this.game.mulle.gMulleGlobals
      if (typeof gm.setWhereFrom === 'function') {
        gm.setWhereFrom('05')
      } else {
        gm.WhereFrom = '05'
      }
    }

    const tmpSave = this._buildDrivingInfoSave()
    if (tmpSave && this.mapCoordinate) {
      tmpSave.map = this.mapCoordinate
    }

    this.nextDir = argToDir

    // Dir.ls line 307-309
    this.stopAmbientSounds()
    if (typeof this.activateinterface === 'function') {
      this.activateinterface(false)
    }

    const user = this.game && this.game.mulle ? this.game.mulle.user : null

    // Dir.ls line 310+
    if (argToDir === '04' || argToDir === '03') {
      if (user && typeof user.setDrivingInfo === 'function') {
        user.setDrivingInfo(0)
      }
      this.transPic = argTransPic || '33b018v0'
      this.transSnd = argTransSnd
      this._goLeaveFrame()
      return
    }

    if (user && typeof user.setDrivingInfo === 'function') {
      user.setDrivingInfo(tmpSave)
    }

    if (argToDir === '08') {
      this.transPic = 'TransTmp8'
      this._goLeaveFrame()
      return
    }

    this.transPic = argTransPic || '33b007v0'
    this.transSnd = argTransSnd || '33e007v0'
    this._goLeaveFrame()
  }

  _buildDrivingInfoSave() {
    if (this.driveBoat && typeof this.driveBoat.save === 'function') {
      return this.driveBoat.save()
    }

    if (this.driveBoat) {
      return {
        position: this.driveBoat.position ? { x: this.driveBoat.position.x, y: this.driveBoat.position.y } : null,
        direction: this.driveBoat.direction,
        speed: this.driveBoat.speed
      }
    }

    return {}
  }

  _goLeaveFrame() {
    if (typeof this.go === 'function') {
      this.go('Leave')
    }
  }

  /**
   * Clean up
   */
  shutdown() {
    this.stopAmbientSounds()

    // Clean up topology bitmap
    if (this.topBitmap) {
      this.topBitmap.destroy()
      this.topBitmap = null
    }

    if (this.waveTimer) {
      this.game.time.events.remove(this.waveTimer)
    }

    if (this.driveBoat) {
      this.driveBoat.destroy()
    }

    if (this.boatSprite && this.boatSprite !== this.driveBoat) {
      this.boatSprite.destroy()
    }

    // Clean up dynamic sprites
    if (this.dynamicSprites) {
      for (const id in this.dynamicSprites) {
        if (this.dynamicSprites[id] && typeof this.dynamicSprites[id].destroy === 'function') {
          this.dynamicSprites[id].destroy()
        }
      }
      this.dynamicSprites = null
    }

    this._destroyMapDisplayHotspots()
    if (this.mapDisplayController && typeof this.mapDisplayController.kill === 'function') {
      this.mapDisplayController.kill()
    }
    this.mapDisplayController = null

    if (this.mapDisplayGroup) {
      this.mapDisplayGroup.destroy()
    }

    if (this.energyGaugeGroup) {
      this.energyGaugeGroup.destroy()
    }

    if (this.outOfFuelDialog) {
      this.outOfFuelDialog.destroy()
    }

    if (this.fuelStationDialog) {
      this.fuelStationDialog.destroy()
    }

    if (this.mapObjects) {
      this.mapObjects.destroy()
    }

    if (this.minimapGroup) {
      this.minimapGroup.destroy()
    }

    if (this.speedMeter?.kill) {
      this.speedMeter = this.speedMeter.kill()
    }
    if (this.hungerMeter?.kill) {
      this.hungerMeter = this.hungerMeter.kill()
    }
    if (this.fuelMeter?.kill) {
      this.fuelMeter = this.fuelMeter.kill()
    }

    if (this.toolboxController && typeof this.toolboxController.kill === 'function') {
      this.toolboxController.kill()
    }
    this.toolboxController = null

    if (this.hudGroup) {
      this.hudGroup.destroy()
    }

    // Clean up destination markers
    if (this.destinationGroup) {
      this.destinationGroup.destroy()
    }

    // Clean up weather system
    if (this.weather) {
      this.weather.destroy()
      this.weather = null
    }

    if (this.destInfoGroup) {
      this.destInfoGroup.destroy()
    }

    // Reset navigation state
    this.navigationMode = null
    this.targetDestination = null

    super.shutdown()
    console.log('[SeaWorld] Scene shutdown')
  }

  /**
   * Get a dynamic sprite for a specific channel ID (Lingo parity)
   * Used by map objects to control external sprites (e.g. channel 75 for animations)
   * @param {number|string} channelId - The sprite channel ID
   * @returns {MulleSprite} The sprite for this channel
   */
  getSprite(channelId) {
    if (!this.dynamicSprites) {
      this.dynamicSprites = {}
    }

    const id = String(channelId)

    if (this.dynamicSprites[id]) {
      return this.dynamicSprites[id]
    }

    // Create new dynamic sprite
    console.log('[SeaWorld] Creating dynamic sprite for channel', id)
    // require at runtime to avoid circular dependency
    const MulleSprite = require('../objects/sprite').default
    const sprite = new MulleSprite(this.game, 0, 0)
    sprite.setDirectorMember('Dummy')

    // Add to world, but ensure it's above map objects
    this.game.add.existing(sprite)

    this.dynamicSprites[id] = sprite
    return sprite
  }

  /**
   * Render debug information (optional)
   */
  render() {
    if (this.game.mulle.debug && this.driveBoat) {
      // Show current terrain value at boat position
      const terrain = this.driveBoat.pixelCheck(this.driveBoat.position)
      this.game.debug.text('Terrain: ' + terrain, 10, 470)
      this.game.debug.text('Speed mod: ' + this.driveBoat.terrainSpeedModifier.toFixed(2), 10, 485)
    }
  }

  /**
   * Debug: Visualize all spawn lines on the screen
   * Shows the 16 spawn positions and their direction vectors
   */
  debugShowSpawnLines() {
    if (this.spawnLinesDebug) {
      this.spawnLinesDebug.destroy()
    }

    this.spawnLinesDebug = this.game.add.group()

    const spawnLines = MulleDriveBoat.getAllSpawnLines()
    const colors = [0xFF0000, 0xFF8000, 0xFFFF00, 0x80FF00,
      0x00FF00, 0x00FF80, 0x00FFFF, 0x0080FF,
      0x0000FF, 0x8000FF, 0xFF00FF, 0xFF0080,
      0xFF4040, 0x40FF40, 0x4040FF, 0xFFFFFF]

    spawnLines.forEach((line, index) => {
      // Draw spawn position marker
      const marker = this.game.add.graphics(line.pos.x, line.pos.y)
      marker.beginFill(colors[index], 0.8)
      marker.drawCircle(0, 0, 16)
      marker.endFill()
      this.spawnLinesDebug.add(marker)

      // Draw direction arrow
      const arrow = this.game.add.graphics(line.pos.x, line.pos.y)
      arrow.lineStyle(3, colors[index], 1)
      arrow.moveTo(0, 0)
      arrow.lineTo(line.dir.x * 0.5, line.dir.y * 0.5)
      this.spawnLinesDebug.add(arrow)

      // Draw index number
      const label = this.game.add.text(line.pos.x, line.pos.y - 15, '' + index, {
        font: 'bold 10px Arial',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2
      })
      label.anchor.setTo(0.5, 0.5)
      this.spawnLinesDebug.add(label)
    })

    console.log('[SeaWorld] Debug: Showing 16 spawn lines')
  }

  /**
   * Debug: Hide spawn lines visualization
   */
  debugHideSpawnLines() {
    if (this.spawnLinesDebug) {
      this.spawnLinesDebug.destroy()
      this.spawnLinesDebug = null
    }
  }

  /**
   * Debug: Test spawn at a specific line index
   * @param {number} index - Spawn line index (0-15)
   */
  debugSpawnAt(index) {
    this.spawnBoatAtLine(index)
    console.log('[SeaWorld] Debug: Spawned boat at line', index)
  }

}

export default SeaWorldState
