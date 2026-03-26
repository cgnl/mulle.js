const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Scene transition tests — split into two serial groups:
 *   1. Early navigation: boot → login → garage → yard (2 tests, 1 boot)
 *   2. Boatyard navigation: all transitions from boatyard (8 tests, 1 boot)
 */
test.describe("Scene Transitions", () => {
  test.describe.serial("Early navigation", () => {
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

    test("menu → garage (via login)", async () => {
      const state = await helper.getGameState();
      expect(state.currentScene).toBe("garage");
      helper.assertNoCriticalErrors();
    });

    test("garage → yard (via side door)", async () => {
      helper.clearLogs();
      await helper.garageToYard();
      const state = await helper.getGameState();
      expect(state.currentScene).toBe("yard");
      helper.assertNoCriticalErrors();
    });
  });

  test.describe.serial("Boatyard navigation", () => {
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

    test("yard → worldselect → boatyard", async () => {
      helper.clearLogs();
      await helper.navigateToScene("yard");
      await helper.ensureScheepswerfUnlocked();
      await helper.openWorldSelect();
      await helper.selectWorld("scheepswerf");
      await helper.waitForScene("boatyard", 45_000);
      const state = await helper.getSceneSnapshot();
      expect(state.sceneKey).toBe("boatyard");
      helper.assertNoCriticalErrors();
    });

    test("boatyard → boat_junk → boatyard (round trip)", async () => {
      helper.clearLogs();
      await helper.boatyardGoToJunk();
      expect((await helper.getSceneSnapshot()).sceneKey).toBe("boat_junk");

      await helper.boatJunkGoToQuay();
      expect((await helper.getSceneSnapshot()).sceneKey).toBe("boatyard");
      helper.assertNoCriticalErrors();
    });

    test("boatyard → blueprint → boatyard (round trip)", async () => {
      helper.clearLogs();
      await helper.boatyardOpenBlueprint();
      expect((await helper.getSceneSnapshot()).sceneKey).toBe("blueprint");

      await helper.blueprintReturnToBoatyard();
      expect((await helper.getSceneSnapshot()).sceneKey).toBe("boatyard");
      helper.assertNoCriticalErrors();
    });

    test("boatyard → seaworld (via sailing)", async () => {
      helper.clearLogs();
      await helper.patchBoatPropulsion({ engine: 1, material: 1 });
      await helper.boatyardTrySailing();
      await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
      await helper.waitForScene("seaworld", 30_000);

      expect((await helper.getSceneSnapshot()).sceneKey).toBe("seaworld");
      helper.assertNoCriticalErrors();

      await helper.seaworldReturnToBoatyard();
    });

    test("seaworld → boatyard (return)", async () => {
      helper.clearLogs();
      await helper.patchBoatPropulsion({ engine: 1, material: 2 });
      await helper.boatyardTrySailing();
      await helper.waitForScene("seaworld", 30_000);

      await helper.seaworldReturnToBoatyard();
      expect((await helper.getSceneSnapshot()).sceneKey).toBe("boatyard");
      helper.assertNoCriticalErrors(["Boat is not seaworthy"]);
    });

    test("boatyard → seaworld → boatyard preserves state", async () => {
      await helper.resetGameState();
      await helper.injectState({ userProps: { NrOfBuiltBoats: 5 } });

      await helper.patchBoatPropulsion({ engine: 1, material: 1 });
      await helper.boatyardTrySailing();
      await helper.waitForScene("seaworld", 30_000);

      await helper.seaworldReturnToBoatyard();

      const afterReturn = await helper.page.evaluate(() => window.game?.mulle?.user?.NrOfBuiltBoats);
      expect(afterReturn).toBe(6);
      helper.assertNoCriticalErrors();
    });

  });

  // These tests get fresh pages to avoid state pollution from prior serial tests

  test("seaworld → NPC scene (birgitbeach) via direct start", async ({ browser }) => {
    const page = await browser.newPage();
    const helper = new GameHelper(page);
    helper.startListening();
    await helper.bootToBoatyard();

    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForScene("seaworld", 30_000);

    await helper.navigateToScene("birgitbeach");

    const scene = await page.evaluate(() => window.game?.state?.current);
    expect(scene).toBe("birgitbeach");
    helper.assertNoCriticalErrors(["get image fail", "Failed to load resource", "Searched keys:", "Found dirFiles:"]);
    await page.close();
  });

  test("boatyard → album (load mode) transitions to album", async ({ browser }) => {
    const page = await browser.newPage();
    const helper = new GameHelper(page);
    helper.startListening();
    await helper.bootToBoatyard();

    await helper.boatyardOpenAlbum("load");
    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("album");
    await page.close();
  });
});
