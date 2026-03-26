/**
 * BoatPartsDB - Boat Parts Database Accessor
 * 
 * BUG FIX #2 (ADDITIONAL_BUGS_ROUND2.md - Part/Inventory Management)
 * 
 * Original Lingo: Parts accessed via global gMulleGlobals.parts
 * JavaScript needs: Proper class with validation and type safety
 * 
 * Provides:
 * - getPart(partId) - Get part data by ID
 * - getProperty(partId, propName) - Get specific property
 * - validatePart(partId) - Validate part exists and has required fields
 * - getPartsByProperty(propName, value) - Find parts matching criteria
 * 
 * @module struct/boatpartsdb
 */

/**
 * Boat Parts Database
 * Wrapper around boat_parts.hash.json with validation and helper methods
 */
class BoatPartsDB {
  /**
   * @param {Phaser.Game} game - Game instance
   * @param {Object} partsData - Raw parts data from boat_parts.hash.json
   */
  constructor (game, partsData) {
    this.game = game
    this.parts = partsData || {}
    
    // Cache frequently accessed parts
    this.hullParts = []
    this.rudderParts = []
    
    // Build lookup caches
    this.buildCaches()
    
    console.log('[BoatPartsDB] Initialized with', Object.keys(this.parts).length, 'parts')
  }

  /**
   * Build lookup caches for performance
   */
  buildCaches () {
    for (const partId in this.parts) {
      const part = this.parts[partId]
      if (!part || !part.Properties) continue
      
      // Cache hulls (parts with ship size properties)
      if (part.Properties.largeship || part.Properties.mediumship || part.Properties.smallship) {
        this.hullParts.push(parseInt(partId))
      }
      
      // Cache rudders (parts with rudder property)
      if (part.Properties.rudder) {
        this.rudderParts.push(parseInt(partId))
      }
    }
    
    console.debug('[BoatPartsDB] Cached', this.hullParts.length, 'hulls,', this.rudderParts.length, 'rudders')
  }

  /**
   * Get part data by ID
   * @param {number|string} partId - Part ID
   * @returns {Object|null} Part data or null if not found
   */
  getPart (partId) {
    const id = String(partId)
    const part = this.parts[id]
    
    if (!part) {
      console.warn('[BoatPartsDB] Part not found:', partId)
      return null
    }
    
    return part
  }

  /**
   * Get specific property from part
   * @param {number|string} partId - Part ID
   * @param {string} propName - Property name
   * @param {*} defaultValue - Default value if property not found
   * @returns {*} Property value or default
   */
  getProperty (partId, propName, defaultValue = null) {
    const part = this.getPart(partId)
    if (!part) return defaultValue
    
    // Check direct properties
    if (part[propName] !== undefined) {
      return part[propName]
    }
    
    // Check Properties object
    if (part.Properties && part.Properties[propName.toLowerCase()] !== undefined) {
      return part.Properties[propName.toLowerCase()]
    }
    
    return defaultValue
  }

  /**
   * Validate part exists and has required fields
   * @param {number|string} partId - Part ID
   * @returns {boolean} True if part is valid
   */
  validatePart (partId) {
    const part = this.getPart(partId)
    if (!part) return false
    
    // Check required fields
    if (!part.PartID && part.PartID !== 0) {
      console.warn('[BoatPartsDB] Part missing PartID:', partId)
      return false
    }
    
    // Properties can be empty object, that's ok
    if (!part.Properties) {
      console.warn('[BoatPartsDB] Part missing Properties:', partId)
      return false
    }
    
    return true
  }

  /**
   * Get all parts matching a property value
   * @param {string} propName - Property name
   * @param {*} value - Value to match (optional, if omitted returns all with property > 0)
   * @returns {Array<number>} Array of part IDs
   */
  getPartsByProperty (propName, value = null) {
    const results = []
    
    for (const partId in this.parts) {
      const part = this.parts[partId]
      if (!part || !part.Properties) continue
      
      const propValue = part.Properties[propName.toLowerCase()]
      
      if (value !== null) {
        // Exact match
        if (propValue === value) {
          results.push(parseInt(partId))
        }
      } else {
        // Any non-zero/truthy value
        if (propValue) {
          results.push(parseInt(partId))
        }
      }
    }
    
    return results
  }

