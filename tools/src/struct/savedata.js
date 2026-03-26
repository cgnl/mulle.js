import MulleCar from './cardata'
import MulleBoat from './boatdata'

class MulleSave {
  constructor (game, data) {
    this.game = game

    if (data) {
      console.debug('[savedata]', 'supplied, apply', data.UserId)

      this.fromJSON(data)
    } else {
      console.debug('[savedata]', 'not found, set defaults')

      this.setDefaults()
    }

    this.calculateParts()
  }

  setDefaults () {
    this.UserId = ''
    
    // BUG FIX #15: Save versioning system
    this.saveVersion = 2
    
    // BUG FIX #1: Add drivingInfo field for sailing statistics
    this.drivingInfo = {
      totalDistanceSailed: 0,
      totalTimeSailed: 0,
      longestVoyage: 0,
      favouritePropulsion: null  // 'Motor', 'Sail', 'Oar'
    }

    this.Car = new MulleCar(this.game)

    // default junk locations
    this.Junk = {
      Pile1: {
        66: new Phaser.Point(296, 234),
        29: new Phaser.Point(412, 311),
        143: new Phaser.Point(416, 186),
        178: new Phaser.Point(570, 255) },
      Pile2: {
        215: new Phaser.Point(545, 222),
        47: new Phaser.Point(386, 304),
        12: new Phaser.Point(239, 269),
        140: new Phaser.Point(352, 187) },
      Pile3: {
        153: new Phaser.Point(512, 153),
        131: new Phaser.Point(464, 298),
        307: new Phaser.Point(246, 285),
        112: new Phaser.Point(561, 293),
        30: new Phaser.Point(339, 189) },
      Pile4: {
        190: new Phaser.Point(182, 143),
        23: new Phaser.Point(346, 203),
        126: new Phaser.Point(178, 301),
        211: new Phaser.Point(75, 193) },
      Pile5: {
        6: new Phaser.Point(192, 377),
        90: new Phaser.Point(102, 290),
        203: new Phaser.Point(33, 122),
        158: new Phaser.Point(186, 164),
        119: new Phaser.Point(375, 268) },
      Pile6: {
        2: new Phaser.Point(160, 351),
        214: new Phaser.Point(130, 172),
        210: new Phaser.Point(281, 300),
        121: new Phaser.Point(85, 275)},
      shopFloor: {},
      yard: {}
    }

    this.NrOfBuiltCars = 0
    
    // BUG FIX #6: Consolidate to single boat save system (Saves for boats)
    // Keep 'Saves' for saved boats, 'savedCars' for saved cars
    this.Saves = []  // Saved boats
    this.CompletedMissions = []
    this.OwnStuff = []
    this.myLastPile = 1
    this.gifts = []
    this.toYardThroughDoor = true
    this.givenMissions = []
    this.figgeIsComing = false
    this.missionIsComing = false
    this.savedCars = []  // Saved cars
    
    // Figge Ferrum progression system
    this.FiggeVisits = 0
    this.FiggeUnlocks = {
      tier1: false,  // 2+ visits: 3 parts
      tier2: false,  // 4+ visits: 4 parts
      tier3: false,  // 7+ visits: 5 parts
      vip: false     // VIP status marker
    }
    
    // DLC tracking
    this.DLCPurchased = []
    
    // Phase 0: Additional persistent fields
    this.enterPartsSnapshot = null
    this.PostalHistory = []

    // === BOTEN (Scheepswerf) FIELDS ===
    this.scheepswerfUnlocked = false  // Unlocked by visiting ocean and seeing boat dream
    this.seenBoatDream = false        // Has seen the boat dream cutscene
    
    // BUG FIX #13: Add tutorial flags to defaults
    this.seenZeeIntro = false         // Has seen the main intro movie (Miel builds vlot/kano, arrives at quay)
    this.seenErsonTutorial = false    // Has seen Erson's sailing tutorial (scene 70)
    this.seenHarborTutorial = false   // Has seen harbor rope tutorial (scene 71)
    
    this.visitedBoatyard = false      // First visit to boatyard
    this.activeWorld = 'blauwwater'   // Currently selected world

    // Boat data (equivalent to Car)
    this.Boat = new MulleBoat(this.game)

    // Boat junk piles (equivalent to Junk for cars)
    // Based on original Lingo user data: #Junk: []
    // Categories based on boat part properties (similar to car junk piles)
    this.BoatJunk = {
      Quay: {},          // Quay/boatyard floor (visible in boatyard scene)
      Yard: {},          // Boatyard yard area
      Shelf1: {},        // Storage shelf 1 (any part type)
      Shelf2: {},        // Storage shelf 2
      Shelf3: {},        // Storage shelf 3
      Shelf4: {},        // Storage shelf 4
      Shelf5: {},        // Storage shelf 5
      Shelf6: {}         // Storage shelf 6
    }
    
    this.myLastBoatPile = 1  // Last visited boat junk category

    // Boat-specific tracking
    this.NrOfBuiltBoats = 0
    // BUG FIX #6: savedBoats removed - use Saves array instead (unified)
    // this.savedBoats = []  // REMOVED - use this.Saves for boats
    this.CompletedSeaMissions = []
    
    // === SEA INVENTORY & QUEST SYSTEM ===
    // Gebaseerd op originele Lingo user data (boten_CDDATA.CXT/Standalone/1.txt):
    // #Inventory:[#Blueprint1:[:]], #givenMissions: [], #deliveryMade: FALSE, #veryFirstTime: TRUE
    
    // Sea Inventory - quest items en blueprints
    // Items: Bible, Swimring, DoctorBag, Compass, Diary, RottenFish, Pills, Belly, DrivenTimes, Fished
    // 
    // BUG FIX #25/#29: DO NOT pre-initialize Belly/Pills/DrivenTimes!
    // Original Lingo User.ls line 12: set Inventory to [:]  (EMPTY!)
    // These items should ONLY be created on first use, not at initialization
    this.SeaInventory = {
      items: {},  // Empty - items added dynamically during gameplay
      blueprints: {        // Originele Lingo: #Blueprint1:[:]
        Blueprint1: {}
      }
    }

    // Sea Level (1-5) - bepaalt welke pickups zichtbaar zijn
    // Uit CheckFor:[#Level:[2,3,4,5]] in object definities (1953-1955.txt)
    // Level 2+: Bible pickup beschikbaar
    // Level 3+: Swimring, DoctorBag pickups beschikbaar
    this.SeaLevel = 1
    
    // Level system configuration (from LevelHandler.ls)
    this.lockLevel = false  // Prevents level changes when true
    this.minBuiltBoats = [0, 6, 9, 12, 15]  // Min boats built for each level (1-5)
    this.partsRequired = [[], [], [30], [17, 46], [975]]  // Required parts for each level
    this.inventoryRequired = [[], [], [], ['MapPiece1'], ['helmet', 'Suit', 'Fishingrod', 'MapPiece2', 'MapPiece3']]  // Required inventory items

    // Given sea missions - voorkomt re-triggering van pickups
    // Originele Lingo: #givenMissions: []
    // Gebruikt in CheckFor:[#NotGivenMissions:[1]] (1953.txt, etc.)
    this.givenSeaMissions = []

    // Delivery tracking - originele Lingo: #deliveryMade: FALSE
    this.deliveryMade = false

    // Very first time flag - originele Lingo: #veryFirstTime: TRUE
    this.veryFirstTime = true

    // === UNIFIED MISSIONS OBJECT ===
    // Provides compatibility with scenes expecting user.Missions structure
    // CompletedMissions stores { missionId: count } for repeat completions
    // GivenMissions is array of mission IDs that have been given
    this.Missions = {
      CompletedMissions: {},  // { missionId: completionCount, ... }
      GivenMissions: []       // [missionId, ...]
    }

    this.language = this.game.mulle.defaultLanguage // 'swedish'
  }

