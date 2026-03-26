/**
 * Integration test: Lighthouse scene + computeLighthouseResult
 *
 * Verifies that the Lighthouse scene correctly computes markers, goTo targets,
 * and side-effects based on mission 7/8 status and diary inventory.
 *
 * Logic from scene 85 (decompiled Lingo):
 *   M7 completed + M8 given       -> 'suit',  goTo='suit',      completeMission8, giveSuit
 *   M7 completed + M8 not given   -> 'leave', goTo='Start'
 *   M7 not completed + M7 given + no diary  -> 'Diary', goTo='StartDiary', giveDiary
 *   M7 not completed + M7 given + has diary -> 'Leave', goTo='Start'
 *   M7 not completed + M7 not given         -> 'Leave', goTo='Start'
 */
'use strict'

const { registerAllMocks } = require('../headless/mocks')
registerAllMocks()

const LighthouseData = require('../../scenes/LighthouseData')
const { computeLighthouseResult } = LighthouseData

// ---------------------------------------------------------------------------
// Helper: base state factory
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
    isMission7Completed: false,
    isMission8Given: false,
    isMission7Given: false,
    hasDiary: false,
    ...overrides
  }
}

// ---------------------------------------------------------------------------
// Spy on computeLighthouseResult
// ---------------------------------------------------------------------------
let computeSpy

beforeEach(() => {
  computeSpy = jest.spyOn(LighthouseData, 'computeLighthouseResult')
})

afterEach(() => {
  computeSpy.mockRestore()
})

// ===========================================================================
// Integration: computeLighthouseResult with full mission flows
// ===========================================================================

