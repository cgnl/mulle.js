// Auto-generated Lingo behavioral parity tests for folder: boat_87
// Source: decompiled_lingo/boat_87/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: diving.js, DivingData.js, saftfabrik.js

const { LingoContract, createMockContext } = require('./helpers');
const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { computeDivingSceneResult } = require('../../DivingData');

describe('boat_87 Lingo behavioral parity', () => {
  describe('BehaviorScript 10', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('decompiled_lingo/boat_87/casts/Internal/BehaviorScript 10.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
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
        const contract = new LingoContract('decompiled_lingo/boat_87/casts/Internal/BehaviorScript 3.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 7', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('decompiled_lingo/boat_87/casts/Internal/BehaviorScript 7.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 8', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract('decompiled_lingo/boat_87/casts/Internal/BehaviorScript 8.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('BehaviorScript 9', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('decompiled_lingo/boat_87/casts/Internal/BehaviorScript 9.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('ParentScript 1 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(355, 150), VOID, VOID, 0)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: drawBoat(point(355, 150), VOID, VOID, 0)
        // Action: cursor(200)

        // Expects: setSky() called
        // Expects: drawBoat() called
        // Expects: cursor(200)
        // Init is unconditional setup — verify it does not produce side-effect transitions
        const contract = new LingoContract('decompiled_lingo/boat_87/casts/Internal/ParentScript 1 - Dir.ls', 'init', [
          { conditions: [], actions: [], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBeNull();
        expect(result.missionsCompleted).toEqual([]);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, 23),...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 2 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('JustDoit');
      });

      test('path 2: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, 23),...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 1 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('start');
      });

      test('path 3: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, 23),...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 3 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('JustDoit');
      });

      test('path 4: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, 23),...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 0 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('start');
      });

      test('path 5: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), NOT isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: false, missionCount23: 2 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('cantDoit');
      });

      test('path 6: objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), NOT isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: false, missionCount23: 1 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('start');
      });

      test('path 7: objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #helmet), (getCompletedMissionInfo(the user of gMulleGlobals, 23, #... → addCompletedMission(the user of gM...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: false, hasSuit: false, missionCount23: 2 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('cantDoit');
      });

      test('path 8: objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #helmet), NOT (getCompletedMissionInfo(the user of gMulleGlobals, 2... → addCompletedMission(the user of gM...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: false, hasSuit: false, missionCount23: 0 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('start');
      });

      test('path 9: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 5 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('JustDoit');
      });

      test('path 10: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals,...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 0 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('start');
      });

      test('path 11: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals,...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 2 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('JustDoit');
      });

      test('path 12: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlobals,...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (gotPart(the user of gMulleGlobals, 979) = 0)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: addCompletedMission(the user of gMulleGlobals, 12)
        // Action: myMarker = "JustDoit"
        // Action: addMedal(the boat of the user of gMulleGlobals, 5)
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: addCompletedMission(12)
        // Expects: myMarker = "JustDoit"
        // Expects: addMedal(5)
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: true, missionCount23: 1 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(true);
        expect(r.marker).toBe('JustDoit');
        expect(r.actions.awardMedal5).toBe(true);
        expect(r.goTo).toBe('start');
      });

      test('path 13: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), NOT isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlob...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: false, missionCount23: 3 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('cantDoit');
      });

      test('path 14: NOT objectp(the world of gMulleGlobals), isInInventory(the user of gMulleGlobals, #helmet), NOT isInInventory(the user of gMulleGlobals, #Suit) → addCompletedMission(the user of gMulleGlob...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: true, hasSuit: false, missionCount23: 0 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('start');
      });

      test('path 15: NOT objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #helmet), (getCompletedMissionInfo(the user of gMulleGlobals, 23, #... → addCompletedMission(the user ...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go(myMarker)

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(myMarker)
        const r = computeDivingSceneResult({ hasHelmet: false, hasSuit: false, missionCount23: 4 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('cantDoit');
      });

      test('path 16: NOT objectp(the world of gMulleGlobals), NOT isInInventory(the user of gMulleGlobals, #helmet), NOT (getCompletedMissionInfo(the user of gMulleGlobals, 2... → addCompletedMission(the user ...', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 23, #count) >= 2)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 23)
        // Action: myMarker = "cantDoit"
        // Action: go("start")

        // Expects: addCompletedMission(23)
        // Expects: myMarker = "cantDoit"
        // Expects scene transition: go(start)
        const r = computeDivingSceneResult({ hasHelmet: false, hasSuit: false, missionCount23: 1 });
        expect(r.actions.completeMission23).toBe(true);
        expect(r.actions.completeMission12).toBe(false);
        expect(r.marker).toBe('cantDoit');
        expect(r.goTo).toBe('start');
      });

    });

  });

});
