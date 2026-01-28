import os
import sys
from glob import glob
from ShockwaveExtractor import main

gameDir = sys.argv[1]
if not os.path.exists(gameDir):
    raise FileNotFoundError('Game directory %s not found' % gameDir)
gameDir = os.path.realpath(gameDir)
if os.path.exists(os.path.join(gameDir, 'MOVIES')):
    gameDir = os.path.join(gameDir, 'MOVIES')
    files = glob('%s%s*.CXT' % (gameDir, os.path.sep)) + glob('%s%s*.DXR' % (gameDir, os.path.sep))
elif os.path.join(gameDir, 'movies'):
    gameDir = os.path.join(gameDir, 'movies')
    files = glob('%s%s*.cxt' % (gameDir, os.path.sep)) + glob('%s%s*.dxr' % (gameDir, os.path.sep))
else:
    raise FileNotFoundError('movies directory not found at %s' % gameDir)

if not files:
    raise FileNotFoundError('No files found in %s' % gameDir)

for file in files:
    print(file)
    try:
        main(['-e', '-i', file])
    except UnicodeEncodeError as e:
        print('Error extracting %s: %s' % (file, e))
