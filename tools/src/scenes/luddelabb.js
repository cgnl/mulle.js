import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'
import blinkThing from '../util/blinkThing'
import SubtitleLoader from '../objects/SubtitleLoader'

class LuddeLabState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('luddelabb', 'assets/luddelabb.json', null, this)
    this.subtitles = new SubtitleLoader(this.game, 'luddelabb', ['dutch', 'english'])
    this.subtitles.preload()
  }

  create () {
    super.create()

    this.game.mulle.addAudio('luddelabb')
    this.subtitles.load()

    // Play background sound
    this.game.mulle.playAudio('91e001v0')

    // Background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('91.DXR', 1)
    this.game.add.existing(background)

    // The car (with Mulle visible)
    this.car = new MulleBuildCar(this.game, 445, 370, null, true, false)
    this.game.add.existing(this.car)

    // Boris Blaff (dog kennel owner) - need to find sprite
    var boris = new MulleSprite(this.game, 200, 300)
    boris.setDirectorMember('91.DXR', 10) // Placeholder frame number
    this.game.add.existing(boris)

    // Dogs animation (optional - add if sprites exist)
    // var dog1 = new MulleSprite(this.game, 150, 350)
    // dog1.setDirectorMember('91.DXR', 15)
    // this.game.add.existing(dog1)

    // Play dialog sequence
    this.playDialogs()
  }

  playDialogs () {
    // 91d001v0: "Boris Blaff is een echte avonturier..."
    this.game.mulle.playAudio('91d001v0', () => {
      // 91d003v0: "Op een avond... kreeg Miel de wagen waarin Boris al het goud bewaarde"
      this.game.mulle.playAudio('91d003v0', () => {
        // 91d007v0: "Ik ga graag op bezoek bij die goeie ouwe Boris..."
        this.game.mulle.playAudio('91d007v0', () => {
          // Give reward
          this.giveReward()
        })
      })
    })
  }

  giveReward () {
    // Get a random part as reward
    var partId = this.game.mulle.user.getRandomPart()
    var partData = this.game.mulle.PartsDB[partId]
    
    // Create the reward part sprite (wagon/cart)
    var rewardPart = new MulleSprite(this.game, 320, 300)
    rewardPart.setDirectorMember('CDDATA.CXT', partData.junkView)
    rewardPart.partId = partId
    this.game.add.existing(rewardPart)

    // Play success DING sound
    this.game.mulle.playAudio('00d035v0') // Success "DING" sound

    new blinkThing(this.game, rewardPart, () => {
      // Add part to junk yard
      this.game.mulle.user.Junk.yard[partId] = {
        x: this.game.rnd.integerInRange(290, 580),
        y: 440
      }

      // Mark as complete
      this.game.mulle.user.Car.addCache('#LuddeLabVisited')

      // Mission 6 completed: Ludde Labb
      if (this.game.mulle.missions) {
        this.game.mulle.missions.markAsCompleted(6)
      }

      // Stop background sound
      this.game.mulle.stopAudio('91e001v0')

      // Back to world
      this.game.state.start('world')
    }, this)
  }

  shutdown () {
    this.game.mulle.stopAudio('91e001v0')
    super.shutdown()
  }
}

export default LuddeLabState
