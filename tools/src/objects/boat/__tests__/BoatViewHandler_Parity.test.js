
const BoatViewHandler = require('../BoatViewHandler');

describe('BoatViewHandler Strict Parity Tests (Lingo Fidelity)', () => {
    let boatViewHandler;
    let mockGlobals;
    let mockDirector;
    let mockBoat;

    beforeEach(() => {
        // Mock Director for member access
        mockDirector = {
            getMemberText: jest.fn((name) => {
                if (name === 'WoodHullsDB') return '[719, 720, 721, 722]'; // Simplified list
                if (name === 'MetalHullsDB') return '[1, 716, 717, 718, 45]';
                if (name === 'RuddersDB') return '[818, 820]';
                return '';
            })
        };

        mockBoat = {
            getParts: jest.fn().mockReturnValue([]),
            getCurrentLoadCapacity: jest.fn().mockReturnValue(500),
            getProperty: jest.fn((prop) => prop === 'LoadCapacity' ? 1000 : 0),
            replacePart: jest.fn(),
            rebuild: jest.fn()
        };

        mockGlobals = {
            director: mockDirector,
            user: {
                getBoat: jest.fn().mockReturnValue(mockBoat)
            }
        };
    });

    const createHandler = () => {
        return new BoatViewHandler(mockGlobals);
    };

    test('NEW: Should load Hull and Rudder lists from Members', () => {
        boatViewHandler = createHandler();

        // Lingo: set woodList to value(the text of member "WoodHullsDB")
        expect(mockDirector.getMemberText).toHaveBeenCalledWith('WoodHullsDB');
        expect(boatViewHandler.woodList).toEqual([719, 720, 721, 722]);

        // Lingo: set metalList to value(the text of member "MetalHullsDB")
        expect(mockDirector.getMemberText).toHaveBeenCalledWith('MetalHullsDB');
        expect(boatViewHandler.metalList).toEqual([1, 716, 717, 718, 45]);

        // Lingo: set rudderList to value(the text of member "RuddersDB")
        expect(mockDirector.getMemberText).toHaveBeenCalledWith('RuddersDB');
        expect(boatViewHandler.rudderList).toEqual([818, 820]);
    });

    /**
     * Lingo: getDrawOffset logic (lines 120-171)
     */
    describe('getDrawOffset', () => {
        test('Quay: Large Hull calculation (Line 130-132)', () => {
            boatViewHandler = createHandler();
            // Mock Large Hull (719 is in woodList/largeList)
            // Mock Load Ratio 0.5 (500/1000)
            const hullID = 719;

            // Formula: 45 * (1 - (current/total)) = 45 * (1 - 0.5) = 22.5
            const result = boatViewHandler.getDrawOffset('Quay', [hullID]);

            expect(result).toEqual({ x: 0, y: 22.5 });
        });

        test('Quay: Medium Hull calculation (Line 134-136)', () => {
            boatViewHandler = createHandler();
            // Mock Medium Hull
            // Need to ensure mediumList is populated (it is hardcoded in Lingo/JS)
            boatViewHandler.mediumList = [45];
            const hullID = 45;

            // Formula: 5 + (35 * 0.5) = 5 + 17.5 = 22.5
            // x: -25
            const result = boatViewHandler.getDrawOffset('Quay', [hullID]);
            expect(result).toEqual({ x: -25, y: 22.5 });
        });

        test('ShipYard: Returns offset from hullOffsetList (Line 146-155)', () => {
            boatViewHandler = createHandler();
            // 720 is 2nd in woodList ([719, 720...]) -> index 1
            // hullOffsetList[1] is point(390, 137)
            const hullID = 720;

            const result = boatViewHandler.getDrawOffset('ShipYard', [hullID]);

            expect(result).toEqual({ x: 390, y: 137 });
        });
    });

});
