/**
 * File Browser Scene
 * Display all saved users with car previews, load/delete functionality
 * @module scenes/filebrowser
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'

/**
 * File Browser State - browse and manage saved games
 * @extends MulleState
 */
class FileBrowserState extends MulleState {
  preload() {
    super.preload()
    // Reuse menu assets for background
    this.game.load.pack('menu', 'assets/menu.json', null, this)
  }
  
  create() {
    super.create()
    
    // Solid background color first (prevents bleed-through from previous scene)
    this.game.stage.backgroundColor = '#8B7355'  // Warm brown color matching rustic theme
    
    // Draw a solid background rectangle that fills the entire screen
    const bgRect = this.game.add.graphics(0, 0)
    bgRect.beginFill(0x8B7355)
    bgRect.drawRect(0, 0, 640, 480)
    bgRect.endFill()
    
    // Original sprite background on top
    const bg = new MulleSprite(this.game, 320, 240)
    bg.setDirectorMember('10.DXR', 2)  // Menu background
    this.game.add.existing(bg)
    
    // Title
    const title = this.game.add.text(320, 30, 'Opgeslagen Auto\'s', {
      font: 'bold 32px Arial',
      fill: '#333333',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    title.anchor.set(0.5)
    
    // Subtitle
    const subtitle = this.game.add.text(320, 65, 'Klik op een naam om te laden', {
      font: '18px Arial',
      fill: '#666666'
    })
    subtitle.anchor.set(0.5)
    
    // File list container
    this.fileListGroup = this.game.add.group()
    this.selectedUser = null
    this.previewCar = null
    
    // Render the file list
    this.renderFileList()
    
    // Create UI buttons
    this.createButtons()
  }
  
  /**
   * Render the list of saved files
   */
  renderFileList() {
    let y = 100
    let index = 0
    
    const users = Object.keys(this.game.mulle.UsersDB)
    
    if (users.length === 0) {
      const noFiles = this.game.add.text(320, 240, 'Geen opgeslagen auto\'s', {
        font: '24px Arial',
        fill: '#999999'
      })
      noFiles.anchor.set(0.5)
      this.fileListGroup.add(noFiles)
      return
    }
    
    for (let name of users) {
      const user = this.game.mulle.UsersDB[name]
      
      // Entry background
      const entryBg = this.game.add.graphics(40, y)
      entryBg.beginFill(index % 2 === 0 ? 0xf5f5f5 : 0xe8e8e8)
      entryBg.drawRoundedRect(0, 0, 280, 45, 5)
      entryBg.inputEnabled = true
      this.fileListGroup.add(entryBg)
      
      // Name text
      const nameText = this.game.add.text(55, y + 22, name, {
        font: 'bold 22px Arial',
        fill: '#000000'
      })
      nameText.anchor.set(0, 0.5)
      this.fileListGroup.add(nameText)
      
      // Part count
      const partCount = user.Car.Parts.length
      const countText = this.game.add.text(250, y + 22, `${partCount} delen`, {
        font: '16px Arial',
        fill: '#666666'
      })
      countText.anchor.set(0, 0.5)
      this.fileListGroup.add(countText)
      
      // Click to preview
      entryBg.events.onInputOver.add(() => {
        entryBg.clear()
        entryBg.beginFill(0xd0e8ff)
        entryBg.drawRoundedRect(0, 0, 280, 45, 5)
        this.game.canvas.className = 'cursor-point'
      })
      
      entryBg.events.onInputOut.add(() => {
        entryBg.clear()
        entryBg.beginFill(index % 2 === 0 ? 0xf5f5f5 : 0xe8e8e8)
        entryBg.drawRoundedRect(0, 0, 280, 45, 5)
        this.game.canvas.className = ''
      })
      
      entryBg.events.onInputUp.add(() => {
        this.showPreview(name, user)
      })
      
      // Delete button
      const delBtn = this.game.add.text(305, y + 22, '🗑️', {
        font: '20px sans-serif',
        fill: '#cc0000'
      })
      delBtn.anchor.set(0.5)
      delBtn.inputEnabled = true
      
      delBtn.events.onInputOver.add(() => {
        delBtn.fill = '#ff0000'
        delBtn.scale.set(1.2)
        this.game.canvas.className = 'cursor-point'
      })
      
      delBtn.events.onInputOut.add(() => {
        delBtn.fill = '#cc0000'
        delBtn.scale.set(1.0)
        this.game.canvas.className = ''
      })
      
      delBtn.events.onInputUp.add((sprite, pointer) => {
        pointer.stopPropagation = true
        this.deleteFile(name)
      })
      
      this.fileListGroup.add(delBtn)
      
      y += 50
      index++
      
      // Max 6 entries visible
      if (index >= 6) break
    }
  }
  
  /**
   * Show preview of selected car
   * @param {string} name - User name
   * @param {MulleSave} userData - User save data
   */
  showPreview(name, userData) {
    console.log('[FileBrowser] Preview:', name)
    
    // Clear previous preview
    if (this.previewCar) {
      this.previewCar.destroy()
      this.previewCar = null
    }
    
    // Remove previous title if exists
    if (this.previewTitle) {
      this.previewTitle.destroy()
    }
    
    // Preview title
    this.previewTitle = this.game.add.text(480, 110, name, {
      font: 'bold 24px Arial',
      fill: '#333333'
    })
    this.previewTitle.anchor.set(0.5)
    
    // Create car preview
    this.previewCar = new MulleBuildCar(this.game, 480, 280, userData.Car.Parts, true, false)
    this.game.add.existing(this.previewCar)
    
    // Scale down if needed
    this.previewCar.scale.set(0.8)
    
    // Store selected user
    this.selectedUser = name
    
    // Enable load button
    if (this.loadButton) {
      this.loadButton.inputEnabled = true
      this.loadButton.fill = '#00aa00'
      this.loadButton.alpha = 1.0
    }
  }
  
  /**
   * Create UI buttons (Load, Cancel)
   */
  createButtons() {
    // Load button (initially disabled)
    this.loadButton = this.game.add.text(480, 420, 'Laden', {
      font: 'bold 28px Arial',
      fill: '#999999',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    this.loadButton.anchor.set(0.5)
    this.loadButton.inputEnabled = false
    this.loadButton.alpha = 0.5
    
    this.loadButton.events.onInputOver.add(() => {
      if (this.selectedUser) {
        this.loadButton.fill = '#00ff00'
        this.loadButton.scale.set(1.1)
        this.game.canvas.className = 'cursor-point'
      }
    })
    
    this.loadButton.events.onInputOut.add(() => {
      if (this.selectedUser) {
        this.loadButton.fill = '#00aa00'
        this.loadButton.scale.set(1.0)
        this.game.canvas.className = ''
      }
    })
    
    this.loadButton.events.onInputUp.add(() => {
      if (this.selectedUser) {
        console.log('[FileBrowser] Loading user:', this.selectedUser)
        this.game.mulle.user = this.game.mulle.UsersDB[this.selectedUser]
        this.game.mulle.activeCutscene = '00b011v0'
        this.game.mulle.net.send({ name: this.selectedUser })
        this.game.state.start('garage')
      }
    })
    
    // Cancel button
    const cancelBtn = this.game.add.text(320, 450, 'Terug naar Menu', {
      font: '20px Arial',
      fill: '#cc0000',
      stroke: '#ffffff',
      strokeThickness: 1
    })
    cancelBtn.anchor.set(0.5)
    cancelBtn.inputEnabled = true
    
    cancelBtn.events.onInputOver.add(() => {
      cancelBtn.fill = '#ff0000'
      cancelBtn.scale.set(1.1)
      this.game.canvas.className = 'cursor-point'
    })
    
    cancelBtn.events.onInputOut.add(() => {
      cancelBtn.fill = '#cc0000'
      cancelBtn.scale.set(1.0)
      this.game.canvas.className = ''
    })
    
    cancelBtn.events.onInputUp.add(() => {
      this.game.state.start('menu')
    })
  }
  
  /**
   * Delete a saved file
   * @param {string} name - User name to delete
   */
  deleteFile(name) {
    if (confirm(`Verwijder "${name}"?\n\nDeze actie kan niet ongedaan gemaakt worden.`)) {
      console.log('[FileBrowser] Deleting user:', name)
      
      // Delete from database
      delete this.game.mulle.UsersDB[name]
      this.game.mulle.saveData()
      
      // Clear preview if this was selected
      if (this.selectedUser === name) {
        if (this.previewCar) {
          this.previewCar.destroy()
          this.previewCar = null
        }
        if (this.previewTitle) {
          this.previewTitle.destroy()
          this.previewTitle = null
        }
        this.selectedUser = null
        
        if (this.loadButton) {
          this.loadButton.inputEnabled = false
          this.loadButton.fill = '#999999'
          this.loadButton.alpha = 0.5
        }
      }
      
      // Refresh the file list
      this.fileListGroup.removeAll(true)
      this.renderFileList()
    }
  }
  
  shutdown() {
    this.game.sound.stopAll()
    
    if (this.previewCar) {
      this.previewCar.destroy()
    }
  }
}

export default FileBrowserState
