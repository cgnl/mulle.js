import json
import os
import re
import sys
from pprint import pprint
frames_out = []
score_tracks = {}

score_input_file = os.path.realpath(sys.argv[1])
movie_dir = os.path.dirname(score_input_file)
movie = os.path.basename(movie_dir)

markers_file = os.path.join(os.path.dirname(score_input_file), 'markers.json')
marker_frames = {}
marker_frames_rev = {}
with open(markers_file, 'r') as fp:
    for marker in json.load(fp):
        marker_frames[marker['frame']] = marker['name']
        marker_frames_rev[marker['name']] = marker['frame']

with open(score_input_file, 'r') as fp:
    score = json.load(fp)

marker = None
marker_range = {}

channel = sys.argv[2]
marker_arg = sys.argv[3]

sprites = {4: {'23-29': 43, '30-53': 44, '54-72': 43},
           5: {'23-25': 34, '26-72': 38}
           }
if not int(channel) in sprites:
    raise AttributeError('Sprite range not defined for channel %s' % channel)

frame_sprites = {}
for frame_range, sprite in sprites[int(channel)].items():
    matches = re.match(r'([0-9]+)\-([0-9]+)', frame_range)
    for frame in range(int(matches.group(1)), int(matches.group(2))+1):
        frame_sprites[frame] = sprite

for frame_num, frame in score[channel].items():
    frame_num = int(frame_num)
    if frame_num < marker_frames_rev[marker_arg]:
        continue
    if frame == {}:
        break

    frames_out.append({'x': frame['x'],
                       'y': frame['y'],
                       'h': frame['height'],
                       'w': frame['width'],
                       'cast': frame_sprites[frame_num]
                       })

    if frame_num+1 in marker_frames:
        print('End of marker %s' % marker)
        break


dir_path = os.path.dirname(os.path.realpath(__file__))
project_path = os.path.realpath(os.path.join(dir_path, '..', '..'))
score_name = '%s_%s_%s.json' % (movie, marker_arg, channel)
score_path = os.path.join(project_path, 'dist', 'score')
if not os.path.exists(score_path):
    os.mkdir(score_path)
with open(os.path.join(score_path, score_name), 'w') as fp:
    json.dump(frames_out, fp, indent=4)

