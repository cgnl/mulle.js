// Auto-generated Lingo behavioral parity tests for folder: LBstart
// Source: decompiled_lingo/LBstart/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: (no direct JS mapping)

const { LingoContract, createMockContext } = require('./helpers');

describe('LBstart Lingo behavioral parity', () => {
  describe('BehaviorScript 1', () => {
    describe('mouseUp', () => {
      test('path 1: unconditional → go("Leave")', () => {
        // Expected behavioral actions:
        // Action: go("Leave")

        // Expects scene transition: go(Leave)
        const contract = new LingoContract(
          'decompiled_lingo/LBstart/LBstart/casts/Internal/BehaviorScript 1.ls', 'mouseUp',
          [{ conditions: [], actions: [{ type: 'go', target: 'Leave' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('Leave');
      });

    });

  });

  describe('BehaviorScript 3', () => {
    describe('exitFrame', () => {
      test('path 1: unconditional → go(1, "10")', () => {
        // Expected behavioral actions:
        // Action: go(1, "10")

        // Expects scene transition: go(1) — goes to frame 1 in movie "10"
        const contract = new LingoContract(
          'decompiled_lingo/LBstart/LBstart/casts/Internal/BehaviorScript 3.ls', 'exitFrame',
          [{ conditions: [], actions: [{ type: 'go', target: '1' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('1');
      });

    });

  });

  describe('BehaviorScript 95', () => {
    describe('exitFrame', () => {
      test('path 1: (soundBusy(2) = 1) → go(the frame)', () => {
        // Condition: (soundBusy(2) = 1)
        // Expected behavioral actions:
        // Action: go(the frame)

        // Expects scene transition: go(the frame)
        const contract = new LingoContract(
          'decompiled_lingo/LBstart/LBstart/casts/Internal/BehaviorScript 95.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy_2_eq_1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { soundBusy_2_eq_1: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBe('frame');
      });

      test('path 2: NOT (soundBusy(2) = 1)', () => {
        // Condition: NOT (soundBusy(2) = 1)
        // No action taken — sound finished, frame advances naturally

        const contract = new LingoContract(
          'decompiled_lingo/LBstart/LBstart/casts/Internal/BehaviorScript 95.ls', 'exitFrame',
          [{
            conditions: [{ type: 'other', key: 'soundBusy_2_eq_1', negated: false }],
            actions: [{ type: 'goFrame' }],
            children: [],
            elseBranch: null,
          }]
        );
        const ctx = createMockContext({ other: { soundBusy_2_eq_1: false } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

});
