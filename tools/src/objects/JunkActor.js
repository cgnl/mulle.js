import MulleActor from './actor'

class MulleJunkActor extends MulleActor {
  /**
   * MulleActor used in the junk yard
   * @param  {Phaser.Game} game  Main game
   * @param  {number}      x     x coordinate
   * @param  {number}      y     y coordinate
   * @param {boolean} faceLeft Face left
   */
  constructor (game, x, y, faceLeft = true) {
    super(game, x, y, 'mulleJunkYard', true)
    this.movie = '02.DXR'

    const Talk = [1, 2, 3, 4, 5, 6, 7, 8]
    const TalkToMe = [10, 11, 12, 13, 14, 15, 16, 17, 18]

    let firstFrame
    if (faceLeft) {
      firstFrame = 246 // StartL
    } else {
      firstFrame = 226 // StartH
    }

    this.setDirectorMember(this.movie, firstFrame)

    this.addDirectorAnimation('idle', firstFrame, [1], true)
    this.addDirectorAnimation('talk', firstFrame, Talk, true)
    this.addDirectorAnimation('talkPlayer', firstFrame, TalkToMe, true)
    this.addDirectorAnimation('lookPlayer', firstFrame, [10], true)
  }
}

export default MulleJunkActor