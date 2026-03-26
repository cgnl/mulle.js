/**
 * MusicPlayer - Background music management system
 * @module objects/musicplayer
 * 
 * BUG FIX #11: Implements background music system that was missing
 * 
 * Manages background music playback with proper volume control,
 * fading, and playlist management similar to Director's sound channels.
 * 
 * Features:
 * - Background music looping
 * - Volume control with Director scale conversion (0-255 -> 0-1)
 * - Fade in/out transitions
 * - Music track switching
 */
'use strict'

/**
 * Background music player
 */
class MusicPlayer {
  /**
   * Create MusicPlayer
   * @param {Phaser.Game} game - Game instance
   */
  constructor (game) {
    this.game = game
    
    // Current music track
    this.currentTrack = null
    this.currentMusic = null
    
    // Volume (0-255 Director scale)
    this.volume = 128  // 50% volume
    
    // Fade state
    this.isFading = false
    this.fadeTimer = null
    this.fadeCallback = null
    
    // Music enabled flag
    this.enabled = true
    
    console.log('[MusicPlayer] Initialized')
  }
  
  /**
   * Play background music track
   * @param {string} trackId - Music track ID (Director member name)
   * @param {boolean} loop - Whether to loop the track (default: true)
   * @param {number} fadeInTime - Fade in duration in ms (default: 0)
   */
  play (trackId, loop = true, fadeInTime = 0) {
    if (!this.enabled) return
    
    // Stop current music if playing
    if (this.currentMusic) {
      this.stop()
    }
    
    // Play new track
    this.currentTrack = trackId
    this.currentMusic = this.game.mulle.playAudio(trackId)
    
    if (!this.currentMusic) {
      console.warn('[MusicPlayer] Could not play music:', trackId)
      return
    }
    
    this.currentMusic.loop = loop
    
    // BUG FIX #13: Convert Director volume (0-255) to Web Audio (0-1)
    const webAudioVolume = this.volume / 255
    
    if (fadeInTime > 0) {
      // Start at 0 and fade in
      this.currentMusic.volume = 0
      this.fadeTo(webAudioVolume, fadeInTime)
    } else {
      // Set volume immediately
      this.currentMusic.volume = webAudioVolume
    }
    
    console.log('[MusicPlayer] Playing:', trackId, 'Volume:', webAudioVolume)
  }
  
  /**
   * Stop current music
   * @param {number} fadeOutTime - Fade out duration in ms (default: 0)
   */
  stop (fadeOutTime = 0) {
    if (!this.currentMusic) return
    
    if (fadeOutTime > 0) {
      // Fade out then stop
      this.fadeTo(0, fadeOutTime, () => {
        if (this.currentMusic) {
          this.currentMusic.stop()
          this.currentMusic = null
          this.currentTrack = null
        }
      })
    } else {
      // Stop immediately
      this.currentMusic.stop()
      this.currentMusic = null
      this.currentTrack = null
    }
  }
  
  /**
   * Pause current music
   */
  pause () {
    if (this.currentMusic && this.currentMusic.isPlaying) {
      this.currentMusic.pause()
    }
  }
  
  /**
   * Resume paused music
   */
  resume () {
    if (this.currentMusic && this.currentMusic.paused) {
      this.currentMusic.resume()
    }
  }
  
  /**
   * Set volume (Director scale 0-255)
   * @param {number} volume - Volume level (0-255)
   */
  setVolume (volume) {
    this.volume = Math.max(0, Math.min(255, volume))
    
    if (this.currentMusic) {
      // BUG FIX #13: Convert Director volume (0-255) to Web Audio (0-1)
      this.currentMusic.volume = this.volume / 255
    }
  }
  
