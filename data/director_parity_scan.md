# Director Parity Scan

- Generated: 2026-03-24T22:31:26.488Z
- Requests scanned: 112
- Unresolved expressions: 0
- Missing visual candidates: 0
- Ambiguous name matches: 26
- Risky backgrounds: 4
- Layered visuals: 12
- Risky layered visuals: 3
- Audio literal refs: 155
- Missing audio literals: 0

## Visual Categories

- actor: 13
- background: 33
- foreground: 8
- overlay: 4
- sprite: 53
- ui: 1

## Risky Backgrounds

- `boatyard.js:603` `boten_04.DXR` member `1` -> `04b001v0`
  mode: exact; dims: 640x480, 172x90
  chosen: `boatyard-sprites-0` `1` 640x480
- `cave.js:87` `boten_86.DXR` member `25` -> `01`
  mode: exact; dims: 640x480, 144x146
  chosen: `seaworld-sprites-2` `25` 640x480
- `worldselect.js:25` `18.DXR` member `8` -> `18b001v0`
  mode: exact; dims: 422x300, 422x196, 422x146
  chosen: `worldselect-sprites-0` `8` 422x300
- `yard.js:41` `04.DXR` member `145` -> `04b001v0`
  mode: alias; dims: 640x480, 172x90
  chosen: `yard-sprites-0` `230` 640x480

## Risky Layered Visuals

- `boatyard.js:347` `this.foregroundOverlay` `boten_04.DXR` member `2` -> `04b002v0`
  category: foreground; mode: exact; dims: 640x172, 640x480
  chosen: `boatyard-sprites-0` `2` 640x172
- `garage.js:448` `this.popupMenu` `00.CXT` member `84` -> `09b001v0`
  category: overlay; mode: exact; dims: 426x300, 425x300
  chosen: `characters-sprites-0` `84` 426x300
- `whale.js:100` `this.waterOverlay` `boten_88.DXR` member `14` -> `88b002v0`
  category: foreground; mode: exact; dims: 534x130, 640x480
  chosen: `seaworld-sprites-2` `14` 534x130

## Unresolved Expressions

- none

## Missing Visual Candidates

- none

## Missing Audio Literals

- none
