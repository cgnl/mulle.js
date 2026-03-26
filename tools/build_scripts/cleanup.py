import shutil

from build import Build

build = Build()

shutil.rmtree(build.build_folder)
shutil.rmtree(build.dist_folder)
shutil.rmtree(build.extract_folder)
