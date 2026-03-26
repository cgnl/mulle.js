/**
 * Tests for BoatEnergy module
 *
 * Maps to original Lingo behavior from:
 * - BoatBase.ls: calculateFuel (~line 162), fillErUp (~line 178), OutOfFuel (~line 193)
 * - BoatBase.ls: loop() hunger system (~line 568-588), seasickness (~line 555-566)
 * - BoatBase.ls: save() (~line 250-262) - pills/belly conversion
 * - MotorBoatAncestor.ls: loop() fuel consumption formula
 *
 * KEY DIFFERENCES from .ls:
 * - JS uses fuelCurrent/fuelMax (separate tracking) vs .ls using single 'fuel' integer
 * - JS adds stamina system for oar boats (not in .ls - JS extension)
 * - JS uses PropulsionType enum vs .ls possibleTypes list
 *
 * .ls FORMULAS:
 * - Initial fuel: 4500 * FuelVolume (calculateFuel when fuel is void or #Full)
 * - Max fuel (load): 4000 * FuelVolume (calculateFuel when fuel has value)
 * - Consumption: abs(motorSpeed) * fuelConsumption / 30
 * - Hunger speed: mulleHungerSpeed = 3 at level 1, 2 at other levels
 * - Pills save: (buffaSick - 1000) / 25
 * - Belly save: mulleHunger / 10
 * - Seasickness: only level >= 4, decrement = swayDiff / 13
 */
import {
  consumeEnergy,
  handleOutOfFuel,
  handleHunger,
  handleVomit,
  fallbackPropulsion,
  updateMaxSpeedForPropulsion,
  refuel,
  getFuelPercentage,
  consumeBelly,
  getBellyCount,
  hasBelly,
  canMove,
  saveInventoryState,
  trackDrivenTimes,
  getEffectiveMaxSpeed,
  // Stamina functions are JS extensions (not in .ls)
  recoverStamina,
  getStaminaPercentage,
  handleOutOfStamina
} from '../BoatEnergy'
import { PropulsionType } from '../BoatConstants'

