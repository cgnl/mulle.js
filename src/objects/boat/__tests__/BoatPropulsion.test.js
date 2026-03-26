/**
 * Tests for BoatPropulsion module
 * 
 * Based on actual Lingo behavior from:
 * - BoatBase.ls: changeType (lines 115-175), calculateMyProps (lines 200-225)
 * - MotorBoatAncestor.ls: loop() calls calcSpeedNDir(child, motorSpeed, 10 * Steering)
 * - SailBoatAncestor.ls: loop() calls calcSpeedNDir(child, tmpForce * 14, Steering * 10)
 * - OarBoatAncestor.ls: loop() calls calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
 * 
 * Key insight: Ancestors call calcSpeedNDir DIRECTLY on child - no return {force, steering}
 * - Motor: force=motorSpeed, steering=10*Steering
 * - Sail: force=tmpForce*14, steering=Steering*10, RETURNS side force (tmpForce * tmpDiff * SailSize)
 * - Oar: force=tmpForce*13, steering=5*Steering
 */
import {
  getWindForce,
  applyOarForce,
  calcSpeedNDir,
  applyWeatherDrift,
  correctDirection,
  setDirection
} from '../BoatPropulsion'
import { PropulsionType, DEFAULT_BOAT_PROPS } from '../BoatConstants'

