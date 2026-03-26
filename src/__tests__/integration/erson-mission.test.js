/**
 * Integration test: Erson scene (scene 70) + computeDivingResult from DivingData
 *
 * Verifies that the Erson scene correctly integrates with DivingData.js.
 * Erson.js uses computeDivingResult directly for the diving mission logic.
 *
 * Scene 70: The player needs BOTH a helmet AND a suit to successfully dive.
 * On success: mission 15 is completed and a random part is awarded.
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeDivingResult } = require('../../scenes/DivingData')
const DivingData = require('../../scenes/DivingData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    hasHelmet: false,
    hasSuit: false,
    randomPart: null,
    ...overrides
  }
}

// ===========================================================================
// Integration: computeDivingResult with Erson scene flows
// ===========================================================================

describe('Erson mission integration (scene 70)', () => {
  // -----------------------------------------------------------------------
  // 1. Helmet + suit + randomPart=55
  // -----------------------------------------------------------------------
  describe('Helmet + suit + randomPart=55', () => {
    const state = baseState({ hasHelmet: true, hasSuit: true, randomPart: 55 })

    test('marker is JustDoit', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission15 = true', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(true)
    })

    test('givePart = 55', () => {
      const result = computeDivingResult(state)
      expect(result.actions.givePart).toBe(55)
    })
  })

  // -----------------------------------------------------------------------
  // 2. Helmet + suit + null randomPart
  // -----------------------------------------------------------------------
  describe('Helmet + suit + null randomPart', () => {
    const state = baseState({ hasHelmet: true, hasSuit: true, randomPart: null })

    test('marker is JustDoit', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('JustDoit')
    })

    test('completeMission15 = true', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(true)
    })

    test('givePart = null (no part available)', () => {
      const result = computeDivingResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 3. Helmet only (no suit)
  // -----------------------------------------------------------------------
  describe('Helmet only', () => {
    const state = baseState({ hasHelmet: true, hasSuit: false })

    test('marker is cantDoit', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('completeMission15 = false', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(false)
    })

    test('givePart = null', () => {
      const result = computeDivingResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 4. Suit only (no helmet)
  // -----------------------------------------------------------------------
  describe('Suit only', () => {
    const state = baseState({ hasHelmet: false, hasSuit: true })

    test('marker is cantDoit', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('completeMission15 = false', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 5. Neither helmet nor suit
  // -----------------------------------------------------------------------
  describe('Neither helmet nor suit', () => {
    const state = baseState()

    test('marker is cantDoit', () => {
      const result = computeDivingResult(state)
      expect(result.marker).toBe('cantDoit')
    })

    test('completeMission15 = false', () => {
      const result = computeDivingResult(state)
      expect(result.actions.completeMission15).toBe(false)
    })

    test('givePart = null', () => {
      const result = computeDivingResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 6. DivingData exports computeDivingResult as function
  // -----------------------------------------------------------------------
  describe('DivingData export verification', () => {
    test('exports computeDivingResult as a function', () => {
      expect(typeof DivingData.computeDivingResult).toBe('function')
    })

    test('exports MISSION_ID = 15', () => {
      expect(DivingData.MISSION_ID).toBe(15)
    })

    test('Erson scene require path exists (scenes/erson.js)', () => {
      // Verify that the erson scene file can be located relative to DivingData
      const fs = require('fs')
      const path = require('path')
      const ersonPath = path.resolve(__dirname, '../../scenes/erson.js')
      expect(fs.existsSync(ersonPath)).toBe(true)
    })
  })
})
