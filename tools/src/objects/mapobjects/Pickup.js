/**
 * Pickup Map Object - Voor Bible, Swimring, DoctorBag items
 * 
 * Gebaseerd op originele Lingo objecten (boten_CDDATA.CXT/Standalone/):
 * - Object 4 (1953.txt): Bible
 * - Object 5 (1954.txt): Swimring  
 * - Object 6 (1955.txt): DoctorBag
 * 
 * Originele Lingo structuur:
 * [#ObjectId: 4, #type: #rdest, #InnerRadius: 45, #OuterRadius: 55, 
 *  #CustomObject:"Pickup", #DirResource: "", 
 *  #Sounds: ["31d001v0", "31d009v0", "31e005v0"], 
 *  #FrameList: [#normal: ["31b001v0"], #Trans:"33b010v0"], 
 *  #SetWhenDone:[#Inventory:[#Bible]], 
 *  #CheckFor:[#NotGivenMissions:[1], #Level:[2,3,4,5], #Inventory:[#Bible]], 
 *  #IfFound:#NoDisplay, 
 *  #SpriteInfo:[#Under:1]]
 * 
 * @module objects/mapobjects/Pickup
 */
'use strict'

var MapObject = {}

/**
 * Map ObjectId to inventory item name
 * Uit originele Lingo SetWhenDone:[#Inventory:[#Bible/Swimring/DoctorBag]]
 */
const PICKUP_ITEMS = {
  4: 'Bible',      // 1953.txt
  5: 'Swimring',   // 1954.txt
  6: 'DoctorBag'   // 1955.txt
}

/**
 * onCreate - Check of pickup zichtbaar moet zijn
 * 
 * Originele Lingo CheckFor logica:
 * - #NotGivenMissions:[1] - Missie 1 mag niet gegeven zijn
 * - #Level:[2,3,4,5] - Speler moet level 2+ zijn
 * - #Inventory:[#Bible] - Speler mag item nog niet hebben
 * - #IfFound:#NoDisplay - Als CheckFor waar is, verberg object
 */
MapObject.onCreate = function () {
  console.debug('[Pickup] onCreate', this.id, this.def)
  
  // Bepaal welk item dit pickup object representeert
  this.itemName = PICKUP_ITEMS[this.id]
  
  if (!this.itemName) {
    console.warn('[Pickup] Unknown pickup object ID:', this.id)
    this.enabled = false
    this.renderable = false
    return
  }

  // Voer CheckFor controles uit
  if (!this.checkVisibility()) {
    console.debug('[Pickup] CheckFor failed, hiding pickup:', this.itemName)
    this.enabled = false
    this.renderable = false
    return
  }

  // Toon de normale sprite
  this.showNormalSprite()
  
  console.debug('[Pickup] Pickup active:', this.itemName)
}

/**
 * Check of pickup zichtbaar moet zijn
 * Implementeert originele Lingo CheckFor logica
 * 
 * @returns {boolean} True als pickup zichtbaar moet zijn
 */
MapObject.checkVisibility = function () {
  const user = this.game.mulle.user
  const inventory = this.game.mulle.seaInventory
  const checkFor = this.def.CheckFor
  
  if (!checkFor || checkFor === 0) {
    return true
  }

  // Check #Inventory - als speler item al heeft, verberg
  // Originele: #Inventory:[#Bible] in CheckFor + #IfFound:#NoDisplay
  if (checkFor.Inventory) {
    const itemToCheck = checkFor.Inventory[0]
    if (inventory.hasItem(itemToCheck)) {
      console.debug('[Pickup] Already has item:', itemToCheck)
      return false
    }
  }

  // Check #NotGivenMissions - als missie al gegeven is, verberg
  // Originele: #NotGivenMissions:[1]
  if (checkFor.NotGivenMissions) {
    for (const missionId of checkFor.NotGivenMissions) {
      if (user.isSeaMissionGiven(missionId)) {
        console.debug('[Pickup] Mission already given:', missionId)
        return false
      }
    }
  }

  // Check #Level - speler moet in een van de toegestane levels zijn
  // Originele: #Level:[2,3,4,5] betekent level 2, 3, 4, of 5
  if (checkFor.Level) {
    const currentLevel = user.getSeaLevel()
    if (!checkFor.Level.includes(currentLevel)) {
      console.debug('[Pickup] Level check failed:', currentLevel, 'not in', checkFor.Level)
      return false
    }
  }

  return true
}

/**
 * Toon normale sprite
 * Originele: #FrameList: [#normal: ["31b001v0"]]
 */
MapObject.showNormalSprite = function () {
  if (this.def.FrameList && this.def.FrameList.normal) {
    const spriteName = this.def.FrameList.normal[0]
    if (spriteName && spriteName !== 'Dummy') {
      this.setDirectorMember(spriteName)
      console.debug('[Pickup] Set sprite:', spriteName)
    }
  }
}

