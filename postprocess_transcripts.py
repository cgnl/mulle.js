#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import json
import re
from pathlib import Path

PROJECT = Path('~/projects/mulle-meck-game').expanduser()
OUT = PROJECT / 'transcriptions'
SUB_EN = PROJECT / 'tools/data/subtitles/english'
SUB_SV = PROJECT / 'tools/data/subtitles/swedish'
SUB_NL = PROJECT / 'tools/data/subtitles/dutch'

# Normalization / canonical names
REPLACEMENTS = [
    # Canonical character names / common ASR mistakes
    (re.compile(r"\bStaf\s*schroot\b", re.I), "Staf Schroot"),
    (re.compile(r"\bStafschroot\b", re.I), "Staf Schroot"),
    (re.compile(r"\bStafsgroot\b", re.I), "Staf Schroot"),

    (re.compile(r"\bMeehl\b", re.I), "Miel"),
    (re.compile(r"\bMulle\b", re.I), "Miel"),

    # Figge Ferrum (Swedish original) = Staf Schroot (Dutch)
    (re.compile(r"\bFigge\s*Ferrum\b", re.I), "Staf Schroot"),
    (re.compile(r"\bFigge\b", re.I), "Staf"),

    (re.compile(r"\bRifka\b", re.I), "Rifka"),
    (re.compile(r"\bLaika\b", re.I), "Laika"),
    (re.compile(r"\bJuffrouw\s*Sien\b", re.I), "Juffrouw Sien"),
    (re.compile(r"\bPeggy\s*PC\b", re.I), "Peggy PC"),
    (re.compile(r"\bVicky\s*Vitamien\b", re.I), "Vicky Vitamien"),
    (re.compile(r"\bArno\s*Adel\b", re.I), "Arno Adel"),
    (re.compile(r"\bJury\s*man\b", re.I), "Juryman"),
    (re.compile(r"\bJuryman\b", re.I), "Juryman"),

    (re.compile(r"\bJacky\s*Nix\b", re.I), "Jacky Nix"),
    (re.compile(r"\bBoris\s*Blaf\b", re.I), "Boris Blaf"),
    (re.compile(r"\bFrank\s*Petanque\b", re.I), "Frank Petanque"),

    # Common Whisper ASR errors
    (re.compile(r"\bmegafoom\b", re.I), "megafoon"),
    (re.compile(r"\bklunnelen\b", re.I), "klungelen"),
    (re.compile(r"\bknutselen\b", re.I), "klungelen"),
]


def load_json(p: Path):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(p: Path, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def normalize_text(text: str) -> str:
    t = (text or '').strip()
    # remove leading/trailing weird whitespace
    t = re.sub(r"\s+", " ", t).strip()
    for rx, repl in REPLACEMENTS:
        t = rx.sub(repl, t)
    return t


def split_like_reference(full_text: str, ref_lines: list[str]) -> list[str]:
    full_text = normalize_text(full_text)
    if not ref_lines:
        return [full_text] if full_text else []

    n = len(ref_lines)
    if n == 1:
        return [full_text] if full_text else [""]

    # Try to split on sentence-ish boundaries
    parts = re.split(r"(?<=[\.!\?])\s+|\s*-\s+", full_text)
    parts = [p.strip(" -") for p in parts if p.strip(" -")]

    if len(parts) >= n:
        return parts[:n]

    # Fallback: pad with empties
    while len(parts) < n:
        parts.append("")
    return parts


def build_nl_for(name: str):
    en_path = SUB_EN / f'{name}.json'
    sv_path = SUB_SV / f'{name}.json'

    ref = None
    if en_path.exists():
        ref = load_json(en_path)
    elif sv_path.exists():
        ref = load_json(sv_path)
    else:
        return

    whisper_dir = OUT / name / 'whisper'
    nl = {}

    for audio_id, r in ref.items():
        r_lines = r.get('lines') or []
        wjson = whisper_dir / f'{audio_id}.json'
        text = ""
        if wjson.exists():
            w = load_json(wjson)
            text = w.get('text') or ""
        text = normalize_text(text)

        entry = {}
        if 'actor' in r:
            entry['actor'] = r['actor']

        entry['lines'] = split_like_reference(text, r_lines) if text else r_lines
        nl[audio_id] = entry

    save_json(SUB_NL / f'{name}.json', nl)

    # Validation summary
    return {
        'name': name,
        'keys_ref': len(ref.keys()),
        'keys_nl': len(nl.keys()),
        'missing_whisper': sum(1 for k in ref.keys() if not (whisper_dir / f'{k}.json').exists()),
    }


def main():
    SUB_NL.mkdir(parents=True, exist_ok=True)
    targets = ['garage', 'carparts', 'figgeferrum', 'viola', 'yard']
    report = []
    for t in targets:
        info = build_nl_for(t)
        if info:
            report.append(info)

    save_json(PROJECT / 'transcriptions' / 'validation_report.json', report)
    print(json.dumps(report, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()
