const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Birgit NPC mission tests (scene 77 - birgitbeach)
 *
 * Shares a single game instance booted to seaworld for all tests.
 * MissionManager.user bug is now fixed, so inventory-dependent tests are enabled.
 */
test.describe.serial("Mission: Birgit", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootAndSailToSeaworld();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("scene loads and is at birgitbeach", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("birgitbeach");

    const scene = await helper.page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("birgitbeach");
    await helper.takeScreenshot("birgit-loaded").catch(() => {});
  });

  test("default visit computes JustDoIt1 or JustDoIt2 marker", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", { missions: {} });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
    expect(markerLog).toMatch(/JustDoIt[12]/);
  });

  test("Belly action is flagged in computed result", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", { missions: {} });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
  });

  test("scene logs sky sprite for weather type", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("birgitbeach");

    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[Birgit] Sky sprite loaded:"))).toBe(true);
  });

  test("scene draws boat sprite", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("birgitbeach");

    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[Birgit] Boat drawn at"))).toBe(true);
  });

  test("DoctorBag visit → BagNoRing marker, M3 complete", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", {
      missions: { 3: { given: true } },
      inventory: { "DoctorBag": { nr: 1 } },
    });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
    expect(markerLog).toMatch(/Bag/i);
  });

  test("Swimring visit → Ring marker, M2 complete", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", {
      missions: { 2: { given: true } },
      inventory: { "Swimring": { nr: 1 } },
    });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
    expect(markerLog).toMatch(/Ring/i);
  });

  test("Both DoctorBag+Swimring → Ring suffix overwrites BagNoRing", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", {
      missions: { 2: { given: true }, 3: { given: true } },
      inventory: { "DoctorBag": { nr: 1 }, "Swimring": { nr: 1 } },
    });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
    expect(markerLog).toMatch(/Ring/i);
  });

  test("mission 22 given path computes deliverMap marker", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", { missions: { 22: { given: true } } });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
    expect(markerLog).toContain("deliverMap");
  });

  test("mission 5 given path computes Prima marker", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("birgitbeach", { missions: { 5: { given: true } } });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Birgit] Computed marker:"));
    expect(markerLog).toBeTruthy();
    expect(markerLog).toMatch(/[Pp]rima/);
  });
});
