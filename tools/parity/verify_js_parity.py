#!/usr/bin/env python3
"""Verify JS scene parity against Lingo behavioral contracts.

Reads lingo_contracts.json and checks JS scene files for coverage of:
- Inventory items
- Audio cues
- State fields (gMulleGlobals properties)
- Frame labels/transitions
- Global function calls
- Mission operations

Output: parity_report.json and PARITY_REPORT.md
"""

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
CONTRACTS_FILE = SCRIPT_DIR / "lingo_contracts.json"
SCENES_DIR = PROJECT_ROOT / "tools" / "src" / "scenes"
OUT_REPORT_JSON = SCRIPT_DIR / "parity_report.json"
OUT_REPORT_MD = SCRIPT_DIR / "PARITY_REPORT.md"

# Mapping from Lingo folder to JS scene files
FOLDER_TO_JS = {
    "boat_02": ["boat_junk.js", "junk.js"],
    "boat_04": ["boatyard.js", "yard.js", "YardData.js", "QuayData.js", "ShipYardData.js"],
    "boat_05": ["seaworld.js", "world.js", "SeaWorldData.js"],
    "boat_06": ["album.js"],
    "boat_08": ["diploma.js", "help.js"],
    "boat_11": ["menu.js"],
    "boat_14": ["boat_filebrowser.js", "filebrowser.js"],
    "boat_15": ["blueprint.js", "BlueprintData.js"],
    "boat_70": ["erson.js"],
    "boat_71": ["haven.js", "HarborData.js"],
    "boat_76": ["showboat.js", "ShowBoatData.js"],
    "boat_77": ["birgit.js", "BirgitData.js"],
    "boat_78": ["preacher.js", "PreacherData.js"],
    "boat_79": ["fisherman.js", "FishermanData.js"],
    "boat_81": ["surfer.js", "SurferData.js"],
    "boat_83": ["mia.js", "MiaData.js", "treecar.js"],
    "boat_84": ["algae_island.js", "AlgaeIslandData.js"],
    "boat_85": ["roaddog.js", "saftfabrik.js", "waterpump.js"],
    "boat_86": ["cave.js", "CaveData.js", "solhem.js"],
    "boat_87": ["diving.js", "DivingData.js", "saftfabrik.js"],
    "boat_88": ["sturestortand.js", "whale.js", "WhaleData.js"],
    # ── Auto-game scenes (non-prefixed Lingo folders) ──
    # shared_00/00: shared globals — search ALL scene files
    "shared_00": [
        "album.js", "carshow.js", "credits.js", "diploma.js", "dlcshop.js",
        "dorisdigital.js", "figgeferrum.js", "filebrowser.js", "garage.js",
        "junk.js", "luddelabb.js", "menu.js", "mudcar.js", "ocean.js",
        "roaddog.js", "roadthing.js", "saftfabrik.js", "solhem.js",
        "sturestortand.js", "treecar.js", "viola.js", "world.js",
        "worldselect.js", "yard.js",
        # Also boat scenes that share the same base
        "boatyard.js", "boat_junk.js", "boat_yard.js", "seaworld.js",
    ],
    "00": [
        "album.js", "carshow.js", "credits.js", "diploma.js", "dlcshop.js",
        "dorisdigital.js", "figgeferrum.js", "filebrowser.js", "garage.js",
        "junk.js", "luddelabb.js", "menu.js", "mudcar.js", "ocean.js",
        "roaddog.js", "roadthing.js", "saftfabrik.js", "solhem.js",
        "sturestortand.js", "treecar.js", "viola.js", "world.js",
        "worldselect.js", "yard.js",
        "boatyard.js", "boat_junk.js", "boat_yard.js", "seaworld.js",
    ],
    "01": ["zee_intro.js"],
    "02": ["junk.js", "boat_junk.js"],
    "03": ["garage.js", "boat_yard.js"],
    "04": ["yard.js", "boatyard.js", "QuayData.js"],
    "05": ["world.js", "seaworld.js", "SeaWorldData.js"],
    "06": ["album.js"],
    "08": ["diploma.js", "help.js"],
    "10": ["menu.js"],
    "11": ["menu.js"],
    "12": ["credits.js"],
    "13": ["dlcshop.js"],
    "14": ["filebrowser.js", "boat_filebrowser.js"],
    "15": ["blueprint.js", "BlueprintData.js"],
    "70": ["erson.js"],
    "71": ["haven.js", "HarborData.js"],
    "76": ["showboat.js", "ShowBoatData.js"],
    "77": ["birgit.js", "BirgitData.js"],
    "78": ["preacher.js", "PreacherData.js"],
    "79": ["fisherman.js", "FishermanData.js"],
    "80": ["george.js", "GeorgeData.js"],
    "81": ["surfer.js", "SurferData.js"],
    "83": ["mia.js", "MiaData.js"],
    "84": ["algae_island.js", "AlgaeIslandData.js"],
    "85": ["roaddog.js", "saftfabrik.js", "waterpump.js"],
    "86": ["cave.js", "CaveData.js", "solhem.js"],
    "87": ["diving.js", "DivingData.js"],
    "88": ["whale.js", "WhaleData.js"],
    "CDdata": [],
    "Sail": ["seaworld.js"],
    "showboat": ["showboat.js", "ShowBoatData.js"],
}

