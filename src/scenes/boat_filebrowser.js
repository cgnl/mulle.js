/**
 * Boat File Browser Scene (14.dxr)
 * 
 * Save/Load dialog for saved boat configurations.
 * Original Lingo from boat_14/MovieScript 2.ls and MovieScript 3.ls:
 * - Mode: #save or #load
 * - Displays list of saved boats from savedBoatFiles
 * - Save mode: allows entering new filename
 * - Load mode: validates player has required parts before loading
 * - Plays 07d002v0 when parts are missing
 * 
 * @module scenes/boat_filebrowser
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleBuildBoat from '../objects/buildboat'
import MulleButton from '../objects/button'
import LoadSaveBoat from '../util/LoadSaveBoat'

/**
 * Boat File Browser State - browse and manage saved boats
 * @extends MulleState
 */
class BoatFileBrowserState extends MulleState {
  /**
   * Initialize state with mode
   * @param {string} mode - 'save' or 'load'
   */
  init (mode) {
    this.mode = mode || 'load'
    // Store returnTo state (like original Lingo "returnTo" from gMulleGlobals)
    this.returnTo = this.game.mulle.whereFrom || 'boatyard'
    console.log('[BoatFileBrowser] init - mode:', this.mode, 'returnTo:', this.returnTo)
  }

  preload () {
    this.DirResource = '14.DXR'
    super.preload()
    // Load the file browser assets pack
    this.game.load.pack('fileBrowser', 'assets/fileBrowser.json', null, this)
    // Also load boat parts for preview
    this.game.load.pack('boatparts', 'assets/boatparts.json', null, this)
  }

  create () {
    super.create()

    // Initialize LoadSaveBoat utility
    this.loadSave = new LoadSaveBoat(this.game)
    
    // State variables
    this.selectedEntry = null
    this.previewBoat = null
    this.fileListGroup = this.game.add.group()
    this.scrollOffset = 0
    this.maxVisible = 8  // Maximum visible entries
    this.entryHeight = 40

    // Main scroller channel (original: gMainScroller = 7)
    this.mainScrollerChannel = 7

    // Create UI
    this.createBackground()
    this.createFileList()
    this.createScrollButtons()
    this.createEntryField()
    this.createActionButtons()
    this.createPreviewArea()
    this.createDirectoryLabel()

    // Play appropriate intro sound
    this.playIntroSound()

    console.log('[BoatFileBrowser] Scene created in', this.mode, 'mode')
  }

  /**
   * Play intro sound based on mode
   * Original Lingo: Different sounds for save vs load
   */
  playIntroSound () {
    try {
      if (this.mode === 'save') {
        // Save mode intro
        this.game.mulle.playAudio('06e002v0')
      } else {
        // Load mode intro
        this.game.mulle.playAudio('07d001v0')
      }
    } catch (e) {
      console.warn('[BoatFileBrowser] Could not play intro sound:', e)
    }
  }

  /**
   * Create background
   */
  createBackground () {
    // Use a neutral background similar to album
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x2E4053)  // Dark blue-gray
    bg.drawRect(0, 0, 640, 480)
    bg.endFill()

    // Title bar
    const titleBg = this.game.add.graphics(0, 0)
    titleBg.beginFill(0x1B4F72)  // Darker blue
    titleBg.drawRect(0, 0, 640, 60)
    titleBg.endFill()

    // Title text
    const titleText = this.mode === 'save' ? 'Boot Opslaan' : 'Boot Laden'
    const title = this.game.add.text(320, 30, titleText, {
      font: 'bold 32px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2
    })
    title.anchor.set(0.5)

