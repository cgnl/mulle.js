/**
 * ExtraBoatDrivingStuff.js - Boat power configuration utilities
 * Based on original Lingo: MovieScript 147 - ExtraBoatDrivingStuff.ls
 *
 * Utility functions for:
 * - Getting engine start sounds
 * - Finding possible power types (Motor, Sail, Oar)
 * - Validating power configurations
 * - Creating clean boat configs for specific power modes
 *
 * Original Lingo handlers:
 * - getEngineStartSound: Get sound file for engine start
 * - findPossiblePowers: List all available power types
 * - checkCurrentlyOKPowers: Validate power configurations
 * - makeCleanBoat: Create boat props for specific power mode
 */
'use strict'

// Engine start sound files indexed by EngineSound property
// Original: set tmpList to ["05e018v1", "05e018v0", ...]
const ENGINE_SOUNDS = [
  '05e018v1',  // 1
  '05e018v0',  // 2
  '05e030v0',  // 3
  '05e056v0',  // 4
  '05e034v0',  // 5
  '05e022v0',  // 6
  '05e053v0',  // 7
  '05e026v0'   // 8
]

// Power type conditions
// Original: set tmp to [#Motor: [#engine], #Motor: [#OutboardEngine], #Sail: [...], #Oar: [...]]
const POWER_CONDITIONS = [
  { type: 'Motor', requires: ['engine'] },
  { type: 'Motor', requires: ['OutboardEngine'] },
  { type: 'Sail', requires: ['SailWithPole', 'SailSize'] },
  { type: 'Oar', requires: ['Oar'] }
]

// Properties to drain for each power mode
// Original: set tmpNotAllowed to [#engine: [#power, #speed], ...]
const NOT_ALLOWED = {
  Sail: {
    engine: ['power', 'speed'],
    OutboardEngine: ['depth', 'MaxDepth', 'SteerPart'],
    Oar: ['power', 'speed']
  },
  Motor: {
    Oar: ['power', 'speed']
  },
  Oar: {
    engine: ['power', 'speed'],
    OutboardEngine: ['depth', 'MaxDepth']
  }
}

export default class ExtraBoatDrivingStuff {
  /**
   * Create utility instance
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals
  }

  /**
   * Get engine start sound file name
   * Original: on getEngineStartSound
   * @returns {string|number} Sound file name or 0 if not available
   */
  getEngineStartSound() {
    // Original: set tmp to findPossiblePowers()
    const possiblePowers = this.findPossiblePowers()

    // Original: if getOne(tmp, #Motor) then
    if (!possiblePowers.includes('Motor')) {
      return 0
    }

    const boatProps = this.globals.user.boat.boatProperties

    // Original: set tmp to checkCurrentlyOKPowers(boatProperties, [#Motor])
    const okPowers = this.checkCurrentlyOKPowers(boatProps, ['Motor'])

    // Original: if getAt(tmp, 1) = 1 then
    if (okPowers.Motor !== 1) {
      return 0
    }

    // Original: set tmpEngine to getProperty(boat, #EngineSound)
    const engineSound = boatProps.EngineSound

    // Original: if (tmpEngine > 0) and (tmpEngine <= count(tmpList)) then
    if (engineSound > 0 && engineSound <= ENGINE_SOUNDS.length) {
      return ENGINE_SOUNDS[engineSound - 1]
    }

    return 0
  }

  /**
   * Find all possible power types for current boat
   * Original: on findPossiblePowers argProps
   * @param {Object} props - Boat properties (optional, uses globals if not provided)
   * @returns {Array<string>} List of possible power types
   */
  findPossiblePowers(props) {
    // Original: if voidp(argProps) then set argProps to boatProperties
    if (!props) {
      props = this.globals.user.boat.boatProperties
    }

    // Original: set tmpOKPowers to []
    const okPowers = []

    // Original: repeat with N = 1 to count(tmp)
    for (const condition of POWER_CONDITIONS) {
      // Original: set tmpOK to 1
      let ok = true

      // Original: repeat with tmpCondition in tmpConditions
      for (const reqProp of condition.requires) {
        // Original: if not (getaProp(argProps, tmpCondition) > 0) then set tmpOK to 0
        if (!(props[reqProp] > 0)) {
          ok = false
          break
        }
      }

      // Original: if tmpOK then if getPos(tmpOKPowers, tmpType) = 0 then add(...)
      if (ok && !okPowers.includes(condition.type)) {
        okPowers.push(condition.type)
      }
    }

    return okPowers
  }

