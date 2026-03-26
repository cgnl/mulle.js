/**
 * @fileoverview SpriteAnimBH - Sprite Animation Behavior
 * Based on: BehaviorScript 25 - SpriteAnimBH.ls
 * 
 * SpriteAnimBH handles sprite-based animations with support for:
 * - Frame-based animation sequences
 * - Path-based movement
 * - Sound synchronization (especially for speech/talk animations)
 * - Wait states and action states
 * 
 * @example
 * const anim = new SpriteAnimBH(sprite, sound, { movement: 'Still' });
 * anim.setAnimAction('Talk');
 */

class SpriteAnimBH {
  /**
   * Creates a new SpriteAnimBH
   * Lingo: on beginSprite me
   * @param {Object} sprite - The sprite to animate
   * @param {Object} sound - Sound handler
   * @param {Object} [options] - Animation options
   */
  constructor(sprite, sound, options = {}) {
    this.sprite = sprite;
    this.sound = sound;
    
    // Type identifier
    this.type = 'SpriteAnim';
    
    // Active state
    this.active = options.active !== undefined ? options.active : true;
    
    // Animation properties
    this.object = options.object || 'Standard';
    this.movement = options.movement || 'Still';
    this.frameListMember = '';
    this.firstFrame = sprite ? sprite.member : '';
    this.frameList = [];
    this.soundList = [];
    this.counter = 0;
    this.listLen = 0;
    
    // Sound properties
    this.soundMember = options.soundMember || '';
    this.sndId = 0;
    this.myChannel = 0;
    this.opSndId = 0;
    this.autoSound = options.autoSound !== undefined ? options.autoSound : true;
    
    // Wait/action properties
    this.waitForWhat = options.waitForWhat || 'none';
    this.waitState = 'move';
    this.doWhat = options.doWhat || 'GoNextFrame';
    this.syncTalk = options.syncTalk || false;
    this.repeatIt = options.repeatIt || false;
    
    // Path properties
    this.movePathName = options.movePathName || '';
    this.movePath = [];
    this.toLoc = options.toLoc || null;
    this.nrOfSteps = options.nrOfSteps || 0;
    this.pathRelative = options.pathRelative !== undefined ? options.pathRelative : true;
    this.pathActive = false;
    this.pathCounter = 0;
    
    // Action properties
    this.actionActive = false;
    this.actionCounter = 0;
    
    // Frame lists from chart
    this.allFrameLists = {};
    this.allPathLists = {};
    
    // Location
    this.myLoc = sprite && sprite.loc ? { ...sprite.loc } : { x: 0, y: 0 };
    
    // Initialize if active
    if (this.active) {
      this.init();
    }
  }

  /**
   * Initialize animation
   * Lingo: on init me
   */
  init() {
    if (this.object !== 'Custom') {
      this.frameListMember = String(this.object);
    }
    
    if (this.sprite && this.sprite.loc) {
      this.myLoc = { ...this.sprite.loc };
    }
    
    this.setAnimFirstFrame(this.firstFrame);
    this.waitState = 'move';
  }

  /**
   * End sprite - cleanup
   * Lingo: on endSprite me
   */
  endSprite() {
    if (this.sndId && this.sound) {
      this.sound.stop(this.sndId);
    }
  }

  /**
   * Activate/deactivate animation
   * Lingo: on activate me, YesNo
   * @param {boolean} yesNo
   */
  activate(yesNo) {
    this.active = yesNo;
  }

  /**
   * Set first frame of animation
   * Lingo: on setAnimFirstFrame me, theMember
   * @param {string} member - Member name or empty for current
   */
  setAnimFirstFrame(member) {
    if (!member || member === '') {
      this.firstFrame = this.sprite ? this.sprite.member : '';
    } else {
      this.firstFrame = member;
    }
  }

  /**
   * Set animation chart
   * Lingo: on setAnimChart me, theName
   * @param {string} name - Chart name
   * @param {Object} [chartData] - Optional chart data (for testing)
   */
  setAnimChart(name, chartData) {
    this.frameListMember = name;
    
    if (chartData) {
      this.allFrameLists = chartData.Actions || {};
      this.allPathLists = chartData.Paths || {};
    }
    
    this.setAnimAction(this.movement);
  }

