# Mulle Meck Audio Transcripties

## Samenvatting

Alle audio dialogen uit Mulle Meck zijn getranscribeerd met OpenAI Whisper API (Nederlands).

### Statistieken

- **20 locaties** volledig getranscribeerd
- **Totaal aantal dialoog-segmenten**: ~600+
- **Kwaliteit**: Hoge nauwkeurigheid, native Dutch transcriptie

### Bestanden

Voor elke locatie zijn er 2 bestanden:

1. **`{location}-audio.json`** - Ruwe Whisper transcriptie met timestamps
2. **`{location}-subtitles-nl.json`** - Gemapped naar sprite audio IDs

### Format

Subtitle bestanden bevatten:

```json
{
  "audioId": "03d047v0",
  "spriteId": "246",
  "offset": 0.928,
  "duration": 1.977,
  "text": "Amai!",
  "timestamp": "244.846-246.823"
}
```

- **audioId**: Director asset naam (voor referentie)
- **spriteId**: ID in de sprite map (voor playback)
- **offset**: Offset binnen het sprite segment (sec)
- **duration**: Lengte van het fragment (sec)
- **text**: Nederlandse transcriptie
- **timestamp**: Absolute tijd in het audio bestand

### Bekende quotes (verificatie)

✅ **Gevonden:**
- "Ziezo, de wielen zitten erop" (garage)
- "Reken maar!" (carshow, figgeferrum)
- Veel "Amai!" varianten in diverse bestanden

### Gebruik

Voor game integratie:
1. Laad de sprite map (`{location}-audio.json` uit assets)
2. Laad subtitles (`{location}-subtitles-nl.json`)
3. Match op spriteId tijdens playback
4. Toon text op basis van offset + duration

### Transcriptie methode

- **Tool**: OpenAI Whisper API (whisper-1 model)
- **Taal**: Nederlands (nl)
- **Format**: verbose_json met segment timestamps
- **Kosten**: ~$0.006/minuut (~$2 totaal voor alle bestanden)

### Top 5 grootste dialoog-sets

1. **carparts** - 210 segmenten (onderdelen uitleg)
2. **driving** - 121 segmenten (rijden/geluidseffecten)
3. **garage** - 61 segmenten (auto bouwen)
4. **solhem** - 45 segmenten (meeuwen roepen)
5. **yard** - 31 segmenten (schroothoop)

---

Gegenereerd: 28 januari 2025
