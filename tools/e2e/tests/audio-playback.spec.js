const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Audio playback tests — shares a single boatyard instance.
 * Non-sailing tests first, sailing tests last (trySailing modifies scene state).
 */
test.describe.serial("Audio Playback", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootToBoatyard();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("Phaser sound system is initialized after boot", async () => {
    const hasSoundManager = await helper.page.evaluate(() => !!window.game?.sound);
    expect(hasSoundManager).toBe(true);
    helper.assertNoCriticalErrors();
  });

  test("boat audio assets are registered in boatyard", async () => {
    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[BoatAssets] Boat audio registered"))).toBe(true);
    helper.assertNoCriticalErrors();
  });

  test("no critical audio errors during boot", async () => {
    const audioErrors = helper.getConsoleErrors().filter((e) =>
      e.toLowerCase().includes("audio") ||
      e.toLowerCase().includes("decodeaudiodata")
    );
    const criticalAudioErrors = audioErrors.filter((e) =>
      !e.includes("NotAllowedError") &&
      !e.includes("user gesture") &&
      !e.includes("autoplay")
    );
    expect(criticalAudioErrors).toEqual([]);
    helper.assertNoCriticalErrors();
  });

  test("sound manager has expected properties", async () => {
    const soundInfo = await helper.page.evaluate(() => ({
      hasSoundManager: !!window.game?.sound,
      hasContext: !!window.game?.sound?.context,
      usingWebAudio: window.game?.sound?.usingWebAudio ?? null,
    }));
    expect(soundInfo.hasSoundManager).toBe(true);
    expect(typeof soundInfo.usingWebAudio === "boolean" || soundInfo.usingWebAudio === null).toBe(true);
    helper.assertNoCriticalErrors();
  });

  test("seaworld scene loads without audio crashes", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("full boot-to-seaworld-return has no critical errors", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 1, material: 2 });
    await helper.boatyardTrySailing();
    await helper.waitForScene("seaworld", 30_000);
    await helper.seaworldReturnToBoatyard();
    helper.assertNoCriticalErrors();
  });
});
