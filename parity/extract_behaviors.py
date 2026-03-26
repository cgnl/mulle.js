#!/usr/bin/env python3
"""Behavioral Contract Extractor — enumerate all execution paths from Lingo ASTs.

Walks each handler's AST and extracts behavioral contracts: every unique
execution path through the code, tracking conditions and actions.

Input:  tools/parity/lingo_ast.json  (from lingo_parser.py)
Output: tools/parity/behavioral_contracts.json

Each path is a sequence of conditions (what must be true) and actions
(what the code does: inventory ops, transitions, mission ops, etc.).
"""

import json
import sys
from copy import deepcopy
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
AST_FILE = SCRIPT_DIR / "lingo_ast.json"
OUT_FILE = SCRIPT_DIR / "behavioral_contracts.json"

# ── Action extraction from AST nodes ────────────────────────────────────────

# Functions we track as behavioral actions
TRACKED_CALLS = {
    'go', 'isinventory', 'isininventory', 'delfrominventory',
    'deletefrominventory', 'setininventory', 'addtoinventory',
    'addtoinv', 'lookupinventory', 'clearinventory',
    'addcompletedmission', 'addgivenmission',
    'ismissioncompleted', 'ismissiongiven',
    'addmedal', 'getmedal', 'primatrip', 'drawboat', 'setsky',
    'getproperty', 'puppetsound', 'mullesez', 'random',
    'getat', 'cursor', 'gotoscene', 'trysailing',
    'ambiencesound', 'setdrivinginfo', 'getdrivinginfo',
    'addnewpart', 'getrandompart', 'getenteredobject',
    'save', 'getboat', 'updateproperties',
    'setaprop', 'getaprop', 'getprop', 'setprop',
}


def expr_to_str(expr):
    """Convert an AST expression node to a human-readable string."""
    if expr is None:
        return 'nil'
    if not isinstance(expr, dict):
        return str(expr)

    t = expr.get('type')
    if t == 'string':
        return f'"{expr["value"]}"'
    if t == 'integer':
        return str(expr['value'])
    if t == 'float':
        return str(expr['value'])
    if t == 'symbol':
        return f'#{expr["value"]}'
    if t == 'boolean':
        return 'TRUE' if expr['value'] else 'FALSE'
    if t == 'void':
        return 'VOID'
    if t == 'empty':
        return 'EMPTY'
    if t == 'constant':
        return expr.get('value', '')
    if t == 'ident':
        return expr.get('name', '?')
    if t == 'the_prop':
        return f'the {expr.get("property", "?")}'
    if t == 'prop_access':
        target = expr_to_str(expr.get('target'))
        prop = expr.get('property', '?')
        if isinstance(prop, dict):
            prop = expr_to_str(prop)
        return f'the {prop} of {target}'
    if t == 'ref':
        return f'{expr.get("kind", "?")} {expr_to_str(expr.get("arg"))}'
    if t == 'call':
        args = ', '.join(expr_to_str(a) for a in expr.get('args', []))
        return f'{expr.get("name", "?")}({args})'
    if t == 'binop':
        left = expr_to_str(expr.get('left'))
        right = expr_to_str(expr.get('right'))
        return f'({left} {expr.get("op", "?")} {right})'
    if t == 'unop':
        operand = expr_to_str(expr.get('operand'))
        return f'{expr.get("op", "?")} {operand}'
    if t == 'list':
        items = ', '.join(expr_to_str(i) for i in expr.get('items', []))
        return f'[{items}]'
    if t == 'proplist':
        items = []
        for item in expr.get('items', []):
            k = expr_to_str(item.get('key'))
            v = expr_to_str(item.get('value'))
            items.append(f'{k}: {v}')
        return f'[{", ".join(items)}]'
    if t == 'member_access':
        obj = expr_to_str(expr.get('object'))
        return f'{obj}.{expr.get("member", "?")}'

    return f'<{t}>'


def extract_call_info(call_node):
    """Extract function name and args from a call node."""
    if not isinstance(call_node, dict) or call_node.get('type') != 'call':
        return None, []
    name = call_node.get('name', '')
    args = [expr_to_str(a) for a in call_node.get('args', [])]
    return name, args


