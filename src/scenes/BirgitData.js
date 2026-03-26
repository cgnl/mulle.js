/**
 * @fileoverview BirgitData - Pure data module for Birgit's Strand scene (scene 77)
 * Based on: decompiled_lingo/77/77/casts/Internal/ParentScript 1 - Dir.ls
 *
 * Scene 77 is Birgit's beach in "Bygg båtar med Mulle Meck".
 * The startMovie handler determines which animation marker to play and which
 * side-effects to trigger (missions, inventory, medals) based on the player's
 * current game state.
 *
 * CRITICAL: The Lingo uses a cascading-overwrite pattern — each if-block
 * potentially overwrites myMarker set by a previous block. The LAST applicable
 * block determines the final marker.
 *
 * Block execution order (from Lingo):
 *   1. DoctorBag check  → suffix = "BagNoRing", give Pills, complete M3
 *   2. Swimring check   → suffix = "Ring" (OVERWRITES), give part, complete M2
 *   3. Default marker   → "JustDoIt" + suffix (or + random if no suffix)
 *   4. Mission 22 check → "deliverMap" + suffix (OVERWRITES default)
 *   5. Mission 5 given  → "JustDoItPrima"/"cantDoItPrima" + suffix (OVERWRITES)
 *   6. Mission 4 check  → ONLY if M5 NOT given. "JustDoItDog"/"CantDoItDog" + suffix
 *   7. Mission 5 done   → OVERWRITES everything. "justDoItring" or "SC" prefix variants
 *   8. DoctorBag delete → only if suffix is STILL "BagNoRing"
 *   9. Belly 1000       → ALWAYS given
 */

'use strict'

/**
 * Compute Birgit scene result from the player's current game state.
 * Follows the EXACT cascading-overwrite structure from the original Lingo.
 *
 * @param {object} state
 * @param {boolean} state.hasDoctorBag    - isInInventory(user, #DoctorBag)
 * @param {boolean} state.hasSwimring     - isInInventory(user, #Swimring)
 * @param {boolean} state.isMission22Given - isMissionGiven(user, 22)
 * @param {boolean} state.hasMapPiece1    - isInInventory(user, #MapPiece1)
 * @param {boolean} state.isMission5Given - isMissionGiven(user, 5)
 * @param {boolean} state.isMission5Completed - isMissionCompleted(user, 5)
 * @param {boolean} state.isMission4Given - isMissionGiven(user, 4)
 * @param {number}  state.luxuryFactor    - getProperty(tmpBoat, #LuxuryFactor)
 * @param {boolean} state.hasDoghouse     - getProperty(tmpBoat, #Doghouse)
 * @param {boolean} state.hasMedal8       - getMedal(boat, 8) !== 0
 * @param {boolean} state.hasMedal6       - getMedal(boat, 6) !== 0
 * @param {number|null} state.randomPart  - result of getRandomPart (only used for tracking)
 * @param {number}  state.randomSuffix    - 1 or 2 (pre-rolled, used when no item suffix)
 * @returns {{ marker: string, suffix: string|undefined, actions: object }}
 */