/**
 * Speel pickup animatie en voeg item toe aan inventory
 * Originele: #Trans:"33b010v0" (transition sprite)
 * 
 * @param {function} callback - Functie om aan te roepen na animatie
 */
MapObject.playPickupAnimation = function (callback) {
  // Check of er een Trans sprite is
  if (this.def.FrameList && this.def.FrameList.Trans) {
    const transSprite = this.def.FrameList.Trans
    if (transSprite && transSprite !== 'Dummy') {
      // Toon transition sprite
      this.setDirectorMember(transSprite)
      
      // Na korte delay, callback
      this.game.time.events.add(500, () => {
        this.renderable = false
        if (callback) callback()
      }, this)
      return
    }
  }
  
  // Geen Trans sprite, direct callback
  this.renderable = false
  if (callback) callback()
}

/**
 * onEnterOuter - Speler komt in buitenste radius
 * Speel eerste geluid (aankondiging)
 * Originele: #Sounds: ["31d001v0", ...] - eerste sound bij outer
 */
MapObject.onEnterOuter = function (boat) {
  if (!this.enabled) return
  
  console.debug('[Pickup] Enter outer:', this.itemName)
  
  // Speel aankondigingsgeluid (eerste in Sounds array)
  if (this.def.Sounds && this.def.Sounds.length > 0) {
    this.game.mulle.playAudio(this.def.Sounds[0])
  }
}

/**
 * onEnterInner - Speler komt in binnenste radius (pickup moment)
 * Originele logica:
 * 1. Stop boot
 * 2. Speel pickup geluiden (2e en 3e in array)
 * 3. Voeg item toe aan inventory (SetWhenDone:[#Inventory:[#Bible]])
 * 4. Speel Trans animatie
 * 5. Verberg object permanent
 */
MapObject.onEnterInner = function (boat) {
  if (!this.enabled) return
  
  console.log('[Pickup] Picking up:', this.itemName)
  
  // Stop de boot
  boat.enabled = false
  boat.speed = 0
  
  // Speel pickup geluiden (2e en 3e in Sounds array)
  // Originele: ["31d001v0", "31d009v0", "31e005v0"]
  // - 31d001v0 = aankondiging (bij outer)
  // - 31d009v0 = pickup geluid
  // - 31e005v0 = success geluid
  const playPickupSounds = () => {
    return new Promise((resolve) => {
      if (this.def.Sounds && this.def.Sounds.length > 1) {
        const pickupSound = this.game.mulle.playAudio(this.def.Sounds[1])
        if (pickupSound) {
          pickupSound.onStop.addOnce(() => {
            // Speel success geluid als er een derde is
            if (this.def.Sounds.length > 2) {
              const successSound = this.game.mulle.playAudio(this.def.Sounds[2])
              if (successSound) {
                successSound.onStop.addOnce(resolve)
              } else {
                resolve()
              }
            } else {
              resolve()
            }
          })
        } else {
          resolve()
        }
      } else {
        resolve()
      }
    })
  }

  // Voer pickup sequence uit
  playPickupSounds().then(() => {
    // Voeg item toe aan inventory
    // Originele: SetWhenDone:[#Inventory:[#Bible]]
    this.executeSetWhenDone()
    
    // Speel pickup animatie
    this.playPickupAnimation(() => {
      // Pickup compleet, verberg permanent
      this.enabled = false
      this.renderable = false
      
      // Heractiveer boot
      boat.enabled = true
      
      console.log('[Pickup] Pickup complete:', this.itemName)
    })
  })
}

/**
 * Voer SetWhenDone uit
 * Originele: SetWhenDone:[#Inventory:[#Bible]]
 */
MapObject.executeSetWhenDone = function () {
  const setWhenDone = this.def.SetWhenDone
  
  if (!setWhenDone || setWhenDone === 0) return
  
  // Voeg items toe aan inventory
  if (setWhenDone.Inventory) {
    for (const itemName of setWhenDone.Inventory) {
      this.game.mulle.seaInventory.addItem(itemName)
      console.log('[Pickup] Added to inventory:', itemName)
    }
  }
  
  // Mark missies als gegeven (indien van toepassing)
  if (setWhenDone.Missions) {
    for (const missionId of setWhenDone.Missions) {
      this.game.mulle.user.giveSeaMission(missionId)
      console.log('[Pickup] Mission given:', missionId)
    }
  }
  
  // Voeg medals toe (indien van toepassing)
  if (setWhenDone.Medals) {
    for (const medalId of setWhenDone.Medals) {
      this.game.mulle.seaMedals.awardMedal(medalId)
      console.log('[Pickup] Medal awarded:', medalId)
    }
  }
  
  // Voeg parts toe (indien van toepassing)
  if (setWhenDone.Parts) {
    for (const partId of setWhenDone.Parts) {
      // Voeg boat part toe aan boatyard floor
      this.game.mulle.user.addBoatPart('shopFloor', partId)
      console.log('[Pickup] Part added:', partId)
    }
  }
}

export default MapObject
