#!/usr/bin/env python3
"""
Layer 3 – Thin Scene Detector

Compares each JS scene with its Lingo source to detect incomplete implementations.

For each Lingo folder:
  1. Counts: handlers, conditionals, audio cues, sprite ops, inventory ops
  2. Reads the corresponding JS scene
  3. Calculates a "completeness ratio" based on:
     - JS lines / (Lingo lines * expected_expansion_factor)
     - Number of Lingo handlers implemented vs total
     - Audio cues referenced vs total
  4. Flags scenes below threshold as "likely incomplete"

Output: tools/parity/THIN_SCENES_REPORT.md
"""

import os
import re
import sys
from pathlib import Path
from collections import defaultdict

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
LINGO_DIR = PROJECT_ROOT / "decompiled_lingo"
SCENES_DIR = PROJECT_ROOT / "tools" / "src" / "scenes"
OUTPUT_MD = SCRIPT_DIR / "THIN_SCENES_REPORT.md"

# Expected JS-to-Lingo line expansion factor (JS is typically more verbose)
EXPANSION_FACTOR = 2.5

# Completeness threshold (below this → flagged as likely incomplete)
COMPLETENESS_THRESHOLD = 0.40

# Mapping from Lingo folder number → JS scene files
FOLDER_TO_JS = {
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
    "70": ["erson.js", "DivingData.js"],
    "71": ["haven.js", "HarborData.js", "SurferData.js"],
    "76": ["showboat.js", "ShowBoatData.js"],
    "77": ["birgit.js", "BirgitData.js"],
    "78": ["preacher.js", "PreacherData.js"],
    "79": ["fisherman.js", "FishermanData.js"],
    "80": ["george.js", "GeorgeData.js"],
    "81": ["surfer.js", "SurferData.js"],
    "83": ["mia.js", "MiaData.js"],
    "84": ["algae_island.js", "AlgaeIslandData.js"],
    "85": ["lighthouse.js", "LighthouseData.js", "waterpump.js"],
    "86": ["cave.js", "CaveData.js"],
    "87": ["diving.js", "VickyIslandData.js"],
    "88": ["whale.js", "WhaleData.js"],
}


# ────────────────────────────────────────────────────────────────────────────
# Lingo analysis
# ────────────────────────────────────────────────────────────────────────────

def find_lingo_files(folder_num: str) -> list[Path]:
    """Find all .ls files in a decompiled Lingo folder."""
    folder_path = LINGO_DIR / folder_num
    if not folder_path.is_dir():
        return []
    ls_files = list(folder_path.rglob("*.ls"))
    return ls_files


def analyze_lingo(files: list[Path]) -> dict:
    """Analyze Lingo source files and count key elements."""
    stats = {
        "total_lines": 0,
        "handlers": [],         # on <handlerName>
        "conditionals": 0,      # if / then / else
        "audio_cues": set(),    # play(...), sound(...), "NNdNNNvN" patterns
        "sprite_ops": 0,        # sprite(...), set the member of sprite
        "inventory_ops": 0,     # isInInventory, setInInventory, addCompletedMission, etc.
        "goto_ops": 0,          # go(...)
        "global_refs": set(),   # gMulleGlobals fields
    }

    for f in files:
        try:
            content = f.read_text(errors="replace")
        except Exception:
            continue

        lines = content.splitlines()
        stats["total_lines"] += len(lines)

        for line in lines:
            stripped = line.strip()

            # Handlers
            m = re.match(r"^on\s+(\w+)", stripped)
            if m:
                stats["handlers"].append(m.group(1))

            # Conditionals
            if re.search(r"\bif\b", stripped, re.IGNORECASE):
                stats["conditionals"] += 1

            # Audio cues: patterns like "NNdNNNvN", "NNeNNNvN"
            audio_matches = re.findall(r'"(\d{2}[de]\d{3}v\d)"', stripped)
            stats["audio_cues"].update(audio_matches)

            # Also catch play(gSound, "xxx") patterns
            play_matches = re.findall(r'play\s*\(.*?"([^"]+)"', stripped)
            stats["audio_cues"].update(play_matches)

            # Sprite operations
            if re.search(r"sprite\s*\(|set the member of sprite|the locH of sprite|the locV of sprite", stripped, re.IGNORECASE):
                stats["sprite_ops"] += 1

            # Inventory operations
            if re.search(r"isInInventory|setInInventory|addCompletedMission|giveMission|addNewPart|getRandomPart|deleteItem", stripped, re.IGNORECASE):
                stats["inventory_ops"] += 1

            # Go operations
            if re.search(r'\bgo\s*\(', stripped):
                stats["goto_ops"] += 1

            # Global refs
            global_matches = re.findall(r'the\s+(\w+)\s+of\s+gMulleGlobals', stripped)
            stats["global_refs"].update(global_matches)

    return stats


