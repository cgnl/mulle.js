/**
 * @fileoverview YardData - Pure data module for Yard scene (scene 03)
 * Based on: decompiled_lingo/03/03/casts/Internal/ParentScript 2 - Dir.ls
 *
 * The Yard is the main junkyard area where Mulle Meck stores parts. The scene
 * handles:
 *   - Gift collection from Doris Digital
 *   - Dialog priority system for Mulle's commentary
 *   - Navigation to shelves and quay
 *
 * Dialog Priority (checked each frame when OKToTalk=1 and dialogClosed=1):
 *   1. gotNewParts → random from dorisDialogList, reset counter
 *   2. gotGifts → random from giftDialogList, clear gotGifts, reset counter
 *   3. FirstTime AND loopCounter=0 → consume from firstDialogList (random pick,
 *      then delete). When list exhausted → set FirstTime=0
 *   4. NOT FirstTime AND loopCounter=0 → random from genDialogList, reset counter
 *
 * Counter reset ranges:
 *   - FirstTime context: 120 + random(120) → [121, 240]
 *   - Normal context: 360 + random(720) → [361, 1080]
 */

'use strict'

/**
 * Dialog lists from the original Lingo.
 * - giftDialogList: played when player has gifts to collect
 * - firstDialogList: consumed one-by-one on first visits (random pick, then removed)
 * - genDialogList: general idle dialog (random pick)
 * - dorisDialogList: played when new parts were just received
 */
const DIALOG_LISTS = {
  giftDialogList: ['GiftSnd1', 'GiftSnd2', 'GiftSnd3'],
  firstDialogList: ['03d001v0', '03d002v0', '03d006v0', '03d007v0'],
  genDialogList: ['00d001v0', '00d002v0', '00d003v0', '00d004v0', '00d005v0'],
  dorisDialogList: ['03d003v0', '03d004v0', '03d005v0']
}

/**
 * Navigation zones from the original Lingo init handler.
 * Each zone has a rect (x1, y1, x2, y2), id, click frame target, and cursor types.
 */
const NAV_ZONES = [
  {
    id: 301,
    rect: [29, 0, 124, 300],
    clickFrame: 'Quay',
    cursor: { rollOver: 'GoLeft', dragRollover: 'DropLeft' },
    dragToWhere: 'Quay'
  },
  {
    id: 302,
    rect: [131, 43, 206, 307],
    clickFrame: 'Shelf1',
    cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
    dragToWhere: 'Shelf1'
  },
  {
    id: 303,
    rect: [207, 40, 288, 314],
    clickFrame: 'Shelf2',
    cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
    dragToWhere: 'Shelf2'
  },
  {
    id: 304,
    rect: [289, 34, 380, 322],
    clickFrame: 'Shelf3',
    cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
    dragToWhere: 'Shelf3'
  },
  {
    id: 305,
    rect: [381, 31, 479, 329],
    clickFrame: 'Shelf4',
    cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
    dragToWhere: 'Shelf4'
  },
  {
    id: 306,
    rect: [480, 28, 579, 335],
    clickFrame: 'Shelf5',
    cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
    dragToWhere: 'Shelf5'
  },
  {
    id: 307,
    rect: [580, 25, 640, 343],
    clickFrame: 'Shelf6',
    cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
    dragToWhere: 'Shelf6'
  }
]

/**
 * Sprite list from the original Lingo.
 * Maps sprite names to their channel numbers.
 */
const SPRITE_LIST = {
  Sky: 1,
  Mulle: 4,
  JunkStart: 7,
  Gift: 38,
  dialog: 40,
  DialogOverlay: 41,
  DragPart: 100
}

/**
 * Compute gift collection result.
 * When the player clicks on the gift box, all gifts are transferred to inventory/junk.
 *
 * The original Lingo tries addJunkPart first; if that fails (returns 0),
 * it calls addNewPart. Since this is a pure-function module, we just return
 * the gift IDs and let the caller handle the side effects.
 *
 * @param {number[]} gifts - Array of part IDs in the gift box
 * @returns {{ gifts: number[], goFrame: string }}
 */
function computeGiftCollection (gifts) {
  return {
    gifts: [...gifts],
    goFrame: 'Gift'
  }
}

