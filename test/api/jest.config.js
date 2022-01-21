module.exports = {
  name: "api",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  setupFilesAfterEnv: ["./setup/after-env.ts"],
  transformIgnorePatterns: ["node_modules", "packages"],
  maxWorkers: 1
}
