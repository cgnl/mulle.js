/**
 * GameObserver - Debug observer for tracking game events
 * 
 * Monitors and logs:
 * - Mouse clicks and hit areas
 * - Sound playback (start, stop, errors)
 * - Animation states
 * - Scene transitions
 * - Sprite interactions
 * 
 * Usage: 
 *   In browser console: game.observer.enable()
 *   To disable: game.observer.disable()
 *   Filter by type: game.observer.filter('sound')
 *   Show visual overlays: game.observer.showHitAreas(true)
 *   Summary of issues: game.observer.summary()
 */
'use strict'

class GameObserver {
  constructor(game) {
    this.game = game
    this.enabled = false
    this.filters = new Set() // Empty = log everything
    this.logs = []
    this.maxLogs = 1000
    
    // Track issues
    this.issues = {
      soundNotFound: [],
      animationFailed: [],
      clickNoHandler: [],
      spriteNotFound: []
    }
    
    // Visual debug overlays
    this.hitAreaGraphics = null
    this.showingHitAreas = false
    
    // Original functions we'll wrap
    this._originals = {}
    
    // Bind methods
    this._onInputDown = this._onInputDown.bind(this)
    this._onInputUp = this._onInputUp.bind(this)
  }

  /**
   * Enable the observer
   */
  enable() {
    if (this.enabled) return
    this.enabled = true
    
    console.log('%c[GameObserver] ENABLED', 'background: #4CAF50; color: white; padding: 2px 6px; border-radius: 3px;')
    console.log('Commands: game.observer.disable(), game.observer.filter("sound"), game.observer.showHitAreas(true), game.observer.export()')
    
    this._hookInput()
    this._hookSound()
    this._hookAnimations()
    this._hookScenes()
    this._hookSprites()
  }

  /**
   * Disable the observer
   */
  disable() {
    if (!this.enabled) return
    this.enabled = false
    
    this._unhookAll()
    this.showHitAreas(false)
    
    console.log('%c[GameObserver] DISABLED', 'background: #f44336; color: white; padding: 2px 6px; border-radius: 3px;')
  }

  /**
   * Filter logs by type(s)
   * @param {...string} types - 'click', 'sound', 'animation', 'scene', 'sprite'
   */
  filter(...types) {
    this.filters.clear()
    types.forEach(t => this.filters.add(t))
    console.log('[GameObserver] Filtering:', types.length ? types.join(', ') : 'ALL')
  }

  /**
   * Show/hide clickable hit areas
   */
  showHitAreas(show) {
    this.showingHitAreas = show
    
    if (show) {
      if (!this.hitAreaGraphics) {
        this.hitAreaGraphics = this.game.add.graphics(0, 0)
        this.hitAreaGraphics.fixedToCamera = true
      }
      this._updateHitAreas()
    } else if (this.hitAreaGraphics) {
      this.hitAreaGraphics.clear()
    }
  }

  /**
   * Export logs as JSON
   */
  export() {
    const data = JSON.stringify(this.logs, null, 2)
    console.log('[GameObserver] Logs exported. Copy from below:')
    console.log(data)
    return this.logs
  }

  /**
   * Clear logs
   */
  clear() {
    this.logs = []
    this.issues = {
      soundNotFound: [],
      animationFailed: [],
      clickNoHandler: [],
      spriteNotFound: []
    }
    console.log('[GameObserver] Logs and issues cleared')
  }

  /**
   * Show summary of detected issues
   */
  summary() {
    console.log('%c[GameObserver] ISSUE SUMMARY', 'background: #E91E63; color: white; padding: 4px 8px; font-weight: bold;')
    
    console.group('Sounds not found (' + this.issues.soundNotFound.length + ')')
    this.issues.soundNotFound.forEach(s => console.log('  -', s))
    console.groupEnd()
    
    console.group('Animations failed (' + this.issues.animationFailed.length + ')')
    this.issues.animationFailed.forEach(s => console.log('  -', s))
    console.groupEnd()
    
    console.group('Clicks without handlers (' + this.issues.clickNoHandler.length + ')')
    this.issues.clickNoHandler.forEach(s => console.log('  -', s))
    console.groupEnd()
    
    console.group('Sprites not found (' + this.issues.spriteNotFound.length + ')')
    this.issues.spriteNotFound.forEach(s => console.log('  -', s))
    console.groupEnd()
    
    return this.issues
  }