def condition_from_expr(expr, negated=False):
    """Create a condition dict from an expression."""
    if not isinstance(expr, dict):
        return {'expr': str(expr), 'negated': negated}

    t = expr.get('type')

    # Function call as condition
    if t == 'call':
        name, args = extract_call_info(expr)
        return {'fn': name, 'args': args, 'negated': negated}

    # Comparison
    if t == 'binop':
        op = expr.get('op')
        if op in ('=', '<>', '>', '<', '>=', '<=', 'contains'):
            return {
                'op': op,
                'left': expr_to_str(expr.get('left')),
                'right': expr_to_str(expr.get('right')),
                'negated': negated
            }
        if op == 'and':
            # Split into multiple conditions
            left_cond = condition_from_expr(expr.get('left'), negated)
            right_cond = condition_from_expr(expr.get('right'), negated)
            return {'and': [left_cond, right_cond], 'negated': negated}
        if op == 'or':
            left_cond = condition_from_expr(expr.get('left'), negated)
            right_cond = condition_from_expr(expr.get('right'), negated)
            return {'or': [left_cond, right_cond], 'negated': negated}

    # Negation
    if t == 'unop' and expr.get('op') == 'not':
        return condition_from_expr(expr.get('operand'), not negated)

    # Property access used as boolean
    if t in ('prop_access', 'the_prop', 'ident'):
        return {'expr': expr_to_str(expr), 'negated': negated}

    return {'expr': expr_to_str(expr), 'negated': negated}


def negate_condition(cond):
    """Negate a condition."""
    result = deepcopy(cond)
    result['negated'] = not result.get('negated', False)
    return result


def extract_actions_from_stmt(stmt):
    """Extract behavioral actions from a single statement (non-recursive)."""
    if not isinstance(stmt, dict):
        return []

    actions = []
    t = stmt.get('type')

    if t == 'expr_stmt':
        expr = stmt.get('expr')
        if isinstance(expr, dict) and expr.get('type') == 'call':
            name, args = extract_call_info(expr)
            if name and name.lower() in TRACKED_CALLS:
                actions.append({'fn': name, 'args': args})

    elif t == 'set':
        # set X to Y — check if Y is a tracked function call
        value = stmt.get('value')
        if isinstance(value, dict) and value.get('type') == 'call':
            name, args = extract_call_info(value)
            if name and name.lower() in TRACKED_CALLS:
                actions.append({'fn': name, 'args': args, 'assign_to': expr_to_str(stmt.get('target'))})
        # Also check target for interesting patterns
        target = stmt.get('target')
        if isinstance(target, dict) and target.get('type') == 'ident':
            tname = target.get('name', '')
            if tname in ('myMarker', 'tmpMarker', 'marker', 'tmpStartSuffix'):
                actions.append({'assign': tname, 'value': expr_to_str(value)})

    elif t == 'set_prop':
        # set the X of Y to Z — track state writes
        prop = stmt.get('property', '')
        target = stmt.get('target')
        value = stmt.get('value')
        target_str = expr_to_str(target) if target else ''

        # Check for gMulleGlobals state writes
        if 'gMulleGlobals' in target_str or 'gDir' in target_str:
            actions.append({'set_prop': prop, 'target': target_str, 'value': expr_to_str(value)})

        # Check if value is a tracked call
        if isinstance(value, dict) and value.get('type') == 'call':
            name, args = extract_call_info(value)
            if name and name.lower() in TRACKED_CALLS:
                actions.append({'fn': name, 'args': args})

    elif t == 'return':
        value = stmt.get('value')
        if value is not None:
            actions.append({'return': expr_to_str(value)})
        else:
            actions.append({'return': None})

    elif t == 'exit':
        actions.append({'exit': True})

    elif t == 'put':
        # put is debug output, skip
        pass

    elif t == 'global_decl':
        pass

    elif t == 'delete':
        actions.append({'delete': expr_to_str(stmt.get('target'))})

    return actions


