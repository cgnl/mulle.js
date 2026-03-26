/* global FileReader */
import TextInput from './TextInput'
import MulleButton from './button'
import MulleSprite from './sprite'

class MulleFileBrowser extends MulleSprite {
  /**
   * @param {Phaser.Game} game
   * @param {function} callback Function to be called with file content when OK-button is pressed
   */
  constructor (game, callback) {
    super(game, 320, 240, '', '')
    this.callback = callback

    this.setDirectorMember('13.DXR', 32)
    this.leftPoint = this.x - this.width / 2
    this.topPoint = this.y - this.height / 2

    this.input_path = new TextInput(this.game, this.leftPoint + 14, this.topPoint + 7, 302, 12)

    this.input_file = new TextInput(this.game, 170, this.topPoint + 228, this.leftPoint + 65, 24)
    this.input_file.type('file')
    this.input_file.id('file')
    this.input_file.input.setAttribute('accept', '*.car')

    this.buttonOk = this.relativeRectangleButton(263, 209, 64, 32, {
      click: () => {
        const file = this.input_file.input.files[0]
        const reader = new FileReader()

        reader.onload = (e) => {
          this.callback(e.target.result)
          this.destroy()
        }

        reader.readAsText(file)
      }
    })
    this.game.add.existing(this.buttonOk)

    this.buttonClose = this.relativeRectangleButton(278, 241, 31, 36, {
      click: () => {
        this.destroy(true)
      }
    })
    this.game.add.existing(this.buttonClose)

    this.buttonUp = this.relativeRectangleButton(274, 32, 17, 27, {
      click: () => {
        this.scrollUp()
      }
    })
    this.game.add.existing(this.buttonUp)

    this.buttonDown = this.relativeRectangleButton(274, 184, 17, 27, {
      click: () => {
        this.scrollDown()
      }
    })
    this.game.add.existing(this.buttonDown)
  }

  /**
   * Simplified method to create a button within the file browser frame
   * @param {int} x X relative to file browser frame
   * @param {int} y Y relative to file browser frame
   * @param {int} h Height
   * @param {int} w Width
   * @param {array} opt Options
   */
  relativeRectangleButton (x, y, h, w, opt) {
    return MulleButton.fromRectangle(this.game, this.leftPoint + x, this.topPoint + y, h, w, opt)
  }

  scrollUp () {
    console.log('Scroll up')
  }

  scrollDown () {
    console.log('Scroll down')
  }

  destroy (destroyChildren) {
    document.getElementById('player').removeChild(this.input_path.input)
    document.getElementById('player').removeChild(this.input_file.input)
    super.destroy(destroyChildren)
  }
}

export default MulleFileBrowser

// https://stackabuse.com/encoding-and-decoding-base64-strings-in-node-js/
