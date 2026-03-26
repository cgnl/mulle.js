#!/usr/bin/env python3
"""Lingo AST Parser — recursive descent parser for Macromedia Director Lingo.

Parses every .ls file under decompiled_lingo/ into a JSON AST.
Output: tools/parity/lingo_ast.json

Handles:
  - Handlers: on handlerName ... end
  - Conditionals: if/then/else/end if (multi-line and single-line)
  - Assignments: set X to Y, set the X of Y to Z
  - Function calls with nested args
  - Property access: the X of Y
  - Comparisons: =, <>, >, <, >=, <=
  - Boolean: and, or, not
  - Loops: repeat with ... end repeat
  - Return, exit, next repeat
  - Global/property declarations
  - String concat: &, &&
  - Symbol literals: #SymbolName
  - List/proplist literals: [a, b], [#key: val]
  - VOID checks
  - Case statements
  - Comments: --
  - put statements
"""

import json
import os
import re
import sys
from pathlib import Path

SCRIPT_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = SCRIPT_DIR.parent.parent
LINGO_DIR = PROJECT_ROOT / "decompiled_lingo"
OUT_AST = SCRIPT_DIR / "lingo_ast.json"

# ── Tokenizer ────────────────────────────────────────────────────────────────

TOKEN_SPEC = [
    ('COMMENT',    r'--[^\n]*'),
    ('STRING',     r'"[^"]*"'),
    ('FLOAT',      r'-?\d+\.\d+'),
    ('INTEGER',    r'-?\d+'),
    ('SYMBOL',     r'#\w+'),
    ('LBRACKET',   r'\['),
    ('RBRACKET',   r'\]'),
    ('LPAREN',     r'\('),
    ('RPAREN',     r'\)'),
    ('COMMA',      r','),
    ('COLON',      r':'),
    ('CONCAT_SP',  r'&&'),
    ('CONCAT',     r'&'),
    ('NEQ',        r'<>'),
    ('GTE',        r'>='),
    ('LTE',        r'<='),
    ('LT',         r'<'),
    ('GT',         r'>'),
    ('EQ',         r'='),
    ('DOT',        r'\.'),
    ('PLUS',       r'\+'),
    ('MINUS',      r'-'),
    ('STAR',       r'\*'),
    ('SLASH',      r'/'),
    ('BACKSLASH',  r'\\'),  # line continuation
    ('NEWLINE',    r'\n'),
    ('WS',         r'[ \t]+'),
    ('WORD',       r'[A-Za-z_]\w*'),
]

TOKEN_RE = re.compile('|'.join(f'(?P<{name}>{pattern})' for name, pattern in TOKEN_SPEC))

# Keywords (case-insensitive)
KEYWORDS = {
    'on', 'end', 'if', 'then', 'else', 'set', 'to', 'the', 'of',
    'and', 'or', 'not', 'repeat', 'with', 'down', 'in', 'return',
    'global', 'property', 'put', 'exit', 'next', 'case', 'otherwise',
    'void', 'true', 'false', 'mod', 'contains', 'starts', 'empty',
}


class Token:
    __slots__ = ('type', 'value', 'line')

    def __init__(self, type, value, line):
        self.type = type
        self.value = value
        self.line = line

    def __repr__(self):
        return f'Token({self.type}, {self.value!r}, L{self.line})'


def tokenize(source):
    """Tokenize Lingo source into a list of Token objects."""
    tokens = []
    line = 1
    continuation = False

    for m in TOKEN_RE.finditer(source):
        kind = m.lastgroup
        value = m.group()

        if kind == 'COMMENT':
            continue
        if kind == 'WS':
            continue
        if kind == 'BACKSLASH':
            continuation = True
            continue
        if kind == 'NEWLINE':
            if continuation:
                continuation = False
                continue
            line += 1
            # Collapse multiple newlines
            if tokens and tokens[-1].type == 'NEWLINE':
                continue
            tokens.append(Token('NEWLINE', '\\n', line))
            continue

        # Classify words
        if kind == 'WORD':
            low = value.lower()
            if low in KEYWORDS:
                kind = low.upper()  # e.g., 'IF', 'THEN', 'SET'
            else:
                kind = 'IDENT'

        tokens.append(Token(kind, value, line))

    return tokens


