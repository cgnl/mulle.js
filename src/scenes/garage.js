/* global alert, Phaser */
/**
 * GarageState
 * @module GarageState
 */
'use strict'

import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'
import MulleActor from '../objects/actor'
import MulleButton from '../objects/button'
import MulleCarPart from '../objects/carpart'
import MulleToolbox from '../objects/toolbox'
import SubtitleLoader from '../objects/SubtitleLoader'


/**
 * GarageState
 * @extends MulleState
 * @property {array} enterParts Part on the car when entering the garage
 */
class GarageState extends MulleState {
  preload () {
    this.DirResource = '03.DXR'
    super.preload()

    this.game.load.pack('garage', 'assets/garage.json', null, this)
    this.game.load.json('partNames', 'data/part_names.json')
    this.subtitles = new SubtitleLoader(this.game, 'garage', ['english'])
    this.subtitles.preload()
    this.subtitles.preload('carparts')
  }

  /**
   * Has the car changed in the garage?
   * @returns {boolean}
   */
  hasCarChanged () {
    const currentParts = this.game.mulle.user.Car.Parts
    if (currentParts.length !== this.enterParts.length)
      return true

    for (var i = 0, l = currentParts.length; i < l; i++)
      if (currentParts[i] !== this.enterParts[i]) {
        console.log('Car has changed, different parts', i, currentParts[i], this.enterParts[i])
        return true
      }
    return false
  }

  figge () {
    this.game.mulle.user.calculateParts()

    // var tmpList = .splice(0);

    /*
    if (tmpList.length <= 3) {

      tmpNewParts = tmpList.splice(0)

      return
    }
    */

    // car
    this.game.mulle.playAudio('03e009v0', () => {
      // narrator
      this.game.mulle.playAudio('03d043v0', () => {
        /**
         * Actor "figgeDoor"
         * @type {MulleActor}
         */
        const figge = new MulleActor(this.game, 320, 240, 'figgeDoor')

        this.game.add.existing(figge)

        this.game.mulle.actors.figge = figge

        this.door_junk.onInputOverHandler()

        // door
        this.game.mulle.playAudio('02e016v0', () => {
          figge.animations.play('enter').onComplete.addOnce(() => {
            // hörru
            this.game.mulle.actors.figge.talk('03d044v0', () => {
              figge.animations.play(figge.silenceAnimation)

              this.game.mulle.actors.mulle.silenceAnimation = 'idle'
              this.game.mulle.actors.mulle.talkAnimation = 'talkRegular'

              // ser man på
              this.game.mulle.actors.mulle.talk('03d045v0', () => {
                this.game.mulle.actors.mulle.silenceAnimation = 'lookPlayer'
                this.game.mulle.actors.mulle.talkAnimation = 'talkPlayer'

                // jajamänsan
                this.game.mulle.actors.figge.talk('03d046v0', () => {
                  //figge.animations.play('exit').onComplete.addOnce(() => {
                    figge.destroy()
                    this.door_junk.onInputOutHandler()

                    // door
                    this.game.mulle.playAudio('02e015v0', () => {
                      //figge.destroy()

                      this.game.mulle.actors.figge = null

                      // car
                      this.game.mulle.playAudio('03e010v0', () => {
                        console.log('figge done')
                      })
                    })
                  //})
                })
              })
            })
          })
        })
      })
    })

    this.figgeGiveParts()
  }

  figgeGiveParts () {
    if (this.game.mulle.user.availableParts.JunkMan.length > 0) {
      for (let i = 0; i < 3; i++) {
        const partId = this.game.mulle.user.availableParts.JunkMan[i]

        if (!partId) break

        this.game.mulle.user.addPart('yard', partId, null, true)

        console.log('figge add part', partId)
      }

      this.game.mulle.user.save()

      return true
    }

    return false
  }

  makePart (partId, x, y) {
    const cPart = new MulleCarPart(this.game, partId, x, y)

    cPart.car = this.car
    cPart.junkParts = this.junkParts

    cPart.dropTargets.push([this.door_junk, (d) => {
      d.destroy()
      this.game.mulle.user.Junk.Pile1[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 }
      this.game.mulle.playAudio('00e004v0')
      return true
    }])

    cPart.dropTargets.push([this.door_side, (d) => {
      d.destroy()
      this.game.mulle.user.Junk.yard[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 }
      this.game.mulle.playAudio('00e004v0')
      return true
    }])

    cPart.dropTargets.push([this.door_garage, (d) => {
      d.destroy()
      this.game.mulle.user.Junk.yard[partId] = { x: this.game.rnd.integerInRange(0, 640), y: 240 }
      this.game.mulle.playAudio('00e004v0')
      return true
    }])

    this.junkParts.addChild(cPart)

    return cPart
  }