describe('Lighthouse mission integration', () => {
  // -----------------------------------------------------------------------
  // 1. M7 completed + M8 given -> 'suit', goTo='suit', completeMission8, giveSuit
  // -----------------------------------------------------------------------
  describe('M7 completed + M8 given (suit delivery)', () => {
    const state = baseState({ isMission7Completed: true, isMission8Given: true })

    test('marker is "suit"', () => {
      const result = computeLighthouseResult(state)
      expect(result.marker).toBe('suit')
    })

    test('goTo is "suit"', () => {
      const result = computeLighthouseResult(state)
      expect(result.goTo).toBe('suit')
    })

    test('completeMission8 = true', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.completeMission8).toBe(true)
    })

    test('giveSuit = true', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.giveSuit).toBe(true)
    })

    test('giveDiary = false', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 2. M7 completed + M8 not given -> 'leave', goTo='Start'
  // -----------------------------------------------------------------------
  describe('M7 completed + M8 not given', () => {
    const state = baseState({ isMission7Completed: true, isMission8Given: false })

    test('marker is "leave" (lowercase)', () => {
      const result = computeLighthouseResult(state)
      expect(result.marker).toBe('leave')
    })

    test('goTo is "Start"', () => {
      const result = computeLighthouseResult(state)
      expect(result.goTo).toBe('Start')
    })

    test('no actions triggered', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 3. M7 not completed + M7 given + no diary -> 'Diary', goTo='StartDiary', giveDiary
  // -----------------------------------------------------------------------
  describe('M7 not completed + M7 given + no diary (give Diary)', () => {
    const state = baseState({ isMission7Given: true, hasDiary: false })

    test('marker is "Diary" (uppercase D)', () => {
      const result = computeLighthouseResult(state)
      expect(result.marker).toBe('Diary')
    })

    test('goTo is "StartDiary"', () => {
      const result = computeLighthouseResult(state)
      expect(result.goTo).toBe('StartDiary')
    })

    test('giveDiary = true', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.giveDiary).toBe(true)
    })

    test('no mission completion or suit', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveSuit).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 4. M7 not completed + M7 given + has diary -> 'Leave', goTo='Start'
  // -----------------------------------------------------------------------
  describe('M7 not completed + M7 given + has diary', () => {
    const state = baseState({ isMission7Given: true, hasDiary: true })

    test('marker is "Leave" (uppercase L)', () => {
      const result = computeLighthouseResult(state)
      expect(result.marker).toBe('Leave')
    })

    test('goTo is "Start"', () => {
      const result = computeLighthouseResult(state)
      expect(result.goTo).toBe('Start')
    })

    test('no actions triggered', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 5. M7 not completed + M7 not given -> 'Leave', goTo='Start'
  // -----------------------------------------------------------------------
  describe('M7 not completed + M7 not given', () => {
    const state = baseState()

    test('marker is "Leave" (uppercase L)', () => {
      const result = computeLighthouseResult(state)
      expect(result.marker).toBe('Leave')
    })

    test('goTo is "Start"', () => {
      const result = computeLighthouseResult(state)
      expect(result.goTo).toBe('Start')
    })

    test('no actions triggered', () => {
      const result = computeLighthouseResult(state)
      expect(result.actions.completeMission8).toBe(false)
      expect(result.actions.giveSuit).toBe(false)
      expect(result.actions.giveDiary).toBe(false)
    })
  })

  // -----------------------------------------------------------------------
  // 6. Marker casing: 'suit' vs 'leave' vs 'Leave' vs 'Diary'
  // -----------------------------------------------------------------------
  describe('Marker casing matches Lingo originals', () => {
    test('"suit" is all lowercase (M7 completed + M8 given)', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Completed: true, isMission8Given: true
      }))
      expect(result.marker).toBe('suit')
      expect(result.marker).not.toBe('Suit')
    })

    test('"leave" is all lowercase (M7 completed + M8 not given)', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Completed: true, isMission8Given: false
      }))
      expect(result.marker).toBe('leave')
      expect(result.marker).not.toBe('Leave')
    })

    test('"Leave" has uppercase L (M7 not completed + M7 given + has diary)', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Given: true, hasDiary: true
      }))
      expect(result.marker).toBe('Leave')
      expect(result.marker).not.toBe('leave')
    })

    test('"Diary" has uppercase D (M7 not completed + M7 given + no diary)', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Given: true, hasDiary: false
      }))
      expect(result.marker).toBe('Diary')
      expect(result.marker).not.toBe('diary')
    })
  })

  // -----------------------------------------------------------------------
  // 7. goTo mapping verification
  // -----------------------------------------------------------------------
  describe('goTo mapping verification', () => {
    test('"suit" marker maps to "suit" goTo', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Completed: true, isMission8Given: true
      }))
      expect(result.goTo).toBe('suit')
    })

    test('"leave" marker maps to "Start" goTo', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Completed: true, isMission8Given: false
      }))
      expect(result.goTo).toBe('Start')
    })

    test('"Leave" marker maps to "Start" goTo', () => {
      const result = computeLighthouseResult(baseState())
      expect(result.goTo).toBe('Start')
    })

    test('"Diary" marker maps to "StartDiary" goTo', () => {
      const result = computeLighthouseResult(baseState({
        isMission7Given: true, hasDiary: false
      }))
      expect(result.goTo).toBe('StartDiary')
    })
  })

  // -----------------------------------------------------------------------
  // 8. Export verification
  // -----------------------------------------------------------------------
  describe('LighthouseData exports', () => {
    test('exports MARKER_GOTO as an object', () => {
      expect(typeof LighthouseData.MARKER_GOTO).toBe('object')
      expect(LighthouseData.MARKER_GOTO).not.toBeNull()
    })

    test('MARKER_GOTO contains all expected keys', () => {
      expect(LighthouseData.MARKER_GOTO).toHaveProperty('Diary', 'StartDiary')
      expect(LighthouseData.MARKER_GOTO).toHaveProperty('Leave', 'Start')
      expect(LighthouseData.MARKER_GOTO).toHaveProperty('leave', 'Start')
      expect(LighthouseData.MARKER_GOTO).toHaveProperty('suit', 'suit')
    })

    test('exports computeLighthouseResult as a function', () => {
      expect(typeof LighthouseData.computeLighthouseResult).toBe('function')
    })
  })
})
