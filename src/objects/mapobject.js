/**
 * MulleMapObject object
 * @module objects/mapobject
 */
'use strict'

import MulleSprite from 'objects/sprite'
import ObjectAnimation from './mapobjects/animation'

var toLoad = [
  'Cows',
  'Ferry',
  'Gas',
  'Racing',
  'BoatRacing',  // Fase 16: Sea boat racing for Medal 2 (Snelheids-medaille)
  'Goats',
  'WBridge',
  'CBridge',
  'FarAway',
  'Picture',
  'Hill',
  'NoMotor',
  'Stop',
  'Sound',
  'Stream',
  'Teleport',
  'Pickup'  // Fase 15: Sea pickup objects (Bible, Swimring, DoctorBag)
]

var MapObjects = {}

toLoad.forEach((l) => {
  MapObjects[l] = require('objects/mapobjects/' + l).default
})

/**
 * Overworld object
 * @extends MulleSprite
 */
class MulleMapObject extends MulleSprite {
  constructor(game, id, pos, opt) {
    super(game)

    this.id = id

    this.position.set(pos.x, pos.y)

    this.opt = opt
    this.optionalData = opt

    this.enteredInner = false
    this.enteredOuter = false

    this.enabled = true

    // this.loadTexture('test');

    // this.FrameList = [];

    this.def = this.game.mulle.ObjectsDB[this.id] ||
      (this.game.mulle.BoatObjectsDB ? this.game.mulle.BoatObjectsDB[this.id] : null)

    // Fix #54: Guard against missing ObjectsDB entries (sea-specific object types
    // like NoMotor, Bridge, RiverEnter, Reef, Maelstrom, Stream are not in ObjectsDB)
    if (!this.def) {
      console.warn('[MapObject] Object ID', this.id, 'not found in ObjectsDB, skipping')
      this.enabled = false
      this.OuterRadius = 0
      this.InnerRadius = 0
      this.EnterInnerRadius = 0
      this.ExitOuterRadius = 0
      return
    }

    this.OuterRadius = this.opt && this.opt.OuterRadius ? this.opt.OuterRadius : this.def.OuterRadius
    this.InnerRadius = this.opt && this.opt.InnerRadius ? this.opt.InnerRadius : this.def.InnerRadius

    // BUG FIX #5.7: Add EnterInnerRadius and ExitOuterRadius properties
    // These allow different radii for entering vs exiting detection zones
    this.EnterInnerRadius = this.opt && this.opt.EnterInnerRadius ? this.opt.EnterInnerRadius : this.InnerRadius
    this.ExitOuterRadius = this.opt && this.opt.ExitOuterRadius ? this.opt.ExitOuterRadius : this.OuterRadius

    this.CustomObject = this.def.CustomObject

    // this.DirResource = this.def.DirResource;

    this.Sounds = this.def.Sounds

    this.FrameList = this.def.FrameList

    this.SetWhenDone = this.def.SetWhenDone

    this.CheckFor = this.def.CheckFor;

    this.IfFound = this.def.IfFound;

    this.SpriteInfo = this.def.SpriteInfo ? this.def.SpriteInfo : {}

    /**
     * Animation helper class
     * @type {ObjectAnimation}
     */
    this.animationHelper = new ObjectAnimation(this)

    // debug
    this.outer = new Phaser.Circle(this.x, this.y, this.OuterRadius)
    this.inner = new Phaser.Circle(this.x, this.y, this.InnerRadius)

    if (this.CustomObject) {
      if (!MapObjects[this.CustomObject]) {
        console.warn('[MapObject] CustomObject type not implemented:', this.CustomObject)
      } else {
        Object.assign(this, MapObjects[this.CustomObject])
      }
    }

    this.onCreate()
    this.doCheck()

    console.debug('MapObject', this.id, this.def, this.opt)
  }

  collide(where) {

    // console.log('collide', this.id, where);

  }

  /**
   * Set static default texture
   * @param name
   * @param direction
   */
  setFrameList(name, direction) {
    if (this.def.FrameList['1']) {
      if (!direction) direction = '1'

      if (this.def.FrameList[direction][name]) {
        var def = this.def.FrameList[direction][name][0]

        if (def !== 'Dummy') {
          this.setDirectorMember(def)
        }
      }
    } else {
      if (this.def.FrameList[name]) {
        var def = this.def.FrameList[name][0]

        if (def !== 'Dummy') {
          this.setDirectorMember(def)
        }
      }
    }
  }

