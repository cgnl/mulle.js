#!/usr/bin/env python
# -*- coding: utf-8 -*-

import json
import os
import sys
import shutil
from subprocess import call

from PyTexturePacker import ImageRect
from PyTexturePacker import Packer
from PyTexturePacker import Utils as PyTexturePackerUtils

from audiosprite import AudioSprite
from build_scripts.MulleResource import MulleResource
from build_scripts.convert_image import convert_image
from build_scripts.data import director_data
from build_scripts.parse_animation_chart import parse_animation_chart

optimizeImages = int(sys.argv[1])
strict_missing_members = os.getenv('MULLE_ASSETS_STRICT', '0') == '1'
# Include all members for each referenced cast file to maximize Lingo parity.
# Set MULLE_ASSETS_ALL=0 to keep the original range-limited behavior.
include_all_members = os.getenv('MULLE_ASSETS_ALL', '1') == '1'

MulleResources = []

resWorldSelect = MulleResource('worldselect')
resWorldSelect.addFile({'dir': '18.DXR', 'lib': 'Internal', 'num': '1-48'})
MulleResources.append(resWorldSelect)

resMenu = MulleResource('menu')
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': 2})
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': '115-123'})  # face
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': '125-138'})  # mulle
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': '156-163'})  # buffa
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': '169-170'})  # toilet
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': '287-292'})  # intro audio
resMenu.addFile({'dir': '10.DXR', 'lib': 'Internal', 'num': '300-310'})  # menu audio
MulleResources.append(resMenu)

resParts = MulleResource('carparts')
resParts.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '239-312'})
resParts.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '316-496'})
resParts.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '838-917'})
resParts.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '966-1018'})
resParts.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '1213-1390'})  # audio
MulleResources.append(resParts)

resMap = MulleResource('map')
resMap.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '629-658'})
resMap.opaque = True
MulleResources.append(resMap)

resDriving = MulleResource('driving')
# resDriving.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '34-238'})  # PartsDB
resDriving.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '497-514'})  # images
resDriving.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '565-598'})  # audio
resDriving.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '599-624'})  # images
resDriving.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': 625})  # audio
resDriving.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '626-628'})  # images

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': 21})  # ui
resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': 25})  # dashboard

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '27-42'})  # fuel meter

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': 46})  # speed meter

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': 53})  # menu

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '69-75'})  # medals

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '77-157'})  # car

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '161-192'})  # pointer

resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '233-249'})  # voices
# resDriving.addFile({ 'dir': '05.DXR', 'lib': 'Internal', 'num': '265-266' }) # skid
resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '269-275'})  # horns
resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '294-369'})  # engine
resDriving.addFile({'dir': '05.DXR', 'lib': 'Internal', 'num': '238-289'})  # engine nl

MulleResources.append(resDriving)

resGarage = MulleResource('garage')
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': 33})  # back
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '34-40'})  # doors

resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '81-93'})  # figge
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '107-108'})  # figge truck

# Phone sprites for yard missions
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': 100})  # Big phone overlay (03b002v0)
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '102'})  # Small phone (03b003v0)
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '101-105'})  # phone and hover
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '181-183'})  # ui sounds
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '208-223'})  # voices
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '226-258'})  # voices
resGarage.addFile({'dir': '03.DXR', 'lib': 'Internal', 'num': '262-264'})  # voice remarks
resGarage.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': 23})  # Phone audio roaddog
resGarage.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '26-28'})  # Phone audio doris/mia/lasse
MulleResources.append(resGarage)

resYard = MulleResource('yard')
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': '13-14'})
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': 16})
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': 27})
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': 30})  # Background (04b003v0)
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': 145})  # Yard with garage/mailbox (04b001v0)
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': '40-44'})
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': 261})  # No mail
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': '272-277'})  # Package and garage full
resYard.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': '279-280'})  # Mail/figge
resYard.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '19-22'})  # Letters (mail images)
resYard.addFile({'dir': 'CDDATA.CXT', 'lib': 'Standalone', 'num': '24-30'})  # Letter audio (all mail missions)

MulleResources.append(resYard)

resAlbum = MulleResource('album')
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': '21-27'})  # Medals
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': '38-40'})  # UI sounds
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': '49-84'})  # Page numbers
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': 93})  # Page
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': '97-101'})  # Page
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': '137-150'})  # Sounds
resAlbum.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': '153-164'})  # UI
MulleResources.append(resAlbum)

resBrowser = MulleResource('fileBrowser')
resBrowser.addFile({'dir': '13.DXR', 'lib': 'Internal', 'num': 17})  # Audio
resBrowser.addFile({'dir': '13.DXR', 'lib': 'Internal', 'num': 29})  # Scroll
resBrowser.addFile({'dir': '13.DXR', 'lib': 'Internal', 'num': 32})  # File browser
MulleResources.append(resBrowser)

resDiploma = MulleResource('diploma')
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': 15})
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': '17-18'})
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': '21-27'})
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': 31})
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': '39-40'})
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': '66-71'})
resDiploma.addFile({'dir': '08.DXR', 'lib': 'Internal', 'num': '81-86'})  # Strings
MulleResources.append(resDiploma)

resCutscenes = MulleResource('cutscenes')
resCutscenes.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '66-76'})
resCutscenes.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': 81})
resCutscenes.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '83-86'})
MulleResources.append(resCutscenes)

resUI = MulleResource('ui')
resUI.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': 97})
resUI.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '109-117'})
MulleResources.append(resUI)

resCharacters = MulleResource('characters')
resCharacters.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '214-227'})  # buffa
resCharacters.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '245-263'})  # car
resCharacters.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '271-302'})  # car
MulleResources.append(resCharacters)

