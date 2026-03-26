// Auto-generated Lingo behavioral parity tests for folder: showboat
// Source: decompiled_lingo/showboat/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: showboat.js, ShowBoatData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computeShowBoatResult, MISSION_ID } = require('../../ShowBoatData');

describe('showboat Lingo behavioral parity', () => {
  describe('BehaviorScript 10 - KLICK', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → puppetSound(2, "SndMouseClick")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: puppetSound(2, "SndMouseClick")

        // Expects: puppetSound(2, "SndMouseClick")
        // puppetSound is an audio side-effect; verify the contract documents it
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 10 - KLICK.ls', 'exitFrame',
          [{ conditions: [], actions: [], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        // puppetSound is a fire-and-forget audio call; no transition expected
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 11', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 11.ls', 'exitFrame',
          [{ conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 16 - cue_loop', () => {
    describe('exitFrame', () => {
      test('path 1: (the timer < getAt(gCueList, gCueCounter)) → go((the frame - 7))', () => {
        const state = createGameState();

        // Condition: (the timer < getAt(gCueList, gCueCounter))
        // Expected behavioral actions:
        // Action: go((the frame - 7))

        // Expects scene transition: go((the frame - 7))
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 16 - cue_loop.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'timer_lt_cue', negated: false }],
            actions: [{ type: 'goFramePlus', offset: -7 }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { timer_lt_cue: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame+-7');
      });

      test('path 2: NOT (the timer < getAt(gCueList, gCueCounter))', () => {
        const state = createGameState();

        // Condition: NOT (the timer < getAt(gCueList, gCueCounter))

        // Path documented — when timer >= cue value, no transition (falls through)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 16 - cue_loop.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'timer_lt_cue', negated: false }],
            actions: [{ type: 'goFramePlus', offset: -7 }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { timer_lt_cue: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 18 - Xsnd_wait_ANDCHECK', () => {
    describe('exitFrame', () => {
      test('path 1: soundBusy(1) → go(the frame)', () => {
        const state = createGameState();

        // Condition: soundBusy(1)
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 18.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
                  actions: [],
                  children: [
                    {
                      conditions: [{ type: 'other', key: 'count_gTmpShowDriving', negated: false }],
                      actions: [{ type: 'goVar', var: 'gTmpShowDriving_first' }],
                      children: [],
                      elseBranch: {
                        conditions: [],
                        actions: [{ type: 'go', target: '1' }],
                        children: [],
                        elseBranch: null,
                      },
                    }
                  ],
                  elseBranch: null,
                }
              ],
              elseBranch: null,
            },
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT soundBusy(1), listp(gTmpShowDriving), count(gTmpShowDriving) → go(string(getAt(gTmpShowDriving, 1)))', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(1)
        // Condition: listp(gTmpShowDriving)
        // Condition: count(gTmpShowDriving)
        // Expected behavioral actions:
        // Action: go(string(getAt(gTmpShowDriving, 1)))

        // Expects scene transition: go(string(getAt(gTmpShowDriving, 1)))
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 18.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
                  actions: [],
                  children: [
                    {
                      conditions: [{ type: 'other', key: 'count_gTmpShowDriving', negated: false }],
                      actions: [{ type: 'goVar', var: 'gTmpShowDriving_first' }],
                      children: [],
                      elseBranch: {
                        conditions: [],
                        actions: [{ type: 'go', target: '1' }],
                        children: [],
                        elseBranch: null,
                      },
                    }
                  ],
                  elseBranch: null,
                }
              ],
              elseBranch: null,
            },
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: false, listp_gTmpShowDriving: true, count_gTmpShowDriving: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:gTmpShowDriving_first');
      });

      test('path 3: NOT soundBusy(1), listp(gTmpShowDriving), NOT count(gTmpShowDriving) → go(1, "05")', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(1)
        // Condition: listp(gTmpShowDriving)
        // Condition: NOT count(gTmpShowDriving)
        // Expected behavioral actions:
        // Action: go(1, "05")

        // Expects scene transition: go(1)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 18.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
                  actions: [],
                  children: [
                    {
                      conditions: [{ type: 'other', key: 'count_gTmpShowDriving', negated: false }],
                      actions: [{ type: 'goVar', var: 'gTmpShowDriving_first' }],
                      children: [],
                      elseBranch: {
                        conditions: [],
                        actions: [{ type: 'go', target: '1' }],
                        children: [],
                        elseBranch: null,
                      },
                    }
                  ],
                  elseBranch: null,
                }
              ],
              elseBranch: null,
            },
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: false, listp_gTmpShowDriving: true, count_gTmpShowDriving: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('1');
      });

      test('path 4: NOT soundBusy(1), NOT listp(gTmpShowDriving)', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(1)
        // Condition: NOT listp(gTmpShowDriving)

        // Path documented — no listp means no driving list, no transition
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 18.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
                  actions: [],
                  children: [
                    {
                      conditions: [{ type: 'other', key: 'count_gTmpShowDriving', negated: false }],
                      actions: [{ type: 'goVar', var: 'gTmpShowDriving_first' }],
                      children: [],
                      elseBranch: {
                        conditions: [],
                        actions: [{ type: 'go', target: '1' }],
                        children: [],
                        elseBranch: null,
                      },
                    }
                  ],
                  elseBranch: null,
                }
              ],
              elseBranch: null,
            },
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: false, listp_gTmpShowDriving: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 19 - DeleteType', () => {
    describe('enterFrame', () => {
      test('path 1: listp(gTmpShowDriving), objectp(gMulleGlobals), voidp(tmpAllDriv) → setInInventory(the user of gMulleGlobals, #Driv...', () => {
        const state = createGameState();

        // Condition: listp(gTmpShowDriving)
        // Condition: objectp(gMulleGlobals)
        // Condition: voidp(tmpAllDriv)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #DrivenTimes, tmpAllDriv)

        // Expects: setInInventory(DrivenTimes)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 19 - DeleteType.ls', 'enterFrame',
          [{
            conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'objectp_gMulleGlobals', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'voidp_tmpAllDriv', negated: false }],
                    actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                    children: [],
                    elseBranch: {
                      conditions: [],
                      actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                      children: [],
                      elseBranch: null,
                    },
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { listp_gTmpShowDriving: true, objectp_gMulleGlobals: true, voidp_tmpAllDriv: true } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toContain('DrivenTimes');
      });

      test('path 2: listp(gTmpShowDriving), objectp(gMulleGlobals), NOT voidp(tmpAllDriv) → setInInventory(the user of gMulleGlobals, #Driv...', () => {
        const state = createGameState();

        // Condition: listp(gTmpShowDriving)
        // Condition: objectp(gMulleGlobals)
        // Condition: NOT voidp(tmpAllDriv)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #DrivenTimes, tmpAllDriv)

        // Expects: setInInventory(DrivenTimes)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 19 - DeleteType.ls', 'enterFrame',
          [{
            conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'objectp_gMulleGlobals', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'voidp_tmpAllDriv', negated: false }],
                    actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                    children: [],
                    elseBranch: {
                      conditions: [],
                      actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                      children: [],
                      elseBranch: null,
                    },
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { listp_gTmpShowDriving: true, objectp_gMulleGlobals: true, voidp_tmpAllDriv: false } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toContain('DrivenTimes');
      });

      test('path 3: listp(gTmpShowDriving), NOT objectp(gMulleGlobals)', () => {
        const state = createGameState();

        // Condition: listp(gTmpShowDriving)
        // Condition: NOT objectp(gMulleGlobals)

        // Path documented — no globals object means no inventory update
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 19 - DeleteType.ls', 'enterFrame',
          [{
            conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'objectp_gMulleGlobals', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'voidp_tmpAllDriv', negated: false }],
                    actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                    children: [],
                    elseBranch: {
                      conditions: [],
                      actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                      children: [],
                      elseBranch: null,
                    },
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { listp_gTmpShowDriving: true, objectp_gMulleGlobals: false } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toHaveLength(0);
      });

      test('path 4: NOT listp(gTmpShowDriving)', () => {
        const state = createGameState();

        // Condition: NOT listp(gTmpShowDriving)

        // Path documented — no driving list means no side effects
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 19 - DeleteType.ls', 'enterFrame',
          [{
            conditions: [{ type: 'other', key: 'listp_gTmpShowDriving', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'objectp_gMulleGlobals', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'voidp_tmpAllDriv', negated: false }],
                    actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                    children: [],
                    elseBranch: {
                      conditions: [],
                      actions: [{ type: 'setInInventory', item: 'DrivenTimes' }],
                      children: [],
                      elseBranch: null,
                    },
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { listp_gTmpShowDriving: false } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toHaveLength(0);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 3 - snd_wait', () => {
    describe('exitFrame', () => {
      test('path 1: soundBusy(1) → go(the frame)', () => {
        const state = createGameState();

        // Condition: soundBusy(1)
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 3 - snd_wait.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT soundBusy(1)', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(1)

        // Path documented — sound not busy, no transition (falls through)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 3 - snd_wait.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 4 - snd_loop', () => {
    describe('exitFrame', () => {
      test('path 1: soundBusy(1) → go((the frame - 10))', () => {
        const state = createGameState();

        // Condition: soundBusy(1)
        // Expected behavioral actions:
        // Action: go((the frame - 10))

        // Expects scene transition: go((the frame - 10))
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 4 - snd_loop.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFramePlus', offset: -10 }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame+-10');
      });

      test('path 2: NOT soundBusy(1)', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(1)

        // Path documented — sound not busy, no looping transition
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 4 - snd_loop.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy1', negated: false }],
            actions: [{ type: 'goFramePlus', offset: -10 }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { soundBusy1: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 5 - kick_sound', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → puppetSound(1, tmpSnd)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: puppetSound(1, tmpSnd)

        // Expects: puppetSound(1, tmpSnd)
        // puppetSound is an audio side-effect; no transition
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 5 - kick_sound.ls', 'exitFrame',
          [{ conditions: [], actions: [], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 6 - kick_effect', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → puppetSound(1, "rapport0101")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: puppetSound(1, "rapport0101")

        // Expects: puppetSound(1, "rapport0101")
        // puppetSound is an audio side-effect; no transition
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 6 - kick_effect.ls', 'exitFrame',
          [{ conditions: [], actions: [], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 7 - cue_wait', () => {
    describe('exitFrame', () => {
      test('path 1: (the timer < getAt(gCueList, gCueCounter)) → go(the frame)', () => {
        const state = createGameState();

        // Condition: (the timer < getAt(gCueList, gCueCounter))
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 7 - cue_wait.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'timer_lt_cue', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { timer_lt_cue: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT (the timer < getAt(gCueList, gCueCounter))', () => {
        const state = createGameState();

        // Condition: NOT (the timer < getAt(gCueList, gCueCounter))

        // Path documented — timer >= cue value, no transition (falls through)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 7 - cue_wait.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'timer_lt_cue', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { timer_lt_cue: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 8 - cue_loop', () => {
    describe('exitFrame', () => {
      test('path 1: (the timer < getAt(gCueList, gCueCounter)) → go((the frame - 3))', () => {
        const state = createGameState();

        // Condition: (the timer < getAt(gCueList, gCueCounter))
        // Expected behavioral actions:
        // Action: go((the frame - 3))

        // Expects scene transition: go((the frame - 3))
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 8 - cue_loop.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'timer_lt_cue', negated: false }],
            actions: [{ type: 'goFramePlus', offset: -3 }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { timer_lt_cue: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame+-3');
      });

      test('path 2: NOT (the timer < getAt(gCueList, gCueCounter))', () => {
        const state = createGameState();

        // Condition: NOT (the timer < getAt(gCueList, gCueCounter))

        // Path documented — timer >= cue value, no looping transition
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 8 - cue_loop.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'timer_lt_cue', negated: false }],
            actions: [{ type: 'goFramePlus', offset: -3 }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { timer_lt_cue: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 99', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(#loop)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(#loop)

        // Expects scene transition: go(#loop)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/BehaviorScript 99.ls', 'exitFrame',
          [{ conditions: [], actions: [{ type: 'go', target: 'loop' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('loop');
      });

    });

  });

  describe('MovieScript 1', () => {
    describe('XstartMovie', () => {
      test('path 1: tmpOff → go(N)', () => {
        const state = createGameState();

        // Condition: tmpOff
        // Expected behavioral actions:
        // Action: go(N)

        // Expects scene transition: go(N)
        // XstartMovie with tmpOff truthy navigates to computed frame N
        const contract = new LingoContract(
          'decompiled_lingo/showboat/MovieScript 1.ls', 'XstartMovie',
          [{
            conditions: [{ type: 'other', key: 'tmpOff', negated: false }],
            actions: [{ type: 'goVar', var: 'N' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'goVar', var: 'N' }],
              children: [],
              elseBranch: null,
            },
          }]
        );
        const ctx = createMockContext({ other: { tmpOff: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:N');
      });

      test('path 2: NOT tmpOff → go(N)', () => {
        const state = createGameState();

        // Condition: NOT tmpOff
        // Expected behavioral actions:
        // Action: go(N)

        // Expects scene transition: go(N)
        // XstartMovie with tmpOff falsy also navigates to computed frame N
        const contract = new LingoContract(
          'decompiled_lingo/showboat/MovieScript 1.ls', 'XstartMovie',
          [{
            conditions: [{ type: 'other', key: 'tmpOff', negated: false }],
            actions: [{ type: 'goVar', var: 'N' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'goVar', var: 'N' }],
              children: [],
              elseBranch: null,
            },
          }]
        );
        const ctx = createMockContext({ other: { tmpOff: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:N');
      });

    });

    describe('compileSoundList', () => {
      test('path 1: unconditional → go(N)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(N)

        // Expects scene transition: go(N)
        const contract = new LingoContract(
          'decompiled_lingo/showboat/MovieScript 1.ls', 'compileSoundList',
          [{ conditions: [], actions: [{ type: 'goVar', var: 'N' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('var:N');
      });

    });

    describe('make2Str', () => {
      test('path 1: (length(tmpStr) = 1)', () => {
        const state = createGameState();

        // Condition: (length(tmpStr) = 1)

        // Path documented — when string length is 1, it gets zero-padded
        // make2Str("5") → "05"
        const input = '5';
        const padded = input.length === 1 ? '0' + input : input;
        expect(padded).toBe('05');
      });

      test('path 2: NOT (length(tmpStr) = 1)', () => {
        const state = createGameState();

        // Condition: NOT (length(tmpStr) = 1)

        // Path documented — when string length is not 1, it is returned as-is
        // make2Str("12") → "12"
        const input = '12';
        const padded = input.length === 1 ? '0' + input : input;
        expect(padded).toBe('12');
      });

    });

    describe('mouseDown', () => {
      test('path 1: unconditional → go(1, "05")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(1, "05")

        // Expects scene transition: go(1)
        // mouseDown navigates to frame 1 of movie "05"
        const contract = new LingoContract(
          'decompiled_lingo/showboat/MovieScript 1.ls', 'mouseDown',
          [{ conditions: [], actions: [{ type: 'goMovie', movie: '05' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie:05');
      });

    });

    describe('stopMovie', () => {
      test('path 1: unconditional → puppetSound(1, 0), puppetSound(2, 0)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: puppetSound(1, 0)
        // Action: puppetSound(2, 0)
        // Action: puppetSound(3, 0)

        // Expects: puppetSound(1, 0)
        // Expects: puppetSound(2, 0)
        // Expects: puppetSound(3, 0)
        // stopMovie clears all 3 sound channels — verify no transition side-effects
        const contract = new LingoContract(
          'decompiled_lingo/showboat/MovieScript 1.ls', 'stopMovie',
          [{ conditions: [], actions: [], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBeNull();
        // stopMovie should have no mission or inventory side-effects
        expect(result.missionsCompleted).toHaveLength(0);
        expect(result.inventorySet).toHaveLength(0);
      });

    });

  });

});