    // Subtitle
    const subtitleText = this.mode === 'save'
      ? 'Typ een naam en klik OK om op te slaan'
      : 'Klik op een boot om te laden'
    const subtitle = this.game.add.text(320, 52, subtitleText, {
      font: '14px Arial',
      fill: '#aaaaaa'
    })
    subtitle.anchor.set(0.5)
  }

  /**
   * Create the file list display
   * Original Lingo: MainScroller field with setText and scroll behaviors
   */
  createFileList () {
    // List background
    const listBg = this.game.add.graphics(40, 80)
    listBg.beginFill(0x34495E)  // Slightly lighter blue-gray
    listBg.drawRoundedRect(0, 0, 280, this.maxVisible * this.entryHeight + 10, 5)
    listBg.endFill()

    // Get saved boats
    this.refreshFileList()
  }

  /**
   * Refresh the file list display
   */
  refreshFileList () {
    // Clear existing entries
    this.fileListGroup.removeAll(true)

    // Get saved boats from user data
    const savedBoats = this.game.mulle.user.savedBoats || []
    const startY = 85
    const startX = 50
    
    // Calculate visible range based on scroll offset
    const startIdx = this.scrollOffset
    const endIdx = Math.min(startIdx + this.maxVisible, savedBoats.length)

    for (let i = startIdx; i < endIdx; i++) {
      const entry = savedBoats[i]
      if (!entry) continue

      const yPos = startY + ((i - startIdx) * this.entryHeight)
      const idx = i  // Capture index for closure

      // Entry background
      const entryBg = this.game.add.graphics(startX, yPos)
      entryBg.beginFill((i - startIdx) % 2 === 0 ? 0x4A6670 : 0x3D5A66)
      entryBg.drawRoundedRect(0, 0, 260, 35, 3)
      entryBg.inputEnabled = true
      this.fileListGroup.add(entryBg)

      // Entry name
      const name = entry.name || `Boot ${i + 1}`
      const nameText = this.game.add.text(startX + 10, yPos + 10, name, {
        font: 'bold 18px Arial',
        fill: '#ffffff'
      })
      this.fileListGroup.add(nameText)

      // Part count
      const parts = entry.parts || []
      const countText = this.game.add.text(startX + 210, yPos + 10, `${parts.length} delen`, {
        font: '14px Arial',
        fill: '#aaaaaa'
      })
      this.fileListGroup.add(countText)

      // Hover effects
      entryBg.events.onInputOver.add(() => {
        entryBg.clear()
        entryBg.beginFill(0x5DADE2)  // Highlight color
        entryBg.drawRoundedRect(0, 0, 260, 35, 3)
        this.game.canvas.style.cursor = 'pointer'
      })

      entryBg.events.onInputOut.add(() => {
        entryBg.clear()
        entryBg.beginFill((i - startIdx) % 2 === 0 ? 0x4A6670 : 0x3D5A66)
        entryBg.drawRoundedRect(0, 0, 260, 35, 3)
        this.game.canvas.style.cursor = 'default'
      })

      // Click to select
      entryBg.events.onInputUp.add(() => {
        this.selectEntry(idx, entry)
      })
    }

    // Show empty message if no saved boats
    if (savedBoats.length === 0) {
      const emptyText = this.game.add.text(180, 200, 'Geen opgeslagen boten', {
        font: '18px Arial',
        fill: '#888888'
      })
      emptyText.anchor.set(0.5)
      this.fileListGroup.add(emptyText)
    }

    // Update scroll button states
    this.updateScrollButtons(savedBoats.length)
  }

  /**
   * Create scroll up/down buttons
   * Original Lingo: ArrowUp/ArrowDown sprites with ScrollBarArrowsBH
   */
  createScrollButtons () {
    // Scroll up button
    this.scrollUpBtn = this.game.add.text(180, 75, '▲', {
      font: 'bold 16px Arial',
      fill: '#888888'
    })
    this.scrollUpBtn.anchor.set(0.5)
    this.scrollUpBtn.inputEnabled = true
    this.scrollUpBtn.alpha = 0.5
    this.scrollUpBtn.events.onInputUp.add(() => {
      if (this.scrollOffset > 0) {
        this.scrollOffset--
        this.refreshFileList()
      }
    })

    // Scroll down button
    this.scrollDownBtn = this.game.add.text(180, 400, '▼', {
      font: 'bold 16px Arial',
      fill: '#888888'
    })
    this.scrollDownBtn.anchor.set(0.5)
    this.scrollDownBtn.inputEnabled = true
    this.scrollDownBtn.alpha = 0.5
    this.scrollDownBtn.events.onInputUp.add(() => {
      const savedBoats = this.game.mulle.user.savedBoats || []
      if (this.scrollOffset + this.maxVisible < savedBoats.length) {
        this.scrollOffset++
        this.refreshFileList()
      }
    })
  }

  /**
   * Update scroll button visibility based on list length
   */
  updateScrollButtons (totalEntries) {
    if (!this.scrollUpBtn || !this.scrollDownBtn) return
    // Up button
    if (this.scrollOffset > 0) {
      this.scrollUpBtn.alpha = 1
      this.scrollUpBtn.fill = '#ffffff'
    } else {
      this.scrollUpBtn.alpha = 0.5
      this.scrollUpBtn.fill = '#888888'
    }

    // Down button
    if (this.scrollOffset + this.maxVisible < totalEntries) {
      this.scrollDownBtn.alpha = 1
      this.scrollDownBtn.fill = '#ffffff'
    } else {
      this.scrollDownBtn.alpha = 0.5
      this.scrollDownBtn.fill = '#888888'
    }
  }

  /**
   * Create the entry field for save mode
   * Original Lingo: EnterField member with ScrollEnterDeleteBH
   */
  createEntryField () {
    if (this.mode !== 'save') return

    // Label
    const label = this.game.add.text(50, 420, 'Naam:', {
      font: 'bold 16px Arial',
      fill: '#ffffff'
    })

    // Create HTML input for text entry
    const inputContainer = document.getElementById('player')
    if (inputContainer) {
      // Get canvas position for positioning
      const canvas = this.game.canvas
      const rect = canvas.getBoundingClientRect()
      
      // Create input element
      this.inputElement = document.createElement('input')
      this.inputElement.type = 'text'
      this.inputElement.id = 'boat_name_input'
      this.inputElement.placeholder = 'Typ een naam...'
      this.inputElement.style.cssText = `
        position: absolute;
        left: ${rect.left + 110}px;
        top: ${rect.top + 415}px;
        width: 200px;
        height: 24px;
        font-size: 16px;
        padding: 2px 6px;
        border: 2px solid #5DADE2;
        border-radius: 4px;
        background: #ffffff;
        z-index: 100;
      `
      inputContainer.appendChild(this.inputElement)

      // Set default name if available
      const boat = this.game.mulle.user.Boat
      if (boat && boat.Name) {
        this.inputElement.value = boat.Name
      }
    }
  }

  /**
   * Create OK and Cancel buttons
   * Original Lingo: OKBH and CancelBH behaviors
   */
  createActionButtons () {
    // === OK BUTTON ===
    // Original: mouseUp in OKBH - calls cleanString and AddLine/ChoseLine
    this.okButton = this.game.add.text(480, 420, 'OK', {
      font: 'bold 24px Arial',
      fill: this.mode === 'save' ? '#00aa00' : '#888888',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    this.okButton.anchor.set(0.5)
    this.okButton.inputEnabled = true
    
    if (this.mode === 'load') {
      this.okButton.alpha = 0.5  // Disabled until selection
    }

    this.okButton.events.onInputOver.add(() => {
      if (this.canConfirm()) {
        this.okButton.fill = '#00ff00'
        this.okButton.scale.set(1.1)
        this.game.canvas.style.cursor = 'pointer'
      }
    })

    this.okButton.events.onInputOut.add(() => {
      this.okButton.fill = this.canConfirm() ? '#00aa00' : '#888888'
      this.okButton.scale.set(1.0)
      this.game.canvas.style.cursor = 'default'
    })

    this.okButton.events.onInputUp.add(() => {
      if (this.canConfirm()) {
        this.onConfirm()
      }
    })

    // === CANCEL BUTTON ===
    // Original: mouseUp in CancelBH - calls dialogueResult(gDir, #Cancel)
    this.cancelButton = this.game.add.text(560, 420, 'Annuleer', {
      font: 'bold 18px Arial',
      fill: '#cc0000',
      stroke: '#ffffff',
      strokeThickness: 1
    })
    this.cancelButton.anchor.set(0.5)
    this.cancelButton.inputEnabled = true

    this.cancelButton.events.onInputOver.add(() => {
      this.cancelButton.fill = '#ff0000'
      this.cancelButton.scale.set(1.1)
      this.game.canvas.style.cursor = 'pointer'
    })

    this.cancelButton.events.onInputOut.add(() => {
      this.cancelButton.fill = '#cc0000'
      this.cancelButton.scale.set(1.0)
      this.game.canvas.style.cursor = 'default'
    })

    this.cancelButton.events.onInputUp.add(() => {
      this.onCancel()
    })
  }

  /**
   * Create the boat preview area
   */
  createPreviewArea () {
    // Preview background
    const previewBg = this.game.add.graphics(350, 80)
    previewBg.beginFill(0x34495E)
    previewBg.drawRoundedRect(0, 0, 270, 300, 5)
    previewBg.endFill()

    // Preview title
    this.previewTitle = this.game.add.text(485, 95, 'Voorbeeld', {
      font: 'bold 20px Arial',
      fill: '#ffffff'
    })
    this.previewTitle.anchor.set(0.5)

    // Preview name (updates when entry selected)
    this.previewNameText = this.game.add.text(485, 120, '', {
      font: '16px Arial',
      fill: '#5DADE2'
    })
    this.previewNameText.anchor.set(0.5)

    // Placeholder for boat preview
    this.previewContainer = this.game.add.group()
    this.previewContainer.x = 485
    this.previewContainer.y = 250
  }

  /**
   * Create directory label showing save path
   * Original Lingo: DirectoryField member showing projectPath & "Boten" & delim
   */
  createDirectoryLabel () {
    // Show simulated path (original used actual file path)
    const pathText = this.game.add.text(50, 455, 'Boten/', {
      font: '12px Courier',
      fill: '#666666'
    })
  }

  /**
   * Select an entry from the list
   */
  selectEntry (index, entry) {
    console.log('[BoatFileBrowser] Selected entry:', index, entry)
    
    this.selectedEntry = { index, ...entry }

    // Update preview name
    if (this.previewNameText) {
      this.previewNameText.text = entry.name || `Boot ${index + 1}`
    }

    // Update entry field in save mode
    if (this.mode === 'save' && this.inputElement) {
      this.inputElement.value = entry.name || ''
    }

    // Show boat preview
    this.showPreview(entry.parts || [])

    // Enable OK button in load mode
    if (this.mode === 'load') {
      this.okButton.alpha = 1
      this.okButton.fill = '#00aa00'
    }
  }

  /**
   * Show boat preview with given parts
   */
  showPreview (parts) {
    // Clear existing preview
    if (this.previewBoat) {
      this.previewBoat.destroy()
      this.previewBoat = null
    }

    if (!parts || parts.length === 0) {
      return
    }

    // Create boat preview (read-only, no interaction)
    try {
      this.previewBoat = new MulleBuildBoat(this.game, 0, 0, parts, true, false)
      this.previewBoat.scale.set(0.7)  // Scale down for preview
      this.previewContainer.add(this.previewBoat)
    } catch (e) {
      console.warn('[BoatFileBrowser] Could not create boat preview:', e)
    }
  }

  /**
   * Check if OK button action can be performed
   */
  canConfirm () {
    if (this.mode === 'save') {
      // In save mode, always allow (will use default name if empty)
      return true
    } else {
      // In load mode, need a selection
      return this.selectedEntry !== null
    }
  }

  /**
   * Handle OK button click
   * Original Lingo: resultsFromScroller(#ChoseLine, ...) or (#NewLine, ...)
   */
  onConfirm () {
    if (this.mode === 'save') {
      this.doSave()
    } else {
      this.doLoad()
    }
  }

  /**
   * Save current boat
   * Original Lingo: resultsFromScroller(#NewLine, theStr) or (#ChoseLine, theStr)
   */
  doSave () {
    // Get name from input field
    let name = ''
    if (this.inputElement) {
      name = this.inputElement.value.trim()
    }
    
    // Default name if empty
    if (!name) {
      name = `Boot ${new Date().toLocaleDateString('nl-NL')}`
    }

    // Clean the string (original: cleanString handler)
    name = this.cleanString(name)

    // Get current boat parts
    const boat = this.game.mulle.user.Boat
    if (!boat || !boat.Parts || boat.Parts.length === 0) {
      console.warn('[BoatFileBrowser] No boat to save')
      this.showMessage('Geen boot om op te slaan!')
      return
    }

    // Find slot to save to
    const savedBoats = this.game.mulle.user.savedBoats || []
    let slotIndex = savedBoats.length  // Default: new slot

    // If selected an existing entry, overwrite it
    if (this.selectedEntry !== null && this.selectedEntry.index !== undefined) {
      slotIndex = this.selectedEntry.index
    }

    // Save the boat
    console.log('[BoatFileBrowser] Saving boat to slot', slotIndex, 'as', name)
    this.loadSave.saveBoat(slotIndex, boat.Parts, boat.Medals || [], name)

    // Play confirmation sound
    try {
      this.game.mulle.playAudio('SndMouseClick')
    } catch (e) {}

    // Return to previous scene
    this.close()
  }

  /**
   * Load selected boat
   * Original Lingo: loadBoat handler from MovieScript 3.ls
   * - Validates all parts exist in inventory
   * - Plays 07d002v0 if parts missing
   */
  doLoad () {
    if (!this.selectedEntry) {
      console.warn('[BoatFileBrowser] No entry selected')
      return
    }

    const parts = this.selectedEntry.parts || []
    if (parts.length === 0) {
      this.showMessage('Deze boot is leeg!')
      return
    }

    // Validate that player has all required parts
    // Original Lingo: gotPart(the user of gMulleGlobals, index)
    const user = this.game.mulle.user
    const missingParts = []

    for (const partId of parts) {
      if (!this.hasBoatPart(partId)) {
        missingParts.push(partId)
      }
    }

    if (missingParts.length > 0) {
      console.log('[BoatFileBrowser] Missing parts:', missingParts)
      
      // Play error sound
      // Original: play(gSound, "07d002v0", #EFFECT)
      try {
        this.game.mulle.playAudio('07d002v0')
      } catch (e) {
        console.warn('[BoatFileBrowser] Could not play missing parts sound:', e)
      }

      this.showMessage(`Je mist ${missingParts.length} onderdelen!`)
      return
    }

    // Load the boat
    console.log('[BoatFileBrowser] Loading boat with', parts.length, 'parts')

    // Store current boat parts in junk (like album does)
    this.storeCurrentBoatInJunk()

    // Set new boat parts
    user.Boat.Parts = [...parts]
    user.Boat.Medals = this.selectedEntry.medals || []
    user.Boat.Name = this.selectedEntry.name || ''

    // Save changes
    user.save()

    // Return to previous scene
    this.close()
  }

  /**
   * Check if player has a boat part
   * Original Lingo: gotPart(the user of gMulleGlobals, index)
   */
  hasBoatPart (partId) {
    const user = this.game.mulle.user
    
    // Check current boat
    if (user.Boat && user.Boat.Parts && user.Boat.Parts.includes(partId)) {
      return true
    }

    // Check junk/inventory
    const boatJunk = user.BoatJunk || {}
    for (const location in boatJunk) {
      const parts = boatJunk[location]
      if (parts && parts[partId]) {
        return true
      }
    }

    // Check if part has a master (morphed part)
    const partData = this.game.mulle.BoatPartsDB[partId]
    if (partData && partData.Master && partData.Master !== 0) {
      return this.hasBoatPart(partData.Master)
    }

    return false
  }

  /**
   * Store current boat parts in junk (before loading new boat)
   */
  storeCurrentBoatInJunk () {
    const user = this.game.mulle.user
    if (!user.Boat || !user.Boat.Parts) return

    // Get boat junk storage
    if (!user.BoatJunk) {
      user.BoatJunk = { boatyard: {} }
    }
    if (!user.BoatJunk.boatyard) {
      user.BoatJunk.boatyard = {}
    }

    // Store each part (with random position in boatyard)
    for (const partId of user.Boat.Parts) {
      // Get master part ID if this is a morphed part
      const partData = this.game.mulle.BoatPartsDB[partId]
      let storeId = partId
      if (partData && partData.Master && partData.Master !== 0) {
        storeId = partData.Master
      }

      // Random position in boatyard area
      user.BoatJunk.boatyard[storeId] = {
        x: this.game.rnd.integerInRange(100, 500),
        y: this.game.rnd.integerInRange(380, 440)
      }
    }

    console.log('[BoatFileBrowser] Stored', user.Boat.Parts.length, 'parts in junk')
  }

  /**
   * Clean string (remove leading/trailing spaces)
   * Original Lingo: cleanString handler in MovieScript 3.ls
   */
  cleanString (str) {
    if (!str) return ''
    return str.trim()
  }

  /**
   * Show a message to the user
   */
  showMessage (text) {
    // Simple message display
    if (this.messageText) {
      this.messageText.destroy()
    }

    this.messageText = this.game.add.text(320, 390, text, {
      font: 'bold 16px Arial',
      fill: '#ff6666',
      stroke: '#000000',
      strokeThickness: 2
    })
    this.messageText.anchor.set(0.5)

    // Remove after 3 seconds
    this.game.time.events.add(3000, () => {
      if (this.messageText) {
        this.messageText.destroy()
        this.messageText = null
      }
    })
  }

  /**
   * Handle Cancel button click
   * Original Lingo: dialogueResult(gDir, #Cancel)
   */
  onCancel () {
    // Play cancel sound
    try {
      this.game.mulle.playAudio('SndMouseClick')
    } catch (e) {}

    this.close()
  }

  /**
   * Close the file browser and return to previous scene
   */
  close () {
    // Map Director movie IDs to Phaser state names (safety fallback)
    const stateMap = { '04': 'boatyard', '02': 'boat_junk', '03': 'garage', '06': 'album' }
    const target = stateMap[this.returnTo] || this.returnTo
    console.log('[BoatFileBrowser] Closing, returning to:', target)
    this.game.state.start(target)
  }

  /**
   * Cleanup on scene shutdown
   */
  shutdown () {
    // Remove HTML input element
    if (this.inputElement && this.inputElement.parentNode) {
      this.inputElement.parentNode.removeChild(this.inputElement)
      this.inputElement = null
    }

    // Cleanup text from DOM
    if (this.messageText) {
      this.messageText.destroy()
    }

    // Cleanup preview
    if (this.previewBoat) {
      this.previewBoat.destroy()
    }

    super.shutdown()
  }
}

export default BoatFileBrowserState
