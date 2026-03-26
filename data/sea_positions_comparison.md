# Sea Destination Positions Comparison

## Summary

This document compares the original Lingo positions (extracted from `boten_CDDATA.CXT`) with the current positions in `seaworld.js`. All positions have been updated to match the original Lingo data.

**Status:** ✅ All positions FIXED and verified against walkthrough

## Extraction Method

Original positions were extracted from `boten_CDDATA.CXT/Standalone/*.txt` files. Each destination has:
- An `ObjectId` (defined in standalone files)
- A `MapId` with `point(x, y)` coordinates
- A `DirResource` linking to the Director scene (76-88)
- A Swedish audio name from `boten_05.DXR/Internal/69.txt`

## Audio Mapping (Swedish Names)

Original Swedish audio names from `boten_05.DXR` (19d series):

| Audio File | Swedish Name | Decoded Meaning | Destination | ObjectId |
|------------|-------------|-----------------|-------------|----------|
| 19d001v0 | Sam | Sam (lighthouse keeper) | Vuurtoren | 20 |
| 19d002v0 | kyrkån | kyrka-ån = church creek | Kerk (Dominee) | 18 |
| 19d003v0 | Mulle | Main character | - | - |
| 19d004v0 | Birgit | Birgit | Birgit's Strand | 17 |
| ~~19d005v0~~ | **MISSING** | - | - | - |
| 19d006v0 | **Surströmming** | Pickled herring | **Visser (Pekelharingfabriek!)** | 19 |
| 19d007v0 | Fotön | fot-ön = fountain island | Fontein | 25 |
| 19d008v0 | döskalleån | döskalle-ån = skull creek | Sven's Grot | 26 |
| 19d009v0 | Myrån | myra-ån = ant/mire creek | Mia's Eiland | 23 |
| 19d010v0 | Labyrinthavet | the labyrinth | **CUT CONTENT - no MapId** | - |
| 19d011v0 | Storön | stor-ön = big island | **CUT CONTENT - no MapId** | - |
| 19d012v0 | **smuggelskär** | smuggler-skerry = smuggler island | **Smokkeleiland (MapId 66)** | 10, 47 |
| 19d013v0 | Svartesven | Svarte Sven = Black Sven | Sven's Grot | 26 |
| 19d014v0 | Vrakviken | vrak-viken = wreck bay | Duikplek | 27 |
| 05d066v0 | Racerbanan | racer-banan = racing track | Race Parcours | 2 |
| 19d016v0 | Viola | Viola | Viola's Huis | 24 |

### Key Discovery 1: Pekelharingfabriek = Familie Visser

The "Pekelharingfabriek" (herring factory) mentioned in the wiki is **NOT** a separate destination!

- Audio `19d006v0 --Surströmming` (Swedish for pickled herring) maps to ObjectId 19
- ObjectId 19 = Familie Visser (the fisherman)
- The wiki confirms Familie Visser sells both "pekelharing" (pickled herring) AND "benzine" (gasoline)
- **Conclusion:** The fishing village IS the herring factory!

### Key Discovery 2: Smokkeleiland = MapId 66 ✅

The walkthrough mentions "Er is een tankstation op Smokkeleiland" - this EXISTS in the Lingo data!

**MapId 66 = Smokkeleiland** contains:
- **ObjectId 10** (random destination) at **point(140, 130)** → Scene 70 (smuggler encounter)
- **ObjectId 47** (Gas/Bensinmack = tank station) at **point(306, 289)**

Scene 70 contains:
- ErsonAnimChart (NPC animations: talk, point, etc.)
- DiverAnimChart (diver animations)
- Audio files 70d001v0 - 70d005v0

So when players sail to Smokkeleiland:
1. They can encounter a **smuggler** (random ObjectId 10 → Scene 70)
2. They can refuel at the **tankstation** (ObjectId 47 = Bensinmack)

### Additional Tankstation

MapId 84 also has a tankstation:
- ObjectId 47 (Gas/Bensinmack) at point(272, 269)
- Has UnderMapImage, suggesting underwater content nearby

## Missing Destinations (Cut Content)

Two Swedish audio names have no corresponding MapId in the Lingo data:

| Swedish Name | Meaning | Status |
|--------------|---------|--------|
| Labyrinthavet | The labyrinth | ❌ No MapId - cut during development |
| Storön | Big island | ❌ No MapId - cut or renamed to Mia's Eiland |

**Note:** These audio files exist (19d010v0, 19d011v0) but have **no MapId entries** in `boten_CDDATA.CXT`. They represent planned destinations that were never implemented.

## Position Differences (Before Fix)

