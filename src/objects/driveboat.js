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
 * 
 * REFACTORING NOTE:
 * This file has been split into modular components in ./boat/:
 * - BoatConstants.js - SEA_TERRAIN, PropulsionType, DIRECTION_LIST, AMPLITUDE_LIST, SPAWN_LINES
 * - BoatSpawn.js - getSpawnLine, getSpawnLineForEdge, getDirectionFromSpawnLine
 * - BoatTerrain.js - pixelCheck, checkTerrainPassable, checkDepthAtCorners, getRequiredDepth
 * - BoatEnergy.js - consumeEnergy, handleOutOfFuel, refuel, consumeBelly, hunger/pills systems
 * - BoatPropulsion.js - initSail, getWindForce, applyOarForce, startEngine, stopEngine
 * - BoatDamage.js - crashed, checkCapsize, handleBoatBreak
 * - BoatPhysics.js - applyWaveMotion, getStabilityFactor, checkBounds, stepback
 * 
 * Constants below are kept for backward compatibility.
 * Future refactoring should import from ./boat/ modules instead.
 */
'use strict'

import MulleSprite from 'objects/sprite'

// Import constants and utilities from boat modules
import {
  SEA_TERRAIN,
  PropulsionType,
  DIRECTION_LIST,
  AMPLITUDE_LIST,
  SPAWN_LINES,
  TOPOLOGY,
  DEFAULT_BOAT_PROPS
} from './boat/BoatConstants'

import {
  getSpawnLine,
  getSpawnLineForEdge,
  getDirectionFromSpawnLine
} from './boat/BoatSpawn'