resShared = MulleResource('shared')
resShared.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '416-421'})  # misc audio
resShared.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '433-461'})  # misc audio
resShared.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '469-474'})  # misc audio
resShared.addFile({'dir': '00.CXT', 'lib': 'Standalone', 'num': '485-493'})  # misc audio
resShared.addFile({'dir': '04.DXR', 'lib': 'Internal', 'num': '48-49'})  # mailbox audio
MulleResources.append(resShared)

resJunk = MulleResource('junk')
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': 66})  # bg
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '68-72'})  # bg
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '85-96'})  # doors
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '162-185'})  # arrows
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '122-137'})  # sounds
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '209-210'})  # body
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '226-243'})  # head right
resJunk.addFile({'dir': '02.DXR', 'lib': 'Internal', 'num': '246-263'})  # head left
MulleResources.append(resJunk)

resRoadDog = MulleResource('roaddog')
resRoadDog.addFile({'dir': '85.DXR', 'lib': 'Internal', 'num': 25})  # images
resRoadDog.addFile({'dir': '85.DXR', 'lib': 'Internal', 'num': '190'})  # audio
resRoadDog.addFile({'dir': '85.DXR', 'lib': 'Internal', 'num': '200-201'})  # audio
resRoadDog.addFile({'dir': '85.DXR', 'lib': 'Internal', 'num': '26-34'})  # salka right
MulleResources.append(resRoadDog)

if os.path.exists(os.path.join('cst_out_new', '66.DXR')):
    resPlugin = MulleResource('plugin')
    # [25,27, , [38, 42], 45, [51, 56], [57,59], [68,78], [81, 94], [97, 115]]
    resPlugin.addFile({'dir': '66.DXR', 'lib': 'Internal', 'num': 25})  # Background
    resPlugin.addFile({'dir': '66.DXR', 'lib': 'Internal', 'num': [33, 37]})  # Junk
    resPlugin.addFile({'dir': '66.DXR', 'lib': 'Internal', 'num': [38, 42]})  # Sounds
    resPlugin.addFile({'dir': '66.DXR', 'lib': 'Internal', 'num': [51, 56]})  #
    resPlugin.addFile({'dir': '66.DXR', 'lib': 'Internal', 'num': [57, 59]})  # Crane
    resPlugin.addFile({'dir': '66.DXR', 'lib': 'Internal', 'num': [69, 78]})  # Figge
    resPlugin.addFile({'dir': '06.DXR', 'lib': 'Internal', 'num': 153})  # Close button
    resPlugin.addFile({'dir': 'PLUGIN.CST', 'lib': 'Standalone', 'num': [21, 47]})  # Parts
    MulleResources.append(resPlugin)

resMudCar = MulleResource('mudcar')
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': 1})  # background
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': '17-19'})  # moose
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': '25-39'})  # driver and rope
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': '41-44'})  # stuck car
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': '49-57'})  # buffa
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': 83})
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': '173-174'})
resMudCar.addFile({'dir': '82.DXR', 'lib': 'Internal', 'num': '200-202'})
MulleResources.append(resMudCar)

resRoadTree = MulleResource('roadtree')
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '1-3'})  # background and car
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '13-15'})  # driver animation
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '21-28'})  # tree
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '33-38'})  # boffa
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '45-91'})  # mulle
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '93-97'})  # driver talk animation frames
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': 99})  # driver talk animation
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': 113})
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '181-183'})  # sounds
resRoadTree.addFile({'dir': '83.DXR', 'lib': 'Internal', 'num': '200-204'})  # sounds
MulleResources.append(resRoadTree)

resRoadThing = MulleResource('roadthing')
resRoadThing.addFile({'dir': '84.DXR', 'lib': 'Internal', 'num': 25})  # images
resRoadThing.addFile({'dir': '84.DXR', 'lib': 'Internal', 'num': 201})  # audio
resRoadThing.addFile({'dir': '00.CXT', 'lib': 'Internal', 'num': 446})  # audio ding
MulleResources.append(resRoadThing)

resLuddeLabb = MulleResource('luddelabb')
resLuddeLabb.addFile({'dir': '91.DXR', 'lib': 'Internal', 'num': 1})
resLuddeLabb.addFile({'dir': '91.DXR', 'lib': 'Internal', 'num': 17})  # DogAnimChart
resLuddeLabb.addFile({'dir': '91.DXR', 'lib': 'Internal', 'num': 174})
resLuddeLabb.addFile({'dir': '91.DXR', 'lib': 'Internal', 'num': '200-202'})
MulleResources.append(resLuddeLabb)

# Ocean scene (93.DXR) - beach/ocean background + fish animation + audio
resOcean = MulleResource('ocean')
resOcean.addFile({'dir': '93.DXR', 'lib': 'Internal', 'num': 1})  # Background 93b001v0
resOcean.addFile({'dir': '93.DXR', 'lib': 'Internal', 'num': 17})  # FishAnimChart
resOcean.addFile({'dir': '93.DXR', 'lib': 'Internal', 'num': '18-21'})  # Fish frames
resOcean.addFile({'dir': '93.DXR', 'lib': 'Internal', 'num': 185})  # Ambient loop 93e001v0
resOcean.addFile({'dir': '93.DXR', 'lib': 'Internal', 'num': '200-202'})  # Dialogs
MulleResources.append(resOcean)

resFiggeFerrum = MulleResource('figgeferrum')
# 92.DXR (car ISO): background + figge body frames + salka + audio
resFiggeFerrum.addFile({'dir': '92.DXR', 'lib': 'Internal', 'num': 203})  # Background 92b001v0
resFiggeFerrum.addFile({'dir': '92.DXR', 'lib': 'Internal', 'num': 7})    # Gas can (dunk)
resFiggeFerrum.addFile({'dir': '92.DXR', 'lib': 'Internal', 'num': '12-22'})  # Figge body frames (includes 16)
resFiggeFerrum.addFile({'dir': '92.DXR', 'lib': 'Internal', 'num': '36-40'})  # Salka frames
resFiggeFerrum.addFile({'dir': '92.DXR', 'lib': 'Internal', 'num': '177-201'})  # audio
MulleResources.append(resFiggeFerrum)

