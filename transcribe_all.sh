#!/bin/bash
# Transcribe all Mulle Meck audio files with Whisper

set -e

AUDIO_DIR="/tmp/mulle-assets"
TRANS_DIR="$HOME/projects/mulle-meck-game/transcriptions"
WHISPER_MODEL="medium"

mkdir -p "$TRANS_DIR"

# List of locations to process
LOCATIONS=(
    "garage"
    "carparts"
    "junk"
    "figgeferrum"
    "menu"
    "yard"
    "driving"
    "album"
    "carshow"
    "dorisdigital"
    "fileBrowser"
    "luddelabb"
    "mudcar"
    "roaddog"
    "roadthing"
    "roadtree"
    "saftfabrik"
    "shared"
    "solhem"
    "sturestortand"
)

echo "=== Mulle Meck Audio Transcription ==="
echo "Audio source: $AUDIO_DIR"
echo "Output: $TRANS_DIR"
echo "Model: $WHISPER_MODEL"
echo ""

for location in "${LOCATIONS[@]}"; do
    audio_file="$AUDIO_DIR/${location}-audio.ogg"
    json_file="$AUDIO_DIR/${location}-audio.json"
    
    if [ ! -f "$audio_file" ]; then
        echo "⊘ Skipping $location (no audio file)"
        continue
    fi
    
    echo "▶ Transcribing: $location"
    
    # Run Whisper
    whisper "$audio_file" \
        --language Dutch \
        --model "$WHISPER_MODEL" \
        --output_format json \
        --output_dir "$TRANS_DIR" \
        2>&1 | grep -v "UserWarning"
    
    echo "✓ Completed: $location"
    echo ""
done

echo "=== All transcriptions complete ==="
echo ""
echo "Next step: Process with mapping script"
echo "Example:"
echo "  python3 process_transcriptions.py garage \\"
echo "    transcriptions/garage-audio.json \\"
echo "    /tmp/mulle-assets/garage-audio.json"
