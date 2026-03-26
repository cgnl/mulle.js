#!/usr/bin/env python3
"""
Extract boat part data from boten_CDDATA.CXT text files.

This script parses the Lingo property lists in the extracted text files
and updates boat_parts.hash.json with the missing Requires, Covers, New,
and MorphsTo data.

Usage:
    python extract_boat_parts.py
"""

import os
import re
import json
from pathlib import Path

# Paths
SCRIPT_DIR = Path(__file__).parent
TOOLS_DIR = SCRIPT_DIR.parent
CDDATA_DIR = TOOLS_DIR / "cst_out_new" / "boten_CDDATA.CXT" / "Standalone"
OUTPUT_FILE = TOOLS_DIR / "data" / "boat_parts.hash.json"
BACKUP_FILE = TOOLS_DIR / "data" / "boat_parts.hash.json.backup"


def parse_lingo_value(value_str):
    """
    Parse a Lingo value into Python equivalent.
    
    Handles:
    - Numbers: 123, -45
    - Strings: "hello"
    - Symbols: #foo -> "foo"
    - Lists: [1, 2, 3]
    - Property lists: [#a: 1, #b: 2] -> {"a": 1, "b": 2}
    - Nested structures
    """
    value_str = value_str.strip()
    
    # Empty or zero
    if value_str == '0' or value_str == '':
        return 0
    
    # Boolean
    if value_str.upper() == 'TRUE':
        return True
    if value_str.upper() == 'FALSE':
        return False
    
    # String
    if value_str.startswith('"') and value_str.endswith('"'):
        return value_str[1:-1]
    
    # Number
    try:
        if '.' in value_str:
            return float(value_str)
        return int(value_str)
    except ValueError:
        pass
    
    # Symbol
    if value_str.startswith('#'):
        return value_str[1:]  # Remove # prefix
    
    # List or property list
    if value_str.startswith('[') and value_str.endswith(']'):
        return parse_lingo_list(value_str[1:-1])
    
    # Unknown - return as string
    return value_str


def parse_lingo_list(content):
    """
    Parse the contents of a Lingo list (without outer brackets).
    Returns a list or dict depending on whether it's a property list.
    """
    content = content.strip()
    
    if not content:
        return []
    
    # Empty property list [:]
    if content == ':':
        return {}
    
    # Check if it's a property list (contains #key: value pairs)
    if re.search(r'#\w+\s*:', content):
        return parse_lingo_proplist(content)
    
    # Regular list - split by commas, respecting nested brackets
    items = split_lingo_items(content)
    return [parse_lingo_value(item) for item in items]


def parse_lingo_proplist(content):
    """
    Parse a Lingo property list into a Python dict.
    Example: "#a: 1, #b: 2" -> {"a": 1, "b": 2}
    
    Uses a state machine to properly handle nested brackets.
    """
    result = {}
    
    i = 0
    while i < len(content):
        # Skip whitespace
        while i < len(content) and content[i] in ' \t\n,':
            i += 1
        
        if i >= len(content):
            break
        
        # Expect #key
        if content[i] != '#':
            i += 1
            continue
        
        i += 1  # Skip #
        
        # Read key name
        key_start = i
        while i < len(content) and content[i].isalnum():
            i += 1
        key = content[key_start:i].lower()
        
        if not key:
            continue
        
        # Skip whitespace and colon
        while i < len(content) and content[i] in ' \t:':
            i += 1
        
        # Read value (respecting bracket nesting)
        value_start = i
        bracket_count = 0
        in_string = False
        
        while i < len(content):
            c = content[i]
            
            if c == '"' and (i == 0 or content[i-1] != '\\'):
                in_string = not in_string
            elif not in_string:
                if c == '[':
                    bracket_count += 1
                elif c == ']':
                    bracket_count -= 1
                elif c == ',' and bracket_count == 0:
                    break
            
            i += 1
        
        value_str = content[value_start:i].strip()
        
        # Remove trailing comma
        if value_str.endswith(','):
            value_str = value_str[:-1].strip()
        
        result[key] = parse_lingo_value(value_str)
    
    return result


def split_lingo_items(content):
    """
    Split a Lingo list by commas, respecting nested brackets.
    """
    items = []
    current = ""
    bracket_count = 0
    
    for c in content:
        if c == '[':
            bracket_count += 1
            current += c
        elif c == ']':
            bracket_count -= 1
            current += c
        elif c == ',' and bracket_count == 0:
            if current.strip():
                items.append(current.strip())
            current = ""
        else:
            current += c
    
    if current.strip():
        items.append(current.strip())
    
    return items


def parse_part_file(filepath):
    """
    Parse a single part text file and return the part data.
    """
    try:
        with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
            content = f.read().strip()
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
        return None
    
    # Skip non-part files
    if not content.startswith('[#PartID:') and not content.startswith('[#partId:'):
        return None
    
    try:
        # Parse the property list
        data = parse_lingo_value(content)
        
        if not isinstance(data, dict):
            return None
        
        # Normalize keys to match our JSON structure
        part = {}
        
        # Map Lingo keys to our JSON keys
        key_map = {
            'partid': 'PartID',
            'master': 'Master',
            'morphsto': 'MorphsTo',
            'shelfview': 'ShelfView',
            'junkview': 'JunkView',
            'useview': 'UseView',
            'useview2': 'UseView2',
            'useviewinside': 'UseViewInside',
            'useviewinside2': 'UseViewInside2',
            'snddescription': 'SndDescription',
            'sndattachonboat': 'SndAttachOnBoat',
            'snddropon': 'SndDropOn',
            'offset': 'Offset',
            'properties': 'Properties',
            'clickarea': 'ClickArea',
            'requires': 'Requires',
            'covers': 'Covers',
            'new': 'new'  # Keep lowercase for 'new' as in original
        }
        
        for lingo_key, json_key in key_map.items():
            if lingo_key in data:
                part[json_key] = data[lingo_key]
        
        # Ensure PartID exists
        if 'PartID' not in part:
            return None

        # Skip placeholder entry (PartID 0)
        if part.get('PartID') == 0:
            return None
        
        return part
        
    except Exception as e:
        print(f"Error parsing {filepath}: {e}")
        return None


