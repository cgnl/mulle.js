const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Game boot tests — shares a single boot for both tests.
 */
test.describe.serial("Game Boot", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await page.goto("/");
    await helper.waitForGameReady();
    await helper.waitForLoadComplete();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("Phaser initializes without critical errors", async () => {
    const booted = await helper.page.evaluate(() => window.game.isBooted);
    expect(booted).toBe(true);

    await helper.takeScreenshot("boot-phaser-ready").catch(() => {});
    await helper.takeScreenshot("boot-load-complete").catch(() => {});

    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[Load] Weather system initialized"))).toBe(true);
    expect(logs.some((l) => l.includes("[Load] Boat parts database initialized"))).toBe(true);

    helper.assertNoCriticalErrors();
  });

  test("game state is accessible after boot", async () => {
    const state = await helper.getGameState();
    expect(state.currentScene).toBeTruthy();

    await helper.takeScreenshot("boot-game-state").catch(() => {});
    helper.assertNoCriticalErrors();
  });
});
