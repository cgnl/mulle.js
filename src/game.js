/* global Phaser */
/**
 * MulleGame module
 * @module game
 */

import BootState from 'boot'
import LoadState from 'load'

import MulleNet from 'util/network'
import MulleCursor from 'util/cursor'
import { resolveDirectorImageCandidate } from 'util/directorImageResolver'

import MenuState from 'scenes/menu'
import FileBrowserState from 'scenes/filebrowser'
import DLCShopState from 'scenes/dlcshop'

import GarageState from 'scenes/garage'
import JunkState from 'scenes/junk'
import YardState from 'scenes/yard'
import AlbumState from 'scenes/album'
import DiplomaState from 'scenes/diploma'

import WorldState from 'scenes/world'

import FiggeFerrumState from 'scenes/figgeferrum'
import RoadDogState from 'scenes/roaddog'
import RoadThingState from 'scenes/roadthing'
import CarShowState from 'scenes/carshow'
import StureStortandState from 'scenes/sturestortand'
import SaftfabrikState from 'scenes/saftfabrik'
import SolhemState from 'scenes/solhem'
import DorisDigitalState from 'scenes/dorisdigital'
import ViolaState from 'scenes/viola'
import TreeCarState from 'scenes/treecar'
import LuddeLabState from 'scenes/luddelabb'
import OceanState from 'scenes/ocean'
import CreditsState from 'scenes/credits'
import WorldSelectState from 'scenes/worldselect'
import BoatyardState from 'scenes/boatyard'
import SeaWorldState from 'scenes/seaworld'
import ShowBoatState from 'scenes/showboat'
import LighthouseState from 'scenes/lighthouse'
import MiaState from 'scenes/mia'
import SurferState from 'scenes/surfer'
import PreacherState from 'scenes/preacher'
import DivingState from 'scenes/diving'
import GeorgeState from 'scenes/george' // BUG #1.2 fix - george.js is correct boat_84 implementation
import BirgitState from 'scenes/birgit'
import CaveState from 'scenes/cave'
import BoatJunkState from 'scenes/boat_junk'
import BoatYardState from 'scenes/boat_yard'
import ZeeIntroState from 'scenes/zee_intro'
import ErsonState from 'scenes/erson'
import FishermanState from 'scenes/fisherman'
import WaterPumpState from 'scenes/waterpump'
import WhaleState from 'scenes/whale'
import VickyIslandState from 'scenes/vicky_island'
import AlgaeIslandState from 'scenes/algae_island'
import HavenState from 'scenes/haven'

import HelpState from 'scenes/help'
import BlueprintState from 'scenes/blueprint'
import BoatFileBrowserState from 'scenes/boat_filebrowser'

// var requireScenes = require.context('scenes', true, /\.js$/);
// requireScenes.keys().forEach(requireScenes);

import MulleSubtitle from 'objects/subtitle'

import MulleAudio from 'objects/audio'

import MulleSave from 'struct/savedata'
import MulleSeaInventory from 'struct/inventory'
import MulleSeaMedals from 'struct/medals'
// import PluginState from './scenes/plugin'
// import TreeCarState from './scenes/treecar'
import MudCarState from './scenes/mudcar'
import DirectorHelper from './objects/DirectorHelper'
import VirtualMouseHandler from 'objects/input/VirtualMouseHandler'

// BUG FIX #1: Missing LoopMaster System
import MulleLoopMaster from 'objects/loopmaster'

// BUG FIX #3: Missing global state initialization
// BUG FIX #6: No global state persistence
import MulleGlobals from 'struct/mulleglobals'

// BUG FIX #5: Missing prepareToLeave scene transition system
import SceneTransition from 'util/scenetransition'

// BUG FIX #3.2 (BUGS_ROUND4.md): Missing MusicPlayer initialization
import MusicPlayer from 'objects/musicplayer'

// BUG FIX #4: Weather system
import MulleWeather from 'objects/weather'

// Debug observer for tracking game events
import GameObserver from 'objects/GameObserver'

// import * as MulleScenes from 'scenes/*';

var memberLookup = {}
var directorImageLookup = {}

/**
 * Main game object
 * @extends Phaser.Game
 * @property {self} MulleGame
 */
