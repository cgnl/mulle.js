#!/usr/bin/env python3
"""
Extract all SCRIPT cast members from DXR/CXT files and search for Dutch text.
"""
import sys
import os
import json
import re
from pathlib import Path

# Add ShockwaveParser to path
sys.path.insert(0, str(Path(__file__).parent / 'build_scripts'))

try:
    from ShockwaveParser import ShockwaveParser
except ImportError:
    print("ERROR: ShockwaveParser not found. Make sure it's in build_scripts/")
    sys.exit(1)


def is_dutch_text(text):
    """
    Simple heuristic to detect Dutch text.
    Looks for common Dutch words/patterns.
    """
    if not text or len(text) < 3:
        return False
    
    # Common Dutch words/patterns
    dutch_indicators = [
        r'\bhet\b', r'\bde\b', r'\been\b', r'\bvan\b', r'\bop\b',
        r'\bje\b', r'\bik\b', r'\bmaar\b', r'\bniet\b', r'\bdat\b',
        r'\bmet\b', r'\bals\b', r'\bzijn\b', r'\bwat\b', r'\bhoe\b',
        r'\bdeze\b', r'\bdie\b', r'\bdan\b', r'\bnog\b', r'\bwaar\b',
        r'\bmijn\b', r'\bjouw\b', r'\beer\b', r'\bnaar\b',
        # Game-specific
        r'\bklaar\b', r'\bmooi\b', r'\bgoed\b', r'\bprijzen\b',
        r'\bmedaille\b', r'\bopnieuw\b', r'\bstoppen\b',
    ]
    
    text_lower = text.lower()
    
    # Check for Dutch indicators
    for pattern in dutch_indicators:
        if re.search(pattern, text_lower):
            return True
    
    return False


def extract_strings_from_lingo(script_text):
    """
    Extract string literals from Lingo script code.
    Returns list of (string, line_number) tuples.
    """
    strings = []
    
    if not script_text:
        return strings
    
    # Match quoted strings (both single and double quotes)
    # Lingo supports "text" and 'text'
    patterns = [
        r'"([^"]*)"',  # Double quotes
        r"'([^']*)'",  # Single quotes
    ]
    
    lines = script_text.split('\n')
    for line_num, line in enumerate(lines, 1):
        for pattern in patterns:
            matches = re.finditer(pattern, line)
            for match in matches:
                string_content = match.group(1)
                if string_content and len(string_content) > 2:  # Ignore very short strings
                    strings.append((string_content, line_num))
    
    return strings


