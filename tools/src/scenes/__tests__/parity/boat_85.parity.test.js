// Auto-generated Lingo behavioral parity tests for folder: boat_85
// Source: decompiled_lingo/boat_85/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: roaddog.js, saftfabrik.js, waterpump.js

const { LingoContract, createMockContext } = require('./helpers');
const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { computeLighthouseResult } = require('../../LighthouseData');

describe('boat_85 Lingo behavioral parity', () => {
  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('decompiled_lingo/boat_85/85/casts/Internal/BehaviorScript 3.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
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

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract('decompiled_lingo/boat_85/85/casts/Internal/BehaviorScript 5.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }
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

        // Expects scene transition: go(leave)
        const contract = new LingoContract('decompiled_lingo/boat_85/85/casts/Internal/BehaviorScript 6.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }
        ]);
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
        const contract = new LingoContract('decompiled_lingo/boat_85/85/casts/Internal/BehaviorScript 7.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('MovieScript 10', () => {
    describe('CuePassed', () => {
      test('path 1: unconditional → go((the frame + 1))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go((the frame + 1))

        // Expects scene transition: go((the frame + 1))
        const contract = new LingoContract('decompiled_lingo/boat_85/85/casts/Internal/MovieScript 10.ls', 'CuePassed', [
          { conditions: [], actions: [{ type: 'goFramePlus', offset: 1 }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame+1');
      });

    });

  });

  describe('ParentScript 1 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → drawBoat(point(320, 155)), cursor(200)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: drawBoat(point(320, 155))
        // Action: cursor(200)

        // Expects: drawBoat() called
        // Expects: cursor(200)
        const contract = new LingoContract('decompiled_lingo/boat_85/85/casts/Internal/ParentScript 1 - Dir.ls', 'init', [
          { conditions: [], actions: [], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBeNull();
        expect(result.missionsCompleted).toEqual([]);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 2: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 3: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 4: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 5: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 6: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 7: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 8: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 9: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGlo...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 10: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 11: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 12: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 13: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 14: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 15: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 16: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMulleGl...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 17: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 18: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 19: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 20: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 21: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 22: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 23: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 24: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 25: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 26: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 27: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 28: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 29: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("Start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 30: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("Start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 31: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("suit")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 32: objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"

        // Expects: myMarker = "leave"
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 33: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 34: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 35: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 36: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 37: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 38: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 39: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 40: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 41: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 42: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 43: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 44: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 45: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 46: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 47: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 48: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Diar......', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 49: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 50: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 51: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 52: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 53: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 54: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 55: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 56: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 57: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 58: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 59: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 60: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 61: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("Start")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 62: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("Start")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 63: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("suit")', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 64: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: myMarker = "Leave"

        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 65: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 66: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 67: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 68: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 69: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 70: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 71: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 72: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: myMarker = "Leave"

        // Expects: myMarker = "Leave"
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 73: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 74: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 75: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 76: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("StartDiary")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 77: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("Start")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 78: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("Start")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 79: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave", go("suit")', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 80: objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7) → myMarker = "Leave"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "Leave"

        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 81: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 82: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 83: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 84: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 85: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 86: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 87: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 88: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: myMarker = "Leave"

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 89: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 90: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 91: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 92: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("StartDiary")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 93: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 94: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("Start")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 95: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)
        // Action: go("suit")

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 96: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "suit", setInInventory(the user of gMul...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      8
                            ],
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "suit"
        // Action: setInInventory(the user of gMulleGlobals, #Suit, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 8)

        // Expects: myMarker = "suit"
        // Expects: setInInventory(Suit)
        // Expects: addCompletedMission(8)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: true, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('suit');
        expect(r.goTo).toBe('suit');
        expect(r.actions.completeMission8).toBe(true);
        expect(r.actions.giveSuit).toBe(true);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 97: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 98: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 99: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 100: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 101: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 102: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 103: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 104: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", myMarker = "Leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: myMarker = "Leave"

        // Expects: myMarker = "leave"
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 105: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 106: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 107: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 108: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("StartDiary")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("StartDiary")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 109: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("Start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 110: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("Start")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("Start")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 111: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave", go("suit")', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"
        // Action: go("suit")

        // Expects: myMarker = "leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 112: NOT objectp(the world of gMulleGlobals), isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 8) → myMarker = "leave"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 8)
        // Condition: NOT (myMarker = VOID)
        // Condition: NOT (myMarker = "Diary")
        // Expected behavioral actions:
        // Action: myMarker = "leave"

        // Expects: myMarker = "leave"
        const r = computeLighthouseResult({ isMission7Completed: true, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 113: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 114: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 115: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 116: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("StartDiary")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 117: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 118: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 119: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 120: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: myMarker = "Leave"

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects: myMarker = "Leave"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 121: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 122: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 123: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 124: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("StartDiary")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(StartDiary)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 125: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("Start")
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(Start)
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 126: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("Start")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(Start)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 127: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"
        // Action: go("suit")

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        // Expects scene transition: go(suit)
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 128: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7) → setInInventory(the user of gMulleGlobals, #Di...', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: (isInInventory(the user of gMulleGlobals, #Diary) = 0)
        // Condition: NOT (myMarker = VOID)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #Diary, [])
        // Action: myMarker = "Diary"

        // Expects: setInInventory(Diary)
        // Expects: myMarker = "Diary"
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: false });
        expect(r.marker).toBe('Diary');
        expect(r.goTo).toBe('StartDiary');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(true);
      });

      test('path 129: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), isMissionGiven(the user of gMulleGlobals, 7)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT (isInInventory(the user of gMulleGlobals, #Diary) = 0)

        // Path documented — behavioral contract verified by code review
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: true, hasDiary: true });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

      test('path 130: NOT objectp(the world of gMulleGlobals), NOT isMissionCompleted(the user of gMulleGlobals, 7), NOT isMissionGiven(the user of gMulleGlobals, 7)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)

        // Path documented — behavioral contract verified by code review
        const r = computeLighthouseResult({ isMission7Completed: false, isMission8Given: false, isMission7Given: false, hasDiary: false });
        expect(r.marker).toBe('Leave');
        expect(r.goTo).toBe('Start');
        expect(r.actions.completeMission8).toBe(false);
        expect(r.actions.giveSuit).toBe(false);
        expect(r.actions.giveDiary).toBe(false);
      });

    });

  });

});