module.exports = {
  name: "playwright",
  preset: "jest-playwright-preset",
  globalSetup: "<rootDir>/setup/global.ts",
  setupFilesAfterEnv: ["<rootDir>/setup/after-env.ts"],
  collectCoverageFrom: ["**/*.ts", "!**/test/**"],
  transformIgnorePatterns: ["node_modules", "packages"],
  reporters: ["default"],
  bail: 10,
  maxWorkers: 1,
  testTimeout: 60000
}
