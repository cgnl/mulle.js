/**
 * Help/Diploma Scene (boten_08.DXR)
 *
 * Shows player information including:
 * - User name and boat name
 * - Boat display with parts
 * - Earned medals (6 total)
 * - Scrollable content with 3 positions
 * - Print functionality
 *
 * Original Lingo sources:
 * - ParentScript 2 - Dir.ls: Main director (new/init/startMovie/kill)
 *   - new: spriteList, returnTo, WhereFrom="08", userName/boatName text
 *   - init: correctedBoatLocH from hull width/regPoint, drawBoat(0.75 scale)
 *   - startMovie: stopBG + stopAllEffects, set cursor to standard
 *   - kill: clear text members
 * - BehaviorScript 7 - ScrollBH.ls: Scrollable content & medal display
 *   - 3 scroll steps, stepV = (812 - 300) / 3
 *   - Fixed medal slot positions: startH=65, width=90
 *   - ScrollToMid: jump to position 2
 * - BehaviorScript 13 - ArrowBH.ls: Scroll arrow buttons (no sound)
 * - BehaviorScript 34 - GoBackBH.ls: go("Leave") (no sound)
 * - BehaviorScript 35 - LeaveBH.ls: go(1, returnTo of gDir)
 * - BehaviorScript 38 - PrintBH.ls: play SndMouseClick, ScrollToMid, print
 * - BehaviorScript 10 - CursorBH.ls: Custom cursor behavior
 * - BehaviorScript 11 - CursorSpriteBH.ls: Cursor sprite (00b001v0 etc.)
 * - MovieScript 49.ls: changeRect utility
 * - Internal/81-86.txt: Medal names
 *   - 81.txt: Lange-afstands-medaille
 *   - 82.txt: Snelheids-medaille
 *   - 83.txt: Vrachtschip-medaille
 *   - 84.txt: Meest-blitse-boot-medaille
 *   - 85.txt: Duik-medaille
 *   - 86.txt: Luxe-medaille
 * - Internal/69.txt: "voor de boot" (for the boat)
 * - Internal/50.txt: UserName text field
 * - Internal/52.txt: SavedCarName text field
 *
 * This is the boat version of diploma.js (car version uses 08.DXR)
 *
 * @module scenes/help
 */
'use strict'

import MulleState from './base'
import DirectorHelper from '../objects/DirectorHelper'
import MulleBuildBoat from '../objects/buildboat'

/**
 * Audio constants for help/diploma scene.
 * Lingo: BehaviorScript 38 - PrintBH.ls line 4: play(gSound, "SndMouseClick", #EFFECT)
 */
const AUDIO = {
  /** Click sound for print button - Lingo: play(gSound, "SndMouseClick", #EFFECT) */
  PRINT_CLICK: 'SndMouseClick'
}

/**
 * Scroll constants matching Lingo BehaviorScript 7 - ScrollBH.ls
 * Lingo lines 19-23:
 *   set nrOfSteps to 3
 *   set totHeight to 812 - 300
 *   set stepV to totHeight / nrOfSteps
 *   set startV to 240 + (nowAt * stepV)
 */
const SCROLL = {
  NR_OF_STEPS: 3,
  TOT_HEIGHT: 812 - 300,       // 512
  get STEP_V () { return Math.floor(this.TOT_HEIGHT / this.NR_OF_STEPS) }, // ~170
  START_NOW_AT: 1               // Lingo: set nowAt to 1
}

/**
 * Medal display constants matching Lingo BehaviorScript 7 - ScrollBH.ls
 * Lingo lines 28-29:
 *   set tempStartH to 65
 *   set tempWidth to 90
 */
const MEDAL_LAYOUT = {
  START_H: 65,
  SLOT_WIDTH: 90,
  TOTAL_SLOTS: 6,
  /** Lingo line 35: locH of text sprite = locH of medal sprite - 43 */
  TEXT_OFFSET_H: -43,
  /** Lingo lines 72-73: medal text is 40px below medal icon */
  TEXT_OFFSET_V: 40,
  /** Lingo line 26: set medalsSP to 63 */
  SPRITE_START: 63
}

