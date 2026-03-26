class LoadSaveBoat {
  /**
   * @param {Phaser.Game} game
   */
  constructor (game) {
    this.game = game
    if (!this.game.mulle.user.savedBoats) {
      this.game.mulle.user.savedBoats = []
    }
  }

  /**
   * Parse a string from an exported boat file from the original game
   * @param {string} boatDataString Boat file string content
   * @return {array}
   */
  static parseOriginalGame (boatDataString) {
    boatDataString = boatDataString.replace(/#([a-zA-Z0-9]+):/g, '"$1":')
    boatDataString = '{' + boatDataString.substring(1, boatDataString.length - 1) + '}'
    boatDataString = boatDataString.replace('[:]', '[]')
    boatDataString = boatDataString.replace(/("cacheList": )\[(.+)]/, '$1{$2}')
    console.log(boatDataString)
    return JSON.parse(boatDataString)
  }

  saveBoat (page, parts, medals, name = '') {
    console.log(`Save boat to page ${page}`)
    this.game.mulle.user.savedBoats[page] = { parts: parts, medals: medals, name: name }
    this.game.mulle.user.save()
  }

  saveCurrentBoat (page) {
    this.saveBoat(page,
      this.game.mulle.user.Boat.Parts,
      this.game.mulle.user.Boat.Medals,
      this.game.mulle.user.Boat.Name)
  }

  loadBoat (page) {
    if (!this.isSaved(page)) throw new Error('No boat saved on page ' + page)

    console.log(this.game.mulle.user.savedBoats[page])
    if (!('parts' in this.game.mulle.user.savedBoats[page])) {
      this.saveBoat(page, this.game.mulle.user.savedBoats[page], [])
    }

    const { parts, medals, name } = this.game.mulle.user.savedBoats[page]
    return [parts, medals, name]
  }

  /**
   * Import a boat from a saved file
   * @param {int} page Album page to save the boat
   * @param {string} boatDataString String content from an exported boat file
   */
  importBoat (page, boatDataString) {
    const { parts, name, medals } = LoadSaveBoat.parseOriginalGame(boatDataString)
    this.saveBoat(page, parts, medals, name)
  }

  /**
   * Is a boat saved on this page?
   * @param {int} page Page number
   * @return {boolean}
   */
  isSaved (page) {
    return page in this.game.mulle.user.savedBoats
  }
}

export default LoadSaveBoat