describe('BoatEnergy', () => {
  let mockBoat

  beforeEach(() => {
    mockBoat = {
      speed: 5,
      motorSpeed: 5, // Throttle position (0-100), used for fuel consumption
      currentPropulsion: PropulsionType.MOTOR,
      // JS tracks fuel as current/max (differs from .ls single 'fuel' integer)
      fuelCurrent: 100,
      fuelMax: 100,
      // Matches .ls fuelConsumption property
      fuelConsumptionRate: 1,
      fuelWarningThreshold: 0.2,
      fuelWarningShown: false,
      // Stamina is a JS extension (not in .ls)
      staminaCurrent: 100,
      staminaMax: 100,
      staminaConsumptionRate: 1,
      staminaWarningThreshold: 0.2,
      staminaWarningShown: false,
      staminaRecoveryRate: 1,
      hasEngine: true,
      hasOars: true,
      hasSail: false,
      maxSpeed: 6,
      // .ls: level property affects hunger speed and seasickness
      seaLevel: 3,
      // .ls: buffaSick starts at 1000 + (pillNr * 25)
      buffaSick: 1000,
      // .ls: mulleHunger starts at bellyNr * 10, decreases by mulleHungerSpeed
      mulleHunger: 10000,
      // .ls: mulleHungerSpeed = 3 at level 1, 2 at other levels
      mulleHungerSpeed: 2,
      enabled: true,
      state: null,
      outOfFuel: false,
      outOfStamina: false,
      game: {
        mulle: {
          playAudio: jest.fn(() => ({ onStop: { addOnce: jest.fn() } })),
          user: {
            SeaInventory: { items: { Belly: { nr: 5 } } },
            save: jest.fn(),
            isInInventory: jest.fn(() => false),
            setInInventory: jest.fn(),
            removeFromInventory: jest.fn(),
            lookUpInventory: jest.fn(() => null),
            isMissionCompleted: jest.fn(() => 0),
            addGivenMission: jest.fn()
          }
        },
        time: { now: 1000 }
      }
    }
  })

  // ==========================================================================
  // FUEL CONSUMPTION (maps to MotorBoatAncestor.ls loop())
  // Formula: tmpFuel = tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
  // ==========================================================================
  describe('consumeEnergy - fuel consumption', () => {
    it('should consume fuel using .ls formula: abs(motorSpeed) * rate / 30', () => {
      // .ls: tmpFuel = tmpFuel - (abs(motorSpeed) * fuelConsumption / 30)
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.speed = 30
      mockBoat.motorSpeed = 30 // Throttle position used for fuel consumption
      mockBoat.fuelConsumptionRate = 1
      mockBoat.fuelCurrent = 100

      consumeEnergy(mockBoat)

      // Expected: 100 - (30 * 1 / 30) = 100 - 1 = 99
      expect(mockBoat.fuelCurrent).toBe(99)
    })

    it('should use absolute motorSpeed value for fuel consumption', () => {
      // .ls uses abs(motorSpeed)
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.speed = -30 // negative (reverse)
      mockBoat.motorSpeed = 30 // motorSpeed is always absolute
      mockBoat.fuelConsumptionRate = 1
      mockBoat.fuelCurrent = 100

      consumeEnergy(mockBoat)

      // Same consumption as positive speed
      expect(mockBoat.fuelCurrent).toBe(99)
    })

    it('should scale consumption with fuelConsumption rate', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.speed = 30
      mockBoat.motorSpeed = 30
      mockBoat.fuelConsumptionRate = 2 // double consumption
      mockBoat.fuelCurrent = 100

      consumeEnergy(mockBoat)

      // Expected: 100 - (30 * 2 / 30) = 100 - 2 = 98
      expect(mockBoat.fuelCurrent).toBe(98)
    })

    it('should not consume fuel for sail boats (.ls: wind is free)', () => {
      mockBoat.currentPropulsion = PropulsionType.SAIL
      const initialFuel = mockBoat.fuelCurrent

      consumeEnergy(mockBoat)

      expect(mockBoat.fuelCurrent).toBe(initialFuel)
    })

    it('should not consume fuel when motor speed is 0', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.speed = 0
      mockBoat.motorSpeed = 0
      mockBoat.fuelConsumptionRate = 5
      mockBoat.fuelCurrent = 77

      consumeEnergy(mockBoat)

      expect(mockBoat.fuelCurrent).toBe(77)
    })

    it('should trigger low fuel warning at threshold', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.fuelCurrent = 21 // Just above 20% threshold
      mockBoat.fuelMax = 100
      mockBoat.speed = 30
      mockBoat.motorSpeed = 30
      mockBoat.fuelConsumptionRate = 3 // Will drop below 20%

      consumeEnergy(mockBoat)

      // Dropped to 18/100 = 18%, below 20% threshold
      expect(mockBoat.fuelWarningShown).toBe(true)
    })

    it('should not go below 0 fuel', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.fuelCurrent = 1
      mockBoat.speed = 60
      mockBoat.motorSpeed = 60
      mockBoat.fuelConsumptionRate = 10

      consumeEnergy(mockBoat)

      expect(mockBoat.fuelCurrent).toBe(0)
    })
  })

  // ==========================================================================
  // HUNGER SYSTEM (maps to BoatBase.ls loop() lines 568-588)
  // .ls: mulleHunger decreases by mulleHungerSpeed each frame
  // .ls: mulleHungerSpeed = 3 at level 1, 2 at other levels
  // ==========================================================================
  describe('consumeEnergy - hunger system (mulleHunger)', () => {
    it('should decrease mulleHunger by mulleHungerSpeed', () => {
      // .ls: set mulleHunger to mulleHunger - mulleHungerSpeed
      mockBoat.mulleHunger = 100
      mockBoat.mulleHungerSpeed = 2

      consumeEnergy(mockBoat)

      expect(mockBoat.mulleHunger).toBe(98)
    })

    it('should use mulleHungerSpeed of 3 at level 1', () => {
      // .ls: mulleHungerSpeed = 3 at level 1, 2 at other levels
      mockBoat.mulleHunger = 100
      mockBoat.mulleHungerSpeed = 3 // level 1 value
      mockBoat.seaLevel = 1

      consumeEnergy(mockBoat)

      expect(mockBoat.mulleHunger).toBe(97)
    })

    it('should use mulleHungerSpeed of 2 at level >= 2', () => {
      mockBoat.mulleHunger = 100
      mockBoat.mulleHungerSpeed = 2 // level 2+ value
      mockBoat.seaLevel = 3

      consumeEnergy(mockBoat)

      expect(mockBoat.mulleHunger).toBe(98)
    })
  })

  // ==========================================================================
  // SEASICKNESS (maps to BoatBase.ls loop() lines 555-566)
  // .ls: only active at level >= 4
  // .ls: buffaSick = buffaSick - (tmpDiff / 13) where tmpDiff = sway difference
  // ==========================================================================
  describe('consumeEnergy - seasickness (buffaSick)', () => {
    it('should decrease buffaSick at seaLevel >= 4', () => {
      // .ls: if level >= 4 then ... set buffaSick to buffaSick - (tmpDiff / 13)
      mockBoat.seaLevel = 4
      mockBoat.buffaSick = 100

      consumeEnergy(mockBoat)

      // JS simplifies to decrement by 1 (sway diff calculation not implemented)
      expect(mockBoat.buffaSick).toBe(99)
    })

    it('should NOT decrease buffaSick at seaLevel < 4', () => {
      // .ls: seasickness only triggers at level >= 4
      mockBoat.seaLevel = 3
      mockBoat.buffaSick = 100

      consumeEnergy(mockBoat)

      expect(mockBoat.buffaSick).toBe(100)
    })

    it('should NOT decrease buffaSick at level 1', () => {
      mockBoat.seaLevel = 1
      mockBoat.buffaSick = 100

      consumeEnergy(mockBoat)

      expect(mockBoat.buffaSick).toBe(100)
    })

    it('should trigger vomit at buffaSick <= 0', () => {
      mockBoat.seaLevel = 4
      mockBoat.buffaSick = 1
      mockBoat.state = { returnToShore: jest.fn() }

      consumeEnergy(mockBoat)

      expect(mockBoat.buffaSick).toBe(0)
      expect(mockBoat.enabled).toBe(false)
    })
  })

  // ==========================================================================
  // HANDLE HUNGER (maps to BoatBase.ls lines 571-587)
  // .ls: if isInInventory(#Fishingrod) then auto-fish and restore hunger
  // ==========================================================================
  describe('handleHunger', () => {
    it('should use fishing rod if available and restore hunger to 10000', () => {
      // .ls: if isInInventory(the user of gMulleGlobals, #Fishingrod) then
      //      set mulleHunger to 10000
      mockBoat.game.mulle.user.isInInventory = jest.fn((item) => item === 'Fishingrod')

      handleHunger(mockBoat)

      expect(mockBoat.mulleHunger).toBe(10000)
      expect(mockBoat.enabled).toBe(true)
    })

    it('should play first-time fishing sound 05d045v0', () => {
      // .ls: set tmpSnd to "05d045v0" (first time)
      mockBoat.game.mulle.user.isInInventory = jest.fn((item) => item === 'Fishingrod')

      handleHunger(mockBoat)

      expect(mockBoat.game.mulle.playAudio).toHaveBeenCalledWith('05d045v0')
    })

    it('should play repeat fishing sound 05d120v0', () => {
      // .ls: set tmpSnd to "05d120v0" (has fished before)
      mockBoat.game.mulle.user.isInInventory = jest.fn((item) => {
        if (item === 'Fishingrod') return true
        if (item === 'Fished') return true
        return false
      })

      handleHunger(mockBoat)

      expect(mockBoat.game.mulle.playAudio).toHaveBeenCalledWith('05d120v0')
    })

    it('should set Fished inventory flag on first fishing', () => {
      // .ls: setInInventory(the user of gMulleGlobals, #Fished, [:])
      mockBoat.game.mulle.user.isInInventory = jest.fn((item) => item === 'Fishingrod')

      handleHunger(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith('Fished', {})
    })

    it('should return to shore if no fishing rod', () => {
      // .ls: say(#Hungry) and waitToGoHome
      mockBoat.game.mulle.user.isInInventory = jest.fn(() => false)
      mockBoat.state = { returnToShore: jest.fn() }

      handleHunger(mockBoat)

      expect(mockBoat.enabled).toBe(false)
      expect(mockBoat.state.returnToShore).toHaveBeenCalledWith('hungry')
    })
  })

  // ==========================================================================
  // HANDLE VOMIT (maps to BoatBase.ls lines 560-565)
  // .ls: if isMissionCompleted(3) then addGivenMission(3)
  // ==========================================================================
  describe('handleVomit', () => {
    it('should disable boat on vomit', () => {
      handleVomit(mockBoat)

      expect(mockBoat.enabled).toBe(false)
    })

    it('should add mission 3 if already completed', () => {
      // .ls: if isMissionCompleted(the user of gMulleGlobals, 3) then addGivenMission(3)
      mockBoat.game.mulle.user.isMissionCompleted = jest.fn(() => 1)

      handleVomit(mockBoat)

      expect(mockBoat.game.mulle.user.addGivenMission).toHaveBeenCalledWith(3)
    })

    it('should NOT add mission 3 if not completed', () => {
      mockBoat.game.mulle.user.isMissionCompleted = jest.fn(() => 0)

      handleVomit(mockBoat)

      expect(mockBoat.game.mulle.user.addGivenMission).not.toHaveBeenCalled()
    })

    it('should return to shore with vomit reason', () => {
      mockBoat.state = { returnToShore: jest.fn() }

      handleVomit(mockBoat)

      expect(mockBoat.state.returnToShore).toHaveBeenCalledWith('vomit')
    })
  })

  // ==========================================================================
  // SAVE INVENTORY STATE (maps to BoatBase.ls save() lines 250-262)
  // .ls formulas:
  //   Pills: set tmpLeft to (buffaSick - 1000) / 25
  //   Belly: setInInventory(#Belly, [#nr: mulleHunger / 10])
  // ==========================================================================
  describe('saveInventoryState', () => {
    it('should convert buffaSick to pills using formula: (buffaSick - 1000) / 25', () => {
      // .ls: set tmpLeft to (buffaSick - 1000) / 25
      mockBoat.buffaSick = 1100 // (1100 - 1000) / 25 = 4 pills

      saveInventoryState(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith(
        'Pills',
        { nr: 4 },
        true
      )
    })

    it('should remove pills from inventory if none left', () => {
      // .ls: if tmpLeft <= 0 then deleteFromInventory(#Pills)
      mockBoat.buffaSick = 1000 // (1000 - 1000) / 25 = 0 pills

      saveInventoryState(mockBoat)

      expect(mockBoat.game.mulle.user.removeFromInventory).toHaveBeenCalledWith('Pills')
    })

    it('should convert mulleHunger to belly using formula: mulleHunger / 10', () => {
      // .ls: setInInventory(#Belly, [#nr: mulleHunger / 10])
      mockBoat.mulleHunger = 5000 // 5000 / 10 = 500 belly nr

      saveInventoryState(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith(
        'Belly',
        { nr: 500 },
        true
      )
    })

    it('should floor decimal values', () => {
      mockBoat.buffaSick = 1037 // (1037 - 1000) / 25 = 1.48 -> floor to 1
      mockBoat.mulleHunger = 127 // 127 / 10 = 12.7 -> floor to 12

      saveInventoryState(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith(
        'Pills',
        { nr: 1 },
        true
      )
      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith(
        'Belly',
        { nr: 12 },
        true
      )
    })
  })

  // ==========================================================================
  // REFUEL (maps to BoatBase.ls fillErUp line 178)
  // .ls: set fuel to #Full then calculateFuel
  // JS extension: allows partial refuel with amount parameter
  // ==========================================================================
  describe('refuel', () => {
    it('should add fuel up to max', () => {
      mockBoat.fuelCurrent = 50
      refuel(mockBoat, 30)
      expect(mockBoat.fuelCurrent).toBe(80)
    })

    it('should not exceed max fuel', () => {
      mockBoat.fuelCurrent = 90
      refuel(mockBoat, 30)
      expect(mockBoat.fuelCurrent).toBe(100)
    })

    it('should reset out of fuel state', () => {
      mockBoat.outOfFuel = true
      mockBoat.fuelWarningShown = true
      refuel(mockBoat, 50)
      expect(mockBoat.outOfFuel).toBe(false)
      expect(mockBoat.fuelWarningShown).toBe(false)
    })

    it('should restore motor propulsion if engine available', () => {
      mockBoat.currentPropulsion = PropulsionType.NONE
      mockBoat.fuelCurrent = 0
      refuel(mockBoat, 50)
      expect(mockBoat.currentPropulsion).toBe(PropulsionType.MOTOR)
    })

    it('should re-enable boat after refueling', () => {
      mockBoat.enabled = false
      mockBoat.fuelCurrent = 0
      refuel(mockBoat, 50)
      expect(mockBoat.enabled).toBe(true)
    })
  })

  // ==========================================================================
  // FALLBACK PROPULSION (maps to BoatBase.ls OutOfFuel -> changeType)
  // .ls: checks possibleTypes list for alternative propulsion
  // ==========================================================================
  describe('fallbackPropulsion', () => {
    it('should fall back to sail if available', () => {
      // .ls: tries alternative types from possibleTypes list
      mockBoat.hasSail = true
      mockBoat.hasOars = true

      fallbackPropulsion(mockBoat)

      expect(mockBoat.currentPropulsion).toBe(PropulsionType.SAIL)
    })

    it('should fall back to oars if no sail but has stamina', () => {
      mockBoat.hasSail = false
      mockBoat.hasOars = true
      mockBoat.staminaCurrent = 50

      fallbackPropulsion(mockBoat)

      expect(mockBoat.currentPropulsion).toBe(PropulsionType.OAR)
    })

    it('should set NONE if no alternatives available', () => {
      // .ls: if no alternatives, triggers GoHomeTow dialog
      mockBoat.hasSail = false
      mockBoat.hasOars = false

      fallbackPropulsion(mockBoat)

      expect(mockBoat.currentPropulsion).toBe(PropulsionType.NONE)
    })

    it('should re-enable boat with alternative propulsion', () => {
      mockBoat.hasSail = true
      mockBoat.enabled = false

      fallbackPropulsion(mockBoat)

      expect(mockBoat.enabled).toBe(true)
    })

    it('should update max speed for new propulsion', () => {
      mockBoat.hasSail = true
      mockBoat.maxSpeed = 6

      fallbackPropulsion(mockBoat)

      expect(mockBoat.maxSpeed).toBe(4) // sail max speed
    })
  })

  // ==========================================================================
  // UPDATE MAX SPEED FOR PROPULSION
  // JS extension with speed values per propulsion type
  // ==========================================================================
  describe('updateMaxSpeedForPropulsion', () => {
    it('should set max speed 6 for motor', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      updateMaxSpeedForPropulsion(mockBoat)
      expect(mockBoat.maxSpeed).toBe(6)
    })

    it('should set max speed 4 for sail', () => {
      mockBoat.currentPropulsion = PropulsionType.SAIL
      updateMaxSpeedForPropulsion(mockBoat)
      expect(mockBoat.maxSpeed).toBe(4)
    })

    it('should set max speed 2 for oar', () => {
      mockBoat.currentPropulsion = PropulsionType.OAR
      updateMaxSpeedForPropulsion(mockBoat)
      expect(mockBoat.maxSpeed).toBe(2)
    })

    it('should set drift speed 0.5 for none', () => {
      mockBoat.currentPropulsion = PropulsionType.NONE
      updateMaxSpeedForPropulsion(mockBoat)
      expect(mockBoat.maxSpeed).toBe(0.5)
    })
  })

  // ==========================================================================
  // BELLY SYSTEM (JS uses SeaInventory, .ls uses regular inventory)
  // ==========================================================================
  describe('hasBelly / getBellyCount', () => {
    it('should return true when belly snacks available', () => {
      expect(hasBelly(mockBoat)).toBe(true)
    })

    it('should return belly count', () => {
      expect(getBellyCount(mockBoat)).toBe(5)
    })

    it('should return false when no belly', () => {
      mockBoat.game.mulle.user.SeaInventory.items = {}
      expect(hasBelly(mockBoat)).toBe(false)
      expect(getBellyCount(mockBoat)).toBe(0)
    })
  })

  describe('consumeBelly', () => {
    it('should decrement belly count by 1', () => {
      consumeBelly(mockBoat)
      expect(mockBoat.game.mulle.user.SeaInventory.items.Belly.nr).toBe(4)
    })

    it('should restore fuel for engine boats', () => {
      mockBoat.fuelCurrent = 50
      consumeBelly(mockBoat)
      expect(mockBoat.fuelCurrent).toBeGreaterThan(50)
    })

    it('should save user state after consuming', () => {
      consumeBelly(mockBoat)
      expect(mockBoat.game.mulle.user.save).toHaveBeenCalled()
    })

    it('should return false when no belly available', () => {
      mockBoat.game.mulle.user.SeaInventory.items = {}
      expect(consumeBelly(mockBoat)).toBe(false)
    })

    it('should delete belly item when depleted', () => {
      mockBoat.game.mulle.user.SeaInventory.items.Belly.nr = 1
      consumeBelly(mockBoat)
      expect(mockBoat.game.mulle.user.SeaInventory.items.Belly).toBeUndefined()
    })
  })

  // ==========================================================================
  // FUEL PERCENTAGE
  // ==========================================================================
  describe('getFuelPercentage', () => {
    it('should return fuel percentage', () => {
      mockBoat.fuelCurrent = 75
      mockBoat.fuelMax = 100
      expect(getFuelPercentage(mockBoat)).toBe(0.75)
    })

    it('should return 1 for non-motor boats (fuelMax = 0)', () => {
      mockBoat.fuelMax = 0
      expect(getFuelPercentage(mockBoat)).toBe(1)
    })
  })

  // ==========================================================================
  // CAN MOVE
  // ==========================================================================
  describe('canMove', () => {
    it('should return true for motor with fuel', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.fuelCurrent = 50
      expect(canMove(mockBoat)).toBe(true)
    })

    it('should return false for motor without fuel', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.fuelCurrent = 0
      expect(canMove(mockBoat)).toBe(false)
    })

    it('should return true for sail always (wind is free)', () => {
      mockBoat.currentPropulsion = PropulsionType.SAIL
      expect(canMove(mockBoat)).toBe(true)
    })

    it('should return true for NONE (drift always works)', () => {
      mockBoat.currentPropulsion = PropulsionType.NONE
      expect(canMove(mockBoat)).toBe(true)
    })
  })

  // ==========================================================================
  // DRIVEN TIMES TRACKING (maps to BoatBase.ls calculateMyProps lines 215-220)
  // ==========================================================================
  describe('trackDrivenTimes', () => {
    it('should increment DrivenTimes for motor', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.game.mulle.user.lookUpInventory = jest.fn(() => ({ Motor: 5, Sail: 2, Oar: 1 }))

      trackDrivenTimes(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith(
        'DrivenTimes',
        { Motor: 6, Sail: 2, Oar: 1 }
      )
    })

    it('should initialize DrivenTimes if not exists', () => {
      mockBoat.currentPropulsion = PropulsionType.SAIL
      mockBoat.game.mulle.user.lookUpInventory = jest.fn(() => null)

      trackDrivenTimes(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).toHaveBeenCalledWith(
        'DrivenTimes',
        { Motor: 0, Sail: 1, Oar: 0 }
      )
    })

    it('should not track twice for same propulsion type', () => {
      mockBoat.currentPropulsion = PropulsionType.MOTOR
      mockBoat.drivenTimesTracked = true
      mockBoat.currentDrivenType = PropulsionType.MOTOR

      trackDrivenTimes(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).not.toHaveBeenCalled()
    })

    it('should not track NONE propulsion', () => {
      mockBoat.currentPropulsion = PropulsionType.NONE

      trackDrivenTimes(mockBoat)

      expect(mockBoat.game.mulle.user.setInInventory).not.toHaveBeenCalled()
    })
  })

  // ==========================================================================
  // JS EXTENSIONS: Stamina system (not in .ls)
  // These functions exist in BoatEnergy.js but have no .ls equivalent
  // ==========================================================================
  describe('JS Extensions: Stamina system (not in .ls)', () => {
    describe('consumeEnergy - stamina consumption', () => {
      it('should consume stamina for oar boats', () => {
        mockBoat.currentPropulsion = PropulsionType.OAR
        mockBoat.staminaCurrent = 100
        mockBoat.speed = 2
        mockBoat.staminaConsumptionRate = 1

        consumeEnergy(mockBoat)

        expect(mockBoat.staminaCurrent).toBe(98) // 100 - (2 * 1)
      })

      it('should trigger low stamina warning at threshold', () => {
        mockBoat.currentPropulsion = PropulsionType.OAR
        mockBoat.staminaCurrent = 25
        mockBoat.staminaMax = 100
        mockBoat.speed = 5
        mockBoat.staminaConsumptionRate = 2

        consumeEnergy(mockBoat)

        expect(mockBoat.staminaWarningShown).toBe(true)
      })
    })

    describe('recoverStamina', () => {
      it('should recover stamina when below max', () => {
        mockBoat.staminaCurrent = 50
        mockBoat.staminaRecoveryRate = 10

        recoverStamina(mockBoat)

        expect(mockBoat.staminaCurrent).toBe(60)
      })

      it('should not exceed max stamina', () => {
        mockBoat.staminaCurrent = 95
        mockBoat.staminaRecoveryRate = 10

        recoverStamina(mockBoat)

        expect(mockBoat.staminaCurrent).toBe(100)
      })

      it('should not recover without oars', () => {
        mockBoat.hasOars = false
        mockBoat.staminaCurrent = 50

        recoverStamina(mockBoat)

        expect(mockBoat.staminaCurrent).toBe(50)
      })

      it('should reset warning when stamina recovers above threshold + 10%', () => {
        mockBoat.staminaCurrent = 29 // Just under 30% (threshold 20% + 10%)
        mockBoat.staminaMax = 100
        mockBoat.staminaWarningShown = true
        mockBoat.staminaRecoveryRate = 5

        recoverStamina(mockBoat)

        // Now at 34%, above 30% threshold
        expect(mockBoat.staminaWarningShown).toBe(false)
      })
    })

    describe('getStaminaPercentage', () => {
      it('should return stamina percentage', () => {
        mockBoat.staminaCurrent = 50
        mockBoat.staminaMax = 100
        expect(getStaminaPercentage(mockBoat)).toBe(0.5)
      })

      it('should return 1 for non-rowing boats', () => {
        mockBoat.staminaMax = 0
        expect(getStaminaPercentage(mockBoat)).toBe(1)
      })
    })

    describe('canMove - oar stamina', () => {
      it('should return true for oar with stamina', () => {
        mockBoat.currentPropulsion = PropulsionType.OAR
        mockBoat.staminaCurrent = 50
        expect(canMove(mockBoat)).toBe(true)
      })

      it('should return false for oar without stamina', () => {
        mockBoat.currentPropulsion = PropulsionType.OAR
        mockBoat.staminaCurrent = 0
        expect(canMove(mockBoat)).toBe(false)
      })
    })

    describe('getEffectiveMaxSpeed', () => {
      it('should return max speed for motor', () => {
        mockBoat.currentPropulsion = PropulsionType.MOTOR
        mockBoat.maxSpeed = 6
        expect(getEffectiveMaxSpeed(mockBoat)).toBe(6)
      })

      it('should return wind-adjusted speed for sail', () => {
        mockBoat.currentPropulsion = PropulsionType.SAIL
        mockBoat.maxSpeed = 4

        const speed = getEffectiveMaxSpeed(mockBoat)

        // Wind factor varies between 0.6 and 1.0
        expect(speed).toBeGreaterThanOrEqual(2.4)
        expect(speed).toBeLessThanOrEqual(4)
      })

      it('should return stamina-adjusted speed for oar', () => {
        mockBoat.currentPropulsion = PropulsionType.OAR
        mockBoat.maxSpeed = 2
        mockBoat.staminaCurrent = 30
        mockBoat.staminaMax = 100

        const speed = getEffectiveMaxSpeed(mockBoat)

        // At 30% stamina (below 50%), speed is reduced
        expect(speed).toBeLessThan(2)
        expect(speed).toBeGreaterThan(0)
      })

      it('should return 0.5 for NONE propulsion (drift)', () => {
        mockBoat.currentPropulsion = PropulsionType.NONE
        expect(getEffectiveMaxSpeed(mockBoat)).toBe(0.5)
      })
    })

    describe('handleOutOfStamina', () => {
      it('should set outOfStamina flag', () => {
        mockBoat.hasSail = false
        mockBoat.hasOars = false

        handleOutOfStamina(mockBoat)

        expect(mockBoat.outOfStamina).toBe(true)
      })

      it('should try to consume belly first', () => {
        const consumed = jest.fn()
        mockBoat.game.mulle.user.SeaInventory.items.Belly.nr = 5

        handleOutOfStamina(mockBoat)

        // Should have consumed belly (nr decremented)
        expect(mockBoat.game.mulle.user.SeaInventory.items.Belly.nr).toBe(4)
      })

      it('should recover rowing ability when stamina > 30%', () => {
        mockBoat.outOfStamina = true
        mockBoat.staminaCurrent = 35
        mockBoat.staminaMax = 100
        mockBoat.currentPropulsion = PropulsionType.NONE

        handleOutOfStamina(mockBoat)

        expect(mockBoat.outOfStamina).toBe(false)
        expect(mockBoat.currentPropulsion).toBe(PropulsionType.OAR)
      })
    })
  })
})
