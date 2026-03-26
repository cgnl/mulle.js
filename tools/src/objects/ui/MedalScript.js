/**
 * MedalScript.js - Medal award display
 * Based on original Lingo: ParentScript 66 - MedalScript.ls
 *
 * Shows medal award animation when player earns a new medal.
 * Uses 3 sprite layers: background, medal image, foreground.
 *
 * Original Lingo properties:
 * - SP: base sprite channel
 * - sndId: sound effect ID
 */
'use strict'

// Medal member names for each medal ID (1-7)
const MEDAL_MEMBERS = [
  null, // Index 0 unused
  '00n003v0-1',
  '00n003v0-1',
  '00n003v0-1',
  '00n003v0-1',
  '00n003v0-1',
  '00n003v0-1',
  '00n003v0-1'
]

const DEFAULT_SOUND = '00e101v0'
const BACKGROUND_MEMBER = '33b019v0'
const FOREGROUND_MEMBER = '33b020v0'
const DISPLAY_POSITION = { x: 320, y: 202 }

export default class MedalScript {
  /**
   * Create medal display
   * Original: on new me, argMedalID, argSound
   *
   * @param {number} medalID - Medal ID (1-7)
   * @param {string} [sound] - Sound to play
   * @param {object} userBoat - User's boat object with medals array
   * @param {number} SP - Base sprite channel
   */
  constructor(medalID, sound, userBoat, SP) {
    this.medalID = medalID
    this.SP = SP
    this.active = true

    // Original: if getMedal(boat, argMedalID) then return 0
    if (userBoat.medals && userBoat.medals.includes(medalID)) {
      this.active = false
      return
    }

    // Original: addMedal(boat, argMedalID)
    if (!userBoat.medals) {
      userBoat.medals = []
    }
    userBoat.medals.push(medalID)

    // Original: if voidp(argSound) then set argSound to "00e101v0"
    this.sound = sound || DEFAULT_SOUND
  }

  /**
   * Get medal member name for ID
   * @param {number} medalID - Medal ID (1-7)
   * @returns {string} Member name
   */
  static getMedalMember(medalID) {
    return MEDAL_MEMBERS[medalID]
  }

  /**
   * Get display info for rendering
   * @returns {object|null} Sprite info or null if not active
   */
  getDisplayInfo() {
    if (!this.active) {
      return null
    }

    // Original:
    // set the member of sprite SP to member "33b019v0"
    // set the member of sprite (SP + 1) to member getAt(tmpMedals, argMedalID)
    // set the member of sprite (SP + 2) to member "33b020v0"
    return {
      sprites: [
        {
          SP: this.SP,
          member: BACKGROUND_MEMBER,
          loc: { ...DISPLAY_POSITION }
        },
        {
          SP: this.SP + 1,
          member: MedalScript.getMedalMember(this.medalID),
          loc: { ...DISPLAY_POSITION }
        },
        {
          SP: this.SP + 2,
          member: FOREGROUND_MEMBER,
          loc: { ...DISPLAY_POSITION }
        }
      ],
      sound: this.sound
    }
  }

  /**
   * Clean up
   * Original: on kill me
   *
   * @returns {null}
   */
  kill() {
    this.active = false
    return null
  }

  /**
   * Animation loop
   * Original: on loop me
   *
   * @param {boolean} soundFinished - Whether sound has finished playing
   * @returns {boolean} True if still active
   */
  loop(soundFinished) {
    // Original: if finished(gSound, sndId) then kill(me)
    if (soundFinished) {
      this.kill()
      return false
    }
    return true
  }

  /**
   * Called when Mulle speech finished
   * Original: on mulleFinished me
   */
  mulleFinished() {
    this.kill()
  }
}
