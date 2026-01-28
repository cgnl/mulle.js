import os


def parse_palette(file):
    length = os.path.getsize(file)
    with open(file, 'rb') as fp:
        fp.seek(24)
        colors = []
        palette = []
        palette_index = {}
        component_colors = []
        key = 0
        while fp.tell() < length:
            data = fp.read(3)
            components = []
            for byte in range(0, 3):
                components.append(data[byte])
                palette.append(data[byte])
            component_colors.append(components)
            palette_index[data[0]] = key

            colors.append(int.from_bytes(data, "big"))
            fp.read(1)
            key += 1
    return [palette, palette_index, colors, component_colors]
