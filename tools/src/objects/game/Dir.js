/**
 * Dir.js - Main game director for driving scene
 * Based on original Lingo: ParentScript 2 - Dir.ls
 *
 * Manages:
 * - Boat control and physics
 * - Weather system
 * - Map navigation and loading
 * - Game objects
 * - Input handling (mouse/keyboard)
 * - Game state (pausing, leaving)
 *
 * Original Lingo properties:
 * - drivingHandlers: Direction utilities
 * - boat: The boat object
 * - counter: Frame counter
 * - mode: Current game mode (#normal, #Driving, #end)
 * - cycling: Animation cycling flag
 * - spriteList: Mapping of sprite names to channel numbers
 * - ambience: Ambient sound manager
 * - map: Current map object
 * - mapCoordinate: Current map position
 * - objects: List of game objects in scene
 * - weatherRenderer: Weather/wind display
 * - nextDir: Next destination when leaving
 * - gotKeyPoll: Whether KeyPoll Xtra is available
 * - mulleTalkObject: Mulle speech manager
 * - transPic: Transition picture
 * - transSnd: Transition sound
 * - pausing: Whether game is paused
 * - isLeaving: Whether leaving current scene
 */
'use strict'

import DrivingHandlers from '../boat/DrivingHandlers.js'
import MulleSez from '../sound/MulleSez.js'
import WeatherRenderer from '../weather/WeatherRenderer.js'

// Sprite channel mappings
// Original: set spriteList to [#Water: 15, #UnderMap: 18, ...]
const SPRITE_LIST = {
  Water: 15,
  UnderMap: 18,
  waves: 20,
  map: 34,
  ObjectsUnder: 36,
  boat: 42,
  Sail: 43,
  Fog: 44,
  ObjectsOver: 45,
  Stroot: 64,
  BoatTypes: 65,
  HelpButton: 68,
  fuel: 72,
  TRANS: 75,
  MapOverview: 79,
  medal: 91,
  dialog: 91,
  DialogOverlay: 92,
  ToolBox: 106
}

export default class Dir {
  /**
   * Create game director
   * Original: on new me
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals

    // Original: set drivingHandlers to new(script "DrivingHandlers")
    this.drivingHandlers = new DrivingHandlers()

    // Original: set mulleTalkObject to new(script "MulleSez")
    // JS: Pass globals.game if available (it might not be yet in constructor?)
    // Usually globals has game reference if initialized.
    this.mulleTalkObject = new MulleSez(globals.game)

    // Expose for other systems that expect gDir.mulleTalkObject (Lingo parity)
    if (globals && globals.game && globals.game.mulle) {
      globals.game.mulle.mulleTalkObject = this.mulleTalkObject
      globals.game.mulle.dir = this
    }

    // Original: set spriteList to [#Water: 15, #UnderMap: 18, ...]
    this.spriteList = { ...SPRITE_LIST }

    // Original: set counter to 1
    this.counter = 1

    // Original: set mode to #normal
    this.mode = 'normal'

    // Original: set cycling to 0
    this.cycling = false

    // Original: set objects to []
    this.objects = []

    // Original: tryToUseDSound()
    // (Sound system initialization - handled elsewhere)

    // Original: set gotKeyPoll to 1/0 (based on available Xtras)
    this.gotKeyPoll = false

    // Original: set pausing to 0
    this.pausing = false

    // Original: set isLeaving to 0
    this.isLeaving = false

    // Other properties initialized by init()
    this.boat = null
    this.ambience = null
    this.weatherRenderer = null
    this.map = null
    this.mapCoordinate = { x: 0, y: 0 }
    this.nextDir = null
    this.transPic = null
    this.transSnd = null
  }

  /**
   * Initialize the director
   * Original: on init me
   */
  init() {
    // Original: loadWorld(me)
    this.loadWorld()

    // Original: set mapCoordinate to the StartMap of the world of gMulleGlobals
    if (this.globals.world && this.globals.world.StartMap) {
      this.mapCoordinate = { ...this.globals.world.StartMap }
    }

    // Original: updateProperties(the boat of the user of gMulleGlobals)
    // (Updates boat properties from user data)

    // Original: set boat to new(script "BoatBase")
    // Boat is created and initialized here

    // Original: set ambience to new(script "AmbienceSound")
    // Original: set weatherRenderer to new(script "WeatherRenderer")
    // JS: Initialize here. Assuming weather controller is available in globals or we create it?
    // Lingo: Director usually holds weather or globals does.
    // For now, assuming globals.weather exists or null.
    // AND PASS GAME for visuals!
    this.weatherRenderer = new WeatherRenderer(
      this.drivingHandlers,
      this.globals.weather,
      this.globals.game
    )

    // Original: set mode to #Driving
    this.mode = 'Driving'

    // Original: addObject(the loopMaster of gMulleGlobals, me)
    if (this.globals.loopMaster) {
      this.globals.loopMaster.addObject(this)
    }
  }

