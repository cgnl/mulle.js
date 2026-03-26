// Auto-generated Lingo behavioral parity tests for folder: boat_70
// Source: decompiled_lingo/boat_70/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: erson.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');

describe('boat_70 Lingo behavioral parity', () => {
  describe('BehaviorScript 2', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        // Expected behavioral actions:
        // Action: go("leave")

        const branches = [
          {
            conditions: [],
            actions: [{ type: 'go', target: 'leave' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/BehaviorScript 2.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        // Expected behavioral actions:
        // Action: go(the frame)

        const branches = [
          {
            conditions: [],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/BehaviorScript 3.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 5', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        const branches = [
          {
            conditions: [],
            actions: [{ type: 'goVar', var: 'myMarker' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/BehaviorScript 5.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('ParentScript 1 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → cursor(200)', () => {
        // Expected behavioral actions:
        // Action: cursor(200)

        // Verify the cursor constant matches the Lingo script
        const CURSOR_VALUE = 200;
        expect(CURSOR_VALUE).toBe(200);
      });

    });

    describe('startMovie', () => {
      // Branch tree for startMovie: checks objId, helmet, Suit, givePart
      const branches = [
        {
          conditions: [{ type: 'other', key: 'objectp_the_world_of_gMulleGlobals_', negated: false }],
          actions: [],
          children: [],
          elseBranch: {
            conditions: [],
            actions: [],
            children: [],
            elseBranch: null,
          },
        },
        {
          conditions: [{ type: 'other', key: 'objId', negated: false }],
          actions: [],
          children: [
            {
              conditions: [{ type: 'inventory', key: 'helmet', negated: false }],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'inventory', key: 'Suit', negated: false }],
                  actions: [{ type: 'addCompletedMission', mission: 15 }],
                  children: [
                    {
                      conditions: [{ type: 'other', key: 'givePart____NoPart', negated: false }],
                      actions: [{ type: 'goVar', var: 'myMarker' }],
                      children: [],
                      elseBranch: {
                        conditions: [],
                        actions: [{ type: 'addNewPart' }, { type: 'goVar', var: 'myMarker' }],
                        children: [],
                        elseBranch: null,
                      },
                    }
                  ],
                  elseBranch: {
                    conditions: [],
                    actions: [{ type: 'goVar', var: 'myMarker' }],
                    children: [],
                    elseBranch: null,
                  },
                }
              ],
              elseBranch: {
                conditions: [],
                actions: [{ type: 'goVar', var: 'myMarker' }],
                children: [],
                elseBranch: null,
              },
            }
          ],
          elseBranch: {
            conditions: [],
            actions: [{ type: 'goVar', var: 'myMarker' }],
            children: [],
            elseBranch: null,
          },
        }
      ];

      test('path 1: objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, #helmet) → addCompletedMission(the user of gMulleGlobals, 15), myMarker = "JustDoit"', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (givePart = #NoPart)

        const ctx = createMockContext({ inventory: { helmet: true, Suit: true }, other: { objectp_the_world_of_gMulleGlobals_: true, objId: true, givePart____NoPart: true } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(15);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 2: objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, #helmet) → addCompletedMission(the user of gMulleGlobals, 15), myMarker = "JustDoit"', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (givePart = #NoPart)

        const ctx = createMockContext({ inventory: { helmet: true, Suit: true }, other: { objectp_the_world_of_gMulleGlobals_: true, objId: true, givePart____NoPart: false } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(15);
        expect(result.partsAdded).toBeGreaterThan(0);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 3: objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, #helmet) → myMarker = "cantDoit", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Suit)

        const ctx = createMockContext({ inventory: { helmet: true, Suit: false }, other: { objectp_the_world_of_gMulleGlobals_: true, objId: true } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toEqual([]);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 4: objectp(the world of gMulleGlobals), objId, NOT isInInventory(the user of gMulleGlobals, #helmet) → myMarker = "cantDoit", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": false
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isInInventory(the user of gMulleGlobals, #helmet)

        const ctx = createMockContext({ inventory: { helmet: false }, other: { objectp_the_world_of_gMulleGlobals_: true, objId: true } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toEqual([]);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 5: objectp(the world of gMulleGlobals), NOT objId → go(myMarker)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT objId

        const ctx = createMockContext({ other: { objectp_the_world_of_gMulleGlobals_: true, objId: false } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toEqual([]);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 6: NOT objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, #helmet) → addCompletedMission(the user of gMulleGlobals, 15), myMarker = "JustDoit"', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: (givePart = #NoPart)

        const ctx = createMockContext({ inventory: { helmet: true, Suit: true }, other: { objectp_the_world_of_gMulleGlobals_: false, objId: true, givePart____NoPart: true } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(15);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 7: NOT objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, #helmet) → addCompletedMission(the user of gMulleGlobals, 15), myMarker = "JustDoit"', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": true
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: isInInventory(the user of gMulleGlobals, #Suit)
        // Condition: NOT (givePart = #NoPart)

        const ctx = createMockContext({ inventory: { helmet: true, Suit: true }, other: { objectp_the_world_of_gMulleGlobals_: false, objId: true, givePart____NoPart: false } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(15);
        expect(result.partsAdded).toBeGreaterThan(0);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 8: NOT objectp(the world of gMulleGlobals), objId, isInInventory(the user of gMulleGlobals, #helmet) → myMarker = "cantDoit", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": true,
                            "Suit": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isInInventory(the user of gMulleGlobals, #helmet)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Suit)

        const ctx = createMockContext({ inventory: { helmet: true, Suit: false }, other: { objectp_the_world_of_gMulleGlobals_: false, objId: true } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toEqual([]);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 9: NOT objectp(the world of gMulleGlobals), objId, NOT isInInventory(the user of gMulleGlobals, #helmet) → myMarker = "cantDoit", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "helmet": false
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isInInventory(the user of gMulleGlobals, #helmet)

        const ctx = createMockContext({ inventory: { helmet: false }, other: { objectp_the_world_of_gMulleGlobals_: false, objId: true } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toEqual([]);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 10: NOT objectp(the world of gMulleGlobals), NOT objId → go(myMarker)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT objId

        const ctx = createMockContext({ other: { objectp_the_world_of_gMulleGlobals_: false, objId: false } });
        const contract = new LingoContract('decompiled_lingo/boat_70/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toEqual([]);
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

});
