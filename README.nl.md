# mulle.js 🚗⛵

Een JavaScript/Phaser remake van de klassieke **Miel Monteur** (Mulle Meck) spellen, waarin beide spellen worden samengevoegd tot één ervaring.

## Wat is dit?

mulle.js herschept de geliefde Miel Monteur spellen in de browser met [Phaser CE](https://github.com/photonstorm/phaser-ce). Assets worden geëxtraheerd uit de originele CD-ROM ISO's en alle spellogica is reverse-engineered vanuit de originele Macromedia Director/Lingo broncode.

### Twee spellen via World Select

De originele spellen waren twee losse titels. Het eerste spel (auto's) bevatte al Lingo-code voor een **World Select** scherm waarmee je kon wisselen tussen werelden — maar dit werd nooit geactiveerd, vermoedelijk door complexiteit of tijdgebrek.

mulle.js brengt deze ongebruikte feature tot leven en voegt beide spellen samen via World Select:

- 🚗 **Blauwwater** — het originele auto-bouwspel (*Miel Monteur bouwt auto's*)
- ⛵ **Scheepswerf** — het boten-bouwspel (*Miel Monteur recht door zee*)

### Boten-spel features

Het boten-spel bevat volledige namaak van:

- **Boten bouwen** op de Scheepswerf met onderdelen van de rommelberg
- **Varen** over de zeewereld met weer, stromingen en navigatie
- **NPC-missies** — Birgit, de Dominee, Mia, George, de Visser, de Surfer, de Vuurtorenwachter en meer
- **Duiken**, grotverkenning en de showboot
- **Album** systeem voor het verzamelen van voltooide boten

### Lingo Parity

Alle spellogica is geëxtraheerd uit de originele Director/Lingo scripts met een custom recursive descent parser. De JS-implementaties zijn geverifieerd tegen 10.863 AST-gegenereerde tests met 100% parity.

## Vereisten

Je hebt de originele CD-ROM ISO's nodig in een ondersteunde taal. Ze zijn beschikbaar op het Internet Archive:

| Taal | Auto's | Boten |
|------|--------|-------|
| 🇳🇱 Nederlands | [Miel Monteur bouwt auto's](https://archive.org/details/1.mielmonteurbouwtautosiso) | [Miel Monteur recht door zee](https://archive.org/details/2.mielmonteurrechtdoorzee) |
| 🇩🇪 Duits | [Autos bauen mit Willy Werkel](https://archive.org/details/autos-bauen-mit-willy-werkel) | [Schiffe bauen mit Willy Werkel](https://archive.org/details/schiffe_bauen_willy_werkel) |
| 🇸🇪 Zweeds | [Bygg bilar med Mulle Meck](https://archive.org/details/byggbilarmedmullemeck) | [Mulle Meck bygger båtar](https://archive.org/details/mullemeckbyggerbatar) |
| 🇬🇧 Engels | [Gary Gadget: Building Cars](https://archive.org/details/gary-gadget-building-cars) | — |
| 🇳🇴 Noors | [Bygg biler med Mulle Mekk](https://archive.org/details/bygg-biler-med-mulle-mekk) | — |
| 🇩🇰 Deens | [Byg bil med Mulle Meck](https://archive.org/details/byg-bil-med-mulle-meck) | — |

## Snel starten (Docker)

De makkelijkste manier om te spelen is met Docker:

```bash
# Download ISO's van archive.org en plaats ze in iso/
mkdir -p iso
# (of gebruik het build script: python3 build_scripts/build.py nl download)

# Bouwen en starten (stel GAME_LANG in op je taal: nl, de, sv, en, no, da)
docker build -f Dockerfile.boten --build-arg GAME_LANG=nl -t mielboten .
docker run -p 8082:80 mielboten
```

Open daarna http://localhost:8082

## Handmatig bouwen

### Afhankelijkheden

**Linux (Debian/Ubuntu):**
```bash
sudo apt install python3 python3-pip ffmpeg imagemagick nodejs npm optipng p7zip-full libvorbis-dev
```

**Linux (Arch):**
```bash
sudo pacman -S python python-pip ffmpeg imagemagick nodejs npm
```

**macOS:**
```bash
brew install ffmpeg imagemagick optipng p7zip node
```

### Bouwstappen

```bash
# Python-afhankelijkheden installeren
pip3 install -r requirements.txt

# Node-afhankelijkheden installeren
npm install

# Assets extraheren uit beide ISO's (vervang 'nl' door je taal)
python3 build_scripts/build.py nl download        # auto's
python3 build_scripts/build.py nl download-boats   # boten

# Assets bouwen
python3 assets.py 0 assets_nl

# Bouwen en dev-server starten
npm run build
npm start
```

Beschikbaar op http://localhost:8080

## Projectstructuur

```
├── src/                   # Spelbroncode (Phaser scenes, objecten, structs)
│   ├── scenes/            # Alle spelscènes (garage, scheepswerf, zeewereld, NPC's, ...)
│   ├── objects/           # Spelobjecten (boot, weer, inventaris, ...)
│   └── struct/            # Datastructuren (missies, onderdelen, saves, ...)
├── build_scripts/         # ISO-extractie en asset-buildpipeline
├── e2e/                   # Playwright E2E-tests (102 tests)
├── parity/                # Lingo parity verificatietools en tests
├── data/                  # Speldata JSON-bestanden
├── audiosprite/           # Audioverwerkingstools
├── dlc/                   # DLC-inhoud
└── dist/                  # Gebouwde output (geserveerd door webpack-dev-server / Apache)
```

## Testen

```bash
cd e2e
npx playwright install chromium
npx playwright test
```

102 E2E-tests voor opstarten, scèneovergangen, boten bouwen, varen, NPC-missies, opslaan/laden en meer.

## Credits

Originele spellen door [Levande Böcker](https://en.wikipedia.org/wiki/Levande_B%C3%B6cker) / George Johansson & Jens Ahlbom.
Nederlandse lokalisatie: Miel Monteur © Levande Böcker.

Dit is een fanproject voor preserveringsdoeleinden.

## Licentie

Dit project valt onder de [GPL-3.0](LICENSE) licentie, dezelfde licentie als het [originele mulle.js](https://github.com/MrBrax/mulle.js) door MrBrax. Alle originele game-assets blijven eigendom van de respectievelijke rechthebbenden.