def extract_scripts_from_file(file_path):
    """
    Extract all SCRIPT cast members from a DXR/CXT file.
    Returns dict with script info.
    """
    print(f"\n{'='*60}")
    print(f"Processing: {file_path}")
    print('='*60)
    
    parser = ShockwaveParser(file_path)
    parser.read()
    
    scripts = {}
    dutch_findings = []
    
    # Get all cast members from all libraries
    if not hasattr(parser, 'castLibraries') or not parser.castLibraries:
        print("No cast libraries found")
        return scripts, dutch_findings
    
    script_count = 0
    
    # Import CastType enum
    from ShockwaveParser import CastType
    
    for library in parser.castLibraries:
        lib_name = library.get('name', 'Unknown')
        
        if 'members' not in library:
            continue
        
        for cast_id, member in library['members'].items():
            cast_type = member.get('castType', 0)
            
            # Check if it's a script type (SCRIPT = 11)
            if cast_type != CastType.SCRIPT.value:
                continue
            
            script_count += 1
            name = member.get('name', f'Script_{cast_id}')
            
            # Extract script using the parser's method
            script_text = None
            try:
                # Use getCastMember to get full data
                full_member = parser.getCastMember(lib_name, int(cast_id))
                if full_member and 'data' in full_member:
                    data = full_member['data']
                    if isinstance(data, bytes):
                        try:
                            script_text = data.decode('utf-8', errors='ignore')
                        except:
                            try:
                                script_text = data.decode('latin-1', errors='ignore')
                            except:
                                pass
                    elif isinstance(data, str):
                        script_text = data
            except Exception as e:
                print(f"    Warning: Could not extract script {cast_id}: {e}")
            
            if script_text:
                # Extract strings from script
                strings = extract_strings_from_lingo(script_text)
                dutch_strings = []
                
                for string_val, line_num in strings:
                    if is_dutch_text(string_val):
                        dutch_strings.append({
                            'text': string_val,
                            'line': line_num
                        })
                
                scripts[cast_id] = {
                    'name': name,
                    'cast_id': cast_id,
                    'size': len(script_text),
                    'all_strings': len(strings),
                    'dutch_strings': dutch_strings
                }
                
                if dutch_strings:
                    print(f"\n  ✓ Cast #{cast_id} '{name}' - Found {len(dutch_strings)} Dutch strings")
                    for ds in dutch_strings[:5]:  # Show first 5
                        print(f"    Line {ds['line']}: \"{ds['text']}\"")
                    if len(dutch_strings) > 5:
                        print(f"    ... and {len(dutch_strings) - 5} more")
                    
                    dutch_findings.append({
                        'file': os.path.basename(file_path),
                        'cast_id': cast_id,
                        'name': name,
                        'strings': dutch_strings
                    })
    
    print(f"\nFound {script_count} script cast members")
    print(f"Found Dutch text in {len(dutch_findings)} scripts")
    
    return scripts, dutch_findings


def main():
    project_root = Path.home() / 'projects' / 'mulle-meck-game'
    extracted_dir = project_root / 'extracted'
    output_dir = project_root / 'assets' / 'extracted_scripts'
    output_dir.mkdir(parents=True, exist_ok=True)
    
    # Find all DXR and CXT files
    files = sorted(extracted_dir.glob('*.DXR')) + sorted(extracted_dir.glob('*.CXT'))
    
    all_dutch_findings = []
    all_scripts_info = {}
    
    for file_path in files:
        scripts, dutch_findings = extract_scripts_from_file(str(file_path))
        
        file_key = file_path.stem
        all_scripts_info[file_key] = scripts
        all_dutch_findings.extend(dutch_findings)
        
        # Save individual script data
        if scripts:
            output_file = output_dir / f"{file_key}_scripts.json"
            with open(output_file, 'w', encoding='utf-8') as f:
                json.dump(scripts, f, indent=2, ensure_ascii=False)
            print(f"Saved script info to {output_file}")
    
    # Create summary report
    summary = {
        'total_files_processed': len(files),
        'total_scripts_found': sum(len(scripts) for scripts in all_scripts_info.values()),
        'total_dutch_findings': len(all_dutch_findings),
        'dutch_findings': all_dutch_findings
    }
    
    summary_file = project_root / 'dutch_strings_from_scripts.json'
    with open(summary_file, 'w', encoding='utf-8') as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    
    print(f"\n{'='*60}")
    print("SUMMARY")
    print('='*60)
    print(f"Files processed: {summary['total_files_processed']}")
    print(f"Scripts found: {summary['total_scripts_found']}")
    print(f"Scripts with Dutch text: {len(all_dutch_findings)}")
    print(f"\nSummary saved to: {summary_file}")
    
    # Group findings by file
    print("\n" + "="*60)
    print("DUTCH TEXT FINDINGS BY FILE")
    print("="*60)
    
    findings_by_file = {}
    for finding in all_dutch_findings:
        file_name = finding['file']
        if file_name not in findings_by_file:
            findings_by_file[file_name] = []
        findings_by_file[file_name].append(finding)
    
    for file_name in sorted(findings_by_file.keys()):
        findings = findings_by_file[file_name]
        print(f"\n{file_name}: {len(findings)} scripts with Dutch text")
        for f in findings:
            print(f"  Cast #{f['cast_id']} '{f['name']}': {len(f['strings'])} strings")


if __name__ == '__main__':
    main()