class HelpState extends MulleState {
  constructor () {
    super()

    // Director resource for help/diploma (boat version)
    this.DirResource = 'boten_08.DXR'

    // Scroll state - Lingo: set nowAt to 1 (1-based, JS is 0-based)
    this.scroll_level = 0

    /**
     * Corrected boat horizontal position.
     * Lingo Dir.ls init lines 22-30:
     *   set tmp to getCurrentHull(boatViewHandler)
     *   set tmpPart to getPart(parts, tmp)
     *   if objectp(tmpPart) then
     *     set tmpPic to getUseView(tmpPart)
     *     set tmp to the width of member tmpPic
     *     set correctedBoatLocH to 290 - integer(((tmp / 2) - regPoint.x) * 0.75)
     *   else
     *     set correctedBoatLocH to 290
     *   end if
     */
    this.correctedBoatLocH = 290

    // Member references from boten_08.DXR metadata
    this.members = {
      background: 93,      // 08b001v0 - main diploma background (802x812)
      header: 71,          // Title header (08b005v0)
      bottomSig: 70,       // Bottom signature (08b009v0)
      woodBorder: 15,      // Side border wood (08b006v0)
      upArrow: 17,         // Scroll up arrow
      downArrow: 18,       // Scroll down arrow
      printBtn: 67,        // Print button (06b007v0)
      closeBtn: 68,        // Close button (08b002v0)
      leftBorder: 39,      // LeftR border
      rightBorder: 40,     // RightR border
      userNameField: 50,   // UserName text field
      boatNameField: 52,   // SavedCarName text field
      forBoatText: 69,     // "voor de boot" text (08t007v0)
      // Medal images (large versions for display)
      // Lingo ScrollBH.ls line 24: ["00n001v0","00n003v0","00n005v0","00n006v0","00n008v0","00n007v0"]
      medalImages: [73, 74, 75, 76, 77, 78], // 00n001v0-00n008v0
      // Medal text members
      // Lingo ScrollBH.ls line 25: ["08t001v0","08t002v0","08t003v0","08t004v0","08t005v0","08t006v0"]
      medalTexts: [81, 82, 83, 84, 85, 86]  // 08t001v0-08t006v0
    }

    // Previous state to return to
    this.previousState = 'boatyard'
  }

  /**
   * Lingo Dir.ls on new me (lines 4-18):
   *   set returnTo to the WhereFrom of gMulleGlobals
   *   set the WhereFrom of gMulleGlobals to "08"
   *   set the text of member "UserName" to getUserName(user)
   *   set tempCarName to getName(boat)
   */
  init (previous) {
    if (previous) {
      this.previousState = previous
    }

    // Lingo Dir.ls line 7: set the WhereFrom of gMulleGlobals to "08"
    if (this.game && this.game.mulle && this.game.mulle.gMulleGlobals) {
      if (typeof this.game.mulle.gMulleGlobals.setWhereFrom === 'function') {
        this.game.mulle.gMulleGlobals.setWhereFrom('08')
      } else {
        this.game.mulle.gMulleGlobals.WhereFrom = '08'
      }
    }

    console.log('[Help] Initialized, returning to:', this.previousState)
  }

  preload () {
    super.preload()
    // Load boten_08.DXR assets if needed
    // The assets should already be loaded via the main pack
  }

  create () {
    super.create()

    // Lingo Dir.ls startMovie (lines 35-40):
    //   stopBG(gSound)
    //   stopAllEffects(gSound)
    this.stopAllAudio()

    // Create layer groups
    this.whiteLayer = this.add.group()
    this.background_layer = this.game.add.group()
    this.ui_layer = this.game.add.group()
    this.scroll_layer = this.game.add.group()

    this.createBackground()
    this.createBorders()
    this.createScrollableContent()
    this.createMedals()
    this.createNavigation()

    console.log('[Help] Scene created with scroll_level:', this.scroll_level)
  }

