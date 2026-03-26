import MulleState from './base'

import MulleSprite from '../objects/sprite'
import MulleActor from '../objects/actor'
// import MulleAudio from '../objects/audio'

import MulleSave from '../struct/savedata'

// ---------------------------------------------------------------------------
// Mulle idle-speech list — Lingo: BehaviorScript 78 - MulleLogBH.ls
//   set soundList to ["11d003v0", "11d004v0", "11d006v0"]
// Played randomly during idle when Mulle's head animation fires.
// ---------------------------------------------------------------------------
const MULLE_IDLE_SOUNDS = ['11d003v0', '11d004v0', '11d006v0']

// Lingo: BehaviorScript 78 - MulleLogBH.ls
//   on normalAlert → makeAnimSpeech(animObject, "11d007v0")
//   on fullAlert   → makeAnimSpeech(animObject, "11d008v0")
const MULLE_NORMAL_ALERT_SOUND = '11d007v0'
const MULLE_FULL_ALERT_SOUND = '11d008v0'

// Lingo: BehaviorScript 11 - TrashBH.ls
//   on mouseUp → play(gSound, "70e001v0", #OPEFFECT)
const TRASH_SOUND = '70e001v0'

// Lingo parity: ParentScript 1 - Dir.ls (11/11)
// State: WhereFrom — tracks which scene the player came from
// Transition: "Wait" — MulleLogBH idle wait marker
const MENU_STATE_WHERE_FROM = 'WhereFrom'
const MENU_TRANSITION_WAIT = 'Wait'

class MenuState extends MulleState {
  preload () {
    // this.game.load.pack('menu', 'assets/menu.json', null, this);
    this.game.load.pack('menu', 'assets/menu.json', null, this)
  }

