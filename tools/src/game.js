/* global Phaser */
/**
 * MulleGame module
 * @module game
 */

import BootState from 'boot'
import LoadState from 'load'

import MulleNet from 'util/network'
import MulleCursor from 'util/cursor'

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
import ViolaBoatState from 'scenes/viola_boat'
import BirgitState from 'scenes/birgit'
import CaveState from 'scenes/cave'
import BoatJunkState from 'scenes/boat_junk'
import ErsonIntroState from 'scenes/erson_intro'
import HarborState from 'scenes/harbor'
import FishermanState from 'scenes/fisherman'
import WaterPumpState from 'scenes/waterpump'
import WhaleState from 'scenes/whale'

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

// import * as MulleScenes from 'scenes/*';

var memberLookup = {}
var directorImageLookup = {}

/**
 * Main game object
 * @extends Phaser.Game
 * @property {self} MulleGame
 */
class MulleGame extends Phaser.Game {
  constructor () {
    super({

      width: 640,
      height: 480,

      // width: '80%',
      // height: '80%',

      type: Phaser.AUTO,
      parent: 'player',
      antialias: false

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

    this.mulle.defaultLanguage = 'english'
    // this.mulle.defaultLanguage = 'swedish';
    /**
     * Helper class for director assets
     * @type {DirectorHelper}
     */
    this.director = new DirectorHelper(this)

    this.mulle.scenes = {

      // === AUTOS (Blauwwater) SCENES ===
      '02': 'junk',
      '03': 'garage',
      '04': 'yard',
      '05': 'world',
      '06': 'album',
      '08': 'diploma',

      10: 'menu',
      12: 'credits',
      18: 'worldselect',

      66: 'plugin',

      82: 'mudcar',
      83: 'treecar',
      84: 'roadthing',
      85: 'roaddog',

      86: 'solhem',
      87: 'saftfabrik',
      88: 'sturestortand',
      89: 'viola',
      90: 'dorisdigital',
      91: 'luddelabb',
      92: 'figgeferrum',
      93: 'ocean',
      94: 'carshow'

    }

    // === BOTEN (Scheepswerf/Zee) SCENE MAPPING ===
    // Note: These use 'boten/' prefix for assets
    this.mulle.botenScenes = {
      '01': 'zee_intro',       // Intro cutscene
      '02': 'boten_junk',      // Boat junkyard
      '03': 'boten_menu',      // Boat menu
      '04': 'boatyard',        // Scheepswerf (boat building)
      '05': 'zee_world',       // Sea world map
      '06': 'boten_album',     // Boat photo album
      '08': 'boten_diploma',   // Boat diploma
      '10': 'boten_menu',      // Menu
      '11': 'lighthouse',      // Vuurtoren?
      '12': 'dock',            // Aanlegsteiger
      '13': 'boten_scene13',   // TBD
      '14': 'boten_scene14',   // TBD
      '15': 'boten_scene15',   // TBD
      
      // Character/event scenes (70-88)
      '70': 'zee_event70',
      '71': 'zee_event71',
      '76': 'zee_event76',
      '77': 'birgitbeach',
      '78': 'preacher',
      '79': 'zee_event79',
      '80': 'lighthouse',
      '81': 'surfbeach',
      '83': 'zee_event83',
      '84': 'viola_boat',
      '85': 'zee_event85',
      '86': 'zee_event86',
      '87': 'diving',
      '88': 'zee_event88',
      
      // Showboat scene (boat exhibition)
      'SHOWBOAT': 'showboat'
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
      diploma: DiplomaState, // 08

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
      boatyard: BoatyardState, // Boat building workshop (boten_04.DXR)
      boat_junk: BoatJunkState, // Boat parts storage shed (boten_02.DXR)
      seaworld: SeaWorldState, // Sea navigation (sailing)
      showboat: ShowBoatState, // Boat show/exhibition
      lighthouse: LighthouseState, // Sam's lighthouse (boten_80.DXR)
      mia: MiaState, // Mia's Island (boten_83.DXR)
      surfbeach: SurferState, // Sur's surf beach (boten_81.DXR)
      preacher: PreacherState, // Dominee's church island (boten_78.DXR)
      diving: DivingState, // Underwater diving spot (boten_87.DXR)
      birgitbeach: BirgitState, // Birgit's beach with dogs (boten_77.DXR)
      viola_boat: ViolaBoatState, // Viola's house - boat version (boten_84.DXR)
      cave: CaveState, // Sven's cave with bat (boten_86.DXR)
      erson_intro: ErsonIntroState, // Erson tutorial intro (boten_70.DXR)
      harbor: HarborState, // Harbor tutorial with rope (boten_71.DXR)
      fisherman: FishermanState, // Fisherman on pier (boten_79.DXR)
      waterpump: WaterPumpState, // Water pump/fountain (boten_85.DXR)
      whale: WhaleState // Whale watching (boten_88.DXR)

    }

    this.mulle.audio = {}

    this.mulle.subtitle = new MulleSubtitle(this)

    this.mulle.actors = {}

    /**
     * Play audio by member name
     * @param  {string} id
     * @param {function} onStop
     * @return {Phaser.Sound} sound object
     */
    this.mulle.playAudio = function (id, onStop = null) {
      for (const a in this.game.mulle.audio) {
        var p = this.game.mulle.audio[a]

        for (var s in p.sounds) {
          if (p.sounds[s].extraData && id.toLowerCase() === p.sounds[s].extraData.dirName.toLowerCase()) {
            var snd = p.play(s)

            if (snd && onStop) { snd.onStop.addOnce(onStop) }

            return snd
          }
        }
      }

      console.error('sound not found', id, this.game.mulle.audio)

      return false
    }

    this.mulle.addAudio = function (key) {
      if (this.game.mulle.audio[key]) return

      this.game.mulle.audio[key] = new MulleAudio(this.game, key + '-audio')

      for (var id in this.game.mulle.audio[key].config.spritemap) {
        this.game.mulle.audio[key].sounds[id].extraData = this.game.mulle.audio[key].config.spritemap[id].data

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
      for (const a in this.game.mulle.audio) {
        var p = this.game.mulle.audio[a]

        for (var s in p.sounds) {
          if (p.sounds[s].extraData && id === p.sounds[s].extraData.dirName) {
            return p.stop(s)
          }
        }
      }

      console.error('sound not found', id)

      return false
    }

    this.mulle.cursor = new MulleCursor(this)

    this.mulle.PartsDB = {}
    this.mulle.getPart = function (id) {
      return this.PartsDB[id]
    }

    // === BOTEN (Boot Parts Database) ===
    this.mulle.BoatPartsDB = {}
    this.mulle.getBoatPart = function (id) {
      return this.BoatPartsDB[id]
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

    this.mulle.loadData = function () {
      // console.debug('LOADING DATA');

      this.game.mulle.UsersDB = {}

      var savedata = window.localStorage.getItem('mulle_SaveData')

      if (savedata) {
        var data = JSON.parse(savedata)

        // console.debug('Raw save data', data);

        for (var name in data) {
          this.game.mulle.UsersDB[name] = new MulleSave(this.game, data[name])

          console.debug('[userdata]', 'loaded', name, this.game.mulle.UsersDB[name])
        }

        console.debug('[userdata]', 'finish loading', this.game.mulle.UsersDB)
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

      var keys = this.game.cache.getKeys(Phaser.Cache.IMAGE)

      for (var k in keys) {
        var img = this.game.cache.getImage(keys[k], true)

        var frames = img.frameData.getFrames()

        for (var f in frames) {
          if (frames[f].dirFile === dir && (frames[f].dirNum === num || frames[f].dirName === num)) {
            var data = { frame: frames[f], key: img.key, name: frames[f].name }

            directorImageLookup[l] = data

            return data
          }
        }
      }

      console.error('get image fail', dir, num)

      return false
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
  }

  /**
   * Setup and launch game
   * @return {void}
   */
  setup () {
    for (var i in this.mulle.states) {
      this.state.add(i, this.mulle.states[i])
    }

    this.state.start('boot')
  }
}

export default MulleGame
