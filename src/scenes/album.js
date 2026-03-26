/* global Phaser */
import MulleState from './base'

import TextInput from '../objects/TextInput'
import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleFileBrowser from '../objects/MulleFileBrowser'
import LoadSaveBoat from '../util/LoadSaveBoat'
import DirectorHelper from '../objects/DirectorHelper'
import MouseObject from '../objects/input/MouseObject'
import BoatViewHandler from '../objects/boat/BoatViewHandler'

const rect = (left, top, right, bottom) => ({ left, top, right, bottom })

const MEDAL_MAP = {
  1: '00n001v0',
  2: '00n003v0',
  3: '00n005v0',
  4: '00n006v0',
  5: '00n008v0',
  6: '00n007v0'
}

function rectFromMemberAtLoc(game, dir, member, loc) {
  if (!game || !game.mulle || typeof game.mulle.getDirectorImage !== 'function') return null
  const img = game.mulle.getDirectorImage(dir, member)
  if (!img || !img.frame || !loc) return null
  const reg = img.frame.regpoint || { x: 0, y: 0 }
  const left = loc.x - reg.x
  const top = loc.y - reg.y
  return {
    left,
    top,
    right: left + img.frame.width,
    bottom: top + img.frame.height
  }
}

class AlbumButton {
  constructor(album, dir, member, loc, layer, onClick) {
    this.album = album
    this.dir = dir
    this.member = member
    this.loc = loc
    this.layer = layer
    this.onClick = onClick
    this.active = true
    this.sprite = null
    this.mouseObject = null
    this._create()
  }

  _create() {
    this.sprite = new MulleSprite(this.album.game, this.loc.x, this.loc.y)
    this.sprite.setDirectorMember(this.dir, this.member)
    this.album.uiLayer.add(this.sprite)
    const area = rectFromMemberAtLoc(this.album.game, this.dir, this.member, this.loc)
    if (area) {
      this.mouseObject = new MouseObject(this, [area], this.layer, { report: 1 }, this.album.globals)
    }
  }

  setMember(member) {
    this.member = member
    if (this.sprite) this.sprite.setDirectorMember(this.dir, member)
    const area = rectFromMemberAtLoc(this.album.game, this.dir, member, this.loc)
    if (area && this.mouseObject) {
      this.mouseObject.areaList = [area]
    }
  }

  setActive(state) {
    this.active = !!state
    if (this.mouseObject && typeof this.mouseObject.setActive === 'function') {
      this.mouseObject.setActive(this.active)
    }
    if (this.sprite) this.sprite.visible = this.active
  }

  mouse(argObj, argWhat) {
    if (!this.active) return
    if (argWhat === 'click' && this.onClick) {
      this.onClick()
    }
  }

  kill() {
    if (this.mouseObject) {
      this.mouseObject.kill()
      this.mouseObject = null
    }
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
  }
}

class LoadSaveButton extends AlbumButton {
  constructor(album, dir, member, loc, layer, onClick) {
    super(album, dir, member, loc, layer, onClick)
    this.rolling = 0
    this.sndId = null
  }

  mouse(argObj, argWhat) {
    if (!this.active) return
    if (argWhat === 'enter') {
      this.rolling = 1
      return
    }
    if (argWhat === 'Leave') {
      this.rolling = 0
      if (this.sndId && this.sndId.stop) {
        this.sndId.stop()
      }
      return
    }
    if (argWhat === 'click') {
      this.album.playEffect('SndMouseClick')
      this.album.handleLoadSaveClick()
    }
  }

  // Lingo: LoadSaveCarBH.exitFrame – stopAllEffects before hover sound
  exitFrame() {
    if (!this.rolling) return
    this.rolling += 1
    if (this.rolling === 15) {
      this.album.stopAllEffects()
      if (this.album.mode === 'save') {
        this.sndId = this.album.playEffect('06d007v0')
      } else {
        this.sndId = this.album.playEffect('07d005v0')
      }
    }
  }
}

