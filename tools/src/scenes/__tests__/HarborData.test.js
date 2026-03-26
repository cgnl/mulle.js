/**
 * @fileoverview Tests for HarborData - Harbor/RottenFish scene logic (scene 81)
 * Based on: decompiled Lingo for scene 81
 *
 * The original Lingo picks a random weight from [10, 15, 25, 35, 40] and a
 * random suffix (1 or 2). The scene then branches:
 *
 *   - Already has RottenFish → "notDelivered"
 *   - capacity >= weight AND weight >= 35 → "JustDoItmedal{suffix}" + medal 3
 *   - capacity >= weight AND weight < 35  → "JustDoIt{suffix}"
 *   - capacity < weight → "cantDoIt{suffix}"
 *
 * On success (JustDoIt*), mission 9 is completed and RottenFish is added to
 * inventory.
 */

const {
  WEIGHT_LIST,
  CAN_LIST,
  MISSION_ID,
  MEDAL_ID,
  computeHarborResult
} = require('../HarborData')

describe('HarborData', () => {
  // ===========================================================================
  // Constants
  // ===========================================================================

  describe('WEIGHT_LIST', () => {
    test('should contain exactly [10, 15, 25, 35, 40]', () => {
      expect(WEIGHT_LIST).toEqual([10, 15, 25, 35, 40])
    })

    test('should have 5 entries (one per random(5) index)', () => {
      expect(WEIGHT_LIST).toHaveLength(5)
    })
  })

  describe('CAN_LIST', () => {
    test('should contain 5 member names matching weight indices', () => {
      expect(CAN_LIST).toEqual([
        '81b005v1', '81b005v2', '81b005v3', '81b005v4', '81b005v5'
      ])
    })

    test('should have same length as WEIGHT_LIST', () => {
      expect(CAN_LIST).toHaveLength(WEIGHT_LIST.length)
    })
  })

  describe('MISSION_ID', () => {
    test('should be 9', () => {
      expect(MISSION_ID).toBe(9)
    })
  })

  describe('MEDAL_ID', () => {
    test('should be 3', () => {
      expect(MEDAL_ID).toBe(3)
    })
  })

  // ===========================================================================
  // Already has RottenFish → "notDelivered"
  // ===========================================================================

  describe('already has RottenFish', () => {
    test('returns "notDelivered" when hasRottenFish is true', () => {
      const result = computeHarborResult({
        hasRottenFish: true,
        loadCapacity: 100,
        rottenFishWeight: 10,
        suffix: 1
      })
      expect(result.marker).toBe('notDelivered')
    })

    test('no actions triggered when already has fish', () => {
      const result = computeHarborResult({
        hasRottenFish: true,
        loadCapacity: 100,
        rottenFishWeight: 10,
        suffix: 1
      })
      expect(result.actions.completeMission9).toBe(false)
      expect(result.actions.giveRottenFish).toBe(false)
      expect(result.actions.awardMedal3).toBe(false)
    })

    test('"notDelivered" ignores suffix (no suffix in marker)', () => {
      const r1 = computeHarborResult({
        hasRottenFish: true,
        loadCapacity: 50,
        rottenFishWeight: 10,
        suffix: 1
      })
      const r2 = computeHarborResult({
        hasRottenFish: true,
        loadCapacity: 50,
        rottenFishWeight: 10,
        suffix: 2
      })
      expect(r1.marker).toBe('notDelivered')
      expect(r2.marker).toBe('notDelivered')
    })

    test('"notDelivered" regardless of capacity and weight', () => {
      // Even if capacity < weight, hasRottenFish takes priority
      const result = computeHarborResult({
        hasRottenFish: true,
        loadCapacity: 5,
        rottenFishWeight: 40,
        suffix: 2
      })
      expect(result.marker).toBe('notDelivered')
    })
  })

  // ===========================================================================
  // Capacity < weight → "cantDoIt{suffix}"
  // ===========================================================================

  describe('insufficient capacity (cantDoIt)', () => {
    test('returns "cantDoIt1" when capacity < weight with suffix 1', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 9,
        rottenFishWeight: 10,
        suffix: 1
      })
      expect(result.marker).toBe('cantDoIt1')
    })

    test('returns "cantDoIt2" when capacity < weight with suffix 2', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 24,
        rottenFishWeight: 25,
        suffix: 2
      })
      expect(result.marker).toBe('cantDoIt2')
    })

    test('no actions triggered on insufficient capacity', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 5,
        rottenFishWeight: 10,
        suffix: 1
      })
      expect(result.actions.completeMission9).toBe(false)
      expect(result.actions.giveRottenFish).toBe(false)
      expect(result.actions.awardMedal3).toBe(false)
    })

    test('capacity 34 < weight 35 → cantDoIt', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 34,
        rottenFishWeight: 35,
        suffix: 1
      })
      expect(result.marker).toBe('cantDoIt1')
    })
  })

  // ===========================================================================
  // Success without medal (weight < 35) → "JustDoIt{suffix}"
  // ===========================================================================

  describe('success without medal (weight < 35)', () => {
    test.each([10, 15, 25])(
      'weight %d with sufficient capacity → "JustDoIt" + suffix',
      (weight) => {
        const result = computeHarborResult({
          hasRottenFish: false,
          loadCapacity: weight,
          rottenFishWeight: weight,
          suffix: 1
        })
        expect(result.marker).toBe('JustDoIt1')
      }
    )

    test('suffix 2 produces "JustDoIt2"', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 25,
        rottenFishWeight: 25,
        suffix: 2
      })
      expect(result.marker).toBe('JustDoIt2')
    })

    test('completes mission 9 on success', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 15,
        rottenFishWeight: 15,
        suffix: 1
      })
      expect(result.actions.completeMission9).toBe(true)
    })

    test('gives RottenFish on success', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 15,
        rottenFishWeight: 15,
        suffix: 1
      })
      expect(result.actions.giveRottenFish).toBe(true)
    })

    test('no medal for weight < 35', () => {
      for (const w of [10, 15, 25]) {
        const result = computeHarborResult({
          hasRottenFish: false,
          loadCapacity: 100,
          rottenFishWeight: w,
          suffix: 1
        })
        expect(result.actions.awardMedal3).toBe(false)
      }
    })
  })

  // ===========================================================================
  // Success with medal (weight >= 35) → "JustDoItmedal{suffix}"
  // ===========================================================================

  describe('success with medal (weight >= 35)', () => {
    test.each([35, 40])(
      'weight %d → "JustDoItmedal" + suffix',
      (weight) => {
        const result = computeHarborResult({
          hasRottenFish: false,
          loadCapacity: weight,
          rottenFishWeight: weight,
          suffix: 1
        })
        expect(result.marker).toBe('JustDoItmedal1')
      }
    )

    test('weight 35 with suffix 2 → "JustDoItmedal2"', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 50,
        rottenFishWeight: 35,
        suffix: 2
      })
      expect(result.marker).toBe('JustDoItmedal2')
    })

    test('weight 40 with suffix 2 → "JustDoItmedal2"', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 50,
        rottenFishWeight: 40,
        suffix: 2
      })
      expect(result.marker).toBe('JustDoItmedal2')
    })

    test('awards medal 3 for weight >= 35', () => {
      for (const w of [35, 40]) {
        const result = computeHarborResult({
          hasRottenFish: false,
          loadCapacity: 100,
          rottenFishWeight: w,
          suffix: 1
        })
        expect(result.actions.awardMedal3).toBe(true)
      }
    })

    test('completes mission 9 on medal success', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 50,
        rottenFishWeight: 35,
        suffix: 1
      })
      expect(result.actions.completeMission9).toBe(true)
    })

    test('gives RottenFish on medal success', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 50,
        rottenFishWeight: 40,
        suffix: 1
      })
      expect(result.actions.giveRottenFish).toBe(true)
    })
  })

  // ===========================================================================
  // Medal threshold boundary: weight 34 vs 35
  // ===========================================================================

  describe('medal threshold boundary (>= 35)', () => {
    test('weight 34 (hypothetical) → no medal', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 100,
        rottenFishWeight: 34,
        suffix: 1
      })
      expect(result.actions.awardMedal3).toBe(false)
      expect(result.marker).toBe('JustDoIt1')
    })

    test('weight 35 (boundary) → medal', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 100,
        rottenFishWeight: 35,
        suffix: 1
      })
      expect(result.actions.awardMedal3).toBe(true)
      expect(result.marker).toBe('JustDoItmedal1')
    })
  })

  // ===========================================================================
  // Capacity boundary: exact match (capacity == weight uses >=)
  // ===========================================================================

  describe('capacity boundary (>= comparison)', () => {
    test('capacity exactly equal to weight → success (Lingo uses >=)', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 25,
        rottenFishWeight: 25,
        suffix: 1
      })
      expect(result.marker).toBe('JustDoIt1')
      expect(result.actions.completeMission9).toBe(true)
    })

    test('capacity one less than weight → cantDoIt', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 24,
        rottenFishWeight: 25,
        suffix: 1
      })
      expect(result.marker).toBe('cantDoIt1')
      expect(result.actions.completeMission9).toBe(false)
    })

    test('capacity one more than weight → success', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 26,
        rottenFishWeight: 25,
        suffix: 2
      })
      expect(result.marker).toBe('JustDoIt2')
      expect(result.actions.completeMission9).toBe(true)
    })
  })

  // ===========================================================================
  // Suffix in markers
  // ===========================================================================

  describe('suffix in markers', () => {
    test.each([1, 2])('cantDoIt uses suffix %d', (s) => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 0,
        rottenFishWeight: 10,
        suffix: s
      })
      expect(result.marker).toBe('cantDoIt' + s)
    })

    test.each([1, 2])('JustDoIt uses suffix %d', (s) => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 25,
        rottenFishWeight: 25,
        suffix: s
      })
      expect(result.marker).toBe('JustDoIt' + s)
    })

    test.each([1, 2])('JustDoItmedal uses suffix %d', (s) => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 40,
        rottenFishWeight: 40,
        suffix: s
      })
      expect(result.marker).toBe('JustDoItmedal' + s)
    })
  })

  // ===========================================================================
  // Complete table of all WEIGHT_LIST values with both suffixes
  // ===========================================================================

  describe('all WEIGHT_LIST values with sufficient capacity', () => {
    test.each([
      [10, 1, 'JustDoIt1', false],
      [10, 2, 'JustDoIt2', false],
      [15, 1, 'JustDoIt1', false],
      [15, 2, 'JustDoIt2', false],
      [25, 1, 'JustDoIt1', false],
      [25, 2, 'JustDoIt2', false],
      [35, 1, 'JustDoItmedal1', true],
      [35, 2, 'JustDoItmedal2', true],
      [40, 1, 'JustDoItmedal1', true],
      [40, 2, 'JustDoItmedal2', true]
    ])(
      'weight %d, suffix %d → marker "%s", medal %s',
      (weight, suffix, expectedMarker, expectedMedal) => {
        const result = computeHarborResult({
          hasRottenFish: false,
          loadCapacity: 100,
          rottenFishWeight: weight,
          suffix
        })
        expect(result.marker).toBe(expectedMarker)
        expect(result.actions.awardMedal3).toBe(expectedMedal)
        expect(result.actions.completeMission9).toBe(true)
        expect(result.actions.giveRottenFish).toBe(true)
      }
    )
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('return value shape', () => {
    test('should return an object with marker and actions', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 50,
        rottenFishWeight: 10,
        suffix: 1
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('actions has exactly completeMission9, giveRottenFish, awardMedal3', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 50,
        rottenFishWeight: 10,
        suffix: 1
      })
      expect(Object.keys(result.actions).sort()).toEqual(
        ['awardMedal3', 'completeMission9', 'giveRottenFish']
      )
    })
  })
})
