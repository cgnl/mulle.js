
import { consumeEnergy, recoverStamina, fallbackPropulsion } from '../BoatEnergy';
import { PropulsionType } from '../BoatConstants';

// Mock console.log to avoid clutter
global.console.log = jest.fn();

describe('BoatEnergy Parity', () => {
    let boat;

    beforeEach(() => {
        boat = {
            speed: 10,
            motorSpeed: 10, // Throttle position (0-100) used for fuel consumption
            currentPropulsion: PropulsionType.MOTOR,
            fuelConsumptionRate: 15, // Example rate
            fuelCurrent: 1000,
            fuelMax: 1000,
            fuelWarningThreshold: 0.1,
            fuelWarningShown: false,

            hasOars: true,
            hasSail: false,
            staminaConsumptionRate: 5,
            staminaRecoveryRate: 10,
            staminaCurrent: 100,
            staminaMax: 100,
            staminaWarningThreshold: 0.2,
            staminaWarningShown: false,

            mulleHunger: 500,
            mulleHungerSpeed: 3,

            buffaSick: 1000,
            seaLevel: 1, // Default calm
            swayHistory: [10, 10, 10, 10, 10], // Default sway history

            deps: {
                user: {
                    inventory: {
                        Fishingrod: { nr: 1 }
                    },
                    isInInventory: jest.fn().mockReturnValue(true)
                }
            },
            game: {
                mulle: {
                    user: {
                        inventory: {
                            Fishingrod: { nr: 1 }
                        },
                        isInInventory: jest.fn().mockReturnValue(true),
                        setInInventory: jest.fn()
                    },
                    say: jest.fn(),
                    playAudio: jest.fn()
                }
            },
            // Mock methods called by BoatEnergy
            waitToGoHome: jest.fn()
        };
    });

    describe('Propulsion Consumption', () => {
        test('Motor consumes fuel proportional to speed / 30', () => {
            // Lingo: tmpFuel = tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
            // speed=10, rate=15 => 150 / 30 = 5 consumption
            consumeEnergy(boat);
            expect(boat.fuelCurrent).toBe(995);
        });

        test('Oar consumes stamina proportional to speed', () => {
            boat.currentPropulsion = PropulsionType.OAR;
            // speed=10, rate=5 => 50 consumption
            consumeEnergy(boat);
            expect(boat.staminaCurrent).toBe(50);
        });

        test('Sail consumes nothing', () => {
            boat.currentPropulsion = PropulsionType.SAIL;
            consumeEnergy(boat);
            expect(boat.fuelCurrent).toBe(1000);
            expect(boat.staminaCurrent).toBe(100);
        });
    });

    describe('Hunger (Belly)', () => {
        test('Hunger decreases by mulleHungerSpeed', () => {
            // Lingo: set mulleHunger to mulleHunger - mulleHungerSpeed
            boat.mulleHunger = 500;
            boat.mulleHungerSpeed = 3;
            consumeEnergy(boat);
            expect(boat.mulleHunger).toBe(497);
        });

        test('Hunger triggers fishing rod check at 0', () => {
            boat.mulleHunger = 3; // Will drop to 0
            boat.mulleHungerSpeed = 3;
            consumeEnergy(boat);
            // Check if playAudio was called - implying successful fishing rod use
            // In Lingo lines 573-575: plays sound "05d013v0" or "05d014v0"
            expect(boat.game.mulle.playAudio).toHaveBeenCalled();
            expect(boat.game.mulle.user.isInInventory).toHaveBeenCalledWith('Fishingrod');
        });
    });

    describe('Seasickness (Pills)', () => {
        test('BuffaSick decreases based on sway difference when seaLevel >= 4', () => {
            // Lingo: set buffaSick to buffaSick - (tmpDiff / 13)
            // tmpDiff = abs(frontBack - lastSway)

            boat.seaLevel = 4;
            boat.buffaSick = 1000;

            // Mock sway history on boat
            boat.swayHistory = [10, 10, 10, 10, 10]; // lastSway = 10
            const currentFrontBack = 36; // diff = 26

            // We pass currentFrontBack as second argument
            consumeEnergy(boat, currentFrontBack);

            // diff = 26, dec = 26 / 13 = 2
            // 1000 - 2 = 998
            expect(boat.buffaSick).toBe(998);
        });
    });

    describe('Stamina Recovery', () => {
        test('Stamina recovers when not rowing', () => {
            // boat hasOars=true
            boat.staminaCurrent = 50;
            boat.staminaMax = 100;
            boat.staminaRecoveryRate = 10;

            recoverStamina(boat);

            expect(boat.staminaCurrent).toBe(60);
        });

        test('Stamina capped at max', () => {
            boat.staminaCurrent = 95;
            boat.staminaMax = 100;
            boat.staminaRecoveryRate = 10;

            recoverStamina(boat);

            expect(boat.staminaCurrent).toBe(100);
        });
    });

    describe('Fallback Propulsion', () => {
        test('Fallback to Sail if available', () => {
            boat.hasSail = true;
            boat.currentPropulsion = PropulsionType.MOTOR; // e.g. out of fuel

            fallbackPropulsion(boat);

            expect(boat.currentPropulsion).toBe(PropulsionType.SAIL);
        });

        test('Fallback to Oars if Sail not available but Oars are', () => {
            boat.hasSail = false;
            boat.hasOars = true;
            boat.staminaCurrent = 100;
            boat.currentPropulsion = PropulsionType.MOTOR;

            fallbackPropulsion(boat);

            expect(boat.currentPropulsion).toBe(PropulsionType.OAR);
        });

        test('Fallback to None/Drift if nothing available', () => {
            boat.hasSail = false;
            boat.hasOars = false;
            boat.currentPropulsion = PropulsionType.MOTOR;

            fallbackPropulsion(boat);

            expect(boat.currentPropulsion).toBe(PropulsionType.NONE);
        });
    });
});