  /**
   * Set current animation action
   * Lingo: on setAnimAction me, theMove
   * @param {string} move - Action name (Still, Talk, Wait, etc.)
   */
  setAnimAction(move) {
    // Stop sound when going to Still
    if (move === 'Still') {
      this.playAnimSound('');
    }
    
    this.movement = move;
    
    let tempFrameList = [];
    
    // Handle Wait action specially
    if (move === 'Wait') {
      const options = this.allFrameLists.Wait;
      if (options) {
        if (this.waitState === 'move') {
          // Pick random action from wait options
          const randomIndex = Math.floor(Math.random() * (options.length - 1)) + 1;
          const randomAction = options[randomIndex];
          if (typeof randomAction === 'string' && this.allFrameLists[randomAction]) {
            tempFrameList = this.allFrameLists[randomAction];
          } else {
            tempFrameList = [options[0]];
          }
          this.waitState = 'Still';
        } else {
          tempFrameList = [options[0]];
          this.waitState = 'move';
        }
      }
    } else {
      tempFrameList = this.allFrameLists[move] || [];
    }
    
    // Build frame and sound lists
    this.frameList = [];
    this.soundList = [];
    
    for (let i = 0; i < tempFrameList.length; i++) {
      const index = tempFrameList[i];
      
      if (Array.isArray(index)) {
        const type = index[0];
        
        switch (type) {
          case 'RndHold': {
            const holdFrame = index[1];
            const minVal = index[2];
            const maxVal = index[3];
            const repeatCount = minVal + Math.floor(Math.random() * (maxVal - minVal + 1));
            for (let x = 0; x < repeatCount; x++) {
              this.frameList.push(holdFrame);
              this.soundList.push(0);
            }
            break;
          }
          case 'RndFrame': {
            const rndList = index[1];
            const randomFrame = rndList[Math.floor(Math.random() * rndList.length)];
            this.frameList.push(randomFrame);
            this.soundList.push(0);
            break;
          }
          case 'sound': {
            const sndList = index[1];
            const tempSnd = sndList[Math.floor(Math.random() * sndList.length)];
            this.soundList.push(typeof tempSnd === 'string' ? tempSnd : 0);
            break;
          }
          default:
            this.frameList.push(index);
            this.soundList.push(0);
        }
      } else {
        this.frameList.push(index);
        this.soundList.push(0);
      }
    }
    
    // Add loop back frame if needed
    if (this.waitForWhat === 'anim' && this.doWhat !== 'SendSpriteMe' && move !== 'Wait') {
      this.frameList.push(1);
      this.soundList.push(0);
    }
    
    this.listLen = this.frameList.length;
    this.actionCounter = 0;
    this.actionActive = true;
  }

  /**
   * Get current action
   * Lingo: on getAnimAction me
   * @returns {string}
   */
  getAnimAction() {
    return this.movement;
  }

  /**
   * Get current wait state
   * Lingo: on getAnimWaitState me
   * @returns {string}
   */
  getAnimWaitState() {
    return this.waitState;
  }

  /**
   * Play animation sound
   * Lingo: on playAnimSound me, theSnd
   * @param {string} snd - Sound name
   * @returns {number} Sound ID
   */
  playAnimSound(snd) {
    if (this.sound && this.sndId) {
      this.sound.stop(this.sndId);
    }
    
    if (snd && snd.length > 0 && this.sound) {
      this.sndId = this.sound.play(snd, 'EFFECT');
      this.myChannel = this.sound.getChannel ? this.sound.getChannel(this.sndId) : 0;
      return this.sndId;
    } else {
      this.sndId = 0;
      this.myChannel = 0;
      return 0;
    }
  }

  /**
   * Set up speech animation with sync
   * Lingo: on makeAnimSpeech me, theSnd
   * @param {string} snd - Sound name
   * @returns {number} Sound ID
   */
  makeAnimSpeech(snd) {
    this.repeatIt = true;
    this.syncTalk = true;
    this.playAnimSound(snd);
    this.waitForWhat = 'sound';
    return this.sndId;
  }

  /**
   * Reset to normal animation mode
   * Lingo: on setAnimNormal me
   */
  setAnimNormal() {
    this.repeatIt = false;
    this.syncTalk = false;
    this.waitForWhat = 'anim';
    this.doWhat = 'SendSpriteMe';
  }

  /**
   * Set animation path
   * Lingo: on setAnimPath me, movePathName, toLoc, nrOfSteps
   * @param {string} pathName - Named path from chart
   * @param {Object} toLoc - Target location {x, y}
   * @param {number} steps - Number of steps
   */
  setAnimPath(pathName, toLoc, steps) {
    this.pathActive = false;
    this.pathCounter = 0;
    
    if (pathName && pathName.length > 0 && this.allPathLists[pathName]) {
      this.movePath = [...this.allPathLists[pathName]];
      this.nrOfSteps = this.movePath.length;
      
      if (this.pathRelative) {
        for (let i = 0; i < this.movePath.length; i++) {
          this.movePath[i] = {
            x: this.movePath[i].x + this.myLoc.x,
            y: this.movePath[i].y + this.myLoc.y
          };
        }
      }
      this.pathActive = true;
    } else if (toLoc && typeof toLoc === 'object') {
      this.movePath = [];
      
      let diff;
      if (this.pathRelative) {
        diff = { x: toLoc.x, y: toLoc.y };
      } else {
        diff = { x: toLoc.x - this.myLoc.x, y: toLoc.y - this.myLoc.y };
      }
      
      this.nrOfSteps = steps || 1;
      if (this.nrOfSteps === 0) this.nrOfSteps = 1;
      
      const step = { x: diff.x / this.nrOfSteps, y: diff.y / this.nrOfSteps };
      
      for (let n = 1; n <= this.nrOfSteps; n++) {
        this.movePath.push({
          x: this.myLoc.x + (step.x * n),
          y: this.myLoc.y + (step.y * n)
        });
      }
      this.pathActive = true;
    }
  }

