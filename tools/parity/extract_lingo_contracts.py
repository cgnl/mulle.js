#!/usr/bin/env python3
"""Extract behavioral contracts from decompiled Lingo .ls files.

Parses all .ls files under decompiled_lingo/ and extracts:
- Event handlers (on exitFrame, on mouseUp, etc.)
- Frame transitions (go("label"), go(the frame), go(1, "04"))
- State reads/writes on gMulleGlobals
- Inventory operations (isInInventory, deleteFromInventory, etc.)
- Audio cues (puppetSound, sound commands, audio ID patterns)
- Scene/movie transitions
- Sprite operations
- Global function calls (primaTrip, MulleSez, AmbienceSound, trySailing)

Output: lingo_contracts.json and lingo_summary.json
"""

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
LINGO_DIR = PROJECT_ROOT / "decompiled_lingo"
OUT_CONTRACTS = SCRIPT_DIR / "lingo_contracts.json"
OUT_SUMMARY = SCRIPT_DIR / "lingo_summary.json"

# --- Regex patterns ---

# Event handlers
RE_HANDLER = re.compile(
    r'^on\s+(exitFrame|mouseUp|mouseEnter|mouseLeave|startMovie|stopMovie|'
    r'prepareMovie|idle|keyDown|mouseDown|enterFrame|beginSprite|endSprite|'
    r'prepareFrame|stepFrame|mouseWithin|rightMouseUp|rightMouseDown|'
    r'cuePassed|loop|init|kill|new)\b',
    re.MULTILINE
)

# Frame transitions: go("label"), go(the frame), go(the frame + N), go(1, "04"), go(#next)
RE_GO_LABEL = re.compile(r'\bgo\s*\(\s*"([^"]+)"\s*\)', re.IGNORECASE)
RE_GO_FRAME = re.compile(r'\bgo\s*\(\s*the\s+frame\s*\)', re.IGNORECASE)
RE_GO_FRAME_PLUS = re.compile(r'\bgo\s*\(\s*the\s+frame\s*\+\s*(\d+)\s*\)', re.IGNORECASE)
RE_GO_MARKER = re.compile(r'\bgo\s*\(\s*the\s+marker\s*\+\s*(\d+)\s*\)', re.IGNORECASE)
RE_GO_MOVIE = re.compile(r'\bgo\s*\(\s*(\d+)\s*,\s*"([^"]+)"\s*\)', re.IGNORECASE)
RE_GO_NEXT = re.compile(r'\bgo\s*\(\s*#next\s*\)', re.IGNORECASE)
RE_GO_VAR = re.compile(r'\bgo\s*\(\s*(\w+)\s*\)', re.IGNORECASE)

# gMulleGlobals access: "the X of gMulleGlobals" or "gMulleGlobals.X"
RE_STATE_READ = re.compile(r'\bthe\s+(\w+)\s+of\s+gMulleGlobals\b', re.IGNORECASE)
RE_STATE_WRITE = re.compile(r'\bset\s+the\s+(\w+)\s+of\s+gMulleGlobals\b', re.IGNORECASE)

# Inventory operations
RE_IS_IN_INV = re.compile(r'\bisInInventory\s*\([^,)]*,\s*[#:]?(\w+)', re.IGNORECASE)
RE_DEL_FROM_INV = re.compile(r'\bdeleteFromInventory\s*\([^,)]*,\s*[#:]?(\w+)', re.IGNORECASE)
RE_SET_IN_INV = re.compile(r'\bsetInInventory\s*\([^,)]*,\s*[#:]?(\w+)', re.IGNORECASE)
RE_ADD_TO_INV = re.compile(r'\baddToInventory\s*\([^,)]*,\s*[#:]?(\w+)', re.IGNORECASE)
RE_CLEAR_INV = re.compile(r'\bclearInventory\s*\(', re.IGNORECASE)
RE_LOOKUP_INV = re.compile(r'\blookUpInventory\s*\([^,)]*,\s*[#:]?(\w+)', re.IGNORECASE)

