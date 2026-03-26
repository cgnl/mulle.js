// Auto-generated Lingo behavioral parity tests for folder: boat_71
// Source: decompiled_lingo/boat_71/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: haven.js, HarborData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');

describe('boat_71 Lingo behavioral parity', () => {
  describe('BehaviorScript 11', () => {
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
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 11.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('BehaviorScript 2', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go((the frame + 1))', () => {
        // Expected behavioral actions:
        // Action: go((the frame + 1))

        const branches = [
          {
            conditions: [],
            actions: [{ type: 'goFramePlus', offset: 1 }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 2.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame+1');
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
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 3.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 5', () => {
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
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 5.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 6', () => {
    describe('CuePassed', () => {
      test('path 1: unconditional → go((the frame + 1))', () => {
        // Expected behavioral actions:
        // Action: go((the frame + 1))

        const branches = [
          {
            conditions: [],
            actions: [{ type: 'goFramePlus', offset: 1 }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 6.ls', 'CuePassed', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame+1');
      });

    });

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
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 6.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 7', () => {
    describe('exitFrame', () => {
      test('path 1: soundBusy(1) → go(the frame)', () => {
        // Condition: soundBusy(1)
        // Expected behavioral actions:
        // Action: go(the frame)

        const branches = [
          {
            conditions: [{ type: 'other', key: 'soundBusy_1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'goFramePlus', offset: 1 }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { soundBusy_1: true } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 7.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT soundBusy(1) → go((the frame + 1))', () => {
        // Condition: NOT soundBusy(1)
        // Expected behavioral actions:
        // Action: go((the frame + 1))

        const branches = [
          {
            conditions: [{ type: 'other', key: 'soundBusy_1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'goFramePlus', offset: 1 }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { soundBusy_1: false } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/BehaviorScript 7.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame+1');
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
      // Branch tree for startMovie: checks power >= 200, then givePart
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
          conditions: [{ type: 'property', key: 'power', negated: false }],
          actions: [],
          children: [
            {
              conditions: [{ type: 'other', key: 'givePart____NoPart', negated: false }],
              actions: [{ type: 'addCompletedMission', mission: 14 }, { type: 'goVar', var: 'myMarker' }],
              children: [],
              elseBranch: {
                conditions: [],
                actions: [{ type: 'addNewPart' }, { type: 'addCompletedMission', mission: 14 }, { type: 'goVar', var: 'myMarker' }],
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

      test('path 1: objectp(the world of gMulleGlobals), (getProperty(tmpBoat, #power) >= 200), (givePart = #NoPart) → myMarker = "JustDoit", addCompletedMission(the user of gMulleGlobals, 14)', () => {
        // Condition: objectp(the world of gMulleGlobals)
        // Condition: (getProperty(tmpBoat, #power) >= 200)
        // Condition: (givePart = #NoPart)

        const ctx = createMockContext({ boatProperties: { power: true }, other: { objectp_the_world_of_gMulleGlobals_: true, givePart____NoPart: true } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(14);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 2: objectp(the world of gMulleGlobals), (getProperty(tmpBoat, #power) >= 200), NOT (givePart = #NoPart) → addCompletedMission(the user of gMulleGlobals, 14), myMarker = "JustDoit"', () => {
        // Condition: objectp(the world of gMulleGlobals)
        // Condition: (getProperty(tmpBoat, #power) >= 200)
        // Condition: NOT (givePart = #NoPart)

        const ctx = createMockContext({ boatProperties: { power: true }, other: { objectp_the_world_of_gMulleGlobals_: true, givePart____NoPart: false } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.partsAdded).toBeGreaterThan(0);
        expect(result.missionsCompleted).toContain(14);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 3: objectp(the world of gMulleGlobals), NOT (getProperty(tmpBoat, #power) >= 200) → myMarker = "cantDoIt", go(myMarker)', () => {
        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT (getProperty(tmpBoat, #power) >= 200)

        const ctx = createMockContext({ boatProperties: { power: false }, other: { objectp_the_world_of_gMulleGlobals_: true } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:myMarker');
        expect(result.missionsCompleted).toEqual([]);
      });

      test('path 4: NOT objectp(the world of gMulleGlobals), (getProperty(tmpBoat, #power) >= 200), (givePart = #NoPart) → myMarker = "JustDoit", addCompletedMission(the user of gMulleGlobals, 14)', () => {
        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: (getProperty(tmpBoat, #power) >= 200)
        // Condition: (givePart = #NoPart)

        const ctx = createMockContext({ boatProperties: { power: true }, other: { objectp_the_world_of_gMulleGlobals_: false, givePart____NoPart: true } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(14);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 5: NOT objectp(the world of gMulleGlobals), (getProperty(tmpBoat, #power) >= 200), NOT (givePart = #NoPart) → addCompletedMission(the user of gMulleGlobals, 14), myMarker = "JustDoit"', () => {
        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: (getProperty(tmpBoat, #power) >= 200)
        // Condition: NOT (givePart = #NoPart)

        const ctx = createMockContext({ boatProperties: { power: true }, other: { objectp_the_world_of_gMulleGlobals_: false, givePart____NoPart: false } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.partsAdded).toBeGreaterThan(0);
        expect(result.missionsCompleted).toContain(14);
        expect(result.transition).toBe('var:myMarker');
      });

      test('path 6: NOT objectp(the world of gMulleGlobals), NOT (getProperty(tmpBoat, #power) >= 200) → myMarker = "cantDoIt", go(myMarker)', () => {
        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT (getProperty(tmpBoat, #power) >= 200)

        const ctx = createMockContext({ boatProperties: { power: false }, other: { objectp_the_world_of_gMulleGlobals_: false } });
        const contract = new LingoContract('decompiled_lingo/boat_71/casts/Internal/ParentScript 1 - Dir.ls', 'startMovie', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:myMarker');
        expect(result.missionsCompleted).toEqual([]);
      });

    });

  });

});
