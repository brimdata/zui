const {join} = require("path")

module.exports = {
  name: "unit",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  rootDir: join(__dirname, "../../"),
  setupFiles: ["./test/unit/setup/before-env.ts"],
  setupFilesAfterEnv: ["./test/unit/setup/after-env/index.ts"],
  testURL: "http://localhost/search.html",
  roots: ["<rootDir>/test/shared", "<rootDir>"],
  globalSetup: "./test/unit/setup/global.ts",
  transformIgnorePatterns: ["node_modules", "packages"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/itest/",
    "/dist/",
    "/test/system/",
    "<rootDir>/test/api/",
    "<rootDir>/test/playwright/",
    "/packages/"
  ]
}
