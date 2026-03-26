const fs = require('fs')
const path = require('path')

const TOOLS_ROOT = path.resolve(__dirname, '..')
const SCENES_DIR = path.join(TOOLS_ROOT, 'src', 'scenes')
const DIST_DIR = path.join(TOOLS_ROOT, 'dist', 'assets')
const CST_OUT_DIR = path.join(TOOLS_ROOT, 'cst_out_new')
const MEMBER_MAP_PATH = path.join(TOOLS_ROOT, 'data', 'director_member_map.json')
const REPORT_JSON_PATH = path.join(TOOLS_ROOT, 'data', 'director_parity_scan.json')
const REPORT_MD_PATH = path.join(TOOLS_ROOT, 'data', 'director_parity_scan.md')

function loadJson (filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'))
}

function listAtlasJsonFiles () {
  return fs.readdirSync(DIST_DIR)
    .filter((name) => name.endsWith('.json') && name.includes('sprites-'))
    .map((name) => path.join(DIST_DIR, name))
    .sort()
}

function getDirectorDirAliases (dir) {
  if (!dir) return []

  const value = String(dir)
  const aliases = [value]

  if (value.startsWith('boten_')) {
    aliases.push(value.substring(6))
  } else {
    aliases.push(`boten_${value}`)
  }

  return Array.from(new Set(aliases))
}

function getCandidateDimensions (candidate) {
  const frame = candidate && candidate.frame ? candidate.frame : candidate
  const width = Number(frame && (frame.width ?? (frame.frame && frame.frame.w) ?? 0))
  const height = Number(frame && (frame.height ?? (frame.frame && frame.frame.h) ?? 0))

  return {
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0
  }
}

function getCandidateMetrics (candidate) {
  const frame = candidate && candidate.frame ? candidate.frame : candidate
  const regpoint = frame && frame.regpoint ? frame.regpoint : {}
  const { width, height } = getCandidateDimensions(candidate)
  const regX = Number(regpoint.x)
  const regY = Number(regpoint.y)
  const centerDistance =
    Math.abs((Number.isFinite(regX) ? regX : 0) - width / 2) +
    Math.abs((Number.isFinite(regY) ? regY : 0) - height / 2)

  return {
    width,
    height,
    area: width * height,
    centerDistance,
    isSharedAtlas: String(candidate && candidate.key ? candidate.key : '').startsWith('shared-'),
    dirNum: Number.isFinite(Number(frame && frame.dirNum)) ? Number(frame.dirNum) : -1
  }
}

function compareCandidates (left, right) {
  const a = getCandidateMetrics(left)
  const b = getCandidateMetrics(right)

  if (a.area !== b.area) return b.area - a.area
  if (a.centerDistance !== b.centerDistance) return a.centerDistance - b.centerDistance
  if (a.isSharedAtlas !== b.isSharedAtlas) return Number(a.isSharedAtlas) - Number(b.isSharedAtlas)
  if (a.dirNum !== b.dirNum) return b.dirNum - a.dirNum

  const leftKey = String(left && left.key ? left.key : '')
  const rightKey = String(right && right.key ? right.key : '')
  if (leftKey !== rightKey) return leftKey.localeCompare(rightKey)

  return String(left && left.name ? left.name : '').localeCompare(String(right && right.name ? right.name : ''))
}

function pickBestCandidate (candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null
  return [...candidates].sort(compareCandidates)[0]
}

function serializeCandidate (candidate) {
  if (!candidate) return null

  const dims = getCandidateDimensions(candidate)
  return {
    key: candidate.key,
    name: candidate.name,
    dirFile: candidate.frame && candidate.frame.dirFile,
    dirName: candidate.frame && candidate.frame.dirName,
    dirNum: candidate.frame && candidate.frame.dirNum,
    width: dims.width,
    height: dims.height
  }
}

function isQuotedLiteral (value) {
  return (value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))
}

function unquote (value) {
  return isQuotedLiteral(value) ? value.slice(1, -1) : value
}