| Destination | Old (x, y) | New (x, y) | Delta |
|-------------|------------|------------|-------|
| **Vuurtoren** (lighthouse) | (120, 100) | (342, 284) | **(+222, +184)** |
| **Boot Show** (boatshow) | (520, 120) | (253, 89) | **(-267, -31)** |
| **Surfstrand** | (500, 350) | (562, 164) | **(+62, -186)** |
| **Birgit's Strand** | (100, 380) | (423, 100) | **(+323, -280)** |
| **Scheepswerf** (boatyard) | (320, 450) | (490, 152) | **(+170, -298)** |
| **Mia's Eiland** | (310, 240) | (144, 263) | **(-166, +23)** |
| **Kerk** (preacher) | (200, 180) | (169, 195) | **(-31, +15)** |
| **Duikplek** (diving) | (420, 280) | (286, 54) | **(-134, -226)** |
| **Sven's Grot** (cave) | (80, 240) | (319, 176) | **(+239, -64)** |
| **Viola's Huis** | (550, 220) | (204, 189) | **(-346, -31)** |
| **Visser** (fisherman) | (180, 300) | (210, 173) | **(+30, -127)** |
| **Fontein** (waterpump) | (400, 150) | (552, 305) | **(+152, +155)** |
| **Walvis** (whale) | (280, 80) | (285, 170) | **(+5, +90)** |
| **Race Parcours** (racing) | (425, 75) | (425, 75) | **(0, 0)** ✓ |

✓ = Already correct

### Most Incorrect Positions (Before Fix):
1. **Viola's Huis**: Off by -346px horizontally
2. **Birgit's Strand**: Off by +323px horizontally
3. **Vuurtoren**: Off by +222px horizontally, +184px vertically

## Additional Extracted Data

The original Lingo also contains:
- **Wind speed** for each map area (0-5)
- **Fog zones** (Sven's Grot has fog)
- **Special entry/exit points** (Racing has boardPosition)
- **Access requirements** (Lighthouse requires Diary, Cave requires Compass)

## Custom Objects (Non-Destinations)

| ObjectId | Type | CustomObject | Description |
|----------|------|--------------|-------------|
| 40 | custom | NoMotor | No motor zone |
| 41 | custom | Picture | Decorative picture |
| 42 | custom | Bridge | Bridge (visible obstacle) |
| 43 | custom | RiverEnter | River entrance |
| 44 | custom | MulleComment | Mule commentary trigger |
| 45 | custom | Reef | Coral reef |
| 46 | custom | Maelstrom | Whirlpool/maelstrom |
| 47 | custom | **Gas** | **Bensinmack (tankstation)** |
| 48 | custom | Stream | Water stream |
| 49 | custom | MulleComment | Mule commentary trigger |

## Implementation Notes

1. **Coordinate System**: The original Lingo uses `point(x, y)` format which matches Phaser's (x, y)
2. **Scene Mapping**: ObjectId → DirResource → DXR file number (76-88)
3. **DLC Destinations**: Vicky Island and Algae Island are NOT in original data - they are DLC additions
4. **Random Destinations**: Some ObjectIds (10, 11) are "rdest" (random destinations) that appear on certain levels

## All Destinations (Updated)

| ID | Name | ObjectId | MapId | Position (x, y) | DirScene | Swedish Name |
|----|------|----------|-------|----------------|----------|--------------|
| vuurtoren | Vuurtoren (Sam) | 20 | 21 | (342, 284) | 80 | Sam |
| bootshow | Boot Show | 16 | 63 | (253, 89) | 76 | - |
| surfstrand | Surfstrand (Sur) | 21 | 73 | (562, 164) | 81 | - |
| birgitstrand | Birgit's Strand | 17 | 51 | (423, 100) | 77 | Birgit |
| boatyard | Scheepswerf | 3 | 52 | (490, 152) | 4 | - |
| mia | Mia's Eiland | 23 | 97 | (144, 263) | 83 | Myrån |
| preacher | Kerk (Dominee) | 18 | 33 | (169, 195) | 78 | kyrkån |
| diving | Duikplek | 27 | 100 | (286, 54) | 87 | Vrakviken |
| cave | Sven's Grot | 26 | 19 | (319, 176) | 86 | Svartesven |
| viola | Viola's Huis | 24 | 91 | (204, 189) | 84 | Viola |
| fisherman | Visser (Pekelharingfabriek) | 19 | 55 | (210, 173) | 79 | Surströmming |
| waterpump | Fontein | 25 | 3 | (552, 305) | 85 | Fotön |
| whale | Walvis Plek | 28 | 48 | (285, 170) | 88 | - |
| racing | Race Parcours | 2 | 42 | (425, 75) | 82 | Racerbanan |

## Smokkeleiland (Special MapId 66)

Not a clickable destination but a map area containing:

| Object | ObjectId | Position | Description |
|--------|----------|----------|-------------|
| Smuggler encounter | 10 (rdest) | (140, 130) | Random destination → Scene 70 |
| Tankstation (Bensinmack) | 47 (custom) | (306, 289) | Gas station for refueling |

## Sources

- `boten_CDDATA.CXT/Standalone/*.txt` - Original Lingo map data
- `boten_05.DXR/Internal/69.txt` - Swedish audio names
- `tools/data/sea_positions_extracted.json` - Extracted positions
- https://mielmonteur.fandom.com/nl/wiki/Recht_Door_Zee!_-_Walkthrough - Walkthrough verification
