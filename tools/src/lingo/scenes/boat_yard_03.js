'use strict'

export default {
  dirFile: 'boten_03.DXR',
  mouseObjects: [
    {
      id: 301,
      rect: [29, 0, 124, 300],
      cursor: { rollOver: 'GoLeft', dragRollover: 'DropLeft' },
      click: { frame: 'Quay' },
      dragToWhere: 'Quay'
    },
    {
      id: 302,
      rect: [131, 43, 206, 307],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Shelf1' },
      dragToWhere: 'Shelf1'
    },
    {
      id: 303,
      rect: [207, 40, 288, 314],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Shelf2' },
      dragToWhere: 'Shelf2'
    },
    {
      id: 304,
      rect: [289, 34, 380, 322],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Shelf3' },
      dragToWhere: 'Shelf3'
    },
    {
      id: 305,
      rect: [381, 31, 479, 329],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Shelf4' },
      dragToWhere: 'Shelf4'
    },
    {
      id: 306,
      rect: [480, 28, 579, 335],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Shelf5' },
      dragToWhere: 'Shelf5'
    },
    {
      id: 307,
      rect: [580, 25, 640, 343],
      cursor: { rollOver: 'GoForward', dragRollover: 'DropForward' },
      click: { frame: 'Shelf6' },
      dragToWhere: 'Shelf6'
    },
    {
      id: 308,
      rect: [262, 383, 379, 478],
      cursor: { rollOver: 'Clickable' },
      dragToWhere: 'Gift',
      report: 1,
      activeWhen: (scene) => !!scene.gotGifts
    }
  ]
}
