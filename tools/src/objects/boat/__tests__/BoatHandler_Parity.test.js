
const BoatHandler = require('../BoatHandler');

describe('BoatHandler Strict Parity Tests (Lingo Fidelity)', () => {
    let boatHandler;
    let mockGlobals;
    let mockDir;
    let mockSound;
    let mockBoat;
    let mockParts;
    let mockUser;
    let mockMouseMaster;

    beforeEach(() => {
        mockBoat = {
            clearBoat: jest.fn(),
            deletePart: jest.fn(),
            rebuild: jest.fn(),
            getParts: jest.fn().mockReturnValue([]),
            updateProperties: jest.fn(),
            getProperty: jest.fn((prop) => {
                if (prop === 'LoadCapacity') return 1000;
                if (prop === 'Stability') return 100;
                return 0;
            }),
            getCurrentLoadCapacity: jest.fn().mockReturnValue(500),
            addPart: jest.fn(),
            getHull: jest.fn().mockReturnValue('HullID')
        };

        mockParts = {
            getPart: jest.fn((id) => ({
                getJunkView: jest.fn().mockReturnValue('JunkPic'),
                getSndAttachOnBoat: jest.fn().mockReturnValue('Snd'),
                getMaster: jest.fn().mockReturnValue(null), // Default no master
                isMaster: jest.fn().mockReturnValue(false),
                isNormalpart: jest.fn().mockReturnValue(true),
                getProperty: jest.fn((prop) => {
                    if (prop === 'weight') return 10;
                    if (prop === 'Stability') return 10;
                    return 0;
                })
            }))
        };

        mockUser = {
            getBoat: jest.fn().mockReturnValue(mockBoat),
            addJunkPart: jest.fn()
        };

        mockMouseMaster = {
            getToWhere: jest.fn().mockReturnValue('Boat1')
        };

        mockGlobals = {
            user: mockUser,
            parts: mockParts,
            mouseMaster: mockMouseMaster,
            boatViewHandler: { getDrawOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }) }
        };

        mockDir = {
            spriteList: { Water: 100 },
            _spriteMembers: {},
            makeMulleTalk: jest.fn(),
            go: jest.fn(),
            junkHandler: { dropped: jest.fn(), drawParts: jest.fn() }
        };

        mockSound = { play: jest.fn() };
    });

    const createHandler = () => {
        return new BoatHandler(mockGlobals, mockDir, mockSound);
    };

    /**
     * Lingo: pickedUp (Lines 38-56)
     * Verify Master ID resolution
     */
    test('PICKUP: Should resolve Master ID if defined', () => {
        boatHandler = createHandler();
        const subPartId = 'SubPart';
        const masterId = 'MasterPart';

        // Mock part with master
        mockParts.getPart.mockImplementation((id) => ({
            name: id,
            getJunkView: () => 'Pic',
            getSndAttachOnBoat: () => 'Snd',
            getMaster: () => masterId // SubPart returns MasterID
        }));

        // Mock _createDragScript to spy on args
        boatHandler._createDragScript = jest.fn();

        boatHandler.pickedUp(subPartId);

        // Verify DragScript initialized with MasterID (Line 49/54)
        expect(boatHandler._createDragScript).toHaveBeenCalledWith(
            expect.anything(),
            masterId, // Should be masterId, not subPartId
            expect.anything(),
            expect.anything()
        );
    });

    /**
     * Lingo: dropped - Morph Logic (Lines 63-68)
     */
    test('DROP: Should morph part if dropped on specific snap', () => {
        boatHandler = createHandler();
        const partId = 'MorphablePart';
        const morphResultId = 'MorphedPart';

        // Setup: Dropping on Boat snap 'XY' (BoatXY)
        mockMouseMaster.getToWhere.mockReturnValue('BoatXY');

        // Mock part that is NOT master and NOT normal (triggers morph check)
        const mockMorphPart = {
            isMaster: () => false,
            isNormalpart: () => false,
            getMorphToSnap: jest.fn().mockReturnValue(morphResultId), // Returns new ID
            getProperty: () => 10 // Safe weight
        };
        mockParts.getPart.mockReturnValue(mockMorphPart);

        boatHandler.dropped(partId, { x: 0, y: 0 });

        // Verify getMorphToSnap called with 'XY' (chars 5-6)
        expect(mockMorphPart.getMorphToSnap).toHaveBeenCalledWith('XY');

        // Verify boat.addPart called with MORPHED ID
        expect(mockBoat.addPart).toHaveBeenCalledWith(morphResultId);
    });

    /**
     * Lingo: dropped - Sink Logic (Lines 76-82)
     */
    test('DROP: Should sink if Load or Stability < 0', () => {
        boatHandler = createHandler();
        const partId = 'HeavyPart';

        // Mock part that makes load negative
        // CurrentLoad is 500. Part weight 600. Future = -100.
        mockParts.getPart.mockReturnValue({
            isMaster: () => true,
            isNormalpart: () => true,
            getProperty: (prop) => prop === 'weight' ? 600 : 0,
            getMaster: () => null
        });

        boatHandler.dropped(partId, { x: 0, y: 0 });

        // Verify Go("Sink") called
        expect(mockDir.go).toHaveBeenCalledWith('Sink');

        // Verify part NOT added
        expect(mockBoat.addPart).not.toHaveBeenCalled();
    });

    /**
     * Lingo: dropped - Warnings (Lines 84-90)
     */
    test('DROP: Should warn if nearing limits (Mutually Exclusive)', () => {
        boatHandler = createHandler();
        const partId = 'Part';

        // Load Limit default is 1000/10 = 100.
        // CurrentLoad 500. Future must be <= 100 to warn?
        // Wait: Lingo: tmpLoadLimit = Capacity/10.
        // If futureLoad <= tmpLoadLimit then warn.

        // Case 1: Load Warning
        // Capacity 1000. Limit 100.
        // Current 110. Part 20. Future 90. 90 <= 100. True.

        mockBoat.getCurrentLoadCapacity.mockReturnValue(110);
        mockParts.getPart.mockReturnValue({
            isMaster: () => true,
            isNormalpart: () => true,
            getProperty: (prop) => prop === 'weight' ? 20 : 0
        });

        boatHandler.dropped(partId, { x: 0, y: 0 });

        expect(mockDir.makeMulleTalk).toHaveBeenCalledWith('04d048v0'); // Load warning
    });

});
