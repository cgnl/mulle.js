/**
 * BoatyardState - The boat building workshop
 * 
 * Equivalent of GarageState/YardState but for boats
 * Owner: Christina Colombus (like Mulle/Staf Schroot for cars)
 * 
 * Scene 04.DXR from boten ISO
 */
'use strict'

import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleButton from '../objects/button'
import MulleActor from '../objects/actor'
import SubtitleLoader from '../objects/SubtitleLoader'

/**
 * BoatyardState - Build boats at Christina Colombus's shipyard
 * @extends MulleState
 */
class BoatyardState extends MulleState {
  preload () {
    // Scene 04.DXR in boten is the shipyard (equivalent to yard/garage)
    this.DirResource = '04.DXR'
    this.assetPrefix = 'boten/'
    
    super.preload()
    
    // Subtitles for boat scenes
    this.subtitles = new SubtitleLoader(this.game, 'boatyard', ['dutch', 'english'])
    this.subtitles.preload()
  }

  create () {
    super.create()
    
    // Add audio for shipyard
    this.game.mulle.addAudio('boatyard')
    this.subtitles.load()

    // === BACKGROUND ===
    // Member 1 = 04b001v0 = main shipyard background (640x480)
    const background = new MulleSprite(this.game, 320, 240)
    background.setDirectorMember('boten/04.DXR', 1)
    this.game.add.existing(background)

    // === NAVIGATION ===
    this.createNavigation()

    // === CHRISTINA COLOMBUS NPC ===
    this.createChristinaActor()

    // === WORKBENCH AREA ===
    this.createWorkbench()

    // === BOAT PREVIEW AREA ===
    this.createBoatPreview()

    // === FIRST VISIT / INTRO DIALOGUE ===
    this.handleFirstVisit()

    console.log('[Boatyard] Scene created')
  }

