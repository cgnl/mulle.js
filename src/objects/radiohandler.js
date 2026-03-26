/**
 * RadioHandler - Mission broadcast system via radio
 * @module objects/radiohandler
 * 
 * Original Lingo: ParentScript 47 - RadioHandler.ls
 * 
 * Handles:
 * - Level-based mission broadcasts via radio
 * - Weather report dialogues (00d039v0-00d079v0)
 * - Mission dependencies (ChkMission)
 * - Auto-giving missions when conditions met
 * 
 * Mission Broadcast System:
 * - Each mission has level requirement, optional prerequisite, dialogue
 * - Checks player level and mission completion status
 * - Broadcasts via radio when conditions are met
 * - Uses dialogStartList for intro jingles
 * 
 * Weather Report System:
 * - Wind direction dialogues (00d039v0-00d048v0 for 8 directions)
 * - Wind speed dialogues (00d049v0-00d072v0 for 4 speeds)
 * - Weather type dialogues (00d053v0-00d055v0, 00d073v0 for 4 types)
 * - Outro dialogues (00d067v0, 00d069v0, 00d071v0)
 */

/**
 * RadioHandler class
 * Manages radio broadcasts for missions and weather
 */
class RadioHandler {
  /**
   * Create RadioHandler instance
   * @param {Phaser.Game} game - Phaser game instance
   */
  constructor (game) {
    this.game = game
    
    // Dialog queue
    this.DialogList = []
    
    // Dialog start jingles (random selection)
    this.dialogStartList = [
      '00d074v0', '00d075v0', '00d076v0',
      '00d077v0', '00d078v0', '00d079v0'
    ]
    
    // Loop counter for timing broadcasts (720-2880 frames = 12-48 seconds at 60fps)
    this.loopCounter = 720 + Math.floor(Math.random() * 2160)
    
    // Active state
    this.active = false
    
    // Pass weather reports to report object
    this.passWeather = true
    
    // Mission parameter list from original Lingo (ParentScript 47 - RadioHandler.ls line 10)
    // Format: [#ID, #level, #ChkMission, #GiveMission, #dialog]
    this.parameterList = [
      { ID: 1, level: 1, ChkMission: 0, GiveMission: 20, dialog: ['50d001v0'] },
      { ID: 2, level: 1, ChkMission: 0, GiveMission: 21, dialog: ['50d002v0'] },
      { ID: 3, level: 2, ChkMission: 0, GiveMission: 18, dialog: ['50d004v0'] },
      { ID: 4, level: 2, ChkMission: 0, GiveMission: 25, dialog: ['50d006v0'] },
      { ID: 5, level: 2, ChkMission: 0, GiveMission: 22, dialog: ['50d003v0'] },
      { ID: 6, level: 3, ChkMission: 7, GiveMission: 19, dialog: ['50d005v0'] },
      { ID: 7, level: 3, ChkMission: 0, GiveMission: 2, dialog: ['50d007v0'] },
      { ID: 8, level: 3, ChkMission: 0, GiveMission: 16, dialog: ['50d009v0'] },
      { ID: 9, level: 4, ChkMission: 0, GiveMission: 3, dialog: ['50d008v0'] },
      { ID: 10, level: 4, ChkMission: 8, GiveMission: 4, dialog: ['50d013v0'] },
      { ID: 11, level: 5, ChkMission: 0, GiveMission: 99, dialog: ['50d014v0'] }
    ]
    
    // Report object (scene that will receive broadcasts)
    this.reportObject = null
    
    // OK to report flag
    this.okToReport = true
    
    // Got weather report flag
    this.gotWeatherReport = false
    
    console.log('[RadioHandler] Initialized with', this.parameterList.length, 'mission broadcasts')
    
    // BUG FIX #3.4: RadioHandler loop never called - add to LoopMaster
    // Original Lingo: RadioHandler is added to global loop system automatically
    if (this.game.mulle.loopMaster) {
      this.game.mulle.loopMaster.addObject(this)
    }
  }

  /**
   * Start reporting to a scene object
   * Original Lingo: startreportRadioToMe(me, argObj, argPassWeather)
   * 
   * @param {object} sceneObject - Scene to report to (must have radioReport method)
   * @param {boolean} passWeather - Whether to pass weather reports (default true)
   */
  startReportRadioToMe (sceneObject, passWeather = true) {
    if (!sceneObject) {
      console.error('[RadioHandler] ERROR! Report object is NOT a valid object!')
      return
    }
    
    this.reportObject = sceneObject
    this.setActive(true)
    this.passWeather = passWeather
    this.gotWeatherReport = false
    
    console.log('[RadioHandler] Started reporting to:', sceneObject.constructor.name)
  }

