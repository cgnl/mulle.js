/**
 * Sea Inventory Manager - Quest items voor de boten game
 * 
 * Gebaseerd op originele Lingo user data (boten_CDDATA.CXT/Standalone/1.txt):
 * #Inventory:[#Blueprint1:[:]]
 * 
 * Inventory items uit object definities (boten_CDDATA.CXT/Standalone/):
 * - Bible (Object 4, 1953.txt) - SetWhenDone:[#Inventory:[#Bible]]
 * - Swimring (Object 5, 1954.txt) - SetWhenDone:[#Inventory:[#Swimring]]
 * - DoctorBag (Object 6, 1955.txt) - SetWhenDone:[#Inventory:[#DoctorBag]]
 * - Compass (Object 7, 1957.txt) - CheckFor:[#Inventory:[#Compass]]
 * - Diary (Dest 20, 1969.txt) - CheckFor:[#Inventory:[#Diary]]
 * - RottenFish (Dest 19, 1968.txt) - checkFor:[#inventory:[#RottenFish]]
 * 
 * @module struct/inventory
 */

/**
 * Valid inventory items met sprite en sound referenties uit originele Lingo
 * 
 * Bron bestanden:
 * - 1953.txt: Object 4 (Bible)
 * - 1954.txt: Object 5 (Swimring)
 * - 1955.txt: Object 6 (DoctorBag)
 * - 1957.txt: Object 7 (Compass)
 * - 1968.txt: Dest 19 (RottenFish)
 * - 1969.txt: Dest 20 (Diary)
 */
const INVENTORY_ITEMS = {
  Bible: {
    id: 'Bible',
    // Uit 1953.txt: #FrameList: [#normal: ["31b001v0"], #Trans:"33b010v0"]
    sprite: '31b001v0',
    transSprite: '33b010v0',
    // Uit 1953.txt: #Sounds: ["31d001v0", "31d009v0", "31e005v0"]
    sounds: ['31d001v0', '31d009v0', '31e005v0'],
    description: 'Bijbel voor de dominee',
    // Uit 1953.txt: #CheckFor:[#NotGivenMissions:[1], #Level:[2,3,4,5], #Inventory:[#Bible]]
    requiredLevel: 2,
    notGivenMission: 1
  },
  Swimring: {
    id: 'Swimring',
    // Uit 1954.txt: #FrameList: [#normal: ["31b002v0"], #Trans:"33b009v0"]
    sprite: '31b002v0',
    transSprite: '33b009v0',
    // Uit 1954.txt: #Sounds: ["31d008v0", "31d009v0", "31e005v0"]
    sounds: ['31d008v0', '31d009v0', '31e005v0'],
    description: 'Zwemring',
    // Uit 1954.txt: #CheckFor:[#NotGivenMissions:[2], #Level:[3,4,5], #Inventory:[#Swimring]]
    requiredLevel: 3,
    notGivenMission: 2
  },
  DoctorBag: {
    id: 'DoctorBag',
    // Uit 1955.txt: #FrameList: [#normal: ["31b003v0"], #Trans:"33b021v0"]
    sprite: '31b003v0',
    transSprite: '33b021v0',
    // Uit 1955.txt: #Sounds: ["05d118v0", "31d009v0", "31e005v0"]
    sounds: ['05d118v0', '31d009v0', '31e005v0'],
    description: 'Dokterstas',
    // Uit 1955.txt: #CheckFor:[#NotGivenMissions:[3], #Level:[3,4,5], #Inventory:[#DoctorBag]]
    requiredLevel: 3,
    notGivenMission: 3
  },
  Compass: {
    id: 'Compass',
    // Uit 1957.txt: #FrameList: [#normal: ["Dummy"]]
    sprite: null,
    transSprite: null,
    // Uit 1957.txt: #Sounds: ["05d118v0", "31d009v0", "31e005v0"]
    sounds: ['05d118v0', '31d009v0', '31e005v0'],
    description: 'Kompas voor navigatie in de mist',
    // Verkregen via Mia (83) - Part 46
    requiredLevel: 1,
    notGivenMission: null
  },
  Diary: {
    id: 'Diary',
    // Geen sprite data gevonden
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Dagboek voor Sam bij de vuurtoren',
    // Uit 1969.txt: CheckFor:[#Inventory:[#Diary]]
    requiredLevel: 1,
    notGivenMission: null
  },
  RottenFish: {
    id: 'RottenFish',
    // Geen sprite data gevonden
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Rotte vis voor de visser',
    // Uit 1968.txt: checkFor:[#inventory:[#RottenFish]]
    requiredLevel: 1,
    notGivenMission: null
  },
  MapPiece1: {
    id: 'MapPiece1',
    // Geen sprite data gevonden
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Eerste stuk van de kaart',
    // Voor Mission 17: Object delivery
    requiredLevel: 1,
    notGivenMission: null
  },
  MapPiece2: {
    id: 'MapPiece2',
    // Tweede stuk van de kaart
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Tweede stuk van de kaart',
    // Required for level 5
    requiredLevel: 1,
    notGivenMission: null
  },
  Pills: {
    id: 'Pills',
    // Stackable item with nr tracking
    // Original: Pills consumed to reduce buffaSick (vomit system)
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Pillen tegen zeeziekte (stapelbaar)',
    stackable: true,
    defaultNr: 100,
    requiredLevel: 1,
    notGivenMission: null
  },
  Belly: {
    id: 'Belly',
    // Hunger tracking system (0-1000)
    // Original: decreases during sailing (mulleHunger system)
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Honger level (0-1000)',
    stackable: true,
    defaultNr: 1000,
    requiredLevel: 1,
    notGivenMission: null
  },
  DrivenTimes: {
    id: 'DrivenTimes',
    // Tracking different propulsion types used
    // Original: { Motor: n, Sail: n, Oar: n }
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Gevaren keren per aandrijving',
    requiredLevel: 1,
    notGivenMission: null
  },
  Fished: {
    id: 'Fished',
    // Flag item - has fished already
    sprite: null,
    transSprite: null,
    sounds: [],
    description: 'Heeft al gevist',
    requiredLevel: 1,
    notGivenMission: null
  }
}

