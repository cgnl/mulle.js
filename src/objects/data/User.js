/**
 * User.js - Player state management
 * Based on original Lingo: ParentScript 10 - User.ls
 *
 * Manages all player data including:
 * - User identity (id, name)
 * - Boat and saved boats
 * - Junk yard inventory
 * - Missions (given, completed)
 * - Game inventory
 * - Gifts
 *
 * Original Lingo properties:
 * - userId, userName: User identity
 * - boat: Current boat object
 * - junk: Parts in junk yard/shelves
 * - nrOfBuiltBoats: Count of boats built
 * - Saves: Saved boat configurations
 * - completedMissions: Completed mission data
 * - Inventory: Game inventory items
 * - givenMissions: Currently assigned missions
 * - deliveryMade: Delivery status
 * - gifts: Gift items
 * - drivingInfo: Saved driving state
 * - veryFirstTime: First play flag
 */
'use strict'

export default class User {
  /**
   * Create user
   * Original: on new me
   */
  constructor() {
    // Original: set userId to EMPTY
    this.userId = ''

    // Original: set userName to EMPTY
    this.userName = ''

    // Original: set boat to new(script "Boat")
    this.boat = this._createBoat()

    // Original: set junk to []
    this.junk = []

    // Original: set nrOfBuiltBoats to 0
    this.nrOfBuiltBoats = 0

    // Original: set Saves to []
    this.Saves = []

    // Original: set completedMissions to [:]
    this.completedMissions = {}

    // Original: set Inventory to [:]
    this.Inventory = {}

    // Original: set givenMissions to []
    this.givenMissions = []

    // Original: set deliveryMade to 0
    this.deliveryMade = 0

    // Original: set gifts to []
    this.gifts = []

    // Original: set drivingInfo to 0
    this.drivingInfo = 0

    // Original: set veryFirstTime to 1
    this.veryFirstTime = true
  }

  /**
   * Create boat instance (lazy loading)
   * @private
   */
  _createBoat() {
    // Will be replaced with actual Boat class when available
    return {
      boatProperties: {},
      parts: [],
      isBoatPart: () => false,
      toList: () => ({}),
      fromList: () => {},
      kill: () => null
    }
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    // Original: set boat to kill(boat)
    if (this.boat && typeof this.boat.kill === 'function') {
      this.boat.kill()
    }
    this.boat = 0

    // Original: set junk to 0
    this.junk = 0

    // Original: set Saves to 0
    this.Saves = 0

    // Original: set completedMissions to 0
    this.completedMissions = 0

    // Original: set Inventory to 0
    this.Inventory = 0

    // Original: set gifts to 0
    this.gifts = 0

    return 0
  }

  /**
   * Get user ID
   * Original: on getUserId me
   */
  getUserId() {
    return this.userId
  }

  /**
   * Set user ID
   * Original: on setUserId me, argID
   */
  setUserId(id) {
    this.userId = id
  }

  /**
   * Get user name
   * Original: on getUserName me
   */
  getUserName() {
    return this.userName
  }

  /**
   * Set user name
   * Original: on setUserName me, argName
   */
  setUserName(name) {
    this.userName = name
  }

  /**
   * Check if first time playing
   * Original: on isItTheVeryFirstTime me
   */
  isItTheVeryFirstTime() {
    return this.veryFirstTime
  }

  /**
   * Get boat object
   * Original: on getBoat me
   */
  getBoat() {
    return this.boat
  }

  /**
   * Get number of boats built
   * Original: on getNrOfBuiltBoats me
   */
  getNrOfBuiltBoats() {
    return this.nrOfBuiltBoats
  }

  /**
   * Increment built boats count
   * Original: on addNrOfBuiltBoats me
   */
  addNrOfBuiltBoats() {
    this.nrOfBuiltBoats++
  }

  /**
   * Get driving info
   * Original: on getDrivingInfo me
   */
  getDrivingInfo() {
    return this.drivingInfo
  }

  /**
   * Set driving info
   * Original: on setDrivingInfo me, argNewInfo
   */
  setDrivingInfo(info) {
    this.drivingInfo = info
  }

