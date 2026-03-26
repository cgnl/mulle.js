/**
 * Maps.js - Collection of maps manager
 * Based on original Lingo: ParentScript 138 - Maps.ls
 *
 * Manages map loading.
 *
 * Original Lingo properties:
 * - maps: List of map data
 */
'use strict'

export default class Maps {
  /**
   * Create maps manager
   * Original: on new me
   */
  constructor() {
    // Original: set maps to []
    this.maps = []
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    this.maps = 0
    return 0
  }

  /**
   * Load a map
   * Original: on loadMap me, map, MapId
   * @param {Object} map - Map object to load into
   * @param {*} mapId - Map data/ID to load
   */
  loadMap(map, mapId) {
    // Original: if not objectp(map) then return #InvalidObject
    if (!map || typeof map !== 'object') {
      return 'InvalidObject'
    }

    // Original: if fromList(map, MapId) then return 0 else return #InvalidMember
    if (map.fromList && map.fromList(mapId)) {
      return 0
    } else {
      return 'InvalidMember'
    }
  }

  /**
   * Serialize to list
   * Original: on toList me
   */
  toList() {
    return this.maps
  }

  /**
   * Deserialize from list
   * Original: on fromList me, objectList
   */
  fromList(list) {
    this.maps = list
  }
}
