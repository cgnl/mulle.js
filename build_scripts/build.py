import glob
import os
import platform
import shutil
import subprocess
import sys
import zipfile

import requests

try:
    from git import Repo

    import ShockwaveExtractor
    from topography import build_topography
    from convert_image import convert_image
except ImportError as e:
    if 'download-only' not in sys.argv:
        raise e


def download_file(url, local_file, show_progress=True):
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(local_file, 'wb') as fp:
            print('Download to', local_file)
            for chunk in r.iter_content(chunk_size=8192):
                if show_progress:
                    print(fp.tell(), end='\r')
                fp.write(chunk)


class Build:
    def __init__(self, language='sv'):
        self.language = language
        self.script_folder = os.path.dirname(__file__)
        self.project_folder = os.path.realpath(os.path.join(self.script_folder, '..'))
        self.build_folder = os.path.join(self.project_folder, 'build_data')
        self.dist_folder = os.path.join(self.project_folder, 'dist')
        self.movie_folder = os.path.join(self.build_folder, 'Movies')
        self.extract_folder = os.path.join(self.project_folder, 'cst_out_new')
        self.iso_folder = os.path.join(self.script_folder, '..', 'iso')
        if not os.path.exists(self.build_folder):
            os.mkdir(self.build_folder)

        if platform.system() == 'Windows':
            self.npm = 'npm.CMD'
            self.npx = 'npx.CMD'
        else:
            self.npm = 'npm'
            self.npx = 'npx'

    def drxtract(self, movie_file):
        drxtract_folder = os.path.join(self.build_folder, 'drxtract')
        if not os.path.exists(drxtract_folder):
            repo = Repo.clone_from('https://github.com/System25/drxtract.git', drxtract_folder)
            repo.git.checkout('be17978bb9dcf220f2c97c1b0f7a19022a95c001')
            
            # Patch drxtract to handle errors gracefully
            patch_script = os.path.join(self.script_folder, 'patch_drxtract.py')
            if os.path.exists(patch_script):
                print('Patching drxtract to handle RIFF errors gracefully...')
                try:
                    subprocess.run([sys.executable, patch_script, self.build_folder],
                                 capture_output=True, check=True)
                    print('✓ drxtract patched successfully')
                except subprocess.CalledProcessError as e:
                    print(f'Warning: Failed to patch drxtract: {e.stderr.decode() if e.stderr else str(e)}')

        movie_name = os.path.basename(movie_file)
        movie_dir = os.path.dirname(movie_file)
        extract_folder = os.path.join(movie_dir, 'drxtract', movie_name)
        os.makedirs(extract_folder, exist_ok=True)

        drxtract_run = subprocess.run([sys.executable, 'drxtract', 'pc', movie_file, extract_folder],
                                      cwd=drxtract_folder, capture_output=True)
        
        # Don't fail if drxtract had issues - check if we got SOMETHING
        if drxtract_run.returncode != 0:
            print(f'Warning: drxtract exited with code {drxtract_run.returncode}')
            print(f'stderr: {drxtract_run.stderr.decode() if drxtract_run.stderr else "(none)"}')
        
        # Check if we got at least some files
        if len(os.listdir(extract_folder)) == 0:
            print(f'Warning: No files extracted from {movie_file}')
            print(f'drxtract output: {drxtract_run.stderr.decode() if drxtract_run.stderr else "(none)"}')
            # Don't raise - caller will check for /bin directory
        
        return extract_folder

    def scores(self):
        files = glob.glob('%s/8*' % self.movie_folder)
        if not files:
            print('Warning: No movie files found for glob 8*, skipping scores')
            return

        for movie_file in files:
            extract_folder = self.drxtract(movie_file)
            
            # Check if extraction was successful (should have /bin subdirectory)
            bin_folder = os.path.join(extract_folder, 'bin')
            if not os.path.exists(bin_folder):
                print(f'Warning: {extract_folder} missing /bin directory, skipping score extraction')
                continue
            
            # Check if score.json was created by drxtract
            score_json = os.path.join(extract_folder, 'score.json')
            if not os.path.exists(score_json):
                print(f'Warning: {score_json} not created by drxtract, skipping')
                continue
            
            score_script = os.path.join(self.script_folder, 'score', 'score.py')

            try:
                subprocess.run([sys.executable, score_script, score_json],
                               capture_output=True).check_returncode()

            except subprocess.CalledProcessError as e:
                print('Warning: Score extraction failed, skipping:', e.stderr.decode('utf-8'))
                # Don't raise - scores are optional
                continue

        score_script2 = os.path.join(self.script_folder, 'score', 'build_score_manual.py')
        score_file = os.path.join(self.movie_folder, 'drxtract', '82.DXR', 'score_tracks_82.DXR.json')
        
        # Check if score file exists before trying to process it
        if not os.path.exists(score_file):
            print(f'Warning: Score file {score_file} not found, skipping manual score build')
            return
            
        try:
            subprocess.run([sys.executable, score_script2, score_file, '4', 'JustDoIt'],
                           capture_output=True).check_returncode()
            subprocess.run([sys.executable, score_script2, score_file, '5', 'JustDoIt'],
                           capture_output=True).check_returncode()
        except subprocess.CalledProcessError as e:
            print('Warning: Manual score build failed, skipping:', e.stderr.decode('utf-8'))
            # Don't raise - scores are optional

    def phaser(self):
        folder = os.path.join(self.build_folder, 'phaser-ce')
        if not os.path.exists(folder):
            Repo.clone_from('https://github.com/photonstorm/phaser-ce.git', folder, branch='v2.16.0',
                            single_branch=None)

        subprocess.run([self.npm, 'uninstall', 'fsevents'], cwd=folder).check_returncode()
        subprocess.run([self.npm, 'install'], cwd=folder).check_returncode()

        exclude = ['gamepad',
                   'bitmaptext',
                   'retrofont',
                   'rope',
                   'tilesprite',
                   'flexgrid',
                   'ninja',
                   'p2',
                   'tilemaps',
                   'particles',
                   'weapon',
                   'creature',
                   'video'
                   ]

        subprocess.run([
            self.npx,
            'grunt',
            'custom',
            '--exclude=' + ','.join(exclude),
            '--uglify',
            '--sourcemap'
        ], cwd=folder).check_returncode()

        shutil.copy(os.path.join(folder, 'dist', 'phaser.min.js'), self.dist_folder)
        shutil.copy(os.path.join(folder, 'dist', 'phaser.map'), self.dist_folder)

    def webpack(self, prod=False):
        if not prod:
            config = os.path.join(self.project_folder, 'webpack.dev.js')
        else:
            config = os.path.join(self.project_folder, 'webpack.prod.js')
        process = subprocess.run([self.npx, 'webpack-cli', '-c', config])
        process.check_returncode()

    def html(self):
        for folder in ['progress', 'info']:
            destination = os.path.join(self.dist_folder, folder)
            if not os.path.exists(destination):
                os.mkdir(destination)
            shutil.copytree(os.path.join(self.project_folder, folder), destination, dirs_exist_ok=True)
        shutil.copy(os.path.join(self.project_folder, 'src', 'index.html'), self.dist_folder)

    def css(self):
        try:
            import sass
        except ImportError:
            print('sass not found, skipping CSS build')
            return
        src_scss = os.path.join(self.project_folder, 'src', 'style.scss')
        dst_css = os.path.join(self.dist_folder, 'style.css')
        if os.path.exists(src_scss):
            with open(src_scss, 'r') as f:
                scss_content = f.read()
            css_content = sass.compile(string=scss_content)
            with open(dst_css, 'w') as f:
                f.write(css_content)
            print(f'Compiled {src_scss} -> {dst_css}')

    def copy_data(self):
        shutil.copytree(os.path.join(self.project_folder, 'data'), os.path.join(self.dist_folder, 'data'),
                        dirs_exist_ok=True)

    def rename(self):
        rename_script = os.path.join(self.script_folder, 'rename.py')
        subprocess.run([sys.executable, rename_script, self.extract_folder]).check_returncode()

    def download_game(self, show_progress=True):
        if self.language == 'no':
            url = 'https://archive.org/download/bygg-biler-med-mulle-mekk/Bygg%20biler%20med%20Mulle%20Mekk.iso'
        elif self.language == 'sv':
            url = 'https://archive.org/download/byggbilarmedmullemeck/byggbilarmedmullemeck.iso'
        elif self.language == 'da':
            url = 'https://archive.org/download/byg-bil-med-mulle-meck/Byg-bil-med-Mulle-Meck.iso'
        elif self.language == 'nl':
            url = 'https://archive.org/download/1.mielmonteurbouwtautosiso/1.Miel%20Monteur%20Bouwt%20Auto%27s%20ISO.iso'
        else:
            raise AttributeError('Invalid language')

        if not os.path.exists(self.iso_folder):
            os.mkdir(self.iso_folder)

        local_file = os.path.join(self.iso_folder, 'mullebil_%s.iso' % self.language)
        if os.path.exists(local_file):
            return local_file

        download_file(url, local_file, show_progress)
        return local_file

    def download_boats_game(self, show_progress=True):
        """Download the Mulle Meck Boats game ISO (Recht Door Zee / bygger båtar)"""
        if self.language == 'nl':
            url = 'https://archive.org/download/2.mielmonteurrechtdoorzee/2.Miel%20Monteur%20Recht%20Door%20Zee.iso'
        elif self.language == 'sv':
            url = 'https://archive.org/download/mullemeckbyggerbatar/MulleMeckByggerBatar.iso'
        else:
            # Default to Swedish if no boats version exists for the language
            print(f'Warning: No boats game for language {self.language}, using Swedish')
            url = 'https://archive.org/download/mullemeckbyggerbatar/MulleMeckByggerBatar.iso'

        if not os.path.exists(self.iso_folder):
            os.mkdir(self.iso_folder)

        local_file = os.path.join(self.iso_folder, 'mullebat_%s.iso' % self.language)
        if os.path.exists(local_file):
            return local_file

        download_file(url, local_file, show_progress)
        return local_file

    def download_plugin(self, extract=True):
        url = 'https://web.archive.org/web/20011006153539if_/http://www.levende.no:80/mulle/plugin.exe'
        local_file = os.path.join(self.iso_folder, 'plugin.exe')
        extract_dir = os.path.join(self.build_folder, 'Plugin')
        if not os.path.exists(local_file):
            download_file(url, local_file, False)
        if extract:
            os.makedirs(extract_dir, exist_ok=True)
            
            # plugin.exe is a self-extracting ZIP - try to extract it with Wine or 7z
            try:
                # Try with 7z first (most reliable for self-extracting archives)
                subprocess.run(['7z', 'x', '-o' + extract_dir, local_file, '-y'], 
                             check=True, capture_output=True)
                print(f'Successfully extracted {local_file} with 7z')
            except (subprocess.CalledProcessError, FileNotFoundError):
                try:
                    # Fallback: try as regular ZIP
                    with zipfile.ZipFile(local_file, 'r') as zip_ref:
                        zip_ref.extractall(extract_dir)
                    print(f'Successfully extracted {local_file} as ZIP')
                except zipfile.BadZipFile:
                    print(f'Warning: Could not extract {local_file} - tried 7z and zipfile')
                    return
            
            # Extract the Shockwave files
            dxr_file = os.path.join(extract_dir, '66.dxr')
            cst_file = os.path.join(extract_dir, 'Plugin.cst')
            
            if os.path.exists(dxr_file):
                ShockwaveExtractor.main(['-e', '-i', dxr_file])
            else:
                print(f'Warning: {dxr_file} not found after extraction')
                
            if os.path.exists(cst_file):
                ShockwaveExtractor.main(['-e', '-i', cst_file])
            else:
                print(f'Warning: {cst_file} not found after extraction')

    def extract_iso(self, extract_content=True):
        import pycdlib
        iso_path = self.download_game(False)

        iso = pycdlib.PyCdlib()
        iso.open(iso_path)

        if not os.path.exists(self.movie_folder):
            os.mkdir(self.movie_folder)

        # Ensure ShockwaveExtractor outputs to tools/cst_out_new
        original_cwd = os.getcwd()
        os.chdir(self.project_folder)

        try:
            children = iso.list_children(iso_path='/Movies')
            iso.get_record(iso_path='/Movies')
        except pycdlib.pycdlib.pycdlibexception.PyCdlibInvalidInput:
            children = iso.list_children(iso_path='/MOVIES')
            iso.get_record(iso_path='/MOVIES')

        for child in children:
            assert isinstance(child, pycdlib.pycdlib.dr.DirectoryRecord)
            if child is None or child.is_dot() or child.is_dotdot():
                continue

            file = iso.full_path_from_dirrecord(child)
            extracted_file = os.path.join(self.movie_folder, os.path.basename(file).upper())
            iso.get_file_from_iso(extracted_file, iso_path=file)
            if extract_content:
                try:
                    ShockwaveExtractor.main(['-e', '-i', extracted_file])
                except Exception as e:
                    print('%s: %s' % (file, str(e)))
                    continue

        # Extract DATA.CST (outside /MOVIES) if present
        data_iso_path = None
        for path in ['/DATA/DATA.CST', '/DATA/Data.cst', '/DATA/data.cst']:
            try:
                iso.get_record(iso_path=path)
                data_iso_path = path
                break
            except Exception:
                continue

        if data_iso_path:
            extracted_file = os.path.join(self.movie_folder, os.path.basename(data_iso_path).upper())
            iso.get_file_from_iso(extracted_file, iso_path=data_iso_path)
            if extract_content:
                try:
                    ShockwaveExtractor.main(['-e', '-i', extracted_file])
                except Exception as e:
                    print('%s: %s' % (data_iso_path, str(e)))

        if self.language != 'sv':
            self.rename()

        os.chdir(original_cwd)

    def extract_boats_iso(self, extract_content=True):
        """
        Extract the boats game ISO (Mulle Meck bygger båtar / Recht Door Zee).
        Assets are extracted with 'boten_' prefix to keep them separate from car assets.
        """
        import pycdlib
        
        iso_path = self.download_boats_game(False)
        boats_movie_folder = os.path.join(self.build_folder, 'BoatsMovies')
        
        if not os.path.exists(boats_movie_folder):
            os.mkdir(boats_movie_folder)

        # The boats ISO may have a different structure - try multiple paths
        iso = pycdlib.PyCdlib()
        iso.open(iso_path)
        
        # Try different possible paths for the movies folder
        movies_path = None
        for path in ['/MOVIES', '/Movies', '/movies']:
            try:
                iso.get_record(iso_path=path)
                movies_path = path
                break
            except:
                continue
        
        if movies_path is None:
            # ISO might be in a different format - try extracting with 7z
            print(f'Could not find MOVIES folder in ISO, trying 7z extraction...')
            extract_dir = os.path.join(self.build_folder, 'boats_iso_extract')
            os.makedirs(extract_dir, exist_ok=True)
            
            try:
                subprocess.run(['7z', 'x', '-o' + extract_dir, iso_path, '-y'],
                             check=True, capture_output=True)
                print(f'Successfully extracted boats ISO with 7z')
                
                # Find the MOVIES folder in the extracted content
                for root, dirs, files in os.walk(extract_dir):
                    if 'MOVIES' in dirs or 'Movies' in dirs:
                        movies_dir = os.path.join(root, 'MOVIES' if 'MOVIES' in dirs else 'Movies')
                        # Copy all files to boats_movie_folder
                        for f in os.listdir(movies_dir):
                            src = os.path.join(movies_dir, f)
                            dst = os.path.join(boats_movie_folder, f.upper())
                            if os.path.isfile(src):
                                shutil.copy(src, dst)
                        break

                # Also copy Data.cst if present
                for root, dirs, files in os.walk(extract_dir):
                    for f in files:
                        if f.lower() == 'data.cst':
                            src = os.path.join(root, f)
                            dst = os.path.join(boats_movie_folder, f.upper())
                            if os.path.isfile(src):
                                shutil.copy(src, dst)
                            break
            except (subprocess.CalledProcessError, FileNotFoundError) as e:
                print(f'Error extracting boats ISO: {e}')
                return
        else:
            # Extract from ISO directly using pycdlib
            children = iso.list_children(iso_path=movies_path)
            
            for child in children:
                if child is None or child.is_dot() or child.is_dotdot():
                    continue

                file = iso.full_path_from_dirrecord(child)
                extracted_file = os.path.join(boats_movie_folder, os.path.basename(file).upper())
                iso.get_file_from_iso(extracted_file, iso_path=file)

            # Extract Data.cst if present (outside /MOVIES)
            data_iso_path = None
            for path in ['/DATA/DATA.CST', '/DATA/Data.cst', '/DATA/data.cst']:
                try:
                    iso.get_record(iso_path=path)
                    data_iso_path = path
                    break
                except Exception:
                    continue
            if data_iso_path:
                extracted_file = os.path.join(boats_movie_folder, os.path.basename(data_iso_path).upper())
                iso.get_file_from_iso(extracted_file, iso_path=data_iso_path)

        iso.close()
        
        print(f'Boats movie files extracted to: {boats_movie_folder}')
        print(f'Files found: {os.listdir(boats_movie_folder)}')

        # Now extract Shockwave content from each DXR/CXT file
        # The ShockwaveExtractor will put output in cst_out_new/{FILENAME}
        # We rename the files to have boten_ prefix so they don't conflict
        if extract_content:
            # Save current directory
            original_cwd = os.getcwd()
            print(f'Original cwd: {original_cwd}')
            print(f'Project folder: {self.project_folder}')
            print(f'Extract folder: {self.extract_folder}')
            os.chdir(self.project_folder)
            print(f'Changed to: {os.getcwd()}')
            
            for movie_file in sorted(os.listdir(boats_movie_folder)):
                movie_path = os.path.join(boats_movie_folder, movie_file)
                if not os.path.isfile(movie_path):
                    continue
                
                # Skip non-Director files
                ext = os.path.splitext(movie_file)[1].lower()
                if ext not in ['.dxr', '.cxt', '.cst']:
                    print(f'Skipping non-Director file: {movie_file}')
                    continue
                
                # Create a renamed copy with boten_ prefix for extraction
                boten_name = 'boten_' + movie_file
                boten_path = os.path.join(boats_movie_folder, boten_name)
                
                # Copy with new name (ShockwaveExtractor uses filename for output folder)
                if not os.path.exists(boten_path):
                    shutil.copy(movie_path, boten_path)
                
                try:
                    print(f'Extracting boats asset: {boten_name} from {boten_path}')
                    print(f'File exists: {os.path.exists(boten_path)}, size: {os.path.getsize(boten_path) if os.path.exists(boten_path) else 0}')
                    ShockwaveExtractor.main(['-e', '-i', boten_path])
                    print(f'Extraction complete, cst_out_new contents: {os.listdir(self.extract_folder) if os.path.exists(self.extract_folder) else "does not exist"}')
                except Exception as e:
                    import traceback
                    print(f'Warning: Could not extract {boten_name}: {e}')
                    traceback.print_exc()
                    continue
            
            os.chdir(original_cwd)

        # List what was extracted
        boten_folders = [f for f in os.listdir(self.extract_folder) if f.startswith('boten_')]
        print(f'Boats assets extracted to cst_out_new/: {boten_folders}')

    def copy_images(self):
        plugin_parts = [22, 25, 29, 33, 36, 39, 43]
        plugin_standalone = os.path.join(self.extract_folder, 'PLUGIN.CST', 'Standalone')
        
        # Only copy plugin images if they exist
        if os.path.exists(plugin_standalone):
            for part in plugin_parts:
                part_file = os.path.join(plugin_standalone, '%s.png' % part)
                if not os.path.exists(part_file):
                    print(f'Warning: Plugin image {part}.png not found, skipping')
                    continue
                info_img_path = os.path.join(self.dist_folder, 'info', 'img')
                if not os.path.exists(info_img_path):
                    os.mkdir(info_img_path)
                output_file = os.path.join(info_img_path, '%s.png' % part)
                shutil.copy(part_file, output_file)
        else:
            print('Warning: PLUGIN.CST/Standalone not found, skipping plugin images')

        cursors = {
            109: 'default',
            110: 'grab',
            111: 'left',
            112: 'point',
            113: 'back',
            114: 'right',
            115: 'drag_left',
            116: 'drag_right',
            117: 'drag_forward'
        }

        ui_folder = os.path.join(self.dist_folder, 'ui')
        if not os.path.exists(ui_folder):
            os.makedirs(ui_folder, exist_ok=True)

        for number, name in cursors.items():
            part_file = os.path.join(self.extract_folder, '00.CXT', 'Standalone', '%d.png' % number)
            output_file = os.path.join(ui_folder, '%s.png' % name)
            shutil.copy(part_file, output_file)

        # Copy loading image - find correct cast member for the configured language
        # SV ISO: member 122 in 00.CXT, NL ISO: member 452 in 00.CXT
        output_file = os.path.join(self.dist_folder, 'loading.png')
        cxt_dir = os.path.join(self.extract_folder, '00.CXT', 'Standalone')
        loading_file = None
        for member_id in ['122', '452']:
            candidate = os.path.join(cxt_dir, f'{member_id}.bmp')
            if os.path.exists(candidate):
                from PIL import Image as PILImage
                with PILImage.open(candidate) as img:
                    if img.size == (235, 189):
                        loading_file = candidate
                        break
        if loading_file:
            convert_image(loading_file, output_file=output_file)
        else:
            print('Warning: loading image not found in 00.CXT, using fallback')
            # Search all PNGs in 00.CXT for the right dimensions
            for f in sorted(os.listdir(cxt_dir)):
                if f.endswith('.png'):
                    from PIL import Image as PILImage
                    with PILImage.open(os.path.join(cxt_dir, f)) as img:
                        if img.size == (235, 189):
                            shutil.copy(os.path.join(cxt_dir, f), output_file)
                            break

    def topography(self):
        source = os.path.join(self.extract_folder, 'CDDATA.CXT', 'Standalone')
        topography_dir = os.path.join(self.dist_folder, 'assets', 'topography')
        if not os.path.exists(topography_dir):
            os.makedirs(topography_dir, exist_ok=True)

        build_topography(source, topography_dir)

        try:
            subprocess.run(['node', os.path.join(self.script_folder, 'topography.js'), topography_dir],
                           capture_output=True).check_returncode()
        except subprocess.CalledProcessError as e:
            print(e.stderr.decode('utf-8'))
            raise e

    def assets(self, optipng=0):
        subprocess.run([sys.executable, os.path.join(self.project_folder, 'assets.py'), str(optipng)],
                       cwd=self.project_folder).check_returncode()


