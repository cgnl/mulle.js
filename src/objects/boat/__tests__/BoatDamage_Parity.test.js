
import { crashed, checkCapsize } from '../BoatDamage';

// Mock console.log
global.console.log = jest.fn();

describe('BoatDamage Parity', () => {
    let boat;
    let mockPlayAudio;
    let mockSetVol;
    let mockSay;
    let mockWaitToGoHome;

    beforeEach(() => {
        mockPlayAudio = jest.fn().mockReturnValue(123); // Sound ID
        mockSetVol = jest.fn();
        mockSay = jest.fn();
        mockWaitToGoHome = jest.fn();

        boat = {
            game: {
                time: { now: 1000 },
                mulle: {
                    playAudio: mockPlayAudio,
                    setVol: mockSetVol,
                    say: mockSay
                }
            },
            quickProps: {
                Material: 1, // Wood
                weight: 50   // Heavy (<100)
            },
            lastCrashTime: 0,
            crashCooldown: 500,
            inFreeZone: false,
            Durability: 1000,
            waitToGoHome: mockWaitToGoHome
        };
    });

    describe('crashed (Collision)', () => {
        test('Plays correct sound for Wood/Heavy/Small Damage', () => {
            // Material 1, Weight 50 (Heavy), Speed 50 (Damage < 100)
            // Lookup: 1 -> Heavy -> Index 0 -> value 1 -> "05e001v0"
            // BUT code has HARDCODE OVERRIDE to "05e008v1" (Line 368 in BoatBase.ls / Line 72 in JS)

            crashed(boat, 50);

            expect(mockPlayAudio).toHaveBeenCalledWith('05e008v1');
            expect(mockSetVol).toHaveBeenCalledWith(123, 60); // Vol 60 for small damage
        });

        test('Plays correct sound for Metal/Light/Big Damage', () => {
            boat.quickProps.Material = 2; // Metal
            boat.quickProps.weight = 150; // Light (>=100)

            // Damage > 300
            // Lookup: 2 -> Light -> Index 2 -> value 12
            // BUT code has HARDCODE OVERRIDE to "05e008v1"

            crashed(boat, 350);

            expect(mockPlayAudio).toHaveBeenCalledWith('05e008v1');
            expect(mockSetVol).toHaveBeenCalledWith(123, 90); // Vol 90 for big damage
        });

        test('Reduces durability and triggers crash if <= 0', () => {
            boat.Durability = 50;
            crashed(boat, 60); // Damage 60 > 50

            expect(boat.Durability).toBe(-10);
            expect(mockSay).toHaveBeenCalledWith({ type: 'crash' }, expect.objectContaining({ callback: 'GoHomeTow' }));
            expect(mockWaitToGoHome).toHaveBeenCalled();
        });

        test('Ignores damage in FreeZone', () => {
            boat.inFreeZone = true;
            crashed(boat, 100);
            expect(boat.Durability).toBe(1000); // Unchanged
        });
    });

    describe('checkCapsize', () => {
        test('Capsizes if side angle > 30 (Any Level)', () => {
            // Lingo: if (abs(side) > 30) then capsize
            boat.level = 1;

            checkCapsize(boat, 31);

            expect(mockSay).toHaveBeenCalledWith({ type: 'Capsize' }, expect.objectContaining({ callback: 'GoHomeCapsize' }));
            expect(mockWaitToGoHome).toHaveBeenCalled();
        });

        test('Warns LurchHard if side angle > 27', () => {
            boat.level = 3;
            checkCapsize(boat, 28);
            expect(mockSay).toHaveBeenCalledWith({ type: 'LurchHard' }, expect.anything());
            expect(mockWaitToGoHome).not.toHaveBeenCalled();
        });

        test('Warns LurchEasy if side angle > 23', () => {
            boat.level = 6;
            checkCapsize(boat, 24);
            expect(mockSay).toHaveBeenCalledWith({ type: 'LurchEasy' }, expect.anything());
            expect(mockWaitToGoHome).not.toHaveBeenCalled();
        });

        test('Does not capsize or warn if angle within limit', () => {
            boat.level = 1;
            checkCapsize(boat, 23); // Exact limit
            expect(mockSay).not.toHaveBeenCalled();
            expect(mockWaitToGoHome).not.toHaveBeenCalled();
        });
    });
});
