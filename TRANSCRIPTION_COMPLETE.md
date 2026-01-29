# ✅ Mulle Meck Audio Transcriptie - VOLTOOID

**Datum:** 28 januari 2025  
**Status:** Alle 20 locaties succesvol getranscribeerd

---

## 🎯 Resultaten

### Statistieken

- **20/20 bestanden** succesvol getranscribeerd
- **~600+ dialoog segmenten** totaal
- **Kosten:** ~$2 via OpenAI Whisper API
- **Tijd:** ~10 minuten totaal (API-based)

### Output locatie

```
~/projects/mulle-meck-game/transcriptions/
```

### Bestanden per locatie (2x)

1. **Raw transcriptie**: `{location}-audio.json` (Whisper output)
2. **Gemapped subtitles**: `{location}-subtitles-nl.json` (sprite IDs + timestamps)

---

## 📊 Top 10 Dialoog-rijke Locaties

| Locatie | Segmenten | Beschrijving |
|---------|-----------|--------------|
| carparts | 210 | Auto-onderdelen uitleg |
| driving | 121 | Rijden/geluidseffecten |
| garage | 61 | Auto bouwen instructies |
| solhem | 45 | Meeuwen geluiden |
| yard | 31 | Schroothoop interacties |
| carshow | 27 | Autoshow dialogen |
| saftfabrik | 18 | Fruitsapfabriek |
| menu | 16 | Introductie/menu |
| shared | 16 | Gedeelde UI elementen |
| sturestortand | 13 | Winkel dialogen |

---

## ✅ Verificatie: Bekende Quotes Gevonden

| Quote | Locatie | Audio ID | Status |
|-------|---------|----------|--------|
| "Ziezo, de wielen zitten erop" | garage | 03d006v0 | ✅ |
| "Reken maar!" | carshow | - | ✅ |
| "Stafschroot" (naam) | garage | 03d042v0 | ✅ |
| "Nu is het gefixt en klaar!" | - | - | Varianten gevonden |
| Diverse "Amai!" uitroepen | Meerdere | - | ✅ |

---

## 🔧 Technische Details

### Transcriptie Methode

- **API:** OpenAI Whisper API (whisper-1 model)
- **Taal:** Nederlands (nl)
- **Format:** verbose_json met segment timestamps
- **Nauwkeurigheid:** Hoog (native Dutch model)

### Scripts Gebruikt

1. `transcribe_with_curl.sh` - Batch transcriptie via API
2. `process_transcriptions.py` - Mapping naar sprite IDs
3. `map_all_subtitles.sh` - Batch processing wrapper

---

## 📝 Format Voorbeeld

```json
{
  "audioId": "03d006v0",
  "spriteId": "209",
  "offset": -1.078,
  "duration": 5.16,
  "text": "Ziezo, de wielen zitten erop. Nu kunnen we de auto naar buiten duwen.",
  "timestamp": "18.600-23.760"
}
```

**Velden:**
- `audioId`: Director asset naam (03dXXXvY format)
- `spriteId`: ID in sprite map (voor audio playback)
- `offset`: Offset binnen sprite segment (sec)
- `duration`: Lengte audio fragment (sec)
- `text`: Nederlandse transcriptie
- `timestamp`: Absolute positie in audio file

---

## 🎮 Game Integratie

### Gebruik in Mulle Meck Remake

```javascript
// 1. Laad sprite map
const spriteMap = await loadJSON('garage-audio.json');

// 2. Laad subtitles
const subtitles = await loadJSON('garage-subtitles-nl.json');

// 3. Bij audio playback:
function playAudioWithSubtitles(spriteId) {
  const sprite = spriteMap.spritemap[spriteId];
  const subtitle = subtitles.find(s => s.spriteId === spriteId);
  
  if (subtitle) {
    setTimeout(() => {
      showSubtitle(subtitle.text);
    }, subtitle.offset * 1000);
    
    setTimeout(() => {
      hideSubtitle();
    }, (subtitle.offset + subtitle.duration) * 1000);
  }
  
  playSprite(sprite);
}
```

---

## 📁 File Overzicht

```
transcriptions/
├── README.md                          # Documentatie
├── garage-audio.json                  # Whisper raw output
├── garage-subtitles-nl.json          # Mapped subtitles
├── carparts-audio.json
├── carparts-subtitles-nl.json
├── junk-audio.json
├── junk-subtitles-nl.json
... (20 locaties × 2 bestanden = 40 files)
```

---

## 🎉 Conclusie

Alle Mulle Meck dialogen zijn succesvol getranscribeerd en gemapped naar sprite audio IDs.

**Volgende stappen:**
1. ✅ Integreer subtitles in game engine
2. ✅ Test playback synchronisatie
3. ✅ Voeg ondertiteling toggle toe (accessibility)
4. ✅ Overweeg extra talen (Engels, Zweeds)

---

**Scripts locatie:** `~/projects/mulle-meck-game/`  
**Output locatie:** `~/projects/mulle-meck-game/transcriptions/`
