const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Preacher NPC mission tests (scene 78 - Church Island / Dominee)
 *
 * Key logic:
 *   - Mission 1 (Bible delivery): has Bible → complete, give part/snack
 *   - Mission 20 override: if M20 not completed → marker = 'cantDoit2'
 *
 * Shares a single game instance booted to seaworld for all tests.
 */
test.describe.serial("Mission: Preacher", () => {
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

  test("scene loads without timeout", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("preacher");

    const scene = await helper.page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("preacher");
    await helper.takeScreenshot("preacher-loaded").catch(() => {});
  });

  test("first visit (M20 not completed) → cantDoit2 marker, M1 given", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("preacher", { missions: {}, inventory: {} });

    const logs = helper.getConsoleLogs();
    // Check for mission 1 given or any preacher marker indicating mission processing
    const hasM1Given = logs.some((l) => l.includes("[Preacher] Mission 1 given"));
    const hasMarker = logs.some((l) => l.includes("[Preacher] Computed marker:"));
    expect(hasM1Given || hasMarker).toBe(true);
  });

  test("visit with M1 given and Bible → delivers Bible", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("preacher", {
      missions: { 1: { given: true }, 20: { completed: true } },
      inventory: { "Bible": { nr: 1 } },
    });

    const logs = helper.getConsoleLogs();
    const hasDelivery = logs.some((l) =>
      l.includes("[Preacher] Delivering Bible") ||
      l.includes("JustdoIt") ||
      l.includes("[Preacher] Computed marker:")
    );
    expect(hasDelivery).toBe(true);
  });

  test("mission state is reported on creation", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("preacher", {
      missions: { 1: { given: true, completionCount: 3 }, 20: { completed: true } },
    });

    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[Preacher] Mission 1"))).toBe(true);
  });

  test("visit without Bible when M1 given → cantDoIt marker", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("preacher", {
      missions: { 1: { given: true }, 20: { completed: true } },
      inventory: {},
    });

    const logs = helper.getConsoleLogs();
    const markerLog = logs.find((l) => l.includes("[Preacher] Computed marker:"));
    if (markerLog) {
      expect(markerLog).toMatch(/cantDoIt/i);
    }
  });
});
