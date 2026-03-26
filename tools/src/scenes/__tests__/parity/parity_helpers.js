/**
 * Parity test helpers — utilities for behavioral verification tests.
 *
 * Auto-generated tests use these helpers to create game state mocks
 * and verify that JS scenes handle the same execution paths as Lingo.
 */

/**
 * Create a mock game state with inventory, missions, boat properties, etc.
 * @param {Object} overrides - State overrides
 * @returns {Object} Mock game state
 */
function createGameState (overrides = {}) {
  const state = {
    // Inventory: item name → truthy (present) or falsy (absent)
    inventory: {},
    // Missions: { given: Set<number>, completed: Set<number> }
    missions: { given: new Set(), completed: new Set() },
    // Boat properties
    boat: {
      luxuryFactor: 0,
      doghouse: false,
      material: 1,
      smallShip: false,
      largeShip: false
    },
    // Medals: medal index → value
    medals: {},
    // Weather
    weather: 'sunny',
    // World
    world: { exists: true },
    // User
    user: { exists: true },
    // Entered object ID
    enteredObject: 0,
    // Driving info
    drivingInfo: null,
    ...overrides
  }

  // Convenience: allow inventory as { ItemName: true }
  if (overrides.inventory) {
    state.inventory = { ...overrides.inventory }
  }

  // Convenience: allow missions as { given: [1,2], completed: [3] }
  if (overrides.missions) {
    if (Array.isArray(overrides.missions.given)) {
      state.missions.given = new Set(overrides.missions.given)
    }
    if (Array.isArray(overrides.missions.completed)) {
      state.missions.completed = new Set(overrides.missions.completed)
    }
  }

  return state
}

/**
 * Mock implementation of Lingo global functions for testing.
 */
const lingoFunctions = {
  isInInventory (state, item) {
    const cleanItem = item.replace(/^#/, '')
    return !!state.inventory[cleanItem]
  },

  deleteFromInventory (state, item) {
    const cleanItem = item.replace(/^#/, '')
    delete state.inventory[cleanItem]
  },

  setInInventory (state, item, value) {
    const cleanItem = item.replace(/^#/, '')
    state.inventory[cleanItem] = value || true
  },

  addToInventory (state, item) {
    const cleanItem = item.replace(/^#/, '')
    state.inventory[cleanItem] = true
  },

  isMissionGiven (state, id) {
    return state.missions.given.has(id)
  },

  isMissionCompleted (state, id) {
    return state.missions.completed.has(id)
  },

  addGivenMission (state, id) {
    state.missions.given.add(id)
  },

  addCompletedMission (state, id) {
    state.missions.completed.add(id)
  },

  getProperty (state, prop) {
    if (typeof prop === 'string') {
      const cleanProp = prop.replace(/^#/, '')
      return state.boat[cleanProp] || state.boat[cleanProp.toLowerCase()] || 0
    }
    return 0
  },

  getMedal (state, index) {
    return state.medals[index] || 0
  },

  addMedal (state, index) {
    state.medals[index] = (state.medals[index] || 0) + 1
  }
}

/**
 * Describe a path condition in human-readable form.
 * @param {Object} condition - Condition from behavioral contract
 * @returns {string} Human-readable description
 */
function describeCondition (condition) {
  if (!condition) return '(none)'

  const neg = condition.negated ? 'NOT ' : ''

  if (condition.fn) {
    const args = (condition.args || []).join(', ')
    return `${neg}${condition.fn}(${args})`
  }
  if (condition.op) {
    return `${neg}(${condition.left} ${condition.op} ${condition.right})`
  }
  if (condition.and) {
    return condition.and.map(describeCondition).join(' AND ')
  }
  if (condition.or) {
    return condition.or.map(describeCondition).join(' OR ')
  }
  if (condition.expr) {
    return `${neg}${condition.expr}`
  }
  return JSON.stringify(condition)
}

/**
 * Describe a path action in human-readable form.
 * @param {Object} action - Action from behavioral contract
 * @returns {string} Human-readable description
 */
function describeAction (action) {
  if (!action) return '(none)'

  if (action.fn) {
    const args = (action.args || []).join(', ')
    const prefix = action.assign_to ? `${action.assign_to} = ` : ''
    return `${prefix}${action.fn}(${args})`
  }
  if (action.assign) {
    return `${action.assign} = ${action.value}`
  }
  if (action.set_prop) {
    return `set ${action.set_prop} of ${action.target} to ${action.value}`
  }
  if (action.exit) {
    return 'exit'
  }
  if ('return' in action) {
    return `return ${action.return}`
  }
  return JSON.stringify(action)
}

/**
 * Summarize a path for test name generation.
 * @param {Object} path - Path from behavioral contract
 * @param {number} index - Path index
 * @returns {string} Short summary
 */
function pathSummary (path, index) {
  const conditions = (path.conditions || [])
    .slice(0, 3)
    .map(describeCondition)
    .join(', ')

  const actions = (path.actions || [])
    .filter(a => a.fn || a.assign)
    .slice(0, 2)
    .map(describeAction)
    .join(', ')

  const condStr = conditions ? conditions : 'unconditional'
  const actStr = actions ? ` → ${actions}` : ''

  // Truncate to reasonable length
  const full = `path ${index + 1}: ${condStr}${actStr}`
  return full.length > 120 ? full.substring(0, 117) + '...' : full
}

module.exports = {
  createGameState,
  lingoFunctions,
  describeCondition,
  describeAction,
  pathSummary
}