resStureStortand = MulleResource('sturestortand')
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '16-25'})  # tube
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '32-46'})  # sture and bg
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '92-93'})  # kids 1
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '96-97'})  # kids 2
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '100-101'})  # kids 3
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '92-93'})  # kids 1
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': 181})  # bg loop
resStureStortand.addFile({'dir': '88.DXR', 'lib': 'Internal', 'num': '199-204'})  # audio
MulleResources.append(resStureStortand)

resSaftfabrik = MulleResource('saftfabrik')
resSaftfabrik.addFile({'dir': '87.DXR', 'lib': 'Internal', 'num': '15-18'})  # gaston
resSaftfabrik.addFile({'dir': '87.DXR', 'lib': 'Internal', 'num': '26-29'})  # splash
resSaftfabrik.addFile({'dir': '87.DXR', 'lib': 'Internal', 'num': 185})  # bg loop
resSaftfabrik.addFile({'dir': '87.DXR', 'lib': 'Internal', 'num': '200-206'})  # audio
resSaftfabrik.addFile({'dir': '87.DXR', 'lib': 'Internal', 'num': 208})  # bg image
MulleResources.append(resSaftfabrik)

resCarShow = MulleResource('carshow')
resCarShow.addFile({'dir': '94.DXR', 'lib': 'Internal', 'num': '17-21'})  # numbers
resCarShow.addFile({'dir': '94.DXR', 'lib': 'Internal', 'num': '31-47'})  # judge
resCarShow.addFile({'dir': '94.DXR', 'lib': 'Internal', 'num': 185})  # bg noise
resCarShow.addFile({'dir': '94.DXR', 'lib': 'Internal', 'num': 200})  # bg image
resCarShow.addFile({'dir': '94.DXR', 'lib': 'Internal', 'num': '201-209'})  # speech
MulleResources.append(resCarShow)

resSolhem = MulleResource('solhem')
resSolhem.addFile({'dir': '86.DXR', 'lib': 'Internal', 'num': 1})
resSolhem.addFile({'dir': '86.DXR', 'lib': 'Internal', 'num': 3})
resSolhem.addFile({'dir': '86.DXR', 'lib': 'Internal', 'num': 21})
resSolhem.addFile({'dir': '86.DXR', 'lib': 'Internal', 'num': '30-74'})
resSolhem.addFile({'dir': '86.DXR', 'lib': 'Internal', 'num': '181-185'})
resSolhem.addFile({'dir': '86.DXR', 'lib': 'Internal', 'num': '200-206'})
MulleResources.append(resSolhem)

resDoris = MulleResource('dorisdigital')
resDoris.addFile({'dir': '90.DXR', 'lib': 'Internal', 'num': 1})  # Outside
resDoris.addFile({'dir': '90.DXR', 'lib': 'Internal', 'num': '18-19'})  # Window
resDoris.addFile({'dir': '90.DXR', 'lib': 'Internal', 'num': 185})  # Game sounds
resDoris.addFile({'dir': '90.DXR', 'lib': 'Internal', 'num': '200-202'})  # Speech
MulleResources.append(resDoris)

resViola = MulleResource('viola')
resViola.addFile({'dir': '89.DXR', 'lib': 'Internal', 'num': 1})  # Background
resViola.addFile({'dir': '89.DXR', 'lib': 'Internal', 'num': '18-20'})  # Viola animation
resViola.addFile({'dir': '89.DXR', 'lib': 'Internal', 'num': 177})  # Audio
resViola.addFile({'dir': '89.DXR', 'lib': 'Internal', 'num': '200-202'})  # Audio
MulleResources.append(resViola)

# ============================================================================
# BOATS GAME RESOURCES (Miel Monteur Recht Door Zee / Mulle Meck bygger båtar)
# ============================================================================

# Check if boats assets are extracted (may be lowercase or uppercase depending on extraction)
# Rename BOTEN_ prefix to boten_ but keep the rest of the name (including .DXR/.CXT extension case)
import shutil
if os.path.exists('cst_out_new'):
    for folder in os.listdir('cst_out_new'):
        if folder.startswith('BOTEN_'):
            old_path = os.path.join('cst_out_new', folder)
            # Only lowercase the prefix, keep rest of name as-is
            new_name = 'boten_' + folder[6:]  # Keep everything after 'BOTEN_'
            new_path = os.path.join('cst_out_new', new_name)
            if not os.path.exists(new_path):
                print(f"Renaming {folder} to {new_name}")
                shutil.move(old_path, new_path)

