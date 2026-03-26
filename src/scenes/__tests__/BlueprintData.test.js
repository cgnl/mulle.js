/**
 * @fileoverview Tests for BlueprintData - Blueprint scene data & logic
 * Based on: Original Lingo scripts from boten_15.DXR
 * 
 * Tests the pure-data module that maps hull variants to sprites, sounds,
 * and rudder IDs according to the original Director binary data.
 * 
 * Original system: 4 hull variants per size (Small/Medium/Large),
 * each variant has a wood+metal hull pair and its own rudder.
 */

const BlueprintData = require('../BlueprintData')

describe('BlueprintData', () => {
  // =========================================================================
  // HULL VARIANT DATA (from Director score binary)
  // =========================================================================

  describe('HULL_VARIANTS', () => {
    test('should have 3 size categories', () => {
      const variants = BlueprintData.HULL_VARIANTS
      expect(variants).toHaveProperty('Small')
      expect(variants).toHaveProperty('Medium')
      expect(variants).toHaveProperty('Large')
    })

    test('should have 4 variants per size', () => {
      expect(BlueprintData.HULL_VARIANTS.Small).toHaveLength(4)
      expect(BlueprintData.HULL_VARIANTS.Medium).toHaveLength(4)
      expect(BlueprintData.HULL_VARIANTS.Large).toHaveLength(4)
    })

    describe('Small variants', () => {
      test('variant 0: wood=92, metal=730, rudder=842', () => {
        const v = BlueprintData.HULL_VARIANTS.Small[0]
        expect(v.woodHullID).toBe(92)
        expect(v.metalHullID).toBe(730)
        expect(v.rudderPartID).toBe(842)
        expect(v.defaultMaterial).toBe('Wood')
      })

      test('variant 1: wood=734, metal=731, rudder=827', () => {
        const v = BlueprintData.HULL_VARIANTS.Small[1]
        expect(v.woodHullID).toBe(734)
        expect(v.metalHullID).toBe(731)
        expect(v.rudderPartID).toBe(827)
      })

      test('variant 2: wood=735, metal=732, rudder=825', () => {
        const v = BlueprintData.HULL_VARIANTS.Small[2]
        expect(v.woodHullID).toBe(735)
        expect(v.metalHullID).toBe(732)
        expect(v.rudderPartID).toBe(825)
      })

      test('variant 3: wood=736, metal=733, rudder=829', () => {
        const v = BlueprintData.HULL_VARIANTS.Small[3]
        expect(v.woodHullID).toBe(736)
        expect(v.metalHullID).toBe(733)
        expect(v.rudderPartID).toBe(829)
      })
    })

    describe('Medium variants', () => {
      test('variant 0: wood=726, metal=45, rudder=844', () => {
        const v = BlueprintData.HULL_VARIANTS.Medium[0]
        expect(v.woodHullID).toBe(726)
        expect(v.metalHullID).toBe(45)
        expect(v.rudderPartID).toBe(844)
        expect(v.defaultMaterial).toBe('Wood')
      })

      test('variant 1: wood=727, metal=723, rudder=846', () => {
        const v = BlueprintData.HULL_VARIANTS.Medium[1]
        expect(v.woodHullID).toBe(727)
        expect(v.metalHullID).toBe(723)
        expect(v.rudderPartID).toBe(846)
      })

      test('variant 2: wood=728, metal=724, rudder=848', () => {
        const v = BlueprintData.HULL_VARIANTS.Medium[2]
        expect(v.woodHullID).toBe(728)
        expect(v.metalHullID).toBe(724)
        expect(v.rudderPartID).toBe(848)
      })

      test('variant 3: wood=729, metal=725, rudder=850', () => {
        const v = BlueprintData.HULL_VARIANTS.Medium[3]
        expect(v.woodHullID).toBe(729)
        expect(v.metalHullID).toBe(725)
        expect(v.rudderPartID).toBe(850)
      })
    })

    describe('Large variants', () => {
      test('variant 0: wood=719, metal=716, rudder=818', () => {
        const v = BlueprintData.HULL_VARIANTS.Large[0]
        expect(v.woodHullID).toBe(719)
        expect(v.metalHullID).toBe(716)
        expect(v.rudderPartID).toBe(818)
        expect(v.defaultMaterial).toBe('Metal')
      })

      test('variant 1: wood=720, metal=1, rudder=820', () => {
        const v = BlueprintData.HULL_VARIANTS.Large[1]
        expect(v.woodHullID).toBe(720)
        expect(v.metalHullID).toBe(1)
        expect(v.rudderPartID).toBe(820)
      })

      test('variant 2: wood=721, metal=717, rudder=822', () => {
        const v = BlueprintData.HULL_VARIANTS.Large[2]
        expect(v.woodHullID).toBe(721)
        expect(v.metalHullID).toBe(717)
        expect(v.rudderPartID).toBe(822)
      })

      test('variant 3: wood=722, metal=718, rudder=824', () => {
        const v = BlueprintData.HULL_VARIANTS.Large[3]
        expect(v.woodHullID).toBe(722)
        expect(v.metalHullID).toBe(718)
        expect(v.rudderPartID).toBe(824)
      })
    })

    test('Large defaults to Metal, Small and Medium default to Wood', () => {
      for (const v of BlueprintData.HULL_VARIANTS.Small) {
        expect(v.defaultMaterial).toBe('Wood')
      }
      for (const v of BlueprintData.HULL_VARIANTS.Medium) {
        expect(v.defaultMaterial).toBe('Wood')
      }
      for (const v of BlueprintData.HULL_VARIANTS.Large) {
        expect(v.defaultMaterial).toBe('Metal')
      }
    })
  })

  // =========================================================================
  // SPRITE MEMBER MAPPINGS (from Director score binary)
  // =========================================================================

  describe('Hull sprite mappings', () => {
    test('each variant should have selHullPic and rollHullPic', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(v.selHullPic).toBeDefined()
          expect(v.rollHullPic).toBeDefined()
          expect(typeof v.selHullPic).toBe('string')
          expect(typeof v.rollHullPic).toBe('string')
        }
      }
    })

    test('Small hull selected pics: 15b011-014', () => {
      const pics = BlueprintData.HULL_VARIANTS.Small.map(v => v.selHullPic)
      expect(pics).toEqual(['15b011v0', '15b012v0', '15b013v0', '15b014v0'])
    })

    test('Small hull rollover pics: 15b048-051', () => {
      const pics = BlueprintData.HULL_VARIANTS.Small.map(v => v.rollHullPic)
      expect(pics).toEqual(['15b048v0', '15b049v0', '15b050v0', '15b051v0'])
    })

    test('Medium hull selected pics: 15b040-043', () => {
      const pics = BlueprintData.HULL_VARIANTS.Medium.map(v => v.selHullPic)
      expect(pics).toEqual(['15b040v0', '15b041v0', '15b042v0', '15b043v0'])
    })

    test('Medium hull rollover pics: 15b056-059', () => {
      const pics = BlueprintData.HULL_VARIANTS.Medium.map(v => v.rollHullPic)
      expect(pics).toEqual(['15b056v0', '15b057v0', '15b058v0', '15b059v0'])
    })

    test('Large hull selected pics: 15b044-047', () => {
      const pics = BlueprintData.HULL_VARIANTS.Large.map(v => v.selHullPic)
      expect(pics).toEqual(['15b044v0', '15b045v0', '15b046v0', '15b047v0'])
    })

    test('Large hull rollover pics: 15b065-068', () => {
      const pics = BlueprintData.HULL_VARIANTS.Large.map(v => v.rollHullPic)
      expect(pics).toEqual(['15b065v0', '15b066v0', '15b067v0', '15b068v0'])
    })
  })

  describe('Rudder sprite mappings', () => {
    test('each variant should have selRudderPic and rollRudderPic', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(v.selRudderPic).toBeDefined()
          expect(v.rollRudderPic).toBeDefined()
        }
      }
    })

    test('Small rudder selected pics: 15b015, 017, 019, 021', () => {
      const pics = BlueprintData.HULL_VARIANTS.Small.map(v => v.selRudderPic)
      expect(pics).toEqual(['15b015v0', '15b017v0', '15b019v0', '15b021v0'])
    })

    test('Small rudder rollover pics: 15b052-055', () => {
      const pics = BlueprintData.HULL_VARIANTS.Small.map(v => v.rollRudderPic)
      expect(pics).toEqual(['15b052v0', '15b053v0', '15b054v0', '15b055v0'])
    })

    test('Medium rudder selected pics: 15b023, 025, 027, 029', () => {
      const pics = BlueprintData.HULL_VARIANTS.Medium.map(v => v.selRudderPic)
      expect(pics).toEqual(['15b023v0', '15b025v0', '15b027v0', '15b029v0'])
    })

    test('Medium rudder rollover pics: 15b060, 061, 063, 064', () => {
      const pics = BlueprintData.HULL_VARIANTS.Medium.map(v => v.rollRudderPic)
      expect(pics).toEqual(['15b060v0', '15b061v0', '15b063v0', '15b064v0'])
    })

    test('Large rudder selected pics: 15b031, 033, 035, 037', () => {
      const pics = BlueprintData.HULL_VARIANTS.Large.map(v => v.selRudderPic)
      expect(pics).toEqual(['15b031v0', '15b033v0', '15b035v0', '15b037v0'])
    })

    test('Large rudder rollover pics: 15b069-072', () => {
      const pics = BlueprintData.HULL_VARIANTS.Large.map(v => v.rollRudderPic)
      expect(pics).toEqual(['15b069v0', '15b070v0', '15b071v0', '15b072v0'])
    })
  })

  // =========================================================================
  // SOUND MAPPINGS
  // =========================================================================

  describe('Hull sounds', () => {
    test('each variant should have a hullSound', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(v.hullSound).toBeDefined()
          expect(typeof v.hullSound).toBe('string')
        }
      }
    })

    test('Small hull sounds: 15d015-018', () => {
      const sounds = BlueprintData.HULL_VARIANTS.Small.map(v => v.hullSound)
      expect(sounds).toEqual(['15d015v0', '15d016v0', '15d017v0', '15d018v0'])
    })

    test('Medium hull sounds: 15d019-022', () => {
      const sounds = BlueprintData.HULL_VARIANTS.Medium.map(v => v.hullSound)
      expect(sounds).toEqual(['15d019v0', '15d020v0', '15d021v0', '15d022v0'])
    })

    test('Large hull sounds: 15d003-006', () => {
      const sounds = BlueprintData.HULL_VARIANTS.Large.map(v => v.hullSound)
      expect(sounds).toEqual(['15d003v0', '15d004v0', '15d005v0', '15d006v0'])
    })
  })

  describe('Page background sounds (HullBackgroundBH)', () => {
    test('should have correct page sounds', () => {
      expect(BlueprintData.PAGE_SOUNDS.Menu).toBe('15d011v0')
      expect(BlueprintData.PAGE_SOUNDS.Large).toBe('15d012v0')
      expect(BlueprintData.PAGE_SOUNDS.Medium).toBe('15d013v0')
      expect(BlueprintData.PAGE_SOUNDS.Small).toBe('15d014v0')
    })
  })

  describe('Sound effects', () => {
    test('should define standard sound IDs', () => {
      expect(BlueprintData.SOUNDS.select).toBe('15e001v0')
      expect(BlueprintData.SOUNDS.pageSwitch).toBe('15e002v0')
      expect(BlueprintData.SOUNDS.deselect).toBe('15e004v0')
      expect(BlueprintData.SOUNDS.exit).toBe('15e005v0')
      expect(BlueprintData.SOUNDS.incompatible).toBe('15d028v0')
      expect(BlueprintData.SOUNDS.rudderWithoutHull).toBe('15d027v0')
    })
  })

  // =========================================================================
  // TAB BUTTONS (MainMenuBH)
  // =========================================================================

  describe('TAB_BUTTONS', () => {
    test('should have Small/Medium/Large tabs', () => {
      expect(BlueprintData.TAB_BUTTONS).toHaveProperty('Small')
      expect(BlueprintData.TAB_BUTTONS).toHaveProperty('Medium')
      expect(BlueprintData.TAB_BUTTONS).toHaveProperty('Large')
    })

    test('Small tab sprites and inventory check', () => {
      const tab = BlueprintData.TAB_BUTTONS.Small
      expect(tab.normalPic).toBe('15b002v0')
      expect(tab.rollOverPic).toBe('15b003v0')
      expect(tab.rollOverSound).toBe('15d008v0')
      expect(tab.inventoryCheck).toBe('Blueprint1')
    })

    test('Medium tab sprites and inventory check', () => {
      const tab = BlueprintData.TAB_BUTTONS.Medium
      expect(tab.normalPic).toBe('15b004v0')
      expect(tab.rollOverPic).toBe('15b005v0')
      expect(tab.rollOverSound).toBe('15d009v0')
      expect(tab.inventoryCheck).toBe('Blueprint2')
    })

    test('Large tab sprites and inventory check', () => {
      const tab = BlueprintData.TAB_BUTTONS.Large
      expect(tab.normalPic).toBe('15b006v0')
      expect(tab.rollOverPic).toBe('15b007v0')
      expect(tab.rollOverSound).toBe('15d010v0')
      expect(tab.inventoryCheck).toBe('Blueprint3')
    })
  })

  // =========================================================================
  // INFO BUTTONS (InfoButtonBH)
  // =========================================================================

  describe('INFO_BUTTON', () => {
    test('all info buttons use same normal/rollover sprites', () => {
      expect(BlueprintData.INFO_BUTTON.normalPic).toBe('15b073v0')
      expect(BlueprintData.INFO_BUTTON.rollOverPic).toBe('15b074v0')
    })
  })

  describe('Info button sounds per variant', () => {
    test('Small info sounds match hull sounds (15d015-018)', () => {
      const sounds = BlueprintData.HULL_VARIANTS.Small.map(v => v.hullSound)
      expect(sounds).toEqual(['15d015v0', '15d016v0', '15d017v0', '15d018v0'])
    })

    test('Medium info sounds match hull sounds (15d019-022)', () => {
      const sounds = BlueprintData.HULL_VARIANTS.Medium.map(v => v.hullSound)
      expect(sounds).toEqual(['15d019v0', '15d020v0', '15d021v0', '15d022v0'])
    })

    test('Large info sounds match hull sounds (15d003-006)', () => {
      const sounds = BlueprintData.HULL_VARIANTS.Large.map(v => v.hullSound)
      expect(sounds).toEqual(['15d003v0', '15d004v0', '15d005v0', '15d006v0'])
    })
  })

  // =========================================================================
  // SPRITE CHANNEL ASSIGNMENTS (from Dir.ls)
  // =========================================================================

  describe('SPRITE_CHANNELS', () => {
    test('should have correct channel assignments', () => {
      expect(BlueprintData.SPRITE_CHANNELS.CurrentHull).toBe(7)
      expect(BlueprintData.SPRITE_CHANNELS.CurrentRudder).toBe(8)
      expect(BlueprintData.SPRITE_CHANNELS.rollOver).toBe(10)
    })
  })

  // =========================================================================
  // HULL SIZE LISTS (from BoatViewHandler)
  // =========================================================================

  describe('HULL_LISTS', () => {
    test('Large list matches BoatViewHandler', () => {
      expect(BlueprintData.HULL_LISTS.Large).toEqual([1, 716, 717, 718, 719, 720, 721, 722])
    })

    test('Medium list matches BoatViewHandler', () => {
      expect(BlueprintData.HULL_LISTS.Medium).toEqual([45, 723, 724, 725, 726, 727, 728, 729])
    })

    test('Small list matches BoatViewHandler', () => {
      expect(BlueprintData.HULL_LISTS.Small).toEqual([92, 730, 731, 732, 733, 734, 735, 736])
    })
  })

  // =========================================================================
  // LOOKUP HELPERS
  // =========================================================================

  describe('getHullSize()', () => {
    test('returns Small for small hull IDs', () => {
      expect(BlueprintData.getHullSize(92)).toBe('Small')
      expect(BlueprintData.getHullSize(730)).toBe('Small')
      expect(BlueprintData.getHullSize(736)).toBe('Small')
    })

    test('returns Medium for medium hull IDs', () => {
      expect(BlueprintData.getHullSize(45)).toBe('Medium')
      expect(BlueprintData.getHullSize(723)).toBe('Medium')
      expect(BlueprintData.getHullSize(729)).toBe('Medium')
    })

    test('returns Large for large hull IDs', () => {
      expect(BlueprintData.getHullSize(1)).toBe('Large')
      expect(BlueprintData.getHullSize(716)).toBe('Large')
      expect(BlueprintData.getHullSize(722)).toBe('Large')
    })

    test('returns null for non-hull IDs', () => {
      expect(BlueprintData.getHullSize(999)).toBeNull()
      expect(BlueprintData.getHullSize(0)).toBeNull()
    })
  })

  describe('getVariantForHull()', () => {
    test('finds correct variant for wood hull', () => {
      const v = BlueprintData.getVariantForHull(92)
      expect(v).not.toBeNull()
      expect(v.woodHullID).toBe(92)
      expect(v.metalHullID).toBe(730)
    })

    test('finds correct variant for metal hull', () => {
      const v = BlueprintData.getVariantForHull(730)
      expect(v).not.toBeNull()
      expect(v.woodHullID).toBe(92)
      expect(v.metalHullID).toBe(730)
    })

    test('finds variant for Large metal hull ID 1', () => {
      const v = BlueprintData.getVariantForHull(1)
      expect(v).not.toBeNull()
      expect(v.woodHullID).toBe(720)
      expect(v.metalHullID).toBe(1)
      expect(v.rudderPartID).toBe(820)
    })

    test('returns null for non-hull IDs', () => {
      expect(BlueprintData.getVariantForHull(999)).toBeNull()
    })
  })

  describe('getVariantForRudder()', () => {
    test('finds correct variant for rudder 842', () => {
      const v = BlueprintData.getVariantForRudder(842)
      expect(v).not.toBeNull()
      expect(v.rudderPartID).toBe(842)
      expect(v.woodHullID).toBe(92)
    })

    test('finds correct variant for rudder 820', () => {
      const v = BlueprintData.getVariantForRudder(820)
      expect(v).not.toBeNull()
      expect(v.rudderPartID).toBe(820)
      expect(v.metalHullID).toBe(1)
    })

    test('returns null for non-rudder IDs', () => {
      expect(BlueprintData.getVariantForRudder(999)).toBeNull()
    })
  })

  describe('isHull()', () => {
    test('returns true for all hull IDs in all lists', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const id of BlueprintData.HULL_LISTS[size]) {
          expect(BlueprintData.isHull(id)).toBe(true)
        }
      }
    })

    test('returns false for non-hull IDs', () => {
      expect(BlueprintData.isHull(999)).toBe(false)
      expect(BlueprintData.isHull(842)).toBe(false) // rudder, not hull
    })
  })

  describe('isRudder()', () => {
    test('returns true for all rudder IDs', () => {
      const rudderIds = [842, 827, 825, 829, 844, 846, 848, 850, 818, 820, 822, 824]
      for (const id of rudderIds) {
        expect(BlueprintData.isRudder(id)).toBe(true)
      }
    })

    test('returns false for non-rudder IDs', () => {
      expect(BlueprintData.isRudder(92)).toBe(false) // hull, not rudder
      expect(BlueprintData.isRudder(999)).toBe(false)
    })
  })

  describe('getAllRudderIds()', () => {
    test('returns all 12 unique rudder IDs', () => {
      const ids = BlueprintData.getAllRudderIds()
      expect(ids).toHaveLength(12)
      expect(ids).toContain(842)
      expect(ids).toContain(827)
      expect(ids).toContain(825)
      expect(ids).toContain(829)
      expect(ids).toContain(844)
      expect(ids).toContain(846)
      expect(ids).toContain(848)
      expect(ids).toContain(850)
      expect(ids).toContain(818)
      expect(ids).toContain(820)
      expect(ids).toContain(822)
      expect(ids).toContain(824)
    })
  })

  // =========================================================================
  // ALL SPRITES EXIST IN ATLAS (cross-check with available members)
  // =========================================================================

  describe('All referenced sprites should exist in boten_15.DXR atlas', () => {
    // These are the actual dirName values present in blueprint-sprites-0.json
    const EXISTING_MEMBERS = new Set([
      '15b001v0', '15b002v0', '15b003v0', '15b004v0', '15b005v0',
      '15b006v0', '15b007v0', '15b008v0', '15b009v0', '15b010v0',
      '15b011v0', '15b012v0', '15b013v0', '15b014v0', '15b015v0',
      '15b017v0', '15b019v0', '15b021v0', '15b023v0', '15b025v0',
      '15b027v0', '15b029v0', '15b031v0', '15b033v0', '15b035v0',
      '15b037v0', '15b039v0', '15b040v0', '15b041v0', '15b042v0',
      '15b043v0', '15b044v0', '15b045v0', '15b046v0', '15b047v0',
      '15b048v0', '15b049v0', '15b050v0', '15b051v0', '15b052v0',
      '15b053v0', '15b054v0', '15b055v0', '15b056v0', '15b057v0',
      '15b058v0', '15b059v0', '15b060v0', '15b061v0', '15b063v0',
      '15b064v0', '15b065v0', '15b066v0', '15b067v0', '15b068v0',
      '15b069v0', '15b070v0', '15b071v0', '15b072v0', '15b073v0',
      '15b074v0'
    ])

    test('all hull selHullPic sprites exist', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(EXISTING_MEMBERS.has(v.selHullPic)).toBe(true)
        }
      }
    })

    test('all hull rollHullPic sprites exist', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(EXISTING_MEMBERS.has(v.rollHullPic)).toBe(true)
        }
      }
    })

    test('all rudder selRudderPic sprites exist', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(EXISTING_MEMBERS.has(v.selRudderPic)).toBe(true)
        }
      }
    })

    test('all rudder rollRudderPic sprites exist', () => {
      for (const size of ['Small', 'Medium', 'Large']) {
        for (const v of BlueprintData.HULL_VARIANTS[size]) {
          expect(EXISTING_MEMBERS.has(v.rollRudderPic)).toBe(true)
        }
      }
    })

    test('all tab button sprites exist', () => {
      for (const tab of Object.values(BlueprintData.TAB_BUTTONS)) {
        expect(EXISTING_MEMBERS.has(tab.normalPic)).toBe(true)
        expect(EXISTING_MEMBERS.has(tab.rollOverPic)).toBe(true)
      }
    })

    test('info button sprites exist', () => {
      expect(EXISTING_MEMBERS.has(BlueprintData.INFO_BUTTON.normalPic)).toBe(true)
      expect(EXISTING_MEMBERS.has(BlueprintData.INFO_BUTTON.rollOverPic)).toBe(true)
    })
  })
})
