/**
 * MulleToolbox object
 * @module objects/toolbox
 */
'use strict'

import MulleSprite from 'objects/sprite'

/**
 * Mulle actor, extension of mulle sprite + phaser sprite
 * @extends MulleSprite
 */
class MulleToolbox extends MulleSprite {
  constructor (game, x, y) {
    super(game, x, y)

    this.startX = x
    this.startY = y

    this.isShowing = false
    this.toolboxGroup = null
    this.activeClick = true
    this.currentPanelMember = null
    this.currentSceneWasPaused = false
    this.overlaySprites = []
    this.itemHotspots = []
    this.nowOver = null

    this.setDirectorMember('00.CXT', 97)

    this.inputEnabled = true

    // this.input.useHandCursor = true;

    this.events.onInputOver.add(() => {
      // console.log('hover');

      game.add.tween(this).to({
        x: this.startX - 40,
        y: this.position.y
        // direction: msg.d,
      }, Phaser.Timer.SECOND / 5, Phaser.Easing.Linear.None, true)

      this.game.mulle.playAudio('00e040v0')
    })

    this.events.onInputOut.add(() => {
      // console.log('hover');

      game.add.tween(this).to({
        x: this.startX,
        y: this.position.y
        // direction: msg.d,
      }, Phaser.Timer.SECOND / 5, Phaser.Easing.Linear.None, true)
    })

    this.events.onInputDown.add(() => {
      this.toggleToolbox(this)
    })
  }

  toggleToolbox (me, pointer) {
    if (!me.activeClick) return

    if (me.isShowing) {
      me.isShowing = !me.hideToolbox()
    } else {
      me.isShowing = me.showToolbox()
    }
  }

  activate (yesNo) {
    this.activeClick = !!yesNo
    this.inputEnabled = !!yesNo
  }

  activateClick (yesNo) {
    this.activate(yesNo)
  }

  _getCurrentScene () {
    const key = this.game && this.game.state ? this.game.state.current : null
    return key && this.game.state.states ? this.game.state.states[key] : null
  }