  create () {
    super.create()

    this.car = null
    this.junkPile = null
    this.junkParts = null

    this.door_junk = null

    this.mulleActor = null

    this.toolbox = null
    this.popupMenu = null

    this.door_junk = null
    this.door_garage = null
    this.door_side = null

    this.game.physics.startSystem(Phaser.Physics.ARCADE)
    this.game.physics.arcade.gravity.y = 800

    this.game.mulle.addAudio('garage')
    this.subtitles.load()
    this.subtitles.load('carparts')

    // this.game.mulle.user.calculateParts();
    this.enterParts = [...this.game.mulle.user.Car.Parts]

    const background = new MulleSprite(this.game, 320, 240)
    // background.setFrameId('03b001v0');
    background.setDirectorMember('03.DXR', 33)

    this.game.add.existing(background)

    this.door_junk = new MulleButton(this.game, 320, 240, {
      imageDefault: ['03.DXR', 34],
      imageHover: ['03.DXR', 35],
      soundDefault: '02e015v0',
      soundHover: '02e016v0',
      click: () => {
        this.game.mulle.activeCutscene = 70
        this.game.state.start('junk')
      }
    })

    this.door_junk.cursor = 'Click'
    this.door_junk.cursorHover = 'Click'
    this.door_junk.cursorDrag = 'MoveIn'

    /*
    this.game.mulle.cursor.addHook(door_junk, function( obj, state, event) {

      this.game.add.existing(this.door_junk)

      if (event.dragging) return 'cursor-drag_forward'

      if (state == 'over') {
        return 'point'
      }

      return false
    })
    */

    this.game.add.existing(this.door_junk)

    this.door_garage = new MulleButton(this.game, 320, 240, {
      imageDefault: ['03.DXR', 36],
      imageHover: ['03.DXR', 37],
      soundDefault: '02e015v0',
      soundHover: '02e016v0',
      click: () => {
        if (!this.game.mulle.user.Car.isRoadLegal(true)) return

        this.game.mulle.activeCutscene = 67
        this.game.mulle.user.toYardThroughDoor = false
        this.game.state.start('yard')

        if (this.hasCarChanged()) {
          if (isNaN(this.game.mulle.user.NrOfBuiltCars)) {
            this.game.mulle.user.NrOfBuiltCars = 0
          }

          this.game.mulle.user.NrOfBuiltCars += 1
          this.game.mulle.user.figgeIsComing = true
          this.game.mulle.user.missionIsComing = true
          console.log('Increase NrOfBuiltCars to ', this.game.mulle.user.NrOfBuiltCars)
        }
      }
    })

    this.door_garage.cursor = 'Left'
    this.door_garage.cursorHover = 'Left'
    this.door_garage.cursorDrag = 'MoveLeft'

    // door_garage.moveJunk = 'yard';

    this.game.add.existing(this.door_garage)

    this.door_side = new MulleButton(this.game, 320, 240, {
      imageDefault: ['03.DXR', 38],
      imageHover: ['03.DXR', 39],
      soundDefault: '02e015v0',
      soundHover: '02e016v0',
      click: () => {
        this.game.mulle.activeCutscene = 68
        this.game.mulle.user.toYardThroughDoor = true
        this.game.state.start('yard')
      }
    })

    this.door_side.cursor = 'Left'
    this.door_side.cursorHover = 'Left'
    this.door_side.cursorDrag = 'MoveLeft'

    // door_side.moveJunk = 'yard';

    this.game.add.existing(this.door_side)

    this.car_camera = MulleButton.fromRectangle(this.game, 589, 62, 41, 117, {
      imageHover: ['03.DXR', 104],
      soundHover: '02e011v0',
      click: () => {
        this.game.mulle.activeCutscene = 86
        this.game.state.start('album', true, false, 'save')
      }
    })
     this.game.add.existing(this.car_camera)

    this.album = MulleButton.fromRectangle(this.game, 383, 41, 50, 28, {
      imageHover: ['03.DXR', 103],
      soundHover: '02e011v0',
      click: () => {
        this.game.mulle.activeCutscene = 83
        this.game.state.start('album', true, false, 'load')
      }
    })
    this.game.add.existing(this.album)

    this.car = new MulleBuildCar(this.game, 368, 240, null, false)
    this.game.add.existing(this.car)

    this.car.onDetach.add((partId, newId, newPos) => {
      const part = this.makePart(newId, newPos.x, newPos.y)

      part.justDetached = true

      part.position.add(part.regPoint.x, part.regPoint.y)

      part.input.startDrag(this.game.input.activePointer)

      this.game.mulle.playAudio(part.sound_attach)
    })

    this.mulleActor = new MulleActor(this.game, 118, 188, 'mulleDefault')
    this.game.add.existing(this.mulleActor)
    this.game.mulle.actors.mulle = this.mulleActor

    // this.mulleActor.talk('20d001v0');
    // console.log('actor', this.mulleActor);

    // spawn junk parts
    this.junkParts = this.game.add.group()
    this.junkParts.pileName = 'shopFloor'
    this.car.junkParts = this.junkParts

    for (const partId in this.game.mulle.user.Junk.shopFloor) {
      const pos = this.game.mulle.user.Junk.shopFloor[partId]

      this.makePart(partId, pos.x, pos.y)
    }

    console.log('Built cars', this.game.mulle.user.NrOfBuiltCars)
    console.log('Built cars mod', this.game.mulle.user.NrOfBuiltCars % 3)
    if (this.game.mulle.user.NrOfBuiltCars % 3 === 0 && this.game.mulle.user.figgeIsComing)
    {
      console.log('Figge is coming!')
      this.game.mulle.user.figgeIsComing = 0
      this.game.mulle.user.figgeBeenHere = 1
      this.figge()
    }

    // toolbox, manual
    this.toolbox = new MulleToolbox(this.game, 657, 432)
    this.game.add.existing(this.toolbox)

    this.toolbox.showToolbox = () => {
      this.blockSprite = new MulleSprite(this.game, 0, 0)
      this.blockSprite.width = 640
      this.blockSprite.height = 480
      this.blockSprite.inputEnabled = true
      this.blockSprite.input.useHandCursor = false
      this.game.add.existing(this.blockSprite)

      this.popupMenu = new MulleSprite(this.game, 320, 200)
      this.popupMenu.setDirectorMember('00.CXT', 84)
      this.game.add.existing(this.popupMenu)

      const rectList = {
        Trash: [165, 125, 245, 260],
        Diploma: [265, 127, 345, 264],
        quit: [365, 125, 445, 266],
        Cancel: [460, 210, 528, 365]
      }

      const soundList = {
        Trash: '09d001v0',
        quit: '09d003v0',
        Diploma: '09d002v0',
        Cancel: '09d004v0'
      }

      let currentAudio

      const funcList = {
        Trash: () => {
          this.car.trash()
        },
        Diploma: () => {
          this.game.mulle.activeCutscene = 81
          this.game.state.start('diploma', true, false, this.key)
        },
        Cancel: () => {
          this.toolbox.toggleToolbox(this.toolbox)
        },
        quit: () => {
          this.game.state.start('menu')
        }
      }

      this.popupMenuButtons = this.game.add.group()

      for (const n in rectList) {
        const r = rectList[n]

        const b = new Phaser.Button(this.game, r[0], r[1] - 40)
        b.width = r[2] - r[0]
        b.height = r[3] - r[1]

        b.onInputOver.add(() => {
          if (currentAudio) currentAudio.stop()
          currentAudio = this.game.mulle.playAudio(soundList[n])
        })

        b.onInputDown.add(() => {
          if (currentAudio) currentAudio.stop()
          funcList[n]()
        })

        this.popupMenuButtons.addChild(b)
      }

      return true
    }

    this.toolbox.hideToolbox = () => {
      this.blockSprite.destroy()

      this.popupMenu.destroy()

      this.popupMenuButtons.destroy()

      return true
    }

    // spawn parts cheat

    if (this.game.mulle.cheats) {
      const partNames = this.game.cache.getJSON('partNames')
      document.getElementById('cheats').innerHTML = ''

      const b_figge = document.createElement('button')
      b_figge.innerHTML = 'Figge'
      b_figge.className = 'button'
      b_figge.addEventListener('click', () => {
        this.figge()
      })
      document.getElementById('cheats').appendChild(b_figge)

      for (const partId in this.game.mulle.PartsDB) {
        const partData = this.game.mulle.PartsDB[partId]

        if (partData.master) continue

        const has = this.game.mulle.user.hasPart(partId)

        const b = document.createElement('button')
        b.innerHTML = (partNames && partNames[partId]) ? '(' + partId + ') ' + partNames[partId] : partId
        b.className = 'button'

        if (has) b.setAttribute('style', 'background: #222')

        b.addEventListener('click', () => {
          if (has) {
            for (const pile in this.game.mulle.user.Junk) {
              if (partId in this.game.mulle.user.Junk[pile]) {
                console.log(`Remove part ${partId} from ${pile}`)
                delete this.game.mulle.user.Junk[pile][partId]
              }
            }
          }

          this.makePart(partId, 320, 240)
        })

        document.getElementById('cheats').appendChild(b)
      }
    }
  }

  shutdown () {
    console.log('shutdown garage')

    this.game.mulle.user.Junk.shopFloor = {}

    this.junkParts.forEach((p) => {
      this.game.mulle.user.Junk.shopFloor[p.part_id] = { x: p.x, y: p.y }
    })

    this.game.mulle.user.save()

    this.game.mulle.net.send({ parts: this.game.mulle.user.Car.Parts })

    this.game.mulle.actors.mulle = null

    document.getElementById('cheats').innerHTML = ''

    super.shutdown()
  }
}

export default GarageState
