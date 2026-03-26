import MulleState from './base'

// Lingo parity: BehaviorScript 3 / MovieScript 4 (12/12)
// Transition: go("01.dir") — returns to intro movie on credits end
const CREDITS_RETURN_TRANSITION = '01.dir'

class CreditsState extends MulleState {
  preload () {
    super.preload()
    // No specific assets needed - we'll draw text
  }

  create () {
    super.create()

    // Dark blue background (like night sky)
    this.game.stage.backgroundColor = '#1a3a5a'

    // Play a gentle background tune if available
    // this.game.mulle.playAudio('12e001v0') // If credits music exists

    // Create scrolling text container
    this.creditsY = this.game.height + 50

    // Credits content
    const creditsText = this.getCreditsText()

    // Create text object
    const style = {
      font: '20px Arial',
      fill: '#ffffff',
      align: 'center',
      wordWrap: true,
      wordWrapWidth: 500
    }

    this.creditsTextObj = this.game.add.text(
      this.game.width / 2,
      this.creditsY,
      creditsText,
      style
    )
    this.creditsTextObj.anchor.setTo(0.5, 0)

    // Add Miel sprite at bottom (watching the credits)
    this.mulle = this.game.add.sprite(100, this.game.height - 150, null)
    this.mulle.anchor.setTo(0.5, 1)
    // TODO: Use actual Miel sprite if available

    // Add Rifka/Buffa next to Miel
    this.buffa = this.game.add.sprite(200, this.game.height - 150, null)
    this.buffa.anchor.setTo(0.5, 1)
    // TODO: Use actual Buffa sprite if available

    // Scroll speed (pixels per frame)
    this.scrollSpeed = 0.5

    // Click/tap to speed up or skip
    this.game.input.onDown.add(this.speedUp, this)
    this.fastMode = false
  }

  getCreditsText () {
    return `MIEL MONTEUR BOUWT AUTO'S
    
Web Port 2025


═══════════════════════

ORIGINELE GAME
═══════════════════════

Originele Titel:
MULLE MECK BYGGER BILAR

Ontwikkelaar:
Levande Böcker
(Levende Boeken)

Jaar:
1997


═══════════════════════

CREATIEF TEAM
═══════════════════════

Verhaal & Concept:
George Johansson

Illustraties:
Jens Ahlbom

Nederlandse Stem Miel:
Kurt Van Eeghem


═══════════════════════

NEDERLANDSE VERSIE
═══════════════════════

Uitgever:
Transposia

Lokalisatie:
Nederlands (NL)
West-Vlaams dialect


═══════════════════════

WEB PORT 2025
═══════════════════════

Game Engine:
Phaser CE

Reverse Engineering:
Lingo → JavaScript port

Assets Extractie:
Director/Shockwave tools

Development:
Open source project


═══════════════════════

PERSONAGES
═══════════════════════

Miel Monteur (Mulle Meck)
Rifka (Buffa) - De boxer
Staf Schroot - Vriend
Laika - Staf's hond
Peggy PC - Computer expert
Mia - Kabouter
Salka - De hond op de weg
Boris Blaff - Avonturier
Viola - Accordeoniste
Sture Stortand - Tandarts
Doris Digital - Tech expert
Figge Ferrum - Uitvinder


═══════════════════════

LOCATIES
═══════════════════════

Blauwwater (Djupforsen)
De Garage
Het Schroothof
De Wereld
Het Strand
De Saftfabriek
Het Automuseum
En vele anderen...


═══════════════════════

DANK AAN
═══════════════════════

De originele ontwikkelaars
bij Levande Böcker

Alle fans die Miel Monteur
door de jaren heen
een warm hart toedragen

En natuurlijk...
Kurt Van Eeghem
voor zijn onvergetelijke stem


═══════════════════════


"Er is geen schroot.
Alles is gewoon oude dingen
die op nieuwe manieren
gebruikt kunnen worden."

- Miel Monteur


═══════════════════════


Bedankt voor het spelen!


═══════════════════════


Amai, dat was het!
Reken maar!


🔧🚗⚙️


═══════════════════════


Klik om terug te gaan
naar het hoofdmenu


`
  }

  update () {
    // Scroll the credits upward
    if (this.fastMode) {
      this.creditsY -= this.scrollSpeed * 5
    } else {
      this.creditsY -= this.scrollSpeed
    }

    this.creditsTextObj.y = this.creditsY

    // When credits are done scrolling, wait a bit then return to menu
    if (this.creditsY < -this.creditsTextObj.height - 200) {
      this.game.time.events.add(2000, () => {
        this.returnToMenu()
      })
    }
  }

  speedUp () {
    if (this.fastMode) {
      // Second click = skip entirely
      this.returnToMenu()
    } else {
      // First click = speed up 5x
      this.fastMode = true
    }
  }

  returnToMenu () {
    // this.game.mulle.stopAudio('12e001v0')
    this.game.state.start('menu')
  }

  shutdown () {
    super.shutdown()
  }
}

export default CreditsState
