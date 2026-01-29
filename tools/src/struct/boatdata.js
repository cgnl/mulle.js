/**
 * BoatData - Boat data structure for boat building
 * 
 * Equivalent of MulleCar (cardata.js) but for boats
 * Manages boat parts, properties, and sea-worthiness checks
 * 
 * @module struct/boatdata
 */

/**
 * @property {array} Parts Parts currently on the boat
 */
class MulleBoat {
  constructor (game, data) {
    this.game = game

    this.properties = {}
    this.quickProperties = {}
    this.criteria = {}

    if (data) {
      this.Parts = data.Parts
      this.Name = data.Name
      this.Medals = data.Medals
      this.CacheList = data.CacheList
    } else {
      // Default boat: small boat hull (part 730 from boat_parts.hash.json)
      this.Parts = [730]
      this.Name = ''
      this.Medals = []
      this.CacheList = []
    }
  }

  getParts () {
    var l = []

    this.Parts.forEach((v) => {
      // Use boat parts database (BoatPartsDB)
      const part = this.game.mulle.getBoatPart ? this.game.mulle.getBoatPart(v) : null
      if (part) {
        l.push(part)
      }
    })

    return l
  }

  hasPart (partId) {
    return this.Parts.indexOf(parseInt(partId)) !== -1
  }

  hasMedal (id) {
    return this.Medals.includes(id)
  }

  addMedal (id) {
    if (!this.hasMedal(id)) {
      this.Medals.push(id)
      console.log(`[BoatData] Added medal ${id}`)
    }
  }

  hasCache (name) {
    return this.CacheList.indexOf(name) !== -1
  }

  addCache (name) {
    if (this.hasCache(name)) return false
    console.debug('[boat-cache]', 'add', name)
    this.CacheList.push(name)
    return true
  }

  removeCache (name) {
    var i = this.CacheList.indexOf(name)
    if (i === -1) return false
    console.debug('[boat-cache]', 'remove', name)
    this.CacheList.splice(i, 1)
    return true
  }

  resetCache () {
    this.CacheList = []
  }

  set Parts (val) {
    this._Parts = val
    console.debug('[boat-parts]', 'set', val)
    this.updateStats()
  }

  get Parts () {
    return this._Parts
  }

  getProperty (name, defVal = null) {
    return this.properties[name.toLowerCase()] !== undefined 
      ? this.properties[name.toLowerCase()] 
      : defVal
  }

  getQuickProperty (name, defVal = null) {
    return this.quickProperties[name.toLowerCase()] !== undefined 
      ? this.quickProperties[name.toLowerCase()] 
      : defVal
  }

