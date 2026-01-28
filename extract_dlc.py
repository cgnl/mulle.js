#!/usr/bin/env python3
"""
Extract DLC package data from Oom Otto expansion packs
Analyzes .cst files and creates JSON data for web game
"""
import sys
import json
import os

sys.path.insert(0, 'build_scripts')
from ShockwaveParser import ShockwaveParser

def extract_dlc_packages():
    """Extract all DLC package data"""
    dlc_data = {}
    
    base_path = os.path.join(os.path.dirname(__file__), '..', 'dlc')
    
    for pkg_num in range(1, 11):
        filepath = os.path.join(base_path, f'pakket{pkg_num}.cst')
        
        if not os.path.exists(filepath):
            print(f"⚠️  Pakket {pkg_num}: File not found at {filepath}")
            continue
        
        try:
            print(f"📦 Processing pakket{pkg_num}.cst...")
            parser = ShockwaveParser(filepath)
            parser.read()
            
            parts = []
            
            # Extract bitmap members
            for lib in parser.castLibraries:
                lib_name = lib.get('name', 'Unknown')
                members = lib.get('members', {})
                
                for member_id, member in members.items():
                    cast_type = member.get('castType')
                    
                    # Type 1 = BITMAP (car parts)
                    if cast_type == 1:
                        part_name = member.get('name', f'DLC Part {member_id}')
                        
                        parts.append({
                            'partId': f'dlc{pkg_num}_{member_id}',
                            'memberNum': int(member_id),
                            'name': part_name,
                            'package': pkg_num,
                            'library': lib_name
                        })
            
            dlc_data[f'pakket{pkg_num}'] = {
                'id': pkg_num,
                'name': f'Oom Otto Pakket {pkg_num}',
                'parts': parts,
                'partCount': len(parts)
            }
            
            print(f"   ✓ Found {len(parts)} parts")
            
        except Exception as e:
            print(f"   ✗ Error: {e}")
            import traceback
            traceback.print_exc()
    
    return dlc_data

def main():
    print("=" * 60)
    print("DLC Package Extractor - Mulle Meck Oom Otto")
    print("=" * 60)
    
    dlc_data = extract_dlc_packages()
    
    # Save to JSON
    output_dir = os.path.join(os.path.dirname(__file__), 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_file = os.path.join(output_dir, 'dlc_packages.json')
    
    with open(output_file, 'w') as f:
        json.dump(dlc_data, f, indent=2)
    
    print("\n" + "=" * 60)
    print(f"✓ Saved to {output_file}")
    print(f"✓ Total packages: {len(dlc_data)}")
    
    total_parts = sum(pkg['partCount'] for pkg in dlc_data.values())
    print(f"✓ Total parts: {total_parts}")
    print("=" * 60)

if __name__ == '__main__':
    main()
