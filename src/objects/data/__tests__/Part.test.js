/**
 * Part.test.js - TDD tests based on original Lingo
 * ParentScript 8 - Part.ls
 *
 * Individual part data.
 */
'use strict'

import Part from '../Part'

describe('Part', () => {
  let part
  let mockParts

  beforeEach(() => {
    mockParts = {
      getPart: jest.fn()
    }
    part = new Part(mockParts)
  })

  describe('constructor (new me)', () => {
    test('should initialize partId to 0', () => {
      expect(part.partId).toBe(0)
    })

    test('should initialize master to 0', () => {
      expect(part.master).toBe(0)
    })

    test('should initialize morphList to null (Lingo VOID)', () => {
      expect(part.morphList).toBeNull()
    })

    test('isMorphPart should be false immediately after construction', () => {
      expect(part.isMorphPart()).toBe(false)
    })

    test('isNormalpart should be true immediately after construction', () => {
      expect(part.isNormalpart()).toBe(true)
    })

    test('should initialize empty views', () => {
      expect(part.ShelfView).toBe('')
      expect(part.junkView).toBe('')
      expect(part.UseView).toBe('')
      expect(part.UseView2).toBe('')
      expect(part.useViewInside).toBe('')
      expect(part.UseViewInside2).toBe('')
    })

    test('should initialize offset to [0, 0]', () => {
      expect(part.offset).toEqual({ x: 0, y: 0 })
    })

    test('should initialize empty sounds', () => {
      expect(part.sndDescription).toBe('')
      expect(part.sndAttachOnBoat).toBe('')
      expect(part.sndDropOnList).toEqual({})
    })

    test('should initialize empty partProperties', () => {
      expect(part.partProperties).toEqual({})
    })

    test('should initialize empty point lists', () => {
      expect(part.clickAreaList).toEqual([])
      expect(part.requiredPoints).toEqual([])
      expect(part.coveredPoints).toEqual([])
      expect(part.newPoints).toEqual([])
    })
  })

  describe('kill', () => {
    test('should clear arrays', () => {
      part.morphList = [1, 2]
      part.kill()
      expect(part.morphList).toBe(0)
    })

    test('should return 0', () => {
      expect(part.kill()).toBe(0)
    })
  })

  describe('getId', () => {
    test('should return partId', () => {
      part.partId = 42
      expect(part.getId()).toBe(42)
    })
  })

  describe('getMaster', () => {
    test('should return master', () => {
      part.master = 100
      expect(part.getMaster()).toBe(100)
    })
  })

  describe('isMaster', () => {
    test('should return true if has master', () => {
      part.master = 100
      expect(part.isMaster()).toBe(true)
    })

    test('should return false if no master', () => {
      part.master = 0
      expect(part.isMaster()).toBe(false)
    })
  })

  describe('getMorphList', () => {
    test('should return morphList', () => {
      part.morphList = [101, 102]
      expect(part.getMorphList()).toEqual([101, 102])
    })
  })

  describe('isMorphPart', () => {
    test('should return true if has morphList', () => {
      part.morphList = [101]
      expect(part.isMorphPart()).toBe(true)
    })

    test('should return false if no morphList', () => {
      part.morphList = null
      expect(part.isMorphPart()).toBe(false)
    })
  })

  describe('isNormalpart', () => {
    test('should return true if no master and no morphList', () => {
      part.master = 0
      part.morphList = null
      expect(part.isNormalpart()).toBe(true)
    })

    test('should return false if has master', () => {
      part.master = 100
      part.morphList = null
      expect(part.isNormalpart()).toBe(false)
    })
  })

  describe('view getters with master fallback', () => {
    const masterPart = {
      getJunkView: () => 'master_junk',
      getShelfView: () => 'master_shelf',
      getUseView: () => 'master_use',
      getUseView2: () => 'master_use2',
      getUseViewInside: () => 'master_inside',
      getUseViewInside2: () => 'master_inside2',
      getOffset: () => ({ x: 10, y: 20 }),
      getSndDescription: () => 'master_snd',
      getSndAttachOnBoat: () => 'master_attach_snd',
      getClickArea: () => [[0, 0, 50, 50]]
    }

    beforeEach(() => {
      part.master = 100
      mockParts.getPart = jest.fn().mockReturnValue(masterPart)
    })

    test('getJunkView should fallback to master', () => {
      part.junkView = ''
      expect(part.getJunkView()).toBe('master_junk')
    })

    test('getJunkView should use own if set', () => {
      part.junkView = 'own_junk'
      expect(part.getJunkView()).toBe('own_junk')
    })

    test('getShelfView should fallback to master', () => {
      part.ShelfView = ''
      expect(part.getShelfView()).toBe('master_shelf')
    })

    test('getUseView should fallback to master', () => {
      part.UseView = ''
      expect(part.getUseView()).toBe('master_use')
    })

    test('getUseView2 should fallback to master', () => {
      part.UseView2 = ''
      expect(part.getUseView2()).toBe('master_use2')
    })

    // .ls line 112-120: getUseViewInside with master fallback
    test('getUseViewInside should fallback to master when empty (.ls line 112)', () => {
      part.useViewInside = ''
      expect(part.getUseViewInside()).toBe('master_inside')
    })

    test('getUseViewInside should use own if set', () => {
      part.useViewInside = 'own_inside'
      expect(part.getUseViewInside()).toBe('own_inside')
    })

    // .ls line 122-130: getUseViewInside2 with master fallback
    test('getUseViewInside2 should fallback to master when empty (.ls line 122)', () => {
      part.UseViewInside2 = ''
      expect(part.getUseViewInside2()).toBe('master_inside2')
    })

    test('getUseViewInside2 should use own if set', () => {
      part.UseViewInside2 = 'own_inside2'
      expect(part.getUseViewInside2()).toBe('own_inside2')
    })

    test('getOffset should fallback to master', () => {
      part.UseView = ''  // Offset uses UseView check (.ls line 93)
      expect(part.getOffset()).toEqual({ x: 10, y: 20 })
    })

    test('getSndDescription should fallback to master', () => {
      part.sndDescription = ''
      expect(part.getSndDescription()).toBe('master_snd')
    })

    // .ls line 142-150: getSndAttachOnBoat with master fallback
    test('getSndAttachOnBoat should fallback to master when empty (.ls line 142)', () => {
      part.sndAttachOnBoat = ''
      expect(part.getSndAttachOnBoat()).toBe('master_attach_snd')
    })

    test('getSndAttachOnBoat should use own if set', () => {
      part.sndAttachOnBoat = 'own_attach_snd'
      expect(part.getSndAttachOnBoat()).toBe('own_attach_snd')
    })

    // .ls line 180-188: getClickArea with master fallback
    // Note: .ls checks "not listp(clickAreaList)" — for morph parts that
    // get clickAreaList = VOID from fromList, this should fallback to master.
    test('getClickArea should fallback to master when not a list (.ls line 180)', () => {
      part.clickAreaList = null  // Simulates Lingo VOID (not listp)
      expect(part.getClickArea()).toEqual([[0, 0, 50, 50]])
    })

    test('getClickArea should use own if is a list', () => {
      part.clickAreaList = [[10, 10, 30, 30]]
      expect(part.getClickArea()).toEqual([[10, 10, 30, 30]])
    })

    test('getClickArea should use own empty list (no fallback)', () => {
      // .ls: listp([]) = true, so empty list does NOT fallback
      part.clickAreaList = []
      expect(part.getClickArea()).toEqual([])
    })
  })

  describe('getSndDropOn', () => {
    test('should return sound for location', () => {
      part.sndDropOnList = { Yard: 'yard_snd', Shelf: 'shelf_snd' }

      expect(part.getSndDropOn('Yard')).toBe('yard_snd')
    })

    test('should normalize Shelf location', () => {
      part.sndDropOnList = { Shelf: 'shelf_snd' }

      expect(part.getSndDropOn('Shelf1')).toBe('shelf_snd')
      expect(part.getSndDropOn('Shelf2')).toBe('shelf_snd')
    })
  })

  describe('getPropertyList', () => {
    test('should return partProperties', () => {
      part.partProperties = { weight: 50, power: 10 }

      expect(part.getPropertyList()).toEqual({ weight: 50, power: 10 })
    })
  })

  describe('getProperty', () => {
    test('should return specific property', () => {
      part.partProperties = { weight: 50, power: 10 }

      expect(part.getProperty('weight')).toBe(50)
    })
  })

  describe('point getters', () => {
    test('getRequiredPoints', () => {
      part.requiredPoints = [1, 2, 3]
      expect(part.getRequiredPoints()).toEqual([1, 2, 3])
    })

    test('getCoveredPoints', () => {
      part.coveredPoints = [4, 5]
      expect(part.getCoveredPoints()).toEqual([4, 5])
    })

    test('getNewPoints', () => {
      part.newPoints = [[6, [1], { x: 0, y: 0 }]]
      expect(part.getNewPoints()).toEqual([[6, [1], { x: 0, y: 0 }]])
    })
  })

  describe('getMorphToSnap', () => {
    test('should find morph for snap point', () => {
      part.morphList = [101, 102, 103]
      mockParts.getPart = jest.fn().mockImplementation((id) => ({
        getRequiredPoints: () => id === 102 ? [5] : [1]
      }))

      expect(part.getMorphToSnap(5)).toBe(102)
    })

    test('should return error if not found', () => {
      part.morphList = [101]
      mockParts.getPart = jest.fn().mockReturnValue({
        getRequiredPoints: () => [1]
      })

      expect(part.getMorphToSnap(99)).toBe('error')
    })
  })

  // .ls line 216-217: on getHeight me — return the height of member getJunkView(me) / 2
  // In the original game this gets the actual Director member bitmap height.
  // In JS we need a memberResolver to look up sprite dimensions.
  describe('getHeight (.ls line 216)', () => {
    test('should return half the junkView member height', () => {
      part.junkView = '00b042v0'
      const mockResolver = { getMemberHeight: jest.fn().mockReturnValue(80) }
      part.memberResolver = mockResolver
      expect(part.getHeight()).toBe(40)
      expect(mockResolver.getMemberHeight).toHaveBeenCalledWith('00b042v0')
    })

    test('should use master junkView if own is empty', () => {
      part.master = 100
      part.junkView = ''
      const masterPart = { getJunkView: () => 'master_junk' }
      mockParts.getPart = jest.fn().mockReturnValue(masterPart)
      const mockResolver = { getMemberHeight: jest.fn().mockReturnValue(120) }
      part.memberResolver = mockResolver
      expect(part.getHeight()).toBe(60)
    })

    test('should return 0 if no memberResolver', () => {
      part.junkView = '00b042v0'
      part.memberResolver = null
      expect(part.getHeight()).toBe(0)
    })
  })

  // .ls line 220-221: on getWidth me — return the width of member getJunkView(me) / 2
  describe('getWidth (.ls line 220)', () => {
    test('should return half the junkView member width', () => {
      part.junkView = '00b042v0'
      const mockResolver = { getMemberWidth: jest.fn().mockReturnValue(100) }
      part.memberResolver = mockResolver
      expect(part.getWidth()).toBe(50)
      expect(mockResolver.getMemberWidth).toHaveBeenCalledWith('00b042v0')
    })

    test('should use master junkView if own is empty', () => {
      part.master = 100
      part.junkView = ''
      const masterPart = { getJunkView: () => 'master_junk' }
      mockParts.getPart = jest.fn().mockReturnValue(masterPart)
      const mockResolver = { getMemberWidth: jest.fn().mockReturnValue(200) }
      part.memberResolver = mockResolver
      expect(part.getWidth()).toBe(100)
    })

    test('should return 0 if no memberResolver', () => {
      part.junkView = '00b042v0'
      part.memberResolver = null
      expect(part.getWidth()).toBe(0)
    })
  })

  describe('fromList', () => {
    test('should deserialize from data with morph list', () => {
      const data = {
        partId: 42,
        master: 0,
        MorphsTo: [43, 44],
        ShelfView: 'shelf.png',
        junkView: 'junk.png',
        UseView: 'use.png',
        offset: { x: 5, y: 10 },
        Properties: { weight: 25 },
        Requires: [1],
        Covers: [2],
        new: [[3, [1], { x: 0, y: 0 }]]
      }

      const result = part.fromList(data)

      expect(result).toBe(true)
      expect(part.partId).toBe(42)
      expect(part.morphList).toEqual([43, 44])
      expect(part.isMorphPart()).toBe(true)
      expect(part.partProperties).toEqual({ weight: 25 })
    })

    // Lingo: getaProp(objectList, #MorphsTo) returns 0 for non-morph parts
    // listp(0) = false, so isMorphPart should return false
    test('should set morphList to 0 when MorphsTo is 0 (non-morph part)', () => {
      const data = {
        partId: 92,
        master: 0,
        MorphsTo: 0
      }
      part.fromList(data)
      expect(part.morphList).toBe(0)
      expect(part.isMorphPart()).toBe(false)
      expect(part.isNormalpart()).toBe(true)
    })

    // Lingo: getaProp returns VOID when property is absent
    // listp(VOID) = false
    test('should set morphList to null when MorphsTo is absent', () => {
      const data = {
        partId: 1,
        master: 0
      }
      part.fromList(data)
      expect(part.morphList).toBeNull()
      expect(part.isMorphPart()).toBe(false)
    })
  })
})