  addStuff (name) {
    if (this.hasStuff(name)) return false

    this.OwnStuff.push(name)

    this.save()

    return true
  }

  removeStuff (name) {
    if (!this.hasStuff(name)) return false

    var i = this.OwnStuff.indexOf(name)

    this.OwnStuff.splice(i, 1)

    this.save()

    return true
  }

  hasStuff (name) {
    return this.OwnStuff.indexOf(name) !== -1
  }

  // BUG FIX #2: Add gift helper methods
  /**
   * Add gift to gifts array
   * @param {string|number} giftId - Gift identifier
   * @returns {boolean} True if added, false if already exists
   */
  addGift (giftId) {
    if (this.hasGift(giftId)) return false
    
    this.gifts.push(giftId)
    this.save()
    
    console.log('[SaveData] Gift added:', giftId)
    return true
  }

  /**
   * Check if player has a specific gift
   * @param {string|number} giftId - Gift identifier
   * @returns {boolean}
   */
  hasGift (giftId) {
    return this.gifts.indexOf(giftId) !== -1
  }

  /**
   * Remove gift from gifts array
   * @param {string|number} giftId - Gift identifier
   * @returns {boolean} True if removed, false if not found
   */
  removeGift (giftId) {
    if (!this.hasGift(giftId)) return false
    
    const index = this.gifts.indexOf(giftId)
    this.gifts.splice(index, 1)
    this.save()
    
    console.log('[SaveData] Gift removed:', giftId)
    return true
  }

  hasPart (partId) {
    // junk piles
    for (var junkKey in this.Junk) {
      if (Object.keys(this.Junk[junkKey]).indexOf(partId) !== -1 || Object.keys(this.Junk[junkKey]).indexOf(partId.toString()) !== -1) return true
    }

    // regular car parts
    if (this.Car.Parts.indexOf(partId) !== -1 || this.Car.Parts.indexOf(partId.toString()) !== -1) return true

    // morphed car parts
    for (var i of this.Car.Parts) {
      var p = this.game.mulle.PartsDB[ i ]
      if (p.master && partId === p.master) return true
    }

    return false
  }

  /**
   * Check if player has a boat part (in boat or junk piles)
   * @param {number} partId 
   * @returns {boolean}
   */
  hasBoatPart (partId) {
    // Boat junk piles
    for (var junkKey in this.BoatJunk) {
      if (Object.keys(this.BoatJunk[junkKey]).indexOf(partId) !== -1 || 
          Object.keys(this.BoatJunk[junkKey]).indexOf(partId.toString()) !== -1) {
        return true
      }
    }

    // Parts on boat
    if (this.Boat && this.Boat.Parts) {
      if (this.Boat.Parts.indexOf(partId) !== -1 || 
          this.Boat.Parts.indexOf(partId.toString()) !== -1) {
        return true
      }
    }

    // Morphed boat parts
    if (this.Boat && this.Boat.Parts && this.game.mulle.BoatPartsDB) {
      for (var i of this.Boat.Parts) {
        var p = this.game.mulle.BoatPartsDB[i]
        if (p && p.Master && partId === p.Master) return true
      }
    }

    return false
  }

  /**
   * Add a boat part to a junk pile
   * @param {string} pile Pile name (boatyard, dock, warehouse)
   * @param {number} partId Part ID
   * @param {Phaser.Point} pos Position
   * @param {boolean} noSave Don't save
   * @returns {boolean}
   */
  addBoatPart (pile, partId, pos, noSave = false) {
    if (!this.BoatJunk[pile]) return false

    if (!pos) {
      pos = new Phaser.Point(
        this.game.rnd.integerInRange(100, 540), 
        this.game.rnd.integerInRange(380, 440)
      )
    }

    this.BoatJunk[pile][partId] = pos

    console.log('[SaveData] Boat part added', pile, partId, pos)

    if (!noSave) this.save()

    return true
  }

  /**
   * @param {string}       pile   Pile name
   * @param {number}       partId Part ID
   * @param {Phaser.Point} pos    Position in pile
   * @param {Boolean}      noSave Don't save user data
   */
  addPart (pile, partId, pos, noSave = false) {
    if (!this.Junk[pile]) return false

    if (!pos) pos = new Phaser.Point(this.game.rnd.integerInRange(0, 640), this.game.rnd.integerInRange(0, 480))

    this.Junk[pile][partId] = pos

    console.log('part added', pile, partId, pos)

    if (!noSave) this.save()

    return true
  }

  calculateParts () {
    this.availableParts = {}

    var defaultParts = {
      Postal: [],
      JunkMan: [13, 20, 17, 89, 290, 120, 18, 19, 173, 21, 297, 22, 24, 25, 185, 26, 27, 28, 32, 35, 91, 132, 129, 134, 137, 146, 149, 154, 168, 216, 174, 175, 177, 189, 191, 192, 193, 233, 199, 208, 209, 212, 221, 227, 229, 235, 251, 264, 278, 294, 295, 14],
      Destinations: [162, 99, 172, 54, 306, 287, 113, 283, 9],
      Random: [33, 38, 41, 42, 43, 176, 48, 53, 55, 64, 65, 74, 75, 76, 92, 93, 100, 101, 104, 107, 116, 130, 96, 155, 161, 181, 186, 195, 196, 200, 213, 219, 220, 222, 228, 230, 234, 236, 239, 242, 245, 248, 254, 257, 260, 261, 265, 271, 272, 273, 286, 288, 296]
    }

    for (var cat in defaultParts) {
      this.availableParts[cat] = []

      for (var id of defaultParts[cat]) {
        if (!this.hasPart(id)) {
          this.availableParts[cat].push(id)
          // }else{
          // console.warn('already has part', id);
        }
      }
    }

    console.log('availableParts', this.availableParts)
  }

  getRandomPart () {
    this.calculateParts()

    return this.game.rnd.pick(this.availableParts.Random)
  }

  /**
   * Save user data to localStorage
   * BUG FIX #8: Add validation and error handling
   * BUG FIX #14: Add debouncing for performance
   * 
   * @returns {boolean} True if saved successfully
   */
  save () {
    console.log('save data', this.UserId)
    
    // BUG FIX #14: Debounce auto-save to avoid performance issues
    if (this._saveTimeout) {
      clearTimeout(this._saveTimeout)
    }
    
    this._saveTimeout = setTimeout(() => {
      this._performSave()
    }, 100) // 100ms debounce
    
    return true
  }

  /**
   * Perform the actual save operation
   * @private
   */
  _performSave () {
    // BUG FIX #8: Validate before saving
    const validation = this.validateSaveData()
    if (!validation.valid) {
      console.error('[SaveData] Validation failed:', validation.errors)
      // Don't block save, but warn user
      if (typeof alert !== 'undefined') {
        alert('Warning: Save data may be corrupted. Check console for details.')
      }
    }
    
    try {
      const jsonString = JSON.stringify(this.game.mulle.UsersDB)
      window.localStorage.setItem('mulle_SaveData', jsonString)
      this._isDirty = false
      console.debug('[SaveData] Saved successfully')
      return true
    } catch (err) {
      console.error('[SaveData] Failed to save:', err)
      if (typeof alert !== 'undefined') {
        alert('Failed to save: ' + err.message)
      }
      return false
    }
  }

