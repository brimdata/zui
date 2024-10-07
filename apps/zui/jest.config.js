const {pathsToModuleNameMapper} = require("ts-jest")
// In the following statement, replace `./tsconfig` with the path to your `tsconfig` file
// which contains the path mapping (ie the `compilerOptions.paths` option):
const config = require("../../tsconfig.base")

const moduleNameMapper = pathsToModuleNameMapper(config.compilerOptions.paths, {
  prefix: "<rootDir>/../../",
})

const esModules = [
  "bullet",
  "@reduxjs/toolkit",
  "immer",
  "redux",
  "lodash-es",
  "when-clause",
].join("|")
// https://github.com/gravitational/teleport/issues/33810

module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"],
    ".+\\.(css|styl|less|sass|scss)$": "jest-css-modules-transform",
  },
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  setupFiles: ["./src/test/unit/setup/before-env.ts"],
  setupFilesAfterEnv: ["./src/test/unit/setup/after-env.ts"],
  testEnvironmentOptions: {
    testURL: "http://localhost:4567/?name=search&id=test-1",
  },
  globalSetup: "./src/test/unit/setup/global.ts",
  modulePaths: ["<rootDir>"],
  roots: ["./src"],
  maxWorkers: 4,
  moduleNameMapper,
}
