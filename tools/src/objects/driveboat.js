/**
 * MulleDriveBoat object
 * @module objects/driveboat
 * 
 * Boat navigation in the sea world
 * Equivalent of MulleDriveCar but for boats
 * 
 * Sea Topology Color System:
 * - Light blue (R: 100-150) = shallow water (slow, small boats only)
 * - Dark blue (R: 0-50) = deep water (normal speed)
 * - Brown (R: 160-200) = reef/rocks (damage if durability too low)
 * - Green (R: 240+) = shore/land (collision, cannot pass)
 * 
 * Topology value breakdown (similar to car):
 * - R channel encodes terrain type and depth
 * - Values >= 240 = impassable (shore/land)
 * - Values 160-200 = reef/rocks (requires durability)
 * - Values 100-150 = shallow water (requires small boat or shallow draft)
 * - Values 0-50 = deep water (normal sailing)
 * - Values 50-100 = medium depth (normal sailing, slight current)
 */
'use strict'

import MulleSprite from 'objects/sprite'

/**
 * Sea terrain types based on topology pixel values
 */
const SEA_TERRAIN = {
  DEEP_WATER: { min: 0, max: 50, name: 'deep', speedMod: 1.0 },
  MEDIUM_WATER: { min: 51, max: 100, name: 'medium', speedMod: 0.9 },
  SHALLOW_WATER: { min: 101, max: 150, name: 'shallow', speedMod: 0.5 },
  REEF: { min: 160, max: 200, name: 'reef', speedMod: 0.3 },
  CURRENT_STRONG: { min: 201, max: 220, name: 'current', speedMod: 0.7 },
  SHORE: { min: 240, max: 255, name: 'shore', speedMod: 0 }
}

/**
 * Propulsion types for boats
 * Different propulsion types have different energy consumption characteristics
 */
const PropulsionType = {
  NONE: 'none',     // No propulsion - drifting only (no energy consumption)
  MOTOR: 'motor',   // Engine-powered - consumes fuel
  SAIL: 'sail',     // Wind-powered - free energy (no consumption)
  OAR: 'oar'        // Human-powered - consumes stamina
}

/**
 * Original Lingo DirectionList from boten_05.DXR member 10
 * 16 direction vectors for boat navigation (scaled to 100)
 */
const DIRECTION_LIST = [
  { x: 38, y: -92 },   // Direction 1: NNE
  { x: 70, y: -70 },   // Direction 2: NE
  { x: 92, y: -38 },   // Direction 3: ENE
  { x: 100, y: 0 },    // Direction 4: E
  { x: 92, y: 38 },    // Direction 5: ESE
  { x: 70, y: 70 },    // Direction 6: SE
  { x: 38, y: 92 },    // Direction 7: SSE
  { x: 0, y: 100 },    // Direction 8: S
  { x: -38, y: 92 },   // Direction 9: SSW
  { x: -70, y: 70 },   // Direction 10: SW
  { x: -92, y: 38 },   // Direction 11: WSW
  { x: -100, y: 0 },   // Direction 12: W
  { x: -92, y: -38 },  // Direction 13: WNW
  { x: -70, y: -70 },  // Direction 14: NW
  { x: -38, y: -92 },  // Direction 15: NNW
  { x: 0, y: -100 }    // Direction 16: N
]

/**
 * Original Lingo AmplitudeList from boten_05.DXR member 11
 * 100 values for wave/amplitude calculations - sine wave pattern
 */
const AMPLITUDE_LIST = [
  6, 13, 19, 25, 31, 37, 43, 48, 54, 59, 64, 68, 73, 77, 81, 84, 88, 90, 93, 95,
  97, 98, 99, 100, 100, 100, 99, 98, 97, 95, 93, 90, 88, 84, 81, 77, 73, 68, 64, 59,
  54, 48, 43, 37, 31, 25, 19, 13, 6, 0, -6, -13, -19, -25, -31, -37, -43, -48, -54, -59,
  -64, -68, -73, -77, -81, -84, -88, -90, -93, -95, -97, -98, -99, -100, -100, -100, -99, -98, -97, -95,
  -93, -90, -88, -84, -81, -77, -73, -68, -64, -59, -54, -48, -43, -37, -31, -25, -19, -13, -6, 0
]

/**
 * Original Lingo SpawnLines from boten_05.DXR member 12
 * 16 spawn positions with direction vectors
 */
const SPAWN_LINES = [
  { pos: { x: 206, y: 478 }, dir: { x: -92, y: -38 } },
  { pos: { x: 110, y: 412 }, dir: { x: -70, y: -70 } },
  { pos: { x: 44, y: 316 }, dir: { x: -38, y: -92 } },
  { pos: { x: 20, y: 202 }, dir: { x: 0, y: -100 } },
  { pos: { x: 44, y: 88 }, dir: { x: 38, y: -92 } },
  { pos: { x: 110, y: -8 }, dir: { x: 70, y: -70 } },
  { pos: { x: 206, y: -74 }, dir: { x: 92, y: -38 } },
  { pos: { x: 320, y: -98 }, dir: { x: 100, y: 0 } },
  { pos: { x: 434, y: -74 }, dir: { x: 92, y: 38 } },
  { pos: { x: 530, y: -8 }, dir: { x: 70, y: 70 } },
  { pos: { x: 596, y: 88 }, dir: { x: 38, y: 92 } },
  { pos: { x: 620, y: 202 }, dir: { x: 0, y: 100 } },
  { pos: { x: 596, y: 316 }, dir: { x: -38, y: 92 } },
  { pos: { x: 530, y: 412 }, dir: { x: -70, y: 70 } },
  { pos: { x: 434, y: 478 }, dir: { x: -92, y: 38 } },
  { pos: { x: 320, y: 502 }, dir: { x: -100, y: 0 } }
]

