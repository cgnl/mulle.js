'use strict'

class MullePartData {
  constructor (game, partId, partData) {
    this.game = game

    this.partId = parseInt(partId)

    this.data = partData // game.mulle.PartsDB[ partId ];

    // Handle both car parts (lowercase) and boat parts (mixed case) formats
    this.junkView = this.data.junkView || this.data.JunkView || ''
    this.ShelfView = this.data.ShelfView || this.data.shelfView || ''
    this.JunkView = this.data.JunkView || this.data.junkView || ''
    this.UseView = this.data.UseView || ''
    this.UseView2 = this.data.UseView2 || ''
    this.UseViewInside = this.data.UseViewInside || ''
    this.UseViewInside2 = this.data.UseViewInside2 || ''

    this.description = this.data.description || this.data.SndDescription || ''
    this.SndDescription = this.data.SndDescription || this.data.description || ''
    this.SndAttachOnBoat = this.data.SndAttachOnBoat || ''
    this.SndDropOn = this.data.SndDropOn || ''

    this.ClickArea = this.data.ClickArea || null

    this.Requires = this.data.Requires
    this.Covers = this.data.Covers

    // Handle both 'master' (car) and 'Master' (boat) formats
    var masterVal = this.data.master !== undefined ? this.data.master : this.data.Master
    if (masterVal !== 0 && masterVal !== undefined) {
      this.master = masterVal
      this.Master = masterVal  // Also set uppercase for boatpart.js compatibility
    } else {
      this.master = false
      this.Master = false
    }

    this.MorphsTo = this.data.MorphsTo ? this.data.MorphsTo : false

    // Parsed new points (object format for car game buildcar.js)
    this.new = []
    // Also keep raw array format for boat game buildboat.js
    this.New = this.data.new || this.data.New || []
    if (this.data.new) {
      for (var i = 0; i < this.data.new.length; i++) {
        var e = this.data.new[i]
        this.new.push({
          id: e[0],
          fg: e[1][0],
          bg: e[1][1],
          offset: new Phaser.Point(e[2][0], e[2][1])
        })
      }
    }

    // Handle both 'offset' (car) and 'Offset' (boat) formats
    var offsetData = this.data.offset || this.data.Offset || [0, 0]
    this.offset = new Phaser.Point(offsetData[0], offsetData[1])
    // Also keep Offset as array for code that expects array format
    this.Offset = offsetData

    // lowercase properties, thanks lingo
    this.properties = {}
    this.Properties = this.data.Properties || {}

    if (this.data.Properties) {
      for (var n in this.data.Properties) {
        this.properties[ n.toLowerCase() ] = this.data.Properties[n]
      }
    }
  }

  getProperty (name, defVal = null) {
    /*
    if (!this.data) return false

    // quick lookup
    if (this.data.Properties[name]) return this.data.Properties[name]

    // case insensitive lookup
    for (var n in this.data.Properties) {
      if (name.toLocaleString() === n.toLowerCase()) {
        return this.data.Properties[n]
      }
    }
    */

    name = name.toLowerCase()

    if (this.properties[ name ]) return this.properties[ name ]

    // traverse MorphsTo chain to find property on morph targets
    if (this.MorphsTo) {
      for (var i in this.MorphsTo) {
        // Try car DB first, then boat DB as fallback
        var m = this.game.mulle.getPart(this.MorphsTo[i])
        if (!m && this.game.mulle.getBoatPart) {
          m = this.game.mulle.getBoatPart(this.MorphsTo[i])
        }

        if (!m) {
          console.debug('MorphsTo part not found in either DB:', this.MorphsTo[i])
          continue
        }

        if (m.getProperty(name, defVal)) return m.getProperty(name, defVal)
      }
    }

    return defVal
  }
}

export default MullePartData
