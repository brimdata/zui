module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  setupFiles: ["./src/test/unit/setup/before-env.ts"],
  setupFilesAfterEnv: ["./src/test/unit/setup/after-env.ts"],
  testEnvironmentOptions: {
    testURL: "http://localhost:3000/?name=search&id=test-1",
  },
  globalSetup: "./src/test/unit/setup/global.ts",
  modulePaths: ["<rootDir>"],
  roots: ["./src"],
  maxWorkers: 4,
}
