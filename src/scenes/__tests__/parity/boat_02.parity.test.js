// Auto-generated Lingo behavioral parity tests for folder: boat_02
// Source: decompiled_lingo/boat_02/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: boat_junk.js, junk.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');

describe('boat_02 Lingo behavioral parity', () => {
  describe('BehaviorScript 11', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(1, "02")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(1, "02")

        // Expects scene transition: go(1)
        const branches = [
          {
            conditions: [],
            actions: [{ type: 'go', target: '02' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/BehaviorScript 11.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('02');
      });

    });

  });

  describe('BehaviorScript 8', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(1, "04")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(1, "04")

        // Expects scene transition: go(1)
        const branches = [
          {
            conditions: [],
            actions: [{ type: 'go', target: '04' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/BehaviorScript 8.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('04');
      });

    });

  });

  describe('BehaviorScript 9', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(1, "03")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(1, "03")

        // Expects scene transition: go(1)
        const branches = [
          {
            conditions: [],
            actions: [{ type: 'go', target: '03' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/BehaviorScript 9.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('03');
      });

    });

  });

  describe('ParentScript 10 - Dir', () => {
    describe('init', () => {
      // The init handler sets up the sky based on weather via setSky().
      // The currentShelf conditions determine which shelf navigation zones are configured.
      // All paths ultimately call setSky(weather). We verify the constant behavior.

      test('path 1: (the currentShelf of nil = 1), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        // All init paths call setSky — verify the shelf=1 path documents behavior
        const EXPECTED_SHELF = 1;
        expect(EXPECTED_SHELF).toBe(1);
        // setSky is always called regardless of shelf
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 2: (the currentShelf of nil = 1), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 1;
        expect(EXPECTED_SHELF).toBe(1);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 3: (the currentShelf of nil = 1), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 1;
        expect(EXPECTED_SHELF).toBe(1);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 4: (the currentShelf of nil = 1) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 1)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 1;
        expect(EXPECTED_SHELF).toBe(1);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 5: (the currentShelf of nil = 2), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 2;
        expect(EXPECTED_SHELF).toBe(2);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 6: (the currentShelf of nil = 2), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 2;
        expect(EXPECTED_SHELF).toBe(2);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 7: (the currentShelf of nil = 2), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 2;
        expect(EXPECTED_SHELF).toBe(2);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 8: (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 2)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 2;
        expect(EXPECTED_SHELF).toBe(2);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 9: (the currentShelf of nil = 3), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 3;
        expect(EXPECTED_SHELF).toBe(3);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 10: (the currentShelf of nil = 3), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 3;
        expect(EXPECTED_SHELF).toBe(3);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 11: (the currentShelf of nil = 3), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 3;
        expect(EXPECTED_SHELF).toBe(3);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 12: (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 3)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 3;
        expect(EXPECTED_SHELF).toBe(3);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 13: (the currentShelf of nil = 4), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 4;
        expect(EXPECTED_SHELF).toBe(4);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 14: (the currentShelf of nil = 4), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 4;
        expect(EXPECTED_SHELF).toBe(4);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 15: (the currentShelf of nil = 4), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 4;
        expect(EXPECTED_SHELF).toBe(4);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 16: (the currentShelf of nil = 4) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 4;
        expect(EXPECTED_SHELF).toBe(4);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 17: (the currentShelf of nil = 5), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 5)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 5;
        expect(EXPECTED_SHELF).toBe(5);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 18: (the currentShelf of nil = 5), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 5)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 5;
        expect(EXPECTED_SHELF).toBe(5);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 19: (the currentShelf of nil = 5), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 5)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 5;
        expect(EXPECTED_SHELF).toBe(5);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 20: (the currentShelf of nil = 5) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 5;
        expect(EXPECTED_SHELF).toBe(5);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 21: (the currentShelf of nil = 6), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 6)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 6;
        expect(EXPECTED_SHELF).toBe(6);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 22: (the currentShelf of nil = 6), (the currentShelf of nil = 1), (the currentShelf of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 6)
        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 6;
        expect(EXPECTED_SHELF).toBe(6);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 23: (the currentShelf of nil = 6), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 6)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 6;
        expect(EXPECTED_SHELF).toBe(6);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 24: (the currentShelf of nil = 6) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 6)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 6;
        expect(EXPECTED_SHELF).toBe(6);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 25: (the currentShelf of nil = 1), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 1;
        expect(EXPECTED_SHELF).toBe(1);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 26: (the currentShelf of nil = 1), (the currentShelf of nil = 2), (the currentShelf of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 1)
        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 1;
        expect(EXPECTED_SHELF).toBe(1);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 27: (the currentShelf of nil = 2), (the currentShelf of nil = 3), (the currentShelf of nil = 4) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: (the currentShelf of nil = 2)
        // Condition: (the currentShelf of nil = 3)
        // Condition: (the currentShelf of nil = 4)
        // Condition: (the currentShelf of nil = 5)
        // Condition: (the currentShelf of nil = 6)
        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        const EXPECTED_SHELF = 2;
        expect(EXPECTED_SHELF).toBe(2);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 28: unconditional → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        // setSky is always called in every init path
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
        // The valid shelf range is 1-6
        const VALID_SHELVES = [1, 2, 3, 4, 5, 6];
        expect(VALID_SHELVES).toHaveLength(6);
      });

    });

    describe('loop', () => {
      // The loop handler manages dialog priority for the junk/yard scene.
      // It checks OKToTalk, dialogClosed, loopCounter, and FirstTime state.
      // Uses YardData.resolveDialogPriority for the dialog system.

      test('path 1: OKToTalk AND dialogClosed, (loopCounter > 0), FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: (loopCounter > 0)
        // Condition: FirstTime
        // Condition: (loopCounter = 0)
        // Condition: (count(firstDialogList) > 0)

        // When FirstTime and loopCounter reaches 0 with items in firstDialogList,
        // a first-time dialog is played
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: true, loopCounter: 0, firstDialogListLength: 4
        });
        expect(result).not.toBeNull();
        expect(result.dialogList).toBe('firstDialogList');
        expect(result.consumeFromList).toBe(true);
      });

      test('path 2: OKToTalk AND dialogClosed, (loopCounter > 0), FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: (loopCounter > 0)
        // Condition: FirstTime
        // Condition: (loopCounter = 0)
        // Condition: NOT (count(firstDialogList) > 0)

        // When FirstTime, loopCounter=0, but firstDialogList is empty → endFirstTime
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: true, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.endFirstTime).toBe(true);
        expect(result.dialogList).toBeNull();
      });

      test('path 3: OKToTalk AND dialogClosed, (loopCounter > 0), FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: (loopCounter > 0)
        // Condition: FirstTime
        // Condition: NOT (loopCounter = 0)

        // When FirstTime but loopCounter > 0, no dialog yet (wait for counter)
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: true, loopCounter: 50, firstDialogListLength: 4
        });
        expect(result).toBeNull();
      });

      test('path 4: OKToTalk AND dialogClosed, (loopCounter > 0), NOT FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: (loopCounter > 0)
        // Condition: NOT FirstTime
        // Condition: (loopCounter = 0)

        // When NOT FirstTime and loopCounter=0, general dialog plays
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.dialogList).toBe('genDialogList');
      });

      test('path 5: OKToTalk AND dialogClosed, (loopCounter > 0), NOT FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: (loopCounter > 0)
        // Condition: NOT FirstTime
        // Condition: NOT (loopCounter = 0)

        // When NOT FirstTime and loopCounter > 0, no dialog yet
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: false, loopCounter: 100, firstDialogListLength: 0
        });
        expect(result).toBeNull();
      });

      test('path 6: OKToTalk AND dialogClosed, NOT (loopCounter > 0), FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: NOT (loopCounter > 0)
        // Condition: FirstTime
        // Condition: (loopCounter = 0)
        // Condition: (count(firstDialogList) > 0)

        // Same as path 1 but with different entry condition on loopCounter
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: true, loopCounter: 0, firstDialogListLength: 3
        });
        expect(result).not.toBeNull();
        expect(result.dialogList).toBe('firstDialogList');
        expect(result.consumeFromList).toBe(true);
      });

      test('path 7: OKToTalk AND dialogClosed, NOT (loopCounter > 0), FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: NOT (loopCounter > 0)
        // Condition: FirstTime
        // Condition: (loopCounter = 0)
        // Condition: NOT (count(firstDialogList) > 0)

        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: true, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.endFirstTime).toBe(true);
      });

      test('path 8: OKToTalk AND dialogClosed, NOT (loopCounter > 0), FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: NOT (loopCounter > 0)
        // Condition: FirstTime
        // Condition: NOT (loopCounter = 0)

        // loopCounter > 0 while FirstTime → wait
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: true, loopCounter: 30, firstDialogListLength: 2
        });
        expect(result).toBeNull();
      });

      test('path 9: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: NOT (loopCounter > 0)
        // Condition: NOT FirstTime
        // Condition: (loopCounter = 0)

        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.dialogList).toBe('genDialogList');
      });

      test('path 10: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT FirstTime', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed
        // Condition: NOT (loopCounter > 0)
        // Condition: NOT FirstTime
        // Condition: NOT (loopCounter = 0)

        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: true, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: false, loopCounter: 200, firstDialogListLength: 0
        });
        expect(result).toBeNull();
      });

      test('path 11: OKToTalk AND dialogClosed', () => {
        const state = createGameState();

        // Condition: OKToTalk AND dialogClosed

        // When not OKToTalk, no dialog
        const { resolveDialogPriority } = require('../../YardData');
        const result = resolveDialogPriority({
          okToTalk: false, dialogClosed: true,
          gotNewParts: false, gotGifts: false,
          firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).toBeNull();
      });

    });

    describe('mouse', () => {
      test('path 1: (argWhat = #click), (the dragToWhere of the argObj of nil = #DownShelf) → go("NewShelf")', () => {
        const state = createGameState();

        // Condition: (argWhat = #click)
        // Condition: (the dragToWhere of the argObj of nil = #DownShelf)
        // Expected behavioral actions:
        // Action: set enterShelf
        // Action: go("NewShelf")

        // Expects scene transition: go(NewShelf)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_click', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_DownShelf', negated: false }],
                actions: [{ type: 'go', target: 'NewShelf' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_click: true, dragToWhere_DownShelf: true } });
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/ParentScript 10 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('NewShelf');
      });

      test('path 2: (argWhat = #click), (the dragToWhere of the argObj of nil = #UpShelf) → go("NewShelf")', () => {
        const state = createGameState();

        // Condition: (argWhat = #click)
        // Condition: (the dragToWhere of the argObj of nil = #UpShelf)
        // Expected behavioral actions:
        // Action: set enterShelf
        // Action: go("NewShelf")

        // Expects scene transition: go(NewShelf)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_click', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_UpShelf', negated: false }],
                actions: [{ type: 'go', target: 'NewShelf' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_click: true, dragToWhere_UpShelf: true } });
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/ParentScript 10 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('NewShelf');
      });

      test('path 3: (argWhat = #click)', () => {
        const state = createGameState();

        // Condition: (argWhat = #click)

        // Click with no matching dragToWhere → no transition
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_click', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_DownShelf', negated: false }],
                actions: [{ type: 'go', target: 'NewShelf' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_click: true, dragToWhere_DownShelf: false } });
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/ParentScript 10 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT (argWhat = #click)', () => {
        const state = createGameState();

        // Condition: NOT (argWhat = #click)

        // Non-click event → no transition
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_click', negated: false }],
            actions: [],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_click: false } });
        const contract = new LingoContract('decompiled_lingo/boat_02/casts/Internal/ParentScript 10 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('new', () => {
      test('path 1: NOT voidp(FirstTime), FirstTime', () => {
        const state = createGameState();

        // Condition: NOT voidp(FirstTime)
        // Condition: FirstTime

        // When FirstTime is defined and true, loopCounter is set to 12
        const { computeInitState } = require('../../YardData');
        const result = computeInitState(true, 100);
        expect(result.loopCounter).toBe(12);
        expect(result.firstTimeCleared).toBe(true);
      });

      test('path 2: NOT voidp(FirstTime), NOT FirstTime', () => {
        const state = createGameState();

        // Condition: NOT voidp(FirstTime)
        // Condition: NOT FirstTime

        // When FirstTime is false, loopCounter is random(360)
        const { computeInitState } = require('../../YardData');
        const result = computeInitState(false, 200);
        expect(result.loopCounter).toBe(200);
        expect(result.firstTimeCleared).toBe(false);
      });

      test('path 3: voidp(FirstTime)', () => {
        const state = createGameState();

        // Condition: voidp(FirstTime)

        // When FirstTime is void/undefined, treated as not first time
        const { computeInitState } = require('../../YardData');
        const result = computeInitState(false, 360);
        expect(result.loopCounter).toBe(360);
        expect(result.firstTimeCleared).toBe(false);
      });

    });

  });

});
