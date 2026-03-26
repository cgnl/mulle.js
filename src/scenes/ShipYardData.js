/**
 * @fileoverview ShipYardData - Pure data module for ShipYard scene (scene 01)
 * Based on: ParentScript 4 - Dir.ls (scene 01 ShipYard)
 *
 * Scene 01 is the ShipYard where the player first arrives and can browse
 * materials/zones before heading to the Quay to build. The scene handles:
 *
 *   - First-time and second-visit dialogue sequences
 *   - General idle dialogue
 *   - Priority talk when dragging to Quay without a hull
 *   - Zone rollover sound effects (wood, metal, blueprint, quay areas)
 *   - Preload ambient/effect sounds
 *
 * Dialog Priority:
 *   1. FirstTime visit → consume from firstDialogList
 *   2. SecondShipYard visit → play from secondDialogList
 *   3. General idle → random from genDialogList
 *   4. Priority talk (01d007v0) → drag to Quay without hull
 */

'use strict'

// ============================================================================
// DIALOG LISTS (from ParentScript 4 - Dir.ls, scene 01 ShipYard)
// ============================================================================

/** First-time visit dialogue - consumed one-by-one */
const FIRST_DIALOG_LIST = ['01d009v0']

/** Second visit dialogue list - played in sequence on return visits */
const SECOND_DIALOG_LIST = ['01d001v0', '01d003v0', '01d002v0']

/** General idle dialogue - random selection, not consumed */
const GEN_DIALOG_LIST = ['01d004v0', '01d005v0', '01d006v0']

/** Priority talk: trying to drag to Quay without a hull */
const NO_HULL_DRAG_SOUND = '01d007v0'

// ============================================================================
// ZONE ROLLOVER EFFECTS (from ParentScript 4 - Dir.ls, scene 01 ShipYard)
// ============================================================================

/**
 * Sound effects for zone enter/leave rollovers.
 * Mapped by zone name for easy lookup.
 */
const ZONE_ROLLOVER_SOUNDS = {
  wood:      { enter: '01e001v0', leave: '01e006v0' },
  metal:     { enter: '01e002v0', leave: '01e007v0' },
  blueprint: { enter: '01e003v0', leave: null },
  quay:      { enter: '01e005v0', leave: null }
}

// ============================================================================
// PRELOAD EFFECTS (from ParentScript 4 - Dir.ls, scene 01 ShipYard)
// ============================================================================

/** Effect sounds to preload for this scene */
const PRELOAD_EFFECTS = ['01e008v0', '01e009v0', '01e010v0']

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  // Dialog lists
  FIRST_DIALOG_LIST,
  SECOND_DIALOG_LIST,
  GEN_DIALOG_LIST,

  // Priority talk
  NO_HULL_DRAG_SOUND,

  // Zone rollover sounds
  ZONE_ROLLOVER_SOUNDS,

  // Preload effects
  PRELOAD_EFFECTS
}
