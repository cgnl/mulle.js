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
    this.Saves = []
    this.CompletedMissions = []
    this.OwnStuff = []
    this.myLastPile = 1
    this.gifts = []
    this.toYardThroughDoor = true
    this.givenMissions = []
    this.figgeIsComing = false
    this.missionIsComing = false
    this.savedCars = []
    
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
    this.visitedBoatyard = false      // First visit to boatyard
    this.activeWorld = 'blauwwater'   // Currently selected world

    // Boat data (equivalent to Car)
    this.Boat = new MulleBoat(this.game)

    // Boat junk piles (equivalent to Junk for cars)
    // Based on original Lingo user data: #Junk: []
    // Categories based on boat part properties (similar to car junk piles)
    this.BoatJunk = {
      shopFloor: {},     // Boatyard floor (visible in boatyard scene)
      Category1: {},     // Rompen (hulls)
      Category2: {},     // Motoren (engines)
      Category3: {},     // Zeilen (sails)
      Category4: {},     // Besturing (steering)
      Category5: {},     // Roeispanen (oars)
      Category6: {}      // Accessoires (accessories)
    }
    
    this.myLastBoatPile = 1  // Last visited boat junk category

    // Boat-specific tracking
    this.NrOfBuiltBoats = 0
    this.savedBoats = []
    this.CompletedSeaMissions = []
    
    // Christina Colombus progression system (equivalent to Figge for boats)
    this.ChristinaVisits = 0
    this.ChristinaUnlocks = {
      tier1: false,  // 2+ boats built: 3 parts
      tier2: false,  // 4+ boats built: 4 parts
      tier3: false,  // 7+ boats built: 5 parts
      vip: false     // VIP status marker
    }
    this.christinaIsComing = false  // Flag to trigger Christina visit

    // === SEA INVENTORY & QUEST SYSTEM ===
    // Gebaseerd op originele Lingo user data (boten_CDDATA.CXT/Standalone/1.txt):
    // #Inventory:[#Blueprint1:[:]], #givenMissions: [], #deliveryMade: FALSE, #veryFirstTime: TRUE
    
    // Sea Inventory - quest items en blueprints
    // Items: Bible, Swimring, DoctorBag, Compass, Diary, RottenFish
    this.SeaInventory = {
      items: {},           // { Bible: true, Swimring: true, ... }
      blueprints: {        // Originele Lingo: #Blueprint1:[:]
        Blueprint1: {}
      }
    }

    // Sea Level (1-5) - bepaalt welke pickups zichtbaar zijn
    // Uit CheckFor:[#Level:[2,3,4,5]] in object definities (1953-1955.txt)
    // Level 2+: Bible pickup beschikbaar
    // Level 3+: Swimring, DoctorBag pickups beschikbaar
    this.SeaLevel = 1

    // Given sea missions - voorkomt re-triggering van pickups
    // Originele Lingo: #givenMissions: []
    // Gebruikt in CheckFor:[#NotGivenMissions:[1]] (1953.txt, etc.)
    this.givenSeaMissions = []

    // Delivery tracking - originele Lingo: #deliveryMade: FALSE
    this.deliveryMade = false

    // Very first time flag - originele Lingo: #veryFirstTime: TRUE
    this.veryFirstTime = true

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

  save () {
    console.log('save data', this.UserId)
    window.localStorage.setItem('mulle_SaveData', JSON.stringify(this.game.mulle.UsersDB))
  }

  fromJSON (data) {
    this.UserId = data.UserId

    this.Car = new MulleCar(this.game, data.Car)

    this.Junk = data.Junk

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
    this.visitedBoatyard = data.visitedBoatyard || false
    this.activeWorld = data.activeWorld || 'blauwwater'

    // Boat data
    this.Boat = new MulleBoat(this.game, data.Boat)

    // Boat junk piles - with category structure for boat_junk scene
    this.BoatJunk = data.BoatJunk || {
      shopFloor: {},
      Category1: {},
      Category2: {},
      Category3: {},
      Category4: {},
      Category5: {},
      Category6: {}
    }
    
    this.myLastBoatPile = data.myLastBoatPile || 1

    // Boat tracking
    this.NrOfBuiltBoats = data.NrOfBuiltBoats || 0
    this.savedBoats = data.savedBoats || []
    this.CompletedSeaMissions = data.CompletedSeaMissions || []
    
    // Christina Colombus progression system
    this.ChristinaVisits = data.ChristinaVisits || 0
    this.ChristinaUnlocks = data.ChristinaUnlocks || {
      tier1: false,
      tier2: false,
      tier3: false,
      vip: false
    }
    this.christinaIsComing = data.christinaIsComing || false

    // === SEA INVENTORY & QUEST SYSTEM ===
    // Laden van inventory, level, en quest data
    this.SeaInventory = data.SeaInventory || {
      items: {},
      blueprints: { Blueprint1: {} }
    }
    this.SeaLevel = data.SeaLevel || 1
    this.givenSeaMissions = data.givenSeaMissions || []
    this.deliveryMade = data.deliveryMade || false
    this.veryFirstTime = data.veryFirstTime !== undefined ? data.veryFirstTime : true

    this.language = data.language || this.game.mulle.defaultLanguage
  }

  toJSON () {
    return {
      UserId: this.UserId,
      Car: this.Car,
      Junk: this.Junk,
      NrOfBuiltCars: this.NrOfBuiltCars,
      CompletedMissions: this.CompletedMissions,
      OwnStuff: this.OwnStuff,
      givenMissions: this.givenMissions,
      myLastPile: this.myLastPile,
      savedCars: this.savedCars,
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
      visitedBoatyard: this.visitedBoatyard,
      activeWorld: this.activeWorld,
      Boat: this.Boat,
      BoatJunk: this.BoatJunk,
      myLastBoatPile: this.myLastBoatPile,
      NrOfBuiltBoats: this.NrOfBuiltBoats,
      savedBoats: this.savedBoats,
      CompletedSeaMissions: this.CompletedSeaMissions,
      ChristinaVisits: this.ChristinaVisits,
      ChristinaUnlocks: this.ChristinaUnlocks,
      christinaIsComing: this.christinaIsComing,
      // === SEA INVENTORY & QUEST SYSTEM ===
      SeaInventory: this.SeaInventory,
      SeaLevel: this.SeaLevel,
      givenSeaMissions: this.givenSeaMissions,
      deliveryMade: this.deliveryMade,
      veryFirstTime: this.veryFirstTime,
      language: this.language
    }
  }

  // === SEA INVENTORY & QUEST HELPER METHODS ===

  /**
   * Check if sea mission is given (to prevent re-triggering pickups)
   * Originele Lingo: CheckFor:[#NotGivenMissions:[1]]
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  isSeaMissionGiven (missionId) {
    return this.givenSeaMissions.indexOf(missionId) !== -1
  }

  /**
   * Mark sea mission as given
   * Voorkomt dat pickup opnieuw verschijnt
   * 
   * @param {number} missionId - Mission ID
   */
  giveSeaMission (missionId) {
    if (!this.isSeaMissionGiven(missionId)) {
      this.givenSeaMissions.push(missionId)
      console.log('[SaveData] Sea mission given:', missionId)
      this.save()
    }
  }

  /**
   * Check if sea mission is completed
   * 
   * @param {number} missionId - Mission ID
   * @returns {boolean}
   */
  isSeaMissionCompleted (missionId) {
    return this.CompletedSeaMissions.indexOf(missionId) !== -1
  }

  /**
   * Complete sea mission
   * Originele Lingo: SetWhenDone:[#Missions:[4]]
   * 
   * @param {number} missionId - Mission ID
   */
  completeSeaMission (missionId) {
    if (!this.isSeaMissionCompleted(missionId)) {
      this.CompletedSeaMissions.push(missionId)
      console.log('[SaveData] Sea mission completed:', missionId)
      this.save()
    }
  }

  /**
   * Get current sea level (1-5)
   * @returns {number}
   */
  getSeaLevel () {
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
}

export default MulleSave