  /**
   * Update boat statistics based on parts
   * Boat-specific attributes differ from cars
   */
  updateStats () {
    var lst = this.getParts()

    // Boat-specific attributes (from boten CDDATA.CXT Part structure)
    // Based on original Lingo XPropInfo: Depth, Steerpart, Rudder, Weight, Resist, Power, Manoeuv, Drift, Dura, Stab, Stabz, Fun
    var attributes = [
      // Physical properties
      'weight',
      'depth',           // Draft/diepgang (original: Depth: 17)
      'durability',      // Original: Dura: 5950
      'loadcapacity',
      
      // Stability - original had Stab: [85, 55], Stabz: 30 (lateral, longitudinal, z-axis)
      'stability',       // Combined stability value
      'stabilitylateral',  // Side-to-side stability (original Stab[0])
      'stabilitylongitudinal', // Front-to-back stability (original Stab[1])
      'stabilityz',      // Z-axis/vertical stability (original Stabz)
      
      // Resistance/Performance (from original: Resist: 8, Power: 250, Manoeuv: 38, Drift: 15)
      'waterresistance', // Original: Resist
      'maxwaterresistance',
      'power',           // Motor power (original: Power: 250)
      'maxdepth',
      'manoeuverability', // Original: Manoeuv: 38
      'drift',           // Original: Drift: 15
      
      // Features (boolean-like)
      'bench',           // Zitplaats
      'engine',          // Motor
      'rudder',          // Roer
      'sailwithpole',    // Zeil met mast
      'steerpart',       // Stuuronderdeel
      'outboardengine',  // Buitenboordmotor
      'watertank',       // Watertank
      'oar',             // Roeispaan
      'doghouse',        // Kajuit/roef
      'compass',         // Kompas
      
      // Ship size category
      'largeship',
      'mediumship',
      'smallship',
      'notonlarge',
      'notonmedium',
      'notonsmall',
      
      // Material type
      'material',
      
      // Fun/luxury
      'luxuryfactor',
      'funnyfactor'
    ]

    this.properties = {}
    this.quickProperties = {}

    attributes.forEach((a) => {
      this.properties[a] = 0
      this.quickProperties[a] = 0
    })

    // Sum up properties from all parts
    lst.forEach((part) => {
      if (!part || !part.getProperty) return

      // Additive properties
      this.properties.weight += part.getProperty('weight', 0)
      this.properties.loadcapacity += part.getProperty('loadcapacity', 0)
      this.properties.waterresistance += part.getProperty('waterresistance', 0)
      this.properties.luxuryfactor += part.getProperty('luxuryfactor', 0)
      this.properties.funnyfactor += part.getProperty('funnyfactor', 0)
      this.properties.drift += part.getProperty('drift', 0)
      this.properties.power += part.getProperty('power', 0)

      // Stability - handle both single value and dual value systems
      // Original Lingo had Stab: [lateral, longitudinal], Stabz: z
      const partStability = part.getProperty('stability', 0)
      const partStabLateral = part.getProperty('stabilitylateral', partStability)
      const partStabLongitudinal = part.getProperty('stabilitylongitudinal', partStability)
      const partStabZ = part.getProperty('stabilityz', 0)

      this.properties.stabilitylateral += partStabLateral
      this.properties.stabilitylongitudinal += partStabLongitudinal
      this.properties.stabilityz += partStabZ
      // Combined stability for backwards compatibility
      this.properties.stability += partStability || ((partStabLateral + partStabLongitudinal) / 2)

      // Max properties (take highest value)
      this.properties.durability = Math.max(part.getProperty('durability', 0), this.properties.durability)
      this.properties.depth = Math.max(part.getProperty('depth', 0), this.properties.depth)
      this.properties.maxdepth = Math.max(part.getProperty('maxdepth', 0), this.properties.maxdepth)
      this.properties.maxwaterresistance = Math.max(part.getProperty('maxwaterresistance', 0), this.properties.maxwaterresistance)
      this.properties.manoeuverability = Math.max(part.getProperty('manoeuverability', 0), this.properties.manoeuverability)

      // Boolean/feature flags
      if (part.getProperty('engine', 0)) this.properties.engine = 1
      if (part.getProperty('rudder', 0)) this.properties.rudder = 1
      if (part.getProperty('sailwithpole', 0)) this.properties.sailwithpole = 1
      if (part.getProperty('steerpart', 0)) this.properties.steerpart = 1
      if (part.getProperty('outboardengine', 0)) this.properties.outboardengine = 1
      if (part.getProperty('oar', 0)) this.properties.oar = 1
      if (part.getProperty('bench', 0)) this.properties.bench = 1
      if (part.getProperty('watertank', 0)) this.properties.watertank = 1
      if (part.getProperty('doghouse', 0)) this.properties.doghouse = 1
      if (part.getProperty('compass', 0)) this.properties.compass = 1

      // Ship size
      if (part.getProperty('largeship', 0)) this.properties.largeship = 1
      if (part.getProperty('mediumship', 0)) this.properties.mediumship = 1
      if (part.getProperty('smallship', 0)) this.properties.smallship = 1

      // Material (take highest)
      this.properties.material = Math.max(part.getProperty('material', 0), this.properties.material)
    })

    // Calculate quick properties for gameplay
    this.quickProperties.speed = this.properties.engine > 0 ? 5 : (this.properties.sailwithpole > 0 ? 3 : (this.properties.oar > 0 ? 1 : 0))
    this.quickProperties.maneuverability = this.properties.manoeuverability / 10
    this.quickProperties.capacity = this.properties.loadcapacity

    // Evaluate criteria for sea-worthiness
    this.criteria = {
      HasPropulsion: false,   // Can move (engine, sail, or oars)
      HasSteering: false,     // Can steer (rudder or steerpart)
      IsSeaworthy: false,     // Overall seaworthy
      CanCarryPassengers: false,  // Has seating
      HasNavigation: false    // Has compass
    }

    this.criteria.HasPropulsion = this.properties.engine > 0 || this.properties.sailwithpole > 0 || this.properties.oar > 0 || this.properties.outboardengine > 0
    this.criteria.HasSteering = this.properties.rudder > 0 || this.properties.steerpart > 0
    this.criteria.CanCarryPassengers = this.properties.bench > 0
    this.criteria.HasNavigation = this.properties.compass > 0
    this.criteria.IsSeaworthy = this.criteria.HasPropulsion && this.criteria.HasSteering

    console.debug('[boat-props]', 'updated', this.properties)
    console.debug('[boat-criteria]', 'updated', this.criteria)
  }