# ── Path enumeration ────────────────────────────────────────────────────────

class PathEnumerator:
    """Enumerate all execution paths through a handler body."""

    MAX_PATHS = 128  # Cap to prevent combinatorial explosion

    def __init__(self):
        self.paths = []

    def enumerate(self, body):
        """Enumerate all paths through a list of statements.
        Returns list of paths, where each path is:
            {'conditions': [...], 'actions': [...]}
        """
        initial = {'conditions': [], 'actions': []}
        self.paths = []
        self._walk(body, initial)
        return self.paths if self.paths else [initial]

    def _walk(self, stmts, current_path):
        """Walk statements, branching at if/case nodes."""
        if len(self.paths) >= self.MAX_PATHS:
            # Cap reached — add current state and stop
            self.paths.append(deepcopy(current_path))
            return

        for i, stmt in enumerate(stmts):
            if not isinstance(stmt, dict):
                continue

            t = stmt.get('type')

            if t == 'if':
                condition = stmt.get('condition')
                then_body = stmt.get('then_body', [])
                else_body = stmt.get('else_body', [])
                remaining = stmts[i + 1:]

                cond = condition_from_expr(condition)

                # Then branch
                then_path = deepcopy(current_path)
                then_path['conditions'].append(cond)
                self._walk(then_body + remaining, then_path)

                # Else branch
                else_path = deepcopy(current_path)
                else_path['conditions'].append(negate_condition(cond))
                if else_body:
                    self._walk(else_body + remaining, else_path)
                else:
                    self._walk(remaining, else_path)

                return  # Don't continue — branches handle remaining stmts

            elif t == 'case':
                branches = stmt.get('branches', [])
                otherwise = stmt.get('otherwise', [])
                remaining = stmts[i + 1:]
                case_expr = expr_to_str(stmt.get('expr'))

                for branch in branches:
                    values = branch.get('values', [])
                    branch_body = branch.get('body', [])
                    branch_path = deepcopy(current_path)
                    for val in values:
                        val_str = expr_to_str(val)
                        branch_path['conditions'].append({
                            'op': '=',
                            'left': case_expr,
                            'right': val_str,
                            'negated': False
                        })
                    self._walk(branch_body + remaining, branch_path)

                # Otherwise branch
                if otherwise:
                    other_path = deepcopy(current_path)
                    other_path['conditions'].append({
                        'expr': f'{case_expr} = otherwise',
                        'negated': False
                    })
                    self._walk(otherwise + remaining, other_path)
                else:
                    # Fall through without matching
                    fallthrough = deepcopy(current_path)
                    self._walk(remaining, fallthrough)

                return

            elif t == 'repeat_range' or t == 'repeat_in' or t == 'repeat_while' or t == 'repeat_forever':
                # For loops, extract actions from body without branching on iterations
                loop_body = stmt.get('body', [])
                # Walk loop body as part of current path (single iteration approximation)
                for loop_stmt in loop_body:
                    if isinstance(loop_stmt, dict):
                        st = loop_stmt.get('type')
                        if st == 'if':
                            # Don't branch for if-inside-loop to limit explosion
                            # Just extract actions from both branches
                            self._extract_all_actions(loop_stmt, current_path)
                        else:
                            actions = extract_actions_from_stmt(loop_stmt)
                            current_path['actions'].extend(actions)
                continue  # Continue to next stmt

            elif t == 'exit':
                current_path['actions'].append({'exit': True})
                # Exit terminates handler — add path and return
                self.paths.append(deepcopy(current_path))
                return

            elif t == 'return':
                value = stmt.get('value')
                if value is not None:
                    current_path['actions'].append({'return': expr_to_str(value)})
                else:
                    current_path['actions'].append({'return': None})
                self.paths.append(deepcopy(current_path))
                return

            else:
                # Regular statement — extract actions
                actions = extract_actions_from_stmt(stmt)
                current_path['actions'].extend(actions)

        # End of statement list — this is a complete path
        self.paths.append(deepcopy(current_path))

    def _extract_all_actions(self, stmt, path):
        """Extract all actions from a statement tree without branching."""
        if not isinstance(stmt, dict):
            return

        t = stmt.get('type')
        if t == 'if':
            for s in stmt.get('then_body', []):
                self._extract_all_actions(s, path)
            for s in stmt.get('else_body', []):
                self._extract_all_actions(s, path)
        elif t == 'case':
            for branch in stmt.get('branches', []):
                for s in branch.get('body', []):
                    self._extract_all_actions(s, path)
            if stmt.get('otherwise'):
                for s in stmt['otherwise']:
                    self._extract_all_actions(s, path)
        elif t in ('repeat_range', 'repeat_in', 'repeat_while', 'repeat_forever'):
            for s in stmt.get('body', []):
                self._extract_all_actions(s, path)
        else:
            actions = extract_actions_from_stmt(stmt)
            path['actions'].extend(actions)


