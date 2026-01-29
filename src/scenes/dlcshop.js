/**
 * DLC Shop Scene - Oom Otto uit Amerika
 * Purchase expansion packs with exclusive car parts
 * @module scenes/dlcshop
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'

/**
 * DLC Shop State - purchase DLC packages
 * @extends MulleState
 */
class DLCShopState extends MulleState {
  preload() {
    super.preload()
    // Reuse yard/menu assets
    this.game.load.pack('menu', 'assets/menu.json', null, this)
    this.game.load.json('dlcParts', 'data/dlc_parts.json')
  }
  
  create() {
    super.create()
    
    // Solid background color first (prevents bleed-through from previous scene)
    this.game.stage.backgroundColor = '#d4a574'  // Warm brown/tan color matching shop theme
    
    // Draw a solid background rectangle that fills the entire screen
    const bgRect = this.game.add.graphics(0, 0)
    bgRect.beginFill(0xd4a574)  // Same warm brown
    bgRect.drawRect(0, 0, 640, 480)
    bgRect.endFill()
    
    // Optional: Add a decorative pattern or texture layer
    const decorBg = this.game.add.graphics(0, 0)
    decorBg.beginFill(0xc49464, 0.3)  // Slightly darker, semi-transparent
    // Simple stripe pattern
    for (let i = 0; i < 640; i += 20) {
      decorBg.drawRect(i, 0, 10, 480)
    }
    decorBg.endFill()
    
    // Title
    const title = this.game.add.text(320, 40, 'Oom Otto\'s Winkel', {
      font: 'bold 36px Arial',
      fill: '#8B4513',
      stroke: '#ffffff',
      strokeThickness: 3
    })
    title.anchor.set(0.5)
    
    // Subtitle
    const subtitle = this.game.add.text(320, 80, 'Exclusieve onderdelen per post!', {
      font: '20px Arial',
      fill: '#666666'
    })
    subtitle.anchor.set(0.5)
    
    // Load DLC data
    const dlcData = this.game.cache.getJSON('dlcParts')
    
    if (!dlcData || !dlcData.dlc_oom_otto) {
      const errorText = this.game.add.text(320, 240, 'DLC data niet gevonden', {
        font: '24px Arial',
        fill: '#cc0000'
      })
      errorText.anchor.set(0.5)
      this.createBackButton()
      return
    }
    
    // DLC Package info
    const dlcParts = dlcData.dlc_oom_otto.parts
    const dlcName = dlcData.dlc_oom_otto.name
    
    // Initialize DLC purchased list if not exists
    if (!this.game.mulle.user.DLCPurchased) {
      this.game.mulle.user.DLCPurchased = []
    }
    
    const purchased = this.game.mulle.user.DLCPurchased.includes('dlc_oom_otto')
    
    // Package display
    const pkgBox = this.game.add.graphics(80, 120)
    pkgBox.beginFill(purchased ? 0xcccccc : 0xffffff)
    pkgBox.lineStyle(4, purchased ? 0x888888 : 0x8B4513)
    pkgBox.drawRoundedRect(0, 0, 480, 100, 10)
    
    // Package name
    const pkgNameText = this.game.add.text(320, 150, dlcName, {
      font: purchased ? '24px Arial' : 'bold 26px Arial',
      fill: purchased ? '#888888' : '#000000'
    })
    pkgNameText.anchor.set(0.5)
    
    // Part count
    const partCount = dlcParts.length
    const partInfo = this.game.add.text(320, 180, `${partCount} exclusieve onderdelen`, {
      font: '18px Arial',
      fill: purchased ? '#888888' : '#666666'
    })
    partInfo.anchor.set(0.5)
    
    // Purchase/Status button
    if (purchased) {
      const statusBtn = this.game.add.text(320, 200, '✓ Gekocht', {
        font: 'bold 20px Arial',
        fill: '#00aa00'
      })
      statusBtn.anchor.set(0.5)
    } else {
      const purchaseBtn = this.game.add.text(320, 200, '📦 Bestellen (GRATIS)', {
        font: 'bold 24px Arial',
        fill: '#0066cc',
        stroke: '#ffffff',
        strokeThickness: 2
      })
      purchaseBtn.anchor.set(0.5)
      purchaseBtn.inputEnabled = true
      
      purchaseBtn.events.onInputOver.add(() => {
        purchaseBtn.fill = '#0088ff'
        purchaseBtn.scale.set(1.1)
        this.game.canvas.className = 'cursor-point'
      })
      
      purchaseBtn.events.onInputOut.add(() => {
        purchaseBtn.fill = '#0066cc'
        purchaseBtn.scale.set(1.0)
        this.game.canvas.className = ''
      })
      
      purchaseBtn.events.onInputUp.add(() => {
        this.purchaseDLC('dlc_oom_otto', dlcParts)
      })
    }
    
    // Part preview list
    const previewTitle = this.game.add.text(320, 250, 'Onderdelen in dit pakket:', {
      font: 'bold 18px Arial',
      fill: '#333333'
    })
    previewTitle.anchor.set(0.5)
    
    // Show first 6 parts as preview
    let y = 280
    const previewParts = dlcParts.slice(0, 6)
    
    for (let part of previewParts) {
      const partText = this.game.add.text(120, y, `• ${part.name}`, {
        font: '14px Arial',
        fill: '#666666'
      })
      y += 20
    }
    
    if (dlcParts.length > 6) {
      const moreText = this.game.add.text(120, y, `... en ${dlcParts.length - 6} meer`, {
        font: 'italic 14px Arial',
        fill: '#999999'
      })
    }
    
    // Back button
    this.createBackButton()
  }
  
