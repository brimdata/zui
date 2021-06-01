module.exports = {
  name: "integration",
  globalSetup: "<rootDir>/setup/global.ts",
  setupFilesAfterEnv: ["<rootDir>/setup/after-env.ts"],
  collectCoverageFrom: ["**/*.ts", "!**/test/**"],
  reporters: ["default", "jest-junit"],
  testTimeout: 300000,
  bail: 10,
  maxWorkers: 1
}