  /**
   * Create navigation elements (back to world select)
   */
  createNavigation () {
    // Exit door/area - bottom left corner
    // In the original, this would be a clickable area to return to world select
    const exitArea = this.game.add.graphics(0, 400)
    exitArea.beginFill(0x000000, 0.0) // Invisible hitbox
    exitArea.drawRect(0, 0, 100, 80)
    exitArea.endFill()
    exitArea.inputEnabled = true
    
    exitArea.events.onInputOver.add(() => {
      this.game.canvas.className = 'cursor-point'
    })
    exitArea.events.onInputOut.add(() => {
      this.game.canvas.className = ''
    })
    exitArea.events.onInputUp.add(() => {
      console.log('[Boatyard] Returning to world select')
      this.game.state.start('worldselect')
    })

    // Visual indicator for exit (temporary text, remove when proper assets work)
    const exitText = this.game.add.text(50, 455, '← Terug', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    exitText.anchor.setTo(0.5, 0.5)
    exitText.alpha = 0.7
  }

  /**
   * Create Christina Colombus actor
   * She's the boat expert NPC (equivalent to Mulle for cars)
   * 
   * From metadata analysis:
   * - Member 42 (04a002v0) = Christina standing/idle frame
   * - Members 42-74 = animation frames
   */
  createChristinaActor () {
    // Christina position - she stands on the right side of the shipyard
    // Based on metadata: imagePosX ~540-575, imagePosY ~215-255
    const christinaX = 575
    const christinaY = 350

    // Create sprite for Christina
    this.christinaSprite = new MulleSprite(this.game, christinaX, christinaY)
    
    // Try to load the Christina idle frame (member 42 = 04a002v0)
    const loaded = this.christinaSprite.setDirectorMember('boten/04.DXR', 42)
    
    if (loaded) {
      console.log('[Boatyard] Christina sprite loaded from member 42')
    } else {
      // Fallback: create a placeholder
      console.warn('[Boatyard] Could not load Christina sprite, using placeholder')
      this.christinaSprite.destroy()
      
      // Pink placeholder circle
      this.christinaSprite = this.game.add.graphics(christinaX, christinaY)
      this.christinaSprite.beginFill(0xff69b4, 0.8)
      this.christinaSprite.drawCircle(0, 0, 60)
      this.christinaSprite.endFill()
    }
    
    this.game.add.existing(this.christinaSprite)

    // Name tag
    const nameTag = this.game.add.text(christinaX, christinaY + 80, 'Christina\nColombus', {
      font: 'bold 12px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2,
      align: 'center'
    })
    nameTag.anchor.setTo(0.5, 0)

    // Make Christina clickable for dialogue
    this.christinaSprite.inputEnabled = true
    this.christinaSprite.events.onInputOver.add(() => {
      this.game.canvas.className = 'cursor-point'
    })
    this.christinaSprite.events.onInputOut.add(() => {
      this.game.canvas.className = ''
    })
    this.christinaSprite.events.onInputUp.add(() => {
      this.christinaTalk()
    })

    // Store reference for animations
    this.christinaActor = this.christinaSprite
  }

  /**
   * Create the workbench/tools area where boat parts can be assembled
   */
  createWorkbench () {
    // The workbench is at the bottom of the screen
    // Boat parts would be displayed here for drag & drop
    
    // Parts tray background (bottom area)
    const trayY = 445
    const tray = this.game.add.graphics(320, trayY)
    tray.beginFill(0x654321, 0.5)
    tray.drawRect(-280, -25, 560, 50)
    tray.endFill()

    // Label
    const trayLabel = this.game.add.text(320, trayY, '⚓ Boot Onderdelen', {
      font: 'bold 14px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    trayLabel.anchor.setTo(0.5, 0.5)

    // Placeholder boat part icons
    const partIcons = [
      { icon: '🚣', name: 'Romp', x: 100 },
      { icon: '⛵', name: 'Zeil', x: 200 },
      { icon: '⚙️', name: 'Motor', x: 300 },
      { icon: '🪵', name: 'Mast', x: 400 },
      { icon: '⚓', name: 'Anker', x: 500 }
    ]

    partIcons.forEach((part) => {
      const partSprite = this.game.add.text(part.x, trayY, part.icon, {
        font: '28px Arial'
      })
      partSprite.anchor.setTo(0.5, 0.5)
      partSprite.inputEnabled = true
      
      partSprite.events.onInputOver.add(() => {
        this.game.canvas.className = 'cursor-grab'
        partSprite.scale.setTo(1.2)
      })
      partSprite.events.onInputOut.add(() => {
        this.game.canvas.className = ''
        partSprite.scale.setTo(1.0)
      })
      partSprite.events.onInputUp.add(() => {
        console.log('[Boatyard] Clicked part:', part.name)
        // TODO: Implement drag-and-drop in Phase 5
        this.showPartInfo(part.name)
      })
    })
  }

  /**
   * Create the boat preview area where the built boat is displayed
   */
  createBoatPreview () {
    // Boat preview area - center of screen
    const previewX = 300
    const previewY = 280

    // Water/dock area where the boat sits
    const waterArea = this.game.add.graphics(previewX, previewY + 40)
    waterArea.beginFill(0x4169e1, 0.3)
    waterArea.drawRect(-150, -20, 300, 60)
    waterArea.endFill()

    // Placeholder boat shape
    this.boatPreview = this.game.add.graphics(previewX, previewY)
    this.boatPreview.beginFill(0x8B4513, 0.6)
    // Simple boat hull shape
    this.boatPreview.moveTo(-80, 0)
    this.boatPreview.lineTo(-100, 30)
    this.boatPreview.lineTo(100, 30)
    this.boatPreview.lineTo(80, 0)
    this.boatPreview.lineTo(100, -10)
    this.boatPreview.lineTo(-80, -10)
    this.boatPreview.lineTo(-80, 0)
    this.boatPreview.endFill()

    // Mast placeholder
    this.boatPreview.beginFill(0x654321)
    this.boatPreview.drawRect(-5, -80, 10, 70)
    this.boatPreview.endFill()

    // Sail placeholder (triangle)
    this.boatPreview.beginFill(0xffffff, 0.8)
    this.boatPreview.moveTo(5, -75)
    this.boatPreview.lineTo(60, -20)
    this.boatPreview.lineTo(5, -10)
    this.boatPreview.lineTo(5, -75)
    this.boatPreview.endFill()

    // Label
    const previewLabel = this.game.add.text(previewX, previewY - 100, 'Jouw Boot', {
      font: 'bold 16px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    previewLabel.anchor.setTo(0.5, 0.5)

    // Info text
    const infoText = this.game.add.text(previewX, previewY + 80, 'Sleep onderdelen naar je boot!', {
      font: '12px Arial',
      fill: '#cccccc'
    })
    infoText.anchor.setTo(0.5, 0.5)
  }

  /**
   * Handle first visit dialogue and tutorial
   */
  handleFirstVisit () {
    const user = this.game.mulle.user

    if (!user.visitedBoatyard) {
      user.visitedBoatyard = true
      this.game.mulle.saveData()

      console.log('[Boatyard] First visit - playing welcome dialogue')

      // Delay the welcome message slightly
      this.game.time.events.add(500, () => {
        this.christinaWelcome()
      })
    }
  }

  /**
   * Christina's welcome dialogue (first visit)
   */
  christinaWelcome () {
    // Try to play the welcome audio (04d001v0)
    // This would be Christina's introduction
    const welcomeAudio = 'boten/04d001v0'
    
    console.log('[Christina] Welkom op mijn scheepswerf!')
    
    // Show subtitle/text box
    this.showDialogue('Welkom op mijn scheepswerf! Hier kun je je eigen boot bouwen. Kies onderdelen uit de voorraad en sleep ze naar de bouwplaats!')

    // Try to play audio
    if (this.game.mulle.playAudio) {
      try {
        this.game.mulle.playAudio(welcomeAudio)
      } catch (e) {
        console.warn('[Boatyard] Could not play welcome audio:', e)
      }
    }
  }

  /**
   * Christina talks when clicked
   */
  christinaTalk () {
    const dialogues = [
      { text: 'Welkom bij de Scheepswerf!', audio: '04d001v0' },
      { text: 'Hier bouwen we de mooiste boten!', audio: '04d002v0' },
      { text: 'Kies onderdelen en bouw je eigen boot!', audio: '04d003v0' },
      { text: 'Met een goede boot kun je overal naartoe!', audio: '04d004v0' },
      { text: 'Vergeet niet een roer en motor toe te voegen!', audio: '04d007v0' },
      { text: 'Een zeil helpt ook om vooruit te komen!', audio: '04d008v0' }
    ]

    const dialogue = dialogues[Math.floor(Math.random() * dialogues.length)]
    console.log('[Christina]', dialogue.text)

    this.showDialogue(dialogue.text)

    // Try to play audio
    if (this.game.mulle.playAudio) {
      try {
        this.game.mulle.playAudio('boten/' + dialogue.audio)
      } catch (e) {
        console.warn('[Boatyard] Could not play dialogue audio:', e)
      }
    }
  }

  /**
   * Show a dialogue box with text
   * @param {string} text - The dialogue text to display
   */
  showDialogue (text) {
    // Remove existing dialogue if present
    if (this.dialogueBox) {
      this.dialogueBox.destroy()
    }
    if (this.dialogueText) {
      this.dialogueText.destroy()
    }

    // Create dialogue box
    const boxWidth = 500
    const boxHeight = 60
    const boxX = 320
    const boxY = 80

    this.dialogueBox = this.game.add.graphics(boxX, boxY)
    this.dialogueBox.beginFill(0x000000, 0.8)
    this.dialogueBox.drawRoundedRect(-boxWidth/2, -boxHeight/2, boxWidth, boxHeight, 10)
    this.dialogueBox.endFill()

    this.dialogueText = this.game.add.text(boxX, boxY, text, {
      font: '14px Arial',
      fill: '#ffffff',
      wordWrap: true,
      wordWrapWidth: boxWidth - 40,
      align: 'center'
    })
    this.dialogueText.anchor.setTo(0.5, 0.5)

    // Auto-hide after 4 seconds
    this.game.time.events.add(4000, () => {
      if (this.dialogueBox) {
        this.game.add.tween(this.dialogueBox).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
      }
      if (this.dialogueText) {
        this.game.add.tween(this.dialogueText).to({ alpha: 0 }, 500, Phaser.Easing.Linear.None, true)
      }
    })
  }

  /**
   * Show info about a boat part
   * @param {string} partName - Name of the part
   */
  showPartInfo (partName) {
    const partInfos = {
      'Romp': 'De romp is de basis van je boot. Kies een stevige!',
      'Zeil': 'Met een zeil kun je de wind gebruiken om te varen.',
      'Motor': 'Een motor helpt als er geen wind is.',
      'Mast': 'De mast houdt het zeil omhoog.',
      'Anker': 'Met een anker kun je stilliggen.'
    }

    this.showDialogue(partInfos[partName] || `${partName} - onderdeel voor je boot`)
  }

  shutdown () {
    super.shutdown()
    this.game.sound.stopAll()
    console.log('[Boatyard] Scene shutdown')
  }
}

export default BoatyardState
