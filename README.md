# mulle.js 🚗⛵

A JavaScript/Phaser remake of the classic **Miel Monteur** (Mulle Meck) games, combining both the Cars and Boats games into one unified experience.

## What is this?

mulle.js recreates the beloved Miel Monteur games in the browser using [Phaser CE](https://github.com/photonstorm/phaser-ce). Assets are extracted from the original CD-ROM ISOs, and all game logic has been reverse-engineered from the original Macromedia Director/Lingo source.

### Combined Games via World Select

The original games were released as two separate titles. Interestingly, the first game (cars) contained Lingo code for a **World Select** screen that would allow switching between worlds — but it was never activated, likely due to complexity or time constraints.

mulle.js brings this unused feature to life, merging both games through World Select:

- 🚗 **Blauwwater** — the original car-building game (*Miel Monteur bouwt auto's*)
- ⛵ **Scheepswerf** — the boat-building game (*Miel Monteur recht door zee*)

### Boats Game Features

The boats game includes full recreations of:

- **Boat building** at the Scheepswerf (shipyard) with junk pile parts
- **Sailing** across the sea world with weather, currents, and navigation
- **NPC missions** — Birgit, the Preacher, Mia, George, the Fisherman, the Surfer, the Lighthouse keeper, and more
- **Diving**, cave exploration, and the showboat
- **Album** system for collecting completed boats

### Lingo Parity

All game logic was extracted from the original Director/Lingo scripts using a custom recursive descent parser. The JS implementations are verified against 10,863 AST-generated tests with 100% parity.

## Requirements

You need the original CD-ROM ISOs in any supported language. They are available on the Internet Archive:

| Language | Cars | Boats |
|----------|------|-------|
| 🇳🇱 Dutch | [Miel Monteur bouwt auto's](https://archive.org/details/1.mielmonteurbouwtautosiso) | [Miel Monteur recht door zee](https://archive.org/details/2.mielmonteurrechtdoorzee) |
| 🇸🇪 Swedish | [Bygg bilar med Mulle Meck](https://archive.org/details/byggbilarmedmullemeck) | [Mulle Meck bygger båtar](https://archive.org/details/mullemeckbyggerbatar) |
| 🇳🇴 Norwegian | [Bygg biler med Mulle Mekk](https://archive.org/details/bygg-biler-med-mulle-mekk) | — |
| 🇩🇰 Danish | [Byg bil med Mulle Meck](https://archive.org/details/byg-bil-med-mulle-meck) | — |

## Quick Start (Docker)

The easiest way to run is with Docker:

```bash
# Download ISOs from archive.org and place them in iso/
mkdir -p iso
# (or use the build script: python3 build_scripts/build.py nl download)

# Build and run (set GAME_LANG to your language: nl, sv, no, da)
docker build -f Dockerfile.boten --build-arg GAME_LANG=nl -t mielboten .
docker run -p 8082:80 mielboten
```

Then open http://localhost:8082

## Manual Build

### Dependencies

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

### Build Steps

```bash
# Install Python dependencies
pip3 install -r requirements.txt

# Install Node dependencies
npm install

# Extract assets from both ISOs (replace 'nl' with your language)
python3 build_scripts/build.py nl download        # cars
python3 build_scripts/build.py nl download-boats   # boats

# Build assets
python3 assets.py 0 assets_nl

# Build and start dev server
npm run build
npm start
```

Access at http://localhost:8080

## Project Structure

```
├── src/                   # Game source (Phaser scenes, objects, structs)
│   ├── scenes/            # All game scenes (garage, boatyard, seaworld, NPCs, ...)
│   ├── objects/           # Game objects (boat, weather, inventory, ...)
│   └── struct/            # Data structures (missions, parts, saves, ...)
├── build_scripts/         # ISO extraction and asset build pipeline
├── e2e/                   # Playwright E2E tests (102 tests)
├── parity/                # Lingo parity verification tools and tests
├── data/                  # Game data JSON files
├── audiosprite/           # Audio processing tools
├── dlc/                   # DLC content definitions
└── dist/                  # Built output (served by webpack-dev-server / Apache)
```

## Testing

```bash
cd e2e
npx playwright install chromium
npx playwright test
```

102 E2E tests covering boot, scene transitions, boat building, sailing, NPC missions, save/load, and more.

## Credits

Original games by [Levande Böcker](https://en.wikipedia.org/wiki/Levande_B%C3%B6cker) / George Johansson & Jens Ahlbom.  
Dutch localization: Miel Monteur © Levande Böcker.

This is a fan project for preservation purposes.

## License

This project is for educational and preservation purposes only. All original game assets remain the property of their respective copyright holders.