# ── AST Node helpers ─────────────────────────────────────────────────────────

def node(type, **kwargs):
    """Create an AST node dict."""
    n = {'type': type}
    n.update(kwargs)
    return n


# ── Parser ───────────────────────────────────────────────────────────────────

class ParseError(Exception):
    pass


class LingoParser:
    """Recursive descent parser for Lingo scripts."""

    def __init__(self, tokens, source_path=''):
        self.tokens = tokens
        self.pos = 0
        self.source_path = source_path
        self.warnings = []

    # ── Token navigation ──

    def peek(self, offset=0):
        idx = self.pos + offset
        if idx < len(self.tokens):
            return self.tokens[idx]
        return Token('EOF', '', -1)

    def at(self, *types):
        """Check if current token matches any of the given types."""
        return self.peek().type in types

    def at_kw(self, *keywords):
        """Check if current token is a keyword matching one of the given values."""
        t = self.peek()
        return t.type in {kw.upper() for kw in keywords} or \
               (t.type == 'IDENT' and t.value.lower() in {kw.lower() for kw in keywords})

    def match(self, *types):
        """Consume token if it matches, return it or None."""
        if self.at(*types):
            t = self.tokens[self.pos]
            self.pos += 1
            return t
        return None

    def match_kw(self, keyword):
        """Consume keyword token (case-insensitive)."""
        t = self.peek()
        if t.type == keyword.upper() or \
           (t.type == 'IDENT' and t.value.lower() == keyword.lower()):
            self.pos += 1
            return t
        return None

    def expect(self, *types):
        t = self.peek()
        if t.type in types:
            self.pos += 1
            return t
        self.warn(f"Expected {types}, got {t.type}({t.value!r}) at line {t.line}")
        return None

    def skip_newlines(self):
        while self.at('NEWLINE'):
            self.pos += 1

    def warn(self, msg):
        self.warnings.append(f"{self.source_path}: {msg}")

    # ── Top-level parse ──

    def parse(self):
        """Parse a complete Lingo script file."""
        self.skip_newlines()
        result = {
            'type': 'script',
            'properties': [],
            'globals': [],
            'handlers': [],
        }

        while self.pos < len(self.tokens) and not self.at('EOF'):
            self.skip_newlines()
            if self.pos >= len(self.tokens):
                break

            t = self.peek()

            if t.type == 'ON':
                handler = self.parse_handler()
                if handler:
                    result['handlers'].append(handler)
            elif t.type == 'PROPERTY':
                result['properties'].extend(self.parse_property_decl())
            elif t.type == 'GLOBAL':
                result['globals'].extend(self.parse_global_decl())
            elif t.type == 'EOF':
                break
            else:
                # Skip unrecognized top-level token
                self.pos += 1

        return result

    # ── Declarations ──

    def parse_property_decl(self):
        """Parse: property x, y, z"""
        self.expect('PROPERTY')
        props = []
        while True:
            t = self.match('IDENT')
            if t:
                props.append(t.value)
            else:
                # Try consuming keyword-named properties
                t = self.peek()
                if t.type not in ('NEWLINE', 'EOF', 'COMMA'):
                    self.pos += 1
                    props.append(t.value)
                else:
                    break
            if not self.match('COMMA'):
                break
        return props

    def parse_global_decl(self):
        """Parse: global gX, gY"""
        self.expect('GLOBAL')
        globals_ = []
        while True:
            t = self.match('IDENT')
            if t:
                globals_.append(t.value)
            else:
                break
            if not self.match('COMMA'):
                break
        return globals_

    # ── Handlers ──

    def parse_handler(self):
        """Parse: on handlerName [me] [, args] ... end [handlerName]"""
        self.expect('ON')
        name_tok = self.peek()
        if name_tok.type in ('IDENT', 'RETURN', 'EXIT', 'NEXT') or name_tok.type in {k.upper() for k in KEYWORDS}:
            name = name_tok.value
            self.pos += 1
        else:
            self.warn(f"Expected handler name, got {name_tok}")
            return None

        # Parse parameters
        params = []
        while self.match('COMMA') or self.at('IDENT'):
            t = self.match('IDENT')
            if t:
                params.append(t.value)

        self.skip_newlines()

        # Parse body statements
        body = self.parse_block(stop_keywords={'end'})

        # Consume 'end' [handlerName]
        if self.match_kw('end'):
            # Optional handler name after end
            t = self.peek()
            if t.type == 'IDENT' or t.type in {k.upper() for k in KEYWORDS}:
                if t.value.lower() not in ('if', 'repeat', 'case'):
                    self.pos += 1
        self.skip_newlines()

        return node('handler', name=name, params=params, body=body, line=name_tok.line)

    # ── Block parsing ──

    def parse_block(self, stop_keywords=None):
        """Parse statements until we hit a stop keyword or EOF."""
        if stop_keywords is None:
            stop_keywords = set()

        stmts = []
        while self.pos < len(self.tokens):
            self.skip_newlines()
            if self.pos >= len(self.tokens):
                break

            t = self.peek()
            if t.type == 'EOF':
                break

            # Check stop conditions
            if t.type == 'END':
                break
            if t.type == 'ELSE':
                break
            if t.type == 'OTHERWISE' or (t.type == 'IDENT' and t.value.lower() == 'otherwise'):
                break

            # Check for "end if", "end repeat", "end case" lookahead
            if t.type == 'END':
                break

            stmt = self.parse_statement()
            if stmt:
                stmts.append(stmt)

        return stmts

    # ── Statements ──

    def parse_statement(self):
        """Parse a single statement."""
        t = self.peek()

        if t.type == 'SET':
            return self.parse_set()
        elif t.type == 'IF':
            return self.parse_if()
        elif t.type == 'REPEAT':
            return self.parse_repeat()
        elif t.type == 'RETURN':
            return self.parse_return()
        elif t.type == 'EXIT':
            return self.parse_exit()
        elif t.type == 'NEXT':
            return self.parse_next()
        elif t.type == 'PUT':
            return self.parse_put()
        elif t.type == 'GLOBAL':
            globals_ = self.parse_global_decl()
            return node('global_decl', names=globals_)
        elif t.type == 'CASE' or (t.type == 'IDENT' and t.value.lower() == 'case'):
            return self.parse_case()
        elif t.type == 'IDENT':
            return self.parse_expr_statement()
        elif t.type == 'THE':
            return self.parse_the_assignment_or_expr()
        else:
            # Try parsing as expression statement
            expr = self.parse_expression()
            if expr:
                return node('expr_stmt', expr=expr)
            self.pos += 1
            return None

    def parse_set(self):
        """Parse: set X to Y  or  set the X of Y to Z"""
        self.expect('SET')
        t = self.peek()

        if t.type == 'THE':
            # set the X of Y to Z
            self.pos += 1
            prop = self.peek()
            if prop.type in ('IDENT',) or prop.type in {k.upper() for k in KEYWORDS}:
                prop_name = prop.value
                self.pos += 1
            else:
                self.warn(f"Expected property name after 'the', got {prop}")
                return self.skip_to_newline()

            target = None
            if self.match_kw('of'):
                target = self.parse_expression()

            if not self.match_kw('to'):
                self.warn("Expected 'to' in set statement")
                return self.skip_to_newline()

            value = self.parse_expression()
            return node('set_prop', property=prop_name, target=target, value=value)

        else:
            # set X to Y
            target = self.parse_primary()
            if not self.match_kw('to'):
                self.warn("Expected 'to' in set statement")
                return self.skip_to_newline()
            value = self.parse_expression()
            return node('set', target=target, value=value)

    def parse_the_assignment_or_expr(self):
        """Handle 'the X of Y' at statement level — could be property set or expr."""
        # Check if this is "set the..." (already handled in parse_set)
        # This handles standalone "the X of Y" expressions
        expr = self.parse_expression()
        return node('expr_stmt', expr=expr)

    def parse_if(self):
        """Parse if/then/else/end if — both single-line and multi-line."""
        self.expect('IF')
        condition = self.parse_expression()

        if not self.match_kw('then'):
            # Recovery: some Lingo constructs (e.g., "the last char in X")
            # leave unparsed tokens before 'then'. Skip forward to find it.
            recovered = False
            for lookahead in range(10):
                t2 = self.peek()
                if t2.type == 'THEN' or (t2.type == 'IDENT' and t2.value.lower() == 'then'):
                    self.pos += 1
                    recovered = True
                    break
                if t2.type in ('NEWLINE', 'EOF'):
                    break
                self.pos += 1
            if not recovered:
                self.warn("Expected 'then' after if condition")

        # Check if single-line (no newline before significant content)
        t = self.peek()
        if t.type != 'NEWLINE' and t.type != 'EOF':
            # Single-line if: if X then Y
            # But could also be "if X then \n" with newline right after
            then_body = [self.parse_statement()]
            then_body = [s for s in then_body if s]

            # Check for else on same line
            else_body = []
            if self.at('ELSE'):
                self.pos += 1
                stmt = self.parse_statement()
                if stmt:
                    else_body = [stmt]

            return node('if', condition=condition, then_body=then_body, else_body=else_body)

        # Multi-line if
        self.skip_newlines()
        then_body = self.parse_block(stop_keywords={'end', 'else'})

        else_body = []
        if self.match_kw('else'):
            # Check for "else if" pattern
            if self.at('IF'):
                else_stmt = self.parse_if()
                else_body = [else_stmt] if else_stmt else []
            else:
                self.skip_newlines()
                else_body = self.parse_block(stop_keywords={'end'})

        # Consume 'end if'
        if self.match_kw('end'):
            self.match_kw('if')

        return node('if', condition=condition, then_body=then_body, else_body=else_body)

    def parse_repeat(self):
        """Parse repeat loops."""
        self.expect('REPEAT')

        t = self.peek()
        if t.type == 'WITH':
            self.pos += 1
            var = self.expect('IDENT')
            var_name = var.value if var else '_'

            t2 = self.peek()
            if t2.type == 'IN':
                # repeat with X in list
                self.pos += 1
                collection = self.parse_expression()
                self.skip_newlines()
                body = self.parse_block(stop_keywords={'end'})
                if self.match_kw('end'):
                    self.match_kw('repeat')
                return node('repeat_in', var=var_name, collection=collection, body=body)
            elif t2.type == 'EQ':
                # repeat with X = start to end
                self.pos += 1
                start = self.parse_expression()
                down = False
                if self.match_kw('down'):
                    down = True
                self.match_kw('to')
                end = self.parse_expression()
                self.skip_newlines()
                body = self.parse_block(stop_keywords={'end'})
                if self.match_kw('end'):
                    self.match_kw('repeat')
                return node('repeat_range', var=var_name, start=start, end=end, down=down, body=body)

        elif t.type == 'IDENT' and t.value.lower() == 'while':
            # repeat while condition
            self.pos += 1
            condition = self.parse_expression()
            self.skip_newlines()
            body = self.parse_block(stop_keywords={'end'})
            if self.match_kw('end'):
                self.match_kw('repeat')
            return node('repeat_while', condition=condition, body=body)

        # bare "repeat" (infinite loop, uses exit repeat)
        self.skip_newlines()
        body = self.parse_block(stop_keywords={'end'})
        if self.match_kw('end'):
            self.match_kw('repeat')
        return node('repeat_forever', body=body)

    def parse_return(self):
        self.expect('RETURN')
        t = self.peek()
        if t.type == 'NEWLINE' or t.type == 'EOF':
            return node('return', value=None)
        value = self.parse_expression()
        return node('return', value=value)

    def parse_exit(self):
        self.expect('EXIT')
        t = self.peek()
        if t.type == 'REPEAT' or (t.type == 'IDENT' and t.value.lower() == 'repeat'):
            self.pos += 1
            return node('exit_repeat')
        return node('exit')

    def parse_next(self):
        self.expect('NEXT')
        t = self.peek()
        if t.type == 'REPEAT' or (t.type == 'IDENT' and t.value.lower() == 'repeat'):
            self.pos += 1
            return node('next_repeat')
        return node('next')

    def parse_put(self):
        self.expect('PUT')
        values = []
        while True:
            values.append(self.parse_expression())
            if not self.match('COMMA'):
                break
        return node('put', values=values)

    def parse_case(self):
        """Parse: case X of / value: stmts / end case"""
        self.match_kw('case')
        expr = self.parse_expression()
        self.match_kw('of')
        self.skip_newlines()

        branches = []
        otherwise = None

        while self.pos < len(self.tokens):
            self.skip_newlines()
            t = self.peek()

            if t.type == 'END':
                break

            if t.type == 'OTHERWISE' or (t.type == 'IDENT' and t.value.lower() == 'otherwise'):
                self.pos += 1
                self.match('COLON')
                self.skip_newlines()
                otherwise = self.parse_block(stop_keywords={'end'})
                break

            # Parse case value(s): can be comma-separated
            values = []
            val = self.parse_expression()
            if val:
                values.append(val)
            while self.match('COMMA'):
                val = self.parse_expression()
                if val:
                    values.append(val)

            self.match('COLON')
            self.skip_newlines()

            body = self.parse_case_body()
            branches.append(node('case_branch', values=values, body=body))

        if self.match_kw('end'):
            self.match_kw('case')

        return node('case', expr=expr, branches=branches, otherwise=otherwise)

    def parse_case_body(self):
        """Parse case branch body — stops at next case value, otherwise, or end."""
        stmts = []
        while self.pos < len(self.tokens):
            self.skip_newlines()
            t = self.peek()
            if t.type == 'EOF' or t.type == 'END':
                break
            if t.type == 'OTHERWISE' or (t.type == 'IDENT' and t.value.lower() == 'otherwise'):
                break

            # Check if this looks like a new case value (symbol, string, integer followed by colon)
            if t.type in ('SYMBOL', 'STRING', 'INTEGER', 'FLOAT'):
                # Lookahead for colon after expression
                if self.is_case_label():
                    break

            stmt = self.parse_statement()
            if stmt:
                stmts.append(stmt)
        return stmts

    def is_case_label(self):
        """Check if current position starts a case label (value followed by colon)."""
        save = self.pos
        try:
            self.parse_expression()
            result = self.at('COLON')
            return result
        except:
            return False
        finally:
            self.pos = save

    def parse_expr_statement(self):
        """Parse identifier-led statement: could be assignment or function call."""
        expr = self.parse_expression()
        if not expr:
            return None
        # Check for "= value" assignment (rare in Lingo but possible for member assignment)
        if self.at('EQ') and expr.get('type') == 'prop_access':
            self.pos += 1
            value = self.parse_expression()
            return node('assign', target=expr, value=value)
        return node('expr_stmt', expr=expr)

    # ── Expressions ──

    def parse_expression(self):
        """Parse a full expression with boolean operators."""
        return self.parse_or()

    def parse_or(self):
        left = self.parse_and()
        while self.match_kw('or'):
            right = self.parse_and()
            left = node('binop', op='or', left=left, right=right)
        return left

    def parse_and(self):
        left = self.parse_not()
        while self.match_kw('and'):
            right = self.parse_not()
            left = node('binop', op='and', left=left, right=right)
        return left

    def parse_not(self):
        if self.match_kw('not'):
            operand = self.parse_not()
            return node('unop', op='not', operand=operand)
        return self.parse_comparison()

    def parse_comparison(self):
        left = self.parse_concat()
        ops = {'EQ': '=', 'NEQ': '<>', 'GT': '>', 'LT': '<', 'GTE': '>=', 'LTE': '<='}
        # Support chained comparisons: "argNum < tmpDiv = 0" → (argNum < tmpDiv) = 0
        while True:
            t = self.peek()
            if t.type in ops:
                self.pos += 1
                right = self.parse_concat()
                left = node('binop', op=ops[t.type], left=left, right=right)
            elif t.type == 'CONTAINS' or (t.type == 'IDENT' and t.value.lower() == 'contains'):
                self.pos += 1
                right = self.parse_concat()
                left = node('binop', op='contains', left=left, right=right)
            elif t.type == 'STARTS' or (t.type == 'IDENT' and t.value.lower() == 'starts'):
                self.pos += 1
                right = self.parse_concat()
                left = node('binop', op='starts', left=left, right=right)
            else:
                break
        return left

    def parse_concat(self):
        left = self.parse_addition()
        while True:
            if self.match('CONCAT_SP'):
                right = self.parse_addition()
                left = node('binop', op='&&', left=left, right=right)
            elif self.match('CONCAT'):
                right = self.parse_addition()
                left = node('binop', op='&', left=left, right=right)
            else:
                break
        return left

    def parse_addition(self):
        left = self.parse_multiplication()
        while True:
            if self.match('PLUS'):
                right = self.parse_multiplication()
                left = node('binop', op='+', left=left, right=right)
            elif self.match('MINUS'):
                right = self.parse_multiplication()
                left = node('binop', op='-', left=left, right=right)
            else:
                break
        return left

    def parse_multiplication(self):
        left = self.parse_unary()
        while True:
            t = self.peek()
            if t.type == 'STAR':
                self.pos += 1
                right = self.parse_unary()
                left = node('binop', op='*', left=left, right=right)
            elif t.type == 'SLASH':
                self.pos += 1
                right = self.parse_unary()
                left = node('binop', op='/', left=left, right=right)
            elif t.type == 'MOD' or (t.type == 'IDENT' and t.value.lower() == 'mod'):
                self.pos += 1
                right = self.parse_unary()
                left = node('binop', op='mod', left=left, right=right)
            else:
                break
        return left

    def parse_unary(self):
        if self.match('MINUS'):
            operand = self.parse_postfix()
            return node('unop', op='-', operand=operand)
        return self.parse_postfix()

    def parse_postfix(self):
        """Parse primary with postfix 'of' chains: X of Y of Z."""
        expr = self.parse_primary()
        # Handle "X of Y" postfix — Lingo property access without "the"
        # e.g., "castMembers of castLib X", "member X of castLib Y"
        while self.at('OF'):
            self.pos += 1
            target = self.parse_primary()
            expr = node('prop_access', property=self._expr_to_name(expr), target=target)
        return expr

    def _expr_to_name(self, expr):
        """Convert expression to string name for prop_access."""
        if not isinstance(expr, dict):
            return str(expr)
        t = expr.get('type')
        if t == 'ident':
            return expr.get('name', '')
        if t == 'ref':
            return f"{expr.get('kind', '')}_{self._expr_to_name(expr.get('arg'))}"
        if t == 'call':
            return expr.get('name', '')
        if t == 'prop_access':
            return expr.get('property', '')
        # For complex expressions, just return the whole node
        return expr

    def parse_primary(self):
        """Parse primary expressions: literals, identifiers, function calls, etc."""
        t = self.peek()

        # The X of Y
        if t.type == 'THE':
            return self.parse_the_expr()

        # String literal
        if t.type == 'STRING':
            self.pos += 1
            return node('string', value=t.value[1:-1])  # strip quotes

        # Integer literal
        if t.type == 'INTEGER':
            self.pos += 1
            return node('integer', value=int(t.value))

        # Float literal
        if t.type == 'FLOAT':
            self.pos += 1
            return node('float', value=float(t.value))

        # Symbol literal
        if t.type == 'SYMBOL':
            self.pos += 1
            return node('symbol', value=t.value[1:])  # strip #

        # VOID keyword
        if t.type == 'VOID':
            self.pos += 1
            return node('void')

        # TRUE/FALSE
        if t.type == 'TRUE':
            self.pos += 1
            return node('boolean', value=True)
        if t.type == 'FALSE':
            self.pos += 1
            return node('boolean', value=False)

        # EMPTY string constant
        if t.type == 'EMPTY':
            self.pos += 1
            return node('empty')

        # List/proplist literal
        if t.type == 'LBRACKET':
            return self.parse_list_literal()

        # Parenthesized expression
        if t.type == 'LPAREN':
            self.pos += 1
            expr = self.parse_expression()
            self.match('RPAREN')
            return expr

        # NOT keyword
        if t.type == 'NOT':
            return self.parse_not()

        # Identifier or function call
        if t.type == 'IDENT':
            return self.parse_ident_expr()

        # "char X of Y", "char X to Y of Z"
        if t.type == 'IDENT' and t.value.lower() == 'char':
            return self.parse_char_expr()

        # RETURN as a Lingo constant (carriage return character) — but only in expression context
        # Detect: when RETURN appears where a value is expected (after =, to, &, etc.)
        if t.type == 'RETURN':
            # Check if this looks like a constant use (not "return expr" statement)
            # If we're here via parse_primary called from an expression parser, it's a constant
            self.pos += 1
            return node('constant', value='RETURN')

        # Handle keywords used as identifiers in some contexts
        if t.type in {k.upper() for k in KEYWORDS}:
            # Some keywords can be used as identifiers in call contexts
            if t.type in ('EXIT', 'PUT', 'SET', 'REPEAT', 'IF'):
                return None
            self.pos += 1
            return node('ident', name=t.value)

        return None

    def parse_the_expr(self):
        """Parse: the X of Y, the X, the spriteNum of me"""
        self.expect('THE')
        prop = self.peek()
        if prop.type in ('IDENT',) or prop.type in {k.upper() for k in KEYWORDS}:
            prop_name = prop.value
            self.pos += 1
        else:
            return node('ident', name='the')

        if self.match_kw('of'):
            target = self.parse_expression()
            result = node('prop_access', property=prop_name, target=target)
        else:
            result = node('the_prop', property=prop_name)

        return result

    # Lingo "reference" keywords: sprite N, member X, castLib X, sound N
    REFERENCE_KEYWORDS = {'sprite', 'member', 'castlib', 'sound'}

    def parse_ident_expr(self):
        """Parse identifier, possibly followed by function call parens or member access."""
        t = self.peek()
        name = t.value
        low = name.lower()
        self.pos += 1

        # Special Lingo reference keywords: sprite EXPR, member EXPR, castLib EXPR, sound EXPR
        if low in self.REFERENCE_KEYWORDS and not self.at('LPAREN'):
            # These take a following expression as argument (no parens needed)
            next_t = self.peek()
            # Don't consume keywords/operators that belong to enclosing syntax
            STOP_TYPES = ('NEWLINE', 'EOF', 'COMMA', 'RPAREN', 'RBRACKET',
                          'EQ', 'NEQ', 'GT', 'LT', 'GTE', 'LTE', 'COLON',
                          'TO', 'AND', 'OR', 'THEN', 'ELSE', 'END', 'OF',
                          'CONCAT', 'CONCAT_SP', 'PLUS', 'MINUS', 'STAR', 'SLASH')
            if next_t.type not in STOP_TYPES:
                arg = self.parse_primary()
                result = node('ref', kind=low, arg=arg)
                # Check for dot access on ref
                while self.at('DOT'):
                    self.pos += 1
                    member = self.peek()
                    if member.type in ('IDENT',) or member.type in {k.upper() for k in KEYWORDS}:
                        self.pos += 1
                        result = node('member_access', object=result, member=member.value)
                    else:
                        break
                return result

        # "char X of Y" or "char X to Y of Z"
        if low == 'char':
            return self.parse_char_expr_inner()

        # "delete" as a statement keyword (e.g., "delete char 1 of X")
        if low == 'delete':
            target = self.parse_primary()
            return node('delete', target=target)

        # Function call with parens
        if self.at('LPAREN'):
            self.pos += 1
            args = self.parse_arg_list()
            self.match('RPAREN')
            result = node('call', name=name, args=args)
        else:
            result = node('ident', name=name)

        # Check for property access via dot
        while self.at('DOT'):
            self.pos += 1
            member = self.peek()
            if member.type in ('IDENT',) or member.type in {k.upper() for k in KEYWORDS}:
                self.pos += 1
                result = node('member_access', object=result, member=member.value)
            else:
                break

        return result

    def parse_char_expr_inner(self):
        """Parse char expression after 'char' has been consumed."""
        start = self.parse_expression()
        end = None
        if self.match_kw('to'):
            end = self.parse_expression()
        if self.match_kw('of'):
            target = self.parse_expression()
        else:
            target = None
        return node('char_access', start=start, end=end, target=target)

    def parse_char_expr(self):
        """Parse: char N of string, char N to M of string"""
        self.match_kw('char')
        start = self.parse_expression()
        if self.match_kw('to'):
            end = self.parse_expression()
        else:
            end = None
        self.match_kw('of')
        target = self.parse_expression()
        return node('char_access', start=start, end=end, target=target)

    def parse_list_literal(self):
        """Parse: [a, b, c] or [#key: val, #key2: val2] or [:]"""
        self.expect('LBRACKET')

        # Empty list
        if self.at('RBRACKET'):
            self.pos += 1
            return node('list', items=[])

        # Empty proplist [:]
        if self.at('COLON'):
            self.pos += 1
            self.match('RBRACKET')
            return node('proplist', items=[])

        # Check if proplist (first item is #symbol: or string:)
        items = []
        first = self.parse_expression()

        if self.at('COLON'):
            # Property list
            self.pos += 1
            val = self.parse_expression()
            items.append(node('prop_pair', key=first, value=val))

            while self.match('COMMA'):
                self.skip_newlines()
                if self.at('RBRACKET'):
                    break
                key = self.parse_expression()
                self.match('COLON')
                val = self.parse_expression()
                items.append(node('prop_pair', key=key, value=val))

            self.match('RBRACKET')
            return node('proplist', items=items)
        else:
            # Regular list
            items.append(first)
            while self.match('COMMA'):
                self.skip_newlines()
                if self.at('RBRACKET'):
                    break
                items.append(self.parse_expression())

            self.match('RBRACKET')
            return node('list', items=items)

    def parse_arg_list(self):
        """Parse comma-separated arguments."""
        args = []
        if self.at('RPAREN'):
            return args
        arg = self.parse_expression()
        if arg:
            args.append(arg)
        while self.match('COMMA'):
            arg = self.parse_expression()
            if arg:
                args.append(arg)
        return args

    def skip_to_newline(self):
        """Skip tokens until newline — recovery from parse errors."""
        while self.pos < len(self.tokens) and not self.at('NEWLINE', 'EOF'):
            self.pos += 1
        return None