  fromJSON (data) {
    this.UserId = data.UserId
    
    // BUG FIX #15: Save versioning and migration
    const saveVersion = data.saveVersion || 1
    if (saveVersion < 2) {
      console.log('[SaveData] Migrating save from version', saveVersion, 'to 2')
      // Migration logic for version 1 -> 2
      // Add any version-specific migrations here
    }
    this.saveVersion = 2  // Current version
    
    // BUG FIX #1: Load drivingInfo field
    this.drivingInfo = data.drivingInfo || {
      totalDistanceSailed: 0,
      totalTimeSailed: 0,
      longestVoyage: 0,
      favouritePropulsion: null
    }

    this.Car = new MulleCar(this.game, data.Car)

    // BUG FIX #12: Reconstruct Phaser.Point objects in Junk piles
    this.Junk = data.Junk || {}
    for (const pileKey in this.Junk) {
      const pile = this.Junk[pileKey]
      if (typeof pile === 'object' && pile !== null) {
        for (const partId in pile) {
          const pos = pile[partId]
          if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            // Reconstruct as Phaser.Point
            this.Junk[pileKey][partId] = new Phaser.Point(pos.x, pos.y)
          }
        }
      }
    }

    this.NrOfBuiltCars = data.NrOfBuiltCars || 0
    this.Saves = data.Saves || []
    this.CompletedMissions = data.CompletedMissions || []
    this.OwnStuff = data.OwnStuff || []
    this.myLastPile = data.myLastPile || 1
    this.gifts = data.gifts || []
    this.toYardThroughDoor = data.toYardThroughDoor !== undefined ? data.toYardThroughDoor : true
    this.givenMissions = data.givenMissions || []
    this.figgeIsComing = data.figgeIsComing || false
    this.missionIsComing = data.missionIsComing || false
    this.savedCars = data.savedCars || []
    
    // Phase 0: Load additional persistent fields
    this.DLCPurchased = data.DLCPurchased || []
    this.FiggeVisits = data.FiggeVisits || 0
    this.FiggeUnlocks = data.FiggeUnlocks || {
      tier1: false,
      tier2: false,
      tier3: false,
      vip: false
    }
    this.enterPartsSnapshot = data.enterPartsSnapshot || null
    this.PostalHistory = data.PostalHistory || []

    // === BOTEN (Scheepswerf) FIELDS ===
    this.scheepswerfUnlocked = data.scheepswerfUnlocked || false
    this.seenBoatDream = data.seenBoatDream || false
    
    // BUG FIX #13: Load tutorial flags
    this.seenZeeIntro = data.seenZeeIntro || false
    this.seenErsonTutorial = data.seenErsonTutorial || false
    this.seenHarborTutorial = data.seenHarborTutorial || false
    
    this.visitedBoatyard = data.visitedBoatyard || false
    this.activeWorld = data.activeWorld || 'blauwwater'

    // Boat data
    this.Boat = new MulleBoat(this.game, data.Boat)

    // BUG FIX #10: Validate and reconstruct BoatJunk with Phaser.Point objects
    // BUG FIX #12: Reconstruct Phaser.Point objects in BoatJunk piles
    this.BoatJunk = data.BoatJunk || {
      Quay: {},
      Yard: {},
      Shelf1: {},
      Shelf2: {},
      Shelf3: {},
      Shelf4: {},
      Shelf5: {},
      Shelf6: {}
    }

    // Migration: rename old keys to new Lingo-matching names
    if (this.BoatJunk.shopFloor && !this.BoatJunk.Quay) {
      this.BoatJunk.Quay = this.BoatJunk.shopFloor
    }
    delete this.BoatJunk.shopFloor
    for (let i = 1; i <= 6; i++) {
      const oldKey = 'Category' + i
      const newKey = 'Shelf' + i
      if (this.BoatJunk[oldKey] && !this.BoatJunk[newKey]) {
        this.BoatJunk[newKey] = this.BoatJunk[oldKey]
      }
      delete this.BoatJunk[oldKey]
    }
    // Ensure all expected keys exist
    if (!this.BoatJunk.Quay) this.BoatJunk.Quay = {}
    if (!this.BoatJunk.Yard) this.BoatJunk.Yard = {}
    for (let i = 1; i <= 6; i++) {
      if (!this.BoatJunk['Shelf' + i]) this.BoatJunk['Shelf' + i] = {}
    }
    
    // Reconstruct Phaser.Point objects in BoatJunk
    for (const pileKey in this.BoatJunk) {
      const pile = this.BoatJunk[pileKey]
      if (typeof pile === 'object' && pile !== null) {
        for (const partId in pile) {
          const pos = pile[partId]
          if (pos && typeof pos.x === 'number' && typeof pos.y === 'number') {
            // Reconstruct as Phaser.Point
            this.BoatJunk[pileKey][partId] = new Phaser.Point(pos.x, pos.y)
          }
        }
      }
    }
    
    this.myLastBoatPile = data.myLastBoatPile || 1

    // Boat tracking
    this.NrOfBuiltBoats = data.NrOfBuiltBoats || 0
    
    // BUG FIX #6: Migrate old savedBoats to Saves array
    if (data.savedBoats && data.savedBoats.length > 0) {
      console.log('[SaveData] Migrating savedBoats to Saves array')
      // Merge old savedBoats into Saves if not already there
      for (const boat of data.savedBoats) {
        // Check if already in Saves
        const exists = this.Saves.some(s => 
          s.name === boat.name && 
          JSON.stringify(s.parts) === JSON.stringify(boat.parts)
        )
        if (!exists) {
          this.Saves.push(boat)
        }
      }
    }
    
    // BUG FIX #11: Handle CompletedMissions as both array and object
    this.CompletedSeaMissions = data.CompletedSeaMissions || []
    if (typeof data.CompletedSeaMissions === 'object' && !Array.isArray(data.CompletedSeaMissions)) {
      // If it's an object, extract keys as array (filter out NaN values)
      this.CompletedSeaMissions = Object.keys(data.CompletedSeaMissions)
        .map(k => parseInt(k, 10))
        .filter(n => !isNaN(n))
    }
    
    // === SEA INVENTORY & QUEST SYSTEM ===
    // Laden van inventory, level, en quest data
    this.SeaInventory = data.SeaInventory || {
      items: {},
      blueprints: { Blueprint1: {} }
    }
    
    // BUG FIX #25/#29: Migrate old saves that incorrectly pre-initialized items
    // Remove pre-initialized Belly/Pills/DrivenTimes if they were never used
    if (this.SeaInventory.items) {
      // Remove Belly if it's still at default 1000 (never consumed)
      if (this.SeaInventory.items.Belly && this.SeaInventory.items.Belly.nr === 1000) {
        console.log('[SaveData] Migration: Removing pre-initialized Belly (unused)')
        delete this.SeaInventory.items.Belly
      }
      
      // Remove Pills if it's still at default 100 (never consumed)
      if (this.SeaInventory.items.Pills && this.SeaInventory.items.Pills.nr === 100) {
        console.log('[SaveData] Migration: Removing pre-initialized Pills (unused)')
        delete this.SeaInventory.items.Pills
      }
      
      // Remove DrivenTimes if all values are 0 (never driven)
      if (this.SeaInventory.items.DrivenTimes) {
        const dt = this.SeaInventory.items.DrivenTimes
        if (dt.Motor === 0 && dt.Sail === 0 && dt.Oar === 0) {
          console.log('[SaveData] Migration: Removing pre-initialized DrivenTimes (unused)')
          delete this.SeaInventory.items.DrivenTimes
        }
      }
    }
    
