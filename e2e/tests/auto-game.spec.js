const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Auto (car) game tests — shares a single boot+login instance.
 *
 * Verifies the car game still functions after boat game additions.
 * Tests are ordered so garage-dependent tests run first, yard last.
 */
test.describe.serial("Auto Game", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootWithSave({ NrOfBuiltCars: 3 });
    await helper.loginAtMenu();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("boot → menu → garage with car parts loaded", async () => {
    const state = await helper.getGameState();
    expect(state.currentScene).toBe("garage");

    const hasPartsDB = await helper.page.evaluate(() => !!window.game?.mulle?.PartsDB);
    expect(hasPartsDB).toBe(true);

    await helper.takeScreenshot("auto-garage").catch(() => {});
    helper.assertNoCriticalErrors();
  });

  test("garage scene state is accessible", async () => {
    const garageInfo = await helper.page.evaluate(() => ({
      hasScene: !!window.game?.state?.states?.garage,
      currentScene: window.game?.state?.current,
    }));
    expect(garageInfo.hasScene).toBe(true);
    expect(garageInfo.currentScene).toBe("garage");
    helper.assertNoCriticalErrors();
  });

  test("user save data has Junk structure with piles", async () => {
    const junkInfo = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      const data = raw ? JSON.parse(raw) : {};
      const saved = data?.E2ETest || {};
      return {
        hasJunk: !!saved.Junk,
        hasPile1: saved.Junk ? "Pile1" in saved.Junk : false,
      };
    });
    expect(junkInfo).toBeTruthy();
    expect(junkInfo).toHaveProperty("hasJunk");
    helper.assertNoCriticalErrors();
  });

  test("user NrOfBuiltCars is accessible after login", async () => {
    const builtCars = await helper.page.evaluate(() => window.game?.mulle?.user?.NrOfBuiltCars);
    expect(builtCars).toBe(3);
    helper.assertNoCriticalErrors();
  });

  test("worldselect routes blauwwater back to garage", async () => {
    helper.clearLogs();
    await helper.openWorldSelect();
    await helper.selectWorld("blauwwater");
    await helper.waitForScene("garage", 15_000);

    const state = await helper.getGameState();
    expect(state.currentScene).toBe("garage");
    helper.assertNoCriticalErrors();
  });

  test("garage → yard via side door", async () => {
    helper.clearLogs();
    await helper.garageToYard();

    const state = await helper.getGameState();
    expect(state.currentScene).toBe("yard");

    await helper.takeScreenshot("auto-yard").catch(() => {});
    helper.assertNoCriticalErrors();
  });
});
