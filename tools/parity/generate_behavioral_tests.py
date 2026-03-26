#!/usr/bin/env python3
"""Generate Jest behavioral tests from decompiled Lingo .ls files.

Parses conditional logic patterns in Lingo scripts and generates Jest test
cases that verify the JS remake matches the original branching behavior.

Patterns handled (ordered by frequency):
1. Inventory check → branch (exitFrame BehaviorScripts + Dir.ls startMovie)
2. Mission check → branch (isMissionGiven / isMissionCompleted)
3. Simple transition (go("label"))
4. primaTrip call
5. Complex startMovie with multiple mission/inventory branches

Output: one .test.js file per Lingo folder in tools/src/scenes/__tests__/parity/
"""

import json
import os
import re
import sys
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
LINGO_DIR = PROJECT_ROOT / "decompiled_lingo"
TEST_OUT_DIR = PROJECT_ROOT / "tools" / "src" / "scenes" / "__tests__" / "parity"

# ---------------------------------------------------------------------------
# Lingo parser
# ---------------------------------------------------------------------------

# Matches handler declarations
RE_HANDLER_START = re.compile(r'^on\s+(\w+)', re.MULTILINE)
RE_END_BLOCK = re.compile(r'^end(?:\s|$)', re.MULTILINE)

# Conditionals
RE_IF = re.compile(r'^\s*if\s+(.+?)\s+then\s*$', re.IGNORECASE)
RE_ELSE = re.compile(r'^\s*else\s*$', re.IGNORECASE)
RE_END_IF = re.compile(r'^\s*end\s+if\s*$', re.IGNORECASE)

# Actions
RE_GO_STRING = re.compile(r'\bgo\s*\(\s*"([^"]+)"\s*\)', re.IGNORECASE)
RE_GO_FRAME = re.compile(r'\bgo\s*\(\s*the\s+frame\s*\)', re.IGNORECASE)
RE_GO_FRAME_PLUS = re.compile(r'\bgo\s*\(\s*the\s+frame\s*\+\s*(\d+)\s*\)', re.IGNORECASE)
RE_GO_VAR = re.compile(r'\bgo\s*\(\s*(\w+)\s*\)', re.IGNORECASE)
RE_GO_MOVIE = re.compile(r'\bgo\s*\(\s*(\d+)\s*,\s*"([^"]+)"\s*\)', re.IGNORECASE)
RE_GO_MARKER_VAR = re.compile(r'\bgo\s*\(\s*the\s+(\w+)\s+of\s+(\w+)\s*\)', re.IGNORECASE)

# Inventory
RE_IS_IN_INV = re.compile(
    r'\bisInInventory\s*\([^,)]*,\s*#?(\w+)', re.IGNORECASE
)
RE_DEL_FROM_INV = re.compile(
    r'\bdeleteFromInventory\s*\([^,)]*,\s*#?(\w+)', re.IGNORECASE
)
RE_SET_IN_INV = re.compile(
    r'\bsetInInventory\s*\([^,)]*,\s*#?(\w+)', re.IGNORECASE
)

# Missions
RE_IS_MISSION_GIVEN = re.compile(
    r'\bisMissionGiven\s*\([^,)]*,\s*(\d+)\s*\)', re.IGNORECASE
)
RE_IS_MISSION_COMPLETED = re.compile(
    r'\bisMissionCompleted\s*\([^,)]*,\s*(\d+)\s*\)', re.IGNORECASE
)
RE_ADD_COMPLETED_MISSION = re.compile(
    r'\baddCompletedMission\s*\([^,)]*,\s*(\d+)\s*\)', re.IGNORECASE
)
RE_ADD_GIVEN_MISSION = re.compile(
    r'\baddGivenMission\s*\([^,)]*,\s*(\d+)\s*\)', re.IGNORECASE
)