  /**
   * Get all hull parts (parts that define ship size)
   * @returns {Array<number>} Array of hull part IDs
   */
  getHulls () {
    return this.hullParts
  }

  /**
   * Get all rudder parts
   * @returns {Array<number>} Array of rudder part IDs
   */
  getRudders () {
    return this.rudderParts
  }

  /**
   * Check if part is a hull
   * @param {number|string} partId - Part ID
   * @returns {boolean}
   */
  isHull (partId) {
    return this.hullParts.includes(parseInt(partId))
  }

  /**
   * Check if part is a rudder
   * @param {number|string} partId - Part ID
   * @returns {boolean}
   */
  isRudder (partId) {
    return this.rudderParts.includes(parseInt(partId))
  }

  /**
   * Get covered points for a part
   * Original Lingo: getCoveredPoints(part)
   * @param {number|string} partId - Part ID
   * @returns {Array} Array of snap point IDs this part covers
   */
  getCoveredPoints (partId) {
    const part = this.getPart(partId)
    if (!part) return []
    
    const covers = part.Covers || part.covers || 0
    if (covers === 0 || !covers) return []
    
    return Array.isArray(covers) ? covers : [covers]
  }

  /**
   * Get new points for a part
   * Original Lingo: getNewPoints(part)
   * @param {number|string} partId - Part ID
   * @returns {Array} Array of new snap points this part provides
   */
  getNewPoints (partId) {
    const part = this.getPart(partId)
    if (!part) return []
    
    const newPoints = part.new || part.New || 0
    if (newPoints === 0 || !newPoints) return []
    
    return Array.isArray(newPoints) ? newPoints : []
  }

  /**
   * Get required snap points for a part
   * Original Lingo: getRequiredPoints(part)
   * @param {number|string} partId - Part ID
   * @returns {Array} Array of snap point IDs required for attachment
   */
  getRequiredPoints (partId) {
    const part = this.getPart(partId)
    if (!part) return []
    
    const requires = part.Requires || part.requires || 0
    if (requires === 0 || !requires) return []
    
    return Array.isArray(requires) ? requires : [requires]
  }

  /**
   * Get master part ID (for variant parts)
   * Original Lingo: getMaster(part)
   * @param {number|string} partId - Part ID
   * @returns {number|null} Master part ID or null
   */
  getMaster (partId) {
    const part = this.getPart(partId)
    if (!part) return null
    
    const master = part.Master || part.master || 0
    return master > 0 ? master : null
  }

  /**
   * Get morph list for a part
   * Original Lingo: getMorphList(part)
   * @param {number|string} partId - Part ID
   * @returns {Array} Array of morph variant IDs
   */
  getMorphList (partId) {
    const part = this.getPart(partId)
    if (!part) return []
    
    const morphs = part.MorphsTo || part.morphsTo || 0
    if (morphs === 0 || !morphs) return []
    
    return Array.isArray(morphs) ? morphs : [morphs]
  }

  /**
   * Check if a part ID is a boat part (ID >= 280)
   * Auto/car parts have IDs 1-279, boat parts start at 280
   * @param {number|string} partId - Part ID
   * @returns {boolean}
   */
  isBoatPart (partId) {
    return parseInt(partId) >= 280
  }

  /**
   * Get all part IDs
   * @returns {Array<number>} Array of all part IDs
   */
  getAllPartIds () {
    return Object.keys(this.parts).map(id => parseInt(id))
  }

  /**
   * Get total number of parts
   * @returns {number}
   */
  getCount () {
    return Object.keys(this.parts).length
  }
}

export default BoatPartsDB
