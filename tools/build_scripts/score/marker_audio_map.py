#!/usr/bin/env python3
"""
Build a marker -> dialogue audio map from drxtract score.json + markers.json.

This script infers the sound cast encoding from score.json and resolves
marker ranges to the first detected dialogue clip (e.g., 77d###v0).

Usage:
  python tools/build_scripts/score/marker_audio_map.py \
    tools/build_data/BoatsMovies/drxtract/boten_77.dxr/score.json

Optional flags:
  --dir-file boten_77.DXR   # override inferred Director file name
  --out /tmp/map.json       # output JSON path (default: <movie>/marker_audio_map.json)
"""

import argparse
import json
import os
import re
from collections import defaultdict
from typing import Dict, List, Optional, Tuple


def infer_dir_file(score_path: str) -> Optional[str]:
    # Expect .../drxtract/<movie>.dxr/score.json
    movie_dir = os.path.basename(os.path.dirname(score_path))
    if not movie_dir.lower().endswith('.dxr'):
        return None
    return movie_dir.upper()


def load_markers(score_path: str) -> List[Dict]:
    markers_path = os.path.join(os.path.dirname(score_path), 'markers.json')
    if not os.path.exists(markers_path):
        return []
    with open(markers_path, 'r') as fp:
        return json.load(fp)


def load_score(score_path: str) -> List[Dict]:
    with open(score_path, 'r') as fp:
        return json.load(fp)


def load_member_map(project_root: str) -> Dict[str, Dict[str, str]]:
    path = os.path.join(project_root, 'tools', 'data', 'director_member_map.json')
    with open(path, 'r') as fp:
        return json.load(fp)


def get_movie_prefix(dir_file: str) -> Optional[str]:
    # boten_77.DXR -> 77, 04.DXR -> 04
    base = os.path.splitext(os.path.basename(dir_file))[0]
    if base.lower().startswith('boten_'):
        base = base[6:]
    m = re.match(r'^(\d{2})$', base)
    return m.group(1) if m else None


def collect_audio_members(member_map: Dict[str, str], prefix: str) -> Dict[int, str]:
    audio_members = {}
    for k, name in member_map.items():
        if not isinstance(name, str):
            continue
        if name.startswith(prefix + 'd'):
            try:
                audio_members[int(k)] = name
            except ValueError:
                pass
    return audio_members


def collect_sound_values(score: List[Dict]) -> List[int]:
    values = []
    for frame in score:
        main = frame.get('main', {})
        for key in ('sound1_cast', 'sound2_cast'):
            v = main.get(key)
            if v:
                values.append(v)
    return values


def decode_low_byte(v: int, audio_members: Dict[int, str]) -> Optional[str]:
    member = v & 0xFF
    return audio_members.get(member)


def infer_linear_bases(values: List[int], audio_members: Dict[int, str], a_candidates: List[int]) -> Tuple[int, List[int], Dict[int, int]]:
    """
    Infer a linear encoding v = a * member + b. Returns:
    - best a
    - candidate b list (sorted by frequency)
    - b frequency map
    """
    audio_member_nums = list(audio_members.keys())
    best = (0, None, [])  # matches, a, b_list
    best_b_freq = {}

    for a in a_candidates:
        b_counts = defaultdict(int)
        for v in values:
            for m in audio_member_nums:
                b = v - a * m
                b_counts[b] += 1

        # Keep b values that occur at least twice (noise filter)
        b_sorted = sorted(b_counts.items(), key=lambda x: (-x[1], x[0]))
        b_candidates = [b for b, cnt in b_sorted if cnt >= 2]
        if not b_candidates:
            continue

        # Measure match count using these b candidates
        matches = 0
        for v in values:
            for b in b_candidates:
                if (v - b) % a != 0:
                    continue
                member = (v - b) // a
                if member in audio_members:
                    matches += 1
                    break

        if matches > best[0]:
            best = (matches, a, b_candidates)
            best_b_freq = dict(b_counts)

    return best[1], best[2], best_b_freq


def decode_linear(v: int, a: int, b_candidates: List[int], audio_members: Dict[int, str]) -> Optional[str]:
    for b in b_candidates:
        if (v - b) % a != 0:
            continue
        member = (v - b) // a
        name = audio_members.get(member)
        if name:
            return name
    return None


