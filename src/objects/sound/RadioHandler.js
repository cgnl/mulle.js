/**
 * @fileoverview RadioHandler - Radio/mission dialog handler
 * Based on: ParentScript 47 - RadioHandler.ls
 * 
 * RadioHandler manages radio broadcasts including weather reports
 * and mission dialogs based on game progression level.
 */

/**
 * RadioHandler class - manages radio broadcasts and mission dialogs
 * 
 * Lingo properties:
 *   reportObject, DialogList, dialogStartList, loopCounter, active,
 *   passWeather, parameterList, okToReport, gotWeatherReport
 */
class RadioHandler {
  /**
   * Create a new RadioHandler
   * Lingo: on new me
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   */
  constructor(globals) {
    this.globals = globals;
    
    // Dialog queue
    // Lingo: set DialogList to []
    this.DialogList = [];
    
    // Radio start dialog options
    // Lingo: set dialogStartList to ["00d074v0", "00d075v0", ...]
    this.dialogStartList = ['00d074v0', '00d075v0', '00d076v0', '00d077v0', '00d078v0', '00d079v0'];
    
    // Loop counter for timing broadcasts
    // Lingo: set loopCounter to 720 + random(2160)
    this.loopCounter = 720 + Math.floor(Math.random() * 2160);
    
    // Active state
    // Lingo: set active to 0
    this.active = false;
    
    // Weather pass-through flag
    // Lingo: set passWeather to 1
    this.passWeather = true;
    
    // Mission parameters
    // Lingo: set parameterList to [[#ID: 1, #level: 1, ...], ...]
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
    ];
    
    // Report flags
    // Lingo: set okToReport to 1
    this.okToReport = true;
    
    // Lingo: set gotWeatherReport to 0
    this.gotWeatherReport = false;
    
    // Report object
    this.reportObject = null;
    
    // Register for weather reports
    // Lingo: reportWeatherToMe(the weather of gMulleGlobals, me)
    if (globals.weather) {
      globals.weather.reportWeatherToMe(this);
    }
    
