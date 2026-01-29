# SAFTFABRIKEN (87.DXR) – Analyse (originele Mulle Meck / Miel Monteur)

## TL;DR
- Scene **87.DXR** = **Saftfabriken / Lemonade Factory** (Frankbetank / Garçon).
- Doel/voorwaarde in de wereldkaart: alleen relevant tijdens **mission 3** én als je **part 172 (tank)** op je auto hebt.
- Bij succes zet de scene **cache flag `#Lemonade`** (je “hebt sap opgehaald”).
- Scene geeft **geen nieuwe part** direct; de beloning/doorstroom is dat je met `#Lemonade` elders (object 5 / 88.DXR) de volgende stap kan doen.

> Let op: het project bevat **geen direct leesbare Lingo `.ls`** voor 87.DXR; de bestaande `tools/build_scripts/ShockwaveParser.py` kan DXR scripts uitlezen maar faalt op dit systeem door `ModuleNotFoundError: aifc` (Python versie mismatch). Daardoor is de originele Lingo code niet 1:1 gedecompileerd in deze run. De scene-logica is wel te reconstrueren uit de JS-scene en world-object definities.

---

## 1) Originele Lingo code (87.DXR)
### Status
- Bestand aanwezig: `/Users/sander/projects/mulle-meck-game/extracted/87.DXR` (binary “data”).
- Er is een extractor: `tools/extract_scripts.py` → gebruikt `tools/build_scripts/ShockwaveParser.py`.
- Probleem bij uitvoeren:
  - `ShockwaveParser.py` importeert `aifc` (`import wave, aifc, sunau`).
  - Op deze machine/Python runtime ontbreekt `aifc` → extractor crasht.

### Aanbevolen fix om wél Lingo te extracten
- Run extractor met een Python versie die `aifc` nog bevat (bijv. Python 3.11/3.12 afhankelijk van distro), of patch `ShockwaveParser.py` zodat audio-export modules optioneel zijn.
- Minimal patch-optie:
  - Verplaats `import aifc, sunau` naar de codepaden waar audio daadwerkelijk wordt geschreven, of wrap in `try/except ImportError`.

---

## 2) Wat gebeurt er als Mulle arriveert? (flow)
Bronnen:
- JS implementatie: `tools/src/scenes/saftfabrik.js`
- Wereldobject: `assets/cddata_fields/object18DB.txt` (DirResource 87)

### World-entry voorwaarden
`object18DB.txt`:
```text
#DirResource: "87"
#CheckFor:[#Missions:[3], #Parts:[172]]
#SetWhenDone:[#Cache:[#Lemonade]]
```
Interpretatie:
- Deze bestemming (Saftfabriken) is gekoppeld aan **mission 3**.
- Player moet **part 172** gemonteerd hebben (tank) om de “haal sap” stap te kunnen doen.
- Bij afronding zet het spel **cache `#Lemonade`**.

### Stap-voor-stap scene flow (zoals in `saftfabrik.js`)
1. **Scene setup**
   - `DirResource = '87.DXR'`
   - Audio pack: `this.game.mulle.addAudio('saftfabrik')`
   - Background sprite met Director member **208**.
   - Actors:
     - `mulleDefault` op (496,332)
     - `garson` op (537,218)
   - Car sprite: `MulleBuildCar` op (217,335)

2. **Check**: heeft de auto de tank?
   - `hasTank = this.game.mulle.user.Car.hasPart(172)`

3. **Dialog start**
   - Garson praat: `garson.talk('87d002v0', callback)`

4. **Branch A: tank aanwezig (succes)**
   - Mulle antwoordt: `mulle.talk('87d004v0', ...)`
   - Splash animatie verschijnt:
     - Sprite op (320,241)
     - Start frame: Director member **26**
     - Animatie frames: **26–29** (4 frames)
   - Geluid bij splash: `this.game.mulle.playAudio('87e001v0', ...)`
   - Daarna:
     - Splash sprite wordt destroyed
     - Garson: `87d005v0`
     - Mulle: `87d006v0`
     - Na 1s: terug naar `world`
   - Side-effect:
     - `this.game.mulle.user.Car.addCache('#Lemonade')`

5. **Branch B: geen tank (fail)**
   - Mulle: `87d003v0`
   - Na 1s: terug naar `world`

---

## 3) Dialogen / audio IDs / subtitles
Subtitles bron:
- `tools/data/subtitles/dutch/saftfabrik.json`
- `transcriptions/saftfabrik-subtitles-nl.json`

