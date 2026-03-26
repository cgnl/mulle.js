class SubtitleLoader {
  /**
   * Class to help load subtitles from JSON
   * @param {Phaser.Game|MulleGame} game Game instance
   * @param {string} topic Subtitle topic
   * @param {string[]} languages Languages to load
   */
  constructor (game, topic, languages = ['english', 'swedish']) {
    this.game = game
    this.topic = topic
    this.languages = languages
  }

  preload (topic = null) {
    if (!topic)
      topic = this.topic

    for (const language of this.languages) {
      this.game.load.json(topic + 'Subs', 'data/subtitles/' + language + '/' + topic + '.json')
    }
  }

  load (topic) {
    if (!topic)
      topic = this.topic
    for (const language of this.languages) {
      if (!this.game.mulle.subtitle.database[language]) {
        console.error('Invalid subtitle language ' + language)
        continue
      }

      let data = this.game.cache.getJSON(topic + 'Subs')
      for (const file in data) {
        this.game.mulle.subtitle.database[language][file] = data[file]
        console.debug('Loaded subtitles for', file)
      }
    }
  }
}

export default SubtitleLoader