  /**
   * Set sprite member for a specific channel (Lingo parity)
   * @param {number|string} channelId - The sprite channel ID
   * @param {string} memberName - The new member name (e.g. '31b001v0')
   */
  setSpriteMember(channelId, memberName) {
    if (this.state && typeof this.state.getSprite === 'function') {
      const sprite = this.state.getSprite(channelId)
      if (sprite && typeof sprite.setDirectorMember === 'function') {
        sprite.setDirectorMember(memberName)
      }
    } else {
      console.warn('[MapObject] setSpriteMember: state.getSprite not available', channelId, memberName)
    }
  }

  /**
   * Set sprite location for a specific channel (Lingo parity)
   * @param {number|string} channelId - The sprite channel ID
   * @param {Object} loc - Point with x, y
   */
  setSpriteLoc(channelId, loc) {
    if (this.state && typeof this.state.getSprite === 'function') {
      const sprite = this.state.getSprite(channelId)
      if (sprite) {
        sprite.x = loc.x
        sprite.y = loc.y
      }
    } else {
      console.warn('[MapObject] setSpriteLoc: state.getSprite not available', channelId, loc)
    }
  }

  onCreate() {
    if (this.custom && this.custom.onCreate) {
      this.custom.onCreate.call(this)
      return
    }

    if (this.def.FrameList) {
      if (typeof this.def.FrameList === 'object') {
        if (this.opt && this.opt.Show) {
          this.setFrameList('normal', this.opt.Show)
        } else {
          this.setFrameList('normal')
        }

        // console.log('FrameList', this.id, this.def.FrameList);

        // frame = this.def.FrameList.normal[0];
      } else {

      }
    }
  }

  onEnterOuter(car) {
    if (this.custom && this.custom.onEnterOuter) {
      this.custom.onEnterOuter.call(this, car)
    }
  }

  onExitOuter(car) {
    if (this.custom && this.custom.onExitOuter) {
      this.custom.onExitOuter.call(this, car)
    }
  }

  onEnterInner(car) {
    // console.log( this, 'enter inner', this.def, this.opt );

    if (this.custom && this.custom.onEnterInner) {
      this.custom.onEnterInner.call(this, car)
      return
    }

    if (this.def.type === '#dest' || this.def.type === '#rdest') {
      car.enabled = false
      car.engineAudio.stop()
      // car.engineAudio = null;
    }

    if (this.def.Sounds && this.def.Sounds.length > 0) {
      console.log('object sound', this.def.Sounds)

      var soundPlay = this.game.mulle.playAudio(this.def.Sounds[0])

      soundPlay.onStop.addOnce(() => {
        this.onEnterInnerCallback(car)
      }, this)
    } else {
      this.onEnterInnerCallback(car)
    }
  }

  onEnterInnerCallback(car) {
    /*
      if (this.soundPlay) {
        this.soundPlay.onStop.remove(this.onEnterInnerCallback, this)
        this.soundPlay = null
      }
    */

    if (this.def.type === '#dest' || this.def.type === '#rdest') {
      this.game.state.states[this.game.state.current].saveSession(this)

      this.game.mulle.SetWhenDone = this.SetWhenDone
    }

    if (this.def.type === '#dest') {
      var dest = this.def.DirResource
      var scene = this.game.mulle.resolveSceneFromDirResource
        ? this.game.mulle.resolveSceneFromDirResource(dest, this.game.state.current)
        : this.game.mulle.scenes[dest]

      console.log('change scene', dest)

      this.game.mulle.activeCutscene = '00b008v0'

      if (this.game.state.states[scene]) {
        this.game.state.start(scene)
      } else {
        alert('unhandled scene "' + scene + '"')

        car.enabled = true
      }
    } else if (this.def.type === '#rdest') {
      var rdest = this.def.DirResource
      var rscene = this.game.mulle.resolveSceneFromDirResource
        ? this.game.mulle.resolveSceneFromDirResource(rdest, this.game.state.current)
        : this.game.mulle.scenes[rdest]

      console.log('change rscene', rdest)

      this.game.mulle.activeCutscene = '00b008v0'

      if (this.game.state.states[rscene]) {
        this.game.state.start(rscene)
      } else {
        alert('unhandled rscene "' + rscene + '"')

        car.enabled = true
      }
    }

    // if( this.def.SetWhenDone ){

    // this.game.mulle.lastSession.SetWhenDone = this.def.SetWhenDone;

    // }
  }