/**
 * Sea Inventory Manager
 * Beheert quest items en blueprints
 */
class MulleSeaInventory {
  /**
   * @param {Phaser.Game} game - Phaser game instance
   */
  constructor (game) {
    this.game = game
  }

  /**
   * Get user's inventory data
   * @returns {Object} SeaInventory from user save data
   */
  getData () {
    if (this.game.mulle && this.game.mulle.user) {
      return this.game.mulle.user.SeaInventory
    }
    return { items: {}, blueprints: { Blueprint1: {} } }
  }

  /**
   * Add item to inventory
   * Originele Lingo: SetWhenDone:[#Inventory:[#Bible]]
   * 
   * BUG FIX #26: Support both 'add' and 'replace' modes for stackable items
   * - 'add' mode: Add to existing quantity (default, for Pills/collectibles)
   * - 'replace' mode: Set to exact value (for Belly hunger tracking)
   * 
   * @param {string} name - Item name (Bible, Swimring, DoctorBag, Compass, Diary, RottenFish, Pills, Belly)
   * @param {Object} properties - Optional properties for stackable items (e.g., { nr: 100 })
   * @param {'add'|'replace'} mode - 'add' adds to existing nr, 'replace' sets it (default: 'add')
   * @returns {boolean} True if item was added (false if already owned or invalid)
   */
  addItem (name, properties = {}, mode = 'add') {
    const itemDef = INVENTORY_ITEMS[name]
    if (!itemDef) {
      console.warn('[SeaInventory] Unknown item:', name)
      return false
    }

    const data = this.getData()
    
    // Handle stackable items with nr tracking
    if (itemDef.stackable) {
      const existing = data.items[name] || {}
      
      // BUG FIX #26: Support both 'add' and 'replace' modes
      // - 'replace' mode: Set nr to exact value (for Belly hunger tracking)
      // - 'add' mode: Add to existing nr (for Pills/collectibles)
      const existingNr = mode === 'replace' ? 0 : (existing.nr || 0)
      const addNr = properties.nr !== undefined ? properties.nr : (itemDef.defaultNr || 1)
      
      data.items[name] = {
        ...existing,
        ...properties,
        nr: existingNr + addNr
      }
      
      console.log('[SeaInventory] Added stackable item:', name, 'mode:', mode, 'nr:', data.items[name].nr)
      this.save()
      return true
    }

    // Regular boolean items
    if (this.hasItem(name)) {
      console.log('[SeaInventory] Already has item:', name)
      return false
    }

    data.items[name] = Object.keys(properties).length > 0 ? properties : true

    console.log('[SeaInventory] Added item:', name)
    this.save()

    return true
  }

  /**
   * Remove item from inventory (when delivered to NPC)
   * 
   * @param {string} name - Item name
   * @returns {boolean} True if item was removed
   */
  removeItem (name) {
    if (!this.hasItem(name)) {
      console.log('[SeaInventory] Does not have item:', name)
      return false
    }

    const data = this.getData()
    delete data.items[name]

    console.log('[SeaInventory] Removed item:', name)
    this.save()

    return true
  }

