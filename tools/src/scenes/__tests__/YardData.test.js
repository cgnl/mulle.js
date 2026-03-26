/**
 * @fileoverview Tests for YardData - Yard scene logic (scene 03)
 * Based on: decompiled_lingo/03/03/casts/Internal/ParentScript 2 - Dir.ls
 *
 * The Yard is the main junkyard area. This module tests:
 *   - Gift collection logic
 *   - Dialog priority system with gotNewParts, gotGifts, firstTime, and idle dialog
 *   - Navigation zone definitions
 *   - Initial state computation
 */

'use strict'

const {
  DIALOG_LISTS,
  NAV_ZONES,
  SPRITE_LIST,
  computeGiftCollection,
  resolveDialogPriority,
  computeInitState
} = require('../YardData')

describe('YardData', () => {
  // ===========================================================================
  // DIALOG_LISTS constant
  // ===========================================================================

  describe('DIALOG_LISTS', () => {
    test('giftDialogList contains exactly 3 gift sounds', () => {
      expect(DIALOG_LISTS.giftDialogList).toEqual(['GiftSnd1', 'GiftSnd2', 'GiftSnd3'])
    })

    test('giftDialogList has 3 entries', () => {
      expect(DIALOG_LISTS.giftDialogList).toHaveLength(3)
    })

    test('firstDialogList contains exactly 4 first-time dialogs', () => {
      expect(DIALOG_LISTS.firstDialogList).toEqual([
        '03d001v0', '03d002v0', '03d006v0', '03d007v0'
      ])
    })

    test('firstDialogList has 4 entries', () => {
      expect(DIALOG_LISTS.firstDialogList).toHaveLength(4)
    })

    test('genDialogList contains exactly 5 general dialogs', () => {
      expect(DIALOG_LISTS.genDialogList).toEqual([
        '00d001v0', '00d002v0', '00d003v0', '00d004v0', '00d005v0'
      ])
    })

    test('genDialogList has 5 entries', () => {
      expect(DIALOG_LISTS.genDialogList).toHaveLength(5)
    })

    test('dorisDialogList contains exactly 3 Doris dialogs', () => {
      expect(DIALOG_LISTS.dorisDialogList).toEqual([
        '03d003v0', '03d004v0', '03d005v0'
      ])
    })

    test('dorisDialogList has 3 entries', () => {
      expect(DIALOG_LISTS.dorisDialogList).toHaveLength(3)
    })

    test('all dialog lists are arrays', () => {
      expect(Array.isArray(DIALOG_LISTS.giftDialogList)).toBe(true)
      expect(Array.isArray(DIALOG_LISTS.firstDialogList)).toBe(true)
      expect(Array.isArray(DIALOG_LISTS.genDialogList)).toBe(true)
      expect(Array.isArray(DIALOG_LISTS.dorisDialogList)).toBe(true)
    })
  })

  // ===========================================================================
  // NAV_ZONES constant
  // ===========================================================================

  describe('NAV_ZONES', () => {
    test('contains exactly 7 navigation zones', () => {
      expect(NAV_ZONES).toHaveLength(7)
    })

    test('Quay zone has correct rect from Lingo', () => {
      const quay = NAV_ZONES.find(z => z.dragToWhere === 'Quay')
      expect(quay.rect).toEqual([29, 0, 124, 300])
    })

    test('Quay zone has id 301', () => {
      const quay = NAV_ZONES.find(z => z.dragToWhere === 'Quay')
      expect(quay.id).toBe(301)
    })

    test('Quay zone has GoLeft cursor', () => {
      const quay = NAV_ZONES.find(z => z.dragToWhere === 'Quay')
      expect(quay.cursor.rollOver).toBe('GoLeft')
      expect(quay.cursor.dragRollover).toBe('DropLeft')
    })

    test('Quay zone navigates to frame "Quay"', () => {
      const quay = NAV_ZONES.find(z => z.dragToWhere === 'Quay')
      expect(quay.clickFrame).toBe('Quay')
    })

    test('Shelf1 zone has correct rect from Lingo', () => {
      const shelf1 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf1')
      expect(shelf1.rect).toEqual([131, 43, 206, 307])
    })

    test('Shelf1 zone has id 302', () => {
      const shelf1 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf1')
      expect(shelf1.id).toBe(302)
    })

    test('Shelf2 zone has correct rect from Lingo', () => {
      const shelf2 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf2')
      expect(shelf2.rect).toEqual([207, 40, 288, 314])
    })

    test('Shelf2 zone has id 303', () => {
      const shelf2 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf2')
      expect(shelf2.id).toBe(303)
    })

    test('Shelf3 zone has correct rect from Lingo', () => {
      const shelf3 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf3')
      expect(shelf3.rect).toEqual([289, 34, 380, 322])
    })

    test('Shelf3 zone has id 304', () => {
      const shelf3 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf3')
      expect(shelf3.id).toBe(304)
    })

    test('Shelf4 zone has correct rect from Lingo', () => {
      const shelf4 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf4')
      expect(shelf4.rect).toEqual([381, 31, 479, 329])
    })

    test('Shelf4 zone has id 305', () => {
      const shelf4 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf4')
      expect(shelf4.id).toBe(305)
    })

    test('Shelf5 zone has correct rect from Lingo', () => {
      const shelf5 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf5')
      expect(shelf5.rect).toEqual([480, 28, 579, 335])
    })

    test('Shelf5 zone has id 306', () => {
      const shelf5 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf5')
      expect(shelf5.id).toBe(306)
    })

    test('Shelf6 zone has correct rect from Lingo', () => {
      const shelf6 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf6')
      expect(shelf6.rect).toEqual([580, 25, 640, 343])
    })

    test('Shelf6 zone has id 307', () => {
      const shelf6 = NAV_ZONES.find(z => z.dragToWhere === 'Shelf6')
      expect(shelf6.id).toBe(307)
    })

    test('all shelf zones have GoForward cursor', () => {
      const shelves = NAV_ZONES.filter(z => z.dragToWhere.startsWith('Shelf'))
      expect(shelves).toHaveLength(6)
      shelves.forEach(shelf => {
        expect(shelf.cursor.rollOver).toBe('GoForward')
        expect(shelf.cursor.dragRollover).toBe('DropForward')
      })
    })

    test('zone IDs are consecutive 301-307', () => {
      const ids = NAV_ZONES.map(z => z.id).sort((a, b) => a - b)
      expect(ids).toEqual([301, 302, 303, 304, 305, 306, 307])
    })

    test('each zone has required properties', () => {
      NAV_ZONES.forEach(zone => {
        expect(zone).toHaveProperty('id')
        expect(zone).toHaveProperty('rect')
        expect(zone).toHaveProperty('clickFrame')
        expect(zone).toHaveProperty('cursor')
        expect(zone).toHaveProperty('dragToWhere')
      })
    })
  })

  // ===========================================================================
  // SPRITE_LIST constant
  // ===========================================================================

  describe('SPRITE_LIST', () => {
    test('Sky sprite is channel 1', () => {
      expect(SPRITE_LIST.Sky).toBe(1)
    })

    test('Mulle sprite is channel 4', () => {
      expect(SPRITE_LIST.Mulle).toBe(4)
    })

    test('JunkStart sprite is channel 7', () => {
      expect(SPRITE_LIST.JunkStart).toBe(7)
    })

    test('Gift sprite is channel 38', () => {
      expect(SPRITE_LIST.Gift).toBe(38)
    })

    test('dialog sprite is channel 40', () => {
      expect(SPRITE_LIST.dialog).toBe(40)
    })

    test('DialogOverlay sprite is channel 41', () => {
      expect(SPRITE_LIST.DialogOverlay).toBe(41)
    })

    test('DragPart sprite is channel 100', () => {
      expect(SPRITE_LIST.DragPart).toBe(100)
    })

    test('has exactly 7 sprite entries', () => {
      expect(Object.keys(SPRITE_LIST)).toHaveLength(7)
    })
  })

  // ===========================================================================
  // computeGiftCollection
  // ===========================================================================

  describe('computeGiftCollection', () => {
    test('returns empty gifts array for empty input', () => {
      const result = computeGiftCollection([])
      expect(result.gifts).toEqual([])
    })

    test('returns goFrame "Gift"', () => {
      const result = computeGiftCollection([])
      expect(result.goFrame).toBe('Gift')
    })

    test('returns single gift for single-item input', () => {
      const result = computeGiftCollection([42])
      expect(result.gifts).toEqual([42])
    })

    test('returns multiple gifts for multi-item input', () => {
      const result = computeGiftCollection([10, 20, 30])
      expect(result.gifts).toEqual([10, 20, 30])
    })

    test('preserves gift order', () => {
      const result = computeGiftCollection([5, 3, 8, 1])
      expect(result.gifts).toEqual([5, 3, 8, 1])
    })

    test('returns a copy of the gifts array (not the original)', () => {
      const original = [1, 2, 3]
      const result = computeGiftCollection(original)
      expect(result.gifts).not.toBe(original)
      expect(result.gifts).toEqual(original)
    })

    test('modifying returned gifts does not affect original', () => {
      const original = [1, 2, 3]
      const result = computeGiftCollection(original)
      result.gifts.push(4)
      expect(original).toEqual([1, 2, 3])
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Guard conditions
  // ===========================================================================

  describe('resolveDialogPriority - guard conditions', () => {
    test('returns null when okToTalk is false', () => {
      const result = resolveDialogPriority({
        okToTalk: false,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result).toBeNull()
    })

    test('returns null when dialogClosed is false', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: false,
        gotNewParts: true,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result).toBeNull()
    })

    test('returns null when both okToTalk and dialogClosed are false', () => {
      const result = resolveDialogPriority({
        okToTalk: false,
        dialogClosed: false,
        gotNewParts: true,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result).toBeNull()
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Priority 1: gotNewParts
  // ===========================================================================

  describe('resolveDialogPriority - gotNewParts (priority 1)', () => {
    test('gotNewParts triggers dorisDialogList', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.dialogList).toBe('dorisDialogList')
    })

    test('gotNewParts uses InfoTalk type', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.talkType).toBe('InfoTalk')
    })

    test('gotNewParts sets resetGotNewParts true', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.resetGotNewParts).toBe(true)
    })

    test('gotNewParts wins over gotGifts', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.dialogList).toBe('dorisDialogList')
    })

    test('gotNewParts wins over firstTime', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.dialogList).toBe('dorisDialogList')
    })

    test('gotNewParts in firstTime context uses firstTime counter range', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.newLoopCounter).toEqual({ min: 121, max: 240 })
    })

    test('gotNewParts in normal context uses normal counter range', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.newLoopCounter).toEqual({ min: 361, max: 1080 })
    })

    test('gotNewParts does not consume from list', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.consumeFromList).toBe(false)
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Priority 2: gotGifts
  // ===========================================================================

  describe('resolveDialogPriority - gotGifts (priority 2)', () => {
    test('gotGifts triggers giftDialogList when no gotNewParts', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.dialogList).toBe('giftDialogList')
    })

    test('gotGifts uses InfoTalk type', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.talkType).toBe('InfoTalk')
    })

    test('gotGifts sets resetGotGifts true', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.resetGotGifts).toBe(true)
    })

    test('gotGifts wins over firstTime dialog', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.dialogList).toBe('giftDialogList')
    })

    test('gotGifts in firstTime context uses firstTime counter range', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.newLoopCounter).toEqual({ min: 121, max: 240 })
    })

    test('gotGifts in normal context uses normal counter range', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.newLoopCounter).toEqual({ min: 361, max: 1080 })
    })

    test('gotGifts does not consume from list', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.consumeFromList).toBe(false)
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Priority 3: firstTime dialog
  // ===========================================================================

  describe('resolveDialogPriority - firstTime dialog (priority 3)', () => {
    test('firstTime with loopCounter=0 triggers firstDialogList', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.dialogList).toBe('firstDialogList')
    })

    test('firstTime dialog consumes from list', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.consumeFromList).toBe(true)
    })

    test('firstTime dialog uses InfoTalk type', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.talkType).toBe('InfoTalk')
    })

    test('firstTime dialog uses firstTime counter range [121, 240]', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.newLoopCounter).toEqual({ min: 121, max: 240 })
    })

    test('firstTime with loopCounter>0 returns null', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 1,
        firstDialogListLength: 4
      })
      expect(result).toBeNull()
    })

    test('firstTime with loopCounter=100 returns null', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 100,
        firstDialogListLength: 4
      })
      expect(result).toBeNull()
    })

    test('firstTime with empty list sets endFirstTime true (no dialog)', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.endFirstTime).toBe(true)
      expect(result.dialogList).toBeNull()
    })

    test('consuming last item from firstDialogList sets endFirstTime true', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 1
      })
      expect(result.dialogList).toBe('firstDialogList')
      expect(result.endFirstTime).toBe(true)
    })

    test('consuming non-last item does not set endFirstTime', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 2
      })
      expect(result.dialogList).toBe('firstDialogList')
      expect(result.endFirstTime).toBe(false)
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Priority 4: general idle dialog
  // ===========================================================================

  describe('resolveDialogPriority - general dialog (priority 4)', () => {
    test('non-firstTime with loopCounter=0 triggers genDialogList', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.dialogList).toBe('genDialogList')
    })

    test('general dialog uses InfoTalk type', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.talkType).toBe('InfoTalk')
    })

    test('general dialog uses normal counter range [361, 1080]', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.newLoopCounter).toEqual({ min: 361, max: 1080 })
    })

    test('general dialog does not consume from list', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.consumeFromList).toBe(false)
    })

    test('non-firstTime with loopCounter>0 returns null', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: false,
        loopCounter: 1,
        firstDialogListLength: 0
      })
      expect(result).toBeNull()
    })

    test('non-firstTime with loopCounter=500 returns null', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: false,
        loopCounter: 500,
        firstDialogListLength: 0
      })
      expect(result).toBeNull()
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Loop counter ranges
  // ===========================================================================

  describe('resolveDialogPriority - loop counter ranges', () => {
    test('firstTime counter range is [121, 240] (120 + random(120))', () => {
      // 120 + random(120) where random returns 1-120
      // So range is 120+1=121 to 120+120=240
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(result.newLoopCounter.min).toBe(121)
      expect(result.newLoopCounter.max).toBe(240)
    })

    test('normal counter range is [361, 1080] (360 + random(720))', () => {
      // 360 + random(720) where random returns 1-720
      // So range is 360+1=361 to 360+720=1080
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.newLoopCounter.min).toBe(361)
      expect(result.newLoopCounter.max).toBe(1080)
    })
  })

  // ===========================================================================
  // resolveDialogPriority - Return value shape
  // ===========================================================================

  describe('resolveDialogPriority - return value shape', () => {
    test('non-null result has all required properties', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result).toHaveProperty('dialogList')
      expect(result).toHaveProperty('talkType')
      expect(result).toHaveProperty('consumeFromList')
      expect(result).toHaveProperty('resetGotNewParts')
      expect(result).toHaveProperty('resetGotGifts')
      expect(result).toHaveProperty('endFirstTime')
      expect(result).toHaveProperty('newLoopCounter')
    })

    test('newLoopCounter has min and max properties', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: false,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      expect(result.newLoopCounter).toHaveProperty('min')
      expect(result.newLoopCounter).toHaveProperty('max')
    })
  })

  // ===========================================================================
  // computeInitState
  // ===========================================================================

  describe('computeInitState', () => {
    test('first-time visit sets loopCounter to 12', () => {
      const result = computeInitState(true, 200)
      expect(result.loopCounter).toBe(12)
    })

    test('first-time visit sets firstTimeCleared to true', () => {
      const result = computeInitState(true, 200)
      expect(result.firstTimeCleared).toBe(true)
    })

    test('first-time visit ignores randomValue parameter', () => {
      const result1 = computeInitState(true, 1)
      const result2 = computeInitState(true, 360)
      expect(result1.loopCounter).toBe(12)
      expect(result2.loopCounter).toBe(12)
    })

    test('return visit uses randomValue for loopCounter', () => {
      const result = computeInitState(false, 200)
      expect(result.loopCounter).toBe(200)
    })

    test('return visit with randomValue 1 (minimum)', () => {
      const result = computeInitState(false, 1)
      expect(result.loopCounter).toBe(1)
    })

    test('return visit with randomValue 360 (maximum)', () => {
      const result = computeInitState(false, 360)
      expect(result.loopCounter).toBe(360)
    })

    test('return visit sets firstTimeCleared to false', () => {
      const result = computeInitState(false, 100)
      expect(result.firstTimeCleared).toBe(false)
    })

    test('return value has loopCounter and firstTimeCleared properties', () => {
      const result = computeInitState(false, 100)
      expect(result).toHaveProperty('loopCounter')
      expect(result).toHaveProperty('firstTimeCleared')
    })
  })

  // ===========================================================================
  // Integration scenarios
  // ===========================================================================

  describe('integration scenarios', () => {
    test('complete first-time visit flow', () => {
      // First visit: loopCounter=12, firstTime cleared
      const init = computeInitState(true, 200)
      expect(init.loopCounter).toBe(12)
      expect(init.firstTimeCleared).toBe(true)

      // After 12 frames, counter reaches 0, first dialog should trigger
      const dialog1 = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: false,
        firstTime: true, // Still in firstTime mode
        loopCounter: 0,
        firstDialogListLength: 4
      })
      expect(dialog1.dialogList).toBe('firstDialogList')
      expect(dialog1.consumeFromList).toBe(true)
    })

    test('gifts arriving during first-time visit', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: false,
        gotGifts: true,
        firstTime: true,
        loopCounter: 0,
        firstDialogListLength: 4
      })
      // gotGifts takes priority over firstTime idle dialog
      expect(result.dialogList).toBe('giftDialogList')
      // But counter uses firstTime range
      expect(result.newLoopCounter).toEqual({ min: 121, max: 240 })
    })

    test('new parts arriving with gifts', () => {
      const result = resolveDialogPriority({
        okToTalk: true,
        dialogClosed: true,
        gotNewParts: true,
        gotGifts: true,
        firstTime: false,
        loopCounter: 0,
        firstDialogListLength: 0
      })
      // gotNewParts takes priority
      expect(result.dialogList).toBe('dorisDialogList')
      expect(result.resetGotNewParts).toBe(true)
      expect(result.resetGotGifts).toBe(false) // gotGifts not cleared yet
    })
  })
})
