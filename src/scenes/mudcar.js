import MulleState from './base'
import DirectorHelper from '../objects/DirectorHelper'
import directorAnimation from '../util/directorAnimation'
import movingAnimation from '../util/movingAnimation'
import partUtil from '../util/partUtil'
import blinkThing from '../util/blinkThing'
import MulleActor from '../objects/actor'

/**
 * Car stuck in mud
 * 82.DXR
 */
class MudCarState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('mudcar', 'assets/mudcar.json', null, this)
    this.dirResource = '82.DXR'
    this.game.load.json('JustDoIt_car', 'data/score/82.DXR_JustDoIt_4.json')
    this.game.load.json('JustDoIt_rope', 'data/score/82.DXR_JustDoIt_5.json')
    this.game.load.json('MudcarAnimations', 'data/82.DXR-animations.json')
  }

  /**
   * Animation "titt", driver talks on the phone
   */
  driverAnimation() {
    const driverHead = DirectorHelper.sprite(this.game, 412, 216, this.dirResource, 26)
    this.car_layer.add(driverHead)

    const suckFrames = this.animations['TittAnimChart']['Actions']['suck']
    directorAnimation.addAnimation(driverHead, 'suck', suckFrames, 26, true)
    driverHead.animations.play('suck')

    //Help! i'm stuck in the mud
    this.game.mulle.playAudio('82d009v0', () => {
      driverHead.destroy()
      this.checkStrength()
    })
  }

  /**
   * Check car strength and start the correct animation
   */
  checkStrength() {
    const strength = this.game.mulle.user.Car.getProperty('strength')
    console.log('Car strength is', strength)
    if (strength <= 2) {
      this.weakCar()
    } else {
      this.strongCar()
    }
  }

  addPart () {
    const part = new partUtil(this.game)
    this.partId = part.getPart()
    this.partSprite = part.showPart(this.partId, 412, 326)
    this.background_layer.add(this.partSprite)
  }

  /**
   * Mulle discovers the part
   */
  findPart () {
    /*this.game.mulle.playAudio('82d006v0', () => {

    }*/
    const mulle = new MulleActor(this.game, 15, 254, 'mulleDefault')
    const buffa = DirectorHelper.sprite(this.game, 218, 244, this.dirResource, 57)
    this.game.add.existing(buffa)

    mulle.talkAnimation = 'talkRegular'
    mulle.silenceAnimation = 'idle'
    this.game.add.existing(mulle)
    this.game.mulle.actors.mulle = mulle

    this.game.mulle.actors.mulle.talk('82d006v0', () => {
      new blinkThing(this.game, this.partSprite, this.exit, this)
    })
  }

  strongCar () {
    this.moose()
    this.addPart()
    this.game.mulle.playAudio('82e002v0', () => { this.buffaEnterAnimation() })

    let strongFrames = this.animations['StrongCarAnimChart']['Actions']['strong']
    const strongAnimation = directorAnimation.addAnimation(this.rope, 'strong', strongFrames, 34)
    strongAnimation.onComplete.add(this.pullCar, this)
    this.rope.animations.play('strong', 12)
  }

  pullCar () {
    this.stuckCar.destroy()
    this.rope.destroy()

    const JustDoIt = this.game.cache.getJSON('JustDoIt_car')
    const JustDoItAnimation = new movingAnimation(this.game, this.dirResource, JustDoIt)
    this.game.add.existing(JustDoItAnimation.sprite)
    JustDoItAnimation.play()

    const JustDoItRope = this.game.cache.getJSON('JustDoIt_rope')
    const JustDoItRopeAnimation = new movingAnimation(this.game, this.dirResource, JustDoItRope)
    this.game.add.existing(JustDoItRopeAnimation.sprite)
    JustDoItRopeAnimation.play()
    this.game.mulle.user.Car.addCache('#RescuedMudCar')
  }

  weakCar () {
    this.moose()
    let weakFrames = this.animations['WeakCarAnimChart']['Actions']['Svag']
    directorAnimation.addAnimation(this.rope, 'weak', weakFrames, 34)

    console.log('Engine too weak')
    this.rope.animations.play('weak', 12, true)
    this.game.mulle.playAudio('82e001v0', () => {
      console.log('Audio finished, stop animation')
      this.rope.animations.stop('weak', true)
      this.game.mulle.playAudio('82d003v0', () => {
        this.game.state.start('world')
      })
    })

  }

  buffaEnterAnimation () {
    const sittFrames = this.animations['SittAnimChart']['Actions']['Sitt']
    let x = -16
    const step = 5
    let pos = 0
    const offset = 50
    let frames = []
    for (const cast of sittFrames) {
      frames[pos] = {
        x: x + (step * pos),
        y: 239,
        cast: offset + pos
      }
      pos += 1
    }

    this.buffaAnimation = new movingAnimation(this.game, this.dirResource, frames)
    this.game.add.existing(this.buffaAnimation.sprite)
    this.buffaAnimation.play(this.findPart, this)
  }

  moose() {
    const mooseFrames = this.animations['MooseAnimChart']['Actions']['Blink']
    const mooseSprite = DirectorHelper.sprite(this.game, 87, 155, this.dirResource, 18)
    this.game.add.existing(mooseSprite)
    directorAnimation.addAnimation(mooseSprite, 'blink', mooseFrames, 18)
    mooseSprite.animations.play('blink', 12, false, true)
  }

  create () {
    super.create()
    this.game.mulle.addAudio('mudcar')
    this.car = null

    this.background_layer = this.game.add.group()
    this.car_layer = this.game.add.group()

    const background = DirectorHelper.sprite(this.game, 320, 240, this.dirResource, 1)
    this.background_layer.add(background)

    this.stuckCar = DirectorHelper.sprite(this.game, 389, 279, this.dirResource, 43)
    this.car_layer.add(this.stuckCar)

    this.rope = DirectorHelper.sprite(this.game, 321, 248, this.dirResource, 34)
    this.car_layer.add(this.rope)
    this.animations = this.game.cache.getJSON('MudcarAnimations')

    this.driverAnimation()
  }

  exit() {
    this.game.state.start('world')
  }
}

export default MudCarState