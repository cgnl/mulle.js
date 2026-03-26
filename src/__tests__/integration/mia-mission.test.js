/**
 * Integration test: Mia scene + computeMiaResult
 *
 * Verifies that MiaData.js correctly computes mission outcomes for
 * Mission 25 (first visit) and Mission 13 (bench delivery, repeatable).
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeMiaResult } = require('../../scenes/MiaData')
const MiaData = require('../../scenes/MiaData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission25Completed: false,
    isMission13Given: false,
    isMission13Completed: false,
    hasBench: false,
    randomPart: null,
    objectParts: [10, 20],
    ...overrides
  }
}

// ===========================================================================
// Integration: computeMiaResult
// ===========================================================================

describe('Mia mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. First visit no bench
  // -----------------------------------------------------------------------
  describe('first visit without bench', () => {
    const state = baseState()

    test('marker is nomission', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('nomission')
    })

    test('goTo is start', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('start')
    })

    test('completeMission25 = true', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(true)
    })

    test('givePart = objectParts[0]', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(10)
    })

    test('giveMission13 = true', () => {
      const result = computeMiaResult(state)
      expect(result.actions.giveMission13).toBe(true)
    })

    test('completeMission13 = false', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 2. First visit with bench
  // -----------------------------------------------------------------------
  describe('first visit with bench', () => {
    const state = baseState({ hasBench: true })

    test('marker is justDoITluck', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('justDoITluck')
    })

    test('goTo is start', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('start')
    })

    test('completeMission25 = true', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(true)
    })

    test('completeMission13 = true', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(true)
    })

    test('givePart = objectParts[0]', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(10)
    })
  })

  // -----------------------------------------------------------------------
  // 3. Return visit M13 given + bench + M13 already completed (infinite)
  // -----------------------------------------------------------------------
  describe('return visit infinite path (M13 already completed)', () => {
    const state = baseState({
      isMission25Completed: true,
      isMission13Given: true,
      isMission13Completed: true,
      hasBench: true,
      randomPart: 'Rudder7'
    })

    test('marker is infiniteJustDoit', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('infiniteJustDoit')
    })

    test('givePart = randomPart', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe('Rudder7')
    })

    test('completeMission13 = true', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 4. Return visit M13 given + bench + first M13 completion
  // -----------------------------------------------------------------------
  describe('return visit first M13 completion', () => {
    const state = baseState({
      isMission25Completed: true,
      isMission13Given: true,
      isMission13Completed: false,
      hasBench: true,
      objectParts: [10, 20]
    })

    test('marker is JustdoIt', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('JustdoIt')
    })

    test('givePart = objectParts[1]', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(20)
    })

    test('completeMission13 = true', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 5. Return visit M13 given, no bench
  // -----------------------------------------------------------------------
  describe('return visit M13 given no bench', () => {
    const state = baseState({
      isMission25Completed: true,
      isMission13Given: true,
      isMission13Completed: false,
      hasBench: false
    })

    test('marker is cantdoIT', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('cantdoIT')
    })

    test('completeMission13 = false', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(false)
    })

    test('givePart = null', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBeNull()
    })
  })

  // -----------------------------------------------------------------------
  // 6. Return visit M13 not given
  // -----------------------------------------------------------------------
  describe('return visit M13 not given', () => {
    const state = baseState({
      isMission25Completed: true,
      isMission13Given: false
    })

    test('marker is Done', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('Done')
    })

    test('no missions completed', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(false)
      expect(result.actions.completeMission13).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 7. goTo routing: first visit always 'start'
  // -----------------------------------------------------------------------
  describe('goTo routing for first visit', () => {
    test('first visit without bench → goTo start', () => {
      const result = computeMiaResult(baseState())
      expect(result.goTo).toBe('start')
    })

    test('first visit with bench → goTo start', () => {
      const result = computeMiaResult(baseState({ hasBench: true }))
      expect(result.goTo).toBe('start')
    })
  })

  // -----------------------------------------------------------------------
  // 8. goTo routing: return visit uses marker
  // -----------------------------------------------------------------------
  describe('goTo routing for return visit', () => {
    test('return visit uses marker as goTo', () => {
      const result = computeMiaResult(baseState({
        isMission25Completed: true,
        isMission13Given: true,
        hasBench: true,
        isMission13Completed: false
      }))
      expect(result.goTo).toBe(result.marker)
    })

    test('cantdoIT marker used as goTo', () => {
      const result = computeMiaResult(baseState({
        isMission25Completed: true,
        isMission13Given: true,
        hasBench: false
      }))
      expect(result.goTo).toBe('cantdoIT')
    })

    test('Done marker used as goTo', () => {
      const result = computeMiaResult(baseState({
        isMission25Completed: true,
        isMission13Given: false
      }))
      expect(result.goTo).toBe('Done')
    })
  })
})

// ===========================================================================
// Export verification
// ===========================================================================

describe('MiaData exports', () => {
  test('exports computeMiaResult as a function', () => {
    expect(typeof MiaData.computeMiaResult).toBe('function')
  })

  test('exports FRAME_LABELS as an array', () => {
    expect(Array.isArray(MiaData.FRAME_LABELS)).toBe(true)
    expect(MiaData.FRAME_LABELS.length).toBeGreaterThan(0)
  })

  test('exports externalParts as an array', () => {
    expect(Array.isArray(MiaData.externalParts)).toBe(true)
  })
})
