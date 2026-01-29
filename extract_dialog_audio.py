#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Extract dialog audio files from Mulle Meck
Based on the deep dive findings: dialogs are voice-only, no text
"""

import os
import sys

sys.path.append('tools/build_scripts')
from ShockwaveParser import ShockwaveParser

def extract_audio_by_ids(filepath, audio_ids, output_dir):
    """Extract specific audio files by their IDs"""
    print(f"\n{'='*70}")
    print(f"Extracting audio from: {os.path.basename(filepath)}")
    print(f"{'='*70}")
    
    # Create output directory
    os.makedirs(output_dir, exist_ok=True)
    
    try:
        parser = ShockwaveParser(filepath)
        parser.read()
        
        extracted_count = 0
        
        for lib in parser.castLibraries:
            if 'members' not in lib:
                continue
            
            lib_name = lib['name']
            
            for cast_num, member in lib['members'].items():
                # CastType 6 = SOUND
                if member['castType'] == 6:
                    member_name = member.get('name', '')
                    
                    # Check if this is one of our target audio IDs
                    if any(aid in member_name for aid in audio_ids):
                        print(f"  Found: {member_name} (cast #{cast_num})")
                        
                        # Extract using parser
                        try:
                            parser.extractCastMember(
                                lib_name,
                                cast_num,
                                writeRaw=False,
                                outPath=output_dir,
                                useName=True
                            )
                            extracted_count += 1
                        except Exception as e:
                            print(f"    Error extracting: {e}")
        
        print(f"\nTotal extracted: {extracted_count}")
        
    except Exception as e:
        print(f"ERROR: {e}")
        import traceback
        traceback.print_exc()

def main():
    extracted_dir = os.path.expanduser('~/projects/mulle-meck-game/extracted/')
    output_dir = os.path.expanduser('~/projects/mulle-meck-game/dialog_audio/')
    
    # Dialog audio IDs found in the deep dive
    dialog_audio_ids = [
        '03d047v0', '03d048v0', '03d049v0', '03d050v0', '03d051v0',  # LookUnderCar dialogs
        '00e017v0', '00e018v0', '00e019v0',  # Talk dialogs
        '00e029v0', '00e030v0', '00e031v0',  # Scratch/ScratchHead sounds
    ]
    
    print("MULLE MECK - DIALOG AUDIO EXTRACTION")
    print("Based on deep dive findings:")
    print("  - Dialogs are voice-acted (no text in DXR)")
    print("  - Audio IDs are referenced in Lingo behavior scripts")
    print("  - Extracting audio files for transcription...")
    print()
    
    # Extract from main gameplay files
    files_to_scan = [
        '03.DXR',  # Main garage gameplay
        '02.DXR',  # Intro
        '00.CXT',  # Shared resources
        'CDDATA.CXT'  # Large data archive
    ]
    
    for filename in files_to_scan:
        filepath = os.path.join(extracted_dir, filename)
        if os.path.exists(filepath):
            extract_audio_by_ids(filepath, dialog_audio_ids, output_dir)
        else:
            print(f"File not found: {filename}")
    
    print(f"\n{'='*70}")
    print(f"Audio files saved to: {output_dir}")
    print(f"{'='*70}")
    print("\nNEXT STEPS:")
    print("1. Listen to the .wav files in the dialog_audio/ folder")
    print("2. Transcribe manually, or use:")
    print("   - OpenAI Whisper: whisper --language nl <file>.wav")
    print("   - Google Cloud Speech-to-Text")
    print("   - Azure Speech Services")
    print()

if __name__ == '__main__':
    main()
