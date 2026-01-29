class blinkThing {
  /**
   *
   * @param {MulleGame|Phaser.Game} game
   * @param {Phaser.Sprite} sprite Sprite to blink
   * @param {function} callback - The callback that will be called when the blink ends.
   * @param {object} callbackContext - The context in which the callback will be called.
   */
  constructor (game, sprite, callback=undefined, callbackContext = this) {
    this.game = game
    this.callback = callback
    this.callbackContext = callbackContext
    this.sound = this.game.mulle.playAudio('00e028v0')
    this.sprite = sprite

    this.blinkSprite()
  }

  blinkSprite (frequency = 2) {
    // 12 fps, 2 blink per frame, 6 blink per second
    const delay = (1000 / 12) * frequency
    this.toggleSprite(delay)
  }

  toggleSprite (delay) {
    this.sprite.visible = !this.sprite.visible
    console.debug('Visible', this.sprite.visible, 'Playing', this.sound.isPlaying, 'delay', delay)
    if (this.sound.isPlaying) { this.game.time.events.add(delay, this.toggleSprite, this, delay) } else {
      this.sprite.destroy()
      if (this.callback !== undefined) { this.callback.apply(this.callbackContext) }
    }
  }
}

export default blinkThing
