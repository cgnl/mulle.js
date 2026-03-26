const { defineConfig } = require("@playwright/test");
module.exports = defineConfig({
  testDir: "./tests",
  timeout: 120_000,
  outputDir: "./test-results",
  workers: 1, // serial — tests share localStorage on the same origin
  use: {
    baseURL: "http://localhost:8082",
    screenshot: "only-on-failure", // was "on" — saves disk + RAM
    video: "retain-on-failure",
    // Lighter browser settings
    launchOptions: {
      args: [
        "--disable-gpu",              // no GPU compositing needed
        "--disable-dev-shm-usage",    // prevent /dev/shm exhaustion
        "--disable-extensions",
        "--no-sandbox",
        "--disable-background-timer-throttling",
        "--disable-backgrounding-occluded-windows",
        "--disable-renderer-backgrounding",
        "--js-flags=--max-old-space-size=256",  // limit V8 heap to 256MB
      ],
    },
  },
  projects: [{ name: "chromium", use: { browserName: "chromium" } }],
});
