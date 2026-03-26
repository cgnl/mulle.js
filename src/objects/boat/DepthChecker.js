/**
 * DepthChecker.js - Topology/depth checking for collision detection
 * Based on original Lingo: ParentScript 35 - DepthChecker.ls
 *
 * Uses a topology map (string of char codes) to check:
 * - Land collisions (char code 0)
 * - Shallow water warnings (char code 1-3)
 * - Border detection
 *
 * Original Lingo properties:
 * - Topology: string of depth values
 * - topoWidth: 316 (map width)
 * - topoHeight: 198 (map height)
 * - active: whether checking is enabled
 * - depth: required depth level (0-4)
 */
'use strict'

export default class DepthChecker {
  /**
   * Create depth checker
   * Original: on new me
   */
  constructor(topologyProvider = null) {
    // Original: set topoWidth to 316
    this.topoWidth = 316

    // Original: set topoHeight to 198
    this.topoHeight = 198

    // Original: set Topology to EMPTY
    this.Topology = ''

    // Original: set depth to 0
    this.depth = 0

    // Whether depth checking is active
    this.active = false

    // Optional provider for Lingo-style member text lookup:
    // (memberName) => topologyString|null
    this.topologyProvider = topologyProvider
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    return null
  }

  /**
   * Set topology map data
   * Original: on setTopology me, argWhich
   *
   * @param {string} argWhich - Map identifier
   * @param {string} topoData - Topology data string
   */
  setTopology(argWhich, topoData) {
    // Original: if argWhich = "30t999v0" then set active to 0
    if (argWhich === '30t999v0') {
      this.active = false
      this.Topology = ''
    } else {
      this.active = true

      // 1) Explicit topology text wins.
      if (typeof topoData === 'string') {
        this.Topology = topoData
        return
      }

      // 2) Lingo parity: read member(argWhich) + member(argWhich & "-2").
      if (typeof argWhich === 'string' && this.topologyProvider) {
        const part1 = this.topologyProvider(argWhich) || ''
        const part2 = this.topologyProvider(argWhich + '-2') || ''

        if (part1 || part2) {
          this.Topology = part1 + part2
          return
        }
      }

      // 3) Backward-compatible fallback.
      this.Topology = typeof argWhich === 'string' ? argWhich : ''
    }
  }

  /**
   * Set required depth level based on boat draft
   * Original: on setDepth me, argDepth
   *
   * Maps real depth to depth levels 0-4:
   * - < 2: level 0
   * - 2-3: level 1
   * - 4-9: level 2
   * - 10-15: level 3
   * - 16+: level 4
   *
   * @param {number} argDepth - Boat draft depth
   */
  setDepth(argDepth) {
    // Original nested if-else chain
    if (argDepth < 2) {
      this.depth = 0
    } else if (argDepth < 4) {
      this.depth = 1
    } else if (argDepth < 10) {
      this.depth = 2
    } else if (argDepth < 16) {
      this.depth = 3
    } else {
      this.depth = 4
    }
  }

  /**
   * Check if location is at map border
   * Original: on checkBorders me, argLoc
   *
   * @param {{x: number, y: number}} argLoc - Screen position
   * @returns {{x: number, y: number}|number} Border direction or 0
   */
  checkBorders(argLoc) {
    // Original: set argLoc to (argLoc - point(4, 4)) / 2
    const tmpH = (argLoc.x - 4) / 2
    const tmpV = (argLoc.y - 4) / 2

    // Original: set tmpBorderWidth to 4
    const tmpBorderWidth = 4

    // Check each border
    // Original: if tmpH < (1 + tmpBorderWidth) then return point(-1, 0)
    if (tmpH < (1 + tmpBorderWidth)) {
      return { x: -1, y: 0 }
    } else if (tmpH > (this.topoWidth - tmpBorderWidth)) {
      return { x: 1, y: 0 }
    } else if (tmpV < (1 + tmpBorderWidth)) {
      return { x: 0, y: -1 }
    } else if (tmpV > (this.topoHeight - tmpBorderWidth)) {
      return { x: 0, y: 1 }
    }

    return 0
  }

  /**
   * Check depth at location with corner points
   * Original: on checkDepth me, argLoc, argCornerPoints
   *
   * @param {{x: number, y: number}} argLoc - Screen position
   * @param {Array<{x: number, y: number}>} [argCornerPoints] - Collision points to check
   * @returns {string|number} 'Hit', 'Shallow', 1 (too shallow), or 0 (ok)
   */
  checkDepth(argLoc, argCornerPoints) {
    // Original: if not active then return 0
    if (!this.active) {
      return 0
    }

    // Original: set argLoc to (argLoc - point(4, 4)) / 2
    const baseH = (argLoc.x - 4) / 2
    const baseV = (argLoc.y - 4) / 2

    // Original: if voidp(argCornerPoints) then set argCornerPoints to [point(0, 0)]
    if (!argCornerPoints) {
      argCornerPoints = [{ x: 0, y: 0 }]
    }

    // Check each corner point
    for (const tmpPoint of argCornerPoints) {
      // Original: set tmpH to getAt(argLoc, 1) + getAt(tmpPoint, 1)
      // Original: set tmpV to getAt(argLoc, 2) + getAt(tmpPoint, 2)
      const tmpH = Math.floor(baseH + tmpPoint.x)
      const tmpV = Math.floor(baseV + tmpPoint.y)

      // Original Lingo line 78: char (tmpH + ((tmpV - 1) * topoWidth)) of Topology
      // Lingo char is 1-indexed, JS charCodeAt is 0-indexed.
      // Lingo tmpH is 1-indexed (from getAt on point), so we need (tmpH - 1) for JS.
      // The formula: Lingo index = tmpH + (tmpV-1)*width (1-indexed)
      //              JS index    = (tmpH-1) + (tmpV-1)*width (0-indexed)
      const index = (tmpH - 1) + ((tmpV - 1) * this.topoWidth)

      if (index < 0 || index >= this.Topology.length) {
        // Out of bounds - treat as land
        return 'Hit'
      }

      const tmpInfo = this.Topology.charCodeAt(index)

      // Original: if tmpInfo = 0 then return #Hit
      if (tmpInfo === 0) {
        return 'Hit'
      }

      // Original: if tmpInfo < 4 then
      //   if tmpInfo < depth then return 1
      //   if tmpInfo = depth then return #Shallow
      if (tmpInfo < 4) {
        if (tmpInfo < this.depth) {
          return 1 // Too shallow
        }
        if (tmpInfo === this.depth) {
          return 'Shallow'
        }
      }
    }

    return 0
  }
}