  /**
   * Get junk for place
   * Original: on getJunk me, argPlace
   */
  getJunk(place) {
    return this.junk[place]
  }

  /**
   * Check if part is in junk
   * Original: on isJunkPart me, argPartID
   */
  isJunkPart(partId) {
    if (!this.junk || typeof this.junk !== 'object') {
      return false
    }

    // Original: repeat through all junk locations
    for (const place of Object.values(this.junk)) {
      if (place && typeof place === 'object') {
        if (partId in place) {
          return true
        }
      }
    }

    return false
  }

  /**
   * Remove part from junk
   * Original: on removeJunkPart me, argFromWhere, argPartID
   */
  removeJunkPart(fromWhere, partId) {
    if (fromWhere && typeof fromWhere === 'string') {
      // Remove from specific place
      const junkPlace = this.junk[fromWhere]
      if (junkPlace) {
        delete junkPlace[partId]
      }
    } else {
      // Find and remove from any place
      for (const place of Object.keys(this.junk)) {
        const junkPlace = this.junk[place]
        if (junkPlace && partId in junkPlace) {
          delete junkPlace[partId]
          break
        }
      }
    }
  }

  /**
   * Add part to junk
   * Original: on addJunkPart me, argToWhere, argPartID, argLoc
   */
  addJunkPart(toWhere, partId, loc) {
    const junkPlace = this.junk[toWhere]

    if (!junkPlace) {
      return false
    }

    // Check for duplicate
    if (partId in junkPlace) {
      return false
    }

    // Add part
    junkPlace[partId] = loc || { x: 0, y: 0 }
    return true
  }

  /**
   * Add new part (handles overflow)
   * Original: on addNewPart me, argPartID
   */
  addNewPart(partId) {
    if (this.gotPart(partId)) {
      return false
    }

    // Simplified - just add to Yard
    return this.addJunkPart('Yard', partId)
  }

  /**
   * Get junk part property
   * Original: on getJunkPartProp me, where, partId
   */
  getJunkPartProp(where, partId) {
    const junkPlace = this.junk[where]
    return junkPlace ? junkPlace[partId] : undefined
  }

  /**
   * Set junk part property
   * Original: on setJunkPartProp me, where, partId, Info
   */
  setJunkPartProp(where, partId, info) {
    const junkPlace = this.junk[where]
    if (junkPlace) {
      junkPlace[partId] = info
    }
  }

  /**
   * Initialize junk from data
   * Original: on initJunk me
   */
  initJunk(data) {
    this.junk = data || {}
  }

  /**
   * Get completed mission info
   * Original: on getCompletedMissionInfo me, argMissionID, argInfoType
   */
  getCompletedMissionInfo(missionId, infoType) {
    const info = this.completedMissions[missionId]

    if (infoType && info) {
      return info[infoType]
    }

    return info
  }

  /**
   * Set completed mission info
   * Original: on setCompletedMissionInfo me, argMissionID, argInfo
   */
  setCompletedMissionInfo(missionId, info) {
    const existing = this.completedMissions[missionId]

    if (existing && typeof info === 'object') {
      Object.assign(existing, info)
    }
  }

  /**
   * Add completed mission
   * Original: on addCompletedMission me, theid
   */
  addCompletedMission(missionId) {
    const existing = this.completedMissions[missionId]

    if (!existing) {
      this.completedMissions[missionId] = { count: 1 }
    } else {
      existing.count++
    }

    // Remove from given missions
    const index = this.givenMissions.indexOf(missionId)
    if (index !== -1) {
      this.givenMissions.splice(index, 1)
    }
  }

  /**
   * Check if mission is completed
   * Original: on isMissionCompleted me, theid
   */
  isMissionCompleted(missionId) {
    return missionId in this.completedMissions
  }

  /**
   * Add given mission
   * Original: on addGivenMission me, theid
   */
  addGivenMission(missionId) {
    if (!this.givenMissions.includes(missionId)) {
      this.givenMissions.push(missionId)
    }
  }

  /**
   * Check if mission is given
   * Original: on isMissionGiven me, theid
   */
  isMissionGiven(missionId) {
    return this.givenMissions.includes(missionId)
  }

