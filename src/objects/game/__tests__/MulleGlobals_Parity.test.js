
const MulleGlobals = require('../MulleGlobals');

describe('MulleGlobals Strict Parity Tests (Lingo Fidelity)', () => {
    let mulleGlobals;
    let mockDir;
    let mockMemberData;

    beforeEach(() => {
        // Mock Director / Member interface with valid JSON
        mockMemberData = {
            'ExternalPartsDB': '[{"id": 1, "name": "ExtPart"}]',
            'WorldsDB': '[{"id": 1, "name": "World1"}]',
            'MapsDB': '[{"id": 1, "name": "Map1"}]',
            'PartsDB': '[{"id": 1, "name": "Part1"}]',
            'UsersDB': '[{"name": "User1"}]',
            'User1DB': '[{"id": 1, "data": "UserData"}]'
        };

        mockDir = {
            getMemberText: jest.fn((name) => mockMemberData[name] || ''),
            setMemberText: jest.fn(),
            saveCastLib: jest.fn(),
            // Mock Xtra support
            getXtras: jest.fn().mockReturnValue(['FileXtra', 'NetXtra'])
        };
    });

    // Helper to instantiate with mocked sub-object factories using subclassing
    const createGlobals = () => {
        // Factory for verified spies
        const createSpy = (name) => ({
            name,
            fromList: jest.fn(),
            toList: jest.fn().mockReturnValue([{ mock: 'list' }]),
            kill: jest.fn(),
            getUserId: jest.fn().mockReturnValue(1),
            addObject: jest.fn()
        });

        // Subclass to override factory methods that are called in constructor
        class TestMulleGlobals extends MulleGlobals {
            _createParts() { return createSpy('Parts'); }
            _createUsers() { return createSpy('Users'); }
            _createUser() { return createSpy('User'); }
            _createExternalParts() { return createSpy('ExternalParts'); }
            _createLoopMaster() { return createSpy('LoopMaster'); }
            _createMouseMaster() { return createSpy('MouseMaster'); }
            _createWorlds() { return createSpy('Worlds'); }
            _createMaps() { return createSpy('Maps'); }
            _createWeather() { return createSpy('Weather'); }
            _createRadioHandler() { return createSpy('RadioHandler'); }
            _createJunkViewHandler() { return createSpy('JunkView'); }
            _createBoatViewHandler() { return createSpy('BoatView'); }
            _createLevelHandler() { return createSpy('LevelHandler'); }
        }

        return new TestMulleGlobals(mockDir);
    };

    /**
     * Lingo: on new me
     * Checks correct initialization of all properties
     */
    test('NEW: Should initialize all properties with compliant defaults', () => {
        mulleGlobals = createGlobals();

        // Offsets
        expect(mulleGlobals.enterShelf).toBe('Shelf1'); // Lingo: #Shelf1 (string representation)
        expect(mulleGlobals.hullBackInsideOffset).toBe(6);
        expect(mulleGlobals.hullFrontInsideOffset).toBe(45);
        expect(mulleGlobals.HullBackOffset).toBe(12);
        expect(mulleGlobals.HullFrontOffset).toBe(46);
        expect(mulleGlobals.rudderBackOffset).toBe(1);
        expect(mulleGlobals.rudderFrontOffset).toBe(13);

        // Flags
        expect(mulleGlobals.gotNewHull).toBe(false); // Lingo: 0
        expect(mulleGlobals.gotNewParts).toBe(false); // Lingo: 0

        // FirstTimeList
        expect(mulleGlobals.firstTimeList).toEqual({
            ShipYard: true,
            SecondShipYard: true,
            Yard: true,
            Quay: true,
            Shelf: true,
            BluePrint: true
        });

        // Xtras (Dynamic loop in Lingo)
        // We expect it to call the director xtra provider
        expect(mockDir.getXtras).toHaveBeenCalled();
        expect(mulleGlobals.availableXtras).toContain('FileXtra');
    });

    /**
     * Lingo: on init me
     * Checks data loading from members
     */
    test('INIT: Should load data from Members using fromList', () => {
        mulleGlobals = createGlobals();
        mulleGlobals.init();

        // Verify sub-objects created
        // Note: subclasses _createWeather is called in init()
        // But createGlobals() creates a NEW subclass instance.
        // Wait, MulleGlobals.init() calls this._createWeather(). 
        // Since 'this' is TestMulleGlobals, it calls our spy factory. Verified.

        // Verify data loading
        // Lingo: fromList(externalParts, value(the text of member "ExternalPartsDB"))
        expect(mockDir.getMemberText).toHaveBeenCalledWith('ExternalPartsDB');
        expect(mulleGlobals.externalParts.fromList).toHaveBeenCalledWith(expect.anything());

        // Lingo: fromList(worlds, value(the text of member "WorldsDB"))
        expect(mockDir.getMemberText).toHaveBeenCalledWith('WorldsDB');
        expect(mulleGlobals.worlds.fromList).toHaveBeenCalled();

        // Lingo: fromList(maps, value(the text of member "MapsDB"))
        expect(mockDir.getMemberText).toHaveBeenCalledWith('MapsDB');
        expect(mulleGlobals.maps.fromList).toHaveBeenCalled();

        // Lingo: fromList(users, value(the text of member "UsersDB"))
        expect(mockDir.getMemberText).toHaveBeenCalledWith('UsersDB');
        expect(mulleGlobals.users.fromList).toHaveBeenCalled();

        // Lingo: addObject(loopMaster, mouseMaster)
        expect(mulleGlobals.loopMaster.addObject).toHaveBeenCalledWith(mulleGlobals.mouseMaster);
    });

    /**
     * Lingo: on save me
     * Checks data writing to members
     */
    test('SAVE: Should write state back to Members', () => {
        mulleGlobals = createGlobals();
        // Setup mock user ID via the spy we inserted
        // The createGlobal spy factory returns objects where getUserId returns 1.

        // Pre-check: Simulate existing member check
        mockDir.getMemberText.mockImplementation((name) => {
            if (name === 'User1DB') return 'exists';
            return '';
        });

        mulleGlobals.save();

        // Lingo: set the text of member "UsersDB" ... to string(toList(users))
        expect(mulleGlobals.users.toList).toHaveBeenCalled();
        expect(mockDir.setMemberText).toHaveBeenCalledWith('UsersDB', expect.stringContaining('mock'));

        // Lingo: set the text of member "User" & ID & "DB" ... to string(toList(user))
        expect(mulleGlobals.user.toList).toHaveBeenCalled();
        expect(mockDir.setMemberText).toHaveBeenCalledWith('User1DB', expect.stringContaining('mock'));

        // Lingo: save(castLib "data")
        expect(mockDir.saveCastLib).toHaveBeenCalledWith('data');
    });

});
