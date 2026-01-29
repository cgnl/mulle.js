/**
 * MulleSeaWorld class
 * @module struct/seaworld
 * 
 * Sea map navigation system - equivalent of MulleWorld for boats
 * Manages a grid of sea map tiles for navigation
 */

import MulleSeaMap from './seamap'

/**
 * Sea world definition - grid of sea map tiles
 */
class MulleSeaWorld {
  constructor (game, id) {
    this.game = game

    this.WorldId = id

    // Grid dimensions (3x3 default)
    this.gridWidth = 3
    this.gridHeight = 3

    // Map grid
    this.map = []

    // Random destinations (like rDests in car world)
    this.allRDests = {}
    this.rDests = {}

    // Starting position
    this.StartMap = new Phaser.Point(2, 2) // Center of grid
    this.StartCoordinate = new Phaser.Point(320, 240) // Center of screen
    this.StartDirection = 1
  }

  /**
   * Get map tile at grid position
   * @param {number} x - Grid X (1-based)
   * @param {number} y - Grid Y (1-based)
   * @returns {MulleSeaMap} Map tile
   */
  getMap (x, y) {
    // Clamp to valid range
    x = Math.max(1, Math.min(this.gridWidth, x))
    y = Math.max(1, Math.min(this.gridHeight, y))
    
    return this.map[y - 1][x - 1]
  }

  /**
   * Check if position is valid in the grid
   * @param {number} x - Grid X (1-based)
   * @param {number} y - Grid Y (1-based)
   * @returns {boolean} True if valid
   */
  isValidPosition (x, y) {
    return x >= 1 && x <= this.gridWidth && y >= 1 && y <= this.gridHeight
  }

  /**
   * Get adjacent map position in given direction
   * @param {number} x - Current grid X
   * @param {number} y - Current grid Y
   * @param {string} direction - 'north', 'south', 'east', 'west'
   * @returns {Phaser.Point|null} New position or null if invalid
   */
  getAdjacentPosition (x, y, direction) {
    let newX = x
    let newY = y

    switch (direction) {
      case 'north':
        newY -= 1
        break
      case 'south':
        newY += 1
        break
      case 'east':
        newX += 1
        break
      case 'west':
        newX -= 1
        break
    }

    if (this.isValidPosition(newX, newY)) {
      return new Phaser.Point(newX, newY)
    }
    return null
  }

