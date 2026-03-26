/**
 * @fileoverview KeyHandlers - Keyboard input handling
 * Based on: MovieScript 135 - KeyHandlers.ls
 * 
 * KeyHandlers manages keyboard input including system keys like
 * quit, help, and special commands.
 */

/**
 * KeyHandlers class - manages keyboard input
 * 
 * Handles system-level keyboard commands like quit, help, and mute.
 * Differentiates between Windows (machineType 256) and Mac platforms.
 */
class KeyHandlers {
  /**
   * Create a new KeyHandlers
   * 
   * @param {Object} globals - Global game state (gMulleGlobals)
   * @param {Object} system - System configuration (gSystem)
   */
  constructor(globals, system) {
    this.globals = globals;
    this.system = system;
    
    // Platform detection (256 = Windows in Director)
    // Default to Windows for web
    this.machineType = 256;
    
    // Fallback movie path
    this.moviePath = '';
  }

  /**
   * Handle keyDown event
   * Lingo: on keyDown
   * 
   * @param {Object} event - Key event {keyCode, key, optionDown, controlDown, commandDown}
   * @returns {Object} Action result
   */
  keyDown(event) {
    return this.systemKeys(event);
  }

  /**
   * Handle system keys
   * Lingo: on systemKeys
   * 
   * @param {Object} event - Key event
   * @returns {Object} Action result {action, helpFile?}
   */
  systemKeys(event) {
    const { keyCode, key, optionDown, controlDown, commandDown } = event;
    
    // F1 key (keyCode 122) - Help
    if (keyCode === 122) {
      return {
        action: 'help',
        helpFile: this.getHelpFilePath()
      };
    }
    
    // Platform-specific handling
    if (this.isWindows()) {
      // Windows: Option+Escape (keyCode 53) - Quit
      if (optionDown && keyCode === 53) {
        this._saveAndQuit();
        return { action: 'quit' };
      }
      
      // Windows: Ctrl+M - Mute toggle
      if (controlDown && key === 'm') {
        return { action: 'mute' };
      }
    } else {
      // Mac: Cmd+Q - Quit
      if (commandDown && key === 'q') {
        this._saveAndQuit();
        return { action: 'quit' };
      }
      
      // Mac: Help key (keyCode 114)
      if (keyCode === 114) {
        return {
          action: 'help',
          helpFile: this.getHelpFilePath()
        };
      }
      
      // Mac: Ctrl+M - Mute toggle
      if (controlDown && key === 'm') {
        return { action: 'mute' };
      }
    }
    
    return { action: 'none' };
  }

  /**
   * Get help file path
   * Lingo: set tmpFileName to the CDPath of gSystem & the helpFile of gSystem
   * 
   * @returns {string} Path to help file
   */
  getHelpFilePath() {
    if (this.system) {
      return this.system.CDPath + this.system.helpFile;
    }
    return this.moviePath + 'Mullebat.hlp';
  }

  /**
   * Save game and quit
   * Lingo: save(gMulleGlobals); stopMovie(); killall(); quit()
   * @private
   */
  _saveAndQuit() {
    if (this.globals && this.globals.save) {
      this.globals.save();
    }
    // stopMovie(), killall(), quit() would be handled by game engine
  }

  /**
   * Check if running on Windows
   * Lingo: the machineType = 256
   * 
   * @returns {boolean} True if Windows
   */
  isWindows() {
    return this.machineType === 256;
  }

  /**
   * Check if running on Mac
   * 
   * @returns {boolean} True if Mac
   */
  isMac() {
    return this.machineType !== 256;
  }
}

module.exports = KeyHandlers;
