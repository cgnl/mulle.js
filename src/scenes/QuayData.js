/**
 * @fileoverview QuayData - Pure data module for Quay/Boatyard scene (scene 04)
 * Based on: decompiled Lingo for scene 04 (ParentScript 22 - Dir.ls)
 *
 * Scene 04 is the Quay/Boatyard where the player builds boats and launches them.
 * Key functionality includes:
 *
 *   1. Mission initialization - Sets belly inventory and gives missions based on completion
 *   2. Delivery trigger - Determines if Doris should make a delivery
 *   3. Delivery calculation - Computes what gets delivered (blueprint or parts)
 *   4. Sail gate - Checks if boat can sail and determines destination world
 *   5. Weather ambient sounds - Background sounds based on weather type
 *   6. Wind report sounds - Mulle's wind speed announcements
 *   7. Dialog priority system - Determines what dialog plays in the loop
 */

'use strict'

// ============================================================================
// DIALOG LISTS (from Lingo lines 14-17)
// ============================================================================

/** First-time dialog list - consumed randomly one at a time */
const FIRST_DIALOG_LIST = [
  '04d010v0',
  '04d012v0',
  '04d047v0',
  '04d051v0',
  '04d052v0'
]

/** General dialog list - random selection, not consumed */
const GEN_DIALOG_LIST = [
  '00d001v0', '00d002v0', '00d003v0', '00d004v0', '00d005v0',
  '04d001v0', '04d002v0', '04d003v0', '04d004v0', '04d007v0',
  '04d013v0', '04d014v0', '04d015v0', '04d016v0', '04d017v0',
  '04d018v0', '04d019v0', '04d020v0', '04d022v0', '04d023v0',
  '04d027v0', '04d028v0', '04d029v0', '04d030v0', '04d032v0'
]

/** Doris blueprint delivery announcements */
const DORIS_BLUEPRINT_LIST = [
  '04d040v0',
  '04d044v0'
]

/** Doris parts delivery announcements */
const DORIS_PART_LIST = [
  '04d034v0', '04d035v0', '04d036v0', '04d037v0', '04d038v0',
  '04d039v0', '04d041v0', '04d042v0', '04d043v0', '04d045v0',
  '04d046v0'
]

/** Very first time radio dialog (when isItTheVeryFirstTime is true) */
const VERY_FIRST_TIME_RADIO_LIST = [
  '00d075v0',
  '50d012v0'
]

// ============================================================================
// WEATHER AMBIENT SOUNDS (from Lingo lines 65-80)
// ============================================================================

/** Weather type to ambient sound mapping */
const WEATHER_AMBIENT_MAP = {
  1: { volume: 200, sound: '00e108v0' },
  2: { volume: 200, sound: '00e109v0' },
  3: { volume: 150, sound: '00e104v0' },
  4: { volume: 150, sound: '00e107v0' }
}

// ============================================================================
// WIND REPORT SOUNDS (from Lingo lines 226-236)
// ============================================================================

/** Wind speed to sound mapping */
const WIND_REPORT_MAP = {
  0: '00d010v0',
  1: '00d011v0',
  2: '00d012v0',
  3: '00d013v0'
}

// ============================================================================
// CONSTANTS
// ============================================================================

/** Sound played when boat cannot sail (no propulsion) */
const NO_SAIL_SOUND = '04d049v0'

/** Belly value always set on scene init */
const BELLY_VALUE = 1000

// ============================================================================
// FUNCTIONS
// ============================================================================

/**
 * Compute mission initialization effects.
 * Belly is always set to 1000. Missions 1, 2, and 13 are given based on
 * whether missions 20, 2, and 13 are completed respectively.
 *
 * From Lingo lines 33-41:
 *   setInInventory(user, #Belly, [#nr: 1000])
 *   if isMissionCompleted(user, 20) then addGivenMission(user, 1)
 *   if isMissionCompleted(user, 2) then addGivenMission(user, 2)
 *   if isMissionCompleted(user, 13) then addGivenMission(user, 13)
 *
 * @param {{ m20: boolean, m2: boolean, m13: boolean }} completedMissions
 * @returns {{ setBelly: number, giveMissions: number[] }}
 */