# Boat properties
RE_GET_PROPERTY = re.compile(
    r'\bgetProperty\s*\(\s*\w+\s*,\s*#(\w+)\s*\)', re.IGNORECASE
)
RE_GET_MEDAL = re.compile(
    r'\bgetMedal\s*\([^,)]*,\s*(\d+)\s*\)', re.IGNORECASE
)
RE_ADD_MEDAL = re.compile(
    r'\baddMedal\s*\([^,)]*,\s*(\d+)\s*\)', re.IGNORECASE
)
RE_ADD_NEW_PART = re.compile(r'\baddNewPart\s*\(', re.IGNORECASE)

# primaTrip
RE_PRIMA_TRIP = re.compile(r'\bprimaTrip\s*\(\s*(\w+)\s*\)', re.IGNORECASE)

# Negation patterns in conditions
RE_NEGATED_CHECK = re.compile(r'=\s*0', re.IGNORECASE)
RE_NOT_PREFIX = re.compile(r'\bnot\s+', re.IGNORECASE)


class Condition:
    """Represents a parsed condition from Lingo if-statement."""
    def __init__(self, raw, cond_type, key, negated=False):
        self.raw = raw
        self.cond_type = cond_type  # 'inventory', 'missionGiven', 'missionCompleted', 'property', 'medal', 'other'
        self.key = key              # item name, mission id, property name
        self.negated = negated

    def __repr__(self):
        neg = "NOT " if self.negated else ""
        return f"{neg}{self.cond_type}({self.key})"

    def to_context_key(self):
        if self.cond_type == 'inventory':
            return f"inventory.{self.key}"
        elif self.cond_type == 'missionGiven':
            return f"missionGiven.{self.key}"
        elif self.cond_type == 'missionCompleted':
            return f"missionCompleted.{self.key}"
        elif self.cond_type == 'property':
            return f"boatProperty.{self.key}"
        elif self.cond_type == 'medal':
            return f"medal.{self.key}"
        return f"other.{self.key}"

    def to_js_true(self):
        """JS context value when this condition is true."""
        if self.cond_type == 'inventory':
            return (f"inventory.{self.key}", not self.negated)
        elif self.cond_type == 'missionGiven':
            return (f"missionsGiven[{self.key}]", not self.negated)
        elif self.cond_type == 'missionCompleted':
            return (f"missionsCompleted[{self.key}]", not self.negated)
        elif self.cond_type == 'property':
            return (f"boatProperties.{self.key}", not self.negated)
        elif self.cond_type == 'medal':
            return (f"medals[{self.key}]", not self.negated)
        return (f"other.{self.key}", not self.negated)


class Action:
    """Represents a parsed action from Lingo."""
    def __init__(self, action_type, **kwargs):
        self.action_type = action_type
        self.data = kwargs

    def __repr__(self):
        return f"Action({self.action_type}, {self.data})"


class Branch:
    """A conditional branch: condition → actions + sub-branches."""
    def __init__(self, conditions=None, actions=None, else_branch=None):
        self.conditions = conditions or []  # list of Condition
        self.actions = actions or []        # list of Action
        self.children = []                  # nested Branch list
        self.else_branch = else_branch      # Branch for else

    def all_leaves(self, path=None):
        """Yield (condition_path, actions) for each leaf."""
        path = path or []
        current_path = path + self.conditions

        has_children = bool(self.children)

        # Collect direct actions
        if self.actions and not has_children:
            yield (current_path, self.actions)

        if self.actions and has_children:
            # Actions before children (like set myMarker)
            pass

        for child in self.children:
            yield from child.all_leaves(current_path)

        if self.else_branch:
            negated = [Condition(c.raw, c.cond_type, c.key, not c.negated)
                       for c in self.conditions]
            yield from self.else_branch.all_leaves(path + negated)


