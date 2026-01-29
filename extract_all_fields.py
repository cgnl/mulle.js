#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract ALL FIELD and TEXT cast members
"""

import os
import sys
import json

sys.path.append('tools/build_scripts')
from ShockwaveParser import ShockwaveParser

def extract_all_text_fields(filepath):
    """Extract all TEXT and FIELD cast members"""
    print(f"\n{'='*70}")
    print(f"File: {os.path.basename(filepath)}")
    print(f"{'='*70}")
    
    results = []
    
    try:
        parser = ShockwaveParser(filepath)
        parser.read()
        
        for lib in parser.castLibraries:
            if 'members' not in lib:
                continue
            
            lib_name = lib['name']
            
            for cast_num, member in lib['members'].items():
                # CastType: 3 = FIELD, 12 = TEXT
                if member['castType'] in [3, 12]:
                    cast_type_name = 'FIELD' if member['castType'] == 3 else 'TEXT'
                    
                    # Try to extract text from textContents (already parsed by parser)
                    text = None
                    if lib_name in parser.textContents and cast_num in parser.textContents[lib_name]:
                        text = parser.textContents[lib_name][cast_num]
                    
                    if text and text.strip():
                        results.append({
                            'library': lib_name,
                            'cast_num': cast_num,
                            'name': member.get('name', ''),
                            'type': cast_type_name,
                            'text': text
                        })
                        
                        print(f"\n[{lib_name}:{cast_num}] {member.get('name', '(unnamed)')} ({cast_type_name})")
                        print(f"  {text[:200]}")
                        if len(text) > 200:
                            print(f"  ... ({len(text) - 200} more chars)")
    
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Scan all DXR/CXT files
    all_results = {}
    
    files = [f for f in os.listdir(extracted_dir) if f.endswith(('.DXR', '.CXT'))]
    files.sort()
    
    for filename in files:
        filepath = os.path.join(extracted_dir, filename)
        fields = extract_all_text_fields(filepath)
        
        if fields:
            all_results[filename] = fields
        
        print(f"\nTotal TEXT/FIELD members: {len(fields)}")
    
    # Save results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/all_text_fields.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*70}")
    print(f"Results saved to: {output_file}")
    print(f"{'='*70}")
    
    # Summary
    total = sum(len(v) for v in all_results.values())
    print(f"\nGRAND TOTAL: {total} TEXT/FIELD members across all files")

if __name__ == '__main__':
    main()
