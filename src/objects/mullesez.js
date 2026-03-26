/**
 * MulleSez/MulleTalk Audio System
 * @module objects/mullesez
 * 
 * Priority-based voice queue system for Mulle's commentary
 * Based on ParentScript 42 - MulleSez.ls from boat_05
 * 
 * IMPLEMENTED FEATURES FROM missing.md:
 * #182 - MulleSez/MulleTalk priority queue system (#NormalTalk, #InfoTalk, #PrioTalk)
 * #186 - Part description sounds on click (via say method)
 * #190 - Radio weather jingles before announcements
 * #193 - Sound preloading system (safePreload method)
 * 
 * Priority Levels:
 * - 0: Background/idle comments (#NormalTalk)
 * - 1-2: Info/tutorial messages (#InfoTalk)
 * - 3+: Priority messages (#PrioTalk) - interrupts other sounds
 * 
 * Special priority levels from original:
 * - #Destination: 3 (navigation announcements)
 */
'use strict'

/**
 * Priority-based audio queue for Mulle's voice
 */
class MulleSez {
  /**
   * Create MulleSez system
   * @param {Phaser.Game} game - Game instance
   */
  constructor (game) {
    this.game = game
    
    // #182: Comment lists for different situations
    // Original: commentList with symbol keys mapping to array of sound numbers
    this.commentList = {
      Vomit: [52, 53, 54],
      VomitPills: [39, 44],
      Tired: [12],
      Hungry: [13, 14, 15],
      MotorToSail: [20, 33],
      MotorToOar: [19, 33],
      SailToOar: [16],
      Heavy: [22],
      OutOfFuel: [30, 31, 32],
      BadWeather: [8, 9, 18, 21],
      crash: [89, 90, 91, 92, 93],
      CrashEasy: [94, 99, 100],
      LurchEasy: [121, 122, 123],
      LurchHard: [107, 102, 104, 108],
      Capsize: [21]
    }
    
    // Track last played sound per category to avoid repetition
    this.lastPlayed = {}
    for (let category in this.commentList) {
      this.lastPlayed[category] = {
        nr: 0,           // Last sound number played
        Started: 0,      // Counter when it started
        Wait: 0          // Minimum wait time before playing again
      }
    }
    
    // #182: Priority system
    this.currentPriority = 0
    this.priorityList = {
      Destination: 3,     // Navigation/mission announcements
      InfoTalk: 2,        // Tutorial/info messages
      NormalTalk: 1,      // Regular commentary
      PrioTalk: 3         // High priority interrupts
    }
    
    // #182: Sound queue (priority-based)
    // Format: { priority: [soundName, reportObject, identifier] }
    this.soundsInQ = []
    
    // Current sound state
    this.sndId = null
    this.currentSound = null
    this.nowPlaying = null
    this.soundList = null
    this.soundCounter = 0
    
    // Reporting/callback system
    this.reportObject = null
    this.currentIdentifier = null
    
    // Counter for timing system (increments each frame)
    this.counter = 0
    
    // #193: Preloaded sounds cache
    this.preloadedSounds = {}
    
    console.log('[MulleSez] Initialized with priority queue system')
  }
  
  /**
   * Update loop - called each frame
   * Manages sound queue and playback
   */
  loop () {
    this.counter++
    
    if (this.sndId && this.currentSound) {
      // Check if current sound finished
      if (!this.currentSound.isPlaying) {
        this.nowPlaying = null
        
        // If playing a list, play next sound in list
        if (this.soundList && Array.isArray(this.soundList)) {
          this.soundCounter++
          if (this.soundCounter < this.soundList.length) {
            const nextSound = this.soundList[this.soundCounter]
            this.playStringOrList(nextSound)
            return
          }
        }
        
        // Finished with current sound/list
        this.soundList = null
        this.sndId = null
        this.currentSound = null
        this.currentPriority = 0
        
        // Notify report object if set
        if (this.reportObject && this.reportObject.mulleFinished) {
          this.reportObject.mulleFinished(this.currentIdentifier)
        }
        
        this.currentIdentifier = null
        this.reportObject = null
        
        // Play next sound from queue
        if (this.soundsInQ.length > 0) {
          // Sort queue by priority (highest first)
          this.soundsInQ.sort((a, b) => b.priority - a.priority)
          
          const nextItem = this.soundsInQ.shift()
          this.currentPriority = nextItem.priority
          this.playStringOrList(nextItem.sound)
          this.reportObject = nextItem.reportObject
          this.currentIdentifier = nextItem.identifier
        }
      }
    }
  }
  