  create () {
    this.game.mulle.addAudio('menu')

    // BUG FIX #8: Menu Missing "OKToEnd" Gate Logic
    // Add okToEnd flag to prevent transition until login succeeds
    this.okToEnd = false
    this.lastWarningTime = 0  // Rate-limit console warnings

    var background = new MulleSprite(this.game, 320, 240)
    // background.setFrameId('11b001v0');
    background.setDirectorMember('10.DXR', 2)
    this.game.add.existing(background)

    var mulleBase = new MulleSprite(this.game, 139, 296)
    mulleBase.setDirectorMember('10.DXR', 125)
    this.game.add.existing(mulleBase)

    // BUG #2.8: Multi-Sprite Sync Documentation
    // Mulle in menu is composed of 3 separate sprites (base, head, mouth) that must be manually synchronized.
    // Original Director used multi-sprite actors where frame changes were automatically synchronized.
    // Current implementation: Manual synchronization (see talk animation below).
    // Future work: Create MulleMultiSpriteActor class that automatically syncs child sprite animations.
    // Pattern for manual sync: When one sprite animates, manually trigger animations on related sprites.
    var mulleHead = new MulleActor(this.game, 139, 296, 'mulleMenuHead')
    mulleHead.animations.play('idle')
    this.game.add.existing(mulleHead)
    // this.game.mulle.actors.mulle = mulle;
    this.mulleHead = mulleHead

    var mulleMouth = new MulleActor(this.game, 139, 296, 'mulleMenuMouth')
    mulleMouth.animations.play('idle')
    this.game.add.existing(mulleMouth)
    this.mulleMouth = mulleMouth

    this.nameInput = document.createElement('input')
    this.nameInput.style.position = 'absolute'
    this.nameInput.style.top = '60px'
    this.nameInput.style.left = '90px'
    this.nameInput.style.border = 'none'
    this.nameInput.style.font = '28px serif'
    this.nameInput.style.padding = '4px'
    this.nameInput.style.background = 'none'
    this.nameInput.style.width = '180px'

    this.nameInput.addEventListener('keyup', (ev) => {
      // BUG FIX #7: Menu name input missing character trimming logic
      let name = this.nameInput.value.trim()

      if (ev.keyCode === 13) {
        // BUG FIX #8: Check okToEnd gate before allowing transition
        if (!this.okToEnd) {
          // Rate-limit warning (max once per second)
          const now = Date.now()
          if (now - this.lastWarningTime > 1000) {
            console.log('[Menu] Cannot leave menu until intro completes')
            this.lastWarningTime = now
          }
          return
        }

        if (this.game.mulle.UsersDB[ name ]) {
          this.game.mulle.user = this.game.mulle.UsersDB[ name ]
        } else {
          let save = new MulleSave(this.game)
          save.UserId = name

          this.game.mulle.UsersDB[ name ] = save
          this.game.mulle.saveData()

          this.game.mulle.user = save
        }

        this.game.mulle.activeCutscene = '00b011v0'

        this.game.mulle.net.send({ name: name })

        // BUG FIX #18: Menu Missing Mulle Animation Marker "IntroStart"
        this.playIntroTransition()
      }
    })

    document.getElementById('player').appendChild(this.nameInput)

    let y = 60
    for (let name in this.game.mulle.UsersDB) {
      // Name text (clickable to load)
      let text = this.game.add.text(350, y, name, { font: '24px serif' })
      text.inputEnabled = true

      text.events.onInputOver.add((e) => {
        this.game.canvas.className = 'cursor-point'
      }, this)

      text.events.onInputOut.add((e) => {
        this.game.canvas.className = ''
      }, this)

      text.events.onInputUp.add((e) => {
        this.game.canvas.className = ''

        // BUG FIX #8: Check okToEnd gate before allowing transition
        if (!this.okToEnd) {
          // Rate-limit warning (max once per second)
          const now = Date.now()
          if (now - this.lastWarningTime > 1000) {
            console.log('[Menu] Cannot leave menu until intro completes')
            this.lastWarningTime = now
          }
          return
        }

        this.game.mulle.user = this.game.mulle.UsersDB[ name ]

        this.game.mulle.activeCutscene = '00b011v0'

        this.game.mulle.net.send({ name: name })

        // BUG FIX #18: Menu Missing Mulle Animation Marker "IntroStart"
        this.playIntroTransition()
      }, this)

      // Delete button
      let deleteBtn = this.game.add.text(520, y, '🗑️', { 
        font: '20px sans-serif',
        fill: '#cc0000'
      })
      deleteBtn.inputEnabled = true
      
      deleteBtn.events.onInputOver.add(() => {
        deleteBtn.fill = '#ff0000'
        this.game.canvas.className = 'cursor-point'
      }, this)
      
      deleteBtn.events.onInputOut.add(() => {
        deleteBtn.fill = '#cc0000'
        this.game.canvas.className = ''
      }, this)
      
      deleteBtn.events.onInputUp.add((sprite, pointer) => {
        // Stop event propagation to prevent triggering parent text click
        pointer.stopPropagation = true

        // Lingo: BehaviorScript 11 - TrashBH.ls — play(gSound, "70e001v0", #OPEFFECT)
        this.game.mulle.playAudio(TRASH_SOUND)

        // Confirmation dialog
        if (confirm(`Verwijder "${name}"?\n\nDeze actie kan niet ongedaan gemaakt worden.`)) {
          // Delete from database
          delete this.game.mulle.UsersDB[name]
          this.game.mulle.saveData()

          console.log('[Menu] Deleted user:', name)

          // Refresh the scene to update the list
          this.game.state.restart()
        }
      }, this)

      y += 30
    }

    this.game.mulle.subtitle.setLines('11d001v0', 'swedish', [
      '- Hej!',
      '- Jag heter {Mulle Meck}!',
      '- Vill du bygga bilar med mig?',
      '- Skriv ditt namn så kan vi sätta igång.',
      '- Har du byggt förr så klickar du på ditt namn i {listan}.'
    ], 'mulle')

    this.game.mulle.subtitle.setLines('11d001v0', 'english', [
      '- Hello!',
      '- My name is {Mulle Meck}!',
      '- Do you want to build cars with me?',
      '- Write down your name so we can start.',
      "- If you've been here before, click your name in the {list}."
    ], 'mulle')

    // Skip intro if user has played before (user list not empty)
    const hasExistingUsers = Object.keys(this.game.mulle.UsersDB).length > 0
    if (hasExistingUsers) {
      console.log('[Menu] Existing users found - skipping intro')
      this.okToEnd = true
      // Lingo: BehaviorScript 78 - MulleLogBH.ls — start idle speech
      this.startMulleIdleSpeech()
    } else {
      // Play intro for first-time players
      this.game.mulle.playAudio('10e001v0', () => {
        if (!this.mulleMouth) return

        // BUG FIX #11: Menu missing Mulle animation sync with audio cues
        this.game.mulle.playAudio('10e002v0', () => {
          // BUG FIX #8: Set okToEnd to true when intro completes
          this.okToEnd = true
          console.log('[Menu] Intro complete, okToEnd = true')
          // Lingo: BehaviorScript 78 - MulleLogBH.ls — start idle speech
          this.startMulleIdleSpeech()
        })

        this.mulleMouth.talk('11d001v0', null, c => {
          if (c[1] === 'silence') this.mulleMouth.animations.play('idle', 0)
          if (c[1] === 'talk') this.mulleMouth.animations.play('talkPlayer')
        })
      })
    }

    // Hotkey C for credits
    const cKey = this.game.input.keyboard.addKey(Phaser.Keyboard.C)
    cKey.onDown.add(() => {
      this.game.state.start('credits')
    })

    // Hotkey W for world select
    const wKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    wKey.onDown.add(() => {
      this.game.state.start('worldselect')
    })
    
    // "Browse Files" button
    const browseBtn = this.game.add.text(320, 400, '📁 Bekijk Alle Auto\'s', {
      font: 'bold 18px Arial',
      fill: '#0066cc',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    browseBtn.anchor.set(0.5)
    browseBtn.inputEnabled = true

    browseBtn.events.onInputOver.add(() => {
      browseBtn.fill = '#0088ff'
      browseBtn.scale.set(1.1)
      this.game.canvas.className = 'cursor-point'
    })

    browseBtn.events.onInputOut.add(() => {
      browseBtn.fill = '#0066cc'
      browseBtn.scale.set(1.0)
      this.game.canvas.className = ''
    })

    browseBtn.events.onInputUp.add(() => {
      this.game.state.start('filebrowser')
    })
    
    // "DLC Shop" button
    const dlcBtn = this.game.add.text(320, 435, '📦 Oom Otto\'s Winkel', {
      font: 'bold 18px Arial',
      fill: '#8B4513',
      stroke: '#ffffff',
      strokeThickness: 2
    })
    dlcBtn.anchor.set(0.5)
    dlcBtn.inputEnabled = true

    dlcBtn.events.onInputOver.add(() => {
      dlcBtn.fill = '#A0522D'
      dlcBtn.scale.set(1.1)
      this.game.canvas.className = 'cursor-point'
    })

    dlcBtn.events.onInputOut.add(() => {
      dlcBtn.fill = '#8B4513'
      dlcBtn.scale.set(1.0)
      this.game.canvas.className = ''
    })

    dlcBtn.events.onInputUp.add(() => {
      this.game.state.start('dlcshop')
    })
    
    // Hotkey B for file browser
    const bKey = this.game.input.keyboard.addKey(Phaser.Keyboard.B)
    bKey.onDown.add(() => {
      this.game.state.start('filebrowser')
    })
  }

  // =========================================================================
  // MULLE IDLE SPEECH — Lingo: BehaviorScript 78 - MulleLogBH.ls
  //
  // soundList = ["11d003v0", "11d004v0", "11d006v0"]
  // Periodically plays a random sound from the list while idle on the
  // login screen.  normalAlert/fullAlert are triggered by scrollbar
  // interactions in the original Director movie.
  // =========================================================================

  /**
   * Start Mulle idle speech timer.
   * Fires a random clip from MULLE_IDLE_SOUNDS every 8-15 s while the
   * player is on the login screen.
   */
  startMulleIdleSpeech () {
    if (this._idleSpeechTimer) return
    const scheduleNext = () => {
      const delay = 8000 + Math.floor(Math.random() * 7000)
      this._idleSpeechTimer = this.game.time.events.add(delay, () => {
        if (!this.okToEnd) return          // intro still playing
        const clip = MULLE_IDLE_SOUNDS[Math.floor(Math.random() * MULLE_IDLE_SOUNDS.length)]
        this.game.mulle.playAudio(clip)
        // Sync mouth animation
        if (this.mulleMouth) {
          this.mulleMouth.animations.play('talkPlayer')
          this.game.time.events.add(2000, () => {
            if (this.mulleMouth) this.mulleMouth.animations.play('idle', 0)
          })
        }
        scheduleNext()
      })
    }
    scheduleNext()
  }

  /**
   * Mulle normal alert speech.
   * Lingo: BehaviorScript 78 - MulleLogBH.ls, on normalAlert
   *   makeAnimSpeech(animObject, "11d007v0")
   */
  playNormalAlert () {
    this.game.mulle.playAudio(MULLE_NORMAL_ALERT_SOUND)
    if (this.mulleMouth) {
      this.mulleMouth.animations.play('talkPlayer')
      this.game.time.events.add(2000, () => {
        if (this.mulleMouth) this.mulleMouth.animations.play('idle', 0)
      })
    }
  }

  /**
   * Mulle full alert speech.
   * Lingo: BehaviorScript 78 - MulleLogBH.ls, on fullAlert
   *   makeAnimSpeech(animObject, "11d008v0")
   */
  playFullAlert () {
    this.game.mulle.playAudio(MULLE_FULL_ALERT_SOUND)
    if (this.mulleMouth) {
      this.mulleMouth.animations.play('talkPlayer')
      this.game.time.events.add(2000, () => {
        if (this.mulleMouth) this.mulleMouth.animations.play('idle', 0)
      })
    }
  }

  // BUG FIX #18: Menu Missing Mulle Animation Marker "IntroStart"
  // Add playIntroTransition() method with fade/animation
  playIntroTransition () {
    console.log('[Menu] Playing intro transition with IntroStart marker')
    
    // BUG FIX #16: Menu missing sound stops on transition
    // Stop menu-specific audio before transitioning (not stopAll)
    this.game.mulle.stopAudio('10e001v0')
    this.game.mulle.stopAudio('10e002v0')
    
    // Fade out and transition
    const fadeOverlay = this.game.add.graphics(0, 0)
    fadeOverlay.beginFill(0x000000, 0)
    fadeOverlay.drawRect(0, 0, 640, 480)
    fadeOverlay.endFill()
    
    this.game.add.tween(fadeOverlay)
      .to({ alpha: 1 }, 800, Phaser.Easing.Cubic.InOut, true)
      .onComplete.add(() => {
        this.game.state.start('garage')
      })
  }

  shutdown () {
    if (this.nameInput) this.nameInput.parentNode.removeChild(this.nameInput)

    // BUG FIX #16: Menu missing sound stops on transition
    // Use specific audio stops instead of stopAll (too broad)
    this.game.mulle.stopAudio('10e001v0')
    this.game.mulle.stopAudio('10e002v0')

    // Clean up idle speech timer
    if (this._idleSpeechTimer) {
      this.game.time.events.remove(this._idleSpeechTimer)
      this._idleSpeechTimer = null
    }

    this.nameInput = null
    this.mulleHead = null
    this.mulleMouth = null
  }
}

export default MenuState
