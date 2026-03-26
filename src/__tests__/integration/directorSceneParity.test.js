'use strict'

const {
  buildReport
} = require('../../../parity/director_scan.cjs')

describe('Director scene parity scan', () => {
  const report = buildReport()

  test('all numeric Director scene requests have resolvable dir expressions', () => {
    expect(report.unresolvedExpressions).toEqual([])
  })

  test('scene-level Director member requests all resolve after the algae island fix', () => {
    expect(report.missingVisualCandidates).toEqual([])
  })

  test('algae island marsh background and water-mask resolve to exact Director members', () => {
    const background = report.requests.find((item) =>
      item.sceneFile === 'algae_island.js' &&
      item.receiver === 'this.background' &&
      item.member === 27
    )

    const foreground = report.requests.find((item) =>
      item.sceneFile === 'algae_island.js' &&
      item.receiver === 'this.foregroundOverlay' &&
      item.member === 28
    )

    expect(background).toMatchObject({
      visualCategory: 'background',
      resolutionMode: 'exact'
    })

    expect(foreground).toMatchObject({
      visualCategory: 'foreground',
      resolutionMode: 'exact'
    })
  })

  test('foreground and overlay layers are scanned and classified structurally', () => {
    expect(report.categoryCounts.foreground).toBeGreaterThan(0)
    expect(report.categoryCounts.overlay).toBeGreaterThan(0)

    const boatyardForeground = report.requests.find((item) =>
      item.sceneFile === 'boatyard.js' &&
      item.receiver === 'this.foregroundOverlay' &&
      item.member === 2
    )

    expect(boatyardForeground).toBeTruthy()
    expect(boatyardForeground.visualCategory).toBe('foreground')
    expect(boatyardForeground.resolutionMode).toBe('exact')
    expect(boatyardForeground.resolvedCandidate).toMatchObject({
      key: 'boatyard-sprites-0',
      dirName: '04b002v0',
      width: 640,
      height: 172
    })
  })

  test('audio scan normalizes spritemap keys and Director dirName values', () => {
    expect(report.audio.missingLiteralRefs).toEqual([])
  })
})
