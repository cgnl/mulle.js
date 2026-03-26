import MulleCarPart from '../objects/carpart'

class partUtil {

  /**
   *
   * @param {MulleGame|Phaser.Game} game
   */
  constructor (game) {
    this.game = game
  }

  /**
   *
   * @returns int
   */
  getPart () {
    console.log(this.game.mulle)
    if (this.game.mulle.SetWhenDone === undefined) {
      console.error('SetWhenDone is not defined, state not started from MapObject?')
      return 0
    }
    for (const partId of this.game.mulle.SetWhenDone.Parts) {
      if (partId === '#Random') {
        return this.game.mulle.user.getRandomPart()
      } else {
        if (!this.game.mulle.user.hasPart(partId)) return partId
      }
    }
  }

  /**
   *
   * @param partId
   * @param x
   * @param y
   * @returns {MulleCarPart}
   */
  showPart (partId, x, y) {
    const part = new MulleCarPart(this.game, partId, x, y)
    part.input.inputEnabled = false
    part.input.disableDrag()
    return part
  }
}

export default partUtil
