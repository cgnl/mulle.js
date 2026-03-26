data = {
    '00.CXT': {  # UI
        'file': '00.CXT',
        'folder': 'Standalone',
        'range_sv': {
            'sounds': [416, 421],
            'sounds2': [433, 461],
            'engine_sounds': [485, 493],
            'menu': 84,
            'loading': [122, 123],
            'menu_sound': [469, 474],
        },
        'range_no': {
            'sounds': [380, 385],
            'sounds2': [393, 421],
            'engine_sounds': [429, 437],
            'menu': 451,
            'loading': [452, 453],
            'menu_sound': [454, 459],
        },
        'opaque': [[64, 76], [81, 86]],  # Identical for both languages
        'opaque_no': [451, 452, 453],
        'opaque_sv': [84, 122, 123],
        'identical': [[3, 119], [129, 371]],
    },
    '02.DXR': {  # Junk yard
        'file': '02.DXR',
        'folder': 'Internal',
        'range_sv': {
            'voices': [123, 137],
            'arrows': [162, 185],
            'mulle_body': [209, 210],
            'mulle_head': [226, 263],
            'clank': 122,
        },
        'range_no': {
            'voices': [200, 214],
            'arrows': [110, 133],
            'mulle_body': [141, 142],
            'mulle_head': [150, 187],
            'clank': 101,
        },
        'identical': [[25, 26], [66, 96]],  # Doors and junk pile
        'opaque': [[66, 72]],
    },
    '03.DXR': {  # Garage
        'file': '03.DXR',
        'folder': 'Internal',
        'range_sv': {'voices': [262, 264]},
        'range_no': {'voices': [259, 261]},
        'identical': [[28, 258]],
        'opaque': [33, 100, 101],
    },
    '04.DXR': {
        'file': '04.DXR',
        'folder': 'Internal',
        'range_sv': {
            'background': 37,
            'mulle_ground': [121, 134],
            'crash_sound': [312, 314],
            'speech': [261, 282],
            'package_label': 47,
        },
        'range_no': {
            'background': 145,
            'mulle_ground': [81, 94],
            'crash_sound': [105, 107],
            'speech': [117, 138],
            'package_label': 146,
        },
        'identical': [
            [13, 30],
            [40, 53],  # Mailbox
            61,
            62,
            71,
            95,
            99,  # Animations
        ],
        'opaque': [16, 30],
        'opaque_sv': [37, 47],
        'opaque_no': [145, 146],
    },
    '05.DXR': {'folder': 'Internal', 'opaque': [25, 26, 53, 54, 57]},
    '06.DXR': {  # Load/save car
        'file': '06.DXR',
        'folder': 'Internal',
        'identical': [[13, 164]],
        'opaque': [93, 101, [155, 158], 160],
    },
    '08.DXR': {  # Diploma
        'file': '08.DXR',
        'folder': 'Internal',
        'range_sv': {'text': 69},
        'range_no': {'text': 87},
        'identical': [[15, 71], [81, 96]],
        'opaque': [31, 39, 40, 66, 70, 71],
    },
    '10.DXR': {
        'folder': 'Internal',
        'opaque': [1, 2, 5, 12, 13, 92, 93, 94, 95, 96, 173, 174, 188],
    },
    '13.DXR': {
        'folder': 'Internal',
        'identical': [17, 29, 32],
        'opaque': [32],
    },
    '18.DXR': {'folder': 'Internal', 'opaque': [8, 12, 13]},
    '66.DXR': {
        'folder': 'Internal',
        'opaque': [25, 61],
        'identical': [
            25,
            27,
            [33, 37],
            [38, 42],
            45,
            [51, 56],
            [57, 59],
            [68, 78],
            [81, 94],
            [97, 115],
        ],
    },
    '82.DXR': {  # Mudcar
        'folder': 'Internal',
        'identical': [
            1,
            [17, 19],
            [25, 39],
            [41, 44],
            [49, 57],
            83,
            173,
            174,
            [200, 202],
        ],
        'opaque': [1, 18, 19],
    },
    '83.DXR': {  # Tree
        'folder': 'Internal',
        'opaque': [1, 13, 14, [93, 97], 113],
        'identical': [
            2,
            3,
            [13, 15],
            [21, 28],
            [33, 38],
            [45, 91],
            [93, 97],
            99,
            113,
            [181, 183],
            200,
        ],
        'range_se': {
            'sound006': 205,  # 006
            'sound007': 206,  # 007
            'sound008': 207,  # 008
            'sound009': 202,  # 009
        },
        'range_no': {
            'sound006': 201,
            'sound007': 202,
            'sound008': 203,  # 008
            'sound009': 204,  # 009
        },
    },
    '84.DXR': {  # RoadThing
        'folder': 'Internal',
        'opaque': [25],
        'identical': [18, 25],
        'range_no': {'sound': 200},
        'range_sv': {'sound': 201},
    },
    '85.DXR': {  # RoadDog
        'folder': 'Internal',
        'opaque': [25],
        'identical': [[25, 31], 34, 190, [200, 201]],
    },
    '86.DXR': {
        'folder': 'Internal',
        'opaque': [1],
        'identical': [1, 3, 21, [29, 58], 61, [181, 185], [200, 206]],
    },
    '87.DXR': {'folder': 'Internal', 'opaque': [[15, 19], 208]},
    '88.DXR': {
        'folder': 'Internal',
        'opaque': [32, [33, 38], [40, 46], 92, 93, 96, 97, 100, 101],
    },
    '90.DXR': {'folder': 'Internal', 'opaque': [1, 18, 19]},
    '91.DXR': {'folder': 'Internal', 'opaque': [1]},
    '92.DXR': {
        'folder': 'Internal',
        'opaque': [1],
        'range_no': {
            'can': 7,
            'background': 203,
            'neighbor': [12, 23],
            'dog': [36, 40],
            'audio1': [177, 178],
            'audio2': [195, 201],
            'dogAnimChart': 33,
        },
        'range_sv': {
            'can': 11,
            'background': 1,
            'neighbor': [16, 27],
            'dog': [40, 44],
            'audio1': [181, 182],
            'audio2': [199, 205],
            'dogAnimChart': 37,
        },
    },
    '93.DXR': {
        'folder': 'Internal',
        'opaque': [1],
    },
    '94.DXR': {'folder': 'Internal', 'opaque': [200]},
    'CDDATA.CXT': {'folder': 'Standalone', 'opaque': [[629, 658]]},
    'PLUGIN.CST': {'folder': 'Standalone', 'opaque': [18]},
    '89.DXR': {  # Viola
        'file': '89.DXR',
        'folder': 'Internal',
        'range_sv': {
            'background': 1,
            'animation': [18, 20],
            'audio': [177, 177, 200, 202]
        },
        'opaque': [1],
        'identical': [[1, 1], [18, 20], [177, 177], [200, 202]],
    },
    # =============================================================================
    # BOTEN (Recht Door Zee / Boat Game) DXR FILES
    # =============================================================================
    # NOTE: For boat game assets, index 255 is the transparent "sky/background" marker
    # Index 0 is BLACK and should remain OPAQUE (used for outlines and borders)
    # Only use 'opaque' for full-screen backgrounds that have no transparency
    
    'boten_00.CXT': {  # Shared boat assets (sky, radio dialogs, weather)
        'file': 'boten_00.CXT',
        'folder': 'Standalone',
        # Sky sprites (00b011v0 - 00b014v0) for weather types 1-4
        # These have transparent areas for layering
    },
    'boten_01.DXR': {  # Intro - Christina Colombus scene
        'file': 'boten_01.DXR',
        'folder': 'Internal',
        'opaque': [1],  # 01b001v1 - full background 640x480
    },
    'boten_02.DXR': {  # Boat junk yard (parts storage)
        'file': 'boten_02.DXR',
        'folder': 'Internal',
        'opaque': [1],  # 02b001v1 - full background 640x480
    },
    'boten_03.DXR': {  # Menu scene
        'file': 'boten_03.DXR',
        'folder': 'Internal',
        'opaque': [1],  # 03b001v1 - full background 640x480
    },
    'boten_04.DXR': {  # Boatyard (scheepswerf) - main boat building
        'file': 'boten_04.DXR',
        'folder': 'Internal',
        # Member 1 (04b001v0) has transparent sky area (index 255)
        # Index 0 is BLACK outlines - must remain OPAQUE
        # No special flags needed - default behavior is correct
    },
    'boten_05.DXR': {  # Boat building interface
        'file': 'boten_05.DXR',
        'folder': 'Internal',
        # Member 1 is text (type 3), not an image
    },
    'boten_08.DXR': {  # Boat diploma
        'file': 'boten_08.DXR',
        'folder': 'Internal',
    },
    'boten_12.DXR': {  # Intro movie (Miel arrives)
        'file': 'boten_12.DXR',
        'folder': 'Internal',
        # 24-bit RGB bitmaps - no palette transparency
    },
    'boten_15.DXR': {  # Boat blueprints
        'file': 'boten_15.DXR',
        'folder': 'Internal',
        # Full-screen 640x480 backgrounds
        'opaque': [53, 60, 61, 62],
    },
    'boten_BLS.CXT': {  # Blueprint sprites (no full-screen backgrounds)
        'file': 'boten_BLS.CXT',
        'folder': 'Standalone',
    },
    'boten_BMS.CXT': {  # Blueprint mask sprites (no full-screen backgrounds)
        'file': 'boten_BMS.CXT',
        'folder': 'Standalone',
    },
    'boten_BSS.CXT': {  # Blueprint shadow sprites (no full-screen backgrounds)
        'file': 'boten_BSS.CXT',
        'folder': 'Standalone',
    },
    'boten_SAIL.CXT': {  # Sail sprites (no full-screen backgrounds)
        'file': 'boten_SAIL.CXT',
        'folder': 'Standalone',
    },
    'boten_70.DXR': {  # Erson tutorial island (Smokkeleiland)
        'file': 'boten_70.DXR',
        'folder': 'Internal',
        # Background members found via metadata scan
    },
    'boten_71.DXR': {  # Harbor tutorial
        'file': 'boten_71.DXR',
        'folder': 'Internal',
    },
    'boten_76.DXR': {  # Showboat scene
        'file': 'boten_76.DXR',
        'folder': 'Internal',
    },
    'boten_77.DXR': {  # Birgit's beach with dogs
        'file': 'boten_77.DXR',
        'folder': 'Internal',
        'opaque': [18, 19, 20],  # 77b001v1, 77b002v0, 77b006v0 - all 640x480 backgrounds
    },
    'boten_78.DXR': {  # Preacher's church island
        'file': 'boten_78.DXR',
        'folder': 'Internal',
    },
    'boten_79.DXR': {  # Fisherman scene
        'file': 'boten_79.DXR',
        'folder': 'Internal',
    },
    'boten_80.DXR': {  # Sea world map (main sailing)
        'file': 'boten_80.DXR',
        'folder': 'Internal',
        'opaque': [17, 22, 23],  # 80b001v1, 80b002v0, 80b003v0 - sea/map backgrounds
    },
    'boten_81.DXR': {  # Sur's surf beach
        'file': 'boten_81.DXR',
        'folder': 'Internal',
    },
    'boten_83.DXR': {  # Mia's island
        'file': 'boten_83.DXR',
        'folder': 'Internal',
    },
    'boten_84.DXR': {  # George's farm / Viola boat version
        'file': 'boten_84.DXR',
        'folder': 'Internal',
        'opaque': [8, 12],  # 84b001v1, 84b002v0 - 640x480 backgrounds
    },
    'boten_85.DXR': {  # Water pump/fountain
        'file': 'boten_85.DXR',
        'folder': 'Internal',
    },
    'boten_86.DXR': {  # Sven's cave with bat
        'file': 'boten_86.DXR',
        'folder': 'Internal',
    },
    'boten_87.DXR': {  # Underwater diving spot
        'file': 'boten_87.DXR',
        'folder': 'Internal',
    },
    'boten_88.DXR': {  # Whale watching
        'file': 'boten_88.DXR',
        'folder': 'Internal',
    },
    'boten_CDDATA.CXT': {  # Boat parts database (images + audio)
        'file': 'boten_CDDATA.CXT',
        'folder': 'Standalone',
        # Parts sprites - transparent backgrounds
    },
    'boten_SHOWBOAT.DXR': {  # Boat showcase/exhibition
        'file': 'boten_SHOWBOAT.DXR',
        'folder': 'Internal',
    },
}


def resolve_list(data_list):
    if type(data_list) == int:
        return [data_list]
    elif type(data_list) == list:
        values = []
        """if type(data_list[0]) == int:
            return data_list"""

        for range_list in data_list:
            if type(range_list) == int:
                values.append(range_list)
            else:
                values += range(range_list[0], range_list[1] + 1)

        return values
