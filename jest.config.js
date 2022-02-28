module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },
  setupFiles: ["./src/test/unit/setup/before-env.ts"],
  setupFilesAfterEnv: ["./src/test/unit/setup/after-env/index.ts"],
  testURL: "http://localhost/search.html",
  globalSetup: "./src/test/unit/setup/global.ts",
  modulePaths: ["<rootDir>"],
  roots: ["./src"]
}
