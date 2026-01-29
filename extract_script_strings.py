#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract strings from Lingo SCRIPT cast members
"""

import os
import sys
import struct
import json

sys.path.append('tools/build_scripts')
from ShockwaveParser import ShockwaveParser

def extract_lscr_strings(data, offset_base=0):
    """Extract strings from Lscr (Lingo Script) chunk"""
    strings = []
    
    # Lscr format has a string table
    # Try to find string count and parse
    try:
        # Skip header
        pos = 0
        
        # Look for string table marker patterns
        # Typical pattern: count (4 bytes) followed by offsets
        
        # Try different offset positions
        for start_offset in [8, 12, 16, 20, 24, 28, 32, 40, 48, 56, 64]:
            if start_offset + 4 > len(data):
                continue
                
            # Read potential string count
            string_count = struct.unpack('>I', data[start_offset:start_offset+4])[0]
            
            # Sanity check
            if not (1 <= string_count <= 1000):
                continue
            
            # Try to read string offsets
            offsets_start = start_offset + 4
            if offsets_start + string_count * 4 > len(data):
                continue
            
            offsets = []
            for i in range(string_count):
                offset_pos = offsets_start + i * 4
                offset = struct.unpack('>I', data[offset_pos:offset_pos+4])[0]
                offsets.append(offset)
            
            # Try to read strings
            strings_found = []
            valid = True
            
            for offset in offsets:
                if offset >= len(data):
                    valid = False
                    break
                
                # Pascal string: length byte + data
                str_len = data[offset]
                if str_len == 0 or str_len > 200 or offset + str_len + 1 > len(data):
                    valid = False
                    break
                
                try:
                    text = data[offset+1:offset+1+str_len].decode('iso8859-1')
                    # Check if mostly printable
                    printable = sum(32 <= ord(c) < 127 or c in '\n\r\t' for c in text)
                    if printable / len(text) < 0.5:
                        valid = False
                        break
                    strings_found.append({
                        'offset': offset_base + offset,
                        'text': text
                    })
                except:
                    valid = False
                    break
            
            if valid and strings_found:
                return {
                    'start_offset': start_offset,
                    'string_count': string_count,
                    'strings': strings_found
                }
    
    except Exception as e:
        pass
    
    return None

def analyze_script_member(parser, lib_name, cast_num):
    """Analyze a SCRIPT cast member"""
    for lib in parser.castLibraries:
        if lib['name'] == lib_name:
            if 'members' not in lib or cast_num not in lib['members']:
                return None
                
            member = lib['members'][cast_num]
            
            if member['castType'] != 11:  # SCRIPT
                return None
            
            result = {
                'name': member.get('name', ''),
                'cast_num': cast_num,
                'linked_entries': []
            }
            
            # Check all linked entries
            for linked_id in member.get('linkedEntries', []):
                linked = parser.fileEntries[linked_id]
                
                if linked['type'] in ['Lscr', 'Lctx']:
                    parser.f.seek(linked['dataOffset'] + 8)
                    data = parser.f.read(linked['dataLength'])
                    
                    # Try to extract strings
                    string_data = extract_lscr_strings(data, linked['dataOffset'] + 8)
                    
                    if string_data:
                        result['linked_entries'].append({
                            'type': linked['type'],
                            'offset': linked['dataOffset'],
                            'length': linked['dataLength'],
                            'strings': string_data
                        })
                    else:
                        # Even without parsed strings, record raw data
                        result['linked_entries'].append({
                            'type': linked['type'],
                            'offset': linked['dataOffset'],
                            'length': linked['dataLength'],
                            'raw_analyzed': True
                        })
            
            return result if result['linked_entries'] else None
    
    return None

def scan_scripts_in_file(filepath):
    """Scan all SCRIPT members in a file"""
    print(f"\nScanning SCRIPT members in: {os.path.basename(filepath)}")
    
    results = {
        'filename': os.path.basename(filepath),
        'scripts': []
    }
    
    try:
        parser = ShockwaveParser(filepath)
        parser.read()
        
        total_scripts = 0
        scripts_with_strings = 0
        
        for lib in parser.castLibraries:
            if 'members' not in lib:
                continue
                
            lib_name = lib['name']
            
            for cast_num, member in lib['members'].items():
                if member['castType'] == 11:  # SCRIPT
                    total_scripts += 1
                    script_data = analyze_script_member(parser, lib_name, cast_num)
                    
                    if script_data:
                        results['scripts'].append(script_data)
                        
                        # Check if it has strings
                        for entry in script_data['linked_entries']:
                            if 'strings' in entry:
                                scripts_with_strings += 1
                                print(f"  ✓ {lib_name}:{cast_num} '{script_data['name']}' - {len(entry['strings']['strings'])} strings")
                                break
                        else:
                            print(f"    {lib_name}:{cast_num} '{script_data['name']}' - no strings extracted")
        
        print(f"\nTotal SCRIPT members: {total_scripts}")
        print(f"Scripts with extracted strings: {scripts_with_strings}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    files_to_scan = [
        '03.DXR',
        '02.DXR',
        '00.CXT',
        'LBSTART.DXR'
    ]
    
    all_results = {}
    
    for filename in files_to_scan:
        filepath = os.path.join(extracted_dir, filename)
        if os.path.exists(filepath):
            all_results[filename] = scan_scripts_in_file(filepath)
        else:
            print(f"File not found: {filename}")
    
    # Save results
    output_file = os.path.expanduser('~/projects/mulle-meck-game/script_strings_results.json')
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    
    print(f"\nResults saved to: {output_file}")

if __name__ == '__main__':
    main()
