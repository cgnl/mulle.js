/**
 * @fileoverview Tests for BirgitData - Birgit's Strand scene logic (scene 77)
 * Based on: decompiled_lingo/77/77/casts/Internal/ParentScript 1 - Dir.ls
 *
 * The original Lingo uses a cascading-overwrite pattern: sequential if-blocks
 * each potentially overwrite myMarker. The LAST applicable block wins.
 *
 * Execution order:
 *   1. DoctorBag  → suffix "BagNoRing", Pills, complete M3
 *   2. Swimring   → suffix "Ring" (OVERWRITES), random part, complete M2
 *   3. Default    → "JustDoIt" + suffix (+ random(2) if no suffix)
 *   4. Mission 22 → "deliverMap" + suffix
 *   5. Mission 5  → "JustDoItPrima"/"cantDoItPrima" + suffix
 *   6. Mission 4  → ONLY if M5 NOT given: "JustDoItDog"/"CantDoItDog" + suffix
 *   7. M5 done    → OVERWRITES all: "justDoItring" or "SC" prefix variants
 *   8. Bag delete  → only if suffix is still "BagNoRing"
 *   9. Belly 1000  → ALWAYS
 */

const { computeBirgitResult } = require('../BirgitData')

// ---------------------------------------------------------------------------
// Helper: default state with all flags off / neutral values
// ---------------------------------------------------------------------------
function baseState (overrides = {}) {
  return {
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
    randomSuffix: 1,
    ...overrides
  }
}

// ===========================================================================
// Item checks: DoctorBag / Swimring (Blocks 1 & 2)
// ===========================================================================