if os.path.exists(os.path.join('cst_out_new', 'boten_04.DXR')):
    print("Loading boats game resources...")
    
    # Shared boat resources (boten_00.CXT) - contains common audio/images for all boat scenes
    # boten_00.CXT: Type 1 (images): 180, Type 6 (audio): 145, Type 3 (text): 3
    # Includes weather ambience (00e108v0), radio dialogs (00d075v0, 50d012v0), etc.
    if os.path.exists(os.path.join('cst_out_new', 'boten_00.CXT')):
        resBotenShared = MulleResource('boten_shared')
        resBotenShared.addFile({'dir': 'boten_00.CXT', 'lib': 'Standalone', 'num': '1-432'})  # All members
        MulleResources.append(resBotenShared)
    
    # Boatyard scene - Christina Colombus's workshop (equivalent of garage)
    # boten_04.DXR: Type 1 (images): 67 members, Type 3 (text): 6, Type 6 (audio): 62
    resBoatyard = MulleResource('boatyard')
    # Note: Both car and boat games use black for transparency (default in MulleResource)
    resBoatyard.addFile({'dir': 'boten_04.DXR', 'lib': 'Internal', 'num': '1-92'})  # Images and text
    resBoatyard.addFile({'dir': 'boten_04.DXR', 'lib': 'Internal', 'num': '93-155'})  # Audio
    MulleResources.append(resBoatyard)

    # Boat yard scene (boten_03.DXR) - Junkyard overview (Sea version of 03.DXR)
    # boten_03.DXR: Type 1 (images): 41, Type 6 (audio): 28
    if os.path.exists(os.path.join('cst_out_new', 'boten_03.DXR')):
        resBoatYard = MulleResource('boat_yard')
        resBoatYard.addFile({'dir': 'boten_03.DXR', 'lib': 'Internal', 'num': '1-41'})    # Background + parts
        resBoatYard.addFile({'dir': 'boten_03.DXR', 'lib': 'Internal', 'num': '1-39'})    # Audio
        MulleResources.append(resBoatYard)
    
    # Boat junk scene (boten_02.DXR) - Parts storage shelves
    # boten_02.DXR: Type 1 (images): 7, Type 6 (audio): 4, Type 3 (text): 1
    if os.path.exists(os.path.join('cst_out_new', 'boten_02.DXR')):
        resBoatJunk = MulleResource('boatjunk')
        resBoatJunk.addFile({'dir': 'boten_02.DXR', 'lib': 'Internal', 'num': '1-7'})    # Background + shelf indicators
        resBoatJunk.addFile({'dir': 'boten_02.DXR', 'lib': 'Internal', 'num': '17-20'})  # Audio (dialogues + click)
        MulleResources.append(resBoatJunk)
    
    # Boat build scene (05.DXR) - main boat building interface
    # boten_05.DXR: Type 1 (images): 437, Type 3 (text): 9, Type 6 (audio): 278
    if os.path.exists(os.path.join('cst_out_new', 'boten_05.DXR')):
        resBoatBuild = MulleResource('boatbuild')
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '1-12'})  # Text/anim charts
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '67-456'})  # Images (boat parts)
        # Compass assets used by ObjectCompassScript / UI replacements
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '461'})     # kompass (base)
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '469-501'}) # CompassBottom/Round + frames + Needle
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '457-459'})  # Audio UI
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '1000-1215'})  # Audio speech + wave/sail sounds
        resBoatBuild.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': '1337-1392'})  # Motor speed variant audio (05e016v0_00..06 through 05e055v0_00..06)
        MulleResources.append(resBoatBuild)
    
    # Boat parts (from CDDATA.CXT of boats game)
    # boten_CDDATA.CXT: Type 1 (images): 776 (1053-2109), Type 3 (text): 1356, Type 6 (audio): 166 (1721-1925)
    if os.path.exists(os.path.join('cst_out_new', 'boten_CDDATA.CXT')):
        resBoatParts = MulleResource('boatparts')
        # Part sprites (images)
        resBoatParts.addFile({'dir': 'boten_CDDATA.CXT', 'lib': 'Standalone', 'num': '1053-2109'})
        # Audio
        resBoatParts.addFile({'dir': 'boten_CDDATA.CXT', 'lib': 'Standalone', 'num': '1721-1925'})
        MulleResources.append(resBoatParts)
    
    # Boat sprites for different sizes (Large/Medium/Small) and seasons (Summer/Winter)
    # Each BxS.CXT has 400 image members (1-400)
    for size in ['BLS', 'BMS', 'BSS']:  # Large, Medium, Small Summer
        dirName = f'boten_{size}.CXT'
        if os.path.exists(os.path.join('cst_out_new', dirName)):
            resBoat = MulleResource(f'boat_{size.lower()}')
            resBoat.addFile({'dir': dirName, 'lib': 'Standalone', 'num': '1-400'})
            MulleResources.append(resBoat)
    
    # Sail assets - 400 image members
    if os.path.exists(os.path.join('cst_out_new', 'boten_SAIL.CXT')):
        resSail = MulleResource('boatsail')
        resSail.addFile({'dir': 'boten_SAIL.CXT', 'lib': 'Standalone', 'num': '1-400'})
        MulleResources.append(resSail)
    
    # Sea/sailing world scenes (80.DXR is main sea scene)
    # boten_80.DXR: Type 1 (images): 66, Type 3 (text): 2, Type 6 (audio): 20, Type 14: 2
    if os.path.exists(os.path.join('cst_out_new', 'boten_80.DXR')):
        resSeaWorld = MulleResource('seaworld')
        resSeaWorld.addFile({'dir': 'boten_80.DXR', 'lib': 'Internal', 'num': '2-12'})  # Text/config
        resSeaWorld.addFile({'dir': 'boten_80.DXR', 'lib': 'Internal', 'num': '17-60'})  # Images
        # Extra images (used by DLC/custom scenes like Vicky island)
        resSeaWorld.addFile({'dir': 'boten_80.DXR', 'lib': 'Internal', 'num': '115-123'})  # Images
        resSeaWorld.addFile({'dir': 'boten_80.DXR', 'lib': 'Internal', 'num': '61-80'})  # Audio
        # Sea water background (Weather1) lives in boten_05.DXR
        if os.path.exists(os.path.join('cst_out_new', 'boten_05.DXR')):
            resSeaWorld.addFile({'dir': 'boten_05.DXR', 'lib': 'Internal', 'num': 144})  # Weather1

        # Add all sea destination scene assets (70-88)
        # boten_70.DXR: Erson intro tutorial (99 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_70.DXR')):
            resSeaWorld.addFile({'dir': 'boten_70.DXR', 'lib': 'Internal', 'num': '1-99'})
        
        # boten_71.DXR: Harbor tutorial (59 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_71.DXR')):
            resSeaWorld.addFile({'dir': 'boten_71.DXR', 'lib': 'Internal', 'num': '1-59'})
        
        # boten_76.DXR: Showboat/competition (66 members) - handled separately
        
        # boten_77.DXR: Birgit's beach with dogs (161 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_77.DXR')):
            resSeaWorld.addFile({'dir': 'boten_77.DXR', 'lib': 'Internal', 'num': '1-161'})
        
        # boten_78.DXR: Preacher/Church island (75 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_78.DXR')):
            resSeaWorld.addFile({'dir': 'boten_78.DXR', 'lib': 'Internal', 'num': '1-75'})
        
        # boten_79.DXR: Fisherman scene (120 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_79.DXR')):
            resSeaWorld.addFile({'dir': 'boten_79.DXR', 'lib': 'Internal', 'num': '1-120'})
        
        # boten_81.DXR: Surfstrand/Sur (65 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_81.DXR')):
            resSeaWorld.addFile({'dir': 'boten_81.DXR', 'lib': 'Internal', 'num': '1-65'})
        
        # boten_83.DXR: Mia's island (65 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_83.DXR')):
            resSeaWorld.addFile({'dir': 'boten_83.DXR', 'lib': 'Internal', 'num': '1-65'})
        
        # boten_84.DXR: Viola's house (106 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_84.DXR')):
            resSeaWorld.addFile({'dir': 'boten_84.DXR', 'lib': 'Internal', 'num': '1-106'})
        
        # boten_85.DXR: Waterpump/Fountain (47 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_85.DXR')):
            resSeaWorld.addFile({'dir': 'boten_85.DXR', 'lib': 'Internal', 'num': '1-47'})
        
        # boten_86.DXR: Sven's cave (66 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_86.DXR')):
            resSeaWorld.addFile({'dir': 'boten_86.DXR', 'lib': 'Internal', 'num': '1-66'})
        
        # boten_87.DXR: Diving scene (195 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_87.DXR')):
            resSeaWorld.addFile({'dir': 'boten_87.DXR', 'lib': 'Internal', 'num': '1-195'})
        
        # boten_88.DXR: Whale watching (45 members)
        if os.path.exists(os.path.join('cst_out_new', 'boten_88.DXR')):
            resSeaWorld.addFile({'dir': 'boten_88.DXR', 'lib': 'Internal', 'num': '1-45'})
        
        MulleResources.append(resSeaWorld)
    
    # Boat showcase/result scene
    # boten_SHOWBOAT.DXR: Type 1 (images): 69 (36-100+), Type 3 (text): 4, Type 6 (audio): 15, Type 12 (field): 1
    if os.path.exists(os.path.join('cst_out_new', 'boten_SHOWBOAT.DXR')):
        resShowboat = MulleResource('showboat')
        resShowboat.addFile({'dir': 'boten_SHOWBOAT.DXR', 'lib': 'Internal', 'num': '9-17'})  # Text/anim
        resShowboat.addFile({'dir': 'boten_SHOWBOAT.DXR', 'lib': 'Internal', 'num': '32-100'})  # Images + audio start
        resShowboat.addFile({'dir': 'boten_SHOWBOAT.DXR', 'lib': 'Internal', 'num': '102-138'})  # More images + audio
        MulleResources.append(resShowboat)
    
    # Intro movie assets (Miel arrives at shipyard)
    # boten_12.DXR: Contains the animated intro movie with Miel building vlot/kano/boot
    # boten_01.DXR: Christina Colombus and boatyard intro scenes
    # NOTE: boten_01.DXR is loaded FIRST so its member 36 doesn't overwrite
    #       boten_12.DXR's member 36 (the main 117s narration)
    if os.path.exists(os.path.join('cst_out_new', 'boten_12.DXR')):
        resIntro = MulleResource('zee_intro')
        
        # boten_01.DXR: Christina Colombus boatyard scene (load first)
        # Members: 1 (background), 2-9 (images), 10-14 (anim charts), 25-43 (audio), 50-80 (character sprites)
        if os.path.exists(os.path.join('cst_out_new', 'boten_01.DXR')):
            resIntro.addFile({'dir': 'boten_01.DXR', 'lib': 'Internal', 'num': '1-100'})
        
        # boten_12.DXR: Main intro movie (load second so its audio takes precedence)
        # Members: 6 (11d001v0 audio), 36 (main narration 117s "sound"), 37-56 (backgrounds + Miel animations)
        resIntro.addFile({'dir': 'boten_12.DXR', 'lib': 'Internal', 'num': '2-56'})
        
        MulleResources.append(resIntro)

    # NOTE: boten_11.DXR is the LOGIN SCREEN, not a parts catalog
    # Parts catalog was a custom feature that doesn't exist in the original game
    # Original game gets parts from: boat_junk (02.DXR shelves) and Doris radio deliveries

    # Blueprint selection scene (boten_15.DXR) - Hull/rudder selection
    # boten_15.DXR: Type 1 (images): 61, Type 6 (audio): 25, Type 8 (script): 27
    if os.path.exists(os.path.join('cst_out_new', 'boten_15.DXR')):
        resBlueprint = MulleResource('blueprint')
        resBlueprint.addFile({'dir': 'boten_15.DXR', 'lib': 'Internal', 'num': '1-141'})  # All members
        MulleResources.append(resBlueprint)

    # Boat diploma (boten_08.DXR)
    # boten_08.DXR: Type 1 (images): 1-100, Type 3 (text): 101-150?
    if os.path.exists(os.path.join('cst_out_new', 'boten_08.DXR')):
        resDiploma = MulleResource('boatdiploma')
        # Members used in HelpState.js:
        # Background: 93
        # Header: 71
        # Bottom: 70
        # Wood: 15
        # Arrows: 17, 18
        # Buttons: 67, 68
        # Borders: 39, 40
        # Medals: 73-78, 81-86 (text)
        # Misc: 50, 52, 69
        resDiploma.addFile({'dir': 'boten_08.DXR', 'lib': 'Internal', 'num': '1-100'})
        MulleResources.append(resDiploma)

    print("Boats resources loaded.")
