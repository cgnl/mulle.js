/**
 * MulleGlobals - Global state management
 * 
 * BUG FIX #3: Missing global state initialization order
 * BUG FIX #6: No global state persistence
 * 
 * Original Director uses gMulleGlobals to store global game state including:
 * - weather: Weather system
 * - radioHandler: Radio handler
 * - user: Current user/profile
 * - firstTimeList: First-time visit tracking per location
 * - gotNewHull: Flag for blueprint screen flow
 * - gotNewParts: Flag for new parts received
 * - WhereFrom: Previous scene tracking
 * - externalParts: Parts manager
 * 
 * Based on original Lingo global structure from Boten/00.CXT
 * 
 * Original Lingo initialization (from prepareMovie):
 * global gMulleGlobals
 * set gMulleGlobals to [:]
 * set gMulleGlobals.weather to script("Weather").new()
 * set gMulleGlobals.radioHandler to script("RadioHandler").new()
 * set gMulleGlobals.user to VOID
 * set gMulleGlobals.externalParts to script("ExternalParts").new()
 * set gMulleGlobals.firstTimeList to [:]
 */

import RadioHandler from '../objects/radiohandler'

class MulleGlobals {
  constructor (game) {
    this.game = game

    // BUG FIX #3: Initialize global state in correct order
    // Original: set gMulleGlobals to [:]

    // BUG FIX #6: Global state flags for scene transitions
    // Original: set gMulleGlobals.gotNewHull to FALSE
    this.gotNewHull = false

    // BUG FIX #6: Flag set when parts are given/found
    // Original: set gMulleGlobals.gotNewParts to FALSE
    this.gotNewParts = false

    // BUG FIX #6: Track previous scene for navigation
    // Original: set gMulleGlobals.WhereFrom to ""
    this.WhereFrom = ''

    // BUG FIX #6: First-time visit tracking per location
    // Original: set gMulleGlobals.firstTimeList to [:]
    // Keys: #Quay, #Blueprint, #Shelf, etc.
    this.firstTimeList = {}

    // BUG FIX #3: Weather system reference
    // Original: set gMulleGlobals.weather to script("Weather").new()
    // Note: Weather object should be assigned by game initialization
    this.weather = null

    // BUG FIX #3: Radio handler reference
    // Original: set gMulleGlobals.radioHandler to script("RadioHandler").new()
    // BUG FIX #3.3: RadioHandler now initialized here instead of null
    this.radioHandler = new RadioHandler(game)

    // BUG FIX #3: Current user/profile reference
    // Original: set gMulleGlobals.user to VOID
    this.user = null

    // BUG FIX #3: External parts manager reference
    // Original: set gMulleGlobals.externalParts to script("ExternalParts").new()
    this.externalParts = null

    console.debug('[MulleGlobals]', 'initialized')
  }

  /**
   * BUG FIX #6: Set gotNewHull flag (used by blueprint screen flow)
   * Original Lingo: set the gotNewHull of gMulleGlobals to TRUE
   */
  setGotNewHull (value) {
    this.gotNewHull = value
    console.debug('[MulleGlobals]', 'gotNewHull =', value)
  }

  /**
   * BUG FIX #6: Set gotNewParts flag (used when parts are received)
   * Original Lingo: set the gotNewParts of gMulleGlobals to TRUE
   */
  setGotNewParts (value) {
    this.gotNewParts = value
    console.debug('[MulleGlobals]', 'gotNewParts =', value)
  }

  /**
   * BUG FIX #6: Set WhereFrom scene tracking
   * Original Lingo: set the WhereFrom of gMulleGlobals to "04"
   * 
   * @param {string} sceneId - Scene identifier (e.g., "04" for boatyard)
   */
  setWhereFrom (sceneId) {
    this.WhereFrom = sceneId
    console.debug('[MulleGlobals]', 'WhereFrom =', sceneId)
  }

