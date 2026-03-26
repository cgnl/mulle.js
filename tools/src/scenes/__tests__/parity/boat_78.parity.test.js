// Auto-generated Lingo behavioral parity tests for folder: boat_78
// Source: decompiled_lingo/boat_78/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: preacher.js, PreacherData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computePreacherResult, DEFAULT_OBJ_ID, DUMMY_PART, SECOND_COMPLETION_PART, MAX_PART_COMPLETIONS, BELLY_NR } = require('../../PreacherData');

describe('boat_78 Lingo behavioral parity', () => {
  describe('BehaviorScript 1', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('boat_78/BehaviorScript 1', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
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
        const contract = new LingoContract('boat_78/BehaviorScript 2', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("BibleLeave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("BibleLeave")

        // Expects scene transition: go(BibleLeave)
        const contract = new LingoContract('boat_78/BehaviorScript 3', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'BibleLeave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('BibleLeave');
      });

    });

  });

  describe('BehaviorScript 6', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract('boat_78/BehaviorScript 6', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('ParentScript 4 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(315, 165))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: drawBoat(point(315, 165))
        // Action: cursor(200)

        // Expects: setSky() called
        // Expects: drawBoat() called
        // Expects: cursor(200)
        expect(DEFAULT_OBJ_ID).toBe(18);
        expect(DUMMY_PART).toBe(72);
        expect(SECOND_COMPLETION_PART).toBe(19);
        expect(MAX_PART_COMPLETIONS).toBe(5);
        expect(BELLY_NR).toBe(1000);
      });

    });

    describe('startMovie', () => {
      // Helper: create state for computePreacherResult
      function preacher (overrides) {
        return computePreacherResult({
          isMission1Given: true,
          isMission20Completed: true,
          hasRequiredItem: true,
          completionCount: 0,
          randomPart: 42,
          suffix: 1,
          ...overrides
        });
      }

      test('path 1: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"

        // hasItem, count<=5, snack (null part), M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 2: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count<=5, snack (null part), M20 not completed (no giveMission1 sub-branch)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.givePart).toBeNull();
      });

      test('path 3: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: go(myMarker)

        // hasItem, count<=5, snack (null part), M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.givePart).toBeNull();
      });

      test('path 4: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count<=5, part (non-null), M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 5: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count<=5, part (non-null), M20 not completed (no giveMission1 sub-branch)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 6: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: go(myMarker)

        // hasItem, count<=5, part (non-null), M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('JustdoIt1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 7: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"

        // Same as path 1: hasItem, count<=5, snack, M20 not completed (suffix 1)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 4, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 8: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count<=5, snack (null part), M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 9: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: go(myMarker)

        // hasItem, count<=5, snack (null part), M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 3, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('JustdoItSnack2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.givePart).toBeNull();
      });

      test('path 10: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count<=5, part (non-null), M20 not completed (suffix 1)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 11: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count<=5, part (non-null), M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 3, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 12: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: go(myMarker)

        // hasItem, count<=5, part (non-null), M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 4, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('JustdoIt2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 13: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"

        // hasItem, count>5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.givePart).toBeNull();
      });

      test('path 14: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // hasItem, count>5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 7, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 15: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: NOT (getCompletedMissionInfo(the user of gMulleGlobals, 1, #count) <= 5)
        // Expected behavioral actions:
        // Action: myMarker = ("JustdoIt" & tmpSuffix)
        // Action: deleteFromInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Action: addCompletedMission(the user of gMulleGlobals, 1)
        // Action: setInInventory(the user of gMulleGlobals, #Belly, [#nr: 1000])
        // Action: myMarker = ("JustdoItSnack" & tmpSuffix)
        // Action: go(myMarker)

        // hasItem, count>5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 16: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 20) = 0)
        // Expected behavioral actions:
        // Action: myMarker = ("cantDoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // no item, M1 given, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(false);
        expect(result.actions.completeMission1).toBe(false);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 17: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 20) = 0)
        // Expected behavioral actions:
        // Action: myMarker = ("cantDoIt" & tmpSuffix)
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // no item, M1 given, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.deleteItem).toBe(false);
      });

      test('path 18: objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 20) = 0)
        // Expected behavioral actions:
        // Action: myMarker = ("cantDoIt" & tmpSuffix)
        // Action: go(myMarker)

        // no item, M1 given, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoIt1');
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
        expect(result.actions.completeMission1).toBe(false);
      });

      test('path 19: objectp(the world of gMulleGlobals), objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 20) = 0)
        // Condition: (isMissionGiven(the user of gMulleGlobals, 1) = 0)
        // Expected behavioral actions:
        // Action: myMarker = "NoMission"
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: addGivenMission(the user of gMulleGlobals, 1)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // no mission, M20 not completed
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 20: objectp(the world of gMulleGlobals), objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 20) = 0)
        // Condition: NOT (isMissionGiven(the user of gMulleGlobals, 1) = 0)
        // Expected behavioral actions:
        // Action: myMarker = "NoMission"
        // Action: addCompletedMission(the user of gMulleGlobals, 20)
        // Action: myMarker = "cantDoit2"
        // Action: go(myMarker)

        // no mission, M20 not completed (sub-branch without giveMission)
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 21: objectp(the world of gMulleGlobals), objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", go(myMarker)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 20) = 0)
        // Expected behavioral actions:
        // Action: myMarker = "NoMission"
        // Action: go(myMarker)

        // no mission, M20 completed
        const result = preacher({ isMission1Given: false, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('NoMission');
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.giveMission1).toBe(false);
      });

      test('path 22: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // hasItem, count<=5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.completeMission1).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 23: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 24: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 25: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 26: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 27: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('JustdoIt1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 28: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack (null), M20 not completed (duplicate variant)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 4, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 29: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack (null), M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 30: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 3, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('JustdoItSnack2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 31: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 1)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 32: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 3, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 33: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 4, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('JustdoIt2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 34: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 35: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 7, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 36: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 37: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.deleteItem).toBe(false);
      });

      test('path 38: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 39: objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoIt1');
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
      });

      test('path 40: objectp(the world of gMulleGlobals), NOT objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // no mission, M20 not completed, giveMission1
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 41: objectp(the world of gMulleGlobals), NOT objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // no mission, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 42: objectp(the world of gMulleGlobals), NOT objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", go(myMarker)', () => {
        const state = createGameState();

        // no mission, M20 completed
        const result = preacher({ isMission1Given: false, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('NoMission');
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.giveMission1).toBe(false);
      });

      test('path 43: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 44: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 45: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 46: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 47: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 48: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('JustdoIt1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 49: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (count 1)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 4, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 50: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (suffix 2, count 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 51: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 3, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('JustdoItSnack2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 52: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (count 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 53: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 2, count 3)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 3, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 54: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 4, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('JustdoIt2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 55: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 56: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 7, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 57: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 58: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.deleteItem).toBe(false);
      });

      test('path 59: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 60: NOT objectp(the world of gMulleGlobals), objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoIt1');
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 61: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // no mission, M20 not completed, giveMission1
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 62: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // no mission, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 63: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", go(myMarker)', () => {
        const state = createGameState();

        // no mission, M20 completed
        const result = preacher({ isMission1Given: false, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('NoMission');
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 64: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 65: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 66: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 67: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 68: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 69: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 0, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('JustdoIt1');
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 70: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (count 1)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 4, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 71: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 not completed (suffix 2, count 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 72: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, snack, M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 3, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('JustdoItSnack2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 73: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (count 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 2, randomPart: 42, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 74: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 not completed (suffix 2, count 3)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 3, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 75: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count<=5, part, M20 completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 4, randomPart: 42, suffix: 2 });
        expect(result.marker).toBe('JustdoIt2');
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 76: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 77: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: true, completionCount: 7, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 78: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("JustdoIt" & tmpSuffix), deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // hasItem, count>5, snack, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: true, completionCount: 6, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('JustdoItSnack1');
        expect(result.actions.giveBelly).toBe(true);
        expect(result.actions.completeMission20).toBe(false);
      });

      test('path 79: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 not completed
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.deleteItem).toBe(false);
      });

      test('path 80: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: true, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
      });

      test('path 81: NOT objectp(the world of gMulleGlobals), NOT objId, isMissionGiven(the user of gMulleGlobals, 1) → myMarker = ("cantDoIt" & tmpSuffix), go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  },
                  "missions": {
                            "given": [
                                      1
                            ]
                  }
        });

        // no item, M1 given, M20 completed
        const result = preacher({ isMission1Given: true, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoIt1');
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
      });

      test('path 82: NOT objectp(the world of gMulleGlobals), NOT objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // no mission, M20 not completed, giveMission1
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 83: NOT objectp(the world of gMulleGlobals), NOT objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", addCompletedMission(the user of gMulleGlobals, 20)', () => {
        const state = createGameState();

        // no mission, M20 not completed (suffix 2)
        const result = preacher({ isMission1Given: false, isMission20Completed: false, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 2 });
        expect(result.marker).toBe('cantDoit2');
        expect(result.actions.completeMission20).toBe(true);
        expect(result.actions.giveMission1).toBe(true);
      });

      test('path 84: NOT objectp(the world of gMulleGlobals), NOT objId, NOT isMissionGiven(the user of gMulleGlobals, 1) → myMarker = "NoMission", go(myMarker)', () => {
        const state = createGameState();

        // no mission, M20 completed
        const result = preacher({ isMission1Given: false, isMission20Completed: true, hasRequiredItem: false, completionCount: 0, randomPart: null, suffix: 1 });
        expect(result.marker).toBe('NoMission');
        expect(result.actions.completeMission20).toBe(false);
        expect(result.actions.giveMission1).toBe(false);
      });

    });

  });

});
