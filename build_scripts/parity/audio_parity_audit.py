#!/usr/bin/env python3
"""
Audit audio parity between Lingo, JS, and asset audio sprites.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]

LINGO_DIRS = [ROOT / 'decompiled_lingo']
JS_DIR = ROOT / 'tools' / 'src'
ASSETS_DIR = ROOT / 'dist' / 'assets'

AUDIO_RE = re.compile(r"\b\d{2}[de]\d{3}v\d\b")
SEGMENT_SUFFIX_RE = re.compile(r"(_\d+)$", re.IGNORECASE)


def normalize_audio_key(key: str) -> str:
    if not key:
        return ''
    key = key.strip()
    key = SEGMENT_SUFFIX_RE.sub('', key)  # strip _00/_01 segment
    return key.lower()


def collect_from_files(paths, regex):
    found = set()
    for p in paths:
        try:
            text = p.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        for m in regex.findall(text):
            found.add(normalize_audio_key(m))
    return found


def collect_lingo_audio():
    files = []
    for base in LINGO_DIRS:
        if not base.exists():
            continue
        files.extend(base.rglob('*.ls'))
        files.extend(base.rglob('*.lasm'))
    return collect_from_files(files, AUDIO_RE)


def collect_js_audio():
    files = list(JS_DIR.rglob('*.js'))
    return collect_from_files(files, AUDIO_RE)


def collect_asset_audio():
    found = set()
    for p in ASSETS_DIR.glob('*-audio.json'):
        try:
            data = json.loads(p.read_text(encoding='utf-8'))
        except Exception:
            continue
        spritemap = data.get('spritemap') or {}
        for key in spritemap.keys():
            # normalize any key that looks like audio ID or segmented audio ID
            if AUDIO_RE.match(key):
                found.add(normalize_audio_key(key))
            else:
                # allow segmented keys like 05e024v1_00
                base = normalize_audio_key(key)
                if AUDIO_RE.match(base):
                    found.add(base)
    return found


def group_by_prefix(items):
    groups = {}
    for it in items:
        prefix = it[:2]
        groups.setdefault(prefix, 0)
        groups[prefix] += 1
    return dict(sorted(groups.items()))


def main():
    lingo = collect_lingo_audio()
    js = collect_js_audio()
    assets = collect_asset_audio()

    lingo_missing_assets = sorted(lingo - assets)
    js_missing_assets = sorted(js - assets)
    lingo_not_used_in_js = sorted(lingo - js)
    js_not_in_lingo = sorted(js - lingo)

    out_report = ROOT / 'REPORT_AUDIO_PARITY.md'
    with open(out_report, 'w', encoding='utf-8') as f:
        f.write('# Audio Parity Audit\n\n')
        f.write(f'- Lingo audio IDs: {len(lingo)}\n')
        f.write(f'- JS audio IDs: {len(js)}\n')
        f.write(f'- Asset audio IDs: {len(assets)}\n\n')

        f.write('## Lingo → Assets Missing\n')
        f.write(f'Count: {len(lingo_missing_assets)}\n\n')
        if lingo_missing_assets:
            f.write('```\n' + '\n'.join(lingo_missing_assets) + '\n```\n')
        else:
            f.write('None.\n')
        f.write('\n')

        f.write('## JS → Assets Missing\n')
        f.write(f'Count: {len(js_missing_assets)}\n\n')
        if js_missing_assets:
            f.write('```\n' + '\n'.join(js_missing_assets) + '\n```\n')
        else:
            f.write('None.\n')
        f.write('\n')

        f.write('## Lingo Not Used In JS (Potential Missing Logic)\n')
        f.write(f'Count: {len(lingo_not_used_in_js)}\n\n')
        if lingo_not_used_in_js:
            f.write('```\n' + '\n'.join(lingo_not_used_in_js) + '\n```\n')
        else:
            f.write('None.\n')
        f.write('\n')

        f.write('## JS Not In Lingo (JS-only Audio)\n')
        f.write(f'Count: {len(js_not_in_lingo)}\n\n')
        if js_not_in_lingo:
            f.write('```\n' + '\n'.join(js_not_in_lingo) + '\n```\n')
        else:
            f.write('None.\n')
        f.write('\n')

        f.write('## Counts By Prefix\n')
        f.write('### Lingo\n')
        f.write('```\n' + json.dumps(group_by_prefix(lingo), indent=2) + '\n```\n')
        f.write('### JS\n')
        f.write('```\n' + json.dumps(group_by_prefix(js), indent=2) + '\n```\n')
        f.write('### Assets\n')
        f.write('```\n' + json.dumps(group_by_prefix(assets), indent=2) + '\n```\n')

    out_json = ROOT / 'tools' / 'data' / 'audio_parity_summary.json'
    with open(out_json, 'w', encoding='utf-8') as f:
        json.dump({
            'lingo_count': len(lingo),
            'js_count': len(js),
            'assets_count': len(assets),
            'lingo_missing_assets': lingo_missing_assets,
            'js_missing_assets': js_missing_assets,
            'lingo_not_used_in_js': lingo_not_used_in_js,
            'js_not_in_lingo': js_not_in_lingo,
        }, f, indent=2)

    print(f'Wrote {out_report}')
    print(f'Wrote {out_json}')

if __name__ == '__main__':
    main()
