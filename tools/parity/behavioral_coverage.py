#!/usr/bin/env python3
"""Behavioral Coverage Report — summarize parity test coverage.

Reads behavioral_contracts.json and the generated test files to produce
a comprehensive coverage report showing:
- Total execution paths found in Lingo
- Total tests generated
- Per-folder behavioral coverage
- Coverage by handler type
"""

import json
import os
import sys
from collections import defaultdict
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
CONTRACTS_FILE = SCRIPT_DIR / "behavioral_contracts.json"
AST_FILE = SCRIPT_DIR / "lingo_ast.json"
TEST_DIR = PROJECT_ROOT / "tools" / "src" / "scenes" / "__tests__" / "parity"
OUT_REPORT = SCRIPT_DIR / "behavioral_coverage.json"
OUT_REPORT_MD = SCRIPT_DIR / "BEHAVIORAL_COVERAGE.md"

# Behavioral functions that indicate interesting paths
BEHAVIORAL_FNS = {
    'go', 'isininventory', 'deletefrominventory', 'setininventory',
    'addtoinventory', 'addcompletedmission', 'addgivenmission',
    'ismissioncompleted', 'ismissiongiven', 'addmedal', 'getmedal',
    'primatrip', 'drawboat', 'setsky', 'puppetsound', 'mullesez',
    'gotoscene', 'trysailing', 'cursor',
}


def count_tests_in_file(filepath):
    """Count test() calls in a Jest test file."""
    try:
        content = filepath.read_text()
        return content.count("test('") + content.count('test("')
    except:
        return 0


def path_has_behavior(path):
    """Check if a path contains interesting behavioral actions."""
    for action in path.get('actions', []):
        fn = action.get('fn', '').lower()
        if fn in BEHAVIORAL_FNS:
            return True
        if action.get('assign') in ('myMarker', 'tmpMarker', 'marker', 'tmpStartSuffix'):
            return True
    return False


def classify_handler(name):
    """Classify handler type."""
    name_lower = name.lower()
    if name_lower in ('exitframe', 'enterframe', 'prepareframe', 'stepframe'):
        return 'frame'
    if name_lower in ('mouseup', 'mousedown', 'mouseenter', 'mouseleave',
                       'mousewithin', 'rightmouseup', 'rightmousedown'):
        return 'mouse'
    if name_lower in ('startmovie', 'stopmovie', 'preparemovie'):
        return 'movie'
    if name_lower in ('beginsprite', 'endsprite'):
        return 'sprite'
    if name_lower in ('init', 'new', 'kill'):
        return 'lifecycle'
    if name_lower in ('cuepassed',):
        return 'cue'
    if name_lower in ('keydown', 'key'):
        return 'keyboard'
    if name_lower in ('loop', 'idle'):
        return 'loop'
    return 'custom'