function computeMissionInit (completedMissions) {
  const giveMissions = []

  if (completedMissions.m20) {
    giveMissions.push(1)
  }
  if (completedMissions.m2) {
    giveMissions.push(2)
  }
  if (completedMissions.m13) {
    giveMissions.push(13)
  }

  return {
    setBelly: BELLY_VALUE,
    giveMissions
  }
}

/**
 * Determine if a delivery should be made.
 * Delivery happens when builtBoats is 2 OR divisible by 4, and builtBoats > 0,
 * and deliveryMade is false.
 *
 * From Lingo lines 60-63:
 *   if ((tmpBuiltBoats = 2) or ((tmpBuiltBoats mod 4) = 0)) and (tmpBuiltBoats > 0) and not (deliveryMade) then
 *     set makeDelivery to 1
 *   end if
 *
 * @param {number} builtBoats - Number of boats built
 * @param {boolean} deliveryMade - Whether a delivery has already been made this session
 * @returns {boolean}
 */
function shouldMakeDelivery (builtBoats, deliveryMade) {
  if (deliveryMade) {
    return false
  }
  if (builtBoats <= 0) {
    return false
  }
  if (builtBoats === 2) {
    return true
  }
  if (builtBoats % 4 === 0) {
    return true
  }
  return false
}

/**
 * Compute the delivery index (1-based Lingo index).
 * If builtBoats is 2, index is 1. Otherwise index is 1 + (builtBoats / 4).
 *
 * From Lingo lines 168-175:
 *   if tmpBuiltBoats = 2 then
 *     set tmpIndex to 1
 *   else
 *     set tmpIndex to 1 + (tmpBuiltBoats / 4)
 *   end if
 *
 * Note: Lingo integer division is used.
 *
 * @param {number} builtBoats - Number of boats built
 * @returns {number} 1-based delivery index
 */
function computeDeliveryIndex (builtBoats) {
  if (builtBoats === 2) {
    return 1
  }
  return 1 + Math.floor(builtBoats / 4)
}

/**
 * Compute the delivery result based on delivery list and index.
 * Examines the delivery at the given index (1-based).
 * If the first element is a symbol (string starting with uppercase), it's a blueprint.
 * Otherwise it's parts (array of part numbers).
 *
 * From Lingo lines 176-197:
 *   set tmpParts to getParts(externalParts, #Delivery)
 *   if tmpIndex <= count(tmpParts) then
 *     set tmpDelivery to getAt(tmpParts, tmpIndex)
 *     if count(tmpDelivery) > 0 then
 *       set tmpFirst to getAt(tmpDelivery, 1)
 *       if symbolp(tmpFirst) then
 *         setInInventory(user, tmpFirst, [:])
 *         gotNewHull = 1
 *         radio plays dorisBluePrintList
 *       else
 *         repeat with tmpRkn = 1 to count(tmpDelivery)
 *           addNewPart(user, getAt(tmpDelivery, tmpRkn))
 *         end repeat
 *         gotNewParts = 1
 *         radio plays dorisPartList
 *       end if
 *       returnValue = 1
 *       deliveryMade = 1
 *     end if
 *   end if
 *
 * @param {Array} deliveryList - Array of deliveries (each is array of items)
 * @param {number} deliveryIndex - 1-based index into deliveryList
 * @returns {{ type: 'blueprint'|'parts'|'none', items: Array, setDeliveryMade: boolean, setGotNewHull: boolean, setGotNewParts: boolean }}
 */
