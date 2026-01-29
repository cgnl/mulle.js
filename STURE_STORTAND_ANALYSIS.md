# Sture Stortand (88.DXR) — Analyse (originele Director/Lingo flow)

Locatie project: `/Users/sander/projects/mulle-meck-game/`

Deze analyse is samengesteld uit:
- De gedecompileerde/gestringde inhoud van `extracted/88.DXR` (Director movie)
- De reeds gemaakte scene-implementatie `tools/src/scenes/sturestortand.js`
- Subtitles/transcript (`tools/data/subtitles/dutch/sturestortand.json`, `transcriptions/sturestortand-audio.json`)
- Animatiecharts in `assets/dxr_fields/88/*.txt`
- Part-definitievelden in `assets/cddata_fields/*`

> Noot: in de repository staat geen “mooie” Lingo broncode dump (zoals `on startMovie ...`) voor 88.DXR. Wel zijn er duidelijke Lingo symbolen/handler-namen te recoveren via `strings`, plus veldextracties en de JS scene die al matcht met de originele flow.

---

## 1) Originele (recoverde) Lingo/Director symbolen uit `88.DXR`

Bestand:
- `extracted/88.DXR` (binary movie)

Gevonden relevante symbolen/strings via `strings extracted/88.DXR`:
- `beginSprite`, `endSprite`, `exitFrame`, `firstFrame`, `startMovie`, `mouseEnter`, `mouseLeave`, `mouseUp`
- State/mission:
  - `mission`, `isMissionCompleted`, `addCompletedMission`, `setUserProp`, `getUserProp`
- Part/cache logica:
  - `Cache`, `cacheToCheck`, `yardcacheToCheck`
  - `parts`, `findPart`, `isPart`, `getPart`
  - `partNeeded`, `partToGive`, `giftPart`, `getPartToGive`
  - `Lemonade`, `getCacheProp` (verschijnt als `LemonadegetCacheProp` in string dump)
  - `addJunkPart` (reward naar junkyard)

Deze set symbolen wijst op een standaard “quest/reward” scene:
- Check voor een cache-item (`#Lemonade`)
- Zo ja: geef part (`partToGive`) via `addJunkPart('yard', ...)` + markeer missie complete
- Zo nee: dialoog/branch afhankelijk van of speler al een bepaalde part heeft (in de JS remake is dat `part 172`)

### Opmerking over echte Lingo code
Om *letterlijk* de Lingo handlers uit de binary te halen heb je een Director/Lingo decompiler nodig die scripts uit de cast members kan extraheren. In deze repo is zo’n tool-output niet aanwezig; alleen de symbolen zijn zichtbaar met `strings`.

---

## 2) Logica: interactie met Sture (flow)

### Variabelen/conditions (remake bevestigt de originele intentie)
In `tools/src/scenes/sturestortand.js`:
- `hasLemonade = this.game.mulle.user.Car.hasCache('#Lemonade')`
- `hasTank = this.game.mulle.user.Car.hasPart(172)`

Interpretatie:
- Sture heeft “fruitsap/saft” nodig (quest item = `#Lemonade` cache token).
- Als je het sap al bij je hebt, lever je het in en krijg je een reward.
- Als je het niet hebt:
  - Sture vraagt je om het te halen.
  - Mulle antwoordt anders afhankelijk van of je al een tank (part 172) hebt.

### Complete scene flow (zoals geïmplementeerd / overeenkomend met transcript)

**ALT A — speler heeft `#Lemonade`:**
1. Background gebruikt member **32** (ipv 40) in 88.DXR.
2. Extra “tube/pomp” sprite op member **17** met frame-animatie **17..23** (7 frames).
3. Sture staat in “happy” actor state.
4. Dialoog:
   - Sture: `88d005v0`
   - Mulle: `88d006v0`
5. Reward:
   - `partId = 162` wordt toegevoegd aan yard/junk: `addPart('yard', 162)`
6. Quest item wordt ingeleverd:
   - `Car.removeCache('#Lemonade')`
7. Na ~1s terug naar `world`.

**ALT B — speler heeft géén `#Lemonade`:**
1. Background gebruikt member **40**.
2. Sture staat in “sad” actor state.
3. Dialoog:
   - Sture: `88d002v0`
   - Branch:
     - Als speler geen tank heeft (`!hasTank`): Mulle `88d003v0`
     - Anders (`hasTank`): Mulle `88d004v0`
