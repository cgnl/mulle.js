/**
 * @fileoverview ExternalParts - External parts availability manager
 * Based on: ParentScript 32 - ExternalParts.ls
 * 
 * ExternalParts manages parts that can be obtained externally (e.g., from
 * postal delivery, random finds, etc.). It tracks which parts are available
 * and which the user already has.
 * 
 * Categories:
 * - postal: Parts that can arrive by mail
 * - delivery: Parts that can be delivered
 * - random: Parts that can be found randomly (e.g., in junk piles)
 * 
 * @example
 * const externalParts = new ExternalParts(globals);
 * const randomPart = externalParts.getRandomPart();
 */

class ExternalParts {
  /**
   * Creates a new ExternalParts manager
   * Lingo: on new me
   *   set partList to [:]
   *   set currentlyAvailable to [:]
   *   return me
   * @param {Object} globals - Global game state with user reference
   */
  constructor(globals) {
    /** @type {Object} Reference to game globals */
    this.globals = globals;
    
    /** @type {Object.<string, string[]>} Parts by category */
    this.partList = {};
    
    /** @type {Object.<string, string[]>} Currently available parts by category */
    this.currentlyAvailable = {};
  }

  /**
   * Cleans up the external parts manager
   * Lingo: on kill me
   *   set partList to 0
   *   set currentlyAvailable to 0
   *   return 0
   * @returns {null}
   */
  kill() {
    this.partList = null;
    this.currentlyAvailable = null;
    return null;
  }

  /**
   * Calculates currently available parts for a category
   * Filters out parts the user already has
   * Lingo: on calcCurrentlyAvailable me, argCategory
   *   set tmpCategory to getaProp(partList, argCategory)
   *   if listp(tmpCategory) then
   *     set tmpList to []
   *     repeat with tmpPartID in tmpCategory
   *       if not gotPart(the user of gMulleGlobals, tmpPartID) then
   *         add(tmpList, tmpPartID)
   *       end if
   *     end repeat
   *     setProp(currentlyAvailable, argCategory, duplicate(tmpList))
   *   end if
   * @param {string} category - The category to calculate for
   */
  calcCurrentlyAvailable(category) {
    const categoryParts = this.partList[category];
    
    if (!Array.isArray(categoryParts)) {
      return;
    }
    
    const availableList = [];
    for (const partId of categoryParts) {
      if (this.globals && this.globals.user) {
        if (!this.globals.user.gotPart(partId)) {
          availableList.push(partId);
        }
      } else {
        // If no user, all parts are available
        availableList.push(partId);
      }
    }
    
    this.currentlyAvailable[category] = [...availableList];
  }

  /**
   * Gets currently available parts for a category
   * Lingo: on getCurrentlyAvailable me, argCategory
   *   calcCurrentlyAvailable(me, argCategory)
   *   return getaProp(currentlyAvailable, argCategory)
   * @param {string} category - The category to get
   * @returns {string[]|undefined} Available part IDs
   */
  getCurrentlyAvailable(category) {
    this.calcCurrentlyAvailable(category);
    return this.currentlyAvailable[category];
  }

  /**
   * Gets a random available part
   * Lingo: on getRandomPart me
   *   set tmpRandom to getCurrentlyAvailable(me, #random)
   *   if listp(tmpRandom) then
   *     set tmpCount to count(tmpRandom)
   *     if tmpCount > 0 then
   *       return getAt(tmpRandom, random(tmpCount))
   *     end if
   *   end if
   *   return #NoPart
   * @returns {string} Random part ID or 'NoPart' symbol
   */
  getRandomPart() {
    const randomParts = this.getCurrentlyAvailable('random');
    
    if (Array.isArray(randomParts) && randomParts.length > 0) {
      const index = Math.floor(Math.random() * randomParts.length);
      return randomParts[index];
    }
    
    return 'NoPart';
  }

  /**
   * Gets parts, optionally filtered by category
   * Lingo: on getParts me, theCategory
   *   if voidp(theCategory) then
   *     return partList
   *   end if
   *   return getaProp(partList, theCategory)
   * @param {string} [category] - Optional category filter
   * @returns {Object|string[]} All parts or parts in category
   */
  getParts(category) {
    if (category === undefined) {
      return this.partList;
    }
    return this.partList[category];
  }

  /**
   * Returns the partList for serialization
   * Lingo: on toList me
   *   return partList
   * @returns {Object} The part list
   */
  toList() {
    return this.partList;
  }

  /**
   * Initializes from a serialized list
   * Lingo: on fromList me, objectList
   *   set partList to objectList
   *   set currentlyAvailable to [#Postal: [], #Delivery: [], #random: []]
   *   if voidp(partList) then
   *     set partList to duplicate(currentlyAvailable)
   *   else
   *     if count(partList) = 0 then
   *       set partList to duplicate(currentlyAvailable)
   *     end if
   *   end if
   * @param {Object} objectList - The serialized part list
   */
  fromList(objectList) {
    this.partList = objectList;
    
    // Initialize currentlyAvailable with empty arrays for standard categories
    this.currentlyAvailable = {
      postal: [],
      delivery: [],
      random: []
    };
    
    // Use default structure if partList is undefined, null, or empty
    if (!this.partList || Object.keys(this.partList).length === 0) {
      this.partList = {
        postal: [],
        delivery: [],
        random: []
      };
    }
  }

  /**
   * Adds a part to a category
   * @param {string} category - The category
   * @param {string} partId - The part ID to add
   */
  addPartToCategory(category, partId) {
    if (!this.partList[category]) {
      this.partList[category] = [];
    }
    this.partList[category].push(partId);
  }

  /**
   * Removes a part from a category
   * @param {string} category - The category
   * @param {string} partId - The part ID to remove
   */
  removePartFromCategory(category, partId) {
    const parts = this.partList[category];
    if (!Array.isArray(parts)) {
      return;
    }
    
    const index = parts.indexOf(partId);
    if (index !== -1) {
      parts.splice(index, 1);
    }
  }

  /**
   * Gets the count of parts in a category
   * @param {string} category - The category
   * @returns {number} Number of parts
   */
  getCategoryCount(category) {
    const parts = this.partList[category];
    if (!Array.isArray(parts)) {
      return 0;
    }
    return parts.length;
  }

  /**
   * Checks if a part exists in a category
   * @param {string} category - The category
   * @param {string} partId - The part ID
   * @returns {boolean}
   */
  hasPartInCategory(category, partId) {
    const parts = this.partList[category];
    if (!Array.isArray(parts)) {
      return false;
    }
    return parts.includes(partId);
  }

  /**
   * Gets all category names
   * @returns {string[]}
   */
  getAllCategories() {
    if (!this.partList) {
      return [];
    }
    return Object.keys(this.partList);
  }
}

module.exports = ExternalParts;