  /**
   * Set animation location
   * Lingo: on setAnimLoc me, theLoc, isRelational
   * @param {Object} loc - Location {x, y}
   * @param {boolean} isRelational - Add to current or set absolute
   */
  setAnimLoc(loc, isRelational) {
    if (isRelational) {
      this.myLoc = {
        x: this.myLoc.x + loc.x,
        y: this.myLoc.y + loc.y
      };
    } else {
      this.myLoc = { ...loc };
    }
  }

  /**
   * Handle sound cue passed event
   * Lingo: on spritecuePassed me, theChannel, cueNr, cueName
   * @param {number} channel - Sound channel
   * @param {number} cueNr - Cue number
   * @param {string} cueName - Cue name (T=Talk, S=Still)
   */
  spriteCuePassed(channel, cueNr, cueName) {
    if (!this.syncTalk) return;
    if (this.myChannel !== channel) return;
    if (this.sound && this.sound.finished && this.sound.finished(this.sndId)) return;
    
    if (cueName === 'T') {
      this.setAnimAction('Talk');
    } else if (cueName === 'S') {
      // Original Lingo sets waitState to move BEFORE calling setAnimAction
      // setAnimAction will then toggle it back to Still when it processes Wait
      this.waitState = 'move';
      this.setAnimAction('Wait');
      // After setAnimAction('Wait') with waitState='move', it becomes 'Still'
      // So we keep the final waitState as 'move' per original Lingo behavior
      this.waitState = 'move';
    }
  }

  /**
   * Frame update
   * Lingo: on exitFrame me
   */
  exitFrame() {
    if (!this.active) return;
    
    // Update path
    if (this.pathActive) {
      this.pathCounter++;
      this.myLoc = { ...this.movePath[this.pathCounter - 1] };
      
      if (this.pathCounter >= this.nrOfSteps) {
        this.pathActive = false;
        if (this.waitForWhat === 'path') {
          this.doTheWhat();
          return;
        }
      }
    }
    
    // Update sprite location
    if (this.sprite) {
      this.sprite.loc = { ...this.myLoc };
    }
    
    // Update action
    if (this.actionActive) {
      this.actionCounter++;
      
      // Play auto sound if enabled
      if (this.autoSound && this.soundList[this.actionCounter - 1]) {
        const tempSound = this.soundList[this.actionCounter - 1];
        if (typeof tempSound === 'string' && this.sound) {
          if (this.opSndId) this.sound.stop(this.opSndId);
          this.opSndId = this.sound.play(tempSound, 'OPEFFECT');
        }
      }
      
      // Update sprite member
      const tempFrame = this.frameList[this.actionCounter - 1];
      if (this.sprite && this.firstFrame && tempFrame !== undefined) {
        // In real implementation, this would update the sprite member
        // this.sprite.member = this.firstFrame + tempFrame - 1;
      }
      
      // Check if action complete
      if (this.actionCounter >= this.listLen) {
        if (this.repeatIt || this.movement === 'Wait') {
          this.setAnimAction(this.movement);
        } else if (this.movement === 'Still') {
          this.actionCounter = 0;
        } else {
          this.actionActive = false;
          if (this.waitForWhat === 'anim') {
            this.doTheWhat();
          }
        }
      }
    }
    
    // Check if waiting for sound
    if (this.sndId && this.waitForWhat === 'sound') {
      if (this.sound && this.sound.finished && this.sound.finished(this.sndId)) {
        this.doTheWhat();
      }
    }
  }

  /**
   * Execute action when wait condition met
   * Lingo: on doTheWhat me
   */
  doTheWhat() {
    switch (this.doWhat) {
      case 'GoNextFrame':
        // In real implementation: go(the frame + 1)
        break;
      case 'GoNextMarker':
        // In real implementation: go(#next)
        break;
      case 'SendSpriteMe':
        // In real implementation: sendSprite(spriteNum, #Stopped)
        if (this.onStopped) {
          this.onStopped();
        }
        break;
    }
  }
}

module.exports = SpriteAnimBH;