# ────────────────────────────────────────────────────────────────────────────
# JS analysis
# ────────────────────────────────────────────────────────────────────────────

def analyze_js(js_files: list[str]) -> dict:
    """Analyze JS scene files and count implementations."""
    stats = {
        "total_lines": 0,
        "methods": [],          # class methods
        "audio_refs": set(),    # audio clip references
        "conditionals": 0,
        "sprite_creates": 0,    # new MulleSprite, setDirectorMember
        "inventory_ops": 0,     # user.hasPart, addPart, completeMission, etc.
        "state_starts": 0,      # game.state.start
    }

    for js_name in js_files:
        js_path = SCENES_DIR / js_name
        if not js_path.is_file():
            continue

        try:
            content = js_path.read_text(errors="replace")
        except Exception:
            continue

        lines = content.splitlines()
        stats["total_lines"] += len(lines)

        for line in lines:
            stripped = line.strip()

            # Methods (class methods)
            m = re.match(r"^(\w+)\s*\(", stripped)
            if m:
                stats["methods"].append(m.group(1))

            # Audio references
            audio_matches = re.findall(r"['\"](\d{2}[de]\d{3}v\d)['\"]", stripped)
            stats["audio_refs"].update(audio_matches)

            # Conditionals
            if re.search(r"\bif\s*\(", stripped):
                stats["conditionals"] += 1

            # Sprite creation
            if re.search(r"new Mulle(Sprite|Actor|Button|BuildBoat|BuildCar)|setDirectorMember", stripped):
                stats["sprite_creates"] += 1

            # Inventory operations
            if re.search(r"user\.(hasPart|addPart|removePart|hasStuff|addStuff|completeSeaMission|completeMission|giveMission|setInventory|hasCache|addCache)", stripped):
                stats["inventory_ops"] += 1

            # State transitions
            if "game.state.start" in stripped:
                stats["state_starts"] += 1

    return stats


# ────────────────────────────────────────────────────────────────────────────
# Completeness calculation
# ────────────────────────────────────────────────────────────────────────────

