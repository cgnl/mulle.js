import re


def _split_items(content):
    items = []
    current = ""
    bracket_count = 0
    in_string = False

    for c in content:
        if c == '"' and (not current or current[-1] != '\\'):
            in_string = not in_string
        if not in_string:
            if c == '[':
                bracket_count += 1
            elif c == ']':
                bracket_count -= 1
        if c == ',' and bracket_count == 0 and not in_string:
            if current.strip():
                items.append(current.strip())
            current = ""
        else:
            current += c

    if current.strip():
        items.append(current.strip())
    return items


def _extract_tag_list(text, tag):
    # Find "#Tag:" and return list content inside the following brackets
    idx = text.find(f'#{tag}:')
    if idx == -1:
        return None
    idx = text.find('[', idx)
    if idx == -1:
        return None
    depth = 0
    start = idx + 1
    for i in range(idx, len(text)):
        if text[i] == '[':
            depth += 1
        elif text[i] == ']':
            depth -= 1
            if depth == 0:
                return text[start:i]
    return None


def _parse_function_call(token):
    # token like "[#RndFrame,[13,14],13,14]"
    inner = token[1:-1].strip()
    parts = _split_items(inner)
    if not parts:
        return None
    func_token = parts[0].strip()
    func_name = func_token[1:] if func_token.startswith('#') else func_token
    args = []
    for arg in parts[1:]:
        arg = arg.strip()
        if not arg:
            continue
        if arg.startswith('[') and arg.endswith(']'):
            sub = _split_items(arg[1:-1])
            parsed = []
            for item in sub:
                item = item.strip()
                if not item:
                    continue
                try:
                    parsed.append(int(item))
                except ValueError:
                    parsed.append(item)
            args.append(parsed)
            continue
        if arg.startswith('#'):
            args.append(arg[1:])
            continue
        try:
            args.append(int(arg))
        except ValueError:
            args.append(arg)
    return {'function': func_name, 'arguments': args}


def _parse_action_frames(content):
    frames = []
    for token in _split_items(content):
        if not token:
            continue
        if token.startswith('[') and token.endswith(']') and token.lstrip().startswith('[#'):
            call = _parse_function_call(token)
            if call:
                frames.append(call)
            continue
        if token.startswith('#'):
            frames.append(token[1:])
            continue
        try:
            frames.append(int(token))
        except ValueError:
            frames.append(token)
    return frames


def parse_animation_chart(animation_chart):
    text = animation_chart.strip()
    actions_content = _extract_tag_list(text, 'Actions')
    if actions_content is None:
        raise RuntimeError('Unable to parse "%s" as animation' % animation_chart)

    animations = {}

    # Parse action entries: #Name:[...]
    i = 0
    while i < len(actions_content):
        # Skip commas/whitespace
        while i < len(actions_content) and actions_content[i] in ' \t\n,':
            i += 1
        if i >= len(actions_content):
            break
        if actions_content[i] != '#':
            i += 1
            continue
        i += 1
        name_start = i
        while i < len(actions_content) and actions_content[i].isalnum():
            i += 1
        name = actions_content[name_start:i]
        # Skip whitespace and colon
        while i < len(actions_content) and actions_content[i] in ' \t:':
            i += 1
        if i >= len(actions_content) or actions_content[i] != '[':
            continue
        # Extract bracketed content
        depth = 0
        start = i + 1
        while i < len(actions_content):
            if actions_content[i] == '[':
                depth += 1
            elif actions_content[i] == ']':
                depth -= 1
                if depth == 0:
                    break
            i += 1
        frames_content = actions_content[start:i]
        animations[name] = _parse_action_frames(frames_content)
        i += 1

    return animations