else:
    print("Boats assets not found - skipping boats resources")

# ============================================================================

if len(sys.argv) < 3 or not sys.argv[2]:
    assetOutPath = "./dist/assets"
else:
    assetOutPath = sys.argv[2]

if not os.path.exists(assetOutPath):
    os.makedirs(assetOutPath)
assetWebPath = "assets"
resourcePath = 'cst_out_new'
if not os.path.exists(resourcePath):
    raise FileNotFoundError(resourcePath)
meta = {}


def load_metadata(dir_path):
    if dir_path in meta:
        return meta[dir_path]
    with open(dir_path + '/metadata.json') as data_file:
        j = json.load(data_file)
    meta[dir_path] = j
    return j


def select_library(metadata, lib_name=None):
    libs = metadata.get('libraries', [])
    if not libs:
        return None
    if lib_name:
        for lib in libs:
            if lib.get('name') == lib_name:
                return lib
    return libs[0]

assetIndex = {}

for res in MulleResources:

    resName = res.name

    assetIndex[resName] = {'files': []}

    print("")
    print("- " + resName)

    atlasData = {}
    soundSprite = {}
    textString = {}
    animations = {}

    imageRects = []

    packFiles = {}
    packFiles[resName] = []

    missing_members = {}

    res_files = res.files
    if include_all_members:
        res_files = []
        seen = set()
        # Expand each referenced cast file to all existing members
        for f in res.files:
            dirPath = resourcePath + '/' + f['dir']
            j = load_metadata(dirPath)
            lib = select_library(j, f.get('lib'))
            if not lib:
                continue
            for num in sorted(lib['members'].keys(), key=lambda v: int(v)):
                key = (f['dir'], lib['name'], num)
                if key in seen:
                    continue
                res_files.append({'dir': f['dir'], 'lib': lib['name'], 'num': int(num)})
                seen.add(key)

    for f in res_files:

        dirPath = resourcePath + '/' + f['dir']

        j = None

        j = load_metadata(dirPath)
        lib = select_library(j, f.get('lib'))
        if not lib:
            print("[" + res.name + "] Invalid file " + f['dir'] + " <no library> " + str(f['num']))
            continue

        if str(f['num']) in lib['members']:
            mem = lib['members'][str(f['num'])]
        else:
            if strict_missing_members:
                print("[" + res.name + "] Invalid file " + f['dir'] + " " + str(lib['name']) + " " + str(f['num']))
            else:
                if f['dir'] not in missing_members:
                    missing_members[f['dir']] = []
                missing_members[f['dir']].append(f['num'])
            continue

        libPath = dirPath + '/' + lib['name']

        fileBasePath = libPath + '/' + str(f['num'])

        cast_type = mem['castType']
        # Some assets are mislabeled as sounds but only have bitmap data.
        if cast_type == 6:
            if not os.path.exists(fileBasePath + '.wav') and os.path.exists(fileBasePath + '.bmp'):
                print("[" + res.name + "] Treating sound as image " + f['dir'] + " " + str(f['num']))
                cast_type = 1

        if cast_type == 1:
            # Some bitmap cast members are just empty placeholders (0x0).
            # Director doesn't store bitmap data for these, so no file should be expected.
            if mem.get('imageWidth', 0) == 0 and mem.get('imageHeight', 0) == 0:
                continue
            movie = f['dir']
            opaque = []
            transparent_index_0 = []
            if movie in director_data.data:
                if 'opaque' in director_data.data[movie]:
                    opaque += director_data.resolve_list(director_data.data[movie]['opaque'])
                if 'opaque_sv' in director_data.data[movie]:
                    opaque += director_data.resolve_list(director_data.data[movie]['opaque_sv'])
                if 'transparent_index_0' in director_data.data[movie]:
                    transparent_index_0 += director_data.resolve_list(director_data.data[movie]['transparent_index_0'])
            else:
                print('No opaque data for %s' % movie)

            if not os.path.exists(fileBasePath + '.bmp'):
                print('Missing file %s' % fileBasePath + '.bmp')
                continue

            if f['num'] in opaque:
                convert_image(fileBasePath + '.bmp', False)
            else:
                # Transparency is now based on palette index 255 (Director's background marker)
                # This preserves black outlines/borders while making backgrounds transparent
                # Some sprites also need index 0 to be transparent
                use_transparent_index_0 = f['num'] in transparent_index_0
                convert_image(fileBasePath + '.bmp', transparent_index_0=use_transparent_index_0)

            filePath = fileBasePath + ".png"

            intName = str(len(atlasData) + 1)

            p = {}

            p['path'] = filePath;

            p['width'] = mem['imageWidth'];
            p['height'] = mem['imageHeight'];

            p['data'] = {}

            # p['data']['name'] = (atlasData.length + 1).toString();

            p['data']['pivotX'] = mem['imageRegX']
            p['data']['pivotY'] = mem['imageRegY']

            p['data']['dirFile'] = f['dir']
            p['data']['dirName'] = mem['name'].strip()
            p['data']['dirNum'] = f['num']

            # atlasData.push( p );
            atlasData[intName] = p

            assetIndex[resName]['files'].append(
                {'type': 'image', 'dirFile': f['dir'], 'dirName': mem['name'].strip(), 'dirNum': f['num']})

            image_rect = ImageRect.ImageRect(filePath)

            original = None

            for v in imageRects:
                # print("compare " + str( p['data']['dirFile'] ) + " " + str( p['data']['dirNum'] ) + " == " + str( v.dirFile ) + " " + str( v.dirNum ) )
                # diff = ImageChops.difference(image_rect.image, v.image)
                # print("diff " + str(diff))
                if mem['imageHash'] == v.hash:
                    original = v
                    break

            if original is not None:
                # print("found duplicate")

                dupe = {}
                dupe['pivot'] = {'x': p['data']['pivotX'], 'y': p['data']['pivotY']}
                dupe['baseName'] = intName
                dupe['dirFile'] = p['data']['dirFile']
                dupe['dirName'] = p['data']['dirName']
                dupe['dirNum'] = p['data']['dirNum']

                original.dupes.append(dupe)
            else:
                image_rect.pivot = {'x': p['data']['pivotX'], 'y': p['data']['pivotY']}
                image_rect.baseName = intName
                image_rect.dirFile = p['data']['dirFile']
                image_rect.dirName = p['data']['dirName']
                image_rect.dirNum = p['data']['dirNum']
                image_rect.hash = mem['imageHash']
                image_rect.dupes = []

                imageRects.append(image_rect)

        # print("image " + f['dir'] + " " + str(lib['name']) + " " + str(f['num']))
        else:
            p = {'data': {}}
            p['data']['dirName'] = mem['name'].strip()
            p['data']['dirFile'] = f['dir']
            p['data']['dirNum'] = f['num']

            if cast_type == 6:
                filePath = fileBasePath + ".wav"
                p['path'] = filePath

                if not os.path.exists(filePath):
                    print("[" + res.name + "] Missing audio file " + filePath)
                    continue

                if 'soundLooped' in mem:
                    p['loop'] = mem['soundLooped']
                else:
                    p['loop'] = False

                if 'soundCuePoints' in mem and len(mem['soundCuePoints']) > 0:
                    p['data']['cue'] = mem['soundCuePoints']

                soundSprite[str(len(soundSprite) + 1)] = p

                assetIndex[resName]['files'].append(
                    {'type': 'sound', 'dirFile': f['dir'], 'dirName': mem['name'].strip(), 'dirNum': f['num']})

            # print("audio " + f['dir'] + " " + str(lib['name']) + " " + str(f['num']))

            if cast_type == 12 or cast_type == 3:
                if f['dir'] not in textString:
                    textString[f['dir']] = {}

                filePath = fileBasePath + ".txt"
                p['path'] = filePath
                if not os.path.exists(filePath):
                    print("[" + res.name + "] Missing text file " + filePath)
                    continue
                fp = open(filePath, 'rb')
                string = fp.read()
                string = string.decode('iso8859-1')
                if cast_type == 12:
                    textString[f['dir']][f['num']] = string
                elif cast_type == 3:
                    # Only parse animation charts when the signature matches.
                    trimmed = string.strip()
                    if trimmed.startswith('[#Actions:') and '#Paths:' in trimmed:
                        if f['dir'] not in animations:
                            animations[f['dir']] = {}
                        try:
                            animations[f['dir']][f['num']] = parse_animation_chart(trimmed)
                        except RuntimeError as e:
                            print(str(e))
                            textString[f['dir']][f['num']] = string
                    else:
                        textString[f['dir']][f['num']] = string

    if not strict_missing_members and len(missing_members) > 0:
        missing_count = sum(len(v) for v in missing_members.values())
        sample_dir = sorted(missing_members.keys())[0]
        sample_nums = ", ".join(str(n) for n in sorted(missing_members[sample_dir])[:5])
        print("[" + res.name + "] Skipped " + str(missing_count) + " missing cast members across " +
              str(len(missing_members)) + " casts (e.g. " + sample_dir + " " + sample_nums +
              "). Set MULLE_ASSETS_STRICT=1 to list all missing members.")

    if len(textString) > 0:
        file = '%s/%s-strings.json' % (assetOutPath, resName)
        fp = open(file, 'w')
        json.dump(textString, fp)

    if len(animations) > 0:
        file = '%s/%s-animations.json' % (assetOutPath, resName)
        fp = open(file, 'w')
        json.dump(animations, fp)

    print("Images: " + str(len(imageRects)))
    print("Sounds: " + str(len(soundSprite)))
    print("Strings: " + str(len(textString)))
    print("Animations: " + str(len(animations)))

    if len(imageRects) > 0:
        if res.opaque:
            packer = Packer.create(max_width=2048, max_height=2048, bg_color=0xffffffff, trim_mode=1,
                                   enable_rotated=False)
        else:
            packer = Packer.create(max_width=2048, max_height=2048, bg_color=0x00ffffff, trim_mode=1,
                                   enable_rotated=False)

        atlas_list = packer._pack(imageRects)

        for i, atlas in enumerate(atlas_list):
            print("Pack image " + str(i))

            fSprites = {}
            fSprites['frames'] = {}

            packed_image = atlas.dump_image(packer.bg_color)

            atlasName = resName + '-sprites-' + str(i)

            PyTexturePackerUtils.save_image(packed_image, assetOutPath + "/" + atlasName + '.png')

            if optimizeImages > 0:
                call(['optipng', '-o', str(optimizeImages), os.path.join(assetOutPath, atlasName + '.png')])

            # make json
            for image_rect in atlas.image_rect_list:
                width, height = (image_rect.width, image_rect.height) if not image_rect.rotated \
                    else (image_rect.height, image_rect.width)

                center_offset = (0, 0)
                if image_rect.trimmed:
                    center_offset = (image_rect.source_box[0] + width / 2. - image_rect.source_size[0] / 2.,
                                     - (image_rect.source_box[1] + height / 2. - image_rect.source_size[1] / 2.))

                m = {}
                m['frame'] = {"x": image_rect.x, "y": image_rect.y, "w": width, "h": height}
                m['regpoint'] = image_rect.pivot
                m['dirFile'] = image_rect.dirFile
                m['dirName'] = image_rect.dirName
                m['dirNum'] = image_rect.dirNum

                fSprites['frames'][image_rect.baseName] = m

                if len(image_rect.dupes) > 0:
                    for dupe in image_rect.dupes:
                        n = {}
                        n['frame'] = {"x": image_rect.x, "y": image_rect.y, "w": width, "h": height}
                        n['regpoint'] = dupe['pivot']
                        n['dirFile'] = dupe['dirFile']
                        n['dirName'] = dupe['dirName']
                        n['dirNum'] = dupe['dirNum']

                        fSprites['frames'][dupe['baseName']] = n

                    # print("dupe handled: " + dupe['dirFile'] + " - " + str(dupe['dirNum']) )

            fSprites['meta'] = {
                "size": {"w": packed_image.size[0], "h": packed_image.size[1]},
                "image": assetWebPath + '/' + atlasName + '.png',
                "scale": "1",
            }

            fSpritesOut = open(assetOutPath + "/" + atlasName + ".json", "w")
            fSpritesOut.write(json.dumps(fSprites))
            fSpritesOut.close()

            packFiles[resName].append({
                "type": "atlasJSONHash",
                "key": atlasName,
                "textureURL": assetWebPath + '/' + atlasName + '.png',
                "atlasURL": assetWebPath + '/' + atlasName + '.json',
                "atlasData": None
            })

    if len(soundSprite) > 0:
        sprite = AudioSprite(resName)

        for s in soundSprite:
            sprite.addAudio(soundSprite[s]['path'], isLooped=soundSprite[s]['loop'], extraData=soundSprite[s]['data'])

        outSprite = sprite.save(assetOutPath, resName + '-audio', formats=['ogg'], bitrate='32k',
                                parameters=['-ar', '22050'])

        packFiles[resName].append({
            "type": "audiosprite",
            "key": resName + "-audio",
            "urls": assetWebPath + '/' + resName + '-audio.ogg',
            "jsonURL": assetWebPath + '/' + resName + '-audio.json',
            "jsonData": None
        })

    fPackOut = open(assetOutPath + "/" + resName + ".json", "w")
    fPackOut.write(json.dumps(packFiles))
    fPackOut.close()