class MulleGame extends Phaser.Game {
  constructor() {
    super({

      width: 640,
      height: 480,

      // width: '80%',
      // height: '80%',

      type: Phaser.AUTO,
      parent: 'player',
      antialias: false,

      // BUG FIX #2: Frame Rate Mismatch - No 60 FPS Enforcement
      // Original Director enforces 60 FPS tempo. JavaScript needs explicit FPS limit.
      // This fixes timing issues where loop counters designed for 60 FPS
      // (e.g., random(360) = 6 seconds @ 60fps) were firing at wrong rates.
      fps: {
        target: 60,
        forceSetTimeOut: false
      }

    })

    /**
     * Utility library
     * @property {MulleGame} game      Main game
     * @property {Object}    scenes    Scene lookups
     * @property {Object}    audio     Audio collections
     * @property {Object}    actors    Available actors
     * @property {function}  playAudio
     */
    this.mulle = {}

    this.mulle.game = this

    this.mulle.debug = false
    this.mulle.cheats = true

    this.mulle.networkEnabled = false

    this.mulle.networkServer = 'wss://miel.dtun.nl/ws'
    this.mulle.networkDevServer = 'ws://localhost:8765'

    this.mulle.defaultLanguage = 'dutch'
    // this.mulle.defaultLanguage = 'english';
    // this.mulle.defaultLanguage = 'swedish';
    // Director DATA.CST text cache (filled in load.js)
    this.mulle.directorTextData = { auto: {}, boats: {} }
    /**
     * Helper class for director assets
     * @type {DirectorHelper}
     */
    this.director = new DirectorHelper(this)

    this.mulle.carScenes = {
      // === AUTOS (Blauwwater) SCENES ===
      '02': 'junk',
      '03': 'garage',
      '04': 'yard',
      '05': 'world',
      '06': 'album',
      '08': 'diploma',
      '10': 'menu',
      '12': 'credits',
      '18': 'worldselect',
      '66': 'plugin',
      '82': 'mudcar',
      '83': 'treecar',
      '84': 'roadthing',
      '85': 'roaddog',
      '86': 'solhem',
      '87': 'saftfabrik',
      '88': 'sturestortand',
      '89': 'viola',
      '90': 'dorisdigital',
      '91': 'luddelabb',
      '92': 'figgeferrum',
      '93': 'ocean',
      '94': 'carshow'
    }

    this.mulle.boatScenes = {
      // === BOATEN (Recht Door Zee) SCENES ===
      '01': 'zee_intro',
      '04': 'boatyard',
      '05': 'seaworld',
      '06': 'boat_junk',
      '08': 'help',
      '11': 'menu',
      '12': 'album',
      '70': 'erson',
      '71': 'haven',
      '76': 'showboat',
      '77': 'birgitbeach',
      '78': 'preacher',
      '79': 'fisherman',
      '80': 'lighthouse',
      '81': 'surfbeach',
      '83': 'mia',
      '84': 'george',
      '85': 'waterpump',
      '86': 'cave',
      '87': 'diving',
      '88': 'whale'
    }

    // Legacy combined map (use resolveSceneFromDirResource for transitions).
    this.mulle.scenes = { ...this.mulle.carScenes, ...this.mulle.boatScenes }

    this.mulle.resolveSceneFromDirResource = (dirResource, currentState = this.state.current) => {
      const key = String(dirResource)

      if (currentState === 'seaworld') {
        return this.mulle.boatScenes[key] || this.mulle.carScenes[key]
      }

      if (currentState === 'world') {
        return this.mulle.carScenes[key] || this.mulle.boatScenes[key]
      }

      return this.mulle.scenes[key] || this.mulle.carScenes[key] || this.mulle.boatScenes[key]
    }

    // === BOTEN (Scheepswerf/Zee) SCENE MAPPING ===
    // Note: These use 'boten/' prefix for assets
    this.mulle.botenScenes = {
      '01': 'zee_intro',       // Intro cutscene
      '02': 'boten_junk',      // Boat junkyard
      '03': 'boat_yard',       // Boat yard / junkyard (boten_03.DXR)
      '04': 'boatyard',        // Scheepswerf (boat building)
      '05': 'zee_world',       // Sea world map
      '06': 'boten_album',     // Boat photo album
      '08': 'boten_diploma',   // Boat diploma
      '10': 'boten_menu',      // Menu
      '11': 'menu',            // Login/user selection (shared menu)
      '12': 'dock',            // Aanlegsteiger
      '13': 'boten_scene13',   // TBD
      '14': 'boat_filebrowser', // Boat save/load dialog (boten_14.DXR)
      '15': 'blueprint',       // Hull/rudder selection (boten_15.DXR)

      // Character/event scenes (70-88)
      '70': 'erson',          // Erson smuggler encounter (mission 15)
      '71': 'haven',          // Peggy at quay (mission 14)
      '76': 'zee_event76',
      '77': 'birgitbeach',
      '78': 'preacher',
      '79': 'zee_event79',
      '80': 'lighthouse',
      '81': 'surfbeach',
      '83': 'zee_event83',
      '84': 'george',  // BUG #1.2 fix - george.js is correct
      '85': 'zee_event85',
      '86': 'zee_event86',
      '87': 'diving',
      '88': 'zee_event88',

      // Showboat scene (boat exhibition)
      'SHOWBOAT': 'showboat'
    }

    // Precompute boat scene name set for fast mode detection
    this.mulle.boatSceneNames = new Set([
      ...Object.values(this.mulle.boatScenes),
      ...Object.values(this.mulle.botenScenes)
    ])

    this.mulle.isBoatScene = (sceneName = null) => {
      const name = sceneName || (this.state ? this.state.current : null)
      if (!name || !this.mulle.boatSceneNames) return false
      return this.mulle.boatSceneNames.has(name)
    }

    this.mulle.states = {

      boot: BootState,
      load: LoadState,

      menu: MenuState, // 10
      filebrowser: FileBrowserState, // File browser
      dlcshop: DLCShopState, // DLC shop
      credits: CreditsState, // 12
      worldselect: WorldSelectState, // 18

      junk: JunkState, // 02
      garage: GarageState, // 03
      yard: YardState, // 04
      world: WorldState, // 05
      album: AlbumState, // 06
      diploma: DiplomaState, // 08 (car version)
      help: HelpState, // boten_08.DXR (boat version - help/diploma)

      //plugin: PluginState, // 66

      mudcar: MudCarState, // 82
      treecar: TreeCarState, // 83
      roadthing: RoadThingState, // 84
      roaddog: RoadDogState, // 85
      solhem: SolhemState, // 86
      saftfabrik: SaftfabrikState, // 87
      sturestortand: StureStortandState, // 88
      dorisdigital: DorisDigitalState, // 90
      luddelabb: LuddeLabState, // 91
      figgeferrum: FiggeFerrumState, // 92
      ocean: OceanState, // 93
      viola: ViolaState, // 89

      carshow: CarShowState, // 94

      // === BOTEN (Zee) SCENES ===
      zee_intro: ZeeIntroState, // Main intro movie (Miel arrives at shipyard)
      boatyard: BoatyardState, // Boat building workshop (boten_04.DXR)
      boat_junk: BoatJunkState, // Boat parts storage shed (boten_02.DXR)
      boat_yard: BoatYardState, // Boat yard / junkyard overview (boten_03.DXR)

      seaworld: SeaWorldState, // Sea navigation (sailing)
      showboat: ShowBoatState, // Boat show/exhibition
      lighthouse: LighthouseState, // Sam's lighthouse (boten_80.DXR)
      mia: MiaState, // Mia's Island (boten_83.DXR)
      surfbeach: SurferState, // Sur's surf beach (boten_81.DXR)
      preacher: PreacherState, // Dominee's church island (boten_78.DXR)
      diving: DivingState, // Underwater diving spot (boten_87.DXR)
      birgitbeach: BirgitState, // Birgit's beach with dogs (boten_77.DXR)
      george: GeorgeState, // George's farm - boat version (boten_84.DXR) - BUG #1.2 fix
      cave: CaveState, // Sven's cave with bat (boten_86.DXR)
      erson: ErsonState, // Erson smuggler encounter on Smokkeleiland (boten_70.DXR) - Mission 15
      fisherman: FishermanState, // Fisherman on pier (boten_79.DXR)
      waterpump: WaterPumpState, // Water pump/fountain (boten_85.DXR)
      whale: WhaleState, // Whale watching (boten_88.DXR)
      vickyisland: VickyIslandState, // DLC island scene
      algaeisland: AlgaeIslandState, // DLC island scene
      haven: HavenState, // Peggy PC part giving at quay (boten_71.DXR)
      blueprint: BlueprintState, // Hull/rudder selection (boten_15.DXR)
      boat_filebrowser: BoatFileBrowserState // Boat save/load dialog (boten_14.DXR)

    }

    this.mulle.audio = {}

    this.mulle.subtitle = new MulleSubtitle(this)

    this.mulle.actors = {}

    /**
     * Play audio by member name
     * @param  {string} id
     * @param {function} onStop
     * @return {Phaser.Sound} sound object
     * 
     * BUG FIX #12: Missing sound priority/channel system
     * TODO: Implement Director sound channels (#BG, #EFFECT, #OPEFFECT, #TRANS)
     * - #BG: Background music channel
     * - #EFFECT: Sound effects channel
     * - #OPEFFECT: Operation effects channel
     * - #TRANS: Transition sounds channel
     * 
     * BUG FIX #13: Director volume scale conversion
     * Note: When setting volume, convert Director scale (0-255) to Web Audio (0-1)
     * Use: volume = directorVolume / 255
     */
    this.mulle.playAudio = function (id, onStop = null, loop = undefined) {
      // Backward compatibility:
      // - playAudio(id, fn)
      // - playAudio(id, true|false)
      // - playAudio(id, fn, true|false)
      var onStopFn = null
      var loopFlag = undefined

      if (typeof onStop === 'function') {
        onStopFn = onStop
      } else if (typeof onStop === 'boolean') {
        loopFlag = onStop
      }

      if (typeof loop === 'boolean') {
        loopFlag = loop
      }

      const normalize = (val) => String(val || '').trim().toLowerCase()
      const findKeyInsensitive = (sounds, normKey) => {
        if (!normKey) return null
        for (const k in sounds) {
          if (normalize(k) === normKey) return k
        }
        return null
      }

      // Support both 'dirName' and 'dirFile/dirName' formats
      var searchId = id
      if (searchId.includes('/')) {
        searchId = searchId.split('/').pop()
      }
      const searchNorm = normalize(searchId)
      const searchNorm00 = normalize(searchId + '_00')

      for (const a in this.game.mulle.audio) {
        var p = this.game.mulle.audio[a]

        for (var s in p.sounds) {
          const extra = p.sounds[s].extraData
          if (extra) {
            const dirNameNorm = normalize(extra.dirName)
            if (dirNameNorm === searchNorm || dirNameNorm === searchNorm00) {
              var snd = p.play(s)

              if (snd && typeof loopFlag === 'boolean') {
                snd.loop = loopFlag
              }

              if (snd && onStopFn) { snd.onStop.addOnce(onStopFn) }

              return snd
            }
          }
        }

        // Fallback: direct key match (segmented audio like 05e024v1_00)
        let key = null
        if (p.sounds[searchId]) {
          key = searchId
        } else if (p.sounds[searchId + '_00']) {
          key = searchId + '_00'
        } else {
          // Case-insensitive fallback (handles RollOver / 05e050V0 and similar)
          key = findKeyInsensitive(p.sounds, searchNorm) || findKeyInsensitive(p.sounds, searchNorm00)
        }
        if (key) {
          var snd = p.play(key)

          if (snd && typeof loopFlag === 'boolean') {
            snd.loop = loopFlag
          }

          if (snd && onStopFn) { snd.onStop.addOnce(onStopFn) }

          return snd
        }
      }

      console.debug('sound not found', id)

      return false
    }

    this.mulle.addAudio = function (key) {
      if (this.game.mulle.audio[key]) return

      this.game.mulle.audio[key] = new MulleAudio(this.game, key + '-audio')

      for (var id in this.game.mulle.audio[key].config.spritemap) {
        this.game.mulle.audio[key].sounds[id].extraData = this.game.mulle.audio[key].config.spritemap[id].data
        if (this.game.mulle.audio[key].sounds[id].extraData && this.game.mulle.audio[key].sounds[id].extraData.dirName) {
          this.game.mulle.audio[key].sounds[id].extraData.dirName =
            String(this.game.mulle.audio[key].sounds[id].extraData.dirName).trim()
        }

        /*
        var cues = this.game.mulle.audio[key].config.spritemap[id].cue

        if (cues) {

          this.game.mulle.audio[key].sounds[id].cuePoints = []

          for (var i = 0; i < cues.length; i++) {

            this.game.mulle.audio[key].sounds[id].cuePoints.push( cues[i] ) // addMarker( i + '_' + cues[i][1], cues[i][0] / 1000, 0.1 )

          }

        }
        */
      }

      console.debug('[audio]', 'add', this.game.mulle.audio[key])
    }

    this.mulle.stopAudio = function (id) {
      const normalize = (val) => String(val || '').trim().toLowerCase()
      const searchId = normalize(id)
      for (const a in this.game.mulle.audio) {
        var p = this.game.mulle.audio[a]

        for (var s in p.sounds) {
          if (p.sounds[s].extraData && normalize(p.sounds[s].extraData.dirName) === searchId) {
            return p.stop(s)
          }
        }
      }

      console.debug('sound not found', id)

      return false
    }

    this.mulle.cursor = new MulleCursor(this)

    // BUG FIX #1: Missing LoopMaster System - Centralized Game Loop
    // Original Director uses LoopMaster running at 60 FPS to manage all loopable objects
    // with guaranteed execution order and cleanup queue
    this.mulle.loopMaster = new MulleLoopMaster(this)

    // BUG FIX #3.1 (BUGS_ROUND4.md): Sound channel system (matching original Lingo DSound.ls)
    // Original Director uses dedicated sound channels with priority and limits
    // Channels: #BG (background music), #EFFECT (sound effects), #OPEFFECT (operation effects), #TRANS (transitions)
    this.mulle.soundChannels = {
      BG: [],         // Background music/ambience
      EFFECT: [],     // Sound effects
      OPEFFECT: [],   // Operation effects
      TRANS: []       // Transitions
    }

    this.mulle.maxSoundsPerChannel = {
      BG: 2,
      EFFECT: 4,
      OPEFFECT: 4,
      TRANS: 2
    }

    // Play audio with channel priority
    this.mulle.playAudioChannel = function (id, channel = 'EFFECT', onStop = null) {
      if (channel === 'TRANS') channel = 'BG'

      const channelArray = this.soundChannels[channel]
      const maxSounds = this.maxSoundsPerChannel[channel]

      // Clean up finished sounds
      for (let i = channelArray.length - 1; i >= 0; i--) {
        if (!channelArray[i].isPlaying) {
          channelArray.splice(i, 1)
        }
      }

      // If channel full, stop oldest sound
      if (channelArray.length >= maxSounds) {
        const oldestSound = channelArray.shift()
        oldestSound.stop()
      }

      const sound = this.playAudio(id, onStop)
      if (sound) channelArray.push(sound)
      return sound
    }

    // BUG FIX #3.2 (BUGS_ROUND4.md): MusicPlayer initialization
    // Original Director instantiates MusicPlayer for background music management
    this.mulle.musicPlayer = new MusicPlayer(this)

    // BUG FIX #4: Weather will be initialized later (needs game.cache to be ready)
    // Set to null for now, RadioHandler will check for it
    this.mulle.weather = null

    // BUG FIX #3: Missing global state initialization order
    // BUG FIX #6: No global state persistence
    // Original: global gMulleGlobals; set gMulleGlobals to [:]
    this.mulle.gMulleGlobals = new MulleGlobals(this)

    // Hook mouse input into Lingo-style MouseMaster (MouseHandler)
    if (this.mulle.gMulleGlobals && this.mulle.gMulleGlobals.mouseMaster) {
      this.mulle.virtualMouseHandler = new VirtualMouseHandler(this.mulle.gMulleGlobals)

      // Track current mouse position
      this.input.addMoveCallback((pointer, x, y) => {
        this.mulle.virtualMouseHandler.setMousePosition(x, y)
      })

      // Forward mouse down/up to MouseMaster
      this.input.onDown.add((pointer) => {
        this.mulle.virtualMouseHandler.setMousePosition(pointer.x, pointer.y)
        this.mulle.virtualMouseHandler.virtualMouseDown(pointer.x, pointer.y)
      })

      this.input.onUp.add((pointer) => {
        this.mulle.virtualMouseHandler.setMousePosition(pointer.x, pointer.y)
        this.mulle.virtualMouseHandler.virtualMouseUp(pointer.x, pointer.y)
      })
    }

    // BUG FIX #5: Missing prepareToLeave scene transition system
    this.mulle.sceneTransition = new SceneTransition(this)

    this.mulle.PartsDB = {}
    this.mulle.getPart = function (id) {
      return this.PartsDB[id]
    }

    // === BOTEN (Boot Parts Database) ===
    // BUG FIX #2 (ADDITIONAL_BUGS_ROUND2.md): Missing BoatPartsDB class
    // Raw data will be populated in load.js, then wrapped in BoatPartsDB class
    this.mulle.BoatPartsDB = null  // Will be initialized in load.js
    this.mulle.getBoatPart = function (id) {
      // Support both old hash access and new class method
      if (this.BoatPartsDB && this.BoatPartsDB.getPart) {
        return this.BoatPartsDB.getPart(id)
      }
      // Fallback for backward compatibility
      return this.BoatPartsDB ? this.BoatPartsDB[id] : null
    }

    // === SEA INVENTORY & MEDAL MANAGERS ===
    // Gebaseerd op originele Lingo user data structuur
    // Inventory items: Bible, Swimring, DoctorBag, Compass, Diary, RottenFish
    // Medals: 6 medailles uit boten_08.DXR/Internal/81-86.txt
    this.mulle.seaInventory = new MulleSeaInventory(this)
    this.mulle.seaMedals = new MulleSeaMedals(this)

    this.mulle.UsersDB = []
    this.mulle.saveData = function () {
      console.debug('SAVING DATA')
      window.localStorage.setItem('mulle_SaveData', JSON.stringify(this.game.mulle.UsersDB))
    }

    this.mulle.setData = function (key, value) {
      this.game.mulle.UsersDB[this.game.mulle.activeProfile][key] = value
    }

    /**
     * Load user data from localStorage
     * BUG FIX #9: Add error handling and corrupt data recovery
     */
    this.mulle.loadData = function () {
      // console.debug('LOADING DATA');

      this.game.mulle.UsersDB = {}

      var savedata = window.localStorage.getItem('mulle_SaveData')

      if (savedata) {
        try {
          // BUG FIX #9: Wrap JSON.parse in try-catch
          var data = JSON.parse(savedata)

          // console.debug('Raw save data', data);

          for (var name in data) {
            try {
              this.game.mulle.UsersDB[name] = new MulleSave(this.game, data[name])
              console.debug('[userdata]', 'loaded', name, this.game.mulle.UsersDB[name])
            } catch (err) {
              console.error('[userdata] Failed to load user', name, err)
              // Continue loading other users
            }
          }

          console.debug('[userdata]', 'finish loading', this.game.mulle.UsersDB)
        } catch (err) {
          console.error('[userdata] Failed to parse save data:', err)

          // BUG FIX #9: Backup corrupt data and start fresh
          const backupKey = 'mulle_SaveData_corrupt_' + Date.now()
          try {
            window.localStorage.setItem(backupKey, savedata)
            console.warn('[userdata] Corrupt data backed up to:', backupKey)
          } catch (backupErr) {
            console.error('[userdata] Failed to backup corrupt data:', backupErr)
          }

          // Alert user about corruption
          if (typeof alert !== 'undefined') {
            alert('Save data was corrupted and has been reset. A backup was created.')
          }

          // Start fresh with empty database
          this.game.mulle.UsersDB = {}
        }
      } else {
        console.warn('[userdata]', 'empty')
      }
    }

    this.mulle.findFrame = function (collection, name) {
      for (var i in collection) {
        var a = collection[i]
        if (a.frameData.checkFrameName(name)) return a.key
      }

      return false
    }

    this.mulle.frameLookup = {}

    this.mulle.findFrameById = function (id, returnFrame = false) {
      var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE)

      for (var k in keys) {
        var img = this.game.cache.getImage(keys[k], true)

        var frames = img.frameData.getFrames()

        for (var f in frames) {
          if (frames[f].id && id === frames[f].id) {
            // this.game.mulle.frameLookup[ id ] = [img.key, frames[f].name];

            return returnFrame ? { frame: frames[f], key: img.key, name: frames[f].name } : [img.key, frames[f].name]
          }
        }
      }

      return false
    }

