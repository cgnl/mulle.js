/**
 * SelectorMaster.test.js - TDD tests based on original Lingo SelectorMaster.ls (ParentScript 171)
 *
 * Manages boat type selection buttons (Motor, Sail, Oar).
 *
 * Original Lingo properties:
 * - buttons: list of TypeSelectButton objects
 */
'use strict'

import SelectorMaster from '../SelectorMaster'
import TypeSelectButton from '../TypeSelectButton'

describe('SelectorMaster', () => {
  let selector

  describe('constructor (new me, argOKTypes)', () => {
    test('should initialize empty buttons list with no types', () => {
      selector = new SelectorMaster([])

      expect(selector.buttons).toEqual([])
    })

    test('should create buttons for each type', () => {
      selector = new SelectorMaster(['Motor', 'Sail', 'Oar'])

      expect(selector.buttons.length).toBe(3)
    })

    test('should create TypeSelectButton instances', () => {
      selector = new SelectorMaster(['Motor'])

      expect(selector.buttons[0]).toBeInstanceOf(TypeSelectButton)
    })

    test('should assign correct types to buttons', () => {
      selector = new SelectorMaster(['Motor', 'Sail'])

      expect(selector.buttons[0].type).toBe('Motor')
      expect(selector.buttons[1].type).toBe('Sail')
    })

    test('should assign rollover sounds', () => {
      // Original: set tmpRollSounds to [#Motor: "05d130v0", #Sail: "05d131v0", #Oar: "05d129v0"]
      selector = new SelectorMaster(['Motor', 'Sail', 'Oar'])

      expect(selector.buttons[0].sound).toBe('05d130v0')
      expect(selector.buttons[1].sound).toBe('05d131v0')
      expect(selector.buttons[2].sound).toBe('05d129v0')
    })

    test('should assign sequential sprite channels', () => {
      selector = new SelectorMaster(['Motor', 'Sail', 'Oar'], 100)

      expect(selector.buttons[0].SP).toBe(100)
      expect(selector.buttons[1].SP).toBe(101)
      expect(selector.buttons[2].SP).toBe(102)
    })
  })

  describe('kill (on kill me)', () => {
    test('should kill all buttons', () => {
      selector = new SelectorMaster(['Motor', 'Sail'])
      const killSpies = selector.buttons.map(btn => jest.spyOn(btn, 'kill'))

      selector.kill()

      killSpies.forEach(spy => {
        expect(spy).toHaveBeenCalled()
      })
    })

    test('should clear buttons list', () => {
      selector = new SelectorMaster(['Motor'])

      selector.kill()

      expect(selector.buttons).toBeNull()
    })

    test('should return null', () => {
      selector = new SelectorMaster(['Motor'])

      expect(selector.kill()).toBeNull()
    })
  })

  describe('clickedOne (on clickedOne me, argObj)', () => {
    beforeEach(() => {
      selector = new SelectorMaster(['Motor', 'Sail', 'Oar'])
    })

    test('should select clicked button by object', () => {
      const button = selector.buttons[1]

      selector.clickedOne(button)

      expect(button.selected).toBe(true)
    })

    test('should select button by type symbol', () => {
      // Original: if symbolp(argObj) then find matching button
      selector.clickedOne('Sail')

      expect(selector.buttons[1].selected).toBe(true)
    })

    test('should deselect all other buttons', () => {
      selector.buttons[0].selected = true
      selector.buttons[2].selected = true

      selector.clickedOne('Sail')

      expect(selector.buttons[0].selected).toBe(false)
      expect(selector.buttons[1].selected).toBe(true)
      expect(selector.buttons[2].selected).toBe(false)
    })
  })

  describe('activate (on activate me, argYesNo)', () => {
    beforeEach(() => {
      selector = new SelectorMaster(['Motor', 'Sail', 'Oar'])
    })

    test('should activate all buttons', () => {
      selector.buttons.forEach(btn => btn.active = false)

      selector.activate(true)

      selector.buttons.forEach(btn => {
        expect(btn.active).toBe(true)
      })
    })

    test('should deactivate all buttons', () => {
      selector.activate(false)

      selector.buttons.forEach(btn => {
        expect(btn.active).toBe(false)
      })
    })
  })
})