  createBackground () {
    // Header/title at top (member 71 - Title/08b005v0)
    this.header = DirectorHelper.sprite(this.game, 14, 2, this.DirResource, this.members.header, false, false)
    this.scroll_layer.add(this.header)

    // Right wood border (member 15 - 08b006v0)
    this.wood = DirectorHelper.sprite(this.game, 614, 240, this.DirResource, this.members.woodBorder)
    this.ui_layer.add(this.wood)

    // Create white rectangles for diploma paper effect
    const graphics = this.add.graphics(0, 0, this.whiteLayer)
    graphics.beginFill(0xFFFFFF)
    // Right border strip
    graphics.drawRect(572, 0, 13, 479)
    // Main content area (ToBeCaptured area for printing)
    graphics.drawRect(52, 100, 518, 368)
    // Full diploma border
    graphics.drawRect(0, 0, 587, 503)
  }

  createBorders () {
    // Side borders
    const frame = this.add.graphics(0, 0, this.scroll_layer)
    frame.beginFill(0x000000)
    // Left border (member 39 - LeftR)
    frame.drawRect(12, 2, 2, 777)
    // Right border (member 40 - RightR)
    frame.drawRect(572, 2, 2, 777)

    // Bottom signature (member 70 - 08b009v0)
    // Positioned 39 pixels from bottom
    const borderBottom = 779 // 2 + 777
    this.bottom = DirectorHelper.sprite(
      this.game,
      14,
      borderBottom - 39,
      this.DirResource,
      this.members.bottomSig,
      false,
      false
    )
    this.scroll_layer.add(this.bottom)
  }

  createScrollableContent () {
    const user = this.game.mulle.user

    // Lingo Dir.ls line 8: set the text of member "UserName" to getUserName(user)
    // User name (from member 50 - UserName field)
    this.userName = new Phaser.Text(
      this.game,
      0,
      0,
      user ? user.UserId || user.Name || '' : '',
      {
        font: '18pt Arial',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
        fill: '#000000'
      }
    )
    this.userName.setTextBounds(150, this.header.height + this.header.y - 6, 303, 43)
    this.scroll_layer.add(this.userName)

    // "voor de boot" text (member 69 - 08t007v0)
    // Lingo Dir.ls line 15: set the textSize of member "08t007v0" to 24
    const forBoatText = this.game.cache.getText(this.DirResource + '_strings')?.[69] || 'voor de boot'
    this.forBoatText = new Phaser.Text(
      this.game,
      0,
      0,
      forBoatText,
      {
        font: '16pt Arial',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
        fill: '#666666'
      }
    )
    this.forBoatText.setTextBounds(150, this.header.height + this.header.y + 36, 303, 29)
    this.scroll_layer.add(this.forBoatText)

    // Lingo Dir.ls lines 9-13: boat name from getName(boat), fallback to " "
    // Boat name (from member 52 - SavedCarName field)
    const boatNameStr = (user && user.Boat) ? user.Boat.Name || ' ' : ' '
    this.boatName = new Phaser.Text(
      this.game,
      0,
      0,
      boatNameStr,
      {
        font: '20pt Arial',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
        fill: '#000000'
      }
    )
    this.boatName.setTextBounds(150, this.header.height + this.header.y + 56, 303, 44)
    this.scroll_layer.add(this.boatName)

    // Boat image display area
    this.boatImageRectangle = new Phaser.Rectangle(
      52,
      this.header.height + this.header.y + 100,
      518,
      368
    )

    /**
     * Build and display the boat at corrected position.
     * Lingo Dir.ls init (lines 22-31):
     *   set tmp to getCurrentHull(boatViewHandler)
     *   set tmpPart to getPart(parts, tmp)
     *   if objectp(tmpPart) then
     *     set tmpPic to getUseView(tmpPart)
     *     set tmp to the width of member tmpPic
     *     set correctedBoatLocH to 290 - integer(((tmp/2) - regPoint.x) * 0.75)
     *   else
     *     set correctedBoatLocH to 290
     *   end if
     *   drawBoat(point(correctedBoatLocH, 340), 0.75, VOID, 0)
     */
    if (user && user.Boat && user.Boat.Parts) {
      this.boatImage = new MulleBuildBoat(
        this.game,
        this.correctedBoatLocH,
        340,   // Lingo: drawBoat y=340
        user.Boat.Parts,
        true, // scaled (0.75 in Lingo)
        false // not interactive
      )
      this.scroll_layer.add(this.boatImage)
    }

    // Medals will be created below the boat image
    this.medalsGroup = this.game.add.group(this.scroll_layer)
  }