  /**
   * Fade to target volume
   * @param {number} targetVolume - Target volume (0-1 Web Audio scale)
   * @param {number} duration - Fade duration in ms
   * @param {function} callback - Optional callback when fade completes
   */
  fadeTo (targetVolume, duration, callback = null) {
    if (!this.currentMusic) return
    
    // Cancel existing fade
    if (this.fadeTimer) {
      this.game.time.events.remove(this.fadeTimer)
      this.fadeTimer = null
    }
    
    const startVolume = this.currentMusic.volume
    const volumeDiff = targetVolume - startVolume
    const startTime = this.game.time.now
    
    this.isFading = true
    this.fadeCallback = callback
    
    // Create fade timer
    this.fadeTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 60, () => {
      const elapsed = this.game.time.now - startTime
      const progress = Math.min(1, elapsed / duration)
      
      // Linear interpolation
      const newVolume = startVolume + (volumeDiff * progress)
      
      if (this.currentMusic) {
        this.currentMusic.volume = newVolume
      }
      
      // Check if fade complete
      if (progress >= 1) {
        this.game.time.events.remove(this.fadeTimer)
        this.fadeTimer = null
        this.isFading = false
        
        if (this.fadeCallback) {
          this.fadeCallback()
          this.fadeCallback = null
        }
      }
    }, this)
  }
  
  /**
   * Switch to new track with crossfade
   * BUG FIX #3.9: Crossfade gap - proper overlapping fade implementation
   * Original Director behavior: New track starts at half-fade point, overlapping
   * 
   * @param {string} trackId - New track ID
   * @param {number} fadeTime - Crossfade duration in ms (default: 1000)
   */
  crossfade (trackId, fadeTime = 1000) {
    if (this.currentTrack === trackId) return
    
    // Store reference to old track for fade out
    const oldMusic = this.currentMusic
    const oldTrack = this.currentTrack
    
    // Start new track immediately with fade in from 0
    this.currentTrack = trackId
    this.currentMusic = this.game.mulle.playAudio(trackId)
    
    if (!this.currentMusic) {
      console.warn('[MusicPlayer] Could not play music for crossfade:', trackId)
      // Keep old track if new one fails
      this.currentMusic = oldMusic
      this.currentTrack = oldTrack
      return
    }
    
    this.currentMusic.loop = true
    this.currentMusic.volume = 0 // Start at 0
    
    // Fade in new track
    const webAudioVolume = this.volume / 255
    this.fadeTo(webAudioVolume, fadeTime)
    
    // Fade out old track (if exists) simultaneously
    if (oldMusic) {
      const startVolume = oldMusic.volume
      const startTime = this.game.time.now
      
      // Create separate fade timer for old track
      const oldFadeTimer = this.game.time.events.loop(Phaser.Timer.SECOND / 60, () => {
        const elapsed = this.game.time.now - startTime
        const progress = Math.min(1, elapsed / fadeTime)
        
        // Linear interpolation from current volume to 0
        const newVolume = startVolume * (1 - progress)
        
        if (oldMusic) {
          oldMusic.volume = newVolume
        }
        
        // Check if fade complete
        if (progress >= 1) {
          this.game.time.events.remove(oldFadeTimer)
          if (oldMusic) {
            oldMusic.stop()
          }
        }
      }, this)
    }
    
    console.log('[MusicPlayer] Crossfading from', oldTrack, 'to', trackId, 'over', fadeTime, 'ms')
  }
  
  /**
   * Enable or disable music
   * @param {boolean} enabled - Whether music is enabled
   */
  setEnabled (enabled) {
    this.enabled = enabled
    
    if (!enabled && this.currentMusic) {
      this.stop()
    }
  }
  
  /**
   * Check if music is currently playing
   * @returns {boolean}
   */
  isPlaying () {
    return this.currentMusic && this.currentMusic.isPlaying
  }
  
  /**
   * Cleanup - stop music and clear state
   */
  cleanup () {
    if (this.fadeTimer) {
      this.game.time.events.remove(this.fadeTimer)
      this.fadeTimer = null
    }
    
    if (this.currentMusic) {
      this.currentMusic.stop()
      this.currentMusic = null
    }
    
    this.currentTrack = null
    this.isFading = false
    this.fadeCallback = null
    
    console.log('[MusicPlayer] Cleanup complete')
  }
  
  /**
   * Destroy player
   */
  destroy () {
    this.cleanup()
  }
}

export default MusicPlayer
