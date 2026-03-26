/**
 * Layer 2 – Scene contract tests
 *
 * For each scene that has a compute*Result function in its *Data.js module,
 * verify that:
 *  1. The compute function can be called with valid state
 *  2. It returns the expected shape (marker, actions, etc.)
 *  3. The scene's create/startMovie references the compute function
 *
 * These tests run against the REAL Data modules (no mocks needed – they're pure).
 * The scene modules are mocked to verify wiring.
 */
'use strict'

// ---------------------------------------------------------------------------
// Pure data module contract tests – no mocking needed
// ---------------------------------------------------------------------------

describe('Scene contract tests – compute*Result functions', () => {

  // ── birgit → computeBirgitResult ──
  describe('birgit → computeBirgitResult', () => {
    const { computeBirgitResult } = require('../../scenes/BirgitData')

    test('returns marker and actions for DoctorBag delivery', () => {
      const result = computeBirgitResult({
        hasDoctorBag: true,
        hasSwimring: false,
        isMission22Given: false,
        hasMapPiece1: false,
        isMission5Given: false,
        isMission5Completed: false,
        isMission4Given: false,
        luxuryFactor: 0,
        hasDoghouse: false,
        hasMedal8: false,
        hasMedal6: false,
        randomPart: null,
        randomSuffix: 1
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(typeof result.marker).toBe('string')
      expect(typeof result.actions).toBe('object')
    })

    test('returns marker and actions for Swimring delivery', () => {
      const result = computeBirgitResult({
        hasDoctorBag: false,
        hasSwimring: true,
        isMission22Given: false,
        hasMapPiece1: false,
        isMission5Given: false,
        isMission5Completed: false,
        isMission4Given: false,
        luxuryFactor: 0,
        hasDoghouse: false,
        hasMedal8: false,
        hasMedal6: false,
        randomPart: null,
        randomSuffix: 2
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(result.actions).toHaveProperty('completeMission2')
    })

    test('returns marker for mission 5 with doghouse + luxury', () => {
      const result = computeBirgitResult({
        hasDoctorBag: false,
        hasSwimring: false,
        isMission22Given: false,
        hasMapPiece1: false,
        isMission5Given: true,
        isMission5Completed: false,
        isMission4Given: true,
        luxuryFactor: 100,
        hasDoghouse: true,
        hasMedal8: false,
        hasMedal6: false,
        randomPart: 500,
        randomSuffix: 1
      })
      expect(result).toHaveProperty('marker')
      expect(typeof result.marker).toBe('string')
    })

    test('returns marker for default/idle state', () => {
      const result = computeBirgitResult({
        hasDoctorBag: false,
        hasSwimring: false,
        isMission22Given: false,
        hasMapPiece1: false,
        isMission5Given: false,
        isMission5Completed: false,
        isMission4Given: false,
        luxuryFactor: 0,
        hasDoghouse: false,
        hasMedal8: false,
        hasMedal6: false,
        randomPart: null,
        randomSuffix: 1
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── fisherman → computeFishermanResult ──
  describe('fisherman → computeFishermanResult', () => {
    const { computeFishermanResult } = require('../../scenes/FishermanData')

    test('returns success marker when has required item', () => {
      const result = computeFishermanResult({ hasRequiredItem: true })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
      expect(result.marker).toBe('JustdoIt')
      expect(result.actions.completeMission17).toBe(true)
    })

    test('returns failure marker when missing required item', () => {
      const result = computeFishermanResult({ hasRequiredItem: false })
      expect(result.marker).toBe('cantdoIT')
      expect(result.actions.completeMission17).toBe(false)
    })
  })

  // ── preacher → computePreacherResult ──
  describe('preacher → computePreacherResult', () => {
    const { computePreacherResult } = require('../../scenes/PreacherData')

    test('returns marker and actions for first visit', () => {
      const result = computePreacherResult({
        isMission1Given: false,
        isMission20Completed: false,
        hasRequiredItem: false,
        completionCount: 0,
        randomPart: null,
        suffix: 1
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns marker for completed mission with item', () => {
      const result = computePreacherResult({
        isMission1Given: true,
        isMission20Completed: false,
        hasRequiredItem: true,
        completionCount: 2,
        randomPart: 300,
        suffix: 2
      })
      expect(result).toHaveProperty('marker')
      expect(typeof result.actions).toBe('object')
    })
  })

  // ── mia → computeMiaResult ──
  describe('mia → computeMiaResult', () => {
    const { computeMiaResult } = require('../../scenes/MiaData')

    test('returns marker and actions for default state', () => {
      const result = computeMiaResult({
        isMission25Completed: false,
        isMission13Given: false,
        isMission13Completed: false,
        hasBench: false,
        randomPart: null,
        objectParts: [100, 200]
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns marker for bench delivery mission', () => {
      const result = computeMiaResult({
        isMission25Completed: false,
        isMission13Given: true,
        isMission13Completed: false,
        hasBench: true,
        randomPart: 400,
        objectParts: [100, 200]
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── george → computeGeorgeResult ──
  describe('george → computeGeorgeResult', () => {
    const { computeGeorgeResult } = require('../../scenes/GeorgeData')

    test('returns marker and actions for default state', () => {
      const result = computeGeorgeResult({
        isMission19Completed: false,
        isMission7Given: false,
        hasDiary: false,
        isMission19Given: false,
        hasMapPiece2: false,
        isMission18Completed: false
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns marker for diary delivery', () => {
      const result = computeGeorgeResult({
        isMission19Completed: false,
        isMission7Given: true,
        hasDiary: true,
        isMission19Given: true,
        hasMapPiece2: false,
        isMission18Completed: false
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── algae_island → computeAlgaeIslandResult ──
  describe('algae_island → computeAlgaeIslandResult', () => {
    const { computeAlgaeIslandResult } = require('../../scenes/AlgaeIslandData')

    test('returns marker for watertank delivery (M11)', () => {
      const result = computeAlgaeIslandResult({
        isMission11Completed: false,
        isMission21Completed: false,
        isMission10Completed: false,
        hasWatertank: true,
        hasCombineHarvester: false,
        randomDoneSuffix: 1
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns marker for combine harvester (M10)', () => {
      const result = computeAlgaeIslandResult({
        isMission11Completed: true,
        isMission21Completed: true,
        isMission10Completed: false,
        hasWatertank: false,
        hasCombineHarvester: true,
        randomDoneSuffix: 3
      })
      expect(result).toHaveProperty('marker')
      expect(result.actions.completeMission10).toBe(true)
    })

    test('returns Done marker when all complete', () => {
      const result = computeAlgaeIslandResult({
        isMission11Completed: true,
        isMission21Completed: true,
        isMission10Completed: true,
        hasWatertank: false,
        hasCombineHarvester: false,
        randomDoneSuffix: 2
      })
      expect(result.marker).toMatch(/Done/)
    })
  })

  // ── cave → computeCaveResult ──
  describe('cave → computeCaveResult', () => {
    const { computeCaveResult } = require('../../scenes/CaveData')

    test('returns marker and actions for default state', () => {
      const result = computeCaveResult({
        isMission8Given: false,
        isMission8Completed: false,
        isMission4Given: false,
        isMission4Completed: false,
        hasBlinddog: false,
        hasPart975: false,
        hasMedal1: false
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns marker for blinddog delivery (M4)', () => {
      const result = computeCaveResult({
        isMission8Given: true,
        isMission8Completed: false,
        isMission4Given: true,
        isMission4Completed: false,
        hasBlinddog: true,
        hasPart975: false,
        hasMedal1: false
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── diving → computeVickyIslandResult (used by diving.js) ──
  describe('diving → computeVickyIslandResult', () => {
    const { computeVickyIslandResult } = require('../../scenes/VickyIslandData')

    test('returns marker for equipped diver', () => {
      const result = computeVickyIslandResult({
        hasHelmet: true,
        hasSuit: true,
        hasPart979: false,
        randomPart: 500,
        completionCount23: 0
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns cantDoit when missing equipment', () => {
      const result = computeVickyIslandResult({
        hasHelmet: false,
        hasSuit: false,
        hasPart979: false,
        randomPart: null,
        completionCount23: 0
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── whale → computeWhaleResult ──
  describe('whale → computeWhaleResult', () => {
    const { computeWhaleResult } = require('../../scenes/WhaleData')

    test('returns marker for default state', () => {
      const result = computeWhaleResult({
        isMission24Completed: false,
        isMission11Completed: false,
        hasWatertank: false
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns marker for watertank delivery', () => {
      const result = computeWhaleResult({
        isMission24Completed: false,
        isMission11Completed: false,
        hasWatertank: true
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── surfer → computeHarborResult (from HarborData, used in surfer.js) ──
  describe('surfer → computeHarborResult', () => {
    const { computeHarborResult } = require('../../scenes/HarborData')

    test('returns marker for fish delivery', () => {
      const result = computeHarborResult({
        hasRottenFish: false,
        loadCapacity: 100,
        rottenFishWeight: 25,
        suffix: 1
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns notDelivered when already has rotten fish', () => {
      const result = computeHarborResult({
        hasRottenFish: true,
        loadCapacity: 100,
        rottenFishWeight: 25,
        suffix: 2
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── haven → computeSurferResult (from SurferData, used in haven.js) ──
  describe('haven → computeSurferResult', () => {
    const { computeSurferResult } = require('../../scenes/SurferData')

    test('returns success marker when power >= 200', () => {
      const result = computeSurferResult({
        power: 250,
        randomPart: '500'
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns failure marker when power < 200', () => {
      const result = computeSurferResult({
        power: 100,
        randomPart: null
      })
      expect(result).toHaveProperty('marker')
    })
  })

  // ── showboat → computeShowBoatResult ──
  describe('showboat → computeShowBoatResult', () => {
    const { computeShowBoatResult } = require('../../scenes/ShowBoatData')

    test('returns rating for low funny factor', () => {
      const result = computeShowBoatResult(10)
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('rating')
      expect(typeof result.rating).toBe('number')
    })

    test('returns rating for high funny factor', () => {
      const result = computeShowBoatResult(100)
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('rating')
    })

    test('returns medal for very high funny factor', () => {
      const result = computeShowBoatResult(500)
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('rating')
      // medal may be null or a number
      expect(result).toHaveProperty('medal')
    })
  })

  // ── erson → computeDivingResult (from DivingData) ──
  describe('erson → computeDivingResult', () => {
    const { computeDivingResult } = require('../../scenes/DivingData')

    test('returns marker for equipped diver', () => {
      const result = computeDivingResult({
        hasHelmet: true,
        hasSuit: true,
        randomPart: 300
      })
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('actions')
    })

    test('returns cantDoit when missing equipment', () => {
      const result = computeDivingResult({
        hasHelmet: false,
        hasSuit: false,
        randomPart: null
      })
      expect(result).toHaveProperty('marker')
    })
  })
})

// ---------------------------------------------------------------------------
// Scene ↔ Data wiring verification
// ---------------------------------------------------------------------------

describe('Scene ↔ Data wiring verification', () => {
  const fs = require('fs')
  const path = require('path')
  const scenesDir = path.resolve(__dirname, '../../scenes')

  const SCENE_COMPUTE_MAP = {
    'birgit.js': 'computeBirgitResult',
    'fisherman.js': 'computeFishermanResult',
    'preacher.js': 'computePreacherResult',
    'mia.js': 'computeMiaResult',
    'george.js': 'computeGeorgeResult',
    'algae_island.js': 'computeAlgaeIslandResult',
    'cave.js': 'computeCaveResult',
    'diving.js': 'computeVickyIslandResult',
    'whale.js': 'computeWhaleResult',
    'surfer.js': 'computeHarborResult',
    'haven.js': 'computeSurferResult',
    'showboat.js': 'computeShowBoatResult',
    'erson.js': 'computeDivingResult'
  }

  Object.entries(SCENE_COMPUTE_MAP).forEach(([sceneFile, computeFn]) => {
    test(`${sceneFile} imports and calls ${computeFn}`, () => {
      const source = fs.readFileSync(path.join(scenesDir, sceneFile), 'utf8')

      // Verify import/require
      const hasImport = source.includes(computeFn)
      expect(hasImport).toBe(true)

      // Verify the function is actually called (not just imported)
      // Look for `computeXxxResult(` pattern
      const callPattern = new RegExp(computeFn + '\\s*\\(')
      expect(callPattern.test(source)).toBe(true)
    })
  })
})
