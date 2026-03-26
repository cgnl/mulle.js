/**
 * BoatBase.js - Main boat controller
 * Based on original Lingo: ParentScript 34 - BoatBase.ls (641 lines)
 *
 * Central coordinator for all boat systems:
 * - Position and movement physics (calcSpeedNDir with DrivingHandlers velPoint lookup)
 * - Propulsion type switching (Motor/Sail/Oar) via changeType
 * - Fuel management (calculateFuel, fillErUp, OutOfFuel)
 * - Damage/durability
 * - Hunger/seasickness mechanics
 * - Collision detection (checkBorders with map transitions)
 * - Save/load state
 */
import DepthChecker from './DepthChecker'
import DummyBoatAncestor from './DummyBoatAncestor'
import * as BoatPhysics from './BoatPhysics'
import * as BoatDamage from './BoatDamage'
import * as BoatEnergy from './BoatEnergy'
import MeterScript from '../ui/MeterScript'
import { HUD_LAYERS, HUD_ASSETS, HUD_POSITIONS } from './BoatConstants'

export default class BoatBase {
  /**
   * Create boat base controller
   * Original: on new me — .ls lines 4-55
   *
   * @param {object} deps - Dependencies (boatProperties, user, drivingHandlers, etc.)
   */
  constructor(deps) {
    this.deps = deps
    this.game = deps.game

    // .ls line 5: set decimalPrec to 100
    this.decimalPrec = 100

    // .ls line 6: set speed to 3
    this.speed = 3

    // .ls line 7: set velPoint to point(0, 0)
    this.velPoint = { x: 0, y: 0 }

    // .ls line 8: set direction to 1
    this.direction = 1

    // .ls line 9: set internalDirection to direction * decimalPrec
    this.internalDirection = this.direction * this.decimalPrec

    // .ls line 11: set loc to point(320, 240) * decimalPrec
    this.loc = { x: 320 * this.decimalPrec, y: 240 * this.decimalPrec }

    // .ls line 12: set quickProps to duplicate(boatProperties)
    this.quickProps = { ...(deps.boatProperties || {}) }

    // .ls line 13: set inclinations to [0, 0]
    this.inclinations = [0, 0]

    // .ls line 14: set depthChecker to new(script "DepthChecker")
    this.depthChecker = new DepthChecker(deps.topologyProvider || null)

    // .ls lines 15-20: locHistory and swayHistory with 10 entries
    this.locHistory = []
    this.swayHistory = []
    for (let i = 0; i < 10; i++) {
      this.locHistory.push({ ...this.loc })
      this.swayHistory.push(0)
    }

    // .ls line 21: set hitLast to 0
    this.hitLast = 0

    // .ls line 22: set steerMethod to #Keys
    this.steerMethod = 'Keys'

    // .ls lines 23-27: buffaSick based on pills inventory
    const pills = deps.user?.inventory?.Pills?.nr || 0
    this.buffaSick = 1000 + (pills * 25)

    // .ls lines 28-33: mulleHunger from belly inventory
    const belly = deps.user?.inventory?.Belly?.nr || 100
    this.mulleHunger = belly * 10

    // .ls line 34: set programControlsBoat to 0
    this.programControlsBoat = false

    // .ls line 35: hungerMeter
    this.hungerMeter = new MeterScript(
      HUD_LAYERS.HUNGER,
      10000,
      { dirFile: 'boten_05.DXR', member: HUD_ASSETS.HUNGER },
      4,
      this.game
    )

    // .ls line 36: speedMeter
    this.speedMeter = new MeterScript(
      HUD_LAYERS.SPEED,
      700,
      { dirFile: 'boten_05.DXR', member: HUD_ASSETS.SPEED },
      25,
      this.game
    )

    // .ls line 37: set speedDivider to 1
    this.speedDivider = 1

    // .ls line 38: set shallowCommentCounter to 500
    this.shallowCommentCounter = 500

    // .ls line 39: set inFreeZone to 0
    this.inFreeZone = false

    // .ls line 40: set changedMapRecently to 0
    this.changedMapRecently = 0

    // .ls lines 41-42: cornerPoints/currentCorners
    this.cornerPoints = []
    this.currentCorners = []

    // .ls line 43: level from levelHandler
    this.level = deps.user?.level || 1

    // .ls lines 44-49: mulleHungerSpeed based on level
    this.orgMulleHungerSpeed = this.level === 1 ? 3 : 2
    this.mulleHungerSpeed = this.orgMulleHungerSpeed

    // .ls line 50: set crashSndID to 0
    this.crashSndID = 0

    // .ls line 51: set notAllowedTypes to []
    this.notAllowedTypes = []

    // .ls line 52: set ancestor to new(script "DummyBoatAncestor")
    this.ancestor = new DummyBoatAncestor(this)

    // .ls line 53: fuelMeter (uses spriteList[#fuel] channel)
    this.fuelMeter = new MeterScript(
      HUD_LAYERS.FUEL,
      1,
      { dirFile: 'boten_05.DXR', member: HUD_ASSETS.FUEL },
      13,
      this.game
    )

    // Apply Lingo HUD positions (score loc) to meter sprites
    this._applyHudPosition(this.speedMeter, HUD_POSITIONS.SPEED)
    this._applyHudPosition(this.hungerMeter, HUD_POSITIONS.HUNGER)
    this._applyHudPosition(this.fuelMeter, HUD_POSITIONS.FUEL)

    // Other objects
    this.displayObject = null
    this.SelectorMaster = null
    this.possibleTypes = []
    this.wishedType = null

    // Fuel (undefined = not yet calculated)
    this.fuel = undefined

    // Durability (undefined = not yet set)
    this.Durability = undefined

    // Physics defaults (overridden by calculateMyProps)
    this.acceleration = 50
    this.retardation = 25
    this.stabilities = [90, 80]
    this.speedList = []
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

  /**
   * Initialize boat for sea world
   * Original: on init me — .ls lines 57-79
   */
  init() {
    // .ls line 58: set possibleTypes to findPossiblePowers(quickProps)
    if (this.deps.findPossiblePowers) {
      this.possibleTypes = this.deps.findPossiblePowers(this.quickProps)
    }

    // .ls lines 59-63: cheat if no possible types
    if (this.possibleTypes.length === 0) {
      if (this.deps.makeCheatBoat) {
        this.deps.makeCheatBoat()
      }
      if (this.deps.findPossiblePowers) {
        this.possibleTypes = this.deps.findPossiblePowers(this.quickProps)
      }
    }

    // .ls line 64: set SelectorMaster to new(script "SelectorMaster", possibleTypes)
    if (this.deps.createSelectorMaster) {
      this.SelectorMaster = this.deps.createSelectorMaster(this.possibleTypes)
    } else {
      // Stub SelectorMaster
      this.SelectorMaster = { clickedOne: () => { }, kill: () => 0, activate: () => { } }
    }

    // .ls line 65: set displayObject to new(script "DisplayBoat", me)
    if (this.deps.createDisplayBoat) {
      this.displayObject = this.deps.createDisplayBoat(this)
    } else {
      this.displayObject = { display: () => { }, kill: () => 0 }
    }

    // .ls line 66: calculateFuel(me)
    this.calculateFuel()

    // .ls line 67: set tmpType to changeType(me, wishedType)
    let tmpType = this.changeType(this.wishedType)

    // .ls line 68: set wishedType to 0
    this.wishedType = 0

    // .ls lines 69-76: if stringp(tmpType) then — error sound string
    // In Lingo, symbols (#Motor) are NOT strings, but sound IDs ("05d137v0") are.
    // In JS we distinguish: type names are 'Motor'/'Sail'/'Oar', errors are sound IDs.
    if (this._isErrorSound(tmpType)) {
      tmpType = this.changeType()
      if (this._isErrorSound(tmpType)) {
        // No valid type at all — go home
        if (this.deps.mulleTalkObject?.say) {
          this.deps.mulleTalkObject.say(tmpType, 1, this, undefined, 'GoHome')
        }
        this.waitToGoHome()
        return
      }
    }

    // .ls line 77: calculateMyProps(me, tmpType)
    this.calculateMyProps(tmpType)

    // .ls line 78: setCornerPoints on waves
    if (this.deps.weatherRenderer?.waves?.setCornerPoints) {
      this.deps.weatherRenderer.waves.setCornerPoints([
        { x: 0, y: -10 }, { x: -5, y: 5 }, { x: 5, y: 5 }
      ])
    }

    // Meters are initialized in constructor to match Lingo (BoatBase.ls lines 34-53).
  }

  /**
   * Cheat mode - fill all resources
   * Original: on cheat me — .ls lines 81-85
   */
  cheat() {
    this.mulleHunger = 10000
    this.fuel = 40000
    this.buffaSick = 2000
  }

  /**
   * Get current propulsion type
   * Original: on getType me — .ls lines 87-93
   *
   * @returns {string|number} Type string or 0 if no ancestor
   */
  getType() {
    // .ls line 88-89: if objectp(ancestor) then return the type of ancestor
    if (this.ancestor) {
      return this.ancestor.type
    }
    // .ls line 91-92: else return 0
    return 0
  }

  /**
   * Check if wind is OK for sailing
   * Original: on checkWindOK me, argType — .ls lines 95-106
   *
   * @param {string} argType - Propulsion type
   * @returns {string|undefined} Sound ID if no wind, undefined otherwise
   */
  checkWindOK(argType) {
    // .ls line 96: if (argType = #Sail) and (getSpeed(wind) = 0) then
    if (argType === 'Sail') {
      const windSpeed = this.deps.weatherRenderer?.wind?.getSpeed?.() || 0
      if (windSpeed === 0) {
        // .ls lines 97-101: random sound
        const tmpSnd = Math.random() < 0.5 ? '05d135v0' : '05d136v0'
        // .ls line 102: say(mulleTalkObject, tmpSnd, 5)
        if (this.deps.mulleTalkObject?.say) {
          this.deps.mulleTalkObject.say(tmpSnd, 5)
        }
        // .ls line 103: return tmpSnd
        return tmpSnd
      }
    }
    // .ls line 105: return VOID
    return undefined
  }

  /**
   * Change propulsion type
   * Original: on changeType me, argRequestedType — .ls lines 108-189
   *
   * @param {string} [argRequestedType] - Requested type (Motor/Sail/Oar)
   * @returns {string|number} Type symbol, 0, or error sound string
   */
  changeType(argRequestedType) {
    // .ls lines 109-113: check notAllowedTypes
    if (argRequestedType && this.notAllowedTypes.indexOf(argRequestedType) !== -1) {
      return 0
    }

    // .ls lines 114-116: refresh quickProps if needed
    if (!this.quickProps || Object.keys(this.quickProps).length === 0) {
      this.quickProps = { ...(this.deps.boatProperties || {}) }
    }

    // .ls line 117: check currently OK powers
    let tmpCurrentlyOK
    if (this.deps.checkCurrentlyOKPowers) {
      tmpCurrentlyOK = this.deps.checkCurrentlyOKPowers(this.quickProps, this.possibleTypes)
    } else {
      tmpCurrentlyOK = {}
    }

    // .ls lines 118-121: get last type from ancestor
    let tmpLastType
    if (this.ancestor) {
      tmpLastType = this.ancestor.type
    }

    // .ls lines 122-126: mark Motor as NoFuel if fuel <= 0
    if (tmpCurrentlyOK.Motor === 1 && this.fuel <= 0) {
      tmpCurrentlyOK.Motor = 'NoFuel'
    }

    // .ls lines 127-188: resolve type
    if (argRequestedType) {
      // .ls lines 128-131: if requested type is OK
      if (tmpCurrentlyOK[argRequestedType] === 1) {
        this.checkWindOK(argRequestedType)
        return argRequestedType
      } else {
        // .ls lines 133-135: requested type not OK, try to find alternative
        // Fall through to error handling
      }
    }

    // .ls lines 136-154: find first OK type
    const okKeys = Object.keys(tmpCurrentlyOK)
    let tmpOKPos = -1
    for (let i = 0; i < okKeys.length; i++) {
      if (tmpCurrentlyOK[okKeys[i]] === 1) {
        tmpOKPos = i
        break
      }
    }

    if (tmpOKPos >= 0) {
      const tmpType = okKeys[tmpOKPos]
      // .ls lines 142-152: say transition messages
      if (tmpLastType === 'Motor') {
        if (tmpType === 'Sail') {
          if (this.deps.mulleTalkObject?.say) {
            this.deps.mulleTalkObject.say('MotorToSail', 5)
          }
        } else {
          if (this.deps.mulleTalkObject?.say) {
            this.deps.mulleTalkObject.say('MotorToOar', 5)
          }
        }
      } else if (tmpLastType === 'Sail' && tmpType === 'Oar') {
        if (this.deps.mulleTalkObject?.say) {
          this.deps.mulleTalkObject.say('SailToOar', 5)
        }
      }

      this.checkWindOK(tmpType)
      return tmpType
    }

    // .ls lines 155-188: no valid type — return error sound
    // Find the first error
    const tmpErrorForType = argRequestedType
      ? okKeys.indexOf(argRequestedType)
      : 0
    const errorIdx = tmpErrorForType >= 0 ? tmpErrorForType : 0
    const tmpError = tmpCurrentlyOK[okKeys[errorIdx]] || tmpCurrentlyOK[okKeys[0]]

    // .ls lines 157-185: map error to sound
    let tmpSnd
    if (tmpError === 'NoRudder') {
      tmpSnd = '05d055v0'
    } else if (tmpError === 'NoSteering') {
      tmpSnd = '05d056v0'
    } else if (tmpError === 'NoTank') {
      tmpSnd = '05d023v0'
    } else if (tmpError === 'NoWind') {
      tmpSnd = Math.random() < 0.5 ? '05d135v0' : '05d136v0'
    } else if (tmpError === 'HardWind') {
      tmpSnd = '05d018v0'
    } else if (tmpError === 'NoFuel') {
      tmpSnd = '05d137v0'
    } else {
      tmpSnd = '05d001v0'
    }

    return tmpSnd
  }

  /**
   * Calculate fuel based on tank volume
   * Original: on calculateFuel me — .ls lines 191-201
   */
  calculateFuel() {
    // .ls lines 192-194: if fuel undefined or Full, calculate from FuelVolume
    if (this.fuel === undefined || this.fuel === 'Full') {
      this.fuel = 4500 * (this.quickProps.FuelVolume || 1)
      this.quickProps.MaxFuelVolume = this.fuel
    } else if (!this.quickProps.MaxFuelVolume) {
      // .ls lines 196-198: set MaxFuelVolume from 4000 * FuelVolume
      this.quickProps.MaxFuelVolume = 4000 * (this.quickProps.FuelVolume || 1)
    }

    // .ls line 200: setMax(fuelMeter, MaxFuelVolume)
    if (this.fuelMeter?.setMax) {
      this.fuelMeter.setMax(this.quickProps.MaxFuelVolume)
    }
  }

  /**
   * Calculate all derived boat properties for a propulsion type
   * Original: on calculateMyProps me, argType — .ls lines 203-227
   *
   * @param {string} argType - Propulsion type (Motor/Sail/Oar)
   */
  calculateMyProps(argType) {
    // .ls line 204: set quickProps to duplicate(boatProperties)
    this.quickProps = { ...(this.deps.boatProperties || {}) }

    // .ls line 205: makeCleanBoat(argType, quickProps)
    if (this.deps.makeCleanBoat) {
      this.deps.makeCleanBoat(argType, this.quickProps)
    }

    // .ls line 206: recalculateBoatProps(argType, quickProps)
    if (this.deps.recalculateBoatProps) {
      this.deps.recalculateBoatProps(argType, this.quickProps)
    }

    // .ls line 207: calculateFuel(me)
    this.calculateFuel()

    // .ls line 208: set stabilities to getaProp(quickProps, #stabilities)
    if (this.quickProps.stabilities) {
      this.stabilities = this.quickProps.stabilities
    }

    // .ls lines 209-211: set Durability only if void
    if (this.Durability === undefined) {
      this.Durability = this.quickProps.Durability
    }

    // .ls line 212: set acceleration
    this.acceleration = this.quickProps.acceleration

    // .ls line 213: set retardation
    this.retardation = this.quickProps.retardation

    // .ls line 214: setDepth(depthChecker, RealDepth)
    if (this.depthChecker?.setDepth && this.quickProps.RealDepth !== undefined) {
      this.depthChecker.setDepth(this.quickProps.RealDepth)
    }

    // .ls lines 215-220: track DrivenTimes in user inventory
    let tmpAllDriv = this.deps.user?.lookUpInventory?.('DrivenTimes')
    if (!tmpAllDriv || typeof tmpAllDriv !== 'object') {
      tmpAllDriv = { Motor: 0, Sail: 0, Oar: 0 }
    }
    tmpAllDriv[argType] = (tmpAllDriv[argType] || 0) + 1
    if (this.deps.user?.setInInventory) {
      this.deps.user.setInInventory('DrivenTimes', tmpAllDriv)
    }

    // .ls lines 221-225: kill old ancestor, create new one
    if (this.ancestor?.kill) {
      this.ancestor.kill()
    }

    // Create new ancestor based on type
    if (this.deps.createAncestor) {
      this.ancestor = this.deps.createAncestor(argType, this)
    } else {
      // Stub ancestor with correct type
      this.ancestor = {
        type: argType,
        init: () => { },
        loop: () => 0,
        kill: () => 0,
        display: () => { },
        steer: () => { }
      }
    }

    // .ls line 225: init(ancestor)
    if (this.ancestor?.init) {
      this.ancestor.init()
    }

    // .ls line 226: clickedOne(SelectorMaster, argType)
    if (this.SelectorMaster?.clickedOne) {
      this.SelectorMaster.clickedOne(argType)
    }
  }

  /**
   * Handle running out of fuel
   * Original: on OutOfFuel me — .ls lines 229-242
   */
  OutOfFuel() {
    // .ls lines 230-232: if only one possible type, go home
    if (this.possibleTypes.length <= 1) {
      if (this.deps.mulleTalkObject?.say) {
        this.deps.mulleTalkObject.say('OutOfFuel', 1, this, 'Q', 'GoHomeTow')
      }
      this.waitToGoHome()
      return
    }

    // .ls lines 233-241: try switching to alternative type
    const tmpType = this.changeType()
    if (typeof tmpType === 'string') {
      // Error string — no valid alternative
      if (this.deps.mulleTalkObject?.say) {
        this.deps.mulleTalkObject.say(tmpType, 1, this, undefined, 'GoHomeTow')
      }
      this.waitToGoHome()
      return
    }

    // .ls line 240: calculateMyProps(me, tmpType)
    this.calculateMyProps(tmpType)
  }

  /**
   * Fill fuel tank completely
   * Original: on fillErUp me — .ls lines 244-248
   */
  fillErUp() {
    // .ls line 245: set fuel to #Full
    this.fuel = 'Full'
    // .ls line 246: calculateFuel(me)
    this.calculateFuel()
    // .ls line 247: show(fuelMeter, fuel)
    if (this.fuelMeter?.show) {
      this.fuelMeter.show(this.fuel)
    }
  }

  /**
   * Save boat state
   * Original: on save me — .ls lines 250-263
   *
   * @returns {object} Save data
   */
  save() {
    // .ls lines 251-259: save pills back to user
    const tmpPillsList = this.deps.user?.lookUpInventory?.('Pills')
    if (tmpPillsList && typeof tmpPillsList === 'object') {
      const tmpLeft = Math.floor((this.buffaSick - 1000) / 25)
      if (tmpLeft > 0) {
        tmpPillsList.nr = tmpLeft
      } else if (this.deps.user?.deleteFromInventory) {
        this.deps.user.deleteFromInventory('Pills')
      }
    }

    // .ls line 261: setInInventory(user, #Belly, [#nr: mulleHunger / 10])
    if (this.deps.user?.setInInventory) {
      this.deps.user.setInInventory('Belly', { nr: Math.floor(this.mulleHunger / 10) })
    }

    // .ls line 262: return save data
    return {
      direction: this.direction,
      loc: {
        x: this.loc.x / this.decimalPrec,
        y: this.loc.y / this.decimalPrec
      },
      fuel: this.fuel,
      Durability: this.Durability,
      type: this.getType()
    }
  }

  /**
   * Load boat state
   * Original: on load me, argList — .ls lines 265-282
   *
   * @param {object} argList - Save data
   */
  load(argList) {
    // .ls lines 266-267
    if (argList.direction !== undefined) {
      this.direction = argList.direction
      this.internalDirection = this.direction * this.decimalPrec
    }

    // .ls line 268
    if (argList.loc) {
      this.loc = {
        x: argList.loc.x * this.decimalPrec,
        y: argList.loc.y * this.decimalPrec
      }
    }

    // .ls lines 269-276
    if (argList.fuel !== undefined) {
      this.fuel = argList.fuel
    }

    // .ls lines 277-279
    if (typeof argList.Durability === 'number') {
      this.Durability = argList.Durability
    }

    // .ls line 281
    if (argList.type) {
      this.wishedType = argList.type
    }
  }

  /**
   * Clean up all resources
   * Original: on kill me — .ls lines 284-298
   *
   * @returns {number} 0
   */
  kill() {
    // .ls line 285: deleteReference(mulleTalkObject, me)
    if (this.deps.mulleTalkObject?.deleteReference) {
      this.deps.mulleTalkObject.deleteReference(this)
    }

    // .ls line 286: set speedMeter to kill(speedMeter)
    if (this.speedMeter?.kill) this.speedMeter = this.speedMeter.kill()
    // .ls line 287: set hungerMeter to kill(hungerMeter)
    if (this.hungerMeter?.kill) this.hungerMeter = this.hungerMeter.kill()
    // .ls line 288: set fuelMeter to kill(fuelMeter)
    if (this.fuelMeter?.kill) this.fuelMeter = this.fuelMeter.kill()
    // .ls line 289: set displayObject to kill(displayObject)
    if (this.displayObject?.kill) this.displayObject = this.displayObject.kill()

    // .ls lines 290-292: if objectp(SelectorMaster) then kill
    if (this.SelectorMaster?.kill) {
      this.SelectorMaster = this.SelectorMaster.kill()
    }

    // .ls line 293: set depthChecker to kill(depthChecker)
    if (this.depthChecker?.kill) this.depthChecker = this.depthChecker.kill()

    // .ls lines 294-296: if objectp(ancestor) then kill
    if (this.ancestor?.kill) {
      this.ancestor = this.ancestor.kill()
    }

    // .ls line 297: return 0
    return 0
  }

  /**
   * Stop motor if currently using motor
   * Original: on stopMotor me — .ls lines 300-304
   */
  stopMotor() {
    // .ls line 301: if the type of ancestor = #Motor then
    if (this.ancestor?.type === 'Motor' && this.ancestor.setSpeed) {
      this.ancestor.setSpeed(0)
    }
  }

  /**
   * Step back in location history (collision recovery)
   * Original: on stepback me, argNrOfSteps — .ls lines 306-320
   *
   * @param {number} argNrOfSteps - Steps to go back
   * @returns {object} Restored location
   */
  stepback(argNrOfSteps) {
    return BoatPhysics.stepback(this, argNrOfSteps)
  }

  /**
   * Set free zone mode (no damage/hunger)
   * Original: on freeZone me, argYesNo — .ls lines 322-324
   *
   * @param {number|boolean} argYesNo - Free zone active
   */
  freeZone(argYesNo) {
    this.inFreeZone = argYesNo
  }

  /**
   * Set topology map for depth checking
   * Original: on setTopology me, argWhich — .ls lines 326-328
   * Note: Lingo passes only argWhich, delegates to depthChecker
   *
   * @param {string} argWhich - Topology identifier
   */
  setTopology(argWhich) {
    if (this.depthChecker?.setTopology) {
      this.depthChecker.setTopology(argWhich)
    }
  }

  /**
   * Get display coordinate (loc / decimalPrec)
   * Original: on getShowCoordinate me — .ls lines 330-332
   *
   * @returns {object} Screen position {x, y}
   */
  getShowCoordinate() {
    return {
      x: this.loc.x / this.decimalPrec,
      y: this.loc.y / this.decimalPrec
    }
  }

  /**
   * Set display coordinate
   * Original: on setShowCoordinate me, argPoint — .ls lines 334-336
   *
   * @param {object} argPoint - Screen position {x, y}
   */
  setShowCoordinate(argPoint) {
    this.loc = {
      x: argPoint.x * this.decimalPrec,
      y: argPoint.y * this.decimalPrec
    }
  }

  /**
   * Delegate steering to ancestor
   * Original: on steer me, arg1, arg2 — .ls lines 338-342
   */
  steer(arg1, arg2) {
    if (this.ancestor?.steer) {
      this.ancestor.steer(arg1, arg2)
    }
  }

  /**
   * Calculate speed and direction from force/steering
   * Original: on calcSpeedNDir me, argForce, argSteering — .ls lines 344-391
   * CRITICAL: Uses DrivingHandlers.getVelPoint lookup table, NOT trig
   *
   * @param {number} argForce - Force input
   * @param {number} argSteering - Steering input
   */
  calcSpeedNDir(argForce, argSteering) {
    BoatPhysics.calcSpeedNDir(this, argForce, argSteering)
  }

  /**
   * Calculate steering direction from mouse position
   * Original: on calcMouseDir me — .ls lines 397-414
   *
   * @returns {number} Steering (-1, 0, 1)
   */
  calcMouseDir() {
    const handlers =
      this.deps?.drivingHandlers ||
      this.deps?.dir?.drivingHandlers ||
      this.game?.mulle?.dir?.drivingHandlers ||
      this.game?.mulle?.gMulleGlobals?.dir?.drivingHandlers

    if (!handlers || typeof handlers.calcDirection !== 'function') {
      return 0
    }

    const mouseH = this.game?.input?.x ?? 0
    const mouseV = this.game?.input?.y ?? 0

    const tmp = handlers.calcDirection(
      this.getShowCoordinate(),
      { x: mouseH, y: mouseV },
      'WithHypo'
    )

    const tmpDirection = Array.isArray(tmp) ? tmp[0] : tmp
    this.cursorDirection = tmpDirection
    const hypo = Array.isArray(tmp) ? tmp[1] : 0
    this.reachForDirection = 1

    let tmpDiff = tmpDirection - this.direction
    if (Math.abs(tmpDiff) >= (16 / 2)) {
      tmpDiff = -tmpDiff
    }

    let tmpSteering = 0
    if (tmpDiff > 0) {
      tmpSteering = 1
    } else if (tmpDiff < 0) {
      tmpSteering = -1
    }

    return tmpSteering
  }

  /**
   * Set speed directly
   * Original: on setSpeed me, argSpeed — .ls lines 393-395
   *
   * @param {number} argSpeed - Speed value
   */
  setSpeed(argSpeed) {
    this.speed = argSpeed
  }

  /**
   * Set program control mode
   * Original: on programControl me, argYesNo — .ls lines 419-421
   *
   * @param {number|boolean} argYesNo - Program controls boat
   */
  programControl(argYesNo) {
    this.programControlsBoat = argYesNo
  }

  /**
   * Prepare to go home (deactivate interface, enable program control)
   * Original: on waitToGoHome me — .ls lines 423-426
   */
  waitToGoHome() {
    // .ls line 424: activateinterface(gDir, 0)
    if (this.deps.activateinterface) {
      this.deps.activateinterface(0)
    }
    // .ls line 425: programControl(me, 1)
    this.programControlsBoat = true
  }

  /**
   * Check map borders and handle transitions
   * Original: on checkBorders me — .ls lines 428-473
   * Made public (was _checkBorders) to match Lingo handler
   */
  checkBorders() {
    // .ls line 429: set tmp to checkBorders(depthChecker, loc / decimalPrec)
    const screenLoc = this.getShowCoordinate()
    const tmp = this.depthChecker?.checkBorders?.(screenLoc) || null

    // .ls line 430: if listp(tmp) then
    if (Array.isArray(tmp)) {
      // .ls line 431: if integerp(getNewMapId(world, tmp, #Relational, 1)) then
      const newMapId = this.deps.world?.getNewMapId?.(tmp, 'Relational', 1)
      const border = 12 // 8 + 4

      if (typeof newMapId === 'number') {
        // .ls lines 433-447: teleport to opposite edge
        if (tmp[0] === -1) {
          this.loc.x = (640 - border) * this.decimalPrec
        } else if (tmp[0] === 1) {
          this.loc.x = (4 + border) * this.decimalPrec
        } else if (tmp[1] === -1) {
          this.loc.y = (396 - border) * this.decimalPrec
        } else if (tmp[1] === 1) {
          this.loc.y = (4 + border) * this.decimalPrec
        }
        // .ls line 448: changeMap(gDir, tmp)
        if (this.deps.changeMap) {
          this.deps.changeMap(tmp)
        }
        // .ls line 449: set changedMapRecently to 5
        this.changedMapRecently = 5
      } else {
        // .ls lines 451-467: clamp position (no valid neighbor)
        // .ls line 452: say(the mulleTalkObject of gDir, "05d051v0", 5)
        if (this.deps.mulleTalkObject?.say) {
          this.deps.mulleTalkObject.say('05d051v0', 5)
        }
        BoatPhysics.checkBounds(this)
      }
    }

    // .ls lines 470-472: decrement changedMapRecently
    if (this.changedMapRecently) {
      this.changedMapRecently--
    }
  }

  /**
   * Main game loop
   * Original: on loop me — .ls lines 475-622
   */
  loop() {
    // .ls lines 476-478: if programControlsBoat then exit
    if (this.programControlsBoat) {
      return
    }

    // .ls line 479: tmpDrift = 90 * Drift * getVelPoint(wind) / 100 / 100
    const drift = this.quickProps.Drift || 0
    const windVel = this.deps.weatherRenderer?.wind?.getVelPoint?.() || { x: 0, y: 0 }
    const driftX = 90 * drift * windVel.x / 100 / 100
    const driftY = 90 * drift * windVel.y / 100 / 100

    // .ls line 480: set loc to loc + ((velPoint + tmpDrift) / speedDivider)
    this.loc.x += (this.velPoint.x + driftX) / this.speedDivider
    this.loc.y += (this.velPoint.y + driftY) / this.speedDivider

    // .ls line 481: checkBorders(me)
    this.checkBorders()

    // .ls line 482: show(speedMeter, abs(speed))
    if (this.speedMeter?.show) {
      this.speedMeter.show(Math.abs(this.speed))
    }
    // .ls line 483: show(hungerMeter, mulleHunger)
    if (this.hungerMeter?.show) {
      this.hungerMeter.show(this.mulleHunger)
    }

    // .ls line 484: set tmpInfo to checkDepth(depthChecker, loc / decimalPrec)
    const screenLoc = this.getShowCoordinate()
    const depthInfo = this.depthChecker?.checkDepth?.(screenLoc, this.currentCorners) || 0

    // .ls lines 485-545: handle collision / shallow
    if (depthInfo === 'Hit' || depthInfo === 1) {
      this._handleCollision()
    } else if (depthInfo === 'Shallow') {
      this._handleShallowWater()
    } else {
      this.speedDivider = 1
    }

    // .ls line 546: shallowCommentCounter++
    this.shallowCommentCounter++

    // .ls lines 547-548: update location history
    this.locHistory.push({ ...this.loc })
    this.locHistory.shift()

    // .ls line 549: set argAdditionalSideForce to loop(ancestor)
    const additionalSideForce = this.ancestor?.loop?.() || 0

    // .ls line 550: get wave info
    const waveInfo = this.deps.weatherRenderer?.waves?.getTopoInfo?.(
      screenLoc, this.direction, this.currentCorners
    ) || [0, 0, 0]

    const tmpAlt = waveInfo[0]

    // Calculate inclinations via BoatPhysics
    const startFrontBack = (this.stabilities[0] || 90) * waveInfo[1] / 17
    // We can't use BoatPhysics.calculateInclinations immediately for frontBack because
    // we need the raw value for Seasickness/SwayHistory BEFORE the /100 scaling.
    // However, BoatPhysics.calculateInclinations DOES return the raw frontBack.
    // Let's use it.
    const incs = BoatPhysics.calculateInclinations(this, {
      altitude: waveInfo[0],
      pitch: waveInfo[1],
      roll: waveInfo[2]
    }, additionalSideForce)

    let frontBack = incs.frontBack

    // .ls line 553: if not inFreeZone then
    // .ls line 553: if not inFreeZone then
    if (!this.inFreeZone) {
      // .ls lines 554-588: Energy, Hunger, Seasickness
      BoatEnergy.consumeEnergy(this, frontBack)
    }

    // .ls lines 590-591: update sway history with RAW frontBack
    this.swayHistory.push(frontBack)
    this.swayHistory.shift()

    // .ls line 592: frontBack = frontBack / 100
    frontBack = frontBack / 100

    // .ls lines 598-611: check capsizing (delegated to BoatDamage)
    // incs.side corresponds to tmpSideAngle
    BoatDamage.checkCapsize(this, incs.side)

    // .ls lines 612-618: clamp inclinations (side, frontBack)
    const clamped = BoatPhysics.clampInclinations(incs.side, frontBack)

    // .ls line 619: set inclinations to [side, frontBack]
    this.inclinations = clamped.inclinations
    const side = clamped.side
    frontBack = clamped.frontBack

    // .ls line 620: display(displayObject, [tmpAlt, side, frontBack])
    if (this.displayObject?.display) {
      this.displayObject.display([tmpAlt, side, frontBack])
    }
    // .ls line 621: display(ancestor)
    if (this.ancestor?.display) {
      this.ancestor.display()
    }
  }

  /**
   * Handle collision with land
   * Based on .ls lines 485-531
   * @private
   */
  _handleCollision() {
    const damage = Math.abs(this.speed)

    // .ls lines 487-489: stepback if not changedMapRecently
    if (!this.changedMapRecently) {
      this.stepback(2)
    }

    // .ls lines 490-491
    this.velPoint = { x: 0, y: 0 }
    this.speed = 0

    // .ls lines 520-526: damage logic delegated to BoatDamage
    BoatDamage.crashed(this, damage)
  }

  /**
   * Handle shallow water
   * Based on .ls lines 533-544
   * @private
   */
  _handleShallowWater() {
    if (this.shallowCommentCounter > 500) {
      this.shallowCommentCounter = 0
    }
    this.speedDivider = 2
  }

  /**
   * Handle seasickness mechanic
   * Based on .ls lines 554-566
   * @private
   */


  /**
   * Check if a changeType return value is an error sound string (not a type symbol)
   * In Lingo: symbols (#Motor) are NOT strings, but sound IDs ("05d137v0") are.
   * @private
   */
  _isErrorSound(val) {
    if (typeof val !== 'string') return false
    // Valid type names (equivalent of Lingo symbols)
    const validTypes = ['Motor', 'Sail', 'Oar']
    return validTypes.indexOf(val) === -1
  }

  /**
   * Normalize direction to 1-16
   * @private
   */
  _correctDirection(dir) {
    let d = dir % 16
    if (d <= 0) d += 16
    return d
  }

  /**
   * Callback when Mulle finishes speaking
   * Original: on mulleFinished me, argID — .ls lines 624-641
   *
   * @param {string} argID - Callback identifier
   * @returns {object} Action to take
   */
  mulleFinished(argID) {
    if (argID === 'continue') {
      return { action: 'unpause' }
    } else if (argID === 'GoHome') {
      return { action: 'prepareToLeave', destination: '04' }
    } else if (argID === 'GoHomeTow') {
      return { action: 'prepareToLeave', destination: '04', animation: '33b011v0', sound: '33e011v0' }
    } else if (argID === 'GoHomeCapsize') {
      return { action: 'prepareToLeave', destination: '04', animation: '33b014v0', sound: '05d125v0' }
    }
    return null
  }
}
