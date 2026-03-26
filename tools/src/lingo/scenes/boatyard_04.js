'use strict'

export default {
  dirFile: 'boten_04.DXR',
  mouseObjects: [
    {
      id: 0,
      rect: [0, 0, 508, 155],
      cursor: { rollOver: 'GoForward' },
      dragToWhere: 'world',
      report: 1
    },
    {
      id: 301,
      rect: [602, 97, 1640, 302],
      cursor: { rollOver: 'GoRight', dragRollover: 'DropRight' },
      click: { frame: 'Yard' },
      dragToWhere: 'Yard'
    },
    {
      id: 200,
      rect: [4, 322, 56, 433],
      cursor: { rollOver: 'GoLeft' },
      click: { frame: 'Shipyard' }
    },
    {
      id: 201,
      rect: [477, 331, 509, 379],
      cursor: { rollOver: 'GoForward' },
      enter: { pic: '04b005v0', sound: '04e005v0', sprite: 'Pole' },
      leave: { pic: 'Dummy', sprite: 'Pole' },
      dragToWhere: 'world',
      report: 1
    },
    {
      id: 202,
      rect: [554, 115, 592, 157],
      cursor: { rollOver: 'Clickable' },
      click: { frame: 'PhotoBook' },
      enter: { pic: '04b006v0', sound: '04e1000v0', sprite: 'PhotoBook' },
      leave: { pic: 'Dummy', sprite: 'PhotoBook' },
      wait: { times: 12 },
      dragToWhere: 'PhotoBook',
      report: 1
    },
    {
      id: 203,
      rect: [550, 184, 587, 230],
      cursor: { rollOver: 'Clickable' },
      click: { frame: 'Camera' },
      enter: { pic: '04b007v0', sound: 'RollOver', sprite: 'Camera' },
      leave: { pic: 'Dummy', sprite: 'Camera' },
      wait: { times: 12 },
      dragToWhere: 'Camera',
      report: 1
    },
    {
      id: 204,
      rect: [479, 18, 536, 70],
      cursor: { rollOver: 'Clickable' },
      dragToWhere: 'Windmeter',
      report: 1
    },
    {
      id: 205,
      rect: [93, 336, 180, 374],
      cursor: { rollOver: 'Clickable' },
      click: { frame: 'Blueprint' },
      enter: { sound: '01e003v0' }
    }
  ]
}
