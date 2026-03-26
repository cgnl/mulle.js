# Swedish Names Mapping - Confirmed!

## Sources
- `boten_05.DXR/Internal/69.txt` - Swedish audio names
- https://fuska.se/spel/bygg-batar-med-mulle-meck/fusk/fragor-och-svar - Swedish FAQ

## Complete Mapping

| Swedish Name | English/Dutch Translation | Game Location | MapId | ObjectId |
|-------------|-------------------------|---------------|-------|----------|
| **Sam** | Sam (lighthouse keeper) | Vuurtoren | 21 | 20 |
| **kyrkån** | kyrka-ån = church creek | Kerk (Dominee) | 33 | 18 |
| **Birgit** | Birgit | Birgit's Strand | 51 | 17 |
| **Surströmming** | Pickled herring | Visser (Familie Visser = Pekelharingfabriek!) | 55 | 19 |
| **Fotön** | fot-ön = fountain island | Fontein (Flaskön!) | 3 | 25 |
| **döskalleån** | döskalle-ån = skull creek | Sven's Grot (Dödskalleön) | 19 | 26 |
| **Myrån** | myra-ån = ant/mire creek | Mia's Eiland (Mia woont in Labyrinthavet!) | 97 | 23 |
| **Labyrinthavet** | the labyrinth | Gebied waar Mia woont | - | - |
| **Storön** | stor-ön = big island | **Viola's eiland** (haar plantages zijn hier!) | 91 | 24 |
| **smuggelskär** | smuggler-skerry | Smokkeleiland | 66 | 10, 47 |
| **Svartesven** | Svarte Sven = Black Sven | Sven's Grot | 19 | 26 |
| **Vrakviken** | vrak-viken = wreck bay | Duikplek | 100 | 27 |
| **Racerbanan** | racer-banan = racing track | Race Parcours | 42 | 2 |
| **Viola** | Viola | Viola's Huis | 91 | 24 |
| **Mulle** | Main character | Miel Monteur | - | - |

## Key Corrections Based on Swedish FAQ

### 1. Storön = Viola's Eiland (NOT Mia's!)

The FAQ says:
> "Hur vattnar jag Violas odlingar på Storön?"

So **Storön** is where Viola's gardens/plantations are, not Mia's house!

Location from FAQ:
> "Storön ligger nordöst (höger och uppåt) om 'flaskön' med bensinstationen."

Translation: "Big Island lies northeast (right and up) from Flaskön (Fountain Island) with the gas station."

MapId 3 = Fontein (Flaskön) at (552, 305)
MapId 91 = Viola's Huis at (204, 189) - This matches "northeast"!

### 2. Labyrinthavet = The Area Where Mia Lives

The FAQ says:
> "åk till labyrint havet. där bor den där mia minardi eller vad hon nu än heter."

Translation: "Go to the labyrinth sea. That's where Mia Minadri lives, whatever her name is."

So Labyrinthavet is a **sea area/region**, not a single destination! It's the maze-like area around Mia's island.

### 3. Flaskön = Fontein (Has Gas Station!)

The FAQ says:
> "Det finns två bensinstationer. En på Flaskön och en till vänster om Dödskalleön."

Translation: "There are two gas stations. One on Flaskön and one to the left of Dödskalleön (Skull Island)."

- **Flaskön** = Fontein = MapId 3, ObjectId 25 at (552, 305)
- **Dödskalleön** = Sven's Grot area

### 4. Surströmming Factory → Myrarna

The FAQ says:
> "Hur fraktar jag surströmming till Myrorna? Bara om du har en stor båt kan du frakta surströmming från fabriken till Myrorna. Som tack för hjälpen får du mat och bensin."

Translation: "How do I transport surströmming to Myrorna? Only if you have a large boat can you transport surströmming from the factory to Myrorna. As thanks for the help you get food and gasoline."

So:
- **Surströmming factory** = Pekelharingfabriek = Familie Visser (ObjectId 19)
- **Myrarna** (The Ants) = likely a destination that receives the herring
- You get food AND gasoline as reward!

## Gas Stations Confirmed

Two gas stations according to FAQ:

| Location | Swedish Name | MapId | Position |
|----------|-------------|-------|----------|
| Fontein | Flaskön | 3 | (552, 305) - ObjectId 25 |
| Near Sven's Grot | Near Dödskalleön | 66 | (306, 289) - ObjectId 47 (Bensinmack) |

This matches our earlier findings:
- MapId 66 has ObjectId 47 (Gas/Bensinmack) at (306, 289)
- MapId 84 also has ObjectId 47 at (272, 269)

## Region Names vs Destination Names

The Swedish version uses both **region names** and **destination names**:

| Region Name | Meaning | Contains |
|-------------|---------|----------|
| **Labyrinthavet** | The labyrinth sea | Mia's area (complex navigation) |
| **Storön** | Big island | Viola's location |
| **Vrakviken** | Wreck bay | Diving spot |
| **Dödskalleön** | Skull island | Sven's Cave area |
| **Flaskön** | Fountain island | Fontein |
| **Smuggeleiland** | Smuggler island | MapId 66 area |

## All Destinations with Swedish Names

| ID | Dutch Name | Swedish Name | MapId | Position (x, y) |
|----|------------|--------------|-------|------------------|
| vuurtoren | Vuurtoren (Sam) | Sam | 21 | (342, 284) |
| bootshow | Boot Show | - | 63 | (253, 89) |
| surfstrand | Surfstrand (Sur) | - | 73 | (562, 164) |
| birgitstrand | Birgit's Strand | Birgit | 51 | (423, 100) |
| boatyard | Scheepswerf | - | 52 | (490, 152) |
| mia | Mia's Eiland | Myrån (Mia lives in Labyrinthavet) | 97 | (144, 263) |
| preacher | Kerk (Dominee) | kyrkån | 33 | (169, 195) |
| diving | Duikplek | Vrakviken | 100 | (286, 54) |
| cave | Sven's Grot | Svartesven / döskalleån | 19 | (319, 176) |
| viola | Viola's Huis | Viola (on Storön!) | 91 | (204, 189) |
| fisherman | Visser | Surströmming (herring factory!) | 55 | (210, 173) |
| waterpump | Fontein | Fotön / Flaskön | 3 | (552, 305) |
| whale | Walvis Plek | - | 48 | (285, 170) |
| racing | Race Parcours | Racerbanan | 42 | (425, 75) |

## Credits

Source: https://fuska.se/spel/bygg-batar-med-mulle-meck/fusk/fragor-och-svar
Swedish FAQ for "Bygg Båtar med Mulle Meck" (Build Boats with Mulle Meck)
