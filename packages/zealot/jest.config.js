/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  maxWorkers: 1,
  globals: {
    "ts-jest": {
      diagnostics: false
    }
  }
}
