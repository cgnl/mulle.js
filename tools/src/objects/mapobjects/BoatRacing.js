'use strict'

/**
 * BoatRacing MapObject
 * @module objects/mapobjects/BoatRacing
 * 
 * Sea boat racing mini-game.
 * Based on original Lingo data from boten_CDDATA.CXT/Standalone/1989.txt:
 * [#ObjectId: 2, #type: #custom, #InnerRadius: 25, #OuterRadius: 45, 
 *  #CustomObject:"Racing", #DirResource: "", 
 *  #Sounds: ["82d005v0", "82d006v0", "82d007v0"], 
 *  #FrameList: [#Board: ["31b045v0"], #Goal:["Dummy"]], 
 *  #SetWhenDone:[#Medals:[2], #Missions:[16]], 
 *  #CheckFor:0, #IfFound:#None, #SpriteInfo:[#Under:4]]
 * 
 * Map data from 2174.txt (MapId 42):
 * [#MapId: 42, #objects: [[2, point(425, 75), [#EnterDir:12, #Board:point(549, 355)]], 
 *  [49, point(589,196), [#Sound:"82d004v0"]]], 
 *  #MapImage: "30b023v0", #UnderMapImage:"30b023v2", #Topology: "30t023v0"]
 * 
 * Sounds:
 * - 82d005v0: Race start sound
 * - 82d006v0: Lap complete / checkpoint sound
 * - 82d007v0: Race finish / win sound
 * - 82d004v0: Ambient/background sound
 */

import MulleSprite from 'objects/sprite'

var MapObject = {}

// ObjectId 2 is used for boat racing (different from car racing which is ObjectId 7)
MapObject.ObjectId = 2

/**
 * Format number for scoreboard display
 * @param {number} n - Time in seconds
 * @returns {string} Formatted time string
 */
function boardNumber (n) {
  return Math.round(n * 100) / 100
}

/**
 * Calculate direction from two points
 * Uses 16-direction system like the original Lingo code
 * @param {Phaser.Point} theStart - Starting position
 * @param {Phaser.Point} theEnd - Ending position
 * @returns {number} Direction 1-16
 */
function calcDirection (theStart, theEnd) {
  var diffX = theEnd.x - theStart.x
  var diffY = theStart.y - theEnd.y

  if (diffY === 0) diffY = 0.1

  var tempDirection = Math.atan(diffX / diffY)

  if (diffX > 0) {
    if (diffY <= 0) {
      tempDirection = tempDirection + Math.PI
    }
  } else {
    if (diffY > 0) {
      tempDirection = tempDirection + 2 * Math.PI
    } else {
      tempDirection = tempDirection + Math.PI
    }
  }

  tempDirection = tempDirection / Math.PI
  tempDirection = Math.round(tempDirection * 16 / 2)

  if (tempDirection === 0) tempDirection = 16

  return tempDirection
}

/**
 * Called when the racing object is created on the map
 */
MapObject.onCreate = function () {
  console.log('[BoatRacing] Creating boat racing object', this.id, this.opt)

  this.isRacing = false
  this.nrOfTimesPassed = 0
  this.raceStart = 0
  this.bestTime = null
  
  // Required entry direction (from original Lingo: #EnterDir:12)
  this.mustEnterFrom = this.opt && this.opt.EnterDir ? this.opt.EnterDir : 12

  // Create the scoreboard
  const boardPos = this.opt && this.opt.Board ? this.opt.Board : { x: 549, y: 355 }
  
  this.board = new MulleSprite(this.game, boardPos.x, boardPos.y)
  
  // Try to load scoreboard sprite (31b045v0)
  if (this.def && this.def.FrameList && this.def.FrameList.Board) {
    const boardSprite = this.def.FrameList.Board[0]
    if (boardSprite && boardSprite !== 'Dummy') {
      this.board.setDirectorMember('boten_CDDATA.CXT', boardSprite)
    }
  } else {
    // Fallback: create a simple scoreboard graphic
    this.createFallbackBoard()
  }
  
  this.game.add.existing(this.board)

  // Scoreboard text - current time
  this.boardText1 = new Phaser.Text(this.game, 15, 10, '', {
    font: '16px arial',
    fill: '#00ff00'
  })
  this.board.addChild(this.boardText1)

  // Scoreboard text - best time / other player
  this.boardText2 = new Phaser.Text(this.game, 15, 40, '', {
    font: '16px arial',
    fill: '#00ff00'
  })
  this.board.addChild(this.boardText2)

  // Status text
  this.statusText = new Phaser.Text(this.game, 15, 70, 'Klaar om te racen!', {
    font: '12px arial',
    fill: '#ffff00'
  })
  this.board.addChild(this.statusText)

  // Timer loop - update scoreboard every frame
  this.boardLoop = this.game.time.events.loop(Phaser.Timer.SECOND / 15, () => {
    if (this.isRacing) {
      const elapsed = (Date.now() - this.raceStart) / 1000
      this.boardText1.text = 'Tijd: ' + boardNumber(elapsed)
    }
  })

  // Network listener for multiplayer racing (if enabled)
  if (this.game.mulle.net && this.game.mulle.net.socket) {
    this.networkListener = (event) => {
      try {
        var msg = JSON.parse(event.data)

        if (msg.boatrace) {
          console.log('[BoatRacing] Network race message:', msg.boatrace)

          if (msg.boatrace[0]) {
            this.boardText1.text = boardNumber(msg.boatrace[0].time) + ' ' + msg.boatrace[0].name
          }
          if (msg.boatrace[1]) {
            this.boardText2.text = boardNumber(msg.boatrace[1].time) + ' ' + msg.boatrace[1].name
          }
        }
      } catch (e) {
        // Ignore parse errors
      }
    }

    this.game.mulle.net.socket.addEventListener('message', this.networkListener)
  }

  // Create visual race marker/buoy
  this.createRaceMarker()

  console.log('[BoatRacing] Racing object ready at', this.position.x, this.position.y)
}

