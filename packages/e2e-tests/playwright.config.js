module.exports = {
  globalSetup: "./setup/global.ts",
  testDir: "./tests",
  browsers: [
    {
      name: "chromium",
      displayName: "Electron (chromium)"
    }
  ]
}
