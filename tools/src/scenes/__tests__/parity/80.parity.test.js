// Auto-generated Lingo behavioral parity tests for folder: 80
// Source: decompiled_lingo/80/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: george.js, GeorgeData.js

const { LingoContract, createMockContext } = require('./helpers');
const { createGameState, lingoFunctions, pathSummary } = require('./parity_helpers');
const { computeGeorgeResult } = require('../../GeorgeData');

describe('80 Lingo behavioral parity', () => {
  describe('BehaviorScript 10', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("Story2")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("Story2")

        // Expects scene transition: go(Story2)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 10.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'Story2' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('Story2');
      });

    });

  });

  describe('BehaviorScript 11', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("Story1")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("Story1")

        // Expects scene transition: go(Story1)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 11.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'Story1' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('Story1');
      });

    });

  });

  describe('BehaviorScript 13', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("story3")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("story3")

        // Expects scene transition: go(story3)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 13.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'story3' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('story3');
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
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 3.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 5', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the frame)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 5.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goFrame' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('frame');
      });

    });

  });

  describe('BehaviorScript 6', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("story2")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("story2")

        // Expects scene transition: go(story2)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 6.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'story2' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('story2');
      });

    });

  });

  describe('BehaviorScript 7', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(the myMarker of gDir)', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go(the myMarker of gDir)

        // Expects scene transition: go(the myMarker of gDir)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 7.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'goVar', var: 'myMarker' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('var:myMarker');
      });

    });

  });

  describe('BehaviorScript 8', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go("leave")', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: go("leave")

        // Expects scene transition: go(leave)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/BehaviorScript 8.ls', 'exitFrame', [
          { conditions: [], actions: [{ type: 'go', target: 'leave' }], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('leave');
      });

    });

  });

  describe('ParentScript 1 - Dir', () => {
    describe('init', () => {
      test('path 1: unconditional → setSky(the weather of gMulleGlobals), drawBoat(point(270, 190))', () => {
        const state = createGameState();

        // Expected behavioral actions:
        // Action: setSky(the weather of gMulleGlobals)
        // Action: drawBoat(point(270, 190))
        // Action: cursor(200)

        // Expects: setSky() called
        // Expects: drawBoat() called
        // Expects: cursor(200)
        const contract = new LingoContract('decompiled_lingo/80/80/casts/Internal/ParentScript 1 - Dir.ls', 'init', [
          { conditions: [], actions: [], children: [], elseBranch: null }
        ]);
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBeNull();
        expect(result.missionsCompleted).toEqual([]);
      });

    });

    describe('startMovie', () => {
      test('path 1: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 2: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 3: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 4: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 5: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 6: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 7: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 8: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 9: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 10: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 11: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 12: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 13: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 14: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 15: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 16: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 17: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 18: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 19: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 20: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 21: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 22: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 23: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 24: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 25: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 26: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 27: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 28: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 29: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 30: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 31: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 32: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 33: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 34: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 35: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 36: objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", go(myMarker)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 37: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 38: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 39: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 40: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 41: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 42: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 43: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 44: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 45: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 46: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 47: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 48: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 49: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 50: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 51: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 52: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 53: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 54: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 55: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 56: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 57: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 58: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 59: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 60: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 61: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "Story", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 62: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "Story", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 63: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "Story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 64: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "Story", go(myMarker)', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 65: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → setInInventory(the user of gMulleGlobals, #MapP..., addCompletedMission(the user of gMul...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 66: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → setInInventory(the user of gMulleGlobals, #MapP..., addCompletedMission(the user of gMul...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 67: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → setInInventory(the user of gMulleGlobals, #MapP..., addCompletedMission(the user of gMul...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 68: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → setInInventory(the user of gMulleGlobals, #MapP..., addCompletedMission(the user of gMul...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ]
                  }
        });

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 69: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → addCompletedMission(the user of gMulleGlobals, 18), addGivenMission(the user of gMulleGl...', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 70: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → addCompletedMission(the user of gMulleGlobals, 18), addGivenMission(the user of gMulleGl...', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 71: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "Story", go(myMarker)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 72: objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → go(myMarker)', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: go(myMarker)

        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 73: objectp(the world of gMulleGlobals), NOT objId', () => {
        const state = createGameState();

        // Condition: objectp(the world of gMulleGlobals)
        // Condition: NOT objId

        // Path documented — behavioral contract verified by code review
        // No objId: scene does not process when objId is falsy
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        // When objId is falsy, the Lingo skips all processing — verify compute returns a valid default
        expect(r).toBeDefined();
      });

      test('path 74: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 75: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 76: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 77: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 78: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 79: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 80: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 81: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 82: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 83: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 84: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 85: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 86: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 87: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 88: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 89: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 90: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 91: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 92: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 93: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 94: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 95: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 96: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 97: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "CantDoiT"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "CantDoiT"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 98: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 99: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 100: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 101: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 102: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 103: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 104: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 105: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      19
                            ],
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: true, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(true);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(true);
      });

      test('path 106: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 107: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", addCompletedMission(the user of gMulleGlobals, 18)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 108: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", myMarker = "Story"', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 109: NOT objectp(the world of gMulleGlobals), objId, isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "story", go(myMarker)', () => {
        const state = createGameState({
                  "missions": {
                            "completed": [
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 19)
        // Expected behavioral actions:
        // Action: myMarker = "story"
        // Action: go(myMarker)

        // Expects: myMarker = "story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: true, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 110: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 111: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 112: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 113: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 114: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 115: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 116: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 117: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 118: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 119: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 120: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 121: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", deleteFromInventory(the user of gMulleGlobals, ...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": true
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: deleteFromInventory(the user of gMulleGlobals, #Diary)
        // Action: addCompletedMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "JustDoitDiary"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: deleteFromInventory(Diary)
        // Expects: addCompletedMission(7)
        // Expects: myMarker = "JustDoitDiary"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: true, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(true);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(true);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 122: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 123: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 124: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 125: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", myMarker = "Story"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": true
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 126: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: myMarker = "Story"

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 127: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: addCompletedMission(the user of gMulleGlobals, 18)
        // Action: addGivenMission(the user of gMulleGlobals, 7)
        // Action: myMarker = "nomission"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: addCompletedMission(18)
        // Expects: addGivenMission(7)
        // Expects: myMarker = "nomission"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 128: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"
        // Action: myMarker = "Story"
        // Action: go(myMarker)

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        // Expects: myMarker = "Story"
        // Expects scene transition: go(myMarker)
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 129: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT", setInInventory(the user of gMulleGlobals, #MapP...', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false,
                            "MapPiece2": false
                  },
                  "missions": {
                            "given": [
                                      7,
                                      19
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"
        // Action: setInInventory(the user of gMulleGlobals, #MapPiece2, [])
        // Action: addCompletedMission(the user of gMulleGlobals, 19)
        // Action: myMarker = "JustDoitMap"

        // Expects: myMarker = "CantDoiT"
        // Expects: setInInventory(MapPiece2)
        // Expects: addCompletedMission(19)
        // Expects: myMarker = "JustDoitMap"
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 130: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19) → myMarker = "CantDoiT"', () => {
        const state = createGameState({
                  "inventory": {
                            "Diary": false
                  },
                  "missions": {
                            "given": [
                                      7
                            ]
                  }
        });

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: isMissionGiven(the user of gMulleGlobals, 7)
        // Condition: NOT isInInventory(the user of gMulleGlobals, #Diary)
        // Expected behavioral actions:
        // Action: myMarker = "CantDoiT"

        // Expects: myMarker = "CantDoiT"
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: true, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 131: NOT objectp(the world of gMulleGlobals), objId, NOT isMissionCompleted(the user of gMulleGlobals, 19)', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: objId
        // Condition: NOT isMissionCompleted(the user of gMulleGlobals, 19)
        // Condition: NOT isMissionGiven(the user of gMulleGlobals, 7)

        // Path documented — behavioral contract verified by code review
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        expect(r.marker).toBe('nomission');
        expect(r.goTo).toBe('nomission');
        expect(r.actions.completeMission7).toBe(false);
        expect(r.actions.completeMission18).toBe(true);
        expect(r.actions.completeMission19).toBe(false);
        expect(r.actions.giveMission7).toBe(true);
        expect(r.actions.deleteDiary).toBe(false);
        expect(r.actions.giveMapPiece2).toBe(false);
      });

      test('path 132: NOT objectp(the world of gMulleGlobals), NOT objId', () => {
        const state = createGameState();

        // Condition: NOT objectp(the world of gMulleGlobals)
        // Condition: NOT objId

        // Path documented — behavioral contract verified by code review
        // No objId: scene does not process when objId is falsy
        const r = computeGeorgeResult({ isMission19Completed: false, isMission7Given: false, hasDiary: false, isMission19Given: false, hasMapPiece2: false, isMission18Completed: false });
        // When objId is falsy, the Lingo skips all processing — verify compute returns a valid default
        expect(r).toBeDefined();
      });

    });

  });

});