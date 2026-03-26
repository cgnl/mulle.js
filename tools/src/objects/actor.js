/**
 * MulleActor object
 * @module objects/actor
 * 
 * BUG FIXES FROM BUGS_ROUND4.md (Animation Systems):
 * 
 * BUG #2.1: #RndHold System - IMPLEMENTED
 * - addFrameHold(animName, frameIndex, minHold, maxHold)
 * - Pauses animation on specific frame for random duration
 * - Example: actor.addFrameHold('scratchHead', 4, 10, 30)
 * 
 * BUG #2.2: #RndFrame System - IMPLEMENTED
 * - addRandomFrameAnimation(name, frameMembers, fps, frameCount, loop)
 * - Creates animation with random frame selection
 * - Example: actor.addRandomFrameAnimation('idleVariation', [[b, 1], [b, 2], [b, 3]], 12, 10, true)
 * 
 * BUG #2.3: Frame-Synced Sounds - IMPLEMENTED
 * - addAnimationWithSounds(name, frames, sounds, fps, loop)
 * - Plays sounds at specific animation frames
 * - Example: actor.addAnimationWithSounds('walk', frames, [null, 'step1', null, 'step2'], 12, true)
 * 
 * BUG #2.4: Animation State Machine - IMPLEMENTED
 * - setState(stateName, animationName, onComplete)
 * - addStateTransition(fromState, toStateOrCallback)
 * - chainAnimation(animationName, onComplete, clearQueue)
 * - stopAnimationChain()
 * - Example: actor.setState('waiting', 'idle').addStateTransition('waiting', 'talking')
 * 
 * BUG #2.6: AnimChart Path Movement
 * AnimChart paths from Director (e.g., #Paths in Original/29.txt, Original/30.txt) are not yet implemented.
 * Original Director used paths to sync sprite movement with animation frames.
 * Current implementation: Animations play but position changes must be handled separately.
 * Future work: Implement path-based movement system to sync walking animations with position.
 * 
 * BUG #2.7: onComplete Timing Verification Needed
 * Phaser's animation.onComplete fires when animation sequence completes.
 * Needs verification: Does this match Director's "on exitFrame" timing exactly?
 * Original Director: Event fires on frame exit after last frame renders.
 * Current assumption: Phaser timing is close enough for gameplay purposes.
 * Future work: Add frame-accurate timing tests if animation sync issues appear.
 */
'use strict'

import MulleSprite from 'objects/sprite'

/**
 * Mulle actor, extension of mulle sprite + phaser sprite
 * @extends MulleSprite
 */