  /**
   * Kill/cleanup the director
   * Original: on kill me
   * @returns {null}
   */
  kill() {
    // Original: deleteObject(the loopMaster of gMulleGlobals, me)
    if (this.globals && this.globals.loopMaster) {
      this.globals.loopMaster.deleteObject(this)
    }

    // Original: repeat with tmpObj in objects; kill(tmpObj); end repeat
    for (const obj of this.objects) {
      if (obj && typeof obj.kill === 'function') {
        obj.kill()
      }
    }

    // Original: set objects to []
    this.objects = []

    // Original: set drivingHandlers to kill(drivingHandlers)
    if (this.drivingHandlers && typeof this.drivingHandlers.kill === 'function') {
      this.drivingHandlers.kill()
    }
    this.drivingHandlers = null

    // Original: set boat to kill(boat)
    if (this.boat && typeof this.boat.kill === 'function') {
      this.boat.kill()
    }
    this.boat = null

    // Original: set weatherRenderer to kill(weatherRenderer)
    if (this.weatherRenderer && typeof this.weatherRenderer.kill === 'function') {
      this.weatherRenderer.kill()
    }
    this.weatherRenderer = null

    // Original: set ambience to kill(ambience)
    if (this.ambience && typeof this.ambience.kill === 'function') {
      this.ambience.kill()
    }
    this.ambience = null

    // Original: set mulleTalkObject to kill(mulleTalkObject)
    if (this.mulleTalkObject && typeof this.mulleTalkObject.kill === 'function') {
      this.mulleTalkObject.kill()
    }
    this.mulleTalkObject = null

    // Original: useNormalSound()
    // (Sound system cleanup)

    // Original: return 0
    return null
  }

  /**
   * Handle mouse input
   * Original: on mouse me, argObj, argWhat
   * @param {Object} argObj - Mouse event object
   * @param {string} argWhat - Mouse event type ('down', 'up', etc.)
   */
  mouse(argObj, argWhat) {
    // Original: if pausing then exit
    if (this.pausing) {
      return
    }

    // Original: if argWhat = #down then
    if (argWhat === 'down') {
      // Original: set the steerMethod of boat to #mouse
      if (this.boat && this.boat.steerMethod !== 'mouse') {
        this.boat.steerMethod = 'mouse'
      }
    }
  }

  /**
   * Handle keyboard input
   * Original: on key me, arg1, arg2
   * @param {number|string} arg1 - First key input (direction)
   * @param {number|string} arg2 - Second key input
   */
  key(arg1, arg2) {
    if (!this.boat) return

    // Original: if the steerMethod of boat = #Keys then
    if (this.boat.steerMethod === 'Keys') {
      // Original: steer(boat, arg1, arg2)
      this.boat.steer(arg1, arg2)
    } else {
      // Original: if (arg1 <> 0) or (arg2 <> 0) then
      if (arg1 !== 0 || arg2 !== 0) {
        // Original: set the steerMethod of boat to #Keys
        this.boat.steerMethod = 'Keys'
        // Original: steer(boat, arg1, arg2)
        this.boat.steer(arg1, arg2)
      }
    }
  }

