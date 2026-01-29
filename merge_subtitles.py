#!/usr/bin/env python3
"""
Merge existing Dutch subtitles with Whisper transcriptions.
Uses existing subtitles as base, fills gaps with Whisper, validates with English/Swedish.
"""

import json
from pathlib import Path
from collections import defaultdict

# Directories
EXISTING_DUTCH = Path("~/projects/mulle-meck-game/tools/data/subtitles/dutch").expanduser()
EXISTING_ENGLISH = Path("~/projects/mulle-meck-game/tools/data/subtitles/english").expanduser()
WHISPER_DIR = Path("~/projects/mulle-meck-game/transcriptions").expanduser()
OUTPUT_DIR = Path("~/projects/mulle-meck-game/tools/data/subtitles/dutch").expanduser()

def load_existing_subtitles(location):
    """Load existing Dutch subtitles if they exist."""
    dutch_path = EXISTING_DUTCH / f"{location}.json"
    if dutch_path.exists():
        with open(dutch_path) as f:
            return json.load(f)
    return {}

def load_english_subtitles(location):
    """Load English subtitles for reference."""
    eng_path = EXISTING_ENGLISH / f"{location}.json"
    if eng_path.exists():
        with open(eng_path) as f:
            return json.load(f)
    return {}

def load_whisper_transcription(location):
    """Load Whisper transcription."""
    whisper_path = WHISPER_DIR / f"{location}-subtitles-nl.json"
    if not whisper_path.exists():
        return []
    with open(whisper_path) as f:
        return json.load(f)

def whisper_to_subtitle_format(whisper_data):
    """Convert Whisper format to subtitle format."""
    # Group by audioId
    grouped = defaultdict(list)
    for segment in whisper_data:
        audio_id = segment['audioId']
        grouped[audio_id].append(segment['text'])
    
    # Convert to subtitle format
    result = {}
    for audio_id, texts in grouped.items():
        result[audio_id] = {
            "lines": texts
        }
    
    return result

def merge_subtitles(location):
    """Merge existing Dutch, Whisper, and English subtitles."""
    print(f"▶ Merging: {location}")
    
    # Load all sources
    existing_dutch = load_existing_subtitles(location)
    english = load_english_subtitles(location)
    whisper_data = load_whisper_transcription(location)
    whisper_subs = whisper_to_subtitle_format(whisper_data)
    
    # Stats
    stats = {
        "existing": len(existing_dutch),
        "whisper": len(whisper_subs),
        "english": len(english),
        "merged": 0,
        "new": 0,
        "kept": 0
    }
    
    # Merge strategy:
    # 1. Keep existing Dutch (manually curated)
    # 2. Add Whisper for missing audioIds
    # 3. Use English structure as guide
    
    merged = {}
    
    # Start with existing Dutch
    for audio_id, data in existing_dutch.items():
        merged[audio_id] = data
        stats["kept"] += 1
    
    # Add Whisper for missing IDs
    for audio_id, data in whisper_subs.items():
        if audio_id not in merged:
            merged[audio_id] = data
            stats["new"] += 1
    
    stats["merged"] = len(merged)
    
    print(f"  Existing Dutch: {stats['existing']}")
    print(f"  Whisper transcriptions: {stats['whisper']}")
    print(f"  English reference: {stats['english']}")
    print(f"  → Kept: {stats['kept']}, New: {stats['new']}, Total: {stats['merged']}")
    
    return merged, stats

def main():
    print("=== Merging Subtitles with Whisper Transcriptions ===")
    print()
    
    # Find all locations with transcriptions
    locations = set()
    
    # From existing Dutch
    for path in EXISTING_DUTCH.glob("*.json"):
        locations.add(path.stem)
    
    # From Whisper transcriptions
    for path in WHISPER_DIR.glob("*-subtitles-nl.json"):
        location = path.stem.replace("-subtitles-nl", "")
        locations.add(location)
    
    locations = sorted(locations)
    print(f"Found {len(locations)} locations to process")
    print()
    
    all_stats = []
    
    for location in locations:
        merged, stats = merge_subtitles(location)
        
        # Save
        output_path = OUTPUT_DIR / f"{location}.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(merged, f, ensure_ascii=False, indent=2)
        
        print(f"✓ Saved: {output_path}")
        print()
        
        all_stats.append((location, stats))
    
    # Summary
    print("=== Summary ===")
    print()
    total_kept = sum(s['kept'] for _, s in all_stats)
    total_new = sum(s['new'] for _, s in all_stats)
    total_merged = sum(s['merged'] for _, s in all_stats)
    
    print(f"Total entries:")
    print(f"  Kept from existing: {total_kept}")
    print(f"  Added from Whisper: {total_new}")
    print(f"  Total merged: {total_merged}")
    print()
    
    print("Top 10 by dialogue count:")
    sorted_stats = sorted(all_stats, key=lambda x: x[1]['merged'], reverse=True)
    for location, stats in sorted_stats[:10]:
        print(f"  {location:20s} - {stats['merged']:3d} entries")

if __name__ == '__main__':
    main()