  // ============ INTERNAL LOGGING ============

  _log(type, action, data = {}) {
    if (!this.enabled) return
    if (this.filters.size > 0 && !this.filters.has(type)) return

    const entry = {
      time: Date.now(),
      frame: this.game.time.now,
      scene: this.game.state.current,
      type,
      action,
      ...data
    }
    
    this.logs.push(entry)
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // Console output with colors and better formatting
    const colors = {
      click: '#2196F3',
      sound: '#FF9800', 
      animation: '#9C27B0',
      scene: '#4CAF50',
      sprite: '#00BCD4',
      error: '#f44336'
    }
    
    const color = colors[type] || '#757575'
    const prefix = `%c[${type.toUpperCase()}]`
    const style = `background: ${color}; color: white; padding: 1px 4px; border-radius: 2px;`
    
    // Format output based on type for better readability
    let details = ''
    if (type === 'click' && action === 'mouseDown') {
      const targetNames = data.targets ? data.targets.map(t => t.name).join(', ') : 'none'
      details = `(${data.x}, ${data.y}) → ${targetNames} ${data.hasHandler ? '✓' : '✗ NO HANDLER'}`
    } else if (type === 'sound') {
      details = data.id || data.key || data.soundName || JSON.stringify(data)
    } else if (type === 'error') {
      details = JSON.stringify(data)
    }
    
    if (details) {
      console.log(prefix, style, action, details, data)
    } else {
      console.log(prefix, style, action, data)
    }
  }

  // ============ INPUT HOOKS ============

  _hookInput() {
    // Global input tracking
    this.game.input.onDown.add(this._onInputDown)
    this.game.input.onUp.add(this._onInputUp)
  }

  _onInputDown(pointer) {
    const x = Math.round(pointer.x)
    const y = Math.round(pointer.y)
    
    // Find what was clicked
    const targets = this._findClickTargets(x, y)
    
    // Check if any target has a click handler
    let hasHandler = false
    const targetInfo = targets.map(t => {
      const handlers = this._getHandlers(t)
      if (handlers.length > 0) hasHandler = true
      
      return {
        name: t.name || t.key || 'unnamed',
        type: t.constructor.name,
        frame: t.frameName || t.frame,
        interactive: t.inputEnabled,
        visible: t.visible,
        alpha: t.alpha,
        handlers: handlers
      }
    })
    
    this._log('click', 'mouseDown', {
      x, y,
      button: pointer.button,
      hasHandler,
      targets: targetInfo
    })
    
    // Track clicks without handlers
    if (!hasHandler && targets.length > 0) {
      const clickInfo = `${x},${y} on ${targetInfo.map(t => t.name).join(', ')}`
      if (!this.issues.clickNoHandler.includes(clickInfo)) {
        this.issues.clickNoHandler.push(clickInfo)
      }
    }

    // Update hit area display
    if (this.showingHitAreas) {
      this._updateHitAreas()
    }
  }
  
  _getHandlers(obj) {
    const handlers = []
    if (obj.events) {
      if (obj.events.onInputDown && obj.events.onInputDown._bindings && obj.events.onInputDown._bindings.length > 0) {
        handlers.push('onInputDown')
      }
      if (obj.events.onInputUp && obj.events.onInputUp._bindings && obj.events.onInputUp._bindings.length > 0) {
        handlers.push('onInputUp')
      }
      if (obj.events.onInputOver && obj.events.onInputOver._bindings && obj.events.onInputOver._bindings.length > 0) {
        handlers.push('onInputOver')
      }
    }
    return handlers
  }

  _onInputUp(pointer) {
    this._log('click', 'mouseUp', {
      x: Math.round(pointer.x),
      y: Math.round(pointer.y)
    })
  }

  _findClickTargets(x, y) {
    const targets = []
    
    const checkGroup = (group) => {
      if (!group || !group.children) return
      
      group.children.forEach(child => {
        if (child instanceof Phaser.Group) {
          checkGroup(child)
        } else if (child.getBounds) {
          const bounds = child.getBounds()
          if (bounds.contains(x, y) && child.visible && child.alpha > 0) {
            targets.push(child)
          }
        }
      })
    }
    
    checkGroup(this.game.world)
    return targets
  }