function getDirResourceValue (source) {
  const match = source.match(/DirResource\s*=\s*['"]([^'"]+)['"]/)
  return match ? match[1] : null
}

function extractSceneRequests ({ backgroundOnly = false } = {}) {
  const sceneFiles = fs.readdirSync(SCENES_DIR).filter((name) => name.endsWith('.js')).sort()
  const pattern = /([A-Za-z0-9_$.]+)\.setDirectorMember\(\s*([^,\n]+?)\s*,\s*([0-9]+)\s*\)/g
  const requests = []

  for (const fileName of sceneFiles) {
    const fullPath = path.join(SCENES_DIR, fileName)
    const source = fs.readFileSync(fullPath, 'utf8')
    const dirResource = getDirResourceValue(source)
    let match

    while ((match = pattern.exec(source)) !== null) {
      const receiver = match[1]
      const dirExpr = match[2].trim()
      const member = Number(match[3])
      const line = source.slice(0, match.index).split('\n').length
      const backgroundLike = receiver.toLowerCase().includes('background')

      if (backgroundOnly && !backgroundLike) {
        continue
      }

      let dirFile = null
      if (dirExpr === 'this.DirResource' || dirExpr === 'self.DirResource') {
        dirFile = dirResource
      } else if (isQuotedLiteral(dirExpr)) {
        dirFile = unquote(dirExpr)
      }

      requests.push({
        sceneFile: fileName,
        index: match.index,
        line,
        receiver,
        backgroundLike,
        dirExpr,
        dirFile,
        member
      })
    }
  }

  return requests
}

function loadAtlasCandidates () {
  const allCandidates = []
  const byDirFile = new Map()

  for (const filePath of listAtlasJsonFiles()) {
    const atlas = loadJson(filePath)
    const frames = atlas.frames || {}
    const atlasKey = path.basename(filePath, '.json')

    for (const [name, frame] of Object.entries(frames)) {
      const candidate = { key: atlasKey, name, frame }
      allCandidates.push(candidate)

      const dirFile = frame && frame.dirFile
      if (!dirFile) continue

      if (!byDirFile.has(dirFile)) byDirFile.set(dirFile, [])
      byDirFile.get(dirFile).push(candidate)
    }
  }

  return { allCandidates, byDirFile }
}

function loadMetadataMemberNames () {
  const byDirFile = new Map()

  if (!fs.existsSync(CST_OUT_DIR)) {
    return byDirFile
  }

  for (const dirName of fs.readdirSync(CST_OUT_DIR).sort()) {
    const metadataPath = path.join(CST_OUT_DIR, dirName, 'metadata.json')
    if (!fs.existsSync(metadataPath)) continue

    const metadata = loadJson(metadataPath)
    const memberNames = {}

    for (const library of metadata.libraries || []) {
      for (const [memberId, member] of Object.entries(library.members || {})) {
        if (member && typeof member.name === 'string' && member.name.trim()) {
          memberNames[memberId] = member.name.trim()
        }
      }
    }

    if (Object.keys(memberNames).length > 0) {
      byDirFile.set(dirName, memberNames)
    }
  }

  return byDirFile
}

function getMemberMapForDir (memberMap, dirFile) {
  for (const alias of getDirectorDirAliases(dirFile)) {
    if (memberMap[alias]) return memberMap[alias]
  }
  return null
}

function getMetadataMemberName (metadataNamesByDir, dirFile, member) {
  for (const alias of getDirectorDirAliases(dirFile)) {
    const names = metadataNamesByDir.get(alias)
    if (names && names[String(member)]) {
      return names[String(member)]
    }
  }

  return null
}

