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
import MulleBuildBoat from '../objects/buildboat'
import MulleBoatPart from '../objects/boatpart'
import SubtitleLoader from '../objects/SubtitleLoader'

/**
 * BoatyardState - Build boats at Christina Colombus's shipyard
 * @extends MulleState
 * 
 * Christina Colombus Reward System:
 * - Every 3 boats built, Christina visits and gives bonus parts
 * - Tiered rewards based on total boats built:
 *   - First visit: 2 parts
 *   - Tier 1 (2+ visits): 3 parts  
 *   - Tier 2 (4+ visits): 4 parts
 *   - Tier 3 (7+ visits): 5 parts (VIP)
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
    
    // Audio is already loaded in load.js
    this.subtitles.load()

    // Container for junk parts
    this.junkParts = this.game.add.group()
    
    // Track initial boat state for change detection
    this.enterParts = [...(this.game.mulle.user.Boat?.Parts || [])]

    // === BACKGROUND ===
    this.createBackground()

    // === BOAT BUILD AREA ===
    this.createBoatBuildArea()

    // === NAVIGATION ===
    this.createNavigation()

    // === CHRISTINA COLOMBUS NPC ===
    this.createChristinaActor()

    // === PARTS SHELF ===
    this.createPartsShelf()

    // === LOAD JUNK PARTS ===
    this.loadJunkParts()

    // === FIRST VISIT / INTRO DIALOGUE ===
    this.handleFirstVisit()

    console.log('[Boatyard] Scene created with', Object.keys(this.game.mulle.BoatPartsDB || {}).length, 'boat parts in database')
    
    // === CHEATS SECTION ===
    this.setupCheats()
  }

  /**
   * Setup cheat buttons for development/testing
   */
  setupCheats () {
    if (!this.game.mulle.cheats) return
    
    const cheatsDiv = document.getElementById('cheats')
    if (!cheatsDiv) return
    
    cheatsDiv.innerHTML = ''
    
    // Christina button (like Figge in garage)
    const b_christina = document.createElement('button')
    b_christina.innerHTML = 'Christina'
    b_christina.className = 'button'
    b_christina.addEventListener('click', () => {
      this.christina()
    })
    cheatsDiv.appendChild(b_christina)
    
    // Add all boat parts button
    const b_allParts = document.createElement('button')
    b_allParts.innerHTML = 'All Boat Parts'
    b_allParts.className = 'button'
    b_allParts.addEventListener('click', () => {
      this.calculateAvailableBoatParts()
      const allParts = [
        ...this.availableBoatParts.tier1,
        ...this.availableBoatParts.tier2,
        ...this.availableBoatParts.tier3
      ]
      allParts.forEach((partId, i) => {
        if (!this.game.mulle.user.hasBoatPart(partId)) {
          const x = 80 + ((i % 7) * 80)
          const y = 420
          this.game.mulle.user.addBoatPart('boatyard', partId, new Phaser.Point(x, y), true)
          this.createJunkPart(partId, x, y)
        }
      })
      this.game.mulle.user.save()
    })
    cheatsDiv.appendChild(b_allParts)
    
    // Reset Christina progress button
    const b_resetChristina = document.createElement('button')
    b_resetChristina.innerHTML = 'Reset Christina'
    b_resetChristina.className = 'button'
    b_resetChristina.addEventListener('click', () => {
      this.game.mulle.user.ChristinaVisits = 0
      this.game.mulle.user.ChristinaUnlocks = {
        tier1: false,
        tier2: false,
        tier3: false,
        vip: false
      }
      this.game.mulle.user.NrOfBuiltBoats = 0
      this.game.mulle.user.christinaIsComing = false
      this.game.mulle.user.save()
      console.log('[Boatyard] Christina progress reset')
    })
    cheatsDiv.appendChild(b_resetChristina)

    // === HOTKEYS ===
    
    // Hotkey W for world select (switch between car/boat worlds)
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      console.log('[Boatyard] Hotkey W - going to world select')
      this.game.state.start('worldselect')
    })

    // Hotkey C for credits
    const cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C)
    cKey.onDown.add(() => {
      this.game.state.start('credits')
    })
  }

  /**
   * Create background
   */
  createBackground () {
    // Member 1 = 04b001v0 = main shipyard background (640x480)
    const background = new MulleSprite(this.game, 320, 240)
    // Use boten_04.DXR (note: underscore, matching the asset pack dirFile)
    if (!background.setDirectorMember('boten_04.DXR', 1)) {
      console.warn('[Boatyard] Background sprite not found, using fallback')
      background.destroy()
      const fallback = this.game.add.graphics(320, 240)
      fallback.beginFill(0x87CEEB)
      fallback.drawRect(-320, -240, 640, 480)
      fallback.endFill()
    } else {
      this.game.add.existing(background)
    }
  }

  /**
   * Create the boat building area with MulleBuildBoat
   */
  createBoatBuildArea () {
    // Position where the boat is built (center-left of screen)
    const boatX = 300
    const boatY = 300

    // Create the buildable boat
    this.boat = new MulleBuildBoat(this.game, boatX, boatY, null, false, false)
    this.boat.junkParts = this.junkParts
    this.game.add.existing(this.boat)

    // Listen for attach/detach events
    this.boat.onAttach.add((partId) => {
      console.log('[Boatyard] Part attached:', partId)
      this.game.mulle.saveData()
      this.updateSeaworthyStatus()
    })

    this.boat.onDetach.add((partId, newId, pos) => {
      console.log('[Boatyard] Part detached:', partId, '-> create part', newId)
      this.createJunkPart(newId, pos.x, pos.y)
      this.game.mulle.saveData()
      this.updateSeaworthyStatus()
    })

    // Create status display
    this.createStatusDisplay(boatX, boatY + 120)
  }

  /**
   * Create status display showing boat seaworthiness
   */
  createStatusDisplay (x, y) {
    this.statusText = this.game.add.text(x, y, '', {
      font: 'bold 12px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2,
      align: 'center'
    })
    this.statusText.anchor.setTo(0.5, 0)

    this.updateSeaworthyStatus()
  }

  /**
   * Update the seaworthy status display
   * Uses comprehensive seaworthiness checks to show all issues
   */
  updateSeaworthyStatus () {
    if (!this.statusText) return

    const boat = this.game.mulle.user.Boat
    if (!boat) {
      this.statusText.text = 'Geen boot'
      this.updateSailDoorState()
      return
    }

    // Get all seaworthiness issues (not just the first one)
    const issues = boat.getAllSeaworthinessIssues()
    const lines = []

    if (issues.length === 0) {
      lines.push('Zeewaardig!')
      this.statusText.fill = '#00ff00'
    } else {
      // Show first 3 issues to avoid cluttering the display
      const displayIssues = issues.slice(0, 3)
      displayIssues.forEach(issue => {
        // Use short versions of the messages for the status display
        switch (issue.check) {
          case 'HULL':
            lines.push('Romp nodig')
            break
          case 'HULL_SIZE_MISMATCH':
            lines.push('Onderdelen passen niet op romp')
            break
          case 'STABILITY':
            lines.push('Niet stabiel genoeg')
            break
          case 'PROPULSION':
            lines.push('Aandrijving nodig (motor/zeil/roeispanen)')
            break
          case 'STEERING':
            lines.push('Besturing nodig (roer)')
            break
          case 'SEATING':
            lines.push('Zitplaats nodig')
            break
          case 'NAVIGATION':
            lines.push('Kompas nodig (grote boot)')
            break
          default:
            lines.push(issue.message)
        }
      })
      
      // Indicate if there are more issues
      if (issues.length > 3) {
        lines.push(`... en ${issues.length - 3} meer`)
      }
      
      this.statusText.fill = '#ff6666'
    }

    this.statusText.text = lines.join('\n')
    
    // Update sail door visual state
    this.updateSailDoorState()
  }

  /**
   * Create navigation elements using MulleButton (like garage.js door buttons)
   * - Exit door: return to world select
   * - Sail door: go to sea (only when boat is seaworthy)
   */
  createNavigation () {
    // Junk door button - goes to boat parts storage (boat_junk scene)
    // Like garage.js door_junk - leads to parts shed
    // Using door graphics from boten_04.DXR
    this.door_junk = new MulleButton(this.game, 320, 240, {
      imageDefault: ['boten_04.DXR', 2],  // 04b002v0 - junk door default
      imageHover: ['boten_04.DXR', 3],    // 04b003v0 - junk door hover
      soundDefault: '02e015v0',           // Door close sound
      soundHover: '02e016v0',             // Door open sound
      click: () => {
        console.log('[Boatyard] Going to boat parts storage')
        this.game.mulle.activeCutscene = 70
        this.game.state.start('boat_junk')
      }
    })
    
    this.door_junk.cursor = 'Click'
    this.door_junk.cursorHover = 'Click'
    this.door_junk.cursorDrag = 'MoveIn'
    
    this.game.add.existing(this.door_junk)

    // Sail door button - go to sea when boat is seaworthy
    // Members for sail/water door
    this.door_sail = new MulleButton(this.game, 320, 240, {
      imageDefault: ['boten_04.DXR', 4],  // 04b004v0 - sail door default
      imageHover: ['boten_04.DXR', 5],    // 04b005v0 - sail door hover
      soundDefault: '02e015v0',           // Door close sound  
      soundHover: '02e016v0',             // Door open sound
      click: () => {
        this.trySailing()
      }
    })
    
    this.door_sail.cursor = 'Right'
    this.door_sail.cursorHover = 'Right'
    this.door_sail.cursorDrag = 'MoveRight'
    
    this.game.add.existing(this.door_sail)

    // Store reference for seaworthy status updates
    this.sailDoorEnabled = true

    // === ALBUM FUNCTIONALITY ===
    // Camera button to save boat (like garage car_camera)
    this.boat_camera = MulleButton.fromRectangle(this.game, 589, 62, 41, 117, {
      imageHover: ['boten_04.DXR', 6],  // Camera highlight sprite (if available)
      soundHover: '02e011v0',
      click: () => {
        console.log('[Boatyard] Save boat to album')
        this.game.mulle.activeCutscene = 86
        this.game.mulle.user.activeVehicleType = 'boat'  // Tell album we're saving a boat
        this.game.state.start('album', true, false, 'save')
      }
    })
    this.game.add.existing(this.boat_camera)

    // Album button to load boat (like garage album)
    this.album = MulleButton.fromRectangle(this.game, 383, 41, 50, 28, {
      imageHover: ['boten_04.DXR', 7],  // Album highlight sprite (if available)
      soundHover: '02e011v0',
      click: () => {
        console.log('[Boatyard] Load boat from album')
        this.game.mulle.activeCutscene = 83
        this.game.mulle.user.activeVehicleType = 'boat'  // Tell album we're loading a boat
        this.game.state.start('album', true, false, 'load')
      }
    })
    this.game.add.existing(this.album)
  }

  /**
   * Update sail door visual state based on boat seaworthiness
   * Dims the door when boat is not seaworthy
   */
  updateSailDoorState () {
    if (!this.door_sail) return

    const boat = this.game.mulle.user.Boat
    const isSeaworthy = boat && boat.isSeaworthy()

    if (isSeaworthy) {
      this.door_sail.displaySprite.alpha = 1.0
      this.sailDoorEnabled = true
    } else {
      this.door_sail.displaySprite.alpha = 0.5
      this.sailDoorEnabled = false
    }
  }

  /**
   * Try to go sailing - check if boat is seaworthy
   * Uses comprehensive seaworthiness checks with specific dialogue for each issue
   */
  trySailing () {
    const boat = this.game.mulle.user.Boat
    if (!boat) {
      this.showDialogue('Je hebt geen boot!')
      return
    }

    // Get detailed seaworthiness result
    const result = boat.getSeaworthinessResult()
    
    if (!result.passed) {
      // Show dialogue explaining what's missing
      this.showDialogue(result.message)
      
      // Play Christina's audio for this specific issue
      if (result.dialogueId) {
        try {
          this.game.mulle.playAudio('boten_04.DXR/' + result.dialogueId)
        } catch (e) {
          console.warn('[Boatyard] Could not play seaworthiness audio:', result.dialogueId, e)
        }
      }
      
      console.log('[Boatyard] Boat not seaworthy:', result.check, '-', result.message)
      return
    }

    console.log('[Boatyard] Going sailing!')
    this.showDialogue('Op naar zee!')
    
    // Track boat building progress (similar to car building in garage)
    if (this.hasBoatChanged()) {
      if (isNaN(this.game.mulle.user.NrOfBuiltBoats)) {
        this.game.mulle.user.NrOfBuiltBoats = 0
      }
      
      this.game.mulle.user.NrOfBuiltBoats += 1
      this.game.mulle.user.christinaIsComing = true
      console.log('[Boatyard] Increase NrOfBuiltBoats to', this.game.mulle.user.NrOfBuiltBoats)
      this.game.mulle.user.save()
    }
    
    // Play success dialogue
    try {
      this.game.mulle.playAudio('boten_04.DXR/04d014v0') // "Op naar zee!" / success audio
    } catch (e) {
      console.warn('[Boatyard] Could not play sailing audio:', e)
    }
    
    // Set spawn edge for seaworld (entering from boatyard = south)
    // This tells seaworld to use the south spawn line
    this.game.mulle.seaSpawnEdge = 'south'
    
    // Start sea world scene after short delay
    this.game.time.events.add(1500, () => {
      this.game.state.start('seaworld')
    })
  }

  /**
   * Create Christina Colombus actor using MulleActor
   * She's the boat expert NPC (equivalent to Mulle for cars)
   * Animation frames from boten_04.DXR members 42-74
   */
  createChristinaActor () {
    // Christina position - she stands on the right side of the shipyard
    const christinaX = 575
    const christinaY = 320

    // Create MulleActor for Christina (like Mulle in garage.js)
    // The 'christina' actor is defined in actor.js with animations from boten/04.DXR
    this.christinaActor = new MulleActor(this.game, christinaX, christinaY, 'christina')
    this.game.add.existing(this.christinaActor)
    
    // Register Christina as an actor for dialogue system
    this.game.mulle.actors.christina = this.christinaActor

    // Make Christina clickable for dialogue
    this.christinaActor.inputEnabled = true
    this.christinaActor.events.onInputOver.add(() => {
      this.game.mulle.cursor.current = 'Point'
    })
    this.christinaActor.events.onInputOut.add(() => {
      this.game.mulle.cursor.current = null
    })
    this.christinaActor.events.onInputUp.add(() => {
      this.christinaTalk()
    })

    // Start idle animation
    this.christinaActor.animations.play('idle')

    // Setup random idle animations (scratch, look around, etc.)
    this.setupChristinaIdleAnimations()
    
    console.log('[Boatyard] Christina actor created with animations')
  }

  /**
   * Setup random idle animations for Christina
   * Similar to how Mulle has random scratching/looking animations
   */
  setupChristinaIdleAnimations () {
    // Random idle behavior timer
    this.christinaIdleTimer = this.game.time.events.loop(
      Phaser.Timer.SECOND * this.game.rnd.integerInRange(5, 12),
      () => {
        // Don't interrupt if Christina is talking
        if (this.christinaActor.isTalking) return

        // Random animation choice
        const rand = this.game.rnd.frac()
        if (rand < 0.3) {
          // Wave animation
          const waveAnim = this.christinaActor.animations.play('wave')
          if (waveAnim) {
            waveAnim.onComplete.addOnce(() => {
              this.christinaActor.animations.play('idle')
            })
          }
        } else if (rand < 0.5) {
          // Look at player briefly
          this.christinaActor.animations.play('lookPlayer')
          this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
            if (!this.christinaActor.isTalking) {
              this.christinaActor.animations.play('idle')
            }
          })
        }
        // Otherwise stay idle
      },
      this
    )
  }

  /**
   * Create the parts shelf where boat parts are displayed
   */
  createPartsShelf () {
    // Parts shelf area at the bottom
    const shelfY = 440
    const shelfRect = new Phaser.Rectangle(60, shelfY - 30, 520, 60)
    
    // Background for parts shelf
    const shelfBg = this.game.add.graphics(320, shelfY)
    shelfBg.beginFill(0x654321, 0.6)
    shelfBg.drawRect(-280, -30, 560, 60)
    shelfBg.endFill()

    // Store shelf bounds for part placement
    this.shelfBounds = shelfRect

    // Label
    const shelfLabel = this.game.add.text(320, shelfY - 20, 'Onderdelen', {
      font: 'bold 12px Arial',
      fill: '#ffffff',
      stroke: '#333333',
      strokeThickness: 2
    })
    shelfLabel.anchor.setTo(0.5, 0.5)
  }

  /**
   * Load junk parts from user save data
   */
  loadJunkParts () {
    const user = this.game.mulle.user
    
    // Get boat junk from save data
    const boatJunk = user.BoatJunk || {}
    const boatyardJunk = boatJunk.boatyard || {}

    console.log('[Boatyard] Loading junk parts:', Object.keys(boatyardJunk).length)

    // If no saved junk, add some starter parts
    if (Object.keys(boatyardJunk).length === 0) {
      this.addStarterParts()
      return
    }

    // Load saved parts
    for (const partId in boatyardJunk) {
      const pos = boatyardJunk[partId]
      this.createJunkPart(parseInt(partId), pos.x, pos.y)
    }
  }

  /**
   * Add some starter boat parts for new players
   */
  addStarterParts () {
    console.log('[Boatyard] Adding starter parts')

    // Find some basic parts from BoatPartsDB
    const starterPartIds = []
    const partsDB = this.game.mulle.BoatPartsDB || {}

    // Look for parts with specific properties
    for (const id in partsDB) {
      const part = partsDB[id]
      if (!part || !part.Properties) continue

      // Skip morphed parts (those with Master set)
      if (part.Master && part.Master !== 0) continue

      // Skip parts without views
      if (!part.JunkView && !part.ShelfView) continue

      // Add rudders (steering)
      if (part.Properties.rudder > 0 && starterPartIds.length < 8) {
        starterPartIds.push(parseInt(id))
      }
      // Add engines
      if (part.Properties.engine > 0 && starterPartIds.length < 8) {
        starterPartIds.push(parseInt(id))
      }
      // Add oars
      if (part.Properties.oar > 0 && starterPartIds.length < 8) {
        starterPartIds.push(parseInt(id))
      }
      // Add sails
      if (part.Properties.sailwithpole > 0 && starterPartIds.length < 8) {
        starterPartIds.push(parseInt(id))
      }
    }

    // Place parts on shelf
    const startX = 80
    const spacing = 70
    starterPartIds.forEach((partId, index) => {
      const x = startX + (index * spacing)
      const y = 440
      this.createJunkPart(partId, x, y)
      
      // Save to user data
      if (!this.game.mulle.user.BoatJunk) {
        this.game.mulle.user.BoatJunk = { boatyard: {} }
      }
      this.game.mulle.user.BoatJunk.boatyard[partId] = { x, y }
    })

    console.log('[Boatyard] Added', starterPartIds.length, 'starter parts:', starterPartIds)
  }

  /**
   * Create a junk part sprite
   * @param {number} partId - Part ID
   * @param {number} x - X position
   * @param {number} y - Y position
   */
  createJunkPart (partId, x, y) {
    const partData = this.game.mulle.BoatPartsDB[partId]
    if (!partData) {
      console.warn('[Boatyard] Unknown part:', partId)
      return null
    }

    const part = new MulleBoatPart(this.game, partId, x, y, true)
    part.boat = this.boat
    part.dropRects = [this.shelfBounds]

    this.junkParts.add(part)

    console.debug('[Boatyard] Created junk part', partId, 'at', x, y)

    return part
  }

  /**
   * Handle first visit dialogue, tutorial, and Christina rewards
   * 
   * On very first visit (never seen tutorial), redirects to Erson tutorial (boten_70.DXR)
   * On first boatyard visit after tutorial, plays Christina welcome
   * On subsequent visits, checks for Christina rewards
   */
  handleFirstVisit () {
    const user = this.game.mulle.user

    // Check if player has seen Erson tutorial (boten_70.DXR)
    if (!user.seenErsonTutorial) {
      console.log('[Boatyard] First time player - redirecting to Erson tutorial')
      // Redirect to tutorial scene
      this.game.time.events.add(100, () => {
        this.game.state.start('erson_intro')
      })
      return
    }

    if (!user.visitedBoatyard) {
      user.visitedBoatyard = true
      this.game.mulle.saveData()

      console.log('[Boatyard] First boatyard visit after tutorial - playing welcome dialogue')

      // Delay the welcome message slightly
      this.game.time.events.add(500, () => {
        this.christinaWelcome()
      })
    } else {
      // Check if Christina should give rewards (every 3 boats built)
      this.checkChristinaReward()
    }
  }

  /**
   * Check if Christina should appear and give rewards
   * Triggered every 3 boats built (similar to Figge for cars)
   */
  checkChristinaReward () {
    const user = this.game.mulle.user
    
    console.log('[Boatyard] Built boats:', user.NrOfBuiltBoats)
    console.log('[Boatyard] Built boats mod 3:', user.NrOfBuiltBoats % 3)
    console.log('[Boatyard] Christina is coming:', user.christinaIsComing)
    
    // Christina visits every 3 boats (like Figge)
    if (user.NrOfBuiltBoats % 3 === 0 && user.christinaIsComing) {
      console.log('[Boatyard] Christina is coming to give rewards!')
      user.christinaIsComing = false
      user.christinaBeenHere = true
      
      // Delay Christina's appearance slightly
      this.game.time.events.add(1000, () => {
        this.christina()
      })
    }
  }

  /**
   * Christina's welcome dialogue (first visit)
   * Uses MulleActor.talk() for proper animation sync
   */
  christinaWelcome () {
    console.log('[Christina] Welkom op mijn scheepswerf!')
    
    // Show subtitle/text box
    this.showDialogue('Welkom op mijn scheepswerf! Hier kun je je eigen boot bouwen. Sleep onderdelen van de plank naar je boot!')

    // Use MulleActor talk method for proper animation
    this.christinaActor.talk('boten_04.DXR/04d001v0', () => {
      this.christinaActor.animations.play('idle')
    })
  }

  /**
   * Check if the boat has changed since entering the boatyard
   * @returns {boolean}
   */
  hasBoatChanged () {
    const currentParts = this.game.mulle.user.Boat?.Parts || []
    if (currentParts.length !== this.enterParts.length)
      return true

    for (let i = 0; i < currentParts.length; i++) {
      if (currentParts[i] !== this.enterParts[i]) {
        console.log('[Boatyard] Boat has changed, different parts', i, currentParts[i], this.enterParts[i])
        return true
      }
    }
    return false
  }

  /**
   * Christina Colombus reward event - equivalent to Figge for cars
   * Triggers when player returns to boatyard after building boats
   */
  christina () {
    this.calculateAvailableBoatParts()

    // Christina announces she's here with wave animation
    this.showDialogue('Ahoy! Wat een mooie boot heb je gemaakt!')
    
    // Play wave animation first
    const waveAnim = this.christinaActor.animations.play('wave')
    if (waveAnim) {
      waveAnim.onComplete.addOnce(() => {
        // Then talk with proper animation
        this.christinaActor.talk('boten_04.DXR/04d005v0', () => {
          this.christinaActor.animations.play('idle')
        })
      })
    } else {
      // Fallback: just talk
      this.christinaActor.talk('boten_04.DXR/04d005v0', () => {
        this.christinaActor.animations.play('idle')
      })
    }

    // Visual feedback - make Christina actor bounce
    if (this.christinaActor && this.christinaActor.scale) {
      const tween = this.game.add.tween(this.christinaActor.scale)
      tween.to({ x: 1.1, y: 1.1 }, 200, Phaser.Easing.Bounce.Out, true, 0, 0, true)
    }

    // Give parts after dialogue
    this.game.time.events.add(3000, () => {
      this.christinaGiveParts()
    })
  }

  /**
   * Christina gives bonus boat parts based on visit tier
   * Equivalent to figgeGiveParts() for cars
   */
  christinaGiveParts () {
    // Initialize Christina tracking if not exists
    if (typeof this.game.mulle.user.ChristinaVisits === 'undefined') {
      this.game.mulle.user.ChristinaVisits = 0
    }
    
    if (!this.game.mulle.user.ChristinaUnlocks) {
      this.game.mulle.user.ChristinaUnlocks = {
        tier1: false,
        tier2: false,
        tier3: false,
        vip: false
      }
    }
    
    // Increment visit counter
    this.game.mulle.user.ChristinaVisits++
    console.log('[Christina] Visit #', this.game.mulle.user.ChristinaVisits)
    
    // Determine reward tier based on visits
    let partsToGive = 2 // Base amount (first visit)
    let tierMessage = ''
    
    if (this.game.mulle.user.ChristinaVisits >= 7) {
      // Tier 3: VIP captain (7+ visits)
      partsToGive = 5
      this.game.mulle.user.ChristinaUnlocks.tier3 = true
      this.game.mulle.user.ChristinaUnlocks.vip = true
      tierMessage = 'Je bent een echte kapitein! 5 speciale onderdelen!'
      console.log('[Christina] VIP tier unlocked! 5 parts')
    } else if (this.game.mulle.user.ChristinaVisits >= 4) {
      // Tier 2: Experienced sailor (4-6 visits)
      partsToGive = 4
      this.game.mulle.user.ChristinaUnlocks.tier2 = true
      tierMessage = 'Goed gedaan, zeeman! 4 onderdelen voor jou!'
      console.log('[Christina] Tier 2 unlocked! 4 parts')
    } else if (this.game.mulle.user.ChristinaVisits >= 2) {
      // Tier 1: Returning sailor (2-3 visits)
      partsToGive = 3
      this.game.mulle.user.ChristinaUnlocks.tier1 = true
      tierMessage = 'Welkom terug! 3 onderdelen als beloning!'
      console.log('[Christina] Tier 1 unlocked! 3 parts')
    } else {
      // First visit
      tierMessage = 'Hier zijn 2 onderdelen om mee te beginnen!'
      console.log('[Christina] First visit! 2 parts')
    }
    
    // Get available parts
    const availableParts = this.getAvailableBoatPartsForReward()
    
    if (availableParts.length === 0) {
      this.showDialogue('Je hebt al alle onderdelen! Geweldig!')
      console.log('[Christina] No available parts to give')
      this.game.mulle.user.save()
      return false
    }
    
    // Give parts
    let givenCount = 0
    const givenPartIds = []
    
    for (let i = 0; i < partsToGive && i < availableParts.length; i++) {
      const partId = availableParts[i]
      
      // Add part to boatyard junk pile
      const pos = new Phaser.Point(
        100 + (i * 80),
        420
      )
      this.game.mulle.user.addBoatPart('boatyard', partId, pos, true)
      
      // Create the visual part sprite
      this.createJunkPart(partId, pos.x, pos.y)
      
      givenPartIds.push(partId)
      givenCount++
      
      console.log('[Christina] Added boat part:', partId)
    }
    
    // Visual/audio feedback for receiving parts
    this.showRewardFeedback(givenCount, tierMessage)
    
    // Play reward sound
    try {
      this.game.mulle.playAudio('00e004v0') // Generic "got item" sound
    } catch (e) {
      console.warn('[Boatyard] Could not play reward audio')
    }
    
    console.log(`[Christina] Gave ${givenCount} parts (tier allows ${partsToGive}):`, givenPartIds)
    
    this.game.mulle.user.save()
    
    return true
  }

  /**
   * Calculate available boat parts that can be given as rewards
   * Organized into tiers based on part usefulness/rarity
   */
  calculateAvailableBoatParts () {
    this.availableBoatParts = {
      // Tier 1: Basic parts - accessories, simple decorations
      tier1: [21, 22, 6, 7, 96, 121, 122, 254, 255, 693, 695, 698, 700, 704],
      // Tier 2: Functional parts - sails, engines, rudders
      tier2: [4, 8, 100, 706, 854, 842, 844, 848, 853, 766],
      // Tier 3: Premium/rare parts - large ships, special items
      tier3: [716, 729, 730, 107, 108, 109, 110, 692, 699, 701, 705, 707, 708]
    }
  }

  /**
   * Get a list of boat parts available for reward (not already owned)
   * @returns {number[]} Array of part IDs
   */
  getAvailableBoatPartsForReward () {
    if (!this.availableBoatParts) {
      this.calculateAvailableBoatParts()
    }
    
    const user = this.game.mulle.user
    const unlocks = user.ChristinaUnlocks || {}
    const available = []
    
    // Always include tier1 parts
    for (const partId of this.availableBoatParts.tier1) {
      if (!user.hasBoatPart(partId)) {
        available.push(partId)
      }
    }
    
    // Include tier2 parts if unlocked
    if (unlocks.tier1 || unlocks.tier2 || unlocks.tier3) {
      for (const partId of this.availableBoatParts.tier2) {
        if (!user.hasBoatPart(partId)) {
          available.push(partId)
        }
      }
    }
    
    // Include tier3 parts if VIP
    if (unlocks.tier3 || unlocks.vip) {
      for (const partId of this.availableBoatParts.tier3) {
        if (!user.hasBoatPart(partId)) {
          available.push(partId)
        }
      }
    }
    
    // Shuffle the array for variety
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]]
    }
    
    return available
  }

  /**
   * Show visual feedback when receiving reward parts
   * @param {number} count Number of parts received
   * @param {string} message Message to display
   */
  showRewardFeedback (count, message) {
    // Create reward notification
    const rewardBg = this.game.add.graphics(320, 200)
    rewardBg.beginFill(0x004488, 0.9)
    rewardBg.drawRoundedRect(-200, -50, 400, 100, 15)
    rewardBg.endFill()
    rewardBg.alpha = 0
    
    const rewardText = this.game.add.text(320, 180, 'BONUS ONDERDELEN!', {
      font: 'bold 18px Arial',
      fill: '#ffcc00',
      stroke: '#000000',
      strokeThickness: 3,
      align: 'center'
    })
    rewardText.anchor.setTo(0.5, 0.5)
    rewardText.alpha = 0
    
    const countText = this.game.add.text(320, 210, `+${count} onderdelen`, {
      font: 'bold 24px Arial',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
      align: 'center'
    })
    countText.anchor.setTo(0.5, 0.5)
    countText.alpha = 0
    
    // Animate in
    this.game.add.tween(rewardBg).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true)
    this.game.add.tween(rewardText).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true, 100)
    this.game.add.tween(countText).to({ alpha: 1 }, 300, Phaser.Easing.Cubic.Out, true, 200)
    
    // Scale bounce effect
    countText.scale.setTo(0.5, 0.5)
    this.game.add.tween(countText.scale).to({ x: 1.2, y: 1.2 }, 300, Phaser.Easing.Bounce.Out, true, 200)
      .onComplete.add(() => {
        this.game.add.tween(countText.scale).to({ x: 1, y: 1 }, 200, Phaser.Easing.Cubic.Out, true)
      })
    
    // Show the tier message
    this.game.time.events.add(1500, () => {
      this.showDialogue(message)
    })
    
    // Fade out after delay
    this.game.time.events.add(4000, () => {
      this.game.add.tween(rewardBg).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.In, true)
      this.game.add.tween(rewardText).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.In, true)
      this.game.add.tween(countText).to({ alpha: 0 }, 500, Phaser.Easing.Cubic.In, true)
        .onComplete.add(() => {
          rewardBg.destroy()
          rewardText.destroy()
          countText.destroy()
        })
    })
  }

  /**
   * Christina talks when clicked
   * Uses MulleActor.talk() for proper animation sync
   * 
   * All available dialogue clips from boten_04.DXR:
   * 04d001v0 - 04d057v0 (with some gaps)
   */
  christinaTalk () {
    // Don't interrupt if already talking
    if (this.christinaActor.isTalking) return

    // All Christina dialogue clips organized by category
    const dialogues = {
      // Welcome/intro dialogues
      welcome: [
        { text: 'Welkom bij de Scheepswerf!', audio: 'boten_04.DXR/04d001v0' },
        { text: 'Hier bouwen we de mooiste boten!', audio: 'boten_04.DXR/04d002v0' },
        { text: 'Kies onderdelen en bouw je eigen boot!', audio: 'boten_04.DXR/04d003v0' },
        { text: 'Met een goede boot kun je overal naartoe varen!', audio: 'boten_04.DXR/04d004v0' }
      ],
      // Building tips
      tips: [
        { text: 'Pak onderdelen en sleep ze naar je boot!', audio: 'boten_04.DXR/04d006v0' },
        { text: 'Je boot heeft een roer nodig om te kunnen sturen!', audio: 'boten_04.DXR/04d007v0' },
        { text: 'Een motor of zeil geeft je boot aandrijving!', audio: 'boten_04.DXR/04d008v0' },
        { text: 'Een grotere romp kan meer onderdelen dragen.', audio: 'boten_04.DXR/04d009v0' },
        { text: 'Let op de stabiliteit van je boot!', audio: 'boten_04.DXR/04d010v0' },
        { text: 'Roeispanen werken goed voor kleine boten.', audio: 'boten_04.DXR/04d011v0' },
        { text: 'Een zeil is gratis energie van de wind!', audio: 'boten_04.DXR/04d012v0' },
        { text: 'Grote boten hebben een kompas nodig.', audio: 'boten_04.DXR/04d013v0' },
        { text: 'Vergeet niet om brandstof mee te nemen!', audio: 'boten_04.DXR/04d014v0' }
      ],
      // Encouragement
      encouragement: [
        { text: 'Goed bezig! Je boot ziet er mooi uit!', audio: 'boten_04.DXR/04d015v0' },
        { text: 'Wat een prachtige boot!', audio: 'boten_04.DXR/04d016v0' },
        { text: 'Je bent een echte scheepsbouwer!', audio: 'boten_04.DXR/04d017v0' },
        { text: 'Deze boot gaat het ver schoppen!', audio: 'boten_04.DXR/04d018v0' },
        { text: 'Fantastisch ontwerp!', audio: 'boten_04.DXR/04d019v0' },
        { text: 'Je hebt talent voor bootbouwen!', audio: 'boten_04.DXR/04d020v0' },
        { text: 'Ga zo door! Je maakt mooie boten!', audio: 'boten_04.DXR/04d021v0' }
      ],
      // Random chatter
      random: [
        { text: 'De zee roept!', audio: 'boten_04.DXR/04d022v0' },
        { text: 'Er is zoveel te ontdekken op zee!', audio: 'boten_04.DXR/04d023v0' },
        { text: 'Ik hou van de geur van hout en verf!', audio: 'boten_04.DXR/04d024v0' },
        { text: 'Een goede boot is een trouwe vriend.', audio: 'boten_04.DXR/04d025v0' },
        { text: 'De golven wachten op je!', audio: 'boten_04.DXR/04d026v0' },
        { text: 'Varen is het mooiste wat er is!', audio: 'boten_04.DXR/04d027v0' },
        { text: 'Elke boot heeft een eigen karakter.', audio: 'boten_04.DXR/04d028v0' },
        { text: 'De horizon is oneindig!', audio: 'boten_04.DXR/04d029v0' },
        { text: 'Wind in de zeilen, dat is vrijheid!', audio: 'boten_04.DXR/04d030v0' }
      ],
      // Advanced tips
      advanced: [
        { text: 'Balans is belangrijk voor snelheid.', audio: 'boten_04.DXR/04d032v0' },
        { text: 'Een stroomlijn maakt je boot sneller.', audio: 'boten_04.DXR/04d033v0' },
        { text: 'Decoraties maken je boot uniek!', audio: 'boten_04.DXR/04d034v0' },
        { text: 'Probeer verschillende combinaties!', audio: 'boten_04.DXR/04d035v0' },
        { text: 'Een vlag maakt je boot herkenbaar.', audio: 'boten_04.DXR/04d036v0' },
        { text: 'De kleur van je boot is jouw keuze!', audio: 'boten_04.DXR/04d037v0' },
        { text: 'Sommige onderdelen passen beter samen.', audio: 'boten_04.DXR/04d038v0' },
        { text: 'Experimenteer met verschillende rompen!', audio: 'boten_04.DXR/04d039v0' },
        { text: 'Een anker is handig voor lange reizen.', audio: 'boten_04.DXR/04d040v0' }
      ],
      // More dialogue
      extra: [
        { text: 'Wil je een grote of kleine boot bouwen?', audio: 'boten_04.DXR/04d041v0' },
        { text: 'Snelheid of stabiliteit, wat kies jij?', audio: 'boten_04.DXR/04d042v0' },
        { text: 'Een zeilboot of motorboot?', audio: 'boten_04.DXR/04d043v0' },
        { text: 'De onderdelen liggen klaar!', audio: 'boten_04.DXR/04d044v0' },
        { text: 'Neem je tijd om te bouwen.', audio: 'boten_04.DXR/04d045v0' },
        { text: 'Elke reis begint met een goede boot!', audio: 'boten_04.DXR/04d046v0' },
        { text: 'Bouw, vaar, ontdek!', audio: 'boten_04.DXR/04d047v0' },
        { text: 'De wereld ligt aan je voeten!', audio: 'boten_04.DXR/04d048v0' },
        { text: 'Klaar voor avontuur?', audio: 'boten_04.DXR/04d049v0' }
      ],
      // Final set
      final: [
        { text: 'Je boot is bijna klaar!', audio: 'boten_04.DXR/04d051v0' },
        { text: 'Nog een paar onderdelen...', audio: 'boten_04.DXR/04d052v0' },
        { text: 'De finishing touch!', audio: 'boten_04.DXR/04d053v0' },
        { text: 'Perfect!', audio: 'boten_04.DXR/04d054v0' },
        { text: 'Wat een meesterwerk!', audio: 'boten_04.DXR/04d055v0' },
        { text: 'Klaar om te varen!', audio: 'boten_04.DXR/04d056v0' },
        { text: 'Goede reis!', audio: 'boten_04.DXR/04d057v0' }
      ]
    }

    // Select a random category and then a random dialogue from that category
    const categories = Object.keys(dialogues)
    const category = categories[Math.floor(Math.random() * categories.length)]
    const categoryDialogues = dialogues[category]
    const dialogue = categoryDialogues[Math.floor(Math.random() * categoryDialogues.length)]

    console.log('[Christina]', category, '-', dialogue.text)

    this.showDialogue(dialogue.text)

    // Use MulleActor talk method for proper animation sync
    this.christinaActor.talk(dialogue.audio, () => {
      // Callback when talk finishes - return to idle
      this.christinaActor.animations.play('idle')
    })
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
    const boxY = 60

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

  shutdown () {
    super.shutdown()
    
    // Save junk positions
    this.saveJunkPositions()
    
    // Clean up Christina idle animation timer
    if (this.christinaIdleTimer) {
      this.game.time.events.remove(this.christinaIdleTimer)
      this.christinaIdleTimer = null
    }
    
    // Clean up actor reference
    if (this.game.mulle.actors.christina) {
      this.game.mulle.actors.christina = null
    }
    
    // Clear cheats div
    const cheatsDiv = document.getElementById('cheats')
    if (cheatsDiv) {
      cheatsDiv.innerHTML = ''
    }
    
    this.game.sound.stopAll()
    console.log('[Boatyard] Scene shutdown')
  }

  /**
   * Save junk part positions to user data
   */
  saveJunkPositions () {
    if (!this.junkParts) return

    const positions = {}
    this.junkParts.forEach((part) => {
      if (part.part_id) {
        positions[part.part_id] = { x: part.x, y: part.y }
      }
    })

    if (!this.game.mulle.user.BoatJunk) {
      this.game.mulle.user.BoatJunk = {}
    }
    this.game.mulle.user.BoatJunk.boatyard = positions
    this.game.mulle.saveData()

    console.log('[Boatyard] Saved', Object.keys(positions).length, 'junk positions')
  }
}

export default BoatyardState