  /**
   * Create medal display using fixed slot positions.
   *
   * Lingo BehaviorScript 7 - ScrollBH.ls init (lines 24-40):
   *   set tempMembers to ["00n001v0","00n003v0","00n005v0","00n006v0","00n008v0","00n007v0"]
   *   set tempText to ["08t001v0","08t002v0","08t003v0","08t004v0","08t005v0","08t006v0"]
   *   set medalsSP to 63
   *   set tempStartH to 65
   *   set tempWidth to 90
   *   repeat with N = 1 to 6
   *     if getMedal(boat, N) then
   *       set the member of sprite (medalsSP+N-1) to member getAt(tempMembers, N)
   *       set the member of sprite (medalsSP+N-1+6) to member getAt(tempText, N)
   *       set the locH of sprite (medalsSP+N-1) to tempStartH + (tempWidth * (N-1))
   *       set the locH of sprite (medalsSP+N-1+6) to locH of medal - 43
   *     else
   *       set the member of sprite (medalsSP+N-1) to member "Dummy"
   *       set the member of sprite (medalsSP+N-1+6) to member "Dummy"
   *     end if
   *   end repeat
   */
  createMedals () {
    const user = this.game.mulle.user

    if (!user || !user.Boat) {
      console.log('[Help] No boat data for medals')
      return
    }

    const medals = user.Boat.Medals || []
    const medalY = 623 // Position below the boat image area

    // Iterate all 6 fixed slots (Lingo: repeat with N = 1 to 6)
    for (let slotIndex = 0; slotIndex < MEDAL_LAYOUT.TOTAL_SLOTS; slotIndex++) {
      const medalId = slotIndex + 1 // 1-based medal ID
      const hasMedal = medals.indexOf(medalId) !== -1

      // Lingo: locH = tempStartH + (tempWidth * (N - 1))
      const slotX = MEDAL_LAYOUT.START_H + (MEDAL_LAYOUT.SLOT_WIDTH * slotIndex)

      if (!hasMedal) {
        // Lingo: set the member of sprite to member "Dummy" (hidden)
        console.log('[Help] Medal slot', medalId, 'empty (Dummy)')
        continue
      }

      // Get medal image sprite (members 73-78)
      try {
        const { key, frame } = this.game.mulle.getDirectorImage(
          this.DirResource,
          this.members.medalImages[slotIndex]
        )

        const medalSprite = new Phaser.Sprite(this.game, slotX, medalY, key, frame.name)
        medalSprite.width = 60
        medalSprite.height = 60
        this.medalsGroup.add(medalSprite)

        // Get medal text (members 81-86)
        // Lingo: locH of text = locH of medal - 43
        const medalTextKey = `${this.DirResource}_strings`
        const medalName = this.game.cache.getText(medalTextKey)?.[this.members.medalTexts[slotIndex]] ||
                          this.getMedalName(medalId)

        const medalNameText = new Phaser.Text(
          this.game,
          0,
          0,
          medalName,
          {
            font: '11pt Times New Roman',
            boundsAlignH: 'center',
            boundsAlignV: 'center',
            fill: '#000000',
            wordWrap: true,
            wordWrapWidth: MEDAL_LAYOUT.SLOT_WIDTH
          }
        )
        // Lingo lines 72-73: text at medal locV + 40
        medalNameText.setTextBounds(
          slotX + MEDAL_LAYOUT.TEXT_OFFSET_H,
          medalY + 60 + 10,
          MEDAL_LAYOUT.SLOT_WIDTH,
          40
        )
        this.medalsGroup.add(medalNameText)

        console.log('[Help] Displayed medal:', medalId, medalName, 'at slot x:', slotX)
      } catch (e) {
        console.warn('[Help] Failed to load medal', medalId, ':', e.message)
      }
    }
  }