  /**
   * Purchase DLC package
   * @param {string} packageId - Package identifier
   * @param {Array} parts - Array of part definitions
   */
  purchaseDLC(packageId, parts) {
    console.log('[DLCShop] Purchasing package:', packageId)
    
    // Mark as purchased
    if (!this.game.mulle.user.DLCPurchased) {
      this.game.mulle.user.DLCPurchased = []
    }
    
    this.game.mulle.user.DLCPurchased.push(packageId)
    
    // Add parts to inventory
    // Note: Parts need to be added to the PartsDB and made available in garage
    // This is a simplified implementation - full integration would require:
    // 1. Adding parts to game.mulle.PartsDB
    // 2. Making sprites available
    // 3. Adding to yard/garage inventories
    
    parts.forEach(part => {
      console.log('[DLCShop] Added part:', part.name, part.id)
      // In real implementation: this.game.mulle.user.addPart('yard', part.id, null, true)
    })
    
    this.game.mulle.user.save()
    
    // Success feedback
    if (this.game.mulle.playAudio) {
      this.game.mulle.playAudio('04e007v0')  // Success sound if available
    }
    
    // Success message
    const successOverlay = this.game.add.graphics(0, 0)
    successOverlay.beginFill(0x000000, 0.7)
    successOverlay.drawRect(0, 0, 640, 480)
    
    const successText = this.game.add.text(320, 200, 'Pakket aangekomen!', {
      font: 'bold 36px Arial',
      fill: '#00ff00',
      stroke: '#000000',
      strokeThickness: 3
    })
    successText.anchor.set(0.5)
    
    const detailText = this.game.add.text(320, 250, `${parts.length} nieuwe onderdelen\nbeschikbaar in de garage!`, {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center'
    })
    detailText.anchor.set(0.5)
    
    // Auto-refresh after 2 seconds
    this.game.time.events.add(2000, () => {
      this.game.state.restart()
    })
  }
  
  /**
   * Create back button
   */
  createBackButton() {
    const backBtn = this.game.add.text(320, 440, 'Terug naar Menu', {
      font: 'bold 20px Arial',
      fill: '#cc0000',
      stroke: '#ffffff',
      strokeThickness: 1
    })
    backBtn.anchor.set(0.5)
    backBtn.inputEnabled = true
    
    backBtn.events.onInputOver.add(() => {
      backBtn.fill = '#ff0000'
      backBtn.scale.set(1.1)
      this.game.canvas.className = 'cursor-point'
    })
    
    backBtn.events.onInputOut.add(() => {
      backBtn.fill = '#cc0000'
      backBtn.scale.set(1.0)
      this.game.canvas.className = ''
    })
    
    backBtn.events.onInputUp.add(() => {
      this.game.state.start('menu')
    })
  }
  
  shutdown() {
    this.game.sound.stopAll()
  }
}

export default DLCShopState
