/**
 * Weather module index
 * @module objects/weather
 * 
 * Re-exports all weather-related classes from the boat game
 * Based on original Lingo scripts from Mulle Meck Boten (Recht Door Zee)
 */
'use strict'

export { default as Wind } from './Wind'
export { default as Waves } from './Waves'
export { default as SingleWave } from './SingleWave'
export { default as Weather } from './Weather'
export { default as WeatherRenderer } from './WeatherRenderer'
export { default as Sail } from './Sail'

// Default export for convenience
export default {
  Wind: require('./Wind').default,
  Waves: require('./Waves').default,
  SingleWave: require('./SingleWave').default,
  Weather: require('./Weather').default,
  WeatherRenderer: require('./WeatherRenderer').default,
  Sail: require('./Sail').default
}