function resolveDirExpression (expr, source, endIndex, dirResource) {
  const trimmed = String(expr || '').trim()

  if (!trimmed) return { dirFile: null, resolvedBy: 'missing-expr' }

  if (trimmed === 'this.DirResource' || trimmed === 'self.DirResource' || trimmed.endsWith('.DirResource')) {
    return { dirFile: dirResource || null, resolvedBy: 'dir-resource' }
  }

  if (isQuotedLiteral(trimmed)) {
    return { dirFile: unquote(trimmed), resolvedBy: 'literal' }
  }

  const sourceSlice = source.slice(0, endIndex)
  const aliasPattern = new RegExp(`(?:const|let|var)\\s+${trimmed}\\s*=\\s*([^;\\n]+)`, 'g')
  let lastMatch = null
  let match

  while ((match = aliasPattern.exec(sourceSlice)) !== null) {
    lastMatch = match[1].trim()
  }

  if (lastMatch) {
    const nested = resolveDirExpression(lastMatch, sourceSlice, sourceSlice.length, dirResource)
    if (nested.dirFile) {
      return { dirFile: nested.dirFile, resolvedBy: `alias:${trimmed}->${nested.resolvedBy}` }
    }
  }

  return { dirFile: null, resolvedBy: 'unresolved-expr' }
}

function classifyVisualReceiver (receiver) {
  const name = String(receiver || '').toLowerCase()

  if (name.includes('background') || name.includes('sky')) return 'background'
  if (name.includes('foreground') || name.includes('layer') || name.includes('wateroverlay') || name.includes('watersprite')) return 'foreground'
  if (name.includes('overlay') || name.includes('popup') || name.includes('dialog') || name.includes('panel')) return 'overlay'
  if (name.includes('button') || name.includes('icon') || name.includes('indicator') || name.includes('meter')) return 'ui'
  if (name.includes('actor') || name.includes('mulle') || name.includes('head') || name.includes('body') || name.includes('sam') || name.includes('birgit') || name.includes('figge')) return 'actor'
  return 'sprite'
}

function loadAudioPackNames () {
  return new Set(
    fs.readdirSync(DIST_DIR)
      .filter((name) => name.endsWith('-audio.json'))
      .map((name) => name.replace(/-audio\.json$/, ''))
  )
}

function stripCommentsPreserveLines (source) {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '))
    .replace(/\/\/.*$/gm, (match) => match.replace(/[^\n]/g, ' '))
}

function sanitizeAudioId (id) {
  const value = String(id || '').trim()
  if (!value) return value
  if (value.includes('/')) return value.split('/').pop()
  return value
}

function normalizeAudioId (id) {
  return sanitizeAudioId(id).toLowerCase()
}

function registerAudioLookupId (set, id) {
  const normalized = normalizeAudioId(id)
  if (!normalized) return

  set.add(normalized)

  if (normalized.endsWith('_00')) {
    set.add(normalized.slice(0, -3))
  }
}

function loadAudioIds () {
  const ids = new Set()

  for (const fileName of fs.readdirSync(DIST_DIR).filter((name) => name.endsWith('-audio.json')).sort()) {
    const audioJson = loadJson(path.join(DIST_DIR, fileName))
    const spritemap = audioJson.spritemap || audioJson.sprite || {}

    for (const [id, entry] of Object.entries(spritemap)) {
      registerAudioLookupId(ids, id)

      const dirName = entry && entry.data ? entry.data.dirName : null
      registerAudioLookupId(ids, dirName)
    }
  }

  return ids
}

