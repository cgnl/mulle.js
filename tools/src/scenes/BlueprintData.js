/**
 * @fileoverview BlueprintData - Pure data module for Blueprint scene (boten_15.DXR)
 * 
 * All data extracted from the original Director score binary (15.dir).
 * Contains hull variant definitions, sprite member mappings, sound IDs,
 * and lookup helpers. No Phaser dependencies.
 * 
 * Original Lingo scripts:
 *   - BehaviorScript 5 - HullRuddBH.ls (hull/rudder selection)
 *   - BehaviorScript 2 - MainMenuBH.ls (page tabs)
 *   - BehaviorScript 6 - HullBackgroundBH.ls (page backgrounds)
 *   - BehaviorScript 11 - InfoButtonBH.ls (info buttons)
 *   - ParentScript 1 - Dir.ls (sprite channel assignments)
 * 
 * Original system: 4 hull variants per size (Small/Medium/Large).
 * Each variant has a wood+metal hull pair, its own rudder ID,
 * and dedicated sprite members for selection/rollover states.
 * Small/Medium default to Wood, Large defaults to Metal.
 * 
 * @module scenes/BlueprintData
 */
'use strict'

/**
 * Hull size lists from BoatViewHandler.ls
 */
const HULL_LISTS = {
  Large: [1, 716, 717, 718, 719, 720, 721, 722],
  Medium: [45, 723, 724, 725, 726, 727, 728, 729],
  Small: [92, 730, 731, 732, 733, 734, 735, 736]
}

/**
 * 4 hull variants per size, extracted from Director score binary.
 * Each variant carries all HullRuddBH sprite instance properties.
 * 
 * Properties per variant:
 *   woodHullID      - Part ID for wood hull
 *   metalHullID     - Part ID for metal hull
 *   rudderPartID    - Part ID for this variant's rudder
 *   defaultMaterial - 'Wood' or 'Metal' (original #Wood/#Metal)
 *   selHullPic      - Director member name shown when hull is selected
 *   rollHullPic     - Director member name shown on hull rollover
 *   selRudderPic    - Director member name shown when rudder is selected
 *   rollRudderPic   - Director member name shown on rudder rollover
 *   hullSound       - Sound ID played on hover (after loopCounter=15)
 */
const HULL_VARIANTS = {
  Small: [
    {
      woodHullID: 92, metalHullID: 730, rudderPartID: 842,
      defaultMaterial: 'Wood',
      selHullPic: '15b011v0', rollHullPic: '15b048v0',
      selRudderPic: '15b015v0', rollRudderPic: '15b052v0',
      hullSound: '15d015v0'
    },
    {
      woodHullID: 734, metalHullID: 731, rudderPartID: 827,
      defaultMaterial: 'Wood',
      selHullPic: '15b012v0', rollHullPic: '15b049v0',
      selRudderPic: '15b017v0', rollRudderPic: '15b053v0',
      hullSound: '15d016v0'
    },
    {
      woodHullID: 735, metalHullID: 732, rudderPartID: 825,
      defaultMaterial: 'Wood',
      selHullPic: '15b013v0', rollHullPic: '15b050v0',
      selRudderPic: '15b019v0', rollRudderPic: '15b054v0',
      hullSound: '15d017v0'
    },
    {
      woodHullID: 736, metalHullID: 733, rudderPartID: 829,
      defaultMaterial: 'Wood',
      selHullPic: '15b014v0', rollHullPic: '15b051v0',
      selRudderPic: '15b021v0', rollRudderPic: '15b055v0',
      hullSound: '15d018v0'
    }
  ],

  Medium: [
    {
      woodHullID: 726, metalHullID: 45, rudderPartID: 844,
      defaultMaterial: 'Wood',
      selHullPic: '15b040v0', rollHullPic: '15b056v0',
      selRudderPic: '15b023v0', rollRudderPic: '15b060v0',
      hullSound: '15d019v0'
    },
    {
      woodHullID: 727, metalHullID: 723, rudderPartID: 846,
      defaultMaterial: 'Wood',
      selHullPic: '15b041v0', rollHullPic: '15b057v0',
      selRudderPic: '15b025v0', rollRudderPic: '15b061v0',
      hullSound: '15d020v0'
    },
    {
      woodHullID: 728, metalHullID: 724, rudderPartID: 848,
      defaultMaterial: 'Wood',
      selHullPic: '15b042v0', rollHullPic: '15b058v0',
      selRudderPic: '15b027v0', rollRudderPic: '15b063v0',
      hullSound: '15d021v0'
    },
    {
      woodHullID: 729, metalHullID: 725, rudderPartID: 850,
      defaultMaterial: 'Wood',
      selHullPic: '15b043v0', rollHullPic: '15b059v0',
      selRudderPic: '15b029v0', rollRudderPic: '15b064v0',
      hullSound: '15d022v0'
    }
  ],

  Large: [
    {
      woodHullID: 719, metalHullID: 716, rudderPartID: 818,
      defaultMaterial: 'Metal',
      selHullPic: '15b044v0', rollHullPic: '15b065v0',
      selRudderPic: '15b031v0', rollRudderPic: '15b069v0',
      hullSound: '15d003v0'
    },
    {
      woodHullID: 720, metalHullID: 1, rudderPartID: 820,
      defaultMaterial: 'Metal',
      selHullPic: '15b045v0', rollHullPic: '15b066v0',
      selRudderPic: '15b033v0', rollRudderPic: '15b070v0',
      hullSound: '15d004v0'
    },
    {
      woodHullID: 721, metalHullID: 717, rudderPartID: 822,
      defaultMaterial: 'Metal',
      selHullPic: '15b046v0', rollHullPic: '15b067v0',
      selRudderPic: '15b035v0', rollRudderPic: '15b071v0',
      hullSound: '15d005v0'
    },
    {
      woodHullID: 722, metalHullID: 718, rudderPartID: 824,
      defaultMaterial: 'Metal',
      selHullPic: '15b047v0', rollHullPic: '15b068v0',
      selRudderPic: '15b037v0', rollRudderPic: '15b072v0',
      hullSound: '15d006v0'
    }
  ]
}