function computeDeliveryResult (deliveryList, deliveryIndex) {
  const result = {
    type: 'none',
    items: [],
    setDeliveryMade: false,
    setGotNewHull: false,
    setGotNewParts: false
  }

  // Check if index is valid (1-based, so check against length)
  if (deliveryIndex < 1 || deliveryIndex > deliveryList.length) {
    return result
  }

  // Get delivery at 1-based index (convert to 0-based)
  const delivery = deliveryList[deliveryIndex - 1]

  // Check if delivery is empty
  if (!Array.isArray(delivery) || delivery.length === 0) {
    return result
  }

  const firstItem = delivery[0]

  // Check if first item is a symbol (blueprint) - in JS we represent symbols as strings
  // In the original Lingo, symbolp() checks if it's a symbol type
  // Symbols are typically uppercase identifiers like #Belly, #Hull1, etc.
  // In our JS conversion, blueprint names would be strings like 'Hull1', 'Hull2'
  if (typeof firstItem === 'string') {
    // Blueprint delivery
    result.type = 'blueprint'
    result.items = [firstItem]
    result.setDeliveryMade = true
    result.setGotNewHull = true
  } else {
    // Parts delivery (numbers)
    result.type = 'parts'
    result.items = [...delivery]
    result.setDeliveryMade = true
    result.setGotNewParts = true
  }

  return result
}

/**
 * Compute sail result - whether boat can sail and where it goes.
 * Boat can sail if it has engine, sailWithPole, or oar.
 * Destination is WoodWorld if material is 1, otherwise MetalWorld.
 *
 * From Lingo lines 134-148:
 *   if getProperty(tmpBoat, #engine) or getProperty(tmpBoat, #SailWithPole) or getProperty(tmpBoat, #Oar) then
 *     addNrOfBuiltBoats(user)
 *     deliveryMade = 0
 *     if getProperty(tmpBoat, #Material) = 1 then go("WoodWorld") else go("MetalWorld")
 *   else
 *     mulleTalk "04d049v0"
 *   end if
 *
 * @param {{ engine: boolean, sailWithPole: boolean, oar: boolean, material: number }} boatProps
 * @returns {{ canSail: boolean, world: 'WoodWorld'|'MetalWorld'|null, incrementBuiltBoats: boolean, clearDeliveryMade: boolean, noSailSound: string|null }}
 */
function computeSailResult (boatProps) {
  const { engine, sailWithPole, oar, material } = boatProps

  const canSail = !!(engine || sailWithPole || oar)

  if (canSail) {
    return {
      canSail: true,
      world: material === 1 ? 'WoodWorld' : 'MetalWorld',
      incrementBuiltBoats: true,
      clearDeliveryMade: true,
      noSailSound: null
    }
  }

  return {
    canSail: false,
    world: null,
    incrementBuiltBoats: false,
    clearDeliveryMade: false,
    noSailSound: NO_SAIL_SOUND
  }
}

/**
 * Get weather ambient sound configuration.
 *
 * From Lingo lines 65-80:
 *   case getType(weather) of
 *     1: vol=200, "00e108v0"
 *     2: vol=200, "00e109v0"
 *     3: vol=150, "00e104v0"
 *     4: vol=150, "00e107v0"
 *   end case
 *
 * @param {number} weatherType - Weather type (1-4)
 * @returns {{ volume: number, sound: string }|null}
 */
function getWeatherAmbient (weatherType) {
  return WEATHER_AMBIENT_MAP[weatherType] || null
}

/**
 * Get wind report sound for a given wind speed.
 *
 * From Lingo lines 226-236:
 *   case getWindspeed(weather) of
 *     0: "00d010v0"
 *     1: "00d011v0"
 *     2: "00d012v0"
 *     3: "00d013v0"
 *   end case
 *
 * @param {number} windSpeed - Wind speed (0-3)
 * @returns {string|null}
 */
function getWindReportSound (windSpeed) {
  return WIND_REPORT_MAP[windSpeed] || null
}