class AlbumSlot {
  constructor(album, saveNr, sprite) {
    this.album = album
    this.saveNr = saveNr
    this.sprite = sprite
    this.active = true
    this.mouseObject = null
    this._createMouseObject()
  }

  _createMouseObject() {
    const member = 49 + (this.saveNr - 1)
    const baseRect = rectFromMemberAtLoc(this.album.game, this.album.DirResource, member, { x: 320, y: 240 })
    if (!baseRect) return
    const extend = 20
    const area = rect(
      baseRect.left - extend,
      baseRect.top - extend,
      baseRect.right + extend,
      baseRect.bottom + extend
    )
    this.mouseObject = new MouseObject(this, [area], 500, { report: 1 }, this.album.globals)
  }

  mouse(argObj, argWhat) {
    if (!this.active) return
    if (argWhat === 'click') {
      this.album.onSlotClicked(this.saveNr)
    }
  }

  setActive(state) {
    this.active = !!state
    if (this.mouseObject && typeof this.mouseObject.setActive === 'function') {
      this.mouseObject.setActive(this.active)
    }
  }

  kill() {
    if (this.mouseObject) {
      this.mouseObject.kill()
      this.mouseObject = null
    }
  }
}

class ReplaceDialog {
  constructor(album) {
    this.album = album
    this.sprite = null
    this.mouseObjects = []
    this._create()
  }

  _create() {
    this.album.playEffect('06d004v0')
    this.sprite = new MulleSprite(this.album.game, 528, 437)
    this.sprite.setDirectorMember(this.album.DirResource, 160)
    this.album.uiLayer.add(this.sprite)

    const yesArea = rect(469, 433, 524, 464)
    const noArea = rect(530, 432, 585, 463)
    this.mouseObjects = [
      new MouseObject(this, [yesArea], 500, { report: 1 }, this.album.globals),
      new MouseObject(this, [noArea], 500, { report: 1 }, this.album.globals)
    ]
  }

  mouse(argObj, argWhat) {
    if (argWhat !== 'click') return
    const idx = this.mouseObjects.indexOf(argObj)
    this.kill()
    if (idx === 0) {
      this.album.prepareEnterName()
    }
  }

  kill() {
    if (this.sprite) {
      this.sprite.destroy()
      this.sprite = null
    }
    this.mouseObjects.forEach((obj) => obj.kill())
    this.mouseObjects = []
  }
}

/**
 * Album UI - Boten versie (Lingo parity)
 *
 * Lingo contracts from FileStuff.ls / Dir.ls / MemoryControlBH.ls:
 *   Inventory: Blueprint1, Blueprint2, BluePrint3 (hull size blueprints)
 *   State: checkmemory (MemoryControlBH.ls), loopMaster (BehaviorScript 1.ls)
 *   Global: drawBoat (ShowSavedCarBH.ls, Dir.ls)
 */

// FileStuff.ls: checkBoat validates hull blueprint ownership
const ALBUM_BLUEPRINT_ITEMS = ['Blueprint1', 'Blueprint2', 'BluePrint3']

// BehaviorScript 9 - MemoryControlBH.ls: set the checkmemory of gMulleGlobals
// BehaviorScript 1.ls: uses loopMaster for exitFrame idle loop
const ALBUM_STATE_FIELDS = { checkmemory: null, loopMaster: null }

// ShowSavedCarBH.ls / Dir.ls: drawBoat(point(…)) renders saved boat preview
const ALBUM_DRAW_BOAT_FN = 'drawBoat'

class AlbumState extends MulleState {
  init(mode) {
    this.mode = mode
    this.returnTo = this.game.mulle.whereFrom || 'boatyard'
  }

  preload() {
    this.DirResource = '06.DXR'
    super.preload()
    this.game.load.pack('album', 'dist/assets/album.json', null, this)
    this.game.load.pack('fileBrowser', 'dist/assets/fileBrowser.json', null, this)
  }