  /**
   * Check if item in inventory
   * Original: on isInInventory me, argProp
   */
  isInInventory(prop) {
    return prop in this.Inventory
  }

  /**
   * Look up inventory item
   * Original: on lookUpInventory me, argProp
   */
  lookUpInventory(prop) {
    return this.Inventory[prop]
  }

  /**
   * Delete from inventory
   * Original: on deleteFromInventory me, argProp
   */
  deleteFromInventory(prop) {
    delete this.Inventory[prop]
  }

  /**
   * Set inventory item
   * Original: on setInInventory me, argProp, argVal
   */
  setInInventory(prop, val) {
    this.Inventory[prop] = val
  }

  /**
   * Clear inventory items matching criteria
   * Original: on clearInventory me, argWhich
   */
  clearInventory(which) {
    const criteria = Array.isArray(which) ? which : [which]
    const toDelete = []

    for (const [key, val] of Object.entries(this.Inventory)) {
      if (typeof val === 'object') {
        for (const criterion of criteria) {
          if (val[criterion]) {
            toDelete.push(key)
            break
          }
        }
      }
    }

    for (const key of toDelete) {
      delete this.Inventory[key]
    }
  }

  /**
   * Save boat to slot
   * Original: on saveBoat me, which
   */
  saveBoat(which) {
    if (which > 0) {
      const boatData = this.boat.toList ? this.boat.toList() : {}
      this.Saves[which - 1] = { ...boatData }
    }
  }

  /**
   * Load boat from slot
   * Original: on loadBoat me, which
   */
  loadBoat(which) {
    if (which > 0 && which <= this.Saves.length) {
      const saved = this.Saves[which - 1]
      if (saved && this.boat.fromList) {
        this.boat.fromList(saved)
      }
    }
  }

  /**
   * Change saved boat name
   * Original: on changeBoatName me, which, newName
   */
  changeBoatName(which, newName) {
    if (which > 0 && which <= this.Saves.length) {
      const saved = this.Saves[which - 1]
      if (saved) {
        saved.name = newName
      }
    }
  }

  /**
   * Get saved boats
   * Original: on getSavedBoats me, which
   */
  getSavedBoats(which) {
    if (which === 'All') {
      return this.Saves
    }

    if (typeof which === 'number' && which > 0 && which <= this.Saves.length) {
      return this.Saves[which - 1]
    }

    return 0
  }

  /**
   * Check if player has part
   * Original: on gotPart me, partId
   */
  gotPart(partId) {
    return this.isJunkPart(partId) ||
           (this.boat && this.boat.isBoatPart && this.boat.isBoatPart(partId)) ||
           this.gifts.includes(partId)
  }

  /**
   * Serialize to list
   * Original: on toList me
   */
  toList() {
    return {
      userId: this.userId,
      userName: this.userName,
      boat: this.boat.toList ? this.boat.toList() : {},
      junk: this.junk,
      nrOfBuiltBoats: this.nrOfBuiltBoats,
      Saves: this.Saves,
      completedMissions: this.completedMissions,
      Inventory: this.Inventory,
      givenMissions: this.givenMissions,
      deliveryMade: this.deliveryMade,
      gifts: this.gifts,
      veryFirstTime: this.veryFirstTime
    }
  }

  /**
   * Deserialize from list
   * Original: on fromList me, objectList
   */
  fromList(data) {
    this.userId = data.userId || ''
    this.userName = data.userName || ''

    if (data.boat && this.boat && this.boat.fromList) {
      this.boat.fromList(data.boat)
    }

    this.junk = data.junk || []
    this.nrOfBuiltBoats = data.nrOfBuiltBoats || 0
    this.Saves = data.Saves || []
    this.completedMissions = data.completedMissions || {}
    this.Inventory = data.Inventory || {}
    this.givenMissions = data.givenMissions || []
    this.deliveryMade = data.deliveryMade || 0
    this.gifts = data.gifts || []
    this.veryFirstTime = data.veryFirstTime !== undefined ? data.veryFirstTime : true
  }
}
