/**
 * Sea Medal System voor de boten game
 * 
 * Gebaseerd op originele Lingo data:
 * - Medal teksten: boten_08.DXR/Internal/81-86.txt
 * - SetWhenDone:[#Medals:[2]] uit Racing object (1989.txt)
 * - Boat data structuur: #Boat: [#Parts: [], #Name: "", #Medals: []]
 * 
 * Medals worden opgeslagen in MulleBoat.Medals array (zie boatdata.js)
 * 
 * @module struct/medals
 */

/**
 * Sea Medal definities
 * 
 * Bronnen:
 * - Medal namen: boten_08.DXR/Internal/81-86.txt
 * - Racing medal trigger: boten_CDDATA.CXT/Standalone/1989.txt
 *   SetWhenDone:[#Medals:[2], #Missions:[16]]
 * 
 * Medal ID's komen overeen met de bestandsnamen in boten_08.DXR:
 * 81.txt = Medal 1 (Lange-afstands-medaille)
 * 82.txt = Medal 2 (Snelheids-medaille)
 * etc.
 */
const SEA_MEDALS = {
  1: {
    id: 1,
    // Uit boten_08.DXR/Internal/81.txt: "Lange-afstands-medaille"
    name: 'Lange-afstands-medaille',
    description: 'Bereik Sven\'s grot (Destination 86)',
    trigger: 'reach_sven',
    // Geen SetWhenDone in object data gevonden, handmatig toe te kennen in cave.js
    // Dest 26 (1974.txt) gaat naar scene 86, CheckFor:[#BoatProp:[#Compass]]
    scene: 'cave'
  },
  2: {
    id: 2,
    // Uit boten_08.DXR/Internal/82.txt: "Snelheids- medaille"
    name: 'Snelheids-medaille',
    description: 'Win de bootrace',
    trigger: 'win_race',
    // Uit 1989.txt: SetWhenDone:[#Medals:[2], #Missions:[16]]
    // Object 2, #CustomObject:"Racing"
    scene: 'racing'
  },
  3: {
    id: 3,
    // Uit boten_08.DXR/Internal/83.txt: "Vrachtschip-medaille"
    name: 'Vrachtschip-medaille',
    description: 'Lever rotte vis af bij de visser',
    trigger: 'deliver_rottenfish',
    // Dest 19 (1968.txt): checkFor:[#inventory:[#RottenFish]]
    scene: 'fisherman'
  },
  4: {
    id: 4,
    // Uit boten_08.DXR/Internal/84.txt: "Meest-blitse-boot-medaille"
    name: 'Meest-blitse-boot-medaille',
    description: 'Haal 5 of meer punten bij de bootshow',
    trigger: 'showboat_5points',
    // Dest 16 (1965.txt) gaat naar scene 76 (showboat)
    scene: 'showboat'
  },
  5: {
    id: 5,
    // Uit boten_08.DXR/Internal/85.txt: "Duik- medaille"
    name: 'Duik-medaille',
    description: 'Duik in Wrakbaai',
    trigger: 'dive_wrakbaai',
    // Dest 27 (1975.txt) gaat naar scene 87 (diving)
    scene: 'diving'
  },
  6: {
    id: 6,
    // Uit boten_08.DXR/Internal/86.txt: "Luxe-  medaille"
    name: 'Luxe-medaille',
    description: 'Geef de prinses een luxe boottocht',
    trigger: 'princess_tour',
    // Via Birgit (scene 77), requires LuxuryFactor check
    scene: 'birgit'
  }
}

/**
 * Sea Medal Manager
 * Beheert het toekennen en ophalen van medailles
 * 
 * Medailles worden opgeslagen in MulleBoat.Medals (zie boatdata.js)
 * De boatdata.js heeft al hasMedal() en addMedal() methodes
 */
class MulleSeaMedals {
  /**
   * @param {Phaser.Game} game - Phaser game instance
   */
  constructor (game) {
    this.game = game
  }

  /**
   * Award medal to player's boat
   * Originele Lingo: SetWhenDone:[#Medals:[2]]
   * 
   * @param {number} medalId - Medal ID (1-6)
   * @returns {boolean} True if newly awarded, false if already had or error
   */
  awardMedal (medalId) {
    const user = this.game.mulle.user
    if (!user || !user.Boat) {
      console.warn('[SeaMedals] No user or boat to award medal to')
      return false
    }

    // MulleBoat.hasMedal() en addMedal() zijn al gedefinieerd in boatdata.js
    if (user.Boat.hasMedal(medalId)) {
      console.log('[SeaMedals] Already has medal:', medalId)
      return false
    }

    user.Boat.addMedal(medalId)
    user.save()

    const medalInfo = SEA_MEDALS[medalId]
    if (medalInfo) {
      console.log('[SeaMedals] Awarded:', medalInfo.name)
    } else {
      console.log('[SeaMedals] Awarded medal ID:', medalId)
    }

    // TODO: Play medal award animation/sound
    // Mogelijk 08d00Xv0 audio bestanden

    return true
  }

  /**
   * Check if player has medal
   * 
   * @param {number} medalId - Medal ID (1-6)
   * @returns {boolean}
   */
  hasMedal (medalId) {
    const user = this.game.mulle.user
    if (!user || !user.Boat) return false
    return user.Boat.hasMedal(medalId)
  }

  /**
   * Get all earned medal IDs
   * @returns {number[]} Array of medal IDs
   */
  getMedals () {
    const user = this.game.mulle.user
    if (!user || !user.Boat) return []
    return user.Boat.Medals || []
  }

  /**
   * Get number of medals earned
   * @returns {number}
   */
  getMedalCount () {
    return this.getMedals().length
  }

  /**
   * Get medal info/definition
   * @param {number} medalId - Medal ID (1-6)
   * @returns {Object|null} Medal info or null
   */
  getMedalInfo (medalId) {
    return SEA_MEDALS[medalId] || null
  }

  /**
   * Get all medal definitions
   * @returns {Object} All SEA_MEDALS
   */
  getAllMedalInfo () {
    return SEA_MEDALS
  }

  /**
   * Get info for all earned medals
   * @returns {Object[]} Array of medal info objects
   */
  getEarnedMedalInfo () {
    const earned = this.getMedals()
    return earned.map(id => this.getMedalInfo(id)).filter(m => m !== null)
  }

  /**
   * Award medal by trigger name
   * Handig voor gebruik in scenes
   * 
   * @param {string} triggerName - Trigger name (e.g., 'reach_sven', 'win_race')
   * @returns {boolean} True if medal was awarded
   */
  checkTrigger (triggerName) {
    for (const id in SEA_MEDALS) {
      const medal = SEA_MEDALS[id]
      if (medal.trigger === triggerName) {
        return this.awardMedal(parseInt(id))
      }
    }
    console.log('[SeaMedals] Unknown trigger:', triggerName)
    return false
  }

  /**
   * Get medal ID for a trigger
   * @param {string} triggerName - Trigger name
   * @returns {number|null} Medal ID or null
   */
  getMedalIdForTrigger (triggerName) {
    for (const id in SEA_MEDALS) {
      if (SEA_MEDALS[id].trigger === triggerName) {
        return parseInt(id)
      }
    }
    return null
  }

  /**
   * Check if all medals are earned
   * @returns {boolean}
   */
  hasAllMedals () {
    const totalMedals = Object.keys(SEA_MEDALS).length
    return this.getMedalCount() >= totalMedals
  }
}

export { SEA_MEDALS }
export default MulleSeaMedals