  /**
   * Check which power types are currently usable
   * Original: on checkCurrentlyOKPowers argProps, argPossibleTypes
   * @param {Object} props - Boat properties
   * @param {Array<string>} possibleTypes - Power types to check
   * @returns {Object} Map of power type to status (1 = ok, or error string)
   */
  checkCurrentlyOKPowers(props, possibleTypes) {
    // Original: set tmpCurrentlyOK to [:]
    const currentlyOK = {}

    // Original: repeat with tmpType in argPossibleTypes
    for (const type of possibleTypes) {
      // Original: set tmpOK to 1
      let ok = 1

      if (type === 'Sail') {
        // Original: if not getaProp(argProps, #Rudder) then set tmpOK to #NoRudder
        if (!props.Rudder) {
          ok = 'NoRudder'
        }
        // Original: else if not getaProp(argProps, #SteerPart) then set tmpOK to #NoSteering
        else if (!props.SteerPart) {
          ok = 'NoSteering'
        }
      } else if (type === 'Motor') {
        // Original: if not getaProp(argProps, #SteerPart) then
        //   if not getaProp(argProps, #OutboardEngine) then set tmpOK to #NoSteering
        if (!props.SteerPart && !props.OutboardEngine) {
          ok = 'NoSteering'
        }

        // Original: if not getaProp(argProps, #Rudder) then
        //   if not getaProp(argProps, #OutboardEngine) then set tmpOK to #NoRudder
        if (ok === 1 && !props.Rudder && !props.OutboardEngine) {
          ok = 'NoRudder'
        }

        // Original: if tmpOK = 1 then if not getaProp(argProps, #FuelVolume) then set tmpOK to #NoTank
        if (ok === 1 && !props.FuelVolume) {
          ok = 'NoTank'
        }
      }
      // Oar type has no special requirements in original

      // Original: addProp(tmpCurrentlyOK, tmpType, tmpOK)
      currentlyOK[type] = ok
    }

    return currentlyOK
  }

  /**
   * Create clean boat properties for specific power mode
   * Original: on makeCleanBoat argType, argProps
   * @param {string} type - Power type ('Sail', 'Motor', 'Oar')
   * @param {Object} props - Boat properties (optional)
   * @returns {Object} Modified boat properties
   */
  makeCleanBoat(type, props) {
    // Original: if voidp(argProps) then set argProps to boatProperties
    if (!props) {
      props = { ...this.globals.user.boat.boatProperties }
    }

    // Original: set tmpNotAllowed to [...] based on type
    const notAllowed = NOT_ALLOWED[type] || {}

    // Original: set tmp to the parts of the boat
    const parts = this.globals.user.boat.parts || []

    // Original: repeat with tmpID in tmp
    for (const partId of parts) {
      // Original: set tmpPartObj to getPart(the parts of gMulleGlobals, tmpID)
      const partObj = this.globals.parts.getPart(partId)

      // Original: if objectp(tmpPartObj) then
      if (!partObj) continue

      // Original: repeat with N = 1 to count(tmpNotAllowed)
      for (const [partType, drainProps] of Object.entries(notAllowed)) {
        // Original: if getProperty(tmpPartObj, tmpProp) then
        const hasProperty = typeof partObj.getProperty === 'function'
          ? partObj.getProperty(partType)
          : partObj[partType]

        if (hasProperty) {
          // Original: repeat with tmpDrainProp in tmpDrainList
          for (const drainProp of drainProps) {
            // Original: if tmpDrainProp = #MaxDepth then set tmpCPProp to #depth
            const sourceProp = drainProp === 'MaxDepth' ? 'depth' : drainProp

            // Original: setaProp(argProps, tmpDrainProp, getProp(argProps, tmpDrainProp) - getProperty(tmpPartObj, tmpCPProp))
            const partValue = typeof partObj.getProperty === 'function'
              ? partObj.getProperty(sourceProp)
              : (partObj[sourceProp] || 0)

            if (props[drainProp] !== undefined) {
              props[drainProp] = props[drainProp] - partValue
            }
          }
        }
      }
    }

    return props
  }
}