/**
 * Sea world boat
 * @extends MulleSprite
 */
class MulleDriveBoat extends MulleSprite {
  constructor (game) {
    super(game)

    // Use boat sprites from BMS (Boot Medium Summer) or similar
    this.DirResource = 'boten_BMS.CXT'
    
    // Try to load a boat sprite
    if (!this.setDirectorMember('boten_BMS.CXT', 1)) {
      // Fallback: create a simple boat shape
      console.warn('[DriveBoat] Could not load boat sprite, using placeholder')
    }

    // Direction frames (16 directions for boats, same as cars - from original Lingo DirectionList)
    this.spriteFrames = {}
    this.nrOfDirections = 16

    // Try to load directional boat sprites
    this.loadBoatSprites()

    // Wave amplitude tracking for realistic boat movement
    this.wavePhase = 0  // Current position in AMPLITUDE_LIST (0-99)
    this.waveSpeed = 2  // How fast we progress through the wave cycle

    this.speed = 0
    this.direction = 1
    this.drift = 0
    this.waterDepth = 0  // Current water depth (0=deep, higher=shallower)

    this.stopTimer = 0
    this.acceleration = 0

    this.reachForSpeed = 0

    this.Steering = 0

    this.forwardBackward = 0

    this.lastPosition = new Phaser.Point(0, 0)
    this.previousData = []
    for (var i = 0; i < 10; i++) {
      this.previousData.push([new Phaser.Point(0, 0), 1])
    }

    this.OutOfBounds = 0

    this.internalDirection = 0

    this.keySteer = 1

    this.mapOffset = new Phaser.Point(4, 2)

    // Topology bitmap reference (set by seaworld.js)
    this.topology = null

    // Current terrain info
    this.currentTerrain = SEA_TERRAIN.DEEP_WATER
    this.terrainSpeedModifier = 1.0

    // Sound state flags (prevent repeated sounds)
    this.SoundReef = null
    this.SoundShore = null
    this.SoundShallow = null

    // Direction vectors from original Lingo DirectionList (16 directions, scaled to unit vectors)
    this.directionList = []
    for (var i = 0; i < DIRECTION_LIST.length; i++) {
      // Original values are scaled to 100, normalize to unit vectors
      var xPart = DIRECTION_LIST[i].x / 100
      var yPart = DIRECTION_LIST[i].y / 100
      this.directionList.push(new Phaser.Point(xPart, yPart))
    }

    // Bow positions for collision detection (like wheelPositions in car)
    this.bowPositions = []
    for (var i = 1; i <= this.directionList.length; i++) {
      var x = 12 * this.directionList[i - 1].x
      var y = 12 * this.directionList[i - 1].y
      this.bowPositions.push(new Phaser.Point(x, y))
    }

    this.setDirection(1)

    // Input controls
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.wasd = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    })

    // Logic loop at 30fps
    this.logicLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 30, this.sail, this)

    this.game.physics.enable(this, Phaser.Physics.ARCADE)

    // Boat sounds
    this.engineSounds = {
      motor: 'boten_CDDATA.CXT/00e007v0',
      sail: 'boten_CDDATA.CXT/00e008v0',
      splash: 'boten_CDDATA.CXT/00e001v0',
      reef: '05d002v0',      // Reuse car rock sound
      shore: '05d001v0',     // Collision sound
      shallow: '05d003v0'    // Reuse car mud sound for shallow water
    }

    // Engine state
    this.engineRunning = false

    // Enabled flag (can be disabled during menus etc)
    this.enabled = true

    // ==========================================
    // FUEL/ENERGY SYSTEM
    // ==========================================
    
    // Fuel for motor boats (like car fuel system)
    this.fuelMax = 100          // Max fuel tank capacity
    this.fuelCurrent = 100      // Current fuel level (start full)
    this.fuelConsumptionRate = 0.05  // Fuel consumed per speed unit per tick
    
    // Stamina for oar/rowing boats (human energy)
    this.staminaMax = 100       // Max stamina
    this.staminaCurrent = 100   // Current stamina level
    this.staminaConsumptionRate = 0.03  // Stamina consumed while rowing
    this.staminaRecoveryRate = 0.02     // Stamina recovery when not rowing
    
    // Energy state flags
    this.outOfFuel = false      // Motor stopped due to no fuel
    this.outOfStamina = false   // Too tired to row
    this.fuelWarningShown = false  // Track if low fuel warning displayed
    this.staminaWarningShown = false  // Track if low stamina warning displayed
    
    // Warning thresholds (percentage)
    this.fuelWarningThreshold = 0.2    // Warn at 20% fuel
    this.staminaWarningThreshold = 0.2 // Warn at 20% stamina
    
    // Current propulsion type being used
    this.currentPropulsion = PropulsionType.NONE

    // Get boat properties
    this.updateBoatProperties()

    console.log('[DriveBoat] Initialized with speed:', this.maxSpeed, 'fuel:', this.fuelMax)
  }

  /**
   * Load boat sprites for different directions
   * Boat sprites have 8 directions with 1 frame per direction (boat0000-boat0007)
   * Unlike cars which have 16 directions with 4 frames each
   */
  loadBoatSprites () {
    // Boat sprites are in BMS/BLS/BSS (Medium/Large/Small, Summer/Winter)
    const boatSize = this.getBoatSize()
    const spriteFile = `boten_${boatSize}S.CXT` // Summer variant

    // Boats have 8 directions with 1 frame per direction
    for (var dir = 0; dir < this.nrOfDirections; dir++) {
      this.spriteFrames[dir] = {}
      
      // Each direction has a single member (boat0000-boat0007)
      const memberNum = dir + 1
      
      const img = this.game.mulle.getDirectorImage(spriteFile, memberNum)
      if (img) {
        this.spriteFrames[dir][0] = img.name
      }
    }
  }

  /**
   * Get boat size from user's boat
   */
  getBoatSize () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return 'BM' // Medium default

    const size = boat.getShipSize ? boat.getShipSize() : 'medium'
    
    switch (size) {
      case 'large': return 'BL'
      case 'small': return 'BS'
      default: return 'BM'
    }
  }

  /**
   * Update boat properties from user's boat data
   */
  updateBoatProperties () {
    const boat = this.game.mulle.user.Boat
    if (!boat) {
      this.maxSpeed = 3
      this.hasEngine = false
      this.hasSail = false
      this.hasOars = false
      this.boatSize = 'medium'
      this.durability = 1
      this.shallowDraft = false
      return
    }

    const criteria = boat.criteria || {}
    const props = boat.properties || {}

    this.hasEngine = props.engine > 0 || props.outboardengine > 0
    this.hasSail = props.sailwithpole > 0
    this.hasOars = props.oar > 0

    // Calculate max speed based on propulsion and power (original: Power: 250)
    // Use boat's getSpeedFactor if available for accurate calculation
    const speedFactor = boat.getSpeedFactor ? boat.getSpeedFactor() : 0.5
    const power = props.power || 0
    
    if (this.hasEngine) {
      // Motor speed based on power (original Power: 250 = fast boat)
      // Base speed 4, +2 for powerful engines
      this.maxSpeed = 4 + (power > 0 ? Math.min(2, power / 125) : 0)
    } else if (this.hasSail) {
      this.maxSpeed = 4
    } else if (this.hasOars) {
      this.maxSpeed = 2
    } else {
      this.maxSpeed = 1 // Drifting only
    }

    // Maneuverability affects steering (original: Manoeuv: 38)
    this.steerSpeed = (props.manoeuverability || 5) / 10

    // Drift from boat properties (original: Drift: 15)
    this.driftFactor = props.drift || 0

    // Store stability values for wave calculations
    // Original: Stab: [85, 55], Stabz: 30
    if (boat.getStabilityValues) {
      this.stabilityValues = boat.getStabilityValues()
    } else {
      this.stabilityValues = {
        lateral: props.stabilitylateral || props.stability || 50,
        longitudinal: props.stabilitylongitudinal || props.stability || 50,
        z: props.stabilityz || 0,
        combined: props.stability || 50
      }
    }

    // Water resistance (original: Resist: 8)
    this.waterResistance = props.waterresistance || 0

    // Boat size affects where it can sail
    // Small boats can go in shallow water, large boats cannot
    this.boatSize = boat.getShipSize ? boat.getShipSize() : 'medium'

    // Durability determines if boat can handle reefs
    // Higher durability = can pass over reefs without damage
    this.durability = props.durability || props.hull || 1

    // Shallow draft allows sailing in shallow water regardless of size
    this.shallowDraft = criteria.ShallowWater || false

    // Reef resistance - can boat handle reef collisions?
    this.reefResistance = criteria.ReefDurability || (this.durability >= 3)

    // ==========================================
    // FUEL/ENERGY INITIALIZATION
    // ==========================================
    
    // Fuel tank capacity from boat parts (watertank can double as fuel tank)
    // Or use a default based on engine size
    const fuelTankCapacity = props.watertank || props.fueltank || 0
    if (this.hasEngine) {
      // Motor boats need fuel
      // Base capacity + bonus from fuel tank parts
      this.fuelMax = 50 + (fuelTankCapacity * 25)
      // Start with 80% fuel (like the car)
      this.fuelCurrent = this.fuelMax * 0.8
      // Outboard engines consume more fuel than regular engines
      if (props.outboardengine > 0) {
        this.fuelConsumptionRate = 0.07
      } else {
        this.fuelConsumptionRate = 0.05
      }
    } else {
      // Non-motor boats don't use fuel
      this.fuelMax = 0
      this.fuelCurrent = 0
      this.fuelConsumptionRate = 0
    }
    
    // Stamina for rowing - all boats with oars can row
    if (this.hasOars) {
      this.staminaMax = 100
      this.staminaCurrent = 100
      // Multiple oar sets make rowing easier (less stamina consumption)
      const oarCount = props.oar || 1
      this.staminaConsumptionRate = 0.03 / Math.sqrt(oarCount)
    } else {
      this.staminaMax = 0
      this.staminaCurrent = 0
      this.staminaConsumptionRate = 0
    }
    
    // Determine primary propulsion type
    if (this.hasEngine && this.fuelCurrent > 0) {
      this.currentPropulsion = PropulsionType.MOTOR
    } else if (this.hasSail) {
      this.currentPropulsion = PropulsionType.SAIL
    } else if (this.hasOars) {
      this.currentPropulsion = PropulsionType.OAR
    } else {
      this.currentPropulsion = PropulsionType.NONE
    }

    console.log('[DriveBoat] Properties - engine:', this.hasEngine, 'sail:', this.hasSail, 'oars:', this.hasOars, 'maxSpeed:', this.maxSpeed)
    console.log('[DriveBoat] Terrain capabilities - size:', this.boatSize, 'durability:', this.durability, 'shallowDraft:', this.shallowDraft, 'reefResistance:', this.reefResistance)
    console.log('[DriveBoat] Energy - fuel:', this.fuelCurrent + '/' + this.fuelMax, 'stamina:', this.staminaCurrent + '/' + this.staminaMax, 'propulsion:', this.currentPropulsion)
  }

  /**
   * Set boat direction (1-16)
   */
  setDirection (dir) {
    this.direction = dir

    if (dir > this.nrOfDirections) dir = 1
    if (dir < 1) dir = this.nrOfDirections

    this.internalDirection = dir - 1

    // Update sprite frame
    this.updateSprite()
  }

  /**
   * Update boat sprite based on direction
   */
  updateSprite () {
    const frames = this.spriteFrames[this.internalDirection]
    if (frames && frames[0]) {
      this.frameName = frames[0]
    }
  }

  /**
   * Main sailing logic - called every frame
   */
  sail () {
    if (!this.enabled) return

    // ==========================================
    // CHECK FUEL/ENERGY STATUS
    // ==========================================
    
    // Check if we've run out of fuel (motor boats)
    if (this.currentPropulsion === PropulsionType.MOTOR && this.fuelCurrent <= 0) {
      this.handleOutOfFuel()
      return
    }
    
    // Check if we've run out of stamina (rowing boats)
    if (this.currentPropulsion === PropulsionType.OAR && this.staminaCurrent <= 0) {
      this.handleOutOfStamina()
    }

    // Get input
    let steer = 0
    let throttle = 0

    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      steer = -1
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      steer = 1
    }

    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      throttle = 1
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      throttle = -0.5 // Reverse is slower
    }

    // Apply steering
    if (steer !== 0) {
      this.Steering += steer * this.steerSpeed * 0.1

      if (this.Steering > 1) this.Steering = 1
      if (this.Steering < -1) this.Steering = -1

      // Change direction based on steering
      if (Math.abs(this.Steering) > 0.3) {
        let newDir = this.direction + (this.Steering > 0 ? 1 : -1)
        if (newDir > this.nrOfDirections) newDir = 1
        if (newDir < 1) newDir = this.nrOfDirections
        this.setDirection(newDir)
        this.Steering *= 0.5
      }
    } else {
      // Return steering to center
      this.Steering *= 0.9
    }

    // ==========================================
    // PROPULSION-DEPENDENT THROTTLE
    // ==========================================
    
    // Determine effective max speed based on current propulsion
    let effectiveMaxSpeed = this.getEffectiveMaxSpeed()

    // Apply throttle
    if (throttle !== 0) {
      this.acceleration += throttle * 0.1
      if (this.acceleration > 1) this.acceleration = 1
      if (this.acceleration < -0.5) this.acceleration = -0.5
    } else {
      // Slow down when no input (water resistance)
      this.acceleration *= 0.98
    }

    // Calculate speed (limited by effective max speed)
    this.speed = this.acceleration * effectiveMaxSpeed

    // Apply movement with topology checking
    if (Math.abs(this.speed) > 0.1) {
      // Check for obstacles ahead (like car's wall detection)
      for (var d = 0; d <= 1; d++) {
        var dir = d === 0 ? -1 : 1
        var amt = this.forwardBackward === 1 ? 10 + (this.speed) : -5

        var ang = this.directionList[this.correctDirection(this.direction + dir) - 1].clone()
        ang.multiply(amt, amt)

        var tryCoordinate = this.position.clone()
        tryCoordinate.add(ang.x, ang.y)

        var check = this.pixelCheck(tryCoordinate)

        // Shore collision - cannot pass
        if (check >= 240) {
          this.setDirection(this.direction - dir)
          this.speed = this.speed * 0.8
          if (this.speed < 0.1 && this.speed > -0.1) this.speed = 0
          break
        }
      }

      const dirVec = this.directionList[this.internalDirection]

      var nextPos = this.position.clone()
      nextPos.x += dirVec.x * this.speed
      nextPos.y += dirVec.y * this.speed

      // Check terrain at next position
      var terrainCheck = this.pixelCheck(nextPos)
      var canMove = this.checkTerrainPassable(terrainCheck)

      if (canMove) {
        this.lastPosition.set(this.position.x, this.position.y)
        this.position.set(nextPos.x, nextPos.y)

        // Update forward/backward state
        if (this.speed > 0) {
          this.forwardBackward = 1
        } else if (this.speed < 0) {
          this.forwardBackward = -1
        } else {
          this.forwardBackward = 0
        }

        // Add wave drift effect using original Lingo AmplitudeList
        this.applyWaveMotion()

        // Apply current effects based on terrain
        this.applyCurrentEffects(terrainCheck)

        // ==========================================
        // CONSUME ENERGY BASED ON PROPULSION TYPE
        // ==========================================
        this.consumeEnergy()
      } else {
        // Cannot move - hit obstacle
        this.speed = 0
        this.OutOfBounds++
      }
    } else {
      // When not moving, recover stamina (if we have oars)
      this.recoverStamina()
    }

    // Store position history
    this.previousData.push([this.position.clone(), this.direction])
    this.previousData.splice(0, 1)

    // Boundary check
    this.checkBounds()
  }

  /**
   * Check if terrain is passable based on boat capabilities
   * @param {number} terrainValue - Red channel value from topology
   * @returns {boolean} - Whether boat can pass
   */
  checkTerrainPassable (terrainValue) {
    // Shore/Land - always impassable
    if (terrainValue >= 240) {
      console.log('[DriveBoat] Shore collision')
      if (!this.SoundShore) {
        var s = this.game.mulle.playAudio(this.engineSounds.shore)
        if (s) {
          s.onStop.addOnce(() => { this.SoundShore = null })
        }
        this.SoundShore = true
      }
      return false
    }

    // Reef/Rocks - requires durability
    if (terrainValue >= 160 && terrainValue <= 200) {
      if (!this.reefResistance) {
        console.log('[DriveBoat] Reef collision - need more durability')
        if (!this.SoundReef) {
          var s = this.game.mulle.playAudio(this.engineSounds.reef)
          if (s) {
            s.onStop.addOnce(() => { this.SoundReef = null })
          }
          this.SoundReef = true
        }
        this.terrainSpeedModifier = 0.1
        return false
      }
      // Can pass reef but slowly
      this.currentTerrain = SEA_TERRAIN.REEF
      this.terrainSpeedModifier = SEA_TERRAIN.REEF.speedMod
      return true
    }

    // Shallow water - requires small boat or shallow draft
    if (terrainValue >= 101 && terrainValue <= 150) {
      if (this.boatSize === 'large' && !this.shallowDraft) {
        console.log('[DriveBoat] Shallow water - boat too large')
        if (!this.SoundShallow) {
          var s = this.game.mulle.playAudio(this.engineSounds.shallow)
          if (s) {
            s.onStop.addOnce(() => { this.SoundShallow = null })
          }
          this.SoundShallow = true
        }
        this.terrainSpeedModifier = 0.2
        return false
      }
      // Small/medium boats can pass, but slowly
      this.currentTerrain = SEA_TERRAIN.SHALLOW_WATER
      this.terrainSpeedModifier = SEA_TERRAIN.SHALLOW_WATER.speedMod
      return true
    }

    // Strong current area
    if (terrainValue >= 201 && terrainValue <= 220) {
      this.currentTerrain = SEA_TERRAIN.CURRENT_STRONG
      this.terrainSpeedModifier = SEA_TERRAIN.CURRENT_STRONG.speedMod
      return true
    }

    // Medium depth water
    if (terrainValue >= 51 && terrainValue <= 100) {
      this.currentTerrain = SEA_TERRAIN.MEDIUM_WATER
      this.terrainSpeedModifier = SEA_TERRAIN.MEDIUM_WATER.speedMod
      return true
    }

    // Deep water - normal sailing
    this.currentTerrain = SEA_TERRAIN.DEEP_WATER
    this.terrainSpeedModifier = SEA_TERRAIN.DEEP_WATER.speedMod
    return true
  }

  /**
   * Apply wave motion using original Lingo AmplitudeList
   * This creates realistic bobbing motion for the boat
   * Uses all three stability values: lateral, longitudinal, and Z
   */
  applyWaveMotion () {
    // Progress through wave cycle
    this.wavePhase = (this.wavePhase + this.waveSpeed) % AMPLITUDE_LIST.length

    // Get current amplitude from original Lingo data (-100 to 100)
    const amplitude = AMPLITUDE_LIST[Math.floor(this.wavePhase)]

    // Apply wave effects based on boat properties
    const driftFactor = this.driftFactor || 1
    
    // Get all three stability factors (original: Stab: [85, 55], Stabz: 30)
    const lateralStability = this.getStabilityFactor()           // Side-to-side stability
    const longitudinalStability = this.getLongitudinalStabilityFactor()  // Front-to-back stability
    const zStability = this.getZStabilityFactor()                // Vertical stability

    // Horizontal wave drift (side to side) - affected by lateral stability
    const horizontalDrift = (amplitude / 100) * driftFactor * 0.15 * (1 - lateralStability)
    this.x += horizontalDrift

    // Longitudinal wave drift (forward/backward pitching) - affected by longitudinal stability
    // Use a phase-shifted amplitude for different wave feel
    const pitchPhase = (this.wavePhase + 25) % AMPLITUDE_LIST.length
    const pitchAmplitude = AMPLITUDE_LIST[Math.floor(pitchPhase)]
    const pitchDrift = (pitchAmplitude / 100) * driftFactor * 0.08 * (1 - longitudinalStability)
    
    // Apply pitch as forward/backward motion based on current direction
    const dirVec = this.directionList[this.internalDirection]
    if (dirVec) {
      this.x += dirVec.x * pitchDrift * 0.5
      this.y += dirVec.y * pitchDrift * 0.5
    }

    // Vertical bobbing (heave) - affected by Z stability
    // Use another phase-shifted amplitude for vertical motion
    const heavePhase = (this.wavePhase + 50) % AMPLITUDE_LIST.length
    const heaveAmplitude = AMPLITUDE_LIST[Math.floor(heavePhase)]
    const heaveDrift = (heaveAmplitude / 100) * driftFactor * 0.05 * (1 - zStability)
    this.y += heaveDrift

    // Roll rotation hint for visual (not affecting actual direction)
    // This could be used by the sprite renderer for tilt effect
    this.waveRoll = (amplitude / 100) * 0.05 * (1 - lateralStability)
    
    // Pitch rotation hint
    this.wavePitch = (pitchAmplitude / 100) * 0.03 * (1 - longitudinalStability)
  }

  /**
   * Get stability factor (0-1) based on boat properties
   * Higher stability = less wave effect
   * Uses original Lingo format: Stab: [lateral, longitudinal], Stabz
   */
  getStabilityFactor () {
    if (!this.stabilityValues) {
      const boat = this.game.mulle.user.Boat
      if (!boat || !boat.properties) return 0.5
      
      this.stabilityValues = boat.getStabilityValues ? boat.getStabilityValues() : {
        lateral: boat.properties.stability || 50,
        longitudinal: boat.properties.stability || 50,
        z: 0,
        combined: boat.properties.stability || 50
      }
    }

    // Use lateral stability for side-to-side wave resistance
    // Original values were around 85, 55 so we normalize to that range
    const lateralStability = this.stabilityValues.lateral || 50
    
    // Normalize to 0-1 range (85 = very stable = 0.85 factor)
    return Math.min(1, lateralStability / 100)
  }

  /**
   * Get longitudinal stability factor for front-to-back motion
   * @returns {number} 0-1 factor
   */
  getLongitudinalStabilityFactor () {
    if (!this.stabilityValues) return 0.5
    
    const longStability = this.stabilityValues.longitudinal || 50
    return Math.min(1, longStability / 100)
  }

  /**
   * Get Z-axis stability for vertical bobbing
   * @returns {number} 0-1 factor
   */
  getZStabilityFactor () {
    if (!this.stabilityValues) return 0.3
    
    const zStability = this.stabilityValues.z || 30
    return Math.min(1, zStability / 100)
  }

  /**
   * Apply current/wave effects based on terrain
   * @param {number} terrainValue - Red channel value from topology
   */
  applyCurrentEffects (terrainValue) {
    // Strong current areas push the boat
    if (terrainValue >= 201 && terrainValue <= 220) {
      // Current direction encoded in green channel (0-255 maps to 0-360 degrees)
      if (this.topology) {
        var coord = this.getTopologyCoord(this.position)
        var pix = this.topology.getPixel(coord.x, coord.y)
        var currentAngle = (pix.g / 255) * Math.PI * 2
        var currentStrength = 0.5

        this.x += Math.sin(currentAngle) * currentStrength
        this.y -= Math.cos(currentAngle) * currentStrength
      }
    }

    // Wave resistance in deep water (slight random drift)
    if (terrainValue <= 50) {
      var waveForce = 0.1
      this.x += Math.sin(this.game.time.now / 800) * waveForce
      this.y += Math.cos(this.game.time.now / 1200) * waveForce * 0.5
    }
  }

  /**
   * Get topology coordinate from world position
   * @param {Phaser.Point} worldPos - World position
   * @returns {Phaser.Point} - Topology bitmap coordinate
   */
  getTopologyCoord (worldPos) {
    var tryX = Math.round((worldPos.x - this.mapOffset.x) / 2)
    var tryY = Math.round((worldPos.y - this.mapOffset.y) / 2)
    return new Phaser.Point(tryX, tryY)
  }

  /**
   * Check pixel value at coordinate (terrain type)
   * Similar to MulleDriveCar.pixelCheck
   * @param {Phaser.Point} coord - World coordinate to check
   * @returns {number} - Red channel value (terrain type)
   */
  pixelCheck (coord) {
    if (!this.topology) {
      // No topology loaded - assume deep water
      return 25
    }

    var tryX = Math.round((coord.x - this.mapOffset.x) / 2)
    var tryY = Math.round((coord.y - this.mapOffset.y) / 2)

    // Bounds check
    if (tryX < 0 || tryY < 0 || tryX >= 316 || tryY >= 198) {
      // Out of topology bounds - treat as shore
      return 240
    }

    var pix = this.topology.getPixel(tryX, tryY)
    return pix.r
  }

  /**
   * Get current water depth info
   * @returns {object} - Terrain info object
   */
  getWaterDepth () {
    return {
      terrain: this.currentTerrain,
      speedModifier: this.terrainSpeedModifier,
      canPass: this.terrainSpeedModifier > 0
    }
  }

  /**
   * Correct direction to valid range (1-16)
   */
  correctDirection (i) {
    if (i > this.nrOfDirections) return i - this.nrOfDirections
    if (i < 1) return i + this.nrOfDirections
    return i
  }

  /**
   * Step back to previous position (recovery from stuck)
   */
  stepback (nr) {
    console.log('[DriveBoat] stepback', nr)
    var temp = this.previousData[(this.previousData.length - 1) - nr]
    this.position.set(temp[0].x, temp[0].y)
    this.direction = temp[1]
  }

  /**
   * Get effective max speed based on current propulsion and energy levels
   */
  getEffectiveMaxSpeed () {
    switch (this.currentPropulsion) {
      case PropulsionType.MOTOR:
        // Motor: full speed if has fuel
        return this.fuelCurrent > 0 ? this.maxSpeed : 0.5 // Drift speed when out of fuel
        
      case PropulsionType.SAIL:
        // Sail: wind-powered, free energy but speed varies with wind
        // For now, use a constant wind factor (could add wind system later)
        const windFactor = 0.8 + Math.sin(this.game.time.now / 5000) * 0.2
        return this.maxSpeed * windFactor
        
      case PropulsionType.OAR:
        // Oar: speed decreases as stamina depletes
        const staminaFactor = this.staminaCurrent / this.staminaMax
        // At 50% stamina, still 75% speed. Below 20% stamina, speed drops significantly
        const speedMod = staminaFactor > 0.5 ? 0.5 + (staminaFactor * 0.5) : staminaFactor * 2.5
        return this.maxSpeed * Math.max(0.2, speedMod)
        
      case PropulsionType.NONE:
      default:
        // No propulsion: drift only
        return 0.5
    }
  }

  /**
   * Consume energy based on current propulsion type and speed
   */
  consumeEnergy () {
    const absSpeed = Math.abs(this.speed)
    
    switch (this.currentPropulsion) {
      case PropulsionType.MOTOR:
        // Motor boats consume fuel proportional to speed
        const fuelUsed = absSpeed * this.fuelConsumptionRate
        this.fuelCurrent = Math.max(0, this.fuelCurrent - fuelUsed)
        
        // Check for low fuel warning
        if (!this.fuelWarningShown && this.fuelCurrent / this.fuelMax <= this.fuelWarningThreshold) {
          this.fuelWarningShown = true
          this.onLowFuel()
        }
        break
        
      case PropulsionType.OAR:
        // Rowing consumes stamina
        const staminaUsed = absSpeed * this.staminaConsumptionRate
        this.staminaCurrent = Math.max(0, this.staminaCurrent - staminaUsed)
        
        // Check for low stamina warning
        if (!this.staminaWarningShown && this.staminaCurrent / this.staminaMax <= this.staminaWarningThreshold) {
          this.staminaWarningShown = true
          this.onLowStamina()
        }
        break
        
      case PropulsionType.SAIL:
        // Sailboats don't consume energy (wind power is free!)
        break
        
      case PropulsionType.NONE:
      default:
        // No propulsion, no consumption
        break
    }
  }

  /**
   * Recover stamina when not actively rowing
   */
  recoverStamina () {
    if (this.hasOars && this.staminaCurrent < this.staminaMax) {
      this.staminaCurrent = Math.min(this.staminaMax, this.staminaCurrent + this.staminaRecoveryRate)
      
      // Reset warning if stamina recovers above threshold
      if (this.staminaWarningShown && this.staminaCurrent / this.staminaMax > this.staminaWarningThreshold + 0.1) {
        this.staminaWarningShown = false
      }
    }
  }

  /**
   * Called when fuel runs out
   */
  handleOutOfFuel () {
    if (!this.outOfFuel) {
      this.outOfFuel = true
      this.enabled = false
      
      // Stop engine sound
      this.stopEngine()
      
      console.log('[DriveBoat] Out of fuel!')
      
      // Play out of fuel sound (similar to car)
      // Using a similar sound to the car's fuel empty sound
      var sound = this.game.mulle.playAudio('05d011v0')
      
      if (sound) {
        sound.onStop.addOnce(() => {
          // After sound plays, try to fall back to alternative propulsion
          this.fallbackPropulsion()
        })
      } else {
        this.fallbackPropulsion()
      }
    }
  }

  /**
   * Called when stamina runs out
   */
  handleOutOfStamina () {
    if (!this.outOfStamina) {
      this.outOfStamina = true
      console.log('[DriveBoat] Out of stamina! Resting...')
      
      // Can't row anymore, switch to drift or sail if available
      this.fallbackPropulsion()
    }
    
    // Continue recovering stamina even when out
    this.recoverStamina()
    
    // If stamina recovered enough, allow rowing again
    if (this.staminaCurrent > this.staminaMax * 0.3) {
      this.outOfStamina = false
      if (this.currentPropulsion === PropulsionType.NONE && this.hasOars) {
        this.currentPropulsion = PropulsionType.OAR
        console.log('[DriveBoat] Stamina recovered, can row again')
      }
    }
  }

  /**
   * Fall back to alternative propulsion when primary fails
   */
  fallbackPropulsion () {
    const previousPropulsion = this.currentPropulsion
    
    // Try alternative propulsion methods
    if (this.hasSail) {
      this.currentPropulsion = PropulsionType.SAIL
      console.log('[DriveBoat] Falling back to sail')
    } else if (this.hasOars && this.staminaCurrent > 0) {
      this.currentPropulsion = PropulsionType.OAR
      console.log('[DriveBoat] Falling back to oars')
    } else {
      this.currentPropulsion = PropulsionType.NONE
      console.log('[DriveBoat] No propulsion available, drifting')
    }
    
    // Re-enable boat if we found alternative propulsion
    if (this.currentPropulsion !== PropulsionType.NONE) {
      this.enabled = true
      this.outOfFuel = false
    }
    
    // Recalculate max speed for new propulsion
    this.updateMaxSpeedForPropulsion()
    
    // Notify state (seaworld) about propulsion change
    if (this.state && this.state.onPropulsionChange) {
      this.state.onPropulsionChange(previousPropulsion, this.currentPropulsion)
    }
  }

  /**
   * Update max speed when propulsion changes
   */
  updateMaxSpeedForPropulsion () {
    switch (this.currentPropulsion) {
      case PropulsionType.MOTOR:
        this.maxSpeed = 6
        break
      case PropulsionType.SAIL:
        this.maxSpeed = 4
        break
      case PropulsionType.OAR:
        this.maxSpeed = 2
        break
      case PropulsionType.NONE:
      default:
        this.maxSpeed = 0.5 // Drift only
        break
    }
  }

  /**
   * Called when fuel is low - for UI notifications
   */
  onLowFuel () {
    console.log('[DriveBoat] Low fuel warning!')
    // This will be handled by seaworld.js for UI display
    if (this.state && this.state.onLowFuel) {
      this.state.onLowFuel(this.fuelCurrent, this.fuelMax)
    }
  }

  /**
   * Called when stamina is low - for UI notifications
   */
  onLowStamina () {
    console.log('[DriveBoat] Low stamina warning!')
    // This will be handled by seaworld.js for UI display
    if (this.state && this.state.onLowStamina) {
      this.state.onLowStamina(this.staminaCurrent, this.staminaMax)
    }
  }

  /**
   * Refuel the boat (called from fuel station or boatyard)
   */
  refuel (amount) {
    if (this.fuelMax > 0) {
      this.fuelCurrent = Math.min(this.fuelMax, this.fuelCurrent + amount)
      this.outOfFuel = false
      this.fuelWarningShown = false
      
      // If we were drifting due to no fuel, restore motor propulsion
      if (this.hasEngine && this.currentPropulsion !== PropulsionType.MOTOR) {
        this.currentPropulsion = PropulsionType.MOTOR
        this.enabled = true
        this.updateMaxSpeedForPropulsion()
      }
      
      console.log('[DriveBoat] Refueled to', this.fuelCurrent + '/' + this.fuelMax)
    }
  }

  /**
   * Get fuel percentage (0-1)
   */
  getFuelPercentage () {
    if (this.fuelMax <= 0) return 1 // Non-motor boats are always "full"
    return this.fuelCurrent / this.fuelMax
  }

  /**
   * Get stamina percentage (0-1)
   */
  getStaminaPercentage () {
    if (this.staminaMax <= 0) return 1 // Non-rowing boats are always "full"
    return this.staminaCurrent / this.staminaMax
  }

  /**
   * Check if boat can still move
   */
  canMove () {
    switch (this.currentPropulsion) {
      case PropulsionType.MOTOR:
        return this.fuelCurrent > 0
      case PropulsionType.OAR:
        return this.staminaCurrent > 0
      case PropulsionType.SAIL:
        return true // Wind is always available
      case PropulsionType.NONE:
      default:
        return true // Can always drift
    }
  }

  /**
   * Check if boat is within sea bounds
   */
  checkBounds () {
    const margin = 50

    if (this.x < margin) {
      this.x = margin
      this.OutOfBounds = -1
    } else if (this.x > 640 - margin) {
      this.x = 640 - margin
      this.OutOfBounds = 1
    }

    if (this.y < margin) {
      this.y = margin
      this.OutOfBounds = -2
    } else if (this.y > 480 - margin) {
      this.y = 480 - margin
      this.OutOfBounds = 2
    }
  }

  /**
   * Start engine sound
   */
  startEngine () {
    if (this.engineRunning) return
    this.engineRunning = true

    if (this.hasEngine && this.engineSounds.motor) {
      this.game.mulle.playAudio(this.engineSounds.motor, true)
    }
  }

  /**
   * Stop engine sound
   */
  stopEngine () {
    if (!this.engineRunning) return
    this.engineRunning = false

    if (this.engineSounds.motor) {
      this.game.mulle.stopAudio(this.engineSounds.motor)
    }
  }

  /**
   * Clean up
   */
  destroy () {
    if (this.logicLoop) {
      this.game.time.events.remove(this.logicLoop)
    }
    this.stopEngine()
    super.destroy()
  }

  /**
   * Get spawn line data for a given direction index
   * Used when entering seaworld from a specific edge/direction
   * @param {number} index - Direction index (0-15)
   * @returns {Object} Spawn data with pos {x,y} and dir {x,y}
   */
  static getSpawnLine (index) {
    if (index < 0 || index >= SPAWN_LINES.length) {
      index = 0
    }
    return SPAWN_LINES[index]
  }

  /**
   * Get spawn line for entering from a map edge
   * @param {string} edge - 'north', 'south', 'east', 'west'
   * @returns {Object} Best spawn line for that edge
   */
  static getSpawnLineForEdge (edge) {
    // Map edges to spawn line indices (16 directions around the screen)
    // Spawn lines are arranged clockwise starting from South-Southwest
    // Index 0: bottom-left area, Index 4: top-left, Index 8: top-right, Index 12: bottom-right
    const edgeMap = {
      'south': 0,   // Enter from south - spawn at bottom, face north
      'southwest': 1,
      'west': 3,    // Enter from west - spawn at left, face east
      'northwest': 5,
      'north': 7,   // Enter from north - spawn at top, face south
      'northeast': 9,
      'east': 11,   // Enter from east - spawn at right, face west
      'southeast': 13
    }
    
    const index = edgeMap[edge.toLowerCase()] || 0
    return SPAWN_LINES[index]
  }

  /**
   * Get the direction index (1-16) that corresponds to a spawn line's direction vector
   * @param {Object} spawnLine - Spawn line with dir {x,y}
   * @returns {number} Direction index (1-16) for setDirection()
   */
  static getDirectionFromSpawnLine (spawnLine) {
    // Find the closest match in DIRECTION_LIST
    const dirX = spawnLine.dir.x
    const dirY = spawnLine.dir.y
    
    let bestMatch = 1
    let bestDist = Infinity
    
    for (let i = 0; i < DIRECTION_LIST.length; i++) {
      const dx = DIRECTION_LIST[i].x - dirX
      const dy = DIRECTION_LIST[i].y - dirY
      const dist = dx * dx + dy * dy
      
      if (dist < bestDist) {
        bestDist = dist
        bestMatch = i + 1 // Directions are 1-indexed
      }
    }
    
    return bestMatch
  }

  /**
   * Get all spawn lines (for debugging/visualization)
   * @returns {Array} Array of all 16 spawn lines
   */
  static getAllSpawnLines () {
    return SPAWN_LINES
  }
}

// Export constants for external use
MulleDriveBoat.SPAWN_LINES = SPAWN_LINES
MulleDriveBoat.DIRECTION_LIST = DIRECTION_LIST
MulleDriveBoat.AMPLITUDE_LIST = AMPLITUDE_LIST

export default MulleDriveBoat
