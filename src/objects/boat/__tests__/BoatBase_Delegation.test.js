
import BoatBase from '../BoatBase';
import * as BoatPhysics from '../BoatPhysics';
import * as BoatDamage from '../BoatDamage';
import * as BoatEnergy from '../BoatEnergy';
import DepthChecker from '../DepthChecker';
import DummyBoatAncestor from '../DummyBoatAncestor';

// Mock dependencies
const mockDeps = {
    boatProperties: {},
    user: {
        lookUpInventory: jest.fn(),
        setInInventory: jest.fn()
    },
    weatherRenderer: {
        waves: {
            getTopoInfo: jest.fn().mockReturnValue([0, 0, 0])
        },
        wind: {
            getVelPoint: jest.fn().mockReturnValue({ x: 0, y: 0 })
        }
    },
    world: {
        getNewMapId: jest.fn().mockReturnValue(null) // Mock: No neighbor map
    }
};

// Mock modules
jest.mock('../BoatPhysics', () => ({
    calcSpeedNDir: jest.fn(),
    stepback: jest.fn(),
    checkBounds: jest.fn(),
    calculateInclinations: jest.fn().mockReturnValue({ side: 50, frontBack: 10 }),
    clampInclinations: jest.fn().mockReturnValue({ inclinations: [0, 0], side: 0, frontBack: 0 })
}));

jest.mock('../BoatDamage', () => ({
    checkCapsize: jest.fn(),
    crashed: jest.fn()
}));

jest.mock('../BoatEnergy', () => ({
    consumeEnergy: jest.fn()
}));

// Manual mock for DepthChecker
const mockCheckBorders = jest.fn();
jest.mock('../DepthChecker', () => {
    return jest.fn().mockImplementation(() => ({
        checkBorders: mockCheckBorders,
        checkDepth: jest.fn(),
        setDepth: jest.fn()
    }));
});

jest.mock('../DummyBoatAncestor');

describe('BoatBase Delegation', () => {
    let boat;

    beforeEach(() => {
        jest.clearAllMocks();
        mockCheckBorders.mockReturnValue(null); // Default to returning null
        boat = new BoatBase(mockDeps);
    });

    test('calcSpeedNDir delegates to BoatPhysics', () => {
        boat.calcSpeedNDir(100, 10);
        expect(BoatPhysics.calcSpeedNDir).toHaveBeenCalledWith(boat, 100, 10);
    });

    test('stepback delegates to BoatPhysics', () => {
        boat.stepback(5);
        expect(BoatPhysics.stepback).toHaveBeenCalledWith(boat, 5);
    });

    test('checkBorders delegates to BoatPhysics.checkBounds when no transition', () => {
        // Setup checkBorders to return a border hit
        mockCheckBorders.mockReturnValue([1, 0]);

        if (boat.checkBorders) {
            boat.checkBorders();
            expect(BoatPhysics.checkBounds).toHaveBeenCalledWith(boat);
        }
    });

    test('loop delegates capsize check to BoatDamage', () => {
        boat.loop();
        expect(BoatDamage.checkCapsize).toHaveBeenCalledWith(boat, 50);
    });

    test('loop delegates energy consumption to BoatEnergy', () => {
        boat.loop();
        // BoatPhysics mock returns frontBack: 10
        expect(BoatEnergy.consumeEnergy).toHaveBeenCalledWith(boat, 10);
    });

    test('loop delegates collision to BoatDamage.crashed', () => {
        // Mock DepthChecker to return 'Hit'
        // default mockCheckBorders is null

        // We need to mock checkDepth on the instance.
        // properties like boat.depthChecker.checkDepth are mocked in the factory.
        // But we need to access the specific mock instance attached to boat.
        boat.depthChecker.checkDepth.mockReturnValue('Hit');

        boat.speed = 50;
        boat.loop();

        expect(BoatDamage.crashed).toHaveBeenCalledWith(boat, 50);
    });
});
