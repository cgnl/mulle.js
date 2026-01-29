#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract RTE0 (Rich Text Editor) chunks
These might contain dialog text
"""

import os
import struct
import json

def extract_rte0_from_file(filepath):
    """Extract all RTE0 chunks"""
    print(f"\n{'='*70}")
    print(f"File: {os.path.basename(filepath)}")
    print(f"{'='*70}")
    
    results = []
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    # Find all RTE0 chunks
    pattern = b'RTE0'
    idx = 0
    count = 0
    
    while True:
        idx = data.find(pattern, idx)
        if idx == -1:
            break
        
        count += 1
        
        # Read chunk length (4 bytes before RTE0)
        if idx < 4:
            idx += 1
            continue
        
        chunk_length = struct.unpack('>I', data[idx-4:idx])[0]
        
        # Safety check
        if chunk_length > 100000 or chunk_length < 10:
            idx += 1
            continue
        
        # Extract chunk data
        chunk_start = idx + 4  # After "RTE0"
        chunk_end = min(len(data), chunk_start + chunk_length)
        chunk_data = data[chunk_start:chunk_end]
        
        # Try to extract text
        # RTE0 format: look for text after 0x2C marker
        if b'\x2c' in chunk_data:
            marker_idx = chunk_data.index(b'\x2c')
            text_part = chunk_data[marker_idx+1:]
            
            # Find end of text (usually 0x03 or 0x00)
            end_markers = [b'\x03', b'\x00', b'\x0c']
            end_idx = len(text_part)
            
            for marker in end_markers:
                if marker in text_part:
                    potential_end = text_part.index(marker)
                    if potential_end < end_idx:
                        end_idx = potential_end
            
            text_part = text_part[:end_idx]
            
            # Try to decode
            try:
                text = text_part.decode('iso8859-1', errors='replace')
                
                # Filter out pure binary junk
                printable = sum(32 <= ord(c) < 127 or c in '\n\r\t' for c in text)
                if len(text) > 5 and printable / len(text) > 0.7:
                    results.append({
                        'offset': idx,
                        'length': chunk_length,
                        'text': text
                    })
                    
                    print(f"\n[{count}] RTE0 at offset {idx:08x}")
                    print(f"  {text[:300]}")
                    if len(text) > 300:
                        print(f"  ... ({len(text) - 300} more chars)")
            except:
                pass
        
        idx += 1
    
    print(f"\nTotal RTE0 chunks found: {count}")
    print(f"Successfully decoded: {len(results)}")
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Scan key files
    files_to_scan = [
        '00.CXT',
        '02.DXR',
        '03.DXR',
        'CDDATA.CXT'
    ]
    
    all_results = {}
    
    for filename in files_to_scan:
        filepath = os.path.join(extracted_dir, filename)
        if os.path.exists(filepath):
            rte0_data = extract_rte0_from_file(filepath)
            all_results[filename] = rte0_data
        else:
            print(f"File not found: {filename}")
    
    # Save results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/rte0_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print(f"Results saved to: {output_file}")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()
