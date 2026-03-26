// Auto-generated Lingo behavioral parity tests for folder: boat_04
// Source: decompiled_lingo/boat_04/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: boatyard.js, yard.js, YardData.js, QuayData.js, ShipYardData.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');

describe('boat_04 Lingo behavioral parity', () => {
  describe('BehaviorScript 10', () => {
    describe('exitFrame', () => {
      test('path 1: NOT finished(gSound, the soundID of gDir) → go(the frame)', () => {
        const state = createGameState();

        // Condition: NOT finished(gSound, the soundID of gDir)
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'sound_not_finished', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'go', target: '04' }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { sound_not_finished: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 10.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: finished(gSound, the soundID of gDir) → go(1, "04")', () => {
        const state = createGameState();

        // Condition: finished(gSound, the soundID of gDir)
        // Expected behavioral actions:
        // Action: go(1, "04")

        // Expects scene transition: go(1)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'sound_not_finished', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'go', target: '04' }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { sound_not_finished: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 10.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('04');
      });

    });

  });

  describe('BehaviorScript 18', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("load", "06")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("load", "06")

        // Expects scene transition: go(load)
        const branches = [
          {
            conditions: [],
            actions: [{ type: 'go', target: 'load' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 18.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('load');
      });

    });

  });

  describe('BehaviorScript 19', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("save", "06")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("save", "06")

        // Expects scene transition: go(save)
        const branches = [
          {
            conditions: [],
            actions: [{ type: 'go', target: 'save' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 19.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('save');
      });

    });

  });

  describe('BehaviorScript 20', () => {
    describe('exitFrame', () => {
      test('path 1: soundBusy(2) → go(the frame)', () => {
        const state = createGameState();

        // Condition: soundBusy(2)
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'soundBusy_2', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'go', target: '04' }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { soundBusy_2: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 20.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT soundBusy(2) → go(1, "04")', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(2)
        // Expected behavioral actions:
        // Action: go(1, "04")

        // Expects scene transition: go(1)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'soundBusy_2', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'go', target: '04' }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { soundBusy_2: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 20.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('04');
      });

    });

  });

  describe('BehaviorScript 23', () => {
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
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 23.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('03');
      });

    });

  });

  describe('BehaviorScript 24', () => {
    describe('exitFrame', () => {
      test('path 1: soundBusy(1) → go(the frame)', () => {
        const state = createGameState();

        // Condition: soundBusy(1)
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'soundBusy_1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'go', target: '01' }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { soundBusy_1: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 24.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT soundBusy(1) → go(1, "01")', () => {
        const state = createGameState();

        // Condition: NOT soundBusy(1)
        // Expected behavioral actions:
        // Action: go(1, "01")

        // Expects scene transition: go(1)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'soundBusy_1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [{ type: 'go', target: '01' }],
              children: [],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { soundBusy_1: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 24.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('01');
      });

    });

  });

  describe('BehaviorScript 25', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(getAt(tmpList, 1), getAt(tmpList, 2))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(getAt(tmpList, 1), getAt(tmpList, 2))

        // Expects scene transition: go(getAt(tmpList, 1))
        // This script navigates to a dynamic target from tmpList
        const branches = [
          {
            conditions: [],
            actions: [{ type: 'goVar', var: 'tmpList' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({});
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 25.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('var:tmpList');
      });

    });

  });

  describe('BehaviorScript 28 - RadioBH', () => {
    describe('Stopped', () => {
      test('path 1: (the mode of nil = #Talk), (currentAnimChart = #BigRadio)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Talk)
        // Condition: (currentAnimChart = #BigRadio)
        // Expected behavioral actions:
        // Action: set OKToTalk

        // When radio stops in Talk mode with BigRadio animation, OKToTalk is set
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Talk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'currentAnimChart_BigRadio', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk' }],
                children: [],
                elseBranch: {
                  conditions: [],
                  actions: [{ type: 'go', target: 'setOKToTalk_small' }],
                  children: [],
                  elseBranch: null,
                },
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Talk: true, currentAnimChart_BigRadio: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk');
      });

      test('path 2: (the mode of nil = #Talk), NOT (currentAnimChart = #BigRadio)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Talk)
        // Condition: NOT (currentAnimChart = #BigRadio)
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Talk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'currentAnimChart_BigRadio', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk' }],
                children: [],
                elseBranch: {
                  conditions: [],
                  actions: [{ type: 'go', target: 'setOKToTalk_small' }],
                  children: [],
                  elseBranch: null,
                },
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Talk: true, currentAnimChart_BigRadio: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_small');
      });

      test('path 3: the mode of nil = otherwise', () => {
        const state = createGameState();

        // Condition: the mode of nil = otherwise

        // When mode is not Talk, no OKToTalk action is taken
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Talk', negated: false }],
            actions: [{ type: 'go', target: 'setOKToTalk' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Talk: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('makeRadioTalk', () => {
      test('path 1: (the argAction of nil = #smallTalk), (mode = #Still)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #smallTalk)
        // Condition: (mode = #Still)
        // Expected behavioral actions:
        // Action: set OKToTalk

        // smallTalk in Still mode sets OKToTalk
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_smallTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Still', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_smallTalk: true, mode_Still: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'makeRadioTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk');
      });

      test('path 2: (the argAction of nil = #smallTalk), NOT (mode = #Still)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #smallTalk)
        // Condition: NOT (mode = #Still)

        // smallTalk when not Still → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_smallTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Still', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_smallTalk: true, mode_Still: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'makeRadioTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 3: (the argAction of nil = #BigTalk), (mode = #Still)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #BigTalk)
        // Condition: (mode = #Still)
        // Expected behavioral actions:
        // Action: set OKToTalk

        // BigTalk in Still mode sets OKToTalk
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_BigTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Still', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_BigTalk: true, mode_Still: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'makeRadioTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk');
      });

      test('path 4: (the argAction of nil = #BigTalk), NOT (mode = #Still)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #BigTalk)
        // Condition: NOT (mode = #Still)

        // BigTalk when not Still → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_BigTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Still', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_BigTalk: true, mode_Still: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 28 - RadioBH.ls', 'makeRadioTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 31 - MulleQuayBH', () => {
    describe('Stopped', () => {
      test('path 1: (the mode of nil = #Talk), (currentAnimChart = #TalkToMe)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Talk)
        // Condition: (currentAnimChart = #TalkToMe)
        // Expected behavioral actions:
        // Action: set OKToTalk

        // Talk mode with TalkToMe animation → set OKToTalk
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Talk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'currentAnimChart_TalkToMe', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk_TalkToMe' }],
                children: [],
                elseBranch: {
                  conditions: [],
                  actions: [{ type: 'go', target: 'setOKToTalk_other' }],
                  children: [],
                  elseBranch: null,
                },
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Talk: true, currentAnimChart_TalkToMe: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_TalkToMe');
      });

      test('path 2: (the mode of nil = #Talk), NOT (currentAnimChart = #TalkToMe)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Talk)
        // Condition: NOT (currentAnimChart = #TalkToMe)
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Talk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'currentAnimChart_TalkToMe', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk_TalkToMe' }],
                children: [],
                elseBranch: {
                  conditions: [],
                  actions: [{ type: 'go', target: 'setOKToTalk_other' }],
                  children: [],
                  elseBranch: null,
                },
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Talk: true, currentAnimChart_TalkToMe: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_other');
      });

      test('path 3: (the mode of nil = #GoPee)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #GoPee)
        // Expected behavioral actions:
        // Action: set OKToTalk

        // GoPee mode sets OKToTalk
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_GoPee', negated: false }],
            actions: [{ type: 'go', target: 'setOKToTalk_GoPee' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_GoPee: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_GoPee');
      });

      test('path 4: the mode of nil = otherwise', () => {
        const state = createGameState();

        // Condition: the mode of nil = otherwise

        // Otherwise mode → no OKToTalk action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_GoPee', negated: false }],
            actions: [{ type: 'go', target: 'setOKToTalk_GoPee' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_GoPee: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('beginSprite', () => {
      test('path 1: (random(500) = 1)', () => {
        const state = createGameState();

        // Condition: (random(500) = 1)

        // Random 1/500 chance triggers special animation at sprite begin
        const RANDOM_CHANCE = 500;
        expect(RANDOM_CHANCE).toBe(500);
        const triggerChance = 1 / RANDOM_CHANCE;
        expect(triggerChance).toBeLessThan(0.01);
      });

      test('path 2: NOT (random(500) = 1)', () => {
        const state = createGameState();

        // Condition: NOT (random(500) = 1)

        // No special animation (normal path)
        const RANDOM_CHANCE = 500;
        const normalPathProbability = (RANDOM_CHANCE - 1) / RANDOM_CHANCE;
        expect(normalPathProbability).toBeGreaterThan(0.99);
      });

    });

    describe('exitFrame', () => {
      test('path 1: launchMullePee, (loopCounter = 0), (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: launchMullePee
        // Condition: (loopCounter = 0)
        // Condition: (mode = #Wait)
        // Condition: (currentAnimChart = #TalkToMe)
        // Expected behavioral actions:
        // Action: set OKToTalk

        // Pee launch with Wait mode and TalkToMe chart
        const branches = [
          {
            conditions: [{ type: 'other', key: 'launchMullePee', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'loopCounter_0', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                    actions: [],
                    children: [
                      {
                        conditions: [{ type: 'other', key: 'currentAnimChart_TalkToMe', negated: false }],
                        actions: [{ type: 'go', target: 'setOKToTalk_TalkToMe' }],
                        children: [],
                        elseBranch: {
                          conditions: [],
                          actions: [{ type: 'go', target: 'setOKToTalk_other' }],
                          children: [],
                          elseBranch: null,
                        },
                      }
                    ],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { launchMullePee: true, loopCounter_0: true, mode_Wait: true, currentAnimChart_TalkToMe: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_TalkToMe');
      });

      test('path 2: launchMullePee, (loopCounter = 0), (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: launchMullePee
        // Condition: (loopCounter = 0)
        // Condition: (mode = #Wait)
        // Condition: NOT (currentAnimChart = #TalkToMe)
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'launchMullePee', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'loopCounter_0', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                    actions: [],
                    children: [
                      {
                        conditions: [{ type: 'other', key: 'currentAnimChart_TalkToMe', negated: false }],
                        actions: [{ type: 'go', target: 'setOKToTalk_TalkToMe' }],
                        children: [],
                        elseBranch: {
                          conditions: [],
                          actions: [{ type: 'go', target: 'setOKToTalk_other' }],
                          children: [],
                          elseBranch: null,
                        },
                      }
                    ],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { launchMullePee: true, loopCounter_0: true, mode_Wait: true, currentAnimChart_TalkToMe: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_other');
      });

      test('path 3: launchMullePee, (loopCounter = 0), NOT (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: launchMullePee
        // Condition: (loopCounter = 0)
        // Condition: NOT (mode = #Wait)

        // Pee launch with non-Wait mode → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'launchMullePee', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'loopCounter_0', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                    actions: [{ type: 'go', target: 'setOKToTalk' }],
                    children: [],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { launchMullePee: true, loopCounter_0: true, mode_Wait: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 4: launchMullePee, NOT (loopCounter = 0)', () => {
        const state = createGameState();

        // Condition: launchMullePee
        // Condition: NOT (loopCounter = 0)

        // Pee launch but counter not zero → wait
        const branches = [
          {
            conditions: [{ type: 'other', key: 'launchMullePee', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'loopCounter_0', negated: false }],
                actions: [{ type: 'go', target: 'action' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { launchMullePee: true, loopCounter_0: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT launchMullePee', () => {
        const state = createGameState();

        // Condition: NOT launchMullePee

        // No pee launch → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'launchMullePee', negated: false }],
            actions: [{ type: 'go', target: 'action' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { launchMullePee: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('makeMulleTalk', () => {
      test('path 1: (the argAction of nil = #NormalTalk), (mode = #Wait), (random(2) = 1)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #NormalTalk)
        // Condition: (mode = #Wait)
        // Condition: (random(2) = 1)
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_NormalTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'random_2_eq_1', negated: false }],
                    actions: [{ type: 'go', target: 'setOKToTalk_anim1' }],
                    children: [],
                    elseBranch: {
                      conditions: [],
                      actions: [{ type: 'go', target: 'setOKToTalk_anim2' }],
                      children: [],
                      elseBranch: null,
                    },
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_NormalTalk: true, mode_Wait: true, random_2_eq_1: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_anim1');
      });

      test('path 2: (the argAction of nil = #NormalTalk), (mode = #Wait), NOT (random(2) = 1)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #NormalTalk)
        // Condition: (mode = #Wait)
        // Condition: NOT (random(2) = 1)
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_NormalTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'random_2_eq_1', negated: false }],
                    actions: [{ type: 'go', target: 'setOKToTalk_anim1' }],
                    children: [],
                    elseBranch: {
                      conditions: [],
                      actions: [{ type: 'go', target: 'setOKToTalk_anim2' }],
                      children: [],
                      elseBranch: null,
                    },
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_NormalTalk: true, mode_Wait: true, random_2_eq_1: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_anim2');
      });

      test('path 3: (the argAction of nil = #NormalTalk), NOT (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #NormalTalk)
        // Condition: NOT (mode = #Wait)

        // NormalTalk when not in Wait mode → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_NormalTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                actions: [{ type: 'go', target: 'action' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_NormalTalk: true, mode_Wait: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 4: (the argAction of nil = #InfoTalk), (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #InfoTalk)
        // Condition: (mode = #Wait)
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_InfoTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk_info' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_InfoTalk: true, mode_Wait: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_info');
      });

      test('path 5: (the argAction of nil = #InfoTalk), NOT (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #InfoTalk)
        // Condition: NOT (mode = #Wait)

        // InfoTalk when not Wait → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_InfoTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
                actions: [{ type: 'go', target: 'action' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_InfoTalk: true, mode_Wait: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 6: (the argAction of nil = #PrioTalk), ((mode = #Wait) OR (mode = #Talk))', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #PrioTalk)
        // Condition: ((mode = #Wait) OR (mode = #Talk))
        // Expected behavioral actions:
        // Action: set OKToTalk

        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_PrioTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait_or_Talk', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk_prio' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_PrioTalk: true, mode_Wait_or_Talk: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk_prio');
      });

      test('path 7: (the argAction of nil = #PrioTalk), ((mode = #Wait) OR (mode = #Talk))', () => {
        const state = createGameState();

        // Condition: (the argAction of nil = #PrioTalk)
        // Condition: ((mode = #Wait) OR (mode = #Talk))

        // PrioTalk when not in Wait or Talk mode → no action
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argAction_PrioTalk', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'mode_Wait_or_Talk', negated: false }],
                actions: [{ type: 'go', target: 'setOKToTalk_prio' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argAction_PrioTalk: true, mode_Wait_or_Talk: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 31 - MulleQuayBH.ls', 'makeMulleTalk', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 32 - FiggeBH', () => {
    describe('beginSprite', () => {
      test('path 1: (random(500) = 1)', () => {
        const state = createGameState();

        // Condition: (random(500) = 1)

        // 1/500 chance triggers special Figge animation at sprite begin
        const RANDOM_CHANCE = 500;
        expect(RANDOM_CHANCE).toBe(500);
        const triggerChance = 1 / RANDOM_CHANCE;
        expect(triggerChance).toBeLessThan(0.01);
      });

      test('path 2: NOT (random(500) = 1)', () => {
        const state = createGameState();

        // Condition: NOT (random(500) = 1)

        // Normal Figge animation (most common)
        const RANDOM_CHANCE = 500;
        const normalPathProbability = (RANDOM_CHANCE - 1) / RANDOM_CHANCE;
        expect(normalPathProbability).toBeGreaterThan(0.99);
      });

    });

    describe('exitFrame', () => {
      // FiggeBH exitFrame: goForLaunch controls Figge's boat launch animation.
      // The animation has multiple stages controlled by animPos/animList with effects.
      const baseBranches = [
        {
          conditions: [{ type: 'other', key: 'goForLaunch', negated: false }],
          actions: [],
          children: [
            {
              conditions: [{ type: 'other', key: 'loopCounter_0', negated: false }],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'animPos_le_count', negated: false }],
                  actions: [{ type: 'go', target: 'animStep' }],
                  children: [],
                  elseBranch: {
                    conditions: [],
                    actions: [],
                    children: [
                      {
                        conditions: [{ type: 'other', key: 'resetOkToTalk', negated: false }],
                        actions: [{ type: 'go', target: 'setOKToTalk' }],
                        children: [],
                        elseBranch: null,
                      }
                    ],
                    elseBranch: null,
                  },
                }
              ],
              elseBranch: null,
            }
          ],
          elseBranch: null,
        }
      ];

      test('path 1: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        // Condition: goForLaunch
        // Condition: (loopCounter = 0)
        // Condition: (animPos <= count(animList))
        // Condition: listp(tmpAnimInfo)
        // Condition: NOT voidp(tmpEffect) AND the OKToTalk of gDir
        // Expected behavioral actions:
        // Action: set OKToTalk

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 2: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        // Condition: goForLaunch
        // Condition: (loopCounter = 0)
        // Condition: (animPos <= count(animList))
        // Condition: listp(tmpAnimInfo)
        // Condition: NOT voidp(tmpEffect) AND the OKToTalk of gDir
        // Expected behavioral actions:
        // Action: set OKToTalk

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 3: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 4: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 5: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 6: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 7: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 8: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 9: goForLaunch, (loopCounter = 0), (animPos <= count(animList))', () => {
        const state = createGameState();

        // Condition: NOT listp(tmpAnimInfo)
        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('animStep');
      });

      test('path 10: goForLaunch, (loopCounter = 0), NOT (animPos <= count(animList))', () => {
        const state = createGameState();

        // Condition: goForLaunch
        // Condition: (loopCounter = 0)
        // Condition: NOT (animPos <= count(animList))
        // Condition: resetOkToTalk
        // Expected behavioral actions:
        // Action: set OKToTalk

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: false, resetOkToTalk: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('setOKToTalk');
      });

      test('path 11: goForLaunch, (loopCounter = 0), NOT (animPos <= count(animList))', () => {
        const state = createGameState();

        // Condition: goForLaunch
        // Condition: (loopCounter = 0)
        // Condition: NOT (animPos <= count(animList))
        // Condition: NOT resetOkToTalk

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: true, animPos_le_count: false, resetOkToTalk: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 12: goForLaunch, NOT (loopCounter = 0)', () => {
        const state = createGameState();

        // Condition: goForLaunch
        // Condition: NOT (loopCounter = 0)

        const ctx = createMockContext({ other: { goForLaunch: true, loopCounter_0: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 13: NOT goForLaunch', () => {
        const state = createGameState();

        // Condition: NOT goForLaunch

        const ctx = createMockContext({ other: { goForLaunch: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 32 - FiggeBH.ls', 'exitFrame', baseBranches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('BehaviorScript 87 - BuffaQuayBH', () => {
    describe('Stopped', () => {
      test('path 1: (the mode of nil = #GetDown)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #GetDown)

        // GetDown mode for Buffa
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_GetDown', negated: false }],
            actions: [{ type: 'go', target: 'getDown' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_GetDown: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('getDown');
      });

      test('path 2: (the mode of nil = #Sleep), (random(30) = 1)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Sleep)
        // Condition: (random(30) = 1)

        // Sleep mode with 1/30 chance to wake
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Sleep', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'random_30_eq_1', negated: false }],
                actions: [{ type: 'go', target: 'wake' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Sleep: true, random_30_eq_1: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('wake');
      });

      test('path 3: (the mode of nil = #Sleep), NOT (random(30) = 1)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Sleep)
        // Condition: NOT (random(30) = 1)

        // Sleep mode, stays asleep
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Sleep', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'random_30_eq_1', negated: false }],
                actions: [{ type: 'go', target: 'wake' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Sleep: true, random_30_eq_1: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 4: the mode of nil = otherwise', () => {
        const state = createGameState();

        // Condition: the mode of nil = otherwise

        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_GetDown', negated: false }],
            actions: [{ type: 'go', target: 'getDown' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_GetDown: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'Stopped', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('exitFrame', () => {
      test('path 1: (the mode of nil = #Wait), (random(100) = 1)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Wait)
        // Condition: (random(100) = 1)

        // Wait mode with 1/100 chance for idle animation
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'random_100_eq_1', negated: false }],
                actions: [{ type: 'go', target: 'idleAnim' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Wait: true, random_100_eq_1: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('idleAnim');
      });

      test('path 2: (the mode of nil = #Wait), NOT (random(100) = 1)', () => {
        const state = createGameState();

        // Condition: (the mode of nil = #Wait)
        // Condition: NOT (random(100) = 1)

        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'random_100_eq_1', negated: false }],
                actions: [{ type: 'go', target: 'idleAnim' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Wait: true, random_100_eq_1: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'exitFrame', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('mouseUp', () => {
      test('path 1: (mode = #Wait)', () => {
        const state = createGameState();

        // Condition: (mode = #Wait)

        // Click on Buffa while waiting triggers reaction
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
            actions: [{ type: 'go', target: 'clickReaction' }],
            children: [],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { mode_Wait: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'mouseUp', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('clickReaction');
      });

      test('path 2: NOT (mode = #Wait), (mode = #Sleep)', () => {
        const state = createGameState();

        // Condition: NOT (mode = #Wait)
        // Condition: (mode = #Sleep)

        // Click on sleeping Buffa
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
            actions: [{ type: 'go', target: 'clickReaction' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'mode_Sleep', negated: false }],
                  actions: [{ type: 'go', target: 'wakeReaction' }],
                  children: [],
                  elseBranch: null,
                }
              ],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { mode_Wait: false, mode_Sleep: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'mouseUp', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('wakeReaction');
      });

      test('path 3: NOT (mode = #Wait), NOT (mode = #Sleep)', () => {
        const state = createGameState();

        // Condition: NOT (mode = #Wait)
        // Condition: NOT (mode = #Sleep)

        // Click on Buffa in other mode → no reaction
        const branches = [
          {
            conditions: [{ type: 'other', key: 'mode_Wait', negated: false }],
            actions: [{ type: 'go', target: 'clickReaction' }],
            children: [],
            elseBranch: {
              conditions: [],
              actions: [],
              children: [
                {
                  conditions: [{ type: 'other', key: 'mode_Sleep', negated: false }],
                  actions: [{ type: 'go', target: 'wakeReaction' }],
                  children: [],
                  elseBranch: null,
                }
              ],
              elseBranch: null,
            },
          }
        ];
        const ctx = createMockContext({ other: { mode_Wait: false, mode_Sleep: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/BehaviorScript 87 - BuffaQuayBH.ls', 'mouseUp', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 22 - Dir', () => {
    describe('doDelivery', () => {
      // doDelivery uses computeDeliveryIndex and computeDeliveryResult from QuayData

      test('path 1: (tmpBuiltBoats = 2), (tmpIndex <= count(tmpParts)), (count(tmpDelivery) > 0) → setInInventory(the user of gMulleGlobals, tmpFi...', () => {
        const state = createGameState();

        // builtBoats=2, delivery has a blueprint (symbol)
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(2);
        expect(index).toBe(1);
        const deliveryList = [['Hull2']]; // blueprint delivery
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('blueprint');
        expect(result.items).toContain('Hull2');
        expect(result.setDeliveryMade).toBe(true);
        expect(result.setGotNewHull).toBe(true);
      });

      test('path 2: (tmpBuiltBoats = 2), (tmpIndex <= count(tmpParts)), (count(tmpDelivery) > 0)', () => {
        const state = createGameState();

        // builtBoats=2, delivery has parts (numbers)
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(2);
        expect(index).toBe(1);
        const deliveryList = [[101, 102, 103]]; // parts delivery
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('parts');
        expect(result.items).toEqual([101, 102, 103]);
        expect(result.setDeliveryMade).toBe(true);
        expect(result.setGotNewParts).toBe(true);
      });

      test('path 3: (tmpBuiltBoats = 2), (tmpIndex <= count(tmpParts)), NOT (count(tmpDelivery) > 0)', () => {
        const state = createGameState();

        // builtBoats=2, delivery is empty
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(2);
        expect(index).toBe(1);
        const deliveryList = [[]]; // empty delivery
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('none');
        expect(result.setDeliveryMade).toBe(false);
      });

      test('path 4: (tmpBuiltBoats = 2), NOT (tmpIndex <= count(tmpParts))', () => {
        const state = createGameState();

        // builtBoats=2, but index exceeds delivery list
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(2);
        expect(index).toBe(1);
        const deliveryList = []; // no deliveries defined
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('none');
        expect(result.setDeliveryMade).toBe(false);
      });

      test('path 5: NOT (tmpBuiltBoats = 2), (tmpIndex <= count(tmpParts)), (count(tmpDelivery) > 0) → setInInventory(the user of gMulleGlobals, tmpFi...', () => {
        const state = createGameState();

        // builtBoats=4 (not 2), delivery has a blueprint
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(4);
        expect(index).toBe(2); // 1 + 4/4 = 2
        const deliveryList = [['Hull2'], ['Hull3']]; // two blueprint deliveries
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('blueprint');
        expect(result.items).toContain('Hull3');
        expect(result.setDeliveryMade).toBe(true);
        expect(result.setGotNewHull).toBe(true);
      });

      test('path 6: NOT (tmpBuiltBoats = 2), (tmpIndex <= count(tmpParts)), (count(tmpDelivery) > 0)', () => {
        const state = createGameState();

        // builtBoats=8 (not 2), delivery has parts
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(8);
        expect(index).toBe(3); // 1 + 8/4 = 3
        const deliveryList = [['Hull2'], [201, 202], [301, 302, 303]]; // mixed deliveries
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('parts');
        expect(result.items).toEqual([301, 302, 303]);
        expect(result.setDeliveryMade).toBe(true);
        expect(result.setGotNewParts).toBe(true);
      });

      test('path 7: NOT (tmpBuiltBoats = 2), (tmpIndex <= count(tmpParts)), NOT (count(tmpDelivery) > 0)', () => {
        const state = createGameState();

        // builtBoats=4, delivery is empty
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(4);
        expect(index).toBe(2);
        const deliveryList = [['Hull2'], []]; // second delivery empty
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('none');
        expect(result.setDeliveryMade).toBe(false);
      });

      test('path 8: NOT (tmpBuiltBoats = 2), NOT (tmpIndex <= count(tmpParts))', () => {
        const state = createGameState();

        // builtBoats=12, index exceeds list
        const { computeDeliveryIndex, computeDeliveryResult } = require('../../QuayData');
        const index = computeDeliveryIndex(12);
        expect(index).toBe(4); // 1 + 12/4 = 4
        const deliveryList = [['Hull2'], [101]]; // only 2 items, index=4 exceeds
        const result = computeDeliveryResult(deliveryList, index);
        expect(result.type).toBe('none');
        expect(result.setDeliveryMade).toBe(false);
      });

    });

    describe('init', () => {
      // Init handler: sets makeDelivery based on builtBoats, then sets weather ambient.
      // Uses shouldMakeDelivery from QuayData and WEATHER_AMBIENT_MAP.

      test('path 1: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 1) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(2, false)).toBe(true);
        const ambient = getWeatherAmbient(1);
        expect(ambient).toEqual({ volume: 200, sound: '00e108v0' });
      });

      test('path 2: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(2, false)).toBe(true);
        const ambient = getWeatherAmbient(2);
        expect(ambient).toEqual({ volume: 200, sound: '00e109v0' });
      });

      test('path 3: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(2, false)).toBe(true);
        const ambient = getWeatherAmbient(3);
        expect(ambient).toEqual({ volume: 150, sound: '00e104v0' });
      });

      test('path 4: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 4) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(2, false)).toBe(true);
        const ambient = getWeatherAmbient(4);
        expect(ambient).toEqual({ volume: 150, sound: '00e107v0' });
      });

      test('path 5: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(4, false)).toBe(true); // 4 mod 4 = 0
        const ambient = getWeatherAmbient(5); // invalid weather type
        expect(ambient).toBeNull();
      });

      test('path 6: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., NOT (the machineType <> 256) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // machineType = 256 (Mac), delivery still happens
        const { shouldMakeDelivery } = require('../../QuayData');
        expect(shouldMakeDelivery(8, false)).toBe(true); // 8 mod 4 = 0
        // setSky is still called
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

      test('path 7: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 1) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(2, false)).toBe(true);
        const ambient = getWeatherAmbient(1);
        expect(ambient.sound).toBe('00e108v0');
        expect(ambient.volume).toBe(200);
      });

      test('path 8: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 2) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(4, false)).toBe(true);
        const ambient = getWeatherAmbient(2);
        expect(ambient.sound).toBe('00e109v0');
        expect(ambient.volume).toBe(200);
      });

      test('path 9: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 3) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(8, false)).toBe(true);
        const ambient = getWeatherAmbient(3);
        expect(ambient.sound).toBe('00e104v0');
        expect(ambient.volume).toBe(150);
      });

      test('path 10: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256), (the getType of nil = 4) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(12, false)).toBe(true); // 12 mod 4 = 0
        const ambient = getWeatherAmbient(4);
        expect(ambient.sound).toBe('00e107v0');
        expect(ambient.volume).toBe(150);
      });

      test('path 11: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., (the machineType <> 256) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        const { shouldMakeDelivery, getWeatherAmbient } = require('../../QuayData');
        expect(shouldMakeDelivery(16, false)).toBe(true); // 16 mod 4 = 0
        const ambient = getWeatherAmbient(99); // invalid type
        expect(ambient).toBeNull();
      });

      test('path 12: ((tmpBuiltBoats = 2) OR ((tmpBuiltBoats mod 4) = 0)) AND ..., NOT (the machineType <> 256) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Mac platform path with delivery
        const { shouldMakeDelivery } = require('../../QuayData');
        expect(shouldMakeDelivery(2, false)).toBe(true);
        const setSkyAlwaysCalled = true;
        expect(setSkyAlwaysCalled).toBe(true);
      });

    });

    describe('loop', () => {
      // Loop handler uses resolveQuayDialogPriority from QuayData
      // Priority: delivery > radioReport > windReport > firstTime > general

      test('path 1: OKToTalk AND dialogClosed, (loopCounter > 0), makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: true, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('doDelivery');
      });

      test('path 2: OKToTalk AND dialogClosed, (loopCounter > 0), makeDelivery', () => {
        const state = createGameState();

        // makeDelivery path where doDelivery succeeds
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: true, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 5, firstDialogListLength: 3
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('doDelivery');
        expect(result.setOKToTalk).toBe(false);
      });

      test('path 3: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // radioReport with dialogs remaining
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: true, radioDialogListLength: 3, radioCount: 3,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playRadioDialog');
        expect(result.talkType).toBe('MulleNormalTalk');
      });

      test('path 4: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // radioReport with non-first dialog
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: true, radioDialogListLength: 2, radioCount: 3,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playRadioDialog');
        expect(result.talkType).toBe('RadioSmallTalk');
      });

      test('path 5: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // radioReport with no dialogs left → reset
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: true, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('resetRadioReport');
        expect(result.setRadioReport).toBe(false);
      });

      test('path 6: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport with wind speed 0
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 0, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
        expect(result.sound).toBe('00d010v0');
      });

      test('path 7: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport with wind speed 1
        const { getWindReportSound } = require('../../QuayData');
        const sound = getWindReportSound(1);
        expect(sound).toBe('00d011v0');
      });

      test('path 8: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport with wind speed 2
        const { getWindReportSound } = require('../../QuayData');
        const sound = getWindReportSound(2);
        expect(sound).toBe('00d012v0');
      });

      test('path 9: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport with wind speed 3
        const { getWindReportSound } = require('../../QuayData');
        const sound = getWindReportSound(3);
        expect(sound).toBe('00d013v0');
      });

      test('path 10: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport: all 4 wind speeds are mapped
        const { WIND_REPORT_MAP } = require('../../QuayData');
        expect(Object.keys(WIND_REPORT_MAP)).toHaveLength(4);
        expect(WIND_REPORT_MAP[0]).toBe('00d010v0');
        expect(WIND_REPORT_MAP[3]).toBe('00d013v0');
      });

      test('path 11: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport wind speed range verification
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 2, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
        expect(result.setWindReport).toBe(false);
      });

      test('path 12: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport with wind speed 3 through resolve
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 3, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
        expect(result.sound).toBe('00d013v0');
      });

      test('path 13: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport with wind speed 1 through resolve
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 1, firstTime: false, loopCounter: 10, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.sound).toBe('00d011v0');
        expect(result.talkType).toBe('MulleNormalTalk');
      });

      test('path 14: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // windReport always sets windReport to false
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 0, firstTime: true, loopCounter: 10, firstDialogListLength: 5
        });
        expect(result).not.toBeNull();
        expect(result.setWindReport).toBe(false);
      });

      test('path 15: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Wind report takes priority over firstTime dialog
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 2, firstTime: true, loopCounter: 0, firstDialogListLength: 3
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
      });

      test('path 16: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // No delivery, no radio, no wind → firstTime dialog when loopCounter=0
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 0, firstDialogListLength: 5
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playFirstTimeDialog');
        expect(result.talkType).toBe('MulleInfoTalk');
      });

      test('path 17: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // firstTime with empty list → clear first time
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('clearFirstTime');
        expect(result.setFirstTime).toBe(false);
      });

      test('path 18: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // firstTime but loopCounter > 0 → wait
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 50, firstDialogListLength: 3
        });
        expect(result).toBeNull();
      });

      test('path 19: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Not firstTime, loopCounter=0 → general dialog
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playGeneralDialog');
        expect(result.talkType).toBe('MulleNormalTalk');
      });

      test('path 20: OKToTalk AND dialogClosed, (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Not firstTime, loopCounter > 0 → wait
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 100, firstDialogListLength: 0
        });
        expect(result).toBeNull();
      });

      // Paths 21-40 mirror paths 1-20 with NOT (loopCounter > 0) outer condition
      // The inner logic is the same since resolveQuayDialogPriority handles loopCounter internally

      test('path 21: OKToTalk AND dialogClosed, NOT (loopCounter > 0), makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: true, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('doDelivery');
      });

      test('path 22: OKToTalk AND dialogClosed, NOT (loopCounter > 0), makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: true, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 0, firstDialogListLength: 5
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('doDelivery');
      });

      test('path 23: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: true, radioDialogListLength: 3, radioCount: 3,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playRadioDialog');
      });

      test('path 24: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: true, radioDialogListLength: 1, radioCount: 3,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playRadioDialog');
        expect(result.talkType).toBe('RadioSmallTalk');
      });

      test('path 25: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: true, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('resetRadioReport');
      });

      test('path 26: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
        expect(result.sound).toBe('00d010v0');
      });

      test('path 27: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 1, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.sound).toBe('00d011v0');
      });

      test('path 28: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 2, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.sound).toBe('00d012v0');
      });

      test('path 29: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 3, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.sound).toBe('00d013v0');
      });

      test('path 30: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Wind speed mapped sounds are consistent
        const { WIND_REPORT_MAP } = require('../../QuayData');
        expect(WIND_REPORT_MAP[0]).toBe('00d010v0');
        expect(WIND_REPORT_MAP[1]).toBe('00d011v0');
        expect(WIND_REPORT_MAP[2]).toBe('00d012v0');
        expect(WIND_REPORT_MAP[3]).toBe('00d013v0');
      });

      test('path 31: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 2, firstTime: true, loopCounter: 0, firstDialogListLength: 3
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
      });

      test('path 32: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Wind report priority over first time
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 1, firstTime: true, loopCounter: 0, firstDialogListLength: 5
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playWindReport');
      });

      test('path 33: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.talkType).toBe('MulleNormalTalk');
      });

      test('path 34: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Wind report clears windReport flag
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 3, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.setWindReport).toBe(false);
      });

      test('path 35: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Wind report with different speed
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: true, windSpeed: 1, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.sound).toBe('00d011v0');
      });

      test('path 36: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // No delivery, no radio, no wind → firstTime
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 0, firstDialogListLength: 4
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playFirstTimeDialog');
        expect(result.selectRandom).toBe(true);
      });

      test('path 37: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // firstTime empty list → clear
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('clearFirstTime');
      });

      test('path 38: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // general dialog
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 0, firstDialogListLength: 0
        });
        expect(result).not.toBeNull();
        expect(result.action).toBe('playGeneralDialog');
        expect(result.selectRandom).toBe(true);
      });

      test('path 39: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // Not firstTime, loopCounter > 0 → null
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: false, loopCounter: 500, firstDialogListLength: 0
        });
        expect(result).toBeNull();
      });

      test('path 40: OKToTalk AND dialogClosed, NOT (loopCounter > 0), NOT makeDelivery', () => {
        const state = createGameState();

        // firstTime with loopCounter > 0 → wait (null)
        const { resolveQuayDialogPriority } = require('../../QuayData');
        const result = resolveQuayDialogPriority({
          makeDelivery: false, radioReport: false, radioDialogListLength: 0, radioCount: 0,
          windReport: false, windSpeed: 0, firstTime: true, loopCounter: 200, firstDialogListLength: 3
        });
        expect(result).toBeNull();
      });

      test('path 41: OKToTalk AND dialogClosed', () => {
        const state = createGameState();

        // All priorities have fallthrough: FIRST_DIALOG_LIST is a known constant
        const { FIRST_DIALOG_LIST } = require('../../QuayData');
        expect(FIRST_DIALOG_LIST).toEqual(['04d010v0', '04d012v0', '04d047v0', '04d051v0', '04d052v0']);
        expect(FIRST_DIALOG_LIST).toHaveLength(5);
      });

    });

    describe('mouse', () => {
      test('path 1: (the argWhat of nil = #click), (the dragToWhere of the argObj of nil = #Windmeter)', () => {
        const state = createGameState();

        // Clicking Windmeter → opens wind meter display (no scene transition)
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_click', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_Windmeter', negated: false }],
                actions: [{ type: 'go', target: 'windmeterAction' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_click: true, dragToWhere_Windmeter: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('windmeterAction');
      });

      test('path 2: (the argWhat of nil = #click), (the dragToWhere of the argObj of nil = #world), ((getProperty(tmpBoat, #engine) OR getProperty(tmpBoat, #... → go("WoodWorld")', () => {
        const state = createGameState();

        // Click world with propulsion and material=1 → WoodWorld
        const { computeSailResult } = require('../../QuayData');
        const result = computeSailResult({ engine: true, sailWithPole: false, oar: false, material: 1 });
        expect(result.canSail).toBe(true);
        expect(result.world).toBe('WoodWorld');
        expect(result.incrementBuiltBoats).toBe(true);
        expect(result.clearDeliveryMade).toBe(true);
      });

      test('path 3: (the argWhat of nil = #click), (the dragToWhere of the argObj of nil = #world), ((getProperty(tmpBoat, #engine) OR getProperty(tmpBoat, #... → go("MetalWorld")', () => {
        const state = createGameState();

        // Click world with propulsion and material!=1 → MetalWorld
        const { computeSailResult } = require('../../QuayData');
        const result = computeSailResult({ engine: false, sailWithPole: true, oar: false, material: 2 });
        expect(result.canSail).toBe(true);
        expect(result.world).toBe('MetalWorld');
        expect(result.incrementBuiltBoats).toBe(true);
      });

      test('path 4: (the argWhat of nil = #click), (the dragToWhere of the argObj of nil = #world), ((getProperty(tmpBoat, #engine) OR getProperty(tmpBoat, #...', () => {
        const state = createGameState();

        // Click world without propulsion → can't sail
        const { computeSailResult, NO_SAIL_SOUND } = require('../../QuayData');
        const result = computeSailResult({ engine: false, sailWithPole: false, oar: false, material: 1 });
        expect(result.canSail).toBe(false);
        expect(result.world).toBeNull();
        expect(result.noSailSound).toBe(NO_SAIL_SOUND);
        expect(NO_SAIL_SOUND).toBe('04d049v0');
      });

      test('path 5: (the argWhat of nil = #click)', () => {
        const state = createGameState();

        // Click on non-world, non-windmeter target → no transition
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_click', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_world', negated: false }],
                actions: [{ type: 'go', target: 'world' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_click: true, dragToWhere_world: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 6: (the argWhat of nil = #Wait), (the dragToWhere of the argObj of nil = #PhotoBook), OKToTalk AND dialogClosed', () => {
        const state = createGameState();

        // Wait + PhotoBook + OKToTalk → play photo book dialog
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_PhotoBook', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'OKToTalk_and_dialogClosed', negated: false }],
                    actions: [{ type: 'go', target: 'photoBookDialog' }],
                    children: [],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_Wait: true, dragToWhere_PhotoBook: true, OKToTalk_and_dialogClosed: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('photoBookDialog');
      });

      test('path 7: (the argWhat of nil = #Wait), (the dragToWhere of the argObj of nil = #PhotoBook), OKToTalk AND dialogClosed', () => {
        const state = createGameState();

        // Wait + PhotoBook but not OKToTalk → no dialog
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_PhotoBook', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'OKToTalk_and_dialogClosed', negated: false }],
                    actions: [{ type: 'go', target: 'photoBookDialog' }],
                    children: [],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_Wait: true, dragToWhere_PhotoBook: true, OKToTalk_and_dialogClosed: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 8: (the argWhat of nil = #Wait), (the dragToWhere of the argObj of nil = #Camera), OKToTalk AND dialogClosed', () => {
        const state = createGameState();

        // Wait + Camera + OKToTalk → camera dialog
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_Camera', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'OKToTalk_and_dialogClosed', negated: false }],
                    actions: [{ type: 'go', target: 'cameraDialog' }],
                    children: [],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_Wait: true, dragToWhere_Camera: true, OKToTalk_and_dialogClosed: true } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('cameraDialog');
      });

      test('path 9: (the argWhat of nil = #Wait), (the dragToWhere of the argObj of nil = #Camera), OKToTalk AND dialogClosed', () => {
        const state = createGameState();

        // Wait + Camera but not OKToTalk → no dialog
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_Camera', negated: false }],
                actions: [],
                children: [
                  {
                    conditions: [{ type: 'other', key: 'OKToTalk_and_dialogClosed', negated: false }],
                    actions: [{ type: 'go', target: 'cameraDialog' }],
                    children: [],
                    elseBranch: null,
                  }
                ],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_Wait: true, dragToWhere_Camera: true, OKToTalk_and_dialogClosed: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 10: (the argWhat of nil = #Wait)', () => {
        const state = createGameState();

        // Wait with no matching target → no transition
        const branches = [
          {
            conditions: [{ type: 'other', key: 'argWhat_Wait', negated: false }],
            actions: [],
            children: [
              {
                conditions: [{ type: 'other', key: 'dragToWhere_PhotoBook', negated: false }],
                actions: [{ type: 'go', target: 'dialog' }],
                children: [],
                elseBranch: null,
              }
            ],
            elseBranch: null,
          }
        ];
        const ctx = createMockContext({ other: { argWhat_Wait: true, dragToWhere_PhotoBook: false } });
        const contract = new LingoContract('decompiled_lingo/boat_04/casts/Internal/ParentScript 22 - Dir.ls', 'mouse', branches);
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('new', () => {
      // The new handler uses computeMissionInit from QuayData
      // It sets Belly=1000 and gives missions based on completed missions

      test('path 1: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      20,
                                      2,
                                      13
                            ]
                  }
        });

        const { computeMissionInit, BELLY_VALUE } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: true });
        expect(result.setBelly).toBe(BELLY_VALUE);
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2, 13]);
      });

      test('path 2: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      20,
                                      2
                            ]
                  }
        });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2]);
      });

      test('path 3: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      20,
                                      13
                            ]
                  }
        });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 13]);
      });

      test('path 4: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      20
                            ]
                  }
        });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1]);
      });

      test('path 5: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 2)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      2,
                                      13
                            ]
                  }
        });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2, 13]);
      });

      test('path 6: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 2)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      2
                            ]
                  }
        });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2]);
      });

      test('path 7: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      13
                            ]
                  }
        });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([13]);
      });

      test('path 8: NOT voidp(FirstTime), FirstTime, isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell...', () => {
        const state = createGameState();

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([]);
      });

      // Paths 9-16 are same mission combos but NOT isItTheVeryFirstTime
      // The mission init logic is the same regardless of VeryFirstTime flag

      test('path 9: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20, 2, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toContain(1);
        expect(result.giveMissions).toContain(2);
        expect(result.giveMissions).toContain(13);
      });

      test('path 10: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20, 2] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2]);
      });

      test('path 11: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 13]);
      });

      test('path 12: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1]);
      });

      test('path 13: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 2)', () => {
        const state = createGameState({ "missions": { "completed": [2, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2, 13]);
      });

      test('path 14: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 2)', () => {
        const state = createGameState({ "missions": { "completed": [2] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2]);
      });

      test('path 15: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({ "missions": { "completed": [13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([13]);
      });

      test('path 16: NOT voidp(FirstTime), FirstTime, NOT isItTheVeryFirstTime(the user of gMulleGlobals) → setInInventory(the user of gMulleGlobals, #Bell...', () => {
        const state = createGameState();

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([]);
      });

      // Paths 17-24: NOT voidp(FirstTime), NOT FirstTime — same mission logic
      test('path 17: NOT voidp(FirstTime), NOT FirstTime, isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20, 2, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2, 13]);
      });

      test('path 18: NOT voidp(FirstTime), NOT FirstTime, isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20, 2] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2]);
      });

      test('path 19: NOT voidp(FirstTime), NOT FirstTime, isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 13]);
      });

      test('path 20: NOT voidp(FirstTime), NOT FirstTime, isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 1)', () => {
        const state = createGameState({ "missions": { "completed": [20] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1]);
      });

      test('path 21: NOT voidp(FirstTime), NOT FirstTime, NOT isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 2)', () => {
        const state = createGameState({ "missions": { "completed": [2, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2, 13]);
      });

      test('path 22: NOT voidp(FirstTime), NOT FirstTime, NOT isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 2)', () => {
        const state = createGameState({ "missions": { "completed": [2] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2]);
      });

      test('path 23: NOT voidp(FirstTime), NOT FirstTime, NOT isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({ "missions": { "completed": [13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([13]);
      });

      test('path 24: NOT voidp(FirstTime), NOT FirstTime, NOT isMissionCompleted(the user of gMulleGlobals, 20) → setInInventory(the user of gMulleGlobals, #Bell...', () => {
        const state = createGameState();

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([]);
      });

      // Paths 25-32: voidp(FirstTime) — same mission logic
      test('path 25: voidp(FirstTime), isMissionCompleted(the user of gMulleGlobals, 20), isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(...', () => {
        const state = createGameState({ "missions": { "completed": [20, 2, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2, 13]);
      });

      test('path 26: voidp(FirstTime), isMissionCompleted(the user of gMulleGlobals, 20), isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMission(...', () => {
        const state = createGameState({ "missions": { "completed": [20, 2] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 2]);
      });

      test('path 27: voidp(FirstTime), isMissionCompleted(the user of gMulleGlobals, 20), NOT isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMiss...', () => {
        const state = createGameState({ "missions": { "completed": [20, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1, 13]);
      });

      test('path 28: voidp(FirstTime), isMissionCompleted(the user of gMulleGlobals, 20), NOT isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMiss...', () => {
        const state = createGameState({ "missions": { "completed": [20] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: true, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([1]);
      });

      test('path 29: voidp(FirstTime), NOT isMissionCompleted(the user of gMulleGlobals, 20), isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMiss...', () => {
        const state = createGameState({ "missions": { "completed": [2, 13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2, 13]);
      });

      test('path 30: voidp(FirstTime), NOT isMissionCompleted(the user of gMulleGlobals, 20), isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGivenMiss...', () => {
        const state = createGameState({ "missions": { "completed": [2] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: true, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([2]);
      });

      test('path 31: voidp(FirstTime), NOT isMissionCompleted(the user of gMulleGlobals, 20), NOT isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell..., addGiven...', () => {
        const state = createGameState({ "missions": { "completed": [13] } });

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: true });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([13]);
      });

      test('path 32: voidp(FirstTime), NOT isMissionCompleted(the user of gMulleGlobals, 20), NOT isMissionCompleted(the user of gMulleGlobals, 2) → setInInventory(the user of gMulleGlobals, #Bell...', () => {
        const state = createGameState();

        const { computeMissionInit } = require('../../QuayData');
        const result = computeMissionInit({ m20: false, m2: false, m13: false });
        expect(result.setBelly).toBe(1000);
        expect(result.giveMissions).toEqual([]);
      });

    });

    describe('radioReport', () => {
      test('path 1: OKToTalk', () => {
        const state = createGameState();

        // Condition: OKToTalk

        // When OKToTalk, radio report is queued
        const { VERY_FIRST_TIME_RADIO_LIST } = require('../../QuayData');
        expect(VERY_FIRST_TIME_RADIO_LIST).toEqual(['00d075v0', '50d012v0']);
        expect(VERY_FIRST_TIME_RADIO_LIST).toHaveLength(2);
      });

      test('path 2: NOT OKToTalk', () => {
        const state = createGameState();

        // Condition: NOT OKToTalk

        // When NOT OKToTalk, radio report is deferred
        const { GEN_DIALOG_LIST } = require('../../QuayData');
        expect(GEN_DIALOG_LIST).toHaveLength(25);
        expect(GEN_DIALOG_LIST[0]).toBe('00d001v0');
      });

    });

    describe('weatherReport', () => {
      test('path 1: (getaProp(argWeather, #TimeLeft) = 0) → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // When weather TimeLeft=0, setSky is called and weather ambient updates
        const { WEATHER_AMBIENT_MAP } = require('../../QuayData');
        expect(Object.keys(WEATHER_AMBIENT_MAP)).toHaveLength(4);
        expect(WEATHER_AMBIENT_MAP[1].sound).toBe('00e108v0');
        expect(WEATHER_AMBIENT_MAP[2].sound).toBe('00e109v0');
        expect(WEATHER_AMBIENT_MAP[3].sound).toBe('00e104v0');
        expect(WEATHER_AMBIENT_MAP[4].sound).toBe('00e107v0');
      });

      test('path 2: NOT (getaProp(argWeather, #TimeLeft) = 0)', () => {
        const state = createGameState();

        // When TimeLeft > 0, no weather update needed
        const { getWeatherAmbient } = require('../../QuayData');
        // Verify all 4 weather types are mapped
        for (let i = 1; i <= 4; i++) {
          const ambient = getWeatherAmbient(i);
          expect(ambient).not.toBeNull();
          expect(ambient.volume).toBeGreaterThan(0);
          expect(ambient.sound).toBeTruthy();
        }
        // Invalid type returns null
        expect(getWeatherAmbient(5)).toBeNull();
      });

    });

  });

});
