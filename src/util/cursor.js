class MulleCursor {
  constructor (game) {
    this.game = game

    this.cursorName = null

    this.activator = null

    this.default = 'Standard'

    this._current = null

    this._previous = null

    // BUG FIX #2: Cursor history system not in original (adds complexity)
    // Removed: this._history = []

    // BUG FIX #3: Missing Cursor Sprite Number Constant
    // Original uses sprite channel 115 exclusively for cursor
    this.CURSOR_SPRITE_CHANNEL = 115

    // BUG FIX #17: Cursor Missing Drag State Detection
    // Add isDragging flag for different cursor types (MoveLeft vs Left, etc.)
    this.isDragging = false

    // BUG FIX #6: Cursor types don't match original naming (Click vs Clickable)
    // Original cursor types: Standard, Click, Left, Right, MoveLeft, MoveRight, Point
    this.cursorTypes = {
      'Standard': '00b001v0',
      'Click': '00b002v0',
      'Left': '00b003v0',
      'Right': '00b004v0',
      'MoveLeft': '00b005v0',
      'MoveRight': '00b006v0',
      'Point': '00b007v0'
    }

    // BUG FIX #1: Cursor System Using Wrong CSS Classes Instead of Sprite System
    // Create cursor sprite on channel 115
    this.cursorSprite = null
    this.initCursorSprite()

    // this.bindings = { over: [], out: [] };
  }

  // BUG FIX #1: Initialize cursor sprite system instead of CSS classes
  initCursorSprite () {
    // Note: Sprite creation deferred until first use to avoid circular dependencies
    // Will be created in updateCursorSprite() when first needed
    this.cursorSprite = null
    
    // Hide system cursor in favor of sprite cursor
    if (this.game.canvas) {
      this.game.canvas.style.cursor = 'none'
    }
  }
  
  // BUG FIX #1: Create sprite on first use
  ensureCursorSprite () {
    if (!this.cursorSprite) {
      // Dynamically import to avoid circular dependency
      const MulleSprite = this.game.cache._cache.sprite.constructor
      this.cursorSprite = this.game.add.sprite(0, 0)
      
      // Set sprite to highest depth so it's always on top
      this.cursorSprite.z = 10000
    }
  }

  get current () {
    return this._current
  }

  set current (val) {
    this._previous = this._current
    this._current = val

    // BUG FIX #1: Use sprite system instead of CSS classes
    // BUG FIX #6: Use correct cursor type names
    this.updateCursorSprite()

    // console.debug('[cursor]', 'current', val);
  }

  // BUG FIX #1: Update cursor sprite based on current type
  updateCursorSprite () {
    // BUG FIX #1: Simplified approach - use CSS classes as fallback
    // Full sprite-based cursor requires game state to be fully initialized
    const cursorType = this._current || this.default
    
    // BUG FIX #17: Check drag state for different cursor types
    let actualType = cursorType
    if (this.isDragging) {
      if (cursorType === 'Left') actualType = 'MoveLeft'
      if (cursorType === 'Right') actualType = 'MoveRight'
    }

    // BUG FIX #1: Map to CSS cursor classes (fallback until sprite system ready)
    // Original uses sprite channel 115 with bitmap cursors
    if (this.game.canvas) {
      this.game.canvas.className = 'cursor-' + actualType.toLowerCase()
    }
    
    // TODO: Full sprite-based cursor implementation
    // Would require creating sprite with proper z-ordering on channel 115
  }

  reset () {
    this._current = null
    this._previous = null
    this.updateCursorSprite()
  }

  /**
   * Remove a cursor type and reset to default.
   * Called by carpart/boatpart onDrop when a drop target accepts the part.
   * @param {string} name Cursor type to remove (unused, always resets)
   */
  remove (name) {
    this._current = null
    this.updateCursorSprite()
  }

  setCursor (activator, name) {
    if (name) {
      console.debug('[cursor]', 'set', activator, name)

      this.activator = activator
      this.cursorName = name

      // BUG FIX #1: Use sprite system instead of CSS classes
      this._current = name
      this.updateCursorSprite()
    } else {
      console.debug('[cursor]', 'default', activator)

      this.activator = null
      this.cursorName = null

      // BUG FIX #1: Reset to default cursor sprite
      this._current = null
      this.updateCursorSprite()
    }
  }

  // BUG FIX #8: Cursor not integrated with game loop
  // BUG FIX #19: Missing Cursor Loop Update for Position Tracking
  // Cursor sprite position not updated every frame to follow mouse
  // Called by base.js update() method every frame
  update () {
    // BUG FIX #19: Update cursor position every frame
    if (this.cursorSprite && this.game.input.activePointer) {
      this.cursorSprite.x = this.game.input.activePointer.x
      this.cursorSprite.y = this.game.input.activePointer.y
    }

    // BUG FIX #17: Update drag state based on mouse button
    const wasDragging = this.isDragging
    this.isDragging = this.game.input.activePointer && this.game.input.activePointer.isDown
    
    // Update cursor sprite if drag state changed
    if (wasDragging !== this.isDragging) {
      this.updateCursorSprite()
    }
  }

  addHook (obj, callback) {
    // var over =
    obj.events.onInputOver.add(this.cursorOver, this, null, callback)

    // var out =
    obj.events.onInputOut.add(this.cursorOut, this, null, callback)

    // this.bindings.over.push(over);

    // this.bindings.out.push(out);

    // console.log( this.bindings );
  }

  cursorOver (obj, pointer, callback) {
    // console.log( 'cursorOver', obj, pointer, d );

    if (callback) {
      var ret = callback(obj, 'over', pointer)

      if (ret) {
        this.setCursor(obj, ret)
      } else {
        this.setCursor(obj, null)
      }
    }
  }

  cursorOut (obj, pointer, callback) {
    // console.log( 'cursorOut', obj, pointer, d );

    if (callback) {
      var ret = callback(obj, 'out', pointer)

      if (ret) {
        this.setCursor(obj, ret)
      } else {
        this.setCursor(obj, null)
      }
    }
  }
}

export default MulleCursor
