// Auto-generated Lingo behavioral parity tests for folder: StartCD
// Source: decompiled_lingo/StartCD/
// DO NOT EDIT — regenerate with: python3 tools/parity/generate_tests.py
//
// JS scene files: (no direct JS mapping)

const { LingoContract, createMockContext } = require('./helpers');

describe('StartCD Lingo behavioral parity', () => {
  describe('MovieScript 3 - start', () => {
    describe('getCDPath', () => {
      test('path 1: (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh")', () => {
        // Conditions: (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh"), (status(myInstance) = 0)
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 2: (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh")', () => {
        // Conditions: (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh"), NOT (status(myInstance) = 0)
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 3: (string(0.0) = "a"), checkValidCD, NOT (the platform contains "Macintosh")', () => {
        // Conditions: (string(0.0) = "a"), checkValidCD, NOT (the platform contains "Macintosh")
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 4: (string(0.0) = "a"), NOT checkValidCD', () => {
        // Conditions: (string(0.0) = "a"), NOT checkValidCD
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh")', () => {
        // Conditions: NOT (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh"), (status(myInstance) = 0)
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh")', () => {
        // Conditions: NOT (string(0.0) = "a"), checkValidCD, (the platform contains "Macintosh"), NOT (status(myInstance) = 0)
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT (string(0.0) = "a"), checkValidCD, NOT (the platform contains "Macintosh")', () => {
        // Conditions: NOT (string(0.0) = "a"), checkValidCD, NOT (the platform contains "Macintosh")
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 8: NOT (string(0.0) = "a"), NOT checkValidCD', () => {
        // Conditions: NOT (string(0.0) = "a"), NOT checkValidCD
        // getCDPath is a utility that locates the CD-ROM drive
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'getCDPath',
          [{ conditions: [{ type: 'other', key: 'getCDPath_conditions', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { getCDPath_conditions: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

    describe('start', () => {
      test('path 1: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 2: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 3: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 4: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 5: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 6: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 7: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 8: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 9: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 10: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 11: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 12: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 13: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 14: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 15: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 16: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 17: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 18: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 19: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 20: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 21: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), (the platform contains "Windows"), (the platform contains "Macintosh")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 22: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), (the platform contains "Windows"), NOT (the platform contains "Macintosh")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 23: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 24: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 25: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 26: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 27: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 28: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 29: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), NOT checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 30: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), NOT checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 31: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 32: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 33: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 34: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 35: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 36: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 37: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 38: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 39: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 40: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 41: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 42: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 43: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 44: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 45: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 46: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 47: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 48: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 49: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 50: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), (the colorQD = 1), NOT (the colorDepth < requireColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 51: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), (the platform contains "Windows"), (the platform contains "Macintosh")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 52: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), (the platform contains "Windows"), NOT (the platform contains "Macintosh")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 53: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 54: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 55: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 56: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 57: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 58: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 59: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), NOT checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 60: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1) → go(1, mov)', () => {
        // Conditions: (the platform contains "Macintosh"), NOT (the colorQD = 0), NOT (the colorQD = 1), NOT (the platform contains "Windows"), NOT checkSetupMac
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 61: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 62: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 63: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 64: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 65: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 66: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 67: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 68: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 69: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 70: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 71: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 72: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 73: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 74: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 75: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 76: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 77: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 78: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 79: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 80: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 81: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 82: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 83: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 84: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 85: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 86: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 87: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 88: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 89: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 90: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 91: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 92: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 93: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 94: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 95: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 96: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 97: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 98: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 99: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 100: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 101: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 102: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 103: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 104: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 105: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 106: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 107: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 108: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 109: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 110: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 111: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 112: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 113: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 114: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 115: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 116: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 117: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 118: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 119: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 120: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), (the colorDepth < requireColor), NOT (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 121: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 122: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 123: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 124: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 125: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 126: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 127: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 128: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor) → go(1, mov)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 129: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), (the colorDepth > bestColor), NOT (the platform contains "Windows")
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

      test('path 130: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor)', () => {
        // Conditions: NOT (the platform contains "Macintosh"), NOT (the platform contains "16"), NOT (the colorDepth < requireColor), NOT (the colorDepth > bestColor)
        // All paths through start() end with go(1, mov)
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 3 - start.ls', 'start',
          [{ conditions: [], actions: [{ type: 'go', target: 'movie_start' }], children: [], elseBranch: null }]
        );
        const result = contract.evaluate(createMockContext());
        expect(result.transition).toBe('movie_start');
      });

    });

  });

  describe('MovieScript 4 - Install MAC', () => {
    describe('installMac', () => {
      test('path 1: NOT objectp(myXObj), (bootSpace < needHDspace)', () => {
        // Conditions: NOT objectp(myXObj), (bootSpace < needHDspace)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: NOT objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1), (count(MacFolders) > 0)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 3: NOT objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: NOT objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 4: NOT objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: NOT objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 5: NOT objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: NOT objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1), (count(MacFolders) > 0)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 6: NOT objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: NOT objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 7: NOT objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: NOT objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 8: objectp(myXObj), (bootSpace < needHDspace)', () => {
        // Conditions: objectp(myXObj), (bootSpace < needHDspace)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 9: objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1), (count(MacFolders) > 0)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 10: objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 11: objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: objectp(myXObj), NOT (bootSpace < needHDspace), (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 12: objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1), (count(MacFolders) > 0)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 13: objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 14: objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1)', () => {
        // Conditions: objectp(myXObj), NOT (bootSpace < needHDspace), NOT (offset(bootdisk, projectPath) <> 1), NOT (count(MacFolders) > 0), (result <> 0) AND (result <> -48)
        // installMac is a Mac-only file copy utility; no game-state transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/MovieScript 4 - Install MAC.ls', 'installMac',
          [{ conditions: [{ type: 'other', key: 'installMac_path', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { installMac_path: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 5 - GSystem', () => {
    describe('new', () => {
      test('path 1: (string(0.0) = "a")', () => {
        // Conditions: (string(0.0) = "a")
        // GSystem constructor returns self; no transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/ParentScript 5 - GSystem.ls', 'new',
          [{ conditions: [{ type: 'other', key: 'string_0_0_eq_a', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { string_0_0_eq_a: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

      test('path 2: NOT (string(0.0) = "a")', () => {
        // Conditions: NOT (string(0.0) = "a")
        // GSystem constructor returns self; no transition
        const contract = new LingoContract(
          'decompiled_lingo/StartCD/StartCD/casts/Internal/ParentScript 5 - GSystem.ls', 'new',
          [{ conditions: [{ type: 'other', key: 'string_0_0_eq_a', negated: false }], actions: [], children: [], elseBranch: null }]
        );
        const ctx = createMockContext({ other: { string_0_0_eq_a: true } });
        const result = contract.evaluate(ctx);
        expect(result.transition).toBeNull();
      });

    });

  });

  describe('ParentScript 16 - AlertFunction', () => {
  });

});
