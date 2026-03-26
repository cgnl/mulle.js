const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe("Yard → Boatyard Navigation", () => {
  test("navigates from yard to boatyard through world select without mouse input", async ({ page }) => {
    const game = new GameHelper(page);
    game.startListening();

    await game.bootToYard();
    await game.takeScreenshot("yard-before-boatyard");

    await game.yardToBoatyard();
    await game.takeScreenshot("boatyard-arrived");

    const snapshot = await game.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boatyard");
    expect(snapshot.activeWorld).toBe("scheepswerf");

    const logs = game.getConsoleLogs();
    expect(logs.some((l) => l.includes("[BoatAssets] Boat audio registered"))).toBe(true);
    expect(logs.some((l) => l.includes("[WorldSelect] Selected world: scheepswerf"))).toBe(true);

    game.assertNoCriticalErrors();
  });
});