def parse_condition(raw):
    """Parse a raw Lingo condition string into a Condition object."""
    negated = bool(RE_NEGATED_CHECK.search(raw)) or bool(RE_NOT_PREFIX.search(raw))

    m = RE_IS_IN_INV.search(raw)
    if m:
        return Condition(raw, 'inventory', m.group(1), negated)

    m = RE_IS_MISSION_GIVEN.search(raw)
    if m:
        return Condition(raw, 'missionGiven', m.group(1), negated)

    m = RE_IS_MISSION_COMPLETED.search(raw)
    if m:
        return Condition(raw, 'missionCompleted', m.group(1), negated)

    m = RE_GET_PROPERTY.search(raw)
    if m:
        return Condition(raw, 'property', m.group(1), negated)

    m = RE_GET_MEDAL.search(raw)
    if m:
        return Condition(raw, 'medal', m.group(1), negated)

    # Generic condition — sanitize to valid JS identifier
    key = re.sub(r'[^a-zA-Z0-9]', '_', raw.strip())[:40]
    # Remove leading digits
    key = re.sub(r'^[0-9]+', '', key)
    if not key:
        key = 'cond'
    return Condition(raw, 'other', key, negated)


def parse_actions(line):
    """Extract actions from a single Lingo line."""
    actions = []

    m = RE_GO_MOVIE.search(line)
    if m:
        actions.append(Action('goMovie', frame=m.group(1), movie=m.group(2)))
        return actions

    m = RE_GO_STRING.search(line)
    if m:
        actions.append(Action('go', target=m.group(1)))

    m = RE_GO_FRAME_PLUS.search(line)
    if m:
        actions.append(Action('goFramePlus', offset=int(m.group(1))))

    if not actions and RE_GO_FRAME.search(line):
        actions.append(Action('goFrame'))

    if not actions:
        m = RE_GO_MARKER_VAR.search(line)
        if m:
            actions.append(Action('goVar', prop=m.group(1), obj=m.group(2)))

    if not actions:
        m = RE_GO_VAR.search(line)
        if m and m.group(1).lower() not in ('the', 'me', 'it'):
            actions.append(Action('goVar', var=m.group(1)))

    m = RE_DEL_FROM_INV.search(line)
    if m:
        actions.append(Action('deleteFromInventory', item=m.group(1)))

    m = RE_SET_IN_INV.search(line)
    if m:
        actions.append(Action('setInInventory', item=m.group(1)))

    m = RE_ADD_COMPLETED_MISSION.search(line)
    if m:
        actions.append(Action('addCompletedMission', mission=m.group(1)))

    m = RE_ADD_GIVEN_MISSION.search(line)
    if m:
        actions.append(Action('addGivenMission', mission=m.group(1)))

    m = RE_ADD_MEDAL.search(line)
    if m:
        actions.append(Action('addMedal', medal=m.group(1)))

    if RE_ADD_NEW_PART.search(line):
        actions.append(Action('addNewPart'))

    m = RE_PRIMA_TRIP.search(line)
    if m:
        actions.append(Action('primaTrip', target=m.group(1)))

    return actions


def parse_handler_body(lines):
    """Parse handler body lines into a Branch tree."""
    root = Branch()
    stack = [root]  # stack of (Branch, in_else)
    else_stack = [False]

    for line in lines:
        stripped = line.strip()
        if not stripped or stripped.startswith('--'):
            continue

        # Check for if
        m = RE_IF.match(stripped)
        if m:
            cond = parse_condition(m.group(1))
            new_branch = Branch(conditions=[cond])
            stack[-1].children.append(new_branch)
            stack.append(new_branch)
            else_stack.append(False)
            continue

        # Check for else
        if RE_ELSE.match(stripped):
            # Create else branch as sibling
            parent_branch = stack[-1]
            else_branch = Branch()
            parent_branch.else_branch = else_branch
            stack[-1] = else_branch
            else_stack[-1] = True
            continue

        # Check for end if
        if RE_END_IF.match(stripped):
            stack.pop()
            else_stack.pop()
            continue

        # It's an action line
        actions = parse_actions(stripped)
        if actions:
            stack[-1].actions.extend(actions)

    return root


