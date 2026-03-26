const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test.describe("Full Gameplay Loop", () => {
  test("boot → login → garage → yard → boatyard → junk → quay → sail", async ({ page }) => {
    const game = new GameHelper(page);
    game.startListening();

    // ── Step 1: Boot with deterministic save data ──
    await game.bootWithSave();
    await game.takeScreenshot("loop-01-boot");

    // ── Step 2: Login at menu without pixel clicks ──
    await game.loginAtMenu();
    await game.takeScreenshot("loop-02-garage");

    const garageState = await game.getGameState();
    expect(garageState.currentScene).toBe("garage");

    // ── Step 3: Garage → Yard ──
    await game.garageToYard();
    await game.takeScreenshot("loop-03-yard");

    const yardState = await game.getGameState();
    expect(yardState.currentScene).toBe("yard");

    // ── Step 4: Yard → WorldSelect → Boatyard ──
    await game.wait(500);
    await game.yardToBoatyard();
    await game.takeScreenshot("loop-04-boatyard");

    const boatyardState = await game.getSceneSnapshot();
    expect(boatyardState.sceneKey).toBe("boatyard");
    expect(boatyardState.activeWorld).toBe("scheepswerf");

    // ── Step 5: Boatyard → Junk Pile ──
    await game.boatyardGoToJunk();
    await game.takeScreenshot("loop-05-junk");

    // ── Step 6: Junk → Quay ──
    await game.boatJunkGoToQuay();
    await game.takeScreenshot("loop-06-boatyard-return");

    // ── Step 7: Sail via real boatyard logic ──
    await game.patchBoatPropulsion({ engine: 1, material: 1 });
    await game.boatyardTrySailing();
    await game.waitForConsoleMessage("[Boatyard] Going sailing!", 10_000);
    await game.waitForScene("seaworld", 20_000);
    await game.takeScreenshot("loop-07-seaworld");
    await game.wait(250);

    // ── Verify: zero critical console errors throughout ──
    game.assertNoCriticalErrors();
  });
});
