/**
 * Mission system helper
 * Handles mission delivery via telephone and mail
 */

class MulleMissions {
  constructor (game) {
    this.game = game
    this.missions = null
  }

  /**
   * Load missions data
   */
  load () {
    if (!this.missions) {
      this.missions = this.game.cache.getJSON('MissionsDB')
    }
    return this.missions
  }

  /**
   * Get the next pending mission (not yet given and not completed)
   * @returns {Object|null} Mission object or null
   */
  getNextMission () {
    this.load()
    
    const user = this.game.mulle.user
    
    for (const missionId in this.missions) {
      const mission = this.missions[missionId]
      
      // Skip if already given or completed
      if (user.givenMissions.indexOf(parseInt(missionId)) !== -1) continue
      if (user.CompletedMissions.indexOf(parseInt(missionId)) !== -1) continue
      
      return {
        id: parseInt(missionId),
        ...mission
      }
    }
    
    return null
  }

  /**
   * Check if there's a pending telephone mission
   * @returns {Object|null} Mission object or null
   */
  getPendingTelephoneMission () {
    this.load()
    
    const user = this.game.mulle.user
    
    for (const missionId in this.missions) {
      const mission = this.missions[missionId]
      
      // Skip if already given or completed
      if (user.givenMissions.indexOf(parseInt(missionId)) !== -1) continue
      if (user.CompletedMissions.indexOf(parseInt(missionId)) !== -1) continue
      
      // Only telephone missions
      if (mission.type === '#Telephone') {
        return {
          id: parseInt(missionId),
          ...mission
        }
      }
    }
    
    return null
  }

  /**
   * Check if there's a pending mail mission
   * @returns {Object|null} Mission object or null
   */
  getPendingMailMission () {
    this.load()
    
    const user = this.game.mulle.user
    
    for (const missionId in this.missions) {
      const mission = this.missions[missionId]
      
      // Skip if already given or completed
      if (user.givenMissions.indexOf(parseInt(missionId)) !== -1) continue
      if (user.CompletedMissions.indexOf(parseInt(missionId)) !== -1) continue
      
      // Only mail missions
      if (mission.type === '#Mail') {
        return {
          id: parseInt(missionId),
          ...mission
        }
      }
    }
    
    return null
  }

  /**
   * Mark a mission as given (player has received it)
   * @param {number} missionId
   */
  markAsGiven (missionId) {
    const user = this.game.mulle.user
    
    if (user.givenMissions.indexOf(missionId) === -1) {
      user.givenMissions.push(missionId)
      user.save()
    }
  }

  /**
   * Mark a mission as completed
   * @param {number} missionId
   */
  markAsCompleted (missionId) {
    const user = this.game.mulle.user
    
    if (user.CompletedMissions.indexOf(missionId) === -1) {
      user.CompletedMissions.push(missionId)
      user.save()
    }
  }

  /**
   * Check if a specific mission is completed
   * @param {number} missionId
   * @returns {boolean}
   */
  isCompleted (missionId) {
    return this.game.mulle.user.CompletedMissions.indexOf(missionId) !== -1
  }

  /**
   * Check if a specific mission has been given
   * @param {number} missionId
   * @returns {boolean}
   */
  isGiven (missionId) {
    return this.game.mulle.user.givenMissions.indexOf(missionId) !== -1
  }
}

export default MulleMissions
