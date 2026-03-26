/**
 * Tests for PathGlobals
 * Based on: ParentScript 35 - PathGlobals.ls (7 lines)
 *
 * Original Lingo:
 *   property boatPath
 *   on new me
 *     set boatPath to the moviePath    -- line 3: boatPath = moviePath (Director global)
 *     return me                         -- line 4
 *   on kill me
 *     return 0                          -- line 6: returns 0, does NOT clear boatPath
 *
 * The .ls has NO getBoatPath() or setBoatPath() methods.
 * boatPath is a direct property access only.
 */

const PathGlobals = require('../PathGlobals');

describe('PathGlobals', () => {
  // .ls line 3: on new me → set boatPath to the moviePath
  describe('new (constructor)', () => {
    it('should set boatPath to the provided moviePath', () => {
      // .ls line 3: set boatPath to the moviePath
      const pg = new PathGlobals('/game/path/');
      expect(pg.boatPath).toBe('/game/path/');
    });

    it('should accept any string as moviePath', () => {
      // .ls line 3: no validation, just assigns moviePath
      const pg = new PathGlobals('C:\\Games\\MulleMeck\\');
      expect(pg.boatPath).toBe('C:\\Games\\MulleMeck\\');
    });
  });

  // .ls line 5-6: on kill me → return 0
  describe('kill', () => {
    it('should return 0', () => {
      // .ls line 6: return 0
      const pg = new PathGlobals('/some/path/');
      expect(pg.kill()).toBe(0);
    });

    it('should NOT clear boatPath (Lingo kill only returns 0)', () => {
      // .ls line 6: only "return 0", no "set boatPath to VOID" or similar
      const pg = new PathGlobals('/some/path/');
      pg.kill();
      // In Lingo, the property is still set after kill — only the reference
      // to the object is set to 0 by the caller (set x = kill(x))
      // The boatPath should remain unchanged
      expect(pg.boatPath).toBe('/some/path/');
    });
  });

  // .ls: boatPath is a direct property — no getBoatPath/setBoatPath methods exist
  describe('property access', () => {
    it('should expose boatPath as a direct property', () => {
      const pg = new PathGlobals('/direct/');
      expect(pg.boatPath).toBe('/direct/');
    });

    it('should allow direct property mutation', () => {
      const pg = new PathGlobals('/initial/');
      pg.boatPath = '/changed/';
      expect(pg.boatPath).toBe('/changed/');
    });
  });
});
