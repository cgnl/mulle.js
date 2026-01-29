# ⚡ Quick Reference - Mulle Meck Implementation

**Voor snelle lookup tijdens development.**

---

## 📂 File Locations

```
Map Objects:    tools/src/objects/mapobjects/*.js
Scenes:         tools/src/scenes/*.js
Databases:      tools/data/*.hash.json
Assets:         tools/assets/*.json
DLC:            dlc/pakket*.cst
Build:          tools/build_scripts/*.py
```

---

## 🎯 Prioriteit 1 - Must Have (9 items)

| # | File | Lines | Status |
|---|------|-------|--------|
| 1 | `mapobjects/Sound.js` | ~30 | 🔴 Empty |
| 2 | `mapobjects/Teleport.js` | ~120 | 🔴 Empty |
| 3 | `mapobjects/CBridge.js` | ~50 | ⚠️ Bug |
| 4 | `mapobjects/FarAway.js` | ~30 | ⚠️ Incomplete |
| 5 | `scenes/menu.js` | +40 | ❌ No delete |
| 6 | `scenes/filebrowser.js` | ~250 | ❌ Missing |
| 7 | DLC integration | ~300 | 🟡 Files exist |

---

## 🔧 Code Templates

### Map Object Skeleton
```javascript
'use strict'

var MapObject = {}

MapObject.onCreate = function () {
  // Initialize
}

MapObject.onEnterOuter = function (car) {
  // Outer radius trigger
}

MapObject.onEnterInner = function (car) {
  // Main action
}

MapObject.onExitInner = function (car) {
  // Cleanup
}

export default MapObject
```

### Scene Skeleton
```javascript
import MulleState from './base'
import MulleSprite from '../objects/sprite'

class MyScene extends MulleState {
  preload() {
    super.preload()
    this.game.load.pack('myscene', 'assets/myscene.json')
  }
  
  create() {
    super.create()
    // Setup
  }
  
  shutdown() {
    this.game.sound.stopAll()
  }
}

export default MyScene
```

---

## 📊 Database Object Structure

```json
{
  "ObjectId": 33,
  "type": "#custom",
  "InnerRadius": 20,
  "OuterRadius": 0,
  "CustomObject": "Sound",
  "DirResource": "",
  "Sounds": [],
  "FrameList": [],
  "SetWhenDone": {},
  "CheckFor": {},
  "IfFound": "#None",
  "SpriteInfo": {"Over": 1}
}
```