### Audio IDs gebruikt in scene
- `87d002v0` – Garson intro (vraag om sap te brengen)
- `87d003v0` – Mulle: “heb niets om te vervoeren” (als geen tank)
- `87d004v0` – Mulle: “Natuurlijk, ik regel vervoer” (als wel tank)
- `87d005v0` – Garson route-instructies naar boerderij
- `87d006v0` – Mulle: “Gesnopen!”
- `87e001v0` – “splash” SFX / of narrator-lijn in transcript (in huidige repo mapping wordt dit als audio gebruikt tijdens splash)

### Audio IDs aanwezig maar niet gebruikt in JS (wel in subtitles)
- `87d001v0` – beschrijvende regels (fabriek/sapcentrale/mooie plek)
- `87d007v0` – “fabriek is nu gesloten … want we hebben al sap gehaald”

> Dit suggereert dat originele Lingo mogelijk een extra branch had wanneer `#Lemonade` al gezet is (herbezoek: “gesloten, maar niet erg”). In de huidige JS scene ontbreekt die branch.

---

## 4) Beloning (part ID)
- In **87.DXR** zelf: **geen part reward**.
- Reward/state-progress:
  - **Cache flag**: `#Lemonade`

Keten met andere locaties:
- `object5DB.txt` (DirResource 88):
  - `#CheckFor:[#Cache:[#Lemonade], #Missions:[3]]`
  - `#SetWhenDone:[#Parts:[162], #Missions:[3]]`

Interpretatie:
- Je haalt sap bij 87 → krijgt `#Lemonade` → bij 88 (volgende bestemming) kun je dan **part 162** krijgen en mission 3 progressen.

---

## 5) Voorwaarden
### Harde voorwaarden
- **Part 172 (tank)** moet op de auto zitten om sap te kunnen ophalen.
- **Mission 3** moet actief zijn (wereldobject gating).

### Geen indicatie gevonden voor
- Car strength / engine power checks
- Weight limits
- Andere specifieke parts

---

## 6) Director member IDs / animaties
### In scene (gevonden via JS)
- Background: `87.DXR` member **208**
- Garson actor base: `87.DXR` member **15**
- Garson talk anim: `87.DXR` members **16–18**
- Splash anim: `87.DXR` members **26–29**

### Mulle actor
- `mulleDefault` gebruikt `00.CXT` members (talkRegular etc.), niet 87.DXR.

---

## Vergelijking met `viola.js` (referentie)
`viola.js` doet een paar dingen “netter” dan `saftfabrik.js`:
- SubtitleLoader wordt expliciet geladen (`new SubtitleLoader(...)`).
- Background ambience audio wordt gestart en gestopt.
- Reward wordt als “pickup” gevisualiseerd (tank sprite blink/disappear) + junkyard placement.

`saftfabrik.js` is simpeler:
- Geen SubtitleLoader in scene (vertrouwt op globale subtitle DB).
- Zet alleen cache `#Lemonade` (geen visuele pickup behalve splash).
- Mist vermoedelijk de herbezoek-branch (`87d007v0`).

---

## Implementatie suggesties voor JavaScript (aanbevolen verbeteringen)
1. **Voeg SubtitleLoader toe** zoals in `viola.js`
   - `this.subtitles = new SubtitleLoader(this.game, 'saftfabrik', ['dutch','english'])`

2. **Implementeer ‘already done’ branch**
   - Check `hasLemonade = Car.hasCache('#Lemonade')`
   - Als `hasLemonade`:
     - Speel `87d007v0` (evt. na `87d001v0` afhankelijk van originele flow)
     - Return naar `world`

3. **Consistente audio mapping**
   - In subtitles/transcript is `87e001v0` ook een narratieve zin (“Frankbetank heeft…”), maar in scene wordt die als splash SFX gebruikt.
   - Overweeg:
     - ofwel een aparte SFX id gebruiken (als aanwezig in audiopack),
     - of het splash-effect zonder die narratielijn.

4. **Maak world-gating consistent met objectDB**
   - Scene kan zelf nogmaals checken op mission 3 (defensief), maar de primaire gating zit al in world object.

5. **State writeback**
   - Het zetten van `#Lemonade` hoort conceptueel bij `SetWhenDone` van object18; in JS nu: `Car.addCache('#Lemonade')`.
   - Houd dit, maar overweeg te verplaatsen naar een “mission progression” helper zodat world objects en scenes hetzelfde mechanisme gebruiken.

---

## Bestanden / referenties
- Scene JS: `tools/src/scenes/saftfabrik.js`
- Referentie scene JS: `tools/src/scenes/viola.js`
- Subtitles NL: `tools/data/subtitles/dutch/saftfabrik.json`
- Transcript: `transcriptions/saftfabrik-audio.json`
- World object: `assets/cddata_fields/object18DB.txt`
- Tank part data: `assets/cddata_fields/part172DB.txt`
- Lemonade gating to next step: `assets/cddata_fields/object5DB.txt`
