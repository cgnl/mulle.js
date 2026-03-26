const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Boatyard intent flow tests — shares a single boatyard instance.
 * Album test is last since album scene can't easily return to boatyard.
 */
test.describe.serial("Boatyard Intent Flows", () => {
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

  test("opens blueprint and returns to boatyard without mouse input", async () => {
    helper.clearLogs();
    await helper.boatyardOpenBlueprint();

    let snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("blueprint");

    await helper.blueprintReturnToBoatyard();

    snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boatyard");
    helper.assertNoCriticalErrors();
  });

  test("refuses sailing when the boat has no propulsion", async () => {
    helper.clearLogs();
    const before = await helper.getSceneSnapshot();

    await helper.patchBoatPropulsion({ engine: 0, sailwithpole: 0, oar: 0, material: 1 });
    await helper.boatyardTrySailing();
    await helper.wait(250);

    const after = await helper.getSceneSnapshot();
    expect(after.sceneKey).toBe("boatyard");
    expect(after.nrOfBuiltBoats).toBe(before.nrOfBuiltBoats);
    helper.assertNoCriticalErrors();
  });
});

// Fresh page to avoid state pollution from prior serial tests
test("opens album in load mode with the correct return target", async ({ browser }) => {
  const page = await browser.newPage();
  const helper = new GameHelper(page);
  helper.startListening();
  await helper.bootToBoatyard();

  await helper.boatyardOpenAlbum("load");

  const snapshot = await helper.getSceneSnapshot();
  expect(snapshot.sceneKey).toBe("album");
  const returnTo = snapshot.returnTo || await page.evaluate(() =>
    window.game?.mulle?.user?.WhereFrom
  );
  expect(returnTo).toMatch(/boatyard/i);
  await page.close();
});
