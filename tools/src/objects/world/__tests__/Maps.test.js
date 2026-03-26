/**
 * Maps.test.js - TDD tests based on original Lingo
 * ParentScript 138 - Maps.ls
 *
 * Collection of maps manager.
 */
'use strict'

import Maps from '../Maps'

describe('Maps', () => {
  let maps

  beforeEach(() => {
    maps = new Maps()
  })

  describe('constructor (new me)', () => {
    test('should initialize empty maps array', () => {
      expect(maps.maps).toEqual([])
    })
  })

  describe('kill', () => {
    test('should clear maps', () => {
      maps.maps = ['map1', 'map2']
      maps.kill()
      expect(maps.maps).toBe(0)
    })

    test('should return 0', () => {
      expect(maps.kill()).toBe(0)
    })
  })

  describe('loadMap', () => {
    test('should return InvalidObject for non-object map', () => {
      expect(maps.loadMap(null, 1)).toBe('InvalidObject')
    })

    test('should load map and return 0 on success', () => {
      const mockMap = { fromList: jest.fn().mockReturnValue(true) }

      const result = maps.loadMap(mockMap, 'mapData')

      expect(result).toBe(0)
      expect(mockMap.fromList).toHaveBeenCalledWith('mapData')
    })

    test('should return InvalidMember if fromList fails', () => {
      const mockMap = { fromList: jest.fn().mockReturnValue(false) }

      expect(maps.loadMap(mockMap, 'badData')).toBe('InvalidMember')
    })
  })

  describe('toList', () => {
    test('should return maps array', () => {
      maps.maps = ['m1', 'm2', 'm3']
      expect(maps.toList()).toEqual(['m1', 'm2', 'm3'])
    })
  })

  describe('fromList', () => {
    test('should set maps from list', () => {
      maps.fromList(['map1', 'map2'])
      expect(maps.maps).toEqual(['map1', 'map2'])
    })
  })
})
