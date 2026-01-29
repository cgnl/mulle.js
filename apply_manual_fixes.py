#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
from pathlib import Path

PROJECT = Path('~/projects/mulle-meck-game').expanduser()
BASE = PROJECT / 'tools/data/subtitles/dutch'
FIXES = PROJECT / 'manual_fixes.json'


def load(p: Path):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)


def save(p: Path, data):
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def main():
    fixes = load(FIXES)
    for fname, by_id in fixes.items():
        p = BASE / fname
        data = load(p)
        for audio_id, patch in by_id.items():
            data.setdefault(audio_id, {})
            data[audio_id]['lines'] = patch['lines']
        save(p, data)
        print('patched', fname, len(by_id))


if __name__ == '__main__':
    main()
