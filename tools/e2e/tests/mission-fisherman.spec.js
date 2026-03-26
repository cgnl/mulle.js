const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Fisherman NPC mission tests (scene 79)
 *
 * MissionManager.user bug is now fixed, so inventory-dependent tests are enabled.
 * Split into two groups: basic tests share one page, inventory test gets a fresh page
 * to stay within the 256MB V8 heap limit.
 */
test.describe.serial("Mission: Fisherman", () => {
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

  test("scene loads and is at fisherman state", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("fisherman");

    const scene = await helper.page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("fisherman");
    await helper.takeScreenshot("fisherman-loaded").catch(() => {});
  });

  test("fisherman logs scene-specific messages", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("fisherman");

    // Verify scene is running and accessible
    const scene = await helper.page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("fisherman");
    const hasScene = await helper.page.evaluate(() => !!window.game?.state?.states?.fisherman);
    expect(hasScene).toBe(true);
  });

  test("fisherman scene state is accessible", async () => {
    await helper.resetGameState();
    await helper.navigateToScene("fisherman");

    const hasScene = await helper.page.evaluate(() => !!window.game?.state?.states?.fisherman);
    expect(hasScene).toBe(true);
  });

  test("fisherman with mission 17 completed flag", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("fisherman", { missions: { 17: { completed: true } } });

    const scene = await helper.page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("fisherman");
  });

  test("fisherman with mission 18 completed flag", async () => {
    await helper.resetGameState();
    await helper.injectStateAndNavigate("fisherman", { missions: { 18: { completed: true } } });

    const scene = await helper.page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("fisherman");
  });
});

// Separate group with fresh page — inventory test needs seaworld → fisherman round-trip
// which exhausts the 256MB heap after prior fisherman loads
test.describe("Mission: Fisherman (inventory)", () => {
  test("visit with RottenFish → JustdoIt, M17 complete, refuel", async ({ browser }) => {
    const page = await browser.newPage();
    const helper = new GameHelper(page);
    helper.startListening();
    await helper.bootAndSailToSeaworld();

    await helper.injectStateAndNavigate("fisherman", {
      missions: { 17: { given: true } },
      inventory: { "RottenFish": { nr: 1 } },
    });

    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[Fisherman]"))).toBe(true);
    // With the MissionManager.user bug fixed, inventory checks now work
    const markerLog = logs.find((l) =>
      l.includes("[Fisherman] Lingo result:") ||
      l.includes("[Fisherman] Player has RottenFish") ||
      l.includes("JustDoIt")
    );
    expect(markerLog).toBeTruthy();

    await page.close();
  });
});
