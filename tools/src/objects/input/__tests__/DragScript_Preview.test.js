
const DragScript = require('../DragScript');

describe('DragScript Strict Parity Tests (Lingo Fidelity)', () => {
    let dragScript;
    let mockReportObject;
    let mockGlobals;
    let mockDir;
    let mockSound;

    const DRAG_MEMBER = 'DragMem';
    const PREVIEW_MEMBER = 'PreviewMem';
    const PREVIEW_MEMBER2 = 'PreviewMem2';
    const DUMMY_MEMBER = 'Dummy';

    const BOAT_START_SP = 20;
    const DRAG_SP = 10;

    beforeEach(() => {
        mockReportObject = { dropped: jest.fn() };

        mockDir = {
            spriteList: {
                DragPart: DRAG_SP,
                BoatStart: BOAT_START_SP
            },
            _spriteMembers: {},
            _spriteLocations: {},
            makeMulleTalk: jest.fn()
        };

        mockGlobals = {
            mouseH: 0,
            mouseV: 0,
            loopMaster: { addObject: jest.fn(), deleteObject: jest.fn() },
            parts: {
                getPart: jest.fn().mockImplementation((id) => ({
                    getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
                    getRequiredPoints: jest.fn().mockReturnValue(id && id.includes('morph') ? ['snapX'] : ['snap1']),
                    getUseView: jest.fn().mockReturnValue(PREVIEW_MEMBER),
                    getUseView2: jest.fn().mockReturnValue(''), // Default empty
                    getSndDescription: jest.fn().mockReturnValue(''),
                    getSndAttachOnBoat: jest.fn().mockReturnValue('attachSnd'),
                    isMorphPart: jest.fn().mockReturnValue(false),
                    getMorphList: jest.fn().mockReturnValue([]),
                    isMaster: jest.fn().mockReturnValue(false),
                    getMaster: jest.fn().mockReturnValue(null)
                }))
            },
            user: {
                getBoat: jest.fn().mockReturnValue({
                    areTheseFree: jest.fn().mockReturnValue(true),
                    getSnapInfo: jest.fn((snap, key) => {
                        // Default Lingo behavior simulation
                        if (key === 'layers') return [1, 2]; // Standard layers
                        if (key === 'offset') return { x: 0, y: 0 };
                        return null;
                    })
                })
            },
            boatViewHandler: {
                getDrawOffset: jest.fn().mockReturnValue({ x: 100, y: 100 }), // Fixed offset for easy math
                getCurrentHull: jest.fn().mockReturnValue('hull1')
            },
            memberResolver: {
                getMemberRect: jest.fn(),
                getRegPoint: jest.fn()
            }
        };

        mockSound = { play: jest.fn() };

        // Reset sprite state simulation
        mockDir._spriteMembers[DRAG_SP] = DRAG_MEMBER;
    });

    afterEach(() => {
        if (dragScript) dragScript.kill();
    });

    // Helper to create basic script
    const createScript = (snapList = {}) => {
        const script = new DragScript(mockReportObject, 'part1', DRAG_MEMBER, 'Quay', mockGlobals, mockDir, mockSound);
        if (Object.keys(snapList).length > 0) {
            script.dragSnapList = snapList;
        }
        return script;
    };

    /**
     * Lingo Logic: #enter
     * set the member of sprite SP to member "Dummy"
     * set the member of sprite useViewSP to tmpUseViewMember
     * set the loc of sprite useViewSP to currentOffset
     */
    test('ENTER: Should hide DragSprite and Show PreviewSprite (Layer 1)', () => {
        dragScript = createScript({ 'Boatsnap1': 'part1' });

        // Act: Enter snap zone
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');

        // Assert 1: Drag sprite SP hidden
        expect(mockDir._spriteMembers[DRAG_SP]).toBe(DUMMY_MEMBER);

        // Assert 2: Preview sprite member set
        // useViewSP = BoatStart(20) - 1 + layer(1) = 20
        const expectedUseViewSP = BOAT_START_SP;
        expect(dragScript.useViewSP).toBe(expectedUseViewSP);
        expect(mockDir._spriteMembers[expectedUseViewSP]).toBe(PREVIEW_MEMBER);

        // Assert 3: Preview sprite location set
        // 315, 210 + defaults(0) + drawOffset(100,100) = 415, 310
        expect(mockDir._spriteLocations[expectedUseViewSP]).toEqual({ x: 415, y: 310 });
    });

    /**
     * Lingo Logic: #enter with useView2
     * ...
     * if length(tmpPic) > 0 then
     *   set useView2SP to tmpStartSP + getAt(tmpUseLayers, 2)
     *   set the member of sprite useView2SP to tmpUseView2Member
     *   set the loc of sprite useView2SP to currentOffset
     */
    test('ENTER: Should Show PreviewSprite2 if exists (Layer 2)', () => {
        // Setup part with 2nd view
        mockGlobals.parts.getPart.mockImplementation(() => ({
            getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
            getRequiredPoints: jest.fn().mockReturnValue(['snap1']),
            getUseView: jest.fn().mockReturnValue(PREVIEW_MEMBER),
            getUseView2: jest.fn().mockReturnValue(PREVIEW_MEMBER2), // HAS 2nd view
            getSndAttachOnBoat: jest.fn().mockReturnValue(''),
            isMorphPart: jest.fn().mockReturnValue(false),
            getMorphList: jest.fn().mockReturnValue([]),
            isMaster: jest.fn().mockReturnValue(false),
            getMaster: jest.fn().mockReturnValue(null)
        }));

        dragScript = createScript({ 'Boatsnap1': 'part1' });

        // Act
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');

        // Assert
        const expectedUseView2SP = BOAT_START_SP + 1; // Layer 2
        expect(dragScript.useView2SP).toBe(expectedUseView2SP);
        expect(mockDir._spriteMembers[expectedUseView2SP]).toBe(PREVIEW_MEMBER2);
        expect(mockDir._spriteLocations[expectedUseView2SP]).toEqual({ x: 415, y: 310 });
    });

    /**
     * Lingo Logic: #Leave (when count(insideList) = 0)
     * ...
     * if useViewSP > 0 then
     *   set the member of sprite useViewSP to member "Dummy"
     *   set useViewSP to 0
     *   ...
     * set the member of sprite SP to dragMember
     */
    test('LEAVE: Should Hide Preview and Restore DragSprite', () => {
        dragScript = createScript({ 'Boatsnap1': 'part1' });

        // Enter first to set state
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
        const usedSP = dragScript.useViewSP;

        // Act: Leave
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');

        // Assert 1: Preview sprite hidden
        expect(mockDir._spriteMembers[usedSP]).toBe(DUMMY_MEMBER);
        expect(dragScript.useViewSP).toBe(0);

        // Assert 2: Drag sprite restored
        expect(mockDir._spriteMembers[DRAG_SP]).toBe(DRAG_MEMBER);
    });

    /**
     * Lingo Logic: #Leave (when count(insideList) > 0 / Switch)
     * ...
     * if not (tmpOldPartID = partId) then
     *   ...
     *   if useViewSP > 0 then
     *     set the member of sprite useViewSP to member "Dummy"
     *   ...
     *   set the member of sprite SP to member "Dummy"  <-- CRITICAL PARITY CHECK
     *   set the member of sprite useViewSP to tmpUseViewMember
     */
    test('LEAVE (Switch): Should Switch Preview and KEEP DragSprite HIDDEN', () => {
        // Setup overlap
        dragScript = createScript({ 'Boatsnap1': 'part1', 'Boatsnap2': 'part2' });

        // Setup part2 distinct member
        mockGlobals.parts.getPart.mockImplementation((id) => ({
            getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
            getRequiredPoints: jest.fn().mockReturnValue(['snap1']),
            getUseView: jest.fn().mockReturnValue(id === 'part2' ? 'Part2Mem' : PREVIEW_MEMBER),
            getUseView2: jest.fn().mockReturnValue(''),
            getSndAttachOnBoat: jest.fn().mockReturnValue(''),
            isMorphPart: jest.fn().mockReturnValue(false),
            getMorphList: jest.fn().mockReturnValue([]),
            isMaster: jest.fn().mockReturnValue(false),
            getMaster: jest.fn().mockReturnValue(null)
        }));

        // Enter Boat1
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
        // Enter Boat2 (overlap)
        dragScript.mouse({ dragToWhere: 'Boatsnap2' }, 'enter');

        // Verify initial state (Boat1 active)
        expect(dragScript.partId).toBe('part1');
        expect(mockDir._spriteMembers[DRAG_SP]).toBe(DUMMY_MEMBER);

        // Act: Leave Boat1 (should switch to Boat2)
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');

        // Assert 1: Part ID switched
        expect(dragScript.partId).toBe('part2');

        // Assert 2: Drag sprite STILL HIDDEN (Dummy)
        expect(mockDir._spriteMembers[DRAG_SP]).toBe(DUMMY_MEMBER);

        // Assert 3: Preview sprite updated to Part2
        // We assume same layer (1) -> same SP
        const sp = dragScript.useViewSP;
        expect(mockDir._spriteMembers[sp]).toBe('Part2Mem');
    });

    /**
     * Lingo Logic: #Leave (Switch)
     * Lingo explicitly sets SP to Dummy AGAIN during switch logic:
     * line 199: set the member of sprite SP to member "Dummy"
     * This ensures that even if logic drifted, SP is forcibly hidden.
     */
    test('LEAVE (Switch): Explicitly enforces SP=Dummy', () => {
        dragScript = createScript({ 'Boatsnap1': 'part1', 'Boatsnap2': 'part2' });
        // Same setup...
        mockGlobals.parts.getPart.mockImplementation((id) => ({
            getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
            getRequiredPoints: jest.fn().mockReturnValue(['snap1']),
            getUseView: jest.fn().mockReturnValue(id === 'part2' ? 'Part2Mem' : PREVIEW_MEMBER),
            getUseView2: jest.fn().mockReturnValue(''),
            getSndAttachOnBoat: jest.fn().mockReturnValue(''),
            isMorphPart: jest.fn().mockReturnValue(false),
            getMorphList: jest.fn().mockReturnValue([]),
            isMaster: jest.fn().mockReturnValue(false),
            getMaster: jest.fn().mockReturnValue(null)
        }));

        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'enter');
        dragScript.mouse({ dragToWhere: 'Boatsnap2' }, 'enter');

        // PRE-CONDITION: HACK - force SP to be visible to verify the logic HIDES it again
        mockDir._spriteMembers[DRAG_SP] = 'VISIBLE_HACK';

        // Act: Leave Boat1
        dragScript.mouse({ dragToWhere: 'Boatsnap1' }, 'Leave');

        // Assert: Logic should have re-set it to Dummy
        expect(mockDir._spriteMembers[DRAG_SP]).toBe(DUMMY_MEMBER);
    });

});
