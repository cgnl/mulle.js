const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Boat junk shelf tests — shares a single boatyard instance.
 */
test.describe.serial("Boat Junk Shelves", () => {
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

  test("restores the saved shelf and supports non-mouse shelf navigation", async () => {
    helper.clearLogs();
    await helper.setLastBoatShelf(4);
    await helper.boatyardGoToJunk();

    let snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boat_junk");
    expect(snapshot.currentShelf).toBe(4);

    await helper.boatJunkNextShelf();
    snapshot = await helper.getSceneSnapshot();
    expect(snapshot.currentShelf).toBe(5);

    await helper.boatJunkPrevShelf();
    snapshot = await helper.getSceneSnapshot();
    expect(snapshot.currentShelf).toBe(4);

    helper.assertNoCriticalErrors();
    await helper.boatJunkGoToQuay();
  });

  test("spawns deterministically seeded parts on the requested shelf", async () => {
    helper.clearLogs();

    const partId = await helper.findSeedableBoatPartId();
    expect(partId).not.toBeNull();

    await helper.seedBoatJunkShelf(3, {
      [String(partId)]: { x: 220, y: 110 },
    });
    await helper.setLastBoatShelf(3);
    await helper.boatyardGoToJunk();

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boat_junk");
    expect(snapshot.currentShelf).toBe(3);
    expect(snapshot.junkPartCount).toBe(1);
    expect(
      helper.getConsoleLogs().some((l) =>
        l.includes("[BoatJunk] Spawned 1 parts for Shelf 3")
      )
    ).toBe(true);

    helper.assertNoCriticalErrors();
    await helper.boatJunkGoToQuay();
  });
});