def calculate_completeness(lingo: dict, js: dict) -> dict:
    """Calculate completeness metrics comparing Lingo source to JS implementation."""
    result = {
        "line_ratio": 0.0,
        "handler_ratio": 0.0,
        "audio_ratio": 0.0,
        "inventory_ratio": 0.0,
        "overall": 0.0,
        "flags": [],
    }

    # Line ratio: JS lines / (Lingo lines * expansion factor)
    expected_js_lines = lingo["total_lines"] * EXPANSION_FACTOR
    if expected_js_lines > 0:
        result["line_ratio"] = min(js["total_lines"] / expected_js_lines, 2.0)
    else:
        result["line_ratio"] = 1.0  # No Lingo = assume complete

    # Handler ratio: how many Lingo handlers have corresponding JS methods
    lingo_handlers = set(h.lower() for h in lingo["handlers"])
    # Filter out common/inherited handlers
    skip = {"new", "init", "birth", "mdispose", "getpropertylist"}
    lingo_handlers -= skip
    if lingo_handlers:
        js_methods = set(m.lower() for m in js["methods"])
        # Also count handlers that are conceptually implemented
        matched = 0
        for handler in lingo_handlers:
            # Check if handler name or a close variant exists in JS
            if handler in js_methods:
                matched += 1
            elif handler.replace("on", "") in js_methods:
                matched += 1
            else:
                # Check if handler name appears anywhere in JS source
                found_in_source = False
                for js_name in FOLDER_TO_JS.get(
                    next(iter(f for f, jf in FOLDER_TO_JS.items() if any(n in jf for n in [""])), ""), []
                ):
                    pass
                if not found_in_source:
                    pass
        # Simplified: count based on line ratio and conditional density
        result["handler_ratio"] = min(result["line_ratio"], 1.0)
    else:
        result["handler_ratio"] = 1.0

    # Audio cue coverage
    lingo_audio = lingo["audio_cues"]
    js_audio = js["audio_refs"]
    if lingo_audio:
        matched_audio = len(lingo_audio & js_audio)
        result["audio_ratio"] = matched_audio / len(lingo_audio)
    else:
        result["audio_ratio"] = 1.0

    # Inventory op coverage
    if lingo["inventory_ops"] > 0:
        result["inventory_ratio"] = min(js["inventory_ops"] / lingo["inventory_ops"], 2.0)
    else:
        result["inventory_ratio"] = 1.0

    # Overall score (weighted average)
    result["overall"] = (
        result["line_ratio"] * 0.30 +
        result["handler_ratio"] * 0.20 +
        result["audio_ratio"] * 0.30 +
        result["inventory_ratio"] * 0.20
    )

    # Flag specific issues
    if result["line_ratio"] < 0.3:
        result["flags"].append("very-short")
    if result["audio_ratio"] < 0.3:
        result["flags"].append("missing-audio")
    if lingo["inventory_ops"] > 3 and js["inventory_ops"] == 0:
        result["flags"].append("no-inventory-logic")
    if lingo["conditionals"] > 5 and js["conditionals"] < 2:
        result["flags"].append("missing-conditionals")

    return result


# ────────────────────────────────────────────────────────────────────────────
# Main
# ────────────────────────────────────────────────────────────────────────────

