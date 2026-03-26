'use strict'

import AmbienceSound from '../AmbienceSound'

function makeSound (id) {
  return {
    id,
    loop: false,
    volume: 0,
    paused: true,
    isPlaying: false,
    pause: jest.fn(function () { this.paused = true; this.isPlaying = false }),
    resume: jest.fn(function () { this.paused = false; this.isPlaying = true }),
    restart: jest.fn(function () { this.paused = false; this.isPlaying = true }),
    stop: jest.fn(function () { this.paused = true; this.isPlaying = false })
  }
}

function makeGame () {
  const sounds = {}
  const audioPack = {
    sounds: {
      a: { extraData: { dirName: 'WaveSm' } },
      b: { extraData: { dirName: 'Vatten' } },
      c: { extraData: { dirName: '05e043v0' } },
      d: { extraData: { dirName: 'OneWave2' } }
    }
  }

  return {
    mulle: {
      audio: { pack: audioPack },
      playAudio: jest.fn((id) => {
        const snd = makeSound(id)
        sounds[id] = snd
        return snd
      }),
      loopMaster: {
        addObject: jest.fn(),
        deleteObject: jest.fn()
      }
    },
    __sounds: sounds
  }
}

describe('AmbienceSound (single implementation path)', () => {
  test('activate(true) loads sounds and registers in loopMaster', () => {
    const game = makeGame()
    const ambience = new AmbienceSound(game)

    ambience.activate(true)

    expect(ambience.active).toBe(true)
    expect(ambience.mode).toBe('waves')
    expect(game.mulle.loopMaster.addObject).toHaveBeenCalledWith(ambience)
    expect(ambience.wavesID).toBeTruthy()
    expect(ambience.stemWaterID).toBeTruthy()
    expect(ambience.windID).toBeTruthy()
    expect(ambience.singleWaveID).toBeTruthy()
  })

  test('loop switches to wind when wind speed > 150', () => {
    const game = makeGame()
    const ambience = new AmbienceSound(game)
    ambience.activate(true)

    ambience.loop({ speed: 0, maxSpeed: 600 }, { windSpeed: 200 })

    expect(ambience.isPlaying(ambience.windID)).toBe(true)
    expect(ambience.windID.volume).toBe(1)
  })

  test('selectWaterSound uses waves below 20% and Stem at/above 20%', () => {
    const game = makeGame()
    const ambience = new AmbienceSound(game)
    ambience.activate(true)

    ambience.selectWaterSound({ speed: 60, maxSpeed: 600 })
    expect(ambience.mode).toBe('waves')

    ambience.selectWaterSound({ speed: 180, maxSpeed: 600 })
    expect(ambience.mode).toBe('Stem')
  })

  test('hitWave plays one-shot sound only when active', () => {
    const game = makeGame()
    const ambience = new AmbienceSound(game)

    ambience.hitWave(50)
    expect(ambience.singleWaveID).toBeNull()

    ambience.activate(true)
    ambience.hitWave(50)
    expect(ambience.singleWaveID.resume).toHaveBeenCalled()
  })

  test('activate(false) and kill cleanup sounds and unregister', () => {
    const game = makeGame()
    const ambience = new AmbienceSound(game)
    ambience.activate(true)

    ambience.activate(false)
    expect(game.mulle.loopMaster.deleteObject).toHaveBeenCalledWith(ambience)
    expect(ambience.active).toBe(false)

    const result = ambience.kill()
    expect(result).toBe(0)
  })
})
