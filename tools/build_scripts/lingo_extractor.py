"""
Extract lingo scripts from director movies using ProjectorRays
"""
import os
import subprocess

from build import Build

build = Build()
lingo_folder = os.path.join(build.build_folder, 'lingo')
if not os.path.exists(lingo_folder):
    os.mkdir(lingo_folder)

extensions = ['CXT', 'DXR']
file: os.DirEntry
for file in os.scandir(build.movie_folder):
    filename, file_extension = os.path.splitext(file.name)
    if file_extension[1:] not in extensions:
        continue
    extract_folder = os.path.join(lingo_folder, file.name)
    if not os.path.exists(extract_folder):
        os.mkdir(extract_folder)
    print(file.path)
    try:
        subprocess.run(['projectorrays', file.path], cwd=extract_folder).check_returncode()
    except subprocess.CalledProcessError as e:
        print(e.stderr)