    // Add to loop master
    // Lingo: addObject(the loopMaster of gMulleGlobals, me)
    if (globals.loopMaster) {
      globals.loopMaster.addObject(this);
    }
  }

  /**
   * Clean up
   * Lingo: on kill me
   * 
   * @returns {null} Always returns null
   */
  kill() {
    this.DialogList = null;
    this.dialogStartList = null;
    this.loopCounter = 0;
    this.active = false;
    this.passWeather = false;
    this.reportObject = null;
    
    // Remove from loop master
    if (this.globals.loopMaster) {
      this.globals.loopMaster.deleteObject(this);
    }
    
    return null;
  }

  /**
   * Start reporting radio to an object
   * Lingo: on startreportRadioToMe me, argObj, argPassWeather
   * 
   * @param {Object} obj - Object to report to
   * @param {boolean} [passWeather=true] - Whether to pass weather reports
   */
  startReportRadioToMe(obj, passWeather = true) {
    if (obj) {
      this.reportObject = obj;
      this.setActive(true);
      this.passWeather = passWeather;
      this.gotWeatherReport = false;
    }
  }

  /**
   * Lingo alias: on startreportRadioToMe me, argObj, argPassWeather
   * Preserve original casing for parity.
   */
  startreportRadioToMe(obj, passWeather = true) {
    return this.startReportRadioToMe(obj, passWeather)
  }

  /**
   * Stop reporting radio to an object
   * Lingo: on stopReportRadioToMe me, argObj
   * 
   * @param {Object} obj - Object to stop reporting to
   */
  stopReportRadioToMe(obj) {
    if (this.reportObject === obj) {
      this.setActive(false);
      this.passWeather = false;
      this.gotWeatherReport = false;
      this.reportObject = null;
    }
  }

  /**
   * Set active state
   * Lingo: on setActive me, argStatus
   * 
   * @param {boolean} status - Active status
   */
  setActive(status) {
    this.active = status;
  }

  /**
   * Find dialog in list by ID
   * Lingo: on getInDialogList me, argID
   * 
   * @param {number} id - Dialog ID to find
   * @returns {number} Index (1-based) or 0 if not found
   */
  getInDialogList(id) {
    for (let i = 0; i < this.DialogList.length; i++) {
      if (this.DialogList[i].ID === id) {
        return i + 1; // 1-based index like Lingo
      }
    }
    return 0;
  }

  /**
   * Handle weather report
   * Lingo: on weatherReport me, argWeather
   * 
   * @param {Object} weather - Weather data {TimeLeft, direction, speed, type}
   */
  weatherReport(weather) {
    if (weather.TimeLeft > 0) {
      // Build weather dialog
      const tmpList = [this._randomFrom(this.dialogStartList)];
      tmpList.push('00d056v0'); // Weather intro
      
      // Direction dialog
      const directionDialogs = {
        2: '00d044v0',   // N
        4: '00d042v0',   // W
        6: '00d045v0',   // S
        8: '00d041v0',   // E
        10: '00d046v0',  // NW
        12: '00d043v0',  // SW
        14: '00d048v0',  // SE
        16: '00d039v0'   // NE
      };
      if (directionDialogs[weather.direction]) {
        tmpList.push(directionDialogs[weather.direction]);
      }
      
      // Speed dialog
      const speedDialogs = {
        0: '00d049v0',
        1: '00d072v0',
        2: '00d050v0',
        3: '00d051v0'
      };
      if (speedDialogs[weather.speed] !== undefined) {
        tmpList.push(speedDialogs[weather.speed]);
      }
      
      // Type dialog
      const typeDialogs = {
        1: '00d053v0',
        2: '00d073v0',
        3: '00d055v0',
        4: '00d054v0'
      };
      if (typeDialogs[weather.type]) {
        tmpList.push(typeDialogs[weather.type]);
      }
      
      // Bye dialog
      const byeList = ['00d067v0', '00d069v0', '00d071v0'];
      tmpList.push(this._randomFrom(byeList));
      
      // Add or update in dialog list
      const existingIdx = this.getInDialogList(0);
      if (existingIdx > 0) {
        this.DialogList[existingIdx - 1] = { ID: 0, dialog: tmpList };
      } else {
        this.DialogList.unshift({ ID: 0, dialog: tmpList });
      }
      
      this.gotWeatherReport = true;
    }
    
    // Pass weather to report object if enabled
    if (this.passWeather && this.reportObject && this.reportObject.weatherReport) {
      this.reportObject.weatherReport(weather);
    }
  }

  /**
   * Check for new mission dialogs
   * Lingo: on checkForNewDialog me
   */
  checkForNewDialog() {
    if (!this.okToReport) {
      return;
    }
    
    const currentLevel = this.globals.levelHandler.getLevel();
    const availableDialogs = [];
    
    for (const param of this.parameterList) {
      if (currentLevel >= param.level) {
        // Check mission prerequisite
        const chkMission = param.ChkMission;
        if (chkMission === 0 || this.globals.user.isMissionCompleted(chkMission)) {
          // Check if mission not already given or completed
          const giveMission = param.GiveMission;
          if (!this.globals.user.isMissionCompleted(giveMission) && 
              !this.globals.user.isMissionGiven(giveMission)) {
            // Check not already in dialog list
            if (this.getInDialogList(param.ID) === 0) {
              // Add start dialog
              const dialogCopy = { ...param };
              dialogCopy.dialog = [this._randomFrom(this.dialogStartList), ...param.dialog];
              availableDialogs.push(dialogCopy);
            }
          }
        }
      }
    }
    
    // Add random available dialog
    if (availableDialogs.length > 0) {
      this.DialogList.push(this._randomFrom(availableDialogs));
    }
  }

  /**
   * Loop callback
   * Lingo: on loop me
   */
  loop() {
    if (!this.active) {
      return;
    }
    
    if (this.loopCounter === 0 || this.gotWeatherReport) {
      // Reset counter
      this.loopCounter = 720 + Math.floor(Math.random() * 2160);
      
      if (this.reportObject) {
        this.checkForNewDialog();
        
        if (this.DialogList.length > 0) {
          const dialog = this.DialogList[0];
          this.okToReport = this.reportObject.radioReport(dialog.dialog);
          
          if (this.okToReport) {
            this.gotWeatherReport = false;
            
            // Give mission
            if (dialog.GiveMission !== undefined) {
              this.globals.user.addGivenMission(dialog.GiveMission);
            }
            
            // Remove from list
            this.DialogList.shift();
          }
        }
      }
    } else {
      this.loopCounter--;
    }
  }

  /**
   * Get random item from array
   * @private
   * 
   * @param {Array} arr - Array to pick from
   * @returns {*} Random item
   */
  _randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
}

module.exports = RadioHandler;
