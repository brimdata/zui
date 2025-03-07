// https://github.com/gravitational/teleport/issues/33810
const needsToBeTransformed = [
  "bullet",
  "@reduxjs/toolkit",
  "immer",
  "redux",
  "lodash-es",
  "when-clause",
].join("|")

export default {
  transform: {"^.+\\.(t|j)sx?$": "@swc/jest"},
  transformIgnorePatterns: [`/node_modules/(?!${needsToBeTransformed})`],
  setupFilesAfterEnv: ["./src/test/unit/setup/after-env.ts"],
  globalSetup: "./src/test/unit/setup/global.ts",
  maxWorkers: 4,
  moduleNameMapper: {
    "^src/(.*)$": "<rootDir>/src/$1",
    "@brimdata/sample-data": "<rootDir>../../packages/sample-data/index.js",
    "superdb-types": "<rootDir>../../packages/zed-js/src/index.ts",
    "superdb-node-client": "<rootDir>../../packages/zed-node/src/index.ts",
  },
}
