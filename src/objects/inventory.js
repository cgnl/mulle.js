/**
 * Boat Parts Inventory System
 * 
 * BUG FIX #1 (ADDITIONAL_BUGS_ROUND2.md - Part/Inventory Management)
 * 
 * Original Lingo: Parts stored in user junk data with location/position tracking
 * JavaScript needs: Complete inventory management for shelf/quay positions
 * 
 * Manages boat parts in storage locations:
 * - Shelf positions (numbered shelves in junk shed)
 * - Quay positions (boat building area)
 * - Position tracking within each location
 * 
 * Original Lingo structure (from user data):
 * - Junk: [location: [partId: position]]
 * - Example: [#Shelf1: [730: point(100, 200)]]
 * 
 * @module objects/inventory
 */

/**
 * Boat Part Inventory Manager
 * Manages parts on shelves and quay with position tracking
 */
class BoatPartsInventory {
  /**
   * @param {Phaser.Game} game - Game instance
   */
  constructor (game) {
    this.game = game
    
    // Storage locations with part positions
    // Structure: { location: { partId: { x, y } } }
    this.locations = {
      Shelf1: {},
      Shelf2: {},
      Shelf3: {},
      Shelf4: {},
      Quay: {}
    }
    
    console.log('[BoatPartsInventory] Initialized')
  }

  /**
   * Add boat part to inventory at location
   * Original Lingo: addJunkPart(user, location, partId, position)
   * 
   * @param {string} location - Storage location (Shelf1-4, Quay)
   * @param {number} partId - Part ID
   * @param {Object} position - Position {x, y} or Phaser.Point
   * @returns {boolean} True if added successfully
   */
  addBoatPart (location, partId, position) {
    if (!this.isValidLocation(location)) {
      console.warn('[BoatPartsInventory] Invalid location:', location)
      return false
    }

    if (!partId) {
      console.warn('[BoatPartsInventory] Invalid part ID:', partId)
      return false
    }

    // Ensure location exists
    if (!this.locations[location]) {
      this.locations[location] = {}
    }

    // Store position (convert Phaser.Point to plain object)
    const pos = position instanceof Phaser.Point 
      ? { x: position.x, y: position.y }
      : { x: position.x || 0, y: position.y || 0 }

    this.locations[location][partId] = pos

    console.debug('[BoatPartsInventory] Added part', partId, 'to', location, 'at', pos)

    return true
  }

  /**
   * Remove boat part from inventory
   * @param {number} partId - Part ID
   * @returns {boolean} True if removed
   */
  removeBoatPart (partId) {
    for (const location in this.locations) {
      if (this.locations[location][partId]) {
        delete this.locations[location][partId]
        console.debug('[BoatPartsInventory] Removed part', partId, 'from', location)
        return true
      }
    }

    console.warn('[BoatPartsInventory] Part not found in inventory:', partId)
    return false
  }

  /**
   * Check if inventory has part
   * @param {number} partId - Part ID
   * @returns {boolean}
   */
  hasBoatPart (partId) {
    for (const location in this.locations) {
      if (this.locations[location][partId]) {
        return true
      }
    }
    return false
  }

  /**
   * Get position of part in inventory
   * @param {number} partId - Part ID
   * @returns {Object|null} Position {x, y, location} or null
   */
  getPartPosition (partId) {
    for (const location in this.locations) {
      if (this.locations[location][partId]) {
        return {
          ...this.locations[location][partId],
          location
        }
      }
    }
    return null
  }

  /**
   * Get all parts at a location
   * @param {string} location - Storage location
   * @returns {Array<{partId: number, x: number, y: number}>}
   */
  getPartsAtLocation (location) {
    if (!this.isValidLocation(location)) {
      console.warn('[BoatPartsInventory] Invalid location:', location)
      return []
    }

    const parts = []
    const locationParts = this.locations[location] || {}

    for (const partId in locationParts) {
      parts.push({
        partId: parseInt(partId),
        ...locationParts[partId]
      })
    }

    return parts
  }

  /**
   * Move part to different location
   * @param {number} partId - Part ID
   * @param {string} toLocation - Destination location
   * @param {Object} position - New position {x, y}
   * @returns {boolean} True if moved successfully
   */
  moveBoatPart (partId, toLocation, position) {
    if (!this.hasBoatPart(partId)) {
      console.warn('[BoatPartsInventory] Cannot move part not in inventory:', partId)
      return false
    }

    this.removeBoatPart(partId)
    return this.addBoatPart(toLocation, partId, position)
  }

  /**
   * Check if location is valid
   * @param {string} location - Location name
   * @returns {boolean}
   */
  isValidLocation (location) {
    return this.locations.hasOwnProperty(location)
  }

  /**
   * Get available shelf (not full)
   * Original Lingo: getRandomShelf() returns #AllFull if all shelves full
   * @returns {string|null} Shelf name or null if all full
   */
  getAvailableShelf () {
    const maxPartsPerShelf = 10 // Configurable limit

    for (let i = 1; i <= 4; i++) {
      const shelf = 'Shelf' + i
      const parts = this.getPartsAtLocation(shelf)
      
      if (parts.length < maxPartsPerShelf) {
        return shelf
      }
    }

    return null // All shelves full (#AllFull)
  }

  /**
   * Clear all parts from a location
   * @param {string} location - Storage location
   */
  clearLocation (location) {
    if (!this.isValidLocation(location)) {
      console.warn('[BoatPartsInventory] Invalid location:', location)
      return
    }

    this.locations[location] = {}
    console.debug('[BoatPartsInventory] Cleared location:', location)
  }

  /**
   * Clear all inventory
   */
  clearAll () {
    for (const location in this.locations) {
      this.locations[location] = {}
    }
    console.log('[BoatPartsInventory] Cleared all inventory')
  }

  /**
   * Get total part count
   * @returns {number}
   */
  getTotalPartCount () {
    let count = 0
    for (const location in this.locations) {
      count += Object.keys(this.locations[location]).length
    }
    return count
  }

  /**
   * Get total part count at location
   * @param {string} location - Storage location
   * @returns {number}
   */
  getLocationPartCount (location) {
    if (!this.isValidLocation(location)) return 0
    return Object.keys(this.locations[location]).length
  }

  /**
   * Serialize to JSON for saving
   * @returns {Object}
   */
  toJSON () {
    return {
      locations: this.locations
    }
  }

  /**
   * Restore from saved data
   * @param {Object} data - Saved inventory data
   */
  fromJSON (data) {
    if (!data || !data.locations) {
      console.warn('[BoatPartsInventory] Invalid save data')
      return
    }

    this.locations = data.locations

    console.log('[BoatPartsInventory] Restored from save:', this.getTotalPartCount(), 'parts')
  }
}

export default BoatPartsInventory
