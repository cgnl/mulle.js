# 🚀 Quick Implementation Guide - Mulle Meck

**Start hier voor snelle implementatie van ontbrekende features.**

---

## ⚡ Quick Wins (Start hier!)

### 1. Sound Object (1 uur)

**File:** `tools/src/objects/mapobjects/Sound.js`

```javascript
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  this.renderable = false
  this.triggerSound = this.opt?.Sound || null
  this.hasPlayed = false
  
  console.debug('[Sound] Created at', this.position, 'sound:', this.triggerSound)
}

MapObject.onEnterInner = function (car) {
  if (!this.hasPlayed && this.triggerSound) {
    console.log('[Sound] Playing:', this.triggerSound)
    this.game.mulle.playAudio(this.triggerSound)
    this.hasPlayed = true
  }
}

export default MapObject
```

**Test:**
```javascript
// In map definitie - voeg toe aan objects array:
[33, {x: 150, y: 200}, {Sound: "31d001v0"}]
```

---

### 2. BridgeC Fix (2 uur)

**File:** `tools/src/objects/mapobjects/CBridge.js`

```javascript
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  this.bridgeOpen = false
  this.animating = false
  
  this.animationHelper.add('opening', 'normal', this.opt.Direction, 3, false, true)
  this.animationHelper.add('closing', 'normal', this.opt.Direction, 3, false, false)
  
  this.setFrameList('normal', this.opt.Direction)
  this.animations.frame = 0
}

MapObject.onEnterOuter = function (car) {
  if (this.animating || this.bridgeOpen) return
  
  this.animating = true
  this.game.mulle.playAudio(this.def.Sounds[0])
  
  this.animations.play('opening').onComplete.addOnce(() => {
    this.bridgeOpen = true
    this.animating = false
  })
}

MapObject.onEnterInner = function (car) {
  if (!this.bridgeOpen || this.animations.frame < 37) {
    car.speed = 0
    car.stepback(2)
  }
}

MapObject.onExitOuter = function (car) {
  if (!this.bridgeOpen || this.animating) return
  
  this.animating = true
  this.animations.play('closing').onComplete.addOnce(() => {
    this.bridgeOpen = false
    this.animating = false
  })
}

export default MapObject
```

---

### 3. File Delete in Menu (2 uur)

**File:** `tools/src/scenes/menu.js`

**Vervang lijn 75-94 met:**

```javascript
// Display saved users
let y = 60
for (let name in this.game.mulle.UsersDB) {
  // Name text (clickable to load)
  let text = this.game.add.text(350, y, name, { font: '24px serif' })
  text.inputEnabled = true
  
  text.events.onInputOver.add(() => {
    this.game.canvas.className = 'cursor-point'
  })
  
  text.events.onInputOut.add(() => {
    this.game.canvas.className = ''
  })
  
  text.events.onInputUp.add(() => {
    this.game.canvas.className = ''
    this.game.mulle.user = this.game.mulle.UsersDB[name]
    this.game.mulle.activeCutscene = '00b011v0'
    this.game.mulle.net.send({ name: name })
    this.game.state.start('garage')
  })
  
  // Delete button
  let deleteBtn = this.game.add.text(520, y, '🗑️', { 
    font: '20px sans-serif',
    fill: '#cc0000'
  })
  deleteBtn.inputEnabled = true
  
  deleteBtn.events.onInputOver.add(() => {
    deleteBtn.fill = '#ff0000'
    this.game.canvas.className = 'cursor-point'
  })
  
  deleteBtn.events.onInputOut.add(() => {
    deleteBtn.fill = '#cc0000'
    this.game.canvas.className = ''
  })
  
  deleteBtn.events.onInputUp.add((sprite, pointer) => {
    pointer.stopPropagation = true
    
    // Confirmation (native dialog)
    if (confirm(`Verwijder "${name}"?\n\nDeze actie kan niet ongedaan gemaakt worden.`)) {
      delete this.game.mulle.UsersDB[name]
      this.game.mulle.saveData()
      
      // Refresh the scene
      this.game.state.restart()
    }
  })
  
  y += 30
}
```

---

### 4. FarAway Object (2 uur)

**File:** `tools/src/objects/mapobjects/FarAway.js`

```javascript
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  
  if (hasMedal) {
    this.enabled = false
    this.renderable = false
  }
}

MapObject.onEnterInner = function (car) {
  const hasMedal = this.game.mulle.user.Car.hasMedal(2)
  
  if (!hasMedal) {
    car.enabled = false
    
    this.game.mulle.playAudio('05d010v0', () => {
      this.game.mulle.user.Car.addMedal(2)
      console.log('[FarAway] Medal "Ver Bort" unlocked!')
      
      this.enabled = false
      this.renderable = false
      
      car.enabled = true
    })
  }
}

export default MapObject
```