# Audio cues
RE_PUPPET_SOUND = re.compile(r'\bpuppetSound\s*\(\s*\d+\s*,\s*"?([^")]+)"?\s*\)', re.IGNORECASE)
RE_SOUND_PLAY_FILE = re.compile(r'\bsound\s+playFile\s+\d+\s*,\s*"?([^")\s]+)"?', re.IGNORECASE)
RE_SOUND_FADE_IN = re.compile(r'\bsound\s+fadeIn\b', re.IGNORECASE)
RE_SOUND_FADE_OUT = re.compile(r'\bsound\s+fadeOut\b', re.IGNORECASE)
RE_SOUND_STOP = re.compile(r'\bsound\s+stop\s+(\d+)', re.IGNORECASE)
RE_AUDIO_ID = re.compile(r'\b(\d{2}[de]\d{3}v\d)\b')
RE_PLAY_GSOUND = re.compile(r'\bplay\s*\(\s*gSound\s*,\s*"?([^",)]+)"?', re.IGNORECASE)
RE_PRELOAD_GSOUND = re.compile(r'\bpreLoad\s*\(\s*gSound\s*,\s*"?([^",)]+)"?', re.IGNORECASE)

# Sprite operations
RE_SPRITE_LOC = re.compile(r'\bset\s+the\s+loc\s+of\s+sprite\b', re.IGNORECASE)
RE_SPRITE_MEMBER = re.compile(r'\bset\s+the\s+member\s+of\s+sprite\b', re.IGNORECASE)
RE_SPRITE_VISIBLE = re.compile(r'\bset\s+the\s+visible\s+of\s+sprite\b', re.IGNORECASE)
RE_SPRITE_BLEND = re.compile(r'\bset\s+the\s+blend\s+of\s+sprite\b', re.IGNORECASE)
RE_SEND_SPRITE = re.compile(r'\bsendSprite\s*\(', re.IGNORECASE)

# Global function calls
RE_PRIMA_TRIP = re.compile(r'\bprimaTrip\s*\(', re.IGNORECASE)
RE_MULLE_SEZ = re.compile(r'\bMulleSez\b', re.IGNORECASE)
RE_AMBIENCE_SOUND = re.compile(r'\bAmbienceSound\b', re.IGNORECASE)
RE_TRY_SAILING = re.compile(r'\btrySailing\s*\(', re.IGNORECASE)
RE_DRAW_BOAT = re.compile(r'\bdrawBoat\s*\(', re.IGNORECASE)
RE_SET_SKY = re.compile(r'\bsetSky\s*\(', re.IGNORECASE)
RE_ADD_COMPLETED = re.compile(r'\baddCompletedMission\s*\([^,)]*,\s*(\d+)', re.IGNORECASE)
RE_ADD_GIVEN = re.compile(r'\baddGivenMission\s*\([^,)]*,\s*(\d+)', re.IGNORECASE)
RE_IS_MISSION_COMPLETED = re.compile(r'\bisMissionCompleted\s*\([^,)]*,\s*(\d+)', re.IGNORECASE)
RE_IS_MISSION_GIVEN = re.compile(r'\bisMissionGiven\s*\([^,)]*,\s*(\d+)', re.IGNORECASE)
RE_GO_TO_SCENE = re.compile(r'\bgoToScene\s*\(', re.IGNORECASE)
RE_CURSOR = re.compile(r'\bcursor\s*\(\s*(\d+)\s*\)', re.IGNORECASE)

# Scene/DXR references
RE_DXR_REF = re.compile(r'"([^"]*\.(?:DXR|dxr))"', re.IGNORECASE)

# Known global function names to detect
GLOBAL_FUNCS = {
    'primaTrip': RE_PRIMA_TRIP,
    'MulleSez': RE_MULLE_SEZ,
    'AmbienceSound': RE_AMBIENCE_SOUND,
    'trySailing': RE_TRY_SAILING,
    'drawBoat': RE_DRAW_BOAT,
    'setSky': RE_SET_SKY,
    'goToScene': RE_GO_TO_SCENE,
}