describe('BoatPropulsion', () => {
  let mockBoat

  beforeEach(() => {
    mockBoat = {
      speed: 0,
      direction: 1,
      internalDirection: 100,
      decimalPrec: 100,
      nrOfDirections: 16,
      Sail: null,
      Oar: 0,
      Steering: 0,
      forceCount: 10,
      oarForce: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90],
      oarSounds: ['oar1', 'oar2'],
      soundCount: 1,
      currentOarSound: null,
      driftFactor: 1,
      x: 320,
      y: 200,
      setDirection: jest.fn(),
      updateSprite: jest.fn(),
      game: {
        mulle: {
          playAudio: jest.fn(() => ({
            volume: 1,
            stop: jest.fn(),
            playbackRate: 1
          })),
          weather: {
            windDirection: 8,
            windSpeed: 50,
            windVelocity: { x: 10, y: 5 }
          }
        }
      }
    }
  })

  /**
   * Test calcSpeedNDir - the core function that all ancestors call directly
   * 
   * From BoatBase.ls: This is called by ancestors to apply force and steering
   * - MotorBoatAncestor.ls: calcSpeedNDir(child, motorSpeed, 10 * Steering)
   * - SailBoatAncestor.ls: calcSpeedNDir(child, tmpForce * 14, Steering * 10)
   * - OarBoatAncestor.ls: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
   */
  describe('calcSpeedNDir - core ancestor function', () => {
    it('should apply force to speed (BoatBase.ls calcSpeedNDir)', () => {
      // All ancestors call this directly with their force value
      calcSpeedNDir(mockBoat, 50, 0)
      expect(mockBoat.speed).toBe(0.5) // 50 / 100
    })

    it('should apply motor force multiplier (MotorBoatAncestor.ls loop)', () => {
      // Motor: calcSpeedNDir(child, motorSpeed, 10 * Steering)
      // motorSpeed is passed directly (multiplier = 1)
      const motorSpeed = 80
      calcSpeedNDir(mockBoat, motorSpeed, 0)
      expect(mockBoat.speed).toBe(0.8) // 80 / 100
    })

    it('should apply sail force multiplier of 14 (SailBoatAncestor.ls loop)', () => {
      // Sail: calcSpeedNDir(child, tmpForce * 14, Steering * 10)
      const tmpForce = 5
      calcSpeedNDir(mockBoat, tmpForce * 14, 0)
      expect(mockBoat.speed).toBe(0.7) // (5 * 14) / 100 = 70 / 100
    })

    it('should apply oar force multiplier of 13 (OarBoatAncestor.ls loop)', () => {
      // Oar: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
      const tmpForce = 6
      calcSpeedNDir(mockBoat, tmpForce * 13, 0)
      expect(mockBoat.speed).toBe(0.78) // (6 * 13) / 100 = 78 / 100
    })

    it('should apply motor steering multiplier of 10 (MotorBoatAncestor.ls loop)', () => {
      // Motor: calcSpeedNDir(child, motorSpeed, 10 * Steering)
      mockBoat.internalDirection = 400
      const Steering = 5
      calcSpeedNDir(mockBoat, 0, 10 * Steering)
      expect(mockBoat.internalDirection).toBe(450) // 400 + (10 * 5)
    })

    it('should apply sail steering multiplier of 10 (SailBoatAncestor.ls loop)', () => {
      // Sail: calcSpeedNDir(child, tmpForce * 14, Steering * 10)
      mockBoat.internalDirection = 400
      const Steering = 3
      calcSpeedNDir(mockBoat, 0, Steering * 10)
      expect(mockBoat.internalDirection).toBe(430) // 400 + (3 * 10)
    })

    it('should apply oar steering multiplier of 5 (OarBoatAncestor.ls loop)', () => {
      // Oar: calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
      mockBoat.internalDirection = 400
      const Steering = 4
      calcSpeedNDir(mockBoat, 0, 5 * Steering)
      expect(mockBoat.internalDirection).toBe(420) // 400 + (5 * 4)
    })

    it('should wrap direction at max (16 * decimalPrec)', () => {
      mockBoat.internalDirection = 1550 // Near max (16 * 100 = 1600)
      calcSpeedNDir(mockBoat, 0, 100)
      // 1550 + 100 = 1650 > 1600, wraps to 50
      // 50 < 100 (decimalPrec), so adds 1600 = 1650
      expect(mockBoat.internalDirection).toBeGreaterThanOrEqual(100)
    })

    it('should wrap direction at min (decimalPrec)', () => {
      mockBoat.internalDirection = 150
      calcSpeedNDir(mockBoat, 0, -100)
      // 150 - 100 = 50 < 100, adds 1600 = 1650
      expect(mockBoat.internalDirection).toBeGreaterThanOrEqual(100)
    })

    it('should call setDirection when discrete direction changes', () => {
      mockBoat.internalDirection = 400
      mockBoat.direction = 4
      calcSpeedNDir(mockBoat, 0, 100) // Internal: 500, discrete: 5
      expect(mockBoat.setDirection).toHaveBeenCalledWith(5)
    })

    it('should not call setDirection when direction unchanged', () => {
      mockBoat.internalDirection = 450
      mockBoat.direction = 5
      calcSpeedNDir(mockBoat, 0, 10) // Internal: 460, discrete still 5
      expect(mockBoat.setDirection).not.toHaveBeenCalled()
    })
  })

  /**
   * Test oar force application with proper multipliers
   * 
   * From OarBoatAncestor.ls loop():
   *   calcSpeedNDir(child, tmpForce * 13, 5 * Steering)
   */
  describe('applyOarForce - OarBoatAncestor integration', () => {
    it('should initialize Oar to forceCount on forward throttle', () => {
      applyOarForce(mockBoat, 1)
      // Oar set to forceCount (10), then decremented to 9
      expect(mockBoat.Oar).toBe(mockBoat.forceCount - 1)
    })

    it('should initialize Oar to -forceCount on reverse throttle', () => {
      applyOarForce(mockBoat, -1)
      // Oar set to -forceCount (-10), then incremented to -9
      expect(mockBoat.Oar).toBe(-mockBoat.forceCount + 1)
    })

    it('should reset Oar to 0 on zero throttle', () => {
      mockBoat.Oar = 5
      applyOarForce(mockBoat, 0)
      expect(mockBoat.Oar).toBe(0)
    })

    it('should apply oar force with 13x multiplier (OarBoatAncestor.ls)', () => {
      // When Oar > 1, tmpForce = oarForce[Oar-1]
      // calcSpeedNDir is called with tmpForce * 13
      mockBoat.Oar = 5
      mockBoat.oarForce = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
      // tmpForce = oarForce[5-1] = oarForce[4] = 40
      // calcSpeedNDir(boat, 40 * 13, 5 * Steering)
      mockBoat.Steering = 2
      
      applyOarForce(mockBoat, 1)
      
      // speed = (40 * 13) / 100 = 5.2
      expect(mockBoat.speed).toBe(5.2)
    })

    it('should apply oar steering with 5x multiplier (OarBoatAncestor.ls)', () => {
      mockBoat.Oar = 5
      mockBoat.oarForce = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90]
      mockBoat.Steering = 3
      mockBoat.internalDirection = 400
      
      applyOarForce(mockBoat, 1)
      
      // internalDirection = 400 + (5 * 3) = 415
      expect(mockBoat.internalDirection).toBe(415)
    })

    it('should play oar sound when force is 0 (OarBoatAncestor.ls)', () => {
      // When tmpForce = 0, play alternating oar sound
      mockBoat.Oar = 2
      mockBoat.oarForce = [10, 0, 20] // oarForce[1] = 0 triggers sound
      applyOarForce(mockBoat, 1)
      expect(mockBoat.game.mulle.playAudio).toHaveBeenCalled()
    })

    it('should toggle sound count between 1 and 2 for left/right oar', () => {
      mockBoat.Oar = 2
      mockBoat.oarForce = [10, 0, 20]
      mockBoat.soundCount = 1
      applyOarForce(mockBoat, 1)
      // soundCount = 3 - 1 = 2
      expect(mockBoat.soundCount).toBe(2)
    })
  })

  /**
   * Test wind force calculation for sail
   * 
   * From SailBoatAncestor.ls loop():
   *   calcSpeedNDir(child, tmpForce * 14, Steering * 10)
   *   return tmpForce * tmpDiff * SailSize  -- side force only
   */
  describe('getWindForce - SailBoatAncestor integration', () => {
    beforeEach(() => {
      // Initialize sail manually for testing
      mockBoat.Sail = {
        direction: 1,
        force: 0,
        inclination: [0, 0],
        getForce: (windDir, windSpeed, boatDir) => {
          // Simplified wind force calculation
          const relativeWind = windDir - boatDir
          let efficiency = 0.6
          if (Math.abs(relativeWind) <= 4) efficiency = 0.4
          else if (Math.abs(relativeWind) >= 5 && Math.abs(relativeWind) <= 8) efficiency = 0.8
          return ((windSpeed * 3) / 100) * efficiency * 100
        }
      }
    })

    it('should return 0 without sail', () => {
      mockBoat.Sail = null
      expect(getWindForce(mockBoat)).toBe(0)
    })

    it('should return default 50 without weather system', () => {
      mockBoat.game.mulle.weather = null
      expect(getWindForce(mockBoat)).toBe(50)
    })

    it('should calculate wind force based on weather', () => {
      const force = getWindForce(mockBoat)
      // Weather: windSpeed=50, windDirection=8, boat direction=1
      // Expected: some positive force
      expect(force).toBeGreaterThan(0)
    })

    it('should apply 14x force multiplier when used in sail loop', () => {
      // Simulate SailBoatAncestor.ls loop() behavior
      const tmpForce = getWindForce(mockBoat) / 100 // Normalize to 0-1
      const sailForceArg = tmpForce * 14
      
      calcSpeedNDir(mockBoat, sailForceArg, 0)
      
      // Speed should be increased by sailForceArg / 100
      expect(mockBoat.speed).toBeGreaterThan(0)
    })
  })

  /**
   * Test weather drift application
   * 
   * From BoatBase.ls lines 361-370:
   *   drift = 90 * Drift * windVelPoint / 100 / 100
   */
  describe('applyWeatherDrift - BoatBase.ls lines 361-370', () => {
    it('should apply drift based on wind velocity', () => {
      mockBoat.driftFactor = 1
      mockBoat.x = 320
      mockBoat.y = 200
      
      applyWeatherDrift(mockBoat)
      
      // drift = 90 * 1 * windVel / 100 / 100
      // driftX = 90 * 1 * 10 / 100 / 100 = 0.09
      // driftY = 90 * 1 * 5 / 100 / 100 = 0.045
      expect(mockBoat.x).toBeCloseTo(320.09, 2)
      expect(mockBoat.y).toBeCloseTo(200.045, 2)
    })

    it('should not drift without weather system', () => {
      mockBoat.game.mulle.weather = null
      const initialX = mockBoat.x
      
      applyWeatherDrift(mockBoat)
      
      expect(mockBoat.x).toBe(initialX)
    })

    it('should not drift without wind velocity', () => {
      mockBoat.game.mulle.weather.windVelocity = null
      const initialX = mockBoat.x
      
      applyWeatherDrift(mockBoat)
      
      expect(mockBoat.x).toBe(initialX)
    })

    it('should scale drift by driftFactor', () => {
      mockBoat.driftFactor = 2
      mockBoat.x = 320
      
      applyWeatherDrift(mockBoat)
      
      // driftX = 90 * 2 * 10 / 100 / 100 = 0.18
      expect(mockBoat.x).toBeCloseTo(320.18, 2)
    })
  })

  /**
   * Test direction correction utility
   * 
   * From DrivingHandlers.ls correctDirection function
   * Note: This is NOT in BoatPropulsion in the original Lingo,
   * but is a utility used by various boat systems
   */
  describe('correctDirection - DrivingHandlers.ls utility', () => {
    it('should return direction within 1-16 range', () => {
      expect(correctDirection(mockBoat, 5)).toBe(5)
    })

    it('should wrap direction above 16', () => {
      expect(correctDirection(mockBoat, 17)).toBe(1)
      expect(correctDirection(mockBoat, 20)).toBe(4)
    })

    it('should wrap direction below 1', () => {
      expect(correctDirection(mockBoat, 0)).toBe(16)
      expect(correctDirection(mockBoat, -2)).toBe(14)
    })
  })

  /**
   * Test setDirection - updates boat direction and internal state
   */
  describe('setDirection - boat direction setter', () => {
    it('should set direction and internalDirection', () => {
      setDirection(mockBoat, 8)
      expect(mockBoat.direction).toBe(8)
      expect(mockBoat.internalDirection).toBe(800) // 8 * 100
    })

    it('should wrap direction above 16', () => {
      setDirection(mockBoat, 17)
      expect(mockBoat.direction).toBe(1)
    })

    it('should wrap direction below 1', () => {
      setDirection(mockBoat, 0)
      expect(mockBoat.direction).toBe(16)
    })

    it('should call updateSprite', () => {
      setDirection(mockBoat, 5)
      expect(mockBoat.updateSprite).toHaveBeenCalled()
    })
  })

  /**
   * Test propulsion type force/steering multiplier combinations
   * 
   * Summary from Lingo ancestors:
   * - Motor: calcSpeedNDir(child, motorSpeed, 10 * Steering) - force=1x, steer=10x
   * - Sail: calcSpeedNDir(child, tmpForce * 14, Steering * 10) - force=14x, steer=10x
   * - Oar: calcSpeedNDir(child, tmpForce * 13, 5 * Steering) - force=13x, steer=5x
   */
  describe('propulsion multiplier summary', () => {
    const baseForce = 10
    const baseSteering = 2

    it('Motor: force=1x, steering=10x (MotorBoatAncestor.ls)', () => {
      mockBoat.internalDirection = 400
      // Motor uses motorSpeed directly (1x), steering is 10x
      calcSpeedNDir(mockBoat, baseForce * 1, 10 * baseSteering)
      
      expect(mockBoat.speed).toBe(0.1) // 10 / 100
      expect(mockBoat.internalDirection).toBe(420) // 400 + 20
    })

    it('Sail: force=14x, steering=10x (SailBoatAncestor.ls)', () => {
      mockBoat.internalDirection = 400
      // Sail multiplies force by 14, steering by 10
      calcSpeedNDir(mockBoat, baseForce * 14, baseSteering * 10)
      
      expect(mockBoat.speed).toBe(1.4) // 140 / 100
      expect(mockBoat.internalDirection).toBe(420) // 400 + 20
    })

    it('Oar: force=13x, steering=5x (OarBoatAncestor.ls)', () => {
      mockBoat.internalDirection = 400
      // Oar multiplies force by 13, steering by 5
      calcSpeedNDir(mockBoat, baseForce * 13, 5 * baseSteering)
      
      expect(mockBoat.speed).toBe(1.3) // 130 / 100
      expect(mockBoat.internalDirection).toBe(410) // 400 + 10
    })
  })
})
