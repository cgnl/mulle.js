#!/usr/bin/env python3
"""
Process Whisper transcriptions and map them to Mulle Meck audio sprite IDs.
"""

import json
import sys
from pathlib import Path

def load_sprite_map(json_path):
    """Load the sprite map from a JSON file."""
    with open(json_path, 'r') as f:
        data = json.load(f)
    return data.get('spritemap', {})

def map_transcription_to_sprites(whisper_json_path, sprite_map):
    """
    Map Whisper segments to sprite audio IDs based on timestamps.
    """
    with open(whisper_json_path, 'r') as f:
        whisper_data = json.load(f)
    
    segments = whisper_data.get('segments', [])
    
    # Create subtitles list
    subtitles = []
    
    for segment in segments:
        start_time = segment['start']
        end_time = segment['end']
        text = segment['text'].strip()
        
        # Find matching sprite by timestamp overlap
        matched_sprite = None
        best_overlap = 0
        
        for sprite_id, sprite_info in sprite_map.items():
            sprite_start = sprite_info['start']
            sprite_end = sprite_info['end']
            
            # Calculate overlap
            overlap_start = max(start_time, sprite_start)
            overlap_end = min(end_time, sprite_end)
            overlap = max(0, overlap_end - overlap_start)
            
            if overlap > best_overlap:
                best_overlap = overlap
                matched_sprite = (sprite_id, sprite_info)
        
        if matched_sprite and best_overlap > 0:
            sprite_id, sprite_info = matched_sprite
            audio_id = sprite_info['data'].get('dirName', 'unknown')
            
            # Calculate offset within the sprite
            offset = start_time - sprite_info['start']
            duration = end_time - start_time
            
            subtitles.append({
                'audioId': audio_id,
                'spriteId': sprite_id,
                'offset': round(offset, 3),
                'duration': round(duration, 3),
                'text': text,
                'timestamp': f"{start_time:.3f}-{end_time:.3f}"
            })
    
    return subtitles

def main():
    if len(sys.argv) < 3:
        print("Usage: process_transcriptions.py <location_name> <whisper_json> <sprite_json>")
        sys.exit(1)
    
    location = sys.argv[1]
    whisper_json = Path(sys.argv[2])
    sprite_json = Path(sys.argv[3])
    
    print(f"Processing {location}...")
    print(f"  Whisper: {whisper_json}")
    print(f"  Sprites: {sprite_json}")
    
    # Load data
    sprite_map = load_sprite_map(sprite_json)
    subtitles = map_transcription_to_sprites(whisper_json, sprite_map)
    
    # Save output
    output_path = Path(f"~/projects/mulle-meck-game/transcriptions/{location}-subtitles-nl.json").expanduser()
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(subtitles, f, ensure_ascii=False, indent=2)
    
    print(f"✓ Created {output_path}")
    print(f"  Found {len(subtitles)} dialogue segments")
    
    # Print some examples
    if subtitles:
        print("\nSample dialogues:")
        for sub in subtitles[:5]:
            print(f"  [{sub['audioId']}] {sub['text']}")

if __name__ == '__main__':
    main()