fIndexOut = open(assetOutPath + "/index.json", "w")
fIndexOut.write(json.dumps(assetIndex))
fIndexOut.close()

# ----------------------------------------------------------------------------
# Copy boat topology text fields (30t*.txt) for Lingo-accurate sea collision
# ----------------------------------------------------------------------------
def copy_boat_topology_fields(resource_root, output_root):
    # Locate boat CDDATA.CXT in a case-insensitive manner.
    # On Linux the extractor outputs "BOTEN_CDDATA.CXT" (uppercase),
    # while older paths may be "boten_CDDATA.CXT". Also avoid nested
    # prefixes like "BOTEN_BOTEN_CDDATA.CXT" when possible.
    src_root = None
    if os.path.isdir(resource_root):
        entries = [e for e in os.listdir(resource_root) if os.path.isdir(os.path.join(resource_root, e))]
        matches = [e for e in entries if e.upper().endswith('CDDATA.CXT')]

        boat_matches = [e for e in matches if e.upper().startswith('BOTEN')]
        if boat_matches:
            boat_matches.sort(key=lambda s: (s.upper().count('BOTEN_'), len(s)))
            src_root = os.path.join(resource_root, boat_matches[0])
        else:
            for e in matches:
                if e.upper() == 'CDDATA.CXT':
                    src_root = os.path.join(resource_root, e)
                    break

    if not src_root:
        # Fallback to legacy paths
        candidates = [
            os.path.join(resource_root, 'boten_CDDATA.CXT'),
            os.path.join(resource_root, 'BOTEN_CDDATA.CXT'),
            os.path.join(resource_root, 'CDDATA.CXT'),
        ]
        for cand in candidates:
            if os.path.exists(os.path.join(cand, 'metadata.json')) and os.path.isdir(os.path.join(cand, 'Standalone')):
                src_root = cand
                break

    if not src_root:
        print("No boat CDDATA.CXT found for topology copy - skipping")
        return

    meta_path = os.path.join(src_root, 'metadata.json')
    try:
        with open(meta_path, 'r', encoding='utf-8') as f:
            meta_json = json.load(f)
    except Exception as e:
        print(f"Failed to read topology metadata: {e}")
        return

    cast_ids = []
    for lib in meta_json.get('libraries', []):
        members = lib.get('members', {})
        for cast_num, member in members.items():
            name = member.get('name', '')
            if isinstance(name, str) and name.startswith('30t'):
                cast_ids.append(str(cast_num))

    if not cast_ids:
        print("No 30t* members found in metadata - skipping topology copy")
        return

    dest_root = os.path.join(output_root, 'boten', 'CDDATA.CXT')
    dest_standalone = os.path.join(dest_root, 'Standalone')
    os.makedirs(dest_standalone, exist_ok=True)

    try:
        shutil.copy2(meta_path, os.path.join(dest_root, 'metadata.json'))
    except Exception as e:
        print(f"Failed to copy topology metadata: {e}")
        return

    copied = 0
    for cast_num in cast_ids:
        src_file = os.path.join(src_root, 'Standalone', f'{cast_num}.txt')
        if not os.path.exists(src_file):
            continue
        try:
            shutil.copy2(src_file, os.path.join(dest_standalone, f'{cast_num}.txt'))
            copied += 1
        except Exception as e:
            print(f"Failed to copy topology member {cast_num}: {e}")

    print(f"Copied {copied} boat topology members to {dest_standalone}")

copy_boat_topology_fields(resourcePath, assetOutPath)