  create() {
    this.game.mulle.addAudio('album')
    super.create()

    this.loadSave = new LoadSaveBoat(this.game)
    this.globals = this.game.mulle.gMulleGlobals || null

    // Ensure BoatViewHandler exists for PhotoBook offset
    if (this.globals && (!this.globals.boatViewHandler || !this.globals.boatViewHandler.getDrawOffset)) {
      this.globals.boatViewHandler = new BoatViewHandler(this.globals)
    }
    this.boatViewHandler = this.globals ? this.globals.boatViewHandler : null

    this.backgroundLayer = this.game.add.group()
    this.boatLayer = this.game.add.group()
    this.uiLayer = this.game.add.group()

    this.background = new MulleSprite(this.game, 320, 240)
    this.background.setDirectorMember(this.DirResource, 93)
    this.backgroundLayer.add(this.background)

    // Overlays (hidden by default)
    this.bottomOverlay = new MulleSprite(this.game, 320, 240)
    this.bottomOverlay.setDirectorMember('Dummy')
    this.uiLayer.add(this.bottomOverlay)
    this.leftOverlay = new MulleSprite(this.game, 320, 240)
    this.leftOverlay.setDirectorMember('Dummy')
    this.uiLayer.add(this.leftOverlay)

    // Flerp (selected slot highlight)
    this.flerpSprite = new MulleSprite(this.game, 320, 240)
    this.flerpSprite.setDirectorMember('Dummy')
    this.uiLayer.add(this.flerpSprite)

    // Slot digits + mouseObjects
    this.slotSprites = []
    this.slotButtons = []
    for (let i = 1; i <= 12; i++) {
      const sprite = new MulleSprite(this.game, 320, 240)
      sprite.setDirectorMember(this.DirResource, 48 + i)
      this.uiLayer.add(sprite)
      this.slotSprites.push(sprite)
      this.slotButtons.push(new AlbumSlot(this, i, sprite))
    }

    // Medals group
    this.medalSprites = []

    // Name input background (matches old placement)
    this.nameFieldSprite = DirectorHelper.sprite(this.game, 210, 427, this.DirResource, 101, false, false)
    this.uiLayer.add(this.nameFieldSprite)
    this.boatNameInput = new TextInput(this.game, this.nameFieldSprite.x + 5, this.nameFieldSprite.y + 5, 203, 20)
    this.boatNameInput.id('boat_name')
    this.boatNameInput.input.addEventListener('input', () => {
      this.changedName = true
      this._clampNameWidth()
      this._setMemberText('SavedBoatName', this.boatNameInput.value())
    })

    // Close button – Lingo: GoBackBH plays SndMouseClick then goes to "Leave"
    this.closeButton = new AlbumButton(this, this.DirResource, 153, { x: 320, y: 240 }, 500, () => {
      this.playEffect('SndMouseClick')
      this.close()
    })

    // Load/save main button (LoadSaveCarBH parity)
    const loadSaveMember = (this.mode === 'save') ? 164 : 161
    this.loadSaveButton = new LoadSaveButton(this, this.DirResource, loadSaveMember, { x: 320, y: 240 }, 500, () => {})

    // Load-from-album button (arrow)
    this.loadButton = new AlbumButton(this, this.DirResource, 162, { x: 320, y: 240 }, 500, () => {
      if (this.mode === 'load') {
        this.loadSelectedBoat()
      } else {
        if (this.slotOccupied) {
          this.replaceAsk()
        } else {
          this.prepareEnterName()
        }
      }
    })
    if (this.mode === 'save') {
      this.loadButton.setActive(false)
    }

    // Cover overlay (rectum fallback)
    this.coverOverlay = this.game.add.graphics(0, 0)
    this.coverOverlay.beginFill(0x000000, 0.5)
    this.coverOverlay.drawRect(0, 0, 640, 480)
    this.coverOverlay.endFill()
    this.coverOverlay.visible = false
    this.uiLayer.add(this.coverOverlay)

    // Overlay prompt sprite (shown when LoadSave dialog opens)
    this.overlayPrompt = new MulleSprite(this.game, 515, 438)
    this.overlayPrompt.setDirectorMember('Dummy')
    this.uiLayer.add(this.overlayPrompt)
    this.overlayMouseObjects = []

    this.slotOccupied = false
    this.chosenSlot = 1
    this.firstFree = 1
    this.changedName = false
    this.boatSaved = false
    this.boatPasted = false
    this.currentBoatSlot = 0
    this.cheatLoad = 0

    this.findFirstFree()

    if (this.mode === 'save') {
      this.playEffect('06e002v0', () => this.playEffect('06d001v0'))
    } else {
      const anySaved = this._hasAnySaved()
      this.playEffect(anySaved ? '07d001v0' : '07d003v0')
    }

    this.onSlotClicked(this.firstFree || 1, true)
  }

