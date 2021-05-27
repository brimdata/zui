module.exports = {
  globals: {
    "ts-jest": {
      babelConfig: true
    }
  },
  setupFilesAfterEnv: ["./setup/after-env.ts"],
  maxWorkers: 1
}