/**
 * Create fallback scoreboard if sprite not found
 */
MapObject.createFallbackBoard = function () {
  const graphics = this.game.add.graphics(0, 0)
  
  // Board background
  graphics.beginFill(0x333333, 0.9)
  graphics.drawRoundedRect(0, 0, 120, 100, 5)
  graphics.endFill()
  
  // Border
  graphics.lineStyle(2, 0x00ff00, 1)
  graphics.drawRoundedRect(0, 0, 120, 100, 5)
  
  // Title
  const title = this.game.add.text(60, -10, 'RACE', {
    font: 'bold 14px arial',
    fill: '#00ff00'
  })
  title.anchor.setTo(0.5, 0.5)
  
  this.board.addChild(graphics)
  this.board.addChild(title)
}

/**
 * Create a visual race marker/buoy at the racing position
 */
MapObject.createRaceMarker = function () {
  this.raceMarker = this.game.add.graphics(this.position.x, this.position.y)
  
  // Outer glow
  this.raceMarker.beginFill(0xff6600, 0.3)
  this.raceMarker.drawCircle(0, 0, this.OuterRadius * 2)
  this.raceMarker.endFill()
  
  // Inner zone
  this.raceMarker.beginFill(0xff6600, 0.6)
  this.raceMarker.drawCircle(0, 0, this.InnerRadius * 2)
  this.raceMarker.endFill()
  
  // Buoy marker
  this.raceMarker.beginFill(0xff0000, 1)
  this.raceMarker.drawCircle(0, 0, 10)
  this.raceMarker.endFill()
  
  // Flag pole
  this.raceMarker.lineStyle(3, 0x333333, 1)
  this.raceMarker.moveTo(0, 0)
  this.raceMarker.lineTo(0, -30)
  
  // Checkered flag
  this.raceMarker.beginFill(0xffffff, 1)
  this.raceMarker.drawRect(-15, -30, 15, 10)
  this.raceMarker.endFill()
  this.raceMarker.beginFill(0x000000, 1)
  this.raceMarker.drawRect(-15, -30, 5, 5)
  this.raceMarker.drawRect(-5, -30, 5, 5)
  this.raceMarker.drawRect(-10, -25, 5, 5)
  this.raceMarker.drawRect(0, -25, 5, 5)
  this.raceMarker.endFill()
  
  // Pulse animation for visibility
  this.game.add.tween(this.raceMarker.scale)
    .to({ x: 1.1, y: 1.1 }, 800, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
}

/**
 * Called when boat enters the inner radius of the race marker
 * @param {MulleDriveBoat} boat - The boat object
 */
MapObject.onEnterInner = function (boat) {
  // Calculate the direction the boat is approaching from
  var tempEnterAngl = calcDirection(boat.position, this.position)
  var diff = Math.abs(this.mustEnterFrom - tempEnterAngl)
  if (diff > 8) diff = 16 - diff

  console.log('[BoatRacing] Enter inner - direction:', tempEnterAngl, 
              'required:', this.mustEnterFrom, 'diff:', diff)

  // Must enter from correct direction (within 3 steps of required direction)
  if (diff <= 3) {
    this.enteredFrom = 1

    if (this.isRacing) {
      // Check if this is the finish (after completing a lap)
      if (this.nrOfTimesPassed >= 1) {
        this.finishRace()
      }
    } else {
      // Start the race
      this.startRace()
    }

    return
  }

  // Wrong direction
  this.enteredFrom = -1
  
  if (!this.isRacing) {
    this.statusText.text = 'Verkeerde richting!'
    this.game.mulle.playAudio('82d006v0') // Checkpoint sound as warning
  }
}

/**
 * Start the race
 */
MapObject.startRace = function () {
  console.log('[BoatRacing] Race started!')

  // Play start sound
  if (this.def && this.def.Sounds && this.def.Sounds[0]) {
    this.game.mulle.playAudio(this.def.Sounds[0]) // 82d005v0
  }

  this.raceStart = Date.now()
  this.isRacing = true
  this.nrOfTimesPassed = 0

  this.statusText.text = 'Race gestart!'
  this.boardText1.text = 'Tijd: 0.00'
  
  // Flash the marker green
  this.raceMarker.tint = 0x00ff00
  this.game.time.events.add(500, () => {
    this.raceMarker.tint = 0xffffff
  })
}

/**
 * Finish the race and check for medal
 */
MapObject.finishRace = function () {
  console.log('[BoatRacing] Race finished!')

  // Play finish sound
  if (this.def && this.def.Sounds && this.def.Sounds[2]) {
    this.game.mulle.playAudio(this.def.Sounds[2]) // 82d007v0
  }

  this.isRacing = false

  const finalTime = (Date.now() - this.raceStart) / 1000
  const formattedTime = boardNumber(finalTime)

  this.boardText1.text = 'Finish: ' + formattedTime + 's'
  this.statusText.text = 'Gefeliciteerd!'

  console.log('[BoatRacing] Final time:', formattedTime, 'seconds')

  // Check if this is a new best time
  if (!this.bestTime || finalTime < this.bestTime) {
    this.bestTime = finalTime
    this.boardText2.text = 'Beste: ' + formattedTime + 's'
  }

  // Flash the marker gold
  this.raceMarker.tint = 0xffff00
  this.game.time.events.add(1000, () => {
    this.raceMarker.tint = 0xffffff
  })

  // Send to network if enabled
  if (this.game.mulle.net && this.game.mulle.net.socket) {
    this.game.mulle.net.send({ boatrace: finalTime })
  }

  // Award Medal 2 (Snelheids-medaille) on completing the race
  this.awardMedal()

  // Show completion dialog
  this.showRaceCompleteDialog(formattedTime)
}

/**
 * Award the speed medal (Medal 2)
 */
MapObject.awardMedal = function () {
  // Check if seaMedals manager exists
  if (this.game.mulle.seaMedals) {
    const alreadyHad = this.game.mulle.seaMedals.hasMedal(2)
    
    if (!alreadyHad) {
      this.game.mulle.seaMedals.awardMedal(2)
      console.log('[BoatRacing] Awarded Medal 2: Snelheids-medaille')
      
      // Show medal notification
      this.showMedalNotification()
    }
  }

  // Also set via SetWhenDone for compatibility
  if (this.SetWhenDone) {
    this.game.mulle.SetWhenDone = this.SetWhenDone
  }

  // Complete mission 16 (racing mission)
  if (this.game.mulle.user && this.game.mulle.user.completeSeaMission) {
    this.game.mulle.user.completeSeaMission(16)
  }
}

/**
 * Show medal notification
 */
MapObject.showMedalNotification = function () {
  const medalName = 'Snelheids-medaille'
  
  // Create notification group
  const notification = this.game.add.group()
  notification.x = 320
  notification.y = 150

  // Background
  const bg = this.game.add.graphics(0, 0)
  bg.beginFill(0x000000, 0.85)
  bg.drawRoundedRect(-150, -40, 300, 80, 10)
  bg.endFill()
  bg.lineStyle(3, 0xffd700, 1)
  bg.drawRoundedRect(-150, -40, 300, 80, 10)
  notification.add(bg)

  // Medal icon
  const medalIcon = this.game.add.graphics(-100, 0)
  medalIcon.beginFill(0xffd700, 1)
  medalIcon.drawCircle(0, 0, 25)
  medalIcon.endFill()
  medalIcon.beginFill(0xffec8b, 1)
  medalIcon.drawCircle(0, 0, 18)
  medalIcon.endFill()
  // Speed lines on medal
  medalIcon.lineStyle(2, 0xffd700, 1)
  medalIcon.moveTo(-8, -5)
  medalIcon.lineTo(8, -5)
  medalIcon.moveTo(-6, 0)
  medalIcon.lineTo(6, 0)
  medalIcon.moveTo(-8, 5)
  medalIcon.lineTo(8, 5)
  notification.add(medalIcon)

  // Text
  const title = this.game.add.text(20, -15, 'Medaille verdiend!', {
    font: 'bold 16px Arial',
    fill: '#ffd700'
  })
  notification.add(title)

  const name = this.game.add.text(20, 10, medalName, {
    font: '14px Arial',
    fill: '#ffffff'
  })
  notification.add(name)

  // Animate in
  notification.alpha = 0
  notification.y = 100
  
  this.game.add.tween(notification)
    .to({ alpha: 1, y: 150 }, 500, Phaser.Easing.Back.Out, true)

  // Animate out after delay
  this.game.time.events.add(3000, () => {
    this.game.add.tween(notification)
      .to({ alpha: 0, y: 100 }, 500, Phaser.Easing.Back.In, true)
      .onComplete.add(() => {
        notification.destroy()
      })
  })
}

/**
 * Show race complete dialog
 * @param {string} time - Formatted time string
 */
MapObject.showRaceCompleteDialog = function (time) {
  // Create dialog after a short delay
  this.game.time.events.add(500, () => {
    const dialog = this.game.add.group()
    dialog.x = 320
    dialog.y = 280

    // Background
    const bg = this.game.add.graphics(0, 0)
    bg.beginFill(0x003366, 0.95)
    bg.drawRoundedRect(-120, -60, 240, 120, 10)
    bg.endFill()
    bg.lineStyle(2, 0x00ccff, 1)
    bg.drawRoundedRect(-120, -60, 240, 120, 10)
    dialog.add(bg)

    // Title
    const title = this.game.add.text(0, -40, 'Race Voltooid!', {
      font: 'bold 18px Arial',
      fill: '#00ff00'
    })
    title.anchor.setTo(0.5, 0.5)
    dialog.add(title)

    // Time
    const timeText = this.game.add.text(0, -10, 'Tijd: ' + time + ' seconden', {
      font: '16px Arial',
      fill: '#ffffff'
    })
    timeText.anchor.setTo(0.5, 0.5)
    dialog.add(timeText)

    // OK button
    const okBtn = this.game.add.text(0, 30, 'OK', {
      font: 'bold 16px Arial',
      fill: '#00ccff',
      stroke: '#003366',
      strokeThickness: 2
    })
    okBtn.anchor.setTo(0.5, 0.5)
    okBtn.inputEnabled = true
    okBtn.events.onInputOver.add(() => {
      okBtn.fill = '#ffffff'
      this.game.mulle.cursor.current = 'Point'
    })
    okBtn.events.onInputOut.add(() => {
      okBtn.fill = '#00ccff'
      this.game.mulle.cursor.current = null
    })
    okBtn.events.onInputUp.add(() => {
      dialog.destroy()
      this.statusText.text = 'Klaar om te racen!'
    })
    dialog.add(okBtn)

    // Animate in
    dialog.alpha = 0
    dialog.scale.setTo(0.5)
    
    this.game.add.tween(dialog)
      .to({ alpha: 1 }, 300, Phaser.Easing.Linear.None, true)
    this.game.add.tween(dialog.scale)
      .to({ x: 1, y: 1 }, 300, Phaser.Easing.Back.Out, true)
  })
}

/**
 * Called when boat exits the inner radius
 * @param {MulleDriveBoat} boat - The boat object
 */
MapObject.onExitInner = function (boat) {
  if (this.isRacing) {
    console.log('[BoatRacing] Exit inner during race')

    var tempEnterAngl = calcDirection(boat.position, this.position)
    var diff = Math.abs(this.mustEnterFrom - tempEnterAngl)
    if (diff > 8) diff = 16 - diff

    if (diff <= 3) {
      // Exiting in the wrong direction (back through start)
      if (this.enteredFrom === -1) {
        this.nrOfTimesPassed--
        console.log('[BoatRacing] Lap count decreased:', this.nrOfTimesPassed)
      }
    } else {
      // Exiting in the correct direction (continuing the race)
      if (this.enteredFrom === 1) {
        this.nrOfTimesPassed++
        console.log('[BoatRacing] Lap count increased:', this.nrOfTimesPassed)
        
        // Play checkpoint sound
        if (this.def && this.def.Sounds && this.def.Sounds[1]) {
          this.game.mulle.playAudio(this.def.Sounds[1]) // 82d006v0
        }
        
        this.statusText.text = 'Ronde: ' + this.nrOfTimesPassed
      }
    }
  }
}

/**
 * Cleanup when the racing object is destroyed
 */
MapObject.onDestroy = function () {
  console.log('[BoatRacing] Destroying racing object')

  if (this.board) {
    this.board.destroy()
  }

  if (this.raceMarker) {
    this.raceMarker.destroy()
  }

  if (this.boardLoop) {
    this.game.time.events.remove(this.boardLoop)
  }

  if (this.networkListener && this.game.mulle.net && this.game.mulle.net.socket) {
    this.game.mulle.net.socket.removeEventListener('message', this.networkListener)
  }
}

export default MapObject