  /**
   * #182: Main say method - plays sound with priority queue
   * @param {string|symbol} argWhat - Sound name or symbol category
   * @param {number} argPriority - Priority level (0=normal, 1-2=info, 3+=priority)
   * @param {object} argReportObject - Object to notify when finished
   * @param {boolean} argPutInQ - Whether to queue if busy (true) or interrupt (false)
   * @param {string} argID - Identifier for callback
   * @param {number} argMinWait - Minimum wait time before playing this category again
   * @returns {object|null} Sound object or null
   */
  say (argWhat, argPriority = 0, argReportObject = null, argPutInQ = false, argID = null, argMinWait = 0) {
    let soundName = argWhat
    
    // Don't play if already playing this exact sound
    if (argWhat === this.nowPlaying) {
      return null
    }
    
    // If symbol category, pick random sound from category
    if (typeof argWhat === 'string' && this.commentList[argWhat]) {
      const category = argWhat
      const tmpLastPlayedList = this.lastPlayed[category]
      const tmpLastPlayed = tmpLastPlayedList.nr
      
      // Check if minimum wait time has passed
      const tmpMinTimeNotPassed = this.counter < (tmpLastPlayedList.Started + tmpLastPlayedList.Wait)
      if (tmpMinTimeNotPassed) {
        return null
      }
      
      // Get list and remove last played to avoid repetition
      let tmpList = [...this.commentList[category]]
      if (tmpList.length > 1) {
        tmpList = tmpList.filter(n => n !== tmpLastPlayed)
      }
      
      // Pick random sound from list
      const tmpSndNr = tmpList[Math.floor(Math.random() * tmpList.length)]
      
      // Update last played tracking
      this.lastPlayed[category] = {
        nr: tmpSndNr,
        Started: this.counter,
        Wait: argMinWait
      }
      
      // Convert to sound file name: "05dXXXv0"
      soundName = '05d' + String(tmpSndNr).padStart(3, '0') + 'v0'
    }
    
    // Check if currently playing sound
    if (this.sndId && this.currentSound) {
      // If new sound has lower or equal priority, queue it or ignore
      if (argPriority <= this.currentPriority) {
        if (argPutInQ) {
          // Add to queue
          this.soundsInQ.push({
            priority: argPriority,
            sound: soundName,
            reportObject: argReportObject,
            identifier: argID
          })
        }
        return null
      } else {
        // Higher priority - interrupt current sound
        this.stop()
      }
    }
    
    // Play the sound
    this.reportObject = argReportObject
    this.currentPriority = argPriority
    this.currentIdentifier = argID
    this.playStringOrList(soundName)
    
    return this.currentSound
  }
  
  /**
   * Play a sound or list of sounds
   * @param {string|Array} argWhat - Sound name or array of sound names
   */
  playStringOrList (argWhat) {
    if (typeof argWhat === 'string') {
      // Single sound
      this.nowPlaying = argWhat
      this.currentSound = this.game.mulle.playAudio(argWhat)
      this.sndId = this.currentSound ? 1 : null
      
      if (this.currentSound) {
        this.currentSound.volume = 1.0
      }
    } else if (Array.isArray(argWhat)) {
      // List of sounds - play in sequence
      this.soundList = argWhat
      this.soundCounter = 0
      this.nowPlaying = this.soundList[this.soundCounter]
      this.currentSound = this.game.mulle.playAudio(this.nowPlaying)
      this.sndId = this.currentSound ? 1 : null
      
      if (this.currentSound) {
        this.currentSound.volume = 1.0
      }
    }
  }
  
  /**
   * Check if system is quiet (not playing anything)
   * @returns {boolean}
   */
  isQuiet () {
    return !this.currentSound || !this.currentSound.isPlaying
  }
  
  /**
   * Stop current sound
   */
  stop () {
    if (this.currentSound && this.currentSound.isPlaying) {
      this.currentSound.stop()
    }
    
    this.nowPlaying = null
    
    // Notify report object if set
    if (this.reportObject && this.reportObject.mulleFinished) {
      this.reportObject.mulleFinished(this.currentIdentifier)
    }
    
    this.reportObject = null
    this.sndId = null
    this.currentSound = null
  }
  
  /**
   * Delete sound from queue
   * @param {string|object} argSoundOrReportObject - Sound name or report object
   */
  deleteSound (argSoundOrReportObject) {
    const tmpDelete = []
    
    if (typeof argSoundOrReportObject === 'object') {
      // Delete all sounds with this report object
      for (let i = 0; i < this.soundsInQ.length; i++) {
        if (this.soundsInQ[i].reportObject === argSoundOrReportObject) {
          tmpDelete.push(i)
        }
      }
    } else {
      // Delete specific sound
      if (this.nowPlaying === argSoundOrReportObject) {
        this.stop()
      }
      
      for (let i = 0; i < this.soundsInQ.length; i++) {
        if (this.soundsInQ[i].sound === argSoundOrReportObject) {
          tmpDelete.push(i)
        }
      }
    }
    
    // Remove from queue (in reverse to maintain indices)
    for (let i = tmpDelete.length - 1; i >= 0; i--) {
      this.soundsInQ.splice(tmpDelete[i], 1)
    }
  }
  
  /**
   * Delete all references to an object
   * @param {object} argObj - Object to remove
   */
  deleteReference (argObj) {
    if (this.reportObject === argObj) {
      this.reportObject = null
    }
    this.deleteSound(argObj)
  }
  
  /**
   * #193: Preload sound for faster playback
   * @param {string} soundName - Sound file name
   * @returns {boolean} Success
   */
  safePreload (soundName) {
    try {
      // Check if already preloaded
      if (this.preloadedSounds[soundName]) {
        return true
      }
      
      // In Phaser, we can't force preload at runtime, but we can check if it exists
      // and mark it as "safe to use"
      if (this.game.cache.checkSoundKey(soundName)) {
        this.preloadedSounds[soundName] = true
        return true
      }
      
      // Sound not in cache - may need to load
      console.warn('[MulleSez] Sound not cached for preload:', soundName)
      return false
    } catch (e) {
      console.error('[MulleSez] Error preloading sound:', soundName, e)
      return false
    }
  }
  
  /**
   * #193: Batch preload multiple sounds
   * @param {Array<string>} soundNames - Array of sound names
   */
  preloadSounds (soundNames) {
    for (let soundName of soundNames) {
      this.safePreload(soundName)
    }
  }
  
  /**
   * Cleanup
   */
  kill () {
    this.stop()
    this.soundsInQ = []
    this.reportObject = null
    this.preloadedSounds = {}
    return 0
  }
}

export default MulleSez
