
const AmbienceSound = require('../ambiencesound').default;

describe('AmbienceSound Strict Parity Tests (Lingo Fidelity)', () => {
    let ambienceSound;
    let mockGame;
    let mockAudio;
    let mockSoundInstance;

    beforeEach(() => {
        // Mock Sound Instance
        mockSoundInstance = {
            play: jest.fn(),
            stop: jest.fn(),
            pause: jest.fn(),
            resume: jest.fn(),
            restart: jest.fn(),
            isPlaying: false,
            paused: true,
            volume: 1.0,
            loop: false
        };

        // Mock Game/Mulle/Audio
        mockAudio = {
            'Pack1': {
                sounds: {
                    'Snd1': { extraData: { dirName: 'WaveSm' } },
                    'Snd2': { extraData: { dirName: 'Vatten' } },
                    'Snd3': { extraData: { dirName: '05e043v0' } }, // Wind
                    'Snd4': { extraData: { dirName: 'OneWave2' } }
                }
            }
        };

        mockGame = {
            mulle: {
                audio: mockAudio,
                playAudio: jest.fn().mockReturnValue({ ...mockSoundInstance }), // Return new instance copy
                loopMaster: { addObject: jest.fn(), deleteObject: jest.fn() }
            }
        };

        ambienceSound = new AmbienceSound(mockGame);
    });

    /**
     * Lingo: Helper to mimic Lingo behavior
     */
    const activate = () => {
        ambienceSound.activate(true);
        // Manually set IDs if initSounds logic is complex to mock fully, 
        // but here we mocked resolveFirstAvailableSound via playAudio mocks
    };

    /**
     * Lingo: selectWaterSound (Lines 133-167)
     * Speed < 20% -> Waves
     * Speed >= 20% -> Stem
     */
    test('WATER: Should switch to Waves when speed < 20%', () => {
        activate();

        // Mock Boat Speed 10% (60/600)
        const mockBoat = { speed: 60, maxSpeed: 600 };

        // Ensure starting in Stem mode to force switch
        ambienceSound.mode = 'Stem';
        // Mock stem playing
        ambienceSound.stemWaterID = { ...mockSoundInstance, isPlaying: true };
        ambienceSound.wavesID = { ...mockSoundInstance, isPlaying: false, paused: true };

        ambienceSound.loop(mockBoat, {});

        // Expect switch to waves
        expect(ambienceSound.mode).toBe('waves');
        expect(ambienceSound.stemWaterID.pause).toHaveBeenCalled();
        expect(ambienceSound.wavesID.resume).toHaveBeenCalled();
    });

    test('WATER: Should switch to Stem when speed >= 20%', () => {
        activate();

        // Mock Boat Speed 30% (180/600)
        const mockBoat = { speed: 180, maxSpeed: 600 };

        // Ensure starting in Waves mode
        ambienceSound.mode = 'waves';
        ambienceSound.wavesID = { ...mockSoundInstance, isPlaying: true };
        ambienceSound.stemWaterID = { ...mockSoundInstance, isPlaying: false, paused: true };

        ambienceSound.loop(mockBoat, {});

        // Expect switch to Stem
        expect(ambienceSound.mode).toBe('Stem');
        expect(ambienceSound.wavesID.pause).toHaveBeenCalled();
        expect(ambienceSound.stemWaterID.resume).toHaveBeenCalled();
    });

    /**
     * Lingo: loop / selectWaterSound interaction with OKToPlayDouble
     * Logic: If Wind > 150 (Wind Playing) AND NOT OKToPlayDouble
     * Then do NOT start water sound if it would add to channels.
     */
    test('CHANNEL: Should NOT switch water sound if Wind playing and !OKToPlayDouble', () => {
        activate();
        ambienceSound.OKToPlayDouble = false;

        // 1. Start Wind
        const mockWeather = { windSpeed: 200 }; // > 150
        // We need to simulate wind starting
        ambienceSound.windID = { ...mockSoundInstance, isPlaying: false, paused: true };

        // Run loop to start wind
        ambienceSound.loop({ speed: 0 }, mockWeather);
        expect(ambienceSound.isPlaying(ambienceSound.windID)).toBe(true);

        // 2. Now try to switch water mode (e.g. to Stem)
        // Boat speed high
        const mockBoat = { speed: 500, maxSpeed: 600 };
        ambienceSound.mode = 'waves'; // Needs switch

        // Clear previous calls
        if (ambienceSound.stemWaterID) ambienceSound.stemWaterID.resume.mockClear();

        // Run loop
        ambienceSound.loop(mockBoat, mockWeather);

        // Lingo logic: if wind playing & !OKToPlayDouble -> exit selectWaterSound
        // JS logic currently: switches anyway (Gap identified)

        // We expect strict parity: NO switch if blocked
        // If the JS is NOT fixed yet, this test might fail or show the gap.
        // For now, let's asserting strict parity behavior.

        // If strict parity, mode should REMAIN 'waves' and stem shouldn't start
        // But since we know JS has a gap, we might expect this to FAIL currently.
        // I will write the test to EXPECT FAILURE (detect bug) or expect Correct Behavior and fix code.
        // Implementation Plan says "Verify", implies Step 4 is Refactor.
        // So I expect this to fail or I will fix it.

        // NOTE: In Lingo, if !OKToPlayDouble, Wind logic (lines 96-110) handles stopping others.
        // Then selectWaterSound (lines 137, 152) checks again.

        // If we are in 'waves' and want 'Stem': 
        // Lingo line 152: if getPos(..., windID) then if not OKToPlayDouble then exit.

        // So YES, it should exit.
        expect(ambienceSound.mode).toBe('waves'); // Should not have switched
    });

});
