const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe("Sailing", () => {
  test("launches into seaworld via real boatyard logic", async ({ page }) => {
    const game = new GameHelper(page);
    game.startListening();

    await game.bootToBoatyard();

    await game.takeScreenshot("boatyard-before-sailing");

    await game.patchBoatPropulsion({ engine: 1, material: 2 });
    const before = await game.getSceneSnapshot();

    await game.boatyardTrySailing();
    await game.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await game.waitForScene("seaworld", 30_000);

    await game.takeScreenshot("seaworld-launched");

    const duringSailing = await game.getSceneSnapshot();
    expect(duringSailing.sceneKey).toBe("seaworld");
    expect(duringSailing.worldType).toBe("MetalWorld");
    expect(duringSailing.nrOfBuiltBoats).toBe((before.nrOfBuiltBoats || 0) + 1);

    await game.seaworldReturnToBoatyard();

    const afterReturn = await game.getSceneSnapshot();
    expect(afterReturn.sceneKey).toBe("boatyard");
    expect(
      game.getConsoleLogs().some((l) => l.includes("[SeaWorld] Returning to boatyard"))
    ).toBe(true);

    game.assertNoCriticalErrors();
  });
});
