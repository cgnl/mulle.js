# Voortgang: Miel Monteur Auto's + Recht Door Zee Integratie

## Doel
Integreren van twee Miel Monteur games in de JS remake:
1. **Miel Monteur Bouwt Auto's** (mieliso.iso) - bestaande game
2. **Miel Monteur Recht Door Zee** (boten) - toe te voegen

### Gewenste functionaliteit
- World select: keuze tussen "Blauwwater" (auto's) en "Scheepswerf" (boten)
- Zee scene: vraag of speler boten wil bouwen (unlock trigger)
- Volledige boot-bouw gameplay

---

## Status: FASE 13 - LINGO COMPARISON FIXES

### Voltooide Bestemmingen (29-01-2026)

| Scene | Bestand | NPC | Status |
|-------|---------|-----|--------|
| 76 | showboat.js | Judge | VOLTOOID |
| 77 | birgit.js | Birgit + honden | VOLTOOID |
| 78 | preacher.js | Dominee | VOLTOOID |
| 80 | lighthouse.js | Sam | VOLTOOID |
| 81 | surfer.js | Sur | VOLTOOID |
| 83 | mia.js | Mia | VOLTOOID |
| 84 | viola_boat.js | Viola | VOLTOOID |
| 86 | cave.js | Sven + vleermuis | VOLTOOID |
| 87 | diving.js | Duiker | VOLTOOID |

### Fase 6 Fixes (Voltooid)

| Bug | Bestand | Oplossing | Status |
|-----|---------|-----------|--------|
| Default boot part bestaat niet | `boatdata.js` | Part 730 i.p.v. 1 | GEFIXED |
| Verkeerd aantal richtingen | `driveboat.js` | 8 richtingen i.p.v. 16 | GEFIXED |
| Audio referentie bestaat niet | `seaworld.js` | 80e002v0 i.p.v. 70e001v0 | GEFIXED |
| Navigatie systeem verschilt | `seaworld.js` | Point-and-click met 10 bestemmingen | GEFIXED |
| Christina niet als MulleActor | `boatyard.js` | MulleActor met animaties | GEFIXED |

---

## Voltooide Taken (Fase 1-7)

### Fase 1-5: Core Implementation
- [x] Analyse van beide ISO's
- [x] Download Recht Door Zee ISO  
- [x] Extract alle boten assets naar `cst_out_new/boten_*`
- [x] MulleResource definities toegevoegd aan assets.py
- [x] Asset packs gebuild voor alle boten scenes
- [x] load.js uitgebreid om boot asset packs te laden
- [x] MulleBuildBoat class geintegreerd
- [x] MulleBoatPart class voor drag & drop
- [x] SeaWorld scene met navigatie
- [x] MulleDriveBoat class
- [x] Christina beloningssysteem
- [x] Zeewaardigheid checks (7 validaties)
- [x] Zee topologie systeem
- [x] Multi-screen kaart
- [x] Brandstof/energie systeem

### Fase 6: Validatie & Bug Fixes
- [x] Boot data fixes (hull, directions)
- [x] Boatyard UI & Christina animaties
- [x] Sea navigation point-and-click
- [x] Showboat scene (boten_76/SHOWBOAT.DXR)
- [x] Lighthouse scene (boten_80.DXR)

### Fase 7: Alle Bestemmingen
- [x] birgit.js - Birgit's strand met 4 honden (boten_77.DXR)
- [x] preacher.js - Dominee's kerk eiland (boten_78.DXR)
- [x] surfer.js - Sur's surfstrand (boten_81.DXR)
- [x] mia.js - Mia's eiland (boten_83.DXR)
- [x] viola_boat.js - Viola's muziekhuis (boten_84.DXR)
- [x] cave.js - Sven's grot met vleermuis (boten_86.DXR)
- [x] diving.js - Onderwaterduikplek (boten_87.DXR)

### Fase 8: Tutorial Scenes (29-01-2026)
- [x] erson_intro.js - Erson tutorial intro (boten_70.DXR)
  - Erson NPC met point, Talk, liftHead, happyTalk animaties
  - Diver karakter met popUp animatie
  - 5 dialogue clips, skip functie
- [x] harbor.js - Haven tutorial met touw (boten_71.DXR)
  - Interactief touw met Pull/StoppPull/Fail animaties
  - Erson begeleiding
  - 4 dialogue clips
- [x] Tutorial flow geintegreerd in boatyard.js
  - Eerste bezoek -> erson_intro -> harbor -> boatyard

### Fase 9: SpawnLines Implementatie (29-01-2026)
- [x] SPAWN_LINES constante toegevoegd aan driveboat.js (16 spawn posities)
- [x] Helper functies in MulleDriveBoat:
  - `getSpawnLine(index)` - Haal spawn line op index
  - `getSpawnLineForEdge(edge)` - Haal spawn line voor schermrand
  - `getDirectionFromSpawnLine(spawnLine)` - Bereken richting uit spawn line
  - `getAllSpawnLines()` - Alle 16 spawn lines
- [x] seaworld.js integratie:
  - `spawnBoatFromEdge(edge)` - Spawn boot vanaf rand
  - `spawnBoatAtLine(index)` - Spawn boot op specifieke lijn
  - Debug functies: `debugShowSpawnLines()`, `debugHideSpawnLines()`, `debugSpawnAt()`
- [x] boatyard.js zet `seaSpawnEdge = 'south'` bij vertrek naar zee

### Fase 10: Laatste Ontbrekende Scenes (29-01-2026)
- [x] fisherman.js - Visser op de pier (boten_79.DXR)
  - Visser NPC met head/body animaties (talk, blink, move, point)
  - Hengel animaties
  - 7 dialogue clips (79d002v0-79d008v0)
- [x] waterpump.js - Fontein/waterpomp (boten_85.DXR)
  - Interactieve pomp met pump, StartSpreading, Spreading animaties
  - 13 water frames voor animatie
  - 3 dialogue clips
- [x] whale.js - Walvis kijken (boten_88.DXR)
  - Walvis surface/dive/breach animaties (8 frames)
  - Blowhole spray effect (4 frames)
  - Random walvis verschijningen
  - 4 dialogue clips, ambient ocean sounds
- [x] Alle 3 scenes geregistreerd in game.js
- [x] Bestemmingen toegevoegd aan seaworld.js met iconen (fish, fountain, whale)

### Fase 11: Audio Verificatie & Completering (29-01-2026)
- [x] Alle dialogue clips vergeleken met originele Lingo metadata
- [x] boatyard.js: 55/55 Christina dialogues (04d001-057v0)
  - Toegevoegd: 04d006v0 (tips), 04d014v0 (tips), 04d021v0 (encouragement)
- [x] viola_boat.js: 17/17 dialogues (84d006v1 toegevoegd)
- [x] Alle 13 scenes 100% audio compleet

### Fase 12: Part Description Audio (29-01-2026)
- [x] MulleBoatPart.js uitgebreid met part info functionaliteit:
  - `sound_description` geladen uit partData.SndDescription
  - Double-click detectie (300ms threshold)
  - Long-press detectie (600ms hold)
  - `playDescription()` method met actor.talk() integratie
- [x] 151 part description audio bestanden beschikbaar (20dXXXv0)
- [x] 182 parts hebben SndDescription in database
- Gebruik: dubbelklik of lang indrukken op een onderdeel om beschrijving te horen

### Fase 13: Lingo Comparison Fixes (29-01-2026)
- [x] **Christina Animaties Gecorrigeerd** (actor.js)
  - Frame offset gecorrigeerd: AnimChart frame N → Director member 41 + N
  - `christina` actor: Talk frames 21-29 (was 42-55), idle frame 1 (42)
  - `christinaQuay` actor: Talk frames 30-36 (was 75-81)
  - Nieuwe animaties toegevoegd:
    - `scratch`: frames 2-6 (krabben)
    - `scratchHead`: frames 11-16 (hoofd krabben)
    - `lookAround`: frames 17-19 (rondkijken)
    - `goPee`: frames 1-33 met sound "00e111v1" (toilet)
  
- [x] **Ontbrekende Zee Bestemmingen Toegevoegd** (seaworld.js)
  - Nu 20 bestemmingen in plaats van 13
  - Originele Lingo data uit boten_05.DXR/Internal/69.txt
  - Nieuwe locaties (nog niet geïmplementeerd als scenes):
    - Fotön (19d008v0)
    - Döskalleön - Skull Island (19d009v0)
    - Myrön - Ant Island (19d010v0)
    - Labyrinthavet - Labyrinth Sea (19d011v0)
    - Smuggelskär - Smuggler's Reef (19d013v0)
    - Vrakviken - Wreck Bay (05d066v0)
    - Mulles Huis (19d004v0)
  - Nieuwe iconen: skull, ant, maze, anchor, wreck, house
  - "Nog niet beschikbaar" melding voor ongeïmplementeerde locaties

---

## Audio Overzicht (Volledig)
| Type | Aantal | Status |
|------|--------|--------|
| Scene dialogues | 210+ | 100% compleet |
| Part descriptions | 151 | Geïmplementeerd |
| Ambient sounds | ~30 | Geïmplementeerd |
| Effect sounds | ~20 | Geïmplementeerd |

---

### Voltooide Scene Audio:
  | Scene | Bestand | Dialogues | Status |
  |-------|---------|-----------|--------|
  | 04 | boatyard.js | 55/55 | COMPLEET |
  | 70 | erson_intro.js | 5/5 | COMPLEET |
  | 71 | harbor.js | 4/4 | COMPLEET |
  | 77 | birgit.js | 28/28 | COMPLEET |
  | 78 | preacher.js | 19/19 | COMPLEET |
  | 79 | fisherman.js | 7/7 | COMPLEET |
  | 80 | lighthouse.js | 18/18 | COMPLEET |
  | 81 | surfer.js | 9/9 | COMPLEET |
  | 83 | mia.js | 17/17 | COMPLEET |
  | 84 | viola_boat.js | 17/17 | COMPLEET |
  | 85 | waterpump.js | 3/3 | COMPLEET |
  | 86 | cave.js | 13/13 | COMPLEET |
  | 87 | diving.js | 6/6 | COMPLEET |
  | 88 | whale.js | 4/4 | COMPLEET |

---

## Technische Architectuur

### JS Bestanden Structuur (Voltooid)
```
src/
├── scenes/
│   ├── boatyard.js      - Scheepswerf (boot bouwen)
│   ├── seaworld.js      - Zee navigatie (10 bestemmingen)
│   ├── showboat.js      - Boot show/wedstrijd
│   ├── lighthouse.js    - Sam's vuurtoren
│   ├── birgit.js        - Birgit's hondenstrand
│   ├── preacher.js      - Dominee's kerk
│   ├── surfer.js        - Sur's surfstrand
│   ├── mia.js           - Mia's eiland
│   ├── viola_boat.js    - Viola's muziekhuis
│   ├── cave.js          - Sven's grot
│   └── diving.js        - Duikplek
├── objects/
│   ├── buildboat.js     - MulleBuildBoat class
│   ├── boatpart.js      - MulleBoatPart class
│   └── driveboat.js     - MulleDriveBoat class
└── struct/
    ├── boatdata.js      - MulleBoat class
    ├── seaworld.js      - MulleSeaWorld class
    └── seamap.js        - MulleSeaMap class
```

### Geregistreerde Scenes in game.js
```javascript
// BOTEN (Zee) SCENES
boatyard: BoatyardState,      // Scheepswerf (04)
boat_junk: BoatJunkState,     // Boot onderdelen opslag (02)
seaworld: SeaWorldState,      // Zee navigatie (05)
showboat: ShowBoatState,      // Boot show (76)
lighthouse: LighthouseState,  // Vuurtoren - Sam (80)
birgitbeach: BirgitState,     // Birgit's strand (77)
preacher: PreacherState,      // Kerk eiland - Dominee (78)
surfbeach: SurferState,       // Surfstrand - Sur (81)
mia: MiaState,                // Mia's eiland (83)
viola_boat: ViolaBoatState,   // Viola's huis (84)
cave: CaveState,              // Sven's grot (86)
diving: DivingState,          // Duikplek (87)
erson_intro: ErsonIntroState, // Erson tutorial intro (70)
harbor: HarborState,          // Haven tutorial (71)
fisherman: FishermanState,    // Visser op pier (79)
waterpump: WaterPumpState,    // Fontein/waterpomp (85)
whale: WhaleState             // Walvis kijken (88)
```

### SeaWorld Bestemmingen
| ID | Naam | Scene | Icoon | Kleur |
|----|------|-------|-------|-------|
| vuurtoren | Vuurtoren (Sam) | lighthouse | lighthouse | geel |
| bootshow | Boot Show | boatshow | trophy | oranje |
| surfstrand | Surfstrand (Sur) | surfbeach | wave | cyaan |
| birgitstrand | Birgit's Strand | birgitbeach | beach | roze |
| boatyard | Scheepswerf | boatyard | dock | bruin |
| mia | Mia's Eiland | mia | island | lichtgroen |
| preacher | Kerk (Dominee) | preacher | church | paars |
| diving | Duikplek | diving | diving | donkerblauw |
| cave | Sven's Grot | cave | cave | donkergrijs |
| viola | Viola's Huis | viola_boat | music | roze |

---

## NPC Overzicht

| NPC | Scene | Animaties | Dialogues | Features |
|-----|-------|-----------|-----------|----------|
| Christina Colombus | boatyard | wave, lookPlayer, scratch | 55 clips | Boot bouwen, beloningen |
| Sam | lighthouse | idle, talk, blink, thumbsUp | 18 clips | Vuurtoren lamp |
| Birgit | birgitbeach | body turn, arm wave, head talk | 30+ clips | 4 honden interactie |
| Dominee | preacher | talk, raiseBible, preach | 19 clips | Bijbel animatie |
| Sur | surfbeach | idle, talk, armout | 9 clips | Surfplank animatie |
| Mia | mia | idle, talk, turn, blink | 19 clips | Eiland sfeer |
| Viola | viola_boat | head talk, arm accordion | 17 clips | Muziek puzzel |
| Sven | cave | idle, lift, talk, hey | 13 clips | Vleermuis animatie |
| Duiker | diving | idle, walk, talk, peek | ~8 clips | Bubbels, lichtstralen |

---

## Docker Deployment

```bash
# Herbouwen en starten
docker stop mielboten && docker rm mielboten
docker build -f Dockerfile.boten -t mielboten .
docker run -d --name mielboten -p 8082:80 --restart unless-stopped mielboten:latest

# Toegang
http://localhost:8082
https://mielboten.dtun.nl
```

---

## Resterende Taken (Optioneel)

### Audio Integratie - VOLTOOID
- [x] Alle Christina dialogues gebruikt (55/55)
- [x] Alle NPC dialogues in alle scenes compleet
- [ ] Part description audio (165 bestanden) - optioneel
- [ ] Meer ambient sounds - optioneel

### Testen
- [ ] Complete game flow test
- [ ] Alle bestemmingen bezoeken
- [ ] Boot bouwen en varen test
- [ ] Showboat wedstrijd test

---

*Laatst bijgewerkt: 29 januari 2026 - Fase 12 Part Descriptions Geïmplementeerd*
