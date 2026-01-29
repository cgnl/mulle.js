class LoadSaveCar {
  /**
   * @param {Phaser.Game} game
   */
  constructor (game) {
    this.game = game
    if (!this.game.mulle.user.savedCars) {
      this.game.mulle.user.savedCars = []
    }
  }

  /**
   * Parse a string from an exported car file from the original game
   * @param {string} carDataString Car file string content
   * @return {array}
   */
  static parseOriginalGame (carDataString) {
    carDataString = carDataString.replace(/#([a-zA-Z0-9]+):/g, '"$1":')
    carDataString = '{' + carDataString.substring(1, carDataString.length - 1) + '}'
    carDataString = carDataString.replace('[:]', '[]')
    carDataString = carDataString.replace(/("cacheList": )\[(.+)]/, '$1{$2}')
    console.log(carDataString)
    return JSON.parse(carDataString)
  }

  /**
   * Save a car
   * @param {int} page Album page to save the car
   * @param {array} parts Parts on car
   * @param {array} medals Car medals
   * @param {string} name Car name
   */
  saveCar (page, parts, medals, name = '') {
    console.log(`Save car to page ${page}`)
    this.game.mulle.user.savedCars[page] = { parts: parts, medals: medals, name: name }
    this.game.mulle.user.save()
  }

  /**
   * Save the current car
   * @param {int} page Album page to save the car
   */
  saveCurrentCar (page) {
    this.saveCar(page,
      this.game.mulle.user.Car.Parts,
      this.game.mulle.user.Car.Medals,
      this.game.mulle.user.Car.Name)
  }

  loadCar (page) {
    if (!this.isSaved(page)) throw new Error('No car saved on page ' + page)

    console.log(this.game.mulle.user.savedCars[page])
    if (!('parts' in this.game.mulle.user.savedCars[page])) {
      this.saveCar(page, this.game.mulle.user.savedCars[page], [])
    }

    const { parts, medals, name } = this.game.mulle.user.savedCars[page]
    return [parts, medals, name]
  }

  /**
   * Import a car from a saved file
   * @param {int} page Album page to save the car
   * @param {string} carDataString String content from an exported car file
   */
  importCar (page, carDataString) {
    const { parts, name, medals } = LoadSaveCar.parseOriginalGame(carDataString)
    this.saveCar(page, parts, medals, name)
  }

  /**
   * Is a car saved on this page?
   * @param {int} page Page number
   * @return {boolean}
   */
  isSaved (page) {
    return page in this.game.mulle.user.savedCars
  }
}

export default LoadSaveCar
