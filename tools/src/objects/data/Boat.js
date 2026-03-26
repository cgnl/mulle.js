/**
 * Boat.js - Boat configuration and parts management
 * Based on original Lingo: ParentScript 11 - Boat.ls
 *
 * Manages boat parts, snap points, properties, and medals:
 * - Part list and snap point management
 * - Property aggregation from parts
 * - Medal tracking
 * - Serialization for save/load
 *
 * Original Lingo properties:
 * - parts: List of part IDs
 * - name: Boat name
 * - medals: Earned medals
 * - boatProperties: Aggregated properties from parts
 * - boatSnapPoints: Available snap points
 * - boatSnapOffsets: Snap point offset data
 * - newBoatName: Default name for new boats
 */
'use strict'

export default class Boat {
  /**
   * Create boat
   * Original: on new me
   * @param {Object} partsManager - Parts manager (gMulleGlobals.parts)
   */
  constructor(partsManager) {
    this.partsManager = partsManager

    // Original: set parts to []
    this.parts = []

    // Original: set name to EMPTY
    this.name = ''

    // Original: set medals to []
    this.medals = []

    // Original: set boatProperties to [:]
    this.boatProperties = {}

    // Original: set boatSnapPoints to []
    this.boatSnapPoints = []

    // Original: set boatSnapOffsets to [:]
    this.boatSnapOffsets = {}

    // Original: set newBoatName to the text of member "00t001v0"
    this.newBoatName = 'New Boat'
  }

  /**
   * Kill/cleanup
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    this.parts = 0
    this.medals = 0
    this.boatProperties = 0
    this.boatSnapPoints = 0
    this.boatSnapOffsets = 0
    return 0
  }

  /**
   * Check if snap points are free
   * Original: on areTheseFree me, theList
   */
  areTheseFree(pointList) {
    if (!pointList || pointList.length === 0) {
      return false
    }

    for (const point of pointList) {
      if (!this.boatSnapPoints.includes(point)) {
        return false
      }
    }

    return true
  }

  /**
   * Delete part by ID
   * Original: on deletePart me, partId
   */
  deletePart(partId) {
    const index = this.parts.indexOf(partId)
    if (index !== -1) {
      this.parts.splice(index, 1)
    }
  }

  /**
   * Rebuild snap points from parts
   * Original: on rebuild me
   */
  rebuild() {
    const tempParts = [...this.parts]
    this.parts = []
    this.boatSnapPoints = []
    this.boatSnapOffsets = {}

    for (const partId of tempParts) {
      this.addPart(partId)
    }
  }

  /**
   * Find part in boat (including morphs)
   * Original: on findPart me, partId
   */
  findPart(partId) {
    if (!this.partsManager) return false

    const part = this.partsManager.getPart(partId)
    if (!part) return false

    let morphs = part.getMorphList ? part.getMorphList() : null
    if (!morphs || !Array.isArray(morphs)) {
      morphs = [partId]
    }

    for (const morphId of morphs) {
      if (this.parts.includes(morphId)) {
        return true
      }
    }

    return false
  }

  /**
   * Check if part is in boat
   * Original: on isBoatPart me, argPartID
   */
  isBoatPart(partId) {
    const partList = []

    for (const pid of this.parts) {
      let effectiveId = pid

      if (this.partsManager) {
        const partObj = this.partsManager.getPart(pid)
        if (partObj && partObj.getMaster) {
          const masterId = partObj.getMaster()
          if (typeof masterId === 'number' && masterId > 0) {
            effectiveId = masterId
          }
        }
      }

      partList.push(effectiveId)
    }

    return partList.includes(partId)
  }

  /**
   * Clear boat name and medals
   * Original: on clearBoat me
   */
  clearBoat() {
    this.name = this.newBoatName
    this.medals = []
  }

  /**
   * Trash boat - return parts to junk
   * Original: on trash me
   */
  trash() {
    // Note: In full implementation, would return parts to junk yard
    // except hull and rudder

    this.parts = []
    this.boatSnapOffsets = {}
    this.boatProperties = {}
    this.boatSnapPoints = []
    this.clearBoat()
  }

  /**
   * Add medal
   * Original: on addMedal me, newMedalId
   */
  addMedal(medalId) {
    if (!this.medals.includes(medalId)) {
      this.medals.push(medalId)
    }
  }

  /**
   * Check if has medal
   * Original: on getMedal me, medalId
   */
  getMedal(medalId) {
    return this.medals.includes(medalId)
  }

  /**
   * Get snap point info
   * Original: on getSnapInfo me, snapPoint, what
   */
  getSnapInfo(snapPoint, what) {
    const info = this.boatSnapOffsets[snapPoint]
    if (!info) return undefined

    if (what === 'layers') {
      return info[0]
    } else if (what === 'offset') {
      return info[1]
    }

    return info
  }

