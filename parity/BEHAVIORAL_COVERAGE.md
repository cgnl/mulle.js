# Behavioral Parity Coverage Report

Auto-generated coverage report for Lingo → JS behavioral verification.

## Summary

| Metric | Count |
|--------|-------|
| Lingo scripts parsed | 713 |
| Total handlers in AST | 2587 |
| Handlers with contracts | 1981 |
| Total execution paths | 13345 |
| Behavioral paths (with game logic) | 2921 |
| Total conditionals | 78122 |
| Test files generated | 53 |
| Test cases generated | 6960 |

## Coverage by Handler Type

| Type | Handlers | Behavioral Paths |
|------|----------|-----------------|
| movie | 43 | 1618 |
| custom | 961 | 445 |
| frame | 326 | 334 |
| loop | 52 | 270 |
| lifecycle | 405 | 203 |
| mouse | 115 | 27 |
| sprite | 58 | 14 |
| cue | 10 | 9 |
| keyboard | 11 | 1 |

## Coverage by Folder

| Folder | Scripts | Handlers | Paths | Behavioral | Conditionals | Tests |
|--------|---------|----------|-------|------------|--------------|-------|
| 00 | 47 | 358 | 2148 | 65 | 11613 | 1975 |
| 01 | 5 | 12 | 81 | 16 | 257 | 80 |
| 02 | 4 | 8 | 50 | 33 | 220 | 1 |
| 03 | 10 | 15 | 48 | 12 | 137 | 48 |
| 04 | 12 | 26 | 167 | 59 | 663 | 5 |
| 05 | 36 | 169 | 1845 | 182 | 13459 | 4 |
| 06 | 16 | 53 | 208 | 19 | 592 | 1 |
| 08 | 10 | 17 | 65 | 10 | 181 | 2 |
| 10 | 1 | 2 | 34 | 32 | 162 | 34 |
| 11 | 18 | 55 | 227 | 24 | 669 | 7 |
| 12 | 22 | 24 | 25 | 24 | 2 | 25 |
| 13 | 5 | 5 | 10 | 6 | 11 | 10 |
| 14 | 10 | 38 | 306 | 16 | 1343 | 0 |
| 15 | 11 | 32 | 141 | 8 | 451 | 4 |
| 70 | 4 | 7 | 16 | 14 | 38 | 2 |
| 71 | 7 | 11 | 17 | 15 | 18 | 2 |
| 76 | 7 | 10 | 19 | 17 | 38 | 4 |
| 77 | 22 | 26 | 174 | 169 | 2098 | 33 |
| 78 | 5 | 8 | 91 | 89 | 620 | 6 |
| 79 | 10 | 13 | 20 | 17 | 24 | 7 |
| 80 | 9 | 13 | 144 | 138 | 1090 | 141 |
| 81 | 6 | 9 | 16 | 14 | 26 | 3 |
| 83 | 12 | 16 | 77 | 75 | 452 | 13 |
| 84 | 10 | 14 | 132 | 118 | 788 | 8 |
| 85 | 6 | 9 | 138 | 134 | 951 | 7 |
| 86 | 7 | 13 | 282 | 138 | 2298 | 5 |
| 87 | 6 | 9 | 24 | 22 | 68 | 3 |
| 88 | 4 | 7 | 22 | 20 | 68 | 4 |
| CDdata | 14 | 68 | 443 | 26 | 1995 | 414 |
| LBstart | 3 | 3 | 4 | 3 | 2 | 4 |
| StartCD | 4 | 6 | 156 | 128 | 1078 | 154 |
| boat_02 | 4 | 8 | 50 | 33 | 220 | 49 |
| boat_04 | 12 | 26 | 167 | 59 | 663 | 166 |
| boat_05 | 36 | 169 | 1845 | 182 | 13459 | 1798 |
| boat_06 | 16 | 53 | 208 | 19 | 592 | 197 |
| boat_08 | 10 | 17 | 65 | 10 | 181 | 62 |
| boat_11 | 18 | 55 | 227 | 24 | 669 | 216 |
| boat_14 | 10 | 38 | 306 | 16 | 1343 | 299 |
| boat_15 | 11 | 32 | 141 | 8 | 451 | 135 |
| boat_70 | 4 | 7 | 16 | 14 | 38 | 14 |
| boat_71 | 7 | 11 | 17 | 15 | 18 | 15 |
| boat_76 | 7 | 10 | 19 | 17 | 38 | 17 |
| boat_77 | 22 | 26 | 174 | 169 | 2098 | 172 |
| boat_78 | 5 | 8 | 91 | 89 | 620 | 89 |
| boat_79 | 10 | 13 | 20 | 17 | 24 | 17 |
| boat_81 | 6 | 9 | 16 | 14 | 26 | 14 |
| boat_83 | 12 | 16 | 77 | 75 | 452 | 75 |
| boat_84 | 10 | 14 | 132 | 118 | 788 | 130 |
| boat_85 | 6 | 9 | 138 | 134 | 951 | 136 |
| boat_86 | 7 | 13 | 282 | 138 | 2298 | 280 |
| boat_87 | 6 | 9 | 24 | 22 | 68 | 22 |
| boat_88 | 4 | 7 | 22 | 20 | 68 | 20 |
| shared_00 | 47 | 358 | 2148 | 65 | 11613 | 1 |
| showboat | 13 | 17 | 30 | 20 | 32 | 30 |

## Architecture

The behavioral verification system has four layers:

1. **Lingo AST Parser** (`tools/parity/lingo_parser.py`)
   - Recursive descent parser for Macromedia Director Lingo
   - Handles all constructs: handlers, conditionals, assignments, calls, loops, case statements
   - Parses all 713 .ls files

2. **Behavioral Contract Extractor** (`tools/parity/extract_behaviors.py`)
   - Walks each handler's AST and enumerates execution paths
   - Tracks conditions (what must be true) and actions (what the code does)
   - 13345 total paths across 1981 handlers

3. **Jest Test Generator** (`tools/parity/generate_tests.py`)
   - Generates one test file per Lingo folder
   - Each test documents an execution path with conditions and expected actions
   - 6960 test cases across 53 files

4. **Coverage Report** (`tools/parity/behavioral_coverage.py`)
   - This report — summarizes coverage across all layers

### Regeneration

```bash
python3 tools/parity/lingo_parser.py          # Parse all .ls files
python3 tools/parity/extract_behaviors.py      # Extract behavioral contracts
python3 tools/parity/generate_tests.py         # Generate Jest tests
python3 tools/parity/behavioral_coverage.py    # Generate this report
cd tools && npx jest src/scenes/__tests__/parity/  # Run tests
```
