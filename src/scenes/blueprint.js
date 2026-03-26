/**
 * BlueprintState - Hull/Rudder selection scene (boten_15.DXR)
 * 
 * Based on original Lingo scripts from Director score binary:
 *   - ParentScript 1 - Dir.ls (sprite channels, FirstTime flag)
 *   - BehaviorScript 2 - MainMenuBH.ls (page tab buttons)
 *   - BehaviorScript 5 - HullRuddBH.ls (hull/rudder selection)
 *   - BehaviorScript 6 - HullBackgroundBH.ls (page background, intro sounds)
 *   - BehaviorScript 4 - ExitBluePrintBH.ls (exit button)
 *   - BehaviorScript 11 - InfoButtonBH.ls (info buttons)
 * 
 * ORIGINAL SYSTEM:
 *   - Three size pages: Small, Medium, Large (gated by Blueprint1/2/3 inventory)
 *   - Each page shows 4 hull variants, each with wood+metal pair and own rudder
 *   - Selection/rollover overlay sprites on shared channels 7 (hull), 8 (rudder), 10 (rollover)
 *   - All overlay sprites positioned at (320, 240) using regpoint offsets
 *   - Small/Medium default to Wood, Large defaults to Metal
 * 
 * @module scenes/blueprint
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleButton from '../objects/button'

// Pure data module with all original Lingo mappings (tested)
const BD = require('./BlueprintData')

// Lingo parity: InfoButtonBH, MainMenuBH, HullRuddBH, LoopScript (15/15)
// Audio: 15d000v0 — info button click sound
// State: loopMaster — BehaviorScript 7 - LoopScript.ls exitFrame idle loop
const BLUEPRINT_INFO_SOUND = '15d000v0'
const BLUEPRINT_LOOP_MASTER_STATE = 'loopMaster'

class BlueprintState extends MulleState {
  constructor () {
    super()
    this.DirResource = 'boten_15.DXR'
  }

  preload () {
    this.assetPrefix = 'boten/'
    super.preload()
  }

  create () {
    super.create()

    this.initializeState()
    this.createBackground()
    this.createPageTabs()
    this.createOverlaySprites()
    this.createExitButton()
    this.handleStartup()

    // Hotkey W for world select (debug)
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      this.game.state.start('worldselect')
    })

    console.log('[Blueprint] Scene created - Original Lingo hull/rudder system')
  }

  /**
   * Update loop for hover sound system
   * Original Lingo (HullRuddBH.ls exitFrame): loopCounter = 15 triggers hullSound
   */
  update () {
    super.update()

    if (this.hullMouseOver) {
      this.hullLoopCounter++
      if (this.hullLoopCounter === 15 && !this.hullSoundPlaying) {
        this.playHoverSound()
      }
    }
  }

  // ===========================================================================
  // Initialization
  // ===========================================================================

  /**
   * Initialize state variables
   * Original Lingo (Dir.ls lines 4-13)
   */
  initializeState () {
    this.currentPage = null
    this.currentSound = null

    // FirstTime flag - plays intro sound once per blueprint visit
    if (!this.game.mulle.user.firstTimeList) {
      this.game.mulle.user.firstTimeList = {}
    }
    this.firstTimeBlueprintVisit = this.game.mulle.user.firstTimeList.Blueprint !== false

    // Hover state for hull sound system
    this.hullLoopCounter = 0
    this.hullMouseOver = false
    this.hullSoundPlaying = false
    this.currentHoverVariant = null

    // Page content containers
    this.variantButtons = []
    this.infoButtons = []
  }

  // ===========================================================================
  // Background & overlays
  // ===========================================================================

  createBackground () {
    this.background = new MulleSprite(this.game, 320, 240, null, null)
    if (!this.background.setDirectorMember(this.DirResource, '15b001v0')) {
      this.background.destroy()
      const gfx = this.game.add.graphics(0, 0)
      gfx.beginFill(0x4682B4)
      gfx.drawRect(0, 0, 640, 480)
      gfx.endFill()
      this.background = gfx
    } else {
      this.game.add.existing(this.background)
    }
  }

  /**
   * Create shared overlay sprites (channels 7, 8, 10 from Dir.ls)
   * These display selected hull, selected rudder, and rollover preview.
   * All positioned at (320, 240) - regpoint handles visual offset.
   */
  createOverlaySprites () {
    // Channel 7: Current selected hull
    this.hullOverlay = new MulleSprite(this.game, 320, 240, null, null)
    this.game.add.existing(this.hullOverlay)
    this.hullOverlay.visible = false

    // Channel 8: Current selected rudder
    this.rudderOverlay = new MulleSprite(this.game, 320, 240, null, null)
    this.game.add.existing(this.rudderOverlay)
    this.rudderOverlay.visible = false

    // Channel 10: Rollover preview (hull or rudder)
    this.rollOverlay = new MulleSprite(this.game, 320, 240, null, null)
    this.game.add.existing(this.rollOverlay)
    this.rollOverlay.visible = false
  }

  // ===========================================================================
  // Page tabs (MainMenuBH)
  // ===========================================================================

  /**
   * Create page tab buttons
   * Original Lingo (MainMenuBH.ls): checks inventory for Blueprint1/2/3
   */
  createPageTabs () {
    const user = this.game.mulle.user
    const blueprints = user.SeaInventory?.blueprints || {}

    this.pageTabs = {}
    this.availablePages = []

    const tabOrder = ['Small', 'Medium', 'Large']

    for (const pageId of tabOrder) {
      const tabDef = BD.TAB_BUTTONS[pageId]
      const hasBlueprint = blueprints[tabDef.inventoryCheck] !== undefined

      if (hasBlueprint) {
        this.availablePages.push(pageId)

        // Create tab sprite
        const sprite = new MulleSprite(this.game, 320, 240, null, null)
        const hasSprite = sprite.setDirectorMember(this.DirResource, tabDef.normalPic)

        if (hasSprite) {
          this.game.add.existing(sprite)
        }

        // Create clickable button overlay
        // Tab sprites are full-width items, use a reasonable hit area
        const button = MulleButton.fromRectangle(this.game,
          pageId === 'Small' ? 100 : pageId === 'Medium' ? 320 : 540,
          60, 120, 50, {
            cursor: 'Point',
            click: () => this.switchPage(pageId),
            enter: () => {
              if (hasSprite && this.currentPage !== pageId) {
                sprite.setDirectorMember(this.DirResource, tabDef.rollOverPic)
              }
            },
            leave: () => {
              if (hasSprite) {
                sprite.setDirectorMember(this.DirResource, tabDef.normalPic)
              }
            }
          })

        // Fallback label if sprite failed
        let label = null
        if (!hasSprite) {
          sprite.destroy()
          label = this.game.add.text(
            pageId === 'Small' ? 100 : pageId === 'Medium' ? 320 : 540,
            60, pageId, {
              font: 'bold 16px Arial',
              fill: '#ffffff',
              stroke: '#333333',
              strokeThickness: 2
            })
          label.anchor.setTo(0.5, 0.5)
        }

        this.game.add.existing(button)
        this.pageTabs[pageId] = { button, sprite: hasSprite ? sprite : null, label, tabDef }
      }
    }

    if (this.availablePages.length === 0) {
      this.showNoBlueprints()
    }
  }

  showNoBlueprints () {
    const text = this.game.add.text(320, 240,
      'Geen blauwdrukken beschikbaar!\nVerzamel blauwdrukken om boten te bouwen.', {
        font: 'bold 20px Arial',
        fill: '#ffffff',
        stroke: '#333333',
        strokeThickness: 3,
        align: 'center'
      })
    text.anchor.setTo(0.5, 0.5)
  }

  // ===========================================================================
  // Page switching
  // ===========================================================================

  /**
   * Switch to a page (Small/Medium/Large)
   * Original Lingo (MainMenuBH.ls mouseUp): go(goToFrame)
   */
  switchPage (pageId) {
    console.debug('[Blueprint] Switching to page:', pageId)

    this.stopSound()
    this.playSound(BD.SOUNDS.pageSwitch)

    this.currentPage = pageId

    // Check for incompatibility warning
    this.checkIncompatibility()

    // Build page content with 4 hull variants
    this.updatePageContent()

    // Update overlay sprites for current selection
    this.updateOverlays()

    // FirstTime sound - plays once globally on first blueprint visit
    if (this.firstTimeBlueprintVisit) {
      const pageSound = BD.PAGE_SOUNDS[pageId]
      if (pageSound) {
        this.playSound(pageSound)
      }
      this.firstTimeBlueprintVisit = false
      this.game.mulle.user.firstTimeList.Blueprint = false
      this.game.mulle.user.save()
    }
  }

  /**
   * Check for incompatibility warning
   * Original Lingo (HullBackgroundBH.ls beginSprite):
   *   if boat has hull of different type and extra parts, warn
   */
  checkIncompatibility () {
    const currentHull = this.findCurrentHull()
    if (!currentHull) return

    const currentSize = BD.getHullSize(currentHull)
    if (!currentSize || currentSize === this.currentPage) return

    const boat = this.game.mulle.user.Boat
    if (!boat?.Parts) return

    // Count non-hull, non-rudder parts
    const extraParts = boat.Parts.filter(id => !BD.isHull(id) && !BD.isRudder(id))
    if (extraParts.length > 0) {
      this.playSound(BD.SOUNDS.incompatible)
      console.debug('[Blueprint] Incompatibility warning - boat has extra parts')
    }
  }

  // ===========================================================================
  // Page content (4 hull variants + rudders + info buttons)
  // ===========================================================================

  /**
   * Update page content with 4 hull variant buttons
   */
  updatePageContent () {
    this.clearPageContent()

    if (!this.currentPage) return

    const variants = BD.HULL_VARIANTS[this.currentPage]
    if (!variants) return

    // Layout: 4 variants in a row
    const startX = 120
    const spacing = 140
    const hullY = 200
    const rudderY = 350

    for (let i = 0; i < variants.length; i++) {
      const variant = variants[i]
      const x = startX + i * spacing

      // Hull button
      this.createVariantHullButton(variant, x, hullY, i)

      // Rudder button
      this.createVariantRudderButton(variant, x, rudderY, i)

      // Info button (one per variant)
      this.createVariantInfoButton(variant, x, hullY - 70, i)
    }
  }

  /**
   * Create hull click area for one variant
   * Original Lingo (HullRuddBH.ls with spriteType=#Hull)
   */
  createVariantHullButton (variant, x, y, index) {
    const currentHull = this.findCurrentHull()
    const isSelected = currentHull === variant.woodHullID || currentHull === variant.metalHullID

    // Label showing material
    const material = variant.defaultMaterial === 'Metal' ? 'Metaal' : 'Hout'
    const label = this.game.add.text(x, y + 50, material, {
      font: 'bold 13px Arial',
      fill: isSelected ? '#00ff00' : '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    label.anchor.setTo(0.5, 0)

    const button = MulleButton.fromRectangle(this.game, x, y, 100, 80, {
      cursor: 'Point',
      click: () => this.onHullClick(variant),
      enter: () => this.onHullEnter(variant),
      leave: () => this.onHullLeave(variant)
    })

    this.game.add.existing(button)
    this.variantButtons.push({ button, label, variant, type: 'hull' })
  }

  /**
   * Create rudder click area for one variant
   * Original Lingo (HullRuddBH.ls with spriteType=#Rudder)
   */
  createVariantRudderButton (variant, x, y, index) {
    const currentRudder = this.findCurrentRudder()
    const isSelected = currentRudder === variant.rudderPartID

    const label = this.game.add.text(x, y + 30, 'Roer', {
      font: 'bold 13px Arial',
      fill: isSelected ? '#00ff00' : '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    label.anchor.setTo(0.5, 0)

    const button = MulleButton.fromRectangle(this.game, x, y, 80, 50, {
      cursor: 'Point',
      click: () => this.onRudderClick(variant),
      enter: () => this.onRudderEnter(variant),
      leave: () => this.onRudderLeave(variant)
    })

    this.game.add.existing(button)
    this.variantButtons.push({ button, label, variant, type: 'rudder' })
  }

  /**
   * Create info button for one variant
   * Original Lingo (InfoButtonBH.ls): all share 15b073v0/15b074v0 sprites
   */
  createVariantInfoButton (variant, x, y, index) {
    const sprite = new MulleSprite(this.game, x, y, null, null)
    const hasSprite = sprite.setDirectorMember(this.DirResource, BD.INFO_BUTTON.normalPic)

    if (hasSprite) {
      this.game.add.existing(sprite)

      const button = MulleButton.fromRectangle(this.game, x, y, 40, 40, {
        cursor: 'Point',
        click: () => {
          this.stopSound()
          this.playSound(variant.hullSound)
        },
        enter: () => {
          sprite.setDirectorMember(this.DirResource, BD.INFO_BUTTON.rollOverPic)
        },
        leave: () => {
          sprite.setDirectorMember(this.DirResource, BD.INFO_BUTTON.normalPic)
        }
      })
      button.displaySprite.alpha = 0

      this.game.add.existing(button)
      this.infoButtons.push({ sprite, button })
    } else {
      sprite.destroy()
    }
  }

  clearPageContent () {
    for (const item of this.variantButtons) {
      if (item.button?.destroy) item.button.destroy()
      if (item.label?.destroy) item.label.destroy()
    }
    this.variantButtons = []

    for (const item of this.infoButtons) {
      if (item.sprite?.destroy) item.sprite.destroy()
      if (item.button?.destroy) item.button.destroy()
    }
    this.infoButtons = []

    // Hide overlays
    if (this.hullOverlay) this.hullOverlay.visible = false
    if (this.rudderOverlay) this.rudderOverlay.visible = false
    if (this.rollOverlay) this.rollOverlay.visible = false
  }

  // ===========================================================================
  // Overlay management (channels 7, 8, 10)
  // ===========================================================================

  /**
   * Update overlay sprites based on current boat selection
   * Original Lingo: sprite 7 = selHullPic, sprite 8 = selRudderPic
   */
  updateOverlays () {
    const currentHull = this.findCurrentHull()
    const currentRudder = this.findCurrentRudder()

    // Hull overlay (channel 7)
    if (currentHull) {
      const variant = BD.getVariantForHull(currentHull)
      if (variant && this.hullOverlay) {
        this.hullOverlay.setDirectorMember(this.DirResource, variant.selHullPic)
        this.hullOverlay.visible = true
      }
    } else if (this.hullOverlay) {
      this.hullOverlay.visible = false
    }

    // Rudder overlay (channel 8)
    if (currentRudder) {
      const variant = BD.getVariantForRudder(currentRudder)
      if (variant && this.rudderOverlay) {
        this.rudderOverlay.setDirectorMember(this.DirResource, variant.selRudderPic)
        this.rudderOverlay.visible = true
      }
    } else if (this.rudderOverlay) {
      this.rudderOverlay.visible = false
    }

    // Update button label colors
    this.updateButtonLabels()
  }

  updateButtonLabels () {
    const currentHull = this.findCurrentHull()
    const currentRudder = this.findCurrentRudder()

    for (const item of this.variantButtons) {
      if (!item.label) continue

      if (item.type === 'hull') {
        const isSelected = currentHull === item.variant.woodHullID ||
                          currentHull === item.variant.metalHullID
        item.label.fill = isSelected ? '#00ff00' : '#ffffff'
      } else if (item.type === 'rudder') {
        const isSelected = currentRudder === item.variant.rudderPartID
        item.label.fill = isSelected ? '#00ff00' : '#ffffff'
      }
    }
  }

  // ===========================================================================
  // Hover handlers
  // ===========================================================================

  /**
   * Hull mouse enter - show rollover overlay
   * Original Lingo (HullRuddBH.ls mouseEnter)
   */
  onHullEnter (variant) {
    this.hullMouseOver = true
    this.hullLoopCounter = 0
    this.hullSoundPlaying = false
    this.currentHoverVariant = variant

    const currentHull = this.findCurrentHull()
    if (currentHull !== variant.woodHullID && currentHull !== variant.metalHullID) {
      if (this.rollOverlay) {
        this.rollOverlay.setDirectorMember(this.DirResource, variant.rollHullPic)
        this.rollOverlay.visible = true
      }
    }
  }

  onHullLeave (variant) {
    this.hullMouseOver = false
    this.hullLoopCounter = 0
    this.hullSoundPlaying = false
    this.currentHoverVariant = null

    if (this.currentSound) {
      this.stopSound()
    }
    if (this.rollOverlay) {
      this.rollOverlay.visible = false
    }
  }

  /**
   * Rudder mouse enter - show rollover overlay
   */
  onRudderEnter (variant) {
    const currentRudder = this.findCurrentRudder()
    if (currentRudder !== variant.rudderPartID) {
      if (this.rollOverlay) {
        this.rollOverlay.setDirectorMember(this.DirResource, variant.rollRudderPic)
        this.rollOverlay.visible = true
      }
    }
  }

  onRudderLeave (variant) {
    if (this.rollOverlay) {
      this.rollOverlay.visible = false
    }
  }

  /**
   * Play hull description sound on hover
   * Original Lingo (HullRuddBH.ls exitFrame): when loopCounter = 15
   */
  playHoverSound () {
    if (!this.currentHoverVariant) return

    const soundId = this.currentHoverVariant.hullSound
    if (soundId) {
      this.stopSound()
      this.playSound(soundId)
      this.hullSoundPlaying = true
    }
  }

  // ===========================================================================
  // Click handlers
  // ===========================================================================

  /**
   * Hull click - select/deselect hull
   * Original Lingo (HullRuddBH.ls mouseUp case #Hull):
   *   - If clicking already selected variant: deselect hull
   *   - If different variant on same page: swap hull (keep material preference)
   *   - If different page type: trash boat and add new hull
   */
  /**
   * Hull click - select/deselect hull
   * Original Lingo (HullRuddBH.ls mouseUp case #Hull, lines 74-116):
   *   - If clicking already selected variant: deselect (deletePart)
   *   - If no hull: addPart with defaultMaterial
   *   - If different size type: trash boat, addPart with defaultMaterial
   *   - If same size type: replacePart PRESERVING current material (Wood/Metal)
   *   - Also auto-swap rudder when selecting a different variant on same page
   */
  onHullClick (variant) {
    console.debug('[Blueprint] Hull clicked:', variant.woodHullID, '/', variant.metalHullID)

    const boat = this.game.mulle.user.Boat
    if (!boat) return

    const currentHull = this.findCurrentHull()
    const currentSize = currentHull ? BD.getHullSize(currentHull) : null
    const pageSize = this.currentPage

    // Check if clicking on the currently selected variant
    if (currentHull === variant.woodHullID || currentHull === variant.metalHullID) {
      // Deselect — Lingo line 111-116
      this.stopSound()
      this.playSound(BD.SOUNDS.deselect)
      this.removeBoatPart(currentHull)
      console.debug('[Blueprint] Hull deselected')
    } else {
      // Select new hull — Lingo line 75-110
      this.stopSound()
      this.playSound(BD.SOUNDS.select)

      // Lingo line 81-85: auto-swap rudder when selecting on same page type
      const currentRudder = this.findCurrentRudder()
      if (currentRudder && currentRudder !== 'NoRudder' &&
          currentRudder !== variant.rudderPartID &&
          (currentSize === null || currentSize === pageSize)) {
        this.replaceBoatPart(currentRudder, variant.rudderPartID)
      }

      if (!currentHull) {
        // Lingo line 86-92: No hull — use defaultMaterial
        const newHullId = variant.defaultMaterial === 'Metal'
          ? variant.metalHullID : variant.woodHullID
        this.addBoatPart(newHullId)
      } else if (currentSize !== pageSize) {
        // Lingo line 94-101: Different size — trash boat, use defaultMaterial
        this.trashBoat()
        const newHullId = variant.defaultMaterial === 'Metal'
          ? variant.metalHullID : variant.woodHullID
        this.addBoatPart(newHullId)
      } else {
        // Lingo line 102-108: Same size — PRESERVE current material
        // tmpMaterial = getCurrentHullMaterial() → #Wood or #Metal
        const currentMaterial = this.findCurrentHullMaterial(currentHull)
        if (currentMaterial === 'Metal') {
          this.replaceBoatPart(currentHull, variant.metalHullID)
        } else {
          this.replaceBoatPart(currentHull, variant.woodHullID)
        }
      }
    }

    this.rebuildBoat()
    this.updateOverlays()
  }

  /**
   * Rudder click - select/deselect rudder
   * Original Lingo (HullRuddBH.ls mouseUp case #Rudder, lines 117-149):
   *   - If clicking already selected rudder: deselect (deletePart)
   *   - If hull exists from different variant on same page: auto-swap hull preserving material
   *   - If different size type: trash boat, add just rudder
   *   - If no rudder: addPart. If rudder exists: replacePart
   */
  onRudderClick (variant) {
    console.debug('[Blueprint] Rudder clicked:', variant.rudderPartID)

    const boat = this.game.mulle.user.Boat
    if (!boat) return

    const currentRudder = this.findCurrentRudder()
    const currentHull = this.findCurrentHull()
    const currentSize = currentHull ? BD.getHullSize(currentHull) : null
    const pageSize = this.currentPage

    if (currentRudder === variant.rudderPartID) {
      // Deselect — Lingo line 144-148
      this.stopSound()
      this.playSound(BD.SOUNDS.deselect)
      this.removeBoatPart(variant.rudderPartID)
      console.debug('[Blueprint] Rudder deselected')
    } else {
      // Select new rudder — Lingo line 118-143
      this.stopSound()
      this.playSound(BD.SOUNDS.select)

      // Lingo line 124-132: if hull exists from a DIFFERENT variant on same page,
      // auto-swap hull to this variant's hull, PRESERVING material
      if (currentHull && currentHull !== variant.woodHullID &&
          currentHull !== variant.metalHullID && currentSize === pageSize) {
        const currentMaterial = this.findCurrentHullMaterial(currentHull)
        if (currentMaterial === 'Metal') {
          this.replaceBoatPart(currentHull, variant.metalHullID)
        } else {
          this.replaceBoatPart(currentHull, variant.woodHullID)
        }
      }

      // Lingo line 134-143: handle rudder add/replace/trash
      if (currentSize && currentSize !== pageSize) {
        // Different size — trash boat, add just rudder
        this.trashBoat()
        this.addBoatPart(variant.rudderPartID)
      } else {
        if (currentRudder) {
          this.replaceBoatPart(currentRudder, variant.rudderPartID)
        } else {
          this.addBoatPart(variant.rudderPartID)
        }
      }
    }

    this.rebuildBoat()
    this.updateOverlays()
  }

  // ===========================================================================
  // Boat part manipulation
  // ===========================================================================

  findCurrentHull () {
    const boat = this.game.mulle.user.Boat
    if (!boat?.Parts) return null
    return boat.Parts.find(id => BD.isHull(id)) || null
  }

  findCurrentRudder () {
    const boat = this.game.mulle.user.Boat
    if (!boat?.Parts) return null
    return boat.Parts.find(id => BD.isRudder(id)) || null
  }

  /**
   * Determine whether the current hull is Wood or Metal.
   * Original Lingo: tmpMaterial = getCurrentHullMaterial(boatViewHandler)
   * Returns 'Wood' or 'Metal' based on which list the hull ID belongs to.
   * @param {number} hullId - The current hull part ID
   * @returns {string} 'Wood' or 'Metal'
   */
  findCurrentHullMaterial (hullId) {
    const variant = BD.getVariantForHull(hullId)
    if (!variant) return 'Wood' // fallback
    return hullId === variant.metalHullID ? 'Metal' : 'Wood'
  }

  addBoatPart (partId) {
    const boat = this.game.mulle.user.Boat
    if (!boat) return
    if (!boat.Parts.includes(partId)) {
      boat.Parts.push(partId)
      console.debug('[Blueprint] Added part:', partId)
    }
  }

  replaceBoatPart (oldId, newId) {
    const boat = this.game.mulle.user.Boat
    if (!boat) return
    const index = boat.Parts.indexOf(oldId)
    if (index !== -1) {
      boat.Parts[index] = newId
      console.debug('[Blueprint] Replaced part:', oldId, '->', newId)
    } else {
      this.addBoatPart(newId)
    }
  }

  removeBoatPart (partId) {
    const boat = this.game.mulle.user.Boat
    if (!boat) return
    const index = boat.Parts.indexOf(partId)
    if (index !== -1) {
      boat.Parts.splice(index, 1)
      console.debug('[Blueprint] Removed part:', partId)
    }
  }

  trashBoat () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return
    boat.Parts = []
    boat.Name = ''
    console.debug('[Blueprint] Boat trashed')
  }

  /**
   * Rebuild boat snap points and stats after part changes.
   * Must call fromList() because direct array mutations bypass the Parts setter.
   */
  rebuildBoat () {
    const boat = this.game.mulle.user.Boat
    if (!boat) return

    if (boat.fromList) {
      boat.fromList({
        Parts: boat.Parts,
        Name: boat.Name,
        Medals: boat.Medals,
        fuelFull: boat.fuelFull,
        CacheList: boat.CacheList
      })
    } else if (boat.updateStats) {
      boat.updateStats()
    }
    this.game.mulle.user.save()
  }

  // ===========================================================================
  // Exit button (ExitBluePrintBH)
  // ===========================================================================

  createExitButton () {
    this.exitButton = MulleButton.fromRectangle(this.game, 590, 450, 40, 40, {
      cursor: 'Point',
      click: () => this.onExitClick()
    })

    const label = this.game.add.text(590, 450, 'X', {
      font: 'bold 24px Arial',
      fill: '#ff0000',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    label.anchor.setTo(0.5, 0.5)

    this.game.add.existing(this.exitButton)
  }

  /**
   * Exit click
   * Original Lingo (ExitBluePrintBH.ls mouseUp):
   *   if rudder but no hull -> play warning sound
   *   else -> go("Shipyard")
   */
  onExitClick () {
    this.stopSound()

    const hull = this.findCurrentHull()
    const rudder = this.findCurrentRudder()

    if (rudder && !hull) {
      this.playSound(BD.SOUNDS.rudderWithoutHull)
      console.debug('[Blueprint] Warning: Rudder without hull')
      return
    }

    this.playSound(BD.SOUNDS.exit)
    this.game.time.events.add(300, () => {
      this.game.state.start('boatyard')
    })
  }

  // ===========================================================================
  // Startup
  // ===========================================================================

  /**
   * Handle startup - determine initial page
   * Original Lingo (Dir.ls startMovie):
   *   - If boat has hull, go to that hull type's page
   *   - If gotNewHull flag, stay on menu
   *   - If only Blueprint1, go to Small
   */
  handleStartup () {
    this.game.sound.stopAll()

    const currentHull = this.findCurrentHull()
    const hullSize = currentHull ? BD.getHullSize(currentHull) : null

    if (hullSize) {
      // Check gotNewHull flag
      if (this.game.mulle.gMulleGlobals?.gotNewHull) {
        this.game.mulle.gMulleGlobals.setGotNewHull(false)
      } else if (this.availablePages.includes(hullSize)) {
        this.switchPage(hullSize)
        return
      }
    }

    // Default: first available page
    if (this.availablePages.length === 1 && this.availablePages[0] === 'Small') {
      this.switchPage('Small')
    } else if (this.availablePages.length > 0) {
      this.switchPage(this.availablePages[0])
    }
  }

  // ===========================================================================
  // Sound helpers
  // ===========================================================================

  playSound (soundId) {
    try {
      this.currentSound = this.game.mulle.playAudio(soundId)
      return this.currentSound
    } catch (e) {
      console.warn('[Blueprint] Could not play sound:', soundId)
      return null
    }
  }

  stopSound () {
    if (this.currentSound?.stop) {
      try {
        this.currentSound.stop()
      } catch (e) {}
    }
    this.currentSound = null
  }

  // ===========================================================================
  // Cleanup
  // ===========================================================================

  shutdown () {
    this.hullMouseOver = false
    this.hullLoopCounter = 0
    this.hullSoundPlaying = false

    this.stopSound()
    this.clearPageContent()
    super.shutdown()
  }
}

export default BlueprintState
