const {join} = require("path")

module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  rootDir: join(__dirname, "../../"),
  setupFilesAfterEnv: ["./test/unit/setup/after-env/index.ts"],
  testURL: "http://localhost/search.html",
  roots: ["<rootDir>/test/unit", "<rootDir>"],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  globalSetup: "./test/unit/setup/global.ts",
  transformIgnorePatterns: ["node_modules"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/itest/",
    "/dist/",
    "<rootDir>/test/api/"
  ]
}
