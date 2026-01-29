/**
 * MulleSeaMap class
 * @module struct/seamap
 * 
 * Individual sea map tile - equivalent of MulleMap for boats
 */

/**
 * Sea map tile definition
 */
class MulleSeaMap {
  constructor (game, id) {
    this.game = game

    this.MapId = id

    // Original data for reset
    this._data = {}

    // Map properties
    this.MapImage = null      // Background image name (e.g., '80b001v1')
    this.DirFile = 'boten_80.DXR'  // Director file for background
    this.Topology = null      // Topology image (if any, for collision)
    this.objects = []         // Objects/destinations on this tile

    // Sea-specific properties
    this.waveIntensity = 1    // How rough the water is (affects boat)
    this.currentDirection = 0 // Water current direction (0-15)
    this.currentStrength = 0  // Water current strength
    this.weather = 'clear'    // Weather condition
    this.fogDensity = 0       // Fog level (0-1)
  }

  /**
   * Reset to original data
   */
  reset () {
    this.MapImage = this._data.MapImage
    this.DirFile = this._data.DirFile || 'boten_80.DXR'
    this.Topology = this._data.Topology
    this.objects = this._data.objects || []

    // Sea properties
    this.waveIntensity = this._data.waveIntensity || 1
    this.currentDirection = this._data.currentDirection || 0
    this.currentStrength = this._data.currentStrength || 0
    this.weather = this._data.weather || 'clear'
    this.fogDensity = this._data.fogDensity || 0
  }

  /**
   * Load from JSON data
   * @param {Object} data - Map tile definition
   */
  fromJSON (data) {
    this._data = data

    this.reset()
  }

  /**
   * Get the sprite atlas key for this map's background
   * Based on seaworld-sprites atlas structure
   * @returns {string} Atlas key
   */
  getAtlasKey () {
    return 'seaworld-sprites-0'
  }

  /**
   * Get the frame name for the background image
   * Maps MapImage names to frame indices in the atlas
   * @returns {string} Frame name/index
   */
  getFrameName () {
    // Map known background names to frame indices
    // From seaworld-sprites-0.json:
    // "1" -> 80b001v1, "2" -> 80b002v0, "3" -> 80b003v0
    const frameMap = {
      '80b001v1': '1',
      '80b002v0': '2', 
      '80b003v0': '3'
    }

    if (frameMap[this.MapImage]) {
      return frameMap[this.MapImage]
    }

    // Try direct numeric lookup
    if (this.MapImage && !isNaN(parseInt(this.MapImage))) {
      return this.MapImage
    }

    // Default to first background
    return '1'
  }

  /**
   * Check if this tile has a destination that can be visited
   * @param {Phaser.Point} position - Position to check
   * @param {number} radius - Check radius
   * @returns {Object|null} Destination info or null
   */
  getDestinationAt (position, radius = 50) {
    for (var i = 0; i < this.objects.length; i++) {
      var obj = this.objects[i]
      var objPos = obj[1]
      var objOpt = obj[2] || {}
      
      var distance = Phaser.Math.distance(
        position.x, position.y,
        objPos.x, objPos.y
      )

      var innerRadius = objOpt.InnerRadius || 40
      
      if (distance <= innerRadius) {
        return {
          id: obj[0],
          position: objPos,
          options: objOpt
        }
      }
    }
    return null
  }

  /**
   * Check if boat is near any destination (outer radius)
   * @param {Phaser.Point} position - Position to check
   * @returns {Object|null} Destination info or null
   */
  getNearbyDestination (position) {
    for (var i = 0; i < this.objects.length; i++) {
      var obj = this.objects[i]
      var objPos = obj[1]
      var objOpt = obj[2] || {}
      
      var distance = Phaser.Math.distance(
        position.x, position.y,
        objPos.x, objPos.y
      )

      var outerRadius = objOpt.OuterRadius || 80
      
      if (distance <= outerRadius) {
        return {
          id: obj[0],
          position: objPos,
          options: objOpt,
          distance: distance
        }
      }
    }
    return null
  }

  /**
   * Convert to JSON for saving
   * @returns {Object} Map data
   */
  toJSON () {
    return {
      MapId: this.MapId,
      MapImage: this.MapImage,
      DirFile: this.DirFile,
      Topology: this.Topology,
      objects: this.objects,
      waveIntensity: this.waveIntensity,
      currentDirection: this.currentDirection,
      currentStrength: this.currentStrength,
      weather: this.weather,
      fogDensity: this.fogDensity
    }
  }
}

export default MulleSeaMap
