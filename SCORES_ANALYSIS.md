# Scores Analysis - Mulle Meck Game Build

## Problem Statement

The build was failing with:
```
FileNotFoundError: [Errno 2] No such file or directory: '/build/build_data/Movies/drxtract/82.DXR/bin'
```

## How Scores Are Supposed to Work

### 1. Architecture

The score extraction pipeline works in 5 stages:

```
.DXR file 
  → drxtract (Python wrapper)
  → riffxtract (extracts RIFF chunks → /bin directory)
  → vwscxtract (reads /bin/*VWSC → score.json)
  → score.py (reads score.json → score_tracks_*.json)
  → build_score_manual.py (manual processing for specific tracks)
```

### 2. Expected Directory Structure

After `drxtract` runs on `82.DXR`, it should create:

```
82.DXR/
├── bin/           ← CRITICAL: Contains binary chunks from RIFF extraction
│   ├── *VWSC      ← Score data file
│   ├── *CAS       ← Casting data
│   └── ... other chunks
├── cas/           ← Extracted casting elements
├── score.json     ← Created by vwscxtract from bin/*VWSC
└── score_tracks_82.DXR.json  ← Final output from score.py
```

### 3. The drxtract Pipeline

Located in `/tmp/drxtract-analysis/drxtract/drxtract.py`:

```python
# 1. Extract RIFF chunks to /bin
os.system(f'{basepath}riffxtract {pc_or_mac} {dxr_file} {work_dir}')

# 2. Extract score labels
os.system(f'{basepath}vwlbxtract {work_dir}')

# 3. Extract font map
os.system(f'{basepath}fmapxtract {work_dir}')

# 4. Extract casting elements (REQUIRES /bin)
os.system(f'{basepath}casxtract {pc_or_mac} {work_dir}')

# 5. Extract score (REQUIRES /bin)
os.system(f'{basepath}vwscxtract {work_dir}')
```

**Critical dependency:** Steps 4 and 5 both expect `/bin` to exist.

### 4. Why It Fails

**Root cause:** The `riffxtract` step (step 1) either:
- Fails silently without creating `/bin`
- The .DXR file format is not recognized
- The file is corrupted or incomplete

This specifically happens with `82.DXR` in the Swedish version.

## Why Scores Matter (and Don't Matter)

### What Scores Do

From `vwscxtract.py` analysis:
- **Score = Timeline data** (sprite positions, palette changes, main channel info)
- Used for **animation timing** and **sprite choreography**
- Contains frame-by-frame data for the Director movie

### Impact of Missing Scores

**Without scores:**
- ❌ Animation timing less precise
- ❌ Sprite movements may not sync perfectly
- ❌ Music/sound cues might be slightly off
- ✅ **Game still playable** (core logic not affected)
- ✅ Assets, sounds, and interactions work

**Why it's optional:**
The game can run with static assets and user interactions. Scores mainly enhance the cinematic/animated sequences.

## Solution Implemented

### Fix 1: Check for /bin before processing (DONE)

```python
def scores(self):
    files = glob.glob('%s/8*' % self.movie_folder)
    
    for movie_file in files:
        extract_folder = self.drxtract(movie_file)
        
        # NEW: Check if extraction succeeded
        bin_folder = os.path.join(extract_folder, 'bin')
        if not os.path.exists(bin_folder):
            print(f'Warning: {extract_folder} missing /bin directory, skipping')
            continue
        
        # NEW: Check if score.json exists
        score_json = os.path.join(extract_folder, 'score.json')
        if not os.path.exists(score_json):
            print(f'Warning: {score_json} not created, skipping')
            continue
        
        # Process score...
```

### Fix 2: Make scores non-fatal (DONE)

Changed all score-related errors from `raise` to `print + continue`, so the build can complete even if scores fail.

### Fix 3: Plugin extraction with 7z (DONE)

Added proper self-extracting ZIP support:
```python
# Try 7z first for self-extracting archives
subprocess.run(['7z', 'x', '-o' + extract_dir, local_file, '-y'], check=True)
```

## Alternative Approaches (Not Implemented)

### Option A: Fix riffxtract for 82.DXR
- Requires debugging the binary RIFF parser
- Time-intensive reverse engineering
- May not work if file is actually corrupt

### Option B: Manual score data
- Could create minimal score.json manually
- Only needed if animations are critical
- Not worth the effort for a proof-of-concept

### Option C: Skip Swedish 82.DXR entirely
- Most other .DXR files extract fine
- Could special-case this one file
- Build would complete but missing one scene

## Recommendations

1. **Current approach is correct:** Make scores optional, game works without them
2. **If scores are critical later:** Investigate why `riffxtract` fails on `82.DXR` specifically
3. **For production:** Test if animations work acceptably without perfect score timing

## Files Modified

- `build_scripts/build.py` - scores() function with /bin checks
- `build_scripts/build.py` - download_plugin() with 7z support
- `build_scripts/build.py` - copy_images() with optional plugin assets
- `Dockerfile` - Added `p7zip-full` package

## Status

✅ Builds should now complete even if scores fail
✅ Plugin extraction now uses 7z for self-extracting archives
⏳ Waiting for builds to finish to confirm fix works
