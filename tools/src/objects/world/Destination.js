/**
 * @fileoverview Destination - Navigation destination handler
 * Based on: ParentScript 141 - Destination.ls
 * 
 * Destination handles navigation to world destinations, including
 * radius detection, sound playback, and entry transitions.
 */

/**
 * Destination class - handles navigation destination behavior
 * 
 * Lingo properties:
 *   child, sndId, insideOuter, insideInner, counter, frameList,
 *   listLen, readyToGo, canEnter, commentFinished
 */
class Destination {
  /**
   * Create a new Destination
   * Lingo: on new me, theChild
   * 
   * @param {Object} child - Child destination object
   * @param {Object} dir - Director reference (gDir)
   * @param {Object} sound - Sound handler (gSound)
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(child, dir, sound, globals) {
    this.child = child;
    this.dir = dir;
    this.sound = sound;
    this.globals = globals;
    
    // Sound ID
    // Lingo: set sndId to 0
    this.sndId = 0;
    
    // Radius tracking
    // Lingo: set insideInner to 0, set insideOuter to 0
    this.insideInner = false;
    this.insideOuter = false;
    
    // Animation
    // Lingo: set counter to 0, set frameList to []
    this.counter = 0;
    this.frameList = [];
    this.listLen = 0;
    
    // State flags
    // Lingo: set readyToGo to 1, set commentFinished to 0
    this.readyToGo = true;
    this.commentFinished = false;
  }

  /**
   * Clean up
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.child = null;
    return null;
  }

  /**
   * Initialize with car location
   * Lingo: on init me, carLoc
   * 
   * @param {Object} carLoc - Car location {x, y}
   */
  init(carLoc) {
    // Calculate distance to destination
    const dx = carLoc.x - this.child.myLoc.x;
    const dy = carLoc.y - this.child.myLoc.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check outer radius
    if (distance <= this.child.OuterRadius) {
      this.insideOuter = true;
      this.readyToGo = false;
    }
    
    // Check inner radius
    if (distance <= this.child.InnerRadius) {
      this.insideInner = true;
    }
    
    // Load normal frame list
    const frames = this.child.getFrameList();
    this.frameList = frames.normal || [];
    this.listLen = this.frameList.length;
    this.counter = 0;
  }

  /**
   * Step update
   * Lingo: on step me, carLoc
   * 
   * @param {Object} carLoc - Car location {x, y}
   */
  step(carLoc) {
    // Check for radius events (would be handled by drivingHandlers.checkRadius)
    // Simplified version here
    
    // Handle sound playback
    if (this.sndId) {
      if (this.readyToGo && this.insideInner && this.child.canEnter) {
        if (this.commentFinished) {
          // Enter the destination
          if (this.globals.world) {
            this.globals.world.enteredObject(this.child.getId());
          }
          if (this.dir) {
            this.dir.prepareToLeave(this.child.getDirResource());
          }
          return;
        }
      }
    } else {
      if (this.readyToGo && this.insideOuter) {
        this.playSound();
      }
    }
    
    // Advance animation
    this.counter++;
    if (this.counter >= this.listLen) {
      this.counter = 0;
    }
  }

  /**
   * Handle entering outer radius
   * Lingo: on enterOuterRadius me
   */
  enterOuterRadius() {
    // Set boat free zone
    if (this.dir.boat) {
      this.dir.boat.freeZone(1);
    }
    
    // Load outer frame list
    const frames = this.child.getFrameList();
    if (frames.Outer && Array.isArray(frames.Outer)) {
      this.frameList = frames.Outer;
      this.listLen = this.frameList.length;
      this.counter = 0;
    }
  }

  /**
   * Handle exiting outer radius
   * Lingo: on ExitOuterRadius me
   */
  ExitOuterRadius() {
    // Clear boat free zone
    if (this.dir.boat) {
      this.dir.boat.freeZone(0);
    }
    
    // Load normal frame list
    const frames = this.child.getFrameList();
    this.frameList = frames.normal || [];
    this.listLen = this.frameList.length;
    this.counter = 0;
    this.readyToGo = true;
  }

  /**
   * Handle entering inner radius
   * Lingo: on EnterInnerRadius me
   */
  EnterInnerRadius() {
    if (this.readyToGo && this.child.canEnter) {
      if (this.dir.boat) {
        this.dir.boat.programControl(1);
        this.dir.boat.setSpeed(0);
        this.dir.boat.steer(0);
      }
    }
  }

  /**
   * Handle exiting inner radius
   * Lingo: on ExitInnerRadius me
   */
  ExitInnerRadius() {
    // Empty in original Lingo
  }

  /**
   * Play destination sound
   * Lingo: on playSound me
   */
  playSound() {
    const sounds = this.child.sounds || [];
    
    if (this.child.canEnter) {
      if (sounds.length > 0) {
        if (this.sound.finished(this.sndId)) {
          this.sndId = this.dir.mulleTalkObject.say(sounds[0], 2, this, 'Q');
        }
      }
    } else {
      if (sounds.length > 1) {
        if (this.sound.finished(this.sndId)) {
          this.sndId = this.dir.mulleTalkObject.say(sounds[1], 2, this, 'Q');
        }
      }
    }
    
    // If no sound, mark as finished
    if (!this.sndId) {
      this.sndId = 1;
      this.commentFinished = true;
    }
  }

  /**
   * Callback when Mulle finishes speaking
   * Lingo: on mulleFinished me
   */
  mulleFinished() {
    this.commentFinished = true;
  }
}

module.exports = Destination;
