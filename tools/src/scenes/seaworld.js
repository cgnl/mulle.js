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
import MulleBuildBoat from '../objects/buildboat'
import MulleToolbox from '../objects/toolbox'

import MulleSeaWorld from '../struct/seaworld'

/**
 * Navigation mode for the sea world
 */
const NavigationMode = {
  MAP: 'map',           // Viewing sea map with clickable destinations
  SAILING: 'sailing',   // Actively sailing to a destination
  ARRIVED: 'arrived'    // Arrived at destination, transitioning to scene
}

/**
 * Sea world scene - sail your boat!
 * @extends MulleState
 */
class SeaWorldState extends MulleState {
  preload () {
    super.preload()

    // Load sea world assets
    this.game.load.pack('seaworld', 'assets/seaworld.json', null, this)
    this.game.load.pack('boat_bms', 'assets/boat_bms.json', null, this)
    
    // Load sea topology atlas (similar to car world's topography)
    this.game.load.atlas('sea_topology', 'assets/sea_topology/sea_topology.png', 'assets/sea_topology/sea_topology.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH)
  }

  /**
   * Save current session state for returning later
   * @param {Object} obj - Optional object info (destination entered)
   */
  saveSession (obj) {
    console.log('[SeaWorld] Save session')

    this.game.mulle.lastSeaSession = {
      mapCoordinate: this.mapCoordinate.clone(),
      boatPosition: this.driveBoat.position.clone(),
      boatDirection: this.driveBoat.direction,
      boatSpeed: this.driveBoat.speed
    }

    if (obj) {
      this.game.mulle.lastSeaSession.mapObject = obj.id
    }
  }

  /**
   * Load previous session state
   */
  loadSession () {
    const session = this.game.mulle.lastSeaSession
    if (!session) return false

    this.changeMap(session.mapCoordinate, true)

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

    this.driveBoat.position.set(session.boatPosition.x, session.boatPosition.y)
    this.driveBoat.direction = session.boatDirection

    return true
  }

  /**
   * Remove session data
   */
  removeSession () {
    this.game.mulle.lastSeaSession = null
  }

  create () {
    super.create()

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

    // Navigation state - start in map mode (point-and-click)
    this.navigationMode = NavigationMode.MAP
    this.targetDestination = null
    this.sailingProgress = 0

    // Add sea audio
    this.game.mulle.addAudio('seaworld')

    this.game.physics.startSystem(Phaser.Physics.ARCADE)

    // Create topology bitmap for collision detection
    // Same size as car world topology (316x198 at half resolution)
    this.topBitmap = this.game.make.bitmapData(316, 198)

    // Create the sea world (multi-screen 3x3 grid)
    this.activeWorld = new MulleSeaWorld(this.game, 'De Zee')
    
    // Try to load from data, or create default
    if (this.game.mulle.SeaWorldsDB && this.game.mulle.SeaWorldsDB['De Zee']) {
      this.activeWorld.fromJSON(this.game.mulle.SeaWorldsDB['De Zee'])
    } else {
      this.activeWorld.createDefault()
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

    // Create destination markers for point-and-click navigation
    this.createDestinationMarkers()

    // Create navigation UI
    this.createUI()

    // Create minimap for navigation
    this.createMinimap()

    // Load session or start fresh
    if (this.game.mulle.lastSeaSession) {
      this.loadSession()
      this.removeSession()
    } else {
      // Start at world start position (boat dock)
      this.mapCoordinate = this.activeWorld.StartMap.clone()
      
      // Use spawn lines for proper boat positioning
      // Check if a specific spawn edge was set (e.g., from boatyard)
      const spawnEdge = this.game.mulle.seaSpawnEdge || 'south'
      this.spawnBoatFromEdge(spawnEdge)
      
      // Clear the spawn edge flag
      this.game.mulle.seaSpawnEdge = null
      
      this.changeMap(this.mapCoordinate, true)
    }

    // Start in map mode - show sea map with destinations
    this.showSeaMap()

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

    console.log('[SeaWorld] Scene created - select a destination!')
  }

  /**
   * Change to a different sea map tile
   * Similar to WorldState.changeMap for cars
   * @param {Phaser.Point} pos - Map coordinate or offset
   * @param {boolean} absolute - Whether pos is absolute or relative
   * @returns {boolean} True if map change succeeded
   */
  changeMap (pos, absolute = false) {
    console.log('[SeaWorld] Change map', pos, absolute ? 'absolute' : 'relative')

    var newY = pos.y
    var newX = pos.x

    if (!absolute) {
      newY += this.mapCoordinate.y
      newX += this.mapCoordinate.x
    }

    // Check bounds using activeWorld
    if (this.activeWorld && !this.activeWorld.isValidPosition(newX, newY)) {
      console.log('[SeaWorld] Invalid position:', newX, newY)
      return false
    }

    // Get map data from sea world
    var map = this.activeWorld ? this.activeWorld.getMap(newX, newY) : null
    var topName = `sea_top_${newX}_${newY}`

    console.log('[SeaWorld] Map coordinates', newX, newY, map ? 'MapId:' + map.MapId : '')

    // Update background based on map data
    if (map && map.MapImage) {
      this.updateBackgroundFromMap(map)
    } else if (this.seaMapSprite) {
      try {
        this.seaMapSprite.setDirectorMember('boten_80.DXR', (newX + newY * 3) % 3 + 1)
      } catch (e) {
        console.warn('[SeaWorld] Could not load sea map sprite')
      }
    }

    // Update topology bitmap
    this.updateTopology(topName)

    // Update coordinate
    this.mapCoordinate = new Phaser.Point(newX, newY)

    // Clear and recreate map objects for this tile
    this.clearMapObjects()
    this.createMapObjectsForTile(newX, newY)

    // Update minimap
    this.updateMinimap()

    return true
  }

  /**
   * Update background from map data
   * @param {MulleSeaMap} map - Map tile data
   */
  updateBackgroundFromMap (map) {
    const atlasKey = map.getAtlasKey()
    const frameName = map.getFrameName()

    // Try to update using atlas
    if (this.game.cache.checkImageKey(atlasKey)) {
      if (this.seaBackground && this.seaBackground.key === atlasKey) {
        this.seaBackground.frameName = frameName
      } else {
        // Recreate sprite with atlas
        if (this.seaBackground) {
          this.seaBackground.destroy()
        }
        this.seaBackground = this.game.add.sprite(320, 240, atlasKey, frameName)
        this.seaBackground.anchor.setTo(0.5, 0.5)
        
        // Move to back
        this.game.world.sendToBack(this.seaBackground)
      }
    } else if (map.DirFile && map.MapImage) {
      // Fallback: try director member
      if (!this.seaBackground) {
        this.seaBackground = new MulleSprite(this.game, 320, 240)
        this.game.add.existing(this.seaBackground)
        this.game.world.sendToBack(this.seaBackground)
      }
      this.seaBackground.setDirectorMember(map.DirFile, map.MapImage)
    }
  }

  /**
   * Update topology bitmap from sprite
   * @param {string} topName - Topology frame name
   */
  updateTopology (topName) {
    if (!this.topBitmap) return

    // Try to load specific topology frame
    try {
      if (this.topSprite) {
        this.topSprite.frameName = topName
      } else if (this.game.cache.checkImageKey('sea_topology')) {
        this.topSprite = this.game.add.sprite(-320, -240, 'sea_topology', topName)
        this.topSprite.smoothed = false
      }

      if (this.topSprite) {
        this.topBitmap.draw(this.topSprite, 0, 0)
        this.topBitmap.update()
        console.log('[SeaWorld] Topology updated:', topName)
      }
    } catch (e) {
      // If specific topology not available, generate default
      console.warn('[SeaWorld] Topology not found, generating default:', topName)
      this.generateDefaultTopology()
    }
  }

  /**
   * Generate default sea topology if no specific one exists
   * Creates a simple sea with shore borders
   */
  generateDefaultTopology () {
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
    console.log('[SeaWorld] Generated default topology')
  }

  /**
   * Clear map objects when changing tiles
   */
  clearMapObjects () {
    if (!this.mapObjects) return

    for (var i = this.mapObjects.children.length - 1; i >= 0; i--) {
      var c = this.mapObjects.children[i]
      if (c) {
        this.mapObjects.remove(c, true)
      }
    }
  }

  /**
   * Create map objects for a specific tile (buoys, rocks, etc)
   */
  createMapObjectsForTile (x, y) {
    // TODO: Load from sea world definition
    // For now, create some placeholder objects
    console.log('[SeaWorld] Creating map objects for tile', x, y)
  }

  /**
   * Create the sea background
   * Uses sea map backgrounds from boten_80.DXR (80b001v1, 80b002v0, 80b003v0)
   */
  createBackground () {
    // Try to load sea map background from seaworld sprites
    // Frame 1 = 80b001v1, Frame 2 = 80b002v0, Frame 3 = 80b003v0
    this.seaBackground = new MulleSprite(this.game, 320, 240)
    
    let loaded = false
    
    // Try seaworld sprites atlas first
    if (this.game.cache.checkImageKey('seaworld-sprites-0')) {
      try {
        this.seaBackground.loadTexture('seaworld-sprites-0', '1')  // 80b001v1
        loaded = true
      } catch (e) {
        console.warn('[SeaWorld] Could not load from atlas:', e)
      }
    }
    
    // Try director member if atlas failed
    if (!loaded) {
      loaded = this.seaBackground.setDirectorMember('boten_80.DXR', 17)  // 80b001v1 is member 17
    }

    if (!loaded) {
      // Fallback: create procedural sea map background
      console.warn('[SeaWorld] Could not load sea background, using fallback')
      this.seaBackground.destroy()
      this.createProceduralSeaMap()
    } else {
      this.game.add.existing(this.seaBackground)
    }

    // Sea map sprite (for specific map tiles)
    this.seaMapSprite = new MulleSprite(this.game, 320, 200)
    // Will be updated when changing maps

    // Add animated waves overlay
    this.createWaves()
  }

  /**
   * Create procedural sea map background when assets not available
   */
  createProceduralSeaMap () {
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
  drawMapLandmasses (graphics) {
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
  createTopology () {
    // The topology sprite is rendered off-screen and used for pixel checks
    // It's never displayed, just used for the topBitmap
    
    // Generate initial default topology
    this.generateDefaultTopology()

    console.log('[SeaWorld] Topology layer created')
  }

  /**
   * Create animated wave effect
   */
  createWaves () {
    this.waves = this.game.add.graphics(0, 0)
    
    // Draw wave lines
    this.waveOffset = 0
    this.waveTimer = this.game.time.events.loop(100, () => {
      this.waveOffset += 0.1
      this.drawWaves()
    })
  }

  /**
   * Draw wave animation
   */
  drawWaves () {
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
   * @param {string} edge - Edge to spawn from: 'north', 'south', 'east', 'west'
   *                        or diagonal: 'northeast', 'northwest', 'southeast', 'southwest'
   */
  spawnBoatFromEdge (edge) {
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
  spawnBoatAtLine (index) {
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
  createBoat () {
    // Create the drive boat controller (handles physics and movement)
    this.driveBoat = new MulleDriveBoat(this.game)
    this.driveBoat.position.set(320, 420)  // Default position, will be overridden by spawn
    this.driveBoat.state = this // Give boat reference to scene for callbacks
    this.driveBoat.enabled = false  // Disabled in map mode
    
    // Connect topology bitmap to boat for terrain checking
    this.driveBoat.topology = this.topBitmap
    
    // Make driveboat invisible - we show buildboat instead
    this.driveBoat.visible = false
    this.game.add.existing(this.driveBoat)

    // Create the visual built boat sprite (shows actual boat parts)
    // This displays the user's custom-built boat with captain
    this.boatSprite = new MulleBuildBoat(this.game, 320, 420, null, true, true)
    this.boatSprite.scale.setTo(0.5) // Scale for map view
    
    // Store flag for rotation handling
    this.boatSprite.hasDirectionalSprites = false
    
    // Try to set up 8-directional sprites for the boat
    this.setupBoatDirectionalSprites()
    
    this.game.add.existing(this.boatSprite)

    console.log('[SeaWorld] Boat created - showing built boat with captain')
  }

  /**
   * Setup 8-directional sprites for the built boat
   * The original game uses directional boat sprites during sailing
   */
  setupBoatDirectionalSprites () {
    // The boat's direction display is handled by MulleBuildBoat
    // For sailing animation, we rotate the boat sprite to face the direction
    // The driveboat handles the directional sprite frames internally
    
    // If the boat has specific directional frames in the atlas, use them
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    // Get boat size for correct sprite set
    const size = boat.getShipSize ? boat.getShipSize() : 'medium'
    
    // Check if we have directional boat sprites in seaworld-sprites
    // Frame names in seaworld-sprites-0.json: 6-13 are directional boat frames
    // (80a002v0, 03-09 which are directions)
    const hasDirectionalFrames = this.game.cache.checkImageKey('seaworld-sprites-0')
    
    if (hasDirectionalFrames) {
      console.log('[SeaWorld] Directional boat sprites available')
      this.boatSprite.hasDirectionalSprites = true
      // The direction is updated via updateBoatDirection when sailing
    }
  }

  /**
   * Update the built boat sprite to show correct direction
   * @param {number} direction - Direction 1-8 (N, NE, E, SE, S, SW, W, NW)
   */
  setBoatSpriteDirection (direction) {
    if (!this.boatSprite) return

    if (this.boatSprite.hasDirectionalSprites) {
      // Use frame from seaworld-sprites-0 based on direction
      // Frames 6-13 are the 8 directional boat sprites
      const frameNum = 5 + direction  // Map direction 1-8 to frames 6-13
      try {
        this.boatSprite.setFrame(frameNum)
      } catch (e) {
        // Fallback to rotation
        const angle = (direction - 1) * (Math.PI / 4)
        this.boatSprite.rotation = angle
      }
    } else {
      // Rotate sprite to show direction
      const angle = (direction - 1) * (Math.PI / 4)
      this.boatSprite.rotation = angle
    }
  }

  /**
   * Create navigation UI for point-and-click sea map
   */
  createUI () {
    // Title/header
    this.titleText = this.game.add.text(320, 25, 'De Zee', {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      stroke: '#003366',
      strokeThickness: 4
    })
    this.titleText.anchor.setTo(0.5, 0.5)

    // Compass in top-right
    this.compass = this.game.add.graphics(590, 50)
    this.drawCompass()

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
      if (this.navigationMode === NavigationMode.SAILING) {
        // Cancel sailing and return to map
        this.showMessage('Reis geannuleerd')
        this.targetDestination = null
        this.showSeaMap()
      } else {
        this.returnToBoatyard()
      }
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
  createEnergyGauge () {
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
  updateGaugeVisibility () {
    if (!this.driveBoat) return
    
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
    if (showFuel || showStamina) {
      this.speedText.y = showFuel && showStamina ? 95 : 80
    } else {
      this.speedText.y = 30
    }
  }

  /**
   * Update energy gauges display
   */
  updateEnergyGauges () {
    if (!this.driveBoat) return
    
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
   * Called by driveboat when fuel is low
   */
  onLowFuel (current, max) {
    console.log('[SeaWorld] Low fuel warning!', current, '/', max)
    this.showEnergyWarning('Brandstof bijna op!')
  }

  /**
   * Called by driveboat when stamina is low
   */
  onLowStamina (current, max) {
    console.log('[SeaWorld] Low stamina warning!', current, '/', max)
    this.showEnergyWarning('Je raakt moe!')
  }

  /**
   * Called by driveboat when propulsion changes
   */
  onPropulsionChange (oldType, newType) {
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
  showEnergyWarning (text) {
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
   * Show dialog when out of fuel with no alternative propulsion
   */
  showOutOfFuelDialog () {
    // Create dialog box
    if (this.outOfFuelDialog) {
      this.outOfFuelDialog.destroy()
    }
    
    this.outOfFuelDialog = this.game.add.group()
    
    // Background
    const bg = this.game.add.graphics(320, 240)
    bg.beginFill(0x000000, 0.9)
    bg.drawRoundedRect(-150, -75, 300, 150, 10)
    bg.endFill()
    this.outOfFuelDialog.add(bg)
    
    // Title
    const title = this.game.add.text(320, 185, 'Geen brandstof!', {
      font: 'bold 18px Arial',
      fill: '#ff0000'
    })
    title.anchor.setTo(0.5, 0.5)
    this.outOfFuelDialog.add(title)
    
    // Message
    const msg = this.game.add.text(320, 220, 'Je boot heeft geen brandstof meer.\nWil je terug naar de werf?', {
      font: '14px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    msg.anchor.setTo(0.5, 0.5)
    this.outOfFuelDialog.add(msg)
    
    // Yes button
    const yesBtn = this.game.add.text(260, 280, 'Ja', {
      font: 'bold 16px Arial',
      fill: '#00ff00',
      stroke: '#003300',
      strokeThickness: 2
    })
    yesBtn.anchor.setTo(0.5, 0.5)
    yesBtn.inputEnabled = true
    yesBtn.events.onInputOver.add(() => { yesBtn.fill = '#88ff88' })
    yesBtn.events.onInputOut.add(() => { yesBtn.fill = '#00ff00' })
    yesBtn.events.onInputUp.add(() => {
      this.outOfFuelDialog.destroy()
      this.returnToBoatyard()
    })
    this.outOfFuelDialog.add(yesBtn)
    
    // No button (continue drifting)
    const noBtn = this.game.add.text(380, 280, 'Nee, drijven', {
      font: 'bold 16px Arial',
      fill: '#ffff00',
      stroke: '#333300',
      strokeThickness: 2
    })
    noBtn.anchor.setTo(0.5, 0.5)
    noBtn.inputEnabled = true
    noBtn.events.onInputOver.add(() => { noBtn.fill = '#ffff88' })
    noBtn.events.onInputOut.add(() => { noBtn.fill = '#ffff00' })
    noBtn.events.onInputUp.add(() => {
      this.outOfFuelDialog.destroy()
      this.outOfFuelDialog = null
      // Re-enable boat for drifting
      if (this.driveBoat) {
        this.driveBoat.enabled = true
      }
    })
    this.outOfFuelDialog.add(noBtn)
  }

  /**
   * Draw compass
   */
  drawCompass () {
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
   * Create minimap showing grid position
   */
  createMinimap () {
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
            this.changeMap(new Phaser.Point(x + 1, y + 1), true)
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
  updateMinimap () {
    if (!this.minimapMarker || !this.mapCoordinate) return

    this.minimapMarker.x = this.minimapX + (this.mapCoordinate.x - 1) * this.minimapTileSize
    this.minimapMarker.y = this.minimapY + (this.mapCoordinate.y - 1) * this.minimapTileSize
  }

  /**
   * Create destination markers for point-and-click navigation
   * Based on original game destinations from boten_76-88.DXR
   */
  createDestinationMarkers () {
    this.destinations = []
    this.destinationGroup = this.game.add.group()

    // Original game destinations (from boten_76-88.DXR):
    // - Vuurtoren (Sam) - scene 80 (lighthouse keeper)
    // - Boot Show (Judge) - scene 76 (boat show/competition)
    // - Surfstrand (Sur) - scene 81 (surfing beach)
    // - Birgit's strand - scene 77 (Birgit's beach)
    const seaDestinations = [
      { 
        id: 'vuurtoren',
        name: 'Vuurtoren (Sam)', 
        x: 120, y: 100, 
        scene: 'lighthouse',
        dirScene: 80,
        color: 0xffff00,  // Yellow - lighthouse
        icon: 'lighthouse'
      },
      { 
        id: 'bootshow',
        name: 'Boot Show', 
        x: 520, y: 120, 
        scene: 'boatshow',
        dirScene: 76,
        color: 0xff6600,  // Orange - competition
        icon: 'trophy'
      },
      { 
        id: 'surfstrand',
        name: 'Surfstrand (Sur)', 
        x: 500, y: 350, 
        scene: 'surfbeach',
        dirScene: 81,
        color: 0x00ccff,  // Cyan - surf
        icon: 'wave'
      },
      { 
        id: 'birgitstrand',
        name: "Birgit's Strand", 
        x: 100, y: 380, 
        scene: 'birgitbeach',
        dirScene: 77,
        color: 0xff69b4,  // Pink - Birgit
        icon: 'beach'
      },
      {
        id: 'boatyard',
        name: 'Scheepswerf',
        x: 320, y: 450,
        scene: 'boatyard',
        dirScene: null,
        color: 0x8B4513,  // Brown - boatyard
        icon: 'dock'
      },
      {
        id: 'mia',
        name: "Mia's Eiland",
        x: 310, y: 240,
        scene: 'mia',
        dirScene: 83,
        color: 0x90EE90,  // Light green - island
        icon: 'island'
      },
      {
        id: 'preacher',
        name: 'Kerk (Dominee)',
        x: 200, y: 180,
        scene: 'preacher',
        dirScene: 78,
        color: 0x9966CC,  // Purple - church
        icon: 'church'
      },
      {
        id: 'diving',
        name: 'Duikplek',
        x: 420, y: 280,
        scene: 'diving',
        dirScene: 87,
        color: 0x0066AA,  // Dark blue - underwater
        icon: 'diving'
      },
      {
        id: 'cave',
        name: "Sven's Grot",
        x: 80, y: 240,
        scene: 'cave',
        dirScene: 86,
        color: 0x4A4A4A,  // Dark gray - cave
        icon: 'cave'
      },
      {
        id: 'viola',
        name: "Viola's Huis",
        x: 550, y: 220,
        scene: 'viola_boat',
        dirScene: 84,
        color: 0xFF1493,  // Deep pink - music
        icon: 'music'
      },
      {
        id: 'fisherman',
        name: 'Visser',
        x: 180, y: 300,
        scene: 'fisherman',
        dirScene: 79,
        color: 0x8B7355,  // Tan - fishing pier
        icon: 'fish'
      },
      {
        id: 'waterpump',
        name: 'Fontein',
        x: 400, y: 150,
        scene: 'waterpump',
        dirScene: 85,
        color: 0x40E0D0,  // Turquoise - water
        icon: 'fountain'
      },
      {
        id: 'whale',
        name: 'Walvis Plek',
        x: 280, y: 80,
        scene: 'whale',
        dirScene: 88,
        color: 0x4169E1,  // Royal blue - ocean
        icon: 'whale'
      },
      // === Missing destinations from original Lingo (69.txt) ===
      // These are placeholder positions - scenes may not be fully implemented
      {
        id: 'foton',
        name: 'Fotön',
        x: 580, y: 280,
        scene: null,  // Not implemented yet
        dirScene: null,
        color: 0x98FB98,  // Pale green - foot-shaped island
        icon: 'island',
        audioRef: '19d008v0'
      },
      {
        id: 'doskalleon',
        name: 'Döskalleön',
        x: 60, y: 150,
        scene: null,  // Not implemented yet - Skull Island
        dirScene: null,
        color: 0xDCDCDC,  // Gainsboro gray - skull island
        icon: 'skull',
        audioRef: '19d009v0'
      },
      {
        id: 'myron',
        name: 'Myrön',
        x: 150, y: 280,
        scene: null,  // Not implemented yet - Ant Island
        dirScene: null,
        color: 0x8B4513,  // Saddle brown - ant hill
        icon: 'ant',
        audioRef: '19d010v0'
      },
      {
        id: 'labyrinthavet',
        name: 'Labyrinthavet',
        x: 320, y: 160,
        scene: null,  // Not implemented yet - Labyrinth Sea
        dirScene: null,
        color: 0x4682B4,  // Steel blue - maze waters
        icon: 'maze',
        audioRef: '19d011v0'
      },
      {
        id: 'smuggelskar',
        name: 'Smuggelskär',
        x: 480, y: 380,
        scene: null,  // Not implemented yet - Smuggler's Reef
        dirScene: null,
        color: 0x2F4F4F,  // Dark slate gray - hidden reef
        icon: 'anchor',
        audioRef: '19d013v0'
      },
      {
        id: 'vrakviken',
        name: 'Vrakviken',
        x: 240, y: 350,
        scene: null,  // Not implemented yet - Wreck Bay
        dirScene: null,
        color: 0x696969,  // Dim gray - shipwrecks
        icon: 'wreck',
        audioRef: '05d066v0'
      },
      {
        id: 'mulle',
        name: 'Mulles Huis',
        x: 380, y: 420,
        scene: null,  // Could link to car world transition
        dirScene: null,
        color: 0xFF6347,  // Tomato red - Mulle's color
        icon: 'house',
        audioRef: '19d004v0'
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
  createDestinationMarker (dest) {
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
        if (dest.scene) {
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
  drawDestinationIcon (graphics, icon, color) {
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
      case 'skull':
        // Skull shape for Döskalleön (Skull Island)
        graphics.drawCircle(0, -2, 6)  // Head
        graphics.moveTo(-4, 4)
        graphics.lineTo(-2, 0)
        graphics.lineTo(2, 0)
        graphics.lineTo(4, 4)  // Jaw
        // Eyes
        graphics.drawCircle(-2, -3, 1.5)
        graphics.drawCircle(2, -3, 1.5)
        // Nose
        graphics.moveTo(0, -1)
        graphics.lineTo(-1, 1)
        graphics.lineTo(1, 1)
        graphics.lineTo(0, -1)
        break
      case 'ant':
        // Ant shape for Myrön (Ant Island)
        // Body segments
        graphics.drawCircle(-4, 0, 3)  // Head
        graphics.drawCircle(0, 0, 4)   // Thorax
        graphics.drawCircle(5, 0, 5)   // Abdomen
        // Antennae
        graphics.moveTo(-5, -2)
        graphics.lineTo(-7, -5)
        graphics.moveTo(-3, -2)
        graphics.lineTo(-4, -5)
        // Legs (simplified)
        graphics.moveTo(-1, 3)
        graphics.lineTo(-2, 6)
        graphics.moveTo(2, 3)
        graphics.lineTo(3, 6)
        break
      case 'maze':
        // Maze/labyrinth shape for Labyrinthavet
        graphics.drawRect(-6, -6, 12, 12)  // Outer
        graphics.drawRect(-4, -4, 8, 8)    // Middle
        graphics.drawRect(-2, -2, 4, 4)    // Inner
        // Openings
        graphics.lineStyle(3, 0xffffff, 1)  // White to "cut" openings
        graphics.moveTo(0, -6)
        graphics.lineTo(0, -4)
        graphics.moveTo(4, 0)
        graphics.lineTo(6, 0)
        graphics.moveTo(0, 4)
        graphics.lineTo(0, 6)
        graphics.lineStyle(2, color, 1)  // Restore
        break
      case 'anchor':
        // Anchor shape for Smuggelskär (Smuggler's Reef)
        graphics.drawCircle(0, -6, 3)  // Ring at top
        graphics.moveTo(0, -4)
        graphics.lineTo(0, 5)  // Shaft
        graphics.moveTo(-6, 5)
        graphics.quadraticCurveTo(-6, 8, 0, 5)
        graphics.quadraticCurveTo(6, 8, 6, 5)  // Curved arms
        graphics.moveTo(-4, -2)
        graphics.lineTo(4, -2)  // Crossbar
        break
      case 'wreck':
        // Shipwreck shape for Vrakviken (Wreck Bay)
        // Broken hull
        graphics.moveTo(-8, 4)
        graphics.lineTo(-6, 0)
        graphics.lineTo(-2, -2)
        graphics.lineTo(0, -3)  // Break point
        graphics.moveTo(0, -1)  // Gap for break
        graphics.lineTo(3, 0)
        graphics.lineTo(7, 3)
        graphics.lineTo(8, 6)
        // Mast (broken)
        graphics.moveTo(-3, -2)
        graphics.lineTo(-4, -7)
        graphics.lineTo(-2, -5)  // Broken top
        // Water line
        graphics.moveTo(-9, 5)
        graphics.lineTo(9, 5)
        break
      case 'house':
        // House shape for Mulle's destination
        graphics.moveTo(-6, 6)
        graphics.lineTo(-6, 0)
        graphics.lineTo(0, -6)  // Roof peak
        graphics.lineTo(6, 0)
        graphics.lineTo(6, 6)
        graphics.lineTo(-6, 6)
        // Door
        graphics.moveTo(-2, 6)
        graphics.lineTo(-2, 2)
        graphics.lineTo(2, 2)
        graphics.lineTo(2, 6)
        // Window
        graphics.drawRect(3, 0, 2, 2)
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
  showDestinationInfo (dest) {
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

    // Click instruction - different for implemented vs non-implemented destinations
    const instructionText = dest.scene 
      ? 'Klik om te varen' 
      : 'Nog niet beschikbaar'
    const instructionColor = dest.scene ? '#cccccc' : '#ff9999'
    
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
  hideDestinationInfo () {
    if (this.destInfoGroup) {
      this.destInfoGroup.destroy()
      this.destInfoGroup = null
    }
  }

  /**
   * Show the sea map with all destinations (point-and-click mode)
   */
  showSeaMap () {
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
  startSailingToDestination (dest) {
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
  updateBoatDirection (angle) {
    // Convert angle to 8-direction index (0-7)
    // Angle 0 = right, PI/2 = down, PI = left, -PI/2 = up
    // Boat directions: 1=N, 2=NE, 3=E, 4=SE, 5=S, 6=SW, 7=W, 8=NW
    const normalizedAngle = (angle + Math.PI * 2) % (Math.PI * 2)
    const dirIndex = Math.round(normalizedAngle / (Math.PI / 4)) % 8
    
    // Map to boat direction (1-8)
    // dirIndex: 0=E, 1=SE, 2=S, 3=SW, 4=W, 5=NW, 6=N, 7=NE
    const directionMap = [3, 4, 5, 6, 7, 8, 1, 2]  // Remap to boat directions
    const boatDirection = directionMap[dirIndex]

    // Update driveboat direction (handles engine sounds, etc)
    if (this.driveBoat) {
      this.driveBoat.setDirection(boatDirection)
    }

    // Update the visual boat sprite
    this.setBoatSpriteDirection(boatDirection)

    // Store current direction for reference
    this.currentBoatDirection = boatDirection
  }

  /**
   * Update sailing animation (called from update loop)
   */
  updateSailing () {
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
  arriveAtDestination () {
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
        // Scene exists - go there
        this.stopAmbientSounds()
        this.game.state.start(sceneName)
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
   * Show a message on screen
   */
  showMessage (text) {
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
   * Uses audio from seaworld-audio pack (boten_80.DXR)
   */
  playAmbientSounds () {
    // Try to play ocean ambient - use 80e002v0 or 80e003v0 from seaworld-audio
    try {
      // 80e002v0 is longer ambient sound, 80e003v0 is shorter
      this.ambientSound = this.game.mulle.playAudio('boten_80.DXR/80e002v0', true)
    } catch (e) {
      console.warn('[SeaWorld] Could not play ambient sounds:', e)
    }
  }

  /**
   * Stop ambient sounds
   */
  stopAmbientSounds () {
    try {
      if (this.ambientSound) {
        this.ambientSound.stop()
        this.ambientSound = null
      }
      this.game.mulle.stopAudio('boten_80.DXR/80e002v0')
    } catch (e) {
      // Ignore
    }
  }

  /**
   * Return to boatyard
   */
  returnToBoatyard () {
    console.log('[SeaWorld] Returning to boatyard')
    this.saveSession()
    this.game.state.start('boatyard')
  }

  /**
   * Update loop
   */
  update () {
    super.update()

    // Handle different navigation modes
    switch (this.navigationMode) {
      case NavigationMode.MAP:
        // Map mode - destinations visible, waiting for click
        // No boat movement
        break
        
      case NavigationMode.SAILING:
        // Sailing mode - animate boat to destination
        this.updateSailing()
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

    // Sync boat sprite with driveboat direction during sailing
    if (this.navigationMode === NavigationMode.SAILING && this.driveBoat && this.boatSprite) {
      // boatSprite follows driveboat for direction only
      // Position is handled by updateSailing
    }

    // Check for map boundary crossing (only in free sailing mode if enabled)
    // In point-and-click mode, this is not used
    // this.checkMapBoundaries()
  }

  /**
   * Check if boat has crossed map boundaries
   * Similar to car world's border checking
   */
  checkMapBoundaries () {
    if (!this.driveBoat) return

    const x = this.driveBoat.x
    const y = this.driveBoat.y
    const margin = 30

    let mapChange = null

    // Check edges (screen is 640x400 for the sea area)
    if (x < margin) {
      mapChange = new Phaser.Point(-1, 0)
      this.driveBoat.x = 640 - margin - 10
    } else if (x > 640 - margin) {
      mapChange = new Phaser.Point(1, 0)
      this.driveBoat.x = margin + 10
    } else if (y < margin) {
      mapChange = new Phaser.Point(0, -1)
      this.driveBoat.y = 400 - margin - 10
    } else if (y > 400 - margin) {
      mapChange = new Phaser.Point(0, 1)
      this.driveBoat.y = margin + 10
    }

    if (mapChange) {
      console.log('[SeaWorld] Map boundary crossed:', mapChange)
      this.changeMap(mapChange)
    }
  }

  /**
   * Clean up
   */
  shutdown () {
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

    if (this.boatSprite) {
      this.boatSprite.destroy()
    }

    if (this.energyGaugeGroup) {
      this.energyGaugeGroup.destroy()
    }

    if (this.outOfFuelDialog) {
      this.outOfFuelDialog.destroy()
    }

    if (this.mapObjects) {
      this.mapObjects.destroy()
    }

    if (this.minimapGroup) {
      this.minimapGroup.destroy()
    }

    // Clean up destination markers
    if (this.destinationGroup) {
      this.destinationGroup.destroy()
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
   * Render debug information (optional)
   */
  render () {
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
  debugShowSpawnLines () {
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
  debugHideSpawnLines () {
    if (this.spawnLinesDebug) {
      this.spawnLinesDebug.destroy()
      this.spawnLinesDebug = null
    }
  }

  /**
   * Debug: Test spawn at a specific line index
   * @param {number} index - Spawn line index (0-15)
   */
  debugSpawnAt (index) {
    this.spawnBoatAtLine(index)
    console.log('[SeaWorld] Debug: Spawned boat at line', index)
  }
}

export default SeaWorldState
