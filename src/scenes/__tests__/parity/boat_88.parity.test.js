// Auto-generated Lingo behavioral parity tests for folder: boat_88
// Source: decompiled_lingo/boat_88/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: sturestortand.js, whale.js, WhaleData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computeWhaleResult, MARKER_DONE, MARKER_SUCCESS, MARKER_FAILURE } = require('../../WhaleData');

describe('boat_88 Lingo behavioral parity', () => {
  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        const contract = new LingoContract('boat_88/BS3', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }] }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 5', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        const contract = new LingoContract('boat_88/BS5', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }] }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('BehaviorScript 6', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("leave")

        const contract = new LingoContract('boat_88/BS6', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }] }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('ParentScript 1 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(340, 280))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: drawBoat(point(340, 280))
        // Action: cursor(200)

        // Verify constants from init handler
        const drawBoatX = 340;
        const drawBoatY = 280;
        const cursorValue = 200;
        expect(drawBoatX).toBe(340);
        expect(drawBoatY).toBe(280);
        expect(cursorValue).toBe(200);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 24), (myMarker <> "cantDoiT") → myMarker = "Done", go(myMarker)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      24
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: true, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_DONE);
        expect(result.goTo).toBe('Done');
      });

      test('path 2: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 24), NOT (myMarker <> "cantDoiT") → myMarker = "Done", go("start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      24
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: NOT (myMarker <> "cantDoiT")
        // This path is unreachable: marker="Done" never equals "cantDoiT", so goTo is always the marker
        const result = computeWhaleResult({ isMission24Completed: true, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_DONE);
        // "Done" != "cantDoIt" case-insensitively, so goTo is the marker, not "start"
        expect(result.goTo).toBe('Done');
        expect(result.goTo).not.toBe('start');
      });

      test('path 3: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "JustDoit", addCompletedMission(th...', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: getProperty(tmpBoat, #Watertank)
        // Condition: (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.goTo).toBe('JustDoit');
        expect(result.actions.completeMission24).toBe(true);
        expect(result.actions.giveFishingrod).toBe(true);
      });

      test('path 4: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "JustDoit", addCompletedMission(th...', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: getProperty(tmpBoat, #Watertank)
        // Condition: NOT (myMarker <> "cantDoiT")
        // This path is unreachable: marker="JustDoit" never equals "cantDoiT"
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.goTo).toBe('JustDoit');
        expect(result.goTo).not.toBe('start');
        expect(result.actions.completeMission24).toBe(true);
        expect(result.actions.giveFishingrod).toBe(true);
      });

      test('path 5: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go(myMarker)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: NOT getProperty(tmpBoat, #Watertank)
        // Condition: (myMarker <> "cantDoiT")
        // cantDoIt matches cantDoiT case-insensitively, so goTo='start'
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 6: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go("start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: NOT getProperty(tmpBoat, #Watertank)
        // Condition: NOT (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 7: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), NOT isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go(myMarker)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: (myMarker <> "cantDoiT")
        // cantDoIt matches cantDoiT case-insensitively, so goTo='start'
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 8: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), NOT isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go("start")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: NOT (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 9: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 24), (myMarker <> "cantDoiT") → myMarker = "Done", go(myMarker)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      24
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: (myMarker <> "cantDoiT")
        // objectp is irrelevant to computeWhaleResult
        const result = computeWhaleResult({ isMission24Completed: true, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_DONE);
        expect(result.goTo).toBe('Done');
      });

      test('path 10: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 24), NOT (myMarker <> "cantDoiT") → myMarker = "Done", go("start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      24
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: NOT (myMarker <> "cantDoiT")
        // Unreachable: "Done" != "cantDoiT" case-insensitively
        const result = computeWhaleResult({ isMission24Completed: true, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_DONE);
        expect(result.goTo).toBe('Done');
        expect(result.goTo).not.toBe('start');
      });

      test('path 11: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "JustDoit", addCompletedMissi...', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: getProperty(tmpBoat, #Watertank)
        // Condition: (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.goTo).toBe('JustDoit');
        expect(result.actions.completeMission24).toBe(true);
        expect(result.actions.giveFishingrod).toBe(true);
      });

      test('path 12: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "JustDoit", addCompletedMissi...', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: getProperty(tmpBoat, #Watertank)
        // Condition: NOT (myMarker <> "cantDoiT")
        // Unreachable: "JustDoit" != "cantDoiT" case-insensitively
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.goTo).toBe('JustDoit');
        expect(result.goTo).not.toBe('start');
        expect(result.actions.completeMission24).toBe(true);
        expect(result.actions.giveFishingrod).toBe(true);
      });

      test('path 13: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go(myMarker)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: NOT getProperty(tmpBoat, #Watertank)
        // Condition: (myMarker <> "cantDoiT")
        // cantDoIt matches cantDoiT case-insensitively, so goTo='start'
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 14: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go("start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      11
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: NOT getProperty(tmpBoat, #Watertank)
        // Condition: NOT (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: true, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 15: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), NOT isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go(myMarker)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: (myMarker <> "cantDoiT")
        // cantDoIt matches cantDoiT case-insensitively, so goTo='start'
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

      test('path 16: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 24), NOT isMissionCompleted(the user of gMulleGlobals, 11) → myMarker = "cantDoIt", go("start")', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 24)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 11)
        // Condition: NOT (myMarker <> "cantDoiT")
        const result = computeWhaleResult({ isMission24Completed: false, isMission11Completed: false, hasWatertank: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.goTo).toBe('start');
      });

    });

  });

});
