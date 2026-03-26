/* global Phaser */
/**
 * Button extension
 * @module objects/button
 */
'use strict'

import MulleSprite from 'objects/sprite'

/**
 * Mulle button
 * @extends Phaser.Button
 */
class MulleButton extends Phaser.Button {
  constructor (game, x, y, opt) {
    super(game, x, y)

    this.opt = opt

    // BUG FIX #5: Button missing loopCounter for tooltip timing (15 frames)
    // Original shows tooltip after hovering for 15 frames (~1 second at 15 FPS)
    this.loopCounter = 0
    this.tooltipDelay = 15 // frames
    this.isHovering = false
    
    // BUG FIX #15: Button missing active state check on click
    this.isActive = true

    this.displaySprite = new MulleSprite(this.game, this.x, this.y)

    // this.displaySprite.loadTexture( this.opt.imageDefault[0], this.opt.imageDefault[1].toString() );
    if (this.opt.imageDefault) {
      this.displaySprite.setDirectorMember(this.opt.imageDefault[0], this.opt.imageDefault[1])

      this.game.add.existing(this.displaySprite)

      if (this.displaySprite._frame) {
        this.hitArea = new Phaser.Rectangle(
          -this.displaySprite.regPoint.x,
          -this.displaySprite.regPoint.y,
          this.displaySprite._frame.width,
          this.displaySprite._frame.height
        )
      }
      // Note: If using fromRectangle(), hit area is set via width/height properties
    } else {
      // For fromRectangle buttons, add the displaySprite but no texture
      this.game.add.existing(this.displaySprite)
    }

    this.input.useHandCursor = false

    // BUG FIX #12: Intro skip button cursor type wrong ('Point' instead of 'Click')
    // Default to 'Click' but allow override via opt.cursor
    this.cursor = this.opt.cursor || 'Click'
  }

  /**
   * Create a button without a texture
   * @param {Phaser.Game} game
   * @param {int} x Left
   * @param {int} y Top
   * @param {int} w Width
   * @param {int} h Height
   * @param opt Options
   */
  static fromRectangle (game, x, y, w, h, opt) {
    const button = new MulleButton(game, x, y, opt)
    button.width = w
    button.height = h
    
    // CRITICAL FIX: Set hitArea for fromRectangle buttons
    // Without this, clicks on rectangle buttons don't work!
    // The hit area is centered on the button position
    button.hitArea = new Phaser.Rectangle(-w / 2, -h / 2, w, h)
    
    return button
  }

  onInputOverHandler () {
    // BUG FIX #5: Start loopCounter for tooltip timing
    this.isHovering = true
    this.loopCounter = 0
    
    if (this.cursor) this.game.mulle.cursor.current = this.cursor

    if (this.displaySprite && this.opt.imageHover) this.displaySprite.setDirectorMember(this.opt.imageHover[0], this.opt.imageHover[1])

    if (this.opt.soundHover) this.game.mulle.playAudio(this.opt.soundHover)
  }

  onInputOutHandler () {
    // BUG FIX #5: Reset loopCounter when leaving
    this.isHovering = false
    this.loopCounter = 0
    
    this.game.mulle.cursor.current = null

    // BUG FIX #4: Button hover image not restored on mouseLeave after click
    // Always restore default image on mouse out
    if (this.displaySprite && this.opt.imageDefault) {
      this.displaySprite.setDirectorMember(this.opt.imageDefault[0], this.opt.imageDefault[1])
    }

    if (this.opt.soundDefault) this.game.mulle.playAudio(this.opt.soundDefault)
  }

  onInputUpHandler () {
    // BUG FIX #15: Button missing active state check on click
    // Only process click if button is active
    if (!this.isActive) {
      console.debug('[Button] Click ignored - button inactive')
      return
    }
    
    if (this.opt.click) {
      this.opt.click()
    }
  }

  onDown () {

  }

  /**
   * Destroy the button and its sprite
   * @param destroyChildren
   */
  destroy (destroyChildren) {
    super.destroy(destroyChildren)
    this.displaySprite.destroy()
  }

  /**
   * Hide the button and its sprite
   */
  hide() {
    this.visible = false
    this.displaySprite.visible = false
  }

  /**
   * Show the button and its sprite
   */
  show() {
    this.visible = true
    this.displaySprite.visible = true
  }

  /**
   * BUG FIX #5: Button missing loopCounter for tooltip timing (15 frames)
   * Update method to increment loopCounter for tooltip display
   */
  update() {
    if (this.isHovering) {
      this.loopCounter++
      
      // After 15 frames of hovering, show tooltip if available
      if (this.loopCounter === this.tooltipDelay && this.opt.tooltip) {
        this.showTooltip()
      }
    }
  }

  /**
   * BUG FIX #5: Show tooltip after hover delay
   */
  showTooltip() {
    // Tooltip implementation would go here
    console.debug('[Button] Show tooltip:', this.opt.tooltip)
  }
}

export default MulleButton
