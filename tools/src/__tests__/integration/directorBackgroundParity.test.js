'use strict'

const {
  buildReport
} = require('../../../parity/director_scan.cjs')

describe('Director background parity scan', () => {
  const report = buildReport({ backgroundOnly: true })

  test('all scanned background requests resolve to a Director candidate', () => {
    expect(report.unresolvedExpressions).toEqual([])
    expect(report.missingVisualCandidates).toEqual([])
  })

  test('scan finds the known risky backgrounds that need structural coverage', () => {
    const markers = report.riskyBackgrounds.map((item) => `${item.sceneFile}:${item.line}:${item.dirFile}:${item.member}`)

    expect(markers).toContain('yard.js:41:04.DXR:145')
    expect(markers).toContain('boatyard.js:603:boten_04.DXR:1')
    expect(markers).toContain('worldselect.js:25:18.DXR:8')
  })

  test('ambiguous backgrounds either keep the exact member or choose the largest alias candidate', () => {
    expect(report.riskyBackgrounds.length).toBeGreaterThan(0)

    for (const item of report.riskyBackgrounds) {
      expect(item.resolvedCandidate).toBeTruthy()

      if (item.expectedExactCandidate) {
        expect(item.resolvedCandidate.key).toBe(item.expectedExactCandidate.key)
        expect(item.resolvedCandidate.name).toBe(item.expectedExactCandidate.name)
        continue
      }

      expect(item.expectedAliasCandidate).toBeTruthy()
      expect(item.resolvedCandidate.key).toBe(item.expectedAliasCandidate.key)
      expect(item.resolvedCandidate.name).toBe(item.expectedAliasCandidate.name)
    }
  })

  test('yard background still resolves to the fullscreen local atlas candidate', () => {
    const yard = report.riskyBackgrounds.find((item) => item.sceneFile === 'yard.js' && item.member === 145)

    expect(yard).toBeTruthy()
    expect(yard.resolutionMode).toBe('alias')
    expect(yard.resolvedCandidate).toMatchObject({
      key: 'yard-sprites-0',
      dirName: '04b001v0',
      width: 640,
      height: 480
    })
  })
})
