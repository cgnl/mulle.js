/**
 * @fileoverview MulleGlobals - Global game state container
 * Based on: ParentScript 5 - MulleGlobals.ls
 * 
 * MulleGlobals is the central container for all global game state,
 * including parts, users, handlers, and game-wide configuration.
 */

/**
 * MulleGlobals class - central game state container
 * 
 * Lingo properties:
 *   parts, users, user, externalParts, loopMaster, mouseMaster,
 *   junkViewHandler, boatViewHandler, levelHandler, radioHandler,
 *   enterShelf, hullBackInsideOffset, hullFrontInsideOffset,
 *   HullBackOffset, HullFrontOffset, rudderBackOffset, rudderFrontOffset,
 *   firstTimeList, gotNewHull, gotNewParts, worlds, world, maps,
 *   WhereFrom, weather, availableXtras
 */
import MouseHandler from '../input/MouseHandler'

class MulleGlobals {
  /**
   * Create the global state container
   * Lingo: on new me
   */
  /**
   * Create the global state container
   * Lingo: on new me
   * @param {Object} director - Interface to Director/Game engine
   */
  constructor(director) {
    this.director = director || null;

    // Create manager objects (simplified stubs for now)
    // Lingo: set parts to new(script "Parts")
    this.parts = this._createParts();

    // Lingo: set users to new(script "Users")
    this.users = this._createUsers();

    // Lingo: set user to new(script "User")
    this.user = this._createUser();

    // Lingo: set externalParts to new(script "externalParts")
    this.externalParts = this._createExternalParts();

    // Lingo: set loopMaster to new(script "LoopHandler")
    this.loopMaster = this._createLoopMaster();

    // Lingo: set mouseMaster to new(script "MouseHandler")
    this.mouseMaster = this._createMouseMaster();

    // Lingo: set junkViewHandler to new(script "JunkViewHandler")
    this.junkViewHandler = this._createJunkViewHandler();

    // Lingo: set boatViewHandler to new(script "BoatViewHandler")
    this.boatViewHandler = this._createBoatViewHandler();

    // Lingo: set levelHandler to new(script "LevelHandler")
    this.levelHandler = this._createLevelHandler();

    // Lingo: set worlds to new(script "Worlds")
    this.worlds = this._createWorlds();

    // Lingo: set maps to new(script "Maps")
    this.maps = this._createMaps();

    // Hull offset configuration
    // Lingo: set enterShelf to #Shelf1
    this.enterShelf = 'Shelf1';

    // Lingo: set hullBackInsideOffset to 6
    this.hullBackInsideOffset = 6;

    // Lingo: set hullFrontInsideOffset to 45
    this.hullFrontInsideOffset = 45;

    // Lingo: set HullBackOffset to 12
    this.HullBackOffset = 12;

    // Lingo: set HullFrontOffset to 46
    this.HullFrontOffset = 46;

    // Lingo: set rudderBackOffset to 1
    this.rudderBackOffset = 1;

    // Lingo: set rudderFrontOffset to 13
    this.rudderFrontOffset = 13;

    // New parts/hull flags
    // Lingo: set gotNewHull to 0
    this.gotNewHull = false;

    // Lingo: set gotNewParts to 0
    this.gotNewParts = false;

    // First time visit tracking
    // Lingo: set firstTimeList to [#ShipYard: 1, #SecondShipYard: 1, ...]
    this.firstTimeList = {
      ShipYard: true,
      SecondShipYard: true,
      Yard: true,
      Quay: true,
      Shelf: true,
      BluePrint: true
    };

    // Available xtras (plugins)
    // Lingo: lines 25-29 (loop through xtras)
    this.availableXtras = '';
    if (this.director && this.director.getXtras) {
      const xtras = this.director.getXtras();
      if (Array.isArray(xtras)) {
        this.availableXtras = xtras.join('\r') + '\r';
      }
    }

    // Runtime state
    this.weather = null;
    this.radioHandler = null;
    this.world = null;
    this.WhereFrom = null;
  }

  /**
   * Initialize runtime components
   * Lingo: on init me
   */
  init() {
    // Lingo: set weather to new(script "Weather")
    this.weather = this._createWeather();

    // Lingo: set radioHandler to new(script "RadioHandler")
    this.radioHandler = this._createRadioHandler();

    // Load databases
    // Lingo: fromList(externalParts, value(the text of member "ExternalPartsDB"))
    this._loadFromMember(this.externalParts, 'ExternalPartsDB');

    // Lingo: fromList(worlds, value(the text of member "WorldsDB"))
    this._loadFromMember(this.worlds, 'WorldsDB');

    // Lingo: fromList(maps, value(the text of member "MapsDB"))
    this._loadFromMember(this.maps, 'MapsDB');

    // Lingo: fromList(parts, value(the text of member "PartsDB"))
    this._loadFromMember(this.parts, 'PartsDB');

    // Lingo: fromList(users, value(the text of member "UsersDB"))
    this._loadFromMember(this.users, 'UsersDB');

    // Add mouseMaster to loop
    // Lingo: addObject(loopMaster, mouseMaster)
    if (this.loopMaster && this.mouseMaster) {
      this.loopMaster.addObject(this.mouseMaster);
    }
  }

