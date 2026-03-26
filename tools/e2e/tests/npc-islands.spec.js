const { test, expect } = require("@playwright/test");
const { GameHelper } = require("../helpers/game-helper");

/**
 * NPC Island scene loading tests
 *
 * Scene key mapping (from game.js):
 *   birgitbeach (77), preacher (78), fisherman (79), lighthouse (80),
 *   surfbeach (81), mia (83), george (84), showboat (76)
 *
 * Each scene gets its own page to stay within the 256MB V8 heap limit —
 * NPC scene spritesheets accumulate and can't be reclaimed within a page.
 */
const scenes = [
  ["Birgit", "birgitbeach", 77],
  ["Fisherman", "fisherman", 79],
  ["Preacher", "preacher", 78],
  ["George", "george", 84],
  ["Lighthouse", "lighthouse", 80],
  ["Surfer", "surfbeach", 81],
  ["Mia", "mia", 83],
  ["ShowBoat", "showboat", 76],
];

test.describe("NPC Islands", () => {
  for (const [name, sceneName, num] of scenes) {
    test(`${name} scene (${num}) loads`, async ({ browser }) => {
      const page = await browser.newPage();
      const helper = new GameHelper(page);
      helper.startListening();
      await helper.bootAndSailToSeaworld();

      await page.evaluate((s) => window.game.state.start(s), sceneName);
      await helper.waitForScene(sceneName, 60_000);
      await helper.wait(2000);

      const scene = await page.evaluate(() => window.game?.state?.current);
      expect(scene).toBe(sceneName);

      await helper.takeScreenshot(`npc-${name.toLowerCase()}`).catch(() => {});
      await page.close();
    });
  }
});