  /**
   * Check if player has item
   * Originele Lingo: CheckFor:[#Inventory:[#Bible]]
   * 
   * @param {string} name - Item name
   * @returns {boolean}
   */
  hasItem (name) {
    const data = this.getData()
    const item = data.items[name]
    
    // For stackable items, check if nr > 0
    if (item && typeof item === 'object' && item.nr !== undefined) {
      return item.nr > 0
    }
    
    // For boolean items
    return item === true || (item && typeof item === 'object')
  }

  /**
   * Get all owned items
   * @returns {string[]} Array of item names
   */
  getItems () {
    const data = this.getData()
    return Object.keys(data.items).filter(k => data.items[k] === true)
  }

  /**
   * Get item definition/info
   * @param {string} name - Item name
   * @returns {Object|null} Item info or null if not found
   */
  getItemInfo (name) {
    return INVENTORY_ITEMS[name] || null
  }

  /**
   * Get item quantity (for stackable items)
   * @param {string} name - Item name
   * @returns {number} Quantity (0 if not stackable or not owned)
   */
  getItemQuantity (name) {
    const data = this.getData()
    const item = data.items[name]
    
    if (item && typeof item === 'object' && item.nr !== undefined) {
      return item.nr
    }
    
    return 0
  }

  /**
   * Set item quantity (for stackable items)
   * 
   * BUG FIX #26: This uses 'replace' mode semantics
   * Use this for Belly hunger updates where you want to SET the exact value
   * 
   * @param {string} name - Item name
   * @param {number} quantity - New quantity (replaces existing)
   * @returns {boolean} True if set successfully
   */
  setItemQuantity (name, quantity) {
    const itemDef = INVENTORY_ITEMS[name]
    if (!itemDef || !itemDef.stackable) {
      console.warn('[SeaInventory] Item not stackable:', name)
      return false
    }

    const data = this.getData()
    const existing = data.items[name] || {}
    
    // This is a REPLACE operation - sets to exact value
    data.items[name] = {
      ...existing,
      nr: Math.max(0, quantity)
    }
    
    console.log('[SeaInventory] Set item quantity (replace mode):', name, 'nr:', data.items[name].nr)
    this.save()
    
    return true
  }

  /**
   * Consume item quantity (for stackable items like Pills)
   * @param {string} name - Item name
   * @param {number} amount - Amount to consume
   * @returns {number} Amount actually consumed
   */
  consumeItem (name, amount) {
    const current = this.getItemQuantity(name)
    if (current <= 0) return 0
    
    const consumed = Math.min(current, amount)
    this.setItemQuantity(name, current - consumed)
    
    console.log('[SeaInventory] Consumed item:', name, 'amount:', consumed, 'remaining:', current - consumed)
    return consumed
  }

  /**
   * Check if pickup should be visible based on level and mission state
   * Originele Lingo: CheckFor:[#NotGivenMissions:[1], #Level:[2,3,4,5], #Inventory:[#Bible]]
   * 
   * @param {string} name - Item name
   * @returns {boolean} True if pickup should be visible/active
   */
  shouldShowPickup (name) {
    const item = INVENTORY_ITEMS[name]
    if (!item) return false

    // Already has item? Don't show (IfFound:#NoDisplay)
    if (this.hasItem(name)) {
      return false
    }

    const user = this.game.mulle.user
    if (!user) return false

    // Check level requirement
    if (item.requiredLevel && user.getSeaLevel() < item.requiredLevel) {
      return false
    }

    // Check NotGivenMissions - if mission is already given, don't show pickup
    if (item.notGivenMission && user.isSeaMissionGiven(item.notGivenMission)) {
      return false
    }

    return true
  }

  /**
   * Add blueprint to inventory
   * Originele Lingo: #Inventory:[#Blueprint1:[:]]
   * 
   * @param {string} id - Blueprint ID (e.g., 'Blueprint1')
   * @param {Object} data - Blueprint data
   */
  addBlueprint (id, data = {}) {
    const invData = this.getData()
    invData.blueprints[id] = data

    console.log('[SeaInventory] Added blueprint:', id)
    this.save()
  }

  /**
   * Check if has blueprint
   * @param {string} id - Blueprint ID
   * @returns {boolean}
   */
  hasBlueprint (id) {
    const data = this.getData()
    return data.blueprints[id] !== undefined
  }

  /**
   * Get blueprint data
   * @param {string} id - Blueprint ID
   * @returns {Object|null}
   */
  getBlueprint (id) {
    const data = this.getData()
    return data.blueprints[id] || null
  }

  /**
   * Save to user data
   */
  save () {
    if (this.game.mulle && this.game.mulle.user) {
      this.game.mulle.user.save()
    }
  }
}

export { INVENTORY_ITEMS }
export default MulleSeaInventory
