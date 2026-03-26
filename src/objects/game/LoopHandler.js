/**
 * LoopHandler.js - Game loop manager
 * Based on original Lingo: ParentScript 18 - LoopHandler.ls
 *
 * Manages game objects that need to be updated each frame:
 * - Maintains list of active objects
 * - Handles adding/removing objects safely during loop
 * - Calls loop() on each active object
 *
 * Original Lingo properties:
 * - addList: Objects to add on next loop
 * - deleteList: Objects to remove on next loop
 * - objectList: Currently active objects
 */
'use strict'

export default class LoopHandler {
  /**
   * Create loop handler
   * Original: on new me
   */
  constructor() {
    // Original: set addList to []
    this.addList = []

    // Original: set deleteList to []
    this.deleteList = []

    // Original: set objectList to []
    this.objectList = []
  }

  /**
   * Kill/cleanup the handler
   * Original: on kill me
   * @returns {number} 0
   */
  kill() {
    // Original: set addList to 0
    this.addList = 0

    // Original: set deleteList to 0
    this.deleteList = 0

    // Original: set objectList to 0
    this.objectList = 0

    // Original: return 0
    return 0
  }

  /**
   * Queue object to be added to the loop
   * Original: on addObject me, argObj, argLayer
   * @param {Object} obj - Object with loop() method
   * @param {number} layer - Layer (unused in original)
   */
  addObject(obj, layer) {
    // Original: add(addList, argObj)
    this.addList.push(obj)

    // Original: setProp(argObj, #loopMe, 1)
    obj.loopMe = true
  }

  /**
   * Queue object to be removed from the loop
   * Original: on deleteObject me, argObj
   * @param {Object} obj - Object to remove
   */
  deleteObject(obj) {
    // Original: add(deleteList, argObj)
    this.deleteList.push(obj)

    // Original: setProp(argObj, #loopMe, 0)
    obj.loopMe = false
  }

  /**
   * Process one frame of the game loop
   * Original: on loop me
   */
  loop() {
    // Original: repeat with tmpObj in deleteList; deleteOne(objectList, tmpObj); end repeat
    for (const obj of this.deleteList) {
      const index = this.objectList.indexOf(obj)
      if (index !== -1) {
        this.objectList.splice(index, 1)
      }
    }

    // Original: set deleteList to []
    this.deleteList = []

    // Original: repeat with tmpObj in addList; add(objectList, tmpObj); end repeat
    for (const obj of this.addList) {
      this.objectList.push(obj)
    }

    // Original: set addList to []
    this.addList = []

    // Original: repeat with tmpObj in objectList; if the loopMe of tmpObj then loop(tmpObj); end repeat
    for (const obj of this.objectList) {
      if (obj.loopMe && typeof obj.loop === 'function') {
        obj.loop()
      }
    }
  }
}