    /**
     *
     * @param name
     * @returns {*|Phaser.Frame}
     * @deprecated Use getImageByCastNumber or getNamedImage
     */
    this.mulle.findDirectorMember = function (name) {
      if (memberLookup[name]) {
        return memberLookup[name]
      }

      var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE)

      for (var k in keys) {
        var img = this.game.cache.getImage(keys[k], true)

        var frames = img.frameData.getFrames()

        for (var f in frames) {
          if (frames[f].dirName === name) {
            memberLookup[name] = frames[f]

            return frames[f]
          }
        }
      }

      console.error('get member fail', name)
    }

    /**
     *
     * @param dir
     * @param num
     * @returns {{name: *, key: *, frame: *}|boolean|*}
     * @deprecated Use getImageByCastNumber or getNamedImage
     */
    this.mulle.getDirectorImage = function (dir, num) {
      if (!dir || !num) {
        // console.error('invalid parameters', dir, num);
        return false
      }

      var l = dir + '_' + num

      if (directorImageLookup[l]) return directorImageLookup[l]

      // Also check with boten_ prefix for boat asset lookups
      var lAlt = dir.startsWith('boten_') ? dir.substring(6) + '_' + num : 'boten_' + dir + '_' + num
      if (directorImageLookup[lAlt]) return directorImageLookup[lAlt]

      var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE)
      var searchedKeys = []
      var foundDirFiles = []
      var candidates = []

      for (var k in keys) {
        var img = this.game.cache.getImage(keys[k], true)
        searchedKeys.push(keys[k])

        // Skip if no frameData (not an atlas)
        if (!img || !img.frameData) {
          continue
        }

        var frames = img.frameData.getFrames()

        for (var f in frames) {
          // Track what dirFiles we actually find
          if (frames[f].dirFile && foundDirFiles.indexOf(frames[f].dirFile) === -1) {
            foundDirFiles.push(frames[f].dirFile)
          }

          // Match dirFile exactly, or with 'boten_' prefix for boat game assets
          // Atlas stores dirFile as 'boten_04.DXR' but scenes may pass '04.DXR'
          const dirFileMatch = frames[f].dirFile === dir ||
            (frames[f].dirFile === 'boten_' + dir) ||
            (dir.startsWith('boten_') && frames[f].dirFile === dir.substring(6))
          if (dirFileMatch) {
            candidates.push({ frame: frames[f], key: img.key, name: frames[f].name })
          }
        }
      }

      const resolved = resolveDirectorImageCandidate({
        dir,
        member: num,
        candidates,
        directorMemberMap: this.directorMemberMap
      })

      if (resolved) {
        directorImageLookup[l] = resolved
        directorImageLookup[lAlt] = resolved
        return resolved
      }

      console.error('get image fail', dir, num)
      console.error('  Searched keys:', searchedKeys.join(', '))
      console.error('  Found dirFiles:', foundDirFiles.join(', '))

      return false
    }

    // === Director DATA.CST text members (Lingo parity) ===
    // Exposes getMemberText / setMemberText / saveCastLib like Director.
    this.getMemberText = function (memberName) {
      if (!memberName) return null
      const data = this.mulle && this.mulle.directorTextData ? this.mulle.directorTextData : { auto: {}, boats: {} }
      const auto = data.auto || {}
      const boats = data.boats || {}
      const name = String(memberName)
      const isBoat = this.mulle && this.mulle.isBoatScene ? this.mulle.isBoatScene() : false

      if (isBoat && boats[name] !== undefined) return boats[name]
      if (!isBoat && auto[name] !== undefined) return auto[name]
      if (boats[name] !== undefined) return boats[name]
      if (auto[name] !== undefined) return auto[name]
      return null
    }

    this.setMemberText = function (memberName, text) {
      if (!memberName) return false
      const data = this.mulle && this.mulle.directorTextData ? this.mulle.directorTextData : { auto: {}, boats: {} }
      const name = String(memberName)
      const isBoat = this.mulle && this.mulle.isBoatScene ? this.mulle.isBoatScene() : false

      if (data.boats && data.boats[name] !== undefined && isBoat) {
        data.boats[name] = String(text)
        return true
      }

      if (data.auto && data.auto[name] !== undefined && !isBoat) {
        data.auto[name] = String(text)
        return true
      }

      // Fallback: update whichever dataset already has the member, or default to auto
      if (data.boats && data.boats[name] !== undefined) {
        data.boats[name] = String(text)
        return true
      }
      if (data.auto && data.auto[name] !== undefined) {
        data.auto[name] = String(text)
        return true
      }

      if (isBoat) {
        data.boats[name] = String(text)
      } else {
        data.auto[name] = String(text)
      }
      return true
    }

    this.saveCastLib = function (libName) {
      // No-op in web version; kept for parity with Director.
      console.debug('[DirectorText] saveCastLib', libName || '')
      return true
    }

    this.mulle.getFrameRegPoint = function (id) {
      var f = this.game.mulle.findFrameById(id, true)

      if (f) {
        return f.regpoint
      } else {
        return false
      }
    }

    this.mulle.net = new MulleNet(this)

    // Debug observer for tracking clicks, sounds, animations
    this.observer = new GameObserver(this)

    // Phase 1: Input locking system
    this.mulle.inputLocked = false

    /**
     * Lock or unlock all game input
     * @param {boolean} locked - true to lock, false to unlock
     */
    this.mulle.setInputLocked = function (locked) {
      this.inputLocked = locked
      this.game.input.enabled = !locked
      console.debug('[input]', locked ? 'locked' : 'unlocked')
    }

    /**
     * Track if boat assets are loaded
     * Boat assets are lazy-loaded to prevent sprite name conflicts with car game
     */
    this.mulle.boatAssetsLoaded = false

    /**
     * Load boat game assets (lazy loading)
     * Call this in preload() of boat scenes before using boat sprites
     * @param {Phaser.Loader} loader - The scene's loader
     */
    this.mulle.loadBoatAssets = function (loader) {
      if (this.boatAssetsLoaded) {
        console.debug('[BoatAssets] Already loaded, skipping')
        return
      }

      console.log('[BoatAssets] Loading boat game assets...')

      loader.pack('boten_shared', 'assets/boten_shared.json', null, this)
      loader.pack('boatyard', 'assets/boatyard.json', null, this)
      loader.pack('boat_yard', 'assets/boat_yard.json', null, this)
      loader.pack('boatbuild', 'assets/boatbuild.json', null, this)
      loader.pack('boatparts', 'assets/boatparts.json', null, this)
      loader.pack('boatsail', 'assets/boatsail.json', null, this)
      loader.pack('boat_bls', 'assets/boat_bls.json', null, this)
      loader.pack('boat_bms', 'assets/boat_bms.json', null, this)
      loader.pack('boat_bss', 'assets/boat_bss.json', null, this)
      loader.pack('seaworld', 'assets/seaworld.json', null, this)
      loader.pack('showboat', 'assets/showboat.json', null, this)
      loader.pack('blueprint', 'assets/blueprint.json', null, this)
      loader.pack('boatdiploma', 'assets/boatdiploma.json', null, this)

      // NOTE: zee_intro pack is NOT loaded here because its sprite atlases use
      // short numeric frame names (1,2,3...) that collide with car/yard atlases.
      // The zee_intro AUDIO is loaded separately below via individual asset loading.
      loader.audio('zee_intro-audio', 'assets/zee_intro-audio.ogg')
      loader.json('zee_intro-audio-audioatlas', 'assets/zee_intro-audio.json')

      this.boatAssetsLoaded = true
    }

    /**
     * Register boat audio after assets are loaded
     * Call this in create() of boat scenes
     */
    this.mulle.registerBoatAudio = function () {
      if (!this.boatAssetsLoaded) {
        console.warn('[BoatAssets] Cannot register audio - assets not loaded')
        return
      }

      // Only register once
      if (this.boatAudioRegistered) return

      // Only register audio that actually exists
      const boatAudioKeys = [
        'boten_shared',
        'boatyard',
        'boatbuild',
        'boatparts',
        'seaworld',
        'showboat',
        'blueprint',
        'zee_intro'
      ]

      boatAudioKeys.forEach(key => {
        // Check if the audio atlas exists in cache before adding
        const audioKey = key + '-audio-audioatlas'
        if (this.game.cache.checkJSONKey(audioKey)) {
          this.addAudio(key)
        } else {
          console.debug('[BoatAssets] Skipping missing audio:', key)
        }
      })

      this.boatAudioRegistered = true
      console.log('[BoatAssets] Boat audio registered')
    }
  }

  /**
   * Setup and launch game
   * @return {void}
   */
  setup() {
    for (var i in this.mulle.states) {
      this.state.add(i, this.mulle.states[i])
    }

    this.state.start('boot')
  }
}

export default MulleGame