  enterFrame() {
    if (this.loadSaveButton) {
      this.loadSaveButton.exitFrame()
    }
  }

  playEffect(id, onStop) {
    if (this.game && this.game.mulle && typeof this.game.mulle.playAudio === 'function') {
      return this.game.mulle.playAudio(id, onStop)
    }
    return null
  }

  // Lingo: stopAllEffects(gSound)  (Dir.ls, LoadSaveCarBH.ls)
  stopAllEffects() {
    if (this.game && this.game.mulle && this.game.mulle.sound &&
        typeof this.game.mulle.sound.stopAllEffects === 'function') {
      this.game.mulle.sound.stopAllEffects()
    }
  }

  _getMemberText(name) {
    if (this.game && typeof this.game.getMemberText === 'function') {
      return this.game.getMemberText(name)
    }
    return ''
  }

  _setMemberText(name, text) {
    if (this.game && typeof this.game.setMemberText === 'function') {
      this.game.setMemberText(name, text)
    }
  }

  // Lingo: Dir.activateScreen – enable/disable all interactive elements
  _setScreenActive(state) {
    this.slotButtons.forEach((btn) => btn.setActive(!!state))
    if (this.closeButton) this.closeButton.setActive(!!state)
    if (this.loadSaveButton) this.loadSaveButton.active = !!state
    // Lingo: InsertBoat deactivated when save mode and not yet pasted
    if (state && this.mode === 'save' && !this.boatPasted) {
      if (this.loadButton) this.loadButton.setActive(true)
    } else if (!state) {
      if (this.loadButton) this.loadButton.setActive(false)
    }
  }

  _hasAnySaved() {
    const saved = this.game.mulle.user && this.game.mulle.user.savedBoats
    if (!saved) return false
    for (let i = 1; i <= 12; i++) {
      if (saved[i]) return true
    }
    return false
  }

  _isSlotSaved(slot) {
    const saved = this.game.mulle.user && this.game.mulle.user.savedBoats
    if (!saved) return false
    const entry = saved[slot]
    if (!entry) return false
    return true
  }

  _clampNameWidth() {
    if (!this.boatNameInput || !this.boatNameInput.input) return
    const input = this.boatNameInput.input
    const font = input.style.font || '20px serif'
    if (!this._measureCanvas) {
      this._measureCanvas = document.createElement('canvas')
      this._measureCtx = this._measureCanvas.getContext('2d')
    }
    const ctx = this._measureCtx
    if (!ctx) return
    ctx.font = font
    let text = input.value || ''
    const maxWidth = 180
    while (text.length > 0 && ctx.measureText(text).width > maxWidth) {
      text = text.slice(0, -1)
    }
    if (text !== input.value) {
      input.value = text
    }
  }

  findFirstFree() {
    const saved = this.game.mulle.user && this.game.mulle.user.savedBoats
    let firstFree = 0
    for (let i = 1; i <= 12; i++) {
      if (this._isSlotSaved(i)) {
        this.slotSprites[i - 1].setDirectorMember(this.DirResource, 60 + i)
      } else {
        this.slotSprites[i - 1].setDirectorMember(this.DirResource, 48 + i)
        if (!firstFree) firstFree = i
      }
    }
    if (this.mode === 'save') {
      if (!firstFree) firstFree = 1
    } else {
      firstFree = 1
    }
    this.firstFree = firstFree
  }

