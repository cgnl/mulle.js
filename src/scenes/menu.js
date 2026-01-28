import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleActor from '../objects/actor'
// import MulleAudio from '../objects/audio'

import MulleSave from '../struct/savedata'

class MenuState extends MulleState {
  preload () {
    // this.game.load.pack('menu', 'assets/menu.json', null, this);
    this.game.load.pack('menu', 'assets/menu.json', null, this)
  }

  create () {
    this.game.mulle.addAudio('menu')

    var background = new MulleSprite(this.game, 320, 240)
    // background.setFrameId('11b001v0');
    background.setDirectorMember('10.DXR', 2)
    this.game.add.existing(background)

    var mulleBase = new MulleSprite(this.game, 139, 296)
    mulleBase.setDirectorMember('10.DXR', 125)
    this.game.add.existing(mulleBase)

    var mulleHead = new MulleActor(this.game, 139, 296, 'mulleMenuHead')
    mulleHead.animations.play('idle')
    this.game.add.existing(mulleHead)
    // this.game.mulle.actors.mulle = mulle;

    var mulleMouth = new MulleActor(this.game, 139, 296, 'mulleMenuMouth')
    mulleMouth.animations.play('idle')
    this.game.add.existing(mulleMouth)

    this.nameInput = document.createElement('input')
    this.nameInput.style.position = 'absolute'
    this.nameInput.style.top = '60px'
    this.nameInput.style.left = '90px'
    this.nameInput.style.border = 'none'
    this.nameInput.style.font = '28px serif'
    this.nameInput.style.padding = '4px'
    this.nameInput.style.background = 'none'
    this.nameInput.style.width = '180px'

    this.nameInput.addEventListener('keyup', (ev) => {
      let name = this.nameInput.value

      if (ev.keyCode === 13) {
        if (this.game.mulle.UsersDB[ name ]) {
          this.game.mulle.user = this.game.mulle.UsersDB[ name ]
        } else {
          let save = new MulleSave(this.game)
          save.UserId = name

          this.game.mulle.UsersDB[ name ] = save
          this.game.mulle.saveData()

          this.game.mulle.user = save
        }

        this.game.mulle.activeCutscene = '00b011v0'

        this.game.mulle.net.send({ name: name })

        this.game.state.start('garage')
      }
    })

    document.getElementById('player').appendChild(this.nameInput)

    let y = 60
    for (let name in this.game.mulle.UsersDB) {
      // Name text (clickable to load)
      let text = this.game.add.text(350, y, name, { font: '24px serif' })
      text.inputEnabled = true

      text.events.onInputOver.add((e) => {
        this.game.canvas.className = 'cursor-point'
      }, this)

      text.events.onInputOut.add((e) => {
        this.game.canvas.className = ''
      }, this)

      text.events.onInputUp.add((e) => {
        this.game.canvas.className = ''

        this.game.mulle.user = this.game.mulle.UsersDB[ name ]

        this.game.mulle.activeCutscene = '00b011v0'

        this.game.mulle.net.send({ name: name })

        this.game.state.start('garage')
      }, this)

      // Delete button
      let deleteBtn = this.game.add.text(520, y, '🗑️', { 
        font: '20px sans-serif',
        fill: '#cc0000'
      })
      deleteBtn.inputEnabled = true
      
      deleteBtn.events.onInputOver.add(() => {
        deleteBtn.fill = '#ff0000'
        this.game.canvas.className = 'cursor-point'
      }, this)
      
      deleteBtn.events.onInputOut.add(() => {
        deleteBtn.fill = '#cc0000'
        this.game.canvas.className = ''
      }, this)
      
      deleteBtn.events.onInputUp.add((sprite, pointer) => {
        // Stop event propagation to prevent triggering parent text click
        pointer.stopPropagation = true
        
        // Confirmation dialog
        if (confirm(`Verwijder "${name}"?\n\nDeze actie kan niet ongedaan gemaakt worden.`)) {
          // Delete from database
          delete this.game.mulle.UsersDB[name]
          this.game.mulle.saveData()
          
          console.log('[Menu] Deleted user:', name)
          
          // Refresh the scene to update the list
          this.game.state.restart()
        }
      }, this)

      y += 30
    }

    this.game.mulle.subtitle.setLines('11d001v0', 'swedish', [
      '- Hej!',
      '- Jag heter {Mulle Meck}!',
      '- Vill du bygga bilar med mig?',
      '- Skriv ditt namn så kan vi sätta igång.',
      '- Har du byggt förr så klickar du på ditt namn i {listan}.'
    ], 'mulle')

    this.game.mulle.subtitle.setLines('11d001v0', 'english', [
      '- Hello!',
      '- My name is {Mulle Meck}!',
      '- Do you want to build cars with me?',
      '- Write down your name so we can start.',
      "- If you've been here before, click your name in the {list}."
    ], 'mulle')

    this.game.mulle.playAudio('10e001v0', () => {
      if (!mulleMouth) return

      this.game.mulle.playAudio('10e002v0')

      mulleMouth.talk('11d001v0', null, c => {
        if (c[1] === 'silence') mulleMouth.animations.play('idle', 0)
        if (c[1] === 'talk') mulleMouth.animations.play('talkPlayer')

        if (c[1] === 'point') {
          mulleHead.animations.play('point')
          console.log('do point')
        }
      })
    })

    // Hotkey C for credits
    const cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C)
    cKey.onDown.add(() => {
      this.game.state.start('credits')
    })

    // Hotkey W for world select
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      this.game.state.start('worldselect')
    })
    
    // "Browse Files" button
    const browseBtn = this.game.add.text(320, 420, '📁 Bekijk Alle Auto\'s', {
      font: 'bold 20px Arial',
      fill: '#0066cc',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    browseBtn.anchor.set(0.5)
    browseBtn.inputEnabled = true

    browseBtn.events.onInputOver.add(() => {
      browseBtn.fill = '#0088ff'
      browseBtn.scale.set(1.1)
      this.game.canvas.className = 'cursor-point'
    })

    browseBtn.events.onInputOut.add(() => {
      browseBtn.fill = '#0066cc'
      browseBtn.scale.set(1.0)
      this.game.canvas.className = ''
    })

    browseBtn.events.onInputUp.add(() => {
      this.game.state.start('filebrowser')
    })
    
    // Hotkey B for file browser
    const bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B)
    bKey.onDown.add(() => {
      this.game.state.start('filebrowser')
    })
  }

  shutdown () {
    if (this.nameInput) this.nameInput.parentNode.removeChild(this.nameInput)

    this.game.sound.stopAll()

    // this.game.mulle.stopAudio('10e002v0');

    this.nameInput = null

    // this.game.mulle.stopAudio('02e010v0');
  }
}

export default MenuState