  /**
   * Add part to boat
   * Original: on addPart me, newPartId
   */
  addPart(partId) {
    this.parts.push(partId)

    if (!this.partsManager) return

    const part = this.partsManager.getPart(partId)
    if (!part) return

    // Remove covered points
    const coversPoints = part.getCoveredPoints ? part.getCoveredPoints() : null
    if (Array.isArray(coversPoints)) {
      for (const point of coversPoints) {
        const index = this.boatSnapPoints.indexOf(point)
        if (index !== -1) {
          this.boatSnapPoints.splice(index, 1)
        }
      }
    }

    // Add new points
    const newPoints = part.getNewPoints ? part.getNewPoints() : null
    if (Array.isArray(newPoints)) {
      // Get snap offset from required points
      let snapOffset = { x: 0, y: 0 }
      const reqSnaps = part.getRequiredPoints ? part.getRequiredPoints() : null
      if (Array.isArray(reqSnaps) && reqSnaps.length > 0) {
        const firstSnapPoint = reqSnaps[0]
        const existingOffset = this.getSnapInfo(firstSnapPoint, 'offset')
        if (existingOffset) {
          snapOffset = existingOffset
        }
      }

      for (const pointData of newPoints) {
        const snapId = pointData[0]
        const layers = pointData[1]
        const offset = pointData[2] || { x: 0, y: 0 }

        this.boatSnapPoints.push(snapId)
        this.boatSnapOffsets[snapId] = [
          layers,
          {
            x: (offset.x || 0) + (snapOffset.x || 0),
            y: (offset.y || 0) + (snapOffset.y || 0)
          }
        ]
      }
    }
  }

  /**
   * Remove part from boat
   * Original: on removePart me, partId
   */
  removePart(partId) {
    const index = this.parts.indexOf(partId)
    if (index === -1) return

    this.parts.splice(index, 1)

    if (!this.partsManager) return

    const part = this.partsManager.getPart(partId)
    if (!part) return

    // Restore covered points
    const coversPoints = part.getCoveredPoints ? part.getCoveredPoints() : null
    if (Array.isArray(coversPoints)) {
      for (const point of coversPoints) {
        this.boatSnapPoints.push(point)
      }
    }

    // Remove new points
    const newPoints = part.getNewPoints ? part.getNewPoints() : null
    if (Array.isArray(newPoints)) {
      for (const pointData of newPoints) {
        const snapId = pointData[0]
        const snapIndex = this.boatSnapPoints.indexOf(snapId)
        if (snapIndex !== -1) {
          this.boatSnapPoints.splice(snapIndex, 1)
        }
        delete this.boatSnapOffsets[snapId]
      }
    }
  }

  /**
   * Replace one part with another
   * Original: on replacePart me, argFromPart, argToPart
   */
  replacePart(fromPart, toPart) {
    const index = this.parts.indexOf(fromPart)
    if (index !== -1) {
      this.parts[index] = toPart
    }
  }

  /**
   * Get current load capacity
   * Original: on getCurrentLoadCapacity me
   */
  getCurrentLoadCapacity() {
    const hullId = this.getHull()

    if (hullId === 'NoHull') {
      return 0
    }

    if (!this.partsManager) return 0

    const hullObj = this.partsManager.getPart(hullId)
    if (!hullObj) return 0

    const hullWeight = hullObj.getProperty ? hullObj.getProperty('weight') : 0
    if (hullWeight === undefined) return 0

    const boatWeight = this.boatProperties.weight
    if (boatWeight === undefined) return 0

    const loadCapacity = this.boatProperties.LoadCapacity
    if (loadCapacity === undefined) return 0

    return loadCapacity - (boatWeight - hullWeight)
  }

  /**
   * Get parts list
   * Original: on getParts me
   */
  getParts() {
    return this.parts
  }

  /**
   * Set boat name
   * Original: on setName me, newName
   */
  setName(name) {
    this.name = name
  }

  /**
   * Get boat name
   * Original: on getName me
   */
  getName() {
    return this.name
  }

  /**
   * Get hull part ID
   * Original: on getHull me
   */
  getHull() {
    // In full implementation, would query boatViewHandler
    // For now, find hull in parts
    return 'NoHull'
  }

  /**
   * Get rudder part ID
   * Original: on getRudder me
   */
  getRudder() {
    // In full implementation, would query boatViewHandler
    return null
  }

  /**
   * Get snap points
   * Original: on getSnapPoints me
   */
  getSnapPoints() {
    return this.boatSnapPoints
  }

  /**
   * Update properties from all parts
   * Original: on updateProperties me
   */
  updateProperties() {
    this.boatProperties = {}

    if (!this.partsManager) return

    for (const partId of this.parts) {
      const part = this.partsManager.getPart(partId)
      if (!part) continue

      const partProps = part.getPropertyList ? part.getPropertyList() : {}

      for (const [propName, propValue] of Object.entries(partProps)) {
        if (this.boatProperties[propName] === undefined) {
          this.boatProperties[propName] = propValue
        } else {
          this.boatProperties[propName] += propValue
        }
      }
    }
  }

  /**
   * Get boat property
   * Original: on getProperty me, argProp
   */
  getProperty(prop) {
    return this.boatProperties[prop]
  }

  /**
   * Serialize to list
   * Original: on toList me
   */
  toList() {
    return {
      parts: this.parts,
      name: this.name,
      medals: this.medals
    }
  }

  /**
   * Deserialize from list
   * Original: on fromList me, objectList
   */
  fromList(data) {
    const tempParts = data.parts || []
    this.name = data.name || ''
    this.medals = data.medals || []

    this.parts = []
    this.boatSnapOffsets = {}
    this.boatSnapPoints = []

    for (const partId of tempParts) {
      this.addPart(partId)
    }
  }
}