def extract_handlers(content):
    """Extract all handlers from a Lingo file."""
    handlers = {}
    lines = content.split('\n')
    i = 0
    while i < len(lines):
        m = RE_HANDLER_START.match(lines[i].strip())
        if m:
            handler_name = m.group(1)
            body_lines = []
            i += 1
            while i < len(lines):
                stripped = lines[i].strip()
                if stripped == 'end' or (stripped.startswith('end') and not stripped.startswith('end if')):
                    break
                body_lines.append(lines[i])
                i += 1
            handlers[handler_name] = body_lines
        i += 1
    return handlers


def classify_script(filepath, content):
    """Classify a .ls file by its pattern type."""
    basename = os.path.basename(filepath)
    handlers = extract_handlers(content)

    results = []

    for handler_name, body_lines in handlers.items():
        body_text = '\n'.join(body_lines)

        has_inventory = bool(RE_IS_IN_INV.search(body_text))
        has_mission_given = bool(RE_IS_MISSION_GIVEN.search(body_text))
        has_mission_completed = bool(RE_IS_MISSION_COMPLETED.search(body_text))
        has_go = bool(RE_GO_STRING.search(body_text)) or bool(RE_GO_VAR.search(body_text))
        has_prima_trip = bool(RE_PRIMA_TRIP.search(body_text))

        if not (has_inventory or has_mission_given or has_mission_completed or has_go or has_prima_trip):
            continue

        branch_tree = parse_handler_body(body_lines)
        leaves = list(branch_tree.all_leaves())

        if not leaves:
            continue

        pattern = 'simple_transition'
        if has_inventory and (has_mission_given or has_mission_completed):
            pattern = 'complex_branching'
        elif has_inventory:
            pattern = 'inventory_check'
        elif has_mission_given or has_mission_completed:
            pattern = 'mission_check'
        elif has_prima_trip:
            pattern = 'prima_trip'

        results.append({
            'file': filepath,
            'script_name': basename,
            'handler': handler_name,
            'pattern': pattern,
            'branch_tree': branch_tree,
            'leaves': leaves,
        })

    return results


# ---------------------------------------------------------------------------
# Jest test generator
# ---------------------------------------------------------------------------

def condition_description(conditions):
    """Human-readable description of a condition path."""
    parts = []
    for c in conditions:
        neg = "without" if c.negated else "with"
        if c.cond_type == 'inventory':
            parts.append(f"{neg} {c.key}")
        elif c.cond_type == 'missionGiven':
            neg_word = "not given" if c.negated else "given"
            parts.append(f"mission {c.key} {neg_word}")
        elif c.cond_type == 'missionCompleted':
            neg_word = "not completed" if c.negated else "completed"
            parts.append(f"mission {c.key} {neg_word}")
        elif c.cond_type == 'property':
            neg_word = "without" if c.negated else "with"
            parts.append(f"{neg_word} boat.{c.key}")
        elif c.cond_type == 'medal':
            neg_word = "no" if c.negated else "has"
            parts.append(f"{neg_word} medal {c.key}")
        else:
            parts.append(c.raw.strip()[:50])
    return ", ".join(parts) if parts else "default state"


def actions_to_expectations(actions):
    """Convert actions to Jest expect() calls."""
    expects = []
    for a in actions:
        if a.action_type == 'go':
            expects.append(f"    expect(result.transition).toBe('{a.data['target']}');")
        elif a.action_type == 'goFrame':
            expects.append(f"    expect(result.transition).toBe('frame');")
        elif a.action_type == 'goFramePlus':
            expects.append(f"    expect(result.transition).toBe('frame+{a.data['offset']}');")
        elif a.action_type == 'goVar':
            var = a.data.get('var', a.data.get('prop', 'marker'))
            expects.append(f"    expect(result.transition).toBe('var:{var}');")
        elif a.action_type == 'goMovie':
            expects.append(f"    expect(result.transition).toBe('movie:{a.data['movie']}');")
        elif a.action_type == 'deleteFromInventory':
            expects.append(f"    expect(result.inventoryDeleted).toContain('{a.data['item']}');")
        elif a.action_type == 'setInInventory':
            expects.append(f"    expect(result.inventorySet).toContain('{a.data['item']}');")
        elif a.action_type == 'addCompletedMission':
            expects.append(f"    expect(result.missionsCompleted).toContain({a.data['mission']});")
        elif a.action_type == 'addGivenMission':
            expects.append(f"    expect(result.missionsGiven).toContain({a.data['mission']});")
        elif a.action_type == 'addMedal':
            expects.append(f"    expect(result.medalsAdded).toContain({a.data['medal']});")
        elif a.action_type == 'addNewPart':
            expects.append(f"    expect(result.partsAdded).toBeGreaterThan(0);")
        elif a.action_type == 'primaTrip':
            expects.append(f"    expect(result.primaTrip).toBe(true);")
    return expects


