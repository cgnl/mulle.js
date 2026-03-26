#!/usr/bin/env python3
"""
Derive background members from drxtract score.json by looking for large sprites.
"""
import json
import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
MAP_PATH = ROOT / 'tools' / 'data' / 'director_member_map.json'

MIN_W = 640
MIN_H = 480

if not MAP_PATH.exists():
    raise SystemExit(f"Missing director_member_map.json at {MAP_PATH}")

with open(MAP_PATH, 'r', encoding='utf-8') as f:
    DIRECTOR_MAP = json.load(f)


def infer_dir_file_from_score_path(score_path: Path):
    name = score_path.parent.name  # e.g., '04.DXR' or 'boten_77.dxr'
    if name.lower().endswith('.dxr'):
        base = name[:-4]
    else:
        base = name
    if base.startswith('boten_'):
        return f"{base}.DXR"
    # keep numeric names like '04'
    return f"{base}.DXR"


def collect_backgrounds(score_path: Path):
    data = json.loads(score_path.read_text(encoding='utf-8'))
    # drxtract writes score.json as list of frames; each frame has key 'score'
    # Each track entry may contain width/height/x/y/castId
    counts = {}
    for frame in data:
        tracks = frame.get('score') or []
        for track in tracks:
            if not isinstance(track, dict):
                continue
            w = track.get('width')
            h = track.get('height')
            cast_id = track.get('castId')
            if w is None or h is None or cast_id is None:
                continue
            if w >= MIN_W and h >= MIN_H:
                counts[cast_id] = counts.get(cast_id, 0) + 1
    return counts


def map_cast_to_name(dir_file: str, cast_id: int):
    dir_map = DIRECTOR_MAP.get(dir_file) or {}
    return dir_map.get(str(cast_id))


def main():
    if len(sys.argv) < 2:
        print("USAGE: background_from_score.py <score.json> [<score.json> ...]")
        sys.exit(1)

    results = {}
    for score_arg in sys.argv[1:]:
        score_path = Path(score_arg)
        if not score_path.exists():
            print(f"Skip missing {score_path}")
            continue
        dir_file = infer_dir_file_from_score_path(score_path)
        counts = collect_backgrounds(score_path)
        mapped = []
        for cast_id, count in sorted(counts.items(), key=lambda x: (-x[1], x[0])):
            mapped.append({
                'castId': cast_id,
                'dirName': map_cast_to_name(dir_file, cast_id),
                'frames': count
            })
        results[str(score_path)] = {
            'dirFile': dir_file,
            'backgrounds': mapped
        }

    out = ROOT / 'tools' / 'data' / 'background_score_map.json'
    with open(out, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2)
    print(f"Wrote {out}")

if __name__ == '__main__':
    main()
