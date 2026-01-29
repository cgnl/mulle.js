#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Deep text search in Shockwave files
Finds ALL possible text, including:
- STXT/TEXT/FIELD members
- Lingo string pools
- Pascal strings
- Null-terminated strings
- Hex patterns around known IDs
"""

import os
import sys
import struct
import json
import re

sys.path.append('tools/build_scripts')
from ShockwaveParser import ShockwaveParser

# Known audio IDs to search around
KNOWN_AUDIO_IDS = [
    b'03d047v0', b'03d048v0', b'03d049v0', b'03d050v0',
    b'03d051v0', b'03d052v0', b'03d053v0'
]

def find_pascal_strings(data, offset_base=0, min_len=5):
    """Find Pascal-style strings (length byte + data)"""
    results = []
    i = 0
    while i < len(data) - 1:
        length = data[i]
        if 5 <= length <= 200 and i + length + 1 <= len(data):
            try:
                text = data[i+1:i+1+length].decode('iso8859-1')
                # Check if it looks like real text (mostly printable)
                printable = sum(32 <= ord(c) < 127 or c in '\n\r\t' for c in text)
                if printable / len(text) > 0.7:
                    results.append({
                        'type': 'pascal_string',
                        'offset': offset_base + i,
                        'length': length,
                        'text': text
                    })
            except:
                pass
        i += 1
    return results

def find_null_terminated_strings(data, offset_base=0, min_len=5):
    """Find null-terminated strings"""
    results = []
    pattern = re.compile(b'[\x20-\x7E]{5,}[\x00]')
    for match in pattern.finditer(data):
        try:
            text = match.group()[:-1].decode('iso8859-1')
            results.append({
                'type': 'null_terminated',
                'offset': offset_base + match.start(),
                'length': len(match.group()) - 1,
                'text': text
            })
        except:
            pass
    return results

def search_around_audio_ids(data, offset_base=0):
    """Search for text near known audio IDs"""
    results = []
    for audio_id in KNOWN_AUDIO_IDS:
        idx = 0
        while True:
            idx = data.find(audio_id, idx)
            if idx == -1:
                break
            
            # Search 200 bytes before and after
            start = max(0, idx - 200)
            end = min(len(data), idx + len(audio_id) + 200)
            chunk = data[start:end]
            
            # Look for strings in this chunk
            pascal = find_pascal_strings(chunk, offset_base + start, min_len=3)
            null_term = find_null_terminated_strings(chunk, offset_base + start, min_len=3)
            
            if pascal or null_term:
                results.append({
                    'audio_id': audio_id.decode('ascii'),
                    'audio_offset': offset_base + idx,
                    'nearby_strings': pascal + null_term
                })
            
            idx += 1
    
    return results

def extract_cast_text(parser, lib_name, cast_num):
    """Extract text from a specific cast member"""
    for lib in parser.castLibraries:
        if lib['name'] == lib_name and cast_num in lib['members']:
            member = lib['members'][cast_num]
            
            # Check linked entries for text
            for linked_id in member.get('linkedEntries', []):
                linked = parser.fileEntries[linked_id]
                
                if linked['type'] in ['STXT', 'RTE0']:
                    parser.f.seek(linked['dataOffset'] + 8)
                    
                    if linked['type'] == 'STXT':
                        # Skip metadata
                        parser.f.seek(4, 1)
                        text_len = struct.unpack('>I', parser.f.read(4))[0]
                        parser.f.seek(4, 1)
                        text = parser.f.read(text_len).decode('iso8859-1', errors='replace')
                        return text
                    
                    elif linked['type'] == 'RTE0':
                        # Rich text format - extract plain text
                        data = parser.f.read(linked['dataLength'])
                        # Look for text after 0x2C marker
                        if b'\x2c' in data:
                            idx = data.index(b'\x2c')
                            text_part = data[idx+1:]
                            if b'\x03' in text_part:
                                text_part = text_part[:text_part.index(b'\x03')]
                            return text_part.decode('iso8859-1', errors='replace')
    
    return None

def deep_scan_file(filepath):
    """Perform deep scan on a single DXR/CXT file"""
    print(f"\n{'='*60}")
    print(f"Scanning: {os.path.basename(filepath)}")
    print(f"{'='*60}")
    
    results = {
        'filename': os.path.basename(filepath),
        'cast_text': {},
        'pascal_strings': [],
        'null_terminated_strings': [],
        'audio_context_strings': [],
        'lingo_strings': []
    }
    
    try:
        # Parse with ShockwaveParser
        parser = ShockwaveParser(filepath)
        parser.read()
        
        # Extract all CAST text members
        print("\n[1] Extracting CAST TEXT/FIELD members...")
        for lib in parser.castLibraries:
            lib_name = lib['name']
            if 'members' not in lib:
                continue
            for cast_num, member in lib['members'].items():
                if member['castType'] in [3, 12]:  # FIELD or TEXT
                    text = extract_cast_text(parser, lib_name, cast_num)
                    if text and text.strip():
                        key = f"{lib_name}:{cast_num}:{member['name']}"
                        results['cast_text'][key] = text
                        print(f"  Found: {key} = {text[:50]}...")
        
        # Read entire file for pattern matching
        print("\n[2] Scanning for Pascal strings...")
        with open(filepath, 'rb') as f:
            data = f.read()
        
        pascal = find_pascal_strings(data)
        results['pascal_strings'] = pascal
        print(f"  Found {len(pascal)} Pascal strings")
        
        print("\n[3] Scanning for null-terminated strings...")
        null_term = find_null_terminated_strings(data)
        results['null_terminated_strings'] = null_term
        print(f"  Found {len(null_term)} null-terminated strings")
        
        print("\n[4] Searching around known audio IDs...")
        audio_context = search_around_audio_ids(data)
        results['audio_context_strings'] = audio_context
        print(f"  Found {len(audio_context)} audio ID contexts")
        
        # Search for Lingo string patterns
        print("\n[5] Searching for Lingo string pools...")
        lscr_pattern = b'Lscr'
        lctx_pattern = b'Lctx'
        
        for pattern_name, pattern in [('Lscr', lscr_pattern), ('Lctx', lctx_pattern)]:
            idx = 0
            while True:
                idx = data.find(pattern, idx)
                if idx == -1:
                    break
                
                # Try to extract strings after the header
                chunk_start = idx + 4
                chunk_end = min(len(data), chunk_start + 2000)
                chunk = data[chunk_start:chunk_end]
                
                strings = find_pascal_strings(chunk, chunk_start) + find_null_terminated_strings(chunk, chunk_start)
                
                if strings:
                    results['lingo_strings'].append({
                        'pattern': pattern_name,
                        'offset': idx,
                        'strings': strings
                    })
                    print(f"  Found {len(strings)} strings near {pattern_name} at offset {idx}")
                
                idx += 1
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Scan key files
    files_to_scan = [
        '03.DXR',  # Main gameplay
        '00.CXT',  # Usually contains shared resources
        'CDDATA.CXT'  # Large data file
    ]
    
    all_results = {}
    
    for filename in files_to_scan:
        filepath = os.path.join(extracted_dir, filename)
        if os.path.exists(filepath):
            all_results[filename] = deep_scan_file(filepath)
        else:
            print(f"File not found: {filename}")
    
    # Save results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/deep_text_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print(f"Results saved to: {output_file}")
    print(f"{'='*60}")
    
    # Print summary
    print("\nSUMMARY:")
    for filename, data in all_results.items():
        print(f"\n{filename}:")
        print(f"  CAST text members: {len(data['cast_text'])}")
        print(f"  Pascal strings: {len(data['pascal_strings'])}")
        print(f"  Null-terminated: {len(data['null_terminated_strings'])}")
        print(f"  Audio context: {len(data['audio_context_strings'])}")
        print(f"  Lingo pools: {len(data['lingo_strings'])}")

if __name__ == '__main__':
    main()