def extract_contract(filepath: Path, rel_path: str) -> dict:
    """Extract behavioral contract from a single .ls file."""
    try:
        text = filepath.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        return {"error": str(e), "path": str(filepath)}

    lines = text.splitlines()
    raw_lines = len(lines)

    # Handlers
    handlers = sorted(set(m.group(1) for m in RE_HANDLER.finditer(text)))

    # Transitions
    transitions = []
    for m in RE_GO_LABEL.finditer(text):
        transitions.append({"type": "go", "target": m.group(1)})
    for m in RE_GO_FRAME.finditer(text):
        if not RE_GO_FRAME_PLUS.search(m.group(0) if hasattr(m, 'group') else text[m.start():m.start()+50]):
            transitions.append({"type": "go", "target": "frame"})
    # Deduplicate frame entries - re-scan properly
    transitions = []
    for m in RE_GO_LABEL.finditer(text):
        transitions.append({"type": "go", "target": m.group(1)})
    for m in RE_GO_FRAME_PLUS.finditer(text):
        transitions.append({"type": "go", "target": f"frame+{m.group(1)}"})
    for m in RE_GO_MARKER.finditer(text):
        transitions.append({"type": "go", "target": f"marker+{m.group(1)}"})
    for m in RE_GO_MOVIE.finditer(text):
        transitions.append({"type": "go_movie", "target": m.group(2), "frame": int(m.group(1))})
    for m in RE_GO_NEXT.finditer(text):
        transitions.append({"type": "go", "target": "#next"})

    # Check for go(the frame) that isn't go(the frame + N)
    for m in RE_GO_FRAME.finditer(text):
        span = text[m.start():m.start()+40]
        if not RE_GO_FRAME_PLUS.search(span):
            transitions.append({"type": "go", "target": "frame"})

    # go(variable) - only if it's a known variable pattern
    for m in RE_GO_VAR.finditer(text):
        val = m.group(1)
        # Skip already-matched patterns
        if val.lower() in ('the', '1', '2', '3') or val.startswith('"'):
            continue
        if val not in ('myMarker', 'tmpMarker', 'marker'):
            continue
        transitions.append({"type": "go_var", "target": val})

    # Deduplicate transitions
    seen = set()
    unique_transitions = []
    for t in transitions:
        key = (t["type"], t["target"], t.get("frame", ""))
        if key not in seen:
            seen.add(key)
            unique_transitions.append(t)
    transitions = unique_transitions

    # State reads/writes
    state_reads = sorted(set(f"gMulleGlobals.{m.group(1)}" for m in RE_STATE_READ.finditer(text)))
    state_writes = sorted(set(f"gMulleGlobals.{m.group(1)}" for m in RE_STATE_WRITE.finditer(text)))

    # Inventory operations
    inventory_ops = []
    for m in RE_IS_IN_INV.finditer(text):
        inventory_ops.append({"op": "isInInventory", "item": m.group(1)})
    for m in RE_DEL_FROM_INV.finditer(text):
        inventory_ops.append({"op": "deleteFromInventory", "item": m.group(1)})
    for m in RE_SET_IN_INV.finditer(text):
        inventory_ops.append({"op": "setInInventory", "item": m.group(1)})
    for m in RE_ADD_TO_INV.finditer(text):
        inventory_ops.append({"op": "addToInventory", "item": m.group(1)})
    for m in RE_LOOKUP_INV.finditer(text):
        inventory_ops.append({"op": "lookUpInventory", "item": m.group(1)})
    if RE_CLEAR_INV.search(text):
        inventory_ops.append({"op": "clearInventory", "item": "*"})

    # Audio cues — classified by type
    # LITERAL: hardcoded audio ID string (e.g., "05d051v0")
    # VARIABLE: Lingo variable name used in sound call (e.g., tmpSnd)
    # DYNAMIC: string concatenation pattern (e.g., normalSoundBase & "v0")
    # LIST_ACCESS: getAt/getProp on a sound list
    audio_cues_classified = []
    audio_cues_set = set()  # for dedup

    # Known Lingo variable names that hold audio IDs (not IDs themselves)
    LINGO_SOUND_VARS = {
        'tmpSnd', 'tmpEffect', 'tmpOpEffect', 'argSound', 'sndId',
        'infoSound', 'soundToKick', 'theSnd', 'nowPlaying', 'wavesID',
        'stemWaterID', 'windID', 'singleWaveID', 'tmpID',
    }
    # Known Lingo cast member names used as sounds (not audio ID patterns)
    LINGO_CAST_MEMBERS = {
        'SndMouseClick', 'Vatten', 'OneWave2', 'WaveS', 'WaveSm',
    }
    # Known dynamic audio patterns (string concatenation in Lingo)
    RE_DYNAMIC_SOUND = re.compile(
        r'(?:normalSoundBase|sndBase|soundBase)\s*&', re.IGNORECASE
    )
    # List/property access patterns (getAt, getProp, getSound on lists)
    RE_LIST_ACCESS_SOUND = re.compile(
        r'(?:getAt|getProp|getSound)\s*\(\s*(?:the\s+)?(?:sounds?|sailSoundIDs|'
        r'soundList|tmpSnds|currentMission)\b',
        re.IGNORECASE
    )

    for m in RE_PUPPET_SOUND.finditer(text):
        val = m.group(1).strip()
        if val == '0':
            continue
        if RE_AUDIO_ID.fullmatch(val):
            if val not in audio_cues_set:
                audio_cues_set.add(val)
                audio_cues_classified.append({"type": "literal", "id": val})
        elif val in LINGO_SOUND_VARS:
            pass  # skip variable refs — not real IDs
        else:
            if val not in audio_cues_set:
                audio_cues_set.add(val)
                audio_cues_classified.append({"type": "variable", "id": val})

    for m in RE_SOUND_PLAY_FILE.finditer(text):
        val = m.group(1).strip()
        if val not in audio_cues_set:
            audio_cues_set.add(val)
            if RE_AUDIO_ID.fullmatch(val):
                audio_cues_classified.append({"type": "literal", "id": val})
            else:
                audio_cues_classified.append({"type": "variable", "id": val})

    # Standalone audio ID pattern matches (only count as literal)
    for m in RE_AUDIO_ID.finditer(text):
        val = m.group(1)
        if val not in audio_cues_set:
            audio_cues_set.add(val)
            audio_cues_classified.append({"type": "literal", "id": val})

    for m in RE_PLAY_GSOUND.finditer(text):
        val = m.group(1).strip()
        if val in LINGO_SOUND_VARS:
            continue
        if val not in audio_cues_set:
            audio_cues_set.add(val)
            if RE_AUDIO_ID.fullmatch(val):
                audio_cues_classified.append({"type": "literal", "id": val})
            elif val in LINGO_CAST_MEMBERS:
                audio_cues_classified.append({"type": "cast_member", "id": val})
            else:
                audio_cues_classified.append({"type": "named", "id": val})

    for m in RE_PRELOAD_GSOUND.finditer(text):
        val = m.group(1).strip()
        if val in LINGO_SOUND_VARS:
            continue
        if val not in audio_cues_set:
            audio_cues_set.add(val)
            if RE_AUDIO_ID.fullmatch(val):
                audio_cues_classified.append({"type": "literal", "id": val})
            elif val in LINGO_CAST_MEMBERS:
                audio_cues_classified.append({"type": "cast_member", "id": val})
            else:
                audio_cues_classified.append({"type": "named", "id": val})

    # Detect dynamic sound construction
    if RE_DYNAMIC_SOUND.search(text):
        audio_cues_classified.append({"type": "dynamic", "id": "_dynamic_sound_construction_"})

    # Detect list access sound patterns
    for m in RE_LIST_ACCESS_SOUND.finditer(text):
        listname = m.group(0).strip()
        key = f"_list_access:{listname}"
        if key not in audio_cues_set:
            audio_cues_set.add(key)
            audio_cues_classified.append({"type": "list_access", "id": listname})

    has_sound_stop = bool(RE_SOUND_STOP.search(text))
    has_sound_fade_in = bool(RE_SOUND_FADE_IN.search(text))
    has_sound_fade_out = bool(RE_SOUND_FADE_OUT.search(text))

    # Legacy flat list for backward compat (only literal IDs)
    audio_cues = sorted(c["id"] for c in audio_cues_classified if c["type"] == "literal")

    # Sprite operations
    sprite_ops = []
    if RE_SPRITE_LOC.search(text):
        sprite_ops.append("set_loc")
    if RE_SPRITE_MEMBER.search(text):
        sprite_ops.append("set_member")
    if RE_SPRITE_VISIBLE.search(text):
        sprite_ops.append("set_visible")
    if RE_SPRITE_BLEND.search(text):
        sprite_ops.append("set_blend")
    if RE_SEND_SPRITE.search(text):
        sprite_ops.append("sendSprite")

    # Global function calls
    global_calls = []
    for name, pattern in GLOBAL_FUNCS.items():
        if pattern.search(text):
            global_calls.append(name)

    # Mission operations
    mission_ops = []
    for m in RE_ADD_COMPLETED.finditer(text):
        mission_ops.append({"op": "addCompletedMission", "id": int(m.group(1))})
    for m in RE_ADD_GIVEN.finditer(text):
        mission_ops.append({"op": "addGivenMission", "id": int(m.group(1))})
    for m in RE_IS_MISSION_COMPLETED.finditer(text):
        mission_ops.append({"op": "isMissionCompleted", "id": int(m.group(1))})
    for m in RE_IS_MISSION_GIVEN.finditer(text):
        mission_ops.append({"op": "isMissionGiven", "id": int(m.group(1))})

    # DXR references
    dxr_refs = sorted(set(m.group(1) for m in RE_DXR_REF.finditer(text)))

    # Folder from rel_path
    folder = rel_path.split('/')[0] if '/' in rel_path else ''

    # Classify transitions too
    transitions_classified = []
    for t in transitions:
        target = t.get("target", "")
        if target in ("frame", "frame+1", "frame+2", "frame+3"):
            t["classification"] = "frame_relative"
        elif target.startswith("marker+"):
            t["classification"] = "marker_relative"
        elif target == "#next":
            t["classification"] = "marker_relative"
        elif t.get("type") == "go_movie":
            t["classification"] = "movie_transition"
        elif t.get("type") == "go_var":
            t["classification"] = "variable"
        else:
            t["classification"] = "label"
        transitions_classified.append(t)

    contract = {
        "path": rel_path,
        "folder": folder,
        "handlers": handlers,
        "transitions": transitions_classified,
        "state_reads": state_reads,
        "state_writes": state_writes,
        "inventory_ops": inventory_ops,
        "audio_cues": audio_cues,
        "audio_cues_classified": audio_cues_classified,
        "sprite_ops": sprite_ops,
        "global_calls": global_calls,
        "mission_ops": mission_ops,
        "dxr_refs": dxr_refs,
        "raw_lines": raw_lines,
    }

    # Add sound control flags
    if has_sound_stop:
        contract["has_sound_stop"] = True
    if has_sound_fade_in:
        contract["has_sound_fade_in"] = True
    if has_sound_fade_out:
        contract["has_sound_fade_out"] = True

    return contract