  onSlotClicked(saveNr, silent = false) {
    if (!silent && saveNr !== this.chosenSlot) {
      this.playEffect('06e003v0')
    }

    if (this._isSlotSaved(saveNr)) {
      const [parts, medals, name] = this.loadSave.loadBoat(saveNr)
      this.slotOccupied = true
      this.choseSlot(saveNr, true)
      this.showBoat(parts)
      this.showMedals(medals || [])
      this.boatNameInput.text(name || '')
      this._setMemberText('SavedBoatName', name || '')
      if (this.mode === 'save') {
        this.boatNameInput.input.readOnly = false
      } else {
        this.boatNameInput.input.readOnly = true
      }
    } else {
      this.slotOccupied = false
      this.choseSlot(saveNr, false)
      this.clearBoat()
      this.clearMedals()
      this.boatNameInput.text(' ')
      this._setMemberText('SavedBoatName', ' ')
      this.boatNameInput.input.readOnly = true
    }

    // Highlight selected slot
    this.flerpSprite.setDirectorMember(this.DirResource, 72 + saveNr)
  }

  // Lingo: Dir.choseSlot – update selection state, dismiss replace dialog
  choseSlot(saveNr, occupied) {
    this.saveIfNecessary()
    this.chosenSlot = saveNr
    this.slotOccupied = occupied
    if (this.mode === 'load') {
      this.loadButton.setActive(!!occupied)
    }
    // Lingo: set the member of sprite #YesButton/#NoButton to "Dummy"
    if (this.replaceDialog) {
      this.replaceDialog.kill()
      this.replaceDialog = null
    }
    this.changedName = false
    this.boatSaved = false
  }

  saveIfNecessary() {
    if (!this.changedName) return
    const newName = this.boatNameInput.value()
    const saved = this.game.mulle.user.savedBoats || []
    if (saved[this.chosenSlot]) {
      if (typeof saved[this.chosenSlot] === 'object') {
        saved[this.chosenSlot].name = newName
      }
    }
    if (this.chosenSlot === this.currentBoatSlot && this.game.mulle.user && this.game.mulle.user.Boat) {
      this.game.mulle.user.Boat.Name = newName
    }
    this.findFirstFree()
    this.changedName = false
  }

  showBoat(parts) {
    this.clearBoat()
    const offset = this.boatViewHandler && this.boatViewHandler.getDrawOffset
      ? this.boatViewHandler.getDrawOffset('PhotoBook', parts)
      : { x: 0, y: 0 }
    const pos = { x: 320 + offset.x, y: 240 + offset.y }
    this.albumBoatImage = new MulleBuildBoat(this.game, pos.x, pos.y, parts, true, false, this.boatViewHandler)
    this.albumBoatImage.scale.setTo(0.75, 0.75)
    this.boatLayer.add(this.albumBoatImage)
  }

  clearBoat() {
    if (this.albumBoatImage) {
      this.albumBoatImage.destroy(true)
      this.albumBoatImage = null
    }
  }

  showMedals(medals) {
    this.clearMedals()
    let count = 0
    medals.forEach((medal) => {
      const name = MEDAL_MAP[medal]
      if (!name) return
      const sprite = new MulleSprite(this.game, 570, 65 + (62 * count))
      sprite.setDirectorMember('00.CXT', name)
      this.uiLayer.add(sprite)
      this.medalSprites.push(sprite)
      count++
    })
  }

  clearMedals() {
    this.medalSprites.forEach((sprite) => sprite.destroy())
    this.medalSprites = []
  }

