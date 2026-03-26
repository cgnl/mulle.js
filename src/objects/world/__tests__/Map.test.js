/**
 * Map.test.js - TDD tests based on original Lingo
 * ParentScript 139 - Map.ls
 *
 * Single map data (terrain, objects, images).
 */
'use strict'

import Map from '../Map'

describe('Map', () => {
  let map

  beforeEach(() => {
    map = new Map()
  })

  describe('constructor (new me)', () => {
    test('should initialize empty MapId', () => {
      expect(map.MapId).toBe('')
    })

    test('should initialize empty objects array', () => {
      expect(map.objects).toEqual([])
    })

    test('should initialize empty MapImage', () => {
      expect(map.MapImage).toBe('')
    })

    test('should initialize empty Topology', () => {
      expect(map.Topology).toBe('')
    })

    test('should initialize undefined Special', () => {
      expect(map.Special).toBeUndefined()
    })

    test('should initialize undefined underMapImage', () => {
      expect(map.underMapImage).toBeUndefined()
    })
  })

  describe('kill', () => {
    test('should clear objects', () => {
      map.objects = [1, 2, 3]
      map.kill()
      expect(map.objects).toBe(0)
    })

    test('should return 0', () => {
      expect(map.kill()).toBe(0)
    })
  })

  describe('getMapImage', () => {
    test('should return MapImage', () => {
      map.MapImage = 'map01.png'
      expect(map.getMapImage()).toBe('map01.png')
    })
  })

  describe('getUnderMapImage', () => {
    test('should return underMapImage', () => {
      map.underMapImage = 'under01.png'
      expect(map.getUnderMapImage()).toBe('under01.png')
    })

    test('should return undefined if not set', () => {
      expect(map.getUnderMapImage()).toBeUndefined()
    })
  })

  describe('getObjects', () => {
    test('should return objects array', () => {
      map.objects = [
        [101, { x: 100, y: 200 }],
        [102, { x: 300, y: 400 }]
      ]

      expect(map.getObjects()).toEqual([
        [101, { x: 100, y: 200 }],
        [102, { x: 300, y: 400 }]
      ])
    })
  })

  describe('getTopology', () => {
    test('should return Topology', () => {
      map.Topology = 'topo01'
      expect(map.getTopology()).toBe('topo01')
    })
  })

  describe('getSpecial', () => {
    test('should return all Special without prop', () => {
      map.Special = { Fog: true, windspeed: 1.5 }

      expect(map.getSpecial()).toEqual({ Fog: true, windspeed: 1.5 })
    })

    test('should return specific property', () => {
      map.Special = { Fog: true, windspeed: 1.5 }

      expect(map.getSpecial('Fog')).toBe(true)
      expect(map.getSpecial('windspeed')).toBe(1.5)
    })

    test('should return undefined for missing property', () => {
      map.Special = { Fog: true }

      expect(map.getSpecial('unknown')).toBeUndefined()
    })

    test('should return undefined if Special is not object', () => {
      map.Special = null

      expect(map.getSpecial('Fog')).toBeUndefined()
    })
  })

  describe('toList', () => {
    test('should serialize to list', () => {
      map.MapId = 'm1'
      map.objects = [[1, { x: 0, y: 0 }]]
      map.MapImage = 'map.png'
      map.Topology = 'topo.png'

      const list = map.toList()

      expect(list).toEqual({
        MapId: 'm1',
        objects: [[1, { x: 0, y: 0 }]],
        MapImage: 'map.png',
        Topology: 'topo.png'
      })
    })
  })

  describe('fromList', () => {
    test('should deserialize from data object', () => {
      const data = {
        MapId: 'loaded',
        objects: [[10, { x: 50, y: 60 }]],
        MapImage: 'loadedMap.png',
        underMapImage: 'loadedUnder.png',
        Topology: 'loadedTopo',
        Special: { night: true }
      }

      const result = map.fromList(data)

      expect(result).toBe(true)
      expect(map.MapId).toBe('loaded')
      expect(map.objects).toEqual([[10, { x: 50, y: 60 }]])
      expect(map.MapImage).toBe('loadedMap.png')
      expect(map.underMapImage).toBe('loadedUnder.png')
      expect(map.Topology).toBe('loadedTopo')
      expect(map.Special).toEqual({ night: true })
    })

    test('should handle numeric ID (member lookup simulation)', () => {
      // In JS we pass data directly, string ID would need lookup
      const result = map.fromList(123)

      expect(result).toBe(false)
    })
  })
})
