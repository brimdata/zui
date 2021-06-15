const {join} = require("path")

module.exports = {
  name: "unit",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  rootDir: join(__dirname, "../../"),
  setupFilesAfterEnv: ["./test/unit/setup/after-env/index.ts"],
  testURL: "http://localhost/search.html",
  roots: ["<rootDir>/test/unit", "<rootDir>"],
  globalSetup: "./test/unit/setup/global.ts",
  transformIgnorePatterns: ["node_modules"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/itest/",
    "/dist/",
    "<rootDir>/test/api/",
    "<rootDir>/test/integration/"
  ]
}