  _createHotspot (left, top, right, bottom, opts = {}) {
    const { id, roll, snd, onClick, onEnter, onLeave } = opts
    const h = this.game.add.graphics(0, 0)
    h.beginFill(0x000000, 0)
    h.drawRect(left, top, right - left, bottom - top)
    h.endFill()
    h.alpha = 0.01
    h.inputEnabled = true
    h.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
      if (id) this.nowOver = id
      if (roll && this.dialogOverlaySprite) {
        this.dialogOverlaySprite.setDirectorMember(roll)
      }
      if (snd) {
        this.game.mulle.playAudio(snd)
      }
      if (onEnter) onEnter()
    })
    h.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
      if (id && this.nowOver === id) {
        this.nowOver = null
        if (this.dialogOverlaySprite) {
          this.dialogOverlaySprite.setDirectorMember('Dummy')
        }
      }
      if (onLeave) onLeave()
    })
    h.events.onInputUp.add(() => {
      if (onClick) onClick()
    })
    this.toolboxGroup.add(h)
    return h
  }

  _setPanelMember (memberName) {
    if (!this.panelSprite) return

    this.currentPanelMember = memberName
    this.panelSprite.setDirectorMember(memberName)
  }

  _openInventoryPanel () {
    this._setPanelMember('09b007v0')

    this._clearOverlaySlots()

    const user = this.game && this.game.mulle ? this.game.mulle.user : null
    const hasItem = (id) => user && typeof user.isInInventory === 'function' && user.isInInventory(id)

    const items = [
      { id: 'Fishingrod', pic: '09b008v0', snd: '09d058v0', x: 228, y: 170 },
      { id: 'Diary', pic: '09b009v0', snd: '09d064v0', x: 276, y: 170 },
      { id: 'Bible', pic: '09b010v0', snd: '09d059v0', x: 324, y: 170 },
      { id: 'Swimring', pic: '09b011v0', snd: '09d062v0', x: 372, y: 170 },
      { id: 'RottenFish', pic: '09b012v0', snd: null, x: 420, y: 170 },
      { id: 'DoctorBag', pic: '09b013v0', snd: '09d063v0', x: 468, y: 170 },
      { id: 'Suit', pic: '09b014v0', snd: '09d060v0', x: 252, y: 236 },
      { id: 'Pills', pic: '09b015v0', snd: null, x: 320, y: 236 },
      { id: 'helmet', pic: '09b016v0', snd: '09d061v0', x: 388, y: 236 }
    ]

    items.forEach((item) => {
      if (!hasItem(item.id)) return

      const slot = this.overlaySprites.find((s) => s.memberName === 'Dummy')
      if (!slot) return

      slot.position.set(320, 240)
      if (slot.setDirectorMember(item.pic)) {
        const rect = slot.getBounds()
        const hs = this._createHotspot(rect.left, rect.top, rect.right, rect.bottom, {
          id: item.id,
          roll: item.pic,
          snd: item.snd,
          onClick: () => {
            if (item.snd) {
              this.game.mulle.playAudio(item.snd)
            }
          }
        })
        this.itemHotspots.push(hs)
      }
    })
  }

  _ensureOverlaySlots () {
    if (this.overlaySprites.length > 0) return

    for (let i = 0; i < 9; i++) {
      const sp = new MulleSprite(this.game, -100, -100)
      sp.setDirectorMember('Dummy')
      this.toolboxGroup.add(sp)
      this.overlaySprites.push(sp)
    }
  }

  _clearOverlaySlots () {
    this.itemHotspots.forEach(s => s.destroy())
    this.itemHotspots = []

    this.overlaySprites.forEach((sp) => {
      sp.position.set(-100, -100)
      sp.setDirectorMember('Dummy')
    })

    if (this.dialogOverlaySprite) {
      this.dialogOverlaySprite.setDirectorMember('Dummy')
    }
    this.nowOver = null
  }

  showToolbox () {
    if (!this.toolboxGroup) {
      this.toolboxGroup = this.game.add.group()

      const shade = this.game.add.graphics(0, 0)
      shade.beginFill(0x000000, 0.45)
      shade.drawRect(0, 0, 640, 480)
      shade.endFill()
      shade.inputEnabled = true
      shade.events.onInputUp.add(() => {
        this.hideToolbox()
      })
      this.toolboxGroup.add(shade)

      this.panelSprite = new MulleSprite(this.game, 320, 240)
      const panelMember = this.game.state.current === 'seaworld' ? '09b002v0' : '09b001v0'
      if (!this.panelSprite.setDirectorMember(panelMember)) {
        this.panelSprite.setDirectorMember('09b001v0')
      }
      this.currentPanelMember = panelMember
      this.toolboxGroup.add(this.panelSprite)

      this.dialogOverlaySprite = new MulleSprite(this.game, 320, 240)
      this.dialogOverlaySprite.setDirectorMember('Dummy')
      this.toolboxGroup.add(this.dialogOverlaySprite)

      this._ensureOverlaySlots()

      // Lingo rects (BehaviorScript 60)
      // ReturnHome / TrashBoat
      this._createHotspot(196, 136, 300, 240, {
        id: this.game.state.current === 'seaworld' ? 'ReturnHome' : 'TrashBoat',
        roll: this.game.state.current === 'seaworld' ? '09b018v0' : '09b017v0',
        snd: this.game.state.current === 'seaworld' ? '09d005v0' : '09d001v0',
        onClick: () => {
          this.hideToolbox()
          const scene = this._getCurrentScene()
          if (scene && typeof scene.returnToBoatyard === 'function') {
            scene.returnToBoatyard()
          } else if (this.game.state.current === 'seaworld') {
            this.game.state.start('boatyard')
          }
        }
      })

      // Diploma
      this._createHotspot(297, 211, 403, 315, {
        id: 'Diploma',
        roll: '09b019v0',
        snd: '09d002v0',
        onClick: () => {
          this.hideToolbox()
          if (this.game.state.current === 'seaworld' && this.game.state.states.help) {
            this.game.state.start('help')
          }
        }
      })

      // Quit
      this._createHotspot(397, 129, 503, 233, {
        id: 'quit',
        roll: '09b020v0',
        snd: '09d003v0',
        onClick: () => {
          this.hideToolbox()
          if (this.game && this.game.mulle && typeof this.game.mulle.saveData === 'function') {
            this.game.mulle.saveData()
          }
        }
      })

      // Inventory
      this._createHotspot(384, 312, 532, 388, {
        id: 'Inventory',
        roll: '09b006v0',
        snd: '09d006v0',
        onClick: () => {
          this._openInventoryPanel()
        }
      })

      // Exit margins like original BGMouseObjects
      this._createHotspot(0, 0, 109, 480, { id: 'exit', onClick: () => this.hideToolbox() })
      this._createHotspot(0, 0, 640, 91, { id: 'exit', onClick: () => this.hideToolbox() })
      this._createHotspot(533, 0, 640, 480, { id: 'exit', onClick: () => this.hideToolbox() })
      this._createHotspot(0, 389, 640, 480, { id: 'exit', onClick: () => this.hideToolbox() })
    }

    this.toolboxGroup.visible = true
    const scene = this._getCurrentScene()
    if (scene && typeof scene.pause === 'function') {
      scene.pause(true)
      this.currentSceneWasPaused = true
    }
    this.game.mulle.cursor.current = null
    return true
  }

  hideToolbox () {
    if (!this.toolboxGroup) {
      return true
    }

    this.toolboxGroup.visible = false

    if (this.currentSceneWasPaused) {
      const scene = this._getCurrentScene()
      if (scene && typeof scene.pause === 'function') {
        scene.pause(false)
      }
      this.currentSceneWasPaused = false
    }

    this._clearOverlaySlots()
    this._setPanelMember(this.game.state.current === 'seaworld' ? '09b002v0' : '09b001v0')

    this.game.mulle.cursor.current = null
    return true
  }
}

export default MulleToolbox
