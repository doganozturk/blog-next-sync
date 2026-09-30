import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./test/browser",
  testMatch: "**/*.browser.ts",
  use: { baseURL: "http://127.0.0.1:8830" },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
  webServer: {
    command: "python3 -m http.server 8830 --bind 127.0.0.1 --directory out",
    url: "http://127.0.0.1:8830/en/",
    reuseExistingServer: !process.env.CI,
  },
});
