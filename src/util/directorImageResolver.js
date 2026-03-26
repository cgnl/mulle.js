function isPlainObject (value) {
  return value && typeof value === 'object'
}

export function isNumericDirectorMember (member) {
  return typeof member === 'number' || (typeof member === 'string' && /^[0-9]+$/.test(member))
}

export function getDirectorDirAliases (dir) {
  const aliases = []

  if (!dir) return aliases

  const value = String(dir)
  aliases.push(value)

  if (value.startsWith('boten_')) {
    aliases.push(value.substring(6))
  } else {
    aliases.push(`boten_${value}`)
  }

  return Array.from(new Set(aliases))
}

export function getDirectorMemberMapForDir (dir, directorMemberMap = {}) {
  if (!isPlainObject(directorMemberMap)) return null

  const aliases = getDirectorDirAliases(dir)

  for (const alias of aliases) {
    if (isPlainObject(directorMemberMap[alias])) {
      return directorMemberMap[alias]
    }
  }

  return null
}

export function getDirectorResolvedName (dir, member, directorMemberMap = {}) {
  if (!isNumericDirectorMember(member)) return null

  const memberMap = getDirectorMemberMapForDir(dir, directorMemberMap)
  if (!memberMap) return null

  const memberKey = String(member)
  return memberMap[memberKey] || null
}

export function matchesDirectorDirFile (frame, dir) {
  if (!frame || !dir) return false
  return getDirectorDirAliases(dir).includes(frame.dirFile)
}

export function getDirectorCandidateDimensions (candidate) {
  const frame = candidate && candidate.frame ? candidate.frame : candidate
  const width = Number(frame && (frame.width ?? (frame.frame && frame.frame.w) ?? 0))
  const height = Number(frame && (frame.height ?? (frame.frame && frame.frame.h) ?? 0))

  return {
    width: Number.isFinite(width) ? width : 0,
    height: Number.isFinite(height) ? height : 0
  }
}

export function getDirectorCandidateMetrics (candidate) {
  const frame = candidate && candidate.frame ? candidate.frame : candidate
  const { width, height } = getDirectorCandidateDimensions(candidate)
  const regpoint = frame && frame.regpoint ? frame.regpoint : {}
  const regX = Number(regpoint.x)
  const regY = Number(regpoint.y)
  const centerX = width / 2
  const centerY = height / 2
  const centerDistance =
    Math.abs((Number.isFinite(regX) ? regX : 0) - centerX) +
    Math.abs((Number.isFinite(regY) ? regY : 0) - centerY)
  const dirNum = Number(frame && frame.dirNum)
  const key = String(candidate && candidate.key ? candidate.key : '')

  return {
    width,
    height,
    area: width * height,
    centerDistance,
    isSharedAtlas: key.startsWith('shared-'),
    dirNum: Number.isFinite(dirNum) ? dirNum : -1
  }
}

export function compareDirectorCandidates (left, right) {
  const leftMetrics = getDirectorCandidateMetrics(left)
  const rightMetrics = getDirectorCandidateMetrics(right)

  if (leftMetrics.area !== rightMetrics.area) {
    return rightMetrics.area - leftMetrics.area
  }

  if (leftMetrics.centerDistance !== rightMetrics.centerDistance) {
    return leftMetrics.centerDistance - rightMetrics.centerDistance
  }

  if (leftMetrics.isSharedAtlas !== rightMetrics.isSharedAtlas) {
    return Number(leftMetrics.isSharedAtlas) - Number(rightMetrics.isSharedAtlas)
  }

  if (leftMetrics.dirNum !== rightMetrics.dirNum) {
    return rightMetrics.dirNum - leftMetrics.dirNum
  }

  const leftKey = String(left && left.key ? left.key : '')
  const rightKey = String(right && right.key ? right.key : '')
  if (leftKey !== rightKey) {
    return leftKey.localeCompare(rightKey)
  }

  const leftName = String(left && left.name ? left.name : '')
  const rightName = String(right && right.name ? right.name : '')
  return leftName.localeCompare(rightName)
}

export function pickBestDirectorCandidate (candidates = []) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null

  const ranked = [...candidates].sort(compareDirectorCandidates)
  return ranked[0] || null
}

export function resolveDirectorImageCandidate ({ dir, member, candidates = [], directorMemberMap = {} } = {}) {
  if (!dir || member === undefined || member === null || !Array.isArray(candidates)) {
    return null
  }

  const matchingDirCandidates = candidates.filter((candidate) => matchesDirectorDirFile(candidate.frame || candidate, dir))
  if (matchingDirCandidates.length === 0) {
    return null
  }

  const isNumeric = isNumericDirectorMember(member)

  if (isNumeric) {
    const memberNum = Number(member)
    const exactMatches = matchingDirCandidates.filter((candidate) => Number(candidate.frame && candidate.frame.dirNum) === memberNum)
    if (exactMatches.length > 0) {
      return pickBestDirectorCandidate(exactMatches)
    }

    const resolvedName = getDirectorResolvedName(dir, member, directorMemberMap)
    if (resolvedName) {
      const aliasMatches = matchingDirCandidates.filter((candidate) => candidate.frame && candidate.frame.dirName === resolvedName)
      if (aliasMatches.length > 0) {
        return pickBestDirectorCandidate(aliasMatches)
      }
    }
  }

  const directNameMatches = matchingDirCandidates.filter((candidate) => candidate.frame && candidate.frame.dirName === member)
  if (directNameMatches.length > 0) {
    return pickBestDirectorCandidate(directNameMatches)
  }

  return null
}