---

### 5. Teleport Object (4 uur)

**File:** `tools/src/objects/mapobjects/Teleport.js`

```javascript
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  this.renderable = false
  
  this.targetX = this.opt?.TargetX || null
  this.targetY = this.opt?.TargetY || null
  this.targetMap = this.opt?.TargetMap || null
  this.targetDirection = this.opt?.Direction || null
  
  if (!this.targetX || !this.targetY) {
    console.error('[Teleport] Missing target position!', this.opt)
  }
}

MapObject.onEnterInner = function (car) {
  car.enabled = false
  
  // Fade effect
  const fade = this.game.add.graphics(0, 0)
  fade.beginFill(0x000000, 0)
  fade.drawRect(0, 0, 640, 480)
  
  this.game.add.tween(fade)
    .to({alpha: 1}, 200, Phaser.Easing.Linear.None, true)
    .onComplete.addOnce(() => {
      
      if (this.targetMap) {
        // Cross-map teleport
        const worldState = this.game.state.states['world']
        worldState.changeMap(this.targetMap, true)
      }
      
      // Move car
      car.position.set(this.targetX, this.targetY)
      
      if (this.targetDirection) {
        car.direction = this.targetDirection
      }
      
      // Fade in
      this.game.add.tween(fade)
        .to({alpha: 0}, 200, Phaser.Easing.Linear.None, true)
        .onComplete.addOnce(() => {
          fade.destroy()
          car.enabled = true
          
          // Prevent re-trigger
          this.enteredInner = true
          this.game.time.events.add(500, () => {
            this.enteredInner = false
          })
        })
    })
}

export default MapObject
```

**Test examples:**
```javascript
// Same-map tunnel
[34, {x: 100, y: 200}, {TargetX: 500, TargetY: 200}]

// With direction change
[34, {x: 100, y: 200}, {TargetX: 500, TargetY: 200, Direction: 3}]

// Cross-map teleport
[34, {x: 100, y: 200}, {TargetX: 50, TargetY: 240, TargetMap: {x: 2, y: 1}}]
```

---

## 📦 Grotere Features

### File Browser Scene (8-12 uur)

**Stap 1: Maak scene file**

**File:** `tools/src/scenes/filebrowser.js`

