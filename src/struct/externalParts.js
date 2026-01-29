'use strict'

/**
 * ExternalParts - Handles postal gift parts system
 * Based on Lingo's externalParts handler and checKPostal() function
 * 
 * The postal system gives players random parts they don't own yet.
 * Parts are tracked in PostalHistory to avoid offering the same part twice.
 */
class ExternalParts {
  constructor (game) {
    this.game = game
    
    // Postal parts catalog - subset of parts that can be sent via post
    // These are special/rare parts not in regular junk piles
    // Based on original game's JunkMan category (parts Figge can bring)
    this.postalParts = [
      // Special body parts
      13, 20, 17, 89,
      // Rare accessories
      120, 18, 19, 173, 21,
      // Engine parts
      297, 22, 24, 25, 185,
      // Wheels
      26, 27, 28, 32, 35,
      // Misc rare parts
      91, 132, 129, 134, 137,
      146, 149, 154, 168, 216,
      174, 175, 177, 189, 191,
      192, 193, 233, 199, 208,
      209, 212, 221, 227, 229,
      235, 251, 264, 278, 294,
      295, 14
    ]
  }

  /**
   * Calculate all postal parts the user doesn't own yet
   * @param {string} category - Part category (unused for now, kept for API compatibility)
   * @returns {number[]} Array of part IDs user doesn't have
   */
  calcCurrentlyAvailable (category) {
    const user = this.game.mulle.user
    return this.postalParts.filter(partId => !user.hasPart(partId))
  }

  /**
   * Get 1-3 random parts that haven't been offered via postal yet
   * @param {string} category - Part category (unused for now)
   * @returns {number[]} Array of 1-3 part IDs to gift
   */
  getCurrentlyAvailable (category) {
    const user = this.game.mulle.user
    const available = this.calcCurrentlyAvailable(category)
    
    // Filter out parts already in PostalHistory (already offered before)
    const notOffered = available.filter(id => 
      user.PostalHistory.indexOf(id) === -1
    )
    
    if (notOffered.length === 0) {
      console.debug('[externalParts] No new postal parts available')
      return []
    }
    
    // Pick 1-3 random parts
    const count = Math.min(3, notOffered.length)
    const selected = []
    const tempPool = [...notOffered] // Copy to avoid modifying original
    
    for (let i = 0; i < count; i++) {
      const randomIndex = Math.floor(Math.random() * tempPool.length)
      selected.push(tempPool[randomIndex])
      tempPool.splice(randomIndex, 1)
    }
    
    console.debug('[externalParts] Selected postal gifts:', selected)
    return selected
  }
}

export default ExternalParts
