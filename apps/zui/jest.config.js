const {pathsToModuleNameMapper} = require("ts-jest")
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const config = require("../../tsconfig.base")

const moduleNameMapper = pathsToModuleNameMapper(config.compilerOptions.paths, {
  prefix: "<rootDir>/../../",
})

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
  moduleNameMapper,
}