def build_summary(contracts: dict) -> dict:
    """Build per-folder summary from contracts."""
    folders = defaultdict(lambda: {
        "total_scripts": 0,
        "total_handlers": 0,
        "total_lines": 0,
        "unique_transitions": set(),
        "unique_inventory_items": set(),
        "unique_audio_cues": set(),
        "unique_state_fields": set(),
        "unique_global_calls": set(),
        "unique_mission_ids": set(),
        "unique_dxr_refs": set(),
        "inventory_op_count": 0,
        "transition_count": 0,
        "state_ref_count": 0,
    })

    for key, c in contracts.items():
        folder = c.get("folder", "unknown")
        f = folders[folder]
        f["total_scripts"] += 1
        f["total_handlers"] += len(c.get("handlers", []))
        f["total_lines"] += c.get("raw_lines", 0)

        for t in c.get("transitions", []):
            f["unique_transitions"].add(t["target"])
            f["transition_count"] += 1

        for inv in c.get("inventory_ops", []):
            f["unique_inventory_items"].add(inv["item"])
            f["inventory_op_count"] += 1

        for a in c.get("audio_cues", []):
            f["unique_audio_cues"].add(a)

        for sr in c.get("state_reads", []):
            field = sr.replace("gMulleGlobals.", "")
            f["unique_state_fields"].add(field)
            f["state_ref_count"] += 1
        for sw in c.get("state_writes", []):
            field = sw.replace("gMulleGlobals.", "")
            f["unique_state_fields"].add(field)
            f["state_ref_count"] += 1

        for gc in c.get("global_calls", []):
            f["unique_global_calls"].add(gc)

        for mo in c.get("mission_ops", []):
            f["unique_mission_ids"].add(mo["id"])

        for dr in c.get("dxr_refs", []):
            f["unique_dxr_refs"].add(dr)

    # Convert sets to sorted lists for JSON
    result = {}
    for folder in sorted(folders.keys()):
        f = folders[folder]
        result[folder] = {
            "total_scripts": f["total_scripts"],
            "total_handlers": f["total_handlers"],
            "total_lines": f["total_lines"],
            "unique_transitions": sorted(f["unique_transitions"]),
            "unique_inventory_items": sorted(f["unique_inventory_items"]),
            "unique_audio_cues": sorted(f["unique_audio_cues"]),
            "unique_state_fields": sorted(f["unique_state_fields"]),
            "unique_global_calls": sorted(f["unique_global_calls"]),
            "unique_mission_ids": sorted(f["unique_mission_ids"]),
            "unique_dxr_refs": sorted(f["unique_dxr_refs"]),
            "inventory_op_count": f["inventory_op_count"],
            "transition_count": f["transition_count"],
            "state_ref_count": f["state_ref_count"],
        }
    return result


