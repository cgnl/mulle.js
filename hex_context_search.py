#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Hex context search around known audio IDs
"""

import os
import sys

AUDIO_IDS = [
    b'03d047v0',
    b'03d048v0', 
    b'03d049v0',
    b'03d050v0',
    b'03d051v0',
    b'03d052v0',
    b'03d053v0'
]

def hex_dump(data, offset=0, length=16):
    """Create hex dump with ASCII view"""
    lines = []
    for i in range(0, len(data), length):
        chunk = data[i:i+length]
        hex_part = ' '.join(f'{b:02x}' for b in chunk)
        ascii_part = ''.join(chr(b) if 32 <= b < 127 else '.' for b in chunk)
        lines.append(f'{offset+i:08x}  {hex_part:<48}  {ascii_part}')
    return '\n'.join(lines)

def search_audio_context(filepath, context_size=500):
    """Search for text context around audio IDs"""
    print(f"\n{'='*70}")
    print(f"Searching: {os.path.basename(filepath)}")
    print(f"{'='*70}")
    
    with open(filepath, 'rb') as f:
        data = f.read()
    
    results = []
    
    for audio_id in AUDIO_IDS:
        idx = 0
        count = 0
        while True:
            idx = data.find(audio_id, idx)
            if idx == -1:
                break
            
            count += 1
            
            # Extract context
            start = max(0, idx - context_size)
            end = min(len(data), idx + len(audio_id) + context_size)
            context = data[start:end]
            
            print(f"\n[{count}] Found '{audio_id.decode('ascii')}' at offset {idx:08x}")
            print(f"Context ({start:08x} to {end:08x}):")
            print(hex_dump(context, start))
            
            # Try to find readable strings nearby
            print("\nReadable strings in context:")
            for i in range(len(context)):
                # Look for sequences of printable chars
                if 32 <= context[i] < 127:
                    # Start of potential string
                    j = i
                    while j < len(context) and 32 <= context[j] < 127:
                        j += 1
                    
                    if j - i >= 4:  # At least 4 chars
                        try:
                            text = context[i:j].decode('ascii')
                            print(f"  @{start+i:08x}: '{text}'")
                        except:
                            pass
            
            results.append({
                'audio_id': audio_id.decode('ascii'),
                'offset': idx,
                'context_hex': context.hex()
            })
            
            idx += 1
    
    return results

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    
    # Focus on the main gameplay file
    filepath = os.path.join(extracted_dir, '03.DXR')
    
    if os.path.exists(filepath):
        results = search_audio_context(filepath, context_size=300)
        print(f"\n\nTotal matches found: {len(results)}")
    else:
        print(f"File not found: {filepath}")

if __name__ == '__main__':
    main()
