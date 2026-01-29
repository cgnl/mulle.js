#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Clip audiosprite OGG into per-audioId WAVs and transcribe with Whisper.

Inputs live in /tmp/mulle-assets:
- <name>-audio.ogg
- <name>-audio.json  (Howler-style audiosprite with spritemap)

We only clip audioIds that exist in our subtitle reference files:
- tools/data/subtitles/english/<name>.json
- tools/data/subtitles/swedish/<name>.json

Outputs:
- transcriptions/<name>/clips/<audioId>.wav
- transcriptions/<name>/whisper/<audioId>.json
- tools/data/subtitles/dutch/<name>.json  (updated NL lines)
"""

import json
import os
import subprocess
from pathlib import Path

PROJECT = Path('~/projects/mulle-meck-game').expanduser()
ASSETS = Path('/tmp/mulle-assets')
SUB_EN = PROJECT / 'tools/data/subtitles/english'
SUB_SV = PROJECT / 'tools/data/subtitles/swedish'
SUB_NL = PROJECT / 'tools/data/subtitles/dutch'
OUT = PROJECT / 'transcriptions'


def run(cmd):
    p = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True)
    if p.returncode != 0:
        raise RuntimeError(f"Command failed ({p.returncode}): {' '.join(cmd)}\n{p.stdout[:2000]}")
    return p.stdout


def load_json(p: Path):
    with open(p, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(p: Path, data):
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


def clip_one(ogg_path: Path, start: float, end: float, wav_out: Path):
    wav_out.parent.mkdir(parents=True, exist_ok=True)
    dur = max(0.01, end - start)
    cmd = [
        'ffmpeg', '-hide_banner', '-loglevel', 'error',
        '-ss', f'{start:.3f}', '-t', f'{dur:.3f}',
        '-i', str(ogg_path),
        '-ac', '1', '-ar', '16000',
        str(wav_out), '-y'
    ]
    run(cmd)


def whisper_one(wav_path: Path, json_out_dir: Path):
    json_out_dir.mkdir(parents=True, exist_ok=True)
    cmd = [
        'whisper', str(wav_path),
        '--language', 'Dutch',
        '--model', 'medium',
        '--output_format', 'json',
        '--output_dir', str(json_out_dir),
        '--fp16', 'False'
    ]
    run(cmd)
    out_json = json_out_dir / (wav_path.stem + '.json')
    return out_json


def extract_text_from_whisper(json_path: Path) -> str:
    data = load_json(json_path)
    # Whisper json has "text" at top-level
    return (data.get('text') or '').strip()


def audio_ids_to_process(name: str):
    ids = set()
    en_path = SUB_EN / f'{name}.json'
    sv_path = SUB_SV / f'{name}.json'
    if en_path.exists():
        ids |= set(load_json(en_path).keys())
    if sv_path.exists():
        ids |= set(load_json(sv_path).keys())
    return sorted(ids)


def main():
    SUB_NL.mkdir(parents=True, exist_ok=True)

    targets = ['garage', 'carparts', 'figgeferrum', 'yard']

    for name in targets:
        ogg = ASSETS / f'{name}-audio.ogg'
        spr = ASSETS / f'{name}-audio.json'
        if not ogg.exists() or not spr.exists():
            print(f"Skip {name}: missing {ogg.name} or {spr.name}")
            continue

        spr_data = load_json(spr)
        spritemap = spr_data.get('spritemap', {})

        wanted_ids = audio_ids_to_process(name)
        if not wanted_ids:
            print(f"Skip {name}: no subtitle reference ids")
            continue

        # Start from English structure if present, else Swedish, else empty
        base = {}
        en_path = SUB_EN / f'{name}.json'
        sv_path = SUB_SV / f'{name}.json'
        if en_path.exists():
            base = load_json(en_path)
        elif sv_path.exists():
            base = load_json(sv_path)

        nl_out = {}

        out_clips = OUT / name / 'clips'
        out_wh = OUT / name / 'whisper'

        print(f"\n=== {name} ===")
        print(f"Audio ids to process: {len(wanted_ids)}")

        for audio_id in wanted_ids:
            sm = spritemap.get(audio_id)
            if not sm:
                # Some spritemaps use numeric keys; try fallback by searching data.dirName
                found = None
                for k, v in spritemap.items():
                    d = (v.get('data') or {})
                    if d.get('dirName') == audio_id:
                        found = v
                        break
                sm = found

            if not sm:
                # Keep placeholder if missing
                if audio_id in base:
                    nl_out[audio_id] = base[audio_id]
                continue

            start = float(sm['start'])
            end = float(sm['end'])
            wav_path = out_clips / f'{audio_id}.wav'
            clip_one(ogg, start, end, wav_path)

            wjson = whisper_one(wav_path, out_wh)
            text = extract_text_from_whisper(wjson)

            # Build NL entry keeping actor if available
            entry = {}
            ref = base.get(audio_id, {})
            if 'actor' in ref:
                entry['actor'] = ref['actor']

            # Keep line breaks from reference if possible
            ref_lines = ref.get('lines') or []
            if ref_lines and text:
                # naive split: if ref has N lines, split on punctuation into N-ish parts
                # fallback: single line
                entry['lines'] = [text]
            else:
                entry['lines'] = [text] if text else ref_lines

            nl_out[audio_id] = entry

        save_json(SUB_NL / f'{name}.json', nl_out)
        print(f"Wrote {SUB_NL / (name + '.json')}")


if __name__ == '__main__':
    main()
