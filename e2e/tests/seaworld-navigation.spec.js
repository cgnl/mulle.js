const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * SeaWorld navigation tests (scene 05)
 *
 * Shares a single game instance booted to seaworld. Tests that need
 * different configurations (MetalWorld, specific NrOfBuiltBoats) sail
 * again from boatyard after returning — still much faster than a full reboot.
 */
test.describe.serial("SeaWorld Navigation", () => {
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

  test("seaworld scene loads with correct world type", async () => {
    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("seaworld");
    expect(snapshot.worldType).toBe("WoodWorld");
    await helper.takeScreenshot("seaworld-loaded").catch(() => {});
    helper.assertNoCriticalErrors();
  });

  test("seaworld scene state object exists", async () => {
    const hasScene = await helper.page.evaluate(() => !!window.game?.state?.states?.seaworld);
    expect(hasScene).toBe(true);
    const current = await helper.page.evaluate(() => window.game?.state?.current);
    expect(current).toBe("seaworld");
    helper.assertNoCriticalErrors();
  });

  test("seaworld scene has accessible state properties", async () => {
    const props = await helper.page.evaluate(() => {
      const scene = window.game?.state?.states?.seaworld;
      return {
        exists: !!scene,
        hasGame: !!scene?.game,
        isRunning: window.game?.state?.current === "seaworld",
      };
    });
    expect(props.exists).toBe(true);
    expect(props.hasGame).toBe(true);
    expect(props.isRunning).toBe(true);
    helper.assertNoCriticalErrors();
  });

  test("seaworld → boatyard return works", async () => {
    helper.clearLogs();
    await helper.seaworldReturnToBoatyard();
    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boatyard");
    helper.assertNoCriticalErrors();
  });

  test("seaworld scene shuts down cleanly on return", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForScene("seaworld", 30_000);
    await helper.seaworldReturnToBoatyard();

    const logs = helper.getConsoleLogs();
    expect(logs.some((l) => l.includes("[SeaWorld] Scene shutdown"))).toBe(true);
    helper.assertNoCriticalErrors();
  });

  test("MetalWorld is used when material=2", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 1, material: 2 });
    await helper.boatyardTrySailing();
    await helper.waitForScene("seaworld", 30_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.worldType).toBe("MetalWorld");
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("NrOfBuiltBoats incremented after sailing", async () => {
    await helper.resetGameState();
    await helper.injectState({ userProps: { NrOfBuiltBoats: 2 } });

    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForScene("seaworld", 30_000);

    const boatsAfter = await helper.page.evaluate(() => window.game?.mulle?.user?.NrOfBuiltBoats);
    expect(boatsAfter).toBe(3);
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("sail round trip preserves user state", async () => {
    await helper.resetGameState();
    await helper.injectState({ userProps: { NrOfBuiltBoats: 4 } });

    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForScene("seaworld", 30_000);

    await helper.seaworldReturnToBoatyard();

    const boats = await helper.page.evaluate(() => window.game?.mulle?.user?.NrOfBuiltBoats);
    expect(boats).toBe(5);
    helper.assertNoCriticalErrors();
  });
});
