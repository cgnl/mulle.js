/**
 * DivUsefulPartsProcessing - Utility functions for parts processing
 * Based on: MovieScript 145 - DivUsefulPartsProcessing.ls
 *
 * Contains various utility functions for processing parts data,
 * including getting starter parts, checking for morphs, generating
 * random junk piles, and more. These are mostly development/debug
 * utilities but some are used at runtime.
 */

/**
 * Get the list of part IDs for the initial junk pile
 * Lingo: on getStartPile
 * @returns {number[]} Array of starting part IDs
 */
function getStartPile() {
  return [2, 6, 12, 23, 29, 30, 47, 66, 90, 96, 112, 119, 121, 126, 131, 143, 153, 158, 178, 190, 203, 210, 211, 214, 215, 307];
}

/**
 * Get the list of reserved plug part IDs (and their morphs)
 * Lingo: on getPlugReserved
 * @param {Object} globals - MulleGlobals instance with parts
 * @returns {number[]} Array of reserved part IDs
 */
function getPlugReserved(globals) {
  const tempList = [279, 280, 281, 282, 291, 31, 69, 5, 184, 289, 167, 300, 301, 302, 303, 304, 305];
  return includeMorphs(tempList, globals);
}

/**
 * Include all morphs for a list of part IDs
 * Lingo: on includeMorphs tempList
 * @param {number[]} tempList - List of part IDs
 * @param {Object} globals - MulleGlobals instance with parts
 * @returns {number[]} List with all morphs included
 */
function includeMorphs(tempList, globals) {
  const result = [];

  if (!globals || !globals.parts) {
    return tempList.slice();
  }

  for (const index of tempList) {
    const part = globals.parts.getPart ? globals.parts.getPart(index) : null;
    if (part) {
      result.push(index);
      const morphList = part.getMorphList ? part.getMorphList() : null;
      if (Array.isArray(morphList)) {
        for (const morph of morphList) {
          result.push(morph);
        }
      }
    }
  }

  return result;
}

/**
 * Filter a list to only include non-morph parts (master parts only)
 * Lingo: on checkForNonMorphs tempList
 * @param {number[]|null} tempList - Optional list of part IDs to check
 * @param {Object} globals - MulleGlobals instance with parts
 * @returns {number[]} List of non-morph part IDs
 */
function checkForNonMorphs(tempList, globals) {
  if (!globals || !globals.parts) {
    return [];
  }

  // If a list is provided, convert IDs to part objects
  let partsToCheck;
  if (Array.isArray(tempList)) {
    partsToCheck = tempList.map(id =>
      globals.parts.getPart ? globals.parts.getPart(id) : null
    );
  } else {
    // Use all parts from the parts list
    partsToCheck = globals.parts.partList || [];
  }

  const resultList = [];

  for (const part of partsToCheck) {
    if (part && typeof part === 'object') {
      const partId = part.getId ? part.getId() : part.id;
      if (partId !== undefined) {
        resultList.push(partId);

        // Check if this is a morph (has a master)
        const master = part.getMaster ? part.getMaster() : 0;
        if (typeof master === 'number' && master > 0) {
          // Remove the morph from results
          const pos = resultList.indexOf(partId);
          if (pos !== -1) {
            resultList.splice(pos, 1);
          }
        }
      }
    }
  }

  return resultList;
}

/**
 * Generate random junk pile assignments for parts
 * Lingo: on makerandomJunkParts
 * @param {Object} globals - MulleGlobals instance
 * @returns {Object} Junk pile assignments { Pile1: {}, Pile2: {}, ... }
 */
function makeRandomJunkParts(globals) {
  const tempList = checkForNonMorphs(null, globals);
  let junkList;

  // Keep trying until piles are balanced (max - min <= 10)
  while (true) {
    junkList = {
      Pile1: {},
      Pile2: {},
      Pile3: {},
      Pile4: {},
      Pile5: {},
      Pile6: {}
    };

    for (const partId of tempList) {
      const pileNum = Math.floor(Math.random() * 6) + 1;
      const pileName = `Pile${pileNum}`;

      // Get position from junk pile handlers if available
      let position = { x: 0, y: 0 };
      if (globals && globals.junkPileHandlers) {
        position = setPartPosition(globals.junkPileHandlers, pileName, partId);
      }

      junkList[pileName][partId] = position;
    }

    // Check balance
    let max = 0;
    let min = tempList.length;
    for (let n = 1; n <= 6; n++) {
      const count = Object.keys(junkList[`Pile${n}`]).length;
      if (count > max) max = count;
      if (count < min) min = count;
    }

    if (max - min <= 10) {
      break;
    }
  }

  return junkList;
}

