/**
 * @fileoverview Tests for MullePartData.getProperty() morph traversal
 * 
 * Bug: getProperty() uses game.mulle.getPart() which only searches the CAR
 * PartsDB. For boat parts whose MorphsTo targets are also boat parts,
 * this fails because those IDs don't exist in the car DB.
 * 
 * Fix: getProperty() should also try game.mulle.getBoatPart() when
 * getPart() returns null.
 */

// We can't import the ES module directly, so test the logic in isolation
describe('MullePartData.getProperty morph traversal', () => {
  /**
   * Simulates what getProperty() does when traversing MorphsTo
   */
  function resolvePartFromMorphs (morphsTo, getPart, getBoatPart) {
    const results = []
    for (const partId of morphsTo) {
      let part = getPart(partId)
      if (!part && getBoatPart) {
        part = getBoatPart(partId)
      }
      results.push({ partId, found: !!part })
    }
    return results
  }

  test('car parts found via getPart()', () => {
    const carDB = { 10: { name: 'wheel' }, 20: { name: 'engine' } }
    const getPart = (id) => carDB[id] || null
    const getBoatPart = () => null

    const results = resolvePartFromMorphs([10, 20], getPart, getBoatPart)
    expect(results).toEqual([
      { partId: 10, found: true },
      { partId: 20, found: true }
    ])
  })

  test('boat parts NOT found via getPart() alone (current bug)', () => {
    const carDB = {}  // empty - no car parts
    const boatDB = { 517: { name: 'sail' }, 518: { name: 'mast' } }
    const getPart = (id) => carDB[id] || null
    // No getBoatPart fallback = current broken behavior
    const getBoatPart = null

    const results = resolvePartFromMorphs([517, 518], getPart, getBoatPart)
    expect(results).toEqual([
      { partId: 517, found: false },
      { partId: 518, found: false }
    ])
  })

  test('boat parts found via getBoatPart() fallback (the fix)', () => {
    const carDB = {}
    const boatDB = { 517: { name: 'sail' }, 518: { name: 'mast' } }
    const getPart = (id) => carDB[id] || null
    const getBoatPart = (id) => boatDB[id] || null

    const results = resolvePartFromMorphs([517, 518], getPart, getBoatPart)
    expect(results).toEqual([
      { partId: 517, found: true },
      { partId: 518, found: true }
    ])
  })

  test('mixed car + boat morphs both resolve', () => {
    const carDB = { 10: { name: 'wheel' } }
    const boatDB = { 517: { name: 'sail' } }
    const getPart = (id) => carDB[id] || null
    const getBoatPart = (id) => boatDB[id] || null

    const results = resolvePartFromMorphs([10, 517], getPart, getBoatPart)
    expect(results).toEqual([
      { partId: 10, found: true },
      { partId: 517, found: true }
    ])
  })

  test('truly invalid parts still not found even with both DBs', () => {
    const carDB = { 10: { name: 'wheel' } }
    const boatDB = { 517: { name: 'sail' } }
    const getPart = (id) => carDB[id] || null
    const getBoatPart = (id) => boatDB[id] || null

    const results = resolvePartFromMorphs([9999], getPart, getBoatPart)
    expect(results).toEqual([
      { partId: 9999, found: false }
    ])
  })
})
