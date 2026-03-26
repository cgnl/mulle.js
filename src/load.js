import MullePartData from 'struct/partdata'
import MulleMissions from 'struct/missions'
import BoatPartsDB from 'struct/boatpartsdb'
import MulleWeather from 'objects/weather'

class LoadState extends Phaser.State {
  preload () {
    // static data
    this.load.json('MapsDB', 'data/maps.hash.json')
    this.load.json('MissionsDB', 'data/missions.hash.json')
    this.load.json('ObjectsDB', 'data/objects.hash.json')
    this.load.json('PartsDB', 'data/parts.hash.json')
    this.load.json('WorldsDB', 'data/worlds.hash.json')
    // Director text cast data (DATA.CST / BOTEN_DATA.CST) for Lingo parity
    this.load.json('DirectorDataCST', 'data/director_data_casts.json')
    // Director cast-member name map (DXR/CXT numeric -> name) for Lingo parity
    this.load.json('DirectorMemberMap', 'data/director_member_map.json')
    
    // Boat parts database (for Scheepswerf/Boten expansion)
    this.load.json('BoatPartsDB', 'data/boat_parts.hash.json')
    
    // Boat objects database (sea map objects like Racing, Pickups)
    this.load.json('BoatObjectsDB', 'data/boat_objects.hash.json')
    
    // BUG FIX #5.5: Load sea positions extracted data for default destinations
    this.load.json('SeaPositionsDB', 'data/sea_positions_extracted.json')
    
    // BUG FIX #5.1 (BUGS_ROUND4.md): Load sea map database and world grid
    this.load.json('SeaMapsDB', 'data/sea_maps.hash.json')
    this.load.json('SeaWorldsDB', 'data/sea_worlds.json')

    // this.load.atlas('garage-0', 'assets/garage-0.png', 'assets/garage-0.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    // this.load.atlas('carparts-0', 'assets/carparts-0.png', 'assets/carparts-0.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
    // this.load.atlas('carparts-1', 'assets/carparts-1.png', 'assets/carparts-1.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);

    this.game.load.pack('cutscenes', 'assets/cutscenes.json', null, this)

    this.game.load.pack('characters', 'assets/characters.json', null, this)

    this.game.load.pack('carparts', 'assets/carparts.json', null, this)

    // NOTE: Boat game assets are lazy-loaded when entering boat scenes
    // This prevents boat sprites (like Bible 31b001v0) from conflicting with
    // car game sprites that have the same name pattern.
    // See: game.js mulle.loadBoatAssets() and boatyard.js/seaworld.js preload()

    this.game.load.pack('shared', 'assets/shared.json', null, this)
    // this.game.load.pack('voices', 'assets_new/voices.json', null, this);
    this.game.load.pack('ui', 'assets/ui.json', null, this)

    // this.game.load.onPackComplete.add(handleMulleArchive, this);
    // this.game.load.onFileComplete.add(this.game.mulle.hijackFile, this);
    // this.game.load.onLoadComplete.add(this.game.mulle.hijackLoad, this);

    this.game.load.onLoadComplete.add(this.loadComplete, this)

    this.progress = game.add.graphics(0, 0)
    this.loadImage = this.game.add.sprite(320 - (235 / 2), 240 - (189 / 2), 'loading')
  }

  loadRender () {
    if (this.progress) {
      var p = this.game.load.progressFloat / 100

      this.progress.clear()

      this.progress.beginFill('0x333333', 1)
      this.progress.drawRect(640 / 2 - 150, 400, 300, 32)
      this.progress.endFill()

      this.progress.beginFill('0x65C265', 1)
      this.progress.drawRect(640 / 2 - 150, 400, p * 300, 32)
      this.progress.endFill()

      this.progress.beginFill('0x65C265', 1)
    }
  }

