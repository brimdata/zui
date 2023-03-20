/** @type {import('jest').Config} */
const config = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
  },
  setupFiles: ["./src/test/unit/setup/before-env.ts"],
  setupFilesAfterEnv: ["./src/test/unit/setup/after-env/index.ts"],
  globalSetup: "./src/test/unit/setup/global.ts",
  modulePaths: ["<rootDir>"],
  roots: ["./src"],
  maxWorkers: 4,
  testEnvironmentOptions: {
    url: "http://localhost/search.html",
  },
}

module.exports = config
