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
   * @param {string} name - Item name (Bible, Swimring, DoctorBag, Compass, Diary, RottenFish)
   * @returns {boolean} True if item was added (false if already owned or invalid)
   */
  addItem (name) {
    if (!INVENTORY_ITEMS[name]) {
      console.warn('[SeaInventory] Unknown item:', name)
      return false
    }

    if (this.hasItem(name)) {
      console.log('[SeaInventory] Already has item:', name)
      return false
    }

    const data = this.getData()
    data.items[name] = true

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
    return data.items[name] === true
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
