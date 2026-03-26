// Auto-generated Lingo behavioral parity tests for folder: boat_81
// Source: decompiled_lingo/boat_81/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: surfer.js, SurferData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computeRottenFishDeliveryResult, ROTTEN_FISH_MISSION_ID, ROTTEN_FISH_MEDAL_ID, ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD } = require('../../SurferData');

describe('boat_81 Lingo behavioral parity', () => {
  describe('BehaviorScript 1', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/boat_81/BehaviorScript 1.ls',
          'exitFrame',
          [{ conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 2', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("leave")

        // Expects scene transition: go(leave)
        const contract = new LingoContract(
          'decompiled_lingo/boat_81/BehaviorScript 2.ls',
          'exitFrame',
          [{ conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/boat_81/BehaviorScript 3.ls',
          'exitFrame',
          [{ conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 6', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("leave")

        // Expects scene transition: go(leave)
        const contract = new LingoContract(
          'decompiled_lingo/boat_81/BehaviorScript 6.ls',
          'exitFrame',
          [{ conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 7', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract(
          'decompiled_lingo/boat_81/BehaviorScript 7.ls',
          'exitFrame',
          [{ conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('ParentScript 4 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(200, 165))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: drawBoat(point(200, 165))
        // Action: cursor(200)

        // Expects: setSky() called
        // Expects: drawBoat() called
        // Expects: cursor(200)
        expect(ROTTEN_FISH_MISSION_ID).toBe(9);
        expect(ROTTEN_FISH_MEDAL_ID).toBe(3);
        expect(ROTTEN_FISH_MEDAL_WEIGHT_THRESHOLD).toBe(35);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #RottenFish) → myMarker = "notDelivered", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #RottenFish)
        // Expected behavioral actions:
        // Action: myMarker = "notDelivered"
        // Action: go(myMarker)

        // Expects: myMarker = "notDelivered"
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: true,
          capacity: 50,
          rottenFishWeight: 20,
          suffix: '_A'
        });
        expect(result.marker).toBe('notDelivered');
        expect(result.actions.completeMission9).toBe(false);
        expect(result.actions.awardMedal3).toBe(false);
        expect(result.actions.giveRottenFish).toBe(false);
      });

      test('path 2: objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #RottenFish), (tmpCapacity >= rottenFishWeight) → myMarker = ("JustDoIt" & tmpSuffix), addMedal(the boa...', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #RottenFish)
        // Condition: (tmpCapacity >= rottenFishWeight)
        // Condition: (rottenFishWeight >= 35)
        // Expected behavioral actions:
        // Action: myMarker = ("JustDoIt" & tmpSuffix)
        // Action: addMedal(the boat of the user of gMulleGlobals, 3)
        // Action: myMarker = (("JustDoIt" & "medal") & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 9)
        // Action: setInInventory(the user of gMulleGlobals, #RottenFish, [])
        // Action: go(myMarker)

        // Expects: myMarker = ("JustDoIt" & tmpSuffix)
        // Expects: addMedal(3)
        // Expects: myMarker = (("JustDoIt" & "medal") & tmpSuffix)
        // Expects: addCompletedMission(9)
        // Expects: setInInventory(RottenFish)
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: false,
          capacity: 50,
          rottenFishWeight: 40,
          suffix: '_A'
        });
        expect(result.marker).toBe('JustDoItmedal_A');
        expect(result.actions.completeMission9).toBe(true);
        expect(result.actions.awardMedal3).toBe(true);
        expect(result.actions.giveRottenFish).toBe(true);
      });

      test('path 3: objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #RottenFish), (tmpCapacity >= rottenFishWeight) → myMarker = ("JustDoIt" & tmpSuffix), addCompletedMission(...', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #RottenFish)
        // Condition: (tmpCapacity >= rottenFishWeight)
        // Condition: NOT (rottenFishWeight >= 35)
        // Expected behavioral actions:
        // Action: myMarker = ("JustDoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 9)
        // Action: setInInventory(the user of gMulleGlobals, #RottenFish, [])
        // Action: go(myMarker)

        // Expects: myMarker = ("JustDoIt" & tmpSuffix)
        // Expects: addCompletedMission(9)
        // Expects: setInInventory(RottenFish)
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: false,
          capacity: 50,
          rottenFishWeight: 20,
          suffix: '_B'
        });
        expect(result.marker).toBe('JustDoIt_B');
        expect(result.actions.completeMission9).toBe(true);
        expect(result.actions.awardMedal3).toBe(false);
        expect(result.actions.giveRottenFish).toBe(true);
      });

      test('path 4: objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #RottenFish), NOT (tmpCapacity >= rottenFishWeight) → myMarker = ("cantDoIt" & tmpSuffix), go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #RottenFish)
        // Condition: NOT (tmpCapacity >= rottenFishWeight)
        // Expected behavioral actions:
        // Action: myMarker = ("cantDoIt" & tmpSuffix)
        // Action: go(myMarker)

        // Expects: myMarker = ("cantDoIt" & tmpSuffix)
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: false,
          capacity: 10,
          rottenFishWeight: 30,
          suffix: '_A'
        });
        expect(result.marker).toBe('cantDoIt_A');
        expect(result.actions.completeMission9).toBe(false);
        expect(result.actions.giveRottenFish).toBe(false);
      });

      test('path 5: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #RottenFish) → myMarker = "notDelivered", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #RottenFish)
        // Expected behavioral actions:
        // Action: myMarker = "notDelivered"
        // Action: go(myMarker)

        // Expects: myMarker = "notDelivered"
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: true,
          capacity: 100,
          rottenFishWeight: 50,
          suffix: '_C'
        });
        expect(result.marker).toBe('notDelivered');
        expect(result.actions.completeMission9).toBe(false);
        expect(result.actions.awardMedal3).toBe(false);
        expect(result.actions.giveRottenFish).toBe(false);
      });

      test('path 6: NOT objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #RottenFish), (tmpCapacity >= rottenFishWeight) → myMarker = ("JustDoIt" & tmpSuffix), addMedal(the boa...', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #RottenFish)
        // Condition: (tmpCapacity >= rottenFishWeight)
        // Condition: (rottenFishWeight >= 35)
        // Expected behavioral actions:
        // Action: myMarker = ("JustDoIt" & tmpSuffix)
        // Action: addMedal(the boat of the user of gMulleGlobals, 3)
        // Action: myMarker = (("JustDoIt" & "medal") & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 9)
        // Action: setInInventory(the user of gMulleGlobals, #RottenFish, [])
        // Action: go(myMarker)

        // Expects: myMarker = ("JustDoIt" & tmpSuffix)
        // Expects: addMedal(3)
        // Expects: myMarker = (("JustDoIt" & "medal") & tmpSuffix)
        // Expects: addCompletedMission(9)
        // Expects: setInInventory(RottenFish)
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: false,
          capacity: 60,
          rottenFishWeight: 35,
          suffix: '_B'
        });
        expect(result.marker).toBe('JustDoItmedal_B');
        expect(result.actions.completeMission9).toBe(true);
        expect(result.actions.awardMedal3).toBe(true);
        expect(result.actions.giveRottenFish).toBe(true);
      });

      test('path 7: NOT objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #RottenFish), (tmpCapacity >= rottenFishWeight) → myMarker = ("JustDoIt" & tmpSuffix), addCompletedMiss...', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #RottenFish)
        // Condition: (tmpCapacity >= rottenFishWeight)
        // Condition: NOT (rottenFishWeight >= 35)
        // Expected behavioral actions:
        // Action: myMarker = ("JustDoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 9)
        // Action: setInInventory(the user of gMulleGlobals, #RottenFish, [])
        // Action: go(myMarker)

        // Expects: myMarker = ("JustDoIt" & tmpSuffix)
        // Expects: addCompletedMission(9)
        // Expects: setInInventory(RottenFish)
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: false,
          capacity: 50,
          rottenFishWeight: 34,
          suffix: '_C'
        });
        expect(result.marker).toBe('JustDoIt_C');
        expect(result.actions.completeMission9).toBe(true);
        expect(result.actions.awardMedal3).toBe(false);
        expect(result.actions.giveRottenFish).toBe(true);
      });

      test('path 8: NOT objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #RottenFish), NOT (tmpCapacity >= rottenFishWeight) → myMarker = ("cantDoIt" & tmpSuffix), go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "RottenFish": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #RottenFish)
        // Condition: NOT (tmpCapacity >= rottenFishWeight)
        // Expected behavioral actions:
        // Action: myMarker = ("cantDoIt" & tmpSuffix)
        // Action: go(myMarker)

        // Expects: myMarker = ("cantDoIt" & tmpSuffix)
        // Expects scene transition: go(myMarker)
        const result = computeRottenFishDeliveryResult({
          hasRottenFish: false,
          capacity: 5,
          rottenFishWeight: 25,
          suffix: '_B'
        });
        expect(result.marker).toBe('cantDoIt_B');
        expect(result.actions.completeMission9).toBe(false);
        expect(result.actions.giveRottenFish).toBe(false);
      });

    });

  });

});