def main():
    if not CONTRACTS_FILE.exists():
        print(f"ERROR: {CONTRACTS_FILE} not found.", file=sys.stderr)
        sys.exit(1)

    with open(CONTRACTS_FILE) as f:
        contracts = json.load(f)

    # Load AST for total script/handler counts
    with open(AST_FILE) as f:
        ast_data = json.load(f)

    # Count tests in generated files
    test_files = sorted(TEST_DIR.glob("*.parity.test.js"))
    total_generated_tests = 0
    tests_per_folder = {}
    for tf in test_files:
        folder = tf.stem.replace('.parity.test', '')
        count = count_tests_in_file(tf)
        tests_per_folder[folder] = count
        total_generated_tests += count

    # Aggregate contract stats
    total_scripts = len(ast_data)
    total_handlers_in_ast = sum(
        len(ast.get('handlers', []))
        for ast in ast_data.values()
        if ast.get('type') != 'error'
    )

    # Per-folder stats from contracts
    folder_stats = defaultdict(lambda: {
        'scripts': set(),
        'handlers': 0,
        'total_paths': 0,
        'behavioral_paths': 0,
        'conditionals': 0,
        'handler_types': defaultdict(int),
    })

    all_conditionals = 0
    all_paths = 0
    all_behavioral = 0
    handler_type_stats = defaultdict(lambda: {'handlers': 0, 'paths': 0})

    for c in contracts:
        folder = c['folder']
        fs = folder_stats[folder]
        fs['scripts'].add(c['script'])
        fs['handlers'] += 1
        fs['total_paths'] += c['path_count']
        all_paths += c['path_count']

        htype = classify_handler(c['handler'])
        fs['handler_types'][htype] += 1
        handler_type_stats[htype]['handlers'] += 1

        for path in c.get('paths', []):
            cond_count = len(path.get('conditions', []))
            fs['conditionals'] += cond_count
            all_conditionals += cond_count

            if path_has_behavior(path):
                fs['behavioral_paths'] += 1
                all_behavioral += 1
                handler_type_stats[htype]['paths'] += 1

    # Build JSON report
    report = {
        'summary': {
            'total_scripts': total_scripts,
            'total_handlers_in_ast': total_handlers_in_ast,
            'handlers_with_contracts': len(contracts),
            'total_execution_paths': all_paths,
            'behavioral_paths': all_behavioral,
            'total_conditionals': all_conditionals,
            'total_tests_generated': total_generated_tests,
            'test_files_generated': len(test_files),
        },
        'by_handler_type': {
            htype: {
                'handlers': stats['handlers'],
                'behavioral_paths': stats['paths'],
            }
            for htype, stats in sorted(handler_type_stats.items())
        },
        'by_folder': {},
    }

    for folder in sorted(folder_stats.keys()):
        fs = folder_stats[folder]
        tests = tests_per_folder.get(folder, 0)
        report['by_folder'][folder] = {
            'scripts': len(fs['scripts']),
            'handlers': fs['handlers'],
            'total_paths': fs['total_paths'],
            'behavioral_paths': fs['behavioral_paths'],
            'conditionals': fs['conditionals'],
            'tests_generated': tests,
            'handler_types': dict(fs['handler_types']),
        }

    with open(OUT_REPORT, 'w') as f:
        json.dump(report, f, indent=2)

    # Build Markdown report
    md = []
    md.append("# Behavioral Parity Coverage Report")
    md.append("")
    md.append("Auto-generated coverage report for Lingo → JS behavioral verification.")
    md.append("")
    md.append("## Summary")
    md.append("")
    md.append(f"| Metric | Count |")
    md.append(f"|--------|-------|")
    md.append(f"| Lingo scripts parsed | {total_scripts} |")
    md.append(f"| Total handlers in AST | {total_handlers_in_ast} |")
    md.append(f"| Handlers with contracts | {len(contracts)} |")
    md.append(f"| Total execution paths | {all_paths} |")
    md.append(f"| Behavioral paths (with game logic) | {all_behavioral} |")
    md.append(f"| Total conditionals | {all_conditionals} |")
    md.append(f"| Test files generated | {len(test_files)} |")
    md.append(f"| Test cases generated | {total_generated_tests} |")
    md.append("")

    md.append("## Coverage by Handler Type")
    md.append("")
    md.append("| Type | Handlers | Behavioral Paths |")
    md.append("|------|----------|-----------------|")
    for htype, stats in sorted(handler_type_stats.items(), key=lambda x: -x[1]['paths']):
        md.append(f"| {htype} | {stats['handlers']} | {stats['paths']} |")
    md.append("")

    md.append("## Coverage by Folder")
    md.append("")
    md.append("| Folder | Scripts | Handlers | Paths | Behavioral | Conditionals | Tests |")
    md.append("|--------|---------|----------|-------|------------|--------------|-------|")
    for folder in sorted(folder_stats.keys()):
        fs = folder_stats[folder]
        tests = tests_per_folder.get(folder, 0)
        md.append(
            f"| {folder} | {len(fs['scripts'])} | {fs['handlers']} | "
            f"{fs['total_paths']} | {fs['behavioral_paths']} | "
            f"{fs['conditionals']} | {tests} |"
        )
    md.append("")

    md.append("## Architecture")
    md.append("")
    md.append("The behavioral verification system has four layers:")
    md.append("")
    md.append("1. **Lingo AST Parser** (`tools/parity/lingo_parser.py`)")
    md.append("   - Recursive descent parser for Macromedia Director Lingo")
    md.append("   - Handles all constructs: handlers, conditionals, assignments, calls, loops, case statements")
    md.append(f"   - Parses all {total_scripts} .ls files")
    md.append("")
    md.append("2. **Behavioral Contract Extractor** (`tools/parity/extract_behaviors.py`)")
    md.append("   - Walks each handler's AST and enumerates execution paths")
    md.append("   - Tracks conditions (what must be true) and actions (what the code does)")
    md.append(f"   - {all_paths} total paths across {len(contracts)} handlers")
    md.append("")
    md.append("3. **Jest Test Generator** (`tools/parity/generate_tests.py`)")
    md.append("   - Generates one test file per Lingo folder")
    md.append("   - Each test documents an execution path with conditions and expected actions")
    md.append(f"   - {total_generated_tests} test cases across {len(test_files)} files")
    md.append("")
    md.append("4. **Coverage Report** (`tools/parity/behavioral_coverage.py`)")
    md.append("   - This report — summarizes coverage across all layers")
    md.append("")
    md.append("### Regeneration")
    md.append("")
    md.append("```bash")
    md.append("python3 tools/parity/lingo_parser.py          # Parse all .ls files")
    md.append("python3 tools/parity/extract_behaviors.py      # Extract behavioral contracts")
    md.append("python3 tools/parity/generate_tests.py         # Generate Jest tests")
    md.append("python3 tools/parity/behavioral_coverage.py    # Generate this report")
    md.append("cd tools && npx jest src/scenes/__tests__/parity/  # Run tests")
    md.append("```")

    with open(OUT_REPORT_MD, 'w') as f:
        f.write('\n'.join(md) + '\n')

    # Print summary
    print(f"\n{'='*60}")
    print(f"  BEHAVIORAL PARITY COVERAGE REPORT")
    print(f"{'='*60}")
    print(f"")
    print(f"  Lingo scripts parsed:        {total_scripts}")
    print(f"  Total handlers in AST:       {total_handlers_in_ast}")
    print(f"  Handlers with contracts:     {len(contracts)}")
    print(f"  Total execution paths:       {all_paths}")
    print(f"  Behavioral paths:            {all_behavioral}")
    print(f"  Total conditionals:          {all_conditionals}")
    print(f"  Test files generated:        {len(test_files)}")
    print(f"  Test cases generated:        {total_generated_tests}")
    print(f"")
    print(f"  Reports written to:")
    print(f"    {OUT_REPORT}")
    print(f"    {OUT_REPORT_MD}")
    print(f"{'='*60}")


if __name__ == '__main__':
    main()
