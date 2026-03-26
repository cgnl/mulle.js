/**
 * MulleSeaWorld class
 * @module struct/seaworld
 * 
 * Sea map navigation system - equivalent of MulleWorld for boats
 * Manages a grid of sea map tiles for navigation
 */

import MulleSeaMap from './seamap'
const SeaWorldData = require('../scenes/SeaWorldData')

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

    // Map grid - 2D array with MapId references (#145)
    this.map = []

    // Random destinations (like rDests in car world) (#150)
    this.allRDests = {}
    this.rDests = {}

    // Starting position
    this.StartMap = new Phaser.Point(2, 2) // Center of grid
    this.StartCoordinate = new Phaser.Point(320, 240) // Center of screen
    this.StartDirection = 1
    
    // Current map tracking (#159)
    this.currentMap = new Phaser.Point(2, 2)
    
    // Symbol position for world select (#158)
    this.symbolPosition = 0
    
    // Entered object tracking
    this.enteredObjectId = 0
  }

  /**
   * Get map tile at grid position
   * Uses 2D grid map array with MapId references (#145)
   * 
   * BUG FIX #5.8: Return null for invalid coordinates instead of clamping
   * This prevents accessing wrong tiles when boat goes out of bounds
   * 
   * @param {number} x - Grid X (1-based)
   * @param {number} y - Grid Y (1-based)
   * @returns {MulleSeaMap|null} Map tile or null if out of bounds
   */
  getMap (x, y) {
    // BUG FIX #5.8: Check validity and return null instead of clamping
    if (x < 1 || x > this.gridWidth || y < 1 || y > this.gridHeight) {
      return null
    }
    
    return this.map[y - 1][x - 1]
  }

  /**
   * Get new map ID for position with mode support
   * Original: getNewMapId(thePoint, theMode, theJustCheck)
   * @param {Phaser.Point} thePoint - Map coordinate or offset
   * @param {string} theMode - '#Relational' or '#Absolute'
   * @param {boolean} theJustCheck - If true, don't update currentMap
   * @returns {number|symbol} MapId or error symbol
   */
  getNewMapId (thePoint, theMode, theJustCheck) {
    var targetPoint = thePoint.clone()
    
    if (theMode === '#Relational') {
      targetPoint.add(this.currentMap.x, this.currentMap.y)
    }
    
    var tempY = targetPoint.y
    if (tempY < 1 || tempY > this.map.length) {
      return '#InvalidYIndex'
    }
    
    var tempList = this.map[tempY - 1]
    var tempX = targetPoint.x
    if (tempX < 1 || tempX > tempList.length) {
      return '#InvalidXIndex'
    }
    
    if (!theJustCheck) {
      this.currentMap = targetPoint
    }
    
    return tempList[tempX - 1].MapId
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
   * Random destinations (#rdest) placement system (#150)
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
   * Duplicate prevention for rdest (#151)
   * Original logic: prevent same tile from having multiple rdests
   */
  randomizeDestinations () {
    this.rDests = {}
    var tmpUsedLocs = []

    // Iterate through all rdest objects
    var allRDestsKeys = Object.keys(this.allRDests)
    for (var n = 0; n < allRDestsKeys.length; n++) {
      var objectId = allRDestsKeys[n]
      var tempDest = this.allRDests[objectId].slice() // Duplicate array
      var tempNrOfMaps = tempDest.length
      
      // Shuffle the possible locations
      var tmpRndDestList = []
      for (var m = 0; m < tempNrOfMaps; m++) {
        var tmpPos = Math.floor(Math.random() * tempDest.length)
        tmpRndDestList.push(tempDest[tmpPos])
        tempDest.splice(tmpPos, 1)
      }
      
      // Find first free location (not already used by another rdest)
      var tmpFoundFree = false
      var tmpInfo = null
      for (var m = 0; m < tempNrOfMaps; m++) {
        tmpInfo = tmpRndDestList[m]
        var alreadyUsed = false
        for (var k = 0; k < tmpUsedLocs.length; k++) {
          if (tmpUsedLocs[k].x === tmpInfo.x && tmpUsedLocs[k].y === tmpInfo.y) {
            alreadyUsed = true
            break
          }
        }
        if (!alreadyUsed) {
          tmpFoundFree = true
          break
        }
      }
      
      // If found a free location, assign it
      if (tmpFoundFree) {
        tmpUsedLocs.push(tmpInfo)
        this.rDests[objectId] = tmpInfo
      }
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
    // Prefer real 10x11 sea grid data when available.
    // This matches extracted Director map IDs (0-109) and tile backgrounds.
    if (SeaWorldData && SeaWorldData.GRID_WIDTH === 10 && SeaWorldData.GRID_HEIGHT === 11) {
      this.gridWidth = SeaWorldData.GRID_WIDTH
      this.gridHeight = SeaWorldData.GRID_HEIGHT
      this.map = []

      for (let row = 0; row < this.gridHeight; row++) {
        const worldRow = []
        for (let col = 0; col < this.gridWidth; col++) {
          const mapId = SeaWorldData.getMapId(row, col)
          const map = new MulleSeaMap(this.game, mapId)

          // Prefer SeaMapsDB runtime data; fallback to SeaWorldData tile data.
          const dbTile = this.game.mulle.SeaMapsDB && (this.game.mulle.SeaMapsDB[mapId] || this.game.mulle.SeaMapsDB[String(mapId)])
          const tile = dbTile || SeaWorldData.getTile(mapId)

          if (tile) {
            map.fromJSON({
              ...tile,
              // Normalize key naming from extractor format.
              underMapImage: tile.underMapImage || tile.UnderMapImage || null
            })
          } else {
            map.MapImage = 'Dummy'
            map.Topology = '30t999v0'
            map.objects = []
            map.Special = null
            map.DirFile = 'boten_80.DXR'
          }

          worldRow.push(map)
        }
        this.map.push(worldRow)
      }

      const startPos = SeaWorldData.getGridPosition(SeaWorldData.START_MAP_ID)
      this.StartMap = new Phaser.Point(startPos.col + 1, startPos.row + 1)
      this.StartCoordinate = new Phaser.Point(SeaWorldData.START_COORDINATE.x, SeaWorldData.START_COORDINATE.y)
      this.StartDirection = SeaWorldData.START_DIRECTION
      this.currentMap = this.StartMap.clone()
      return
    }

    // Legacy fallback if SeaWorldData is unavailable.
    this.gridWidth = 3
    this.gridHeight = 3
    this.map = []

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
        this.addDefaultDestinations(map, x, y)
        row.push(map)
        bgIndex++
      }
      this.map.push(row)
    }

    this.StartMap = new Phaser.Point(2, 2)
    this.StartCoordinate = new Phaser.Point(320, 300)
    this.StartDirection = 1
    
    // BUG #5.9: TODO - Area backgrounds need fixing after proper map data is loaded
    // Current implementation uses hardcoded backgrounds from boten_80.DXR
    // Should load actual area backgrounds from SeaMapsDB when available
    
    // BUG #5.10: TODO - Boat prop checks need implementation after map data is loaded  
    // Original Lingo checks boat properties (compass, fuel, etc.) for certain areas
    // Should be implemented in map transition logic
  }

  /**
   * Add default destination objects to map tiles
   * Based on original game destinations from boten_76-88.DXR:
   * - Vuurtoren (Sam) - scene 80 (lighthouse keeper)
   * - Boot Show (Judge) - scene 76 (boat show/competition)
   * - Surfstrand (Sur) - scene 81 (surfing beach)
   * - Birgit's strand - scene 77 (Birgit's beach)
   * 
   * BUG FIX #5.5: Now uses SeaPositionsDB when available for accurate positions
   * 
   * @param {MulleSeaMap} map - The map tile
   * @param {number} x - Grid X (0-based)
   * @param {number} y - Grid Y (0-based)
   */
   addDefaultDestinations (map, x, y) {
    // BUG FIX #5.5: Use loaded SeaPositionsDB if available
    // Otherwise fall back to hardcoded positions
    const seaPositions = this.game.mulle.SeaPositionsDB
    
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

    // Add Bible pickup (Object 4) to tile (1,1) near church area
    // Original Lingo: 1953.txt - Bible pickup object
    if (x === 1 && y === 1) {
      console.log('[MulleSeaWorld] Adding Bible pickup to tile (1,1)')
      map.objects.push([4, { x: 200, y: 180 }, {
        InnerRadius: 45,
        OuterRadius: 55
      }])
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
  
  /**
   * Get world ID
   * @returns {string} World ID
   */
  getId () {
    return this.WorldId
  }
  
  /**
   * Get symbol position for world select (#158)
   * @returns {number} Position on world overview map
   */
  getPosition () {
    return this.symbolPosition
  }
  
  /**
   * Set entered object ID
   * @param {number} theid - Object ID
   */
  enteredObject (theid) {
    this.enteredObjectId = theid
  }
  
  /**
   * Get entered object ID
   * @returns {number} Object ID
   */
  getEnteredObject () {
    return this.enteredObjectId
  }
  
  /**
   * Get start info for boat spawning
   * @returns {Object} Start information
   */
  getStartInfo () {
    return {
      map: this.StartMap,
      coordinate: this.StartCoordinate,
      direction: this.StartDirection,
      fuel: '#Full'
    }
  }
  
  /**
   * Get world grid size
   * @returns {Phaser.Point} Grid dimensions (width, height)
   */
  getWorldSize () {
    var width = this.map.length > 0 ? this.map[0].length : 0
    var height = this.map.length
    return new Phaser.Point(width, height)
  }
  
  /**
   * Get current map ID
   * @returns {number|symbol} MapId or error symbol
   */
  getCurrentMapId () {
    var tempY = this.currentMap.y
    if (tempY < 1 || tempY > this.map.length) {
      return '#InvalidYIndex'
    }
    
    var tempList = this.map[tempY - 1]
    var tempX = this.currentMap.x
    if (tempX < 1 || tempX > tempList.length) {
      return '#InvalidXIndex'
    }
    
    return tempList[tempX - 1].MapId
  }
}

export default MulleSeaWorld