def conditions_to_context(conditions):
    """Convert condition path to a JS context object for the test."""
    ctx = {}
    for c in conditions:
        val = not c.negated
        if c.cond_type == 'inventory':
            ctx.setdefault('inventory', {})[c.key] = val
        elif c.cond_type == 'missionGiven':
            ctx.setdefault('missionsGiven', {})[c.key] = val
        elif c.cond_type == 'missionCompleted':
            ctx.setdefault('missionsCompleted', {})[c.key] = val
        elif c.cond_type == 'property':
            ctx.setdefault('boatProperties', {})[c.key] = val
        elif c.cond_type == 'medal':
            ctx.setdefault('medals', {})[c.key] = val
        elif c.cond_type == 'other':
            ctx.setdefault('other', {})[c.key] = val
    return ctx


def js_safe_key(key):
    """Ensure a key is safe to use as a JS object property (unquoted)."""
    if re.match(r'^[a-zA-Z_$][a-zA-Z0-9_$]*$', key):
        return key
    return f"'{key}'"


def ctx_to_js(ctx):
    """Serialize a context dict to JS object literal."""
    parts = []
    for section, vals in sorted(ctx.items()):
        if isinstance(vals, dict):
            inner = ", ".join(f"{js_safe_key(k)}: {json.dumps(v)}" for k, v in sorted(vals.items()))
            parts.append(f"{section}: {{ {inner} }}")
        else:
            parts.append(f"{section}: {json.dumps(vals)}")
    return "{ " + ", ".join(parts) + " }"


# Keys whose values should be emitted as JS numbers, not strings
NUMERIC_ACTION_KEYS = {'mission', 'medal', 'offset'}


def action_to_js(a):
    """Serialize an Action to a JS object literal."""
    act_parts = [f"type: '{a.action_type}'"]
    for k, v in a.data.items():
        if isinstance(v, int) or k in NUMERIC_ACTION_KEYS:
            try:
                act_parts.append(f"{k}: {int(v)}")
            except (ValueError, TypeError):
                act_parts.append(f"{k}: '{v}'")
        else:
            act_parts.append(f"{k}: '{v}'")
    return "{ " + ", ".join(act_parts) + " }"


def branch_to_js(branch, indent=2):
    """Serialize a Branch tree to a JS array literal."""
    ind = '  ' * indent
    lines = []

    # Serialize this branch's children (the root has no conditions itself)
    items = branch.children if hasattr(branch, 'children') else []
    if not items and branch.actions:
        # Leaf with only actions, no children — wrap as a single-node branch
        items = [branch]

    js_nodes = []
    for child in items:
        node_lines = []
        node_lines.append(f"{ind}{{")

        # Conditions
        conds_js = []
        for c in child.conditions:
            conds_js.append(
                f"{{ type: '{c.cond_type}', key: '{c.key}', negated: {json.dumps(c.negated)} }}"
            )
        node_lines.append(f"{ind}  conditions: [{', '.join(conds_js)}],")

        # Actions
        acts_js = []
        for a in child.actions:
            acts_js.append(action_to_js(a))
        node_lines.append(f"{ind}  actions: [{', '.join(acts_js)}],")

        # Children (recursive)
        if child.children:
            child_js = branch_children_to_js(child.children, indent + 1)
            node_lines.append(f"{ind}  children: {child_js},")
        else:
            node_lines.append(f"{ind}  children: [],")

        # Else branch
        if child.else_branch:
            else_js = branch_single_to_js(child.else_branch, indent + 1)
            node_lines.append(f"{ind}  elseBranch: {else_js},")
        else:
            node_lines.append(f"{ind}  elseBranch: null,")

        node_lines.append(f"{ind}}}")
        js_nodes.append('\n'.join(node_lines))

    return '[\n' + ',\n'.join(js_nodes) + '\n' + '  ' * (indent - 1) + ']'


