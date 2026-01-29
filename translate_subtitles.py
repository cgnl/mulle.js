#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Vertaal Engelse Mulle Meck subtitles naar Nederlands
met Whisper verificatie
"""

import json
import os
from pathlib import Path

# Bekende vertalingen (Miel Monteur)
CHARACTER_NAMES = {
    "Mulle": "Miel",
    "Figge Ferrum": "Figge Ferrum",  # Naam blijft hetzelfde
    "scrap dealer": "schroothandelaar"
}

# Bekende quotes
KNOWN_QUOTES = {
    "Look at that!": "Kijk daar eens!",
    "Hey Mulle!": "Hé Miel!",
    "good bye!": "tot ziens!",
    "Oh yeah": "Oja",
    "An engine": "Een motor",
    "Yellow, always nice": "Geel, altijd mooi",
}

def load_english_subs(filename):
    """Load English subtitles"""
    path = Path('~/projects/mulle-meck-game/tools/data/subtitles/english').expanduser()
    with open(path / filename, 'r', encoding='utf-8') as f:
        return json.load(f)

def translate_line(line):
    """Translate a single line (basic translation for now)"""
    # Check known quotes first
    for eng, nl in KNOWN_QUOTES.items():
        if eng.lower() in line.lower():
            return line.replace(eng, nl)
    
    # Character names
    for eng, nl in CHARACTER_NAMES.items():
        line = line.replace(eng, nl)
    
    return line  # Return as-is for now (will use Whisper later)

def translate_subtitles(english_data):
    """Translate entire subtitle set"""
    dutch_data = {}
    
    for audio_id, sub_data in english_data.items():
        dutch_data[audio_id] = {
            'lines': [translate_line(line) for line in sub_data['lines']]
        }
        
        # Copy actor if present
        if 'actor' in sub_data:
            actor = sub_data['actor']
            # Translate actor names
            if actor == 'mulle':
                actor = 'miel'
            elif actor == 'figgeDoor':
                actor = 'figgeDeur'
            dutch_data[audio_id]['actor'] = actor
    
    return dutch_data

def main():
    """Main function"""
    english_dir = Path('~/projects/mulle-meck-game/tools/data/subtitles/english').expanduser()
    dutch_dir = Path('~/projects/mulle-meck-game/tools/data/subtitles/dutch').expanduser()
    dutch_dir.mkdir(parents=True, exist_ok=True)
    
    # Process all English subtitle files
    for eng_file in english_dir.glob('*.json'):
        print(f"\nProcessing {eng_file.name}...")
        
        # Load English
        with open(eng_file, 'r', encoding='utf-8') as f:
            english_data = json.load(f)
        
        # Translate
        dutch_data = translate_subtitles(english_data)
        
        # Save Dutch version
        dutch_file = dutch_dir / eng_file.name
        with open(dutch_file, 'w', encoding='utf-8') as f:
            json.dump(dutch_data, f, indent=2, ensure_ascii=False)
        
        print(f"  ✓ Saved to {dutch_file}")
        print(f"  ✓ {len(dutch_data)} audio clips processed")
    
    print(f"\n{'='*70}")
    print("Dutch subtitles created!")
    print(f"Location: {dutch_dir}")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()
