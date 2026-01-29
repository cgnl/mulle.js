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
      // Default boat: basic hull (part 1 from boten CDDATA.CXT)
      this.Parts = [1]
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
    var attributes = [
      // Physical properties
      'weight',
      'depth',           // Draft/diepgang
      'durability',
      'loadcapacity',
      'stability',
      
      // Resistance/Performance
      'waterresistance',
      'maxwaterresistance',
      'maxdepth',
      'manoeuverability',
      'drift',
      
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
      this.properties.stability += part.getProperty('stability', 0)
      this.properties.waterresistance += part.getProperty('waterresistance', 0)
      this.properties.luxuryfactor += part.getProperty('luxuryfactor', 0)
      this.properties.funnyfactor += part.getProperty('funnyfactor', 0)
      this.properties.drift += part.getProperty('drift', 0)

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
   * Check if boat is seaworthy (equivalent to isRoadLegal for cars)
   * @param {boolean} talk - Play dialogue explaining what's missing
   * @returns {boolean}
   */
  isSeaworthy (talk = false) {
    // Must have a hull (at least one part)
    if (this.Parts.length === 0) {
      if (talk) console.log('[Boat] Geen romp - je hebt een boot nodig!')
      return false
    }

    // Must have propulsion (engine, sail, or oars)
    if (!this.criteria.HasPropulsion) {
      if (talk) console.log('[Boat] Geen aandrijving - je hebt een motor, zeil of roeispanen nodig!')
      return false
    }

    // Must have steering
    if (!this.criteria.HasSteering) {
      if (talk) console.log('[Boat] Geen besturing - je hebt een roer nodig!')
      return false
    }

    return true
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
