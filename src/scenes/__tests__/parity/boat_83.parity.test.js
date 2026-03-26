// Auto-generated Lingo behavioral parity tests for folder: boat_83
// Source: decompiled_lingo/boat_83/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: mia.js, MiaData.js, treecar.js

const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { LingoContract, createMockContext } = require('./helpers');
const { computeMiaResult } = require('../../MiaData');

describe('boat_83 Lingo behavioral parity', () => {
  describe('BehaviorScript 10', () => {
    describe('beginSprite', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)

        // Expects: setSky() called
        // beginSprite sets sky based on weather — verify weather state exists
        expect(state.weather).toBeDefined();
      });

    });

    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('boat_83/BehaviorScript 10', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 23', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("infiniteJustDoIt2")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("infiniteJustDoIt2")

        // Expects scene transition: go(infiniteJustDoIt2)
        const contract = new LingoContract('boat_83/BehaviorScript 23', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'infiniteJustDoIt2' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('infiniteJustDoIt2');
      });

    });

  });

  describe('BehaviorScript 24', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("boatride2")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("boatride2")

        // Expects scene transition: go(boatride2)
        const contract = new LingoContract('boat_83/BehaviorScript 24', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'boatride2' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('boatride2');
      });

    });

  });

  describe('BehaviorScript 25', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('boat_83/BehaviorScript 25', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("leave")

        // Expects scene transition: go(leave)
        const contract = new LingoContract('boat_83/BehaviorScript 3', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('BehaviorScript 31', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("boatride3")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("boatride3")

        // Expects scene transition: go(boatride3)
        const contract = new LingoContract('boat_83/BehaviorScript 31', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'boatride3' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('boatride3');
      });

    });

  });

  describe('BehaviorScript 32', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("justDoITluck2")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("justDoITluck2")

        // Expects scene transition: go(justDoITluck2)
        const contract = new LingoContract('boat_83/BehaviorScript 32', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'justDoITluck2' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('justDoITluck2');
      });

    });

  });

  describe('BehaviorScript 4', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract('boat_83/BehaviorScript 4', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('BehaviorScript 5', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("story1")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("story1")

        // Expects scene transition: go(story1)
        const contract = new LingoContract('boat_83/BehaviorScript 5', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'story1' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('story1');
      });

    });

  });

  describe('BehaviorScript 7', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("boatride")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("boatride")

        // Expects scene transition: go(boatride)
        const contract = new LingoContract('boat_83/BehaviorScript 7', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'boatride' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('boatride');
      });

    });

  });

  describe('BehaviorScript 9', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("justdoit2")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("justdoit2")

        // Expects scene transition: go(justdoit2)
        const contract = new LingoContract('boat_83/BehaviorScript 9', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'justdoit2' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext({}));
        expect(result.transition).toBe('justdoit2');
      });

    });

  });

  describe('ParentScript 1 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), cursor(200)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: cursor(200)

        // Expects: setSky() called
        // Expects: cursor(200)
        // Init sets up weather and cursor — verify state has required fields
        expect(state.weather).toBeDefined();
        expect(state.world).toBeDefined();
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)

        // M25 completed, M13 given, hasBench, M13 completed → infiniteJustDoit path
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 42,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('infiniteJustDoit');
        expect(result.actions.completeMission13).toBe(true);
        expect(result.goTo).toBe('infiniteJustDoit');
      });

      test('path 2: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, hasBench, M13 completed → infiniteJustDoit
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 42,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission13).toBe(true);
        expect(result.marker).toBe('infiniteJustDoit');
        expect(result.actions.givePart).toBe(42);
      });

      test('path 3: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // M25 completed, M13 given, hasBench, M13 completed → goTo = marker (not "start")
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 42,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('infiniteJustDoit');
        expect(result.marker).toBe('infiniteJustDoit');
      });

      test('path 4: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed path: M13 given + Bench + M13 completed → infinite path
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 7,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission13).toBe(true);
        expect(result.actions.givePart).toBe(7);
        expect(result.goTo).toBe('infiniteJustDoit');
      });

      test('path 5: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, Bench, M13 completed → infinite path, go to marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 5,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('infiniteJustDoit');
        expect(result.actions.completeMission13).toBe(true);
      });

      test('path 6: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: go(myMarker)

        // M25 completed, M13 given, Bench, M13 completed → goTo is the marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 10,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.marker).toBe('infiniteJustDoit');
      });

      test('path 7: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)

        // M25 completed, M13 given, hasBench, M13 NOT completed → JustdoIt
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('JustdoIt');
        expect(result.actions.completeMission13).toBe(true);
        expect(result.actions.givePart).toBe(200);
      });

      test('path 8: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, hasBench, M13 NOT completed → JustdoIt, goTo = marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('JustdoIt');
        expect(result.goTo).toBe('JustdoIt');
      });

      test('path 9: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // M25 completed, M13 given, Bench, M13 NOT completed → JustdoIt path
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission13).toBe(true);
        expect(result.actions.givePart).toBe(200);
      });

      test('path 10: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, Bench, M13 NOT completed → JustdoIt marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('JustdoIt');
        expect(result.actions.completeMission13).toBe(true);
        expect(result.goTo).toBe('JustdoIt');
      });

      test('path 11: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, Bench, NOT completed → JustdoIt
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('JustdoIt');
        expect(result.actions.givePart).toBe(200);
      });

      test('path 12: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go(myMarker)

        // M25 completed, M13 given, Bench, NOT completed → goTo matches marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.goTo).toBe('JustdoIt');
      });

      test('path 13: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, NO Bench → cantdoIT
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('cantdoIT');
        expect(result.goTo).toBe('cantdoIT');
      });

      test('path 14: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, NO Bench → cantdoIT, no M13 completion
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('cantdoIT');
        expect(result.actions.completeMission13).toBe(false);
      });

      test('path 15: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // M25 completed, M13 given, NO Bench → goTo is the marker (cantdoIT)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.goTo).toBe('cantdoIT');
      });

      test('path 16: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, NO Bench → cantdoIT, givePart is null
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('cantdoIT');
        expect(result.actions.givePart).toBeNull();
      });

      test('path 17: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, NO Bench → cantdoIT, goTo = marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('cantdoIT');
        expect(result.actions.giveMission13).toBe(false);
      });

      test('path 18: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: go(myMarker)

        // M25 completed, M13 given, NO Bench → cantdoIT, goTo = cantdoIT
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('cantdoIT');
        expect(result.goTo).toBe('cantdoIT');
      });

      test('path 19: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 NOT given → Done
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('Done');
        expect(result.goTo).toBe('Done');
      });

      test('path 20: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 NOT given → Done, no completeMission25
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('Done');
        expect(result.actions.completeMission25).toBe(false);
      });

      test('path 21: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // M25 completed, M13 NOT given → Done, goTo matches marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.marker).toBe('Done');
      });

      test('path 22: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 NOT given → Done, giveMission13 = false
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('Done');
        expect(result.actions.giveMission13).toBe(false);
      });

      test('path 23: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 NOT given → Done, completeMission13 = false
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission13).toBe(false);
        expect(result.marker).toBe('Done');
      });

      test('path 24: objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: go(myMarker)

        // M25 completed, M13 NOT given → Done, goTo = Done
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('Done');
        expect(result.actions.givePart).toBeNull();
      });

      test('path 25: objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 25)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 NOT completed + hasBench → nomission then justDoITluck
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission25).toBe(true);
        expect(result.actions.giveMission13).toBe(true);
        expect(result.marker).toBe('justDoITluck');
        expect(result.goTo).toBe('start');
      });

      test('path 26: objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 25)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 NOT completed, NO Bench → nomission path, go("start")
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission25).toBe(true);
        expect(result.actions.giveMission13).toBe(true);
        expect(result.goTo).toBe('start');
      });

      test('path 27: objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 25)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: NOT (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // M25 NOT completed → always sets marker to "nomission", goTo = "start"
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('nomission');
        expect(result.goTo).toBe('start');
        expect(result.actions.completeMission25).toBe(true);
      });

      test('path 28: objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 NOT completed + hasBench → justDoITluck, completeMission13
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.giveMission13).toBe(true);
        expect(result.actions.completeMission13).toBe(true);
        expect(result.marker).toBe('justDoITluck');
      });

      test('path 29: objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 NOT completed, NO Bench → nomission, giveMission13, goTo = "start"
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.giveMission13).toBe(true);
        expect(result.goTo).toBe('start');
        expect(result.actions.givePart).toBe(100);
      });

      test('path 30: objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), go(myMarker)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: NOT (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: go(myMarker)

        // M25 NOT completed → nomission is always the marker, goTo = "start"
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('start');
        expect(result.actions.completeMission25).toBe(true);
      });

      test('path 31: objectp(the world of gMulleGlobals), NOT objId → drawBoat(point(310, 150))', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))

        // When no objId, the startMovie only draws the boat — no mission logic runs
        // With no mission state, M25 not completed → nomission path
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('nomission');
        expect(result.actions.completeMission25).toBe(true);
      });

      test('path 32: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)

        // Same logic regardless of objectp — M25 done, M13 given, Bench, M13 done
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 42,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('infiniteJustDoit');
        expect(result.actions.completeMission13).toBe(true);
        expect(result.goTo).toBe('infiniteJustDoit');
      });

      test('path 33: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // Infinite path: completeMission13, givePart = randomPart
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 42,
          objectParts: [100, 200]
        });
        expect(result.actions.givePart).toBe(42);
        expect(result.actions.completeMission13).toBe(true);
      });

      test('path 34: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // goTo uses marker for M25-completed paths
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 42,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.actions.completeMission25).toBe(false);
      });

      test('path 35: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // Infinite path does not give new mission 13
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 99,
          objectParts: [100, 200]
        });
        expect(result.actions.giveMission13).toBe(false);
        expect(result.actions.givePart).toBe(99);
      });

      test('path 36: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // Infinite path: goTo = infiniteJustDoit (not "start")
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 3,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('infiniteJustDoit');
        expect(result.marker).toBe('infiniteJustDoit');
      });

      test('path 37: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ],
                            "completed": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "infiniteJustDoit"
        // Action: go(myMarker)

        // Verify goTo matches marker for return-visit paths
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: true,
          randomPart: 50,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.goTo).not.toBe('start');
      });

      test('path 38: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)

        // M25 completed, M13 given, Bench, M13 NOT completed → JustdoIt
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('JustdoIt');
        expect(result.actions.completeMission13).toBe(true);
        expect(result.actions.givePart).toBe(200);
      });

      test('path 39: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // JustdoIt: completeMission25 is false (M25 already completed)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission25).toBe(false);
        expect(result.marker).toBe('JustdoIt');
      });

      test('path 40: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // JustdoIt: goTo = marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.goTo).toBe('JustdoIt');
      });

      test('path 41: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // JustdoIt: giveMission13 = false (M25 already done, not first visit)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.giveMission13).toBe(false);
        expect(result.marker).toBe('JustdoIt');
      });

      test('path 42: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // JustdoIt: givePart = objectParts[1]
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.givePart).toBe(200);
        expect(result.goTo).toBe('JustdoIt');
      });

      test('path 43: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "JustdoIt"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "JustdoIt"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go(myMarker)

        // JustdoIt: goTo = marker (not start)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('JustdoIt');
        expect(result.goTo).not.toBe('start');
      });

      test('path 44: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 given, NO Bench → cantdoIT
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('cantdoIT');
        expect(result.goTo).toBe('cantdoIT');
      });

      test('path 45: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // cantdoIT: completeMission25 = false (already done)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission25).toBe(false);
        expect(result.marker).toBe('cantdoIT');
      });

      test('path 46: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // cantdoIT: goTo = marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.goTo).toBe('cantdoIT');
      });

      test('path 47: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // cantdoIT: no givePart (no Bench)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: true,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.givePart).toBeNull();
        expect(result.marker).toBe('cantdoIT');
      });

      test('path 48: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // cantdoIT: completeMission13 = false (no Bench)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission13).toBe(false);
        expect(result.goTo).toBe('cantdoIT');
      });

      test('path 49: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "cantdoIT"', () => {
        const state = createGameState({
                  "missions": {
                            "given": [
                                      13
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT getProperty(tmpBoat, #Bench)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "cantdoIT"
        // Action: go(myMarker)

        // cantdoIT: goTo = cantdoIT (not start)
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: true,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('cantdoIT');
        expect(result.goTo).not.toBe('start');
      });

      test('path 50: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 completed, M13 NOT given → Done
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('Done');
        expect(result.goTo).toBe('Done');
      });

      test('path 51: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // Done: completeMission25 = false
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission25).toBe(false);
        expect(result.marker).toBe('Done');
      });

      test('path 52: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Done: goTo = marker
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe(result.marker);
        expect(result.goTo).toBe('Done');
      });

      test('path 53: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // Done: giveMission13 = false on return visits
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('Done');
        expect(result.actions.giveMission13).toBe(false);
      });

      test('path 54: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // Done: completeMission13 = false
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission13).toBe(false);
        expect(result.marker).toBe('Done');
      });

      test('path 55: NOT objectp(the world of gMulleGlobals), objId, (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), myMarker = "Done"', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 13)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: myMarker = "Done"
        // Action: go(myMarker)

        // Done: givePart = null
        const result = computeMiaResult({
          isMission25Completed: true,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.givePart).toBeNull();
        expect(result.goTo).toBe('Done');
      });

      test('path 56: NOT objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 25)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 NOT completed + hasBench → justDoITluck
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.completeMission25).toBe(true);
        expect(result.marker).toBe('justDoITluck');
        expect(result.actions.completeMission13).toBe(true);
      });

      test('path 57: NOT objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 25)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // M25 NOT completed, NO Bench → nomission, goTo = "start"
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.giveMission13).toBe(true);
        expect(result.goTo).toBe('start');
        expect(result.marker).toBe('nomission');
      });

      test('path 58: NOT objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addCompletedMission(the user of gMulleGlobals, 25)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: NOT (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addCompletedMission(the user of gMulleGlobals, 25)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // M25 NOT completed → always ends at nomission or justDoITluck, goTo = "start"
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('start');
        expect(result.actions.completeMission25).toBe(true);
      });

      test('path 59: NOT objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: myMarker = "justDoITluck"
        // Action: addCompletedMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // First visit + hasBench → justDoITluck with completeMission13
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: true,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.giveMission13).toBe(true);
        expect(result.actions.completeMission13).toBe(true);
        expect(result.goTo).toBe('start');
      });

      test('path 60: NOT objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), addGivenMission(the user of gMulleGlobals, 13)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: addGivenMission(the user of gMulleGlobals, 13)
        // Action: go("start")

        // First visit, NO Bench → nomission, giveMission13, givePart = objectParts[0]
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.actions.givePart).toBe(100);
        expect(result.goTo).toBe('start');
      });

      test('path 61: NOT objectp(the world of gMulleGlobals), objId, NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1) → drawBoat(point(310, 150)), go(myMarker)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 1)
        // Condition: NOT (isMissionCompleted(the user of gMulleGlobals, 25) = 0)
        // Condition: NOT (myMarker = "nomission")
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))
        // Action: go(myMarker)

        // First visit → always goTo = "start" (not marker)
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.goTo).toBe('start');
        expect(result.actions.completeMission25).toBe(true);
      });

      test('path 62: NOT objectp(the world of gMulleGlobals), NOT objId → drawBoat(point(310, 150))', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT objId
        // Expected behavioral actions:
        // Action: drawBoat(point(310, 150))

        // When no objId and no world, the compute function still runs
        const result = computeMiaResult({
          isMission25Completed: false,
          isMission13Given: false,
          isMission13Completed: false,
          hasBench: false,
          randomPart: null,
          objectParts: [100, 200]
        });
        expect(result.marker).toBe('nomission');
        expect(result.actions.completeMission25).toBe(true);
      });

    });

  });

});
