#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract STXT (styled text) chunks - these contain actual text content
"""

import os
import sys
import struct
import json

sys.path.append('tools/build_scripts')
from ShockwaveParser import ShockwaveParser

def extract_all_stxt_from_file(filepath):
    """Extract all STXT content using the parser"""
    print(f"\n{'='*70}")
    print(f"Extracting STXT from: {os.path.basename(filepath)}")
    print(f"{'='*70}")
    
    results = []
    
    try:
        parser = ShockwaveParser(filepath)
        parser.read()
        
        # Go through all file entries
        for entry in parser.fileEntries:
            if entry['type'] == 'STXT':
                # Read STXT data
                parser.f.seek(entry['dataOffset'] + 8)  # Skip fourcc + length
                
                # Skip unknown (4 bytes)
                parser.f.read(4)
                
                # Text length
                text_len = struct.unpack('>I', parser.f.read(4))[0]
                
                # Skip padding
                parser.f.read(4)
                
                # Read text
                if text_len > 0 and text_len < 100000:
                    try:
                        text = parser.f.read(text_len).decode('iso8859-1', errors='replace')
                        
                        if text.strip():
                            results.append({
                                'offset': entry['dataOffset'],
                                'length': text_len,
                                'text': text
                            })
                            
                            print(f"\n[@{entry['dataOffset']:08x}] {text_len} bytes")
                            print(f"{text[:300]}")
                            if len(text) > 300:
                                print(f"... ({len(text) - 300} more chars)")
                    except Exception as e:
                        print(f"Error decoding STXT at {entry['dataOffset']:08x}: {e}")
    
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Scan key files
    files_to_scan = [
        '00.CXT',
        '02.DXR',
        '03.DXR',
        '04.DXR',
        '05.DXR',
        'CDDATA.CXT'
    ]
    
    all_results = {}
    
    for filename in files_to_scan:
        filepath = os.path.join(extracted_dir, filename)
        if os.path.exists(filepath):
            stxt_data = extract_all_stxt_from_file(filepath)
            all_results[filename] = stxt_data
            print(f"\nTotal STXT chunks: {len(stxt_data)}")
        else:
            print(f"File not found: {filename}")
    
    # Save results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/stxt_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print(f"Results saved to: {output_file}")
    print(f"{'='*70}")

if __name__ == '__main__':
    main()