# ── Main ─────────────────────────────────────────────────────────────────────

def parse_file(filepath, rel_path=''):
    """Parse a single .ls file and return AST + warnings."""
    try:
        source = filepath.read_text(encoding='utf-8', errors='replace')
    except Exception as e:
        return {'type': 'error', 'message': str(e)}, [str(e)]

    tokens = tokenize(source)
    parser = LingoParser(tokens, source_path=rel_path)

    try:
        ast = parser.parse()
    except Exception as e:
        ast = {'type': 'error', 'message': str(e)}
        parser.warnings.append(f"{rel_path}: parse exception: {e}")

    ast['path'] = rel_path
    return ast, parser.warnings


def main():
    if not LINGO_DIR.is_dir():
        print(f"ERROR: {LINGO_DIR} not found", file=sys.stderr)
        sys.exit(1)

    ls_files = sorted(LINGO_DIR.rglob("*.ls"))
    print(f"Found {len(ls_files)} .ls files")

    all_ast = {}
    all_warnings = []
    total_handlers = 0
    total_stmts = 0
    error_count = 0

    for f in ls_files:
        rel = str(f.relative_to(LINGO_DIR))
        ast, warnings = parse_file(f, rel)
        all_ast[rel] = ast
        all_warnings.extend(warnings)

        if ast.get('type') == 'error':
            error_count += 1
        else:
            handlers = ast.get('handlers', [])
            total_handlers += len(handlers)
            for h in handlers:
                total_stmts += count_stmts(h.get('body', []))

    with open(OUT_AST, 'w') as fp:
        json.dump(all_ast, fp, indent=2)

    print(f"\n--- Parser Stats ---")
    print(f"Scripts parsed:    {len(all_ast)}")
    print(f"Total handlers:    {total_handlers}")
    print(f"Total statements:  {total_stmts}")
    print(f"Parse errors:      {error_count}")
    print(f"Warnings:          {len(all_warnings)}")

    if all_warnings:
        print(f"\nFirst 20 warnings:")
        for w in all_warnings[:20]:
            print(f"  - {w}")

    print(f"\nWrote AST to {OUT_AST}")


def count_stmts(body):
    """Recursively count statements in a body."""
    count = 0
    for stmt in body:
        if not isinstance(stmt, dict):
            continue
        count += 1
        for key in ('then_body', 'else_body', 'body', 'branches', 'otherwise'):
            child = stmt.get(key)
            if isinstance(child, list):
                if child and isinstance(child[0], dict) and 'type' in child[0]:
                    count += count_stmts(child)
                # Handle case branches
                for item in child:
                    if isinstance(item, dict) and item.get('type') == 'case_branch':
                        count += count_stmts(item.get('body', []))
    return count


if __name__ == '__main__':
    main()
