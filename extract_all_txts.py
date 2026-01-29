#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract ALL TXTS (text) chunks from DXR files
These might contain dialog text embedded in Lingo data structures
"""

import os
import sys
import struct
import json
import re

def extract_txts_chunks(filepath):
    """Extract all TXTS chunks from a file"""
    print(f"\nExtracting TXTS chunks from: {os.path.basename(filepath)}")
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    results = []
    
    # Find all TXTS chunks
    pattern = b'TXTS'
    idx = 0
    count = 0
    
    while True:
        idx = data.find(pattern, idx)
        if idx == -1:
            break
        
        count += 1
        
        # Read chunk header
        if idx + 8 > len(data):
            idx += 1
            continue
        
        # TXTS is preceded by 4-byte length
        if idx < 4:
            idx += 1
            continue
        
        chunk_length = struct.unpack('>I', data[idx-4:idx])[0]
        
        # Safety check
        if chunk_length > 100000 or chunk_length < 4:
            idx += 1
            continue
        
        # Extract chunk data
        chunk_start = idx + 4  # After "TXTS"
        chunk_end = min(len(data), chunk_start + chunk_length)
        chunk_data = data[chunk_start:chunk_end]
        
        # Try to decode as text
        try:
            # Skip metadata (usually first 12 bytes)
            text_start = 12
            if text_start < len(chunk_data):
                # Find text length (usually at offset 8-12)
                if len(chunk_data) >= 12:
                    text_len = struct.unpack('>I', chunk_data[4:8])[0]
                    
                    # Extract text
                    if text_len > 0 and text_len < len(chunk_data) - 12:
                        text = chunk_data[12:12+text_len].decode('iso8859-1', errors='replace')
                        
                        # Check if it contains anything interesting
                        if len(text) > 10:
                            print(f"\n[{count}] TXTS at offset {idx:08x} (length: {chunk_length})")
                            print(f"Text ({len(text)} chars):")
                            print(text[:500])  # First 500 chars
                            if len(text) > 500:
                                print(f"... ({len(text) - 500} more chars)")
                            
                            results.append({
                                'offset': idx,
                                'length': chunk_length,
                                'text': text
                            })
        except Exception as e:
            pass
        
        idx += 1
    
    print(f"\nTotal TXTS chunks found: {count}")
    print(f"Successfully decoded: {len(results)}")
    
    return results

def search_for_dutch_patterns(texts):
    """Search for Dutch language patterns in extracted texts"""
    dutch_patterns = [
        r'\b(het|de|een|is|zijn|was|voor|met|op|aan|in|niet|maar|ook|dan|als|naar|bij|om|zo|nog|kan|moet|heeft|wordt|want|deze|dat|die|dit|wel)\b',
        r'\b(auto|wiel|motor|deur|garage|bouwen|maken|rijden)\b',
        # Character might say things like:
        r'\b(hallo|hoi|dag|ja|nee|goed|mooi|klaar|kijk|zie)\b'
    ]
    
    results = {}
    
    for i, text_data in enumerate(texts):
        text = text_data['text']
        
        # Count Dutch word matches
        dutch_matches = 0
        for pattern in dutch_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            dutch_matches += len(matches)
        
        if dutch_matches > 0:
            results[i] = {
                'offset': text_data['offset'],
                'dutch_word_count': dutch_matches,
                'text': text,
                'preview': text[:200]
            }
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Scan all DXR files
    all_results = {}
    
    dxr_files = [f for f in os.listdir(extracted_dir) if f.endswith('.DXR') or f.endswith('.CXT')]
    dxr_files.sort()
    
    for filename in dxr_files:
        filepath = os.path.join(extracted_dir, filename)
        texts = extract_txts_chunks(filepath)
        
        if texts:
            all_results[filename] = texts
    
    # Save all results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/txts_all_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print(f"All results saved to: {output_file}")
    
    # Search for Dutch patterns
    print(f"\n{'='*70}")
    print("Searching for Dutch language patterns...")
    print(f"{'='*70}")
    
    for filename, texts in all_results.items():
        dutch_texts = search_for_dutch_patterns(texts)
        
        if dutch_texts:
            print(f"\n{filename}: {len(dutch_texts)} texts with Dutch words")
            for idx, data in dutch_texts.items():
                print(f"  [{idx}] @{data['offset']:08x} - {data['dutch_word_count']} Dutch words")
                print(f"      Preview: {data['preview']}")

if __name__ == '__main__':
    main()