  create () {
    var parts = this.game.cache.getJSON('PartsDB')

    for (var id in parts) {
      this.game.mulle.PartsDB[id] = new MullePartData(this.game, id, parts[id])
    }

    // BUG FIX #2 (ADDITIONAL_BUGS_ROUND2.md): Load boat parts database with proper class
    var boatPartsData = this.game.cache.getJSON('BoatPartsDB')
    if (boatPartsData) {
      // Wrap raw boat parts data in BoatPartsDB class for validation and helper methods
      // Also populate the raw hash for backward compatibility
      const rawBoatParts = {}
      for (var id in boatPartsData) {
        rawBoatParts[id] = new MullePartData(this.game, id, boatPartsData[id])
      }
      
      // Create BoatPartsDB instance with raw parts data
      this.game.mulle.BoatPartsDB = new BoatPartsDB(this.game, rawBoatParts)
      
      console.log('[Load] Boat parts database initialized:', this.game.mulle.BoatPartsDB.getCount(), 'parts')
    }

    this.game.mulle.MapsDB = this.game.cache.getJSON('MapsDB')

    this.game.mulle.WorldsDB = this.game.cache.getJSON('WorldsDB')

    /*
    this.game.mulle.WorldsDB = {};
    for (var id in worlds) {
      this.game.mulle.WorldsDB[id] = new MulleWorld(this.game, id)
      this.game.mulle.WorldsDB[id].fromJSON(worlds[id])
    }
    */

    this.game.mulle.ObjectsDB = this.game.cache.getJSON('ObjectsDB')

    // Director DATA.CST text members (PartsDB, UsersDB, etc.)
    const directorData = this.game.cache.getJSON('DirectorDataCST')
    if (directorData) {
      this.game.mulle.directorTextData = directorData
      console.log('[Load] Director DATA.CST loaded:', Object.keys(directorData))
    }

    const directorMemberMap = this.game.cache.getJSON('DirectorMemberMap')
    if (directorMemberMap) {
      this.game.mulle.directorMemberMap = directorMemberMap
      console.log('[Load] Director member map loaded:', Object.keys(directorMemberMap).length)
    }

    // Merge boat objects into ObjectsDB (sea-specific map objects)
    var boatObjects = this.game.cache.getJSON('BoatObjectsDB')
    if (boatObjects) {
      // Use higher IDs for boat objects to avoid collision with car objects
      // Or store separately for sea world
      this.game.mulle.BoatObjectsDB = boatObjects
      
      // Also merge into main ObjectsDB with 'sea_' prefix for compatibility
      for (var objId in boatObjects) {
        // Store with 'sea_' prefix to distinguish from car world objects
        this.game.mulle.ObjectsDB['sea_' + objId] = boatObjects[objId]
      }
      console.log('[Load] Boat objects loaded:', Object.keys(boatObjects).length)
    }
    
    // BUG FIX #5.5: Load sea positions database for default destinations
    var seaPositions = this.game.cache.getJSON('SeaPositionsDB')
    if (seaPositions) {
      this.game.mulle.SeaPositionsDB = seaPositions
      console.log('[Load] Sea positions database loaded')
    }
    
    // BUG FIX #5.1 (BUGS_ROUND4.md): Load sea map database and world grid
    var seaMaps = this.game.cache.getJSON('SeaMapsDB')
    if (seaMaps) {
      this.game.mulle.SeaMapsDB = seaMaps
      console.log('[Load] Sea maps database loaded:', Object.keys(seaMaps).length, 'maps')
    }
    
    var seaWorlds = this.game.cache.getJSON('SeaWorldsDB')
    if (seaWorlds) {
      this.game.mulle.SeaWorldsDB = seaWorlds
      console.log('[Load] Sea worlds database loaded:', Object.keys(seaWorlds).length, 'worlds')
    }

    // Initialize mission system
    this.game.mulle.missions = new MulleMissions(this.game)

    // BUG FIX #4: Initialize Weather system after assets are loaded
    // Weather needs game.cache to be ready, so we initialize it here
    // Original: global gMulleGlobals.weather = script("Weather").new()
    if (!this.game.mulle.weather) {
      this.game.mulle.weather = new MulleWeather(this.game, null)
      console.log('[Load] Weather system initialized')
    }

    // this.loadText = this.game.add.text(32, 32, 'Loading...', { fill: '#ffffff' });

    this.game.mulle.addAudio('shared')

    this.game.mulle.addAudio('carparts')

    // NOTE: Boat audio is lazy-loaded via mulle.registerBoatAudio() in boat scenes
    // This prevents sprite/audio conflicts with car game assets

    this.game.mulle.loadData()
  }

  loadComplete () {
    this.ready = true
  }

  fileComplete (progress, cacheKey, success, totalLoaded, totalFiles) {

    // this.loadText.setText("Loading " + totalLoaded + "/" + totalFiles + " files, " + progress + "% done.");

    // console.log('File loaded', cacheKey);

  }

  update () {
    if (this.ready) this.game.state.start(window.location.hash ? window.location.hash.substr(1) : 'menu')
  }

  shutdown () {
    if (this.loadImage) {
      this.loadImage.destroy()
    }

    if (this.progress) {
      this.progress.destroy()
    }
  }
}

export default LoadState
