const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe.serial("Sail after three tests", () => {
  let helper;
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ baseURL: "http://localhost:8082" });
    const page = await context.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootToBoatyard();
  });
  test.afterAll(async () => { await helper.page.close(); });

  test("check1", async () => {
    const s = await helper.getSceneSnapshot();
    expect(s.sceneKey).toBe("boatyard");
  });
  test("check2", async () => {
    const s = await helper.getSceneSnapshot();
    expect(s.sceneKey).toBe("boatyard");
  });
  test("check3", async () => {
    const s = await helper.getSceneSnapshot();
    expect(s.sceneKey).toBe("boatyard");
  });

  test("sail", async () => {
    await helper.patchBoatPropulsion({ engine: 1, material: 1 });
    await helper.boatyardTrySailing();
    await helper.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await helper.waitForScene("seaworld", 45_000);
    expect((await helper.getSceneSnapshot()).sceneKey).toBe("seaworld");
  });
});
