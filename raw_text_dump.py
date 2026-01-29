#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Raw text extraction - find all printable strings longer than 10 chars
"""

import os
import re
import json

def extract_printable_strings(filepath, min_length=10):
    """Extract all printable ASCII/Latin-1 strings"""
    print(f"Extracting strings from: {os.path.basename(filepath)}")
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    # Pattern: sequences of printable chars (including extended Latin-1)
    # Allow space, letters, digits, punctuation, and common Latin-1 chars
    pattern = rb'[\x20-\x7E\xC0-\xFF]{' + str(min_length).encode() + rb',}'
    
    matches = []
    for match in re.finditer(pattern, data):
        try:
            text = match.group().decode('iso8859-1')
            
            # Skip if it's mostly numbers/symbols
            alpha_count = sum(c.isalpha() for c in text)
            if alpha_count / len(text) > 0.3:  # At least 30% letters
                matches.append({
                    'offset': match.start(),
                    'text': text
                })
        except:
            pass
    
    return matches

def filter_dutch_candidates(strings):
    """Filter for strings that might be Dutch"""
    dutch_words = [
        'auto', 'wiel', 'motor', 'deur', 'garage', 'bouwen', 'maken', 'rijden',
        'hallo', 'hoi', 'dag', 'ja', 'nee', 'goed', 'mooi', 'klaar', 'kijk', 'zie',
        'het', 'de', 'een', 'is', 'zijn', 'was', 'voor', 'met', 'op', 'aan',
        'niet', 'maar', 'ook', 'dan', 'als', 'naar', 'bij', 'om', 'zo', 'nog',
        'miel', 'monteur', 'werkplaats', 'gereedschap', 'onderdeel'
    ]
    
    candidates = []
    
    for item in strings:
        text_lower = item['text'].lower()
        
        # Count Dutch word matches
        dutch_count = sum(1 for word in dutch_words if word in text_lower)
        
        if dutch_count > 0:
            candidates.append({
                **item,
                'dutch_word_count': dutch_count
            })
    
    # Sort by Dutch word count
    candidates.sort(key=lambda x: x['dutch_word_count'], reverse=True)
    
    return candidates

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Focus on main files
    files_to_scan = [
        '03.DXR',  # Main gameplay
        '02.DXR',  # Probably intro
        '00.CXT',  # Shared resources
        'CDDATA.CXT'  # Large data file
    ]
    
    all_strings = {}
    
    for filename in files_to_scan:
        filepath = os.path.join(extracted_dir, filename)
        if not os.path.exists(filepath):
            continue
        
        strings = extract_printable_strings(filepath, min_length=15)
        print(f"  Found {len(strings)} strings (15+ chars)")
        
        # Filter for Dutch
        dutch = filter_dutch_candidates(strings)
        print(f"  Dutch candidates: {len(dutch)}")
        
        all_strings[filename] = {
            'all_strings': len(strings),
            'dutch_candidates': dutch
        }
    
    # Save results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/raw_text_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_strings, f, indent=2, ensure_ascii=False)
    
    # Print interesting findings
    print(f"\n{'='*70}")
    print("DUTCH CANDIDATE STRINGS:")
    print(f"{'='*70}")
    
    for filename, data in all_strings.items():
        if data['dutch_candidates']:
            print(f"\n{filename}:")
            for item in data['dutch_candidates'][:20]:  # Top 20
                print(f"\n  [@{item['offset']:08x}] {item['dutch_word_count']} Dutch words")
                print(f"  {item['text'][:200]}")
                if len(item['text']) > 200:
                    print(f"  ... ({len(item['text']) - 200} more chars)")

if __name__ == '__main__':
    main()