```javascript
import MulleState from './base'
import MulleSprite from '../objects/sprite'
import MulleBuildCar from '../objects/buildcar'

class FileBrowserState extends MulleState {
  preload() {
    super.preload()
    // Assets worden later toegevoegd
    this.game.load.pack('filebrowser', 'assets/filebrowser.json', null, this)
  }
  
  create() {
    super.create()
    
    // Background
    const bg = new MulleSprite(this.game, 320, 240)
    bg.setDirectorMember('13.DXR', 2)  // Achtergrond uit 13.DXR
    this.game.add.existing(bg)
    
    // Title
    const title = this.game.add.text(320, 30, 'Selecteer een auto', {
      font: 'bold 28px Arial',
      fill: '#333333'
    })
    title.anchor.set(0.5)
    
    // File list
    this.fileList = this.game.add.group()
    this.renderFileList()
    
    // Car preview area
    this.previewCar = null
    
    // Buttons
    this.createButtons()
  }
  
  renderFileList() {
    let y = 80
    let index = 0
    
    for (let name in this.game.mulle.UsersDB) {
      const user = this.game.mulle.UsersDB[name]
      
      // File entry background
      const entryBg = this.game.add.graphics(50, y)
      entryBg.beginFill(index % 2 === 0 ? 0xf0f0f0 : 0xe0e0e0)
      entryBg.drawRect(0, 0, 300, 40)
      this.fileList.add(entryBg)
      
      // Name text
      const nameText = this.game.add.text(60, y + 20, name, {
        font: '20px Arial',
        fill: '#000000'
      })
      nameText.anchor.set(0, 0.5)
      this.fileList.add(nameText)
      
      // Part count
      const partCount = user.Car.Parts.length
      const countText = this.game.add.text(250, y + 20, `${partCount} delen`, {
        font: '16px Arial',
        fill: '#666666'
      })
      countText.anchor.set(0, 0.5)
      this.fileList.add(countText)
      
      // Click to preview
      entryBg.inputEnabled = true
      entryBg.events.onInputUp.add(() => {
        this.showPreview(name, user)
      })
      
      // Delete button
      const delBtn = this.game.add.text(320, y + 20, '🗑️', {
        font: '18px sans-serif',
        fill: '#cc0000'
      })
      delBtn.anchor.set(0.5)
      delBtn.inputEnabled = true
      delBtn.events.onInputUp.add((sprite, pointer) => {
        pointer.stopPropagation = true
        this.deleteFile(name)
      })
      this.fileList.add(delBtn)
      
      y += 45
      index++
    }
  }
  
  showPreview(name, userData) {
    console.log('Preview:', name)
    
    // Clear previous preview
    if (this.previewCar) {
      this.previewCar.destroy()
    }
    
    // Create car preview
    this.previewCar = new MulleBuildCar(this.game, 480, 300)
    this.game.add.existing(this.previewCar)
    
    // Load parts
    userData.Car.Parts.forEach(partId => {
      this.previewCar.addPart(partId)
    })
    
    // Store selected user
    this.selectedUser = name
    
    // Enable load button
    this.loadButton.inputEnabled = true
    this.loadButton.alpha = 1.0
  }
  
  createButtons() {
    // Load button
    this.loadButton = this.game.add.text(480, 420, 'Laden', {
      font: 'bold 24px Arial',
      fill: '#00aa00'
    })
    this.loadButton.anchor.set(0.5)
    this.loadButton.inputEnabled = false
    this.loadButton.alpha = 0.5
    
    this.loadButton.events.onInputUp.add(() => {
      if (this.selectedUser) {
        this.game.mulle.user = this.game.mulle.UsersDB[this.selectedUser]
        this.game.mulle.activeCutscene = '00b011v0'
        this.game.state.start('garage')
      }
    })
    
    // Cancel button
    const cancelBtn = this.game.add.text(320, 450, 'Terug', {
      font: '20px Arial',
      fill: '#cc0000'
    })
    cancelBtn.anchor.set(0.5)
    cancelBtn.inputEnabled = true
    cancelBtn.events.onInputUp.add(() => {
      this.game.state.start('menu')
    })
  }
  
  deleteFile(name) {
    if (confirm(`Verwijder "${name}"?`)) {
      delete this.game.mulle.UsersDB[name]
      this.game.mulle.saveData()
      
      // Refresh list
      this.fileList.removeAll(true)
      if (this.previewCar) {
        this.previewCar.destroy()
        this.previewCar = null
      }
      this.renderFileList()
    }
  }
  
  shutdown() {
    this.game.sound.stopAll()
  }
}

export default FileBrowserState
```

**Stap 2: Registreer scene**

**File:** `tools/src/load.js` (voeg toe aan scene registratie)

```javascript
import FileBrowserState from './scenes/filebrowser'

// In create():
this.game.state.add('filebrowser', FileBrowserState)
```

**Stap 3: Link vanuit menu**

**File:** `tools/src/scenes/menu.js`

```javascript
// Voeg toe na nameInput (rond lijn 95):

// "Browse files" button
const browseBtn = this.game.add.text(320, 400, 'Bekijk opgeslagen auto\'s', {
  font: '20px Arial',
  fill: '#0066cc'
})
browseBtn.anchor.set(0.5)
browseBtn.inputEnabled = true

browseBtn.events.onInputOver.add(() => {
  this.game.canvas.className = 'cursor-point'
})

browseBtn.events.onInputOut.add(() => {
  this.game.canvas.className = ''
})

browseBtn.events.onInputUp.add(() => {
  this.game.state.start('filebrowser')
})
```

---

## 🎮 DLC Integratie (12-16 uur)

### Stap 1: Analyseer DLC bestanden

```bash
cd /Users/sander/projects/mulle-meck-game

# Installeer dependencies voor Python parser
pip3 install bitstring

# Analyseer pakket 1
python3 - <<'PY'
import sys
sys.path.insert(0, 'tools/build_scripts')
from ShockwaveParser import ShockwaveParser

parser = ShockwaveParser('dlc/pakket1.cst')
parser.read()

print("Cast Libraries:", len(parser.castLibraries))
for lib in parser.castLibraries:
    print(f"  Library: {lib.get('name')}")
    members = lib.get('members', {})
    print(f"    Members: {len(members)}")
    
    # Show first 5 bitmap members
    count = 0
    for mid, member in members.items():
        if member.get('castType') == 1 and count < 5:  # BITMAP
            print(f"      #{mid}: {member.get('name', 'Unnamed')}")
            count += 1
PY
```

### Stap 2: Extraheer DLC data

**File:** `tools/extract_dlc.py` (nieuw)

