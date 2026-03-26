import MulleState from './base'
import MulleSprite from '../objects/sprite'

/**
 * OceanState - Ocean/beach scene (93.DXR)
 *
 * Lingo/asset-backed content is limited to background + audio.
 * We avoid invented visuals and keep the sequence minimal.
 */
class OceanState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('ocean', 'assets/ocean.json', null, this)
  }

  create () {
    super.create()

    this.game.mulle.addAudio('ocean')
    this.game.mulle.playAudio('93e001v0')

    const background = new MulleSprite(this.game, 320, 240)
    if (!background.setDirectorMember('93.DXR', 1)) {
      console.warn('[Ocean] Background 93.DXR:1 missing, hiding (Dummy)')
      background.setDirectorMember('Dummy')
    }
    this.game.add.existing(background)

    const user = this.game.mulle.user
    if (!user.scheepswerfUnlocked) {
      user.scheepswerfUnlocked = true
      this.game.mulle.saveData()
      console.log('[Ocean] SCHEEPSWERF UNLOCKED')
    }

    if (!user.seenBoatDream) {
      user.seenBoatDream = true
      this.playDialogSequence(() => {
        this.game.state.start('world')
      })
    } else {
      this.game.time.events.add(2000, () => {
        this.game.state.start('world')
      })
    }
  }

  playDialogSequence (onComplete) {
    const sequence = ['93d001v0', '93d002v0', '93d003v0']

    const playNext = (index = 0) => {
      if (index >= sequence.length) {
        if (onComplete) onComplete()
        return
      }

      const sound = this.game.mulle.playAudio(sequence[index], () => {
        playNext(index + 1)
      })

      if (!sound) {
        playNext(index + 1)
      }
    }

    playNext(0)
  }

  shutdown () {
    this.game.mulle.stopAudio('93e001v0')
    super.shutdown()
  }
}

export default OceanState