def main():
    if not LINGO_DIR.is_dir():
        print(f"ERROR: {LINGO_DIR} not found", file=sys.stderr)
        sys.exit(1)

    # Find all .ls files
    ls_files = sorted(LINGO_DIR.rglob("*.ls"))
    print(f"Found {len(ls_files)} .ls files in {LINGO_DIR}")

    contracts = {}
    for f in ls_files:
        rel = str(f.relative_to(LINGO_DIR))
        contracts[rel] = extract_contract(f, rel)

    # Write contracts
    with open(OUT_CONTRACTS, 'w') as fp:
        json.dump(contracts, fp, indent=2)
    print(f"Wrote {len(contracts)} contracts to {OUT_CONTRACTS}")

    # Build and write summary
    summary = build_summary(contracts)
    with open(OUT_SUMMARY, 'w') as fp:
        json.dump(summary, fp, indent=2)
    print(f"Wrote {len(summary)} folder summaries to {OUT_SUMMARY}")

    # Print stats
    total_handlers = sum(len(c["handlers"]) for c in contracts.values())
    total_transitions = sum(len(c["transitions"]) for c in contracts.values())
    total_state_refs = sum(len(c["state_reads"]) + len(c["state_writes"]) for c in contracts.values())
    total_inv_ops = sum(len(c["inventory_ops"]) for c in contracts.values())
    total_audio = sum(len(c["audio_cues"]) for c in contracts.values())
    total_sprite = sum(len(c["sprite_ops"]) for c in contracts.values())
    total_global = sum(len(c["global_calls"]) for c in contracts.values())
    total_mission = sum(len(c["mission_ops"]) for c in contracts.values())

    print(f"\n--- Extraction Stats ---")
    print(f"Scripts:           {len(contracts)}")
    print(f"Handlers:          {total_handlers}")
    print(f"Transitions:       {total_transitions}")
    print(f"State refs:        {total_state_refs}")
    print(f"Inventory ops:     {total_inv_ops}")
    print(f"Audio cues:        {total_audio}")
    print(f"Sprite ops:        {total_sprite}")
    print(f"Global calls:      {total_global}")
    print(f"Mission ops:       {total_mission}")

    # Unique items across all
    all_inv_items = set()
    all_state_fields = set()
    all_audio = set()
    for c in contracts.values():
        for inv in c["inventory_ops"]:
            all_inv_items.add(inv["item"])
        for sr in c["state_reads"]:
            all_state_fields.add(sr)
        for sw in c["state_writes"]:
            all_state_fields.add(sw)
        for a in c["audio_cues"]:
            all_audio.add(a)

    print(f"\nUnique inventory items: {sorted(all_inv_items)}")
    print(f"Unique state fields:   {sorted(all_state_fields)}")
    print(f"Unique audio cues:     {len(all_audio)}")


if __name__ == '__main__':
    main()
