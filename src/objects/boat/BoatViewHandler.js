/**
 * @fileoverview BoatViewHandler - Boat view management
 * Based on: ParentScript 30 - BoatViewHandler.ls
 * 
 * BoatViewHandler manages boat display, hull types, materials,
 * and draw offsets for different view contexts.
 */

/**
 * BoatViewHandler class - manages boat view and display
 * 
 * Lingo properties:
 *   hullsList, woodList, metalList, hullOffsetList, rudderList,
 *   largeList, mediumList, smallList
 */
class BoatViewHandler {
  /**
   * Create a new BoatViewHandler
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals;

    // Helper to load list from member
    const loadList = (memberName, defaultList) => {
      if (this.globals && this.globals.director && this.globals.director.getMemberText) {
        const text = this.globals.director.getMemberText(memberName);
        if (text) {
          try {
            // Assume JSON for JS port
            const data = (typeof text === 'string' && text.trim().startsWith('['))
              ? JSON.parse(text)
              : text;
            if (Array.isArray(data)) return data;
          } catch (e) {
            console.error(`Failed to load ${memberName}`, e);
          }
        }
      }
      return defaultList || [];
    };

    // Lingo: set woodList to value(the text of member "WoodHullsDB")
    this.woodList = loadList('WoodHullsDB', [719, 720, 721, 722, 726, 727, 728, 729, 92, 734, 735, 736]);

    // Lingo: set metalList to value(the text of member "MetalHullsDB")
    this.metalList = loadList('MetalHullsDB', [1, 716, 717, 718, 45, 723, 724, 725, 730, 731, 732, 733]);

    // Hull offsets for ShipYard view
    // Lingo: set hullOffsetList to [point(390, 167), point(390, 137), ...]
    this.hullOffsetList = [
      { x: 390, y: 167 },
      { x: 390, y: 137 },
      { x: 390, y: 110 },
      { x: 390, y: 95 },
      { x: 355, y: 170 },
      { x: 355, y: 137 },
      { x: 355, y: 115 },
      { x: 355, y: 102 },
      { x: 285, y: 190 },
      { x: 285, y: 175 },
      { x: 285, y: 155 },
      { x: 285, y: 142 }
    ];

    // Lingo: set rudderList to value(the text of member "RuddersDB")
    this.rudderList = loadList('RuddersDB', [818, 820, 822, 824, 825, 827, 829, 842, 844, 846, 848, 850]);

    // Hull size lists
    // Lingo: set largeList to [1, 716, 717, 718, 719, 720, 721, 722]
    this.largeList = [1, 716, 717, 718, 719, 720, 721, 722];

    // Lingo: set mediumList to [45, 723, 724, 725, 726, 727, 728, 729]
    this.mediumList = [45, 723, 724, 725, 726, 727, 728, 729];

    // Lingo: set smallList to [92, 730, 731, 732, 733, 734, 735, 736]
    this.smallList = [92, 730, 731, 732, 733, 734, 735, 736];
  }

  /**
   * Clean up the handler
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.woodList = null;
    this.metalList = null;
    this.rudderList = null;
    return null;
  }

  /**
   * Check if a part is a hull
   * Lingo: on isHull me, argPartID
   * 
   * @param {number} partId - Part ID to check
   * @returns {boolean} True if part is a hull
   */
  isHull(partId) {
    return (this.woodList && this.woodList.includes(partId)) ||
      (this.metalList && this.metalList.includes(partId));
  }

  /**
   * Check if a part is a rudder
   * Lingo: on isRudder me, argPartID
   * 
   * @param {number} partId - Part ID to check
   * @returns {boolean} True if part is a rudder
   */
  isRudder(partId) {
    return this.rudderList && this.rudderList.includes(partId);
  }

  /**
   * Get hull from part list
   * Lingo: on getHull me, argPartList
   * 
   * @param {Array} partList - List of part IDs
   * @returns {number|string} Hull ID or 'NoHull'
   */
  getHull(partList) {
    if (Array.isArray(partList)) {
      for (const partId of partList) {
        if (this.isHull(partId)) {
          return partId;
        }
      }
    }
    return 'NoHull';
  }

  /**
   * Get hull from current boat
   * Lingo: on getCurrentHull me
   * 
   * @returns {number|string} Hull ID or 'NoHull'
   */
  getCurrentHull() {
    const partList = this.globals.user.getBoat().getParts();
    return this.getHull(partList);
  }

  /**
   * Get hull material type
   * Lingo: on getHullMaterial me, argPartList
   * 
   * @param {Array} partList - List of part IDs
   * @returns {string} 'Wood', 'Metal', or 'NoMaterial'
   */
  getHullMaterial(partList) {
    const hull = this.getHull(partList);
    if (hull !== 'NoHull') {
      if (this.woodList && this.woodList.includes(hull)) {
        return 'Wood';
      }
      if (this.metalList && this.metalList.includes(hull)) {
        return 'Metal';
      }
    }
    return 'NoMaterial';
  }

  /**
   * Get current hull material
   * Lingo: on getCurrentHullMaterial me
   * 
   * @returns {string} 'Wood', 'Metal', or 'NoMaterial'
   */
  getCurrentHullMaterial() {
    const partList = this.globals.user.getBoat().getParts();
    return this.getHullMaterial(partList);
  }

  /**
   * Get hull size type
   * Lingo: on getHullType me, argPartList
   * 
   * @param {Array} partList - List of part IDs
   * @returns {string} 'Large', 'Medium', 'Small', or 'NoType'
   */
  getHullType(partList) {
    const hull = this.getHull(partList);
    if (hull !== 'NoHull') {
      if (this.smallList && this.smallList.includes(hull)) {
        return 'Small';
      }
      if (this.mediumList && this.mediumList.includes(hull)) {
        return 'Medium';
      }
      if (this.largeList && this.largeList.includes(hull)) {
        return 'Large';
      }
    }
    return 'NoType';
  }