def branch_children_to_js(children, indent):
    """Serialize a list of Branch children to JS."""
    ind = '  ' * indent
    js_nodes = []
    for child in children:
        js_nodes.append(branch_single_to_js(child, indent))
    return '[\n' + ',\n'.join(js_nodes) + '\n' + '  ' * (indent - 1) + ']'


def branch_single_to_js(branch, indent):
    """Serialize a single Branch node to JS."""
    ind = '  ' * indent
    node_lines = []
    node_lines.append(f"{ind}{{")

    # Conditions
    conds_js = []
    for c in branch.conditions:
        conds_js.append(
            f"{{ type: '{c.cond_type}', key: '{c.key}', negated: {json.dumps(c.negated)} }}"
        )
    node_lines.append(f"{ind}  conditions: [{', '.join(conds_js)}],")

    # Actions
    acts_js = []
    for a in branch.actions:
        acts_js.append(action_to_js(a))
    node_lines.append(f"{ind}  actions: [{', '.join(acts_js)}],")

    # Children
    if branch.children:
        child_js = branch_children_to_js(branch.children, indent + 1)
        node_lines.append(f"{ind}  children: {child_js},")
    else:
        node_lines.append(f"{ind}  children: [],")

    # Else branch
    if branch.else_branch:
        else_js = branch_single_to_js(branch.else_branch, indent + 1)
        node_lines.append(f"{ind}  elseBranch: {else_js},")
    else:
        node_lines.append(f"{ind}  elseBranch: null,")

    node_lines.append(f"{ind}}}")
    return '\n'.join(node_lines)


def generate_test_file(folder_name, scripts):
    """Generate a complete Jest test file for a Lingo folder."""
    lines = []
    lines.append("/**")
    lines.append(f" * @fileoverview Behavioral parity tests for Lingo folder: {folder_name}")
    lines.append(f" * Auto-generated by generate_behavioral_tests.py")
    lines.append(f" *")
    lines.append(f" * These tests verify that the JS remake branches match the original")
    lines.append(f" * Lingo conditional logic for scene {folder_name}.")
    lines.append(f" */")
    lines.append("")
    lines.append("const { LingoContract, createMockContext } = require('./helpers');")
    lines.append("")

    test_count = 0

    for script_info in scripts:
        script_name = script_info['script_name']
        handler = script_info['handler']
        pattern = script_info['pattern']
        leaves = script_info['leaves']
        branch_tree = script_info['branch_tree']
        rel_file = os.path.relpath(script_info['file'], PROJECT_ROOT)

        lines.append(f"// Source: {rel_file}")
        lines.append(f"// Pattern: {pattern}")
        lines.append(f"describe('{script_name} → {handler}', () => {{")

        # Emit the branch tree as a JS constant
        tree_js = branch_to_js(branch_tree, indent=2)
        lines.append(f"  const branches = {tree_js};")
        lines.append("")

        for i, (cond_path, actions) in enumerate(leaves):
            if not actions:
                continue

            desc = condition_description(cond_path)
            expects = actions_to_expectations(actions)

            if not expects:
                continue

            ctx = conditions_to_context(cond_path)
            ctx_js = ctx_to_js(ctx) if ctx else "{}"

            test_count += 1
            lines.append(f"  test('branch {i + 1}: {desc}', () => {{")
            lines.append(f"    const ctx = createMockContext({ctx_js});")
            lines.append(f"    const contract = new LingoContract('{rel_file}', '{handler}', branches);")
            lines.append(f"    const result = contract.evaluate(ctx);")
            for exp in expects:
                lines.append(exp)
            lines.append(f"  }});")
            lines.append("")

        lines.append("});")
        lines.append("")

    return "\n".join(lines), test_count