describe('BirgitData', () => {
  describe('Item checks (DoctorBag / Swimring)', () => {
    test('neither item → suffix undefined, marker "JustDoIt1" (randomSuffix=1)', () => {
      const result = computeBirgitResult(baseState({ randomSuffix: 1 }))
      expect(result.suffix).toBeUndefined()
      expect(result.marker).toBe('JustDoIt1')
    })

    test('neither item → marker "JustDoIt2" (randomSuffix=2)', () => {
      const result = computeBirgitResult(baseState({ randomSuffix: 2 }))
      expect(result.marker).toBe('JustDoIt2')
    })

    test('DoctorBag only → suffix "BagNoRing", completes M3, gives Pills', () => {
      const result = computeBirgitResult(baseState({ hasDoctorBag: true }))
      expect(result.suffix).toBe('BagNoRing')
      expect(result.marker).toBe('JustDoItBagNoRing')
      expect(result.actions.completeMission3).toBe(true)
      expect(result.actions.givePills).toBe(true)
    })

    test('DoctorBag only → DoctorBag is deleted (suffix stays "BagNoRing")', () => {
      const result = computeBirgitResult(baseState({ hasDoctorBag: true }))
      expect(result.actions.deleteDoctorBag).toBe(true)
    })

    test('Swimring only → suffix "Ring", completes M2, gives random part, deletes Swimring', () => {
      const result = computeBirgitResult(baseState({ hasSwimring: true }))
      expect(result.suffix).toBe('Ring')
      expect(result.marker).toBe('JustDoItRing')
      expect(result.actions.completeMission2).toBe(true)
      expect(result.actions.giveRandomPart).toBe(true)
      expect(result.actions.deleteSwimring).toBe(true)
    })

    test('Swimring only → no DoctorBag deletion', () => {
      const result = computeBirgitResult(baseState({ hasSwimring: true }))
      expect(result.actions.deleteDoctorBag).toBe(false)
    })

    test('BOTH items → Swimring OVERWRITES suffix to "Ring"', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true
      }))
      expect(result.suffix).toBe('Ring')
      expect(result.marker).toBe('JustDoItRing')
    })

    test('BOTH items → BOTH M2 and M3 completed', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true
      }))
      expect(result.actions.completeMission2).toBe(true)
      expect(result.actions.completeMission3).toBe(true)
    })

    test('BOTH items → Pills given AND random part given', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true
      }))
      expect(result.actions.givePills).toBe(true)
      expect(result.actions.giveRandomPart).toBe(true)
    })

    test('BOTH items → DoctorBag NOT deleted (suffix overwritten to "Ring")', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true
      }))
      // Line 92: if tmpStartSuffix = "BagNoRing" — but suffix is now "Ring"
      expect(result.actions.deleteDoctorBag).toBe(false)
    })

    test('BOTH items → Swimring IS deleted', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true
      }))
      expect(result.actions.deleteSwimring).toBe(true)
    })
  })

  // ===========================================================================
  // Mission 22 (Block 4)
  // ===========================================================================

  describe('Mission 22 (deliver map)', () => {
    test('M22 given, no MapPiece1 → gives MapPiece1, completes M22, marker "deliverMap"', () => {
      const result = computeBirgitResult(baseState({
        isMission22Given: true,
        hasMapPiece1: false,
        randomSuffix: 1
      }))
      expect(result.actions.giveMapPiece1).toBe(true)
      expect(result.actions.completeMission22).toBe(true)
      expect(result.marker).toBe('deliverMap')
    })

    test('M22 given, no MapPiece1, with DoctorBag → marker "deliverMapBagNoRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission22Given: true,
        hasMapPiece1: false,
        hasDoctorBag: true
      }))
      expect(result.marker).toBe('deliverMapBagNoRing')
    })

    test('M22 given, no MapPiece1, with Swimring → marker "deliverMapRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission22Given: true,
        hasMapPiece1: false,
        hasSwimring: true
      }))
      expect(result.marker).toBe('deliverMapRing')
    })

    test('M22 given, has MapPiece1 → no change (M22 not completed again)', () => {
      const result = computeBirgitResult(baseState({
        isMission22Given: true,
        hasMapPiece1: true,
        randomSuffix: 2
      }))
      expect(result.actions.giveMapPiece1).toBe(false)
      expect(result.actions.completeMission22).toBe(false)
      // Marker stays as default
      expect(result.marker).toBe('JustDoIt2')
    })

    test('M22 not given → no change', () => {
      const result = computeBirgitResult(baseState({
        isMission22Given: false,
        randomSuffix: 1
      }))
      expect(result.actions.giveMapPiece1).toBe(false)
      expect(result.actions.completeMission22).toBe(false)
      expect(result.marker).toBe('JustDoIt1')
    })
  })

  // ===========================================================================
  // Mission 5 given (Block 5 — Prima Trip)
  // ===========================================================================

  describe('Mission 5 given (Prima Trip)', () => {
    test('M5 given, luxury > 15, no medal 8 → "JustDoItPrima", awards medal 6', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 16,
        hasMedal8: false,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('JustDoItPrima')
      expect(result.actions.awardMedal6).toBe(true)
    })

    test('M5 given, luxury > 15, has medal 8 → "JustDoItPrima", NO medal 6', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 16,
        hasMedal8: true,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('JustDoItPrima')
      expect(result.actions.awardMedal6).toBe(false)
    })

    test('M5 given, luxury <= 15 → "cantDoItPrima"', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 15,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('cantDoItPrima')
    })

    test('M5 given, luxury = 15 (boundary) → "cantDoItPrima" (strict >)', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 15,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('cantDoItPrima')
    })

    test('M5 given, luxury > 15, with DoctorBag → "JustDoItPrimaBagNoRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 20,
        hasDoctorBag: true,
        hasMedal8: false
      }))
      expect(result.marker).toBe('JustDoItPrimaBagNoRing')
    })

    test('M5 given, luxury <= 15, with Swimring → "cantDoItPrimaRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 10,
        hasSwimring: true
      }))
      expect(result.marker).toBe('cantDoItPrimaRing')
    })
  })

  // ===========================================================================
  // Mission 4 (Block 6 — Doghouse)
  // ===========================================================================

  describe('Mission 4 (Doghouse)', () => {
    test('M4 given, M5 NOT given, has Doghouse → "JustDoItDog", gives M5, gives Blinddog', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        hasDoghouse: true,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('JustDoItDog')
      expect(result.actions.giveMission5).toBe(true)
      expect(result.actions.giveBlinddog).toBe(true)
    })

    test('M4 given, M5 NOT given, no Doghouse → "CantDoItDog"', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        hasDoghouse: false,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('CantDoItDog')
      expect(result.actions.giveMission5).toBe(false)
      expect(result.actions.giveBlinddog).toBe(false)
    })

    test('M4 given, M5 already given → M4 block SKIPPED (M5 block runs)', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: true,
        hasDoghouse: true,
        luxuryFactor: 16,
        hasMedal8: false,
        randomSuffix: 1
      }))
      // M5 block runs instead, not M4 block
      expect(result.marker).toBe('JustDoItPrima')
      expect(result.actions.giveMission5).toBe(false)
      expect(result.actions.giveBlinddog).toBe(false)
    })

    test('M4 given, M5 NOT given, Doghouse, with DoctorBag → "JustDoItDogBagNoRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        hasDoghouse: true,
        hasDoctorBag: true
      }))
      expect(result.marker).toBe('JustDoItDogBagNoRing')
    })

    test('M4 given, M5 NOT given, no Doghouse, with Swimring → "CantDoItDogRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        hasDoghouse: false,
        hasSwimring: true
      }))
      expect(result.marker).toBe('CantDoItDogRing')
    })

    test('M4 NOT given, M5 NOT given → M4 block not entered', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: false,
        isMission5Given: false,
        randomSuffix: 2
      }))
      expect(result.marker).toBe('JustDoIt2')
      expect(result.actions.giveMission5).toBe(false)
      expect(result.actions.giveBlinddog).toBe(false)
    })
  })

  // ===========================================================================
  // Mission 5 Completed (Block 7 — SC prefix)
  // ===========================================================================

  describe('Mission 5 completed (SC prefix)', () => {
    test('M5 completed, tmpRing=1 (Swimring) → "justDoItring" (lowercase!)', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        hasSwimring: true
      }))
      expect(result.marker).toBe('justDoItring')
    })

    test('M5 completed, no ring, luxury > 15, no medal 6 → "SCJustDoItPrima", awards medal 6', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal6: false,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('SCJustDoItPrima')
      expect(result.actions.awardMedal6).toBe(true)
    })

    test('M5 completed, no ring, luxury > 15, has medal 6 → "SCJustDoItPrima", NO medal', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal6: true,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('SCJustDoItPrima')
      expect(result.actions.awardMedal6).toBe(false)
    })

    test('M5 completed, no ring, luxury <= 15 → "SCcantDoItPrima"', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 15,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('SCcantDoItPrima')
    })

    test('M5 completed, no ring, luxury > 15, with DoctorBag → "SCJustDoItPrimaBagNoRing"', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 20,
        hasDoctorBag: true,
        hasMedal6: false
      }))
      expect(result.marker).toBe('SCJustDoItPrimaBagNoRing')
    })

    test('M5 completed, no ring, luxury <= 15, with Swimring → "justDoItring" (ring overrides)', () => {
      // Swimring sets tmpRing=1, which takes priority in the M5-completed block
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 10,
        hasSwimring: true
      }))
      expect(result.marker).toBe('justDoItring')
    })
  })

  // ===========================================================================
  // Always-actions
  // ===========================================================================

  describe('Always-actions', () => {
    test('Belly 1000 is ALWAYS given (no items, no missions)', () => {
      const result = computeBirgitResult(baseState())
      expect(result.actions.giveBelly).toBe(true)
    })

    test('Belly 1000 is given even with complex state', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true,
        isMission5Completed: true,
        luxuryFactor: 20
      }))
      expect(result.actions.giveBelly).toBe(true)
    })

    test('DoctorBag deleted only when suffix is "BagNoRing" (DoctorBag only)', () => {
      const result = computeBirgitResult(baseState({ hasDoctorBag: true }))
      expect(result.actions.deleteDoctorBag).toBe(true)
    })

    test('DoctorBag NOT deleted when suffix overwritten by Swimring', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true
      }))
      expect(result.actions.deleteDoctorBag).toBe(false)
    })

    test('DoctorBag NOT deleted when no DoctorBag', () => {
      const result = computeBirgitResult(baseState())
      expect(result.actions.deleteDoctorBag).toBe(false)
    })
  })

  // ===========================================================================
  // Cascading overwrite tests
  // ===========================================================================

  describe('Cascading overwrites', () => {
    test('M22 + M5 given → M5 overwrites M22 marker', () => {
      const result = computeBirgitResult(baseState({
        isMission22Given: true,
        hasMapPiece1: false,
        isMission5Given: true,
        luxuryFactor: 16,
        hasMedal8: false,
        randomSuffix: 1
      }))
      // M5 block (block 5) runs after M22 block (block 4)
      expect(result.marker).toBe('JustDoItPrima')
      // But M22 side-effects still happen
      expect(result.actions.giveMapPiece1).toBe(true)
      expect(result.actions.completeMission22).toBe(true)
    })

    test('M4 given + M5 completed → M5-completed overwrites M4 marker', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        isMission5Completed: true,
        hasDoghouse: true,
        luxuryFactor: 16,
        hasMedal6: false,
        randomSuffix: 1
      }))
      // M5-completed (block 7) overwrites M4 (block 6)
      expect(result.marker).toBe('SCJustDoItPrima')
      // But M4 side-effects still happen
      expect(result.actions.giveMission5).toBe(true)
      expect(result.actions.giveBlinddog).toBe(true)
    })

    test('all missions active → final marker from M5-completed block', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        isMission22Given: true,
        hasMapPiece1: false,
        isMission5Given: true,
        isMission5Completed: true,
        isMission4Given: true,
        hasDoghouse: true,
        luxuryFactor: 20,
        hasMedal8: false,
        hasMedal6: false,
        randomSuffix: 1
      }))
      // M5-completed is the last block, suffix="BagNoRing" (no Swimring)
      expect(result.marker).toBe('SCJustDoItPrimaBagNoRing')
    })

    test('all missions + Swimring → "justDoItring" overrides everything', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        hasSwimring: true,
        isMission22Given: true,
        hasMapPiece1: false,
        isMission5Given: true,
        isMission5Completed: true,
        isMission4Given: true,
        hasDoghouse: true,
        luxuryFactor: 20,
        hasMedal8: false,
        hasMedal6: false,
        randomSuffix: 1
      }))
      // tmpRing=1 due to Swimring, M5-completed checks tmpRing first
      expect(result.marker).toBe('justDoItring')
    })

    test('M22 overwrites default marker, but side-effects from items still apply', () => {
      const result = computeBirgitResult(baseState({
        hasDoctorBag: true,
        isMission22Given: true,
        hasMapPiece1: false
      }))
      expect(result.marker).toBe('deliverMapBagNoRing')
      expect(result.actions.completeMission3).toBe(true)
      expect(result.actions.givePills).toBe(true)
      expect(result.actions.giveMapPiece1).toBe(true)
      expect(result.actions.completeMission22).toBe(true)
    })

    test('M5 given overwrites M22 marker, but M22 side-effects persist', () => {
      const result = computeBirgitResult(baseState({
        hasSwimring: true,
        isMission22Given: true,
        hasMapPiece1: false,
        isMission5Given: true,
        luxuryFactor: 10
      }))
      // M5 block sets marker last (before M5-completed which isn't active)
      expect(result.marker).toBe('cantDoItPrimaRing')
      // M22 side-effects still happened
      expect(result.actions.giveMapPiece1).toBe(true)
      expect(result.actions.completeMission22).toBe(true)
      // Swimring side-effects
      expect(result.actions.completeMission2).toBe(true)
    })
  })

  // ===========================================================================
  // Medal 6 award logic (awarded in TWO different blocks)
  // ===========================================================================

  describe('Medal 6 award logic', () => {
    test('M5-given block: awards medal 6 based on medal 8 absence', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 16,
        hasMedal8: false
      }))
      expect(result.actions.awardMedal6).toBe(true)
    })

    test('M5-given block: does NOT award medal 6 when medal 8 present', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 16,
        hasMedal8: true
      }))
      expect(result.actions.awardMedal6).toBe(false)
    })

    test('M5-completed block: awards medal 6 based on medal 6 absence', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal6: false
      }))
      expect(result.actions.awardMedal6).toBe(true)
    })

    test('M5-completed block: does NOT award medal 6 when medal 6 already present', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal6: true
      }))
      expect(result.actions.awardMedal6).toBe(false)
    })

    test('M5-given (no medal8) + M5-completed (has medal6) → medal 6 awarded by block 5, block 7 sees it', () => {
      // Block 5: no medal 8 → calls addMedal(boat, 6) → awardMedal6 = true
      // Block 7: getMedal(boat, 6) now returns true (either from input hasMedal6
      // or from block 5 awarding it) → else branch, no re-award
      // Net result: awardMedal6 = true (from block 5)
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal8: false,
        hasMedal6: true
      }))
      expect(result.actions.awardMedal6).toBe(true)
    })

    test('M5-given (has medal8) + M5-completed (no medal6) → M5-completed overrides to true', () => {
      // Block 5 sets awardMedal6 = false (has medal8)
      // Block 7 overwrites awardMedal6 = true (no medal6)
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal8: true,
        hasMedal6: false
      }))
      expect(result.actions.awardMedal6).toBe(true)
    })

    test('M5-completed with ring → medal 6 NOT awarded (ring path has no medal logic)', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        hasSwimring: true,
        luxuryFactor: 20,
        hasMedal6: false
      }))
      // tmpRing=1 → "justDoItring" path, no medal 6 award in this path
      // But block 5 didn't run (M5 not given), and block 7 ring path doesn't set medal
      expect(result.marker).toBe('justDoItring')
      // Medal 6 was not awarded because the ring path doesn't touch it
      expect(result.actions.awardMedal6).toBe(false)
    })
  })

  // ===========================================================================
  // Casing-sensitive marker tests
  // ===========================================================================

  describe('Marker casing', () => {
    test('"JustDoIt" has capital J and capital I', () => {
      const result = computeBirgitResult(baseState({ randomSuffix: 1 }))
      expect(result.marker).toBe('JustDoIt1')
      expect(result.marker).not.toBe('justDoIt1')
    })

    test('"justDoItring" has lowercase j and lowercase r', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        hasSwimring: true
      }))
      expect(result.marker).toBe('justDoItring')
      expect(result.marker).not.toBe('JustDoItRing')
    })

    test('"cantDoItPrima" has lowercase c', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 10,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('cantDoItPrima')
      expect(result.marker).not.toBe('CantDoItPrima')
    })

    test('"CantDoItDog" has capital C (different from cantDoItPrima!)', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        hasDoghouse: false,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('CantDoItDog')
      expect(result.marker).not.toBe('cantDoItDog')
    })

    test('"SCJustDoItPrima" — SC prefix', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal6: false,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('SCJustDoItPrima')
    })

    test('"SCcantDoItPrima" — SC prefix with lowercase c', () => {
      const result = computeBirgitResult(baseState({
        isMission5Completed: true,
        luxuryFactor: 15,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('SCcantDoItPrima')
    })
  })

  // ===========================================================================
  // Return value shape
  // ===========================================================================

  describe('Return value shape', () => {
    test('should return marker, suffix, and actions', () => {
      const result = computeBirgitResult(baseState())
      expect(result).toHaveProperty('marker')
      expect(result).toHaveProperty('suffix')
      expect(result).toHaveProperty('actions')
    })

    test('actions object has all expected keys', () => {
      const result = computeBirgitResult(baseState())
      const expectedKeys = [
        'completeMission2',
        'completeMission3',
        'completeMission22',
        'giveMission5',
        'deleteSwimring',
        'deleteDoctorBag',
        'givePills',
        'giveRandomPart',
        'giveMapPiece1',
        'giveBlinddog',
        'awardMedal6',
        'giveBelly'
      ]
      for (const key of expectedKeys) {
        expect(result.actions).toHaveProperty(key)
      }
    })

    test('all action values are booleans', () => {
      const result = computeBirgitResult(baseState())
      for (const value of Object.values(result.actions)) {
        expect(typeof value).toBe('boolean')
      }
    })
  })

  // ===========================================================================
  // Edge cases and subtle behaviors
  // ===========================================================================

  describe('Edge cases', () => {
    test('no suffix → randomSuffix used (suffix appended as empty)', () => {
      // In Lingo: "JustDoIt" & VOID & random(2) — VOID concatenates as ""
      const r1 = computeBirgitResult(baseState({ randomSuffix: 1 }))
      const r2 = computeBirgitResult(baseState({ randomSuffix: 2 }))
      expect(r1.marker).toBe('JustDoIt1')
      expect(r2.marker).toBe('JustDoIt2')
    })

    test('with suffix → randomSuffix NOT used', () => {
      const r1 = computeBirgitResult(baseState({ hasDoctorBag: true, randomSuffix: 1 }))
      const r2 = computeBirgitResult(baseState({ hasDoctorBag: true, randomSuffix: 2 }))
      // Both should be same regardless of randomSuffix
      expect(r1.marker).toBe('JustDoItBagNoRing')
      expect(r2.marker).toBe('JustDoItBagNoRing')
    })

    test('luxury boundary: 15 is NOT > 15 (strict greater-than)', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 15
      }))
      expect(result.marker).toBe('cantDoItPrima')
    })

    test('luxury boundary: 16 IS > 15', () => {
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        luxuryFactor: 16,
        hasMedal8: false
      }))
      expect(result.marker).toBe('JustDoItPrima')
    })

    test('M5 given + M5 completed: both blocks 5 and 7 run', () => {
      // Block 5 runs because M5 is given
      // Block 7 runs because M5 is completed
      // Block 7 overwrites block 5 marker
      const result = computeBirgitResult(baseState({
        isMission5Given: true,
        isMission5Completed: true,
        luxuryFactor: 16,
        hasMedal8: false,
        hasMedal6: false,
        randomSuffix: 1
      }))
      // Block 7 overwrites to SC prefix
      expect(result.marker).toBe('SCJustDoItPrima')
    })

    test('M4 + Doghouse gives M5, but M5-completed still governs if already completed', () => {
      const result = computeBirgitResult(baseState({
        isMission4Given: true,
        isMission5Given: false,
        isMission5Completed: true,
        hasDoghouse: true,
        luxuryFactor: 5,
        randomSuffix: 1
      }))
      // Block 6 runs (M5 not given, M4 given, has doghouse) → "JustDoItDog"
      // Block 7 runs (M5 completed) → "SCcantDoItPrima" overwrites
      expect(result.marker).toBe('SCcantDoItPrima')
      // But block 6 side-effects still happened
      expect(result.actions.giveMission5).toBe(true)
      expect(result.actions.giveBlinddog).toBe(true)
    })

    test('deliverMap with empty suffix concatenates correctly', () => {
      // When suffix is undefined, Lingo concatenates VOID as ""
      // deliverMap & VOID → "deliverMap"
      const result = computeBirgitResult(baseState({
        isMission22Given: true,
        hasMapPiece1: false,
        randomSuffix: 1
      }))
      expect(result.marker).toBe('deliverMap')
    })
  })
})