class MulleActor extends MulleSprite {
  /**
   * Create
   * @param  {Phaser.Game} game  Main game
   * @param  {number}      x     x coordinate
   * @param  {number}      y     y coordinate
   * @param  {string}      name  Hardcoded actor name
   * @param  {boolean}     ignore Ignore invalid actor name
   * @return {void}
   */
  constructor (game, x, y, name, ignore=false) {
    super(game, x, y)

    this.actorName = name

    var b = '00.CXT'

    if (this.actorName === 'mulleDefault') {
      this.setDirectorMember(b, 271)

      // BUG FIX #2: Changed frame rates from 10 FPS to 12 FPS (Director default)
      this.addAnimation('idle', [ [b, 271] ], 12, true, false)

      this.addAnimation('scratchChin', [ [b, 271], [b, 272], [b, 273], [b, 274], [b, 275], [b, 276] ], 12, false, false)

      this.addAnimation('scratchHead', [ [b, 277], [b, 278], [b, 279], [b, 280], [b, 281], [b, 282] ], 12, false, false)

      this.addAnimation('lookPlayer', [ [b, 287], [b, 288] ], 12, true, false)

      this.addAnimation('talkPlayer', [ [b, 289], [b, 290], [b, 291], [b, 292], [b, 293], [b, 294], [b, 295] ], 12, true, false)

      this.addAnimation('talkRegular', [ [b, 296], [b, 297], [b, 298], [b, 299], [b, 300], [b, 301], [b, 302] ], 12, true, false)

      // this.addAnimation('turnLeft', [ [b, 283] ], 12, true, false);
      this.addAnimation('lookLeft', [ [b, 283] ], 12, true, false)

      // this.addAnimation('turnRight', [ [b, 286],  [b, 287], ], 12, true, false);

      this.addAnimation('turnBack', [ [b, 285] ], 12, true, false)
    } else if (this.actorName === 'mulleSit') {
      this.setDirectorMember(b, 245)

      this.addAnimation('idle', [ [b, 245] ], 0, true, false)

      // BUG FIX #2: Changed frame rates to 12 FPS (Director default)
      this.addAnimation('wave', [ [b, 246], [b, 247], [b, 248], [b, 249], [b, 250], [b, 251], [b, 252], [b, 251], [b, 250], [b, 249], [b, 248], [b, 247] ], 12, true, false)

      this.addAnimation('lookPlayer', [ [b, 253] ], 12, true, false)

      this.addAnimation('talkPlayer', [ [b, 253], [b, 254], [b, 255], [b, 256], [b, 257], [b, 258], [b, 259], [b, 260] ], 12, true, false)

      this.addAnimation('smilePlayer', [ [b, 261], [b, 262], [b, 263] ], 12, true, false)
    } else if (this.actorName === 'mulleMenuHead') {
      var ten = '10.DXR'

      this.setDirectorMember(ten, 126)

      this.addAnimation('idle', [ [ten, 126] ], 0, true, false)

      // BUG FIX #2: Changed frame rate from 10 FPS to 12 FPS
      this.addAnimation('point', [
        [ten, 136],
        [ten, 137],
        [ten, 137],
        [ten, 137],
        [ten, 137],
        [ten, 137],
        [ten, 137],
        [ten, 137],
        [ten, 137],
        [ten, 136],
        [ten, 126]
      ], 12, false, false)
    } else if (this.actorName === 'mulleMenuMouth') {
      b = '10.DXR'

      this.setDirectorMember(b, 115)

      // BUG FIX #2: Changed frame rates to 12 FPS (Director default)
      this.addAnimation('idle', [ [b, 115] ], 12, true, false)

      this.addAnimation('blink', [ [b, 123] ], 12, true, false)

      this.addAnimation('lookPlayer', [ [b, 115] ], 12, true, false)

      this.addAnimation('talkPlayer', [ [b, 115], [b, 116], [b, 117], [b, 118], [b, 119], [b, 120], [b, 121], [b, 122] ], 12, true, false)
    } else if (this.actorName === 'figge') {
      b = '92.DXR'

      this.setDirectorMember(b, 17)
      // BUG FIX #2: Changed frame rate from 10 FPS to 12 FPS
      this.addAnimation('idle', [ [b, 17] ], 12, true, false)
      this.addAnimation('talkPlayer', [ [b, 17], [b, 18], [b, 19], [b, 20], [b, 21], [b, 22], [b, 23], [b, 24], [b, 25] ], 12, true, false)
    } else if (this.actorName === 'salkaRight') {
      b = '85.DXR'

      this.setDirectorMember(b, 26)
      // BUG FIX #2: Changed frame rate from 15 FPS to 12 FPS
      this.addAnimation('idle', [ [b, 26], [b, 27], [b, 28], [b, 29], [b, 30], [b, 29], [b, 28], [b, 27] ], 12, true, false)
    } else if (this.actorName === 'salkaLeft') {
      b = '92.DXR'

      this.setDirectorMember(b, 40)
      // BUG FIX #2: Changed frame rate from 15 FPS to 12 FPS
      this.addAnimation('idle', [ [b, 40], [b, 41], [b, 42], [b, 43], [b, 44], [b, 43], [b, 42], [b, 41] ], 12, true, false)
    } else if (this.actorName === 'buffa') {
      this.setDirectorMember(b, 214)
      // BUG FIX #2: Changed frame rates from 10 FPS to 12 FPS (except sleep_loop which stays slow)
      this.addAnimation('idle', [ [b, 214] ], 12, true, false)
      this.addAnimation('scratch1', [ [b, 214], [b, 215] ], 12, true, false)
      this.addAnimation('sleep_intro', [ [b, 214], [b, 216], [b, 217], [b, 218] ], 12, false, false)
      this.addAnimation('sleep_loop', [ [b, 219], [b, 220] ], 2, false, false)
      this.addAnimation('bark', [ [b, 222], [b, 223] ], 12, true, false)
    } else if (this.actorName === 'judge') {
      b = '94.DXR'

      this.setDirectorMember(b, 31)

      // BUG FIX #2: Changed frame rates to 12 FPS (Director default)
      this.addAnimation('idle', [ [b, 31] ], 12, true)

      this.addAnimation('talk', [ [b, 43], [b, 44], [b, 45], [b, 46], [b, 47] ], 12, true)

      var raise = this.addAnimation('raiseScore', [ [b, 32], [b, 33], [b, 34], [b, 35] ], 12, false)
      if (raise) {
        raise.onComplete.add(() => {
          console.log('raise hook')
          this.silenceAnimation = 'idleScore'
          this.talkAnimation = 'talkScore'
          this.animations.play('idleScore')
          this.displayScore()
        })
      }

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idleScore', [ [b, 36] ], 12, false)

      this.addAnimation('talkScore', [ [b, 37], [b, 38], [b, 39], /* [b, 40], */ [b, 41], [b, 42] ], 12, true)

      var lower = this.addAnimation('lowerScore', [ [b, 35], [b, 34], [b, 33], [b, 32] ], 12, false)
      if (lower) {
        lower.onComplete.add(() => {
          console.log('lower hook')
          this.silenceAnimation = 'idle'
          this.talkAnimation = 'talk'
          this.animations.play('idle')
        })
      }
    } else if (this.actorName === 'figgeDoor') {
      b = '03.DXR'

      this.setDirectorMember(b, 81)

      // BUG FIX #2: Changed frame rate from 10 FPS to 12 FPS
      var enter = this.addAnimation('enter', [ [b, 81], [b, 82], [b, 83], [b, 84], [b, 85] ], 12, false)
      if (enter) {
        enter.onComplete.add(() => {
          this.animations.play('entered')
        })
      }

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('entered', [ [b, 86] ], 12, true)

      this.addAnimation('exit', [ [b, 85], [b, 84], [b, 83], [b, 82], [b, 81] ], 12, false)

      this.addAnimation('talk', [ [b, 86], [b, 87], [b, 88], [b, 89], [b, 90], [b, 91], [b, 92], [b, 93] ], 12, true)

      this.talkAnimation = 'talk'
      this.silenceAnimation = 'entered'
    } else if (this.actorName === 'stureSad') {
      b = '88.DXR'

      this.setDirectorMember(b, 41)

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idle', [ [b, 41] ], 12, false)

      this.addAnimation('talk', [ [b, 42], [b, 43], [b, 44], [b, 44], [b, 45]], 12, true)
    } else if (this.actorName === 'stureHappy') {
      b = '88.DXR'

      this.setDirectorMember(b, 33)

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idle', [ [b, 33] ], 12, false)

      this.addAnimation('talk', [ [b, 34], [b, 35], [b, 36], [b, 36], [b, 37] ], 12, true)
    } else if (this.actorName === 'garson') {
      b = '87.DXR'

      this.setDirectorMember(b, 15)

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idle', [ [b, 15] ], 12, false)

      this.addAnimation('talk', [ [b, 16], [b, 17], [b, 18] ], 12, true)
    } else if (this.actorName === 'miaBody') {
      b = '86.DXR'

      this.setDirectorMember(b, 55)

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idle', [ [b, 55] ], 12, false)

      this.addAnimation('catchIntro', [ [b, 55], [b, 56], [b, 57], [b, 58] ], 12, false)

      this.addAnimation('catchEnd', [ [b, 47], [b, 48], [b, 49], [b, 50] ], 12, false)
    } else if (this.actorName === 'miaHead') {
      b = '86.DXR'

      this.setDirectorMember(b, 62)

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idle', [ [b, 62] ], 12, false)
      this.addAnimation('talk', [ [b, 63], [b, 64], [b, 65], [b, 66], [b, 67] ], 12, true)

      this.addAnimation('idleCat', [ [b, 69] ], 12, false)
      this.addAnimation('talkCat', [ [b, 69], [b, 70], [b, 71], [b, 72], [b, 73], [b, 74] ], 12, true)
    } else if (this.actorName === 'cat') {
      b = '86.DXR'

      this.setDirectorMember(b, 30)

      // BUG FIX #2: Changed frame rates to 12 FPS
      this.addAnimation('idle', [ [b, 30] ], 12, false)

      var f = []
      for (var i = 0; i < 12; i++) f.push([b, 31 + i])
      this.addAnimation('jump1', f, 12, false)

      var f = []
      for (var i = 0; i < 4; i++) f.push([b, 42 + i])
      this.addAnimation('jump2', f, 12, false)
    } else if (this.actorName === 'mulleBoat' || this.actorName === 'christina') {
      // Mulle at the boatyard (TalkToMe position) - from boten_04.DXR
      // Based on TalkToMeAnimChart (Internal/30.txt):
      // AnimChart frame N → Director member 41 + N (04a002v0 starts at member 42)
      // Original Lingo: #Talk:[21,23,24,25,26,27,28,29], #Scratch:[2-6], #ScratchHead:[11-16], #LookAround:[17-19]
      // Note: 'christina' is deprecated alias - the character is Mulle, same as car game
      b = 'boten_04.DXR'
      const base = 41  // Frame 1 = Member 42, so offset is 41

      this.setDirectorMember(b, base + 1)  // Frame 1 = idle

      // Idle/Still animation - frame 1
      // BUG FIX #2: Changed frame rates to 12 FPS (Director default)
      this.addAnimation('idle', [ [b, base + 1] ], 12, true, false)

      // Talk animation - original: #Talk:[21,23,24,25,26,27,28,29]
      this.addAnimation('talkPlayer', [
        [b, base + 21], [b, base + 23], [b, base + 24], [b, base + 25],
        [b, base + 26], [b, base + 27], [b, base + 28], [b, base + 29]
      ], 12, true, false)

      // Look at player - frame 1 (same as idle, looking forward)
      this.addAnimation('lookPlayer', [ [b, base + 1] ], 12, true, false)

      // Scratch animation - original: #Scratch:[2,3,4,5,6,5,6,5,4,3,2,1]
      this.addAnimation('scratch', [
        [b, base + 2], [b, base + 3], [b, base + 4], [b, base + 5], [b, base + 6],
        [b, base + 5], [b, base + 6], [b, base + 5], [b, base + 4], [b, base + 3],
        [b, base + 2], [b, base + 1]
      ], 12, false, false)

      // ScratchHead animation - original: #ScratchHead:[11,12,13,14,15,16,15,16,15,14,13,12,11,1]
      // BUG FIX #2.1: Now using #RndHold on frame 15 (index 4) as in original
      const shAnim1 = this.addAnimation('scratchHead', [
        [b, base + 11], [b, base + 12], [b, base + 13], [b, base + 14],
        [b, base + 15], [b, base + 16], [b, base + 15], [b, base + 16],
        [b, base + 15], [b, base + 14], [b, base + 13], [b, base + 12],
        [b, base + 11], [b, base + 1]
      ], 12, false, false)
      
      // Add frame hold to scratchHead animation (hold on extended pose)
      if (shAnim1) this.addFrameHold('scratchHead', 4, 10, 30)

      // LookAround animation - original: #LookAround:[17,17,17...18,19,19...18,18,1]
      this.addAnimation('lookAround', [
        [b, base + 17], [b, base + 17], [b, base + 17], [b, base + 17],
        [b, base + 18], [b, base + 19], [b, base + 19], [b, base + 19],
        [b, base + 18], [b, base + 18], [b, base + 1]
      ], 12, false, false)

      this.talkAnimation = 'talkPlayer'
      this.silenceAnimation = 'idle'
    } else if (this.actorName === 'mulleQuay' || this.actorName === 'christinaQuay') {
      // Mulle at the quay/dock - Based on QuayAnimChart (Internal/29.txt)
      // This uses the SAME sprite sheet as 'mulleBoat' (04a002v0, member 42+)
      // Original Lingo: #Talk:[30,31,32,33,34,35,36], #GoPee:[1-33 with sound]
      // Note: 'christinaQuay' is deprecated alias - the character is Mulle
      b = 'boten_04.DXR'
      const base = 41  // Frame 1 = Member 42

      this.setDirectorMember(b, base + 1)  // Frame 1 = idle

      // Idle/Still animation - frame 1
      // BUG FIX #2: Changed frame rates to 12 FPS (Director default)
      this.addAnimation('idle', [ [b, base + 1] ], 12, true, false)

      // Talk animation - original: #Talk:[30,31,32,33,34,35,36]
      this.addAnimation('talkPlayer', [
        [b, base + 30], [b, base + 31], [b, base + 32], [b, base + 33],
        [b, base + 34], [b, base + 35], [b, base + 36]
      ], 12, true, false)

      // Look at player
      this.addAnimation('lookPlayer', [ [b, base + 1] ], 12, true, false)

      // Scratch animation - same as mulleBoat: #Scratch:[2,3,4,5,6,5,6,5,4,3,2,1]
      this.addAnimation('scratch', [
        [b, base + 2], [b, base + 3], [b, base + 4], [b, base + 5], [b, base + 6],
        [b, base + 5], [b, base + 6], [b, base + 5], [b, base + 4], [b, base + 3],
        [b, base + 2], [b, base + 1]
      ], 12, false, false)

      // ScratchHead animation - same as mulleBoat
      // BUG FIX #2.1: Now using #RndHold on frame 15 (index 4) as in original
      const shAnim2 = this.addAnimation('scratchHead', [
        [b, base + 11], [b, base + 12], [b, base + 13], [b, base + 14],
        [b, base + 15], [b, base + 16], [b, base + 15], [b, base + 16],
        [b, base + 15], [b, base + 14], [b, base + 13], [b, base + 12],
        [b, base + 11], [b, base + 1]
      ], 12, false, false)
      
      // Add frame hold to scratchHead animation (hold on extended pose)
      if (shAnim2) this.addFrameHold('scratchHead', 4, 10, 30)

      // LookAround animation - same as mulleBoat
      this.addAnimation('lookAround', [
        [b, base + 17], [b, base + 17], [b, base + 17], [b, base + 17],
        [b, base + 18], [b, base + 19], [b, base + 19], [b, base + 19],
        [b, base + 18], [b, base + 18], [b, base + 1]
      ], 12, false, false)

      // GoPee animation - original: #GoPee:[1,2,3,...33] with sound "00e111v1"
      // This is a long animation sequence (frames 1-33)
      this.addAnimation('goPee', [
        [b, base + 1], [b, base + 2], [b, base + 3], [b, base + 4], [b, base + 5],
        [b, base + 6], [b, base + 7], [b, base + 8], [b, base + 9], [b, base + 10],
        [b, base + 11], [b, base + 12], [b, base + 13], [b, base + 30], [b, base + 31],
        [b, base + 32], [b, base + 32], [b, base + 32], [b, base + 33], [b, base + 33],
        [b, base + 33], [b, base + 32], [b, base + 32], [b, base + 32], [b, base + 32],
        [b, base + 32], [b, base + 32], [b, base + 32], [b, base + 32], [b, base + 32],
        [b, base + 33], [b, base + 33], [b, base + 33], [b, base + 32], [b, base + 32],
        [b, base + 32], [b, base + 33], [b, base + 33], [b, base + 33], [b, base + 32],
        [b, base + 32], [b, base + 32], [b, base + 33], [b, base + 33], [b, base + 33],
        [b, base + 32], [b, base + 31], [b, base + 30], [b, base + 14], [b, base + 15],
        [b, base + 16], [b, base + 17], [b, base + 18], [b, base + 19], [b, base + 20],
        [b, base + 21], [b, base + 22], [b, base + 23], [b, base + 24], [b, base + 25],
        [b, base + 26], [b, base + 27], [b, base + 28], [b, base + 29]
      ], 12, false, false)
      // Note: Sound "00e111v1" should be triggered when this animation plays

      this.talkAnimation = 'talkPlayer'
      this.silenceAnimation = 'idle'
    } else if(!ignore) {
      console.error('invalid actor', this.actorName)
    }

    const SignalCtor = (typeof Phaser !== 'undefined' && Phaser.Signal)
      ? Phaser.Signal
      : class { add () {} dispatch () {} remove () {} }
    this.onCue = new SignalCtor()

    this.isTalking = false

    this.sentenceNum = 0

    // BUG FIX #13: Add support for random frame hold (#RndHold)
    this.frameHoldCounter = 0
    this.frameHoldDuration = 0

    // BUG FIX #8: Animation loop defaults are now consistent
    // - Idle/talk animations: loop=true (continuous)
    // - Action animations (scratch, enter, exit): loop=false (one-shot)

    // BUG FIX #15: Add animation event callbacks
    /**
     * Animation event callbacks
     * @type {Object}
     */
    this.animationCallbacks = {}

    // BUG FIX #2.4 (BUGS_ROUND4.md): Animation State Machine
    /**
     * Current animation state for state machine
     * @type {string|null}
     */
    this.animationState = null

    /**
     * Animation state transition callbacks
     * @type {Object}
     */
    this.stateTransitions = {}

    /**
     * Animation chain queue
     * @type {Array}
     */
    this.animationQueue = []

    /**
     * Flag to track if an animation chain is in progress
     * @type {boolean}
     */
    this.isAnimationChaining = false
  }