  /**
   * Seaworthiness check results with specific dialogue audio IDs
   * Each check returns { passed: boolean, dialogueId: string, message: string }
   */
  static SEAWORTHINESS_CHECKS = {
    HULL: {
      dialogueId: '04d009v0',  // "Je hebt een romp nodig!"
      message: 'Je boot heeft een romp nodig!'
    },
    HULL_SIZE_MISMATCH: {
      dialogueId: '04d010v0',  // "Deze onderdelen passen niet op deze romp"
      message: 'Sommige onderdelen passen niet op deze romp!'
    },
    PROPULSION: {
      dialogueId: '04d007v0',  // "Je boot heeft aandrijving nodig"
      message: 'Je boot heeft aandrijving nodig! Voeg een motor, zeil of roeispanen toe.'
    },
    STEERING: {
      dialogueId: '04d008v0',  // "Je boot heeft een roer nodig"
      message: 'Je boot heeft een roer nodig om te kunnen sturen!'
    },
    STABILITY: {
      dialogueId: '04d011v0',  // "Je boot is niet stabiel genoeg"
      message: 'Je boot is niet stabiel genoeg! Voeg meer gewicht of een kiel toe.'
    },
    SEATING: {
      dialogueId: '04d012v0',  // "Je hebt een zitplaats nodig"
      message: 'Je hebt een zitplaats nodig om te kunnen varen!'
    },
    NAVIGATION: {
      dialogueId: '04d013v0',  // "Een grote boot heeft een kompas nodig"
      message: 'Een grote boot heeft een kompas nodig voor navigatie!'
    }
  }

  /**
   * Minimum stability values required per ship size
   */
  static STABILITY_REQUIREMENTS = {
    small: 5,
    medium: 15,
    large: 25
  }

  /**
   * Check if boat is seaworthy (equivalent to isRoadLegal for cars)
   * @param {boolean} talk - Play dialogue explaining what's missing
   * @returns {boolean}
   */
  isSeaworthy (talk = false) {
    const result = this.getSeaworthinessResult()
    
    if (!result.passed && talk) {
      console.log('[Boat]', result.message)
    }
    
    return result.passed
  }

  /**
   * Get detailed seaworthiness check result
   * Returns the first failing check or a success result
   * @returns {{ passed: boolean, check: string|null, dialogueId: string|null, message: string }}
   */
  getSeaworthinessResult () {
    const checks = MulleBoat.SEAWORTHINESS_CHECKS

    // 1. Must have a hull (at least one part with ship size property)
    if (!this.hasHull()) {
      return {
        passed: false,
        check: 'HULL',
        dialogueId: checks.HULL.dialogueId,
        message: checks.HULL.message
      }
    }

    // 2. Check hull/part size compatibility
    if (!this.checkHullSizeCompatibility()) {
      return {
        passed: false,
        check: 'HULL_SIZE_MISMATCH',
        dialogueId: checks.HULL_SIZE_MISMATCH.dialogueId,
        message: checks.HULL_SIZE_MISMATCH.message
      }
    }

    // 3. Check for minimum stability based on ship size
    if (!this.hasMinimumStability()) {
      return {
        passed: false,
        check: 'STABILITY',
        dialogueId: checks.STABILITY.dialogueId,
        message: checks.STABILITY.message
      }
    }

    // 4. Must have propulsion (engine, sail, or oars)
    if (!this.criteria.HasPropulsion) {
      return {
        passed: false,
        check: 'PROPULSION',
        dialogueId: checks.PROPULSION.dialogueId,
        message: checks.PROPULSION.message
      }
    }

    // 5. Must have steering
    if (!this.criteria.HasSteering) {
      return {
        passed: false,
        check: 'STEERING',
        dialogueId: checks.STEERING.dialogueId,
        message: checks.STEERING.message
      }
    }

    // 6. Must have seating/bench
    if (!this.criteria.CanCarryPassengers) {
      return {
        passed: false,
        check: 'SEATING',
        dialogueId: checks.SEATING.dialogueId,
        message: checks.SEATING.message
      }
    }

    // 7. Large and medium boats require navigation equipment (compass)
    const shipSize = this.getShipSize()
    if ((shipSize === 'large' || shipSize === 'medium') && !this.criteria.HasNavigation) {
      return {
        passed: false,
        check: 'NAVIGATION',
        dialogueId: checks.NAVIGATION.dialogueId,
        message: checks.NAVIGATION.message
      }
    }

    // All checks passed
    return {
      passed: true,
      check: null,
      dialogueId: null,
      message: 'Zeewaardig!'
    }
  }

  /**
   * Check if boat has a proper hull
   * A hull is a part that defines the ship size (small/medium/large)
   * @returns {boolean}
   */
  hasHull () {
    if (this.Parts.length === 0) return false
    
    // Check if any part defines a ship size (indicating it's a hull)
    return this.properties.largeship > 0 || 
           this.properties.mediumship > 0 || 
           this.properties.smallship > 0
  }

