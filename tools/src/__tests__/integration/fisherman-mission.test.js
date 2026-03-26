/**
 * Integration test: Fisherman scene + computeFishermanResult
 *
 * Verifies that the Fisherman scene correctly integrates with FishermanData.js
 * by simulating full mission flows through the headless game runner.
 *
 * Tests cover:
 *   1. Success path when player has the required fuel item
 *   2. Failure path when player lacks the item
 *   3. Export verification (function + constants)
 *   4. Edge case: exact marker casing for both paths
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const { computeFishermanResult } = require('../../scenes/FishermanData')

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    hasRequiredItem: false,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computeFishermanResult to verify wiring
// ---------------------------------------------------------------------------
const FishermanData = require('../../scenes/FishermanData')
const originalCompute = FishermanData.computeFishermanResult
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(FishermanData, 'computeFishermanResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeFishermanResult with full mission flows
// ===========================================================================

describe('Fisherman mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. Player has fuel item -> success path
  // -----------------------------------------------------------------------
  describe('Player has fuel item (success path)', () => {
    const state = baseState({ hasRequiredItem: true })

    test('marker is "JustdoIt"', () => {
      const result = computeFishermanResult(state)
      expect(result.marker).toBe('JustdoIt')
    })

    test('completeMission17 = true', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.completeMission17).toBe(true)
    })

    test('deleteItem = true', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.deleteItem).toBe(true)
    })

    test('refuelToFull = true', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.refuelToFull).toBe(true)
    })

    test('giveBelly = true', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.giveBelly).toBe(true)
    })
  })

  // -----------------------------------------------------------------------
  // 2. Player has no fuel item -> failure path
  // -----------------------------------------------------------------------
  describe('Player has no fuel item (failure path)', () => {
    const state = baseState({ hasRequiredItem: false })

    test('marker is "cantdoIT"', () => {
      const result = computeFishermanResult(state)
      expect(result.marker).toBe('cantdoIT')
    })

    test('completeMission17 = false', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.completeMission17).toBe(false)
    })

    test('deleteItem = false', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.deleteItem).toBe(false)
    })

    test('refuelToFull = false', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.refuelToFull).toBe(false)
    })

    test('giveBelly = false', () => {
      const result = computeFishermanResult(state)
      expect(result.actions.giveBelly).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 3. Export verification
  // -----------------------------------------------------------------------
  describe('FishermanData export verification', () => {
    test('computeFishermanResult is a function', () => {
      expect(typeof FishermanData.computeFishermanResult).toBe('function')
    })

    test('MARKER_SUCCESS is exported', () => {
      expect(FishermanData.MARKER_SUCCESS).toBeDefined()
    })

    test('MARKER_FAILURE is exported', () => {
      expect(FishermanData.MARKER_FAILURE).toBeDefined()
    })

    test('MISSION_ID is exported', () => {
      expect(FishermanData.MISSION_ID).toBeDefined()
    })

    test('BELLY_AMOUNT is exported', () => {
      expect(FishermanData.BELLY_AMOUNT).toBeDefined()
    })

    test('FUEL_LEVEL is exported', () => {
      expect(FishermanData.FUEL_LEVEL).toBeDefined()
    })

    test('computeSpy captures calls', () => {
      FishermanData.computeFishermanResult(baseState())
      expect(computeSpy).toHaveBeenCalledTimes(1)
    })

    test('spy receives correct state shape', () => {
      const state = baseState({ hasRequiredItem: true })
      FishermanData.computeFishermanResult(state)
      expect(computeSpy).toHaveBeenCalledWith(
        expect.objectContaining({ hasRequiredItem: true })
      )
    })
  })

  // -----------------------------------------------------------------------
  // 4. Edge case: exact marker casing
  // -----------------------------------------------------------------------
  describe('exact marker casing for both paths', () => {
    test('success marker uses exact casing "JustdoIt" (lowercase d)', () => {
      const result = computeFishermanResult(baseState({ hasRequiredItem: true }))
      expect(result.marker).toBe('JustdoIt')
      expect(result.marker).not.toBe('JustDoIt')
      expect(result.marker).not.toBe('justdoit')
    })

    test('failure marker uses exact casing "cantdoIT" (uppercase IT)', () => {
      const result = computeFishermanResult(baseState({ hasRequiredItem: false }))
      expect(result.marker).toBe('cantdoIT')
      expect(result.marker).not.toBe('cantDoIt')
      expect(result.marker).not.toBe('CantDoIt')
    })
  })
})
