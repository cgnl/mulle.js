#!/usr/bin/env python3
"""Compare JS background usage to score-derived backgrounds."""
import json
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[3]
SCORE_MAP = ROOT / 'tools' / 'data' / 'background_score_map.json'
BG_JSON = ROOT / 'tmp' / 'background_gallery' / 'backgrounds.json'
JS_USAGE = ROOT / 'tmp' / 'background_gallery' / 'js_background_usage.txt'

if not SCORE_MAP.exists() or not BG_JSON.exists():
    raise SystemExit('Missing inputs. Run export_backgrounds.py and background_from_score.py first.')

score = json.loads(SCORE_MAP.read_text(encoding='utf-8'))
backgrounds = json.loads(BG_JSON.read_text(encoding='utf-8'))

# JS usage set
js_set = set()
if JS_USAGE.exists():
    for line in JS_USAGE.read_text(encoding='utf-8').splitlines():
        parts = line.split('->')
        if len(parts) != 2:
            continue
        rhs = parts[1].strip()
        if not rhs:
            continue
        dir_file, dir_num = rhs.split()[:2]
        try:
            dir_num = int(dir_num)
        except Exception:
            pass
        js_set.add((dir_file, dir_num))

# Build score map per dirFile
score_by_dir = {}
for path_str, entry in score.items():
    dir_file = entry.get('dirFile')
    for bg in entry.get('backgrounds', []):
        score_by_dir.setdefault(dir_file, set()).add(bg['castId'])

# Build available backgrounds per dirFile from gallery
bg_by_dir = {}
for bg in backgrounds:
    dir_file = bg.get('dirFile')
    dir_num = bg.get('dirNum')
    if dir_file and dir_num is not None:
        bg_by_dir.setdefault(dir_file, set()).add(dir_num)

out = ROOT / 'REPORT_BACKGROUND_PARITY.md'
with open(out, 'w', encoding='utf-8') as f:
    f.write('# Background Parity Report\n\n')
    f.write('Compares JS background usage vs score-derived backgrounds (where available).\n\n')

    dirs = sorted(set(bg_by_dir.keys()) | set(score_by_dir.keys()))
    for d in dirs:
        js_members = sorted([num for (df, num) in js_set if df == d])
        score_members = sorted(score_by_dir.get(d, []))
        gallery_members = sorted(bg_by_dir.get(d, []))

        f.write(f'## {d}\n\n')
        f.write(f'- JS members: {js_members if js_members else "(none)"}\n')
        f.write(f'- Score members: {score_members if score_members else "(none)"}\n')
        f.write(f'- Gallery members: {gallery_members if gallery_members else "(none)"}\n\n')

        # Highlight mismatches if both present
        if js_members and score_members:
            js_set_nums = set(js_members)
            sc_set_nums = set(score_members)
            missing_in_js = sorted(sc_set_nums - js_set_nums)
            extra_in_js = sorted(js_set_nums - sc_set_nums)
            if missing_in_js:
                f.write(f'  - Missing in JS: {missing_in_js}\n')
            if extra_in_js:
                f.write(f'  - Extra in JS: {extra_in_js}\n')
            f.write('\n')

print(f'Wrote {out}')
