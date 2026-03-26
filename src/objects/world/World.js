/**
 * World.js - Single world data and map grid
 * Based on original Lingo: ParentScript 137 - World.ls
 *
 * Manages a single game world:
 * - Map grid (2D array of map IDs)
 * - Start position and direction
 * - Random destination assignment
 * - Current map tracking
 *
 * Original Lingo properties:
 * - WorldId: World identifier
 * - map: 2D array of map IDs
 * - symbol: World symbol/name
 * - StartMap: Starting map coordinate
 * - currentMap: Current map coordinate
 * - StartCoordinate: Starting position within map
 * - StartDirection: Starting direction (1-16)
 * - enteredObjectId: Last entered object
 * - rDests: Randomized destination assignments
 * - allRDests: All possible destination locations
 * - symbolPosition: Position in world list
 */
'use strict'

export default class World {
  /**
   * Create world
   * Original: on new me
   */
  constructor() {
    // Original: set WorldId to EMPTY
    this.WorldId = ''

    // Original: set map to []
    this.map = []

    // Original: set symbol to EMPTY
    this.symbol = ''

    // Original: set StartMap to point(0, 0)
    this.StartMap = { x: 0, y: 0 }

    // Original: set StartCoordinate to point(0, 0)
    this.StartCoordinate = { x: 0, y: 0 }

    // Original: set StartDirection to 0
    this.StartDirection = 0

    // Original: set enteredObjectId to 0
    this.enteredObjectId = 0

    // Original: set rDests to [:]
    this.rDests = {}

    // Original: set allRDests to [:]
    this.allRDests = {}

    // Original: set symbolPosition to 0
    this.symbolPosition = 0

    // Current map position
    this.currentMap = { x: 0, y: 0 }
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    this.map = 0
    return 0
  }

  /**
   * Get world ID
   * Original: on getId me
   */
  getId() {
    return this.WorldId
  }

  /**
   * Get symbol position
   * Original: on getPosition me
   */
  getPosition() {
    return this.symbolPosition
  }

  /**
   * Set entered object ID
   * Original: on enteredObject me, theid
   */
  enteredObject(id) {
    this.enteredObjectId = id
  }

  /**
   * Get entered object ID
   * Original: on getEnteredObject me, theid
   */
  getEnteredObject() {
    return this.enteredObjectId
  }

  /**
   * Get start info
   * Original: on getStartInfo me
   */
  getStartInfo() {
    return {
      map: this.StartMap,
      coordinate: this.StartCoordinate,
      direction: this.StartDirection,
      fuel: 'Full'
    }
  }

  /**
   * Get world symbol
   * Original: on getSymbol me
   */
  getSymbol() {
    return this.symbol
  }

  /**
   * Get world size
   * Original: on getWorldSize me
   */
  getWorldSize() {
    if (this.map.length === 0) {
      return { x: 0, y: 0 }
    }

    // Original: point(count(getAt(map, 1)), count(map))
    return {
      x: this.map[0].length,
      y: this.map.length
    }
  }

  /**
   * Get current map ID
   * Original: on getCurrentMapId me
   */
  getCurrentMapId() {
    const y = this.currentMap.y
    const x = this.currentMap.x

    // Original: if (tempY >= 1) and (tempY <= count(map))
    if (y < 1 || y > this.map.length) {
      return 'InvalidYIndex'
    }

    const row = this.map[y - 1]  // Lingo is 1-indexed

    // Original: if (tempX >= 1) and (tempX <= count(tempList))
    if (x < 1 || x > row.length) {
      return 'InvalidXIndex'
    }

    return row[x - 1]  // Lingo is 1-indexed
  }

  /**
   * Get new map ID and optionally update current position
   * Original: on getNewMapId me, thePoint, theMode, theJustCheck
   * @param {Object} point - Target point {x, y}
   * @param {string} mode - 'Relational' or 'Absolute'
   * @param {boolean} justCheck - If true, don't update currentMap
   */
  getNewMapId(point, mode, justCheck) {
    let targetPoint = { ...point }

    // Original: if theMode = #Relational then set thePoint to thePoint + currentMap
    if (mode === 'Relational') {
      targetPoint = {
        x: point.x + this.currentMap.x,
        y: point.y + this.currentMap.y
      }
    }

    // Original: if (getAt(thePoint, 2) >= 1) and (getAt(thePoint, 2) <= count(map))
    if (targetPoint.y < 1 || targetPoint.y > this.map.length) {
      return 'InvalidYIndex'
    }

    const row = this.map[targetPoint.y - 1]  // Lingo is 1-indexed

    // Original: if (getAt(thePoint, 1) >= 1) and (getAt(thePoint, 1) <= count(tempList))
    if (targetPoint.x < 1 || targetPoint.x > row.length) {
      return 'InvalidXIndex'
    }

    // Original: if not (theJustCheck = 1) then set currentMap to thePoint
    if (!justCheck) {
      this.currentMap = { ...targetPoint }
    }

    return row[targetPoint.x - 1]  // Lingo is 1-indexed
  }

  /**
   * Randomize destination assignments
   * Original: on randomizeDestinations me
   */
  randomizeDestinations() {
    this.rDests = {}
    const usedLocs = []

    // Original: repeat with N = 1 to count(allRDests)
    for (const [destId, locations] of Object.entries(this.allRDests)) {
      // Create shuffled copy of locations
      const shuffled = [...locations]
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
      }

      // Find first unused location
      let foundLoc = null
      for (const loc of shuffled) {
        const isUsed = usedLocs.some(used =>
          used.x === loc.x && used.y === loc.y
        )
        if (!isUsed) {
          foundLoc = loc
          break
        }
      }

      if (foundLoc) {
        usedLocs.push(foundLoc)
        this.rDests[destId] = foundLoc
      }
    }
  }

  /**
   * Get random destinations
   * Original: on getRandomDestinations me
   */
  getRandomDestinations() {
    return this.rDests
  }

  /**
   * Serialize to list
   * Original: on toList me
   */
  toList() {
    return {
      WorldId: this.WorldId,
      map: this.map,
      symbol: this.symbol,
      StartMap: this.StartMap,
      StartCoordinate: this.StartCoordinate,
      StartDirection: this.StartDirection,
      symbolPosition: this.symbolPosition
    }
  }

  /**
   * Deserialize from list/data
   * Original: on fromList me, theid
   * @param {Object|string} data - World data object or world ID
   */
  fromList(data) {
    if (typeof data === 'string') {
      // Original loads from member, we expect data object
      return false
    }

    this.WorldId = data.WorldId || ''
    this.map = data.map || []
    this.symbol = data.symbol || ''
    this.StartMap = data.StartMap || { x: 0, y: 0 }
    this.currentMap = { ...this.StartMap }
    this.StartCoordinate = data.StartCoordinate || { x: 0, y: 0 }
    this.StartDirection = data.StartDirection || 0
    this.symbolPosition = data.symbolPosition || 0

    if (data.allRDests) {
      this.allRDests = data.allRDests
    }

    return true
  }
}
