const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe("Boatyard → Junk Pile Navigation", () => {
  test("navigates from boatyard to boat_junk scene through lingo intent handlers", async ({ page }) => {
    const game = new GameHelper(page);
    game.startListening();

    await game.bootToBoatyard();

    await game.takeScreenshot("boatyard-before-junk");

    await game.boatyardGoToJunk();

    await game.takeScreenshot("boat-junk-arrived");

    const snapshot = await game.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boat_junk");
    expect(snapshot.whereFrom).toBe("boatyard");

    const logs = game.getConsoleLogs();
    expect(logs.some((l) => l.includes("[BoatJunk] Spawned"))).toBe(true);

    game.assertNoCriticalErrors();
  });
});