  /**
   * Get medal name by ID
   * Falls back to hardcoded names if strings not loaded
   */
  getMedalName (medalId) {
    const medalNames = {
      1: 'Lange-afstands-medaille',
      2: 'Snelheids-medaille',
      3: 'Vrachtschip-medaille',
      4: 'Meest-blitse-boot-medaille',
      5: 'Duik-medaille',
      6: 'Luxe-medaille'
    }
    return medalNames[medalId] || `Medal ${medalId}`
  }

  createNavigation () {
    // Up scroll button (member 17)
    this.upButton = DirectorHelper.button(
      this.game,
      612,
      20,
      this.scrollUp,
      this,
      this.DirResource,
      this.members.upArrow,
      this.members.upArrow,
      true
    )
    this.ui_layer.add(this.upButton)

    // Down scroll button (member 18)
    this.downButton = DirectorHelper.button(
      this.game,
      612,
      186,
      this.scrollDown,
      this,
      this.DirResource,
      this.members.downArrow,
      this.members.downArrow,
      true
    )
    this.ui_layer.add(this.downButton)

    // Print button (member 67)
    this.printButton = DirectorHelper.button(
      this.game,
      612,
      378,
      () => {
        this.printHelp()
      },
      this,
      this.DirResource,
      this.members.printBtn,
      this.members.printBtn,
      true
    )
    this.ui_layer.add(this.printButton)

    // Close button (member 68)
    this.closeButton = DirectorHelper.button(
      this.game,
      611,
      441,
      () => {
        this.close()
      },
      this,
      this.DirResource,
      this.members.closeBtn,
      this.members.closeBtn,
      true
    )
    this.ui_layer.add(this.closeButton)

    this.updateNavigationButtons()
  }

  /**
   * Scroll up one step.
   * Lingo BehaviorScript 13 - ArrowBH.ls mouseUp:
   *   sendSprite(scrollerSprite, #scroll, -1)
   * Lingo BehaviorScript 7 - ScrollBH.ls scroll (lines 50-60):
   *   if (theDirection = -1) and (nowAt > 1) then
   *     set nowAt to nowAt + theDirection
   *     show(me)
   *   end if
   *
   * Note: Original Lingo ArrowBH has NO sound on scroll.
   */
  scrollUp () {
    if (this.scroll_level > 0) {
      const stepV = SCROLL.STEP_V
      this.scroll_layer.forEach((child) => {
        child.y = child.y + stepV
      })
      this.scroll_level--
      // Lingo ArrowBH.ls: no sound played on scroll
      console.log('[Help] Scrolled up, level:', this.scroll_level)
    }
    this.updateNavigationButtons()
  }

  /**
   * Scroll down one step.
   * Lingo BehaviorScript 13 - ArrowBH.ls mouseUp:
   *   sendSprite(scrollerSprite, #scroll, 1)
   * Lingo BehaviorScript 7 - ScrollBH.ls scroll (lines 50-60):
   *   if (theDirection = 1) and (nowAt < nrOfSteps) then
   *     set nowAt to nowAt + theDirection
   *     show(me)
   *   end if
   */
  scrollDown () {
    if (this.scroll_level < (SCROLL.NR_OF_STEPS - 1)) {
      const stepV = SCROLL.STEP_V
      this.scroll_layer.forEach((child) => {
        child.y = child.y - stepV
      })
      this.scroll_level++
      // Lingo ArrowBH.ls: no sound played on scroll
      console.log('[Help] Scrolled down, level:', this.scroll_level)
    }
    this.updateNavigationButtons()
  }

