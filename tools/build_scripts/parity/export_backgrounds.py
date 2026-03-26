#!/usr/bin/env python3
"""
Export all large (background) frames from dist atlases and build an HTML gallery.
"""
import os
import json
import glob
import re
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    raise SystemExit("Pillow not installed. Try: pip install pillow")

ROOT = Path(__file__).resolve().parents[3]
DIST = ROOT / 'dist' / 'assets'
OUT_DIR = ROOT / 'tmp' / 'background_gallery'
OUT_DIR.mkdir(parents=True, exist_ok=True)

# Heuristic thresholds for background candidates
MIN_W = 640
MIN_H = 480

# Collect JS-used background members (dirFile, dirNum) from scenes
JS_SCENES_DIR = ROOT / 'tools' / 'src' / 'scenes'
js_bg_used = set()
js_bg_lines = []
pattern = re.compile(r"setDirectorMember\(\s*['\"]([^'\"]+)['\"]\s*,\s*([0-9]+)\s*\)")

for js_file in JS_SCENES_DIR.glob('*.js'):
    text = js_file.read_text(encoding='utf-8', errors='ignore')
    for m in pattern.finditer(text):
        dir_file = m.group(1)
        dir_num = int(m.group(2))
        js_bg_used.add((dir_file, dir_num))
        # keep trace for report
        line_num = text[:m.start()].count('\n') + 1
        js_bg_lines.append((js_file.name, line_num, dir_file, dir_num))

# Export frames
items = []

atlas_jsons = sorted(DIST.glob('*sprites-*.json'))
for atlas_json in atlas_jsons:
    try:
        atlas = json.loads(atlas_json.read_text(encoding='utf-8'))
    except Exception:
        continue
    png_path = atlas_json.with_suffix('.png')
    if not png_path.exists():
        continue
    img = Image.open(png_path)

    for key, fr in atlas.get('frames', {}).items():
        frame = fr.get('frame') or {}
        w = frame.get('w', 0)
        h = frame.get('h', 0)
        if w < MIN_W or h < MIN_H:
            continue
        dir_file = fr.get('dirFile', '')
        dir_num = fr.get('dirNum', None)
        dir_name = fr.get('dirName', '')
        x = frame.get('x', 0)
        y = frame.get('y', 0)

        # Crop and save
        out_name = f"{dir_file.replace('/', '_')}_{dir_num}_{dir_name}_{atlas_json.name}.png"
        out_name = re.sub(r"[^A-Za-z0-9_.-]", "_", out_name)
        out_path = OUT_DIR / out_name
        try:
            crop = img.crop((x, y, x + w, y + h))
            crop.save(out_path)
        except Exception:
            continue

        used = (dir_file, int(dir_num) if isinstance(dir_num, int) or str(dir_num).isdigit() else dir_num) in js_bg_used
        items.append({
            'file': out_name,
            'dirFile': dir_file,
            'dirNum': dir_num,
            'dirName': dir_name,
            'atlas': atlas_json.name,
            'usedByJS': used,
            'size': f"{w}x{h}",
        })

# Write data JSON
with open(OUT_DIR / 'backgrounds.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2)

# Build HTML gallery
html_lines = [
    '<!doctype html>',
    '<html><head><meta charset="utf-8"/>',
    '<title>Background Gallery</title>',
    '<style>body{font-family:Arial, sans-serif; background:#f5f5f5;} .grid{display:flex;flex-wrap:wrap;gap:16px;} .card{background:#fff;border:1px solid #ddd;padding:8px;width:320px;box-shadow:0 1px 3px rgba(0,0,0,.1);} img{max-width:100%;height:auto;display:block;} .meta{font-size:12px;margin-top:6px;} .used{color:#0a7;} .unused{color:#c00;}</style>',
    '</head><body>',
    '<h1>Background Gallery</h1>',
    f'<p>Extracted {len(items)} background candidates (>= {MIN_W}x{MIN_H}).</p>',
    '<div class="grid">'
]

for it in sorted(items, key=lambda x: (x['dirFile'], x['dirNum'] if x['dirNum'] is not None else 0)):
    used_class = 'used' if it['usedByJS'] else 'unused'
    used_label = 'used by JS' if it['usedByJS'] else 'not referenced in JS'
    html_lines.append('<div class="card">')
    html_lines.append(f"<img src='{it['file']}' alt='{it['dirFile']} {it['dirNum']}' />")
    html_lines.append('<div class="meta">')
    html_lines.append(f"<div><b>{it['dirFile']}</b> member {it['dirNum']} ({it['dirName']})</div>")
    html_lines.append(f"<div>Atlas: {it['atlas']}</div>")
    html_lines.append(f"<div>Size: {it['size']}</div>")
    html_lines.append(f"<div class='{used_class}'>{used_label}</div>")
    html_lines.append('</div></div>')

html_lines.append('</div></body></html>')

with open(OUT_DIR / 'index.html', 'w', encoding='utf-8') as f:
    f.write('\n'.join(html_lines))

# Write JS usage list
with open(OUT_DIR / 'js_background_usage.txt', 'w', encoding='utf-8') as f:
    for entry in sorted(js_bg_lines):
        f.write(f"{entry[0]}:{entry[1]} -> {entry[2]} {entry[3]}\n")

print(f"Wrote {len(items)} backgrounds to {OUT_DIR}")
print(f"Gallery: {OUT_DIR / 'index.html'}")