# ---------------------------------------------------------------------------
# Main: scan all folders, generate tests
# ---------------------------------------------------------------------------

# Infrastructure folders to skip (no game scene logic)
SKIP_FOLDERS = {
    'BLS', 'BLW', 'BMS', 'BMW', 'BSS', 'BSW',
    'CDdata', 'LBstart', 'Sail', 'StartCD', 'tempPlug',
}


def find_ls_files(folder_path):
    """Recursively find all .ls files in a folder."""
    results = []
    for root, dirs, files in os.walk(folder_path):
        for f in files:
            if f.endswith('.ls'):
                results.append(os.path.join(root, f))
    return sorted(results)


def main():
    print("Lingo → Jest Behavioral Test Generator")
    print("=" * 50)

    TEST_OUT_DIR.mkdir(parents=True, exist_ok=True)

    folders = sorted(os.listdir(LINGO_DIR))

    total_tests = 0
    total_scripts = 0
    total_files_written = 0
    pattern_counts = defaultdict(int)
    folder_stats = []

    # Process non-boat folders only (boat_ folders are duplicates)
    game_folders = [f for f in folders
                    if f not in SKIP_FOLDERS
                    and not f.startswith('boat_')
                    and (LINGO_DIR / f).is_dir()]

    # Also include boat_ folders that don't have a non-boat counterpart
    boat_folders = [f for f in folders if f.startswith('boat_') and (LINGO_DIR / f).is_dir()]
    for bf in boat_folders:
        non_boat = bf.replace('boat_', '')
        if non_boat not in game_folders:
            game_folders.append(bf)

    print(f"Processing {len(game_folders)} game folders (skipping {len(SKIP_FOLDERS)} infrastructure + boat_ duplicates)")
    print()

    for folder_name in sorted(game_folders):
        folder_path = LINGO_DIR / folder_name
        ls_files = find_ls_files(str(folder_path))

        all_scripts = []
        for ls_file in ls_files:
            try:
                with open(ls_file, 'r', encoding='utf-8', errors='replace') as f:
                    content = f.read()
            except Exception as e:
                print(f"  WARNING: Could not read {ls_file}: {e}")
                continue

            scripts = classify_script(ls_file, content)
            all_scripts.extend(scripts)

        if not all_scripts:
            continue

        test_content, test_count = generate_test_file(folder_name, all_scripts)

        if test_count == 0:
            continue

        out_file = TEST_OUT_DIR / f"{folder_name}.parity.test.js"
        with open(out_file, 'w') as f:
            f.write(test_content)

        total_tests += test_count
        total_scripts += len(all_scripts)
        total_files_written += 1

        for s in all_scripts:
            pattern_counts[s['pattern']] += 1

        folder_stats.append({
            'folder': folder_name,
            'scripts': len(all_scripts),
            'tests': test_count,
        })
        print(f"  {folder_name}: {len(all_scripts)} scripts → {test_count} tests")

    print()
    print("=" * 50)
    print(f"Total: {total_files_written} test files, {total_scripts} scripts, {total_tests} test cases")
    print()
    print("Pattern breakdown:")
    for pattern, count in sorted(pattern_counts.items(), key=lambda x: -x[1]):
        print(f"  {pattern}: {count} scripts")

    # Write summary
    summary = {
        'total_test_files': total_files_written,
        'total_scripts_parsed': total_scripts,
        'total_test_cases': total_tests,
        'pattern_counts': dict(pattern_counts),
        'folders': folder_stats,
    }
    summary_file = SCRIPT_DIR / "behavioral_test_summary.json"
    with open(summary_file, 'w') as f:
        json.dump(summary, f, indent=2)
    print(f"\nSummary written to {summary_file}")


if __name__ == '__main__':
    main()