/**
 * Resolve which dialog should play based on current state.
 * Follows the EXACT priority logic from the original Lingo loop handler.
 *
 * Priority order:
 *   1. gotNewParts → dorisDialogList
 *   2. gotGifts → giftDialogList
 *   3. firstTime AND loopCounter=0 AND firstDialogList not empty → firstDialogList
 *   4. NOT firstTime AND loopCounter=0 → genDialogList
 *
 * @param {object} state
 * @param {boolean} state.okToTalk - Whether dialog is allowed (OKToTalk flag)
 * @param {boolean} state.dialogClosed - Whether previous dialog has finished
 * @param {boolean} state.gotNewParts - Whether new parts were just received
 * @param {boolean} state.gotGifts - Whether there are gifts to collect
 * @param {boolean} state.firstTime - Whether this is a first-time visit
 * @param {number} state.loopCounter - Frame counter (0 = ready for timed dialog)
 * @param {number} state.firstDialogListLength - Remaining items in firstDialogList
 * @returns {object|null} Dialog result or null if no dialog should play
 */
function resolveDialogPriority (state) {
  const {
    okToTalk,
    dialogClosed,
    gotNewParts,
    gotGifts,
    firstTime,
    loopCounter,
    firstDialogListLength
  } = state

  // Guard: no dialog if not allowed to talk or previous dialog still playing
  if (!okToTalk || !dialogClosed) {
    return null
  }

  // Priority 1: gotNewParts
  if (gotNewParts) {
    return {
      dialogList: 'dorisDialogList',
      talkType: 'InfoTalk',
      consumeFromList: false,
      resetGotNewParts: true,
      resetGotGifts: false,
      endFirstTime: false,
      newLoopCounter: firstTime ? { min: 121, max: 240 } : { min: 361, max: 1080 }
    }
  }

  // Priority 2: gotGifts
  if (gotGifts) {
    return {
      dialogList: 'giftDialogList',
      talkType: 'InfoTalk',
      consumeFromList: false,
      resetGotNewParts: false,
      resetGotGifts: true,
      endFirstTime: false,
      newLoopCounter: firstTime ? { min: 121, max: 240 } : { min: 361, max: 1080 }
    }
  }

  // Priority 3: firstTime idle dialog
  if (firstTime) {
    if (loopCounter === 0) {
      if (firstDialogListLength > 0) {
        // Consume from firstDialogList
        // When length becomes 0 after this consumption, endFirstTime will be handled
        // by checking if this was the last item
        const isLastItem = firstDialogListLength === 1
        return {
          dialogList: 'firstDialogList',
          talkType: 'InfoTalk',
          consumeFromList: true,
          resetGotNewParts: false,
          resetGotGifts: false,
          endFirstTime: isLastItem,
          newLoopCounter: { min: 121, max: 240 }
        }
      } else {
        // List exhausted, end first time mode (no dialog this frame)
        return {
          dialogList: null,
          talkType: null,
          consumeFromList: false,
          resetGotNewParts: false,
          resetGotGifts: false,
          endFirstTime: true,
          newLoopCounter: null
        }
      }
    }
    // loopCounter > 0, no dialog yet
    return null
  }

  // Priority 4: general idle dialog (not firstTime)
  if (loopCounter === 0) {
    return {
      dialogList: 'genDialogList',
      talkType: 'InfoTalk',
      consumeFromList: false,
      resetGotNewParts: false,
      resetGotGifts: false,
      endFirstTime: false,
      newLoopCounter: { min: 361, max: 1080 }
    }
  }

  // loopCounter > 0, no dialog
  return null
}

/**
 * Compute initial state for the Yard scene.
 * Follows the EXACT logic from the original Lingo new() handler.
 *
 * - loopCounter starts at random(360) → [1, 360]
 * - If isFirstTime is true: loopCounter=12, firstTimeList flag cleared
 *
 * @param {boolean} isFirstTime - Whether this is a first-time visit to Yard
 * @param {number} randomValue - Random value in range [1, 360] for non-firstTime
 * @returns {{ loopCounter: number, firstTimeCleared: boolean }}
 */
function computeInitState (isFirstTime, randomValue) {
  if (isFirstTime) {
    return {
      loopCounter: 12,
      firstTimeCleared: true
    }
  }

  return {
    loopCounter: randomValue,
    firstTimeCleared: false
  }
}

module.exports = {
  DIALOG_LISTS,
  NAV_ZONES,
  SPRITE_LIST,
  computeGiftCollection,
  resolveDialogPriority,
  computeInitState
}