4. Na ~1s terug naar `world`.

**Altijd:**
- Background loop audio: `88e001v0` (start bij enter, stop bij shutdown).

---

## 3) Dialogen / audio IDs

Bron subtitles:
- `tools/data/subtitles/dutch/sturestortand.json`

Audio IDs in deze scene:
- Narrator (aanwezig in subtitles/transcript; in JS uit-gecomment):
  - `88d001v0` — (NL subtitle) drankjes opsomming + “voor elke dorst wel een drankje”
- Sture vraagt om sap (quest start):
  - `88d002v0` — “Miel, we hebben een probleem… fruitsap is op… haal nog even wat …”
- Mulle antwoord (geen tank):
  - `88d003v0` — “Nou, ik zal mijn best doen.”
- Mulle antwoord (wel tank):
  - `88d004v0` — “Ja, natuurlijk.”
- Sture bedankt + reward aankondiging:
  - `88d005v0` — “Hartelijk bedankt… Fiesta… Als dank krijg je mijn oude melkwagen.”
- Mulle accepteert:
  - `88d006v0` — “Mooi zo. Die komt goed van pas.”

Ambient / loop:
- `88e001v0` — background loop (speelt meteen in create())

Transcript bevestigt dat deze 6 dialogen achter elkaar voorkomen in het bronmateriaal (`transcriptions/sturestortand-audio.json`).

---

## 4) Animaties / Director member IDs

### Scene-specifieke Director members uit `tools/src/scenes/sturestortand.js`
- Background:
  - `88.DXR` member **32** (als `#Lemonade` aanwezig)
  - `88.DXR` member **40** (als `#Lemonade` niet aanwezig)
- Tube/pomp sprite:
  - `88.DXR` member **17** startframe
  - Anim frames: **17..23** (7 frames), fps ≈ 5, loop.

### Animatiecharts (actor animations) uit `assets/dxr_fields/88/*.txt`

#### `assets/dxr_fields/88/MulleAnimChart.txt`
Belangrijke actions:
- `#Talk`: frames `[26,27,28,29,30,31,32]`
- `#Wait`: `[#RndHold, 1, 31, 51]` gevolgd door `#Scratch`, `#ScratchHead`
- `#Scratch` frames `[2..6]` met sound `00e029v0`
- `#ScratchHead` frames `[7..12]` met sound `00e030v0`
- `#LookUnderCar` frames `[33..38]` met sound `00e039v0`

Deze chart verklaart dat Mulle in 88.DXR dezelfde standaard praat/idle/scratch anims gebruikt.

#### `assets/dxr_fields/88/NeighbourAnimChart.txt`
- `#Talk`: `[2,3,[#RndFrame,[2,3,4,5]],4,5]`
- `#Blink`: `[6]`
- `#Wait`: `[#RndHold,1,11,45]` + `#Blink`

Dit lijkt generiek voor een “neighbour” actor (mogelijk Sture), al gebruikt de remake eigen spritesheets (`stureHappy`/`stureSad`).

#### `assets/dxr_fields/88/SlangAnimChart.txt`
- `#Pump`: frames `[2..9]`
- `#Blink`: `[5]`
- `#Wait`: `[#RndHold, 0, 10, 44]` + `#Blink`

Dit kan corresponderen met het pomp/tube object of een slang anim.

---

## 5) Reward / part ID

### Reward in de scene
- Reward part ID: **162**
  - In JS: `var partId = 162; this.game.mulle.user.addPart('yard', partId)`

### Part-definitie veld
`assets/cddata_fields/part162DB.txt`:
- `#partId: 162`
- `#MorphsTo: [163, 164, 165, 166]`
- `#description: "20d051v0"`
- `#junkView: "20b162v1"`

Dat past bij “oude melkwagen” als junkyard item (mogelijk een chassis/body variant die kan morphen).

---

## 6) Voorwaarden / gating

**Primair:**
- Quest completion/reward vereist `#Lemonade` aanwezig in car cache.
  - Inleveren: remove cache na reward.

**Secundair (dialoog-branch):**
- Als geen lemonade:
  - check `hasTank = Car.hasPart(172)` beïnvloedt welke Mulle response audio speelt.

