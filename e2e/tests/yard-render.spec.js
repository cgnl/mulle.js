const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe("Yard Render Parity", () => {
  test("renders the full 04.DXR background for member 145", async ({ page }) => {
    const game = new GameHelper(page);

    await game.bootToYard();

    const resolved = await game.getDirectorImageInfo("04.DXR", 145);
    expect(resolved).toBeTruthy();
    expect(resolved.key).toBe("yard-sprites-0");
    expect(resolved.dirName).toBe("04b001v0");
    expect(resolved.width).toBe(640);
    expect(resolved.height).toBe(480);

    const background = await game.getYardBackgroundInfo();
    expect(background).toBeTruthy();
    expect(background.key).toBe("yard-sprites-0");
    expect(background.dirName).toBe("04b001v0");
    expect(background.width).toBe(640);
    expect(background.height).toBe(480);
    expect(background.x).toBe(320);
    expect(background.y).toBe(240);

    game.assertNoCriticalErrors();
  });
});
