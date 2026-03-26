/**
 * Part.js - Individual part data
 * Based on original Lingo: ParentScript 8 - Part.ls
 *
 * Represents a single boat part:
 * - Views (junk, shelf, use)
 * - Properties (weight, power, etc.)
 * - Snap points (required, covered, new)
 * - Sounds
 * - Master/morph relationships
 *
 * Original Lingo properties:
 * - partId: Part identifier
 * - master: Master part ID (for variants)
 * - morphList: List of morph variants
 * - ShelfView, junkView, UseView, UseView2: Image names
 * - offset: Position offset
 * - sndDescription, sndAttachOnBoat: Sound names
 * - sndDropOnList: Drop sounds by location
 * - partProperties: Part properties
 * - clickAreaList: Click regions
 * - requiredPoints, coveredPoints, newPoints: Snap point data
 */
'use strict'

class Part {
  /**
   * Create part
   * @param {Object} partsManager - Parts manager for master lookup
   */
  constructor(partsManager) {
    this.partsManager = partsManager

    // Original: set partId to 0
    this.partId = 0

    // Original: set master to 0
    this.master = 0

    // Original Lingo: set morphList to [] in constructor
    // But Lingo getaProp returns VOID when property is absent.
    // listp(VOID) = false, so isMorphPart should return false for
    // a fresh Part. We use null to match Lingo VOID semantics.
    this.morphList = null

    // Original: set ShelfView to EMPTY, etc.
    this.ShelfView = ''
    this.junkView = ''
    this.UseView = ''
    this.UseView2 = ''
    this.useViewInside = ''
    this.UseViewInside2 = ''

    // Original: set offset to [0, 0]
    this.offset = { x: 0, y: 0 }

    // Original: set sndDescription to EMPTY, etc.
    this.sndDescription = ''
    this.sndAttachOnBoat = ''
    this.sndDropOnList = {}

    // Original: set partProperties to [:]
    this.partProperties = {}

    // Original: set clickAreaList to []
    this.clickAreaList = []

    // Original: set requiredPoints to []
    this.requiredPoints = []

    // Original: set coveredPoints to []
    this.coveredPoints = []

    // Original: set newPoints to []
    this.newPoints = []
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   */
  kill() {
    this.morphList = 0
    this.offset = 0
    this.sndDropOnList = 0
    this.partProperties = 0
    this.clickAreaList = 0
    this.requiredPoints = 0
    this.coveredPoints = 0
    this.newPoints = 0
    return 0
  }

  /**
   * Get part ID
   * Original: on getId me
   */
  getId() {
    return this.partId
  }

  /**
   * Get master part ID
   * Original: on getMaster me
   */
  getMaster() {
    return this.master
  }

  /**
   * Check if has master (is variant)
   * Original: on isMaster me
   */
  isMaster() {
    return this.master !== 0
  }

  /**
   * Get morph list
   * Original: on getMorphList me
   */
  getMorphList() {
    return this.morphList
  }

  /**
   * Check if is morph part
   * Original: on isMorphPart me
   */
  isMorphPart() {
    return Array.isArray(this.morphList)
  }

  /**
   * Check if normal part (no master, no morphs)
   * Original: on isNormalpart me
   */
  isNormalpart() {
    return this.master === 0 && !Array.isArray(this.morphList)
  }

  /**
   * Get junk view with master fallback
   * Original: on getJunkView me
   */
  getJunkView() {
    if (this.isMaster() && !this.junkView) {
      return this._getMasterProperty('getJunkView')
    }
    return this.junkView
  }

  /**
   * Get shelf view with master fallback
   * Original: on getShelfView me
   */
  getShelfView() {
    if (this.isMaster() && !this.ShelfView) {
      return this._getMasterProperty('getShelfView')
    }
    return this.ShelfView
  }

  /**
   * Get use view with master fallback
   * Original: on getUseView me
   */
  getUseView() {
    if (this.isMaster() && !this.UseView) {
      return this._getMasterProperty('getUseView')
    }
    return this.UseView
  }

  /**
   * Get offset with master fallback
   * Original: on getOffset me
   */
  getOffset() {
    if (this.isMaster() && !this.UseView) {
      return this._getMasterProperty('getOffset')
    }
    return this.offset
  }

  /**
   * Get use view 2 with master fallback
   * Original: on getUseView2 me
   */
  getUseView2() {
    if (this.isMaster() && !this.UseView2) {
      return this._getMasterProperty('getUseView2')
    }
    return this.UseView2
  }

  /**
   * Get use view inside with master fallback
   * Original: on getUseViewInside me
   */
  getUseViewInside() {
    if (this.isMaster() && !this.useViewInside) {
      return this._getMasterProperty('getUseViewInside')
    }
    return this.useViewInside
  }

  /**
   * Get use view inside 2 with master fallback
   * Original: on getUseViewInside2 me
   */
  getUseViewInside2() {
    if (this.isMaster() && !this.UseViewInside2) {
      return this._getMasterProperty('getUseViewInside2')
    }
    return this.UseViewInside2
  }

  /**
   * Get description sound with master fallback
   * Original: on getSndDescription me
   */
  getSndDescription() {
    if (this.isMaster() && !this.sndDescription) {
      return this._getMasterProperty('getSndDescription')
    }
    return this.sndDescription
  }

  /**
   * Get attach sound with master fallback
   * Original: on getSndAttachOnBoat me
   */
  getSndAttachOnBoat() {
    if (this.isMaster() && !this.sndAttachOnBoat) {
      return this._getMasterProperty('getSndAttachOnBoat')
    }
    return this.sndAttachOnBoat
  }

  /**
   * Get drop sound for location
   * Original: on getSndDropOn me, argWhere
   */
  getSndDropOn(where) {
    // Normalize shelf locations
    if (typeof where === 'string' && where.substring(0, 5) === 'Shelf') {
      where = 'Shelf'
    }

    const snd = this.sndDropOnList[where]

    if (this.isMaster() && !snd) {
      const masterPart = this._getMasterPart()
      if (masterPart) {
        return masterPart.getSndDropOn(where)
      }
    }

    return snd
  }

  /**
   * Get property list with master fallback
   * Original: on getPropertyList me
   */
  getPropertyList() {
    if (this.isMaster() && Object.keys(this.partProperties).length === 0) {
      return this._getMasterProperty('getPropertyList')
    }
    return this.partProperties
  }

  /**
   * Get specific property
   * Original: on getProperty me, argProp
   */
  getProperty(prop) {
    const props = this.getPropertyList()
    return props ? props[prop] : undefined
  }

  /**
   * Get category from properties
   * @returns {string} Part category
   */
  getCategory() {
    const props = this.getPropertyList()
    return props ? props.category : undefined
  }

  /**
   * Get size from properties
   * @returns {{width: number, height: number}} Part size
   */
  getSize() {
    const props = this.getPropertyList()
    if (props && props.width && props.height) {
      return { width: props.width, height: props.height }
    }
    return { width: 0, height: 0 }
  }

  /**
   * Serialize to list format for saving
   * @returns {Object} Serialized part data
   */
  toList() {
    return {
      partId: this.partId,
      master: this.master,
      MorphsTo: this.morphList,
      ShelfView: this.ShelfView,
      junkView: this.junkView,
      UseView: this.UseView,
      offset: this.offset,
      UseView2: this.UseView2,
      useViewInside: this.useViewInside,
      UseViewInside2: this.UseViewInside2,
      sndDescription: this.sndDescription,
      sndAttachOnBoat: this.sndAttachOnBoat,
      SndDropOn: this.sndDropOnList,
      Properties: this.partProperties,
      ClickArea: this.clickAreaList,
      Requires: this.requiredPoints,
      Covers: this.coveredPoints,
      new: this.newPoints
    }
  }

  /**
   * Get click area with master fallback
   * Original: on getClickArea me
   */
  getClickArea() {
    if (this.isMaster() && !Array.isArray(this.clickAreaList)) {
      return this._getMasterProperty('getClickArea')
    }
    return this.clickAreaList
  }

  /**
   * Find morph for snap point
   * Original: on getMorphToSnap me, argSnapPoint
   */
  getMorphToSnap(snapPoint) {
    if (!this.morphList) return 'error'

    for (const morphId of this.morphList) {
      const morphPart = this.partsManager?.getPart(morphId)
      if (morphPart) {
        const reqPoints = morphPart.getRequiredPoints()
        if (Array.isArray(reqPoints) && reqPoints[0] === snapPoint) {
          return morphId
        }
      }
    }

    return 'error'
  }

  /**
   * Get required snap points
   * Original: on getRequiredPoints me
   */
  getRequiredPoints() {
    return this.requiredPoints
  }

  /**
   * Get covered snap points
   * Original: on getCoveredPoints me
   */
  getCoveredPoints() {
    return this.coveredPoints
  }

  /**
   * Get new snap points
   * Original: on getNewPoints me
   */
  getNewPoints() {
    return this.newPoints
  }

  /**
   * Get half the height of the junk view member
   * Original .ls line 216-217: on getHeight me
   *   return the height of member getJunkView(me) / 2
   */
  getHeight() {
    if (this.memberResolver) {
      return this.memberResolver.getMemberHeight(this.getJunkView()) / 2
    }
    return 0
  }

  /**
   * Get half the width of the junk view member
   * Original .ls line 220-221: on getWidth me
   *   return the width of member getJunkView(me) / 2
   */
  getWidth() {
    if (this.memberResolver) {
      return this.memberResolver.getMemberWidth(this.getJunkView()) / 2
    }
    return 0
  }

  /**
   * Deserialize from data
   * Original: on fromList me, argTheId
   */
  fromList(data) {
    if (!data || typeof data !== 'object') {
      return false
    }

    this.partId = data.partId || 0
    this.master = data.master || 0
    // Original Lingo line 233: set morphList to getaProp(objectList, #MorphsTo)
    // If MorphsTo is not present, Lingo getaProp returns VOID (not []).
    // listp(VOID) = false, so isMorphPart() should return false.
    // We use null (not []) to match Lingo VOID behavior.
    this.morphList = data.MorphsTo != null ? data.MorphsTo : null
    this.ShelfView = data.ShelfView || ''
    this.junkView = data.junkView || ''
    this.UseView = data.UseView || ''
    this.offset = data.offset || { x: 0, y: 0 }
    this.UseView2 = data.UseView2 || ''
    this.useViewInside = data.useViewInside || ''
    this.UseViewInside2 = data.UseViewInside2 || ''
    this.sndDescription = data.sndDescription || ''
    this.sndAttachOnBoat = data.sndAttachOnBoat || ''
    this.sndDropOnList = data.SndDropOn || {}
    this.partProperties = data.Properties || {}
    this.clickAreaList = data.ClickArea || []
    this.requiredPoints = data.Requires || []
    this.coveredPoints = data.Covers || []
    this.newPoints = data.new || []

    return true
  }

  /**
   * Get property from master part
   * @private
   */
  _getMasterProperty(methodName) {
    const masterPart = this._getMasterPart()
    if (masterPart && typeof masterPart[methodName] === 'function') {
      return masterPart[methodName]()
    }
    return null
  }

  /**
   * Get master part object
   * @private
   */
  _getMasterPart() {
    if (this.partsManager && this.master) {
      return this.partsManager.getPart(this.master)
    }
    return null
  }
}

module.exports = Part;