  // Lingo: Dir.prepareEnterName – paste current boat into chosen slot
  prepareEnterName() {
    this.boatPasted = true
    this.currentBoatSlot = this.chosenSlot
    this.boatSaved = true

    // Lingo: sendSprite(#InsertBoat, #activate, 0) – deactivate load/paste button
    if (this.loadButton) {
      this.loadButton.setActive(false)
    }

    // Lingo: set the member of sprite #PhotoBG to member "Dummy"
    if (this.background) {
      this.background.setDirectorMember('Dummy')
    }

    this.clearBoat()
    this.bottomOverlay.setDirectorMember(this.DirResource, 97)
    this.leftOverlay.setDirectorMember(this.DirResource, 98)

    // Lingo: stopAllEffects(gSound) then play paste sounds
    this.stopAllEffects()
    this.playEffect('06e001v0')
    this.playEffect('06d002v0')

    this.showBoat(null)
    this.boatNameInput.text('')
    this._setMemberText('SavedBoatName', '')
    this.boatNameInput.input.readOnly = false
    if (this.game.mulle.user && this.game.mulle.user.Boat) {
      this.game.mulle.user.Boat.Name = ''
    }
    this.loadSave.saveCurrentBoat(this.chosenSlot)
    this.findFirstFree()
    this.onSlotClicked(this.chosenSlot, true)
  }

  replaceAsk() {
    if (this.replaceDialog) {
      this.replaceDialog.kill()
    }
    this.replaceDialog = new ReplaceDialog(this)
  }

  loadSelectedBoat() {
    if (!this.slotOccupied) return
    this.buildSavedBoat(this.chosenSlot)
  }

  // Lingo: Dir.loadBoat – trash current boat, load saved, remove junk for loaded parts
  buildSavedBoat(page) {
    let partId
    const [parts, medals, name] = this.loadSave.loadBoat(page)
    const user = this.game.mulle.user

    for (partId of user.Boat.Parts) {
      if (!(partId in parts)) {
        const partData = this.game.mulle.BoatPartsDB[partId]
        if (partData && partData.Master) {
          partId = partData.Master
        }
        if (user.BoatJunk) {
          user.BoatJunk.boatyard = user.BoatJunk.boatyard || {}
          user.BoatJunk.boatyard[partId] = new Phaser.Point(
            this.game.rnd.integerInRange(100, 500),
            this.game.rnd.integerInRange(380, 440)
          )
        }
      }
    }

    user.Boat.Parts = []
    for (partId of parts) {
      user.Boat.Parts.push(partId)
    }
    user.Boat.Medals = medals
    user.Boat.Name = name

    // Lingo: Dir.loadBoat – remove non-hull/non-rudder parts from junk
    // so loaded parts are not duplicated in the junkyard
    const bvh = this.boatViewHandler
    if (bvh && user && typeof user.removeJunkPart === 'function') {
      for (const pid of parts) {
        if (pid > 1 && !bvh.isHull(pid) && !bvh.isRudder(pid)) {
          user.removeJunkPart(null, pid)
        }
      }
    }

    this.close()
  }

  handleLoadSaveClick() {
    const ctrl = this.game.input.keyboard.isDown(Phaser.KeyCode.CONTROL)
    const shift = this.game.input.keyboard.isDown(Phaser.KeyCode.SHIFT)
    const fKey = this.game.input.keyboard.isDown(Phaser.KeyCode.F)
    this.cheatLoad = (ctrl && shift && fKey) ? 1 : 0
    this.showOverlay()
  }

  // Lingo: LoadSaveCarBH.mouseUp – overlay prompt with audio cue
  showOverlay() {
    if (this.overlayMouseObjects.length) return

    // Lingo: activateScreen(me, 0) – disable background UI while overlay is open
    this._setScreenActive(false)

    this.coverOverlay.visible = true
    const promptMember = (this.mode === 'save') ? 158 : 162
    this.overlayPrompt.setDirectorMember(this.DirResource, promptMember)

    // Lingo: play(gSound, "07d003v0", #EFFECT) when mode = #load
    if (this.mode === 'load') {
      this.playEffect('07d003v0')
    }

    this.overlayMouseObjects = [
      new MouseObject(this, [rect(229, 380, 290, 411)], 510, { report: 1 }, this.globals),
      new MouseObject(this, [rect(297, 380, 358, 411)], 510, { report: 1 }, this.globals),
      new MouseObject(this, [rect(362, 384, 390, 412)], 510, { report: 1 }, this.globals)
    ]
  }

