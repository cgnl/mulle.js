/**
 * DepthChecker.test.js - TDD tests based on original Lingo DepthChecker.ls (ParentScript 35)
 *
 * Handles depth/topology checking for collision detection.
 *
 * Original Lingo properties:
 * - Topology: string of depth values (char codes)
 * - topoWidth: 316
 * - topoHeight: 198
 * - active: whether depth checking is active
 * - depth: current required depth level (0-4)
 */
'use strict'

import DepthChecker from '../DepthChecker'

describe('DepthChecker', () => {
  let checker

  beforeEach(() => {
    checker = new DepthChecker()
  })

  describe('constructor (new me)', () => {
    test('should initialize topoWidth to 316', () => {
      expect(checker.topoWidth).toBe(316)
    })

    test('should initialize topoHeight to 198', () => {
      expect(checker.topoHeight).toBe(198)
    })

    test('should initialize Topology to empty', () => {
      expect(checker.Topology).toBe('')
    })

    test('should initialize depth to 0', () => {
      expect(checker.depth).toBe(0)
    })

    test('should keep topologyProvider when supplied', () => {
      const provider = jest.fn()
      const withProvider = new DepthChecker(provider)
      expect(withProvider.topologyProvider).toBe(provider)
    })
  })

  describe('kill (on kill me)', () => {
    test('should return null', () => {
      expect(checker.kill()).toBeNull()
    })
  })

  describe('setTopology (on setTopology me, argWhich)', () => {
    test('should set active to false for empty map', () => {
      // Original: if argWhich = "30t999v0" then set active to 0
      checker.Topology = 'PREV'
      checker.setTopology('30t999v0', '')

      expect(checker.active).toBe(false)
      expect(checker.Topology).toBe('')
    })

    test('should set active to true for valid map', () => {
      checker.setTopology('some_map', 'topology_data')

      expect(checker.active).toBe(true)
    })

    test('should store topology data', () => {
      const topoData = 'AAABBBCCC'
      checker.setTopology('some_map', topoData)

      expect(checker.Topology).toBe(topoData)
    })

    test('should accept single-argument topology text call', () => {
      const topoData = 'TOPOLOGY_DIRECT_STRING'
      checker.setTopology(topoData)

      expect(checker.active).toBe(true)
      expect(checker.Topology).toBe(topoData)
    })

    test('should concatenate provider topology with "-2" suffix (Lingo parity)', () => {
      const provider = jest.fn((name) => {
        if (name === '30t029v0') return 'AAA'
        if (name === '30t029v0-2') return 'BBB'
        return null
      })
      const withProvider = new DepthChecker(provider)

      withProvider.setTopology('30t029v0')

      expect(withProvider.active).toBe(true)
      expect(withProvider.Topology).toBe('AAABBB')
      expect(provider).toHaveBeenCalledWith('30t029v0')
      expect(provider).toHaveBeenCalledWith('30t029v0-2')
    })

    test('should fallback to argWhich when provider returns no data', () => {
      const withProvider = new DepthChecker(() => null)

      withProvider.setTopology('30t123v0')

      expect(withProvider.Topology).toBe('30t123v0')
    })
  })

  describe('setDepth (on setDepth me, argDepth)', () => {
    test('should set depth to 0 for argDepth < 2', () => {
      checker.setDepth(1)
      expect(checker.depth).toBe(0)

      checker.setDepth(0)
      expect(checker.depth).toBe(0)
    })

    test('should set depth to 1 for argDepth 2-3', () => {
      checker.setDepth(2)
      expect(checker.depth).toBe(1)

      checker.setDepth(3)
      expect(checker.depth).toBe(1)
    })

    test('should set depth to 2 for argDepth 4-9', () => {
      checker.setDepth(4)
      expect(checker.depth).toBe(2)

      checker.setDepth(9)
      expect(checker.depth).toBe(2)
    })

    test('should set depth to 3 for argDepth 10-15', () => {
      checker.setDepth(10)
      expect(checker.depth).toBe(3)

      checker.setDepth(15)
      expect(checker.depth).toBe(3)
    })

    test('should set depth to 4 for argDepth >= 16', () => {
      checker.setDepth(16)
      expect(checker.depth).toBe(4)

      checker.setDepth(100)
      expect(checker.depth).toBe(4)
    })
  })

  describe('checkBorders (on checkBorders me, argLoc)', () => {
    test('should return left border point(-1, 0) when too far left', () => {
      // Original: argLoc = (argLoc - point(4, 4)) / 2
      // tmpBorderWidth = 4, check if tmpH < 1 + 4 = 5
      // Input loc 10 -> (10-4)/2 = 3, which is < 5
      const result = checker.checkBorders({ x: 10, y: 200 })

      expect(result).toEqual({ x: -1, y: 0 })
    })

    test('should return right border point(1, 0) when too far right', () => {
      // Check if tmpH > topoWidth - 4 = 312
      // Input loc 630 -> (630-4)/2 = 313, which is > 312
      const result = checker.checkBorders({ x: 630, y: 200 })

      expect(result).toEqual({ x: 1, y: 0 })
    })

    test('should return top border point(0, -1) when too far up', () => {
      // Check if tmpV < 1 + 4 = 5
      // Input loc y=10 -> (10-4)/2 = 3, which is < 5
      const result = checker.checkBorders({ x: 320, y: 10 })

      expect(result).toEqual({ x: 0, y: -1 })
    })

    test('should return bottom border point(0, 1) when too far down', () => {
      // Check if tmpV > topoHeight - 4 = 194
      // Input loc y=396 -> (396-4)/2 = 196, which is > 194
      const result = checker.checkBorders({ x: 320, y: 396 })

      expect(result).toEqual({ x: 0, y: 1 })
    })

    test('should return 0 when within bounds', () => {
      const result = checker.checkBorders({ x: 320, y: 200 })

      expect(result).toBe(0)
    })
  })

  describe('checkDepth (on checkDepth me, argLoc, argCornerPoints)', () => {
    beforeEach(() => {
      // Create a simple topology map (316x198 characters)
      // Use char codes: 0=land, 1-3=shallow, 4+=deep
      const width = 316
      const height = 198

      // Create map with all deep water (char code 10)
      let topo = ''
      for (let i = 0; i < width * height; i++) {
        topo += String.fromCharCode(10)
      }
      checker.setTopology('test_map', topo)
      checker.setDepth(5) // depth level 2
    })

    test('should return 0 when not active', () => {
      checker.active = false

      const result = checker.checkDepth({ x: 320, y: 200 })

      expect(result).toBe(0)
    })

    test('should return 0 for deep water', () => {
      const result = checker.checkDepth({ x: 320, y: 200 })

      expect(result).toBe(0)
    })

    test('should return Hit for land (char code 0)', () => {
      // Create map with land at a specific location
      const width = 316
      const height = 198

      // For location {x: 320, y: 202}:
      // baseH = (320 - 4) / 2 = 158
      // baseV = (202 - 4) / 2 = 99
      // Lingo: char (tmpH + ((tmpV - 1) * topoWidth)) of Topology (1-indexed)
      // JS 0-indexed: (tmpH - 1) + ((tmpV - 1) * topoWidth)
      const targetH = 158
      const targetV = 99
      const landIndex = (targetH - 1) + (targetV - 1) * width

      let topo = ''
      for (let i = 0; i < width * height; i++) {
        if (i === landIndex) {
          topo += String.fromCharCode(0) // Land
        } else {
          topo += String.fromCharCode(10)
        }
      }
      checker.setTopology('test_map', topo)

      const result = checker.checkDepth({ x: 320, y: 202 }, [{ x: 0, y: 0 }])

      expect(result).toBe('Hit')
    })

    test('should return 1 for too shallow water', () => {
      // Create map with shallow water (char code 1) at test location
      const width = 316
      const height = 198
      let topo = ''
      // JS 0-indexed: (tmpH - 1) + ((tmpV - 1) * topoWidth)
      const testIndex = (158 - 1) + (99 - 1) * width

      for (let i = 0; i < width * height; i++) {
        if (i === testIndex) {
          topo += String.fromCharCode(1) // Shallow (level 1)
        } else {
          topo += String.fromCharCode(10)
        }
      }
      checker.setTopology('test_map', topo)
      checker.setDepth(5) // Requires depth level 2

      // Boat needs depth 2, water is depth 1 -> too shallow
      const result = checker.checkDepth({ x: 320, y: 202 }, [{ x: 0, y: 0 }])

      expect(result).toBe(1)
    })

    test('should return Shallow for matching depth', () => {
      // Create map with water at exact depth level
      const width = 316
      const height = 198
      let topo = ''
      // JS 0-indexed: (tmpH - 1) + ((tmpV - 1) * topoWidth)
      const testIndex = (158 - 1) + (99 - 1) * width

      for (let i = 0; i < width * height; i++) {
        if (i === testIndex) {
          topo += String.fromCharCode(2) // Water at depth level 2
        } else {
          topo += String.fromCharCode(10)
        }
      }
      checker.setTopology('test_map', topo)
      checker.setDepth(5) // Sets depth to level 2

      const result = checker.checkDepth({ x: 320, y: 202 }, [{ x: 0, y: 0 }])

      expect(result).toBe('Shallow')
    })

    test('should check all corner points', () => {
      // Create map with land only at corner offset
      const width = 316
      const height = 198
      let topo = ''
      // Put land at offset (5, 5) from center
      // Center: tmpH=158, tmpV=99, corner adds (5,5)
      // JS 0-indexed: (tmpH + cornerX - 1) + ((tmpV + cornerY - 1) * topoWidth)
      const landIndex = (158 + 5 - 1) + (99 + 5 - 1) * width

      for (let i = 0; i < width * height; i++) {
        if (i === landIndex) {
          topo += String.fromCharCode(0) // Land
        } else {
          topo += String.fromCharCode(10)
        }
      }
      checker.setTopology('test_map', topo)

      // Check with corner point that hits the land
      const result = checker.checkDepth({ x: 320, y: 202 }, [
        { x: 0, y: 0 },
        { x: 5, y: 5 } // This corner should hit land
      ])

      expect(result).toBe('Hit')
    })

    test('should use default corner point if none provided', () => {
      // Original: if voidp(argCornerPoints) then set argCornerPoints to [point(0, 0)]
      const result = checker.checkDepth({ x: 320, y: 200 })

      expect(result).toBe(0) // Should still work with default point
    })
  })
})
