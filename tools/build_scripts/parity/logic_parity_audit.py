#!/usr/bin/env python3
"""
Rough logic parity audit: compare Lingo mouseObject count to JS button count per scene.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
LINGO_DIR = ROOT / 'decompiled_lingo'
JS_SCENES_DIR = ROOT / 'tools' / 'src' / 'scenes'
LINGO_SCENES_DIR = ROOT / 'tools' / 'src' / 'lingo' / 'scenes'
GAME_JS = ROOT / 'tools' / 'src' / 'game.js'

MOUSEOBJ_RE = re.compile(r'new\(script\s+"mouseObject"')

JS_BUTTON_RE = re.compile(r'new\s+MulleButton|MulleButton\.fromRectangle')
LINGO_SPEC_RE = re.compile(r'\brect\s*:\s*\[')
# Match dirFile: 'boten_02.DXR' or "boten_02.DXR"
DIRFILE_RE = re.compile(r"dirFile\s*:\s*['\"]([^'\"]+)['\"]")

def parse_scene_map(text: str, section_name: str):
    """
    Parse a named scene map from game.js, e.g. this.mulle.carScenes = { ... }.
    Returns dict of dirKey -> sceneName for that section only.
    """
    # Capture object literal body for the section
    section_re = re.compile(rf"{re.escape(section_name)}\s*=\s*\{{(.*?)\n\s*\}}", re.S)
    m = section_re.search(text)
    if not m:
        return {}
    body = m.group(1)
    out = {}
    for m2 in re.finditer(r"'([0-9A-Z_]+)'\s*:\s*'([a-zA-Z0-9_]+)'", body):
        out[m2.group(1)] = m2.group(2)
    return out

# Build mapping from dir number to scene name via game.js (carScenes + botenScenes)
car_scene_map = {}
boten_scene_map = {}
if GAME_JS.exists():
    text = GAME_JS.read_text(encoding='utf-8', errors='ignore')
    car_scene_map = parse_scene_map(text, 'this.mulle.carScenes')
    boten_scene_map = parse_scene_map(text, 'this.mulle.botenScenes')


def lingo_scene_key(path: Path):
    parts = path.parts
    # Expect .../decompiled_lingo/XX/XX/casts/... or .../decompiled_lingo/boat_77/77/...
    for i in range(len(parts) - 1):
        if parts[i] == 'decompiled_lingo' and i + 1 < len(parts):
            base = parts[i + 1]
            if base.startswith('boat_'):
                return f'boten:{base.split("_", 1)[1]}'
            # Numeric directories can be auto or boat; prefer boat if no boat_XX exists
            if re.fullmatch(r'\d{2}', base):
                if (LINGO_DIR / f'boat_{base}').exists():
                    return None
                if base in boten_scene_map:
                    return f'boten:{base}'
                return f'auto:{base}'
            return None
    return None


# Collect Lingo mouseObject counts
lingo_counts = {}
for ls in LINGO_DIR.rglob('ParentScript * - Dir.ls'):
    try:
        text = ls.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    count = len(MOUSEOBJ_RE.findall(text))
    key = lingo_scene_key(ls)
    if key:
        lingo_counts[key] = lingo_counts.get(key, 0) + count

# Collect JS button counts per scene file
js_counts = {}
for js in JS_SCENES_DIR.glob('*.js'):
    try:
        text = js.read_text(encoding='utf-8', errors='ignore')
    except Exception:
        continue
    count = len(JS_BUTTON_RE.findall(text))
    js_counts[js.stem] = count

# Collect Lingo runtime spec counts per dir key
spec_counts = {}
if LINGO_SCENES_DIR.exists():
    for spec in LINGO_SCENES_DIR.glob('*.js'):
        try:
            text = spec.read_text(encoding='utf-8', errors='ignore')
        except Exception:
            continue
        m = DIRFILE_RE.search(text)
        if not m:
            continue
        dir_file = m.group(1)
        base = dir_file.replace('.DXR', '').replace('.dxr', '')
        count = len(LINGO_SPEC_RE.findall(text))
        if base.startswith('boten_'):
            key = f'boten:{base.replace("boten_", "")}'
            spec_counts[key] = spec_counts.get(key, 0) + count

# Map JS scenes to dir keys using car/boten maps
js_by_dir = {}
for dir_key, scene_name in car_scene_map.items():
    if scene_name in js_counts:
        js_by_dir[f'auto:{dir_key}'] = js_counts[scene_name]
for dir_key, scene_name in boten_scene_map.items():
    if scene_name in js_counts:
        js_by_dir[f'boten:{dir_key}'] = js_counts[scene_name]

# Add Lingo runtime spec mouseObjects
for dir_key, count in spec_counts.items():
    js_by_dir[dir_key] = js_by_dir.get(dir_key, 0) + count

# Build report
out = ROOT / 'REPORT_LOGIC_PARITY.md'
with open(out, 'w', encoding='utf-8') as f:
    f.write('# Logic Parity Audit (MouseObject vs JS Buttons)\n\n')
    f.write('This is a coarse structural audit: Lingo `mouseObject` count vs JS `MulleButton` count.\n')
    f.write('It does not guarantee full parity, but highlights large mismatches.\n\n')

    f.write('## Per Dir Key\n\n')
    f.write('| Dir | Lingo mouseObject | JS buttons | Scene |\n')
    f.write('|---|---:|---:|---|\n')

    all_keys = sorted(set(lingo_counts.keys()) | set(js_by_dir.keys()))
    for key in all_keys:
        l_count = lingo_counts.get(key, 0)
        j_count = js_by_dir.get(key, 0)
        if key.startswith('auto:'):
            scene = car_scene_map.get(key.split(':', 1)[1], '')
        elif key.startswith('boten:'):
            scene = boten_scene_map.get(key.split(':', 1)[1], '')
        else:
            scene = ''
        f.write(f'| {key} | {l_count} | {j_count} | {scene} |\n')

    f.write('\n## Unmapped JS Scenes\n\n')
    for scene, count in sorted(js_counts.items()):
        if scene not in car_scene_map.values() and scene not in boten_scene_map.values():
            f.write(f'- {scene}: {count}\n')

    f.write('\n## Notes\n')
    f.write('- Lingo counts aggregate multiple Dir scripts if present.\n')
    f.write('- Some JS buttons are non-Lingo (debug or modern UX).\n')

print(f'Wrote {out}')
