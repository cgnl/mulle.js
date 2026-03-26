"""
Tests for convert_image.py - Image conversion with transparency handling.

These tests verify that:
1. Palette index 255 becomes transparent (Director's background marker)
2. Palette index 0 (black) remains opaque for outlines
3. Transparent pixels have neighbor colors (edge bleeding) to prevent black fringing
"""

import os
import sys
import tempfile
import pytest
from PIL import Image

# Add build_scripts to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'build_scripts'))
from convert_image import convert_image, bleed_transparent_edges, _get_pixel_data


class TestTransparentPixelEdgeBleeding:
    """Test that transparent pixels get neighbor colors to prevent WebGL fringing."""
    
    def test_transparent_pixels_not_all_black(self):
        """Transparent pixels adjacent to colored pixels should not have black RGB.
        
        When WebGL renders sprites with bilinear filtering, transparent pixels
        with black RGB (0,0,0,0) will bleed through and create dark edges.
        The edge bleeding algorithm should fill these with neighbor colors.
        """
        # Create a test image: colored center with transparent border
        img = Image.new('P', (10, 10))
        
        # Create a simple palette: index 0 = black, index 100 = red, index 255 = transparent marker
        palette = [0] * 768  # 256 * 3
        palette[0:3] = [0, 0, 0]        # Index 0: black
        palette[300:303] = [255, 0, 0]  # Index 100: red
        palette[765:768] = [0, 0, 0]    # Index 255: undefined (will be transparent)
        img.putpalette(palette)
        
        # Fill image: transparent border (255), red center (100)
        pixels = []
        for y in range(10):
            for x in range(10):
                if 2 <= x <= 7 and 2 <= y <= 7:
                    pixels.append(100)  # Red center
                else:
                    pixels.append(255)  # Transparent border
        img.putdata(pixels)
        
        # Save and convert
        with tempfile.NamedTemporaryFile(suffix='.bmp', delete=False) as f:
            img.save(f.name)
            
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as out:
                convert_image(f.name, transparent=True, output_file=out.name)
                
                # Load result and check
                result = Image.open(out.name)
                result_pixels = _get_pixel_data(result)
                
                # Count transparent pixels with black RGB vs colored RGB
                trans_black = 0
                trans_colored = 0
                
                for p in result_pixels:
                    if p[3] == 0:  # Transparent
                        if p[0] == 0 and p[1] == 0 and p[2] == 0:
                            trans_black += 1
                        else:
                            trans_colored += 1
                
                # Edge pixels (adjacent to red center) should have red RGB
                # Only far corners might still be black
                assert trans_colored > 0, "Some transparent pixels should have bled colors"
                
                # Check specific edge pixel (should have red color from neighbor)
                # Pixel at (1, 5) is transparent but adjacent to red at (2, 5)
                edge_pixel = result.getpixel((1, 5))
                assert edge_pixel[3] == 0, "Edge pixel should be transparent"
                assert edge_pixel[0] == 255 and edge_pixel[1] == 0 and edge_pixel[2] == 0, \
                    f"Edge pixel should have red RGB from neighbor, got {edge_pixel}"
                
                # Cleanup
                os.unlink(out.name)
            os.unlink(f.name)
    
    def test_index_0_black_remains_opaque(self):
        """Palette index 0 (black) should remain opaque - used for outlines."""
        # Create test image with black pixels (index 0)
        img = Image.new('P', (5, 5))
        
        palette = [0] * 768
        palette[0:3] = [0, 0, 0]        # Index 0: black (outline color)
        palette[300:303] = [255, 0, 0]  # Index 100: red
        img.putpalette(palette)
        
        # Black border, red center
        pixels = []
        for y in range(5):
            for x in range(5):
                if x == 0 or x == 4 or y == 0 or y == 4:
                    pixels.append(0)    # Black border (should stay opaque!)
                else:
                    pixels.append(100)  # Red center
        img.putdata(pixels)
        
        with tempfile.NamedTemporaryFile(suffix='.bmp', delete=False) as f:
            img.save(f.name)
            
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as out:
                convert_image(f.name, transparent=True, output_file=out.name)
                
                result = Image.open(out.name)
                
                # Check that black border pixels are OPAQUE
                corner = result.getpixel((0, 0))
                assert corner[3] == 255, f"Black (index 0) should be opaque, got alpha={corner[3]}"
                assert corner[0] == 0 and corner[1] == 0 and corner[2] == 0, \
                    f"Black should remain black, got {corner}"
                
                os.unlink(out.name)
            os.unlink(f.name)
    
    def test_index_255_becomes_transparent(self):
        """Palette index 255 should become transparent (Director's background marker)."""
        img = Image.new('P', (5, 5))
        
        palette = [0] * 768
        palette[300:303] = [255, 0, 0]  # Index 100: red
        # Index 255 is undefined in 255-entry palette
        img.putpalette(palette[:765])  # Only 255 entries
        
        # All pixels use index 255 (transparent marker)
        pixels = [255] * 25
        pixels[12] = 100  # One red pixel in center
        img.putdata(pixels)
        
        with tempfile.NamedTemporaryFile(suffix='.bmp', delete=False) as f:
            img.save(f.name)
            
            with tempfile.NamedTemporaryFile(suffix='.png', delete=False) as out:
                convert_image(f.name, transparent=True, output_file=out.name)
                
                result = Image.open(out.name)
                
                # Center should be opaque red
                center = result.getpixel((2, 2))
                assert center[3] == 255, "Center pixel should be opaque"
                
                # Corner should be transparent
                corner = result.getpixel((0, 0))
                assert corner[3] == 0, "Index 255 pixel should be transparent"
                
                os.unlink(out.name)
            os.unlink(f.name)


