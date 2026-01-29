#!/usr/bin/env python3
"""
Transcribe Mulle Meck audio files using OpenAI Whisper API.
Much faster than local Whisper on CPU.
"""

import os
import json
from pathlib import Path
from openai import OpenAI

client = OpenAI()

AUDIO_DIR = Path("/tmp/mulle-assets")
TRANS_DIR = Path.home() / "projects/mulle-meck-game/transcriptions"

LOCATIONS = [
    "garage", "carparts", "junk", "figgeferrum",
    "menu", "yard", "driving", "album", "carshow",
    "dorisdigital", "fileBrowser", "luddelabb", "mudcar",
    "roaddog", "roadthing", "roadtree", "saftfabrik",
    "shared", "solhem", "sturestortand"
]

def transcribe_file(audio_path):
    """Transcribe audio file using OpenAI Whisper API."""
    print(f"  Uploading and transcribing...")
    
    with open(audio_path, 'rb') as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            language="nl",
            response_format="verbose_json",
            timestamp_granularities=["segment"]
        )
    
    return transcript

def main():
    TRANS_DIR.mkdir(exist_ok=True)
    
    print("=== Mulle Meck Audio Transcription (OpenAI Whisper API) ===")
    print(f"Audio source: {AUDIO_DIR}")
    print(f"Output: {TRANS_DIR}")
    print()
    
    stats = {"success": 0, "skipped": 0, "failed": 0}
    
    for location in LOCATIONS:
        audio_file = AUDIO_DIR / f"{location}-audio.ogg"
        output_file = TRANS_DIR / f"{location}-audio.json"
        
        if not audio_file.exists():
            print(f"⊘ Skipping {location} (no audio file)")
            stats["skipped"] += 1
            continue
        
        print(f"▶ Transcribing: {location} ({audio_file.stat().st_size / 1024 / 1024:.1f} MB)")
        
        try:
            transcript = transcribe_file(audio_file)
            
            # Convert to JSON-serializable format
            result = {
                "text": transcript.text,
                "language": transcript.language,
                "duration": transcript.duration,
                "segments": []
            }
            
            for seg in transcript.segments:
                result["segments"].append({
                    "id": seg.id,
                    "start": seg.start,
                    "end": seg.end,
                    "text": seg.text
                })
            
            # Save
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(result, f, ensure_ascii=False, indent=2)
            
            print(f"✓ Completed: {location} ({len(result['segments'])} segments, {result['duration']:.1f}s)")
            print()
            stats["success"] += 1
            
        except Exception as e:
            print(f"✗ Failed: {location} - {e}")
            print()
            stats["failed"] += 1
    
    print("=== Summary ===")
    print(f"Success: {stats['success']}")
    print(f"Skipped: {stats['skipped']}")
    print(f"Failed: {stats['failed']}")
    print()
    print("Next step: Process with mapping script")
    print("Example:")
    print("  python3 process_transcriptions.py garage \\")
    print("    transcriptions/garage-audio.json \\")
    print("    /tmp/mulle-assets/garage-audio.json")

if __name__ == '__main__':
    main()
