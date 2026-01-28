import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'
import blinkThing from '../util/blinkThing'
import SubtitleLoader from '../objects/SubtitleLoader'

class TreeCarState extends MulleState {
  preload () {
    super.preload()

    this.game.load.pack('treecar', 'assets/treecar.json', null, this)
    this.subtitles = new SubtitleLoader(this.game, 'roadtree', ['dutch', 'english'])
    this.subtitles.preload()
  }

  create () {
    super.create()

    this.game.mulle.addAudio('treecar')
    this.subtitles.load()

    // Background
    var background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('83.DXR', 1)
    this.game.add.existing(background)

    // The car (with Mulle visible for dialog)
    this.car = new MulleBuildCar(this.game, 445, 370, null, true, false)
    this.game.add.existing(this.car)

    // Tree blocking the road
    var tree = new MulleSprite(this.game, 320, 240)
    tree.setDirectorMember('83.DXR', 2)
    this.game.add.existing(tree)

    // Check car strength
    var carStrength = this.game.mulle.user.Car.getProperty('strength', 0)
    console.log('Car strength:', carStrength)

    if (carStrength < 3) {
      // Too weak - can't move the tree
      this.weakCar()
    } else {
      // Strong enough - success!
      this.strongCar(tree)
    }
  }

  weakCar () {
    // Play "too weak" dialog
    this.game.mulle.playAudio('83d003v0', () => {
      // Back to world
      this.game.state.start('world')
    })
  }

  strongCar (tree) {
    // Play success dialogs
    this.game.mulle.playAudio('83d007v0', () => {
      this.game.mulle.playAudio('83d008v0', () => {
        // Mission 5 completed: Cat in tree (rescued)
        if (this.game.mulle.missions) {
          this.game.mulle.missions.markAsCompleted(5)
        }

        // Tree disappears
        new blinkThing(this.game, tree, () => {
          // Show the reward part
          this.showReward()
        }, this)
      })
    })
  }

  showReward () {
    // Get a random part as reward (similar to mudcar pattern)
    var partId = this.game.mulle.user.getRandomPart()
    var partData = this.game.mulle.PartsDB[partId]
    
    // Create the reward part sprite
    var rewardPart = new MulleSprite(this.game, 320, 300)
    rewardPart.setDirectorMember('CDDATA.CXT', partData.junkView)
    rewardPart.partId = partId
    this.game.add.existing(rewardPart)

    // Play success sound and blink effect
    this.game.mulle.playAudio('00d035v0') // Success "DING" sound (shared)

    new blinkThing(this.game, rewardPart, () => {
      // Add part to junk yard
      this.game.mulle.user.Junk.yard[partId] = {
        x: this.game.rnd.integerInRange(290, 580),
        y: 440
      }

      // Mark as complete
      this.game.mulle.user.Car.addCache('#TreeRemoved')

      // Back to world
      this.game.state.start('world')
    }, this)
  }

  shutdown () {
    this.game.mulle.stopAudio('treecar')
    super.shutdown()
  }
}

export default TreeCarState
