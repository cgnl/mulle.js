/**
 * Diploma Scene (08.DXR) - Car version
 *
 * Shows player diploma with:
 * - User name and car name
 * - Car display with parts
 * - Earned medals (6 total)
 * - Scrollable content with 3 positions
 * - Print functionality
 *
 * Original Lingo sources (boat_08/ - shared structure with car version):
 * - ParentScript 2 - Dir.ls: Main director (new/init/startMovie/kill)
 *   - new: spriteList, returnTo, WhereFrom="08", userName/carName text
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
 *
 * @module scenes/diploma
 */
import MulleState from './base'
import DirectorHelper from '../objects/DirectorHelper'
import MulleBuildCar from '../objects/buildcar'

/**
 * Audio constants for diploma scene.
 * Lingo BehaviorScript 38 - PrintBH.ls line 4: play(gSound, "SndMouseClick", #EFFECT)
 */
const AUDIO = {
  PRINT_CLICK: 'SndMouseClick'
}

/**
 * Scroll constants matching Lingo BehaviorScript 7 - ScrollBH.ls
 * Lingo lines 19-23:
 *   set nrOfSteps to 3
 *   set totHeight to 812 - 300
 *   set stepV to totHeight / nrOfSteps
 */
const SCROLL = {
  NR_OF_STEPS: 3,
  TOT_HEIGHT: 812 - 300,       // 512
  get STEP_V () { return Math.floor(this.TOT_HEIGHT / this.NR_OF_STEPS) } // ~170
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
  TEXT_OFFSET_H: -43,
  TEXT_OFFSET_V: 40
}

class DiplomaState extends MulleState {
  /**
   * Lingo Dir.ls on new me (lines 4-18):
   *   set returnTo to the WhereFrom of gMulleGlobals
   *   set the WhereFrom of gMulleGlobals to "08"
   */
  init (previous) {
    this.previousState = previous

    // Lingo Dir.ls line 7: set the WhereFrom of gMulleGlobals to "08"
    if (this.game && this.game.mulle && this.game.mulle.gMulleGlobals) {
      if (typeof this.game.mulle.gMulleGlobals.setWhereFrom === 'function') {
        this.game.mulle.gMulleGlobals.setWhereFrom('08')
      } else {
        this.game.mulle.gMulleGlobals.WhereFrom = '08'
      }
    }
  }

  preload () {
    this.DirResource = '08.DXR'
    super.preload()
    this.game.load.pack('diploma', 'assets/diploma.json', null, this)
    this.load.json('strings', 'assets/diploma-strings.json')
  }

