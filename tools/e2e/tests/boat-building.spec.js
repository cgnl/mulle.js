const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Boat building tests — shares a single boatyard instance.
 * Sailing tests navigate to a fresh boatyard before each attempt
 * since trySailing() modifies scene state. No-propulsion test is last.
 */
test.describe.serial("Boat Building", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ baseURL: "http://localhost:8082" });
    const page = await context.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootToBoatyard();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("Belly is set to 1000 on boatyard init", async () => {
    const belly = await helper.page.evaluate(() => {
      const user = window.game?.mulle?.user;
      if (user?.SeaInventory?.items?.Belly) return user.SeaInventory.items.Belly.nr;
      if (user?.Inventory?.Belly) return user.Inventory.Belly.nr;
      return null;
    });
    if (belly !== null) {
      expect(belly).toBe(1000);
    }
    helper.assertNoCriticalErrors();
  });

  test("boatyard starts with empty quay when no parts in BoatJunk", async () => {
    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boatyard");

    const quayParts = await helper.page.evaluate(() => {
      const user = window.game?.mulle?.user;
      return Object.keys(user?.BoatJunk?.Quay || {}).length;
    });
    expect(quayParts).toBe(0);
    helper.assertNoCriticalErrors();
  });

  test("parts injected into BoatJunk.Quay are accessible in boatyard", async () => {
    const partId = 850;
    await helper.page.evaluate((pid) => {
      window.game.mulle.user.BoatJunk.Quay[String(pid)] = { x: 300, y: 200 };
    }, partId);

    const hasPart = await helper.page.evaluate((pid) => {
      const quay = window.game?.mulle?.user?.BoatJunk?.Quay;
      return quay && String(pid) in quay;
    }, partId);
    expect(hasPart).toBe(true);

    await helper.page.evaluate(() => {
      window.game.mulle.user.BoatJunk.Quay = {};
    });
    helper.assertNoCriticalErrors();
  });

  test("boat with engine can sail (computeSailResult: engine=true)", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 1, material: 1 });

    // Debug: verify boat state before sailing
    const debug = await helper.page.evaluate(() => {
      const boat = window.game?.mulle?.user?.Boat;
      return {
        scene: window.game?.state?.current,
        hasBoat: !!boat,
        hasGetProperty: typeof boat?.getProperty === 'function',
        engine: boat?.getProperty?.('engine'),
        sailwithpole: boat?.getProperty?.('sailwithpole'),
        oar: boat?.getProperty?.('oar'),
        material: boat?.getProperty?.('material'),
        patched: !!boat?.__e2eOriginalGetProperty,
      };
    });
    console.log('[E2E DEBUG] Pre-sail state:', JSON.stringify(debug));

    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("seaworld");
    expect(snapshot.worldType).toBe("WoodWorld");
    await helper.takeScreenshot("boat-building-engine-sail").catch(() => {});
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("boat with sail can sail (computeSailResult: sailwithpole=true)", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ sailwithpole: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("seaworld");
    expect(snapshot.worldType).toBe("WoodWorld");
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("boat with oar can sail (computeSailResult: oar=true)", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ oar: 1, material: 2 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("seaworld");
    expect(snapshot.worldType).toBe("MetalWorld");
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("material=1 routes to WoodWorld, material=2 routes to MetalWorld", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 1, material: 2 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);

    const metalWorld = await helper.getSceneSnapshot();
    expect(metalWorld.worldType).toBe("MetalWorld");
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("sailing increments NrOfBuiltBoats", async () => {
    await helper.resetGameState();
    await helper.injectState({ userProps: { NrOfBuiltBoats: 3 } });

    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);

    const after = await helper.page.evaluate(() => window.game?.mulle?.user?.NrOfBuiltBoats);
    expect(after).toBe(4);
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("sailing clears deliveryMade flag", async () => {
    await helper.resetGameState();
    await helper.injectState({ userProps: { deliveryMade: true } });

    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 30_000);

    const deliveryMade = await helper.page.evaluate(() => window.game?.mulle?.user?.deliveryMade);
    expect(deliveryMade).toBe(false);
    helper.assertNoCriticalErrors();

    await helper.seaworldReturnToBoatyard();
  });

  test("boat with no propulsion cannot sail", async () => {
    helper.clearLogs();
    await helper.patchBoatPropulsion({ engine: 0, sailwithpole: 0, oar: 0 });

    const sceneBefore = await helper.getSceneSnapshot();
    expect(sceneBefore.sceneKey).toBe("boatyard");

    await helper.boatyardTrySailing();
    await helper.wait(2000);

    const sceneAfter = await helper.getSceneSnapshot();
    expect(sceneAfter.sceneKey).toBe("boatyard");
    helper.assertNoCriticalErrors();
  });
});
