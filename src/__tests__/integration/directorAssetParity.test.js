'use strict'

const fs = require('fs')
const path = require('path')

const directorMemberMap = require('../../../data/director_member_map.json')
const {
  getDirectorCandidateDimensions,
  getDirectorResolvedName,
  resolveDirectorImageCandidate
} = require('../../util/directorImageResolver')

function loadAtlasCandidates (atlasFile) {
  const fullPath = path.resolve(__dirname, '../../../dist/assets', atlasFile)
  const data = JSON.parse(fs.readFileSync(fullPath, 'utf8'))
  const frames = data.frames || {}
  const atlasKey = path.basename(atlasFile, '.json')

  return Object.entries(frames).map(([name, frame]) => ({
    key: atlasKey,
    name,
    frame
  }))
}

describe('Director asset parity: yard background', () => {
  const candidates = [
    ...loadAtlasCandidates('yard-sprites-0.json'),
    ...loadAtlasCandidates('yard-sprites-3.json'),
    ...loadAtlasCandidates('shared-sprites-0.json'),
    ...loadAtlasCandidates('shared-sprites-1.json')
  ]

  test('04.DXR member 145 resolves through the Director member map to 04b001v0', () => {
    expect(getDirectorResolvedName('04.DXR', 145, directorMemberMap)).toBe('04b001v0')
  })

  test('04.DXR member 145 chooses the fullscreen yard background, not the partial duplicate', () => {
    const aliasMatches = candidates.filter((candidate) =>
      candidate.frame.dirFile === '04.DXR' && candidate.frame.dirName === '04b001v0'
    )

    expect(aliasMatches.some((candidate) => {
      const dims = getDirectorCandidateDimensions(candidate)
      return dims.width === 172 && dims.height === 90
    })).toBe(true)

    expect(aliasMatches.some((candidate) => {
      const dims = getDirectorCandidateDimensions(candidate)
      return candidate.key === 'yard-sprites-0' && dims.width === 640 && dims.height === 480
    })).toBe(true)

    const resolved = resolveDirectorImageCandidate({
      dir: '04.DXR',
      member: 145,
      candidates,
      directorMemberMap
    })

    expect(resolved).toBeTruthy()
    expect(resolved.key).toBe('yard-sprites-0')
    expect(resolved.frame.dirName).toBe('04b001v0')
    expect(getDirectorCandidateDimensions(resolved)).toEqual({ width: 640, height: 480 })
  })
})

describe('Director asset parity: garage background', () => {
  const candidates = loadAtlasCandidates('garage-sprites-0.json')

  test('03.DXR member 33 remains an exact fullscreen match', () => {
    const resolved = resolveDirectorImageCandidate({
      dir: '03.DXR',
      member: 33,
      candidates,
      directorMemberMap
    })

    expect(resolved).toBeTruthy()
    expect(resolved.key).toBe('garage-sprites-0')
    expect(resolved.frame.dirName).toBe('03b001v0')
    expect(resolved.frame.dirNum).toBe(33)
    expect(getDirectorCandidateDimensions(resolved)).toEqual({ width: 640, height: 480 })
  })
})