# Folders that are infrastructure/shared and shouldn't be directly verified
SKIP_FOLDERS = {
    "CDdata", "LBstart", "StartCD", "tempPlug",
    "BLS", "BLW", "BMS", "BMW", "BSS", "BSW",
}


def read_js_files(folder: str) -> str:
    """Read and concatenate all JS files mapped to a Lingo folder."""
    js_names = FOLDER_TO_JS.get(folder, [])
    content = ""
    found_files = []
    for name in js_names:
        path = SCENES_DIR / name
        if path.is_file():
            try:
                content += path.read_text(encoding='utf-8', errors='replace') + "\n"
                found_files.append(name)
            except Exception:
                pass
        # Also check __tests__
        test_path = SCENES_DIR / "__tests__" / name.replace(".js", ".test.js")
        if test_path.is_file():
            try:
                content += test_path.read_text(encoding='utf-8', errors='replace') + "\n"
            except Exception:
                pass
    return content, found_files


def check_inventory(contracts: list, js_text: str) -> dict:
    """Check inventory item coverage."""
    items = set()
    for c in contracts:
        for inv in c.get("inventory_ops", []):
            items.add(inv["item"])

    found = set()
    missing = set()
    for item in items:
        # Search case-insensitive, allow #Item or 'Item' or "Item"
        pattern = re.compile(re.escape(item), re.IGNORECASE)
        if pattern.search(js_text):
            found.add(item)
        else:
            missing.add(item)

    return {
        "total": len(items),
        "found": sorted(found),
        "missing": sorted(missing),
        "coverage": len(found) / len(items) * 100 if items else 100,
    }


def check_audio(contracts: list, js_text: str) -> dict:
    """Check audio cue coverage using classified audio data.
    
    Only counts LITERAL audio IDs (e.g., '05d051v0') as real contracts.
    Skips: variables (tmpSnd), dynamic construction, list access patterns.
    Also skips named sounds that are Lingo member names (Vatten, WaveS, etc.)
    unless they match the numeric audio ID pattern.
    """
    # Audio ID pattern: ##d###v# or ##e###v#
    RE_AUDIO_ID = re.compile(r'^\d{2}[de]\d{3}v\d$')
    
    cues = set()
    skipped_types = {"variable", "dynamic", "list_access"}
    
    for c in contracts:
        # Prefer classified data if available
        classified = c.get("audio_cues_classified", [])
        if classified:
            for entry in classified:
                if entry["type"] in skipped_types:
                    continue
                aid = entry["id"]
                # For non-literal types, only include if it looks like an audio ID
                if entry["type"] in ("named", "cast_member"):
                    if not RE_AUDIO_ID.match(aid):
                        continue  # skip Lingo member names like SndMouseClick
                cues.add(aid)
        else:
            # Fallback to flat list (legacy contracts)
            for a in c.get("audio_cues", []):
                cues.add(a)

    found = set()
    missing = set()
    for cue in cues:
        if cue in js_text:
            found.add(cue)
        else:
            missing.add(cue)

    return {
        "total": len(cues),
        "found": sorted(found),
        "missing": sorted(missing),
        "coverage": len(found) / len(cues) * 100 if cues else 100,
    }