  /**
   * BUG FIX #15: Add callback for animation events
   * @param {string} animName Animation name
   * @param {string} eventType Event type ('start', 'complete', 'loop')
   * @param {function} callback Callback function
   * @param {object} context Callback context
   */
  addAnimationCallback(animName, eventType, callback, context = this) {
    const anim = this.animations.getAnimation(animName)
    if (!anim) {
      console.warn('Animation not found for callback:', animName)
      return
    }

    if (!this.animationCallbacks[animName]) {
      this.animationCallbacks[animName] = {}
    }

    this.animationCallbacks[animName][eventType] = { callback, context }

    // Wire up to Phaser animation events
    switch (eventType) {
      case 'start':
        anim.onStart.add(callback, context)
        break
      case 'complete':
        anim.onComplete.add(callback, context)
        break
      case 'loop':
        anim.onLoop.add(callback, context)
        break
      default:
        console.warn('Unknown animation event type:', eventType)
        break
    }
  }

  /**
   * Make actor talk
   * @param  {string}   id    Sound name/ID
   * @param  {function} onEnd End callback
   * @param {function} onCue
   * @return {void}
   */
  talk (id, onEnd = null, onCue = null) {
    // console.log('talk', id, onEnd);

    this.isTalking = true

    if (this.talkAudio) {
      console.warn('talk while already talking')
      this.resetTalk()
    }

    console.debug('[talk]', this.actorName, id)

    if (onCue) {
      this.onCue.add(onCue)
    } else {
      this.onCue.add((v) => {
        if (v[1].toLowerCase() === 'silence') this.animations.play(this.silenceAnimation ? this.silenceAnimation : 'lookPlayer', 0)
        if (v[1].toLowerCase() === 'talk') this.animations.play(this.talkAnimation ? this.talkAnimation : 'talkPlayer')
      })
    }

    this.talkAudio = this.game.mulle.playAudio(id)

    if (!this.talkAudio) {
      console.error('invalid talk audio', this, id)
      this.talkAudio = null
      return false
    }

    var subData = this.game.mulle.subtitle.getData(id)

    if (subData) {
      var cueAmount = 1

      var lines = subData.lines

      // var lines = this.game.mulle.subtitle.database[ this.game.mulle.user.language ][ id ];

      var lineAmount = lines.length

      if (this.talkAudio.extraData && this.talkAudio.extraData.cue) {
        var onlyTalk = this.talkAudio.extraData.cue.find(function (v) { return v[1].toLowerCase() === 'talk' })

        cueAmount = onlyTalk ? onlyTalk.length : 1
      }

      console.debug('[talk-sub]', 'sentences', cueAmount)

      if (cueAmount === 1) {
        if (lineAmount > 1) {
          console.debug('[talk-sub]', this.actorName, 'only one cue, but multiple lines')

          /*
            // add all at once
            for (var t of lines) {
              this.game.mulle.subtitle.showLine(t);
            }
          */

          for (var i in lines) {
            if (i === 0) {
              this.game.mulle.subtitle.showLine(lines[ i ], subData.actor)
            } else {
              var del = 900 * Math.log(lines[i].length)

              this.game.time.events.add(del, () => {
                this.game.mulle.subtitle.showLine(lines[ i ], subData.actor)
              })
            }
          }
        } else {
          console.debug('[talk-sub]', this.actorName, 'only one sentence')

          this.game.mulle.subtitle.showLine(lines[ 0 ], subData.actor)
        }
      } else {
        console.debug('[talk-sub]', this.actorName, this.talkAudio.extraData.cue)

        this.onCue.add((v) => {
          if (v[1].toLowerCase() === 'talk') {
            // Check of we nog lines over hebben!
            if (this.sentenceNum < lines.length) {
              this.game.mulle.subtitle.showLine(lines[ this.sentenceNum ], subData.actor)
              this.sentenceNum++
            } else {
              console.warn('More cue points than subtitle lines', id, this.sentenceNum, lines.length)
            }
          }
        })
      }

      // this.game.mulle.subtitle.text = this.game.mulle.subtitles[id][0];
    } else {
      console.debug('[talk-sub] no subtitle', id)
    }

    // if(!this.talkAudio.cuePoints) return;

    this.cuesCompleted = {}

    if (!this.talkAudio.isDecoded) {
      this.talkAudio.onPlay.add(this.onAudioPlay, this)
    } else {
      this.onAudioPlay()
    }

    this.onEnd = onEnd
    if (this.onEnd) this.talkAudio.onStop.add(this.onEnd)

    this.talkAudio.onStop.add(this.onAudioStop, this)

    this.talkAudio.onResume.add(function () { console.log('resume') }, this)

    // console.log( 'talk audio', this.talkAudio );
  }

