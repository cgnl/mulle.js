import os
import sys

from PIL import Image


def _get_pixel_data(image):
    """Get pixel data from image, using modern API if available."""
    if hasattr(image, 'get_flattened_data'):
        return list(image.get_flattened_data())
    else:
        # Fallback for older Pillow versions
        return list(image.getdata())  # noqa: PIL deprecated


def bleed_transparent_edges(rgba_image, transparent_mask):
    """
    Fill transparent pixels with colors from nearest opaque neighbors.
    
    This prevents black fringing when WebGL renders sprites with bilinear filtering.
    Transparent pixels that have black RGB (0,0,0,0) will bleed through when filtered
    with adjacent opaque pixels, causing dark edges around sprites.
    
    Args:
        rgba_image: PIL RGBA image
        transparent_mask: List of booleans, True for transparent pixels
    
    Returns:
        List of RGBA tuples with edge-bled colors
    """
    width, height = rgba_image.size
    pixels = _get_pixel_data(rgba_image)
    result = list(pixels)  # Copy original
    
    # Simple edge bleeding: for each transparent pixel, find nearest opaque neighbor
    # We do multiple passes to propagate colors inward
    max_passes = 8  # Usually enough for most sprites
    
    for _ in range(max_passes):
        changed = False
        new_result = list(result)
        
        for y in range(height):
            for x in range(width):
                idx = y * width + x
                
                # Skip if already opaque or already has color
                if not transparent_mask[idx]:
                    continue
                if result[idx][3] > 0:  # Already has some alpha (from previous pass)
                    continue
                if result[idx][0] != 0 or result[idx][1] != 0 or result[idx][2] != 0:
                    continue  # Already has RGB color
                
                # Look at 4-connected neighbors
                neighbors = []
                if x > 0:
                    neighbors.append(result[idx - 1])
                if x < width - 1:
                    neighbors.append(result[idx + 1])
                if y > 0:
                    neighbors.append(result[idx - width])
                if y < height - 1:
                    neighbors.append(result[idx + width])
                
                # Find a neighbor with color (either opaque or already bled)
                for n in neighbors:
                    if n[0] != 0 or n[1] != 0 or n[2] != 0:
                        # Use this neighbor's RGB but keep alpha=0
                        new_result[idx] = (n[0], n[1], n[2], 0)
                        changed = True
                        break
        
        result = new_result
        if not changed:
            break
    
    return result


def convert_image(file, transparent=True, output_folder=None, output_file=None, transparent_color=None, transparent_index_0=False):
    """
    Convert a BMP image to PNG with optional transparency.
    
    Director/Shockwave games use palette index 255 as a special "background transparent"
    marker. This is distinct from index 0 (typically black) which is used for actual
    black pixels in the artwork (like outlines and borders).
    
    The ShockwaveParser extracts 8-bit palette images with only 255 palette entries
    (indices 0-254). Index 255 is intentionally undefined - when PIL encounters it,
    it defaults to black (0,0,0). This function detects index 255 pixels BEFORE
    conversion to RGBA and makes them transparent, preserving actual black artwork.
    
    Some sprites also use palette index 0 as transparent (in addition to index 255).
    Use transparent_index_0=True for these cases.
    
    IMPORTANT: Transparent pixels are filled with colors from nearest opaque neighbors
    to prevent black fringing when WebGL renders with bilinear filtering.
    
    Args:
        file: Path to input BMP file
        transparent: If True, make background pixels transparent
        output_folder: Optional output folder path
        output_file: Optional output file path
        transparent_color: DEPRECATED - kept for backwards compatibility but ignored.
                          Transparency is now based on palette index 255, not color.
        transparent_index_0: If True, also treat palette index 0 as transparent.
    """
    filename, extension = os.path.splitext(file)
    im = Image.open(file)
    if not output_file:
        if not output_folder:
            output_file = filename + '.png'
        else:
            file = os.path.basename(filename) + '.png'
            output_file = os.path.join(output_folder, file)

    if transparent:
        # For palette-based images (mode 'P'), use index-based transparency
        # Index 255 is the Director/Shockwave "background transparent" marker
        if im.mode == 'P':
            # Get raw palette indices before conversion
            raw_indices = _get_pixel_data(im)
            
            # Convert to RGBA
            rgba = im.convert("RGBA")
            rgba_pixels = _get_pixel_data(rgba)
            
            # Create mask of which pixels should be transparent
            transparent_mask = []
            for raw_idx in raw_indices:
                is_trans = raw_idx == 255 or (transparent_index_0 and raw_idx == 0)
                transparent_mask.append(is_trans)
            
            # First pass: mark transparent pixels (temporarily with black)
            data_temp = []
            for is_trans, rgba_val in zip(transparent_mask, rgba_pixels):
                if is_trans:
                    data_temp.append((0, 0, 0, 0))
                else:
                    data_temp.append(rgba_val)
            
            rgba.putdata(data_temp)
            
            # Second pass: bleed opaque colors into transparent edges
            # This prevents black fringing with bilinear filtering in WebGL
            data_bled = bleed_transparent_edges(rgba, transparent_mask)
            
            rgba.putdata(data_bled)
            rgba.save(output_file)
        else:
            # For non-palette images (RGB, RGBA, etc.), just convert and save
            # No color-based transparency - those images don't have the index 255 marker
            rgba = im.convert("RGBA")
            rgba.save(output_file)
    else:
        im.getpixel((1, 1))
        colors = list(im.palette.colors.keys())
        palette = []

        for color in colors:
            r, g, b = color
            palette += [r, g, b]
            pass
        palette += [255, 255, 255]
        im.putpalette(palette)
        im.save(output_file)
    return output_file


if __name__ == '__main__':
    convert_image(sys.argv[1], False)
