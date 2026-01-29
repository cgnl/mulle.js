/**
 * WorldSelectState - Choose between Blauwwater (cars) and Scheepswerf (boats)
 * 
 * Blauwwater = original car world
 * Scheepswerf = boat world (unlocked via sea scene cutscene)
 */
import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleButton from '../objects/button'

class WorldSelectState extends MulleState {
  preload () {
    super.preload()
    // Load world select assets
    this.game.load.pack('worldselect', 'assets/worldselect.json', null, this)
  }

  create () {
    super.create()
    
    this.game.mulle.addAudio('worldselect')

    // Background from 18.DXR (world select scene)
    const background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('18.DXR', 8)
    this.game.add.existing(background)

    // Title
    const title = this.game.add.text(320, 40, 'Kies een Wereld', {
      font: 'bold 36px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 4
    })
    title.anchor.setTo(0.5, 0.5)

    // User data
    const user = this.game.mulle.user

    // === BLAUWWATER (Cars) - Always available ===
    this.createWorldOption({
      x: 160,
      y: 200,
      name: 'Blauwwater',
      description: 'Bouw auto\'s met Miel Monteur!',
      icon: '🚗',
      locked: false,
      onClick: () => this.selectWorld('blauwwater')
    })

    // === SCHEEPSWERF (Boats) - Unlocked via sea scene ===
    const scheepswerfUnlocked = user.scheepswerfUnlocked || false
    
    this.createWorldOption({
      x: 480,
      y: 200,
      name: 'Scheepswerf',
      description: scheepswerfUnlocked 
        ? 'Bouw boten met Christina Colombus!'
        : '🔒 Ontdek de zee om te ontgrendelen...',
      icon: scheepswerfUnlocked ? '⛵' : '🔒',
      locked: !scheepswerfUnlocked,
      onClick: scheepswerfUnlocked 
        ? () => this.selectWorld('scheepswerf')
        : () => this.showLockedMessage()
    })

    // Unlock hint (if still locked)
    if (!scheepswerfUnlocked) {
      const hint = this.game.add.text(320, 340, 
        '💡 Tip: Verken de zee in Blauwwater om de Scheepswerf te ontgrendelen!', {
        font: '16px Arial',
        fill: '#ffff00',
        stroke: '#000000',
        strokeThickness: 2,
        wordWrap: true,
        wordWrapWidth: 500,
        align: 'center'
      })
      hint.anchor.setTo(0.5, 0.5)
    }

    // Back button
    const backBtn = this.game.add.text(320, 420, '← Terug naar Menu', {
      font: 'bold 20px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 3
    })
    backBtn.anchor.setTo(0.5, 0.5)
    backBtn.inputEnabled = true
    
    backBtn.events.onInputOver.add(() => {
      backBtn.fill = '#ffff00'
      this.game.canvas.className = 'cursor-point'
    })
    
    backBtn.events.onInputOut.add(() => {
      backBtn.fill = '#ffffff'
      this.game.canvas.className = ''
    })
    
    backBtn.events.onInputUp.add(() => {
      this.game.state.start('menu')
    })

    // Debug: Press U to unlock Scheepswerf (development only)
    const uKey = this.game.input.keyboard.addKey(Phaser.Keyboard.U)
    uKey.onDown.add(() => {
      if (!user.scheepswerfUnlocked) {
        user.scheepswerfUnlocked = true
        this.game.mulle.saveData()
        console.log('[WorldSelect] DEBUG: Scheepswerf unlocked!')
        this.game.state.restart()
      }
    })
  }

  /**
   * Create a world selection option card
   */
  createWorldOption ({ x, y, name, description, icon, locked, onClick }) {
    const group = this.game.add.group()
    group.x = x
    group.y = y

    // Card background
    const cardBg = this.game.add.graphics(0, 0)
    cardBg.beginFill(locked ? 0x555555 : 0x3366aa, 0.9)
    cardBg.drawRoundedRect(-100, -80, 200, 180, 15)
    cardBg.endFill()
    group.add(cardBg)

    // Icon
    const iconText = this.game.add.text(0, -40, icon, {
      font: '48px Arial'
    })
    iconText.anchor.setTo(0.5, 0.5)
    group.add(iconText)

    // Name
    const nameText = this.game.add.text(0, 20, name, {
      font: 'bold 24px Arial',
      fill: locked ? '#888888' : '#ffffff'
    })
    nameText.anchor.setTo(0.5, 0.5)
    group.add(nameText)

    // Description
    const descText = this.game.add.text(0, 55, description, {
      font: '14px Arial',
      fill: locked ? '#666666' : '#cccccc',
      wordWrap: true,
      wordWrapWidth: 180,
      align: 'center'
    })
    descText.anchor.setTo(0.5, 0.5)
    group.add(descText)

    // Make interactive
    cardBg.inputEnabled = true
    
    cardBg.events.onInputOver.add(() => {
      if (!locked) {
        cardBg.clear()
        cardBg.beginFill(0x4488cc, 1)
        cardBg.drawRoundedRect(-100, -80, 200, 180, 15)
        cardBg.endFill()
      }
      this.game.canvas.className = locked ? 'cursor-no' : 'cursor-point'
    })
    
    cardBg.events.onInputOut.add(() => {
      cardBg.clear()
      cardBg.beginFill(locked ? 0x555555 : 0x3366aa, 0.9)
      cardBg.drawRoundedRect(-100, -80, 200, 180, 15)
      cardBg.endFill()
      this.game.canvas.className = ''
    })
    
    cardBg.events.onInputUp.add(onClick)

    return group
  }

  /**
   * Show message when clicking locked world
   */
  showLockedMessage () {
    // Could play a "locked" sound or show animation
    console.log('[WorldSelect] Scheepswerf is still locked!')
    
    // Shake effect on hint text or show popup
    this.game.mulle.playAudio('02e001v0') // Error/locked sound
  }

  /**
   * Select a world and transition
   */
  selectWorld (worldId) {
    console.log('[WorldSelect] Selected world:', worldId)
    
    // Store active world in user data
    this.game.mulle.user.activeWorld = worldId
    this.game.mulle.saveData()

    if (worldId === 'blauwwater') {
      // Go to car garage (original game)
      this.game.mulle.activeCutscene = '00b011v0'
      this.game.state.start('garage')
    } else if (worldId === 'scheepswerf') {
      // Go to boat yard (new!)
      this.game.mulle.activeCutscene = 'zee_intro' // TODO: Create boat intro
      this.game.state.start('boatyard')
    }
  }

  shutdown () {
    super.shutdown()
    this.game.sound.stopAll()
  }
}

export default WorldSelectState