  create () {
    console.log('Previous state', this.previousState)
    this.scroll_level = 0

    // Lingo Dir.ls startMovie (lines 35-36):
    //   stopBG(gSound)
    //   stopAllEffects(gSound)
    if (this.game && this.game.sound) {
      this.game.sound.stopAll()
    }

    this.whiteLayer = this.add.group()
    this.background_layer = this.game.add.group()
    this.ui_layer = this.game.add.group()
    this.scroll_layer = this.game.add.group()

    this.header = DirectorHelper.sprite(this.game, 14, 2, this.DirResource, 71, false, false)

    this.scroll_layer.add(this.header)

    this.rightMenuRectangle = new Phaser.Rectangle(0, -9, 587, 503)

    this.wood = DirectorHelper.sprite(this.game, 614, 240, this.DirResource, 15)
    this.ui_layer.add(this.wood)

    // Lingo BehaviorScript 13 - ArrowBH.ls: scroll arrows (no sound on click)
    this.upButton = DirectorHelper.button(this.game, 612, 20, this.scrollUp, this, this.DirResource, 17, 17, true)
    this.ui_layer.add(this.upButton)

    this.downButton = DirectorHelper.button(this.game, 612, 186, this.scrollDown, this, this.DirResource, 18, 18, true)
    this.ui_layer.add(this.downButton)

    // Lingo BehaviorScript 38 - PrintBH.ls: print with SndMouseClick
    this.printButton = DirectorHelper.button(this.game, 612, 378, this.printDiploma, this, this.DirResource, 67, 67, true)
    this.ui_layer.addChild(this.printButton)

    // Lingo BehaviorScript 34 - GoBackBH.ls: go("Leave") (no sound)
    this.closeButton = DirectorHelper.button(this.game, 611, 441, this.close, this, this.DirResource, 68, 68, true)
    this.ui_layer.add(this.closeButton)

    const graphics = this.add.graphics(0, 0, this.whiteLayer)
    graphics.beginFill(0xFFFFFF)
    graphics.drawRect(572, 0, 13, 479)

    graphics.drawRect(52, 100, 518, 368) // ToBeCaptured

    graphics.drawRect(0, 0, 587, 503)

    const strings = this.game.cache.getJSON('strings')

    this.userName = new Phaser.Text(this.game, 0, 0, this.game.mulle.user.UserId, {
      font: '36pt Arial',
      boundsAlignH: 'center',
      boundsAlignV: 'center'
    })
    this.userName.setTextBounds(150, this.header.height + this.header.y - 6, 303, 43)
    this.scroll_layer.add(this.userName)

    this.forCarText = new Phaser.Text(this.game, 0, 0, strings[this.DirResource][69], {
      font: '24pt Arial',
      boundsAlignH: 'center',
      boundsAlignV: 'center'
    })
    this.forCarText.setTextBounds(150, this.header.height + this.header.y + 36, 303, 29)
    this.scroll_layer.addChild(this.forCarText)

    // Lingo Dir.ls lines 9-13: car name from getName(car), fallback to " "
    const carNameStr = this.game.mulle.user.Car.Name || ' '
    this.carName = new Phaser.Text(this.game, 0, 0, carNameStr, {
      font: '36pt Arial',
      boundsAlignH: 'center',
      boundsAlignV: 'center'
    })
    this.carName.setTextBounds(150, this.header.height + this.header.y + 56, 303, 44)
    this.scroll_layer.add(this.carName)

    /**
     * Lingo Dir.ls init (lines 22-31):
     *   correctedBoatLocH = 290 - integer(((width/2) - regPoint.x) * 0.75)
     *   drawBoat(point(correctedBoatLocH, 340), 0.75, VOID, 0)
     */
    this.carImageRectangle = new Phaser.Rectangle(52, this.header.height + this.header.y + 100, 518, 368)
    this.carImage = new MulleBuildCar(this.game, this.carImageRectangle.centerX, this.carImageRectangle.centerY, null, true)
    this.scroll_layer.add(this.carImage)

    this.medals = this.game.add.group(this.scroll_layer)

    /**
     * Medal display using fixed slot positions.
     * Lingo BehaviorScript 7 - ScrollBH.ls init (lines 24-40):
     *   set tempStartH to 65
     *   set tempWidth to 90
     *   repeat with N = 1 to 6
     *     if getMedal(boat, N) then
     *       set locH to tempStartH + (tempWidth * (N-1))
     *     else
     *       set member to "Dummy"
     *     end if
     *   end repeat
     */
    for (let slotIndex = 0; slotIndex < MEDAL_LAYOUT.TOTAL_SLOTS; slotIndex++) {
      const medalId = slotIndex + 1
      const hasMedal = this.game.mulle.user.Car.Medals.indexOf(medalId) !== -1

      if (!hasMedal) {
        // Lingo: set the member of sprite to member "Dummy" (hidden)
        continue
      }

      // Lingo: locH = tempStartH + (tempWidth * (N - 1))
      const slotX = MEDAL_LAYOUT.START_H + (MEDAL_LAYOUT.SLOT_WIDTH * slotIndex)

      const { key, frame } = this.game.mulle.getDirectorImage(this.DirResource, 20 + medalId)
      const medalSprite = new Phaser.Sprite(this.game, slotX, 623, key, frame.name)
      this.medals.add(medalSprite)
      medalSprite.width = 60
      medalSprite.height = 60

      const medalName = new Phaser.Text(this.game, 0, 0, strings[this.DirResource][80 + medalId], {
        font: '11pt Times New Roman',
        boundsAlignH: 'center',
        boundsAlignV: 'center',
        wordWrap: true,
        wordWrapWidth: MEDAL_LAYOUT.SLOT_WIDTH
      })
      // Lingo: text locH = medal locH - 43; text locV = medal locV + 40
      medalName.setTextBounds(
        slotX + MEDAL_LAYOUT.TEXT_OFFSET_H,
        medalSprite.bottom + 10,
        MEDAL_LAYOUT.SLOT_WIDTH,
        40
      )
      this.medals.add(medalName)
    }

    const frameBorder = this.add.graphics(0, 0, this.scroll_layer)
    frameBorder.beginFill(0x000000)
    const border = frameBorder.drawRect(12, 2, 2, 777) // Left border
    frameBorder.drawRect(572, 2, 2, 777) // Right border

    // Line is 39 pixels from top of image, subtract to make bottom of side borders match bottom border
    // Texture 08b004v0
    this.bottom = DirectorHelper.sprite(this.game, 14, border.bottom - 39, this.DirResource, 70, false, false)
    this.scroll_layer.add(this.bottom)
  }

