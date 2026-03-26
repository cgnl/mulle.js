/**
 * MouseHandler.js - Mouse input manager
 * Based on original Lingo: ParentScript 20 - MouseHandler.ls
 *
 * Manages clickable objects, drag and drop, and cursor changes:
 * - Maintains sorted list of mouse-interactive objects
 * - Handles adding/removing objects safely
 * - Tracks mouse state and drag operations
 * - Sets appropriate cursor based on context
 *
 * Original Lingo properties:
 * - addList: Objects to add (keyed by layer)
 * - deleteList: Objects to remove
 * - objectList: Active objects sorted by layer
 * - dragMode: Whether currently dragging
 * - currentToWhere: Current drop target identifier
 * - mouseStatus: Current mouse button state
 */
'use strict'

export default class MouseHandler {
  /**
   * Create mouse handler
   * Original: on new me
   * @param {Object} cursor - Cursor manager (gCursor)
   * @param {boolean} mouseDown - Initial mouse state
   */
  constructor(cursor, game = null, mouseDown = false) {
    this.cursor = cursor
    this.game = game

    // Original: set addList to [:]
    this.addList = {}

    // Original: set deleteList to []
    this.deleteList = []

    // Original: set objectList to [:]; sort(objectList)
    this.objectList = []

    // Original: set dragMode to 0
    this.dragMode = false

    // Original: set currentToWhere to #NoWhere
    this.currentToWhere = 'NoWhere'

    // Original: if the mouseDown then #down else #up
    this.mouseStatus = mouseDown ? 'down' : 'up'
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
   * Queue object to be added
   * Original: on addObject me, argObj, argLayer
   * @param {Object} obj - Mouse-interactive object
   * @param {number} layer - Layer/z-index for sorting
   */
  addObject(obj, layer) {
    // Original: addProp(addList, argLayer, argObj)
    this.addList[layer] = obj
  }

  /**
   * Queue object to be removed
   * Original: on deleteObject me, argObj
   * @param {Object} obj - Object to remove
   */
  deleteObject(obj) {
    // Original: set the active of argObj to 0
    obj.active = false

    // Original: add(deleteList, argObj)
    this.deleteList.push(obj)
  }

  /**
   * Process add/delete queues
   * Original: on updateObjectList
   */
  updateObjectList() {
    // Original: repeat with rkn = 1 to count(addList); addProp(objectList, ...); end repeat
    for (const [layer, obj] of Object.entries(this.addList)) {
      this.objectList.push({ layer: parseInt(layer, 10), obj })
    }

    // Original: set addList to [:]
    this.addList = {}

    // Original: repeat with tmpObj in deleteList; deleteOne(objectList, tmpObj); end repeat
    for (const obj of this.deleteList) {
      const index = this.objectList.findIndex(item => item.obj === obj)
      if (index !== -1) {
        this.objectList.splice(index, 1)
      }
    }

    // Original: set deleteList to []
    this.deleteList = []

    // Sort by layer (original uses sorted property list)
    this.objectList.sort((a, b) => a.layer - b.layer)
  }

  /**
   * Process mouse position each frame
   * Original: on loop me
   * @param {Object} loc - Mouse position {x, y}
   */
  loop(loc) {
    if (!loc) {
      const pointer = this.game && this.game.input ? this.game.input.activePointer : null
      if (pointer) {
        loc = { x: pointer.x, y: pointer.y }
      } else {
        return
      }
    }
    // Original: updateObjectList(me)
    this.updateObjectList()

    // Original: set tmpOverObj to 0
    let overObj = null

    // Original: repeat with rkn = count(objectList) down to 1
    for (let i = this.objectList.length - 1; i >= 0; i--) {
      const item = this.objectList[i]
      const obj = item.obj

      // Original: if check(tmpObj, tmpLoc) then
      if (typeof obj.check === 'function' && obj.check(loc)) {
        // Original: if not objectp(tmpOverObj) then set tmpOverObj to tmpObj
        if (!overObj) {
          overObj = obj
        }
      }
    }

    // Original: if objectp(tmpOverObj) then
    if (overObj) {
      if (!this.dragMode) {
        // Original: setCursor(gCursor, the rolloverCursor of tmpOverObj)
        if (this.cursor) {
          this.cursor.setCursor(overObj.rolloverCursor)
        }
      } else {
        // Original: setCursor(gCursor, the dragRolloverCursor of tmpOverObj)
        if (this.cursor) {
          this.cursor.setCursor(overObj.dragRolloverCursor)
        }
        // Original: set currentToWhere to the dragToWhere of tmpOverObj
        this.currentToWhere = overObj.dragToWhere
      }
    } else {
      // Original: if not dragMode then setCursor(gCursor, #Standard)
      if (!this.dragMode && this.cursor) {
        this.cursor.setCursor('Standard')
      }
    }
  }

  /**
   * Handle mouse down event
   * Original: on mouseDown me, argLoc
   * @param {Object} loc - Mouse position {x, y}
   */
  mouseDown(loc) {
    if (!loc) {
      const pointer = this.game && this.game.input ? this.game.input.activePointer : null
      if (pointer) {
        loc = { x: pointer.x, y: pointer.y }
      } else {
        return
      }
    }
    // Original: if mouseStatus = #up then
    if (this.mouseStatus !== 'up') {
      return
    }

    // Original: updateObjectList(me)
    this.updateObjectList()

    // Original: set mouseStatus to #down
    this.mouseStatus = 'down'

    // Original: repeat with rkn = count(objectList) down to 1
    for (let i = this.objectList.length - 1; i >= 0; i--) {
      const item = this.objectList[i]
      const obj = item.obj

      // Original: if mouseDown(tmpObj, argLoc) then
      if (typeof obj.mouseDown === 'function' && obj.mouseDown(loc)) {
        // Original: set dragMode to the isDragObject of tmpObj
        this.dragMode = obj.isDragObject || false

        // Original: setCursor(gCursor, the dragCursor of tmpObj)
        if (this.cursor && obj.dragCursor) {
          this.cursor.setCursor(obj.dragCursor)
        }

        // Original: exit repeat
        break
      }
    }
  }

  /**
   * Handle mouse up event
   * Original: on mouseUp me, argLoc
   * @param {Object} loc - Mouse position {x, y}
   */
  mouseUp(loc) {
    if (!loc) {
      const pointer = this.game && this.game.input ? this.game.input.activePointer : null
      if (pointer) {
        loc = { x: pointer.x, y: pointer.y }
      } else {
        return
      }
    }
    // Original: if mouseStatus = #down then
    if (this.mouseStatus !== 'down') {
      return
    }

    // Original: updateObjectList(me)
    this.updateObjectList()

    // Original: if dragMode then set dragMode to 0
    if (this.dragMode) {
      this.dragMode = false
    }

    // Original: set mouseStatus to #up
    this.mouseStatus = 'up'

    // Original: repeat with rkn = count(objectList) down to 1; mouseUp(getAt(...)); end repeat
    for (let i = this.objectList.length - 1; i >= 0; i--) {
      const obj = this.objectList[i].obj
      if (typeof obj.mouseUp === 'function') {
        obj.mouseUp(loc)
      }
    }
  }

  /**
   * Set activePause on all objects
   * Original: on setActivePauseAll me, argStatus
   * @param {boolean} status - Pause status
   */
  setActivePauseAll(status) {
    // Original: repeat with tmpRkn = 1 to count(objectList)
    for (const item of this.objectList) {
      // Original: set the activePause of getAt(objectList, tmpRkn) to argStatus
      item.obj.activePause = status
    }
  }

  /**
   * Get current drop target
   * Original: on getToWhere me
   * @returns {string} Current drop target identifier
   */
  getToWhere() {
    // Original: return currentToWhere
    return this.currentToWhere
  }
}