/**
 * Set position for a part in a junk pile
 * @param {Object} junkPileHandlers - Junk pile handlers
 * @param {string} pile - Pile name (e.g., 'Pile1')
 * @param {number} partId - Part ID
 * @returns {Object} Position { x, y }
 */
function setPartPosition(junkPileHandlers, pile, partId) {
  if (junkPileHandlers && junkPileHandlers.setPartPosition) {
    return junkPileHandlers.setPartPosition(pile, partId);
  }
  return { x: Math.random() * 100, y: Math.random() * 100 };
}

/**
 * Check for parts that are assigned as rewards for completing destinations
 * Lingo: on checkForDestParts
 * @param {Object} globals - MulleGlobals instance
 * @param {Object} memberData - Object containing member text data
 * @returns {number[]} List of destination reward part IDs
 */
function checkForDestParts(globals, memberData) {
  const destParts = [];

  if (!memberData || !memberData.ObjectsDB) {
    return destParts;
  }

  const objectIds = memberData.ObjectsDB;

  for (const objectId of objectIds) {
    const objectData = memberData[`Object${objectId}DB`];
    if (!objectData) continue;

    const setWhenDone = objectData.setWhenDone;
    if (setWhenDone && typeof setWhenDone === 'object') {
      const parts = setWhenDone.parts;
      if (Array.isArray(parts)) {
        // Filter out #random symbol
        const validParts = parts.filter(p => p !== 'random' && typeof p === 'number');
        for (let partId of validParts) {
          // Check if part is a morph and get master
          if (globals && globals.parts) {
            const part = globals.parts.getPart ? globals.parts.getPart(partId) : null;
            if (part) {
              const master = part.getMaster ? part.getMaster() : 0;
              if (typeof master === 'number' && master > 0) {
                partId = master;
              }
            }
          }
          destParts.push(partId);
        }
      }
    }
  }

  return destParts;
}

/**
 * Calculate leftover parts (not in start pile, dest rewards, or reserved)
 * Lingo: on leftOvers
 * @param {Object} globals - MulleGlobals instance
 * @param {Object} memberData - Member text data
 * @returns {Object} { forRandom: number[], forFigge: number[] }
 */
function leftOvers(globals, memberData) {
  const startList = [1, 82, 133, 152];
  const destParts = checkForDestParts(globals, memberData);
  let tempList = getStartPile().slice();

  // Add start list parts (checking for morphs)
  for (let index of startList) {
    if (globals && globals.parts) {
      const part = globals.parts.getPart ? globals.parts.getPart(index) : null;
      if (part) {
        const master = part.getMaster ? part.getMaster() : 0;
        if (typeof master === 'number' && master > 0) {
          index = master;
        }
      }
    }
    tempList.push(index);
  }

  // Add destination parts
  for (const index of destParts) {
    tempList.push(index);
  }

  // Get all non-morph parts
  const total = checkForNonMorphs(null, globals);

  // Remove parts from tempList
  for (const partId of tempList) {
    const pos = total.indexOf(partId);
    if (pos !== -1) {
      total.splice(pos, 1);
    }
  }

  // Remove plug reserved parts
  const reserved = getPlugReserved(globals);
  for (const partId of reserved) {
    const pos = total.indexOf(partId);
    if (pos !== -1) {
      total.splice(pos, 1);
    }
  }

  // Large parts list for Figge (the junkyard character)
  const largePartsIds = [13, 14, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 35, 91, 119, 124, 126, 129, 134, 137, 146, 149, 154, 158, 168, 173, 174, 175, 177, 189, 191, 192, 193, 199, 208, 209, 210, 212, 215, 221, 227, 229, 233, 235, 251, 264, 278, 279, 281, 282, 283, 294, 295, 306];
  const largePartsList = checkForNonMorphs(largePartsIds, globals);

  const figgeList = [];
  for (const index of largePartsList) {
    const pos = total.indexOf(index);
    if (pos !== -1) {
      figgeList.push(index);
      total.splice(pos, 1);
    }
  }

  return {
    forRandom: total,
    forFigge: figgeList
  };
}

/**
 * Convert part IDs to their sound description codes
 * Lingo: on fromIdToSound
 * @param {Object} globals - MulleGlobals instance
 * @returns {Object} Mapping of partId to sound code
 */
function fromIdToSound(globals) {
  const parts = checkForNonMorphs(null, globals);
  const result = {};

  for (const partId of parts) {
    if (globals && globals.parts) {
      const part = globals.parts.getPart ? globals.parts.getPart(partId) : null;
      if (part && part.getDescription) {
        const description = part.getDescription();
        // Extract characters 4-6 from description (e.g., "20d163v0" -> "163")
        if (description && description.length >= 6) {
          result[partId] = description.substring(3, 6);
        }
      }
    }
  }

  return result;
}