# ── Main extraction ─────────────────────────────────────────────────────────

def extract_contracts(ast_data):
    """Extract behavioral contracts from all parsed scripts."""
    all_contracts = []
    total_handlers = 0
    total_paths = 0

    for script_path, ast in ast_data.items():
        if ast.get('type') == 'error':
            continue

        handlers = ast.get('handlers', [])
        folder = script_path.split('/')[0]
        script_name = script_path.rsplit('/', 1)[-1] if '/' in script_path else script_path

        for handler in handlers:
            name = handler.get('name', '')
            body = handler.get('body', [])
            params = handler.get('params', [])
            line = handler.get('line', 0)

            if not body:
                continue

            total_handlers += 1
            enum = PathEnumerator()
            paths = enum.enumerate(body)

            # Filter out paths with no actions (boring)
            interesting_paths = []
            for p in paths:
                if p['actions'] or p['conditions']:
                    interesting_paths.append(p)

            if not interesting_paths:
                continue

            total_paths += len(interesting_paths)

            all_contracts.append({
                'script': script_path,
                'folder': folder,
                'script_name': script_name,
                'handler': name,
                'params': params,
                'line': line,
                'path_count': len(interesting_paths),
                'paths': interesting_paths,
            })

    return all_contracts, total_handlers, total_paths


def main():
    if not AST_FILE.exists():
        print(f"ERROR: {AST_FILE} not found. Run lingo_parser.py first.", file=sys.stderr)
        sys.exit(1)

    print(f"Loading AST from {AST_FILE}...")
    with open(AST_FILE) as f:
        ast_data = json.load(f)

    print(f"Extracting behavioral contracts from {len(ast_data)} scripts...")
    contracts, total_handlers, total_paths = extract_contracts(ast_data)

    # Write output
    with open(OUT_FILE, 'w') as f:
        json.dump(contracts, f, indent=2)

    # Stats
    total_scripts = len(set(c['script'] for c in contracts))
    handlers_with_paths = len(contracts)
    avg_paths = total_paths / handlers_with_paths if handlers_with_paths else 0

    # Per-folder stats
    folder_stats = {}
    for c in contracts:
        folder = c['folder']
        if folder not in folder_stats:
            folder_stats[folder] = {'scripts': set(), 'handlers': 0, 'paths': 0}
        folder_stats[folder]['scripts'].add(c['script'])
        folder_stats[folder]['handlers'] += 1
        folder_stats[folder]['paths'] += c['path_count']

    print(f"\n--- Behavioral Contract Stats ---")
    print(f"Total scripts with behavior:  {total_scripts}")
    print(f"Total handlers analyzed:      {total_handlers}")
    print(f"Handlers with paths:          {handlers_with_paths}")
    print(f"Total execution paths:        {total_paths}")
    print(f"Avg paths per handler:        {avg_paths:.1f}")
    print(f"")
    print(f"Per-folder breakdown:")
    for folder in sorted(folder_stats.keys()):
        fs = folder_stats[folder]
        print(f"  {folder:20s}  {len(fs['scripts']):3d} scripts  {fs['handlers']:4d} handlers  {fs['paths']:5d} paths")

    print(f"\nWrote {len(contracts)} handler contracts to {OUT_FILE}")


if __name__ == '__main__':
    main()
