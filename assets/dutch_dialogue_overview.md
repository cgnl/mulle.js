# Nederlandse tekst in Mulle Meck (DXR/CXT)

_Gegenereerd: 2026-01-28_

## Samenvatting
- Alle DXR/CXT bestanden gescand op **SCRIPT** cast members (met `ShockwaveParser.read()` + cast library member table).
- In deze codebase lijkt **SCRIPT cast data zelf geen extracteerbare Lingo-tekst** te bevatten via `linkedEntries` (die zijn leeg), en de `extractCastMember()` tool print alleen `SCRIPT` zonder tekst-output.
- Heuristische scan op Nederlandse string-literals in scripts leverde **0** resultaten op.

## Wat wél gevonden is (FIELD/TEXT extracties)
### 08.DXR
- `assets/dxr_fields/08/08t006v0.txt`
  - **"Lichtste auto medaille"**

## Opmerking / volgende stap (belangrijk)
De huidige `ShockwaveParser.py` implementeert extractie voor **FIELD/TEXT** (STXT/RTE0) maar **niet** voor daadwerkelijke **Lingo script resources** (meestal `Lscr`/`Lctx` in Director). Daardoor vinden we in scripts geen string-literals.

Om alsnog dialoogteksten te vinden, zijn waarschijnlijk nodig:
1) Uitbreiden van de parser om `Lscr`/`Lctx` resources te dumpen en de string pool te lezen, of
2) Op byte-level zoeken naar ISO-8859-1 strings in DXR/CXT buiten de huidige FIELD/TEXT extraction.

## Output bestanden
- `dutch_strings_from_scripts.json` (summary, momenteel leeg: geen script-strings gevonden)
- `assets/extracted_scripts/*_scripts.json` (per bestand: script metadata; geen strings)