/**
 * Convert sound codes to part IDs
 * Lingo: on fromSoundToId
 * @param {number[]} soundList - List of sound codes
 * @param {Object} globals - MulleGlobals instance
 * @returns {number[]} Sorted list of part IDs
 */
function fromSoundToId(soundList, globals) {
  const partList = checkForNonMorphs(null, globals);
  const convertList = {};
  const resultList = [];

  // Build conversion map
  for (const partId of partList) {
    if (globals && globals.parts) {
      const part = globals.parts.getPart ? globals.parts.getPart(partId) : null;
      if (part && part.getDescription) {
        const description = part.getDescription();
        if (description && description.length >= 6) {
          const soundCode = parseInt(description.substring(3, 6), 10);
          if (!isNaN(soundCode)) {
            convertList[soundCode] = partId;
          }
        }
      }
    }
  }

  // Convert sound codes to part IDs
  for (const sound of soundList) {
    if (convertList[sound] !== undefined) {
      resultList.push(convertList[sound]);
    }
  }

  return resultList.sort((a, b) => a - b);
}

/**
 * Check for duplicate sound codes across parts
 * Lingo: on checkForSoundDoubles
 * @param {Object} globals - MulleGlobals instance
 * @returns {Object} Map of sound code to array of part IDs
 */
function checkForSoundDoubles(globals) {
  const partList = checkForNonMorphs(null, globals);
  const convertList = {};

  for (const partId of partList) {
    if (globals && globals.parts) {
      const part = globals.parts.getPart ? globals.parts.getPart(partId) : null;
      if (part && part.getDescription) {
        const description = part.getDescription();
        if (description && description.length >= 6) {
          const soundCode = parseInt(description.substring(3, 6), 10);
          if (!isNaN(soundCode)) {
            if (!convertList[soundCode]) {
              convertList[soundCode] = [partId];
            } else {
              convertList[soundCode].push(partId);
            }
          }
        }
      }
    }
  }

  // Filter to only include duplicates
  const doubles = {};
  for (const [sound, parts] of Object.entries(convertList)) {
    if (parts.length > 1) {
      doubles[sound] = parts;
    }
  }

  return doubles;
}

/**
 * Get starting parts from InitialJunkDB
 * Lingo: on getStartParts
 * @param {Object} memberData - Member data containing InitialJunkDB
 * @returns {number[]} Sorted list of initial part IDs
 */
function getStartParts(memberData) {
  const result = [];

  if (!memberData || !memberData.InitialJunkDB) {
    return result;
  }

  const junkData = memberData.InitialJunkDB;

  for (const pile of junkData) {
    if (pile && typeof pile === 'object') {
      for (const partId of Object.keys(pile)) {
        result.push(parseInt(partId, 10));
      }
    }
  }

  return result.sort((a, b) => a - b);
}

/**
 * Validate that all parts in ExternalPartsDB and InitialJunkDB exist
 * Lingo: on checkAllPartsValid
 * @param {Object} globals - MulleGlobals instance
 * @param {Object} memberData - Member data
 * @returns {number[]} List of missing part IDs
 */
function checkAllPartsValid(globals, memberData) {
  const missing = [];

  if (!memberData) return missing;

  // Check ExternalPartsDB
  if (memberData.ExternalPartsDB) {
    for (const partList of memberData.ExternalPartsDB) {
      if (Array.isArray(partList)) {
        for (const partId of partList) {
          if (globals && globals.parts) {
            const part = globals.parts.getPart ? globals.parts.getPart(partId) : null;
            if (!part) {
              missing.push(partId);
            }
          }
        }
      }
    }
  }

  // Check InitialJunkDB
  if (memberData.InitialJunkDB) {
    for (const pile of memberData.InitialJunkDB) {
      if (pile && typeof pile === 'object') {
        for (const partId of Object.keys(pile)) {
          const id = parseInt(partId, 10);
          if (globals && globals.parts) {
            const part = globals.parts.getPart ? globals.parts.getPart(id) : null;
            if (!part) {
              missing.push(id);
            }
          }
        }
      }
    }
  }

  return [...new Set(missing)]; // Remove duplicates
}

/**
 * Get user's owned parts (debug function)
 * Lingo: on UserStuff
 * @param {Object} globals - MulleGlobals instance
 * @returns {Array|null} User's ownStuff or null
 */
function getUserStuff(globals) {
  if (globals && globals.user && globals.user.ownStuff) {
    return globals.user.ownStuff;
  }
  return null;
}

module.exports = {
  getStartPile,
  getPlugReserved,
  includeMorphs,
  checkForNonMorphs,
  makeRandomJunkParts,
  setPartPosition,
  checkForDestParts,
  leftOvers,
  fromIdToSound,
  fromSoundToId,
  checkForSoundDoubles,
  getStartParts,
  checkAllPartsValid,
  getUserStuff
};