  /**
   * Stop reporting to a scene object
   * Original Lingo: stopReportRadioToMe(me, argObj)
   * 
   * @param {object} sceneObject - Scene to stop reporting to
   */
  stopReportRadioToMe (sceneObject) {
    if (this.reportObject === sceneObject) {
      this.setActive(false)
      this.passWeather = false
      this.gotWeatherReport = false
      this.reportObject = null
      
      console.log('[RadioHandler] Stopped reporting')
    }
  }

  /**
   * Set active state
   * @param {boolean} status - Active status
   */
  setActive (status) {
    this.active = status
  }

  /**
   * Check if dialog ID is already in queue
   * Original Lingo: getInDialogList(me, argID)
   * 
   * @param {number} id - Dialog ID
   * @returns {number} Index in list (0 if not found)
   */
  getInDialogList (id) {
    for (let i = 0; i < this.DialogList.length; i++) {
      const tmpDialog = this.DialogList[i]
      if (tmpDialog.ID === id) {
        return i + 1 // Lingo is 1-based
      }
    }
    return 0
  }

  /**
   * Weather report handler
   * Original Lingo: weatherReport(me, argWeather)
   * 
   * Builds dialogue list based on weather info:
   * - Intro jingle (random from dialogStartList)
   * - "00d056v0" (weather report intro)
   * - Wind direction dialogue (00d039v0-00d048v0 based on direction 2-16)
   * - Wind speed dialogue (00d049v0-00d072v0 based on speed 0-3)
   * - Weather type dialogue (00d053v0-00d055v0, 00d073v0 based on type 1-4)
   * - Outro dialogue (random from 00d067v0, 00d069v0, 00d071v0)
   * 
   * @param {object} weather - Weather object with direction, speed, type, TimeLeft
   */
  weatherReport (weather) {
    console.log('[RadioHandler] Weather report:', weather)
    
    // BUG FIX #3.5: TimeLeft logic clarification
    // TimeLeft > 0 means weather IS ABOUT TO CHANGE (countdown active)
    // TimeLeft <= 0 means weather is stable (no broadcast needed)
    if (!weather || weather.TimeLeft <= 0) {
      // No weather change, just pass through if needed
      if (this.passWeather && this.reportObject) {
        if (typeof this.reportObject.weatherReport === 'function') {
          this.reportObject.weatherReport(weather)
        }
      }
      return
    }
    
    // Build weather report dialogue list
    const tmpList = []
    
    // Random intro jingle
    tmpList.push(this.dialogStartList[Math.floor(Math.random() * this.dialogStartList.length)])
    
    // Weather report intro
    tmpList.push('00d056v0')
    
    // Wind direction (case 2, 4, 6, 8, 10, 12, 14, 16)
    const directionDialogues = {
      2: '00d044v0',
      4: '00d042v0',
      6: '00d045v0',
      8: '00d041v0',
      10: '00d046v0',
      12: '00d043v0',
      14: '00d048v0',
      16: '00d039v0'
    }
    if (weather.direction && directionDialogues[weather.direction]) {
      tmpList.push(directionDialogues[weather.direction])
    }
    
    // Wind speed (0-3)
    const speedDialogues = {
      0: '00d049v0',
      1: '00d072v0',
      2: '00d050v0',
      3: '00d051v0'
    }
    if (weather.speed !== undefined && speedDialogues[weather.speed]) {
      tmpList.push(speedDialogues[weather.speed])
    }
    
    // Weather type (1-4)
    const typeDialogues = {
      1: '00d053v0',
      2: '00d073v0',
      3: '00d055v0',
      4: '00d054v0'
    }
    if (weather.type && typeDialogues[weather.type]) {
      tmpList.push(typeDialogues[weather.type])
    }
    
    // Random outro
    const byeList = ['00d067v0', '00d069v0', '00d071v0']
    tmpList.push(byeList[Math.floor(Math.random() * byeList.length)])
    
    // Add to dialog list (ID: 0 for weather reports)
    const tmpInDialog = this.getInDialogList(0)
    if (tmpInDialog > 0) {
      this.DialogList[tmpInDialog - 1] = { ID: 0, dialog: tmpList }
    } else {
      this.DialogList.unshift({ ID: 0, dialog: tmpList })
    }
    
    this.gotWeatherReport = true
    
    // Pass weather to report object if needed
    if (this.passWeather && this.reportObject) {
      if (typeof this.reportObject.weatherReport === 'function') {
        this.reportObject.weatherReport(weather)
      }
    }
    
    console.log('[RadioHandler] Weather report queued:', tmpList.length, 'dialogues')
  }