  /**
   * Jump scroll to middle position (step 2 of 3).
   * Lingo BehaviorScript 7 - ScrollBH.ls ScrollToMid (lines 45-48):
   *   on ScrollToMid me
   *     set nowAt to 2
   *     show(me)
   *   end
   */
  scrollToMid () {
    const targetLevel = 1 // Lingo nowAt=2 is 1-based, JS scroll_level=1 is 0-based
    if (this.scroll_level !== targetLevel) {
      const delta = targetLevel - this.scroll_level
      const stepV = SCROLL.STEP_V
      this.scroll_layer.forEach((child) => {
        child.y = child.y - (delta * stepV)
      })
      this.scroll_level = targetLevel
      console.log('[Help] Scrolled to mid, level:', this.scroll_level)
    }
    this.updateNavigationButtons()
  }

  updateNavigationButtons () {
    // Disable up button when at top
    if (this.upButton) {
      this.upButton.alpha = this.scroll_level > 0 ? 1 : 0.3
    }

    // Disable down button when at bottom
    if (this.downButton) {
      this.downButton.alpha = this.scroll_level < (SCROLL.NR_OF_STEPS - 1) ? 1 : 0.3
    }
  }

  /**
   * Stop all background music and sound effects.
   * Lingo Dir.ls startMovie (lines 35-36):
   *   stopBG(gSound)
   *   stopAllEffects(gSound)
   */
  stopAllAudio () {
    if (this.game && this.game.sound) {
      this.game.sound.stopAll()
    }
    console.log('[Help] Stopped all audio (Lingo: stopBG + stopAllEffects)')
  }

  /**
   * Print the help/diploma.
   * Lingo BehaviorScript 38 - PrintBH.ls mouseUp (lines 3-6):
   *   play(gSound, "SndMouseClick", #EFFECT)
   *   print(me)
   * Lingo PrintBH.ls print (line 19):
   *   sendSprite(scrollerSprite, #ScrollToMid)
   *   updateStage()
   *   ... PrintOMatic Xtra ...
   *
   * Browser print is used as replacement for PrintOMatic Xtra.
   */
  printHelp () {
    console.log('[Help] Print - playing click sound, scrolling to center, then printing')

    // Lingo PrintBH.ls line 4: play(gSound, "SndMouseClick", #EFFECT)
    this.game.mulle.playAudio(AUDIO.PRINT_CLICK)

    // Lingo PrintBH.ls line 19: sendSprite(scrollerSprite, #ScrollToMid)
    this.scrollToMid()

    // Wait for scroll to complete, then print
    setTimeout(() => {
      window.print()
    }, 500)
  }

  /**
   * Close help and return to previous scene.
   * Lingo BehaviorScript 34 - GoBackBH.ls:
   *   on mouseUp me
   *     go("Leave")
   *   end
   * Lingo BehaviorScript 35 - LeaveBH.ls:
   *   on exitFrame
   *     go(1, the returnTo of gDir)
   *   end
   *
   * Note: Original Lingo GoBackBH has NO sound on close.
   */
  close () {
    // Lingo GoBackBH.ls: no sound played on close
    console.log('[Help] Closing, returning to:', this.previousState)

    // Lingo Dir.ls kill (lines 42-46):
    //   set the text of member "SavedCarName" to " "
    //   set the text of member "UserName" to " "
    //   return 0
    // (Text member cleanup - handled by Phaser object destruction)

    this.game.state.start(this.previousState)
  }

  shutdown () {
    console.log('[Help] Shutdown')
    super.shutdown()
  }
}

export default HelpState
