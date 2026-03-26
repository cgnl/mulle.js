const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * World select tests — shares a single boot+login instance.
 * Each test modifies user properties and navigates to worldselect.
 */
test.describe.serial("World Select", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootWithSave();
    await helper.loginAtMenu();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("keeps locked scheepswerf on worldselect and logs the lock warning", async () => {
    helper.clearLogs();
    // Wait for garage create() to finish — waitForScene resolves before create completes
    await helper.page.waitForFunction(
      () => {
        const scene = window.game?.state?.states?.garage;
        return window.game?.state?.current === "garage" && !!scene?.door_side;
      },
      { timeout: 15_000 }
    );
    await helper.page.evaluate(() => {
      window.game.mulle.user.scheepswerfUnlocked = false;
      window.game.mulle.user.seenZeeIntro = false;
    });
    await helper.openWorldSelect();

    await helper.callCurrentSceneMethod("showLockedMessage");
    await helper.wait(100);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("worldselect");
    expect(
      helper.getConsoleLogs().some((l) =>
        l.includes("[WorldSelect] Scheepswerf is still locked!")
      )
    ).toBe(true);

    helper.assertNoCriticalErrors();
  });

  test("routes first unlocked scheepswerf visit to zee_intro", async () => {
    helper.clearLogs();
    await helper.page.evaluate(() => {
      window.game.mulle.user.scheepswerfUnlocked = true;
      window.game.mulle.user.seenZeeIntro = false;
    });
    await helper.openWorldSelect();

    await helper.selectWorld("scheepswerf");
    await helper.waitForScene("zee_intro", 20_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("zee_intro");
    expect(snapshot.activeWorld).toBe("scheepswerf");
    expect(
      helper.getConsoleLogs().some((l) =>
        l.includes("[WorldSelect] Selected world: scheepswerf")
      )
    ).toBe(true);

    helper.assertNoCriticalErrors();
  });

  test("routes returning scheepswerf players directly to boatyard", async () => {
    helper.clearLogs();
    await helper.page.evaluate(() => {
      window.game.mulle.user.scheepswerfUnlocked = true;
      window.game.mulle.user.seenZeeIntro = true;
    });
    await helper.openWorldSelect();

    await helper.selectWorld("scheepswerf");
    await helper.waitForScene("boatyard", 45_000);
    await helper.waitForConsoleMessage("[BoatAssets] Boat audio registered", 30_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boatyard");
    expect(snapshot.activeWorld).toBe("scheepswerf");

    helper.assertNoCriticalErrors();
  });

  test("routes blauwwater selection back to garage", async () => {
    helper.clearLogs();
    await helper.openWorldSelect();

    await helper.selectWorld("blauwwater");
    await helper.waitForScene("garage", 15_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("garage");
    expect(snapshot.activeWorld).toBe("blauwwater");

    helper.assertNoCriticalErrors();
  });
});
