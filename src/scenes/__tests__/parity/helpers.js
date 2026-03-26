/**
 * @fileoverview Shared test utilities for Lingo behavioral parity tests.
 *
 * Provides a lightweight LingoContract evaluator that models the branching
 * logic extracted from decompiled Lingo scripts. Each test verifies:
 * "given this game state, the Lingo script would do X."
 *
 * The contract evaluator does NOT run the actual game engine — it walks
 * the extracted branch tree and returns what the original Lingo would do.
 */

/**
 * Create a mock game context for testing Lingo branching logic.
 *
 * @param {Object} overrides - Context overrides
 * @param {Object} [overrides.inventory] - Map of item name → boolean
 * @param {Object} [overrides.missionsGiven] - Map of mission id → boolean
 * @param {Object} [overrides.missionsCompleted] - Map of mission id → boolean
 * @param {Object} [overrides.boatProperties] - Map of property name → value
 * @param {Object} [overrides.medals] - Map of medal id → boolean
 * @returns {MockContext}
 */
function createMockContext(overrides = {}) {
  return {
    inventory: {},
    missionsGiven: {},
    missionsCompleted: {},
    boatProperties: {},
    medals: {},
    other: {},
    ...overrides,
  };
}

/**
 * Evaluate a condition node against a game-state context.
 * @param {Object} cond - { type, key, negated }
 * @param {MockContext} ctx
 * @returns {boolean}
 */
function evalCondition(cond, ctx) {
  let val = false;
  switch (cond.type) {
    case 'inventory':
      val = !!ctx.inventory[cond.key];
      break;
    case 'missionGiven':
      val = !!ctx.missionsGiven[cond.key];
      break;
    case 'missionCompleted':
      val = !!ctx.missionsCompleted[cond.key];
      break;
    case 'property':
      val = !!ctx.boatProperties[cond.key];
      break;
    case 'medal':
      val = !!ctx.medals[cond.key];
      break;
    default:
      val = !!(ctx.other && ctx.other[cond.key]);
  }
  return cond.negated ? !val : val;
}

/**
 * Walk a branch tree and collect all actions for the matching path.
 * @param {Object[]} branches - Array of branch nodes
 * @param {MockContext} ctx
 * @returns {Object} result accumulator
 */
function walkBranches(branches, ctx, result) {
  for (const branch of branches) {
    // Check if all conditions match
    const condsMet = branch.conditions.every(c => evalCondition(c, ctx));
    if (condsMet) {
      // Apply actions
      for (const action of (branch.actions || [])) {
        applyAction(action, result);
      }
      // Recurse into children
      if (branch.children && branch.children.length > 0) {
        walkBranches(branch.children, ctx, result);
      }
    } else if (branch.elseBranch) {
      // Apply else branch actions
      for (const action of (branch.elseBranch.actions || [])) {
        applyAction(action, result);
      }
      if (branch.elseBranch.children && branch.elseBranch.children.length > 0) {
        walkBranches(branch.elseBranch.children, ctx, result);
      }
    }
  }
  return result;
}

function applyAction(action, result) {
  switch (action.type) {
    case 'go':
      result.transition = action.target;
      break;
    case 'goFrame':
      result.transition = 'frame';
      break;
    case 'goFramePlus':
      result.transition = `frame+${action.offset}`;
      break;
    case 'goVar':
      result.transition = `var:${action.var || action.prop}`;
      break;
    case 'goMovie':
      result.transition = `movie:${action.movie}`;
      break;
    case 'deleteFromInventory':
      result.inventoryDeleted.push(action.item);
      break;
    case 'setInInventory':
      result.inventorySet.push(action.item);
      break;
    case 'addCompletedMission':
      result.missionsCompleted.push(action.mission);
      break;
    case 'addGivenMission':
      result.missionsGiven.push(action.mission);
      break;
    case 'addMedal':
      result.medalsAdded.push(action.medal);
      break;
    case 'addNewPart':
      result.partsAdded++;
      break;
    case 'primaTrip':
      result.primaTrip = true;
      break;
  }
}

/**
 * Lightweight evaluator for Lingo branching contracts.
 *
 * Models the conditional logic extracted from a Lingo script handler.
 * The branch tree is embedded as a JS data structure by the generator.
 */
class LingoContract {
  /**
   * @param {string} scriptPath - Path to the source .ls file
   * @param {string} handler - Handler name (exitFrame, startMovie, etc.)
   * @param {Object[]} branches - The branch tree extracted from Lingo
   */
  constructor(scriptPath, handler, branches) {
    this.scriptPath = scriptPath;
    this.handler = handler;
    this.branches = branches || [];
  }

  /**
   * Evaluate the contract against a mock context.
   * Walks the branch tree and returns all side effects.
   *
   * @param {MockContext} ctx - The game state context
   * @returns {ContractResult}
   */
  evaluate(ctx) {
    const result = {
      transition: null,
      inventoryDeleted: [],
      inventorySet: [],
      missionsCompleted: [],
      missionsGiven: [],
      medalsAdded: [],
      partsAdded: 0,
      primaTrip: false,
      audioPlayed: [],
    };
    return walkBranches(this.branches, ctx, result);
  }
}

/**
 * Create a mock user with inventory and mission state.
 * Convenience wrapper around createMockContext.
 */
function createMockUser(opts = {}) {
  const ctx = createMockContext();
  if (opts.inventory) {
    for (const [key, val] of Object.entries(opts.inventory)) {
      ctx.inventory[key] = val;
    }
  }
  if (opts.missionsGiven) {
    for (const id of opts.missionsGiven) {
      ctx.missionsGiven[id] = true;
    }
  }
  if (opts.missionsCompleted) {
    for (const id of opts.missionsCompleted) {
      ctx.missionsCompleted[id] = true;
    }
  }
  return ctx;
}

module.exports = {
  LingoContract,
  createMockContext,
  createMockUser,
};
