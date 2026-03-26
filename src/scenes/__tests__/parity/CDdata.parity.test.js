// Auto-generated Lingo behavioral parity tests for folder: CDdata
// Source: decompiled_lingo/CDdata/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: (no direct JS mapping)

const { LingoContract, createMockContext } = require('./helpers');

describe('CDdata Lingo behavioral parity', () => {
  describe('ParentScript 1956 - ObjectPickupScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: listp(tmp), listp(tmp), count(the sounds of child) → setInInventory(the user of gMulleGlobals, tmpSt...', () => {
        // Conditions: listp(tmp), listp(tmp), count(the sounds of child), sndId, stringp(tmpPic)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_stringptmpPic', negated: false }], actions: [{ type: 'setInInventory', item: 'pickup_item' }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_stringptmpPic': true } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toContain('pickup_item');
      });

      test('path 2: listp(tmp), listp(tmp), count(the sounds of child) → setInInventory(the user of gMulleGlobals, tmpSt...', () => {
        // Conditions: listp(tmp), listp(tmp), count(the sounds of child), sndId, NOT stringp(tmpPic)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_NOT_stringptmpP', negated: false }], actions: [{ type: 'setInInventory', item: 'pickup_item' }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_NOT_stringptmpP': true } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toContain('pickup_item');
      });

      test('path 3: listp(tmp), listp(tmp), count(the sounds of child) → setInInventory(the user of gMulleGlobals, tmpSt...', () => {
        // Conditions: listp(tmp), listp(tmp), count(the sounds of child), NOT sndId
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_listptmp_AND_countthe_sounds_of_child_AND_NOT_sndId', negated: false }], actions: [{ type: 'setInInventory', item: 'pickup_item' }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_listptmp_AND_countthe_sounds_of_child_AND_NOT_sndId': true } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toContain('pickup_item');
      });

      test('path 4: listp(tmp), listp(tmp), NOT count(the sounds of child) → setInInventory(the user of gMulleGlobals, tmpSt...', () => {
        // Conditions: listp(tmp), listp(tmp), NOT count(the sounds of child)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_listptmp_AND_NOT_countthe_sounds_of_child', negated: false }], actions: [{ type: 'setInInventory', item: 'pickup_item' }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_listptmp_AND_NOT_countthe_sounds_of_child': true } });
        const result = contract.evaluate(ctx);
        expect(result.inventorySet).toContain('pickup_item');
      });

      test('path 5: listp(tmp), NOT listp(tmp), count(the sounds of child)', () => {
        // Conditions: listp(tmp), NOT listp(tmp), count(the sounds of child), sndId, stringp(tmpPic)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_stringptmpP', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_stringptmpP': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: listp(tmp), NOT listp(tmp), count(the sounds of child)', () => {
        // Conditions: listp(tmp), NOT listp(tmp), count(the sounds of child), sndId, NOT stringp(tmpPic)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_NOT_stringp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_NOT_stringp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: listp(tmp), NOT listp(tmp), count(the sounds of child)', () => {
        // Conditions: listp(tmp), NOT listp(tmp), count(the sounds of child), NOT sndId
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_NOT_listptmp_AND_countthe_sounds_of_child_AND_NOT_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_NOT_listptmp_AND_countthe_sounds_of_child_AND_NOT_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: listp(tmp), NOT listp(tmp), NOT count(the sounds of child)', () => {
        // Conditions: listp(tmp), NOT listp(tmp), NOT count(the sounds of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_NOT_listptmp_AND_NOT_countthe_sounds_of_child', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_NOT_listptmp_AND_NOT_countthe_sounds_of_child': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: NOT listp(tmp), count(the sounds of child), sndId', () => {
        // Conditions: NOT listp(tmp), count(the sounds of child), sndId, stringp(tmpPic)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_stringptmpPic', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_stringptmpPic': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: NOT listp(tmp), count(the sounds of child), sndId', () => {
        // Conditions: NOT listp(tmp), count(the sounds of child), sndId, NOT stringp(tmpPic)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_NOT_stringptmpPic', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_countthe_sounds_of_child_AND_sndId_AND_NOT_stringptmpPic': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: NOT listp(tmp), count(the sounds of child), NOT sndId', () => {
        // Conditions: NOT listp(tmp), count(the sounds of child), NOT sndId
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_countthe_sounds_of_child_AND_NOT_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_countthe_sounds_of_child_AND_NOT_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: NOT listp(tmp), NOT count(the sounds of child)', () => {
        // Conditions: NOT listp(tmp), NOT count(the sounds of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_NOT_countthe_sounds_of_child', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_NOT_countthe_sounds_of_child': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLevel_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), NOT listp(tmpReqLevel), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), NOT listp(tmpReqLevel), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), NOT listp(tmpReqLevel), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), NOT listp(tmpReqLevel), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPostmp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPostmp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 14: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPostmp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPostmp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 15: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmpReqL', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmpReqL': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 16: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmpReqL', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmpReqL': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 17: listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_Showing', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_Showing': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 18: listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_Showi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_Showi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 19: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 20: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 21: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 22: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_listptmpReqLe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 23: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), NOT listp(tmpReqLevel), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 24: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), listp(tmpReqLevel), NOT listp(tmpReqLevel), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 25: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 26: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 27: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 28: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_listptmpR': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 29: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), NOT listp(tmpReqLevel), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 30: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), voidp(tmpReqLevel), NOT listp(tmpReqLevel), NOT listp(tmpReqLevel), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_listp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 31: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 32: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), NOT getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_NOT_getPo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 33: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 34: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), listp(tmpReqLevel), getPos(tmpReqLevel, getLevel(the levelHandler of gMulleGlobals)), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmp', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_listptmpReqLevel_AND_getPostmp': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 35: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel), Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_Showi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_Showi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 36: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel)', () => {
        // Conditions: NOT listp(tmpReqLevel), NOT voidp(tmpReqLevel), NOT listp(tmpReqLevel), NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_S', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmpReqLevel_AND_NOT_voidptmpReqLevel_AND_NOT_listptmpReqLevel_AND_NOT_S': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: NOT Showing', () => {
        // Conditions: NOT Showing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_Showing', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_Showing': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: Showing, sndId, (temp = #EnterInnerRadius)', () => {
        // Conditions: Showing, sndId, (temp = #EnterInnerRadius)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'Showing_AND_sndId_AND_temp_eq_EnterInnerRadius', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'Showing_AND_sndId_AND_temp_eq_EnterInnerRadius': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: Showing, sndId, NOT (temp = #EnterInnerRadius)', () => {
        // Conditions: Showing, sndId, NOT (temp = #EnterInnerRadius)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'Showing_AND_sndId_AND_NOT_temp_eq_EnterInnerRadius', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'Showing_AND_sndId_AND_NOT_temp_eq_EnterInnerRadius': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: Showing, NOT sndId, (temp = #EnterInnerRadius)', () => {
        // Conditions: Showing, NOT sndId, (temp = #EnterInnerRadius)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'Showing_AND_NOT_sndId_AND_temp_eq_EnterInnerRadius', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'Showing_AND_NOT_sndId_AND_temp_eq_EnterInnerRadius': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: Showing, NOT sndId, NOT (temp = #EnterInnerRadius)', () => {
        // Conditions: Showing, NOT sndId, NOT (temp = #EnterInnerRadius)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1956 - ObjectPickupScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'Showing_AND_NOT_sndId_AND_NOT_temp_eq_EnterInnerRadius', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'Showing_AND_NOT_sndId_AND_NOT_temp_eq_EnterInnerRadius': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 1959 - ObjectFogEdgeScript', () => {
    describe('init', () => {
      test('path 1: getaProp(the quickProps of the boat of gDir, #Compass)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #Compass)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1959 - ObjectFogEdgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_Compass', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_Compass': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT getaProp(the quickProps of the boat of gDir, #Compass)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #Compass)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1959 - ObjectFogEdgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_Compass', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_Compass': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: alreadyTold', () => {
        // Conditions: alreadyTold
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1959 - ObjectFogEdgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'alreadyTold', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'alreadyTold': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT alreadyTold, inside(carLoc, the rect of sprite SP), gotCompass', () => {
        // Conditions: NOT alreadyTold, inside(carLoc, the rect of sprite SP), gotCompass
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1959 - ObjectFogEdgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_alreadyTold_AND_insidecarLoc_the_rect_of_sprite_SP_AND_gotCompass', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_alreadyTold_AND_insidecarLoc_the_rect_of_sprite_SP_AND_gotCompass': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT alreadyTold, inside(carLoc, the rect of sprite SP), NOT gotCompass', () => {
        // Conditions: NOT alreadyTold, inside(carLoc, the rect of sprite SP), NOT gotCompass
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1959 - ObjectFogEdgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_alreadyTold_AND_insidecarLoc_the_rect_of_sprite_SP_AND_NOT_gotCompass', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_alreadyTold_AND_insidecarLoc_the_rect_of_sprite_SP_AND_NOT_gotCompass': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT alreadyTold, NOT inside(carLoc, the rect of sprite SP)', () => {
        // Conditions: NOT alreadyTold, NOT inside(carLoc, the rect of sprite SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1959 - ObjectFogEdgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_alreadyTold_AND_NOT_insidecarLoc_the_rect_of_sprite_SP', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_alreadyTold_AND_NOT_insidecarLoc_the_rect_of_sprite_SP': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 1961 - ObjectRandomAnimScript', () => {
    describe('init', () => {
      test('path 1: voidp(frameList), voidp(waitTime), voidp(rate)', () => {
        // Conditions: voidp(frameList), voidp(waitTime), voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: voidp(frameList), voidp(waitTime), voidp(rate)', () => {
        // Conditions: voidp(frameList), voidp(waitTime), voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: voidp(frameList), voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: voidp(frameList), voidp(waitTime), NOT voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: voidp(frameList), voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: voidp(frameList), voidp(waitTime), NOT voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: voidp(frameList), NOT voidp(waitTime), voidp(rate)', () => {
        // Conditions: voidp(frameList), NOT voidp(waitTime), voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: voidp(frameList), NOT voidp(waitTime), voidp(rate)', () => {
        // Conditions: voidp(frameList), NOT voidp(waitTime), voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: voidp(frameList), NOT voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: voidp(frameList), NOT voidp(waitTime), NOT voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: voidp(frameList), NOT voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: voidp(frameList), NOT voidp(waitTime), NOT voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: NOT voidp(frameList), voidp(waitTime), voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), voidp(waitTime), voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: NOT voidp(frameList), voidp(waitTime), voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), voidp(waitTime), voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_voidpwaitTime_AND_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: NOT voidp(frameList), voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), voidp(waitTime), NOT voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: NOT voidp(frameList), voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), voidp(waitTime), NOT voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: NOT voidp(frameList), NOT voidp(waitTime), voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), NOT voidp(waitTime), voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 14: NOT voidp(frameList), NOT voidp(waitTime), voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), NOT voidp(waitTime), voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 15: NOT voidp(frameList), NOT voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), NOT voidp(waitTime), NOT voidp(rate), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 16: NOT voidp(frameList), NOT voidp(waitTime), NOT voidp(rate)', () => {
        // Conditions: NOT voidp(frameList), NOT voidp(waitTime), NOT voidp(rate), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_NOT_voidpwaitTime_AND_NOT_voidprate_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: waitCounter', () => {
        // Conditions: waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'waitCounter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'waitCounter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT waitCounter, (rateCounter = rate), (counter > listLen)', () => {
        // Conditions: NOT waitCounter, (rateCounter = rate), (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_waitCounter_AND_rateCounter_eq_rate_AND_counter_gt_listLen', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_waitCounter_AND_rateCounter_eq_rate_AND_counter_gt_listLen': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT waitCounter, (rateCounter = rate), NOT (counter > listLen)', () => {
        // Conditions: NOT waitCounter, (rateCounter = rate), NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_waitCounter_AND_rateCounter_eq_rate_AND_NOT_counter_gt_listLen', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_waitCounter_AND_rateCounter_eq_rate_AND_NOT_counter_gt_listLen': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT waitCounter, NOT (rateCounter = rate)', () => {
        // Conditions: NOT waitCounter, NOT (rateCounter = rate)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1961 - ObjectRandomAnimScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_waitCounter_AND_NOT_rateCounter_eq_rate', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_waitCounter_AND_NOT_rateCounter_eq_rate': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 1990 - ObjectRacingScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 2: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 3: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 4: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 5: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 6: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 7: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 8: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 9: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, NOT (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 10: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), NOT racing
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 11: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., (tempDiff > 8), NOT (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), NOT (tempDiff <= 3)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 12: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 13: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 14: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 15: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 16: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 17: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 18: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 19: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 20: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, NOT (nrOfTimesPassed = 1)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 21: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), NOT racing
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 22: (isMissionCompleted(the user of gMulleGlobals, getAt(getS..., NOT (tempDiff > 8), NOT (tempDiff <= 3) → addCompletedMission(the user of gMulleGlobals, ...', () => {
        // Conditions: (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), NOT (tempDiff <= 3)
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_', negated: false }], actions: [{ type: 'addCompletedMission', mission: 1 }], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_missions_1_': true } });
        const result = contract.evaluate(ctx);
        expect(result.missionsCompleted).toContain(1);
      });

      test('path 23: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 24: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 25: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 26: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 27: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 28: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 29: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 30: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 31: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), racing, NOT (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 32: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), (tempDiff <= 3), NOT racing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 33: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., (tempDiff > 8), NOT (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), (tempDiff > 8), NOT (tempDiff <= 3)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 34: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 35: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 36: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 37: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 38: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 39: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 40: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 41: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 42: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), racing, NOT (nrOfTimesPassed = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 43: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), (tempDiff <= 3), NOT racing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 44: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(..., NOT (tempDiff > 8), NOT (tempDiff <= 3)', () => {
        // Conditions: NOT (isMissionCompleted(the user of gMulleGlobals, getAt(getSetWhenDone(child, #missions), 1)) = 0), NOT (tempDiff > 8), NOT (tempDiff <= 3)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_getAtgetSetWhenDonechild_mission': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('ExitInnerRadius', () => {
      test('path 1: racing, (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: racing, (tempDiff > 8), (tempDiff <= 3), (enteredFrom = -1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_enteredFrom_eq_-1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_enteredFrom_eq_-1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: racing, (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: racing, (tempDiff > 8), (tempDiff <= 3), NOT (enteredFrom = -1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_-1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_-1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: racing, (tempDiff > 8), NOT (tempDiff <= 3)', () => {
        // Conditions: racing, (tempDiff > 8), NOT (tempDiff <= 3), (enteredFrom = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_enteredFrom_eq_1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_enteredFrom_eq_1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: racing, (tempDiff > 8), NOT (tempDiff <= 3)', () => {
        // Conditions: racing, (tempDiff > 8), NOT (tempDiff <= 3), NOT (enteredFrom = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: racing, NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: racing, NOT (tempDiff > 8), (tempDiff <= 3), (enteredFrom = -1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_NOT_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_enteredFrom_eq_-1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_NOT_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_enteredFrom_eq_-1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: racing, NOT (tempDiff > 8), (tempDiff <= 3)', () => {
        // Conditions: racing, NOT (tempDiff > 8), (tempDiff <= 3), NOT (enteredFrom = -1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_NOT_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_-1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_NOT_tempDiff_gt_8_AND_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_-1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: racing, NOT (tempDiff > 8), NOT (tempDiff <= 3)', () => {
        // Conditions: racing, NOT (tempDiff > 8), NOT (tempDiff <= 3), (enteredFrom = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_NOT_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_enteredFrom_eq_1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_NOT_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_enteredFrom_eq_1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: racing, NOT (tempDiff > 8), NOT (tempDiff <= 3)', () => {
        // Conditions: racing, NOT (tempDiff > 8), NOT (tempDiff <= 3), NOT (enteredFrom = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'racing_AND_NOT_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'racing_AND_NOT_tempDiff_gt_8_AND_NOT_tempDiff_lteq_3_AND_NOT_enteredFrom_eq_1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: NOT racing', () => {
        // Conditions: NOT racing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'ExitInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_racing', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_racing': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis...', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), voidp(mustEnterFrom), the number of (member saveName = -1), (the machineType = 256), voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), voidp(mustEnterFrom), the number of (member saveName = -1), (the machineType = 256), NOT voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), voidp(mustEnterFrom), the number of (member saveName = -1), NOT (the machineType = 256), voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), voidp(mustEnterFrom), the number of (member saveName = -1), NOT (the machineType = 256), NOT voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., voidp(mustEnterFrom), NOT the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), voidp(mustEnterFrom), NOT the number of (member saveName = -1), voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., voidp(mustEnterFrom), NOT the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), voidp(mustEnterFrom), NOT the number of (member saveName = -1), NOT voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., NOT voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), NOT voidp(mustEnterFrom), the number of (member saveName = -1), (the machineType = 256), voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., NOT voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), NOT voidp(mustEnterFrom), the number of (member saveName = -1), (the machineType = 256), NOT voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., NOT voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), NOT voidp(mustEnterFrom), the number of (member saveName = -1), NOT (the machineType = 256), voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., NOT voidp(mustEnterFrom), the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), NOT voidp(mustEnterFrom), the number of (member saveName = -1), NOT (the machineType = 256), NOT voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., NOT voidp(mustEnterFrom), NOT the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), NOT voidp(mustEnterFrom), NOT the number of (member saveName = -1), voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMis..., NOT voidp(mustEnterFrom), NOT the number of (member saveName = -1)', () => {
        // Conditions: (NOT isMissionCompleted(the user of gMulleGlobals, tmpMission) OR NOT isMissionGiven(the user of gMulleGlobals, tmpMission)), NOT voidp(mustEnterFrom), NOT the number of (member saveName = -1), NOT voidp(tempLoc)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_isMissionCompletedthe_user_of_gMulleGlobals_tmpMission_OR_NOT_isMissionGiven': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: NOT displaying', () => {
        // Conditions: NOT displaying
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_displaying', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_displaying': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: displaying, (temp = #EnterInnerRadius), racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), racing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_racing', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_racing': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, delayCounter, ((delayCounter mod 6) = 5)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_dela', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_dela': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, delayCounter, ((delayCounter mod 6) = 5)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_dela', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_dela': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, delayCounter, NOT ((delayCounter mod 6) = 5)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, delayCounter, NOT ((delayCounter mod 6) = 5)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, delayCounter, NOT ((delayCounter mod 6) = 5)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, delayCounter, NOT ((delayCounter mod 6) = 5)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_delayCounter_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: displaying, (temp = #EnterInnerRadius), NOT racing', () => {
        // Conditions: displaying, (temp = #EnterInnerRadius), NOT racing, NOT delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_NOT_delayCounter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_temp_eq_EnterInnerRadius_AND_NOT_racing_AND_NOT_delayCounter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), racing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_raci', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_raci': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 14: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 15: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 16: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 17: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), (temp = #ExitInnerRadius), NOT racing, NOT delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_temp_eq_ExitInnerRadius_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 18: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), racing
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 19: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 20: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 21: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 22: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 23: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 24: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 25: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius)', () => {
        // Conditions: displaying, NOT (temp = #EnterInnerRadius), NOT (temp = #ExitInnerRadius), NOT racing, NOT delayCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1990 - ObjectRacingScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'displaying_AND_NOT_temp_eq_EnterInnerRadius_AND_NOT_temp_eq_ExitInnerRadius_AND_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 1992 - ObjectFerryScript', () => {
    describe('carBoardInit', () => {
      test('path 1: active, (carLeaving = -1)', () => {
        // Conditions: active, (carLeaving = -1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoardInit',
          [{ conditions: [{ type: 'other', key: 'active_AND_carLeaving_eq_-1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'active_AND_carLeaving_eq_-1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: active, NOT (carLeaving = -1)', () => {
        // Conditions: active, NOT (carLeaving = -1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoardInit',
          [{ conditions: [{ type: 'other', key: 'active_AND_NOT_carLeaving_eq_-1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'active_AND_NOT_carLeaving_eq_-1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT active', () => {
        // Conditions: NOT active
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoardInit',
          [{ conditions: [{ type: 'other', key: 'NOT_active', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_active': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('carBoarding', () => {
      test('path 1: carLeaving, (carCounter > 10), (carLeaving = 1)', () => {
        // Conditions: carLeaving, (carCounter > 10), (carLeaving = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoarding',
          [{ conditions: [{ type: 'other', key: 'carLeaving_AND_carCounter_gt_10_AND_carLeaving_eq_1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'carLeaving_AND_carCounter_gt_10_AND_carLeaving_eq_1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: carLeaving, (carCounter > 10), NOT (carLeaving = 1)', () => {
        // Conditions: carLeaving, (carCounter > 10), NOT (carLeaving = 1)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoarding',
          [{ conditions: [{ type: 'other', key: 'carLeaving_AND_carCounter_gt_10_AND_NOT_carLeaving_eq_1', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'carLeaving_AND_carCounter_gt_10_AND_NOT_carLeaving_eq_1': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: carLeaving, NOT (carCounter > 10)', () => {
        // Conditions: carLeaving, NOT (carCounter > 10)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoarding',
          [{ conditions: [{ type: 'other', key: 'carLeaving_AND_NOT_carCounter_gt_10', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'carLeaving_AND_NOT_carCounter_gt_10': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT carLeaving', () => {
        // Conditions: NOT carLeaving
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carBoarding',
          [{ conditions: [{ type: 'other', key: 'NOT_carLeaving', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_carLeaving': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('carClose', () => {
      test('path 1: active, (hypo < the InnerRadius of child)', () => {
        // Conditions: active, (hypo < the InnerRadius of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carClose',
          [{ conditions: [{ type: 'other', key: 'active_AND_hypo_lt_the_InnerRadius_of_child', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'active_AND_hypo_lt_the_InnerRadius_of_child': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: active, NOT (hypo < the InnerRadius of child)', () => {
        // Conditions: active, NOT (hypo < the InnerRadius of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carClose',
          [{ conditions: [{ type: 'other', key: 'active_AND_NOT_hypo_lt_the_InnerRadius_of_child', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'active_AND_NOT_hypo_lt_the_InnerRadius_of_child': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT active, finished(gSound, sndId), (hypo < the InnerRadius of child)', () => {
        // Conditions: NOT active, finished(gSound, sndId), (hypo < the InnerRadius of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carClose',
          [{ conditions: [{ type: 'other', key: 'NOT_active_AND_finishedgSound_sndId_AND_hypo_lt_the_InnerRadius_of_child', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_active_AND_finishedgSound_sndId_AND_hypo_lt_the_InnerRadius_of_child': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT active, finished(gSound, sndId), NOT (hypo < the InnerRadius of child)', () => {
        // Conditions: NOT active, finished(gSound, sndId), NOT (hypo < the InnerRadius of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carClose',
          [{ conditions: [{ type: 'other', key: 'NOT_active_AND_finishedgSound_sndId_AND_NOT_hypo_lt_the_InnerRadius_of_child', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_active_AND_finishedgSound_sndId_AND_NOT_hypo_lt_the_InnerRadius_of_child': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT active, NOT finished(gSound, sndId)', () => {
        // Conditions: NOT active, NOT finished(gSound, sndId)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'carClose',
          [{ conditions: [{ type: 'other', key: 'NOT_active_AND_NOT_finishedgSound_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_active_AND_NOT_finishedgSound_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: voidp(tempEndLoc), (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)', () => {
        // Conditions: voidp(tempEndLoc), (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidptempEndLoc_AND_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_tempProp_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidptempEndLoc_AND_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_tempProp_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: voidp(tempEndLoc), (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #...', () => {
        // Conditions: voidp(tempEndLoc), (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidptempEndLoc_AND_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGlobals_tempP', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidptempEndLoc_AND_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGlobals_tempP': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: voidp(tempEndLoc), NOT (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)', () => {
        // Conditions: voidp(tempEndLoc), NOT (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidptempEndLoc_AND_NOT_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_tempP', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidptempEndLoc_AND_NOT_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_tempP': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: voidp(tempEndLoc), NOT (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #...', () => {
        // Conditions: voidp(tempEndLoc), NOT (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidptempEndLoc_AND_NOT_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGlobals_t', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidptempEndLoc_AND_NOT_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGlobals_t': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT voidp(tempEndLoc), (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)', () => {
        // Conditions: NOT voidp(tempEndLoc), (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidptempEndLoc_AND_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_tempP', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidptempEndLoc_AND_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_tempP': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT voidp(tempEndLoc), (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #...', () => {
        // Conditions: NOT voidp(tempEndLoc), (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidptempEndLoc_AND_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGlobals_t', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidptempEndLoc_AND_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGlobals_t': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT voidp(tempEndLoc), NOT (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)', () => {
        // Conditions: NOT voidp(tempEndLoc), NOT (Back = 1), (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidptempEndLoc_AND_NOT_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_t', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidptempEndLoc_AND_NOT_Back_eq_1_AND_getUserPropthe_user_of_gMulleGlobals_t': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: NOT voidp(tempEndLoc), NOT (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #...', () => {
        // Conditions: NOT voidp(tempEndLoc), NOT (Back = 1), NOT (getUserProp(the user of gMulleGlobals, tempProp) = #NoProp)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidptempEndLoc_AND_NOT_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGloba', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidptempEndLoc_AND_NOT_Back_eq_1_AND_NOT_getUserPropthe_user_of_gMulleGloba': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, carOnBoard, (waitCounter = 0) AND NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_carOnBoard_AND_waitCoun', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_carOnBoard_AND_waitCoun': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, carOnBoard, (waitCounter = 0) AND NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_carOnBoard_AND_waitCoun', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_carOnBoard_AND_waitCoun': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, NOT carOnBoard, carWasntOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, NOT carOnBoard, carWasntOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, NOT carOnBoard, carWasntOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, NOT carOnBoard, carWasntOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_carW': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, NOT carOnBoard, NOT carWasntOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: (counter > maxCounter), carOnBoard, waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, waitCounter, NOT carOnBoard, NOT carWasntOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_waitCounter_AND_NOT_carOnBoard_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: (counter > maxCounter), carOnBoard, NOT waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, NOT waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_NOT_waitCounter_AND_carOnBoard', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_NOT_waitCounter_AND_carOnBoard': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: (counter > maxCounter), carOnBoard, NOT waitCounter', () => {
        // Conditions: (counter > maxCounter), carOnBoard, NOT waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_carOnBoard_AND_NOT_waitCounter_AND_NOT_carOnBoard', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_carOnBoard_AND_NOT_waitCounter_AND_NOT_carOnBoard': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 14: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 15: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 16: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 17: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 18: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_waitCounter_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 19: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), NOT waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_NOT_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_NOT_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 20: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, carClose(me, carLoc), NOT waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_NOT_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_carCloseme_carLoc_AND_NOT_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 21: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 22: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 23: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 24: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 25: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 26: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 27: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 28: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_waitCount': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 29: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), NOT waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_NOT_waitC', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_NOT_waitC': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 30: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc)', () => {
        // Conditions: (counter > maxCounter), NOT carOnBoard, NOT carClose(me, carLoc), NOT waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_NOT_waitC', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_maxCounter_AND_NOT_carOnBoard_AND_NOT_carCloseme_carLoc_AND_NOT_waitC': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 31: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_ca', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_ca': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 32: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_ca', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_ca': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 33: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 34: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 35: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 36: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 37: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 38: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_waitCounter_AND_NO': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 39: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, NOT waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_NOT_waitCounter_AN', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_NOT_waitCounter_AN': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 40: NOT (counter > maxCounter), (counter < 0), carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), carOnBoard, NOT waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_NOT_waitCounter_AN', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_carOnBoard_AND_NOT_waitCounter_AN': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 41: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 42: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 43: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 44: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 45: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 46: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 47: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 48: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 49: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 50: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, carClose(me, carLoc), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_carCloseme_car': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 51: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 52: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 53: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 54: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 55: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 56: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 57: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 58: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 59: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 60: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard', () => {
        // Conditions: NOT (counter > maxCounter), (counter < 0), NOT carOnBoard, NOT carClose(me, carLoc), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_counter_lt_0_AND_NOT_carOnBoard_AND_NOT_carCloseme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 61: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 62: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 63: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 64: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 65: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 66: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 67: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 68: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 69: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 70: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), (Back = 1), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 71: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 72: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 73: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 74: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 75: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 76: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 77: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 78: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 79: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 80: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), (counter = (maxCounter / 2)), NOT (Back = 1), NOT waitCounter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_counter_eq_maxCounter_/_2_AND': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 81: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 82: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 83: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 84: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 85: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 86: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 87: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 88: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 89: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), NOT waitCounter, carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 90: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2))', () => {
        // Conditions: NOT (counter > maxCounter), NOT (counter < 0), NOT (counter = (maxCounter / 2)), NOT waitCounter, NOT carOnBoard
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1992 - ObjectFerryScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_maxCounter_AND_NOT_counter_lt_0_AND_NOT_counter_eq_maxCounter_/_2': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 1994 - ObjectNoMotorScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: (getType(the boat of gDir) = #Motor), (lastCommentCounter = 0)', () => {
        // Conditions: (getType(the boat of gDir) = #Motor), (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'getTypethe_boat_of_gDir_eq_Motor_AND_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getTypethe_boat_of_gDir_eq_Motor_AND_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: (getType(the boat of gDir) = #Motor), NOT (lastCommentCounter = 0)', () => {
        // Conditions: (getType(the boat of gDir) = #Motor), NOT (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'getTypethe_boat_of_gDir_eq_Motor_AND_NOT_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getTypethe_boat_of_gDir_eq_Motor_AND_NOT_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT (getType(the boat of gDir) = #Motor), (lastCommentCounter = 0)', () => {
        // Conditions: NOT (getType(the boat of gDir) = #Motor), (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_getTypethe_boat_of_gDir_eq_Motor_AND_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getTypethe_boat_of_gDir_eq_Motor_AND_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT (getType(the boat of gDir) = #Motor), NOT (lastCommentCounter = 0)', () => {
        // Conditions: NOT (getType(the boat of gDir) = #Motor), NOT (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_getTypethe_boat_of_gDir_eq_Motor_AND_NOT_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getTypethe_boat_of_gDir_eq_Motor_AND_NOT_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: insideInner', () => {
        // Conditions: insideInner
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'insideInner', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'insideInner': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT insideInner', () => {
        // Conditions: NOT insideInner
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_insideInner', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_insideInner': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND (getType(the boat of gDir) = #Motor)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1994 - ObjectNoMotorScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 1998 - ObjectPictureScript', () => {
    describe('init', () => {
      test('path 1: voidp(frameList), NOT (SP > 0)', () => {
        // Conditions: voidp(frameList), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1998 - ObjectPictureScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: voidp(frameList), (SP > 0)', () => {
        // Conditions: voidp(frameList), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1998 - ObjectPictureScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidpframeList_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidpframeList_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT voidp(frameList), NOT (SP > 0)', () => {
        // Conditions: NOT voidp(frameList), NOT (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1998 - ObjectPictureScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_NOT_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_NOT_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT voidp(frameList), (SP > 0)', () => {
        // Conditions: NOT voidp(frameList), (SP > 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1998 - ObjectPictureScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidpframeList_AND_SP_gt_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidpframeList_AND_SP_gt_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: (counter > listLen)', () => {
        // Conditions: (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1998 - ObjectPictureScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'counter_gt_listLen', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'counter_gt_listLen': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT (counter > listLen)', () => {
        // Conditions: NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 1998 - ObjectPictureScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_counter_gt_listLen', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_counter_gt_listLen': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2000 - ObjectBridgeScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: gotSail, (lastCommentCounter = 0)', () => {
        // Conditions: gotSail, (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'gotSail_AND_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'gotSail_AND_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: gotSail, NOT (lastCommentCounter = 0)', () => {
        // Conditions: gotSail, NOT (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'gotSail_AND_NOT_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'gotSail_AND_NOT_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT gotSail, (lastCommentCounter = 0)', () => {
        // Conditions: NOT gotSail, (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_gotSail_AND_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_gotSail_AND_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT gotSail, NOT (lastCommentCounter = 0)', () => {
        // Conditions: NOT gotSail, NOT (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_gotSail_AND_NOT_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_gotSail_AND_NOT_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_v', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_v': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_v', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_v': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_v', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_v': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_N', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_N': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_N', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_N': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_N', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_AND_N': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 14: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 15: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 16: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 17: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 18: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_voidpframeList_A': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 19: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., NOT voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 20: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., NOT voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 21: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., NOT voidp(frameList), voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 22: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., NOT voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints), voidp(SP)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 23: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., NOT voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 24: NOT getaProp(the quickProps of the boat of gDir, #SailWit..., NOT voidp(frameList), NOT voidp(checkPoints)', () => {
        // Conditions: NOT getaProp(the quickProps of the boat of gDir, #SailWithPole), NOT voidp(frameList), NOT voidp(checkPoints), NOT voidp(SP), NOT (SP = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_SailWithPole_AND_NOT_voidpframeLi': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), NOT lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastComme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastComme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), NOT lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastComme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastComme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastComme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastComme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastComme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastComme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), NOT lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastC', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastC': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), NOT lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastC', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastC': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 9: NOT tmpInsideOne, insideInner AND gotSail, lastCommentCounter', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_counter_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_counter_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 10: NOT tmpInsideOne, insideInner AND gotSail, lastCommentCounter', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_NOT_coun', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_NOT_coun': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 11: NOT tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_coun', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_coun': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 12: NOT tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter', () => {
        // Conditions: NOT tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_NOT_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_NOT_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 13: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCounte', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCounte': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 14: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCounte', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_lastCommentCounte': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 15: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), NOT lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastCommentCo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastCommentCo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 16: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, voidp(enterLoc), NOT lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastCommentCo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_voidpenterLoc_AND_NOT_lastCommentCo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 17: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastCommentCo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastCommentCo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 18: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastCommentCo', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_lastCommentCo': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 19: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), NOT lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastComme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastComme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 20: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc)', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, NOT voidp(enterLoc), NOT lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastComme', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_voidpenterLoc_AND_NOT_lastComme': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 21: tmpInsideOne, insideInner AND gotSail, lastCommentCounter', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_counter_gt_l', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_counter_gt_l': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 22: tmpInsideOne, insideInner AND gotSail, lastCommentCounter', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_NOT_counter_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_lastCommentCounter_AND_NOT_counter_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 23: tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter, (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_counter_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_counter_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 24: tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter', () => {
        // Conditions: tmpInsideOne, insideInner AND gotSail, NOT lastCommentCounter, NOT (counter > listLen)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2000 - ObjectBridgeScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_NOT_coun', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpInsideOne_AND_insideInner_AND_gotSail_AND_NOT_lastCommentCounter_AND_NOT_coun': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2002 - ObjectRiverEnterScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: NOT enterOK, (lastCommentCounter = 0)', () => {
        // Conditions: NOT enterOK, (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_enterOK_AND_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_enterOK_AND_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT enterOK, NOT (lastCommentCounter = 0)', () => {
        // Conditions: NOT enterOK, NOT (lastCommentCounter = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_enterOK_AND_NOT_lastCommentCounter_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_enterOK_AND_NOT_lastCommentCounter_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: enterOK', () => {
        // Conditions: enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: (getaProp(the quickProps of the boat of gDir, #RealDepth)...', () => {
        // Conditions: (getaProp(the quickProps of the boat of gDir, #RealDepth) > 8)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_RealDepth_gt_8', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_RealDepth_gt_8': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT (getaProp(the quickProps of the boat of gDir, #RealDe...', () => {
        // Conditions: NOT (getaProp(the quickProps of the boat of gDir, #RealDepth) > 8)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_RealDepth_gt_8', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_RealDepth_gt_8': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideI': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: NOT lastCommentCounter, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2002 - ObjectRiverEnterScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_lastCommentCounter_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_ins': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2004 - ObjectMulleCommentScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: NOT hasEntered', () => {
        // Conditions: NOT hasEntered
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2004 - ObjectMulleCommentScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_hasEntered', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_hasEntered': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: hasEntered', () => {
        // Conditions: hasEntered
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2004 - ObjectMulleCommentScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'hasEntered', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'hasEntered': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: tmpRad, voidp(checkPoints)', () => {
        // Conditions: tmpRad, voidp(checkPoints)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2004 - ObjectMulleCommentScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'tmpRad_AND_voidpcheckPoints', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpRad_AND_voidpcheckPoints': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: tmpRad, NOT voidp(checkPoints)', () => {
        // Conditions: tmpRad, NOT voidp(checkPoints)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2004 - ObjectMulleCommentScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'tmpRad_AND_NOT_voidpcheckPoints', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'tmpRad_AND_NOT_voidpcheckPoints': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT tmpRad, voidp(checkPoints)', () => {
        // Conditions: NOT tmpRad, voidp(checkPoints)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2004 - ObjectMulleCommentScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpRad_AND_voidpcheckPoints', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpRad_AND_voidpcheckPoints': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT tmpRad, NOT voidp(checkPoints)', () => {
        // Conditions: NOT tmpRad, NOT voidp(checkPoints)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2004 - ObjectMulleCommentScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_tmpRad_AND_NOT_voidpcheckPoints', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_tmpRad_AND_NOT_voidpcheckPoints': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2006 - ObjectReefScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: NOT enterOK', () => {
        // Conditions: NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: enterOK', () => {
        // Conditions: enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: listp(tmp), voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth)...', () => {
        // Conditions: listp(tmp), voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir_RealDep', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir_RealDep': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: listp(tmp), voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDe...', () => {
        // Conditions: listp(tmp), voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_gDir_Rea', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_gDir_Rea': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: listp(tmp), NOT voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth)...', () => {
        // Conditions: listp(tmp), NOT voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_NOT_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir_Rea', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_NOT_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir_Rea': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: listp(tmp), NOT voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDe...', () => {
        // Conditions: listp(tmp), NOT voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'listptmp_AND_NOT_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_gDir', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'listptmp_AND_NOT_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_gDir': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT listp(tmp), voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth)...', () => {
        // Conditions: NOT listp(tmp), voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir_Rea', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir_Rea': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT listp(tmp), voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDe...', () => {
        // Conditions: NOT listp(tmp), voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_gDir', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_gDir': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT listp(tmp), NOT voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth)...', () => {
        // Conditions: NOT listp(tmp), NOT voidp(OKDepth), (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_NOT_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_NOT_voidpOKDepth_AND_getaPropthe_quickProps_of_the_boat_of_gDir': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 8: NOT listp(tmp), NOT voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDe...', () => {
        // Conditions: NOT listp(tmp), NOT voidp(OKDepth), NOT (getaProp(the quickProps of the boat of gDir, #RealDepth) > OKDepth)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_listptmp_AND_NOT_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_listptmp_AND_NOT_voidpOKDepth_AND_NOT_getaPropthe_quickProps_of_the_boat_of_': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideInner AND NOT enterOK
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2006 - ObjectReefScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideInner_AND_NOT_enterOK': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2008 - ObjectMaelstromScript', () => {
    describe('step', () => {
      test('path 1: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, (tmpHypo = 0)', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, (tmpHypo = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2008 - ObjectMaelstromScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_tmpHypo_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_tmpHypo_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, NOT (tmpHypo = 0)', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, NOT (tmpHypo = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2008 - ObjectMaelstromScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_NOT_tmpHypo_eq', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_NOT_tmpHypo_eq': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), NOT insideOuter', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), NOT insideOuter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2008 - ObjectMaelstromScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_NOT_insideOuter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_NOT_insideOuter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, (tmpHypo = 0)', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, (tmpHypo = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2008 - ObjectMaelstromScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_tmpHypo_eq_0', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_tmpHypo_eq_0': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, NOT (tmpHypo = 0)', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), insideOuter, NOT (tmpHypo = 0)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2008 - ObjectMaelstromScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_NOT_tmpHypo_eq', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_insideOuter_AND_NOT_tmpHypo_eq': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), NOT insideOuter', () => {
        // Conditions: ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), NOT insideOuter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2008 - ObjectMaelstromScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_NOT_insideOuter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_NOT_insideOuter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2012 - ObjectGasScript', () => {
    describe('EnterInnerRadius', () => {
      test('path 1: OKToEnter, sndId', () => {
        // Conditions: OKToEnter, sndId
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'OKToEnter_AND_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'OKToEnter_AND_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: OKToEnter, NOT sndId', () => {
        // Conditions: OKToEnter, NOT sndId
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'OKToEnter_AND_NOT_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'OKToEnter_AND_NOT_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT OKToEnter', () => {
        // Conditions: NOT OKToEnter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'EnterInnerRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_OKToEnter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_OKToEnter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('enterOuterRadius', () => {
      test('path 1: NOT alreadyTold, tmpCnt', () => {
        // Conditions: NOT alreadyTold, tmpCnt
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'enterOuterRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_alreadyTold_AND_tmpCnt', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_alreadyTold_AND_tmpCnt': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT alreadyTold, NOT tmpCnt', () => {
        // Conditions: NOT alreadyTold, NOT tmpCnt
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'enterOuterRadius',
          [{ conditions: [{ type: 'other', key: 'NOT_alreadyTold_AND_NOT_tmpCnt', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_alreadyTold_AND_NOT_tmpCnt': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: alreadyTold', () => {
        // Conditions: alreadyTold
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'enterOuterRadius',
          [{ conditions: [{ type: 'other', key: 'alreadyTold', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'alreadyTold': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('init', () => {
      test('path 1: (getaProp(the quickProps of the boat of gDir, #fuelConsum..., listp(the optionalData of child), stringp(tempShow)', () => {
        // Conditions: (getaProp(the quickProps of the boat of gDir, #fuelConsumption) > 0), listp(the optionalData of child), stringp(tempShow)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe_opt', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe_opt': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: (getaProp(the quickProps of the boat of gDir, #fuelConsum..., listp(the optionalData of child), NOT stringp(tempShow)', () => {
        // Conditions: (getaProp(the quickProps of the boat of gDir, #fuelConsumption) > 0), listp(the optionalData of child), NOT stringp(tempShow)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe_opt', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe_opt': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: (getaProp(the quickProps of the boat of gDir, #fuelConsum..., NOT listp(the optionalData of child)', () => {
        // Conditions: (getaProp(the quickProps of the boat of gDir, #fuelConsumption) > 0), NOT listp(the optionalData of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_NOT_listpthe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_NOT_listpthe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT (getaProp(the quickProps of the boat of gDir, #fuelCo..., listp(the optionalData of child), stringp(tempShow)', () => {
        // Conditions: NOT (getaProp(the quickProps of the boat of gDir, #fuelConsumption) > 0), listp(the optionalData of child), stringp(tempShow)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT (getaProp(the quickProps of the boat of gDir, #fuelCo..., listp(the optionalData of child), NOT stringp(tempShow)', () => {
        // Conditions: NOT (getaProp(the quickProps of the boat of gDir, #fuelConsumption) > 0), listp(the optionalData of child), NOT stringp(tempShow)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_listpthe': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT (getaProp(the quickProps of the boat of gDir, #fuelCo..., NOT listp(the optionalData of child)', () => {
        // Conditions: NOT (getaProp(the quickProps of the boat of gDir, #fuelConsumption) > 0), NOT listp(the optionalData of child)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_NOT_list', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_getaPropthe_quickProps_of_the_boat_of_gDir_fuelConsumption_gt_0_AND_NOT_list': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: sndId, finished(gSound, sndId)', () => {
        // Conditions: sndId, finished(gSound, sndId)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'sndId_AND_finishedgSound_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'sndId_AND_finishedgSound_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: sndId, NOT finished(gSound, sndId)', () => {
        // Conditions: sndId, NOT finished(gSound, sndId)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'sndId_AND_NOT_finishedgSound_sndId', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'sndId_AND_NOT_finishedgSound_sndId': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT sndId, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth))', () => {
        // Conditions: NOT sndId, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth))
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_sndId_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_sndId_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT sndId, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), (temp = #enterOuterRadius)', () => {
        // Conditions: NOT sndId, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), (temp = #enterOuterRadius)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_sndId_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_temp_eq_enterOut', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_sndId_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_temp_eq_enterOut': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT sndId, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), NOT (temp = #enterOuterRadius)', () => {
        // Conditions: NOT sndId, ((temp = #EnterInnerRadius) OR (temp = #EnterBoth)), NOT (temp = #enterOuterRadius)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2012 - ObjectGasScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_sndId_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_NOT_temp_eq_ente', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_sndId_AND_temp_eq_EnterInnerRadius_OR_temp_eq_EnterBoth_AND_NOT_temp_eq_ente': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 2014 - ObjectStreamScript', () => {
    describe('init', () => {
      test('path 1: voidp(tmpDir), voidp(tmpSpeed)', () => {
        // Conditions: voidp(tmpDir), voidp(tmpSpeed)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2014 - ObjectStreamScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidptmpDir_AND_voidptmpSpeed', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidptmpDir_AND_voidptmpSpeed': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: voidp(tmpDir), NOT voidp(tmpSpeed)', () => {
        // Conditions: voidp(tmpDir), NOT voidp(tmpSpeed)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2014 - ObjectStreamScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'voidptmpDir_AND_NOT_voidptmpSpeed', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'voidptmpDir_AND_NOT_voidptmpSpeed': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT voidp(tmpDir), voidp(tmpSpeed)', () => {
        // Conditions: NOT voidp(tmpDir), voidp(tmpSpeed)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2014 - ObjectStreamScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidptmpDir_AND_voidptmpSpeed', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidptmpDir_AND_voidptmpSpeed': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT voidp(tmpDir), NOT voidp(tmpSpeed)', () => {
        // Conditions: NOT voidp(tmpDir), NOT voidp(tmpSpeed)
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2014 - ObjectStreamScript.ls', 'init',
          [{ conditions: [{ type: 'other', key: 'NOT_voidptmpDir_AND_NOT_voidptmpSpeed', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_voidptmpDir_AND_NOT_voidptmpSpeed': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

    describe('step', () => {
      test('path 1: insideOuter', () => {
        // Conditions: insideOuter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2014 - ObjectStreamScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'insideOuter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'insideOuter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT insideOuter', () => {
        // Conditions: NOT insideOuter
        // Runtime behavior path — verify condition branching
        const contract = new LingoContract(
          'decompiled_lingo/CDdata/CDdata/casts/External/ParentScript 2014 - ObjectStreamScript.ls', 'step',
          [{ conditions: [{ type: 'other', key: 'NOT_insideOuter', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { 'NOT_insideOuter': true } });
        const result = contract.evaluate(ctx);
        // Path has no game-state transition; runtime side-effects only
        expect(result.transition).toBeNull();
      });

    });

  });

});
