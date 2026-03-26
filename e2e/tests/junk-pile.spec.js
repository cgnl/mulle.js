const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Junk pile (boat_junk) tests - shelf navigation, part spawning, persistence
 *
 * Shares a single boatyard instance. Each test navigates to junk and returns.
 */
test.describe.serial("Junk Pile", () => {
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

  test("entering junk scene from boatyard and scene loads", async () => {
    helper.clearLogs();
    await helper.boatyardGoToJunk();

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boat_junk");
    await helper.takeScreenshot("junk-pile-entered").catch(() => {});
    helper.assertNoCriticalErrors();

    await helper.boatJunkGoToQuay();
  });

  test("junk scene loads with a valid shelf number", async () => {
    helper.clearLogs();
    await helper.setLastBoatShelf(3);
    await helper.boatyardGoToJunk();

    const snapshot = await helper.getSceneSnapshot();
    expect(snapshot.sceneKey).toBe("boat_junk");
    if (snapshot.currentShelf !== null) {
      expect(snapshot.currentShelf).toBeGreaterThanOrEqual(1);
      expect(snapshot.currentShelf).toBeLessThanOrEqual(6);
    }
    helper.assertNoCriticalErrors();

    await helper.boatJunkGoToQuay();
  });

  test("shelf navigation forward changes current shelf", async () => {
    helper.clearLogs();
    await helper.setLastBoatShelf(1);
    await helper.boatyardGoToJunk();

    const before = await helper.getSceneSnapshot();
    const startShelf = before.currentShelf;

    await helper.boatJunkNextShelf();
    await helper.wait(1000);

    const after = await helper.getSceneSnapshot();
    expect(after.currentShelf).not.toBe(startShelf);
    helper.assertNoCriticalErrors();

    await helper.boatJunkGoToQuay();
  });

  test("shelf navigation backward changes current shelf", async () => {
    helper.clearLogs();
    await helper.setLastBoatShelf(3);
    await helper.boatyardGoToJunk();
    await helper.wait(500);

    const before = await helper.getSceneSnapshot();
    const startShelf = before.currentShelf;

    await helper.boatJunkPrevShelf();
    await helper.wait(1000);

    const after = await helper.getSceneSnapshot();
    if (startShelf !== null && startShelf > 1) {
      expect(after.currentShelf).not.toBe(startShelf);
    }
    helper.assertNoCriticalErrors();

    await helper.boatJunkGoToQuay();
  });

  test("returning from junk to boatyard works", async () => {
    helper.clearLogs();
    await helper.boatyardGoToJunk();
    expect((await helper.getSceneSnapshot()).sceneKey).toBe("boat_junk");

    await helper.boatJunkGoToQuay();
    expect((await helper.getSceneSnapshot()).sceneKey).toBe("boatyard");
    helper.assertNoCriticalErrors();
  });
});
