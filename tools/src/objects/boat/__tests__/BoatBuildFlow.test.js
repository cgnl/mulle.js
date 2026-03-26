const BoatHandler = require('../BoatHandler')
const BoatPart = require('../../ui/BoatPart')
const DragScript = require('../../input/DragScript')

describe('Boat build flow integration (.ls-aligned)', () => {
  let handler
  let globals
  let dir
  let sound
  let boat
  let partObj

  beforeEach(() => {
    boat = {
      getParts: jest.fn().mockReturnValue(['part1']),
      addPart: jest.fn(),
      deletePart: jest.fn(),
      clearBoat: jest.fn(),
      rebuild: jest.fn(),
      updateProperties: jest.fn(),
      getHull: jest.fn().mockReturnValue('hullPart'),
      getRudder: jest.fn().mockReturnValue('rudderPart'),
      getProperty: jest.fn().mockImplementation((key) => {
        if (key === 'LoadCapacity') return 100
        if (key === 'Stability') return 100
        return 0
      }),
      getCurrentLoadCapacity: jest.fn().mockReturnValue(50),
      getSnapInfo: jest.fn((snap, key) => {
        if (key === 'layers') return [1, 2]
        if (key === 'offset') return { x: 0, y: 0 }
        return null
      }),
      areTheseFree: jest.fn().mockReturnValue(true)
    }

    partObj = {
      getOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
      getRequiredPoints: jest.fn().mockReturnValue(['S1']),
      getNewPoints: jest.fn().mockReturnValue([['S2', 0, 0]]),
      getUseView: jest.fn().mockReturnValue('partUseView'),
      getUseView2: jest.fn().mockReturnValue(''),
      getUseViewInside: jest.fn().mockReturnValue(''),
      getUseViewInside2: jest.fn().mockReturnValue(''),
      getJunkView: jest.fn().mockReturnValue('partJunkView'),
      getSndDescription: jest.fn().mockReturnValue(''),
      getSndAttachOnBoat: jest.fn().mockReturnValue(''),
      getMaster: jest.fn().mockReturnValue(0),
      isMaster: jest.fn().mockReturnValue(false),
      isNormalpart: jest.fn().mockReturnValue(true),
      getMorphToSnap: jest.fn().mockReturnValue('part1'),
      getProperty: jest.fn().mockImplementation((key) => {
        if (key === 'weight') return 10
        if (key === 'Stability') return 10
        return 0
      }),
      isMorphPart: jest.fn().mockReturnValue(false),
      getMorphList: jest.fn().mockReturnValue([])
    }

    dir = {
      spriteList: {
        BoatStart: 20,
        DragPart: 10,
        Water: 50
      },
      _spriteMembers: {},
      go: jest.fn(),
      makeMulleTalk: jest.fn(),
      junkHandler: {
        drawParts: jest.fn(),
        dropped: jest.fn(),
        dragObject: null
      }
    }

    globals = {
      mouseH: 0,
      mouseV: 0,
      loopMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      },
      mouseMaster: {
        getToWhere: jest.fn().mockReturnValue('BoatS1'),
        addObject: jest.fn(),
        deleteObject: jest.fn()
      },
      parts: {
        getPart: jest.fn().mockReturnValue(partObj)
      },
      user: {
        getBoat: jest.fn().mockReturnValue(boat),
        addJunkPart: jest.fn()
      },
      boatViewHandler: {
        getDrawOffset: jest.fn().mockReturnValue({ x: 0, y: 0 }),
        getCurrentHull: jest.fn().mockReturnValue('hullPart')
      },
      memberResolver: {
        getMemberRect: jest.fn().mockReturnValue({ left: 0, top: 0, right: 30, bottom: 30 }),
        getRegPoint: jest.fn().mockReturnValue({ x: 0, y: 0 })
      }
    }

    sound = {
      play: jest.fn()
    }

    handler = new BoatHandler(globals, dir, sound)
  })

  test('drawParts creates real BoatPart and pickup creates real DragScript', () => {
    handler.drawParts()

    expect(handler.boatObjects.length).toBe(1)
    expect(handler.boatObjects[0]).toBeInstanceOf(BoatPart)

    handler.boatObjects[0].mouse({ dragToWhere: 'Other' }, 'down')

    expect(handler.dragObject).toBeInstanceOf(DragScript)
  })

  test('pickup to drop flow adds part back to boat through BoatHandler.dropped', () => {
    handler.drawParts()
    handler.boatObjects[0].mouse({ dragToWhere: 'Other' }, 'down')

    expect(handler.dragObject).toBeInstanceOf(DragScript)

    handler.dragObject.mouse({}, 'up')

    expect(boat.addPart).toHaveBeenCalledWith('part1')
  })

  test('sink path adds junk and transitions to Sink when overload occurs (.ls line 82)', () => {
    // Force overload: futureLoad = currentLoad - weight < 0
    boat.getCurrentLoadCapacity.mockReturnValue(0)
    partObj.getProperty.mockImplementation((key) => {
      if (key === 'weight') return 100
      if (key === 'Stability') return 0
      return 0
    })
    partObj.getMaster.mockReturnValue(99)

    handler.drawParts()
    handler.boatObjects[0].mouse({ dragToWhere: 'Other' }, 'down')
    handler.dragObject.mouse({}, 'up')

    expect(globals.user.addJunkPart).toHaveBeenCalledWith('Quay', 99, { x: 300, y: 300 })
    expect(dir.go).toHaveBeenCalledWith('Sink')
    expect(boat.addPart).not.toHaveBeenCalled()
  })

  test('morph error path returns original part to junk and redraws junk handler (.ls lines 95-97)', () => {
    globals.mouseMaster.getToWhere.mockReturnValue('BoatS1')
    partObj.isMaster.mockReturnValue(false)
    partObj.isNormalpart.mockReturnValue(false)
    partObj.getMorphToSnap.mockReturnValue('error')

    handler.drawParts()
    handler.boatObjects[0].mouse({ dragToWhere: 'Other' }, 'down')
    handler.dragObject.setMousePosition({ x: 111, y: 222 })
    handler.dragObject.mouse({}, 'up')

    expect(globals.user.addJunkPart).toHaveBeenCalledWith('Quay', 'part1', { x: 111, y: 222 })
    expect(dir.junkHandler.drawParts).toHaveBeenCalled()
    expect(boat.addPart).not.toHaveBeenCalled()
  })

  test('morph success attaches snap-specific part id to boat', () => {
    globals.mouseMaster.getToWhere.mockReturnValue('BoatS1')
    partObj.isMaster.mockReturnValue(false)
    partObj.isNormalpart.mockReturnValue(false)
    partObj.getMorphToSnap.mockReturnValue('morphS1')

    handler.drawParts()
    handler.boatObjects[0].mouse({ dragToWhere: 'Other' }, 'down')
    handler.dragObject.mouse({}, 'up')

    expect(boat.addPart).toHaveBeenCalledWith('morphS1')
    expect(boat.addPart).not.toHaveBeenCalledWith('part1')
  })

  test('drop outside boat delegates to junk handler drop', () => {
    globals.mouseMaster.getToWhere.mockReturnValue('JunkPile')

    handler.drawParts()
    handler.boatObjects[0].mouse({ dragToWhere: 'Other' }, 'down')
    handler.dragObject.setMousePosition({ x: 400, y: 410 })
    handler.dragObject.mouse({}, 'up')

    expect(dir.junkHandler.dropped).toHaveBeenCalledWith('part1', { x: 400, y: 410 })
    expect(boat.addPart).not.toHaveBeenCalled()
  })
})
