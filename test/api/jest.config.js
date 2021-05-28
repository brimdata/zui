module.exports = {
  name: "api",
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  setupFilesAfterEnv: ["./setup/after-env.ts"],
  maxWorkers: 1
}