**Object Types:**
- `#custom` - Custom behavior (mapobjects/*.js)
- `#dest` - Scene transition
- `#rdest` - Random scene
- `#Correct` - Position correction

**Collision Radii:**
- `InnerRadius` - Main trigger zone
- `OuterRadius` - Warning/approach zone

---

## 🎮 Common Patterns

### Play Audio
```javascript
this.game.mulle.playAudio('05d010v0')

// With callback
this.game.mulle.playAudio('05d010v0', () => {
  console.log('Audio finished')
})
```

### Add Medal
```javascript
this.game.mulle.user.Car.addMedal(2)

// Check if has medal
const hasMedal = this.game.mulle.user.Car.hasMedal(2)
```

### Add Part
```javascript
this.game.mulle.user.addPart('yard', partId, null, true)
```

### Change Map
```javascript
// World state
const worldState = this.game.state.states['world']
worldState.changeMap({x: 2, y: 1}, true)  // absolute
worldState.changeMap({x: 1, y: 0}, false) // relative
```

### Animation
```javascript
// Add animation
this.animationHelper.add('animName', 'normal', direction, frameCount, loop, forward)

// Play
this.animations.play('animName')

// With callback
this.animations.play('animName').onComplete.addOnce(() => {
  console.log('Done')
})
```

### Sprite Setup
```javascript
const sprite = new MulleSprite(this.game, x, y)
sprite.setDirectorMember('05.DXR', memberNum)
this.game.add.existing(sprite)
```

### Save Data
```javascript
this.game.mulle.user.save()
this.game.mulle.saveData()  // Save all users
```

---

## 🎯 Object Database IDs

**Important Map Objects:**
- 1: Cows
- 3: Ferry
- 6: Gas station
- 7: Racing
- 25: Goats
- 26: WBridge
- 27: CBridge ⚠️
- 28: FarAway ⚠️
- 30: Hill
- 31: Position correct
- 32: Stop sign
- 33: Sound 🔴
- 34: Teleport 🔴

**Scene Destinations:**
- 2: Solhem (86.DXR)
- 4: Car show (94.DXR)
- 5: Sture Stortand (88.DXR)
- 8: Tree car (83.DXR)
- 9: Road dog (85.DXR)
- 10: Mud car (82.DXR)
- 11: Ludde Labb (91.DXR)
- 12: Viola (89.DXR)
- 14: Figge Ferrum (92.DXR)
- 15: Yard (04.DXR)
- 16: Ocean (93.DXR)
- 17: Doris Digital (90.DXR)
- 18: Saftfabrik (87.DXR)

---

## 🛠️ Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build-prod

# Build assets
npm run build

# Extract DLC
python3 tools/extract_dlc.py

# Extract scene
python3 tools/build_scripts/build.py --scene 13
```

---

## 🐛 Debug Console Commands

```javascript
// Game state
game.state.current

// World state
game.state.states.world

// Map objects
game.state.states.world.mapObjects.children

// User data
game.mulle.user

// All users
game.mulle.UsersDB

// Car parts
game.mulle.user.Car.Parts

// Medals
game.mulle.user.Car.Medals

// Force save
game.mulle.saveData()

// Teleport car
game.state.states.world.driveCar.position.set(300, 200)

// Change direction
game.state.states.world.driveCar.direction = 2

// Enable debug mode
game.mulle.debug = true
```

---

## 📝 Asset Member Numbers

**CDDATA.CXT (Standalone):**
- 19: Mail image - Car show
- 20: Mail image - Lemonade
- 21: Mail image - Viola
- 22: Mail image - Racing
- 23: Audio - Mission 1
- 24-30: Audio - Missions 2-8

**Common Audio Codes:**
- `XXe001v0` - Background music
- `XXd001v0` - Narrator voice
- `XXb001v0` - Bitmap sprite

**DLC:**
- `dlc/pakket1.cst` - Package 1
- `dlc/pakket2.cst` - Package 2
- ... (10 total)

---

## 🎨 UI Patterns

### Button Creation
```javascript
const btn = this.game.add.text(x, y, 'Label', {
  font: 'bold 24px Arial',
  fill: '#ffffff'
})
btn.anchor.set(0.5)
btn.inputEnabled = true

btn.events.onInputOver.add(() => {
  this.game.canvas.className = 'cursor-point'
})

btn.events.onInputOut.add(() => {
  this.game.canvas.className = ''
})

btn.events.onInputUp.add(() => {
  // Click action
})
```

### Confirmation Dialog
```javascript
if (confirm('Are you sure?')) {
  // Execute
}
```

### Overlay/Modal
```javascript
const overlay = this.game.add.group()

const bg = this.game.add.graphics(0, 0)
bg.beginFill(0x000000, 0.8)
bg.drawRect(0, 0, 640, 480)
overlay.add(bg)

// Add content to overlay...

// Close
overlay.destroy()
```

---

## 🔍 Testing Checklist

### Per Map Object
```
□ onCreate executes
□ onEnterOuter triggers at correct distance
□ onEnterInner triggers
□ onExitInner triggers
□ Sounds play
□ Animations work
□ SetWhenDone applied
□ CheckFor conditions work
```

### Per Scene
```
□ Preload completes
□ Create executes
□ Assets load
□ Interactions work
□ Shutdown cleans up
□ Audio stops on exit
```

### Persistence
```
□ Data saves to localStorage
□ Data loads on refresh
□ Deleted items stay deleted
□ Changes persist
```

---

## ⚡ Quick Wins Order

1. **Sound.js** (30 min) - Easiest
2. **FarAway.js** (1h) - Small fix
3. **CBridge.js** (1h) - Bug fix
4. **File Delete** (2h) - UI only
5. **Teleport.js** (3h) - Medium
6. **File Browser** (8h) - Large
7. **DLC** (12h) - Complex

---

## 📚 Key Files to Study

**Map Object Examples:**
- `Ferry.js` - Complex state machine
- `WBridge.js` - Animation + collision
- `Cows.js` / `Goats.js` - Animal herding
- `Racing.js` - Timer logic

**Scene Examples:**
- `world.js` - Map system
- `garage.js` - Car building
- `junk.js` - Part collection
- `yard.js` - Mission system

**Core Systems:**
- `savedata.js` - User persistence
- `missions.js` - Mission tracking
- `buildcar.js` - Car assembly
- `mapobject.js` - Object base class

---

## 🎯 Implementation Phases

### Phase 1: Map Objects (8h)
Sound → FarAway → CBridge → Teleport

### Phase 2: UI (10h)
File Delete → File Browser

### Phase 3: Content (16h)
DLC extraction → Shop → Integration

### Phase 4: Polish (12h)
Minigame → Rewards → Animations

**Total: ~46 hours for 100% completion**

---

## 🚨 Common Pitfalls

1. **Forget to export** - Always `export default MapObject`
2. **Wrong radius check** - Use InnerRadius vs OuterRadius correctly
3. **No cleanup** - Always stop audio in shutdown()
4. **Stale data** - Call `save()` after changes
5. **Animation loops** - Use `onComplete.addOnce()` not `.add()`
6. **Prevent re-trigger** - Set `enteredInner = true` temporarily

---

## 📖 Documentation

- **Full Analysis:** `FEATURE_ANALYSIS_REPORT.md` (1584 lines)
- **Implementation:** `IMPLEMENTATION_GUIDE.md` (888 lines)  
- **Summary:** `ANALYSIS_SUMMARY.md` (410 lines)
- **This File:** `QUICK_REFERENCE.md` (You are here)

---

**Quick start: Copy code from IMPLEMENTATION_GUIDE.md → Paste → Test → Next feature! 🚀**