  /**
   * Main game loop
   * Original: on loop me
   */
  loop() {
    // Original: if mode = #Driving then
    if (this.mode === 'Driving') {
      // Original: if gotKeyPoll then KeyPoll()
      // (KeyPoll Xtra handling - not implemented)

      // Original: loop(boat)
      if (this.boat && typeof this.boat.loop === 'function') {
        this.boat.loop()
      }

      // Original: set tmpLoc to getShowCoordinate(boat)
      const tmpLoc = this.boat ? this.boat.getShowCoordinate() : { x: 0, y: 0 }

      // Original: repeat with tmpObj in objects; step(tmpObj, tmpLoc); end repeat
      for (const obj of this.objects) {
        if (obj && typeof obj.step === 'function') {
          obj.step(tmpLoc)
        }
      }

      // Original: loop(mulleTalkObject, soundBusy(5) = 0)
      if (this.mulleTalkObject) {
        // Check if channel 5 (voice) is busy.
        // In Phaser, we'd check if voice audio is playing.
        // For now, pass undefined and let MulleSez handle or assume finished.
        this.mulleTalkObject.loop()
      }
    }

    // Original: if mode = #end then go(the frame + 1)
    if (this.mode === 'end') {
      // Frame advancement handled by game engine
    }
  }

  /**
   * Pause/unpause the game
   * Original: on pause me, argYesNo
   * @param {boolean} argYesNo - True to pause, false to unpause
   */
  pause(argYesNo) {
    // Original: set pausing to argYesNo
    this.pausing = argYesNo

    // Original: programControl(boat, argYesNo)
    if (this.boat && typeof this.boat.programControl === 'function') {
      this.boat.programControl(argYesNo)
    }

    // Original: playSounds(boat, not argYesNo)
    if (this.boat && typeof this.boat.playSounds === 'function') {
      this.boat.playSounds(!argYesNo)
    }

    // Original: activateinterface(me, not argYesNo)
    this.activateinterface(!argYesNo)

    // Original: allowRadio(weatherRenderer, not argYesNo)
    if (this.weatherRenderer && typeof this.weatherRenderer.allowRadio === 'function') {
      this.weatherRenderer.allowRadio(!argYesNo)
    }
  }

  /**
   * Activate/deactivate interface elements
   * Original: on activateinterface me, argYesNo
   * @param {boolean} argYesNo - True to activate, false to deactivate
   */
  activateinterface(argYesNo) {
    // Original: sendSprite(getProp(spriteList, #HelpButton), #activate, argYesNo)
    // Original: sendSprite(getProp(spriteList, #ToolBox), #activate, argYesNo)
    // Original: sendSprite(getProp(spriteList, #MapOverview), #activate, argYesNo)
    // (Sprite message sending - handled by rendering layer)

    // Original: if objectp(the SelectorMaster of boat) then activate(...)
    if (this.boat && this.boat.SelectorMaster &&
      typeof this.boat.SelectorMaster.activate === 'function') {
      this.boat.SelectorMaster.activate(argYesNo)
    }
  }

  /**
   * Load world data
   * Original: on loadWorld me
   */
  loadWorld() {
    // Original: if not objectp(the world of gMulleGlobals) then
    //   set the world of gMulleGlobals to new(script "World")
    // World loading handled externally

    // Original: set map to new(script "Map")
    // Map object created
  }

