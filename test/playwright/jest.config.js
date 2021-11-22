module.exports = {
  name: "playwright",
  preset: "jest-playwright-preset",
  globalSetup: "<rootDir>/setup/global.ts",
  setupFilesAfterEnv: ["<rootDir>/setup/after-env.ts"],
  collectCoverageFrom: ["**/*.ts", "!**/test/**"],
  reporters: ["default"],
  bail: 15,
  maxWorkers: 1,
  testTimeout: 40000
}