    // Migratie: zorg dat blueprints object bestaat met tenminste Blueprint1
    if (!this.SeaInventory.blueprints) {
      this.SeaInventory.blueprints = { Blueprint1: {} }
      console.log('[SaveData] Migrated: added blueprints object with Blueprint1')
    } else if (this.SeaInventory.blueprints.Blueprint1 === undefined) {
      // Oude saves kunnen blueprints hebben maar zonder Blueprint1
      this.SeaInventory.blueprints.Blueprint1 = {}
      console.log('[SaveData] Migrated: added Blueprint1 to existing blueprints')
    }
    
    // Migratie: zorg dat items object bestaat
    if (!this.SeaInventory.items) {
      this.SeaInventory.items = {}
    }
    
    this.SeaLevel = data.SeaLevel || 1
    this.givenSeaMissions = data.givenSeaMissions || []
    this.deliveryMade = data.deliveryMade || false
    this.veryFirstTime = data.veryFirstTime !== undefined ? data.veryFirstTime : true
    
    // Level system configuration
    this.lockLevel = data.lockLevel !== undefined ? data.lockLevel : false
    this.minBuiltBoats = data.minBuiltBoats || [0, 6, 9, 12, 15]
    this.partsRequired = data.partsRequired || [[], [], [30], [17, 46], [975]]
    this.inventoryRequired = data.inventoryRequired || [[], [], [], ['MapPiece1'], ['helmet', 'Suit', 'Fishingrod', 'MapPiece2', 'MapPiece3']]

    // === UNIFIED MISSIONS OBJECT ===
    // Load with migration from old format if needed
    this.Missions = data.Missions || { CompletedMissions: {}, GivenMissions: [] }
    
    // Migrate old CompletedSeaMissions array to new Missions.CompletedMissions object
    if (this.CompletedSeaMissions && this.CompletedSeaMissions.length > 0 && 
        Object.keys(this.Missions.CompletedMissions).length === 0) {
      for (const missionId of this.CompletedSeaMissions) {
        this.Missions.CompletedMissions[missionId] = 1
      }
      console.log('[SaveData] Migrated CompletedSeaMissions to Missions.CompletedMissions')
    }
    
    // Migrate old givenSeaMissions array to Missions.GivenMissions
    if (this.givenSeaMissions && this.givenSeaMissions.length > 0 &&
        this.Missions.GivenMissions.length === 0) {
      this.Missions.GivenMissions = [...this.givenSeaMissions]
      console.log('[SaveData] Migrated givenSeaMissions to Missions.GivenMissions')
    }
    
    // BUG FIX #4.3: Weather persistence - restore weather state
    if (data.Weather && this.game.mulle.weather) {
      this.game.mulle.weather.weatherType = data.Weather.type || 1
      this.game.mulle.weather.changeWaitCounter = data.Weather.changeCounter || 0
      this.game.mulle.weather.realChange = data.Weather.realChange || 0
      console.log('[SaveData] Weather state restored:', data.Weather)
    }

