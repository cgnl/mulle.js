
const BoatPhysics = require('../BoatPhysics');
const { DIRECTION_LIST } = require('../BoatConstants');

describe('BoatPhysics Parity', () => {
    let boat;

    beforeEach(() => {
        // Mock boat object mirroring Lingo properties
        boat = {
            decimalPrec: 100,
            speed: 0,
            direction: 1,
            internalDirection: 100, // 1 * 100
            loc: { x: 32000, y: 24000 }, // 320 * 100
            velPoint: { x: 0, y: 0 },
            acceleration: 5,
            retardation: 10,
            speedList: [0, 2, 4, 6, 8, 10], // standard list
            quickProps: {
                power: 100,
                ManoeuverAbility: 50,
                Drift: 1
            },
            locHistory: [],
            cornerPoints: [],
            currentCorners: []
        };

        // Populate history
        for (let i = 0; i < 10; i++) {
            boat.locHistory.push({ x: 32000, y: 24000 });
        }
    });

    describe('calcSpeedNDir (ParentScript 34 lines 344-391)', () => {
        test('calculates speed acceleration correctly', () => {
            BoatPhysics.calcSpeedNDir(boat, 100, 0); // Full force, no steering
            expect(boat.speed).toBeCloseTo(0.1);
        });

        test('updates velocity point based on UPDATED speed', () => {
            BoatPhysics.calcSpeedNDir(boat, 100, 0);
            const dirVec = DIRECTION_LIST[0]; // Direction 1 is index 0
            const expectedVelY = dirVec.y * boat.speed / 100;
            expect(boat.velPoint.y).toBeCloseTo(expectedVelY);
            expect(boat.velPoint.y).not.toBe(0);
        });

        test('clamps speed change to acceleration limit', () => {
            boat.speed = 0;
            boat.acceleration = 5;
            BoatPhysics.calcSpeedNDir(boat, 100, 0);
            expect(boat.speed).toBeCloseTo(0.1);
        });

        test('handles steering correctly', () => {
            BoatPhysics.calcSpeedNDir(boat, 0, 10);
            expect(boat.internalDirection).toBe(150);
            expect(boat.direction).toBe(1);
        });
    });

    describe('stepback (ParentScript 34 lines 306-320)', () => {
        test('resets speed to 0 and restores location', () => {
            boat.speed = 5;
            boat.locHistory[9] = { x: 100, y: 100 };
            boat.locHistory[8] = { x: 200, y: 200 };
            BoatPhysics.stepback(boat, 2);
            expect(boat.speed).toBe(0);
            expect(boat.loc).toEqual({ x: 200, y: 200 });
        });

        test('fills future history with restored location', () => {
            boat.locHistory[8] = { x: 200, y: 200 };
            BoatPhysics.stepback(boat, 2);
            expect(boat.locHistory[9]).toEqual({ x: 200, y: 200 });
        });
    });

    describe('checkBounds (ParentScript 34 lines 428-473)', () => {
        test('clamps X to Lingo limits (10-630)', () => {
            boat.loc.x = 0;
            boat.loc.y = 24000;
            BoatPhysics.checkBounds(boat);
            expect(boat.loc.x).toBe(1000);

            boat.loc.x = 70000;
            BoatPhysics.checkBounds(boat);
            expect(boat.loc.x).toBe(63000);
        });

        test('clamps Y to Lingo limits (10-386)', () => {
            boat.loc.x = 32000;
            boat.loc.y = 0;
            BoatPhysics.checkBounds(boat);
            expect(boat.loc.y).toBe(1000);

            boat.loc.y = 50000;
            BoatPhysics.checkBounds(boat);
            expect(boat.loc.y).toBe(38600);
        });
    });

    describe('calculateInclinations (ParentScript 34 lines 593-620)', () => {
        test('calculates standard inclinations correctly', () => {
            boat.stabilities = [85, 55];
            const waveInfo = { altitude: 0, pitch: 10, roll: 20 };

            const result = BoatPhysics.calculateInclinations(boat, waveInfo, 0);

            // frontBack = 85 * 10 / 17 = 50
            expect(result.frontBack).toBeCloseTo(50);

            // side = 55 * 20 / 100 = 11
            expect(result.side).toBeCloseTo(11);
        });

        test('calculates sail force side angle correctly', () => {
            boat.stabilities = [85, 55];
            const waveInfo = { altitude: 0, pitch: 10, roll: 20 };
            const force = 50;

            const result = BoatPhysics.calculateInclinations(boat, waveInfo, force);

            // side = 55 * ((20 / 4) - (50 / 100)) / 100
            // side = 55 * (5 - 0.5) / 100 = 2.475
            expect(result.side).toBeCloseTo(2.475);
        });
    });

    describe('clampInclinations (ParentScript 34 lines 612-619)', () => {
        test('clamps heavy inclination to 2', () => {
            const sideAngle = 20; // /5 = 4
            const frontBack = 10;

            const result = BoatPhysics.clampInclinations(sideAngle, frontBack);

            // side = 20 / 5 = 4 -> clamped to 2
            expect(result.side).toBe(2);

            // frontBack = 10 -> clamped to 2
            expect(result.frontBack).toBe(2);
        });

        test('preserves small inclinations', () => {
            const sideAngle = 5; // /5 = 1
            const frontBack = 1.5;

            const result = BoatPhysics.clampInclinations(sideAngle, frontBack);

            expect(result.side).toBe(1);
            expect(result.frontBack).toBe(1.5);
        });
    });
});