function computeBirgitResult (state) {
  let tmpStartSuffix
  let myMarker
  let tmpRing = 0

  const actions = {
    completeMission2: false,
    completeMission3: false,
    completeMission22: false,
    giveMission5: false,
    deleteSwimring: false,
    deleteDoctorBag: false,
    givePills: false,
    giveRandomPart: false,
    giveMapPiece1: false,
    giveBlinddog: false,
    awardMedal6: false,
    giveBelly: true // ALWAYS true (line 97)
  }

  // --- Block 1: DoctorBag check (lines 27-31) ---
  if (state.hasDoctorBag) {
    tmpStartSuffix = 'BagNoRing'
    actions.givePills = true // Pills 100
    actions.completeMission3 = true
  }

  // --- Block 2: Swimring check (lines 32-40) ---
  // Runs independently — can OVERWRITE suffix from Block 1
  if (state.hasSwimring) {
    tmpStartSuffix = 'Ring'
    actions.giveRandomPart = true
    actions.deleteSwimring = true
    tmpRing = 1
    actions.completeMission2 = true
  }

  // --- Block 3: Default marker (lines 41-45) ---
  // In Lingo: if tmpStartSuffix = VOID → "JustDoIt" & tmpStartSuffix & random(2)
  // When VOID, concatenation with VOID yields nothing, so "JustDoIt" + "" + random(2)
  // When set → "JustDoIt" + suffix (no random)
  if (tmpStartSuffix === undefined) {
    myMarker = 'JustDoIt' + state.randomSuffix
  } else {
    myMarker = 'JustDoIt' + tmpStartSuffix
  }

  // --- Block 4: Mission 22 check (lines 46-52) ---
  if (state.isMission22Given) {
    if (!state.hasMapPiece1) {
      actions.giveMapPiece1 = true
      actions.completeMission22 = true
      myMarker = 'deliverMap' + (tmpStartSuffix || '')
    }
  }

  // --- Block 5: Mission 5 given (lines 53-63) ---
  if (state.isMission5Given) {
    if (state.luxuryFactor > 15) {
      if (!state.hasMedal8) {
        myMarker = 'JustDoItPrima' + (tmpStartSuffix || '')
        actions.awardMedal6 = true
      } else {
        myMarker = 'JustDoItPrima' + (tmpStartSuffix || '')
      }
    } else {
      myMarker = 'cantDoItPrima' + (tmpStartSuffix || '')
    }
  }

  // --- Block 6: Mission 4 check (lines 65-74) ---
  // ONLY runs if Mission 5 is NOT given
  if (!state.isMission5Given) {
    if (state.isMission4Given) {
      if (state.hasDoghouse) {
        myMarker = 'JustDoItDog' + (tmpStartSuffix || '')
        actions.giveMission5 = true
        actions.giveBlinddog = true
      } else {
        myMarker = 'CantDoItDog' + (tmpStartSuffix || '')
      }
    }
  }

  // --- Block 7: Mission 5 completed (lines 76-91) ---
  // OVERWRITES everything if M5 is completed
  // NOTE: In Lingo, getMedal(boat, 6) reflects runtime state — if block 5 just
  // awarded medal 6 via addMedal, it already exists by the time block 7 checks.
  // We model this by checking both the input state AND whether block 5 awarded it.
  if (state.isMission5Completed) {
    if (tmpRing === 1) {
      myMarker = 'justDoItring'
    } else {
      if (state.luxuryFactor > 15) {
        const effectiveHasMedal6 = state.hasMedal6 || actions.awardMedal6
        if (!effectiveHasMedal6) {
          myMarker = 'SC' + 'JustDoItPrima' + (tmpStartSuffix || '')
          actions.awardMedal6 = true
        } else {
          myMarker = 'SC' + 'JustDoItPrima' + (tmpStartSuffix || '')
        }
      } else {
        myMarker = 'SC' + 'cantDoItPrima' + (tmpStartSuffix || '')
      }
    }
  }

  // --- Block 8: DoctorBag deletion (lines 92-94) ---
  // Only deleted if suffix is STILL "BagNoRing" (not overwritten by Swimring)
  if (tmpStartSuffix === 'BagNoRing') {
    actions.deleteDoctorBag = true
  }

  return {
    marker: myMarker,
    suffix: tmpStartSuffix,
    actions
  }
}

/**
 * Dialogue clip IDs used in Birgit's beach scene.
 * The original Director movie (boten_77.DXR) references these sound members.
 * Clips 77d002v0 through 77d032v0 cover all NPC dialogue variations.
 */
