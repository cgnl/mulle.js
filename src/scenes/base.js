/**
 * MulleState base state
 * @module MulleState
 */
'use strict'

import MulleSprite from '../objects/sprite'

/**
 * MulleState, extension of phaser state
 * @extends Phaser.State
 * 
 * BUG FIX #4: Scene transition doesn't preserve state
 * BUG FIX #7: Missing exitFrame/enterFrame hook system
 * BUG FIX #9: Missing scene initialization callbacks (init vs startMovie)
 */
class MulleState extends Phaser.State {
  /**
   * BUG FIX #9: Initialize scene data (called before preload)
   * Original Lingo: on mNew me / on birth me
   * This is called BEFORE assets are loaded
   */
  init () {
    // Override in subclasses for early initialization
    // Called before preload(), before assets are available
  }
  preload () {
    if (this.game.mulle.activeCutscene) {
      console.log('cutscene', this.key, this.game.mulle.activeCutscene)

      this.cutscene = new MulleSprite(this.game, 320, 240)
      this.cutscene.setDirectorMember('00.CXT', this.game.mulle.activeCutscene)
      this.game.add.existing(this.cutscene)

      this.progress = game.add.graphics(0, 0)
    }
  }

  loadRender () {
    if (this.progress) {
      var p = this.game.load.progressFloat / 100

      this.progress.clear()

      this.progress.beginFill('0x333333', 1)
      this.progress.drawRect(640 / 2 - 150, 400, 300, 32)
      this.progress.endFill()

      this.progress.beginFill('0x65C265', 1)
      this.progress.drawRect(640 / 2 - 150, 400, p * 300, 32)
      this.progress.endFill()

      this.progress.beginFill('0x65C265', 1)
    }
  }

  /*
  loadUpdate() {
    console.log('loadUpdate', this.key)
  }
  */

  create () {
    if (this.cutscene) {
      console.log('destroy cutscene')
      if (typeof this.cutscene.destroy === 'function') {
        this.cutscene.destroy()
      } else {
        this.game.world.remove(this.cutscene)
      }
      this.game.mulle.activeCutscene = null

      if (this.progress && typeof this.progress.destroy === 'function') {
        this.progress.destroy()
      }
    }

    if (!this.game.mulle.user) {
      this.game.mulle.user = this.game.mulle.UsersDB[ Object.keys(this.game.mulle.UsersDB)[0] ]

      // if( process.env.NODE_ENV !== "production" ){

      window.location.hash = this.key

      this.game.mulle.net.send({ name: this.game.mulle.user.UserId })
      this.game.mulle.net.send({ parts: this.game.mulle.user.Car.Parts })
    }

    // this.game.canvas.className = '';

    this.game.mulle.cursor.reset()

    // BUG FIX #5: Update scene transition tracker
    if (this.game.mulle.sceneTransition) {
      this.game.mulle.sceneTransition.currentScene = this.key
    }

    // BUG FIX #9: Call startMovie after create
    // Original Lingo: on startMovie me
    // This is called AFTER assets are loaded and scene is created
    if (typeof this.startMovie === 'function') {
      this.startMovie()
    }

    // console.log('prelaunch', this.key);
  }

  /**
   * BUG FIX #9: Scene start (called after create, after assets loaded)
   * Original Lingo: on startMovie me
   * Override in subclasses for initialization that needs loaded assets
   */
  startMovie () {
    // Override in subclasses
  }

  /**
   * BUG FIX #7: Enter frame hook (called every frame)
   * Original Lingo: on enterFrame me
   */
  update () {
    // BUG FIX #1: Call LoopMaster to update all registered loop objects
    if (this.game.mulle.loopMaster) {
      this.game.mulle.loopMaster.loop()
    }

    // BUG FIX #8: Cursor not integrated with game loop
    // Update cursor position and state every frame
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.update()
    }

    // BUG FIX #7: Call enterFrame hook if defined in subclass
    if (typeof this.enterFrame === 'function') {
      this.enterFrame()
    }
  }

  /**
   * BUG FIX #7: Enter frame hook for subclasses to override
   * Original Lingo: on enterFrame me
   */
  enterFrame () {
    // Override in subclasses for per-frame logic
  }

  /**
   * BUG FIX #7: Exit frame hook (called at end of frame)
   * Original Lingo: on exitFrame me
   */
  exitFrame () {
    // Override in subclasses for end-of-frame logic
  }

  /**
   * BUG FIX #4: Scene transition doesn't preserve state - Add shutdown method
   * Original Lingo: on stopMovie me / on mDispose me
   * Called when leaving scene to clean up resources
   */
  shutdown () {
    console.debug('[MulleState]', 'shutdown:', this.key)

    // BUG FIX #4: Clean up LoopMaster registered objects
    if (this.game.mulle.loopMaster) {
      this.game.mulle.loopMaster.dispose()
    }

    // BUG FIX #4: Call prepareToLeave if defined
    // This allows scenes to save state before transitioning
    if (typeof this.prepareToLeave === 'function') {
      this.prepareToLeave(null)
    }

    // Reset cursor
    if (this.game.mulle.cursor) {
      this.game.mulle.cursor.reset()
    }
  }

  /**
   * BUG FIX #5: Prepare to leave scene (called before transition)
   * Original Lingo: on prepareToLeave me, nextScene
   * Override in subclasses to save state before leaving
   * 
   * @param {string} nextScene - Next scene key
   */
  prepareToLeave (nextScene) {
    // Override in subclasses to clean up and save state
  }

  /**
   * BUG FIX #10: No updateStage() equivalent
   * Original Lingo: updateStage
   * Forces immediate visual refresh
   */
  updateStage () {
    // In Phaser, rendering happens automatically
    // But we can force a render if needed
    if (this.game.renderer) {
      this.game.renderer.render(this.game.stage)
    }
  }
}

export default MulleState
