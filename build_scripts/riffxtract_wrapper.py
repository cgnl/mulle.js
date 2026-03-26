#!/usr/bin/env python3
"""
riffxtract_wrapper.py - Wrapper around drxtract's riffxtract to handle errors gracefully
"""
import sys
import os
import subprocess
import logging

logging.basicConfig(level=logging.INFO)

def main():
    if len(sys.argv) < 4:
        print("USAGE: riffxtract_wrapper.py [pc|mac] <file.drx> <directory>")
        sys.exit(1)
    
    platform = sys.argv[1]
    dxr_file = sys.argv[2]
    work_dir = sys.argv[3]
    
    # Create bin directory
    bin_dir = os.path.join(work_dir, 'bin')
    os.makedirs(bin_dir, exist_ok=True)
    
    logging.info(f"Extracting RIFF chunks from {dxr_file}...")
    
    # Try to run riffxtract (from drxtract package)
    try:
        result = subprocess.run(
            [sys.executable, '-m', 'drxtract.riffxtract', platform, dxr_file, work_dir],
            capture_output=True,
            text=True,
            timeout=30
        )
        
        if result.returncode != 0:
            logging.warning(f"riffxtract failed with code {result.returncode}")
            logging.warning(f"stderr: {result.stderr}")
            
            # Check if bin directory has any files
            bin_files = os.listdir(bin_dir) if os.path.exists(bin_dir) else []
            if not bin_files:
                logging.error(f"No files extracted to {bin_dir}")
                logging.error("Possible reasons:")
                logging.error("  - File is not a valid RIFF/RIFX format")
                logging.error("  - Missing imap/mmap chunks")
                logging.error("  - File is corrupted or incomplete")
                # Don't exit - let caller decide what to do
            else:
                logging.info(f"Partial extraction: {len(bin_files)} files in bin/")
        else:
            bin_files = os.listdir(bin_dir) if os.path.exists(bin_dir) else []
            logging.info(f"✓ Successfully extracted {len(bin_files)} chunks to bin/")
    
    except subprocess.TimeoutExpired:
        logging.error(f"riffxtract timed out after 30 seconds")
    except Exception as e:
        logging.error(f"Unexpected error running riffxtract: {e}")

if __name__ == '__main__':
    main()
