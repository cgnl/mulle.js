import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleButton from '../objects/button'

class WorldSelectState extends MulleState {
  preload () {
    super.preload()
    this.game.load.pack('worldselect', 'assets/worldselect.json', null, this)
  }

  create () {
    super.create()
    
    this.game.mulle.addAudio('worldselect')

    // Background from 18.DXR
    const background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('18.DXR', 8)
    this.game.add.existing(background)

    // Title text
    const style = { font: '32px Arial', fill: '#ffffff', align: 'center' }
    const title = this.game.add.text(320, 50, 'Selecteer een Wereld', style)
    title.anchor.setTo(0.5, 0.5)

    // List of worlds
    const worlds = this.game.cache.getJSON('MissionsDB') // Actually we need WorldsDB
    // For now, use the hardcoded world "Da Hood" since worlds.hash.json only has one
    
    const worldButton = new MulleButton(this.game, 320, 240, {
      imageDefault: ['18.DXR', 9], // Guessing button sprite
      imageHover: ['18.DXR', 10],
      click: () => {
        this.selectWorld('Da Hood')
      }
    })
    this.game.add.existing(worldButton)

    const worldText = this.game.add.text(320, 240, 'Blauwwater', { font: '24px Arial', fill: '#000000' })
    worldText.anchor.setTo(0.5, 0.5)

    // Cancel button
    const cancelButton = new MulleButton(this.game, 320, 420, {
      imageDefault: ['18.DXR', 27],
      click: () => {
        this.game.state.start('menu')
      }
    })
    this.game.add.existing(cancelButton)
  }

  selectWorld (worldId) {
    console.log('Selected world:', worldId)
    // Set active world in user data
    this.game.mulle.user.activeWorld = worldId
    this.game.state.start('world')
  }

  shutdown () {
    super.shutdown()
  }
}

export default WorldSelectState
