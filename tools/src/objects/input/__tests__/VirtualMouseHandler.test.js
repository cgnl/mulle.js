/**
 * VirtualMouseHandler.test.js - TDD tests based on original Lingo
 * MovieScript 19 - virtualMouseHandler.ls (14 lines)
 *
 * The original is a MovieScript with 2 global handlers:
 *   virtualMouseDown — calls mouseMaster.mouseDown(point(the mouseH, the mouseV))
 *   virtualMouseUp  — calls mouseMaster.mouseUp(point(the mouseH, the mouseV))
 *
 * Both guard with: if objectp(gMulleGlobals) then
 * "the mouseH" / "the mouseV" are Director's global mouse coordinates,
 * not properties of this script.
 */

const VirtualMouseHandler = require('../VirtualMouseHandler');

describe('VirtualMouseHandler', () => {
  let handler;
  let mockMouseMaster;
  let mockGlobals;

  beforeEach(() => {
    mockMouseMaster = {
      mouseDown: jest.fn(),
      mouseUp: jest.fn()
    };

    mockGlobals = {
      mouseMaster: mockMouseMaster
    };

    handler = new VirtualMouseHandler(mockGlobals);
  });

  // .ls line 3-7: on virtualMouseDown
  //   if objectp(gMulleGlobals) then
  //     mouseDown(the mouseMaster of gMulleGlobals, point(the mouseH, the mouseV))
  //   end if
  describe('virtualMouseDown (.ls line 3)', () => {
    test('should call mouseMaster.mouseDown with mouse position', () => {
      handler.virtualMouseDown(100, 200);

      expect(mockMouseMaster.mouseDown).toHaveBeenCalledWith({ x: 100, y: 200 });
    });

    test('should guard when globals is null (objectp check)', () => {
      handler = new VirtualMouseHandler(null);

      expect(() => handler.virtualMouseDown(100, 200)).not.toThrow();
      expect(mockMouseMaster.mouseDown).not.toHaveBeenCalled();
    });

    test('should guard when mouseMaster is null', () => {
      mockGlobals.mouseMaster = null;
      handler = new VirtualMouseHandler(mockGlobals);

      expect(() => handler.virtualMouseDown(100, 200)).not.toThrow();
    });
  });

  // .ls line 9-13: on virtualMouseUp
  //   if objectp(gMulleGlobals) then
  //     mouseUp(the mouseMaster of gMulleGlobals, point(the mouseH, the mouseV))
  //   end if
  describe('virtualMouseUp (.ls line 9)', () => {
    test('should call mouseMaster.mouseUp with mouse position', () => {
      handler.virtualMouseUp(150, 250);

      expect(mockMouseMaster.mouseUp).toHaveBeenCalledWith({ x: 150, y: 250 });
    });

    test('should guard when globals is null (objectp check)', () => {
      handler = new VirtualMouseHandler(null);

      expect(() => handler.virtualMouseUp(150, 250)).not.toThrow();
      expect(mockMouseMaster.mouseUp).not.toHaveBeenCalled();
    });

    test('should guard when mouseMaster is null', () => {
      mockGlobals.mouseMaster = null;
      handler = new VirtualMouseHandler(mockGlobals);

      expect(() => handler.virtualMouseUp(150, 250)).not.toThrow();
    });
  });
});
