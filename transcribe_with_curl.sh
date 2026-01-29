#!/bin/bash
# Transcribe Mulle Meck audio files using OpenAI Whisper API via curl
# Much faster than local Whisper on CPU

set -e

AUDIO_DIR="/tmp/mulle-assets"
TRANS_DIR="$HOME/projects/mulle-meck-game/transcriptions"
API_KEY="${OPENAI_API_KEY}"

if [ -z "$API_KEY" ]; then
    echo "Error: OPENAI_API_KEY not set"
    exit 1
fi

mkdir -p "$TRANS_DIR"

LOCATIONS=(
    "garage" "carparts" "junk" "figgeferrum"
    "menu" "yard" "driving" "album" "carshow"
    "dorisdigital" "fileBrowser" "luddelabb" "mudcar"
    "roaddog" "roadthing" "roadtree" "saftfabrik"
    "shared" "solhem" "sturestortand"
)

echo "=== Mulle Meck Audio Transcription (OpenAI Whisper API) ==="
echo "Audio source: $AUDIO_DIR"
echo "Output: $TRANS_DIR"
echo ""

SUCCESS=0
SKIPPED=0
FAILED=0

for location in "${LOCATIONS[@]}"; do
    audio_file="$AUDIO_DIR/${location}-audio.ogg"
    output_file="$TRANS_DIR/${location}-audio.json"
    
    if [ ! -f "$audio_file" ]; then
        echo "⊘ Skipping $location (no audio file)"
        ((SKIPPED++))
        continue
    fi
    
    size=$(du -h "$audio_file" | cut -f1)
    echo "▶ Transcribing: $location ($size)"
    
    # Call OpenAI Whisper API
    response=$(curl -s https://api.openai.com/v1/audio/transcriptions \
        -H "Authorization: Bearer $API_KEY" \
        -H "Content-Type: multipart/form-data" \
        -F "file=@$audio_file" \
        -F "model=whisper-1" \
        -F "language=nl" \
        -F "response_format=verbose_json" \
        -F "timestamp_granularities[]=segment")
    
    # Check for errors
    if echo "$response" | jq -e '.error' > /dev/null 2>&1; then
        error_msg=$(echo "$response" | jq -r '.error.message')
        echo "✗ Failed: $location - $error_msg"
        echo ""
        ((FAILED++))
        continue
    fi
    
    # Save response
    echo "$response" > "$output_file"
    
    # Extract stats
    duration=$(echo "$response" | jq -r '.duration // "unknown"')
    num_segments=$(echo "$response" | jq '.segments | length')
    
    echo "✓ Completed: $location ($num_segments segments, ${duration}s)"
    echo ""
    ((SUCCESS++))
done

echo "=== Summary ==="
echo "Success: $SUCCESS"
echo "Skipped: $SKIPPED"
echo "Failed: $FAILED"
echo ""
echo "Transcriptions saved in: $TRANS_DIR"