  /**
   * Scroll up one step.
   * Lingo BehaviorScript 7 - ScrollBH.ls scroll (lines 50-60):
   *   if (theDirection = -1) and (nowAt > 1) then
   *     set nowAt to nowAt + theDirection
   *     show(me)
   * Lingo ArrowBH.ls: no sound on scroll.
   */
  scrollUp () {
    if (this.scroll_level > 0) {
      const stepV = SCROLL.STEP_V
      this.scroll_layer.forEach((child) => {
        child.y = child.y + stepV
      })
      this.scroll_level--
    }
  }

  /**
   * Scroll down one step.
   * Lingo BehaviorScript 7 - ScrollBH.ls scroll (lines 50-60):
   *   if (theDirection = 1) and (nowAt < nrOfSteps) then
   *     set nowAt to nowAt + theDirection
   *     show(me)
   * Lingo ArrowBH.ls: no sound on scroll.
   */
  scrollDown () {
    if (this.scroll_level < (SCROLL.NR_OF_STEPS - 1)) {
      const stepV = SCROLL.STEP_V
      this.scroll_layer.forEach((child) => {
        child.y = child.y - stepV
      })
      this.scroll_level++
    }
  }

  /**
   * Jump scroll to middle position.
   * Lingo BehaviorScript 7 - ScrollBH.ls ScrollToMid (lines 45-48):
   *   on ScrollToMid me
   *     set nowAt to 2
   *     show(me)
   *   end
   */
  scrollToMid () {
    const targetLevel = 1
    if (this.scroll_level !== targetLevel) {
      const delta = targetLevel - this.scroll_level
      const stepV = SCROLL.STEP_V
      this.scroll_layer.forEach((child) => {
        child.y = child.y - (delta * stepV)
      })
      this.scroll_level = targetLevel
    }
  }

  /**
   * Print the diploma.
   * Lingo BehaviorScript 38 - PrintBH.ls mouseUp (lines 3-6):
   *   play(gSound, "SndMouseClick", #EFFECT)
   *   print(me)
   * Lingo PrintBH.ls print (line 19):
   *   sendSprite(scrollerSprite, #ScrollToMid)
   */
  printDiploma () {
    // Lingo PrintBH.ls line 4: play(gSound, "SndMouseClick", #EFFECT)
    this.game.mulle.playAudio(AUDIO.PRINT_CLICK)

    // Lingo PrintBH.ls line 19: sendSprite(scrollerSprite, #ScrollToMid)
    this.scrollToMid()

    // Browser print as replacement for PrintOMatic Xtra
    setTimeout(() => {
      window.print()
    }, 500)
  }

  /**
   * Close diploma and return to previous scene.
   * Lingo BehaviorScript 34 - GoBackBH.ls:
   *   on mouseUp me
   *     go("Leave")
   *   end
   * Note: Original Lingo GoBackBH has NO sound on close.
   */
  close () {
    this.game.state.start(this.previousState)
  }
}

export default DiplomaState
