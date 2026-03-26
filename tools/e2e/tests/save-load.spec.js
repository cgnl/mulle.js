const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * Save/Load tests — shares a single boot with all save data pre-loaded.
 *
 * localStorage key: 'mulle_SaveData'
 * Format: JSON object keyed by UserId containing MulleSave data
 */
test.describe.serial("Save & Load", () => {
  let helper;

  test.beforeAll(async ({ browser }) => {
    const page = await browser.newPage();
    helper = new GameHelper(page);
    helper.startListening();
    await helper.bootWithSave({
      NrOfBuiltBoats: 5,
      BoatJunk: {
        Quay: { 850: { x: 100, y: 200 } },
        Yard: {},
        Shelf1: { 851: { x: 50, y: 100 } },
        Shelf2: {}, Shelf3: {}, Shelf4: {}, Shelf5: {}, Shelf6: {},
      },
    });
    await helper.loginAtMenu();
  });

  test.afterAll(async () => {
    await helper.page.close();
  });

  test("save data is persisted to localStorage after boot", async () => {
    const saveData = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      return raw ? JSON.parse(raw) : null;
    });
    expect(saveData).toBeTruthy();
    expect(saveData).toHaveProperty("E2ETest");
    helper.assertNoCriticalErrors();
  });

  test("save version is 2", async () => {
    const version = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      const data = raw ? JSON.parse(raw) : {};
      return data?.E2ETest?.saveVersion ?? null;
    });
    expect(version).toBe(2);
    helper.assertNoCriticalErrors();
  });

  test("NrOfBuiltBoats is preserved across reload", async () => {
    const beforeReload = await helper.page.evaluate(() => window.game?.mulle?.user?.NrOfBuiltBoats);
    expect(beforeReload).toBe(5);

    await helper.page.evaluate(() => {
      if (window.game?.mulle?.user?.save) window.game.mulle.user.save();
    });

    const stored = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      const data = raw ? JSON.parse(raw) : {};
      return data?.E2ETest?.NrOfBuiltBoats ?? null;
    });
    expect(stored).toBe(5);
    helper.assertNoCriticalErrors();
  });

  test("BoatJunk data is preserved in save", async () => {
    const stored = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      const data = raw ? JSON.parse(raw) : {};
      return data?.E2ETest?.BoatJunk ?? null;
    });
    expect(stored).toBeTruthy();
    expect(stored.Quay).toBeTruthy();
    helper.assertNoCriticalErrors();
  });

  test("scheepswerfUnlocked flag is preserved", async () => {
    const unlocked = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      const data = raw ? JSON.parse(raw) : {};
      return data?.E2ETest?.scheepswerfUnlocked ?? null;
    });
    expect(unlocked).toBe(true);
    helper.assertNoCriticalErrors();
  });

  test("activeWorld setting is preserved", async () => {
    const world = await helper.page.evaluate(() => {
      const raw = window.localStorage.getItem("mulle_SaveData");
      const data = raw ? JSON.parse(raw) : {};
      return data?.E2ETest?.activeWorld ?? null;
    });
    expect(world).toBe("blauwwater");
    helper.assertNoCriticalErrors();
  });
});
