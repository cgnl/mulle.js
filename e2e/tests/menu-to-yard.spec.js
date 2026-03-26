const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe("Menu → Yard Navigation", () => {
  test("logs in without mouse input and reaches yard through the side door", async ({ page }) => {
    const game = new GameHelper(page);
    game.startListening();

    await game.bootWithSave();

    await game.takeScreenshot("menu-loaded");

    await game.loginAtMenu();
    await game.takeScreenshot("garage-after-login");

    const garageState = await game.getGameState();
    expect(garageState.currentScene).toBe("garage");

    await game.garageToYard();
    await game.takeScreenshot("yard-arrived");

    const snapshot = await game.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("yard");

    game.assertNoCriticalErrors();
  });
});