  // ============ SOUND HOOKS ============

  _hookSound() {
    const self = this

    // Hook game.mulle.playAudio - the main sound player
    if (this.game.mulle) {
      const origPlayAudio = this.game.mulle.playAudio
      this.game.mulle.playAudio = function(id, onStop) {
        self._log('sound', 'playAudio', { id })
        const result = origPlayAudio.call(this, id, onStop)
        if (!result) {
          self._log('error', 'soundNotFound', { id })
          if (!self.issues.soundNotFound.includes(id)) {
            self.issues.soundNotFound.push(id)
          }
        }
        return result
      }
      this._originals.playAudio = origPlayAudio
      
      // Hook stopAudio
      const origStopAudio = this.game.mulle.stopAudio
      this.game.mulle.stopAudio = function(id) {
        self._log('sound', 'stopAudio', { id })
        return origStopAudio.call(this, id)
      }
      this._originals.stopAudio = origStopAudio
      
      // Hook playAudioChannel
      if (this.game.mulle.playAudioChannel) {
        const origPlayChannel = this.game.mulle.playAudioChannel
        this.game.mulle.playAudioChannel = function(id, channel, onStop) {
          self._log('sound', 'playAudioChannel', { id, channel })
          return origPlayChannel.call(this, id, channel, onStop)
        }
        this._originals.playAudioChannel = origPlayChannel
      }
    }

    // Hook MulleSez if available
    this._checkMulleSez()
  }

  _checkMulleSez() {
    const self = this
    
    // MulleSez might be created later, so check periodically
    const hookSez = () => {
      if (this.game.mulle && this.game.mulle.sez && !this._originals.mulleSezSay) {
        const origSay = this.game.mulle.sez.say.bind(this.game.mulle.sez)
        this.game.mulle.sez.say = function(soundName, priority, callback) {
          self._log('sound', 'mulleSez.say', { soundName, priority })
          return origSay(soundName, priority, callback)
        }
        this._originals.mulleSezSay = origSay
        
        // Hook queue methods
        if (this.game.mulle.sez.addToQueue) {
          const origQueue = this.game.mulle.sez.addToQueue.bind(this.game.mulle.sez)
          this.game.mulle.sez.addToQueue = function(sound, priority) {
            self._log('sound', 'mulleSez.queue', { sound, priority })
            return origQueue(sound, priority)
          }
        }
      }
    }
    
    hookSez()
    setTimeout(hookSez, 2000)
    setTimeout(hookSez, 5000)
  }

  _wrapSound(sound) {
    const self = this
    const key = sound.key

    sound.onPlay.add(() => {
      self._log('sound', 'play', { key, volume: sound.volume, loop: sound.loop })
    })

    sound.onStop.add(() => {
      self._log('sound', 'stop', { key })
    })

    sound.onComplete.add(() => {
      self._log('sound', 'complete', { key })
    })
  }

  // ============ ANIMATION HOOKS ============

  _hookAnimations() {
    const self = this
    
    // Hook Phaser.Sprite.prototype.play
    const origPlay = Phaser.Sprite.prototype.play
    this._originals.spritePlay = origPlay
    
    Phaser.Sprite.prototype.play = function(name, frameRate, loop, killOnComplete) {
      self._log('animation', 'play', {
        sprite: this.name || this.key || 'unnamed',
        animation: name,
        frameRate,
        loop,
        currentFrame: this.frameName || this.frame
      })
      return origPlay.call(this, name, frameRate, loop, killOnComplete)
    }

    // Hook animation complete
    const origAnimUpdate = Phaser.AnimationManager.prototype.update
    this._originals.animUpdate = origAnimUpdate
    
    Phaser.AnimationManager.prototype.update = function() {
      const result = origAnimUpdate.call(this)
      
      if (this.currentAnim && this.currentAnim.isFinished && !this.currentAnim._logged) {
        self._log('animation', 'complete', {
          sprite: this.sprite.name || this.sprite.key || 'unnamed',
          animation: this.currentAnim.name
        })
        this.currentAnim._logged = true
      }
      
      return result
    }
  }