def _normalize_field(field: str) -> str:
    """Normalize a Lingo field name for JS matching.
    
    Lingo uses PascalCase (WhereFrom), JS uses camelCase (whereFrom).
    Generate both variants for matching.
    """
    return field[0].lower() + field[1:] if field else field


def check_state(contracts: list, js_text: str) -> dict:
    """Check gMulleGlobals state field coverage.
    
    Normalizes Lingo PascalCase to JS camelCase for matching.
    Searches for the field name in any casing variant.
    """
    fields = set()
    for c in contracts:
        for sr in c.get("state_reads", []):
            fields.add(sr.replace("gMulleGlobals.", ""))
        for sw in c.get("state_writes", []):
            fields.add(sw.replace("gMulleGlobals.", ""))

    js_text_lower = js_text.lower()

    found = set()
    missing = set()
    for field in fields:
        # Try exact match, camelCase variant, and case-insensitive
        camel = _normalize_field(field)
        if (field in js_text
                or camel in js_text
                or field.lower() in js_text_lower):
            found.add(field)
        else:
            missing.add(field)

    return {
        "total": len(fields),
        "found": sorted(found),
        "missing": sorted(missing),
        "coverage": len(found) / len(fields) * 100 if fields else 100,
    }


def check_transitions(contracts: list, js_text: str) -> dict:
    """Check frame transition label coverage.
    
    Uses the classification field from the extractor:
    - 'label': real scene transition (e.g., go("trip")) — must match
    - 'movie_transition': go movie "X" — must match
    - 'frame_relative': go(the frame + N) — Lingo playback control, skip
    - 'marker_relative': go(marker + 1), go(#next) — Lingo playback control, skip
    - 'variable': go(myMarker) — skip (runtime determined)
    """
    SKIP_CLASSIFICATIONS = {"frame_relative", "marker_relative", "variable"}

    labels = set()
    for c in contracts:
        for t in c.get("transitions", []):
            classification = t.get("classification", "")
            if classification in SKIP_CLASSIFICATIONS:
                continue
            target = t.get("target", "")
            if not target:
                continue
            # Legacy fallback for unclassified transitions
            if not classification:
                if target in ("frame", "#next") or target.startswith("frame+") or target.startswith("marker+"):
                    continue
            labels.add(target)

    found = set()
    missing = set()
    for label in labels:
        pattern = re.compile(re.escape(label), re.IGNORECASE)
        if pattern.search(js_text):
            found.add(label)
        else:
            missing.add(label)

    return {
        "total": len(labels),
        "found": sorted(found),
        "missing": sorted(missing),
        "coverage": len(found) / len(labels) * 100 if labels else 100,
    }


def check_missions(contracts: list, js_text: str) -> dict:
    """Check mission ID coverage."""
    mission_ids = set()
    for c in contracts:
        for mo in c.get("mission_ops", []):
            mission_ids.add(mo["id"])

    found = set()
    missing = set()
    for mid in mission_ids:
        # Look for mission ID as a number in relevant context
        pattern = re.compile(rf'\b{mid}\b')
        if pattern.search(js_text):
            found.add(mid)
        else:
            missing.add(mid)

    return {
        "total": len(mission_ids),
        "found": sorted(found),
        "missing": sorted(missing),
        "coverage": len(found) / len(mission_ids) * 100 if mission_ids else 100,
    }


def check_global_calls(contracts: list, js_text: str) -> dict:
    """Check global function call coverage."""
    calls = set()
    for c in contracts:
        for gc in c.get("global_calls", []):
            calls.add(gc)

    found = set()
    missing = set()
    for call in calls:
        pattern = re.compile(re.escape(call), re.IGNORECASE)
        if pattern.search(js_text):
            found.add(call)
        else:
            missing.add(call)

    return {
        "total": len(calls),
        "found": sorted(found),
        "missing": sorted(missing),
        "coverage": len(found) / len(calls) * 100 if calls else 100,
    }


