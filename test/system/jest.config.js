const {join} = require("path")

module.exports = {
  name: "system",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  maxWorkers: 1,
  rootDir: join(__dirname, "../../"),
  testURL: "http://localhost/search.html",
  roots: ["<rootDir>/test/shared", "<rootDir>/test/system"],
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFilesAfterEnv: ["./test/system/setup/after-env.ts"],
  setupFiles: ["@testing-library/react/dont-cleanup-after-each"]
}
