class TextInput {
  constructor (game, x, y, w, fontSize, fontStyle = 'serif') {
    this.input = document.createElement('input')
    this.input.style.position = 'absolute'
    this.input.style.top = `${y}px`
    this.input.style.left = `${x}px`
    this.input.style.border = 'none'
    this.input.style.font = `${fontSize}px ${fontStyle}`
    this.input.style.background = 'none'
    this.input.style.width = `${w}px`

    this.input.addEventListener('keyup', (ev) => {
      if (ev.keyCode === 13) {
        console.log('Enter pressed')
      }
    })
    document.getElementById('player').appendChild(this.input)
  }

  text (text) {
    this.input.value = text
  }

  value () {
    return this.input.value
  }

  type (type) {
    this.input.setAttribute('type', type)
    this.input.setAttribute('accept', '*.car')
  }

  id (id) {
    this.input.setAttribute('id', id)
  }

  onChange (listener) {
    this.input.addEventListener('change', listener)
  }

  remove() {
    document.getElementById('player').removeChild(this.input)
  }
}

export default TextInput