  // ============ SCENE HOOKS ============

  _hookScenes() {
    const self = this
    
    this.game.state.onStateChange.add((newState, oldState) => {
      self._log('scene', 'transition', {
        from: oldState,
        to: newState
      })
    })
  }

  // ============ SPRITE HOOKS ============

  _hookSprites() {
    const self = this
    
    // Hook game.mulle.getDirectorImage
    if (this.game.mulle && this.game.mulle.getDirectorImage) {
      const origGetImage = this.game.mulle.getDirectorImage
      this.game.mulle.getDirectorImage = function(dir, num) {
        const result = origGetImage.call(this, dir, num)
        if (!result) {
          self._log('error', 'spriteNotFound', { dir, num })
          const key = `${dir}/${num}`
          if (!self.issues.spriteNotFound.includes(key)) {
            self.issues.spriteNotFound.push(key)
          }
        } else {
          self._log('sprite', 'getDirectorImage', { dir, num, found: !!result })
        }
        return result
      }
      this._originals.getDirectorImage = origGetImage
    }
    
    // Hook findDirectorMember
    if (this.game.mulle && this.game.mulle.findDirectorMember) {
      const origFindMember = this.game.mulle.findDirectorMember
      this.game.mulle.findDirectorMember = function(name) {
        const result = origFindMember.call(this, name)
        if (!result) {
          self._log('error', 'memberNotFound', { name })
          if (!self.issues.spriteNotFound.includes(name)) {
            self.issues.spriteNotFound.push(name)
          }
        }
        return result
      }
      this._originals.findDirectorMember = origFindMember
    }
  }

  // ============ HIT AREA VISUALIZATION ============

  _updateHitAreas() {
    if (!this.hitAreaGraphics) return
    
    this.hitAreaGraphics.clear()
    
    const drawHitArea = (obj, depth = 0) => {
      if (!obj.visible || obj.alpha === 0) return
      
      if (obj.inputEnabled && obj.input && obj.getBounds) {
        const bounds = obj.getBounds()
        
        // Color based on whether it has click handler
        const hasHandler = obj.events && (
          obj.events.onInputDown._bindings.length > 0 ||
          obj.events.onInputUp._bindings.length > 0
        )
        
        const color = hasHandler ? 0x4CAF50 : 0xFF9800
        const alpha = 0.3
        
        this.hitAreaGraphics.lineStyle(2, color, 0.8)
        this.hitAreaGraphics.beginFill(color, alpha)
        this.hitAreaGraphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height)
        this.hitAreaGraphics.endFill()
        
        // Label
        if (obj.name || obj.key) {
          // Note: Phaser graphics can't draw text, but we mark the area
        }
      }
      
      // Recurse into children
      if (obj.children) {
        obj.children.forEach(child => drawHitArea(child, depth + 1))
      }
    }
    
    drawHitArea(this.game.world)
  }

  // ============ CLEANUP ============

  _unhookAll() {
    // Remove input listeners
    this.game.input.onDown.remove(this._onInputDown)
    this.game.input.onUp.remove(this._onInputUp)
    
    // Restore original Phaser functions
    if (this._originals.spritePlay) {
      Phaser.Sprite.prototype.play = this._originals.spritePlay
    }
    if (this._originals.animUpdate) {
      Phaser.AnimationManager.prototype.update = this._originals.animUpdate
    }
    
    // Restore Mulle functions
    if (this.game.mulle) {
      if (this._originals.playAudio) {
        this.game.mulle.playAudio = this._originals.playAudio
      }
      if (this._originals.stopAudio) {
        this.game.mulle.stopAudio = this._originals.stopAudio
      }
      if (this._originals.playAudioChannel) {
        this.game.mulle.playAudioChannel = this._originals.playAudioChannel
      }
      if (this._originals.getDirectorImage) {
        this.game.mulle.getDirectorImage = this._originals.getDirectorImage
      }
      if (this._originals.findDirectorMember) {
        this.game.mulle.findDirectorMember = this._originals.findDirectorMember
      }
    }
    
    this._originals = {}
  }
}

export default GameObserver