def find_source_for_item(contracts: list, item: str, category: str) -> list:
    """Find which Lingo source files contain a given item."""
    sources = []
    for c in contracts:
        path = c.get("path", "")
        if category == "inventory":
            for inv in c.get("inventory_ops", []):
                if inv["item"] == item:
                    sources.append(path)
                    break
        elif category == "audio":
            if item in c.get("audio_cues", []):
                sources.append(path)
        elif category == "state":
            full = f"gMulleGlobals.{item}"
            if full in c.get("state_reads", []) or full in c.get("state_writes", []):
                sources.append(path)
        elif category == "transition":
            for t in c.get("transitions", []):
                if t.get("target") == item:
                    sources.append(path)
                    break
        elif category == "global_call":
            if item in c.get("global_calls", []):
                sources.append(path)
        elif category == "mission":
            for mo in c.get("mission_ops", []):
                if mo["id"] == item:
                    sources.append(path)
                    break
    return sources


def main():
    if not CONTRACTS_FILE.is_file():
        print(f"ERROR: {CONTRACTS_FILE} not found. Run extract_lingo_contracts.py first.", file=sys.stderr)
        sys.exit(1)

    with open(CONTRACTS_FILE) as f:
        all_contracts = json.load(f)

    # Group contracts by folder
    by_folder = defaultdict(list)
    for key, c in all_contracts.items():
        by_folder[c.get("folder", "unknown")].append(c)

    report = {}
    total_checks = 0
    total_found = 0

    for folder in sorted(by_folder.keys()):
        if folder in SKIP_FOLDERS:
            continue

        contracts = by_folder[folder]
        js_text, js_files = read_js_files(folder)

        if not js_files:
            report[folder] = {
                "status": "NO_JS_FILES",
                "js_files": [],
                "lingo_scripts": len(contracts),
                "coverage": 0,
            }
            continue

        inv_check = check_inventory(contracts, js_text)
        audio_check = check_audio(contracts, js_text)
        state_check = check_state(contracts, js_text)
        trans_check = check_transitions(contracts, js_text)
        mission_check = check_missions(contracts, js_text)
        global_check = check_global_calls(contracts, js_text)

        # Calculate overall coverage
        checks = [inv_check, audio_check, state_check, trans_check, mission_check, global_check]
        total_items = sum(c["total"] for c in checks)
        found_items = sum(len(c["found"]) for c in checks)
        overall = found_items / total_items * 100 if total_items else 100

        total_checks += total_items
        total_found += found_items

        # Find sources for missing items
        missing_details = []
        for item in inv_check["missing"]:
            srcs = find_source_for_item(contracts, item, "inventory")
            missing_details.append({"category": "inventory", "item": item, "sources": srcs})
        for item in audio_check["missing"]:
            srcs = find_source_for_item(contracts, item, "audio")
            missing_details.append({"category": "audio", "item": item, "sources": srcs})
        for item in state_check["missing"]:
            srcs = find_source_for_item(contracts, item, "state")
            missing_details.append({"category": "state", "item": item, "sources": srcs})
        for item in trans_check["missing"]:
            srcs = find_source_for_item(contracts, item, "transition")
            missing_details.append({"category": "transition", "item": item, "sources": srcs})
        for item in global_check["missing"]:
            srcs = find_source_for_item(contracts, item, "global_call")
            missing_details.append({"category": "global_call", "item": item, "sources": srcs})
        for item in mission_check["missing"]:
            srcs = find_source_for_item(contracts, item, "mission")
            missing_details.append({"category": "mission", "item": str(item), "sources": srcs})

        report[folder] = {
            "status": "VERIFIED",
            "js_files": js_files,
            "lingo_scripts": len(contracts),
            "overall_coverage": round(overall, 1),
            "inventory": inv_check,
            "audio": audio_check,
            "state": state_check,
            "transitions": trans_check,
            "missions": mission_check,
            "global_calls": global_check,
            "missing_details": missing_details,
        }

    # Overall score
    overall_score = total_found / total_checks * 100 if total_checks else 0

    result = {
        "overall_score": round(overall_score, 1),
        "total_checks": total_checks,
        "total_found": total_found,
        "total_missing": total_checks - total_found,
        "folders_verified": sum(1 for r in report.values() if r["status"] == "VERIFIED"),
        "folders_no_js": sum(1 for r in report.values() if r["status"] == "NO_JS_FILES"),
        "folders_skipped": len(SKIP_FOLDERS),
        "folders": report,
    }

    # Write JSON
    with open(OUT_REPORT_JSON, 'w') as f:
        json.dump(result, f, indent=2)
    print(f"Wrote parity report to {OUT_REPORT_JSON}")

    # Write Markdown
    write_markdown(result)
    print(f"Wrote markdown report to {OUT_REPORT_MD}")
    print(f"\nOverall parity score: {overall_score:.1f}% ({total_found}/{total_checks})")


