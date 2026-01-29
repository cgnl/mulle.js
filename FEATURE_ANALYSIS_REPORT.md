# 🎮 Mulle Meck - Ontbrekende Features Analyse & Implementatieplan

**Gegenereerd:** 29 januari 2025  
**Project:** /Users/sander/projects/mulle-meck-game  
**Huidige status:** ~90% compleet (zie STATUS.md)

---

## 📋 Executive Summary

Dit rapport analyseert de 20 ontbrekende items voor een volledig speelbare Mulle Meck game. De features zijn onderverdeeld in 3 prioriteiten gebaseerd op impact op speelbaarheid.

**Totaal te implementeren:** 20 items  
**Prioriteit 1 (Kritiek):** 9 items  
**Prioriteit 2 (Work in Progress):** 2 items  
**Prioriteit 3 (Polish):** 9 items

---

## 🎯 PRIORITEIT 1 - Moet voor volledig speelbaar

Deze features blokkeren core gameplay en moeten eerst geïmplementeerd worden.

### 1. File Browser Scene (13.DXR) - HELE SCENE

**Status:** ❌ Niet geïmplementeerd  
**Locatie origineel:** `extracted/13.DXR` (275 KB)  
**Huidige implementatie:** Geen - scene bestaat niet  

**Functionaliteit in origineel:**
- Browse opgeslagen auto's
- Laad geselecteerde auto
- Delete functionaliteit (zie #2)
- Preview van auto design
- Gebruikt in menu systeem (10.DXR → 13.DXR)

**Database referentie:**
```javascript
// In scenes mapping (game.js)
this.mulle.scenes['13'] = 'filebrowser'  // ONTBREEKT
```

**Vereiste assets:**
```
13.DXR members:
- Background sprite (member 2)
- UI buttons (load, delete, cancel)
- File list rendering
- Car preview renderer
```

**Implementatie aanpak:**
1. Analyseer 13.DXR chunks voor scene layout
2. Extraheer sprites met `python tools/build_scripts/build.py --scene 13`
3. Maak nieuwe scene `tools/src/scenes/filebrowser.js`
4. Implementeer file list renderer (gebruikers uit `game.mulle.UsersDB`)
5. Integreer car preview (gebruik bestaande `MulleBuildCar` object)
6. Voeg delete functionaliteit toe (zie #2)

**Geschatte tijd:** 8-12 uur

---

### 2. File Delete Functionaliteit

**Status:** ❌ Niet geïmplementeerd  
**Locatie origineel:** 13.DXR (file browser) + 10.DXR (menu)  
**Huidige implementatie:** Geen delete knop in menu  

**Functionaliteit in origineel:**
- Delete knop in file browser (13.DXR)
- Verwijder save data uit `UsersDB`
- Bevestigingsvenster ("Weet je het zeker?")
- Update localStorage

**Huidige code (menu.js):**
```javascript
// Lijn 75-94 in menu.js
let y = 60
for (let name in this.game.mulle.UsersDB) {
  let text = this.game.add.text(350, y, name, { font: '24px serif' })
  text.inputEnabled = true
  
  text.events.onInputUp.add((e) => {
    this.game.mulle.user = this.game.mulle.UsersDB[ name ]
    this.game.state.start('garage')
  }, this)
  
  y += 25
}
// ONTBREEKT: Delete knop naast elke naam
```

**Implementatie code:**
```javascript
// In menu.js - na lijn 94
text.events.onInputUp.add((e) => {
  // Alleen laden, niet deleten
  this.game.mulle.user = this.game.mulle.UsersDB[ name ]
  this.game.state.start('garage')
}, this)

// NIEUW: Delete knop
let deleteBtn = this.game.add.text(500, y, '🗑️', { 
  font: '20px sans-serif',
  fill: '#ff0000'
})
deleteBtn.inputEnabled = true

deleteBtn.events.onInputUp.add((e) => {
  e.stopPropagation() // Voorkom load trigger
  
  // Bevestiging
  if (confirm(`Verwijder speler "${name}"?`)) {
    delete this.game.mulle.UsersDB[name]
    this.game.mulle.saveData()
    
    // Refresh lijst
    this.game.state.restart()
  }
}, this)

y += 25
```

**Geschatte tijd:** 2-3 uur

---

### 3. Map Object: BridgeC (Object ID 27)

**Status:** ⚠️ Gedeeltelijk geïmplementeerd  
**Locatie:** `tools/src/objects/mapobjects/CBridge.js`  
**Database definitie:** `objects.hash.json` entry 27

**Huidige code:**
```javascript
// CBridge.js - HUIDIG
MapObject.onCreate = function () {
  this.animationHelper.add('normal', 'normal', this.opt.Direction, 3, true, true)
  this.animations.play('normal')
  this.game.mulle.playAudio(this.def.Sounds[0])
}

MapObject.onEnterOuter = function (car) {
  console.log(this.animations.frame)
  if (this.animations.frame > 37) {
    car.speed = 0
    car.stepback(2)
  }
}
```

**Probleem:** 
- Geen `onEnterInner` - brug blokkeert auto permanent
- Geen logica om brug te openen/sluiten
- Animatie stopt na opening

**Database definitie:**
```json
{
  "ObjectId": 27,
  "type": "#custom",
  "InnerRadius": 20,
  "OuterRadius": 45,
  "CustomObject": "CBridge",
  "Sounds": ["31e004v0"],
  "FrameList": {
    "normal": ["31b030v0", "31b031v0", "31b032v0"]
  }
}
```

**Implementatie fix:**
```javascript
// CBridge.js - VERBETERD
MapObject.onCreate = function () {
  this.bridgeOpen = false
  this.animating = false
  
  // Start met gesloten brug (frame 0)
  this.animationHelper.add('opening', 'normal', this.opt.Direction, 3, false, true)
  this.animationHelper.add('closing', 'normal', this.opt.Direction, 3, false, false) // reverse
  
  // Toon gesloten staat
  this.setFrameList('normal', this.opt.Direction)
  this.animations.frame = 0
}

MapObject.onEnterOuter = function (car) {
  if (this.animating) return
  
  // Check if bridge should open
  if (!this.bridgeOpen) {
    this.animating = true
    this.game.mulle.playAudio(this.def.Sounds[0])
    this.animations.play('opening').onComplete.addOnce(() => {
      this.bridgeOpen = true
      this.animating = false
    })
  }
}

MapObject.onExitOuter = function (car) {
  if (this.animating) return
  
  // Close bridge after car leaves
  if (this.bridgeOpen) {
    this.animating = true
    this.animations.play('closing').onComplete.addOnce(() => {
      this.bridgeOpen = false
      this.animating = false
    })
  }
}

MapObject.onEnterInner = function (car) {
  // Block car if bridge not fully open
  if (!this.bridgeOpen || this.animations.frame < 37) {
    car.speed = 0
    car.stepback(2)
  }
}
```

**Geschatte tijd:** 1-2 uur

---

### 4. Map Object: FarAway (Object ID 28)

**Status:** ⚠️ Basis geïmplementeerd, incomplete  
**Locatie:** `tools/src/objects/mapobjects/FarAway.js`  
**Database definitie:** `objects.hash.json` entry 28

**Huidige code:**
```javascript
// FarAway.js - HUIDIG (11 regels)
var MapObject = {}

MapObject.onEnterInner = function () {
  // TODO: Cutscene?
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  if (!hasMedal) {
    this.game.mulle.playAudio('05d010v0')
    this.game.mulle.user.Car.addMedal(2)
  }
}

export default MapObject
```

**Database definitie:**
```json
{
  "ObjectId": 28,
  "type": "#custom",
  "InnerRadius": 25,
  "OuterRadius": 45,
  "CustomObject": "FarAway",
  "Sounds": [],
  "FrameList": {"normal": ["Dummy"]},
  "SetWhenDone": {"Medals": [2]},
  "CheckFor": {"Medals": [2]},
  "IfFound": "#NoDisplay"
}
```

**Probleem:**
- Geen visuele feedback (sprite = "Dummy")
- Geen cutscene (origineel had waarschijnlijk Doris Digital intro)
- Medaille 2 = "Ver Bort" (Far Away medal)
- Audio `05d010v0` bestaat maar is niet gedocumenteerd

**Implementatie aanpak:**
1. Analyseer originele 05.DXR voor FarAway trigger locatie
2. Check of er een cutscene sprite bestaat
3. Voeg visuele indicator toe (bord, signaal)
4. Integreer met Mission 4 (Doris Digital) indien relevant

**Verbeterde code:**
```javascript
// FarAway.js - VERBETERD
var MapObject = {}

MapObject.onCreate = function () {
  // Check if already obtained medal
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  
  if (hasMedal) {
    // Hide object per database spec
    this.enabled = false
    this.renderable = false
  } else {
    // Voeg visuele marker toe
    // TODO: Check if sprite exists in 05.DXR
    console.log('[FarAway] Awaiting player at', this.position)
  }
}

MapObject.onEnterInner = function (car) {
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  
  if (!hasMedal) {
    // Play narrator voice
    this.game.mulle.playAudio('05d010v0', () => {
      // Give medal
      this.game.mulle.user.Car.addMedal(2)
      console.log('[FarAway] Medal 2 obtained!')
      
      // Hide object
      this.enabled = false
      this.renderable = false
      
      // Optional: Show achievement notification
      // TODO: Add medal popup/notification
    })
  }
}

export default MapObject
```

**Geschatte tijd:** 2-3 uur (inclusief sprite extractie)

---

### 5. Map Object: Sound (Object ID 33)

**Status:** 🔴 Leeg stub  
**Locatie:** `tools/src/objects/mapobjects/Sound.js`  
**Database definitie:** `objects.hash.json` entry 33

**Huidige code:**
```javascript
// Sound.js - HUIDIG (9 regels - LEEG!)
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  console.error('unfinished object', this.id, this)
}

MapObject.onEnterInner = function () {
  // LEEG
}

export default MapObject
```

**Database definitie:**
```json
{
  "ObjectId": 33,
  "type": "#custom",
  "InnerRadius": 20,
  "OuterRadius": 0,
  "CustomObject": "Sound",
  "Sounds": [],
  "FrameList": [],
  "SpriteInfo": {"Over": 1}
}
```

**Functionaliteit:**
- Trigger zone die sound afspeelt wanneer speler dichtbij komt
- Geen sprite (invisible trigger)
- `OuterRadius: 0` betekent alleen InnerRadius actief
- `SpriteInfo.Over: 1` = render above car (maar geen sprite gedefinieerd)

**Implementatie:**
Sound objecten worden gebruikt in verschillende maps met optionele data:
```javascript
// Voorbeeld uit map definitie:
{
  id: 33,
  position: { x: 150, y: 200 },
  opt: {
    Sound: "31d005v0"  // Welk geluid af te spelen
  }
}
```

**Volledige implementatie:**
```javascript
// Sound.js - VOLLEDIG
'use strict'

/**
 * Sound trigger object
 * Invisible zone that plays sound when car enters
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  // Sound triggers zijn invisible
  this.renderable = false
  
  // Haal geluid uit optionele data
  this.triggerSound = this.opt?.Sound || null
  this.hasPlayed = false
  
  if (!this.triggerSound) {
    console.warn('[Sound] No sound defined for trigger at', this.position)
  }
  
  console.debug('[Sound] Trigger created:', this.triggerSound, 'at', this.position)
}

MapObject.onEnterInner = function (car) {
  // Speel geluid alleen eerste keer
  if (!this.hasPlayed && this.triggerSound) {
    console.log('[Sound] Playing trigger sound:', this.triggerSound)
    this.game.mulle.playAudio(this.triggerSound)
    this.hasPlayed = true
    
    // Reset na verlaten (optioneel - hangt af van gewenst gedrag)
    // this.hasPlayed = false;
  }
}

MapObject.onExitInner = function (car) {
  // Optioneel: Reset voor herhaalde triggers
  // this.hasPlayed = false
}

export default MapObject
```

**Alternatief: Herbruikbare trigger:**
```javascript
// Voor geluiden die elke keer moeten spelen (bijv. brug kraken)
MapObject.onEnterInner = function (car) {
  if (this.triggerSound && !this.playing) {
    this.playing = true
    const audio = this.game.mulle.playAudio(this.triggerSound)
    
    audio.onStop.addOnce(() => {
      this.playing = false
    })
  }
}
```

**Geschatte tijd:** 1 uur

---

### 6. Map Object: Teleport (Object ID 34)

**Status:** 🔴 Leeg stub  
**Locatie:** `tools/src/objects/mapobjects/Teleport.js`  
**Database definitie:** `objects.hash.json` entry 34

**Huidige code:**
```javascript
// Teleport.js - HUIDIG (9 regels - LEEG!)
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  console.error('unfinished object', this.id, this)
}

MapObject.onEnterInner = function () {
  // LEEG
}

export default MapObject
```

**Database definitie:**
```json
{
  "ObjectId": 34,
  "type": "#custom",
  "InnerRadius": 20,
  "OuterRadius": 0,
  "CustomObject": "Teleport",
  "Sounds": [],
  "FrameList": [],
  "SpriteInfo": {"Over": 1}
}
```

**Functionaliteit:**
Teleport objecten verplaatsen de auto naar een andere positie op de map. Gebruikt voor:
- Tunnels
- Bruggen met discontinuïteit
- Shortcuts
- Map edges (wrap-around)

**Map data structuur:**
```javascript
// In map definitie (maps.hash.json):
{
  objects: [
    [34, {x: 100, y: 150}, {
      TargetX: 400,
      TargetY: 150,
      TargetMap: null,  // null = zelfde map, anders map coordinate
      Direction: 2      // Richting na teleport (1-4)
    }]
  ]
}
```

**Volledige implementatie:**
```javascript
// Teleport.js - VOLLEDIG
'use strict'

/**
 * Teleport object
 * Instantly moves car to another position
 * Used for tunnels, bridges, map transitions
 * @type {MulleMapObject}
 */
var MapObject = {}

MapObject.onCreate = function () {
  // Teleports zijn meestal invisible (tenzij tunnel sprite)
  this.renderable = false
  
  // Parse teleport target uit optionele data
  this.targetX = this.opt?.TargetX || null
  this.targetY = this.opt?.TargetY || null
  this.targetMap = this.opt?.TargetMap || null  // Voor cross-map teleports
  this.targetDirection = this.opt?.Direction || null
  
  // Teleport effect (optioneel)
  this.playEffect = this.opt?.Effect !== false
  this.effectSound = this.opt?.Sound || null
  
  if (!this.targetX || !this.targetY) {
    console.error('[Teleport] Invalid configuration - no target position!', this.opt)
  }
  
  console.debug('[Teleport] Created:', {
    from: this.position,
    to: {x: this.targetX, y: this.targetY},
    map: this.targetMap,
    direction: this.targetDirection
  })
}

MapObject.onEnterInner = function (car) {
  console.log('[Teleport] Activating teleport...')
  
  // Disable car tijdens teleport
  car.enabled = false
  
  // Speel effect geluid
  if (this.effectSound) {
    this.game.mulle.playAudio(this.effectSound)
  }
  
  // Check of cross-map teleport
  if (this.targetMap) {
    // Teleport naar andere map
    this.teleportToMap(car)
  } else {
    // Teleport binnen zelfde map
    this.teleportLocal(car)
  }
}

MapObject.teleportLocal = function (car) {
  // Visual fade effect (optioneel)
  if (this.playEffect) {
    const fade = this.game.add.graphics(0, 0)
    fade.beginFill(0x000000, 0)
    fade.drawRect(0, 0, 640, 480)
    
    // Fade out
    this.game.add.tween(fade).to({alpha: 1}, 200, Phaser.Easing.Linear.None, true)
      .onComplete.addOnce(() => {
        // Verplaats auto
        car.position.set(this.targetX, this.targetY)
        
        if (this.targetDirection) {
          car.direction = this.targetDirection
        }
        
        // Fade in
        this.game.add.tween(fade).to({alpha: 0}, 200, Phaser.Easing.Linear.None, true)
          .onComplete.addOnce(() => {
            fade.destroy()
            car.enabled = true
            
            // Voorkom direct re-trigger
            this.enteredInner = true
            this.game.time.events.add(500, () => {
              this.enteredInner = false
            })
          })
      })
  } else {
    // Direct teleport zonder effect
    car.position.set(this.targetX, this.targetY)
    
    if (this.targetDirection) {
      car.direction = this.targetDirection
    }
    
    car.enabled = true
    
    // Voorkom re-trigger
    this.enteredInner = true
    this.game.time.events.add(500, () => {
      this.enteredInner = false
    })
  }
}

MapObject.teleportToMap = function (car) {
  // Sla huidige state op
  const worldState = this.game.state.states['world']
  
  if (!worldState) {
    console.error('[Teleport] World state not found!')
    car.enabled = true
    return
  }
  
  // Verander map
  worldState.changeMap(this.targetMap, true)
  
  // Set car positie
  car.position.set(this.targetX, this.targetY)
  
  if (this.targetDirection) {
    car.direction = this.targetDirection
  }
  
  car.enabled = true
  
  console.log('[Teleport] Teleported to map:', this.targetMap)
}

export default MapObject
```

**Test scenario's:**
1. **Tunnel:** `{TargetX: 500, TargetY: 100, Effect: true, Sound: "tunnel_whoosh"}`
2. **Map transition:** `{TargetX: 50, TargetY: 240, TargetMap: {x: 2, y: 1}}`
3. **Direction change:** `{TargetX: 200, TargetY: 200, Direction: 3}` (180° turn)

**Geschatte tijd:** 3-4 uur (inclusief testing)

---

### 7. DLC Extra Parts - Integratie

**Status:** 🟡 Bestanden aanwezig, niet geïntegreerd  
**Locatie:** `/dlc/` directory (10 pakket*.cst files)  
**Relevante code:** `tools/src/struct/savedata.js`

**Beschikbare DLC bestanden:**
```
dlc/pakket1.cst   - Oom Otto pakket 1
dlc/pakket2.cst   - Oom Otto pakket 2
dlc/pakket3.cst   - Oom Otto pakket 3
dlc/pakket4.cst   - Oom Otto pakket 4
dlc/pakket5.cst   - Oom Otto pakket 5
dlc/pakket6.cst   - Oom Otto pakket 6
dlc/pakket7.cst   - Oom Otto pakket 7
dlc/pakket8.cst   - Oom Otto pakket 8
dlc/pakket9.cst   - Oom Otto pakket 9
dlc/pakket10.cst  - Oom Otto pakket 10
```

**Functionaliteit in origineel:**
- Oom Otto (Uncle Otto) stuurt extra onderdelen per post
- "Mail order" systeem - speler kan pakketten bestellen
- Elk pakket bevat 3-5 exclusieve onderdelen
- Unlock na bepaalde achievements

**Implementatie stappen:**

#### 1. Analyseer pakket bestanden
```bash
cd /Users/sander/projects/mulle-meck-game
python3 tools/build_scripts/build.py --dlc dlc/pakket1.cst
```

#### 2. Extraheer part data
```python
# tools/extract_dlc_parts.py
import os
import json
from build_scripts.ShockwaveParser import ShockwaveParser

dlc_parts = {}

for i in range(1, 11):
    filepath = f'dlc/pakket{i}.cst'
    parser = ShockwaveParser(filepath)
    parser.read()
    
    # Extract parts from cast members
    parts = []
    for lib in parser.castLibraries:
        for member_id, member in lib.get('members', {}).items():
            if member.get('castType') == 1:  # BITMAP
                parts.append({
                    'id': f'dlc{i}_{member_id}',
                    'member': member_id,
                    'name': member.get('name', f'DLC Part {member_id}')
                })
    
    dlc_parts[f'pakket{i}'] = parts

with open('data/dlc_parts.json', 'w') as f:
    json.dump(dlc_parts, f, indent=2)
```

#### 3. Integreer in parts database
```javascript
// tools/src/struct/savedata.js - uitbreiding
class MulleSave {
  constructor(game) {
    // ... existing code ...
    
    this.DLCPurchased = []  // Gekochte pakketten [1, 3, 5]
    this.DLCAvailable = []  // Beschikbare pakketten om te kopen
  }
  
  unlockDLCPackage(packageNum) {
    if (this.DLCPurchased.includes(packageNum)) {
      return false  // Already owned
    }
    
    // Load DLC parts
    const dlcParts = this.game.cache.getJSON('dlcParts')
    const packageParts = dlcParts[`pakket${packageNum}`]
    
    packageParts.forEach(part => {
      this.addPart('dlc', part.id, null, true)
    })
    
    this.DLCPurchased.push(packageNum)
    this.save()
    
    return true
  }
}
```

#### 4. Mailbox UI in Yard scene
```javascript
// tools/src/scenes/yard.js - na mailbox click
showDLCShop() {
  const shopMenu = this.game.add.group()
  
  // Background
  const bg = this.game.add.graphics(0, 0)
  bg.beginFill(0x000000, 0.8)
  bg.drawRect(0, 0, 640, 480)
  shopMenu.add(bg)
  
  // Title
  const title = this.game.add.text(320, 50, 'Oom Otto\'s Winkel', {
    font: 'bold 32px Arial',
    fill: '#FFD700'
  })
  title.anchor.set(0.5)
  shopMenu.add(title)
  
  // DLC packages
  let y = 120
  for (let i = 1; i <= 10; i++) {
    const owned = this.game.mulle.user.DLCPurchased.includes(i)
    
    const packageBtn = this.game.add.text(320, y, 
      owned ? `✓ Pakket ${i} (Gekocht)` : `Pakket ${i} - Bestellen`,
      {
        font: '24px Arial',
        fill: owned ? '#888888' : '#FFFFFF'
      }
    )
    packageBtn.anchor.set(0.5)
    packageBtn.inputEnabled = !owned
    
    if (!owned) {
      packageBtn.events.onInputUp.add(() => {
        this.purchaseDLC(i)
        shopMenu.destroy()
      })
    }
    
    shopMenu.add(packageBtn)
    y += 35
  }
  
  // Close button
  const closeBtn = this.game.add.text(320, 450, 'Sluiten', {
    font: '24px Arial',
    fill: '#FF0000'
  })
  closeBtn.anchor.set(0.5)
  closeBtn.inputEnabled = true
  closeBtn.events.onInputUp.add(() => {
    shopMenu.destroy()
  })
  shopMenu.add(closeBtn)
}

purchaseDLC(packageNum) {
  const success = this.game.mulle.user.unlockDLCPackage(packageNum)
  
  if (success) {
    // Play purchase sound
    this.game.mulle.playAudio('04e007v0')  // Success jingle
    
    // Show notification
    alert(`Pakket ${packageNum} aangekomen! Nieuwe onderdelen beschikbaar in garage.`)
  }
}
```

#### 5. Assets build
```javascript
// tools/assets.py - toevoegen
def build_dlc():
    """Build DLC package assets"""
    for i in range(1, 11):
        resDlc = Resource(f'dlc{i}')
        resDlc.addFile({
            'dir': f'dlc/pakket{i}.cst',
            'lib': 'Internal',
            'type': 'bitmap'
        })
        resDlc.build()
```

**Geschatte tijd:** 12-16 uur (extractie + integratie + UI)

---

### 8-9. Prioriteit 1 Samenvatting

**Totaal Prioriteit 1:** 9 items  
**Geschatte totale tijd:** 32-45 uur

**Kritieke pad:**
1. Sound + Teleport (4 uur) - Simpelst
2. BridgeC fix (2 uur) - Quick win
3. FarAway (3 uur) - Medium
4. File Delete (3 uur) - UI werk
5. File Browser scene (12 uur) - Grootste feature
6. DLC Integratie (16 uur) - Complex maar leuk

---

## 🔧 PRIORITEIT 2 - Work in Progress

Deze features zijn al deels geïmplementeerd maar nog niet compleet.

### 10. Figge's Junkyard Minigame

**Status:** 🟡 Basis aanwezig, minigame logic ontbreekt  
**Locatie:** `tools/src/scenes/junk.js`  
**Gerelateerd:** `tools/src/scenes/figgeferrum.js`

**Huidige implementatie:**
```javascript
// junk.js heeft:
- Junk piles (klikbaar, geven parts)
- Buffa animatie (springend mannetje)
- Part collectie logica
```

**Ontbreekt:**
1. **Timing minigame:** Klik op juiste moment wanneer Buffa springt
2. **Score systeem:** Beter timing = betere parts
3. **Difficulty curve:** Sneller na meerdere successen
4. **Failure state:** Te laat klikken = geen part

**Origineel Lingo logica (02.DXR):**
```lingo
-- Pseudo-code van origineel
on mouseDown
  -- Check if Buffa is at jump peak
  currentFrame = sprite(buffa).memberNum
  
  if currentFrame >= 15 and currentFrame <= 18 then
    -- Perfect timing!
    giveExtraPart()
  else if currentFrame >= 10 and currentFrame <= 22 then
    -- Good timing
    giveNormalPart()
  else
    -- Missed
    playFailSound()
  end if
end
```

**Implementatie plan:**

#### Stap 1: Analyseer Buffa animatie
```javascript
// junk.js - onCreate
this.buffa = new MulleActor(this.game, 450, 300, 'buffa')
this.buffa.animations.add('jump', [...frames], 30, true)
this.buffa.animations.play('jump')

// Track jump cycle
this.buffa.jumpPhase = 0  // 0-1 where 0.5 = peak
```

#### Stap 2: Timing detectie
```javascript
// junk.js - in pile click handler
onPileClick(pile) {
  // Get current jump phase
  const jumpPhase = this.getJumpPhase()
  
  // Score timing (0 = miss, 1 = perfect)
  let score = 0
  if (jumpPhase >= 0.4 && jumpPhase <= 0.6) {
    score = 1.0  // Perfect
  } else if (jumpPhase >= 0.3 && jumpPhase <= 0.7) {
    score = 0.7  // Good
  } else if (jumpPhase >= 0.2 && jumpPhase <= 0.8) {
    score = 0.4  // OK
  } else {
    score = 0    // Miss
  }
  
  this.givePart(pile, score)
}

getJumpPhase() {
  // Calculate 0-1 phase based on animation frame
  const anim = this.buffa.animations.currentAnim
  const progress = anim.frame / anim.frameTotal
  
  // Convert to sine wave (jump arc)
  return Math.sin(progress * Math.PI * 2) * 0.5 + 0.5
}
```

#### Stap 3: Part quality based on timing
```javascript
givePart(pile, timingScore) {
  let part = null
  
  if (timingScore >= 0.9) {
    // Perfect: Rare part
    part = this.getRarePart(pile)
    this.game.mulle.playAudio('02e011v0')  // Success sound
    this.showTimingFeedback('Perfect!', '#FFD700')
  } else if (timingScore >= 0.6) {
    // Good: Normal part
    part = this.getNormalPart(pile)
    this.game.mulle.playAudio('02e012v0')
    this.showTimingFeedback('Good!', '#00FF00')
  } else if (timingScore >= 0.3) {
    // OK: Common part
    part = this.getCommonPart(pile)
    this.game.mulle.playAudio('02e013v0')
    this.showTimingFeedback('OK', '#FFFF00')
  } else {
    // Miss: No part
    this.game.mulle.playAudio('02e014v0')  // Fail sound
    this.showTimingFeedback('Missed!', '#FF0000')
    return
  }
  
  // Add part to inventory
  this.addPartToInventory(part)
  pile.destroy()
}

showTimingFeedback(text, color) {
  const feedback = this.game.add.text(320, 100, text, {
    font: 'bold 48px Arial',
    fill: color,
    stroke: '#000000',
    strokeThickness: 4
  })
  feedback.anchor.set(0.5)
  
  this.game.add.tween(feedback)
    .to({alpha: 0, y: 50}, 1000, Phaser.Easing.Cubic.Out, true)
    .onComplete.add(() => feedback.destroy())
}
```

**Geschatte tijd:** 6-8 uur

---

### 11. Figge Ferrum Reward Systeem

**Status:** 🟡 Figge geeft parts, maar geen progressie systeem  
**Locatie:** `tools/src/scenes/garage.js` (figge() method)  
**Scene:** 92.DXR (Figge Ferrum auto shop)

**Huidige code:**
```javascript
// garage.js - lijn 65-140
figgeGiveParts () {
  if (this.game.mulle.user.availableParts.JunkMan.length > 0) {
    for (let i = 0; i < 3; i++) {
      const partId = this.game.mulle.user.availableParts.JunkMan[i]
      if (!partId) break
      
      this.game.mulle.user.addPart('yard', partId, null, true)
      console.log('figge add part', partId)
    }
    
    this.game.mulle.user.save()
    return true
  }
  
  return false
}
```

**Ontbreekt:**
1. **Visit counter:** Hoeveel keer speler naar Figge is gegaan
2. **Unlock tiers:** Betere parts na meer bezoeken
3. **Random part pool:** Niet altijd dezelfde parts
4. **Special deals:** Rare parts voor completionisten

**Database structuur:**
```javascript
// In savedata.js
this.FiggeVisits = 0
this.FiggeUnlocks = {
  tier1: false,  // Bezoek 1-3
  tier2: false,  // Bezoek 4-6
  tier3: false,  // Bezoek 7+
  vip: false     // Alle medals + missions
}
```

**Implementatie:**
```javascript
// garage.js - verbeterde figgeGiveParts
figgeGiveParts() {
  // Increment visit counter
  this.game.mulle.user.FiggeVisits++
  
  // Determine part tier based on visits
  let tier = 1
  if (this.game.mulle.user.FiggeVisits >= 7) {
    tier = 3
    this.game.mulle.user.FiggeUnlocks.tier3 = true
  } else if (this.game.mulle.user.FiggeVisits >= 4) {
    tier = 2
    this.game.mulle.user.FiggeUnlocks.tier2 = true
  } else {
    this.game.mulle.user.FiggeUnlocks.tier1 = true
  }
  
  // VIP check (all content unlocked)
  const allMedals = this.game.mulle.user.Car.Medals.length >= 5
  const allMissions = this.game.mulle.user.Missions.completed.length >= 8
  if (allMedals && allMissions) {
    tier = 4
    this.game.mulle.user.FiggeUnlocks.vip = true
  }
  
  // Get part pool for tier
  const partPool = this.getFiggePartPool(tier)
  
  // Give 3 random parts
  const givenParts = []
  for (let i = 0; i < 3; i++) {
    if (partPool.length === 0) break
    
    const randomIndex = Math.floor(Math.random() * partPool.length)
    const partId = partPool.splice(randomIndex, 1)[0]
    
    this.game.mulle.user.addPart('yard', partId, null, true)
    givenParts.push(partId)
  }
  
  this.game.mulle.user.save()
  
  console.log(`[Figge] Visit ${this.game.mulle.user.FiggeVisits}, Tier ${tier}:`, givenParts)
  
  return givenParts.length > 0
}

getFiggePartPool(tier) {
  const allParts = this.game.mulle.PartsDB
  const pool = []
  
  // Filter parts based on tier
  Object.keys(allParts).forEach(partId => {
    const part = allParts[partId]
    
    // Skip parts player already has
    if (this.game.mulle.user.hasPart(partId)) return
    
    // Tier 1: Common parts (Rarity <= 2)
    if (tier === 1 && part.Rarity <= 2) {
      pool.push(partId)
    }
    
    // Tier 2: Uncommon + Common (Rarity <= 3)
    if (tier === 2 && part.Rarity <= 3) {
      pool.push(partId)
    }
    
    // Tier 3: All except legendary (Rarity <= 4)
    if (tier === 3 && part.Rarity <= 4) {
      pool.push(partId)
    }
    
    // Tier 4 (VIP): All parts including legendary
    if (tier === 4) {
      pool.push(partId)
    }
  })
  
  return pool
}
```

**Visual feedback in Figge scene:**
```javascript
// figgeferrum.js - onCreate
showFiggeTier() {
  const visits = this.game.mulle.user.FiggeVisits
  const tier = this.getCurrentTier()
  
  const tierText = [
    'Nieuwe klant!',
    'Trouwe klant!',
    'VIP klant!',
    'Legende!'
  ][tier - 1]
  
  const badge = this.game.add.text(550, 50, tierText, {
    font: 'bold 20px Arial',
    fill: ['#CCCCCC', '#FFD700', '#FF6600', '#FF00FF'][tier - 1]
  })
  badge.anchor.set(0.5)
  
  // Pulse animation
  this.game.add.tween(badge.scale)
    .to({x: 1.2, y: 1.2}, 500, Phaser.Easing.Sinusoidal.InOut, true, 0, -1, true)
}
```

**Geschatte tijd:** 4-6 uur

---

## 🎨 PRIORITEIT 3 - Functional maar niet af

Deze features werken maar kunnen verbeterd worden. Niet kritiek voor release.

### 12. Mulle Animaties (02.DXR, 04.DXR, 10.DXR)

**Status:** 🟡 Basis animaties werken, dialoog animaties ontbreken  
**Locaties:**
- `02.DXR` - Junkyard Mulle
- `04.DXR` - Yard Mulle
- `10.DXR` - Menu Mulle

**Huidige implementatie:**
```javascript
//Voorbeeld uit junk.js
var mulleBase = new MulleActor(this.game, 100, 300, 'mulleJunkBase')
mulleBase.animations.play('idle')

var mulleMouth = new MulleActor(this.game, 100, 300, 'mulleJunkMouth')
mulleMouth.animations.play('idle')
```

**Ontbreekt:**
- Point gesture tijdens dialoog
- Look left/right
- Surprised expression
- Tool holding animations

**Implementatie:** Zie bestaande garage.js voor referentie

**Geschatte tijd:** 3-4 uur per scene = 9-12 uur totaal

---

### 13. Figge Parts (03.DXR)

**Status:** ✅ Werkt, maar part selectie kan beter

Zie Prioriteit 2 #11 voor verbeteringen.

**Geschatte tijd:** Inbegrepen in #11

---

### 14. World Toolbox (05.DXR)

**Status:** 🟡 Toolbox bestaat, inventaris display incomplete  
**Locatie:** `tools/src/objects/toolbox.js`

**Huidige functionaliteit:**
- Toolbox icon zichtbaar
- Click opent inventaris
- Parts tonen
- Medals tonen (basis)

**Ontbreekt:**
- Part categorieën (wielen, motoren, etc.)
- Scroll functionaliteit
- Part info tooltip
- Medals met beschrijving

**Implementatie:** Extend bestaande MulleToolbox class

**Geschatte tijd:** 4-6 uur

---

### 15. Car Load/Save Polish (06.DXR)

**Status:** 🟡 Save/load werkt, UI kan beter  
**Locatie:** Ingebouwd in garage + menu

**Verbeteringen:**
- Thumbnail preview van auto
- Save slot beschrijving
- Timestamp
- Part count indicator

**Geschatte tijd:** 3-4 uur

---

### 16. File Browser Logic (13.DXR)

**Status:** ❌ Zie Prioriteit 1 #1

Inbegrepen in #1.

---

### 17. Figge Ferrum Buffa (92.DXR)

**Status:** 🟡 Scene bestaat, Buffa animatie basis  
**Locatie:** `tools/src/scenes/figgeferrum.js`

**Huidige code:**
```javascript
// figgeferrum.js - lijn 65-85
this.buffa = new MulleActor(this.game, 450, 350, 'buffaFigge')
this.buffa.animations.add('idle', [0, 1, 2, 3], 10, true)
this.buffa.animations.play('idle')
```

**Ontbreekt:**
- Interactie met Buffa
- Buffa praat/gebaren
- Easter egg dialogen

**Implementatie:**
```javascript
// Click handler
this.buffa.inputEnabled = true
this.buffa.events.onInputUp.add(() => {
  this.buffaTalk()
})

buffaTalk() {
  const randomDialogs = [
    '92d005v0',  // "Hej!"
    '92d006v0',  // "Vad gör du?"
    '92d007v0'   // "Har du sett Figge?"
  ]
  
  const dialog = Phaser.ArrayUtils.getRandomItem(randomDialogs)
  this.buffa.talk(dialog)
}
```

**Geschatte tijd:** 2-3 uur

---

### 18-20. Prioriteit 3 Samenvatting

**Totaal Prioriteit 3:** 9 items (waarvan 7 uniek)  
**Geschatte totale tijd:** 21-29 uur

**Nice-to-have volgorde:**
1. Toolbox polish (6 uur)
2. Save/Load UI (4 uur)
3. Mulle animaties Yard (4 uur)
4. Buffa interactie (3 uur)
5. Mulle animaties Junkyard (4 uur)

---

## 📊 Totaal Overzicht

### Implementatie Tijdlijn

| Prioriteit | Items | Geschatte Tijd | Kritiek |
|------------|-------|----------------|---------|
| **P1** | 9 | 32-45 uur | ✅ Ja |
| **P2** | 2 | 10-14 uur | ⚠️ Medium |
| **P3** | 9 | 21-29 uur | ❌ Nee |
| **TOTAAL** | **20** | **63-88 uur** | |

### Aanbevolen Implementatie Volgorde

**Week 1: Quick Wins (16 uur)**
1. Sound object (1u)
2. Teleport object (4u)
3. BridgeC fix (2u)
4. FarAway (3u)
5. File Delete (3u)
6. Figge Buffa easter egg (3u)

**Week 2: Core Features (20 uur)**
7. File Browser scene (12u)
8. Toolbox polish (6u)
9. Save/Load UI (4u)

**Week 3: Advanced Features (22 uur)**
10. DLC Integratie (16u)
11. Figge timing minigame (6u)

**Week 4: Polish (16 uur)**
12. Figge reward tiers (6u)
13. Mulle animaties (10u)

**Total: 74 uur (gemiddelde van schatting)**

---

## 🔧 Technische Referenties

### Bestaande Code Patterns

**Map Object Pattern:**
```javascript
// mapobjects/Example.js
var MapObject = {}

MapObject.onCreate = function () {
  // Initialize state
}

MapObject.onEnterOuter = function (car) {
  // Outer radius trigger
}

MapObject.onEnterInner = function (car) {
  // Inner radius trigger (main action)
}

MapObject.onExitInner = function (car) {
  // Cleanup
}

export default MapObject
```

**Scene Pattern:**
```javascript
// scenes/example.js
import MulleState from './base'

class ExampleState extends MulleState {
  preload() {
    super.preload()
    this.game.load.pack('example', 'assets/example.json')
  }
  
  create() {
    super.create()
    // Setup scene
  }
  
  shutdown() {
    this.game.sound.stopAll()
  }
}

export default ExampleState
```

### Database Structuren

**Object Database:**
`tools/data/objects.hash.json`
```json
{
  "ObjectId": 33,
  "type": "#custom",
  "InnerRadius": 20,
  "OuterRadius": 0,
  "CustomObject": "Sound",
  "Sounds": [],
  "FrameList": [],
  "SetWhenDone": {},
  "CheckFor": {},
  "IfFound": "#None"
}
```

**Part Database:**
`tools/data/parts.hash.json` (300+ entries)

**Maps Database:**
`tools/data/maps.hash.json` (terrain, objects, coordinates)

---

## 🎯 Deliverables per Feature

### P1 Features Checklist

- [ ] **Sound Object**
  - [ ] Implementatie in `Sound.js`
  - [ ] Test met 3 verschillende sounds
  - [ ] Documentatie

- [ ] **Teleport Object**
  - [ ] Local teleport
  - [ ] Cross-map teleport
  - [ ] Visual effect
  - [ ] 5 test scenarios

- [ ] **BridgeC Fix**
  - [ ] Open/close animatie
  - [ ] Car blocking logic
  - [ ] Sound integration

- [ ] **FarAway**
  - [ ] Medal trigger
  - [ ] Audio playback
  - [ ] Hide after completion

- [ ] **File Delete**
  - [ ] Delete button UI
  - [ ] Confirmation dialog
  - [ ] localStorage update
  - [ ] Refresh UI

- [ ] **File Browser Scene**
  - [ ] Scene setup
  - [ ] File list rendering
  - [ ] Car preview
  - [ ] Load functionaliteit
  - [ ] Delete integratie

- [ ] **DLC Parts**
  - [ ] Pak 1-10 extractie
  - [ ] Parts database
  - [ ] Shop UI
  - [ ] Purchase logic
  - [ ] Asset building

### P2 Features Checklist

- [ ] **Junkyard Minigame**
  - [ ] Buffa jump tracking
  - [ ] Timing detection
  - [ ] Score feedback
  - [ ] Part quality tiers

- [ ] **Figge Rewards**
  - [ ] Visit counter
  - [ ] Tier system
  - [ ] Part pool logic
  - [ ] VIP unlocks

---

## 📝 Implementatie Notes

### Tools & Commands

**Extract sprites:**
```bash
cd /Users/sander/projects/mulle-meck-game/tools
python build_scripts/build.py --scene 13
```

**Build assets:**
```bash
npm run build
```

**Test in browser:**
```bash
npm run dev
# Open http://localhost:8080
```

**Production build:**
```bash
npm run build-prod
```

### Debugging Tips

**Enable object debug:**
```javascript
// In mapobject.js constructor
if (this.game.mulle.debug) {
  this.debugGraphics = this.game.add.graphics()
  this.debugGraphics.lineStyle(2, 0xFF0000)
  this.debugGraphics.drawCircle(this.x, this.y, this.InnerRadius)
  this.debugGraphics.lineStyle(1, 0x00FF00)
  this.debugGraphics.drawCircle(this.x, this.y, this.OuterRadius)
}
```

**Console logging:**
```javascript
console.debug('[ObjectType] Message', data)  // Only in debug mode
console.log('[ObjectType] Message')          // Always
console.error('[ObjectType] Error!', err)    // Errors
```

---

## ✅ Volgende Stappen

### Directe Acties (Week 1)

1. **Start met Sound object** (makkelijkste win)
   ```bash
   code tools/src/objects/mapobjects/Sound.js
   ```

2. **Fix BridgeC** (quick improvement)
   ```bash
   code tools/src/objects/mapobjects/CBridge.js
   ```

3. **Teleport implementatie** (medium complexity)
   ```bash
   code tools/src/objects/mapobjects/Teleport.js
   ```

4. **Test alle 3 in game**
   ```bash
   npm run dev
   ```

### Review Checkpoints

- Na P1 items 1-5: Playtest map objects
- Na P1 item 6: Test file browser flow
- Na P1 item 7: DLC shop testing
- Na P2: Full gameplay test
- Voor release: Complete playthrough

---

## 📚 Referenties

**Project Files:**
- `/Users/sander/projects/mulle-meck-game/STATUS.md` - Huidige status
- `/Users/sander/projects/mulle-meck-game/tools/src/scenes/world.js` - World map code
- `/Users/sander/projects/mulle-meck-game/tools/src/objects/mapobject.js` - Base object
- `/Users/sander/projects/mulle-meck-game/tools/data/*.hash.json` - Databases

**Originele Assets:**
- `/Users/sander/projects/mulle-meck-game/extracted/*.DXR` - Director bestanden
- `/Users/sander/projects/mulle-meck-game/dlc/pakket*.cst` - DLC content

---

**Rapport Einde**

Dit rapport dient als complete gids voor implementatie van alle ontbrekende features. Begin met Prioriteit 1 voor een volledig speelbare versie, en werk toe naar P2/P3 voor polish en extra features.

Voor vragen of ondersteuning: zie originele Lingo code in extracted/ directory of bestaande JavaScript implementaties in tools/src/.