class TestBleedTransparentEdges:
    """Test the edge bleeding algorithm directly."""
    
    def test_single_pass_bleeding(self):
        """Adjacent transparent pixels should get color from opaque neighbor."""
        # Create simple 3x3 RGBA image: red center, transparent edges
        img = Image.new('RGBA', (3, 3))
        pixels = [
            (0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0),
            (0, 0, 0, 0), (255, 0, 0, 255), (0, 0, 0, 0),
            (0, 0, 0, 0), (0, 0, 0, 0), (0, 0, 0, 0),
        ]
        img.putdata(pixels)
        
        # Mask: all transparent except center
        mask = [True] * 9
        mask[4] = False  # Center is opaque
        
        result = bleed_transparent_edges(img, mask)
        
        # Adjacent pixels (top, bottom, left, right of center) should have red RGB
        # Top of center (index 1)
        assert result[1][0] == 255 and result[1][1] == 0 and result[1][2] == 0, \
            f"Top pixel should be red, got {result[1]}"
        assert result[1][3] == 0, "Top pixel should still be transparent"
        
        # Left of center (index 3)
        assert result[3][0] == 255, f"Left pixel should have red R, got {result[3]}"
    
    def test_multi_pass_bleeding(self):
        """Colors should propagate multiple pixels from edge."""
        # Create 5x1 image: red at left, rest transparent
        img = Image.new('RGBA', (5, 1))
        pixels = [
            (255, 0, 0, 255),  # Red, opaque
            (0, 0, 0, 0),      # Transparent
            (0, 0, 0, 0),      # Transparent  
            (0, 0, 0, 0),      # Transparent
            (0, 0, 0, 0),      # Transparent
        ]
        img.putdata(pixels)
        
        mask = [False, True, True, True, True]
        
        result = bleed_transparent_edges(img, mask)
        
        # All pixels should now have red RGB (propagated from left)
        for i in range(5):
            assert result[i][0] == 255, f"Pixel {i} should have red R component"


if __name__ == '__main__':
    pytest.main([__file__, '-v'])