/**
 * Sound effects from Dir.ls
 */
const SOUNDS = {
  select: '15e001v0',
  pageSwitch: '15e002v0',
  deselect: '15e004v0',
  exit: '15e005v0',
  drop: '00e110v0',
  incompatible: '15d028v0',
  rudderWithoutHull: '15d027v0'
}

/**
 * Page background sounds from HullBackgroundBH.ls instances
 */
const PAGE_SOUNDS = {
  Menu: '15d011v0',
  Large: '15d012v0',
  Medium: '15d013v0',
  Small: '15d014v0'
}

/**
 * Tab button configuration from MainMenuBH.ls instances
 */
const TAB_BUTTONS = {
  Small: {
    normalPic: '15b002v0',
    rollOverPic: '15b003v0',
    rollOverSound: '15d008v0',
    inventoryCheck: 'Blueprint1'
  },
  Medium: {
    normalPic: '15b004v0',
    rollOverPic: '15b005v0',
    rollOverSound: '15d009v0',
    inventoryCheck: 'Blueprint2'
  },
  Large: {
    normalPic: '15b006v0',
    rollOverPic: '15b007v0',
    rollOverSound: '15d010v0',
    inventoryCheck: 'Blueprint3'
  }
}

/**
 * Info button sprites from InfoButtonBH.ls
 * All info buttons share the same normal/rollover sprites.
 * The info sounds per variant are the same as hullSound.
 */
const INFO_BUTTON = {
  normalPic: '15b073v0',
  rollOverPic: '15b074v0'
}

/**
 * Sprite channel assignments from Dir.ls
 */
const SPRITE_CHANNELS = {
  CurrentHull: 7,
  CurrentRudder: 8,
  rollOver: 10
}

// =========================================================================
// Pre-built lookup tables
// =========================================================================

/** Set of all hull IDs for fast lookup */
const _allHullIds = new Set()
for (const size of Object.keys(HULL_LISTS)) {
  for (const id of HULL_LISTS[size]) {
    _allHullIds.add(id)
  }
}

/** Set of all rudder IDs for fast lookup */
const _allRudderIds = new Set()
for (const size of Object.keys(HULL_VARIANTS)) {
  for (const v of HULL_VARIANTS[size]) {
    _allRudderIds.add(v.rudderPartID)
  }
}

// =========================================================================
// Lookup helpers
// =========================================================================

/**
 * Get hull size category for a part ID
 * @param {number} partId
 * @returns {string|null} 'Small', 'Medium', 'Large', or null
 */
function getHullSize (partId) {
  for (const size of Object.keys(HULL_LISTS)) {
    if (HULL_LISTS[size].includes(partId)) {
      return size
    }
  }
  return null
}

/**
 * Find the variant that contains a given hull ID (wood or metal)
 * @param {number} hullId
 * @returns {Object|null} variant object or null
 */
function getVariantForHull (hullId) {
  for (const size of Object.keys(HULL_VARIANTS)) {
    for (const v of HULL_VARIANTS[size]) {
      if (v.woodHullID === hullId || v.metalHullID === hullId) {
        return v
      }
    }
  }
  return null
}

/**
 * Find the variant that contains a given rudder ID
 * @param {number} rudderId
 * @returns {Object|null} variant object or null
 */
function getVariantForRudder (rudderId) {
  for (const size of Object.keys(HULL_VARIANTS)) {
    for (const v of HULL_VARIANTS[size]) {
      if (v.rudderPartID === rudderId) {
        return v
      }
    }
  }
  return null
}

/**
 * Check if a part ID is a hull
 * @param {number} partId
 * @returns {boolean}
 */
function isHull (partId) {
  return _allHullIds.has(partId)
}

/**
 * Check if a part ID is a rudder
 * @param {number} partId
 * @returns {boolean}
 */
function isRudder (partId) {
  return _allRudderIds.has(partId)
}

/**
 * Get all rudder IDs
 * @returns {number[]}
 */
function getAllRudderIds () {
  return Array.from(_allRudderIds)
}

// =========================================================================
// Exports
// =========================================================================

module.exports = {
  HULL_LISTS,
  HULL_VARIANTS,
  SOUNDS,
  PAGE_SOUNDS,
  TAB_BUTTONS,
  INFO_BUTTON,
  SPRITE_CHANNELS,
  getHullSize,
  getVariantForHull,
  getVariantForRudder,
  isHull,
  isRudder,
  getAllRudderIds
}
