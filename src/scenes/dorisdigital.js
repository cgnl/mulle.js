import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'

/*
 * 90e001v0: Game sound
 * 90d001v0: Doris intro by narrator
 * 90d003v0: After the game
 * 90d007v0: Revisit
 */

class DorisDigitalState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('dorisdigital', 'assets/dorisdigital.json', null, this)
  }

  create () {
    super.create()

    this.DirResource = '90.DXR'

    this.game.mulle.addAudio('dorisdigital')

    const background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember(this.DirResource, 1)
    this.game.add.existing(background)

    const gameBlink = new MulleSprite(this.game, 320, 240)
    gameBlink.setDirectorMember(this.DirResource, 18)
    this.game.add.existing(gameBlink)
    gameBlink.addAnimation('game', [['90.DXR', 18], ['90.DXR', 19]], 12, true)
    gameBlink.play('game')

    const bgSnd = this.game.mulle.playAudio('90e001v0')

    console.log('given part', 306)
    if (!this.game.mulle.user.hasPart(306)) {
      this.car = new MulleBuildCar(this.game, 446, 368, null, true, false)
      this.game.add.existing(this.car)

      const part = new MulleSprite(this.game, 82, 373 - 47)
      part.setDirectorMember('CDDATA.CXT', 1003)
      this.game.add.existing(part)

      const buffa = new MulleActor(this.game, 275, 327, 'buffa')
      buffa.animations.play('idle')
      this.game.add.existing(buffa)
      this.game.mulle.actors.buffa = buffa

      this.game.mulle.user.addPart('yard', 306)

      // narrator
      this.game.mulle.playAudio('90d001v0', () => {
        // After game
        this.game.mulle.playAudio('90d003v0', () => {
          console.log('return to world')
          this.game.state.start('world')
          bgSnd.stop()
        })
      })
    } else { // Revisit
      this.car = new MulleBuildCar(this.game, 446, 368, null, true, true)
      this.game.add.existing(this.car)
      this.game.mulle.playAudio('90d007v0', () => {
        bgSnd.stop()
        this.game.state.start('world')
      })
    }
  }

  shutdown () {
    super.shutdown()
  }
}
export default DorisDigitalState
