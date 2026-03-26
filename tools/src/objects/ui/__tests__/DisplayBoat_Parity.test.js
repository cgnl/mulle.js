
const DisplayBoat = require('../DisplayBoat').default; // Note: export default

describe('DisplayBoat Strict Parity Tests (Lingo Fidelity)', () => {
    let displayBoat;
    let mockMaster;

    beforeEach(() => {
        mockMaster = {
            loc: { x: 1000, y: 2000 },
            direction: 0
        };
        displayBoat = new DisplayBoat(mockMaster);
    });

    /**
     * Lingo: calcPicToShow (Lines 41-47)
     * Formula: xx = tmpDir + (80 * sideMult) + (16 * frontBackMult)
     * tmpDir = 1 + (dir mod 16)
     */
    test('CALC: Should calculate correct frame index for neutral state', () => {
        // Dir 0 -> tmpDir = 1
        // Side 0 -> index 2 -> value 0 -> 80*0 = 0
        // FrontBack 0 -> index 2 -> value 0 -> 16*0 = 0
        // Result: 1
        const result = displayBoat.calcPicToShow(0, [0, 0]);
        expect(result).toBe(1);
    });

    test('CALC: Should handle direction wrapping', () => {
        // Dir 16 -> tmpDir = 1 + (16 mod 16) = 1
        const result = displayBoat.calcPicToShow(16, [0, 0]);
        expect(result).toBe(1);

        // Dir 15 -> tmpDir = 1 + 15 = 16
        const result2 = displayBoat.calcPicToShow(15, [0, 0]);
        expect(result2).toBe(16);
    });

    test('CALC: Should handle max inclination (Roll +2, Pitch +2)', () => {
        // Side +2 -> index 4 -> value 4 -> 80*4 = 320
        // FrontBack +2 -> index 4 -> value 3 -> 16*3 = 48
        // Dir 0 -> 1
        // Total: 320 + 48 + 1 = 369
        const result = displayBoat.calcPicToShow(0, [2, 2]);
        expect(result).toBe(369);
    });

    test('CALC: Should handle min inclination (Roll -2, Pitch -2)', () => {
        // Side -2 -> index 0 -> value 2 -> 80*2 = 160
        // FrontBack -2 -> index 0 -> value 2 -> 16*2 = 32
        // Dir 0 -> 1
        // Total: 160 + 32 + 1 = 193
        const result = displayBoat.calcPicToShow(0, [-2, -2]);
        expect(result).toBe(193);
    });

    /**
     * Lingo: display (Lines 49-61)
     * Position: point(0, -tmpAlt / 10) + (loc / decimalPrec)
     */
    test('DISPLAY: Should calculate correct position', () => {
        // Loc: 1000, 2000
        // Precision: 100
        // Alt: 50 -> -5

        // Expected X: 1000/100 + 0 = 10
        // Expected Y: 2000/100 + (-5) = 20 - 5 = 15

        const result = displayBoat.display([50, 0, 0]);

        expect(result.position).toEqual({ x: 10, y: 15 });
    });

    test('DISPLAY: Should return null when hidden', () => {
        displayBoat.show(0);
        const result = displayBoat.display([0, 0, 0]);
        expect(result).toBeNull();
    });

});