def choose_strategy(values: List[int], audio_members: Dict[int, str], score: List[Dict], markers: List[Dict]) -> Tuple[Dict, Dict[str, Optional[str]]]:
    """
    Choose between low-byte and linear decoding based on marker coverage.
    Returns (strategy, mapping).
    """
    # Strategy A: low-byte
    low_matches = sum(1 for v in values if decode_low_byte(v, audio_members))
    low_strategy = {
        'strategy': 'low_byte',
        'matches': low_matches,
        'low_matches': low_matches
    }
    low_map = build_marker_map(score, markers, audio_members, low_strategy)
    low_mapped = sum(1 for v in low_map.values() if v)

    # Strategy B: linear with inferred a/b
    a_candidates = list(range(1, 9))
    a, b_candidates, b_freq = infer_linear_bases(values, audio_members, a_candidates)
    lin_strategy = None
    lin_map = {}
    lin_mapped = -1
    lin_matches = 0
    if a and b_candidates:
        for v in values:
            if decode_linear(v, a, b_candidates, audio_members):
                lin_matches += 1
        b_ranked = sorted(b_candidates, key=lambda b: -b_freq.get(b, 0))
        lin_strategy = {
            'strategy': 'linear',
            'a': a,
            'b_candidates': b_ranked[:8],
            'matches': lin_matches,
            'low_matches': low_matches
        }
        lin_map = build_marker_map(score, markers, audio_members, lin_strategy)
        lin_mapped = sum(1 for v in lin_map.values() if v)

    # Prefer strategy with higher mapped marker count; tie-break on matches
    if lin_strategy and (lin_mapped > low_mapped or (lin_mapped == low_mapped and lin_matches > low_matches)):
        return lin_strategy, lin_map

    return low_strategy, low_map


def decode_value(v: int, audio_members: Dict[int, str], strategy: Dict) -> Optional[str]:
    if strategy['strategy'] == 'low_byte':
        return decode_low_byte(v, audio_members)
    return decode_linear(v, strategy['a'], strategy['b_candidates'], audio_members)


def build_marker_map(score: List[Dict], markers: List[Dict], audio_members: Dict[int, str], strategy: Dict) -> Dict[str, Optional[str]]:
    if not markers:
        return {}

    markers_sorted = sorted(markers, key=lambda m: m['frame'])
    mapping = {}

    for idx, marker in enumerate(markers_sorted):
        start = marker['frame']
        end = markers_sorted[idx + 1]['frame'] - 1 if idx + 1 < len(markers_sorted) else len(score)
        found = None
        for frame_idx in range(start, end + 1):
            frame = score[frame_idx - 1]
            main = frame.get('main', {})
            for key in ('sound1_cast', 'sound2_cast'):
                v = main.get(key)
                if not v:
                    continue
                decoded = decode_value(v, audio_members, strategy)
                if decoded:
                    found = decoded
                    break
            if found:
                break
        mapping[marker['name']] = found

    return mapping


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('score_json', help='Path to drxtract score.json')
    parser.add_argument('--dir-file', dest='dir_file', default=None, help='Override dirFile (e.g., boten_77.DXR)')
    parser.add_argument('--out', dest='out', default=None, help='Output JSON path')
    args = parser.parse_args()

    score_path = os.path.realpath(args.score_json)
    score = load_score(score_path)
    markers = load_markers(score_path)

    dir_file = args.dir_file or infer_dir_file(score_path)
    if not dir_file:
        raise SystemExit('Could not infer dirFile. Use --dir-file.')

    project_root = os.path.realpath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
    member_map_all = load_member_map(project_root)
    member_map = member_map_all.get(dir_file)
    if not member_map:
        # Try case-insensitive match and prefer the shortest key
        lower = dir_file.lower()
        candidates = [k for k in member_map_all.keys() if k.lower() == lower]
        if not candidates:
            # Fallback: endswith match (handles duplicated prefixes)
            candidates = [k for k in member_map_all.keys() if k.lower().endswith(lower)]
        if candidates:
            candidates.sort(key=len)
            dir_file = candidates[0]
            member_map = member_map_all.get(dir_file)
    if not member_map:
        raise SystemExit(f'No member map for {dir_file}')

    prefix = get_movie_prefix(dir_file)
    if not prefix:
        raise SystemExit(f'Could not determine movie prefix from {dir_file}')

    audio_members = collect_audio_members(member_map, prefix)
    if not audio_members:
        raise SystemExit(f'No audio members found for prefix {prefix} in {dir_file}')

    values = collect_sound_values(score)
    strategy, mapping = choose_strategy(values, audio_members, score, markers)

    out = {
        'dirFile': dir_file,
        'prefix': prefix,
        'strategy': strategy,
        'markers': mapping
    }

    out_path = args.out or os.path.join(os.path.dirname(score_path), 'marker_audio_map.json')
    with open(out_path, 'w') as fp:
        json.dump(out, fp, indent=2, sort_keys=True)

    print(f'Wrote {out_path}')
    print('Strategy:', strategy)
    # Print quick summary
    unmapped = [k for k, v in mapping.items() if not v]
    print(f'Markers: {len(mapping)}, mapped: {len(mapping) - len(unmapped)}, unmapped: {len(unmapped)}')


if __name__ == '__main__':
    main()