const BIRGIT_DIALOGUE_CLIPS = {
  // --- Greeting / intro dialogues ---
  '77d002v0': 'birgit_greeting',          // Generic greeting / leave dialogue
  '77d003v0': 'birgit_justdoit_dog',      // JustDoiTDog marker audio

  // --- Mission-specific dialogues ---
  '77d009v0': 'birgit_prima_bagnoRing',   // JustDoItPrimaBagNoRing
  '77d012v0': 'birgit_sc_prima_bag',      // SCJustDoItPrimaBag / cantDoiTPrimaBag
  '77d013v0': 'birgit_dog_delivery',      // JustDoItDogBagNoRing / JustDoItDogRing

  // --- Standard visit dialogues ---
  '77d019v0': 'birgit_justdoit1',         // JustDoit1 (random visit 1)
  '77d021v0': 'birgit_trip',              // Trip dialogue (Prima trip sequence)
  '77d023v0': 'birgit_justdoit_bagnoRing', // JustDoitBagNoRing
  '77d026v0': 'birgit_justdoit_ring',     // JustDoitRing
  '77d028v0': 'birgit_cantdoit_dog_ring', // CantDoItDogRing
  '77d029v0': 'birgit_cantdoit_dog_bag',  // CantDoItDogBagNoRing
  '77d031v0': 'birgit_justdoit_bag',      // JustDoitBag
  '77d032v0': 'birgit_sc_prima_ring'      // SCJustDoItPrimaRing
}

/**
 * Ambient/SFX audio used in the scene.
 */
const BIRGIT_AMBIENT_AUDIO = {
  '77e001v0': 'beach_ambient'             // Beach ambient loop (waves, seagulls)
}

/**
 * Post-dialogue flow types — what happens after each marker's dialogue finishes.
 * Maps marker names (lowercase) to their post-dialogue behavior.
 *
 * Derived from BehaviorScripts:
 * - BS 2: exitFrame → go(the frame) [hold/idle]
 * - BS 3: exitFrame → go("leave") [exit scene]
 * - BS 4: exitFrame → go("ringleave") [exit after ring delivery]
 * - BS 25: exitFrame → go("notrip") [can't do prima trip]
 * - BS 26: exitFrame → primaTrip(gDir) [complete mission 5]
 * - BS 27/28: exitFrame → go("trip") [prima trip sequence]
 */
const BIRGIT_POST_DIALOGUE_FLOWS = {
  // 'leave' flow — exits to seaworld
  'justdoitbagnoRing': 'leave',
  'justdoitbag': 'leave',
  'justdoitring': 'leave',

  // 'primaTrip' flow — complete mission 5, then trip dialogue
  'justdoitdog': 'primaTrip',
  'justdoitdogbag': 'primaTrip',
  'justdoitdogbagnoRing': 'primaTrip',
  'justdoitdogring': 'primaTrip',

  // 'trip' flow — play trip dialogue then idle
  'justdoitprima': 'trip',
  'justdoitprimabag': 'trip',
  'justdoitprimabagnoRing': 'trip',
  'justdoitprimaring': 'trip',
  'scjustdoitprima': 'trip',
  'scjustdoitprimabag': 'trip',
  'scjustdoitprimabagnoRing': 'trip',
  'scjustdoitprimaring': 'trip',

  // 'notrip' flow — idle (can't afford prima trip)
  'cantdoitprima': 'notrip',
  'cantdoitprimabag': 'notrip',
  'cantdoitprimabagnoRing': 'notrip',
  'cantdoitprimaring': 'notrip',
  'sccantdoitprima': 'notrip',
  'sccantdoitprimabag': 'notrip',
  'sccantdoitprimabagnoRing': 'notrip',
  'sccantdoitprimaring': 'notrip',

  // 'idle' flow — stay on beach
  'justdoit1': 'idle',
  'justdoit2': 'idle',
  'delivermap': 'idle',
  'delivermapbag': 'idle',
  'delivermapbagnoRing': 'idle',
  'delivermapring': 'idle',
  'cantdoitdog': 'idle',
  'cantdoitdogbag': 'idle',
  'cantdoitdogbagnoRing': 'idle',
  'cantdoitdogring': 'idle'
}

module.exports = {
  computeBirgitResult,
  BIRGIT_DIALOGUE_CLIPS,
  BIRGIT_AMBIENT_AUDIO,
  BIRGIT_POST_DIALOGUE_FLOWS
}
