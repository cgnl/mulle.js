#!/usr/bin/env python3
"""
patch_drxtract.py - Patch drxtract's riffxtract.py to handle errors gracefully
"""
import os
import sys
import shutil

def patch_riffxtract(drxtract_path):
    """Patch riffxtract.py to not exit on errors"""
    
    riffxtract_file = os.path.join(drxtract_path, 'drxtract', 'riffxtract.py')
    
    if not os.path.exists(riffxtract_file):
        print(f"ERROR: {riffxtract_file} not found")
        return False
    
    # Backup original
    backup_file = riffxtract_file + '.backup'
    if not os.path.exists(backup_file):
        shutil.copy(riffxtract_file, backup_file)
        print(f"✓ Backed up to {backup_file}")
    
    with open(riffxtract_file, 'r') as f:
        content = f.read()
    
    # Patch 1: Make "first chunk is not IMAP" non-fatal
    old_code_1 = '''if chunk.identifier != IMAP_FILE_FORMAT:
                logging.error("The first chunk is not an IMAP chunk: %s",
                              chunk.identifier)
                sys.exit(-1)'''
    
    new_code_1 = '''if chunk.identifier != IMAP_FILE_FORMAT:
                logging.warning("The first chunk is not an IMAP chunk: %s",
                              chunk.identifier)
                logging.warning("Trying to save all blocks instead...")
                # Save all blocks as fallback
                for i in range(0, len(riffData.chunks)):
                    chunk_fallback: Chunk = riffData.chunks[i]
                    save_chunk(chunk_fallback, i+1, output_folder)
                return'''
    
    # Patch 2: Make "Wrong MMAP location" non-fatal
    old_code_2 = '''if chunk.identifier != MMAP_FILE_FORMAT:
                logging.error("Wrong MMAP location!")
                sys.exit(-1)'''
    
    new_code_2 = '''if chunk.identifier != MMAP_FILE_FORMAT:
                logging.warning("Wrong MMAP location!")
                logging.warning("Trying to save all blocks instead...")
                # Save all blocks as fallback
                for i in range(0, len(riffData.chunks)):
                    chunk_fallback: Chunk = riffData.chunks[i]
                    save_chunk(chunk_fallback, i+1, output_folder)
                return'''
    
    # Patch 3: Make "Wrong resource ID" non-fatal
    old_code_3 = '''if resource.chunkID != chunk.identifier:
                    logging.error("Wrong resource ID (%s != %s)", 
                                  resource.chunkID, chunk.identifier)
                    sys.exit(-1)'''
    
    new_code_3 = '''if resource.chunkID != chunk.identifier:
                    logging.warning("Wrong resource ID (%s != %s)", 
                                  resource.chunkID, chunk.identifier)
                    logging.warning("Skipping this resource...")
                    continue'''
    
    # Apply patches
    modified = content
    patches_applied = 0
    
    if old_code_1 in modified:
        modified = modified.replace(old_code_1, new_code_1)
        patches_applied += 1
        print("✓ Patch 1: Made IMAP check non-fatal")
    
    if old_code_2 in modified:
        modified = modified.replace(old_code_2, new_code_2)
        patches_applied += 1
        print("✓ Patch 2: Made MMAP check non-fatal")
    
    if old_code_3 in modified:
        modified = modified.replace(old_code_3, new_code_3)
        patches_applied += 1
        print("✓ Patch 3: Made resource ID check non-fatal")
    
    if patches_applied == 0:
        print("⚠ No patches applied (already patched or code changed)")
        return False
    
    # Write patched version
    with open(riffxtract_file, 'w') as f:
        f.write(modified)
    
    print(f"✓ Applied {patches_applied} patches to {riffxtract_file}")
    return True

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print("USAGE: patch_drxtract.py <drxtract_repo_path>")
        sys.exit(1)
    
    success = patch_riffxtract(sys.argv[1])
    sys.exit(0 if success else 1)
