/**
 * MulleLoopMaster - Centralized game loop management
 * 
 * BUG FIX #1: Missing LoopMaster System - No Centralized Game Loop
 * 
 * Original Director implementation uses a centralized LoopMaster that manages
 * all loopable objects at 60 FPS with guaranteed execution order and cleanup queue.
 * 
 * Based on original Lingo from Boten/00.CXT Internal/17.txt:
 * 
 * property gLoopObjectList -- list of objects that need loop() called
 * property gDeleteQueue     -- objects marked for deletion
 * 
 * on mNew me
 *   set gLoopObjectList to []
 *   set gDeleteQueue to []
 *   return me
 * end
 * 
 * on mDispose me
 *   set gLoopObjectList to []
 *   set gDeleteQueue to []
 * end
 * 
 * on addObject me, obj
 *   append gLoopObjectList, obj
 * end
 * 
 * on deleteObject me, obj
 *   append gDeleteQueue, obj
 * end
 * 
 * on loop me
 *   -- Call loop() on all registered objects
 *   repeat with obj in gLoopObjectList
 *     if objectP(obj) and the name of obj <> VOID then
 *       if obj.mMessageList().getPos(#loop) > 0 then
 *         obj.loop()
 *       end if
 *     end if
 *   end repeat
 *   
 *   -- Process deletion queue
 *   repeat with obj in gDeleteQueue
 *     deleteOne gLoopObjectList, obj
 *   end repeat
 *   set gDeleteQueue to []
 * end
 */

class MulleLoopMaster {
  constructor (game) {
    this.game = game

    // BUG FIX #1: Centralized loop object registry
    // Original: property gLoopObjectList
    this.loopObjectList = []

    // BUG FIX #1: Deletion queue for safe removal during loop
    // Original: property gDeleteQueue
    this.deleteQueue = []

    // BUG FIX #1: Track frame count for debugging
    this.frameCount = 0

    // BUG FIX #1: Execution order tracking (objects added first get called first)
    this.nextObjectId = 0

    console.debug('[LoopMaster]', 'initialized')
  }

  /**
   * BUG FIX #1: Add object to loop registry
   * Original Lingo: on addObject me, obj
   * 
   * @param {Object} obj - Object with loop() method
   * @param {number} priority - Optional priority (lower = earlier execution)
   */
  addObject (obj, priority = null) {
    if (!obj) {
      console.warn('[LoopMaster]', 'addObject: null object')
      return
    }

    // Check if object has loop method
    if (typeof obj.loop !== 'function') {
      console.warn('[LoopMaster]', 'addObject: object missing loop() method', obj)
      return
    }

    // Check if already registered
    const existing = this.loopObjectList.find(entry => entry.obj === obj)
    if (existing) {
      console.debug('[LoopMaster]', 'addObject: already registered', obj)
      return
    }

    // BUG FIX #1: Track insertion order for consistent execution
    const entry = {
      obj: obj,
      id: this.nextObjectId++,
      priority: priority !== null ? priority : this.nextObjectId,
      name: obj.constructor.name || 'Unknown'
    }

    this.loopObjectList.push(entry)

    // Sort by priority (lower priority = earlier execution)
    this.loopObjectList.sort((a, b) => a.priority - b.priority)

    console.debug('[LoopMaster]', 'addObject:', entry.name, '(id:', entry.id, 'priority:', entry.priority, ')')
  }

  /**
   * BUG FIX #1: Mark object for deletion (safe removal during loop)
   * Original Lingo: on deleteObject me, obj
   * 
   * @param {Object} obj - Object to remove from loop registry
   */
  deleteObject (obj) {
    if (!obj) {
      console.warn('[LoopMaster]', 'deleteObject: null object')
      return
    }

    // Add to deletion queue (processed at end of frame)
    const existing = this.deleteQueue.find(entry => entry === obj)
    if (!existing) {
      this.deleteQueue.push(obj)
      console.debug('[LoopMaster]', 'deleteObject: queued', obj.constructor.name || 'Unknown')
    }
  }

  /**
   * BUG FIX #1: Process deletion queue
   * Original Lingo: repeat with obj in gDeleteQueue
   */
  processDeleteQueue () {
    if (this.deleteQueue.length === 0) return

    for (const obj of this.deleteQueue) {
      const index = this.loopObjectList.findIndex(entry => entry.obj === obj)
      if (index !== -1) {
        const removed = this.loopObjectList.splice(index, 1)[0]
        console.debug('[LoopMaster]', 'removed:', removed.name, '(id:', removed.id, ')')
      }
    }

    this.deleteQueue = []
  }

  /**
   * BUG FIX #1: Main loop - call loop() on all registered objects
   * Original Lingo: on loop me
   * 
   * This is called every frame by the game at 60 FPS
   */
  loop () {
    this.frameCount++

    // BUG FIX #1: Call loop() on all registered objects in order
    // Original: repeat with obj in gLoopObjectList
    for (let i = 0; i < this.loopObjectList.length; i++) {
      const entry = this.loopObjectList[i]
      const obj = entry.obj

      // BUG FIX #1: Safety check - ensure object is still valid
      // Original: if objectP(obj) and the name of obj <> VOID
      if (!obj || typeof obj.loop !== 'function') {
        console.warn('[LoopMaster]', 'loop: invalid object at index', i, entry.name)
        // Mark for cleanup
        this.deleteQueue.push(obj)
        continue
      }

      try {
        // BUG FIX #1: Call the object's loop method
        // Original: obj.loop()
        obj.loop()
      } catch (error) {
        console.error('[LoopMaster]', 'loop error in', entry.name, error)
        // Optionally remove misbehaving objects
        // this.deleteQueue.push(obj)
      }
    }

    // BUG FIX #1: Process deletion queue at end of frame
    // Original: repeat with obj in gDeleteQueue; deleteOne gLoopObjectList, obj
    this.processDeleteQueue()
  }

  /**
   * BUG FIX #1: Clean up all registered objects
   * Original Lingo: on mDispose me
   */
  dispose () {
    console.debug('[LoopMaster]', 'dispose: cleaning up', this.loopObjectList.length, 'objects')
    
    this.loopObjectList = []
    this.deleteQueue = []
    this.frameCount = 0

    console.debug('[LoopMaster]', 'disposed')
  }

  /**
   * BUG FIX #1: Get count of registered objects
   */
  getObjectCount () {
    return this.loopObjectList.length
  }

  /**
   * BUG FIX #1: Debug info
   */
  debugInfo () {
    console.log('[LoopMaster] Debug Info:')
    console.log('  Frame count:', this.frameCount)
    console.log('  Registered objects:', this.loopObjectList.length)
    console.log('  Delete queue:', this.deleteQueue.length)
    console.log('  Objects:', this.loopObjectList.map(e => `${e.name} (id: ${e.id}, pri: ${e.priority})`))
  }
}

export default MulleLoopMaster
