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
    
    // BUG FIX #27: Initialize snap point tracking
    this.boatSnapPoints = []
    this.boatSnapOffsets = {}

    if (data) {
      // BUG FIX #27: Use fromList to properly reconstruct boat with snap points
      // Don't just copy data - rebuild snap points from parts list
      this.fromList(data)
    } else {
      // Default boat: small boat hull (part 730 from boat_parts.hash.json)
      this.Parts = [730]
      this.Name = ''
      this.Medals = []
      this.CacheList = []
      this.fuelFull = false
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

  hasPartWithProperty (propertyName, value) {
    const partsDB = this.game && this.game.mulle ? this.game.mulle.BoatPartsDB || {} : {}
    for (var i = 0; i < this.Parts.length; i++) {
      var partId = this.Parts[i]
      var part = partsDB[partId]
      if (!part || !part.Properties) continue

      if (part.Properties[propertyName] === value) {
        return true
      }
    }
    return false
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
      'sailsize',        // Sail size for sail power calculation
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
      this.properties.depth = Math.max(part.getProperty('depth', 0), this.properties.depth)
      this.properties.maxdepth = Math.max(part.getProperty('maxdepth', 0), this.properties.maxdepth)
      this.properties.maxwaterresistance = Math.max(part.getProperty('maxwaterresistance', 0), this.properties.maxwaterresistance)

      // Sum properties (from RecalcBoatProps.ls - these are summed, not max'd)
      this.properties.durability += part.getProperty('durability', 0)
      this.properties.manoeuverability += part.getProperty('manoeuverability', 0)

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
   * 
   * ORIGINELE LINGO LOGICA (ParentScript 22 - Dir.ls, regel 136):
   * De ENIGE vereiste is aandrijving: engine OR SailWithPole OR Oar
   * Alle andere checks (roer, stabiliteit, zitplaats, kompas) zijn NIET in het origineel!
   */
  static SEAWORTHINESS_CHECKS = {
    PROPULSION: {
      dialogueId: '04d049v0',  // Origineel: "Je boot heeft aandrijving nodig" 
      message: 'Je boot heeft aandrijving nodig! Voeg een motor, zeil of roeispanen toe.'
    }
  }

  // VERWIJDERD: Stability requirements zijn NIET in originele Lingo code
  // De originele game checkt alleen op aandrijving (engine/sail/oar)

  /**
   * Check if boat is seaworthy (equivalent to isRoadLegal for cars)
   * 
   * ORIGINELE LINGO LOGICA (ParentScript 22 - Dir.ls, regel 136):
   * if getProperty(tmpBoat, #engine) or getProperty(tmpBoat, #SailWithPole) or getProperty(tmpBoat, #Oar) then
   * 
   * De ENIGE vereiste is aandrijving! Geen checks voor roer, zitplaats, stabiliteit, kompas etc.
   * 
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
   * 
   * ORIGINELE LINGO: Alleen propulsion check!
   * if getProperty(tmpBoat, #engine) or getProperty(tmpBoat, #SailWithPole) or getProperty(tmpBoat, #Oar) then
   * 
   * @returns {{ passed: boolean, check: string|null, dialogueId: string|null, message: string }}
   */
  getSeaworthinessResult () {
    const checks = MulleBoat.SEAWORTHINESS_CHECKS

    // ORIGINELE LINGO: Alleen check op aandrijving (engine OR sailwithpole OR oar)
    // Alle andere checks (roer, stabiliteit, zitplaats, kompas) zijn NIET in origineel!
    if (!this.criteria.HasPropulsion) {
      return {
        passed: false,
        check: 'PROPULSION',
        dialogueId: checks.PROPULSION.dialogueId,
        message: checks.PROPULSION.message
      }
    }

    // All checks passed - boot is zeewaardig
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
   * NOTE: Dit is een helper functie, NIET vereist voor zeewaardigheid in origineel!
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
   * Get all failing seaworthiness checks
   * ORIGINELE LINGO: Alleen propulsion check!
   * @returns {Array<{ check: string, dialogueId: string, message: string }>}
   */
  getAllSeaworthinessIssues () {
    const issues = []
    const checks = MulleBoat.SEAWORTHINESS_CHECKS

    // ORIGINELE LINGO: Alleen check op aandrijving
    if (!this.criteria.HasPropulsion) {
      issues.push({ check: 'PROPULSION', ...checks.PROPULSION })
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

  /**
   * Get hull part ID
   * @returns {number|null}
   */
  getHull () {
    const partsDB = this.game && this.game.mulle ? this.game.mulle.BoatPartsDB || {} : {}
    for (let i = 0; i < this.Parts.length; i++) {
      const partId = this.Parts[i]
      const part = partsDB[partId]
      if (!part || !part.Properties) continue

      // Hull is defined by having one of the ship size properties
      if (part.Properties.largeship || part.Properties.mediumship || part.Properties.smallship) {
        return partId
      }
    }
    return null
  }

  /**
   * Get hull weight
   * @returns {number}
   */
  getHullWeight () {
    const hullId = this.getHull()
    if (!hullId) return 0

    const partsDB = this.game && this.game.mulle ? this.game.mulle.BoatPartsDB || {} : {}
    const hull = partsDB[hullId]
    return (hull && hull.Properties && hull.Properties.weight) || 0
  }

  /**
   * Generate speed list lookup table (250 entries)
   * Based on RecalcBoatProps.ls lines 58-83
   * @returns {Array<number>}
   */
  generateSpeedList () {
    // Real speed lists extracted from Director member "SpeedLists" (boten_05.DXR/138.txt)
    // Same data as in RecalcBoatProps.js BASE_SPEED_LISTS
    // Returns raw 250-entry list; resistance scaling happens in recalculateProperties()
    const SPEED_LISTS = {
      Small: [
        1, 2, 4, 5, 6, 13, 16, 17, 17, 17, 19, 22, 25, 26, 27, 27, 28, 28, 29, 30, 30, 30, 31, 31, 32,
        32, 32, 32, 32, 33, 33, 33, 33, 33, 34, 34, 34, 34, 34, 35, 35, 35, 35, 35, 36, 36, 36, 36, 36, 37,
        37, 37, 37, 37, 37, 37, 37, 37, 37, 38, 38, 38, 38, 38, 38, 38, 38, 38, 38, 39, 39, 39, 39, 39, 39,
        39, 39, 39, 39, 40, 40, 40, 40, 40, 40, 40, 40, 40, 40, 41, 41, 41, 41, 41, 41, 41, 41, 41, 41, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42,
        42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 42, 43,
        43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43,
        43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 43, 44,
        44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44,
        44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 44, 45
      ],
      Medium: [
        1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 11, 13, 16, 16, 17, 18, 19, 20, 20, 20, 21, 21, 22,
        22, 22, 23, 23, 24, 24, 24, 25, 25, 26, 26, 26, 27, 27, 28, 28, 28, 29, 29, 30, 30, 30, 31, 31, 32,
        32, 32, 33, 33, 34, 34, 34, 35, 35, 36, 36, 36, 37, 37, 38, 38, 38, 39, 39, 40, 40, 41, 41, 42, 42,
        43, 43, 44, 44, 45, 45, 45, 45, 45, 45, 45, 45, 45, 45, 46, 46, 46, 46, 46, 46, 46, 46, 46, 46, 47,
        47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47,
        47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 47, 48,
        48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48,
        48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 48, 49,
        49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49,
        49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 49, 50
      ],
      Large: [
        1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 3, 4, 5, 6, 7, 7, 8, 8, 9, 10, 10, 10, 11, 11, 12,
        12, 12, 13, 13, 14, 14, 14, 15, 15, 16, 16, 16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17,
        17, 17, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18, 18,
        18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20,
        20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20
      ]
    }

    const shipSize = this.getShipSize()
    if (shipSize === 'small' || this.properties.smallship > 0) {
      return [...SPEED_LISTS.Small]
    } else if (shipSize === 'large' || this.properties.largeship > 0) {
      return [...SPEED_LISTS.Large]
    }
    return [...SPEED_LISTS.Medium]
  }

  /**
   * Recalculate all boat properties based on propulsion type
   * Implements all formulas from RecalcBoatProps.ls
   * 
   * This method implements items #52-69 from missing.md:
   * - Load percentage calculation
   * - RealDepth calculation
   * - RealResistance calculation
   * - Sail power calculation
   * - Retardation formula
   * - Acceleration formula
   * - Stability array calculation
   * - Durability multiplier
   * - Manoeuverability multiplier
   * - SpeedList generation and resistance scaling
   * 
   * @param {string} propulsionType - 'Motor', 'Sail', or 'Oar'
   * @returns {Object} Calculated properties object with all boat stats
   */
  recalculateBoatProps (propulsionType = 'Motor') {
    const decimalPrec = 100  // Fixed-point precision (RecalcBoatProps.ls line 4)

    // Get hull weight (RecalcBoatProps.ls lines 5-14)
    const hullWeight = this.getHullWeight()
    let weight = this.properties.weight || 0
    
    // Ensure weight is at least hull weight + 50
    if (weight <= hullWeight) {
      weight = hullWeight + 50
    }

    // #52: Calculate load percentage (RecalcBoatProps.ls line 15)
    const loadCapacity = this.properties.loadcapacity || 1
    const loadPercent = 100 * (weight - hullWeight) / loadCapacity

    // #53: Calculate RealDepth (RecalcBoatProps.ls lines 16-18)
    const minDepth = this.properties.depth || 0
    const maxDepth = this.properties.maxdepth || minDepth
    const realDepth = minDepth + (loadPercent * (maxDepth - minDepth) / 100)

    // #54: Calculate RealResistance (RecalcBoatProps.ls lines 19-21)
    const minResistance = this.properties.waterresistance || 0
    const maxResistance = this.properties.maxwaterresistance || minResistance
    const realResistance = minResistance + (loadPercent * (maxResistance - minResistance) / 100)

    // #55: Calculate sail power if sail mode (RecalcBoatProps.ls lines 22-25)
    let power = this.properties.power || 0
    if (propulsionType === 'Sail') {
      const sailSize = this.properties.sailsize || 0
      power = sailSize * 60 / 100
    }

    // #56: Calculate retardation (RecalcBoatProps.ls line 27)
    const retardation = decimalPrec * 200 / (400 + (2 * weight))

    // #57: Calculate acceleration (RecalcBoatProps.ls lines 28-36)
    let acceleration = (power + 50) * decimalPrec * 20 / (400 + (2 * weight)) / 11
    // Clamp to 30-100 range
    if (acceleration > 100) {
      acceleration = 100
    } else if (acceleration < 30) {
      acceleration = 30
    }

    // #58: Calculate stability array (RecalcBoatProps.ls lines 37-43)
    const tmpStab = 100 - ((weight - 18) / 20)
    const rawStability = this.properties.stability || 0
    let sideStab = tmpStab - rawStability
    // Clamp second value to 0 minimum
    if (sideStab < 0) {
      sideStab = 0
    }
    const stabilities = [tmpStab, sideStab]

    // #59: Durability multiplier (RecalcBoatProps.ls line 44)
    const durability = (this.properties.durability || 0) * 1000

    // #60: Manoeuverability multiplier (RecalcBoatProps.ls line 45)
    const manoeuverability = (this.properties.manoeuverability || 0) * 2

    // #61: Generate SpeedList (RecalcBoatProps.ls lines 58-83)
    let speedList = this.generateSpeedList()

    // #62: Scale SpeedList by resistance (RecalcBoatProps.ls line 84)
    speedList = speedList.map(speed => (100 - realResistance) * speed / 10)

    // #63: Corner points / hitbox (RecalcBoatProps.ls lines 60-69, 89-133)
    let cornerPoints = []
    if (this.properties.smallship > 0) {
      cornerPoints = [{ x: 0, y: -10 }, { x: -4, y: 10 }, { x: 4, y: 10 }]
    } else if (this.properties.largeship > 0) {
      cornerPoints = [{ x: 0, y: -20 }, { x: -5, y: 20 }, { x: 5, y: 20 }]
    } else {
      // Medium ship (default)
      cornerPoints = [{ x: 0, y: -15 }, { x: -5, y: 15 }, { x: 5, y: 15 }]
    }

    // Calculate rotated corner points for 16 directions
    const cornerPointsList = this.calcCornersList(cornerPoints)

    // Return all calculated properties
    return {
      // Original properties
      weight,
      hullWeight,
      power,
      
      // Calculated properties
      loadPercent,
      realDepth,
      realResistance,
      retardation,
      acceleration,
      stabilities,
      durability,
      manoeuverability,
      speedList,
      cornerPoints,
      cornerPointsList,
      
      // Additional properties for reference
      minDepth,
      maxDepth,
      minResistance,
      maxResistance,
      loadCapacity,
      
      // Metadata
      propulsionType,
      shipSize: this.getShipSize()
    }
  }

  /**
   * Calculate rotated corner points for all 16 directions
   * Based on calcCornersList from RecalcBoatProps.ls lines 89-134
   * 
   * @param {Array<{x: number, y: number}>} pointList - Base corner points
   * @returns {Array<Array<{x: number, y: number}>>} 16 rotated corner point sets
   */
  calcCornersList (pointList) {
    const corners = []
    const hypos = []
    const orgAngles = []

    // Calculate hypotenuse and angles for each point
    pointList.forEach(point => {
      const tmpX = point.x
      const tmpY = point.y
      const hypo = Math.sqrt((tmpX * tmpX) + (tmpY * tmpY))
      hypos.push(hypo)

      let angle
      if (tmpY === 0) {
        angle = Math.abs(tmpX) / tmpX * Math.PI / 2
      } else {
        angle = Math.atan(tmpX / tmpY)
      }

      // Adjust angle based on quadrant
      if (tmpX > 0) {
        if (tmpY <= 0) {
          angle = angle + Math.PI
        }
      } else {
        if (tmpY > 0) {
          angle = angle + (2 * Math.PI)
        } else {
          angle = angle + Math.PI
        }
      }

      orgAngles.push(angle)
    })

    // Generate 16 rotated versions
    const tmpDirs = 16
    for (let n = 1; n <= tmpDirs; n++) {
      const tmpList = []
      const addAngle = 2 * Math.PI * n / tmpDirs

      for (let m = 0; m < pointList.length; m++) {
        const angle = orgAngles[m] + addAngle
        const hypo = hypos[m]
        const newPoint = {
          x: -hypo * Math.sin(angle),
          y: hypo * Math.cos(angle)
        }
        tmpList.push(newPoint)
      }

      corners.push(tmpList)
    }

    return corners
  }

  /**
   * Get current load capacity (remaining capacity after current weight)
   * Based on getCurrentLoadCapacity from Boat.ls lines 204-228
   * 
   * @returns {number} Remaining load capacity
   */
  getCurrentLoadCapacity () {
    const hullWeight = this.getHullWeight()
    if (hullWeight === 0) return 0

    const boatWeight = this.properties.weight || 0
    const loadCapacity = this.properties.loadcapacity || 0

    return loadCapacity - (boatWeight - hullWeight)
  }

  /**
   * Serialize boat to JSON for saving
   * NOTE: Does NOT save boatSnapPoints/boatSnapOffsets
   * These are rebuilt from Parts list on load via fromList()
   * 
   * @returns {Object} Serialized boat data
   */
  toJSON () {
    return {
      Parts: this.Parts,
      Name: this.Name,
      Medals: this.Medals,
      CacheList: this.CacheList,
      fuelFull: this.fuelFull || false
    }
  }

  /**
   * BUG FIX #6: Validate that all snap points in list are available
   * Original Lingo: Boat.ls areTheseFree(me, theList) - lines 24-34
   * 
   * Checks if all required snap points are currently available (not used/covered)
   * 
   * @param {Array} pointsList - Array of snap point IDs to check
   * @returns {boolean} True if ALL points are available
   */
  areTheseFree (pointsList) {
    if (!pointsList || pointsList.length === 0) {
      return false
    }
    
    // Check each point is in boatSnapPoints (available)
    for (let i = 0; i < pointsList.length; i++) {
      const point = pointsList[i]
      if (this.boatSnapPoints.indexOf(point) === -1) {
        return false
      }
    }
    
    return true
  }

  /**
   * BUG FIX #4: Add part and rebuild snap points
   * Original Lingo: Boat.ls addPart(me, newPartId) - lines 146-173
   * 
   * CRITICAL for save/load to work! This method:
   * 1. Adds part to parts list
   * 2. Removes covered snap points
   * 3. Adds new snap points with offset calculation
   * 
   * @param {number} newPartId - Part ID to add
   */
  addPart (newPartId) {
    // Add to parts list
    this._Parts.push(newPartId)
    
    // Get part data from BoatPartsDB
    const partsDB = this.game.mulle.BoatPartsDB
    if (!partsDB) {
      console.error('[BoatData] BoatPartsDB not initialized')
      return
    }
    
    const part = partsDB.getPart(newPartId)
    if (!part) {
      console.warn('[BoatData] Part not found:', newPartId)
      return
    }
    
    // Remove covered snap points
    const coversPoints = partsDB.getCoveredPoints(newPartId)
    if (coversPoints && coversPoints.length > 0) {
      coversPoints.forEach(point => {
        const index = this.boatSnapPoints.indexOf(point)
        if (index !== -1) {
          this.boatSnapPoints.splice(index, 1)
        }
      })
    }
    
    // Add new snap points with offset calculation
    const newPoints = partsDB.getNewPoints(newPartId)
    if (newPoints && newPoints.length > 0) {
      // Get snap offset from first required point
      const reqSnaps = partsDB.getRequiredPoints(newPartId)
      let snapOffset = { x: 0, y: 0 }
      
      if (reqSnaps && reqSnaps.length > 0) {
        const firstSnap = reqSnaps[0]
        const offsetInfo = this.boatSnapOffsets[firstSnap]
        if (offsetInfo && offsetInfo.length > 1) {
          snapOffset = offsetInfo[1]
        }
      }
      
      // Add each new snap point
      newPoints.forEach(pointInfo => {
        const snap = pointInfo[0]
        const layers = pointInfo[1]
        // BUG FIX: Add null check for pointInfo[2] (offset data)
        const pointOffset = pointInfo[2] || { x: 0, y: 0 }
        const offset = {
          x: pointOffset.x + snapOffset.x,
          y: pointOffset.y + snapOffset.y
        }
        
        this.boatSnapPoints.push(snap)
        this.boatSnapOffsets[snap] = [layers, offset]
      })
    }
    
    // Update stats after adding part
    this.updateStats()
    
    console.debug('[BoatData] Added part', newPartId, '- snap points:', this.boatSnapPoints.length)
  }

  /**
   * BUG FIX #5: Remove part and restore snap points
   * Original Lingo: Boat.ls removePart(me, partId) - lines 175-195
   * 
   * Reverses addPart - restores covered points, removes new points
   * 
   * @param {number} partId - Part ID to remove
   * @returns {boolean} True if part was removed
   */
  removePart (partId) {
    const foundIndex = this._Parts.indexOf(partId)
    if (foundIndex === -1) {
      console.warn('[BoatData] Part not on boat:', partId)
      return false
    }
    
    // Remove from parts list
    this._Parts.splice(foundIndex, 1)
    
    // Get part data from BoatPartsDB
    const partsDB = this.game.mulle.BoatPartsDB
    if (!partsDB) {
      console.error('[BoatData] BoatPartsDB not initialized')
      return false
    }
    
    const part = partsDB.getPart(partId)
    if (!part) {
      console.warn('[BoatData] Part not found:', partId)
      return false
    }
    
    // Restore covered snap points
    const coversPoints = partsDB.getCoveredPoints(partId)
    if (coversPoints && coversPoints.length > 0) {
      coversPoints.forEach(point => {
        this.boatSnapPoints.push(point)
      })
    }
    
    // Remove new snap points
    const newPoints = partsDB.getNewPoints(partId)
    if (newPoints && newPoints.length > 0) {
      newPoints.forEach(pointInfo => {
        const snap = pointInfo[0]
        const index = this.boatSnapPoints.indexOf(snap)
        if (index !== -1) {
          this.boatSnapPoints.splice(index, 1)
        }
        delete this.boatSnapOffsets[snap]
      })
    }
    
    // Update stats after removing part
    this.updateStats()
    
    console.debug('[BoatData] Removed part', partId, '- snap points:', this.boatSnapPoints.length)
    return true
  }

  /**
   * Reconstruct boat from saved data
   * 
   * BUG FIX #3 (ADDITIONAL_BUGS_ROUND2.md): Missing snap point reconstruction on load
   * Original Lingo Boat.ls fromList() (lines 279-289):
   *   - Clears parts/snapPoints/snapOffsets arrays
   *   - Calls addPart() for each part to rebuild snap points
   * 
   * This is CRITICAL - without this, loaded boats have no snap points
   * and parts can't be attached/removed properly!
   * 
   * BUG FIX #4: Load fuelFull field
   * BUG FIX #5: Load CacheList field
   * 
   * @param {Object} data - Saved boat data { parts, name, medals, fuelFull, CacheList }
   */
  fromList (data) {
    const tempParts = data.parts || data.Parts || []
    this.Name = data.name || data.Name || ''
    this.Medals = data.medals || data.Medals || []
    
    // BUG FIX #4: Load fuelFull field
    this.fuelFull = data.fuelFull !== undefined ? data.fuelFull : false
    
    // BUG FIX #5: Load CacheList field
    this.CacheList = data.CacheList || data.cacheList || []
    
    // BUG FIX #3: Clear and rebuild snap point system
    // Original Lingo Boat.ls lines 283-285:
    //   set parts to []
    //   set boatSnapOffsets to [:]
    //   set boatSnapPoints to []
    this._Parts = []  // Use _Parts directly to avoid setter
    this.boatSnapPoints = []
    this.boatSnapOffsets = {}
    
    // BUG FIX #3: Rebuild snap points by calling addPart() for each part
    // Original Lingo Boat.ls lines 286-288:
    //   repeat with part in tempParts
    //     addPart(me, part)
    //   end repeat
    tempParts.forEach(partId => {
      this.addPart(partId)
    })
    
    console.log('[BoatData] Reconstructed boat from save:', {
      parts: this._Parts.length,
      snapPoints: this.boatSnapPoints.length,
      name: this.Name,
      medals: this.Medals.length,
      fuelFull: this.fuelFull,
      cacheCount: this.CacheList.length
    })
  }
}

export default MulleBoat