Part 172 in repo context:
- In `tools/src/scenes/viola.js` wordt part **172** (tank) expliciet in de scene getoond en daarna in de yard geplaatst.
- Dit suggereert dat Sture’s dialoog kan verschillen vóór/na het ophalen van tank (of na bepaalde progressie).

**Mogelijke mission flagging (origineel):**
- strings tonen `isMissionCompleted` en `addCompletedMission`.
- De remake (sturestortand.js) doet dat niet expliciet, maar kan impliciet via cache removal + part reward voldoende zijn.

---

## 7) Vergelijking met `viola.js` (referentie)

`viola.js` patroon:
- Speelt background audio loop (`89e001v0`) en stopt bij exit.
- Plaatst een part (tank 172) direct in scene als sprite met `partId` + `properties/requires/covers`.
- Na dialogen:
  - Zet item in junkyard coords (`user.Junk.yard[172] = {x,y}`)
  - Visuele “blinkThing” voor disappearance
  - Daarna terug naar world.

`sturestortand.js` patroon:
- Speelt background loop (`88e001v0`).
- Conditionele scene afhankelijk van cache.
- Reward zonder blinkThing; direct `user.addPart('yard', 162)` en remove cache.

Conclusie:
- Sture-scene is een klassieke “deliver quest item => get reward part” flow.
- Viola-scene is een “pickup part from scene” flow met visuele pickup effect.

---

## 8) Implementatie suggesties (voor een ‘origineelgetrouwe’ remake)

1) **Narrator trigger (`88d001v0`)**
   - In de JS staat narrator gecomment. In origineel kan dit bij scene entry (eerste keer) spelen.
   - Suggestie: speel `88d001v0` alleen als speler de scene voor het eerst bezoekt (mission flag) of als er geen lopende dialogen zijn.

2) **Mission completion flag**
   - Omdat 88.DXR `isMissionCompleted`/`addCompletedMission` strings bevat: voeg in remake een mission flag toe, bv:
     - `user.setMissionCompleted('sturestortand') = true` bij reward
   - Gebruik dit om narrator en/of herhaalbaarheid te controleren.

3) **Reward visual**
   - Overweeg `blinkThing` (zoals viola) voor het moment dat `#Lemonade` verdwijnt of dat de reward wordt “overhandigd”.

4) **Director member mapping**
   - Houd deze mappings expliciet:
     - BG: 32 (met lemonade) / 40 (zonder)
     - Tube anim: 17..23
   - Als je later een renderer maakt die DXR-members direct kan tonen, zijn dit de vaste indices.

5) **Audio sequencing**
   - Zorg dat talk-anim sync (MulleAnimChart `#Talk` frames 26..32) gekoppeld wordt aan audio playback.
   - Sture actor heeft talk/idle (remake gebruikt `stureHappy`/`stureSad` spritesheets); origineel zou `NeighbourAnimChart` kunnen gebruiken.

---

## Bijlagen / belangrijke paden

- Scene remake:
  - `tools/src/scenes/sturestortand.js`
- Referentie pickup pattern:
  - `tools/src/scenes/viola.js`
- Originele movie binary:
  - `extracted/88.DXR`
- Subtitles NL:
  - `tools/data/subtitles/dutch/sturestortand.json`
- Transcript/audio dump:
  - `transcriptions/sturestortand-audio.json`
- Anim charts:
  - `assets/dxr_fields/88/MulleAnimChart.txt`
  - `assets/dxr_fields/88/NeighbourAnimChart.txt`
  - `assets/dxr_fields/88/SlangAnimChart.txt`
- Part fields:
  - `assets/cddata_fields/part162DB.txt`
  - (context) `assets/cddata_fields/part88DB.txt`

---

## TL;DR
- Voorwaarde: car cache bevat `#Lemonade`.
- Dan: Sture bedankt (`88d005v0`), Mulle antwoordt (`88d006v0`), reward part **162** wordt toegevoegd aan yard, `#Lemonade` wordt verwijderd.
- Anders: Sture vraagt om sap (`88d002v0`), Mulle antwoord branch op basis van tank **172** (`88d003v0` vs `88d004v0`).
- Ambient loop: `88e001v0`.
- Director members die we zeker weten: BG 32/40, tube anim 17..23.