  /**
   * Change to a new map
   * Original: on changeMap me, thePoint, theMode, theRealInit
   * @param {Object} thePoint - Point offset or absolute position
   * @param {string} theMode - 'Relational' or 'Absolute'
   * @param {boolean} theRealInit - Whether this is initial load
   * @returns {boolean} True if map change succeeded
   */
  changeMap(thePoint, theMode, theRealInit) {
    // Original: if voidp(theMode) then set theMode to #Relational
    if (!theMode) {
      theMode = 'Relational'
    }

    // Original: if voidp(thePoint) then set thePoint to point(0, 0)
    if (!thePoint) {
      thePoint = { x: 0, y: 0 }
    }

    // Original: set tmpMapID to getNewMapId(the world of gMulleGlobals, thePoint, theMode)
    let tmpMapID = null
    if (this.globals.world && typeof this.globals.world.getNewMapId === 'function') {
      tmpMapID = this.globals.world.getNewMapId(thePoint, theMode)
    }

    // Original: if integerp(tmpMapID) then
    if (tmpMapID !== null && tmpMapID !== undefined) {
      // Original: if theMode = #Relational then
      if (theMode === 'Relational') {
        // Original: set mapCoordinate to mapCoordinate + thePoint
        this.mapCoordinate = {
          x: this.mapCoordinate.x + thePoint.x,
          y: this.mapCoordinate.y + thePoint.y
        }
      } else {
        // Original: set mapCoordinate to thePoint
        this.mapCoordinate = { x: thePoint.x, y: thePoint.y }
      }

      // Original: set status to loadMap(the maps of gMulleGlobals, map, tmpMapID)
      // Map loading...

      // Original: changeMap(weatherRenderer, ...)
      if (this.weatherRenderer && typeof this.weatherRenderer.changeMap === 'function') {
        this.weatherRenderer.changeMap()
      }

      // Original: if voidp(theRealInit) then setTopology(boat, getTopology(map))
      if (!theRealInit && this.boat && typeof this.boat.setTopology === 'function') {
        if (this.map && typeof this.map.getTopology === 'function') {
          this.boat.setTopology(this.map.getTopology())
        }
      }

      // Original: return 1
      return true
    } else {
      // Original: return 0
      return false
    }
  }

  /**
   * Process all objects in current map
   * Original: on goThroughObjects me
   */
  goThroughObjects() {
    // Original: repeat with tmpObj in objects; kill(tmpObj); end repeat
    for (const obj of this.objects) {
      if (obj && typeof obj.kill === 'function') {
        obj.kill()
      }
    }

    // Original: set objects to []
    this.objects = []

    // Object creation and initialization happens here
    // Based on map's getObjects() data
  }

  /**
   * Prepare to leave current scene
   * Original: on prepareToLeave me, argToDir, argTransPic, argTransSnd
   * @param {string} argToDir - Destination director ('04', '06', etc.)
   * @param {string} argTransPic - Optional transition picture
   * @param {string} argTransSnd - Optional transition sound
   */
  prepareToLeave(argToDir, argTransPic, argTransSnd) {
    // Original: if isLeaving then exit
    if (this.isLeaving) {
      return
    }

    // Original: set isLeaving to 1
    this.isLeaving = true

    // Original: set the WhereFrom of gMulleGlobals to "05"
    if (this.globals) {
      this.globals.WhereFrom = '05'
    }

    // Original: set tmpSave to save(boat)
    // Original: setaProp(tmpSave, #map, mapCoordinate)
    // Boat state saving...

    // Original: set nextDir to argToDir
    this.nextDir = argToDir

    // Original: activate(ambience, 0)
    if (this.ambience && typeof this.ambience.activate === 'function') {
      this.ambience.activate(false)
    }

    // Original: useNormalSound()
    // Sound system switch...

    // Original: activateinterface(me, 0)
    this.activateinterface(false)

    // Original: if (argToDir = "04") or (argToDir = "03") then
    if (argToDir === '04' || argToDir === '03') {
      // Going home - clear driving info
      // Original: setDrivingInfo(the user of gMulleGlobals, 0)

      // Original: set transPic to argTransPic
      // Original: if voidp(transPic) then set transPic to "33b018v0"
      this.transPic = argTransPic || '33b018v0'
      this.transSnd = argTransSnd
    } else if (argToDir === '08') {
      // Going to specific destination
      this.transPic = 'TransTmp8'
    } else {
      // Other destinations
      // Original: set transPic to "33b007v0"
      // Original: set transSnd to "33e007v0"
      this.transPic = argTransPic || '33b007v0'
      this.transSnd = argTransSnd || '33e007v0'
    }

    // Original: go("Leave")
    // Frame transition handled by game engine
  }

  /**
   * Start movie callback
   * Original: on startMovie me
   */
  startMovie() {
    // Original: cursor(-1)
    // Hide cursor
  }
}