def write_markdown(result: dict):
    """Write human-readable markdown report."""
    lines = []
    lines.append("# Lingo → JS Parity Report")
    lines.append("")
    lines.append(f"**Overall Parity Score: {result['overall_score']}%** ({result['total_found']}/{result['total_checks']} contracts matched)")
    lines.append("")
    lines.append(f"- Folders verified: {result['folders_verified']}")
    lines.append(f"- Folders without JS files: {result['folders_no_js']}")
    lines.append(f"- Folders skipped (infrastructure): {result['folders_skipped']}")
    lines.append("")

    # Coverage table
    lines.append("## Per-Folder Coverage")
    lines.append("")
    lines.append("| Folder | JS Files | Coverage | Inv | Audio | State | Trans | Mission | Globals |")
    lines.append("|--------|----------|----------|-----|-------|-------|-------|---------|---------|")

    folders = result["folders"]
    for folder in sorted(folders.keys()):
        f = folders[folder]
        if f["status"] == "NO_JS_FILES":
            lines.append(f"| {folder} | _none_ | 0% | - | - | - | - | - | - |")
        else:
            js = ", ".join(f["js_files"])
            cov = f"{f['overall_coverage']}%"
            inv = f"{f['inventory']['coverage']:.0f}%" if f['inventory']['total'] else "-"
            aud = f"{f['audio']['coverage']:.0f}%" if f['audio']['total'] else "-"
            sta = f"{f['state']['coverage']:.0f}%" if f['state']['total'] else "-"
            tra = f"{f['transitions']['coverage']:.0f}%" if f['transitions']['total'] else "-"
            mis = f"{f['missions']['coverage']:.0f}%" if f['missions']['total'] else "-"
            glo = f"{f['global_calls']['coverage']:.0f}%" if f['global_calls']['total'] else "-"
            lines.append(f"| {folder} | {js} | {cov} | {inv} | {aud} | {sta} | {tra} | {mis} | {glo} |")

    lines.append("")

    # Missing items detail
    lines.append("## Missing Contracts (in Lingo but NOT in JS)")
    lines.append("")

    for folder in sorted(folders.keys()):
        f = folders[folder]
        if f["status"] != "VERIFIED":
            continue
        missing = f.get("missing_details", [])
        if not missing:
            continue

        lines.append(f"### {folder}")
        lines.append(f"JS files: {', '.join(f['js_files'])}")
        lines.append("")

        by_cat = defaultdict(list)
        for m in missing:
            by_cat[m["category"]].append(m)

        for cat in ["inventory", "audio", "state", "transition", "global_call", "mission"]:
            items = by_cat.get(cat, [])
            if not items:
                continue
            lines.append(f"**{cat.replace('_', ' ').title()}** ({len(items)} missing):")
            for item in items:
                srcs = item.get("sources", [])
                src_str = ", ".join(srcs[:3])
                if len(srcs) > 3:
                    src_str += f" (+{len(srcs)-3} more)"
                lines.append(f"- `{item['item']}` — Lingo source: {src_str}")
            lines.append("")

    # Summary of all unique missing items
    lines.append("## Summary of All Missing Items")
    lines.append("")

    all_missing = defaultdict(set)
    for folder, f in folders.items():
        if f["status"] != "VERIFIED":
            continue
        for m in f.get("missing_details", []):
            all_missing[m["category"]].add(m["item"])

    for cat in ["inventory", "audio", "state", "transition", "global_call", "mission"]:
        items = all_missing.get(cat, set())
        if items:
            lines.append(f"### {cat.replace('_', ' ').title()} ({len(items)} unique)")
            for item in sorted(items):
                lines.append(f"- `{item}`")
            lines.append("")

    lines.append("---")
    lines.append("*Generated by verify_js_parity.py*")

    with open(OUT_REPORT_MD, 'w') as f:
        f.write("\n".join(lines) + "\n")


if __name__ == '__main__':
    main()