  /**
   * Check if all parts are compatible with the hull size
   * Parts with notonlarge/notonmedium/notonsmall flags should not be on incompatible hulls
   * @returns {boolean}
   */
  checkHullSizeCompatibility () {
    const shipSize = this.getShipSize()
    if (shipSize === 'unknown') return true // No hull to check against
    
    const parts = this.getParts()
    
    for (const part of parts) {
      if (!part || !part.getProperty) continue
      
      // Check if part is not allowed on this size of ship
      if (shipSize === 'large' && part.getProperty('notonlarge', 0) > 0) {
        return false
      }
      if (shipSize === 'medium' && part.getProperty('notonmedium', 0) > 0) {
        return false
      }
      if (shipSize === 'small' && part.getProperty('notonsmall', 0) > 0) {
        return false
      }
    }
    
    return true
  }

  /**
   * Check if boat has minimum stability for its size
   * @returns {boolean}
   */
  hasMinimumStability () {
    const shipSize = this.getShipSize()
    const requirements = MulleBoat.STABILITY_REQUIREMENTS
    
    // Get minimum stability required for this ship size
    const minStability = requirements[shipSize] || requirements.small
    
    // Check if boat meets minimum stability
    return this.properties.stability >= minStability
  }

  /**
   * Get all failing seaworthiness checks
   * Useful for displaying multiple issues at once
   * @returns {Array<{ check: string, dialogueId: string, message: string }>}
   */
  getAllSeaworthinessIssues () {
    const issues = []
    const checks = MulleBoat.SEAWORTHINESS_CHECKS

    if (!this.hasHull()) {
      issues.push({ check: 'HULL', ...checks.HULL })
    }

    if (!this.checkHullSizeCompatibility()) {
      issues.push({ check: 'HULL_SIZE_MISMATCH', ...checks.HULL_SIZE_MISMATCH })
    }

    if (!this.hasMinimumStability()) {
      issues.push({ check: 'STABILITY', ...checks.STABILITY })
    }

    if (!this.criteria.HasPropulsion) {
      issues.push({ check: 'PROPULSION', ...checks.PROPULSION })
    }

    if (!this.criteria.HasSteering) {
      issues.push({ check: 'STEERING', ...checks.STEERING })
    }

    if (!this.criteria.CanCarryPassengers) {
      issues.push({ check: 'SEATING', ...checks.SEATING })
    }

    const shipSize = this.getShipSize()
    if ((shipSize === 'large' || shipSize === 'medium') && !this.criteria.HasNavigation) {
      issues.push({ check: 'NAVIGATION', ...checks.NAVIGATION })
    }

    return issues
  }

  /**
   * Get ship size category
   * @returns {string} 'large', 'medium', 'small', or 'unknown'
   */
  getShipSize () {
    if (this.properties.largeship > 0) return 'large'
    if (this.properties.mediumship > 0) return 'medium'
    if (this.properties.smallship > 0) return 'small'
    return 'unknown'
  }

  /**
   * Get material type name
   * @returns {string}
   */
  getMaterialName () {
    const materials = {
      0: 'Onbekend',
      1: 'Hout',
      2: 'Metaal',
      3: 'Plastic',
      4: 'Glasvezel'
    }
    return materials[this.properties.material] || 'Onbekend'
  }

  /**
   * Get stability values in original Lingo format
   * Original: Stab: [85, 55], Stabz: 30
   * @returns {{ lateral: number, longitudinal: number, z: number, combined: number }}
   */
  getStabilityValues () {
    return {
      lateral: this.properties.stabilitylateral || this.properties.stability || 0,
      longitudinal: this.properties.stabilitylongitudinal || this.properties.stability || 0,
      z: this.properties.stabilityz || 0,
      combined: this.properties.stability || 0
    }
  }

  /**
   * Get power value (motor strength)
   * Original: Power: 250
   * @returns {number}
   */
  getPower () {
    return this.properties.power || 0
  }

  /**
   * Get water resistance value
   * Original: Resist: 8
   * @returns {number}
   */
  getResistance () {
    return this.properties.waterresistance || 0
  }

  /**
   * Calculate effective speed based on power and resistance
   * Higher power and lower resistance = faster boat
   * @returns {number} Speed factor (0-1)
   */
  getSpeedFactor () {
    const power = this.getPower()
    const resistance = this.getResistance()
    
    if (power <= 0) return 0
    
    // Speed = Power / (Weight + Resistance)
    // Normalized to 0-1 range
    const weight = this.properties.weight || 1
    const effectiveSpeed = power / (weight + resistance * 10)
    
    return Math.min(1, effectiveSpeed / 100) // Assuming max effective speed of 100
  }

  toJSON () {
    return {
      Parts: this.Parts,
      Name: this.Name,
      Medals: this.Medals,
      CacheList: this.CacheList
    }
  }
}

export default MulleBoat
