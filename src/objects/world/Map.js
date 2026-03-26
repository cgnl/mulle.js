/**
 * Map.js - Single map data
 * Based on original Lingo: ParentScript 139 - Map.ls
 *
 * Represents a single game map:
 * - Map image and under-map image
 * - Topology/collision data
 * - Objects on the map
 * - Special properties (fog, wind, etc.)
 *
 * Original Lingo properties:
 * - MapId: Map identifier
 * - objects: List of objects on map
 * - MapImage: Main map image name
 * - Topology: Topology/collision image name
 * - Special: Special properties
 * - underMapImage: Under-map image name
 */
'use strict'

export default class Map {
  /**
   * Create map
   * Original: on new me
   */
  constructor() {
    // Original: set MapId to EMPTY
    this.MapId = ''

    // Original: set objects to []
    this.objects = []

    // Original: set MapImage to EMPTY
    this.MapImage = ''

    // Original: set Topology to EMPTY
    this.Topology = ''

    // Not initialized in original constructor
    this.Special = undefined
    this.underMapImage = undefined
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    this.objects = 0
    return 0
  }

  /**
   * Get map image name
   * Original: on getMapImage me
   */
  getMapImage() {
    return this.MapImage
  }

  /**
   * Get under-map image name
   * Original: on getUnderMapImage me
   */
  getUnderMapImage() {
    return this.underMapImage
  }

  /**
   * Get objects on map
   * Original: on getObjects me
   */
  getObjects() {
    return this.objects
  }

  /**
   * Get topology name
   * Original: on getTopology me
   */
  getTopology() {
    return this.Topology
  }

  /**
   * Get special properties
   * Original: on getSpecial me, argProp
   * @param {string} prop - Property to get (optional)
   */
  getSpecial(prop) {
    // Original: if voidp(argProp) then return Special
    if (prop === undefined) {
      return this.Special
    }

    // Original: if listp(Special) then return getaProp(Special, argProp)
    if (this.Special && typeof this.Special === 'object') {
      return this.Special[prop]
    }

    return undefined
  }

  /**
   * Serialize to list
   * Original: on toList me
   */
  toList() {
    return {
      MapId: this.MapId,
      objects: this.objects,
      MapImage: this.MapImage,
      Topology: this.Topology
    }
  }

  /**
   * Deserialize from data
   * Original: on fromList me, theid
   * @param {Object|number} data - Map data object or map ID
   */
  fromList(data) {
    // Original looks up member by ID, we accept data directly
    if (typeof data !== 'object') {
      return false
    }

    this.MapId = data.MapId || ''
    this.objects = data.objects || []
    this.MapImage = data.MapImage || ''
    this.underMapImage = data.underMapImage
    this.Topology = data.Topology || ''
    this.Special = data.Special

    return true
  }
}
