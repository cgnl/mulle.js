
const DepthChecker = require('../DepthChecker').default;

describe('DepthChecker Strict Parity Tests (Lingo Fidelity)', () => {
    let depthChecker;
    let mockProvider;

    beforeEach(() => {
        mockProvider = jest.fn();
        depthChecker = new DepthChecker(mockProvider);
    });

    /**
     * Lingo: setTopology (Lines 15-22)
     * Concatenation of member text and member text + "-2"
     */
    test('TOPOLOGY: Should concatenate member data correctly', () => {
        const memberName = 'Map1';
        mockProvider.mockImplementation((name) => {
            if (name === 'Map1') return 'AAAA';
            if (name === 'Map1-2') return 'BBBB';
            return null;
        });

        depthChecker.setTopology(memberName);

        expect(mockProvider).toHaveBeenCalledWith('Map1');
        expect(mockProvider).toHaveBeenCalledWith('Map1-2');
        expect(depthChecker.Topology).toBe('AAAABBBB');
        expect(depthChecker.active).toBe(true);
    });

    test('TOPOLOGY: Should disable on specific dummy member', () => {
        depthChecker.setTopology('30t999v0');
        expect(depthChecker.active).toBe(false);
        expect(depthChecker.Topology).toBe('');
    });

    /**
     * Lingo: checkDepth (Lines 67-94)
     * Logic: Char index = tmpH + ((tmpV - 1) * topoWidth)
     * Checks charCode. 0=Hit, <4=Shallow/TooShallow
     */
    test('CHECK: Should detect Hit (Land)', () => {
        // Setup Map: 10x10 (topoWidth overrides to 316 in constructor, but we can verify logic)
        // We'll trust the internal math uses 316.
        // We need to place a char code 0 at a specific coordinate.

        // Let's force a smaller width for easier testing or just calc the index.
        depthChecker.topoWidth = 10;
        const width = 10;

        // Construct topology string.
        // We want a hit at 5, 5.
        // Index (1-based Lingo) = 5 + (4 * 10) = 45.
        // JS Index (0-based) = 44.

        // Create buffer of safe water (char code 10)
        let buffer = new Array(100).fill(String.fromCharCode(10));
        buffer[44] = String.fromCharCode(0); // HIT

        depthChecker.Topology = buffer.join('');
        depthChecker.active = true;

        // checkDepth takes argLoc (Screen coords). 
        // Logic: (argLoc - 4,4) / 2.
        // To get 5,5 internal:
        // (X - 4)/2 = 5 => X - 4 = 10 => X = 14
        // (Y - 4)/2 = 5 => Y = 14

        const result = depthChecker.checkDepth({ x: 14, y: 14 });

        expect(result).toBe('Hit');
    });

    test('CHECK: Should detect Too Shallow', () => {
        depthChecker.topoWidth = 10;
        depthChecker.setDepth(10); // setDepth(10) -> depth level 3 (argDepth < 16)
        // depth level 3.

        // We need a spot with value < 3. Say 2.
        // Spot 2,2.
        // Index: 2 + (1*10) = 12 (1-based) -> 11 (0-based).

        let buffer = new Array(100).fill(String.fromCharCode(10));
        buffer[11] = String.fromCharCode(2); // Level 2 (Shallow for required 3)

        depthChecker.Topology = buffer.join('');
        depthChecker.active = true;

        // Screen coords for 2,2:
        // (X-4)/2=2 => X=8.
        const result = depthChecker.checkDepth({ x: 8, y: 8 });

        // Logic: tmpInfo (2) < depth (3) -> return 1
        expect(result).toBe(1);
    });

    test('CHECK: Should detect Perfect Depth (Shallow warning)', () => {
        depthChecker.topoWidth = 10;
        depthChecker.setDepth(5); // <10 -> level 2.

        // We need spot with value 2.
        let buffer = new Array(100).fill(String.fromCharCode(10));
        buffer[11] = String.fromCharCode(2);

        depthChecker.Topology = buffer.join('');
        depthChecker.active = true;

        const result = depthChecker.checkDepth({ x: 8, y: 8 });

        // Logic: tmpInfo (2) == depth (2) -> return 'Shallow'
        expect(result).toBe('Shallow');
    });

});
