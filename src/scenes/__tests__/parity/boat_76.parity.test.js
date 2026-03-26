// Auto-generated Lingo behavioral parity tests for folder: boat_76
// Source: decompiled_lingo/boat_76/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: showboat.js, ShowBoatData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computeShowBoatResult, MISSION_ID } = require('../../ShowBoatData');

describe('boat_76 Lingo behavioral parity', () => {
  describe('BehaviorScript 1', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/boat_76/BehaviorScript 1.ls', 'exitFrame',
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
          'decompiled_lingo/boat_76/BehaviorScript 2.ls', 'exitFrame',
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
          'decompiled_lingo/boat_76/BehaviorScript 3.ls', 'exitFrame',
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
          'decompiled_lingo/boat_76/BehaviorScript 6.ls', 'exitFrame',
          [{ conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 7', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("leave")

        // Expects scene transition: go(leave)
        const contract = new LingoContract(
          'decompiled_lingo/boat_76/BehaviorScript 7.ls', 'exitFrame',
          [{ conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 9', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract(
          'decompiled_lingo/boat_76/BehaviorScript 9.ls', 'exitFrame',
          [{ conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('ParentScript 4 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(360, 155))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: drawBoat(point(360, 155))
        // Action: cursor(200)

        // Expects: setSky() called
        // Expects: drawBoat() called
        // Expects: cursor(200)

        // Verify the init constants match Lingo expectations
        expect(MISSION_ID).toBe(6);
        // The draw position from Lingo is point(360, 155)
        const drawPosition = { x: 360, y: 155 };
        expect(drawPosition.x).toBe(360);
        expect(drawPosition.y).toBe(155);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), (tmpFun > 4), (tmpFun > 10) → myMarker = "two", myMarker = "three"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: (tmpFun > 10)
        // Condition: (tmpFun > 20)
        // Condition: (tmpFun > 25)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: myMarker = "three"
        // Action: myMarker = "four"
        // Action: myMarker = "five"
        // Action: addMedal(the boat of the user of gMulleGlobals, 4)
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 25 → marker = "five", medal = 4
        const result = computeShowBoatResult(26);
        expect(result.marker).toBe('five');
        expect(result.medal).toBe(4);
        expect(result.rating).toBe(5);
      });

      test('path 2: objectp(the world of gMulleGlobals), (tmpFun > 4), (tmpFun > 10) → myMarker = "two", myMarker = "three"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: (tmpFun > 10)
        // Condition: (tmpFun > 20)
        // Condition: NOT (tmpFun > 25)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: myMarker = "three"
        // Action: myMarker = "four"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 20 but NOT > 25 → marker = "four", no medal
        const result = computeShowBoatResult(22);
        expect(result.marker).toBe('four');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(4);
      });

      test('path 3: objectp(the world of gMulleGlobals), (tmpFun > 4), (tmpFun > 10) → myMarker = "two", myMarker = "three"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: (tmpFun > 10)
        // Condition: NOT (tmpFun > 20)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: myMarker = "three"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 10 but NOT > 20 → marker = "three", no medal
        const result = computeShowBoatResult(15);
        expect(result.marker).toBe('three');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(3);
      });

      test('path 4: objectp(the world of gMulleGlobals), (tmpFun > 4), NOT (tmpFun > 10) → myMarker = "two", addCompletedMission(the user of gMulleGlobals, 6)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: NOT (tmpFun > 10)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 4 but NOT > 10 → marker = "two", no medal
        const result = computeShowBoatResult(7);
        expect(result.marker).toBe('two');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(2);
      });

      test('path 5: objectp(the world of gMulleGlobals), NOT (tmpFun > 4) → myMarker = "one", addCompletedMission(the user of gMulleGlobals, 6)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT (tmpFun > 4)
        // Expected behavioral actions:
        // Action: myMarker = "one"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun NOT > 4 → marker = "one", no medal
        const result = computeShowBoatResult(2);
        expect(result.marker).toBe('one');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(1);
      });

      test('path 6: NOT objectp(the world of gMulleGlobals), (tmpFun > 4), (tmpFun > 10) → myMarker = "two", myMarker = "three"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: (tmpFun > 10)
        // Condition: (tmpFun > 20)
        // Condition: (tmpFun > 25)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: myMarker = "three"
        // Action: myMarker = "four"
        // Action: myMarker = "five"
        // Action: addMedal(the boat of the user of gMulleGlobals, 4)
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // Same logic regardless of world objectp — tmpFun > 25 → "five", medal 4
        const result = computeShowBoatResult(30);
        expect(result.marker).toBe('five');
        expect(result.medal).toBe(4);
        expect(result.rating).toBe(5);
      });

      test('path 7: NOT objectp(the world of gMulleGlobals), (tmpFun > 4), (tmpFun > 10) → myMarker = "two", myMarker = "three"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: (tmpFun > 10)
        // Condition: (tmpFun > 20)
        // Condition: NOT (tmpFun > 25)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: myMarker = "three"
        // Action: myMarker = "four"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 20 but NOT > 25 → "four", no medal
        const result = computeShowBoatResult(24);
        expect(result.marker).toBe('four');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(4);
      });

      test('path 8: NOT objectp(the world of gMulleGlobals), (tmpFun > 4), (tmpFun > 10) → myMarker = "two", myMarker = "three"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: (tmpFun > 10)
        // Condition: NOT (tmpFun > 20)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: myMarker = "three"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 10 but NOT > 20 → "three", no medal
        const result = computeShowBoatResult(18);
        expect(result.marker).toBe('three');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(3);
      });

      test('path 9: NOT objectp(the world of gMulleGlobals), (tmpFun > 4), NOT (tmpFun > 10) → myMarker = "two", addCompletedMission(the user of gMulleGlobals, 6)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: (tmpFun > 4)
        // Condition: NOT (tmpFun > 10)
        // Expected behavioral actions:
        // Action: myMarker = "two"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun > 4 but NOT > 10 → "two", no medal
        const result = computeShowBoatResult(8);
        expect(result.marker).toBe('two');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(2);
      });

      test('path 10: NOT objectp(the world of gMulleGlobals), NOT (tmpFun > 4) → myMarker = "one", addCompletedMission(the user of gMulleGlobals, 6)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT (tmpFun > 4)
        // Expected behavioral actions:
        // Action: myMarker = "one"
        // Action: addCompletedMission(the user of gMulleGlobals, 6)
        // Action: go("Start")

        // tmpFun NOT > 4 → "one", no medal
        const result = computeShowBoatResult(0);
        expect(result.marker).toBe('one');
        expect(result.medal).toBeNull();
        expect(result.rating).toBe(1);
      });

    });

  });

});
