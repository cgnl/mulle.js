// Auto-generated Lingo behavioral parity tests for folder: boat_79
// Source: decompiled_lingo/boat_79/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: fisherman.js, FishermanData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computeFishermanResult, MARKER_SUCCESS, MARKER_FAILURE } = require('../../FishermanData');

describe('boat_79 Lingo behavioral parity', () => {
  describe('BehaviorScript 1', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const contract = new LingoContract('boat_79/BehaviorScript1', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 10', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const contract = new LingoContract('boat_79/BehaviorScript10', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 15', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("justDoIt")', () => {
        const contract = new LingoContract('boat_79/BehaviorScript15', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'justDoIt' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('justDoIt');
      });

    });

  });

  describe('BehaviorScript 2', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const contract = new LingoContract('boat_79/BehaviorScript2', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 28', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("justDoIt")', () => {
        const contract = new LingoContract('boat_79/BehaviorScript28', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'justDoIt' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('justDoIt');
      });

    });

  });

  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("cantDoIt")', () => {
        const contract = new LingoContract('boat_79/BehaviorScript3', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'cantDoIt' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('cantDoIt');
      });

    });

  });

  describe('BehaviorScript 5', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("anchorleave")', () => {
        const contract = new LingoContract('boat_79/BehaviorScript5', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'anchorleave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('anchorleave');
      });

    });

  });

  describe('BehaviorScript 73 - MyrLogBH', () => {
  });

  describe('BehaviorScript 9', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("burkLeave")', () => {
        const contract = new LingoContract('boat_79/BehaviorScript9', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'burkLeave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('burkLeave');
      });

    });

  });

  describe('ParentScript 4 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(320, 155))', () => {
        const DRAW_BOAT_POSITION = { x: 320, y: 155 };
        const CURSOR_TYPE = 200;

        // Verify init constants match original Lingo values
        expect(DRAW_BOAT_POSITION).toEqual({ x: 320, y: 155 });
        expect(CURSOR_TYPE).toBe(200);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → addCompletedMission(the user of gMulleGlobals, 17), deleteFromInventory(the user of gM...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.actions.completeMission17).toBe(true);
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.refuelToFull).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
      });

      test('path 2: objectp(the world of gMulleGlobals), objId, NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → myMarker = "cantdoIT", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.actions.completeMission17).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
        expect(result.actions.refuelToFull).toBe(false);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 3: objectp(the world of gMulleGlobals), NOT objId, isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → addCompletedMission(the user of gMulleGlobals, 17), deleteFromInventory(the user o...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.actions.completeMission17).toBe(true);
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.refuelToFull).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
      });

      test('path 4: objectp(the world of gMulleGlobals), NOT objId, NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → myMarker = "cantdoIT", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.actions.completeMission17).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
        expect(result.actions.refuelToFull).toBe(false);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 5: NOT objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → addCompletedMission(the user of gMulleGlobals, 17), deleteFromInventory(the user o...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.actions.completeMission17).toBe(true);
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.refuelToFull).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
      });

      test('path 6: NOT objectp(the world of gMulleGlobals), objId, NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → myMarker = "cantdoIT", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.actions.completeMission17).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
        expect(result.actions.refuelToFull).toBe(false);
        expect(result.actions.giveBelly).toBe(false);
      });

      test('path 7: NOT objectp(the world of gMulleGlobals), NOT objId, isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → addCompletedMission(the user of gMulleGlobals, 17), deleteFromInventory(the us...', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // Condition: isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: true });
        expect(result.marker).toBe(MARKER_SUCCESS);
        expect(result.actions.completeMission17).toBe(true);
        expect(result.actions.deleteItem).toBe(true);
        expect(result.actions.refuelToFull).toBe(true);
        expect(result.actions.giveBelly).toBe(true);
      });

      test('path 8: NOT objectp(the world of gMulleGlobals), NOT objId, NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded) → myMarker = "cantdoIT", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "tmpStuffNeeded": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // Condition: NOT isInInventory(the user of gMulleGlobals, tmpStuffNeeded)
        const result = computeFishermanResult({ hasRequiredItem: false });
        expect(result.marker).toBe(MARKER_FAILURE);
        expect(result.actions.completeMission17).toBe(false);
        expect(result.actions.deleteItem).toBe(false);
        expect(result.actions.refuelToFull).toBe(false);
        expect(result.actions.giveBelly).toBe(false);
      });

    });

  });

});