if __name__ == '__main__':
    if len(sys.argv) > 1 and len(sys.argv[1]) == 2:
        build = Build(sys.argv[1])
    else:
        build = Build()

    if 'build-prod' in sys.argv:
        sys.argv = ['webpack-prod', 'phaser', 'download', 'scores', 'html_css', 'data', 'topography', 'assets-prod']

    if 'build' in sys.argv:
        sys.argv = ['webpack-dev', 'phaser', 'download', 'scores', 'html_css', 'data', 'topography', 'assets']

    if 'webpack-dev' in sys.argv:
        build.webpack()
    elif 'webpack-prod' in sys.argv:
        build.webpack(True)

    if 'download-only' in sys.argv:
        build.download_game(False)
        build.download_plugin(False)

    if 'download' in sys.argv:
        build.extract_iso()
        build.download_plugin()

    if 'download-boats' in sys.argv:
        build.extract_boats_iso()

    if 'download-boats-only' in sys.argv:
        build.download_boats_game(False)

    if 'phaser' in sys.argv:
        build.phaser()

    if 'assets' in sys.argv:
        build.assets()

    if 'scores' in sys.argv:
        build.scores()

    if 'html_css' in sys.argv:
        build.html()
        build.css()

    if 'ui-images' in sys.argv:
        build.copy_images()

    if 'data' in sys.argv:
        build.copy_images()
        build.copy_data()

    if 'topography' in sys.argv:
        build.topography()

    if 'assets-prod' in sys.argv:
        build.assets(7)
