/**
 * @fileoverview SoundHandler - Sound queue and playback handler
 * Based on: ParentScript 36 - SoundHandler.ls
 * 
 * SoundHandler manages sound queues for talk and effects,
 * with priority-based playback control.
 */

/**
 * SoundHandler class - manages sound queues with priority
 * 
 * Lingo properties:
 *   talkList, fxList, talkID, fxID
 */
class SoundHandler {
  /**
   * Create a new SoundHandler
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   * @param {Object} sound - Sound manager (gSound)
   */
  constructor(globals, sound) {
    this.globals = globals;
    this.sound = sound;
    
    // Sound queues
    // Lingo: set talkList to []
    this.talkList = [];
    
    // Lingo: set fxList to []
    this.fxList = [];
    
    // Current playing IDs
    // Lingo: set talkID to 0
    this.talkID = 0;
    
    // Lingo: set fxID to 0
    this.fxID = 0;
    
    // Add to loop master
    // Lingo: addObject(the loopMaster of gMulleGlobals)
    if (globals.loopMaster) {
      globals.loopMaster.addObject(this);
    }
  }

  /**
   * Clean up the handler
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    // Stop all sounds
    // Lingo: stopAll(gSound)
    if (this.sound) {
      this.sound.stopAll();
    }
    
    // Clear state
    this.talkList = null;
    this.fxList = null;
    this.talkID = 0;
    this.fxID = 0;
    
    // Remove from loop master
    // Lingo: deleteObject(the loopMaster of gMulleGlobals)
    if (this.globals.loopMaster) {
      this.globals.loopMaster.deleteObject(this);
    }
    
    return null;
  }

  /**
   * Remove first item from a queue
   * Lingo: on Remove me, argType
   * 
   * @param {string} type - Queue type ('Talk' or 'FX')
   */
  remove(type) {
    switch (type) {
      case 'Talk':
        if (this.talkList.length > 0) {
          this.talkList.shift();
        }
        break;
      case 'FX':
        if (this.fxList.length > 0) {
          this.fxList.shift();
        }
        break;
    }
  }

  /**
   * Add sound to queue with priority
   * Lingo: on play me, argType, argPrio, argMemberList
   * 
   * @param {string} type - Sound type ('Talk' or 'FX')
   * @param {string} priority - Priority level ('super', 'High', 'Medium', 'Low')
   * @param {Array} memberList - List of sound members to play
   */
  play(type, priority, memberList) {
    switch (type) {
      case 'Talk':
        this._playTalk(priority, memberList);
        break;
      case 'FX':
        this._playFx(priority, memberList);
        break;
    }
  }

  /**
   * Handle talk sound playback
   * @private
   * 
   * @param {string} priority - Priority level
   * @param {Array} memberList - Sound members
   */
  _playTalk(priority, memberList) {
    switch (priority) {
      case 'super':
        // Stop both talk and fx, clear queues, add at start
        this.talkID = this.sound.stop(this.talkID);
        this.fxID = this.sound.stop(this.fxID);
        this.remove('Talk');
        this.remove('FX');
        this.talkList.unshift(memberList);
        break;
        
      case 'High':
        // Stop talk, clear talk queue, add at start
        this.talkID = this.sound.stop(this.talkID);
        this.remove('Talk');
        this.talkList.unshift(memberList);
        break;
        
      case 'Medium':
        // Add to end of queue
        this.talkList.push(memberList);
        break;
        
      case 'Low':
        // Only add if queue is empty
        if (this.talkList.length === 0) {
          this.talkList.push(memberList);
        }
        break;
    }
  }

  /**
   * Handle fx sound playback
   * @private
   * 
   * @param {string} priority - Priority level
   * @param {Array} memberList - Sound members
   */
  _playFx(priority, memberList) {
    // FX handling is empty in original Lingo
    // Placeholder for future implementation
    switch (priority) {
      case 'High':
      case 'Medium':
      case 'Low':
        break;
    }
  }

  /**
   * Loop callback (called each frame)
   * Lingo: on loop me
   */
  loop() {
    // Empty in original Lingo
  }

  /**
   * Get the talk list
   * @returns {Array} Current talk queue
   */
  getTalkList() {
    return this.talkList;
  }

  /**
   * Get the fx list
   * @returns {Array} Current fx queue
   */
  getFxList() {
    return this.fxList;
  }
}

module.exports = SoundHandler;