function extractAudioReferences () {
  const sceneFiles = fs.readdirSync(SCENES_DIR).filter((name) => name.endsWith('.js')).sort()
  const refs = []
  const literalPattern = /(?:playAudio|stopAudio|talk)\(\s*(['"])([^'"]+)\1/g
  const dynamicPattern = /(?:playAudio|stopAudio|talk)\(\s*([^'"][^,\n)]*)/g

  for (const fileName of sceneFiles) {
    const fullPath = path.join(SCENES_DIR, fileName)
    const source = stripCommentsPreserveLines(fs.readFileSync(fullPath, 'utf8'))
    let match

    while ((match = literalPattern.exec(source)) !== null) {
      const line = source.slice(0, match.index).split('\n').length
      const rawId = match[2]
      const trailing = source.slice(match.index + match[0].length).match(/^\s*([+,)])/)

      if (trailing && trailing[1] === '+') {
        refs.push({
          sceneFile: fileName,
          line,
          kind: 'dynamic',
          expr: `${rawId} + ...`
        })
        continue
      }

      refs.push({
        sceneFile: fileName,
        line,
        kind: 'literal',
        rawId,
        audioId: sanitizeAudioId(rawId)
      })
    }

    while ((match = dynamicPattern.exec(source)) !== null) {
      const expr = String(match[1] || '').trim()
      if (!expr || isQuotedLiteral(expr)) continue
      const line = source.slice(0, match.index).split('\n').length
      refs.push({
        sceneFile: fileName,
        line,
        kind: 'dynamic',
        expr
      })
    }
  }

  return refs
}

function buildReport ({ backgroundOnly = false } = {}) {
  const memberMap = loadJson(MEMBER_MAP_PATH)
  const metadataNamesByDir = loadMetadataMemberNames()
  const atlasData = loadAtlasCandidates()
  const requests = extractSceneRequests({ backgroundOnly })
  const analyzedRequests = []
  const unresolvedExpressions = []
  const missingVisualCandidates = []
  const categoryCounts = {}

  for (const request of requests) {
    const source = fs.readFileSync(path.join(SCENES_DIR, request.sceneFile), 'utf8')
    const resolvedDir = resolveDirExpression(request.dirExpr, source, request.index >= 0 ? request.index : source.length, getDirResourceValue(source))
    const dirFile = resolvedDir.dirFile
    const aliases = getDirectorDirAliases(dirFile)
    const memberLookup = dirFile ? getMemberMapForDir(memberMap, dirFile) : null
    const metadataName = dirFile ? getMetadataMemberName(metadataNamesByDir, dirFile, request.member) : null
    const resolvedName = memberLookup
      ? memberLookup[String(request.member)] || metadataName || null
      : metadataName || null
    const matchingDirCandidates = aliases.flatMap((alias) => atlasData.byDirFile.get(alias) || [])
    const exactCandidates = matchingDirCandidates.filter((candidate) => Number(candidate.frame && candidate.frame.dirNum) === request.member)
    const nameCandidates = resolvedName
      ? matchingDirCandidates.filter((candidate) => candidate.frame && candidate.frame.dirName === resolvedName)
      : []
    const directNameCandidates = matchingDirCandidates.filter(
      (candidate) => candidate.frame && candidate.frame.dirName === String(request.member)
    )

    let resolutionMode = 'missing'
    let resolvedCandidate = null

    if (exactCandidates.length > 0) {
      resolutionMode = 'exact'
      resolvedCandidate = pickBestCandidate(exactCandidates)
    } else if (nameCandidates.length > 0) {
      resolutionMode = 'alias'
      resolvedCandidate = pickBestCandidate(nameCandidates)
    } else if (directNameCandidates.length > 0) {
      resolutionMode = 'direct-name'
      resolvedCandidate = pickBestCandidate(directNameCandidates)
    }

    const ambiguousNameDimensions = Array.from(new Set(
      nameCandidates.map((candidate) => {
        const dims = getCandidateDimensions(candidate)
        return `${dims.width}x${dims.height}`
      })
    ))

    const reportItem = {
      ...request,
      dirFile,
      dirResolvedBy: resolvedDir.resolvedBy,
      dirAliases: aliases,
      resolvedName,
      metadataName,
      resolutionMode,
      exactCandidateCount: exactCandidates.length,
      nameCandidateCount: nameCandidates.length,
      directNameCandidateCount: directNameCandidates.length,
      ambiguousNameDimensions,
      isAmbiguousName: ambiguousNameDimensions.length > 1,
      visualCategory: classifyVisualReceiver(request.receiver),
      resolvedCandidate: serializeCandidate(resolvedCandidate),
      expectedExactCandidate: serializeCandidate(pickBestCandidate(exactCandidates)),
      expectedAliasCandidate: serializeCandidate(pickBestCandidate(nameCandidates)),
      nameCandidates: nameCandidates.map(serializeCandidate),
      exactCandidates: exactCandidates.map(serializeCandidate)
    }

    categoryCounts[reportItem.visualCategory] = (categoryCounts[reportItem.visualCategory] || 0) + 1

    if (!dirFile) {
      unresolvedExpressions.push(reportItem)
    } else if (reportItem.resolutionMode === 'missing') {
      missingVisualCandidates.push(reportItem)
    }

    analyzedRequests.push(reportItem)
  }

  const ambiguous = analyzedRequests.filter((item) => item.isAmbiguousName)
  const riskyBackgrounds = analyzedRequests.filter((item) => item.backgroundLike && item.isAmbiguousName)
  const layeredVisuals = analyzedRequests.filter((item) => item.visualCategory === 'foreground' || item.visualCategory === 'overlay')
  const riskyLayeredVisuals = layeredVisuals.filter((item) => item.isAmbiguousName)

  const availableAudioIds = loadAudioIds()
  const audioPackNames = loadAudioPackNames()
  const audioReferences = extractAudioReferences()
  const missingAudioLiterals = audioReferences
    .filter((item) => item.kind === 'literal')
    .filter((item) => item.audioId)
    .filter((item) => !audioPackNames.has(item.audioId))
    .filter((item) => /\d/.test(item.audioId))
    .filter((item) => !availableAudioIds.has(normalizeAudioId(item.audioId)))

  return {
    generatedAt: new Date().toISOString(),
    backgroundOnly,
    totals: {
      requests: analyzedRequests.length,
      unresolvedExpressions: unresolvedExpressions.length,
      missingVisualCandidates: missingVisualCandidates.length,
      ambiguous: ambiguous.length,
      riskyBackgrounds: riskyBackgrounds.length,
      layeredVisuals: layeredVisuals.length,
      riskyLayeredVisuals: riskyLayeredVisuals.length,
      audioLiteralRefs: audioReferences.filter((item) => item.kind === 'literal').length,
      audioDynamicRefs: audioReferences.filter((item) => item.kind === 'dynamic').length,
      missingAudioLiterals: missingAudioLiterals.length
    },
    unresolvedExpressions,
    missingVisualCandidates,
    ambiguous,
    riskyBackgrounds,
    layeredVisuals,
    riskyLayeredVisuals,
    categoryCounts,
    audio: {
      references: audioReferences,
      missingLiteralRefs: missingAudioLiterals
    },
    requests: analyzedRequests
  }
}

function renderMarkdown (report) {
  const lines = []

  lines.push('# Director Parity Scan')
  lines.push('')
  lines.push(`- Generated: ${report.generatedAt}`)
  lines.push(`- Requests scanned: ${report.totals.requests}`)
  lines.push(`- Unresolved expressions: ${report.totals.unresolvedExpressions}`)
  lines.push(`- Missing visual candidates: ${report.totals.missingVisualCandidates}`)
  lines.push(`- Ambiguous name matches: ${report.totals.ambiguous}`)
  lines.push(`- Risky backgrounds: ${report.totals.riskyBackgrounds}`)
  lines.push(`- Layered visuals: ${report.totals.layeredVisuals}`)
  lines.push(`- Risky layered visuals: ${report.totals.riskyLayeredVisuals}`)
  lines.push(`- Audio literal refs: ${report.totals.audioLiteralRefs}`)
  lines.push(`- Missing audio literals: ${report.totals.missingAudioLiterals}`)
  lines.push('')

  lines.push('## Visual Categories')
  lines.push('')
  for (const [category, count] of Object.entries(report.categoryCounts).sort()) {
    lines.push(`- ${category}: ${count}`)
  }
  lines.push('')

  lines.push('## Risky Backgrounds')
  lines.push('')
  if (report.riskyBackgrounds.length === 0) {
    lines.push('- none')
    lines.push('')
  } else {
    for (const item of report.riskyBackgrounds) {
      lines.push(`- \`${item.sceneFile}:${item.line}\` \`${item.dirFile}\` member \`${item.member}\` -> \`${item.resolvedName}\``)
      lines.push(`  mode: ${item.resolutionMode}; dims: ${item.ambiguousNameDimensions.join(', ')}`)
      if (item.resolvedCandidate) {
        lines.push(`  chosen: \`${item.resolvedCandidate.key}\` \`${item.resolvedCandidate.dirNum}\` ${item.resolvedCandidate.width}x${item.resolvedCandidate.height}`)
      }
    }
    lines.push('')
  }

  lines.push('## Risky Layered Visuals')
  lines.push('')
  if (report.riskyLayeredVisuals.length === 0) {
    lines.push('- none')
    lines.push('')
  } else {
    for (const item of report.riskyLayeredVisuals) {
      lines.push(`- \`${item.sceneFile}:${item.line}\` \`${item.receiver}\` \`${item.dirFile}\` member \`${item.member}\` -> \`${item.resolvedName}\``)
      lines.push(`  category: ${item.visualCategory}; mode: ${item.resolutionMode}; dims: ${item.ambiguousNameDimensions.join(', ')}`)
      if (item.resolvedCandidate) {
        lines.push(`  chosen: \`${item.resolvedCandidate.key}\` \`${item.resolvedCandidate.dirNum}\` ${item.resolvedCandidate.width}x${item.resolvedCandidate.height}`)
      }
    }
    lines.push('')
  }

  lines.push('## Unresolved Expressions')
  lines.push('')
  if (report.unresolvedExpressions.length === 0) {
    lines.push('- none')
    lines.push('')
  } else {
    for (const item of report.unresolvedExpressions) {
      lines.push(`- \`${item.sceneFile}:${item.line}\` receiver=\`${item.receiver}\` dirExpr=\`${item.dirExpr}\` member=\`${item.member}\``)
    }
    lines.push('')
  }

  lines.push('## Missing Visual Candidates')
  lines.push('')
  if (report.missingVisualCandidates.length === 0) {
    lines.push('- none')
    lines.push('')
  } else {
    for (const item of report.missingVisualCandidates) {
      lines.push(`- \`${item.sceneFile}:${item.line}\` \`${item.receiver}\` dir=\`${item.dirFile}\` member=\`${item.member}\` resolvedName=\`${item.resolvedName || 'null'}\``)
    }
    lines.push('')
  }

  lines.push('## Missing Audio Literals')
  lines.push('')
  if (report.audio.missingLiteralRefs.length === 0) {
    lines.push('- none')
    lines.push('')
  } else {
    for (const item of report.audio.missingLiteralRefs) {
      lines.push(`- \`${item.sceneFile}:${item.line}\` raw=\`${item.rawId}\` normalized=\`${item.audioId}\``)
    }
    lines.push('')
  }

  return lines.join('\n')
}

function writeReportFiles (report = buildReport()) {
  fs.writeFileSync(REPORT_JSON_PATH, JSON.stringify(report, null, 2))
  fs.writeFileSync(REPORT_MD_PATH, renderMarkdown(report))
  return { jsonPath: REPORT_JSON_PATH, mdPath: REPORT_MD_PATH }
}

if (require.main === module) {
  const report = buildReport()
  const files = writeReportFiles(report)
  console.log(`Wrote ${files.jsonPath}`)
  console.log(`Wrote ${files.mdPath}`)
  console.log(`Requests: ${report.totals.requests}, unresolved expressions: ${report.totals.unresolvedExpressions}, missing visual candidates: ${report.totals.missingVisualCandidates}, ambiguous: ${report.totals.ambiguous}, risky backgrounds: ${report.totals.riskyBackgrounds}, missing audio literals: ${report.totals.missingAudioLiterals}`)
}

module.exports = {
  buildReport,
  compareCandidates,
  extractSceneRequests,
  getCandidateDimensions,
  getCandidateMetrics,
  loadAtlasCandidates,
  pickBestCandidate,
  renderMarkdown,
  serializeCandidate,
  writeReportFiles
}