  /**
   * BUG FIX #6: Check if location visited for first time
   * Original Lingo: set FirstTime to getaProp(the firstTimeList of gMulleGlobals, #Quay)
   * 
   * @param {string} location - Location identifier (e.g., 'Quay', 'Blueprint')
   * @returns {boolean} - true if first time, false if visited before
   */
  isFirstTime (location) {
    // Original returns VOID if not set, which is truthy
    // So undefined/null means first time
    return this.firstTimeList[location] !== false
  }

  /**
   * BUG FIX #6: Mark location as visited
   * Original Lingo: setaProp the firstTimeList of gMulleGlobals, #Quay, FALSE
   * 
   * @param {string} location - Location identifier
   */
  setVisited (location) {
    this.firstTimeList[location] = false
    console.debug('[MulleGlobals]', 'firstTime:', location, '= false')
  }

  /**
   * BUG FIX #6: Reset first-time flags (e.g., for new game)
   */
  resetFirstTimeList () {
    this.firstTimeList = {}
    console.debug('[MulleGlobals]', 'firstTimeList reset')
  }

  /**
   * BUG FIX #3: Set weather system reference
   * Original Lingo: set gMulleGlobals.weather to script("Weather").new()
   */
  setWeather (weather) {
    this.weather = weather
    console.debug('[MulleGlobals]', 'weather assigned')
  }

  /**
   * BUG FIX #3: Set radio handler reference
   * Original Lingo: set gMulleGlobals.radioHandler to script("RadioHandler").new()
   */
  setRadioHandler (radioHandler) {
    this.radioHandler = radioHandler
    console.debug('[MulleGlobals]', 'radioHandler assigned')
  }

  /**
   * BUG FIX #3: Set current user reference
   * Original Lingo: set gMulleGlobals.user to theUser
   */
  setUser (user) {
    this.user = user
    console.debug('[MulleGlobals]', 'user assigned:', user?.UserId)
  }

  /**
   * BUG FIX #3: Set external parts manager reference
   * Original Lingo: set gMulleGlobals.externalParts to script("ExternalParts").new()
   */
  setExternalParts (externalParts) {
    this.externalParts = externalParts
    console.debug('[MulleGlobals]', 'externalParts assigned')
  }

  /**
   * BUG FIX #6: Get current weather
   * Original Lingo: the weather of gMulleGlobals
   */
  getWeather () {
    return this.weather
  }

  /**
   * BUG FIX #6: Get current user
   * Original Lingo: the user of gMulleGlobals
   */
  getUser () {
    return this.user
  }

  /**
   * Reset all global state (for new game or scene cleanup)
   */
  reset () {
    this.gotNewHull = false
    this.gotNewParts = false
    this.WhereFrom = ''
    this.firstTimeList = {}
    
    console.debug('[MulleGlobals]', 'reset')
  }

  /**
   * Serialize global state for saving
   */
  toJSON () {
    return {
      gotNewHull: this.gotNewHull,
      gotNewParts: this.gotNewParts,
      WhereFrom: this.WhereFrom,
      firstTimeList: this.firstTimeList
    }
  }

  /**
   * Restore global state from saved data
   */
  fromJSON (data) {
    if (!data) return

    this.gotNewHull = data.gotNewHull || false
    this.gotNewParts = data.gotNewParts || false
    this.WhereFrom = data.WhereFrom || ''
    this.firstTimeList = data.firstTimeList || {}

    console.debug('[MulleGlobals]', 'restored from JSON')
  }

  /**
   * Debug info
   */
  debugInfo () {
    console.log('[MulleGlobals] Debug Info:')
    console.log('  gotNewHull:', this.gotNewHull)
    console.log('  gotNewParts:', this.gotNewParts)
    console.log('  WhereFrom:', this.WhereFrom)
    console.log('  firstTimeList:', this.firstTimeList)
    console.log('  weather:', this.weather ? 'assigned' : 'null')
    console.log('  radioHandler:', this.radioHandler ? 'assigned' : 'null')
    console.log('  user:', this.user ? this.user.UserId : 'null')
    console.log('  externalParts:', this.externalParts ? 'assigned' : 'null')
  }
}

export default MulleGlobals
