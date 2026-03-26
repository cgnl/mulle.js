/**
 * SceneTransition - Scene transition helper
 * 
 * BUG FIX #5: Missing prepareToLeave scene transition system
 * 
 * Original Director uses prepareToLeave handler that's called before
 * transitioning to a new scene. This allows scenes to:
 * - Save state
 * - Clean up resources
 * - Set transition flags (WhereFrom, gotNewHull, etc.)
 * - Prepare data for next scene
 * 
 * Based on original Lingo pattern from various scene files:
 * 
 * on prepareToLeave me, nextScene
 *   -- Save state before leaving
 *   set the WhereFrom of gMulleGlobals to "04"
 *   
 *   -- Clean up handlers
 *   if objectP(myHandler) then
 *     myHandler.mDispose()
 *   end if
 *   
 *   -- Continue to next scene
 *   go movie nextScene
 * end
 */

class SceneTransition {
  constructor (game) {
    this.game = game
    
    // BUG FIX #5: Track current and previous scenes
    this.currentScene = null
    this.previousScene = null
    
    // BUG FIX #5: Transition state
    this.isTransitioning = false
    this.nextScene = null
    
    console.debug('[SceneTransition]', 'initialized')
  }

  /**
   * BUG FIX #5: Prepare to leave current scene
   * Original Lingo: on prepareToLeave me, nextScene
   * 
   * @param {string} sceneKey - Next scene key
   * @param {Object} params - Optional parameters to pass to next scene
   */
  prepareToLeave (sceneKey, params = {}) {
    console.debug('[SceneTransition]', 'prepareToLeave:', this.currentScene, '->', sceneKey)
    
    if (this.isTransitioning) {
      console.warn('[SceneTransition]', 'already transitioning, ignoring')
      return
    }
    
    this.isTransitioning = true
    this.nextScene = sceneKey
    
    // BUG FIX #5: Call prepareToLeave on current scene if it has one
    const currentState = this.game.state.getCurrentState()
    if (currentState && typeof currentState.prepareToLeave === 'function') {
      try {
        currentState.prepareToLeave(sceneKey, params)
      } catch (error) {
        console.error('[SceneTransition]', 'prepareToLeave error:', error)
      }
    }
    
    // BUG FIX #5: Set WhereFrom in global state
    if (this.game.mulle.gMulleGlobals && this.currentScene) {
      this.game.mulle.gMulleGlobals.setWhereFrom(this.currentScene)
    }
    
    // BUG FIX #5: Perform transition
    this.performTransition(sceneKey, params)
  }

  /**
   * BUG FIX #5: Perform the actual scene transition
   * 
   * @param {string} sceneKey - Scene key to transition to
   * @param {Object} params - Parameters to pass to next scene
   */
  performTransition (sceneKey, params = {}) {
    // Store previous scene
    this.previousScene = this.currentScene
    this.currentScene = sceneKey
    
    // Store params for next scene to access
    this.game.mulle.sceneParams = params
    
    // Start the new scene
    this.game.state.start(sceneKey)
    
    // Reset transition state
    this.isTransitioning = false
    this.nextScene = null
    
    console.debug('[SceneTransition]', 'transitioned to:', sceneKey)
  }

  /**
   * BUG FIX #5: Get scene parameters passed from previous scene
   */
  getSceneParams () {
    const params = this.game.mulle.sceneParams || {}
    // Clear params after retrieval
    this.game.mulle.sceneParams = null
    return params
  }

  /**
   * BUG FIX #5: Direct transition without prepareToLeave (for special cases)
   * 
   * @param {string} sceneKey - Scene key to transition to
   */
  directTransition (sceneKey) {
    this.previousScene = this.currentScene
    this.currentScene = sceneKey
    this.game.state.start(sceneKey)
    
    console.debug('[SceneTransition]', 'direct transition to:', sceneKey)
  }

  /**
   * BUG FIX #5: Get previous scene key
   */
  getPreviousScene () {
    return this.previousScene
  }

  /**
   * BUG FIX #5: Get current scene key
   */
  getCurrentScene () {
    return this.currentScene
  }

  /**
   * BUG FIX #5: Check if currently transitioning
   */
  isInTransition () {
    return this.isTransitioning
  }
}

export default SceneTransition