```python
#!/usr/bin/env python3
import sys
import json
sys.path.insert(0, 'tools/build_scripts')
from ShockwaveParser import ShockwaveParser

dlc_data = {}

for pkg_num in range(1, 11):
    filepath = f'dlc/pakket{pkg_num}.cst'
    
    try:
        parser = ShockwaveParser(filepath)
        parser.read()
        
        parts = []
        
        for lib in parser.castLibraries:
            for member_id, member in lib.get('members', {}).items():
                if member.get('castType') == 1:  # BITMAP
                    parts.append({
                        'partId': f'dlc{pkg_num}_{member_id}',
                        'memberNum': int(member_id),
                        'name': member.get('name', f'DLC Part {member_id}'),
                        'package': pkg_num
                    })
        
        dlc_data[f'pakket{pkg_num}'] = {
            'id': pkg_num,
            'name': f'Oom Otto Pakket {pkg_num}',
            'parts': parts,
            'partCount': len(parts)
        }
        
        print(f"✓ Pakket {pkg_num}: {len(parts)} parts")
        
    except Exception as e:
        print(f"✗ Pakket {pkg_num}: {e}")

# Save
with open('tools/data/dlc_packages.json', 'w') as f:
    json.dump(dlc_data, f, indent=2)

print(f"\nSaved to tools/data/dlc_packages.json")
```

**Run:**
```bash
python3 tools/extract_dlc.py
```

### Stap 3: DLC Shop UI

**File:** `tools/src/scenes/yard.js`

**Voeg toe aan create() method:**

```javascript
// DLC Shop button (bij mailbox)
this.dlcButton = this.game.add.text(500, 100, '📦 DLC', {
  font: 'bold 20px Arial',
  fill: '#FFD700',
  stroke: '#000000',
  strokeThickness: 3
})
this.dlcButton.anchor.set(0.5)
this.dlcButton.inputEnabled = true

this.dlcButton.events.onInputOver.add(() => {
  this.game.canvas.className = 'cursor-point'
  this.dlcButton.scale.set(1.1)
})

this.dlcButton.events.onInputOut.add(() => {
  this.game.canvas.className = ''
  this.dlcButton.scale.set(1.0)
})

this.dlcButton.events.onInputUp.add(() => {
  this.showDLCShop()
})
```

**Voeg method toe:**

```javascript
showDLCShop() {
  // Overlay
  const overlay = this.game.add.group()
  
  // Dark background
  const bg = this.game.add.graphics(0, 0)
  bg.beginFill(0x000000, 0.8)
  bg.drawRect(0, 0, 640, 480)
  bg.inputEnabled = true
  overlay.add(bg)
  
  // Shop window
  const shopBg = this.game.add.graphics(80, 40)
  shopBg.beginFill(0xf0e6d2)
  shopBg.lineStyle(4, 0x8B4513)
  shopBg.drawRoundedRect(0, 0, 480, 400, 10)
  overlay.add(shopBg)
  
  // Title
  const title = this.game.add.text(320, 70, 'Oom Otto\'s Winkel', {
    font: 'bold 32px Arial',
    fill: '#8B4513'
  })
  title.anchor.set(0.5)
  overlay.add(title)
  
  // Subtitle
  const subtitle = this.game.add.text(320, 105, 'Exclusieve onderdelen per post!', {
    font: '18px Arial',
    fill: '#666666'
  })
  subtitle.anchor.set(0.5)
  overlay.add(subtitle)
  
  // Load DLC data
  const dlcData = this.game.cache.getJSON('dlcPackages')
  
  // Package list
  let y = 140
  for (let i = 1; i <= 10; i++) {
    const pkgData = dlcData[`pakket${i}`]
    const owned = this.game.mulle.user.DLCPurchased.includes(i)
    
    // Package box
    const pkgBox = this.game.add.graphics(100, y)
    pkgBox.beginFill(owned ? 0xcccccc : 0xffffff)
    pkgBox.lineStyle(2, owned ? 0x888888 : 0x8B4513)
    pkgBox.drawRoundedRect(0, 0, 440, 25, 5)
    overlay.add(pkgBox)
    
    // Package name
    const pkgName = this.game.add.text(110, y + 12, pkgData.name, {
      font: owned ? '16px Arial' : 'bold 16px Arial',
      fill: owned ? '#888888' : '#000000'
    })
    pkgName.anchor.set(0, 0.5)
    overlay.add(pkgName)
    
    // Part count
    const partInfo = this.game.add.text(350, y + 12, `${pkgData.partCount} delen`, {
      font: '14px Arial',
      fill: owned ? '#888888' : '#666666'
    })
    partInfo.anchor.set(0, 0.5)
    overlay.add(partInfo)
    
    // Button
    const btnText = owned ? '✓ Gekocht' : 'Bestellen'
    const btn = this.game.add.text(480, y + 12, btnText, {
      font: '14px Arial',
      fill: owned ? '#00aa00' : '#0066cc'
    })
    btn.anchor.set(0, 0.5)
    
    if (!owned) {
      btn.inputEnabled = true
      btn.events.onInputOver.add(() => {
        btn.fill = '#0088ff'
        this.game.canvas.className = 'cursor-point'
      })
      btn.events.onInputOut.add(() => {
        btn.fill = '#0066cc'
        this.game.canvas.className = ''
      })
      btn.events.onInputUp.add(() => {
        this.purchaseDLC(i, pkgData)
        overlay.destroy()
      })
    }
    
    overlay.add(btn)
    y += 30
  }
  
  // Close button
  const closeBtn = this.game.add.text(320, 410, 'Sluiten', {
    font: 'bold 20px Arial',
    fill: '#cc0000'
  })
  closeBtn.anchor.set(0.5)
  closeBtn.inputEnabled = true
  closeBtn.events.onInputOver.add(() => {
    this.game.canvas.className = 'cursor-point'
  })
  closeBtn.events.onInputOut.add(() => {
    this.game.canvas.className = ''
  })
  closeBtn.events.onInputUp.add(() => {
    overlay.destroy()
  })
  overlay.add(closeBtn)
}

purchaseDLC(packageNum, packageData) {
  // Mark as purchased
  if (!this.game.mulle.user.DLCPurchased) {
    this.game.mulle.user.DLCPurchased = []
  }
  this.game.mulle.user.DLCPurchased.push(packageNum)
  
  // Add parts to inventory
  packageData.parts.forEach(part => {
    this.game.mulle.user.addPart('yard', part.partId, null, true)
  })
  
  this.game.mulle.user.save()
  
  // Success feedback
  this.game.mulle.playAudio('04e007v0')  // Success sound
  
  alert(`Pakket ${packageNum} aangekomen!\n${packageData.partCount} nieuwe onderdelen beschikbaar in de garage.`)
  
  console.log(`[DLC] Purchased pakket ${packageNum}:`, packageData.parts)
}
```

