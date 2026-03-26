/**
 * @fileoverview Tests for QuayData - Quay/Boatyard scene logic (scene 04)
 * Based on: decompiled Lingo for scene 04 (ParentScript 22 - Dir.ls)
 *
 * Scene 04 is the main boatyard where players build and launch boats.
 * This tests the pure-function data module that extracts game logic from Lingo.
 */

const {
  // Dialog lists
  FIRST_DIALOG_LIST,
  GEN_DIALOG_LIST,
  DORIS_BLUEPRINT_LIST,
  DORIS_PART_LIST,
  VERY_FIRST_TIME_RADIO_LIST,

  // Weather/wind maps
  WEATHER_AMBIENT_MAP,
  WIND_REPORT_MAP,

  // Constants
  NO_SAIL_SOUND,
  BELLY_VALUE,

  // Functions
  computeMissionInit,
  shouldMakeDelivery,
  computeDeliveryIndex,
  computeDeliveryResult,
  computeSailResult,
  getWeatherAmbient,
  getWindReportSound,
  resolveQuayDialogPriority
} = require('../QuayData')

describe('QuayData', () => {
  // ===========================================================================
  // Dialog Lists
  // ===========================================================================

  describe('FIRST_DIALOG_LIST', () => {
    test('should contain exactly 5 entries', () => {
      expect(FIRST_DIALOG_LIST).toHaveLength(5)
    })

    test('should contain correct dialog IDs from Lingo line 14', () => {
      expect(FIRST_DIALOG_LIST).toEqual([
        '04d010v0',
        '04d012v0',
        '04d047v0',
        '04d051v0',
        '04d052v0'
      ])
    })

    test('all entries should be strings', () => {
      FIRST_DIALOG_LIST.forEach(id => {
        expect(typeof id).toBe('string')
      })
    })
  })

  describe('GEN_DIALOG_LIST', () => {
    test('should contain exactly 25 entries', () => {
      expect(GEN_DIALOG_LIST).toHaveLength(25)
    })

    test('should contain correct dialog IDs from Lingo line 15', () => {
      expect(GEN_DIALOG_LIST).toEqual([
        '00d001v0', '00d002v0', '00d003v0', '00d004v0', '00d005v0',
        '04d001v0', '04d002v0', '04d003v0', '04d004v0', '04d007v0',
        '04d013v0', '04d014v0', '04d015v0', '04d016v0', '04d017v0',
        '04d018v0', '04d019v0', '04d020v0', '04d022v0', '04d023v0',
        '04d027v0', '04d028v0', '04d029v0', '04d030v0', '04d032v0'
      ])
    })

    test('first 5 entries are generic (00d*)', () => {
      for (let i = 0; i < 5; i++) {
        expect(GEN_DIALOG_LIST[i]).toMatch(/^00d/)
      }
    })

    test('remaining 20 entries are scene-specific (04d*)', () => {
      for (let i = 5; i < 25; i++) {
        expect(GEN_DIALOG_LIST[i]).toMatch(/^04d/)
      }
    })
  })

  describe('DORIS_BLUEPRINT_LIST', () => {
    test('should contain exactly 2 entries', () => {
      expect(DORIS_BLUEPRINT_LIST).toHaveLength(2)
    })

    test('should contain correct dialog IDs from Lingo line 16', () => {
      expect(DORIS_BLUEPRINT_LIST).toEqual([
        '04d040v0',
        '04d044v0'
      ])
    })
  })

  describe('DORIS_PART_LIST', () => {
    test('should contain exactly 11 entries', () => {
      expect(DORIS_PART_LIST).toHaveLength(11)
    })

    test('should contain correct dialog IDs from Lingo line 17', () => {
      expect(DORIS_PART_LIST).toEqual([
        '04d034v0', '04d035v0', '04d036v0', '04d037v0', '04d038v0',
        '04d039v0', '04d041v0', '04d042v0', '04d043v0', '04d045v0',
        '04d046v0'
      ])
    })
  })

  describe('VERY_FIRST_TIME_RADIO_LIST', () => {
    test('should contain exactly 2 entries', () => {
      expect(VERY_FIRST_TIME_RADIO_LIST).toHaveLength(2)
    })

    test('should contain correct dialog IDs from Lingo line 26', () => {
      expect(VERY_FIRST_TIME_RADIO_LIST).toEqual([
        '00d075v0',
        '50d012v0'
      ])
    })
  })

  // ===========================================================================
  // Constants
  // ===========================================================================

  describe('NO_SAIL_SOUND', () => {
    test('should be "04d049v0"', () => {
      expect(NO_SAIL_SOUND).toBe('04d049v0')
    })
  })

  describe('BELLY_VALUE', () => {
    test('should be 1000', () => {
      expect(BELLY_VALUE).toBe(1000)
    })
  })

  // ===========================================================================
  // computeMissionInit
  // ===========================================================================

  describe('computeMissionInit', () => {
    test('always sets belly to 1000', () => {
      const result = computeMissionInit({ m20: false, m2: false, m13: false })
      expect(result.setBelly).toBe(1000)
    })

    test('no missions given when none completed', () => {
      const result = computeMissionInit({ m20: false, m2: false, m13: false })
      expect(result.giveMissions).toEqual([])
    })

    test('mission 1 given when m20 completed', () => {
      const result = computeMissionInit({ m20: true, m2: false, m13: false })
      expect(result.giveMissions).toContain(1)
    })

    test('mission 2 given when m2 completed', () => {
      const result = computeMissionInit({ m20: false, m2: true, m13: false })
      expect(result.giveMissions).toContain(2)
    })

    test('mission 13 given when m13 completed', () => {
      const result = computeMissionInit({ m20: false, m2: false, m13: true })
      expect(result.giveMissions).toContain(13)
    })

    test('all missions given when all completed', () => {
      const result = computeMissionInit({ m20: true, m2: true, m13: true })
      expect(result.giveMissions).toEqual([1, 2, 13])
    })

    test('m20 and m2 completed gives missions 1 and 2', () => {
      const result = computeMissionInit({ m20: true, m2: true, m13: false })
      expect(result.giveMissions).toEqual([1, 2])
    })

    test('m20 and m13 completed gives missions 1 and 13', () => {
      const result = computeMissionInit({ m20: true, m2: false, m13: true })
      expect(result.giveMissions).toEqual([1, 13])
    })

    test('m2 and m13 completed gives missions 2 and 13', () => {
      const result = computeMissionInit({ m20: false, m2: true, m13: true })
      expect(result.giveMissions).toEqual([2, 13])
    })

    test('belly is always 1000 regardless of missions', () => {
      const combinations = [
        { m20: false, m2: false, m13: false },
        { m20: true, m2: false, m13: false },
        { m20: false, m2: true, m13: false },
        { m20: false, m2: false, m13: true },
        { m20: true, m2: true, m13: true }
      ]
      combinations.forEach(combo => {
        expect(computeMissionInit(combo).setBelly).toBe(1000)
      })
    })
  })

  // ===========================================================================
  // shouldMakeDelivery
  // ===========================================================================

  describe('shouldMakeDelivery', () => {
    describe('when deliveryMade is true', () => {
      test('returns false for builtBoats=0', () => {
        expect(shouldMakeDelivery(0, true)).toBe(false)
      })

      test('returns false for builtBoats=2', () => {
        expect(shouldMakeDelivery(2, true)).toBe(false)
      })

      test('returns false for builtBoats=4', () => {
        expect(shouldMakeDelivery(4, true)).toBe(false)
      })

      test('returns false for builtBoats=8', () => {
        expect(shouldMakeDelivery(8, true)).toBe(false)
      })
    })

    describe('when deliveryMade is false', () => {
      test('returns false for builtBoats=0', () => {
        expect(shouldMakeDelivery(0, false)).toBe(false)
      })

      test('returns false for builtBoats=1', () => {
        expect(shouldMakeDelivery(1, false)).toBe(false)
      })

      test('returns true for builtBoats=2 (special case)', () => {
        expect(shouldMakeDelivery(2, false)).toBe(true)
      })

      test('returns false for builtBoats=3', () => {
        expect(shouldMakeDelivery(3, false)).toBe(false)
      })

      test('returns true for builtBoats=4 (divisible by 4)', () => {
        expect(shouldMakeDelivery(4, false)).toBe(true)
      })

      test('returns false for builtBoats=5', () => {
        expect(shouldMakeDelivery(5, false)).toBe(false)
      })

      test('returns false for builtBoats=6', () => {
        expect(shouldMakeDelivery(6, false)).toBe(false)
      })

      test('returns false for builtBoats=7', () => {
        expect(shouldMakeDelivery(7, false)).toBe(false)
      })

      test('returns true for builtBoats=8 (divisible by 4)', () => {
        expect(shouldMakeDelivery(8, false)).toBe(true)
      })

      test('returns true for builtBoats=12 (divisible by 4)', () => {
        expect(shouldMakeDelivery(12, false)).toBe(true)
      })

      test('returns true for builtBoats=16 (divisible by 4)', () => {
        expect(shouldMakeDelivery(16, false)).toBe(true)
      })

      test('returns false for builtBoats=10', () => {
        expect(shouldMakeDelivery(10, false)).toBe(false)
      })
    })

    describe('negative builtBoats', () => {
      test('returns false for builtBoats=-1', () => {
        expect(shouldMakeDelivery(-1, false)).toBe(false)
      })

      test('returns false for builtBoats=-4', () => {
        expect(shouldMakeDelivery(-4, false)).toBe(false)
      })
    })
  })

  // ===========================================================================
  // computeDeliveryIndex
  // ===========================================================================

  describe('computeDeliveryIndex', () => {
    test('builtBoats=2 returns index 1 (special case)', () => {
      expect(computeDeliveryIndex(2)).toBe(1)
    })

    test('builtBoats=4 returns index 2 (1 + 4/4)', () => {
      expect(computeDeliveryIndex(4)).toBe(2)
    })

    test('builtBoats=8 returns index 3 (1 + 8/4)', () => {
      expect(computeDeliveryIndex(8)).toBe(3)
    })

    test('builtBoats=12 returns index 4 (1 + 12/4)', () => {
      expect(computeDeliveryIndex(12)).toBe(4)
    })

    test('builtBoats=16 returns index 5 (1 + 16/4)', () => {
      expect(computeDeliveryIndex(16)).toBe(5)
    })

    test('builtBoats=0 returns index 1 (1 + 0/4)', () => {
      expect(computeDeliveryIndex(0)).toBe(1)
    })

    test('builtBoats=1 returns index 1 (1 + floor(1/4))', () => {
      expect(computeDeliveryIndex(1)).toBe(1)
    })

    test('builtBoats=3 returns index 1 (1 + floor(3/4))', () => {
      expect(computeDeliveryIndex(3)).toBe(1)
    })

    test('builtBoats=5 returns index 2 (1 + floor(5/4))', () => {
      expect(computeDeliveryIndex(5)).toBe(2)
    })

    test('builtBoats=7 returns index 2 (1 + floor(7/4))', () => {
      expect(computeDeliveryIndex(7)).toBe(2)
    })
  })

  // ===========================================================================
  // computeDeliveryResult
  // ===========================================================================

  describe('computeDeliveryResult', () => {
    describe('blueprint delivery (symbol first element)', () => {
      test('returns blueprint type when first element is string', () => {
        const deliveryList = [['Hull1']]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.type).toBe('blueprint')
      })

      test('returns the blueprint name in items', () => {
        const deliveryList = [['Hull2']]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.items).toEqual(['Hull2'])
      })

      test('sets gotNewHull to true', () => {
        const deliveryList = [['CatamaranHull']]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setGotNewHull).toBe(true)
      })

      test('sets gotNewParts to false', () => {
        const deliveryList = [['Hull1']]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setGotNewParts).toBe(false)
      })

      test('sets deliveryMade to true', () => {
        const deliveryList = [['Hull1']]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setDeliveryMade).toBe(true)
      })
    })

    describe('parts delivery (number first element)', () => {
      test('returns parts type when first element is number', () => {
        const deliveryList = [[101, 102, 103]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.type).toBe('parts')
      })

      test('returns all part numbers in items', () => {
        const deliveryList = [[201, 202, 203, 204]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.items).toEqual([201, 202, 203, 204])
      })

      test('sets gotNewParts to true', () => {
        const deliveryList = [[101]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setGotNewParts).toBe(true)
      })

      test('sets gotNewHull to false', () => {
        const deliveryList = [[101, 102]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setGotNewHull).toBe(false)
      })

      test('sets deliveryMade to true', () => {
        const deliveryList = [[101]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setDeliveryMade).toBe(true)
      })

      test('single part delivery works', () => {
        const deliveryList = [[999]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.type).toBe('parts')
        expect(result.items).toEqual([999])
      })
    })

    describe('empty delivery', () => {
      test('returns none for empty array', () => {
        const deliveryList = [[]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.type).toBe('none')
      })

      test('does not set deliveryMade for empty', () => {
        const deliveryList = [[]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setDeliveryMade).toBe(false)
      })

      test('does not set gotNewHull for empty', () => {
        const deliveryList = [[]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setGotNewHull).toBe(false)
      })

      test('does not set gotNewParts for empty', () => {
        const deliveryList = [[]]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.setGotNewParts).toBe(false)
      })
    })

    describe('index out of range', () => {
      test('returns none for index 0', () => {
        const deliveryList = [['Hull1']]
        const result = computeDeliveryResult(deliveryList, 0)
        expect(result.type).toBe('none')
      })

      test('returns none for index > list length', () => {
        const deliveryList = [['Hull1'], [101, 102]]
        const result = computeDeliveryResult(deliveryList, 3)
        expect(result.type).toBe('none')
      })

      test('returns none for negative index', () => {
        const deliveryList = [['Hull1']]
        const result = computeDeliveryResult(deliveryList, -1)
        expect(result.type).toBe('none')
      })

      test('does not set any flags for out of range', () => {
        const deliveryList = [['Hull1']]
        const result = computeDeliveryResult(deliveryList, 5)
        expect(result.setDeliveryMade).toBe(false)
        expect(result.setGotNewHull).toBe(false)
        expect(result.setGotNewParts).toBe(false)
      })
    })

    describe('multiple deliveries in list', () => {
      test('index 1 gets first delivery', () => {
        const deliveryList = [['Hull1'], [101], ['Hull2']]
        const result = computeDeliveryResult(deliveryList, 1)
        expect(result.type).toBe('blueprint')
        expect(result.items).toEqual(['Hull1'])
      })

      test('index 2 gets second delivery', () => {
        const deliveryList = [['Hull1'], [101, 102], ['Hull2']]
        const result = computeDeliveryResult(deliveryList, 2)
        expect(result.type).toBe('parts')
        expect(result.items).toEqual([101, 102])
      })

      test('index 3 gets third delivery', () => {
        const deliveryList = [['Hull1'], [101], ['Hull2']]
        const result = computeDeliveryResult(deliveryList, 3)
        expect(result.type).toBe('blueprint')
        expect(result.items).toEqual(['Hull2'])
      })
    })
  })

  // ===========================================================================
  // computeSailResult
  // ===========================================================================

  describe('computeSailResult', () => {
    describe('boat can sail', () => {
      test('can sail with engine only', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.canSail).toBe(true)
      })

      test('can sail with sailWithPole only', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: true,
          oar: false,
          material: 1
        })
        expect(result.canSail).toBe(true)
      })

      test('can sail with oar only', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: false,
          oar: true,
          material: 1
        })
        expect(result.canSail).toBe(true)
      })

      test('can sail with all propulsion', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: true,
          oar: true,
          material: 1
        })
        expect(result.canSail).toBe(true)
      })

      test('can sail with engine and oar', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: true,
          material: 2
        })
        expect(result.canSail).toBe(true)
      })
    })

    describe('world destination based on material', () => {
      test('material 1 goes to WoodWorld', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.world).toBe('WoodWorld')
      })

      test('material 2 goes to MetalWorld', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 2
        })
        expect(result.world).toBe('MetalWorld')
      })

      test('material 0 goes to MetalWorld', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 0
        })
        expect(result.world).toBe('MetalWorld')
      })

      test('material 3 goes to MetalWorld', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 3
        })
        expect(result.world).toBe('MetalWorld')
      })
    })

    describe('sail success side effects', () => {
      test('incrementBuiltBoats is true on success', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.incrementBuiltBoats).toBe(true)
      })

      test('clearDeliveryMade is true on success', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.clearDeliveryMade).toBe(true)
      })

      test('noSailSound is null on success', () => {
        const result = computeSailResult({
          engine: true,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.noSailSound).toBeNull()
      })
    })

    describe('boat cannot sail (no propulsion)', () => {
      test('cannot sail without any propulsion', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.canSail).toBe(false)
      })

      test('world is null when cannot sail', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.world).toBeNull()
      })

      test('incrementBuiltBoats is false when cannot sail', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.incrementBuiltBoats).toBe(false)
      })

      test('clearDeliveryMade is false when cannot sail', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.clearDeliveryMade).toBe(false)
      })

      test('noSailSound is "04d049v0" when cannot sail', () => {
        const result = computeSailResult({
          engine: false,
          sailWithPole: false,
          oar: false,
          material: 1
        })
        expect(result.noSailSound).toBe('04d049v0')
      })
    })
  })

  // ===========================================================================
  // getWeatherAmbient
  // ===========================================================================

  describe('getWeatherAmbient', () => {
    test('weather type 1 returns volume 200 and sound 00e108v0', () => {
      const result = getWeatherAmbient(1)
      expect(result).toEqual({ volume: 200, sound: '00e108v0' })
    })

    test('weather type 2 returns volume 200 and sound 00e109v0', () => {
      const result = getWeatherAmbient(2)
      expect(result).toEqual({ volume: 200, sound: '00e109v0' })
    })

    test('weather type 3 returns volume 150 and sound 00e104v0', () => {
      const result = getWeatherAmbient(3)
      expect(result).toEqual({ volume: 150, sound: '00e104v0' })
    })

    test('weather type 4 returns volume 150 and sound 00e107v0', () => {
      const result = getWeatherAmbient(4)
      expect(result).toEqual({ volume: 150, sound: '00e107v0' })
    })

    test('weather type 0 returns null', () => {
      expect(getWeatherAmbient(0)).toBeNull()
    })

    test('weather type 5 returns null', () => {
      expect(getWeatherAmbient(5)).toBeNull()
    })

    test('weather type -1 returns null', () => {
      expect(getWeatherAmbient(-1)).toBeNull()
    })

    test('WEATHER_AMBIENT_MAP has exactly 4 entries', () => {
      expect(Object.keys(WEATHER_AMBIENT_MAP)).toHaveLength(4)
    })
  })

  // ===========================================================================
  // getWindReportSound
  // ===========================================================================

  describe('getWindReportSound', () => {
    test('wind speed 0 returns 00d010v0', () => {
      expect(getWindReportSound(0)).toBe('00d010v0')
    })

    test('wind speed 1 returns 00d011v0', () => {
      expect(getWindReportSound(1)).toBe('00d011v0')
    })

    test('wind speed 2 returns 00d012v0', () => {
      expect(getWindReportSound(2)).toBe('00d012v0')
    })

    test('wind speed 3 returns 00d013v0', () => {
      expect(getWindReportSound(3)).toBe('00d013v0')
    })

    test('wind speed 4 returns null', () => {
      expect(getWindReportSound(4)).toBeNull()
    })

    test('wind speed -1 returns null', () => {
      expect(getWindReportSound(-1)).toBeNull()
    })

    test('WIND_REPORT_MAP has exactly 4 entries', () => {
      expect(Object.keys(WIND_REPORT_MAP)).toHaveLength(4)
    })
  })

  // ===========================================================================
  // resolveQuayDialogPriority
  // ===========================================================================

  describe('resolveQuayDialogPriority', () => {
    const baseState = {
      makeDelivery: false,
      radioReport: false,
      radioDialogListLength: 0,
      radioCount: 0,
      windReport: false,
      windSpeed: 0,
      firstTime: false,
      loopCounter: 100,
      firstDialogListLength: 0
    }

    describe('priority 1: makeDelivery', () => {
      test('returns doDelivery action when makeDelivery is true', () => {
        const state = { ...baseState, makeDelivery: true }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('doDelivery')
      })

      test('sets OKToTalk to false on delivery', () => {
        const state = { ...baseState, makeDelivery: true }
        const result = resolveQuayDialogPriority(state)
        expect(result.setOKToTalk).toBe(false)
      })

      test('makeDelivery takes priority over radioReport', () => {
        const state = { ...baseState, makeDelivery: true, radioReport: true, radioDialogListLength: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('doDelivery')
      })

      test('makeDelivery takes priority over windReport', () => {
        const state = { ...baseState, makeDelivery: true, windReport: true }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('doDelivery')
      })

      test('makeDelivery takes priority over firstTime', () => {
        const state = { ...baseState, makeDelivery: true, firstTime: true, loopCounter: 0, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('doDelivery')
      })
    })

    describe('priority 2: radioReport', () => {
      test('plays radio dialog when radioDialogListLength > 0', () => {
        const state = { ...baseState, radioReport: true, radioDialogListLength: 2, radioCount: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playRadioDialog')
      })

      test('first radio dialog uses MulleNormalTalk', () => {
        const state = { ...baseState, radioReport: true, radioDialogListLength: 2, radioCount: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.talkType).toBe('MulleNormalTalk')
      })

      test('subsequent radio dialogs use RadioSmallTalk', () => {
        const state = { ...baseState, radioReport: true, radioDialogListLength: 1, radioCount: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.talkType).toBe('RadioSmallTalk')
      })

      test('sets deleteAfterPlay to true for radio', () => {
        const state = { ...baseState, radioReport: true, radioDialogListLength: 2, radioCount: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.deleteAfterPlay).toBe(true)
      })

      test('resets radio report when list empty', () => {
        const state = { ...baseState, radioReport: true, radioDialogListLength: 0, radioCount: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('resetRadioReport')
        expect(result.setRadioReport).toBe(false)
        expect(result.setRadioCount).toBe(0)
      })

      test('radioReport takes priority over windReport', () => {
        const state = { ...baseState, radioReport: true, radioDialogListLength: 1, radioCount: 1, windReport: true }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playRadioDialog')
      })
    })

    describe('priority 3: windReport', () => {
      test('plays wind report sound when windReport is true', () => {
        const state = { ...baseState, windReport: true, windSpeed: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playWindReport')
      })

      test('wind report includes correct sound', () => {
        const state = { ...baseState, windReport: true, windSpeed: 1 }
        const result = resolveQuayDialogPriority(state)
        expect(result.sound).toBe('00d011v0')
      })

      test('wind report uses MulleNormalTalk', () => {
        const state = { ...baseState, windReport: true, windSpeed: 0 }
        const result = resolveQuayDialogPriority(state)
        expect(result.talkType).toBe('MulleNormalTalk')
      })

      test('wind report clears windReport flag', () => {
        const state = { ...baseState, windReport: true, windSpeed: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.setWindReport).toBe(false)
      })

      test('invalid wind speed clears windReport without playing', () => {
        const state = { ...baseState, windReport: true, windSpeed: 99 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('clearWindReport')
        expect(result.setWindReport).toBe(false)
      })

      test('windReport takes priority over firstTime', () => {
        const state = { ...baseState, windReport: true, windSpeed: 0, firstTime: true, loopCounter: 0, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playWindReport')
      })
    })

    describe('priority 4: firstTime', () => {
      test('plays first time dialog when loopCounter is 0', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 0, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playFirstTimeDialog')
      })

      test('first time dialog uses MulleInfoTalk', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 0, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.talkType).toBe('MulleInfoTalk')
      })

      test('first time dialog uses random selection', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 0, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.selectRandom).toBe(true)
      })

      test('first time dialog deletes after play', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 0, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result.deleteAfterPlay).toBe(true)
      })

      test('returns null when firstTime but loopCounter > 0', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 50, firstDialogListLength: 3 }
        const result = resolveQuayDialogPriority(state)
        expect(result).toBeNull()
      })

      test('clears firstTime when list is empty', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 0, firstDialogListLength: 0 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('clearFirstTime')
        expect(result.setFirstTime).toBe(false)
      })

      test('firstTime takes priority over general dialog', () => {
        const state = { ...baseState, firstTime: true, loopCounter: 0, firstDialogListLength: 2 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playFirstTimeDialog')
      })
    })

    describe('priority 5: general dialog', () => {
      test('plays general dialog when loopCounter is 0 and not firstTime', () => {
        const state = { ...baseState, loopCounter: 0 }
        const result = resolveQuayDialogPriority(state)
        expect(result.action).toBe('playGeneralDialog')
      })

      test('general dialog uses MulleNormalTalk', () => {
        const state = { ...baseState, loopCounter: 0 }
        const result = resolveQuayDialogPriority(state)
        expect(result.talkType).toBe('MulleNormalTalk')
      })

      test('general dialog uses random selection', () => {
        const state = { ...baseState, loopCounter: 0 }
        const result = resolveQuayDialogPriority(state)
        expect(result.selectRandom).toBe(true)
      })

      test('returns null when loopCounter > 0 and no other triggers', () => {
        const state = { ...baseState, loopCounter: 100 }
        const result = resolveQuayDialogPriority(state)
        expect(result).toBeNull()
      })
    })

    describe('no action scenarios', () => {
      test('returns null when nothing to do', () => {
        const result = resolveQuayDialogPriority(baseState)
        expect(result).toBeNull()
      })

      test('returns null when only loopCounter is positive', () => {
        const state = { ...baseState, loopCounter: 500 }
        const result = resolveQuayDialogPriority(state)
        expect(result).toBeNull()
      })
    })
  })

  // ===========================================================================
  // Return value shapes
  // ===========================================================================

  describe('return value shapes', () => {
    describe('computeMissionInit', () => {
      test('returns object with setBelly and giveMissions', () => {
        const result = computeMissionInit({ m20: false, m2: false, m13: false })
        expect(result).toHaveProperty('setBelly')
        expect(result).toHaveProperty('giveMissions')
        expect(typeof result.setBelly).toBe('number')
        expect(Array.isArray(result.giveMissions)).toBe(true)
      })
    })

    describe('computeDeliveryResult', () => {
      test('returns object with type, items, and flags', () => {
        const result = computeDeliveryResult([['Hull1']], 1)
        expect(result).toHaveProperty('type')
        expect(result).toHaveProperty('items')
        expect(result).toHaveProperty('setDeliveryMade')
        expect(result).toHaveProperty('setGotNewHull')
        expect(result).toHaveProperty('setGotNewParts')
      })
    })

    describe('computeSailResult', () => {
      test('returns object with canSail, world, and flags', () => {
        const result = computeSailResult({ engine: true, sailWithPole: false, oar: false, material: 1 })
        expect(result).toHaveProperty('canSail')
        expect(result).toHaveProperty('world')
        expect(result).toHaveProperty('incrementBuiltBoats')
        expect(result).toHaveProperty('clearDeliveryMade')
        expect(result).toHaveProperty('noSailSound')
      })
    })

    describe('getWeatherAmbient', () => {
      test('returns object with volume and sound when valid', () => {
        const result = getWeatherAmbient(1)
        expect(result).toHaveProperty('volume')
        expect(result).toHaveProperty('sound')
      })
    })
  })
})