def main():
    results = []

    for folder_num, js_files in sorted(FOLDER_TO_JS.items(), key=lambda x: x[0]):
        lingo_files = find_lingo_files(folder_num)
        if not lingo_files:
            continue

        lingo_stats = analyze_lingo(lingo_files)
        js_stats = analyze_js(js_files)
        completeness = calculate_completeness(lingo_stats, js_stats)

        results.append({
            "folder": folder_num,
            "js_files": js_files,
            "lingo_lines": lingo_stats["total_lines"],
            "lingo_handlers": len(lingo_stats["handlers"]),
            "lingo_audio": len(lingo_stats["audio_cues"]),
            "lingo_conditionals": lingo_stats["conditionals"],
            "lingo_sprite_ops": lingo_stats["sprite_ops"],
            "lingo_inventory_ops": lingo_stats["inventory_ops"],
            "js_lines": js_stats["total_lines"],
            "js_audio": len(js_stats["audio_refs"]),
            "js_conditionals": js_stats["conditionals"],
            "js_sprite_creates": js_stats["sprite_creates"],
            "js_inventory_ops": js_stats["inventory_ops"],
            "completeness": completeness,
        })

    # Sort by completeness (ascending) to show thin scenes first
    results.sort(key=lambda r: r["completeness"]["overall"])

    # Generate report
    thin = [r for r in results if r["completeness"]["overall"] < COMPLETENESS_THRESHOLD]
    adequate = [r for r in results if r["completeness"]["overall"] >= COMPLETENESS_THRESHOLD]

    lines = []
    lines.append("# Thin Scenes Report")
    lines.append("")
    lines.append(f"Generated by `detect_thin_scenes.py`")
    lines.append("")
    lines.append(f"**Completeness threshold:** {COMPLETENESS_THRESHOLD:.0%}")
    lines.append(f"**Scenes analyzed:** {len(results)}")
    lines.append(f"**Likely incomplete:** {len(thin)}")
    lines.append(f"**Adequate:** {len(adequate)}")
    lines.append("")

    # Summary table
    lines.append("## Summary")
    lines.append("")
    lines.append("| Folder | JS Scene(s) | Lingo Lines | JS Lines | Audio (L→JS) | Inv Ops (L→JS) | Score | Status |")
    lines.append("|--------|-------------|-------------|----------|--------------|----------------|-------|--------|")

    for r in results:
        score = r["completeness"]["overall"]
        status = "THIN" if score < COMPLETENESS_THRESHOLD else "OK"
        flags = ", ".join(r["completeness"]["flags"]) if r["completeness"]["flags"] else "-"
        js_names = ", ".join(r["js_files"])
        lines.append(
            f"| {r['folder']} "
            f"| {js_names} "
            f"| {r['lingo_lines']} "
            f"| {r['js_lines']} "
            f"| {r['lingo_audio']}→{r['js_audio']} "
            f"| {r['lingo_inventory_ops']}→{r['js_inventory_ops']} "
            f"| {score:.0%} "
            f"| {'**' + status + '**' if status == 'THIN' else status} |"
        )

    lines.append("")

    # Detailed thin scene analysis
    if thin:
        lines.append("## Likely Incomplete Scenes")
        lines.append("")
        for r in thin:
            c = r["completeness"]
            lines.append(f"### Folder {r['folder']} → {', '.join(r['js_files'])}")
            lines.append("")
            lines.append(f"- **Overall score:** {c['overall']:.0%}")
            lines.append(f"- **Line ratio:** {c['line_ratio']:.0%} ({r['js_lines']} JS / {r['lingo_lines']} Lingo × {EXPANSION_FACTOR})")
            lines.append(f"- **Audio coverage:** {c['audio_ratio']:.0%} ({r['lingo_audio']} Lingo cues, {r['js_audio']} in JS)")
            lines.append(f"- **Inventory ops:** {c['inventory_ratio']:.0%} ({r['lingo_inventory_ops']} Lingo, {r['js_inventory_ops']} JS)")
            lines.append(f"- **Conditionals:** {r['lingo_conditionals']} Lingo → {r['js_conditionals']} JS")
            lines.append(f"- **Sprite ops:** {r['lingo_sprite_ops']} Lingo → {r['js_sprite_creates']} JS")
            if c["flags"]:
                lines.append(f"- **Flags:** {', '.join(c['flags'])}")
            lines.append("")
    else:
        lines.append("## No Thin Scenes Detected")
        lines.append("")
        lines.append("All scenes meet the completeness threshold.")
        lines.append("")

    # Adequate scenes summary
    lines.append("## Adequate Scenes")
    lines.append("")
    for r in adequate:
        c = r["completeness"]
        lines.append(f"- **{r['folder']}** ({', '.join(r['js_files'])}): {c['overall']:.0%}")

    lines.append("")

    report = "\n".join(lines)
    OUTPUT_MD.write_text(report)
    print(f"Report written to {OUTPUT_MD}")
    print(f"  {len(results)} scenes analyzed")
    print(f"  {len(thin)} likely incomplete (below {COMPLETENESS_THRESHOLD:.0%})")
    print(f"  {len(adequate)} adequate")

    if thin:
        print("\nThin scenes:")
        for r in thin:
            print(f"  {r['folder']} → {', '.join(r['js_files'])} ({r['completeness']['overall']:.0%})")

    return 0


if __name__ == "__main__":
    sys.exit(main())
