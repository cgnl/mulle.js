#!/bin/bash
# Map all transcriptions to sprite IDs

set -e

TRANS_DIR="$HOME/projects/mulle-meck-game/transcriptions"
ASSETS_DIR="/tmp/mulle-assets"
SCRIPT="$HOME/projects/mulle-meck-game/process_transcriptions.py"

LOCATIONS=(
    "garage" "carparts" "junk" "figgeferrum"
    "menu" "yard" "driving" "album" "carshow"
    "dorisdigital" "fileBrowser" "luddelabb" "mudcar"
    "roaddog" "roadthing" "roadtree" "saftfabrik"
    "shared" "solhem" "sturestortand"
)

echo "=== Mapping transcriptions to sprite IDs ==="
echo ""

for location in "${LOCATIONS[@]}"; do
    whisper_json="$TRANS_DIR/${location}-audio.json"
    sprite_json="$ASSETS_DIR/${location}-audio.json"
    
    if [ ! -f "$whisper_json" ] || [ ! -f "$sprite_json" ]; then
        echo "⊘ Skipping $location (missing files)"
        continue
    fi
    
    echo "▶ Processing: $location"
    python3 "$SCRIPT" "$location" "$whisper_json" "$sprite_json"
    echo ""
done

echo "=== All subtitles mapped! ==="
echo ""
echo "Output directory: $TRANS_DIR"
echo ""
echo "Sample check:"
ls -lh "$TRANS_DIR"/*-subtitles-nl.json | head -5