  /**
   * Clean up all global state
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    // Kill all objects
    if (this.weather) {
      this.weather = this._killObject(this.weather);
    }

    this.worlds = this._killObject(this.worlds);
    this.maps = this._killObject(this.maps);
    this.parts = this._killObject(this.parts);
    this.users = this._killObject(this.users);
    this.user = this._killObject(this.user);
    this.externalParts = this._killObject(this.externalParts);
    this.loopMaster = this._killObject(this.loopMaster);
    this.mouseMaster = this._killObject(this.mouseMaster);
    this.junkViewHandler = this._killObject(this.junkViewHandler);
    this.boatViewHandler = this._killObject(this.boatViewHandler);
    this.levelHandler = this._killObject(this.levelHandler);

    return null;
  }

  /**
   * Save game state
   * Lingo: on save me
   */
  save() {
    // Lingo: set the text of member "UsersDB" of castLib "data" to string(toList(users))
    if (this.users && this.users.toList) {
      const usersData = this.users.toList();
      if (this.director) {
        this.director.setMemberText('UsersDB', JSON.stringify(usersData));
      }
    }

    // Lingo: set the text of member "User" & ID & "DB" ...
    if (this.user && this.user.toList) {
      const userId = this.user.getUserId ? this.user.getUserId() : '';
      const userData = this.user.toList();
      if (this.director) {
        const memberName = 'User' + userId + 'DB';

        // Check if member exists (using getMemberText as proxy)
        // Lingo: if the number of member tempMember > -1
        if (this.director.getMemberText(memberName) !== null) {
          this.director.setMemberText(memberName, JSON.stringify(userData));
        } else {
          console.warn("Save member not found: " + memberName + ". Game not saved!");
        }
      }
    }

    // Lingo: save(castLib "data")
    if (this.director && this.director.saveCastLib) {
      this.director.saveCastLib('data');
    }
  }

  /** @private */
  _loadFromMember(obj, memberName) {
    if (obj && obj.fromList && this.director && this.director.getMemberText) {
      const text = this.director.getMemberText(memberName);
      if (text) {
        // In Lingo 'value()' parses string to data. Here we assume JSON or similar.
        try {
          // If it looks like Lingo list, we might need a parser, but for now we assume 
          // the director interface returns a usable structure or JSON string
          const data = (typeof text === 'string' && (text.startsWith('[') || text.startsWith('{')))
            ? JSON.parse(text)
            : text;
          obj.fromList(data);
        } catch (e) {
          console.error(`Failed to load ${memberName}`, e);
        }
      }
    }
  }

  // Getters and setters

  getWhereFrom() {
    return this.WhereFrom;
  }

  setWhereFrom(where) {
    this.WhereFrom = where;
  }

  getWorld() {
    return this.world;
  }

  setWorld(world) {
    this.world = world;
  }

  getEnterShelf() {
    return this.enterShelf;
  }

  setEnterShelf(shelf) {
    this.enterShelf = shelf;
  }

  getGotNewHull() {
    return this.gotNewHull;
  }

  setGotNewHull(value) {
    this.gotNewHull = value;
  }

  getGotNewParts() {
    return this.gotNewParts;
  }

  setGotNewParts(value) {
    this.gotNewParts = value;
  }

  isFirstTime(location) {
    return this.firstTimeList[location] || false;
  }

  setFirstTime(location, value) {
    this.firstTimeList[location] = value;
  }

  // Factory methods for creating sub-objects (can be overridden for testing)

  /** @private */
  _createParts() {
    return {
      kill: () => null,
      fromList: () => { },
      toList: () => []
    };
  }

  /** @private */
  _createUsers() {
    return {
      kill: () => null,
      fromList: () => { },
      toList: () => []
    };
  }

  /** @private */
  _createUser() {
    return {
      kill: () => null,
      getUserId: () => 1,
      toList: () => []
    };
  }

  /** @private */
  _createExternalParts() {
    return {
      kill: () => null,
      fromList: () => { }
    };
  }

  /** @private */
  _createLoopMaster() {
    if (this.director && this.director.mulle && this.director.mulle.loopMaster) {
      return this.director.mulle.loopMaster;
    }

    const objects = [];
    return {
      kill: () => null,
      addObject: (obj) => objects.push(obj),
      deleteObject: (obj) => {
        const idx = objects.indexOf(obj);
        if (idx >= 0) objects.splice(idx, 1);
      },
      hasObject: (obj) => objects.includes(obj)
    };
  }

  /** @private */
  _createMouseMaster() {
    if (this.director && this.director.mulle && this.director.mulle.cursor) {
      return new MouseHandler(this.director.mulle.cursor, this.director);
    }

    return {
      kill: () => null
    };
  }

  /** @private */
  _createJunkViewHandler() {
    return {
      kill: () => null
    };
  }

  /** @private */
  _createBoatViewHandler() {
    return {
      kill: () => null
    };
  }

  /** @private */
  _createLevelHandler() {
    return {
      kill: () => null
    };
  }

  /** @private */
  _createWorlds() {
    return {
      kill: () => null,
      fromList: () => { }
    };
  }

  /** @private */
  _createMaps() {
    return {
      kill: () => null,
      fromList: () => { }
    };
  }

  /** @private */
  _createWeather() {
    return {
      kill: () => null
    };
  }

  /** @private */
  _createRadioHandler() {
    return {
      kill: () => null
    };
  }

  /** @private */
  _killObject(obj) {
    if (obj && obj.kill) {
      obj.kill();
    }
    return null;
  }
}

module.exports = MulleGlobals;