  /**
   * Check for new mission dialogs to broadcast
   * Original Lingo: checkForNewDialog(me)
   * 
   * Checks:
   * - Player level >= mission level requirement
   * - ChkMission completed (if any)
   * - GiveMission not already completed or given
   * - Dialog not already in queue
   */
  checkForNewDialog () {
    if (!this.okToReport) return
    
    const user = this.game.mulle.user
    if (!user) return
    
    // Get current player level
    const tmpLevel = user.getSeaLevel ? user.getSeaLevel() : 1
    
    const tmpParamList = []
    
    // Check each mission parameter
    for (let i = 0; i < this.parameterList.length; i++) {
      const tmpDialogParam = { ...this.parameterList[i] }
      
      // Check level requirement
      if (tmpLevel >= tmpDialogParam.level) {
        const tmpChkMission = tmpDialogParam.ChkMission
        
        // Check prerequisite mission (if any)
        if (tmpChkMission === 0 || user.isMissionCompleted(tmpChkMission) > 0) {
          const tmpGiveMission = tmpDialogParam.GiveMission
          
          // Check if mission already completed or given
          const completed = user.isMissionCompleted(tmpGiveMission) > 0
          const given = user.isMissionGiven(tmpGiveMission)
          
          if (!completed && !given) {
            // Check if not already in dialog list
            if (this.getInDialogList(tmpDialogParam.ID) === 0) {
              // Add intro jingle to dialog
              const tmpDialog = [...tmpDialogParam.dialog]
              tmpDialog.unshift(this.dialogStartList[Math.floor(Math.random() * this.dialogStartList.length)])
              tmpDialogParam.dialog = tmpDialog
              
              tmpParamList.push(tmpDialogParam)
            }
          }
        }
      }
    }
    
    // Add random mission from eligible list
    const tmpCount = tmpParamList.length
    if (tmpCount > 0) {
      const chosen = tmpParamList[Math.floor(Math.random() * tmpCount)]
      this.DialogList.push(chosen)
      
      console.log('[RadioHandler] New mission broadcast queued:', chosen.GiveMission, 'ID:', chosen.ID)
    }
  }

  /**
   * Update loop - called regularly to check for broadcasts
   * Original Lingo: loop(me)
   * 
   * Broadcasts queued dialogs and gives missions when appropriate
   */
  loop () {
    if (!this.active) return
    
    // Check if it's time to broadcast (loopCounter reached 0 or got weather report)
    if (this.loopCounter === 0 || this.gotWeatherReport) {
      // Reset loop counter
      this.loopCounter = 720 + Math.floor(Math.random() * 2160)
      
      if (this.reportObject) {
        // Check for new mission dialogs
        this.checkForNewDialog()
        
        // Process dialog queue
        if (this.DialogList.length > 0) {
          const tmpDialog = this.DialogList[0]
          
          // Call radioReport on report object
          if (typeof this.reportObject.radioReport === 'function') {
            this.okToReport = this.reportObject.radioReport(tmpDialog.dialog)
            
            if (this.okToReport) {
              this.gotWeatherReport = false
              
              // Give mission if specified
              const tmpGiveMission = tmpDialog.GiveMission
              if (tmpGiveMission !== undefined && tmpGiveMission !== null) {
                this.game.mulle.user.addGivenMission(tmpGiveMission)
                console.log('[RadioHandler] Mission given via broadcast:', tmpGiveMission)
              }
              
              // Remove from queue
              this.DialogList.shift()
            }
          } else {
            // No radioReport method, just remove from queue
            this.DialogList.shift()
          }
        }
      }
    } else {
      // Decrement loop counter
      this.loopCounter--
    }
  }

  /**
   * Destroy handler
   * Original Lingo: kill(me)
   */
  kill () {
    this.DialogList = []
    this.dialogStartList = []
    this.loopCounter = 0
    this.active = false
    this.passWeather = false
    this.reportObject = null
    
    console.log('[RadioHandler] Destroyed')
  }
}

export default RadioHandler