def main():
    """Main function to extract and merge boat part data."""
    
    print(f"Looking for text files in: {CDDATA_DIR}")
    
    if not CDDATA_DIR.exists():
        print(f"Error: CDDATA directory not found: {CDDATA_DIR}")
        return
    
    # Start fresh - don't merge with existing
    print(f"Will write to: {OUTPUT_FILE}")
    existing_data = {}
    
    # Parse all text files
    print("Parsing text files...")
    
    parsed_parts = {}
    txt_files = list(CDDATA_DIR.glob("*.txt"))
    
    for txt_file in txt_files:
        part_data = parse_part_file(txt_file)
        if part_data and 'PartID' in part_data:
            part_id = str(part_data['PartID'])
            parsed_parts[part_id] = part_data
    
    print(f"Parsed {len(parsed_parts)} part definitions")
    
    # Count parts with snap point data
    parts_with_requires = sum(1 for p in parsed_parts.values() 
                              if p.get('Requires') and p.get('Requires') != 0)
    parts_with_new = sum(1 for p in parsed_parts.values() 
                         if p.get('new') and p.get('new') != 0)
    parts_with_morphs = sum(1 for p in parsed_parts.values() 
                            if p.get('MorphsTo') and p.get('MorphsTo') != 0 
                            and isinstance(p.get('MorphsTo'), list))
    
    print(f"  Parts with Requires: {parts_with_requires}")
    print(f"  Parts with new points: {parts_with_new}")
    print(f"  Parts with MorphsTo: {parts_with_morphs}")
    
    # Merge with existing data
    print("Merging with existing data...")
    
    updated_count = 0
    new_count = 0
    
    for part_id, part_data in parsed_parts.items():
        if part_id in existing_data:
            # Update existing entry with new fields
            existing = existing_data[part_id]
            
            # Update Requires if we have data and existing is 0
            if part_data.get('Requires') and part_data['Requires'] != 0:
                if existing.get('Requires') == 0 or existing.get('Requires') is None:
                    existing['Requires'] = part_data['Requires']
                    updated_count += 1
            
            # Update Covers
            if part_data.get('Covers') and part_data['Covers'] != 0:
                if existing.get('Covers') == 0 or existing.get('Covers') is None:
                    existing['Covers'] = part_data['Covers']
            
            # Update new (snap points)
            if part_data.get('new') and part_data['new'] != 0:
                if existing.get('new') == 0 or existing.get('new') is None or existing.get('new') == [['a1', [14, 2], [195, 22]]]:
                    # Only update if missing or if it's the default single point
                    if len(part_data['new']) > 1 or not existing.get('new'):
                        existing['new'] = part_data['new']
            
            # Update MorphsTo
            if part_data.get('MorphsTo') and part_data['MorphsTo'] != 0:
                if existing.get('MorphsTo') == 0 or existing.get('MorphsTo') is None:
                    existing['MorphsTo'] = part_data['MorphsTo']
            
        else:
            # New part - add it
            existing_data[part_id] = part_data
            new_count += 1
    
    print(f"Updated {updated_count} existing parts with snap point data")
    print(f"Added {new_count} new parts")
    
    # Final count
    final_with_requires = sum(1 for p in existing_data.values() 
                              if p.get('Requires') and p.get('Requires') != 0)
    final_with_new = sum(1 for p in existing_data.values() 
                         if p.get('new') and p.get('new') != 0)
    
    print(f"\nFinal counts:")
    print(f"  Total parts: {len(existing_data)}")
    print(f"  Parts with Requires: {final_with_requires}")
    print(f"  Parts with new points: {final_with_new}")
    
    # Save updated data
    print(f"\nSaving to: {OUTPUT_FILE}")
    
    with open(OUTPUT_FILE, 'w') as f:
        json.dump(existing_data, f, separators=(',', ':'))
    
    print("Done!")
    
    # Print some example parts with snap data for verification
    print("\n=== Example parts with Requires ===")
    count = 0
    for part_id, part_data in existing_data.items():
        if part_data.get('Requires') and part_data.get('Requires') != 0:
            print(f"Part {part_id}: Requires={part_data['Requires']}, Covers={part_data.get('Covers')}")
            count += 1
            if count >= 5:
                break
    
    print("\n=== Example hulls with new points ===")
    count = 0
    for part_id, part_data in existing_data.items():
        new_pts = part_data.get('new')
        if new_pts and new_pts != 0 and isinstance(new_pts, list) and len(new_pts) > 3:
            print(f"Part {part_id}: {len(new_pts)} snap points: {[p[0] for p in new_pts]}")
            count += 1
            if count >= 3:
                break


if __name__ == '__main__':
    main()