  onExitInner(car) {
    if (this.custom && this.custom.onExitInner) {
      this.custom.onExitInner.call(this, car)
    }
  }

  doCheck() {
    if (!this.def || !this.def.CheckFor) return

    // Reset visibility before checks (ensures fresh evaluation each call)
    this.enabled = true
    this.renderable = true
    this.visible = true

    const user = this.game.mulle.user
    const checkFor = this.def.CheckFor

    // 1. Level check
    if (checkFor.Level) {
      if (this.game.mulle.levelHandler) {
        const currentLevel = this.game.mulle.levelHandler.getLevel()
        if (Array.isArray(checkFor.Level) && checkFor.Level.indexOf(currentLevel) === -1) {
          this._hide()
          return
        }
      }
    }

    // 2. Inventory check (hiding if already gathered)
    if (checkFor.Inventory) {
      const inventory = this.game.mulle.seaInventory || (user && user.Car)
      if (inventory) {
        checkFor.Inventory.forEach(item => {
          if (typeof inventory.hasItem === 'function' ? inventory.hasItem(item) : inventory.hasCache(item)) {
            if (this.def.IfFound === '#NoDisplay') {
              this._hide()
            }
          }
        })
      }
    }

    // 3. Mission status check
    if (checkFor.NotGivenMissions) {
      if (user && typeof user.isSeaMissionGiven === 'function') {
        checkFor.NotGivenMissions.forEach(missionId => {
          if (!user.isSeaMissionGiven(missionId)) {
            if (this.def.IfFound === '#NoDisplay') {
              this._hide()
            }
          }
        })
      }
    }

    // 4. Existing cache check (e.g. #FirstSeaTrip)
    if (checkFor.Cache) {
      checkFor.Cache.forEach((v) => {
        if (typeof user.hasCache === 'function' ? user.hasCache(v) : (user.Car && user.Car.hasCache(v))) {
          if (this.def.IfFound === '#NoDisplay') {
            this._hide()
          }
        }
      })
    }

    // 5. UserStuff check (e.g. #FerryTicket)
    if (checkFor.UserStuff) {
      checkFor.UserStuff.forEach((item) => {
        if (user && typeof user.getUserProp === 'function') {
          const val = user.getUserProp(item)
          console.debug('[MapObject] UserStuff check:', item, 'value:', val, 'IfFound:', this.def.IfFound)
          // Hide if property is MISSING (NoProp)
          if (val === '#NoProp' || val === 'NoProp') {
            if (this.def.IfFound === '#NoDisplay' || this.def.IfFound === 0) {
              console.debug('[MapObject] Hiding due to missing UserStuff:', item)
              this._hide()
            }
          }
        }
      })
    }

    // 6. Medals check
    if (checkFor.Medals) {
      checkFor.Medals.forEach((medalId) => {
        if (user && typeof user.hasMedal === 'function') {
          if (!user.hasMedal(medalId)) {
            if (this.def.IfFound === '#NoDisplay') {
              this._hide()
            }
          }
        }
      })
    }

    // 7. Parts check
    if (checkFor.Parts) {
      const inventory = this.game.mulle.seaInventory || (user && user.Car)
      if (inventory) {
        checkFor.Parts.forEach(partId => {
          if (!(typeof inventory.hasPart === 'function' ? inventory.hasPart(partId) : inventory.hasCache(partId))) {
            if (this.def.IfFound === '#NoDisplay') {
              this._hide()
            }
          }
        })
      }
    }
  }

  _hide() {
    this.enabled = false
    this.renderable = false
    this.visible = false
  }
  destroy() {
    if (this.custom && this.custom.onDestroy) {
      this.custom.onDestroy.call(this)
    }

    super.destroy()
  }
}

export default MulleMapObject