### Stap 4: Preload DLC data

**File:** `tools/src/scenes/yard.js` preload()

```javascript
preload() {
  // ... existing code ...
  
  this.game.load.json('dlcPackages', 'data/dlc_packages.json')
}
```

---

## 🧪 Testing Checklist

### Map Objects
```
□ Sound triggers on enter
□ Sound only plays once
□ BridgeC opens when car approaches
□ BridgeC closes after car passes
□ BridgeC blocks car when closed
□ Teleport moves car to target
□ Teleport works cross-map
□ Teleport direction change works
□ FarAway gives medal
□ FarAway hides after completion
```

### UI Features
```
□ File delete confirmation shows
□ File delete removes from list
□ File delete updates localStorage
□ File browser shows all users
□ File browser preview works
□ File browser load works
□ DLC shop shows packages
□ DLC purchase adds parts
□ DLC owned packages disabled
```

### Persistence
```
□ Deleted files stay deleted after refresh
□ DLC purchases persist
□ Medal progress saves
□ Cache flags work correctly
```

---

## 🐛 Debugging Commands

```javascript
// In browser console:

// List all map objects
game.state.states.world.mapObjects.children.forEach(o => {
  console.log(o.id, o.def.CustomObject, o.position)
})

// Teleport car manually
game.state.states.world.driveCar.position.set(300, 200)

// Give medal
game.mulle.user.Car.addMedal(2)

// Check DLC
game.mulle.user.DLCPurchased

// Force save
game.mulle.saveData()

// Reload user
game.mulle.user = game.mulle.UsersDB['TestPlayer']
```

---

## 📝 Build & Deploy

```bash
# Development mode
cd /Users/sander/projects/mulle-meck-game/tools
npm run dev

# Production build
npm run build-prod

# Test multiplayer
npm run server

# Build assets (after DLC extraction)
npm run build
```

---

## ✅ Implementation Priority

**Week 1: Core Objects (8h)**
- [ ] Sound (1h)
- [ ] Teleport (4h)
- [ ] BridgeC (2h)
- [ ] FarAway (1h)

**Week 2: UI Features (10h)**
- [ ] File Delete (2h)
- [ ] File Browser Scene (8h)

**Week 3: DLC (16h)**
- [ ] Extract DLC data (4h)
- [ ] Build DLC assets (4h)
- [ ] Shop UI (4h)
- [ ] Integration testing (4h)

**Total: ~34 hours for P1 features**

---

**Ready to start? Begin with Sound.js - it's the easiest win! 🚀**
