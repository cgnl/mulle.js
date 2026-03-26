'use strict'

export default {
  dirFile: 'boten_02.DXR',
  mouseObjects: [
    {
      id: 303,
      rect: [111, 24, 137, 94],
      cursor: { rollOver: 'Standard' }
    },
    {
      id: 305,
      rect: [111, 24, 137, 50],
      cursor: { rollOver: 'Clickable' },
      click: { sound: '02e003v0' },
      dragToWhere: 'UpShelf',
      report: 1,
      activeWhen: (scene) => scene.currentShelf >= 1 && scene.currentShelf <= 5
    },
    {
      id: 304,
      rect: [111, 67, 137, 94],
      cursor: { rollOver: 'Clickable' },
      click: { sound: '02e003v0' },
      dragToWhere: 'DownShelf',
      report: 1,
      activeWhen: (scene) => scene.currentShelf >= 2 && scene.currentShelf <= 6
    },
    {
      id: 301,
      rect: [48, 0, 137, 287],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Quay' },
      dragToWhere: 'Quay'
    },
    {
      id: 302,
      rect: [0, 313, 137, 480],
      cursor: { rollOver: 'GoLeft', dragRollover: 'DropLeft' },
      click: { frame: 'Yard' },
      dragToWhere: 'Yard'
    }
  ]
}