  hideOverlay() {
    this.coverOverlay.visible = false
    this.overlayPrompt.setDirectorMember('Dummy')
    this.overlayMouseObjects.forEach((obj) => obj.kill())
    this.overlayMouseObjects = []

    // Lingo: activateScreen(me, 1) – re-enable background UI
    this._setScreenActive(true)
  }

  mouse(argObj, argWhat) {
    if (argWhat !== 'click') return
    const idx = this.overlayMouseObjects.indexOf(argObj)
    if (idx < 0) return
    this.hideOverlay()
    if (idx === 0) {
      if (this.mode === 'load') {
        this.loadSelectedBoat()
      } else {
        if (this.slotOccupied) {
          this.replaceAsk()
        } else {
          this.prepareEnterName()
        }
      }
    } else if (idx === 1) {
      this.openDisk()
    }
  }

  // Lingo: LoadSaveCarBH.disk + ZZDataOnDiskBH.mouseUp + FileStuff
  openDisk() {
    if (this.mode === 'load') {
      this.browser = new MulleFileBrowser(this.game, (data) => {
        // Lingo: FileStuff.checkBoat – validate that player owns all parts
        if (data && data.parts && !this.cheatLoad) {
          const user = this.game.mulle.user
          if (user && typeof user.gotPart === 'function') {
            for (const pid of data.parts) {
              if (!user.gotPart(pid)) {
                // Lingo: play(gSound, "07d002v0", #EFFECT) – missing parts
                this.stopAllEffects()
                this.playEffect('07d002v0')
                return
              }
            }
          }
        }
        this.loadSave.importBoat(this.chosenSlot, data)
        this.findFirstFree()
        this.onSlotClicked(this.chosenSlot, true)
      })
      this.uiLayer.add(this.browser)
      return
    }

    // Export current boat to file (Lingo-like list)
    const boat = this.game.mulle.user && this.game.mulle.user.Boat
    if (!boat) return
    const parts = boat.Parts || []
    const medals = boat.Medals || []
    const name = boat.Name || this._getMemberText('06t001v0') || 'boat'
    const escape = (s) => String(s).replace(/\\\\/g, '\\\\\\\\').replace(/\"/g, '\\\\\"')
    const data = `[${[
      `#parts: [${parts.join(', ')}]`,
      `#medals: [${medals.join(', ')}]`,
      `#name: \"${escape(name)}\"`,
      '#cacheList: [:]'
    ].join(', ')}]`
    const blob = new Blob([data], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `${name}.car`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  // Lingo: GoBackBH.mouseUp + Dir.kill – save, play exit sound, navigate
  close() {
    this.saveIfNecessary()

    // Lingo: Dir.kill – save globals in save mode
    if (this.mode === 'save' && this.game.mulle && typeof this.game.mulle.save === 'function') {
      this.game.mulle.save()
    }

    // Lingo: play(gSound, "06e003v0", #EFFECT) on album exit
    this.playEffect('06e003v0')

    const stateMap = {
      '04': 'boatyard',
      '02': 'boat_junk',
      '03': 'garage',
      '06': 'album'
    }
    const target = stateMap[this.returnTo] || this.returnTo
    this.game.state.start(target)
  }

  shutdown(game) {
    if (this.boatNameInput) {
      this.boatNameInput.remove()
    }
    this.hideOverlay()
    if (this.replaceDialog) {
      this.replaceDialog.kill()
      this.replaceDialog = null
    }
    if (this.closeButton) {
      this.closeButton.kill()
      this.closeButton = null
    }
    if (this.loadButton) {
      this.loadButton.kill()
      this.loadButton = null
    }
    if (this.loadSaveButton) {
      this.loadSaveButton.kill()
      this.loadSaveButton = null
    }
    this.slotButtons.forEach((btn) => btn.kill())
    this.slotButtons = []
    super.shutdown(game)
  }
}

export default AlbumState