  /**
   * Get current hull type
   * Lingo: on getCurrentHullType me
   * 
   * @returns {string} 'Large', 'Medium', 'Small', or 'NoType'
   */
  getCurrentHullType() {
    const partList = this.globals.user.getBoat().getParts();
    return this.getHullType(partList);
  }

  /**
   * Get rudder from part list
   * Lingo: on getRudder me, argPartList
   * 
   * @param {Array} partList - List of part IDs
   * @returns {number|string} Rudder ID or 'NoRudder'
   */
  getRudder(partList) {
    if (Array.isArray(partList)) {
      for (const partId of partList) {
        if (this.isRudder(partId)) {
          return partId;
        }
      }
    }
    return 'NoRudder';
  }

  /**
   * Get rudder from current boat
   * Lingo: on getCurrentRudder me
   * 
   * @returns {number|string} Rudder ID or 'NoRudder'
   */
  getCurrentRudder() {
    const partList = this.globals.user.getBoat().getParts();
    return this.getRudder(partList);
  }

  /**
   * Set hull to wood material
   * Lingo: on setWoodHull me
   */
  setWoodHull() {
    const currentHull = this.getCurrentHull();
    const boat = this.globals.user.getBoat();

    const woodPos = this.woodList.indexOf(currentHull);
    if (woodPos >= 0) {
      // Already wood, keep it
      boat.replacePart(currentHull, this.woodList[woodPos]);
    } else {
      // Metal hull, switch to wood equivalent
      const metalPos = this.metalList.indexOf(currentHull);
      boat.replacePart(currentHull, this.woodList[metalPos]);
    }

    boat.rebuild();
  }

  /**
   * Set hull to metal material
   * Lingo: on setMetalHull me
   */
  setMetalHull() {
    const currentHull = this.getCurrentHull();
    const boat = this.globals.user.getBoat();

    const metalPos = this.metalList.indexOf(currentHull);
    if (metalPos >= 0) {
      // Already metal, keep it
      boat.replacePart(currentHull, this.metalList[metalPos]);
    } else {
      // Wood hull, switch to metal equivalent
      const woodPos = this.woodList.indexOf(currentHull);
      boat.replacePart(currentHull, this.metalList[woodPos]);
    }

    boat.rebuild();
  }

  /**
   * Get draw offset for a location and part list
   * Lingo: on getDrawOffset me, argWhere, argPartList
   * 
   * @param {string} where - Location (Quay, world, ShipYard, PhotoBook)
   * @param {Array} [partList] - Optional part list, uses current boat if not provided
   * @returns {Object} Offset {x, y}
   */
  getDrawOffset(where, partList) {
    // Get hull - use provided list or current boat
    let currentHull;
    if (partList === undefined) {
      currentHull = this.getCurrentHull();
    } else {
      currentHull = this.getHull(partList);
    }

    switch (where) {
      case 'Quay':
      case 'world':
        if (currentHull !== 'NoHull') {
          const boat = this.globals.user.getBoat();
          const loadRatio = boat.getCurrentLoadCapacity() / boat.getProperty('LoadCapacity');

          if (this.largeList && this.largeList.includes(currentHull)) {
            const verticalExtra = 45 * (1 - loadRatio);
            return { x: 0, y: verticalExtra };
          }
          if (this.mediumList && this.mediumList.includes(currentHull)) {
            const verticalExtra = 35 * (1 - loadRatio);
            return { x: -25, y: 5 + verticalExtra };
          }
          if (this.smallList && this.smallList.includes(currentHull)) {
            const verticalExtra = 20 * (1 - loadRatio);
            return { x: -55, y: 25 + verticalExtra };
          }
        }
        return { x: 0, y: 0 };

      case 'ShipYard':
        if (currentHull !== 'NoHull') {
          const woodPos = this.woodList.indexOf(currentHull);
          if (woodPos >= 0) {
            return { ...this.hullOffsetList[woodPos] };
          } else {
            const metalPos = this.metalList.indexOf(currentHull);
            return { ...this.hullOffsetList[metalPos] };
          }
        }
        return { x: 0, y: 0 };

      case 'PhotoBook':
        if (currentHull !== 'NoHull') {
          if (this.largeList && this.largeList.includes(currentHull)) {
            return { x: 0, y: 0 };
          }
          if (this.mediumList && this.mediumList.includes(currentHull)) {
            return { x: -25, y: 5 };
          }
          if (this.smallList && this.smallList.includes(currentHull)) {
            return { x: -55, y: 25 };
          }
        }
        return { x: 0, y: 0 };

      default:
        return { x: 0, y: 0 };
    }
  }

  /**
   * Get the sprite asset key for a given hull ID
   * @param {number} hullId - Hull ID
   * @returns {string} Asset key (e.g. 'Boat_Wood_Large')
   */
  getHullSpriteKey(hullId) {
    // Determine material
    let material = 'Unknown';
    if (this.woodList && this.woodList.includes(hullId)) {
      material = 'Wood';
    } else if (this.metalList && this.metalList.includes(hullId)) {
      material = 'Metal';
    }

    // Determine size
    let size = 'Unknown';
    if (this.largeList && this.largeList.includes(hullId)) {
      size = 'Large';
    } else if (this.mediumList && this.mediumList.includes(hullId)) {
      size = 'Medium';
    } else if (this.smallList && this.smallList.includes(hullId)) {
      size = 'Small';
    }

    return `Boat_${material}_${size}`;
  }
}

module.exports = BoatViewHandler;