/**
 * Resolve dialog priority for the loop handler.
 * Priority order (highest to lowest):
 *   1. makeDelivery → call doDelivery
 *   2. radioReport → play from radioDialogList
 *   3. windReport → play wind sound
 *   4. FirstTime → consume from firstDialogList
 *   5. General → random from genDialogList
 *
 * From Lingo lines 200-264 (loop handler)
 *
 * @param {object} state
 * @param {boolean} state.makeDelivery - Whether delivery should be made
 * @param {boolean} state.radioReport - Whether radio report is pending
 * @param {number} state.radioDialogListLength - Current length of radioDialogList
 * @param {number} state.radioCount - Original count of radio dialogs
 * @param {boolean} state.windReport - Whether wind report is pending
 * @param {number} state.windSpeed - Current wind speed (0-3)
 * @param {boolean} state.firstTime - Whether this is first time in scene
 * @param {number} state.loopCounter - Current loop counter
 * @param {number} state.firstDialogListLength - Remaining first dialogs count
 * @returns {object|null} Action to take, or null if no action
 */
function resolveQuayDialogPriority (state) {
  const {
    makeDelivery,
    radioReport,
    radioDialogListLength,
    radioCount,
    windReport,
    windSpeed,
    firstTime,
    loopCounter,
    firstDialogListLength
  } = state

  // Priority 1: Delivery
  if (makeDelivery) {
    return {
      action: 'doDelivery',
      setOKToTalk: false
    }
  }

  // Priority 2: Radio report
  if (radioReport) {
    if (radioDialogListLength > 0) {
      // First dialog is Mulle NormalTalk, rest are Radio smallTalk
      const isFirst = radioDialogListLength === radioCount
      return {
        action: 'playRadioDialog',
        talkType: isFirst ? 'MulleNormalTalk' : 'RadioSmallTalk',
        dialogIndex: 0, // Always play first in list
        deleteAfterPlay: true
      }
    } else {
      // Radio report complete, reset
      return {
        action: 'resetRadioReport',
        setLoopCounter: 360 + 720, // 360 + random(720) - we return max for testing
        setRadioCount: 0,
        setRadioReport: false
      }
    }
  }

  // Priority 3: Wind report
  if (windReport) {
    const sound = getWindReportSound(windSpeed)
    if (sound) {
      return {
        action: 'playWindReport',
        sound,
        talkType: 'MulleNormalTalk',
        setWindReport: false
      }
    } else {
      return {
        action: 'clearWindReport',
        setWindReport: false
      }
    }
  }

  // Priority 4: First time dialogs (only when loopCounter is 0)
  if (firstTime) {
    if (loopCounter === 0) {
      if (firstDialogListLength > 0) {
        return {
          action: 'playFirstTimeDialog',
          talkType: 'MulleInfoTalk',
          selectRandom: true,
          deleteAfterPlay: true,
          setLoopCounter: 120 + 120 // 120 + random(120) - we return max for testing
        }
      } else {
        return {
          action: 'clearFirstTime',
          setFirstTime: false
        }
      }
    }
    return null // Wait for loopCounter to reach 0
  }

  // Priority 5: General dialog (only when loopCounter is 0)
  if (loopCounter === 0) {
    return {
      action: 'playGeneralDialog',
      talkType: 'MulleNormalTalk',
      selectRandom: true,
      setLoopCounter: 360 + 720 // 360 + random(720) - we return max for testing
    }
  }

  return null
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Dialog lists
  FIRST_DIALOG_LIST,
  GEN_DIALOG_LIST,
  DORIS_BLUEPRINT_LIST,
  DORIS_PART_LIST,
  VERY_FIRST_TIME_RADIO_LIST,

  // Weather/wind maps
  WEATHER_AMBIENT_MAP,
  WIND_REPORT_MAP,

  // Constants
  NO_SAIL_SOUND,
  BELLY_VALUE,

  // Functions
  computeMissionInit,
  shouldMakeDelivery,
  computeDeliveryIndex,
  computeDeliveryResult,
  computeSailResult,
  getWeatherAmbient,
  getWindReportSound,
  resolveQuayDialogPriority
}
