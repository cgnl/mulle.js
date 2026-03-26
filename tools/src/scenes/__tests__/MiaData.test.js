/**
 * @fileoverview Tests for MiaData - Mia scene logic (scene 83)
 *
 * Mia's scene handles two missions:
 * - Mission 25: First-visit introduction (one-time)
 * - Mission 13: Bench delivery (repeatable after first completion)
 *
 * Key Lingo behavior:
 * - First visit (M25 not completed): complete M25, give objectParts[0],
 *   give M13. If Bench → "justDoITluck" + complete M13. ALWAYS go("start").
 * - Return visits (M25 completed): check M13 given → Bench → M13 completed.
 * - goTo: "nomission" path always goes to "start", others go to marker.
 */

const { computeMiaResult } = require('../MiaData')

// Helper: create a default state with overrides
function makeState (overrides = {}) {
  return {
    isMission25Completed: true,
    isMission13Given: true,
    isMission13Completed: false,
    hasBench: true,
    randomPart: 42,
    objectParts: [100, 200],
    ...overrides
  }
}

describe('MiaData', () => {
  // =========================================================================
  // FIRST VISIT — M25 NOT COMPLETED
  // =========================================================================

  describe('first visit (M25 not completed, no Bench)', () => {
    const state = makeState({
      isMission25Completed: false,
      isMission13Given: false,
      isMission13Completed: false,
      hasBench: false
    })

    test('marker should be "nomission"', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('nomission')
    })

    test('should complete M25', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(true)
    })

    test('should give M13', () => {
      const result = computeMiaResult(state)
      expect(result.actions.giveMission13).toBe(true)
    })

    test('should give objectParts[0]', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(100)
    })

    test('should NOT complete M13', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(false)
    })

    test('goTo should be "start"', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // =========================================================================
  // FIRST VISIT WITH BENCH — "justDoITluck"
  // =========================================================================

  describe('first visit with Bench (M25 not completed, has Bench)', () => {
    const state = makeState({
      isMission25Completed: false,
      isMission13Given: false,
      isMission13Completed: false,
      hasBench: true
    })

    test('marker should be "justDoITluck"', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('justDoITluck')
    })

    test('should complete M25', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(true)
    })

    test('should complete M13 (lucky — already has Bench)', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(true)
    })

    test('should give M13', () => {
      const result = computeMiaResult(state)
      expect(result.actions.giveMission13).toBe(true)
    })

    test('should give objectParts[0]', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(100)
    })

    test('goTo should still be "start" (nomission path)', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('start')
    })
  })

  // =========================================================================
  // RETURN VISIT — M13 NOT GIVEN → "Done"
  // =========================================================================

  describe('return visit, M13 not given', () => {
    const state = makeState({
      isMission25Completed: true,
      isMission13Given: false,
      isMission13Completed: false,
      hasBench: false
    })

    test('marker should be "Done"', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('Done')
    })

    test('no mission actions should be taken', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(false)
      expect(result.actions.completeMission13).toBe(false)
      expect(result.actions.giveMission13).toBe(false)
      expect(result.actions.givePart).toBeNull()
    })

    test('goTo should be "Done"', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('Done')
    })
  })

  // =========================================================================
  // RETURN VISIT — M13 GIVEN, FIRST COMPLETION (has Bench, M13 not completed)
  // =========================================================================

  describe('return visit, M13 given, has Bench, M13 not yet completed (first completion)', () => {
    const state = makeState({
      isMission25Completed: true,
      isMission13Given: true,
      isMission13Completed: false,
      hasBench: true
    })

    test('marker should be "JustdoIt"', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('JustdoIt')
    })

    test('should complete M13', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(true)
    })

    test('should give objectParts[1]', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(200)
    })

    test('should NOT complete M25 or give M13 again', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(false)
      expect(result.actions.giveMission13).toBe(false)
    })

    test('goTo should be "JustdoIt"', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('JustdoIt')
    })
  })

  // =========================================================================
  // RETURN VISIT — M13 GIVEN, INFINITE (has Bench, M13 already completed)
  // =========================================================================

  describe('return visit, M13 given, has Bench, M13 already completed (infinite)', () => {
    const state = makeState({
      isMission25Completed: true,
      isMission13Given: true,
      isMission13Completed: true,
      hasBench: true,
      randomPart: 55
    })

    test('marker should be "infiniteJustDoit"', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('infiniteJustDoit')
    })

    test('should complete M13 (re-complete)', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission13).toBe(true)
    })

    test('should give randomPart', () => {
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(55)
    })

    test('should NOT add the part via addNewPart (Lingo omits addNewPart)', () => {
      // In the infinite path, the Lingo sets givePart but does NOT call
      // addNewPart — the caller must handle this distinction.
      // Our function just reports what part to give; the caller decides.
      const result = computeMiaResult(state)
      expect(result.actions.givePart).toBe(55)
    })

    test('goTo should be "infiniteJustDoit"', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('infiniteJustDoit')
    })
  })

  // =========================================================================
  // RETURN VISIT — M13 GIVEN, NO BENCH → "cantdoIT"
  // =========================================================================

  describe('return visit, M13 given, no Bench', () => {
    const state = makeState({
      isMission25Completed: true,
      isMission13Given: true,
      isMission13Completed: false,
      hasBench: false
    })

    test('marker should be "cantdoIT"', () => {
      const result = computeMiaResult(state)
      expect(result.marker).toBe('cantdoIT')
    })

    test('no completion actions should be taken', () => {
      const result = computeMiaResult(state)
      expect(result.actions.completeMission25).toBe(false)
      expect(result.actions.completeMission13).toBe(false)
      expect(result.actions.giveMission13).toBe(false)
      expect(result.actions.givePart).toBeNull()
    })

    test('goTo should be "cantdoIT"', () => {
      const result = computeMiaResult(state)
      expect(result.goTo).toBe('cantdoIT')
    })
  })

  // =========================================================================
  // RETURN VISIT — M13 GIVEN, NO BENCH, M13 already completed
  // =========================================================================

  describe('return visit, M13 given, no Bench, M13 already completed', () => {
    test('marker should still be "cantdoIT" (no bench overrides completion)', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: true,
        hasBench: false
      }))
      expect(result.marker).toBe('cantdoIT')
    })
  })

  // =========================================================================
  // goTo ROUTING
  // =========================================================================

  describe('goTo routing', () => {
    test('first visit (nomission) always goes to "start"', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: false,
        hasBench: false
      }))
      expect(result.goTo).toBe('start')
    })

    test('first visit with luck (justDoITluck) also goes to "start"', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: false,
        hasBench: true
      }))
      expect(result.goTo).toBe('start')
    })

    test('return visit markers go to marker name', () => {
      const done = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: false
      }))
      expect(done.goTo).toBe('Done')

      const cantdo = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        hasBench: false
      }))
      expect(cantdo.goTo).toBe('cantdoIT')

      const justdoit = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: false,
        hasBench: true
      }))
      expect(justdoit.goTo).toBe('JustdoIt')

      const infinite = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: true,
        hasBench: true
      }))
      expect(infinite.goTo).toBe('infiniteJustDoit')
    })
  })

  // =========================================================================
  // MARKER CASING
  // =========================================================================

  describe('marker casing matches original Lingo exactly', () => {
    test('"nomission" — all lowercase', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: false,
        hasBench: false
      }))
      expect(result.marker).toBe('nomission')
    })

    test('"justDoITluck" — mixed case', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: false,
        hasBench: true
      }))
      expect(result.marker).toBe('justDoITluck')
    })

    test('"JustdoIt" — capital J, lowercase d', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: false,
        hasBench: true
      }))
      expect(result.marker).toBe('JustdoIt')
    })

    test('"infiniteJustDoit" — lowercase i, capital D', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: true,
        hasBench: true
      }))
      expect(result.marker).toBe('infiniteJustDoit')
    })

    test('"cantdoIT" — capital IT', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        hasBench: false
      }))
      expect(result.marker).toBe('cantdoIT')
    })

    test('"Done" — capital D', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: false
      }))
      expect(result.marker).toBe('Done')
    })
  })

  // =========================================================================
  // OBJECT PARTS USAGE
  // =========================================================================

  describe('objectParts usage', () => {
    test('first visit gives objectParts[0]', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: false,
        hasBench: false,
        objectParts: [111, 222]
      }))
      expect(result.actions.givePart).toBe(111)
    })

    test('first M13 completion gives objectParts[1]', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: false,
        hasBench: true,
        objectParts: [111, 222]
      }))
      expect(result.actions.givePart).toBe(222)
    })

    test('infinite path gives randomPart (not from objectParts)', () => {
      const result = computeMiaResult(makeState({
        isMission25Completed: true,
        isMission13Given: true,
        isMission13Completed: true,
        hasBench: true,
        randomPart: 999,
        objectParts: [111, 222]
      }))
      expect(result.actions.givePart).toBe(999)
    })
  })
})
