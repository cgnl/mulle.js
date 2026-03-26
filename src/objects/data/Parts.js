/**
 * @fileoverview Parts - Parts collection manager
 * Based on: ParentScript 7 - Parts.ls
 * 
 * Parts manages a collection of Part objects, allowing adding and
 * retrieving parts by their ID. It also handles serialization from
 * a list format (for save/load functionality).
 * 
 * @example
 * const parts = new Parts();
 * parts.addPart(somePart);
 * const found = parts.getPart('partId');
 */

const Part = require('./Part');

class Parts {
  /**
   * Creates a new Parts collection
   * Lingo: on new me
   *   set partList to [:]
   *   return me
   */
  constructor() {
    /** @type {Object.<string, Part>} */
    this.partList = {};
  }

  /**
   * Cleans up the parts collection
   * Lingo: on kill me
   *   set partList to 0
   *   return 0
   * @returns {null}
   */
  kill() {
    this.partList = null;
    return null;
  }

  /**
   * Adds a part to the collection
   * Lingo: on addPart me, argPart
   *   addProp(partList, getId(argPart), argPart)
   * @param {Part} part - The part to add
   */
  addPart(part) {
    if (part && typeof part.getId === 'function') {
      const id = part.getId();
      this.partList[id] = part;
    }
  }

  /**
   * Gets a part by its ID
   * Lingo: on getPart me, argPartID
   *   set part to getaProp(partList, argPartID)
   *   if objectp(part) then
   *     return part
   *   end if
   *   return 0
   * @param {string} partId - The part ID to find
   * @returns {Part|null} The part or null if not found
   */
  getPart(partId) {
    if (!this.partList || partId === undefined) {
      return null;
    }
    const part = this.partList[partId];
    return part || null;
  }

  /**
   * Initializes parts from a serialized list
   * Lingo: on fromList me, argObjectList
   *   set partList to [:]
   *   set tmpNoOfParts to count(argObjectList)
   *   repeat with tmpRkn = 1 to tmpNoOfParts
   *     set newPart to new(script "Part")
   *     if fromList(newPart, getAt(argObjectList, tmpRkn)) then
   *       addPart(me, newPart)
   *     end if
   *   end repeat
   * @param {Array} objectList - Array of part data arrays
   */
  fromList(objectList) {
    this.partList = {};
    
    if (!objectList || !Array.isArray(objectList)) {
      return;
    }
    
    for (let i = 0; i < objectList.length; i++) {
      const partData = objectList[i];
      if (partData) {
        const newPart = new Part();
        if (newPart.fromList(partData)) {
          this.addPart(newPart);
        }
      }
    }
  }

  /**
   * Returns the number of parts in the collection
   * @returns {number}
   */
  getPartCount() {
    if (!this.partList) return 0;
    return Object.keys(this.partList).length;
  }

  /**
   * Returns all part IDs in the collection
   * @returns {string[]}
   */
  getAllPartIds() {
    if (!this.partList) return [];
    return Object.keys(this.partList);
  }

  /**
   * Returns all parts matching a category
   * @param {string} category - The category to filter by
   * @returns {Part[]}
   */
  getPartsByCategory(category) {
    if (!this.partList) return [];
    
    const result = [];
    for (const id in this.partList) {
      const part = this.partList[id];
      if (part && part.getCategory && part.getCategory() === category) {
        result.push(part);
      }
    }
    return result;
  }

  /**
   * Checks if a part exists in the collection
   * @param {string} partId - The part ID to check
   * @returns {boolean}
   */
  hasPart(partId) {
    if (!this.partList) return false;
    return partId in this.partList;
  }

  /**
   * Removes a part from the collection
   * @param {string} partId - The part ID to remove
   */
  removePart(partId) {
    if (this.partList && partId in this.partList) {
      delete this.partList[partId];
    }
  }

  /**
   * Serializes all parts to a list format
   * @returns {Array}
   */
  toList() {
    if (!this.partList) return [];
    
    const result = [];
    for (const id in this.partList) {
      const part = this.partList[id];
      if (part && part.toList) {
        result.push(part.toList());
      }
    }
    return result;
  }

  /**
   * Removes all parts from the collection
   */
  clear() {
    this.partList = {};
  }

  /**
   * Iterates over all parts
   * @param {function(Part, string): void} callback - Callback for each part
   */
  forEach(callback) {
    if (!this.partList) return;
    
    for (const id in this.partList) {
      callback(this.partList[id], id);
    }
  }
}

module.exports = Parts;