    this.language = data.language || this.game.mulle.defaultLanguage
  }

  /**
   * Validate save data before serialization
   * BUG FIX #8: Add validation to prevent corrupted saves
   * BUG FIX #10: Validate junk piles
   * BUG FIX #11: Validate CompletedMissions structure
   * 
   * @returns {Object} Validation result { valid: boolean, errors: string[] }
   */
  validateSaveData () {
    const errors = []
    
    // Validate boat data
    if (this.Boat) {
      if (!Array.isArray(this.Boat.Parts)) {
        errors.push('Boat.Parts is not an array')
      }
      if (!Array.isArray(this.Boat.Medals)) {
        errors.push('Boat.Medals is not an array')
      }
      // BUG FIX #4: Validate fuelFull field
      if (this.Boat.fuelFull !== undefined && typeof this.Boat.fuelFull !== 'boolean') {
        errors.push('Boat.fuelFull is not a boolean')
      }
      // BUG FIX #5: Validate CacheList field
      if (!Array.isArray(this.Boat.CacheList)) {
        errors.push('Boat.CacheList is not an array')
      }
    }
    
    // BUG FIX #10: Validate junk piles structure
    if (this.Junk) {
      for (const pileKey in this.Junk) {
        const pile = this.Junk[pileKey]
        if (typeof pile !== 'object' || pile === null) {
          errors.push(`Junk pile '${pileKey}' is not a valid object`)
        } else {
          // Validate each part position in pile
          for (const partId in pile) {
            const pos = pile[partId]
            if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
              errors.push(`Junk pile '${pileKey}' part ${partId} has invalid position`)
            }
          }
        }
      }
    }
    
    // BUG FIX #10: Validate boat junk piles
    if (this.BoatJunk) {
      for (const pileKey in this.BoatJunk) {
        const pile = this.BoatJunk[pileKey]
        if (typeof pile !== 'object' || pile === null) {
          errors.push(`BoatJunk pile '${pileKey}' is not a valid object`)
        } else {
          // Validate each part position in pile
          for (const partId in pile) {
            const pos = pile[partId]
            if (!pos || typeof pos.x !== 'number' || typeof pos.y !== 'number') {
              errors.push(`BoatJunk pile '${pileKey}' part ${partId} has invalid position`)
            }
          }
        }
      }
    }
    
    // Validate inventory structure
    if (this.SeaInventory) {
      if (!this.SeaInventory.items || typeof this.SeaInventory.items !== 'object') {
        errors.push('SeaInventory.items is not an object')
      }
      if (!this.SeaInventory.blueprints || typeof this.SeaInventory.blueprints !== 'object') {
        errors.push('SeaInventory.blueprints is not an object')
      }
    }
    
    // BUG FIX #11: Validate missions structure (should be object, not array)
    if (this.Missions) {
      if (!this.Missions.CompletedMissions || typeof this.Missions.CompletedMissions !== 'object') {
        errors.push('Missions.CompletedMissions is not an object')
      }
      if (!Array.isArray(this.Missions.GivenMissions)) {
        errors.push('Missions.GivenMissions is not an array')
      }
    }
    
    // Validate legacy CompletedSeaMissions (should be array)
    if (this.CompletedSeaMissions && !Array.isArray(this.CompletedSeaMissions)) {
      errors.push('CompletedSeaMissions is not an array')
    }
    
    // Validate numeric fields
    if (typeof this.NrOfBuiltBoats !== 'number') {
      errors.push('NrOfBuiltBoats is not a number')
    }
    if (typeof this.SeaLevel !== 'number' || this.SeaLevel < 1 || this.SeaLevel > 5) {
      errors.push('SeaLevel is invalid (must be 1-5)')
    }
    
    // Validate save version
    if (typeof this.saveVersion !== 'number') {
      errors.push('saveVersion is not a number')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }

  toJSON () {
    // BUG FIX: Validate before serialization
    const validation = this.validateSaveData()
    if (!validation.valid) {
      console.error('[SaveData] Validation errors before save:', validation.errors)
      // Don't block save, but log errors
    }
    
    return {
      // BUG FIX #15: Add save version for migration support
      saveVersion: 2,
      
      UserId: this.UserId,
      
      // BUG FIX #1: Add drivingInfo field
      drivingInfo: this.drivingInfo,
      
      Car: this.Car,
      Junk: this.Junk,
      NrOfBuiltCars: this.NrOfBuiltCars,
      CompletedMissions: this.CompletedMissions,
      OwnStuff: this.OwnStuff,
      givenMissions: this.givenMissions,
      myLastPile: this.myLastPile,
      
      // BUG FIX #6: Use Saves for boats (unified), savedCars for cars
      Saves: this.Saves,  // Saved boats
      savedCars: this.savedCars,  // Saved cars
      
      // Phase 0: Save all relevant fields for persistence
      gifts: this.gifts,
      missionIsComing: this.missionIsComing,
      figgeIsComing: this.figgeIsComing,
      toYardThroughDoor: this.toYardThroughDoor,
      DLCPurchased: this.DLCPurchased,
      FiggeVisits: this.FiggeVisits,
      FiggeUnlocks: this.FiggeUnlocks,
      enterPartsSnapshot: this.enterPartsSnapshot,
      PostalHistory: this.PostalHistory,
      
      // === BOTEN (Scheepswerf) FIELDS ===
      scheepswerfUnlocked: this.scheepswerfUnlocked,
      seenBoatDream: this.seenBoatDream,
      
      // BUG FIX #13: Save tutorial flags
      seenZeeIntro: this.seenZeeIntro,
      seenErsonTutorial: this.seenErsonTutorial,
      seenHarborTutorial: this.seenHarborTutorial,
      
      visitedBoatyard: this.visitedBoatyard,
      activeWorld: this.activeWorld,
      Boat: this.Boat,
      BoatJunk: this.BoatJunk,
      myLastBoatPile: this.myLastBoatPile,
      NrOfBuiltBoats: this.NrOfBuiltBoats,
      
      // BUG FIX #6: Don't save savedBoats separately - merged into Saves
      // savedBoats field removed - boats use Saves array
      
      CompletedSeaMissions: this.CompletedSeaMissions,
      
      // === SEA INVENTORY & QUEST SYSTEM ===
      SeaInventory: this.SeaInventory,
      SeaLevel: this.SeaLevel,
      givenSeaMissions: this.givenSeaMissions,
      deliveryMade: this.deliveryMade,
      veryFirstTime: this.veryFirstTime,
      
      // === LEVEL SYSTEM ===
      lockLevel: this.lockLevel,
      minBuiltBoats: this.minBuiltBoats,
      partsRequired: this.partsRequired,
      inventoryRequired: this.inventoryRequired,
      
      // === UNIFIED MISSIONS ===
      Missions: this.Missions,
      
      // BUG FIX #4.3: Weather persistence - save weather state
      Weather: {
        type: this.game.mulle.weather ? this.game.mulle.weather.weatherType : 1,
        changeCounter: this.game.mulle.weather ? this.game.mulle.weather.changeWaitCounter : 0,
        realChange: this.game.mulle.weather ? this.game.mulle.weather.realChange : 0
      },
      
      language: this.language
    }
  }

  // === SEA INVENTORY & QUEST HELPER METHODS ===
  // NOTE: These methods are kept for backwards compatibility
  // New code should use the unified methods: isMissionGiven(), isMissionCompleted(), etc.

  /**
   * Check if sea mission is given (to prevent re-triggering pickups)
   * Originele Lingo: CheckFor:[#NotGivenMissions:[1]]
   * 
   * DEPRECATED: Use isMissionGiven() instead
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  isSeaMissionGiven (missionId) {
    // Delegate to unified method
    return this.isMissionGiven(missionId)
  }

  /**
   * Mark sea mission as given
   * Voorkomt dat pickup opnieuw verschijnt
   * 
   * DEPRECATED: Use addGivenMission() instead
   * 
   * @param {number} missionId - Mission ID
   */
  giveSeaMission (missionId) {
    // Delegate to unified method
    this.addGivenMission(missionId)
  }

  /**
   * Check if sea mission is completed
   * 
   * BUG FIX #28: Matches original Lingo boolean return type
   * Original Lingo User.ls line 216: return not voidp(getaProp(completedMissions, theid))
   * This returns BOOLEAN, not count!
   * 
   * DEPRECATED: Use isMissionCompleted() for count tracking
   * This method kept for backwards compatibility with original Lingo behavior
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean} True if completed at least once
   */
  isSeaMissionCompleted (missionId) {
    // Delegate to unified method (convert count to boolean)
    return this.isMissionCompleted(missionId) > 0
  }

  /**
   * Complete sea mission
   * Originele Lingo: SetWhenDone:[#Missions:[4]]
   * 
   * DEPRECATED: Use addCompletedMission() instead for full count tracking
   * This method is kept for backwards compatibility
   * 
   * BUG FIX #28: Return type mismatch
   * Legacy method should return boolean for backwards compatibility
   * New unified method (addCompletedMission) returns count
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean} True if mission was newly completed
   */
  completeSeaMission (missionId) {
    // Check if already completed before
    const wasCompleted = this.isMissionCompleted(missionId) > 0
    
    // Delegate to unified method which tracks completion count
    this.addCompletedMission(missionId)
    
    // Return true if this was the first completion
    return !wasCompleted
  }

  /**
   * Get current sea level (1-5)
   * Checks for level updates if not locked
   * Original Lingo: getLevel()
   * @returns {number}
   */
  getSeaLevel () {
    if (!this.lockLevel) {
      this.updateLevel()
    }
    return this.SeaLevel
  }

  /**
   * Set sea level (1-5)
   * @param {number} level - New level (clamped to 1-5)
   */
  setSeaLevel (level) {
    this.SeaLevel = Math.max(1, Math.min(5, level))
    console.log('[SaveData] Sea level set to:', this.SeaLevel)
    this.save()
  }
  
  /**
   * Set lock level flag (prevents automatic level updates)
   * Original Lingo: setlockLevel(me, argStatus)
   * @param {boolean} locked - True to lock level
   */
  setLockLevel (locked) {
    this.lockLevel = locked
    console.log('[SaveData] Level lock set to:', this.lockLevel)
  }
  
  /**
   * Check if player has all required boat parts for a specific level
   * Original Lingo: gotParts(me, argLevel)
   * @param {number} level - Level to check (1-5)
   * @returns {boolean} True if player has all required parts
   */
  gotParts (level) {
    // Validate level
    if (level < 1 || level > 5) return false
    
    // Get required parts for this level (1-indexed in Lingo, 0-indexed in JS)
    const requiredParts = this.partsRequired[level - 1] || []
    
    // No parts required = always pass
    if (requiredParts.length === 0) return true
    
    // Check if player has each required part
    for (const partId of requiredParts) {
      if (!this.hasBoatPart(partId)) {
        return false
      }
    }
    
    return true
  }
  
  /**
   * Check if player has all required inventory items for a specific level
   * Original Lingo: gotInventory(me, argLevel)
   * @param {number} level - Level to check (1-5)
   * @returns {boolean} True if player has all required inventory items
   */
  gotInventory (level) {
    // Validate level
    if (level < 1 || level > 5) return false
    
    // Get required inventory items for this level (1-indexed in Lingo, 0-indexed in JS)
    const requiredItems = this.inventoryRequired[level - 1] || []
    
    // No items required = always pass
    if (requiredItems.length === 0) return true
    
    // Check if player has each required inventory item
    for (const itemId of requiredItems) {
      if (!this.isInInventory(itemId)) {
        return false
      }
    }
    
    return true
  }
  
  /**
   * Update sea level based on boats built, parts owned, and inventory
   * Original Lingo: updateLevel(me)
   * Checks all level requirements and sets level to highest met
   */
  updateLevel () {
    const boatsBuilt = this.NrOfBuiltBoats || 0
    
    // Check each level from highest to lowest
    // Set to highest level where all conditions are met
    for (let level = 5; level >= 1; level--) {
      const minBoats = this.minBuiltBoats[level - 1] || 0
      
      // Check if player meets all requirements for this level
      if (boatsBuilt >= minBoats && this.gotParts(level) && this.gotInventory(level)) {
        if (this.SeaLevel !== level) {
          const oldLevel = this.SeaLevel
          this.SeaLevel = level
          console.log('[SaveData] Level updated:', oldLevel, '->', level, 
                      '(boats:', boatsBuilt, 'required:', minBoats, ')')
          this.save()
        }
        return
      }
    }
  }

  /**
   * Increase sea level by 1 (max 5)
   * @returns {boolean} True if level was increased
   */
  increaseSeaLevel () {
    if (this.SeaLevel < 5) {
      this.SeaLevel++
      console.log('[SaveData] Sea level increased to:', this.SeaLevel)
      this.save()
      return true
    }
    return false
  }

  /**
   * Check level requirement
   * Originele Lingo: CheckFor:[#Level:[2,3,4,5]]
   * 
   * @param {number} minLevel - Minimum required level
   * @returns {boolean}
   */
  meetsSeaLevelRequirement (minLevel) {
    return this.SeaLevel >= minLevel
  }

  /**
   * Check if this is the very first time playing
   * Originele Lingo: #veryFirstTime: TRUE
   * @returns {boolean}
   */
  isVeryFirstTime () {
    return this.veryFirstTime === true
  }

  /**
   * Mark that player has started (no longer first time)
   */
  markNotFirstTime () {
    if (this.veryFirstTime) {
      this.veryFirstTime = false
      console.log('[SaveData] No longer first time')
      this.save()
    }
  }

  // === SEA LEVEL PROGRESSION SYSTEM ===
  
  /**
   * Level progression triggers:
   * - Level 1 → 2: First boat built and first sea trip completed
   * - Level 2 → 3: 2+ medals earned OR 3+ sea missions completed
   * - Level 3 → 4: 4+ medals earned
   * - Level 4 → 5: All 6 medals earned (game completion)
   * 
   * Content unlocked by level:
   * - Level 2+: Bible pickup, Erson encounters
   * - Level 3+: Swimring, DoctorBag pickups
   * - Level 4+: Special destinations?
   * - Level 5: Diploma/completion rewards
   */

  /**
   * Check and update sea level based on current progress
   * Call this after medal awards, mission completions, boat builds, etc.
   * 
   * @returns {number|null} New level if upgraded, null if no change
   */
  checkSeaLevelProgression () {
    const currentLevel = this.SeaLevel
    let newLevel = currentLevel

    // Get medal count from boat
    const medalCount = this.Boat && this.Boat.Medals ? this.Boat.Medals.length : 0
    const missionCount = this.CompletedSeaMissions ? this.CompletedSeaMissions.length : 0
    const boatsBuilt = this.NrOfBuiltBoats || 0
    const hasVisitedSea = this.visitedBoatyard || false

    // Level 1 → 2: Built first boat AND visited sea (or completed first mission)
    if (currentLevel === 1) {
      if ((boatsBuilt >= 1 && hasVisitedSea) || missionCount >= 1) {
        newLevel = 2
      }
    }
    
    // Level 2 → 3: 2+ medals OR 3+ missions completed
    if (currentLevel === 2) {
      if (medalCount >= 2 || missionCount >= 3) {
        newLevel = 3
      }
    }
    
    // Level 3 → 4: 4+ medals earned
    if (currentLevel === 3) {
      if (medalCount >= 4) {
        newLevel = 4
      }
    }
    
    // Level 4 → 5: All 6 medals (game completion)
    if (currentLevel === 4) {
      if (medalCount >= 6) {
        newLevel = 5
      }
    }

    // Apply level change if different
    if (newLevel > currentLevel) {
      this.SeaLevel = newLevel
      console.log('[SaveData] Sea level increased:', currentLevel, '->', newLevel, 
                  '(medals:', medalCount, 'missions:', missionCount, 'boats:', boatsBuilt, ')')
      this.save()
      return newLevel
    }

    return null
  }

  /**
   * Get description of what unlocks at each level
   * @param {number} level - Level to describe (1-5)
   * @returns {string[]} Array of unlock descriptions
   */
  getSeaLevelUnlocks (level) {
    const unlocks = {
      1: ['Basis zee navigatie', 'Scheepswerf toegang', 'Weer type 1 (kalm)'],
      2: ['Bijbel pickup verschijnt', 'Erson ontmoetingen'],
      3: ['Zwemring pickup', 'Dokterstas pickup', 'Weer types 1-2'],
      4: ['Speciale eilanden', 'Bonus onderdelen', 'Weer types 3-4'],
      5: ['Diploma!', 'Alle content ontgrendeld', 'Alle weer types 1-4']
    }
    return unlocks[level] || []
  }
  
  /**
   * Get available weather types for current level
   * Original Lingo: possibleWeatherInLevel from Weather.ls
   * Level 1-2: [1] (calm weather only)
   * Level 3: [1, 2] (calm and moderate)
   * Level 4: [3, 4] (rough weather)
   * Level 5+: [1, 2, 3, 4] (all weather types)
   * 
   * @returns {number[]} Array of available weather type IDs
   */
  getAvailableWeatherTypes () {
    const possibleWeatherInLevel = [
      [1],           // Level 1: calm only
      [1],           // Level 2: calm only
      [1, 2],        // Level 3: calm and moderate
      [3, 4],        // Level 4: rough weather
      [1, 2, 3, 4],  // Level 5: all types
      [1, 2, 3, 4]   // Level 6 (if exists): all types
    ]
    
    const level = this.getSeaLevel()
    const index = Math.max(0, Math.min(level - 1, possibleWeatherInLevel.length - 1))
    
    return possibleWeatherInLevel[index] || [1]
  }
  
  /**
   * Check if weather type is available at current level
   * @param {number} weatherType - Weather type ID (1-4)
   * @returns {boolean} True if weather type is unlocked
   */
  isWeatherTypeAvailable (weatherType) {
    return this.getAvailableWeatherTypes().includes(weatherType)
  }

  /**
   * Get requirements to reach next level
   * @returns {Object} Requirements object with current progress
   */
  getNextLevelRequirements () {
    const currentLevel = this.SeaLevel
    const medalCount = this.Boat && this.Boat.Medals ? this.Boat.Medals.length : 0
    const missionCount = this.CompletedSeaMissions ? this.CompletedSeaMissions.length : 0
    const boatsBuilt = this.NrOfBuiltBoats || 0

    if (currentLevel >= 5) {
      return { 
        nextLevel: null, 
        message: 'Maximum level bereikt!',
        complete: true 
      }
    }

    const requirements = {
      1: {
        nextLevel: 2,
        message: 'Bouw je eerste boot en ga de zee op',
        progress: { boatsBuilt, required: 1, visitedSea: this.visitedBoatyard }
      },
      2: {
        nextLevel: 3,
        message: 'Verdien 2 medailles of voltooi 3 missies',
        progress: { medals: medalCount, requiredMedals: 2, missions: missionCount, requiredMissions: 3 }
      },
      3: {
        nextLevel: 4,
        message: 'Verdien 4 medailles',
        progress: { medals: medalCount, required: 4 }
      },
      4: {
        nextLevel: 5,
        message: 'Verdien alle 6 medailles!',
        progress: { medals: medalCount, required: 6 }
      }
    }

    return requirements[currentLevel] || { nextLevel: null, message: 'Unknown level', complete: false }
  }

  /**
   * Force level up (for debug/cheats)
   * @returns {boolean} True if level was increased
   */
  forceSeaLevelUp () {
    if (this.SeaLevel < 5) {
      const oldLevel = this.SeaLevel
      this.SeaLevel++
      console.log('[SaveData] CHEAT: Sea level forced:', oldLevel, '->', this.SeaLevel)
      this.save()
      return true
    }
    return false
  }

  // ==========================================================================
  // UNIFIED MISSION SYSTEM
  // Based on original Lingo functions from boten game:
  // - isMissionCompleted(user, missionId) → 0 or count
  // - isMissionGiven(user, missionId) → boolean
  // - addCompletedMission(user, missionId)
  // - addGivenMission(user, missionId)
  // - getCompletedMissionInfo(user, missionId, #count) → completion count
  // ==========================================================================

  /**
   * Check if mission is completed and get completion count
   * 
   * BUG FIX #28: Return type clarification
   * Original Lingo has TWO methods:
   *   - isMissionCompleted(user, missionId) → BOOLEAN (true/false)
   *   - getCompletedMissionInfo(user, missionId, #count) → NUMBER (count)
   * 
   * This unified JS method returns NUMBER for enhanced tracking.
   * Use `> 0` to convert to boolean if needed.
   * 
   * @param {number} missionId - Mission ID
   * @returns {number} Completion count (0 if never completed)
   */
  isMissionCompleted (missionId) {
    // Check unified Missions object first
    if (this.Missions && this.Missions.CompletedMissions) {
      const count = this.Missions.CompletedMissions[missionId]
      if (count !== undefined) return count
    }
    
    // Fallback: check legacy CompletedSeaMissions array
    if (this.CompletedSeaMissions && this.CompletedSeaMissions.includes(missionId)) {
      return 1
    }
    
    return 0
  }

  /**
   * Check if mission has been given to player
   * Original Lingo: isMissionGiven(user, missionId) → boolean
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  isMissionGiven (missionId) {
    // Check unified Missions object first
    if (this.Missions && this.Missions.GivenMissions) {
      if (this.Missions.GivenMissions.includes(missionId)) return true
    }
    
    // Fallback: check legacy givenSeaMissions array
    if (this.givenSeaMissions && this.givenSeaMissions.includes(missionId)) {
      return true
    }
    
    return false
  }

  /**
   * Add/complete a mission (increments completion count)
   * Original Lingo: addCompletedMission(user, missionId)
   * 
   * @param {number} missionId - Mission ID
   * @returns {number} New completion count
   */
  addCompletedMission (missionId) {
    // Ensure Missions object exists
    if (!this.Missions) {
      this.Missions = { CompletedMissions: {}, GivenMissions: [] }
    }
    if (!this.Missions.CompletedMissions) {
      this.Missions.CompletedMissions = {}
    }
    
    // Increment completion count
    const currentCount = this.Missions.CompletedMissions[missionId] || 0
    this.Missions.CompletedMissions[missionId] = currentCount + 1
    
    // Also update legacy array for backwards compatibility
    if (!this.CompletedSeaMissions) {
      this.CompletedSeaMissions = []
    }
    if (!this.CompletedSeaMissions.includes(missionId)) {
      this.CompletedSeaMissions.push(missionId)
    }
    
    console.log('[SaveData] Mission completed:', missionId, 'Count:', this.Missions.CompletedMissions[missionId])
    this.save()
    
    // Check for level progression
    this.checkSeaLevelProgression()
    
    return this.Missions.CompletedMissions[missionId]
  }

  /**
   * Mark a mission as given to the player
   * Original Lingo: addGivenMission(user, missionId)
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean} True if newly given, false if already given
   */
  addGivenMission (missionId) {
    // Ensure Missions object exists
    if (!this.Missions) {
      this.Missions = { CompletedMissions: {}, GivenMissions: [] }
    }
    if (!this.Missions.GivenMissions) {
      this.Missions.GivenMissions = []
    }
    
    if (this.Missions.GivenMissions.includes(missionId)) {
      return false
    }
    
    this.Missions.GivenMissions.push(missionId)
    
    // Also update legacy array for backwards compatibility
    if (!this.givenSeaMissions) {
      this.givenSeaMissions = []
    }
    if (!this.givenSeaMissions.includes(missionId)) {
      this.givenSeaMissions.push(missionId)
    }
    
    console.log('[SaveData] Mission given:', missionId)
    this.save()
    
    return true
  }

  /**
   * Get mission completion info
   * Original Lingo: getCompletedMissionInfo(user, missionId, #count) → value
   * 
   * @param {number} missionId - Mission ID
   * @param {string} property - Property to get ('count' or other future properties)
   * @returns {*} Property value
   */
  getCompletedMissionInfo (missionId, property = 'count') {
    if (property === 'count') {
      return this.isMissionCompleted(missionId)
    }
    // Future: could add other properties like 'firstCompletedDate', 'lastCompletedDate', etc.
    return null
  }

  // ==========================================================================
  // SEA INVENTORY SYSTEM (Enhanced)
  // Based on original Lingo functions:
  // - isInInventory(itemId) → boolean
  // - setInInventory(user, itemId, properties)
  // - getInventoryItem(itemId) → properties or null
  // ==========================================================================

  /**
   * Check if item is in sea inventory
   * Original Lingo: isInInventory(itemId) → boolean
   * 
   * @param {string} itemId - Item ID (e.g., 'Bible', '#Bible', 'Helmet')
   * @returns {boolean}
   */
  isInInventory (itemId) {
    // Normalize item ID (remove # prefix if present)
    const normalizedId = itemId.replace(/^#/, '')
    
    if (!this.SeaInventory || !this.SeaInventory.items) return false
    
    const item = this.SeaInventory.items[normalizedId]
    return item !== undefined && item !== false && item !== null
  }

  /**
   * Add or set item in sea inventory with optional properties
   * Original Lingo: setInInventory(user, itemId, properties)
   * 
   * BUG FIX #26: Add 'replace' mode for Belly/Pills (hunger tracking)
   * Original behavior from boat_04 Dir.ls:
   *   setInInventory(user, #Belly, [#nr: mulleHunger / 10])
   * This REPLACES the value, not ADDS to it!
   * 
   * @param {string} itemId - Item ID (e.g., 'Bible', '#Bible', 'Belly')
   * @param {Object} properties - Optional properties (e.g., { nr: 1000 } for snacks)
   * @param {'add'|'replace'} mode - 'add' adds to existing nr, 'replace' sets it (default: 'add')
   * @returns {boolean} True if added
   */
  setInInventory (itemId, properties = {}, mode = 'add') {
    // Normalize item ID (remove # prefix if present)
    const normalizedId = itemId.replace(/^#/, '')
    
    // Ensure SeaInventory exists
    if (!this.SeaInventory) {
      this.SeaInventory = { items: {}, blueprints: { Blueprint1: {} } }
    }
    if (!this.SeaInventory.items) {
      this.SeaInventory.items = {}
    }
    
    // If properties has 'nr' (count), handle as stackable item
    if (properties.nr !== undefined) {
      const existing = this.SeaInventory.items[normalizedId] || {}
      
      // BUG FIX #26: Support both 'add' and 'replace' modes
      // - 'replace' mode: Set nr to exact value (for Belly hunger tracking)
      // - 'add' mode: Add to existing nr (for Pills/collectibles)
      const existingNr = mode === 'replace' ? 0 : (existing.nr || 0)
      
      this.SeaInventory.items[normalizedId] = { 
        ...existing, 
        ...properties,
        nr: existingNr + (properties.nr || 0)
      }
    } else if (Object.keys(properties).length > 0) {
      // Has other properties (like DrivenTimes: { Motor: 0, Sail: 0, Oar: 0 })
      this.SeaInventory.items[normalizedId] = properties
    } else {
      // Simple boolean item
      this.SeaInventory.items[normalizedId] = true
    }
    
    console.log('[SaveData] Inventory set:', normalizedId, this.SeaInventory.items[normalizedId])
    this.save()
    
    return true
  }

  /**
   * Remove item from sea inventory
   * 
   * @param {string} itemId - Item ID
   * @returns {boolean} True if removed
   */
  removeFromInventory (itemId) {
    const normalizedId = itemId.replace(/^#/, '')
    
    if (!this.SeaInventory || !this.SeaInventory.items) return false
    if (!this.SeaInventory.items[normalizedId]) return false
    
    delete this.SeaInventory.items[normalizedId]
    console.log('[SaveData] Inventory removed:', normalizedId)
    this.save()
    
    return true
  }

  /**
   * Get inventory item with its properties
   * Original Lingo: lookUpInventory(user, argProp)
   * 
   * @param {string} itemId - Item ID
   * @returns {*} Item value/properties or null
   */
  getInventoryItem (itemId) {
    const normalizedId = itemId.replace(/^#/, '')
    
    if (!this.SeaInventory || !this.SeaInventory.items) return null
    
    return this.SeaInventory.items[normalizedId] || null
  }

  /**
   * Alias for getInventoryItem (matches original Lingo naming)
   * Original Lingo: lookUpInventory(user, argProp)
   * 
   * @param {string} itemId - Item ID
   * @returns {*} Item value/properties or null
   */
  lookUpInventory (itemId) {
    return this.getInventoryItem(itemId)
  }

  // ==========================================================================
  // BOAT MEDAL HELPERS
  // Convenience methods that delegate to MulleBoat
  // ==========================================================================

  /**
   * Add medal to boat
   * Original Lingo: addMedal(boat, medalId)
   * 
   * @param {number} medalId - Medal ID (1-6)
   * @returns {boolean} True if newly awarded
   */
  addMedal (medalId) {
    if (!this.Boat) return false
    
    if (this.Boat.hasMedal(medalId)) return false
    
    this.Boat.addMedal(medalId)
    console.log('[SaveData] Medal awarded:', medalId)
    this.save()
    
    // Check for level progression
    this.checkSeaLevelProgression()
    
    return true
  }

  /**
   * Check if boat has medal
   * 
   * @param {number} medalId - Medal ID (1-6)
   * @returns {boolean}
   */
  hasMedal (medalId) {
    if (!this.Boat) return false
    return this.Boat.hasMedal(medalId)
  }

  // ==========================================================================
  // BOAT PART REWARDS
  // For missions that reward boat parts
  // ==========================================================================

  /**
   * Add a new boat part to boatyard junk (as reward)
   * Original Lingo: addNewPart(user, partId)
   * 
   * @param {number} partId - Boat part ID
    * @param {string} pile - Junk pile name (default: 'Quay')
    * @returns {boolean} True if added
    */
   addNewPart (partId, pile = 'Quay') {
    return this.addBoatPart(pile, partId)
  }

  // ==========================================================================
  // DRIVEN TIMES TRACKING (Lazy Initialization)
  // BUG FIX #29: DrivenTimes should NOT be pre-initialized
  // Only create on first use to track propulsion usage
  // ==========================================================================

  /**
   * Get DrivenTimes tracking object (lazy initialization)
   * 
   * BUG FIX #29: Don't pre-initialize DrivenTimes
   * Original Lingo: Only created when first driven
   * 
   * @returns {{ Motor: number, Sail: number, Oar: number }}
   */
  getDrivenTimes () {
    if (!this.SeaInventory) {
      this.SeaInventory = { items: {}, blueprints: { Blueprint1: {} } }
    }
    if (!this.SeaInventory.items) {
      this.SeaInventory.items = {}
    }
    
    // Lazy initialization - only create on first access
    if (!this.SeaInventory.items.DrivenTimes) {
      this.SeaInventory.items.DrivenTimes = { Motor: 0, Sail: 0, Oar: 0 }
      console.log('[SaveData] DrivenTimes initialized (lazy)')
    }
    
    return this.SeaInventory.items.DrivenTimes
  }

  /**
   * Increment driven time for a propulsion type
   * 
   * BUG FIX #29: Lazy initialization on first drive
   * 
   * @param {'Motor'|'Sail'|'Oar'} propulsionType - Type of propulsion
   * @returns {number} New count
   */
  incrementDrivenTime (propulsionType) {
    const drivenTimes = this.getDrivenTimes()
    
    if (!drivenTimes[propulsionType]) {
      drivenTimes[propulsionType] = 0
    }
    
    drivenTimes[propulsionType]++
    
    console.log('[SaveData] DrivenTime incremented:', propulsionType, '=', drivenTimes[propulsionType])
    this.save()
    
    return drivenTimes[propulsionType]
  }

  /**
   * Check if player has driven with a specific propulsion type
   * 
   * @param {'Motor'|'Sail'|'Oar'} propulsionType - Type of propulsion
   * @returns {boolean} True if driven at least once
   */
  hasDrivenWith (propulsionType) {
    // Don't initialize if doesn't exist - return false
    if (!this.SeaInventory || !this.SeaInventory.items || !this.SeaInventory.items.DrivenTimes) {
      return false
    }
    
    const drivenTimes = this.SeaInventory.items.DrivenTimes
    return (drivenTimes[propulsionType] || 0) > 0
  }

  // ==========================================================================
  // BOAT PART REWARDS
  // ==========================================================================

  /**
   * Get available external parts for rewards
   * Used by missions that give random parts
   * 
   * @returns {number[]} Array of available part IDs
   */
  getExternalParts () {
    // These are boat parts that can be rewarded by missions
    // Based on original Lingo externalParts list
    // TODO: Load from BoatPartsDB and filter by availability
    const externalParts = [
      // Hulls
      731, 732, 733, 734, 735,
      // Engines
      741, 742, 743, 744,
      // Sails
      751, 752, 753,
      // Accessories
      761, 762, 763, 764, 765
    ]
    
    // Filter out parts player already has
    return externalParts.filter(partId => !this.hasBoatPart(partId))
  }

  /**
   * Get a random available part for rewards
   * Original Lingo: getRandomPart(the externalParts)
   * 
   * @returns {number|null} Part ID or null if no parts available
   */
  getRandomRewardPart () {
    const available = this.getExternalParts()
    if (available.length === 0) return null
    
    const randomIndex = Math.floor(Math.random() * available.length)
    return available[randomIndex]
  }
}

export default MulleSave