describe('TypeSelectButton', () => {
  let button

  describe('constructor (new me)', () => {
    test('should store type', () => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')

      expect(button.type).toBe('Motor')
    })

    test('should store sprite channel', () => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')

      expect(button.SP).toBe(50)
    })

    test('should store sound', () => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')

      expect(button.sound).toBe('05d130v0')
    })

    test('should start not selected', () => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')

      expect(button.selected).toBe(false)
    })

    test('should start active', () => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')

      expect(button.active).toBe(true)
    })

    test('should store report object', () => {
      const reportObj = { clickedOne: jest.fn() }
      button = new TypeSelectButton(reportObj, 50, 'Motor', '05d130v0')

      expect(button.reportObject).toBe(reportObj)
    })
  })

  describe('select (on select me)', () => {
    beforeEach(() => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')
    })

    test('should set selected to true when active', () => {
      button.select()

      expect(button.selected).toBe(true)
    })

    test('should not select when inactive', () => {
      button.active = false

      button.select()

      expect(button.selected).toBe(false)
    })

    test('should return frame index for selected state', () => {
      const frame = button.select()

      // Original: set the member of sprite SP to member firstFrame
      expect(frame).toBe(0) // firstFrame offset
    })
  })

  describe('deselect (on deselect me)', () => {
    beforeEach(() => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')
      button.selected = true
    })

    test('should set selected to false when active', () => {
      button.deselect()

      expect(button.selected).toBe(false)
    })

    test('should not deselect when inactive', () => {
      button.active = false

      button.deselect()

      expect(button.selected).toBe(true)
    })

    test('should return frame index for deselected state', () => {
      const frame = button.deselect()

      // Original: set the member of sprite SP to member (firstFrame + 1)
      expect(frame).toBe(1) // firstFrame + 1 offset
    })
  })

  describe('activate (on activate me, argYesNo)', () => {
    beforeEach(() => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')
    })

    test('should set active to true', () => {
      button.active = false

      button.activate(true)

      expect(button.active).toBe(true)
    })

    test('should set active to false', () => {
      button.activate(false)

      expect(button.active).toBe(false)
    })
  })

  describe('mouse (on mouse me, argObj, argWhat)', () => {
    let reportObj

    beforeEach(() => {
      reportObj = { clickedOne: jest.fn() }
      button = new TypeSelectButton(reportObj, 50, 'Motor', '05d130v0')
    })

    test('should return hover frame on enter when not selected', () => {
      const result = button.mouse(null, 'enter')

      // Original: set the member of sprite SP to member (firstFrame + 2)
      expect(result.frame).toBe(2)
    })

    test('should not change frame on enter when selected', () => {
      button.selected = true

      const result = button.mouse(null, 'enter')

      expect(result).toBeNull()
    })

    test('should return normal frame on leave when not selected', () => {
      const result = button.mouse(null, 'Leave')

      // Original: set the member of sprite SP to member (firstFrame + 1)
      expect(result.frame).toBe(1)
    })

    test('should not change frame on leave when selected', () => {
      button.selected = true

      const result = button.mouse(null, 'Leave')

      expect(result).toBeNull()
    })

    test('should do nothing when inactive', () => {
      button.active = false

      const result = button.mouse(null, 'enter')

      expect(result).toBeNull()
    })

    test('should report click event', () => {
      const result = button.mouse(null, 'click')

      expect(result.action).toBe('click')
      expect(result.type).toBe('Motor')
    })
  })

  describe('kill (on kill me)', () => {
    test('should return null', () => {
      button = new TypeSelectButton(null, 50, 'Motor', '05d130v0')

      expect(button.kill()).toBeNull()
    })
  })
})