  /**
   * Calculate random destinations (islands that appear on specific tiles)
   */
  calcRandomDestinations () {
    this.allRDests = {}

    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x < this.map[y].length; x++) {
        var MapDef = this.map[y][x]

        if (!MapDef || !MapDef.objects) continue

        for (var i in MapDef.objects) {
          var objectId = MapDef.objects[i][0]
          var objectDef = this.game.mulle.ObjectsDB ? this.game.mulle.ObjectsDB[objectId] : null

          if (objectDef && objectDef.type === '#rdest') {
            var pos = new Phaser.Point(x + 1, y + 1)

            if (this.allRDests[objectId]) {
              this.allRDests[objectId].push(pos)
            } else {
              this.allRDests[objectId] = [pos]
            }
          }
        }
      }
    }
  }

  /**
   * Randomize which tiles show random destinations
   */
  randomizeDestinations () {
    this.rDests = {}

    for (var i in this.allRDests) {
      this.rDests[i] = this.game.rnd.pick(this.allRDests[i])
    }
  }

  /**
   * Initialize from JSON data
   * @param {Object} data - World definition
   */
  fromJSON (data) {
    // Set dimensions
    this.gridWidth = data.gridWidth || 3
    this.gridHeight = data.gridHeight || 3

    // Starting position
    if (data.StartMap) {
      this.StartMap = Phaser.Point.parse(data.StartMap)
    }
    if (data.StartCoordinate) {
      this.StartCoordinate = Phaser.Point.parse(data.StartCoordinate)
    }
    this.StartDirection = data.StartDirection || 1

    // Build map grid
    this.map = []

    for (var y = 0; y < data.map.length; y++) {
      var row = []

      for (var x = 0; x < data.map[y].length; x++) {
        var tileData = data.map[y][x]
        
        // Tile can be an ID (number) or object with full definition
        var map = new MulleSeaMap(this.game, tileData.MapId || tileData)
        
        if (typeof tileData === 'object') {
          map.fromJSON(tileData)
        } else {
          // Load from SeaMapsDB if available
          if (this.game.mulle.SeaMapsDB && this.game.mulle.SeaMapsDB[tileData]) {
            map.fromJSON(this.game.mulle.SeaMapsDB[tileData])
          }
        }

        row.push(map)
      }

      this.map.push(row)
    }

    // Update dimensions based on actual map
    this.gridHeight = this.map.length
    this.gridWidth = this.map[0] ? this.map[0].length : 0
  }

  /**
   * Create a default sea world (3x3 grid)
   * Used when no JSON data is available
   */
  createDefault () {
    this.gridWidth = 3
    this.gridHeight = 3
    this.map = []

    // Background images from boten_80.DXR
    // 80b001v1 (member 17), 80b002v0 (member 22), 80b003v0 (member 23)
    const seaBackgrounds = [
      '80b001v1', '80b002v0', '80b003v0',
      '80b001v1', '80b002v0', '80b003v0',
      '80b001v1', '80b002v0', '80b003v0'
    ]

    let bgIndex = 0

    for (var y = 0; y < this.gridHeight; y++) {
      var row = []

      for (var x = 0; x < this.gridWidth; x++) {
        var mapId = (y * this.gridWidth) + x + 1
        var map = new MulleSeaMap(this.game, mapId)
        
        map.MapImage = seaBackgrounds[bgIndex % seaBackgrounds.length]
        map.DirFile = 'boten_80.DXR'
        map.objects = []

        // Add island destinations on specific tiles
        this.addDefaultDestinations(map, x, y)

        row.push(map)
        bgIndex++
      }

      this.map.push(row)
    }

    // Set starting position to center
    this.StartMap = new Phaser.Point(2, 2)
    this.StartCoordinate = new Phaser.Point(320, 300)
    this.StartDirection = 1
  }

  /**
   * Add default destination objects to map tiles
   * Based on original game destinations from boten_76-88.DXR:
   * - Vuurtoren (Sam) - scene 80 (lighthouse keeper)
   * - Boot Show (Judge) - scene 76 (boat show/competition)
   * - Surfstrand (Sur) - scene 81 (surfing beach)
   * - Birgit's strand - scene 77 (Birgit's beach)
   * 
   * @param {MulleSeaMap} map - The map tile
   * @param {number} x - Grid X (0-based)
   * @param {number} y - Grid Y (0-based)
   */
  addDefaultDestinations (map, x, y) {
    // Define island destinations at specific grid positions
    // Positions match original game layout from boten_76-88.DXR
    const destinations = {
      // Vuurtoren (Sam) - lighthouse in top-left area
      '0,0': { 
        id: 'vuurtoren', 
        name: 'Vuurtoren (Sam)', 
        scene: 'lighthouse',
        dirScene: 80, 
        pos: { x: 150, y: 150 } 
      },
      // Boot Show (Judge) - competition area top-right
      '2,0': { 
        id: 'bootshow', 
        name: 'Boot Show', 
        scene: 'boatshow',
        dirScene: 76, 
        pos: { x: 500, y: 120 } 
      },
      // Birgit's strand - beach in bottom-left
      '0,2': { 
        id: 'birgitstrand', 
        name: "Birgit's Strand", 
        scene: 'birgitbeach',
        dirScene: 77, 
        pos: { x: 120, y: 380 } 
      },
      // Surfstrand (Sur) - surfing beach bottom-right
      '2,2': { 
        id: 'surfstrand', 
        name: 'Surfstrand (Sur)', 
        scene: 'surfbeach',
        dirScene: 81, 
        pos: { x: 520, y: 380 } 
      },
      // Central area - open sea
      '1,1': { 
        id: 'opensea', 
        name: 'Open Zee', 
        scene: null, 
        pos: { x: 320, y: 240 } 
      },
      // Boatyard dock - center bottom
      '1,2': { 
        id: 'boatyard', 
        name: 'Scheepswerf', 
        scene: 'boatyard', 
        pos: { x: 320, y: 420 } 
      }
    }

    const key = `${x},${y}`
    if (destinations[key]) {
      const dest = destinations[key]
      map.objects.push([dest.id, dest.pos, { 
        name: dest.name, 
        scene: dest.scene,
        dirScene: dest.dirScene,
        InnerRadius: 40,
        OuterRadius: 80
      }])
    }
  }

  /**
   * Get all destinations across all map tiles
   * @returns {Array} List of destinations with grid positions
   */
  getAllDestinations () {
    const destinations = []

    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x < this.map[y].length; x++) {
        var mapDef = this.map[y][x]
        
        if (mapDef && mapDef.objects) {
          mapDef.objects.forEach((obj) => {
            destinations.push({
              id: obj[0],
              mapPosition: new Phaser.Point(x + 1, y + 1),
              localPosition: obj[1],
              options: obj[2] || {}
            })
          })
        }
      }
    }

    return destinations
  }

  /**
   * Find destination by ID
   * @param {string} destId - Destination ID
   * @returns {Object|null} Destination info or null
   */
  findDestination (destId) {
    for (var y = 0; y < this.map.length; y++) {
      for (var x = 0; x < this.map[y].length; x++) {
        var mapDef = this.map[y][x]
        
        if (mapDef && mapDef.objects) {
          for (var i = 0; i < mapDef.objects.length; i++) {
            if (mapDef.objects[i][0] === destId) {
              return {
                id: destId,
                mapPosition: new Phaser.Point(x + 1, y + 1),
                localPosition: mapDef.objects[i][1],
                options: mapDef.objects[i][2] || {}
              }
            }
          }
        }
      }
    }
    return null
  }
}

export default MulleSeaWorld
