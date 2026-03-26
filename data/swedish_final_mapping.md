# Swedish Names - Final Confirmed Mapping

Based on analysis of:
- `boten_05.DXR/Internal/69.txt` - Swedish audio names
- https://fuska.se/spel/bygg-batar-med-mulle-meck/fusk/fragor-och-svar - Swedish FAQ

## Key Findings

### 1. Region Names vs Destination Names

The Swedish version distinguishes between **region/area names** and **destination names**:

| Region Name | Meaning | Contains/Destination |
|-------------|---------|----------------------|
| **Labyrinthavet** | The labyrinth sea | Area where Mia lives (complex navigation) |
| **Storön** | Big Island | Viola's location (her gardens are here!) |
| **Vrakviken** | Wreck Bay | Duikplek (diving spot) |
| **Dödskalleön** | Skull Island | Sven's Cave area |
| **Flaskön** | Fountain Island | Fontein (has gas station!) |
| **Smuggeleiland** | Smuggler Island | MapId 66 area |

### 2. Important Corrections

| Previously Thought | Actually Is | Source |
|-------------------|-------------|--------|
| Storön = Mia's Eiland | **Storön = Viola's Eiland** | FAQ: "Hur vattnar jag Violas odlingar på Storön?" |
| Labyrinthavet = cut content | **Labyrinthavet = sea area where Mia lives** | FAQ: "där bor den där mia minadri" |
| Fontein = just fountain | **Fontein = Flaskön (has gas station!)** | FAQ: "En bensinstation på Flaskön" |

### 3. Surströmming Transport Route

From FAQ:
> "Hur fraktar jag surströmming till Myrorna? Bara om du har en stor båt kan du frakta surströmming från fabriken till Myrarna. Som tack för hjälpen får du mat och bensin."

Translation: "How do I transport surströmming to Myrorna? Only with a large boat can you transport surströmming from the factory to Myrorna. As thanks you get food and gasoline."

**Route:**
- **From:** Surströmming factory (Familie Visser, ObjectId 19)
- **To:** Myrorna (The Ants)
- **Reward:** Food + gasoline
- **Requirement:** Large boat

### 4. Gas Stations Confirmed

From FAQ:
> "Det finns två bensinstationer. En på Flaskön och en till vänster om Dödskalleön."

Translation: "There are two gas stations. One on Flaskön and one to the left of Dödskalleön."

| Location | Swedish Name | MapId | Position |
|----------|-------------|-------|----------|
| Fontein | Flaskön | 3 | (552, 305) - ObjectId 25 |
| Near Sven's Grot | Near Dödskalleön | 66 | (306, 289) - ObjectId 47 (Bensinmack) |

### 5. Complete Destination Mapping

| ID | Dutch Name | Swedish Name | MapId | Position (x, y) | Notes |
|----|------------|--------------|-------|------------------|-------|
| vuurtoren | Vuurtoren (Sam) | Sam | 21 | (342, 284) | |
| bootshow | Boot Show | - | 63 | (253, 89) | |
| surfstrand | Surfstrand (Sur) | - | 73 | (562, 164) | |
| birgitstrand | Birgit's Strand | Birgit | 51 | (423, 100) | |
| boatyard | Scheepswerf | - | 52 | (490, 152) | |
| **mia** | **Mia's Eiland** | **Myrån (lives in Labyrinthavet)** | 97 | (144, 263) | **CORRECTED** |
| preacher | Kerk (Dominee) | kyrkån | 33 | (169, 195) | |
| **diving** | **Duikplek** | **Vrakviken** | 100 | (286, 54) | **CONFIRMED** |
| **cave** | **Sven's Grot** | **Svartesven / döskalleån** | 19 | (319, 176) | **CONFIRMED** |
| **viola** | **Viola's Huis** | **Viola (on Storön!)** | 91 | (204, 189) | **CORRECTED** |
| **fisherman** | **Visser** | **Surströmming → Myrorna** | 55 | (210, 173) | **Pekelharingfabriek!** |
| **waterpump** | **Fontein** | **Fotön / Flaskön (Gas Station!)** | 3 | (552, 305) | **CONFIRMED** |
| whale | Walvis Plek | - | 48 | (285, 170) | |
| racing | Race Parcours | Racerbanan | 42 | (425, 75) | |

### 6. Quotes from Swedish FAQ

> "åk till labyrint havet. där bor den där mia minadi eller vad hon nu än heter."
> (Go to the labyrinth sea. That's where Mia Minadri lives, whatever her name is.)

> "Hur vattnar jag Violas odlingar på Storön?"
> (How do I water Viola's gardens on Storön?)

> "Storön ligger nordöst (höger och uppåt) om 'flaskön' med bensinstationen."
> (Storön lies northeast (right and up) from 'flaskön' with the gas station.)

> "Det finns två bensinstationer. En på Flaskön och en till vänster om Dödskalleön."
> (There are two gas stations. One on Flaskön and one to the left of Dödskalleön.)

> "När man hämtat dagboken och lämnat den till Sam Scribbler får man en kartbit över Vrakviken."
> (When you've fetched the diary and delivered it to Sam Scribbler you get a map piece over Vrakviken.)

> "Första gången man tar ut barnen på båttur hos Mia får man en kompass."
> (The first time you take the children on a boat trip with Mia you get a compass.)

> "När man levererat hunden till Svarte Sven får man en skördetröska..."
> (When you've delivered the dog to Svarte Sven you get a harvester...)

## Updated Files

- `tools/src/scenes/seaworld.js` - Updated with Swedish names and FAQ notes
- `tools/data/swedish_names_confirmed.md` - Detailed documentation
- `tools/data/sea_positions_comparison.md` - Full comparison with audio mapping

## Credits

- **Audio extraction:** boten_05.DXR/Internal/69.txt
- **Swedish FAQ:** https://fuska.se/spel/bygg-batar-med-mulle-meck/fusk/fragor-och-svar
- **Lingo data:** boten_CDDATA.CXT/Standalone/*.txt