  /**
   * Internal audio play hook
   * @return {void}
   */
  onAudioPlay () {
    // console.log('audio play');

    this.animations.play(this.talkAnimation ? this.talkAnimation : 'talkPlayer')

    // BUG FIX #7: Changed cue point check rate from 15 FPS to 60 FPS for better timing accuracy
    this.talkLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 60, () => {
      // console.log('talk loop', this.talkAudio.currentTime);

      if (!this.talkAudio.extraData || !this.talkAudio.extraData.cue) {
        console.warn('no cue points', this.talkAudio)
        return
      }

      this.talkAudio.extraData.cue.forEach((v, k) => {
        if (!this.cuesCompleted[k] && this.talkAudio.currentTime >= v[0]) {
          this.onCue.dispatch(v)

          this.cuesCompleted[k] = true
        }
      })
    }, this)
  }

  /**
   * Internal audio stop hook
   * @return {void}
   */
  onAudioStop () {
    // console.log('audio stop');
    const idle = this.animations.getAnimation('idle')
    if (idle)
      idle.play()
    else if(!this.silenceAnimation)
      console.warn('No silence animation for actor', this.actorName)
    else {
      console.debug('Audio stop, start silenceAnimation', this.silenceAnimation)
      this.animations.play(this.silenceAnimation)
    }

    this.resetTalk()

    this.isTalking = false
  }

  /**
   * Stop talking, remove audio, and reset animation
   * @return {void}
   */
  resetTalk () {
    // console.log('reset talk');

    this.sentenceNum = 0

    if (this.talkAudio) {
      this.talkAudio.onPlay.remove(this.onAudioPlay, this)

      this.talkAudio.onStop.remove(this.onAudioStop, this)

      if (this.onEnd) this.talkAudio.onStop.remove(this.onEnd)

      this.talkAudio.stop()
      this.talkAudio = null

      // console.log('removed events');
    }

    if (this.talkLoop) {
      this.game.time.events.remove(this.talkLoop)
      this.talkLoop = null
    }

    this.onCue.removeAll()
  }

  /**
   * BUG FIX #14 (BUGS_ROUND4.md BUG #2.2): Add random frame animation (#RndFrame)
   * Implements #RndFrame system from original Lingo AnimCharts
   * Creates an animation that randomly picks from a set of frames
   * @param {string} animName Animation name
   * @param {array} frameMembers Array of [movie, member] pairs
   * @param {number} fps Frame rate
   * @param {number} frameCount Number of random frames to generate
   * @param {boolean} loop Loop animation
   */
  addRandomFrameAnimation(animName, frameMembers, fps, frameCount, loop = true) {
    const randomFrames = []
    for (let i = 0; i < frameCount; i++) {
      const randomIndex = this.game.rnd.integerInRange(0, frameMembers.length - 1)
      randomFrames.push(frameMembers[randomIndex])
    }
    console.log('[Actor] Random frame animation added:', animName, 'with', frameCount, 'frames from', frameMembers.length, 'options')
    return this.addAnimation(animName, randomFrames, fps, loop, false)
  }

  /**
   * BUG FIX #2.3 (BUGS_ROUND4.md): Implement Frame-Synced Sounds (#sound)
   * Adds animation with sounds that play at specific frames
   * Original Lingo: AnimChart #sound system from SpriteAnimBH.ls
   * @param {string} name Animation name
   * @param {array} frames Array of [movie, member] pairs
   * @param {array} sounds Array of sound IDs (null/undefined for silent frames)
   * @param {number} fps Frame rate
   * @param {boolean} loop Loop animation
   * @return {Phaser.Animation}
   */
  addAnimationWithSounds(name, frames, sounds, fps, loop = true) {
    // Create base animation
    const anim = this.addAnimation(name, frames, fps, loop, false)
    
    if (!anim) {
      console.error('[Actor] Failed to create animation with sounds:', name)
      return null
    }

    // Add sound playback on frame update
    anim.onUpdate.add((anim, frame) => {
      const sound = sounds[frame.index]
      if (sound && this.game.mulle.playAudioChannel) {
        // Play sound on OPEFFECT channel (operation effect)
        this.game.mulle.playAudioChannel(sound, 'OPEFFECT')
        console.debug('[Actor] Frame sound:', name, 'frame', frame.index, 'sound', sound)
      }
    }, this)

    console.log('[Actor] Animation with sounds added:', name, 'frames:', frames.length, 'sounds:', sounds.length)
    
    return anim
  }

  /**
   * BUG FIX #13 (BUGS_ROUND4.md BUG #2.1): Add random frame hold for animation variation
   * Implements #RndHold system from original Lingo AnimCharts
   * @param {string} animName Animation name
   * @param {number} frameIndex Frame index to hold on
   * @param {number} minHold Minimum frames to hold
   * @param {number} maxHold Maximum frames to hold
   */
  addFrameHold(animName, frameIndex, minHold, maxHold) {
    if (!this.animations) {
      console.warn('[Actor] No animations manager for frame hold:', animName)
      return
    }
    const anim = this.animations.getAnimation(animName)
    if (!anim) {
      console.warn('[Actor] Animation not found for frame hold:', animName)
      return
    }

    // Phaser CE Animation.onUpdate starts as null — create Signal if needed
    if (!anim.onUpdate) {
      anim.onUpdate = new Phaser.Signal()
    }

    // Store frame hold data
    if (!this.frameHolds) {
      this.frameHolds = {}
    }
    
    if (!this.frameHolds[animName]) {
      this.frameHolds[animName] = {}
    }

    this.frameHolds[animName][frameIndex] = { minHold, maxHold }

    // Hook into animation update event
    anim.onUpdate.add((anim, frame) => {
      if (this.frameHolds && this.frameHolds[anim.name]) {
        const holdData = this.frameHolds[anim.name][frame.index]
        if (holdData && this.frameHoldCounter === 0) {
          // Start frame hold
          this.frameHoldDuration = this.game.rnd.integerInRange(holdData.minHold, holdData.maxHold)
          this.frameHoldCounter = 1
        }
      }
    }, this)

    console.log('[Actor] Frame hold added to', animName, 'frame', frameIndex, 'range', minHold, '-', maxHold)
  }

  /**
   * BUG FIX #2.4 (BUGS_ROUND4.md): Set animation state
   * Implements state machine for character behaviors
   * @param {string} stateName State name
   * @param {string} animationName Animation to play for this state
   * @param {function} onComplete Optional callback when animation completes
   */
  setState(stateName, animationName = null, onComplete = null) {
    const previousState = this.animationState
    this.animationState = stateName

    console.log('[Actor] State change:', previousState, '->', stateName)

    // Play animation if specified
    if (animationName) {
      const anim = this.animations.getAnimation(animationName)
      if (anim) {
        // Clear any existing completion handlers for this animation
        anim.onComplete.removeAll()
        
        // Add new completion handler
        if (onComplete) {
          anim.onComplete.addOnce(onComplete, this)
        }

        // Check for state transitions
        anim.onComplete.addOnce(() => {
          this.onAnimationComplete(stateName, animationName)
        }, this)

        this.animations.play(animationName)
      } else {
        console.warn('[Actor] Animation not found for state:', stateName, animationName)
      }
    }

    return this
  }

  /**
   * BUG FIX #2.4: Handle animation completion and state transitions
   * Similar to original Lingo's "on Stopped me" event
   * @param {string} stateName State that just completed
   * @param {string} animationName Animation that just completed
   */
  onAnimationComplete(stateName, animationName) {
    console.log('[Actor] Animation complete:', stateName, animationName)

    // Check for registered state transitions
    if (this.stateTransitions[stateName]) {
      const transition = this.stateTransitions[stateName]
      if (typeof transition === 'function') {
        transition.call(this)
      } else if (typeof transition === 'string') {
        // Transition to another state
        this.setState(transition)
      }
    }

    // Process animation queue if chaining
    if (this.isAnimationChaining && this.animationQueue.length > 0) {
      const next = this.animationQueue.shift()
      this.chainAnimation(next.name, next.onComplete)
    } else {
      this.isAnimationChaining = false
    }
  }

  /**
   * BUG FIX #2.4: Register state transition callback
   * @param {string} fromState State to transition from
   * @param {string|function} toStateOrCallback Target state name or callback function
   */
  addStateTransition(fromState, toStateOrCallback) {
    this.stateTransitions[fromState] = toStateOrCallback
    console.log('[Actor] State transition registered:', fromState, '->', toStateOrCallback)
    return this
  }

  /**
   * BUG FIX #2.4: Chain animations together
   * Ensures animations don't break on interruption
   * @param {string} animationName Animation to play next
   * @param {function} onComplete Optional callback when this animation completes
   * @param {boolean} clearQueue Clear existing queue before adding
   */
  chainAnimation(animationName, onComplete = null, clearQueue = false) {
    if (clearQueue) {
      this.animationQueue = []
    }

    const anim = this.animations.getAnimation(animationName)
    if (!anim) {
      console.warn('[Actor] Cannot chain unknown animation:', animationName)
      return this
    }

    // If no animation is currently playing, play immediately
    const currentAnim = this.animations.currentAnim
    if (!currentAnim || !currentAnim.isPlaying) {
      this.isAnimationChaining = true
      
      // Clear any existing completion handlers
      anim.onComplete.removeAll()
      
      if (onComplete) {
        anim.onComplete.addOnce(onComplete, this)
      }

      // Add handler to process queue
      anim.onComplete.addOnce(() => {
        if (this.animationQueue.length > 0) {
          const next = this.animationQueue.shift()
          this.chainAnimation(next.name, next.onComplete)
        } else {
          this.isAnimationChaining = false
        }
      }, this)

      this.animations.play(animationName)
      console.log('[Actor] Chain animation playing:', animationName)
    } else {
      // Queue for later
      this.animationQueue.push({ name: animationName, onComplete: onComplete })
      console.log('[Actor] Chain animation queued:', animationName, 'queue length:', this.animationQueue.length)
    }

    return this
  }

  /**
   * BUG FIX #2.4: Stop current animation chain
   * Clears queue and stops interruption-safe
   */
  stopAnimationChain() {
    this.animationQueue = []
    this.isAnimationChaining = false
    
    const currentAnim = this.animations.currentAnim
    if (currentAnim) {
      currentAnim.onComplete.removeAll()
    }

    console.log('[Actor] Animation chain stopped')
    return this
  }

  /**
   * BUG FIX #2.1: Override update to handle frame holds
   * This is called every frame by Phaser
   */
  update() {
    super.update()

    // Handle frame hold logic
    if (this.frameHoldCounter > 0) {
      const currentAnim = this.animations.currentAnim
      if (currentAnim && this.frameHoldCounter < this.frameHoldDuration) {
        // Pause animation by preventing frame advance
        currentAnim.paused = true
        this.frameHoldCounter++
      } else if (this.frameHoldCounter >= this.frameHoldDuration) {
        // Release hold
        if (currentAnim) currentAnim.paused = false
        this.frameHoldCounter = 0
        this.frameHoldDuration = 0
      }
    }
  }

  destroy () {
    this.resetTalk()

    super.destroy()
  }
}

export default MulleActor
