const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

test("debug fisherman RottenFish", async ({ page }) => {
  const helper = new GameHelper(page);
  helper.startListening();
  await helper.bootAndSailToSeaworld();

  helper.clearLogs();
  await helper.injectStateAndNavigate("fisherman", {
    missions: { 17: { given: true } },
    inventory: { "RottenFish": { nr: 1 } },
  });

  const logs = helper.getConsoleLogs();
  const errors = helper.getConsoleErrors();
  const fishLogs = logs.filter(l => l.includes("[Fisherman]"));
  console.log("Scene:", await page.evaluate(() => window.game?.state?.current));
  console.log("Fisherman logs:", JSON.stringify(fishLogs));
  console.log("All logs count:", logs.length);
  console.log("Errors:", errors.length, errors.slice(0, 3).map(e => e.substring(0, 120)));
  console.log("Override consumed?", await page.evaluate(() => !window.__e2eStateOverride));

  expect(fishLogs.length).toBeGreaterThan(0);
});
