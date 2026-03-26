/**
 * Tests for BoatPhysics module
 * 
 * These tests verify the ACTUAL physics formulas from BoatBase.ls,
 * NOT the invented functions that were never in the original code.
 * 
 * Key BoatBase.ls functions tested:
 * - calcSpeedNDir (lines 270-310): Speed calculation with speedList interpolation
 * - stepback (lines 230-245): Collision recovery with locHistory rollback
 * - Position update in loop() (lines 330-340): Drift and speedDivider
 * - Wave/stability in loop() (lines 400-440): stabilities-based inclinations
 */
import {
  calcSpeedNDir,
  stepback,
  updatePositionWithDrift,
  calculateInclinations,
  clampInclinations,
  checkBounds
} from '../BoatPhysics'
import { DIRECTION_LIST, DEFAULT_BOAT_PROPS } from '../BoatConstants'

describe('BoatPhysics', () => {
  /**
   * Helper to create a boat state matching BoatBase.ls constructor values
   * Reference: BoatBase.ls constructor (lines 50-100)
   */
  function createBoatState (overrides = {}) {
    const decimalPrec = 100
    const direction = 1
    const loc = { x: 320 * decimalPrec, y: 240 * decimalPrec }
    
    // Create locHistory with 10 entries (BoatBase.ls line ~80)
    const locHistory = []
    for (let i = 0; i < 10; i++) {
      locHistory.push({ x: loc.x, y: loc.y })
    }
    
    return {
      decimalPrec,
      speed: 3, // BoatBase.ls: speed = 3
      direction, // BoatBase.ls: direction = 1
      internalDirection: direction * decimalPrec, // = 100
      loc,
      locHistory,
      inclinations: [0, 0], // [side, frontBack]
      velPoint: { x: 0, y: 0 },
      currentCorners: null,
      
      // quickProps from Lingo property list
      quickProps: {
        power: 100,
        ManoeuverAbility: 50,
        Drift: 10
      },
      
      // speedList: typically [0, 2, 4, 6, 8, 10] for 5 speed levels
      speedList: [0, 2, 4, 6, 8, 10],
      
      // Physics parameters
      acceleration: 5,
      retardation: 10,
      speedDivider: 10,
      
      // stabilities from Lingo: [lateral, longitudinal]
      stabilities: [85, 55],
      
      // cornerPoints per direction
      cornerPoints: Array(17).fill([
        { x: -10, y: -10 },
        { x: 10, y: -10 },
        { x: 10, y: 10 },
        { x: -10, y: 10 }
      ]),
      
      // Wind vector for drift
      wind: { x: 50, y: 0 },
      
      // Buffa sick state (seasickness)
      buffaSick: 0,
      
      OutOfBounds: 0,
      
      ...overrides
    }
  }

  describe('calcSpeedNDir - BoatBase.ls lines 270-310', () => {
    /**
     * Tests for the core physics method that handles:
     * 1. Speed calculation using speedList lookup with interpolation
     * 2. Acceleration/retardation with clamping
     * 3. Steering via ManoeuverAbility
     * 4. velPoint calculation from direction
     */

    it('should lookup speed from speedList using power interpolation', () => {
      // BoatBase.ls line ~275-290:
      // tmpPowerIn = abs(argForce * power / 100)
      // tmpPower = floor(tmpPowerIn / 100) gives speedList index
      // tmpDec = tmpPowerIn % 100 gives interpolation factor
      const boat = createBoatState({
        speedList: [0, 2, 4, 6, 8, 10],
        quickProps: { power: 100, ManoeuverAbility: 50 },
        speed: 0,
        acceleration: 100, // High acceleration so speed changes immediately
        retardation: 100
      })

      // Force = 100, power = 100 => tmpPowerIn = 100
      // tmpPower = 1, tmpDec = 0
      // tmpLower = speedList[1] = 2, tmpHigher = speedList[2] = 4
      // tmpWanted = 2 + (0 * (4-2) / 100) = 2
      calcSpeedNDir(boat, 100, 0)
      
      // Speed should move toward wanted speed of 2
      expect(boat.speed).toBeGreaterThan(0)
    })

    it('should interpolate between speedList entries', () => {
      const boat = createBoatState({
        speedList: [0, 100, 200], // Larger values for clearer test
        quickProps: { power: 100, ManoeuverAbility: 50 },
        speed: 0,
        acceleration: 10000, // Very high to reach target immediately
        retardation: 10000
      })

      // Force = 150 with power = 100 => tmpPowerIn = 150
      // tmpPower = 1 (index), tmpDec = 50
      // tmpLower = 100, tmpHigher = 200
      // tmpWanted = 100 + (50 * (200-100) / 100) = 150
      calcSpeedNDir(boat, 150, 0)
      
      expect(boat.speed).toBeCloseTo(150, 0)
    })

    it('should apply acceleration when speeding up', () => {
      // BoatBase.ls line ~295-300:
      // if tmp > 0: tmpRealSpeedChange = acceleration * (tmpWanted - speed) / decimalPrec
      // if abs(tmpRealSpeedChange) > acceleration: clamp to acceleration
      const boat = createBoatState({
        speedList: [0, 100],
        speed: 0,
        acceleration: 10,
        retardation: 20,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 100, 0)
      
      // Speed should increase by at most acceleration (10)
      expect(boat.speed).toBeGreaterThan(0)
      expect(boat.speed).toBeLessThanOrEqual(10)
    })

    it('should apply retardation when slowing down', () => {
      // BoatBase.ls line ~300-305:
      // if tmp <= 0: tmpRealSpeedChange = retardation * (tmpWanted - speed) / decimalPrec
      const boat = createBoatState({
        speedList: [0, 50, 100],
        speed: 100, // Starting at high speed
        acceleration: 10,
        retardation: 20,
        decimalPrec: 100
      })

      // Force = 0 means tmpWanted = 0, so we're slowing down
      calcSpeedNDir(boat, 0, 0)
      
      // Speed should decrease by at most retardation (20)
      expect(boat.speed).toBeLessThan(100)
      expect(boat.speed).toBeGreaterThanOrEqual(80) // 100 - 20
    })

    it('should use retardation path when force is zero and speed is positive', () => {
      const boat = createBoatState({
        speedList: [0, 20, 40],
        speed: 30,
        acceleration: 5,
        retardation: 12,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 0, 0)

      expect(boat.speed).toBeLessThan(30)
      expect(30 - boat.speed).toBeLessThanOrEqual(12)
    })

    it('should clamp acceleration to maximum value', () => {
      // BoatBase.ls line ~297:
      // if abs(tmpRealSpeedChange) > acceleration: clamp
      const boat = createBoatState({
        speedList: [0, 1000], // Large jump
        speed: 0,
        acceleration: 5,
        retardation: 10,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 100, 0)
      
      // Should be clamped to acceleration value
      expect(boat.speed).toBe(5)
    })

    it('should handle negative force for reverse', () => {
      // BoatBase.ls line ~292:
      // if argForce < 0: set tmpWanted to -tmpWanted
      const boat = createBoatState({
        speedList: [0, 50],
        speed: 0,
        acceleration: 100,
        retardation: 100,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, -100, 0)
      
      expect(boat.speed).toBeLessThan(0)
    })

    it('should update steering via ManoeuverAbility', () => {
      // BoatBase.ls line ~306-308:
      // tmpSteer = argSteering * ManoeuverAbility / 10
      // internalDirection = internalDirection + tmpSteer
      const boat = createBoatState({
        internalDirection: 100,
        quickProps: { power: 100, ManoeuverAbility: 50 },
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 50, 10) // Steering = 10
      
      // tmpSteer = 10 * 50 / 10 = 50
      // internalDirection = 100 + 50 = 150
      expect(boat.internalDirection).toBe(150)
    })

    it('should update direction from internalDirection', () => {
      // BoatBase.ls line ~308:
      // direction = correctDirection(internalDirection / decimalPrec)
      const boat = createBoatState({
        internalDirection: 100,
        direction: 1,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 50, 100) // Large steering
      
      // Direction should update based on new internalDirection
      expect(boat.direction).toBeGreaterThanOrEqual(1)
      expect(boat.direction).toBeLessThanOrEqual(16)
    })

    it('should calculate velPoint from direction and speed', () => {
      // BoatBase.ls line ~310:
      // velPoint = getVelPoint(direction) * speed / 100
      const boat = createBoatState({
        direction: 4, // East: x=100, y=0
        internalDirection: 400,
        speed: 50,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 50, 0)
      
      // velPoint should be direction vector scaled by speed/100
      expect(boat.velPoint).toBeDefined()
      expect(boat.velPoint.x).toBeDefined()
      expect(boat.velPoint.y).toBeDefined()
    })
  })

  describe('stepback - BoatBase.ls lines 230-245', () => {
    /**
     * stepback resets speed and rolls back position using locHistory
     */

    it('should set speed to 0', () => {
      // BoatBase.ls line ~232: set speed to 0
      const boat = createBoatState({ speed: 50 })
      
      stepback(boat, 5)
      
      expect(boat.speed).toBe(0)
    })

    it('should exit early if argNrOfSteps < 1', () => {
      // BoatBase.ls line ~233-234: if argNrOfSteps < 1 then exit
      const boat = createBoatState()
      const originalLoc = { ...boat.loc }
      
      stepback(boat, 0)
      
      expect(boat.speed).toBe(0)
      expect(boat.loc.x).toBe(originalLoc.x)
      expect(boat.loc.y).toBe(originalLoc.y)
    })

    it('should rollback location from locHistory', () => {
      // BoatBase.ls line ~235-238:
      // tmp = count(locHistory) - argNrOfSteps + 1
      // loc = getAt(locHistory, tmp)
      const boat = createBoatState()
      
      // Set up locHistory with different positions
      boat.locHistory = [
        { x: 100, y: 100 },
        { x: 200, y: 200 },
        { x: 300, y: 300 },
        { x: 400, y: 400 },
        { x: 500, y: 500 }
      ]
      boat.loc = { x: 600, y: 600 }
      
      // argNrOfSteps = 3 => tmp = 5 - 3 + 1 = 3
      // loc = locHistory[3] (0-indexed: locHistory[2])
      const result = stepback(boat, 3)
      
      // In Lingo 1-indexed: getAt(locHistory, 3) = {300, 300}
      // In JS 0-indexed with same formula: locHistory[2] = {300, 300}
      expect(boat.loc.x).toBe(300)
      expect(boat.loc.y).toBe(300)
    })

    it('should clamp to first history entry if stepping back too far', () => {
      // BoatBase.ls line ~236-237: if tmp < 1 then tmp = 1
      const boat = createBoatState()
      
      boat.locHistory = [
        { x: 100, y: 100 },
        { x: 200, y: 200 }
      ]
      boat.loc = { x: 500, y: 500 }
      
      // argNrOfSteps = 10 => tmp = 2 - 10 + 1 = -7, clamp to 1
      stepback(boat, 10)
      
      expect(boat.loc.x).toBe(100)
      expect(boat.loc.y).toBe(100)
    })

    it('should fill remaining history entries with rolled-back loc', () => {
      // BoatBase.ls line ~239-241:
      // repeat with N = tmp + 1 to count(locHistory)
      //   setAt(locHistory, N, loc)
      const boat = createBoatState()
      
      boat.locHistory = [
        { x: 100, y: 100 },
        { x: 200, y: 200 },
        { x: 300, y: 300 },
        { x: 400, y: 400 }
      ]
      
      stepback(boat, 2) // tmp = 4 - 2 + 1 = 3, loc = locHistory[2] = {300, 300}
      
      // Entries after tmp should be filled with {300, 300}
      expect(boat.locHistory[3].x).toBe(300)
      expect(boat.locHistory[3].y).toBe(300)
    })

    it('should return the new loc', () => {
      // BoatBase.ls line ~242: return loc
      const boat = createBoatState()
      boat.locHistory = [{ x: 111, y: 222 }]
      
      const result = stepback(boat, 1)
      
      expect(result).toEqual({ x: 111, y: 222 })
    })
  })

  describe('Position update with drift - BoatBase.ls lines 330-340', () => {
    /**
     * Position update formula:
     * tmpDrift = 90 * Drift * wind / 100 / 100
     * loc = loc + ((velPoint + tmpDrift) / speedDivider)
     */

    it('should calculate drift from wind and Drift property', () => {
      // BoatBase.ls line ~330:
      // tmpDrift = 90 * getProp(quickProps, #Drift) * getVelPoint(wind) / 100 / 100
      const boat = createBoatState({
        quickProps: { Drift: 10, power: 100, ManoeuverAbility: 50 },
        wind: { x: 100, y: 0 }, // Full wind from west
        velPoint: { x: 0, y: 0 },
        loc: { x: 32000, y: 24000 },
        speedDivider: 10
      })

      updatePositionWithDrift(boat)
      
      // tmpDrift.x = 90 * 10 * 100 / 100 / 100 = 9
      // With speedDivider = 10: movement = 9/10 = 0.9
      expect(boat.loc.x).toBeGreaterThan(32000)
    })

    it('should combine velPoint and drift', () => {
      const boat = createBoatState({
        velPoint: { x: 50, y: 0 },
        quickProps: { Drift: 10, power: 100, ManoeuverAbility: 50 },
        wind: { x: 100, y: 0 },
        loc: { x: 32000, y: 24000 },
        speedDivider: 10
      })

      updatePositionWithDrift(boat)
      
      // Total movement = (velPoint + drift) / speedDivider
      // velPoint.x = 50, drift.x = 9, total = 59, /10 = 5.9
      expect(boat.loc.x).toBeCloseTo(32000 + 5.9, 0)
    })

    it('should divide by speedDivider', () => {
      const boat = createBoatState({
        velPoint: { x: 100, y: 0 },
        quickProps: { Drift: 0, power: 100, ManoeuverAbility: 50 }, // No drift
        wind: { x: 0, y: 0 },
        loc: { x: 32000, y: 24000 },
        speedDivider: 20 // Slower division
      })

      updatePositionWithDrift(boat)
      
      // movement = 100 / 20 = 5
      expect(boat.loc.x).toBe(32005)
    })
  })

  describe('Wave stability calculations - BoatBase.ls lines 400-440', () => {
    /**
     * Wave effects on boat inclination:
     * frontBack = stabilities[0] * waveInfo[1] / 17
     * side = stabilities[1] * waveInfo[2] / 100
     * 
     * With optional additional side force for sail boats
     */

    it('should calculate frontBack from stabilities[0] and wave pitch', () => {
      // BoatBase.ls line ~405:
      // frontBack = getAt(stabilities, 1) * getAt(tmp, 2) / 17
      const boat = createBoatState({
        stabilities: [85, 55]
      })
      
      const waveInfo = {
        altitude: 10,
        pitch: 34, // waveInfo[1] in Lingo = pitch
        roll: 50   // waveInfo[2] in Lingo = roll
      }

      const result = calculateInclinations(boat, waveInfo, 0)
      
      // frontBack = 85 * 34 / 17 = 170
      // Then /100 for final: 1.7
      expect(result.frontBack).toBeCloseTo(170, 0) // Before /100 scaling
    })

    it('should calculate side from stabilities[1] and wave roll', () => {
      // BoatBase.ls line ~415:
      // tmpSideAngle = stabilities[1] * waveInfo[2] / 100
      const boat = createBoatState({
        stabilities: [85, 55]
      })
      
      const waveInfo = {
        altitude: 10,
        pitch: 34,
        roll: 100
      }

      const result = calculateInclinations(boat, waveInfo, 0)
      
      // side = 55 * 100 / 100 = 55
      expect(result.side).toBeCloseTo(55, 0)
    })

    it('should apply additional side force for sail boats', () => {
      // BoatBase.ls line ~412-416:
      // if argAdditionalSideForce:
      //   tmpSideAngle = stabilities[1] * ((waveInfo[2] / 4) - (argAdditionalSideForce / 100)) / 100
      const boat = createBoatState({
        stabilities: [85, 55]
      })
      
      const waveInfo = {
        altitude: 10,
        pitch: 34,
        roll: 100
      }

      const additionalSideForce = 50
      const result = calculateInclinations(boat, waveInfo, additionalSideForce)
      
      // side = 55 * ((100/4) - (50/100)) / 100
      // side = 55 * (25 - 0.5) / 100 = 55 * 24.5 / 100 = 13.475
      expect(result.side).toBeCloseTo(13.475, 1)
    })

    it('should handle buffaSick modifications to frontBack', () => {
      // BoatBase.ls has special handling when buffaSick > certain thresholds
      // This affects the frontBack calculation
      const boat = createBoatState({
        stabilities: [85, 55],
        buffaSick: 150 // High seasickness
      })
      
      const waveInfo = {
        altitude: 10,
        pitch: 34,
        roll: 50
      }

      // With buffaSick, the motion should be amplified or modified
      const result = calculateInclinations(boat, waveInfo, 0)
      
      expect(result.frontBack).toBeDefined()
    })
  })

  describe('Inclination clamping - BoatBase.ls lines 420-430', () => {
    /**
     * BoatBase.ls clamps inclinations:
     * side = tmpSideAngle / 5
     * if abs(side) > 2: side = sign(side) * 2
     * if abs(frontBack) > 2: frontBack = sign(frontBack) * 2
     * inclinations = [side, frontBack]
     */

    it('should divide side by 5 before clamping', () => {
      // BoatBase.ls line ~420: side = tmpSideAngle / 5
      const result = clampInclinations(10, 0) // side=10, frontBack=0
      
      // 10 / 5 = 2
      expect(result.side).toBe(2)
    })

    it('should clamp side to [-2, 2]', () => {
      // BoatBase.ls line ~421-422:
      // if abs(side) > 2: side = abs(side)/side * 2
      
      // Test positive clamp
      let result = clampInclinations(15, 0) // 15/5 = 3 > 2
      expect(result.side).toBe(2)
      
      // Test negative clamp
      result = clampInclinations(-15, 0) // -15/5 = -3 < -2
      expect(result.side).toBe(-2)
    })

    it('should clamp frontBack to [-2, 2]', () => {
      // BoatBase.ls line ~423-424:
      // if abs(frontBack) > 2: frontBack = abs(frontBack)/frontBack * 2
      
      // Test positive clamp
      let result = clampInclinations(0, 5)
      expect(result.frontBack).toBe(2)
      
      // Test negative clamp
      result = clampInclinations(0, -5)
      expect(result.frontBack).toBe(-2)
    })

    it('should not modify values within limits', () => {
      // side=5 => 5/5 = 1 (within limits)
      // frontBack=1 (within limits)
      const result = clampInclinations(5, 1)
      
      expect(result.side).toBe(1)
      expect(result.frontBack).toBe(1)
    })

    it('should return inclinations array format', () => {
      // BoatBase.ls line ~425: inclinations = [side, frontBack]
      const result = clampInclinations(5, 1)
      
      expect(result.inclinations).toEqual([1, 1])
    })
  })

  describe('checkBounds', () => {
    /**
     * Boundary checking is straightforward - clamp to screen margins
     */

    it('should not modify position when in bounds', () => {
      const boat = createBoatState({
        loc: { x: 32000, y: 24000 } // Center of screen
      })
      
      checkBounds(boat)
      
      expect(boat.loc.x).toBe(32000)
      expect(boat.loc.y).toBe(24000)
      expect(boat.OutOfBounds).toBe(0)
    })

    it('should clamp x to left margin', () => {
      const boat = createBoatState({
        loc: { x: 0, y: 24000 }, // below x=10 in screen coords
        decimalPrec: 100
      })
      
      checkBounds(boat)
      
      expect(boat.loc.x).toBe(1000) // 10 * 100
      expect(boat.OutOfBounds).toBe(-1)
    })

    it('should clamp x to right margin', () => {
      const boat = createBoatState({
        loc: { x: 70000, y: 24000 }, // above x=630 in screen coords
        decimalPrec: 100
      })
      
      checkBounds(boat)
      
      expect(boat.loc.x).toBe(63000) // 630 * 100
      expect(boat.OutOfBounds).toBe(1)
    })

    it('should clamp y to top margin', () => {
      const boat = createBoatState({
        loc: { x: 32000, y: 0 }, // below y=10 in screen coords
        decimalPrec: 100
      })
      
      checkBounds(boat)
      
      expect(boat.loc.y).toBe(1000) // 10 * 100
      expect(boat.OutOfBounds).toBe(-2)
    })

    it('should clamp y to bottom margin', () => {
      const boat = createBoatState({
        loc: { x: 32000, y: 47000 }, // y=470 in screen coords
        decimalPrec: 100
      })
      
      checkBounds(boat)
      
      expect(boat.loc.y).toBe(38600) // 386 * 100
      expect(boat.OutOfBounds).toBe(2)
    })
  })

  describe('Direction correction', () => {
    /**
     * Direction must wrap around 1-16 range
     * BoatBase.ls uses correctDirection from drivingHandlers
     */

    it('should wrap direction from 0 to 16', () => {
      const boat = createBoatState({
        internalDirection: 0,
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 0, 0)
      
      // Direction 0 should wrap to 16
      expect(boat.direction).toBe(16)
    })

    it('should wrap direction from 17 to 1', () => {
      const boat = createBoatState({
        internalDirection: 1700, // direction = 17
        decimalPrec: 100
      })

      calcSpeedNDir(boat, 0, 0)
      
      // Direction 17 should wrap to 1
      expect(boat.direction).toBe(1)
    })
  })

  describe('velPoint calculation', () => {
    /**
     * BoatBase.ls line ~310:
     * velPoint = getVelPoint(direction) * speed / 100
     * 
     * Where getVelPoint looks up from DIRECTION_LIST
     */

    it('should calculate velPoint for East direction', () => {
      const boat = createBoatState({
        direction: 4, // East: x=100, y=0 in DIRECTION_LIST
        internalDirection: 400,
        speed: 50
      })

      calcSpeedNDir(boat, 50, 0)
      
      // velPoint = {100, 0} * speed / 100 = {speed, 0}
      expect(boat.velPoint.x).toBeCloseTo(boat.speed, 5)
      expect(boat.velPoint.y).toBe(0)
    })

    it('should calculate velPoint for South direction', () => {
      const boat = createBoatState({
        direction: 8, // South: x=0, y=100 in DIRECTION_LIST
        internalDirection: 800,
        speed: 100
      })

      calcSpeedNDir(boat, 100, 0)
      
      // velPoint = {0, 100} * speed / 100 = {0, speed}
      expect(boat.velPoint.x).toBe(0)
      expect(boat.velPoint.y).toBeCloseTo(boat.speed, 5)
    })

    it('should calculate velPoint for diagonal direction', () => {
      const boat = createBoatState({
        direction: 6, // SE: x=70, y=70 in DIRECTION_LIST
        internalDirection: 600,
        speed: 100
      })

      calcSpeedNDir(boat, 100, 0)
      
      // velPoint = {70, 70} * speed / 100 = {0.7*speed, 0.7*speed}
      const expected = boat.speed * 0.7
      expect(boat.velPoint.x).toBeCloseTo(expected, 5)
      expect(boat.velPoint.y).toBeCloseTo(expected, 5)
    })
  })
})
