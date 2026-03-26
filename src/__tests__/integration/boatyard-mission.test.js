/**
 * Integration test: Quay/Boatyard scene + QuayData functions
 *
 * Verifies all core QuayData functions:
 *   - computeMissionInit: mission initialization and belly setup
 *   - shouldMakeDelivery: delivery trigger logic
 *   - computeDeliveryIndex: 1-based delivery index calculation
 *   - computeDeliveryResult: blueprint vs parts delivery resolution
 *   - computeSailResult: sail gate and destination world
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const {
  computeMissionInit,
  shouldMakeDelivery,
  computeDeliveryIndex,
  computeDeliveryResult,
  computeSailResult
} = require('../../scenes/QuayData')

// ===========================================================================
// computeMissionInit
// ===========================================================================

describe('computeMissionInit', () => {
  test('no missions completed → setBelly=1000, giveMissions=[]', () => {
    const result = computeMissionInit({ m20: false, m2: false, m13: false })
    expect(result.setBelly).toBe(1000)
    expect(result.giveMissions).toEqual([])
  })

  test('all 3 completed → giveMissions=[1, 2, 13]', () => {
    const result = computeMissionInit({ m20: true, m2: true, m13: true })
    expect(result.setBelly).toBe(1000)
    expect(result.giveMissions).toEqual([1, 2, 13])
  })

  test('only m20 → giveMissions=[1]', () => {
    const result = computeMissionInit({ m20: true, m2: false, m13: false })
    expect(result.giveMissions).toEqual([1])
  })

  test('m2 + m13 → giveMissions=[2, 13]', () => {
    const result = computeMissionInit({ m20: false, m2: true, m13: true })
    expect(result.giveMissions).toEqual([2, 13])
  })
})

// ===========================================================================
// shouldMakeDelivery
// ===========================================================================

describe('shouldMakeDelivery', () => {
  test('builtBoats=2, deliveryMade=false → true', () => {
    expect(shouldMakeDelivery(2, false)).toBe(true)
  })

  test('builtBoats=4, deliveryMade=false → true', () => {
    expect(shouldMakeDelivery(4, false)).toBe(true)
  })

  test('builtBoats=8, deliveryMade=false → true', () => {
    expect(shouldMakeDelivery(8, false)).toBe(true)
  })

  test('builtBoats=3, deliveryMade=false → false (not 2 and not divisible by 4)', () => {
    expect(shouldMakeDelivery(3, false)).toBe(false)
  })

  test('builtBoats=2, deliveryMade=true → false', () => {
    expect(shouldMakeDelivery(2, true)).toBe(false)
  })

  test('builtBoats=0 → false', () => {
    expect(shouldMakeDelivery(0, false)).toBe(false)
  })

  test('builtBoats=-1 → false', () => {
    expect(shouldMakeDelivery(-1, false)).toBe(false)
  })
})

// ===========================================================================
// computeDeliveryIndex
// ===========================================================================

describe('computeDeliveryIndex', () => {
  test('builtBoats=2 → 1', () => {
    expect(computeDeliveryIndex(2)).toBe(1)
  })

  test('builtBoats=4 → 2', () => {
    expect(computeDeliveryIndex(4)).toBe(2)
  })

  test('builtBoats=8 → 3', () => {
    expect(computeDeliveryIndex(8)).toBe(3)
  })

  test('builtBoats=12 → 4', () => {
    expect(computeDeliveryIndex(12)).toBe(4)
  })
})

// ===========================================================================
// computeDeliveryResult
// ===========================================================================

describe('computeDeliveryResult', () => {
  test('blueprint delivery (first item is string) → type=blueprint, setGotNewHull=true', () => {
    const deliveryList = [['Hull1', 'extra']]
    const result = computeDeliveryResult(deliveryList, 1)
    expect(result.type).toBe('blueprint')
    expect(result.items).toEqual(['Hull1'])
    expect(result.setDeliveryMade).toBe(true)
    expect(result.setGotNewHull).toBe(true)
    expect(result.setGotNewParts).toBe(false)
  })

  test('parts delivery (first item is number) → type=parts, setGotNewParts=true', () => {
    const deliveryList = [[101, 202, 303]]
    const result = computeDeliveryResult(deliveryList, 1)
    expect(result.type).toBe('parts')
    expect(result.items).toEqual([101, 202, 303])
    expect(result.setDeliveryMade).toBe(true)
    expect(result.setGotNewParts).toBe(true)
    expect(result.setGotNewHull).toBe(false)
  })

  test('index out of range → type=none', () => {
    const deliveryList = [[101]]
    const result = computeDeliveryResult(deliveryList, 5)
    expect(result.type).toBe('none')
    expect(result.items).toEqual([])
    expect(result.setDeliveryMade).toBe(false)
  })

  test('empty delivery array → type=none', () => {
    const result = computeDeliveryResult([], 1)
    expect(result.type).toBe('none')
    expect(result.items).toEqual([])
    expect(result.setDeliveryMade).toBe(false)
  })
})

// ===========================================================================
// computeSailResult
// ===========================================================================

describe('computeSailResult', () => {
  test('has engine, material=1 → canSail, world=WoodWorld', () => {
    const result = computeSailResult({ engine: true, sailWithPole: false, oar: false, material: 1 })
    expect(result.canSail).toBe(true)
    expect(result.world).toBe('WoodWorld')
    expect(result.incrementBuiltBoats).toBe(true)
    expect(result.clearDeliveryMade).toBe(true)
    expect(result.noSailSound).toBeNull()
  })

  test('has oar, material=2 → canSail, world=MetalWorld', () => {
    const result = computeSailResult({ engine: false, sailWithPole: false, oar: true, material: 2 })
    expect(result.canSail).toBe(true)
    expect(result.world).toBe('MetalWorld')
  })

  test('has sailWithPole → canSail', () => {
    const result = computeSailResult({ engine: false, sailWithPole: true, oar: false, material: 1 })
    expect(result.canSail).toBe(true)
  })

  test('no propulsion → canSail=false, noSailSound=04d049v0', () => {
    const result = computeSailResult({ engine: false, sailWithPole: false, oar: false, material: 1 })
    expect(result.canSail).toBe(false)
    expect(result.world).toBeNull()
    expect(result.incrementBuiltBoats).toBe(false)
    expect(result.clearDeliveryMade).toBe(false)
    expect(result.noSailSound).toBe('04d049v0')
  })
})