import * as BoatTerrain from './boat/BoatTerrain'
import * as BoatEnergy from './boat/BoatEnergy'
import * as BoatPropulsion from './boat/BoatPropulsion'
import * as BoatDamage from './boat/BoatDamage'
import * as BoatPhysics from './boat/BoatPhysics'

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
    this.displayFramesByMember = {}
    this.displayFramesLoaded = false
    this.displayInclinations = null
    this.inclinations = [0, 0]
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
    
    // BUG FIX: Initialize acceleration to 0 (will be set from boat properties)
    this.acceleration = 0
    this.retardation = 0

    this.reachForSpeed = 0

    this.Steering = 0

    this.forwardBackward = 0

    // Lingo: speedDivider (1 normal, 2 in shallow water)
    this.speedDivider = 1
    
    // #111: zeroSpeedWait - 15 tick delay when reversing direction
    this.zeroSpeedWait = 0

    this.lastPosition = new Phaser.Point(0, 0)
    this.previousData = []
    for (var i = 0; i < 10; i++) {
      this.previousData.push([new Phaser.Point(0, 0), 1])
    }

    this.OutOfBounds = 0

    // BUG FIX #3: internalDirection - sub-degree precision (direction * decimalPrec)
    // Original: set internalDirection to direction * decimalPrec
    this.internalDirection = 1 * this.decimalPrec

    this.keySteer = 1

    // Match DepthChecker.ls: (argLoc - point(4, 4)) / 2
    this.mapOffset = new Phaser.Point(
      DEFAULT_BOAT_PROPS.mapOffset.x,
      DEFAULT_BOAT_PROPS.mapOffset.y
    )

    // Topology bitmap reference (set by seaworld.js)
    this.topology = null

    // Current terrain info
    this.currentTerrain = SEA_TERRAIN.DEEP_WATER
    this.terrainSpeedModifier = 1.0

    // Lingo: changedMapRecently prevents stepback right after a map switch
    this.changedMapRecently = 0

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
    
    // #120: Corner points for depth checking (3 corners of boat)
    // Front center, front-left, front-right
    this.cornerPoints = []
    for (var i = 1; i <= this.directionList.length; i++) {
      const forward = this.directionList[i - 1]
      const perpX = -forward.y
      const perpY = forward.x
      
      this.cornerPoints.push([
        new Phaser.Point(forward.x * 10, forward.y * 10),                    // Front center
        new Phaser.Point(forward.x * 8 + perpX * 4, forward.y * 8 + perpY * 4),  // Front-left
        new Phaser.Point(forward.x * 8 - perpX * 4, forward.y * 8 - perpY * 4)   // Front-right
      ])
    }
    // Corner points are in topology units (Lingo: DepthChecker uses them without /2)
    this.cornerPointsScale = 1
    
    // #124: decimalPrec constant for fixed-point math (position / 100)
    this.decimalPrec = 100

    this.setDirection(1)

    // Input controls
    this.cursors = this.game.input.keyboard.createCursorKeys()
    this.wasd = this.game.input.keyboard.addKeys({
      'up': Phaser.KeyCode.W,
      'down': Phaser.KeyCode.S,
      'left': Phaser.KeyCode.A,
      'right': Phaser.KeyCode.D
    })
    
    // BUG FIX #2/#12: Event-driven key handling with keyUp handlers
    // Reset steering immediately when keys released
    this.cursors.left.onUp.add(() => { this.Steering = 0 })
    this.cursors.right.onUp.add(() => { this.Steering = 0 })
    this.wasd.left.onUp.add(() => { this.Steering = 0 })
    this.wasd.right.onUp.add(() => { this.Steering = 0 })
    
    // BUG FIX #6: Shift/Control key support for speed control
    this.shiftKey = this.game.input.keyboard.addKey(Phaser.KeyCode.SHIFT)
    this.controlKey = this.game.input.keyboard.addKey(Phaser.KeyCode.CONTROL)
    
    // BUG FIX #8: Mouse steering mode
    this.steerMethod = 'Keys' // Lingo: #Keys or #mouse
    
    // BUG FIX #7: speedChangeSpeed constant
    this.speedChangeSpeed = 5

    // Logic loop at 30fps
    this.logicLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 30, this.sail, this)

    this.game.physics.enable(this, Phaser.Physics.ARCADE)

    // Debug movement logging (enable when game.debug is on)
    this.debugMovement = !!(this.game && this.game.debug)
    this._lastDebugLog = 0

    // Boat sounds
    this.engineSounds = {
      motor: 'boten_CDDATA.CXT/00e007v0',
      sail: 'boten_CDDATA.CXT/00e008v0',
      splash: 'boten_CDDATA.CXT/00e001v0',
      reef: '05d002v0',      // Reuse car rock sound
      shore: '05d001v0',     // Collision sound
      shallow: '05d003v0',   // Reuse car mud sound for shallow water
      crash: '05d001v0',     // #189: Collision/crash sound
      crashHeavy: '05d002v0' // #189: Heavy collision sound
    }

    // Lingo audio: BoatBase.ls crashed() — hardcoded crash sound (line 368)
    this.crashSound = '05e008v1'

    // Lingo audio: shallow water ambient sounds (DepthChecker)
    // Randomly selected when boat is in shallow water zones
    this.shallowWaterAmbient = ['05e058v0', '05e059v0', '05e060v0']
    
    // #109, #110: 8 different engine sounds with dynamic pitch
    // From MotorBoatAncestor.ls lines 134-142
    // Each engine type has 3 sound files for variation
    // BUG FIX #1: Corrected motor sound IDs to match original Lingo (MotorBoatAncestor.ls:10)
    this.motorSounds = [
      ['05e018v1', '05e019v1', '05e016v1'],  // Engine type 1
      ['05e018v0', '05e019v0', '05e016v0'],  // Engine type 2
      ['05e030v0', '05e031v0', '05e032v1'],  // Engine type 3
      ['05e056v0', '05e057v0', '05e055v0'],  // Engine type 4
      ['05e034v0', '05e035v0', '05e033v0'],  // Engine type 5
      ['05e022v0', '05e023v0', '05e020v0'],  // Engine type 6
      ['05e053v0', '05e054v0', '05e052v0'],  // Engine type 7
      ['05e026v0', '05e027v0', '05e024v0']   // Engine type 8
    ]
    
    // #110: Pitch percentages for each engine type (affects dynamic pitch calculation)
    // BUG FIX #3: Corrected pitch values to match original Lingo (MotorBoatAncestor.ls:8)
    this.pitchPercents = [100, 100, 30, 100, 200, 100, 200, 50]
    
    // Motor volumes for each engine type (Director scale 0-255, converted to 0-1 for Web Audio)
    // BUG FIX #2: Corrected volume levels to match original Lingo (MotorBoatAncestor.ls:9)
    // Original: 80 * [60, 55, 100, 70, 100, 78, 70, 100] / 100 = [48, 44, 80, 56, 80, 62.4, 56, 80]
    this.motorVolumes = [48, 44, 80, 56, 80, 62.4, 56, 80]
    
    // Current engine type and sound
    this.currentEngineType = 1
    this.currentMotorSound = null
    this.pitchPercent = 50
    this.dynamicPitch = 22050

    // Engine state
    this.engineRunning = false
    
    // BUG FIX #4: Sail wind sounds (from SailBoatAncestor.ls)
    // Plays random sail sounds every 100-200 frames when sailing
    this.sailSounds = ['05e044v0', '05e044v1']
    this.sailSoundCounter = 0
    this.sailSoundInterval = 0  // Random interval between 100-200 frames
    
    // BUG FIX #9: Track current oar sound to prevent overlapping
    this.currentOarSound = null
    
    // #95: Durability/damage system
    // Durability is multiplied by 1000 (original formula: Durability * 1000)
    this.Durability = null  // Will be set from boat properties
    this.maxDurability = null
    
    // #189: Collision/crash tracking
    this.lastCrashTime = 0
    this.crashCooldown = 1000  // Minimum time between crash sounds (ms)
    
    // #98: Capsize tracking
    this.sideAngle = 0  // Current tilt angle
    this.swayHistory = []  // Track sway for buffaSick calculation
    
    // #99: Lurch warnings
    this.lastLurchWarning = 0

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

    // ==========================================
    // INVENTORY SYSTEMS: Pills (buffaSick) and Belly (mulleHunger)
    // From ParentScript 34 - BoatBase.ls
    // ==========================================
    
    // buffaSick system - Pills consumption (seasickness/vomit prevention)
    // Original: set buffaSick to 1000 + (tmpPills * 25)
    // Decreases during sailing at higher levels (level >= 4)
    this.buffaSick = 1000  // Will be set from Pills inventory
    this.buffaSickSpeed = 0  // How fast it decreases (calculated from wave motion)
    
    // mulleHunger system - Belly hunger tracking
    // Original: set mulleHunger to 1000, scales to 10000 internally
    // Decreases during sailing, fishing rod saves when reaches 0
    this.mulleHunger = 10000  // Will be set from Belly inventory (* 10)
    this.mulleHungerSpeed = 3  // Default speed (2 for level 2+, 3 for level 1)
    this.orgMulleHungerSpeed = 3  // Original speed before modifications
    
    // DrivenTimes tracking - increment when propulsion type changes
    this.drivenTimesTracked = false
    this.currentDrivenType = null
    
    // Level tracking for buffaSick system (only active at level 4+)
    this.seaLevel = 1

    // BUG FIX: Initialize acceleration and retardation before updateBoatProperties
    this.acceleration = 10  // Default acceleration
    this.retardation = 15   // Default retardation (faster deceleration)
    
    // Get boat properties
    this.updateBoatProperties()
    
    // Initialize inventory systems after boat properties are set
    this.initializeInventorySystems()

    // #112: Sail object with direction display
    this.Sail = null
    if (this.hasSail) {
      this.initSail()
    }

    // #115: oarForce curve - 25 values for rowing animation
    this.oarForce = [20, 20, 20, 20, 40, 40, 40, 60, 60, 80, 100, 80, 80, 80, 60, 60, 60, 60, 40, 40, 40, 40, 20, 20, 0]
    this.forceCount = this.oarForce.length
    this.mouseForceCount = this.forceCount
    this.Oar = 0
    
    // #117: Alternating oar sounds (left/right)
    this.oarSounds = ['05d127v0', '05d126v0']
    this.soundCount = 1 // Toggles between 1 and 2

    // Track DrivenTimes for this propulsion type
    this.trackDrivenTimes()

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
    this.boatSpriteDirFile = spriteFile

    const baseImg = this.game.mulle.getDirectorImage(spriteFile, 1)
    if (baseImg && (this.key !== baseImg.key || this.frameName !== baseImg.name)) {
      this.loadTexture(baseImg.key, baseImg.name)
    }

    // Boats have 8 directions with 1 frame per direction
    let anyLoaded = false
    for (var dir = 0; dir < this.nrOfDirections; dir++) {
      this.spriteFrames[dir] = {}
      
      // Each direction has a single member (boat0000-boat0007)
      const memberNum = dir + 1
      
      const img = this.game.mulle.getDirectorImage(spriteFile, memberNum)
      if (img) {
        this.spriteFrames[dir][0] = img
        anyLoaded = true
      }
    }

    // Load full 400-frame boat sprite set for DisplayBoat parity.
    if (anyLoaded) {
      this.displayFramesByMember = {}
      const maxMembers = 400
      for (let memberNum = 1; memberNum <= maxMembers; memberNum++) {
        const img = this.game.mulle.getDirectorImage(spriteFile, memberNum)
        if (img) {
          this.displayFramesByMember[memberNum] = img
        }
      }
      this.displayFramesLoaded = Object.keys(this.displayFramesByMember).length > 0
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

    // Lingo-style quickProps used by shared boat modules (damage, sounds, drift)
    this.quickProps = this.quickProps || {}
    this.quickProps.Material = props.material ?? props.Material ?? 1
    this.quickProps.weight = props.weight ?? props.Weight ?? 50
    this.quickProps.Drift = props.drift ?? props.Drift ?? 0
    this.quickProps.ManoeuverAbility = props.manoeuverability ?? props.manoeuverability ?? props.ManoeuverAbility ?? props.maneuverability ?? 0
    this.quickProps.power = props.power ?? props.Power ?? 0
    this.quickProps.EngineSound = props.enginesound ?? props.EngineSound ?? 1
    this.quickProps.fuelConsumption = props.fuelconsumption ?? props.FuelConsumption ?? 0
    this.quickProps.SailSize = props.sailsize ?? props.SailSize ?? 0
    this.quickProps.FuelVolume = props.fuelvolume ?? props.FuelVolume ?? 0

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
    
    // Fuel tank capacity from boat parts
    // Original Lingo BoatBase.ls line 193: fuel = 4500 * FuelVolume
    // Original MotorBoatAncestor.ls line 32: fuelConsumption = quickProps.fuelConsumption
    const fuelVolume = props.fuelvolume || 1
    if (this.hasEngine) {
      // Motor boats need fuel — use Lingo scale (thousands, not tens)
      this.fuelMax = 4500 * fuelVolume
      // Start with 80% fuel
      this.fuelCurrent = this.fuelMax * 0.8
      // Use boat's fuelConsumption property (Lingo parity), fallback to 1
      this.fuelConsumptionRate = props.fuelconsumption || props.fuelConsumption || 1

      // Check if fuel should be full (from mission rewards, etc.)
      // Original Lingo: setaProp(tmp, #fuel, #Full)
      const user = this.game.mulle.user
      if (user && user.Boat && user.Boat.fuelFull) {
        this.fuelCurrent = this.fuelMax
        user.Boat.fuelFull = false // Reset the flag after applying
        user.save()
        console.log('[DriveBoat] Fuel refilled to full from mission reward!')
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

    // ==========================================
    // ITEM #100: DYNAMIC FUEL CALCULATION
    // ==========================================
    // fuel = 4500 * FuelVolume (Lingo parity)
    // Already set above with correct Lingo scale; override here only if
    // recalculated fuelvolume differs from initial.
    if (this.hasEngine && props.fuelvolume) {
      const newFuelMax = 4500 * props.fuelvolume
      if (newFuelMax !== this.fuelMax) {
        // Re-scale fuelCurrent proportionally when fuelMax changes
        const ratio = this.fuelMax > 0 ? this.fuelCurrent / this.fuelMax : 0.8
        this.fuelMax = newFuelMax
        this.fuelCurrent = this.fuelMax * ratio
      }
    }
    
    // ==========================================
    // ITEM #101/#102: DERIVED PROPS FROM LINGO RECALC
    // ==========================================
    // Use MulleBoat.recalculateBoatProps (RecalcBoatProps.ls parity) when available.
    // This yields correct acceleration/retardation, stabilities, and speedList.
    let recalculated = null
    if (boat && typeof boat.recalculateBoatProps === 'function') {
      const propulsionType = this.hasEngine ? 'Motor' : (this.hasSail ? 'Sail' : (this.hasOars ? 'Oar' : 'Motor'))
      recalculated = boat.recalculateBoatProps(propulsionType)
    }

    // Manoeuverability (steering) from recalc
    if (recalculated && typeof recalculated.manoeuverability === 'number') {
      this.quickProps.ManoeuverAbility = recalculated.manoeuverability
      this.steerSpeed = recalculated.manoeuverability / 10
    }

    // Stabilities
    if (recalculated && recalculated.stabilities) {
      this.stabilities = recalculated.stabilities
    } else if (boat.getStabilities) {
      this.stabilities = boat.getStabilities()
    } else {
      // Calculate from stability values
      const lateral = this.stabilityValues.lateral || 50
      const longitudinal = this.stabilityValues.longitudinal || 50
      this.stabilities = [lateral, longitudinal]
    }

    // SpeedList (already scaled by resistance in recalc)
    if (recalculated && Array.isArray(recalculated.speedList) && recalculated.speedList.length) {
      this.speedList = recalculated.speedList
    } else {
      // Fallback to legacy generator (less accurate)
      this.speedList = this.generateSpeedList(props)
    }

    // Corner points (depth checking hitbox) from Lingo recalc
    if (recalculated && Array.isArray(recalculated.cornerPointsList) && recalculated.cornerPointsList.length) {
      this.cornerPoints = recalculated.cornerPointsList
      // Lingo DepthChecker expects corner points in topology units (no /2 scaling)
      this.cornerPointsScale = 1
    }

    // RealDepth is required for DepthChecker parity (depth thresholds are not size-based)
    if (recalculated && typeof recalculated.realDepth === 'number') {
      this.quickProps.RealDepth = recalculated.realDepth
    } else if (typeof props.realDepth === 'number') {
      this.quickProps.RealDepth = props.realDepth
    } else if (typeof props.RealDepth === 'number') {
      this.quickProps.RealDepth = props.RealDepth
    }
    
    // ==========================================
    // ITEM #95: DURABILITY FROM BOAT
    // ==========================================
    // Prefer recalculated durability (already *1000 in RecalcBoatProps)
    if (this.Durability === null || this.Durability === undefined) {
      if (recalculated && recalculated.durability) {
        this.Durability = recalculated.durability
      } else {
        this.Durability = (props.durability || 1) * 1000
      }
      this.maxDurability = this.Durability
    }
    
    // ==========================================
    // BUG FIX #9: GET ACCELERATION AND RETARDATION FROM BOAT
    // ==========================================
    // Prefer recalculated values (Lingo parity). Fallback to props/defaults.
    if (recalculated && recalculated.acceleration) {
      this.acceleration = recalculated.acceleration
    } else {
      this.acceleration = props.acceleration || 10
    }
    if (recalculated && recalculated.retardation) {
      this.retardation = recalculated.retardation
    } else {
      this.retardation = props.retardation || 15
    }

    console.log('[DriveBoat] Properties - engine:', this.hasEngine, 'sail:', this.hasSail, 'oars:', this.hasOars, 'maxSpeed:', this.maxSpeed)
    console.log('[DriveBoat] Terrain capabilities - size:', this.boatSize, 'durability:', this.Durability, 'shallowDraft:', this.shallowDraft, 'reefResistance:', this.reefResistance)
    console.log('[DriveBoat] Energy - fuel:', this.fuelCurrent + '/' + this.fuelMax, 'stamina:', this.staminaCurrent + '/' + this.staminaMax, 'propulsion:', this.currentPropulsion)
    console.log('[DriveBoat] Stability:', this.stabilities, 'speedList entries:', this.speedList.length)
    console.log('[DriveBoat] Physics - acceleration:', this.acceleration, 'retardation:', this.retardation)
  }
  
  /**
   * ITEM #102: Generate speedList lookup table
   * Original: from SpeedLists member with resistance scaling
   * speedList = (100 - RealResistance) * speedList / 10
   */
  generateSpeedList (props) {
    const power = props.power || 0
    const resistance = props.waterresistance || props.resistance || 0
    const weight = props.weight || 50
    
    // Generate 250-entry lookup table (as in original)
    const speedList = []
    
    for (let i = 0; i <= 250; i++) {
      // Base speed calculation from power
      // Original uses complex lookup table, we'll use a formula
      let baseSpeed = (i * power) / 100
      
      // Apply resistance scaling: (100 - resistance) * speed / 10
      const resistanceFactor = (100 - resistance) / 10
      let speed = (baseSpeed * resistanceFactor) / 10
      
      // Weight affects top speed
      speed = speed * (100 / (weight + 50))
      
      speedList.push(Math.max(0, speed))
    }
    
    return speedList
  }

  /**
   * Initialize inventory systems: Pills (buffaSick) and Belly (mulleHunger)
   * Original Lingo: lines 23-33 of ParentScript 34 - BoatBase.ls
   */
  initializeInventorySystems () {
    const user = this.game.mulle.user
    if (!user) return

    // Get sea level for hunger speed calculation
    this.seaLevel = user.getSeaLevel ? user.getSeaLevel() : 1
    
    // Set orgMulleHungerSpeed based on level
    // Original: if level = 1 then orgMulleHungerSpeed = 3 else orgMulleHungerSpeed = 2
    if (this.seaLevel === 1) {
      this.orgMulleHungerSpeed = 3
    } else {
      this.orgMulleHungerSpeed = 2
    }
    this.mulleHungerSpeed = this.orgMulleHungerSpeed

    // Initialize Pills/buffaSick system
    // Original: set tmpPills to lookUpInventory(the user of gMulleGlobals, #Pills)
    //           if listp(tmpPills) then set tmpPills to getaProp(tmpPills, #nr)
    //           set buffaSick to 1000 + (tmpPills * 25)
    const pillsData = user.lookUpInventory('Pills')
    let pillsNr = 0
    if (pillsData && typeof pillsData === 'object' && pillsData.nr !== undefined) {
      pillsNr = pillsData.nr
    }
    this.buffaSick = 1000 + (pillsNr * 25)
    
    // Initialize Belly/mulleHunger system
    // Original: set mulleHunger to 1000
    //           set tmpHunger to lookUpInventory(the user of gMulleGlobals, #Belly)
    //           if listp(tmpHunger) then set mulleHunger to getaProp(tmpHunger, #nr)
    //           set mulleHunger to mulleHunger * 10
    this.mulleHunger = 1000  // Default
    const bellyData = user.lookUpInventory('Belly')
    if (bellyData && typeof bellyData === 'object' && bellyData.nr !== undefined) {
      this.mulleHunger = bellyData.nr
    }
    this.mulleHunger = this.mulleHunger * 10  // Scale to internal range (0-10000)
    
    console.log('[DriveBoat] Inventory initialized - Pills:', pillsNr, 'buffaSick:', this.buffaSick, 'Belly:', (bellyData ? bellyData.nr : 0), 'mulleHunger:', this.mulleHunger)
  }

  /**
   * Set boat direction (1-16)
   * BUG FIX #3: Update internalDirection with decimalPrec scaling
   */
  setDirection (dir) {
    if (dir > this.nrOfDirections) dir = 1
    if (dir < 1) dir = this.nrOfDirections
    
    this.direction = dir

    // BUG FIX #3: internalDirection uses decimalPrec for sub-degree precision
    // Original: set internalDirection to direction * decimalPrec
    this.internalDirection = dir * this.decimalPrec

    // Update current corner points for wave sampling (Lingo currentCorners)
    if (this.cornerPoints && this.cornerPoints[dir - 1]) {
      this.currentCorners = this.cornerPoints[dir - 1]
    }

    // Update sprite frame
    this.updateSprite()
  }

  /**
   * Update boat sprite based on direction
   * BUG FIX: Use discrete direction, not internalDirection (which is scaled)
   */
  updateSprite () {
    // Lingo DisplayBoat uses: tmpDir = 1 + (direction mod 16)
    // This shifts the display frame by +1 direction.
    const displayDir = this.correctDirection(this.direction + 1)
    // If we have Lingo-style inclination data + full frame set, use DisplayBoat logic.
    if (this.displayInclinations && this.displayFramesLoaded) {
      const sideList = [2, 1, 0, 4, 3]
      const frontBackList = [2, 1, 0, 4, 3]

      const sideRaw = this.displayInclinations[1] || 0
      const frontBackRaw = this.displayInclinations[2] || 0
      const side = Math.max(-2, Math.min(2, Math.round(sideRaw)))
      const frontBack = Math.max(-2, Math.min(2, Math.round(frontBackRaw)))

      const sideIdx = side + 2
      const frontBackIdx = frontBack + 2
      const sideVal = sideList[sideIdx] ?? 0
      const frontBackVal = frontBackList[frontBackIdx] ?? 0

      const memberNum = displayDir + (80 * sideVal) + (16 * frontBackVal)
      const frameInfo = this.displayFramesByMember[memberNum]
      if (frameInfo) {
        if (this.key === frameInfo.key) {
          this.frameName = frameInfo.name
        } else {
          this.loadTexture(frameInfo.key, frameInfo.name)
        }
        return
      }
    }

    // Fallback: 16-direction basic sprite.
    const dirIndex = displayDir - 1
    const frames = this.spriteFrames[dirIndex]
    if (frames && frames[0]) {
      if (this.key === frames[0].key) {
        this.frameName = frames[0].name
      } else {
        this.loadTexture(frames[0].key, frames[0].name)
      }
    }
  }

  /**
   * #112: Initialize Sail object with direction display
   */
  initSail () {
    this.Sail = {
      direction: 1,
      force: 0,
      inclination: [0, 0],
      
      // Calculate wind force on sail
      getForce: (windDir, windSpeed, boatDir) => {
        // Wind direction relative to boat
        const relativeWind = this.correctDirection(windDir - boatDir)
        
        // Sail works best at 45-90 degrees from wind
        // Dead downwind (0 deg) or directly into wind (180 deg) = low force
        let efficiency = 0
        
        if (relativeWind >= -4 && relativeWind <= 4) {
          // Wind from behind - running
          efficiency = 0.4 + (4 - Math.abs(relativeWind)) * 0.1
        } else if (relativeWind >= -8 && relativeWind <= -5) {
          // Wind from side-rear - broad reach (best point of sail)
          efficiency = 0.8 + (Math.abs(relativeWind) - 5) * 0.05
        } else if (relativeWind >= 5 && relativeWind <= 8) {
          // Wind from side-rear - broad reach (best point of sail)
          efficiency = 0.8 + (Math.abs(relativeWind) - 5) * 0.05
        } else {
          // Other angles - beam reach to close hauled
          efficiency = 0.6
        }
        
        // BUG FIX #4.2: Wind speed 100x too weak - multiply by 3 before scaling
        // Original Lingo: tmpWindEffect = getWindSpeed() * 3; tmpWindStrength = tmpWindEffect / 100
        return ((windSpeed * 3) / 100) * efficiency * 100
      },
      
      // Update sail direction based on wind
      calcDirection: (windDir) => {
        this.Sail.direction = windDir
      }
    }
  }

  /**
   * #113: Wind force calculation - getForce(Sail)
   * @returns {number} Force from wind on sail (0-100)
   */
  getWindForce () {
    if (!this.Sail) return 0
    
    // Get wind from weather system (if available)
    const weather = this.game.mulle.weather
    if (!weather) return 50 // Default moderate wind
    
    const windDir = weather.windDirection || 8
    const windSpeed = weather.windSpeed || 50
    
    return this.Sail.getForce(windDir, windSpeed, this.direction)
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

    // BUG FIX #8: Mouse steering mode (Lingo parity via DrivingHandlers.calcDirection)
    const steerMethod = String(this.steerMethod || '').toLowerCase()
    if (steerMethod === 'mouse') {
      const mousePos = new Phaser.Point(this.game.input.x, this.game.input.y)
      const boatPos = this.position

      let targetDir = null
      const handlers = this.state && this.state.drivingHandlers
      if (handlers && typeof handlers.calcDirection === 'function') {
        const tmp = handlers.calcDirection(
          [boatPos.x, boatPos.y],
          [mousePos.x, mousePos.y],
          'WithHypo'
        )
        targetDir = Array.isArray(tmp) ? tmp[0] : tmp
      } else {
        // Fallback to angle-based mapping if drivingHandlers isn't available.
        const angle = Phaser.Math.angleBetween(boatPos.x, boatPos.y, mousePos.x, mousePos.y)
        targetDir = Math.round((angle + Math.PI / 2) / (Math.PI * 2 / this.nrOfDirections)) + 1
      }

      if (typeof targetDir === 'number') {
        this.cursorDirection = targetDir
        this.reachForDirection = 1

        let dirDiff = targetDir - this.direction
        if (Math.abs(dirDiff) >= (this.nrOfDirections / 2)) {
          dirDiff = -dirDiff
        }

        if (dirDiff > 0) {
          steer = 1
        } else if (dirDiff < 0) {
          steer = -1
        }
      }

      // Mouse down = accelerate
      if (this.game.input.activePointer.isDown) {
        throttle = 1
      } else if (this.speed > 0) {
        // Slow down when not pressing
        throttle = -0.5
      }
    } else {
      // Keyboard controls
      if (this.cursors.left.isDown || this.wasd.left.isDown) {
        steer = -1
      } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
        steer = 1
      }

      if (this.cursors.up.isDown || this.wasd.up.isDown) {
        throttle = 1
        
        // BUG FIX #6: Shift/Control key modifiers
        if (this.shiftKey && this.shiftKey.isDown) {
          throttle *= 0.5 // Half speed with shift
        }
        if (this.controlKey && this.controlKey.isDown) {
          throttle *= 1.5 // Boost with control
        }
      } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
        // BUG FIX #11: Reverse ramp rate (2x faster)
        throttle = -1.0 // Was -0.5, should be -1.0 for 2x faster reverse
      }
    }
    
    // ==========================================
    // BUG FIX #9: 15-TICK ZERO SPEED WAIT ON DIRECTION REVERSAL
    // ==========================================
    // When reversing direction (forward to backward or vice versa), 
    // boat must wait at speed=0 for 15 ticks before moving opposite direction
    // Original: if zeroSpeedWait > 0 then set zeroSpeedWait to zeroSpeedWait - 1
    if (this.zeroSpeedWait > 0) {
      this.zeroSpeedWait--
      throttle = 0  // Force throttle to 0 during wait period
    }
    
    // Check for direction reversal: forward to backward
    if (throttle > 0 && this.speed < 0 && this.speed >= -2) {
      this.zeroSpeedWait = 15
      this.speed = 0
      throttle = 0
    }
    // Check for direction reversal: backward to forward
    else if (throttle < 0 && this.speed > 0 && this.speed <= 2) {
      this.zeroSpeedWait = 15
      this.speed = 0
      throttle = 0
    }

    // ==========================================
    // BUG FIX #3/#5: STEERING WITH PROPER MULTIPLIERS
    // ==========================================
    // Apply steering with sub-degree precision using internalDirection
    // Original: internalDirection = internalDirection + steering * ManoeuverAbility / 10
    //           direction = correctDirection(internalDirection / decimalPrec)
    if (steer !== 0) {
      // BUG FIX #3/#5: Steering multiplier based on propulsion type
      let steerMultiplier = 10  // Default 10x multiplier
      
      if (this.currentPropulsion === PropulsionType.MOTOR) {
        steerMultiplier = 10  // Motor: 10x multiplier
      } else if (this.currentPropulsion === PropulsionType.SAIL) {
        steerMultiplier = 10  // Sail: 10x multiplier (BUG FIX #5)
      } else if (this.currentPropulsion === PropulsionType.OAR) {
        steerMultiplier = 5   // Oar: 5x multiplier
      }
      
      const tmpSteer = steer * (this.steerSpeed || 5) * steerMultiplier
      this.internalDirection += tmpSteer
      
      // Correct internalDirection to stay in range
      const nrOfDirectionsScaled = this.nrOfDirections * this.decimalPrec
      while (this.internalDirection > nrOfDirectionsScaled) {
        this.internalDirection -= nrOfDirectionsScaled
      }
      while (this.internalDirection < this.decimalPrec) {
        this.internalDirection += nrOfDirectionsScaled
      }
      
      // Update discrete direction from internal direction (Lingo uses correctDirection on raw value)
      const newDir = Math.floor(this.internalDirection / this.decimalPrec)
      if (newDir !== this.direction) {
        this.setDirection(newDir)
      }
    }

    // ==========================================
    // BUG FIX #1: CALCSPEEDDIR WITH SPEEDLIST INTERPOLATION
    // BUG FIX #9: ACCELERATION VS RETARDATION ASYMMETRY
    // ==========================================
    // Original: calcSpeedNDir from BoatBase.ls lines 344-391
    
    // Calculate force from throttle (0-100 range)
    let motorForce = throttle * 100

    // Track motor throttle for fuel consumption (Lingo: motorSpeed, range 0-100)
    // Original MotorBoatAncestor.ls line 124: tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
    this.motorSpeed = Math.abs(motorForce)
    
    // Get power and calculate speed using speedList interpolation
    const power = this.game.mulle.user?.Boat?.properties?.power || 250
    // Lingo: tmpPowerIn = abs(argForce * power)
    // motorForce already in 0-100 range, so don't divide by 100 here.
    const tmpPowerIn = Math.abs(motorForce * power)
    const tmpPower = Math.floor(tmpPowerIn / 100)
    const tmpDec = tmpPowerIn - (tmpPower * 100)
    
    let tmpWanted = 0
    let tmpLower = 0
    let tmpHigher = 0
    const tmpSpeedCount = this.speedList.length

    if (tmpPower > 0) {
      if (tmpPower >= tmpSpeedCount) {
        tmpLower = this.speedList[tmpSpeedCount - 1]
        tmpHigher = tmpLower
      } else {
        // Lingo speedList is 1-indexed; JS arrays are 0-indexed.
        const idx = tmpPower - 1
        tmpLower = this.speedList[idx]
        tmpHigher = this.speedList[idx + 1] !== undefined ? this.speedList[idx + 1] : tmpLower
      }
    } else {
      // Lingo: tmpLower=0, tmpHigher=speedList[1] (1-indexed) => [0] in JS
      tmpLower = 0
      tmpHigher = tmpSpeedCount > 0 ? this.speedList[0] : 0
    }

    // Interpolate between lower and higher speeds
    tmpWanted = tmpLower + (tmpDec * (tmpHigher - tmpLower) / 100)
    
    if (motorForce < 0) {
      tmpWanted = -tmpWanted
    }
    
    // Apply acceleration or retardation (different rates!)
    const tmpDiff = tmpWanted - this.speed
    let tmpRealSpeedChange
    
    if (tmpDiff > 0) {
      // Accelerating
      tmpRealSpeedChange = this.acceleration * tmpDiff / this.decimalPrec
      if (Math.abs(tmpRealSpeedChange) > this.acceleration) {
        tmpRealSpeedChange = this.acceleration * (tmpRealSpeedChange > 0 ? 1 : -1)
      }
    } else {
      // Decelerating (use retardation rate instead!)
      tmpRealSpeedChange = this.retardation * tmpDiff / this.decimalPrec
      if (Math.abs(tmpRealSpeedChange) > this.retardation) {
        tmpRealSpeedChange = this.retardation * (tmpRealSpeedChange > 0 ? 1 : -1)
      }
    }
    
    this.speed += tmpRealSpeedChange

    // Reset terrain speed modifier each frame
    this.terrainSpeedModifier = 1.0

    // ==========================================
    // BUG FIX #2: DECIMAL PRECISION FOR POSITION
    // ==========================================
    // Convert position to internal scaled coordinates (x100)
    // Original: loc is stored as point * decimalPrec (100)
    const internalLoc = new Phaser.Point(
      Math.round(this.position.x * this.decimalPrec),
      Math.round(this.position.y * this.decimalPrec)
    )

    // Apply movement with topology checking
    if (Math.abs(this.speed) > 0.1) {
      // Get velocity vector from direction
      // Original: velPoint = getVelPoint(direction) * speed / 100
      const dirIndex = Math.floor(this.internalDirection / this.decimalPrec)
      const correctedDir = (dirIndex < 1) ? this.nrOfDirections : ((dirIndex > this.nrOfDirections) ? 1 : dirIndex)
      const dirVec = this.directionList[correctedDir - 1]
      
      // Safety check for direction vector
      if (!dirVec) {
        return // Skip movement if direction is invalid
      }
      
      // Calculate velocity point (scaled by decimalPrec)
      const velPoint = new Phaser.Point(
        dirVec.x * this.speed * this.decimalPrec / 100,
        dirVec.y * this.speed * this.decimalPrec / 100
      )

      // Lingo drift: tmpDrift = 90 * Drift * windVelPoint / 100 / 100
      let driftPoint = new Phaser.Point(0, 0)
      const drift = this.quickProps?.Drift || 0
      const wind = this.game?.mulle?.weather?.wind
      if (wind && typeof wind.getVelPoint === 'function' && drift) {
        const windVel = wind.getVelPoint() || { x: 0, y: 0 }
        driftPoint = new Phaser.Point(
          (90 * drift * windVel.x) / 100 / 100,
          (90 * drift * windVel.y) / 100 / 100
        )
      }

      // Apply speedDivider (1 normal, 2 shallow) like BoatBase.ls
      const movePoint = new Phaser.Point(
        (velPoint.x + driftPoint.x) / this.speedDivider,
        (velPoint.y + driftPoint.y) / this.speedDivider
      )

      // Calculate next position (in internal coordinates)
      const nextLoc = new Phaser.Point(
        internalLoc.x + movePoint.x,
        internalLoc.y + movePoint.y
      )
      
      // Convert to display coordinates for checking
      const nextPos = new Phaser.Point(
        nextLoc.x / this.decimalPrec,
        nextLoc.y / this.decimalPrec
      )

      // Move first, then check borders (Lingo order)
      this.lastPosition.set(this.position.x, this.position.y)
      this.position.set(nextPos.x, nextPos.y)

      // Border check before depth (matches BoatBase.ls loop order)
      const borderCheck = this.checkBorders(this.position)
      if (borderCheck && borderCheck !== 0 && this.state && typeof this.state.onMapBorder === 'function') {
        this.state.onMapBorder(borderCheck)
      }

      // Lingo DepthChecker uses center point (no corners)
      const depthCheck = this.checkDepthAtCorners(this.position, [new Phaser.Point(0, 0)])
      
      // Optional terrain info for debugging/UI (not used for collision)
      const terrainCheck = this.pixelCheck(this.position)
      this.checkTerrainPassable(terrainCheck)

      const canMove = !(depthCheck === 'Hit' || depthCheck === 1)

      // Debug movement vs direction (once per second when moving)
      if (this.debugMovement && this.game && this.game.time && this.game.time.now - this._lastDebugLog > 1000) {
        const dirAngle = Math.atan2(dirVec.y, dirVec.x)
        console.log('[DriveBoatDebug]', {
          direction: this.direction,
          internalDirection: this.internalDirection,
          speed: Number(this.speed.toFixed(3)),
          dirVec: { x: Number(dirVec.x.toFixed(3)), y: Number(dirVec.y.toFixed(3)) },
          dirDeg: Number((dirAngle * 180 / Math.PI).toFixed(1)),
          nextPos: { x: Number(nextPos.x.toFixed(2)), y: Number(nextPos.y.toFixed(2)) },
          terrainCheck,
          depthCheck,
          canMove,
          speedDivider: this.speedDivider,
          frame: this.frameName
        })
        this._lastDebugLog = this.game.time.now
      }

      if (canMove) {
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

        // Apply current effects based on terrain (no positional drift)
        this.applyCurrentEffects(terrainCheck)

        // ==========================================
        // CONSUME ENERGY BASED ON PROPULSION TYPE
        // ==========================================
        this.consumeEnergy()

        // Shallow water slows movement (Lingo speedDivider)
        if (depthCheck === 'Shallow') {
          this.speedDivider = 2
        } else {
          this.speedDivider = 1
        }
      } else {
        // Cannot move - hit obstacle
        // ==========================================
        // BUG FIX #4: COLLISION DAMAGE (100x too strong)
        // BUG FIX #10: STEPBACK AFTER COLLISION
        // ==========================================
        // Original damage calculation uses speed directly (not speed * 100)
        // Step back 2 positions after collision
        const crashSpeed = this.speed
        if (!this.changedMapRecently) {
          this.stepback(2)
        }
        this.speed = 0
        this.crashed(crashSpeed)
        this.OutOfBounds++

        // Reset divider after collision
        this.speedDivider = 1
      }
    } else {
      // When not moving, recover stamina (if we have oars)
      this.recoverStamina()
    }

    // (Moved debug logging into movement block to include canMove/terrain info)

    // Store position history
    this.previousData.push([this.position.clone(), this.direction])
    this.previousData.splice(0, 1)

    // Lingo: changedMapRecently counts down each loop
    if (this.changedMapRecently && this.changedMapRecently > 0) {
      this.changedMapRecently--
    }

    // ==========================================
    // ITEM #101: STABILITY-BASED WAVE INCLINATIONS (Lingo)
    // ==========================================
    const waveState = this.updateInclinationsFromWaves()
    const frontBackRaw = waveState ? waveState.frontBackRaw : 0

    // ==========================================
    // ITEM #96: HUNGER SYSTEM INTEGRATION
    // ==========================================
    if (!this.inFreeZone && this.mulleHunger > 0) {
      this.mulleHunger -= this.mulleHungerSpeed
      
      if (this.mulleHunger <= 0) {
        // Hunger reached 0 - try fishing rod or go home
        const user = this.game.mulle.user
        if (user && user.SeaInventory && user.SeaInventory.items && user.SeaInventory.items.Fishingrod) {
          console.log('[DriveBoat] Using fishing rod to catch food!')
          this.mulleHunger = 10000
          // Notify state about fishing
          if (this.state && this.state.onFishing) {
            this.state.onFishing()
          }
        } else {
          console.log('[DriveBoat] HUNGRY! Need to go home')
          if (this.state && this.state.onHungry) {
            this.state.onHungry()
          }
          this.enabled = false
        }
      } else if (!this.hungerWarningShown && this.mulleHunger < 2000) {
        this.hungerWarningShown = true
        if (this.state && this.state.onLowHunger) {
          this.state.onLowHunger(this.mulleHunger)
        }
      }
    }
    
    // ==========================================
    // ITEM #97: BUFFA SICK SYSTEM INTEGRATION
    // ==========================================
    if (!this.inFreeZone && this.buffaSick > 0) {
      // Track boat swaying to calculate sickness
      // Lingo uses front/back inclination for buffaSick (swayHistory)
      const lastSway = this.swayHistory[this.swayHistory.length - 1] || 0
      const swayDiff = Math.abs(frontBackRaw - lastSway)
      
      this.buffaSick -= swayDiff / 13
      
      if (this.buffaSick <= 0) {
        console.log('[DriveBoat] Buffa is SICK! (Vomit)')
        if (this.state && this.state.onVomit) {
          this.state.onVomit()
        }
        this.enabled = false
      }
      
      // Add to sway history
      this.swayHistory.push(frontBackRaw)
      if (this.swayHistory.length > 10) {
        this.swayHistory.shift()
      }
    }
    
    // ==========================================
    // ITEM #98-99: CAPSIZE & LURCH DETECTION
    // ==========================================
    this.checkCapsize(this.sideAngle)
    
    // ==========================================
    // ITEM #107: WEATHER DRIFT
    // ==========================================
    this.applyWeatherDrift()
    
    // ==========================================
    // ITEM #110: DYNAMIC PITCH CALCULATION
    // ==========================================
    if (this.currentPropulsion === PropulsionType.MOTOR) {
      this.updateEngineSound()
    }
    
    // ==========================================
    // BUG FIX #4: SAIL WIND SOUNDS
    // ==========================================
    // Play random sail sounds every 100-200 frames when sailing
    if (this.currentPropulsion === PropulsionType.SAIL && this.Sail) {
      this.sailSoundCounter++
      
      // Check if it's time to play a sail sound
      if (this.sailSoundCounter >= this.sailSoundInterval) {
        // Play random sail sound
        const randomIndex = Math.floor(Math.random() * this.sailSounds.length)
        const sailSound = this.sailSounds[randomIndex]
        this.game.mulle.playAudio(sailSound)
        
        // Reset counter and set new random interval (100-200 frames)
        this.sailSoundCounter = 0
        this.sailSoundInterval = Math.floor(Math.random() * 101) + 100
      }
    } else {
      // Reset counter when not sailing
      this.sailSoundCounter = 0
      this.sailSoundInterval = 0
    }

    // Boundary check
    this.checkBounds()
  }

  /**
   * Check if terrain is passable based on boat capabilities
   * Delegates to BoatTerrain module
   */
  checkTerrainPassable (terrainValue) {
    return BoatTerrain.checkTerrainPassable(this, terrainValue)
  }

  /**
   * Apply oar force - delegates to BoatPropulsion module
   */
  applyOarForce (throttle) {
    BoatPropulsion.applyOarForce(this, throttle)
  }

  /**
   * Calculate speed and direction - delegates to BoatPropulsion module
   */
  calcSpeedNDir (force, steer) {
    BoatPropulsion.calcSpeedNDir(this, force, steer)
  }

  /**
   * Apply wave motion - delegates to BoatPhysics module
   */
  applyWaveMotion () {
    BoatPhysics.applyWaveMotion(this)
  }

  /**
   * Calculate wave inclinations from weather system (Lingo parity).
   * Returns raw front/back inclination for sway history and side angle for capsize.
   */
  updateInclinationsFromWaves () {
    const weather = this.state && this.state.weather
    if (!weather || typeof weather.getWaveInfo !== 'function') {
      this.sideAngle = 0
      this.inclinations = [0, 0]
      this.displayInclinations = [0, 0, 0]
      return { frontBackRaw: 0, sideAngle: 0 }
    }

    const corners = this.currentCorners || this.cornerPoints?.[this.direction - 1] || [new Phaser.Point(0, 0)]
    const waveInfo = weather.getWaveInfo(this.position, this.direction, corners) || [0, 0, 0]

    const tmpAlt = waveInfo[0] || 0
    const frontBackRaw = ((this.stabilities && this.stabilities[0]) || 0) * (waveInfo[1] || 0) / 17

    let frontBack = frontBackRaw / 100
    if (Math.abs(frontBack) > 2) {
      frontBack = Math.sign(frontBack) * 2
    }

    const sideStab = (this.stabilities && this.stabilities[1]) || 0
    const sideInfo = waveInfo[2] || 0
    const additionalSideForce = this.getSailSideForce ? this.getSailSideForce() : 0

    let tmpSideAngle
    if (additionalSideForce) {
      tmpSideAngle = sideStab * ((sideInfo / 4) - (additionalSideForce / 100)) / 100
    } else {
      tmpSideAngle = sideStab * sideInfo / 100
    }

    let side = tmpSideAngle / 5
    if (Math.abs(side) > 2) {
      side = Math.sign(side) * 2
    }

    this.sideAngle = tmpSideAngle
    this.inclinations = [side, frontBack]
    this.displayInclinations = [tmpAlt, side, frontBack]

    // Update display frame using DisplayBoat mapping.
    this.updateSprite()

    return { frontBackRaw, sideAngle: tmpSideAngle }
  }

  /**
   * Approximate sail side force for inclination (Lingo SailBoatAncestor loop).
   */
  getSailSideForce () {
    if (!this.Sail || this.currentPropulsion !== PropulsionType.SAIL) return 0
    const weather = this.state && this.state.weather
    if (!weather) return 0

    const windDir = (typeof weather.getWindDirection === 'function')
      ? weather.getWindDirection()
      : (weather.windDirection || 1)
    const windSpeed = (typeof weather.getWindSpeed === 'function')
      ? weather.getWindSpeed()
      : (weather.windSpeed || 0)

    const boatDir = this.direction || 1
    const tmpForce = this.Sail.getForce ? this.Sail.getForce(windDir, windSpeed, boatDir) : 0

    let tmpDiff = this.correctDirection(windDir - boatDir - 8)
    if (tmpDiff > 8) {
      tmpDiff = 8 - tmpDiff
    } else if (tmpDiff > 4) {
      tmpDiff = 8 - tmpDiff
    }
    if (tmpDiff < -4) {
      tmpDiff = -8 - tmpDiff
    }

    const sailSize = (this.quickProps && this.quickProps.SailSize) ? this.quickProps.SailSize : 0
    return tmpForce * tmpDiff * sailSize
  }

  /**
   * Get stability factor - delegates to BoatPhysics module
   */
  getStabilityFactor () {
    return BoatPhysics.getStabilityFactor(this)
  }

  /**
   * Get longitudinal stability factor - delegates to BoatPhysics module
   */
  getLongitudinalStabilityFactor () {
    return BoatPhysics.getLongitudinalStabilityFactor(this)
  }

  /**
   * Get Z-axis stability - delegates to BoatPhysics module
   */
  getZStabilityFactor () {
    return BoatPhysics.getZStabilityFactor(this)
  }

  /**
   * Apply current/wave effects - delegates to BoatTerrain module
   */
  applyCurrentEffects (terrainValue) {
    BoatTerrain.applyCurrentEffects(this, terrainValue)
  }

  /**
   * Get topology coordinate - delegates to BoatTerrain module
   */
  getTopologyCoord (worldPos) {
    return BoatTerrain.getTopologyCoord(worldPos, this.mapOffset)
  }

  /**
   * Check borders - delegates to BoatTerrain module
   */
  checkBorders (loc) {
    return BoatTerrain.checkBorders(this, loc)
  }

  /**
   * Get show coordinate - delegates to BoatTerrain module
   */
  getShowCoordinate () {
    return BoatTerrain.getShowCoordinate(this)
  }

  /**
   * Check pixel value - delegates to BoatTerrain module
   */
  pixelCheck (coord) {
    return BoatTerrain.pixelCheck(this.topology, coord, this.mapOffset)
  }

  /**
   * Check depth at corners - delegates to BoatTerrain module
   */
  checkDepthAtCorners (loc, cornerPoints) {
    return BoatTerrain.checkDepthAtCorners(this, loc, cornerPoints)
  }

  /**
   * Get required water depth - delegates to BoatTerrain module
   */
  getRequiredDepth () {
    return BoatTerrain.getRequiredDepth(this)
  }

  /**
   * Get current water depth info - delegates to BoatTerrain module
   */
  getWaterDepth () {
    return BoatTerrain.getWaterDepth(this)
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
   * BUG FIX #3: Stop speed and update ALL history entries to prevent oscillation
   * Original: set speed to 0, updates all later history entries to current position
   */
  stepback (nr) {
    // CRITICAL: Stop the boat immediately
    this.speed = 0
    
    if (nr < 1) return
    
    console.log('[DriveBoat] stepback', nr)
    
    // Calculate index to step back to
    let tmp = this.previousData.length - nr + 1
    if (tmp < 1) tmp = 1
    
    const savedPos = this.previousData[tmp - 1]
    this.position.set(savedPos[0].x, savedPos[0].y)
    
    // CRITICAL: Update all later entries to prevent oscillation
    // Set all history entries after the stepback point to current position
    for (let i = tmp; i < this.previousData.length; i++) {
      this.previousData[i] = [this.position.clone(), this.direction]
    }
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
   * Consume energy - delegates to BoatEnergy module
   */
  consumeEnergy () {
    BoatEnergy.consumeEnergy(this)
  }

  /**
   * Recover stamina - delegates to BoatEnergy module
   */
  recoverStamina () {
    BoatEnergy.recoverStamina(this)
  }

  /**
   * Handle out of fuel - delegates to BoatEnergy module
   */
  handleOutOfFuel () {
    BoatEnergy.handleOutOfFuel(this)
  }

  /**
   * Handle out of stamina - delegates to BoatEnergy module
   */
  handleOutOfStamina () {
    BoatEnergy.handleOutOfStamina(this)
  }

  /**
   * Fallback propulsion - delegates to BoatEnergy module
   */
  fallbackPropulsion () {
    BoatEnergy.fallbackPropulsion(this)
  }

  /**
   * Update max speed for propulsion - delegates to BoatEnergy module
   */
  updateMaxSpeedForPropulsion () {
    BoatEnergy.updateMaxSpeedForPropulsion(this)
  }

  /**
   * Low fuel warning - delegates to BoatEnergy module
   */
  onLowFuel () {
    BoatEnergy.onLowFuel(this)
  }

  /**
   * Handle vomit - delegates to BoatEnergy module
   */
  handleVomit () {
    BoatEnergy.handleVomit(this)
  }

  /**
   * Handle hunger - delegates to BoatEnergy module
   */
  handleHunger () {
    BoatEnergy.handleHunger(this)
  }

  /**
   * Save inventory state (Pills and Belly) back to user data
   * Original: lines 250-262 of BoatBase.ls (save method)
   */
  saveInventoryState () {
    const user = this.game.mulle.user
    if (!user) return
    
    // Save Pills (buffaSick converted back to pills count)
    // Original: set tmpLeft to (buffaSick - 1000) / 25
    //           if tmpLeft > 0 then setaProp(tmpPillsList, #nr, tmpLeft)
    //           else deleteFromInventory(the user of gMulleGlobals, #Pills)
    const pillsLeft = Math.floor((this.buffaSick - 1000) / 25)
    if (pillsLeft > 0) {
      user.setInInventory('Pills', { nr: pillsLeft }, true)  // Replace, don't add
    } else {
      user.removeFromInventory('Pills')
    }
    
    // Save Belly (mulleHunger converted back to belly nr)
    // Original: setInInventory(the user of gMulleGlobals, #Belly, [#nr: mulleHunger / 10])
    const bellyNr = Math.floor(this.mulleHunger / 10)
    user.setInInventory('Belly', { nr: bellyNr }, true)  // Replace, don't add
    
    console.log('[DriveBoat] Saved inventory - Pills:', pillsLeft, 'Belly:', bellyNr)
  }

  /**
   * Track DrivenTimes for current propulsion type
   * Original: lines 215-220 of BoatBase.ls (calculateMyProps)
   */
  trackDrivenTimes () {
    const user = this.game.mulle.user
    if (!user) return
    
    // Only track once per session/propulsion type change
    if (this.drivenTimesTracked && this.currentDrivenType === this.currentPropulsion) {
      return
    }
    
    // Get propulsion type name (Motor, Sail, Oar)
    let typeName = null
    switch (this.currentPropulsion) {
      case PropulsionType.MOTOR:
        typeName = 'Motor'
        break
      case PropulsionType.SAIL:
        typeName = 'Sail'
        break
      case PropulsionType.OAR:
        typeName = 'Oar'
        break
      default:
        return  // Don't track NONE
    }
    
    // Get current DrivenTimes from inventory
    // Original: set tmpAllDriv to lookUpInventory(the user of gMulleGlobals, #DrivenTimes)
    //           if voidp(tmpAllDriv) then tmpAllDriv = [#Motor: 0, #Sail: 0, #Oar: 0]
    let drivenTimes = user.lookUpInventory('DrivenTimes')
    if (!drivenTimes || typeof drivenTimes !== 'object') {
      drivenTimes = { Motor: 0, Sail: 0, Oar: 0 }
    }
    
    // Increment count for this propulsion type
    // Original: set tmpDriv to setaProp(tmpAllDriv, argType, getaProp(tmpAllDriv, argType) + 1)
    drivenTimes[typeName] = (drivenTimes[typeName] || 0) + 1
    
    // Save back to inventory
    // Original: setInInventory(the user of gMulleGlobals, #DrivenTimes, tmpAllDriv)
    user.setInInventory('DrivenTimes', drivenTimes)
    
    this.drivenTimesTracked = true
    this.currentDrivenType = this.currentPropulsion
    
    console.log('[DriveBoat] Tracked DrivenTimes:', typeName, '=', drivenTimes[typeName])
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
   * Consume 1 Belly snack unit to restore fuel/stamina
   * Belly snacks can be used to refuel motor boats or restore stamina for rowing
   * @returns {boolean} True if Belly was consumed, false if none available
   */
  consumeBelly () {
    const user = this.game.mulle.user
    if (!user || !user.SeaInventory || !user.SeaInventory.items || !user.SeaInventory.items.Belly) {
      console.log('[DriveBoat] No Belly snacks available')
      return false
    }

    const belly = user.SeaInventory.items.Belly
    if (!belly.nr || belly.nr <= 0) {
      console.log('[DriveBoat] Belly snacks depleted!')
      return false
    }

    belly.nr--
    console.log('[DriveBoat] Consumed 1 Belly snack. Remaining:', belly.nr)

    if (belly.nr <= 0) {
      delete user.SeaInventory.items.Belly
      console.log('[DriveBoat] Belly snacks exhausted - item removed from inventory')
    }

    user.save()

    const bellyFuelRestore = 25
    const bellyStaminaRestore = 30

    if (this.hasEngine && this.fuelMax > 0) {
      const fuelNeeded = this.fuelMax - this.fuelCurrent
      const fuelToRestore = Math.min(bellyFuelRestore, fuelNeeded)
      this.fuelCurrent = Math.min(this.fuelMax, this.fuelCurrent + fuelToRestore)
      console.log('[DriveBoat] Belly restored fuel:', fuelToRestore, '→', this.fuelCurrent + '/' + this.fuelMax)
      this.outOfFuel = false
      this.fuelWarningShown = false

      if (this.currentPropulsion === PropulsionType.NONE || this.currentPropulsion !== PropulsionType.MOTOR) {
        const oldPropulsion = this.currentPropulsion
        this.currentPropulsion = PropulsionType.MOTOR
        this.enabled = true
        this.updateMaxSpeedForPropulsion()
        if (this.state && this.state.onPropulsionChange) {
          this.state.onPropulsionChange(oldPropulsion, this.currentPropulsion)
        }
      }
    }

    if (this.hasOars && this.staminaMax > 0) {
      const staminaNeeded = this.staminaMax - this.staminaCurrent
      const staminaToRestore = Math.min(bellyStaminaRestore, staminaNeeded)
      this.staminaCurrent = Math.min(this.staminaMax, this.staminaCurrent + staminaToRestore)
      console.log('[DriveBoat] Belly restored stamina:', staminaToRestore, '→', this.staminaCurrent + '/' + this.staminaMax)
      this.outOfStamina = false
      this.staminaWarningShown = false
    }

    return true
  }

  /**
   * Get current Belly snack count
   * @returns {number} Number of Belly snacks (0 if none)
   */
  getBellyCount () {
    const user = this.game.mulle.user
    if (!user || !user.SeaInventory || !user.SeaInventory.items || !user.SeaInventory.items.Belly) {
      return 0
    }
    return user.SeaInventory.items.Belly.nr || 0
  }

  /**
   * Check if player has Belly snacks
   * @returns {boolean}
   */
  hasBelly () {
    return this.getBellyCount() > 0
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
   * Start engine sound - delegates to BoatPropulsion module
   */
  startEngine () {
    BoatPropulsion.startEngine(this)
  }
  
  /**
   * Update engine sound - delegates to BoatPropulsion module
   */
  updateEngineSound () {
    BoatPropulsion.updateEngineSound(this)
  }

  /**
   * Stop engine sound - delegates to BoatPropulsion module
   */
  stopEngine () {
    BoatPropulsion.stopEngine(this)
  }
  
  /**
   * Collision damage - delegates to BoatDamage module
   */
  crashed (speed) {
    BoatDamage.crashed(this, speed)
  }
  
  /**
   * Handle boat breaking - delegates to BoatDamage module
   */
  handleBoatBreak () {
    BoatDamage.handleBoatBreak(this)
  }
  
  /**
   * Handle low durability - delegates to BoatDamage module
   */
  handleLowDurability () {
    BoatDamage.handleLowDurability(this)
  }

  /**
   * Build save payload for drivingInfo (Lingo parity with BoatBase.save)
   * Returns direction, loc, fuel, Durability, type
   */
  save () {
    // Persist Pills/Belly back to inventory like BoatBase.save
    this.saveInventoryState()

    const pos = {
      x: this.position ? Math.round(this.position.x) : 0,
      y: this.position ? Math.round(this.position.y) : 0
    }

    let fuel = this.fuelCurrent
    if (this.fuelMax > 0 && this.fuelCurrent >= this.fuelMax) {
      fuel = 'Full'
    } else if (typeof fuel === 'number') {
      fuel = Math.round(fuel)
    }

    return {
      direction: this.direction,
      loc: { x: pos.x, y: pos.y },
      // Keep legacy key used by SeaWorld fallback
      position: { x: pos.x, y: pos.y },
      fuel,
      Durability: this.Durability,
      type: this.getDriveType()
    }
  }

  /**
   * Apply saved driving info (fuel/durability/type) when returning to sea
   * @param {object} info
   */
  applySavedState (info) {
    if (!info || typeof info !== 'object') return

    if (info.fuel !== undefined) {
      if (info.fuel === 'Full') {
        this.fuelCurrent = this.fuelMax || 0
      } else if (typeof info.fuel === 'number') {
        this.fuelCurrent = info.fuel
      }
      this.fuelWarningShown = false
    }

    if (info.Durability !== undefined && info.Durability !== null) {
      this.Durability = info.Durability
      if (this.maxDurability === null || this.maxDurability < this.Durability) {
        this.maxDurability = this.Durability
      }
    }

    if (info.type !== undefined && info.type !== null) {
      const type = String(info.type)
      if (type.toLowerCase() === 'motor') {
        this.currentPropulsion = PropulsionType.MOTOR
      } else if (type.toLowerCase() === 'sail') {
        this.currentPropulsion = PropulsionType.SAIL
      } else if (type.toLowerCase() === 'oar') {
        this.currentPropulsion = PropulsionType.OAR
      }
    }
  }

  /**
   * Resolve current propulsion type in Lingo format
   * @returns {string|number}
   */
  getDriveType () {
    switch (this.currentPropulsion) {
      case PropulsionType.MOTOR:
        return 'Motor'
      case PropulsionType.SAIL:
        return 'Sail'
      case PropulsionType.OAR:
        return 'Oar'
      default:
        return 0
    }
  }
  
  /**
   * Check capsize - delegates to BoatDamage module
   */
  checkCapsize (sideAngle) {
    BoatDamage.checkCapsize(this, sideAngle)
  }
  
  /**
   * Apply weather drift - delegates to BoatPropulsion module
   */
  applyWeatherDrift () {
    BoatPropulsion.applyWeatherDrift(this)
  }

  /**
   * Clean up when boat is removed
   */
  destroy () {
    // Save inventory state before destroying
    this.saveInventoryState()
    
    if (this.logicLoop) {
      this.game.time.events.remove(this.logicLoop)
    }
    this.stopEngine()
    super.destroy()
  }

  // Static methods delegated to BoatSpawn module
  static getSpawnLine (index) {
    return getSpawnLine(index)
  }

  static getSpawnLineForEdge (edge) {
    return getSpawnLineForEdge(edge)
  }

  static getDirectionFromSpawnLine (spawnLine) {
    return getDirectionFromSpawnLine(spawnLine)
  }

  static getAllSpawnLines () {
    return SPAWN_LINES
  }
}

// Export constants for external use
MulleDriveBoat.SPAWN_LINES = SPAWN_LINES
MulleDriveBoat.DIRECTION_LIST = DIRECTION_LIST
MulleDriveBoat.AMPLITUDE_LIST = AMPLITUDE_LIST

export default MulleDriveBoat
