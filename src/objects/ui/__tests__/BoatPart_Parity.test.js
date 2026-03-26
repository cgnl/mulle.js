
const BoatPart = require('../BoatPart');
const MouseObject = require('../../input/MouseObject');

// Mock MouseObject to verify constructor arguments
jest.mock('../../input/MouseObject');

describe('BoatPart Strict Parity Tests (Lingo Fidelity)', () => {
    let boatPart;
    let mockGlobals;
    let mockDir;
    let mockReportObject;
    let mockBoat;
    let mockPartObj;

    const HULL_FRONT_OFFSET = 46; // From MulleGlobals
    const HULL_BACK_OFFSET = 12;

    beforeEach(() => {
        MouseObject.mockClear();

        mockReportObject = {
            pickedUp: jest.fn(),
            dragObject: { dragSnapList: { Boate1: 1 } } // Default drag object with snap
        };

        mockBoat = {
            getHull: jest.fn().mockReturnValue('HullID'),
            getRudder: jest.fn().mockReturnValue('RudderID'),
            getSnapInfo: jest.fn().mockReturnValue({ layers: [1, 2], offset: { x: 0, y: 0 } }),
            areTheseFree: jest.fn().mockReturnValue(true)
        };

        mockPartObj = {
            getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
            getUseView: jest.fn().mockReturnValue('UseViewMem'),
            getUseView2: jest.fn().mockReturnValue('UseView2Mem'),
            getUseViewInside: jest.fn().mockReturnValue('InsideMem'),
            getUseViewInside2: jest.fn().mockReturnValue('Inside2Mem'),
            getRequiredPoints: jest.fn().mockReturnValue(['Snap1']),
            getNewPoints: jest.fn().mockReturnValue(['Snap1'])
        };

        mockDir = {
            spriteList: { BoatStart: 20, Water: 100 },
            _spriteMembers: {},
            junkHandler: { dragObject: null }
        };

        mockGlobals = {
            HullFrontOffset: HULL_FRONT_OFFSET,
            HullBackOffset: HULL_BACK_OFFSET,
            hullFrontInsideOffset: 45,
            hullBackInsideOffset: 6,
            user: { getBoat: jest.fn().mockReturnValue(mockBoat) },
            parts: { getPart: jest.fn().mockReturnValue(mockPartObj) },
            memberResolver: {
                getMemberRect: jest.fn().mockReturnValue({ left: 0, top: 0, right: 10, bottom: 10 }),
                getRegPoint: jest.fn().mockReturnValue({ x: 0, y: 0 })
            }
        };
    });

    const createPart = (id, offset) => {
        return new BoatPart(id, offset || { x: 0, y: 0 }, mockReportObject, mockGlobals, mockDir);
    };

    /**
     * Lingo: on new me (Regular Part)
     * Lines 44-48: Create mouse object if free
     */
    test('NEW: Regular Part creates correct MouseObject', () => {
        const id = 'RegularPart'; // Not Hull
        mockBoat.getHull.mockReturnValue('HullID');

        createPart(id);

        expect(MouseObject).toHaveBeenCalledTimes(2); // View1 + View2 (setupRegularPart loops)

        // precise parity check for args: cursor Grabbable/Grabbed
        const callArgs = MouseObject.mock.calls[0];
        const properties = callArgs[3];

        expect(properties.cursor).toEqual({ rollOver: 'Grabable', drag: 'Grabbed' });
        expect(properties.isDragObject).toBe(true);
        expect(properties.report).toBe(true);
    });

    /**
     * Lingo: on new me (Hull Part)
     * Lines 84-88: Create clickable mouse object for hull
     */
    test('NEW: Hull Part creates correct Clickable MouseObject', () => {
        const id = 'HullID';
        mockBoat.getHull.mockReturnValue(id);

        createPart(id);

        // Hull setup creates MouseObject for INSIDE view interaction
        const callArgs = MouseObject.mock.calls[0];
        const properties = callArgs[3];

        expect(properties.cursor).toEqual({ rollOver: 'Clickable' });
        expect(properties.dragToWhere).toBe('Hull');
        expect(properties.report).toBe(true);
        // Verify Lingo check: #Leave: [#Pic: ..., #insideCheck: 1]
        expect(properties.Leave).toMatchObject({ insideCheck: 1 });
    });

    /**
     * Lingo: on mouse me, argObj, #down (Regular Part)
     * Lines 126-134
     */
    test('MOUSE DOWN: Regular Part hides sprites and picks up', () => {
        const id = 'RegularPart';
        boatPart = createPart(id);

        // Mock sprites existing
        boatPart.useViewSP = 21;
        boatPart.useView2SP = 22;
        mockDir._spriteMembers[21] = 'Visible';
        mockDir._spriteMembers[22] = 'Visible';

        // Act
        boatPart.mouse({ dragToWhere: 'NotHull' }, 'down');

        // Assert: Sprites validly hidden to "Dummy" (Lines 130-132)
        expect(mockDir._spriteMembers[21]).toBe('Dummy');
        expect(mockDir._spriteMembers[22]).toBe('Dummy');

        // Assert: pickedUp called (Line 134)
        expect(mockReportObject.pickedUp).toHaveBeenCalledWith(id);
    });

    /**
     * Lingo: on mouse me, argObj, #enter (Hull Part)
     * Lines 142-154
     */
    test('MOUSE ENTER: Hull Part hides HullFront and Water if snap exists', () => {
        const id = 'HullID';
        boatPart = createPart(id);

        // Calculate HullFront SP: Start(19) + Offset(46) = 65 (approx)
        const hullFrontSP = boatPart.startSP + HULL_FRONT_OFFSET;
        const waterSP = 100;

        mockDir._spriteMembers[hullFrontSP] = 'HullVis';
        mockDir._spriteMembers[waterSP] = 'WaterVis';

        // Act
        boatPart.mouse({ dragToWhere: 'Hull' }, 'enter');

        // Assert: Sprites hidden (Lines 151-152)
        expect(mockDir._spriteMembers[hullFrontSP]).toBe('Dummy');
        expect(mockDir._spriteMembers[waterSP]).toBe('Dummy');
    });

    /**
     * Lingo: on mouse me, argObj, #Leave (Hull Part)
     * Line 156
     */
    test('MOUSE LEAVE: Hull Part restores Water sprite', () => {
        const id = 'HullID';
        boatPart = createPart(id);
        const waterSP = 100;

        mockDir._spriteMembers[waterSP] = 'Dummy';

        // Act
        boatPart.mouse({ dragToWhere: 'Hull' }, 'Leave');

        // Assert: Water restored to specific member (Line 156)
        expect(mockDir._spriteMembers[waterSP]).toBe('04b003v0');
    });

});
